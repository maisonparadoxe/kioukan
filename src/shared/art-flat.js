
/* Illustrations : portraits plats des suspects, sols et mobilier vus de dessus. */
(function () {
  'use strict';
  var INK = '#2b2f55';

  /* Un portrait par suspect : peau, cheveux, coupe, tenue, accessoires. */
  var LOOKS = {
    'Mme Vernet':      { skin: '#f3cdb3', hair: '#d9d9e3', style: 'bun',   shirt: '#7f8fd6', x: ['pearls'] },
    'Dr Aubry':        { skin: '#ecbd99', hair: '#3a2c2a', style: 'short', shirt: '#f4f6ff', x: ['glasses'] },
    'Lucas':           { skin: '#e4aa80', hair: '#d9672a', style: 'curly', shirt: '#5bb59a', x: [] },
    'Colonel Marchal': { skin: '#f0c2a0', hair: '#eceaf2', style: 'short', shirt: '#b3413f', x: ['mustache', 'cap'] },
    'Inès':            { skin: '#c98b61', hair: '#241c2c', style: 'long',  shirt: '#e7849f', x: ['earrings'] },
    'Mme Delaunay':    { skin: '#f3cdb3', hair: '#a5482c', style: 'wavy',  shirt: '#3b3f6e', x: ['hat'] },
    'Dr Moreau':       { skin: '#d9a07a', hair: '#2b2224', style: 'short', shirt: '#6ec0c9', x: ['glasses', 'beard'] },
    'Baron Voss':      { skin: '#f0c2a0', hair: '#8c8da5', style: 'bald',  shirt: '#2f3157', x: ['mustache', 'tophat', 'bowtie'] },
    'Roux':            { skin: '#e4aa80', hair: '#4a3427', style: 'short', shirt: '#4c6fb8', x: ['cap'] },
    'Mlle Ferrand':    { skin: '#f6d6bf', hair: '#f0c75e', style: 'bob',   shirt: '#9a7ee0', x: ['earrings'] },
    'Mme Lefèvre':     { skin: '#f0c2a0', hair: '#b9bccb', style: 'bun',   shirt: '#d98a86', x: ['glasses'] },
    'M. Costa':        { skin: '#e0a37b', hair: '#1f1a22', style: 'short', shirt: '#2b2f55', x: ['mustache', 'bowtie'] },
    'Dr Bellamy':      { skin: '#f3cdb3', hair: '#d8a83a', style: 'short', shirt: '#f4f6ff', x: ['glasses'] },
    'Mme Okafor':      { skin: '#6d4430', hair: '#1c1620', style: 'afro',  shirt: '#f0a94e', x: ['earrings'] },
    'Chef Duval':      { skin: '#eab491', hair: '#5a3b2a', style: 'short', shirt: '#ffffff', x: ['mustache', 'toque'] }
  };
  var DEFAULT = { skin: '#eab491', hair: '#3a2c2a', style: 'short', shirt: '#7f8fd6', x: [] };

  function has(L, k) { return L.x.indexOf(k) >= 0; }

  function inner(name) {
    var L = LOOKS[name] || DEFAULT, H = L.hair, S = L.skin, h = '', st = L.style;
    /* derrière la tête */
    if (st === 'long') h += '<path d="M16 30Q12 54 20 62L44 62Q52 54 48 30Z" fill="' + H + '"/>';
    if (st === 'afro') h += '<circle cx="32" cy="24" r="19" fill="' + H + '"/>';
    if (st === 'bun') h += '<circle cx="32" cy="9" r="6.5" fill="' + H + '"/>';
    if (st === 'wavy') h += '<path d="M17 28Q12 44 18 54Q22 50 21 44L43 44Q42 50 46 54Q52 44 47 28Z" fill="' + H + '"/>';
    /* buste */
    h += '<path d="M5 64Q7 45 32 45Q57 45 59 64Z" fill="' + L.shirt + '"/>';
    if (has(L, 'bowtie')) h += '<path d="M32 49L24 45L24 53ZM32 49L40 45L40 53Z" fill="#d94a63"/><circle cx="32" cy="49" r="2" fill="#b23550"/>';
    if (has(L, 'pearls')) h += '<g fill="#fff" stroke="#c9cbe0" stroke-width=".6"><circle cx="24" cy="46.5" r="1.8"/><circle cx="28" cy="48.5" r="1.8"/><circle cx="32" cy="49.2" r="1.8"/><circle cx="36" cy="48.5" r="1.8"/><circle cx="40" cy="46.5" r="1.8"/></g>';
    /* cou et tête */
    h += '<rect x="27" y="38" width="10" height="10" rx="3" fill="' + S + '"/>';
    h += '<ellipse cx="32" cy="29" rx="12" ry="14" fill="' + S + '"/>';
    h += '<ellipse cx="20" cy="31" rx="2" ry="3" fill="' + S + '"/><ellipse cx="44" cy="31" rx="2" ry="3" fill="' + S + '"/>';
    /* cheveux de face */
    if (st === 'short' || st === 'long' || st === 'bun' || st === 'afro') h += '<path d="M19.5 28Q17 11 32 11.5Q47 11 44.5 28Q41 19.5 32 19.5Q23 19.5 19.5 28Z" fill="' + H + '"/>';
    if (st === 'wavy') h += '<path d="M19 29Q15 10 32 11Q49 10 45 29Q42 20 32 20Q22 20 19 29Z" fill="' + H + '"/>';
    if (st === 'curly') h += '<g fill="' + H + '"><circle cx="21" cy="19" r="6.5"/><circle cx="28" cy="13" r="7"/><circle cx="37" cy="13" r="7"/><circle cx="43" cy="19" r="6.5"/><circle cx="32" cy="17" r="6"/></g>';
    if (st === 'bob') h += '<path d="M17.5 36Q13 9 32 10Q51 9 46.5 36Q44 35 44 28Q40 19.5 32 19.5Q24 19.5 20 28Q20 35 17.5 36Z" fill="' + H + '"/>';
    if (st === 'bald') h += '<path d="M19.5 28Q19 22 22 19Q20 26 20.5 31Z M44.5 28Q45 22 42 19Q44 26 43.5 31Z" fill="' + H + '"/>';
    /* visage */
    h += '<circle cx="27" cy="30" r="1.7" fill="' + INK + '"/><circle cx="37" cy="30" r="1.7" fill="' + INK + '"/>';
    h += '<circle cx="24.5" cy="34.5" r="2.4" fill="#ef8aa1" opacity=".35"/><circle cx="39.5" cy="34.5" r="2.4" fill="#ef8aa1" opacity=".35"/>';
    if (has(L, 'beard')) h += '<path d="M20.5 32Q21 48 32 48.5Q43 48 43.5 32Q40 41 32 41Q24 41 20.5 32Z" fill="' + H + '"/>';
    h += '<path d="M29 37.5Q32 40 35 37.5" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>';
    if (has(L, 'mustache')) h += '<path d="M23.5 36.5Q28 32.5 32 35.5Q36 32.5 40.5 36.5Q36 38 32 36.5Q28 38 23.5 36.5Z" fill="' + H + '"/>';
    if (has(L, 'glasses')) h += '<g fill="#fff" fill-opacity=".25" stroke="' + INK + '" stroke-width="1.3"><circle cx="27" cy="30" r="4.4"/><circle cx="37" cy="30" r="4.4"/></g><path d="M31.4 30H32.6" stroke="' + INK + '" stroke-width="1.3"/>';
    if (has(L, 'earrings')) h += '<circle cx="20" cy="36" r="1.8" fill="#f2c14b"/><circle cx="44" cy="36" r="1.8" fill="#f2c14b"/>';
    /* couvre-chefs */
    if (has(L, 'cap')) h += '<path d="M19 20Q19 8 32 8Q45 8 45 20Z" fill="' + (L.shirt === '#b3413f' ? '#8f2f2e' : '#2f4a8c') + '"/><rect x="17" y="19" width="30" height="3.5" rx="1.7" fill="#1f2a55"/><circle cx="32" cy="14" r="1.8" fill="#f2c14b"/>';
    if (has(L, 'tophat')) h += '<rect x="19" y="16" width="26" height="4" rx="2" fill="#1d1f3a"/><rect x="23" y="1" width="18" height="17" rx="2" fill="#1d1f3a"/><rect x="23" y="12" width="18" height="3.2" fill="#d94a63"/>';
    if (has(L, 'hat')) h += '<ellipse cx="32" cy="14" rx="19" ry="4.5" fill="#e7849f"/><path d="M22 14Q22 4 32 4Q42 4 42 14Z" fill="#e7849f"/><path d="M22 12H42" stroke="#fff" stroke-width="2.4"/><circle cx="40" cy="9" r="2.2" fill="#fff"/>';
    if (has(L, 'toque')) h += '<rect x="22" y="12" width="20" height="6" fill="#fff" stroke="#d8dbee" stroke-width=".8"/><circle cx="24" cy="9" r="6" fill="#fff" stroke="#d8dbee" stroke-width=".8"/><circle cx="32" cy="6" r="7" fill="#fff" stroke="#d8dbee" stroke-width=".8"/><circle cx="40" cy="9" r="6" fill="#fff" stroke="#d8dbee" stroke-width=".8"/>';
    return h;
  }
  function avatar(name) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' + inner(name) + '</svg>';
  }

  /* Sols (motifs répétés) */
  function defs() {
    return '<defs>' +
      '<pattern id="pf-wood" class="pt-wood" width="14" height="12" patternUnits="userSpaceOnUse"><rect class="pa-a" width="14" height="12"/><path class="pa-b" d="M0 .5H14M0 6.5H14M4 .5V6.5M11 6.5V12.5"/></pattern>' +
      '<pattern id="pf-check" class="pt-check" width="16" height="16" patternUnits="userSpaceOnUse"><rect class="pa-a" width="16" height="16"/><rect class="pa-c" width="8" height="8"/><rect class="pa-c" x="8" y="8" width="8" height="8"/></pattern>' +
      '<pattern id="pf-tile" class="pt-tile" width="14" height="14" patternUnits="userSpaceOnUse"><rect class="pa-a" width="14" height="14"/><path class="pa-b" d="M0 .5H14M.5 0V14"/></pattern>' +
      '<pattern id="pf-diamond" class="pt-diamond" width="20" height="20" patternUnits="userSpaceOnUse"><rect class="pa-a" width="20" height="20"/><path class="pa-c" d="M10 2L18 10L10 18L2 10Z"/></pattern>' +
      '<pattern id="pf-grass" class="pt-grass" width="16" height="16" patternUnits="userSpaceOnUse"><rect class="pa-a" width="16" height="16"/><g class="pa-c"><circle cx="3" cy="4" r="1.3"/><circle cx="11" cy="9" r="1.3"/><circle cx="6" cy="13" r="1.1"/></g></pattern>' +
      '<pattern id="pf-steel" class="pt-steel" width="12" height="12" patternUnits="userSpaceOnUse"><rect class="pa-a" width="12" height="12"/><path class="pa-b" d="M0 6.5H12"/></pattern>' +
      '<pattern id="pf-deck" class="pt-wood" width="30" height="8" patternUnits="userSpaceOnUse"><rect class="pa-a" width="30" height="8"/><path class="pa-b" d="M0 .5H30M18 0V8"/></pattern>' +
      '<pattern id="pf-seats" class="pt-seats" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#c0505a"/><rect x="2" y="2" width="8" height="6" rx="2" fill="#e07a82"/></pattern>' +
      '<pattern id="pf-felt" class="pt-felt" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#3f8a5a"/><circle cx="8" cy="8" r="0.8" fill="#5aa874"/></pattern>' +
      '<clipPath id="tokclip"><circle cx="32" cy="32" r="32"/></clipPath>' +
      '</defs>';
  }

  /* Mobilier (x, y, w, h en unités du plan) */
  function r(c, x, y, w, h, rx) { return '<rect class="' + c + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx === undefined ? 2.5 : rx) + '"/>'; }
  function furn(t, x, y, w, h) {
    var s = '', m;
    switch (t) {
      case 'bed':
        m = Math.min(w, h);
        s += r('fu', x, y, w, h, 3);
        if (w >= h) { s += r('fu2', x + m * 0.55, y, w - m * 0.55, h, 2) + r('fw', x + 2, y + 2, m * 0.42, h - 4, 2); }
        else { s += r('fu2', x, y + m * 0.55, w, h - m * 0.55, 2) + r('fw', x + 2, y + 2, w - 4, m * 0.42, 2); }
        break;
      case 'sofa':
        s += r('fu', x, y, w, h, 4) + r('fu2', x, y, w, h * 0.38, 4) + r('fu2', x, y, 5, h, 3) + r('fu2', x + w - 5, y, 5, h, 3);
        break;
      case 'table':
        s += (w > h * 1.25) ? r('fu2', x, y, w, h, 4) + r('fw', x + 2, y + 2, w - 4, h - 4, 3) : '<ellipse class="fu2" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + w / 2 + '" ry="' + h / 2 + '"/>';
        break;
      case 'chair': s += r('fu2', x, y + h * 0.3, w, h * 0.7, 3) + r('fu', x, y, w, h * 0.35, 2); break;
      case 'plant':
        s += r('fpot', x + w * 0.28, y + h * 0.66, w * 0.44, h * 0.34, 1.5) +
          '<circle class="fg" cx="' + (x + w / 2) + '" cy="' + (y + h * 0.4) + '" r="' + Math.min(w, h) * 0.42 + '"/>' +
          '<circle class="fg2" cx="' + (x + w * 0.38) + '" cy="' + (y + h * 0.36) + '" r="' + Math.min(w, h) * 0.2 + '"/>';
        break;
      case 'tv': s += r('ftv', x, y, w, h * 0.78, 2) + r('fu', x + w * 0.35, y + h * 0.78, w * 0.3, h * 0.22, 1); break;
      case 'shelf':
        s += r('fu', x, y, w, h, 2);
        for (m = x + 8; m < x + w - 3; m += 9) s += '<path class="fl" d="M' + m + ' ' + y + 'V' + (y + h) + '"/>';
        break;
      case 'counter':
        s += r('fu', x, y, w, h, 3) + r('fw', x + 1.5, y + 1.5, w - 3, h * 0.4, 2);
        if (w > 44) for (m = x + 10; m < x + w - 6; m += 14) s += '<circle class="ftv" cx="' + m + '" cy="' + (y + h * 0.72) + '" r="2"/>';
        break;
      case 'desk': s += r('fu', x, y, w, h, 3) + r('fw', x + w * 0.3, y + 2.5, w * 0.28, h * 0.4, 1.5) + '<circle class="fu2" cx="' + (x + w * 0.8) + '" cy="' + (y + h * 0.5) + '" r="2.6"/>'; break;
      case 'crate':
        s += r('fu2', x, y, w, h, 2.5) + r('fw', x + w / 2 - 1.4, y, 2.8, h, 0) + r('fw', x, y + h / 2 - 1.4, w, 2.8, 0) + '<circle class="fu" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="2.6"/>';
        break;
      case 'barrel': s += '<ellipse class="fu" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + w / 2 + '" ry="' + h / 2 + '"/><path class="fl" d="M' + (x + 2) + ' ' + (y + h / 2) + 'H' + (x + w - 2) + '"/>'; break;
      case 'win': s += r('win', x, y, w, h, 1.5); break;
      case 'tree':
        s += '<circle class="fg" cx="' + x + '" cy="' + y + '" r="' + w / 2 + '"/><circle class="fg2" cx="' + (x - w * 0.12) + '" cy="' + (y - w * 0.1) + '" r="' + w * 0.26 + '"/>';
        break;
      case 'stool': s += '<circle class="fu" cx="' + x + '" cy="' + y + '" r="' + w / 2 + '"/>'; break;
      case 'vent': s += r('fu2', x, y, w, h, 2) + '<path class="fl" d="M' + (x + 3) + ' ' + (y + h / 2) + 'H' + (x + w - 3) + '"/>'; break;
      case 'wheel':
        s += '<circle class="fu2" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 2 + '"/><circle class="fw" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 5 + '"/>';
        for (m = 0; m < 8; m++) s += '<path class="fl" d="M' + (x + w / 2) + ' ' + (y + h / 2) + 'L' + (x + w / 2 + Math.cos(m * 0.785) * w / 2) + ' ' + (y + h / 2 + Math.sin(m * 0.785) * w / 2) + '"/>';
        break;
      case 'piano': s += r('ftv', x, y, w, h, 6) + r('fw', x + 4, y + h - 7, w - 8, 4, 1); break;
      case 'mirror': s += r('fw', x, y, w, h, 3) + r('win', x + 2, y + 2, w - 4, h - 4, 2); break;
      case 'roulette':
        s += '<circle class="fu" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 2 + '"/><circle class="ftv" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 3 + '"/><circle class="fw" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 9 + '"/>';
        break;
      case 'safe': s += r('ftv', x, y, w, h, 2) + '<circle class="fw" cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="' + w / 5 + '"/>'; break;
      case 'lift': s += r('fu2', x, y, w, h, 2) + '<path class="fl" d="M' + (x + w / 2) + ' ' + y + 'V' + (y + h) + '"/>'; break;
    }
    return s;
  }

  window.KioukanArt = { avatar: avatar, avatarInner: inner, defs: defs, furn: furn };
})();

