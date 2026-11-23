/* ============================================================
   CONCESSION AUTOMOBILE (V1.2.7)
   Comme une vraie concession : peu de marge sur le neuf, davantage sur l'occasion et l'atelier.
   Systèmes :
   - marque partenaire (constructeurs fictifs) : objectif de ventes par trimestre, prime si atteint ;
   - stock neuf commandé (livré en 7 jours) et stock d'occasions ; un stock qui vieillit coûte
     (frais financiers) et une occasion qui traîne perd de la valeur ;
   - reprises : une partie des acheteurs laisse sa voiture ; l'atelier la remet en état puis on la revend ;
   - atelier après-vente : entretien du parc de vos clients, forte marge (+15 % avec une société de réparation).
   Événements : salon de l'auto, pénurie de composants, hausse des taux, rappel constructeur.
   Paliers : occasions certifiées, carrosserie, vitrine haut de gamme, flottes d'entreprise, groupe de distribution.
   État b.m (v:1) : br (marque), bt (confiance de la marque), q {d0, end, sold, ca, obj}, nw[] {n, c, d},
   ord[] {n, c, d}, oc[] {mv, c, d, rec}, rem, rp, mk, aord, atl, park, h[] (ventes du jour), ev,
   vo, carr, shw, flt, grp, fo (offre de flotte), acc, accC, pend, pendC, log.
   ============================================================ */
const DL_BR = {
  valmont:{n:'Valmont', d:'Généraliste : la valeur sûre', p:28000, mg:.09, dem:1, pr:.035},
  kito:{n:'Kito', d:'Petits prix : beaucoup de clients, marge serrée', p:17000, mg:.075, dem:1.45, pr:.03},
  volta:{n:'Volta', d:'Électrique : une demande qui grimpe', p:38000, mg:.095, dem:.8, pr:.04, rk:2, up:1},
  ardena:{n:'Ardena', d:'Haut de gamme : peu de ventes, grosses marges', p:58000, mg:.12, dem:.55, pr:.045, rk:3}
};
const DL_REM=[0,3,6,9], DL_RP={str:{n:'Stricte', t:.3, buy:.72, cv:.95}, nor:{n:'Normale', t:.45, buy:.8, cv:1}, gen:{n:'Généreuse', t:.6, buy:.88, cv:1.08}};
const DL_MK=[.05,.1,.15,.2];
const dlK = b => metR0(b)/68000;
function dlBr(b){ return DL_BR[b.m.br]||DL_BR.valmont; }
function dlSeason(){ const mo=Math.floor(((S.day-1)%360)/30); return mo===2||mo===8? 1.3 : mo===7? .7 : 1; }
function dlEv(m,k){ return m.ev&&m.ev.k===k&&m.ev.until>=S.day; }
function dlNewN(m){ return m.nw.reduce((a,l)=>a+l.n,0); }
function dlObj(b){ const B=dlBr(b); return Math.max(8,Math.round(90*.8*dlK(b)*B.dem*(b.m.grp?1.6:1))); }
function dlQuarter(b){ const m=b.m; m.q={d0:S.day, end:S.day+90, sold:0, ca:0, obj:dlObj(b)}; }
function dlInit(b){
  b.stock=0; const k=dlK(b), B=DL_BR.valmont, R=rnd;
  const m={v:1, br:'valmont', bt:60, q:null, nw:[{n:Math.max(4,Math.round(14*k)), c:B.p*(1-B.mg), d:S.day}], ord:[], oc:[], rem:0, rp:'nor', mk:1, aord:1, atl:0, park:Math.round(400*k), aoc:1,
    h:[], ev:null, vo:0, carr:0, shw:0, flt:0, grp:0, fo:null, acc:0, accC:0, pend:0, pendC:0, last:null, log:[]};
  for(let i=0;i<Math.round(6*k)+2;i++){ const mv=Math.round(9000+R()*9000); m.oc.push({mv, c:mv*.8, d:S.day-Math.floor(R()*40), rec:R()<.6?1:0}); }
  b.m=m; dlQuarter(b); return m;
}
/* commande de voitures neuves : payée à la commande, livrée en 7 jours (plus en cas de pénurie) */
function dlOrder(b,n,auto){ const m=b.m, B=dlBr(b), c=B.p*(1-B.mg), cost=c*n;
  if(mAvail(b)<cost) return err('Trésorerie insuffisante : '+eur(cost,0)+'.');
  mPayCap(b,'Commande de '+n+' voiture'+(n>1?'s':'')+' neuve'+(n>1?'s':'')+' : '+b.name,-cost); settleAccounts();
  m.ord.push({n, c, d:S.day+7+(dlEv(m,'pen')?20:0)}); return ok(n+' voiture'+(n>1?'s':'')+' '+B.n+' commandée'+(n>1?'s':'')+(auto?' automatiquement':'')+', livraison dans '+(7+(dlEv(m,'pen')?20:0))+' jours.'); }
/* achat d'occasions aux enchères professionnelles */
function dlAuction(b){ const m=b.m, R=rnd, L=[]; let cost=0; for(let i=0;i<3;i++){ const mv=Math.round(10000+R()*12000); L.push({mv, c:mv*.86, d:S.day, rec:0}); cost+=mv*.86; }
  if(mAvail(b)<cost) return err('Trésorerie insuffisante : '+eur(cost,0)+'.');
  mPayCap(b,'Achat d’occasions aux enchères : '+b.name,-cost); settleAccounts(); m.oc=m.oc.concat(L); return ok('3 occasions achetées aux enchères ('+eur(cost,0)+'), à remettre en état.'); }
function dlRecCap(b){ const m=b.m; return (.9+.4*m.atl)*dlK(b)*(m.carr?1.5:1); }
function dlRepairLink(){ return S.biz.some(x=>x.def==='repair'&&x.status==='active'); }
/* une journée de concession (sim : prévision sans hasard ni changement d'état) */
function dlDay(b,sim){
  const m=b.m, k=dlK(b), B=dlBr(b), RP=DL_RP[m.rp]||DL_RP.nor, wf=weFactor(b), se=dlSeason();
  const mood=(dlEv(m,'salon')?1.4:1)*(dlEv(m,'taux')?.8:1)*(m.grp?1.6:1)*(.85+.3*m.bt/100);
  const up= B.up? 1+Math.min(.5,S.day/3000) : 1;
  /* neuf */
  const rem=DL_REM[m.rem]||0, cvN=(1+.075*rem)*RP.cv*(m.shw?1.1:1);
  const leadsN=1.3*k*B.dem*up*se*wf*mood*cvN, stockN=dlNewN(m);
  let nN= sim? Math.min(stockN,leadsN) : Math.min(stockN, Math.floor(leadsN+rnd()));
  const priceN=B.p*(1-rem/100);
  /* occasion */
  const mk=DL_MK[m.mk]||.1, recs=m.oc.filter(x=>x.rec).length, raws=m.oc.length-recs;
  const leadsU=1.2*k*se*wf*mood*(m.vo?1.3:1)*Math.exp(-(mk-.1)*4);
  let nU= sim? Math.min(m.oc.length,leadsU) : Math.min(m.oc.length, Math.floor(leadsU+rnd()));
  /* atelier après-vente */
  const svc=Math.min(m.park*.02, (12+6*m.atl)*k*(m.carr?1.3:1))*(dlEv(m,'rappel')?1.5:1), svcRev=svc*450*(dlRepairLink()?1.15:1);
  return {leadsN, nN, priceN, leadsU, nU, mk, svc, svcRev, stockN, recs, raws};
}
MET.dealer = {
  fam:'com', core:true, init:dlInit,
  ranks:[
    {n:'Occasions certifiées', d:'Label qualité : +30 % de demande sur l’occasion et des voitures remises en état vendues 5 % plus cher.'},
    {n:'Carrosserie', d:'Un atelier de carrosserie : remise en état 50 % plus rapide, plus d’entretiens. Ouvre la marque électrique Volta.'},
    {n:'Vitrine haut de gamme', d:'Un showroom soigné : +10 % de ventes de neuf. Ouvre la marque Ardena.'},
    {n:'Flottes d’entreprise', d:'Des sociétés vous commandent des séries de voitures : grosses ventes à petite marge qui comptent pour l’objectif.'},
    {n:'Groupe de distribution', d:'Une deuxième concession : 60 % de clients en plus, mais des frais en plus.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC+(m.grp?metR0(b)*.06:0)}; },
  daily(b,ctx){
    const m=b.m, k=dlK(b), B=dlBr(b);
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    if(!m.q) dlQuarter(b);
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* livraisons */
    m.ord=m.ord.filter(o=>{ if(S.day>=o.d){ m.nw.push({n:o.n, c:o.c, d:S.day}); return false; } return true; });
    /* frais financiers du stock (plan de financement constructeur) */
    const stockVal=m.nw.reduce((a,l)=>a+l.n*l.c,0)+m.oc.reduce((a,x)=>a+x.c,0); m.accC+=stockVal*.0003*(dlEv(m,'taux')?1.6:1);
    if(!ctx.open){ m.h.unshift({n:0,u:0}); m.h.length=Math.min(m.h.length,30); return; }
    const d=dlDay(b,false), RP=DL_RP[m.rp]||DL_RP.nor;
    /* ventes de neuf : on vend d'abord les plus anciennes */
    let nN=d.nN; m.nw.sort((x,y)=>x.d-y.d);
    while(nN>0&&m.nw.length){ const l=m.nw[0], t=Math.min(l.n,nN); l.n-=t; nN-=t; m.acc+=t*d.priceN; m.accC+=t*l.c; if(l.n<=0) m.nw.shift();
      m.q.sold+=t; m.q.ca+=t*d.priceN; m.park+=t;
      /* reprises */
      for(let i=0;i<t;i++) if(rnd()<RP.t){ const mv=Math.round(B.p*(.25+rnd()*.3)), c=mv*RP.buy; m.oc.push({mv, c, d:S.day, rec:0}); mPayCap(b,'Reprise d’une voiture : '+b.name,-c); } }
    /* ventes d'occasions : les voitures remises en état d'abord */
    let nU=d.nU; m.oc.sort((x,y)=>(y.rec-x.rec)||(x.d-y.d));
    while(nU>0&&m.oc.length){ const x=m.oc.shift(); nU--; const pr=x.mv*(1+d.mk)*(x.rec? (m.vo?1.05:1) : .85); m.acc+=pr; m.accC+=x.c; m.park+=.5; }
    /* remise en état à l'atelier */
    let rc=dlRecCap(b)+(rnd()<(dlRecCap(b)%1)?1:0); m.oc.forEach(x=>{ if(!x.rec&&rc>=1){ x.rec=1; rc--; m.accC+=x.mv*.06; } });
    /* atelier après-vente : 55 % de marge */
    m.acc+=d.svcRev; m.accC+=d.svcRev*.45; m.park=Math.max(0,m.park*(1-1/900));
    m.h.unshift({n:d.nN, u:d.nU}); if(m.h.length>30) m.h.length=30;
    /* une occasion qui traîne perd de la valeur ; au-delà de 150 jours, vendue à un marchand */
    m.oc=m.oc.filter(x=>{ const age=S.day-x.d; if(age>90) x.mv*=.997; if(age>150){ m.acc+=x.mv*.8; m.accC+=x.c; metLog(b,'une occasion invendue depuis 5 mois part chez un marchand ('+eur(x.mv*.8,0)+').','warn'); return false; } return true; });
    /* commande automatique : environ 3 semaines de ventes en stock */
    if(m.aord){ const rate=dlDay(b,true).leadsN, want=Math.ceil(rate*21), have=dlNewN(m)+m.ord.reduce((a,o)=>a+o.n,0); if(have<want*.6) dlOrder(b,Math.max(2,Math.ceil(want-have)),true); }
    /* achat automatique d'occasions aux enchères quand le parc d'occasions est trop maigre */
    if(m.aoc&&m.oc.length<Math.max(3,Math.round(6*k))) dlAuction(b);
    /* fin de trimestre : objectif de la marque */
    if(S.day>=m.q.end){ const Q=m.q, okQ=Q.sold>=Q.obj;
      if(okQ){ const prime=Q.ca*B.pr; m.acc+=prime; m.qok=(m.qok||0)+1; m.bt=clamp(m.bt+8,0,100); metLog(b,'objectif '+B.n+' atteint ('+Q.sold+' / '+Q.obj+') : prime de '+eur(prime,0)+'.','good'); }
      else { m.bt=clamp(m.bt-(Q.sold<Q.obj*.7?12:5),0,100); metLog(b,'objectif '+B.n+' manqué ('+Q.sold+' / '+Q.obj+') : pas de prime ce trimestre.','bad'); }
      dlQuarter(b); }
    /* offres de flotte (palier 4) */
    if(m.flt&&!m.fo&&rnd()<.03){ const n=5+Math.floor(rnd()*11); m.fo={n, until:S.day+10}; metLog(b,'une société demande '+n+' voitures pour sa flotte (remise de 8 %).',''); }
    if(m.fo&&m.fo.until<S.day) m.fo=null;
    /* événements */
    if(!m.ev){ const r=rnd();
      if(r<.004){ m.ev={k:'salon', until:S.day+7}; metLog(b,'salon de l’auto : 40 % de clients en plus pendant une semaine.','good'); }
      else if(r<.007){ m.ev={k:'pen', until:S.day+30}; metLog(b,'pénurie de composants chez les constructeurs : livraisons retardées de 20 jours.','bad'); }
      else if(r<.009){ m.ev={k:'taux', until:S.day+25}; metLog(b,'hausse des taux de crédit : moins de clients et un stock plus cher à financer.','bad'); }
      else if(r<.012){ m.ev={k:'rappel', until:S.day+10}; metLog(b,'rappel constructeur : l’atelier tourne à plein pendant 10 jours.','good'); } }
  },
  kpis(b){ const m=b.m, d=dlDay(b,true), Q=m.q, n30=m.h.reduce((a,x)=>a+x.n,0), u30=m.h.reduce((a,x)=>a+x.u,0), oa=m.oc.length? Math.round(m.oc.reduce((a,x)=>a+S.day-x.d,0)/m.oc.length) : 0;
    return [['Ventes (30 j)', fmtN(n30+u30), n30+' neuves · '+u30+' occasions'],
            ['Objectif '+dlBr(b).n, Q.sold+' / '+Q.obj, 'Fin du trimestre '+(Q.end-S.day<=0?'aujourd’hui':'dans '+(Q.end-S.day)+' j')],
            ['Stock', dlNewN(m)+' + '+m.oc.length, 'neuves + occasions'+(m.oc.length? ' · âge moyen '+oa+' j' : '')],
            ['Atelier', eur(d.svcRev,0)+' / j', fmtN(Math.round(m.park))+' clients suivis']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'seg', act:'rem', label:'Remise sur le neuf', val:m.rem, opts:DL_REM.map((x,i)=>[i,x? x+' %' : 'Aucune']), sub:'Chaque point de remise attire environ 7 % de clients en plus, mais la marge du neuf est faible : la remise sert surtout à atteindre l’objectif de la marque.'});
    out.push({k:'seg', act:'rp', label:'Reprises des anciennes voitures', val:m.rp, opts:Object.entries(DL_RP).map(([k2,x])=>[k2,x.n]), sub:'Généreuse : plus de ventes de neuf et plus d’occasions à revendre, mais rachetées plus cher.'});
    out.push({k:'seg', act:'mk', label:'Marge sur l’occasion', val:m.mk, opts:DL_MK.map((x,i)=>[i,Math.round(x*100)+' %']), sub:'Plus de marge, moins d’acheteurs. Une occasion non remise en état se vend 15 % moins cher.'});
    out.push({k:'tog', act:'aord', label:'Commande automatique des voitures neuves', val:m.aord, sub:'Garde environ trois semaines de ventes en stock. Livraison en 7 jours.'});
    out.push({k:'tog', act:'aoc', label:'Achat automatique d’occasions', val:m.aoc, sub:'Quand il reste trop peu d’occasions, achète 3 voitures aux enchères professionnelles (moins rentables qu’une reprise).'});
    out.push(m.atl>=3? {k:'buy', act:'atl', label:'Atelier : niveau 3 sur 3', owned:true, sub:'Remise en état et entretien au maximum.'} : {k:'buy', act:'atl', label:'Agrandir l’atelier (niveau '+(m.atl+1)+' sur 3)', cost:d.cost*.4*(m.atl+1), sub:'Plus de voitures remises en état par jour et plus d’entretiens.'});
    [['vo',1,1.2,'Occasions certifiées','+30 % de demande sur l’occasion.'],['carr',2,2.5,'Carrosserie','Remise en état +50 %, plus d’entretiens ; marque Volta.'],['shw',3,5,'Vitrine haut de gamme','+10 % de ventes de neuf ; marque Ardena.'],['flt',4,8,'Flottes d’entreprise','Des commandes groupées de sociétés.'],['grp',5,15,'Groupe de distribution','+60 % de clients, frais en plus.']].forEach(([k2,rk,f,l,s])=>{
      if(mxHas(b,rk)) out.push(m[k2]? {k:'buy', act:k2, label:l, owned:true, sub:s} : {k:'buy', act:k2, label:l, cost:d.cost*f, sub:s}); });
    return out;
  },
  acts:{
    rem:(b,v)=>{ b.m.rem=clamp(+v|0,0,3); return ok(''); },
    rp:(b,v)=>{ if(!DL_RP[v]) return err(''); b.m.rp=v; return ok(''); },
    mk:(b,v)=>{ b.m.mk=clamp(+v|0,0,3); return ok(''); },
    aord:(b,v)=>{ b.m.aord=+v?1:0; return ok(''); },
    aoc:(b,v)=>{ b.m.aoc=+v?1:0; return ok(''); },
    ord:(b,n)=>dlOrder(b,clamp(+n||3,1,30)),
    auc:(b)=>dlAuction(b),
    brand:(b,id)=>dlSwitch(b,id),
    fleet:(b)=>dlFleet(b),
    atl:(b)=>{ const m=b.m; if(m.atl>=3) return err('Atelier au maximum.'); const c=bizDef(b).cost*.4*(m.atl+1); if(!metBuy(b,c,'Agrandissement de l’atelier')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.atl++; metLog(b,'atelier agrandi (niveau '+m.atl+').','good'); return ok('Atelier : niveau '+m.atl+' sur 3.'); },
    vo:(b)=>dlBuy(b,'vo',1.2,'Occasions certifiées',1),
    carr:(b)=>dlBuy(b,'carr',2.5,'Carrosserie',2),
    shw:(b)=>dlBuy(b,'shw',5,'Vitrine haut de gamme',3),
    flt:(b)=>dlBuy(b,'flt',8,'Flottes d’entreprise',4),
    grp:(b)=>dlBuy(b,'grp',15,'Groupe de distribution',5)
  },
  auto: dlAuto
};
function dlBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
/* changer de marque : contrat payé, le stock neuf de l'ancienne marque est soldé */
function dlSwitch(b,id){ const m=b.m, B=DL_BR[id]; if(!B) return err('Marque inconnue.'); if(m.br===id) return err('C’est déjà votre marque.'); if(B.rk&&!mxHas(b,B.rk)) return err('Palier '+B.rk+' requis.');
  const fee=bizDef(b).cost*.3; if(mAvail(b)<fee) return err('Il faut '+eur(fee,0)+' pour le nouveau contrat.');
  mPayCap(b,'Contrat de concession '+B.n+' : '+b.name,-fee); settleAccounts();
  const left=m.nw.reduce((a,l)=>a+l.n*l.c,0)+m.ord.reduce((a,o)=>a+o.n*o.c,0); if(left>0){ m.acc+=left*.92; m.accC+=left; }
  m.nw=[]; m.ord=[]; m.br=id; m.bt=50; dlQuarter(b); metLog(b,'nouvelle marque : '+B.n+(left>0?' ; le stock de l’ancienne marque est soldé à 92 %.':'.'),'');
  return ok('Vous distribuez maintenant '+B.n+'.'); }
/* commande de flotte : livrée sur le stock ou commandée, remise de 8 %, compte pour l'objectif */
function dlFleet(b){ const m=b.m, F=m.fo; if(!F) return err('Aucune offre en cours.'); const B=dlBr(b), c=B.p*(1-B.mg)*F.n, pr=B.p*.92*F.n;
  if(mAvail(b)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  mPayCap(b,'Commande de flotte : '+b.name,-c); settleAccounts(); m.acc+=pr; m.accC+=c; m.q.sold+=F.n; m.q.ca+=pr; m.park+=F.n; m.fo=null;
  metLog(b,'flotte de '+F.n+' voitures livrée ('+eur(pr,0)+').','good'); return ok('Flotte de '+F.n+' voitures vendue.'); }
/* le directeur du site : commandes, remise en fin de trimestre, achats aux enchères, paliers */
function dlAuto(b,mode,q){ const m=b.m; m.aord=1;
  if(S.day%7===0){ const Q=m.q, left=Q.end-S.day, need=Q.obj-Q.sold, rate=dlDay(b,true).leadsN/(1+.075*(DL_REM[m.rem]||0));
    /* juste ce qu'il faut de remise pour tenir l'objectif */
    let r=0; while(r<3&&rate*(1+.075*DL_REM[r])*left*.9<need) r++; m.rem= rnd()<(1-q)*.3? m.rem : r;
    m.mk=1; m.rp='nor';
    if(m.fo) dlFleet(b); }
  if(mode!=='full') return;
  if(S.day%14===0){ if(m.oc.length<4*dlK(b)&&mDlp(b)>3e5) dlAuction(b);
    if(m.atl<3&&dlSpend(b,bizDef(b).cost*.4*(m.atl+1),'Agrandissement de l’atelier')){ m.atl++; metLog(b,'atelier agrandi par le directeur (niveau '+m.atl+').','good'); }
    for(const [k,f,l,rk] of [['vo',1.2,'Occasions certifiées',1],['carr',2.5,'Carrosserie',2],['shw',5,'Vitrine haut de gamme',3],['flt',8,'Flottes d’entreprise',4],['grp',15,'Groupe de distribution',5]]) if(!m[k]&&mxHas(b,rk)&&dlBuy(b,k,f,l,rk,true).ok) break; }
}

