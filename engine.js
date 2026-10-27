/* =========================================================================
 *  TweeEngine —— 轻量 SugarCube-2 语法兼容运行时
 *  ---------------------------------------------------------------------
 *  这个文件是"引擎"，负责把故事数据渲染成网页。
 *  ★ 一般情况下你不需要修改这里。要改剧情/数值请去 story/*.js
 * ========================================================================= */
(function (root) {
  'use strict';

  /* =====================================================================
   * 0. 基础工具
   * ===================================================================== */
  var BT = '`';

  function clone(o) {
    if (o === undefined || o === null) return o;
    try {
      if (typeof structuredClone === 'function') return structuredClone(o);
    } catch (e) { /* 退化到 JSON */ }
    try { return JSON.parse(JSON.stringify(o)); } catch (e) { return o; }
  }

  function toStr(v) {
    if (v === undefined || v === null) return '';
    return String(v);
  }

  /* Array 扩展：原 Twine 版本里被用到的两个数组方法 */
  if (!Array.prototype.deleteAt) {
    Array.prototype.deleteAt = function () {
      var idx = Array.prototype.slice.call(arguments).map(Number);
      for (var i = 0; i < idx.length; i++) {
        var k = idx[i];
        if (k >= 0 && k < this.length) this.splice(k, 1);
      }
      return this;
    };
  }
  if (!Array.prototype.random) {
    Array.prototype.random = function () {
      if (!this.length) return undefined;
      return this[Math.floor(Math.random() * this.length)];
    };
  }
  if (!Array.prototype.pluck) {
    Array.prototype.pluck = function () { return clone(this); };
  }

  /* =====================================================================
   * 1. 状态容器
   * ===================================================================== */
  var State = {
    vars: {},     // $变量（存档会保存）
    temp: {},     // _变量（临时，不保存）
    args: [],     // widget 的 $args
    passage: null,
    history: []
  };

  function makeProxy(kind) {
    return new Proxy({}, {
      get: function (t, k) {
        if (k === 'args') return State.args;
        if (k === Symbol.toPrimitive || typeof k === 'symbol') return undefined;
        return State[kind][k];
      },
      set: function (t, k, v) { State[kind][k] = v; return true; },
      has: function (t, k) { return k in State[kind]; },
      deleteProperty: function (t, k) { delete State[kind][k]; return true; },
      ownKeys: function () { return Reflect.ownKeys(State[kind]); },
      getOwnPropertyDescriptor: function () {
        return { enumerable: true, configurable: true };
      }
    });
  }
  var DOLLAR = makeProxy('vars');
  var UNDER = makeProxy('temp');

  /* =====================================================================
   * 2. 提供给故事脚本的内置函数
   * ===================================================================== */
  function random(min, max, step) {
    if (min === undefined) { min = 0; max = 1; }
    if (max === undefined) { max = min; min = 1; }
    min = Math.ceil(min); max = Math.floor(max);
    var n = min + Math.floor(Math.random() * (max - min + 1));
    if (step && step > 1) n = min + Math.floor((n - min) / step) * step;
    return n;
  }
  function randomFloat(min, max) {
    if (min === undefined) { min = 0; max = 1; }
    if (max === undefined) { max = min; min = 0; }
    return min + Math.random() * (max - min);
  }
  function either() {
    if (!arguments.length) return false;
    return arguments[random(0, arguments.length - 1)];
  }
  function hasVar(fn) {
    try { return fn() !== undefined; } catch (e) { return false; }
  }
  function visitedCount(name) {
    var c = 0;
    for (var i = 0; i < State.history.length; i++) if (State.history[i] === name) c++;
    return c;
  }
  function visited(name) { return visitedCount(name); }
  function turns() { return State.history.length; }
  function passageFn() { return State.passage; }
  function previousFn() {
    var h = State.history;
    return h.length > 1 ? h[h.length - 2] : '';
  }
  function tagsFn(name) {
    var p = (name === undefined) ? (Story[State.passage] || {}) : (Story[name] || {});
    return p.__tags || [];
  }

  /* ★ 修 Bug（2026-10-03）①：
     下面这两行必须定义在 FN 之前。
     原来 NUMOPS 写在文件更下面，因为 var 提升，FN 建好时 NUMOPS 还是 undefined，
     于是 __f.nums 不存在 —— 全游戏的 += / -= / *= / /= 全部静默失败
     （加钱、扣体力、扣资源、涨口碑…… 一个都没生效）。 */
  function numv(v) {
    if (typeof v === 'number') return Number.isNaN(v) ? 0 : v;
    if (v === null || v === undefined || v === '') return 0;
    var n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  var NUMOPS = {
    '+': function (a, b) { return typeof a === 'number' ? (numv(a) + numv(b)) : (a + b); },
    '-': function (a, b) { return numv(a) - numv(b); },
    '*': function (a, b) { return numv(a) * numv(b); },
    '/': function (a, b) { return numv(a) / numv(b); },
    '%': function (a, b) { return numv(a) % numv(b); }
  };

  var FN = {
    random: random, randomFloat: randomFloat, either: either,
    hasVar: hasVar, visited: visited, visitedCount: visitedCount,
    turns: turns, passage: passageFn,     previous: previousFn, tags: tagsFn,
    clone: clone, nums: NUMOPS
  };

  /* =====================================================================
   * 3. 表达式编译：SugarCube 语法 -> JavaScript
   * ===================================================================== */
  var PREAMBLE = 'var random=__f.random,randomFloat=__f.randomFloat,either=__f.either,' +
    'hasVar=__f.hasVar,visited=__f.visited,turns=__f.turns,passage=__f.passage,' +
    'previous=__f.previous,tags=__f.tags,clone=__f.clone;';

  var fnCache = {};

  function buildFn(body) {
    try {
      return new Function('$', '_', '__f', PREAMBLE + body);
    } catch (e) {
      throw new Error('表达式编译失败：' + body + '\n' + e.message);
    }
  }

  var WORD_OPS = [
    [/\bisnot\b/g, '!=='],
    [/\bis\b/g, '==='],
    [/\bneq\b/g, '!='],
    [/\beq\b/g, '=='],
    [/\bgte\b/g, '>='],
    [/\blte\b/g, '<='],
    [/\bgt\b/g, '>'],
    [/\blt\b/g, '<'],
    [/\bto\b/g, '='],
    [/\band\b/g, '&&'],
    [/\bor\b/g, '||'],
    [/\bnot\b/g, '!'],
    [/\bmod\b/g, '%']
  ];

  /* string / template-literal 保护 */
  function protectStrings(src, bufs) {
    return String(src).replace(
      /`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\\n])*"|'(?:\\[\s\S]|[^'\\\n])*'/g,
      function (m) { return '\u0001' + (bufs.push(m) - 1) + '\u0001'; }
    );
  }

  function toJs(src, noWordOps) {
    if (src === undefined || src === null) return '';
    var bufs = [];
    var s = protectStrings(src, bufs);

    /* def X -> X 经可选链后判断 !== undefined
       ★ 修 Bug（2026-10-03）：原来只给紧跟 def 的第一段加可选链，
         `def $actors[_k].fans.dream` 在 .fans 不存在时会直接抛错。
         现在整条 $a.b[c].d 链路都加 ?. ，语义和 SugarCube 一致。 */
    s = s.replace(/\bdef\s+([A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*|\[[^\]]*\])*)/g,
      function (m, e) {
        var inner = e
          .replace(/\.([A-Za-z_$][\w$]*)/g, '?.$1')
          .replace(/\[([^\]]*)\]/g, '?.[$1]');
        return '(( ' + inner + ' ) !== undefined)';
      });

    if (!noWordOps) {
      for (var i = 0; i < WORD_OPS.length; i++) WORD_OPS[i][0].lastIndex = 0;
      for (var j = 0; j < WORD_OPS.length; j++) {
        s = s.replace(WORD_OPS[j][0], WORD_OPS[j][1]);
      }
    }

    /* $变量 */
    s = s.replace(/(?<![\w$])\$(?!\{)([A-Za-z_][\w]*)/g, '$.$1');
    /* _变量 */
    s = s.replace(/(?<![\w.$])_([A-Za-z][\w]*)/g, '_.$1');

    /* 还原字符串；模板串需要递归处理 ${} 插值 */
    s = s.replace(/\u0001(\d+)\u0001/g, function (m, i) {
      var raw = bufs[+i];
      if (raw.charAt(0) === BT) return restoreTemplate(raw);
      return raw;
    });
    return s;
  }

  function restoreTemplate(t) {
    var body = t.slice(1, -1);
    var parts = body.split(/(\$\{[^}]*\})/);
    var out = '`';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.indexOf('${') === 0 && p.charAt(p.length - 1) === '}') {
        out += '${' + toJs(p.slice(2, -1)) + '}';
      } else {
        out += p.replace(/([`\\])/g, '\\$1');
      }
    }
    return out + '`';
  }

  /* --- 编译为"值表达式" --- */
  function compileExpr(src) {
    var key = 'E:' + src;
    if (fnCache[key]) return fnCache[key];
    var f = buildFn('return (' + toJs(src) + ');');
    fnCache[key] = f;
    return f;
  }
  function evalExpr(src, ctx) {
    if (src === undefined || src === '') return undefined;
    try {
      return compileExpr(src).call(null, DOLLAR, UNDER, FN);
    } catch (e) {
      err(e, '求值 ' + src);
      return undefined;
    }
  }

  /* --- set / run --- */
  function splitAssign(src) {
    var depth = 0, quote = null;
    for (var i = 0; i < src.length; i++) {
      var c = src[i];
      if (quote) {
        if (c === '\\') { i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === BT) { quote = c; continue; }
      if (c === '(' || c === '[') { depth++; continue; }
      if (c === ')' || c === ']') { depth--; continue; }
      if (depth > 0) continue;
      if (c === '=') {
        var prev = src.charAt(i - 1);
        if ('+-*/%&|'.indexOf(prev) >= 0) {
          var op2 = prev + src.charAt(i + 1);
          if (op2 === '+=' || op2 === '-=' || op2 === '*=' || op2 === '/=' || op2 === '%=') {
            return { lhs: src.slice(0, i - 1), op: op2, rhs: src.slice(i + 2) };
          }
          return { lhs: src.slice(0, i - 1), op: prev + '=', rhs: src.slice(i + 1) };
        }
        if ('!<>='.indexOf(prev) >= 0) continue;
        if (src.charAt(i + 1) === '=') continue;
        return { lhs: src.slice(0, i), op: '=', rhs: src.slice(i + 1) };
      }
      if (c === ' ' || c === '\t') {
        var m = /^\s+to\s+/.exec(src.slice(i));
        if (m) return { lhs: src.slice(0, i), op: '=', rhs: src.slice(i).replace(/^\s+to\s+/, '') };
      }
    }
    return null;
  }

  /* 注意：numv / NUMOPS 已在上方 FN 之前定义，这里不要再重复声明 */

  function compileSet(src) {
    var a = splitAssign(src);
    if (!a) return buildFn(toJs(src) + ';');
    var key = 'S:' + src;
    if (fnCache[key]) return fnCache[key];
    var lhs = toJs(a.lhs, true), rhs = toJs(a.rhs);
    var f;
    var sOp = a.op.charAt(0);
    if (NUMOPS[sOp] && a.op !== '=' && a.op.length === 2) {
      /* 复合赋值走兜底版本 */
      f = buildFn(lhs + ' = __f.nums["' + sOp + '"](' + lhs + ', ' + rhs + ');');
    } else {
      f = buildFn(lhs + ' ' + a.op + ' ' + rhs + ';');
    }
    fnCache[key] = f;
    return f;
  }
  function execSet(src) {
    Engine._recentSets = Engine._recentSets || [];
    Engine._recentSets.push(src);
    if (Engine._recentSets.length > 25) Engine._recentSets.shift();
    try { compileSet(src).call(null, DOLLAR, UNDER, FN); }
    catch (e) { err(e, '执行 <<set>> ' + src); }
  }
  function compileUnset(src) {
    return buildFn('delete ' + toJs(src, true) + ';');
  }

  /* --- 拆分 macro 参数（考虑引号 / 嵌套） --- */
  function splitArgs(s, maxParts) {
    var parts = [], cur = '', depth = 0, quote = null;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (quote) {
        cur += c;
        if (c === '\\') { cur += s[++i] || ''; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === BT) { cur += c; quote = c; continue; }
      if (c === '(' || c === '[') depth++;
      if (c === ')' || c === ']') depth--;
      if (/\s/.test(c) && depth === 0) {
        if (cur) { parts.push(cur); cur = ''; }
        if (maxParts && parts.length === maxParts - 1) {
          var rest = s.slice(i + 1).trim();
          if (rest) parts.push(rest);
          return parts;
        }
        continue;
      }
      cur += c;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
  }

  /* =====================================================================
   * 4. 词法 / 语法分析
   * ===================================================================== */
  var CONTAINERS = {
    'if': 1, 'nobr': 1, 'silently': 1, 'link': 1, 'button': 1,
    'for': 1, 'capture': 1, 'widget': 1, 'replace': 1
  };
  var BUILTIN = {
    'set': 1, 'unset': 1, 'run': 1, 'print': 1, 'goto': 1, 'include': 1,
    'radiobutton': 1, 'checkbox': 1, 'textbox': 1, 'silently': 1, 'nobr': 1,
    'if': 1, 'elseif': 1, 'else': 1, 'for': 1, 'link': 1, 'button': 1,
    'capture': 1, 'widget': 1, 'replace': 1, 'script': 1, 'stop': 1,
    'break': 1, 'continue': 1, 'include': 1, 'display': 1, 'append': 1,
    'prepend': 1, 'remove': 1, 'wait': 1
  };

  function scanMacroEnd(src, start) {
    var quote = null, i = start, n = src.length;
    while (i < n) {
      var c = src[i];
      if (quote) {
        if (c === '\\') { i += 2; continue; }
        if (c === quote) { quote = null; }
        i++; continue;
      }
      if (c === '"' || c === "'" || c === BT) { quote = c; i++; continue; }
      if (c === '>' && src[i + 1] === '>') return i;
      i++;
    }
    return -1;
  }

  function tokenize(src) {
    var nodes = [], buf = '', i = 0, n = src.length;
    while (i < n) {
      var c = src[i];
      /* <<script>> ... <</script>>  整段原文取出 */
      if (c === '<' && src[i + 1] === '<' && /^<<\s*script\b/.test(src.slice(i, i + 20))) {
        var tail = src.slice(i);
        var m = /<<\s*\/\s*script\s*>>/.exec(tail);
        if (m) {
          if (buf) { nodes.push({ t: 'text', v: buf }); buf = ''; }
          nodes.push({ t: 'script', v: tail.slice(0, m.index).replace(/^<<\s*script\b[^>]*>>/, '') });
          i += m.index + m[0].length;
          continue;
        }
      }
      if (c === '<' && src[i + 1] === '<') {
        var end = scanMacroEnd(src, i + 2);
        if (end >= 0) {
          if (buf) { nodes.push({ t: 'text', v: buf }); buf = ''; }
          var raw = src.slice(i + 2, end);
          var mm = /^(\/?)\s*([A-Za-z_][\w]*)/.exec(raw);
          if (mm) {
            nodes.push({
              t: 'macro', closing: mm[1] === '/', name: mm[2],
              args: raw.slice(mm[0].length).trim()
            });
          }
          i = end + 2;
          continue;
        }
      }
      if (c === '[' && src[i + 1] === '[') {
        var close = src.indexOf(']]', i + 2);
        if (close > 0) {
          /* 防止 ]]> 出现在 URL 之类的情况，这里简单处理即可 */
          if (buf) { nodes.push({ t: 'text', v: buf }); buf = ''; }
          nodes.push({ t: 'link2', raw: src.slice(i + 2, close) });
          i = close + 2;
          continue;
        }
      }
      buf += c;
      i++;
    }
    if (buf) nodes.push({ t: 'text', v: buf });
    return nodes;
  }

  /* if 节点的插入目标要落在"当前分支"，其余节点落在 children */
  function curArr(f) {
    return (f.name === 'if') ? f.branches[f.branches.length - 1].children : f.children;
  }

  function buildTree(list) {
    var root = { k: 'root', children: [] };
    var stack = [root];
    for (var idx = 0; idx < list.length; idx++) {
      var nd = list[idx];
      if (nd.t !== 'macro') { curArr(stack[stack.length - 1]).push(nd); continue; }
      if (nd.closing) {
        if (stack.length > 1) {
          var found = -1;
          for (var i = stack.length - 1; i >= 1; i--) {
            if (stack[i].name === nd.name) { found = i; break; }
          }
          stack.length = found > 0 ? found : 1;
        }
        continue;
      }
      var top = stack[stack.length - 1];
      if (nd.name === 'elseif' || nd.name === 'else') {
        if (top.name === 'if') {
          top.branches.push({
            cond: (nd.name === 'else') ? null : nd.args,
            children: []
          });
        }
        continue;
      }
      if (CONTAINERS[nd.name]) {
        nd.children = [];
        if (nd.name === 'if') {
          nd.branches = [{ cond: nd.args, children: nd.children }];
        }
        curArr(top).push(nd);
        stack.push(nd);
      } else {
        curArr(top).push(nd);
      }
    }
    return root.children;
  }

  var astCache = {};
  function parsePassage(src) {
    if (astCache[src]) return astCache[src];
    var ast = buildTree(tokenize(src));
    astCache[src] = ast;
    return ast;
  }

  /* =====================================================================
   * 5. 文本渲染（naked 变量 / 注释 / nobr）
   * ===================================================================== */
  function renderPlainText(s) {
    /* 去除 SugarCube 行注释 */
    s = s.replace(/\/\*[\s\S]*?\*\//g, '');
    /* @@样式;文字@@  ->  <span style="样式">文字</span> */
    s = s.replace(/@@([^;@]*);([\s\S]*?)@@/g, function (m, sty, body) {
      return '<span style="' + sty.trim().replace(/"/g, '') + '">' + body + '</span>';
    });
    /* ★ 新增（2026-10-03）：支持 Vue 风格的属性绑定
       `<div @class="'pr-card ' + _card_class">`、`<div @style="_pie_style">`
       原作里大量使用这种写法，但浏览器不认 @class / @style，
       导致卡片既没 class 也没 style —— 界面看起来"是空的"。
       这里在"naked 变量替换之前"先求值，避免 _borderColor 被提前替换成裸值。
       必须排在第 494 行 naked 变量替换的前面，否则表达式会被拆坏。 */
    s = s.replace(/@([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
      function (m, attr, dq, sq) {
        var expr = (dq !== undefined) ? dq : sq;
        var v = '';
        try { v = evalExpr(expr); } catch (e) { v = ''; }
        if (v === undefined || v === null) v = '';
        return attr + '="' + String(v).replace(/"/g, '&quot;') + '"';
      });

    /* naked 变量 $xxx.xxx / _xxx */
    s = s.replace(/(\$)([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*|\[[^\]]*\])*)/g, function (m, d, expr) {
      var v = evalExpr(d + expr);
      return v === undefined || v === null ? '' : toStr(v);
    });
    s = s.replace(/(^|[^\w$_.])(_)([A-Za-z][\w]*(?:\.[A-Za-z_][\w]*|\[[^\]]*\])*)/g,
      function (m, pre, u, expr) {
        var v = evalExpr(u + expr);
        return pre + (v === undefined || v === null ? '' : toStr(v));
      });
    /* nobr：去掉换行 */
    s = s.replace(/\r/g, '').replace(/\n/g, '');
    return s;
  }

  /* =====================================================================
   * 6. 交互 handler 注册
   * ===================================================================== */
  var handlerSeq = 0, handlerGen = 0;
  var handlers = {};
  function regHandler(fn) {
    var id = 'h' + (++handlerSeq);
    handlers[id] = fn;
    return id;
  }
  function purgeHandlers(belowGen) {
    for (var k in handlers) {
      if (handlers[k].gen <= belowGen) delete handlers[k];
    }
  }

  /* =====================================================================
   * 7. 渲染器
   * ===================================================================== */
  var Nav = { pending: null, halt: false };
  var Story = {};
  var Widgets = {};
  var astNodeCache = {};

  function outNew() { return { parts: [], tasks: [] }; }

  function doGoto(target) {
    Nav.pending = target;
    Nav.halt = true;
  }

  function renderNodes(nodes, o) {
    for (var i = 0; i < nodes.length; i++) {
      if (Nav.halt) return;
      renderNode(nodes[i], o);
    }
  }

  function renderNode(nd, o) {
    if (Nav.halt) return;
    switch (nd.t) {
      case 'text':
        o.parts.push(renderPlainText(nd.v));
        return;

      case 'script':
        try {
          (new Function('$', '_', 'Engine', nd.v)).call(null, DOLLAR, UNDER, Engine);
        } catch (e) { err(e, 'script'); }
        return;

      case 'link2': {
        var raw = nd.raw;
        var target, label;
        var arrow = raw.split('->');
        if (arrow.length > 1) { label = arrow[0]; target = arrow[1]; }
        else if (raw.indexOf('|') >= 0) { var b = raw.split('|'); label = b[0]; target = b[1]; }
        else { target = raw; label = raw; }
        target = target.trim();
        if (/^["']/.test(target)) target = target.replace(/^['"]|['"]$/g, '');
        var labelTxt = renderPlainText(label);
        /* 直接复用 link 宏的处理，保证两边行为一致 */
        renderMacro({
          t: 'macro', closing: false, name: 'link', children: [],
          args: JSON.stringify(labelTxt) + ' ' + JSON.stringify(target)
        }, o);
        return;
      }

      case 'macro':
        renderMacro(nd, o);
        return;
    }
  }

  function makeLink(label, target, bodyNodes, o) {
    var id = regHandler(function () {
      if (bodyNodes) renderNodes(bodyNodes, outNew());
      if (Nav.pending) { var t = Nav.pending; Nav.pending = null; Nav.halt = false; display(t); }
      Engine.save();
    });
    handlers[id].gen = handlerGen;
    var targetEsc = String(target === null || target === undefined ? '' : target)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return '<a href="javascript:void(0)" class="link-internal" data-h="' + id +
      '" data-passage="' + targetEsc + '">' + toStr(label) + '</a>';
  }

  function renderMacro(nd, o) {
    var nm = nd.name, a = nd.args;

    /* ★ 回看模式（2026-10-27）：剧情档案里的"重看"只负责显示文字，
       set / run / unset / goto 一律不执行 —— 否则重看一遍就会再加一次羁绊值。 */
    if (Engine.readonly && (nm === 'set' || nm === 'run' || nm === 'unset' || nm === 'goto')) return;

    switch (nm) {
      case 'set': execSet(a); return;
      case 'unset': {
        try { compileUnset(a).call(null, DOLLAR, UNDER, FN); }
        catch (e) { err(e, 'unset ' + a); }
        return;
      }
      case 'run': execSet(a); return;
      case 'print': {
        o.parts.push(toStr(evalExpr(a)));
        return;
      }
      case 'goto': doGoto(evalExpr(a)); return;
      case 'stop': Nav.halt = true; return;
      /* ★ 新增（2026-10-03）：<<exit>> —— SugarCube 里表示"立刻结束本页渲染"。
         原作 Widget_Fan_War 用它来兜底（全员无活动时提前退出），
         引擎原来不认识它，会被当成未知宏忽略，接着往下跑就会崩。 */
      case 'exit': Nav.halt = true; return;

      case 'nobr': case 'capture': renderNodes(nd.children, o); return;
      case 'silently': {
        var so = outNew();
        renderNodes(nd.children, so);
        /* 非输出，但仍要执行 deferred 任务 */
        for (var t = 0; t < so.tasks.length; t++) o.tasks.push(so.tasks[t]);
        return;
      }

      case 'if': {
        for (var b = 0; b < nd.branches.length; b++) {
          var br = nd.branches[b];
          if (br.cond === null || truthy(evalExpr(br.cond))) {
            renderNodes(br.children, o);
            return;
          }
        }
        return;
      }

      case 'for': renderFor(nd, o); return;

      case 'link': case 'button': {
        var linkCls = '';
        if (/class\s*=/.test(a)) {
          a = a.replace(/\bclass\s*=\s*"([^"]*)"/i, function (m, c) { linkCls = c; return ''; });
          a = a.replace(/\bclass\s*=\s*'?([^\s"'>]+)'?/i, function (m, c) { linkCls = c; return ''; });
        }
        var parts = splitArgs(a, 2);
        var labelExpr = parts[0];
        var targetExpr = parts[1] ? evalExpr(parts[1]) : null;
        /* ★ 修 Bug（2026-10-03）④：
           原来把 <<goto>> 放在正文【前面】，而 goto 会把 Nav.halt 置 true，
           于是 <</link>> 之间的 <<set>> 一行都执行不到就跳走了。
           后果：<<link "媚粉福利" "Fan_Action">><<set $action to "visual">><</link>>
           跳过去时 $action 还是 undefined —— 营销执行报告整页空白。
           SugarCube 的正确语义是：先执行正文，最后再跳转。 */
        var bodyNodes = [];
        if (nd.children && nd.children.length) bodyNodes = bodyNodes.concat(nd.children);
        if (targetExpr) {
          bodyNodes = bodyNodes.concat([{
            t: 'macro', name: 'goto',
            args: '"' + String(targetExpr).replace(/"/g, '') + '"'
          }]);
        }
        if (!bodyNodes.length) bodyNodes = null;
        labelExpr = labelExpr === undefined ? '""' : labelExpr;

        /* ★ 修 Bug（2026-10-03）②：
           这里原本用 clone() 深拷贝临时变量。深拷贝会把 `_act`（它其实是
           $actors.xxx 的引用）也复制成一份副本，于是按钮里写的
           `<<set _act.busy_months = 3>>` 只改到副本上，真实艺人数据纹丝不动。
           改成浅拷贝：普通数值照旧冻结在渲染那一刻（保持原行为），
           而对象仍然保持引用，和 SugarCube 的写法一致。 */
        var snapshot = Object.assign({}, State.temp);
        var label = evalExpr(labelExpr);

        /* ★ 回看模式：按钮只画出来，不给它绑点击事件 */
        if (Engine.readonly) {
          o.parts.push('<span class="replay-dead">' + toStr(label) + '</span>');
          return;
        }

        var id = regHandler(function () {
          if (bodyNodes) {
            var savedTemp = State.temp;
            State.temp = Object.assign({}, snapshot);
            try {
              var lo = outNew();
              renderNodes(bodyNodes, lo);
              Engine.runTasks(lo.tasks);
            } finally {
              State.temp = savedTemp;
            }
          }
          if (Nav.pending) {
            var tg = Nav.pending; Nav.pending = null; Nav.halt = false;
            display(tg);
          }
          Engine.save();
        });
        handlers[id].gen = handlerGen;
        if (nm === 'button') {
          o.parts.push('<button type="button" class="link-internal btn-macro ' + linkCls +
            '" data-h="' + id + '">' + toStr(label) + '</button>');
        } else {
          o.parts.push('<a href="javascript:void(0)" class="link-internal ' + linkCls +
            '" data-h="' + id + '">' + toStr(label) + '</a>');
        }
        return;
      }

      case 'replace': {
        var sel = evalExpr(splitArgs(a, 2)[0]);
        o.tasks.push(function () {
          try {
            var els = document.querySelectorAll(sel);
            if (!els.length) return;
            var ro = outNew();
            renderNodes(nd.children, ro);
            var html = ro.parts.join('');
            for (var k = 0; k < els.length; k++) els[k].innerHTML = html;
            Engine.runTasks(ro.tasks);
          } catch (e) { err(e, 'replace ' + sel); }
        });
        return;
      }

      case 'radiobutton': {
        var ra = splitArgs(a, 3);
        var vPath = ra[0], val = evalExpr(ra[1]), def = (ra[2] || '').indexOf('checked') >= 0;
        /* 第 1 个参数可能是 "$var" 这样的字符串，先求出真正的变量名 */
        var vName = vPath;
        if (/^["']/.test(String(vPath))) {
          try { vName = JSON.parse(String(vPath).replace(/'/g, '"')); } catch (e) { vName = String(vPath).replace(/["']/g, ''); }
        }
        var curV = evalExpr(vName);
        /* ★ 修 Bug（2026-10-03）：标记了 checked 的默认项必须真正落进存档。
           原来只是给 <input> 加个 checked 外观，变量其实还是 undefined；
           玩家如果不手动点一下，"报名上课" 结算页就会满屏 NaN。 */
        if (def && curV === undefined) {
          execSet(vName + ' = ' + JSON.stringify(val));
          curV = val;
        }
        var rid = regHandler(function (e) {
          execSet(vName + ' = ' + JSON.stringify(val));
          Engine.save();
        });
        handlers[rid].gen = handlerGen;
        var checked = (curV === val) ? ' checked' : '';
        var gname = 'rb-' + String(vName).replace(/[^\w]/g, '_');
        o.parts.push('<input type="radio" class="macro-radiobutton" name="' + gname +
          '" value="' + String(val).replace(/"/g, '&quot;') +
          '" data-h="' + rid + '"' + checked + '>');
        return;
      }

      case 'include': case 'display': {
        var pname = evalExpr(a.split(/\s+/)[0]);
        if (pname && Story[pname]) renderNodes(parsePassage(Story[pname].src), o);
        return;
      }

      case 'widget': {
        /* widget 定义：在加载阶段处理，渲染时跳过 */
        return;
      }

      default: break;
    }

    /* 自定义 widget 调用 */
    if (Widgets[nm]) {
      callWidget(nm, a, o);
      return;
    }

    /* 未知宏：原样忽略 */
    o.parts.push('');
  }

  function truthy(v) { return !!v; }

  function callWidget(name, argSrc, o) {
    var def = Widgets[name];
    var args = argSrc ? splitArgs(argSrc, 0).map(function (x) {
      return evalExpr(x);
    }) : [];
    var savedArgs = State.args;
    State.args = args;
    try {
      renderNodes(def.body, o);
    } finally {
      State.args = savedArgs;
    }
  }

  function renderFor(nd, o) {
    var a = nd.args;
    var ri = /\brange\b/.exec(a);
    if (ri) {
      var head = a.slice(0, ri.index).trim();
      var src = a.slice(ri.index + 5).trim();
      var vars = splitArgs(head, 0).map(function (x) { return x.replace(/,/g, ' ').trim(); });
      var list = evalExpr(src);
      if (list === undefined || list === null) return;
      if (typeof list === 'string') list = list.split('');
      if (typeof list === 'number') return;
      var keys = Array.isArray(list) ? null : Object.keys(list);
      var n = keys ? keys.length : list.length;
      for (var i = 0; i < n; i++) {
        if (Nav.halt) return;
        var k = keys ? keys[i] : i;
        if (vars.length >= 2) { execSet(vars[0] + ' = ' + JSON.stringify(k)); execSet(vars[1] + ' = ' + JSON.stringify(list[k])); }
        else { execSet(vars[0] + ' = ' + JSON.stringify(Array.isArray(list) ? list[k] : k)); }
        renderNodes(nd.children, o);
      }
      return;
    }
    /* C 风格：_i to 0; _i < n; _i++ */
    var parts = a.split(';');
    if (parts.length >= 3) {
      execSet(parts[0]);
      var guard = 0;
      while (truthy(evalExpr(parts[1]))) {
        if (Nav.halt) return;
        renderNodes(nd.children, o);
        if (Nav.halt) return;
        execSet(parts[2]);
        if (++guard > 100000) { err(new Error('for 循环超过上限'), 'for'); break; }
      }
    }
  }

  /* =====================================================================
   * 8. Widget 注册 / 故事注册
   * ===================================================================== */
  function extractWidgets(name, src) {
    /* ★ 修 Bug（2026-10-03）：
       这里原来写的是 tokenize(src) —— tokenizer 产出的是"平铺的节点列表"，
       宏节点上根本没有 children，于是每个 widget 的 body 都是空数组，
       调用 <<Job_Generate>>、<<Job_Settle>>、<<Logic_Finance>> …… 全都等于什么都没做。
       必须先用 buildTree() 把节点组装成带 children 的树，才能取到 widget 的正文。 */
    var list = buildTree(tokenize(src));
    var i = 0;
    function walk(nodes) {
      for (var j = 0; j < nodes.length; j++) {
        var nd = nodes[j];
        if (nd.t === 'macro' && nd.name === 'widget' && !nd.closing) {
          var wname = evalExpr(nd.args.trim());
          Widgets[wname] = { name: wname, body: nd.children || [] };
        }
        if (nd.children) walk(nd.children);
        if (nd.branches) nd.branches.forEach(function (b) { walk(b.children); });
      }
    }
    walk(list);
  }

  function register(list) {
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var name = p.name.replace(/\s*\[.*?\]\s*$/, '');
      var tagsRaw = /\[(.*?)\]\s*$/.exec(p.name);
      p.__clean = name;
      p.__tags = tagsRaw ? tagsRaw[1].split(/\s+/) : [];
      Story[name] = p;
      if (p.__tags.indexOf('widget') >= 0) extractWidgets(name, p.src);
    }
    /* 兜底：任何 passage 都可能含有 widget 定义 */
    for (var k in Story) {
      if (Story[k].__tags.indexOf('widget') < 0 && /<<widget\b/.test(Story[k].src)) {
        extractWidgets(k, Story[k].src);
      }
    }
  }

  /* =====================================================================
   * 9. 显示 / 导航
   * ===================================================================== */
  var ui = { main: null, caption: null, bar: null };

  function display(name, opts) {
    /* Start = 重新开始（原 Twine 工程里没有这个块，这里兜底） */
    if (name === 'Start' || name === 'StoryInit') { Engine.newGame(); return; }
    /* 每次换页都先退出回看模式，避免上一页的只读状态残留 */
    Engine.readonly = false;
    if (!Story[name]) {
      ui.main.innerHTML = '<div class="engine-error">找不到 passage：<b>' +
        String(name) + '</b><br>请检查 passage 名称是否一致。</div>';
      return;
    }
    handlerGen++;
    purgeHandlers(handlerGen - 1);
    State.temp = {};
    Nav.pending = null; Nav.halt = false;
    State.passage = name;
    if (!(opts && opts.noHistory)) State.history.push(name);
    if (State.history.length > 200) State.history.shift();

    /* ★ 新增（2026-10-27）：剧情档案自动记录。
       每进一次剧情页，就把「这一章看过了、第一次看到是第几个月」写进 $story_seen。
       办公室 → 🎞️ 剧情档案 靠它列出已看过的章节，并且可以在只读模式下重看。
       只记录第一次（后面的月份不覆盖），旧存档没有这个字段也没关系。 */
    try {
      if (/^(Prologue_|Story_|Ending_|Game_Over|Game_Ending)/.test(name)) {
        var _sv = State.vars;
        if (!_sv.story_seen || typeof _sv.story_seen !== 'object') _sv.story_seen = {};
        if (!_sv.story_seen[name]) _sv.story_seen[name] = _sv.month || 0;
      }
    } catch (e) { }

    var o = outNew();
    try {
      renderNodes(parsePassage(Story[name].src), o);
    } catch (e) {
      err(e, '渲染 ' + name);
    }
    /* 顶层 <<goto>> 也要真正跳过去 */
    if (Nav.pending) {
      var nx = Nav.pending; Nav.pending = null; Nav.halt = false;
      if (nx !== name) return display(nx, opts);
    }
    ui.main.innerHTML = o.parts.join('');
    /* ★ 新增（2026-10-03）：清掉 <<stop>> / <<exit>> 留下的中断标记。
       否则它会让"本页所有按钮点下去都没反应"，而且侧边栏也跟着不刷新。 */
    Nav.halt = false;
    Engine.runTasks(o.tasks);
    renderCaption();
    window.scrollTo(0, 0);
  }

  function execPassage(name) {
    if (!Story[name]) return;
    var saved = Nav.pending;
    State.temp = {};
    var o = outNew();
    renderNodes(parsePassage(Story[name].src), o);
    Engine.runTasks(o.tasks);
    State.temp = {};
    Nav.pending = saved;
    Nav.halt = false;
  }

  function renderCaption() {
    if (!ui.caption) return;
    if (!Story['StoryCaption']) return;
    var keepTemp = State.temp;
    State.temp = {};
    var o = outNew();
    try { renderNodes(parsePassage(Story['StoryCaption'].src), o); }
    catch (e) { err(e, 'StoryCaption'); }
    State.temp = keepTemp;
    ui.caption.innerHTML = o.parts.join('');
    Engine.runTasks(o.tasks);
  }

  /* =====================================================================
   * 10. 存档
   * ===================================================================== */
  var SAVE_KEY = 'save_slot_1';
  var meta = { start: 'Start', title: '无垠娱乐' };

  /* 预览模式：换一个存档位，避免编辑器预览覆盖玩家真实进度 */
  function setPreview(on) {
    SAVE_KEY = on ? '__preview_slot__' : 'save_slot_1';
  }

  /* =====================================================================
   * 11. 错误显示
   * ===================================================================== */
  function err(e, where) {
    if (!Engine.quiet && console && console.error) console.error('[TweeEngine] ' + (where || '') + ' ->', e);
    Engine.lastErrors = Engine.lastErrors || [];
    Engine.lastErrors.push({ where: where, msg: (e && e.message) || String(e) });
    if (Engine.lastErrors.length > 30) Engine.lastErrors.shift();
  }

  /* =====================================================================
   * 12. 对外 API
   * ===================================================================== */
  var Engine = {
    version: '1.0',
    quiet: false,
    readonly: false,   /* true = 回看模式：只显示文字，不改数值、不跳页 */
    state: State,
    story: Story,
    widgets: Widgets,

    init: function (opts) {
      ui.main = document.getElementById(opts.main || 'passage-main');
      ui.caption = document.getElementById(opts.caption || 'ui-bar-caption');
      if (opts.start) meta.start = opts.start;
      if (opts.title) meta.title = opts.title;
      register(opts.passages || []);
      this.bindGlobal();
    },

    runTasks: function (tasks) {
      for (var i = 0; i < tasks.length; i++) {
        try { tasks[i](); } catch (e) { err(e, 'deferred task'); }
      }
    },

    bindGlobal: function () {
      var self = this;
      document.addEventListener('click', function (ev) {
        /* data-passage 直接跳转 */
        var dp = ev.target.closest ? ev.target.closest('[data-passage]') : null;
        var hEl = ev.target.closest ? ev.target.closest('[data-h]') : null;
        /* ★ 修 Bug（2026-10-27）：表单控件（radio / checkbox / textbox）不能在这里 preventDefault，
           否则浏览器不会真的勾选，视觉上「按不动」——变量其实改了，但界面看不出变化。
           交给下面的 change 委托处理。 */
        var isField = hEl && /^(INPUT|TEXTAREA|SELECT)$/.test(hEl.tagName);
        if (hEl && !isField) {
          var id = hEl.getAttribute('data-h');
          var fn = handlers[id];
          ev.preventDefault();
          ev.stopPropagation();
          if (fn) { try { fn(ev); } catch (e) { err(e, 'handler ' + id); } }
          return;
        }
        if (dp) {
          var t = dp.getAttribute('data-passage');
          ev.preventDefault();
          if (t) { display(t); self.save(); }
          return;
        }
        if (ev.target.tagName === 'A' && ev.target.getAttribute('href') === 'javascript:void(0)') {
          ev.preventDefault();
        }
      }, false);

      document.addEventListener('change', function (ev) {
        var hEl = ev.target.closest ? ev.target.closest('[data-h]') : null;
        if (hEl && hEl.type === 'radio') {
          var id = hEl.getAttribute('data-h');
          var fn = handlers[id];
          if (fn) { try { fn(ev); } catch (e) { err(e, 'radio ' + id); } }
        }
      }, false);
    },

    newGame: function () {
      State.vars = {}; State.temp = {}; State.args = [];
      State.history = [];
      Nav.pending = null; Nav.halt = false;
      execPassage('StoryInit');
      display(meta.start);
      this.save();
    },

    goto: function (name) { display(name); this.save(); },
    display: display,

    restart: function () {
      if (confirm('确定要重开人生吗？当前进度会全部清空。')) this.newGame();
    },

    save: function () {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          vars: State.vars, passage: State.passage, history: State.history
        }));
      } catch (e) { /* 忽略 */ }
    },

    load: function () {
      try {
        var raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        var d = JSON.parse(raw);
        State.vars = d.vars || {};
        State.history = d.history || [];
        State.temp = {};
        display(d.passage, { noHistory: true });
        return true;
      } catch (e) { err(e, 'load'); return false; }
    },

    hasSave: function () {
      try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
    },

    clearSave: function () {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
    },

    clearErrors: function () { this.lastErrors = []; },

    setPreview: setPreview,

    /* 调试：列出所有 passage */
    listPassages: function () { return Object.keys(Story); },

    /* 调试：拿到当前可点击的交互项 */
    debugHandlers: function () { return handlers; }
  };

  root.TweeEngine = Engine;
  root.Story = Story;

  /* 兼容原作里写死的 Engine.restart() */
  root.Engine = Engine;

})(typeof window !== 'undefined' ? window : globalThis);
