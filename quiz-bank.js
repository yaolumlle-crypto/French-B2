/* quiz-bank.js — 题库加载器（由 _gen/split_quiz_bank.py 生成）
   题库拆成 quiz-bank-A1/A2/B1/B2.js 四个分片：既便于按需加载，也绕开
   部分网络服务对「单次响应 >1MB」的限制。
   用法不变：页面只引用本文件；数据就绪后派发 'bankready' 事件并补齐 window.QUIZ_BANK。 */
(function () {
  var LEVELS = ['A1', 'A2', 'B1', 'B2'];
  var src = document.currentScript ? document.currentScript.getAttribute('src') : 'quiz-bank.js';
  var dir = src && src.indexOf('/') >= 0 ? src.slice(0, src.lastIndexOf('/') + 1) : '';
  window.__QUIZ_CHUNKS__ = window.__QUIZ_CHUNKS__ || {};
  var failed = 0;

  function assemble() {
    window.QUIZ_BANK = { A1: {}, A2: {}, B1: {}, B2: {} };
    LEVELS.forEach(function (lv) {
      var d = window.__QUIZ_CHUNKS__[lv] || {};
      window.QUIZ_BANK[lv] = d;
    });
    try { document.dispatchEvent(new CustomEvent('bankready')); } catch (e) {}
  }

  function load(i) {
    if (i >= LEVELS.length) { assemble(); return; }
    var s = document.createElement('script');
    s.src = dir + 'quiz-bank-' + LEVELS[i] + '.js';
    s.onload = function () { load(i + 1); };
    s.onerror = function () { failed++; load(i + 1); };
    document.head.appendChild(s);
  }

  if (window.QUIZ_BANK && Object.keys(window.QUIZ_BANK).length) {
    try { document.dispatchEvent(new CustomEvent('bankready')); } catch (e) {}
    return;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { load(0); });
  else load(0);
})();
