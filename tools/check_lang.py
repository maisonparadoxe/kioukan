"""Cherche les restes d'une autre langue dans les pages affichées en italien (ou en anglais).
Parcourt l'accueil, le tutoriel, tous les épisodes des deux campagnes (texte, règles, verdict) et des parties rapides.
Usage : python3 tools/check_lang.py [it|en]   (après python3 tools/build.py)"""
import os, re, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang = sys.argv[1] if len(sys.argv) > 1 else 'it'
FR = re.compile(r"\b(était|étaient|dans|avec|les|des|aux|pièce|voiture|n’a|n'a|c’est|j’ai|vous|nous|elle|ils|sont|personne n|seul|seule|heure|soirée)\b|[çœêûî]|\sà\s|\d+ h( 30)?\b")
EN = re.compile(r"\b(the|was|were|with|and|of|is|nobody|alone|room)\b", re.I)
IT = re.compile(r"\b(era|erano|nella|nel|alle|stanza|carrozza|sala|non|insieme|anche)\b")
# Noms propres et expressions gardés volontairement
KEEP = ['Hôtel Drouot', 'Château-Margaux', 'Rien ne va plus', 'Les jeux sont faits', 'Sûreté', 'Fragonarde', 'Français', 'English', 'Italiano',
        'Ca’ Doppio', 'Bel Azur', 'buvette', 'Sologne', 'Chef Al Dente', 'Al Dente', 'Vivalto', 'Lombard', 'Fenice', 'Wagons-Lits']
# Noms français qui changent en italien
FRN = re.compile(r"\b(Hortense|Lafleur|Rémi|Ernest|Bilet|Tumulus|Ochon|Lise|Valise|Teil|Ginette|Pépite|Menvussa|Lucie|Hippolyte|Julie|Basile|Cament|Tempête|Marcel|Paul Ka|Cécile|Agathe|Baguette|Paulette|Sam|Rideau|René|Bernadette|Potte|Songe|Hibéré|Barreau|Vandu|Ana|Montfaucon|Frère|Suisse|Gaspard|Cyrielle|Moustache|Barnabé|Carat|Hibou|Larmes)\b")
pat = {'it': [FR, EN, FRN], 'en': [FR, IT]}[lang]

def bad_lines(txt):
    out = []
    for line in txt.split('\n'):
        l = line
        for k in KEEP: l = l.replace(k, '')
        if any(p.search(l) for p in pat): out.append(line.strip()[:160])
    return out

TEXT = """()=>{document.querySelectorAll('details').forEach(d=>d.open=true); return document.body.innerText;}"""
found = {}
def note(where, txt):
    for l in bad_lines(txt): found.setdefault(l, where)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(locale={'it': 'it-IT'}.get(lang, 'en-GB'))
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    def go(page, hash=''):
        pg.goto('file://' + os.path.join(ROOT, page) + hash); pg.wait_for_timeout(250)
        pg.evaluate("localStorage.setItem('kioukan.lang','%s')" % lang); pg.reload(); pg.wait_for_timeout(350)
    go('index.html'); note('index', pg.evaluate(TEXT))
    go('tutoriel.html'); note('tutoriel', pg.evaluate(TEXT))
    for k in range(18):
        pg.evaluate("()=>{const b=[...document.querySelectorAll('#tuto button')].find(x=>/Avanti|Next|Suivant/.test(x.textContent)); if(b&&!b.disabled)b.click(); else {const s=document.querySelector('#tuto [data-tt=\"show\"]'); if(s)s.click();}}")
        pg.wait_for_timeout(60); note('tutoriel', pg.evaluate("()=>document.getElementById('tuto').innerText"))
    for page, puz in (('histoire.html', 'KioukanPuzzles'), ('campagne2.html#test', 'KioukanPuzzles2')):
        go(page.split('#')[0], '#test' if '#' in page else '')
        eps = pg.evaluate('Object.keys(%s).map(Number)' % puz)
        for n in eps:
            txt = pg.evaluate("""(n)=>{const H=KioukanHistoire; if(H.unlockAll)H.unlockAll(); else for(let i=1;i<n;i++)H.prog.solved[i]=1; H.load(n);
              const st=H.state,P=st.puz; let t=document.body.innerText;
              for(let i=0;i<P.S*P.T;i++) if(!st.given[i]) st.grid[i]=P.solution[i];
              st.accuse=true; H.renderAll ? H.renderAll() : 0; t+='\\n'+document.body.innerText;
              const b=document.querySelector('.acc-btn[data-s="'+P.culprit+'"]'); if(b) b.click();
              document.querySelectorAll('details').forEach(d=>d.open=true);
              return t+'\\n'+document.body.innerText;}""", n)
            note('%s %d' % (page, n), txt)
    go('partie.html')
    for scene in ('manoir', 'train', 'hotel'):
        for mode in ('classic', 'liar', 'half'):
            pg.evaluate("""([s,m])=>{const a=document.querySelector('[data-scene="'+s+'"]'); if(a)a.click(); const b=document.querySelector('[data-mode="'+m+'"]'); if(b)b.click(); const c=document.querySelector('[data-act="new"]')||document.getElementById('new'); if(c)c.click();}""", [scene, mode])
            pg.wait_for_timeout(900); note('partie %s %s' % (scene, mode), pg.evaluate(TEXT))
    b.close()
for l, w in sorted(found.items(), key=lambda x: x[1]): print('[%s] %s' % (w, l))
for e in errs[:5]: print('ERREUR JS', e)
print('%d ligne(s) suspecte(s), %d erreur(s) JS' % (len(found), len(errs)))
