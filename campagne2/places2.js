/* Campagne 2 « La Dernière Vente » : les lieux (plans 350 x 210) et les nouveaux personnages.
   Dans le navigateur, s'ajoute à window.KioukanWorld ; dans Node, renvoie les données. */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else if (root.KioukanWorld) data.install(root.KioukanWorld);
})(typeof self !== 'undefined' ? self : this, function () {
  var R = function (name, short, the, extra) { var o = { name: name, short: short, the: the }; if (extra) for (var k in extra) o[k] = extra[k]; return o; };

  var PLACES = {
    /* Prologue · Palais de justice, Paris */
    palais: {
      label: 'Le Palais de justice', unit: 'pièce', t0: 14, view: 'plan',
      rooms: [
        R('Salle des pas perdus', 'Pas perdus', 'la salle des pas perdus'), R('Salle d’audience', 'Audience', 'la salle d’audience'),
        R('Bureau de la juge', 'Juge', 'le bureau de la juge'), R('Greffe', 'Greffe', 'le greffe'),
        R('Couloir des cellules', 'Cellules', 'le couloir des cellules'), R('Parloir', 'Parloir', 'le parloir'), R('Buvette', 'Buvette', 'la buvette')
      ],
      doors: [[0, 1], [1, 2], [0, 3], [0, 5], [5, 4], [1, 6], [3, 4]],
      geo: [
        { x: 10, y: 110, w: 130, h: 90, l: 'PAS PERDUS', f: 'check', fu: [['plant', 10, 36, 14, 24], ['sofa', 40, 58, 50, 16]] },
        { x: 140, y: 110, w: 120, h: 90, l: 'AUDIENCE', f: 'wood', fu: [['desk', 30, 22, 60, 14], ['chair', 20, 60, 12], ['chair', 50, 60, 12], ['chair', 80, 60, 12]] },
        { x: 260, y: 110, w: 80, h: 90, l: 'JUGE', f: 'diamond', fu: [['desk', 14, 40, 50, 16], ['shelf', 8, 14, 64, 10]] },
        { x: 10, y: 10, w: 90, h: 100, l: 'GREFFE', f: 'wood', fu: [['shelf', 8, 22, 74, 10], ['desk', 16, 60, 56, 14]] },
        { x: 100, y: 10, w: 120, h: 50, l: 'CELLULES', f: 'steel', fu: [['bed', 10, 16, 34, 16], ['bed', 72, 16, 34, 16]] },
        { x: 100, y: 60, w: 120, h: 50, l: 'PARLOIR', f: 'tile', fu: [['table', 40, 16, 40, 14], ['chair', 30, 34, 10], ['chair', 82, 34, 10]] },
        { x: 220, y: 10, w: 120, h: 100, l: 'BUVETTE', f: 'tile', fu: [['counter', 10, 70, 100, 14], ['table', 20, 24, 24, 16], ['table', 70, 24, 24, 16]] }
      ]
    },
    /* Chapitres 7 et 14 · Hôtel Drouot, Paris */
    drouot: {
      label: 'L’Hôtel Drouot', unit: 'salle', t0: 15, view: 'plan',
      rooms: [
        R('Hall d’entrée', 'Hall', 'le hall d’entrée'), R('Salle des ventes 1', 'Salle 1', 'la salle des ventes 1'), R('Salle des ventes 2', 'Salle 2', 'la salle des ventes 2'),
        R('Vestiaire', 'Vestiaire', 'le vestiaire'), R('Salle d’exposition', 'Expo', 'la salle d’exposition'), R('Bureau du commissaire-priseur', 'Bureau', 'le bureau du commissaire-priseur'),
        R('Réserve', 'Réserve', 'la réserve'), R('Quai de chargement', 'Quai', 'le quai de chargement', { on: 1 })
      ],
      doors: [[0, 1], [1, 2], [0, 3], [1, 4], [4, 5], [2, 5], [4, 6], [6, 7], [5, 7]],
      geo: [
        { x: 10, y: 130, w: 100, h: 70, l: 'HALL', f: 'check', fu: [['plant', 8, 26, 14, 24], ['plant', 78, 26, 14, 24]] },
        { x: 110, y: 130, w: 120, h: 70, l: 'SALLE 1', f: 'wood', fu: [['desk', 40, 18, 40, 12], ['chair', 20, 48, 10], ['chair', 46, 48, 10], ['chair', 72, 48, 10], ['chair', 98, 48, 10]] },
        { x: 230, y: 130, w: 110, h: 70, l: 'SALLE 2', f: 'wood', fu: [['desk', 34, 18, 40, 12], ['chair', 18, 48, 10], ['chair', 44, 48, 10], ['chair', 70, 48, 10]] },
        { x: 10, y: 70, w: 60, h: 60, l: 'VESTIAIRE', f: 'diamond', fu: [['shelf', 6, 20, 48, 10]] },
        { x: 70, y: 70, w: 160, h: 60, l: 'EXPOSITION', f: 'diamond', fu: [['mirror', 20, 20, 14, 26], ['table', 64, 30, 30, 14], ['mirror', 120, 20, 14, 26]] },
        { x: 230, y: 70, w: 110, h: 60, l: 'BUREAU', f: 'wood', fu: [['desk', 22, 30, 50, 14], ['safe', 84, 18, 18, 18]] },
        { x: 10, y: 10, w: 160, h: 60, l: 'RÉSERVE', f: 'steel', fu: [['crate', 12, 24, 20, 20], ['crate', 40, 30, 18, 18], ['shelf', 80, 14, 70, 10]] },
        { x: 170, y: 10, w: 170, h: 60, l: 'QUAI', f: 'steel', out: 1, fu: [['crate', 20, 26, 22, 22], ['crate', 120, 22, 22, 22]] }
      ]
    },
    /* Chapitre 8 · Château de Montfaucon, Sologne */
    chateau: {
      label: 'Le château de Montfaucon', unit: 'pièce', t0: 20, view: 'plan',
      rooms: [
        R('Grand salon', 'Salon', 'le grand salon'), R('Galerie des portraits', 'Galerie', 'la galerie des portraits'), R('Salle d’armes', 'Armes', 'la salle d’armes'),
        R('Bibliothèque', 'Biblio.', 'la bibliothèque'), R('Cuisine', 'Cuisine', 'la cuisine'), R('Chapelle', 'Chapelle', 'la chapelle'),
        R('Chambre du marquis', 'Chambre', 'la chambre du marquis'), R('Crypte', 'Crypte', 'la crypte')
      ],
      doors: [[0, 1], [1, 2], [0, 3], [1, 4], [4, 5], [2, 5], [4, 6], [5, 7]],
      // passages secrets possibles (chaque épisode dit lequel existe et qui le connaît)
      secrets: [{ a: 3, b: 7, l: 'derrière la bibliothèque' }, { a: 6, b: 2, l: 'escalier dérobé' }],
      geo: [
        { x: 10, y: 120, w: 110, h: 80, l: 'SALON', f: 'wood', fu: [['sofa', 20, 50, 60, 18], ['piano', 70, 14, 30, 22]] },
        { x: 120, y: 120, w: 140, h: 80, l: 'GALERIE', f: 'diamond', fu: [['mirror', 14, 16, 14, 26], ['mirror', 62, 16, 14, 26], ['mirror', 110, 16, 14, 26]] },
        { x: 260, y: 120, w: 80, h: 80, l: 'ARMES', f: 'check', fu: [['shelf', 8, 14, 64, 10], ['table', 24, 46, 30, 16]] },
        { x: 10, y: 10, w: 110, h: 110, l: 'BIBLIO.', f: 'wood', fu: [['shelf', 8, 18, 94, 10], ['shelf', 8, 46, 94, 10], ['chair', 46, 84, 14]] },
        { x: 120, y: 60, w: 70, h: 60, l: 'CUISINE', f: 'tile', fu: [['counter', 6, 40, 58, 12], ['barrel', 48, 14, 12]] },
        { x: 190, y: 60, w: 150, h: 60, l: 'CHAPELLE', f: 'check', fu: [['chair', 30, 30, 10], ['chair', 56, 30, 10], ['chair', 82, 30, 10], ['table', 112, 20, 24, 18]] },
        { x: 120, y: 10, w: 120, h: 50, l: 'CHAMBRE', f: 'wood', fu: [['bed', 14, 14, 40, 22], ['plant', 92, 14, 12, 20]] },
        { x: 240, y: 10, w: 100, h: 50, l: 'CRYPTE', f: 'steel', fu: [['crate', 20, 18, 22, 18], ['crate', 60, 18, 22, 18]] }
      ]
    },
    /* Chapitre 9 · Train de nuit Paris–Venise (même dessin de train que l'Express) */
    simplon: {
      label: 'Le Simplon-Orient de nuit', unit: 'voiture', t0: 22, view: 'train',
      rooms: [
        R('Fourgon à bagages', 'Fourgon', 'le fourgon à bagages'), R('Voiture-lits A', 'Lits A', 'la voiture-lits A'), R('Voiture-lits B', 'Lits B', 'la voiture-lits B'),
        R('Voiture-restaurant', 'Resto', 'la voiture-restaurant'), R('Voiture-salon', 'Salon', 'la voiture-salon'),
        R('Voiture d’observation', 'Observ.', 'la voiture d’observation'), R('Toit du train', 'Toit', 'le toit du train', { on: 1 })
      ],
      doors: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [6, 2], [6, 4]],
      labels: ['FOURGON', 'LITS A', 'LITS B', 'RESTO', 'SALON', 'OBSERV.']
    },
    /* Chapitre 10 · Ca' Doppio, palais sur le Grand Canal, Venise */
    venise: {
      label: 'Le palais Ca’ Doppio', unit: 'salle', t0: 21, view: 'plan',
      rooms: [
        R('Salle de bal', 'Bal', 'la salle de bal'), R('Escalier d’honneur', 'Escalier', 'l’escalier d’honneur'), R('Salon des miroirs', 'Miroirs', 'le salon des miroirs'),
        R('Loggia', 'Loggia', 'la loggia', { on: 1 }), R('Cabinet des masques', 'Masques', 'le cabinet des masques'), R('Cuisines', 'Cuisines', 'les cuisines'),
        R('Ponton des gondoles', 'Ponton', 'le ponton des gondoles', { on: 1 })
      ],
      doors: [[0, 1], [1, 2], [0, 3], [0, 4], [3, 4], [4, 5], [5, 6], [2, 5]],
      geo: [
        { x: 10, y: 110, w: 150, h: 90, l: 'BAL', f: 'diamond', fu: [['piano', 16, 16, 34, 24], ['plant', 120, 20, 14, 24]] },
        { x: 160, y: 110, w: 60, h: 90, l: 'ESCALIER', f: 'check', fu: [['plant', 22, 60, 14, 22]] },
        { x: 220, y: 110, w: 120, h: 90, l: 'MIROIRS', f: 'wood', fu: [['mirror', 14, 16, 14, 26], ['mirror', 54, 16, 14, 26], ['mirror', 94, 16, 14, 26], ['sofa', 30, 62, 56, 16]] },
        { x: 10, y: 10, w: 100, h: 100, l: 'LOGGIA', f: 'check', out: 1, fu: [['plant', 10, 14, 14, 22], ['table', 40, 50, 26, 16]] },
        { x: 110, y: 10, w: 90, h: 100, l: 'MASQUES', f: 'wood', fu: [['shelf', 8, 16, 74, 10], ['shelf', 8, 46, 74, 10], ['mirror', 34, 72, 14, 22]] },
        { x: 200, y: 60, w: 140, h: 50, l: 'CUISINES', f: 'tile', fu: [['counter', 10, 30, 120, 12]] },
        { x: 200, y: 10, w: 140, h: 50, l: 'PONTON', f: 'deck', out: 1, fu: [['crate', 100, 16, 18, 18]] }
      ]
    },
    /* Chapitre 11 · Hospice du Grand-Col, Alpes */
    hospice: {
      label: 'L’hospice du Grand-Col', unit: 'pièce', t0: 19, view: 'plan',
      rooms: [
        R('Réfectoire', 'Réfect.', 'le réfectoire'), R('Salle commune', 'Commune', 'la salle commune'), R('Chenil', 'Chenil', 'le chenil'),
        R('Cuisine', 'Cuisine', 'la cuisine'), R('Chapelle', 'Chapelle', 'la chapelle'), R('Dortoir', 'Dortoir', 'le dortoir'),
        R('Cave à fromages', 'Cave', 'la cave à fromages')
      ],
      doors: [[0, 1], [1, 2], [0, 3], [0, 4], [1, 5], [4, 5], [2, 6], [5, 6]],
      geo: [
        { x: 10, y: 110, w: 130, h: 90, l: 'RÉFECTOIRE', f: 'wood', fu: [['table', 14, 30, 100, 18], ['chair', 24, 60, 10], ['chair', 60, 60, 10], ['chair', 96, 60, 10]] },
        { x: 140, y: 110, w: 110, h: 90, l: 'COMMUNE', f: 'wood', fu: [['sofa', 20, 52, 60, 16], ['barrel', 80, 16, 14]] },
        { x: 250, y: 110, w: 90, h: 90, l: 'CHENIL', f: 'grass', fu: [['crate', 12, 50, 22, 20], ['crate', 52, 50, 22, 20]] },
        { x: 10, y: 10, w: 80, h: 100, l: 'CUISINE', f: 'tile', fu: [['counter', 8, 70, 64, 12], ['barrel', 50, 20, 14]] },
        { x: 90, y: 10, w: 100, h: 100, l: 'CHAPELLE', f: 'check', fu: [['chair', 26, 50, 10], ['chair', 56, 50, 10], ['table', 36, 16, 28, 16]] },
        { x: 190, y: 10, w: 90, h: 100, l: 'DORTOIR', f: 'wood', fu: [['bed', 8, 14, 32, 18], ['bed', 48, 14, 32, 18], ['bed', 8, 60, 32, 18], ['bed', 48, 60, 32, 18]] },
        { x: 280, y: 10, w: 60, h: 100, l: 'CAVE', f: 'steel', fu: [['barrel', 14, 24, 14], ['barrel', 14, 60, 14], ['shelf', 34, 20, 18, 60]] }
      ]
    },
    /* Chapitre 12 · Banque Lombard & Fils, Genève */
    banque: {
      label: 'La banque Lombard & Fils', unit: 'pièce', t0: 18, view: 'plan',
      rooms: [
        R('Hall', 'Hall', 'le hall'), R('Guichets', 'Guichets', 'les guichets'), R('Bureau du directeur', 'Directeur', 'le bureau du directeur'),
        R('Escalier', 'Escalier', 'l’escalier'), R('Couloir', 'Couloir', 'le couloir'), R('Salle du conseil', 'Conseil', 'la salle du conseil'),
        R('Local des gardiens', 'Gardiens', 'le local des gardiens'), R('Salle des coffres', 'Coffres', 'la salle des coffres')
      ],
      doors: [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [4, 5], [3, 6], [4, 7], [6, 7]],
      geo: [
        { x: 10, y: 130, w: 110, h: 70, l: 'HALL', f: 'check', fu: [['plant', 8, 26, 14, 24], ['sofa', 40, 46, 50, 14]] },
        { x: 120, y: 130, w: 120, h: 70, l: 'GUICHETS', f: 'diamond', fu: [['counter', 8, 20, 104, 14], ['chair', 30, 50, 10], ['chair', 80, 50, 10]] },
        { x: 240, y: 130, w: 100, h: 70, l: 'DIRECTEUR', f: 'wood', fu: [['desk', 22, 34, 52, 16], ['safe', 76, 12, 18, 18]] },
        { x: 10, y: 70, w: 60, h: 60, l: 'ESCALIER', f: 'check', fu: [] },
        { x: 70, y: 70, w: 170, h: 60, l: 'COULOIR', f: 'diamond', fu: [['plant', 10, 24, 14, 22], ['plant', 146, 24, 14, 22]] },
        { x: 240, y: 70, w: 100, h: 60, l: 'CONSEIL', f: 'wood', fu: [['table', 20, 22, 60, 18]] },
        { x: 10, y: 10, w: 110, h: 60, l: 'GARDIENS', f: 'steel', fu: [['table', 20, 20, 30, 14], ['tv', 70, 14, 22, 16]] },
        { x: 120, y: 10, w: 220, h: 60, l: 'COFFRES', f: 'steel', fu: [['safe', 14, 16, 22, 22], ['safe', 50, 16, 22, 22], ['safe', 86, 16, 22, 22], ['safe', 122, 16, 22, 22], ['safe', 158, 16, 22, 22]] }
      ]
    },
    /* Chapitre 13 · Musée de cire des Boulevards, Paris */
    musee: {
      label: 'Le musée de cire des Boulevards', unit: 'salle', t0: 20, view: 'plan',
      rooms: [
        R('Hall des glaces', 'Glaces', 'le hall des glaces'), R('Galerie des rois', 'Rois', 'la galerie des rois'), R('Salle des grands criminels', 'Criminels', 'la salle des grands criminels'),
        R('Atelier des cires', 'Atelier', 'l’atelier des cires'), R('Petit théâtre', 'Théâtre', 'le petit théâtre'), R('Palais des mirages', 'Mirages', 'le palais des mirages'),
        R('Réserve', 'Réserve', 'la réserve'), R('Loge des artistes', 'Loge', 'la loge des artistes')
      ],
      doors: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [4, 5], [3, 6], [6, 7], [5, 7]],
      geo: [
        { x: 10, y: 120, w: 100, h: 80, l: 'GLACES', f: 'check', fu: [['mirror', 12, 16, 14, 26], ['mirror', 72, 16, 14, 26]] },
        { x: 110, y: 120, w: 130, h: 80, l: 'ROIS', f: 'diamond', fu: [['chair', 20, 30, 14], ['chair', 58, 30, 14], ['chair', 96, 30, 14]] },
        { x: 240, y: 120, w: 100, h: 80, l: 'CRIMINELS', f: 'wood', fu: [['chair', 16, 30, 14], ['chair', 68, 30, 14]] },
        { x: 10, y: 10, w: 100, h: 110, l: 'ATELIER', f: 'tile', fu: [['table', 14, 30, 60, 18], ['barrel', 70, 76, 14]] },
        { x: 110, y: 60, w: 130, h: 60, l: 'THÉÂTRE', f: 'seats', fu: [] },
        { x: 240, y: 60, w: 100, h: 60, l: 'MIRAGES', f: 'diamond', fu: [['mirror', 14, 14, 14, 26], ['mirror', 44, 14, 14, 26], ['mirror', 74, 14, 14, 26]] },
        { x: 110, y: 10, w: 130, h: 50, l: 'RÉSERVE', f: 'steel', fu: [['crate', 14, 16, 18, 18], ['crate', 44, 16, 18, 18], ['shelf', 80, 10, 40, 10]] },
        { x: 240, y: 10, w: 100, h: 50, l: 'LOGE', f: 'wood', fu: [['mirror', 12, 10, 14, 26], ['sofa', 40, 26, 44, 14]] }
      ]
    }
  };

  var EN_PLACES = {
    palais: { label: 'The Law Courts', unit: 'room', rooms: [['Great Hall', 'Hall', 'the great hall'], ['Courtroom', 'Court', 'the courtroom'], ['Judge’s chambers', 'Judge', 'the judge’s chambers'], ['Clerk’s office', 'Clerk', 'the clerk’s office'], ['Cell corridor', 'Cells', 'the cell corridor'], ['Visiting room', 'Visiting', 'the visiting room'], ['Canteen', 'Canteen', 'the canteen']], labels: ['GREAT HALL', 'COURT', 'JUDGE', 'CLERK', 'CELLS', 'VISITING', 'CANTEEN'] },
    drouot: { label: 'The Hôtel Drouot', unit: 'room', rooms: [['Entrance hall', 'Hall', 'the entrance hall'], ['Saleroom 1', 'Room 1', 'saleroom 1'], ['Saleroom 2', 'Room 2', 'saleroom 2'], ['Cloakroom', 'Cloaks', 'the cloakroom'], ['Viewing room', 'Viewing', 'the viewing room'], ['Auctioneer’s office', 'Office', 'the auctioneer’s office'], ['Storeroom', 'Store', 'the storeroom'], ['Loading dock', 'Dock', 'the loading dock']], labels: ['HALL', 'ROOM 1', 'ROOM 2', 'CLOAKS', 'VIEWING', 'OFFICE', 'STOREROOM', 'DOCK'] },
    chateau: { label: 'Montfaucon Castle', unit: 'room', rooms: [['Grand salon', 'Salon', 'the grand salon'], ['Portrait gallery', 'Gallery', 'the portrait gallery'], ['Armoury', 'Armoury', 'the armoury'], ['Library', 'Library', 'the library'], ['Kitchen', 'Kitchen', 'the kitchen'], ['Chapel', 'Chapel', 'the chapel'], ['Marquis’s bedroom', 'Bedroom', 'the marquis’s bedroom'], ['Crypt', 'Crypt', 'the crypt']], labels: ['SALON', 'GALLERY', 'ARMOURY', 'LIBRARY', 'KITCHEN', 'CHAPEL', 'BEDROOM', 'CRYPT'] },
    simplon: { label: 'The Simplon Night Express', unit: 'car', rooms: [['Luggage van', 'Luggage', 'the luggage van'], ['Sleeper A', 'Sleeper A', 'sleeper A'], ['Sleeper B', 'Sleeper B', 'sleeper B'], ['Dining car', 'Diner', 'the dining car'], ['Lounge car', 'Lounge', 'the lounge car'], ['Observation car', 'Observ.', 'the observation car'], ['Train roof', 'Roof', 'the roof of the train']], labels: ['LUGGAGE', 'SLEEPER A', 'SLEEPER B', 'DINER', 'LOUNGE', 'OBSERV.'] },
    venise: { label: 'The Ca’ Doppio palace', unit: 'room', rooms: [['Ballroom', 'Ballroom', 'the ballroom'], ['Grand staircase', 'Stairs', 'the grand staircase'], ['Hall of mirrors', 'Mirrors', 'the hall of mirrors'], ['Loggia', 'Loggia', 'the loggia'], ['Mask cabinet', 'Masks', 'the mask cabinet'], ['Kitchens', 'Kitchens', 'the kitchens'], ['Gondola landing', 'Landing', 'the gondola landing']], labels: ['BALLROOM', 'STAIRS', 'MIRRORS', 'LOGGIA', 'MASKS', 'KITCHENS', 'LANDING'] },
    hospice: { label: 'The Grand-Col hospice', unit: 'room', rooms: [['Refectory', 'Refect.', 'the refectory'], ['Common room', 'Common', 'the common room'], ['Kennels', 'Kennels', 'the kennels'], ['Kitchen', 'Kitchen', 'the kitchen'], ['Chapel', 'Chapel', 'the chapel'], ['Dormitory', 'Dorm', 'the dormitory'], ['Cheese cellar', 'Cellar', 'the cheese cellar']], labels: ['REFECTORY', 'COMMON', 'KENNELS', 'KITCHEN', 'CHAPEL', 'DORM', 'CELLAR'] },
    banque: { label: 'The Lombard & Sons bank', unit: 'room', rooms: [['Hall', 'Hall', 'the hall'], ['Counters', 'Counters', 'the counters'], ['Director’s office', 'Director', 'the director’s office'], ['Staircase', 'Stairs', 'the staircase'], ['Corridor', 'Corridor', 'the corridor'], ['Boardroom', 'Board', 'the boardroom'], ['Guards’ room', 'Guards', 'the guards’ room'], ['Vault', 'Vault', 'the vault']], labels: ['HALL', 'COUNTERS', 'DIRECTOR', 'STAIRS', 'CORRIDOR', 'BOARD', 'GUARDS', 'VAULT'] },
    musee: { label: 'The Boulevards Wax Museum', unit: 'room', rooms: [['Hall of mirrors', 'Mirrors', 'the hall of mirrors'], ['Gallery of kings', 'Kings', 'the gallery of kings'], ['Chamber of great criminals', 'Criminals', 'the chamber of great criminals'], ['Wax workshop', 'Workshop', 'the wax workshop'], ['Little theatre', 'Theatre', 'the little theatre'], ['Palace of illusions', 'Illusions', 'the palace of illusions'], ['Storeroom', 'Store', 'the storeroom'], ['Artists’ dressing room', 'Dressing', 'the artists’ dressing room']], labels: ['MIRRORS', 'KINGS', 'CRIMINALS', 'WORKSHOP', 'THEATRE', 'ILLUSIONS', 'STOREROOM', 'DRESSING'] }
  };

  // Nouveaux personnages (les anciens viennent de la campagne 1)
  var CAST = {
    'Inspecteur Armand Songe': { short: 'Songe', role: 'inspecteur', f: false },
    'Juge Odile Hibéré': { short: 'Hibéré', role: 'juge', f: true },
    'Gédéon Barreau': { short: 'Barreau', role: 'gardien de prison', f: false },
    'Maître Adjugé Vandu': { short: 'Vandu', role: 'commissaire-priseur', f: false },
    'Ana Gramme': { short: 'Ana', role: 'critique d’art', f: true },
    'Marquis Hugues de Montfaucon': { short: 'Marquis', role: 'châtelain', f: false },
    'Pia Doppio': { short: 'Pia', role: 'danseuse', f: true },
    'Paola Doppio': { short: 'Paola', role: 'danseuse', f: true },
    'Frère Bernard Lhermite': { short: 'Frère Bernard', role: 'moine hospitalier', f: false },
    'Frank Suisse': { short: 'Suisse', role: 'banquier', f: false },
    'Gaspard Pièce': { short: 'Gaspard', role: 'serrurier', f: false },
    'Cyrielle Bougie': { short: 'Cyrielle', role: 'sculptrice sur cire', f: true },
    'Monsieur Moustache': { short: 'Moustache', role: 'chat du vestiaire', f: false },
    'Barnabé': { short: 'Barnabé', role: 'gardien de nuit', f: false }
  };
  var EN_ROLES = {
    'inspecteur': 'inspector', 'juge': 'judge', 'gardien de prison': 'prison guard', 'commissaire-priseur': 'auctioneer',
    'critique d’art': 'art critic', 'châtelain': 'lord of the manor', 'danseuse': 'dancer', 'moine hospitalier': 'hospice monk',
    'banquier': 'banker', 'serrurier': 'locksmith', 'sculptrice sur cire': 'wax sculptor', 'chat du vestiaire': 'cloakroom cat', 'gardien de nuit': 'night watchman'
  };
  // Noms anglais (si besoin d'adapter un jeu de mots)
  var EN_NAMES = {
    'Inspecteur Armand Songe': 'Inspector Armand Songe', 'Juge Odile Hibéré': 'Judge Odile Hibéré', 'Frère Bernard Lhermite': 'Brother Bernard Lhermite',
    'Marquis Hugues de Montfaucon': 'Marquis Hugues de Montfaucon', 'Maître Adjugé Vandu': 'Master Adjugé Vandu'
  };

  function install(W) {
    var k;
    for (k in PLACES) W.PLACES[k] = PLACES[k];
    if (W.EN_PLACES) for (k in EN_PLACES) W.EN_PLACES[k] = EN_PLACES[k];
    for (k in CAST) W.CAST[k] = CAST[k];
    if (W.EN_ROLES) for (k in EN_ROLES) W.EN_ROLES[k] = EN_ROLES[k];
  }
  return { PLACES: PLACES, EN_PLACES: EN_PLACES, CAST: CAST, EN_ROLES: EN_ROLES, EN_NAMES: EN_NAMES, install: install };
});
