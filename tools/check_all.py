"""Tour complet de l'application dans les trois langues :
- tutoriel : on le suit jusqu'au bout (bouton « Montre-moi » puis « Suivant ») ;
- parties rapides : génération et unicité de la solution pour chaque décor × mode × niveau.
Usage : python3 tools/check_all.py   (après python3 tools/build.py ; compléter avec check_c1.py, check_c2_ui.py fr|en|it et check_lang.py it|en)"""
import os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for lang in ('fr', 'en', 'it'):
        pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        def go(page):
            pg.goto('file://' + os.path.join(ROOT, page)); pg.wait_for_timeout(200)
            pg.evaluate("localStorage.clear(); localStorage.setItem('kioukan.lang','%s')" % lang); pg.reload(); pg.wait_for_timeout(500)
        go('tutoriel.html')
        for i in range(60):
            fin = pg.evaluate("""()=>{const t=document.getElementById('tuto'); if(!t) return 'absent';
              if(t.querySelector('[data-tt="again"]')) return 'fini';
              const s=t.querySelector('[data-tt="show"]'); if(s){s.click(); return 'show';}
              const n=t.querySelector('[data-tt="next"]'); if(n&&!n.disabled){n.click(); return 'next';} return 'bloqué';}""")
            pg.wait_for_timeout(80)
            if fin in ('fini', 'absent', 'bloqué'): break
        if fin != 'fini': bad += 1; print('TUTORIEL', lang, fin)
        go('partie.html')
        r = pg.evaluate("""()=>{const E=KioukanEngine, out=[]; let n=0;
          for (const sc of Object.keys(E.SCENES)) for (const mode of ['classic','liar','half']) for (const lv of ['facile','moyen','difficile']) for (let k=0;k<3;k++) {
            E.setScene(sc); const seed=1000+k*7919+sc.length*31; let P;
            try { P = E.generate(seed, lv, mode); } catch(e) { out.push(sc+' '+mode+' '+lv+' : '+e.message); continue; }
            if (!P) { out.push(sc+' '+mode+' '+lv+' : pas de génération'); continue; }
            const r = mode==='classic' ? E.solve(P,2,400000) : E.solveLiar(P,2,400000);
            n++; if (r.count!==1 || r.aborted) out.push(sc+' '+mode+' '+lv+' seed '+seed+' : '+r.count+' solution(s)');
          } return {n, out};}""")
        if r['out']: bad += len(r['out']); print('PARTIES', lang, r['out'][:8])
        print(lang, ': tutoriel', fin, '·', r['n'], 'parties rapides contrôlées', '· erreurs JS', len(errs))
        bad += len(errs); [print('  ', e) for e in errs[:3]]
        pg.close()
    b.close()
print('%d problème(s)' % bad); sys.exit(1 if bad else 0)
