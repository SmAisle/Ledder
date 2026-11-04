// Run from anywhere: node source/build.js x source/boards.json
const fs=require('fs'),path=require('path');const S=process.argv[2],BF=process.argv[3];const SRC=__dirname;let h=fs.readFileSync(path.join(SRC,'base.html'),'utf8');
function R(a,b,all){const n=h.split(a).length-1;if(n<1||(!all&&n!==1))throw new Error('miss '+n+' '+a.slice(0,60));h=h.split(a).join(b)}
const VER='1.3',VD='Nov 4';
// ---- boards
const F=JSON.parse(fs.readFileSync(BF));
const m=h.match(/var AP=\[.*?\],BP=\[.*?\];/);if(!m)throw 'AP';h=h.replace(m[0],()=>'var AP='+JSON.stringify(F.map(x=>({w:[5,5,5,5,5,5,5],b:x.b,s:x.s})))+',BP=[];');
// ---- strip shelf game
const cut=(a,b)=>{const i=h.indexOf(a),j=h.indexOf(b,i);if(i<0||j<0)throw new Error('cut '+a);h=h.slice(0,i)+h.slice(j)};
cut('function cnt(s){','function ups(W,l,i)'.length?'var PA=AP.map':'');
R(`var PA=AP.map(solveA),PB=BP.map(solveB);`,`var PAC={};function solA(){return PAC[cur.A]||(PAC[cur.A]=solveA(AP[cur.A]))}`);
h=h.replace(/\nvar BCAND=[^\n]*/,'');
R(`var mode='A',cur={A:0,B:0},SA=[],SB=[];`,`var mode='A',cur={A:0},SA=[];`);
h=h.replace(/\nfunction newB\(i\)[^\n]*/,'');
R(`AP.forEach(function(){SA.push(newA())});BP.forEach(function(_,i){SB.push(newB(i))});`,`AP.forEach(function(){SA.push(newA())});`);
R(`function A(){return SA[cur.A]}function B(){return SB[cur.B]}`,`function A(){return SA[cur.A]}`);
h=h.replace(/\nfunction rest\(s\)[^\n]*/,'').replace(/\nfunction cleared\(s\)[^\n]*/,'').replace(/\nfunction scoreB\(s\)[^\n]*/,'').replace(/\nfunction possible\(s,i\)[^\n]*/,'');
R(` $('tt').textContent=mode==='A'?'Ledder':'Shrinking Shelf';\n`,` $('tt').textContent='Ledder';$('dy').textContent=(DAY===TODAY?'':'No. '+dayNo(DAY)+' · ')+shortD(DAY);\n`);
h=h.replace(/ var h='';for\(var i=0;i<0;i\+\+\)[^\n]*\n/,'').replace(/ \$\('pn'\)\.innerHTML='';[^\n]*\n/,'');
R(` if(mode==='A')renderA();else renderB();`,` renderA();`);
R(`PA[cur.A]`,`solA()`,true);
cut('function renderB(','var dTok=0');
h=h.replace(/\$\('rP'\)\.onclick=[^\n]*\n/,m=>m.includes('SB[')?'':m);
h=h.replace(/window\.WT=\{[^\n]*\n/,'').replace(/WT\.report[^\n]*\n/,'');
// ---- html
R(`<title>Ledder</title>`,`<title>Ledder</title>
<script>(function(){var d='off';try{d=localStorage.getItem('smaisle-dark')||'off'}catch(e){}if(d==='on'||(d==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.mode='navy'})()</script>`);
R(`<div class="nums2" id="pn"></div>`,`<div class="tr"><span id="dy"></span><button class="nb" id="mb" aria-label="Menu">☰</button></div>`);
h=h.replace(/\s*<div id="ver">.*?<\/div>\n/,'\n');
const a0=h.indexOf('<div id="cv">'),a1=h.indexOf('<div id="hp">');
h=h.slice(0,a0)+`<div id="cv"><a id="cvHub" href="https://smaisle.app/daily/">‹ smAisle Daily</a><div class="cm"><h1>Ledder</h1><div class="cd"><span id="cvD"></span><span id="cvN"></span></div><p>A word path through seven rows</p>
<div class="cm-t"><span>M</span><span>A</span><span>T</span></div>
<div id="cvS"></div><button id="cvP">Play today's board</button><div class="lnks"><button id="cvA">Archive</button><button id="cvT">Stats</button><button id="cvH">How to Play</button></div></div>
<div class="cf"><a href="https://smaisle.app/">smAisle Home</a> · v${VER} · ${VD}</div></div>
<div class="pop" id="mn"><div class="sc"><h2>Menu</h2><button class="b1" id="mB">Back to game</button><div class="g2"><button id="mA2">Archive</button><button id="mS">Stats</button><button id="mH">How to Play</button><button id="mP" hidden>Plus</button></div><div class="g2"><button id="mF">Home Screen</button><button class="y" id="mD">‹ smAisle Daily</button></div><button id="mE">Settings</button><div class="vl">Ledder · v${VER} · ${VD} · smAisle</div></div></div>
<div class="pop" id="se"><div class="sc"><h2>Settings</h2><h3>Sound</h3><div class="seg" id="sgS"><button data-v="on">On</button><button data-v="off">Off</button></div><h3>Dark mode</h3><div class="seg" id="sgD"><button data-v="off">Off</button><button data-v="on">On</button><button data-v="auto">Match phone</button></div><small>On uses Navy. Match phone switches with your phone.</small><button id="seT">Terms</button><button class="b1" id="seB">Back to the menu</button></div></div>
<div class="pop" id="ar"><div class="sc"><h2>Archive</h2><div id="arL"></div><button class="b1" data-x>Back</button></div></div>
<div class="pop" id="sa"><div class="sc"><h2>Your Stats</h2><div class="sg" id="saG"></div><button class="b1" data-x>Back</button></div></div>
<div class="pop" id="tm"><div class="sc"><h2>Ledder</h2><ul class="tl"><li>Ledder is a game, just for fun. No real money, no betting and no prizes.</li><li>It's provided as is, and it may change or stop working at any time.</li><li>No accounts and no ads. Nothing is sold. Your results stay on your device.</li><li>The website version sends an anonymous check-in so we can count how many devices play. It never includes your name, contacts or location.</li></ul><button class="b1" id="tmG">Agree and play</button><div class="vl">By tapping Agree and play, you accept these terms.</div></div></div>
<div class="pop" id="of"><div class="sc" style="text-align:center"><h2>First time here?</h2><p>Want a quick demo?</p><button class="b1" id="ofY">Show me</button><button id="ofN">Skip</button></div></div>
`+h.slice(a1);
R(`<button id="gtH" class="s3d">‹ smAisle Daily</button>`,`<button id="gtH" class="s3d">‹ smAisle Daily</button><button id="gtC" class="s3d" hidden>Back to the menu</button>`);
R(`<b>Goal</b><span>Score points. Earn 3 stars.</span>`,`<b>Goal</b><span>One board a day. Score points. Earn 3 stars.</span>`);
// ---- css
h=h.split('rgba(244,239,225,.72)').join('var(--veil)').split('rgba(244,239,225,.86)').join('var(--veil)').split('rgba(244,239,225,.8)').join('var(--veil)').split('rgba(244,239,225,.92)').join('var(--veil)').split('rgba(244,239,225,.9)').join('var(--veil)');
R(`:root{--paper:#f4efe1;`,`:root{--veil:rgba(244,239,225,.9);--btn:#1a1814;--btnk:#f4efe1;--paper:#f4efe1;`);
R(`</style>`,`.tr{display:flex;align-items:center;gap:8px;flex:none}#dy{font:800 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--ink2)}
.cd{display:flex;justify-content:space-between;border-top:1px solid var(--ink);border-bottom:3px double var(--ink);margin-top:8px;padding:5px 0;font:800 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--ink2)}.cm p{margin:12px 0 18px}.cm-t{margin-bottom:20px}#cvS{font:700 13px var(--sans);color:var(--ink2);min-height:18px;margin-bottom:6px}
.lnks{display:flex;justify-content:center;gap:14px;margin-top:14px}.cm .lnks button{display:inline;width:auto;height:auto;border:0;background:none;box-shadow:none;margin:0;padding:4px 2px;font:800 13px var(--sans);text-decoration:underline;color:var(--ink)}
.pop{position:fixed;inset:0;z-index:7;display:none;align-items:center;justify-content:center;background:var(--veil);padding:14px 16px}.pop.show{display:flex}
.sc{width:100%;max-width:340px;max-height:100%;overflow-y:auto;touch-action:pan-y;background:var(--paper);color:var(--ink);border:3px double var(--ink);box-shadow:6px 6px 0 var(--shadow);padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.sc h2{margin:0 0 4px;font:900 24px/1.1 var(--head);border-bottom:3px double var(--ink);padding-bottom:6px;text-align:center}.sc h3{margin:6px 0 0;font:800 12px var(--sans);letter-spacing:.06em;text-transform:uppercase}.sc small{color:var(--ink2);font:500 12px var(--sans)}.sc p{margin:0;font:500 15px/1.3 var(--sans)}
.sc button{height:44px;border:2px solid var(--ink);border-radius:3px;background:var(--card);color:var(--ink);font:800 13.5px var(--sans);padding:0 6px;flex:none}.sc button.b1{background:var(--btn);color:var(--btnk);border-color:var(--btn)}.sc button.y,.rb button.y{background:var(--hi);color:#1a1814;border:2px solid var(--ink)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.vl{text-align:center;font:600 11px var(--sans);color:var(--fade)}.tl{margin:0;padding-left:18px;font:500 13.5px/1.3 var(--sans)}.tl li{margin:4px 0}
.seg{display:flex;gap:6px}.seg button{flex:1;height:38px}.seg button.sel{background:var(--hi);color:#1a1814}
.sg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.sg div{background:var(--card);border:1px solid var(--line,rgba(26,24,20,.25));padding:8px 4px;text-align:center}.sg b{display:block;font:900 24px/1 var(--head);font-variant-numeric:lining-nums}.sg small{font:700 10px/1.2 var(--sans);display:block;margin-top:4px;color:var(--ink2)}
#arL{display:flex;flex-direction:column;gap:6px;min-height:0}#arL button{display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 10px}#arL i{font-style:normal;color:#a67c1a}
#rc{position:fixed!important;padding:14px 16px;z-index:6}.rcpt{max-height:100%;overflow-y:auto;touch-action:pan-y;max-width:340px}.rw{max-height:66px;overflow-y:auto;touch-action:pan-y}.rcpt .rb{flex-wrap:wrap}.rcpt .rb button{flex:1 1 40%;height:38px;font-size:12.5px;color:var(--ink)}.rcpt .rb .go{color:var(--paper)}.more{margin-top:8px;font:800 10.5px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);text-align:center}.mr{display:flex;gap:6px;justify-content:center;margin-top:5px}.mr img{width:36px;height:36px;border-radius:8px;display:block}
html[data-mode=navy]{--veil:rgba(18,27,46,.9);--btn:#c9a961;--btnk:#121b2e;--paper:#121b2e;--card:#1c2a44;--ink:#efe6cc;--ink2:#c9b98f;--fade:#8792ab;--red:#e0402f;--shadow:#05080f}
html[data-mode=navy] .st{background:#fbf5e3;color:#1a1814;border-color:#c9a961}html[data-mode=navy] .st.edge{background:#f3e6bd}html[data-mode=navy] .st.nx,html[data-mode=navy] .st.fr{background:#fff1b8}html[data-mode=navy] .st.on{background:#ffe27a}html[data-mode=navy] .st.now{background:#1a1814;color:#ffe27a}html[data-mode=navy] .st.lk{background:#2a3855;color:#8792ab;opacity:.6}
html[data-mode=navy] .btns .go,html[data-mode=navy] .rb .go,html[data-mode=navy] #cvP,html[data-mode=navy] .fc button,html[data-mode=navy] .wc button,html[data-mode=navy] .fb{background:var(--btn);color:var(--btnk)}html[data-mode=navy] .fc button.s3d{background:var(--card);color:var(--ink)}html[data-mode=navy] #ts,html[data-mode=navy] .hl b,html[data-mode=navy] .fc small{color:#c9a961}html[data-mode=navy] #wlp .ln span:first-child{color:#c9a961}
</style>`);
// ---- saving / days
const s0=h.indexOf(`var SKEY='ledder-today';function saveA`),s1=h.indexOf(`function undoA(){`);if(s0<0||s1<0)throw 'save';
h=h.slice(0,s0)+`function saveA(s){if(dSave||s.busy)return;lsP('ld-d-'+DAY,{found:s.found,hist:s.hist,dead:s.dead,path:s.anch?[s.path[0]]:[],anch:s.anch,up:s.up,both:s.anch&&s.both,lock:s.lock,undone:s.undone,st:s.st,top:s.top,done:s.done,over:s.over,pl:s.pl,mk:s.mk,dn:s.dn,late:s.late});if(s.found.length||s.done){var H=lsG('ld-hist',{});H[DAY]={p:scoreA(s),w:s.found.length,st:s.st,top:s.top?1:0,done:s.done?1:0,late:DAY!==TODAY&&!(H[DAY]&&!H[DAY].late)?1:(H[DAY]&&H[DAY].late||0)};lsP('ld-hist',H)}}
function loadDay(d){var o=lsG('ld-d-'+d,null);return o?Object.assign(newA(),o):newA()}
function openDay(d){DAY=d;cur.A=boardFor(dayNo(d));SA[cur.A]=loadDay(d);hideT=false;showT=false;$('cv').className='off';closeAll();render();render()}
function closeAll(){['mn','se','ar','sa','hp','wl','tm','of'].forEach(function(i){$(i).className=$(i).className.replace(/ ?show/,'')})}
function sheet(i){closeAll();$(i).className=($(i).className+' show').trim()}
function statsOf(){var H=lsG('ld-hist',{}),n=dayNo(TODAY),run=0,mx=0,cu=0,g=0,sts=0,s3=0,tp=0,best=0,wd=0;Object.keys(H).forEach(function(d){var r=H[d];if(!r.w)return;g++;sts+=r.st;if(r.st>=3)s3++;if(r.top)tp++;best=Math.max(best,r.p);wd+=r.w});for(var i=1;i<=n;i++){var r=H[dateOf(i)];if(r&&r.w&&!r.late){run++;mx=Math.max(mx,run)}else if(i<n)run=0}cu=run;return {g:g,sts:sts,s3:s3,tp:tp,best:best,avg:g?Math.round(wd/g):0,cur:cu,max:mx}}
function drawStats(){var t=statsOf(),c=[[t.g,'Played'],[t.sts,'Stars'],[t.s3,'3-star days'],[t.cur,'Streak'],[t.max,'Best streak'],[t.tp,'Top of the Ledder'],[t.best,'Best score'],[t.avg,'Avg words']];$('saG').innerHTML=c.map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('');sheet('sa')}
function drawArch(){var H=lsG('ld-hist',{}),n=dayNo(TODAY),o='';for(var i=n;i>=1;i--){var d=dateOf(i),r=H[d];o+='<button data-d="'+d+'"><span>No. '+i+' · '+shortD(d)+'</span><i>'+(r&&r.w?starS0(r.st)+' '+r.p:'')+'</i></button>'}$('arL').innerHTML=o;[].forEach.call($('arL').children,function(b){b.onclick=function(){openDay(b.dataset.d)}});sheet('ar')}
function starS0(k){return '★★★'.slice(0,k)+'☆☆☆'.slice(0,3-k)}
function shareTxt(s){return 'Ledder No. '+dayNo(DAY)+'\\n'+starS(scoreA(s))+(s.top?' Top of the Ledder':'')+'\\n'+s.found.length+' words · '+scoreA(s)+' points\\nhttps://smaisle.app/Ledder/word/'}
function doShare(s,b){var t=shareTxt(s);if(navigator.share)navigator.share({text:t}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){b.textContent='Copied'})}
function moreRow(){if(!window.SMAISLE){if(window.__ms)return;window.__ms=1;var c=document.createElement('script');c.src='https://smaisle.app/daily/games.js';c.onload=moreRow;document.head.appendChild(c);return}var e=$('mrw');if(!e)return;e.innerHTML=SMAISLE.games.filter(function(g){return g.daily&&g.id!=='ld'}).slice(0,6).map(function(g){return '<a href="'+g.url+'"><img src="'+g.icon+'" alt="'+g.name+'"></a>'}).join('')}
/* sound */
function sndOn(){return lsG('ld-sound','on')!=='off'}
function tone(f,at,d,type,v){var c=getAC();if(!c)return;var t=c.currentTime+at,o=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.1,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.03)}
function play(n){if(!sndOn()||dSave&&n==='tap')return;try{({tap:function(){tone(640,0,.06,'triangle',.06)},good:function(){[660,880].forEach(function(f,i){tone(f,i*.08,.2,'triangle',.1)})},bad:function(){tone(170,0,.28,'sawtooth',.07)},free:function(){[523,659,784].forEach(function(f,i){tone(f,i*.08,.24,'triangle',.1)})},star:function(){[523,659,784,1046].forEach(function(f,i){tone(f,i*.1,.34,'triangle',.12)})}})[n]()}catch(e){}}
var smAC=null,smAway=false;function getAC(){try{if(!smAC||smAC.state==='closed')smAC=new(window.AudioContext||window.webkitAudioContext)();if(smAC.state!=='running'){var old=smAC;old.resume().catch(function(){});setTimeout(function(){if(smAC===old&&old.state!=='running'&&!document.hidden){try{old.close()}catch(e){}smAC=null}},600)}}catch(e){smAC=null}return smAC}
function smAwake(){if(smAC&&smAway){try{smAC.close()}catch(e){}smAC=null}smAway=false}
document.addEventListener('visibilitychange',function(){if(document.hidden)smAway=true});addEventListener('pagehide',function(){smAway=true});addEventListener('pageshow',function(e){if(e.persisted)smAway=true});
['pointerdown','touchend','keydown'].forEach(function(t){document.addEventListener(t,function(){smAwake();var c=getAC();if(c){try{var b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}}},{capture:true,passive:true})});
['gesturestart','gesturechange','gestureend'].forEach(function(t){document.addEventListener(t,function(e){e.preventDefault()},{passive:false})});
`+h.slice(s1);
R(`if(s.done)receiptA();saveA(s);metaA(s);`,`if(s.done&&!hideT)receiptA();saveA(s);metaA(s);`);
R(` $('rc').className=s.done?'show':'';`,` $('rc').className=s.done&&!hideT?'show':'';`);
// done buttons
R(` if(s.menu&&!s.done){$('btns')`,` if(s.done){$('btns').innerHTML='<button id="bT" class="go">See your ticket</button>';$('bT').onclick=function(){hideT=false;render()}}else if(s.menu){$('btns')`);
// ticket
const r0=h.indexOf('function receiptA(){'),r1=h.indexOf('\n',h.indexOf("$('rP').onclick",r0));
h=h.slice(0,r0)+`function receiptA(){var s=A(),sol=solA(),t=scoreA(s),m=sol.common.filter(function(w){return !s.found.some(function(f){return f.w===w})}).sort(function(a,b){return b.length-a.length||(a<b?-1:1)}),fl=s.found.filter(function(f){return f.deep}).length;
 var h='<div class="rcpt"><h2>Ledder</h2><div class="sub">No. '+dayNo(DAY)+' · '+shortD(DAY)+' · '+starS(t)+'</div>'+(s.top?'<div class="ln bon"><span>Top of the Ledder</span></div>':'')+(s.over?'<div class="note" style="text-align:center;margin-bottom:5px"><b>Game over.</b> No moves left from your last letter.</div>':'');
 h+=s.found.length?'<div class="note rw">'+s.found.map(function(f){return f.deep?'<b>'+f.w+'</b>':f.w}).join(' · ')+'</div>':'<div class="note">No words on this ticket.</div>';if(fl)h+='<div class="ln bon"><span>Full Lines ('+fl+')</span><i></i><span>+'+fl*DEEPB+'</span></div>';
 h+='<div class="ln tot"><span>'+s.found.length+(s.found.length===1?' word':' words')+'</span><i></i><span>'+t+'</span></div><div class="note"><b>Top to bottom:</b> '+sol.deep.slice(0,3).join(', ')+'. <b>Also here:</b> '+m.filter(function(w){return sol.deep.indexOf(w)<0}).slice(0,3).join(', ')+'.</div><div class="rb"><button id="rS" class="go">Share</button><button id="rH" class="y">‹ smAisle Daily</button><button id="rA">Archive</button><button id="rT">Stats</button><button id="rB">Back to the board</button></div><div class="note" style="text-align:center"><b>New board at midnight Eastern.</b></div><div class="more">More smAisle games<div class="mr" id="mrw"></div></div></div>';
 $('rc').innerHTML=h;$('rS').onclick=function(){doShare(s,this)};$('rH').onclick=hubGo;$('rA').onclick=drawArch;$('rT').onclick=drawStats;$('rB').onclick=function(){hideT=true;render()};if(isPV())$('rA').hidden=true;moreRow()}`+h.slice(r1);
// day setup
const d0=h.indexOf("function dayS(){"),d1=h.indexOf("document.addEventListener('visibilitychange',function(){if(!document.hidden&&dayS()");if(d0<0||d1<0)throw 'day';
h=h.slice(0,d0)+`function dayS(){return new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'})}
var EPOCH='2026-11-03',OFF=Math.floor(Date.parse(EPOCH+'T00:00:00Z')/864e5)%5,hideT=false,showT=false;
function dayNo(d){return Math.round((Date.parse(d+'T00:00:00Z')-Date.parse(EPOCH+'T00:00:00Z'))/864e5)+1}
function dateOf(n){return new Date(Date.parse(EPOCH+'T00:00:00Z')+(n-1)*864e5).toISOString().slice(0,10)}
function boardFor(n){return (OFF+n-1)%AP.length}
function shortD(d){return new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'})}
var TODAY=dayS(),DAY=TODAY;cur.A=boardFor(dayNo(TODAY));
(function(){var o=lsG('lmig',0);if(!o){lsP('lmig',1);var d=lsG('ledder-today',null);if(d&&d.day===TODAY&&d.s&&!lsG('ld-d-'+TODAY,null))lsP('ld-d-'+TODAY,d.s)}})();
SA[cur.A]=loadDay(TODAY);
var hubGo=function(e){if(window.DG_APP){if(e&&e.preventDefault)e.preventDefault();toApp({cmd:'home'})}else{location.href='https://smaisle.app/daily/'}};
function drawCover(){var s=loadDay(TODAY),n=dayNo(TODAY);$('cvD').textContent=new Date(TODAY+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});$('cvN').textContent='No. '+n;$('cvP').textContent=s.done?'See your ticket':s.found.length?'Continue':"Play today's board";var t=statsOf();$('cvS').textContent=t.cur>1?t.cur+' day streak':'';['cvA','mA2'].forEach(function(i){$(i).hidden=isPV()});$('mP').hidden=!isPV();$('mH').style.gridColumn=isPV()?'':'span 2'}
$('cvP').onclick=function(){openDay(TODAY)};$('cvH').onclick=function(){sheet('hp')};$('cvA').onclick=drawArch;$('cvT').onclick=drawStats;
$('mb').onclick=function(){sheet('mn')};$('mB').onclick=closeAll;$('mA2').onclick=drawArch;$('mS').onclick=drawStats;$('mH').onclick=function(){sheet('hp')};$('mP').onclick=function(){closeAll();$('gtC').hidden=false;$('gt').className='show'};$('gtC').onclick=function(){$('gt').className='';sheet('mn')};$('mF').onclick=function(){closeAll();drawCover();$('cv').className=''};$('mD').onclick=hubGo;$('mE').onclick=function(){drawSet();sheet('se')};$('seB').onclick=function(){sheet('mn')};$('seT').onclick=function(){sheet('tm')};
[].forEach.call(document.querySelectorAll('[data-x]'),function(b){b.onclick=closeAll});
function setDark(){var d=lsG0('smaisle-dark','off'),n=d==='on'||(d==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);if(n)document.documentElement.dataset.mode='navy';else delete document.documentElement.dataset.mode;var m=document.querySelector('meta[name=theme-color]');if(m)m.content=n?'#121b2e':'#f4efe1';toApp({cmd:'mode',navy:n});render()}
function lsG0(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}}
function drawSet(){[].forEach.call($('sgS').children,function(b){b.className=b.dataset.v===lsG('ld-sound','on')?'sel':''});[].forEach.call($('sgD').children,function(b){b.className=b.dataset.v===lsG0('smaisle-dark','off')?'sel':''})}
[].forEach.call($('sgS').children,function(b){b.onclick=function(){lsP('ld-sound',b.dataset.v);drawSet();play('tap')}});[].forEach.call($('sgD').children,function(b){b.onclick=function(){try{localStorage.setItem('smaisle-dark',b.dataset.v)}catch(e){}drawSet();setDark()}});
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',setDark)}catch(e){}
$('tmG').onclick=function(){var first=!lsG('ld-terms','');lsP('ld-terms',new Date().toISOString());closeAll();if(first){checkIn('open');sheet('of')}};$('ofY').onclick=function(){closeAll();demo()};$('ofN').onclick=closeAll;
if(!lsG('ld-terms',''))sheet('tm');
`+h.slice(d1);
R(`\ncheckIn('open');`,`\nif(lsG('ld-terms',''))checkIn('open');drawCover();`);
h=h.replace(/\$\('gtB'\)\.onclick=[^;]*;[^\n]*?\n/,`$('gtB').onclick=function(){if(window.DG_APP)toApp({cmd:'plus'});else location.href='https://smaisle.app/daily/#plus'};$('gtH').onclick=function(e){hubGo(e)};$('cvHub').onclick=function(e){hubGo(e)};\n`);
// checkin
R(`function checkIn(kind){var u=`,`function checkIn(kind){if(!lsG('ld-terms',''))return;var u=`);
R(`v:T('0.41')`,`v:T('${VER}'),terms:T(String(lsG('ld-terms','')).slice(0,10)),streak:I(statsOf().cur),max:I(statsOf().max),wins:I(u.done)`);
R(`function metaA(s){if(dSave)return;if(s.found.length&&!s.pl){s.pl=1;checkIn('play')}if((s.done||s.st>=1)&&!s.mk){s.mk=1;markHub()}if(s.done&&!s.dn){s.dn=1;checkIn('done')}`,`function metaA(s){if(dSave)return;if(DAY===TODAY){if(s.found.length&&!s.pl){s.pl=1;checkIn('play')}if((s.done||s.st>=1)&&!s.mk){s.mk=1;markHub()}if(s.done&&!s.dn){s.dn=1;checkIn('done')}}`);
// sound hooks
R(`b.onclick=function(){tapA(+b.dataset.l,+b.dataset.i)}`,`b.onclick=function(){play('tap');tapA(+b.dataset.l,+b.dataset.i)}`);
R(`function badA(s){s.busy=1;`,`function badA(s){s.busy=1;play('bad');`);
R(`var sc=scoreA(s),ks=stars(sc);if(ks>s.st){`,`var sc=scoreA(s),ks=stars(sc);play(ks>s.st?'star':(s.path[s.path.length-1][0]===0||s.path[s.path.length-1][0]===P.w.length-1)?'free':'good');if(ks>s.st){`);
R(`$('hpb').onclick=function(){$('hp').className='show'};`,'');
// stuck and undo cards
R(`$('bK').onclick=function(){if(!s.done){s.menu=true;render()}}`,`$('bK').onclick=function(){if(!s.done)showStuck()}`);
R(`['f',function(){A().menu=true;render()}]`,`['f',function(){showStuck()}]`);
R(`['f',function(){A().menu=false;say(A(),'');render()}]`,`['f',function(){$('sk').className='pop'}]`);
R(`function undoA(){`,`function showStuck(){var s=A(),st=stuckA(s),w=s.hist.length&&s.found.length?s.found[s.found.length-1].w:'',can=w&&!s.undone;$('skH').textContent=st?'No words from here':'Stuck?';$('skM').textContent=can?'You get one Undo a day. It takes back '+w+', and that word is gone for good.':s.undone?"You've used today's Undo. You can keep looking or end the game.":'You can keep looking or end the game.';$('skU').textContent='Undo '+w;$('skU').hidden=!can;$('skC').hidden=!!st&&!!s.undone;$('sk').className='pop show'}
function undoA(){`);
R(`say(s,f.w+' is gone and can\\'t be played again.','bad');render()}`,`say(s,f.w+' is gone and can\\'t be played again.','bad');render();$('udH').textContent=f.w+' is gone';$('udM').textContent=(f.p+(f.deep?DEEPB:0))+' point'+((f.p+(f.deep?DEEPB:0))===1?'':'s')+' taken back. That word can\\'t be played again today. '+(s.anch?'You\\'re back on your last letter.':s.found.length?'Free start: begin on any letter.':'Pick a letter in the top row.');$('ud').className='pop show'}`);
R(`<div class="pop" id="of">`,`<div class="pop" id="sk"><div class="sc" style="text-align:center"><h2 id="skH"></h2><p id="skM"></p><button class="b1" id="skU"></button><button id="skE">End the game</button><button id="skC">Keep playing</button></div></div>
<div class="pop" id="ud"><div class="sc" style="text-align:center"><h2 id="udH"></h2><p id="udM"></p><button class="b1" id="udO">Got it</button></div></div>
<div class="pop" id="of">`);
R(`$('mb').onclick=function(){sheet('mn')};`,`$('skU').onclick=function(){$('sk').className='pop';undoA()};$('skE').onclick=function(){$('sk').className='pop';A().done=true;render()};$('skC').onclick=function(){$('sk').className='pop'};$('udO').onclick=function(){$('ud').className='pop'};
$('mb').onclick=function(){sheet('mn')};`);
R(`#dm{position:fixed;inset:0;z-index:6;`,`#dm{position:fixed;inset:0;z-index:9;`);
R(`</style>`,`#word.m{font-size:14px}#word.m.bad{background:var(--red);color:#fff;font:700 15px/1.2 var(--sans);letter-spacing:0;border-radius:6px;padding:0 10px;margin:0 2px;animation:errIn .2s ease-out}#word.m.bad.sh{animation:errIn .2s ease-out,sh .28s}@keyframes errIn{from{opacity:0;transform:translateY(4px)}}
</style>`);
R(`'<span class="none">'+sol.common.length+' everyday words on this board. Yours land here.</span>'`,`'<span class="none">'+Object.keys(everyWord()).length+' everyday words on this board. Yours land here.</span>'`);
// misc
h=h.split('FREE START').join('BOARD UNLOCKED').split('<h2>Free Start</h2>').join('<h2>Board Unlocked</h2>').split('Begin your next word on any letter, going up or down.').join('Your next word can start on any letter, going up or down.').split('Free start: begin on any letter').join('Board unlocked: begin on any letter').split('Free start. Begin on any letter.').join('Board unlocked. Begin on any letter.').split('<b>Free start</b>').join('<b>Unlock</b>').split('Reach the top or bottom row. Your next word can start on any letter.').join('Reach the top or bottom row to unlock the board. Your next word can start on any letter.').split('so your next word can start on any letter').join('so the board unlocks. Your next word can start on any letter');
// ---- coach demo: the one demo, shared frame plus Ledder's practice board (source/demo.js). The old self-playing demo goes.
cut('var dTok=0,dSave=null,dTm=null;',"document.querySelector('.tix').onclick");
R(`document.querySelector('.tix').onclick`,fs.readFileSync(path.join(SRC,'demo-frame.js'),'utf8')+fs.readFileSync(path.join(SRC,'demo.js'),'utf8')+`document.querySelector('.tix').onclick`);
R(`function metaA(s){if(dSave)return;`,`function metaA(s){`);R(`function saveA(s){if(dSave||s.busy)return;`,`function saveA(s){if(s.busy)return;`);
R(`if(!sndOn()||dSave&&n==='tap')return;`,`if(!sndOn())return;`);R(`&&!dSave)`,`)`,true);R(`if(!dSave)card3`,`card3`,true);R(`if(s.done||dSave)return;`,`if(s.done)return;`);
R(`$('hpD').onclick=demo;$('dx').onclick=demoEnd;`,`$('hpD').onclick=coachDemo;`);
R(`$('ofY').onclick=function(){closeAll();demo()};`,`$('ofY').onclick=function(){closeAll();coachDemo()};`);
R(`<div id="dm"><div id="dc"><span id="dt"></span><button id="dx">Close</button></div></div>\n`,'');
h=h.replace(/\n#dm\{position:fixed[^\n]*/,'').replace(/\n#dc\{[^\n]*/,'').replace(/\n#dt\{flex:1[^\n]*/,'');
R(`<button id="hpD">Demo</button>`,`<button id="hpD">Try the demo</button>`);R(`<button class="b1" id="ofY">Show me</button>`,`<button class="b1" id="ofY">Try the demo</button>`);
R(`</style>`,fs.readFileSync(path.join(SRC,'demo-frame.css'),'utf8')+`#wsc{position:fixed;inset:0;z-index:8;display:none;align-items:center;justify-content:center;background:var(--veil);padding:16px}#wsc.show{display:flex}#wsc .pg{text-align:left;margin:8px 0}#wsc p{margin:0 0 10px;font:500 13px/1.3 var(--sans)}.wb{display:flex;gap:8px;flex:none}.wb button{flex:1 1 0;width:auto;min-width:0}
.ldD{display:flex;flex-direction:column;gap:6px;height:100%}.ldD .tix{flex:0 0 52px;margin:0 2px 0 0}.ldFw{min-width:0;flex:1;font:700 11px/1.35 var(--sans);letter-spacing:.02em}.ldFw u{text-decoration:none;background:var(--hi);color:#1a1814;padding:0 3px;border-radius:2px}.ldFw span{font-weight:500;color:var(--ink2);letter-spacing:0}
.ldW{flex:0 0 26px;display:flex;align-items:center;justify-content:center;font:800 20px/1 var(--sans);letter-spacing:.14em;overflow:hidden}.ldW.good{font:700 14px/1.2 var(--sans);letter-spacing:0;color:var(--ok)}
.ldB{flex:1 1 0;min-height:0;position:relative}.ldB svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.ldD .btns button{height:40px}.ldD .btns .off{opacity:.4;box-shadow:none}
</style>`);
if(/dSave|dTok|demoEnd/.test(h))throw new Error('old demo left');
fs.writeFileSync(path.join(SRC,'..','word','index.html'),h);
