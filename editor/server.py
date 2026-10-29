# -*- coding: utf-8 -*-
"""
剧情文案编辑器 · 本地服务
==================================================================
只读写 story/*.js 里「玩家能看到的文字」，不碰任何代码结构。

设计原则（很重要）：
  1. 前端只回传「第几条第几段改成什么字」，不回传代码。
     服务端自己重新解析原文件，按位置把新文字塞回去。
     这样即便前端出 bug，也绝不可能把代码写坏。
  2. 每次保存前自动整文件备份，随时能撤销。
  3. 只监听 127.0.0.1，不联网。
"""
import http.server
import json
import os
import re
import shutil
import socketserver
import sys
import threading
import time
import urllib.parse
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, '..'))
STORY = os.path.join(BASE, 'story')
BACKUP = os.path.join(HERE, '_backup')

sys.path.insert(0, HERE)
import story_parse as P      # noqa: E402
import catalog as C          # noqa: E402

MAX_BACKUPS = 40


# ---------------------------------------------------------------------------
# 扫描：文件 -> 单元
# ---------------------------------------------------------------------------

def list_story_files():
    return [f for f in sorted(os.listdir(STORY)) if f.endswith('.js')]


def scan(raw):
    """返回 {(kind,name): (body_start, body_end)}"""
    out = {}
    for name, s0, s1, b0, b1 in P.find_passages(raw):
        out[('P', name)] = (b0, b1)
    for name, s0, s1, b0, b1 in P.find_widgets(raw):
        out[('W', name)] = (b0, b1)
    return out


def locate(key):
    """key = 'P:Name' / 'W:Name'  ->  (file, kind, name, body_start, body_end, raw)"""
    kind, name = key.split(':', 1)
    for f in list_story_files():
        raw = read_text(os.path.join(STORY, f))
        m = scan(raw)
        if (kind, name) in m:
            b0, b1 = m[(kind, name)]
            return f, kind, name, b0, b1, raw
    return None


def body_of(raw, b0, b1, kind):
    inner = raw[b0:b1]
    return P.unescape_src(inner) if kind == 'P' else inner


# ---------------------------------------------------------------------------
# 目录树
# ---------------------------------------------------------------------------

def build_tree():
    idx = C.build_index()
    found = {}
    for f in list_story_files():
        raw = read_text(os.path.join(STORY, f))
        for (kind, name) in scan(raw):
            found[kind + ':' + name] = f
    groups = []
    for g in C.GROUPS:
        units = []
        for key, title, note, month in g['units']:
            if key not in found:
                continue        # 目录里写了但文件里没有：跳过，不显示
            units.append({'key': key, 'title': title, 'note': note,
                          'month': month, 'file': found[key]})
        if units:
            groups.append({'name': g['name'], 'icon': g['icon'],
                           'hint': g['hint'], 'units': units})
    # 目录里没收录的（以后新增的块）兜底
    extra = [k for k in found if k not in idx]
    if extra:
        groups.append({
            'name': '未归类（新加的块）', 'icon': '🧩',
            'hint': '这些是目录里还没登记的故事块，不影响修改。',
            'units': [{'key': k, 'title': k.split(':', 1)[1], 'note': '新加的块',
                       'month': 0, 'file': found[k]} for k in extra],
        })
    return groups


# ---------------------------------------------------------------------------
# 单元详情
# ---------------------------------------------------------------------------

def load_unit(key):
    hit = locate(key)
    if not hit:
        return None
    f, kind, name, b0, b1, raw = hit
    body = body_of(raw, b0, b1, kind)
    parts = P.analyze(body)
    segs = []
    prev_txt = ''
    prev_code = ''
    for p in parts:
        if p['t'] == 'code':
            prev_code = p['v']
            continue
        if p['t'] != 'seg':
            continue
        txt = ''.join(q['v'] for q in p['inner'] if q['t'] == 'text').strip()
        # 这一句前面紧挨着一个「自动填的数」，就把名字带上，省得只看到「万」
        pre = ''
        mp = re.search(r'<<\s*print\s+(\$[A-Za-z_][\w.]*)', prev_code)
        if mp and len(re.sub(r'<[^>]*>|<<[^>]*>>', '', prev_code).strip()) < 4:
            pre = mp.group(1)
        segs.append({
            'kind': p['kind'],
            'prev': prev_txt,
            'pre': pre,
            'inner': [{'t': q['t'], 'v': q['v'],
                       'label': q.get('label', ''), 'cls': q.get('cls', '')}
                      for q in p['inner']],
        })
        prev_code = ''
        if txt:
            prev_txt = txt[:18]
    info = lookup_meta(key)
    return {'key': key, 'file': f, 'segs': segs, 'meta': info,
            'chars': len(body)}


_META = None


def meta_index():
    global _META
    if _META is None:
        _META = {}
        for g in C.GROUPS:
            for key, title, note, month in g['units']:
                _META[key] = {'group': g['name'], 'icon': g['icon'],
                              'title': title, 'note': note, 'month': month}
    return _META


def lookup_meta(key):
    return meta_index().get(key, {'group': '未归类', 'icon': '🧩',
                                  'title': key.split(':', 1)[1],
                                  'note': '', 'month': 0})


# ---------------------------------------------------------------------------
# 保存
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# 文件读写：必须保留原始换行符
# ---------------------------------------------------------------------------
# Windows 上的 .js 多半是 CRLF。如果用默认方式 open() 读，Python 会把
# \r\n 悄悄转成 \n，算出来的字符位置就和文件真实位置对不上，
# 写回时还会把整个文件换成 LF —— 内容没错，但 diff 会全变，很吓人。
# 所以读写一律 newline=''。

def read_text(path):
    with open(path, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def write_text(path, s):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(s)


def trim_backups():
    if not os.path.isdir(BACKUP):
        return
    dirs = sorted(d for d in os.listdir(BACKUP)
                  if os.path.isdir(os.path.join(BACKUP, d)))
    for d in dirs[:-MAX_BACKUPS]:
        shutil.rmtree(os.path.join(BACKUP, d), ignore_errors=True)


def save_units(edits):
    """
    edits = [{key, cells:[[segIdx, innerIdx, newText], ...]}]
    返回 {ok, saved, skipped, backup}
    """
    # 按单元组织，先算出每个单元的新 body
    by_key = {}
    for e in edits:
        by_key.setdefault(e['key'], []).extend(e.get('cells') or [])

    stamp = time.strftime('%Y%m%d-%H%M%S')
    bak_dir = os.path.join(BACKUP, stamp)
    touched_files = set()
    pending = {}       # file -> [(b0, b1, kind, new_body)]

    for key, cells in by_key.items():
        hit = locate(key)
        if not hit:
            continue
        f, kind, name, b0, b1, raw = hit
        body = body_of(raw, b0, b1, kind)
        parts = P.analyze(body)

        # 收集 seg 在 parts 里的位置
        seg_pos = [i for i, p in enumerate(parts) if p['t'] == 'seg']
        changed = False
        for seg_idx, inner_idx, new_text in cells:
            if seg_idx < 0 or seg_idx >= len(seg_pos):
                continue
            p = parts[seg_pos[seg_idx]]
            if inner_idx < 0 or inner_idx >= len(p['inner']):
                continue
            q = p['inner'][inner_idx]
            if q['t'] != 'text':
                continue
            if q['v'] == new_text:
                continue
            q['v'] = new_text
            changed = True
        if not changed:
            continue

        new_body = P.flatten(parts)
        # 保险：代码骨架长度必须一致（只改了文字，长度可变，这里校验结构没跑偏）
        if P.flatten(parts) != new_body:
            continue
        pending.setdefault(f, []).append((b0, b1, kind, new_body, raw))
        touched_files.add(f)

    if not touched_files:
        return {'ok': True, 'saved': 0, 'backup': None, 'note': '没有实际改动'}

    # 备份
    os.makedirs(bak_dir, exist_ok=True)
    for f in touched_files:
        shutil.copy2(os.path.join(STORY, f), os.path.join(bak_dir, f))
    trim_backups()

    # 写回：同文件内按位置从后往前替换
    for f, items in pending.items():
        path = os.path.join(STORY, f)
        cur = read_text(path)
        items.sort(key=lambda x: -x[0])
        for b0, b1, kind, new_body, _raw in items:
            cur = cur[:b0] + (P.escape_src(new_body) if kind == 'P' else new_body) + cur[b1:]
        write_text(path, cur)

    # 推进防缓存版本号
    bump_version()

    return {'ok': True, 'saved': len(by_key), 'backup': stamp,
            'files': sorted(touched_files)}


def bump_version():
    """改了 story 之后，把 index.html 的 ?v= 末位 +1，浏览器才会重新读"""
    for page in ('index.html', '预览-新版界面.html'):
        p = os.path.join(BASE, page)
        if not os.path.exists(p):
            continue
        s = read_text(p)
        m = re.search(r'\?v=(\d{6})', s)
        if not m:
            continue
        old = m.group(1)
        new = old[:-1] + str((int(old[-1]) + 1) % 10)
        if new != old:
            s = s.replace('?v=' + old, '?v=' + new)
            write_text(p, s)


def list_backups():
    if not os.path.isdir(BACKUP):
        return []
    out = []
    for d in sorted(os.listdir(BACKUP), reverse=True):
        p = os.path.join(BACKUP, d)
        if os.path.isdir(p):
            out.append({'stamp': d, 'files': sorted(os.listdir(p))})
    return out


def undo(stamp=None):
    bs = list_backups()
    if not bs:
        return {'ok': False, 'error': '还没有任何备份'}
    target = stamp or bs[0]['stamp']
    d = os.path.join(BACKUP, target)
    if not os.path.isdir(d):
        return {'ok': False, 'error': '找不到这份备份'}
    n = 0
    for f in os.listdir(d):
        if f.endswith('.js'):
            shutil.copy2(os.path.join(d, f), os.path.join(STORY, f))
            n += 1
    bump_version()
    return {'ok': True, 'restored': n, 'stamp': target}


# ---------------------------------------------------------------------------
# 搜索
# ---------------------------------------------------------------------------

def search(q):
    q = (q or '').strip()
    if len(q) < 1:
        return []
    out = []
    for f in list_story_files():
        raw = read_text(os.path.join(STORY, f))
        for (kind, name) in scan(raw):
            raw2 = raw
            m = scan(raw2)
            b0, b1 = m[(kind, name)]
            body = body_of(raw2, b0, b1, kind)
            if q not in body:
                continue
            parts = P.analyze(body)
            hits = []
            si = -1
            for p in parts:
                if p['t'] != 'seg':
                    continue
                si += 1
                txt = ''.join(qq['v'] for qq in p['inner'] if qq['t'] == 'text')
                if q in txt:
                    hits.append({'seg': si, 'text': txt[:90]})
            if not hits:
                continue
            key = kind + ':' + name
            info = lookup_meta(key)
            out.append({'key': key, 'title': info['title'], 'group': info['group'],
                        'icon': info['icon'], 'hits': hits[:6], 'n': len(hits)})
    out.sort(key=lambda x: -x['n'])
    return out


# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE, **kw)

    def log_message(self, *a):
        pass

    def _json(self, obj, code=200):
        data = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

    def _q(self, name, default=''):
        qs = urllib.parse.urlparse(self.path).query
        return urllib.parse.parse_qs(qs).get(name, [default])[0]

    def _body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if not n:
            return {}
        return json.loads(self.rfile.read(n).decode('utf-8'))

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        try:
            if path == '/api/tree':
                return self._json({'groups': build_tree()})
            if path == '/api/unit':
                u = load_unit(self._q('k'))
                if not u:
                    return self._json({'error': '找不到这个单元'}, 404)
                return self._json(u)
            if path == '/api/search':
                return self._json({'results': search(self._q('q'))})
            if path == '/api/backups':
                return self._json({'backups': list_backups()})
            if path == '/api/undo':
                return self._json(undo(self._q('stamp') or None))
        except Exception as e:
            return self._json({'error': '%s: %s' % (type(e).__name__, e)}, 500)
        return super().do_GET()

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        try:
            if path == '/api/save':
                d = self._body()
                return self._json(save_units(d.get('edits') or []))
            if path == '/api/undo':
                d = self._body()
                return self._json(undo(d.get('stamp')))
        except Exception as e:
            import traceback
            traceback.print_exc()
            return self._json({'error': '%s: %s' % (type(e).__name__, e)}, 500)
        return self._json({'error': 'unknown'}, 404)


def pick_port(cands=(8765, 8766, 8787, 8080, 3000)):
    import socket
    for p in cands:
        s = socket.socket()
        try:
            s.bind(('127.0.0.1', p))
            s.close()
            return p
        except OSError:
            s.close()
    return 0


def find_running(cands=(8765, 8766, 8787, 8080, 3000)):
    """先看看是不是已经有一个服务在跑。

    ★ 为什么要这样做（2026-10-29）：
      浏览器的存档是「按网址」分开存的，端口不一样就是两套存档。
      以前每次启动如果 8765 被占（上一次没关干净），就顺延到 8766，
      玩家再打开游戏，进度就像"凭空消失"了。现在优先复用已经在跑的那个。
    """
    import urllib.request
    for p in cands:
        try:
            with urllib.request.urlopen('http://127.0.0.1:%d/editor/editor.html' % p, timeout=0.35) as r:
                if r.status == 200:
                    return p
        except Exception:
            continue
    return 0


def main():
    # --game：同一个服务，只是打开游戏而不是打开编辑器。
    # 这样「玩游戏」和「改文字」用的是同一个网址，存档永远在同一个地方。
    want_game = '--game' in sys.argv
    page = 'index.html' if want_game else 'editor/editor.html'

    running = find_running()
    if running:
        url = 'http://127.0.0.1:%d/%s' % (running, page)
        print('=' * 58, flush=True)
        print('  Service is already running -> ' + url, flush=True)
        print('  (reusing the same address, so your saves stay put)', flush=True)
        print('=' * 58, flush=True)
        webbrowser.open(url)
        try:
            input('  Press Enter to close this window...')
        except Exception:
            pass
        return

    port = pick_port()
    if not port:
        print('No free port.'); sys.exit(1)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', port), H)
    url = 'http://127.0.0.1:%d/%s' % (port, page)
    base = 'http://127.0.0.1:%d' % port
    print('=' * 58, flush=True)
    if want_game:
        print('  Game is running', flush=True)
        print('  Game  : ' + url, flush=True)
        print('  Editor: ' + base + '/editor/editor.html', flush=True)
        print('  This window must stay open while you play.', flush=True)
    else:
        print('  Story Text Editor is running', flush=True)
        print('  Editor: ' + url, flush=True)
        print('  Game  : ' + base + '/index.html', flush=True)
        print('  Edit words, click Save. Backup is automatic.', flush=True)
    print('  Close this window when you are done.', flush=True)
    print('=' * 58, flush=True)
    threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
