/* Hansum public website (index.html only): mobile menu, solid header after the hero, mobile directions dock. */
(function () {
  'use strict';
  var body = document.body;
  var header = document.querySelector('.header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mobile-nav');
  var hero = document.querySelector('.hero');
  var dock = document.querySelector('.dock');

  function setMenu(open) {
    if (!btn || !nav) return;
    nav.hidden = !open;
    body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(nav.hidden); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) { setMenu(false); btn.focus(); } });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // past the hero: solid header + (on phones) the directions dock
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var past = !entries[0].isIntersecting;
      if (header) header.classList.toggle('is-solid', past);
      if (dock) {
        dock.classList.toggle('is-on', past);
        dock.setAttribute('aria-hidden', String(!past));
        dock.querySelectorAll('a').forEach(function (a) { a.tabIndex = past ? 0 : -1; });
      }
    }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 }).observe(hero);
  }
})();
