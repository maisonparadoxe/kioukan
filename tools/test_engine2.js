// Test du moteur de la campagne 2 : une énigme par mécanique, unicité et règle d'or. Usage : node tools/test_engine2.js
const E=require('../campagne2/engine2.js');
const place={rooms:['Hall','Salon','Bureau','Bibliothèque','Cuisine','Cave'].map(n=>({name:n})),doors:[[0,1],[0,2],[1,3],[2,3],[0,4],[4,5]],t0:40};
const cases={
 theft:{S:4,T:6},
 murder:{S:4,T:6,victim:{name:'V',kind:'mort'}},
 secret:{S:4,T:6,victim:{name:'V'},place:{...place,secret:[{a:3,b:5,who:[1]}]}},
 knocked:{S:4,T:6,victim:{name:'V',kind:'assomme'}},
 weapon:{S:4,T:6,victim:{name:'V'},weapon:{room:5,after:0}},
 dark:{S:4,T:6,victim:{name:'V'},dark:3},
 keys:{S:4,T:6,place:{...place,locked:[[4,5],[1,3]],key:{start:2}}},
 moment:{S:4,T:6,crime:{times:[2,3,4]}},
 twins:{S:5,T:6,twins:[3,4],require:[{type:'oneOf'}]},
 liar1:{S:4,T:6,liars:1},
 liar2:{S:5,T:6,liars:2},
};
for(const [k,c] of Object.entries(cases)){
  const t0=Date.now();
  const spec={place,seed:7,tries:60,...c};
  const r=E.generate(spec);
  if(!r){console.log(k,'ÉCHEC',Date.now()-t0,'ms',JSON.stringify(E.stats()));continue}
  const p=r.puz, v=E.solve(p,2,2e6);
  const types={};p.clues.forEach(c=>types[c.type]=(types[c.type]||0)+1);
  console.log(k.padEnd(8),'uniq',v.count,'clues',p.clues.length,'diff',p.difficulty,'cul',p.culprit,'t',p.crimeT,'leak',p.clues.filter(c=>E.leaks(p,c)).length,(Date.now()-t0)+'ms',JSON.stringify(types));
}
