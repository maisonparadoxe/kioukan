// Assemble les indices rédigés de la campagne 2 (campagne2/flavor_src/*.js) et vérifie leur couverture :
// chaque constat affiché (tout sauf les cases « at » données d'avance) doit être couvert une fois et une seule.
// Écrit campagne2/flavor2.js (français) et campagne2/flavor2_en.js (traductions).
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'campagne2/flavor_src');
const PUZ = JSON.parse(fs.readFileSync(path.join(ROOT, 'campagne2/puzzles2.json'), 'utf8'));
const PL = require('../campagne2/places2.js'), PLAN = require('../campagne2/plan.js');
const NAMES_EN = { 'Aria Vibrato': 'Aria', 'André Vivalto': 'Vivalto', 'Enzo Lyrico': 'Enzo', 'Maestro Vivaldo Baguette': 'Baguette', 'Pia Doppio': 'Pia', 'Paola Doppio': 'Paola', 'Marquis Hugues de Montfaucon': 'marquis', 'Rémi Sansou': 'Remy', 'Ernest Couchette': 'Ernest', 'Jean Bilet': 'Punch', 'Pr Hector Tumulus': 'Barrow', 'Paul Ochon': 'Pillow', 'Lise Défait': 'Sheila', 'Max Valise': 'Lou', 'Jacques Teil': 'Collins', 'Ginette Pépite': 'Goldie', 'Maître Gérard Menvussa': 'Nott', 'Lucie Fer': 'Lucy', 'Hippolyte Plateau': 'Ivor', 'Julie Enne': 'Julie', 'Basile Bouture': 'Bud', 'Dr Mehdi Cament': 'Cation', 'Marcel Hélice': 'Rusty', 'Paul Ka': 'Kerr', 'Cécile Ence': 'Cecily', 'Agathe Crispie': 'Agatha', 'Capitaine Jean Tempête': 'Gale', 'Paulette Paillette': 'Sally', 'Sam Souffle': 'Sam', 'Gérard Rideau': 'Kurt', 'René Vaplu': 'Noah', 'Bernadette Banco': 'Betty', 'Jacques Potte': 'Potts', 'Inspecteur Armand Songe': 'Fibbs', 'Juge Odile Hibéré': 'Berate', 'Gédéon Barreau': 'Gideon', 'Maître Adjugé Vandu': 'Down', 'Ana Gramme': 'Anna', 'Frère Bernard Lhermite': 'Bernard', 'Frank Suisse': 'Swiss', 'Gaspard Pièce': 'Gus', 'Cyrielle Bougie': 'Candice', 'Monsieur Moustache': 'Whiskers', 'Barnabé': 'Barnaby', 'Comtesse Diane de Carat': 'Countess' };
const ROLE = { 'Marquis Hugues de Montfaucon': ['marquis'], 'Dr Mehdi Cament': ['docteur', 'doctor'], 'Juge Odile Hibéré': ['juge', 'judge'], 'Inspecteur Armand Songe': ['inspecteur', 'inspector'], 'Monsieur Moustache': ['chat', 'cat'], 'Frère Bernard Lhermite': ['Frère Bernard', 'Brother Bernard', 'moine', 'monk'], 'Capitaine Jean Tempête': ['capitaine', 'Captain', 'captain'], 'Pr Hector Tumulus': ['professeur', 'Professor', 'professor'], 'Maestro Vivaldo Baguette': ['maestro'], 'Comtesse Diane de Carat': ['Comtesse', 'Countess'], 'Pia Doppio': ['jumelles', 'twins'], 'Paola Doppio': ['jumelles', 'twins'], 'Maître Adjugé Vandu': ['Vandu', 'Down'] };
function frKey(name) { const c = PL.CAST[name]; return c ? c.short : name.split(' ').pop(); }
let warn = 0;
function lint(n, P, ids, fr, eng) {
  const ep = PLAN.episodes.find(e => e.n === +n), ch = PLAN.chapters.find(c => c.n === ep.ch), t0 = PL.PLACES[ch.place].t0;
  const names = ep.suspects.concat(ep.victim ? [ep.victim.name] : []);
  const hFr = t => { const m = t0 * 60 + t * 30, h = Math.floor(m / 60) % 24; return h + ' h' + (m % 60 ? ' 30' : ''); };
  const hEn = t => { const m = t0 * 60 + t * 30, h = Math.floor(m / 60) % 24; return ((h + 11) % 12 + 1) + (m % 60 ? ':30' : '') + (h >= 12 ? ' pm' : ' am'); };
  const msgs = [];
  ids.forEach(i => {
    const c = P.clues[i];
    if (c.t != null) { const okH = (txt, h, alt) => txt.includes(h) || (alt && txt.includes(alt)); if (!okH(fr, hFr(c.t), hFr(c.t) === '0 h' ? 'minuit' : null)) msgs.push('heure FR ' + hFr(c.t)); if (!okH(eng, hEn(c.t), hEn(c.t) === '12 am' ? 'midnight' : null)) msgs.push('heure EN ' + hEn(c.t)); if (c.type === 'stay' || c.type === 'move') { if (!fr.includes(hFr(c.t + 1)) && !(hFr(c.t + 1) === '0 h' && fr.includes('minuit'))) msgs.push('heure FR ' + hFr(c.t + 1)); } }
    [c.s, c.a, c.b].filter(x => x != null).forEach(x => {
      const nm = names[x]; if (!nm) return;
      const k = frKey(nm), first = nm.split(' ')[nm.startsWith('Maître') || nm.startsWith('Inspecteur') || nm.startsWith('Juge') || nm.startsWith('Dr') || nm.startsWith('Pr') || nm.startsWith('Capitaine') || nm.startsWith('Frère') || nm.startsWith('Marquis') ? 1 : 0];
      const okFr = [k, first, nm].concat(ROLE[nm] || []).some(v => fr.includes(v)) || /\bmoi\b|\bje\b|J’|j’|\bnous\b/i.test(fr);
      const okEn = [NAMES_EN[nm], (NAMES_EN[nm] || '').split(' ')[0], k].concat(ROLE[nm] || []).filter(Boolean).some(v => eng.includes(v)) || /\bI\b|\bme\b|\bwe\b/i.test(eng);
      if (!okFr) msgs.push('nom FR ' + nm); if (!okEn) msgs.push('nom EN ' + nm);
    });
  });
  if (msgs.length) { warn++; console.log('  ? ' + n + ' ' + JSON.stringify(ids) + ' : ' + msgs.join(', ') + ' | ' + fr.slice(0, 70)); }
}
const out = {}, en = {}; let pb = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()) {
  const part = require(path.join(DIR, f));
  for (const n of Object.keys(part)) {
    const P = PUZ[n]; if (!P) { console.log(n, ': énigme absente'); pb++; continue; }
    const need = P.clues.map((c, i) => i).filter(i => !(P.clues[i].type === 'at' && P.clues[i].by === undefined));
    const seen = {};
    part[n].forEach(([ids, fr, eng]) => {
      ids.forEach(i => { if (seen[i]) { console.log(n, ': indice', i, 'couvert deux fois'); pb++; } seen[i] = 1; if (need.indexOf(i) < 0) { console.log(n, ': indice', i, 'inexistant ou donné d’avance'); pb++; } });
      if (P.liars && ids.length > 1) { console.log(n, ': en mode menteur, une phrase par déclaration'); pb++; }
      if (!fr || !eng) { console.log(n, ': texte manquant'); pb++; }
      en[fr] = eng;
      lint(n, P, ids, fr, eng);
    });
    need.forEach(i => { if (!seen[i]) { console.log(n, ': indice', i, 'non couvert'); pb++; } });
    out[n] = part[n].map(([ids, fr]) => ({ ids, text: fr }));
  }
}
fs.writeFileSync(path.join(ROOT, 'campagne2/flavor2.js'), '/* Campagne 2 : indices rédigés (généré par tools/build_flavor2.js depuis campagne2/flavor_src). */\nwindow.KioukanFlavor2 = ' + JSON.stringify(out) + ';\n');
fs.writeFileSync(path.join(ROOT, 'campagne2/flavor2_en.js'), '/* Campagne 2 : traductions des indices rédigés (généré). */\nObject.assign(window.KIOUKAN_EN || (window.KIOUKAN_EN = {}), ' + JSON.stringify(en) + ');\n');
// Italien : campagne2/flavor2_it.js est tenu à la main ; chaque indice rédigé doit y avoir sa traduction.
let itMiss = 0;
try {
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'campagne2/flavor2_it.js'), 'utf8'))(w);
  for (const n of Object.keys(out)) out[n].forEach(g => { if (!(w.KIOUKAN_IT || {})[g.text]) { itMiss++; if (itMiss <= 5) console.log('  IT manquant ' + n + ' : ' + g.text.slice(0, 70)); } });
} catch (e) { console.log('flavor2_it.js illisible : ' + e.message); itMiss++; }
if (itMiss) { console.log(itMiss + ' indice(s) sans traduction italienne'); pb++; }
console.log(Object.keys(out).length + ' épisodes rédigés, ' + pb + ' problème(s), ' + warn + ' avertissement(s) à relire');
process.exit(pb ? 1 : 0);
