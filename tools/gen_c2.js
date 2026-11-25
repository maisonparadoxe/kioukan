// Générateur de la campagne 2 : une énigme par épisode du plan, vérifiée.
// Usage : node tools/gen_c2.js [n1 n2 …]   (sans argument : tous les épisodes manquants ; --all : tout regénérer)
// Écrit campagne2/puzzles2.json. Contrôles : solution unique, bon coupable, règle d'or, casting.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const E = require('../campagne2/engine2.js');
const PL = require('../campagne2/places2.js');
const PLAN = require('../campagne2/plan.js');
const OUT = path.join(ROOT, 'campagne2/puzzles2.json');

function specOf(ep, seed) {
  const place = PL.PLACES[PLAN.chapters.find(c => c.n === ep.ch).place];
  const idx = n => { const i = ep.suspects.indexOf(n); if (i < 0) throw new Error(ep.n + ' : ' + n + ' absent'); return i; };
  const pl = { rooms: place.rooms, doors: place.doors, t0: place.t0 };
  if (ep.secret) pl.secret = ep.secret.map(s => ({ a: s.a, b: s.b, who: s.who.map(idx) }));
  if (ep.keys) { pl.locked = ep.keys.locked; pl.key = { start: idx(ep.keys.start) }; }
  const spec = { place: pl, S: ep.suspects.length, T: ep.T, seed, tries: 120, culprit: idx(ep.culprit), target: ep.target, tol: 4, maxClues: 30 };
  if (ep.victim) spec.victim = { name: ep.victim.name, kind: ep.victim.kind };
  if (ep.weapon) spec.weapon = { room: ep.weapon.room, after: ep.weapon.after };
  if (ep.dark != null) spec.dark = ep.dark;
  if (ep.moment) spec.crime = { room: ep.moment.room, times: ep.moment.times };
  else if (ep.crime) spec.crime = { room: ep.crime.room };
  if (ep.dark != null) spec.crime = Object.assign({}, spec.crime || {}, { t: ep.dark });
  if (ep.twins) { spec.twins = ep.twins.map(idx); spec.require = [{ type: 'oneOf' }]; }
  if (ep.liars) { spec.liars = ep.liars; spec.testimonies = 3; if (ep.accomplice) spec.accomplice = idx(ep.accomplice); }
  return spec;
}

function check(ep, puz) {
  const pb = [];
  const r = E.solve(puz, 2, 4e6);
  if (r.count !== 1 || r.aborted) pb.push('solutions : ' + r.count + (r.aborted ? ' (abandon)' : ''));
  else {
    const s = r.sols[0];
    if (s.culprit !== ep.suspects.indexOf(ep.culprit)) pb.push('mauvais coupable');
    if (puz.dark == null && s.P.some((p, e) => p.join() !== puz.solution[e].join())) pb.push('solution différente');
  }
  puz.clues.forEach((c, i) => { if (E.leaks(puz, c)) pb.push('règle d’or : indice ' + i); if (E.touchesDark(puz, c)) pb.push('panne : indice ' + i); });
  if (ep.crime && ep.crime.room != null && puz.crime.room !== ep.crime.room) pb.push('mauvaise pièce');
  if (ep.twins && !puz.clues.some(c => c.type === 'oneOf' || c.type === 'neither')) pb.push('pas d’indice « l’une des jumelles »');
  // les déclarations des menteurs sont bien fausses, les autres vraies
  const P = puz.solution;
  puz.clues.forEach((c, i) => {
    const liar = c.by != null && (puz.liarSet || []).indexOf(c.by) >= 0;
    const ok = E.holds(puz, c, P);
    if (puz.dark != null && c.t === puz.dark) return;
    if (liar === ok) pb.push('indice ' + i + (liar ? ' : un menteur dit vrai' : ' : faux'));
  });
  return pb;
}

// Casting : les morts et les meurtriers arrêtés ne reviennent jamais.
function castCheck() {
  const gone = {}, pb = [];
  PLAN.episodes.forEach(ep => {
    const people = ep.suspects.concat(ep.victim ? [ep.victim.name] : []);
    people.forEach(n => { if (gone[n]) pb.push(ep.n + ' : ' + n + ' (' + gone[n] + ')'); });
    if (ep.culprit === PLAN.SONGE && ep.n !== 100) pb.push(ep.n + ' : Songe coupable trop tôt');
    if (ep.culprit === 'Ernest Couchette') pb.push(ep.n + ' : Ernest ne doit jamais être coupable');
    if (ep.victim && ep.victim.kind === 'mort') gone[ep.victim.name] = 'mort au ' + ep.n;
    if (ep.deadName) gone[ep.deadName] = 'mort au ' + ep.n;
    if (ep.arrested) gone[ep.culprit] = 'arrêté au ' + ep.n;
  });
  return pb;
}

function main() {
  const cpb = castCheck();
  if (cpb.length) { console.log('CASTING :\n  ' + cpb.join('\n  ')); process.exit(1); }
  const all = process.argv.includes('--all');
  const want = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
  const out = fs.existsSync(OUT) && !all ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  for (const ep of PLAN.episodes) {
    if (want.length ? !want.includes(ep.n) : out[ep.n]) continue;
    const t0 = Date.now();
    let best = null;
    for (let seed = ep.n * 1000 + 1; seed < ep.n * 1000 + 40 && !best && Date.now() - t0 < 600000; seed++) {
      const res = E.generate(specOf(ep, seed));
      if (!res) continue;
      const pb = check(ep, res.puz);
      if (pb.length) { console.log('  ' + ep.n + ' seed ' + seed + ' rejeté : ' + pb.join(', ')); continue; }
      best = { seed, puz: res.puz };
    }
    if (!best) { console.log(ep.n + ' : ÉCHEC'); continue; }
    const p = best.puz;
    const keep = { S: p.S, T: p.T, t0: p.t0, crime: p.crime, culprit: p.culprit, crimeT: p.crimeT, clues: p.clues, solution: p.solution, difficulty: p.difficulty, seed: best.seed };
    ['victim', 'weapon', 'dark', 'liars', 'liarSet', 'twins', 'secret', 'locked', 'key'].forEach(k => { if (p[k] != null && !(Array.isArray(p[k]) && !p[k].length)) keep[k] = p[k]; });
    out[ep.n] = keep;
    const types = {}; p.clues.forEach(c => types[c.type] = (types[c.type] || 0) + 1);
    console.log(ep.n + ' ok · ' + p.clues.length + ' indices · difficulté ' + p.difficulty + ' (cible ' + ep.target + ') · ' + (Date.now() - t0) + ' ms · ' + JSON.stringify(types));
    fs.writeFileSync(OUT, JSON.stringify(out));
  }
  console.log(Object.keys(out).length + ' / ' + PLAN.episodes.length + ' épisodes générés');
}
main();
