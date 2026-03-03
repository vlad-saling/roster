import { getSmeById, getColorVariant } from './data.js';
import { initTheme, initThemeToggle } from './ui-interactions.js';
import {
  loadI18n,
  initLang,
  t,
  applyTranslations,
  renderLangSwitcher
} from './i18n.js';

function getProfileId() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (id) return id.trim();
  var hash = (window.location.hash || '').replace(/^#/, '').trim();
  return hash || null;
}

function escapeHtml(s) {
  if (s == null || s === '') return '';
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderProfile(shell, sme) {
  document.title = (sme.name || 'Profile') + ' — SME Roster';

  var avatarLetter = (sme.name || '?').charAt(0).toUpperCase();
  var colorClass = 'profile-avatar--color-' + getColorVariant(sme.id, sme);
  var avatarHtml = sme.avatar
    ? '<img class="profile-avatar ' + colorClass + '" src="' + escapeHtml(sme.avatar) + '" alt="" />'
    : '<span class="profile-avatar ' + colorClass + '">' + escapeHtml(avatarLetter) + '</span>';

  var sectorPills = (sme.sectors || []).map(function (s) {
    return '<span class="tag-pill tag-pill--accent">' + escapeHtml(s) + '</span>';
  }).join('');

  var metaParts = [sme.location].filter(Boolean);
  var metaHtml = metaParts.length
    ? '<span class="profile-title-block__meta">' + escapeHtml(metaParts.join(' · ')) + '</span>'
    : '';

  var headerHtml =
    '<div class="profile-header">' +
      '<div class="profile-title-block">' +
        '<h1><span class="text-highlight">' + escapeHtml(sme.name || '—') + '</span></h1>' +
        '<p class="profile-title-block__meta">' + escapeHtml(sme.title || '') + '</p>' +
        (sectorPills ? '<div class="pill-row pill-row--dense">' + sectorPills + '</div>' : '') +
        metaHtml +
      '</div>' +
    '</div>';

  var sections = [];

  if (sme.headline) {
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.headline')) + '</h2>' +
        '<p class="profile-body">' + escapeHtml(sme.headline) + '</p>' +
      '</div>'
    );
  }

  if (sme.longBio) {
    var paras = sme.longBio.split(/\n\n+/).filter(Boolean);
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.bio')) + '</h2>' +
        paras.map(function (p) { return '<p class="profile-body">' + escapeHtml(p.trim()) + '</p>'; }).join('') +
      '</div>'
    );
  }

  if (sme.history && sme.history.length) {
    var historyHtml = sme.history.map(function (entry) {
      var line = escapeHtml(entry.role || '');
      if (entry.organization) line += ' · ' + escapeHtml(entry.organization);
      if (entry.period) line += ' <span class="profile-history__period">' + escapeHtml(entry.period) + '</span>';
      var block = '<div class="profile-history__item">' +
        '<p class="profile-history__heading">' + line + '</p>';
      if (entry.description) {
        block += '<p class="profile-body">' + escapeHtml(entry.description) + '</p>';
      }
      block += '</div>';
      return block;
    }).join('');
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.history')) + '</h2>' +
        '<div class="profile-history">' + historyHtml + '</div>' +
      '</div>'
    );
  }

  if (sme.tags && sme.tags.length) {
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.expertise')) + '</h2>' +
        '<div class="pill-row pill-row--dense">' +
          sme.tags.map(function (tag) { return '<span class="tag-pill">' + escapeHtml(tag) + '</span>'; }).join('') +
        '</div>' +
      '</div>'
    );
  }

  if (sme.engagement && sme.engagement.length) {
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.engagement')) + '</h2>' +
        '<ul class="profile-list">' +
          sme.engagement.map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join('') +
        '</ul>' +
      '</div>'
    );
  }

  if (sme.languages && sme.languages.length) {
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.languages')) + '</h2>' +
        '<p class="profile-body">' + escapeHtml(sme.languages.join(', ')) + '</p>' +
      '</div>'
    );
  }

  if (sme.links && sme.links.length) {
    var linkHtml = sme.links.map(function (l) {
      return '<a class="link-pill" href="' + escapeHtml(l.url || '#') + '" target="_blank" rel="noopener">' +
        '<span class="link-pill__icon">↗</span> ' + escapeHtml(l.label || 'Link') + '</a>';
    }).join('');
    sections.push(
      '<div class="profile-section">' +
        '<h2>' + escapeHtml(t('profile.sections.links')) + '</h2>' +
        '<div class="profile-links">' + linkHtml + '</div>' +
      '</div>'
    );
  }

  var narrativeCount = 2 + (sme.history && sme.history.length ? 1 : 0);
  var rightColumnHtml =
    '<div class="profile-sidebar">' +
      '<div class="profile-avatar-wrap">' + avatarHtml + '</div>' +
      sections.slice(narrativeCount).join('') +
    '</div>';
  var layoutHtml =
    '<div class="profile-layout">' +
      '<div class="profile-layout__left">' +
        headerHtml +
        sections.slice(0, narrativeCount).join('') +
      '</div>' +
      rightColumnHtml +
    '</div>';

  shell.innerHTML = layoutHtml;
}

function renderError(shell, message) {
  shell.innerHTML =
    '<div class="empty-state">' +
      '<p>' + escapeHtml(message) + '</p>' +
      '<p><a href="index.html" class="back-link">' + escapeHtml(t('profile.backToRoster')) + '</a></p>' +
    '</div>';
}

var currentProfileSme = null;

function run() {
  initTheme();
  initThemeToggle(applyTranslations);

  var shell = document.getElementById('profileShell');
  var langSwitcher = document.getElementById('langSwitcher');
  if (!shell) return;

  function onLangChange() {
    applyTranslations();
    if (currentProfileSme) renderProfile(shell, currentProfileSme);
  }

  var id = getProfileId();

  loadI18n()
    .then(function () {
      initLang();
      applyTranslations();
      if (langSwitcher) renderLangSwitcher(langSwitcher, onLangChange);
      if (!id) {
        renderError(shell, t('profile.noId'));
        return null;
      }
      return getSmeById(id);
    })
    .then(function (sme) {
      if (sme === null) return;
      if (sme) {
        currentProfileSme = sme;
        renderProfile(shell, sme);
      } else {
        renderError(shell, t('profile.notFound', { id: id }));
      }
    })
    .catch(function () {
      if (langSwitcher) langSwitcher.innerHTML = '';
      renderError(shell, t('profile.errorLoad'));
    });
}

run();
