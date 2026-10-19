/* daily-data.js — 逐日内容加载器（由 _gen/split_daily.py 生成）
   内容拆成 6 个分片 daily-data-1.js … daily-data-6.js：既避免单文件过大，
   也绕开部分网络服务对「单次响应 >1MB」的限制。
   页面用法不变：只引用本文件；加载完成后派发 'dailyready' 事件。
   兼容：若内容已内联（离线单文件包），直接使用 window.DAILY 不再重复加载。 */
(function () {
  var PIECES = 6;
  var src = document.currentScript ? document.currentScript.getAttribute('src') : 'daily-data.js';
  var dir = src && src.indexOf('/') >= 0 ? src.slice(0, src.lastIndexOf('/') + 1) : '';
  window.__DAILY_CHUNKS__ = window.__DAILY_CHUNKS__ || {};
  var failed = 0;

  function assemble() {
    var weeks = [];
    for (var i = 1; i <= PIECES; i++) {
      var part = window.__DAILY_CHUNKS__[i];
      if (part) weeks = weeks.concat(part);
    }
    weeks.sort(function (a, b) { return Number(a.week) - Number(b.week); });
    window.DAILY = { weeks: weeks };
    try {
      document.dispatchEvent(new CustomEvent('dailyready', { detail: { weeks: weeks.length, failed: failed } }));
    } catch (e) {}
  }

  function load(i) {
    if (i > PIECES) { assemble(); return; }
    var s = document.createElement('script');
    s.src = dir + 'daily-data-' + i + '.js';
    s.async = false;
    s.onload = function () { load(i + 1); };
    s.onerror = function () { failed++; load(i + 1); };
    document.head.appendChild(s);
  }

  if (window.DAILY && window.DAILY.weeks && window.DAILY.weeks.length) {
    try { document.dispatchEvent(new CustomEvent('dailyready', { detail: { weeks: window.DAILY.weeks.length, inline: true } })); } catch (e) {}
    return;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { load(1); });
  else load(1);
})();
