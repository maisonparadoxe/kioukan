
(function () {
  var I = window.KIOUKAN_IMAGES || {};
  try { if (localStorage.getItem('kioukan.tuto') === 'done') { var tc = document.getElementById('tuto-cta'); if (tc) tc.classList.add('done'); var tb = document.getElementById('tuto-btn'); if (tb) tb.textContent = (window.T || String)('Refaire'); } } catch (e) { /* stockage indisponible */ }
  var lg = document.querySelector('.logo');
  if (lg) { lg.setAttribute('aria-label', 'Kioukan'); lg.innerHTML = lg.textContent.split('').map(function (c, i) { return '<span aria-hidden="true" style="--i:' + i + '">' + c + '</span>'; }).join(''); }
  if (I['bg:night']) document.getElementById('story-img').src = I['bg:night'];
  var f = document.getElementById('faces'), rot = [-3, 2, -1];
  ['remi-sansou', 'aria-vibrato', 'ernest-couchette'].forEach(function (k, i) { if (I[k]) f.innerHTML += '<div style="background-image:url(' + I[k] + ');--r:' + rot[i] + 'deg"></div>'; });
  try {
    var pr = JSON.parse(localStorage.getItem('kioukan.histoire') || '{}'), n = Object.keys(pr.solved || {}).length;
    if (n) {
      var no = document.getElementById('story-no');
      no.removeAttribute('data-i18n'); no.textContent = n >= 42 ? T('Histoire terminée') : T('Épisode') + ' ' + Math.min(n + 1, 42) + ' / 42'; no.className = 'no prog';
      if (n >= 42) { var cl = document.getElementById('c2-lock'); cl.removeAttribute('data-i18n'); cl.textContent = T('Campagne 1 terminée, patience !'); }
      var sb = document.getElementById('story-btn'); sb.removeAttribute('data-i18n'); sb.textContent = T(n >= 42 ? 'Relire l’enquête' : 'Reprendre l’enquête');
    }
  } catch (e) { /* stockage indisponible */ }
})();

(function () {
  var dlg = document.getElementById('howto'), op = document.getElementById('howto-open');
  if (!dlg || !op || !dlg.showModal) return;
  var body = document.getElementById('howto-body');
  function build() {
    var steps = [
      T('<b>La chronologie.</b> Chaque case indique dans quelle pièce se trouvait un suspect à une heure donnée. Touche une case pour choisir la pièce.'),
      T('<b>Les déplacements.</b> Entre deux heures, un suspect reste sur place ou franchit une porte. Un mur ne se traverse pas : le plan te montre les passages.'),
      T('<b>Le crime.</b> À l’heure du crime, le coupable était seul dans la pièce où il a été commis.'),
      T('<b>Les cases dorées</b> sont des faits établis. Le bouton <b>Indice</b> en révèle une de plus, et la <b>vérification en direct</b> signale tes erreurs en rouge.'),
      T('<b>J’accuse !</b> Dès que tu es sûr, désigne le coupable. Une mauvaise accusation compte comme une erreur.')
    ];
    var modes = [[T('Classique'), T('Tous les indices du carnet sont vrais : il suffit de reconstituer la seule chronologie qui les respecte tous.')],
      [T('Un menteur'), T('Les suspects font des déclarations. Un seul ment, et c’est le coupable : toutes ses déclarations sont fausses.')],
      [T('Demi-vérités'), T('Le coupable mêle le vrai et le faux : au moins une de ses déclarations est vraie et au moins une est fausse. Les innocents disent toujours vrai.')]];
    body.innerHTML = '<p class="hk">' + T('Mode d’emploi') + '</p><h2 id="howto-title">' + T('Comment jouer') + '</h2>' +
      '<p class="hl">' + T('Un crime a été commis. Reconstitue qui était où, et à quelle heure, pour démasquer le coupable.') + '</p>' +
      '<ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      '<h3>' + T('Les trois modes de jeu') + '</h3><ul class="hm">' + modes.map(function (x) { return '<li><b>' + x[0] + '</b> : ' + x[1] + '</li>'; }).join('') + '</ul>' +
      '<h3>' + T('Deux façons de jouer') + '</h3><ul class="hm"><li><b>' + T('Mode histoire') + '</b> : ' + T('une enquête en épisodes, avec ses personnages et ses dialogues.') + '</li><li><b>' + T('Partie rapide') + '</b> : ' + T('une affaire au hasard, avec le décor (manoir, train, hôtel), le mode et la difficulté de ton choix.') + '</li></ul>';
    dlg.querySelector('.howto-x').setAttribute('aria-label', T('Fermer'));
  }
  op.addEventListener('click', function (e) { e.preventDefault(); build(); dlg.showModal(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.hasAttribute('data-close')) dlg.close(); });
  if (location.hash === '#how') { build(); dlg.showModal(); }
})();
