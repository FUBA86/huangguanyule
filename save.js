/* =====================================================================
 *  save.js —— 存档系统（重写版）
 *  ---------------------------------------------------------------------
 *  为什么要重写：
 *   1. 老版只在一个 localStorage 键里裸写 JSON，写失败被 try/catch 静默吞掉，
 *      于是「点了存档、提示已保存、其实什么都没写进去」。
 *   2. 只有一个按键、没有槽位、没有时间戳，玩家无法确认到底存没存上。
 *   3. 换端口 / 换浏览器 / 手机打开，localStorage 就是另一套，进度凭空消失。
 *
 *  现在的做法：
 *   · 4 个槽位：自动 + 手动 1/2/3。自动槽每次翻页静默覆盖，手动槽只有你点才写。
 *   · 每次写入都真实校验（写完立刻读回来比对），失败会说清楚原因。
 *   · 存档中心可以看每个槽的「第几月 / 资金 / 时间」，存/读/删一目了然。
 *   · 支持导出成一个 .json 文件带走，换设备、换端口都能导入回来。
 *   · 旧版 save_slot_1 会自动迁移到手动 1，老进度不会丢。
 * ===================================================================== */
(function (root) {
  'use strict';

  var Engine = root.TweeEngine;
  if (!Engine) return;

  var NS = 'wy_save_v3_';
  var KEY_META = NS + 'meta';
  var SLOTS = ['auto', 's1', 's2', 's3'];
  var SLOT_NAME = { auto: '自动存档', s1: '手动存档 1', s2: '手动存档 2', s3: '手动存档 3' };

  var enabled = true;      /* 编辑器预览 / 只读模式下关掉 */
  var current = 's1';      /* 手动存档默认写这里 */
  var lastError = '';

  /* ------------------------------------------------------------------
   * 1. 安全序列化：函数、DOM、循环引用一律丢掉，绝不因为一个脏数据整档失败
   * ------------------------------------------------------------------ */
  function clean(v, seen, depth) {
    if (v === null) return null;
    var t = typeof v;
    if (t === 'number') return isFinite(v) ? v : 0;
    if (t === 'string' || t === 'boolean') return v;
    if (t === 'undefined' || t === 'function' || t === 'symbol') return undefined;
    if (t !== 'object') return String(v);

    if (typeof Node !== 'undefined' && v instanceof Node) return undefined;
    if (depth > 10) return undefined;
    if (seen.indexOf(v) >= 0) return undefined;   /* 循环引用 */
    seen.push(v);

    var out, i, k, cv;
    if (Object.prototype.toString.call(v) === '[object Array]') {
      out = [];
      for (i = 0; i < v.length; i++) {
        cv = clean(v[i], seen, depth + 1);
        out.push(cv === undefined ? null : cv);
      }
    } else if (v instanceof Date) {
      out = v.getTime();
    } else {
      out = {};
      for (k in v) {
        if (!Object.prototype.hasOwnProperty.call(v, k)) continue;
        cv = clean(v[k], seen, depth + 1);
        if (cv !== undefined) out[k] = cv;
      }
    }
    seen.pop();
    return out;
  }

  function snapshot() {
    var S = Engine.state;
    return {
      passage: S.passage,
      vars: clean(S.vars, [], 0) || {},
      history: (S.history || []).slice(-300)
    };
  }

  /* ------------------------------------------------------------------
   * 2. 底层读写
   * ------------------------------------------------------------------ */
  function store() {
    try { return root.localStorage; } catch (e) { return null; }
  }

  function readMeta() {
    try {
      var ls = store();
      var raw = ls && ls.getItem(KEY_META);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeMeta(m) {
    try { store().setItem(KEY_META, JSON.stringify(m)); } catch (e) { }
  }

  function readSlot(id) {
    try {
      var ls = store();
      var raw = ls && ls.getItem(NS + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function removeSlot(id) {
    try {
      store().removeItem(NS + id);
      var m = readMeta(); delete m[id]; writeMeta(m);
    } catch (e) { }
  }

  /* 真正的写入：写完立刻读回来比对，确认字节真的落盘 */
  function writeSlot(id, payload) {
    var ls = store();
    if (!ls) { lastError = '这个浏览器不允许网页保存数据'; return { ok: false, msg: lastError }; }
    if (!enabled) { lastError = '当前是预览 / 回看模式，不写入存档'; return { ok: false, msg: lastError }; }

    var json;
    try {
      json = JSON.stringify(payload);
    } catch (e) {
      /* 极端情况：还是序列化失败，退化成「只存标量」再试一次 */
      try {
        var lean = { v: payload.v, at: payload.at, month: payload.month, money: payload.money, passage: payload.passage, vars: {}, history: [] };
        for (var k in payload.vars) {
          var val = payload.vars[k];
          if (val === null || typeof val !== 'object') {
            try { JSON.stringify(val); lean.vars[k] = val; } catch (e2) { }
          }
        }
        json = JSON.stringify(lean);
        lastError = '部分数据无法保存，已跳过';
      } catch (e3) {
        lastError = '数据太复杂，存不进去（' + (e.name || 'Error') + '）';
        return { ok: false, msg: lastError };
      }
    }

    function put(text) {
      ls.setItem(NS + id, text);
      return ls.getItem(NS + id) === text;
    }

    try {
      if (!put(json)) { lastError = '写入后被浏览器丢弃了'; return { ok: false, msg: lastError }; }
    } catch (e) {
      /* 空间不够：先砍历史记录再试 */
      try {
        var slim = JSON.parse(json);
        slim.history = [];
        json = JSON.stringify(slim);
        if (!put(json)) throw e;
      } catch (e2) {
        var nm = e && e.name || '';
        if (nm === 'QuotaExceededError' || nm === 'NS_ERROR_DOM_QUOTA_REACHED') {
          lastError = '浏览器存储空间满了，请到存档中心删掉旧存档';
        } else if (nm === 'SecurityError') {
          lastError = '浏览器禁止了本地存储（隐私模式 / 直接双击打开）';
        } else {
          lastError = '写入失败：' + (e.message || nm || '未知原因');
        }
        return { ok: false, msg: lastError };
      }
    }

    var m = readMeta() || {};
    m[id] = {
      at: payload.at, month: payload.month, money: payload.money,
      passage: payload.passage, size: json.length
    };
    writeMeta(m);
    return { ok: true, msg: '已写入 ' + json.length + ' 字节', size: json.length };
  }

  function fmtTime(ms) {
    if (!ms) return '—';
    var d = new Date(ms);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ------------------------------------------------------------------
   * 3. 核心 API
   * ------------------------------------------------------------------ */
  var Save = {

    /* 关掉写入（编辑器预览用） */
    setEnabled: function (on) { enabled = !!on; },
    isEnabled: function () { return enabled; },
    lastError: function () { return lastError; },

    /* 自动存档：每次翻页静默调用，永远只写 auto 槽 */
    auto: function () {
      if (!enabled) return { ok: false, msg: 'disabled' };
      var S = Engine.state;
      if (!S.passage) return { ok: false, msg: '还没开始' };
      var snap = snapshot();
      return writeSlot('auto', {
        v: 3, at: Date.now(),
        month: (snap.vars && snap.vars.month) || 0,
        money: (snap.vars && snap.vars.money) || 0,
        passage: snap.passage, vars: snap.vars, history: snap.history
      });
    },

    /* 手动存档到某个槽 */
    save: function (id) {
      id = id || current;
      var S = Engine.state;
      if (!S.passage) return { ok: false, msg: '还没开始游戏' };
      var snap = snapshot();
      var r = writeSlot(id, {
        v: 3, at: Date.now(),
        month: (snap.vars && snap.vars.month) || 0,
        money: (snap.vars && snap.vars.money) || 0,
        passage: snap.passage, vars: snap.vars, history: snap.history
      });
      if (r.ok) Save.auto();     /* 顺手把自动槽也刷成同一时刻 */
      return r;
    },

    /* 读某个槽 */
    load: function (id) {
      var d = readSlot(id || Save.newest());
      if (!d || !d.vars) return { ok: false, msg: '这个槽是空的' };
      /* 先把数值装回去——就算页面渲染失败，进度也不能丢 */
      Engine.state.vars = d.vars;
      Engine.state.history = d.history || [];
      Engine.state.temp = {};
      var month = d.vars.month || 0;
      try {
        Engine.display(d.passage, { noHistory: true });
      } catch (e) {
        /* 存档里记的那一页渲染不出来（比如版本变动），退回到办公室，数值仍然保住 */
        try { Engine.display('Office', { noHistory: true }); } catch (e2) { }
        return { ok: true, msg: '已回到第 ' + month + ' 月（原页面打不开，先落在办公室）' };
      }
      return { ok: true, msg: '已回到第 ' + month + ' 月' };
    },

    /* 最新的槽（含自动），启动时恢复它 */
    newest: function () {
      var m = readMeta(), best = null, bt = -1;
      for (var i = 0; i < SLOTS.length; i++) {
        var s = m[SLOTS[i]];
        if (s && s.at > bt) { bt = s.at; best = SLOTS[i]; }
      }
      return best;
    },

    has: function () { return !!Save.newest(); },
    meta: function () { return readMeta() || {}; },
    slotName: function (id) { return SLOT_NAME[id] || id; },

    clear: function (id) {
      if (id) { removeSlot(id); return; }
      for (var i = 0; i < SLOTS.length; i++) removeSlot(SLOTS[i]);
    },

    /* -------- 导出 / 导入（换设备、换端口唯一可靠的办法） -------- */
    exportFile: function () {
      var out = { app: '无垠娱乐CEO', v: 3, at: Date.now(), slots: {} };
      for (var i = 0; i < SLOTS.length; i++) {
        var d = readSlot(SLOTS[i]);
        if (d) out.slots[SLOTS[i]] = d;
      }
      if (!Object.keys(out.slots).length) return { ok: false, msg: '还没有任何存档可以导出' };
      try {
        var blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '无垠娱乐存档_' + fmtTime(Date.now()).replace(/[\/ :]/g, '-') + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        return { ok: true, msg: '已导出存档文件' };
      } catch (e) {
        return { ok: false, msg: '导出失败：' + (e.message || e.name) };
      }
    },

    importText: function (text) {
      var d;
      try { d = JSON.parse(text); } catch (e) { return { ok: false, msg: '这不是有效的存档文件' }; }
      if (!d || !d.slots) return { ok: false, msg: '存档文件格式不对' };
      var n = 0;
      for (var i = 0; i < SLOTS.length; i++) {
        var id = SLOTS[i];
        if (d.slots[id]) {
          var r = writeSlot(id, d.slots[id]);
          if (r.ok) n++;
        }
      }
      return n ? { ok: true, msg: '导入了 ' + n + ' 个存档' } : { ok: false, msg: '一个都没导进来' };
    },

    importFile: function (file, cb) {
      var fr = new FileReader();
      fr.onload = function () { cb(Save.importText(String(fr.result))); };
      fr.onerror = function () { cb({ ok: false, msg: '文件读不出来' }); };
      fr.readAsText(file);
    },

    setCurrent: function (id) { current = id; },
    getCurrent: function () { return current; },

    /* ------------------------------------------------------------------
     * 4. 存档中心（自带样式，不依赖别的组件）
     * ------------------------------------------------------------------ */
    open: function (intent) {
      if (document.getElementById('wy-sv-mask')) return;
      injectStyle();

      var mask = document.createElement('div');
      mask.id = 'wy-sv-mask';
      mask.className = 'sv-mask';
      mask.innerHTML = '<div class="sv-sheet" role="dialog" aria-label="存档中心">' +
        '<div class="sv-hd"><span class="sv-hd-t">💾 存档中心</span>' +
        '<button class="sv-x" type="button" aria-label="关闭">✕</button></div>' +
        '<div class="sv-tip">点一行右边的按钮就能存档或读档。自动存档每次翻页都会更新，手动存档只有你自己点了才写。</div>' +
        '<div class="sv-list"></div>' +
        '<div class="sv-io">' +
        '<button type="button" class="sv-btn" data-act="export">⬇️ 导出存档文件</button>' +
        '<button type="button" class="sv-btn" data-act="import">⬆️ 导入存档</button>' +
        '<input type="file" accept=".json,application/json" class="sv-file" hidden>' +
        '</div>' +
        '<div class="sv-foot">换手机或换了打开方式后进度不见了？用「导出」存一个文件，新设备用「导入」拿回来就行。</div>' +
        '</div>';
      document.body.appendChild(mask);

      var listEl = mask.querySelector('.sv-list');

      function refresh() {
        var m = Save.meta();
        var html = '';
        for (var i = 0; i < SLOTS.length; i++) {
          var id = SLOTS[i], s = m[id];
          var isAuto = id === 'auto';
          html += '<div class="sv-row' + (s ? '' : ' is-empty') + '" data-slot="' + id + '">' +
            '<div class="sv-row-l">' +
            '<div class="sv-row-t">' + SLOT_NAME[id] + (isAuto ? '<span class="sv-auto">自动</span>' : '') + '</div>' +
            '<div class="sv-row-s">' + (s
              ? '第 ' + (s.month || 0) + ' 月 · 资金 ' + (s.money || 0) + ' 万 · ' + fmtTime(s.at)
              : '空') + '</div>' +
            '</div>' +
            '<div class="sv-row-b">' +
            (isAuto ? '' : '<button type="button" data-act="save" class="sv-btn sv-btn-save">存入</button>') +
            '<button type="button" data-act="load" class="sv-btn sv-btn-load"' + (s ? '' : ' disabled') + '>读取</button>' +
            '<button type="button" data-act="del" class="sv-btn sv-btn-del"' + (s ? '' : ' disabled') + '>删除</button>' +
            '</div></div>';
        }
        listEl.innerHTML = html;
      }

      function close() { if (mask.parentNode) mask.parentNode.removeChild(mask); }

      function toast(msg, tone) {
        if (root.UI && root.UI.toast) root.UI.toast(msg, { tone: tone || 'ok' });
      }

      listEl.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button');
        if (!btn) return;
        var row = ev.target.closest('.sv-row');
        var id = row && row.getAttribute('data-slot');
        var act = btn.getAttribute('data-act');
        if (!id) return;

        if (act === 'save') {
          var r = Save.save(id);
          toast(r.ok ? '已存入「' + SLOT_NAME[id] + '」· 第 ' + (Engine.state.vars.month || 0) + ' 月' : ('存档失败：' + r.msg),
            r.ok ? 'ok' : 'danger');
          refresh();
        } else if (act === 'load') {
          var rr = Save.load(id);
          if (rr.ok) { toast(rr.msg, 'ok'); close(); }
          else toast(rr.msg, 'danger');
        } else if (act === 'del') {
          (root.UI && root.UI.confirm ? root.UI.confirm('删掉「' + SLOT_NAME[id] + '」这个存档？删了就找不回来了。', { danger: true, okText: '删掉' })
            : Promise.resolve(true)).then(function (yes) {
              if (yes) { Save.clear(id); toast('已删除', 'ok'); refresh(); }
            });
        }
      });

      mask.addEventListener('click', function (ev) {
        if (ev.target === mask) close();
        var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
        if (act === 'export') {
          var r = Save.exportFile();
          toast(r.ok ? r.msg : r.msg, r.ok ? 'ok' : 'danger');
        } else if (act === 'import') {
          mask.querySelector('.sv-file').click();
        }
      });

      mask.querySelector('.sv-x').addEventListener('click', close);
      mask.querySelector('.sv-file').addEventListener('change', function (ev) {
        var f = ev.target.files && ev.target.files[0];
        if (!f) return;
        Save.importFile(f, function (r) {
          toast(r.msg, r.ok ? 'ok' : 'danger');
          refresh();
        });
        ev.target.value = '';
      });

      refresh();
      if (intent === 'save') {
        var first = listEl.querySelector('[data-slot="s1"] [data-act="save"]');
        if (first) setTimeout(function () { try { first.focus(); } catch (e) { } }, 60);
      }
    }
  };

  /* ------------------------------------------------------------------
   * 5. 样式（只在第一次打开时注入）
   * ------------------------------------------------------------------ */
  function injectStyle() {
    if (document.getElementById('wy-sv-style')) return;
    var css = '' +
      '.sv-mask{position:fixed;inset:0;z-index:9998;background:rgba(28,39,60,.42);backdrop-filter:blur(6px);' +
      'display:flex;align-items:center;justify-content:center;padding:16px;animation:svIn .16s ease both;}' +
      '@keyframes svIn{from{opacity:0}to{opacity:1}}' +
      '.sv-sheet{width:min(520px,100%);max-height:86vh;overflow:auto;background:#fff;border-radius:20px;' +
      'box-shadow:0 30px 70px -30px rgba(30,45,70,.55);padding:18px 18px 14px;}' +
      '.sv-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}' +
      '.sv-hd-t{font-size:17px;font-weight:900;color:#22314E;letter-spacing:.02em;}' +
      '.sv-x{border:0;background:#F1F5FB;color:#7C8CA6;width:30px;height:30px;border-radius:50%;' +
      'font-size:14px;cursor:pointer;line-height:1;}' +
      '.sv-tip{font-size:12px;line-height:1.7;color:#8494AC;margin:2px 0 12px;}' +
      '.sv-row{display:flex;align-items:center;gap:10px;padding:11px 12px;border:1px solid #E5EDF8;' +
      'border-radius:14px;background:linear-gradient(160deg,#FBFDFF,#F5F9FE);margin-bottom:9px;}' +
      '.sv-row.is-empty{background:#FAFBFD;border-style:dashed;}' +
      '.sv-row-l{flex:1 1 auto;min-width:0;}' +
      '.sv-row-t{font-size:13.5px;font-weight:800;color:#22314E;display:flex;align-items:center;gap:6px;}' +
      '.sv-auto{font-size:10px;font-weight:800;color:#4A6FA3;background:#E9F1FC;border-radius:999px;padding:1px 7px;}' +
      '.sv-row-s{font-size:11.5px;color:#8A98AE;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.sv-row-b{display:flex;gap:6px;flex:0 0 auto;}' +
      '.sv-btn{border:1px solid #DCE7F6;background:#fff;color:#3E5B8C;font-size:12px;font-weight:700;' +
      'padding:7px 11px;border-radius:10px;cursor:pointer;white-space:nowrap;font-family:inherit;}' +
      '.sv-btn:hover:not(:disabled){background:#EFF5FE;}' +
      '.sv-btn:disabled{opacity:.42;cursor:default;}' +
      '.sv-btn-save{background:#2F4A7C;border-color:#2F4A7C;color:#fff;}' +
      '.sv-btn-save:hover{background:#263D66;}' +
      '.sv-btn-del{color:#B4515F;border-color:#F0D9DD;}' +
      '.sv-io{display:flex;gap:8px;margin-top:4px;flex-wrap:wrap;}' +
      '.sv-io .sv-btn{flex:1 1 auto;background:#F5F8FD;}' +
      '.sv-foot{font-size:11px;line-height:1.65;color:#A2AEC1;margin-top:10px;}' +
      '@media (max-width:520px){' +
      '.sv-sheet{padding:15px 14px 12px;border-radius:18px;}' +
      '.sv-row{flex-wrap:wrap;}' +
      '.sv-row-b{width:100%;justify-content:flex-end;}' +
      '.sv-row-b .sv-btn{flex:1 1 0;padding:9px 6px;}' +
      '}';
    var st = document.createElement('style');
    st.id = 'wy-sv-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  root.Save = Save;

  /* ------------------------------------------------------------------
   * 6. 接管引擎原有的存档接口（故事里的 Engine.save() 继续可用）
   * ------------------------------------------------------------------ */
  var _origSetPreview = Engine.setPreview;
  Engine.setPreview = function (on) {
    if (_origSetPreview) _origSetPreview.call(Engine, on);
    Save.setEnabled(!on);
    if (on) showBanner('编辑器预览模式 · 进度不会保存', '#B4813A', '#FDF7EC');
  };

  Engine.save = function () { return Save.auto(); };
  Engine.load = function () {
    var id = Save.newest();
    var r = id ? Save.load(id) : { ok: false };
    return !!r.ok;
  };
  Engine.hasSave = function () { return Save.has(); };
  Engine.clearSave = function () { Save.clear(); };

  /* ★ 修 Bug（2026-10-29）：重开按钮以前"点了没反应"。
     原因：ui.js 为了接管原生弹窗，把 window.confirm 换成了
     `function(){ confirmBox(msg); return false; }` —— 永远返回 false，
     而 Engine.restart() 写的是 `if (confirm(...)) newGame()`，
     条件永远不成立，于是按钮按下去什么都不会发生。
     这里改成用 UI.confirm 的 Promise 版本。 */
  Engine.restart = function () {
    var self = this;
    var ask = function () {
      if (root.UI && root.UI.confirm) {
        root.UI.confirm('确定要重开人生吗？\n\n· 自动存档会被新的第 1 月覆盖\n· 手动存档 1/2/3 不会被删，随时可以读回来',
          { danger: true, okText: '重开', cancelText: '再看看', title: '重开人生' })
          .then(function (yes) {
            if (yes) { self.newGame(); if (root.UI.toast) UI.toast('已重新开始', { tone: 'ok' }); }
          });
      } else if (root.confirm('确定要重开人生吗？当前进度会全部清空。')) {
        self.newGame();
      }
    };
    ask();
  };

  /* ------------------------------------------------------------------
   * 7. 环境提示条：直接双击打开 / 预览模式
   * ------------------------------------------------------------------ */
  function showBanner(text, color, bg) {
    if (document.getElementById('wy-env-bar')) return;
    var d = document.createElement('div');
    d.id = 'wy-env-bar';
    d.textContent = text;
    /* 放在页面最上面（不浮动），这样永远不会盖住正文或侧栏的存档键 */
    d.style.cssText = 'position:relative;z-index:9990;' +
      'padding:9px 14px;font:12.5px/1.5 system-ui,sans-serif;' +
      'color:' + color + ';background:' + bg + ';border-bottom:1px solid rgba(0,0,0,.06);text-align:center;';
    document.body.insertBefore(d, document.body.firstChild);
  }

  root.addEventListener('load', function () {
    /* 直接双击 html 打开：很多浏览器在这种协议下不给存 */
    if (location.protocol === 'file:') {
      showBanner('这是直接双击文件打开的（file://），部分浏览器不保存进度 —— 请用网址打开：GitHub Pages 链接，或「启动游戏.bat」', '#8A6A2B', '#FDF7EC');
      return;
    }
    /* 浏览器整体禁了本地存储（隐私模式等），提前告诉玩家 */
    try {
      root.localStorage.setItem('__wytest__', '1');
      root.localStorage.removeItem('__wytest__');
    } catch (e) {
      showBanner('这个浏览器不允许网页保存数据（可能是隐私/无痕模式），进度不会留下来', '#A83B4C', '#FDF1F3');
    }
  });

  /* ------------------------------------------------------------------
   * 8. 老存档迁移：老版本只有一个 save_slot_1
   *    ★ 必须现在就做（不能等 load 事件）——index.html 的启动脚本在这之后
   *      就会读取「最新的槽」，晚一步就会以为你没有存档、直接开新游戏。
   * ------------------------------------------------------------------ */
  (function migrateLegacy() {
    try {
      if (!root.localStorage) return;
      var legacy = root.localStorage.getItem('save_slot_1');
      if (!legacy) return;
      if (readSlot('s1')) return;           /* 已经有新存档就不动它 */
      var d = JSON.parse(legacy);
      if (!d || !d.vars) return;
      writeSlot('s1', {
        v: 3, at: Date.now(),
        month: d.vars.month || 0, money: d.vars.money || 0,
        passage: d.passage, vars: d.vars, history: d.history || []
      });
    } catch (e) { }
  })();

  /* 页面关闭 / 切到后台前再兜一次，防止最后一步没存上 */
  root.addEventListener('pagehide', function () { try { Save.auto(); } catch (e) { } });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { try { Save.auto(); } catch (e) { } }
  });

})(window);
