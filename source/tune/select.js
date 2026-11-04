// node select.js out.json want pool.txt...  Picks boards that meet the bar set by the first 71, best first, and not too like any board already in.
const fs=require('fs'),path=require('path'),{ev,fit,CS,IN}=require('./ev.js');const [,,OUT,WANT,...P]=process.argv;
const old=require('../boards.json').slice(0,71).map(x=>x.b);
const FN=7;const info=b=>{const e=ev(b.map(r=>r.split('')));return {b,e,f:fit(e),set:new Set(e.comL.filter(w=>w.length>=4)),sev:e.comL.filter(w=>w.length===7)}};
const jac=(a,b)=>{let n=0;for(const x of a.set)if(b.set.has(x))n++;return n/(a.set.size+b.set.size-n)};
const O=old.map(info);let mx=0,sum=0,c=0,mxN=[];for(let i=0;i<O.length;i++){let m=0;for(let j=0;j<i;j++){const v=jac(O[i],O[j]);m=Math.max(m,v);sum+=v;c++}if(i)mxN.push(m);mx=Math.max(mx,m)}
mxN.sort((a,b)=>a-b);console.log('old pairs: max like',mx.toFixed(3),'avg',(sum/c).toFixed(3),'p90 of nearest',mxN[mxN.length*.9|0].toFixed(3));
const LIM=+(process.env.LIM||mx);
const seen=new Set(old.map(b=>b.join('')));
let pool=[];let bad=0;for(const f of P)for(const l of fs.readFileSync(f,'utf8').trim().split('\n')){const m=l.split(' '),b=m.slice(-7),F=+m[0];if(b.length<7||b.some(x=>x.length!==5))continue;if(seen.has(b.join('')))continue;seen.add(b.join(''));const i=info(b);if(Math.abs(i.f-(F+(i.e.deep.length?0:80)))>0.01&&i.e.deep.length)bad++;pool.push(i)}
console.log('pool',pool.length,'C/JS fit mismatches',bad);
const gate=i=>i.e.com>=85&&i.e.full>=4&&i.e.deep.length>=1&&i.e.deadAll===0&&i.e.deadCom===0&&i.e.vw===0&&Math.min(i.e.dn,i.e.up)>=30&&i.e.exits>=71&&i.f>=630;
const pass=pool.filter(gate);console.log('pass bar',pass.length);pass.sort((a,b)=>b.f-a.f);
const CAP=+(process.env.CAP||12),cap={};const out=[],base=O.slice();let cJ=0,cR=0,cC=0;for(const i of pass){if(out.length>=+WANT)break;if(base.some(o=>jac(i,o)>LIM)){cJ++;continue}if(base.some(o=>o.b.filter(r=>i.b.includes(r)).length>1)){cR++;continue}if(i.e.deep.some(w=>(cap[w]||0)>=CAP)){cC++;continue}out.push(i);base.push(i);i.e.deep.forEach(w=>cap[w]=(cap[w]||0)+1)}
console.log('picked',out.length,'dropped too like',cJ,'row repeats',cR,'word cap',cC,'fit range',out.length&&out[out.length-1].f,out[0]&&out[0].f);
// fixed shuffle so strong and weaker boards mix
let x=20261104;const r=k=>{x=(x*1664525+1013904223)>>>0;return Math.floor(x/4294967296*k)};for(let i=out.length-1;i>0;i--){const j=r(i+1);[out[i],out[j]]=[out[j],out[i]]}
fs.writeFileSync(OUT,JSON.stringify(out.map(i=>i.b)));
const st=k=>{const a=out.map(k).sort((p,q)=>p-q);return `min ${a[0]} med ${a[a.length/2|0]} max ${a[a.length-1]}`};for(const k of ['com','dn','up','full','exits'])console.log(k,st(i=>i.e[k]));console.log('deep',st(i=>i.e.deep.length));
const tally={};out.forEach(i=>i.e.deep.forEach(w=>tally[w]=(tally[w]||0)+1));console.log('top deep',Object.entries(tally).sort((a,b)=>b[1]-a[1]).slice(0,12).join(' '));
