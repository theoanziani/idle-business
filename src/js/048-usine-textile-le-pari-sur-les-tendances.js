/* ============================================================
   USINE TEXTILE : le pari sur les tendances
   L'année a 4 saisons de 90 jours. On prépare la collection deux saisons à l'avance :
   saison en vente (q), saison en fabrication (q+1), saison à préparer (q+2).
   On choisit les quantités par style d'après des prévisions de tendance imprécises.
   Les invendus partent en soldes à la fin de la saison (40 % du prix).
   Systèmes : matières (coton classique, bio, synthétique), sous-traitance (bon marché ou éthique),
   part vendue d'avance aux grossistes (sûre mais moins chère), marque propre.
   Événements : tendance surprise, scandale chez un sous-traitant, hausse du coton.
   Paliers : bureau de tendances, marque propre, collection capsule, usine automatisée, défilé.
   Unités : un lot = 0,9 jour de chiffre d'affaires de base ; capacité = 100 lots par saison et par niveau.
   La recette passe par le stock de l'usine (vêtements), comme avant.
   ============================================================ */
const TX_ST = [{id:'cla',n:'Classique'},{id:'spo',n:'Sportswear'},{id:'min',n:'Minimaliste'},{id:'boh',n:'Bohème'},{id:'str',n:'Streetwear'},{id:'vin',n:'Vintage'}];
const TX_MAT = [{id:'cot',n:'Coton classique',c:1,p:1},{id:'bio',n:'Coton bio',c:1.3,p:1.22},{id:'syn',n:'Synthétique',c:.75,p:.85}];
const TX_SUB = [{id:'non',n:'Aucune',cap:0,c:1},{id:'low',n:'Bon marché',cap:.5,c:.85},{id:'eth',n:'Éthique',cap:.3,c:1.08}];
const TX_GROS = [0,.3,.6];
const TX_SEAS = ['Hiver','Printemps','Été','Automne'];
const txQ = d => Math.floor(((d||S.day)-1)/90);
const txSeasonName = q => TX_SEAS[((q%4)+4)%4]+' '+(FOOT_Y0+Math.floor(q/4));
const txCap = b => 100*(b.lvl||1)*(b.m.auto?1.3:1);
const txUnit = b => .9*metR0(b);
/* V2.2.7 : affichage en pièces, l'unité de la production et des débouchés (un lot vaut txUnit, une pièce le prix de référence des vêtements) */
const txPcs = b => txUnit(b)/D.GOODS.vet.v;
const txP = (b,x) => fmtN(Math.round(x*txPcs(b)/10)*10);
function txPop(b){ const o={}; TX_ST.forEach(s=>{ o[s.id]=clamp(Math.exp(.55*norm()),.25,3); }); return o; }
function txForecast(b,pop){ const e=b.m.bur? .12 : .35, o={}; Object.keys(pop).forEach(k=>{ o[k]=clamp(pop[k]*Math.exp(e*norm()),.2,3.2); }); return o; }
function txNewPlan(b,q,prev){ const pop=txPop(b);
  return {q, pop, fc:txForecast(b,pop), qty: prev? Object.assign({},prev.qty) : {cla:0,spo:0,min:0,boh:0,str:0,vin:0}, mat:prev?prev.mat:'cot', sub:prev?prev.sub:'non', gros:prev?prev.gros:1, cap:0, show:null}; }
/* répartition « raisonnable » d'après les prévisions (utilisée au démarrage et par le directeur) */
function txFill(b,P,share,prud){ const cap=txCapOf(b,P)*share, f=P.fc, sum=Object.values(f).reduce((a,x)=>a+x,0);
  TX_ST.forEach(s=>{ const w=(1-prud)*f[s.id]/sum+prud/TX_ST.length; P.qty[s.id]=Math.round(cap*w/5)*5; }); }
function txCapOf(b,P){ return txCap(b)*(1+TX_SUB.find(x=>x.id===P.sub).cap); }
function txInit(b){ const q=txQ(), m={v:1, q, sale:null, prod:null, plan:null, bur:0, own:0, auto:0, caps:0, pend:0, pendC:0, ev:null, sc:0, log:[]}; b.m=m;
  const p0=txNewPlan(b,q,null); txFill(b,p0,.9,.5); const p1=txNewPlan(b,q+1,p0); txFill(b,p1,.9,.5); const p2=txNewPlan(b,q+2,p1); txFill(b,p2,.9,.5);
  m.sale=txOpenSale(b,p0); m.prod=p1; m.plan=p2; return m; }
/* ouverture des ventes d'une saison : stock = production ; part grossistes vendue tout de suite */
function txOpenSale(b,P){ const m=b.m, u=txUnit(b), mat=TX_MAT.find(x=>x.id===P.mat), stock={}, gr=TX_GROS[P.gros]||0, sf=clamp(P.sf===undefined?1:P.sf,.3,1);
  let pre=0; TX_ST.forEach(s=>{ const n=(P.qty[s.id]||0)*sf; stock[s.id]=n*(1-gr); pre+=n*gr; });
  /* demande réelle : la tendance, plus une éventuelle surprise */
  const pop=Object.assign({},P.pop); if(rnd()<.35){ const s=pick(TX_ST), up=rnd()<.5; pop[s.id]*=up?2:.4; metLog(b,'tendance surprise : le style « '+s.n+' » '+(up?'s’arrache':'n’intéresse plus personne')+' cette saison.',up?'good':'warn'); }
  if(P.show) pop[P.show]*=1.4;
  const sum=Object.values(pop).reduce((a,x)=>a+x,0), dem={}; TX_ST.forEach(s=>{ dem[s.id]=txCap(b)*1.4*pop[s.id]/sum*(m.own?.9:1); });
  if(P.caps) { stock.cap=(P.caps||0); dem.cap=P.caps*1.1; }
  const price=u*mat.p*(m.own?1.35:1);
  if(pre>0) m.pend+=pre*u*mat.p*.8;
  return {q:P.q, stock, dem, sold:{}, price, mat:P.mat, sub:P.sub, scand:0};
}
function txClose(b){ const m=b.m, S0=m.sale; if(!S0) return; let left=0; Object.keys(S0.stock).forEach(k=>left+=S0.stock[k]);
  if(left>.5){ m.pend+=left*S0.price*.4; metLog(b,'fin de saison : '+txP(b,left)+' pièces invendues partent en soldes ('+eur(left*S0.price*.4,0)+').',left>txCap(b)*.25?'warn':''); } }
function txRoll(b){ const m=b.m; txClose(b); m.sale=txOpenSale(b,m.prod); m.prod=m.plan; m.prod.sf=1; m.plan=txNewPlan(b,m.prod.q+1,m.prod); txFill(b,m.plan,.9,.6); m.q=txQ();
  if(m.ev&&m.ev.k==='coton') m.ev=null; if(rnd()<.2){ m.ev={k:'coton'}; metLog(b,'hausse du coton : la collection en fabrication coûte 20 % plus cher.','bad'); }
  metLog(b,'nouvelle saison : la collection « '+txSeasonName(m.sale.q)+' » est en vente.','good'); }
MET.textile = {
  fam:'ind', core:true, init:txInit,
  ranks:[
    {n:'Bureau de tendances', d:'Achetez un bureau de tendances : des prévisions bien plus précises.'},
    {n:'Marque propre', d:'Vendez sous votre marque : prix 35 % plus hauts, un peu moins de clients.'},
    {n:'Collection capsule', d:'Une collection avec un créateur connu : peu de pièces, vendues deux fois plus cher.'},
    {n:'Usine automatisée', d:'Capacité +30 % et coûts de fabrication −20 %.'},
    {n:'Défilé', d:'Un défilé pendant la semaine de la mode : le style choisi gagne 40 % de demande.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){ const m=b.m, u=txUnit(b);
    if(ctx.open){ m.pend=0; m.pendC=0; }
    if(txQ()!==m.q) txRoll(b);
    /* fabrication : coûts étalés sur la saison, rendement selon l'équipe */
    const P=m.prod, mat=TX_MAT.find(x=>x.id===P.mat), sub=TX_SUB.find(x=>x.id===P.sub);
    let n=0; Object.keys(P.qty).forEach(k=>n+=P.qty[k]||0); n+=P.caps||0;
    m.pendC+=n*u*.42*mat.c*(sub.id==='non'?1:(1+sub.cap*(sub.c-1)/(1+sub.cap)))*(m.auto?.8:1)*(m.ev&&m.ev.k==='coton'?1.2:1)/90*(P.caps? 1 : 1);
    P.sf=(P.sf===undefined?1:P.sf)*.99+clamp(staffFactor(b),0,1)*.01;
    /* ventes du jour */
    const SA=m.sale; if(!SA) return;
    let rev=0;
    Object.keys(SA.stock).forEach(k=>{ const st=SA.stock[k]; if(st<=0) return; const rate=SA.dem[k]/90*clamp(1+.25*norm(),.4,1.6)*(SA.scand?.7:1);
      const s=Math.min(st,rate); SA.stock[k]-=s; SA.sold[k]=(SA.sold[k]||0)+s; rev+=s*SA.price*(k==='cap'?2:1); });
    m.pend+=rev;
    /* scandale chez un sous-traitant bon marché */
    if(SA.sub==='low'&&!SA.scand&&rnd()<.004){ SA.scand=1; S.rep=clamp(S.rep-2,0,100); metLog(b,'scandale chez votre sous-traitant bon marché : conditions de travail dénoncées, ventes −30 % jusqu’à la fin de la saison.','bad'); }
  },
  kpis(b){ const m=b.m, SA=m.sale; let st=0, so=0; if(SA){ Object.values(SA.stock).forEach(x=>st+=x); Object.values(SA.sold).forEach(x=>so+=x); }
    const left=90-((S.day-1)%90);
    return [['En vente', txSeasonName(SA?SA.q:txQ()), left+' jours avant les soldes'],
            ['Vendu cette saison', txP(b,so)+' pièces', txP(b,st)+' pièces en stock'],
            ['Capacité', txP(b,txCap(b))+' pièces / saison', m.auto?'Usine automatisée':'Par niveau de l’usine'],
            ['Marque', m.own?'Marque propre':'Pour les autres', m.bur?'Bureau de tendances':'Prévisions approximatives']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    if(mxHas(b,1)) out.push(m.bur? {k:'buy', act:'bur', label:'Bureau de tendances', owned:true, sub:'Prévisions bien plus précises.'} : {k:'buy', act:'bur', label:'Bureau de tendances', cost:d.cost*.4, sub:'Les prévisions de tendance deviennent bien plus précises.'});
    if(mxHas(b,2)) out.push(m.own? {k:'buy', act:'own', label:'Marque propre', owned:true, sub:'Prix +35 %.'} : {k:'buy', act:'own', label:'Lancer votre marque', cost:d.cost*1.2, sub:'Prix 35 % plus hauts, un peu moins de clients.'});
    if(mxHas(b,4)) out.push(m.auto? {k:'buy', act:'auto', label:'Usine automatisée', owned:true, sub:'Capacité +30 %, coûts −20 %.'} : {k:'buy', act:'auto', label:'Automatiser l’usine', cost:d.cost*2, sub:'Capacité +30 % et coûts de fabrication −20 %.'});
    return out;
  },
  acts:{
    q:(b,arg)=>{ const [k,dv]=String(arg).split(':'), P=b.m.plan; if(!(k in P.qty)) return err('Style inconnu.');
      const tot=Object.values(P.qty).reduce((a,x)=>a+x,0)-P.qty[k], cap=Math.floor(txCapOf(b,P));
      P.qty[k]=clamp((P.qty[k]||0)+(+dv||0),0,Math.max(0,cap-tot)); return ok(''); },
    mat:(b,v)=>{ if(!TX_MAT.some(x=>x.id===v)) return err(''); b.m.plan.mat=v; return ok(''); },
    sub:(b,v)=>{ if(!TX_SUB.some(x=>x.id===v)) return err(''); b.m.plan.sub=v; const P=b.m.plan, cap=txCapOf(b,P); let tot=Object.values(P.qty).reduce((a,x)=>a+x,0); if(tot>cap) TX_ST.forEach(s=>{ P.qty[s.id]=Math.floor(P.qty[s.id]*cap/tot); }); return ok(''); },
    gros:(b,v)=>{ b.m.plan.gros=clamp(+v|0,0,2); return ok(''); },
    fill:(b)=>{ txFill(b,b.m.plan,.95,.25); return ok('Collection répartie selon les prévisions.'); },
    bur:(b)=>txBuy(b,'bur',.4,'Bureau de tendances',1,false),
    own:(b)=>txBuy(b,'own',1.2,'Marque propre',2,false),
    auto:(b)=>txBuy(b,'auto',2,'Usine automatisée',4,false),
    caps:(b)=>{ const P=b.m.plan; if(!mxHas(b,3)) return err('Palier 3 requis.'); if(P.caps) return err('Capsule déjà prévue.'); const c=bizDef(b).cost*.3; if(!metBuy(b,c,'Collection capsule')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); P.caps=Math.round(txCap(b)*.12); return ok('Collection capsule prévue pour '+txSeasonName(P.q)+'.'); },
    show:(b,k)=>{ const P=b.m.plan; if(!mxHas(b,5)) return err('Palier 5 requis.'); if(P.show) return err('Défilé déjà prévu.'); if(!TX_ST.some(s=>s.id===k)) return err('Style inconnu.'); const c=bizDef(b).cost*.5; if(!metBuy(b,c,'Défilé')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); P.show=k; return ok('Défilé prévu : le style « '+TX_ST.find(s=>s.id===k).n+' » sera mis en avant.'); }
  },
  auto: txAuto
};
function txBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.');
  const c=bizDef(b).cost*f; if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,(auto?'le directeur de production : ':'nouveau : ')+label.toLowerCase()+'.','good');
  if(k==='bur'&&m.plan) m.plan.fc=txForecast(b,m.plan.pop); return ok(label+' : c’est fait.'); }
/* le directeur de production suit les tendances avec prudence */
function txAuto(b,mode,q){ const m=b.m, P=m.plan;
  if(P.dq!==P.q||(m.bur&&!P.dbur)){ P.dq=P.q; P.dbur=m.bur; P.sub='eth'; P.mat= m.own? 'bio' : 'cot'; P.gros=1; txFill(b,P,.95,.25+.35*(1-q)); }
  if(mode!=='full'||S.day%14!==0) return;
  if(mxHas(b,1)&&!m.bur&&txBuy(b,'bur',.4,'Bureau de tendances',1,true).ok) return;
  if(mxHas(b,2)&&!m.own&&txBuy(b,'own',1.2,'Marque propre',2,true).ok) return;
  if(mxHas(b,4)&&!m.auto&&txBuy(b,'auto',2,'Usine automatisée',4,true).ok) return;
  if(mxHas(b,3)&&!P.caps&&dlSpend(b,bizDef(b).cost*.3,'Collection capsule')) P.caps=Math.round(txCap(b)*.12);
}

