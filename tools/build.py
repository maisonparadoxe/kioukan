"""Construit les pages publiées à partir de src/ : remplace chaque <!--@inc chemin--> par le fichier.
Usage : python3 tools/build.py [--check]   (--check : vérifie que les pages publiées sont à jour)"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def build(page):
    t = open(os.path.join(ROOT, 'src/pages', page), encoding='utf-8').read()
    return re.sub(r'<!--@inc ([^>]+?)-->', lambda m: open(os.path.join(ROOT, m.group(1)), encoding='utf-8').read(), t)
# campagne 2 : énigmes générées (JSON) -> script
_j = os.path.join(ROOT, 'campagne2/puzzles2.json')
if os.path.exists(_j):
    _js = 'window.KioukanPuzzles2 = ' + open(_j, encoding='utf-8').read() + ';\n'
    _out = os.path.join(ROOT, 'campagne2/puzzles2.js')
    if not os.path.exists(_out) or open(_out, encoding='utf-8').read() != _js: open(_out, 'w', encoding='utf-8').write(_js)
bad = 0
for page in sorted(os.listdir(os.path.join(ROOT, 'src/pages'))):
    html = build(page); dst = os.path.join(ROOT, page)
    cur = open(dst, encoding='utf-8').read() if os.path.exists(dst) else ''
    if '--check' in sys.argv:
        if cur != html: print('PAS À JOUR :', page); bad += 1
    elif cur != html:
        open(dst, 'w', encoding='utf-8').write(html); print('construit :', page)
sys.exit(1 if bad else 0)
