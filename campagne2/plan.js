/* Campagne 2 « La Dernière Vente » : plan des 58 épisodes (43 à 100).
   Pour chaque épisode : lieu, suspects (dans l'ordre de la grille), coupable, victime éventuelle et mécaniques.
   Sert au générateur (tools/gen_c2.js) ; les textes sont dans story2.js.

   Fil rouge : les meurtres sont commis par des hommes de main qui reçoivent des lettres anonymes parfumées
   à la violette. Le commanditaire, l'Inspecteur Armand Songe (fils caché de la Comtesse), n'est démasqué qu'au 100.
   Règles de casting : un mort ou un meurtrier arrêté n'apparaît plus ensuite ; un assommé revient plus tard ;
   Songe n'est jamais coupable avant le 100 ; Ernest Couchette est la fausse piste (jamais coupable). */
(function (root, factory) {
  var d = factory();
  if (typeof module === 'object' && module.exports) module.exports = d; else root.KioukanPlan2 = d;
})(typeof self !== 'undefined' ? self : this, function () {
  var SONGE = 'Inspecteur Armand Songe';
  var CH = [
    { n: 7, key: 'prologue', title: 'Le Palais de justice', place: 'palais', mech: null },
    { n: 8, key: 'drouot', title: 'L’Hôtel Drouot', place: 'drouot', mech: 'meurtre' },
    { n: 9, key: 'chateau', title: 'Le château de Montfaucon', place: 'chateau', mech: 'passages' },
    { n: 10, key: 'simplon', title: 'Le train de nuit pour Venise', place: 'simplon', mech: 'assommes' },
    { n: 11, key: 'venise', title: 'Le carnaval de Venise', place: 'venise', mech: 'arme' },
    { n: 12, key: 'hospice', title: 'L’hospice du Grand-Col', place: 'hospice', mech: 'panne' },
    { n: 13, key: 'banque', title: 'La banque de Genève', place: 'banque', mech: 'cles' },
    { n: 14, key: 'musee', title: 'Le musée de cire', place: 'musee', mech: 'moment' },
    { n: 15, key: 'finale', title: 'La Dernière Vente', place: 'drouot', mech: 'finale' }
  ];
  // Numéros de chapitre affichés : 7 (prologue) à 15 ; la campagne 1 occupe 1 à 6.
  var E = [];
  function ep(o) { o.n = 43 + E.length; E.push(o); }

  /* ===== Prologue · Palais de justice (rooms : 0 pas perdus, 1 audience, 2 juge, 3 greffe, 4 cellules, 5 parloir, 6 buvette) ===== */
  ep({ ch: 7, kind: 'vol', T: 5, suspects: ['Gédéon Barreau', 'Rémi Sansou', 'Maître Gérard Menvussa'], culprit: 'Rémi Sansou', target: 18 });
  ep({ ch: 7, kind: 'vol', T: 5, suspects: ['Juge Odile Hibéré', 'Gédéon Barreau', 'Maître Gérard Menvussa', SONGE], culprit: 'Gédéon Barreau', crime: { room: 3 }, target: 22 });

  /* ===== Drouot (0 hall, 1 salle 1, 2 salle 2, 3 vestiaire, 4 expo, 5 bureau, 6 réserve, 7 quai) · le meurtre ===== */
  ep({ ch: 8, kind: 'meurtre', T: 5, suspects: ['Ana Gramme', 'Ginette Pépite', 'Hippolyte Plateau', 'Agathe Crispie'], culprit: 'Hippolyte Plateau',
    victim: { name: 'Maître Adjugé Vandu', kind: 'mort' }, crime: { room: 5 }, target: 22, arrested: true });
  ep({ ch: 8, kind: 'sabotage', T: 5, suspects: ['Ginette Pépite', 'Agathe Crispie', 'Jacques Teil', 'Ana Gramme'], culprit: 'Ginette Pépite', target: 24 });
  ep({ ch: 8, kind: 'faux', T: 6, suspects: ['Rémi Sansou', 'Ana Gramme', 'Paul Ochon', 'Jacques Teil'], culprit: 'Rémi Sansou', crime: { room: 4 }, target: 26 });
  ep({ ch: 8, kind: 'enlevement', T: 6, suspects: ['Agathe Crispie', 'Lise Défait', 'Ginette Pépite'], culprit: 'Agathe Crispie',
    victim: { name: 'Monsieur Moustache', kind: 'animal' }, crime: { room: 3 }, target: 26 });
  ep({ ch: 8, kind: 'chantage', T: 6, suspects: ['Jacques Teil', 'Paul Ochon', 'Lise Défait', SONGE], culprit: 'Jacques Teil', crime: { room: 3 }, target: 28 });
  ep({ ch: 8, kind: 'vol', T: 6, suspects: ['Ana Gramme', 'Ginette Pépite', 'Rémi Sansou', 'Paul Ochon'], culprit: 'Ana Gramme', target: 28 });
  ep({ ch: 8, kind: 'vol', T: 6, suspects: ['Lise Défait', 'Jacques Teil', 'Agathe Crispie', 'Ana Gramme'], culprit: 'Lise Défait',
    victim: { name: 'Barnabé', kind: 'ligote' }, crime: { room: 6 }, target: 30 });

  /* ===== Château (0 salon, 1 galerie, 2 armes, 3 biblio, 4 cuisine, 5 chapelle, 6 chambre, 7 crypte) · passages secrets ===== */
  var CHA = 'Marquis Hugues de Montfaucon';
  ep({ ch: 9, kind: 'vol', T: 5, suspects: [CHA, 'Basile Bouture', 'Julie Enne'], culprit: 'Basile Bouture',
    secret: [{ a: 3, b: 7, who: ['Basile Bouture'] }], crime: { room: 7 }, target: 20 });
  ep({ ch: 9, kind: 'sabotage', T: 6, suspects: ['Lucie Fer', 'Ernest Couchette', 'Julie Enne', 'Ana Gramme'], culprit: 'Lucie Fer',
    secret: [{ a: 6, b: 2, who: ['Lucie Fer', 'Julie Enne'] }], crime: { room: 1 }, target: 26 });
  ep({ ch: 9, kind: 'faux', T: 6, suspects: [CHA, 'Dr Mehdi Cament', 'Basile Bouture', 'Lucie Fer'], culprit: CHA,
    secret: [{ a: 3, b: 7, who: [CHA, 'Basile Bouture'] }], crime: { room: 5 }, target: 28 });
  ep({ ch: 9, kind: 'agression', T: 6, suspects: ['Julie Enne', 'Ernest Couchette', 'Dr Mehdi Cament', 'Ana Gramme'], culprit: 'Julie Enne',
    victim: { name: 'Maître Gérard Menvussa', kind: 'assomme' }, secret: [{ a: 3, b: 7, who: ['Julie Enne'] }], crime: { room: 7 }, target: 28 });
  ep({ ch: 9, kind: 'empoisonnement', T: 6, suspects: ['Dr Mehdi Cament', 'Basile Bouture', 'Lucie Fer', CHA], culprit: 'Dr Mehdi Cament', liars: 1,
    secret: [{ a: 6, b: 2, who: [CHA] }], target: 30 });
  ep({ ch: 9, kind: 'chantage', T: 6, suspects: ['Basile Bouture', 'Ernest Couchette', 'Julie Enne', 'Ana Gramme', SONGE], culprit: 'Basile Bouture',
    secret: [{ a: 3, b: 7, who: ['Basile Bouture', 'Ana Gramme'] }], target: 30 });
  ep({ ch: 9, kind: 'meurtre', T: 6, suspects: ['Dr Mehdi Cament', 'Lucie Fer', 'Julie Enne', 'Ernest Couchette'], culprit: 'Dr Mehdi Cament',
    victim: { name: CHA, kind: 'mort' }, secret: [{ a: 6, b: 2, who: ['Dr Mehdi Cament'] }, { a: 3, b: 7, who: ['Julie Enne'] }], crime: { room: 6 }, target: 32, arrested: true });

  /* ===== Train (0 fourgon, 1 lits A, 2 lits B, 3 resto, 4 salon, 5 observation, 6 toit) · les assommés ===== */
  ep({ ch: 10, kind: 'agression', T: 5, suspects: ['Rémi Sansou', 'Aria Vibrato', 'Ernest Couchette'], culprit: 'Rémi Sansou',
    victim: { name: 'Lucie Fer', kind: 'assomme', speaks: true }, crime: { room: 0 }, target: 20 });
  ep({ ch: 10, kind: 'vol', T: 6, suspects: ['Lucie Fer', 'Jean Bilet', 'Aria Vibrato', 'Paul Ka'], culprit: 'Lucie Fer', target: 26 });
  ep({ ch: 10, kind: 'sabotage', T: 6, suspects: ['Paul Ka', 'Ana Gramme', 'Ernest Couchette', 'Rémi Sansou'], culprit: 'Paul Ka', crime: { room: 4 }, target: 28 });
  ep({ ch: 10, kind: 'agression', T: 6, suspects: ['Aria Vibrato', 'Rémi Sansou', 'Paul Ka', SONGE], culprit: 'Aria Vibrato',
    victim: { name: 'Jean Bilet', kind: 'assomme', speaks: true }, target: 30 });
  ep({ ch: 10, kind: 'vol', T: 6, suspects: ['Ana Gramme', 'Paul Ka', 'Lucie Fer', 'Ernest Couchette'], culprit: 'Ana Gramme', liars: 1, crime: { room: 0 }, target: 30 });
  ep({ ch: 10, kind: 'vol', T: 6, suspects: ['Rémi Sansou', 'Aria Vibrato', 'Jean Bilet', 'Ernest Couchette', SONGE], culprit: 'Rémi Sansou', crime: { room: 6 }, target: 32 });
  ep({ ch: 10, kind: 'meurtre', T: 6, suspects: ['Paul Ka', 'Aria Vibrato', 'Lucie Fer', 'Ernest Couchette'], culprit: 'Paul Ka',
    victim: { name: 'Jean Bilet', kind: 'mort' }, target: 32, arrested: true });

  /* ===== Venise (0 bal, 1 escalier, 2 miroirs, 3 loggia, 4 masques, 5 cuisines, 6 ponton) · l'arme (+ les jumelles) ===== */
  var PIA = 'Pia Doppio', PAOLA = 'Paola Doppio';
  ep({ ch: 11, kind: 'agression', T: 5, suspects: ['Enzo Lyrico', 'Paulette Paillette', 'Ernest Couchette', 'Ana Gramme'], culprit: 'Enzo Lyrico',
    victim: { name: 'Maestro Vivaldo Baguette', kind: 'entarte' }, weapon: { room: 5, after: 0, name: 'tarte' }, crime: { room: 0 }, target: 24 });
  ep({ ch: 11, kind: 'vol', T: 6, suspects: [PIA, PAOLA, 'Paulette Paillette', 'Enzo Lyrico'], culprit: PIA, twins: [PIA, PAOLA], crime: { room: 4 }, target: 26 });
  ep({ ch: 11, kind: 'sabotage', T: 6, suspects: ['Paulette Paillette', 'André Vivalto', PIA, PAOLA], culprit: 'Paulette Paillette', twins: [PIA, PAOLA], crime: { room: 6 }, target: 28 });
  ep({ ch: 11, kind: 'empoisonnement', T: 6, suspects: ['Maître Gérard Menvussa', 'Maestro Vivaldo Baguette', 'Paulette Paillette', 'Ernest Couchette'], culprit: 'Maître Gérard Menvussa',
    victim: { name: 'Enzo Lyrico', kind: 'malade' }, weapon: { room: 5, after: 0, name: 'poivre' }, target: 28 });
  ep({ ch: 11, kind: 'vol', T: 6, suspects: ['André Vivalto', 'Maître Gérard Menvussa', 'Ana Gramme', PIA, PAOLA], culprit: 'André Vivalto', twins: [PIA, PAOLA], target: 30 });
  ep({ ch: 11, kind: 'vol', T: 6, suspects: [PAOLA, PIA, 'Enzo Lyrico', SONGE], culprit: PAOLA, twins: [PIA, PAOLA], liars: 1, target: 30 });
  ep({ ch: 11, kind: 'meurtre', T: 6, suspects: ['Maestro Vivaldo Baguette', PIA, PAOLA, 'Enzo Lyrico'], culprit: 'Maestro Vivaldo Baguette', twins: [PIA, PAOLA],
    victim: { name: 'André Vivalto', kind: 'mort' }, weapon: { room: 4, after: 0, name: 'stylet' }, crime: { room: 2 }, target: 34, arrested: true });

  /* ===== Hospice (0 réfectoire, 1 commune, 2 chenil, 3 cuisine, 4 chapelle, 5 dortoir, 6 cave) · la panne ===== */
  ep({ ch: 12, kind: 'vol', T: 6, suspects: ['Capitaine Jean Tempête', 'Cécile Ence', 'Frère Bernard Lhermite'], culprit: 'Capitaine Jean Tempête', dark: 3, crime: { room: 6 }, target: 24 });
  ep({ ch: 12, kind: 'vol', T: 6, suspects: ['Marcel Hélice', 'Pr Hector Tumulus', 'Ernest Couchette', 'Cécile Ence'], culprit: 'Marcel Hélice', dark: 3, crime: { room: 2 }, target: 28 });
  ep({ ch: 12, kind: 'agression', T: 6, suspects: ['Cécile Ence', 'Capitaine Jean Tempête', 'Pr Hector Tumulus', PIA], culprit: 'Cécile Ence', dark: 2,
    victim: { name: 'Frère Bernard Lhermite', kind: 'assomme', speaks: true }, target: 30 });
  ep({ ch: 12, kind: 'vol', T: 6, suspects: [PIA, PAOLA, 'Pr Hector Tumulus', 'Marcel Hélice'], culprit: PIA, twins: [PIA, PAOLA], dark: 3, target: 30 });
  ep({ ch: 12, kind: 'sabotage', T: 6, suspects: [PAOLA, 'Marcel Hélice', 'Capitaine Jean Tempête', 'Ana Gramme'], culprit: PAOLA, dark: 4, crime: { room: 2 }, target: 30 });
  ep({ ch: 12, kind: 'vol', T: 6, suspects: ['Cécile Ence', 'Ana Gramme', 'Frère Bernard Lhermite', 'Ernest Couchette', SONGE], culprit: 'Cécile Ence', liars: 1, target: 32 });
  ep({ ch: 12, kind: 'meurtre', T: 6, suspects: ['Marcel Hélice', 'Capitaine Jean Tempête', PIA, PAOLA], culprit: 'Marcel Hélice', twins: [PIA, PAOLA], dark: 3,
    victim: { name: 'Pr Hector Tumulus', kind: 'mort' }, crime: { room: 4 }, target: 34, arrested: true });

  /* ===== Banque (0 hall, 1 guichets, 2 directeur, 3 escalier, 4 couloir, 5 conseil, 6 gardiens, 7 coffres) · portes et clés ===== */
  ep({ ch: 13, kind: 'vol', T: 5, suspects: ['Gaspard Pièce', 'Frank Suisse', 'Bernadette Banco'], culprit: 'Gaspard Pièce',
    keys: { locked: [[4, 7], [6, 7]], start: 'Frank Suisse' }, crime: { room: 7 }, target: 22 });
  ep({ ch: 13, kind: 'vol', T: 6, suspects: ['Bernadette Banco', 'Jacques Potte', 'René Vaplu', 'Gaspard Pièce'], culprit: 'Bernadette Banco',
    keys: { locked: [[1, 2]], start: 'Gaspard Pièce' }, crime: { room: 2 }, target: 26 });
  ep({ ch: 13, kind: 'faux', T: 6, suspects: ['Frank Suisse', 'Ernest Couchette', 'Jacques Potte', 'Ana Gramme'], culprit: 'Frank Suisse',
    keys: { locked: [[4, 5]], start: 'Ernest Couchette' }, crime: { room: 5 }, target: 28 });
  ep({ ch: 13, kind: 'agression', T: 6, suspects: [PIA, 'René Vaplu', 'Bernadette Banco', 'Gaspard Pièce'], culprit: PIA,
    victim: { name: 'Ernest Couchette', kind: 'enferme' }, keys: { locked: [[4, 7], [6, 7]], start: 'Gaspard Pièce' }, crime: { room: 7 }, target: 30 });
  ep({ ch: 13, kind: 'faux', T: 6, suspects: [PAOLA, PIA, 'Frank Suisse', 'Jacques Potte'], culprit: PAOLA, twins: [PIA, PAOLA],
    keys: { locked: [[1, 2]], start: 'Frank Suisse' }, target: 30 });
  ep({ ch: 13, kind: 'chantage', T: 6, suspects: ['Ana Gramme', 'Bernadette Banco', 'Frank Suisse', 'René Vaplu', SONGE], culprit: 'Ana Gramme', liars: 1,
    keys: { locked: [[4, 5]], start: 'Frank Suisse' }, target: 32 });
  ep({ ch: 13, kind: 'meurtre', T: 6, suspects: ['René Vaplu', 'Bernadette Banco', 'Gaspard Pièce', 'Frank Suisse'], culprit: 'René Vaplu',
    victim: { name: 'Jacques Potte', kind: 'mort' }, keys: { locked: [[4, 7], [6, 7]], start: 'Gaspard Pièce' }, crime: { room: 7 }, target: 34, arrested: true });

  /* ===== Musée de cire (0 glaces, 1 rois, 2 criminels, 3 atelier, 4 théâtre, 5 mirages, 6 réserve, 7 loge) · le bon moment ===== */
  ep({ ch: 14, kind: 'vol', T: 6, suspects: ['Sam Souffle', 'Cyrielle Bougie', 'Max Valise'], culprit: 'Sam Souffle', moment: { room: 1, times: [1, 2, 3] }, target: 24 });
  ep({ ch: 14, kind: 'vol', T: 6, suspects: ['Paulette Paillette', 'Gérard Rideau', 'Sam Souffle', 'Max Valise'], culprit: 'Paulette Paillette', moment: { room: 1, times: [2, 3, 4] }, target: 28 });
  ep({ ch: 14, kind: 'agression', T: 6, suspects: ['Cyrielle Bougie', 'Gérard Rideau', 'Enzo Lyrico', 'Max Valise'], culprit: 'Cyrielle Bougie',
    victim: { name: 'Aria Vibrato', kind: 'assomme', speaks: true }, weapon: { room: 3, after: 0, name: 'louche' }, crime: { room: 7 }, target: 30 });
  ep({ ch: 14, kind: 'sabotage', T: 6, suspects: ['Enzo Lyrico', 'Sam Souffle', 'Gérard Rideau', 'Ernest Couchette'], culprit: 'Enzo Lyrico', moment: { room: 4, times: [1, 2, 3, 4] }, target: 30 });
  ep({ ch: 14, kind: 'vol', T: 6, suspects: [PIA, PAOLA, 'Cyrielle Bougie', 'Max Valise'], culprit: PIA, twins: [PIA, PAOLA], moment: { room: 5, times: [2, 3, 4] }, target: 32 });
  ep({ ch: 14, kind: 'chantage', T: 6, suspects: ['Max Valise', 'Ana Gramme', 'Gérard Rideau', 'Cyrielle Bougie', SONGE], culprit: 'Max Valise', liars: 1, target: 32 });
  ep({ ch: 14, kind: 'meurtre', T: 6, suspects: ['Gérard Rideau', 'Sam Souffle', 'Cyrielle Bougie', 'Paulette Paillette'], culprit: 'Gérard Rideau',
    moment: { room: 2, times: [1, 2, 3, 4] }, deadName: 'Max Valise', target: 34, arrested: true });

  /* ===== Finale · Drouot, la vraie vente ===== */
  ep({ ch: 15, kind: 'vol', T: 6, suspects: ['Rémi Sansou', 'Ginette Pépite', 'Agathe Crispie', 'Ernest Couchette'], culprit: 'Rémi Sansou',
    keys: { locked: [[4, 6], [6, 7]], start: 'Ginette Pépite' }, crime: { room: 6 }, target: 30 });
  ep({ ch: 15, kind: 'agression', T: 6, suspects: [PIA, PAOLA, 'Agathe Crispie', 'Lucie Fer'], culprit: PAOLA, twins: [PIA, PAOLA],
    victim: { name: 'Ernest Couchette', kind: 'assomme', speaks: true }, weapon: { room: 6, after: 0, name: 'cadre' }, target: 32 });
  ep({ ch: 15, kind: 'vol', T: 6, suspects: ['Agathe Crispie', 'Maître Gérard Menvussa', 'Aria Vibrato', 'Lucie Fer'], culprit: 'Agathe Crispie', dark: 3, liars: 1, target: 34 });
  ep({ ch: 15, kind: 'vol', T: 6, suspects: ['Ginette Pépite', 'Rémi Sansou', 'Aria Vibrato', 'Juge Odile Hibéré'], culprit: 'Ginette Pépite', moment: { room: 4, times: [1, 2, 3, 4] }, target: 34 });
  ep({ ch: 15, kind: 'faux', T: 6, suspects: ['Ana Gramme', SONGE, 'Lucie Fer', 'Maître Gérard Menvussa'], culprit: 'Ana Gramme', liars: 2, accomplice: SONGE, target: 38 });
  ep({ ch: 15, kind: 'vol', T: 6, suspects: ['Lucie Fer', SONGE, 'Rémi Sansou', 'Aria Vibrato'], culprit: 'Lucie Fer', liars: 2, accomplice: SONGE, crime: { room: 5 }, target: 38 });
  ep({ ch: 15, kind: 'agression', T: 6, suspects: [SONGE, 'Comtesse Diane de Carat', 'Rémi Sansou', 'Ernest Couchette'], culprit: SONGE, liars: 2, accomplice: 'Comtesse Diane de Carat',
    victim: { name: 'Ana Gramme', kind: 'assomme' }, weapon: { room: 5, after: 0, name: 'marteau' }, crime: { room: 1 }, target: 40 });

  return { chapters: CH, episodes: E, SONGE: SONGE };
});
