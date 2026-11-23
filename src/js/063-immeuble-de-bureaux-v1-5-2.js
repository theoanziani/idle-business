/* ============================================================
   IMMEUBLE DE BUREAUX (V1.5.2)
   - Portefeuille d'immeubles dans la ville : celui de la société, puis des immeubles rachetés.
     Chaque immeuble a des étages, un standing (1 à 4, 5 avec le dernier palier), un état qui s'use,
     un label énergie et des services (restaurant d'entreprise, salles de réunion, conciergerie, parking).
   - Locataires : des sociétés cherchent des bureaux (1 à 4 étages, parfois un grand compte) ;
     vous les installez au loyer demandé ou vous négociez. Bail de 3, 6 ou 9 ans ; à l'échéance,
     un locataire satisfait renouvelle, sinon il part. Un mandat d'agence remplit seul les étages
     vides, un peu moins cher et contre une commission.
   - Travaux : rafraîchissement (état), rénovation lourde (standing +1), label énergie.
   - Événements : faillite d'un locataire, panne d'ascenseur, vague de télétravail, grand compte.
   État b.m (v:1) : bd[] {id, n, dist, nf, m2, std, cond, lbl, srv{}, fl[] (id du locataire ou 0), wk {k, until}},
   tn[] {id, bd, n, sec, fl[], r (€/m² par an), until, sat, risk}, pr[] (prospects), bo[] (immeubles à vendre),
   mk (marché), brk (mandat), ev[], nid, st, acc, accC, pend, pendC, log.
   ============================================================ */
D.biz.office.sub='Étages loués aux sociétés, services, rénovations';
const OF_STD=['','Ordinaire','Correct','Haut de gamme','Prestige','Signature'], OF_STDF=[0,.78,.9,1.05,1.22,1.4];
const OF_SRV={rest:{n:'Restaurant d’entreprise', c:220, d:55, sat:7}, reu:{n:'Salles de réunion', c:80, d:18, sat:4, rev:1}, conc:{n:'Conciergerie', c:40, d:22, sat:5}, park:{n:'Parking', c:160, d:10, sat:3, rev:1}};
const OF_NAMES=['Altéa Conseil','Brévin & Associés','Calderon Assurances','Delmas Ingénierie','Éolis Énergie','Fortis Avocats','Galéa Santé','Hélix Logiciels','Iris Banque privée','Jalon Architectes','Kerval Audit','Lumen Médias','Marelle Voyages','Norvel Pharma','Opaline Design','Pilote Data','Quartz Finance','Rivage Immobilier','Sorel Industries','Talis Recrutement','Ulysse Télécom','Vauban Notaires','Wagram Capital','Xénon Biotech','Yole Formation','Zéphyr Mobilité'];
const OF_TOWER=['Tour Horizon','Tour Lumière','Le Belvédère','Tour Atlas','Le Prisme','Tour Équinoxe','Le Quadrant','Tour Méridienne','Le Carré d’or','Tour Vigie','L’Amiral','Tour Céleste'];
function ofDist(b,id){ return D.CITIES[b.city].d.find(x=>x.id===id)||D.CITIES[b.city].d[0]; }
function ofBd(b,id){ return b.m.bd.find(x=>x.id===id); }
function ofM2f(B){ return B.m2/B.nf; }
/* loyer de marché d'un immeuble (€/m² par an) */
function ofMkt(b,B){ const dd=ofDist(b,B.dist), C=D.CITIES[b.city], m=b.m;
  return dd.p*fxOf(C.ccy)*.066*(OF_STDF[B.std]||1)*(B.lbl?1.08:1)*(m.pre&&B.std>=5?1.1:1)*m.mk*(.8+.4*B.cond/100); }
function ofFree(B){ return B.fl.map((t,i)=>t?-1:i).filter(i=>i>=0); }
function ofWorks(B){ return B.wk&&B.wk.until>S.day; }
function ofNewBd(b,dist,nf,m2,std,cond,name){ const m=b.m; const B={id:m.nid++, n:name, dist, nf, m2:Math.round(m2), std, cond, lbl:0, srv:{}, fl:Array(nf).fill(0), wk:null}; return B; }
function ofTenant(b,B,P,floors,rent,silent){ const m=b.m, t={id:m.nid++, bd:B.id, n:P.n, sec:P.sec, fl:floors, r:Math.round(rent), until:S.day+P.yrs*360, sat:62, risk:P.risk, gc:P.gc?1:0};
  floors.forEach(i=>B.fl[i]=t.id); m.tn.push(t); if(P.gc) m.gcn=(m.gcn||0)+1; if(!silent) metLog(b,t.n+' s’installe dans '+B.n+' ('+floors.length+' étage'+(floors.length>1?'s':'')+', '+eur(t.r,0)+' / m² par an).','good'); return t; }
function ofLeave(b,t,why){ const m=b.m, B=ofBd(b,t.bd); if(B) B.fl=B.fl.map(x=>x===t.id?0:x); m.tn=m.tn.filter(x=>x!==t); if(why) metLog(b,why,'warn'); }
function ofProspect(b,gc){ const m=b.m, k=gc? 5+Math.floor(rnd()*4) : 1+Math.floor(rnd()*rnd()*4), sec=pick(['tech','bureaux','immo','media','luxe']);
  return {id:m.nid++, n:pick(OF_NAMES), sec, k, std:gc? 3 : 1+Math.floor(rnd()*3), mult:gc? 1.12+rnd()*.12 : .86+rnd()*.26, yrs:pick(gc?[6,9]:[3,3,6,9]), risk:gc?0:pick([0,0,1,1,2]), exp:S.day+(gc?14:10+Math.floor(rnd()*10)), gc:gc?1:0}; }
function ofInit(b){
  const m={v:1, r20:1, bd:[], tn:[], pr:[], bo:[], mk:1, brk:1, ev:[], nid:1, st:null, acc:0, accC:0, pend:0, pendC:0, log:[]};
  b.m=m; b.stock=0;
  const bd=b.bld&&bldById(b.bld), surf=bd? bd.surf : 7000, nf=clamp(Math.round(surf/700),4,22);
  const B=ofNewBd(b,b.dist||D.CITIES[b.city].d[0].id,nf,surf,bd? clamp(Math.round(bd.q*2),1,4) : 2,72,bd? bd.addr : 'Votre immeuble'); B.main=1; m.bd.push(B);
  /* l'immeuble arrive à moitié loué : des baux en cours, de longueurs variées */
  let i=0; while(i<nf*.55){ const P=ofProspect(b,false); const k=Math.min(P.k,nf-i); const fl=[]; for(let j=0;j<k;j++) fl.push(i+j); i+=k;
    const t=ofTenant(b,B,P,fl,ofMkt(b,B)*P.mult,true); t.until=S.day+60+Math.floor(rnd()*900); }
  for(let k=0;k<4;k++) m.pr.push(ofProspect(b,false));
  ofOffers(b); return m; }
function ofOffers(b){ const m=b.m, C=D.CITIES[b.city]; m.bo=m.bo.filter(o=>o.exp>S.day);
  while(m.bo.length<3){ const dd=pick(C.d), nf=4+Math.floor(rnd()*14), m2=nf*(500+Math.floor(rnd()*500)), std=1+Math.floor(rnd()*3), cond=40+Math.floor(rnd()*50), occ=Math.round(rnd()*.8*nf);
    const used=m.bd.map(x=>x.n).concat(m.bo.map(x=>x.n)), n=OF_TOWER.find(x=>!used.includes(x))||('Immeuble '+(m.nid));
    const o={id:m.nid++, n, dist:dd.id, nf, m2, std, cond, occ, exp:S.day+45+Math.floor(rnd()*30)}; o.price=ofValue(b,o); m.bo.push(o); } }
/* valeur d'un immeuble : surface, quartier, standing, état ; les baux en place ajoutent un peu */
function ofValue(b,B){ const dd=ofDist(b,B.dist), C=D.CITIES[b.city], occ= B.fl? B.fl.filter(Boolean).length : (B.occ||0);
  return Math.round(B.m2*dd.p*fxOf(C.ccy)*.62*.3*(OF_STDF[B.std]||1)   /* V2.3.1 : immeubles à 30 % de l’ancien prix (achat et revente) */
    *(.7+.3*B.cond/100)*(1+.12*occ/B.nf)/1e4)*1e4; }
function ofSrvOn(B,k){ return !!(B.srv&&B.srv[k]); }
/* une journée d'un immeuble (sans hasard) */
function ofBdDay(b,B){ const m=b.m, m2f=ofM2f(B), T=m.tn.filter(t=>t.bd===B.id); let rev=0, cost=0;
  T.forEach(t=>{ rev+=t.r*m2f*t.fl.length/360; });
  const occF=T.reduce((a,t)=>a+t.fl.length,0), vac=B.nf-occF, chg=(m.chg?.85:1)*(B.lbl?.85:1);
  cost+=vac*m2f*48/360*chg + B.m2*9/360*chg;                 /* charges des étages vides, frais non récupérables */
  if(!B.main) cost+=B.m2*14/360;                              /* taxe foncière des immeubles rachetés */
  Object.keys(OF_SRV).forEach(k=>{ if(!ofSrvOn(B,k)) return; const S0=OF_SRV[k]; cost+=S0.d*B.nf;
    if(k==='reu') rev+=occF*46; if(k==='park') rev+=B.m2/45*11; });
  return {rev, cost, occ:occF, nf:B.nf, net:rev-cost}; }
function ofDay(b){ const m=b.m; let r={rev:0,cost:0,occ:0,nf:0}; m.bd.forEach(B=>{ const x=ofBdDay(b,B); B.st=x; r.rev+=x.rev; r.cost+=x.cost; r.occ+=x.occ; r.nf+=x.nf; });
  r.lf=r.nf? r.occ/r.nf : 0; return r; }
function ofSatTgt(b,t){ const m=b.m, B=ofBd(b,t.bd); if(!B) return 50; const srv=Object.keys(OF_SRV).reduce((a,k)=>a+(ofSrvOn(B,k)?OF_SRV[k].sat:0),0), ratio=t.r/Math.max(1,ofMkt(b,B));
  return clamp(48+srv+(B.std-2)*6+(B.cond-60)/4+(B.lbl?5:0)-Math.max(0,ratio-1)*70+Math.max(0,1-ratio)*25-(ofWorks(B)?15:0),0,100); }
function ofEv(m,k){ return (m.ev||[]).some(e=>e.k===k&&e.until>=S.day); }
MET.office={
  fam:'imm', core:true, init:ofInit,
  ranks:[
    {n:'Gestion des charges', d:'Contrats d’entretien renégociés : −15 % de charges.'},
    {n:'Commercialisation', d:'Un service commercial : plus de sociétés intéressées, commission d’agence divisée par deux.'},
    {n:'Baux longs', d:'Vos locataires renouvellent plus souvent leur bail.'},
    {n:'Facility management', d:'Vos immeubles s’usent deux fois moins vite, les pannes coûtent moins.'},
    {n:'Immeubles de prestige', d:'Une rénovation peut porter un immeuble au standing « Signature » : +10 % de loyers.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){
    const m=b.m;
    /* V1.5.3 : revenus +20 % ; les baux déjà signés sont revalorisés une fois */
    if(!m.r20){ m.r20=1; (m.tn||[]).forEach(t=>t.r=Math.round(t.r*1.2)); }
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    m.ev=(m.ev||[]).filter(e=>e.until>=S.day);
    m.mk=clamp(m.mk+(1-m.mk)*.01+.006*norm(),.8,1.2)*(1)+0;
    m.bd.forEach(B=>{ B.cond=clamp(B.cond-(m.fm?.012:.024),0,100); if(B.wk&&B.wk.until<=S.day){ const w=B.wk; B.wk=null;
        if(w.k==='ref'){ B.cond=100; metLog(b,'rafraîchissement terminé à '+B.n+'.','good'); }
        if(w.k==='reno'){ B.std=Math.min(m.pre?5:4,B.std+1); B.cond=100; metLog(b,B.n+' rénové : standing « '+OF_STD[B.std]+' ».','good'); }
        if(w.k==='lbl'){ B.lbl=1; metLog(b,B.n+' obtient son label énergie : charges −15 %, loyers +8 %.','good'); } } });
    /* satisfaction et fins de bail */
    m.tn.slice().forEach(t=>{ t.sat=clamp(t.sat+(ofSatTgt(b,t)-t.sat)/60,0,100);
      if(t.until<=S.day){ const p=clamp(t.sat/100*1.1+(m.bl?.15:0)-.12,.05,.95), B=ofBd(b,t.bd);
        if(rnd()<p){ const nr=Math.round((t.r*.5+ofMkt(b,B)*.5)); t.r=nr; t.until=S.day+pick([3,6,9])*360; metLog(b,t.n+' renouvelle son bail à '+B.n+' ('+eur(nr,0)+' / m² par an).','good'); }
        else ofLeave(b,t,t.n+' ne renouvelle pas son bail et quitte '+B.n+' ('+t.fl.length+' étage'+(t.fl.length>1?'s':'')+' libéré'+(t.fl.length>1?'s':'')+').'); } });
    /* prospects et immeubles à vendre */
    m.pr=m.pr.filter(p=>p.exp>S.day);
    const want=(m.com?6:4)-(ofEv(m,'tt')?2:0); if(m.pr.length<want&&rnd()<(m.com?.35:.25)) m.pr.push(ofProspect(b,false));
    if(S.day%15===0) ofOffers(b);
    /* mandat d'agence : un étage vide se loue seul, 8 % sous le marché, commission d'un mois de loyer */
    if(m.brk) m.bd.forEach(B=>{ if(ofWorks(B)) return; const fr=ofFree(B); if(!fr.length||rnd()>.06) return; const P=ofProspect(b,false); const k=Math.min(P.k,fr.length), fl=fr.slice(0,k), r=ofMkt(b,B)*.92;
      const t=ofTenant(b,B,P,fl,r,true); m.accC+=r*ofM2f(B)*k/12*(m.com?.5:1); metLog(b,'l’agence installe '+t.n+' dans '+B.n+' ('+k+' étage'+(k>1?'s':'')+').',''); });
    const d=ofDay(b); m.st=d; m.acc+=d.rev; m.accC+=(d.cost0||d.cost);
    ofRisks(b);
  },
  kpis(b){ const m=b.m, d=m.st||ofDay(b), T=m.tn, avg=T.length? T.reduce((a,t)=>a+t.r,0)/T.length : 0, sat=T.length? T.reduce((a,t)=>a+t.sat,0)/T.length : 0;
    return [['Occupation', Math.round((d.lf||0)*100)+' %', d.occ+' étage'+(d.occ>1?'s':'')+' loué'+(d.occ>1?'s':'')+' sur '+d.nf],
            ['Loyer moyen', eur(avg,0)+' / m² / an', T.length+' locataire'+(T.length>1?'s':'')],
            ['Satisfaction', Math.round(sat)+' / 100', m.bd.length+' immeuble'+(m.bd.length>1?'s':'')],
            ['Marché des bureaux', Math.round(m.mk*100)+' %', ofEv(m,'tt')? 'Vague de télétravail' : 'Demande normale']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'tog', act:'brk', label:'Mandat d’agence', tl:[[0,'Aucun'],[1,'Signé']], val:m.brk?1:0, sub:'L’agence loue seule les étages vides, 8 % sous le marché, contre une commission d’un mois de loyer'+(m.com?' (divisée par deux)':'')+'.'});
    [['chg',1,1,'Gestion des charges','−15 % de charges.'],['com',2,2,'Commercialisation','Plus de prospects, commission ÷ 2.'],['bl',3,3,'Baux longs','Renouvellements plus fréquents.'],['fm',4,4,'Facility management','Usure ÷ 2, pannes moins chères.'],['pre',5,6,'Immeubles de prestige','Standing « Signature » possible, +10 % de loyers.']].forEach(([k2,rk,f,l,s])=>{
      if(mxHas(b,rk)) out.push(m[k2]? {k:'buy', act:k2, label:l, owned:true, sub:s} : {k:'buy', act:k2, label:l, cost:(d.cost0||d.cost)*f, sub:s}); });
    return out; },
  acts:{
    lease:(b,arg)=>{ const [pid,bid,neg]=String(arg).split(':'); return ofSign(b,+pid,+bid,+neg||0); },
    evict:(b,id)=>ofEvict(b,+id),
    srv:(b,arg)=>{ const [bid,k]=String(arg).split(':'); return ofSrv(b,+bid,k); },
    work:(b,arg)=>{ const [bid,k]=String(arg).split(':'); return ofWork(b,+bid,k); },
    buyb:(b,id)=>ofBuyBd(b,+id),
    sellb:(b,id)=>ofSellBd(b,+id),
    brk:(b,v)=>{ b.m.brk= v===undefined? (b.m.brk?0:1) : (+v?1:0); return ok(b.m.brk? 'Mandat d’agence confié.' : 'Vous choisissez vous-même vos locataires.'); },
    chg:(b)=>ofBuyR(b,'chg',1,'Gestion des charges',1),
    com:(b)=>ofBuyR(b,'com',2,'Commercialisation',2),
    bl:(b)=>ofBuyR(b,'bl',3,'Baux longs',3),
    fm:(b)=>ofBuyR(b,'fm',4,'Facility management',4),
    pre:(b)=>ofBuyR(b,'pre',6,'Immeubles de prestige',5)
  },
  auto: ofAuto
};
function ofBuyR(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizCost0(b)*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
/* installer un prospect (négociation : +8 % de loyer, mais une chance sur deux qu'il renonce) */
function ofSign(b,pid,bid,neg){ const m=b.m, P=m.pr.find(x=>x.id===pid), B=ofBd(b,bid); if(!P) return err('Cette société a trouvé ailleurs.'); if(!B) return err('Immeuble introuvable.');
  if(ofWorks(B)) return err('Travaux en cours dans cet immeuble.'); if(B.std<P.std) return err('Standing insuffisant : « '+OF_STD[P.std]+' » demandé.');
  const fr=ofFree(B); if(fr.length<P.k) return err('Pas assez d’étages libres ('+P.k+' demandé'+(P.k>1?'s':'')+').');
  let r=ofMkt(b,B)*P.mult; if(neg){ if(rnd()<.5){ m.pr=m.pr.filter(x=>x!==P); metLog(b,P.n+' refuse la hausse et cherche ailleurs.','warn'); return err(P.n+' refuse vos conditions et s’en va.'); } r*=1.08; }
  m.pr=m.pr.filter(x=>x!==P); const t=ofTenant(b,B,P,fr.slice(0,P.k),r); return ok(t.n+' signe un bail de '+P.yrs+' ans à '+eur(t.r,0)+' / m² par an.'); }
function ofEvict(b,id){ const m=b.m, t=m.tn.find(x=>x.id===id); if(!t) return err('Locataire introuvable.'); const B=ofBd(b,t.bd), c=t.r*ofM2f(B)*t.fl.length/12*6;
  if(!metBuy(b,c,'Indemnité de départ : '+t.n)) return err('Il faut '+eur(c,0)+' d’indemnité (six mois de loyer).'); ofLeave(b,t); return ok(t.n+' part contre '+eur(c,0)+' d’indemnité.'); }
function ofSrvCost(B,k){ return Math.round(OF_SRV[k].c*B.m2/10/1000)*1000; }
function ofSrv(b,bid,k,auto){ const B=ofBd(b,bid), S0=OF_SRV[k]; if(!B||!S0) return err('Introuvable.'); B.srv=B.srv||{};
  if(B.srv[k]){ B.srv[k]=0; return ok(S0.n+' fermé à '+B.n+'.'); }
  const c=ofSrvCost(B,k); if(!(auto? dlSpend(b,c,S0.n) : metBuy(b,c,S0.n+' : '+B.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); B.srv[k]=1; metLog(b,S0.n.toLowerCase()+' ouvert à '+B.n+'.','good'); return ok(S0.n+' ouvert.'); }
const OF_WORK={ref:{n:'Rafraîchissement', d:20, c:B=>B.m2*120}, reno:{n:'Rénovation lourde', d:120, c:B=>B.m2*420*B.std}, lbl:{n:'Label énergie', d:60, c:B=>B.m2*220}};
function ofWork(b,bid,k,auto){ const m=b.m, B=ofBd(b,bid), W=OF_WORK[k]; if(!B||!W) return err('Introuvable.'); if(ofWorks(B)) return err('Des travaux sont déjà en cours.');
  if(k==='reno'&&B.std>=(m.pre?5:4)) return err('Standing au maximum'+(m.pre?'.':' (le palier 5 permet « Signature »).')); if(k==='lbl'&&B.lbl) return err('Déjà labellisé.'); if(k==='lbl'&&B.std<3) return err('Standing « Haut de gamme » requis.');
  const c=Math.round(W.c(B)*(m.fm?.9:1)/1000)*1000; if(!(auto? dlSpend(b,c,W.n) : metBuy(b,c,W.n+' : '+B.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  B.wk={k, until:S.day+W.d}; return ok(W.n+' lancé à '+B.n+' : '+W.d+' jours.'); }
function ofBuyBd(b,id,auto){ const m=b.m, o=m.bo.find(x=>x.id===id); if(!o) return err('Offre expirée.'); if(m.bd.length>=8) return err('Huit immeubles au plus.');
  if(!(auto? dlSpend(b,o.price,'Achat : '+o.n) : metBuy(b,o.price,'Achat de l’immeuble '+o.n))) return err('Trésorerie insuffisante : '+eur(o.price,0)+'.');
  const B=ofNewBd(b,o.dist,o.nf,o.m2,o.std,o.cond,o.n); m.bd.push(B); m.bo=m.bo.filter(x=>x!==o);
  for(let i=0;i<o.occ;){ const P=ofProspect(b,false), k=Math.min(P.k,o.occ-i), fl=[]; for(let j=0;j<k;j++) fl.push(i+j); i+=k; const t=ofTenant(b,B,P,fl,ofMkt(b,B)*P.mult,true); t.until=S.day+90+Math.floor(rnd()*900); }
  metLog(b,'achat de '+B.n+' ('+ofDist(b,B.dist).n+', '+B.nf+' étages).','good'); return ok(B.n+' rejoint votre portefeuille.'); }
function ofSellBd(b,id){ const m=b.m, B=ofBd(b,id); if(!B) return err('Immeuble introuvable.'); if(B.main) return err('C’est le siège de la société.'); if(ofWorks(B)) return err('Attendez la fin des travaux.');
  const v=ofValue(b,B)*.95; m.tn.filter(t=>t.bd===B.id).forEach(t=>ofLeave(b,t)); m.bd=m.bd.filter(x=>x!==B); mPayCap(b,'Vente de l’immeuble '+B.n,v); settleAccounts(); return ok(B.n+' vendu '+eur(v,0)+'.'); }
/* événements */
function ofRisks(b){ const m=b.m, r=rnd();
  if(r<.0012&&!ofEv(m,'tt')){ m.ev.push({k:'tt',until:S.day+90}); m.mk=Math.max(.8,m.mk-.06); metLog(b,'vague de télétravail : les sociétés cherchent moins de bureaux pendant trois mois.','bad'); }
  else if(r<.0030){ m.pr.push(ofProspect(b,true)); metLog(b,'un grand compte cherche plusieurs étages : offre valable deux semaines.','good'); }
  const T=m.tn.filter(t=>t.risk===2); if(T.length&&rnd()<.0006*T.length){ const t=pick(T); ofLeave(b,t,t.n+' fait faillite : ses étages sont libérés et deux mois de loyer sont perdus.'); }
  m.bd.forEach(B=>{ if(rnd()<.0016*(B.cond<50?2:1)){ const c=B.m2*(m.fm?2:5); m.accC+=c; m.tn.filter(t=>t.bd===B.id).forEach(t=>t.sat=Math.max(0,t.sat-8)); metLog(b,'panne d’ascenseur à '+B.n+' : '+eur(c,0)+' de réparation, locataires mécontents.','bad'); } }); }
/* le directeur : installe les prospects ; en délégation totale, entretien, services et achats */
function ofAuto(b,mode,q){ const m=b.m;
  if(S.day%3===0) m.pr.slice().sort((x,y)=>y.mult-x.mult).forEach(P=>{ const B=m.bd.filter(B=>!ofWorks(B)&&B.std>=P.std&&ofFree(B).length>=P.k).sort((x,y)=>ofMkt(b,y)-ofMkt(b,x))[0]; if(B&&(P.mult>=.9||rnd()<q)) ofSign(b,P.id,B.id,0); });
  if(mode!=='full'||S.day%30) return;
  /* V2.2.9 : un immeuble vide aux deux tiers et de standing modeste est rénové (les locataires le boudent) */
  m.bd.forEach(B=>{ if(!ofWorks(B)&&B.std<3&&B.fl.filter(Boolean).length<B.nf/3&&dlCan(b,OF_WORK.reno.c(B)*1.2,'Rénovation lourde')) ofWork(b,B.id,'reno',true); });
  m.bd.forEach(B=>{ if(!ofWorks(B)&&B.cond<55) ofWork(b,B.id,'ref',true); ['conc','reu','rest'].forEach(k=>{ if(!ofSrvOn(B,k)&&B.fl.filter(Boolean).length>=B.nf*.6) ofSrv(b,B.id,k,true); }); });
  const o=m.bo.slice().sort((x,y)=>x.price/x.m2-y.price/y.m2)[0]; if(o&&dlCan(b,o.price*1.1,'Achat d’un immeuble')) ofBuyBd(b,o.id,true);
  for(const [k,f,l,rk] of [['chg',1,'Gestion des charges',1],['com',2,'Commercialisation',2],['bl',3,'Baux longs',3],['fm',4,'Facility management',4],['pre',6,'Immeubles de prestige',5]]) if(!m[k]&&mxHas(b,rk)&&ofBuyR(b,k,f,l,rk,true).ok) break; }
function ofData(){ return {OF_SRV, OF_WORK, OF_STD}; }

/* V2.0.3 : achat visé en délégation totale, le plus vite remboursé parmi :
   rénovation lourde d'un immeuble (standing +1), label énergie, rachat d'un immeuble en vente.
   Gain estimé = loyers de marché supplémentaires ; retenu si remboursé en moins de 6 ans. */
function ofGoals(b){ const m=b.m, out=[], fm=m.fm?.9:1, smax=m.pre?5:4;
  const nf=m.bd.reduce((a,B)=>a+B.nf,0), occ=m.bd.reduce((a,B)=>a+B.fl.filter(Boolean).length,0), lf=nf? occ/nf : 0;
  /* recettes réelles / loyers bruts (bonus de la société, niveau, marché) */
  const r0=ofDay(b).rev, kx= r0>0&&b.last&&b.last.rev>0? clamp(b.last.rev/r0,1,300) : balF(b)*(b.satF||1);
  const ann=B=>ofMkt(b,B)*B.m2*Math.max(.5,lf)/360*kx;         /* loyers de marché par jour d'un immeuble */
  m.bd.forEach(B=>{ if(ofWorks(B)) return; const a=ann(B);
    if(B.std<smax){ const c=Math.round(OF_WORK.reno.c(B)*fm/1000)*1000, g=a*((OF_STDF[B.std+1]||1)/(OF_STDF[B.std]||1)-1); out.push({n:'Rénovation lourde de '+B.n+' ('+OF_STD[B.std+1]+')', c, g, act:'work', arg:B.id+':reno'}); }
    if(!B.lbl&&B.std>=3){ const c=Math.round(OF_WORK.lbl.c(B)*fm/1000)*1000, g=a*.08+B.m2*9/360*.15; out.push({n:'Label énergie de '+B.n, c, g, act:'work', arg:B.id+':lbl'}); } });
  if(m.bd.length<8&&lf>=.6) (m.bo||[]).forEach(o=>{ const B={dist:o.dist,std:o.std,lbl:0,cond:o.cond,m2:o.m2}, g=ofMkt(b,B)*o.m2*Math.max(.6,lf)/360*kx-o.m2*23/360;
    out.push({n:'Immeuble '+o.n+' ('+o.nf+' étages)', c:o.price, g, act:'buyb', arg:o.id}); });
  return out.filter(x=>x.g>0&&x.c/x.g<2160).sort((x,y)=>x.c/x.g-y.c/y.g); }
/* parmi ce qui se rembourse en moins de 900 jours, le moins cher d'abord (travaux avant rachats) */
MET.office.goal=function(b){ const L=ofGoals(b), F=L.filter(x=>x.c/x.g<900).sort((x,y)=>x.c-y.c), g=F[0]||L[0]; return g? {n:g.n, c:g.c, act:g.act, arg:g.arg} : null; };

