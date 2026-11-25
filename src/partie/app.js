
(function () {
  'use strict';
  var E = window.KioukanEngine;
  var ROOMS, SUSPECTS, STEP, DOORS, GEO, SC;
  var EN = window.KIOUKAN_LANG === 'en', IT = window.KIOUKAN_LANG === 'it', TR = window.T;
  function pl(n, one, many) { return n > 1 ? many : one; }
  var LEVELS = E.LEVELS;
  var tl = E.timeLabel;

  /* Plans (viewBox 350 x 210) et vocabulaire propres à chaque décor */
  var Art = window.KioukanArt, WT = window.KioukanWT;
  var SCENE_UI = {
    manoir: {
      label: TR('Manoir'), plan: TR('Plan du manoir'),
      dead: TR('Le maître des lieux a été retrouvé mort'), watch: TR('Sa montre s’est arrêtée à'), where: TR('dans le manoir ce soir-là'),
      geo: [
        { x: 120, y: 80, w: 110, h: 70, f: 'check', fu: [['plant', 90, 34, 16, 26], ['table', 8, 46, 28, 16]] },
        { x: 10, y: 80, w: 110, h: 70, f: 'wood', fu: [['sofa', 8, 46, 48, 18], ['tv', 80, 52, 22, 10], ['plant', 92, 24, 14, 22]] },
        { x: 230, y: 80, w: 110, h: 70, f: 'tile', fu: [['counter', 6, 50, 98, 14], ['table', 78, 24, 26, 16]] },
        { x: 10, y: 10, w: 110, h: 70, f: 'wood', fu: [['shelf', 6, 52, 98, 12], ['chair', 84, 28, 14, 14], ['plant', 8, 26, 14, 22]] },
        { x: 120, y: 10, w: 110, h: 70, f: 'diamond', fu: [['desk', 30, 48, 50, 16], ['plant', 90, 30, 14, 24]] },
        { x: 230, y: 10, w: 110, h: 70, f: 'steel', fu: [['crate', 8, 44, 20, 20], ['crate', 82, 44, 20, 20], ['barrel', 46, 48, 18, 16]] },
        { x: 10, y: 150, w: 330, h: 50, f: 'grass', out: 1, fu: [['tree', 24, 34, 18], ['tree', 306, 34, 18], ['plant', 100, 28, 12, 18], ['plant', 230, 28, 12, 18]] }
      ]
    },
    train: {
      label: TR('Train'), plan: TR('Plan du train'),
      dead: TR('Un riche voyageur a été retrouvé mort'), watch: TR('Sa montre à gousset s’est arrêtée à'), where: TR('à bord de l’express cette nuit-là'),
      geo: [
        { x: 10, y: 60, w: 55, h: 100, l: 'FOURGON', f: 'steel', fu: [['crate', 5, 68, 20, 20], ['crate', 30, 68, 20, 20], ['crate', 17, 40, 18, 18]] },
        { x: 65, y: 60, w: 55, h: 100, l: 'LIT A', f: 'wood', fu: [['win', 7, 22, 16, 8], ['win', 32, 22, 16, 8], ['bed', 6, 66, 43, 26]] },
        { x: 120, y: 60, w: 55, h: 100, l: 'LIT B', f: 'wood', fu: [['win', 7, 22, 16, 8], ['win', 32, 22, 16, 8], ['bed', 6, 66, 43, 26]] },
        { x: 175, y: 60, w: 55, h: 100, l: 'RESTO', f: 'check', fu: [['win', 7, 22, 16, 8], ['win', 32, 22, 16, 8], ['table', 5, 68, 20, 16], ['table', 30, 68, 20, 16]] },
        { x: 230, y: 60, w: 55, h: 100, l: 'BAR', f: 'tile', fu: [['win', 7, 22, 16, 8], ['win', 32, 22, 16, 8], ['counter', 5, 74, 45, 14], ['stool', 13, 68, 8], ['stool', 27, 68, 8], ['stool', 41, 68, 8]] },
        { x: 285, y: 60, w: 55, h: 100, l: 'FUMOIR', f: 'diamond', fu: [['win', 7, 22, 16, 8], ['win', 32, 22, 16, 8], ['sofa', 5, 70, 45, 20]] },
        { x: 120, y: 22, w: 165, h: 38, l: 'TOIT', f: 'steel', out: 1, fu: [['vent', 14, 22, 18, 10], ['vent', 74, 22, 18, 10], ['vent', 134, 22, 18, 10]] }
      ],
      deco: '<path class="rail" d="M4 176H346M4 182H346"/>' +
        [37, 92, 147, 202, 257, 312].map(function (x) { return '<circle class="wheel" cx="' + x + '" cy="166" r="6"/>'; }).join('')
    },
    hotel: {
      label: TR('Hôtel'), plan: TR('Plan de l’hôtel'),
      dead: TR('Le directeur de l’hôtel a été retrouvé mort'), watch: TR('Sa montre s’est arrêtée à'), where: TR('dans l’hôtel ce soir-là'),
      geo: [
        { x: 10, y: 125, w: 85, h: 75, l: 'BAR', f: 'wood', fu: [['counter', 6, 56, 73, 14], ['stool', 16, 48, 9], ['stool', 40, 48, 9], ['stool', 64, 48, 9]] },
        { x: 95, y: 125, w: 95, h: 75, l: 'RÉCEPTION', f: 'check', fu: [['desk', 20, 54, 55, 16], ['plant', 78, 26, 14, 22]] },
        { x: 190, y: 125, w: 80, h: 75, l: 'RESTAURANT', f: 'diamond', fu: [['table', 6, 52, 24, 16], ['table', 48, 52, 24, 16], ['plant', 34, 28, 12, 18]] },
        { x: 270, y: 125, w: 70, h: 75, l: 'CUISINES', f: 'tile', fu: [['counter', 5, 58, 60, 13], ['table', 38, 26, 22, 14]] },
        { x: 95, y: 55, w: 45, h: 70, l: 'ASC.', f: 'steel', fu: [['lift', 10, 46, 25, 18]] },
        { x: 140, y: 55, w: 130, h: 70, l: 'COULOIR', f: 'diamond', fu: [['plant', 8, 36, 14, 24], ['plant', 108, 36, 14, 24]] },
        { x: 270, y: 55, w: 70, h: 70, l: 'SUITE 12', f: 'wood', fu: [['bed', 6, 44, 38, 20], ['plant', 52, 28, 12, 20]] },
        { x: 95, y: 10, w: 245, h: 45, l: 'TERRASSE', f: 'grass', out: 1, fu: [['tree', 22, 32, 18], ['table', 112, 28, 22, 12], ['stool', 108, 22, 7], ['stool', 138, 22, 7], ['tree', 222, 32, 18]] }
      ]
    }
  };
  function bindScene() {
    E.setScene(state.scene);
    ROOMS = E.ROOMS; SUSPECTS = E.SUSPECTS; STEP = E.STEP; DOORS = E.DOORS;
    SC = SCENE_UI[state.scene]; GEO = SC.geo;
  }
var ROOM_TINT = ['#3f8fd0', '#e0a21f', '#8a63c9', '#1f9d96', '#a8743f', '#8a9a22', '#5b6fa8', '#d07a2f'], OUT_TINT = '#4ea35a';
  function roomTint(G, r, k) { return G.out ? OUT_TINT : ROOM_TINT[(r - (k || 0)) % ROOM_TINT.length]; }
  function inRoom(r) { if (IT) return ROOMS[r].inn || E.itIn(ROOMS[r].the, ROOMS[r].on); return (EN ? (ROOMS[r].on ? 'on ' : 'in ') : (ROOMS[r].on ? 'sur ' : 'dans ')) + ROOMS[r].the; }
  function unitize(str) { return EN || IT ? str.replace(/\{unit\}/g, E.SCENE.unit) : str.replace(/pièce/g, E.SCENE.unit); }
  function doorRect(a, b) {
    var A = GEO[a], B = GEO[b];
    var x1 = Math.max(A.x, B.x), x2 = Math.min(A.x + A.w, B.x + B.w);
    var y1 = Math.max(A.y, B.y), y2 = Math.min(A.y + A.h, B.y + B.h);
    if (x2 > x1) {
      var wy = (A.y + A.h === B.y) ? B.y : A.y, cx = (x1 + x2) / 2;
      return { x: cx - 11, y: wy - 3, w: 22, h: 6 };
    }
    var wx = (A.x + A.w === B.x) ? B.x : A.x, cy = (y1 + y2) / 2;
    return { x: wx - 3, y: cy - 11, w: 6, h: 22 };
  }

  var ICON = {
    ok: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bad: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    pending: '',
    'true': null, 'false': null,
    lock: '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3.4 5.4V4a2.6 2.6 0 0 1 5.2 0v1.4M2.4 5.4h7.2v5.2H2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
  };
  ICON['true'] = ICON.ok; ICON['false'] = ICON.bad;
  var NUMWORD = { 3: 'Trois', 4: 'Quatre', 5: 'Cinq' };

  var state = {
    scene: 'manoir', mode: 'classic', liarGuess: -1, level: 'moyen', puz: null, grid: [], given: [], selT: 0,
    live: true, checked: false, hideOk: false, picker: null,
    hints: 0, solved: false, accuse: false, accused: [], wrong: 0, early: 0
  };

  function isLiar(P) { return P.mode === 'liar' || P.mode === 'half'; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  function $(id) { return document.getElementById(id); }
  function pad4(n) { return ('0000' + n).slice(-4); }
  function g(s, t) { return state.grid[s * state.puz.T + t]; }

  /* ---------- Analyse de la grille ---------- */
  function showMarks() { return state.live || state.checked; }

  function analyse() {
    var P = state.puz, T = P.T, bad = {}, errors = 0, s, t, a, b, liarMode = isLiar(P), half = P.mode === 'half', L = state.liarGuess;
    for (s = 0; s < P.S; s++) {
      for (t = 1; t < T; t++) {
        a = g(s, t - 1); b = g(s, t);
        if (a >= 0 && b >= 0 && !((STEP[a] >> b) & 1)) { bad[s * T + t - 1] = 1; bad[s * T + t] = 1; errors++; }
      }
    }
    var items = [];
    if (!liarMode) {
      var list = [{ type: 'crime' }].concat(P.clues.filter(function (c) { return c.type !== 'at'; }));
      items = list.map(function (c) {
        var st = E.evalClue(P, c, g);
        if (st === 'bad') {
          errors++;
          E.badCells(P, c, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; });
        }
        return { c: c, st: st };
      });
    } else {
      var crimeSt = E.evalClue(P, { type: 'crime' }, g), gl = L >= 0 ? g(L, P.crime.t) : -1, rst = 'pending';
      if (crimeSt === 'bad' || (L >= 0 && gl >= 0 && gl !== P.crime.room)) rst = 'bad';
      else if (crimeSt === 'ok' && L >= 0 && gl === P.crime.room) rst = 'ok';
      if (rst === 'bad') {
        errors++;
        if (crimeSt === 'bad') E.badCells(P, { type: 'crime' }, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; });
        if (L >= 0 && gl >= 0 && gl !== P.crime.room) bad[L * T + P.crime.t] = 1;
      }
      items.push({ c: { type: 'crime' }, st: rst, rule: true });
      P.clues.forEach(function (c) {
        if (c.by === undefined) return;
        var tv = E.evalClue(P, c, g), st;
        if (tv === 'pending') st = 'pending';
        else if (L < 0 || (half && c.by === L)) st = tv === 'ok' ? 'true' : 'false';
        else st = ((tv === 'ok') === (c.by !== L)) ? 'ok' : 'bad';
        if (st === 'bad') {
          errors++;
          E.badCells(P, c, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; });
        }
        items.push({ c: c, st: st });
      });
      if (half && L >= 0) {
        var nt = 0, nf = 0, nu = 0;
        P.clues.forEach(function (c) {
          if (c.by !== L) return;
          var tv2 = E.evalClue(P, c, g);
          if (tv2 === 'pending') nu++; else if (tv2 === 'ok') nt++; else nf++;
        });
        var mst = (nt >= 1 && nf >= 1) ? 'ok' : (nu === 0 ? 'bad' : 'pending');
        if (mst === 'bad') errors++;
        items.push({ c: null, st: mst, mix: true });
      }
    }
    var okCount = 0, filled = 0;
    items.forEach(function (it) { if (it.st === 'ok') okCount++; });
    state.grid.forEach(function (v) { if (v >= 0) filled++; });
    return { bad: bad, errors: errors, items: items, okCount: okCount, filled: filled };
  }

  function gridCorrect() {
    var sol = state.puz.solution;
    return state.grid.every(function (v, i) { return v === sol[i]; });
  }

  /* ---------- Rendu ---------- */
  function renderLevels() {
    $('levels').innerHTML = Object.keys(LEVELS).map(function (k) {
      return '<button type="button" data-act="level" data-level="' + k + '" aria-pressed="' + (k === state.level) + '">' + LEVELS[k].label + '</button>';
    }).join('');
  }

  function renderScenes() {
    $('scenes').innerHTML = Object.keys(SCENE_UI).map(function (k) {
      return '<button type="button" data-act="scene" data-scene="' + k + '" aria-pressed="' + (k === state.scene) + '">' + SCENE_UI[k].label + '</button>';
    }).join('');
  }

  function renderModes() {
    var M = { classic: TR('Classique'), liar: TR('Un menteur'), half: TR('Demi-vérités') };
    $('modes').innerHTML = Object.keys(M).map(function (k) {
      var D = { classic: TR('Tous les indices du carnet sont vrais : il suffit de reconstituer la seule chronologie qui les respecte tous.'),
        liar: TR('Les suspects font des déclarations. Un seul ment, et c’est le coupable : toutes ses déclarations sont fausses.'),
        half: TR('Le coupable mêle le vrai et le faux : au moins une de ses déclarations est vraie et au moins une est fausse. Les innocents disent toujours vrai.') };
      return '<button type="button" data-act="mode" data-mode="' + k + '" aria-pressed="' + (k === state.mode) + '" title="' + D[k] + '">' + M[k] + '</button>';
    }).join('');
  }

  var RULES = {
    classic: [
      TR('Chaque case de la <b>chronologie</b> indique la pièce où se trouvait un suspect à une heure donnée. Touche une case pour choisir la pièce.'),
      TR('Entre deux heures, un suspect <b>reste sur place</b> ou <b>passe une porte</b> (les traits colorés du plan). Un mur sans porte ne se traverse pas.'),
      TR('Tous les <b>constats</b> sont vrais. Il n’existe qu’une seule chronologie qui les respecte tous.'),
      TR('À l’heure du crime, un seul suspect se trouvait dans la pièce du crime : c’est le <b>meurtrier</b>. Complète la grille pour le démasquer.'),
      TR('Touche une heure pour voir qui était où sur le plan. Les cases au fond doré sont des alibis déjà confirmés.')
    ],
    liar: [
      TR('Chaque case de la <b>chronologie</b> indique la pièce où se trouvait un suspect à une heure donnée. Entre deux heures, on reste sur place ou on passe une porte.'),
      TR('Chaque suspect fait des <b>déclarations</b>. Les innocents disent la vérité. <b>Un seul suspect ment</b>, et toutes ses déclarations sont fausses.'),
      TR('Le menteur est le <b>meurtrier</b> : c’est le seul suspect qui se trouvait dans la pièce du crime à l’heure du crime.'),
      TR('Désigne celui que tu soupçonnes sous <b>Qui ment ?</b>, puis remplis la grille. Chaque déclaration se vérifie sur la chronologie : essaie un suspect, change d’avis si ça coince.'),
      TR('Les <b>preuves</b> sont des faits certains. Elles sont déjà placées dans les cases au fond doré.')
    ],
    half: [
      TR('Chaque case de la <b>chronologie</b> indique la pièce où se trouvait un suspect à une heure donnée. Entre deux heures, on reste sur place ou on passe une porte.'),
      TR('Chaque suspect fait des <b>déclarations</b>. Les innocents disent toujours la vérité.'),
      TR('Le <b>meurtrier</b> mélange le vrai et le faux : <b>au moins une</b> de ses déclarations est vraie et <b>au moins une</b> est fausse. C’est le seul suspect qui se trouvait dans la pièce du crime à l’heure du crime.'),
      TR('Désigne celui que tu soupçonnes sous <b>Qui ment ?</b>. Ses déclarations s’affichent alors comme vraies ou fausses d’après ta grille, et il doit en avoir des deux sortes.'),
      TR('Les <b>preuves</b> sont des faits certains. Elles sont déjà placées dans les cases au fond doré.')
    ]
  };

  function modesHelp(cur) {
    var items = [['classic', TR('Classique'), TR('Tous les indices du carnet sont vrais : il suffit de reconstituer la seule chronologie qui les respecte tous.')],
      ['liar', TR('Un menteur'), TR('Les suspects font des déclarations. Un seul ment, et c’est le coupable : toutes ses déclarations sont fausses.')],
      ['half', TR('Demi-vérités'), TR('Le coupable mêle le vrai et le faux : au moins une de ses déclarations est vraie et au moins une est fausse. Les innocents disent toujours vrai.')]];
    return '<li class="modes-help"><b>' + TR('Les trois modes de jeu') + '</b><ul>' + items.map(function (m) {
      return '<li' + (m[0] === cur ? ' class="cur"' : '') + '><b>' + m[1] + '</b>' + (m[0] === cur ? ' <em>(' + TR('mode actuel') + ')</em>' : '') + ' : ' + m[2] + '</li>';
    }).join('') + '</ul></li>';
  }
  function renderRules() {
    var extra = [
      isLiar(state.puz || { mode: state.mode })
        ? TR('Dans ce mode, le coupable est le menteur. <b>Qui ment ?</b> sert à tester une hypothèse (les déclarations se colorent). <b>J’accuse !</b> sert à la valider : une bonne accusation gagne tout de suite.')
        : TR('Pas besoin de tout remplir : dès que tu es sûr, touche <b>J’accuse !</b> et désigne le coupable. Une bonne accusation gagne tout de suite. Une mauvaise est comptée comme une erreur et le suspect est écarté.'),
      TR('<b>Vérification en direct</b> : cochée, les erreurs apparaissent aussitôt en rouge (une case qui contredit un constat, ou un trajet impossible). Décochée, rien ne s’affiche pendant que tu joues : le bouton <b>Vérifier</b> contrôle alors toute la grille d’un coup, à la demande. C’est le mode sans filet.')
    ];
    $('rules-list').innerHTML = RULES[state.mode].concat(extra).map(function (r) { return '<li>' + unitize(r) + '</li>'; }).join('') + modesHelp(state.mode);
  }

  function renderCase() {
    var P = state.puz;
    var liarMode = isLiar(P), half = P.mode === 'half';
    $('dossier').textContent = IT ? 'Fascicolo n. ' + pad4(P.seed % 10000) + ' · ' + P.S + ' sospettati · ' + P.T + ' fasce orarie' + (liarMode ? (half ? ' · mezze verità' : ' · un bugiardo') : '') : EN ? 'Case no. ' + pad4(P.seed % 10000) + ' · ' + P.S + ' suspects · ' + P.T + ' time slots' + (liarMode ? (half ? ' · half-truths' : ' · one liar') : '') : 'Dossier n° ' + pad4(P.seed % 10000) + ' · ' + P.S + ' suspects · ' + P.T + ' créneaux' + (liarMode ? (half ? ' · demi-vérités' : ' · un menteur') : '');
    $('case').innerHTML =
      '<p class="eyebrow">' + TR('L’affaire') + '</p>' +
      '<h2>' + SC.dead + ' ' + (IT ? '<em>' + inRoom(P.crime.room) + '</em>' : (EN ? (ROOMS[P.crime.room].on ? 'on' : 'in') : (ROOMS[P.crime.room].on ? 'sur' : 'dans')) + ' <em>' + ROOMS[P.crime.room].the + '</em>') + '.</h2>' +
      '<p>' + SC.watch + ' <b class="mono">' + tl(P.crime.t) + '</b>. ' + TR(NUMWORD[P.S]) +
      (liarMode
        ? (half
          ? TR(' suspects ont été interrogés. Les innocents ont dit la vérité. Le meurtrier, seul avec la victime à cet instant, a mêlé le vrai et le faux : au moins une de ses déclarations est vraie, au moins une est fausse. Démasque-le.') + '</p>'
          : TR(' suspects ont été interrogés. Les innocents ont dit la vérité. Le meurtrier, seul avec la victime à cet instant, a menti dans chacune de ses déclarations. Démasque-le.') + '</p>')
        : (IT ? ' sospettati si trovavano ' + SC.where + ', e uno solo di loro era con lui in quell’istante. Ricostruisci i loro spostamenti per scoprire chi.' : EN ? ' suspects were ' + SC.where + ', and only one of them was with him at that moment. Reconstruct their movements to find out which.' : ' suspects se trouvaient ' + SC.where + ', et un seul d’entre eux était avec lui à cet instant. Reconstitue leurs déplacements pour trouver lequel.') + '</p>');
  }

  function pill(x, y, text) {
    var w = Math.round(text.length * 5.8 + 12);
    return '<g class="pill"><rect x="' + (x - w / 2) + '" y="' + (y - 6.5) + '" width="' + w + '" height="13" rx="6.5"/><text x="' + x + '" y="' + (y + 0.4) + '">' + text + '</text></g>';
  }

  function renderMap() {
    var P = state.puz, T = P.T, t = state.selT, r, s, i, svg = '', chips = '';
    for (i = 0; i < T; i++) {
      chips += '<button type="button" class="chip' + (i === P.crime.t ? ' crime' : '') + '" data-act="time" data-t="' + i +
        '" aria-pressed="' + (i === t) + '">' + tl(i) + '</button>';
    }
    svg += '<svg class="plan" viewBox="0 0 350 210" role="img" aria-label="' + SC.plan + ' ' + TR('à') + ' ' + tl(t) + '">' + Art.defs() + '<defs><clipPath id="tokc"><circle r="10.4"/></clipPath></defs>';
    // plan dessiné à la main (mêmes plans que le mode histoire pour le manoir et l'hôtel)
    var IMG = (window.KIOUKAN_IMAGES || {})['plan:' + ({ manoir: 'manoir', hotel: 'palace', train: 'train' })[state.scene]];
    if (IMG) svg += '<image href="' + IMG + '" x="0" y="0" width="350" height="210" preserveAspectRatio="xMidYMid slice"/>';
    if (!IMG) for (r = 0; r < ROOMS.length; r++) {
      var G = GEO[r];
      svg += '<rect x="' + G.x + '" y="' + G.y + '" width="' + G.w + '" height="' + G.h + '" fill="url(#pf-' + G.f + ')"/>';
    }
    svg += SC.deco && !IMG ? '<g class="deco">' + SC.deco + '</g>' : '';
    if (!IMG) for (r = 0; r < ROOMS.length; r++) {
      var G1 = GEO[r];
      svg += '<g class="furn">' + G1.fu.map(function (f) { return Art.furn(f[0], G1.x + f[1], G1.y + f[2], f[3], f[4]); }).join('') + '</g>';
    }
    for (r = 0; r < ROOMS.length; r++) {
      var GT = GEO[r];
      svg += '<rect class="rtint" x="' + GT.x + '" y="' + GT.y + '" width="' + GT.w + '" height="' + GT.h + '" fill="' + roomTint(GT, r) + '"/>';
    }
    if (!IMG) for (r = 0; r < ROOMS.length; r++) {
      var G3 = GEO[r];
      svg += '<rect class="wall" x="' + G3.x + '" y="' + G3.y + '" width="' + G3.w + '" height="' + G3.h + '"/>';
    }
    var cr = GEO[P.crime.room];
    svg += '<rect class="crimeroom" x="' + (cr.x + 3) + '" y="' + (cr.y + 3) + '" width="' + (cr.w - 6) + '" height="' + (cr.h - 6) + '" rx="3"/>';
    if (!IMG) DOORS.forEach(function (d) {
      var R = doorRect(d[0], d[1]);
      svg += '<rect class="door" x="' + R.x + '" y="' + R.y + '" width="' + R.w + '" height="' + R.h + '" rx="2"/>';
    });
    for (r = 0; r < ROOMS.length; r++) {
      var G4 = GEO[r];
      svg += pill(G4.x + G4.w / 2, G4.y + 11, (EN || IT ? '' : G4.l) || ROOMS[r].name.toUpperCase());
    }
    var burst = [], bi, br;
    for (bi = 0; bi < 12; bi++) { br = bi % 2 ? 6.5 : 11; burst.push((Math.sin(bi * Math.PI / 6) * br).toFixed(1) + ',' + (-Math.cos(bi * Math.PI / 6) * br).toFixed(1)); }
    svg += '<g class="crimemark" transform="translate(' + (cr.x + cr.w / 2) + ',' + (cr.y + cr.h - 12) + ')"><polygon points="' + burst.join(' ') + '"/><path d="M-2.6 -2.6L2.6 2.6M2.6 -2.6L-2.6 2.6"/></g>';
    var occ = ROOMS.map(function () { return []; });
    for (s = 0; s < P.S; s++) { var v = g(s, t); if (v >= 0) occ[v].push(s); }
    occ.forEach(function (list, room) {
      var G2 = GEO[room], n = list.length, isC = room === P.crime.room;
      var cols = Math.max(1, Math.min(n, Math.floor((G2.w - 4) / 24)));
      var rows = Math.ceil(n / cols);
      var top = G2.y + 20, bottom = G2.y + G2.h - (isC ? 20 : 4), avail = bottom - top;
      var step = Math.min(23, rows > 1 ? (avail - 21) / (rows - 1) : 23);
      var y0 = top + (avail - (21 + (rows - 1) * step)) / 2 + 10.5;
      list.forEach(function (sid, k) {
        var row = Math.floor(k / cols), col = k % cols, inRow = Math.min(cols, n - row * cols);
        var x = G2.x + G2.w / 2 + (col - (inRow - 1) / 2) * 24, y = y0 + row * step;
        var cul = state.solved && t === P.crime.t && sid === P.culprit;
        svg += '<g class="tok s' + ci(sid) + (cul ? ' culprit' : '') + '" transform="translate(' + x + ',' + y + ')">' +
          '<circle class="halo" r="12.5"/><circle class="face" r="10.4"/>' +
          (WT ? (WT.faceBadge(SUSPECTS[sid].name, 20.8) || '<g clip-path="url(#tokc)"><svg x="-10.4" y="-8.6" width="20.8" height="25" viewBox="14 22 72 86">' + WT.bust(SUSPECTS[sid].name, 'neutre') + '</svg></g>')
            : '<g transform="translate(-9.6 -9.6) scale(0.3)" clip-path="url(#tokclip)">' + Art.avatarInner(SUSPECTS[sid].name) + '</g>') +
          '<circle class="ring" r="10.4"/></g>';
      });
    });
    svg += '</svg>';
    $('map-panel').innerHTML =
      '<div class="panel-hd"><h2 class="label">' + SC.plan + '</h2><span class="sub">' + TR('à') + ' ' + tl(t) + '</span></div>' +
      '<div class="chips" style="--n:' + T + '">' + chips + '</div>' + svg +
      '<p class="legend"><span><i class="lg-door"></i>' + TR('porte') + '</span><span><i class="lg-crime"></i>' + TR('scène du crime') + '</span></p>';
  }

  function pola(sid, extra) {
    return '<figure class="pola s' + ci(sid) + '" title="' + SUSPECTS[sid].name + '"><div class="pola-img">' + face(sid) + '</div>' +
      '<figcaption><span class="pn">' + SUSPECTS[sid].short + '</span>' + (extra || '') + '</figcaption></figure>';
  }
  function ci(s) { return window.kioukanCI(SUSPECTS.map(function (x) { return x.name; }), s); }
  function mini(sid) { return '<span class="mini s' + ci(sid) + '">' + face(sid) + '</span>'; }
  function face(sid) { return WT ? WT.portrait(SUSPECTS[sid].name, 'neutre') : Art.avatar(SUSPECTS[sid].name); }

  function renderSuspects() {
    var P = state.puz, el = $('suspects'), s, h = '';
    if (!P || isLiar(P)) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    h += '<div class="panel-hd"><h2 class="label">' + TR('Les suspects') + '</h2><span class="sub">' + P.S + ' ' + TR('personnes') + '</span></div>';
    h += '<div class="fiches" style="--n:' + (P.S <= 4 ? P.S : 3) + ';--N:' + P.S + '">';
    for (s = 0; s < P.S; s++) h += pola(s, '<small>' + SUSPECTS[s].role + '</small>');
    el.innerHTML = h + '</div>';
  }

  function renderBoard() {
    var P = state.puz, S = P.S, T = P.T, A = analyse(), show = showMarks(), s, t, h = '';
    h += '<div class="panel-hd"><h2 class="label">' + TR('Chronologie') + '</h2><span class="sub">' + TR('touche une case') + '</span></div>';
    h += '<div class="board' + (S >= 5 ? ' dense' : '') + '" style="--cols:' + S + '"><div></div>';
    for (s = 0; s < S; s++) {
      h += '<div class="who s' + ci(s) + '">' + mini(s) + '<b>' + SUSPECTS[s].short + '</b>' +
        (isLiar(P) && state.liarGuess === s ? '<small class="liar-badge">menteur ?</small>' : (S <= 4 ? '<small>' + SUSPECTS[s].role + '</small>' : '')) + '</div>';
    }
    for (t = 0; t < T; t++) {
      var isCrime = t === P.crime.t;
      h += '<button type="button" class="time' + (t === state.selT ? ' sel' : '') + '" data-act="time" data-t="' + t + '">' + tl(t) + (isCrime ? '<small>crime</small>' : '') + '</button>';
      for (s = 0; s < S; s++) {
        var idx = s * T + t, v = state.grid[idx], given = state.given[idx];
        var cls = 'cell s' + ci(s) + (v < 0 ? ' empty' : '') + (given ? ' given' : '') + (show && !given && A.bad[idx] ? ' bad' : '');
        var label = SUSPECTS[s].name + ', ' + tl(t) + ' : ' + (v < 0 ? TR('vide') : ROOMS[v].name) + (given ? ' (' + TR('confirmé') + ')' : '');
        h += '<button type="button" class="' + cls + '" data-act="cell" data-s="' + s + '" data-t="' + t + '" aria-label="' + label + '"' +
          (given || state.solved ? ' disabled' : '') + '>' + (v < 0 ? '' : ROOMS[v].short) + (given ? ICON.lock : '') + '</button>';
      }
    }
    h += '</div>';
    if (isLiar(P) && !state.solved) {
      h += '<div class="liar"><span class="liar-q">Qui ment ?</span><div class="liar-btns">';
      for (s = 0; s < S; s++) {
        h += '<button type="button" class="liar-btn s' + ci(s) + '" data-act="liar" data-s="' + s + '" aria-pressed="' + (state.liarGuess === s) + '">' + mini(s) + SUSPECTS[s].short + '</button>';
      }
      h += '</div></div>';
    }
    h += '<div class="status"><span>' + A.filled + '/' + (S * T) + ' ' + TR('cases') + '</span>' +
      (show ? '<span class="' + (A.errors ? 'err' : '') + '">' + A.errors + ' ' + TR(pl(A.errors, 'contradiction', 'contradictions')) + '</span>' : '<span>' + TR('vérification en direct désactivée') + '</span>') +
      (isLiar(P) && !state.solved && state.liarGuess < 0 && gridCorrect() ? '<span class="err">' + TR('chronologie complète : désigne le menteur') + '</span>' : '') +
      (state.wrong && !state.solved ? '<span class="err">' + state.wrong + ' ' + TR(pl(state.wrong, 'fausse accusation', 'fausses accusations')) + ' (' + state.accused.map(function (x) { return SUSPECTS[x].short; }).join(', ') + ' : ' + TR('innocent') + ')</span>' : '') +
      '</div>';
    if (!state.solved) {
      h += '<div class="actions"><label class="switch"><input type="checkbox" id="live"' + (state.live ? ' checked' : '') + '><span>' + TR('Vérification en direct') + '</span></label>' +
        '<div class="btns">' +
        (state.live ? '' : '<button type="button" class="btn sm" data-act="check" title="' + TR('Contrôle toute la grille d’un coup') + '">' + TR('Vérifier') + '</button>') +
        '<button type="button" class="btn sm" data-act="hint">' + TR('Indice') + '</button>' +
        '<button type="button" class="btn sm" data-act="reset">' + TR('Effacer') + '</button>' +
        '<button type="button" class="btn sm accuse" data-act="accuse">' + TR('J’accuse !') + '</button></div></div>' +
        '<p class="hintline">' + (state.live
          ? TR('Vérification en direct : les erreurs s’affichent tout de suite en rouge.')
          : TR('Vérification manuelle : rien ne s’affiche tant que tu n’appuies pas sur « Vérifier », qui contrôle toute la grille d’un coup.')) + '</p>';
    }
    $('board-panel').innerHTML = h;
  }

  function renderCluesLiar() {
    var P = state.puz, A = analyse(), show = showMarks(), L = state.liarGuess, S = P.S, s, h = '';
    var total = A.items.length;
    h += '<div class="panel-hd"><h2 class="label">' + TR('Déclarations') + '</h2><span class="sub">' +
      (show ? (L < 0 ? TR('désigne un menteur') : A.okCount + '/' + total + ' ' + TR('confirmées')) : total + ' ' + TR('constats')) + '</span></div>';
    h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les déclarations confirmées') + '</span></label>';
    function li(it, text) {
      var st = show ? it.st : 'pending';
      if (state.hideOk && st === 'ok') return '';
      var tag = (st === 'true' || st === 'false') ? '<span class="tag">' + (st === 'true' ? 'vrai' : 'faux') + '</span>' : '';
      return '<li class="clue ' + st + (it.rule ? ' rule' : '') + '"><span class="ico">' + ICON[st] + '</span><span class="txt">' + text + ' ' + tag + '</span></li>';
    }
    var rule = A.items.filter(function (it) { return it.rule; })[0];
    h += '<ul class="clues">' + li(rule, IT ? 'Il bugiardo è l’assassino: solo lui si trovava ' + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + '.' : EN ? 'The liar is the killer: only they were ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + '.' : 'Le menteur est le meurtrier : lui seul se trouvait ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) + '.') + '</ul>';
    var facts = P.clues.filter(function (c) { return c.by === undefined; });
    if (facts.length) {
      h += '<div class="speaker"><b>' + TR('Preuves') + '</b><span class="tag">' + TR('certaines') + '</span></div><ul class="clues proof-list">' +
        facts.map(function (c) { return '<li class="clue ok proof"><span class="ico">' + ICON.lock + '</span><span class="txt">' + E.clueText(P, c) + '</span></li>'; }).join('') + '</ul>';
    }
    for (s = 0; s < S; s++) {
      var mix = (P.mode === 'half' && L === s) ? A.items.filter(function (it) { return it.mix; })[0] : null;
      var rows = (mix ? li(mix, TR('Au moins une de ses déclarations est vraie et au moins une est fausse.')) : '') + A.items.filter(function (it) { return !it.rule && !it.mix && it.c.by === s; }).map(function (it) {
        return li(it, EN ? '“' + E.statementText(P, it.c) + '”' : IT ? '«' + E.statementText(P, it.c) + '»' : '« ' + E.statementText(P, it.c) + ' »');
      }).join('');
      var who = L < 0 ? '' : (L === s ? '<span class="tag liar-tag">' + TR(P.mode === 'half' ? 'ment en partie' : 'ment : tout est faux') + '</span>' : '<span class="tag">' + TR('dit vrai') + '</span>');
      h += '<div class="sp s' + ci(s) + '">' + pola(s, '<small>' + SUSPECTS[s].role + '</small>' + who) +
        (rows ? '<ul class="clues bubbles">' + rows + '</ul>' : '<p class="empty-note">' + TR('Toutes ses déclarations sont confirmées.') + '</p>') + '</div>';
    }
    $('clues-panel').innerHTML = h;
  }

  function renderClues() {
    if (isLiar(state.puz)) { renderCluesLiar(); return; }
    var A = analyse(), show = showMarks();
    var h = '<div class="panel-hd"><h2 class="label">' + TR('Constats') + '</h2><span class="sub">' +
      (show ? A.okCount + '/' + A.items.length + ' ' + TR('confirmés') : A.items.length + ' ' + TR('constats')) + '</span></div>';
    h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les constats confirmés') + '</span></label>';
    var rows = A.items.map(function (it) {
      var st = show ? it.st : 'pending';
      if (state.hideOk && st === 'ok') return '';
      return '<li class="clue ' + st + (it.c.type === 'crime' ? ' rule' : '') + '"><span class="ico">' + ICON[st] + '</span><span class="txt">' + E.clueText(state.puz, it.c) + '</span></li>';
    }).join('');
    h += rows ? '<ul class="clues">' + rows + '</ul>' : '<p class="empty-note">' + TR('Tous les constats sont confirmés.') + '</p>';
    $('clues-panel').innerHTML = h;
  }

  function mineCount() {
    var P = state.puz;
    return P.clues.filter(function (c) { return c.by === P.liar; }).length;
  }
  function falseCount() {
    var P = state.puz, gs = function (s, t) { return P.solution[s * P.T + t]; };
    return P.clues.filter(function (c) { return c.by === P.liar && E.evalClue(P, c, gs) !== 'ok'; }).length;
  }

  function renderVerdict() {
    var P = state.puz, el = $('verdict');
    if (!state.solved) { el.innerHTML = ''; return; }
    var c = SUSPECTS[P.culprit];
    el.innerHTML = '<div class="panel verdict"><div class="v-top">' + pola(P.culprit, '<small class="guilty">' + TR('coupable') + '</small>') + '<div class="stamp">' + TR('Affaire classée') + '</div></div>' +
      (IT
        ? (P.mode === 'half'
          ? '<p><b>' + c.name + '</b> mescolava vero e falso: ' + falseCount() + ' delle sue ' + mineCount() + ' dichiarazioni ' + (falseCount() > 1 ? 'erano false' : 'era falsa') + '. Era ' + (c.f ? 'sola' : 'solo') + ' ' + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + '. Gli altri sospettati hanno sempre detto la verità.</p>'
          : P.mode === 'liar'
          ? '<p><b>' + c.name + '</b> mentiva. Era ' + (c.f ? 'sola' : 'solo') + ' ' + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + ', e ognuna delle sue dichiarazioni era falsa. Gli altri sospettati dicevano la verità.</p>'
          : '<p><b>' + c.name + '</b> era ' + (c.f ? 'sola' : 'solo') + ' ' + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + '. Tutti gli altri alibi reggono.</p>')
        : '') + (EN && !IT
        ? (P.mode === 'half'
          ? '<p><b>' + c.name + '</b> mixed truth and lies: ' + falseCount() + ' of ' + (c.f ? 'her' : 'his') + ' ' + mineCount() + ' statements ' + (falseCount() > 1 ? 'were false' : 'was false') + '. ' + (c.f ? 'She' : 'He') + ' was alone ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + '. The other suspects always told the truth.</p>'
          : P.mode === 'liar'
          ? '<p><b>' + c.name + '</b> was lying. ' + (c.f ? 'She' : 'He') + ' was alone ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + ', and every one of ' + (c.f ? 'her' : 'his') + ' statements was false. The other suspects told the truth.</p>'
          : '<p><b>' + c.name + '</b> was alone ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + '. Every other alibi holds.</p>')
        : '') + (EN || IT ? '' :
      (P.mode === 'half'
        ? '<p><b>' + c.name + '</b> mêlait le vrai et le faux : ' + falseCount() + ' de ' + (c.f ? 'ses' : 'ses') + ' ' + mineCount() + ' déclarations ' + (falseCount() > 1 ? 'étaient fausses' : 'était fausse') + '. ' + (c.f ? 'Elle' : 'Il') + ' était ' + (c.f ? 'seule' : 'seul') + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) +
          '. Les autres suspects disaient toujours vrai.</p>'
        : P.mode === 'liar'
        ? '<p><b>' + c.name + '</b> mentait. ' + (c.f ? 'Elle' : 'Il') + ' était ' + (c.f ? 'seule' : 'seul') + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) +
          ', et chacune de ses déclarations était fausse. Les autres suspects disaient vrai.</p>'
        : '<p><b>' + c.name + '</b> était ' + (c.f ? 'seule' : 'seul') + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) +
          '. Tous les autres alibis tiennent.</p>')) +
      '<p class="sub">' + (IT
        ? ((state.early ? 'Accusa esatta con ancora ' + state.early + ' casell' + (state.early > 1 ? 'e' : 'a') + ' della cronologia da riempire. ' : '') +
           (state.hints ? state.hints + ' indizi' + (state.hints > 1 ? '' : 'o') + ' usat' + (state.hints > 1 ? 'i' : 'o') + '. ' : 'Nessun indizio usato. ') +
           (state.wrong ? state.wrong + ' accus' + (state.wrong > 1 ? 'e' : 'a') + ' sbagliat' + (state.wrong > 1 ? 'e' : 'a') + '.' : 'Nessuna accusa sbagliata.'))
        : EN
        ? ((state.early ? 'Correct accusation with ' + state.early + ' timeline cell' + (state.early > 1 ? 's' : '') + ' still empty. ' : '') +
           (state.hints ? state.hints + ' hint' + (state.hints > 1 ? 's' : '') + ' used. ' : 'No hints used. ') +
           (state.wrong ? state.wrong + ' wrong accusation' + (state.wrong > 1 ? 's' : '') + '.' : 'No wrong accusations.'))
        : ((state.early ? 'Accusation exacte alors que ' + state.early + ' case' + (state.early > 1 ? 's' : '') + ' de la chronologie restaient à remplir. ' : '') +
           (state.hints ? state.hints + ' indice' + (state.hints > 1 ? 's' : '') + ' utilisé' + (state.hints > 1 ? 's' : '') + '. ' : 'Aucun indice utilisé. ') +
           (state.wrong ? state.wrong + ' fausse' + (state.wrong > 1 ? 's' : '') + ' accusation' + (state.wrong > 1 ? 's' : '') + '.' : 'Aucune fausse accusation.'))) + '</p>' +
      '<button type="button" class="btn primary" data-act="new">' + TR('Affaire suivante') + '</button></div>';
  }

  function renderSheet() {
    var root = $('sheet-root'), p = state.picker;
    if (state.accuse && state.puz) {
      var P0 = state.puz, ab = '';
      for (var q0 = 0; q0 < P0.S; q0++) {
        var out = state.accused.indexOf(q0) >= 0;
        ab += '<button type="button" class="acc-btn s' + ci(q0) + (out ? ' out' : '') + '" data-act="accpick" data-s="' + q0 + '"' + (out ? ' disabled' : '') + '>' +
          pola(q0, '<small>' + (out ? TR('innocent') : SUSPECTS[q0].role) + '</small>') + '</button>';
      }
      root.innerHTML = '<div class="scrim" data-act="close"></div>' +
        '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + TR('Désigner le coupable') + '">' +
        '<div class="sheet-hd"><b class="acc-t">' + TR('J’accuse…') + '</b></div>' +
        '<p class="trail">' + TR('Qui est le meurtrier ? Une mauvaise réponse est comptée comme une erreur.') + '</p>' +
        '<div class="acc-grid" style="--n:' + (P0.S <= 4 ? P0.S : 3) + '">' + ab + '</div>' +
        '<div class="sheet-ft"><button type="button" class="btn sm" data-act="close">' + TR('Annuler') + '</button></div></div>';
      var f0 = root.querySelector('.acc-btn:not(:disabled)'); if (f0) f0.focus();
      return;
    }
    if (!p) { root.innerHTML = ''; return; }
    var P = state.puz, T = P.T, s = p.s, t = p.t, cur = g(s, t);
    var prev = t > 0 ? g(s, t - 1) : -1, next = t < T - 1 ? g(s, t + 1) : -1;
    var trail = [];
    if (t > 0) trail.push(tl(t - 1) + ' ' + (prev >= 0 ? ROOMS[prev].name : '?'));
    trail.push('<b>' + tl(t) + ' ?</b>');
    if (t < T - 1) trail.push(tl(t + 1) + ' ' + (next >= 0 ? ROOMS[next].name : '?'));
    var btns = ROOMS.map(function (room, r) {
      var far = (prev >= 0 && !((STEP[prev] >> r) & 1)) || (next >= 0 && !((STEP[r] >> next) & 1));
      return '<button type="button" class="room-btn' + (r === cur ? ' cur' : '') + (far ? ' far' : '') + '" data-act="pick" data-r="' + r + '">' +
        room.name + (far ? '<small>' + TR('trop loin') + '</small>' : '') + '</button>';
    }).join('');
    root.innerHTML = '<div class="scrim" data-act="close"></div>' +
      '<div class="sheet s' + ci(s) + '" role="dialog" aria-modal="true" aria-label="' + (IT ? 'Scegli una ' : EN ? 'Choose a ' : 'Choisir une ') + E.SCENE.unit + '">' +
      '<div class="sheet-hd">' + mini(s) + '<b>' + SUSPECTS[s].name + '</b></div>' +
      '<p class="trail">' + trail.join(' → ') + '</p>' +
      '<div class="room-grid">' + btns + '</div>' +
      '<div class="sheet-ft"><button type="button" class="btn sm" data-act="clear">' + TR('Effacer la case') + '</button><button type="button" class="btn sm" data-act="close">' + TR('Fermer') + '</button></div></div>';
    var first = root.querySelector('.room-btn.cur') || root.querySelector('.room-btn');
    if (first) first.focus();
  }

  function renderAll() {
    renderScenes(); renderModes(); renderLevels(); renderRules(); renderCase(); renderSuspects(); renderMap(); renderBoard(); renderVerdict(); renderClues(); renderSheet();
  }

  /* ---------- Actions ---------- */
  function newCase(level, seed, mode, scene) {
    state.scene = scene || state.scene;
    state.level = level || state.level;
    state.mode = mode || state.mode;
    lsSet('kioukan.level', state.level);
    lsSet('kioukan.mode', state.mode);
    lsSet('kioukan.scene', state.scene);
    renderScenes(); renderModes(); renderLevels();
    $('board-panel').innerHTML = '<p class="loading">' + TR('Instruction du dossier…') + '</p>';
    $('case').innerHTML = ''; $('suspects').innerHTML = ''; $('map-panel').innerHTML = ''; $('clues-panel').innerHTML = ''; $('verdict').innerHTML = '';
    state.picker = null; renderSheet();
    setTimeout(function () {
      var sd = seed || (Math.floor(Math.random() * 9000) + 1000);
      bindScene();
      var P = E.generate(sd, state.level, state.mode);
      state.puz = P;
      state.grid = []; state.given = [];
      for (var i = 0; i < P.S * P.T; i++) { state.grid.push(-1); state.given.push(false); }
      P.clues.forEach(function (c) { if (c.type === 'at' && c.by === undefined) { state.grid[c.s * P.T + c.t] = c.r; state.given[c.s * P.T + c.t] = true; } });
      state.selT = 0; state.checked = false; state.hints = 0; state.solved = false; state.liarGuess = -1; state.accuse = false; state.accused = []; state.wrong = 0; state.early = 0;
      renderAll();
    }, 30);
  }

  function afterChange() {
    state.checked = false;
    var P = state.puz;
    if (!state.solved && gridCorrect() && (!isLiar(P) || state.liarGuess === P.liar)) {
      state.solved = true; if (window.KSFX) window.KSFX.play('win');
      state.selT = P.crime.t;
    }
    renderMap(); renderBoard(); renderVerdict(); renderClues();
  }

  function setCell(s, t, v) {
    var idx = s * state.puz.T + t;
    if (state.given[idx] || state.solved) return;
    var e0 = analyse().errors;
    state.grid[idx] = v;
    afterChange();
    if (window.KSFX && !state.solved && v >= 0) { if (state.far) state.far = false; else window.KSFX.play(state.live && analyse().errors > e0 ? 'malus' : 'pick'); }
  }

  function closeSheet() {
    var p = state.picker;
    state.picker = null; state.accuse = false; renderSheet();
    if (p) {
      var el = document.querySelector('.cell[data-s="' + p.s + '"][data-t="' + p.t + '"]');
      if (el && !el.disabled) el.focus();
    }
  }

  function hint() {
    var P = state.puz, wrong = [];
    state.grid.forEach(function (v, i) { if (v !== P.solution[i]) wrong.push(i); });
    if (!wrong.length) return;
    var i = wrong[Math.floor(Math.random() * wrong.length)];
    state.grid[i] = P.solution[i]; state.given[i] = true; state.hints++;
    state.selT = i % P.T;
    afterChange();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el || !state.puz && el.getAttribute('data-act') !== 'new' && el.getAttribute('data-act') !== 'level') return;
    var act = el.getAttribute('data-act');
    switch (act) {
      case 'new': newCase(state.level); break;
      case 'mode': if (el.getAttribute('data-mode') !== state.mode) newCase(state.level, null, el.getAttribute('data-mode')); break;
      case 'liar':
        var ls = +el.getAttribute('data-s');
        state.liarGuess = state.liarGuess === ls ? -1 : ls;
        afterChange();
        break;
      case 'scene': if (el.getAttribute('data-scene') !== state.scene) newCase(state.level, null, null, el.getAttribute('data-scene')); break;
      case 'level': newCase(el.getAttribute('data-level')); break;
      case 'time': state.selT = +el.getAttribute('data-t'); renderMap(); renderBoard(); break;
      case 'cell':
        if (el.disabled) break;
        state.picker = { s: +el.getAttribute('data-s'), t: +el.getAttribute('data-t') };
        state.selT = state.picker.t;
        renderMap(); renderBoard(); renderSheet();
        break;
      case 'pick':
        state.far = el.classList.contains('far'); if (state.far && window.KSFX) window.KSFX.play('forbid');
        if (state.picker) { var p = state.picker; setCell(p.s, p.t, +el.getAttribute('data-r')); closeSheet(); }
        break;
      case 'clear':
        if (state.picker) { var q = state.picker; setCell(q.s, q.t, -1); closeSheet(); }
        break;
      case 'close': closeSheet(); break;
      case 'check': state.checked = true; renderBoard(); renderClues(); break;
      case 'hint': hint(); break;
      case 'accuse': if (!state.solved) { state.accuse = true; renderSheet(); } break;
      case 'accpick':
        var as = +el.getAttribute('data-s'), P2 = state.puz;
        state.accuse = false;
        if (as === P2.culprit) {
          var emp = 0;
          state.grid.forEach(function (v, i) { if (v !== P2.solution[i]) emp++; });
          state.early = emp; state.grid = P2.solution.slice(); state.solved = true; if (window.KSFX) window.KSFX.play('win'); state.selT = P2.crime.t;
          if (isLiar(P2)) state.liarGuess = P2.culprit;
        } else { state.wrong++; state.accused.push(as); if (window.KSFX) window.KSFX.play('wrong'); }
        renderSheet(); renderMap(); renderBoard(); renderVerdict(); renderClues();
        break;
      case 'reset':
        state.grid = state.grid.map(function (v, i) { return state.given[i] ? v : -1; });
        state.liarGuess = -1;
        afterChange();
        break;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'live') { state.live = e.target.checked; state.checked = false; renderBoard(); renderClues(); }
    if (e.target.id === 'hideok') { state.hideOk = e.target.checked; renderClues(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (state.picker || state.accuse)) closeSheet();
  });

  /* ---------- Démarrage ---------- */
  var saved = lsGet('kioukan.level');
  if (saved && LEVELS[saved]) state.level = saved;
  var savedMode = lsGet('kioukan.mode');
  if (savedMode === 'liar' || savedMode === 'half' || savedMode === 'classic') state.mode = savedMode;
  var savedScene = lsGet('kioukan.scene');
  if (SCENE_UI[savedScene]) state.scene = savedScene;
  var rules = $('rules');
  if (!lsGet('kioukan.seen')) { rules.open = true; lsSet('kioukan.seen', '1'); }
  window.Kioukan = { state: state, newCase: newCase };
  newCase(state.level);
})();

