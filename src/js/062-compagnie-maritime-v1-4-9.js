/* ============================================================
   COMPAGNIE MARITIME (V1.4.9)
   - Terminaux : une place à quai dans un grand port permet d'en faire partir des lignes régulières
     vers les ports de sa région ou des régions voisines, et des lignes intercontinentales vers vos
     autres terminaux. Chaque terminal demande de l'argent et une image de marque minimale.
   - Lignes de porte-conteneurs : des navires tournent entre deux ports ; la capacité dépend du
     nombre de navires et de la durée d'une rotation, la demande de la taille des ports.
   - Affrètement : des chargeurs proposent des voyages de vrac ou de pétrole, payés selon un indice
     du fret qui varie ; il faut un vraquier ou un pétrolier libre.
   - Vos usines : leurs expéditions vers un autre pays passent par vos navires (moins chères, plus
     rapides) et le fret est payé à la compagnie.
   - Flotte : navires loués (dépôt de 30 jours), achetés d'occasion (tout de suite, entretien plus
     cher) ou commandés neufs au chantier naval (livrés en 240 jours).
   - Canaux et risques : péages de Suez et de Panama, fermetures (détour par le cap), tempêtes,
     avaries, piraterie dans le golfe d'Aden ; une assurance couvre rançons et réparations.
   État b.m (v:1) : tm[] (terminaux), ext{}, fl[] {id, t, own, occ, ln, ch, down, yard, dep},
   ln[] {id, a, b, p, st}, off[] (offres d'affrètement), ch[] (voyages en cours), bunk (€/t),
   ci (indice conteneurs), bi (indice vrac), img, usn, ins, plan, ali, eco, esc, d2d, ev[], nid,
   st, acc, accC, pend, pendC, uf (fret de vos usines du jour), log.
   ============================================================ */
D.biz.shipping.sub='Porte-conteneurs, vrac et pétrole';
D.DEFB.shipping={t:['land','depot','office'],s:3000};
if(D.BASKET) D.BASKET.shipping=250;

const SH_RG={neu:'Europe du Nord', med:'Méditerranée', nae:'Amérique du Nord (Atlantique)', naw:'Amérique du Nord (Pacifique)', sa:'Amérique latine', af:'Afrique', me:'Moyen-Orient et Inde', as:'Asie', oc:'Océanie'};
const SH_NB={neu:['med','nae'], med:['neu','af','me'], nae:['neu','sa','naw'], naw:['nae','as'], sa:['nae','af'], af:['med','sa','me'], me:['med','af','as'], as:['me','oc','naw'], oc:['as']};
/* ports : [code, nom, région, côte, lat, lon, trafic (millions d'EVP par an), terminal possible ?] ; côte : atl, med, red (mer Rouge), ind, pac (Asie, Océanie), pace (Amériques, Pacifique) */
const SH_PT={};
[['RTM','Rotterdam','neu','atl',51.95,4.05,14.5,1],['ANR','Anvers','neu','atl',51.27,4.33,12,1],['HAM','Hambourg','neu','atl',53.54,9.97,8.7,1],['LEH','Le Havre','neu','atl',49.48,.11,3,1],['FXT','Felixstowe','neu','atl',51.95,1.31,3.8],['GDN','Gdańsk','neu','atl',54.4,18.67,2.1],
 ['FOS','Marseille-Fos','med','med',43.4,4.87,1.5,1],['BCN','Barcelone','med','med',41.35,2.16,3.5,1],['VLC','Valence','med','med',39.44,-.32,5.1,1],['GOA','Gênes','med','med',44.4,8.92,2.6],['PIR','Le Pirée','med','med',37.94,23.63,5.1,1],['TNG','Tanger Med','med','med',35.89,-5.5,8.6,1],['RJK','Rijeka','med','med',45.33,14.43,.4,1],['PSD','Port-Saïd','med','med',31.26,32.3,3.8],
 ['NYC','New York','nae','atl',40.67,-74.05,9.5,1],['SAV','Savannah','nae','atl',32.08,-81.09,5.9],['MIA','Miami','nae','atl',25.77,-80.17,1.3,1],['HOU','Houston','nae','atl',29.73,-95.27,3.9],
 ['LAX','Los Angeles','naw','pace',33.74,-118.26,9.9,1],['VAN','Vancouver','naw','pace',49.29,-123.11,3.6,1],['SEA','Seattle','naw','pace',47.6,-122.35,3.5],
 ['SSZ','Santos','sa','atl',-23.96,-46.31,5,1],['BUE','Buenos Aires','sa','atl',-34.6,-58.37,1.5],['RIO','Rio de Janeiro','sa','atl',-22.89,-43.18,1.4],['CTG','Carthagène','sa','atl',10.4,-75.53,3.4,1],
 ['LOS','Lagos','af','atl',6.43,3.39,1.5],['DUR','Durban','af','ind',-29.87,31.03,2.8,1],['MBA','Mombasa','af','ind',-4.06,39.67,1.6],['CAS','Casablanca','af','atl',33.6,-7.62,1.3],
 ['JEA','Jebel Ali (Dubaï)','me','ind',25.01,55.06,14,1],['JED','Djeddah','me','red',21.48,39.17,4.7,1],['BOM','Bombay','me','ind',18.95,72.95,6.4,1],
 ['SHA','Shanghai','as','pac',31.23,121.49,47,1],['SZX','Shenzhen','as','pac',22.5,113.88,30,1],['SIN','Singapour','as','pac',1.26,103.82,37,1],['BUS','Busan','as','pac',35.1,129.04,22,1],['HKG','Hong Kong','as','pac',22.3,114.17,14],['TYO','Tokyo','as','pac',35.62,139.78,4.5,1],
 ['SYD','Sydney','oc','pac',-33.86,151.2,2.7,1],['MEL','Melbourne','oc','pac',-37.82,144.95,3.1,1],['AKL','Auckland','oc','pac',-36.84,174.77,1,1]
].forEach(([id,n,rg,sd,lat,lon,sz,tm])=>{ SH_PT[id]={id,n,rg,sd,lat,lon,sz,tm:!!tm, am:rg==='nae'||rg==='sa'}; });
/* points de passage */
const SH_WP={cv:[16,-21], gib:[36,-5.6], suez:[30.6,32.4], bab:[12.6,43.4], sin:[1.3,103.8], pan:[9.1,-79.7], cape:[-35,19.5], horn:[-56.5,-67.5]};
/* navires (modèles fictifs) : capacité (EVP ou tonnes), vitesse (nœuds), prix neuf, loyer par jour, fioul (t par jour de mer), équipage (€ par jour), passe Panama ? */
const SH_TY={
  f1:{n:'Feeder 1 200', k:'box', d:'Porte-conteneurs régional', cap:1200, kn:17, pr:22e6, ls:7000, fuel:22, crew:5000, pan:1},
  p5:{n:'Panamax 5 000', k:'box', d:'Porte-conteneurs moyen', cap:5000, kn:21, pr:65e6, ls:19000, fuel:60, crew:8000, pan:1},
  n13:{n:'Néo-Panamax 13 000', k:'box', d:'Grand porte-conteneurs', cap:13000, kn:22, pr:130e6, ls:40000, fuel:110, crew:10000, pan:1},
  g22:{n:'Géant 22 000', k:'box', d:'Très grand porte-conteneurs (trop large pour Panama)', cap:22000, kn:21, pr:190e6, ls:60000, fuel:150, crew:11000, pan:0},
  bk:{n:'Vraquier 80 000 t', k:'bulk', d:'Minerai, charbon, céréales', cap:80000, kn:14, pr:38e6, ls:11000, fuel:30, crew:5500, pan:1},
  tk:{n:'Pétrolier 150 000 t', k:'tank', d:'Pétrole brut et raffiné (trop large pour Panama)', cap:150000, kn:15, pr:75e6, ls:22000, fuel:45, crew:7000, pan:0}
};
const SH_PRICE=[.8,1,1.15,1.3], SH_YARD=240, SH_OCC=.6;
const SH_CARGO={bulk:['minerai de fer','charbon','céréales','bauxite','engrais'], tank:['pétrole brut','gazole','kérosène','naphta']};
const shPt = id => SH_PT[id];
function shGc(a,b){ const r=Math.PI/180, dl=(b[0]-a[0])*r, dn=(b[1]-a[1])*r, x=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2; return 2*6371*Math.asin(Math.sqrt(x)); }
function shEv(m,k){ return (m.ev||[]).some(e=>e.k===k&&e.until>=S.day); }
/* route maritime entre deux ports : points de passage, canal emprunté, golfe d'Aden ? */
function shPath(a,b,m,big){
  let A=shPt(a), B=shPt(b); const rk={atl:0,med:1,red:2,ind:3,pac:4,pace:5}; let flip=false;
  if(rk[A.sd]>rk[B.sd]||(A.sd===B.sd&&A.lon>B.lon)){ const t=A; A=B; B=t; flip=true; }
  const pa=[A.lat,A.lon], pb=[B.lat,B.lon], W=SH_WP, sA=A.sd, sB=B.sd, sinIf=p=>(B.lon>100||B.rg==='oc')&&B.id!=='SIN'? [W.sin] : [];
  const suezShut=m&&shEv(m,'suez'), panShut=m&&shEv(m,'pan');
  let pts=[pa], canal=null, aden=false;
  const viaSuez=(gib)=>{ if(suezShut){ pts.push(...(gib?[W.gib]:[]),W.cape); } else { pts.push(...(gib?[W.gib]:[]),W.suez); canal='suez'; if(sB!=='red'){ pts.push(W.bab); aden=true; } } };
  const eu=P=>P.rg==='neu'||P.rg==='med', wa=P=>P.rg==='af'&&P.sd==='atl'&&P.lat<20||P.rg==='sa';
  if(sA===sB){ if(sA==='pac'&&A.lon<105&&B.lon>105) pts.push(W.sin); if(sA==='atl'&&((eu(A)&&wa(B))||(eu(B)&&wa(A)))) pts.push(W.cv); }
  else if(sA==='atl'&&sB==='med'){ if(wa(A)) pts.push(W.cv); pts.push(W.gib); }
  else if((sA==='atl'||sA==='med')&&(sB==='red'||sB==='ind'||sB==='pac')){
    if(sA==='atl'&&A.am&&sB==='pac'){ if(panShut||big) pts.push(W.horn); else { pts.push(W.pan); canal='pan'; } }
    else if(B.id==='DUR'&&sA==='atl'){ if(eu(A)) pts.push(W.cv); pts.push(W.cape); }
    else { viaSuez(sA==='atl'&&!(A.am&&false)); if(sB==='pac') pts.push(...sinIf()); else if(sB==='ind'&&B.id==='DUR'){ pts.splice(pts.length-1,1); pts.push(W.bab); } } }
  else if((sA==='atl'||sA==='med')&&sB==='pace'){ if(sA==='med') pts.push(W.gib); if(panShut||big) pts.push(W.horn); else { pts.push(W.pan); canal='pan'; } }
  else if(sA==='red'&&(sB==='ind'||sB==='pac'||sB==='pace')){ pts.push(W.bab); aden=true; if(sB!=='ind') pts.push(...sinIf()); }
  else if(sA==='ind'&&(sB==='pac'||sB==='pace')) pts.push(W.sin);
  pts.push(pb); if(flip) pts.reverse();
  let d=0; for(let i=1;i<pts.length;i++) d+=shGc(pts[i-1],pts[i]);
  return {pts, d:Math.round(d*1.08), canal, aden}; }
function shDist(a,b,m){ return shPath(a,b,m,false).d; }
/* rotation d'un navire sur une ligne (aller-retour, escales comprises), en jours */
function shRot(b,t,a,bb){ const m=b.m, T=SH_TY[t], P=shPath(a,bb,m,!T.pan), sea=P.d/(T.kn*.75*1.852*24), port=(m.plan?2.5:3.5);   /* vitesse économique, plusieurs escales à chaque bout */
  return {rt:2*sea+2*port+(P.canal?1:0), sea:2*sea, P}; }
/* prix moyen du transport d'un EVP selon la distance */
function shRate(d){ return 150+.012*d; }
function shHomeTm(b){ return {paris:'LEH',toulouse:'LEH',marseille:'FOS',barcelone:'BCN',madrid:'VLC',seville:'VLC',zagreb:'RJK',split:'RJK',dubrovnik:'RJK',miami:'MIA',newyork:'NYC',losangeles:'LAX',rio:'SSZ',saopaulo:'SSZ',salvador:'SSZ',pekin:'SHA',shanghai:'SHA',shenzhen:'SZX'}[b&&b.city]||'RTM'; }
/* V2.3.1 : navires, location et terminaux à 30 % de leur ancien prix (les capitaux réinvestis rapportaient trop peu) */
const SH_ASSET=.3; Object.values(SH_TY).forEach(T=>{ T.pr*=SH_ASSET; T.ls=Math.round(T.ls*SH_ASSET); });
function shTmCost(id){ const P=shPt(id); return Math.round((7e6+P.sz*6e5)*SH_ASSET/1e5)*1e5; }
function shTmReq(b,id){ const P=shPt(id), H=shPt(shHomeTm(b)); return Math.round(26+P.sz*.55+(H&&P.rg!==H.rg&&!SH_NB[H.rg].includes(P.rg)?12:0)); }
function shTmCap(b,id){ return 3+2*((b.m.ext&&b.m.ext[id])||0); }
function shTmUsed(b,id){ return b.m.ln.filter(l=>l.a===id).length; }
function shExtCost(b,id){ return Math.round(shTmCost(id)*.45*(1+((b.m.ext&&b.m.ext[id])||0))/1e5)*1e5; }
function shDests(b,from){ const m=b.m, A=shPt(from), ok=[A.rg].concat(SH_NB[A.rg]); return Object.values(SH_PT).filter(x=>x.id!==from&&(ok.includes(x.rg)||m.tm.includes(x.id))); }
function shShip(b,id){ return b.m.fl.find(p=>p.id===id); }
function shLine(b,id){ return b.m.ln.find(l=>l.id===id); }
const shFree = (m,p) => !(p.down>S.day) && !(p.yard>S.day) && !p.ch && !(p.ln&&m.ln.some(l=>l.id===p.ln));
function shMaint(m,p){ const T=SH_TY[p.t]; return p.own? T.pr*.00011*(p.occ?1.7:1) : T.ls; }
function shBunk(m){ return m.bunk*(shEv(m,'fuel')?1.3:1); }
function shInit(b){
  const h=shHomeTm(b), H=shPt(h);
  const m={v:1, tm:[h], ext:{}, fl:[], ln:[], off:[], bunk:420, ci:1, bi:1, img:32, usn:1, ins:0, ev:[], nid:1, st:null, acc:0, accC:0, pend:0, pendC:0, uf:0, log:[]};
  b.m=m; b.stock=0;
  /* au départ : un Panamax et un feeder loués, chacun sur la meilleure ligne qui s'offre à lui */
  const cands=shDests(b,h).filter(x=>shDist(h,x.id,m)>=600);
  const bestFor=(t,skip)=>{ let best=null; cands.forEach(x=>{ if(x.id===skip) return; const l={id:-1, a:h, b:x.id, p:1}; m.ln=[l]; m.fl=[{id:-1,t,own:0,ln:-1,down:0}]; const v=shLineDay(b,l).net; if(!best||v>best.v) best={x,v}; }); m.ln=[]; m.fl=[]; return best; };
  const b1=bestFor('p5'), b2=bestFor('f1',b1&&b1.x.id);
  [[b1,'p5'],[b2,'f1']].forEach(([o,t])=>{ if(!o) return; const l={id:m.nid++, a:h, b:o.x.id, p:1}; m.ln.push(l); m.fl.push({id:m.nid++, t, own:0, ln:l.id, down:0, dep:SH_TY[t].ls*30}); });
  shOffers(b); return m; }
/* une journée d'une ligne (prévision sans hasard si sim) */
function shLineDay(b,l){
  const m=b.m, P=m.fl.filter(p=>p.ln===l.id&&!(p.down>S.day)&&!(p.yard>S.day)); const A=shPt(l.a), B=shPt(l.b);
  if(!P.length) return {teu:0,cap:0,rev:0,cost:0,lf:0,net:0,ships:0};
  const d0=shDist(l.a,l.b,m);
  /* demande (EVP par jour, deux sens) : grands ports, grands flux Asie-Europe et transpacifique */
  const big=(x,y)=>(x==='as'&&(y==='neu'||y==='med'||y==='naw'))||(y==='as'&&(x==='neu'||x==='med'||x==='naw'));
  let dem=260*Math.sqrt(A.sz*B.sz)/(1+d0/18000)*(A.rg===B.rg&&d0<1500?.55:1)*(big(A.rg,B.rg)?1.6:1);
  const inter=A.rg!==B.rg&&!SH_NB[A.rg].includes(B.rg); if(inter&&m.ali) dem*=1.15;
  dem*=tradeF(PORT_CTY[l.a],PORT_CTY[l.b],1.5);
  const pm=SH_PRICE[l.p]||1, share=clamp(.2+m.img/260,.1,.65)*Math.pow(pm,-2.4);
  const want=dem*share*(4000/(4000+dem*share));
  let cap=0, cost=0, calls=0, canal=0, teuK=0;
  P.forEach(p=>{ const T=SH_TY[p.t], R=shRot(b,p.t,l.a,l.b), fs=R.sea/R.rt;
    cap+=T.cap*2/R.rt*.92; calls+=2/R.rt;
    cost+=T.fuel*fs*shBunk(m)*(m.eco?.85:1)+T.crew+shMaint(m,p);
    if(R.P.canal) canal+=2/R.rt*T.cap*(R.P.canal==='suez'?26:34);
    teuK+=T.cap; });
  const fee=(x)=>m.tm.includes(x)? .5 : 1;
  cost+=calls/2*(fee(l.a)+fee(l.b))*(9000+teuK/P.length*2.2)+canal;
  const teu=Math.min(cap,want), rate=shRate(d0)*pm*m.ci*(m.d2d?1.1:1);
  cost+=teu*(m.tm.includes(l.a)&&m.tm.includes(l.b)? 38 : 55);
  const rev=teu*rate;
  return {teu, cap, rev, cost, lf:cap? teu/cap : 0, net:rev-cost, d:d0, want, ships:P.length}; }
/* offres d'affrètement : voyages de vrac et de pétrole entre deux ports, payés selon l'indice */
function shOffers(b){ const m=b.m, ids=Object.keys(SH_PT), n=4+Math.floor(rnd()*3); m.off=m.off.filter(o=>o.exp>S.day);
  while(m.off.length<n){ const k=rnd()<.6?'bulk':'tank', a=pick(ids); let bb=pick(ids); if(bb===a) continue;
    const d=shDist(a,bb,null); if(d<1500) continue; const T=k==='bulk'?SH_TY.bk:SH_TY.tk, q=Math.round(T.cap*(.7+rnd()*.3)/1000)*1000;
    const days=Math.ceil(2*d/(T.kn*1.852*24)+5), base=(k==='bulk'? 4.5+.0013*d : 4+.0011*d)*(k==='bulk'?m.bi:Math.sqrt(m.bi*m.ci));
    m.off.push({id:m.nid++, k, c:pick(SH_CARGO[k]), a, b:bb, q, d, days, pay:Math.round(q*base/1000)*1000, exp:S.day+7+Math.floor(rnd()*7)}); } }
function shChDay(m,p){ const c=p.ch, T=SH_TY[p.t]; if(!c) return {rev:0,cost:0};
  const fs=Math.min(1,(c.days-5)/c.days); return {rev:c.pay/c.days, cost:T.fuel*fs*shBunk(m)*(m.eco?.85:1)+T.crew+shMaint(m,p)+(c.toll||0)/c.days}; }
function shDay(b){ const m=b.m; let r={teu:0,cap:0,rev:0,cost:0,ch:0};
  m.ln.forEach(l=>{ const x=shLineDay(b,l); l.st=x; r.teu+=x.teu; r.cap+=x.cap; r.rev+=x.rev; r.cost+=x.cost; });
  m.fl.forEach(p=>{ if(p.ch){ const x=shChDay(m,p); r.rev+=x.rev; r.cost+=x.cost; r.ch+=x.rev; }
    else if(!(p.ln&&m.ln.some(l=>l.id===p.ln))&&!(p.yard>S.day)) r.cost+=shMaint(m,p)+SH_TY[p.t].crew*.4; });
  /* terminaux : d'autres compagnies paient pour vos quais */
  r.rev+=m.tm.reduce((a,id)=>a+shPt(id).sz*160,0);
  if(m.ins) r.cost+=shInsCost(b);
  r.lf=r.cap? r.teu/r.cap : 0; return r; }
function shInsCost(b){ return Math.round(b.m.fl.reduce((a,p)=>a+SH_TY[p.t].pr*.000035,0)*(b.m.esc?.7:1)); }
MET.shipping={
  fam:'ind', core:true, init:shInit,
  ranks:[
    {n:'Planification des escales', d:'Des escales mieux préparées : rotations plus courtes, donc plus de capacité avec les mêmes navires.'},
    {n:'Alliance maritime', d:'Des partenaires partagent leurs navires avec vous : +15 % de demande sur les lignes intercontinentales.'},
    {n:'Navires économes', d:'Bulbes d’étrave, peintures et vitesse réduite : −15 % de fioul.'},
    {n:'Sûreté et escortes', d:'Gardes armés et escortes dans le golfe d’Aden : piraterie bien plus rare, assurance −30 %.'},
    {n:'Logistique porte-à-porte', d:'Vous prenez en charge camions et douane : +10 % sur le prix de chaque conteneur.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){
    const m=b.m;
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    m.ev=(m.ev||[]).filter(e=>e.until>=S.day);
    /* fioul, indices du fret conteneurs et vrac */
    m.bunk=clamp(m.bunk+(420-m.bunk)*.02+7*norm(),260,700);
    m.ci=clamp(m.ci+(1-m.ci)*.01+.012*norm(),.65,1.6); m.bi=clamp(m.bi+(1-m.bi)*.012+.02*norm(),.5,1.9);
    /* navires livrés par le chantier, voyages d'affrètement terminés */
    m.fl.forEach(p=>{ if(p.yard&&p.yard<=S.day){ p.yard=0; metLog(b,SH_TY[p.t].n+' livré par le chantier naval.','good'); }
      if(p.ch&&p.ch.end<=S.day){ m.chn=(m.chn||0)+1; metLog(b,'voyage d’affrètement terminé ('+p.ch.c+', '+shPt(p.ch.a).n+' – '+shPt(p.ch.b).n+').','good'); p.ch=null; } });
    if(S.day%7===0) shOffers(b);
    const d=shDay(b); d.rev+=(m.uf||0); m.uf=0; m.st=d; m.acc+=d.rev; m.accC+=(d.cost0||d.cost);
    /* image de marque : années, réseau, terminaux, fiabilité */
    if(!m.d0) m.d0=S.day;
    m.img=clamp(m.img+(imgTarget(shImgParts(b))-m.img)/400,0,100);
    shRisks(b);
  },
  kpis(b){ const m=b.m, d=m.st||shDay(b), busy=m.fl.filter(p=>p.ch).length;
    return [['Conteneurs / jour', fmtN(Math.round(d.teu))+' EVP', m.ln.length+' ligne'+(m.ln.length>1?'s':'')+' · remplissage '+Math.round((d.lf||0)*100)+' %'],
            ['Affrètement', busy+' voyage'+(busy>1?'s':'')+' en cours', 'Indice du vrac '+Math.round(m.bi*100)],
            ['Image de marque', Math.round(m.img)+' / 100', m.tm.length+' terminal'+(m.tm.length>1?'s':'')],
            ['Fioul', eur(shBunk(m),0)+' / t', 'Indice conteneurs '+Math.round(m.ci*100)]];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'tog', act:'usn', label:'Transporter les marchandises de vos usines', val:m.usn?1:0, sub:'Expéditions vers un autre pays : délais −40 %, coût −50 %, payé à votre compagnie (au moins une ligne requise).'});
    out.push({k:'tog', act:'ins', label:'Assurance de la flotte', tl:[[0,'Aucune'],[1,'Souscrite']], val:m.ins?1:0, sub:(m.ins?'':'Environ ')+eur(shInsCost(b),0)+' par jour : rançons de piraterie et réparations d’avaries couvertes.'});
    [['plan',1,1.5,'Planification des escales','Rotations plus courtes.'],['ali',2,3,'Alliance maritime','+15 % de demande intercontinentale.'],['eco',3,5,'Navires économes','−15 % de fioul.'],['esc',4,6,'Sûreté et escortes','Piraterie bien plus rare, assurance −30 %.'],['d2d',5,10,'Logistique porte-à-porte','+10 % par conteneur.']].forEach(([k2,rk,f,l,s])=>{
      if(mxHas(b,rk)) out.push(m[k2]? {k:'buy', act:k2, label:l, owned:true, sub:s} : {k:'buy', act:k2, label:l, cost:(d.cost0||d.cost)*f, sub:s}); });
    return out; },
  acts:{
    tm:(b,id)=>shBuyTm(b,id),
    ext:(b,id)=>shExt(b,id),
    open:(b,arg)=>{ const [a,bb,pid]=String(arg).split(':'); return shOpen(b,a,bb,+pid); },
    close:(b,id)=>shClose(b,+id),
    price:(b,arg)=>{ const [id,v]=String(arg).split(':'), l=shLine(b,+id); if(!l) return err('Ligne introuvable.'); l.p=clamp(+v|0,0,3); return ok(''); },
    add:(b,arg)=>{ const [id,pid]=String(arg).split(':'); return shAssign(b,+id,+pid); },
    off:(b,pid)=>shUnassign(b,+pid),
    lease:(b,t)=>shGet(b,t,'lease'),
    occ:(b,t)=>shGet(b,t,'occ'),
    yard:(b,t)=>shGet(b,t,'new'),
    drop:(b,id)=>shDrop(b,+id),
    own:(b,id)=>shBuyOut(b,+id),
    charter:(b,arg)=>{ const [oid,pid]=String(arg).split(':'); return shCharter(b,+oid,+pid); },
    usn:(b,v)=>{ b.m.usn= v===undefined? (b.m.usn?0:1) : (+v?1:0); return ok(b.m.usn? 'Vos usines expédient par vos navires.' : 'Vos usines utilisent d’autres transporteurs.'); },
    ins:(b,v)=>{ b.m.ins= v===undefined? (b.m.ins?0:1) : (+v?1:0); return ok(b.m.ins? 'Flotte assurée.' : 'Assurance résiliée.'); },
    plan:(b)=>shBuyR(b,'plan',1.5,'Planification des escales',1),
    ali:(b)=>shBuyR(b,'ali',3,'Alliance maritime',2),
    eco:(b)=>shBuyR(b,'eco',5,'Navires économes',3),
    esc:(b)=>shBuyR(b,'esc',6,'Sûreté et escortes',4),
    d2d:(b)=>shBuyR(b,'d2d',10,'Logistique porte-à-porte',5)
  },
  auto: shAuto
};
function shBuyR(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizCost0(b)*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function shBuyTm(b,id,auto){ const m=b.m, P=shPt(id); if(!P||!P.tm) return err('Port inconnu.'); if(m.tm.includes(id)) return err('Vous y avez déjà un terminal.');
  const req=shTmReq(b,id); if(m.img<req) return err('Image de marque insuffisante : '+req+' requis ('+Math.round(m.img)+' aujourd’hui).');
  const c=shTmCost(id); if(!(auto? dlSpend(b,c,'Terminal : '+P.n) : metBuy(b,c,'Terminal à '+P.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.tm.push(id); metLog(b,'nouveau terminal à '+P.n+'.','good'); return ok('Vous pouvez maintenant ouvrir des lignes depuis '+P.n+'.'); }
function shExt(b,id,auto){ const m=b.m; if(!m.tm.includes(id)) return err('Achetez d’abord un terminal.'); m.ext=m.ext||{}; const n=m.ext[id]||0; if(n>=3) return err('Quais au maximum à '+shPt(id).n+'.');
  const c=shExtCost(b,id); if(!(auto? dlSpend(b,c,'Quais : '+shPt(id).n) : metBuy(b,c,'Quais supplémentaires : '+shPt(id).n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.ext[id]=n+1; metLog(b,'quais supplémentaires à '+shPt(id).n+' : '+shTmCap(b,id)+' lignes possibles.','good'); return ok(shTmCap(b,id)+' lignes possibles au départ de '+shPt(id).n+'.'); }
function shCanLine(b,a,bb){ const m=b.m; if(!m.tm.includes(a)) return 'Départ depuis un de vos terminaux uniquement.'; if(!shPt(bb)) return 'Port inconnu.';
  if(shTmUsed(b,a)>=shTmCap(b,a)) return 'Plus de quai libre à '+shPt(a).n+' ('+shTmCap(b,a)+' lignes) : achetez des quais supplémentaires.';
  if(!shDests(b,a).some(x=>x.id===bb)) return 'Destination hors de portée : même région, région voisine, ou un autre de vos terminaux.';
  if(m.ln.some(l=>(l.a===a&&l.b===bb)||(l.a===bb&&l.b===a))) return 'Cette ligne existe déjà.'; return ''; }
function shOpen(b,a,bb,pid){ const m=b.m, e=shCanLine(b,a,bb); if(e) return err(e); const p=shShip(b,pid); if(!p) return err('Choisissez un navire.');
  if(SH_TY[p.t].k!=='box') return err('Seuls les porte-conteneurs desservent les lignes.'); if(!shFree(m,p)) return err('Ce navire n’est pas disponible.');
  const l={id:m.nid++, a, b:bb, p:1}; m.ln.push(l); p.ln=l.id; metLog(b,'nouvelle ligne '+shPt(a).n+' – '+shPt(bb).n+'.','good'); return ok('Ligne ouverte : '+shPt(a).n+' – '+shPt(bb).n+'.'); }
function shAssign(b,lid,pid){ const m=b.m, l=shLine(b,lid), p=shShip(b,pid); if(!l||!p) return err('Introuvable.'); if(SH_TY[p.t].k!=='box') return err('Seuls les porte-conteneurs desservent les lignes.');
  if(!shFree(m,p)) return err('Ce navire n’est pas disponible.'); p.ln=l.id; return ok(SH_TY[p.t].n+' ajouté sur la ligne.'); }
function shUnassign(b,pid){ const m=b.m, p=shShip(b,pid); if(!p||!p.ln) return err('Ce navire n’est sur aucune ligne.'); p.ln=0; return ok(SH_TY[p.t].n+' retiré de la ligne.'); }
function shClose(b,lid){ const m=b.m, l=shLine(b,lid); if(!l) return err('Ligne introuvable.'); m.ln=m.ln.filter(x=>x!==l); m.fl.forEach(p=>{ if(p.ln===lid) p.ln=0; }); return ok('Ligne fermée ; ses navires sont disponibles.'); }
function shGet(b,t,how,auto){ const m=b.m, T=SH_TY[t]; if(!T) return err('Modèle inconnu.'); const lab={lease:'Location',occ:'Achat d’occasion',new:'Commande au chantier'}[how]; if(!lab) return err('Mode inconnu.');
  const c= how==='lease'? T.ls*30 : how==='occ'? T.pr*SH_OCC : T.pr;
  if(how==='lease'){ if(mAvail(b)<c) return err('Il faut '+eur(c,0)+' de dépôt de garantie.'); mPayCap(b,'Dépôt de garantie : '+T.n,-c); settleAccounts(); }
  else if(!(auto? dlSpend(b,c,lab+' : '+T.n) : metBuy(b,c,lab+' : '+T.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  const p={id:m.nid++, t, own:how==='lease'?0:1, occ:how==='occ'?1:0, ln:0, down:0, dep:how==='lease'?c:0, yard:how==='new'? S.day+SH_YARD : 0}; m.fl.push(p);
  return ok(how==='lease'? T.n+' loué ('+eur(T.ls,0)+' par jour).' : how==='occ'? T.n+' d’occasion acheté.' : T.n+' commandé : livraison le '+dateL(p.yard)+'.'); }
function shResale(p){ const T=SH_TY[p.t]; return T.pr*(p.occ? .35 : .65); }
function shDrop(b,pid){ const m=b.m, p=shShip(b,pid); if(!p) return err('Navire introuvable.'); if(p.ch) return err('Ce navire est en voyage d’affrètement.'); if(p.yard>S.day) return err('Ce navire est encore au chantier.'); const T=SH_TY[p.t];
  if(p.own){ mPayCap(b,'Revente : '+T.n,shResale(p)); settleAccounts(); } else if(p.dep){ mPayCap(b,'Dépôt rendu : '+T.n,p.dep); settleAccounts(); }
  m.fl=m.fl.filter(x=>x!==p); return ok(p.own? T.n+' revendu '+eur(shResale(p),0)+'.' : 'Location de '+T.n+' terminée, dépôt rendu.'); }
function shCharter(b,oid,pid){ const m=b.m, o=m.off.find(x=>x.id===oid); if(!o) return err('Offre expirée.'); const p=shShip(b,pid); if(!p) return err('Choisissez un navire.');
  const T=SH_TY[p.t]; if(T.k!==o.k) return err(o.k==='bulk'? 'Il faut un vraquier.' : 'Il faut un pétrolier.'); if(T.cap<o.q) return err('Capacité insuffisante.'); if(!shFree(m,p)) return err('Ce navire n’est pas disponible.');
  const P=shPath(o.a,o.b,m,!T.pan), days=Math.ceil(2*P.d/(T.kn*1.852*24)+5), toll=P.canal? 2*T.cap*(P.canal==='suez'?.9:1.1) : 0;
  p.ch={id:o.id, c:o.c, a:o.a, b:o.b, pay:o.pay, days, end:S.day+days, toll, aden:P.aden}; m.off=m.off.filter(x=>x!==o);
  metLog(b,'affrètement : '+o.c+' de '+shPt(o.a).n+' à '+shPt(o.b).n+' pour '+eur(o.pay,0)+' ('+days+' jours).','good'); return ok('Voyage signé : '+eur(o.pay,0)+' en '+days+' jours.'); }
/* risques : canaux, tempêtes, avaries, piraterie */
function shRisks(b){ const m=b.m, r=rnd(), act=m.fl.filter(p=>!(p.yard>S.day)&&!(p.down>S.day)&&(p.ch||(p.ln&&m.ln.some(l=>l.id===p.ln))));
  const add=(k,days,txt,cls)=>{ m.ev.push({k,until:S.day+days}); metLog(b,txt,cls||'bad'); };
  if(r<.0015&&!shEv(m,'suez')) add('suez',rint(6,40),'le canal de Suez est fermé : détour par le cap de Bonne-Espérance, plus long et plus coûteux en fioul.');
  else if(r<.0028&&!shEv(m,'pan')) add('pan',rint(30,60),'sécheresse au canal de Panama : les navires passent par le cap Horn.');
  else if(r<.0040&&!shEv(m,'fuel')) add('fuel',30,'flambée du fioul : +30 % pendant un mois.');
  if(!act.length) return;
  const p=pick(act), T=SH_TY[p.t], val=T.pr, x=rnd();
  if(x<.004){ p.down=S.day+rint(3,6); metLog(b,'tempête : '+T.n+' retardé de quelques jours.','warn'); }
  else if(x<.0065){ p.down=S.day+8; m.ev.push({k:'av',until:S.day+8}); const c=val*.008; if(m.ins) metLog(b,'avarie sur '+T.n+' : 8 jours d’immobilisation, réparation prise en charge par l’assurance.','warn'); else { m.accC+=c; metLog(b,'avarie sur '+T.n+' : 8 jours d’immobilisation et '+eur(c,0)+' de réparation.','bad'); } }
  else { const aden=p.ch? p.ch.aden : (p.ln? shPath(shLine(b,p.ln).a,shLine(b,p.ln).b,m,!T.pan).aden : false);
    if(aden&&x<.0065+.006*(m.esc?.3:1)){ p.down=S.day+20; m.ev.push({k:'pir',until:S.day+20}); const c=val*.015;
      if(m.ins) metLog(b,'pirates dans le golfe d’Aden : '+T.n+' retenu 20 jours, rançon payée par l’assurance.','bad'); else { m.accC+=c; metLog(b,'pirates dans le golfe d’Aden : '+T.n+' retenu 20 jours, rançon de '+eur(c,0)+'.','bad'); } } } }
/* vos usines : le fret vers un autre pays passe par vos navires */
function shGroupCo(){ return S.biz.find(x=>x.def==='shipping'&&x.status==='active'&&x.m&&x.m.usn&&x.m.ln&&x.m.ln.length); }
{ const _rt=route; route=function(fromC,toC){ const R=_rt(fromC,toC), A=D.CITIES[fromC], B=D.CITIES[toC], co=shGroupCo();
    if(!co||fromC===toC||!A||!B||A.country===B.country) return R;
    R.days=Math.max(1,Math.ceil(R.days*.6)); R.rate*=.5; R.ship=true; R.co=co.id; return R; }; }
{ const _df=deliverFrom; deliverFrom=function(cid,bid){ const I=indInit(), c=I.active.find(x=>x.id===cid), b=S.biz.find(x=>x.id===bid);
    let R=null, cost=0; if(c&&b&&c.p&&b.st&&b.st[c.p]){ R=route(b.city,c.city); cost=c.qty*D.PRODS[c.p].v*R.rate; }
    const r=_df(cid,bid); if(r&&r.ok&&R&&R.co){ const co=S.biz.find(x=>x.id===R.co); if(co&&co.m){ co.m.uf=(co.m.uf||0)+cost; co.m.uft=(co.m.uft||0)+cost; } } return r; }; }
/* le directeur : prix chaque semaine ; en délégation totale, affrètements, navires et lignes */
function shAuto(b,mode,q){ const m=b.m;
  if(S.day%7===0) m.ln.forEach(l=>{ let best=l.p, bv=-1e18; const save=l.p; for(let p=0;p<4;p++){ l.p=p; const x=shLineDay(b,l); if(x.net>bv){ bv=x.net; best=p; } } l.p= rnd()<(1-q)*.3? save : best; });
  /* affrètement : un vraquier ou un pétrolier libre prend la meilleure offre rentable */
  m.fl.filter(p=>SH_TY[p.t].k!=='box'&&shFree(m,p)).forEach(p=>{ const T=SH_TY[p.t]; const o=m.off.filter(o=>o.k===T.k&&o.q<=T.cap).map(o=>{ const days=Math.ceil(2*o.d/(T.kn*1.852*24)+5); return {o, v:o.pay/days}; }).sort((x,y)=>y.v-x.v)[0];
    if(o&&o.v>shMaint(m,p)+T.crew+T.fuel*shBunk(m)*.85) shCharter(b,o.o.id,p.id); });
  if(mode!=='full') return;
  /* V2.2.9 : la réserve sert chaque semaine : nouvelles lignes (navire acheté d’occasion si la réserve le permet), quais,
     terminaux, rachat des navires loués ; jusqu’à 6 opérations tant que la réserve suit (avant : une par mois) */
  if(S.day%7===3) for(let k=0;k<6;k++){ if(!shInvest(b)&&!shNewLine(b,q)) break; }
  if(S.day%30===0){
    for(const [k,f,l,rk] of [['plan',1.5,'Planification des escales',1],['ali',3,'Alliance maritime',2],['eco',5,'Navires économes',3],['esc',6,'Sûreté et escortes',4],['d2d',10,'Logistique porte-à-porte',5]]) if(!m[k]&&mxHas(b,rk)&&shBuyR(b,k,f,l,rk,true).ok) break; }
}
/* V1.5.8 : en délégation totale, la réserve achète aussi des terminaux et remplace les navires loués des lignes rentables */
function shNextTm(b){ const m=b.m; return Object.values(SH_PT).filter(a=>a.tm&&!m.tm.includes(a.id)&&shTmReq(b,a.id)<=m.img).sort((x,y)=>shTmCost(x.id)-shTmCost(y.id))[0]; }
function shLeasedOnGood(b){ const m=b.m; return m.fl.filter(p=>!p.own&&p.ln&&SH_TY[p.t].k==='box').map(p=>({p,l:shLine(b,p.ln)})).filter(x=>x.l&&(x.l.st||shLineDay(b,x.l)).net>0).sort((x,y)=>SH_TY[x.p.t].pr-SH_TY[y.p.t].pr)[0]; }
function shNewLine(b,q){ const m=b.m; const cands=[]; m.tm.forEach(h=>shDests(b,h).filter(x=>!shCanLine(b,h,x.id)).forEach(x=>cands.push([h,x])));
  if(!cands.length){ if(!m.tm.length) return false; const h=m.tm.filter(t=>((m.ext&&m.ext[t])||0)<3).sort((x,y)=>shTmUsed(b,y)-shTmUsed(b,x))[0]; return !!h&&dlCan(b,shExtCost(b,h),'Quais')&&shExt(b,h,true).ok; }   /* V2.5.7 : quais ajoutés au terminal le plus chargé qui n'est pas au maximum (avant : toujours le plus chargé, bloqué une fois plein) */
  const own=mDlp(b)>=SH_TY.p5.pr*SH_OCC*1.2; if(!own&&mDlp(b)<=SH_TY.p5.ls*30) return false;
  /* étude avec un navire fictif : rien n’est acheté si aucune ligne n’est rentable */
  const t={id:-7, t:'p5', own:own?1:0, occ:own?1:0, ln:-1, down:0, dep:0, yard:0}; m.fl.push(t); const sc=[];
  cands.forEach(([h,x])=>{ const l={id:-1, a:h, b:x.id, p:1}; m.ln.push(l); const v=shLineDay(b,l).net; if(v>0) sc.push([v,[h,x.id]]); m.ln.pop(); });
  m.fl.pop(); if(!sc.length) return false; sc.sort((x,y)=>y[0]-x[0]);
  const k= rnd()<(1-q)*.8? Math.floor(rnd()*Math.min(5,sc.length)) : 0;
  const r=shGet(b,'p5',own?'occ':'lease',true); if(!r.ok) return false; const p=m.fl[m.fl.length-1]; return shOpen(b,sc[k][1][0],sc[k][1][1],p.id).ok; }
function shInvest(b){ const m=b.m, T=shNextTm(b);
  if(T&&shBuyTm(b,T.id,true).ok) return true;
  const x=shLeasedOnGood(b); if(!x) return false; const c=shBuyOutCost(x.p); if(!dlCan(b,c,'Rachat d’un navire')) return false;
  if(!shBuyOut(b,x.p.id,true).ok) return false; metLog(b,'le directeur rachète le '+SH_TY[x.p.t].n+' loué de la ligne '+shPt(x.l.a).n+' – '+shPt(x.l.b).n+'.',''); return true; }
/* V2.4.9 : rachat d'un navire loué au prix de l'occasion, moins le dépôt ; il garde sa ligne et devient un navire d'occasion */
const shBuyOutCost = p => Math.max(0,SH_TY[p.t].pr*SH_OCC-(p.dep||0));
function shBuyOut(b,id,auto){ const m=b.m, p=m.fl.find(x=>x.id===id); if(!p) return err('Navire introuvable.'); if(p.own) return err('Ce navire vous appartient déjà.'); const T=SH_TY[p.t], c=shBuyOutCost(p);
  if(!(auto? dlSpend(b,c,'Rachat : '+T.n) : metBuy(b,c,'Rachat d’un navire loué : '+T.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  p.own=1; p.occ=1; p.dep=0; return ok(T.n+' racheté '+eur(c,0)+' : il n’y a plus de loyer.'); }
MET.shipping.goal=function(b){ const m=b.m; if(m.tm.length&&m.tm.every(h=>shTmUsed(b,h)>=shTmCap(b,h))){ const h=m.tm[0]; if((m.ext&&m.ext[h]||0)<3) return {n:'Quais à '+shPt(h).n, c:shExtCost(b,h), act:'ext', arg:h}; } const T=shNextTm(b); if(T) return {n:'Terminal à '+T.n, c:shTmCost(T.id), act:'tm', arg:T.id}; const x=shLeasedOnGood(b); return x? {n:'Rachat du '+SH_TY[x.p.t].n+' loué', c:shBuyOutCost(x.p), act:'own', arg:x.p.id} : null; };
function shData(){ return {SH_PT, SH_TY, SH_RG, SH_NB}; }

/* V2.4.9 : image de marque, détail des facteurs (même calcul que la journée) */
function shImgParts(b){ const m=b.m, d=m.st||{}, lf=d.lf||0, inc=(m.ev||[]).filter(e=>(e.k==='pir'||e.k==='av')&&e.until>=S.day).length;
  return [['Ancienneté',Math.min(24,(S.day-(m.d0||S.day))/360*6),1,'jusqu’à +24 en quatre ans'],['Réseau ('+plu(m.ln.length,'ligne')+')',Math.min(8,m.ln.length*.5),1,'jusqu’à +8'],['Terminaux ('+m.tm.length+')',Math.min(8,m.tm.length*1.2),1,'jusqu’à +8'],
    ['Alliance maritime',m.ali?4:0,!!m.ali,'+4'],['Logistique porte-à-porte',m.d2d?4:0,!!m.d2d,'+4'],
    ['Remplissage',lf>.7?3:lf<.4?-3:0,1,'+3 au-dessus de 70 %, −3 sous 40 %'],['Avaries et piraterie',-inc*4,1,'−4 par incident en cours']]; }
const shImgShare = img => clamp(.2+img/260,.1,.65);

