/* ==========================================================================
   i18n-core.js — 三语 UI 的跨页增强层（i18n-core 维护）
   职责：
     1. 键盘与无障碍：Alt+L 循环切换界面语言；切换后用 sr-only 的
        aria-live 区域播报「语言已切换为 …」（中/英/法三语，取当前界面语言）
     2. URL 同步：切换语言时用 history.replaceState 写入 ?lang=xx（不刷新页面），
        便于分享与自动化测试；读取仍由 lang.js 的 detect() 负责
     3. 首次访问引导：本机没有 fr.start.week 也没有 fr.placement.level 时，
        在右下角显示可关闭的提示条，引导去做 60 秒自评 / 选起点
     4. 进度动画：切换语言或起始位置后，给 .bar > i / .ring / .week.done
        一个短暂的过渡 + 脉冲，避免数值「跳变」
   依赖：lang.js 可选（提供 window.LANG）。lang.js、localStorage、history
        或相关 DOM 缺失时全部功能安全降级，绝不抛异常。
   加载位置：app.js 之后。
   暴露：window.I18N = { cycle(), setLang(code), dismissOnboard() }
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- 常量 ---------------- */
  var ORDER = ['zh', 'en', 'fr'];
  var NAMES = { zh: '中文', en: 'English', fr: 'français' }; /* 播报用（句中不大写） */
  var K_ONBOARD = 'fr.ui.onboard.dismissed';
  var K_START = 'fr.start.week';       /* 与 app.js 的 Progress.K.startWeek 一致 */
  var K_LEVEL = 'fr.placement.level';  /* 与 app.js 的 Progress.K.level 一致 */
  var HINT_ID = 'langHint';
  var LIVE_ID = 'i18nLive';
  var ANIM_MS = 700;

  /* lang.js 缺失时的兜底词典（与 lang.js 的 core.* 保持一致，仅用于降级） */
  var FALLBACK = {
    'core.langChanged': ['语言已切换为 {lang}', 'Language switched to {lang}', 'Langue changée en {lang}'],
    'core.onboard.title': ['先做 60 秒自评，选好你的起点',
      'Take the 60-second self-check and set your starting point',
      'Faites l\'auto-évaluation de 60 secondes et fixez votre point de départ'],
    'core.onboard.cta': ['去设置', 'Set it up', 'Configurer'],
    'core.onboard.close': ['关闭提示', 'Dismiss', 'Fermer'],
    'core.hintKey': ['提示：Alt+L 可切换界面语言',
      'Tip: press Alt+L to switch interface language',
      'Astuce : Alt+L pour changer la langue de l\'interface']
  };

  /* ---------------- 小工具（全部容错） ---------------- */
  function store(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* 私密模式忽略 */ }
  }
  function subst(s, vars) {
    if (!vars || typeof s !== 'string') return s;
    Object.keys(vars).forEach(function (k) {
      s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
    });
    return s;
  }
  function guessLang() {
    var L = window.LANG;
    if (L && typeof L.get === 'function') {
      try {
        var g = L.get();
        if (ORDER.indexOf(g) > -1) return g;
      } catch (e) { /* 继续兜底 */ }
    }
    var attr = document.documentElement && document.documentElement.getAttribute('data-lang');
    if (attr && ORDER.indexOf(attr) > -1) return attr;
    var nav = ((navigator && navigator.language) || 'zh').toLowerCase();
    if (nav.indexOf('fr') === 0) return 'fr';
    if (nav.indexOf('en') === 0) return 'en';
    return 'zh';
  }
  /* t()：优先用 lang.js 的词典；缺失或查不到时用本节内置的三语兜底 */
  function t(key, vars) {
    var L = window.LANG, s = null;
    if (L && typeof L.t === 'function') {
      try { s = L.t(key, vars); } catch (e) { s = null; }
    }
    if (typeof s !== 'string' || s === key) {
      var row = FALLBACK[key];
      if (row) {
        var i = ORDER.indexOf(guessLang());
        s = subst(row[i > -1 ? i : 0] || row[0], vars);
      } else if (typeof s !== 'string') {
        s = key;
      }
    }
    return s;
  }
  function byId(id) { return document.getElementById(id); }

  /* ---------------- 1. 无障碍播报区（sr-only + aria-live） ---------------- */
  function liveRegion() {
    var el = byId(LIVE_ID);
    if (el) return el;
    if (!document.body) return null;
    el = document.createElement('div');
    el.id = LIVE_ID;
    el.className = 'sr-only';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
    return el;
  }
  function announce(code) {
    var el = liveRegion();
    if (!el) return;
    var msg = t('core.langChanged', { lang: NAMES[code] || code });
    /* 先清空再写入，保证连续切换（或切回同一语言）时读屏仍会播报 */
    el.textContent = '';
    window.setTimeout(function () { el.textContent = msg; }, 20);
  }

  /* ---------------- 2. URL 同步（只写，不读） ---------------- */
  function syncURL(code) {
    if (!window.history || typeof window.history.replaceState !== 'function') return;
    var search = location.search || '';
    var next;
    if (/[?&]lang=[a-z]{2}/i.test(search)) {
      next = search.replace(/([?&])lang=[a-z]{2}/i, '$1lang=' + code);
    } else {
      next = search ? search + '&lang=' + code : '?lang=' + code;
    }
    try {
      window.history.replaceState(null, '', location.pathname + next + (location.hash || ''));
    } catch (e) { /* file:// 或受限环境会拒绝 replaceState：忽略，不影响切换 */ }
  }

  /* ---------------- 3. 进度动画（过渡 + 脉冲） ---------------- */
  var ANIM_SEL = '.bar > i, .ring, .week.done';
  var animTimer = null;

  function beginAnimation() {
    var root = document.documentElement;
    if (!root) return;
    root.classList.add('i18n-anim');
    var nodes = document.querySelectorAll(ANIM_SEL);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.classList.remove('i18n-flash');
      /* 读一次 offsetWidth 强制回流，连续切换时动画能重新播放 */
      void el.offsetWidth;
      el.classList.add('i18n-flash');
    }
    if (animTimer) window.clearTimeout(animTimer);
    animTimer = window.setTimeout(function () {
      root.classList.remove('i18n-anim');
      var left = document.querySelectorAll('.i18n-flash');
      for (var j = 0; j < left.length; j++) left[j].classList.remove('i18n-flash');
      animTimer = null;
    }, ANIM_MS);
  }

  /* ---------------- 4. 首次访问引导条 ---------------- */
  function needOnboard() {
    if (store(K_ONBOARD) === 'true') return false;
    return store(K_START) === null && store(K_LEVEL) === null;
  }
  function hideHint(persist) {
    if (persist) storeSet(K_ONBOARD, 'true');
    var box = byId(HINT_ID);
    if (!box) return;
    box.classList.add('hide');
    window.setTimeout(function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    }, 220);
  }
  function dismissOnboard() { hideHint(true); }

  function buildHint() {
    if (byId(HINT_ID) || !needOnboard() || !document.body) return;

    var box = document.createElement('div');
    box.className = 'lang-hint';
    box.id = HINT_ID;
    box.setAttribute('role', 'complementary');
    box.setAttribute('data-i18n-attr', 'aria-label:core.onboard.title');

    var body = document.createElement('div');
    body.className = 'lang-hint-body';

    var title = document.createElement('p');
    title.className = 'lang-hint-title mb-0';
    title.setAttribute('data-i18n', 'core.onboard.title');
    title.textContent = t('core.onboard.title');

    var tip = document.createElement('p');
    tip.className = 'small muted mb-0';
    tip.setAttribute('data-i18n', 'core.hintKey');
    tip.textContent = t('core.hintKey');

    body.appendChild(title);
    body.appendChild(tip);

    var cta = document.createElement('a');
    cta.className = 'btn btn-sm btn-primary lang-hint-cta';
    cta.id = 'langHintCta';
    cta.setAttribute('href', 'index.html#start'); /* 用 attribute 写法，任何环境都可读 */
    cta.setAttribute('data-i18n', 'core.onboard.cta');
    cta.textContent = t('core.onboard.cta');
    cta.addEventListener('click', function (e) {
      /* 当前页有 #start（首页）就地滚动；其他页按默认链接跳到 index.html#start */
      var target = byId('start');
      if (!target) return;
      e.preventDefault();
      if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      target.setAttribute('tabindex', '-1');
      try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
      dismissOnboard();
    });

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lang-hint-close';
    close.id = 'langHintClose';
    close.setAttribute('data-i18n-attr', 'aria-label:core.onboard.close;title:core.onboard.close');
    close.setAttribute('aria-label', t('core.onboard.close'));
    close.textContent = '\u2715';
    close.addEventListener('click', function () { dismissOnboard(); });

    box.appendChild(body);
    box.appendChild(cta);
    box.appendChild(close);
    document.body.appendChild(box);

    /* 让 lang.js 把 data-i18n* 应用到新节点（缺 lang.js 时文本已在上面写好） */
    if (window.LANG && typeof window.LANG.refresh === 'function') {
      try { window.LANG.refresh(); } catch (e) { /* 忽略 */ }
    }
  }

  /* 用户已经设定起点/自评后，静默收起提示条（不写 dismissed，语义上不算「关闭」） */
  function refreshOnboard() {
    if (!byId(HINT_ID)) return;
    if (!needOnboard()) hideHint(false);
  }

  /* ---------------- 5. 语言切换 / 热键 ---------------- */
  function currentLang() { return guessLang(); }

  function afterLangChange(code) {
    code = code || currentLang();
    syncURL(code);
    announce(code);
    beginAnimation();
  }

  function setLang(code) {
    code = String(code || '').toLowerCase();
    if (ORDER.indexOf(code) < 0) return false;
    var L = window.LANG;
    if (L && typeof L.set === 'function') {
      try {
        L.set(code); /* lang.js 会派发 langchange，由 onLangChange 统一收尾 */
      } catch (e) {
        afterLangChange(code);
      }
    } else {
      /* 没有 lang.js：只同步 URL / 播报 / 动画，页面文案维持原样，不报错 */
      afterLangChange(code);
    }
    return true;
  }
  function cycle() {
    var i = ORDER.indexOf(currentLang());
    return setLang(ORDER[(i + 1) % ORDER.length]);
  }

  function onLangChange(e) {
    var code = (e && e.detail && e.detail.lang) || currentLang();
    afterLangChange(code);
  }

  function onKeydown(e) {
    if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!(e.code === 'KeyL' || e.key === 'l' || e.key === 'L')) return;
    e.preventDefault();
    cycle();
  }

  /* 起点设定成功后再收起引导条（延后一拍，等 app.js 的处理器写完 localStorage） */
  function scheduleOnboardRefresh() {
    window.setTimeout(function () {
      try { refreshOnboard(); } catch (e) { /* 忽略 */ }
    }, 0);
  }
  /* 捕获阶段：在 lang.js / app.js 的元素级监听之前先开启过渡类，
     这样随后发生的数值变化才会被 transition 平滑地呈现，而不是「跳变」 */
  function onPreClick(e) {
    var el = e.target;
    if (!el || typeof el.closest !== 'function') return;
    var hit = el.closest('.lang-btn, .place-card, .week, #startWeekApply, #langHintCta');
    if (!hit) return;
    beginAnimation();
    if (hit.closest('.place-card, #startWeekApply')) scheduleOnboardRefresh();
  }
  function onPreChange(e) {
    var el = e.target;
    if (el && el.id === 'startWeekSelect') {
      beginAnimation();
      scheduleOnboardRefresh();
    }
  }

  /* 语言切换器按钮补上键盘快捷键语义 */
  function decorateSwitcher() {
    var box = byId('langSwitch');
    if (!box) return;
    var btns = box.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-keyshortcuts', 'Alt+L');
  }

  /* ---------------- 6. 启动 ---------------- */
  function init() {
    try {
      document.addEventListener('langchange', onLangChange);
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('click', onPreClick, true);
      document.addEventListener('change', onPreChange, true);
      liveRegion();
      buildHint();
      decorateSwitcher();
      /* 首次进入就带着 ?lang=xx 时，同步一次地址栏（归一化） */
      if (/[?&]lang=(zh|en|fr)/i.test(location.search || '')) syncURL(currentLang());
    } catch (e) { /* 任何异常都不应让页面崩溃 */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.I18N = {
    cycle: cycle,
    setLang: setLang,
    dismissOnboard: dismissOnboard,
    /* 供页面/测试查询，不属于对外契约 */
    _onboardVisible: function () { return !!byId(HINT_ID); },
    _refreshOnboard: refreshOnboard
  };
})();
