
/* Guide pas à pas du tutoriel : surligne l'indice et les cases du moment, vérifie la case demandée, propose « Montre-moi ». */
(function () {
  'use strict';
  var H = window.KioukanHistoire, E = window.KioukanEngine;
  if (!H || !window.KIOUKAN_TUTO) return;
  var st = H.state, EN = window.KIOUKAN_LANG === 'en', IT = window.KIOUKAN_LANG === 'it', ROOMS = E.ROOMS, SUS = E.SUSPECTS, tl = E.timeLabel;
  var T = st.puz.T;

  /* ---------- Étapes : k = lecture ou case à remplir ; exp = [suspect, heure, pièce] ; clue = numéros de lignes du carnet ; hl = autres éléments ---------- */
  var STEPS = [
    { k: 'read', hl: ['#intro .story-text'],
      fr: ['Bienvenue !', 'Voici une petite enquête pour apprendre à jouer, étape par étape. Le principe : reconstituer où se trouvait chaque suspect à chaque heure, pour démasquer le coupable. Lis l’histoire ci-dessus, puis appuie sur « Suivant ». Tu peux quitter à tout moment avec « ← Menu ».'],
      en: ['Welcome!', 'Here is a short case to learn how to play, step by step. The idea: rebuild where each suspect was at each time, to unmask the culprit. Read the story above, then press “Next”. You can leave at any time with “← Menu”.'],
      it: ["Benvenuto!", "Ecco una piccola indagine per imparare a giocare, passo dopo passo. Il principio: ricostruire dove si trovava ogni sospettato a ogni ora, per smascherare il colpevole. Leggi la storia qui sopra, poi premi «Avanti». Puoi uscire in qualsiasi momento con «← Menu»."] },
    { k: 'read', hl: ['#case'],
      fr: ['L’affaire', 'Chaque enquête commence par un méfait. Ici, le sucrier a disparu %in4, à %t3, et le voleur y était seul. Retiens bien ce lieu et cette heure : toute l’enquête repose dessus.'],
      en: ['The case', 'Every case starts with a crime. Here the sugar bowl vanished %in4 at %t3, and the thief was alone there. Remember that place and time: the whole case hangs on them.'],
      it: ["Il caso", "Ogni indagine comincia con un misfatto. Qui la zuccheriera è sparita %in4, alle %t3, e il ladro era lì da solo. Ricorda bene questo luogo e quest’ora: tutta l’indagine si basa su di essi."] },
    { k: 'read', hl: ['#suspects'],
      fr: ['Les suspects', 'Trois suspects : %R, %A et %E. L’un d’eux est le voleur. Pour le trouver, on va établir où chacun se trouvait aux quatre heures de la soirée.'],
      en: ['The suspects', 'Three suspects: %R, %A and %E. One of them is the thief. To find out who, we will work out where each of them was at each of the four times.'],
      it: ["I sospettati", "Tre sospettati: %R, %A ed %E. Uno di loro è il ladro. Per trovarlo, stabiliremo dove si trovava ciascuno alle quattro ore della serata."] },
    { k: 'read', hl: ['#board-panel .board'],
      fr: ['Le tableau', 'Voici le tableau. Chaque colonne est un suspect, chaque ligne une heure. Une case indique dans quelle voiture se trouvait quelqu’un à cette heure précise. Il y a 12 cases à remplir.'],
      en: ['The timeline', 'This is the timeline. Each column is a suspect, each row a time. A cell shows which car someone was in at that exact time. There are 12 cells to fill in.'],
      it: ["La tabella", "Ecco la tabella. Ogni colonna è un sospettato, ogni riga un orario. Una casella indica in quale carrozza si trovava qualcuno in quel preciso momento. Ci sono 12 caselle da riempire."] },
    { k: 'read', hl: ['.cell.given'],
      fr: ['Les cases verrouillées', 'Trois cases sont déjà remplies et portent un petit cadenas. Ce sont des faits établis : %R était %in1 à %t0, %A était %in3 à %t0, et %E était %in4 à %t1. C’est notre point de départ.'],
      en: ['The locked cells', 'Three cells are already filled in and have a little padlock. They are established facts: %R was %in1 at %t0, %A was %in3 at %t0, and %E was %in4 at %t1. That is our starting point.'],
      it: ["Le caselle bloccate", "Tre caselle sono già riempite e hanno un piccolo lucchetto. Sono fatti accertati: %R era %in1 alle %t0, %A era %in3 alle %t0, ed %E era %in4 alle %t1. È il nostro punto di partenza."] },
    { k: 'read', hl: ['#map-panel'],
      fr: ['Le plan', 'Le plan montre le train en coupe, avec les suspects à l’heure choisie (touche une heure pour la changer). Règle d’or : entre deux heures, on reste dans sa voiture ou l’on passe dans une voiture voisine par une porte. On ne saute pas par-dessus une voiture.'],
      en: ['The map', 'The map shows a cross-section of the train, with the suspects at the chosen time (tap a time to change it). Golden rule: between two times, a suspect stays in their car or moves to a neighbouring car through a door. Nobody skips over a car.'],
      it: ["La pianta", "La pianta mostra il treno in sezione, con i sospettati all’ora scelta (tocca un orario per cambiarlo). Regola d’oro: tra due orari si resta nella propria carrozza o si passa in una carrozza vicina attraverso una porta. Non si salta una carrozza."] },
    { k: 'read', hl: ['#clues-panel'],
      fr: ['Le carnet', 'Dans le carnet d’Hortense, tous les indices sont vrais, et ils suffisent à tout reconstituer. La première ligne rappelle le méfait. On va les utiliser un par un : l’indice du moment sera surligné.'],
      en: ['The notebook', 'In Hortense’s notebook, every clue is true, and together they are enough to rebuild everything. The first line recalls the crime. We will use the clues one by one: the current one will be highlighted.'],
      it: ["Il taccuino", "Nel taccuino di Ortensia tutti gli indizi sono veri, e bastano a ricostruire tutto. La prima riga ricorda il misfatto. Li useremo uno alla volta: l’indizio del momento sarà evidenziato."] },
    { k: 'do', exp: [[1, 1, 4]], clue: [2],
      fr: ['Premier indice : même voiture', 'Lis l’indice surligné : à %t1, %A et %E étaient dans la même voiture. Or on sait où était %E à %t1 : %in4 (case verrouillée). Donc %A y était aussi. À toi : touche la case de %A à %t1 et choisis %r4.'],
      en: ['First clue: same car', 'Read the highlighted clue: at %t1, %A and %E were in the same car. We know where %E was at %t1: %in4 (locked cell). So %A was there too. Your turn: tap %A’s cell at %t1 and choose %r4.'],
      it: ["Primo indizio: stessa carrozza", "Leggi l’indizio evidenziato: alle %t1, %A ed %E erano nella stessa carrozza. Ora, sappiamo dov’era %E alle %t1: %in4 (casella bloccata). Quindi c’era anche %A. Tocca a te: tocca la casella di %A alle %t1 e scegli %r4."] },
    { k: 'do', exp: [[2, 0, 4]], clue: [6],
      fr: ['« À… comme à… »', '« À %t0 comme à %t1 » désigne deux heures précises, pas une durée : chaque ligne du tableau est un instant. %E est resté dans la même voiture à %t0 et à %t1. Comme il était %in4 à %t1, il y était déjà à %t0. Remplis sa case à %t0.'],
      en: ['“At… and at…”', '“At %t0 and at %t1” means two precise times, not a stretch of time: each row of the timeline is a single moment. %E stayed in the same car at %t0 and at %t1. Since he was %in4 at %t1, he was already there at %t0. Fill in his cell at %t0.'],
      it: ["«Alle… come alle…»", "«Alle %t0 come alle %t1» indica due ore precise, non una durata: ogni riga della tabella è un istante. %E è rimasto nella stessa carrozza alle %t0 e alle %t1. Siccome era %in4 alle %t1, c’era già alle %t0. Riempi la sua casella delle %t0."] },
    { k: 'do', exp: [[1, 2, 4]], clue: [7],
      fr: ['Même logique', '%A est restée dans la même voiture à %t1 et à %t2. Elle était %in4 à %t1 : elle y est donc encore à %t2. Remplis sa case à %t2.'],
      en: ['Same logic', '%A stayed in the same car at %t1 and at %t2. She was %in4 at %t1, so she is still there at %t2. Fill in her cell at %t2.'],
      it: ["Stessa logica", "%A è rimasta nella stessa carrozza alle %t1 e alle %t2. Era %in4 alle %t1: quindi c’è ancora alle %t2. Riempi la sua casella delle %t2."] },
    { k: 'do', exp: [[1, 3, 4]], clue: [8],
      fr: ['Encore une fois', 'Même chose : à %t2 comme à %t3, %A n’a pas changé de voiture. À %t3, elle est donc %in4.'],
      en: ['Once more', 'Same again: at %t2 and at %t3, %A did not change cars. So at %t3 she is %in4.'],
      it: ["Ancora una volta", "Stessa cosa: alle %t2 come alle %t3, %A non ha cambiato carrozza. Alle %t3 è quindi %in4."] },
    { k: 'read', clue: [1], hl: ['.cell[data-s="1"][data-t="3"]'],
      fr: ['Le coupable !', 'Regarde la première ligne du carnet : un seul suspect se trouvait %in4 à %t3, et c’est le voleur. Or %A y est : c’est donc elle ! Dès qu’on est sûr, on peut accuser avec « J’accuse ! ». Ici, on termine d’abord le tableau pour s’entraîner.'],
      en: ['The culprit!', 'Look at the first line of the notebook: only one suspect was %in4 at %t3, and that is the thief. And %A is there, so it is her! As soon as you are sure, you can accuse with “I accuse!”. Here, we finish the timeline first for practice.'],
      it: ["Il colpevole!", "Guarda la prima riga del taccuino: un solo sospettato si trovava %in4 alle %t3, ed è il ladro. Ora, %A è lì: è dunque lei! Appena sei sicuro, puoi accusare con «Io accuso!». Qui finiamo prima la tabella per allenarci."] },
    { k: 'do', exp: [[0, 1, 2]], clue: [3, 4],
      fr: ['Combiner deux indices', 'Deux indices à combiner. D’abord, %R a changé de voiture entre %t0 et %t1. Il était %in1 à %t0 : sur le plan, ses voisines sont %r0 et %r2. Ensuite, %r0 est vide à %t1. Il ne reste que %r2 ! Touche la case de %R à %t1 et choisis %r2.'],
      en: ['Combining two clues', 'Two clues to combine. First, %R changed cars between %t0 and %t1. He was %in1 at %t0: on the map, the neighbouring cars are %r0 and %r2. Second, %r0 is empty at %t1. Only %r2 is left! Tap %R’s cell at %t1 and choose %r2.'],
      it: ["Combinare due indizi", "Due indizi da combinare. Primo, %R ha cambiato carrozza tra le %t0 e le %t1. Era %in1 alle %t0: sulla pianta, le carrozze vicine sono %r0 e %r2. Secondo, %r0 è vuoto alle %t1. Resta solo %r2! Tocca la casella di %R alle %t1 e scegli %r2."] },
    { k: 'do', exp: [[0, 2, 2]], clue: [5],
      fr: ['Rester sur place', 'À %t1 comme à %t2, %R reste dans la même voiture : %r2. Remplis sa case à %t2.'],
      en: ['Staying put', 'At %t1 and at %t2, %R stays in the same car: %r2. Fill in his cell at %t2.'],
      it: ["Restare sul posto", "Alle %t1 come alle %t2, %R resta nella stessa carrozza: %r2. Riempi la sua casella delle %t2."] },
    { k: 'do', exp: [[0, 3, 3]], clue: [10],
      fr: ['« Est passé par… »', '%R est passé par %r3 à un moment de la soirée. Ses trois premières heures : %r1, %r2, %r2. Il ne reste que %t3 : c’est donc là qu’il y était. (Et il ne peut pas être %in4 : %A y est déjà.)'],
      en: ['“Passed through…”', '%R passed through %r3 at some point in the evening. His first three times: %r1, %r2, %r2. Only %t3 is left, so that is when he was there. (And he cannot be %in4: %A is already there.)'],
      it: ["«È passato per…»", "%R è passato per %r3 a un certo punto della serata. Le sue prime tre ore: %r1, %r2, %r2. Resta solo le %t3: è quindi allora che c’era. (E non può essere %in4: c’è già %A.)"] },
    { k: 'do', exp: [[2, 3, 3]], clue: [11],
      fr: ['Ensemble', 'À %t3, %E et %R étaient dans la même voiture. %R est %in3 : %E y est donc aussi.'],
      en: ['Together', 'At %t3, %E and %R were in the same car. %R is %in3, so %E is there too.'],
      it: ["Insieme", "Alle %t3, %E e %R erano nella stessa carrozza. %R è %in3: quindi c’è anche %E."] },
    { k: 'do', exp: [[2, 2, 3]], clue: [9],
      fr: ['« Seule »', 'À %t2, %A était seule dans sa voiture (%r4) : personne d’autre n’y était. Or %E était %in4 à %t1 et sera %in3 à %t3. À %t2, il ne peut être que %in3 ou %in4 pour rejoindre ces deux voitures. Comme %A est seule %in4, il est %in3. Dernière case !'],
      en: ['“Alone”', 'At %t2, %A was alone in her car (%r4): nobody else was there. Now %E was %in4 at %t1 and will be %in3 at %t3. At %t2, he can only be %in3 or %in4 to reach both cars. Since %A is alone %in4, he is %in3. Last cell!'],
      it: ["«Sola»", "Alle %t2, %A era sola nella sua carrozza (%r4): non c’era nessun altro. Ora, %E era %in4 alle %t1 e sarà %in3 alle %t3. Alle %t2 può essere solo %in3 o %in4 per raggiungere queste due carrozze. Siccome %A è sola %in4, lui è %in3. Ultima casella!"] }
  ];
  var FINAL = {
    fr: ['Affaire classée !', 'Bravo, tu viens de résoudre ta première enquête ! L’essentiel : chaque indice donne une case, les cases en donnent d’autres, et le coupable est celui qui était seul sur les lieux. Les vraies enquêtes sont plus longues, mais la méthode est la même.'],
    it: ['Caso chiuso!', 'Bravo, hai appena risolto la tua prima indagine! L’essenziale: ogni indizio dà una casella, le caselle ne danno altre, e il colpevole è chi era solo sul luogo. Le vere indagini sono più lunghe, ma il metodo è lo stesso.'],
    en: ['Case closed!', 'Well done, you have just solved your first case! The essentials: each clue gives you a cell, cells unlock more clues, and the culprit is the one who was alone at the scene. Real cases are longer, but the method is the same.'] };
  var UI = IT
    ? { step: 'Passo', of: 'di', prev: '← Indietro', next: 'Avanti →', show: 'Mostrami', hide: 'Nascondi', guide: 'Guida', ok: '✓ Ben fatto!', warn: 'Non proprio: rileggi l’indizio evidenziato e guarda la pianta.', go: 'Inizia la vera indagine', again: 'Rifai il tutorial', todo: 'Riempi la casella evidenziata per continuare.' }
    : EN
    ? { step: 'Step', of: 'of', prev: '← Back', next: 'Next →', show: 'Show me', hide: 'Hide', guide: 'Guide', ok: '✓ Well done!', warn: 'Not quite: reread the highlighted clue and look at the map.', go: 'Start the real case', again: 'Replay the tutorial', todo: 'Fill in the highlighted cell to continue.' }
    : { step: 'Étape', of: 'sur', prev: '← Retour', next: 'Suivant →', show: 'Montre-moi', hide: 'Masquer', guide: 'Guide', ok: '✓ Bien joué !', warn: 'Pas tout à fait : relis l’indice surligné et regarde le plan.', go: 'Commencer la vraie enquête', again: 'Refaire le tutoriel', todo: 'Remplis la case surlignée pour continuer.' };

  function inRoom(r) { if (IT) return ROOMS[r].inn || E.itIn(ROOMS[r].the, ROOMS[r].on); return (EN ? (ROOMS[r].on ? 'on ' : 'in ') : (ROOMS[r].on ? 'sur ' : 'dans ')) + ROOMS[r].the; }
  function fmt(s) {
    if (!EN && !IT) s = s.replace(/de %([RAE])/g, function (m, c) { var n = SUS[{ R: 0, A: 1, E: 2 }[c]].short; return (/^[AEIOUYÉÈ]/i.test(n) ? 'd’' : 'de ') + n; });
    s = s.replace(/%in(\d)/g, function (m, r) { return inRoom(+r); }).replace(/%r(\d)/g, function (m, r) { return ROOMS[+r].the; })
      .replace(/%t(\d)/g, function (m, t) { return tl(+t); }).replace(/%([RAE])/g, function (m, c) { return SUS[{ R: 0, A: 1, E: 2 }[c]].short; });
    return EN || IT ? s : s.replace(/ ([!?:;»])/g, ' $1').replace(/« /g, '« ');
  }

  var cur = 0, min = false, finished = false;
  var root = document.createElement('aside');
  root.id = 'tuto'; root.setAttribute('role', 'region'); root.setAttribute('aria-live', 'polite');
  document.body.appendChild(root); document.body.classList.add('tuto-on');

  var css = document.createElement('style');
  css.textContent =
    '#tuto{position:fixed;left:12px;right:12px;bottom:12px;z-index:15;max-width:600px;margin:0 auto;background:var(--paper);color:var(--ink);border:2px solid var(--ink);box-shadow:5px 6px 0 var(--accent);padding:12px 14px 12px;font-family:var(--sans)}' +
    '#tuto .tt-hd{display:flex;align-items:center;gap:10px;margin-bottom:4px}#tuto .tt-n{font:600 11px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}' +
    '#tuto .tt-ti{font:700 17px/1.2 var(--display,Georgia,serif);flex:1}#tuto .tt-x{border:0;background:none;color:var(--ink-2);font:600 12px var(--sans);cursor:pointer;padding:4px}' +
    '#tuto .tt-bar{height:3px;background:var(--line);margin:6px 0 8px}#tuto .tt-bar i{display:block;height:100%;background:var(--accent);transition:width .25s}' +
    '#tuto .tt-tx{margin:0 0 10px;font-size:14.5px;line-height:1.45}#tuto .tt-st{margin:0 0 8px;font-weight:600;font-size:13px}#tuto .tt-st.ok{color:var(--ok)}#tuto .tt-st.warn{color:var(--red,#d23c4c)}' +
    '#tuto .tt-ft{display:flex;gap:8px;flex-wrap:wrap}#tuto .tt-ft .sp{flex:1}' +
    '#tuto button.tb,#tuto a.tb{font:600 13px var(--sans);padding:8px 12px;border:1.5px solid var(--ink);background:var(--paper);color:var(--ink);cursor:pointer;text-decoration:none;display:inline-block}' +
    '#tuto button.tb.pri,#tuto a.tb.pri{background:var(--btn,#141414);color:var(--btn-ink,#f3f0e8)}#tuto button.tb[disabled]{opacity:.4;cursor:default}' +
    '#tuto.min{padding:6px 10px}#tuto.min .tt-tx,#tuto.min .tt-ft,#tuto.min .tt-bar,#tuto.min .tt-st{display:none}#tuto.min .tt-hd{margin:0}' +
    'body.tuto-on{padding-bottom:300px}' +
    '.tuto-hl{outline:3px solid var(--accent)!important;outline-offset:2px;scroll-margin:90px 0 300px;animation:tutoPulse 1.5s ease-in-out infinite}' +
    'li.clue.tuto-hl{background:color-mix(in srgb,var(--accent) 14%,transparent)}' +
    '@keyframes tutoPulse{50%{outline-color:color-mix(in srgb,var(--accent) 35%,transparent)}}' +
    '@media (prefers-reduced-motion:reduce){.tuto-hl{animation:none}#tuto .tt-bar i{transition:none}}' +
    '@media (min-width:900px){#tuto{left:auto;right:20px;margin:0;width:400px}}';
  document.head.appendChild(css);

  function cellOk(e) { return st.grid[e[0] * T + e[1]] === e[2]; }
  function cellBad(e) { var v = st.grid[e[0] * T + e[1]]; return v >= 0 && v !== e[2]; }
  function isDone(s) { return !s.exp || s.exp.every(cellOk); }

  function targets(s) {
    var q = (s.hl || []).slice();
    (s.clue || []).forEach(function (k) { q.push('#clues-panel ul.clues > li:nth-child(' + k + ')'); });
    (s.exp || []).forEach(function (e) { q.push('.cell[data-s="' + e[0] + '"][data-t="' + e[1] + '"]'); });
    return q;
  }
  var lastSig = '';
  function applyHl() {
    var s = STEPS[cur];
    Array.prototype.forEach.call(document.querySelectorAll('.tuto-hl'), function (n) { n.classList.remove('tuto-hl'); });
    if (finished || !s) return;
    var q = targets(s);
    if (st.picker && s.exp) s.exp.forEach(function (e) { if (st.picker.s === e[0] && st.picker.t === e[1]) q.push('.sheet [data-act="pick"][data-r="' + e[2] + '"]'); });
    q.forEach(function (sel) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (n) { n.classList.add('tuto-hl'); }); });
  }
  function scrollToStep() {
    var s = STEPS[cur]; if (!s) return;
    var q = targets(s)[0]; var el = q && document.querySelector(q);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  function render() {
    var done, s = STEPS[cur], h;
    if (finished) {
      var f = IT ? FINAL.it : EN ? FINAL.en : FINAL.fr;
      h = '<div class="tt-hd"><span class="tt-n">' + (IT ? 'Tutorial completato' : EN ? 'Tutorial complete' : 'Tutoriel terminé') + '</span><b class="tt-ti">' + f[0] + '</b></div><p class="tt-tx">' + fmt(f[1]) + '</p>' +
        '<div class="tt-ft"><a class="tb pri" href="histoire.html#e1">' + UI.go + ' →</a><button type="button" class="tb" data-tt="again">' + UI.again + '</button></div>';
      root.className = ''; root.innerHTML = h; return;
    }
    done = isDone(s);
    var bad = (s.exp || []).some(cellBad);
    var tx = IT ? s.it : EN ? s.en : s.fr;
    root.className = min ? 'min' : '';
    h = '<div class="tt-hd"><span class="tt-n">' + UI.step + ' ' + (cur + 1) + ' ' + UI.of + ' ' + STEPS.length + '</span><b class="tt-ti">' + fmt(tx[0]) + '</b><button type="button" class="tt-x" data-tt="min">' + (min ? UI.guide + ' ▴' : UI.hide + ' ▾') + '</button></div>' +
      '<div class="tt-bar"><i style="width:' + Math.round((cur + (done ? 1 : 0)) / STEPS.length * 100) + '%"></i></div>' +
      '<p class="tt-tx">' + fmt(tx[1]) + '</p>' +
      (s.k === 'do' ? '<p class="tt-st ' + (done ? 'ok' : bad ? 'warn' : '') + '">' + (done ? UI.ok : bad ? UI.warn : UI.todo) + '</p>' : '') +
      '<div class="tt-ft"><button type="button" class="tb" data-tt="prev"' + (cur ? '' : ' disabled') + '>' + UI.prev + '</button>' +
      (s.k === 'do' && !done ? '<button type="button" class="tb" data-tt="show">' + UI.show + '</button>' : '') + '<span class="sp"></span>' +
      '<button type="button" class="tb pri" data-tt="next"' + (done ? '' : ' disabled') + '>' + UI.next + '</button></div>';
    root.innerHTML = h;
  }

  function enter(i) {
    cur = Math.max(0, Math.min(STEPS.length - 1, i));
    var s = STEPS[cur];
    st.hideOk = false;
    if (s.exp) { st.selT = s.exp[0][1]; H.renderAll(); }
    render(); applyHl(); setTimeout(scrollToStep, 60);
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-tt]') : null; if (!b) return;
    var a = b.getAttribute('data-tt');
    if (a === 'next') { if (cur < STEPS.length - 1) enter(cur + 1); }
    else if (a === 'prev') enter(cur - 1);
    else if (a === 'min') { min = !min; render(); }
    else if (a === 'again') { location.reload(); }
    else if (a === 'show') {
      var s = STEPS[cur];
      if (st.picker) H.closeSheet();
      (s.exp || []).forEach(function (x) { H.setCell(x[0], x[1], x[2]); });
      refresh();
    }
  });

  var lastKey = '';
  function refresh() {
    if (!finished && st.solved) { finished = true; render(); applyHl(); return; }
    if (finished) return;
    var s = STEPS[cur];
    var key = cur + '|' + (isDone(s) ? 1 : 0) + '|' + ((s.exp || []).some(cellBad) ? 1 : 0) + '|' + min;
    if (key !== lastKey) { lastKey = key; render(); }
    applyHl();
  }
  setInterval(refresh, 250);
  document.addEventListener('click', function () { setTimeout(refresh, 30); });
  enter(0);
  window.KioukanTuto = { go: enter, steps: STEPS };
})();

