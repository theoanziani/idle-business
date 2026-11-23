/* ============================================================
   FOOTBALL : match suivi sur un terrain animé (vue de dessus)
   Le déroulé vient de footMatchScript ; l'animation construit les actions qui
   mènent à chaque tir. Vitesses ×1 à ×8, passage direct au résultat.
   L'état de l'animation vit dans FOOT_LIVE (pas dans la page), pour survivre
   aux rafraîchissements de l'écran.
   ============================================================ */
let FOOT_LIVE=null;
const FM_SPEEDS=[1,2,4,8];
/* positions de base en 4-3-3 pour une équipe qui attaque vers la droite (terrain 105 x 68) */
const FM_BASE=[[4,34],[30,9],[30,59],[23,26],[23,42],[40,34],[50,22],[52,46],[70,11],[70,57],[79,34]];
function fmColorDist(a,b){ const p=x=>[parseInt(x.slice(1,3),16),parseInt(x.slice(3,5),16),parseInt(x.slice(5,7),16)]; const A=p(a),B=p(b); return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]); }
function fmKits(h,a){
  const H=footClub(h), A=footClub(a), k0={f:H.c1, s:H.c2};
  let k1={f:A.c1, s:A.c2};
  if(fmColorDist(k0.f,k1.f)<110) k1={f:A.c2, s:A.c1};
  if(fmColorDist(k0.f,k1.f)<110) k1= fmColorDist(k0.f,'#ffffff')>150? {f:'#ffffff', s:'#222222'} : {f:'#222222', s:'#ffffff'};
  return [k0,k1];
}
function fmStart(h,a,gh,ga,day,pen,ko){
  { const O=S.foot&&S.foot.own; if(O&&O.last&&O.last.h===h&&O.last.a===a&&O.last.day===day) O.last.seen=1; }
  const M=footMatchScript(h,a,gh-(ko&&ko.et?ko.et[0]:0),ga-(ko&&ko.et?ko.et[1]:0),day*977+13,ko&&ko.et?ko:null);
  const L={M, h, a, pen, day, t:0, speed:1, play:true, i:0, feed:[], kits:fmKits(h,a), tab:'feed',
    pl:[], ball:{x:52.5,y:34,tx:52.5,ty:34,v:0}, side:0, holder:10, nextPass:.8, pause:0, flash:null, half:1, done:false, raf:0, lt:0, R:footSeedRng(day*31+h)};
  for(let s=0;s<2;s++) for(let i=0;i<11;i++){ const b=fmBasePos(L,s,i); L.pl.push({s,i,x:b[0],y:b[1],n:M.xi[s][i].n}); }
  fmKickoff(L,0);
  FOOT_LIVE=L; return L;
}
const fmDir = (L,s) => ((L.half%2===1)===(s===0))? 1 : -1;
function fmBasePos(L,s,i){ const b=FM_BASE[i]; return fmDir(L,s)>0? [b[0],b[1]] : [105-b[0],68-b[1]]; }
function fmKickoff(L,s){
  L.pl.forEach(p=>{ const b=fmBasePos(L,p.s,p.i); const d=fmDir(L,p.s); p.x=Math.min(d>0?51:105,Math.max(d>0?0:54,b[0]-d*12)); p.y=b[1]; });
  const st=L.pl.find(p=>p.s===s&&p.i===10); st.x=52.5; st.y=34; L.side=s; L.holder=st; L.ball.x=L.ball.tx=52.5; L.ball.y=L.ball.ty=34; L.ball.v=0; L.nextPass=.6;
}
/* prochaine action décisive (tir) */
function fmNextShot(L){ const ev=L.M.ev; for(let j=L.i;j<ev.length;j++){ const e=ev[j]; if(e.k==='goal'||e.k==='save'||e.k==='miss') return e; if(e.k==='ht'||e.k==='ft'||e.k==='ft90'||e.k==='eht'||e.k==='ete'||e.k==='pk') return null; } return null; }
function fmPass(L,to,speed){ L.ball.tx=to.x; L.ball.ty=to.y; L.ball.v=speed||55; L.ball.to=to; L.holder=null; }
function fmGoalOf(L,s){ return fmDir(L,s)>0? 105 : 0; }
/* exécute un événement du scénario */
function fmEvent(L,e){
  L.feed.unshift(e);
  const M=L.M;
  if(e.k==='goal'||e.k==='save'||e.k==='miss'){
    const sh=L.pl.find(p=>p.s===e.s&&p.n===e.p) || L.pl.find(p=>p.s===e.s&&p.i===10), gx=fmGoalOf(L,e.s), d=fmDir(L,e.s);
    sh.x=gx-d*(e.kind==='pen'?11:13+L.R()*8); sh.y=34+(L.R()-.5)*(e.kind==='pen'?0:22);
    L.ball.x=sh.x; L.ball.y=sh.y;
    const gk=L.pl.find(p=>p.s!==e.s&&p.i===0);
    if(e.k==='goal'){ L.ball.tx=gx+d*1.2; L.ball.ty=34+(L.R()-.5)*5; L.flash={t:'BUT !', s:e.s, until:2.2}; L.pause=2.2; L.after='kick'; L.afterS=1-e.s; }
    else if(e.k==='save'){ L.ball.tx=gk.x; L.ball.ty=gk.y=34+(L.R()-.5)*5; L.pause=.5; L.after='gk'; L.afterS=1-e.s; }
    else { L.ball.tx=gx+d*2; L.ball.ty=34+(L.R()<.5?-1:1)*(6+L.R()*6); L.pause=.6; L.after='gk'; L.afterS=1-e.s; }
    L.ball.v=80; L.ball.to=null; L.holder=null;
  } else if(e.k==='corner'){
    const d=fmDir(L,e.s), cx=d>0?104.5:.5, cy=L.R()<.5?.5:67.5, tk=L.pl.find(p=>p.s===e.s&&(p.i===8||p.i===9));
    tk.x=cx; tk.y=cy; L.ball.x=L.ball.tx=cx; L.ball.y=L.ball.ty=cy; L.holder=tk; L.side=e.s; L.nextPass=.7; L.corner=true;
  } else if(e.k==='ft90'){ L.half=3; L.pause=2; L.after='kick'; L.afterS=0; L.flash={t:'Prolongation', until:2}; }
  else if(e.k==='eht'){ L.half=4; L.pause=1.2; L.after='kick'; L.afterS=1; L.flash={t:'Mi-temps', until:1.2}; }
  else if(e.k==='ete'){ L.shoot=true; fmPkLine(L); L.pause=2; L.after=null; L.flash={t:'Tirs au but', until:2}; }
  else if(e.k==='pk'){ fmPkLine(L); const sh=L.pl.find(p=>p.s===e.s&&p.n===e.p)||L.pl.find(p=>p.s===e.s&&p.i===10), gk=L.pl.find(p=>p.s!==e.s&&p.i===0);
    sh.x=105-11; sh.y=34; gk.x=104; gk.y=34; L.ball.x=105-11.6; L.ball.y=34; L.holder=null; L.ball.to=null; const R=L.R(), side=R<.5?-1:1;
    if(e.made){ L.ball.tx=106.2; L.ball.ty=34+side*(1.5+L.R()*2); } else if(L.R()<.6){ gk.y=34+side*2.8; L.ball.tx=103.8; L.ball.ty=gk.y; } else { L.ball.tx=107; L.ball.ty=34+side*(4.6+L.R()*2); }
    L.ball.v=60; L.pause=1.5; L.after=null; L.flash={t:e.made?'Marqué':'Manqué', s:e.s, until:1.2}; }
  else if(e.k==='ht'){ L.half=2; L.pause=1.2; L.after='kick'; L.afterS=1; L.flash={t:'Mi-temps', until:1.2}; }
  else if(e.k==='ft'){ L.done=true; L.play=false; L.flash={t:'Fin du match', until:9e9}; }
  else if(e.k==='sub'){ const p=L.pl.find(q=>q.s===e.s&&q.n===e.o); if(p) p.n=e.p; }
}
/* V2.5.5 : tirs au but : joueurs alignés dans le rond central, les gardiens à part */
function fmPkLine(L){ [0,1].forEach(s=>{ const T=L.pl.filter(p=>p.s===s&&p.i>0); T.forEach((p,k)=>{ p.x=44+k*1.7; p.y=s? 37.5 : 30.5; }); const g=L.pl.find(p=>p.s===s&&p.i===0); g.x=s? 60 : 45; g.y=s? 40 : 28; }); }
/* pas d'animation (dt en secondes réelles) */
function fmStep(L,dt){
  const vis=Math.min(L.speed,3), M=L.M;
  if(L.flash && L.flash.until<9e8){ L.flash.until-=dt; if(L.flash.until<=0) L.flash=null; }
  if(L.pause>0){ L.pause-=dt; fmMoveBall(L,dt*vis); if(!L.shoot) fmMovePlayers(L,dt*vis*.6); if(L.pause<=0){ if(L.after==='kick') fmKickoff(L,L.afterS); else if(L.after==='gk'){ const gk=L.pl.find(p=>p.s===L.afterS&&p.i===0); L.side=L.afterS; L.holder=gk; L.ball.x=gk.x; L.ball.y=gk.y; L.nextPass=.5; } L.after=null; } return; }
  if(!L.play) return;
  const gps=30*L.speed;                                   /* secondes de jeu par seconde réelle */
  const t1=L.t+dt*gps;
  /* événements atteints */
  while(L.i<M.ev.length && M.ev[L.i].t<=t1){ const e=M.ev[L.i++]; L.t=e.t; fmEvent(L,e); if(L.pause>0||L.done) return; }
  L.t=t1;
  if(L.shoot){ fmMoveBall(L,dt*vis); return; }
  /* préparer l'action qui mène au prochain tir */
  const E=fmNextShot(L), rt= E? (E.t-L.t)/gps : 99;
  if(E && rt<2.6 && L.side!==E.s){ const h=L.holder||L.pl.find(p=>p.s===L.side&&p.i===6); const st=L.pl.filter(p=>p.s===E.s&&p.i>4).sort((a,b)=>Math.hypot(a.x-L.ball.x,a.y-L.ball.y)-Math.hypot(b.x-L.ball.x,b.y-L.ball.y))[0]; L.side=E.s; if(L.holder||L.ball.v===0){ L.holder=st; st.x=L.ball.x; st.y=L.ball.y; } else L.ball.to=st; L.nextPass=.35/vis; }
  /* passes */
  if(L.holder){
    L.nextPass-=dt*vis;
    const d=fmDir(L,L.side), H=L.holder;
    H.x+=d*dt*vis*6; L.ball.x=H.x+d*.8; L.ball.y=H.y; L.ball.tx=L.ball.x; L.ball.ty=L.ball.y;
    if(L.nextPass<=0){
      const mates=L.pl.filter(p=>p.s===L.side&&p!==H&&p.i>0);
      let to;
      if(E && E.s===L.side && rt<1.4){ to=L.pl.find(p=>p.s===E.s&&p.n===E.p)||mates[mates.length-1]; }
      else if(L.corner){ to=L.pl.filter(p=>p.s===L.side&&p.i>=5).sort(()=>L.R()-.5)[0]; L.corner=false; }
      else { const fw=mates.filter(p=>(p.x-H.x)*d>-8); const pool=fw.length?fw:mates; to=pool[Math.floor(L.R()*pool.length)]; }
      /* perte de balle, en fonction de la possession attendue */
      const share=L.side===0? M.poss : 1-M.poss, lose=.13*(1-share)/share*(E&&E.s===L.side&&rt<3?0:1);
      if(L.R()<lose){ const opp=L.pl.filter(p=>p.s!==L.side&&p.i>0).sort((a,b)=>Math.hypot(a.x-to.x,a.y-to.y)-Math.hypot(b.x-to.x,b.y-to.y))[0]; fmPass(L,opp,45*vis); L.side=1-L.side; }
      else fmPass(L,to,48*vis);
      L.nextPass=(.5+L.R()*.7)/vis;
    }
  }
  fmMoveBall(L,dt*vis); fmMovePlayers(L,dt*vis);
}
function fmMoveBall(L,dt){
  const B=L.ball; if(B.v<=0) return;
  if(B.to){ B.tx=B.to.x; B.ty=B.to.y; }
  const dx=B.tx-B.x, dy=B.ty-B.y, dd=Math.hypot(dx,dy), st=B.v*dt;
  if(dd<=st){ B.x=B.tx; B.y=B.ty; B.v=0; if(B.to){ L.holder=B.to; L.side=B.to.s; B.to=null; } }
  else { B.x+=dx/dd*st; B.y+=dy/dd*st; }
}
function fmMovePlayers(L,dt){
  const B=L.ball;
  L.pl.forEach(p=>{
    if(p===L.holder) return;
    const b=fmBasePos(L,p.s,p.i), d=fmDir(L,p.s), att=p.s===L.side;
    let tx, ty;
    if(p.i===0){ tx=b[0]+d*clamp((B.x-b[0])*d*.08,0,9); ty=34+(B.y-34)*.25; }
    else { tx=b[0]+(B.x-52.5)*.36+(att? d*7 : -d*4); ty=b[1]+(B.y-34)*.25+(att?0:(p.i%2?2.5:-2.5));
      const own=d>0?0:105, lim=p.i<=4? 7 : 14; if((tx-own)*d<lim) tx=own+d*lim;
      if(!att){ const near=Math.hypot(p.x-B.x,p.y-B.y); if(near<14 && (p.i===5||p.i===6||p.i===3||p.i===4)){ tx=B.x-d*2; ty=B.y; } } }
    if(B.to===p){ tx=B.tx; ty=B.ty; }
    tx=clamp(tx,3,102); ty=clamp(ty,3,65);
    const dx=tx-p.x, dy=ty-p.y, dd=Math.hypot(dx,dy), st=16*dt;
    if(dd>st){ p.x+=dx/dd*st; p.y+=dy/dd*st; } else { p.x=tx; p.y=ty; }
  });
}
/* dessin */
function fmDraw(L){
  const cv=document.getElementById('fm-cv'); if(!cv) return;
  const W=cv.clientWidth, H=Math.round(W*68/105), dpr=Math.min(2,window.devicePixelRatio||1);
  if(cv.width!==Math.round(W*dpr)){ cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); cv.style.height=H+'px'; }
  const c=cv.getContext('2d'), k=W/105*dpr; c.setTransform(1,0,0,1,0,0);
  for(let i=0;i<10;i++){ c.fillStyle=i%2?'#2f8f4e':'#2a8447'; c.fillRect(i*cv.width/10,0,cv.width/10+1,cv.height); }
  c.setTransform(k,0,0,k,0,0); c.strokeStyle='rgba(255,255,255,.78)'; c.lineWidth=.35;
  c.strokeRect(.5,.5,104,67); c.beginPath(); c.moveTo(52.5,.5); c.lineTo(52.5,67.5); c.stroke();
  c.beginPath(); c.arc(52.5,34,9.15,0,7); c.stroke();
  [[.5,1],[104.5,-1]].forEach(([x,d])=>{ c.strokeRect(d>0?x:x-16.5,13.85,16.5,40.3); c.strokeRect(d>0?x:x-5.5,24.85,5.5,18.3); c.beginPath(); c.arc(x+d*11,34,.4,0,7); c.fillStyle='rgba(255,255,255,.8)'; c.fill();
    c.fillStyle='rgba(255,255,255,.9)'; c.fillRect(d>0?x-1.6:x,30.34,1.6,7.32); });
  /* joueurs */
  L.pl.forEach(p=>{ const kit=L.kits[p.s]; c.beginPath(); c.arc(p.x,p.y,1.55,0,7); c.fillStyle=p.i===0? (p.s?'#f4c430':'#202020') : kit.f; c.fill(); c.lineWidth=.5; c.strokeStyle=p.i===0? '#ffffff' : kit.s; c.stroke(); });
  /* ballon */
  const B=L.ball; c.beginPath(); c.arc(B.x+.25,B.y+.35,.8,0,7); c.fillStyle='rgba(0,0,0,.25)'; c.fill(); c.beginPath(); c.arc(B.x,B.y,.8,0,7); c.fillStyle='#fff'; c.fill(); c.lineWidth=.2; c.strokeStyle='#222'; c.stroke();
  /* porteur du ballon */
  const h=L.holder; if(h && !L.done){ c.font='600 2.6px system-ui,sans-serif'; c.textAlign='center'; const nm=h.n.split(' ').slice(-1)[0]; const tw=c.measureText(nm).width+2; c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(h.x-tw/2,h.y-5.6,tw,3.2); c.fillStyle='#fff'; c.fillText(nm,h.x,h.y-3.2); }
  if(L.flash){ c.fillStyle='rgba(0,0,0,.45)'; c.fillRect(0,26,105,16); c.fillStyle='#fff'; c.font='800 8px system-ui,sans-serif'; c.textAlign='center'; c.fillText(L.flash.t,52.5,37); }
}
function fmScoreNow(L){ const e=L.feed.find(x=>x.sc); return e? e.sc : [0,0]; }
function fmUpdateDom(L){
  const s=fmScoreNow(L), el=document.getElementById('fm-score'), pk=L.feed.find(x=>x.k==='pk'); if(el) el.textContent=s[0]+' - '+s[1]+(pk? ' ('+pk.ps[0]+'-'+pk.ps[1]+')' : '');
  const ck=document.getElementById('fm-clock'); if(ck) ck.textContent= L.done? 'Terminé' : L.t>=L.M.ht&&L.half===1? 'Mi-temps' : footClock(L.M,L.t);
  const fd=document.getElementById('fm-feed'); if(fd && fd.dataset.n!==String(L.feed.length)+L.tab){ fd.dataset.n=String(L.feed.length)+L.tab; fd.innerHTML=fmTabHtml(L); }
}
function fmLoop(ts){
  const L=FOOT_LIVE; if(!L || !ui.modal || ui.modal.type!=='fmatch'){ if(L) L.raf=0; return; }
  const dt=L.lt? Math.min(.1,(ts-L.lt)/1000) : 0; L.lt=ts;
  if(!document.hidden) fmStep(L,dt);
  fmDraw(L); fmUpdateDom(L);
  L.raf=requestAnimationFrame(fmLoop);
}
function fmEnsureLoop(){ const L=FOOT_LIVE; if(L && !L.raf){ L.lt=0; L.raf=requestAnimationFrame(fmLoop); } }
/* panneaux sous le terrain */
function fmStats(L){
  const st={sh:[0,0],on:[0,0],co:[0,0],ye:[0,0],re:[0,0]};
  L.feed.forEach(e=>{ if(e.s===undefined) return; if(e.k==='goal'||e.k==='save'||e.k==='miss'){ st.sh[e.s]++; if(e.k!=='miss') st.on[e.s]++; } if(e.k==='corner') st.co[e.s]++; if(e.k==='yellow') st.ye[e.s]++; if(e.k==='red') st.re[e.s]++; });
  return st;
}
function fmTabHtml(L){
  const M=L.M;
  if(L.tab==='stats'){
    const st=fmStats(L), pos=Math.round(M.poss*100);
    const row=(lab,a,b)=>{ const t=(a+b)||1; return '<div class="fm-st"><b class="num">'+a+'</b><div><span>'+lab+'</span><i><em style="width:'+(a/t*100)+'%"></em></i></div><b class="num">'+b+'</b></div>'; };
    return row('Possession (%)',pos,100-pos)+row('Tirs',st.sh[0],st.sh[1])+row('Tirs cadrés',st.on[0],st.on[1])+row('Corners',st.co[0],st.co[1])+row('Cartons jaunes',st.ye[0],st.ye[1])+row('Cartons rouges',st.re[0],st.re[1]);
  }
  if(L.tab==='xi'){
    const col=s=>'<div><div class="tag">'+esc(footName(s?L.a:L.h))+' · 4-3-3</div>'+M.xi[s].map(p=>'<div class="fm-xi"><span>'+FOOT_POS_S[p.slot]+'</span>'+esc(p.n)+'<small class="num">'+p.o+'</small></div>').join('')+'</div>';
    return '<div class="grid g2">'+col(0)+col(1)+'</div>';
  }
  const imp=L.feed.filter(e=>e.k!=='corner'||L.feed.length<30);
  if(!imp.length) return '<div class="sub">Coup d’envoi.</div>';
  return imp.map(e=>'<div class="fm-ev k-'+e.k+(e.k==='pk'?(e.made?' ok':' ko'):'')+'"><span class="num">'+(e.k==='ft'||e.k==='ht'||e.k==='ft90'||e.k==='eht'||e.k==='ete'?'':e.k==='pk'?'T.a.b.':footEvMin(e))+'</span><p>'+esc(footComment(M,e))+(e.k==='ft'&&L.pen&&!M.ps? ' Qualification aux tirs au but pour '+esc(footName(L.pen))+'.' : '')+'</p></div>').join('');
}
/* V1.9.2 : compétition du match (championnat et journée, coupe et tour, coupe internationale et phase) */
/* le jour enregistré peut être le lendemain du jour du calendrier (le match est traité pendant le passage au jour suivant) */
function fmComp(h,a,day){ return fmComp1(h,a,day)||fmComp1(h,a,day-1)||'Match amical'; }
function fmComp1(h,a,day){ try{
  const nat=footClub(h).nat, lid=footLgOf(h), lg=lid&&S.foot.lg[lid], Lg=FOOT_LEAGUES.find(x=>x.id===lid);
  if(lg&&footLgOf(a)===lid){ const i=(lg.dates||[]).indexOf(day); if(i>=0) return Lg.n+' · journée '+(i+1)+' sur '+lg.dates.length;
    if(lg.po&&(lg.po.dates||[]).includes(day)) return Lg.n+' · barrages'; }
  const C=S.foot.cup&&S.foot.cup[nat]; if(C&&(C.dates||[]).includes(day)){ const i=C.dates.indexOf(day), left=C.P/Math.pow(2,i);
    return 'Coupe nationale · '+(left<=2?'finale':left<=4?'demi-finales':left<=8?'quarts de finale':left<=16?'huitièmes de finale':(i===0?'1er tour':(i+1)+'e tour')); }
  const IC=(S.foot&&S.foot.ic)||{};
  for(const id of Object.keys(IC)){ const E=IC[id]; if(!E||!E.P||!(E.teams||[]).includes(h)) continue;
    const j=((E.P.lp&&E.P.lp.dates)||[]).indexOf(day); if(j>=0) return FI[id].n+' · '+(E.P.lp.k==='swiss'?'phase de ligue':'phase de groupes')+', journée '+(j+1);
    for(const st of (E.P.ko||[])){ const k=(st.d||[]).indexOf(day); if(k>=0) return FI[id].n+' · '+st.n.toLowerCase()+(st.d.length>1?(k?', retour':', aller'):''); } }
  }catch(e){} return null; }
function fmBody(L){
  const M=L.M, s=fmScoreNow(L);
  if(L.comp===undefined){ const c0=fmComp1(L.h,L.a,L.day), c1=c0? null : fmComp1(L.h,L.a,L.day-1); L.comp=c0||c1||'Match amical'; L.cday= c0||!c1? L.day : L.day-1; }
  return '<div class="fm"><div class="fm-comp">'+esc(L.comp)+' · '+esc(dateL(L.cday))+'</div>'+
    '<div class="fm-sb"><div class="t">'+fcrest(L.h,34)+'<b>'+esc(footName(L.h))+'</b></div><div class="c"><b id="fm-score" class="num">'+s[0]+' - '+s[1]+'</b><small id="fm-clock">'+(L.done?'Terminé':footClock(M,L.t))+'</small></div><div class="t">'+fcrest(L.a,34)+'<b>'+esc(footName(L.a))+'</b></div></div>'+
    '<canvas id="fm-cv" aria-label="Terrain : le match en direct" role="img"></canvas>'+
    '<div class="fm-ctl"><div class="seg">'+FM_SPEEDS.map(v=>'<button class="'+(L.speed===v&&L.play?'on':'')+'" data-a="fmspeed" data-v="'+v+'">×'+v+'</button>').join('')+'<button class="'+(!L.play&&!L.done?'on':'')+'" data-a="fmpause">Pause</button></div>'+
    (L.done? '' : btn('Résultat','fmend',{c:'sm ghost'}))+'</div>'+
    '<div class="seg fm-tabs">'+[['feed','Commentaire'],['stats','Statistiques'],['xi','Compositions']].map(([k,t])=>'<button class="'+(L.tab===k?'on':'')+'" data-a="fmtab" data-v="'+k+'">'+t+'</button>').join('')+'</div>'+
    '<div id="fm-feed" class="fm-feed">'+fmTabHtml(L)+'</div></div>';
}
ACT.fmatch=el=>{ footInit(); const V=el.dataset.v.split('-'), [gh,ga,day,pen,eh,ea]=V.map(Number), pk=V[6]&&V[6]!=='x'? V[6] : '', ko= V.length>5&&!isNaN(eh)? {et:[eh,ea],pk} : null; const L=fmStart(+el.dataset.i,+el.dataset.j,gh,ga,day||S.day,pen||null,ko); ui.modal={type:'fmatch',prev:ui.modal&&ui.modal.type!=='fmatch'?ui.modal:null}; render(); };
ACT.fmspeed=el=>{ const L=FOOT_LIVE; if(!L) return; L.speed=+el.dataset.v; if(!L.done) L.play=true; render(); };
ACT.fmpause=()=>{ const L=FOOT_LIVE; if(!L||L.done) return; L.play=!L.play; render(); };
ACT.fmtab=el=>{ const L=FOOT_LIVE; if(!L) return; L.tab=el.dataset.v; render(); };
ACT.fmend=()=>{ const L=FOOT_LIVE; if(!L) return; L.pause=0; L.after=null; L.flash=null; while(L.i<L.M.ev.length){ const e=L.M.ev[L.i++]; L.t=e.t; if(e.k==='ft'){ L.feed.unshift(e); L.done=true; L.play=false; L.flash={t:'Fin du match',until:9e9}; } else { L.feed.unshift(e); if(e.k==='ht') L.half=2; } } L.shoot=false; fmKickoff(L,0); render(); };
{ const _mcM=modalContent; modalContent=function(){ const m=ui.modal; if(m&&m.type==='fmatch'){ if(!FOOT_LIVE){ ui.modal=m.prev||null; return _mcM(); } setTimeout(fmEnsureLoop,0); return {title:'Match',body:fmBody(FOOT_LIVE)}; } return _mcM(); }; }

