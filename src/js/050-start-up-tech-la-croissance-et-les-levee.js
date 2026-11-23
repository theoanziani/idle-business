/* ============================================================
   START-UP TECH : la croissance et les levées de fonds (fusion SaaS + IA)
   Utilisateurs gratuits, abonnés Pro, comptes Société, départs, revenu mensuel (MRR).
   Feuille de route : une fonctionnalité en développement à la fois (vitesse = ingénieurs).
   Levées de fonds : amorçage, série A, série B. L'argent va dans la trésorerie de la start-up,
   qui paie ses pertes tant qu'elle a de quoi (durée de survie) ; en échange vous cédez une part
   et les investisseurs fixent un objectif. Les bénéfices sont partagés avec eux.
   Pivot IA (palier 3) : on entraîne des modèles, notés face aux rivaux ; l'API rapporte selon la note.
   Paliers : amorçage, série A, pivot IA, série B, introduction en bourse ou rachat.
   État b.m (v:1) : F, P, E, pp (prix Pro), pe (prix Société), mk (marketing), feat{}, dev {id,p},
   cash, own, rounds, obj, ai, mdl, riv, tr (entraînement en cours), ev, pend, pendC, log.
   ============================================================ */
const SA_FEAT = [
  {id:'mob', n:'Application mobile', w:30, q:.3},
  {id:'col', n:'Mode collaboratif', w:40, q:.25, cp:1.2},
  {id:'int', n:'Intégrations', w:35, cp:1.15, ce:1.2},
  {id:'dash', n:'Tableaux de bord', w:25, cp:1.15},
  {id:'sso', n:'Connexion unique (SSO)', w:30, ce:1.6},
  {id:'api', n:'API publique', w:45, q:.15, ce:1.3},
  {id:'sec', n:'Certification de sécurité', w:40, ce:1.4, ech:.7},
  {id:'intl', n:'Version internationale', w:60, tam:1.8, rk:2},
  {id:'ia', n:'Assistant IA', w:50, q:.5, cp:1.2, rk:3}
];
const SA_MK = [0,.2,.5,1];
const SA_ROUND = [
  {n:'Amorçage', need:.5, sh:.15, mult:8},
  {n:'Série A', need:2, sh:.2, mult:9},
  {n:'Série B', need:6, sh:.15, mult:10}
];
const saK = b => metR0(b)/90;
function saQual(b){ const m=b.m; let q=1; SA_FEAT.forEach(f=>{ if(m.feat[f.id]) q+=f.q||0; }); if(m.ev&&m.ev.k==='copie'&&m.ev.until>=S.day) q-=.2; return Math.max(.5,q); }
function saMul(b,k){ const m=b.m; let x=1; SA_FEAT.forEach(f=>{ if(m.feat[f.id]&&f[k]) x*=f[k]; }); return x; }
function saTam(b){ return 12000*saK(b)*(b.lvl||1)*saMul(b,'tam')*(.8+.4*saQual(b)); }
function saMRR(b){ const m=b.m; return m.P*m.pp+m.E*m.pe; }
function saApi(b){ const m=b.m; if(!m.ai||!m.mdl) return 0; const ap=2.5/(1+Math.exp(-(m.mdl-m.riv)/8)); return metR0(b)*2*ap*(b.lvl||1); }
function saInit(b){ const k=saK(b);
  return {v:1, F:300*k, P:15*k, E:0, pp:12, pe:400, mk:1, feat:{}, dev:{id:'mob',p:0}, cash:0, own:1, rounds:0, obj:null, ai:0, mdl:0, riv:60, tr:null, ev:null, pend:0, pendC:0, gH:[], log:[]}; }
/* reprise d'une ancienne start-up (SaaS ou IA) : utilisateurs déduits du chiffre d'affaires */
function saFromOld(b){ const m=saInit(b), rev=b.last&&b.last.rev>0? b.last.rev : metR0(b);
  m.P=rev*30*.6/m.pp; m.E=rev*30*.4/m.pe; m.F=m.P*15; if(b.saFromAi){ m.ai=1; m.mdl=62; b.saFromAi=0; } return m; }
function saConvertAi(s){ if(!s||!Array.isArray(s.biz)) return; s.biz.forEach(b=>{ if(b.def!=='ai') return; b.def='saas'; b.m=null; b.saFromAi=1;
  (s.journal=s.journal||[]).push({d:s.day,s:'info',k:'own',m:'« '+b.name+' » devient une start-up tech qui a déjà fait son pivot vers l’IA.'}); }); }
{ const _mig=migrateState; migrateState=function(s){ const r=_mig(s); try{ saConvertAi(r); }catch(e){ console.error(e); } return r; }; }
MET.saas = {
  fam:'num', core:true,
  init(b){ return (b.hist&&b.hist.length>5)||b.saFromAi? saFromOld(b) : saInit(b); },
  ranks:[
    {n:'Amorçage', d:'Une première levée de fonds réussie.'},
    {n:'Série A', d:'La start-up passe à l’échelle. La version internationale peut être développée.'},
    {n:'Pivot IA', d:'Transformez la start-up en laboratoire d’IA : entraînez vos propres modèles.'},
    {n:'Série B', d:'Une levée de grande ampleur.'},
    {n:'Introduction en bourse', d:'Introduisez la société en bourse ou vendez-la à un géant de la tech.'}
  ],
  rankSub:b=>{ const m=b.m, r=mxRank(b); if(r>=5) return ''; if(r===2) return 'Le pivot IA s’ouvre avec la maîtrise ('+Math.round(b.mx||0)+' / '+MX_STEPS[3]+').'; if(r===4) return 'L’introduction en bourse s’ouvre avec la maîtrise ('+Math.round(b.mx||0)+' / '+MX_STEPS[5]+').';
    const R=SA_ROUND[m.rounds]; return R? 'Prochain palier : '+R.n.toLowerCase()+', ouvert quand le chiffre d’affaires atteint '+eur(R.need*metR0(b),0)+' par jour.' : ''; },
  rankProg:b=>{ const m=b.m, r=mxRank(b), x=b.mx||0; if(r>=5) return null; if(r===2) return clamp(x/MX_STEPS[3],0,1); if(r===4) return clamp(x/MX_STEPS[5],0,1);
    const R=SA_ROUND[m.rounds]; return R? clamp(saMRR(b)/30/(R.need*metR0(b)),0,1) : null; },
  rank(b){ const m=b.m, x=b.mx||0, s=m.rounds||0; if(s>=3) return x>=MX_STEPS[5]? 5 : 4; if(s>=2) return x>=MX_STEPS[3]? 3 : 2; return s; },
  mods(b){ const m=b.m, R0=metR0(b), k=saK(b);
    const serv=(m.F*.004+m.P*.06+m.E*1.2)*(S.biz.some(x=>x.def==='dc'&&x.status==='active')?.7:1);
    const inv= m.own<1&&b.last&&b.last.net>0? (1-m.own)*b.last.net : 0;
    /* V2.2.5 : saturation du marché : moins d’abonnés payants, donc moins de serveurs (avant : seules les recettes baissaient) */
    const sat=(typeof BAL_DEM!=='undefined'&&BAL_DEM.includes('saas'))? (b.satF||1) : 1;
    return { vol:0, cogs:0, rev:(saMRR(b)/30+saApi(b))*sat+m.pend, fixed:serv*sat+R0*SA_MK[m.mk]+inv+m.pendC };
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b), q=saQual(b), tam=saTam(b);
    if(ctx.open){ m.pend=0; m.pendC=0; }
    /* la trésorerie de la start-up paie ses pertes */
    if(b.last&&b.last.net<0&&m.cash>0){ const c=Math.min(m.cash,-b.last.net); m.cash-=c; m.pend+=c; if(m.cash<=0) metLog(b,'la trésorerie de la start-up est épuisée : les pertes sont désormais à votre charge.','warn'); }
    /* croissance */
    const down=m.ev&&m.ev.k==='panne'&&m.ev.until>=S.day;
    const all=m.F+m.P+m.E;
    const cac=2*(1+4*Math.min(1.5,(m.F+m.P)/tam)), paid=R0*SA_MK[m.mk]/cac*Math.max(0,1-all/tam);
    const org=.012*q*m.F*Math.max(0,1-all/tam)+3*saK(b);
    m.F=Math.max(0,m.F+org+paid-m.F*.0015);
    const cp=.00025*saMul(b,'cp')*q*Math.pow(12/m.pp,1.3), ce=.00004*saMul(b,'ce')*q*Math.pow(400/m.pe,1.1);
    const nP=m.F*cp, nE=m.P*ce;
    m.F-=nP; m.P+=nP-nE-m.P*(.004*(down?3:1)/Math.sqrt(q)); m.E+=nE-m.E*(.002*saMul(b,'ech')*(down?3:1));
    m.P=Math.max(0,m.P); m.E=Math.max(0,m.E);
    if((S.day%30)===0){ m.gH.push(Math.round(saMRR(b))); if(m.gH.length>13) m.gH.shift(); }
    /* développement */
    if(m.dev){ const f=SA_FEAT.find(x=>x.id===m.dev.id); const ing=(b.staff.ing&&b.staff.ing.n)||0; m.dev.p+=ctx.open? Math.max(.3,ing*clamp(staffFactor(b),.3,1.2)) : 0;
      if(f&&m.dev.p>=f.w){ m.feat[f.id]=1; metLog(b,'nouvelle fonctionnalité en ligne : « '+f.n+' ».','good'); m.dev=null; } }
    /* objectifs des investisseurs */
    if(m.obj&&S.day>=m.obj.until){ if(saMRR(b)/30<m.obj.need){ m.own=Math.max(.2,m.own-.05); S.rep=clamp(S.rep-1,0,100); metLog(b,'objectif des investisseurs manqué : ils exigent une part supplémentaire (−5 points pour vous).','bad'); } else metLog(b,'objectif des investisseurs atteint : la confiance est là.','good'); m.obj=null; }
    else if(m.obj&&saMRR(b)/30>=m.obj.need){ metLog(b,'objectif des investisseurs atteint en avance.','good'); m.obj=null; }
    /* IA : entraînement et rivaux */
    m.riv+=15/360; if(m.ai&&!m.ev&&rnd()<.003){ m.riv+=8; metLog(b,'un rival sort un meilleur modèle : votre API perd de l’attrait.','bad'); }
    if(m.tr&&S.day>=m.tr.end){ const ing=(b.staff.ing&&b.staff.ing.n)||1; const sc=50+9*Math.log2(m.tr.s)+Math.min(10,Object.keys(m.feat).length*1.2)+Math.min(8,ing*1.5)+5*norm();
      if(sc>m.mdl){ m.mdl=sc; metLog(b,'nouveau modèle d’IA : note '+Math.round(sc)+' (rivaux : '+Math.round(m.riv)+').','good'); } else metLog(b,'l’entraînement donne un modèle moins bon que l’actuel ('+Math.round(sc)+').','warn'); m.tr=null; }
    /* événements */
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(!m.ev){ const r=rnd();
      if(r<.003){ m.ev={k:'copie', until:S.day+60}; metLog(b,'un concurrent copie votre produit : attrait en baisse pendant 60 jours. De nouvelles fonctionnalités vous démarquent.','warn'); }
      else if(r<.005&&m.E>3){ const n=Math.round(m.E*.15); m.E-=n; metLog(b,'un gros client part chez un concurrent ('+n+' comptes Société en moins).','bad'); }
      else if(r<.007){ m.ev={k:'panne', until:S.day+1}; metLog(b,'panne de service : des abonnés résilient.','bad'); } }
  },
  kpis(b){ const m=b.m, mrr=saMRR(b), h=m.gH, g=h.length>=2&&h[h.length-2]>0? h[h.length-1]/h[h.length-2]-1 : 0;
    const burn=b.last? -b.last.net+(m.pend||0) : 0;
    return [['Revenu mensuel', eur(mrr,0), (g>=0?'+':'')+Math.round(g*100)+' % sur un mois'],
            ['Utilisateurs', fmtN(Math.round(m.F+m.P)), fmtN(Math.round(m.P))+' Pro · '+fmtN(Math.round(m.E))+' Société'],
            ['Trésorerie de la start-up', eur(m.cash,0), m.cash>0&&burn>0? 'Survie : '+Math.round(m.cash/burn)+' jours' : m.cash>0? 'Rentable' : 'Pertes à votre charge'],
            ['Votre part', Math.round(m.own*100)+' %', m.ai? 'Modèle d’IA : '+(m.mdl?Math.round(m.mdl):'aucun')+' (rivaux '+Math.round(m.riv)+')' : 'Valeur : '+eur(saVal(b),0)]];
  },
  ctl(b){ const m=b.m, R0=metR0(b), out=[];
    out.push({k:'seg', act:'pp', label:'Abonnement Pro : '+eur(m.pp,0)+' / mois', val:'x', opts:[[-5,'−5 €'],[-1,'−1 €'],[1,'+1 €'],[5,'+5 €']], sub:'Moins cher, plus d’utilisateurs gratuits passent Pro.'});
    out.push({k:'seg', act:'pe', label:'Offre Société : '+eur(m.pe,0)+' / mois', val:'x', opts:[[-100,'−100 €'],[-20,'−20 €'],[20,'+20 €'],[100,'+100 €']], sub:'Les fonctionnalités SSO, API et sécurité attirent les sociétés.'});
    out.push({k:'seg', act:'mk', label:'Publicité', val:m.mk, opts:[[0,'Aucune'],[1,'Légère'],[2,'Soutenue'],[3,'Massive']], sub:eur(R0*SA_MK[m.mk],0)+' par jour. Chaque nouvel utilisateur coûte plus cher quand le marché se remplit.'});
    const R=SA_ROUND[m.rounds]; if(R){ const need=R.need*R0, okk=saMRR(b)/30>=need, val=saVal(b)/Math.max(.01,m.own), amt=val*R.sh;
      out.push({k:'btn', act:'raise', label:'Levée de fonds : '+R.n.toLowerCase(), bl:'Lever '+eur(amt,0), dis:!okk||!!m.obj, why:m.obj?'Une levée est déjà en cours : atteignez d’abord son objectif.':undefined, sub: okk? 'Les investisseurs apportent '+eur(amt,0)+' à la start-up contre '+Math.round(R.sh*100)+' % du capital. Objectif imposé : doubler le chiffre d’affaires en 180 jours.' : 'Il faut un chiffre d’affaires de '+eur(need,0)+' par jour (actuellement '+eur(saMRR(b)/30,0)+').'}); }
    if(mxHas(b,3)&&!m.ai) out.push({k:'btn', act:'pivot', label:'Pivot vers l’IA', cost:D.biz.ai.cost, sub:'La start-up devient un laboratoire d’IA : entraînez des modèles et vendez l’accès à leur API.'});
    if(m.ai){ if(m.tr) out.push({k:'btn', act:'train', label:'Entraînement en cours', cost:0, dis:true, sub:'Fin dans '+(m.tr.end-S.day)+' jours.'});
      else [[1,'petit',20,20],[4,'moyen',60,35],[16,'grand',180,60]].forEach(([s,n,c,dd])=>out.push({k:'btn', act:'train', arg:s, label:'Entraîner un '+n+' modèle', cost:R0*c*(S.biz.some(x=>x.def==='dc'&&x.status==='active')?.6:1), sub:dd+' jours de calcul. Plus le modèle est grand, meilleure est sa note.'})); }
    if(mxHas(b,5)){ out.push({k:'btn', act:'ipo', label:'Introduction en bourse', gain:saVal(b)*.3, sub:'Vous vendez 30 % de votre part en bourse et gardez le reste.'});
      out.push({k:'btn', act:'exit', label:'Vendre à un géant de la tech', gain:saVal(b)*1.25, sub:'Rachat de toute la société, avec une prime de 25 %.'}); }
    return out;
  },
  acts:{
    pp:(b,v)=>{ b.m.pp=clamp(b.m.pp+(+v||0),3,99); return ok(''); },
    pe:(b,v)=>{ b.m.pe=clamp(b.m.pe+(+v||0),50,5000); return ok(''); },
    mk:(b,v)=>{ b.m.mk=clamp(+v|0,0,3); return ok(''); },
    dev:(b,id)=>{ const f=SA_FEAT.find(x=>x.id===id); if(!f) return err('Fonctionnalité inconnue.'); if(b.m.feat[id]) return err('Déjà en ligne.'); if(f.rk&&!mxHas(b,f.rk)&&!(f.id==='ia'&&b.m.ai)) return err('Palier '+f.rk+' requis.'); if(f.id==='ia'&&!b.m.ai) return err('Il faut d’abord le pivot vers l’IA.');
      b.m.dev={id, p:b.m.dev&&b.m.dev.id===id? b.m.dev.p : 0}; return ok('Les ingénieurs travaillent sur « '+f.n+' ».'); },
    raise:(b)=>saRaise(b),
    pivot:(b)=>{ const m=b.m; if(!mxHas(b,3)) return err('Palier 3 requis.'); if(m.ai) return err('Déjà fait.'); const c=D.biz.ai.cost; if(!metBuy(b,c,'Pivot vers l’IA')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.ai=1; metLog(b,'pivot réussi : la start-up devient un laboratoire d’IA.','good'); return ok('Pivot vers l’IA.'); },
    train:(b,s)=>saTrain(b,+s,false),
    ipo:(b)=>{ const m=b.m; if(!mxHas(b,5)) return err('Palier 5 requis.'); const v=saVal(b)*.3; payCap('b:'+b.id,'Introduction en bourse : '+b.name,v); m.own*=.7; metLog(b,'introduction en bourse : '+eur(v,0)+' encaissés.','good'); return ok('Introduction en bourse réussie.'); },
    exit:(b)=>{ if(!mxHas(b,5)) return err('Palier 5 requis.'); const v=saVal(b)*1.25; closeBiz(b,v,'un géant de la tech'); return ok('Start-up vendue '+eur(v,0)+'.'); }
  },
  auto: saAuto
};
/* valorisation : un multiple du revenu annuel selon la croissance, pour votre part */
function saVal(b){ const m=b.m, h=m.gH, g=h.length>=4&&h[h.length-4]>0? Math.pow(h[h.length-1]/h[h.length-4],1/3)-1 : 0;
  const mult=clamp(1+8*g,1,4); return (saMRR(b)*12*mult+saApi(b)*360*2)*m.own; }
{ const _bv=bizValue; bizValue=function(b){ const v=_bv(b); if(b.def==='saas'&&b.m&&b.m.v===1&&b.status==='active') return Math.max(v*.5, saVal(b)); return v; }; }
function saRaise(b){ const m=b.m, R=SA_ROUND[m.rounds]; if(!R) return err('Plus de levée prévue.'); if(m.obj) return err('Atteignez d’abord l’objectif en cours.');
  if(saMRR(b)/30<R.need*metR0(b)) return err('Chiffre d’affaires insuffisant.');
  const amt=saVal(b)/Math.max(.01,m.own)*R.sh; m.cash+=amt; m.own=Math.max(.2,m.own*(1-R.sh)); m.rounds++;
  m.obj={need:saMRR(b)/30*2, until:S.day+180}; metLog(b,R.n+' bouclée : '+eur(amt,0)+' levés, votre part passe à '+Math.round(m.own*100)+' %.','good'); return ok(R.n+' : '+eur(amt,0)+' levés.'); }
function saTrain(b,s,auto){ const m=b.m; if(!m.ai) return err('Il faut d’abord le pivot vers l’IA.'); if(m.tr) return err('Un entraînement est déjà en cours.');
  const T={1:[20,20],4:[60,35],16:[180,60]}[s]; if(!T) return err('Taille inconnue.'); const c=metR0(b)*T[0]*(S.biz.some(x=>x.def==='dc'&&x.status==='active')?.6:1);
  if(!(auto? dlSpend(b,c,'Entraînement d’un modèle') : metBuy(b,c,'Entraînement d’un modèle'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.tr={s, end:S.day+T[1]}; return ok('Entraînement lancé : '+T[1]+' jours.'); }
/* le directeur produit choisit les fonctionnalités ; les levées restent à vous */
function saAuto(b,mode,q){ const m=b.m;
  if(!m.dev){ const order=['mob','dash','col','int','sso','api','sec','intl','ia']; const id=order.find(i=>{ const f=SA_FEAT.find(x=>x.id===i); return !m.feat[i]&&(!f.rk||mxHas(b,f.rk)||(i==='ia'&&m.ai))&&(i!=='ia'||m.ai); }); if(id) m.dev={id,p:0}; }
  if(S.day%7===0){ const tam=saTam(b); m.mk= m.F<tam*.5? 2 : m.F<tam*.8? 1 : 0; if(m.cash<=0&&b.last&&b.last.net<0) m.mk=Math.min(m.mk,1);
    m.pp=clamp(Math.round(8+4*saQual(b)+(1-q)*4*(rnd()-.5)),5,40); m.pe=clamp(Math.round((250+120*saMul(b,'ce'))/10)*10,100,2000); }
  /* V1.5.8 : en délégation totale, la réserve finance une publicité massive tant qu'il reste des clients à gagner */
  if(S.day%7===0) m.mkB=m.mk;
  if(mode==='full'){ const base=m.mkB===undefined? m.mk : m.mkB; if(base<3&&m.F<saTam(b)*.8){ const need=metR0(b)*(SA_MK[3]-SA_MK[base]); if(dlBudget(b)>=need*7){ b.dlp-=need; m.mk=3; } else m.mk=base; } }
  if(mode!=='full'||S.day%14!==0) return;
  /* V1.6.2 : le directeur lève des fonds dès que le chiffre d'affaires le permet (c'est ce qui fait monter les paliers), puis pivote vers l'IA sur la réserve */
  { const R=SA_ROUND[m.rounds]; if(R&&!m.obj&&saMRR(b)/30>=R.need*metR0(b)&&saRaise(b).ok) metLog(b,'le directeur boucle une levée de fonds.','good'); }
  if(mxHas(b,3)&&!m.ai&&D.biz.ai) dlAct(b,D.biz.ai.cost,()=>MET.saas.acts.pivot(b));
  if(m.ai&&!m.tr){ for(const s of [16,4,1]){ if(saTrain(b,s,true).ok) break; } }
}

