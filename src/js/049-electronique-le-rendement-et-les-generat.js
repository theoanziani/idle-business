/* ============================================================
   ÉLECTRONIQUE : le rendement et les générations (fusion composants + smartphones)
   Une ligne sort des puces avec un rendement (part des puces utilisables) qui s'améliore avec
   l'expérience. La recherche ouvre la génération suivante, plus fine et plus chère, qui repart
   avec un rendement faible.
   Smartphones (palier) : on conçoit son modèle (écran, appareil photo, prix, puce de la génération
   actuelle) face aux rivaux ; le lancement annuel (mi-septembre) ouvre les précommandes.
   Systèmes : salles blanches à agrandir, budget de recherche, matières rares au prix variable,
   contrats en volume (Usines et logistique, comme avant).
   Événements : pénurie mondiale de puces, contamination d'une salle blanche, défaut de batterie.
   Paliers : 2e génération, 3e génération, smartphones, haut de gamme, technologies de pointe.
   Les puces passent par le stock de l'usine (composants) ; les smartphones sont vendus directement.
   ============================================================ */
const EL_GEN = [
  {n:'28 nm', v:1, c:1, rp:0},
  {n:'14 nm', v:1.35, c:1.25, rp:30},
  {n:'7 nm', v:1.75, c:1.6, rp:55},
  {n:'5 nm', v:2.2, c:2.0, rp:90},
  {n:'3 nm', v:2.7, c:2.45, rp:140}
];
const EL_RD = [0,.05,.1,.2];
const EL_LAUNCH = 255;               /* jour de l'année du lancement des smartphones (mi-septembre) */
const elY = (m) => { const g=m.g||0, y0=.35, yM=.9; return y0+(yM-y0)*(1-Math.exp(-(m.xp||0)/120)); };
const elCapF = (b) => 1+.3*(b.m.salles||0);
function elInit(b){ return {v:1, g:0, xp:90, rd:1, rp:0, salles:0, ri:1, ev:null, ph:0, mod:null, next:null, sales:0, pro:0, rec:0, phPend:0, log:[]}; }
/* conversion des anciennes usines de smartphones */
function elConvert(s){ if(!s||!Array.isArray(s.biz)) return; s.biz.forEach(b=>{ if(b.def!=='phones') return;
  const gv=(D.GOODS.tel.v)/(D.GOODS.comp.v); b.def='electronics'; b.goods=(b.goods||0)*gv; b.m=null; b.elFromPhones=1;
  (s.journal=s.journal||[]).push({d:s.day,s:'info',k:'own',m:'« '+b.name+' » devient une usine électronique avec sa gamme de smartphones.'}); }); }
{ const _mig=migrateState; migrateState=function(s){ const r=_mig(s); try{ elConvert(r); }catch(e){ console.error(e); } return r; }; }
D.biz.repair.syn={with:'electronics', b:.08, txt:'pièces moins chères grâce à votre usine électronique'};
/* note d'un modèle de smartphone, face aux rivaux */
function elScore(b,M){ return 20*M.e+22*(M.g+1)+18*M.p+(M.pro?15:0); }
function elRival(){ return 70+12*Math.max(0,(S.day-1)/360); }
function elPhoneCost(M){ return 90+45*M.e+35*M.p+(M.pro?120:0)+60*(EL_GEN[M.g].c)*.6; }
function elPhoneDemand(b,M,day){ const R0=metR0(b), ap=2.5/(1+Math.exp(-(elScore(b,M)-elRival())/15));
  const doy=(day-1)%360, since=(doy-EL_LAUNCH+360)%360, life=since<10? 3 : Math.max(.35,1-since/400);
  return R0/500*ap*Math.pow(500/M.pr,1.6)*life*(b.m.rec>S.day?.4:1); }
MET.electronics = {
  fam:'ind', core:true, init:elInit,
  fix(b){ const m=b.m; if(b.elFromPhones&&!m.ph){ m.ph=1; m.mod={e:2,p:2,pr:600,g:m.g,pro:0}; b.elFromPhones=0; } },
  ranks:[
    {n:'Deuxième génération', d:'La recherche peut ouvrir la gravure en 14 nm.'},
    {n:'Troisième génération', d:'La recherche peut ouvrir la gravure en 7 nm.'},
    {n:'Smartphones', d:'Concevez vos propres modèles, lancés chaque année à la mi-septembre.'},
    {n:'Haut de gamme', d:'Modèles Pro : finitions haut de gamme, vendus bien plus cher.'},
    {n:'Technologies de pointe', d:'La recherche peut aller jusqu’au 5 puis au 3 nm.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b), G=EL_GEN[m.g], cf=elCapF(b), down=m.ev&&m.ev.k==='cont'&&m.ev.until>=S.day;
    const pen=m.ev&&m.ev.k==='pen'&&m.ev.until>=S.day? 1.4 : 1, y=elY(m);
    const chip= down? 0 : R0*cf*y/.8*G.v*pen;   /* V1.7.5 : puces +5 % (facteur .95 → 1) */
    /* V1.7.5 : la recherche ne coûte que si elle peut avancer (génération suivante permise par le palier) */
    const rdOn=elRdOn(b);
    const cost= (down? .3 : 1)*R0*.5*cf*G.c*m.ri + (rdOn? R0*EL_RD[m.rd] : 0)+R0*.02*(m.salles||0);
    return { vol:0, cogs:0, rev:chip+m.phPend, fixed:cost };
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open) m.phPend=0;
    m.ri=clamp(m.ri*Math.exp(.01*norm()+.02*Math.log(1/m.ri)),.75,1.5);
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(ctx.open&&!(m.ev&&m.ev.k==='cont')) m.xp+=elCapF(b)*clamp(staffFactor(b),.3,1.2);
    /* recherche */
    const nx=EL_GEN[m.g+1], maxG= mxHas(b,5)? 4 : mxHas(b,2)? 2 : mxHas(b,1)? 1 : 0;
    if(nx&&m.g+1<=maxG){ m.rp+=EL_RD[m.rd]*(1+.1*(m.salles||0)); if(m.rp>=nx.rp&&!m.rdy){ m.rdy=1; metLog(b,'la recherche est prête : la gravure en '+nx.n+' peut être lancée.','good'); } }
    /* événements */
    if(!m.ev){ const r=rnd();
      if(r<.003){ m.ev={k:'pen', until:S.day+30}; metLog(b,'pénurie mondiale de puces : vos puces se vendent 40 % plus cher pendant 30 jours.','good'); }
      else if(r<.0055){ m.ev={k:'cont', until:S.day+4}; m.xp=Math.max(0,m.xp-25); metLog(b,'contamination d’une salle blanche : production arrêtée 5 jours, rendement en baisse.','bad'); } }
    /* smartphones */
    const doy=(S.day-1)%360;
    if(m.ph&&m.next&&doy===EL_LAUNCH){ m.mod=Object.assign({},m.next); m.next=null; metLog(b,'lancement du nouveau smartphone : les précommandes sont ouvertes.','good'); }
    if(m.ph&&m.mod&&ctx.open){ const M=m.mod, u=elPhoneDemand(b,M,S.day)*clamp(1+.2*norm(),.5,1.6), rev=u*M.pr, cost=u*elPhoneCost(M);
      m.phPend+=rev-cost; m.sales=(m.sales||0)*.95+u*.05;
      if(!m.rec&&rnd()<.0015*(M.pro?.6:1)){ m.rec=S.day+30; m.phPend-=R0*4; S.rep=clamp(S.rep-2,0,100); metLog(b,'défaut de batterie : rappel du modèle, ventes −60 % pendant 30 jours.','bad'); } else if(m.rec&&m.rec<S.day) m.rec=0; }
  },
  kpis(b){ const m=b.m, G=EL_GEN[m.g];
    const k=[['Gravure', G.n, EL_GEN[m.g+1]? 'Recherche : '+Math.min(100,Math.round(m.rp/EL_GEN[m.g+1].rp*100))+' % vers '+EL_GEN[m.g+1].n : 'La plus fine'],
             ['Rendement', Math.round(elY(m)*100)+' %', 'Part des puces utilisables'],
             ['Capacité', 'Salles blanches : '+(1+(m.salles||0)), 'Matières rares : '+Math.round(m.ri*100)+' %']];
    if(m.ph) k.push(['Smartphones', m.mod? fmtN(Math.round(m.sales*7))+' / semaine' : 'Aucun modèle', m.mod? 'Note '+Math.round(elScore(b,m.mod))+' contre '+Math.round(elRival())+' pour les rivaux' : 'Concevez votre premier modèle']);
    else k.push(['Événement', m.ev&&m.ev.k==='pen'? 'Pénurie mondiale' : m.ev? 'Contamination' : 'Aucun', metSeasonName()]);
    return k;
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    out.push({k:'seg', act:'rd', label:'Budget de recherche', val:m.rd, opts:EL_RD.map((x,i)=>[i,i?Math.round(x*100)+' %':'Aucun']), sub: elRdOn(b)? 'Part du chiffre d’affaires de base consacrée chaque jour à la recherche : '+eur(R0*EL_RD[m.rd],0)+' / jour.' : (m.rdy? 'La recherche est prête : lancez la nouvelle gravure. Rien n’est dépensé en attendant.' : 'Rien n’est dépensé tant que le palier suivant n’ouvre pas une nouvelle gravure.')});
    if(m.rdy&&EL_GEN[m.g+1]) out.push({k:'btn', act:'gen', label:'Passer à la gravure en '+EL_GEN[m.g+1].n, cost:d.cost*1.5*(m.g+1), sub:'Puces '+Math.round(EL_GEN[m.g+1].v/EL_GEN[m.g].v*100-100)+' % plus chères, mais le rendement redescend vers 54 % avant de remonter.'});
    out.push((m.salles||0)<3? {k:'btn', act:'salle', label:'Agrandir les salles blanches', cost:d.cost*1.5*((m.salles||0)+1), sub:'+30 % de production. Entretien '+eur(R0*.02,0)+' / jour.'} : {k:'buy', act:'salle', label:'Salles blanches', owned:true, sub:'Capacité maximale.'});
    if(mxHas(b,3)&&!m.ph) out.push({k:'btn', act:'ph', label:'Ouvrir une ligne de smartphones', cost:d.cost*5, sub:'Vos puces vous coûtent moins cher que celles des rivaux.'});
    return out;
  },
  acts:{
    rd:(b,v)=>{ b.m.rd=clamp(+v|0,0,3); return ok(''); },
    gen:(b)=>elGen(b,false),
    salle:(b)=>elSalle(b,false),
    ph:(b)=>{ const m=b.m; if(!mxHas(b,3)) return err('Palier 3 requis.'); if(m.ph) return err('Déjà ouverte.'); const c=bizDef(b).cost*5; if(!metBuy(b,c,'Ligne de smartphones')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.ph=1; m.next={e:2,p:2,pr:600,g:m.g,pro:0}; return ok('Ligne ouverte : concevez votre modèle.'); },
    set:(b,arg)=>{ const m=b.m; if(!m.ph) return err('Pas de ligne de smartphones.'); const [k,v]=String(arg).split(':'); m.next=m.next||Object.assign({},m.mod||{e:2,p:2,pr:600,g:m.g,pro:0});
      if(k==='e'||k==='p') m.next[k]=clamp(+v|0,1,3); else if(k==='pr') m.next.pr=clamp(m.next.pr+(+v||0),150,2500); else if(k==='pro'){ if(+v&&!mxHas(b,4)) return err('Palier 4 requis.'); m.next.pro=+v?1:0; }
      m.next.g=m.g; return ok(''); },
    now:(b)=>{ const m=b.m; if(!m.ph||!m.next) return err('Aucun modèle prêt.'); if(m.mod) return err('Le prochain lancement est à la mi-septembre.'); m.mod=Object.assign({},m.next); m.next=null; metLog(b,'premier smartphone lancé.','good'); return ok('Modèle lancé.'); }
  },
  auto: elAuto,
  /* V1.7.5 : objectif de la réserve en délégation totale */
  goal(b){ const m=b.m, d=bizDef(b); if(m.rdy&&EL_GEN[m.g+1]) return {n:'Gravure en '+EL_GEN[m.g+1].n, c:d.cost*1.5*(m.g+1)}; if((m.salles||0)<3) return {n:'Salle blanche', c:d.cost*1.5*((m.salles||0)+1)}; if(mxHas(b,3)&&!m.ph) return {n:'Ligne de smartphones', c:d.cost*5}; return null; }
};
function elRdOn(b){ const m=b.m, nx=EL_GEN[m.g+1], maxG= mxHas(b,5)? 4 : mxHas(b,2)? 2 : mxHas(b,1)? 1 : 0; return !!(nx&&m.g+1<=maxG&&!m.rdy); }
function elGen(b,auto){ const m=b.m, nx=EL_GEN[m.g+1]; if(!nx||!m.rdy) return err('Recherche pas encore prête.'); const c=bizDef(b).cost*1.5*(m.g+1);
  if(!(auto? dlSpend(b,c,'Nouvelle génération') : metBuy(b,c,'Nouvelle génération'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.g++; m.xp=40; m.rp=0; m.rdy=0;   /* V1.7.5 : l’expérience acquise sert en partie (rendement de départ ≈ 54 % au lieu de 35 %) */ metLog(b,'nouvelle gravure en '+nx.n+' : le rendement va remonter peu à peu.','good'); return ok('Gravure en '+nx.n+'.'); }
function elSalle(b,auto){ const m=b.m; if((m.salles||0)>=3) return err('Capacité maximale.'); const c=bizDef(b).cost*1.5*((m.salles||0)+1);
  if(!(auto? dlSpend(b,c,'Salle blanche') : metBuy(b,c,'Salle blanche'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.salles=(m.salles||0)+1; return ok('Salles blanches agrandies.'); }
/* le directeur d'usine équilibre production et recherche */
function elAuto(b,mode,q){ const m=b.m;
  if(S.day%7===0){ const nx=EL_GEN[m.g+1]; m.rd= nx? (elY(m)>.75? 2 : 1) : 0;
    if(m.ph){ const M=m.next||Object.assign({},m.mod||{e:2,p:2,pr:600,g:m.g,pro:0}); M.g=m.g; if(mxHas(b,4)) M.pro=1; M.e=3; M.p=q>.5?3:2;
      let best=M.pr, bv=-1e18; for(let pr=200;pr<=2400;pr+=50){ const T=Object.assign({},M,{pr}), u=elPhoneDemand(b,T,S.day), v=u*(pr-elPhoneCost(T)); if(v>bv){ bv=v; best=pr; } } M.pr=best; m.next=M; if(!m.mod) MET.electronics.acts.now(b); } }
  if(mode!=='full'||S.day%14!==0) return;
  /* passer à la génération suivante quand l'actuelle est rodée */
  if(m.rdy&&elY(m)>.7&&elGen(b,true).ok) return;
  if((m.salles||0)<3&&elSalle(b,true).ok) return;
  if(mxHas(b,3)&&!m.ph&&dlSpend(b,bizDef(b).cost*5,'Ligne de smartphones')){ m.ph=1; m.next={e:2,p:2,pr:600,g:m.g,pro:0}; }
}
/* les smartphones ne passent pas par le stock de composants */
{ const _fd=factoryDay; factoryDay=function(b,revEq){ if(b.def==='electronics'&&b.m&&b.m.phPend){ const ph=b.m.phPend; return _fd(b,Math.max(0,revEq-ph))+ph; } return _fd(b,revEq); }; }

