/* smAisle demo frame v1 (Nov 4, 2026). One demo for every game: Try it with a coach (change list #30).
   Add demo-frame.css to the page, this script after it, then call:
   smDemo({name:'Game',moves:[{cap:'What to do',nudge:'What to say after a wrong tap'},...],win:'How you win',
     play:function(){start the real game},
     board:function(stage){draw a tiny practice board in stage; return {to:function(n){show the board after n moves},
       tgt:function(n){return the element to tap for move n},win:function(){show the finished board}}},
     auto:true for fast games that can't pause (it plays itself, model B)});
   Uses the page's --paper --card --ink --ink2 --btn --hi colors. Saves nothing and counts nothing. */
function smDemo(o){
 var E=function(h){var t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstChild},root=document.getElementById('smDemo'),timers=[],k=0,busy=false,B,stage,capT,capN,capH,dots,slot;
 var HAND='<svg viewBox="0 0 38 46" aria-hidden="true"><path d="M13 2c3 0 5 2 5 5v11l11 2c4 1 6 3 6 7l-1 9c-1 5-4 8-9 8H17c-3 0-5-1-7-4L3 29c-2-3 2-6 5-4l1 1 0-19c0-3 2-5 4-5z" fill="#ffe27a" stroke="#1a1814" stroke-width="2.4" stroke-linejoin="round"/></svg>';
 var TOP='<div class="smTop"><span><b>DEMO</b><i>Practice only. Nothing counts.</i></span><button type="button" id="smSkip">Skip</button></div>';
 if(root)root.remove();root=E('<div id="smDemo" role="dialog" aria-label="'+o.name+' demo"></div>');document.body.appendChild(root);
 function later(f,ms){timers.push(setTimeout(f,ms))}function stop(){timers.forEach(clearTimeout);timers=[]}
 function close(){stop();root.remove()}
 function run(){stop();k=0;busy=false;root.innerHTML=TOP+'<div class="smStage"></div><div class="smCap"><div class="smH"><b></b><small></small></div><p></p><div class="smDots"></div><div class="smSlot"></div></div>';root.querySelector('#smSkip').onclick=close;stage=root.querySelector('.smStage');var c=root.querySelector('.smCap');capH=c.querySelector('b');capN=c.querySelector('small');capT=c.querySelector('p');dots=c.querySelector('.smDots');slot=c.querySelector('.smSlot');B=o.board(stage);slot.innerHTML='<div class="smTurn">'+(o.auto?'Plays by itself':'Your turn. Tap where the finger points.')+'</div>';show();if(!o.auto)stage.onclick=tap}
 function cap(h,i,n,t){capH.textContent=h;capN.textContent=n?'Step '+(i+1)+' of '+n:'Done';capT.textContent=t;capT.className='';dots.innerHTML=o.moves.map(function(m,j){return '<i class="'+(j<=i?'on':'')+'"></i>'}).join('')}
 function fin(){var f=stage.querySelector('.smF');if(f)f.remove()}
 function point(el){var f=stage.querySelector('.smF');if(!f){f=E('<div class="smF">'+HAND+'</div>');f.style.left=stage.clientWidth/2+'px';f.style.top=stage.clientHeight-60+'px';stage.appendChild(f);void f.offsetWidth}var a=el.getBoundingClientRect(),b=stage.getBoundingClientRect(),x=a.left-b.left+a.width/2,y=a.top-b.top+a.height-6;f.classList.toggle('up',y+46>stage.clientHeight);f.style.left=x+'px';f.style.top=(y+46>stage.clientHeight?a.top-b.top+6:y)+'px'}
 function rip(el){var a=el.getBoundingClientRect(),b=stage.getBoundingClientRect(),r=E('<i class="smR"></i>');r.style.left=a.left-b.left+a.width/2+'px';r.style.top=a.top-b.top+a.height/2+'px';stage.appendChild(r);setTimeout(function(){r.remove()},520)}
 function show(){B.to(k);cap('Your move',k,o.moves.length,o.moves[k].cap);var t=B.tgt(k);t.classList.add('smNow');point(t);busy=false;if(o.auto)later(function(){done(t)},1700)}
 function done(t){busy=true;rip(t);fin();k++;if(k<o.moves.length){B.to(k);later(show,o.auto?900:450)}else{B.to(k);later(function(){B.win();cap('How you win',k-1,0,o.win);slot.innerHTML='';later(ready,1500)},900)}}
 function tap(e){if(busy)return;var h=e.target.closest('.smNow');if(h){done(h);return}capT.textContent=o.moves[k].nudge;capT.className='nudge';var n=stage.querySelector('.smNow');if(n){n.classList.remove('smW');void n.offsetWidth;n.classList.add('smW')}}
 function ready(){stop();fin();var p=E('<div class="smPop"><div class="smPc"><h3>You’re ready</h3><p>'+o.win+'</p><button type="button" class="smBtn" id="smPlay">Play</button><button type="button" class="smBtn alt" id="smAg">Demo again</button></div></div>');root.appendChild(p);root.querySelector('#smPlay').onclick=function(){close();o.play()};root.querySelector('#smAg').onclick=run}
 run();return {close:close}}
