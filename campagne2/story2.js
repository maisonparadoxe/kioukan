/* Campagne 2 « La Dernière Vente » : trame, chapitres et 58 épisodes (43 à 100).
   Même format que la campagne 1. Jetons : {h} heure du méfait · {lieu} « dans le salon » · {heures} heures possibles
   (bon moment) · {coupable} nom du coupable. Les mécaniques de chaque épisode viennent de plan.js / puzzles2.json. */
(function (root, factory) {
  var spec = factory();
  if (typeof module === 'object' && module.exports) module.exports = spec;
  else root.KioukanSpec2 = spec;
})(typeof self !== 'undefined' ? self : this, function () {
  var H = 'Hortense Lafleur', DIANE = 'Comtesse Diane de Carat', SONGE = 'Inspecteur Armand Songe';
  function cap(text, pos) { return { pos: pos || 'bl', text: text }; }
  function say(who, text, side) { return { who: who, text: text, side: side || 'l' }; }
  function shot(bg, o) { o = o || {}; o.bg = bg; o.h = o.h || (o.chars ? 0.92 : 0.62); return o; }
  function face(name, expr, extra) { var b = { chars: [{ name: name, expr: expr || 'neutre', x: 50, w: 82 }] }; for (var k in extra) b[k] = extra[k]; return b; }
  function close(bg, name, expr, line, side, extra) { var o = face(name, expr, extra); o.say = [say(name, line, side)]; return shot(bg, o); }
  function hc(expr, line, extra) { return close('cool', H, expr, line, 'r', extra); }
  function sfx(bg, text, capText) { return shot(bg, { h: 0.55, sfx: { text: text, x: 50, y: 42, rot: -6, center: true }, caps: [cap(capText)] }); }
  function nar(bg, a, b) { var c = [cap(a, 'tl')]; if (b) c.push(cap(b, 'br')); return shot(bg, { h: 0.6, caps: c }); }
  function rule(text) { return shot('corridor', { h: 0.62, caps: [cap(text)] }); }

  var CHAPTERS = [
    { n: 7, title: 'Le Palais de justice', place: 'palais', blurb: 'Paris, six mois après Monte-Carlo. Le procès de la Comtesse s’achève, et Hortense hérite d’un adjoint très poli.' },
    { n: 8, title: 'L’Hôtel Drouot', place: 'drouot', blurb: 'Paris, la salle des ventes. Ici, tout se vend. Même les secrets. Et pour la première fois, il y a un mort.' },
    { n: 9, title: 'Le château de Montfaucon', place: 'chateau', blurb: 'Sologne. Des portraits, des armures… et des passages que tout le monde ne connaît pas.' },
    { n: 10, title: 'Le train de nuit pour Venise', place: 'simplon', blurb: 'Paris – Venise en voiture-lits. Dans le noir des tunnels, on assomme plus vite qu’on ne poinçonne.' },
    { n: 11, title: 'Le carnaval de Venise', place: 'venise', blurb: 'Des masques, des gondoles, deux jumelles… et une arme qui ne se trouve pas toujours là où on frappe.' },
    { n: 12, title: 'L’hospice du Grand-Col', place: 'hospice', blurb: 'Bloqués par la neige dans les Alpes. Puis la lumière s’éteint, et plus personne ne voit rien.' },
    { n: 13, title: 'La banque de Genève', place: 'banque', blurb: 'Une banque suisse où chaque porte a sa serrure, et chaque serrure sa clé.' },
    { n: 14, title: 'Le musée de cire', place: 'musee', blurb: 'Retour à Paris. Dans ce musée, on sait toujours où le crime a eu lieu. Jamais quand.' },
    { n: 15, title: 'La Dernière Vente', place: 'drouot', blurb: 'Retour à Drouot. Toutes les règles à la fois, et un dernier mensonge à démasquer.' }
  ];

  // Réponses d'un innocent accusé à tort (les anciens gardent celles de la campagne 1)
  var WRONG = {
    'Inspecteur Armand Songe': 'Moi, madame Lafleur ? Je suis de votre côté. Je l’ai toujours été.',
    'Juge Odile Hibéré': 'Objection ! Je juge les coupables, je ne les imite pas.',
    'Gédéon Barreau': 'Trente ans que je garde des voleurs. Je sais comment ils finissent.',
    'Ana Gramme': 'Je critique l’art, madame. Je ne le vole pas.',
    'Marquis Hugues de Montfaucon': 'Un Montfaucon ne s’abaisse pas. Il fait faire.',
    'Pia Doppio': 'Ce n’est pas moi ! C’est peut-être ma sœur. Ou peut-être pas.',
    'Paola Doppio': 'Vous me confondez avec Pia. Tout le monde nous confond.',
    'Frère Bernard Lhermite': 'Je fais vœu de silence, madame. Pas vœu de mensonge.',
    'Frank Suisse': 'La banque Lombard est neutre, madame. Moi aussi.',
    'Gaspard Pièce': 'Si c’était moi, vous n’auriez trouvé aucune trace. Je suis serrurier.',
    'Cyrielle Bougie': 'Accusez-moi si vous voulez, mais ça ne tiendra pas. Ça fondra.',
    'Comtesse Diane de Carat': 'Ma chère Hortense, je suis en prison. C’est un alibi en béton.'
  };
  var DETECTIVE_WRONG = [
    'Hmm. Son alibi tient. Reprenons la chronologie.',
    'Je retire ce que j’ai dit. Mon carnet n’a pas dit son dernier mot.',
    'Fausse piste. Le coupable doit bien rire.',
    'Ce n’était pas la bonne personne. Recomptons.'
  ];

  var L = [];
  function ep(o) { L.push(o); }

  /* ===== Chapitre 7 · Le Palais de justice ===== */
  ep({ ch: 7, title: 'Le marteau de la juge', word: 'le voleur', noun: 'vol',
    intro: [
      nar('night', 'Paris, six mois après Monte-Carlo.', 'Le procès de la Comtesse Diane de Carat touche à sa fin.'),
      close('warm', 'Juge Odile Hibéré', 'choc', 'Mon marteau ! Mon marteau d’audience a disparu ! Comment voulez-vous que je rende la justice sans taper sur quelque chose ?'),
      close('warm', SONGE, 'sourire', 'Inspecteur Armand Songe, de la Sûreté. On m’a chargé de vous seconder, madame Lafleur. C’est un honneur.', 'l', { caps: [cap('Un nouveau venu. Très poli.')] }),
      hc('serieux', 'Le marteau a été pris {lieu} à {h}. Le voleur y était seul. Au travail, inspecteur.')
    ],
    caseTitle: 'Le marteau de la juge a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente. Trois personnes rôdaient au Palais cet après-midi-là.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais juste l’emprunter. Pour faire monter les enchères quand ils vendront les bijoux de ma tante. Adjugé, vendu… à moi !'),
      hc('sourire', 'Rendez ce marteau, Rémi. On ne rachète pas le collier de sa tante avec un marteau volé.'),
      nar('night', 'Le verdict tombe : la Comtesse est condamnée.', 'Ses bijoux seront vendus aux enchères à l’Hôtel Drouot, au profit des assurances.')
    ] });

  ep({ ch: 7, title: 'Le collier sous scellés', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Maître Gérard Menvussa', 'choc', 'Les scellés ! Quelqu’un a ouvert la boîte du collier au greffe ! Je suis le notaire chargé de la vente, on va m’accuser !'),
      hc('serieux', 'Rassurez-vous, maître : le collier est toujours là. Mais quelqu’un a brisé les scellés {lieu} à {h}. Et il était seul.'),
      close('warm', SONGE, 'serieux', 'Mettez-moi sur la liste, madame Lafleur. La règle est la même pour tout le monde.')
    ],
    caseTitle: 'Les scellés du collier ont été brisés.', caseBody: 'Quelqu’un a ouvert la boîte des Larmes de Lune à {h}, {lieu}. Il y était seul. L’inspecteur Songe a tenu à figurer parmi les suspects.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais juste le voir, ce collier. Trente ans que je garde des voleurs, et je n’avais jamais vu ce qu’ils volaient.'),
      close('warm', DIANE, 'sourire', 'Ma chère Hortense. Vous croyez vraiment que j’étais seule ?', 'l', { caps: [cap('Au parloir, quelques minutes plus tard.')] }),
      hc('serieux', 'Que voulez-vous dire, comtesse ?'),
      nar('night', 'La Comtesse ne répond pas. Elle sourit.', 'Dans le couloir flotte un léger parfum de violette.')
    ] });

  /* ===== Chapitre 8 · L'Hôtel Drouot ===== */
  ep({ ch: 8, title: 'Adjugé, assassiné', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('lobby', 'L’Hôtel Drouot, la veille de la grande vente.', 'Maître Adjugé Vandu, le commissaire-priseur, prépare le catalogue.'),
      sfx('scream', 'AAAH !', 'À la fermeture, on le retrouve sans vie.'),
      hc('serieux', 'Cette fois, ce n’est plus un vol, inspecteur. C’est un meurtre.'),
      close('warm', SONGE, 'serieux', 'Maître Vandu a été frappé {lieu} à {h}. Son assassin était seul avec lui.'),
      rule('Nouveau : la victime a sa ligne dans la grille. Retrouve aussi ses déplacements. À l’heure du crime, elle était avec son meurtrier, et elle n’a plus bougé ensuite.')
    ],
    caseTitle: 'Maître Vandu a été assassiné.', caseBody: 'Il a été tué à {h}, {lieu}. Le meurtrier était seul avec lui. Reconstitue aussi les déplacements de la victime jusqu’à sa mort.',
    outro: [
      close('warm', '@culprit', 'choc', 'Je ne voulais pas… On m’avait promis une fortune. Une lettre, glissée sous ma porte. Elle sentait la violette.'),
      hc('serieux', 'Une lettre ? Signée de qui ?'),
      close('warm', '@culprit', 'gene', 'Pas de nom. Juste un dessin : un hibou.'),
      nar('night', 'Hippolyte Plateau est arrêté.', 'Mais le Hibou est en prison. Alors qui signe ces lettres ?')
    ] });

  ep({ ch: 8, title: 'Le catalogue raturé', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Ana Gramme', 'choc', 'Quelqu’un a raturé le catalogue ! L’estimation des Larmes de Lune est passée d’un million… à trois francs !'),
      close('warm', 'Ana Gramme', 'sourire', 'Ana Gramme, critique d’art. Vous savez que « Hortense Lafleur » donne « L’enfer sur hôtel » ? À une lettre près.', 'l', { caps: [cap('Elle adore les anagrammes.')] }),
      hc('serieux', 'Le catalogue a été trafiqué {lieu} à {h}. Une seule personne y était.')
    ],
    caseTitle: 'Le catalogue de la vente a été raturé.', caseBody: 'Les estimations ont été modifiées à {h}, {lieu}. La coupable ou le coupable y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'Trois francs, c’est une estimation très raisonnable. Pour moi.'),
      hc('sourire', 'On n’achète pas un collier au prix d’une baguette, madame Pépite.')
    ] });

  ep({ ch: 8, title: 'Le faux Fragonard', word: 'le faussaire', noun: 'faux',
    intro: [
      close('warm', 'Ana Gramme', 'choc', 'Ce Fragonard est un faux ! La peinture est encore fraîche, et la signature dit « Fragonarde ».'),
      hc('serieux', 'Le vrai tableau a été échangé {lieu} à {h}. Le faussaire était seul.')
    ],
    caseTitle: 'Un faux tableau a remplacé le vrai.', caseBody: 'L’échange a eu lieu à {h}, {lieu}. Le faussaire y était seul.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Avouez qu’il est réussi ! J’ai juste raté le E. Je comptais le vendre pour racheter le collier de ma tante.'),
      hc('serieux', 'Votre talent mérite mieux, Rémi. Une école d’art, par exemple. Ou une bonne leçon.')
    ] });

  ep({ ch: 8, title: 'Monsieur Moustache', word: 'le ravisseur', noun: 'enlèvement',
    intro: [
      close('warm', 'Lise Défait', 'choc', 'Monsieur Moustache a disparu ! Le chat du vestiaire ! Il dort toujours sur les manteaux de fourrure !', 'l', { caps: [cap('Lise Défait, ancienne femme de chambre du Grand Hôtel, fait le ménage à Drouot.')] }),
      hc('serieux', 'On l’a enfermé {lieu} à {h}. Son ravisseur était seul avec lui.'),
      rule('Comme une victime, le chat a sa ligne dans la grille. Une fois enfermé, il n’a plus bougé.')
    ],
    caseTitle: 'Monsieur Moustache, le chat du vestiaire, a été enlevé.', caseBody: 'Il a été enfermé à {h}, {lieu}, par une personne seule avec lui. Retrouve aussi les déplacements du chat.',
    outro: [
      close('warm', '@culprit', 'gene', 'Mon prochain roman s’appelle « Le Chat du commissaire-priseur ». Il me fallait un modèle !'),
      hc('sourire', 'Prenez des notes, Agathe. Pas des chats.')
    ] });

  ep({ ch: 8, title: 'La lettre au hibou', word: 'le messager', noun: 'chantage',
    intro: [
      hc('choc', 'Une lettre dans la poche de mon manteau. « Rentrez chez vous, madame Lafleur, ou vous finirez comme Vandu. » Et un hibou dessiné en bas.'),
      close('warm', SONGE, 'serieux', 'Elle sent la violette. Votre manteau était au vestiaire. On l’y a glissée à {h}.'),
      hc('serieux', 'Et celui qui l’a glissée était seul {lieu}. Retrouvons-le.')
    ],
    caseTitle: 'Une lettre de menace a été glissée dans le manteau d’Hortense.', caseBody: 'Elle a été déposée à {h}, {lieu}, par une personne seule. L’inspecteur Songe a encore tenu à figurer parmi les suspects.',
    outro: [
      close('warm', '@culprit', 'gene', 'Un monsieur m’a donné cent francs pour la glisser. Je ne l’ai pas vu : il portait un chapeau, et il sentait la violette.'),
      hc('serieux', 'Encore la violette. Inspecteur, notez.'),
      close('warm', SONGE, 'sourire', 'C’est noté, madame Lafleur. Je note tout.')
    ] });

  ep({ ch: 8, title: 'La loupe d’or', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Paul Ochon', 'choc', 'Ma loupe en or ! Je voulais examiner les diamants du collier avant d’enchérir, et elle a disparu !', 'l', { caps: [cap('Paul Ochon, le directeur du Grand Hôtel, rêve d’exposer le collier dans son hall.')] }),
      hc('serieux', 'Elle a été prise {lieu} à {h}. La voleuse ou le voleur y était seul.')
    ],
    caseTitle: 'La loupe en or de Paul Ochon a disparu.', caseBody: 'Elle a été prise à {h}, {lieu}, par la seule personne présente.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais voir le collier de près, moi aussi. Une critique d’art ne se fie jamais aux photographies.'),
      hc('serieux', 'Pourquoi ce collier vous intéresse-t-il tant, mademoiselle Gramme ?'),
      close('warm', '@culprit', 'neutre', 'Disons que je travaille pour quelqu’un qui veut l’acheter.')
    ] });

  ep({ ch: 8, title: 'La réserve vide', word: 'le voleur', noun: 'vol',
    intro: [
      nar('lobby', 'La nuit avant la vente.', 'Le collier dort dans la réserve, sous la garde de Barnabé, le gardien de nuit.'),
      close('warm', 'Maître Gérard Menvussa', 'choc', 'Le collier a disparu ! Et Barnabé est ficelé comme un saucisson !'),
      hc('serieux', 'On l’a attaché {lieu} à {h}. Le voleur était seul avec lui. Barnabé a sa ligne dans la grille : ensuite, il n’a plus bougé.')
    ],
    caseTitle: 'Le collier a été volé dans la réserve.', caseBody: 'Le gardien Barnabé a été ligoté à {h}, {lieu}, par le voleur, seul avec lui. Ensuite, Barnabé n’a plus bougé.',
    outro: [
      close('warm', '@culprit', 'gene', 'Un chauffeur en livrée m’a payée pour le sortir par le quai. Il y avait des armoiries sur la voiture. Un faucon.'),
      hc('serieux', 'Un faucon… Les Montfaucon. Inspecteur, nous partons pour la Sologne.'),
      nar('night', 'Fin du chapitre 8.', 'La vente est reportée. Direction le château de Montfaucon.')
    ] });

  /* ===== Chapitre 9 · Le château de Montfaucon ===== */
  ep({ ch: 9, title: 'Le courant d’air', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Marquis Hugues de Montfaucon', 'choc', 'Ma tabatière ! Celle de mon arrière-grand-oncle ! On me l’a prise dans la crypte, où je la cache. Enfin, où je la cachais.'),
      hc('serieux', 'Elle a disparu {lieu} à {h}. Une seule personne y était. Mais il y a un drôle de courant d’air dans la bibliothèque…'),
      rule('Nouveau : un passage secret relie la bibliothèque à la crypte. Seuls ceux qui le connaissent peuvent l’emprunter. Les autres passent par les portes.')
    ],
    caseTitle: 'La tabatière du marquis a disparu.', caseBody: 'Elle a été prise à {h}, {lieu}. Un passage secret relie la bibliothèque à la crypte, mais seul Basile Bouture le connaît.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je jardine aussi sous terre, monsieur le marquis. J’ai trouvé ce passage en cherchant des truffes.'),
      close('warm', 'Marquis Hugues de Montfaucon', 'choc', 'Des truffes ? Dans ma bibliothèque ?'),
      hc('sourire', 'Rendez la tabatière, Basile. Et gardez les truffes.')
    ] });

  ep({ ch: 9, title: 'Le portrait qui cligne de l’œil', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Ernest Couchette', 'choc', 'Madame Lafleur ! Le portrait du grand-père du marquis… on lui a découpé les yeux ! Il me regarde à travers le mur !', 'l', { caps: [cap('Ernest Couchette, l’ancien steward de l’Express, a été engagé comme valet pour la saison.')] }),
      hc('serieux', 'La toile a été découpée {lieu} à {h}. Une seule personne y était.')
    ],
    caseTitle: 'Un portrait de la galerie a perdu ses yeux.', caseBody: 'La toile a été découpée à {h}, {lieu}. Un escalier dérobé relie la chambre du marquis à la salle d’armes : Lucie Fer et Julie Enne le connaissent.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais surveiller la galerie sans être vue. Un trou dans un portrait, c’est le plus vieux truc du monde.'),
      hc('serieux', 'Et qui espionniez-vous, Lucie ?'),
      close('warm', '@culprit', 'gene', 'Le marquis. La nuit, il parle tout seul à son collier.')
    ] });

  ep({ ch: 9, title: 'Le collier de la chapelle', word: 'le coupable', noun: 'faux',
    intro: [
      hc('choc', 'Ce n’est pas le vrai collier ! Les Larmes de Lune ont une petite rayure sous le fermoir. Celui-ci n’en a pas.'),
      close('warm', SONGE, 'serieux', 'Le faux a été déposé dans le reliquaire de la chapelle, à {h}. Par une personne seule.')
    ],
    caseTitle: 'Un faux collier dort dans la chapelle.', caseBody: 'Il a été déposé à {h}, {lieu}, par la seule personne présente. Le passage de la bibliothèque à la crypte est connu du marquis et de Basile.',
    outro: [
      close('warm', '@culprit', 'gene', 'C’est moi. J’ai fait faire une copie pour mes invités. Le vrai, je l’ai… prêté. À un homme qui prenait le train pour Venise.'),
      hc('serieux', 'Prêté ? Vous l’avez vendu, monsieur le marquis.'),
      close('warm', '@culprit', 'choc', 'Il fallait bien réparer le toit !')
    ] });

  ep({ ch: 9, title: 'Le notaire dans la crypte', word: 'l’agresseur', noun: 'agression',
    intro: [
      sfx('scream', 'BONG !', 'Un bruit de casserole résonne sous la chapelle.'),
      close('warm', 'Dr Mehdi Cament', 'choc', 'Maître Menvussa a été assommé dans la crypte ! Il respire, mais il ne se souvient même plus de son prénom.'),
      hc('serieux', 'On l’a frappé {lieu} à {h}. Son agresseur était seul avec lui.')
    ],
    caseTitle: 'Maître Menvussa a été assommé.', caseBody: 'Il a été frappé à {h}, {lieu}, par une personne seule avec lui. Ensuite, il n’a plus bougé. Julie Enne connaît le passage de la bibliothèque.',
    outro: [
      close('warm', '@culprit', 'gene', 'J’ai cru que c’était un cambrioleur ! Il fouillait dans le noir… Alors j’ai frappé. Avec ma louche.'),
      hc('serieux', 'Il cherchait le vrai collier, Julie. Comme tout le monde ici.')
    ] });

  ep({ ch: 9, title: 'La tisane du marquis', word: 'le coupable', noun: 'poison', mode: 'liar',
    intro: [
      close('warm', 'Marquis Hugues de Montfaucon', 'choc', 'Ma tisane avait un goût de… dodo. J’ai dormi quatorze heures ! On a voulu m’empoisonner !'),
      hc('serieux', 'La poudre a été versée {lieu} à {h}. Et cette fois, le coupable ment dans tout ce qu’il déclare. Comme au manoir des Oliviers.')
    ],
    caseTitle: 'Quelqu’un a endormi le marquis.', caseBody: 'Un somnifère a été versé dans sa tisane à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai. Le marquis connaît l’escalier dérobé.',
    outro: [
      close('warm', '@culprit', 'gene', 'Une dose de rien du tout ! Je voulais juste qu’il dorme pendant que je fouillais sa chambre.'),
      hc('serieux', 'Fouiller quoi, docteur ?'),
      close('warm', '@culprit', 'neutre', 'Une lettre m’a dit qu’il gardait un secret sous son matelas. Une lettre qui sentait la violette.')
    ] });

  ep({ ch: 9, title: 'Le corbeau de Sologne', word: 'le messager', noun: 'chantage',
    intro: [
      close('warm', 'Julie Enne', 'choc', 'Encore une lettre ! « Le marquis paiera, ou tout le monde saura qu’il a vendu le collier. »'),
      hc('serieux', 'Elle a été posée {lieu} à {h}. Par quelqu’un qui y était seul.')
    ],
    caseTitle: 'Une lettre de chantage menace le marquis.', caseBody: 'Elle a été déposée à {h}, {lieu}, par la seule personne présente. Basile Bouture et Ana Gramme connaissent le passage de la bibliothèque.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je n’ai fait que la poser ! On me l’avait laissée dans la serre, avec un billet de cent francs.'),
      hc('serieux', 'Et un parfum de violette, je suppose.')
    ] });

  ep({ ch: 9, title: 'Mort au château', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('night', 'Dernière nuit à Montfaucon.', 'L’orage gronde sur la Sologne.'),
      sfx('scream', 'AAAH !', 'Au matin, Julie trouve le marquis dans sa chambre. Il ne se réveillera pas.'),
      hc('serieux', 'Il a été tué {lieu} à {h}. Son assassin était seul avec lui. Et il connaissait un passage secret.')
    ],
    caseTitle: 'Le marquis de Montfaucon a été assassiné.', caseBody: 'Il a été tué à {h}, {lieu}, par une personne seule avec lui. Le docteur Cament connaît l’escalier dérobé ; Julie Enne, le passage de la bibliothèque.',
    outro: [
      close('warm', '@culprit', 'choc', 'Il allait parler. Il savait à qui il avait vendu le collier… La lettre disait de le faire taire. Avec un hibou dessiné dessus.'),
      hc('serieux', 'Le Hibou est en prison, docteur.'),
      close('warm', SONGE, 'serieux', 'Alors quelqu’un se sert de son nom, madame Lafleur.'),
      nar('night', 'Fin du chapitre 9.', 'L’acheteur du collier a pris le train de nuit pour Venise. Hortense aussi.')
    ] });

  /* ===== Chapitre 10 · Le train de nuit pour Venise ===== */
  ep({ ch: 10, title: 'La valise du fourgon', word: 'l’agresseur', noun: 'agression',
    intro: [
      close('warm', 'Jean Bilet', 'choc', 'Une passagère assommée dans le fourgon à bagages ! Et sans billet pour le fourgon, en plus !', 'l', { caps: [cap('Jean Bilet, le contrôleur de l’Express, a changé de ligne.')] }),
      close('warm', 'Lucie Fer', 'gene', 'Aïe… On m’a frappée par derrière. Mais je me souviens très bien de ma soirée, jusqu’au coup.'),
      hc('serieux', 'C’est arrivé {lieu} à {h}. Lucie peut témoigner de tout ce qui précède.'),
      rule('Nouveau : un assommé ne bouge plus après le coup, mais il se souvient de tout ce qui s’est passé avant. Ses témoignages sont fiables.')
    ],
    caseTitle: 'Lucie Fer a été assommée dans le fourgon.', caseBody: 'Elle a été frappée à {h}, {lieu}, par une personne seule avec elle. Ensuite, elle n’a plus bougé. Ses souvenirs d’avant le coup sont fiables.',
    outro: [
      close('warm', '@culprit', 'gene', 'Elle m’a surpris en train de fouiller les bagages. J’ai paniqué… avec une valise.'),
      hc('serieux', 'Vous cherchiez le collier, Rémi ?'),
      close('warm', '@culprit', 'choc', 'Tout le monde le cherche, dans ce train !')
    ] });

  ep({ ch: 10, title: 'Le carnet du contrôleur', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Jean Bilet', 'choc', 'Mon carnet ! Toute la liste des passagers ! Qui est monté, qui est descendu, qui a payé…'),
      hc('serieux', 'On l’a pris {lieu} à {h}. La voleuse ou le voleur était seul.')
    ],
    caseTitle: 'Le carnet du contrôleur a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais savoir qui m’avait assommée. Et dans ce carnet, il y a un nom souligné trois fois : Paul Ka, voiture-salon.'),
      hc('serieux', 'Le pianiste. Intéressant.')
    ] });

  ep({ ch: 10, title: 'Le piano qui sonne faux', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Aria Vibrato', 'choc', 'Ce piano sonne comme une casserole ! On a bourré les cordes avec quelque chose !'),
      hc('serieux', 'Le piano a été trafiqué {lieu} à {h}. Une seule personne y était.')
    ],
    caseTitle: 'Le piano de la voiture-salon sonne faux.', caseBody: 'Quelqu’un l’a trafiqué à {h}, {lieu}. Il y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'J’y… rangeais un paquet. Un petit paquet. Pour un ami.'),
      hc('serieux', 'Le paquet a disparu, monsieur Ka. Il ne reste que le papier.'),
      nar('night', 'Le passeur, c’était lui.', 'Mais le collier a déjà changé de mains.')
    ] });

  ep({ ch: 10, title: 'Le contrôleur dans le noir', word: 'l’agresseur', noun: 'agression',
    intro: [
      sfx('scream', 'TCHAC !', 'Un tunnel. Le noir complet. Puis un bruit sourd.'),
      close('warm', 'Jean Bilet', 'gene', 'On m’a frappé avec un objet très lourd. Et très parfumé. Mais je me souviens de tout, jusqu’au coup.'),
      hc('serieux', 'C’est arrivé {lieu} à {h}. Son agresseur était seul avec lui.')
    ],
    caseTitle: 'Le contrôleur a été assommé.', caseBody: 'Jean Bilet a été frappé à {h}, {lieu}, par une personne seule avec lui. Ensuite, il n’a plus bougé. L’inspecteur Songe fait partie des suspects.',
    outro: [
      close('warm', '@culprit', 'gene', 'Avec mon coffret à maquillage. Il voulait me faire payer un supplément pour mes quarante-deux malles !'),
      hc('serieux', 'Quarante-deux malles, Aria ?'),
      close('warm', '@culprit', 'choc', 'Je chante à la Fenice ! On n’y va pas en tenue de voyage !')
    ] });

  ep({ ch: 10, title: 'L’étui à violon', word: 'le voleur', noun: 'vol', mode: 'liar',
    intro: [
      close('warm', 'Paul Ka', 'choc', 'Mon paquet… je l’avais caché dans le fourgon, dans un étui à violon. L’étui est vide !'),
      hc('serieux', 'On l’a vidé {lieu} à {h}. La voleuse ou le voleur y était seul. Et il ment dans tout ce qu’il dit.')
    ],
    caseTitle: 'Le paquet du passeur a été volé.', caseBody: 'L’étui à violon a été vidé à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je l’ai racheté, en quelque sorte. Pour mon client. Il paiera à Venise.'),
      hc('serieux', 'Qui est votre client, mademoiselle Gramme ?'),
      close('warm', '@culprit', 'neutre', 'Un collectionneur. Il donne un bal masqué demain soir. Vous êtes invitée.')
    ] });

  ep({ ch: 10, title: 'Sur le toit du train', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Jean Bilet', 'choc', 'Ma casquette ! On l’a accrochée tout là-haut, sur le toit du train !'),
      hc('serieux', 'Quelqu’un l’a montée {lieu} à {h}. Il y était seul. Par ce froid, il fallait le vouloir.')
    ],
    caseTitle: 'La casquette du contrôleur a fini sur le toit.', caseBody: 'Quelqu’un l’a déposée à {h}, {lieu}, seul. Cinq suspects, dont l’inspecteur Songe.',
    outro: [
      close('warm', '@culprit', 'sourire', 'J’avais parié avec Aria que je monterais sur le toit. Il me fallait une preuve !'),
      hc('serieux', 'Et qu’avez-vous gagné, Rémi ?'),
      close('warm', '@culprit', 'gene', 'Un rhume.')
    ] });

  ep({ ch: 10, title: 'Terminus Venise', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('night', 'Dernière nuit avant Venise.'),
      sfx('scream', 'AAAH !', 'Au petit matin, Ernest trouve Jean Bilet sans vie.'),
      hc('serieux', 'Il a été tué {lieu} à {h}. Son meurtrier était seul avec lui. Jean Bilet notait tout : il en savait trop.')
    ],
    caseTitle: 'Jean Bilet a été assassiné.', caseBody: 'Le contrôleur a été tué à {h}, {lieu}, par une personne seule avec lui. Retrouve aussi ses déplacements jusqu’à sa mort.',
    outro: [
      close('warm', '@culprit', 'choc', 'Il avait mon nom dans son carnet ! La lettre disait : « Le contrôleur sait. » Elle était signée d’un hibou.'),
      hc('serieux', 'Encore le hibou. Et encore la violette.'),
      close('warm', SONGE, 'serieux', 'Le Hibou a donc un complice dehors, madame Lafleur. Je le trouverai.'),
      nar('night', 'Fin du chapitre 10.', 'Le train entre en gare de Venise. Le collier, lui, est déjà au palais Ca’ Doppio.')
    ] });

  /* ===== Chapitre 11 · Le carnaval de Venise ===== */
  ep({ ch: 11, title: 'La tarte du maestro', word: 'le coupable', noun: 'tarte',
    intro: [
      close('warm', 'Maestro Vivaldo Baguette', 'choc', 'Une tarte à la crème ! En pleine figure ! Pendant que je dirigeais la valse !'),
      hc('serieux', 'C’est arrivé {lieu} à {h}. Plusieurs personnes étaient peut-être près de lui. Mais une seule était passée par les cuisines prendre la tarte.'),
      rule('Nouveau : l’arme. Plusieurs suspects peuvent être avec la victime. Le coupable est le seul d’entre eux à être passé par la pièce de l’arme avant les faits.')
    ],
    caseTitle: 'Le maestro a été entarté.', caseBody: 'La tarte a été lancée à {h}, {lieu}. Elle venait des cuisines. Parmi ceux qui étaient avec le maestro, le coupable est le seul à y être passé avant.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Il a dit que je chantais comme une gondole qui grince. Une tarte, c’était le minimum.'),
      hc('sourire', 'La critique est aisée, Enzo. La tarte aussi, apparemment.')
    ] });

  ep({ ch: 11, title: 'Une Doppio peut en cacher une autre', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Paulette Paillette', 'choc', 'Le masque d’or du carnaval a disparu ! Je l’avais posé dans le cabinet des masques !'),
      close('warm', 'Pia Doppio', 'sourire', 'Nous sommes Pia et Paola Doppio, les danseuses du bal. Et non, on ne nous distingue pas.', 'l', { caps: [cap('Deux jumelles. Le même masque, la même robe.')] }),
      hc('serieux', 'Le masque a été pris {lieu} à {h}. Le voleur était seul. Attention : quand un témoin dit avoir vu « une des jumelles », il ne sait pas laquelle.'),
      rule('Nouveau : les jumelles. « Une des jumelles était là » veut dire Pia, ou Paola, ou les deux.')
    ],
    caseTitle: 'Le masque d’or a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente. « Une des jumelles » veut dire Pia, Paola, ou les deux.',
    outro: [
      close('warm', '@culprit', 'gene', 'Nous devions danser avec le même masque. Il n’y en avait qu’un !'),
      close('warm', 'Paola Doppio', 'sourire', 'Ma sœur ne partage jamais rien.')
    ] });

  ep({ ch: 11, title: 'La gondole à la dérive', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'André Vivalto', 'choc', 'Ma gondole ! L’amarre a été coupée ! Elle part vers l’Adriatique !', 'l', { caps: [cap('André Vivalto, ancien chef de la sécurité du Grand Hôtel, aujourd’hui riche collectionneur.')] }),
      hc('serieux', 'L’amarre a été coupée {lieu} à {h}. Une seule personne y était.')
    ],
    caseTitle: 'La gondole de Vivalto part à la dérive.', caseBody: 'L’amarre a été coupée à {h}, {lieu}, par la seule personne présente.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais empêcher monsieur Vivalto de partir avant le bal. Il me doit trois robes !'),
      hc('serieux', 'Vivalto voulait partir ? Avec le collier, peut-être.')
    ] });

  ep({ ch: 11, title: 'Le poivre du ténor', word: 'le coupable', noun: 'poison',
    intro: [
      close('warm', 'Enzo Lyrico', 'choc', 'Atchoum ! Mon miel est plein de poivre ! Ma voix ! Atchoum !'),
      close('warm', 'Maître Gérard Menvussa', 'neutre', 'Bonjour. Je suis… notaire, je crois. On m’a dit que je m’appelais Gérard.', 'l', { caps: [cap('Depuis le coup dans la crypte, le notaire ne se souvient plus de grand-chose.')] }),
      hc('serieux', 'Le miel a été poivré {lieu} à {h}. Le poivre vient des cuisines : parmi ceux qui étaient avec Enzo, seul le coupable y est passé avant.')
    ],
    caseTitle: 'Le miel du ténor a été poivré.', caseBody: 'C’est arrivé à {h}, {lieu}. Le poivre venait des cuisines. Parmi ceux qui étaient avec Enzo, le coupable est le seul à y être passé avant.',
    outro: [
      close('warm', '@culprit', 'gene', 'Du poivre ? J’ai cru que c’était du sel. Ou de la cannelle. Je ne sais plus très bien ce qu’est la cannelle.'),
      hc('sourire', 'Ce n’est rien, maître. On vous le rappellera.')
    ] });

  ep({ ch: 11, title: 'Le carnet du notaire', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Maître Gérard Menvussa', 'choc', 'Mon carnet ! J’y avais écrit tout ce dont je me souviens. Ça tenait sur une page, mais c’était une belle page !'),
      hc('serieux', 'Il a disparu {lieu} à {h}. Le voleur y était seul.')
    ],
    caseTitle: 'Le carnet du notaire a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il y avait écrit : « J’ai vu l’homme à la violette dans la crypte. » Je voulais savoir qui c’était.'),
      hc('serieux', 'Vous jouez avec le feu, Vivalto.'),
      close('warm', '@culprit', 'sourire', 'Je suis collectionneur, madame. Je collectionne aussi les secrets.')
    ] });

  ep({ ch: 11, title: 'Les deux masques', word: 'le voleur', noun: 'vol', mode: 'liar',
    intro: [
      close('warm', 'André Vivalto', 'choc', 'On a volé la clé de ma vitrine ! Celle où je garde mes plus belles pièces !'),
      hc('serieux', 'Elle a été prise {lieu} à {h}, par une personne seule. Et cette personne ment dans tout ce qu’elle dit.')
    ],
    caseTitle: 'La clé de la vitrine de Vivalto a disparu.', caseBody: 'Elle a été prise à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Pia jurait que j’en étais incapable. J’ai gagné le pari.'),
      close('warm', 'Pia Doppio', 'choc', 'Paola ! Rends cette clé avant que maman l’apprenne !'),
      hc('sourire', 'Une jumelle peut en cacher une autre, mais pas longtemps.')
    ] });

  ep({ ch: 11, title: 'Bal masqué, bal tragique', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('stage', 'Minuit. Le grand bal masqué bat son plein.'),
      sfx('scream', 'AAAH !', 'Dans le salon des miroirs, André Vivalto s’effondre.'),
      hc('serieux', 'Un stylet du cabinet des masques. Il a été frappé {lieu} à {h}. Plusieurs danseurs étaient peut-être près de lui, mais un seul était passé prendre le stylet.')
    ],
    caseTitle: 'André Vivalto a été assassiné au bal.', caseBody: 'Il a été frappé à {h}, {lieu}, avec un stylet du cabinet des masques. Parmi ceux qui étaient avec lui, le meurtrier est le seul à être passé par ce cabinet avant.',
    outro: [
      close('warm', '@culprit', 'choc', 'La lettre disait que Vivalto savait qui était l’homme à la violette. Qu’il fallait l’arrêter avant qu’il parle. Je l’ai suivie comme une partition.'),
      hc('serieux', 'Et le collier, maestro ?'),
      close('warm', '@culprit', 'gene', 'Vivalto l’avait déjà confié à un chauffeur. Pour la Suisse. Par le col.'),
      nar('night', 'Fin du chapitre 11.', 'Une voiture file vers les Alpes. Hortense la suit, avec quelques passagers de trop.')
    ] });

  /* ===== Chapitre 12 · L'hospice du Grand-Col ===== */
  ep({ ch: 12, title: 'La tomme de l’hospice', word: 'le voleur', noun: 'vol',
    intro: [
      nar('night', 'La voiture est bloquée par la neige au col.', 'Les moines de l’hospice accueillent tout le monde.'),
      close('warm', 'Frère Bernard Lhermite', 'choc', 'Notre tomme de l’an dernier ! Volée dans la cave pendant la panne de courant !'),
      hc('serieux', 'La panne a eu lieu à {h}. Personne n’a rien vu à ce moment-là. Le voleur était seul {lieu}.'),
      rule('Nouveau : la panne. Aucun témoignage ne porte sur l’heure dans le noir, et cette colonne de la grille reste noire. Il suffit de trouver le coupable.')
    ],
    caseTitle: 'La tomme de l’hospice a été volée.', caseBody: 'Elle a disparu à {h}, en pleine panne, {lieu}. Le voleur y était seul. Personne ne peut dire où se trouvait chacun à ce moment-là.',
    outro: [
      close('warm', '@culprit', 'gene', 'Mille sabords… Vingt ans en mer, et je n’ai jamais goûté un fromage pareil. Il fallait que je sache s’il était aussi bon dans le noir.'),
      hc('sourire', 'Et alors, capitaine ?'),
      close('warm', '@culprit', 'sourire', 'Meilleur.')
    ] });

  ep({ ch: 12, title: 'Le tonnelet du saint-bernard', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Frère Bernard Lhermite', 'choc', 'Le tonnelet de Barry est vide ! Notre meilleur chien de sauvetage… et son eau-de-vie !'),
      hc('serieux', 'Il a été vidé {lieu} à {h}, en pleine panne. Le coupable était seul avec le chien.')
    ],
    caseTitle: 'Le tonnelet du chien Barry a été vidé.', caseBody: 'C’est arrivé à {h}, pendant la panne, {lieu}. Le coupable y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'J’avais froid ! Je conduis cette voiture depuis Venise, et elle n’a pas de chauffage !'),
      hc('serieux', 'C’est donc vous, le chauffeur de Vivalto, Marcel ?'),
      close('warm', '@culprit', 'neutre', 'Mécanicien, chauffeur, ce qu’on veut. Tant qu’on me paie.')
    ] });

  ep({ ch: 12, title: 'Frère Bernard dans le noir', word: 'l’agresseur', noun: 'agression',
    intro: [
      sfx('scream', 'POC !', 'Nouvelle panne. Un cri, un bruit sourd.'),
      close('warm', 'Frère Bernard Lhermite', 'gene', 'On m’a assommé avec un chandelier. Je me souviens de toute ma soirée… jusqu’au noir.'),
      hc('serieux', 'C’est arrivé à {h}, dans le noir, {lieu}. L’agresseur était seul avec lui.')
    ],
    caseTitle: 'Frère Bernard a été assommé pendant la panne.', caseBody: 'Il a été frappé à {h}, {lieu}, par une personne seule avec lui. Ensuite, il n’a plus bougé. Ses souvenirs d’avant le coup sont fiables.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je l’ai pris pour un fantôme ! Une grande robe, une capuche, dans le noir… J’ai lu trop de romans d’Agathe Crispie.'),
      hc('sourire', 'Les fantômes ne sentent pas le fromage, madame Ence.')
    ] });

  ep({ ch: 12, title: 'Le scarabée d’or', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Pr Hector Tumulus', 'choc', 'Mon scarabée d’or ! Je l’emportais à Genève pour le faire expertiser ! Volé pendant la panne !'),
      hc('serieux', 'On l’a pris {lieu} à {h}. Dans le noir, mais seul.')
    ],
    caseTitle: 'Le scarabée d’or du professeur a disparu.', caseBody: 'Il a été pris à {h}, pendant la panne, {lieu}, par la seule personne présente.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Il brillait dans le noir ! J’ai cru que c’était une luciole des neiges.'),
      close('warm', 'Paola Doppio', 'gene', 'Il n’y a pas de lucioles à deux mille mètres, Pia.'),
      hc('sourire', 'Ni de scarabées d’or, d’habitude.')
    ] });

  ep({ ch: 12, title: 'Les chaînes de neige', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Marcel Hélice', 'choc', 'Les chaînes de neige ! Quelqu’un les a cachées dans la paille du chenil ! Sans elles, impossible de repartir !'),
      hc('serieux', 'Elles y ont été cachées à {h}, pendant la panne. Une seule personne était {lieu}.')
    ],
    caseTitle: 'Les chaînes de neige ont été cachées.', caseBody: 'Quelqu’un les a cachées à {h}, pendant la panne, {lieu}. Il y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je ne voulais pas partir ! Les moines chantent si bien, ici. Et les chiens sont si doux.'),
      hc('serieux', 'Le collier repart avec la voiture, Paola. Vous le saviez ?'),
      close('warm', '@culprit', 'choc', 'Le collier ? Dans la voiture ?')
    ] });

  ep({ ch: 12, title: 'Le journal du professeur', word: 'le voleur', noun: 'vol', mode: 'liar',
    intro: [
      close('warm', 'Pr Hector Tumulus', 'choc', 'Mon journal de fouilles ! J’y avais noté une chose étrange… sur quelqu’un de ce voyage. Il a disparu !'),
      hc('serieux', 'Il a été pris {lieu} à {h}. Le voleur était seul, et il ment dans tout ce qu’il déclare.')
    ],
    caseTitle: 'Le journal du professeur Tumulus a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais savoir s’il parlait de moi. Il me regarde toujours comme une momie.'),
      hc('serieux', 'Il ne parlait pas de vous, Cécile. Et une page avait déjà été arrachée avant votre passage.')
    ] });

  ep({ ch: 12, title: 'Nuit blanche au Grand-Col', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('night', 'La dernière nuit. La tempête redouble.', 'Puis, encore une fois, la lumière s’éteint.'),
      sfx('scream', 'AAAH !', 'Quand elle revient, le professeur Tumulus gît dans la chapelle.'),
      hc('serieux', 'Il a été tué {lieu} à {h}, dans le noir. Son meurtrier était seul avec lui.')
    ],
    caseTitle: 'Le professeur Tumulus a été assassiné.', caseBody: 'Il a été tué à {h}, pendant la panne, {lieu}, par une personne seule avec lui. Retrouve aussi ses déplacements jusqu’à sa mort.',
    outro: [
      close('warm', '@culprit', 'choc', 'Il avait reconnu quelqu’un. La lettre disait de le faire taire avant Genève. Elle était glissée dans le moteur, avec un hibou dessiné dessus.'),
      hc('serieux', 'Qui avait-il reconnu, Marcel ?'),
      close('warm', '@culprit', 'gene', 'Je ne sais pas ! Moi, je conduis, c’est tout.'),
      nar('night', 'Fin du chapitre 12.', 'La neige s’arrête. Le collier attend à Genève, dans un coffre.')
    ] });

  /* ===== Chapitre 13 · La banque de Genève ===== */
  ep({ ch: 13, title: 'Le coffre 13', word: 'le coupable', noun: 'méfait',
    intro: [
      close('warm', 'Frank Suisse', 'choc', 'Le coffre 13 a été ouvert ! En vingt ans, jamais un coffre de la banque Lombard n’a été ouvert. Sauf par son propriétaire. Et encore, sur rendez-vous.', 'l', { caps: [cap('Frank Suisse, directeur de la banque. Ponctuel à la seconde.')] }),
      hc('serieux', 'La salle des coffres est fermée à clé. Il n’y a qu’une clé, et c’est vous qui l’aviez au début de la soirée.'),
      rule('Nouveau : les portes fermées à clé. Pour en franchir une, il faut la clé, ou passer avec celui qui la porte. Deux personnes dans la même pièce peuvent se passer la clé.')
    ],
    caseTitle: 'Le coffre 13 a été ouvert.', caseBody: 'Il a été ouvert à {h}, {lieu}, par la seule personne présente. Les portes de la salle des coffres sont fermées à clé ; au début de la soirée, la clé est chez Frank Suisse.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je ne l’ai pas volé ! Je l’ai ouvert, pour vérifier la serrure. Il n’existe pas de serrure qui me résiste. C’est une question d’honneur.'),
      close('warm', 'Frank Suisse', 'choc', 'Vous êtes le serrurier de la banque, monsieur Pièce !'),
      close('warm', '@culprit', 'gene', 'Justement. Il fallait bien tester mon travail.')
    ] });

  ep({ ch: 13, title: 'Le jeton porte-bonheur', word: 'la voleuse', noun: 'vol',
    intro: [
      close('warm', 'Jacques Potte', 'choc', 'Mon jeton porte-bonheur ! Celui du casino ! Je l’avais laissé sur le bureau du directeur pendant notre rendez-vous !', 'l', { caps: [cap('Jacques Potte, directeur du casino de Monte-Carlo, venu placer ses économies.')] }),
      hc('serieux', 'Il a été pris {lieu} à {h}. La porte du bureau est fermée à clé, et c’est Gaspard qui l’avait au départ.')
    ],
    caseTitle: 'Le jeton porte-bonheur de Jacques Potte a disparu.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente. La porte entre les guichets et le bureau est fermée ; la clé est d’abord chez Gaspard Pièce.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais le porter rien qu’une soirée ! Depuis Monte-Carlo, je perds tout.'),
      hc('sourire', 'Un porte-bonheur ne porte bonheur qu’à son propriétaire, Bernadette.')
    ] });

  ep({ ch: 13, title: 'Le registre des coffres', word: 'le faussaire', noun: 'faux',
    intro: [
      close('warm', 'Ana Gramme', 'choc', 'Le registre des coffres a été falsifié ! Le coffre où dort le collier n’appartient plus à personne. Plus de propriétaire, plus de trace !'),
      close('warm', 'Ernest Couchette', 'gene', 'On m’a confié la clé de la salle du conseil, madame Lafleur. Je sers le café aux banquiers, maintenant.', 'l', { caps: [cap('Ernest change souvent de métier.')] }),
      hc('serieux', 'Le registre a été trafiqué {lieu} à {h}. Une seule personne y était.')
    ],
    caseTitle: 'Le registre des coffres a été falsifié.', caseBody: 'Le faux a été fait à {h}, {lieu}, par la seule personne présente. La porte de la salle du conseil est fermée ; la clé est d’abord chez Ernest.',
    outro: [
      close('warm', '@culprit', 'gene', 'Un client m’a demandé la plus grande discrétion. C’est la règle de la maison : on ne pose pas de questions.'),
      hc('serieux', 'Quel client, monsieur Suisse ?'),
      close('warm', '@culprit', 'neutre', 'Il a payé en liquide. Et il sentait… la violette, je crois.')
    ] });

  ep({ ch: 13, title: 'Ernest au coffre', word: 'le coupable', noun: 'méfait',
    intro: [
      sfx('scream', 'BOUM BOUM !', 'Des coups sourds résonnent dans la salle des coffres.'),
      close('warm', 'Ernest Couchette', 'choc', 'Au secours ! On m’a enfermé avec les coffres ! J’ai du café, mais pas de sucre !'),
      hc('serieux', 'On l’a poussé à l’intérieur {lieu} à {h}. Le coupable était seul avec lui.')
    ],
    caseTitle: 'Ernest a été enfermé dans la salle des coffres.', caseBody: 'Il y a été poussé à {h}, {lieu}, par une personne seule avec lui. Ensuite, il n’a plus bougé. Les portes de la salle des coffres sont fermées ; la clé est d’abord chez Gaspard Pièce.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il me suivait partout ! Je voulais juste qu’il me lâche cinq minutes !'),
      close('warm', 'Ernest Couchette', 'gene', 'Je vous suivais parce que vous aviez renversé du café sur la moquette, mademoiselle.')
    ] });

  ep({ ch: 13, title: 'Le faux billet', word: 'la faussaire', noun: 'faux',
    intro: [
      close('warm', 'Frank Suisse', 'choc', 'Un faux billet de mille francs ! Dans MA banque ! Et l’encre n’est même pas sèche !'),
      hc('serieux', 'On l’a glissé dans la caisse {lieu} à {h}. Le faussaire était seul.')
    ],
    caseTitle: 'Un faux billet a été glissé dans la banque.', caseBody: 'Il a été déposé à {h}, {lieu}, par la seule personne présente. La porte du bureau du directeur est fermée ; la clé est d’abord chez Frank Suisse.',
    outro: [
      close('warm', '@culprit', 'sourire', 'C’était pour rire ! Pia dessine les billets, et moi je les glisse. On fait ça à chaque carnaval.'),
      close('warm', 'Pia Doppio', 'choc', 'Paola ! Pas devant la détective !')
    ] });

  ep({ ch: 13, title: 'Le conseil secret', word: 'le corbeau', noun: 'chantage', mode: 'liar',
    intro: [
      close('warm', 'Frank Suisse', 'choc', 'Une lettre sur la table du conseil ! « Ouvrez le coffre du collier, ou toute la Suisse saura ce que vous cachez. »'),
      hc('serieux', 'Elle a été déposée {lieu} à {h}, par quelqu’un de seul. Et ce quelqu’un ment dans tout ce qu’il dit.')
    ],
    caseTitle: 'Une lettre de chantage menace le banquier.', caseBody: 'Elle a été déposée à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai. La porte de la salle du conseil est fermée ; la clé est d’abord chez Frank Suisse.',
    outro: [
      close('warm', '@culprit', 'gene', 'D’accord, c’est moi. Mon client veut le collier, et il le veut avant la vente de Drouot.'),
      hc('serieux', 'Votre client, Ana. Son nom.'),
      close('warm', '@culprit', 'neutre', 'Je ne l’ai jamais vu. Il m’écrit. Ses lettres sentent la violette, et il signe d’un hibou. Comme les autres.')
    ] });

  ep({ ch: 13, title: 'Le coffre de minuit', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('night', 'Minuit. La banque est fermée.', 'Ou presque.'),
      sfx('scream', 'AAAH !', 'Au matin, Jacques Potte est retrouvé dans la salle des coffres. Mort.'),
      hc('serieux', 'Il a été tué {lieu} à {h}. Son meurtrier était seul avec lui. Et pour entrer, il fallait la clé… ou son porteur.')
    ],
    caseTitle: 'Jacques Potte a été assassiné dans la salle des coffres.', caseBody: 'Il a été tué à {h}, {lieu}, par une personne seule avec lui. Les portes de la salle des coffres sont fermées ; la clé est d’abord chez Gaspard Pièce.',
    outro: [
      close('warm', '@culprit', 'choc', 'Il avait vu le visage de l’homme à la violette, au casino, il y a des années. La lettre disait : « Il va parler à la détective. »'),
      hc('serieux', 'Et le collier, René ?'),
      close('warm', '@culprit', 'gene', 'Il est parti hier. Dans une caisse. Pour un musée de cire, à Paris.'),
      nar('night', 'Fin du chapitre 13.', 'Retour à Paris.')
    ] });

  /* ===== Chapitre 14 · Le musée de cire ===== */
  ep({ ch: 14, title: 'La tête du roi', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Cyrielle Bougie', 'choc', 'La tête de Louis XIV a disparu ! Il reste le corps, et la perruque est par terre !', 'l', { caps: [cap('Cyrielle Bougie, sculptrice du musée. Elle a toujours les doigts pleins de cire.')] }),
      hc('serieux', 'On sait où : dans la galerie des rois. Mais on ne sait pas quand. Le gardien est passé plusieurs fois : la tête était là, puis elle n’était plus là.'),
      rule('Nouveau : le bon moment. Le lieu est connu, pas l’heure. Parmi les heures possibles, une seule où un seul suspect était dans la pièce : c’est l’heure du vol, et c’est le voleur.')
    ],
    caseTitle: 'La tête de Louis XIV a disparu.', caseBody: 'Elle a été prise dans la galerie des rois, à l’une de ces heures : {heures}. À l’heure du vol, et seulement à celle-là, il n’y avait qu’une personne dans la galerie.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je l’ai mise dans mon trou de souffleur, pour me tenir compagnie. Elle est de très bon conseil.'),
      hc('sourire', 'Un Roi-Soleil souffleur, Sam ? Il doit se retourner dans sa tombe.')
    ] });

  ep({ ch: 14, title: 'La couronne de l’impératrice', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Max Valise', 'choc', 'La couronne de Joséphine ! Elle était sur sa tête de cire, et maintenant elle est sur… rien !', 'l', { caps: [cap('Max Valise, l’ancien groom du Grand Hôtel, est aujourd’hui guide au musée.')] }),
      hc('serieux', 'Encore la galerie des rois. Encore une heure à trouver.')
    ],
    caseTitle: 'La couronne de Joséphine a disparu.', caseBody: 'Elle a été prise dans la galerie des rois, à l’une de ces heures : {heures}. À l’heure du vol, il n’y avait qu’une personne dans la galerie.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je l’ai empruntée pour la recoudre ! Les perles tombaient. Une habilleuse ne supporte pas une couronne mal cousue.'),
      hc('sourire', 'On demande la permission, Paulette. Même à une impératrice en cire.')
    ] });

  ep({ ch: 14, title: 'La diva de cire', word: 'le coupable', noun: 'agression',
    intro: [
      close('warm', 'Aria Vibrato', 'choc', 'On m’a assommée dans la loge des artistes ! Avec une louche ! Une louche pleine de cire tiède !'),
      hc('serieux', 'Une louche de l’atelier. C’est arrivé {lieu} à {h}. Plusieurs personnes étaient peut-être là, mais une seule était passée par l’atelier avant.')
    ],
    caseTitle: 'Aria Vibrato a été assommée.', caseBody: 'Elle a été frappée à {h}, {lieu}, avec une louche de l’atelier des cires. Parmi ceux qui étaient avec elle, le coupable est le seul à être passé par l’atelier avant. Ensuite, Aria n’a plus bougé.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais prendre l’empreinte de son visage pour sa statue ! Elle bougeait tout le temps. Alors j’ai… calmé le modèle.'),
      close('warm', 'Aria Vibrato', 'choc', 'Calmé le modèle ?!'),
      hc('serieux', 'Pas de statue de cette façon, Cyrielle.')
    ] });

  ep({ ch: 14, title: 'Le fantôme du petit théâtre', word: 'le coupable', noun: 'sabotage',
    intro: [
      close('warm', 'Gérard Rideau', 'choc', 'Quelqu’un a scié les cordes du rideau du petit théâtre ! Il est tombé sur le premier rang… qui était vide, heureusement.'),
      hc('serieux', 'On sait où. Reste à savoir quand.')
    ],
    caseTitle: 'Les cordes du rideau ont été sciées.', caseBody: 'C’est arrivé dans le petit théâtre, à l’une de ces heures : {heures}. Le coupable y était seul.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Je voulais une sortie spectaculaire ! Un ténor ne sort pas de scène : il disparaît derrière un rideau qui tombe.'),
      hc('serieux', 'Il y avait une répétition prévue, Enzo.'),
      close('warm', '@culprit', 'gene', 'Ah. J’ai oublié de regarder le programme.')
    ] });

  ep({ ch: 14, title: 'Le palais des mirages', word: 'le voleur', noun: 'vol',
    intro: [
      close('warm', 'Max Valise', 'choc', 'Le grand miroir du palais des mirages a été volé ! Il reste un trou dans le mur… et dans le trou, un autre miroir.'),
      hc('serieux', 'On sait où, pas quand. Et n’oublions pas : « une des jumelles » ne dit pas laquelle.')
    ],
    caseTitle: 'Un miroir a disparu du palais des mirages.', caseBody: 'Il a été pris au palais des mirages, à l’une de ces heures : {heures}. La voleuse ou le voleur y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'Nous voulions savoir laquelle de nous deux était la plus belle. Il nous fallait un miroir qui ne ment pas.'),
      close('warm', 'Paola Doppio', 'sourire', 'Il a dit que c’était moi.')
    ] });

  ep({ ch: 14, title: 'La lettre dans la cire', word: 'le corbeau', noun: 'chantage', mode: 'liar',
    intro: [
      close('warm', 'Cyrielle Bougie', 'choc', 'Une lettre ! Coulée dans la cire de la statue de la Comtesse ! « Je sais qui tu es. Paie, ou je parle. »'),
      hc('serieux', 'Elle a été cachée {lieu} à {h}, par quelqu’un de seul. Et ce quelqu’un ment dans tout ce qu’il dit.')
    ],
    caseTitle: 'Une lettre de chantage a été cachée dans la cire.', caseBody: 'Elle a été déposée à {h}, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'gene', 'J’ai vu l’homme à la violette au Grand Hôtel, il y a longtemps. Je portais ses valises. Je voulais juste un peu d’argent pour me taire.'),
      hc('serieux', 'Qui est-ce, Max ? Dites-le-moi, c’est dangereux.'),
      close('warm', '@culprit', 'neutre', 'Demain, madame Lafleur. Demain, je vous dirai tout.')
    ] });

  ep({ ch: 14, title: 'Au pied de la Comtesse', word: 'le meurtrier', noun: 'meurtre',
    intro: [
      nar('night', 'Le lendemain matin.'),
      sfx('scream', 'AAAH !', 'Max Valise est retrouvé sans vie au pied de la statue de la Comtesse, dans la salle des grands criminels.'),
      hc('serieux', 'On sait où. On ne sait pas quand. Il allait tout me dire…')
    ],
    caseTitle: 'Max Valise a été assassiné.', caseBody: 'Il a été tué dans la salle des grands criminels, à l’une de ces heures : {heures}. À l’heure du crime, le meurtrier était le seul suspect dans la salle. Aux autres heures, la salle était vide, ou il y avait du monde.',
    outro: [
      close('warm', '@culprit', 'choc', 'La lettre disait : « Le groom va parler. » Et elle promettait le collier. Le vrai. Pour moi, si je le faisais.'),
      hc('serieux', 'Le collier était caché dans la statue de la Comtesse, n’est-ce pas ?'),
      close('warm', '@culprit', 'gene', 'Je l’ai remis dans sa caisse. Pour Drouot. La vente a lieu demain.'),
      nar('night', 'Fin du chapitre 14.', 'Retour au point de départ : la vente des Larmes de Lune.')
    ] });

  /* ===== Chapitre 15 · La Dernière Vente ===== */
  ep({ ch: 15, title: 'La clé de la réserve', word: 'le voleur', noun: 'vol',
    intro: [
      nar('lobby', 'Hôtel Drouot.', 'La grande vente commence dans une heure.'),
      close('warm', 'Maître Gérard Menvussa', 'choc', 'Le catalogue des Larmes de Lune a disparu de la réserve ! Je m’en souviens, cette fois ! J’ai tout noté !'),
      hc('serieux', 'La réserve est fermée à clé. Au début, la clé était chez Ginette, qui veut tout acheter.')
    ],
    caseTitle: 'Le catalogue a disparu de la réserve.', caseBody: 'Il a été pris à {h}, {lieu}, par la seule personne présente. Les portes de la réserve sont fermées ; la clé est d’abord chez Ginette Pépite.',
    outro: [
      close('warm', '@culprit', 'gene', 'Je voulais voir la photo du collier une dernière fois. C’était celui de ma tante, quand même.'),
      hc('sourire', 'Vous êtes plus sentimental que vous ne le dites, Rémi.')
    ] });

  ep({ ch: 15, title: 'Le cadre vide', word: 'la coupable', noun: 'agression',
    intro: [
      sfx('scream', 'CRAC !', 'Un cadre doré se brise.'),
      close('warm', 'Ernest Couchette', 'gene', 'On m’a assommé avec un cadre. Vide, heureusement. Je me souviens de tout jusque-là, madame.'),
      hc('serieux', 'Le cadre venait de la réserve. C’est arrivé {lieu} à {h}. Parmi ceux qui étaient avec Ernest, une seule personne était passée par la réserve avant.')
    ],
    caseTitle: 'Ernest a été assommé avec un cadre.', caseBody: 'Il a été frappé à {h}, {lieu}, avec un cadre de la réserve. Parmi ceux qui étaient avec lui, le coupable est le seul à être passé par la réserve avant. Ensuite, Ernest n’a plus bougé.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il m’a prise pour Pia ! Il voulait me rendre un mouchoir qu’elle avait perdu. Ça m’énerve, qu’on nous confonde !'),
      close('warm', 'Ernest Couchette', 'gene', 'Toujours au mauvais endroit, au mauvais moment. C’est mon talent, madame.')
    ] });

  ep({ ch: 15, title: 'Panne à Drouot', word: 'la voleuse', noun: 'vol', mode: 'liar',
    intro: [
      nar('night', 'Les lumières de Drouot s’éteignent d’un coup.'),
      close('warm', 'Aria Vibrato', 'choc', 'Mes boucles d’oreilles ! On me les a retirées dans le noir !'),
      hc('serieux', 'La panne a eu lieu à {h}. La voleuse ou le voleur était seul {lieu}, et ment dans tout ce qu’il dit.')
    ],
    caseTitle: 'Les boucles d’oreilles d’Aria ont disparu pendant la panne.', caseBody: 'Elles ont été prises à {h}, en pleine panne, {lieu}, par la seule personne présente. Le coupable ment ; les autres disent vrai.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Pour mon roman ! « Les Boucles de la diva ». Il fallait que je sache si c’était faisable dans le noir.'),
      hc('serieux', 'C’est faisable, Agathe. Et ça se voit quand même.')
    ] });

  ep({ ch: 15, title: 'Le marteau d’ivoire', word: 'la voleuse', noun: 'vol',
    intro: [
      close('warm', 'Juge Odile Hibéré', 'choc', 'Le marteau d’ivoire de maître Vandu, exposé en sa mémoire, a disparu de la salle d’exposition !'),
      hc('serieux', 'On sait où. Reste à savoir quand.')
    ],
    caseTitle: 'Le marteau de maître Vandu a disparu.', caseBody: 'Il a été pris dans la salle d’exposition, à l’une de ces heures : {heures}. La voleuse ou le voleur y était seul.',
    outro: [
      close('warm', '@culprit', 'gene', 'Il fallait bien un marteau pour la vente ! Et je compte adjuger le collier… à moi-même.'),
      hc('sourire', 'Ce n’est pas ainsi que fonctionnent les enchères, madame Pépite. Rendez-le au bureau.')
    ] });

  ep({ ch: 15, title: 'Le dernier faux', word: 'la faussaire', noun: 'faux', mode: 'liar2',
    intro: [
      close('warm', 'Maître Gérard Menvussa', 'choc', 'Le collier de la vente est un faux ! Encore un ! On l’a échangé ce matin !'),
      hc('serieux', 'Cette fois, deux personnes mentent : la coupable ou le coupable, et un complice.'),
      rule('Nouveau : deux menteurs. Le coupable ment dans tout ce qu’il dit, et un complice aussi. Tous les autres disent vrai.')
    ],
    caseTitle: 'Le collier de la vente a été remplacé par un faux.', caseBody: 'L’échange a eu lieu à {h}, {lieu}, par la seule personne présente. Deux suspects mentent dans tout ce qu’ils disent : le coupable et un complice.',
    outro: [
      close('warm', '@culprit', 'gene', 'C’est moi. Mon client m’avait donné la copie. Il m’avait juré que l’inspecteur me couvrirait.'),
      hc('serieux', 'L’inspecteur ? Inspecteur Songe… vous avez menti dans votre déposition.'),
      close('warm', SONGE, 'sourire', 'Une erreur de mémoire, madame Lafleur. Ça arrive à tout le monde. Même à vous.')
    ] });

  ep({ ch: 15, title: 'Les lettres au hibou', word: 'la voleuse', noun: 'vol', mode: 'liar2',
    intro: [
      hc('choc', 'Toutes les lettres au hibou ! Je les gardais dans le bureau du commissaire-priseur. Elles ont disparu !'),
      close('warm', 'Rémi Sansou', 'serieux', 'Elles ont été prises à {h}, madame Lafleur, {lieu}. Et vous dites qu’il y a encore deux menteurs ?')
    ],
    caseTitle: 'Les lettres au hibou ont disparu.', caseBody: 'Elles ont été prises à {h}, {lieu}, par la seule personne présente. Deux suspects mentent : le coupable et un complice.',
    outro: [
      close('warm', '@culprit', 'gene', 'On m’a demandé de les brûler. Une lettre glissée sous ma porte… et l’inspecteur m’a dit que c’était pour l’enquête.'),
      hc('serieux', 'Encore lui. Inspecteur Songe, où étiez-vous quand le marquis est mort ? Et pendant la panne au Grand-Col ?'),
      close('warm', SONGE, 'serieux', 'Toujours à vos côtés, madame Lafleur. Vous ne l’aviez pas remarqué ?'),
      nar('night', 'Un parfum de violette flotte dans le bureau.')
    ] });

  ep({ ch: 15, title: 'La Dernière Vente', word: 'le coupable', noun: 'agression', mode: 'liar2',
    intro: [
      nar('lobby', 'La vente des Larmes de Lune commence enfin.', 'La Comtesse a été extraite de prison pour y assister.'),
      close('warm', 'Juge Odile Hibéré', 'serieux', 'Lot numéro un : les Larmes de Lune. Mise à prix…'),
      sfx('scream', 'BANG !', 'Un coup de marteau. Pas sur le pupitre : sur la tête d’Ana Gramme.'),
      hc('serieux', 'Ana a été frappée {lieu} à {h}, avec le marteau du bureau. Parmi ceux qui étaient avec elle, un seul était passé le prendre. Et deux personnes mentent.')
    ],
    caseTitle: 'Ana Gramme a été assommée en pleine vente.', caseBody: 'Elle a été frappée à {h}, {lieu}, avec le marteau d’ivoire du bureau du commissaire-priseur. Parmi ceux qui étaient avec elle, le coupable est le seul à être passé par le bureau avant. Deux suspects mentent : le coupable et un complice.',
    outro: [
      close('warm', '@culprit', 'sourire', 'Bravo, madame Lafleur. Vous y avez mis le temps.'),
      hc('serieux', 'La violette. Le hibou. Les lettres. Vous écriviez au nom de votre mère, inspecteur.'),
      close('warm', DIANE, 'choc', 'Armand ! Je t’avais dit de ne pas…'),
      hc('serieux', 'Votre fils, comtesse. Le complice que vous m’annonciez au parloir. Vous venez de vous trahir.'),
      close('warm', '@culprit', 'gene', 'Je voulais seulement lui rendre son collier. Et faire payer ceux qui l’avaient envoyée en prison.'),
      hc('sourire', 'Inspecteur Songe, vous êtes en état d’arrestation. Je garde vos menottes en souvenir.'),
      nar('night', 'FIN. Les Larmes de Lune sont rendues aux assurances.', 'Hortense Lafleur a enfin le temps de finir son roman policier. Sauf si…')
    ] });

  return { chapters: CHAPTERS, levels: L, wrong: WRONG, wrongEp: {}, detectiveWrong: DETECTIVE_WRONG, detective: H, first: 43 };
});
