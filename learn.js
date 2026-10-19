/* ==========================================================================
   learn.js — 按日学习流：日期网格 → 当日步骤逐个推进 → 例题判分 → 错题本
   依赖：lang.js（三语）、app.js（FR.Progress / FR.t）、daily-data.js（window.DAILY）
        quiz-bank.js（window.QUIZ_BANK）、exam-items.js（window.EXAM_ITEMS）
   本文件只做「逻辑 + DOM 结构」，视觉样式见 styles.css 第 18 节。
   任何外部数据缺失时都安全降级（不抛异常）。
   ========================================================================== */
(function () {
  'use strict';

  var K = {
    done: 'fr.learn.done',      // 已完成步骤 key ["w1d1s0", …]
    day: 'fr.learn.day',        // 最近打开的日子 {week, day}
    quiz: 'fr.quiz.done',       // 已答对的题 id
    wrong: 'fr.quiz.wrong',     // 错题本
    stats: 'fr.quiz.stats'      // {answered, correct}
  };
  var LAST_DAY = 364;

  function read(key, fb) {
    try { var v = localStorage.getItem(key); return v === null ? fb : JSON.parse(v); }
    catch (e) { return fb; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function t(key, vars) {
    if (window.LANG && window.LANG.t) return window.LANG.t(key, vars);
    return key;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function weekOf(dayIndex) { return Math.floor((dayIndex - 1) / 7) + 1; }
  function dayOf(dayIndex) { return ((dayIndex - 1) % 7) + 1; }

  /* ======================= 题库 ======================= */
  function allBankItems() {
    var out = [];
    var bank = window.QUIZ_BANK || {};
    Object.keys(bank).forEach(function (lv) {
      var skills = bank[lv] || {};
      Object.keys(skills).forEach(function (sk) {
        (skills[sk] || []).forEach(function (q) { out.push(q); });
      });
    });
    return out;
  }
  var BANK_INDEX = null;
  function bankIndex() {
    if (!BANK_INDEX) BANK_INDEX = {};
    var before = Object.keys(BANK_INDEX).length;
    /* 数据可能是分片异步加载的：每次调用都补齐新到的题目（廉价，且有 before 判空）*/
    var full = before > 0;
    if (!full) {
      allBankItems().forEach(function (q) { if (q && q.id) BANK_INDEX[q.id] = q; });
      var weeks = (window.DAILY && window.DAILY.weeks) || [];
      weeks.forEach(function (w) {
        (w.days || []).forEach(function (d) {
          (d.steps || []).forEach(function (s) {
            (s.quiz || []).forEach(function (q) {
              if (q && q.id && !q.ref && !BANK_INDEX[q.id]) BANK_INDEX[q.id] = q;
            });
          });
        });
      });
    }
    return BANK_INDEX;
  }
  /* 题库/逐日数据异步到达后，作废旧索引并重画（否则点题时查不到答案、
     或在数据到达前渲染出空面板）。真正的实现放在文件后半段（依赖 gridBox 等）。*/
  function byId(qid) {
    var idx = bankIndex();
    if (idx[qid]) return idx[qid];
    var items = window.EXAM_ITEMS || [];
    for (var i = 0; i < items.length; i++) {
      var qs = items[i].questions || [];
      for (var j = 0; j < qs.length; j++) if (qs[j].id === qid) return qs[j];
    }
    return null;
  }
  /* 契约第 3 节的题库引用：ref = "bank:<skill>:<level>:<keyword>" */
  function resolveRef(ref) {
    if (typeof ref !== 'string' || ref.indexOf('bank:') !== 0) return null;
    var parts = ref.split(':');
    var skill = parts[1], level = parts[2], kw = (parts[3] || '').toLowerCase();
    var pool = allBankItems().filter(function (q) {
      if (skill && q.skill !== skill) return false;
      if (level && q.level !== level) return false;
      if (kw) {
        var hay = ((q.source || '') + ' ' + (q.prompt || '') + ' ' + (q.explain || '')).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });
    if (!pool.length) return null;
    /* 用 id 做确定性选择，保证同一天每次看到的题一致 */
    var seed = 0;
    for (var i = 0; i < ref.length; i++) seed = (seed * 31 + ref.charCodeAt(i)) % 100000;
    return pool[seed % pool.length];
  }
  function itemOf(q) {
    if (!q) return null;
    if (q.ref) return resolveRef(q.ref);
    return q;
  }
  /* 真题大题引用：契约第 4 节 —— { ref: "exam:<skill>:<level>:<keyword>" } */
  function resolveExamRef(ref) {
    if (typeof ref !== 'string' || ref.indexOf('exam:') !== 0) return null;
    var parts = ref.split(':');
    var skill = parts[1], level = parts[2], kw = (parts[3] || '').toLowerCase();
    var pool = (window.EXAM_ITEMS || []).filter(function (x) {
      if (skill && x.skill !== skill) return false;
      if (level && x.level !== level) return false;
      if (kw) {
        var hay = ((x.title || '') + ' ' + (x.textFr || '') + ' ' + (x.instructions || '')).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });
    if (!pool.length) return null;
    var seed = 0;
    for (var i = 0; i < ref.length; i++) seed = (seed * 31 + ref.charCodeAt(i)) % 100000;
    return pool[seed % pool.length];
  }

  /* ======================= 错题本 ======================= */
  var WrongBook = {
    list: function () { return read(K.wrong, []) || []; },
    has: function (qid) { return this.list().some(function (w) { return w.id === qid; }); },
    add: function (item, from) {
      if (!item || !item.id) return;
      var list = this.list();
      if (list.some(function (w) { return w.id === item.id; })) return;
      list.push({
        id: item.id, prompt: item.prompt, options: item.options, answer: item.answer,
        explain: item.explain, source: item.source, level: item.level, skill: item.skill,
        at: new Date().toISOString(), from: from || ''
      });
      write(K.wrong, list);
      document.dispatchEvent(new CustomEvent('learnchange'));
    },
    remove: function (qid) {
      write(K.wrong, this.list().filter(function (w) { return w.id !== qid; }));
      document.dispatchEvent(new CustomEvent('learnchange'));
    },
    clear: function () { write(K.wrong, []); document.dispatchEvent(new CustomEvent('learnchange')); }
  };

  /* ======================= 判分 ======================= */
  var Stats = {
    get: function () { return read(K.stats, { answered: 0, correct: 0 }); },
    bump: function (ok) {
      var s = this.get();
      s.answered++;
      if (ok) s.correct++;
      write(K.stats, s);
    }
  };
  function norm(s) {
    return String(s == null ? '' : s).trim().toLowerCase()
      .replace(/[’‘`]/g, "'").replace(/\s+/g, ' ');
  }
  var Quiz = {
    check: function (qid, opt) {
      var item = byId(qid);
      if (!item) return { ok: false, unknown: true };
      var ok = norm(opt) === norm(item.answer);
      Stats.bump(ok);
      if (!ok) WrongBook.add(item, item.__from || '');
      else {
        var doneQ = read(K.quiz, []);
        if (doneQ.indexOf(qid) < 0) { doneQ.push(qid); write(K.quiz, doneQ); }
      }
      return { ok: ok, answer: item.answer, explain: item.explain, source: item.source };
    },
    answeredRight: function (qid) { return (read(K.quiz, []) || []).indexOf(qid) > -1; }
  };

  /* ======================= 步骤与进度 ======================= */
  function weekData(week) {
    var weeks = (window.DAILY && window.DAILY.weeks) || [];
    for (var i = 0; i < weeks.length; i++) if (Number(weeks[i].week) === Number(week)) return weeks[i];
    return null;
  }
  function dayData(week, day) {
    var w = weekData(week);
    if (!w) return null;
    var ds = w.days || [];
    for (var i = 0; i < ds.length; i++) if (Number(ds[i].day) === Number(day)) return ds[i];
    return null;
  }
  var Learn = {
    doneList: function () { return read(K.done, []) || []; },
    isDone: function (key) { return this.doneList().indexOf(key) > -1; },
    markDone: function (key) {
      var l = this.doneList();
      if (l.indexOf(key) < 0) { l.push(key); write(K.done, l); document.dispatchEvent(new CustomEvent('learnchange')); }
    },
    unmark: function (key) {
      write(K.done, this.doneList().filter(function (x) { return x !== key; }));
      document.dispatchEvent(new CustomEvent('learnchange'));
    },
    stepKey: function (week, day, stepIdx) { return 'w' + week + 'd' + day + 's' + stepIdx; },
    dayDone: function (week, day) {
      var d = dayData(week, day);
      if (!d || !(d.steps || []).length) return false;
      var self = this;
      return d.steps.every(function (_, i) { return self.isDone(self.stepKey(week, day, i)); });
    },
    dayProgress: function (week, day) {
      var d = dayData(week, day);
      if (!d || !(d.steps || []).length) return { done: 0, total: 0 };
      var self = this, done = 0;
      d.steps.forEach(function (_, i) { if (self.isDone(self.stepKey(week, day, i))) done++; });
      return { done: done, total: d.steps.length };
    },
    /* 由起学日期推算「今天该学第几天」（第 1 天 = 起学日） */
    today: function () {
      var start = (window.FR && window.FR.Progress && window.FR.Progress.start)
        ? window.FR.Progress.start() : null;
      if (!start) return { week: 1, day: 1, index: 1 };
      var d0 = new Date(start + 'T00:00:00');
      var now = new Date();
      var diff = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - d0) / 86400000);
      var idx = Math.max(1, Math.min(LAST_DAY, diff + 1));
      return { week: weekOf(idx), day: dayOf(idx), index: idx };
    },
    dayIndex: function (week, day) { return (Number(week) - 1) * 7 + Number(day); },
    dateOf: function (week, day) {
      var start = (window.FR && window.FR.Progress && window.FR.Progress.start)
        ? window.FR.Progress.start() : null;
      if (!start) return '';
      var d = new Date(start + 'T00:00:00');
      d.setDate(d.getDate() + this.dayIndex(week, day) - 1);
      var iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      return (window.LANG && window.LANG.fmtDate) ? window.LANG.fmtDate(iso) : iso;
    },
    saveLast: function (week, day) { write(K.day, { week: Number(week), day: Number(day) }); },
    lastDay: function () {
      var d = read(K.day, null);
      if (d && d.week >= 1 && d.week <= 52 && d.day >= 1 && d.day <= 7) return d;
      return this.today();
    }
  };

  /* ======================= 渲染：364 天日期网格 ======================= */
  var STEP_ICON = { vocab: '词', grammar: '法', listen: '听', speak: '说', read: '读', write: '写', review: '复' };

  function renderDayGrid(box) {
    if (!box) return;
    var today = Learn.today();
    var frag = document.createDocumentFragment();

    for (var w = 1; w <= 52; w++) {
      var wk = weekData(w);
      var row = el('div', 'daygrid-row');
      var head = el('div', 'daygrid-week');
      head.appendChild(el('span', 'dw-n', 'W' + (w < 10 ? '0' + w : w)));
      if (wk && wk.level) {
        var b = el('span', 'badge badge-' + String(wk.level).toLowerCase(), wk.level);
        head.appendChild(b);
      }
      head.setAttribute('title', (wk && wk.theme) || '');
      row.appendChild(head);

      for (var d = 1; d <= 7; d++) {
        var dd = dayData(w, d);
        var key = w + '-' + d;
        var cell = el('button', 'daycell');
        cell.type = 'button';
        cell.setAttribute('data-week', String(w));
        cell.setAttribute('data-day', String(d));
        cell.setAttribute('data-key', key);

        var idx = Learn.dayIndex(w, d);
        var st = new Date();
        var isToday = (idx === today.index);
        var prog = Learn.dayProgress(w, d);
        var dayDone = Learn.dayDone(w, d);
        var hasWrong = false;
        if (dd && dd.steps) {
          for (var si = 0; si < dd.steps.length && !hasWrong; si++) {
            var qs = dd.steps[si].quiz || [];
            for (var qi = 0; qi < qs.length; qi++) {
              var it = itemOf(qs[qi]);
              if (it && WrongBook.has(it.id)) { hasWrong = true; break; }
            }
          }
        }
        cell.classList.toggle('is-today', isToday);
        cell.classList.toggle('is-done', dayDone);
        cell.classList.toggle('is-partial', !dayDone && prog.done > 0);
        cell.classList.toggle('has-wrong', hasWrong);

        cell.appendChild(el('span', 'dc-d', 'D' + d));
        cell.appendChild(el('span', 'dc-t', (dd && dd.theme) ? dd.theme : '—'));
        var meta = el('span', 'dc-m', prog.total ? prog.done + '/' + prog.total : '0/0');
        cell.appendChild(meta);
        cell.setAttribute('aria-label',
          t('learn.weekDay', { w: w, d: d }) + ' · ' + ((dd && dd.theme) || ''));
        row.appendChild(cell);
      }
      frag.appendChild(row);
    }

    box.innerHTML = '';
    box.appendChild(frag);
    var legend = el('p', 'muted small mt-2');
    legend.setAttribute('data-i18n', 'learn.legend');
    legend.textContent = t('learn.legend');
    box.appendChild(legend);
    if (window.LANG && window.LANG.refresh) window.LANG.refresh();
  }

  /* ======================= 渲染：当日学习面板 ======================= */
  var ctx = { week: 1, day: 1, step: 0 };

  function renderDay(box, week, day) {
    if (!box) return;
    ctx.week = Number(week); ctx.day = Number(day);
    Learn.saveLast(ctx.week, ctx.day);
    paintDay(box);
  }

  function paintDay(box) {
    var w = ctx.week, d = ctx.day;
    var dd = dayData(w, d);
    var wk = weekData(w);
    var prog = Learn.dayProgress(w, d);
    box.innerHTML = '';

    /* 标题行 */
    var head = el('div', 'flex between');
    var h = el('div');
    var h3 = el('h3', 'mb-0');
    h3.textContent = t('learn.weekDay', { w: w, d: d }) + ' · ' + ((dd && dd.theme) || (wk && wk.theme) || '');
    h.appendChild(h3);
    var sub = el('p', 'muted small mb-0');
    sub.textContent = Learn.dateOf(w, d) + ' · ' + t('learn.stepProgress', { done: prog.done, total: prog.total });
    h.appendChild(sub);
    head.appendChild(h);
    if (wk && wk.level) head.appendChild(el('span', 'badge badge-' + String(wk.level).toLowerCase(), wk.level));
    box.appendChild(head);

    /* 进度条 */
    var bar = el('div', 'bar mt-2');
    var fill = el('i');
    fill.style.width = (prog.total ? (prog.done / prog.total * 100) : 0).toFixed(1) + '%';
    bar.appendChild(fill);
    box.appendChild(bar);

    if (!dd || !(dd.steps || []).length) {
      var empty = el('p', 'muted', t('learn.noContent'));
      box.appendChild(empty);
      return;
    }

    /* 步骤导航条 */
    var nav = el('div', 'stepnav mt-3');
    dd.steps.forEach(function (s, i) {
      var active = i === ctx.step;
      var done = Learn.isDone(Learn.stepKey(w, d, i));
      var btn = el('button', 'stepdot' + (active ? ' active' : '') + (done ? ' done' : ''));
      btn.type = 'button';
      btn.setAttribute('data-step', String(i));
      btn.title = s.title || '';
      btn.appendChild(el('span', 'sd-i', STEP_ICON[s.type] || '·'));
      btn.appendChild(el('span', 'sd-n', String(i + 1)));
      nav.appendChild(btn);
    });
    box.appendChild(nav);

    /* 当前步骤正文 */
    var step = dd.steps[ctx.step] || dd.steps[0];
    var card = el('div', 'stepcard mt-3');
    var top = el('div', 'flex between');
    var tl = el('div', 'flex');
    tl.appendChild(el('span', 'badge badge-step', t('learn.type.' + step.type) || step.type));
    tl.appendChild(el('h4', 'mb-0', step.title || ''));
    top.appendChild(tl);
    card.appendChild(top);

    var body = el('div', 'stepbody mt-2');
    body.innerHTML = step.body || '';
    /* 给步骤正文里带 data-fr 的法语片段补朗读按钮（复用 app.js 的逻辑：手动补一次） */
    body.querySelectorAll('.fr[data-fr]:not(:has(.speak))').forEach(function (n) {
      var b = document.createElement('button');
      b.className = 'speak'; b.type = 'button'; b.textContent = '▶';
      b.setAttribute('data-speak', n.getAttribute('data-fr') || n.textContent);
      b.title = t('speak.title');
      n.appendChild(document.createTextNode(' '));
      n.appendChild(b);
    });
    card.appendChild(body);

    if (step.hint) {
      var hint = el('p', 'stephint');
      hint.textContent = '💡 ' + step.hint;
      card.appendChild(hint);
    }

    /* 站内链接 */
    var links = el('div', 'btn-row mt-2');
    if (step.src) {
      var a = document.createElement('a');
      a.className = 'btn btn-sm';
      a.href = step.src;
      a.textContent = t('learn.openSource');
      links.appendChild(a);
    }
    if (wk && wk.theme) {
      var ac = document.createElement('a');
      ac.className = 'btn btn-sm btn-ghost';
      ac.href = 'calendar.html';
      ac.textContent = t('learn.weekOverview');
      links.appendChild(ac);
    }
    card.appendChild(links);

    /* 例题 */
    var quizzes = (step.quiz || []).map(itemOf).filter(Boolean);
    if (quizzes.length) card.appendChild(renderQuizBlock(quizzes, 'w' + w + 'd' + d + 's' + ctx.step));

    /* 真题风格大题（考试材料：原文 + 朗读 + 小题 + 解析） */
    var examRefs = Array.isArray(step.exam) ? step.exam : (step.exam ? [step.exam] : []);
    examRefs.forEach(function (ref) {
      var ex = resolveExamRef(ref) || (typeof ref === 'object' ? ref : null);
      if (ex) card.appendChild(renderExamBlock(ex, 'w' + w + 'd' + d + 's' + ctx.step));
    });

    /* 上一步 / 下一步 */
    var acts = el('div', 'btn-row mt-3');
    var prev = el('button', 'btn btn-sm', '← ' + t('learn.prevStep'));
    prev.type = 'button';
    prev.disabled = ctx.step === 0;
    prev.addEventListener('click', function () { ctx.step = Math.max(0, ctx.step - 1); paintDay(box); });
    acts.appendChild(prev);
    var key = Learn.stepKey(w, d, ctx.step);
    var doneBtn = el('button', 'btn btn-sm ' + (Learn.isDone(key) ? '' : 'btn-primary'),
      Learn.isDone(key) ? '✓ ' + t('learn.stepDone') : t('learn.markStepDone'));
    doneBtn.type = 'button';
    doneBtn.addEventListener('click', function () {
      if (Learn.isDone(key)) Learn.unmark(key); else Learn.markDone(key);
      paintDay(box);
      refreshGrid();
    });
    acts.appendChild(doneBtn);
    var next = el('button', 'btn btn-sm btn-primary', t('learn.nextStep') + ' →');
    next.type = 'button';
    next.disabled = ctx.step >= dd.steps.length - 1;
    next.addEventListener('click', function () {
      Learn.markDone(key);
      ctx.step = Math.min(dd.steps.length - 1, ctx.step + 1);
      paintDay(box);
      refreshGrid();
    });
    acts.appendChild(next);
    card.appendChild(acts);

    /* 当天全部完成提示 */
    if (Learn.dayDone(w, d)) {
      var ok = el('p', 'note note-tip mt-3');
      ok.textContent = '🎉 ' + t('learn.dayComplete');
      card.appendChild(ok);
    }
    box.appendChild(card);
    if (window.LANG && window.LANG.refresh) window.LANG.refresh();
  }

  /* 一组例题（含判分交互） */
  function renderQuizBlock(items, fromKey) {
    var wrap = el('div', 'quizblock mt-3');
    wrap.appendChild(el('div', 'qb-title', t('learn.practice')));
    items.forEach(function (item, qi) {
      var q = el('div', 'qitem');
      q.setAttribute('data-qid', item.id);
      var src = el('div', 'qsrc');
      src.textContent = (item.source || '') + (item.level ? ' · ' + item.level : '');
      q.appendChild(src);
      var pr = el('div', 'q q-fr');
      pr.textContent = (qi + 1) + '. ' + (item.prompt || '');
      q.appendChild(pr);

      var opts = el('div', 'qopts');
      (item.options || []).forEach(function (o) {
        var b = el('button', 'qopt');
        b.type = 'button';
        b.setAttribute('data-qid', item.id);
        b.setAttribute('data-opt', o);
        b.textContent = o;
        opts.appendChild(b);
      });
      q.appendChild(opts);

      var fb = el('div', 'qfb');
      q.appendChild(fb);
      if (Quiz.answeredRight(item.id)) {
        q.classList.add('answered', 'ok');
        fb.textContent = '✓ ' + t('learn.right');
      }
      wrap.appendChild(q);
    });
    return wrap;
  }

  /* 真题风格大题：原文（可朗读）+ 小题 + 自评标准 */
  function renderExamBlock(ex, fromKey) {
    var wrap = el('div', 'examblock mt-3');
    var head = el('div', 'flex between');
    var tl = el('div');
    tl.appendChild(el('h5', 'mb-0', '🎯 ' + (ex.title || t('learn.examTitle'))));
    var meta = el('p', 'muted small mb-0');
    meta.textContent = (ex.skill ? (t('learn.type.' + ex.skill) || ex.skill) : '') + (ex.level ? ' · ' + ex.level : '');
    tl.appendChild(meta);
    head.appendChild(tl);
    wrap.appendChild(head);

    if (ex.instructions) {
      var ins = el('p', 'stepbody small mt-1');
      ins.textContent = ex.instructions;
      wrap.appendChild(ins);
    }

    if (ex.textFr) {
      var box = el('div', 'examtext mt-2');
      box.setAttribute('data-fr', ex.textFr);
      box.textContent = ex.textFr;
      var bar = el('div', 'btn-row mt-1');
      var play = el('button', 'btn btn-sm', '▶ ' + t('learn.playExam'));
      play.type = 'button';
      play.addEventListener('click', function () {
        if (window.FR && window.FR.speak) window.FR.speak(ex.textFr, 0.95);
      });
      bar.appendChild(play);
      var slow = el('button', 'btn btn-sm btn-ghost', t('learn.playSlow'));
      slow.type = 'button';
      slow.addEventListener('click', function () {
        if (window.FR && window.FR.speak) window.FR.speak(ex.textFr, 0.6);
      });
      bar.appendChild(slow);
      box.appendChild(bar);
      wrap.appendChild(box);
    }

    var qs = (ex.questions || []).filter(Boolean);
    if (qs.length) wrap.appendChild(renderQuizBlock(qs, fromKey + '-exam'));

    if (ex.selfCheck) {
      var det = document.createElement('details');
      det.className = 'mt-2';
      var sm = document.createElement('summary');
      sm.textContent = t('learn.selfCheck');
      det.appendChild(sm);
      var p = el('div', 'stepbody');
      p.textContent = ex.selfCheck;
      det.appendChild(p);
      wrap.appendChild(det);
    }
    return wrap;
  }

  /* ======================= 判分事件（事件委托） ======================= */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.qopt');
    if (!b) return;
    var qid = b.getAttribute('data-qid');
    var opt = b.getAttribute('data-opt');
    var card = b.closest('.qitem');
    if (!qid || !card) return;
    var r = Quiz.check(qid, opt);
    card.querySelectorAll('.qopt').forEach(function (x) {
      x.disabled = true;
      if (x.getAttribute('data-opt') === r.answer) x.classList.add('correct');
      else if (x === b) x.classList.add('wrong');
    });
    card.classList.add('answered', r.ok ? 'ok' : 'bad');
    var fb = card.querySelector('.qfb');
    if (fb) {
      fb.innerHTML = '';
      var line = el('div', r.ok ? 'fb-ok' : 'fb-bad', (r.ok ? '✓ ' + t('learn.right') : '✗ ' + t('learn.wrong')));
      fb.appendChild(line);
      if (!r.ok) {
        fb.appendChild(el('div', 'fb-ans', t('learn.answerIs') + ' ' + (r.answer || '—')));
        if (r.explain) fb.appendChild(el('div', 'fb-ex', r.explain));
        fb.appendChild(el('div', 'fb-note', t('learn.addedToWrong')));
      }
      if (window.FR && window.FR.speak && r.ok) { /* 答对不朗读，避免噪音 */ }
    }
    var box = card.closest('.daypanel');
    if (box && !r.ok) { /* 错题立即反映在网格与错题本 */ }
    refreshGrid();
    refreshWrongBook();
  }, false);

  /* ======================= 渲染：错题本 ======================= */
  function renderWrongBook(box) {
    if (!box) return;
    var list = WrongBook.list();
    box.innerHTML = '';

    var head = el('div', 'flex between');
    var h3 = el('h3', 'mb-0', t('wrong.title'));
    head.appendChild(h3);
    var stats = Stats.get();
    var sum = el('p', 'muted small mb-0');
    sum.textContent = t('wrong.stats', {
      n: list.length,
      acc: stats.answered ? Math.round(stats.correct / stats.answered * 100) : 0,
      answered: stats.answered
    });
    head.appendChild(sum);
    box.appendChild(head);

    if (!list.length) {
      box.appendChild(el('p', 'note note-tip mt-2', t('wrong.empty')));
      return;
    }

    var acts = el('div', 'btn-row mt-2');
    var clear = el('button', 'btn btn-sm', t('wrong.clear'));
    clear.type = 'button';
    clear.addEventListener('click', function () {
      if (confirm(t('wrong.confirmClear'))) { WrongBook.clear(); renderWrongBook(box); refreshGrid(); }
    });
    acts.appendChild(clear);
    box.appendChild(acts);

    var group = {};
    list.forEach(function (w) {
      var g = (w.skill || 'other') + '|' + (w.level || '?');
      (group[g] = group[g] || []).push(w);
    });
    Object.keys(group).sort().forEach(function (g) {
      var parts = g.split('|');
      var sec = el('div', 'wronggroup');
      var st = el('h4', 'mb-1');
      st.textContent = (t('learn.type.' + parts[0]) || parts[0]) + ' · ' + parts[1] + ' (' + group[g].length + ')';
      sec.appendChild(st);

      group[g].forEach(function (w) {
        var q = el('div', 'qitem wrongcard');
        q.setAttribute('data-qid', w.id);
        var src = el('div', 'qsrc', (w.source || '') + (w.from ? ' · ' + w.from : ''));
        q.appendChild(src);
        q.appendChild(el('div', 'q q-fr', w.prompt || ''));
        var opts = el('div', 'qopts');
        (w.options || []).forEach(function (o) {
          var b = el('button', 'qopt', o);
          b.type = 'button';
          b.setAttribute('data-qid', w.id);
          b.setAttribute('data-opt', o);
          opts.appendChild(b);
        });
        q.appendChild(opts);
        var fb = el('div', 'qfb');
        q.appendChild(fb);
        var row = el('div', 'btn-row mt-1');
        var rm = el('button', 'btn btn-sm btn-ghost', t('wrong.remove'));
        rm.type = 'button';
        rm.addEventListener('click', function () { WrongBook.remove(w.id); renderWrongBook(box); refreshGrid(); });
        row.appendChild(rm);
        q.appendChild(row);
        sec.appendChild(q);
      });
      box.appendChild(sec);
    });
    if (window.LANG && window.LANG.refresh) window.LANG.refresh();
  }

  /* ======================= 统一刷新 ======================= */
  var gridBox = null, dayBox = null, wrongBox = null;
  function refreshGrid() {
    if (gridBox) renderDayGrid(gridBox);
    var today = Learn.today();
    var badge = document.getElementById('learnToday');
    if (badge) badge.textContent = t('learn.todayIs', { w: today.week, d: today.day });
  }
  function refreshWrongBook() {
    if (wrongBox) renderWrongBook(wrongBox);
  }

  /* ======================= 初始化 ======================= */
  function boot() {
    gridBox = document.getElementById('dayGrid');
    dayBox = document.getElementById('dayPanel');
    wrongBox = document.getElementById('wrongBook');
    if (!gridBox && !dayBox && !wrongBox) return;

    if (gridBox) renderDayGrid(gridBox);
    if (dayBox) {
      var last = Learn.lastDay();
      renderDay(dayBox, last.week, last.day);
      dayBox.classList.add('daypanel');
    }
    if (wrongBox) renderWrongBook(wrongBox);

    /* 点日期 */
    if (gridBox) {
      gridBox.addEventListener('click', function (e) {
        var b = e.target.closest('.daycell');
        if (!b) return;
        ctx.step = 0;
        if (dayBox) {
          renderDay(dayBox, b.getAttribute('data-week'), b.getAttribute('data-day'));
          dayBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      /* 键盘：方向键在日期网格里移动 */
      gridBox.addEventListener('keydown', function (e) {
        var b = e.target.closest('.daycell');
        if (!b) return;
        var w = Number(b.getAttribute('data-week')), d = Number(b.getAttribute('data-day'));
        if (e.key === 'ArrowRight') d = Math.min(7, d + 1);
        else if (e.key === 'ArrowLeft') d = Math.max(1, d - 1);
        else if (e.key === 'ArrowDown') w = Math.min(52, w + 1);
        else if (e.key === 'ArrowUp') w = Math.max(1, w - 1);
        else return;
        e.preventDefault();
        var nb = gridBox.querySelector('.daycell[data-week="' + w + '"][data-day="' + d + '"]');
        if (nb) { nb.focus(); }
      });
    }

    document.addEventListener('learnchange', function () {
      refreshGrid();
      refreshWrongBook();
    });
    document.addEventListener('langchange', function () {
      if (gridBox) renderDayGrid(gridBox);
      if (dayBox) paintDay(dayBox);
      refreshWrongBook();
    });
    refreshGrid();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 逐日数据/题库现在是分片异步加载的（daily-data.js / quiz-bank.js 都是加载器）：
     数据就绪后作废旧索引并无条件重画，否则首屏可能在数据到达前渲染出空面板 */
  function onDataReady(reason) {
    BANK_INDEX = null;
    if (!gridBox && !dayBox && !wrongBox) return;
    try {
      if (gridBox) renderDayGrid(gridBox);
      if (dayBox) {
        var last = Learn.lastDay();
        renderDay(dayBox, last.week, last.day);
      }
      refreshGrid();
      refreshWrongBook();
    } catch (e) { if (window.console && console.error) console.error('[learn.js] 数据就绪重画失败', reason, e); }
  }
  document.addEventListener('dailyready', function () { onDataReady('dailyready'); });
  document.addEventListener('bankready', function () { onDataReady('bankready'); });

  window.LEARN_VIEW = {
    renderDayGrid: renderDayGrid, renderDay: renderDay, renderWrongBook: renderWrongBook,
    refresh: function () { refreshGrid(); refreshWrongBook(); if (dayBox) paintDay(dayBox); },
    open: function (w, d) { if (dayBox) { ctx.step = 0; renderDay(dayBox, w, d); } }
  };
  window.LEARN_DIAG = {
    days: function () {
      var n = 0, steps = 0, quiz = 0, inlineQuiz = 0;
      ((window.DAILY && window.DAILY.weeks) || []).forEach(function (w) {
        (w.days || []).forEach(function (d) {
          n++; steps += (d.steps || []).length;
          (d.steps || []).forEach(function (s) { quiz += (s.quiz || []).length; (s.quiz || []).forEach(function (q) { if (!q.ref) inlineQuiz++; }); });
        });
      });
      return { days: n, steps: steps, quizRefs: quiz, inlineQuiz: inlineQuiz, bankItems: allBankItems().length,
        examItems: (window.EXAM_ITEMS || []).length, wrong: WrongBook.list().length, done: Learn.doneList().length };
    }
  };
  window.FR = window.FR || {};
  window.FR.Quiz = Quiz;
  window.FR.WrongBook = WrongBook;
  window.FR.Learn = Learn;
})();
