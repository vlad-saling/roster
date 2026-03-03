/**
 * Theme toggle and shared UI behavior. Persists theme in localStorage.
 */
var THEME_KEY = 'roster_theme';

function getTheme() {
  try {
    var t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch (e) {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setTheme(theme) {
  var next = theme === 'light' ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add('theme-' + next);
  return next;
}

function toggleTheme() {
  return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  setTheme(getTheme());
}

function initThemeToggle(onThemeChange) {
  var btn = document.getElementById('toggleTheme');
  if (!btn) return;
  var label = btn.querySelector('.chip__label');
  function updateLabel() {
    if (label) label.textContent = getTheme() === 'dark' ? 'Dark' : 'Light';
  }
  updateLabel();
  btn.addEventListener('click', function () {
    toggleTheme();
    if (typeof onThemeChange === 'function') onThemeChange();
    else updateLabel();
  });
}

export { getTheme, setTheme, toggleTheme, initTheme, initThemeToggle };