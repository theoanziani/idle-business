/* ============================================================
   FOOTBALL : scénario d'un match
   À partir du score final (déjà joué par le moteur des championnats), on reconstitue
   toujours le même déroulé : minutes des buts, buteurs et passeurs, tirs, arrêts,
   corners, cartons, remplacements, possession. Rien n'est sauvegardé.
   ============================================================ */
const FOOT_SCORE_W = {BU:5, AIL:3, MO:2.6, MC:1.2, MD:.6, DC:.55, DL:.45, G:0};
function footPickW(R,list,wf){ let t=0; list.forEach(p=>t+=wf(p)); let x=R()*t; for(const p of list){ x-=wf(p); if(x<=0) return p; } return list[list.length-1]; }

function footMatchScript(h,a,gh,ga,seed,ko){
  const R=footSeedRng((seed>>>0)^(h*131+a*7919)), rh=footR(h), ra=footR(a);
  const X=[footXI(h),footXI(a)], ev=[];
  const poss=clamp(.5+(rh-ra)/110+.03+(R()-.5)*.08,.3,.72);
  const goals=[gh,ga], shots=[0,0], on=[0,0], corners=[0,0], cards=[[],[]];
  const st1=1+Math.floor(R()*4), st2=2+Math.floor(R()*5), HT=(45+st1)*60, END=HT+(45+st2)*60;
  const minute=()=>{ const m=1+Math.floor(R()*90); let x=0; if(m===45&&R()<.5) x=1+Math.floor(R()*st1); if(m===90&&R()<.6) x=1+Math.floor(R()*st2); return {m,x}; };
  const ts=o=>(o.m<=45? (o.m-1)*60 : HT+(o.m-46)*60)+o.x*60+Math.floor(R()*55);
  [0,1].forEach(s=>{
    const xi=X[s].xi, sh=(s?1-poss:poss);
    for(let g=0;g<goals[s];g++){
      const mm=minute(), sc=footPickW(R,xi,p=>FOOT_SCORE_W[p.slot]||.4);
      const as= R()<.72? footPickW(R,xi.filter(p=>p!==sc&&p.slot!=='G'),p=>p.slot==='AIL'||p.slot==='MO'?3:p.slot==='MC'?2:1) : null;
      const kind= R()<.11? 'pen' : R()<.16? 'head' : 'shot';
      ev.push({t:ts(mm), m:mm.m, x:mm.x, k:'goal', s, p:sc.n, as:as&&as.n, kind}); shots[s]++; on[s]++;
    }
    /* autres tirs */
    const extra=Math.max(0,Math.round(4+sh*14+(R()-.5)*5-goals[s]));
    for(let i=0;i<extra;i++){
      const mm=minute(), sc=footPickW(R,xi,p=>(FOOT_SCORE_W[p.slot]||.4)+.3), cadre=R()<.38;
      ev.push({t:ts(mm), m:mm.m, x:mm.x, k:cadre?'save':'miss', s, p:sc.n, gk:X[1-s].xi[0].n}); shots[s]++; if(cadre) on[s]++;
    }
    const nc=Math.max(0,Math.round(2+sh*7+(R()-.5)*4));
    for(let i=0;i<nc;i++){ const mm=minute(); ev.push({t:ts(mm), m:mm.m, x:mm.x, k:'corner', s}); corners[s]++; }
    const ny=Math.min(5,Math.floor(-Math.log(1-R()*.97)*1.6));
    for(let i=0;i<ny;i++){ const mm=minute(), p=footPickW(R,xi,q=>q.slot==='G'?.1:q.slot==='DC'||q.slot==='MD'?2:1); if(cards[s].includes(p.n)) continue; cards[s].push(p.n); ev.push({t:ts(mm), m:mm.m, x:mm.x, k:'yellow', s, p:p.n}); }
    if(R()<.06){ const mm=minute(), p=footPickW(R,xi,q=>q.slot==='G'?.05:1); ev.push({t:ts(mm), m:mm.m, x:mm.x, k:'red', s, p:p.n}); }
    /* remplacements */
    const subs=X[s].bench.filter(p=>p.p!=='G'), out=xi.filter(p=>p.slot!=='G').slice().sort(()=>R()-.5), nsub=3+Math.floor(R()*3);
    for(let i=0;i<Math.min(nsub,subs.length);i++){ const m=56+Math.floor(R()*32); const inP=subs.find(q=>q.p===out[i].slot)||subs[i]; ev.push({t:ts({m,x:0}), m, x:0, k:'sub', s, p:inP.n, o:out[i].n}); }
  });
  ev.push({t:HT, m:45, x:st1, k:'ht'});
  /* V2.5.5 : prolongation (91e à 120e) puis tirs au but */
  let EE=0, PKS=0, ps=null;
  if(ko&&ko.et){ const EH=END+15*60; EE=EH+15*60; ev.push({t:END, m:90, x:st2, k:'ft90'}, {t:EH, m:105, x:0, k:'eht'});
    const tE=m=>END+(m-91)*60+Math.floor(R()*55);
    [0,1].forEach(s=>{ const xi=X[s].xi, sh=(s?1-poss:poss);
      for(let g=0;g<ko.et[s];g++){ const m=91+Math.floor(R()*30), sc=footPickW(R,xi,p=>FOOT_SCORE_W[p.slot]||.4), as=R()<.7? footPickW(R,xi.filter(p=>p!==sc&&p.slot!=='G'),p=>p.slot==='AIL'||p.slot==='MO'?3:1) : null;
        ev.push({t:tE(m), m, x:0, k:'goal', s, p:sc.n, as:as&&as.n, kind:R()<.15?'head':'shot'}); }
      const n=1+Math.floor(R()*(2+sh*3)); for(let i=0;i<n;i++){ const m=91+Math.floor(R()*30), sc=footPickW(R,xi,p=>(FOOT_SCORE_W[p.slot]||.4)+.3); ev.push({t:tE(m), m, x:0, k:R()<.38?'save':'miss', s, p:sc.n, gk:X[1-s].xi[0].n}); } });
    if(ko.pk){ ev.push({t:EE, m:120, x:0, k:'ete'}); PKS=EE+60; ps=[0,0];
      const order=X.map(x=>x.xi.filter(p=>p.slot!=='G').slice().sort((p,q)=>(FOOT_SCORE_W[q.slot]||.4)-(FOOT_SCORE_W[p.slot]||.4)));
      ko.pk.split('').forEach((c,i)=>{ const s=i%2, k=Math.floor(i/2), p=order[s][k%order[s].length], made=c==='1'; if(made) ps[s]++;
        ev.push({t:PKS+i*45, m:120, x:0, k:'pk', s, p:p.n, gk:X[1-s].xi[0].n, made, ps:ps.slice(), n:k+1}); });
      ev.push({t:PKS+ko.pk.length*45+20, m:120, x:0, k:'ft'}); }
    else ev.push({t:EE, m:120, x:0, k:'ft'}); }
  else ev.push({t:END, m:90, x:st2, k:'ft'});
  ev.sort((x,y)=>x.t-y.t);
  /* score courant */
  let sc=[0,0]; ev.forEach(e=>{ if(e.k==='goal') sc[e.s]++; e.sc=sc.slice(); });
  return {h, a, gh, ga, ev, poss, ee:EE, pks:PKS, ps, shots, on, corners, yellow:[0,1].map(s=>ev.filter(e=>e.k==='yellow'&&e.s===s).length), red:[0,1].map(s=>ev.filter(e=>e.k==='red'&&e.s===s).length), xi:X.map(x=>x.xi), ht:HT, end:END};
}
/* minute affichée pour un temps de jeu (secondes) */
function footClock(M,t){
  if(M.ee&&t>=M.end){ if(M.pks&&t>=M.pks-30) return 'Tirs au but'; return Math.min(120,91+Math.floor((t-M.end)/60))+'’'; }
  if(t<M.ht){ const m=Math.floor(t/60)+1; return m<=45? m+'’' : '45+'+(m-45)+'’'; }
  const m=46+Math.floor((t-M.ht)/60); return m<=90? m+'’' : '90+'+(m-90)+'’';
}
const footEvMin = e => e.x? (e.m<=45?'45':'90')+'+'+e.x+'’' : e.m+'’';
/* commentaire d'un événement */
function footComment(M,e){
  const T=[footName(M.h),footName(M.a)], R=footSeedRng(e.t*31+e.s), pick=a=>a[Math.floor(R()*a.length)], tm=T[e.s];
  switch(e.k){
    case 'goal': return (e.kind==='pen'? 'But sur penalty de '+e.p+' ('+tm+'). ' : e.kind==='head'? pick(['But de la tête de ','Tête imparable de '])+e.p+' ('+tm+')'+(e.as?' sur un centre de '+e.as:'')+'. ' : pick(['But de ','Frappe victorieuse de ','Quel but de '])+e.p+' ('+tm+')'+(e.as?', servi par '+e.as:'')+'. ')+e.sc[0]+'-'+e.sc[1]+'.';
    case 'save': return pick(['Arrêt de '+e.gk+' devant '+e.p+'.','Tir cadré de '+e.p+', '+e.gk+' s’interpose.','Parade de '+e.gk+' sur la frappe de '+e.p+'.']);
    case 'miss': return pick(['Frappe de '+e.p+' au-dessus.','Tir de '+e.p+' à côté.',e.p+' tente sa chance, c’est trop croisé.','Occasion pour '+tm+', '+e.p+' manque le cadre.']);
    case 'corner': return 'Corner pour '+tm+'.';
    case 'yellow': return 'Carton jaune pour '+e.p+' ('+tm+').';
    case 'red': return 'Carton rouge ! '+e.p+' ('+tm+') est exclu.';
    case 'sub': return 'Changement pour '+tm+' : '+e.p+' remplace '+e.o+'.';
    case 'ht': return 'Mi-temps : '+e.sc[0]+'-'+e.sc[1]+'.';
    case 'ft': return 'Fin du match : '+T[0]+' '+e.sc[0]+'-'+e.sc[1]+' '+T[1]+(M.ps? ', '+T[M.ps[0]>M.ps[1]?0:1]+' l’emporte aux tirs au but ('+M.ps[0]+'-'+M.ps[1]+').' : M.ee? ' après prolongation.' : '.');
    case 'ft90': return 'Fin du temps réglementaire : '+e.sc[0]+'-'+e.sc[1]+'. Place à la prolongation.';
    case 'eht': return 'Mi-temps de la prolongation : '+e.sc[0]+'-'+e.sc[1]+'.';
    case 'ete': return 'Fin de la prolongation : '+e.sc[0]+'-'+e.sc[1]+'. Tirs au but.';
    case 'pk': return 'Tir au but n° '+e.n+' pour '+tm+' : '+(e.made? e.p+' marque' : pick([e.gk+' arrête la tentative de '+e.p,e.p+' manque le cadre',e.p+' trouve le poteau']))+'. Tirs au but : '+e.ps[0]+'-'+e.ps[1]+'.';
  }
  return '';
}

