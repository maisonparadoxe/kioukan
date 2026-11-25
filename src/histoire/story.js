
/* Mode histoire : trame, distribution et 42 épisodes.
   Jetons remplacés à l'affichage : {h} heure du méfait · {lieu} « dans le salon » · {coupable} nom du coupable. */
(function (root, factory) {
  var spec = factory();
  if (typeof module === 'object' && module.exports) module.exports = spec;
  else root.KioukanSpec = spec;
})(typeof self !== 'undefined' ? self : this, function () {
  var H = 'Hortense Lafleur', DIANE = 'Comtesse Diane de Carat';
  function cap(text, pos) { return { pos: pos || 'bl', text: text }; }
  function say(who, text, side) { return { who: who, text: text, side: side || 'l' }; }
  function shot(bg, o) { o = o || {}; o.bg = bg; o.h = o.h || (o.chars ? 0.92 : 0.62); return o; }
  function face(name, expr, extra) { var b = { chars: [{ name: name, expr: expr || 'neutre', x: 50, w: 82 }] }; for (var k in extra) b[k] = extra[k]; return b; }
  function close(bg, name, expr, line, side, extra) { var o = face(name, expr, extra); o.say = [say(name, line, side)]; return shot(bg, o); }

  var CHAPTERS = [
    { n: 1, title: 'L’Express de minuit', place: 'express', blurb: 'Paris – Nice, en wagon-lit. Un collier, un caniche et beaucoup trop de suspects pour un seul train.' },
    { n: 2, title: 'Le Grand Hôtel des Mouettes', place: 'palace', blurb: 'Nice. Un palace où les clés disparaissent plus vite que les croissants.' },
    { n: 3, title: 'Le Manoir des Oliviers', place: 'manoir', blurb: 'Provence. Un testament, une famille, et des témoins qui ne disent pas toujours la vérité.' },
    { n: 4, title: 'Le paquebot Bel Azur', place: 'paquebot', blurb: 'En mer. Personne ne peut descendre, et quelqu’un ment encore.' },
    { n: 5, title: 'L’Opéra de Monte-Carlo', place: 'opera', blurb: 'Rideau ! Ici, même les coupables chantent à moitié faux.' },
    { n: 6, title: 'Le Casino de Monte-Carlo', place: 'casino', blurb: 'Rien ne va plus : le Hibou abat ses dernières cartes.' }
  ];

  // Réponses d'un innocent accusé à tort
  var WRONG = {
    'Rémi Sansou': 'Moi ? Je n’ai même pas de quoi m’offrir un alibi !',
    'Aria Vibrato': 'Quelle audace ! Je n’ai que faire des bijoux des autres : j’ai les miens.',
    'Ernest Couchette': 'Vingt ans de service, et pas une petite cuillère ne m’a jamais manqué !',
    'Jean Bilet': 'Je contrôle les billets, madame, pas les soupçons.',
    'Pr Hector Tumulus': 'J’étudie les momies, pas les cambriolages. Elles au moins ne me dérangent pas.',
    'Paul Ochon': 'Accuser le directeur ? Dans son propre hôtel ? Quel manque de savoir-vivre.',
    'Lise Défait': 'Je fais les lits, pas les mauvais coups.',
    'Max Valise': 'Je porte les bagages, pas les accusations !',
    'Jacques Teil': 'Je secoue des shakers, pas des coffres-forts.',
    'Ginette Pépite': 'Ma chère, je n’ai jamais rien volé. On me l’offre, nuance.',
    'Chef Al Dente': 'Mamma mia ! Je suis innocent comme un risotto !',
    'Maître Gérard Menvussa': 'Moi ? Je n’ai rien vu, rien entendu… et je n’ai rien fait.',
    'Basile Bouture': 'J’arrache les mauvaises herbes, pas les objets de valeur.',
    'Julie Enne': 'J’étais à mes fourneaux. Demandez donc à mes carottes.',
    'Lucie Fer': 'Accusez-moi encore, et je vous jette un regard noir.',
    'Hippolyte Plateau': 'Un majordome ne vole pas, madame. Il débarrasse.',
    'Dr Mehdi Cament': 'Mon diagnostic : vous faites fausse route.',
    'Capitaine Jean Tempête': 'Mille sabords… euh, mille regrets : ce n’est pas moi !',
    'Marcel Hélice': 'J’étais dans le cambouis jusqu’aux oreilles !',
    'Paul Ka': 'Je ne joue que du piano, pas la comédie.',
    'Cécile Ence': '…',
    'Agathe Crispie': 'Si j’avais fait le coup, ma chère, vous ne l’auriez jamais deviné.',
    'Enzo Lyrico': 'Moi ? Je suis ténor, pas voleur ! Do de poitrine, main sur le cœur !',
    'Maestro Vivaldo Baguette': 'Vous jouez faux, madame l’enquêtrice.',
    'Paulette Paillette': 'Je couds des paillettes, je ne découds pas les alibis.',
    'Gérard Rideau': 'Je baisse le rideau, pas les bras.',
    'Sam Souffle': 'J’en ai le souffle coupé !',
    'René Vaplu': 'Faites vos jeux, madame… mais pas avec moi.',
    'Jacques Potte': 'Je dirige ce casino. Je ne le vole pas, je le ruine légalement.',
    'Bernadette Banco': 'Je joue gros, mais je joue honnête !',
    'Comtesse Diane de Carat': 'Moi ? Votre cliente ? Vous perdez la tête, ma chère Hortense.'
  };
  // Réponses d'un innocent accusé à tort, propres à une enquête (numéro d'épisode) ; sinon on retombe sur WRONG
  var WRONG_EP = {
    2: {
      'Aria Vibrato': 'Moi, noyer un papyrus ? Mes cordes vocales ont horreur de la vapeur de soupe !',
      'Jean Bilet': 'Je contrôle les billets, madame, pas les soupes.'
    },
    3: {
      'Rémi Sansou': 'Moi ? Je n’ai même pas de quoi payer un billet à poinçonner !',
      'Pr Hector Tumulus': 'Je ne collectionne que les antiquités, madame, pas les poinçonneuses.'
    },
    4: {
      'Ernest Couchette': 'Enlever Bijou ? Il me mord les mollets depuis Paris, madame !',
      'Aria Vibrato': 'Je suis allergique aux poils, madame. Un caniche ? Atchoum !'
    },
    5: {
      'Rémi Sansou': 'Des bonbons au piment ? Je n’ai même pas de quoi acheter des bonbons doux !',
      'Ernest Couchette': 'Vingt ans de service, madame : jamais je ne mettrais de piment dans une boîte de pastilles !',
      'Jean Bilet': 'Je contrôle les billets, madame, pas les pastilles.'
    },
    6: {
      'Aria Vibrato': 'Moi ? Si je veux arrêter un train, il me suffit de chanter une note aiguë !',
      'Ernest Couchette': 'Un steward ne tire pas le signal d’alarme, madame : il rassure les passagers !',
      'Pr Hector Tumulus': 'J’étais plongé dans mes notes sur Ramsès : le train aurait pu dérailler que je n’aurais rien remarqué.'
    },
    7: {
      'Aria Vibrato': 'Un hibou, moi ? Je suis un rossignol, madame, nuance !',
      'Jean Bilet': 'J’ai poinçonné bien des billets, madame, mais jamais celui d’un hibou !',
      'Pr Hector Tumulus': 'Le Hibou ? J’étudie les momies, madame, pas les oiseaux de nuit.'
    },
    8: {
      'Lise Défait': 'Je change les draps, madame, pas les plateaux. Et je préfère les biscottes.',
      'Chef Al Dente': 'Manger mes propres croissants ? Jamais ! Je les goûte, nuance.'
    },
    9: {
      'Lise Défait': 'J’ai déjà mon trousseau, madame : vingt-trois clés, et aucune n’ouvre le bonheur.',
      'Jacques Teil': 'Une clé ? Moi, je n’ouvre que des bouteilles.',
      'Chef Al Dente': 'La seule clé qui m’intéresse, c’est la clé du garde-manger !'
    },
    10: {
      'Paul Ochon': 'Voler une recette dans mon propre hôtel ? Je préfère encore la commander au bar.',
      'Max Valise': 'Moi, je ne bois que du lait-grenadine, madame.',
      'Ginette Pépite': 'Je ne copie pas les recettes, très chère. Je les fais servir.'
    },
    11: {
      'Max Valise': 'Une sieste ? Je cours dans les couloirs toute la journée, madame, je n’ai pas le temps de dormir !',
      'Jacques Teil': 'Je dors debout derrière mon comptoir, madame. Je n’ai pas besoin d’un lit.',
      'Rémi Sansou': 'Un lit de camp ? J’ai un vrai lit, madame. Payé à crédit, mais un vrai lit.'
    },
    12: {
      'Jacques Teil': 'Une mouette empaillée dans un cocktail ? Même moi, je n’ose pas.',
      'Ginette Pépite': 'Ce volatile est d’un goût affreux, ma chère. Je ne vole que ce qui brille.',
      'Chef Al Dente': 'Une mouette ? Je cuisine le poisson, pas ceux qui le mangent !'
    },
    13: {
      'Paul Ochon': 'Cambrioler le coffre de mon propre hôtel ? Je fais déjà des cauchemars quand on vole une serviette !',
      'Max Valise': 'Une boîte à biscuits ? Si c’était moi, il ne resterait plus de biscuits, madame.',
      'Ginette Pépite': 'Une copie ? Je ne porte que du vrai, ma chère.'
    },
    14: {
      'Paul Ochon': 'Pendant mon bal ? J’étais trop occupé à compter les petits fours !',
      'Lise Défait': 'Je ramasse les confettis, madame, pas les carnets.',
      'Max Valise': 'Moi, au bal, je portais les manteaux. Pas les carnets !',
      'Chef Al Dente': 'Pendant le bal, je surveillais mon soufflé. Un soufflé, ça ne se quitte pas des yeux !'
    },
    15: {
      'Maître Gérard Menvussa': 'Voler un testament que je dois lire moi-même ? Ce serait me priver du meilleur moment.',
      'Hippolyte Plateau': 'Un majordome ne touche jamais aux papiers de monsieur, madame. Seulement à la poussière dessus.'
    },
    16: {
      'Julie Enne': 'Engloutir ma propre tarte ? Je la connais par cœur, madame, je n’ai plus besoin de la goûter.',
      'Rémi Sansou': 'Des olives ? Je suis fauché, madame, pas affamé… enfin, pas que.'
    },
    17: {
      'Julie Enne': 'Des roses ? Moi, je cueille des poireaux.',
      'Lucie Fer': 'Des fleurs ? Je préfère qu’on m’en offre, voyons.',
      'Dr Mehdi Cament': 'Mon diagnostic : allergie aux pollens. Je ne m’approche jamais des rosiers.'
    },
    18: {
      'Maître Gérard Menvussa': 'M’endormir moi-même ? Mes lectures y suffisent très bien, madame.',
      'Basile Bouture': 'Moi, je fais dormir les graines, madame, pas les notaires.',
      'Julie Enne': 'Ma tisane réveille les morts, madame. Elle ne les endort pas !'
    },
    19: {
      'Lucie Fer': 'Du vin de 1899 ? Je ne bois que du champagne de l’année.',
      'Hippolyte Plateau': 'Je garde cette bouteille depuis trente ans, madame. Je l’aurais volée bien plus tôt.',
      'Basile Bouture': 'Moi, je ne bois que l’eau de mon arrosoir.'
    },
    20: {
      'Julie Enne': 'Une moustache ? Je dessine sur les gâteaux, madame, pas sur les tableaux.',
      'Lucie Fer': 'Gribouiller un portrait ? J’ai bien trop bon goût.',
      'Dr Mehdi Cament': 'J’ai une écriture de médecin, madame. Personne n’aurait reconnu une moustache.'
    },
    21: {
      'Hippolyte Plateau': 'Le codicille ? Je ne sais même pas ce que c’est, madame. Mais je l’ai épousseté.',
      'Basile Bouture': 'Un codi-quoi ? Moi, je ne vole que des boutures.',
      'Dr Mehdi Cament': 'Les papiers de famille, très peu pour moi. J’ai assez des ordonnances.'
    },
    22: {
      'Marcel Hélice': 'Saboter le compas ? Et finir perdu en mer avec vous tous ? Non merci.',
      'Paul Ka': 'Moi, je ne sais même pas où est le nord. Seulement où est le do.',
      'Cécile Ence': '…'
    },
    23: {
      'Marcel Hélice': 'Des cordes de piano ? J’ai déjà assez de câbles à réparer, madame.',
      'Agathe Crispie': 'Un piano muet ? Quelle idée d’intrigue… mais ce n’est pas la mienne.',
      'Lucie Fer': 'Couper des cordes ? Je risquerais de m’abîmer les ongles.'
    },
    24: {
      'Marcel Hélice': 'Je vis dans la salle des machines, madame. Je ne vois même jamais la mer.',
      'Cécile Ence': '…',
      'Agathe Crispie': 'Jeter une casquette ? Dans mes romans, on jette plutôt des cadavres.',
      'Rémi Sansou': 'Une casquette ? J’aurais pu la revendre, madame, pas la jeter !'
    },
    25: {
      'Paul Ka': 'La fin d’un roman ? Je ne lis que des partitions, madame.',
      'Lucie Fer': 'Je connais déjà la fin, très chère : c’est toujours moi qui gagne.',
      'Cécile Ence': '…'
    },
    26: {
      'Marcel Hélice': 'Ma propre clé ? Je n’ai pas besoin de la voler, madame : je la perds tout seul.',
      'Agathe Crispie': 'Arrêter le navire en pleine intrigue ? Jamais. Le suspense doit continuer.',
      'Paul Ka': 'Je joue du piano, madame, pas de la vanne.'
    },
    27: {
      'Capitaine Jean Tempête': 'Écrire au Hibou ? Je n’écris qu’au journal de bord, madame !',
      'Cécile Ence': '…',
      'Agathe Crispie': 'Une bouteille à la mer ? Trop de clichés, ma chère. Je n’écris pas ainsi.'
    },
    28: {
      'Cécile Ence': '…',
      'Paul Ka': 'Des signaux ? Moi, je ne connais que le solfège.',
      'Rémi Sansou': 'Des signaux au canot ? Je n’ai même pas de quoi payer une lampe, madame.'
    },
    29: {
      'Enzo Lyrico': 'Un diadème ? J’ai assez de lumière sur scène, madame !',
      'Sam Souffle': 'Moi, je reste dans mon trou, madame. Je ne vois jamais la diva que de dessous.'
    },
    30: {
      'Gérard Rideau': 'Une baguette ? J’ai déjà mes cordes et mes poulies, madame.',
      'Sam Souffle': 'La baguette ? J’ai déjà le livret, c’est bien assez lourd.'
    },
    31: {
      'Maestro Vivaldo Baguette': 'Faire tomber le rideau pendant MA générale ? Jamais, madame. Je le fais tomber à la fin.',
      'Paulette Paillette': 'Je couds les rideaux, madame. Je ne les décroche pas.',
      'Aria Vibrato': 'Couper la générale juste avant mon solo ? Vous plaisantez !'
    },
    32: {
      'Enzo Lyrico': 'Le livret ? Je connais mon rôle par cœur, madame. Enfin… presque.',
      'Gérard Rideau': 'Un livret ? Je ne lis que les plans de scène.',
      'Paulette Paillette': 'Je fais des ourlets, madame, pas des trous de mémoire.'
    },
    33: {
      'Gérard Rideau': 'Trafiquer un diapason ? Je ne sais même pas lequel est le la.',
      'Sam Souffle': 'Moi, je souffle les paroles, madame. Pas les notes.',
      'Enzo Lyrico': 'Fausser l’orchestre ? Je chante assez faux tout seul, merci !'
    },
    34: {
      'Paulette Paillette': 'Chanter la nuit ? Je dors avec mes épingles, madame.',
      'Sam Souffle': 'Je chuchote, madame. Je ne chante jamais.',
      'Aria Vibrato': 'Si c’était moi, toute la ville l’aurait entendu, madame.'
    },
    35: {
      'Enzo Lyrico': 'Des fleurs du Hibou ? On ne m’en offre déjà pas assez !',
      'Maestro Vivaldo Baguette': 'Je suis trop occupé à saluer, madame, pour livrer des bouquets.',
      'Paulette Paillette': 'Je pique des fleurs sur les chapeaux, pas dans les loges.'
    },
    36: {
      'René Vaplu': 'Truquer ma propre roulette ? Rien ne va plus, madame, mais pas à ce point !',
      'Rémi Sansou': 'Si je savais truquer une roulette, madame, je ne serais pas fauché !',
      'Jacques Potte': 'Truquer mon casino ? Il gagne déjà tout seul, madame.'
    },
    37: {
      'Jacques Potte': 'Des jetons en chocolat ? Je préfère les vrais, ils fondent moins vite.',
      'Rémi Sansou': 'Si c’était moi, madame, je les aurais mangés.',
      'Bernadette Banco': 'Je mise mes vrais jetons, ma chère. Le chocolat, je le mange.'
    },
    38: {
      'Bernadette Banco': 'Vider une mallette ? Je préfère la remplir à la roulette.',
      'Rémi Sansou': 'Si j’avais vidé une mallette, madame, je vous aurais payé un café !',
      'René Vaplu': 'Je compte l’argent, madame. Je ne le déplace pas.'
    },
    39: {
      'Jacques Potte': 'Les gains de Bernadette ? Je ne les ai jamais vus partir… c’est bien ça qui me surprend.',
      'René Vaplu': 'Je ramasse les mises, madame. Pas les gains des clientes.',
      'Rémi Sansou': 'Des gains ? Je ne sais même pas à quoi ça ressemble.',
      'Aria Vibrato': 'Voler une joueuse ? Je préfère qu’on me jette des fleurs.'
    },
    40: {
      'Comtesse Diane de Carat': 'Des plumes ? Ma chère, je ne porte que des perles.',
      'Jacques Potte': 'Semer la panique dans mon casino ? C’est mauvais pour les affaires, madame.',
      'Rémi Sansou': 'Des plumes ? Je dors sur un oreiller de paille, madame.'
    },
    41: {
      'Comtesse Diane de Carat': 'Votre chapeau ? Avec tout le respect que je vous dois, Hortense, il n’est pas à mon goût.',
      'René Vaplu': 'Je ne vole pas de chapeaux, madame. Je ne les tire même pas.',
      'Bernadette Banco': 'Je joue gros, ma chère, mais pas avec vos affaires.'
    },
    42: {
      'Rémi Sansou': 'Moi, le Hibou ? Je suis à peine capable d’être un moineau, madame.',
      'Jacques Potte': 'Le Hibou ? Il m’a déjà coûté mes Larmes de Lune, madame !',
      'Aria Vibrato': 'Je suis un rossignol, madame, je vous l’ai déjà dit !'
    }
  };
  var DETECTIVE_WRONG = [
    'Hmm. Son alibi tient. Reprenons la chronologie.',
    'Je retire ce que j’ai dit. Mon carnet n’a pas dit son dernier mot.',
    'Fausse piste. Le coupable doit bien rire.',
    'Ce n’était pas l’heure ni la bonne personne. Recomptons.'
  ];

  // Épisodes. tier : palier de difficulté (voir gen-lib.js) ; opts : exigences supplémentaires.
  var L = [];
  function ep(o) { L.push(o); }

  /* ===== Chapitre 1 · L'Express de minuit ===== */
  ep({ ch: 1, title: 'Les Larmes de Lune', mode: 'classic', tier: 'c35', fixed: true,
    suspects: ['Rémi Sansou', 'Aria Vibrato', 'Ernest Couchette'], culprit: 'Rémi Sansou', word: 'le voleur', noun: 'vol',
    intro: [
      shot('night', { h: 0.66, caps: [cap('Paris – Nice, par le chemin des écoliers : sept nuits à bord de l’Express de minuit.', 'tl'), cap('Première nuit. Le train file vers le sud.', 'br')] }),
      shot('box', { h: 0.56, say: [say(DIANE, 'Non… Non, non, non !', 'r')], sfx: { text: 'CLAC', x: 8, y: 12, rot: -10 } }),
      close('warm', DIANE, 'choc', 'Mon collier ! Les Larmes de Lune ! Volé pendant que je dînais !'),
      close('cool', H, 'serieux', 'Respirez, comtesse. Prochain arrêt : Lyon, à minuit. Votre voleur est encore à bord.', 'r', { caps: [cap('Hortense Lafleur. Institutrice à la retraite… et détective à ses heures.')] }),
      shot('watch', { h: 0.66, say: [say(H, 'Votre caniche a aboyé à {h} précises.')], caps: [cap('C’est l’heure du vol. Le voleur était seul avec le chien {lieu}.', 'br')] }),
      shot('corridor', { h: 0.7, caps: [cap('Trois passagers n’ont pas d’alibi. Reconstitue leurs allées et venues.')] })
    ],
    caseTitle: 'Le collier de la comtesse a disparu.', caseBody: 'Bijou, son caniche, a aboyé à {h} : c’est l’heure du vol, et le voleur était seul avec lui {lieu}. Reconstitue les déplacements des trois passagers.',
    outro: [
      close('warm', '@culprit', 'gene', 'Bon, bon… Je voulais juste l’emprunter pour le casino de Monte-Carlo. Je l’aurais rendu avant le petit-déjeuner !'),
      close('cool', H, 'sourire', 'Le casino attendra, jeune homme. Rendez ce collier à votre tante.', 'r'),
      shot('scream', { h: 0.6, sfx: { text: 'AAAAH !', x: 50, y: 42, rot: -6, center: true }, caps: [cap('La nuit suivante, un cri d’horreur retentit à bord. Celui du professeur Tumulus…')] })
    ] });

  ep({ ch: 1, title: 'Le papyrus à la soupe', mode: 'classic', tier: 'c35', opts: { minCoupableTour: 3 },
    suspects: ['Aria Vibrato', 'Ernest Couchette', 'Jean Bilet'], culprit: 'Ernest Couchette', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Pr Hector Tumulus', 'choc', 'Mon papyrus de Ramsès Deux ! Trempé dans la soupe à l’oignon ! Ramsès Deux-Louches, voilà ce qu’il est devenu ! Trois mille ans d’histoire, et ça sent la ciboulette !'),
      close('cool', H, 'serieux', 'La soupière a été renversée à {h}, {lieu}. Une seule personne s’y trouvait.', 'r'),
      shot('corridor', { h: 0.62, caps: [cap('Ce soir, le professeur Tumulus n’a pas quitté la voiture-bar. Restent trois suspects.')] })
    ],
    caseTitle: 'Le papyrus du professeur a fini dans la soupe.', caseBody: 'La soupière a été renversée à {h}, {lieu}, par la seule personne présente. Qui a noyé Ramsès Deux ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais seulement le faire sécher… sur la soupière. Elle était chaude, c’était pratique !'),
      close('cool', H, 'sourire', 'Un papyrus n’est pas une serviette, Ernest. Même en wagon-restaurant.', 'r'),
      shot('night', { h: 0.5, caps: [cap('Troisième nuit. Le contrôleur cherche désespérément quelque chose…')] })
    ] });

  ep({ ch: 1, title: 'La poinçonneuse', mode: 'classic', tier: 'c36',
    suspects: ['Rémi Sansou', 'Aria Vibrato', 'Pr Hector Tumulus'], culprit: 'Aria Vibrato', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'Jean Bilet', 'choc', 'Ma poinçonneuse ! Sans elle, je ne peux plus poinçonner ! Un contrôleur qui ne poinçonne pas, c’est un passager !'),
      close('warm', H, 'serieux', 'On l’a prise {lieu}, à {h}. Le voleur y était seul.', 'r'),
      shot('night', { h: 0.55, caps: [cap('Cette fois, la nuit sera plus longue : six créneaux à reconstituer.')] })
    ],
    caseTitle: 'La poinçonneuse du contrôleur a disparu.', caseBody: 'Elle a été dérobée à {h}, {lieu}. Jean Bilet était au fourgon, il est hors de cause. Lequel des trois autres passagers ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais faire des confettis pour ma première à l’Opéra. Les confettis poinçonnés, c’est très chic.'),
      close('cool', H, 'sourire', 'Chic, peut-être. Légal, certainement pas.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'OUAF !', x: 50, y: 44, rot: 4, center: true }, caps: [cap('Quatrième nuit. C’est Bijou, le caniche, qui disparaît.')] })
    ] });

  ep({ ch: 1, title: 'Un caniche sans billet', mode: 'classic', tier: 'c36', opts: { minTours: 4 },
    suspects: ['Jean Bilet', 'Ernest Couchette', 'Aria Vibrato'], culprit: 'Jean Bilet', word: 'le coupable', noun: 'enlèvement',
    intro: [
      close('warm', DIANE, 'choc', 'Bijou ! Mon Bijou ! Quelqu’un a enlevé mon caniche !'),
      close('cool', H, 'serieux', 'On l’a entendu gémir {lieu} à {h}. Son ravisseur était seul avec lui.', 'r'),
      shot('corridor', { h: 0.6, caps: [cap('Le professeur Tumulus dormait sous ses papyrus et le neveu ronflait. Restent trois suspects.')] })
    ],
    caseTitle: 'Bijou le caniche a été enlevé.', caseBody: 'Le chien a été emmené à {h}, {lieu}, par une personne seule avec lui. Retrouve-la.',
    outro: [
      close('cool', '@culprit', 'serieux', 'Le règlement est clair : pas de billet, pas de voyage. Même pour un caniche.'),
      close('warm', H, 'sourire', 'Le caniche voyage avec sa maîtresse, monsieur Bilet. Il a même un collier, lui.', 'r'),
      shot('night', { h: 0.5, caps: [cap('Cinquième nuit. La diva Aria Vibrato ne peut plus chanter une note…')] })
    ] });

  ep({ ch: 1, title: 'Fausse note', mode: 'classic', tier: 'c45', opts: { foothold: 2 },
    suspects: ['Rémi Sansou', 'Ernest Couchette', 'Jean Bilet', 'Pr Hector Tumulus'], culprit: 'Pr Hector Tumulus', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Aria Vibrato', 'choc', 'Mes pastilles pour la voix ! Remplacées par des bonbons au piment ! Ma voix… elle est partie en fumée !'),
      close('cool', H, 'serieux', 'Quatre suspects, cette fois. L’échange a eu lieu {lieu}, à {h}.', 'r'),
      shot('night', { h: 0.5, caps: [cap('La comtesse, elle, ne quittait pas Bijou d’une semelle.')] })
    ],
    caseTitle: 'Les pastilles de la diva ont été piégées.', caseBody: 'Quelqu’un a glissé des bonbons au piment dans la boîte d’Aria Vibrato à {h}, {lieu}. Lequel des quatre ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Elle faisait ses vocalises toute la nuit ! Même mes momies ne pouvaient plus dormir.'),
      close('cool', H, 'sourire', 'Il existe des bouchons d’oreilles, professeur. Ils sont moins épicés.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'SKRIIII !', x: 50, y: 44, rot: -4, center: true }, caps: [cap('Sixième nuit. Le train freine brutalement en pleine campagne.')] })
    ] });

  ep({ ch: 1, title: 'Signal d’alarme', mode: 'classic', tier: 'c45', opts: { minTours: 5 },
    suspects: ['Aria Vibrato', 'Ernest Couchette', 'Rémi Sansou', 'Pr Hector Tumulus'], culprit: 'Rémi Sansou', word: 'le coupable', noun: 'alarme',
    intro: [
      close('cool', 'Jean Bilet', 'choc', 'Quelqu’un a tiré le signal d’alarme ! Une heure de retard ! Vous savez combien de billets je vais devoir re-poinçonner ?'),
      close('warm', H, 'serieux', 'La poignée a été tirée {lieu}, à {h}. Le coupable était seul.', 'r')
    ],
    caseTitle: 'Le signal d’alarme a été tiré.', caseBody: 'Le train s’est arrêté net à {h}. La poignée se trouve {lieu}, et le coupable y était seul. Qui a fait ça ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Je pensais que c’était la poignée des toilettes ! Et puis… je voulais descendre à Monaco. Le casino, vous comprenez.'),
      close('cool', H, 'serieux', 'Rémi, encore vous. Je commence à connaître votre chronologie par cœur.', 'r'),
      shot('box', { h: 0.55, caps: [cap('Au matin du septième jour, la comtesse ouvre son écrin. Le collier est là… mais il est faux.')] })
    ] });

  ep({ ch: 1, title: 'La plume du Hibou', mode: 'classic', tier: 'c46',
    suspects: ['Aria Vibrato', 'Ernest Couchette', 'Jean Bilet', 'Pr Hector Tumulus'], culprit: 'Ernest Couchette', word: 'le voleur', noun: 'échange',
    intro: [
      close('warm', DIANE, 'choc', 'C’est du verre ! On a échangé mes Larmes de Lune contre une vulgaire copie ! Et il y a… une plume !'),
      close('cool', H, 'serieux', 'Une plume de hibou. La signature d’un cambrioleur célèbre. L’échange a eu lieu {lieu}, à {h}.', 'r'),
      shot('night', { h: 0.55, caps: [cap('Dernier mystère avant Nice. Rémi, puni, n’a pas quitté sa tante de la nuit : il est hors de cause.')] })
    ],
    caseTitle: 'Le vrai collier a été remplacé par une copie.', caseBody: 'Une plume de hibou a été trouvée dans l’écrin. L’échange a eu lieu à {h}, {lieu}. Qui travaille pour le Hibou ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Un monsieur masqué m’a donné un très gros pourboire pour échanger deux colliers. Je croyais que c’était un jeu de société !'),
      close('cool', H, 'serieux', 'Le Hibou. Il a déjà filé avec le vrai collier. Mais un hibou, ça finit toujours par rentrer au nid.', 'r'),
      shot('lobby', { h: 0.55, caps: [cap('Fin du chapitre 1. Direction Nice, et le Grand Hôtel des Mouettes.')] })
    ] });

  /* ===== Chapitre 2 · Le Grand Hôtel des Mouettes ===== */
  ep({ ch: 2, title: 'Les croissants fantômes', mode: 'classic', tier: 'c36',
    suspects: ['Max Valise', 'Lise Défait', 'Chef Al Dente'], culprit: 'Max Valise', word: 'le coupable', noun: 'larcin',
    intro: [
      shot('lobby', { h: 0.6, caps: [cap('Nice. Le Grand Hôtel des Mouettes, cinq étoiles, trois mouettes empaillées et un directeur très nerveux.', 'tl')] }),
      close('warm', DIANE, 'choc', 'On m’a monté un plateau de petit-déjeuner… vide ! Où sont passés mes croissants ?'),
      close('cool', H, 'serieux', 'Le plateau est resté sans surveillance {lieu} à {h}. Quelqu’un y était seul… avec la faim.', 'r')
    ],
    caseTitle: 'Les croissants de la comtesse ont été mangés.', caseBody: 'Le plateau a été dévalisé à {h}, {lieu}. Il reste des miettes et trois suspects.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je porte des valises toute la journée… J’avais un petit creux. Ils avaient l’air tellement seuls, ces croissants.'),
      close('cool', H, 'sourire', 'Des miettes sur votre veste, Max. Le pire alibi du monde.', 'r'),
      shot('lobby', { h: 0.5, caps: [cap('À midi, c’est le passe-partout de l’hôtel qui s’évapore.')] })
    ] });

  ep({ ch: 2, title: 'Le passe-partout', mode: 'classic', tier: 'c45',
    suspects: ['Lise Défait', 'Jacques Teil', 'Ginette Pépite', 'Chef Al Dente'], culprit: 'Ginette Pépite', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'André Vivalto', 'choc', 'Le passe-partout ! Vingt ans de contrôle dans l’Express, et on me vole la clé de l’hôtel sous le nez ! Mon sifflet n’y survivra pas !'),
      close('warm', H, 'serieux', 'Elle était accrochée {lieu}. Disparue à {h}, quand une seule personne y était.', 'r')
    ],
    caseTitle: 'La clé qui ouvre toutes les portes a disparu.', caseBody: 'Le passe-partout a été décroché à {h}, {lieu}. Quatre suspects, une seule clé.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais juste admirer les bijoux des autres suites. Regarder n’est pas voler, voyons !'),
      close('cool', H, 'serieux', 'Ouvrir la porte des autres, si, madame Pépite.', 'r'),
      shot('lobby', { h: 0.5, caps: [cap('Le soir, c’est au bar que le drame éclate.')] })
    ] });

  ep({ ch: 2, title: 'Cocktail secret', mode: 'classic', tier: 'c45', opts: { minTours: 5 },
    suspects: ['Paul Ochon', 'Max Valise', 'Ginette Pépite', 'Chef Al Dente'], culprit: 'Chef Al Dente', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'Jacques Teil', 'choc', 'Mon carnet de recettes ! Le secret du « Mouette Sauvage » ! Trente ans de shaker, envolés !'),
      close('warm', H, 'serieux', 'Le carnet a disparu {lieu}, à {h}.', 'r')
    ],
    caseTitle: 'Le carnet de cocktails du barman a été volé.', caseBody: 'Il a été subtilisé à {h}, {lieu}. Le voleur y était seul, peut-être un peu assoiffé.',
    outro: [
      close('warm', '@culprit', 'gene', 'Mamma mia… je voulais la recette pour ma sauce. Une sauce Mouette Sauvage, ça aurait fait un malheur !'),
      close('cool', H, 'sourire', 'Un malheur, c’est le mot, chef.', 'r'),
      shot('lobby', { h: 0.5, caps: [cap('Le lendemain, la femme de chambre fait une découverte troublante.')] })
    ] });

  ep({ ch: 2, title: 'Lit défait', mode: 'classic', tier: 'c46',
    suspects: ['Paul Ochon', 'Max Valise', 'Jacques Teil', 'Rémi Sansou'], culprit: 'Paul Ochon', word: 'le coupable', noun: 'sieste',
    intro: [
      close('warm', 'Lise Défait', 'choc', 'Le lit de camp du veilleur de nuit, je l’avais fait au carré. Et maintenant… il est défait ! Quelqu’un a dormi dedans !'),
      close('cool', H, 'serieux', 'Quelqu’un s’est glissé {lieu} à {h}. Seul, et sans doute fatigué.', 'r')
    ],
    caseTitle: 'Quelqu’un a fait la sieste dans le lit de camp du veilleur.', caseBody: 'La sieste a commencé à {h}, {lieu}. Le dormeur y était seul. Qui ?',
    outro: [
      close('warm', '@culprit', 'gene', 'Je dirige cet hôtel depuis vingt ans sans jamais dormir une nuit entière… Ce lit de camp est divin.'),
      close('cool', H, 'sourire', 'Paul Ochon… polochon ! Un directeur qui dort dans les suites, c’était écrit.', 'r'),
      shot('lobby', { h: 0.5, caps: [cap('Mais à l’heure du thé, Marcelle, la mouette empaillée de l’entrée, a disparu.')] })
    ] });

  ep({ ch: 2, title: 'La mouette empaillée', mode: 'classic', tier: 'c46', opts: { minTours: 5 },
    suspects: ['Lise Défait', 'Jacques Teil', 'Ginette Pépite', 'Chef Al Dente'], culprit: 'Lise Défait', word: 'le coupable', noun: 'disparition',
    intro: [
      close('cool', 'Paul Ochon', 'choc', 'Marcelle ! Notre mascotte ! Empaillée en 1903 ! Le symbole de l’hôtel !'),
      close('warm', H, 'serieux', 'Marcelle a quitté son perchoir {lieu} à {h}. Quelqu’un l’a emportée, seul.', 'r')
    ],
    caseTitle: 'Marcelle, la mouette empaillée, a disparu.', caseBody: 'Elle a quitté son perchoir à {h}, {lieu}. Quatre suspects, un seul oiseau.',
    outro: [
      close('warm', '@culprit', 'gene', 'Elle était pleine de poussière ! Je l’ai emmenée prendre un bain. Elle n’a pas protesté.'),
      close('cool', H, 'sourire', 'Une mouette propre est une mouette heureuse. Rendez-la quand même.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'CLONK', x: 50, y: 44, rot: -5, center: true }, caps: [cap('Cette nuit-là, la boîte à biscuits de la comtesse est retrouvée grand ouverte.')] })
    ] });

  ep({ ch: 2, title: 'Le coffre de l’hôtel', mode: 'classic', tier: 'c46h', opts: { hard: true },
    suspects: ['Paul Ochon', 'Max Valise', 'Jacques Teil', 'Ginette Pépite'], culprit: 'Jacques Teil', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', DIANE, 'choc', 'Le faux collier ! Je l’avais caché dans une boîte à biscuits — personne ne fouille une boîte à biscuits ! Et à la place… une plume !'),
      close('cool', H, 'serieux', 'Le Hibou veut même la copie. Intéressant. La boîte a été ouverte {lieu} à {h}. Cette énigme-là demande de poser des hypothèses.', 'r')
    ],
    caseTitle: 'La copie du collier a été volée dans sa boîte à biscuits.', caseBody: 'Une nouvelle plume de hibou. La boîte a été ouverte à {h}, {lieu}. Attention : il faudra peut-être tester une hypothèse et voir si elle mène à une contradiction.',
    outro: [
      close('warm', '@culprit', 'gene', 'Le monsieur masqué laisse de très gros pourboires… Il m’a juste demandé d’ouvrir une boîte à biscuits. Je ne savais pas que c’était mal !'),
      close('cool', H, 'serieux', 'Le Hibou recrute dans tous les métiers. Il me faut sa liste de contacts.', 'r'),
      shot('lobby', { h: 0.5, caps: [cap('Le soir même, l’hôtel donne son grand bal annuel. Cinq suspects sur la piste…')] })
    ] });

  ep({ ch: 2, title: 'Le bal des Mouettes', mode: 'classic', tier: 'c55',
    suspects: ['Paul Ochon', 'Lise Défait', 'Max Valise', 'Ginette Pépite', 'Chef Al Dente'], culprit: 'Ginette Pépite', word: 'le voleur', noun: 'vol',
    intro: [
      shot('lobby', { h: 0.6, sfx: { text: 'CLIC', x: 70, y: 18, rot: 8 }, caps: [cap('En plein bal, les lumières s’éteignent. Quand elles se rallument, le carnet d’Hortense a disparu !', 'tl')] }),
      close('cool', H, 'choc', 'Mon carnet ! Toutes mes notes sur le Hibou ! On me l’a pris {lieu}, à {h}.', 'r')
    ],
    caseTitle: 'Le carnet d’Hortense a été volé pendant le bal.', caseBody: 'Cinq suspects cette fois. Le carnet a disparu à {h}, {lieu}. Il faudra ruser… sans carnet.',
    outro: [
      close('warm', '@culprit', 'gene', 'Le Hibou voulait savoir ce que vous saviez. Il m’a promis une broche en diamant…'),
      close('cool', H, 'serieux', 'Et où se cache-t-il, ce Hibou ?', 'r'),
      close('warm', '@culprit', 'neutre', 'Je ne sais pas… Mais il a parlé d’un testament, dans un manoir en Provence.'),
      shot('garden', { h: 0.55, caps: [cap('Fin du chapitre 2. Direction le Manoir des Oliviers.')] })
    ] });

  /* ===== Chapitre 3 · Le Manoir des Oliviers (un menteur) ===== */
  ep({ ch: 3, title: 'Le testament envolé', mode: 'liar', tier: 'l35',
    suspects: ['Maître Gérard Menvussa', 'Lucie Fer', 'Hippolyte Plateau'], culprit: 'Lucie Fer', word: 'le voleur', noun: 'vol',
    intro: [
      shot('garden', { h: 0.62, caps: [cap('Le Manoir des Oliviers. La famille de Carat s’y réunit pour lire le testament de l’oncle Aristide.', 'tl')] }),
      close('warm', DIANE, 'choc', 'Le testament a disparu ! Juste avant la lecture !'),
      close('cool', H, 'serieux', 'Nouvelle règle, comtesse : ici, chacun me donne sa version. Les innocents disent vrai. Le voleur, lui, ment sur tout.', 'r')
    ],
    caseTitle: 'Le testament de l’oncle Aristide a disparu.', caseBody: 'Il a été volé à {h}, {lieu}. Chaque suspect a fait des déclarations : les innocents disent la vérité, le voleur ment à chaque fois. Trouve le menteur.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Tonton m’avait légué un chat. UN CHAT. J’ai voulu… améliorer un peu le texte.'),
      close('cool', H, 'serieux', 'On n’améliore pas un testament, Lucie. On le lit.', 'r'),
      shot('garden', { h: 0.5, caps: [cap('L’après-midi, la tarte aux olives du goûter disparaît.')] })
    ] });

  ep({ ch: 3, title: 'La tarte aux olives', mode: 'liar', tier: 'l35',
    suspects: ['Julie Enne', 'Basile Bouture', 'Rémi Sansou'], culprit: 'Basile Bouture', word: 'le coupable', noun: 'goûter',
    intro: [
      close('warm', 'Julie Enne', 'choc', 'Ma tarte aux olives ! Je l’avais posée à refroidir, et il ne reste que le plat !'),
      close('cool', H, 'serieux', 'Elle a été dévorée {lieu}, à {h}. Écoutons ce que chacun raconte. L’un d’eux ment.', 'r')
    ],
    caseTitle: 'La tarte aux olives a été engloutie.', caseBody: 'Quelqu’un l’a mangée à {h}, {lieu}, tout seul. Les innocents disent vrai, le gourmand ment à chaque phrase.',
    outro: [
      close('warm', '@culprit', 'gene', 'Les olives viennent de MES oliviers. C’était une sorte de… dégustation professionnelle.'),
      close('cool', H, 'sourire', 'Une dégustation de la tarte entière, Basile ?', 'r'),
      shot('garden', { h: 0.5, caps: [cap('Le soir, c’est le rosier préféré de l’oncle Aristide qui est saccagé.')] })
    ] });

  ep({ ch: 3, title: 'Le rosier d’Aristide', mode: 'classic', tier: 'c46',
    suspects: ['Julie Enne', 'Lucie Fer', 'Hippolyte Plateau', 'Dr Mehdi Cament'], culprit: 'Hippolyte Plateau', word: 'le coupable', noun: 'cueillette',
    intro: [
      close('warm', 'Basile Bouture', 'choc', 'Le rosier de monsieur Aristide ! Toutes les roses coupées ! Il avait gagné trois concours !'),
      close('cool', H, 'serieux', 'Retour aux constats, sans témoignages. Les roses ont été coupées {lieu} à {h}.', 'r')
    ],
    caseTitle: 'Le rosier primé a été dépouillé.', caseBody: 'Toutes les roses ont été coupées à {h}, {lieu}. Le coupable y était seul. Ici, tous les constats sont vrais.',
    outro: [
      close('warm', '@culprit', 'gene', 'C’était… pour un bouquet. Pour mademoiselle Julie. Un majordome a aussi un cœur, madame.'),
      close('cool', H, 'sourire', 'Un cœur, oui. Un sécateur, apparemment aussi.', 'r'),
      shot('garden', { h: 0.5, caps: [cap('Le lendemain, la lecture du testament reprend… et le notaire s’endort au milieu.')] })
    ] });

  ep({ ch: 3, title: 'Le notaire endormi', mode: 'liar', tier: 'l45',
    suspects: ['Maître Gérard Menvussa', 'Basile Bouture', 'Julie Enne', 'Dr Mehdi Cament'], culprit: 'Dr Mehdi Cament', word: 'le coupable', noun: 'somnifère',
    intro: [
      close('warm', DIANE, 'choc', 'Maître Menvussa ronfle au milieu de la lecture ! Quelqu’un a mis un somnifère dans son thé !'),
      close('cool', H, 'serieux', 'Le thé a été trafiqué {lieu} à {h}. Quatre témoins, un menteur.', 'r')
    ],
    caseTitle: 'Le notaire s’est endormi pendant la lecture.', caseBody: 'Son thé a été trafiqué à {h}, {lieu}. Même le notaire endormi a donné sa version. Les innocents disent vrai, le coupable ment toujours.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il lisait si lentement… J’ai pensé qu’une petite sieste lui ferait du bien. Et à nous aussi.'),
      close('cool', H, 'serieux', 'Docteur Cament. Vous prescrivez des somnifères sans ordonnance, maintenant ?', 'r'),
      shot('garden', { h: 0.5, caps: [cap('Pendant ce temps, la bouteille de 1899 de l’oncle a disparu.')] })
    ] });

  ep({ ch: 3, title: 'Cave à surprises', mode: 'liar', tier: 'l45',
    suspects: ['Lucie Fer', 'Hippolyte Plateau', 'Basile Bouture', 'Rémi Sansou'], culprit: 'Rémi Sansou', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'Hippolyte Plateau', 'choc', 'Le Château-Margaux 1899 ! La bouteille préférée de monsieur ! Je l’avais montée de la cave pour le dîner… et elle a disparu !'),
      close('warm', H, 'serieux', 'La bouteille a été prise {lieu}, à {h}. Écoutons leurs versions.', 'r')
    ],
    caseTitle: 'La bouteille de 1899 a disparu.', caseBody: 'Elle a été emportée à {h}, {lieu}. Un des quatre suspects ment sur toute la ligne.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je l’ai… vendue. Pour rembourser une petite dette. Une toute petite. Avec beaucoup de zéros.'),
      close('cool', H, 'serieux', 'Rémi, vous êtes le seul suspect que je retrouve dans chaque chapitre.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'SCRITCH', x: 50, y: 44, rot: -6, center: true }, caps: [cap('Le lendemain matin, quelqu’un a dessiné une moustache sur le portrait de l’oncle Aristide.')] })
    ] });

  ep({ ch: 3, title: 'Le portrait moustachu', mode: 'classic', tier: 'c46h', opts: { hard: true },
    suspects: ['Maître Gérard Menvussa', 'Julie Enne', 'Lucie Fer', 'Dr Mehdi Cament'], culprit: 'Maître Gérard Menvussa', word: 'le coupable', noun: 'gribouillage',
    intro: [
      close('warm', DIANE, 'choc', 'L’oncle Aristide… avec une moustache en guidon de vélo ! C’est un sacrilège !'),
      close('cool', H, 'serieux', 'La peinture était fraîche {lieu} à {h}. Énigme corsée : il faudra sans doute tester des hypothèses.', 'r')
    ],
    caseTitle: 'Le portrait de l’oncle a été moustachu.', caseBody: 'Le gribouillage date de {h}, {lieu}. Tous les constats sont vrais, mais il faudra raisonner par l’absurde : suppose, et vois si ça coince.',
    outro: [
      close('warm', '@culprit', 'gene', 'Aristide m’a toujours dit que la moustache m’allait mieux qu’à lui. Je voulais vérifier.'),
      close('cool', H, 'sourire', 'Maître Menvussa. Vous qui n’avez jamais rien vu… vous avez tout dessiné.', 'r'),
      shot('garden', { h: 0.5, caps: [cap('La nuit tombe sur le manoir. Un codicille secret vient d’être retrouvé… puis volé.')] })
    ] });

  ep({ ch: 3, title: 'Le codicille', mode: 'liar', tier: 'l46',
    suspects: ['Lucie Fer', 'Hippolyte Plateau', 'Basile Bouture', 'Dr Mehdi Cament'], culprit: 'Lucie Fer', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'Maître Gérard Menvussa', 'choc', 'Le codicille de 1920 ! Celui qui disait que les Larmes de Lune… enfin, celui qui disait quelque chose d’important ! Volé !'),
      close('warm', H, 'serieux', 'Et une plume de hibou à sa place. Le vol a eu lieu {lieu} à {h}. Un menteur parmi quatre, sur six créneaux.', 'r')
    ],
    caseTitle: 'Le codicille secret a été volé.', caseBody: 'Une plume de hibou l’a remplacé. Vol à {h}, {lieu}. Les innocents disent vrai, le voleur ment à chaque déclaration.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Le Hibou paie bien mieux que l’héritage de tonton. Au revoir, cousine !'),
      shot('sea', { h: 0.55, caps: [cap('Lucie Fer s’enfuit vers le port de Nice et monte à bord du paquebot Bel Azur.')] }),
      close('cool', H, 'serieux', 'Comtesse, faites vos valises. Nous prenons la mer.', 'r'),
      shot('sea', { h: 0.45, caps: [cap('Fin du chapitre 3.')] })
    ] });

  /* ===== Chapitre 4 · Le paquebot Bel Azur ===== */
  ep({ ch: 4, title: 'Le compas affolé', mode: 'classic', tier: 'c46',
    suspects: ['Marcel Hélice', 'Paul Ka', 'Cécile Ence', 'Agathe Crispie'], culprit: 'Agathe Crispie', word: 'le coupable', noun: 'sabotage',
    intro: [
      shot('sea', { h: 0.6, caps: [cap('À bord du Bel Azur, cap sur la Corse. En théorie.', 'tl')] }),
      close('cool', 'Capitaine Jean Tempête', 'choc', 'Quelqu’un a collé un aimant sous le compas ! On tourne en rond depuis une heure !'),
      close('warm', H, 'serieux', 'L’aimant a été posé {lieu} à {h}.', 'r')
    ],
    caseTitle: 'Le compas du navire a été saboté.', caseBody: 'Un aimant a été collé à {h}, {lieu}. Le saboteur y était seul. Tous les constats sont vrais.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je testais une intrigue pour mon prochain roman : « Mort sur un paquebot qui tourne en rond ». Ça marche, non ?'),
      close('cool', H, 'serieux', 'Trop bien, madame Crispie. Votre éditeur sera ravi, le capitaine beaucoup moins.', 'r'),
      shot('sea', { h: 0.5, caps: [cap('Le lendemain, quelqu’un coupe toutes les cordes du piano de voyage de Paul Ka.')] })
    ] });

  ep({ ch: 4, title: 'Silence à bord', mode: 'liar', tier: 'l45',
    suspects: ['Cécile Ence', 'Marcel Hélice', 'Agathe Crispie', 'Lucie Fer'], culprit: 'Cécile Ence', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Paul Ka', 'choc', 'Mon piano de voyage ! Je l’avais sorti pour l’accorder… Plus une corde ! Comment je joue ma polka, maintenant ?'),
      close('cool', H, 'serieux', 'Les cordes ont été coupées {lieu} à {h}. Retour des témoignages : un des quatre ment.', 'r')
    ],
    caseTitle: 'Le piano a perdu toutes ses cordes.', caseBody: 'Elles ont été coupées à {h}, {lieu}. Les innocents disent vrai, le coupable ment à chaque fois.',
    outro: [
      close('warm', '@culprit', 'serieux', '…'),
      close('cool', H, 'sourire', 'Cécile Ence… « silence » ! Mademoiselle voulait simplement un peu de calme. Son nom aurait dû me mettre sur la piste.', 'r'),
      shot('sea', { h: 0.5, caps: [cap('Le lendemain, la casquette du capitaine passe par-dessus bord.')] })
    ] });

  ep({ ch: 4, title: 'Casquette à la mer', mode: 'classic', tier: 'c55',
    suspects: ['Marcel Hélice', 'Paul Ka', 'Cécile Ence', 'Agathe Crispie', 'Rémi Sansou'], culprit: 'Paul Ka', word: 'le coupable', noun: 'plouf',
    intro: [
      close('cool', 'Capitaine Jean Tempête', 'choc', 'Ma casquette ! Trente ans de navigation ! Un capitaine sans casquette, c’est un passager avec des galons !'),
      close('warm', H, 'serieux', 'Elle a été jetée par un hublot, {lieu}, à {h}. Cinq suspects, toutes les pièces à surveiller.', 'r')
    ],
    caseTitle: 'La casquette du capitaine a fini à la mer.', caseBody: 'Elle a été lancée à {h}, {lieu}. Cinq suspects, et le coupable y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il m’a fait jouer la même polka quarante-deux fois. QUARANTE-DEUX. J’ai craqué.'),
      close('cool', H, 'sourire', 'Circonstances atténuantes, monsieur Ka.', 'r'),
      shot('sea', { h: 0.5, caps: [cap('Le lendemain, la fin du manuscrit d’Agathe Crispie a disparu.')] })
    ] });

  ep({ ch: 4, title: 'Le dernier chapitre', mode: 'liar', tier: 'l46',
    suspects: ['Capitaine Jean Tempête', 'Paul Ka', 'Lucie Fer', 'Cécile Ence'], culprit: 'Capitaine Jean Tempête', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Agathe Crispie', 'choc', 'Les dix dernières pages de mon roman ! Celles où l’on découvre l’assassin !'),
      close('cool', H, 'serieux', 'Les pages ont disparu {lieu} à {h}. Six créneaux, quatre témoins, un menteur.', 'r')
    ],
    caseTitle: 'La fin du roman d’Agathe Crispie a été volée.', caseBody: 'Les pages ont été prises à {h}, {lieu}. Les innocents disent vrai ; le voleur ment à chaque fois.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je ne supporte pas le suspense ! Il fallait que je sache qui était l’assassin !'),
      close('cool', H, 'sourire', 'C’était le majordome, capitaine. C’est toujours le majordome. Sauf au manoir.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'BRRR…', x: 50, y: 44, rot: 0, center: true }, caps: [cap('En pleine nuit, les machines s’arrêtent. Le paquebot dérive.')] })
    ] });

  ep({ ch: 4, title: 'Machine arrière', mode: 'classic', tier: 'c46h', opts: { hard: true },
    suspects: ['Marcel Hélice', 'Agathe Crispie', 'Lucie Fer', 'Paul Ka'], culprit: 'Lucie Fer', word: 'le saboteur', noun: 'sabotage',
    intro: [
      close('cool', 'Marcel Hélice', 'choc', 'Quelqu’un a volé la clé de la vanne à charbon ! Sans elle, impossible de relancer les machines !'),
      close('warm', H, 'serieux', 'Je l’avais oubliée {lieu}. Elle a disparu à {h}. Il faudra sans doute faire une hypothèse et la pousser jusqu’au bout.', 'r')
    ],
    caseTitle: 'La clé de la vanne à charbon a été volée.', caseBody: 'Elle a disparu à {h}, {lieu}. Tous les constats sont vrais, mais l’énigme est corsée : suppose, et vois si ça coince.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Le Hibou avait besoin qu’on ralentisse. Son canot automobile n’est pas très rapide.'),
      close('cool', H, 'serieux', 'Son canot ? Il est donc tout près.', 'r'),
      shot('sea', { h: 0.5, caps: [cap('Le soir suivant, une bouteille est jetée à la mer. À l’intérieur, un message.')] })
    ] });

  ep({ ch: 4, title: 'Bouteille à la mer', mode: 'liar', tier: 'l46',
    suspects: ['Capitaine Jean Tempête', 'Marcel Hélice', 'Cécile Ence', 'Agathe Crispie'], culprit: 'Marcel Hélice', word: 'le coupable', noun: 'message',
    intro: [
      close('cool', H, 'serieux', 'Ce message en bouteille dit : « Opéra, samedi, loge de la diva ». Quelqu’un a prévenu le Hibou. La bouteille est partie par un hublot, {lieu}, à {h}.', 'r')
    ],
    caseTitle: 'Quelqu’un a envoyé un message au Hibou.', caseBody: 'La bouteille a été lancée à {h}, {lieu}. Les innocents disent vrai, le messager ment à chaque phrase.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il paie en lingots, madame. Moi, je suis payé en charbon.'),
      close('cool', H, 'serieux', 'Le Hibou achète tout le monde. Sauf moi.', 'r'),
      shot('sea', { h: 0.5, caps: [cap('Cette nuit-là, une lampe clignote derrière un hublot. Au loin, un canot répond.')] })
    ] });

  ep({ ch: 4, title: 'Le canot de minuit', mode: 'liar', tier: 'l46', opts: { hard: true },
    suspects: ['Lucie Fer', 'Cécile Ence', 'Paul Ka', 'Rémi Sansou'], culprit: 'Lucie Fer', word: 'la fugitive', noun: 'fuite',
    intro: [
      close('cool', 'Capitaine Jean Tempête', 'choc', 'Des signaux lumineux en pleine mer ! Et à minuit, un canot de sauvetage a disparu… avec quelqu’un dedans !'),
      close('warm', H, 'serieux', 'Les signaux venaient {lieu}, à {h}. Qui les a faits a pris le canot. Énigme corsée : certaines pistes ne tombent qu’en testant une hypothèse.', 'r')
    ],
    caseTitle: 'Quelqu’un a fait des signaux au canot du Hibou.', caseBody: 'La lampe a clignoté à {h}, {lieu}. Les innocents disent vrai, la fuyarde ment toujours. Difficile : il faudra parfois supposer pour avancer.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Trop tard, Hortense ! Rendez-vous à Monte-Carlo… si vous aimez l’opéra.'),
      shot('stage', { h: 0.55, caps: [cap('Fin du chapitre 4. Monte-Carlo. Ce samedi, Aria Vibrato chante à l’Opéra.')] })
    ] });

  /* ===== Chapitre 5 · L'Opéra de Monte-Carlo (demi-vérités) ===== */
  ep({ ch: 5, title: 'Prima donna', mode: 'half', tier: 'h35',
    suspects: ['Enzo Lyrico', 'Paulette Paillette', 'Sam Souffle'], culprit: 'Paulette Paillette', word: 'la coupable', noun: 'vol',
    intro: [
      shot('stage', { h: 0.6, caps: [cap('L’Opéra de Monte-Carlo, deux heures avant la première.', 'tl')] }),
      close('warm', 'Aria Vibrato', 'choc', 'Mon diadème ! Je ne peux pas chanter Tosca tête nue !'),
      close('cool', H, 'serieux', 'Nouvelle règle, et elle est plus vicieuse : le coupable mélange le vrai et le faux. Au moins une de ses phrases est vraie, au moins une est fausse.', 'r')
    ],
    caseTitle: 'Le diadème de la diva a disparu.', caseBody: 'Il a été pris à {h}, {lieu}. Les innocents disent toujours vrai. Le coupable mêle le vrai et le faux : au moins une vraie déclaration, au moins une fausse.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il manquait des paillettes ! Une diva sans paillettes, c’est une choriste.'),
      close('cool', H, 'sourire', 'Paulette Paillette… Je n’aurais pas dû chercher plus loin.', 'r'),
      shot('stage', { h: 0.5, caps: [cap('À la répétition, le maestro cherche sa baguette partout.')] })
    ] });

  ep({ ch: 5, title: 'Baguette magique', mode: 'half', tier: 'h35',
    suspects: ['Gérard Rideau', 'Sam Souffle', 'Enzo Lyrico'], culprit: 'Enzo Lyrico', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', 'Maestro Vivaldo Baguette', 'choc', 'Ma baguette ! Sans elle, l’orchestre joue n’importe comment ! Enfin… plus que d’habitude.'),
      close('warm', H, 'serieux', 'Elle a disparu {lieu} à {h}. Le coupable dit vrai… à moitié.', 'r')
    ],
    caseTitle: 'La baguette du maestro a disparu.', caseBody: 'Elle a été prise à {h}, {lieu}. Le coupable mêle le vrai et le faux, les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il dirige si lentement ! Je voulais chanter mon air en moins de dix minutes, pour une fois.'),
      close('cool', H, 'sourire', 'Un ténor pressé. On aura tout vu.', 'r'),
      shot('scream', { h: 0.5, sfx: { text: 'BADABOUM', x: 50, y: 44, rot: -6, center: true }, caps: [cap('Pendant la générale, le rideau tombe en plein milieu du premier acte.')] })
    ] });

  ep({ ch: 5, title: 'Le rideau tombe', mode: 'liar', tier: 'l46',
    suspects: ['Maestro Vivaldo Baguette', 'Paulette Paillette', 'Sam Souffle', 'Aria Vibrato'], culprit: 'Sam Souffle', word: 'le coupable', noun: 'chute',
    intro: [
      close('cool', 'Gérard Rideau', 'choc', 'Mon rideau est tombé tout seul ! Enfin… pas tout seul. Quelqu’un a touché au levier.'),
      close('warm', H, 'serieux', 'Le levier a été actionné {lieu} à {h}. Ici, le coupable ment sur tout.', 'r')
    ],
    caseTitle: 'Le rideau est tombé en pleine générale.', caseBody: 'Quelqu’un a actionné le levier à {h}, {lieu}. Les innocents disent vrai, le coupable ment à chaque fois.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je me suis assoupi contre le levier… Souffler les répliques, c’est épuisant.'),
      close('cool', H, 'sourire', 'Un souffleur qui s’endort. Il y a des métiers à risque.', 'r'),
      shot('stage', { h: 0.5, caps: [cap('Le soir même, le texte du souffleur est introuvable.')] })
    ] });

  ep({ ch: 5, title: 'Trou de mémoire', mode: 'half', tier: 'h45',
    suspects: ['Aria Vibrato', 'Enzo Lyrico', 'Gérard Rideau', 'Paulette Paillette'], culprit: 'Aria Vibrato', word: 'la coupable', noun: 'vol',
    intro: [
      close('cool', 'Sam Souffle', 'choc', 'Mon livret ! Toutes les répliques de ce soir ! Sans lui, je souffle dans le vide !'),
      close('warm', H, 'serieux', 'Le livret a disparu {lieu} à {h}. Quatre suspects, et le coupable dit vrai… parfois.', 'r')
    ],
    caseTitle: 'Le livret du souffleur a disparu.', caseBody: 'Il a été pris à {h}, {lieu}. Le coupable mêle le vrai et le faux, les trois autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais improviser, chéri. Le génie ne se souffle pas.'),
      close('cool', H, 'serieux', 'Et la poinçonneuse, c’était aussi du génie ?', 'r'),
      shot('stage', { h: 0.5, caps: [cap('À la répétition suivante, tout l’orchestre joue faux.')] })
    ] });

  ep({ ch: 5, title: 'Le diapason trafiqué', mode: 'classic', tier: 'c46h', opts: { hard: true },
    suspects: ['Maestro Vivaldo Baguette', 'Gérard Rideau', 'Sam Souffle', 'Enzo Lyrico'], culprit: 'Maestro Vivaldo Baguette', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Aria Vibrato', 'choc', 'Tout l’orchestre est un demi-ton trop bas ! Je chante comme une casserole !'),
      close('cool', H, 'serieux', 'Le diapason a été limé {lieu} à {h}. Pas de témoignages ici, mais une énigme corsée.', 'r')
    ],
    caseTitle: 'Le diapason de l’orchestre a été trafiqué.', caseBody: 'Il a été limé à {h}, {lieu}. Tous les constats sont vrais. Énigme difficile : suppose, et cherche la contradiction.',
    outro: [
      close('warm', '@culprit', 'gene', 'Ce ténor chante trop haut ! Je voulais qu’il chante faux, juste une fois.'),
      close('cool', H, 'sourire', 'Résultat : tout le monde chante faux. Bravo, maestro.', 'r'),
      shot('stage', { h: 0.5, caps: [cap('Cette nuit-là, une voix fantôme résonne dans l’opéra désert.')] })
    ] });

  ep({ ch: 5, title: 'La voix des cintres', mode: 'half', tier: 'h45',
    suspects: ['Paulette Paillette', 'Sam Souffle', 'Gérard Rideau', 'Aria Vibrato'], culprit: 'Gérard Rideau', word: 'le coupable', noun: 'chant',
    intro: [
      close('cool', 'Enzo Lyrico', 'choc', 'Une voix ! En pleine nuit ! Elle chante mieux que moi ! C’est forcément un fantôme !'),
      close('warm', H, 'serieux', 'Les fantômes n’ont pas d’alibi. La voix venait {lieu} à {h}.', 'r')
    ],
    caseTitle: 'Une voix mystérieuse chante la nuit.', caseBody: 'On l’a entendue à {h}, {lieu}. Le coupable mêle le vrai et le faux ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'gene', 'Trente ans que je baisse le rideau sur les autres. J’avais envie de chanter, moi aussi.'),
      close('cool', H, 'sourire', 'Et vous chantez rudement bien, monsieur Rideau.', 'r'),
      shot('stage', { h: 0.5, caps: [cap('Soir de première. Un bouquet anonyme arrive pour la diva… avec une plume.')] })
    ] });

  ep({ ch: 5, title: 'Bouquet final', mode: 'half', tier: 'h46',
    suspects: ['Enzo Lyrico', 'Maestro Vivaldo Baguette', 'Paulette Paillette', 'Lucie Fer'], culprit: 'Lucie Fer', word: 'la messagère', noun: 'livraison',
    intro: [
      close('warm', 'Aria Vibrato', 'choc', 'Un bouquet de roses noires… et un mot : « Casino, minuit, le Hibou vous attend ».'),
      close('cool', H, 'serieux', 'Le bouquet a été déposé {lieu} à {h}. Six créneaux, et le coupable dit vrai à moitié.', 'r')
    ],
    caseTitle: 'Un bouquet du Hibou a été livré.', caseBody: 'Il a été déposé à {h}, {lieu}. Le coupable mêle le vrai et le faux ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Cette fois, je n’ai même pas couru. Le Hibou vous attend, Hortense. Il vous connaît bien.'),
      close('cool', H, 'serieux', 'Il me connaît ? Alors je le connais aussi.', 'r'),
      shot('casino', { h: 0.55, caps: [cap('Fin du chapitre 5. Minuit approche. Le Casino de Monte-Carlo brille de mille feux.')] })
    ] });

  /* ===== Chapitre 6 · Le Casino de Monte-Carlo (finale) ===== */
  ep({ ch: 6, title: 'Rien ne va plus', mode: 'classic', tier: 'c46h', opts: { hard: true },
    suspects: ['René Vaplu', 'Bernadette Banco', 'Rémi Sansou', 'Jacques Potte'], culprit: 'Bernadette Banco', word: 'la tricheuse', noun: 'triche',
    intro: [
      shot('casino', { h: 0.6, caps: [cap('Le Casino de Monte-Carlo. Ici, tout le monde a quelque chose à cacher. Surtout dans ses manches.', 'tl')] }),
      close('cool', 'René Vaplu', 'choc', 'La roulette est truquée ! Le 17 sort à chaque fois ! Rien ne va plus !'),
      close('warm', H, 'serieux', 'Le mécanisme a été trafiqué {lieu} à {h}. Énigme corsée.', 'r')
    ],
    caseTitle: 'La roulette a été truquée.', caseBody: 'Le mécanisme a été modifié à {h}, {lieu}. Tous les constats sont vrais, mais il faudra tester des hypothèses.',
    outro: [
      close('warm', '@culprit', 'gene', 'Le 17, c’est mon chiffre porte-bonheur. Je l’ai juste… un peu aidé.'),
      close('cool', H, 'sourire', 'Banco, madame. Vous avez perdu.', 'r'),
      shot('casino', { h: 0.5, caps: [cap('Au comptoir de la caisse, on découvre des jetons en chocolat.')] })
    ] });

  ep({ ch: 6, title: 'Jetons en chocolat', mode: 'liar', tier: 'l46', opts: { hard: true },
    suspects: ['René Vaplu', 'Jacques Potte', 'Rémi Sansou', 'Bernadette Banco'], culprit: 'René Vaplu', word: 'le faussaire', noun: 'échange',
    intro: [
      close('cool', 'Jacques Potte', 'choc', 'Des jetons en chocolat ! Dans MA caisse ! Ils fondent sur la table de black-jack !'),
      close('warm', H, 'serieux', 'L’échange a eu lieu {lieu} à {h}. Un menteur parmi quatre, et pas des plus faciles.', 'r')
    ],
    caseTitle: 'Les jetons de la caisse ont été remplacés.', caseBody: 'Des jetons en chocolat ont pris la place des vrais à {h}, {lieu}. Les innocents disent vrai, le faussaire ment toujours. Difficile.',
    outro: [
      close('warm', '@culprit', 'gene', 'Faites vos jeux… ou plutôt, faites vos goûters. Le Hibou m’a promis une confiserie à Nice.'),
      close('cool', H, 'serieux', 'Encore lui. Il est forcément ici, ce soir.', 'r'),
      shot('casino', { h: 0.5, caps: [cap('Le directeur pose une minute sa mallette des recettes. Une minute de trop.')] })
    ] });

  ep({ ch: 6, title: 'La mallette du directeur', mode: 'half', tier: 'h46',
    suspects: ['Bernadette Banco', 'Lucie Fer', 'Rémi Sansou', 'René Vaplu'], culprit: 'Lucie Fer', word: 'la voleuse', noun: 'vol',
    intro: [
      close('cool', 'Jacques Potte', 'choc', 'Ma mallette ! Les recettes de la soirée ! Et une plume de hibou, bien sûr !'),
      close('warm', H, 'serieux', 'Ouverte {lieu} à {h}. Le coupable mêle le vrai et le faux.', 'r')
    ],
    caseTitle: 'La mallette du directeur a été vidée.', caseBody: 'Elle a été ouverte à {h}, {lieu}. Le coupable mêle le vrai et le faux ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'serieux', 'D’accord, vous m’avez eue. Mais je n’ai jamais vu le visage du Hibou. Il porte toujours un masque… et une voilette.'),
      close('cool', H, 'serieux', 'Une voilette ? Le Hibou serait… une femme ?', 'r'),
      shot('casino', { h: 0.5, caps: [cap('À la table de baccara, les gains de Bernadette Banco s’envolent.')] })
    ] });

  ep({ ch: 6, title: 'Banco !', mode: 'classic', tier: 'c55',
    suspects: ['Jacques Potte', 'René Vaplu', 'Rémi Sansou', 'Aria Vibrato', 'Ernest Couchette'], culprit: 'Ernest Couchette', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Bernadette Banco', 'choc', 'Mes gains ! Toute ma soirée ! Je les avais posés une seconde !'),
      close('cool', H, 'serieux', 'Cinq suspects, dont deux vieilles connaissances. Les gains ont disparu {lieu} à {h}.', 'r')
    ],
    caseTitle: 'Les gains de Bernadette Banco ont disparu.', caseBody: 'Ils ont été pris à {h}, {lieu}. Cinq suspects et des constats tous vrais.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je suis serveur ici le samedi… Le monsieur, enfin la dame masquée, m’a encore donné un pourboire.'),
      close('cool', H, 'serieux', 'Ernest ! Depuis le train, vous travaillez pour elle ?', 'r'),
      shot('casino', { h: 0.5, caps: [cap('Soudain, des centaines de plumes de hibou tombent du plafond.')] })
    ] });

  ep({ ch: 6, title: 'Pluie de plumes', mode: 'liar', tier: 'l46', opts: { hard: true },
    suspects: [DIANE, 'Jacques Potte', 'Aria Vibrato', 'Rémi Sansou'], culprit: 'Aria Vibrato', word: 'la coupable', noun: 'diversion',
    intro: [
      close('cool', 'René Vaplu', 'choc', 'Des plumes partout ! Dans les cartes, dans les verres, dans ma moustache !'),
      close('warm', H, 'serieux', 'Une diversion. Les plumes ont été lâchées {lieu} à {h}. Un menteur parmi quatre, et la comtesse elle-même témoigne.', 'r')
    ],
    caseTitle: 'Une pluie de plumes a semé la panique.', caseBody: 'Elles ont été lâchées à {h}, {lieu}. Les innocents disent vrai, le coupable ment toujours. Difficile.',
    outro: [
      close('warm', '@culprit', 'gene', 'Elle m’a promis le premier rôle à la Scala. Une diva ne refuse pas la Scala.'),
      close('cool', H, 'serieux', '« Elle ». Vous avez dit « elle ».', 'r'),
      shot('casino', { h: 0.5, caps: [cap('Pendant la confusion, le chapeau et le carnet d’Hortense disparaissent.')] })
    ] });

  ep({ ch: 6, title: 'Double jeu', mode: 'half', tier: 'h46',
    suspects: [DIANE, 'René Vaplu', 'Bernadette Banco', 'Rémi Sansou'], culprit: 'Rémi Sansou', word: 'le voleur', noun: 'vol',
    intro: [
      close('cool', H, 'choc', 'Mon chapeau ! Et mon carnet, encore ! On me les a pris {lieu} à {h}.', 'r'),
      close('warm', DIANE, 'neutre', 'Allons, ma chère Hortense, ce n’est qu’un chapeau.')
    ],
    caseTitle: 'Le chapeau et le carnet d’Hortense ont été volés.', caseBody: 'Ils ont été pris à {h}, {lieu}. Le coupable mêle le vrai et le faux ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais protéger quelqu’un… Une personne de ma famille. Dans votre carnet, vous aviez presque deviné.'),
      close('cool', H, 'serieux', 'Votre famille, Rémi ? Vous n’avez qu’une tante.', 'r'),
      shot('box', { h: 0.55, caps: [cap('Gala de clôture. Les vraies Larmes de Lune sont exposées sous une cloche de verre… puis s’évaporent.')] })
    ] });

  ep({ ch: 6, title: 'Le Hibou', mode: 'half', tier: 'h46', opts: { hard: true },
    suspects: [DIANE, 'Rémi Sansou', 'Jacques Potte', 'Aria Vibrato'], culprit: DIANE, word: 'le Hibou', noun: 'dernier vol',
    intro: [
      close('cool', 'Jacques Potte', 'choc', 'Les Larmes de Lune étaient sous la cloche il y a une minute ! Elles ont disparu !'),
      close('warm', H, 'serieux', 'Dernière affaire. Le collier a disparu {lieu} à {h}. Le Hibou est parmi ces quatre-là. Et il mêle le vrai et le faux.', 'r')
    ],
    caseTitle: 'Le dernier vol du Hibou.', caseBody: 'Le collier a disparu à {h}, {lieu}. Le coupable mêle le vrai et le faux ; les autres disent vrai. Démasque le Hibou.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Bravo, ma chère Hortense. Oui, c’était moi. L’assurance paie très bien les colliers volés… et je m’ennuyais tellement à Paris.'),
      close('cool', H, 'serieux', 'Vous avez volé votre propre collier, comtesse. Puis vous m’avez engagée pour le retrouver.', 'r'),
      close('warm', '@culprit', 'gene', 'Il fallait bien quelqu’un d’intelligent pour rendre le jeu amusant.'),
      close('cool', H, 'sourire', 'Chapeau, comtesse. Mais la prison n’a pas de wagon-lit.', 'r'),
      shot('night', { h: 0.6, caps: [cap('FIN. L’Express de minuit repart vers Paris. Hortense Lafleur a enfin le temps de lire un bon roman policier.')] })
    ] });

  return { chapters: CHAPTERS, levels: L, wrong: WRONG, wrongEp: WRONG_EP, detectiveWrong: DETECTIVE_WRONG, detective: H };
});

