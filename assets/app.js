/* Aura World — promo site behavior (vanilla JS, no dependencies) */
(function () {
  var A = window.AURA || {};

  // Build the Windows download URL from the config parts (so the username only
  // needs to be set once, in githubUser). Always points to the latest Release.
  if (!A.downloadWin) {
    A.downloadWin = 'https://github.com/' + A.githubUser + '/' + A.repo +
      '/releases/latest/download/Aura-World-Setup.exe';
  }

  // Current year in footers
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile nav
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Resolve [data-href="downloadWin"] etc. to real URLs from config
  document.querySelectorAll('[data-href]').forEach(function (el) {
    var key = el.getAttribute('data-href');
    if (A[key]) el.setAttribute('href', A[key]);
  });

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Donation cards: fill values, wire copy/open, hide unconfigured methods
  var d = A.donate || {};
  function copy(text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      var old = btn.textContent; btn.textContent = '✓ Kopyalandı';
      setTimeout(function () { btn.textContent = old; }, 1600);
    });
  }
  document.querySelectorAll('[data-dono]').forEach(function (card) {
    var key = card.getAttribute('data-dono');
    var val = d[key];
    var valEl = card.querySelector('[data-dono-val]');
    var openEl = card.querySelector('[data-dono-open]');
    var copyEl = card.querySelector('[data-dono-copy]');
    if (!val) {
      // Not configured yet → show a soft "coming soon" state, no broken links
      if (valEl) valEl.textContent = 'Yakında eklenecek';
      if (openEl) openEl.style.display = 'none';
      if (copyEl) copyEl.style.display = 'none';
      card.style.opacity = '.55';
      return;
    }
    var display = val;
    if (key === 'iban' && d.ibanName) display = val + '  ·  ' + d.ibanName;
    if (valEl) valEl.textContent = display;
    var isLink = /^https?:\/\//i.test(val);
    if (openEl) {
      if (isLink) { openEl.setAttribute('href', val); }
      else { openEl.style.display = 'none'; }
    }
    if (copyEl) { copyEl.addEventListener('click', function () { copy(val, copyEl); }); }
  });

  // Download page: detect OS to gently highlight the right card
  var osCard = document.querySelector('.os.active[data-os="win"]');
  var ua = navigator.userAgent || '';
  if (osCard && /Windows/i.test(ua)) {
    var hint = document.querySelector('[data-os-hint]');
    if (hint) hint.textContent = 'İşletim sisteminiz algılandı: Windows ✓';
  }
})();
