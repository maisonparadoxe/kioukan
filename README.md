# Kioukan

**Qui ? Où ? Quand ?** Résolvez les crimes en reconstituant les emplois du temps des suspects.

Jeu de déduction en ligne : chaque énigme a une solution unique. Placez chaque suspect dans une pièce, heure par heure, en respectant les portes et les indices. Le coupable est le seul à s'être trouvé sur les lieux du crime au moment des faits.

- `index.html` : menu principal
- `histoire.html` : mode histoire « Le Hibou » (6 chapitres, 42 épisodes)
- `partie.html` : partie rapide (énigmes générées, trois modes, trois niveaux)
- `tutoriel.html` : tutoriel guidé
- `img/images.js` : illustrations (portraits et décors)

Jouer : https://maisonparadoxe.github.io/kioukan/

## Organisation

Les pages publiées (`index.html`, `histoire.html`, `partie.html`, `tutoriel.html`) sont **générées**.
On ne les modifie plus à la main : on modifie `src/`, puis on reconstruit.

- `src/pages/` : gabarits des pages, avec des marqueurs `<!--@inc chemin-->`
- `src/shared/` : code commun (moteur `engine.js`, langue, sons, illustrations, application du mode histoire…)
- `src/histoire/` : campagne 1 (trame `story.js`, indices rédigés `flavor.js`, énigmes `puzzles.js`)
- `src/partie/`, `src/tutoriel/`, `src/index/` : code propre à chaque page
- `campagne2/` : moteur, lieux, générateur et épisodes de la campagne 2
- `tools/` : build et vérifications

## Commandes

```
python3 tools/build.py          # reconstruit les pages depuis src/
python3 tools/build.py --check  # vérifie que les pages publiées sont à jour
python3 tools/check_c1.py       # campagne 1 : solution unique, aucun lieu donné à l'heure du crime
```
