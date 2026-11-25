
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KioukanEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Décors ---------- */
  var SCENES = {
    manoir: {
      label: 'Manoir', unit: 'pièce', t0: 19,
      rooms: [
        { name: 'Hall', short: 'Hall', the: 'le hall' },
        { name: 'Salon', short: 'Salon', the: 'le salon' },
        { name: 'Cuisine', short: 'Cuisine', the: 'la cuisine' },
        { name: 'Bibliothèque', short: 'Biblio.', the: 'la bibliothèque' },
        { name: 'Bureau', short: 'Bureau', the: 'le bureau' },
        { name: 'Cave', short: 'Cave', the: 'la cave' },
        { name: 'Jardin', short: 'Jardin', the: 'le jardin' }
      ],
      doors: [[3, 4], [3, 1], [4, 0], [1, 0], [0, 2], [2, 5], [0, 6], [2, 6]],
      suspects: [
        { name: 'Mme Vernet', short: 'Vernet', role: 'gouvernante', f: true },
        { name: 'Dr Aubry', short: 'Aubry', role: 'médecin', f: false },
        { name: 'Lucas', short: 'Lucas', role: 'neveu', f: false },
        { name: 'Colonel Marchal', short: 'Marchal', role: 'militaire', f: false },
        { name: 'Inès', short: 'Inès', role: 'secrétaire', f: true }
      ]
    },
    train: {
      label: 'Train', unit: 'voiture', t0: 21,
      rooms: [
        { name: 'Fourgon', short: 'Fourgon', the: 'le fourgon' },
        { name: 'Wagon-lit A', short: 'Lit A', the: 'le wagon-lit A' },
        { name: 'Wagon-lit B', short: 'Lit B', the: 'le wagon-lit B' },
        { name: 'Wagon-restaurant', short: 'Resto', the: 'le wagon-restaurant' },
        { name: 'Voiture-bar', short: 'Bar', the: 'la voiture-bar' },
        { name: 'Salon-fumoir', short: 'Fumoir', the: 'le salon-fumoir' },
        { name: 'Toit du train', short: 'Toit', on: 1, the: 'le toit du train' }
      ],
      doors: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [6, 2], [6, 4]],
      suspects: [
        { name: 'Mme Delaunay', short: 'Delaunay', role: 'veuve', f: true },
        { name: 'Dr Moreau', short: 'Moreau', role: 'médecin', f: false },
        { name: 'Baron Voss', short: 'Voss', role: 'baron', f: false },
        { name: 'Roux', short: 'Roux', role: 'contrôleur', f: false },
        { name: 'Mlle Ferrand', short: 'Ferrand', role: 'cantatrice', f: true }
      ]
    },
    hotel: {
      label: 'Hôtel', unit: 'pièce', t0: 20,
      rooms: [
        { name: 'Bar', short: 'Bar', the: 'le bar' },
        { name: 'Réception', short: 'Récep.', the: 'la réception' },
        { name: 'Restaurant', short: 'Resto', the: 'le restaurant' },
        { name: 'Cuisines', short: 'Cuisines', the: 'les cuisines' },
        { name: 'Ascenseur', short: 'Ascens.', the: 'l’ascenseur' },
        { name: 'Couloir', short: 'Couloir', the: 'le couloir' },
        { name: 'Suite 12', short: 'Suite 12', the: 'la suite 12' },
        { name: 'Terrasse', short: 'Terrasse', on: 1, the: 'la terrasse' }
      ],
      doors: [[1, 0], [1, 2], [2, 3], [1, 4], [4, 5], [4, 7], [5, 6], [3, 6]],
      suspects: [
        { name: 'Mme Lefèvre', short: 'Lefèvre', role: 'gouvernante', f: true },
        { name: 'M. Costa', short: 'Costa', role: 'barman', f: false },
        { name: 'Dr Bellamy', short: 'Bellamy', role: 'médecin', f: false },
        { name: 'Mme Okafor', short: 'Okafor', role: 'cliente', f: true },
        { name: 'Chef Duval', short: 'Duval', role: 'cuisinier', f: false }
      ]
    }
  };


  /* ---------- Langue : surcouche anglaise des décors (les identifiants restent français) ---------- */
  var EN = typeof window !== 'undefined' && window.KIOUKAN_LANG === 'en';
  var IT = typeof window !== 'undefined' && window.KIOUKAN_LANG === 'it';
  /* Italien : « il salotto » -> « nel salotto » (ou « sul » pour les lieux à ciel ouvert) */
  function itIn(the, on) {
    var m = /^(il|lo|la|l’|l'|i|gli|le) ?(.*)$/.exec(the || '');
    if (!m) return (on ? 'su ' : 'in ') + the;
    var A = on ? { il: 'sul', lo: 'sullo', la: 'sulla', 'l’': 'sull’', "l'": 'sull’', i: 'sui', gli: 'sugli', le: 'sulle' } : { il: 'nel', lo: 'nello', la: 'nella', 'l’': 'nell’', "l'": 'nell’', i: 'nei', gli: 'negli', le: 'nelle' };
    var a = A[m[1]]; return a + (/’$/.test(a) ? '' : ' ') + m[2];
  }
  var IT_SCENE = {
    manoir: { label: 'Villa', unit: 'stanza', rooms: [['Atrio', 'Atrio', 'l’atrio'], ['Salotto', 'Salotto', 'il salotto'], ['Cucina', 'Cucina', 'la cucina'], ['Biblioteca', 'Biblio.', 'la biblioteca'], ['Studio', 'Studio', 'lo studio'], ['Cantina', 'Cantina', 'la cantina'], ['Giardino', 'Giardino', 'il giardino']] },
    train: { label: 'Treno', unit: 'carrozza', rooms: [['Bagagliaio', 'Bagagli', 'il bagagliaio'], ['Vagone letto A', 'Letto A', 'il vagone letto A'], ['Vagone letto B', 'Letto B', 'il vagone letto B'], ['Vagone ristorante', 'Ristor.', 'il vagone ristorante'], ['Carrozza bar', 'Bar', 'la carrozza bar'], ['Salottino fumatori', 'Fumatori', 'il salottino fumatori'], ['Tetto del treno', 'Tetto', 'il tetto del treno']] },
    hotel: { label: 'Hotel', unit: 'stanza', rooms: [['Bar', 'Bar', 'il bar'], ['Reception', 'Recep.', 'la reception'], ['Ristorante', 'Ristor.', 'il ristorante'], ['Cucine', 'Cucine', 'le cucine'], ['Ascensore', 'Ascens.', 'l’ascensore'], ['Corridoio', 'Corridoio', 'il corridoio'], ['Suite 12', 'Suite 12', 'la suite 12'], ['Terrazza', 'Terrazza', 'la terrazza']] }
  };
  var IT_ROLE = { gouvernante: 'governante', 'médecin': 'medico', neveu: 'nipote', militaire: 'militare', 'secrétaire': 'segretaria', veuve: 'vedova', baron: 'barone', 'contrôleur': 'controllore', cantatrice: 'cantante lirica', barman: 'barista', cliente: 'cliente', cuisinier: 'cuoco' };
  var EN_SCENE = {
    manoir: { label: 'Manor', unit: 'room', rooms: [['Hall','Hall','the hall'],['Lounge','Lounge','the lounge'],['Kitchen','Kitchen','the kitchen'],['Library','Library','the library'],['Study','Study','the study'],['Cellar','Cellar','the cellar'],['Garden','Garden','the garden']] },
    train: { label: 'Train', unit: 'car', rooms: [['Luggage van','Luggage','the luggage van'],['Sleeper A','Sleeper A','sleeper A'],['Sleeper B','Sleeper B','sleeper B'],['Dining car','Diner','the dining car'],['Bar car','Bar','the bar car'],['Smoking lounge','Smoking','the smoking lounge'],['Train roof','Roof','the roof of the train']] },
    hotel: { label: 'Hotel', unit: 'room', rooms: [['Bar','Bar','the bar'],['Reception','Reception','reception'],['Restaurant','Restaurant','the restaurant'],['Kitchens','Kitchens','the kitchens'],['Elevator','Elevator','the elevator'],['Corridor','Corridor','the corridor'],['Suite 12','Suite 12','suite 12'],['Terrace','Terrace','the terrace']] }
  };
  var EN_ROLE = { gouvernante: 'housekeeper', 'médecin': 'doctor', neveu: 'nephew', militaire: 'soldier', 'secrétaire': 'secretary', veuve: 'widow', baron: 'baron', 'contrôleur': 'ticket inspector', cantatrice: 'opera singer', barman: 'bartender', cliente: 'guest', cuisinier: 'cook' };
  function localize(key) {
    var sc = SCENES[key];
    if ((!EN && !IT) || !sc || sc.localized) return;
    var o = (IT ? IT_SCENE : EN_SCENE)[key];
    if (o) {
      sc.label = o.label; sc.unit = o.unit;
      sc.rooms.forEach(function (r, i) { r.id = r.name; r.name = o.rooms[i][0]; r.short = o.rooms[i][1]; r.the = o.rooms[i][2]; if (IT) r.inn = itIn(r.the, r.on); });
    }
    sc.suspects.forEach(function (p) {
      p.id = p.id || p.name; p.role = (IT ? IT_ROLE : EN_ROLE)[p.role] || p.role;
      if (window.tn) { p.name = window.tn(p.id); p.short = ((IT ? window.KIOUKAN_SHORT_IT : window.KIOUKAN_SHORT_EN) || {})[p.id] || p.name.replace(/^(Mrs|Mr|Dr|Miss|Prof\.|Colonel|Baron|Chef|Countess|Sig\.ra|Sig\.na|Sig\.|Dott\.|Colonnello|Barone) /, ''); }
    });
    sc.localized = true;
  }

  var SCENE, SCENE_KEY, ROOMS, DOORS, NR, ALL, ADJ, STEP, UNION, POP, SUSPECTS;
  function setScene(key) {
    SCENE_KEY = SCENES[key] ? key : 'manoir';
    localize(SCENE_KEY);
    SCENE = SCENES[SCENE_KEY];
    ROOMS = SCENE.rooms; DOORS = SCENE.doors; SUSPECTS = SCENE.suspects;
    NR = ROOMS.length;
    ALL = (1 << NR) - 1;
    ADJ = ROOMS.map(function () { return []; });
    DOORS.forEach(function (d) { ADJ[d[0]].push(d[1]); ADJ[d[1]].push(d[0]); });
    // STEP[r] : pièces atteignables en un créneau (rester ou passer une porte)
    STEP = ROOMS.map(function (_, r) {
      return ADJ[r].reduce(function (m, x) { return m | (1 << x); }, 1 << r);
    });
    UNION = []; POP = [];
    for (var m = 0; m <= ALL; m++) {
      var u = 0, p = 0;
      for (var r = 0; r < NR; r++) if (m & (1 << r)) { u |= STEP[r]; p++; }
      UNION[m] = u; POP[m] = p;
    }
  }
  setScene('manoir');
  function U() { return SCENE.unit; }

  var LEVELS = {
    facile: {
      label: 'Facile', S: 3, T: 5, max: 18, k: 6,
      w: { at: 3, together: 2, apart: 1, stay: 1.5, move: 1.5, moves: 2, notAt: 1, empty: 1, never: 1, visited: 1.5, alone: 1 },
      drop: ['notAt', 'never', 'empty', 'visited', 'alone', 'apart', 'stay', 'move', 'moves', 'together', 'at']
    },
    moyen: {
      label: 'Moyen', S: 4, T: 5, max: 26, k: 8, atMax: 3,
      w: { at: 1.2, together: 2, apart: 1.5, stay: 1.5, move: 1.5, moves: 2, notAt: 1, empty: 1.5, never: 1.5, visited: 1.5, alone: 1.5 },
      drop: ['notAt', 'never', 'empty', 'apart', 'visited', 'alone', 'stay', 'move', 'moves', 'together', 'at']
    },
    difficile: {
      label: 'Difficile', S: 4, T: 6, max: 31, k: 30, atMax: 1,
      w: { at: 0.5, together: 2, apart: 1.5, stay: 1.5, move: 1.5, moves: 2, notAt: 0.8, empty: 2, never: 2, visited: 2, alone: 2 },
      drop: ['at', 'notAt', 'apart', 'never', 'empty', 'visited', 'alone', 'stay', 'move', 'moves', 'together']
    }
  };

  if (EN) { LEVELS.facile.label = 'Easy'; LEVELS.moyen.label = 'Medium'; LEVELS.difficile.label = 'Hard'; }
  if (IT) { LEVELS.facile.label = 'Facile'; LEVELS.moyen.label = 'Medio'; LEVELS.difficile.label = 'Difficile'; }

  function timeLabel(t) {
    var h = (SCENE.t0 + Math.floor(t / 2)) % 24;
    if (EN) return ((h + 11) % 12 + 1) + (t % 2 ? ':30' : ':00') + (h % 24 >= 12 ? ' pm' : ' am');
    if (IT) return h + (t % 2 ? ':30' : ':00');
    return h + 'h' + (t % 2 ? '30' : '00');
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Solveur : propagation + recherche, compte jusqu'à `limit` solutions ---------- */
  function single(m) { return (m & (m - 1)) === 0; }

  // Traduit un puzzle en domaines de départ + fonction de propagation
  function compile(puz) {
    var S = puz.S, T = puz.T, N = S * T;
    var base = [];
    for (var i = 0; i < N; i++) base.push(ALL);
    var pairs = [], visits = [], counts = [];
    puz.clues.forEach(function (c) {
      var s, t, o;
      switch (c.type) {
        case 'at': base[c.s * T + c.t] &= (1 << c.r); break;
        case 'notAt': base[c.s * T + c.t] &= ~(1 << c.r); break;
        case 'never': for (t = 0; t < T; t++) base[c.s * T + t] &= ~(1 << c.r); break;
        case 'empty': for (s = 0; s < S; s++) base[s * T + c.t] &= ~(1 << c.r); break;
        case 'together': pairs.push([c.a * T + c.t, c.b * T + c.t, 0]); break;
        case 'apart': pairs.push([c.a * T + c.t, c.b * T + c.t, 1]); break;
        case 'stay': pairs.push([c.s * T + c.t, c.s * T + c.t + 1, 0]); break;
        case 'move': pairs.push([c.s * T + c.t, c.s * T + c.t + 1, 1]); break;
        case 'alone':
          for (o = 0; o < S; o++) if (o !== c.s) pairs.push([c.s * T + c.t, o * T + c.t, 1]);
          break;
        case 'visited': visits.push([c.s, 1 << c.r]); break;
        case 'moves': counts.push([c.s, c.n]); break;
      }
    });
    var crimeBit = 1 << puz.crime.room, crimeT = puz.crime.t;

    var iters = 0;
    function propagate(dom) {
      var changed = true;
      iters = 0;
      function set(i, m) {
        var nm = dom[i] & m;
        if (nm === 0) return false;
        if (nm !== dom[i]) { dom[i] = nm; changed = true; }
        return true;
      }
      var s, t, k, p, v, i;
      while (changed) {
        changed = false; iters++;
        for (s = 0; s < S; s++) {
          for (t = 0; t < T - 1; t++) {
            i = s * T + t;
            if (!set(i + 1, UNION[dom[i]])) return false;
            if (!set(i, UNION[dom[i + 1]])) return false;
          }
        }
        for (k = 0; k < pairs.length; k++) {
          p = pairs[k];
          if (p[2] === 0) {
            v = dom[p[0]] & dom[p[1]];
            if (!set(p[0], v) || !set(p[1], v)) return false;
          } else {
            if (single(dom[p[0]]) && !set(p[1], ~dom[p[0]] & ALL)) return false;
            if (single(dom[p[1]]) && !set(p[0], ~dom[p[1]] & ALL)) return false;
          }
        }
        for (k = 0; k < visits.length; k++) {
          var cnt = 0, last = -1;
          for (t = 0; t < T; t++) if (dom[visits[k][0] * T + t] & visits[k][1]) { cnt++; last = t; }
          if (cnt === 0) return false;
          if (cnt === 1 && !set(visits[k][0] * T + last, visits[k][1])) return false;
        }
        for (k = 0; k < counts.length; k++) {
          var cs = counts[k][0], cn = counts[k][1], dm = 0, ds = 0, a, b;
          for (t = 0; t < T - 1; t++) {
            a = dom[cs * T + t]; b = dom[cs * T + t + 1];
            if (single(a) && single(b)) { if (a !== b) dm++; else ds++; }
            else if ((a & b) === 0) dm++;
          }
          if (dm > cn || (T - 1) - ds < cn) return false;
          if (dm === cn || (T - 1) - ds === cn) {
            for (t = 0; t < T - 1; t++) {
              a = dom[cs * T + t]; b = dom[cs * T + t + 1];
              var defMove = (single(a) && single(b) && a !== b) || (a & b) === 0;
              var defStay = single(a) && single(b) && a === b;
              if (dm === cn && !defMove) {
                v = a & b;
                if (!set(cs * T + t, v) || !set(cs * T + t + 1, v)) return false;
              } else if ((T - 1) - ds === cn && !defStay) {
                if (single(a) && !set(cs * T + t + 1, ~a & ALL)) return false;
                if (single(b) && !set(cs * T + t, ~b & ALL)) return false;
              }
            }
          }
        }
        // un seul suspect dans la pièce du crime à l'heure du crime
        var ccnt = 0, clast = -1;
        for (s = 0; s < S; s++) if (dom[s * T + crimeT] & crimeBit) { ccnt++; clast = s; }
        if (ccnt === 0) return false;
        if (ccnt === 1 && !set(clast * T + crimeT, crimeBit)) return false;
        for (s = 0; s < S; s++) {
          if (dom[s * T + crimeT] === crimeBit) {
            for (var o = 0; o < S; o++) if (o !== s && !set(o * T + crimeT, ~crimeBit & ALL)) return false;
          }
        }
      }
      return true;
    }
    return { S: S, T: T, N: N, base: base, propagate: propagate, iters: function () { return iters; } };
  }

  // Domaines après propagation (null si contradiction), et nombre de passes nécessaires
  function propagated(puz) {
    var cp = compile(puz), dom = cp.base.slice(), i;
    for (i = 0; i < cp.N; i++) if (dom[i] === 0) return null;
    if (!cp.propagate(dom)) return null;
    return { dom: dom, iters: cp.iters() };
  }

  // Somme des tailles de domaine après propagation (plus petit = plus informatif), -1 si contradiction
  function domainScore(puz) {
    var cp = compile(puz), dom = cp.base.slice(), i, sum = 0;
    for (i = 0; i < cp.N; i++) if (dom[i] === 0) return -1;
    if (!cp.propagate(dom)) return -1;
    for (i = 0; i < cp.N; i++) sum += POP[dom[i]];
    return sum;
  }

  function solve(puz, limit, cap) {
    limit = limit || 2; cap = cap || 80000;
    var cp = compile(puz), S = cp.S, T = cp.T, N = cp.N, base = cp.base, propagate = cp.propagate, i;
    var sols = [], nodes = 0, aborted = false;

    function search(dom) {
      if (aborted) return;
      if (++nodes > cap) { aborted = true; return; }
      if (!propagate(dom)) return;
      var best = -1, bc = 99, i;
      for (i = 0; i < N; i++) {
        var c = POP[dom[i]];
        if (c > 1 && c < bc) { bc = c; best = i; }
      }
      if (best < 0) { sols.push(dom.slice()); return; }
      for (var r = 0; r < NR; r++) {
        if (dom[best] & (1 << r)) {
          var nd = dom.slice(); nd[best] = 1 << r;
          search(nd);
          if (sols.length >= limit || aborted) return;
        }
      }
    }

    for (i = 0; i < N; i++) if (base[i] === 0) return { count: 0, aborted: false, sols: [] };
    search(base);
    return {
      count: sols.length, aborted: aborted,
      sols: sols.map(function (d) { return d.map(function (m) { return Math.log2(m) | 0; }); })
    };
  }

  /* ---------- Évaluation d'un constat sur une grille (éventuellement partielle) ---------- */
  function evalClue(puz, c, g) {
    var S = puz.S, T = puz.T, t, s, v, w, unk;
    switch (c.type) {
      case 'at': v = g(c.s, c.t); return v < 0 ? 'pending' : v === c.r ? 'ok' : 'bad';
      case 'notAt': v = g(c.s, c.t); return v < 0 ? 'pending' : v !== c.r ? 'ok' : 'bad';
      case 'together': v = g(c.a, c.t); w = g(c.b, c.t); return v < 0 || w < 0 ? 'pending' : v === w ? 'ok' : 'bad';
      case 'apart': v = g(c.a, c.t); w = g(c.b, c.t); return v < 0 || w < 0 ? 'pending' : v !== w ? 'ok' : 'bad';
      case 'stay': v = g(c.s, c.t); w = g(c.s, c.t + 1); return v < 0 || w < 0 ? 'pending' : v === w ? 'ok' : 'bad';
      case 'move': v = g(c.s, c.t); w = g(c.s, c.t + 1); return v < 0 || w < 0 ? 'pending' : v !== w ? 'ok' : 'bad';
      case 'moves': {
        var dm = 0, ds = 0;
        for (t = 0; t < T - 1; t++) {
          v = g(c.s, t); w = g(c.s, t + 1);
          if (v >= 0 && w >= 0) { if (v !== w) dm++; else ds++; }
        }
        var possible = (T - 1) - ds;
        if (dm > c.n || possible < c.n) return 'bad';
        for (t = 0; t < T; t++) if (g(c.s, t) < 0) return 'pending';
        return 'ok';
      }
      case 'never':
        unk = false;
        for (t = 0; t < T; t++) { v = g(c.s, t); if (v === c.r) return 'bad'; if (v < 0) unk = true; }
        return unk ? 'pending' : 'ok';
      case 'visited':
        unk = false;
        for (t = 0; t < T; t++) { v = g(c.s, t); if (v === c.r) return 'ok'; if (v < 0) unk = true; }
        return unk ? 'pending' : 'bad';
      case 'empty':
        unk = false;
        for (s = 0; s < S; s++) { v = g(s, c.t); if (v === c.r) return 'bad'; if (v < 0) unk = true; }
        return unk ? 'pending' : 'ok';
      case 'alone':
        v = g(c.s, c.t); if (v < 0) return 'pending';
        unk = false;
        for (s = 0; s < S; s++) {
          if (s === c.s) continue;
          w = g(s, c.t); if (w === v) return 'bad'; if (w < 0) unk = true;
        }
        return unk ? 'pending' : 'ok';
      case 'crime':
        var cnt = 0; unk = false;
        for (s = 0; s < S; s++) {
          v = g(s, puz.crime.t);
          if (v === puz.crime.room) cnt++; else if (v < 0) unk = true;
        }
        if (cnt > 1) return 'bad';
        if (unk) return 'pending';
        return cnt === 1 ? 'ok' : 'bad';
    }
    return 'pending';
  }

  // Cases fautives pour un constat déjà jugé faux
  function badCells(puz, c, g) {
    var S = puz.S, T = puz.T, out = [], s, t, v;
    switch (c.type) {
      case 'at': case 'notAt': out.push([c.s, c.t]); break;
      case 'together': case 'apart': out.push([c.a, c.t], [c.b, c.t]); break;
      case 'stay': case 'move': out.push([c.s, c.t], [c.s, c.t + 1]); break;
      case 'never': for (t = 0; t < T; t++) if (g(c.s, t) === c.r) out.push([c.s, t]); break;
      case 'empty': for (s = 0; s < S; s++) if (g(s, c.t) === c.r) out.push([s, c.t]); break;
      case 'alone':
        v = g(c.s, c.t); out.push([c.s, c.t]);
        for (s = 0; s < S; s++) if (s !== c.s && g(s, c.t) === v) out.push([s, c.t]);
        break;
      case 'crime':
        for (s = 0; s < S; s++) if (g(s, puz.crime.t) === puz.crime.room) out.push([s, puz.crime.t]);
        break;
    }
    return out;
  }

  function clueTextEN(puz, c) {
    var nm = function (s) { return SUSPECTS[s].name; };
    var the = function (r) { return ROOMS[r].the; };
    var loc = function (r) { return (ROOMS[r].on ? 'on ' : 'in ') + ROOMS[r].the; };
    var u = U(), A = function (w) { return /^[aeiou]/.test(w) ? 'an' : 'a'; };
    switch (c.type) {
      case 'at': return nm(c.s) + ' was ' + loc(c.r) + ' at ' + timeLabel(c.t) + '.';
      case 'notAt': return nm(c.s) + ' was not ' + loc(c.r) + ' at ' + timeLabel(c.t) + '.';
      case 'together': return nm(c.a) + ' and ' + nm(c.b) + ' were in the same ' + u + ' at ' + timeLabel(c.t) + '.';
      case 'apart': return nm(c.a) + ' and ' + nm(c.b) + ' were not together at ' + timeLabel(c.t) + '.';
      case 'stay': return nm(c.s) + ' stayed in the same ' + u + ' at ' + timeLabel(c.t) + ' and at ' + timeLabel(c.t + 1) + '.';
      case 'move': return nm(c.s) + ' changed ' + u + 's between ' + timeLabel(c.t) + ' and ' + timeLabel(c.t + 1) + '.';
      case 'moves':
        return c.n === 0 ? nm(c.s) + ' never moved all evening.'
          : c.n === 1 ? nm(c.s) + ' changed ' + u + 's only once.'
          : nm(c.s) + ' changed ' + u + 's ' + c.n + ' times in total.';
      case 'never': return nm(c.s) + ' never set foot ' + loc(c.r) + ' all evening.';
      case 'visited': return nm(c.s) + ' passed through ' + the(c.r) + ' at some point in the evening.';
      case 'empty': return 'Nobody was ' + loc(c.r) + ' at ' + timeLabel(c.t) + '.';
      case 'alone': return nm(c.s) + ' was alone in their ' + u + ' at ' + timeLabel(c.t) + '.';
      case 'crime': return 'Only one suspect was ' + loc(puz.crime.room) + ' at ' + timeLabel(puz.crime.t) + ': the killer.';
    }
    return '';
  }
  function statementTextEN(puz, c) {
    var by = c.by, me = function (s) { return s === by; };
    var nm = function (s) { return SUSPECTS[s].name; };
    var the = function (r) { return ROOMS[r].the; };
    var loc = function (r) { return (ROOMS[r].on ? 'on ' : 'in ') + ROOMS[r].the; };
    var u = U(), other;
    switch (c.type) {
      case 'at': if (me(c.s)) return 'I was ' + loc(c.r) + ' at ' + timeLabel(c.t) + '.'; break;
      case 'notAt': if (me(c.s)) return 'I was not ' + loc(c.r) + ' at ' + timeLabel(c.t) + '.'; break;
      case 'together': if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + ' and I were in the same ' + u + ' at ' + timeLabel(c.t) + '.'; } break;
      case 'apart': if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + ' and I were not together at ' + timeLabel(c.t) + '.'; } break;
      case 'stay': if (me(c.s)) return 'I stayed in the same ' + u + ' at ' + timeLabel(c.t) + ' and at ' + timeLabel(c.t + 1) + '.'; break;
      case 'move': if (me(c.s)) return 'I changed ' + u + 's between ' + timeLabel(c.t) + ' and ' + timeLabel(c.t + 1) + '.'; break;
      case 'never': if (me(c.s)) return 'I never set foot ' + loc(c.r) + ' all evening.'; break;
      case 'visited': if (me(c.s)) return 'I passed through ' + the(c.r) + ' at some point in the evening.'; break;
    }
    return clueTextEN(puz, c);
  }
  /* ---------- Textes italiens ---------- */
  function itLoc(r) { return ROOMS[r].inn || itIn(ROOMS[r].the, ROOMS[r].on); }
  function alle(t) { var l = timeLabel(t); return l === '0:00' ? 'a mezzanotte' : /^1:/.test(l) ? 'all’' + l : 'alle ' + l; }
  function tra(t) { var a = timeLabel(t), b = timeLabel(t + 1); return 'tra le ' + a + ' e ' + (b === '0:00' ? 'la mezzanotte' : /^1:/.test(b) ? 'l’' + b : 'le ' + b); }
  function stessa() { return 'nella stessa ' + U(); }
  function clueTextIT(puz, c) {
    var nm = function (s) { return SUSPECTS[s].name; }, o = function (s) { return SUSPECTS[s].f ? 'a' : 'o'; };
    switch (c.type) {
      case 'at': return nm(c.s) + ' era ' + itLoc(c.r) + ' ' + alle(c.t) + '.';
      case 'notAt': return nm(c.s) + ' non era ' + itLoc(c.r) + ' ' + alle(c.t) + '.';
      case 'together': return nm(c.a) + ' e ' + nm(c.b) + ' erano ' + stessa() + ' ' + alle(c.t) + '.';
      case 'apart': return nm(c.a) + ' e ' + nm(c.b) + ' non erano insieme ' + alle(c.t) + '.';
      case 'stay': return nm(c.s) + ' è rimast' + o(c.s) + ' ' + stessa() + ' ' + alle(c.t) + ' e ' + alle(c.t + 1) + '.';
      case 'move': return nm(c.s) + ' ha cambiato ' + U() + ' ' + tra(c.t) + '.';
      case 'moves':
        return c.n === 0 ? nm(c.s) + ' non si è mai spostat' + o(c.s) + ' in tutta la serata.'
          : c.n === 1 ? nm(c.s) + ' ha cambiato ' + U() + ' una sola volta.'
          : nm(c.s) + ' ha cambiato ' + U() + ' ' + c.n + ' volte in tutto.';
      case 'never': return nm(c.s) + ' non ha mai messo piede ' + itLoc(c.r) + ' in tutta la serata.';
      case 'visited': return nm(c.s) + ' è passat' + o(c.s) + ' per ' + ROOMS[c.r].the + ' durante la serata.';
      case 'empty': return 'Non c’era nessuno ' + itLoc(c.r) + ' ' + alle(c.t) + '.';
      case 'alone': return nm(c.s) + ' era sol' + o(c.s) + ' nella sua ' + U() + ' ' + alle(c.t) + '.';
      case 'crime': return 'Un solo sospettato si trovava ' + itLoc(puz.crime.room) + ' ' + alle(puz.crime.t) + ': l’assassino.';
    }
    return '';
  }
  function statementTextIT(puz, c) {
    var by = c.by, me = function (s) { return s === by; }, nm = function (s) { return SUSPECTS[s].name; }, o = SUSPECTS[by].f ? 'a' : 'o', other;
    switch (c.type) {
      case 'at': if (me(c.s)) return 'Ero ' + itLoc(c.r) + ' ' + alle(c.t) + '.'; break;
      case 'notAt': if (me(c.s)) return 'Non ero ' + itLoc(c.r) + ' ' + alle(c.t) + '.'; break;
      case 'together': if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + ' e io eravamo ' + stessa() + ' ' + alle(c.t) + '.'; } break;
      case 'apart': if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + ' e io non eravamo insieme ' + alle(c.t) + '.'; } break;
      case 'stay': if (me(c.s)) return 'Sono rimast' + o + ' ' + stessa() + ' ' + alle(c.t) + ' e ' + alle(c.t + 1) + '.'; break;
      case 'move': if (me(c.s)) return 'Ho cambiato ' + U() + ' ' + tra(c.t) + '.'; break;
      case 'never': if (me(c.s)) return 'Non ho mai messo piede ' + itLoc(c.r) + ' in tutta la serata.'; break;
      case 'visited': if (me(c.s)) return 'Sono passat' + o + ' per ' + ROOMS[c.r].the + ' durante la serata.'; break;
    }
    return clueTextIT(puz, c);
  }
  function clueText(puz, c) {
    if (EN) return clueTextEN(puz, c);
    if (IT) return clueTextIT(puz, c);
    var nm = function (s) { return SUSPECTS[s].name; };
    var the = function (r) { return ROOMS[r].the; };
    var loc = function (r) { return (ROOMS[r].on ? 'sur ' : 'dans ') + ROOMS[r].the; };
    switch (c.type) {
      case 'at': return nm(c.s) + ' était ' + loc(c.r) + ' à ' + timeLabel(c.t) + '.';
      case 'notAt': return nm(c.s) + " n'était pas " + loc(c.r) + ' à ' + timeLabel(c.t) + '.';
      case 'together': return nm(c.a) + ' et ' + nm(c.b) + ' étaient dans la même ' + U() + ' à ' + timeLabel(c.t) + '.';
      case 'apart': return nm(c.a) + ' et ' + nm(c.b) + " n'étaient pas ensemble à " + timeLabel(c.t) + '.';
      case 'stay': return nm(c.s) + ' est resté' + (SUSPECTS[c.s].f ? 'e' : '') + ' dans la même ' + U() + ' à ' + timeLabel(c.t) + ' comme à ' + timeLabel(c.t + 1) + '.';
      case 'move': return nm(c.s) + ' a changé de ' + U() + ' entre ' + timeLabel(c.t) + ' et ' + timeLabel(c.t + 1) + '.';
      case 'moves':
        return c.n === 0 ? nm(c.s) + " n'a pas bougé de la soirée."
          : c.n === 1 ? nm(c.s) + " n'a changé de " + U() + " qu'une seule fois."
          : nm(c.s) + ' a changé de ' + U() + ' ' + c.n + ' fois au total.';
      case 'never': return nm(c.s) + " n'a jamais mis les pieds " + loc(c.r) + ' de la soirée.';
      case 'visited': return nm(c.s) + ' a traversé ' + the(c.r) + ' à un moment de la soirée.';
      case 'empty': return 'Personne ne se trouvait ' + loc(c.r) + ' à ' + timeLabel(c.t) + '.';
      case 'alone': return nm(c.s) + ' était ' + (SUSPECTS[c.s].f ? 'seule' : 'seul') + ' dans sa ' + U() + ' à ' + timeLabel(c.t) + '.';
      case 'crime':
        return 'Un seul suspect se trouvait ' + loc(puz.crime.room) + ' à ' + timeLabel(puz.crime.t) + ' : le meurtrier.';
    }
    return '';
  }

  /* ---------- Génération ---------- */
  function randomPaths(rng, S, T) {
    for (var attempt = 0; attempt < 50; attempt++) {
      var sol = [], good = true;
      for (var s = 0; s < S; s++) {
        var r = Math.floor(rng() * NR), seen = {}, row = [r];
        seen[r] = 1;
        for (var t = 1; t < T; t++) {
          if (rng() >= 0.3) {
            var nb = ADJ[r]; r = nb[Math.floor(rng() * nb.length)];
          }
          row.push(r); seen[r] = 1;
        }
        if (Object.keys(seen).length < 3) { good = false; break; }
        sol = sol.concat(row);
      }
      if (good) return sol;
    }
    return null;
  }

  function pickCrime(rng, sol, S, T) {
    var cands = [];
    for (var t = 1; t < T; t++) {
      for (var r = 0; r < NR; r++) {
        var n = 0;
        for (var s = 0; s < S; s++) if (sol[s * T + t] === r) n++;
        if (n === 1) cands.push({ room: r, t: t });
      }
    }
    return cands.length ? cands[Math.floor(rng() * cands.length)] : null;
  }

  function buildPool(sol, S, T) {
    var pool = [], s, t, r, a, b;
    var g = function (s, t) { return sol[s * T + t]; };
    for (s = 0; s < S; s++) {
      var visitedSet = {};
      for (t = 0; t < T; t++) {
        visitedSet[g(s, t)] = 1;
        pool.push({ type: 'at', s: s, t: t, r: g(s, t) });
        if (t < T - 1) pool.push({ type: g(s, t) === g(s, t + 1) ? 'stay' : 'move', s: s, t: t });
        for (r = 0; r < NR; r++) if (r !== g(s, t)) pool.push({ type: 'notAt', s: s, t: t, r: r });
        var alone = true;
        for (a = 0; a < S; a++) if (a !== s && g(a, t) === g(s, t)) alone = false;
        if (alone) pool.push({ type: 'alone', s: s, t: t });
      }
      var nmoves = 0;
      for (t = 0; t < T - 1; t++) if (g(s, t) !== g(s, t + 1)) nmoves++;
      pool.push({ type: 'moves', s: s, n: nmoves });
      for (r = 0; r < NR; r++) {
        pool.push(visitedSet[r] ? { type: 'visited', s: s, r: r } : { type: 'never', s: s, r: r });
      }
    }
    for (t = 0; t < T; t++) {
      for (a = 0; a < S; a++) for (b = a + 1; b < S; b++) {
        pool.push(g(a, t) === g(b, t) ? { type: 'together', a: a, b: b, t: t } : { type: 'apart', a: a, b: b, t: t });
      }
      for (r = 0; r < NR; r++) {
        var occ = false;
        for (s = 0; s < S; s++) if (g(s, t) === r) occ = true;
        if (!occ) pool.push({ type: 'empty', t: t, r: r });
      }
    }
    return pool;
  }

  function weightedOrder(pool, w, rng) {
    var count = {};
    pool.forEach(function (c) { count[c.type] = (count[c.type] || 0) + 1; });
    return pool.map(function (c) {
      var u = rng() || 1e-9;
      return { c: c, key: -Math.log(u) / (w[c.type] / count[c.type]) };
    }).sort(function (x, y) { return x.key - y.key; }).map(function (x) { return x.c; });
  }

  var TYPE_RANK = { together: 0, apart: 1, alone: 2, moves: 3, stay: 3, move: 4, notAt: 5, empty: 6, never: 7, visited: 8, at: 9 };

  /* Fuites : un constat qui innocente d'emblée un suspect à l'heure du crime (ou désigne le meurtrier)
     rend l'enquête triviale. On interdit les fuites franches et on plafonne le nombre de suspects
     innocentés directement à S - 2, pour qu'il reste toujours au moins deux pistes. */
  function leakOf(e, crime) {
    if (e.t !== crime.t) return null;
    switch (e.type) {
      case 'together': return { bad: true, clr: [e.a, e.b] };
      case 'at': return { bad: true, clr: [] }; // jamais de lieu donné à l’heure du crime
      case 'notAt': return e.r === crime.room ? { clr: [e.s] } : null;
    }
    return null;
  }
  function leakOk(e, crime, cleared, S) {
    var l = leakOf(e, crime);
    if (!l) return true;
    if (l.bad) return false;
    var n = Object.keys(cleared).length;
    l.clr.forEach(function (x) { if (!cleared[x]) n++; });
    return n <= S - 2;
  }
  function leakMark(e, crime, cleared) {
    var l = leakOf(e, crime);
    if (l) l.clr.forEach(function (x) { cleared[x] = 1; });
  }

  function generate(seed, levelKey, mode) {
    if (mode === 'liar' || mode === 'half') return generateLiar(seed, levelKey, mode);
    var L = LEVELS[levelKey] || LEVELS.moyen, S = L.S, T = L.T;
    for (var attempt = 0; attempt < 80; attempt++) {
      var rng = mulberry32(seed * 7919 + attempt * 104729 + 17);
      var sol = randomPaths(rng, S, T);
      if (!sol) continue;
      var crime = pickCrime(rng, sol, S, T);
      if (!crime) continue;
      var ordered = weightedOrder(buildPool(sol, S, T), L.w, rng);
      var clues = [], unique = false;
      // sélection gloutonne : parmi les K prochains candidats (tirés selon les poids du niveau),
      // on garde celui qui réduit le plus les possibilités après propagation
      var atCount = 0, cleared = {};
      for (var step = 0; step < 70 && ordered.length; step++) {
        var win = [];
        for (var q = 0; q < ordered.length && win.length < (L.k || 8); q++) {
          if (ordered[q].type === 'at' && atCount >= (L.atMax == null ? 99 : L.atMax)) continue;
          if (!leakOk(ordered[q], crime, cleared, S)) continue;
          win.push(q);
        }
        if (!win.length) break;
        var bestI = win[0], bestScore = Infinity;
        for (q = 0; q < win.length; q++) {
          var sc = domainScore({ S: S, T: T, clues: clues.concat([ordered[win[q]]]), crime: crime });
          if (sc >= 0 && sc < bestScore) { bestScore = sc; bestI = win[q]; }
        }
        var picked = ordered.splice(bestI, 1)[0];
        if (picked.type === 'at') atCount++;
        leakMark(picked, crime, cleared);
        clues.push(picked);
        if (clues.length < 5) continue;
        var res = solve({ S: S, T: T, clues: clues, crime: crime }, 2, 60000);
        if (res.count === 1 && !res.aborted) { unique = true; break; }
      }
      if (!unique) continue;
      // élagage : on retire tout constat inutile, ceux du type le moins souhaité d'abord
      var order = clues.map(function (c) {
        return { c: c, k: L.drop.indexOf(c.type) + rng() * 0.9 };
      }).sort(function (x, y) { return x.k - y.k; }).map(function (x) { return x.c; });
      var cur = clues.slice();
      for (var j = 0; j < order.length; j++) {
        var test = cur.filter(function (x) { return x !== order[j]; });
        var r2 = solve({ S: S, T: T, clues: test, crime: crime }, 2, 60000);
        if (r2.count === 1 && !r2.aborted) cur = test;
      }
      if (cur.length > L.max) continue;
      cur.sort(function (x, y) {
        return TYPE_RANK[x.type] - TYPE_RANK[y.type] || (x.t || 0) - (y.t || 0) || (x.s || x.a || 0) - (y.s || y.a || 0);
      });
      var culprit = -1;
      for (var s = 0; s < S; s++) if (sol[s * T + crime.t] === crime.room) culprit = s;
      return { S: S, T: T, clues: cur, crime: crime, solution: sol, culprit: culprit, level: levelKey, seed: seed };
    }
    return generate(seed + 1, levelKey);
  }


  /* ---------- Mode « un seul menteur » ---------- */
  var NEG = { at: 'notAt', notAt: 'at', together: 'apart', apart: 'together', stay: 'move', move: 'stay', never: 'visited', visited: 'never' };
  function neg(c) {
    var o = {}, k;
    for (k in c) o[k] = c[k];
    o.type = NEG[c.type];
    return o;
  }

  // Contraintes effectives si « L ment » : les déclarations de L sont fausses, les autres vraies,
  // et le meurtrier (seul dans la pièce du crime à l'heure du crime) est L.
  function liarClues(puz, L) {
    var out = puz.clues.map(function (c) { return c.by === undefined ? c : (c.by === L ? neg(c) : c); });
    out.push({ type: 'at', s: L, t: puz.crime.t, r: puz.crime.room });
    return out;
  }

  // Demi-vérités : les autres suspects disent vrai ; L mélange (au moins une déclaration vraie et une fausse).
  // On parcourt les valeurs de vérité des déclarations de L en élaguant dès qu'une contradiction apparaît.
  function solveHalf(puz, limit, cap) {
    var total = [], aborted = false, count = 0, S = puz.S, T = puz.T;
    var mkp = function (cl) { return { S: S, T: T, crime: puz.crime, clues: cl }; };
    for (var L = 0; L < S && count < limit; L++) {
      var base = [], mine = [];
      puz.clues.forEach(function (c) { if (c.by === L) mine.push(c); else base.push(c); });
      base.push({ type: 'at', s: L, t: puz.crime.t, r: puz.crime.room });
      var m = mine.length;
      if (m < 2 || domainScore(mkp(base)) < 0) continue;
      var recur = function (i, cl, hasT, hasF, who) {
        if (count >= limit || aborted) return;
        if (i === m) {
          if (!(hasT && hasF)) return;
          var res = solve(mkp(cl), limit - count, cap);
          if (res.aborted) aborted = true;
          res.sols.forEach(function (gr) { total.push({ liar: who, grid: gr }); });
          count += res.count;
          return;
        }
        var yes = cl.concat([mine[i]]);
        if (domainScore(mkp(yes)) >= 0) recur(i + 1, yes, true, hasF, who);
        var no = cl.concat([neg(mine[i])]);
        if (domainScore(mkp(no)) >= 0) recur(i + 1, no, hasT, true, who);
      };
      recur(0, base, false, false, L);
    }
    return { count: count, aborted: aborted, sols: total };
  }

  function solveLiar(puz, limit, cap) {
    if (puz.mode === 'half') return solveHalf(puz, limit || 2, cap);
    limit = limit || 2;
    var total = [], aborted = false, count = 0;
    for (var L = 0; L < puz.S; L++) {
      var res = solve({ S: puz.S, T: puz.T, crime: puz.crime, clues: liarClues(puz, L) }, limit - count, cap);
      if (res.aborted) aborted = true;
      res.sols.forEach(function (gr) { total.push({ liar: L, grid: gr }); });
      count += res.count;
      if (count >= limit) break;
    }
    return { count: count, aborted: aborted, sols: total };
  }

  function domainScoreLiar(puz) {
    var sum = 0;
    for (var L = 0; L < puz.S; L++) {
      var cls;
      if (puz.mode === 'half') {
        cls = puz.clues.filter(function (c) { return c.by !== L; });
        cls.push({ type: 'at', s: L, t: puz.crime.t, r: puz.crime.room });
      } else cls = liarClues(puz, L);
      var cp = compile({ S: puz.S, T: puz.T, crime: puz.crime, clues: cls });
      var dom = cp.base.slice(), ok = true, i;
      for (i = 0; i < cp.N; i++) if (dom[i] === 0) { ok = false; break; }
      if (ok && cp.propagate(dom)) for (i = 0; i < cp.N; i++) sum += POP[dom[i]];
    }
    return sum;
  }

  var LIAR_LEVELS = {
    facile: {
      S: 3, T: 5, max: 16, k: 10, atMax: 2, minSt: 2,
      w: { fact: 1.5, at: 1.5, notAt: 0.8, together: 2, apart: 1.2, stay: 1.5, move: 1, never: 1.5, visited: 1.5 },
      drop: ['notAt', 'apart', 'move', 'visited', 'never', 'stay', 'together', 'at', 'fact']
    },
    moyen: {
      S: 4, T: 5, max: 24, k: 10, atMax: 2, minSt: 2,
      w: { fact: 1, at: 1.5, notAt: 0.8, together: 2, apart: 1.2, stay: 1.5, move: 1, never: 1.5, visited: 1.5 },
      drop: ['notAt', 'apart', 'move', 'visited', 'never', 'stay', 'together', 'at', 'fact']
    },
    difficile: {
      S: 4, T: 6, max: 30, k: 20, atMax: 1, minSt: 2,
      w: { fact: 0.5, at: 1.2, notAt: 0.8, together: 2, apart: 1.2, stay: 1.5, move: 1, never: 1.8, visited: 1.8 },
      drop: ['fact', 'notAt', 'apart', 'move', 'visited', 'never', 'stay', 'together', 'at']
    }
  };
  var HALF_LEVELS = {
    facile: Object.assign({}, LIAR_LEVELS.facile, { max: 18, maxSt: 8, atMax: 4, k: 20 }),
    moyen: Object.assign({}, LIAR_LEVELS.moyen, { max: 24, maxSt: 8, atMax: 8, k: 20 }),
    difficile: Object.assign({}, LIAR_LEVELS.difficile, { max: 28, maxSt: 8, atMax: 6, k: 40 })
  };
  var LIAR_TYPES = { at: 1, notAt: 1, together: 1, apart: 1, stay: 1, move: 1, never: 1, visited: 1 };

  function groupOf(item) { return item.kind === 'fact' ? 'fact' : item.c.type; }

  function generateLiar(seed, levelKey, mode) {
    mode = mode || 'liar';
    var half = mode === 'half', table = half ? HALF_LEVELS : LIAR_LEVELS;
    var L = table[levelKey] || table.moyen, S = L.S, T = L.T, maxSt = L.maxSt || 99;
    for (var attempt = 0; attempt < 80; attempt++) {
      var rng = mulberry32(seed * 6007 + attempt * 104729 + (half ? 71 : 29));
      var sol = randomPaths(rng, S, T);
      if (!sol) continue;
      var crime = pickCrime(rng, sol, S, T);
      if (!crime) continue;
      var liar = -1, s0, sp;
      for (s0 = 0; s0 < S; s0++) if (sol[s0 * T + crime.t] === crime.room) liar = s0;
      var cands = [];
      buildPool(sol, S, T).forEach(function (f) {
        if (!LIAR_TYPES[f.type]) return;
        if (f.type === 'at') cands.push({ kind: 'fact', c: f });
        for (sp = 0; sp < S; sp++) {
          if (sp === liar) {
            if (half) cands.push({ kind: 'st', truth: true, c: Object.assign({}, f, { by: sp }) });
            cands.push({ kind: 'st', truth: false, c: Object.assign({}, neg(f), { by: sp }) });
          } else {
            cands.push({ kind: 'st', truth: true, c: Object.assign({}, f, { by: sp }) });
          }
        }
      });
      // aucune phrase (vraie ou mensongère) ne situe un suspect à l’heure du crime
      cands = cands.filter(function (it) { return !(it.c.type === 'at' && it.c.t === crime.t); });
      var count = {};
      cands.forEach(function (it) { var g0 = groupOf(it); count[g0] = (count[g0] || 0) + 1; });
      var ordered = cands.map(function (it) {
        var u = rng() || 1e-9;
        return { it: it, key: -Math.log(u) / (L.w[groupOf(it)] / count[groupOf(it)]) };
      }).sort(function (x, y) { return x.key - y.key; }).map(function (x) { return x.it; });

      var chosen = [], unique = false, factCount = 0, perSpeaker = {}, cleared = {};
      var eff = function (it) { return it.kind === 'fact' || it.truth ? it.c : neg(it.c); };
      var mk = function (items) { return { mode: mode, S: S, T: T, crime: crime, clues: items.map(function (i) { return i.c; }) }; };
      var take = function (idx) {
        var it = ordered.splice(idx, 1)[0];
        leakMark(eff(it), crime, cleared);
        if (it.kind === 'fact') factCount++;
        else perSpeaker[it.c.by] = (perSpeaker[it.c.by] || 0) + 1;
        chosen.push(it);
      };
      if (half) {
        // le meurtrier doit avoir au moins une déclaration vraie et une fausse
        var iT = -1, iF = -1;
        for (var z = 0; z < ordered.length && (iT < 0 || iF < 0); z++) {
          var oz = ordered[z];
          if (oz.kind === 'st' && oz.c.by === liar && leakOk(eff(oz), crime, {}, S)) {
            if (oz.truth && iT < 0) iT = z; else if (!oz.truth && iF < 0) iF = z;
          }
        }
        if (iT < 0 || iF < 0) continue;
        take(Math.max(iT, iF)); take(Math.min(iT, iF));
      }
      for (var step = 0; step < 120 && ordered.length; step++) {
        var win = [];
        for (var q = 0; q < ordered.length && win.length < L.k; q++) {
          var cand = ordered[q];
          if (cand.kind === 'fact' && factCount >= L.atMax) continue;
          if (cand.kind === 'st' && (perSpeaker[cand.c.by] || 0) >= maxSt) continue;
          if (!leakOk(eff(cand), crime, cleared, S)) continue;
          win.push(q);
        }
        if (!win.length) break;
        var bestI = win[0], bestScore = Infinity;
        for (q = 0; q < win.length; q++) {
          var sc = domainScoreLiar(mk(chosen.concat([ordered[win[q]]])));
          if (sc < bestScore) { bestScore = sc; bestI = win[q]; }
        }
        take(bestI);
        if (chosen.length < 5) continue;
        var res = solveLiar(mk(chosen), 2, 60000);
        if (res.count === 1 && !res.aborted) { unique = true; break; }
      }
      if (!unique) continue;

      var order = chosen.map(function (it) {
        var k0 = L.drop.indexOf(groupOf(it));
        return { it: it, k: (k0 < 0 ? 0 : k0) + rng() * 0.9 };
      }).sort(function (x, y) { return x.k - y.k; }).map(function (x) { return x.it; });
      var cur = chosen.slice();
      for (var j = 0; j < order.length; j++) {
        var it = order[j];
        if (it.kind === 'st') {
          var mine = cur.filter(function (x) { return x.kind === 'st' && x.c.by === it.c.by; });
          if (mine.length <= L.minSt) continue;
          if (half && it.c.by === liar) {
            var rest = mine.filter(function (x) { return x !== it; });
            var hasT = rest.some(function (x) { return x.truth; }), hasF = rest.some(function (x) { return !x.truth; });
            if (!hasT || !hasF) continue;
          }
        }
        var test = cur.filter(function (x) { return x !== it; });
        var r2 = solveLiar(mk(test), 2, 60000);
        if (r2.count === 1 && !r2.aborted) cur = test;
      }
      if (cur.length > L.max) continue;
      var out = cur.map(function (x) { return x.c; });
      out.sort(function (x, y) {
        var bx = x.by === undefined ? -1 : x.by, by2 = y.by === undefined ? -1 : y.by;
        return bx - by2 || TYPE_RANK[x.type] - TYPE_RANK[y.type] || (x.t || 0) - (y.t || 0);
      });
      return { mode: mode, S: S, T: T, clues: out, crime: crime, solution: sol, culprit: liar, liar: liar, level: levelKey, seed: seed };
    }
    return generateLiar(seed + 1, levelKey, mode);
  }

  // Déclaration à la première personne quand le sujet est celui qui parle
  function statementText(puz, c) {
    if (EN) return statementTextEN(puz, c);
    if (IT) return statementTextIT(puz, c);
    var by = c.by, me = function (s) { return s === by; };
    var nm = function (s) { return SUSPECTS[s].name; };
    var the = function (r) { return ROOMS[r].the; };
    var loc = function (r) { return (ROOMS[r].on ? 'sur ' : 'dans ') + ROOMS[r].the; };
    var f = SUSPECTS[by].f, other;
    switch (c.type) {
      case 'at': if (me(c.s)) return "J'étais " + loc(c.r) + ' à ' + timeLabel(c.t) + '.'; break;
      case 'notAt': if (me(c.s)) return "Je n'étais pas " + loc(c.r) + ' à ' + timeLabel(c.t) + '.'; break;
      case 'together':
        if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + ' et moi étions dans la même ' + U() + ' à ' + timeLabel(c.t) + '.'; }
        break;
      case 'apart':
        if (me(c.a) || me(c.b)) { other = me(c.a) ? c.b : c.a; return nm(other) + " et moi n'étions pas ensemble à " + timeLabel(c.t) + '.'; }
        break;
      case 'stay': if (me(c.s)) return 'Je suis resté' + (f ? 'e' : '') + ' dans la même ' + U() + ' à ' + timeLabel(c.t) + ' comme à ' + timeLabel(c.t + 1) + '.'; break;
      case 'move': if (me(c.s)) return "J'ai changé de " + U() + " entre " + timeLabel(c.t) + ' et ' + timeLabel(c.t + 1) + '.'; break;
      case 'never': if (me(c.s)) return "Je n'ai jamais mis les pieds " + loc(c.r) + ' de la soirée.'; break;
      case 'visited': if (me(c.s)) return "J'ai traversé " + the(c.r) + ' à un moment de la soirée.'; break;
    }
    return clueText(puz, c);
  }

  return {
    get ROOMS() { return ROOMS; }, get DOORS() { return DOORS; }, get ADJ() { return ADJ; },
    get STEP() { return STEP; }, get SUSPECTS() { return SUSPECTS; }, get SCENE() { return SCENE; },
    SCENES: SCENES, setScene: setScene, itIn: itIn, alle: alle, tra: tra, LEVELS: LEVELS, propagated: propagated, get POP() { return POP; }, get NR() { return NR; },
    timeLabel: timeLabel, solve: solve, evalClue: evalClue, badCells: badCells,
    clueText: clueText, generate: generate,
    statementText: statementText, solveLiar: solveLiar, neg: neg, LIAR_LEVELS: LIAR_LEVELS, HALF_LEVELS: HALF_LEVELS
  };
});

