# -*- coding: utf-8 -*-
"""
剧情编辑器 · 本地服务
只在你自己电脑上跑，用来读写 game/story/*.js，不会联网。
"""
import http.server
import socketserver
import json
import os
import re
import sys
import webbrowser
import threading

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STORY = os.path.join(BASE, 'story')

BLOCK_RE = re.compile(
    r'window\.__STORY_PASSAGES\.push\(\{\s*name:\s*"([^"]*)"\s*,\s*src:\s*`(.*?)`\s*\}\);',
    re.S)


def esc(s):
    """写入 js 模板字符串前的转义"""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def unesc(s):
    out = []
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == '\\' and i + 1 < n:
            nx = s[i + 1]
            if nx == '`' or nx == '\\':
                out.append(nx); i += 2; continue
            if nx == '$' and i + 2 < n and s[i + 2] == '{':
                out.append('${'); i += 3; continue
        out.append(c); i += 1
    return ''.join(out)


def read_file(fname):
    p = os.path.join(STORY, fname)
    raw = open(p, encoding='utf-8').read()
    # header = 第一个故事块注释（或 push 语句）之前的部分
    m = BLOCK_RE.search(raw)
    cut = m.start() if m else len(raw)
    cm = raw.find('/* ---------- 故事块')
    if cm >= 0 and cm < cut:
        cut = cm
    header = raw[:cut]
    blocks = [{'name': m.group(1), 'src': unesc(m.group(2))}
              for m in BLOCK_RE.finditer(raw)]
    return header, blocks


def write_file(fname, header, blocks):
    p = os.path.join(STORY, fname)
    parts = [header.rstrip('\n'), '']
    for b in blocks:
        parts.append('/* ---------- 故事块：%s ---------- */' % b['name'])
        parts.append('window.__STORY_PASSAGES.push({')
        parts.append('  name: "%s",' % b['name'])
        parts.append('  src: `%s`' % esc(b['src']))
        parts.append('});')
        parts.append('')
    open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(parts))


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

    def _body(self):
        n = int(self.headers.get('Content-Length') or 0)
        return json.loads(self.rfile.read(n).decode('utf-8')) if n else {}

    def do_GET(self):
        if self.path.startswith('/api/list'):
            out = []
            for f in sorted(os.listdir(STORY)):
                if not f.endswith('.js'):
                    continue
                try:
                    _, blocks = read_file(f)
                except Exception as e:
                    out.append({'file': f, 'error': str(e), 'blocks': []})
                    continue
                out.append({'file': f, 'blocks': [
                    {'name': b['name'], 'size': len(b['src'])} for b in blocks]})
            return self._json({'files': out})
        if self.path.startswith('/api/file'):
            q = self.path.split('f=', 1)[-1]
            fname = q.split('&')[0]
            try:
                header, blocks = read_file(fname)
            except Exception as e:
                return self._json({'error': str(e)}, 500)
            return self._json({'file': fname, 'header': header, 'blocks': blocks})
        if self.path.startswith('/api/names'):
            names = []
            for f in sorted(os.listdir(STORY)):
                if not f.endswith('.js'):
                    continue
                try:
                    _, blocks = read_file(f)
                except Exception:
                    continue
                for b in blocks:
                    names.append({'name': b['name'], 'file': f})
            return self._json({'names': names})
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/save'):
            d = self._body()
            fname = d.get('file')
            blocks = d.get('blocks') or []
            try:
                header, _ = read_file(fname)
            except Exception as e:
                return self._json({'error': str(e)}, 500)
            try:
                write_file(fname, header, blocks)
            except Exception as e:
                return self._json({'error': str(e)}, 500)
            return self._json({'ok': True, 'saved': len(blocks)})
        if self.path.startswith('/api/rename'):
            d = self._body()
            old, new = d.get('old'), d.get('new')
            changed = 0
            for f in sorted(os.listdir(STORY)):
                if not f.endswith('.js'):
                    continue
                try:
                    header, blocks = read_file(f)
                except Exception:
                    continue
                dirty = False
                for b in blocks:
                    if b['name'] == old:
                        b['name'] = new; dirty = True
                    s = b['src']
                    if old in s:
                        ns = re.sub(r'"' + re.escape(old) + r'"', '"' + new + '"', s)
                        ns = re.sub(r'\[\[([^\]]*?)\|' + re.escape(old) + r'\]\]',
                                    lambda m: '[[' + m.group(1) + '|' + new + ']]', ns)
                        if ns != s:
                            b['src'] = ns; dirty = True
                if dirty:
                    write_file(f, header, blocks); changed += 1
            return self._json({'ok': True, 'files': changed})
        return self._json({'error': 'unknown'}, 404)


def pick_port(cands=(8765, 8080, 3000, 5173, 5000)):
    import socket
    for p in cands:
        s = socket.socket()
        try:
            s.bind(('127.0.0.1', p)); s.close(); return p
        except OSError:
            s.close(); continue
    return 0


def main():
    port = pick_port()
    if not port:
        print('No available port found.', flush=True); sys.exit(1)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', port), H)
    url = 'http://127.0.0.1:%d/editor/editor.html' % port
    # NOTE: 控制台输出保持纯英文，避免 Windows 控制台 GBK/UTF-8 编码导致乱码
    def say(s):
        print(s, flush=True)
    say('=' * 56)
    say('  Story Editor is running.')
    say('  URL: ' + url)
    say('  Edit a block, click SAVE, then refresh the game page.')
    say('  Just close this window when you are done.')
    say('=' * 56)
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
