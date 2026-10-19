/* ==========================================================================
   法语 B2 一年学习站 · 共享脚本 (app.js)
   提供：导航高亮 / 学习进度(localStorage) / 法语朗读(Web Speech API)
        / 目录高亮 / 点击揭晓 / 闪卡 / 筛选 / 回到顶部
   约定：页面用 data-* 属性声明式调用，无需各页重复写 JS。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- 存储 ---------------- */
  var K = {
    start: 'fr.start.date',       // 起学日期 YYYY-MM-DD
    startWeek: 'fr.start.week',   // 起始周次 1-52（自定义开始学习的位置）
    level: 'fr.placement.level',  // 自评水平 a0/a1/a2/b1
    done: 'fr.weeks.done',        // 已完成周 ["1","2"]
    srs: 'fr.srs',                // 词汇掌握 {"bonjour":1}
    cat: 'fr.weekly.category'     // 每周投入档位
  };

  /* 自评水平 → 建议起始周 */
  var PLACEMENT = [
    { level: 'a0', week: 1, key: 'pl.a0' },
    { level: 'a1', week: 6, key: 'pl.a1' },
    { level: 'a2', week: 14, key: 'pl.a2' },
    { level: 'b1', week: 27, key: 'pl.b1' },
    { level: 'b2', week: 41, key: 'pl.b2' }
  ];

  function tr(key, vars) {
    return (window.LANG && window.LANG.t) ? window.LANG.t(key, vars) : key;
  }
  function fmtDateLocal(iso) {
    return (window.LANG && window.LANG.fmtDate) ? window.LANG.fmtDate(iso) : iso;
  }

  function get(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      if (v === null) return fallback;
      return JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 私密模式忽略 */ }
  }
  function todayISO() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  function addDays(iso, n) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  function daysBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  }
  function fmt(iso) {
    /* 日期按当前界面语言本地化（zh: 2026 年 10 月 15 日 / en: Oct 15, 2026 / fr: 15 oct. 2026） */
    return fmtDateLocal(iso);
  }
  /* 日期区间：优先用 lang.js 的实现，缺失时用本地 fmt 拼装（不能依赖未定义函数） */
  function fmtRange(a, b) {
    if (window.LANG && typeof window.LANG.fmtRange === 'function') return window.LANG.fmtRange(a, b);
    return fmt(a) + ' – ' + fmt(b);
  }

  /* 拿到（或初始化）起学日期 */
  function startDate() {
    var s = get(K.start, null);
    if (!s) { s = todayISO(); set(K.start, s); }
    return s;
  }

  /* ---------------- 进度模型 ---------------- */
  var Progress = {
    start: startDate,
    /* ---- 起始位置（从第几周开始学） ---- */
    startWeek: function () {
      var w = parseInt(get(K.startWeek, 1), 10);
      if (isNaN(w)) w = 1;
      return Math.max(1, Math.min(52, w));
    },
    setStartWeek: function (w) {
      w = Math.max(1, Math.min(52, parseInt(w, 10) || 1));
      set(K.startWeek, w);
      /* 从第 w 周开始 = 之前的周视为已学过，进度条因此不会从 0 起步 */
      var list = this.weeksDone().filter(function (x) { return parseInt(x, 10) >= w; });
      for (var i = 1; i < w; i++) list.push(String(i));
      list.sort(function (a, b) { return a - b; });
      set(K.done, list);
      return w;
    },
    /* 自评水平：返回 {level, week} 或 null */
    placement: function () {
      var lv = get(K.level, null);
      if (!lv) return null;
      for (var i = 0; i < PLACEMENT.length; i++) {
        if (PLACEMENT[i].level === lv) return PLACEMENT[i];
      }
      return null;
    },
    setPlacement: function (level) {
      set(K.level, level);
      var row = null;
      for (var i = 0; i < PLACEMENT.length; i++) if (PLACEMENT[i].level === level) row = PLACEMENT[i];
      if (row) this.setStartWeek(row.week);
      return row;
    },
    weeksDone: function () { return (get(K.done, []) || []).map(String); },
    isDone: function (n) { return this.weeksDone().indexOf(String(n)) > -1; },
    toggleWeek: function (n) {
      var list = this.weeksDone(), k = String(n), i = list.indexOf(k);
      if (i > -1) list.splice(i, 1); else list.push(k);
      list.sort(function (a, b) { return a - b; });
      set(K.done, list);
      return i === -1;
    },
    count: function () { return this.weeksDone().length; },
    /* 从起始位置起还需要学多少周 */
    remaining: function () { return 53 - this.startWeek(); },
    /* 当前应学到第几周：从起学日期算，但不少于起始周、不超过 52 */
    currentWeek: function () {
      var d = daysBetween(this.start(), todayISO());
      var base = this.startWeek();
      if (d < 0) return base;
      var w = base + Math.floor(d / 7);
      return Math.max(base, Math.min(52, w));
    },
    /* 第 n 周对应的日期区间（相对起学日期） */
    weekStart: function (n) { return addDays(this.start(), (parseInt(n, 10) - 1) * 7); },
    /* 课程时间轴位置（0-1） */
    elapsedRatio: function () {
      var d = daysBetween(this.start(), todayISO());
      return Math.max(0, Math.min(1, d / 364));
    },
    reset: function () {
      [K.done, K.srs, K.startWeek, K.level].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    }
  };

  /* ---------------- 导航高亮 ---------------- */
  function markNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop().split('#')[0];
      if (href && href === here) a.classList.add('active');
      /* 导航文字由 lang.js 通过 data-i18n 处理；此处仅兜底没有 key 的链接 */
      if (!a.hasAttribute('data-i18n')) {
        var map = { 'index.html': 'nav.home', 'calendar.html': 'nav.calendar', 'phonetics.html': 'nav.phonetics',
          'grammar.html': 'nav.grammar', 'vocab.html': 'nav.vocab', 'dialogue.html': 'nav.dialogue', 'exams.html': 'nav.exams' };
        if (map[href]) { a.setAttribute('data-i18n', map[href]); a.textContent = tr(map[href]); }
      }
    });
    var nav = document.querySelector('.nav-links');
    if (nav && !nav.hasAttribute('aria-label')) nav.setAttribute('aria-label', tr('nav.main'));
  }

  /* ---------------- 法语朗读 ---------------- */
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) {
      console.info('[app.js] 当前浏览器不支持语音合成，可改用页面上的音频资源。');
      return;
    }
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = rate || 0.92;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^fr(-|_)?/i.test(x.lang); })[0];
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* 忽略 */ }
  }
  if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = function () {}; }

  function initSpeak() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-speak]');
      if (!el) return;
      var txt = el.getAttribute('data-speak');
      if (!txt) {
        var host = el.closest('[data-fr]');
        txt = host ? host.getAttribute('data-fr') : el.textContent;
      }
      speak(txt.trim(), el.hasAttribute('data-slow') ? 0.6 : 0.92);
    });
    /* 给 .word .w-fr / .fr-line[data-fr] 自动加朗读按钮
       注意：属性选择器没有 != 写法，必须用 [attr]:not([attr="值"])，否则 querySelectorAll 抛 SyntaxError */
    document.querySelectorAll('.word .w-fr:not([data-noauto="1"]), .fr-line[data-fr]').forEach(function (node) {
      if (node.querySelector('.speak')) return;
      var btn = document.createElement('button');
      btn.className = 'speak';
      btn.type = 'button';
      btn.title = tr('speak.title');
      btn.setAttribute('aria-label', tr('speak.aria'));
      btn.textContent = '▶';
      btn.setAttribute('data-speak', node.getAttribute('data-fr') || node.textContent.replace('▶', '').trim());
      node.appendChild(document.createTextNode(' '));
      node.appendChild(btn);
    });
  }

  /* ---------------- 目录高亮 ---------------- */
  function initToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var a = map[en.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-70px 0px -70% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var t = document.getElementById(id);
      if (t) io.observe(t);
    });
  }

  /* ---------------- 点击揭晓 ---------------- */
  function initReveal() {
    document.addEventListener('click', function (e) {
      var r = e.target.closest('.reveal');
      if (r) {
        var q = r.closest('.quiz');
        if (q) {
          q.classList.toggle('open');
          r.textContent = q.classList.contains('open') ? tr('reveal.hide') : tr('reveal.show');
        }
        return;
      }
      var fc = e.target.closest('.flashcard');
      if (fc) fc.classList.toggle('flipped');
    });
  }

  /* ---------------- 筛选 ---------------- */
  function initFilter() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetSel = group.getAttribute('data-filter-group');
      var items = document.querySelectorAll(targetSel);
      group.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var want = chip.getAttribute('data-filter');
        items.forEach(function (it) {
          var tags = (it.getAttribute('data-tags') || '') + ' ' + (it.getAttribute('data-level') || '');
          var show = want === 'all' || tags.split(/\s+/).indexOf(want) > -1;
          it.classList.toggle('hidden', !show);
        });
        var cnt = document.querySelector(group.getAttribute('data-filter-count') || '');
        if (cnt) {
          var v = 0;
          items.forEach(function (it) { if (!it.classList.contains('hidden')) v++; });
          cnt.textContent = v;
        }
      });
    });
  }

  /* ---------------- 周计划交互（calendar.html） ---------------- */
  var _calRender = null; /* 供语言切换 / 起始周变化后重渲染 */

  function initCalendar() {
    var grid = document.getElementById('weekGrid');
    if (!grid) return;
    _calRender = renderWeekGrid;

    function renderWeekGrid() {
      var start = Progress.start();
      var cur = Progress.currentWeek();
      var base = Progress.startWeek();

      grid.querySelectorAll('.week').forEach(function (b) {
        var n = parseInt(b.getAttribute('data-week'), 10);
        var done = Progress.isDone(n);
        b.classList.toggle('done', done);
        b.setAttribute('aria-pressed', done ? 'true' : 'false');
        /* 起始位置之前的周：标记为「已跳过/已掌握」，视觉上淡出 */
        b.classList.toggle('past', n < base);
      });

      var cntEl = document.getElementById('doneCount');
      if (cntEl) cntEl.textContent = Progress.count();
      var barEl = document.getElementById('doneBar');
      if (barEl) barEl.style.width = (Progress.count() / 52 * 100).toFixed(1) + '%';
      /* 当前周：保留数值 span（校验脚本与外部引用依赖它），同时用整块标签避免「Semaine 1 周」这类混语。
         JS 可用时以整块标签为准，因此把数值 span 隐去，标签显示出来。 */
      var curEl = document.getElementById('currentWeekNo');
      if (curEl) curEl.textContent = cur;
      var curLbl = document.getElementById('currentWeekLabel');
      if (curLbl) {
        curLbl.textContent = tr('week.week', { n: cur });
        curLbl.hidden = false;
        if (curEl) curEl.hidden = true;
      }
      var dateEl = document.getElementById('currentWeekRange');
      if (dateEl) dateEl.textContent = fmtRange(Progress.weekStart(cur), addDays(Progress.weekStart(cur), 6));
      var firstEl = document.getElementById('startDateLabel');
      if (firstEl) firstEl.textContent = fmt(start);
      var endEl = document.getElementById('endDateLabel');
      if (endEl) endEl.textContent = fmt(addDays(start, 363));
      var daysEl = document.getElementById('elapsedDays');
      if (daysEl) daysEl.textContent = Math.max(0, daysBetween(start, todayISO()));
      var baseEl = document.getElementById('startWeekLabel');
      if (baseEl) baseEl.textContent = tr('week.week', { n: base });
      var remEl = document.getElementById('remainWeekCount');
      if (remEl) remEl.textContent = Progress.remaining();
      var sel = document.getElementById('startWeekSelect');
      if (sel) sel.value = String(base);
      renderPlacementUI('calPlacement');
    }

    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.week');
      if (!b) return;
      Progress.toggleWeek(b.getAttribute('data-week'));
      renderWeekGrid();
      var d = document.getElementById('weekDetail');
      if (d) showWeek(d, b.getAttribute('data-week'));
    });

    renderWeekGrid();

    /* 首次进入直接把"当前应学周"的清单展开，避免看到空白面板 */
    var detail = document.getElementById('weekDetail');
    if (detail) showWeek(detail, String(curNow()));
  }

  function curNow() { return Progress.currentWeek(); }

  /* 自评水平卡片：在首页与日历页共用 */
  function renderPlacementUI(containerId) {
    var box = document.getElementById(containerId);
    if (!box || box.dataset.built === '1') {
      if (box && box.dataset.built === '1') syncPlacementUI(box);
      return;
    }
    var html = '<div class="grid grid-4">';
    PLACEMENT.forEach(function (p) {
      html += '<button type="button" class="card card-link place-card" data-place="' + p.level + '">' +
        '<h4 class="mb-0">' + tr('pl.name.' + p.level) + ' <span class="badge badge-' + p.level + '">' + p.level.toUpperCase() + '</span></h4>' +
        '<p class="small mb-1" data-i18n="pl.desc.' + p.level + '">' + tr('pl.desc.' + p.level) + '</p>' +
        '<p class="small mb-0"><strong>' + tr('pl.from') + '</strong> ' + tr('week.week', { n: p.week }) + '</p>' +
        '</button>';
    });
    html += '</div>';
    box.innerHTML = html;
    box.dataset.built = '1';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-place]');
      if (!b) return;
      Progress.setPlacement(b.getAttribute('data-place'));
      if (_calRender) _calRender();
      renderDashboard();
      syncPlacementUI(box);
      var note = document.getElementById('placeChosen');
      if (note) {
        var row = Progress.placement();
        note.textContent = row ? tr('pl.chosen', { week: row.week }) : '';
      }
    });
    if (window.LANG && window.LANG.refresh) window.LANG.refresh();
    syncPlacementUI(box);
  }

  function syncPlacementUI(box) {
    var row = Progress.placement();
    box.querySelectorAll('[data-place]').forEach(function (b) {
      b.classList.toggle('selected', !!row && b.getAttribute('data-place') === row.level);
    });
  }

  function showWeek(box, n) {
    var el = document.getElementById('wk-' + n);
    if (!el) return;
    /* 标题与等级在「周卡片」上（data-title / data-level），详情块只有正文。
       标题优先走三语词典 week.{n}.title（lang-weeks.js 注册），缺失时回退到卡片上的中文。 */
    var card = document.querySelector('#weekGrid .week[data-week="' + n + '"]');
    var zhTitle = (card && card.getAttribute('data-title')) || el.getAttribute('data-title') || '';
    var key = 'week.' + n + '.title';
    var localized = tr(key);
    var title = (localized && localized !== key) ? localized : zhTitle;
    var level = ((card && card.getAttribute('data-level')) || el.getAttribute('data-level') || 'A1').toLowerCase();
    var ws = Progress.weekStart(n);
    box.innerHTML =
      '<div class="flex between"><h3 class="mb-0">' + tr('week.week', { n: n }) + ' · ' + title + '</h3>' +
      '<span class="badge badge-' + level + '">' + level.toUpperCase() + '</span></div>' +
      '<p class="muted small mt-1">' + fmtRange(ws, addDays(ws, 6)) + '</p>' +
      '<div class="mt-2">' + el.innerHTML + '</div>';
  }

  /* ---------------- 首页仪表盘 ---------------- */
  function renderDashboard() {
    var d = document.getElementById('dash');
    if (!d) return;
    var start = Progress.start(), cur = Progress.currentWeek(), done = Progress.count();
    var base = Progress.startWeek();
    var set_ = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set_('dStart', fmt(start));
    set_('dCurWeek', cur);
    set_('dDone', done);
    set_('dLeft', Progress.remaining());
    set_('dPhase', phaseOf(cur));
    set_('dBaseWeek', tr('week.week', { n: base }));
    set_('remainWeekCount', Progress.remaining());
    var sel = document.getElementById('startWeekSelect');
    if (sel) sel.value = String(base);
    var ring = document.getElementById('dRing');
    if (ring) {
      ring.style.setProperty('--p', done / 52 * 100);
      var inner = ring.querySelector('span');
      if (inner) inner.textContent = Math.round(done / 52 * 100) + '%';
    }
    var pos = document.getElementById('dPos');
    if (pos) pos.style.width = (done / 52 * 100).toFixed(1) + '%';
    var els = document.getElementById('dElapsed');
    if (els) els.textContent = Math.max(0, daysBetween(start, todayISO()));
    var rangeEl = document.getElementById('dCurRange');
    if (rangeEl) rangeEl.textContent = fmtRange(Progress.weekStart(cur), addDays(Progress.weekStart(cur), 6));
    renderPlacementUI('placeOptions');
    var note = document.getElementById('placeChosen');
    if (note) {
      var row = Progress.placement();
      note.textContent = row ? tr('pl.chosen', { week: row.week }) : '';
    }
  }

  function initDashboard() { renderDashboard(); }

  function phaseOf(week) {
    if (week <= 12) return tr('phase.a1');
    if (week <= 26) return tr('phase.a2');
    if (week <= 40) return tr('phase.b1');
    return tr('phase.b2');
  }

  /* ---------------- 回到顶部 ---------------- */
  function initTop() {
    var b = document.querySelector('.to-top');
    if (!b) return;
    window.addEventListener('scroll', function () {
      b.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* 起始周下拉：首页与日历页共用（同一个 id，只会在其中一页出现） */
  function initStartControls() {
    var sel = document.getElementById('startWeekSelect');
    if (!sel) return;
    if (!sel.options.length) {
      for (var w = 1; w <= 52; w++) {
        var o = document.createElement('option');
        o.value = String(w);
        o.textContent = 'W' + (w < 10 ? '0' + w : w);
        sel.appendChild(o);
      }
    }
    sel.value = String(Progress.startWeek());

    function applyWeek() {
      Progress.setStartWeek(sel.value);
      renderDashboard();
      if (_calRender) _calRender();
      var detail = document.getElementById('weekDetail');
      if (detail && document.getElementById('weekGrid')) showWeek(detail, String(Progress.startWeek()));
    }
    sel.addEventListener('change', applyWeek);
    var btn = document.getElementById('startWeekApply');
    if (btn) btn.addEventListener('click', applyWeek);
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    /* app.js 依赖 lang.js 在页首加载；若因故缺失，降级为英文 key 也不会崩。
       每个初始化步骤单独 try/catch：一处失败不能拖垮整页交互。 */
    var steps = [markNav, initSpeak, initToc, initReveal, initFilter, initCalendar,
      initDashboard, initStartControls, initTop];
    var errors = [];
    steps.forEach(function (fn) {
      try { fn(); } catch (e) {
        errors.push(fn.name + ': ' + e.message);
        if (window.console && console.error) console.error('[app.js] ' + fn.name + ' 失败', e);
      }
    });
    window.__frBootErrors = errors;
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    /* 语言或起始位置变化后，重渲染由 JS 生成的文案与日期 */
    document.addEventListener('langchange', function () {
      [markNav, renderDashboard, initStartControls].forEach(function (fn) {
        try { fn(); } catch (e) { if (window.console && console.error) console.error(e); }
      });
      if (_calRender) { try { _calRender(); } catch (e) {} }
      var detail = document.getElementById('weekDetail');
      if (detail && document.getElementById('weekGrid')) { try { showWeek(detail, String(Progress.currentWeek())); } catch (e) {} }
      if (window.LANG && window.LANG.refresh) window.LANG.refresh();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.FR = {
    speak: speak, Progress: Progress, get: get, set: set, K: K, startDate: startDate, fmt: fmt,
    PLACEMENT: PLACEMENT, renderDashboard: renderDashboard, t: tr
  };
})();
