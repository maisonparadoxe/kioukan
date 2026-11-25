"""Contrôle de la campagne 1 dans la vraie page : solution unique, conforme, aucun lieu donné à l'heure du crime.
Usage : python3 tools/check_c1.py   (après python3 tools/build.py)"""
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = r"""(n)=>{const H=KioukanHistoire,E=KioukanEngine; for(let i=1;i<n;i++)H.prog.solved[i]=1; H.load(n);
 const z=KioukanPuzzles[n].puz, sol=z.solution, T=z.T;
 const r=z.mode==='classic'?E.solve(z,2,400000):E.solveLiar(z,2,400000), s0=r.sols[0], g=s0&&(s0.grid||s0);
 return {count:r.count, aborted:r.aborted, match:!!g&&g.join()===sol.join(), leak:z.clues.filter(c=>c.type==='at'&&c.t===z.crime.t).length};}"""
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(locale='fr-FR')
    pg.goto('file://' + os.path.join(ROOT, 'histoire.html')); pg.wait_for_timeout(600)
    n = pg.evaluate('Object.keys(KioukanPuzzles).length')
    for i in range(1, n + 1):
        r = pg.evaluate(JS, i)
        ok = r['count'] == 1 and r['match'] and not r['aborted'] and r['leak'] == 0
        if not ok: bad += 1; print('PROBLÈME épisode', i, r)
    b.close()
print('%d épisodes contrôlés, %d problème(s)' % (n, bad)); sys.exit(1 if bad else 0)
