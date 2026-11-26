/* Langue : détection, T(), noms adaptés, bandeau de changement de langue. Chargé avant tout le reste. */
(function () {
  var stored = '';
  try { stored = localStorage.getItem('kioukan.lang') || ''; } catch (e) { /* stockage indisponible */ }
  var nav = (navigator.language || 'en').toLowerCase();
  var lang = stored === 'fr' || stored === 'en' || stored === 'it' ? stored : (nav.indexOf('fr') === 0 ? 'fr' : nav.indexOf('it') === 0 ? 'it' : 'en');
  window.KIOUKAN_LANG = lang;
  try { document.documentElement.lang = lang; } catch (e) { /* rien */ }

  /* Noms : identifiant interne (français, sert aux images et aux couleurs) → nom affiché en anglais */
  var NAMES = {
    'Hortense Lafleur': 'Hortense Bloom', 'Comtesse Diane de Carat': 'Countess Diana Carat',
    'Rémi Sansou': 'Remy Skint', 'Aria Vibrato': 'Aria Vibrato', 'Ernest Couchette': 'Ernest Bunkley',
    'Jean Bilet': 'Jack Punch', 'Pr Hector Tumulus': 'Prof. Hector Barrow',
    'André Vivalto': 'André Vivalto', 'Paul Ochon': 'Paul Pillow', 'Lise Défait': 'Sheila Sheets', 'Max Valise': 'Lou Gage', 'Jacques Teil': 'Tom Collins', 'Ginette Pépite': 'Goldie Nugget', 'Chef Al Dente': 'Chef Al Dente', 'Maître Gérard Menvussa': 'Seymour Nott', 'Lucie Fer': 'Lucy Fer', 'Hippolyte Plateau': 'Ivor Tray', 'Julie Enne': 'Julie Anne', 'Basile Bouture': 'Bud Cutting', 'Dr Mehdi Cament': 'Dr Medi Cation', 'Marcel Hélice': 'Rusty Propp', 'Paul Ka': 'Paul Kerr', 'Cécile Ence': 'Cecily Hush', 'Agathe Crispie': 'Agatha Crispy', 'Capitaine Jean Tempête': 'Captain John Gale', 'Enzo Lyrico': 'Enzo Lyrico', 'Paulette Paillette': 'Sally Sequin', 'Sam Souffle': 'Sam Whisper', 'Gérard Rideau': 'Kurt Tenn', 'Maestro Vivaldo Baguette': 'Maestro Vivaldo Baguette', 'René Vaplu': 'Noah Morbets', 'Bernadette Banco': 'Betty Allin', 'Jacques Potte': 'Jack Potts',
    'Mme Vernet': 'Mrs Vernet', 'Dr Aubry': 'Dr Aubry', 'Lucas': 'Lucas', 'Colonel Marchal': 'Colonel Marchal', 'Inès': 'Inès',
    'Mme Delaunay': 'Mrs Delaunay', 'Dr Moreau': 'Dr Moreau', 'Baron Voss': 'Baron Voss', 'Roux': 'Roux', 'Mlle Ferrand': 'Miss Ferrand',
    'Mme Lefèvre': 'Mrs Lefèvre', 'M. Costa': 'Mr Costa', 'Dr Bellamy': 'Dr Bellamy', 'Mme Okafor': 'Mrs Okafor', 'Chef Duval': 'Chef Duval'
  };
  /* Noms italiens : jeux de mots refaits en italien (pas de traduction littérale) */
  var NAMES_IT = {
    'Hortense Lafleur': 'Ortensia Fiore', 'Comtesse Diane de Carat': 'Contessa Diana dei Carati',
    'Rémi Sansou': 'Remo Squattrinato', 'Aria Vibrato': 'Aria Vibrato', 'Ernest Couchette': 'Ernesto Cuccetta',
    'Jean Bilet': 'Gianni Biglietti', 'Pr Hector Tumulus': 'Prof. Ettore Tumulo',
    'André Vivalto': 'André Vivalto', 'Paul Ochon': 'Paolo Guanciale', 'Lise Défait': 'Lisa Sfatta', 'Max Valise': 'Max Valigia', 'Jacques Teil': 'Aldo Spritz', 'Ginette Pépite': 'Gina Pepita', 'Chef Al Dente': 'Chef Al Dente',
    'Maître Gérard Menvussa': 'Notaio Guido Nonvedo', 'Lucie Fer': 'Lucia Fero', 'Hippolyte Plateau': 'Ippolito Vassoio', 'Julie Enne': 'Giulia Soffritto', 'Basile Bouture': 'Basilio Talea', 'Dr Mehdi Cament': 'Dott. Medi Camento',
    'Capitaine Jean Tempête': 'Capitano Gianni Tempesta', 'Marcel Hélice': 'Marcello Elica', 'Paul Ka': 'Mario Zurka', 'Cécile Ence': 'Cecilia Silenzi', 'Agathe Crispie': 'Agata Crispi',
    'Enzo Lyrico': 'Enzo Lyrico', 'Maestro Vivaldo Baguette': 'Maestro Vivaldo Bacchetta', 'Paulette Paillette': 'Carla Lustrini', 'Sam Souffle': 'Saverio Soffio', 'Gérard Rideau': 'Gerardo Sipario',
    'René Vaplu': 'Renato Puntata', 'Bernadette Banco': 'Bernardetta Banco', 'Jacques Potte': 'Giacomo Piatti',
    'Mme Vernet': 'Sig.ra Vernet', 'Dr Aubry': 'Dott. Aubry', 'Lucas': 'Lucas', 'Colonel Marchal': 'Colonnello Marchal', 'Inès': 'Inès',
    'Mme Delaunay': 'Sig.ra Delaunay', 'Dr Moreau': 'Dott. Moreau', 'Baron Voss': 'Barone Voss', 'Roux': 'Roux', 'Mlle Ferrand': 'Sig.na Ferrand',
    'Mme Lefèvre': 'Sig.ra Lefèvre', 'M. Costa': 'Sig. Costa', 'Dr Bellamy': 'Dott. Bellamy', 'Mme Okafor': 'Sig.ra Okafor', 'Chef Duval': 'Chef Duval',
    'Inspecteur Armand Songe': 'Ispettore Filippo Fandoni', 'Juge Odile Hibéré': 'Giudice Delia Berata', 'Gédéon Barreau': 'Gedeone Sbarra', 'Maître Adjugé Vandu': 'Maestro Aldo Venduto',
    'Ana Gramme': 'Anna Gramma', 'Marquis Hugues de Montfaucon': 'Marchese Ugo di Montfalcone', 'Pia Doppio': 'Pia Doppio', 'Paola Doppio': 'Paola Doppio',
    'Frère Bernard Lhermite': 'Frate Bernardo Eremita', 'Frank Suisse': 'Franco Svizzero', 'Gaspard Pièce': 'Gaspare Grimaldello', 'Cyrielle Bougie': 'Cirilla Candela',
    'Monsieur Moustache': 'Signor Baffo', 'Barnabé': 'Barnaba'
  };
  window.KIOUKAN_SHORT_IT = { 'Hortense Lafleur': 'Ortensia', 'Comtesse Diane de Carat': 'Contessa', 'Rémi Sansou': 'Remo', 'Aria Vibrato': 'Aria', 'Ernest Couchette': 'Ernesto', 'Jean Bilet': 'Biglietti', 'Pr Hector Tumulus': 'Tumulo',
    'André Vivalto': 'Vivalto', 'Paul Ochon': 'Guanciale', 'Lise Défait': 'Lisa', 'Max Valise': 'Max', 'Jacques Teil': 'Spritz', 'Ginette Pépite': 'Gina', 'Chef Al Dente': 'Al Dente',
    'Maître Gérard Menvussa': 'Nonvedo', 'Lucie Fer': 'Lucia', 'Hippolyte Plateau': 'Ippolito', 'Julie Enne': 'Giulia', 'Basile Bouture': 'Basilio', 'Dr Mehdi Cament': 'Camento',
    'Capitaine Jean Tempête': 'Tempesta', 'Marcel Hélice': 'Marcello', 'Paul Ka': 'Zurka', 'Cécile Ence': 'Cecilia', 'Agathe Crispie': 'Agata',
    'Enzo Lyrico': 'Enzo', 'Maestro Vivaldo Baguette': 'Bacchetta', 'Paulette Paillette': 'Carla', 'Sam Souffle': 'Saverio', 'Gérard Rideau': 'Sipario', 'René Vaplu': 'Renato', 'Bernadette Banco': 'Banco', 'Jacques Potte': 'Piatti',
    'Inspecteur Armand Songe': 'Fandoni', 'Juge Odile Hibéré': 'Berata', 'Gédéon Barreau': 'Sbarra', 'Maître Adjugé Vandu': 'Venduto', 'Ana Gramme': 'Anna', 'Marquis Hugues de Montfaucon': 'Marchese',
    'Pia Doppio': 'Pia', 'Paola Doppio': 'Paola', 'Frère Bernard Lhermite': 'Frate Bernardo', 'Frank Suisse': 'Svizzero', 'Gaspard Pièce': 'Gaspare', 'Cyrielle Bougie': 'Cirilla', 'Monsieur Moustache': 'Baffo', 'Barnabé': 'Barnaba' };
  window.KIOUKAN_NAMES_IT = NAMES_IT;
  window.KIOUKAN_SHORT_EN = { 'Hortense Lafleur': 'Hortense', 'Comtesse Diane de Carat': 'Countess', 'Rémi Sansou': 'Remy', 'Aria Vibrato': 'Aria', 'Ernest Couchette': 'Ernest', 'Jean Bilet': 'Punch', 'Pr Hector Tumulus': 'Barrow', 'André Vivalto': 'Vivalto', 'Paul Ochon': 'Pillow', 'Lise Défait': 'Sheila', 'Max Valise': 'Lou', 'Jacques Teil': 'Collins', 'Ginette Pépite': 'Goldie', 'Chef Al Dente': 'Al Dente', 'Maître Gérard Menvussa': 'Nott', 'Lucie Fer': 'Lucy', 'Hippolyte Plateau': 'Ivor', 'Julie Enne': 'Julie', 'Basile Bouture': 'Bud', 'Dr Mehdi Cament': 'Cation', 'Marcel Hélice': 'Rusty', 'Paul Ka': 'Kerr', 'Cécile Ence': 'Cecily', 'Agathe Crispie': 'Agatha', 'Capitaine Jean Tempête': 'Gale', 'Enzo Lyrico': 'Enzo', 'Paulette Paillette': 'Sally', 'Sam Souffle': 'Sam', 'Gérard Rideau': 'Tenn', 'Maestro Vivaldo Baguette': 'Baguette', 'René Vaplu': 'Noah', 'Bernadette Banco': 'Betty', 'Jacques Potte': 'Potts' };
  var REV = {}, k;
  for (k in NAMES) REV[NAMES[k]] = k;
  for (k in NAMES_IT) REV[NAMES_IT[k]] = k;
  window.KIOUKAN_NAMES = NAMES;
  /* nom affiché pour un identifiant */
  window.tn = function (n) { return lang === 'en' ? (NAMES[n] || n) : lang === 'it' ? (NAMES_IT[n] || n) : n; };
  /* nom court affiché (fiches, grille) */
  window.tshort = function (n, fallback) { var m = lang === 'en' ? window.KIOUKAN_SHORT_EN : lang === 'it' ? window.KIOUKAN_SHORT_IT : null; return (m && m[n]) || fallback; };
  /* identifiant français pour un nom affiché (ou déjà un identifiant) */
  window.frName = function (n) { return REV[n] || n; };

  /* Textes d'interface : la clé est le texte français ; sans traduction on garde le français */
  window.KIOUKAN_EN = window.KIOUKAN_EN || {};
  window.KIOUKAN_IT = window.KIOUKAN_IT || {};
  window.T = function (fr, vars) {
    var s = fr;
    if (lang === 'en' && window.KIOUKAN_EN[fr] != null) s = window.KIOUKAN_EN[fr];
    else if (lang === 'it') s = window.KIOUKAN_IT[fr] != null ? window.KIOUKAN_IT[fr] : (window.KIOUKAN_EN[fr] != null ? window.KIOUKAN_EN[fr] : fr);
    if (vars) for (var key in vars) s = s.split('{' + key + '}').join(vars[key]);
    return s;
  };

  /* Changement de langue : bandeau qui descend avec le drapeau, puis la page se recharge ; il remonte à l'arrivée */
  var FLAGS = {
    fr: '<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" fill="#0a3a9c"/><rect x="1" width="1" height="2" fill="#f4f1ea"/><rect x="2" width="1" height="2" fill="#d6281f"/></svg>',
    it: '<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" fill="#0b8a3e"/><rect x="1" width="1" height="2" fill="#f4f1ea"/><rect x="2" width="1" height="2" fill="#d6281f"/></svg>',
    en: '<svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice"><rect width="60" height="40" fill="#1c2f6e"/><path d="M0 0L60 40M60 0L0 40" stroke="#f4f1ea" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#d6281f" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#f4f1ea" stroke-width="13"/><path d="M30 0V40M0 20H60" stroke="#d6281f" stroke-width="8"/></svg>'
  };
  window.setLang = function (l) {
    if (l === lang) return;
    try { localStorage.setItem('kioukan.lang', l); } catch (e) { /* rien */ }
    var on = window.KSFX && window.KSFX.isOn();
    if (on) window.KSFX.play('pick');
    setTimeout(function () { location.reload(); }, on ? 280 : 10);
  };
  document.addEventListener('DOMContentLoaded', function () {
    var tx = document.querySelectorAll('[data-i18n]');
    for (var j = 0; j < tx.length; j++) { var el0 = tx[j]; if (!el0.getAttribute('data-fr')) el0.setAttribute('data-fr', el0.textContent); el0.textContent = window.T(el0.getAttribute('data-fr')); }
    var ar = document.querySelectorAll('[data-i18n-aria]');
    for (var q = 0; q < ar.length; q++) ar[q].setAttribute('aria-label', window.T(ar[q].getAttribute('data-i18n-aria')));
    var menus = document.querySelectorAll('[data-lang-menu]');
    var LANGS = [['fr', 'Français'], ['en', 'English'], ['it', 'Italiano']];
    for (var i = 0; i < menus.length; i++) {
      (function (host) {
        var cur = LANGS.filter(function (x) { return x[0] === lang; })[0];
        host.innerHTML = '<button type="button" class="ld-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="' + (lang === 'fr' ? 'Langue' : lang === 'it' ? 'Lingua' : 'Language') + '"><i class="lf">' + FLAGS[lang] + '</i><span>' + cur[1] + '</span><em aria-hidden="true">▾</em></button>' +
          '<ul class="ld-list" role="listbox" hidden>' + LANGS.map(function (x) {
            return '<li role="option" tabindex="-1" data-l="' + x[0] + '" aria-selected="' + (x[0] === lang) + '"><i class="lf">' + FLAGS[x[0]] + '</i>' + x[1] + '</li>';
          }).join('') + '</ul>';
        var btn = host.querySelector('.ld-btn'), list = host.querySelector('.ld-list');
        function open(o) { list.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false'); host.classList.toggle('open', o); if (o) { var sel = list.querySelector('[aria-selected="true"]'); if (sel) sel.focus(); } }
        btn.addEventListener('click', function (ev) { ev.stopPropagation(); open(list.hidden); });
        list.addEventListener('click', function (ev) { var li = ev.target.closest('li'); if (!li) return; open(false); window.setLang(li.getAttribute('data-l')); });
        list.addEventListener('keydown', function (ev) {
          var items = [].slice.call(list.children), k = items.indexOf(document.activeElement);
          if (ev.key === 'ArrowDown') { ev.preventDefault(); items[(k + 1) % items.length].focus(); }
          else if (ev.key === 'ArrowUp') { ev.preventDefault(); items[(k + items.length - 1) % items.length].focus(); }
          else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (document.activeElement.click) document.activeElement.click(); }
          else if (ev.key === 'Escape' || ev.key === 'Tab') { open(false); btn.focus(); }
        });
        document.addEventListener('click', function () { if (!list.hidden) open(false); });
      })(menus[i]);
    }
  });
})();
