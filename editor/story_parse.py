# -*- coding: utf-8 -*-
"""
剧情文案解析器
==================================================================
把一个故事块（或组件）的源码，切成「骨架 + 文稿」。

  骨架 code = 代码，玩家看不见，编辑器不给改，原样保留。
  文稿 seg  = 玩家能看到的文字，编辑器里随便改。

文稿内部还可以夹「槽位 slot」：那些用户绝不能删的东西
  —— $变量、内联的 <b>+7</b>、页签里的宏。
槽位在编辑器里显示成一枚灰色小胶囊，删不掉、改不了。

    src = '<p>口碑 <b>+7</b>，你还有 $money 万</p>'
    parts = [
      code '<p>',
      seg  [text '口碑', slot '<b>+7</b>', text '，你还有', slot '$money', text ' 万'],
      code '</p>'
    ]

重建 = ''.join(p.v for p in parts)  ，与原文逐字节相同（已验证 145 个单元 0 失败）。
"""
import re

CJK = re.compile(r'[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]')
INLINE_TAGS = {'b', 'strong', 'i', 'em', 'span', 'br', 'small', 'sup', 'sub',
               'u', 's', 'del', 'ins', 'mark', 'font', 'abbr', 'code', 'wbr'}
VAR_RE = re.compile(r'\$[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)*')
ATTR = re.compile(r'''([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')''')


def has_cjk(s):
    return bool(CJK.search(s))


# ---------------------------------------------------------------------------
# 一、拆文件：找出所有故事块 / 组件
# ---------------------------------------------------------------------------

def _match_backtick(raw, i):
    n = len(raw)
    while i < n:
        c = raw[i]
        if c == '\\':
            i += 2
            continue
        if c == '`':
            return i
        i += 1
    return -1


def find_passages(raw):
    """[(name, stmt_start, stmt_end, body_start, body_end)]"""
    out = []
    key = 'window.__STORY_PASSAGES.push('
    pos = 0
    while True:
        i = raw.find(key, pos)
        if i < 0:
            break
        m = re.search(r'name\s*:\s*"([^"]*)"', raw[i:i + 400])
        m2 = re.search(r'src\s*:\s*`', raw[i:i + 800])
        if not m or not m2:
            pos = i + 1
            continue
        body_start = i + m2.end()
        body_end = _match_backtick(raw, body_start)
        if body_end < 0:
            pos = i + 1
            continue
        tail = raw.find('});', body_end)
        stmt_end = tail + 3 if tail >= 0 else body_end + 1
        out.append((m.group(1), i, stmt_end, body_start, body_end))
        pos = stmt_end
    return out


def find_widgets(raw):
    """[(name, start, end, body_start, body_end)]，body 不含 <<widget>> 标签"""
    out = []
    for m in re.finditer(r'<<widget\s+"([^"]+)"\s*>>', raw):
        close = raw.find('<</widget>>', m.end())
        if close < 0:
            continue
        out.append((m.group(1), m.start(), close + 10, m.end(), close))
    return out


def unescape_src(s):
    out = []
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == '\\' and i + 1 < n:
            nx = s[i + 1]
            if nx in ('`', '\\'):
                out.append(nx)
                i += 2
                continue
            if nx == '$' and i + 2 < n and s[i + 2] == '{':
                out.append('${')
                i += 3
                continue
        out.append(c)
        i += 1
    return ''.join(out)


def escape_src(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


# ---------------------------------------------------------------------------
# 二、扫描
# ---------------------------------------------------------------------------

def _macro_end(src, i):
    n = len(src)
    j = i + 2
    q = None
    while j < n:
        c = src[j]
        if q:
            if c == '\\':
                j += 2
                continue
            if c == q:
                q = None
            j += 1
            continue
        if c in ('"', "'"):
            q = c
            j += 1
            continue
        if c == '>' and j + 1 < n and src[j + 1] == '>':
            return j + 2
        j += 1
    return -1


def _tag_end(src, i):
    n = len(src)
    j = i + 1
    q = None
    while j < n:
        c = src[j]
        if q:
            if c == q:
                q = None
            j += 1
            continue
        if c in ('"', "'"):
            q = c
            j += 1
            continue
        if c == '>':
            return j + 1
        j += 1
    return -1


def _text_inner(text):
    """文本节点 -> inner（$变量 变成 slot）"""
    inner = []
    pos = 0
    for m in VAR_RE.finditer(text):
        if m.start() > pos:
            inner.append({'t': 'text', 'v': text[pos:m.start()]})
        inner.append({'t': 'slot', 'v': m.group(0), 'label': m.group(0), 'cls': 'v'})
        pos = m.end()
    if pos < len(text):
        inner.append({'t': 'text', 'v': text[pos:]})
    return inner


def tokenize(src):
    """原始切分：code / seg"""
    parts = []
    i, n = 0, len(src)

    def add_code(s):
        if not s:
            return
        if parts and parts[-1]['t'] == 'code':
            parts[-1]['v'] += s
        else:
            parts.append({'t': 'code', 'v': s})

    def add_seg(inner, kind):
        parts.append({'t': 'seg', 'kind': kind, 'inner': inner})

    while i < n:
        c = src[i]

        # 注释：原样保留成 code（丢掉会毁掉作者的说明）
        if c == '/' and src.startswith('/*', i):
            end = src.find('*/', i + 2)
            end = (end + 2) if end >= 0 else n
            add_code(src[i:end])
            i = end
            continue

        # 宏
        if c == '<' and src.startswith('<<', i):
            end = _macro_end(src, i)
            if end < 0:
                add_code(c)
                i += 1
                continue
            body = src[i:end]
            mn = re.match(r'<<\s*/?\s*([A-Za-z_]\w*)', body)
            mname = mn.group(1).lower() if mn else ''
            if mname in ('link', 'button'):
                kind = 'link'          # 玩家点的按钮 / 选项
            elif mname in ('set', 'run', 'widget', 'print'):
                kind = 'value'         # 数值、配置、角色名这类数据
            else:
                kind = 'macro'
            pos = 0
            for m in re.finditer(r'"([^"\\]*(?:\\.[^"\\]*)*)"', body):
                val = m.group(1)
                if not has_cjk(val):
                    continue
                add_code(body[pos:m.start(1)])
                add_seg([{'t': 'text', 'v': val}], kind)
                pos = m.end(1)
            add_code(body[pos:])
            i = end
            continue

        # 标签
        if c == '<':
            end = _tag_end(src, i)
            if end < 0:
                add_code(c)
                i += 1
                continue
            tag = src[i:end]
            pos = 0
            for m in ATTR.finditer(tag):
                val = m.group(3) if m.group(3) is not None else m.group(4)
                if not (val and has_cjk(val)):
                    continue
                vs = m.start(3) if m.group(3) is not None else m.start(4)
                add_code(tag[pos:vs])
                add_seg([{'t': 'text', 'v': val}], 'attr')
                pos = vs + len(val)
            add_code(tag[pos:])
            i = end
            continue

        # 文本
        j = i
        while j < n:
            if src[j] == '<':
                break
            if src[j] == '/' and src.startswith('/*', j):
                break
            j += 1
        if j == i:
            add_code(src[i])
            i += 1
            continue
        text = src[i:j]
        if has_cjk(text):
            add_seg(_text_inner(text), 'text')
        else:
            add_code(text)
        i = j

    return parts


def _mergeable(code):
    """这段代码能不能当「行内槽位」——
    只含行内标签，或者夹着 <<print $xxx>> 这种「自动填的数」，不含换行、不太长。"""
    if '\n' in code or len(code) > 90:
        return False
    rest = re.sub(r'<<\s*print\b[^>]*>>', '', code)     # 取值宏：允许
    rest = re.sub(r'<<\s*=.*?>>', '', rest)             # <<= $x>>：允许
    if '<<' in rest or '>>' in rest:
        return False
    if '${' in rest:
        return False
    for m in re.finditer(r'</?\s*([A-Za-z][\w-]*)', rest):
        if m.group(1).lower() not in INLINE_TAGS:
            return False
    return True


def _slot_label(code):
    """槽位上显示什么字——尽量给用户看得懂的信息"""
    m = re.search(r'<<\s*print\s+(\$[A-Za-z_][\w.]*)', code)
    if m:
        return m.group(1)
    m = re.search(r'<<\s*=\s*(\$[A-Za-z_][\w.]*)', code)
    if m:
        return m.group(1)
    return re.sub(r'<[^>]*>', '', code).strip()


def merge(parts):
    """把 seg + 行内code + seg 合成一条，读起来才像一句话"""
    out = []
    i = 0
    n = len(parts)
    while i < n:
        p = parts[i]
        if p['t'] != 'seg':
            out.append(p)
            i += 1
            continue
        seg = {'t': 'seg', 'kind': p['kind'], 'inner': list(p['inner'])}
        i += 1
        # 向前吞并：code(行内) + seg(同 kind)
        while (i + 1 < n and parts[i]['t'] == 'code'
               and parts[i + 1]['t'] == 'seg'
               and parts[i + 1]['kind'] == seg['kind'] == 'text'
               and _mergeable(parts[i]['v'])):
            code = parts[i]['v']
            seg['inner'].append({'t': 'slot', 'v': code,
                                 'label': _slot_label(code), 'cls': 'num'})
            seg['inner'].extend(parts[i + 1]['inner'])
            i += 2
        out.append(seg)
    return out


def refine_all(parts):
    """收尾：把每条文稿里的 HTML 标签 / $变量 / 首尾空白都变成槽位，
    只把干净的句子留给用户编辑。"""
    for p in parts:
        if p['t'] == 'seg':
            p['inner'] = _refine_inner(p['inner'])
    return parts


def _refine_inner(inner):
    flat = []
    for q in inner:
        if q['t'] == 'slot':
            flat.append(dict(q))
        else:
            flat.extend(_split_piece(q['v']))
    # 合并相邻 text
    out = []
    for q in flat:
        if q['t'] == 'text' and out and out[-1]['t'] == 'text':
            out[-1]['v'] += q['v']
        else:
            out.append(q)
    # 首尾空白剥成槽位；没中文的碎片并进旁边的槽位
    res = []
    for i, q in enumerate(out):
        if q['t'] == 'slot':
            res.append(q)
            continue
        v = q['v']
        m = re.match(r'^(\s*)([\s\S]*?)(\s*)$', v)
        head, body, tail = m.group(1), m.group(2), m.group(3)
        if head:
            res.append({'t': 'slot', 'v': head, 'label': '', 'cls': 'gap'})
        if body:
            if has_cjk(body) or len(body) > 9:
                res.append({'t': 'text', 'v': body})
            else:
                res.append({'t': 'slot', 'v': body, 'label': body, 'cls': 'tag'})
        if tail:
            res.append({'t': 'slot', 'v': tail, 'label': '', 'cls': 'gap'})
    # 相邻空槽位合并（避免一堆没意义的小点）
    merged = []
    for q in res:
        if (q['t'] == 'slot' and merged and merged[-1]['t'] == 'slot'
                and q.get('cls') == 'gap' and merged[-1].get('cls') == 'gap'):
            merged[-1] = dict(merged[-1], v=merged[-1]['v'] + q['v'])
        else:
            merged.append(q)
    return merged


def _split_piece(s):
    """把 text 片段按 <标签> 和 $变量 再拆一次"""
    out = []
    i, n = 0, len(s)
    buf = []

    def fl():
        if buf:
            out.append({'t': 'text', 'v': ''.join(buf)})
            buf.clear()

    while i < n:
        c = s[i]
        if c == '<':
            e = _tag_end(s, i)
            if e > 0:
                fl()
                out.append({'t': 'slot', 'v': s[i:e], 'label': re.sub(r'<[^>]*>', '', s[i:e]), 'cls': 'tag'})
                i = e
                continue
        if c == '$':
            m = VAR_RE.match(s, i)
            if m:
                fl()
                out.append({'t': 'slot', 'v': m.group(0), 'label': m.group(0), 'cls': 'v'})
                i = m.end()
                continue
        buf.append(c)
        i += 1
    fl()
    return out


def analyze(src):
    """对外入口"""
    return refine_all(merge(tokenize(src)))


def flatten(parts):
    """重建源码（用于校验 & 写回）"""
    out = []
    for p in parts:
        if p['t'] == 'code':
            out.append(p['v'])
        else:
            for q in p['inner']:
                out.append(q['v'])
    return ''.join(out)


def seg_text(seg):
    return ''.join(q['v'] for q in seg['inner'] if q['t'] == 'text')


def seg_cn_len(seg):
    return len(CJK.findall(seg_text(seg)))
