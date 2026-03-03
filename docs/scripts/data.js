/**
 * Load and cache data/smes.json. Uses a single in-memory promise so multiple
 * callers share the same request.
 */
var smesCache = null;

function getDataPath() {
  var path = window.location.pathname || '';
  var last = path.lastIndexOf('/');
  var prefix = last >= 0 ? path.slice(0, last + 1) : '';
  return prefix + 'data/smes.json';
}

function loadSmes() {
  if (smesCache) return smesCache;
  smesCache = fetch(getDataPath())
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load roster data');
      return res.json();
    })
    .then(function (data) {
      return Array.isArray(data) ? data : [];
    });
  return smesCache;
}

function getSmeById(id) {
  return loadSmes().then(function (list) {
    return list.find(function (s) { return s.id === id; }) || null;
  });
}

var NUM_COLOR_VARIANTS = 6;

function getColorVariant(id, sme) {
  if (sme && typeof sme.colorVariant === 'number' && sme.colorVariant >= 0 && sme.colorVariant < NUM_COLOR_VARIANTS) {
    return sme.colorVariant;
  }
  if (!id || typeof id !== 'string') return 0;
  var n = 0;
  for (var i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
  return n % NUM_COLOR_VARIANTS;
}

export { loadSmes, getSmeById, getDataPath, getColorVariant, NUM_COLOR_VARIANTS };
