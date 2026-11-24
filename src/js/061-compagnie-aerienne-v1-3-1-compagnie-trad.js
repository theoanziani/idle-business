/* ============================================================
   COMPAGNIE AÉRIENNE (V1.3.1) — compagnie traditionnelle
   - Places dans les tours de contrôle (« plateformes ») : 1 ou 2 grands aéroports par pays,
     5 pays en Europe, 3 sur chaque autre continent. Chaque place coûte cher et demande une image
     de marque minimale : tout débloquer prend des années.
   - Lignes : d'une plateforme vers un aéroport du même pays ou d'un pays voisin ; long-courrier
     uniquement entre deux de vos plateformes. Les lignes courtes amènent des correspondances.
   - Flotte : avions achetés (investissement) ou loués (loyer chaque jour). Un avion sert une ligne.
   - Carburant : prix du kérosène qui varie ; couverture de 90 jours possible.
   - Classes économique et affaires, programme de fidélité (palier).
   Événements : grève du contrôle aérien, panne d'un avion, flambée du kérosène, vacances d'été.
   État b.m (v:1) : hubs[] (aéroports), fl[] {id, t, own, ln, down}, ln[] {id, a, b, p, cab, st},
   fp (kérosène €/kg), hedge {p, until}, img (image 0-100), fid, sal, mnt, ali, fret, ev, nid, st (dernier jour),
   acc, accC, pend, pendC, log.
   ============================================================ */
D.biz.airline={n:'Compagnie aérienne', sub:'Vols réguliers en Europe et dans le monde', cat:'com', tier:4, cost:8000000, launch:45, payback:300, c:.5, risk:.14, econ:1.3, rate:1, open:'always', wkf:1.1, rep:.8, el:1.2,
  roles:[['ing',8,150],['cadre',10,95],['manager',3,160],['ouvrier',20,50]], tags:['transport']};
D.BIZSEC.airline='loisirs';
D.DEFB.airline={t:['tower','office'],s:2000};
if(typeof BIZ_NAMES!=='undefined') BIZ_NAMES.airline=['Air {h}','{h} Airlines','Ailes de {v}'];
if(D.BASKET) D.BASKET.airline=250;
if(!D.bizOrder.includes('airline')){ D.bizOrder.push('airline'); D.bizOrder.sort((a,b)=>D.biz[a].tier-D.biz[b].tier || D.biz[a].cost-D.biz[b].cost); }

const AL_CT={eu:'Europe', na:'Amérique du Nord', sa:'Amérique du Sud', af:'Afrique', as:'Asie', oc:'Océanie'};
const AL_CO={
  fr:{n:'France', ct:'eu', nb:['es','de','it','uk']}, es:{n:'Espagne', ct:'eu', nb:['fr','ma']}, de:{n:'Allemagne', ct:'eu', nb:['fr']},
  it:{n:'Italie', ct:'eu', nb:['fr']}, uk:{n:'Royaume-Uni', ct:'eu', nb:['fr']},
  us:{n:'États-Unis', ct:'na', nb:['ca','mx']}, ca:{n:'Canada', ct:'na', nb:['us']}, mx:{n:'Mexique', ct:'na', nb:['us']},
  br:{n:'Brésil', ct:'sa', nb:['ar','co']}, ar:{n:'Argentine', ct:'sa', nb:['br']}, co:{n:'Colombie', ct:'sa', nb:['br']},
  za:{n:'Afrique du Sud', ct:'af', nb:[]}, ma:{n:'Maroc', ct:'af', nb:['es']}, eg:{n:'Égypte', ct:'af', nb:[]},
  cn:{n:'Chine', ct:'as', nb:['jp']}, jp:{n:'Japon', ct:'as', nb:['cn']}, ae:{n:'Émirats arabes unis', ct:'as', nb:[]},
  au:{n:'Australie', ct:'oc', nb:['nz']}, nz:{n:'Nouvelle-Zélande', ct:'oc', nb:['au','fj']}, fj:{n:'Fidji', ct:'oc', nb:['nz','au']}
};
/* aéroports : [code, ville, pays, lat, lon, taille (millions de passagers par an), plateforme ?, loisirs ?] */
const AL_AP={};
[['CDG','Paris-Charles-de-Gaulle','fr',49.01,2.55,70,1],['NCE','Nice','fr',43.66,7.21,14,1,1],['ORY','Paris-Orly','fr',48.72,2.38,32],['LYS','Lyon','fr',45.72,5.08,11],['MRS','Marseille','fr',43.44,5.22,10],['TLS','Toulouse','fr',43.63,1.37,9],['BOD','Bordeaux','fr',44.83,-.72,7],
 ['MAD','Madrid','es',40.47,-3.56,60,1],['BCN','Barcelone','es',41.30,2.08,50,1,1],['AGP','Málaga','es',36.67,-4.50,22,0,1],['PMI','Palma de Majorque','es',39.55,2.74,30,0,1],['SVQ','Séville','es',37.42,-5.90,8],['VLC','Valence','es',39.49,-.48,10],
 ['FRA','Francfort','de',50.04,8.56,60,1],['MUC','Munich','de',48.35,11.79,40,1],['BER','Berlin','de',52.36,13.50,25],['HAM','Hambourg','de',53.63,9.99,14],['DUS','Düsseldorf','de',51.29,6.77,20],
 ['FCO','Rome','it',41.80,12.25,45,1],['MXP','Milan','it',45.63,8.72,28,1],['VCE','Venise','it',45.50,12.35,11,0,1],['NAP','Naples','it',40.88,14.29,12,0,1],['CTA','Catane','it',37.47,15.07,10,0,1],
 ['LHR','Londres-Heathrow','uk',51.47,-.45,80,1],['MAN','Manchester','uk',53.35,-2.28,28,1],['EDI','Édimbourg','uk',55.95,-3.36,14],['BHX','Birmingham','uk',52.45,-1.75,12],['LGW','Londres-Gatwick','uk',51.15,-.18,40],
 ['JFK','New York-JFK','us',40.64,-73.78,62,1],['LAX','Los Angeles','us',33.94,-118.41,75,1],['ORD','Chicago','us',41.98,-87.90,70],['MIA','Miami','us',25.79,-80.29,50,0,1],['SFO','San Francisco','us',37.62,-122.38,50],['LAS','Las Vegas','us',36.08,-115.15,55,0,1],['BOS','Boston','us',42.36,-71.01,40],
 ['YYZ','Toronto','ca',43.68,-79.62,45,1],['YVR','Vancouver','ca',49.19,-123.18,25,1],['YUL','Montréal','ca',45.47,-73.74,20],['YYC','Calgary','ca',51.13,-114.01,18],
 ['MEX','Mexico','mx',19.44,-99.07,48,1],['CUN','Cancún','mx',21.04,-86.87,30,1,1],['GDL','Guadalajara','mx',20.52,-103.31,16],['MTY','Monterrey','mx',25.78,-100.11,12],
 ['GRU','São Paulo','br',-23.43,-46.47,42,1],['GIG','Rio de Janeiro','br',-22.81,-43.25,15,1,1],['BSB','Brasília','br',-15.87,-47.92,15],['SSA','Salvador','br',-12.91,-38.33,8,0,1],['REC','Recife','br',-8.13,-34.92,9],
 ['EZE','Buenos Aires','ar',-34.82,-58.54,12,1],['COR','Córdoba','ar',-31.32,-64.21,4],['MDZ','Mendoza','ar',-32.83,-68.79,3],['BRC','Bariloche','ar',-41.15,-71.16,2,0,1],
 ['BOG','Bogota','co',4.70,-74.15,35,1],['MDE','Medellín','co',6.17,-75.43,12],['CTG','Carthagène','co',10.44,-75.51,7,0,1],['CLO','Cali','co',3.54,-76.38,6],
 ['JNB','Johannesburg','za',-26.13,28.24,20,1],['CPT','Le Cap','za',-33.97,18.60,10,1,1],['DUR','Durban','za',-29.61,31.12,6],['PLZ','Port Elizabeth','za',-33.98,25.62,2],
 ['CMN','Casablanca','ma',33.37,-7.59,10,1],['RAK','Marrakech','ma',31.61,-8.04,9,1,1],['AGA','Agadir','ma',30.33,-9.41,3,0,1],['FEZ','Fès','ma',33.93,-4.98,2],['TNG','Tanger','ma',35.73,-5.92,2],
 ['CAI','Le Caire','eg',30.12,31.41,25,1],['HRG','Hurghada','eg',27.18,33.80,9,0,1],['SSH','Charm el-Cheikh','eg',27.98,34.39,7,0,1],['LXR','Louxor','eg',25.67,32.71,2,0,1],
 ['PEK','Pékin','cn',40.08,116.58,55,1],['PVG','Shanghai','cn',31.14,121.81,55,1],['CAN','Canton','cn',23.39,113.30,60],['CTU','Chengdu','cn',30.58,103.95,45],['SZX','Shenzhen','cn',22.64,113.81,50],
 ['HND','Tokyo-Haneda','jp',35.55,139.78,80,1],['KIX','Osaka','jp',34.43,135.24,25,1],['CTS','Sapporo','jp',42.78,141.69,20],['FUK','Fukuoka','jp',33.59,130.45,22],['OKA','Okinawa','jp',26.20,127.65,18,0,1],
 ['DXB','Dubaï','ae',25.25,55.36,87,1],['AUH','Abou Dabi','ae',24.43,54.65,23,1],['SHJ','Sharjah','ae',25.33,55.52,15],
 ['SYD','Sydney','au',-33.94,151.18,40,1],['MEL','Melbourne','au',-37.67,144.84,35,1],['BNE','Brisbane','au',-27.38,153.12,23],['PER','Perth','au',-31.94,115.97,14],['CNS','Cairns','au',-16.88,145.75,5,0,1],
 ['AKL','Auckland','nz',-37.01,174.79,18,1],['WLG','Wellington','nz',-41.33,174.81,6],['CHC','Christchurch','nz',-43.49,172.53,6],['ZQN','Queenstown','nz',-45.02,168.74,2,0,1],
 ['NAN','Nadi','fj',-17.76,177.44,3,1,1],['SUV','Suva','fj',-18.04,178.56,1]
].forEach(([id,n,co,lat,lon,sz,hub,lei])=>{ AL_AP[id]={id,n,co,lat,lon,sz,hub:!!hub,lei:!!lei}; });
/* avions (modèles fictifs) : sièges, rayon d'action (km), vitesse, prix, loyer par jour, kérosène (kg/km), équipage (€/h) */
const AL_TY={
  r70:{n:'Aéro R70', d:'Régional', seats:70, rg:1800, v:500, pr:24e6, ls:7000, burn:2.3, crew:700},
  m180:{n:'Aéro M180', d:'Moyen-courrier', seats:180, rg:6000, v:830, pr:95e6, ls:22000, burn:5.2, crew:1400},
  l300:{n:'Aéro L300', d:'Long-courrier', seats:300, rg:13000, v:900, pr:280e6, ls:60000, burn:9.2, crew:2800},
  x450:{n:'Aéro X450', d:'Très gros porteur', seats:450, rg:15000, v:910, pr:420e6, ls:90000, burn:12.6, crew:3600}
};
const AL_PRICE=[.8,1,1.2,1.4], AL_CAB=[0,.08,.15];
const alAp = id => AL_AP[id];
function alDist(a,b){ const A=alAp(a), B=alAp(b), r=Math.PI/180, dl=(B.lat-A.lat)*r, dn=(B.lon-A.lon)*r, x=Math.sin(dl/2)**2+Math.cos(A.lat*r)*Math.cos(B.lat*r)*Math.sin(dn/2)**2; return Math.round(2*6371*Math.asin(Math.sqrt(x))); }
/* conditions d'une place dans la tour : prix et image de marque minimale */
/* V2.3.1 : avions, location et places dans les tours à 30 % de leur ancien prix */
const AL_ASSET=.3; Object.values(AL_TY).forEach(T=>{ T.pr*=AL_ASSET; T.ls=Math.round(T.ls*AL_ASSET); });
function alHubCost(id){ const A=alAp(id); return Math.round((9e6+A.sz*7.8e5)*AL_ASSET/1e5)*1e5; }
function alHubReq(b,id){ const A=alAp(id), home=AL_CO[alHomeCo(b)]; return Math.round(28+A.sz*.35+(home&&AL_CO[A.co].ct!==home.ct?15:0)); }
function alHomeCo(b){ const cc=b&&b.city, map={paris:'fr',toulouse:'fr',marseille:'fr',madrid:'es',barcelone:'es',seville:'es',miami:'us',newyork:'us',losangeles:'us',rio:'br',saopaulo:'br',salvador:'br',pekin:'cn',shanghai:'cn',shenzhen:'cn'}; return map[cc]||'de'; }
function alStartHub(b){ return {fr:'CDG',es:'MAD',us:'JFK',br:'GRU',cn:'PEK',de:'FRA'}[alHomeCo(b)]||'FRA'; }
/* destinations possibles depuis une plateforme */
function alDests(b,from){ const m=b.m, A=alAp(from), co=AL_CO[A.co], ok=[A.co].concat(co.nb);
  return Object.values(AL_AP).filter(x=>x.id!==from&&(ok.includes(x.co)||m.hubs.includes(x.id))); }
function alPlane(b,id){ return b.m.fl.find(p=>p.id===id); }
function alLine(b,id){ return b.m.ln.find(l=>l.id===id); }
/* au-delà de son rayon d'action, un avion fait une escale technique (jusqu'à deux fois son rayon) */
const alStop = (t,d) => d>AL_TY[t].rg;
const alReach = (t,d) => d<=AL_TY[t].rg*2;
function alBlock(t,d){ return d/AL_TY[t].v+.75+(alStop(t,d)?1.5:0); }
function alLegs(t,d){ return Math.max(1,Math.floor(13/alBlock(t,d)))&~1 || 2; }
/* prix moyen d'un billet économique selon la distance */
function alEco(d){ return d<1500? 76+.064*d : 172+.045*(d-1500); }
function alFuel(b){ const m=b.m; return m.hedge&&m.hedge.until>=S.day? m.fp*.3+m.hedge.p*.7 : m.fp; }
function alEv(m,k){ return m.ev&&m.ev.k===k&&m.ev.until>=S.day; }
function alInit(b){
  const h=alStartHub(b), A=alAp(h);
  const m={v:1, hubs:[h], ext:{}, fl:[], ln:[], fp:.8, hedge:null, img:35, fid:0, sal:0, mnt:0, ali:0, fret:0, ev:null, nid:1, st:null, acc:0, accC:0, pend:0, pendC:0, last:null, log:[]};
  b.m=m; b.stock=0;
  /* au départ : deux moyen-courriers loués sur deux lignes intérieures */
  const dests=alDests(b,h).filter(x=>x.co===A.co&&alDist(h,x.id)>=300&&alDist(h,x.id)<=2500).sort((x,y)=>y.sz-x.sz).slice(0,2);
  dests.forEach(x=>{ const p={id:m.nid++, t:'m180', own:0, ln:0, down:0}; m.fl.push(p); const l={id:m.nid++, a:h, b:x.id, p:1, cab:1}; m.ln.push(l); p.ln=l.id; });
  return m;
}
/* une journée d'une ligne (sim : prévision sans hasard) */
function alLineDay(b,l,sim){
  const m=b.m, P=m.fl.filter(p=>p.ln===l.id&&!(p.down>S.day)); if(!P.length) return {pax:0,seats:0,rev:0,cost:0,legs:0,lf:0,net:0};
  const d=alDist(l.a,l.b), A=alAp(l.a), B=alAp(l.b), long=d>3500;
  const strike=alEv(m,'gr')&&(A.co===m.ev.co||B.co===m.ev.co);
  if(strike) return {pax:0,seats:0,rev:0,cost:P.reduce((a,p)=>a+(p.own?0:AL_TY[p.t].ls),0),legs:0,lf:0,net:0,strike:1};
  /* demande (passagers par jour, deux sens) et part de marché de la compagnie */
  let dem=+(170)*Math.sqrt(A.sz*B.sz)/(1+d/4000)*(d<350?.6:1);
  if((A.lei||B.lei)&&alEv(m,'ete')) dem*=1.25;
  dem*=tradeF(AP_CTY[A.co],AP_CTY[B.co],.5);
  if(P.some(p=>alStop(p.t,d))) dem*=.85;
  if(long){ const feed=m.ln.filter(x=>x!==l&&(x.a===l.a||x.a===l.b||x.b===l.a||x.b===l.b)&&alDist(x.a,x.b)<=3500).length; dem*=1+Math.min(.4,.04*feed)+(m.ali?.15:0); }
  const pm=AL_PRICE[l.p]||1, share=clamp(.22+m.img/250+(m.fid?.05:0),.1,.7)*Math.pow(pm,-2.6);
  /* concurrence : plus la route est grosse, plus d'autres compagnies s'y battent */
  const want=dem*share*(2500/(2500+dem))*(m.fid?1.08:1), bshare=((long?.12:.06)+(m.sal?.03:0))*(m.fid?1.2:1);
  /* le planning ajuste la fréquence à la demande (allers-retours), dans la limite des avions */
  const fuel=alFuel(b)*(alEv(m,'ker')?1.35:1);
  let seats=0, legs=0, bseats=0, cost=0; const avgS=P.reduce((a,p)=>a+AL_TY[p.t].seats,0)/P.length, need=Math.max(2,2*Math.ceil(want/(2*avgS*.85)));
  P.forEach(p=>{ const T=AL_TY[p.t], mx=alLegs(p.t,d), lg=Math.min(mx,Math.max(0,need-legs)), cab=p.t==='r70'?0:(AL_CAB[l.cab]||0), bs=Math.round(T.seats*cab/2.5), es=T.seats-Math.round(bs*2.5);
    legs+=lg; seats+=lg*(es+bs); bseats+=lg*bs; cost+=lg*(T.burn*d*fuel+alBlock(p.t,d)*T.crew+(alStop(p.t,d)?1600:800))+(p.own? T.pr*.00012*(m.mnt?.8:1) : T.ls)+T.ls*.2; });
  const bwant=want*bshare, bpax=Math.min(bseats,bwant), epax=Math.min(seats-bseats,want-bwant), pax=bpax+epax;
  const eco=alEco(d)*pm, biz=eco*3.2;
  let rev=epax*eco+bpax*biz; if(m.fret&&long) rev*=1.08;
  cost+=pax*12;
  return {pax, bpax, seats, rev, cost, legs, lf: seats? pax/seats : 0, net:rev-cost, d, want};
}
function alDay(b,sim){ const m=b.m; let r={pax:0,seats:0,rev:0,cost:0,legs:0}; m.ln.forEach(l=>{ const x=alLineDay(b,l,sim); l.st=x; ['pax','seats','rev','cost','legs'].forEach(k=>r[k]+=x[k]||0); });
  /* avions sans ligne : loyer ou entretien quand même */
  m.fl.filter(p=>!p.ln||!m.ln.some(l=>l.id===p.ln)).forEach(p=>{ const T=AL_TY[p.t]; r.cost+=p.own? T.pr*.00012*(m.mnt?.8:1) : T.ls; });
  r.lf=r.seats? r.pax/r.seats : 0; return r; }
MET.airline = {
  fam:'com', core:true, init:alInit,
  ranks:[
    {n:'Programme de fidélité', d:'Les voyageurs fréquents vous restent fidèles : plus de passagers, surtout en classe affaires.'},
    {n:'Salons à l’aéroport', d:'Des salons pour vos clients affaires : plus de passagers affaires et une meilleure image.'},
    {n:'Maintenance maison', d:'Votre propre atelier : entretien des avions achetés 20 % moins cher, moins de pannes.'},
    {n:'Alliance de compagnies', d:'Des partenaires vous amènent des correspondances : +15 % de demande sur le long-courrier.'},
    {n:'Fret en soute', d:'Des marchandises dans les soutes de vos long-courriers : +8 % de recettes sur ces lignes.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){
    const m=b.m;
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* kérosène : marche au hasard autour de 0,80 €/kg */
    m.fp=clamp(m.fp+(.8-m.fp)*.02+.012*norm(),.45,1.4);
    if(m.hedge&&m.hedge.until<S.day){ m.hedge=null; metLog(b,'la couverture carburant est terminée.',''); }
    const d=alDay(b,false); m.st=d; m.acc+=d.rev; m.accC+=(d.cost0||d.cost);
    /* image de marque : réseau, ponctualité, service */
    if(!m.d0) m.d0=S.day;
    m.img=clamp(m.img+(imgTarget(alImgParts(b))-m.img)/400,0,100);
    /* événements */
    if(!m.ev){ const r=rnd(), mo=Math.floor(((S.day-1)%360)/30);
      if(mo===6&&!alEv(m,'ete')&&r<.2){ m.ev={k:'ete', until:S.day+55}; metLog(b,'vacances d’été : 25 % de passagers en plus vers les destinations de loisirs.','good'); }
      else if(r<.004){ const cos=[...new Set(m.ln.flatMap(l=>[alAp(l.a).co,alAp(l.b).co]))]; if(cos.length){ const co=pick(cos); m.ev={k:'gr', co, until:S.day+2}; metLog(b,'grève du contrôle aérien ('+AL_CO[co].n+') : vols annulés pendant 2 jours.','bad'); } }
      else if(r<.007&&m.fl.length){ const p=pick(m.fl); p.down=S.day+(m.mnt?3:6); m.ev={k:'pn', until:S.day+1}; metLog(b,AL_TY[p.t].n+' immobilisé après une panne ('+(m.mnt?3:6)+' jours).','bad'); }
      else if(r<.009){ m.ev={k:'ker', until:S.day+30}; metLog(b,'flambée du kérosène : carburant 35 % plus cher pendant un mois.','bad'); } }
  },
  kpis(b){ const m=b.m, d=m.st||alDay(b,true);
    return [['Passagers / jour', fmtN(Math.round(d.pax)), d.legs+' vols par jour'],
            ['Remplissage', Math.round(d.lf*100)+' %', m.ln.length+' ligne'+(m.ln.length>1?'s':'')],
            ['Image de marque', Math.round(m.img)+' / 100', m.hubs.length+' plateforme'+(m.hubs.length>1?'s':'')],
            ['Kérosène', fmtN(alFuel(b),2)+' € / kg', m.hedge? 'Couvert encore '+(m.hedge.until-S.day)+' j' : 'Non couvert']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push(m.hedge? {k:'buy', act:'hedge', label:'Couverture carburant', owned:true, sub:'70 % du kérosène payé '+fmtN(m.hedge.p,2)+' € / kg jusqu’au '+dateL(m.hedge.until)+'.'} :
      {k:'btn', act:'hedge', label:'Se couvrir 90 jours au prix du jour', cost:alHedgeCost(b), sub:'70 % du kérosène payé '+fmtN(m.fp*1.03,2)+' € / kg pendant 90 jours, quoi qu’il arrive.'});
    [['fid',1,1.5,'Programme de fidélité','Plus de passagers, surtout en affaires.'],['sal',2,3,'Salons à l’aéroport','Plus de passagers affaires, meilleure image.'],['mnt',3,5,'Maintenance maison','Entretien −20 %, pannes plus courtes.'],['ali',4,8,'Alliance de compagnies','+15 % de demande long-courrier.'],['fret',5,12,'Fret en soute','+8 % de recettes long-courrier.']].forEach(([k2,rk,f,l,s])=>{
      if(mxHas(b,rk)) out.push(m[k2]? {k:'buy', act:k2, label:l, owned:true, sub:s} : {k:'buy', act:k2, label:l, cost:(d.cost0||d.cost)*f, sub:s}); });
    return out;
  },
  acts:{
    hub:(b,id)=>alBuyHub(b,id),
    ext:(b,id)=>alExt(b,id),
    open:(b,arg)=>{ const [a,bb,pid]=String(arg).split(':'); return alOpen(b,a,bb,+pid); },
    close:(b,id)=>alClose(b,+id),
    price:(b,arg)=>{ const [id,v]=String(arg).split(':'), l=alLine(b,+id); if(!l) return err('Ligne introuvable.'); l.p=clamp(+v|0,0,3); return ok(''); },
    cab:(b,arg)=>{ const [id,v]=String(arg).split(':'), l=alLine(b,+id); if(!l) return err('Ligne introuvable.'); l.cab=clamp(+v|0,0,2); return ok(''); },
    add:(b,arg)=>{ const [id,pid]=String(arg).split(':'); return alAssign(b,+id,+pid); },
    lease:(b,t)=>alGet(b,t,false),
    buy:(b,t)=>alGet(b,t,true),
    drop:(b,id)=>alDrop(b,+id),
    own:(b,id)=>alBuyOut(b,+id),
    hedge:(b)=>alHedge(b),
    fid:(b)=>alBuyR(b,'fid',1.5,'Programme de fidélité',1),
    sal:(b)=>alBuyR(b,'sal',3,'Salons à l’aéroport',2),
    mnt:(b)=>alBuyR(b,'mnt',5,'Maintenance maison',3),
    ali:(b)=>alBuyR(b,'ali',8,'Alliance de compagnies',4),
    fret:(b)=>alBuyR(b,'fret',12,'Fret en soute',5)
  },
  auto: alAuto
};
function alBuyR(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizCost0(b)*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function alBuyHub(b,id,auto){ const m=b.m, A=alAp(id); if(!A||!A.hub) return err('Aéroport inconnu.'); if(m.hubs.includes(id)) return err('Vous y êtes déjà.');
  const req=alHubReq(b,id); if(m.img<req) return err('Image de marque insuffisante : '+req+' requis ('+Math.round(m.img)+' aujourd’hui).');
  const c=alHubCost(id); if(!(auto? dlSpend(b,c,'Place dans la tour : '+A.n) : metBuy(b,c,'Place dans la tour de contrôle : '+A.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.hubs.push(id); metLog(b,'place obtenue dans la tour de contrôle de '+A.n+'.','good'); return ok('Vous pouvez maintenant ouvrir des lignes depuis '+A.n+'.'); }
/* créneaux : 4 lignes au départ de chaque plateforme, +3 par achat de créneaux (3 achats au plus) */
function alHubCap(b,h){ return 4+3*((b.m.ext&&b.m.ext[h])||0); }
function alHubUsed(b,h){ return b.m.ln.filter(l=>l.a===h).length; }
function alExtCost(b,h){ return Math.round(alHubCost(h)*.5*(1+((b.m.ext&&b.m.ext[h])||0))/1e5)*1e5; }
function alExt(b,h,auto){ const m=b.m; if(!m.hubs.includes(h)) return err('Achetez d’abord une place dans la tour.'); m.ext=m.ext||{}; const n=m.ext[h]||0; if(n>=3) return err('Créneaux au maximum à '+alAp(h).n+'.');
  const c=alExtCost(b,h); if(!(auto? dlSpend(b,c,'Créneaux : '+alAp(h).n) : metBuy(b,c,'Créneaux supplémentaires : '+alAp(h).n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.ext[h]=n+1; metLog(b,'créneaux supplémentaires à '+alAp(h).n+' : '+alHubCap(b,h)+' lignes possibles.','good'); return ok(alHubCap(b,h)+' lignes possibles au départ de '+alAp(h).n+'.'); }
function alCanLine(b,a,bb){ const m=b.m; if(!m.hubs.includes(a)) return 'Départ depuis une de vos plateformes uniquement.'; if(!alAp(bb)) return 'Aéroport inconnu.';
  if(alHubUsed(b,a)>=alHubCap(b,a)) return 'Plus de créneau libre à '+alAp(a).n+' ('+alHubCap(b,a)+' lignes) : achetez des créneaux supplémentaires.';
  if(!alDests(b,a).some(x=>x.id===bb)) return 'Destination hors de portée : même pays, pays voisin, ou une autre de vos plateformes.';
  if(m.ln.some(l=>(l.a===a&&l.b===bb)||(l.a===bb&&l.b===a))) return 'Cette ligne existe déjà.'; return ''; }
function alOpen(b,a,bb,pid){ const m=b.m, e=alCanLine(b,a,bb); if(e) return err(e); const p=alPlane(b,pid); if(!p) return err('Choisissez un avion.');
  if(p.ln&&m.ln.some(l=>l.id===p.ln)) return err('Cet avion vole déjà sur une autre ligne.'); const d=alDist(a,bb); if(!alReach(p.t,d)) return err('Trop loin pour cet avion, même avec une escale ('+fmtN(d,0)+' km).');
  const l={id:m.nid++, a, b:bb, p:1, cab:1}; m.ln.push(l); p.ln=l.id; metLog(b,'nouvelle ligne '+alAp(a).n+' – '+alAp(bb).n+'.','good'); return ok('Ligne ouverte : '+alAp(a).n+' – '+alAp(bb).n+'.'); }
function alAssign(b,lid,pid){ const m=b.m, l=alLine(b,lid), p=alPlane(b,pid); if(!l||!p) return err('Introuvable.'); if(p.ln&&m.ln.some(x=>x.id===p.ln)) return err('Cet avion vole déjà.');
  if(!alReach(p.t,alDist(l.a,l.b))) return err('Trop loin pour cet avion, même avec une escale.'); p.ln=l.id; return ok(AL_TY[p.t].n+' ajouté sur la ligne.'); }
function alClose(b,lid){ const m=b.m, l=alLine(b,lid); if(!l) return err('Ligne introuvable.'); m.ln=m.ln.filter(x=>x!==l); m.fl.forEach(p=>{ if(p.ln===lid) p.ln=0; }); return ok('Ligne fermée ; ses avions sont disponibles.'); }
function alGet(b,t,own,auto){ const m=b.m, T=AL_TY[t]; if(!T) return err('Modèle inconnu.');
  if(own){ if(!(auto? dlSpend(b,T.pr,'Achat : '+T.n) : metBuy(b,T.pr,'Achat d’un avion : '+T.n))) return err('Trésorerie insuffisante : '+eur(T.pr,0)+'.'); }
  else { const dep=T.ls*30; if(mAvail(b)<dep) return err('Il faut '+eur(dep,0)+' de dépôt de garantie.'); mPayCap(b,'Dépôt de garantie : '+T.n,-dep); settleAccounts(); }
  const p={id:m.nid++, t, own:own?1:0, ln:0, down:0, dep: own?0:T.ls*30}; m.fl.push(p); return ok(T.n+(own?' acheté.':' loué ('+eur(T.ls,0)+' par jour).')); }
function alDrop(b,pid){ const m=b.m, p=alPlane(b,pid); if(!p) return err('Avion introuvable.'); const T=AL_TY[p.t];
  if(p.own){ mPayCap(b,'Revente : '+T.n,T.pr*.7); settleAccounts(); } else if(p.dep){ mPayCap(b,'Dépôt rendu : '+T.n,p.dep); settleAccounts(); }
  m.fl=m.fl.filter(x=>x!==p); return ok(p.own? T.n+' revendu '+eur(T.pr*.7,0)+'.' : 'Location de '+T.n+' terminée, dépôt rendu.'); }
function alHedgeCost(b){ const d=b.m.st||alDay(b,true), fuelDay=b.m.ln.reduce((a,l)=>{ const x=l.st; return a+(x&&x.d? b.m.fl.filter(p=>p.ln===l.id).reduce((s,p)=>s+alLegs(p.t,x.d)*AL_TY[p.t].burn*x.d,0) : 0); },0); return Math.round(fuelDay*90*.7*b.m.fp*.03/1000)*1000+5000; }
function alHedge(b){ const m=b.m; if(m.hedge) return err('Déjà couvert.'); const c=alHedgeCost(b); if(!metBuy(b,c,'Couverture carburant')) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.hedge={p:m.fp*1.03, until:S.day+90}; metLog(b,'couverture carburant : 70 % du kérosène à '+fmtN(m.fp*1.03,2)+' € / kg pendant 90 jours.','good'); return ok('Carburant couvert pour 90 jours.'); }
/* le directeur : prix des billets, cabines ; en délégation totale, avions et lignes */
function alAuto(b,mode,q){ const m=b.m;
  if(S.day%7===0) m.ln.forEach(l=>{ let best=l.p, bv=-1e18; const save=l.p; for(let p=0;p<4;p++){ l.p=p; const x=alLineDay(b,l,true); if(x.net>bv){ bv=x.net; best=p; } } l.p= rnd()<(1-q)*.3? save : best;
    const save2=l.cab; let bc=l.cab; bv=-1e18; for(let c=0;c<3;c++){ l.cab=c; const x=alLineDay(b,l,true); if(x.net>bv){ bv=x.net; bc=c; } } l.cab=bc; });
  if(mode!=='full') return;
  /* V2.2.9 : chaque semaine, la réserve sert : nouvelles lignes étudiées sur toutes les destinations (avion acheté si la
     loué puis racheté), créneaux, places dans les tours, rachat des avions loués ; jusqu’à 6 opérations (avant : une ligne
     par mois vers le plus grand aéroport d’une plateforme tirée au hasard) */
  /* V2.5.3 : rachats et tours avant les nouvelles lignes (avant : alInvest n'était tenté que si aucune ligne ne s'ouvrait) */
  if(S.day%7===3) for(let k=0;k<6;k++){ if(!alInvest(b)&&!alNewLine(b,q)) break; }
  if(S.day%30===0){ if(!m.hedge&&m.fp<.75) alHedge(b);
    for(const [k,f,l,rk] of [['fid',1.5,'Programme de fidélité',1],['sal',3,'Salons à l’aéroport',2],['mnt',5,'Maintenance maison',3],['ali',8,'Alliance de compagnies',4],['fret',12,'Fret en soute',5]]) if(!m[k]&&mxHas(b,rk)&&alBuyR(b,k,f,l,rk,true).ok) break; }
}
/* V1.5.8 : en délégation totale, la réserve achète aussi des places dans les tours et remplace les avions loués des lignes rentables */
function alNextHub(b){ const m=b.m; return Object.values(AL_AP).filter(a=>a.hub&&!m.hubs.includes(a.id)&&alHubReq(b,a.id)<=m.img).sort((x,y)=>y.sz-x.sz)[0]; }
function alLeasedOnGood(b){ const m=b.m; return m.fl.filter(p=>!p.own&&p.ln).map(p=>({p,l:alLine(b,p.ln)})).filter(x=>x.l&&(x.l.st||alLineDay(b,x.l,true)).net>0).sort((x,y)=>AL_TY[x.p.t].pr-AL_TY[y.p.t].pr)[0]; }
function alNewLine(b,q){ const m=b.m, cands=[]; m.hubs.forEach(h=>alDests(b,h).filter(x=>!alCanLine(b,h,x.id)).forEach(x=>cands.push([h,x.id])));
  if(!cands.length){ const h=m.hubs.filter(t=>((m.ext&&m.ext[t])||0)<3).sort((x,y)=>alHubUsed(b,y)-alHubUsed(b,x))[0]; return !!h&&dlCan(b,alExtCost(b,h),'Créneaux')&&alExt(b,h,true).ok; }   /* V2.5.7 : idem pour les créneaux */
  const sc=[]; ['r70','m180','l300'].forEach(t=>{ const T=AL_TY[t]; if(mDlp(b)<=T.ls*30) return; const own=false;   /* location : la croissance reste rapide, le rachat vient ensuite (alInvest) */
    const tp={id:-7, t, own:own?1:0, ln:-1, down:0, dep:0}; m.fl.push(tp);
    cands.forEach(([h,x])=>{ if(!alReach(t,alDist(h,x))) return; const l={id:-1, a:h, b:x, p:1, cab:1}; m.ln.push(l); const v=alLineDay(b,l,true).net; m.ln.pop(); if(v>0) sc.push([v,v,h,x,t,own]); });
    m.fl.pop(); });
  if(!sc.length) return false; sc.sort((x,y)=>y[0]-x[0]);
  const k= rnd()<(1-q)*.8? Math.floor(rnd()*Math.min(5,sc.length)) : 0, c=sc[k];
  const r=alGet(b,c[4],c[5],true); if(!r.ok) return false; const p=m.fl[m.fl.length-1]; return alOpen(b,c[2],c[3],p.id).ok; }
function alInvest(b){ const m=b.m, H=alNextHub(b);
  if(H&&alBuyHub(b,H.id,true).ok) return true;
  const x=alLeasedOnGood(b); if(!x||!dlCan(b,alBuyOutCost(x.p),'Rachat d’un avion')) return false;
  if(!alBuyOut(b,x.p.id,true).ok) return false; metLog(b,'le directeur rachète l’'+AL_TY[x.p.t].n+' loué de la ligne '+alAp(x.l.a).n+' – '+alAp(x.l.b).n+'.',''); return true; }
/* V2.4.9 : rachat d'un avion loué : 90 % du prix neuf, moins le dépôt de garantie ; il garde sa ligne */
const AL_BUYOUT=.9;
const alBuyOutCost = p => Math.max(0,AL_TY[p.t].pr*AL_BUYOUT-(p.dep||0));
function alBuyOut(b,id,auto){ const m=b.m, p=m.fl.find(x=>x.id===id); if(!p) return err('Avion introuvable.'); if(p.own) return err('Cet avion vous appartient déjà.'); const T=AL_TY[p.t], c=alBuyOutCost(p);
  if(!(auto? dlSpend(b,c,'Rachat : '+T.n) : metBuy(b,c,'Rachat d’un avion loué : '+T.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  p.own=1; p.dep=0; return ok(T.n+' racheté '+eur(c,0)+' : il n’y a plus de loyer.'); }
MET.airline.goal=function(b){ const H=alNextHub(b); if(H) return {n:'Place dans la tour : '+H.n, c:alHubCost(H.id), act:'hub', arg:H.id}; const x=alLeasedOnGood(b); return x? {n:'Rachat de l’'+AL_TY[x.p.t].n+' loué', c:alBuyOutCost(x.p), act:'own', arg:x.p.id} : null; };
function alData(){ return {AL_AP, AL_CO, AL_TY}; }

/* V2.4.9 : image de marque, détail des facteurs (même calcul que la journée) ; [libellé, points, acquis?] */
function alImgParts(b){ const m=b.m, d=m.st||{}, ev=m.ev&&(m.ev.k==='gr'||m.ev.k==='pn'), lf=d.lf||0;
  return [['Ancienneté',Math.min(25,(S.day-(m.d0||S.day))/360*6),1,'jusqu’à +25 en quatre ans'],['Réseau ('+plu(m.ln.length,'ligne')+')',Math.min(6,m.ln.length*.3),1,'jusqu’à +6'],
    ['Salons à l’aéroport',m.sal?6:0,!!m.sal,'+6'],['Programme de fidélité',m.fid?4:0,!!m.fid,'+4'],['Alliance de compagnies',m.ali?4:0,!!m.ali,'+4'],
    ['Remplissage',lf>.75?4:lf<.45?-4:0,1,'+4 au-dessus de 75 %, −4 sous 45 %'],['Grève ou panne',ev?-6:0,1,'−6 pendant l’incident']]; }
const alImgShare = img => clamp(.22+img/250,.1,.7);

