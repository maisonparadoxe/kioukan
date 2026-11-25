"""Découpe unique : sort chaque bloc <script>/<style> inline des pages construites vers src/.
Les blocs identiques entre pages vont dans src/shared/. Les pages deviennent des gabarits
dans src/pages/ avec des marqueurs <!--@inc chemin-->. À lancer une seule fois."""
import re, hashlib, os, sys, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'histoire.html', 'partie.html', 'tutoriel.html']
pat = re.compile(r'(<(script|style)\b[^>]*>)(.*?)(</\2>)', re.S)

def name_for(body, kind, page, i):
    b = body.lstrip()
    m = re.match(r'/\*\s*(.{0,80})', b)
    rules = [('Langue :', 'i18n'), ('Effets sonores', 'sfx'), ('KIOUKAN_DEMO_CH', 'demo'),
             ('Mode histoire : les six lieux', 'story-places'), ('Illustrations : portraits plats', 'art-flat'),
             ('Illustrations « ligne claire »', 'art-lc'), ('Illustrations « webtoon »', 'art-webtoon'),
             ('Mode histoire : trame', 'story'), ('Indices rédigés', 'flavor'), ('window.KioukanPuzzles', 'puzzles'),
             ('root.KioukanEngine', 'engine'), ('Habillage éditorial', 'skin'), ('window.KIOUKAN_EN = window.KIOUKAN_EN || {};', 'en-base'),
             ('"42 épisodes"', 'en-extra'), ('"« À 19 h', 'en-fix'), ("window.addEventListener('error'", 'errbanner')]
    for key, n in rules:
        if key in body[:3000]: return n
    return '%s-%s%d' % (page.replace('.html', ''), kind, i)

blocks = {}  # page -> list of (start,end,open,body,close,name)
counts = {}
for p in PAGES:
    s = open(os.path.join(ROOT, p), encoding='utf-8').read()
    L = []
    for i, m in enumerate(pat.finditer(s)):
        if 'src=' in m.group(1) or len(m.group(3)) < 400: continue  # petits blocs : restent dans le gabarit
        h = hashlib.sha1(m.group(3).encode()).hexdigest()
        L.append((m.start(3), m.end(3), m.group(3), m.group(2), h, i))
        counts[h] = counts.get(h, 0) + 1
    blocks[p] = (s, L)

out = {}
for p, (s, L) in blocks.items():
    pieces, last, used = [], 0, set()
    for (a, b, body, kind, h, i) in L:
        base = name_for(body, kind, p, i)
        ext = 'css' if kind == 'style' else ('json.js' if base == 'puzzles' else 'js')
        if counts[h] > 1: path = 'src/shared/%s.%s' % (base, ext)
        else: path = 'src/%s/%s.%s' % (p.replace('.html', ''), base, ext)
        k = 2
        while path in out and out[path] != body:
            path = re.sub(r'(\.\w+(\.js)?)$', r'-%d\1' % k, path.split('-%d' % (k - 1))[0] if k > 2 else path); k += 1
        out[path] = body
        pieces.append(s[last:a]); pieces.append('<!--@inc %s-->' % path); last = b
    pieces.append(s[last:])
    out['src/pages/' + p] = ''.join(pieces)
for path, body in out.items():
    fp = os.path.join(ROOT, path); os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, 'w', encoding='utf-8').write(body)
print('\n'.join('%8d  %s' % (len(v), k) for k, v in sorted(out.items())))
