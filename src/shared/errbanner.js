
window.addEventListener('error', function (e) {
  var d = document.getElementById('err-banner');
  if (!d) { d = document.createElement('pre'); d.id = 'err-banner'; d.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99;margin:0;padding:10px 12px;background:#fff;color:#b00020;font:12px/1.4 monospace;white-space:pre-wrap;border-bottom:3px solid #b00020'; document.body.appendChild(d); }
  d.textContent += 'Erreur : ' + e.message + (e.lineno ? ' (ligne ' + e.lineno + ')' : '') + '\n';
});
