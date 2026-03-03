/**
 * UI translations (EN/FI/SV). Loads data/i18n.json, detects or restores language,
 * and provides t(key) and applyTranslations() for static/dynamic text.
 */
var LANG_KEY = 'roster_lang';
var i18nCache = null;
var currentLang = 'en';
var strings = { en: {} };

function getI18nPath() {
  var path = window.location.pathname || '';
  var last = path.lastIndexOf('/');
  var prefix = last >= 0 ? path.slice(0, last + 1) : '';
  return prefix + 'data/i18n.json';
}

function loadI18n() {
  if (i18nCache) return i18nCache;
  i18nCache = fetch(getI18nPath())
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load translations');
      return res.json();
    })
    .then(function (data) {
      strings = data;
      return data;
    })
    .catch(function () {
      strings = { en: {} };
      return strings;
    });
  return i18nCache;
}

function detectBrowserLang() {
  var nav = navigator.language || navigator.userLanguage || '';
  var code = (nav.split('-')[0] || '').toLowerCase();
  if (code === 'fi') return 'fi';
  if (code === 'sv') return 'sv';
  return 'en';
}

function getStoredLang() {
  try {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === 'en' || stored === 'fi' || stored === 'sv') return stored;
  } catch (e) {}
  return null;
}

function setStoredLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang === 'fi' || lang === 'sv' ? lang : 'en');
  } catch (e) {}
}

function getActiveLang() {
  return currentLang;
}

function setActiveLang(lang) {
  var next = lang === 'fi' || lang === 'sv' ? lang : 'en';
  currentLang = next;
  setStoredLang(next);
  return next;
}

function initLang() {
  var stored = getStoredLang();
  if (stored) {
    currentLang = stored;
    return currentLang;
  }
  currentLang = detectBrowserLang();
  setStoredLang(currentLang);
  return currentLang;
}

/**
 * Translate key. Falls back to en if key missing in current lang.
 * t('results.experts', { n: 5 }) replaces {{n}} in the string.
 */
function t(key, vars) {
  var lang = strings[currentLang] || strings.en;
  var en = strings.en || {};
  var s = (lang[key] != null && lang[key] !== '') ? lang[key] : en[key];
  if (s == null || s === '') return key;
  if (vars && typeof vars === 'object') {
    Object.keys(vars).forEach(function (k) {
      s = s.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), String(vars[k]));
    });
  }
  return s;
}

/**
 * Apply translations to elements with data-i18n="key" or data-i18n-placeholder="key".
 * For hero.title use data-i18n-prefix and data-i18n-highlight to fill two parts.
 */
function applyTranslations(root) {
  root = root || document;
  document.documentElement.setAttribute('lang', currentLang === 'fi' ? 'fi' : currentLang === 'sv' ? 'sv' : 'en');
  var lang = strings[currentLang] || strings.en;

  root.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    el.placeholder = t(key);
  });

  var heroTitle = root.querySelector('.hero-title');
  if (heroTitle) initHeroTitle(heroTitle);

  var themeLabel = root.querySelector('#toggleTheme .chip__label');
  if (themeLabel) {
    var isDark = document.body.classList.contains('theme-dark');
    themeLabel.textContent = t(isDark ? 'theme.dark' : 'theme.light');
  }
}

function initHeroTitle(heroTitleEl) {
  if (!heroTitleEl) return;
  var prefix = t('hero.titlePrefix');
  var highlight = t('hero.titleHighlight');
  var span = heroTitleEl.querySelector('.text-highlight');
  if (span) {
    heroTitleEl.innerHTML = '';
    heroTitleEl.appendChild(document.createTextNode(prefix + ' '));
    span.textContent = highlight;
    heroTitleEl.appendChild(span);
  } else {
    heroTitleEl.textContent = prefix + ' ' + highlight;
  }
}

/**
 * Render EN / FI / SV buttons into container. onLangChange(lang) is called when user picks a language.
 */
function renderLangSwitcher(container, onLangChange) {
  if (!container) return;
  var langs = [
    { code: 'en', key: 'lang.en' },
    { code: 'fi', key: 'lang.fi' },
    { code: 'sv', key: 'lang.sv' }
  ];
  container.innerHTML = '';
  langs.forEach(function (item) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-switch__btn' + (currentLang === item.code ? ' lang-switch__btn--active' : '');
    btn.textContent = t(item.key);
    btn.setAttribute('aria-pressed', currentLang === item.code ? 'true' : 'false');
    btn.addEventListener('click', function () {
      setActiveLang(item.code);
      container.querySelectorAll('.lang-switch__btn').forEach(function (b) {
        b.classList.remove('lang-switch__btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('lang-switch__btn--active');
      btn.setAttribute('aria-pressed', 'true');
      if (onLangChange) onLangChange(currentLang);
    });
    container.appendChild(btn);
  });
}

export {
  loadI18n,
  initLang,
  getActiveLang,
  setActiveLang,
  t,
  applyTranslations,
  initHeroTitle,
  renderLangSwitcher
};
