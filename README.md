# Kioukan

Jeu de déduction : *Qui ? Où ? Quand ?* — https://maisonparadoxe.github.io/kioukan/

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
