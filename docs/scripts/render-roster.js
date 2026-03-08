import { loadSmes, getColorVariant } from './data.js';
import {
  getFilterChipTags,
  getActiveFilters,
  setActiveFilters,
  filterAndSort
} from './filters.js';
import { initTheme, initThemeToggle } from './ui-interactions.js';
import {
  loadI18n,
  initLang,
  setActiveLang,
  t,
  applyTranslations,
  renderLangSwitcher
} from './i18n.js';

function renderQuickFilters(container, allTags, selectedTags, onToggle) {
  container.innerHTML = '';
  allTags.forEach(function (tag) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip chip--filter';
    btn.setAttribute('data-active', selectedTags.indexOf(tag) !== -1 ? 'true' : 'false');
    btn.textContent = tag;
    btn.addEventListener('click', function () {
      var current = getActiveFilters();
      var next = current.indexOf(tag) === -1
        ? current.concat(tag)
        : current.filter(function (t) { return t !== tag; });
      setActiveFilters(next);
      onToggle(next);
    });
    container.appendChild(btn);
  });
}

function updateFilterChipsState(container, selectedTags) {
  [].slice.call(container.querySelectorAll('.chip--filter')).forEach(function (btn) {
    var tag = btn.textContent;
    btn.setAttribute('data-active', selectedTags.indexOf(tag) !== -1 ? 'true' : 'false');
  });
}

function buildCard(sme) {
  var a = document.createElement('a');
  a.href = 'profile.html?id=' + encodeURIComponent(sme.id);
  a.className = 'sme-card sme-card--color-' + getColorVariant(sme.id, sme);
  a.setAttribute('data-id', sme.id);

  var header = document.createElement('div');
  header.className = 'sme-card__header';
  var title = document.createElement('div');
  title.className = 'sme-card__title';
  var name = document.createElement('h3');
  name.className = 'sme-card__name';
  name.textContent = sme.name || '—';
  var role = document.createElement('p');
  role.className = 'sme-card__role';
  role.textContent = sme.title || '';
  title.appendChild(name);
  title.appendChild(role);
  header.appendChild(title);
  if (sme.sectors && sme.sectors[0]) {
    var sector = document.createElement('span');
    sector.className = 'sme-card__sector-pill';
    sector.textContent = sme.sectors[0];
    header.appendChild(sector);
  }
  a.appendChild(header);

  if (sme.shortBio) {
    var summary = document.createElement('p');
    summary.className = 'sme-card__summary';
    summary.textContent = sme.shortBio.slice(0, 140) + (sme.shortBio.length > 140 ? '…' : '');
    a.appendChild(summary);
  }

  if (sme.languages && sme.languages.length) {
    var langLine = document.createElement('p');
    langLine.className = 'sme-card__languages';
    langLine.textContent = sme.languages.join(', ');
    a.appendChild(langLine);
  }

  if (sme.tags && sme.tags.length) {
    var tagWrap = document.createElement('div');
    tagWrap.className = 'sme-card__tags';
    sme.tags.slice(0, 4).forEach(function (t) {
      var pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.textContent = t;
      tagWrap.appendChild(pill);
    });
    a.appendChild(tagWrap);
  }

  return a;
}

function renderGrid(gridEl, list) {
  gridEl.removeAttribute('data-loading');
  gridEl.innerHTML = '';
  if (list.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = t('results.empty');
    gridEl.appendChild(empty);
    return;
  }
  list.forEach(function (sme) {
    gridEl.appendChild(buildCard(sme));
  });
}

function run() {
  initTheme();
  initThemeToggle(applyTranslations);

  var searchInput = document.getElementById('searchInput');
  var sortSelect = document.getElementById('sortSelect');
  var quickFilters = document.getElementById('quickFilters');
  var resultsCount = document.getElementById('resultsCount');
  var rosterGrid = document.getElementById('rosterGrid');
  var langSwitcher = document.getElementById('langSwitcher');

  var selectedTags = getActiveFilters();
  var query = '';
  var sortBy = sortSelect ? sortSelect.value : 'name';
  var allSmes = [];
  var allTags = [];

  function refresh() {
    var filtered = filterAndSort(allSmes, query, selectedTags, sortBy);
    renderGrid(rosterGrid, filtered);
    if (resultsCount) {
      resultsCount.textContent = filtered.length === 1 ? t('results.expertOne') : t('results.experts', { n: filtered.length });
    }
    updateFilterChipsState(quickFilters, selectedTags);
  }

  function onLangChange() {
    applyTranslations();
    refresh();
  }

  loadI18n()
    .then(function () {
      initLang();
      applyTranslations();
      if (langSwitcher) renderLangSwitcher(langSwitcher, onLangChange);
      return loadSmes();
    })
    .then(function (list) {
      allSmes = list;
      allTags = getFilterChipTags(list);
      renderQuickFilters(quickFilters, allTags, selectedTags, function (next) {
        selectedTags = next;
        refresh();
      });
      if (searchInput) {
        searchInput.value = '';
        searchInput.addEventListener('input', function () {
          query = searchInput.value;
          refresh();
        });
      }
      if (sortSelect) {
        sortSelect.addEventListener('change', function () {
          sortBy = sortSelect.value;
          refresh();
        });
      }
      refresh();
    })
    .catch(function () {
      rosterGrid.removeAttribute('data-loading');
      rosterGrid.innerHTML = '';
      var err = document.createElement('div');
      err.className = 'empty-state';
      err.textContent = t('results.errorLoad');
      rosterGrid.appendChild(err);
      if (resultsCount) resultsCount.textContent = t('results.experts', { n: 0 });
    });
}

run();
