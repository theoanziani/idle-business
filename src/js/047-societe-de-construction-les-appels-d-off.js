/* ============================================================
   SOCIÉTÉ DE CONSTRUCTION : les appels d'offres
   Des chantiers sont proposés ; on répond avec un prix et un délai. Trop cher, on perd ;
   trop court, on paie des pénalités de retard.
   Systèmes : planning des équipes (priorités), engins, intérimaires, prix des matériaux qui
   varient (achat au fil du chantier ou d'avance), sous-traitance.
   Événements : intempéries, découverte archéologique, accident de chantier.
   Paliers : grands chantiers, ouvrages d'art, label environnemental, marchés publics, grands projets.
   Lien : vos propres chantiers immobiliers coûtent moins cher et vont plus vite (buildCoLevel).
   Unités : W = travail en journées d'équipe. Prix juste d'un chantier = W × R0 / équipes de base.
   État b.m (v:1) : off[] (appels d'offres), jobs[] (chantiers), mi (indice des matériaux), eng (engins 0-3),
   tmp (intérimaires), lab (label vert), rep (réputation /100), mg (marge du conducteur), pend, pendC, nid, log.
   ============================================================ */
const BC_KIND = [
  {k:'mais', n:['Maison individuelle','Extension de maison','Rénovation d’une villa'], W:[20,60], rk:0},
  {k:'comm', n:['Local commercial','Rénovation d’une école','Entrepôt logistique','Cabinet médical'], W:[50,160], rk:0},
  {k:'imm', n:['Immeuble de logements','Résidence étudiante','Immeuble de bureaux'], W:[200,520], rk:1},
  {k:'oa', n:['Pont routier','Passerelle piétonne','Tunnel urbain','Viaduc'], W:[400,1000], rk:2, prem:1.25, eng:2},
  {k:'pub', n:['Lycée public','Hôpital régional','Médiathèque','Gare'], W:[500,1200], rk:4, prem:1.15},
  {k:'gp', n:['Stade','Terminal d’aéroport','Centre de congrès'], W:[1500,3000], rk:5, prem:1.3, eng:3}
];
const BC_CLIENTS = ['Mairie','Promoteur Horizon','Famille Martin','Région','Groupe Alba','Société Vela','Département','Bailleur social Toit pour tous','Investisseur privé'];
const BC_ENG = [{n:'Aucun engin',p:1},{n:'Engins de base',p:1.2,c:.3},{n:'Parc complet',p:1.4,c:.6},{n:'Grues et engins lourds',p:1.6,c:1.2}];
const BC_PR = [[-.1,'−10 %'],[0,'Estimation'],[.1,'+10 %'],[.2,'+20 %']];
const BC_DL = [[.8,'Court'],[1,'Normal'],[1.25,'Long']];
const BC_MAT=.4;           /* part des matériaux dans le prix juste */
const bcCrews = b => 1+(b.lvl||1);
const bcCapDay = b => (bcCrews(b)+(b.m.tmp||0))*BC_ENG[b.m.eng||0].p*clamp(staffFactor(b),.3,1.2);
function bcInit(b){ const m={v:1, off:[], jobs:[], mi:1, eng:0, tmp:0, lab:0, rep:50, mg:.05, pend:0, pendC:0, nid:1, next:S.day+2, log:[]}; b.m=m; for(let i=0;i<3;i++) bcNewOffer(b);
  /* un premier chantier déjà signé, pour démarrer */
  const o=m.off.shift(); o.bid={pr:0,dl:1.25,ma:0,p:1,d:S.day}; o.dl=Math.max(o.dl,Math.ceil(o.W/Math.max(.5,bcCapDay(b))*1.2)); bcStart(b,o); m.log=[]; return m; }
function bcUnit(b){ return metR0(b)*1.2/bcCrews(b); }
/* V2.2.1 : révision des prix : la main-d’œuvre d’un chantier en cours suit le tarif actuel de la société (jamais à la baisse, ×4 au plus) ;
   les matériaux restent au prix signé. Anciennes sauvegardes : le tarif de référence est celui du jour de la mise à jour. */
function bcIdx(b,j){ if(!(j.u0>0)) j.u0=bcUnit(b); return clamp(bcUnit(b)/j.u0,1,4); }
function bcRev(b,j){ return j.price*(BC_MAT+(1-BC_MAT)*bcIdx(b,j)); }
function bcNewOffer(b){
  const m=b.m, L=BC_KIND.filter(x=>mxHas(b,x.rk)), K=wpick(L,x=>x.rk===0?3:x.rk>=4?1:1.5);
  const W=Math.round(K.W[0]+(K.W[1]-K.W[0])*rnd()), cap=Math.max(.5,bcCapDay(b));
  const ref=Math.round(W*bcUnit(b)*(K.prem||1)*(m.lab&&rnd()<.5?1.15:1)/100)*100;
  const dl=Math.max(10,Math.round(W/cap*(1.6+1.0*rnd())));
  const dd=(cityOf(b).d||[])[rint(0,Math.max(0,(cityOf(b).d||[]).length-1))];
  m.off.push({id:m.nid++, n:pick(K.n)+(dd?' · '+dd.n:''), cl:K.k==='pub'||K.k==='oa'||K.k==='gp'? pick(['Mairie','Région','Département','État']) : K.k==='mais'? pick(['Famille Martin','Famille Durand','Famille Petit','Investisseur privé']) : pick(BC_CLIENTS), k:K.k, W, ref, dl, comp:rint(2,6), exp:S.day+rint(5,9), green:m.lab&&ref>W*bcUnit(b)*(K.prem||1)*1.1, eng:K.eng||0});
}
/* chance de remporter l'appel d'offres */
function bcWin(b,o,pr,dl){ const m=b.m; let p=.55-2.2*pr+(dl<1?.12:dl>1?-.18:0)+(m.rep-50)/180-.04*(o.comp-3)+(o.green?.08:0);
  if(o.eng&&(m.eng||0)<o.eng) p-=.35; return clamp(p,.02,.95); }
function bcBid(b,arg,auto){ const [sid,spr,sdl,sma]=String(arg).split(':'), m=b.m, o=m.off.find(x=>x.id===+sid);
  if(!o) return err('Appel d’offres expiré.'); if(o.bid) return err('Offre déjà envoyée.');
  const pr=clamp(+spr||0,-.1,.2), dl=[.8,1,1.25].includes(+sdl)? +sdl : 1;
  o.bid={pr, dl, ma:+sma?1:0, p:bcWin(b,o,pr,dl), d:S.day+2}; if(!auto) metLog(b,'offre envoyée pour « '+o.n+' » ('+eur(o.ref*(1+pr),0)+', '+Math.round(o.dl*dl)+' jours).','');
  return ok('Offre envoyée. Réponse dans 2 jours.'); }
function bcStart(b,o){ const m=b.m, price=o.ref*(1+o.bid.pr), mat=price*BC_MAT/(1+o.bid.pr)*(o.k==='oa'?1.1:1);
  const j={id:o.id, n:o.n, cl:o.cl, k:o.k, W:o.W, left:o.W, price, u0:bcUnit(b), mat, matPaid:0, due:S.day+Math.round(o.dl*o.bid.dl), pr:m.jobs.length, sub:0, stop:0, green:o.green};
  if(o.bid.ma){ const c=mat*m.mi; m.pendC+=c; j.matPaid=mat; }
  m.jobs.push(j); m.rep=clamp(m.rep+.5,0,100);
  metLog(b,'chantier remporté : « '+o.n+' » pour '+eur(price,0)+', livraison le '+footDateLabel(j.due,{noY:1})+'.','good'); }
MET.build = {
  fam:'imm', core:true, init:bcInit,
  ranks:[
    {n:'Grands chantiers', d:'Immeubles de logements et de bureaux.'},
    {n:'Ouvrages d’art', d:'Ponts, tunnels et viaducs, payés 25 % plus cher. Il faut un parc d’engins complet.'},
    {n:'Label environnemental', d:'Achetez le label : certains chantiers verts se paient 15 % plus cher et vous les gagnez plus souvent.'},
    {n:'Marchés publics', d:'Lycées, hôpitaux et gares : de très gros chantiers.'},
    {n:'Grands projets', d:'Stades, aéroports et centres de congrès. Il faut des grues et engins lourds.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b);
    return { vol:0, cogs:0, rev:m.pend, fixed:m.pendC+(m.tmp||0)*R0*.12+(m.eng||0)*R0*.012 };
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b), wx=metWeather(b.city);
    if(ctx.open){ m.pend=0; m.pendC=0; }
    /* matériaux : le prix bouge chaque jour */
    m.mi=clamp(m.mi*Math.exp(.012*norm()+.02*Math.log(1/m.mi)),.7,1.5);
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(!m.ev&&rnd()<.002){ const up=rnd()<.6; m.mi=clamp(m.mi*(up?1.18:.88),.7,1.5); metLog(b,up?'flambée du prix des matériaux (acier, béton) : +18 %.':'baisse du prix des matériaux : −12 %.',up?'bad':'good'); }
    /* appels d'offres */
    m.off=m.off.filter(o=>{ if(o.bid&&S.day>=o.bid.d){ if(rnd()<o.bid.p) bcStart(b,o); else metLog(b,'appel d’offres perdu : « '+o.n+' ».',''); return false; } return o.exp>=S.day||o.bid; });
    if(S.day>=m.next&&m.off.filter(o=>!o.bid).length<5){ bcNewOffer(b); m.next=S.day+rint(1,3); }
    if(!ctx.open) return;
    /* travail du jour */
    let cap=bcCapDay(b)*(wx==='pluie'?.6:1);
    if(m.ev&&m.ev.k==='storm') cap=0;
    if(!m.ev&&wx==='pluie'&&rnd()<.03){ m.ev={k:'storm', until:S.day+2}; metLog(b,'intempéries : tous les chantiers sont à l’arrêt pendant 3 jours.','warn'); }
    const L=m.jobs.slice().sort((a,c)=>a.pr-c.pr);
    let rev=0, cost=0;
    L.forEach(j=>{ if(j.stop>S.day) return;
      let w=0; const maxC=Math.max(1,Math.ceil(j.W/25));
      if(cap>0){ w=Math.min(j.left, cap, maxC*BC_ENG[m.eng||0].p); cap-=w; }
      if(j.sub){ const ws=Math.min(j.left-w, Math.max(1,j.W/40)); w+=ws; cost+=ws/j.W*j.price*.55; }
      if(w<=0) return; j.left-=w; const f=w/j.W; rev+=f*bcRev(b,j);
      if(j.matPaid<j.mat){ const add=Math.min(j.mat-j.matPaid,f*j.mat); j.matPaid+=add; cost+=add*m.mi; }
      if(j.W>100&&rnd()<.0015){ const n=rint(10,20); j.stop=S.day+n; j.due+=n; metLog(b,'découverte archéologique sur « '+j.n+' » : chantier suspendu '+n+' jours, délai prolongé.','warn'); }
    });
    /* accident */
    if(rnd()<.0008*(bcCrews(b)+(m.tmp||0))*(fatOf(b)>50?2:1)){ b.closedUntil=S.day+3; cost+=R0*2; m.rep=clamp(m.rep-4,0,100); S.rep=clamp(S.rep-.5,0,100); metLog(b,'accident de chantier : arrêt de 3 jours, enquête de l’inspection du travail.','bad'); }
    /* chantiers terminés, pénalités */
    m.jobs=m.jobs.filter(j=>{ if(j.left<=.01){ const late=Math.max(0,S.day-j.due); m.rep=clamp(m.rep+(late? -Math.min(8,1+late/5) : 3)+(j.green?1:0),0,100); metLog(b,'chantier livré : « '+j.n+' »'+(late?' avec '+late+' jours de retard.':' dans les délais.'),late?'warn':'good'); return false; }
      if(S.day>j.due){ const pen=Math.min(j.price*.01, Math.max(0,j.price*.3-(j.pen||0))); j.pen=(j.pen||0)+pen; cost+=pen; if(S.day===j.due+1) metLog(b,'retard sur « '+j.n+' » : pénalités de 1 % du prix par jour.','bad'); }
      return true; });
    m.pend+=rev; m.pendC+=cost;
  },
  kpis(b){ const m=b.m, cap=bcCapDay(b), back=m.jobs.reduce((a,j)=>a+j.left,0), late=m.jobs.filter(j=>S.day>j.due).length;
    return [['Chantiers en cours', String(m.jobs.length), late? late+' en retard' : 'Aucun retard'],
            ['Carnet de commandes', Math.round(back/Math.max(.1,cap))+' jours', eur(m.jobs.reduce((a,j)=>a+bcRev(b,j)*j.left/j.W,0),0)+' à facturer'],
            ['Prix des matériaux', Math.round(m.mi*100)+' %', m.mi>1.1? 'Cher : achetez au fil de l’eau' : m.mi<.9? 'Bas : achetez d’avance' : 'Proche de la normale'],
            ['Réputation', Math.round(m.rep)+' / 100', 'Chantiers livrés à l’heure : elle monte']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    const e=m.eng||0; out.push(e<3? {k:'btn', act:'eng', label:'Engins : '+BC_ENG[e].n.toLowerCase(), cost:d.cost*BC_ENG[e+1].c, sub:'Passer à « '+BC_ENG[e+1].n+' » : productivité ×'+BC_ENG[e+1].p.toFixed(1).replace('.',NDEC)+'. Entretien '+eur(R0*.012*(e+1),0)+' / jour.'} : {k:'buy', act:'eng', label:'Engins : '+BC_ENG[3].n.toLowerCase(), owned:true, sub:'Productivité ×1,6.'});
    out.push({k:'seg', act:'tmp', label:'Équipes intérimaires', val:m.tmp||0, opts:[[0,'Aucune'],[1,'1'],[2,'2'],[4,'4']], sub:'Renfort pour tenir les délais : '+eur(R0*.12,0)+' par équipe et par jour ouvré, même sans travail.'});
    if(b.boss) out.push({k:'seg', act:'mg', label:'Marge du conducteur de travaux', val:Math.round((m.mg||0)*100), opts:[[0,'0 %'],[5,'5 %'],[10,'10 %'],[15,'15 %']], sub:'En délégation, il répond aux appels d’offres avec cette marge au-dessus de l’estimation.'});
    if(mxHas(b,3)) out.push(m.lab? {k:'buy', act:'lab', label:'Label environnemental', owned:true, sub:'Chantiers verts mieux payés et plus souvent gagnés.'} : {k:'buy', act:'lab', label:'Label environnemental', cost:d.cost*.8, sub:'Certains chantiers verts se paient 15 % plus cher, et vous les gagnez plus souvent.'});
    return out;
  },
  acts:{
    bid:(b,arg)=>bcBid(b,arg,false),
    pr:(b,id)=>{ const m=b.m, j=m.jobs.find(x=>x.id===+id); if(!j) return err('Chantier introuvable.'); const L=m.jobs.slice().sort((a,c)=>a.pr-c.pr), i=L.indexOf(j); if(i>0){ L.splice(i,1); L.splice(i-1,0,j); } L.forEach((x,k)=>x.pr=k); return ok('« '+j.n+' » passe en priorité.'); },
    sub:(b,id)=>{ const j=b.m.jobs.find(x=>x.id===+id); if(!j) return err('Chantier introuvable.'); j.sub=j.sub?0:1; return ok(j.sub?'Une partie du chantier est sous-traitée (55 % du prix de ce travail).':'Sous-traitance arrêtée.'); },
    eng:(b)=>bcEng(b,false),
    mg:(b,v)=>{ b.m.mg=clamp(+v||0,0,20)/100; return ok('Marge : '+Math.round(b.m.mg*100)+' %.'); },
    tmp:(b,v)=>{ b.m.tmp=clamp(+v|0,0,4); return ok(''); },
    lab:(b)=>{ const m=b.m; if(!mxHas(b,3)) return err('Palier 3 requis.'); if(m.lab) return err('Déjà obtenu.'); const c=bizDef(b).cost*.8; if(!metBuy(b,c,'Label environnemental')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.lab=1; return ok('Label environnemental obtenu.'); }
  },
  auto: bcAuto
};
function bcEng(b,auto){ const m=b.m, e=m.eng||0; if(e>=3) return err('Parc d’engins complet.'); const c=bizDef(b).cost*BC_ENG[e+1].c;
  if(!(auto? dlSpend(b,c,'Engins de chantier') : metBuy(b,c,'Engins de chantier'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.eng=e+1; metLog(b,'nouveaux engins : '+BC_ENG[m.eng].n.toLowerCase()+'.','good'); return ok(BC_ENG[m.eng].n+'.'); }
/* le conducteur de travaux répond aux offres avec la marge fixée */
function bcAuto(b,mode,q){
  const m=b.m, cap=bcCapDay(b), back=m.jobs.reduce((a,j)=>a+j.left,0), pending=m.off.filter(o=>o.bid).reduce((a,o)=>a+o.W*o.bid.p,0);
  /* planning : les chantiers les plus en retard d'abord */
  m.jobs.slice().sort((a,c)=>(a.due-S.day-a.left/cap)-(c.due-S.day-c.left/cap)).forEach((j,k)=>j.pr=k);
  m.jobs.forEach(j=>{ const need=j.left/Math.max(1,j.due-S.day); j.sub= S.day>j.due-5&&j.left>cap*Math.max(1,j.due-S.day)*.8? 1 : 0; });
  let load=back+pending;
  m.off.filter(o=>!o.bid).forEach(o=>{ if(o.eng&&(m.eng||0)<o.eng) return;
    const fin=(load+o.W)/Math.max(.1,cap*.85); if(fin>o.dl*1.25) return; if(fin>90) return;   /* V2.2.1 : carnet limité à 90 jours (les prix sont fixés à la signature ; un carnet de plus d’un an se payait aux tarifs d’avant les agrandissements) */
    const dl= fin>o.dl? 1.25 : 1, mg=(m.mg||.05)+(1-q)*.08*(rnd()-.5); load+=o.W*.5;
    const pr=[-.1,0,.1,.2].reduce((a,x)=>Math.abs(x-mg)<Math.abs(a-mg)?x:a,0);
    bcBid(b,o.id+':'+pr+':'+dl+':'+(m.mi<.92?1:0),true); });
  if(mode!=='full'||S.day%14!==0) return;
  if(m.jobs.some(j=>j.due-S.day<j.left/Math.max(.1,cap))&&(m.tmp||0)<2) m.tmp=(m.tmp||0)+1; else if(back<cap*10&&m.tmp>0) m.tmp--;
  if((m.eng||0)<3&&bcEng(b,true).ok) return;
  if(mxHas(b,3)&&!m.lab&&dlSpend(b,bizDef(b).cost*.8,'Label environnemental')) m.lab=1;
}
/* sans consigne, l'équipe répond elle-même aux appels d'offres après 10 jours sans chantier */
{ const _d=MET.build.daily; MET.build.daily=function(b,ctx){ _d.call(this,b,ctx); const m=b.m; if(dlMode(b)!=='me') return;
  if(!m.jobs.length&&!m.off.some(o=>o.bid)){ m.idle=(m.idle||0)+1; if(m.idle>=10){ m.idle=0; bcAuto(b,'assist',.4); if(m.off.some(o=>o.bid)) metLog(b,'faute de chantier, l’équipe répond à des appels d’offres.',''); } } else m.idle=0; }; }

