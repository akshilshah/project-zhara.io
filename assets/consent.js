// Cookie consent for Google Analytics (Consent Mode v2).
// The gtag snippet in each page's <head> sets the defaults (analytics off in the
// EEA, UK and Switzerland, on elsewhere) and re-applies a saved choice. This file
// shows the banner to European visitors who haven't chosen yet, and wires up the
// footer "Cookie settings" link so anyone can change their choice later.
(function () {
  var KEY = 'zhara-consent';

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  // Timezone is a client-side stand-in for location. Google applies the EEA/UK/CH
  // default by IP, so a European visitor we miss here is simply not tracked.
  function inEurope() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return /^Europe\//.test(tz) ||
        /^(Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)|Arctic\/Longyearbyen|Asia\/(Nicosia|Famagusta))$/.test(tz);
    } catch (e) {
      return false;
    }
  }

  // Remove GA cookies left over from an earlier "Accept"
  function clearGaCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function choose(value) {
    save(value);
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: value });
    if (value === 'denied') clearGaCookies();
    hide();
  }

  var banner;

  function injectStyles() {
    var css =
      '.cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:560px;margin:0 auto;' +
      'padding:18px 20px;border-radius:16px;background:#11152d;color:#fff;border:1px solid rgba(255,255,255,.14);font-family:"Manrope",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
      'font-size:14px;line-height:1.55;box-shadow:0 20px 60px rgba(17,21,45,.28);display:flex;gap:16px;align-items:center}' +
      '.cc p{margin:0;flex:1;color:rgba(255,255,255,.86)}' +
      '.cc a{color:#ff9a66;text-decoration:underline;text-underline-offset:2px}' +
      '.cc-actions{display:flex;gap:8px;flex-shrink:0}' +
      '.cc button{font:inherit;font-weight:600;font-size:13px;padding:9px 16px;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.28);background:transparent;color:#fff}' +
      '.cc button:hover{border-color:rgba(255,255,255,.6)}' +
      '.cc button.cc-accept{background:#f45d18;border-color:#f45d18}' +
      '.cc button.cc-accept:hover{background:#d94b0b;border-color:#d94b0b}' +
      '.cc button:focus-visible{outline:2px solid #ff9a66;outline-offset:2px}' +
      '.cc[hidden]{display:none}' +
      '@media (max-width:560px){.cc{flex-direction:column;align-items:stretch}.cc-actions button{flex:1}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function show() {
    if (banner) { banner.hidden = false; return; }
    injectStyles();
    banner = document.createElement('div');
    banner.className = 'cc';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use Google Analytics cookies to see how people use this site. No advertising cookies. ' +
      '<a href="/privacy/#s3-3">Privacy policy</a></p>' +
      '<div class="cc-actions">' +
      '<button type="button" class="cc-decline">Decline</button>' +
      '<button type="button" class="cc-accept">Accept</button>' +
      '</div>';
    banner.querySelector('.cc-decline').addEventListener('click', function () { choose('denied'); });
    banner.querySelector('.cc-accept').addEventListener('click', function () { choose('granted'); });
    document.body.appendChild(banner);
  }

  function hide() {
    if (banner) banner.hidden = true;
  }

  document.querySelectorAll('[data-cookie-settings]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      show();
    });
  });

  var choice = saved();
  if (choice !== 'granted' && choice !== 'denied' && inEurope()) show();
})();
