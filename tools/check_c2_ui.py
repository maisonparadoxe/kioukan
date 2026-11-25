"""Campagne 2 dans la vraie page : chaque épisode se charge sans erreur, ses textes s'affichent,
la bonne grille (+ menteurs / accusation) donne la victoire, et aucune contradiction n'apparaît sur la solution.
Usage : python3 tools/check_c2_ui.py [fr|en]"""
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang = sys.argv[1] if len(sys.argv) > 1 else 'fr'
JS = r"""(n)=>{const H=KioukanHistoire; H.unlockAll(); H.load(n); const st=H.state, P=st.puz, X=H.X();
  const errs=[]; const txt=document.getElementById('clues-panel').innerText+document.getElementById('intro').innerText+document.getElementById('case').innerText;
  if(/undefined|NaN|\{h\}|\{lieu\}|\{heures\}/.test(txt)) errs.push('texte : '+txt.match(/.{0,40}(undefined|NaN|\{h\}|\{lieu\}|\{heures\}).{0,20}/)[0]);
  // remplir la solution
  for(let s=0;s<P.S;s++)for(let t=0;t<P.T;t++){const i=s*P.T+t; if(!st.given[i]) st.grid[i]=P.solution[i];}
  if(X.liarSet) st.liarGuess=X.liarSet.slice();
  H.renderAll();
  const cont=document.querySelector('#board-panel .status').innerText;
  const nbad=document.querySelectorAll('#clues-panel .clue.bad').length, nok=document.querySelectorAll('#clues-panel .clue.ok').length, nall=document.querySelectorAll('#clues-panel .clue').length;
  // victoire : auto (grille) ou accusation
  st.accuse=true; H.renderAll(); const b=document.querySelector('.acc-btn[data-s="'+P.culprit+'"]'); if(b) b.click();
  return {n, errs, cont, nbad, nok, nall, solved:st.solved, rows:P.S, mode:P.mode};}"""
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(locale='fr-FR' if lang == 'fr' else 'en-GB')
    jserr = []; pg.on('pageerror', lambda e: jserr.append(str(e)))
    pg.goto('file://' + os.path.join(ROOT, 'campagne2.html') + '#test'); pg.wait_for_timeout(300)
    if lang == 'en': pg.evaluate("localStorage.setItem('kioukan.lang','en')"); pg.reload(); pg.wait_for_timeout(400)
    eps = pg.evaluate('Object.keys(KioukanPuzzles2).map(Number)')
    for n in eps:
        r = pg.evaluate(JS, n)
        ok = not r['errs'] and r['nbad'] == 0 and r['solved'] and ' 0 contradiction' in (' ' + r['cont'].replace('\n', ' ')) and not jserr
        if not ok: bad += 1; print('PROBLÈME', n, r, jserr[:2]); jserr.clear()
    b.close()
print('%d épisodes contrôlés (%s), %d problème(s)' % (len(eps), lang, bad)); sys.exit(1 if bad else 0)
