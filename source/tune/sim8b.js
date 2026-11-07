// Star levels by simulation, same as the first 71 boards. node sim.js in.json out.json [games] [from] [to]
// Casual, regular and strong players see 15%, 30% and 60% of words. Stars: regular 45th pct, strong 50th, strong 88th, to the nearest 5.
const fs=require('fs'),[,,IN_F,OUT,G='500',FR='0',TO='99999']=process.argv;const D=require('./w8/load8.js');const B=JSON.parse(fs.readFileSync(IN_F)).slice(+FR,+TO);
const ALL=new Set(D.all),CS=new Set(D.common),IN=new Set(D.infl),pre=new Set();for(const w of CS)for(let i=1;i<=w.length;i++)pre.add(w.slice(0,i));
const R=8,N=6,nb=i=>[i-1,i,i+1].filter(j=>j>=0&&j<N),T={3:1,4:5,5:8,6:12,7:17,8:23};
const pts=w=>{const f=IN.has(w);return T[f?Math.max(3,w.length-1):w.length]+(w.length===8&&!f?20:0)};
function from(b,l0,i0,dir){const o=[];const go=(l,i,s)=>{s+=b[l][i];if(!pre.has(s))return;if(s.length>=3&&CS.has(s))o.push({w:s,l,i,dir});const nl=l+dir;if(nl<0||nl>=R)return;for(const j of nb(i))go(nl,j,s)};go(l0,i0,'');return o}
const cache=new Map();const F=(bi,b,l,i,d)=>{const k=bi+','+l+','+i+','+d;if(!cache.has(k))cache.set(k,from(b,l,i,d));return cache.get(k)};
function opts(bi,b,st,used,first){let o=[];if(first){for(let i=0;i<N;i++)o.push(...F(bi,b,0,i,1))}else if(st==null){for(let l=0;l<R;l++)for(let i=0;i<N;i++){if(l<R-1)o.push(...F(bi,b,l,i,1));if(l>0)o.push(...F(bi,b,l,i,-1))}}else{const[l,i,d]=st;for(const x of (l>=2&&l<=R-3)?[1,-1]:[-d])o.push(...F(bi,b,l,i,x))}const m=new Map();for(const x of o)if(!used.has(x.w)&&!m.has(x.w))m.set(x.w,x);return[...m.values()]}
const next=x=>(x.l===0||x.l===R-1)?null:[x.l,x.i,x.dir];
function play(bi,b,see){const used=new Set(),seen=new Map();let st=null,sc=0,n=0,hist=[],dead=new Set(),u=1;const vis=w=>{if(!seen.has(w))seen.set(w,Math.random()<see);return seen.get(w)};
 for(let t=0;t<150;t++){let o=opts(bi,b,st,used,n===0).filter(x=>!dead.has(x.w)&&vis(x.w));const live=o.filter(x=>{const q=next(x);if(!q)return true;return opts(bi,b,q,used,false).some(y=>y.w!==x.w&&!dead.has(y.w))});if(live.length)o=live;
  if(!o.length){if(u>0&&hist.length){u--;const h=hist.pop();used.delete(h.w);dead.add(h.w);st=h.st;sc-=pts(h.w);n--;continue}break}
  const x=o[Math.floor(Math.random()*o.length)];hist.push({w:x.w,st});used.add(x.w);n++;sc+=pts(x.w);st=next(x)}return [sc,n]}
const q=(a,p)=>a[Math.floor(a.length*p)],r5=x=>Math.max(5,Math.round(x/5)*5);const out=[];
B.forEach((b,bi)=>{const reg=[],str=[],cas=[],rn=[];for(let g=0;g<+G;g++){const a=play(bi,b,.3);reg.push(a[0]);rn.push(a[1]);str.push(play(bi,b,.6)[0]);cas.push(play(bi,b,.15)[0])}[reg,str,cas,rn].forEach(a=>a.sort((x,y)=>x-y));
 const s=[r5(q(cas,.68)),r5(q(reg,.87)),r5(q(str,.88))];const pc=(a,x)=>Math.round(100*a.filter(v=>v>=x).length/a.length);
 console.log(bi,b.join(' '),'stars',s,'cas',pc(cas,s[0]),pc(cas,s[1]),'reg',pc(reg,s[0]),pc(reg,s[1]),pc(reg,s[2]),'str',pc(str,s[0]),pc(str,s[1]),pc(str,s[2]),'regWords',q(rn,.5));out.push({b,s,p:[pc(cas,s[0]),pc(reg,s[0]),pc(reg,s[1]),pc(str,s[1]),pc(str,s[2])]})});
fs.writeFileSync(OUT,JSON.stringify(out));
