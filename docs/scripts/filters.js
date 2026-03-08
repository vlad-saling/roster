/**
 * Keyword/tag filtering and sort. Persists selected tag filter in localStorage.
 */
var STORAGE_KEY = 'roster_filter_tags';

function getAllTags(smes) {
  var set = {};
  smes.forEach(function (s) {
    (s.tags || []).forEach(function (t) { set[t] = true; });
    (s.sectors || []).forEach(function (t) { set[t] = true; });
  });
  return Object.keys(set).sort();
}

/** Unique sectors only, for main-page filter chips (keeps chips relevant and few). */
function getFilterChipTags(smes) {
  var set = {};
  smes.forEach(function (s) {
    (s.sectors || []).forEach(function (t) { set[t] = true; });
  });
  return Object.keys(set).sort();
}

function getActiveFilters() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function setActiveFilters(tags) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(tags) ? tags : []));
  } catch (e) {}
}

function matchSme(sme, query, selectedTags) {
  var q = (query || '').trim().toLowerCase();
  var fields = [
    sme.name,
    sme.title,
    sme.headline,
    sme.shortBio,
    (sme.keywords || []).join(' '),
    (sme.sectors || []).join(' '),
    (sme.tags || []).join(' ')
  ].join(' ').toLowerCase();
  if (q && fields.indexOf(q) === -1) return false;
  if (!selectedTags || selectedTags.length === 0) return true;
  var smeTags = [].concat(sme.tags || [], sme.sectors || []);
  return selectedTags.some(function (t) { return smeTags.indexOf(t) !== -1; });
}

function filterAndSort(smes, query, selectedTags, sortBy) {
  var filtered = smes.filter(function (s) { return matchSme(s, query, selectedTags); });
  if (sortBy === 'recent') {
    filtered = filtered.slice().sort(function (a, b) {
      var da = (a.createdAt || '').toString();
      var db = (b.createdAt || '').toString();
      return db.localeCompare(da);
    });
  } else if (sortBy === 'sector') {
    filtered = filtered.slice().sort(function (a, b) {
      var sa = (a.sectors && a.sectors[0]) || '';
      var sb = (b.sectors && b.sectors[0]) || '';
      return sa.localeCompare(sb) || (a.name || '').localeCompare(b.name || '');
    });
  } else {
    filtered = filtered.slice().sort(function (a, b) {
      return (a.name || '').localeCompare(b.name || '');
    });
  }
  return filtered;
}

export {
  getAllTags,
  getFilterChipTags,
  getActiveFilters,
  setActiveFilters,
  matchSme,
  filterAndSort,
  STORAGE_KEY
};
