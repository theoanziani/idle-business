/* ============================================================
   DATA CENTER ET CLOUD : l'équilibre capacité, chaleur, énergie
   Des salles de 20 baies. Chaque client loue des baies avec une disponibilité garantie (SLA).
   Leurs serveurs consomment (10 kW par baie à pleine charge) et chauffent : il faut refroidir
   (air, eau, naturel selon le climat de la ville, immergé au palier 4) et alimenter (puissance
   souscrite). Dépasser le refroidissement d'une salle ou la puissance du site provoque des pannes ;
   chaque client compte ses heures d'arrêt sur 30 jours, au-delà de sa garantie il est remboursé
   en partie, et au deuxième manquement il s'en va.
   Événements : canicule (refroidissement −25 %), coupure de courant, gros client qui arrive.
   Paliers : 99,9 %, 99,99 %, régions du monde, refroidissement immergé, cloud souverain.
   Liens : vos start-up tech calculent moins cher chez vous (metier_saas.js) ; vos énergies
   renouvelables baissent la facture d'électricité (renewSaving).
   État b.m (v:1) : rm[] (salles : id, cool), cl[] (clients : racks, sla, p, util, rm, dt[], br), off[],
   pw (puissance souscrite kW), ev {k, until}, gen, nid, acc, accC, pend, pendC, last, log.
   ============================================================ */
const DC_COOL = {air:{n:'Air', kw:120, pue:1.6, c:0}, eau:{n:'Eau glacée', kw:200, pue:1.35, c:.4}, nat:{n:'Naturel', kw:170, pue:1.15, c:.35}, imm:{n:'Immergé', kw:360, pue:1.06, c:1.2, rk:4}};
const DC_SLA = {'995':{n:'99,5 %', h:3.6, f:1, rk:0}, '999':{n:'99,9 %', h:.72, f:1.35, rk:1}, '9999':{n:'99,99 %', h:.07, f:1.9, rk:2}};
const DC_COLD = {paris:.8, zagreb:1, toulouse:.6, marseille:.4, newyork:.9, pekin:.9, shanghai:.5, madrid:.4, barcelone:.4, split:.5, dubrovnik:.5, losangeles:.3, shenzhen:.2, miami:0, rio:0, salvador:0, seville:.2, saopaulo:.2};
const DC_CLN = ['Banque Duval','Assurances Merlin','Hôpital régional','Studio Pixelune','Logistique Arnaud','Journal du Matin','Boutique Lumen','Mairie','Laboratoire Vega','Jeux Orbit','Transports Rapides','Université','Clinique Saint-Paul','Énergie Plus','Mutuelle Atlas','Plateforme Kiosque','Agence Nova','Fintech Ardent'];
const DC_SLOTS = 20, DC_RKW = 10;
const dcElec = () => S.biz.some(x=>x.def==='electronics'&&x.status==='active');
function dcRoomCost(b){ return bizDef(b).cost*.9*(dcElec()?.8:1); }
function dcColdF(b){ const c=DC_COLD[b.city]; return c===undefined?.4:c; }
function dcInit(b){ const old=b.hist&&b.hist.length>5;
  const m={v:1, rm:[{id:1, cool:'eau'}], cl:[], off:[], pw:250, ev:null, gen:0, intl:0, sov:0, nid:2, acc:0, accC:0, pend:0, pendC:0, last:null, log:[]}; b.m=m;
  const n=old?4:3; for(let i=0;i<n;i++){ const c=dcNewClient(b,false); c.racks=Math.min(c.racks,4); c.sla='995'; c.p=dcPrice(b,c); m.cl.push(c); c.rm=1; }
  for(let i=0;i<2;i++) m.off.push(dcNewClient(b,false));
  return m; }
function dcPrice(b,c){ return metR0(b)*.045*c.racks*DC_SLA[c.sla].f*(b.m&&b.m.intl?1.1:1); }
function dcName(b,big){ const m=b.m||{}, used=new Set([].concat(m.cl||[],m.off||[]).map(c=>c.n)); const L=big?(m.sov?['Ministère de l’Intérieur','Ministère des Armées','Caisse nationale']:['Groupe Hexa','Groupe Orion','Groupe Valmont','Groupe Atlas']):DC_CLN; const f=L.filter(x=>!used.has(x)); return f.length? pick(f) : pick(L)+' '+rint(2,9); }
function dcNewClient(b,big){ const m=b.m||{}, slas=Object.keys(DC_SLA).filter(k=>!DC_SLA[k].rk||mxHas(b,DC_SLA[k].rk));
  const c={id:(m.nid||1), n:dcName(b,big), racks:big? rint(10,16) : rint(2,6), sla:pick(slas), util:.45+.35*rnd(), dt:[], br:0, until:S.day+8, rm:0};
  if(m.nid) m.nid++; if(big&&slas.includes('999')) c.sla=slas[slas.length-1]; c.p=dcPrice(b,c); return c; }
function dcCoolKw(b,r){ const C=DC_COOL[r.cool], m=b.m; let kw=C.kw; if(r.cool==='nat') kw*=dcColdF(b)*(1-.4*Math.max(0,Math.cos(2*Math.PI*(metDoy()-200)/360)));
  if(m.ev&&m.ev.k==='heat'&&r.cool!=='imm') kw*=.75; return kw; }
function dcUsed(b,r){ return b.m.cl.filter(c=>c.rm===r.id).reduce((a,c)=>a+c.racks,0); }
function dcLoad(b,r,peak){ return b.m.cl.filter(c=>c.rm===r.id).reduce((a,c)=>a+c.racks*DC_RKW*(peak?Math.min(1,c.util*1.25):c.util),0); }
function dcFit(b,c){ const m=b.m; let best=null, bh=-1e9; m.rm.forEach(r=>{ if(dcUsed(b,r)+c.racks>DC_SLOTS) return; const h=dcCoolKw(b,r)-dcLoad(b,r,true)-c.racks*DC_RKW*Math.min(1,c.util*1.25); if(h>bh){ bh=h; best=r; } }); return best? {r:best, head:bh} : null; }
function dcSiteLoad(b){ return b.m.rm.reduce((a,r)=>a+dcLoad(b,r)*DC_COOL[r.cool].pue,0); }
function dcBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function dcAccept(b,id,rid){ const m=b.m, c=m.off.find(x=>x.id===+id); if(!c) return err('Offre expirée.');
  let r= rid? m.rm.find(x=>x.id===+rid) : null; if(r&&dcUsed(b,r)+c.racks>DC_SLOTS) return err('Pas assez de baies libres dans cette salle.');
  if(!r){ const f=dcFit(b,c); if(!f) return err('Aucune salle n’a assez de baies libres.'); r=f.r; }
  m.off=m.off.filter(x=>x!==c); c.rm=r.id; c.since=S.day; c.end=S.day+rint(360,900); m.cl.push(c); metLog(b,c.n+' s’installe en salle '+r.id+' ('+c.racks+' baies, garantie '+DC_SLA[c.sla].n+').','good'); return ok(c.n+' installé en salle '+r.id+'.'); }
MET.dc = {
  fam:'num', core:true, init:dcInit,
  ranks:[
    {n:'Disponibilité 99,9 %', d:'Alimentation redondante : deux fois moins de pannes, et des clients plus exigeants qui paient plus.'},
    {n:'Disponibilité 99,99 %', d:'Groupes électrogènes et double alimentation : les coupures de courant ne vous touchent plus, clients 99,99 %.'},
    {n:'Régions du monde', d:'Des clients internationaux : plus d’offres, prix +10 %.'},
    {n:'Refroidissement immergé', d:'Les serveurs plongés dans un liquide : trois fois plus de refroidissement par salle.'},
    {n:'Cloud souverain', d:'L’État vous confie ses données : de très gros contrats 99,99 %.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC+metR0(b)*.03*m.rm.length}; },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(!m.ev){ const summer=Math.cos(2*Math.PI*(metDoy()-200)/360)>.6;
      if(summer&&rnd()<.01){ m.ev={k:'heat', until:S.day+7}; metLog(b,'canicule : le refroidissement perd un quart de sa capacité pendant 7 jours.','warn'); } }
    /* la charge des clients varie */
    m.cl.forEach(c=>{ c.u0=c.u0||c.util; c.util=clamp(c.u0*(1+.12*norm()),.15,1); });
    /* pannes : surchauffe par salle, puissance du site, matériel, coupure */
    const dtR={}; let siteDt=0;
    m.rm.forEach(r=>{ const L=dcLoad(b,r), K=dcCoolKw(b,r); let dt=0; if(L>K){ dt=Math.min(24,(L/K-1)*48); if(dt>.5) metLog(b,'surchauffe en salle '+r.id+' : '+dt.toFixed(1).replace('.',NDEC)+' h d’arrêt.','bad'); }
      if(rnd()<.003/(mxHas(b,2)?4:mxHas(b,1)?2:1)) dt+=rint(1,3); dtR[r.id]=dt; });
    const P=dcSiteLoad(b); if(P>m.pw){ siteDt=Math.min(24,(P/m.pw-1)*48); metLog(b,'la puissance souscrite est dépassée : '+siteDt.toFixed(1).replace('.',NDEC)+' h de coupure sur tout le site.','bad'); }
    if(rnd()<.002&&!mxHas(b,2)){ siteDt+=rint(2,5); metLog(b,'coupure de courant dans le quartier : le site s’arrête.','bad'); }
    /* clients : revenus, heures d'arrêt sur 30 jours, pénalités */
    let rev=0; const gone=[];
    m.cl.forEach(c=>{ const dt=Math.min(24,(dtR[c.rm]||0)+siteDt); c.dt.push(dt); if(c.dt.length>30) c.dt.shift(); const tot=c.dt.reduce((a,x)=>a+x,0);
      rev+=c.p*(1-dt/24);
      if(tot>DC_SLA[c.sla].h&&!c.pen){ c.pen=S.day+30; c.br++; const pen=c.p*30*.3; m.accC+=pen; metLog(b,c.n+' : garantie de disponibilité non tenue, remboursement de '+eur(pen,0)+'.','bad'); if(c.br>=2) gone.push(c); }
      if(c.pen&&S.day>=c.pen) c.pen=0; });
    m.cl.forEach(c=>{ if(c.end&&S.day>=c.end&&!gone.includes(c)){ if(rnd()<.6&&c.br===0){ c.end=S.day+rint(360,720); metLog(b,c.n+' renouvelle son contrat.','good'); } else { gone.push(c); metLog(b,c.n+' arrive en fin de contrat et part.',''); } } });
    gone.forEach(c=>{ m.cl=m.cl.filter(x=>x!==c); if(c.br>=2) metLog(b,c.n+' résilie son contrat après deux manquements.','bad'); });
    /* électricité : charge × PUE */
    const kwh=P*24, ecost=R0*.0016*P; m.accC+=ecost; m.acc+=rev;
    /* nouvelles offres */
    m.off=m.off.filter(c=>S.day<=c.until);
    if(m.off.length<4&&rnd()<.12*(m.intl?1.6:1)) m.off.push(dcNewClient(b,false));
    if(rnd()<.004*(m.sov?2:1)){ m.off.push(dcNewClient(b,true)); metLog(b,'un gros client cherche un hébergement : '+m.off[m.off.length-1].n+'.','good'); }
    if(dlMode(b)==='me') m.off.slice().forEach(c=>{ if(S.day-(c.until-8)>=5){ const f=dcFit(b,c); if(f&&f.head>0&&dcSiteLoad(b)+c.racks*DC_RKW*c.util*1.6<m.pw*.9) dcAccept(b,c.id,f.r.id); } });
    m.last={rev, ecost, P, dt:siteDt+Object.values(dtR).reduce((a,x)=>a+x,0)};
  },
  kpis(b){ const m=b.m, P=dcSiteLoad(b), racks=m.cl.reduce((a,c)=>a+c.racks,0), L=m.last;
    const avail=m.cl.length? 100-m.cl.reduce((a,c)=>a+c.dt.reduce((x,y)=>x+y,0),0)/m.cl.length/(30*24)*100 : 100;
    return [['Baies louées', racks+' / '+m.rm.length*DC_SLOTS, m.cl.length+' client'+(m.cl.length>1?'s':'')],
            ['Puissance', Math.round(P)+' / '+m.pw+' kW', P>m.pw*.9? 'Proche de la limite' : 'Marge suffisante'],
            ['Disponibilité (30 j)', avail.toFixed(2).replace('.',NDEC)+' %', m.ev&&m.ev.k==='heat'? 'Canicule en cours' : 'Moyenne de vos clients'],
            ['Électricité', L? eur(L.ecost,0)+' / j' : '—', S.biz.some(x=>x.def==='renew'&&x.status==='active')? 'Moins chère grâce à vos centrales' : 'Charge × refroidissement']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'btn', act:'pw', label:'Puissance souscrite : '+m.pw+' kW', bl:'+100 kW · '+eur(d.cost*.15,0), sub:'Au-delà, tout le site coupe. Comptez la charge des serveurs multipliée par le refroidissement.'});
    out.push({k:'btn', act:'room', label:'Construire une salle ('+DC_SLOTS+' baies)', cost:dcRoomCost(b), sub:'Livrée avec un refroidissement à air (120 kW).'+(dcElec()?' Équipée par votre usine d’électronique (−20 %).':' Une usine d’électronique à vous l’équiperait 20 % moins cher.')});
    if(mxHas(b,3)) out.push(m.intl? {k:'buy', act:'intl', label:'Régions du monde', owned:true, sub:'Plus d’offres, prix +10 %.'} : {k:'buy', act:'intl', label:'S’ouvrir aux clients du monde entier', cost:d.cost*2, sub:'Plus d’offres, prix +10 %.'});
    if(mxHas(b,5)) out.push(m.sov? {k:'buy', act:'sov', label:'Cloud souverain', owned:true, sub:'Gros contrats publics 99,99 %.'} : {k:'buy', act:'sov', label:'Obtenir la qualification de cloud souverain', cost:d.cost*4, sub:'Gros contrats publics 99,99 %, deux fois plus fréquents.'});
    return out;
  },
  acts:{
    acc:(b,arg)=>{ const [id,rid]=String(arg).split(':'); return dcAccept(b,id,rid); },
    dec:(b,id)=>{ b.m.off=b.m.off.filter(x=>x.id!==+id); return ok(''); },
    end:(b,id)=>{ const m=b.m, c=m.cl.find(x=>x.id===+id); if(!c) return err('Client introuvable.'); m.cl=m.cl.filter(x=>x!==c); m.accC+=c.p*15; metLog(b,'contrat de '+c.n+' rompu (indemnité de 15 jours).','warn'); return ok('Contrat rompu.'); },
    move:(b,arg)=>{ const [id,rid]=String(arg).split(':'), m=b.m, c=m.cl.find(x=>x.id===+id), r=m.rm.find(x=>x.id===+rid); if(!c||!r) return err('Introuvable.'); if(c.rm===r.id) return err('Déjà dans cette salle.'); if(dcUsed(b,r)+c.racks>DC_SLOTS) return err('Pas assez de baies libres.'); c.rm=r.id; m.accC+=metR0(b)*.2*c.racks; return ok(c.n+' déménage en salle '+r.id+'.'); },
    cool:(b,arg)=>{ const [rid,k]=String(arg).split(':'), m=b.m, r=m.rm.find(x=>x.id===+rid), C=DC_COOL[k]; if(!r||!C) return err('Introuvable.'); if(C.rk&&!mxHas(b,C.rk)) return err('Palier '+C.rk+' requis.'); if(k==='nat'&&dcColdF(b)<.3) return err('Le climat de la ville est trop chaud pour le refroidissement naturel.'); if(r.cool===k) return err('Déjà installé.');
      const c=bizDef(b).cost*C.c; if(!metBuy(b,c,'Refroidissement '+C.n.toLowerCase())) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); r.cool=k; return ok('Salle '+r.id+' : refroidissement '+C.n.toLowerCase()+'.'); },
    pw:(b)=>{ const c=bizDef(b).cost*.15; if(!metBuy(b,c,'Puissance électrique')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.pw+=100; return ok('Puissance : '+b.m.pw+' kW.'); },
    room:(b)=>{ const m=b.m; if(m.rm.length>=6+b.lvl) return err('Le terrain est plein.'); const c=dcRoomCost(b); if(!metBuy(b,c,'Nouvelle salle')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); const id=Math.max(...m.rm.map(r=>r.id))+1; m.rm.push({id, cool:'air'}); return ok('Salle '+id+' construite.'); },
    intl:(b)=>dcBuy(b,'intl',2,'Régions du monde',3),
    sov:(b)=>dcBuy(b,'sov',4,'Cloud souverain',5)
  },
  auto: dcAuto
};
/* le responsable d'infrastructure gère la charge */
function dcAuto(b,mode,q){ const m=b.m, d=bizDef(b);
  /* clients qui tiennent sans surchauffe, les mieux payés d'abord */
  m.off.slice().sort((x,y)=>y.p/y.racks-x.p/x.racks).forEach(c=>{ const f=dcFit(b,c); const P=dcSiteLoad(b)+c.racks*DC_RKW*c.util*1.6*1.2;
    if(f&&f.head>10+(1-q)*20&&P<m.pw&&(c.sla!=='9999'||mxHas(b,2))){ c.p*=1+.12*q; dcAccept(b,c.id,f.r.id); } });
  /* rééquilibre : déplace un client d'une salle trop chaude */
  m.rm.forEach(r=>{ if(dcLoad(b,r,true)>dcCoolKw(b,r)){ const c=m.cl.filter(x=>x.rm===r.id).sort((x,y)=>y.racks*y.util-x.racks*x.util)[0]; const t=c&&m.rm.filter(x=>x!==r&&dcUsed(b,x)+c.racks<=DC_SLOTS).sort((x,y)=>(dcCoolKw(b,y)-dcLoad(b,y,true))-(dcCoolKw(b,x)-dcLoad(b,x,true)))[0]; if(t&&dcCoolKw(b,t)-dcLoad(b,t,true)>c.racks*DC_RKW*c.util*1.25) MET.dc.acts.move(b,c.id+':'+t.id); } });
  if(mode!=='full'||S.day%7!==0) return;
  /* V2.5.4 : jusqu'à 4 achats par semaine, dans l'ordre de dcNext (avant : salle seulement quand toutes étaient pleines,
     refroidissement seulement depuis l'air, et aucun achat visé affiché) */
  for(let k=0;k<4;k++){ const g=dcNext(b); if(!g||!dlCan(b,g.c,g.n)||!dlAct(b,g.c,()=>metAct(b,g.act,g.arg))) break; metLog(b,'Votre directeur : '+lc1(g.n)+' ('+eur(g.c,0)+').',''); }
}
/* prochain achat utile : puissance, refroidissement d'une salle chaude, nouvelle salle, puis régions et cloud souverain */
function dcCoolWith(b,r,k){ const o=r.cool; r.cool=k; const kw=dcCoolKw(b,r); r.cool=o; return kw; }
function dcNext(b){ const m=b.m, d=bizDef(b);
  if(dcSiteLoad(b)>m.pw*.75) return {n:'Puissance électrique (+100 kW)', c:d.cost*.15, act:'pw', arg:''};
  const hot=m.rm.map(r=>({r,u:dcLoad(b,r,true)/Math.max(1,dcCoolKw(b,r))})).filter(x=>x.u>.8).sort((x,y)=>y.u-x.u);
  for(const {r} of hot){ const cur=dcCoolKw(b,r), opt=Object.keys(DC_COOL).filter(k=>k!==r.cool&&(!DC_COOL[k].rk||mxHas(b,DC_COOL[k].rk))&&(k!=='nat'||dcColdF(b)>=.3)&&dcCoolWith(b,r,k)>cur*1.15).sort((x,y)=>DC_COOL[x].c-DC_COOL[y].c)[0];
    if(opt) return {n:'Refroidissement '+DC_COOL[opt].n.toLowerCase()+' en salle '+r.id, c:d.cost*DC_COOL[opt].c, act:'cool', arg:r.id+':'+opt}; }
  const used=m.rm.reduce((a,r)=>a+dcUsed(b,r),0), cap=m.rm.length*DC_SLOTS, waiting=m.off.some(c=>{ const f=dcFit(b,c); return !f||f.head<0; });
  if(m.rm.length<6+b.lvl&&!m.rm.some(r=>dcUsed(b,r)===0)&&(used>=cap*.7||waiting)) return {n:'Nouvelle salle', c:dcRoomCost(b), act:'room', arg:''};
  for(const [k,f,l,rk] of [['intl',2,'Régions du monde',3],['sov',4,'Cloud souverain',5]]) if(!m[k]&&mxHas(b,rk)) return {n:l, c:d.cost*f, act:k, arg:''};
  return null; }
MET.dc.goal=function(b){ return dcNext(b); };

