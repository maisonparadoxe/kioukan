
/* Illustrations « webtoon » : trait fin brun, ombrage doux en dégradés, grands yeux à reflets,
   cheveux en mèches, lumière de cinéma. Tout est vectoriel ; chaque portrait ou décor peut être
   remplacé par une vraie image (window.KIOUKAN_IMAGES) sans toucher au reste. */
(function () {
  'use strict';
  var uid = 0;
  var LINE = '#4a3330';

  var CAST = {
    'Hortense Lafleur':         { sex: 'f', skin: '#f6dccb', hair: ['#e9e7ee', '#a9a6b8'], style: 'bun',   eye: '#5d8f86', cloth: ['#2f7d73', '#1d5550'], x: ['glasses', 'brooch', 'collar'], age: 1 },
    'Comtesse Diane de Carat':  { sex: 'f', skin: '#f8e1d4', hair: ['#ffffff', '#c9c4d6'], style: 'curls', eye: '#7a5aa6', cloth: ['#8a5bb3', '#5a3680'], x: ['pearls', 'tiara', 'lips'], age: 1 },
    'Rémi Sansou':              { sex: 'm', skin: '#f5d7c3', hair: ['#f6dc8c', '#c9993e'], style: 'swept', eye: '#4f7fc4', cloth: ['#2c4a7c', '#1a2d4f'], x: ['shirt', 'bowtie'] },
    'Aria Vibrato':             { sex: 'f', skin: '#f7dccb', hair: ['#d8693f', '#8c2f1d'], style: 'waves', eye: '#3f9a6c', cloth: ['#2f8a62', '#195a3e'], x: ['earrings', 'lips', 'mole', 'straps'] },
    'Ernest Couchette':         { sex: 'm', skin: '#efc8ad', hair: ['#7a5236', '#3e2718'], style: 'short', eye: '#7a5236', cloth: ['#fbf8f1', '#d9d2c4'], x: ['cap', 'mustache', 'buttons'], age: 1 },
    'Jean Bilet':               { sex: 'm', skin: '#f2cfb6', hair: ['#4a4a55', '#24242c'], style: 'short', eye: '#4a5a7a', cloth: ['#3a4f8a', '#22305a'], x: ['cap', 'buttons'] },
    'Pr Hector Tumulus':        { sex: 'm', skin: '#f0cdb4', hair: ['#f2f2f2', '#b9b9c2'], style: 'short', eye: '#6b6b8a', cloth: ['#b59a6a', '#7c6340'], x: ['glasses', 'shirt', 'beard'], age: 1 },
    'Paul Ochon':               { sex: 'm', skin: '#f1d0b8', hair: ['#9a9aa6', '#5c5c66'], style: 'swept', eye: '#5a6a8a', cloth: ['#2a2a35', '#121218'], x: ['shirt', 'bowtie', 'mustache'], age: 1 },
    'André Vivalto':            { sex: 'm', skin: '#f0cdb4', hair: ['#6b4a3a', '#3a2418'], style: 'swept', eye: '#4a6a8a', cloth: ['#7a1c2a', '#4a0e18'], x: ['cap', 'buttons', 'mustache'], age: 1 },
    'Lise Défait':              { sex: 'f', skin: '#f6d8c6', hair: ['#5a3b2a', '#2e1c14'], style: 'bun',   eye: '#7a5236', cloth: ['#2a2a35', '#121218'], x: ['collar', 'apron'] },
    'Max Valise':               { sex: 'm', skin: '#e9c0a2', hair: ['#c0522e', '#7a2a14'], style: 'short', eye: '#5a7a4a', cloth: ['#b8323d', '#7a1c24'], x: ['cap', 'buttons'] },
    'Jacques Teil':             { sex: 'm', skin: '#dcae8c', hair: ['#2a2024', '#0e0a0c'], style: 'swept', eye: '#3a2a20', cloth: ['#ffffff', '#d9d2c4'], x: ['bowtie', 'mustache'] },
    'Ginette Pépite':           { sex: 'f', skin: '#f8e0d0', hair: ['#f4d27a', '#c99a2e'], style: 'curls', eye: '#3f7ac4', cloth: ['#e3b23c', '#a87c18'], x: ['pearls', 'earrings', 'lips'] },
    'Chef Al Dente':            { sex: 'm', skin: '#e8b996', hair: ['#2a2024', '#0e0a0c'], style: 'short', eye: '#3a2a20', cloth: ['#ffffff', '#e2dccf'], x: ['toque', 'mustache', 'buttons'] },
    'Maître Gérard Menvussa':   { sex: 'm', skin: '#f1d0b8', hair: ['#d9d9de', '#a0a0aa'], style: 'bald',  eye: '#5a5a6a', cloth: ['#1e1e28', '#0c0c12'], x: ['monocle', 'shirt', 'mustache'], age: 1 },
    'Basile Bouture':           { sex: 'm', skin: '#d9a47e', hair: ['#8a6a3a', '#4a3618'], style: 'short', eye: '#5a7a3a', cloth: ['#5f8a4a', '#3a5a2a'], x: ['hat', 'beard'] },
    'Julie Enne':               { sex: 'f', skin: '#f2cbb2', hair: ['#a0522d', '#5a2a14'], style: 'bun',   eye: '#7a5236', cloth: ['#f4efe6', '#d6cebd'], x: ['apron'] },
    'Lucie Fer':                { sex: 'f', skin: '#f8e4d8', hair: ['#1a1418', '#000000'], style: 'bob',   eye: '#b8323d', cloth: ['#7a1c24', '#3e0a10'], x: ['lips', 'earrings'] },
    'Hippolyte Plateau':        { sex: 'm', skin: '#f1d0b8', hair: ['#4a3a30', '#221a14'], style: 'swept', eye: '#5a4a3a', cloth: ['#1e1e28', '#0c0c12'], x: ['shirt', 'bowtie'], age: 1 },
    'Dr Mehdi Cament':          { sex: 'm', skin: '#c99272', hair: ['#2a2024', '#0e0a0c'], style: 'short', eye: '#3a2a20', cloth: ['#f4f6fb', '#d0d6e2'], x: ['glasses', 'shirt', 'beard'] },
    'Capitaine Jean Tempête':   { sex: 'm', skin: '#e8b996', hair: ['#f2f2f2', '#b9b9c2'], style: 'short', eye: '#3f6ac4', cloth: ['#1d2c5a', '#0e1838'], x: ['captain', 'beard', 'buttons'], age: 1 },
    'Marcel Hélice':            { sex: 'm', skin: '#e2b08c', hair: ['#5a3b2a', '#2e1c14'], style: 'short', eye: '#5a4a3a', cloth: ['#4a6a8a', '#2a4a6a'], x: ['hat', 'mustache'] },
    'Paul Ka':                  { sex: 'm', skin: '#f2d2bc', hair: ['#2a2024', '#0e0a0c'], style: 'swept', eye: '#3a3a5a', cloth: ['#2a2a35', '#121218'], x: ['shirt', 'bowtie'] },
    'Cécile Ence':              { sex: 'f', skin: '#f8e6dc', hair: ['#cfd3dc', '#8a90a0'], style: 'bob',   eye: '#6a7a9a', cloth: ['#5a6a8a', '#36425a'], x: [] },
    'Agathe Crispie':           { sex: 'f', skin: '#f6dccb', hair: ['#b9b4c6', '#7a7488'], style: 'curls', eye: '#4a7a6a', cloth: ['#7a6a9a', '#4a3a6a'], x: ['glasses', 'pearls'], age: 1 },
    'Enzo Lyrico':              { sex: 'm', skin: '#e2b08c', hair: ['#2a2024', '#0e0a0c'], style: 'waves', eye: '#3a2a20', cloth: ['#7a1c24', '#3e0a10'], x: ['shirt', 'mustache'] },
    'Maestro Vivaldo Baguette': { sex: 'm', skin: '#f1d0b8', hair: ['#f2f2f2', '#b9b9c2'], style: 'curls', eye: '#3a3a5a', cloth: ['#1e1e28', '#0c0c12'], x: ['shirt', 'bowtie'], age: 1 },
    'Paulette Paillette':       { sex: 'f', skin: '#f6d8c6', hair: ['#e86a9a', '#a0305a'], style: 'bob',   eye: '#5a3a6a', cloth: ['#e3b23c', '#b8862a'], x: ['earrings', 'lips'] },
    'Gérard Rideau':            { sex: 'm', skin: '#e9c0a2', hair: ['#7a5236', '#3e2718'], style: 'bald',  eye: '#5a4a3a', cloth: ['#3a2a2a', '#1e1414'], x: ['beard', 'glasses'] },
    'Sam Souffle':              { sex: 'm', skin: '#f2d2bc', hair: ['#c0522e', '#7a2a14'], style: 'short', eye: '#3a6a5a', cloth: ['#6a5a4a', '#3a2e24'], x: ['glasses'] },
    'René Vaplu':               { sex: 'm', skin: '#e8b996', hair: ['#2a2024', '#0e0a0c'], style: 'swept', eye: '#2a3a3a', cloth: ['#1a3a2a', '#0a1e14'], x: ['shirt', 'bowtie'] },
    'Jacques Potte':            { sex: 'm', skin: '#f1d0b8', hair: ['#9a9aa6', '#5c5c66'], style: 'bald',  eye: '#3a3a3a', cloth: ['#2a2a35', '#121218'], x: ['shirt', 'bowtie', 'monocle'], age: 1 },
    'Bernadette Banco':         { sex: 'f', skin: '#f4d2bc', hair: ['#f2a65a', '#b8682a'], style: 'waves', eye: '#3a6a3a', cloth: ['#b8323d', '#7a1c24'], x: ['earrings', 'lips', 'straps'] },
    // Partie rapide
    'Mme Vernet':               { sex: 'f', skin: '#f6dccb', hair: ['#d9d9de', '#9a9aa6'], style: 'bun',   eye: '#5a5a6a', cloth: ['#2a2a35', '#121218'], x: ['collar', 'brooch'], age: 1 },
    'Dr Aubry':                 { sex: 'm', skin: '#f1d0b8', hair: ['#7a5236', '#3e2718'], style: 'swept', eye: '#4a5a7a', cloth: ['#f4f6fb', '#d0d6e2'], x: ['glasses', 'shirt'] },
    'Lucas':                    { sex: 'm', skin: '#f5d7c3', hair: ['#c0522e', '#7a2a14'], style: 'swept', eye: '#3f7a5a', cloth: ['#3f7a5a', '#245038'], x: ['shirt'] },
    'Colonel Marchal':          { sex: 'm', skin: '#e9c0a2', hair: ['#f2f2f2', '#b9b9c2'], style: 'short', eye: '#4a5a6a', cloth: ['#5a6a3a', '#36421f'], x: ['cap', 'mustache', 'buttons'], age: 1 },
    'Inès':                     { sex: 'f', skin: '#c99272', hair: ['#2a2024', '#0e0a0c'], style: 'bob',   eye: '#3a2a20', cloth: ['#8a5bb3', '#5a3680'], x: ['earrings', 'glasses'] },
    'Mme Delaunay':             { sex: 'f', skin: '#f8e1d4', hair: ['#2a2024', '#0e0a0c'], style: 'waves', eye: '#5a3a6a', cloth: ['#1e1e28', '#0c0c12'], x: ['pearls', 'lips'], age: 1 },
    'Dr Moreau':                { sex: 'm', skin: '#f2cfb6', hair: ['#9a9aa6', '#5c5c66'], style: 'bald',  eye: '#4a5a7a', cloth: ['#4a4a55', '#24242c'], x: ['glasses', 'beard', 'shirt'], age: 1 },
    'Baron Voss':               { sex: 'm', skin: '#f8e4d8', hair: ['#f6dc8c', '#c9993e'], style: 'swept', eye: '#6a9ac4', cloth: ['#3a1c4a', '#1e0a28'], x: ['monocle', 'shirt', 'bowtie'] },
    'Roux':                     { sex: 'm', skin: '#e2b08c', hair: ['#5a3b2a', '#2e1c14'], style: 'short', eye: '#5a4a3a', cloth: ['#3a4f8a', '#22305a'], x: ['cap', 'buttons'] },
    'Mlle Ferrand':             { sex: 'f', skin: '#f7dccb', hair: ['#f4d27a', '#c99a2e'], style: 'bob',   eye: '#3f7ac4', cloth: ['#c2414f', '#7a1c24'], x: ['lips', 'earrings'] },
    'Mme Lefèvre':              { sex: 'f', skin: '#f6d8c6', hair: ['#a0522d', '#5a2a14'], style: 'curls', eye: '#3f9a6c', cloth: ['#2f8a62', '#195a3e'], x: ['pearls'] },
    'M. Costa':                 { sex: 'm', skin: '#dcae8c', hair: ['#2a2024', '#0e0a0c'], style: 'swept', eye: '#3a2a20', cloth: ['#1a3a2a', '#0a1e14'], x: ['shirt', 'bowtie', 'mustache'] },
    'Dr Bellamy':               { sex: 'f', skin: '#f2cbb2', hair: ['#4a3a30', '#221a14'], style: 'bun',   eye: '#4a7a6a', cloth: ['#f4f6fb', '#d0d6e2'], x: ['glasses', 'collar'] },
    'Mme Okafor':               { sex: 'f', skin: '#8a5a40', hair: ['#1a1418', '#000000'], style: 'curls', eye: '#3a2a20', cloth: ['#e3b23c', '#a87c18'], x: ['earrings', 'lips'] },
    'Chef Duval':               { sex: 'm', skin: '#e8b996', hair: ['#9a9aa6', '#5c5c66'], style: 'short', eye: '#5a5a6a', cloth: ['#ffffff', '#e2dccf'], x: ['toque', 'mustache', 'buttons'], age: 1 }
  };
  var DEF = { sex: 'f', skin: '#f6dccb', hair: ['#6b4a3a', '#3a2620'], style: 'waves', eye: '#6b4a3a', cloth: ['#7a8ab8', '#4c5a86'], x: [] };

  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var m = function (c) { return Math.max(0, Math.min(255, Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f))); };
    return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1);
  }
  function mix(a, b, t) {
    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    var c = function (sh) { return Math.round(((A >> sh) & 255) * (1 - t) + ((B >> sh) & 255) * t); };
    return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
  }
  function lg(id, a, b, x1, y1, x2, y2) {
    return '<linearGradient id="' + id + '" x1="' + (x1 || 0) + '" y1="' + (y1 || 0) + '" x2="' + (x2 || 0) + '" y2="' + (y2 === undefined ? 1 : y2) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
  }
  function ln(d, w, c, op) { return '<path d="' + d + '" fill="none" stroke="' + (c || LINE) + '" stroke-width="' + (w || 0.7) + '" stroke-linecap="round" stroke-linejoin="round"' + (op ? ' opacity="' + op + '"' : '') + '/>'; }
  function fl(d, f, op, stroke) { return '<path d="' + d + '" fill="' + f + '"' + (op ? ' opacity="' + op + '"' : '') + (stroke ? ' stroke="' + LINE + '" stroke-width="' + stroke + '" stroke-linejoin="round"' : '') + '/>'; }

  /* ---------- Portrait (viewBox 0 0 100 120) ---------- */
  function bust(name, expr) {
    var L = CAST[name] || DEF, id = 'w' + (++uid), x = L.x, e = expr || 'neutre';
    var has = function (k) { return x.indexOf(k) >= 0; };
    var skinS = mix(L.skin, '#e09a86', 0.35), skinD = mix(L.skin, '#c9705e', 0.6), H0 = L.hair[0], H1 = L.hair[1], male = L.sex === 'm';
    var h = '<defs>' +
      lg(id + 'h', H0, H1) + lg(id + 'c', L.cloth[0], L.cloth[1]) + lg(id + 's', L.skin, skinS) +
      '<radialGradient id="' + id + 'i" cx="0.5" cy="0.7" r="0.7"><stop offset="0" stop-color="' + shade(L.eye, 0.35) + '"/><stop offset="0.55" stop-color="' + L.eye + '"/><stop offset="1" stop-color="' + shade(L.eye, -0.55) + '"/></radialGradient>' +
      '<clipPath id="' + id + 'e"><path d="M36.3 52 Q42 46.2 47.8 51.4 Q42 55.8 36.3 52Z"/></clipPath>' +
      '<filter id="' + id + 'b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>' +
      '</defs>';
    // cheveux arrière
    if (L.style === 'waves') h += fl('M29 40C23 66 24 92 16 120L84 120C76 92 77 66 71 40C71 22 61 13 50 13C39 13 29 22 29 40Z', 'url(#' + id + 'h)', 0, 0.7);
    if (L.style === 'bob') h += fl('M30 42C27 58 28 70 31 78L69 78C72 70 73 58 70 42C70 24 61 15 50 15C39 15 30 24 30 42Z', 'url(#' + id + 'h)', 0, 0.7);
    if (L.style === 'bun') h += '<circle cx="63" cy="20" r="9.5" fill="url(#' + id + 'h)" stroke="' + LINE + '" stroke-width="0.7"/>' + ln('M57 16Q63 13 69 18M56 22Q62 26 70 22', 0.5, H1, 0.8);
    if (L.style === 'curls') h += [[33, 30, 9], [67, 30, 9], [30, 44, 7], [70, 44, 7]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="url(#' + id + 'h)" stroke="' + LINE + '" stroke-width="0.6"/>'; }).join('');
    // buste
    if (has('straps')) {
      h += fl('M6 120C8 99 25 91 42 88Q50 93 58 88C75 91 92 99 94 120Z', 'url(#' + id + 's)', 0, 0.7);
      h += fl('M14 120C16 106 26 100 38 101Q50 108 62 101C74 100 84 106 86 120Z', 'url(#' + id + 'c)', 0, 0.7);
      h += ln('M30 101L33 91M70 101L67 91', 0.9, L.cloth[1]);
    } else h += fl('M6 120C8 99 25 91 42 88Q50 93 58 88C75 91 92 99 94 120Z', 'url(#' + id + 'c)', 0, 0.7);
    if (has('shirt')) h += fl('M42 88L50 104L58 88Q50 93 42 88Z', '#ffffff', 0, 0.6);
    if (has('apron')) h += fl('M38 100Q50 104 62 100L64 120H36Z', '#ffffff', 0.95, 0.5);
    if (has('collar')) h += fl('M36 90L44 87L50 100L42 104Z', shade(L.cloth[0], 0.15), 0, 0.6) + fl('M64 90L56 87L50 100L58 104Z', shade(L.cloth[0], 0.15), 0, 0.6);
    if (has('buttons')) h += [100, 108, 116].map(function (y) { return '<circle cx="50" cy="' + y + '" r="1.5" fill="#e3b23c" stroke="' + LINE + '" stroke-width="0.4"/>'; }).join('') + ln('M41 89L50 98L59 89', 0.6);
    h += ln('M24 104Q30 110 30 120M76 104Q70 110 70 120', 0.5, LINE, 0.5);
    // cou
    h += fl('M43.5 70L43 90Q50 95 57 90L56.5 70Z', 'url(#' + id + 's)', 0, 0.6) + fl('M43 76Q50 85 57 76L57 83Q50 89 43 83Z', skinD, 0.35);
    if (has('pearls')) for (var p = 0; p < 9; p++) h += '<circle cx="' + (40 + p * 2.5) + '" cy="' + (90 + Math.sin(p / 8 * Math.PI) * 4.5) + '" r="1.25" fill="#fffaf2" stroke="#b9a99a" stroke-width="0.35"/>';
    if (has('brooch')) h += '<circle cx="62" cy="99" r="2.2" fill="#e8c35a" stroke="' + LINE + '" stroke-width="0.5"/><circle cx="61.4" cy="98.4" r="0.6" fill="#fff"/>';
    if (has('bowtie')) h += fl('M50 92L43.5 88.5L43.5 95.5ZM50 92L56.5 88.5L56.5 95.5Z', '#c8343a', 0, 0.6) + '<circle cx="50" cy="92" r="1.3" fill="#9c2229"/>';
    // oreilles et visage (tête agrandie, proportions manhwa)
    h += '<g transform="translate(50 54) scale(1.16) translate(-50 -54)">';
    h += fl('M33.5 49Q29 48 30 54Q31 59 35 58Z', L.skin, 0, 0.6) + fl('M66.5 49Q71 48 70 54Q69 59 65 58Z', L.skin, 0, 0.6);
    var face = male ? 'M33.5 44C33.5 60 37 70 44 76.5Q50 80.5 56 76.5C63 70 66.5 60 66.5 44C66.5 30 59.5 23 50 23C40.5 23 33.5 30 33.5 44Z'
                    : 'M33 45C33 62 41.5 74.5 50 78C58.5 74.5 67 62 67 45C67 30 59.5 23 50 23C40.5 23 33 30 33 45Z';
    h += fl(face, 'url(#' + id + 's)', 0, 0.75);
    h += fl('M33 45C33 62 41.5 74.5 50 78C45 72 39.5 62 39 51C38.6 41 42 34 46 30.5C40 31.5 33 36 33 45Z', skinD, 0.22);
    h += '<g filter="url(#' + id + 'b)"><ellipse cx="40" cy="61" rx="5" ry="2.3" fill="#ff8f8f" opacity="' + (e === 'gene' ? 0.55 : 0.25) + '"/><ellipse cx="60" cy="61" rx="5" ry="2.3" fill="#ff8f8f" opacity="' + (e === 'gene' ? 0.55 : 0.25) + '"/></g>';
    if (has('earrings')) h += '<path d="M31.5 58.5L31.5 63" stroke="#d9a63c" stroke-width="0.6"/><circle cx="31.5" cy="64.5" r="1.7" fill="#f0c95a" stroke="' + LINE + '" stroke-width="0.4"/><path d="M68.5 58.5L68.5 63" stroke="#d9a63c" stroke-width="0.6"/><circle cx="68.5" cy="64.5" r="1.7" fill="#f0c95a" stroke="' + LINE + '" stroke-width="0.4"/>';
    // yeux (le droit est le miroir du gauche)
    var irx = e === 'choc' ? 2.8 : 3.9, iry = e === 'choc' ? 3.5 : 4.7, look = e === 'gene' ? -1.4 : 0, lid = e === 'sourire' ? 1.6 : 0;
    var eye = '<g clip-path="url(#' + id + 'e)">' + fl('M36.3 52Q42 46.2 47.8 51.4Q42 55.8 36.3 52Z', '#fffdfb') +
      '<ellipse cx="' + (42.2 + look) + '" cy="51.6" rx="' + irx + '" ry="' + iry + '" fill="url(#' + id + 'i)"/>' +
      '<ellipse cx="' + (42.2 + look) + '" cy="51.4" rx="' + (irx * 0.45) + '" ry="' + (iry * 0.5) + '" fill="#1d1418"/>' +
      fl('M36 48H48V' + (49.4 + lid) + 'Q42 ' + (47 + lid) + ' 36 ' + (49.6 + lid) + 'Z', skinS, 0.9) +
      '<circle cx="' + (40.6 + look) + '" cy="49.8" r="1.25" fill="#fff"/><circle cx="' + (43.8 + look) + '" cy="53.6" r="0.6" fill="#fff" opacity="0.9"/></g>' +
      ln('M35.6 51.7Q41 ' + (45.6 + lid) + ' 48.1 51.2', male ? 1.2 : 1.55, '#2a1a1c') +
      (male ? '' : ln('M36 51.4L34.4 50.2M37.2 50L35.9 48.6', 0.7, '#2a1a1c')) +
      ln('M37.4 48.4Q42 45.2 46.8 47.8', 0.45, LINE, 0.6) + ln('M38.5 54.6Q42 55.9 45.8 54.2', 0.45, LINE, 0.5);
    var ez = male ? 'translate(41 51.5) scale(1.06 0.96) translate(-42 -51.5)' : 'translate(40.6 51.8) scale(1.16) translate(-42 -51.5)';
    eye = '<g transform="' + ez + '">' + eye + '</g>';
    h += eye + '<g transform="translate(100 0) scale(-1 1)">' + eye + '</g>';
    // sourcils
    var by = e === 'choc' ? -2 : e === 'serieux' ? 1 : 0, tilt = e === 'gene' ? -1.6 : e === 'serieux' ? 1.6 : 0;
    var brow = 'M36 ' + (44.6 + by) + 'Q41 ' + (41.4 + by) + ' 47 ' + (43.4 + by + tilt);
    h += ln(brow, male ? 1.5 : 1.05, H1) + '<g transform="translate(100 0) scale(-1 1)">' + ln(brow, male ? 1.5 : 1.05, H1) + '</g>';
    // nez, bouche
    h += ln('M50.8 57.6Q52.2 62.4 49.8 63.6', 0.65, '#b07a6c') + '<ellipse cx="51" cy="61.6" rx="0.7" ry="0.45" fill="#fff" opacity="0.7"/>';
    if (e === 'choc') h += '<ellipse cx="50" cy="69.3" rx="2.4" ry="2" fill="#7a2f3a" stroke="' + LINE + '" stroke-width="0.5"/>';
    else if (e === 'gene') h += ln('M46 69.4Q48 68.4 50 69.4Q52 70.4 54 69.2', 0.8, '#8a3f48');
    else if (e === 'sourire') h += ln('M45.5 68.4Q50 72.4 54.5 68.4', 0.9, '#8a3f48') + (male ? '' : fl('M46.5 69Q50 71.6 53.5 69Q50 70.2 46.5 69Z', '#e88a92', 0.7));
    else if (male) h += ln('M46.4 69.2Q50 70.4 53.6 69.2', 0.8, '#8a4f4f');
    else h += ln('M45.6 68.7Q48 67.5 50 68.3Q52 67.5 54.4 68.7', 0.75, '#a24b55') + fl('M46.4 69.1Q50 72.6 53.6 69.1Q50 70.1 46.4 69.1Z', has('lips') ? '#d24a5a' : '#e58c95', 0.85) + '<ellipse cx="51" cy="70.4" rx="1" ry="0.4" fill="#fff" opacity="0.6"/>';
    if (has('mole')) h += '<circle cx="56.6" cy="66" r="0.55" fill="#4a3330"/>';
    if (has('mustache')) h += fl('M43.5 67.4Q47 64.4 50 66.2Q53 64.4 56.5 67.4Q53 68.4 50 67.2Q47 68.4 43.5 67.4Z', H1, 0, 0.5);
    // cheveux devant
    var HG = 'url(#' + id + 'h)', strands = '';
    switch (L.style) {
      case 'bun':
        h += fl('M33 47C31 30 39 19 51 19C62 19 69 28 67 46C64 36 61 31 56 29C53 33 47 34 41 33C37 37 34 42 33 47Z', HG, 0, 0.7);
        h += fl('M33.5 46C32 52 32.4 58 34 62C35 56 35 51 36.2 47Z', HG, 0, 0.5);
        strands = 'M40 22Q46 26 49 33M52 20Q57 24 58 29M45 21Q41 27 38 34';
        break;
      case 'curls':
        h += [[37, 22, 7.5], [46, 18, 8], [56, 18, 8], [64, 23, 7.5], [34, 33, 6], [66, 33, 6]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + HG + '" stroke="' + LINE + '" stroke-width="0.6"/>'; }).join('');
        strands = 'M41 19Q46 22 45 27M51 15Q56 19 54 24M60 20Q64 24 61 29M33 30Q37 33 35 37';
        break;
      case 'waves':
        h += fl('M32 50C29 30 38 17 52 17C64 17 71 28 68 50C66 38 62 31 57 28C57 34 54 39 50 42C51 36 49 31 46 29C44 34 40 38 36 40C35 43 33 46 32 50Z', HG, 0, 0.7);
        h += fl('M32 49C29 62 31 74 27 86C34 80 36 70 35.5 58Z', HG, 0, 0.6) + fl('M68 49C71 62 69 74 73 86C66 80 64 70 64.5 58Z', HG, 0, 0.6);
        strands = 'M44 20Q50 26 50 34M55 19Q60 25 59 31M38 26Q36 34 37 40M30 64Q32 72 29 80M70 64Q68 72 71 80';
        break;
      case 'bob':
        h += fl('M31 52C29 30 38 18 51 18C63 18 71 29 69 52C67 42 65 36 62 33L38 33C35 37 33 44 31 52Z', HG, 0, 0.7);
        h += fl('M38 33Q50 38 62 33L62 30Q50 35 38 30Z', HG, 0, 0.5);
        strands = 'M42 21Q46 27 45 33M55 21Q56 27 56 33M49 19V33';
        break;
      case 'swept':
        h += fl('M32.5 45C30 26 40 15 53 15C65 15 71 25 68 44C66 35 62 30 57 27.5C53 31 45 31.5 38.5 32C35.5 36 33.5 40 32.5 45Z', HG, 0, 0.75);
        h += fl('M57 27.5C61 22 66 21 69 24C67 27 63 28 57 27.5Z', HG, 0, 0.5);
        strands = 'M38 22Q48 21 57 27M41 18Q51 18 61 24M44 30Q50 27 55 28';
        break;
      case 'bald':
        h += fl('M33 41C33 34 35 30 37 28C35 33 35 38 35.5 44Z', HG, 0, 0.5) + fl('M67 41C67 34 65 30 63 28C65 33 65 38 64.5 44Z', HG, 0, 0.5);
        strands = '';
        break;
      default: // court
        h += fl('M33 44C31 28 40 18 51 18C62 18 69 27 67 44C65 36 61 31 56 29.5C51 31.5 44 31.5 39 31.5C36 35 34 39 33 44Z', HG, 0, 0.75);
        strands = 'M40 22Q47 23 53 29M50 19Q57 21 61 27';
    }
    h += ln(strands, 0.5, H1, 0.75);
    h += ln(L.style === 'curls' ? 'M38 17Q46 12 56 13' : 'M38 25Q50 18 62 24', 1.6, '#ffffff', 0.35);
    if (has('tiara')) h += fl('M40 13L43 8.5L46 12L50 6.5L54 12L57 8.5L60 13Q50 11 40 13Z', '#f0c95a', 0, 0.5) + '<circle cx="50" cy="9.6" r="1" fill="#9fd6ff"/>';
    if (has('cap')) h += fl('M32 26Q31 12 50 11Q69 12 68 26Q50 22 32 26Z', '#7a4a2a', 0, 0.7) + fl('M30 27Q50 21 70 27L70 30Q50 25 30 30Z', '#3b2a20', 0, 0.6) + fl('M44 15H56V19H44Z', '#e3b23c', 0, 0.4);
    if (has('beard')) h += fl('M36 60Q38 76 50 81Q62 76 64 60Q60 70 50 71Q40 70 36 60Z', H1, 0.95, 0.5) + ln('M44 74Q50 76 56 74', 0.4, H0, 0.6);
    if (has('toque')) h += fl('M36 22Q34 6 42 6Q44 0 50 1Q56 0 58 6Q66 6 64 22Z', '#ffffff', 0, 0.7) + fl('M35 20H65V26H35Z', '#f2efe8', 0, 0.6);
    if (has('captain')) h += fl('M31 24Q31 10 50 10Q69 10 69 24Z', '#ffffff', 0, 0.7) + fl('M30 24Q50 19 70 24L71 28Q50 23 29 28Z', '#1a1a24', 0, 0.6) + fl('M46 13H54V18H46Z', '#e3b23c', 0, 0.4);
    if (has('hat')) h += fl('M30 25Q31 11 50 11Q69 11 70 25Q50 21 30 25Z', '#6a5a3a', 0, 0.7) + ln('M26 26Q50 20 74 26', 1.2, '#3a2e1e');
    if (has('monocle')) h += '<circle cx="59.4" cy="51.8" r="6" fill="#ffffff" fill-opacity="0.12" stroke="#c9a23c" stroke-width="0.9"/>' + ln('M65 54Q69 64 66 74', 0.5, '#c9a23c');
    if (has('apron')) h += '';
    if (has('glasses')) h += '<g fill="#ffffff" fill-opacity="0.12" stroke="#b08a3c" stroke-width="0.75"><circle cx="40.6" cy="51.8" r="6.6"/><circle cx="59.4" cy="51.8" r="6.6"/></g>' + ln('M47.2 51Q50 49.8 52.8 51M34 50.8L32.4 49.8M66 50.8L67.6 49.8', 0.7, '#b08a3c');
    if (L.age) h += ln('M37 56.5Q39 57.5 41 57.2M63 56.5Q61 57.5 59 57.2', 0.4, LINE, 0.45);
    if (e === 'gene') h += fl('M66 33Q64 37 65.5 39Q68 39 67.6 36.4Z', '#bfe3ff', 0.95, 0.4);
    h += '</g>';
    return h;
  }

  function portrait(name, expr, cls) {
    var key = slug(name) + ':' + (expr || 'neutre'), src = (window.KIOUKAN_IMAGES || {})[key] || (window.KIOUKAN_IMAGES || {})[slug(name)];
    if (src) {
      var fz = faceZoom(name);
      return '<img class="' + (cls || 'pimg') + (/-carte\./.test(src) ? ' pcard' : '') + (/-nb\./.test(src) ? ' pbw' : '') + '" src="' + src + '" alt=""' + (fz ? ' style="--fx:' + fz.fx + ';--fy:' + fz.fy + ';--z:' + fz.z + '"' : '') + '>';
    }
    return '<svg class="' + (cls || 'pimg') + '" viewBox="0 0 100 120" aria-hidden="true" focusable="false">' + bust(name, expr) + '</svg>';
  }

  /* Cadrage sur le visage (rond) : window.KIOUKAN_FACES = { slug: [centre x, centre y, largeur du visage] } en fraction de l'image */
  function faceZoom(name) {
    var f = (window.KIOUKAN_FACES || {})[slug(name)];
    return f ? { fx: f[0], fy: f[1], z: Math.round(0.62 / f[2] * 1000) / 1000 } : null;
  }
  /* Pastille ronde SVG (plans) : visage du portrait, centré en (0,0), diamètre d ; '' si pas d'image */
  var badgeUid = 0;
  function faceBadge(name, d) {
    var IM = window.KIOUKAN_IMAGES || {}, src = IM[slug(name) + ':neutre'] || IM[slug(name)], fz = faceZoom(name);
    if (!src || !fz) return '';
    var w = fz.z * d, h = w * 1.5, id = 'fb' + (++badgeUid);
    return '<clipPath id="' + id + '"><circle r="' + d / 2 + '"/></clipPath><g clip-path="url(#' + id + ')"><rect x="' + -d / 2 + '" y="' + -d / 2 + '" width="' + d + '" height="' + d + '" fill="#e9e6e0"/><image href="' + src + '" x="' + (-fz.fx * w) + '" y="' + (-fz.fy * h) + '" width="' + w + '" height="' + h + '" preserveAspectRatio="none"/></g>';
  }
  function slug(name) { name = window.frName ? window.frName(name) : name; return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---------- Décors (viewBox 0 0 400 260) ---------- */
  function sc(inner, id) { return '<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + inner + '</svg>'; }
  function blurDef(id, s) { return '<filter id="' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="' + s + '"/></filter>'; }

  var BG = {};
  BG.night = function () {
    var id = 'n' + (++uid), h = '<defs>' + lg(id + 's', '#1b2350', '#c97a5a') + '<radialGradient id="' + id + 'm"><stop offset="0" stop-color="#fff6d8"/><stop offset="0.3" stop-color="#fff0c0" stop-opacity="0.6"/><stop offset="1" stop-color="#fff0c0" stop-opacity="0"/></radialGradient>' + blurDef(id + 'b', 6) + blurDef(id + 'b2', 2.5) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 's)"/>';
    h += '<circle cx="318" cy="62" r="70" fill="url(#' + id + 'm)"/><circle cx="318" cy="62" r="17" fill="#fff7e2"/>';
    [[40, 30], [90, 52], [150, 20], [210, 40], [250, 16], [380, 110], [30, 90]].forEach(function (s) { h += '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="0.9" fill="#fff" opacity="0.8"/>'; });
    h += '<path d="M0 150Q80 120 170 142T400 132V260H0Z" fill="#5b4a72" opacity="0.65" filter="url(#' + id + 'b2)"/>';
    h += '<path d="M0 176Q100 150 210 170T400 162V260H0Z" fill="#3a3157"/>';
    h += '<rect x="0" y="188" width="400" height="10" fill="#2a2440"/>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<path d="M' + (i * 64 - 8) + ' 260V214Q' + (i * 64 + 24) + ' 194 ' + (i * 64 + 56) + ' 214V260Z" fill="#2a2440"/>'; }).join('');
    // train en contre-jour, fenêtres chaudes
    h += '<g><rect x="42" y="160" width="62" height="28" rx="4" fill="#1a1428"/><rect x="88" y="146" width="22" height="42" rx="3" fill="#1a1428"/><rect x="54" y="148" width="9" height="14" fill="#1a1428"/>';
    for (var j = 0; j < 4; j++) {
      var cx = 116 + j * 68;
      h += '<rect x="' + cx + '" y="158" width="64" height="30" rx="5" fill="#1d1830"/>';
      for (var w = 0; w < 5; w++) h += '<rect x="' + (cx + 5 + w * 12) + '" y="164" width="8" height="9" rx="1.5" fill="#ffc96b"/>';
    }
    h += '</g><g filter="url(#' + id + 'b)" opacity="0.8">' + [0, 1, 2, 3].map(function (j) { return '<rect x="' + (118 + j * 68) + '" y="162" width="60" height="12" fill="#ffb347"/>'; }).join('') + '</g>';
    h += '<g filter="url(#' + id + 'b)" fill="#f3ece6" opacity="0.85"><circle cx="58" cy="132" r="14"/><circle cx="40" cy="112" r="18"/><circle cx="14" cy="92" r="22"/></g>';
    h += '<rect y="200" width="400" height="60" fill="#d9c7e6" opacity="0.15" filter="url(#' + id + 'b)"/>';
    return sc(h);
  };
  BG.box = function () {
    var id = 'x' + (++uid), h = '<defs><radialGradient id="' + id + 'l" cx="0.7" cy="0.25" r="0.8"><stop offset="0" stop-color="#ffd59a"/><stop offset="0.5" stop-color="#8a4a2e"/><stop offset="1" stop-color="#2a1410"/></radialGradient>' + lg(id + 'v', '#b0202e', '#4a0a14') + blurDef(id + 'b', 5) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'l)"/>';
    h += '<g filter="url(#' + id + 'b)">' + [[300, 50, 22, '#ffe2a8'], [350, 90, 14, '#ffcf80'], [60, 60, 18, '#ff9f6b'], [110, 30, 10, '#ffd59a']].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + b[3] + '" opacity="0.55"/>'; }).join('') + '</g>';
    // écrin ouvert, vide
    h += '<path d="M90 150L310 150L330 230L70 230Z" fill="#3a1a12" stroke="' + LINE + '" stroke-width="1"/>';
    h += '<path d="M100 155L300 155L316 222L84 222Z" fill="url(#' + id + 'v)"/>';
    h += '<path d="M150 170Q200 210 250 170" fill="none" stroke="#5a0a16" stroke-width="7" stroke-linecap="round" opacity="0.8"/><path d="M150 170Q200 210 250 170" fill="none" stroke="#000" stroke-width="2" opacity="0.25"/>';
    h += '<path d="M96 150L112 70L288 70L304 150Z" fill="#4a2216" stroke="' + LINE + '" stroke-width="1"/><path d="M106 146L119 78L281 78L294 146Z" fill="url(#' + id + 'v)" opacity="0.85"/>';
    h += '<path d="M90 150H310" stroke="#e3b23c" stroke-width="2.4"/>';
    [[180, 120], [232, 106], [200, 96]].forEach(function (s) { h += '<path d="M' + s[0] + ' ' + (s[1] - 7) + 'L' + (s[0] + 1.6) + ' ' + (s[1] - 1.6) + 'L' + (s[0] + 7) + ' ' + s[1] + 'L' + (s[0] + 1.6) + ' ' + (s[1] + 1.6) + 'L' + s[0] + ' ' + (s[1] + 7) + 'L' + (s[0] - 1.6) + ' ' + (s[1] + 1.6) + 'L' + (s[0] - 7) + ' ' + s[1] + 'L' + (s[0] - 1.6) + ' ' + (s[1] - 1.6) + 'Z" fill="#fff8e0" opacity="0.85"/>'; });
    return sc(h);
  };
  BG.warm = function () {
    var id = 'r' + (++uid), h = '<defs>' + lg(id + 'g', '#e8b48a', '#6e3a2c') + blurDef(id + 'b', 8) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    h += '<g filter="url(#' + id + 'b)">' + [[70, 60, 34, '#ffe2b0', 0.7], [330, 40, 40, '#ffd08a', 0.6], [250, 120, 26, '#ffcf9a', 0.4], [20, 170, 30, '#c26a4a', 0.5], [380, 200, 36, '#7a2f2a', 0.6], [160, 30, 18, '#fff1d0', 0.5]].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + b[3] + '" opacity="' + b[4] + '"/>'; }).join('') +
      '<rect x="0" y="190" width="400" height="70" fill="#5a2a22" opacity="0.6"/></g>';
    return sc(h);
  };
  BG.cool = function () {
    var id = 'c' + (++uid), h = '<defs>' + lg(id + 'g', '#2e3e6e', '#a9b8d8', 0, 0, 1, 0) + blurDef(id + 'b', 7) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    h += '<g filter="url(#' + id + 'b)">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<rect x="' + (i * 72 - 20) + '" y="' + (40 + (i % 2) * 14) + '" width="90" height="4" fill="#ffffff" opacity="0.35"/>'; }).join('') +
      [[320, 70, 30, '#ffe7b0', 0.5], [60, 110, 24, '#d6e4ff', 0.5]].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + b[3] + '" opacity="' + b[4] + '"/>'; }).join('') + '</g>';
    return sc(h);
  };
  BG.watch = function () {
    var id = 'k' + (++uid), h = '<defs><radialGradient id="' + id + 'g" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#3b4a7a"/><stop offset="1" stop-color="#11142a"/></radialGradient>' + lg(id + 'o', '#f7dc8a', '#a4741e') + blurDef(id + 'b', 4) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    h += '<g filter="url(#' + id + 'b)" opacity="0.5"><circle cx="70" cy="60" r="20" fill="#ffd38a"/><circle cx="340" cy="200" r="26" fill="#8fb0ff"/></g>';
    h += '<path d="M200 30C210 30 214 22 214 16" fill="none" stroke="url(#' + id + 'o)" stroke-width="5" stroke-linecap="round"/>';
    h += '<circle cx="200" cy="40" r="10" fill="none" stroke="url(#' + id + 'o)" stroke-width="5"/>';
    h += '<circle cx="200" cy="140" r="92" fill="url(#' + id + 'o)" stroke="' + LINE + '" stroke-width="1.2"/><circle cx="200" cy="140" r="80" fill="#fbf6ea" stroke="' + LINE + '" stroke-width="0.8"/>';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; h += '<path d="M' + (200 + Math.sin(a) * 70) + ' ' + (140 - Math.cos(a) * 70) + 'L' + (200 + Math.sin(a) * 76) + ' ' + (140 - Math.cos(a) * 76) + '" stroke="#3a2a2a" stroke-width="' + (i % 3 ? 1.4 : 3) + '"/>'; }
    // 22 h 30 : petite aiguille entre 10 et 11, grande sur 6
    var ah = (10.5) * Math.PI / 6;
    h += '<path d="M200 140L' + (200 + Math.sin(ah) * 44) + ' ' + (140 - Math.cos(ah) * 44) + '" stroke="#2a1a1c" stroke-width="5" stroke-linecap="round"/>';
    h += '<path d="M200 140L200 206" stroke="#2a1a1c" stroke-width="3" stroke-linecap="round"/><circle cx="200" cy="140" r="5" fill="#2a1a1c"/>';
    h += '<path d="M150 74Q190 58 236 70" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.35"/>';
    return sc(h);
  };
  BG.corridor = function () {
    var id = 'd' + (++uid), h = '<defs>' + lg(id + 'g', '#f2c58a', '#5a2e24') + blurDef(id + 'b', 6) + blurDef(id + 'b2', 1.4) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    // perspective du couloir
    h += '<path d="M0 0L170 98L230 98L400 0Z" fill="#7a3f2c" opacity="0.5"/><path d="M0 260L170 160L230 160L400 260Z" fill="#3a1d16"/>';
    h += '<path d="M0 0L170 98L170 160L0 260Z" fill="#8a4a32"/><path d="M400 0L230 98L230 160L400 260Z" fill="#5a2c20"/>';
    h += '<rect x="170" y="98" width="60" height="62" fill="#ffe6b8"/>';
    h += '<g filter="url(#' + id + 'b)"><rect x="160" y="88" width="80" height="82" fill="#fff0cf" opacity="0.8"/></g>';
    [[40, 30, 70, 110], [110, 70, 140, 128]].forEach(function (w) { h += '<path d="M' + w[0] + ' ' + (w[1] + 10) + 'L' + w[2] + ' ' + (w[1] + 24) + 'L' + w[2] + ' ' + (w[3] - 6) + 'L' + w[0] + ' ' + w[3] + 'Z" fill="#2e3e6e" opacity="0.8"/>'; });
    // trois silhouettes à contre-jour
    var sil = function (x, s, kind) {
      var b = '<g transform="translate(' + x + ' 160) scale(' + s + ')" fill="#2a1612" filter="url(#' + id + 'b2)">';
      b += '<path d="M-20 0C-20 -30 -14 -46 0 -48C14 -46 20 -30 20 0Z"/><circle cx="0" cy="-58" r="10"/>';
      if (kind === 'cap') b += '<path d="M-11 -64Q0 -74 11 -64L13 -61L-13 -61Z"/>';
      if (kind === 'hair') b += '<path d="M-11 -60C-14 -46 -12 -36 -16 -26L-6 -40ZM11 -60C14 -46 12 -36 16 -26L6 -40Z"/>';
      if (kind === 'swept') b += '<path d="M-10 -62Q2 -74 14 -62L4 -64Z"/>';
      return b + '</g>';
    };
    h += sil(184, 0.55, 'hair') + sil(200, 0.62, 'swept') + sil(216, 0.55, 'cap');
    return sc(h);
  };
  BG.scream = function () {
    var id = 's' + (++uid), h = '<defs><radialGradient id="' + id + 'g" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#e2483d"/><stop offset="1" stop-color="#1a0a10"/></radialGradient></defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    for (var i = 0; i < 24; i++) { var a = i * Math.PI / 12; h += '<path d="M200 130L' + (200 + Math.cos(a) * 320) + ' ' + (130 + Math.sin(a) * 320) + '" stroke="#fff" stroke-width="' + (i % 2 ? 1 : 2.5) + '" opacity="0.18"/>'; }
    return sc(h);
  };

  BG.sea = function () {
    var id = 'e' + (++uid), h = '<defs>' + lg(id + 's', '#1b2350', '#6a4a7a') + lg(id + 'w', '#2a3a6a', '#0e1630') + blurDef(id + 'b', 5) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 's)"/><circle cx="90" cy="60" r="14" fill="#fff4d8"/><circle cx="90" cy="60" r="40" fill="#fff4d8" opacity="0.18" filter="url(#' + id + 'b)"/>';
    h += '<rect y="130" width="400" height="130" fill="url(#' + id + 'w)"/>';
    for (var i = 0; i < 9; i++) h += '<path d="M' + (i * 50 - 20) + ' ' + (150 + (i % 3) * 22) + 'q12 -5 24 0t24 0" fill="none" stroke="#9fb4e8" stroke-width="1.4" opacity="0.5"/>';
    h += '<path d="M60 64V150" stroke="#fff4d8" stroke-width="14" opacity="0.12" filter="url(#' + id + 'b)"/>';
    // bastingage
    h += '<rect y="200" width="400" height="6" fill="#d9c7a0"/><rect y="230" width="400" height="30" fill="#8a6a44"/>';
    for (var j = 0; j < 14; j++) h += '<rect x="' + (j * 30 + 8) + '" y="206" width="3" height="24" fill="#d9c7a0"/>';
    return sc(h);
  };
  BG.stage = function () {
    var id = 'g' + (++uid), h = '<defs>' + lg(id + 'c', '#b0202e', '#4a0a14') + '<radialGradient id="' + id + 'l" cx="0.5" cy="0.2" r="0.7"><stop offset="0" stop-color="#fff2c8" stop-opacity="0.9"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></radialGradient></defs>';
    h += '<rect width="400" height="260" fill="#2a0c12"/>';
    h += '<path d="M150 0L250 0L330 260L70 260Z" fill="url(#' + id + 'l)"/>';
    for (var i = 0; i < 6; i++) h += '<path d="M' + (i * 13) + ' 0Q' + (i * 13 + 8) + ' 130 ' + (i * 13 - 4) + ' 260H' + (i * 13 + 12) + 'Q' + (i * 13 + 20) + ' 130 ' + (i * 13 + 12) + ' 0Z" fill="url(#' + id + 'c)"/>';
    for (var j = 0; j < 6; j++) h += '<path d="M' + (400 - j * 13) + ' 0Q' + (392 - j * 13) + ' 130 ' + (404 - j * 13) + ' 260H' + (388 - j * 13) + 'Q' + (380 - j * 13) + ' 130 ' + (388 - j * 13) + ' 0Z" fill="url(#' + id + 'c)"/>';
    h += '<path d="M0 0H400V26Q200 46 0 26Z" fill="url(#' + id + 'c)"/><rect y="230" width="400" height="30" fill="#5a3420"/>';
    return sc(h);
  };
  BG.casino = function () {
    var id = 'q' + (++uid), h = '<defs>' + lg(id + 'g', '#1e4a34', '#0a1a12') + blurDef(id + 'b', 7) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    h += '<g filter="url(#' + id + 'b)">' + [[70, 50, 26, '#ffd36a'], [190, 30, 18, '#ffe9a8'], [330, 60, 30, '#ffc04a'], [260, 120, 16, '#ff8a5a'], [40, 150, 22, '#e3b23c']].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + b[3] + '" opacity="0.55"/>'; }).join('') + '</g>';
    h += '<ellipse cx="200" cy="250" rx="240" ry="70" fill="#2f7a4a"/><ellipse cx="200" cy="250" rx="240" ry="70" fill="none" stroke="#e3b23c" stroke-width="3"/>';
    [[120, 214], [160, 222], [250, 216], [290, 226]].forEach(function (c) { h += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="11" ry="4" fill="#c8343a" stroke="#fff" stroke-width="1.4"/>'; });
    return sc(h);
  };
  BG.garden = function () {
    var id = 'o' + (++uid), h = '<defs>' + lg(id + 's', '#f0b07a', '#7a4a6a') + blurDef(id + 'b', 2) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 's)"/><circle cx="300" cy="120" r="30" fill="#ffd9a0" opacity="0.8"/>';
    h += '<path d="M0 170Q100 140 200 160T400 150V260H0Z" fill="#6a5a7a" opacity="0.6" filter="url(#' + id + 'b)"/>';
    h += '<path d="M0 200Q120 180 230 196T400 190V260H0Z" fill="#4a4a3a"/>';
    [[60, 168, 1], [150, 176, 0.8], [340, 172, 1.1]].forEach(function (t) { h += '<g transform="translate(' + t[0] + ' ' + t[1] + ') scale(' + t[2] + ')"><path d="M-2 0V30H2V0Z" fill="#3a2a20"/><ellipse cx="0" cy="-8" rx="26" ry="18" fill="#6a7a4a"/><ellipse cx="-8" cy="-14" rx="12" ry="8" fill="#8a9a5a"/></g>'; });
    h += '<rect x="230" y="120" width="120" height="76" fill="#e8d2b0"/><path d="M222 122L290 90L358 122Z" fill="#b0503a"/>' + [0, 1, 2].map(function (i) { return '<rect x="' + (244 + i * 34) + '" y="138" width="16" height="22" fill="#ffd36a"/>'; }).join('');
    return sc(h);
  };
  BG.lobby = function () {
    var id = 'y' + (++uid), h = '<defs>' + lg(id + 'g', '#f2d8b0', '#8a5a3a') + blurDef(id + 'b', 6) + '</defs>';
    h += '<rect width="400" height="260" fill="url(#' + id + 'g)"/>';
    for (var i = 0; i < 5; i++) h += '<rect x="' + (20 + i * 80) + '" y="40" width="20" height="200" fill="#e8c890" opacity="0.6"/>';
    h += '<g filter="url(#' + id + 'b)"><circle cx="200" cy="40" r="40" fill="#fff4d0" opacity="0.8"/></g>';
    h += '<path d="M200 0V20" stroke="#c9a23c" stroke-width="2"/>' + [-30, -15, 0, 15, 30].map(function (d) { return '<circle cx="' + (200 + d) + '" cy="' + (36 + Math.abs(d) / 3) + '" r="3" fill="#fffbe8"/>'; }).join('');
    h += '<rect y="220" width="400" height="40" fill="#7a2a2a"/><rect x="120" y="226" width="160" height="34" fill="#a83a3a"/>';
    return sc(h);
  };

  function background(kind) {
    var src = (window.KIOUKAN_IMAGES || {})['bg:' + kind];
    return src ? '<img src="' + src + '" alt="">' : (BG[kind] || BG.warm)();
  }

  window.KioukanWT = { bust: bust, portrait: portrait, faceBadge: faceBadge, background: background, slug: slug };
})();
/* Couleur par suspect : d'après la tenue pour les personnages connus, automatique pour les autres */
(function(){
  var FIXED = {"Rémi Sansou": 0, "Aria Vibrato": 1, "Ernest Couchette": 2, "Pr Hector Tumulus": 3, "Jean Bilet": 4, "Lise Défait": 5, "Agathe Crispie": 6, "Comtesse Diane de Carat": 7, "Colonel Marchal": 8, "Dr Aubry": 9, "Dr Moreau": 10, "Mlle Ferrand": 11, "M. Costa": 12, "Mme Okafor": 13, "Chef Duval": 14, "Mme Vernet": 5, "Mme Delaunay": 5, "Lucas": 1, "Inès": 6, "Baron Voss": 7, "Roux": 0, "Mme Lefèvre": 3, "Dr Bellamy": 9};
  var N = 19;
  window.kioukanCI = function (names, s) {
    var used = {}, out = [], i, k;
    for (i = 0; i < names.length; i++) {
      var f = FIXED[window.frName ? window.frName(names[i]) : names[i]];
      if (f != null && !used[f]) { used[f] = 1; out.push(f); } else out.push(null);
    }
    var free = [];
    for (k = 15; k < N; k++) if (!used[k]) free.push(k);
    for (k = 0; k < 15; k++) if (!used[k]) free.push(k);
    var fi = 0;
    for (i = 0; i < names.length; i++) if (out[i] == null) { out[i] = free[fi % free.length]; fi++; }
    return s == null ? out : out[s];
  };
})();

/* Une icône unique par personnage, lisible en noir et blanc (plan, grille, version papier). */
(function () {
  var S = 'stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var F = 'fill="currentColor"';
  var G = {
    'Rémi Sansou': // bourse vide et rapiécée : le neveu fauché
      '<path d="M18 15C14 10 17 6 20 8L24 10L28 8C31 6 34 10 30 15" ' + S + '/><path d="M18 15C8 22 7 40 24 40C41 40 40 22 30 15Z" ' + S + '/><path d="M17 15H31" ' + S + '/><path d="M21 25L29 33M29 25L21 33" ' + S + '/>',
    'Aria Vibrato': // note de musique
      '<path d="M19 33V11L35 8V30" ' + S + '/><ellipse cx="15" cy="34" rx="5.5" ry="4.2" ' + F + '/><ellipse cx="31" cy="31" rx="5.5" ry="4.2" ' + F + '/><path d="M19 17L35 14" ' + S + '/>',
    'Ernest Couchette': // cloche de plateau
      '<path d="M8 32C8 20 15 13 24 13C33 13 40 20 40 32Z" ' + S + '/><circle cx="24" cy="10" r="2.6" ' + F + '/><path d="M5 36H43" ' + S + '/>',
    'Jean Bilet': // billet poinçonné
      '<path d="M7 15H41V21A3.4 3.4 0 0 0 41 27V33H7V27A3.4 3.4 0 0 0 7 21Z" ' + S + '/><path d="M31 15V33" ' + S + ' stroke-dasharray="1.5 4.5"/><circle cx="19" cy="24" r="3.4" ' + F + '/>',
    'Pr Hector Tumulus': // pyramide
      '<path d="M5 37L24 9L43 37Z" ' + S + '/><path d="M24 9V37" ' + S + ' opacity=".0"/><path d="M14 25H34" ' + S + '/><path d="M9.5 31H38.5" ' + S + ' opacity="0"/>',
    'André Vivalto': // sifflet à roulette
      '<path d="M24 22H43V30H31.5" ' + S + '/><circle cx="22" cy="31" r="9.5" ' + S + '/><circle cx="22" cy="31" r="3.2" ' + F + '/><path d="M28 22V18" ' + S + '/><circle cx="7" cy="14" r="3.6" ' + S + '/><path d="M10 16L14.5 23" ' + S + '/>',
    'Max Valise': // valise : le groom
      '<rect x="7" y="16" width="34" height="23" rx="3.5" ' + S + '/><path d="M18 16V10H30V16M16 16V39M32 16V39" ' + S + '/>',
    'Lise Défait': // lit défait : la femme de chambre
      '<path d="M6 40V12M42 40V26M6 30H42" ' + S + '/><path d="M6 26H42" ' + S + '/><rect x="10" y="18" width="11" height="7" rx="3" ' + F + '/><path d="M24 26C28 20 34 22 38 18" ' + S + '/>',
    'Chef Al Dente': // toque : le chef
      '<path d="M14 30C8 30 6 22 11 19C11 12 19 10 22 13C24 8 32 9 33 14C39 13 42 20 37 24C38 27 36 30 34 30Z" ' + S + '/><rect x="14" y="30" width="20" height="9" rx="1.5" ' + S + '/>',
    'Jacques Teil': // verre à cocktail : le barman
      '<path d="M8 9H40L24 26Z" ' + S + '/><path d="M24 26V38M16 39H32" ' + S + '/><circle cx="27" cy="15" r="3" ' + F + '/>',
    'Ginette Pépite': // diamant : la riche cliente
      '<path d="M15 10H33L41 19L24 40L7 19Z" ' + S + '/><path d="M7 19H41M20 10L17 19L24 40L31 19L28 10" ' + S + '/>',
    'Paul Ochon': // clé de l’hôtel : le directeur
      '<circle cx="14" cy="24" r="8" ' + S + '/><circle cx="14" cy="24" r="2.5" ' + F + '/><path d="M22 24H42M35 24V31M41 24V30" ' + S + '/>',
    'Maître Gérard Menvussa': // acte et sceau : le notaire
      '<path d="M12 8H34V30" ' + S + '/><path d="M12 8V36H28" ' + S + '/><path d="M17 15H29M17 21H29M17 27H23" ' + S + '/><circle cx="33" cy="35" r="6" ' + F + '/>',
    'Lucie Fer': // flamme : Lucie Fer
      '<path d="M24 5C31 13 37 18 37 28C37 35 31 41 24 41C17 41 11 35 11 28C11 22 15 18 17 13C18 20 21 22 24 22C22 16 22 10 24 5Z" ' + S + '/><path d="M24 41C20 41 18 37 19 33C20 30 22 29 24 26C26 30 29 32 29 35C29 39 27 41 24 41Z" ' + F + '/>',
    'Hippolyte Plateau': // bouteille : le majordome (le 1899)
      '<path d="M20 5H28V13C32 15 33 18 33 22V41H15V22C15 18 16 15 20 13Z" ' + S + '/><rect x="18" y="25" width="12" height="9" ' + F + '/>',
    'Julie Enne': // fouet : la cuisinière
      '<path d="M24 31C13 25 14 7 24 5C34 7 35 25 24 31Z" ' + S + '/><path d="M24 31C20 23 20 11 24 5C28 11 28 23 24 31Z" ' + S + '/><path d="M24 31V43" ' + S + ' stroke-width="5"/>',
    'Basile Bouture': // pousse : le jardinier
      '<path d="M24 40V20" ' + S + '/><path d="M24 25C14 27 8 19 9 10C18 10 24 16 24 25Z" ' + S + '/><path d="M24 21C31 21 39 15 39 8C31 6 24 12 24 21Z" ' + F + '/><path d="M13 41H35" ' + S + '/>',
    'Dr Mehdi Cament': // gélule : le médecin
      '<g transform="rotate(-40 24 24)"><rect x="6" y="16" width="36" height="16" rx="8" ' + S + '/><path d="M24 16H14A8 8 0 0 0 14 32H24Z" ' + F + '/></g>',
    'Marcel Hélice': // hélice : le mécanicien
      '<g ' + S + '><ellipse cx="24" cy="13" rx="5.5" ry="9"/><ellipse cx="24" cy="13" rx="5.5" ry="9" transform="rotate(120 24 24)"/><ellipse cx="24" cy="13" rx="5.5" ry="9" transform="rotate(240 24 24)"/></g><circle cx="24" cy="24" r="4.5" ' + F + '/>',
    'Paul Ka': // pique : Paul Ka (poker)
      '<path d="M24 7C30 15 39 19 39 27C39 32 35 35 31 34C28.5 33.5 27 32 26 30.5L28.5 41H19.5L22 30.5C21 32 19.5 33.5 17 34C13 35 9 32 9 27C9 19 18 15 24 7Z" ' + F + '/>',
    'Cécile Ence': // bulle barrée : la passagère silencieuse
      '<path d="M9 11H39V30H23L15 37V30H9Z" ' + S + '/><path d="M7 41L41 7" ' + S + '/>',
    'Agathe Crispie': // plume : la romancière
      '<path d="M39 6C25 8 15 18 13 33L15 35C30 33 40 22 39 6Z" ' + S + '/><path d="M9 42L31 16" ' + S + '/>',
    'Capitaine Jean Tempête': // ancre : le capitaine
      '<circle cx="24" cy="9" r="4" ' + S + '/><path d="M24 13V41M15 19H33" ' + S + '/><path d="M9 29C10 37 16 41 24 41C32 41 38 37 39 29" ' + S + '/><path d="M6 32L9 28L13 31M42 32L39 28L35 31" ' + S + '/>',
    'Enzo Lyrico': // étoile : le ténor
      '<path d="M24.0 8.0L28.4 18.9L40.2 19.7L31.1 27.3L34.0 38.8L24.0 32.5L14.0 38.8L16.9 27.3L7.8 19.7L19.6 18.9Z" ' + S + '/>',
    'Paulette Paillette': // ciseaux : l’habilleuse
      '<circle cx="14" cy="36" r="5.5" ' + S + '/><circle cx="34" cy="36" r="5.5" ' + S + '/><path d="M17.5 31.5L33 7M30.5 31.5L15 7" ' + S + '/>',
    'Sam Souffle': // livret ouvert : le souffleur
      '<path d="M24 14C18 10 12 10 6 12V36C12 34 18 34 24 38C30 34 36 34 42 36V12C36 10 30 10 24 14Z" ' + S + '/><path d="M24 14V38" ' + S + '/>',
    'Gérard Rideau': // rideau de scène : le régisseur
      '<path d="M5 9H43" ' + S + '/><path d="M8 9H22C21 22 16 31 8 34Z" ' + F + '/><path d="M40 9H26C27 22 32 31 40 34Z" ' + F + '/><path d="M8 41H40" ' + S + '/>',
    'Maestro Vivaldo Baguette': // baguette de pain : le maestro Baguette
      '<path d="M10 40C5 35 8 29 14 23L28 9C34 4 41 5 43 8C45 12 42 18 36 23L22 37C16 42 13 43 10 40Z" ' + S + '/><path d="M17 26L22 30M23 20L28 24M29 14L34 18" ' + S + '/>',
    'René Vaplu': // roulette : le croupier
      '<circle cx="24" cy="24" r="15" ' + S + '/><circle cx="24" cy="24" r="6" ' + S + '/><path d="M30.0 24.0L39.0 24.0M28.2 28.2L34.6 34.6M24.0 30.0L24.0 39.0M19.8 28.2L13.4 34.6M18.0 24.0L9.0 24.0M19.8 19.8L13.4 13.4M24.0 18.0L24.0 9.0M28.2 19.8L34.6 13.4" ' + S + ' stroke-width="2.4"/><circle cx="24" cy="24" r="2" ' + F + '/>',
    'Bernadette Banco': // dé : la joueuse
      '<rect x="9" y="9" width="30" height="30" rx="6" ' + S + '/><circle cx="17" cy="17" r="3" ' + F + '/><circle cx="31" cy="17" r="3" ' + F + '/><circle cx="24" cy="24" r="3" ' + F + '/><circle cx="17" cy="31" r="3" ' + F + '/><circle cx="31" cy="31" r="3" ' + F + '/>',
    'Jacques Potte': // cerises de machine à sous : le directeur du casino (jackpot)
      '<circle cx="15" cy="34" r="6.5" ' + F + '/><circle cx="32" cy="36" r="6.5" ' + F + '/><path d="M15 28C18 18 24 12 31 8M32 30C30 22 30 14 31 8" ' + S + '/><path d="M31 8C35 5 41 7 42 12C38 13 34 12 31 8Z" ' + F + '/>',
    'Comtesse Diane de Carat': // couronne : la comtesse
      '<path d="M8 34L10 14L18 24L24 10L30 24L38 14L40 34Z" ' + S + '/><path d="M8 40H40" ' + S + '/>'
  };
  window.KioukanIcons = { names: Object.keys(G), has: function (n) { n = window.frName ? window.frName(n) : n; return !!G[n]; }, glyph: function (n) { return G[n]; },
    svg: function (n, o) { o = o || {}; n = window.frName ? window.frName(n) : n; return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="color:' + (o.fg || '#1d1a22') + '" aria-hidden="true" focusable="false">' + (o.ring === false ? '<circle cx="24" cy="24" r="24" style="fill:' + (o.bg || '#fff') + '"/>' : '<circle cx="24" cy="24" r="22.5" style="fill:' + (o.bg || '#fff') + ';stroke:' + (o.fg || '#1d1a22') + '" stroke-width="2.4"/>') + '<g transform="translate(24 24) scale(' + (o.scale || .62) + ') translate(-24 -24)">' + G[n] + '</g></svg>'; } };
})();

