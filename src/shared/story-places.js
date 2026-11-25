
/* Mode histoire : les six lieux (graphes de pièces + plans) et la distribution complète. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.KioukanWorld = factory(root.KioukanEngine);
})(typeof self !== 'undefined' ? self : this, function (E) {
  var R = function (name, short, the, extra) { var o = { name: name, short: short, the: the }; if (extra) for (var k in extra) o[k] = extra[k]; return o; };

  /* Plans vus de dessus (viewBox 350 x 210) : x, y, w, h, motif de sol, extérieur, mobilier, étiquette courte */
  var PLACES = {
    express: {
      label: 'L’Express de minuit', unit: 'voiture', t0: 21, view: 'train',
      rooms: [
        R('Fourgon', 'Fourgon', 'le fourgon'), R('Wagon-lit A', 'Lit A', 'le wagon-lit A'), R('Wagon-lit B', 'Lit B', 'le wagon-lit B'),
        R('Wagon-restaurant', 'Resto', 'le wagon-restaurant'), R('Voiture-bar', 'Bar', 'la voiture-bar'),
        R('Salon-fumoir', 'Fumoir', 'le salon-fumoir'), R('Toit du train', 'Toit', 'le toit du train', { on: 1 })
      ],
      doors: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [6, 2], [6, 4]],
      labels: ['FOURGON', 'LIT A', 'LIT B', 'RESTO', 'BAR', 'FUMOIR']
    },
    palace: {
      label: 'Le Grand Hôtel des Mouettes', unit: 'pièce', t0: 20, view: 'plan',
      rooms: [
        R('Bar', 'Bar', 'le bar'), R('Réception', 'Récep.', 'la réception'), R('Restaurant', 'Resto', 'le restaurant'),
        R('Cuisines', 'Cuisines', 'les cuisines'), R('Ascenseur', 'Ascens.', 'l’ascenseur'), R('Couloir', 'Couloir', 'le couloir'),
        R('Suite 12', 'Suite 12', 'la suite 12'), R('Terrasse', 'Terrasse', 'la terrasse', { on: 1 })
      ],
      doors: [[1, 0], [1, 2], [2, 3], [1, 4], [4, 5], [4, 7], [5, 6], [3, 6]],
      geo: [
        { x: 10, y: 125, w: 85, h: 75, l: 'BAR', f: 'wood', fu: [['counter', 6, 56, 73, 14], ['stool', 16, 48, 9], ['stool', 40, 48, 9], ['stool', 64, 48, 9]] },
        { x: 95, y: 125, w: 95, h: 75, l: 'RÉCEPTION', f: 'check', fu: [['desk', 20, 54, 55, 16], ['plant', 78, 26, 14, 22]] },
        { x: 190, y: 125, w: 80, h: 75, l: 'RESTAURANT', f: 'diamond', fu: [['table', 6, 52, 24, 16], ['table', 48, 52, 24, 16]] },
        { x: 270, y: 125, w: 70, h: 75, l: 'CUISINES', f: 'tile', fu: [['counter', 5, 58, 60, 13]] },
        { x: 95, y: 55, w: 45, h: 70, l: 'ASC.', f: 'steel', fu: [['lift', 10, 46, 25, 18]] },
        { x: 140, y: 55, w: 130, h: 70, l: 'COULOIR', f: 'diamond', fu: [['plant', 8, 40, 14, 22], ['plant', 108, 40, 14, 22]] },
        { x: 270, y: 55, w: 70, h: 70, l: 'SUITE 12', f: 'wood', fu: [['bed', 6, 44, 38, 20], ['plant', 52, 28, 12, 20]] },
        { x: 95, y: 10, w: 245, h: 45, l: 'TERRASSE', f: 'grass', out: 1, fu: [['tree', 22, 32, 18], ['table', 112, 28, 22, 12], ['tree', 222, 32, 18]] }
      ],
      empty: [{ x: 10, y: 10, w: 85, h: 115, kind: 'sea' }]
    },
    manoir: {
      label: 'Le Manoir des Oliviers', unit: 'pièce', t0: 19, view: 'plan',
      rooms: [
        R('Hall', 'Hall', 'le hall'), R('Salon', 'Salon', 'le salon'), R('Cuisine', 'Cuisine', 'la cuisine'),
        R('Bibliothèque', 'Biblio.', 'la bibliothèque'), R('Bureau', 'Bureau', 'le bureau'), R('Cave', 'Cave', 'la cave'), R('Jardin', 'Jardin', 'le jardin')
      ],
      doors: [[3, 4], [3, 1], [4, 0], [1, 0], [0, 2], [2, 5], [0, 6], [2, 6]],
      geo: [
        { x: 120, y: 80, w: 110, h: 70, f: 'check', fu: [['plant', 90, 34, 16, 26], ['table', 8, 46, 28, 16]] },
        { x: 10, y: 80, w: 110, h: 70, f: 'wood', fu: [['sofa', 8, 46, 48, 18], ['plant', 92, 24, 14, 22]] },
        { x: 230, y: 80, w: 110, h: 70, f: 'tile', fu: [['counter', 6, 50, 98, 14], ['table', 78, 24, 26, 16]] },
        { x: 10, y: 10, w: 110, h: 70, f: 'wood', fu: [['shelf', 6, 52, 98, 12], ['chair', 84, 28, 14, 14]] },
        { x: 120, y: 10, w: 110, h: 70, f: 'diamond', fu: [['desk', 30, 48, 50, 16], ['plant', 90, 30, 14, 24]] },
        { x: 230, y: 10, w: 110, h: 70, f: 'steel', fu: [['crate', 8, 44, 20, 20], ['barrel', 46, 48, 18, 16], ['crate', 82, 44, 20, 20]] },
        { x: 10, y: 150, w: 330, h: 50, f: 'grass', out: 1, fu: [['tree', 24, 34, 18], ['tree', 306, 34, 18], ['plant', 230, 28, 12, 18]] }
      ]
    },
    paquebot: {
      label: 'Le paquebot Bel Azur', unit: 'pièce', t0: 20, view: 'plan',
      rooms: [
        R('Pont promenade', 'Pont', 'le pont promenade', { on: 1 }), R('Passerelle', 'Passer.', 'la passerelle', { on: 1 }), R('Salon de musique', 'Musique', 'le salon de musique'),
        R('Salle à manger', 'S. à m.', 'la salle à manger'), R('Coursive', 'Coursive', 'la coursive'), R('Cabine 7', 'Cab. 7', 'la cabine 7'),
        R('Cabine 12', 'Cab. 12', 'la cabine 12'), R('Salle des machines', 'Machines', 'la salle des machines')
      ],
      doors: [[0, 1], [0, 2], [0, 3], [2, 4], [3, 4], [4, 5], [4, 6], [4, 7]],
      geo: [
        { x: 10, y: 10, w: 330, h: 40, l: 'PONT PROMENADE', f: 'deck', out: 1, fu: [['chair', 60, 18, 14, 14], ['chair', 90, 18, 14, 14], ['chair', 230, 18, 14, 14], ['plant', 300, 14, 12, 18]] },
        { x: 10, y: 50, w: 70, h: 70, l: 'PASSERELLE', f: 'wood', out: 0, fu: [['wheel', 22, 30, 26, 26]] },
        { x: 80, y: 50, w: 130, h: 70, l: 'SALON DE MUSIQUE', f: 'diamond', fu: [['piano', 12, 34, 40, 22], ['sofa', 70, 44, 46, 16]] },
        { x: 210, y: 50, w: 130, h: 70, l: 'SALLE À MANGER', f: 'check', fu: [['table', 14, 40, 26, 16], ['table', 52, 40, 26, 16], ['table', 90, 40, 26, 16]] },
        { x: 80, y: 120, w: 260, h: 30, l: 'COURSIVE', f: 'tile', fu: [] },
        { x: 80, y: 150, w: 85, h: 50, l: 'CABINE 7', f: 'wood', fu: [['bed', 8, 24, 36, 18]] },
        { x: 165, y: 150, w: 85, h: 50, l: 'CABINE 12', f: 'wood', fu: [['bed', 8, 24, 36, 18]] },
        { x: 250, y: 150, w: 90, h: 50, l: 'MACHINES', f: 'steel', fu: [['crate', 8, 22, 18, 18], ['barrel', 40, 24, 16, 14], ['vent', 64, 28, 18, 10]] }
      ],
      empty: [{ x: 10, y: 120, w: 70, h: 80, kind: 'sea' }]
    },
    opera: {
      label: 'L’Opéra de Monte-Carlo', unit: 'pièce', t0: 20, view: 'plan',
      rooms: [
        R('Scène', 'Scène', 'la scène', { on: 1 }), R('Coulisses', 'Coulisses', 'les coulisses'), R('Loge de la diva', 'Loge', 'la loge de la diva'),
        R('Fosse d’orchestre', 'Fosse', 'la fosse d’orchestre'), R('Foyer', 'Foyer', 'le foyer'), R('Parterre', 'Parterre', 'le parterre'),
        R('Cintres', 'Cintres', 'les cintres'), R('Machinerie', 'Machin.', 'la machinerie')
      ],
      doors: [[0, 1], [0, 3], [0, 6], [1, 2], [1, 4], [4, 5], [3, 5], [7, 0], [7, 6]],
      geo: [
        { x: 150, y: 50, w: 130, h: 80, l: 'SCÈNE', f: 'wood', fu: [['plant', 10, 40, 12, 20], ['chair', 58, 44, 14, 14]] },
        { x: 70, y: 50, w: 80, h: 80, l: 'COULISSES', f: 'steel', fu: [['crate', 8, 46, 20, 20], ['crate', 44, 50, 16, 16]] },
        { x: 10, y: 50, w: 60, h: 80, l: 'LOGE', f: 'check', fu: [['mirror', 8, 30, 22, 14], ['sofa', 8, 56, 40, 14]] },
        { x: 150, y: 130, w: 130, h: 30, l: 'FOSSE', f: 'tile', fu: [] },
        { x: 10, y: 130, w: 140, h: 70, l: 'FOYER', f: 'diamond', fu: [['sofa', 14, 40, 46, 16], ['plant', 110, 34, 14, 24]] },
        { x: 150, y: 160, w: 130, h: 40, l: 'PARTERRE', f: 'seats', fu: [] },
        { x: 150, y: 10, w: 130, h: 40, l: 'CINTRES', f: 'steel', fu: [['vent', 20, 22, 18, 10], ['vent', 90, 22, 18, 10]] },
        { x: 280, y: 10, w: 60, h: 190, l: 'MACHIN.', f: 'steel', fu: [['crate', 18, 120, 22, 22], ['barrel', 22, 160, 16, 14]] }
      ],
      empty: [{ x: 10, y: 10, w: 140, h: 40, kind: 'curtain' }]
    },
    casino: {
      label: 'Le Casino de Monte-Carlo', unit: 'pièce', t0: 21, view: 'plan',
      rooms: [
        R('Terrasse', 'Terrasse', 'la terrasse', { on: 1 }), R('Bar américain', 'Bar', 'le bar américain'), R('Hall', 'Hall', 'le hall'),
        R('Bureau du directeur', 'Bureau', 'le bureau du directeur'), R('Salon privé', 'Salon', 'le salon privé'), R('Salle de jeu', 'Jeu', 'la salle de jeu'),
        R('Caisse', 'Caisse', 'la caisse')
      ],
      doors: [[2, 5], [2, 1], [2, 0], [5, 4], [5, 6], [6, 3], [1, 0]],
      geo: [
        { x: 10, y: 10, w: 330, h: 40, l: 'TERRASSE', f: 'grass', out: 1, fu: [['tree', 30, 22, 16], ['table', 150, 14, 22, 12], ['tree', 300, 22, 16]] },
        { x: 10, y: 50, w: 100, h: 70, l: 'BAR', f: 'wood', fu: [['counter', 8, 46, 84, 14], ['stool', 22, 38, 9], ['stool', 50, 38, 9]] },
        { x: 110, y: 50, w: 120, h: 70, l: 'HALL', f: 'check', fu: [['plant', 8, 30, 14, 24], ['plant', 98, 30, 14, 24]] },
        { x: 230, y: 50, w: 110, h: 70, l: 'BUREAU', f: 'diamond', fu: [['desk', 28, 40, 50, 16], ['crate', 86, 20, 16, 16]] },
        { x: 10, y: 120, w: 100, h: 80, l: 'SALON PRIVÉ', f: 'wood', fu: [['table', 30, 40, 36, 22]] },
        { x: 110, y: 120, w: 120, h: 80, l: 'SALLE DE JEU', f: 'felt', fu: [['roulette', 20, 30, 34, 34], ['table', 70, 40, 34, 20]] },
        { x: 230, y: 120, w: 110, h: 80, l: 'CAISSE', f: 'tile', fu: [['counter', 10, 52, 90, 14], ['safe', 80, 18, 20, 20]] }
      ]
    }
  };


  /* Version anglaise du lieu du chapitre 1 */
  var EN_PLACES = {
    express: { label: 'The Midnight Express', unit: 'car', rooms: [['Luggage van','Luggage','the luggage van'],['Sleeper A','Sleeper A','sleeper A'],['Sleeper B','Sleeper B','sleeper B'],['Dining car','Diner','the dining car'],['Bar car','Bar','the bar car'],['Smoking lounge','Smoking','the smoking lounge'],['Train roof','Roof','the roof of the train']], labels: ['LUGGAGE', 'SLEEPER A', 'SLEEPER B', 'DINER', 'BAR', 'SMOKING'] },
    palace: { label: "The Grand Hotel of Gulls", unit: 'room', rooms: [["Bar", "Bar", "the bar"], ["Reception", "Recep.", "the reception"], ["Restaurant", "Resto", "the restaurant"], ["Kitchens", "Kitchens", "the kitchens"], ["Lift", "Lift", "the lift"], ["Corridor", "Corridor", "the corridor"], ["Suite 12", "Suite 12", "suite 12"], ["Terrace", "Terrace", "the terrace"]], labels: ["BAR", "RECEPTION", "RESTAURANT", "KITCHENS", "LIFT", "CORRIDOR", "SUITE 12", "TERRACE"] },
    manoir: { label: "The Olive Tree Manor", unit: 'room', rooms: [["Hall", "Hall", "the hall"], ["Drawing room", "Drawing", "the drawing room"], ["Kitchen", "Kitchen", "the kitchen"], ["Library", "Library", "the library"], ["Study", "Study", "the study"], ["Cellar", "Cellar", "the cellar"], ["Garden", "Garden", "the garden"]] },
    paquebot: { label: "The liner Bel Azur", unit: 'room', rooms: [["Promenade deck", "Deck", "the promenade deck"], ["Bridge", "Bridge", "the bridge"], ["Music room", "Music", "the music room"], ["Dining room", "Dining", "the dining room"], ["Gangway", "Gangway", "the gangway"], ["Cabin 7", "Cab. 7", "cabin 7"], ["Cabin 12", "Cab. 12", "cabin 12"], ["Engine room", "Engines", "the engine room"]], labels: ["PROMENADE DECK", "BRIDGE", "MUSIC ROOM", "DINING ROOM", "GANGWAY", "CABIN 7", "CABIN 12", "ENGINES"] },
    opera: { label: "The Monte Carlo Opera", unit: 'room', rooms: [["Stage", "Stage", "the stage"], ["Wings", "Wings", "the wings"], ["Diva’s dressing room", "Dressing", "the diva’s dressing room"], ["Orchestra pit", "Pit", "the orchestra pit"], ["Foyer", "Foyer", "the foyer"], ["Stalls", "Stalls", "the stalls"], ["Flies", "Flies", "the flies"], ["Machinery room", "Machin.", "the machinery room"]], labels: ["STAGE", "WINGS", "DRESSING", "PIT", "FOYER", "STALLS", "FLIES", "MACHIN."] },
    casino: { label: "The Monte Carlo Casino", unit: 'room', rooms: [["Terrace", "Terrace", "the terrace"], ["American bar", "Bar", "the American bar"], ["Hall", "Hall", "the hall"], ["Manager’s office", "Office", "the manager’s office"], ["Private lounge", "Lounge", "the private lounge"], ["Gaming room", "Gaming", "the gaming room"], ["Cash desk", "Cash", "the cash desk"]], labels: ["TERRACE", "BAR", "HALL", "OFFICE", "PRIVATE LOUNGE", "GAMING ROOM", "CASH DESK"] }
  };
  var EN_ROLES = { 'détective': 'detective', comtesse: 'countess', 'neveu fauché': 'broke nephew', cantatrice: 'opera singer', steward: 'steward', 'contrôleur': 'ticket inspector', 'archéologue': 'archaeologist', "chef de la sécurité": "head of security", "directeur": "manager", "femme de chambre": "chambermaid", "groom": "bellboy", "barman": "barman", "riche cliente": "wealthy guest", "chef": "chef", "notaire": "notary", "cousine": "cousin", "majordome": "butler", "cuisinière": "cook", "jardinier": "gardener", "médecin": "doctor", "mécanicien": "mechanic", "pianiste": "pianist", "passagère": "passenger", "romancière": "novelist", "capitaine": "captain", "ténor": "tenor", "habilleuse": "dresser", "souffleur": "prompter", "régisseur": "stage manager", "chef d’orchestre": "conductor", "croupier": "croupier", "joueuse": "gambler" };
  var IT_PLACES = {
    express: { label: 'L’Espresso di mezzanotte', unit: 'carrozza', rooms: [['Bagagliaio', 'Bagagli', 'il bagagliaio'], ['Vagone letto A', 'Letto A', 'il vagone letto A'], ['Vagone letto B', 'Letto B', 'il vagone letto B'], ['Vagone ristorante', 'Ristor.', 'il vagone ristorante'], ['Carrozza bar', 'Bar', 'la carrozza bar'], ['Salottino fumatori', 'Fumatori', 'il salottino fumatori'], ['Tetto del treno', 'Tetto', 'il tetto del treno']], labels: ['BAGAGLI', 'LETTO A', 'LETTO B', 'RISTOR.', 'BAR', 'FUMATORI'] },
    palace: { label: 'Il Grand Hotel dei Gabbiani', unit: 'stanza', rooms: [['Bar', 'Bar', 'il bar'], ['Reception', 'Recep.', 'la reception'], ['Ristorante', 'Ristor.', 'il ristorante'], ['Cucine', 'Cucine', 'le cucine'], ['Ascensore', 'Ascens.', 'l’ascensore'], ['Corridoio', 'Corridoio', 'il corridoio'], ['Suite 12', 'Suite 12', 'la suite 12'], ['Terrazza', 'Terrazza', 'la terrazza']], labels: ['BAR', 'RECEPTION', 'RISTORANTE', 'CUCINE', 'ASCENSORE', 'CORRIDOIO', 'SUITE 12', 'TERRAZZA'] },
    manoir: { label: 'Villa degli Ulivi', unit: 'stanza', rooms: [['Atrio', 'Atrio', 'l’atrio'], ['Salotto', 'Salotto', 'il salotto'], ['Cucina', 'Cucina', 'la cucina'], ['Biblioteca', 'Biblio.', 'la biblioteca'], ['Studio', 'Studio', 'lo studio'], ['Cantina', 'Cantina', 'la cantina'], ['Giardino', 'Giardino', 'il giardino']] },
    paquebot: { label: 'Il transatlantico Bel Azur', unit: 'locale', rooms: [['Ponte passeggiata', 'Ponte', 'il ponte passeggiata'], ['Plancia', 'Plancia', 'la plancia'], ['Salone della musica', 'Musica', 'il salone della musica'], ['Sala da pranzo', 'Pranzo', 'la sala da pranzo'], ['Corridoio', 'Corrid.', 'il corridoio'], ['Cabina 7', 'Cab. 7', 'la cabina 7'], ['Cabina 12', 'Cab. 12', 'la cabina 12'], ['Sala macchine', 'Macchine', 'la sala macchine']], labels: ['PONTE PASSEGGIATA', 'PLANCIA', 'SALONE MUSICA', 'SALA DA PRANZO', 'CORRIDOIO', 'CABINA 7', 'CABINA 12', 'MACCHINE'] },
    opera: { label: 'L’Opera di Monte Carlo', unit: 'locale', rooms: [['Palcoscenico', 'Palco', 'il palcoscenico'], ['Quinte', 'Quinte', 'le quinte'], ['Camerino della diva', 'Camerino', 'il camerino della diva'], ['Buca dell’orchestra', 'Buca', 'la buca dell’orchestra'], ['Ridotto', 'Ridotto', 'il ridotto'], ['Platea', 'Platea', 'la platea'], ['Graticcia', 'Graticcia', 'la graticcia'], ['Sala macchine', 'Macch.', 'la sala macchine']], labels: ['PALCO', 'QUINTE', 'CAMERINO', 'BUCA', 'RIDOTTO', 'PLATEA', 'GRATICCIA', 'MACCH.'] },
    casino: { label: 'Il Casinò di Monte Carlo', unit: 'sala', rooms: [['Terrazza', 'Terrazza', 'la terrazza'], ['Bar americano', 'Bar', 'il bar americano'], ['Atrio', 'Atrio', 'l’atrio'], ['Ufficio del direttore', 'Ufficio', 'l’ufficio del direttore'], ['Salottino privato', 'Salottino', 'il salottino privato'], ['Sala da gioco', 'Gioco', 'la sala da gioco'], ['Cassa', 'Cassa', 'la cassa']], labels: ['TERRAZZA', 'BAR', 'ATRIO', 'UFFICIO', 'SALOTTINO PRIVATO', 'SALA DA GIOCO', 'CASSA'] }
  };
  var IT_ROLES = { 'détective': 'investigatrice', comtesse: 'contessa', 'neveu fauché': 'nipote squattrinato', cantatrice: 'cantante lirica', steward: 'steward', 'contrôleur': 'controllore', 'archéologue': 'archeologo', 'chef de la sécurité': 'capo della sicurezza', directeur: 'direttore', 'femme de chambre': 'cameriera ai piani', groom: 'fattorino', barman: 'barista', 'riche cliente': 'ricca cliente', chef: 'chef', notaire: 'notaio', cousine: 'cugina', majordome: 'maggiordomo', 'cuisinière': 'cuoca', jardinier: 'giardiniere', 'médecin': 'medico', 'mécanicien': 'meccanico', pianiste: 'pianista', 'passagère': 'passeggera', 'romancière': 'romanziera', capitaine: 'capitano', 'ténor': 'tenore', habilleuse: 'sarta di scena', souffleur: 'suggeritore', 'régisseur': 'direttore di scena', 'chef d’orchestre': 'direttore d’orchestra', croupier: 'croupier', joueuse: 'giocatrice' };
  var IS_IT = typeof window !== 'undefined' && window.KIOUKAN_LANG === 'it';
  var IS_EN = typeof window !== 'undefined' && window.KIOUKAN_LANG === 'en';

  /* Distribution : nom (jeu de mots), nom court, rôle, féminin */
  var CAST = {
    'Hortense Lafleur': { short: 'Hortense', role: 'détective', f: true },
    'Comtesse Diane de Carat': { short: 'Comtesse', role: 'comtesse', f: true },
    // L'Express de minuit
    'Rémi Sansou': { short: 'Rémi', role: 'neveu fauché', f: false },
    'Aria Vibrato': { short: 'Aria', role: 'cantatrice', f: true },
    'Ernest Couchette': { short: 'Ernest', role: 'steward', f: false },
    'Jean Bilet': { short: 'Bilet', role: 'contrôleur', f: false },
    'Pr Hector Tumulus': { short: 'Tumulus', role: 'archéologue', f: false },
    // Le Grand Hôtel des Mouettes
    'Paul Ochon': { short: 'Ochon', role: 'directeur', f: false },
    'André Vivalto': { short: 'Vivalto', role: 'chef de la sécurité', f: false },
    'Lise Défait': { short: 'Lise', role: 'femme de chambre', f: true },
    'Max Valise': { short: 'Max', role: 'groom', f: false },
    'Jacques Teil': { short: 'Teil', role: 'barman', f: false },
    'Ginette Pépite': { short: 'Ginette', role: 'riche cliente', f: true },
    'Chef Al Dente': { short: 'Al Dente', role: 'chef', f: false },
    // Le Manoir des Oliviers
    'Maître Gérard Menvussa': { short: 'Menvussa', role: 'notaire', f: false },
    'Basile Bouture': { short: 'Basile', role: 'jardinier', f: false },
    'Julie Enne': { short: 'Julie', role: 'cuisinière', f: true },
    'Lucie Fer': { short: 'Lucie', role: 'cousine', f: true },
    'Hippolyte Plateau': { short: 'Hippolyte', role: 'majordome', f: false },
    'Dr Mehdi Cament': { short: 'Cament', role: 'médecin', f: false },
    // Le paquebot Bel Azur
    'Capitaine Jean Tempête': { short: 'Tempête', role: 'capitaine', f: false },
    'Marcel Hélice': { short: 'Marcel', role: 'mécanicien', f: false },
    'Paul Ka': { short: 'Paul Ka', role: 'pianiste', f: false },
    'Cécile Ence': { short: 'Cécile', role: 'passagère', f: true },
    'Agathe Crispie': { short: 'Agathe', role: 'romancière', f: true },
    // L'Opéra de Monte-Carlo
    'Enzo Lyrico': { short: 'Enzo', role: 'ténor', f: false },
    'Maestro Vivaldo Baguette': { short: 'Baguette', role: 'chef d’orchestre', f: false },
    'Paulette Paillette': { short: 'Paulette', role: 'habilleuse', f: true },
    'Gérard Rideau': { short: 'Rideau', role: 'régisseur', f: false },
    'Sam Souffle': { short: 'Sam', role: 'souffleur', f: false },
    // Le Casino de Monte-Carlo
    'René Vaplu': { short: 'René', role: 'croupier', f: false },
    'Jacques Potte': { short: 'Potte', role: 'directeur', f: false },
    'Bernadette Banco': { short: 'Banco', role: 'joueuse', f: true }
  };

  function scene(placeKey, suspectNames) {
    var P = PLACES[placeKey], X = (IS_EN && EN_PLACES[placeKey]) || (IS_IT && IT_PLACES[placeKey]);
    var rooms = P.rooms, label = P.label, unit = P.unit;
    if (X) {
      rooms = P.rooms.map(function (r, i) { var o = {}; for (var k in r) o[k] = r[k]; o.id = r.name; o.name = X.rooms[i][0]; o.short = X.rooms[i][1]; o.the = X.rooms[i][2]; if (IS_IT && E && E.itIn) o.inn = E.itIn(o.the, r.on); return o; });
      label = X.label; unit = X.unit;
    }
    return {
      label: label, unit: unit, t0: P.t0, rooms: rooms, doors: P.doors,
      suspects: suspectNames.map(function (n) { var c = CAST[n]; return { name: n, short: c.short, role: IS_EN ? (EN_ROLES[c.role] || c.role) : IS_IT ? (IT_ROLES[c.role] || c.role) : c.role, f: c.f }; })
    };
  }
  function use(key, placeKey, suspectNames) {
    E.SCENES[key] = scene(placeKey, suspectNames);
    E.setScene(key);
  }
  return { PLACES: PLACES, CAST: CAST, scene: scene, use: use, EN_PLACES: EN_PLACES, EN_ROLES: EN_ROLES, IT_PLACES: IT_PLACES, IT_ROLES: IT_ROLES, LOC_PLACES: IS_IT ? IT_PLACES : IS_EN ? EN_PLACES : null };
});

