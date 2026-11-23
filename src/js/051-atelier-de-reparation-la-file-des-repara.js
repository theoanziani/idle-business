/* ============================================================
   ATELIER DE RÉPARATION : la file des réparations
   Des appareils arrivent (téléphone, tablette, ordinateur) avec une panne et un délai promis.
   On les attribue aux techniciens, chacun plus ou moins doué selon l'appareil.
   Systèmes : stock de pièces à commander (livraison en 2 jours), rachat d'appareils cassés à
   reconditionner puis revendre, garantie (retours si la réparation est ratée), avis des clients.
   Événements : pénurie d'une pièce, sortie d'un nouveau modèle, client mécontent.
   Paliers : micro-soudure, contrat avec une assurance, points de dépôt, reconditionné certifié,
   centre agréé par les fabricants.
   Lien : votre usine électronique fournit les pièces 8 % moins cher.
   État b.m (v:1) : tech[] {n, sk{tel,tab,pc}}, q[] (file), st{} (stock), ord[] (commandes),
   auto (répartition automatique), aord (commande automatique), note (/5), dep (points de dépôt),
   ins (assurance), nid, sold, ev, pend, pendC, log.
   ============================================================ */
const RP_DEV = {tel:{n:'Téléphone', f:1}, tab:{n:'Tablette', f:1.2}, pc:{n:'Ordinateur', f:1.5}};
const RP_PB = [
  {id:'ecr', n:'Écran cassé', p:89, part:'ecr', h:1.5, w:5},
  {id:'bat', n:'Batterie usée', p:59, part:'bat', h:1, w:4},
  {id:'con', n:'Connecteur de charge', p:49, part:'con', h:1.2, w:2},
  {id:'log', n:'Problème logiciel', p:39, part:null, h:.8, w:2},
  {id:'car', n:'Carte mère (micro-soudure)', p:149, part:'car', h:3, w:1, rk:1}
];
const RP_PART = {ecr:{n:'Écrans', c:35}, bat:{n:'Batteries', c:18}, con:{n:'Connecteurs', c:8}, car:{n:'Composants de carte', c:25}};
const RP_FIRST = ['Lucas','Inès','Karim','Sofia','Hugo','Léa','Nathan','Yasmine','Tom','Chloé','Ilyes','Manon'];
const rpPb = id => RP_PB.find(x=>x.id===id);
function rpTechSync(b){ const m=b.m, n=Math.max(1,(b.staff.ouvrier&&b.staff.ouvrier.n)||0);
  while(m.tech.length<n){ const i=m.tech.length, r=x=>1+Math.floor(Math.abs(Math.sin((b.id+1)*91.7+i*13.1+x*7.3))*5); m.tech.push({n:RP_FIRST[(b.id+i*5)%RP_FIRST.length], sk:{tel:r(1),tab:r(2),pc:r(3)}, h:0, d:1}); }
  /* trop de techniciens : on retire d'abord ceux créés par défaut (pas les recrues aux talents connus) */
  const gone=[]; while(m.tech.length>n){ let i=m.tech.findIndex(t=>t.d); if(i<0) i=m.tech.length-1; gone.push(m.tech[i].n); m.tech.splice(i,1); }
  if(gone.length) m.q.forEach(j=>{ if(gone.includes(j.tk)) j.tk=null; }); }
function rpInit(b){ const m={v:1, tech:[], q:[], st:{ecr:6,bat:6,con:6,car:0}, ord:[], auto:1, aord:1, note:4, dep:0, ins:0, cert:0, agr:0, nid:1, sold:0, ev:null, pend:0, pendC:0, log:[]}; b.m=m; rpTechSync(b); return m; }
const rpPartCost = (b,k) => RP_PART[k].c*rpPf(b)*(S.biz.some(x=>x.def==='electronics'&&x.status==='active')?.92:1)*(b.m.ev&&b.m.ev.k==='pen'&&b.m.ev.p===k&&b.m.ev.until>=S.day?2:1);
function rpSpeed(t,dev){ return .6+.15*t.sk[dev]; }
const rpPf = b => Math.pow(5/3,(b.lvl||1)-1);
function rpArrivals(b){ const m=b.m; return 1.7*m.tech.length*(.55+.12*m.note)*(1+.5*m.dep)*(m.ins?1.3:1)*(m.agr?1.15:1)*(m.ev&&m.ev.k==='new'&&m.ev.until>=S.day?1.4:1); }
function rpNewJob(b,o){ const m=b.m, L=RP_PB.filter(p=>!p.rk||mxHas(b,p.rk)), pb=o&&o.pb? rpPb(o.pb) : wpick(L,p=>p.w), dev=o&&o.dev||wpick(['tel','tel','tel','tab','pc'],x=>1);
  const f=RP_DEV[dev].f, ins=!o&&m.ins&&rnd()<.3;
  m.q.push({id:m.nid++, dev, pb:pb.id, price:o&&o.recon? 0 : Math.round(pb.p*f*(ins?.9:1)*(m.agr?1.2:1)*rpPf(b)), h:pb.h*f, done:0, tk:null, due:S.day+(o&&o.recon?60:rint(2,4)), recon:o&&o.recon?1:0, ret:o&&o.ret?1:0, ins:ins?1:0, part:pb.part&&!(o&&o.ret)? 0 : 1}); }
/* répartition : chaque technicien prend le travail qui lui va le mieux (ou le premier venu) */
function rpAssign(b,smart){ const m=b.m;
  /* chaque appareil va au technicien libre le plus doué pour ce type d'appareil (retours et urgences d'abord) */
  const jobs=m.q.filter(j=>!j.tk&&j.part).sort((a,c)=>((c.ret||0)-(a.ret||0))||(a.due-c.due));
  jobs.forEach(j=>{ const F=m.tech.filter(t=>!m.q.some(x=>x.tk===t.n)); if(!F.length) return; j.tk=F.sort((x,y)=>(y.sk[j.dev]||0)-(x.sk[j.dev]||0))[0].n; }); }
MET.repair = {
  fam:'ind', core:true, init:rpInit,
  ranks:[
    {n:'Micro-soudure', d:'Les réparations de carte mère, longues mais très bien payées.'},
    {n:'Contrat avec une assurance', d:'Un assureur vous envoie ses clients : +30 % d’appareils, payés 10 % moins cher.'},
    {n:'Points de dépôt', d:'Ouvrez des points de dépôt dans la ville : +50 % d’appareils chacun.'},
    {n:'Reconditionné certifié', d:'Vos téléphones reconditionnés se revendent 30 % plus cher.'},
    {n:'Centre agréé', d:'Agréé par les fabricants : réparations 20 % plus chères et plus de clients.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b); return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC+R0*.02*m.dep}; },
  daily(b,ctx){ const m=b.m;
    if(ctx.open){ m.pend=0; m.pendC=0; }
    rpTechSync(b); if(dlMode(b)==='me') m.smart=0;
    /* livraisons de pièces */
    m.ord=m.ord.filter(o=>{ if(S.day>=o.d){ m.st[o.k]=(m.st[o.k]||0)+o.n; return false; } return true; });
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(!ctx.open) return;
    /* nouveaux appareils */
    let n=rpArrivals(b)*weFactor(b); while(n>0){ if(rnd()<Math.min(1,n)) rpNewJob(b); n-=1; }
    /* pièces réservées */
    m.q.forEach(j=>{ if(!j.part){ const k=rpPb(j.pb).part; if((m.st[k]||0)>0){ m.st[k]--; j.part=1; } } });
    if(m.auto||m.smart) rpAssign(b,!!m.smart);
    /* travail */
    const sf=clamp(staffFactor(b),.4,1.2);
    m.tech.forEach(t=>{ let hrs=3.5*sf; while(hrs>0){ const j=m.q.find(x=>x.tk===t.n); if(!j) break;
      const sp=rpSpeed(t,j.dev), need=(j.h-j.done)/sp, use=Math.min(hrs,need); j.done+=use*sp; hrs-=use;
      if(j.done>=j.h-1e-6){ m.q=m.q.filter(x=>x!==j); rpFinish(b,j,t); if(m.auto||m.smart) rpAssign(b,!!m.smart); } } });
    /* délais dépassés */
    if(m.q.filter(j=>!j.recon).length>8*m.tech.length){ const lost=m.q.filter(j=>!j.recon&&!j.tk).slice(6*m.tech.length); m.q=m.q.filter(j=>!lost.includes(j)); m.note=clamp(m.note-.1,1,5); metLog(b,'trop d’attente : des clients repartent avec leur appareil.','bad'); }
    /* commande automatique des pièces */
    if(m.aord) Object.keys(RP_PART).forEach(k=>{ if(k==='car'&&!mxHas(b,1)) return; const need=m.q.filter(j=>!j.part&&rpPb(j.pb).part===k).length, pend=m.ord.filter(o=>o.k===k).reduce((a,o)=>a+o.n,0);
      if((m.st[k]||0)+pend<3+need) rpOrder(b,k,5+need,true); });
    /* événements */
    if(!m.ev){ const r=rnd();
      if(r<.004){ const k=pick(['ecr','bat','con']); m.ev={k:'pen', p:k, until:S.day+12}; metLog(b,'pénurie de '+RP_PART[k].n.toLowerCase()+' : prix doublé et livraison en 7 jours pendant 12 jours.','warn'); }
      else if(r<.007){ m.ev={k:'new', until:S.day+20}; metLog(b,'sortie d’un nouveau modèle de téléphone : beaucoup d’écrans cassés à prévoir.','good'); }
      else if(r<.009){ m.note=clamp(m.note-.25,1,5); metLog(b,'un client mécontent laisse un avis assassin en ligne.','bad'); } }
  },
  kpis(b){ const m=b.m, wait=m.q.filter(j=>!j.recon).length, late=m.q.filter(j=>!j.recon&&S.day>j.due).length;
    return [['En attente', String(wait), late? late+' en retard' : 'Aucun retard'],
            ['Avis des clients', m.note.toFixed(1).replace('.',NDEC)+' / 5', m.note>=4.5?'Excellents':m.note>=4?'Très bons':m.note>=3.5?'Corrects':'Mauvais'],
            ['Techniciens', String(m.tech.length), 'Recrutez des ouvriers pour en avoir plus'],
            ['Pièces en stock', ['ecr','bat','con'].map(k=>m.st[k]||0).join(' · '), 'Écrans · batteries · connecteurs']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    out.push({k:'tog', act:'auto', label:'Répartition automatique', val:m.auto, sub:'Chaque appareil va au technicien libre le plus doué pour ce type d’appareil, les retours et les urgences d’abord.'});
    out.push({k:'tog', act:'aord', label:'Commande automatique des pièces', val:m.aord, sub:'Recommande quand le stock baisse. Livraison en 2 jours.'});
    out.push({k:'btn', act:'buy', label:'Racheter 5 téléphones cassés', cost:5*45*rpPf(b), sub:'À réparer quand l’atelier a du temps, puis revendus reconditionnés environ '+eur(160*rpPf(b)*(m.cert?1.3:1),0)+' pièce.'});
    if(mxHas(b,2)) out.push(m.ins? {k:'buy', act:'ins', label:'Contrat avec une assurance', owned:true, sub:'+30 % d’appareils, payés 10 % moins cher.'} : {k:'buy', act:'ins', label:'Signer avec une assurance', cost:d.cost*1.5, sub:'+30 % d’appareils, payés 10 % moins cher.'});
    if(mxHas(b,3)) out.push(m.dep<3? {k:'btn', act:'dep', label:'Ouvrir un point de dépôt ('+m.dep+' sur 3)', cost:d.cost*2*(m.dep+1), sub:'+50 % d’appareils. '+eur(R0*.02,0)+' par jour.'} : {k:'buy', act:'dep', label:'Points de dépôt', owned:true, sub:'Trois points de dépôt.'});
    if(mxHas(b,4)) out.push(m.cert? {k:'buy', act:'cert', label:'Reconditionné certifié', owned:true, sub:'Revente +30 %.'} : {k:'buy', act:'cert', label:'Certification reconditionné', cost:d.cost*3, sub:'Vos reconditionnés se revendent 30 % plus cher.'});
    if(mxHas(b,5)) out.push(m.agr? {k:'buy', act:'agr', label:'Centre agréé', owned:true, sub:'Réparations +20 %, plus de clients.'} : {k:'buy', act:'agr', label:'Devenir centre agréé', cost:d.cost*6, sub:'Réparations 20 % plus chères et 15 % de clients en plus.'});
    return out;
  },
  acts:{
    auto:(b,v)=>{ b.m.auto=+v?1:0; return ok(''); },
    aord:(b,v)=>{ b.m.aord=+v?1:0; return ok(''); },
    as:(b,arg)=>{ const [jid,tn]=String(arg).split(':'), m=b.m, j=m.q.find(x=>x.id===+jid); if(!j) return err('Appareil introuvable.'); if(!j.part) return err('Pièce pas encore en stock.');
      const t=m.tech.find(x=>x.n===tn); if(!t) return err('Technicien introuvable.'); m.q.forEach(x=>{ if(x.tk===t.n&&x!==j&&x.done===0) x.tk=null; }); j.tk=t.n; return ok(t.n+' s’occupe de cet appareil.'); },
    ord:(b,k)=>rpOrder(b,k,5,false),
    buy:(b)=>{ const c=5*45*rpPf(b); if(!metBuy(b,c,'Rachat d’appareils cassés')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); for(let i=0;i<5;i++) rpNewJob(b,{recon:1, dev:'tel', pb:pick(['ecr','bat','con'])}); return ok('5 téléphones à reconditionner.'); },
    ins:(b)=>rpBuy(b,'ins',1.5,'Contrat avec une assurance',2),
    dep:(b)=>{ const m=b.m; if(!mxHas(b,3)) return err('Palier 3 requis.'); if(m.dep>=3) return err('Trois points au maximum.'); const c=bizDef(b).cost*2*(m.dep+1); if(!metBuy(b,c,'Point de dépôt')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.dep++; return ok('Point de dépôt ouvert.'); },
    cert:(b)=>rpBuy(b,'cert',3,'Certification reconditionné',4),
    agr:(b)=>rpBuy(b,'agr',6,'Centre agréé',5)
  },
  auto: rpAuto
};
function rpBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
/* les pièces sont payées à la commande ; elles entrent en stock à la livraison */
function rpOrder(b,k,n,auto){ const m=b.m; if(!RP_PART[k]) return err('Pièce inconnue.'); if(k==='car'&&!mxHas(b,1)) return err('Palier 1 requis.');
  const c=rpPartCost(b,k)*n; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante.'); m.pendC+=c;
  const pen=m.ev&&m.ev.k==='pen'&&m.ev.p===k&&m.ev.until>=S.day; m.ord.push({k, n, d:S.day+(pen?7:2)});
  return ok(n+' '+RP_PART[k].n.toLowerCase()+' commandés.'); }
function rpFinish(b,j,t){ const m=b.m, pb=rpPb(j.pb);
  if(j.recon){ m.pend+=160*rpPf(b)*(m.cert?1.3:1)*clamp(.7+.08*t.sk.tel,.7,1.1); m.sold++; return; }
  if(!j.ret) m.pend+=j.price*(S.day>j.due?.8:1);
  const late=Math.max(0,S.day-j.due), r= late>3? 1.5 : late>0? 3 : 4.6+.1*t.sk[j.dev]/5; m.note=clamp(m.note+(r-m.note)*.05,1,5);
  if(!j.ret&&rnd()<clamp(.09-.014*t.sk[j.dev],.01,.08)){ rpNewJob(b,{ret:1, dev:j.dev, pb:j.pb}); m.note=clamp(m.note+(2-m.note)*.05,1,5); metLog(b,'retour sous garantie : « '+pb.n+' » ('+RP_DEV[j.dev].n.toLowerCase()+') à refaire gratuitement.','warn'); }
}
/* le chef d'atelier commande les pièces et répartit la file selon les talents */
function rpAuto(b,mode,q){ const m=b.m; m.aord=1; m.auto=1; m.smart= rnd()<(1-q)*.3? 0 : 1;
  m.q.forEach(j=>{ if(j.tk&&j.done===0) j.tk=null; }); rpAssign(b,!!m.smart);
  if(mode!=='full'||S.day%14!==0) return;
  const back=m.q.filter(j=>!j.recon).length, cap=m.tech.length*3;
  if(back<cap*.3&&m.q.filter(j=>j.recon).length<2&&dlSpend(b,5*45*rpPf(b),'Rachat d’appareils cassés')) for(let i=0;i<5;i++) rpNewJob(b,{recon:1, dev:'tel', pb:pick(['ecr','bat','con'])});
  const calm=back<cap*.4&&!m.q.some(j=>!j.recon&&S.day>j.due);
  if(mxHas(b,2)&&!m.ins&&calm&&rpBuy(b,'ins',1.5,'Contrat avec une assurance',2,true).ok) return;
  if(mxHas(b,3)&&m.dep<3&&back<cap*.4&&!m.q.some(j=>!j.recon&&S.day>j.due)&&m.note>4&&dlSpend(b,bizDef(b).cost*2*(m.dep+1),'Point de dépôt')){ m.dep++; return; }
  if(mxHas(b,4)&&!m.cert&&rpBuy(b,'cert',3,'Certification reconditionné',4,true).ok) return;
  if(mxHas(b,5)&&!m.agr) rpBuy(b,'agr',6,'Centre agréé',5,true);
}

/* ---------- Recrutement des techniciens : leurs talents sont connus avant l'embauche ---------- */
function rpSk(prod){ const base=clamp(Math.round(1+2.4*((prod||1)-.7)),1,4), r=()=>clamp(base+rint(-1,1),1,5); return {tel:r(),tab:r(),pc:r()}; }
const roleS = (e,r) => (e&&e.def==='repair'&&r==='ouvrier')? 'Technicien' : D.ROLES[r].s;
function rpSkTxt(sk){ return sk? 'Téléphones '+'★'.repeat(sk.tel)+' · Tablettes '+'★'.repeat(sk.tab)+' · PC '+'★'.repeat(sk.pc) : ''; }
function rpHired(e,c){ if(!e||e.def!=='repair'||!c||!c.sk||!e.m||!e.m.tech) return; e.m.tech.push({n:c.name, sk:Object.assign({},c.sk), h:0}); }
{ const _ac=agencyCand; agencyCand=function(role,bonus){ const c=_ac(role,bonus); if(role==='ouvrier') c.sk=rpSk(c.prod); return c; }; }
{ const _gc=genCands; genCands=function(e,role){ const out=_gc(e,role); if(role==='ouvrier') out.forEach(c=>{ c.sk=rpSk(c.prod); }); return out; }; }
{ const _h=hire; hire=function(e,role,candId){ const c=candId&&e.cands&&(e.cands[role]||[]).find(x=>x.id===candId); const r=_h(e,role,candId); if(r.ok&&role==='ouvrier') rpHired(e,c); return r; }; }
{ const _ah=agencyHire; agencyHire=function(candId,key){ const A=agencyInit(), c=A.pool.find(x=>x.id===candId), e=entByKey(key); const r=_ah(candId,key); if(r.ok&&c&&c.role==='ouvrier') rpHired(e,c); return r; }; }

