
(function () {
  'use strict';
  var E = window.KioukanEngine, LC = window.KioukanLC, ART = window.KioukanArt, WT = window.KioukanWT;
  var SPEC = window.KioukanSpec, PUZ = window.KioukanPuzzles, WORLD = window.KioukanWorld, FLAVOR = window.KioukanFlavor || {};
  var TUTO = !!window.KIOUKAN_TUTO, DEMO = TUTO ? 0 : (window.KIOUKAN_DEMO_CH || 0);
  var N = DEMO ? SPEC.levels.filter(function (l) { return l.ch <= DEMO; }).length : SPEC.levels.length, tl = E.timeLabel;
  var ROOMS, SUSPECTS, STEP, DOORS, PLACE, LV, CH;
  var EN = window.KIOUKAN_LANG === 'en', IT = window.KIOUKAN_LANG === 'it', TR = window.T;
  function pl(n, one, many) { return n > 1 ? many : one; }

  var ICON = {
    ok: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bad: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    pending: '',
    lock: '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3.4 5.4V4a2.6 2.6 0 0 1 5.2 0v1.4M2.4 5.4h7.2v5.2H2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
  };
  ICON['true'] = ICON.ok; ICON['false'] = ICON.bad;
  var MODE_LABEL = { classic: TR('Constats'), liar: TR('Un menteur'), half: TR('Demi-vérités') };

  var state = {
    ep: 1, puz: null, grid: [], given: [], selT: 0, live: true, checked: false, hideOk: false,
    picker: null, accuse: false, accused: [], wrong: 0, early: 0, hints: 0, solved: false, lastWrong: -1, liarGuess: -1, listOpen: false
  };

  /* ---------- Progression ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  var prog = TUTO ? { solved: {}, help: {} } : (function () { try { return JSON.parse(lsGet('kioukan.histoire') || '{}'); } catch (e) { return {}; } })();
  prog.solved = prog.solved || {}; prog.help = prog.help || {};
  if (!TUTO && lsGet('kioukan.histoire.n1') === 'ok') prog.solved[1] = 1;
  function save() { if (!TUTO) lsSet('kioukan.histoire', JSON.stringify(prog)); }
  function unlocked(n) { return n === 1 || !!prog.solved[n - 1] || !!prog.solved[n]; }
  function lastUnlocked() { for (var n = N; n >= 1; n--) if (unlocked(n)) return n; return 1; }

  /* ---------- Outils ---------- */
  function $(id) { return document.getElementById(id); }
  function g(s, t) { return state.grid[s * state.puz.T + t]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ ([!?:;»])/g, EN || IT ? ' $1' : '\u00a0$1').replace(/« /g, EN || IT ? '« ' : '«\u00a0'); }
  function isLiar(P) { return P.mode === 'liar' || P.mode === 'half'; }
  function inRoom(r) { if (IT) return ROOMS[r].inn || E.itIn(ROOMS[r].the, ROOMS[r].on); return (EN ? (ROOMS[r].on ? 'on ' : 'in ') : (ROOMS[r].on ? 'sur ' : 'dans ')) + ROOMS[r].the; }
  function culpritName() { return SUSPECTS[state.puz.culprit].name; }
  function fmt(s) {
    var P = state.puz;
    return s.replace(/\{h\}/g, tl(P.crime.t)).replace(/\{lieu\}/g, inRoom(P.crime.room)).replace(/\{coupable\}/g, culpritName());
  }
  function nameOf(n) { return n === '@culprit' ? culpritName() : window.tn(n); }
  function crimeText(c) { return E.clueText(state.puz, c).replace(EN ? 'the killer' : IT ? 'l’assassino' : 'le meurtrier', TR(LV.word)); }
  function idxOf(name) { name = window.tn(name); for (var i = 0; i < SUSPECTS.length; i++) if (SUSPECTS[i].name === name) return i; return -1; }

  /* ---------- Introduction en texte (remplace les cases BD) ---------- */
  function storyText(beats) {
    var h = '<div class="story-text">';
    (beats || []).forEach(function (b) {
      (b.say || []).forEach(function (q) {
        var n = nameOf(q.who);
        h += '<p class="sline"><span class="mini">' + WT.portrait(n, 'neutre') + '</span><span class="sq"><b>' + esc(n) + '</b>' + esc(fmt(TR(q.text))) + '</span></p>';
      });
      (b.caps || []).forEach(function (c) { if (DEMO && state.ep >= N && /^Fin du chapitre/.test(c.text)) return; h += '<p class="snar">' + esc(fmt(TR(c.text))) + '</p>'; });
    });
    return h + '</div>';
  }

  /* ---------- Cases façon webtoon (plus utilisées) ---------- */
  function beat(b) {
    var h = '<div class="beat">';
    if (b.say) h += '<div class="says">' + b.say.map(function (q) {
      return '<p class="wbubble ' + (q.side === 'r' ? 'r' : 'l') + '"><span class="sr">' + esc(nameOf(q.who)) + ' : </span>' + esc(fmt(q.text)) + '</p>';
    }).join('') + '</div>';
    h += '<figure class="wpanel" style="aspect-ratio:1 / ' + b.h + '"><div class="wbg">' + WT.background(b.bg) + '</div>';
    (b.chars || []).forEach(function (c) {
      h += '<div class="wchar" style="left:' + c.x + '%;width:' + c.w + '%">' + WT.portrait(nameOf(c.name), c.expr, 'wport') + '</div>';
    });
    if (b.sfx) h += '<span class="sfx' + (b.sfx.center ? ' center' : '') + '" style="left:' + b.sfx.x + '%;top:' + b.sfx.y + '%;--r:' + (b.sfx.rot || 0) + 'deg" aria-hidden="true">' + esc(b.sfx.text) + '</span>';
    (b.caps || []).forEach(function (c) { h += '<p class="wcap ' + c.pos + '">' + esc(fmt(c.text)) + '</p>'; });
    return h + '</figure></div>';
  }

  /* ---------- Liste des épisodes ---------- */
  function renderList() {
    if (TUTO) { $('episodes').innerHTML = ''; return; }
    var h = '<button type="button" class="ep-toggle" data-act="list" aria-expanded="' + state.listOpen + '">' +
      '<span>' + TR('Épisode') + ' ' + state.ep + ' / ' + N + '</span><b>' + esc(TR(LV.title)) + '</b><i aria-hidden="true">' + (state.listOpen ? '▴' : '▾') + '</i></button>';
    if (state.listOpen) {
      h += '<div class="ep-list">' + SPEC.chapters.filter(function (c) { return !DEMO || c.n <= DEMO; }).map(function (c) {
        var eps = SPEC.levels.map(function (l, i) { return { l: l, n: i + 1 }; }).filter(function (x) { return x.l.ch === c.n; });
        var nDone = eps.filter(function (x) { return prog.solved[x.n]; }).length;
        return '<section class="ep-ch"><h3><span>' + TR('Chapitre') + ' ' + c.n + '</span>' + esc(TR(c.title)) + '<small>' + nDone + '/' + eps.length + '</small></h3><div class="ep-grid">' +
          eps.map(function (x) {
            var u = unlocked(x.n), done = prog.solved[x.n];
            return '<button type="button" class="ep-btn' + (x.n === state.ep ? ' cur' : '') + (done ? ' done' : '') + '" data-act="ep" data-n="' + x.n + '"' + (u ? '' : ' disabled') + '>' +
              '<b>' + x.n + '</b><span>' + (u ? esc(TR(x.l.title)) : TR('Verrouillé')) + '</span><small>' + (done ? (prog.help[x.n] ? TR('résolu avec aide') : TR('résolu ✓')) : MODE_LABEL[x.l.mode]) + '</small></button>';
          }).join('') + '</div></section>';
      }).join('') + (DEMO ? '<section class="ep-ch demo-soon"><h3><span>' + TR('Bientôt') + '</span>' + TR('Chapitres 2 à {n}', { n: SPEC.chapters.length }) + '</h3><p>' + TR('Le reste de l’enquête est encore en développement.') + '</p></section>' : '') + '</div>';
    }
    $('episodes').innerHTML = h;
  }

  function renderIntro() {
    var first = SPEC.levels.findIndex(function (l) { return l.ch === LV.ch; }) + 1 === state.ep;
    var imgs = window.KIOUKAN_IMAGES || {}, bk = (LV.intro || []).map(function (b) { return b.bg; }).filter(function (k) { return imgs['bg:' + k]; }).sort(function (x, y) { return (x === 'night') - (y === 'night'); })[0] || (imgs['bg:night'] ? 'night' : ''), bsrc = bk ? imgs['bg:' + bk] : '';
    $('intro').innerHTML =
      '<div class="cover' + (bsrc ? ' ep-banner' : '') + '"' + (bsrc ? ' style="background-image:url(' + bsrc + ')"' : '') + '><p class="kicker">' + (TUTO ? '' : TR('Chapitre') + ' ' + CH.n + ' · ') + esc(TR(CH.title)) + '</p>' +
      (first ? '<p class="blurb">' + esc(TR(CH.blurb)) + '</p>' : '') +
      '<h2 class="lvl-title"><span>' + (TUTO ? TR('Tutoriel') : TR('Épisode') + ' ' + state.ep + ' · ' + MODE_LABEL[LV.mode]) + '</span>' + esc(TR(LV.title)) + '</h2></div>' +
      storyText(LV.intro) +
      '<p class="go"><a class="btn primary" href="#case">' + TR('Ouvrir l’enquête') + '</a></p>' +
      (state.ep === 1 && !TUTO ? '<p class="howto">' + TR('Première enquête ?') + ' <a href="#rules" onclick="var r=document.getElementById(\'rules\');r.open=true;r.scrollIntoView({behavior:\'smooth\',block:\'start\'});return false">' + TR('Lis d’abord « Comment jouer »') + '</a>.</p>' : '');
  }

  /* ---------- Analyse ---------- */
  function showMarks() { return state.live || state.checked; }
  function analyse() {
    var P = state.puz, T = P.T, bad = {}, errors = 0, s, t, a, b, liarMode = isLiar(P), half = P.mode === 'half', L = state.liarGuess;
    for (s = 0; s < P.S; s++) for (t = 1; t < T; t++) {
      a = g(s, t - 1); b = g(s, t);
      if (a >= 0 && b >= 0 && !((STEP[a] >> b) & 1)) { bad[s * T + t - 1] = 1; bad[s * T + t] = 1; errors++; }
    }
    var items = [];
    if (!liarMode) {
      items = [{ type: 'crime' }].concat(P.clues.filter(function (c) { return c.type !== 'at'; })).map(function (c) {
        var st = E.evalClue(P, c, g);
        if (st === 'bad') { errors++; E.badCells(P, c, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; }); }
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
        if (st === 'bad') { errors++; E.badCells(P, c, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; }); }
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
  function gridCorrect() { var sol = state.puz.solution; return state.grid.every(function (v, i) { return v === sol[i]; }); }

  /* ---------- Rendu du jeu ---------- */
  function fiche(s, extra) {
    return '<figure class="fiche s' + ci(s) + '"><div class="fiche-img">' + WT.portrait(SUSPECTS[s].name, 'neutre') + (hasIc(s) ? '<span class="fiche-ic">' + IC.svg(SUSPECTS[s].name, { bg: 'var(--c)', fg: '#fff' }) + '</span>' : '') + '</div>' +
      '<figcaption><span class="fn">' + SUSPECTS[s].short + '</span><small>' + (extra || SUSPECTS[s].role) + '</small></figcaption></figure>';
  }
  function ci(s) { return window.kioukanCI(SUSPECTS.map(function (x) { return x.name; }), s); }
  var IC = window.KioukanIcons;
  function hasIc(s) { return !!(IC && IC.has(SUSPECTS[s].name)); }
  // icône du personnage (grille, boutons, fiche de saisie) ; portrait si pas encore d'icône
  function miniIc(s) { return hasIc(s) ? '<span class="mini ic s' + ci(s) + '">' + IC.svg(SUSPECTS[s].name, { bg: 'var(--c)', fg: '#fff', ring: false, scale: 0.78 }) + '</span>' : mini(s); }
  (function () { if (document.getElementById('ic-css')) return; var st = document.createElement('style'); st.id = 'ic-css';
    st.textContent = '.mini.ic{background:var(--c)!important}.mini.ic svg{transform:none!important;width:100%;height:100%;display:block}' +
      '.fiche-img{position:relative}.fiche-ic{position:absolute;top:6px;right:6px;width:38px;height:38px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));z-index:1}.fiche-ic svg{display:block;width:100%;height:100%}';
    document.head.appendChild(st); })();
  function mini(s, ex) { return '<span class="mini s' + ci(s) + '">' + WT.portrait(SUSPECTS[s].name, ex || 'neutre') + '</span>'; }

  function renderCase() {
    var P = state.puz;
    $('case').innerHTML = '<p class="eyebrow">' + (TUTO ? TR('Tutoriel') : TR('Épisode') + ' ' + state.ep + ' · ' + MODE_LABEL[LV.mode]) + '</p><h2>' + esc(TR(LV.caseTitle)) + '</h2><p>' + esc(fmt(TR(LV.caseBody))) + '</p>';
    var h = '<div class="panel-hd"><h2 class="label">' + TR('Les suspects') + '</h2><span class="sub">' + P.S + ' ' + TR('personnes') + '</span></div><div class="fiches" style="--n:' + Math.min(P.S, 3) + ';--N:' + P.S + '">';
    for (var s = 0; s < P.S; s++) h += fiche(s);
    $('suspects').innerHTML = h + '</div>';
  }

var ROOM_TINT = ['#3f8fd0', '#e0a21f', '#8a63c9', '#1f9d96', '#a8743f', '#8a9a22', '#5b6fa8', '#d07a2f'], OUT_TINT = '#4ea35a';
  function roomTint(G, r, k) { return G.out ? OUT_TINT : ROOM_TINT[(r - (k || 0)) % ROOM_TINT.length]; }
  function doorRect(G, a, b) {
    var A = G[a], B = G[b];
    var x1 = Math.max(A.x, B.x), x2 = Math.min(A.x + A.w, B.x + B.w), y1 = Math.max(A.y, B.y), y2 = Math.min(A.y + A.h, B.y + B.h);
    if (x2 > x1) { var wy = (A.y + A.h === B.y) ? B.y : A.y; return { x: (x1 + x2) / 2 - 11, y: wy - 3, w: 22, h: 6 }; }
    var wx = (A.x + A.w === B.x) ? B.x : A.x; return { x: wx - 3, y: (y1 + y2) / 2 - 11, w: 6, h: 22 };
  }
  function tok(name, cx, floor, sz) {
    sz = sz || 34;
    if (IC && IC.has(name)) return '<svg x="' + (cx - sz / 2) + '" y="' + (floor - sz) + '" width="' + sz + '" height="' + sz + '" viewBox="0 0 48 48" overflow="visible" style="color:#fff">' + IC.svg(name, { bg: 'var(--c,#171d2e)', fg: '#fff' }).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</svg>';
    var fb = WT.faceBadge(name, 28);
    if (fb) return '<g transform="translate(' + cx + ',' + (floor - 17) + ')"><circle r="16.5" style="fill:var(--c,#171d2e);stroke:#171d2e;stroke-width:1"/><circle r="14.2" fill="#fffaf0"/>' + fb + '</g>';
    return '<svg x="' + (cx - 16) + '" y="' + (floor - 38) + '" width="32" height="38.4" viewBox="0 0 100 120">' + WT.bust(name, 'neutre') + '</svg>';
  }

  function planSVG(occ, t) {
    var P = state.puz, G = PLACE.geo, h = '<svg class="plan" viewBox="0 0 350 210" role="img" aria-label="' + TR('Plan à') + ' ' + tl(t) + '">' + ART.defs(), r;
    var IMG = (window.KIOUKAN_IMAGES || {})['plan:' + CH.place];
    // plan dessiné à la main : l'image remplace sols, meubles, murs et portes ; le jeu garde étiquettes, lieu des faits et personnages
    if (IMG) h += '<image href="' + IMG + '" x="0" y="0" width="350" height="210" preserveAspectRatio="xMidYMid slice"/>';
    if (!IMG) (PLACE.empty || []).forEach(function (e) {
      var fill = e.kind === 'sea' ? '#5b7fb8' : e.kind === 'curtain' ? '#9c2a36' : '#ddd';
      h += '<rect x="' + e.x + '" y="' + e.y + '" width="' + e.w + '" height="' + e.h + '" fill="' + fill + '" opacity="0.55" rx="4"/>';
      if (e.kind === 'sea') for (var k = 0; k < 4; k++) h += '<path d="M' + (e.x + 8) + ' ' + (e.y + 18 + k * 18) + 'q8 -4 16 0t16 0t16 0" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/>';
    });
    if (!IMG) for (r = 0; r < ROOMS.length; r++) h += '<rect x="' + G[r].x + '" y="' + G[r].y + '" width="' + G[r].w + '" height="' + G[r].h + '" fill="url(#pf-' + G[r].f + ')"/>';
    if (!IMG) for (r = 0; r < ROOMS.length; r++) {
      var G1 = G[r];
      h += '<g class="furn">' + (G1.fu || []).map(function (f) { return ART.furn(f[0], G1.x + f[1], G1.y + f[2], f[3], f[4]); }).join('') + '</g>';
    }
    for (r = 0; r < ROOMS.length; r++) h += '<rect class="rtint" x="' + G[r].x + '" y="' + G[r].y + '" width="' + G[r].w + '" height="' + G[r].h + '" fill="' + roomTint(G[r], r) + '"/>';
    if (!IMG) for (r = 0; r < ROOMS.length; r++) h += '<rect class="wall" x="' + G[r].x + '" y="' + G[r].y + '" width="' + G[r].w + '" height="' + G[r].h + '"/>';
    var cr = G[P.crime.room];
    h += '<rect class="crimeroom" x="' + (cr.x + 3) + '" y="' + (cr.y + 3) + '" width="' + (cr.w - 6) + '" height="' + (cr.h - 6) + '" rx="3"/>';
    if (!IMG) DOORS.forEach(function (d) { var R = doorRect(G, d[0], d[1]); h += '<rect class="door" x="' + R.x + '" y="' + R.y + '" width="' + R.w + '" height="' + R.h + '" rx="2"/>'; });
    for (r = 0; r < ROOMS.length; r++) {
      var XL = WORLD.LOC_PLACES && WORLD.LOC_PLACES[CH.place] && WORLD.LOC_PLACES[CH.place].labels, lab = (XL ? XL[r] : WORLD.LOC_PLACES ? '' : G[r].l) || ROOMS[r].name.toUpperCase(), w = Math.round(lab.length * 5.6 + 12), cx = G[r].x + G[r].w / 2, cy = G[r].y + 10;
      h += '<g class="pill"><rect x="' + (cx - w / 2) + '" y="' + (cy - 6) + '" width="' + w + '" height="12" rx="6"/><text x="' + cx + '" y="' + (cy + 0.4) + '">' + lab + '</text></g>';
    }
    occ.forEach(function (list, room) {
      var B = G[room], n = list.length;
      // à 3 personnes ou plus, les icônes rapetissent et passent sur deux rangées pour rester lisibles
      var icons = list.every(function (sid) { return IC && IC.has(SUSPECTS[sid].name); }), two = icons && n >= 3;
      var sz = two ? Math.min(26, (B.w - 4) / 2) : 34, per = two ? Math.ceil(n / 2) : n;
      list.forEach(function (sid, k) {
        var row = two ? Math.floor(k / per) : 0, col = two ? k % per : k, m = two ? (row ? n - per : per) : n;
        var span = two ? sz + 1 : Math.min(30, (B.w - 30) / Math.max(1, n - 1)), cx = B.x + B.w / 2 + (col - (m - 1) / 2) * span;
        var floor = B.y + B.h - 2 - (two ? (1 - row) * (sz + 1) : 0);
        h += '<g class="lc-tok s' + ci(sid) + (state.solved && t === P.crime.t && sid === P.culprit ? ' culprit' : '') + '">' + tok(SUSPECTS[sid].name, cx, floor, icons ? sz : 0) + '</g>';
      });
    });
    return h + '</svg>';
  }

  function renderMap() {
    var P = state.puz, T = P.T, t = state.selT, s, i, chips = '';
    for (i = 0; i < T; i++) chips += '<button type="button" class="chip' + (i === P.crime.t ? ' crime' : '') + '" data-act="time" data-t="' + i + '" aria-pressed="' + (i === t) + '">' + tl(i) + '</button>';
    var occ = ROOMS.map(function () { return []; });
    for (s = 0; s < P.S; s++) { var v = g(s, t); if (v >= 0) occ[v].push(s); }
    var svg = PLACE.view === 'train'
      ? LC.train({ img: (window.KIOUKAN_IMAGES || {})['plan:' + CH.place], tok: tok, small: function (nm) { return !!(IC && IC.has(nm)); }, occ: occ, crime: P.crime.room, labels: (WORLD.LOC_PLACES && WORLD.LOC_PLACES[CH.place]) ? WORLD.LOC_PLACES[CH.place].labels : PLACE.labels, names: SUSPECTS.map(function (x) { return x.name; }), culprit: state.solved && t === P.crime.t ? P.culprit : -1, label: E.SCENE.label + ' ' + TR('à') + ' ' + tl(t) })
      : planSVG(occ, t);
    $('map-panel').innerHTML = '<div class="panel-hd"><h2 class="label">' + esc(E.SCENE.label) + '</h2><span class="sub">' + TR('à') + ' ' + tl(t) + '</span></div>' +
      '<div class="chips" style="--n:' + T + '">' + chips + '</div><div class="train-frame">' + svg + '</div>' +
      '<p class="legend"><span><i class="lg-door"></i>' + (PLACE.view === 'train' ? TR('passage entre voitures') : TR('porte')) + '</span>' + (PLACE.view === 'train' ? '<span><i class="lg-ladder"></i>' + TR('trappe vers le toit') + '</span>' : '') + '<span><i class="lg-crime"></i>' + TR('lieu des faits') + '</span></p>';
  }

  function renderBoard() {
    var P = state.puz, S = P.S, T = P.T, A = analyse(), show = showMarks(), s, t, h = '';
    h += '<div class="panel-hd"><h2 class="label">' + TR('Chronologie') + '</h2><span class="sub">' + TR('touche une case') + '</span></div>';
    h += '<div class="board' + (S >= 5 ? ' dense' : '') + '" style="--cols:' + S + '"><div></div>';
    for (s = 0; s < S; s++) h += '<div class="who s' + ci(s) + '">' + miniIc(s) + '<b>' + SUSPECTS[s].short + '</b>' +
      (isLiar(P) && state.liarGuess === s ? '<small class="liar-badge">' + TR('menteur ?') + '</small>' : '<small>' + SUSPECTS[s].role + '</small>') + '</div>';
    for (t = 0; t < T; t++) {
      h += '<button type="button" class="time' + (t === state.selT ? ' sel' : '') + '" data-act="time" data-t="' + t + '">' + tl(t) + (t === P.crime.t ? '<small>' + esc(TR(LV.noun)) + '</small>' : '') + '</button>';
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
      h += '<div class="liar"><span class="liar-q">' + TR('Qui ment ?') + '</span><div class="liar-btns">';
      for (s = 0; s < S; s++) h += '<button type="button" class="liar-btn s' + ci(s) + '" data-act="liar" data-s="' + s + '" aria-pressed="' + (state.liarGuess === s) + '">' + miniIc(s) + SUSPECTS[s].short + '</button>';
      h += '</div></div>';
    }
    h += '<div class="status"><span>' + A.filled + '/' + (S * T) + ' ' + TR('cases') + '</span>' +
      (show ? '<span class="' + (A.errors ? 'err' : '') + '">' + A.errors + ' ' + TR(pl(A.errors, 'contradiction', 'contradictions')) + '</span>' : '<span>' + TR('vérification en direct désactivée') + '</span>') +
      (isLiar(P) && !state.solved && state.liarGuess < 0 && gridCorrect() ? '<span class="err">' + TR('chronologie complète : désigne le menteur') + '</span>' : '') +
      (state.wrong && !state.solved ? '<span class="err">' + state.wrong + ' ' + TR(pl(state.wrong, 'fausse accusation', 'fausses accusations')) + '</span>' : '') + '</div>';
    if (state.lastWrong >= 0 && !state.solved) {
      var w = SUSPECTS[state.lastWrong];
      h += '<div class="reply"><span class="mini-wrap">' + mini(state.lastWrong, 'serieux') + '</span><p class="bubble small">' + esc(TR(((SPEC.wrongEp[state.ep] || {})[w.id || w.name]) || SPEC.wrong[w.id || w.name] || 'Vous faites erreur !')) + '</p></div>' +
        '<div class="reply r"><p class="bubble small">' + esc(TR(SPEC.detectiveWrong[(state.wrong - 1) % SPEC.detectiveWrong.length])) + '</p><span class="mini-wrap"><span class="mini">' + WT.portrait(SPEC.detective, 'serieux') + '</span></span></div>';
    }
    if (!state.solved) {
      var canSkip = state.wrong >= 2 || state.hints >= 3;
      h += '<div class="actions"><label class="switch"><input type="checkbox" id="live"' + (state.live ? ' checked' : '') + '><span>' + TR('Vérification en direct') + '</span></label>' +
        '<div class="btns">' + (state.live ? '' : '<button type="button" class="btn sm" data-act="check" title="' + TR('Contrôle toute la grille d’un coup') + '">' + TR('Vérifier') + '</button>') +
        '<button type="button" class="btn sm" data-act="hint">' + TR('Indice') + '</button><button type="button" class="btn sm" data-act="reset">' + TR('Effacer') + '</button>' +
        '<button type="button" class="btn sm accuse" data-act="accuse">' + TR('J’accuse !') + '</button></div></div>' +
        '<p class="hintline">' + (state.live ? TR('Vérification en direct : les erreurs s’affichent tout de suite en rouge.') : TR('Vérification manuelle : rien ne s’affiche tant que tu n’appuies pas sur « Vérifier ».')) + '</p>' +
        (canSkip && state.ep < N ? '<p class="skip"><button type="button" class="btn sm" data-act="skip">' + TR('Passer cet épisode') + '</button> <span>' + TR('Il sera marqué « résolu avec aide ».') + '</span></p>' : '');
    }
    $('board-panel').innerHTML = h;
  }

  function li(it, text, show) {
    var st = show ? it.st : 'pending';
    if (state.hideOk && st === 'ok') return '';
    var tag = (st === 'true' || st === 'false') ? ' <span class="tag">' + (st === 'true' ? TR('vrai') : TR('faux')) + '</span>' : '';
    return '<li class="clue ' + st + (it.rule ? ' rule' : '') + '"><span class="ico">' + ICON[st] + '</span><span class="txt">' + text + tag + '</span></li>';
  }
  // heures insécables : « 21 h 30 » ne doit pas se couper en fin de ligne
  function nbsp(s) { return s.replace(/(\d+) h( 30)?/g, function (m, a, b) { return a + '\u00a0h' + (b ? '\u00a030' : ''); }); }
  // déclaration rédigée (mode menteur) : une phrase par déclaration, déjà entre guillemets
  function flavoredStatement(P, c) {
    var FL = FLAVOR[state.ep], i = P.clues.indexOf(c);
    if (FL) for (var k = 0; k < FL.length; k++) if (FL[k].ids.length === 1 && FL[k].ids[0] === i) return nbsp(esc(TR(FL[k].text)));
    return EN ? '“' + E.statementText(P, c) + '”' : IT ? '«' + E.statementText(P, c) + '»' : '« ' + E.statementText(P, c) + ' »';
  }
  function renderClues() {
    var P = state.puz, A = analyse(), show = showMarks(), h = '';
    if (!isLiar(P)) {
      h = '<div class="panel-hd"><h2 class="label">' + TR('Carnet d’Hortense') + '</h2><span class="sub">' + (show ? A.okCount + '/' + A.items.length + ' ' + TR('confirmés') : A.items.length + ' ' + TR('constats')) + '</span></div>';
      h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les indices confirmés') + '</span></label>';
      var FL = FLAVOR[state.ep], rows;
      if (FL) {
        // indices rédigés : une phrase peut couvrir plusieurs constats ; elle est fausse dès que l'un l'est
        var stOf = function (c) { for (var k = 0; k < A.items.length; k++) if (A.items[k].c === c) return A.items[k].st; return 'pending'; };
        var groups = FL.map(function (gr) {
          var sts = gr.ids.map(function (i) { return stOf(P.clues[i]); });
          return { st: sts.indexOf('bad') >= 0 ? 'bad' : sts.every(function (x) { return x === 'ok'; }) ? 'ok' : 'pending', text: nbsp(esc(TR(gr.text))) };
        });
        var crime = A.items[0];
        var nOk = groups.filter(function (x) { return x.st === 'ok'; }).length + (crime.st === 'ok' ? 1 : 0);
        h = h.replace(/<span class="sub">[^<]*<\/span>/, '<span class="sub">' + (show ? nOk + '/' + (groups.length + 1) + ' ' + TR('confirmés') : (groups.length + 1) + ' ' + TR('indices')) + '</span>');
        rows = li({ st: crime.st, rule: true }, crimeText(crime.c), show) + groups.map(function (x) { return li({ st: x.st }, x.text, show); }).join('');
      } else rows = A.items.map(function (it) { return li({ st: it.st, rule: it.c.type === 'crime' }, it.c.type === 'crime' ? crimeText(it.c) : E.clueText(P, it.c), show); }).join('');
      h += rows ? '<ul class="clues">' + rows + '</ul>' : '<p class="empty-note">' + TR('Tous les constats sont confirmés.') + '</p>';
      $('clues-panel').innerHTML = h; return;
    }
    var L = state.liarGuess, S = P.S, s;
    h += '<div class="panel-hd"><h2 class="label">' + TR('Témoignages') + '</h2><span class="sub">' + (show ? (L < 0 ? TR('désigne un menteur') : A.okCount + '/' + A.items.length + ' ' + TR('confirmés')) : A.items.length + ' ' + TR('constats')) + '</span></div>';
    h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les déclarations confirmées') + '</span></label>';
    var rule = A.items.filter(function (it) { return it.rule; })[0];
    h += '<ul class="clues">' + li(rule, IT ? ((P.mode === 'half' ? 'Il colpevole mescola vero e falso, e solo lui' : 'Il bugiardo è il colpevole: solo lui') + ' si trovava ' + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + '.') : EN ? ((P.mode === 'half' ? 'The culprit mixes truth and lies, and only they' : 'The liar is the culprit: only they') + ' were ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + '.') : ((P.mode === 'half' ? 'Le coupable mêle le vrai et le faux, et lui seul' : 'Le menteur est le coupable : lui seul') + ' se trouvait ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) + '.'), show) + '</ul>';
    var facts = P.clues.filter(function (c) { return c.by === undefined; });
    if (facts.length) h += '<div class="speaker"><b>' + TR('Preuves') + '</b><span class="tag">' + TR('certaines') + '</span></div><ul class="clues">' +
      facts.map(function (c) { return '<li class="clue ok proof"><span class="ico">' + ICON.lock + '</span><span class="txt">' + E.clueText(P, c) + '</span></li>'; }).join('') + '</ul>';
    for (s = 0; s < S; s++) {
      var mix = (P.mode === 'half' && L === s) ? A.items.filter(function (it) { return it.mix; })[0] : null;
      var rws = (mix ? li(mix, TR('Au moins une de ses déclarations est vraie et au moins une est fausse.'), show) : '') +
        A.items.filter(function (it) { return !it.rule && !it.mix && it.c.by === s; }).map(function (it) { return li(it, flavoredStatement(P, it.c), show); }).join('');
      var who = L < 0 ? '' : (L === s ? '<span class="tag liar-tag">' + TR(P.mode === 'half' ? 'ment en partie' : 'ment sur tout') + '</span>' : '<span class="tag">' + TR('dit vrai') + '</span>');
      h += '<div class="sp s' + ci(s) + '">' + mini(s) + '<div class="sp-body"><p class="sp-name"><b>' + SUSPECTS[s].name + '</b> ' + who + '</p>' +
        (rws ? '<ul class="clues bubbles">' + rws + '</ul>' : '<p class="empty-note">' + TR('Toutes ses déclarations sont confirmées.') + '</p>') + '</div></div>';
    }
    $('clues-panel').innerHTML = h;
  }

  function verdictText() {
    var P = state.puz, c = SUSPECTS[P.culprit], seul = (c.f ? 'seule' : 'seul'), il = (c.f ? 'Elle' : 'Il');
    if (IT) {
      var dove = ' era ' + (c.f ? 'sola ' : 'solo ') + inRoom(P.crime.room) + ' ' + E.alle(P.crime.t) + '.', lei = c.f ? 'Lei' : 'Lui';
      if (P.mode === 'half') {
        var gs1 = function (s, t) { return P.solution[s * P.T + t]; };
        var mine1 = P.clues.filter(function (x) { return x.by === P.culprit; }), fa1 = mine1.filter(function (x) { return E.evalClue(P, x, gs1) !== 'ok'; }).length;
        return '<b>' + c.name + '</b> mescolava vero e falso: ' + fa1 + ' delle sue ' + mine1.length + ' dichiarazioni ' + (fa1 > 1 ? 'erano false' : 'era falsa') + '. ' + lei + dove;
      }
      if (P.mode === 'liar') return '<b>' + c.name + '</b> ha mentito su tutto. ' + lei + dove;
      return '<b>' + c.name + '</b>' + dove + ' Tutti gli altri alibi reggono.';
    }
    if (EN) {
      var where = ' was alone ' + inRoom(P.crime.room) + ' at ' + tl(P.crime.t) + '.', sh = c.f ? 'She' : 'He';
      if (P.mode === 'half') {
        var gs0 = function (s, t) { return P.solution[s * P.T + t]; };
        var mine0 = P.clues.filter(function (x) { return x.by === P.culprit; }), fa0 = mine0.filter(function (x) { return E.evalClue(P, x, gs0) !== 'ok'; }).length;
        return '<b>' + c.name + '</b> mixed truth and lies: ' + fa0 + ' of ' + (c.f ? 'her' : 'his') + ' ' + mine0.length + ' statements ' + (fa0 > 1 ? 'were false' : 'was false') + '. ' + sh + where;
      }
      if (P.mode === 'liar') return '<b>' + c.name + '</b> lied about everything. ' + sh + where;
      return '<b>' + c.name + '</b>' + where + ' Every other alibi holds.';
    }
    if (P.mode === 'half') {
      var gs = function (s, t) { return P.solution[s * P.T + t]; };
      var mine = P.clues.filter(function (x) { return x.by === P.culprit; }), fa = mine.filter(function (x) { return E.evalClue(P, x, gs) !== 'ok'; }).length;
      return '<b>' + c.name + '</b> mêlait le vrai et le faux : ' + fa + ' de ses ' + mine.length + ' déclarations ' + (fa > 1 ? 'étaient fausses' : 'était fausse') + '. ' + il + ' était ' + seul + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) + '.';
    }
    if (P.mode === 'liar') return '<b>' + c.name + '</b> mentait sur toute la ligne. ' + il + ' était ' + seul + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) + '.';
    return '<b>' + c.name + '</b> était ' + seul + ' ' + inRoom(P.crime.room) + ' à ' + tl(P.crime.t) + '. Tous les autres alibis tiennent.';
  }
  function renderVerdict() {
    var el = $('verdict');
    if (!state.solved) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="panel verdict"><div class="v-top">' + fiche(state.puz.culprit, '<b class="guilty">' + TR('coupable') + '</b>') + '<div class="stamp">' + TR('Affaire classée') + '</div></div>' +
      '<p>' + verdictText() + '</p>' +
      '<p class="sub">' + (IT
        ? ((state.early ? 'Accusa esatta con ancora ' + state.early + ' casell' + (state.early > 1 ? 'e' : 'a') + ' da riempire. ' : '') +
           (state.hints ? state.hints + ' indizi' + (state.hints > 1 ? '' : 'o') + ' usat' + (state.hints > 1 ? 'i' : 'o') + '. ' : 'Nessun indizio usato. ') +
           (state.wrong ? state.wrong + ' accus' + (state.wrong > 1 ? 'e' : 'a') + ' sbagliat' + (state.wrong > 1 ? 'e' : 'a') + '.' : 'Nessuna accusa sbagliata.'))
        : EN
        ? ((state.early ? 'Correct accusation with ' + state.early + ' cell' + (state.early > 1 ? 's' : '') + ' still empty. ' : '') +
           (state.hints ? state.hints + ' hint' + (state.hints > 1 ? 's' : '') + ' used. ' : 'No hints used. ') +
           (state.wrong ? state.wrong + ' wrong accusation' + (state.wrong > 1 ? 's' : '') + '.' : 'No wrong accusations.'))
        : ((state.early ? 'Accusation exacte alors que ' + state.early + ' case' + (state.early > 1 ? 's' : '') + ' restaient à remplir. ' : '') +
           (state.hints ? state.hints + ' indice' + (state.hints > 1 ? 's' : '') + ' utilisé' + (state.hints > 1 ? 's' : '') + '. ' : 'Aucun indice utilisé. ') +
           (state.wrong ? state.wrong + ' fausse' + (state.wrong > 1 ? 's' : '') + ' accusation' + (state.wrong > 1 ? 's' : '') + '.' : 'Aucune fausse accusation.'))) + '</p>' +
      storyText(LV.outro) +
      (DEMO && state.ep >= N ? '<div class="demo-end"><h3>' + TR('Merci d’avoir joué !') + '</h3><p>' + TR('Le chapitre 1 s’achève ici : le Hibou court toujours, et le reste du jeu (hôtel, manoir, paquebot, opéra et casino) est encore en développement. Vous venez de tester la démo, et cela compte énormément pour nous.') + '</p>' +
        '<p>' + TR('Si le jeu vous a plu, faites-le découvrir à vos proches : chaque joueur de plus nous aide à continuer l’enquête.') + '</p>' +
        '<p>' + TR('Dites-nous ce que vous avez aimé, ce qui vous a bloqué, et ce que vous voudriez voir ensuite.') + '</p>' +
        '<div class="end-btns"><button type="button" class="btn primary" data-act="share">' + TR('Partager le jeu') + '</button>' +
        '<a class="btn" href="mailto:maisonparadoxe@gmail.com?subject=' + encodeURIComponent(TR('Kioukan - mes retours sur la démo')) + '&body=' + encodeURIComponent(TR('Ce que j’ai aimé :\n\nCe qui m’a bloqué :\n\nCe que j’aimerais voir ensuite :\n')) + '">' + TR('Nous écrire') + '</a>' +
        '<a class="btn" href="partie.html">' + TR('Essayer la partie rapide') + '</a></div><p class="share-msg" id="share-msg" role="status"></p></div>' : '') +
      '<p class="next">' + (TUTO ? '<a class="btn primary" href="histoire.html#e1">' + TR('Commencer la vraie enquête') + ' →</a> ' : state.ep < N ? '<button type="button" class="btn primary" data-act="next">' + TR('Épisode') + ' ' + (state.ep + 1) + ' →</button> ' : (DEMO ? '' : '<span class="soon">' + TR('Bravo, l’histoire est terminée !') + '</span> ')) +
      '<button type="button" class="btn" data-act="replay">' + TR('Rejouer') + '</button></p></div>';
  }

  function renderSheet() {
    var root = $('sheet-root'), p = state.picker, P = state.puz;
    if (state.accuse) {
      var ab = '';
      for (var q = 0; q < P.S; q++) {
        var out = state.accused.indexOf(q) >= 0;
        ab += '<button type="button" class="acc-btn' + (out ? ' out' : '') + '" data-act="accpick" data-s="' + q + '"' + (out ? ' disabled' : '') + '>' + fiche(q, out ? TR('innocent') : '') + '</button>';
      }
      root.innerHTML = '<div class="scrim" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="' + TR('Désigner le coupable') + '">' +
        '<div class="sheet-hd"><b class="acc-t">' + TR('J’accuse…') + '</b></div><p class="trail">' + (IT ? 'Chi è ' + esc(TR(LV.word)) + '? Una risposta sbagliata conta come errore.' : EN ? 'Who is ' + esc(TR(LV.word)) + '? A wrong answer counts as a mistake.' : 'Qui est ' + esc(LV.word) + ' ? Une mauvaise réponse est comptée comme une erreur.') + '</p>' +
        '<div class="acc-grid" style="--n:' + Math.min(P.S, 3) + '">' + ab + '</div><div class="sheet-ft"><button type="button" class="btn sm" data-act="close">' + TR('Annuler') + '</button></div></div>';
      var f0 = root.querySelector('.acc-btn:not(:disabled)'); if (f0) f0.focus();
      return;
    }
    if (!p) { root.innerHTML = ''; return; }
    var T = P.T, s = p.s, t = p.t, cur = g(s, t);
    var prev = t > 0 ? g(s, t - 1) : -1, next = t < T - 1 ? g(s, t + 1) : -1, trail = [];
    if (t > 0) trail.push(tl(t - 1) + ' ' + (prev >= 0 ? ROOMS[prev].name : '?'));
    trail.push('<b>' + tl(t) + ' ?</b>');
    if (t < T - 1) trail.push(tl(t + 1) + ' ' + (next >= 0 ? ROOMS[next].name : '?'));
    var btns = ROOMS.map(function (room, r) {
      var far = (prev >= 0 && !((STEP[prev] >> r) & 1)) || (next >= 0 && !((STEP[r] >> next) & 1));
      return '<button type="button" class="room-btn' + (r === cur ? ' cur' : '') + (far ? ' far' : '') + '" data-act="pick" data-r="' + r + '">' + room.name + (far ? '<small>' + TR('trop loin') + '</small>' : '') + '</button>';
    }).join('');
    root.innerHTML = '<div class="scrim" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="' + TR('Choisir un lieu') + '">' +
      '<div class="sheet-hd">' + miniIc(s) + '<b>' + SUSPECTS[s].name + '</b></div><p class="trail">' + trail.join(' → ') + '</p>' +
      '<div class="room-grid">' + btns + '</div><div class="sheet-ft"><button type="button" class="btn sm" data-act="clear">' + TR('Effacer la case') + '</button><button type="button" class="btn sm" data-act="close">' + TR('Fermer') + '</button></div></div>';
    var first = root.querySelector('.room-btn.cur') || root.querySelector('.room-btn');
    if (first) first.focus();
  }


  function modesHelp(cur) {
    var items = [['classic', TR('Classique'), TR('Tous les indices du carnet sont vrais : il suffit de reconstituer la seule chronologie qui les respecte tous.')],
      ['liar', TR('Un menteur'), TR('Les suspects font des déclarations. Un seul ment, et c’est le coupable : toutes ses déclarations sont fausses.')],
      ['half', TR('Demi-vérités'), TR('Le coupable mêle le vrai et le faux : au moins une de ses déclarations est vraie et au moins une est fausse. Les innocents disent toujours vrai.')]];
    return '<li class="modes-help"><b>' + TR('Les trois modes de jeu') + '</b><ul>' + items.map(function (m) {
      return '<li' + (m[0] === cur ? ' class="cur"' : '') + '><b>' + m[1] + '</b>' + (m[0] === cur ? ' <em>(' + TR('mode actuel') + ')</em>' : '') + ' : ' + m[2] + '</li>';
    }).join('') + '</ul></li>';
  }
  function renderRules() {
    var U = E.SCENE.unit, mode = state.puz.mode, r;
    if (IT) {
      var fem = /a$/.test(U), una = fem ? 'una' : 'un', la = fem ? 'la ' : (/^[aeiou]/.test(U) ? 'l’' : 'il ');
      r = [
        'Ogni casella della <b>cronologia</b> indica ' + la + U + ' in cui si trovava un sospettato a una data ora. Tocca una casella per sceglierla.',
        'Tra due orari si <b>resta sul posto</b> oppure si passa da una <b>porta</b> verso ' + una + ' ' + U + ' vicin' + (fem ? 'a' : 'o') + ' (vedi la pianta). I muri non si attraversano.'
      ];
      if (mode === 'classic') r.push('Tutti gli indizi del <b>taccuino</b> sono veri, e una sola cronologia li rispetta tutti. Una frase può contenere più informazioni: è confermata solo quando lo sono tutte.');
      if (FLAVOR[state.ep]) r.push('Pendole e campane battono le ore della sera: sette rintocchi sono le 19:00; otto, le 20:00; nove, le 21:00; dieci, le 22:00; undici, le 23:00. «Passare per» un luogo significa trovarcisi almeno a uno degli orari della tabella. Ogni colonna è un istante preciso, non una durata: «alle 21:00 come alle 21:30» riguarda quindi due colonne.');
      if (mode === 'liar') r.push('Ogni sospettato fa delle <b>dichiarazioni</b>. Gli innocenti dicono la verità. <b>Il colpevole mente ogni volta.</b> Le prove dorate sono certe.', 'Indica il tuo sospettato sotto <b>Chi mente?</b>: le sue dichiarazioni vengono allora verificate sulla tua griglia.');
      if (mode === 'half') r.push('Gli innocenti dicono la verità. <b>Il colpevole mescola vero e falso</b>: almeno una delle sue dichiarazioni è vera, almeno una è falsa.', 'Indica il tuo sospettato sotto <b>Chi mente?</b>: le sue dichiarazioni appaiono vere o false in base alla tua griglia.');
      r.push('All’ora del misfatto, il colpevole era <b>solo</b> sul luogo. Le caselle dorate sono fatti accertati.',
        'Non serve riempire tutto: appena sei sicuro, tocca <b>Io accuso!</b>. Un’accusa sbagliata conta come errore.',
        '<b>Verifica in diretta</b>: se attiva, gli errori appaiono subito in rosso. Se disattiva, il pulsante <b>Verifica</b> controlla la griglia su richiesta.');
    } else if (EN) {
      r = [
        'Each cell of the <b>timeline</b> shows which ' + U + ' a suspect was in at a given time. Tap a cell to choose.',
        'Between two times, a suspect either <b>stays put</b> or goes through a <b>door</b> to a neighbouring ' + U + ' (see the plan). Nobody walks through walls.'
      ];
      if (mode === 'classic') r.push('Every clue in the <b>notebook</b> is true, and only one timeline fits them all. One sentence can hold several facts: it is only confirmed once all of them are.');
      if (FLAVOR[state.ep]) r.push('Clocks and bells ring the hours of the evening: seven chimes is 7 pm, eight is 8 pm, nine is 9 pm, ten is 10 pm, eleven is 11 pm. “Passing through” a place means being there at least once on the timeline. Each column is a precise moment, not a stretch of time: “at 9 pm and at 9:30 pm” concerns two columns.');
      if (mode === 'liar') r.push('Each suspect makes <b>statements</b>. The innocent tell the truth. <b>The culprit lies every time.</b> Golden proofs are certain.', 'Pick your suspect under <b>Who is lying?</b>: their statements are then checked against your grid.');
      if (mode === 'half') r.push('The innocent tell the truth. <b>The culprit mixes truth and lies</b>: at least one of their statements is true and at least one is false.', 'Pick your suspect under <b>Who is lying?</b>: their statements show as true or false based on your grid.');
      r.push('At the time of the crime, the culprit was <b>alone</b> at the scene. Golden cells are established facts.',
        'No need to fill everything in: as soon as you are sure, tap <b>I accuse!</b>. A wrong accusation counts as a mistake.',
        '<b>Live checking</b>: when ticked, mistakes turn red straight away. When unticked, the <b>Check</b> button checks the grid on demand.');
    } else {
      r = [
      'Chaque case de la <b>chronologie</b> indique la ' + U + ' où se trouvait un suspect à une heure donnée. Touche une case pour la choisir.',
      'Entre deux heures, on <b>reste sur place</b> ou on passe une <b>porte</b> vers une ' + U + ' voisine (voir le plan). Un mur ne se traverse pas.'
    ];
    if (mode === 'classic') r.push('Tous les indices du <b>carnet</b> sont vrais, et une seule chronologie les respecte tous. Une phrase peut contenir plusieurs informations : elle n’est confirmée que lorsqu’elles le sont toutes.');
    if (FLAVOR[state.ep]) r.push('Pendules et cloches sonnent les heures du soir : sept coups, c’est 19 h ; huit coups, 20 h ; neuf coups, 21 h ; dix coups, 22 h ; onze coups, 23 h. « Passer par » un lieu, c’est s’y trouver au moins à l’une des heures du tableau. Chaque colonne est un instant précis, pas une durée : « à 21 h comme à 21 h 30 » concerne donc deux colonnes.');
    if (mode === 'liar') r.push('Chaque suspect fait des <b>déclarations</b>. Les innocents disent la vérité. <b>Le coupable ment à chaque fois.</b> Les preuves dorées sont certaines.', 'Désigne ton suspect sous <b>Qui ment ?</b> : ses déclarations se vérifient alors sur ta grille.');
    if (mode === 'half') r.push('Les innocents disent la vérité. <b>Le coupable mêle le vrai et le faux</b> : au moins une de ses déclarations est vraie, au moins une est fausse.', 'Désigne ton suspect sous <b>Qui ment ?</b> : ses déclarations s’affichent comme vraies ou fausses d’après ta grille.');
    r.push('À l’heure du méfait, le coupable était <b>seul</b> sur les lieux. Les cases dorées sont des faits établis.',
      'Pas besoin de tout remplir : dès que tu es sûr, touche <b>J’accuse !</b>. Une mauvaise accusation compte comme une erreur.',
      '<b>Vérification en direct</b> : cochée, les erreurs apparaissent aussitôt en rouge. Décochée, le bouton <b>Vérifier</b> contrôle la grille à la demande.');
    }
    $('rules-list').innerHTML = r.map(function (x) { return '<li>' + x + '</li>'; }).join('') + modesHelp(state.puz.mode);
  }

  function renderGame() { renderCase(); renderMap(); renderBoard(); renderVerdict(); renderClues(); renderSheet(); renderRules(); }

  /* ---------- Chargement d'un épisode ---------- */
  function load(n) {
    var wantRules = location.hash === '#rules';
    n = Math.max(1, Math.min(N, n | 0));
    if (!unlocked(n)) n = lastUnlocked();
    state.ep = n; LV = SPEC.levels[n - 1]; CH = SPEC.chapters[LV.ch - 1];
    var D = PUZ[n];
    WORLD.use('episode', CH.place, D.suspects);
    PLACE = WORLD.PLACES[CH.place];
    ROOMS = E.ROOMS; SUSPECTS = E.SUSPECTS; STEP = E.STEP; DOORS = E.DOORS;
    var P = JSON.parse(JSON.stringify(D.puz));
    state.puz = P; state.grid = []; state.given = [];
    for (var i = 0; i < P.S * P.T; i++) { state.grid.push(-1); state.given.push(false); }
    P.clues.forEach(function (c) { if (c.type === 'at' && c.by === undefined) { state.grid[c.s * P.T + c.t] = c.r; state.given[c.s * P.T + c.t] = true; } });
    state.selT = 0; state.checked = false; state.hints = 0; state.solved = false; state.accuse = false; state.accused = [];
    state.wrong = 0; state.early = 0; state.lastWrong = -1; state.picker = null; state.liarGuess = -1; state.listOpen = false;
    if (!TUTO) lsSet('kioukan.histoire.ep', String(n));
    if (!TUTO && location.hash !== '#e' + n) { try { history.replaceState(null, '', '#e' + n); } catch (e) { /* fichier local */ } }
    document.title = 'Kioukan · ' + TR(LV.title);
    renderList(); renderIntro(); renderGame(); if (wantRules) { var rr = $('rules'); if (rr) { rr.open = true; setTimeout(function () { rr.scrollIntoView({ block: 'start' }); }, 150); } }
  }

  function win(early) {
    if (window.KSFX) window.KSFX.play(state.ep >= N ? 'victory' : 'win');
    state.solved = true; state.early = early; state.selT = state.puz.crime.t; state.lastWrong = -1;
    if (isLiar(state.puz)) state.liarGuess = state.puz.culprit;
    if (TUTO) lsSet('kioukan.tuto', 'done');
    prog.solved[state.ep] = 1; if (state.hints >= 3 || state.wrong >= 2) prog.help[state.ep] = 1; save();
  }
  function afterChange() {
    state.checked = false;
    var P = state.puz;
    if (!state.solved && gridCorrect() && (!isLiar(P) || state.liarGuess === P.culprit)) win(0);
    renderMap(); renderBoard(); renderVerdict(); renderClues(); renderList();
  }
  function setCell(s, t, v) {
    var idx = s * state.puz.T + t; if (state.given[idx] || state.solved) return;
    var e0 = analyse().errors; state.grid[idx] = v; afterChange();
    if (window.KSFX && !state.solved && v >= 0) { if (state.far) state.far = false; else window.KSFX.play(state.live && analyse().errors > e0 ? 'malus' : 'pick'); }
  }
  function closeSheet() {
    var p = state.picker;
    state.picker = null; state.accuse = false; renderSheet();
    if (p) { var el = document.querySelector('.cell[data-s="' + p.s + '"][data-t="' + p.t + '"]'); if (el && !el.disabled) el.focus(); }
  }
  function hint() {
    var P = state.puz, wrong = [];
    state.grid.forEach(function (v, i) { if (v !== P.solution[i]) wrong.push(i); });
    if (!wrong.length) return;
    var i = wrong[Math.floor(Math.random() * wrong.length)];
    state.grid[i] = P.solution[i]; state.given[i] = true; state.hints++; state.selT = i % P.T;
    afterChange();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el || !state.puz) return;
    switch (el.getAttribute('data-act')) {
      case 'list': state.listOpen = !state.listOpen; renderList(); break;
      case 'ep': load(+el.getAttribute('data-n')); window.scrollTo(0, 0); break;
      case 'next': load(state.ep + 1); window.scrollTo(0, 0); break;
      case 'skip': prog.solved[state.ep] = 1; prog.help[state.ep] = 1; save(); load(state.ep + 1); window.scrollTo(0, 0); break;
      case 'share':
        var shareUrl = 'https://maisonparadoxe.github.io/kioukan/', shareText = TR('Je viens d’essayer Kioukan, un jeu d’enquête où l’on reconstitue les alibis des suspects. Essaie !'), msg = $('share-msg');
        if (navigator.share) { navigator.share({ title: 'Kioukan', text: shareText, url: shareUrl }).catch(function () { /* annulé */ }); }
        else if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(function () { if (msg) msg.textContent = TR('Lien copié, il ne reste qu’à le coller !'); }).catch(function () { if (msg) msg.textContent = shareUrl; }); }
        else if (msg) msg.textContent = shareUrl;
        break;
      case 'replay': load(state.ep); window.scrollTo(0, 0); break;
      case 'time': state.selT = +el.getAttribute('data-t'); renderMap(); renderBoard(); break;
      case 'cell':
        if (el.disabled) break;
        state.picker = { s: +el.getAttribute('data-s'), t: +el.getAttribute('data-t') };
        state.selT = state.picker.t; renderMap(); renderBoard(); renderSheet(); break;
      case 'pick': state.far = el.classList.contains('far'); if (state.far && window.KSFX) window.KSFX.play('forbid'); if (state.picker) { var p = state.picker; setCell(p.s, p.t, +el.getAttribute('data-r')); closeSheet(); } break;
      case 'clear': if (state.picker) { var q = state.picker; setCell(q.s, q.t, -1); closeSheet(); } break;
      case 'close': closeSheet(); break;
      case 'check': state.checked = true; renderBoard(); renderClues(); break;
      case 'hint': hint(); break;
      case 'liar': var ls = +el.getAttribute('data-s'); state.liarGuess = state.liarGuess === ls ? -1 : ls; afterChange(); break;
      case 'reset': state.grid = state.grid.map(function (v, i) { return state.given[i] ? v : -1; }); state.lastWrong = -1; state.liarGuess = -1; afterChange(); break;
      case 'accuse': if (!state.solved) { state.accuse = true; renderSheet(); } break;
      case 'accpick':
        var as = +el.getAttribute('data-s'), P2 = state.puz;
        state.accuse = false;
        if (as === P2.culprit) {
          var emp = 0;
          state.grid.forEach(function (v, i) { if (v !== P2.solution[i]) emp++; });
          state.grid = P2.solution.slice(); win(emp);
        } else { state.wrong++; state.accused.push(as); state.lastWrong = as; if (window.KSFX) window.KSFX.play('wrong'); }
        renderSheet(); renderMap(); renderBoard(); renderVerdict(); renderClues(); renderList();
        if (state.solved) { var vd = $('verdict'); if (vd && vd.scrollIntoView) vd.scrollIntoView({ block: 'start' }); }
        break;
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'live') { state.live = e.target.checked; state.checked = false; renderBoard(); renderClues(); }
    if (e.target.id === 'hideok') { state.hideOk = e.target.checked; renderClues(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (state.picker || state.accuse)) closeSheet(); });

  var m = /^#e(\d+)$/.exec(location.hash || ''), start = TUTO ? 1 : m ? +m[1] : +(lsGet('kioukan.histoire.ep') || 0) || lastUnlocked();
  load(start);
  window.KioukanHistoire = { state: state, load: load, prog: prog, setCell: setCell, renderAll: renderGame, closeSheet: closeSheet, unlockAll: function () { for (var i = 1; i <= N; i++) prog.solved[i] = prog.solved[i] || 0; for (var j = 1; j < N; j++) prog.solved[j] = 1; } };
})();

