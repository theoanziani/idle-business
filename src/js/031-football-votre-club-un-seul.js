/* ============================================================
   FOOTBALL : votre club (un seul)
   Rachat, effectif sauvegardé, salaires, recettes (billetterie, droits TV, sponsors,
   primes), composition et tactique, staff, moral, blessures, mercato (fenêtres de
   transferts), vente du club. L'argent passe par la trésorerie du joueur (source 'foot').
   État : S.foot.own (null tant qu'aucun club n'est acheté).
   ============================================================ */
const FC_FORM = {
  '4-3-3':  ['G','DL','DL','DC','DC','MD','MC','MO','AIL','AIL','BU'],
  '4-4-2':  ['G','DL','DL','DC','DC','MD','MC','AIL','AIL','BU','BU'],
  '4-2-3-1':['G','DL','DL','DC','DC','MD','MD','MO','AIL','AIL','BU'],
  '3-5-2':  ['G','DL','DL','DC','DC','DC','MD','MC','MO','BU','BU'],
  '5-3-2':  ['G','DL','DL','DC','DC','DC','MD','MC','MC','BU','BU']
};
/* positions sur le terrain (équipe qui attaque vers la droite), dans l'ordre des postes ci-dessus */
const FC_FORM_POS = {
  '4-3-3':  [[4,34],[30,9],[30,59],[23,26],[23,42],[40,34],[50,22],[52,46],[70,11],[70,57],[79,34]],
  '4-4-2':  [[4,34],[30,9],[30,59],[23,26],[23,42],[42,28],[44,42],[58,10],[58,58],[74,28],[74,40]],
  '4-2-3-1':[[4,34],[30,9],[30,59],[23,26],[23,42],[38,27],[38,41],[58,34],[64,11],[64,57],[79,34]],
  '3-5-2':  [[4,34],[46,8],[46,60],[22,22],[20,34],[22,46],[38,34],[50,25],[56,44],[74,28],[74,40]],
  '5-3-2':  [[4,34],[32,7],[32,61],[21,22],[19,34],[21,46],[40,34],[48,23],[48,45],[72,28],[72,40]]
};
const FC_STYLE = {def:{n:'Défensif', f:.86, a:.84}, eq:{n:'Équilibré', f:1, a:1}, att:{n:'Offensif', f:1.13, a:1.12}};
const FC_STAFF = {
  coach:{n:'Entraîneur', d:'Rend l’équipe plus forte (+0,8 de force par étoile).'},
  phys:{n:'Préparateur physique', d:'Moins de blessures et retours plus rapides.'},
  scout:{n:'Recruteur', d:'Joueurs plus faciles à convaincre et transferts moins chers.'},
  youth:{n:'Formateur', d:'Jeunes du centre de formation plus doués, progression plus rapide.'}
};
const FC_TV = {fr:[25e6,5e6,1e6], es:[60e6,7e6,.9e6], hr:[2e6,.4e6,.08e6], us:[12e6,1.5e6,.3e6], br:[25e6,4e6,.8e6], cn:[7e6,1.2e6,.25e6]};

/* ---------- Valeurs ---------- */
function fcPlayerValue(p){ const af= p.a<=23? 1.4 : p.a<=28? 1.1 : p.a<=31? .8 : p.a<=33? .45 : .25; return Math.round(1.2e6*Math.exp((p.o-65)/6)*af/1e4)*1e4; }
function fcPlayerWage(p){ return Math.round((fcPlayerValue(p)*.3+6e4)/1e3)*1e3; }      /* par saison */
function fcClubValue(id){ const c=footClub(id), O=fcOwn(), r= O&&O.id===id? O.r0+.5*(fcXiAvg()-O.xi0) : footR(id); return Math.round((6e6*Math.exp((r-45)/8.5)+(O&&O.id===id? fcCap(O) : c.cap)*600)/1e5)*1e5; }
const fcOwn = () => (S && S.foot && S.foot.own) || null;
const fcIsOwn = id => !!(S && S.foot && S.foot.own && S.foot.own.id===id);

/* ---------- Joueurs transférés : les effectifs des autres clubs en tiennent compte ---------- */
{ const _sq=footSquad; footSquad=function(id){
    const F=S.foot; if(F && F.own && F.own.id===id) return F.own.sq;
    let sq=_sq(id);
    if(F && (F.out || F.extra)){ const out=F.out||{}, ex=(F.extra&&F.extra[id])||[]; if(ex.length || sq.some(p=>out[p.id])) sq=sq.filter(p=>!out[p.id]).concat(ex); }
    return sq;
  }; }
{ const _xi=footXI; footXI=function(id){ if(fcIsOwn(id)) return fcLineup(); return _xi(id); }; }
/* force de votre équipe : note du onze + entraîneur + moral + équilibre des postes */
{ const _r=footR; footR=function(id){ if(fcIsOwn(id)) return fcStrength(); return _r(id); }; }

/* ---------- Rachat ---------- */
function fcBuyPrice(id){ return Math.round(fcClubValue(id)*1.08/1e5)*1e5; }
function fcBuy(id){
  footInit(); const F=S.foot, c=footClub(id);
  if(!c || c.foreign) return err('Ce club ne peut pas être racheté.');
  if(F.own) return err('Vous possédez déjà un club. Revendez-le d’abord.');
  const price=fcBuyPrice(id); if(S.cash<price) return err('Il faut '+eur(price,0)+' de trésorerie pour racheter ce club.');
  const r0=Math.round(F.r[id]||c.r), base=footSquad(id).map((p,i)=>Object.assign({},p,{id:'o'+id+'_'+i, oid:p.id, w:0, inj:0})).map(p=>{ p.w=fcPlayerWage(p); return p; });
  F.own={id, day:S.day, price, r0, sq:base, form:'4-3-3', style:'eq', auto:true, xi:null, mor:60, staff:{coach:2,phys:1,scout:1,youth:1}, list:{}, offers:[], news:[], ticket:1, seasons:0, autoLive:true, live:null, fin:{}};
  F.own.xi0=fcXiAvg(); F.own.orig=base.map(p=>p.oid);
  payCap('foot','Rachat du club : '+c.n,-price);
  log('good','Vous êtes le nouveau propriétaire de '+c.n+'.');
  return ok('Bienvenue au '+c.n+' !');
}
function fcSell(){
  const O=fcOwn(); if(!O) return err('Aucun club à vendre.');
  const v=Math.round(fcClubValue(O.id)*.92/1e5)*1e5, n=footName(O.id);
  /* les joueurs repartent dans l'effectif du club, qui redevient géré par le jeu */
  S.foot.r[O.id]=Math.round(fcStrength()*10)/10;
  const F=S.foot; F.out=F.out||{}; F.extra=F.extra||{};
  const kept=new Set(O.sq.filter(p=>p.oid!==undefined).map(p=>p.oid));
  (O.orig||[]).forEach(oid=>{ if(!kept.has(oid)) F.out[oid]=1; });
  F.extra[O.id]=O.sq.filter(p=>p.oid===undefined).map(p=>Object.assign({},p,{club:O.id}));
  S.foot.own=null; payCap('foot','Vente du club : '+n,v);
  log('info','Vous avez revendu '+n+' pour '+eur(v,0)+'.');
  return ok(n+' est vendu pour '+eur(v,0)+'.');
}

/* ---------- Composition ---------- */
function fcAvail(p){ return !(p.inj>0); }
function fcAutoXI(O){
  const slots=FC_FORM[O.form], sq=O.sq.filter(fcAvail).slice().sort((a,b)=>b.o-a.o), taken=new Set(), xi=[];
  slots.forEach(pos=>{ let pl=null; for(const alt of FOOT_NEAR[pos]){ pl=sq.find(p=>p.p===alt&&!taken.has(p.id)); if(pl) break; } if(!pl) pl=sq.find(p=>!taken.has(p.id)); if(pl){ taken.add(pl.id); xi.push(pl.id); } });
  return xi;
}
function fcLineup(){
  const O=fcOwn(); if(!O) return {xi:[],bench:[]};
  let ids=O.auto||!O.xi? fcAutoXI(O) : O.xi.filter(id=>{ const p=O.sq.find(q=>q.id===id); return p&&fcAvail(p); });
  if(ids.length<11){ const fill=fcAutoXI(O).filter(id=>!ids.includes(id)); ids=ids.concat(fill).slice(0,11); }
  const slots=FC_FORM[O.form];
  const xi=ids.map((id,i)=>Object.assign({},O.sq.find(p=>p.id===id),{slot:slots[i]}));
  return {xi, bench:O.sq.filter(p=>!ids.includes(p.id))};
}
function fcFitPenalty(xi){ let pen=0; xi.forEach(p=>{ if(p.slot===p.p) return; const near=FOOT_NEAR[p.slot]; pen+= near.includes(p.p)? (near.indexOf(p.p)===1? 1 : 2) : (p.slot==='G'||p.p==='G'? 12 : 4); }); return pen/11; }
function fcXiAvg(){ const L=fcLineup(); if(!L.xi.length) return 50; return L.xi.reduce((s,p)=>s+p.o,0)/L.xi.length - fcFitPenalty(L.xi); }
function fcStrength(){
  const O=fcOwn(); if(!O) return 50;
  return clamp(O.r0+(fcXiAvg()-O.xi0)+(O.staff.coach-2)*.8+(O.mor-60)/12,30,97);
}
/* moteur du match de votre club : voir foot_stats.js */
var footPlayBase=footPlay;

/* ---------- Après un match de votre équipe : moral, blessures, forme, direct ---------- */
function fcAfterMatch(h,a,gh,ga){
  const O=fcOwn(); if(!O) return;
  const me=O.id===h?0:1, gf=me?ga:gh, gc=me?gh:ga, opp=me?h:a;
  O.mor=clamp(O.mor+(gf>gc?4:gf<gc?-5:0),10,100);
  /* V1.9.9 : engouement des supporters selon les derniers résultats */
  O.fv=clamp((O.fv||0)*.85+(gf>gc?.03:gf<gc?-.03:0),-.2,.2);
  /* blessures */
  const R=frnd, L=fcLineup();
  L.xi.forEach(p=>{ const q=O.sq.find(x=>x.id===p.id); if(q && R()<.02*(1.25-.12*O.staff.phys)){ q.inj=Math.round((5+R()*28)*(1.1-.1*O.staff.phys)); fcNews(q.n+' est blessé ('+q.inj+' jours).','bad'); } });
  O.last={h,a,gh,ga,day:S.day};
  /* V1.7.7 : série sans défaite de la saison (pour les records) */
  O.unbC= gf>=gc? (O.unbC||0)+1 : 0; O.unbS=Math.max(O.unbS||0,O.unbC);
  if(O.autoLive) O.live={h,a,gh,ga,day:S.day};
  log('info','Votre club : match joué contre '+footName(opp)+'. Regardez-le pour découvrir le score.','news');
}
function fcNews(t,c){ const O=fcOwn(); if(!O) return; O.news.unshift({d:S.day,t,c:c||''}); if(O.news.length>30) O.news.length=30; }

/* ---------- Finances au jour le jour ---------- */
function fcFin(k,amt){ const O=fcOwn(); const y=S.foot.nat[footClub(O.id).nat].y; const f=O.fin[y]||(O.fin[y]={}); f[k]=(f[k]||0)+amt; Object.keys(O.fin).forEach(z=>{ if(+z<y-2) delete O.fin[z]; }); }
function fcPay(k,label,amt){ pay('foot',label,amt); fcFin(k,amt); }
function fcTicketPrice(O){ const r=footR(O.id); return Math.round((12+Math.max(0,r-45)*1.3)*[.8,1,1.25][O.ticket]); }
function fcAttendance(O,oppId){
  const c=footClub(O.id), r=footR(O.id), lvl=FOOT_LEAGUES.find(L=>L.id===footLgOf(O.id)).lvl;
  const base=clamp(.45+(r-50)/80+(lvl===1?.12:lvl===2?0:-.1)+(O.mor-60)/400+((footR(oppId)||60)-60)/300+fcFan(O).t,.12,.99);
  /* V1.9.7 : les places ajoutées se remplissent un peu moins bien */
  return Math.round(fcCap(O)*clamp(base*Math.pow(c.cap/fcCap(O),.3)*[1.12,1,.84][O.ticket]*(O.hype&&O.hype.until>S.day?1.12:1),.1,1));
}
function fcDaily(day){
  const O=fcOwn(); if(!O) return;
  const c=footClub(O.id), N=S.foot.nat[c.nat];
  /* salaires chaque lundi */
  if(wdOf(day)===0){ const w=O.sq.reduce((s,p)=>s+p.w,0)+fcStaffCost(O); fcPay('wages','Club : salaires de la semaine',-w/52); }
  /* droits TV et sponsors, le 1er de chaque mois */
  if(footDate(day).d===1){
    const lvl=FOOT_LEAGUES.find(L=>L.id===footLgOf(O.id)).lvl, tv=(FC_TV[c.nat]||FC_TV.fr)[lvl-1];
    if(N.on) fcPay('tv','Club : droits de diffusion',tv/10);
    fcPay('spons','Club : sponsors et boutique',fcClubValue(O.id)*.06/12);
  }
  /* récupération des blessés, moral qui revient lentement vers 60 */
  O.sq.forEach(p=>{ if(p.inj>0) p.inj--; });
  if(day%7===0) O.mor+= (60-O.mor)*.08;
  /* progression des joueurs chaque mois */
  if(footDate(day).d===15){ O.sq.forEach(p=>fpGrow(p,O)); fcAcad(O).forEach(p=>fpGrow(p,O)); }
  fcMercatoDay(day);
}
/* billetterie : à chaque match à domicile */
function fcHomeGate(h,a){ const O=fcOwn(); if(!O||O.id!==h) return; const n=fcAttendance(O,a), p=fcTicketPrice(O); fcPay('gate','Club : billetterie ('+fmtN(n,0)+' spectateurs)',n*p); O.lastGate={n,p}; }
{ const _lr=footRecord; footRecord=function(lg,h,a,gh,ga){ _lr(lg,h,a,gh,ga); fcHomeGate(h,a); }; }
{ const _ko=footKO; footKO=function(h,a){ const r=_ko(h,a); fcHomeGate(h,a); return r; }; }
/* fin de saison : primes, vieillissement, jeunes du centre de formation */
{ const _es=footEndSeason; footEndSeason=function(nat){
    const O=fcOwn(); let pos=null, lid=null;
    let tab=null, gi=0;
    if(O && footClub(O.id).nat===nat){ lid=footLgOf(O.id); gi=S.foot.lg[lid].grp.findIndex(g=>g.includes(O.id)); tab=footTable(lid,gi); pos=tab.findIndex(x=>x.id===O.id); }
    const N0=S.foot.nat[nat], y0=N0.y;
    _es(nat);
    if(pos!==null){
      const L=FOOT_LEAGUES.find(x=>x.id===lid), tv=(FC_TV[nat]||FC_TV.fr)[L.lvl-1], n=tab.length, me=tab[pos].t;
      /* V1.7.7 : primes plus marquées en haut du classement, titre et places européennes */
      const parts=[], add=(l,v)=>{ v=Math.round(v); if(v>0){ parts.push([l,v]); fcPay('prize','Club : '+l.toLowerCase(),v); } };
      add('Prime de classement ('+(pos+1)+(pos?'e':'er')+')', tv*.55*Math.pow(Math.max(0,1-pos/n),1.5));
      if(pos===0){ add('Prime du titre', tv*.25); troAdd('lg',L.n,footSeasonLabel(nat,y0)); }
      /* V1.7.8 : places européennes réelles (Coupe d’Europe des champions puis Coupe d’Europe : Espagne 4 + 2, France 3 + 2, Croatie 1 + 2) */
      const euN={es:7, fr:6, hr:4, en:7, de:7}[nat]||0;   /* V1.9.3 : places de la Coupe des confédérations comprises */
      if(L.lvl===1&&pos>0&&pos<euN) add('Prime de qualification européenne', tv*.1);
      if(S.foot.cup[nat] && S.foot.cup[nat].champ===O.id) add('Victoire en coupe nationale', tv*.25);
      /* montée, descente (indemnité parachute sur deux saisons) */
      const mv=(N0.moves||[]).find(x=>x[0]===O.id), L2= mv? FOOT_LEAGUES.find(x=>x.id===mv[2]) : null, up= mv&&L2.lvl<L.lvl, down= mv&&L2.lvl>L.lvl;
      if(O.para&&O.para.left>0){ add('Indemnité parachute', O.para.amt); O.para.left--; if(O.para.left<=0) O.para=null; }
      if(up){ const tv2=(FC_TV[nat]||FC_TV.fr)[L2.lvl-1]; add('Prime de montée', tv2*.15); add('Bonus des sponsors pour la montée', tv2*.08); O.hype={until:S.day+300}; O.para=null; }
      if(down){ const tv2=(FC_TV[nat]||FC_TV.fr)[L2.lvl-1], amt=Math.max(0,(tv-tv2)*.45); O.para={left:1, amt}; add('Indemnité parachute', amt); }
      /* records absolus du club */
      const R0=O.rec=O.rec||{}, nr=[], lv=L.lvl, sc=lv*100+pos;
      if(R0.best===undefined||sc<R0.best.sc){ if(R0.best!==undefined) nr.push('Meilleur classement'); R0.best={sc,pos,lid,y:footSeasonLabel(nat,y0)}; }
      if(R0.pts===undefined||me[6]>R0.pts){ if(R0.pts!==undefined) nr.push('Points'); R0.pts=me[6]; }
      if(R0.gf===undefined||me[4]>R0.gf){ if(R0.gf!==undefined) nr.push('Buts marqués'); R0.gf=me[4]; }
      if((O.unbS||0)>(R0.unb||0)){ if(R0.unb!==undefined) nr.push('Série sans défaite'); R0.unb=O.unbS; } O.unbS=0;
      O.endPop={y:footSeasonLabel(nat,y0), lid, n:L.n, pos, rows:tab.map(x=>[x.id,x.t[6],x.t[4],x.t[5],x.t[0]]), parts, rec:{best:R0.best, pts:R0.pts, gf:R0.gf, unb:R0.unb||0}, nr, mv: up?'up':down?'down':null, to: L2? L2.n : null, zone:{up:L.up||0, down:L.down||0}};
      O.sq.forEach(p=>{ p.a++; p.w=Math.max(p.w,Math.round(fcPlayerWage(p)*.9)); });
      const R=frnd, home=FOOT_NATPOOL[nat]||'fr', P=footNamePool(home);
      const A=fcAcad(O); A.forEach(p=>{ p.a++; }); O.acad=A.filter(p=>{ if(p.a>=19){ fcNews(p.n+' quitte le centre de formation sans contrat.',''); return false; } return true; });
      { const lo=clamp(footR(O.id)-30+O.staff.youth*3,35,60), n=2+Math.floor(frnd()*2)+(O.staff.youth>=4?1:0); fcAcadGen(O,n,lo,lo+14); fcNews(n+' jeunes entrent au centre de formation.','good'); }
      O.seasons++;
      fcNews('Fin de saison : '+(pos+1)+(pos?'e':'er')+' de '+L.n+'.', pos<3?'good':'');
    }
  }; }
{ const _fs=footStep; footStep=function(day){ _fs(day); try{ fcDaily(day); }catch(e){ console.error(e); } }; }

/* ---------- Staff ---------- */
function fcStaffCost(O){ return Object.values(O.staff).reduce((s,l)=>s+[0,1.5e5,4e5,1e6,2.5e6,6e6][l],0); }
function fcStaffUp(role){
  const O=fcOwn(); if(!O||!FC_STAFF[role]) return err('Poste inconnu.'); const l=O.staff[role]; if(l>=5) return err('Déjà au meilleur niveau.');
  const fee=[0,2e5,6e5,1.5e6,4e6,1e7][l+1]; if(S.cash<fee) return err('Il faut '+eur(fee,0)+' pour recruter ce profil.');
  O.staff[role]=l+1; fcPay('staff','Club : recrutement '+FC_STAFF[role].n.toLowerCase(),-fee);
  return ok(FC_STAFF[role].n+' : niveau '+(l+1)+' sur 5.');
}

/* ---------- Mercato ---------- */
function fcWindow(day){
  const O=fcOwn(); if(!O) return null; const nat=footClub(O.id).nat, N=S.foot.nat[nat], c=FOOT_CAL[nat];
  const y=footDate(day).y, s=footDay(c.e[0]<c.s[0]?y:y,c.s[0],c.s[1]);
  const wins=[[s-45,s+15,'Mercato d’été'],[s+150,s+180,'Mercato d’hiver'],[s-360-45,s-360+15,'Mercato d’été'],[s-360+150,s-360+180,'Mercato d’hiver']];
  for(const [a,b,n] of wins) if(day>=a&&day<=b) return {a,b,n};
  return null;
}
function fcNextWindow(day){ for(let d=day; d<day+400; d+=1) if(fcWindow(d)) return d; return null; }
/* joueurs à vendre ailleurs (tous les clubs, sauf le vôtre) */
function fcMarket(f){
  footInit(); const O=fcOwn(), out=[], cap=f.max||Infinity;
  [...FOOT.clubs,...FOOT.foreign].forEach(c=>{ if(O&&c.id===O.id) return; const sq=footSquad(c.id);
    sq.forEach(p=>{ if(f.pos&&p.p!==f.pos) return; if(p.o<(f.min||0)) return; const v=fcPlayerValue(p); if(v>cap) return; if(O&&!f.all&&fcWillJoin(p)<.3) return; out.push({p, club:c.id, v}); }); });
  return out.sort((a,b)=>b.p.o-a.p.o).slice(0,40);
}
function fcFindPlayer(pid,clubId){ return footSquad(clubId).find(p=>String(p.id)===String(pid)); }
/* chances qu'un joueur accepte de venir : la taille de votre club compte */
function fcWillJoin(p){ const O=fcOwn(); const gap=p.o-fcStrength()-(O.staff.scout-1)*1.2; return clamp(1-(gap-4)/14,.05,1); }
function fcBid(pid,clubId,mult){
  const O=fcOwn(); if(!O) return err('Rachetez d’abord un club.');
  if(!fcWindow(S.day)) return err('Le mercato est fermé.');
  const p=fcFindPlayer(pid,clubId); if(!p) return err('Joueur introuvable.');
  if(O.sq.length>=30) return err('Effectif complet (30 joueurs). Vendez avant d’acheter.');
  const v=fcPlayerValue(p), fee=Math.round(v*mult*(1-.03*(O.staff.scout-1))/1e4)*1e4;
  if(S.cash<fee) return err('Trésorerie insuffisante : '+eur(fee,0)+' nécessaires.');
  O.tries=O.tries||{}; const key=clubId+':'+pid; if(O.tries[key]===S.day) return err('Le club a déjà répondu aujourd’hui. Réessayez demain.');
  O.tries[key]=S.day;
  const key11=footXI(clubId).xi.some(x=>String(x.id)===String(p.id)), need=key11? 1.25 : 1.0;
  const clubOk = mult>=need || frnd()<(mult-.85)/(need-.85+.0001)*.6;
  if(!clubOk) return err(footName(clubId)+' refuse votre offre de '+eur(fee,0)+'.');
  if(frnd()>fcWillJoin(p)) return err(p.n+' ne souhaite pas rejoindre '+footName(O.id)+' : votre club n’est pas assez ambitieux pour lui.');
  /* transfert */
  const F=S.foot; F.out=F.out||{}; F.extra=F.extra||{};
  if(F.extra[clubId] && F.extra[clubId].some(x=>x.id===p.id)) F.extra[clubId]=F.extra[clubId].filter(x=>x.id!==p.id); else F.out[p.id]=1;
  const np=Object.assign({},p,{inj:0}); np.w=Math.round(fcPlayerWage(np)*1.1); np.club=O.id; O.sq.push(np);
  fcPay('transfer','Transfert : '+p.n,-fee); fcNews(p.n+' rejoint le club pour '+eur(fee,0)+'.','good');
  return ok(p.n+' signe pour '+eur(fee,0)+' (salaire '+eur(np.w,0)+' par saison).');
}
function fcRelease(pid){ const O=fcOwn(); const p=O&&O.sq.find(x=>x.id===pid); if(!p) return err('Joueur introuvable.'); if(O.sq.length<=16) return err('Gardez au moins 16 joueurs.');
  const cost=Math.round(p.w*.5/1e3)*1e3; O.sq=O.sq.filter(x=>x!==p); if(O.xi) O.xi=O.xi.filter(id=>id!==pid); fcPay('transfer','Résiliation : '+p.n,-cost); return ok('Contrat résilié ('+eur(cost,0)+' d’indemnités).'); }
function fcToggleList(pid){ const O=fcOwn(); if(!O) return err('Aucun club.'); if(O.list[pid]) delete O.list[pid]; else O.list[pid]=1; return ok(O.list[pid]? 'Joueur placé sur la liste des transferts.' : 'Joueur retiré de la liste des transferts.'); }
/* offres reçues pendant le mercato */
function fcMercatoDay(day){
  const O=fcOwn(); const W=fcWindow(day);
  O.offers=O.offers.filter(x=>x.until>=day && W);
  if(!W) return;
  const R=frnd, chance=.08+.1*Object.keys(O.list).length;
  if(R()<Math.min(.45,chance)){
    const pool=O.sq.filter(p=>O.list[p.id]||R()<.15); if(!pool.length) return;
    const p=pool[Math.floor(R()*pool.length)];
    const buyers=[...FOOT.clubs,...FOOT.foreign].filter(c=>c.id!==O.id && Math.abs(footR(c.id)-p.o)<8);
    if(!buyers.length) return; const b=buyers[Math.floor(R()*buyers.length)];
    const fee=Math.round(fcPlayerValue(p)*(O.list[p.id]? .85+R()*.3 : 1.05+R()*.4)/1e4)*1e4;
    if(O.offers.some(x=>x.pid===p.id)) return;
    O.offers.push({id:day*100+Math.floor(R()*99), pid:p.id, club:b.id, fee, until:day+5});
    fcNews(footName(b.id)+' propose '+eur(fee,0)+' pour '+p.n+'.','');
  }
}
function fcOffer(oid,accept){
  const O=fcOwn(); const o=O&&O.offers.find(x=>x.id===oid); if(!o) return err('Offre expirée.');
  O.offers=O.offers.filter(x=>x!==o); if(!accept) return ok('Offre refusée.');
  const p=O.sq.find(x=>x.id===o.pid); if(!p) return err('Joueur déjà parti.');
  if(O.sq.length<=16) return err('Gardez au moins 16 joueurs.');
  O.sq=O.sq.filter(x=>x!==p); if(O.xi) O.xi=O.xi.filter(id=>id!==p.id); delete O.list[p.id];
  const F=S.foot; F.extra=F.extra||{}; (F.extra[o.club]=F.extra[o.club]||[]).push(Object.assign({},p,{club:o.club}));
  fcPay('transfer','Vente : '+p.n,o.fee); fcNews(p.n+' part à '+footName(o.club)+' pour '+eur(o.fee,0)+'.','');
  return ok(p.n+' est vendu pour '+eur(o.fee,0)+'.');
}

/* ---------- Réglages ---------- */
function fcSet(k,v){
  const O=fcOwn(); if(!O) return err('Aucun club.');
  if(k==='form'&&FC_FORM[v]){ O.form=v; O.xi=null; }
  else if(k==='style'&&FC_STYLE[v]) O.style=v;
  else if(k==='auto'){ O.auto=!!v; if(!O.auto) O.xi=fcLineup().xi.map(p=>p.id); }
  else if(k==='ticket') O.ticket=clamp(+v,0,2);
  else if(k==='live') O.autoLive=!!v;
  else if(k==='asub') O.autoSub=!!v;
  return ok('');
}
function fcSwap(slot,pid){ const O=fcOwn(); if(!O) return err('Aucun club.'); const cur=fcLineup().xi.map(p=>p.id); const j=cur.indexOf(pid); if(j>=0) cur[j]=cur[slot]; cur[slot]=pid; O.xi=cur; O.auto=false; return ok(''); }

/* ---------- Valeur nette et grand livre ---------- */
{ const _nw=computeNW; computeNW=function(){ const v=_nw(); const O=fcOwn(); if(O){ S.nw=v+fcClubValue(O.id); if(S.nw>S.peakNW) S.peakNW=S.nw; return S.nw; } return v; }; }
{ const _nb=nwBreakdown; nwBreakdown=function(){ const o=_nb(); const O=fcOwn(); if(O) o['Club de football']=fcClubValue(O.id); return o; }; }
{ const _sn=srcName; srcName=function(src){ return src==='foot'? 'Club de football' : _sn(src); }; }

/* V1.9.1 : trophées du club et de ses joueurs (cérémonie à l'écran, palmarès O.cab) */
function troAdd(k,n,y,pl){ const O=fcOwn(); if(!O) return; const t={k,n,y:y||'',pl:pl||null,d:S.day};
  (O.cab=O.cab||[]).unshift(t); if(O.cab.length>80) O.cab.length=80; (O.troQ=O.troQ||[]).push(t); }

/* V1.9.7 : agrandissement du stade. O.stx = places ajoutées, O.stb = chantier {n, c, end} */
const ST_SEAT=900, ST_DAYS=120;
function fcCap(O){ return footClub(O.id).cap+(O.stx||0); }
function fcStMax(O){ return Math.max(footClub(O.id).cap,100000); }
function fcStAdd(O){ const c0=footClub(O.id).cap; return Math.min(Math.max(2000,Math.round(c0*.15/500)*500),fcStMax(O)-fcCap(O)); }
function fcStCost(O){ const n=fcStAdd(O); return Math.round(n*ST_SEAT*(1+fcCap(O)/60000)/1e4)*1e4; }
function fcStBuild(){ const O=fcOwn(); if(!O) return {ok:false,msg:'Aucun club.'};
  if(O.stb) return {ok:false,msg:'Des travaux sont déjà en cours.'};
  const n=fcStAdd(O); if(n<=0) return {ok:false,msg:'Le stade a atteint sa taille maximale.'};
  const c=fcStCost(O); if(S.cash<c) return {ok:false,msg:'Trésorerie insuffisante.'};
  fcPay('works','Club : agrandissement du stade (+'+fmtN(n,0)+' places)',-c); O.stb={n,c,end:S.day+ST_DAYS};
  fcNews('Les travaux d’agrandissement du stade commencent : '+fmtN(n,0)+' places en plus dans '+ST_DAYS+' jours.','');
  return {ok:true,msg:'Travaux lancés : '+fmtN(n,0)+' places en plus dans '+ST_DAYS+' jours.'}; }
{ const _fd=fcDaily; fcDaily=function(day){ _fd(day); const O=fcOwn(); if(!O||!O.stb||day<O.stb.end) return;
  O.stx=(O.stx||0)+O.stb.n; const n=O.stb.n; O.stb=null; fcNews('Fin des travaux : le stade compte '+fmtN(fcCap(O),0)+' places (+'+fmtN(n,0)+').','good');
  log('good','Votre stade est agrandi : '+fmtN(fcCap(O),0)+' places.','news'); }; }

/* V1.9.9 : remplissage dynamique. f = forme récente (−20 à +20 points), k = classement (−8 à +8 points) */
function fcFan(O){ const f=O.fv||0, lid=footLgOf(O.id), lg=S.foot.lg[lid]; let k=0;
  if(lg&&lg.tab){ const gi=Math.max(0,lg.grp.findIndex(g=>g.includes(O.id))), tab=footTable(lid,gi), pos=tab.findIndex(x=>x.id===O.id), t=lg.tab[O.id];
    if(pos>=0&&t&&t[0]>=4&&tab.length>1) k=(.5-pos/(tab.length-1))*.16; }
  return {f,k,t:f+k}; }

