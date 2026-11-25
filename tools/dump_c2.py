"""Exporte les indices de la campagne 2 (texte automatique FR et EN, type, témoin) pour la rédaction.
Usage : python3 tools/dump_c2.py 43-51 > fichier.txt"""
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
a, b = (sys.argv[1].split('-') + [None])[:2]; a = int(a); b = int(b or a)
JS = r"""(n)=>{const H=KioukanHistoire;H.unlockAll();H.load(n);const P=H.state.puz,X=H.X();
 const S=E=>window.KioukanEngine;const E1=window.KioukanEngine;
 const names=E1.SUSPECTS.map(s=>s.name), rooms=E1.ROOMS.map(r=>r.name);
 const out=[]; const lis=[...document.querySelectorAll('#clues-panel li.clue')].map(li=>li.innerText.trim());
 return {n, mode:P.mode, names, rooms, times:[...Array(P.T).keys()].map(t=>E1.timeLabel(t)), crime:P.crime, crimeT:X.crimeT, culprit:names[P.culprit], liars:X.liarSet, lis,
   clues:P.clues.map((c,i)=>({i,c}))};}"""
with sync_playwright() as p:
    br = p.chromium.launch()
    res = {}
    for lang in ['fr', 'en']:
        pg = br.new_page()
        pg.goto('file://' + os.path.join(ROOT, 'campagne2.html') + '#test'); pg.wait_for_timeout(200)
        pg.evaluate(f"localStorage.setItem('kioukan.lang','{lang}')"); pg.reload(); pg.wait_for_timeout(300)
        for n in range(a, b + 1):
            try: res.setdefault(n, {})[lang] = pg.evaluate(JS, n)
            except Exception as e: res.setdefault(n, {})[lang] = None
        pg.close()
    br.close()
for n in range(a, b + 1):
    fr, en = res[n]['fr'], res[n]['en']
    if not fr: print('##', n, 'absent'); continue
    print('## %d · %s · coupable %s · lieu %s · heure %s%s' % (n, fr['mode'], fr['culprit'], fr['rooms'][fr['crime']['room']], fr['times'][fr['crimeT']], (' · menteurs ' + ','.join(fr['names'][x] for x in fr['liars'])) if fr['liars'] else ''))
    print('   suspects :', ', '.join(fr['names']), '| heures :', ' '.join(fr['times']))
    # textes affichés (règle puis indices non « at » dans l'ordre)
    print('   affichés :')
    for t in fr['lis']: print('     -', t.replace('\n', ' '))
    print('   indices :')
    for x in fr['clues']:
        c = x['c']; print('     %2d %s%s %s' % (x['i'], c['type'], (' par ' + fr['names'][c['by']]) if 'by' in c else '', json.dumps({k: v for k, v in c.items() if k not in ('type', 'by')})))
