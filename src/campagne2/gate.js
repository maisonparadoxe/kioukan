/* Campagne 2 : accessible une fois la campagne 1 terminée (ou en mode test : campagne2.html#test). */
(function () {
  var ok = false;
  try {
    if (/#test/.test(location.hash)) { localStorage.setItem('kioukan.c2.test', '1'); history.replaceState(null, '', location.pathname); }
    var p = JSON.parse(localStorage.getItem('kioukan.histoire') || '{}');
    ok = Object.keys(p.solved || {}).length >= 42 || localStorage.getItem('kioukan.c2.test') === '1';
  } catch (e) { ok = false; }
  window.KIOUKAN_C2_OPEN = ok;
  if (ok) return;
  var T = window.T || String;
  document.getElementById('app').innerHTML = '<div class="panel c2-gate"><h2>' + T('La Dernière Vente') + '</h2><p>' + T('La campagne 2 s’ouvre une fois les 42 épisodes de la campagne 1 terminés.') + '</p><p><a class="btn primary" href="histoire.html">' + T('Reprendre la campagne 1') + '</a></p></div>';
  window.KioukanPuzzles2 = null;
})();
