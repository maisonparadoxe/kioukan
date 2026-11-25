
(function () {
  'use strict';
  /* Campagne 2 « La Dernière Vente » : même application que la campagne 1, adaptée aux nouvelles mécaniques
     (victime, passages secrets, arme, panne, clés, bon moment, jumelles, deux menteurs). Épisodes 43 à 100. */
  var E = window.KioukanEngine, E2 = window.KioukanEngine2, LC = window.KioukanLC, ART = window.KioukanArt, WT = window.KioukanWT;
  var SPEC = window.KioukanSpec2, PUZ = window.KioukanPuzzles2, PLAN = window.KioukanPlan2, WORLD = window.KioukanWorld, FLAVOR = window.KioukanFlavor2 || {};
  var TUTO = false, DEMO = 0, FIRST = SPEC.first || 43;
  var N = FIRST + SPEC.levels.length - 1, tl = E.timeLabel;
  var STEPS = [], NSUS = 0, X = {};
  var ROOMS, SUSPECTS, STEP, DOORS, PLACE, LV, CH;
  var EN = window.KIOUKAN_LANG === 'en', TR = window.T;
  function pl(n, one, many) { return n > 1 ? many : one; }

  var ICON = {
    ok: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bad: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    pending: '',
    lock: '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3.4 5.4V4a2.6 2.6 0 0 1 5.2 0v1.4M2.4 5.4h7.2v5.2H2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
  };
  ICON['true'] = ICON.ok; ICON['false'] = ICON.bad;
  var MODE_LABEL = { classic: TR('Constats'), liar: TR('Un menteur'), half: TR('Demi-vérités'), liar2: TR('Deux menteurs') };

  var state = {
    ep: 1, puz: null, grid: [], given: [], selT: 0, live: true, checked: false, hideOk: false,
    picker: null, accuse: false, accused: [], wrong: 0, early: 0, hints: 0, solved: false, lastWrong: -1, liarGuess: [], listOpen: false
  };

  /* ---------- Progression ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  var prog = (function () { try { return JSON.parse(lsGet('kioukan.campagne2') || '{}'); } catch (e) { return {}; } })();
  prog.solved = prog.solved || {}; prog.help = prog.help || {};
  function save() { lsSet('kioukan.campagne2', JSON.stringify(prog)); }
  function unlocked(n) { return n === FIRST || !!prog.solved[n - 1] || !!prog.solved[n]; }
  function lastUnlocked() { for (var n = N; n >= FIRST; n--) if (unlocked(n)) return n; return FIRST; }
  function levelOf(n) { return SPEC.levels[n - FIRST]; }
  function chapterOf(lv) { for (var i = 0; i < SPEC.chapters.length; i++) if (SPEC.chapters[i].n === lv.ch) return SPEC.chapters[i]; return SPEC.chapters[0]; }

  /* ---------- Outils ---------- */
  function $(id) { return document.getElementById(id); }
  function g(s, t) { return state.grid[s * state.puz.T + t]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ ([!?:;»])/g, EN ? ' $1' : '\u00a0$1').replace(/« /g, EN ? '« ' : '«\u00a0'); }
  function isLiar(P) { return P.mode === 'liar' || P.mode === 'half' || P.mode === 'liar2'; }
  function nLiars(P) { return P.mode === 'liar2' ? 2 : 1; }
  function isDarkT(t) { return X.dark != null && t === X.dark; }
  function inRoom(r) { return (EN ? (ROOMS[r].on ? 'on ' : 'in ') : (ROOMS[r].on ? 'sur ' : 'dans ')) + ROOMS[r].the; }
  function culpritName() { return SUSPECTS[state.puz.culprit].name; }
  function fmt(s) {
    var P = state.puz;
    return s.replace(/\{h\}/g, P.crime.t >= 0 ? tl(P.crime.t) : '?').replace(/\{lieu\}/g, inRoom(P.crime.room)).replace(/\{coupable\}/g, culpritName())
      .replace(/\{heures\}/g, X.times ? X.times.map(tl).join(', ') : '');
  }
  function nameOf(n) { return n === '@culprit' ? culpritName() : window.tn(n); }
  function crimeText() { return ruleText(); }
  function idxOf(name) { name = window.tn(name); for (var i = 0; i < SUSPECTS.length; i++) if (SUSPECTS[i].name === name) return i; return -1; }


  /* ---------- Constats de la campagne 2 ---------- */
  function rowsAll(t) { var a = []; for (var s = 0; s < state.puz.S; s++) a.push(g(s, t)); return a; }
  function ev(P, c, gg) {
    var v, w, k, unk, s, t;
    switch (c.type) {
      case 'oneOf': v = gg(c.a, c.t); w = gg(c.b, c.t); if (v === c.r || w === c.r) return 'ok'; return v >= 0 && w >= 0 ? 'bad' : 'pending';
      case 'neither': v = gg(c.a, c.t); w = gg(c.b, c.t); if (v === c.r || w === c.r) return 'bad'; return v >= 0 && w >= 0 ? 'ok' : 'pending';
      case 'notEmpty': unk = false; for (s = 0; s < P.S; s++) { v = gg(s, c.t); if (v === c.r) return 'ok'; if (v < 0) unk = true; } return unk ? 'pending' : 'bad';
      case 'notAlone': v = gg(c.s, c.t); if (v < 0) return 'pending'; unk = false; for (s = 0; s < P.S; s++) { if (s === c.s) continue; w = gg(s, c.t); if (w === v) return 'ok'; if (w < 0) unk = true; } return unk ? 'pending' : 'bad';
      case 'notMoves': k = 0; for (t = 0; t < P.T; t++) if (gg(c.s, t) < 0) return 'pending'; for (t = 0; t < P.T - 1; t++) if (gg(c.s, t) !== gg(c.s, t + 1)) k++; return k !== c.n ? 'ok' : 'bad';
    }
    return E.evalClue(P, c, gg);
  }
  function bc(P, c, gg) {
    var out = [], s, t;
    switch (c.type) {
      case 'oneOf': case 'neither': return [[c.a, c.t], [c.b, c.t]];
      case 'notEmpty': for (s = 0; s < P.S; s++) out.push([s, c.t]); return out;
      case 'notAlone': return [[c.s, c.t]];
      case 'notMoves': for (t = 0; t < P.T; t++) out.push([c.s, t]); return out;
      case 'visited': case 'moves': for (t = 0; t < P.T; t++) out.push([c.s, t]); return out;
    }
    return E.badCells(P, c, gg);
  }
  function tookW(s, t, gg) { for (var u = X.weapon.after + 1; u < t; u++) if (gg(s, u) === X.weapon.room) return 1; for (u = X.weapon.after + 1; u < t; u++) if (gg(s, u) < 0) return -1; return 0; }
  // Règle du méfait : { st, cells }
  function crimeEval(gg) {
    var P = state.puz, room = P.crime.room, s, v, cells = [], n = 0, unk = false, t;
    if (X.times) {
      var ones = 0, open = false;
      X.times.forEach(function (u) {
        var c = 0, uk = false;
        for (s = 0; s < NSUS; s++) { v = gg(s, u); if (v === room) c++; else if (v < 0) uk = true; }
        if (uk && c <= 1) open = true; else if (c === 1) { ones++; for (s = 0; s < NSUS; s++) if (gg(s, u) === room) cells.push([s, u]); }
      });
      if (ones > 1) return { st: 'bad', cells: cells };
      if (open) return { st: 'pending', cells: [] };
      return { st: ones === 1 ? 'ok' : 'bad', cells: ones ? [] : X.times.map(function (u) { return [0, u]; }) };
    }
    t = P.crime.t;
    if (X.victim) { v = gg(NSUS, t); if (v >= 0 && v !== room) return { st: 'bad', cells: [[NSUS, t]] }; }
    if (X.weapon) {
      var took = 0, maybe = false;
      for (s = 0; s < NSUS; s++) {
        v = gg(s, t);
        if (v < 0) { maybe = true; continue; }
        if (v !== room) continue;
        var k = tookW(s, t, gg);
        if (k === 1) { took++; cells.push([s, t]); } else if (k < 0) maybe = true;
      }
      if (took > 1) return { st: 'bad', cells: cells };
      if (maybe) return { st: 'pending', cells: [] };
      return { st: took === 1 ? 'ok' : 'bad', cells: [] };
    }
    for (s = 0; s < NSUS; s++) { v = gg(s, t); if (v === room) { n++; cells.push([s, t]); } else if (v < 0) unk = true; }
    if (n > 1) return { st: 'bad', cells: cells };
    if (unk) return { st: 'pending', cells: [] };
    return { st: n === 1 ? 'ok' : 'bad', cells: [] };
  }
  function keyEval(gg) {
    if (!X.locked) return null;
    var P = state.puz, G = [], s, t;
    for (s = 0; s < P.S; s++) { G.push([]); for (t = 0; t < P.T; t++) { var v = gg(s, t); if (v < 0) { if (isDarkT(t)) v = X.sol[s][t]; else return 'pending'; } G[s].push(v); } }
    return E2.keyOk(X.raw, G) ? 'ok' : 'bad';
  }
  function nm(s) { return SUSPECTS[s].name; }
  function fem(s) { return !!SUSPECTS[s].f; }
  function ruleText() {
    var P = state.puz, w = TR(LV.word), where = inRoom(P.crime.room), lie = '';
    if (isLiar(P)) lie = nLiars(P) === 2 ? (EN ? 'Two suspects lie about everything: the culprit and an accomplice. ' : 'Deux suspects mentent sur tout : le coupable et un complice. ') : (EN ? 'The liar is the culprit. ' : 'Le menteur est le coupable. ');
    if (X.times) return lie + (EN ? 'Of ' + X.times.map(tl).join(', ') + ', only one time had a single suspect ' + where + ': that is the time, and that is ' + w + '.'
      : 'Parmi ' + X.times.map(tl).join(', ') + ', une seule heure où un seul suspect était ' + where + ' : c’est l’heure des faits, et c’est ' + w + '.');
    var h = tl(P.crime.t) + (X.dark != null ? (EN ? ' (in the dark)' : ' (dans le noir)') : '');
    if (X.weapon) {
      var wr = ROOMS[X.weapon.room].the, vn = X.victim ? nm(NSUS) : '';
      return lie + (EN ? vn + ' was ' + where + ' at ' + h + '. Of the suspects with ' + (fem(NSUS) ? 'her' : 'him') + ', only one had been through ' + wr + ' beforehand: ' + w + '.'
        : vn + ' était ' + where + ' à ' + h + '. Parmi les suspects présents, un seul était passé par ' + wr + ' avant : ' + w + '.');
    }
    if (X.victim) return lie + (EN ? nm(NSUS) + ' was ' + where + ' at ' + h + ', alone with ' + w + '.' : nm(NSUS) + ' était ' + where + ' à ' + h + ', ' + (fem(NSUS) ? 'seule' : 'seul') + ' avec ' + w + '.');
    return lie + (EN ? 'Only one suspect was ' + where + ' at ' + h + ': ' + w + '.' : 'Un seul suspect se trouvait ' + where + ' à ' + h + ' : ' + w + '.');
  }
  function keyText() {
    var who = nm(X.keyStart), doors = X.locked.map(function (d) { return ROOMS[d[0]].short + ' – ' + ROOMS[d[1]].short; }).join(', ');
    return EN ? 'Locked doors (' + doors + '): only the key holder, or someone going through with them, can pass. Two people in the same room can hand over the key. At the start, ' + who + ' has it.'
      : 'Portes fermées (' + doors + ') : seul le porteur de la clé, ou quelqu’un qui passe avec lui, peut les franchir. Deux personnes dans la même pièce peuvent se passer la clé. Au début, elle est chez ' + who + '.';
  }
  function twinsTxt(c, neg) {
    var r = inRoom(c.r), t = tl(c.t);
    if (EN) return (neg ? 'Neither of the twins was ' : 'One of the twins was ') + r + ' at ' + t + (neg ? '.' : ' (Pia, Paola, or both).');
    return (neg ? 'Aucune des jumelles n’était ' : 'Une des jumelles était ') + r + ' à ' + t + (neg ? '.' : ' (Pia, Paola, ou les deux).');
  }
  function clueTxt(P, c) {
    switch (c.type) {
      case 'oneOf': return twinsTxt(c, false);
      case 'neither': return twinsTxt(c, true);
      case 'notEmpty': return EN ? 'Someone was ' + inRoom(c.r) + ' at ' + tl(c.t) + '.' : 'Quelqu’un se trouvait ' + inRoom(c.r) + ' à ' + tl(c.t) + '.';
      case 'notAlone': return EN ? nm(c.s) + ' was not alone at ' + tl(c.t) + '.' : nm(c.s) + ' n’était pas ' + (fem(c.s) ? 'seule' : 'seul') + ' à ' + tl(c.t) + '.';
      case 'notMoves': return EN ? nm(c.s) + ' did not change rooms exactly ' + c.n + ' time' + (c.n > 1 ? 's' : '') + '.' : nm(c.s) + ' n’a pas changé de pièce exactement ' + c.n + ' fois.';
    }
    return E.clueText(P, c);
  }
  // Déclaration à la première personne quand le témoin parle de lui-même
  function stmtTxt(P, c) {
    var by = c.by, me = function (x) { return x === by; }, U = E.SCENE.unit, t = c.t != null ? tl(c.t) : '', f = by != null && fem(by);
    var twin = X.raw.twins && X.raw.twins.indexOf(by) >= 0 && (c.type === 'oneOf' || c.type === 'neither') && (c.a === by || c.b === by);
    if (EN) {
      switch (c.type) {
        case 'moves': if (me(c.s)) return c.n === 0 ? 'I didn’t move all evening.' : c.n === 1 ? 'I changed ' + U + 's only once.' : 'I changed ' + U + 's ' + c.n + ' times in total.'; break;
        case 'notMoves': if (me(c.s)) return 'I did not change ' + U + 's exactly ' + c.n + ' time' + (c.n > 1 ? 's' : '') + '.'; break;
        case 'alone': if (me(c.s)) return 'I was alone in my ' + U + ' at ' + t + '.'; break;
        case 'notAlone': if (me(c.s)) return 'I was not alone at ' + t + '.'; break;
        case 'oneOf': if (twin) return 'My sister or I was ' + inRoom(c.r) + ' at ' + t + '.'; break;
        case 'neither': if (twin) return 'Neither my sister nor I was ' + inRoom(c.r) + ' at ' + t + '.'; break;
      }
    } else {
      switch (c.type) {
        case 'moves': if (me(c.s)) return c.n === 0 ? 'Je n’ai pas bougé de la soirée.' : c.n === 1 ? 'Je n’ai changé de ' + U + ' qu’une seule fois.' : 'J’ai changé de ' + U + ' ' + c.n + ' fois au total.'; break;
        case 'notMoves': if (me(c.s)) return 'Je n’ai pas changé de ' + U + ' exactement ' + c.n + ' fois.'; break;
        case 'alone': if (me(c.s)) return 'J’étais ' + (f ? 'seule' : 'seul') + ' dans ma ' + U + ' à ' + t + '.'; break;
        case 'notAlone': if (me(c.s)) return 'Je n’étais pas ' + (f ? 'seule' : 'seul') + ' à ' + t + '.'; break;
        case 'oneOf': if (twin) return 'Ma sœur ou moi étions ' + inRoom(c.r) + ' à ' + t + '.'; break;
        case 'neither': if (twin) return 'Ni ma sœur ni moi n’étions ' + inRoom(c.r) + ' à ' + t + '.'; break;
      }
    }
    if (c.type === 'oneOf' || c.type === 'neither' || c.type === 'notEmpty' || c.type === 'notAlone' || c.type === 'notMoves' || c.type === 'moves' || c.type === 'alone') return clueTxt(P, c);
    return E.statementText(P, c);
  }
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
        var eps = SPEC.levels.map(function (l, i) { return { l: l, n: i + FIRST }; }).filter(function (x) { return x.l.ch === c.n; });
        var nDone = eps.filter(function (x) { return prog.solved[x.n]; }).length;
        return '<section class="ep-ch"><h3><span>' + TR('Chapitre') + ' ' + c.n + '</span>' + esc(TR(c.title)) + '<small>' + nDone + '/' + eps.length + '</small></h3><div class="ep-grid">' +
          eps.map(function (x) {
            var u = unlocked(x.n), done = prog.solved[x.n];
            return '<button type="button" class="ep-btn' + (x.n === state.ep ? ' cur' : '') + (done ? ' done' : '') + '" data-act="ep" data-n="' + x.n + '"' + (u ? '' : ' disabled') + '>' +
              '<b>' + x.n + '</b><span>' + (u ? esc(TR(x.l.title)) : TR('Verrouillé')) + '</span><small>' + (done ? (prog.help[x.n] ? TR('résolu avec aide') : TR('résolu ✓')) : MODE_LABEL[x.l.mode || 'classic']) + '</small></button>';
          }).join('') + '</div></section>';
      }).join('') + (DEMO ? '<section class="ep-ch demo-soon"><h3><span>' + TR('Bientôt') + '</span>' + TR('Chapitres 2 à {n}', { n: SPEC.chapters.length }) + '</h3><p>' + TR('Le reste de l’enquête est encore en développement.') + '</p></section>' : '') + '</div>';
    }
    $('episodes').innerHTML = h;
  }

  function renderIntro() {
    var first = SPEC.levels.findIndex(function (l) { return l.ch === LV.ch; }) + FIRST === state.ep;
    var imgs = window.KIOUKAN_IMAGES || {}, bk = (LV.intro || []).map(function (b) { return b.bg; }).filter(function (k) { return imgs['bg:' + k]; }).sort(function (x, y) { return (x === 'night') - (y === 'night'); })[0] || (imgs['bg:night'] ? 'night' : ''), bsrc = bk ? imgs['bg:' + bk] : '';
    $('intro').innerHTML =
      '<div class="cover' + (bsrc ? ' ep-banner' : '') + '"' + (bsrc ? ' style="background-image:url(' + bsrc + ')"' : '') + '><p class="kicker">' + (TUTO ? '' : TR('Chapitre') + ' ' + CH.n + ' · ') + esc(TR(CH.title)) + '</p>' +
      (first ? '<p class="blurb">' + esc(TR(CH.blurb)) + '</p>' : '') +
      '<h2 class="lvl-title"><span>' + TR('Épisode') + ' ' + state.ep + ' · ' + MODE_LABEL[LV.mode || 'classic'] + '</span>' + esc(TR(LV.title)) + '</h2></div>' +
      storyText(LV.intro) +
      '<p class="go"><a class="btn primary" href="#case">' + TR('Ouvrir l’enquête') + '</a></p>' +
      (state.ep === FIRST ? '<p class="howto">' + TR('Première enquête ?') + ' <a href="#rules" onclick="var r=document.getElementById(\'rules\');r.open=true;r.scrollIntoView({behavior:\'smooth\',block:\'start\'});return false">' + TR('Lis d’abord « Comment jouer »') + '</a>.</p>' : '');
  }

  /* ---------- Analyse ---------- */
  function showMarks() { return state.live || state.checked; }
  function analyse() {
    var P = state.puz, T = P.T, bad = {}, errors = 0, s, t, a, b, L = state.liarGuess;
    for (s = 0; s < P.S; s++) for (t = 1; t < T; t++) {
      a = g(s, t - 1); b = g(s, t);
      if (a >= 0 && b >= 0 && !((STEPS[s][a] >> b) & 1)) { bad[s * T + t - 1] = 1; bad[s * T + t] = 1; errors++; }
    }
    var items = [];
    var cr = crimeEval(g), rst = cr.st;
    if (isLiar(P) && L.length && cr.st !== 'bad') {
      // le coupable fait partie des menteurs désignés
      var culIn = false, here = [];
      for (s = 0; s < NSUS; s++) if (!X.times && g(s, P.crime.t) === P.crime.room) here.push(s);
      if (L.length === nLiars(P) && cr.st === 'ok' && !X.weapon && !X.times) { culIn = L.indexOf(here[0]) >= 0; if (!culIn) rst = 'bad'; }
    }
    if (rst === 'bad') { errors++; cr.cells.forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; }); }
    items.push({ c: { type: 'crime' }, st: rst, rule: true });
    var ks = keyEval(g);
    if (ks) { if (ks === 'bad') errors++; items.push({ c: { type: 'key' }, st: ks, rule: true, key: true }); }
    P.clues.forEach(function (c) {
      if (c.type === 'at' && c.by === undefined) return;
      var tv = ev(P, c, g), st;
      if (c.by === undefined || !isLiar(P)) st = tv;
      else if (tv === 'pending') st = 'pending';
      else if (L.length < nLiars(P)) st = L.indexOf(c.by) >= 0 ? (tv === 'ok' ? 'bad' : 'ok') : (tv === 'ok' ? 'true' : 'false');
      else st = ((tv === 'ok') === (L.indexOf(c.by) < 0)) ? 'ok' : 'bad';
      if (st === 'bad') { errors++; bc(P, c, g).forEach(function (rc) { bad[rc[0] * T + rc[1]] = 1; }); }
      items.push({ c: c, st: st });
    });
    var okCount = 0, filled = 0, need = 0;
    items.forEach(function (it) { if (it.st === 'ok') okCount++; });
    state.grid.forEach(function (v, i) { if (isDarkT(i % T) || state.given[i]) return; need++; if (v >= 0) filled++; });
    return { bad: bad, errors: errors, items: items, okCount: okCount, filled: filled, need: need };
  }
  function gridCorrect() { var sol = state.puz.solution, T = state.puz.T; return state.grid.every(function (v, i) { return isDarkT(i % T) || v === sol[i]; }); }
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

  function victimLabel() { var k = X.victim.kind, f = fem(NSUS); return k === 'mort' ? 'victime' : k === 'animal' ? 'enlevé' : k === 'ligote' ? 'ligoté' : k === 'enferme' ? 'enfermé' : k === 'entarte' ? 'entarté' : k === 'malade' ? 'empoisonné' : (f ? 'assommée' : 'assommé'); }
  function renderCase() {
    var P = state.puz;
    $('case').innerHTML = '<p class="eyebrow">' + TR('Épisode') + ' ' + state.ep + ' · ' + MODE_LABEL[LV.mode || 'classic'] + '</p><h2>' + esc(TR(LV.caseTitle)) + '</h2><p>' + esc(fmt(TR(LV.caseBody))) + '</p>';
    var h = '<div class="panel-hd"><h2 class="label">' + TR('Les suspects') + '</h2><span class="sub">' + NSUS + ' ' + TR('personnes') + '</span></div><div class="fiches" style="--n:' + Math.min(NSUS, 3) + ';--N:' + NSUS + '">';
    for (var s = 0; s < NSUS; s++) h += fiche(s);
    if (X.victim) h += fiche(NSUS, '<b class="guilty">' + TR(victimLabel()) + '</b>');
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

  // Campagne 2 : passages secrets, portes fermées, arme
  function overlays(G) {
    var h = '';
    (X.secret || []).forEach(function (q) {
      var A = G[q.a], B = G[q.b], x1 = A.x + A.w / 2, y1 = A.y + A.h / 2 + 8, x2 = B.x + B.w / 2, y2 = B.y + B.h / 2 + 8;
      h += '<line class="secret" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
    });
    (X.locked || []).forEach(function (d) {
      var R = doorRect(G, d[0], d[1]);
      h += '<rect class="door locked" x="' + R.x + '" y="' + R.y + '" width="' + R.w + '" height="' + R.h + '" rx="2"/>' +
        '<g class="padlock" transform="translate(' + (R.x + R.w / 2) + ',' + (R.y + R.h / 2) + ')"><rect x="-5" y="-2" width="10" height="8" rx="1.5"/><path d="M-3 -2v-2.5a3 3 0 0 1 6 0V-2" fill="none"/></g>';
    });
    if (X.weapon) {
      var W = G[X.weapon.room];
      h += '<g class="weapon" transform="translate(' + (W.x + W.w - 14) + ',' + (W.y + 24) + ')"><circle r="9"/><path d="M-4 4L4 -4M1.5 -5.5L5.5 -1.5M-5 2l3 3" /></g>';
    }
    return h;
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
    h += overlays(G);
    for (r = 0; r < ROOMS.length; r++) {
      var XL = EN && WORLD.EN_PLACES && WORLD.EN_PLACES[CH.place] && WORLD.EN_PLACES[CH.place].labels, lab = (XL ? XL[r] : G[r].l) || ROOMS[r].name.toUpperCase(), w = Math.round(lab.length * 5.6 + 12), cx = G[r].x + G[r].w / 2, cy = G[r].y + 10;
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
    for (i = 0; i < T; i++) {
      var isCrime = X.times ? X.times.indexOf(i) >= 0 : i === P.crime.t;
      chips += '<button type="button" class="chip' + (isCrime ? ' crime' : '') + (isDarkT(i) ? ' dark' : '') + '" data-act="time" data-t="' + i + '" aria-pressed="' + (i === t) + '">' + tl(i) + '</button>';
    }
    var occ = ROOMS.map(function () { return []; });
    for (s = 0; s < P.S; s++) { var v = g(s, t); if (v >= 0) occ[v].push(s); }
    var svg = PLACE.view === 'train'
      ? LC.train({ img: (window.KIOUKAN_IMAGES || {})['plan:' + CH.place], tok: tok, small: function (nm) { return !!(IC && IC.has(nm)); }, occ: occ, crime: P.crime.room, labels: (EN && WORLD.EN_PLACES && WORLD.EN_PLACES[CH.place]) ? WORLD.EN_PLACES[CH.place].labels : PLACE.labels, names: SUSPECTS.map(function (x) { return x.name; }), culprit: state.solved && t === P.crime.t ? P.culprit : -1, label: E.SCENE.label + ' ' + TR('à') + ' ' + tl(t) })
      : planSVG(occ, t);
    var lg = '<span><i class="lg-door"></i>' + (PLACE.view === 'train' ? TR('passage entre voitures') : TR('porte')) + '</span>' + (PLACE.view === 'train' ? '<span><i class="lg-ladder"></i>' + TR('trappe vers le toit') + '</span>' : '') + '<span><i class="lg-crime"></i>' + TR('lieu des faits') + '</span>';
    if (X.secret) X.secret.forEach(function (q) { lg += '<span><i class="lg-secret"></i>' + TR('passage secret') + ' ' + ROOMS[q.a].short + ' – ' + ROOMS[q.b].short + ' (' + q.who.map(function (w) { return SUSPECTS[w].short; }).join(', ') + ')</span>'; });
    if (X.locked) lg += '<span><i class="lg-locked"></i>' + TR('porte fermée à clé') + '</span>';
    if (X.weapon) lg += '<span><i class="lg-weapon"></i>' + TR('arme') + ' : ' + ROOMS[X.weapon.room].name + '</span>';
    if (X.dark != null) lg += '<span><i class="lg-dark"></i>' + TR('panne') + ' : ' + tl(X.dark) + '</span>';
    $('map-panel').innerHTML = '<div class="panel-hd"><h2 class="label">' + esc(E.SCENE.label) + '</h2><span class="sub">' + TR('à') + ' ' + tl(t) + (isDarkT(t) ? ' · ' + TR('dans le noir') : '') + '</span></div>' +
      '<div class="chips" style="--n:' + T + '">' + chips + '</div><div class="train-frame' + (isDarkT(t) ? ' is-dark' : '') + '">' + svg + '</div>' +
      '<p class="legend">' + lg + '</p>';
  }
  function renderBoard() {
    var P = state.puz, S = P.S, T = P.T, A = analyse(), show = showMarks(), s, t, h = '', L = state.liarGuess;
    h += '<div class="panel-hd"><h2 class="label">' + TR('Chronologie') + '</h2><span class="sub">' + TR('touche une case') + '</span></div>';
    h += '<div class="board' + (S >= 5 ? ' dense' : '') + '" style="--cols:' + S + '"><div></div>';
    for (s = 0; s < S; s++) {
      var vic = s >= NSUS;
      h += '<div class="who s' + ci(s) + (vic ? ' victim' : '') + '">' + miniIc(s) + '<b>' + SUSPECTS[s].short + '</b>' +
        (isLiar(P) && L.indexOf(s) >= 0 ? '<small class="liar-badge">' + TR('menteur ?') + '</small>' : '<small>' + (vic ? TR(victimLabel()) : SUSPECTS[s].role) + '</small>') + '</div>';
    }
    for (t = 0; t < T; t++) {
      var isCrime = X.times ? X.times.indexOf(t) >= 0 : t === P.crime.t;
      h += '<button type="button" class="time' + (t === state.selT ? ' sel' : '') + (isDarkT(t) ? ' dark' : '') + '" data-act="time" data-t="' + t + '">' + tl(t) +
        (isDarkT(t) ? '<small>' + TR('panne') + '</small>' : isCrime ? '<small>' + (X.times ? '?' : esc(TR(LV.noun))) + '</small>' : '') + '</button>';
      for (s = 0; s < S; s++) {
        var idx = s * T + t, v = state.grid[idx], given = state.given[idx];
        var cls = 'cell s' + ci(s) + (v < 0 ? ' empty' : '') + (given ? ' given' : '') + (isDarkT(t) ? ' dark' : '') + (show && !given && A.bad[idx] ? ' bad' : '');
        var label = SUSPECTS[s].name + ', ' + tl(t) + ' : ' + (v < 0 ? TR('vide') : ROOMS[v].name) + (given ? ' (' + TR('confirmé') + ')' : '');
        h += '<button type="button" class="' + cls + '" data-act="cell" data-s="' + s + '" data-t="' + t + '" aria-label="' + label + '"' +
          (given || state.solved ? ' disabled' : '') + '>' + (v < 0 ? (isDarkT(t) ? '?' : '') : ROOMS[v].short) + (given ? ICON.lock : '') + '</button>';
      }
    }
    h += '</div>';
    if (isLiar(P) && !state.solved) {
      h += '<div class="liar"><span class="liar-q">' + TR(nLiars(P) === 2 ? 'Qui sont les deux menteurs ?' : 'Qui ment ?') + '</span><div class="liar-btns">';
      for (s = 0; s < NSUS; s++) h += '<button type="button" class="liar-btn s' + ci(s) + '" data-act="liar" data-s="' + s + '" aria-pressed="' + (L.indexOf(s) >= 0) + '">' + miniIc(s) + SUSPECTS[s].short + '</button>';
      h += '</div></div>';
    }
    h += '<div class="status"><span>' + A.filled + '/' + A.need + ' ' + TR('cases') + '</span>' +
      (show ? '<span class="' + (A.errors ? 'err' : '') + '">' + A.errors + ' ' + TR(pl(A.errors, 'contradiction', 'contradictions')) + '</span>' : '<span>' + TR('vérification en direct désactivée') + '</span>') +
      (isLiar(P) && !state.solved && L.length < nLiars(P) && gridCorrect() ? '<span class="err">' + TR(nLiars(P) === 2 ? 'chronologie complète : désigne les deux menteurs' : 'chronologie complète : désigne le menteur') + '</span>' : '') +
      (X.dark != null && !state.solved && gridCorrect() ? '<span class="err">' + TR('chronologie complète : accuse le coupable') + '</span>' : '') +
      (state.wrong && !state.solved ? '<span class="err">' + state.wrong + ' ' + TR(pl(state.wrong, 'fausse accusation', 'fausses accusations')) + '</span>' : '') + '</div>';
    if (state.lastWrong >= 0 && !state.solved) {
      var w = SUSPECTS[state.lastWrong];
      h += '<div class="reply"><span class="mini-wrap">' + mini(state.lastWrong, 'serieux') + '</span><p class="bubble small">' + esc(TR(SPEC.wrong[w.id || w.name] || (window.KioukanSpec && window.KioukanSpec.wrong[w.id || w.name]) || 'Vous faites erreur !')) + '</p></div>' +
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
  function flavorOne(P, c) {
    var FL = FLAVOR[state.ep], i = P.clues.indexOf(c);
    if (FL) for (var k = 0; k < FL.length; k++) if (FL[k].ids.length === 1 && FL[k].ids[0] === i) return nbsp(esc(TR(FL[k].text)));
    return '';
  }
  function flavoredStatement(P, c) {
    var FL = FLAVOR[state.ep], i = P.clues.indexOf(c);
    if (FL) for (var k = 0; k < FL.length; k++) if (FL[k].ids.length === 1 && FL[k].ids[0] === i) return nbsp(esc(TR(FL[k].text)));
    return EN ? '“' + stmtTxt(P, c) + '”' : '« ' + stmtTxt(P, c) + ' »';
  }
  function renderClues() {
    var P = state.puz, A = analyse(), show = showMarks(), h = '';
    var rules = A.items.filter(function (it) { return it.rule; });
    var ruleRows = rules.map(function (it) { return li(it, it.key ? keyText() : ruleText(), show); }).join('');
    if (!isLiar(P)) {
      h = '<div class="panel-hd"><h2 class="label">' + TR('Carnet d’Hortense') + '</h2><span class="sub">' + (show ? A.okCount + '/' + A.items.length + ' ' + TR('confirmés') : A.items.length + ' ' + TR('constats')) + '</span></div>';
      h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les indices confirmés') + '</span></label>';
      var FL = FLAVOR[state.ep], rows, items = A.items.filter(function (it) { return !it.rule; });
      if (FL) {
        var stOf = function (c) { for (var k = 0; k < A.items.length; k++) if (A.items[k].c === c) return A.items[k].st; return 'pending'; };
        var groups = FL.map(function (gr) {
          var sts = gr.ids.map(function (i) { return stOf(P.clues[i]); });
          return { st: sts.indexOf('bad') >= 0 ? 'bad' : sts.every(function (x) { return x === 'ok'; }) ? 'ok' : 'pending', text: nbsp(esc(TR(gr.text))) };
        });
        var nOk = groups.filter(function (x) { return x.st === 'ok'; }).length + rules.filter(function (x) { return x.st === 'ok'; }).length;
        h = h.replace(/<span class="sub">[^<]*<\/span>/, '<span class="sub">' + (show ? nOk + '/' + (groups.length + rules.length) + ' ' + TR('confirmés') : (groups.length + rules.length) + ' ' + TR('indices')) + '</span>');
        rows = ruleRows + groups.map(function (x) { return li({ st: x.st }, x.text, show); }).join('');
      } else rows = ruleRows + items.map(function (it) { return li({ st: it.st }, nbsp(esc(clueTxt(P, it.c))), show); }).join('');
      h += rows ? '<ul class="clues">' + rows + '</ul>' : '<p class="empty-note">' + TR('Tous les constats sont confirmés.') + '</p>';
      $('clues-panel').innerHTML = h; return;
    }
    var L = state.liarGuess, s;
    h += '<div class="panel-hd"><h2 class="label">' + TR('Témoignages') + '</h2><span class="sub">' + (show ? (L.length < nLiars(P) ? TR(nLiars(P) === 2 ? 'désigne les menteurs' : 'désigne un menteur') : A.okCount + '/' + A.items.length + ' ' + TR('confirmés')) : A.items.length + ' ' + TR('constats')) + '</span></div>';
    h += '<label class="switch opts"><input type="checkbox" id="hideok"' + (state.hideOk ? ' checked' : '') + '><span>' + TR('Masquer les déclarations confirmées') + '</span></label>';
    h += '<ul class="clues">' + ruleRows + '</ul>';
    var facts = A.items.filter(function (it) { return !it.rule && it.c.by === undefined; });
    if (facts.length) h += '<div class="speaker"><b>' + TR('Preuves') + '</b><span class="tag">' + TR('certaines') + '</span></div><ul class="clues">' +
      facts.map(function (it) { return li(it, flavorOne(P, it.c) || nbsp(esc(clueTxt(P, it.c))), show); }).join('') + '</ul>';
    for (s = 0; s < NSUS; s++) {
      var rws = A.items.filter(function (it) { return !it.rule && it.c.by === s; }).map(function (it) { return li(it, flavoredStatement(P, it.c), show); }).join('');
      var who = L.length < nLiars(P) && L.indexOf(s) < 0 ? (L.indexOf(s) >= 0 ? '<span class="tag liar-tag">' + TR('ment sur tout') + '</span>' : '') : (L.indexOf(s) >= 0 ? '<span class="tag liar-tag">' + TR('ment sur tout') + '</span>' : '<span class="tag">' + TR('dit vrai') + '</span>');
      h += '<div class="sp s' + ci(s) + '">' + mini(s) + '<div class="sp-body"><p class="sp-name"><b>' + SUSPECTS[s].name + '</b> ' + who + '</p>' +
        (rws ? '<ul class="clues bubbles">' + rws + '</ul>' : '<p class="empty-note">' + TR('Toutes ses déclarations sont confirmées.') + '</p>') + '</div></div>';
    }
    $('clues-panel').innerHTML = h;
  }
  function verdictText() {
    var P = state.puz, c = SUSPECTS[P.culprit], f = c.f, t = X.crimeT, where = inRoom(P.crime.room);
    var liars = X.liarSet ? X.liarSet.filter(function (x) { return x !== P.culprit; }).map(function (x) { return SUSPECTS[x].name; }) : [];
    if (EN) {
      var sh = f ? 'She' : 'He', base = '<b>' + c.name + '</b> was ' + (X.weapon ? 'the only one with the weapon ' : 'alone ') + where + ' at ' + tl(t) + '.';
      if (P.mode === 'liar') return '<b>' + c.name + '</b> lied about everything. ' + sh + ' was ' + (X.weapon ? 'the one with the weapon ' : 'alone ') + where + ' at ' + tl(t) + '.';
      if (P.mode === 'liar2') return base + ' ' + sh + ' lied about everything, and so did ' + liars.join(', ') + ', the accomplice.';
      return base + ' Every other alibi holds.';
    }
    var seul = f ? 'seule' : 'seul', il = f ? 'Elle' : 'Il';
    var base2 = '<b>' + c.name + '</b> ' + (X.weapon ? 'était ' + where + ' à ' + tl(t) + ', et ' + (f ? 'elle' : 'lui') + ' seul' + (f ? 'e' : '') + ' avait pu prendre l’arme.' : 'était ' + seul + ' ' + where + ' à ' + tl(t) + '.');
    if (P.mode === 'liar') return '<b>' + c.name + '</b> mentait sur toute la ligne. ' + il + ' ' + base2.replace(/^<b>[^<]*<\/b> /, '');
    if (P.mode === 'liar2') return base2 + ' ' + il + ' mentait sur tout, et son complice aussi : ' + liars.join(', ') + '.';
    return base2 + ' Tous les autres alibis tiennent.';
  }
  function renderVerdict() {
    var el = $('verdict');
    if (!state.solved) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="panel verdict"><div class="v-top">' + fiche(state.puz.culprit, '<b class="guilty">' + TR('coupable') + '</b>') + '<div class="stamp">' + TR('Affaire classée') + '</div></div>' +
      '<p>' + verdictText() + '</p>' +
      '<p class="sub">' + (EN
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
      '<p class="next">' + (state.ep < N ? '<button type="button" class="btn primary" data-act="next">' + TR('Épisode') + ' ' + (state.ep + 1) + ' →</button> ' : '<span class="soon">' + TR('Bravo, la campagne est terminée !') + '</span> ') +
      '<button type="button" class="btn" data-act="replay">' + TR('Rejouer') + '</button></p></div>';
  }

  function renderSheet() {
    var root = $('sheet-root'), p = state.picker, P = state.puz;
    if (state.accuse) {
      var ab = '';
      for (var q = 0; q < NSUS; q++) {
        var out = state.accused.indexOf(q) >= 0;
        ab += '<button type="button" class="acc-btn' + (out ? ' out' : '') + '" data-act="accpick" data-s="' + q + '"' + (out ? ' disabled' : '') + '>' + fiche(q, out ? TR('innocent') : '') + '</button>';
      }
      root.innerHTML = '<div class="scrim" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="' + TR('Désigner le coupable') + '">' +
        '<div class="sheet-hd"><b class="acc-t">' + TR('J’accuse…') + '</b></div><p class="trail">' + (EN ? 'Who is ' + esc(TR(LV.word)) + '? A wrong answer counts as a mistake.' : 'Qui est ' + esc(LV.word) + ' ? Une mauvaise réponse est comptée comme une erreur.') + '</p>' +
        '<div class="acc-grid" style="--n:' + Math.min(NSUS, 3) + '">' + ab + '</div><div class="sheet-ft"><button type="button" class="btn sm" data-act="close">' + TR('Annuler') + '</button></div></div>';
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
      var far = (prev >= 0 && !((STEPS[s][prev] >> r) & 1)) || (next >= 0 && !((STEPS[s][r] >> next) & 1));
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
      ['liar2', TR('Deux menteurs'), TR('Le coupable et un complice mentent dans toutes leurs déclarations. Les autres disent vrai.')]];
    return '<li class="modes-help"><b>' + TR('Les modes de jeu') + '</b><ul>' + items.map(function (m) {
      return '<li' + (m[0] === cur ? ' class="cur"' : '') + '><b>' + m[1] + '</b>' + (m[0] === cur ? ' <em>(' + TR('mode actuel') + ')</em>' : '') + ' : ' + m[2] + '</li>';
    }).join('') + '</ul></li>';
  }
  function mechRules() {
    var r = [], P = state.puz;
    if (EN) {
      if (X.victim) r.push('<b>The victim</b> has a row in the grid. At the time of the crime, they were at the scene; after that, they did not move.');
      if (X.secret) r.push('<b>Secret passages</b> (dotted line on the plan) link two distant rooms in one step, but only for those who know them.');
      if (X.weapon) r.push('<b>The weapon</b> was in ' + ROOMS[X.weapon.room].the + '. Several suspects may be with the victim: the culprit is the only one of them who went through ' + ROOMS[X.weapon.room].the + ' beforehand.');
      if (X.dark != null) r.push('<b>Power cut</b> at ' + tl(X.dark) + ': no statement concerns that time. That column does not need to be filled: just find the culprit.');
      if (X.locked) r.push('<b>Locked doors</b> (red on the plan): only the key holder, or someone going through with them, can pass. The key can change hands between two people in the same room.');
      if (X.times) r.push('<b>The right moment</b>: the place is known, not the time. Of the possible times, only one had a single suspect at the scene.');
      if (X.raw.twins) r.push('<b>The twins</b>: “one of the twins was there” means Pia, Paola, or both.');
      if (P.mode === 'liar2') r.push('<b>Two liars</b>: the culprit and an accomplice lie in every statement. Pick both under “Who are the two liars?”.');
    } else {
      if (X.victim) r.push('<b>La victime</b> a sa ligne dans la grille. À l’heure des faits, elle était sur les lieux ; ensuite, elle n’a plus bougé.');
      if (X.secret) r.push('<b>Les passages secrets</b> (pointillés sur le plan) relient deux pièces éloignées en un seul déplacement, mais seulement pour ceux qui les connaissent.');
      if (X.weapon) r.push('<b>L’arme</b> se trouvait dans ' + ROOMS[X.weapon.room].the + '. Plusieurs suspects peuvent être avec la victime : le coupable est le seul d’entre eux à être passé par ' + ROOMS[X.weapon.room].the + ' avant.');
      if (X.dark != null) r.push('<b>Panne</b> à ' + tl(X.dark) + ' : aucun témoignage ne porte sur cette heure. Pas besoin de remplir cette colonne : il suffit de trouver le coupable.');
      if (X.locked) r.push('<b>Portes fermées à clé</b> (en rouge sur le plan) : seul le porteur de la clé, ou quelqu’un qui passe avec lui, peut les franchir. La clé peut changer de main entre deux personnes dans la même pièce.');
      if (X.times) r.push('<b>Le bon moment</b> : le lieu est connu, pas l’heure. Parmi les heures possibles, une seule où un seul suspect était sur les lieux.');
      if (X.raw.twins) r.push('<b>Les jumelles</b> : « une des jumelles était là » veut dire Pia, Paola, ou les deux.');
      if (P.mode === 'liar2') r.push('<b>Deux menteurs</b> : le coupable et un complice mentent dans toutes leurs déclarations. Désigne-les tous les deux sous « Qui sont les deux menteurs ? ».');
    }
    return r;
  }
  function renderRules() {
    var U = E.SCENE.unit, mode = state.puz.mode, r;
    if (EN) {
      r = [
        'Each cell of the <b>timeline</b> shows which ' + U + ' a suspect was in at a given time. Tap a cell to choose.',
        'Between two times, a suspect either <b>stays put</b> or goes through a <b>door</b> to a neighbouring ' + U + ' (see the plan). Nobody walks through walls.'
      ];
      if (mode === 'classic') r.push('Every clue in the <b>notebook</b> is true, and only one timeline fits them all. One sentence can hold several facts: it is only confirmed once all of them are.');
      if (FLAVOR[state.ep]) r.push('Clocks and bells ring the hours of the evening: seven chimes is 7 pm, eight is 8 pm, nine is 9 pm, ten is 10 pm, eleven is 11 pm. “Passing through” a place means being there at least once on the timeline. Each column is a precise moment, not a stretch of time: “at 9 pm and at 9:30 pm” concerns two columns.');
      if (mode === 'liar' || mode === 'liar2') r.push('Each suspect makes <b>statements</b>. The innocent tell the truth. <b>The culprit lies every time.</b> Golden proofs are certain.', 'Pick your suspect under <b>Who is lying?</b>: their statements are then checked against your grid.');
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
    if (mode === 'liar' || mode === 'liar2') r.push('Chaque suspect fait des <b>déclarations</b>. Les innocents disent la vérité. <b>Le coupable ment à chaque fois.</b> Les preuves dorées sont certaines.', 'Désigne ton suspect sous <b>Qui ment ?</b> : ses déclarations se vérifient alors sur ta grille.');
    if (mode === 'half') r.push('Les innocents disent la vérité. <b>Le coupable mêle le vrai et le faux</b> : au moins une de ses déclarations est vraie, au moins une est fausse.', 'Désigne ton suspect sous <b>Qui ment ?</b> : ses déclarations s’affichent comme vraies ou fausses d’après ta grille.');
    r.push('À l’heure du méfait, le coupable était <b>seul</b> sur les lieux. Les cases dorées sont des faits établis.',
      'Pas besoin de tout remplir : dès que tu es sûr, touche <b>J’accuse !</b>. Une mauvaise accusation compte comme une erreur.',
      '<b>Vérification en direct</b> : cochée, les erreurs apparaissent aussitôt en rouge. Décochée, le bouton <b>Vérifier</b> contrôle la grille à la demande.');
    }
    r = r.concat(mechRules());
    $('rules-list').innerHTML = r.map(function (x) { return '<li>' + x + '</li>'; }).join('') + modesHelp(state.puz.mode);
  }

  function renderGame() { renderCase(); renderMap(); renderBoard(); renderVerdict(); renderClues(); renderSheet(); renderRules(); }

  /* ---------- Chargement d'un épisode ---------- */
  function load(n) {
    var wantRules = location.hash === '#rules';
    n = Math.max(FIRST, Math.min(N, n | 0));
    if (!unlocked(n)) n = lastUnlocked();
    state.ep = n; LV = levelOf(n); CH = chapterOf(LV);
    var D = PUZ[n], PL = PLAN.episodes[n - FIRST], s, t;
    var names = PL.suspects.slice(); if (D.victim) names.push(D.victim.name);
    WORLD.use('episode', CH.place, names);
    PLACE = WORLD.PLACES[CH.place];
    ROOMS = E.ROOMS; SUSPECTS = E.SUSPECTS; STEP = E.STEP; DOORS = E.DOORS;
    NSUS = D.S;
    var raw = JSON.parse(JSON.stringify(D)); raw.rooms = PLACE.rooms; raw.doors = PLACE.doors;
    STEPS = E2.prep(raw).adj.map(function (A) { return A.map(function (L) { return L.reduce(function (m, x) { return m | (1 << x); }, 0); }); });
    X = { raw: raw, victim: D.victim || null, weapon: D.weapon || null, dark: D.dark != null ? D.dark : null, times: D.crime.times || null,
      locked: D.locked && D.locked.length ? D.locked : null, keyStart: D.key ? D.key.start : -1, secret: D.secret && D.secret.length ? D.secret : null,
      crimeT: D.crimeT, liarSet: D.liarSet || null, sol: D.solution };
    var NE = D.S + (D.victim ? 1 : 0), T = D.T;
    var P = { S: NE, T: T, mode: LV.mode || 'classic', crime: { room: D.crime.room, t: D.crime.times ? -1 : D.crimeT }, culprit: D.culprit,
      clues: D.clues.map(function (c) { var o = {}; for (var k in c) o[k] = c[k]; return o; }), solution: [] };
    for (s = 0; s < NE; s++) for (t = 0; t < T; t++) P.solution.push(D.solution[s][t]);
    state.puz = P; state.grid = []; state.given = [];
    for (var i = 0; i < NE * T; i++) { state.grid.push(-1); state.given.push(false); }
    P.clues.forEach(function (c) { if (c.type === 'at' && c.by === undefined) { state.grid[c.s * T + c.t] = c.r; state.given[c.s * T + c.t] = true; } });
    // la victime ne bouge plus après les faits
    if (D.victim) for (t = D.crimeT; t < T; t++) { state.grid[NSUS * T + t] = P.crime.room; state.given[NSUS * T + t] = true; }
    state.selT = 0; state.checked = false; state.hints = 0; state.solved = false; state.accuse = false; state.accused = [];
    state.wrong = 0; state.early = 0; state.lastWrong = -1; state.picker = null; state.liarGuess = []; state.listOpen = false;
    lsSet('kioukan.campagne2.ep', String(n));
    if (location.hash !== '#e' + n) { try { history.replaceState(null, '', '#e' + n); } catch (e) { /* fichier local */ } }
    document.title = 'Kioukan · ' + TR(LV.title);
    renderList(); renderIntro(); renderGame(); if (wantRules) { var rr = $('rules'); if (rr) { rr.open = true; setTimeout(function () { rr.scrollIntoView({ block: 'start' }); }, 150); } }
  }
  function win(early) {
    if (window.KSFX) window.KSFX.play(state.ep >= N ? 'victory' : 'win');
    state.solved = true; state.early = early; state.selT = X.crimeT; state.lastWrong = -1;
    if (isLiar(state.puz)) state.liarGuess = (X.liarSet || [state.puz.culprit]).slice();
    state.grid = state.puz.solution.slice();
    prog.solved[state.ep] = 1; if (state.hints >= 3 || state.wrong >= 2) prog.help[state.ep] = 1; save();
  }
  function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); }
  function afterChange() {
    state.checked = false;
    var P = state.puz;
    if (!state.solved && X.dark == null && gridCorrect() && (!isLiar(P) || sameSet(state.liarGuess, X.liarSet || [P.culprit]))) win(0);
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
    state.grid.forEach(function (v, i) { if (!isDarkT(i % P.T) && v !== P.solution[i]) wrong.push(i); });
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
      case 'liar': var ls = +el.getAttribute('data-s'), LG = state.liarGuess, li0 = LG.indexOf(ls); if (li0 >= 0) LG.splice(li0, 1); else { LG.push(ls); if (LG.length > nLiars(state.puz)) LG.shift(); } afterChange(); break;
      case 'reset': state.grid = state.grid.map(function (v, i) { return state.given[i] ? v : -1; }); state.lastWrong = -1; state.liarGuess = []; afterChange(); break;
      case 'accuse': if (!state.solved) { state.accuse = true; renderSheet(); } break;
      case 'accpick':
        var as = +el.getAttribute('data-s'), P2 = state.puz;
        state.accuse = false;
        if (as === P2.culprit) {
          var emp = 0;
          state.grid.forEach(function (v, i) { if (!isDarkT(i % P2.T) && v !== P2.solution[i]) emp++; });
          win(emp);
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

  var m = /^#e(\d+)$/.exec(location.hash || ''), start = m ? +m[1] : +(lsGet('kioukan.campagne2.ep') || 0) || lastUnlocked();
  load(start);
  window.KioukanHistoire = { state: state, load: load, prog: prog, setCell: setCell, renderAll: renderGame, closeSheet: closeSheet, unlockAll: function () { for (var j = FIRST; j < N; j++) prog.solved[j] = 1; }, X: function () { return X; } };
})();

