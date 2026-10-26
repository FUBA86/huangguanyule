/* =========================================================================
 *  UI Kit —— 自定义弹窗 / 轻提示
 *  ---------------------------------------------------------------------
 *  作用：接管游戏里所有的 alert() / confirm()，换成更好看的模态框。
 *  ★ 这个文件只管"外观"，不影响任何剧情与数值逻辑。
 * ========================================================================= */
(function (root) {
  'use strict';

  var doc = document;

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* 把【系统通知】这类前缀提出来当标题 */
  function splitTitle(msg) {
    var s = String(msg == null ? '' : msg).trim();
    var m = /^【(.+?)】\s*/.exec(s);
    if (m) return { title: m[1], body: s.slice(m[0].length).trim() };
    var m2 = /^\[(.+?)\]\s*/.exec(s);
    if (m2) return { title: m2[1], body: s.slice(m2[0].length).trim() };
    return null;
  }

  /* =====================================================================
   *  Modal
   * ===================================================================== */
  var queue = [];       // 弹窗队列，避免多个 alert 叠在一起
  var current = null;   // 当前弹窗的关闭函数

  function closeTop(result) {
    var done = current;
    current = null;
    if (done) done(result);
    // 队列里还有就接着弹
    setTimeout(function () {
      if (!current && queue.length) queue.shift()();
    }, 130);
  }

  /**
   * opts: { title, body, html, tone: 'brand'|'ok'|'warn'|'danger',
   *         icon, sub, buttons: [{label, value, kind}] }
   * 返回 Promise，resolve 被点击按钮的 value
   */
  function modal(opts) {
    opts = opts || {};
    var tone = opts.tone || 'brand';
    var icon = opts.icon || { brand: '💬', ok: '✅', warn: '⚠️', danger: '⛔' }[tone] || '💬';
    var buttons = opts.buttons && opts.buttons.length
      ? opts.buttons
      : [{ label: '知道了', value: true, kind: 'primary' }];

    return new Promise(function (resolve) {
      var root_ = el('div', 'wy-modal-root');
      root_.appendChild(el('div', 'wy-modal-mask'));

      var box = el('div', 'wy-modal');
      box.setAttribute('data-tone', tone);
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');

      var head = el('div', 'wy-modal-head');
      head.appendChild(el('div', 'wy-modal-icon', esc(icon)));
      var tw = el('div');
      if (opts.sub) tw.appendChild(el('div', 'wy-modal-sub', esc(opts.sub)));
      tw.appendChild(el('h3', 'wy-modal-title', esc(opts.title || '提示')));
      head.appendChild(tw);
      box.appendChild(head);

      var body = el('div', 'wy-modal-body');
      if (opts.html) body.innerHTML = opts.html;
      else body.textContent = String(opts.body == null ? '' : opts.body);
      box.appendChild(body);

      var foot = el('div', 'wy-modal-foot');
      buttons.forEach(function (b) {
        var btn = el('button', 'wy-btn wy-btn-' + (b.kind || 'ghost'), esc(b.label));
        btn.type = 'button';
        btn.addEventListener('click', function () {
          closeTop(b.value);
        });
        foot.appendChild(btn);
      });
      box.appendChild(foot);

      root_.appendChild(box);
      doc.body.appendChild(root_);

      // 焦点给主按钮（仅桌面端，触屏设备不抢焦点以免出现焦点框）
      var isTouch = false;
      try {
        isTouch = window.matchMedia &&
          !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      } catch (e) { isTouch = false; }
      if (!isTouch) {
        var focusTarget = foot.querySelector('.wy-btn-primary') || foot.querySelector('.wy-btn');
        if (focusTarget) setTimeout(function () { try { focusTarget.focus(); } catch (e) { } }, 40);
      }

      function cleanup() {
        doc.removeEventListener('keydown', onKey, true);
        if (root_.parentNode) root_.parentNode.removeChild(root_);
      }

      function onKey(e) {
        if (!current) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          var cancelBtn = buttons.filter(function (b) { return b.value === false; })[0];
          closeTop(cancelBtn ? cancelBtn.value : (buttons[0] && buttons[0].value));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          closeTop(buttons[buttons.length - 1].value);
        }
      }
      doc.addEventListener('keydown', onKey, true);

      // 点遮罩关闭（仅对单按钮的提示类弹窗）
      root_.querySelector('.wy-modal-mask').addEventListener('click', function () {
        if (buttons.length === 1) closeTop(buttons[0].value);
        else {
          box.animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' },
             { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }],
            { duration: 220 }
          );
        }
      });

      current = function (value) {
        cleanup();
        resolve(value);
      };
    });
  }

  function enqueue(fn) {
    if (current) queue.push(fn);
    else fn();
  }

  /* ---------- alert ---------- */
  function alertBox(msg, opts) {
    opts = opts || {};
    var parsed = splitTitle(msg);
    return new Promise(function (resolve) {
      enqueue(function () {
        modal({
          title: opts.title || (parsed ? parsed.title : (opts.title || '系统提示')),
          sub: opts.sub || (parsed ? '' : 'NOTICE'),
          body: parsed ? parsed.body : String(msg),
          tone: opts.tone || (parsed ? 'brand' : 'brand'),
          icon: opts.icon,
          buttons: [{ label: opts.okText || '知道了', value: true, kind: 'primary' }]
        }).then(resolve);
      });
    });
  }

  /* ---------- confirm ---------- */
  function confirmBox(msg, opts) {
    opts = opts || {};
    var parsed = splitTitle(msg);
    return new Promise(function (resolve) {
      enqueue(function () {
        modal({
          title: opts.title || (parsed ? parsed.title : '请确认'),
          sub: opts.sub || 'CONFIRM',
          body: parsed ? parsed.body : String(msg),
          tone: opts.tone || 'warn',
          icon: opts.icon || '🤔',
          buttons: [
            { label: opts.cancelText || '再想想', value: false, kind: 'ghost' },
            { label: opts.okText || '确定', value: true, kind: opts.danger ? 'danger' : 'primary' }
          ]
        }).then(resolve);
      });
    });
  }

  /* =====================================================================
   *  Toast
   * ===================================================================== */
  function toastRoot() {
    var r = doc.getElementById('wy-toast-root');
    if (!r) {
      r = el('div', 'wy-toast-root');
      r.id = 'wy-toast-root';
      doc.body.appendChild(r);
    }
    return r;
  }
  function toast(msg, opts) {
    opts = opts || {};
    var t = el('div', 'wy-toast');
    t.setAttribute('data-tone', opts.tone || 'brand');
    t.appendChild(el('span', 'dot'));
    t.appendChild(el('span', '', esc(msg)));
    toastRoot().appendChild(t);
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 280);
    }, opts.duration || 2200);
  }

  /* =====================================================================
   *  接管原生 alert / confirm
   * ===================================================================== */
  root.alert = function (msg) { return alertBox(msg); };
  root.confirm = function (msg) { confirmBox(msg); return false; };

  var UI = {
    modal: modal,
    alert: alertBox,
    confirm: confirmBox,
    toast: toast,
    /* 兼容命名 */
    notify: function (m, o) { return alertBox(m, o); }
  };
  root.UI = UI;

  /* =====================================================================
   *  按钮写法自检 / 自动修正
   *  ---------------------------------------------------------------------
   *  引擎里 `<<button "文字" "目标">>` 的第二个参数是"要跳去哪一屏"。
   *  有些地方误写成了 CSS 类名（如 "btn-primary"），点击就会报
   *  「找不到 passage：btn-primary」，而且按钮里的 <<set>> 一行都执行不到。
   *  这里在启动时扫描一遍：凡是目标不是真实页面、又长得像类名的，
   *  自动改写成引擎认识的 class="..." 写法。
   * ===================================================================== */
  function auditTargets() {
    var S = (root.TweeEngine && root.TweeEngine.story) || root.Story;
    if (!S) return;
    var names = Object.keys(S);
    var fixed = 0, warned = [];

    /* 自动修正：<<button "X" "btn-xxx">>  →  <<button "X" class="btn-xxx">> */
    var re = /<<(button|link)(\s+)"((?:[^"\\]|\\.)*)"(\s+)"(btn-[A-Za-z0-9_-]+)"/g;
    for (var k in S) {
      var src = S[k] && S[k].src;
      if (!src) continue;
      var out = src.replace(re, function (m, tag, s1, label, s2, cls) {
        if (names.indexOf(cls) >= 0) return m;       // 真有同名页面就别动
        fixed++;
        return '<<' + tag + s1 + '"' + label + '"' + s2 + 'class="' + cls + '"';
      });
      if (out !== src) S[k].src = out;
    }

    /* 只警告不修改：其他可疑的跳转目标 */
    var reAll = /<<(button|link|goto)\s+(?:"[^"]*"\s+)?"([A-Za-z_][^"]*)"/g;
    var re2 = /\[\[([^\]]*)\|([^\]]+)\]\]/g;
    for (var k2 in S) {
      var s2 = S[k2] && S[k2].src;
      if (!s2) continue;
      var m1, m2;
      while ((m1 = reAll.exec(s2))) if (names.indexOf(m1[2]) < 0) warned.push([k2, m1[2]]);
      while ((m2 = re2.exec(s2))) {
        var t = m2[2].trim().replace(/^['"]|['"]$/g, '');
        if (names.indexOf(t) < 0) warned.push([k2, t]);
      }
    }
    if (fixed) {
      console.warn('[UI] 自动修正了 ' + fixed + ' 处按钮写法' +
        '（第二个参数应是 class="..." 而不是 "..."）。建议把源文件也改一遍。');
    }
    if (warned.length) {
      console.warn('[UI] 以下跳转目标不存在对应页面，点击可能没反应：',
        warned.slice(0, 20));
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', auditTargets);
  else auditTargets();

  /* =====================================================================
   *  引擎重开：改用自定义确认框（原生 confirm 已被接管）
   * ===================================================================== */
  function patchEngine() {
    var E = root.TweeEngine || root.Engine;
    if (!E) return false;
    if (E.__uiPatched) return true;
    E.__uiPatched = true;
    E.restart = function () {
      UI.confirm('确定要重开人生吗？当前进度会全部清空。', {
        title: '重开游戏',
        okText: '确认重开',
        cancelText: '再想想',
        danger: true,
        icon: '🔄'
      }).then(function (ok) {
        if (ok) E.newGame();
      });
    };
    return true;
  }
  if (!patchEngine()) {
    doc.addEventListener('DOMContentLoaded', patchEngine);
  }

  /* =====================================================================
   *  通用跳转：data-go / data-set
   *  ---------------------------------------------------------------------
   *  写法：<a class="side-link" data-go="Fan_Management"
   *             data-set='{"current_actor":"qs"}'>…</a>
   *  为什么不直接用 data-passage：点侧栏时经常要"顺手改一个变量"
   *  （比如"看谁的粉丝"），data-passage 只会跳页面、改变量得另写一套。
   *  data-set 必须是合法 JSON（用双引号），外层属性建议用单引号包住。
   * ===================================================================== */
  function navTo(el) {
    var target = el.getAttribute('data-go');
    if (!target) return;
    var E = root.TweeEngine || root.Engine;
    if (!E) return;
    /* data-actor：侧栏里每个艺人块都能一键定位到"正在说谁" */
    var actor = el.getAttribute('data-actor');
    if (actor) E.state.vars.current_actor = actor;
    var raw = el.getAttribute('data-set');
    if (raw) {
      try {
        var obj = JSON.parse(raw);
        for (var k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) E.state.vars[k] = obj[k];
        }
      } catch (e) {
        console.warn('[UI] data-set 不是合法 JSON：', raw);
      }
    }
    /* 手机端：点完自动收起状态面板，否则会挡住新页面 */
    try {
      if (root.matchMedia && root.matchMedia('(max-width: 980px)').matches) {
        var bar = doc.getElementById('ui-bar');
        if (bar) bar.classList.remove('open');
      }
    } catch (e) { }
    E.goto(target);
  }

  /* 用捕获阶段，抢在引擎自己的点击处理之前，避免重复触发 */
  doc.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-go]') : null;
    if (!el) return;
    ev.preventDefault();
    ev.stopPropagation();
    navTo(el);
  }, true);

  /* 键盘可达：回车 / 空格 */
  doc.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
    var el = ev.target.closest ? ev.target.closest('[data-go]') : null;
    if (!el) return;
    ev.preventDefault();
    navTo(el);
  }, true);

  /* =====================================================================
   *  正文切换时重播入场动画（引擎直接改 innerHTML，这里用观察器补一刀）
   * ===================================================================== */
  /* 叙事类页面的名字特征：序章 / 各幕剧情 / 各种结局 */
  var STORY_PASSAGE_RE = /^(Prologue_|Story_|Ending_|Game_Ending|Game_Over)/;

  function watchPassage() {
    var main = doc.getElementById('passage-main');
    if (!main) return;
    var last = '';

    /* 剧情页氛围判定：页面名属于叙事章节，或正文里有 .story-card */
    function applyStoryMode() {
      try {
        var pn = (root.TweeEngine && root.TweeEngine.state.passage) || '';
        var isStory = STORY_PASSAGE_RE.test(pn) || !!main.querySelector('.story-card');
        doc.body.classList.toggle('story-mode', isStory);
      } catch (e) { }
    }

    new MutationObserver(function () {
      var html = main.innerHTML;
      if (html === last) return;
      last = html;
      main.style.animation = 'none';
      void main.offsetWidth;   // 强制回流，重启动画
      main.style.animation = '';
      applyStoryMode();
    }).observe(main, { childList: true, characterData: true, subtree: true });

    /* 首次进入时也立即判定一次：
       —— 修复「用 ?p=页面名 直接打开剧情页」时首屏漏挂剧情氛围的问题 */
    applyStoryMode();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', watchPassage);
  else watchPassage();

})(typeof window !== 'undefined' ? window : globalThis);
