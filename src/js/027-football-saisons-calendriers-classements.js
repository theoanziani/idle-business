/* ============================================================
   FOOTBALL : saisons, calendriers, classements, coupes nationales
   Les championnats tournent en arrière-plan dès le début de la partie.
   Calendrier du jeu : 12 mois de 30 jours, le jour 1 est le 1er janvier 2026.
   État : S.foot (créé au premier besoin). Les matchs (calendrier des rencontres)
   sont recalculés à partir de l'ordre des clubs : seul le résultat est sauvegardé.
   ============================================================ */
const FOOT_Y0 = 2026;
const FOOT_MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
/* fenêtres de saison par pays : début et fin (mois, jour), trêve d'hiver, nombre de matchs aller-retour */
const FOOT_CAL = {
  fr:{s:[8,15], e:[5,24], br:[[12,22],[1,3]]},
  es:{s:[8,15], e:[5,30], br:[[12,23],[1,2]]},
  hr:{s:[7,20], e:[5,24], br:[[12,15],[2,1]]},
  us:{s:[8,1],  e:[5,10], br:[[12,15],[2,15]]},
  br:{s:[2,1],  e:[12,5]},
  cn:{s:[3,1],  e:[11,5]},
  en:{s:[8,15], e:[5,24]},
  de:{s:[8,22], e:[5,23], br:[[12,21],[1,9]]}
};
const FOOT_CYCLES = {hr1:4, hr2:3};          /* la Croatie joue 4 fois et 3 fois contre chaque adversaire */
const FOOT_PO = {us1:4, us2:4, us3:4};       /* séries éliminatoires aux États-Unis (qualifiés par groupe) */

/* ---------- Dates ---------- */
const footDoy = (m,d) => (m-1)*30+(d-1);
function footDay(y,m,d){ return (y-FOOT_Y0)*360+footDoy(m,d)+1; }          /* numéro de jour du jeu */
function footDate(day){ const z=day-1, y=FOOT_Y0+Math.floor(z/360), doy=((z%360)+360)%360; return {y, m:Math.floor(doy/30)+1, d:doy%30+1}; }
function footDateLabel(day,o){ const t=footDate(day); return (o&&o.wd? D.DAYS[wdOf(day)].toLowerCase()+' ' : '')+(t.d===1?'1er':t.d)+' '+FOOT_MONTHS[t.m-1]+(o&&o.noY?'':' '+t.y); }
function footSeasonLabel(nat,y){ const c=FOOT_CAL[nat]; return c.e[0]<c.s[0]? y+'-'+(y+1) : String(y); }

/* ---------- Hasard propre au football (ne perturbe pas le reste du jeu) ---------- */
function frnd(){ const F=S.foot; F.rs=(F.rs+0x6D2B79F5)|0; let t=F.rs; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }
function fpois(l){ const L=Math.exp(-l); let k=0, p=1; do{ k++; p*=frnd(); }while(p>L && k<12); return k-1; }
function fshuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(frnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ---------- Initialisation ---------- */
function footInit(){
  if(S.foot && S.foot.v===1){ footMigrate(); return S.foot; }
  S.foot={v:1, rs:(S.rs^0x5f3759df)|0, r:{}, nat:{}, lg:{}, cup:{}, hist:{}, cupHist:{}, fav:null};
  FOOT.clubs.forEach(c=>{ S.foot.r[c.id]=c.r; });
  FOOT_LEAGUES.forEach(L=>{
    const g=[]; FOOT.byLeague[L.id].forEach(c=>{ (g[c.grp]=g[c.grp]||[]).push(c.id); });
    S.foot.lg[L.id]={grp:g.map(x=>fshuffle(x.slice())), rd:0, dates:[], tab:{}, last:null, form:{}, po:null, done:true};
  });
  Object.keys(FOOT_NAT).forEach(n=>footPlan(n, S.day));
  return S.foot;
}
/* V2.1.2 : anciennes parties : ajoute les championnats créés depuis */
function footMigrate(){ const F=S.foot; if(F.mg===2) return; F.mg=2;
  FOOT_LEAGUES.forEach(L=>{ if(F.lg[L.id]) return; const g=[]; FOOT.byLeague[L.id].forEach(c=>{ (g[c.grp]=g[c.grp]||[]).push(c.id); if(F.r[c.id]===undefined) F.r[c.id]=c.r; });
    F.lg[L.id]={grp:g.map(x=>fshuffle(x.slice())), rd:0, dates:[], tab:{}, last:null, form:{}, po:null, done:true}; });
  Object.keys(FOOT_NAT).forEach(n=>{ if(!F.nat[n]) footPlan(n, S.day); }); }
function footR(id){ return (S.foot && S.foot.r[id]) || (footClub(id)||{}).r || 50; }

/* Prépare la prochaine saison d'un pays à partir du jour donné */
function footPlan(nat, fromDay){
  const c=FOOT_CAL[nat], t=footDate(fromDay);
  let y=t.y, start=footDay(y,c.s[0],c.s[1]);
  const endOf = yy => footDay(c.e[0]<c.s[0]? yy+1 : yy, c.e[0], c.e[1]);
  /* saison déjà commencée : on la joue si assez de dates restent, sinon on attend la suivante */
  if(fromDay>start){ const end=endOf(y); if(end-fromDay>=150) start=fromDay+2; else { y++; start=footDay(y,c.s[0],c.s[1]); } }
  else if(start-fromDay>360){ y--; start=footDay(y,c.s[0],c.s[1]); }
  S.foot.nat[nat]={y, start, end:endOf(y), on:false, done:false};
}
function footInBreak(nat,day){
  const b=FOOT_CAL[nat].br; if(!b) return false;
  const doy=(day-1)%360, a=footDoy(b[0][0],b[0][1]), z=footDoy(b[1][0],b[1][1]);
  return a<=z? (doy>=a&&doy<=z) : (doy>=a||doy<=z);
}
/* dates de match : samedis répartis sur la fenêtre, mercredis en renfort si besoin */
function footDates(nat,start,end,R,avoid){
  const sat=[], wed=[];
  for(let d=start; d<=end; d++){ if(footInBreak(nat,d)) continue; const w=wdOf(d); if(w===5) sat.push(d); else if(w===2 && !(avoid&&avoid.has(d))) wed.push(d); }
  const pick=(arr,k)=>{ if(k<=0) return []; if(k>=arr.length) return arr.slice(); const o=[]; for(let i=0;i<k;i++) o.push(arr[Math.round(i*(arr.length-1)/Math.max(1,k-1))]); return [...new Set(o)]; };
  let out=pick(sat,R);
  if(out.length<R) out=out.concat(pick(wed,R-out.length));
  return out.sort((a,b)=>a-b).slice(0,R);
}
/* calendrier des rencontres : méthode du cercle, aller et retour alternés */
const FOOT_FIX={};
function footFixtures(ids,cycles){
  const key=ids.join(',')+'/'+cycles; if(FOOT_FIX[key]) return FOOT_FIX[key];
  const a=ids.slice(); if(a.length%2) a.push(0);
  const n=a.length, base=[];
  for(let r=0;r<n-1;r++){
    const rd=[]; for(let i=0;i<n/2;i++){ const h=a[i], w=a[n-1-i]; if(h&&w) rd.push(r%2? [w,h] : [h,w]); }
    base.push(rd); a.splice(1,0,a.pop());
  }
  const out=[]; for(let c=0;c<cycles;c++) base.forEach(rd=>out.push(c%2? rd.map(([h,w])=>[w,h]) : rd));
  return FOOT_FIX[key]=out;
}
const footCycles = id => FOOT_CYCLES[id]||2;
function footRounds(lid){ const L=S.foot.lg[lid]; return Math.max(...L.grp.map(g=>footFixtures(g,footCycles(lid)).length)); }

/* ---------- Démarrage d'une saison ---------- */
function footStartSeason(nat){
  const N=S.foot.nat[nat]; N.on=true; N.done=false;
  const cupDates=footCupPlan(nat);
  FOOT_LEAGUES.filter(L=>L.nat===nat).forEach(L=>{
    const lg=S.foot.lg[L.id];
    lg.grp=lg.grp.map(g=>fshuffle(g.slice()));
    lg.rd=0; lg.tab={}; lg.form={}; lg.last=null; lg.po=null; lg.done=false;
    lg.grp.flat().forEach(id=>{ lg.tab[id]=[0,0,0,0,0,0,0]; lg.form[id]=''; });
    const endReg = FOOT_PO[L.id]? N.end-24 : N.end;
    lg.dates=footDates(nat,N.start,endReg,footRounds(L.id),cupDates);
  });
  log('info','Football : la saison '+footSeasonLabel(nat,N.y)+' commence '+FOOT_NAT[nat].in+'.','news');
}

/* ---------- Résultat d'un match ---------- */
function footPlay(h,a,neutral){
  const rh=footR(h), ra=footR(a), k=1/27, adv=neutral?0:.15;
  const gh=fpois(1.30*Math.exp(k*(rh-ra)+adv)), ga=fpois(1.10*Math.exp(k*(ra-rh)-(neutral?0:.04)));
  return [gh,ga];
}
function footRecord(lg,h,a,gh,ga){
  const T=lg.tab, th=T[h], ta=T[a]; if(!th||!ta) return;
  th[0]++; ta[0]++; th[4]+=gh; th[5]+=ga; ta[4]+=ga; ta[5]+=gh;
  const f=(id,r)=>{ lg.form[id]=((lg.form[id]||'')+r).slice(-5); };
  if(gh>ga){ th[1]++; ta[3]++; th[6]+=3; f(h,'V'); f(a,'D'); }
  else if(gh<ga){ ta[1]++; th[3]++; ta[6]+=3; f(a,'V'); f(h,'D'); }
  else { th[2]++; ta[2]++; th[6]++; ta[6]++; f(h,'N'); f(a,'N'); }
}
/* classement d'un groupe : points, différence, buts marqués */
function footTable(lid,gi){
  const lg=S.foot.lg[lid], ids=lg.grp[gi||0]||[];
  return ids.map(id=>({id, t:lg.tab[id]||[0,0,0,0,0,0,0]})).sort((x,y)=>(y.t[6]-x.t[6])||((y.t[4]-y.t[5])-(x.t[4]-x.t[5]))||(y.t[4]-x.t[4])||(footR(y.id)-footR(x.id)));
}

/* ---------- Journées de championnat ---------- */
function footLeagueDay(lid,day){
  const lg=S.foot.lg[lid]; if(lg.done) return;
  if(lg.rd<lg.dates.length && lg.dates[lg.rd]===day){
    const res=[];
    lg.grp.forEach((g,gi)=>{ const fx=footFixtures(g,footCycles(lid))[lg.rd]; if(!fx) return;
      fx.forEach(([h,a])=>{ const [gh,ga]=footPlay(h,a); footRecord(lg,h,a,gh,ga); res.push([h,a,gh,ga,gi]); }); });
    lg.last={rd:lg.rd+1, day, res}; lg.rd++;
    if(lg.rd>=lg.dates.length){ if(FOOT_PO[lid]) footPoStart(lid,day); else lg.done=true; }
    footNotifyFav(lid,res);
    return;
  }
  if(lg.po && lg.po.dates[lg.po.ri]===day) footPoDay(lid,day);
}
/* séries éliminatoires (États-Unis) : quarts de conférence, finales de conférence, finale */
function footPoStart(lid,day){
  const lg=S.foot.lg[lid], n=FOOT_PO[lid], seeds=lg.grp.map((g,gi)=>footTable(lid,gi).slice(0,n).map(x=>x.id));
  const ties=[]; seeds.forEach(s=>{ for(let i=0;i<s.length/2;i++) ties.push([s[i],s[s.length-1-i]]); });
  const dates=[]; let d=day+3; while(dates.length<4){ if(wdOf(d)===5) dates.push(d); d++; }
  lg.po={ri:0, dates, ties, last:null, champ:null};
}
/* V2.5.5 : match à élimination directe : prolongation (2 × 15 min) puis tirs au but tirés un par un.
   Résultat : gh, ga après prolongation ; et = buts de la prolongation ; pk = suite des tirs ('1' marqué, '0' manqué,
   l'équipe à domicile tire en premier) ; ps = score des tirs au but. Champs absents = pas de prolongation. */
function footET(h,a,neutral){ const rh=footR(h), ra=footR(a), k=1/27, adv=neutral?0:.15; return [fpois(1.30*Math.exp(k*(rh-ra)+adv)/3), fpois(1.10*Math.exp(k*(ra-rh)-(neutral?0:.04))/3)]; }
function footShootout(h,a){ const d=(footR(h)-footR(a))/400, P=[clamp(.76+d,.6,.9),clamp(.76-d,.6,.9)], s=[0,0], n=[0,0]; let pk='';
  for(let r=0;r<40;r++){ for(const t of [0,1]){ const g=frnd()<P[t]?1:0; s[t]+=g; n[t]++; pk+=g;
      if(r<5&&(s[0]+5-n[0]<s[1]||s[1]+5-n[1]<s[0])) return {w:s[0]>s[1]?h:a, pk, ps:s}; }
    if(r>=4&&s[0]!==s[1]) return {w:s[0]>s[1]?h:a, pk, ps:s}; }
  return {w:h, pk, ps:s}; }
/* prolongation et tirs au but après un score nul ; complète r et le match de votre club */
function footExtra(r,neutral){ if(r.gh!==r.ga) return r; r.et=footET(r.h,r.a,neutral); r.gh+=r.et[0]; r.ga+=r.et[1];
  if(r.gh===r.ga){ const T=footShootout(r.h,r.a); r.pen=T.w; r.pk=T.pk; r.ps=T.ps; }
  r.w= r.gh>r.ga? r.h : r.ga>r.gh? r.a : r.pen; footKOOwn(r); return r; }
/* match de votre club regardé en direct : on lui transmet la prolongation et les tirs au but */
function footKOOwn(r){ try{ const O=typeof fcOwn==='function'&&fcOwn(); if(!r.et||!O||!O.last||O.last.h!==r.h||O.last.a!==r.a||O.last.day!==S.day) return; const ko={et:r.et,pk:r.pk||''}; O.last.ko=ko;
  if(O.live&&O.live.h===r.h&&O.live.a===r.a){ O.live.ko=ko; O.live.gh=r.gh; O.live.ga=r.ga; O.live.pen=r.pen||null; } }catch(e){} }
function footKO(h,a,neutral){ const [gh,ga]=footPlay(h,a,neutral); return footExtra({h,a,gh,ga,pen:null,w:gh>ga?h:ga>gh?a:null},neutral); }
function footPoDay(lid,day){
  const lg=S.foot.lg[lid], P=lg.po, res=P.ties.map(([h,a])=>footKO(h,a)); P.last=res; P.ri++;
  const win=res.map(r=>r.w);
  if(win.length===1){ P.champ=win[0]; P.ties=[]; lg.done=true; return; }
  const nx=[]; for(let i=0;i<win.length;i+=2) nx.push(footR(win[i])>=footR(win[i+1])? [win[i],win[i+1]] : [win[i+1],win[i]]);
  P.ties=nx;
}

/* ---------- Coupe nationale ---------- */
function footCupPlan(nat){
  const N=S.foot.nat[nat], ids=[]; FOOT_LEAGUES.filter(L=>L.nat===nat).forEach(L=>S.foot.lg[L.id].grp.forEach(g=>g.forEach(id=>ids.push(id))));
  let P=1; while(P<ids.length) P*=2;
  const R=Math.log2(P), wed=[]; for(let d=N.start+21; d<=N.end-10; d++){ if(wdOf(d)===2 && !footInBreak(nat,d)) wed.push(d); }
  const dates=[]; for(let i=0;i<R;i++) dates.push(wed[Math.round(i*(wed.length-1)/Math.max(1,R-1))]);
  const lvl=id=>FOOT_LEAGUES.find(L=>L.id===footLgOf(id)).lvl;
  const order=ids.slice().sort((a,b)=>(lvl(a)-lvl(b))||(footR(b)-footR(a)));
  const byes=P-ids.length, first=order.slice(byes);           /* les meilleurs entrent au 2e tour */
  S.foot.cup[nat]={ri:0, dates, P, R, byes:order.slice(0,byes), alive:fshuffle(first.slice()), last:null, champ:null};
  return new Set(dates);
}
function footLgOf(id){ const F=S.foot; for(const k in F.lg){ if(F.lg[k].grp.some(g=>g.includes(id))) return k; } return (footClub(id)||{}).lg; }
function footCupRoundName(C,i){ const left=C.P/Math.pow(2,i); return left===2?'Finale':left===4?'Demi-finales':left===8?'Quarts de finale':left===16?'Huitièmes de finale':(i===0?'1er tour':(i+1)+'e tour'); }
function footCupDay(nat,day){
  const C=S.foot.cup[nat]; if(!C||C.champ||C.dates[C.ri]!==day) return;
  let pool=C.alive; if(C.ri===1 && C.byes.length){ pool=fshuffle(pool.concat(C.byes)); C.byes=[]; }
  const lvl=id=>FOOT_LEAGUES.find(L=>L.id===footLgOf(id)).lvl, res=[];
  for(let i=0;i+1<pool.length;i+=2){ let h=pool[i], a=pool[i+1]; if(lvl(a)>lvl(h)) [h,a]=[a,h]; res.push(footKO(h,a)); }
  C.last={name:footCupRoundName(C,C.ri), day, res}; C.ri++;
  C.alive=fshuffle(res.map(r=>r.w));
  if(C.alive.length===1){ C.champ=C.alive[0]; (S.foot.cupHist[nat]=S.foot.cupHist[nat]||[]).unshift({y:S.foot.nat[nat].y, champ:C.champ});
    if(typeof troAdd==='function'&&typeof fcOwn==='function'&&fcOwn()&&fcOwn().id===C.champ) troAdd('cup','Coupe nationale',footSeasonLabel(nat,S.foot.nat[nat].y)); }
  else if(C.ri===1 && C.byes.length) { /* le tour suivant accueille les exemptés */ }
  if(S.foot.fav && res.some(r=>r.h===S.foot.fav||r.a===S.foot.fav)){ const r=res.find(r=>r.h===S.foot.fav||r.a===S.foot.fav); log(r.w===S.foot.fav?'good':'info','Coupe : '+footScore(r)+'.','news'); }
}

/* ---------- Fin de saison : palmarès, montées, descentes, évolution des clubs ---------- */
function footEndSeason(nat){
  const N=S.foot.nat[nat], Ls=FOOT_LEAGUES.filter(L=>L.nat===nat).sort((a,b)=>a.lvl-b.lvl);
  const moves=[];  /* [id, de, vers] */
  Ls.forEach(L=>{
    const lg=S.foot.lg[L.id], tabs=lg.grp.map((g,gi)=>footTable(L.id,gi));
    const champ= lg.po&&lg.po.champ ? lg.po.champ : tabs[0][0].id;
    lg.prev={y:N.y, tabs:tabs.map(tt=>tt.map(x=>[x.id].concat(x.t))), po:lg.po&&lg.po.champ? lg.po.champ : null};
    (S.foot.hist[L.id]=S.foot.hist[L.id]||[]).unshift({y:N.y, champ, first:tabs.map(t=>t[0].id)});
    if(S.foot.hist[L.id].length>30) S.foot.hist[L.id].pop();
    const below=Ls.find(x=>x.lvl===L.lvl+1), above=Ls.find(x=>x.lvl===L.lvl-1);
    if(L.down && below && !FOOT_NAT[nat].closed){ const all=footTable(L.id,0); all.slice(-L.down).forEach(x=>moves.push([x.id,L.id,below.id])); }
    if(L.up && above && !FOOT_NAT[nat].closed){
      if(lg.grp.length>1){ const per=Math.ceil(L.up/lg.grp.length); tabs.forEach(t=>t.slice(0,per).forEach(x=>moves.push([x.id,L.id,above.id]))); }
      else tabs[0].slice(0,L.up).forEach(x=>moves.push([x.id,L.id,above.id]));
    }
    /* évolution des notes : progression ou recul selon la saison, retour vers la moyenne */
    const ids=lg.grp.flat(), mean=ids.reduce((s,id)=>s+footR(id),0)/ids.length;
    tabs.forEach(t=>t.forEach((x,i)=>{ const q=t.length>1? 1-2*i/(t.length-1) : 0; S.foot.r[x.id]=Math.round(clamp(footR(x.id)+q*1.2+(frnd()-.5)*2.2+(mean-footR(x.id))*.06,30,95)*10)/10; }));
  });
  moves.forEach(([id,from,to])=>{
    const f=S.foot.lg[from], t=S.foot.lg[to];
    f.grp.forEach(g=>{ const i=g.indexOf(id); if(i>=0) g.splice(i,1); });
    let gi=0; t.grp.forEach((g,i)=>{ if(g.length<t.grp[gi].length) gi=i; }); t.grp[gi].push(id);
    const up=FOOT_LEAGUES.find(L=>L.id===to).lvl<FOOT_LEAGUES.find(L=>L.id===from).lvl;
    S.foot.r[id]=Math.round(clamp(footR(id)+(up?1.5:-1.5),30,95)*10)/10;
  });
  N.on=false; N.done=true; N.moves=moves;
  const top=FOOT_LEAGUES.find(L=>L.nat===nat&&L.lvl===1), ch=S.foot.hist[top.id][0].champ;
  log('good','Football : '+footName(ch)+' remporte le titre en '+top.n+' ('+FOOT_NAT[nat].n+', '+footSeasonLabel(nat,N.y)+').','news');
  footPlan(nat, N.end+1);
}

/* ---------- Pas quotidien ---------- */
function footStep(day){
  footInit();
  Object.keys(FOOT_NAT).forEach(nat=>{
    const N=S.foot.nat[nat];
    if(!N.on && !N.done && day>=N.start) footStartSeason(nat);
    if(!N.on) return;
    FOOT_LEAGUES.forEach(L=>{ if(L.nat===nat) footLeagueDay(L.id,day); });
    footCupDay(nat,day);
    const all=FOOT_LEAGUES.filter(L=>L.nat===nat).every(L=>S.foot.lg[L.id].done), C=S.foot.cup[nat];
    if(all && (!C||C.champ||C.ri>=C.dates.length) && day>=Math.min(N.end, day)) footEndSeason(nat);
  });
}
{ const _nd=nextDay; nextDay=function(){ const d=S.day, ok=_nd(); if(ok){ try{ footStep(d); }catch(e){ console.error(e); } } return ok; }; }

/* ---------- Aides d'affichage ---------- */
function footName(id){ const c=footClub(id); return c? c.n : '?'; }
function footScore(r){ const h=r.h??r[0], a=r.a??r[1], gh=r.gh??r[2], ga=r.ga??r[3]; return footName(h)+' '+gh+'-'+ga+' '+footName(a)+(r.ps? ' (a.p., '+footName(r.pen)+' aux tirs au but '+r.ps[0]+'-'+r.ps[1]+')' : r.pen? ' (t.a.b., '+footName(r.pen)+')' : r.et? ' (a.p.)' : ''); }
function footNotifyFav(lid,res){
  const f=S.foot.fav; if(!f) return; const r=res.find(x=>x[0]===f||x[1]===f); if(!r) return;
  const win=(r[0]===f&&r[2]>r[3])||(r[1]===f&&r[3]>r[2]);
  log(win?'good':'info','Football : '+footScore(r)+'.','news');
}
/* position et zone d'un club dans son championnat */
function footZone(lid,gi,pos,n){
  const L=FOOT_LEAGUES.find(x=>x.id===lid), nat=FOOT_NAT[L.nat], ng=S.foot.lg[lid].grp.length;
  if(FOOT_PO[lid] && pos<FOOT_PO[lid]) return 'po';
  if(!nat.closed){
    if(L.up && pos<Math.ceil(L.up/ng)) return 'up';
    if(L.down && ng===1 && pos>=n-L.down) return 'down';
  }
  if(L.lvl===1 && pos===0) return 'top';
  return '';
}

