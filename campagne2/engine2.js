/* Kioukan — moteur de la campagne 2.
   Une énigme : des personnages (suspects + éventuelle victime) qui se déplacent de pièce en pièce, créneau par créneau.
   Mécaniques : meurtre / agression (ligne victime), passages secrets (réservés aux initiés), arme du crime,
   panne de courant (un créneau dans le noir), portes fermées et clé, « bon moment » (lieu connu, heure inconnue),
   jumeaux (indice « l'un des deux »), menteurs (1 ou 2).
   Le même fichier sert au navigateur (window.KioukanEngine2) et à Node (require). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KioukanEngine2 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var DEBUG = typeof process !== 'undefined' && process.env && process.env.K2DEBUG;

  /* ---------- Préparation : déplacements possibles de chaque personnage ---------- */
  // puz.rooms : [{name,…}], puz.doors : [[a,b]], puz.secret : [{a,b,who:[s…]}], puz.locked : [[a,b]] (sous-ensemble de doors)
  // puz.dark : créneau dans le noir (ou absent) ; pendant la panne on peut traverser deux pièces.
  function prep(puz) {
    if (puz._p) return puz._p;
    var NR = puz.rooms.length, NE = nEnt(puz), e, r;
    var adj = [];
    for (e = 0; e < NE; e++) {
      var A = [];
      for (r = 0; r < NR; r++) A.push([r]);
      puz.doors.forEach(function (d) { A[d[0]].push(d[1]); A[d[1]].push(d[0]); });
      (puz.secret || []).forEach(function (p) {
        if (p.who.indexOf(e) >= 0) { A[p.a].push(p.b); A[p.b].push(p.a); }
      });
      adj.push(A);
    }
    // deux pas (pendant la panne)
    var adj2 = adj.map(function (A) {
      return A.map(function (L) {
        var set = {};
        L.forEach(function (x) { A[x].forEach(function (y) { set[y] = 1; }); });
        return Object.keys(set).map(Number);
      });
    });
    var lockedSet = {};
    (puz.locked || []).forEach(function (d) { lockedSet[d[0] + '-' + d[1]] = lockedSet[d[1] + '-' + d[0]] = 1; });
    puz._p = { NR: NR, NE: NE, adj: adj, adj2: adj2, locked: lockedSet };
    Object.defineProperty(puz, '_p', { enumerable: false, value: puz._p, writable: true });
    return puz._p;
  }
  function nEnt(puz) { return puz.S + (puz.victim ? 1 : 0); }
  function isDarkStep(puz, t) { return false; } // la panne n'accélère personne : elle empêche seulement de témoigner

  /* ---------- Évaluation d'un constat sur une solution complète ---------- */
  // P[e][t] = pièce
  function holds(puz, c, P) {
    var t, e, n, S = puz.S, NE = nEnt(puz);
    switch (c.type) {
      case 'at': return P[c.s][c.t] === c.r;
      case 'notAt': return P[c.s][c.t] !== c.r;
      case 'together': return P[c.a][c.t] === P[c.b][c.t];
      case 'apart': return P[c.a][c.t] !== P[c.b][c.t];
      case 'stay': return P[c.s][c.t] === P[c.s][c.t + 1];
      case 'move': return P[c.s][c.t] !== P[c.s][c.t + 1];
      case 'moves': n = 0; for (t = 0; t < puz.T - 1; t++) if (P[c.s][t] !== P[c.s][t + 1]) n++; return n === c.n;
      case 'never': for (t = 0; t < puz.T; t++) if (P[c.s][t] === c.r) return false; return true;
      case 'visited': for (t = 0; t < puz.T; t++) if (P[c.s][t] === c.r) return true; return false;
      case 'alone': for (e = 0; e < NE; e++) if (e !== c.s && P[e][c.t] === P[c.s][c.t]) return false; return true;
      case 'empty': for (e = 0; e < NE; e++) if (P[e][c.t] === c.r) return false; return true;
      case 'oneOf': return P[c.a][c.t] === c.r || P[c.b][c.t] === c.r;
      case 'neither': return P[c.a][c.t] !== c.r && P[c.b][c.t] !== c.r;
    }
    throw new Error('constat inconnu : ' + c.type);
  }
  var NEG = { at: 'notAt', notAt: 'at', together: 'apart', apart: 'together', stay: 'move', move: 'stay', never: 'visited', visited: 'never', oneOf: 'neither', neither: 'oneOf' };
  function neg(c) {
    var o = {}; for (var k in c) o[k] = c[k];
    if (NEG[c.type]) { o.type = NEG[c.type]; return o; }
    if (c.type === 'empty') { o.type = 'notEmpty'; return o; }
    if (c.type === 'notEmpty') { o.type = 'empty'; return o; }
    if (c.type === 'alone') { o.type = 'notAlone'; return o; }
    if (c.type === 'notAlone') { o.type = 'alone'; return o; }
    if (c.type === 'moves') { o.type = 'notMoves'; return o; }
    if (c.type === 'notMoves') { o.type = 'moves'; return o; }
    throw new Error('négation impossible : ' + c.type);
  }
  function holdsX(puz, c, P) {
    if (c.type === 'notEmpty') return !holds(puz, { type: 'empty', t: c.t, r: c.r }, P);
    if (c.type === 'notAlone') return !holds(puz, { type: 'alone', s: c.s, t: c.t }, P);
    if (c.type === 'notMoves') return !holds(puz, { type: 'moves', s: c.s, n: c.n }, P);
    return holds(puz, c, P);
  }
  // personnages concernés par un constat (pour savoir quand le vérifier)
  function ents(puz, c) {
    switch (c.type) {
      case 'together': case 'apart': case 'oneOf': case 'neither': return [c.a, c.b];
      case 'alone': case 'notAlone': case 'empty': case 'notEmpty': return null; // tout le monde
      default: return [c.s];
    }
  }

  /* ---------- Règles globales : crime, arme, clé ---------- */
  // Renvoie { culprit, t } si la solution respecte la règle du crime, sinon null.
  function crimeOf(puz, P) {
    var S = puz.S, cr = puz.crime, s, n, who, t;
    if (cr.times) { // « bon moment » : une seule heure possible où un seul suspect est dans la pièce
      var found = null;
      for (var i = 0; i < cr.times.length; i++) {
        t = cr.times[i]; n = 0; who = -1;
        for (s = 0; s < S; s++) if (P[s][t] === cr.room) { n++; who = s; }
        if (n === 1) { if (found) return null; found = { culprit: who, t: t }; }
      }
      return found;
    }
    t = cr.t;
    if (puz.victim && P[S][t] !== cr.room) return null;
    var here = [];
    for (s = 0; s < S; s++) if (P[s][t] === cr.room) here.push(s);
    if (puz.weapon) { // plusieurs peuvent être là : seul celui qui a pu prendre l'arme est coupable
      var W = puz.weapon, ok = here.filter(function (s) {
        for (var u = W.after + 1; u < t; u++) if (P[s][u] === W.room) return true;
        return false;
      });
      return ok.length === 1 ? { culprit: ok[0], t: t } : null;
    }
    return here.length === 1 ? { culprit: here[0], t: t } : null;
  }
  // Clé : un seul porteur, qui peut la donner à quelqu'un dans la même pièce ; une porte fermée ne se franchit
  // qu'avec la clé, ou en accompagnant son porteur (même départ, même arrivée).
  function keyOk(puz, P) {
    if (!puz.locked || !puz.locked.length) return true;
    var pp = prep(puz), NE = nEnt(puz), T = puz.T;
    var cur = {}; cur[puz.key.start] = 1;
    for (var t = 0; t < T - 1; t++) {
      // porteurs possibles après remise de la clé à l'instant t
      var after = {};
      Object.keys(cur).forEach(function (h) { h = +h; for (var e = 0; e < puz.S; e++) if (P[e][t] === P[h][t]) after[e] = 1; });
      var next = {};
      Object.keys(after).forEach(function (h) {
        h = +h;
        for (var e = 0; e < NE; e++) {
          var a = P[e][t], b = P[e][t + 1];
          if (a !== b && crossesLocked(puz, pp, e, a, b, t)) {
            if (e === h) continue;
            if (P[h][t] === a && P[h][t + 1] === b) continue;
            return; // ce porteur ne permet pas ce passage
          }
        }
        next[h] = 1;
      });
      if (!Object.keys(next).length) return false;
      cur = next;
    }
    return true;
  }
  // un déplacement a -> b passe-t-il forcément par une porte fermée ? (pendant la panne : chemin de deux pas)
  function crossesLocked(puz, pp, e, a, b, t) {
    if (pp.adj[e][a].indexOf(b) >= 0) return !!pp.locked[a + '-' + b];
    // deux pas : fermé seulement si toutes les façons de passer utilisent une porte fermée
    var ok = pp.adj[e][a].some(function (m) { return m !== a && pp.adj[e][m].indexOf(b) >= 0 && !pp.locked[a + '-' + m] && !pp.locked[m + '-' + b]; });
    return !ok;
  }

  /* ---------- Solveur ---------- */
  // Énumère les trajets de chaque personnage compatibles avec les constats qui ne concernent que lui,
  // puis combine les personnages un par un en vérifiant les constats à plusieurs.
  function enumPaths(puz, e, unary) {
    var pp = prep(puz), T = puz.T, out = [], path = [];
    var fixed = fixedFor(puz, e);
    function rec(t) {
      if (t === T) { if (unary.every(function (c) { return holdsX(puz, c, fakeP(e, path)); })) out.push(path.slice()); return; }
      var opts = t === 0 ? range(pp.NR) : (isDarkStep(puz, t - 1) ? pp.adj2[e][path[t - 1]] : pp.adj[e][path[t - 1]]);
      for (var i = 0; i < opts.length; i++) {
        var r = opts[i];
        if (fixed[t] != null && fixed[t] !== r) continue;
        path[t] = r;
        if (earlyFail(puz, unary, e, path, t)) continue;
        rec(t + 1);
      }
    }
    rec(0);
    return out;
  }
  // victime : dans la pièce du crime à l'heure du crime, puis immobile (morte ou assommée)
  function fixedFor(puz, e) {
    var f = [];
    if (puz.victim && e === puz.S && puz.crime.t != null) for (var t = puz.crime.t; t < puz.T; t++) f[t] = puz.crime.room;
    return f;
  }
  function earlyFail(puz, unary, e, path, t) {
    for (var i = 0; i < unary.length; i++) {
      var c = unary[i];
      if ((c.type === 'at' && c.t === t && path[t] !== c.r) || (c.type === 'notAt' && c.t === t && path[t] === c.r) ||
          (c.type === 'never' && path[t] === c.r) || (c.type === 'stay' && c.t === t - 1 && path[t] !== path[t - 1]) ||
          (c.type === 'move' && c.t === t - 1 && path[t] === path[t - 1])) return true;
    }
    return false;
  }
  function took(W, path, t) { for (var u = W.after + 1; u < t; u++) if (path[u] === W.room) return true; return false; }
  function fakeP(e, path) { var P = []; P[e] = path; return P; }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  // Solutions d'un jeu de constats tous vrais. Renvoie { count, sols:[{P, culprit, t}], aborted, nodes }.
  // Recherche avec filtrage en avant : à chaque trajet placé, on retire aussitôt des autres personnages
  // les trajets devenus impossibles, et on place d'abord celui qui a le moins de choix.
  function solveFacts(puz, clues, limit, cap, culpritIn) {
    limit = limit || 2; cap = cap || 2e6;
    var NE = nEnt(puz), S = puz.S, cr = puz.crime, T = puz.T, e, k;
    var unary = [], pair = [], global = [];
    for (e = 0; e < NE; e++) unary.push([]);
    clues.forEach(function (c) {
      if (c.type === 'empty') { for (k = 0; k < NE; k++) unary[k].push({ type: 'notAt', s: k, t: c.t, r: c.r }); return; }
      if (c.type === 'alone') { for (k = 0; k < NE; k++) if (k !== c.s) pair.push({ type: 'apart', a: c.s, b: k, t: c.t }); return; }
      var E = ents(puz, c);
      if (!E) global.push(c); else if (E.length === 1 || E[0] === E[1]) unary[E[0]].push(c); else pair.push(c);
    });
    var simple = !cr.times && !puz.weapon;
    var paths = [];
    for (e = 0; e < NE; e++) {
      var L = enumPaths(puz, e, unary[e]);
      // un suspect sincère (hors menteurs) ne peut pas être le coupable : il n'était pas sur les lieux
      if (culpritIn && e < S && culpritIn.indexOf(e) < 0 && simple) L = L.filter(function (p) { return p[cr.t] !== cr.room; });
      if (!L.length) return { count: 0, sols: [], aborted: false, nodes: 0 };
      paths.push(L);
    }
    // contraintes entre deux personnages
    var byPair = {};
    pair.forEach(function (c) {
      var a = c.a, b = c.b, key = Math.min(a, b) + ',' + Math.max(a, b);
      (byPair[key] = byPair[key] || []).push(c);
    });
    function pairOk(e1, p1, e2, p2) {
      var key = Math.min(e1, e2) + ',' + Math.max(e1, e2), L = byPair[key];
      if (L) { var P = []; P[e1] = p1; P[e2] = p2; for (var i = 0; i < L.length; i++) if (!holdsX(puz, L[i], P)) return false; }
      if (!cr.times && e1 < S && e2 < S) {
        var h1 = p1[cr.t] === cr.room, h2 = p2[cr.t] === cr.room;
        if (simple && h1 && h2) return false; // un seul sur les lieux
        if (puz.weapon && h1 && h2 && took(puz.weapon, p1, cr.t) && took(puz.weapon, p2, cr.t)) return false;
      }
      return true;
    }
    function culCapable(e, p) {
      if (e >= S || cr.times) return false;
      if (culpritIn && culpritIn.indexOf(e) < 0) return false;
      return p[cr.t] === cr.room && (!puz.weapon || took(puz.weapon, p, cr.t));
    }
    var sols = [], nodes = 0, aborted = false, seen = {}, P = [];
    var capCache = new WeakMap();
    function anyCul(f, arr) {
      var v = capCache.get(arr); if (v !== undefined) return v;
      v = false; for (var z = 0; z < arr.length; z++) if (culCapable(f, arr[z])) { v = true; break; }
      capCache.set(arr, v); return v;
    }
    function hasCul(P, e, p, rest, nd) {
      for (var a2 = 0; a2 < NE; a2++) if (P[a2] && culCapable(a2, P[a2])) return true;
      if (culCapable(e, p)) return true;
      for (var q = 0; q < rest.length; q++) if (anyCul(rest[q], nd[rest[q]])) return true;
      return false;
    }
    function rec(dom, left) {
      if (aborted || sols.length >= limit) return;
      if (!left.length) {
        for (var g = 0; g < global.length; g++) if (!holdsX(puz, global[g], P)) return;
        var x = crimeOf(puz, P); if (!x) return;
        if (culpritIn && culpritIn.indexOf(x.culprit) < 0) return;
        if (!keyOk(puz, P)) return;
        var key = P.map(function (p) { return puz.dark == null ? p.join('') : p.filter(function (_, t) { return t !== puz.dark; }).join(''); }).join('|') + '#' + x.culprit;
        if (seen[key]) return; seen[key] = 1;
        sols.push({ P: P.map(function (p) { return p.slice(); }), culprit: x.culprit, t: x.t });
        return;
      }
      // le personnage le plus contraint d'abord
      var bi = 0;
      for (var i = 1; i < left.length; i++) if (dom[left[i]].length < dom[left[bi]].length) bi = i;
      var e = left[bi], rest = left.slice(0, bi).concat(left.slice(bi + 1));
      var D = dom[e];
      for (var j = 0; j < D.length; j++) {
        if (++nodes > cap) { aborted = true; return; }
        var p = D[j], nd = dom.slice(), ok = true;
        var here = !cr.times && e < S && p[cr.t] === cr.room && (simple || took(puz.weapon, p, cr.t));
        for (var q = 0; q < rest.length && ok; q++) {
          var f = rest[q];
          if (!byPair[Math.min(e, f) + ',' + Math.max(e, f)] && !(here && f < S)) continue; // rien ne les lie : on garde tout
          var src = dom[f], keep = [];
          for (var z = 0; z < src.length; z++) if (pairOk(e, p, f, src[z])) keep.push(src[z]);
          if (!keep.length) ok = false; else nd[f] = keep;
        }
        if (!ok) continue;
        // il faut qu'un coupable reste possible
        if (!cr.times && !hasCul(P, e, p, rest, nd)) continue;
        if (false) {
          var has = false;
          for (var a2 = 0; a2 < NE && !has; a2++) if (P[a2] && culCapable(a2, P[a2])) has = true;
          if (!has && culCapable(e, p)) has = true;
          for (q = 0; q < rest.length && !has; q++) { var f2 = rest[q]; for (z = 0; z < nd[f2].length; z++) if (culCapable(f2, nd[f2][z])) { has = true; break; } }
          if (!has) continue;
        }
        P[e] = p;
        rec(nd, rest);
        P[e] = undefined;
        if (aborted || sols.length >= limit) return;
      }
    }
    var _t0 = Date.now();
    rec(paths, range(NE));
    if (DEBUG && Date.now() - _t0 > 1500) console.error('  solve lent', Date.now() - _t0, 'ms, noeuds', nodes, 'limite', limit, 'tailles', paths.map(function (p) { return p.length; }).join('/'), 'indices', clues.map(function (c) { return c.type; }).join(','));
    return { count: sols.length, sols: sols, aborted: aborted, nodes: nodes, sizes: paths.map(function (p) { return p.length; }) };
  }

  // Avec menteurs : chaque suspect « menteur » dit faux dans tous ses témoignages. Le coupable ment toujours ;
  // puz.liars (1 ou 2) menteurs au total. Une solution = (grille, ensemble de menteurs).
  function solve(puz, limit, cap) {
    limit = limit || 2;
    if (!puz.liars) return solveFacts(puz, puz.clues, limit, cap);
    var speakers = {}; puz.clues.forEach(function (c) { if (c.by != null) speakers[c.by] = 1; });
    var cand = range(puz.S), sets = [];
    if (puz.liars === 1) cand.forEach(function (a) { sets.push([a]); });
    else for (var a = 0; a < puz.S; a++) for (var b = a + 1; b < puz.S; b++) sets.push([a, b]);
    var all = [], aborted = false, nodes = 0;
    for (var i = 0; i < sets.length && all.length < limit; i++) {
      var L = sets[i];
      var cl = puz.clues.map(function (c) { return c.by != null && L.indexOf(c.by) >= 0 ? neg(c) : c; });
      var r = solveFacts(puz, cl, limit - all.length, cap, L); nodes += r.nodes || 0;
      if (r.aborted) aborted = true;
      r.sols.forEach(function (s) { s.liars = L; all.push(s); });
    }
    return { count: all.length, sols: all, aborted: aborted, nodes: nodes };
  }

  /* ---------- Règle d'or : aucun lieu donné directement à l'heure du crime ---------- */
  function crimeTimes(puz) { return puz.crime.times ? puz.crime.times : [puz.crime.t]; }
  function leaks(puz, c) {
    var ts = crimeTimes(puz);
    var posTypes = { at: 1, oneOf: 1, notAt: 0 };
    if (ts.indexOf(c.t) < 0) return false;
    if (c.type === 'at' || c.type === 'oneOf') return true;
    // avec la victime à l'heure du crime = donner le lieu
    if ((c.type === 'together') && puz.victim && (c.a === puz.S || c.b === puz.S)) return true;
    // « bon moment » : rien sur la pièce du crime aux heures possibles
    if (puz.crime.times && (c.type === 'empty' || c.type === 'notAt') && c.r === puz.crime.room) return true;
    return false;
  }
  function touchesDark(puz, c) {
    if (puz.dark == null) return false;
    if (c.t === puz.dark) return true;
    if ((c.type === 'stay' || c.type === 'move') && (c.t === puz.dark - 1)) return true;
    if (c.type === 'moves') return true; // les déplacements dans le noir ne sont connus de personne
    return false;
  }

  /* ---------- Génération ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(R, a) { return a[Math.floor(R() * a.length)]; }
  function shuffle(R, a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

  function randomPath(R, puz, e, P) {
    var pp = prep(puz), T = puz.T, fixed = fixedFor(puz, e), path = [];
    for (var tries = 0; tries < 200; tries++) {
      path = []; var ok = true;
      for (var t = 0; t < T && ok; t++) {
        var opts = t === 0 ? range(pp.NR) : (isDarkStep(puz, t - 1) ? pp.adj2[e][path[t - 1]] : pp.adj[e][path[t - 1]]);
        if (fixed[t] != null) { if (opts.indexOf(fixed[t]) < 0) ok = false; else path[t] = fixed[t]; continue; }
        // on reste parfois sur place (stay biaisé), on préfère bouger
        var stay = R() < 0.35;
        path[t] = stay && t > 0 ? path[t - 1] : pick(R, opts);
      }
      if (ok) return path;
    }
    return null;
  }

  // Constats vrais candidats
  function pool(puz, P) {
    var S = puz.S, NE = nEnt(puz), T = puz.T, NR = puz.rooms.length, L = [], s, t, r, a, b;
    var V = puz.victim ? S : -1;
    for (s = 0; s < NE; s++) {
      for (t = 0; t < T; t++) {
        if (s === V && t >= puz.crime.t) continue;
        L.push({ type: 'at', s: s, t: t, r: P[s][t] });
        for (r = 0; r < NR; r++) if (r !== P[s][t]) L.push({ type: 'notAt', s: s, t: t, r: r });
        if (t < T - 1 && !(s === V && t >= puz.crime.t - 1)) L.push({ type: P[s][t] === P[s][t + 1] ? 'stay' : 'move', s: s, t: t });
      }
      if (s === V) continue;
      for (r = 0; r < NR; r++) L.push({ type: P[s].indexOf(r) >= 0 ? 'visited' : 'never', s: s, r: r });
      var n = 0; for (t = 0; t < T - 1; t++) if (P[s][t] !== P[s][t + 1]) n++;
      L.push({ type: 'moves', s: s, n: n });
    }
    for (t = 0; t < T; t++) {
      for (a = 0; a < NE; a++) for (b = a + 1; b < NE; b++) {
        if ((a === V || b === V) && t >= puz.crime.t) continue;
        L.push({ type: P[a][t] === P[b][t] ? 'together' : 'apart', a: a, b: b, t: t });
      }
      for (r = 0; r < NR; r++) {
        var occ = 0; for (s = 0; s < NE; s++) if (P[s][t] === r) occ++;
        if (!occ) L.push({ type: 'empty', t: t, r: r });
      }
      for (s = 0; s < S; s++) if (holds(puz, { type: 'alone', s: s, t: t }, P)) L.push({ type: 'alone', s: s, t: t });
      if (puz.twins) {
        var A = puz.twins[0], B = puz.twins[1];
        for (r = 0; r < NR; r++) if (P[A][t] === r || P[B][t] === r) if (P[A][t] !== P[B][t]) L.push({ type: 'oneOf', a: A, b: B, t: t, r: r, twins: 1 });
      }
    }
    return L.filter(function (c) { return !leaks(puz, c) && !touchesDark(puz, c); });
  }

  var W_DEFAULT = { at: 1, notAt: 0.6, together: 2, apart: 1.3, stay: 1.2, move: 1.2, moves: 1.5, never: 1.5, visited: 1.5, alone: 1.3, empty: 1.4, oneOf: 1.2 };
  var MAX_PER_TYPE = { oneOf: 2, neither: 2 };

  // spec : { place:{rooms,doors,secret,locked,key,t0}, S, T, victim:{name,kind:'mort'|'assomme'}, weapon:{room,after},
  //          dark, crime:{room?,t?,times?}, culprit (index voulu), liars, twins:[a,b], speakers:[s…] (témoins possibles),
  //          w (poids), maxClues, minClues, require:{type:n} (constats à inclure de force), seed, tries }
  var STATS = {};
  function resetStats() { STATS = { liar: 0, toomany: 0, nouniq: 0, count: 0, crime: 0, cul: 0, key: 0, built: 0 }; }
  resetStats();
  function generate(spec) {
    resetStats();
    var R = rng(spec.seed || 1), best = null;
    for (var attempt = 0; attempt < (spec.tries || 400); attempt++) {
      var puz = base(spec);
      var P = [], ok = true, NE = nEnt(puz);
      // heure et lieu du crime
      if (spec.crime && spec.crime.times) puz.crime = { room: spec.crime.room != null ? spec.crime.room : Math.floor(R() * puz.rooms.length), times: spec.crime.times.slice() };
      else puz.crime = { room: spec.crime && spec.crime.room != null ? spec.crime.room : Math.floor(R() * puz.rooms.length), t: spec.crime && spec.crime.t != null ? spec.crime.t : (puz.dark != null ? puz.dark : 2 + Math.floor(R() * (puz.T - 3))) };
      if (puz.weapon && puz.weapon.room === puz.crime.room) continue;
      for (var e = 0; e < NE && ok; e++) { P[e] = randomPath(R, puz, e, P); if (!P[e]) ok = false; }
      if (!ok) continue;
      if (spec.culprit != null) force(R, puz, P, spec.culprit);
      var x = crimeOf(puz, P); if (!x) { STATS.crime++; continue; }
      if (spec.culprit != null && x.culprit !== spec.culprit) { STATS.cul++; continue; }
      if (!keyOk(puz, P)) { STATS.key++; continue; }
      if (puz.weapon && !weaponInteresting(puz, P, x)) continue;
      if (puz.secret && puz.secret.length && !secretUsed(puz, P)) continue;
      STATS.built++;
      if (DEBUG) console.error('  essai', attempt, 'coupable', x.culprit, 't', x.t);
      var res = build(R, puz, P, x, spec);
      if (res && (!best || res.score > best.score)) { best = res; if (!spec.target || Math.abs(res.puz.difficulty - spec.target) <= (spec.tol || 3)) break; }
    }
    return best;
  }
  function base(spec) {
    var pl = spec.place;
    var puz = { S: spec.S, T: spec.T, rooms: pl.rooms, doors: pl.doors, secret: pl.secret || [], locked: pl.locked || [],
      key: pl.key || null, t0: pl.t0 != null ? pl.t0 : 20, victim: spec.victim || null, weapon: spec.weapon || null,
      dark: spec.dark != null ? spec.dark : null, liars: spec.liars || 0, twins: spec.twins || null, clues: [] };
    return puz;
  }
  // essaie d'amener le coupable voulu seul sur les lieux (petit coup de pouce au hasard)
  function force(R, puz, P, cul) {
    var cr = puz.crime, t = cr.times ? pick(R, cr.times) : cr.t;
    var pp = prep(puz);
    // le coupable rejoint la pièce : on recolle un trajet qui passe par (t, room)
    for (var k = 0; k < 60; k++) {
      var p = randomPath(R, puz, cul, P);
      if (p && p[t] === cr.room) { P[cul] = p; break; }
    }
    // les autres évitent la pièce à cet instant (sauf avec l'arme : un autre peut être là)
    for (var s = 0; s < puz.S; s++) if (s !== cul && P[s][t] === cr.room && !(puz.weapon && R() < 0.5)) {
      for (var j = 0; j < 60; j++) { var q = randomPath(R, puz, s, P); if (q && q[t] !== cr.room) { P[s] = q; break; } }
    }
    if (cr.times) { // aux autres heures possibles : vide ou au moins deux
      cr.times.forEach(function (u) {
        if (u === t) return;
        var here = []; for (var s = 0; s < puz.S; s++) if (P[s][u] === cr.room) here.push(s);
        if (here.length === 1) {
          var o = pick(R, range(puz.S).filter(function (z) { return z !== here[0] && z !== cul; }));
          for (var j = 0; j < 80; j++) { var q = randomPath(R, puz, o, P); if (q && q[u] === cr.room && q[t] !== cr.room) { P[o] = q; break; } }
        }
      });
    }
  }
  function weaponInteresting(puz, P, x) {
    // au moins deux suspects avec la victime, sinon l'arme ne sert à rien
    var n = 0; for (var s = 0; s < puz.S; s++) if (P[s][x.t] === puz.crime.room) n++;
    return n >= 2;
  }
  function secretUsed(puz, P) {
    return puz.secret.some(function (p) {
      return p.who.some(function (s) {
        for (var t = 0; t < puz.T - 1; t++) { var a = P[s][t], b = P[s][t + 1]; if ((a === p.a && b === p.b) || (a === p.b && b === p.a)) return true; }
        return false;
      });
    });
  }

  // Choix des constats, façon « détective » : on cherche quelques fausses solutions encore possibles,
  // et on ajoute l'indice vrai qui en élimine le plus (avec un peu de hasard et les poids du chapitre).
  function greedy(R, puz, clues, cands, w, spec, maxAdd) {
    var cap = spec.cap || 400000;
    for (var step = 0; step < maxAdd; step++) {
      var z = clone(puz); z.clues = clues;
      var r = solve(z, 12, cap);
      if (r.aborted) { STATS.gAbort = (STATS.gAbort || 0) + 1; return null; }
      if (r.count === 1) return clues;
      if (r.count === 0) { STATS.gZero = (STATS.gZero || 0) + 1; return null; }
      var alts = r.sols;
      var best = null, bs = -1;
      var cnt = {}; clues.forEach(function (c) { cnt[c.type] = (cnt[c.type] || 0) + 1; });
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i], n = 0;
        if (MAX_PER_TYPE[c.type] && (cnt[c.type] || 0) >= MAX_PER_TYPE[c.type]) continue;
        for (var j = 0; j < alts.length; j++) if (!eliminatedOk(z, c, alts[j])) n++;
        if (!n) continue;
        var sc = n * w[c.type] * (0.6 + R() * 0.8);
        if (sc > bs) { bs = sc; best = i; }
      }
      if (best == null) { STATS.gNone = (STATS.gNone || 0) + 1; return null; }
      clues = clues.concat([cands[best]]); cands = cands.slice(0, best).concat(cands.slice(best + 1));
    }
    return null;
  }
  // un fait c, vrai dans la vraie solution, est-il compatible avec la fausse solution alt ?
  function eliminatedOk(puz, c, alt) {
    if (!holdsX(puz, c, alt.P)) return false;
    return true;
  }
  function prune(puz, clues, keep, spec) {
    var cap = spec.cap || 400000;
    for (var j = clues.length - 1; j >= 0; j--) {
      if (keep(clues[j])) continue;
      var z = clone(puz); z.clues = clues.slice(0, j).concat(clues.slice(j + 1));
      var rr = solve(z, 2, cap);
      if (rr.count === 1 && !rr.aborted) clues = z.clues;
    }
    return clues;
  }
  function weights(spec) { var w = {}, k; for (k in W_DEFAULT) w[k] = W_DEFAULT[k]; for (k in (spec.w || {})) w[k] = spec.w[k]; return w; }

  function build(R, puz, P, x, spec) {
    var w = weights(spec);
    var L = shuffle(R, pool(puz, P).filter(function (c) { return w[c.type] > 0; }));
    var chosen = [];
    (spec.require || []).forEach(function (rq) {
      var c = L.filter(function (c) { return c.type === rq.type && (!rq.where || rq.where(c, puz, P)); })[0];
      if (c) { chosen.push(c); L.splice(L.indexOf(c), 1); }
    });
    var nReq = chosen.length;
    var reqSet = chosen.slice();
    var out = clone(puz);
    if (!puz.liars) {
      chosen = greedy(R, puz, chosen, L, w, spec, 60);
      if (!chosen) { STATS.nouniq++; return null; }
      chosen = prune(puz, chosen, function (c) { return reqSet.indexOf(c) >= 0; }, spec);
      out.clues = chosen;
    } else {
      out = assignLiars(R, puz, P, x, spec, chosen, L, w);
      if (!out) { STATS.liar++; return null; }
    }
    if (out.clues.length > (spec.maxClues || 30) || out.clues.length < (spec.minClues || 0)) { STATS.count++; return null; }
    var fin = solve(out, 2, spec.cap || 400000);
    if (fin.count !== 1 || fin.aborted) return null;
    out.solution = P.map(function (p) { return p.slice(); });
    out.culprit = x.culprit; out.crimeT = x.t;
    if (puz.liars) out.liarSet = fin.sols[0].liars;
    out.difficulty = difficulty(out);
    var target = spec.target || 0;
    return { puz: out, score: (target ? -Math.abs(out.difficulty - target) : 0) - out.clues.length * 0.05 };
  }
  // Menteurs : le coupable (et un complice si liars = 2) dit le contraire de la vérité dans tous ses témoignages.
  // On choisit d'abord des témoignages (vrais ou mensongers selon qui parle), puis on complète par des faits.
  function assignLiars(R, puz, P, x, spec, req, L, w) {
    var liars = [x.culprit];
    if (puz.liars === 2) {
      var others = range(puz.S).filter(function (s) { return s !== x.culprit; });
      liars.push(spec.accomplice != null ? spec.accomplice : pick(R, others));
    }
    var perSpeaker = spec.testimonies || 2;
    var testi = [];
    // chaque suspect fait quelques déclarations sur ce qu'il a vu (vraies si innocent, fausses si menteur)
    for (var s = 0; s < puz.S; s++) {
      var mine = L.filter(function (c) { return (c.s === s || c.a === s || c.b === s) && c.type !== 'moves' && c.type !== 'notAt'; });
      shuffle(R, mine);
      var k = 0;
      for (var i = 0; i < mine.length && k < perSpeaker; i++) {
        var c = {}; for (var q in mine[i]) c[q] = mine[i][q]; c.by = s;
        if (liars.indexOf(s) >= 0) {
          var n; try { n = neg(c); } catch (e) { continue; }
          n.by = s;
          if (leaks(puz, n) || touchesDark(puz, n)) continue;
          testi.push(n);
        } else testi.push(c);
        k++;
      }
    }
    var used = testi.map(strip).map(JSON.stringify);
    var facts = L.filter(function (c) { return used.indexOf(JSON.stringify(strip(c))) < 0; });
    var clues = greedyLiar(R, puz, req.concat(testi), facts, w, spec, P, liars, 50);
    if (!clues) return null;
    var out = clone(puz);
    out.clues = prune(puz, clues, function (c) { return c.by != null || req.indexOf(c) >= 0; }, spec);
    return out;
  }
  function greedyLiar(R, puz, clues, cands, w, spec, P, liars, maxAdd) {
    var cap = spec.cap || 400000;
    for (var step = 0; step < maxAdd; step++) {
      var z = clone(puz); z.clues = clues;
      var r = solve(z, 12, cap);
      if (r.aborted) { STATS.lAbort = (STATS.lAbort || 0) + 1; return null; }
      var alts = r.sols.filter(function (s) { return !(sameP(s.P, P) && sameL(s.liars, liars)); });
      if (r.count === 1 && !alts.length) return clues;
      if (r.count === 0) { STATS.lZero = (STATS.lZero || 0) + 1; STATS.bad = clues.filter(function (c) { var d = c.by != null && liars.indexOf(c.by) >= 0 ? neg(c) : c; return !holdsX(z, d, P); }).map(JSON.stringify); STATS.cr = JSON.stringify(crimeOf(z, P)); STATS.z = JSON.stringify({ clues: z.clues, crime: z.crime, P: P, liars: z.liars, S: z.S, T: z.T }); return null; }
      var best = null, bs = -1;
      var cnt = {}; clues.forEach(function (c) { cnt[c.type] = (cnt[c.type] || 0) + 1; });
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i], n = 0;
        if (MAX_PER_TYPE[c.type] && (cnt[c.type] || 0) >= MAX_PER_TYPE[c.type]) continue;
        for (var j = 0; j < alts.length; j++) if (!holdsX(z, c, alts[j].P)) n++;
        if (!n) continue;
        var sc = n * w[c.type] * (0.6 + R() * 0.8);
        if (sc > bs) { bs = sc; best = i; }
      }
      if (best == null) { STATS.lNone = (STATS.lNone || 0) + 1; STATS.lAlts = alts.length; return null; }
      clues = clues.concat([cands[best]]); cands = cands.slice(0, best).concat(cands.slice(best + 1));
    }
    STATS.lMax = (STATS.lMax || 0) + 1; return null;
  }
  function sameP(A, B) { for (var e = 0; e < A.length; e++) if (A[e].join() !== B[e].join()) return false; return true; }
  function sameL(a, b) { return a.slice().sort().join() === b.slice().sort().join(); }
  function same(a, b) { return JSON.stringify(strip(a)) === JSON.stringify(strip(b)); }
  function strip(c) { var o = {}; Object.keys(c).sort().forEach(function (k) { if (k !== 'by') o[k] = c[k]; }); return o; }
  function clone(p) {
    var o = {}; for (var k in p) if (k !== '_p') o[k] = p[k];
    o.clues = (p.clues || []).slice(); return o;
  }

  // Difficulté approchée : nombre de constats + difficulté de la recherche une fois les trajets filtrés
  function difficulty(puz) {
    var r = solve(puz, 2, 2e6);
    return Math.round((puz.clues.length * 1 + Math.log2(1 + (r.nodes || 0)) * 2 + (puz.liars || 0) * 4) * 10) / 10;
  }

  /* ---------- Textes ---------- */
  function TL(puz, t, en) {
    var m = puz.t0 * 60 + t * 30, h = Math.floor(m / 60) % 24, mm = m % 60;
    if (en) return ((h + 11) % 12 + 1) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h >= 12 ? ' pm' : ' am');
    return h + ' h' + (mm ? ' ' + (mm < 10 ? '0' : '') + mm : '');
  }
  return {
    prep: prep, holds: holdsX, neg: neg, solve: solve, solveFacts: solveFacts, crimeOf: crimeOf, keyOk: keyOk,
    leaks: leaks, touchesDark: touchesDark, pool: pool, generate: generate, difficulty: difficulty, timeLabel: TL,
    nEnt: nEnt, rng: rng, stats: function () { return STATS; }
  };
});
