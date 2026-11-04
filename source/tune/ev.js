// same evaluator as gen9.js, plus deep count as the page's solveA defines it
const fs=require('fs');const D=require('./load.js');const N=5,R=7,Vo='AEIOU';
const ALL=new Set(D.all.filter(w=>w.length<=R)),CS=new Set(D.common.filter(w=>w.length<=R)),IN=new Set(D.infl),pre=new Set();for(const w of ALL)for(let i=1;i<=w.length;i++)pre.add(w.slice(0,i));
const nb=i=>[i-1,i,i+1].filter(j=>j>=0&&j<N);
function words(B,l0,i0,dir,cb){const go=(l,i,s)=>{s+=B[l][i];if(!pre.has(s))return;if(s.length>=3&&ALL.has(s))cb(s,l,i);const nl=l+dir;if(nl<0||nl>=R)return;for(const j of nb(i))go(nl,j,s)};go(l0,i0,'')}
function ev(B){const com=new Set(),all=new Set(),seen=new Set(),ends={};let full=0,exits=0;const dn=new Set(),up=new Set(),deep=new Set();
 const rec=(w,l,i)=>{all.add(w);if(CS.has(w))com.add(w);if(w.length===R&&!IN.has(w)&&CS.has(w)&&!seen.has(w)){seen.add(w);full++}ends[l+','+i]=1};
 for(let i=0;i<N;i++){words(B,0,i,1,(w,l,j)=>{rec(w,l,j);if(CS.has(w)){dn.add(w);if(l===R-1)deep.add(w)}});words(B,R-1,i,-1,(w,l,j)=>{rec(w,l,j);if(CS.has(w))up.add(w)})}
 let land=0,deadAll=0,deadCom=0;for(let l=1;l<R-1;l++)for(let i=0;i<N;i++){if(!ends[l+','+i])continue;land++;const dirs=l===1?[1]:l===R-2?[-1]:[1,-1];let a=0,c=0;for(const d of dirs)words(B,l,i,d,w=>{a++;if(CS.has(w))c++});exits+=Math.min(c,6);if(!a)deadAll++;if(!c)deadCom++}
 let vw=0;for(let l=0;l<R;l++){const v=B[l].filter(c=>Vo.includes(c)).length;if(v>N-2)vw+=v-(N-2)}return {com:com.size,dn:dn.size,up:up.size,all:all.size,full,land,deadAll,deadCom,exits,vw,deep:[...deep],comL:[...com]}}
const fit=e=>(e.com<85?(e.com-85)*40:0)+(e.full<4?(e.full-4)*80:0)+-e.deadAll*200-e.deadCom*25+e.com+Math.min(e.dn,e.up)*2+Math.min(e.full,5)*40+e.land*2+e.exits*3-e.vw*60;
module.exports={ev,fit,CS,IN,D};
if(require.main===module){const b=JSON.parse(fs.readFileSync(process.argv[2]));const E=b.map(x=>ev(x.b.map(r=>r.split(''))));
const st=k=>{const a=E.map(k).sort((x,y)=>x-y);return `min ${a[0]} p10 ${a[a.length/10|0]} med ${a[a.length/2|0]} max ${a[a.length-1]}`};
for(const k of ['com','dn','up','all','full','land','deadAll','deadCom','exits','vw'])console.log(k,st(e=>e[k]));console.log('deepN',st(e=>e.deep.length),'fit',st(fit));
console.log('s1',st((e,i)=>0));for(const j of [0,1,2]){const a=b.map(x=>x.s[j]).sort((x,y)=>x-y);console.log('star',j,a[0],a[a.length/2|0],a[a.length-1])}
E.forEach((e,i)=>{if(e.deep.length<1||e.com<85||e.full<3)console.log(i,b[i].b.join(' '),JSON.stringify({com:e.com,full:e.full,deep:e.deep,deadCom:e.deadCom}))});
const c={};b.forEach(x=>x.b.join('').split('').forEach(l=>c[l]=(c[l]||0)+1));console.log(Object.entries(c).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+(x[1]/b.length).toFixed(1)).join(' '))}
