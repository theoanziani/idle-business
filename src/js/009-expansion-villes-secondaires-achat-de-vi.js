/* ============================================================
   EXPANSION : villes secondaires, achat de villes et de pays, nouvelles activités
   ============================================================ */

/* ---------- Nouvelles activités ---------- */
D.biz.warehouse={n:'Entrepôt logistique', sub:'Stockage et préparation de commandes', cat:'ind', tier:2, cost:150000, launch:25, payback:150, c:.30, risk:.08, econ:.8, rate:.3, open:'closed', wkf:.9, rep:.4, el:1.1,
  roles:[['ouvrier',12,42],['cadre',2,85],['manager',1,115]], tags:['industry'], syn:{with:'ecom', b:.06, txt:'commandes de votre boutique en ligne à traiter'}};
D.biz.dealer={n:'Concession automobile', sub:'Voitures neuves et d’occasion', cat:'com', tier:3, cost:800000, launch:30, payback:230, c:.78, risk:.09, econ:1.5, rate:1.6, open:'closed', wkf:1.2, rep:.7, el:1.8,
  roles:[['ouvrier',10,45],['cadre',4,95],['manager',2,130]], tags:['retail']};
D.biz.office={n:'Immeuble de bureaux', sub:'Location d’espaces tertiaires', cat:'imm', tier:3, cost:1200000, launch:35, payback:240, c:.10, risk:.05, econ:.8, rate:1.4, open:'closed', wkf:.9, rep:.5, el:.5,
  roles:[['ouvrier',6,42],['cadre',3,85],['manager',1,125]], tags:['realestate'], syn:{with:'build', b:.06, txt:'entretien et rénovation moins chers grâce à votre société de construction'}};
D.biz.shipping={n:'Compagnie de transport maritime', sub:'Fret et logistique internationale', cat:'ind', tier:4, cost:6000000, launch:40, payback:280, c:.55, risk:.14, econ:1.2, rate:.8, open:'always', wkf:.95, rep:.4, el:1.0,
  roles:[['ouvrier',40,50],['ing',6,130],['cadre',6,95],['manager',3,150]], tags:['industry'], syn:{with:'warehouse', b:.07, txt:'entrepôts pour les escales et le stockage'}};
Object.assign(D.BIZSEC,{warehouse:'industrie', dealer:'commerce', office:'immo', shipping:'industrie'});
D.bizOrder = Object.keys(D.biz).sort((a,b)=>D.biz[a].tier-D.biz[b].tier || D.biz[a].cost-D.biz[b].cost);

/* ---------- Villes secondaires : trois quartiers, débloquées par l'achat de la ville principale du pays ---------- */
Object.assign(D.CITIES,{
  toulouse:{n:'Toulouse', country:'France', parent:'paris', ccy:'EUR', idx:{rent:3,wage:4,tax:5,crime:2,tour:3,buy:3},
    wageM:.93, taxM:1, buyM:.9, satR:.92, cs:{tech:1.1,industrie:1.08,bureaux:1.04}, risk:{strike:1, audit:1},
    txt:'Capitale de l’aéronautique et du spatial : ingénieurs, start-ups et étudiants, peu de touristes. Charges françaises.',
    d:[
      {id:'capitole', n:'Capitole et Carmes', p:5000, crime:2, fav:['commerce','restauration','luxe','hotel'], cl:'Touristes, commerces, résidents aisés'},
      {id:'cyprien', n:'Saint-Cyprien', p:4000, crime:2, fav:['restauration','loisirs','commerce','online'], cl:'Étudiants, jeunes'},
      {id:'aero', n:'Blagnac et Aerospace Valley', p:3300, crime:1, fav:['tech','industrie','bureaux','immo'], cl:'Ingénieurs, aéronautique'}
    ]},
  marseille:{n:'Marseille', country:'France', parent:'paris', ccy:'EUR', idx:{rent:2,wage:4,tax:5,crime:4,tour:4,buy:2},
    wageM:.9, taxM:1, buyM:.82, satR:.93, cs:{hotel:1.05,loisirs:1.06,restauration:1.04,luxe:.96}, risk:{strike:1.6, audit:1},
    txt:'Port, soleil et croisières. Criminalité plus forte dans certains quartiers, grèves portuaires fréquentes.',
    d:[
      {id:'vieuxport', n:'Vieux-Port et Panier', p:4900, crime:4, fav:['restauration','hotel','commerce','loisirs'], cl:'Touristes, croisiéristes'},
      {id:'euromed', n:'Euroméditerranée (Joliette)', p:3900, crime:3, fav:['bureaux','tech','immo','media'], cl:'Sociétés, cadres'},
      {id:'prado', n:'Prado et Castellane', p:4200, crime:2, fav:['commerce','restauration','luxe','loisirs'], cl:'Familles aisées, commerces'}
    ]},
  newyork:{n:'New York', country:'États-Unis', parent:'miami', ccy:'USD', areaK:2.4, idx:{rent:5,wage:5,tax:3,crime:3,tour:5,buy:5},
    wageM:1.2, taxM:.85, buyM:1.3, satR:.94, cs:{luxe:1.18,bureaux:1.12,media:1.12,hotel:1.1,restauration:1.08}, risk:{strike:.5, audit:1},
    txt:'Capitale mondiale de la finance, des médias et du luxe. Loyers et salaires parmi les plus élevés, clientèle très solvable.',
    d:[
      {id:'midtown', n:'Midtown Manhattan', p:18000, crime:3, fav:['bureaux','luxe','hotel','media','restauration'], cl:'Cadres, touristes, luxe'},
      {id:'fidi', n:'Financial District', p:15000, crime:2, fav:['bureaux','immo','tech','restauration'], cl:'Banquiers, traders'},
      {id:'brooklyn', n:'Williamsburg (Brooklyn)', p:9500, crime:3, fav:['restauration','loisirs','media','commerce','online'], cl:'Créatifs, jeunes actifs'}
    ]},
  losangeles:{n:'Los Angeles', country:'États-Unis', parent:'miami', ccy:'USD', areaK:1.8, idx:{rent:4,wage:4,tax:3,crime:4,tour:4,buy:5},
    wageM:1.05, taxM:.85, buyM:1.2, satR:.93, cs:{media:1.2,luxe:1.1,loisirs:1.1}, risk:{strike:.4, quake:.6, audit:1},
    txt:'Cinéma, médias et loisirs. Voiture indispensable, séismes possibles, criminalité inégale selon les quartiers.',
    d:[
      {id:'beverly', n:'Beverly Hills', p:12000, crime:1, fav:['luxe','commerce','restauration','hotel'], cl:'Très aisés, célébrités'},
      {id:'hollywood', n:'Hollywood', p:7500, crime:4, fav:['media','loisirs','restauration','hotel'], cl:'Touristes, industrie du cinéma'},
      {id:'dtla', n:'Downtown Los Angeles', p:6000, crime:4, fav:['bureaux','commerce','tech','restauration'], cl:'Employés, bureaux'}
    ]},
  shanghai:{n:'Shanghai', country:'Chine', parent:'pekin', ccy:'CNY', areaK:2, idx:{rent:5,wage:2,tax:3,crime:1,tour:3,buy:4},
    wageM:.6, taxM:1, buyM:1.05, satR:.96, cs:{commerce:1.12,online:1.18,bureaux:1.1,luxe:1.08,tech:1.1}, risk:{strike:.2, audit:2.2}, techCost:1.1,
    txt:'Capitale économique et financière : commerce, import-export et luxe. Marché immense, contrôles administratifs et plafond de capitaux.',
    d:[
      {id:'lujiazui', n:'Lujiazui (Pudong)', p:110000, crime:1, fav:['bureaux','immo','tech','hotel','luxe'], cl:'Banques, multinationales'},
      {id:'xintiandi', n:'Xintiandi et ancienne concession', p:95000, crime:1, fav:['luxe','restauration','commerce','loisirs','hotel'], cl:'Expatriés, jeunes aisés'},
      {id:'zhangjiang', n:'Zhangjiang', p:60000, crime:1, fav:['tech','industrie','media','online'], cl:'Ingénieurs, biotech, start-ups'}
    ]},
  shenzhen:{n:'Shenzhen', country:'Chine', parent:'pekin', ccy:'CNY', areaK:1.3, idx:{rent:4,wage:3,tax:3,crime:1,tour:2,buy:4},
    wageM:.6, taxM:1, buyM:1, satR:.96, cs:{tech:1.25,industrie:1.15,online:1.15}, risk:{strike:.2, audit:2.3, techreg:1}, techRisk:1.4, techCost:1.2,
    txt:'Silicon Valley du matériel : électronique, usines et start-ups. L’innovation va vite, donc coûte cher et prend des risques.',
    d:[
      {id:'nanshan', n:'Nanshan', p:110000, crime:1, fav:['tech','industrie','bureaux','media','restauration'], cl:'Ingénieurs, géants du numérique'},
      {id:'futian', n:'Futian (CBD)', p:105000, crime:1, fav:['bureaux','immo','restauration','luxe','hotel'], cl:'Cadres, finance'},
      {id:'huaqiangbei', n:'Huaqiangbei', p:80000, crime:2, fav:['industrie','commerce','online','tech'], cl:'Marchands, fabricants d’électronique'}
    ]},
  split:{n:'Split', country:'Croatie', parent:'zagreb', ccy:'EUR', idx:{rent:2,wage:1,tax:2,crime:1,tour:5,buy:2},
    wageM:.45, taxM:.8, buyM:.7, satR:.90, cs:{hotel:1.15,restauration:1.1,loisirs:1.12}, risk:{strike:.4, audit:1},
    txt:'Station balnéaire : l’été fait toute la marge, l’hiver est très calme. Prix et salaires bas.',
    d:[
      {id:'palace', n:'Palais de Dioclétien (vieille ville)', p:5500, crime:2, fav:['hotel','restauration','commerce','luxe'], cl:'Touristes, croisiéristes'},
      {id:'bacvice', n:'Bačvice et front de mer', p:4200, crime:1, fav:['loisirs','restauration','hotel'], cl:'Estivants, fêtards'},
      {id:'znjan', n:'Žnjan et Firule', p:3300, crime:1, fav:['commerce','loisirs','immo','restauration'], cl:'Résidents, familles'}
    ]},
  dubrovnik:{n:'Dubrovnik', country:'Croatie', parent:'zagreb', ccy:'EUR', idx:{rent:3,wage:1,tax:2,crime:1,tour:5,buy:3},
    wageM:.5, taxM:.8, buyM:.78, satR:.90, cs:{hotel:1.18,luxe:1.08,restauration:1.12}, risk:{strike:.3, quake:.8, audit:1},
    txt:'Perle de l’Adriatique : croisières et tourisme de luxe, très saisonnier, centre historique saturé.',
    d:[
      {id:'oldtown', n:'Vieille ville', p:8000, crime:1, fav:['restauration','hotel','luxe','commerce'], cl:'Touristes, croisiéristes'},
      {id:'lapad', n:'Lapad', p:5200, crime:1, fav:['hotel','loisirs','restauration'], cl:'Familles en vacances'},
      {id:'gruz', n:'Gruž (port)', p:3600, crime:1, fav:['commerce','industrie','bureaux','restauration'], cl:'Résidents, marins, négoce'}
    ]},
  madrid:{n:'Madrid', country:'Espagne', parent:'barcelone', ccy:'EUR', areaK:1.7, idx:{rent:4,wage:3,tax:3,crime:2,tour:4,buy:4},
    wageM:.78, taxM:.9, buyM:.98, satR:.92, cs:{bureaux:1.1,luxe:1.06,commerce:1.05}, risk:{strike:1, demo:.8, audit:1},
    txt:'Capitale politique et financière : sièges sociaux, commerces, vie nocturne. Fiscalité plus légère qu’en France.',
    d:[
      {id:'salamanca', n:'Salamanca', p:9500, crime:1, fav:['luxe','commerce','restauration','hotel'], cl:'Aisés, touristes'},
      {id:'centro', n:'Sol et Centro', p:7500, crime:3, fav:['restauration','commerce','hotel','loisirs'], cl:'Touristes, fêtards'},
      {id:'azca', n:'AZCA et Cuatro Torres', p:6500, crime:1, fav:['bureaux','tech','immo','restauration'], cl:'Cadres, sièges sociaux'}
    ]},
  seville:{n:'Séville', country:'Espagne', parent:'barcelone', ccy:'EUR', idx:{rent:2,wage:2,tax:3,crime:2,tour:4,buy:2},
    wageM:.62, taxM:.92, buyM:.78, satR:.91, cs:{hotel:1.1,restauration:1.1,loisirs:1.08}, risk:{strike:.8, audit:1},
    txt:'Tourisme culturel et grandes fêtes ; chaleur écrasante l’été. Coûts bas, saison forte au printemps.',
    d:[
      {id:'santacruz', n:'Santa Cruz', p:4600, crime:2, fav:['hotel','restauration','commerce','luxe'], cl:'Touristes'},
      {id:'triana', n:'Triana', p:3600, crime:2, fav:['restauration','loisirs','commerce','media'], cl:'Habitants, artistes, touristes'},
      {id:'nervion', n:'Nervión', p:3300, crime:1, fav:['commerce','bureaux','loisirs','restauration'], cl:'Familles, centres commerciaux'}
    ]},
  saopaulo:{n:'São Paulo', country:'Brésil', parent:'rio', ccy:'BRL', areaK:2, idx:{rent:3,wage:2,tax:5,crime:4,tour:2,buy:3},
    wageM:.5, taxM:1.35, buyM:.85, satR:.93, cs:{bureaux:1.12,luxe:1.08,commerce:1.05}, risk:{strike:1, audit:1.5},
    txt:'Poumon économique du Brésil : finance et affaires, circulation infernale, fiscalité très lourde et criminalité marquée.',
    d:[
      {id:'jardins', n:'Jardins', p:17000, crime:3, fav:['luxe','restauration','commerce','hotel'], cl:'Très aisés, touristes d’affaires'},
      {id:'itaim', n:'Itaim Bibi et Faria Lima', p:18000, crime:3, fav:['bureaux','tech','immo','restauration','luxe'], cl:'Finance, cadres'},
      {id:'pinheiros', n:'Pinheiros et Vila Madalena', p:14000, crime:3, fav:['media','restauration','loisirs','online','tech'], cl:'Créatifs, start-ups'}
    ]},
  salvador:{n:'Salvador', country:'Brésil', parent:'rio', ccy:'BRL', idx:{rent:2,wage:1,tax:4,crime:4,tour:4,buy:2},
    wageM:.4, taxM:1.25, buyM:.7, satR:.92, cs:{loisirs:1.12,hotel:1.1,restauration:1.08}, risk:{strike:.6, audit:1.2},
    txt:'Culture afro-brésilienne, musique et plages ; le Carnaval y est l’un des plus longs du monde. Salaires très bas, pouvoir d’achat limité.',
    d:[
      {id:'pelourinho', n:'Pelourinho', p:6000, crime:4, fav:['restauration','hotel','loisirs','commerce','media'], cl:'Touristes, musiciens'},
      {id:'barra2', n:'Barra', p:8500, crime:3, fav:['hotel','loisirs','restauration','commerce'], cl:'Touristes, plage'},
      {id:'pituba', n:'Pituba', p:7500, crime:3, fav:['commerce','bureaux','restauration','immo'], cl:'Classes moyennes, commerces'}
    ]}
});
D.CITY_ORDER = ['paris','toulouse','marseille','zagreb','split','dubrovnik','barcelone','madrid','seville','miami','newyork','losangeles','rio','saopaulo','salvador','pekin','shanghai','shenzhen'];

/* Fêtes des villes secondaires */
{ const tour={hotel:1.5,restauration:1.4,loisirs:1.4,luxe:1.1,commerce:1.1};
  const printemps={commerce:.4,restauration:.45,bureaux:.3,industrie:.25,tech:.5,media:.5,immo:.4,hotel:.85,loisirs:.7,luxe:.5,online:.9,agri:.5};
  const fp=[[-12,12,{commerce:1.45,luxe:1.3,restauration:1.2,online:1.5}],[0,7,printemps],[7,8,{restauration:.9,commerce:.9,bureaux:.7,industrie:.6}]];
  D.FEST.push(
  {id:'rentree', city:'toulouse', n:'Rentrée étudiante', m:9, d:5, ph:[[0,15,{restauration:1.3,loisirs:1.35,commerce:1.15,online:1.2}]]},
  {id:'toulnoel', city:'toulouse', n:'Noël et marchés de fin d’année', m:12, d:5, ph:[[0,25,{commerce:1.3,restauration:1.15,luxe:1.2}]]},
  {id:'ete_mars', city:'marseille', n:'Été sur le Vieux-Port', m:7, d:1, ph:[[0,50,{hotel:1.4,restauration:1.3,loisirs:1.35,commerce:1.1}]]},
  {id:'fiesta', city:'marseille', n:'Fiesta des Suds', m:10, d:15, ph:[[0,5,{loisirs:1.45,restauration:1.3,hotel:1.2,media:1.15}]]},
  {id:'marathon_ny', city:'newyork', n:'Marathon de New York', m:11, d:3, ph:[[0,3,{hotel:1.5,restauration:1.35,loisirs:1.2,commerce:1.15}]]},
  {id:'noel_ny', city:'newyork', n:'Noël à Manhattan', m:12, d:5, ph:[[0,25,{commerce:1.4,luxe:1.4,hotel:1.35,restauration:1.25}]]},
  {id:'oscars', city:'losangeles', n:'Cérémonie des Oscars', m:3, d:10, ph:[[0,5,{luxe:1.6,hotel:1.5,media:1.5,restauration:1.3}]]},
  {id:'rose', city:'losangeles', n:'Rose Parade et Nouvel An', m:1, d:1, ph:[[0,4,{hotel:1.4,loisirs:1.35,restauration:1.25}]]},
  {id:'printemps_sh', city:'shanghai', n:'Fête du Printemps', m:1, d:21, mob:14, ph:fp},
  {id:'ciie', city:'shanghai', n:'Salon international des importations', m:11, d:5, ph:[[0,8,{bureaux:1.3,hotel:1.5,commerce:1.3,luxe:1.2,restauration:1.25}]]},
  {id:'printemps_sz', city:'shenzhen', n:'Fête du Printemps', m:1, d:21, mob:14, ph:fp},
  {id:'chtf', city:'shenzhen', n:'Salon des hautes technologies', m:11, d:16, ph:[[0,6,{tech:1.5,industrie:1.3,hotel:1.4,bureaux:1.2,online:1.2}]]},
  {id:'ultraeu', city:'split', n:'Ultra Europe', m:7, d:10, ph:[[0,5,{hotel:1.6,restauration:1.4,loisirs:1.6,luxe:1.15}]]},
  {id:'ete_split', city:'split', n:'Saison estivale', m:7, d:1, ph:[[0,60,{hotel:1.4,restauration:1.3,loisirs:1.3,commerce:1.1}]]},
  {id:'festdub', city:'dubrovnik', n:'Festival d’été de Dubrovnik', m:7, d:10, ph:[[0,45,{hotel:1.4,restauration:1.35,luxe:1.25,loisirs:1.3}]]},
  {id:'blaise', city:'dubrovnik', n:'Fête de Saint-Blaise', m:2, d:3, ph:[[0,4,{restauration:1.25,commerce:1.2,hotel:1.15}]]},
  {id:'isidro', city:'madrid', n:'San Isidro', m:5, d:15, ph:[[0,8,{restauration:1.35,loisirs:1.4,hotel:1.3,commerce:1.1}]]},
  {id:'pride_mad', city:'madrid', n:'Fierté de Madrid', m:7, d:1, ph:[[0,10,{hotel:1.45,restauration:1.4,loisirs:1.5,luxe:1.1}]]},
  {id:'semana', city:'seville', n:'Semana Santa', m:3, d:28, mob:14, ph:[[0,8,{hotel:1.7,restauration:1.45,commerce:1.1,bureaux:.7,industrie:.7}]]},
  {id:'feria', city:'seville', n:'Feria de Abril', m:4, d:20, mob:10, ph:[[0,7,{hotel:1.5,restauration:1.5,loisirs:1.55,luxe:1.15}]]},
  {id:'carn_sp', city:'saopaulo', n:'Carnaval', m:2, d:13, mob:12, ph:[[0,5,{hotel:1.3,restauration:1.25,loisirs:1.35,bureaux:.7,industrie:.7}]]},
  {id:'f1_sp', city:'saopaulo', n:'Grand Prix de F1 du Brésil', m:11, d:4, ph:[[0,4,{hotel:1.6,luxe:1.35,restauration:1.3,loisirs:1.2}],[0,4,{}]]},
  {id:'carn_sa', city:'salvador', n:'Carnaval de Salvador', m:2, d:13, mob:12, ph:[[0,8,{hotel:1.7,restauration:1.5,loisirs:1.7,commerce:1.12,bureaux:.6,industrie:.6},2.2]]},
  {id:'yemanja', city:'salvador', n:'Fête de Yemanjá', m:2, d:2, ph:[[0,3,{loisirs:1.3,restauration:1.25,hotel:1.15}]]}
  );
}
/* Les rivaux s'implantent aussi dans les villes secondaires de leurs pays */
D.RIVALS.forEach(r=>{ const add=[]; r.city.forEach(c=>D.CITY_ORDER.forEach(id=>{ if(D.CITIES[id].parent===c&&!r.city.includes(id)) add.push(id); })); r.city=r.city.concat(add); });

D.CITIES.zagreb.areaK=.5; D.CITIES.rio.areaK=1.5;
/* ---------- Achat de villes ---------- */
const CPOL=[['Modérés',.8,1.08],['Marché',1,1],['Élevés',1.25,.88]];
function cityPriceLocal(id){ const C=D.CITIES[id], A=(C.parent?150000:300000)*(C.areaK||1); return C.d.reduce((a,dd)=>a+dd.p*A,0); }
const cityPriceEur = id => cityPriceLocal(id)*fxOf(D.CITIES[id].ccy);
const cityOwned = id => !!(S.cities&&S.cities[id]&&S.cities[id].own);
function cityValue(id){ const o=S.cities&&S.cities[id]; return o&&o.own? o.cost*S.macro.house/o.h0 : 0; }
const cityValueNW = id => (S.country&&S.country.cities&&S.country.cities.includes(id))? 0 : cityValue(id);
function cityTenants(id){
  const R=rivInit(), out=[];
  D.RIVALS.forEach(r=>{ let w=0; Object.keys(R.rv[r.id].pres).forEach(k=>{ if(k.indexOf(id+'|')===0) w+=R.rv[r.id].pres[k]*R.rv[r.id].pow; }); if(w>0) out.push({r,w}); });
  return out.sort((a,b)=>b.w-a.w);
}
function cityOcc(id){
  const o=S.cities[id], pres=cityTenants(id).reduce((a,x)=>a+x.w,0), econ=clamp(Math.pow(S.macro.econ,.6),.8,1.1);
  return clamp((.55+.1*pres)*econ*CPOL[o.pol===undefined?1:o.pol][2],.4,.97);
}
function cityIncome(id){ const o=S.cities[id]; return cityValue(id)*0.035/360*CPOL[o.pol===undefined?1:o.pol][1]*cityOcc(id)/.8; }
const cityUpkeep = id => cityValue(id)*0.005/360;
function buyCity(id){
  const C=D.CITIES[id]; if(!C) return err('Ville inconnue.');
  if(cityOwned(id)) return err('Vous possédez déjà cette ville.');
  if(!cityUnlocked(id)) return err(C.parent? 'Achetez d’abord '+D.CITIES[C.parent].n+' pour débloquer cette ville.' : 'Ville verrouillée : valeur nette de '+eur(C.unlock,0)+' requise.');
  const p=cityPriceEur(id); if(availFor(C.ccy)<p) return err('Trésorerie insuffisante : '+eur(p,0)+' requis.');
  payCap('c:'+id,'Achat de la ville : '+C.n,-p); settleAccounts();
  if(!S.cities) S.cities={};
  S.cities[id]={own:true,cost:p,h0:S.macro.house,pol:1,since:S.day};
  const kids=D.CITY_ORDER.filter(k=>D.CITIES[k].parent===id);
  log('good','Vous possédez désormais tous les bâtiments de '+C.n+' ('+eur(p,0)+'). Vos activités n’y paient plus de loyer ; des locataires IA occupent le reste.'+(kids.length? ' Nouvelles villes accessibles : '+kids.map(k=>D.CITIES[k].n).join(', ')+'.' : ''));
  return ok();
}
function sellCity(id){
  if(!cityOwned(id)) return err('Vous ne possédez pas cette ville.');
  if(S.country&&S.country.cities&&S.country.cities.includes(id)) return err('Cédez d’abord le pays dont elle fait partie.');
  const p=cityValue(id)*0.92; payCap('c:'+id,'Cession de la ville : '+D.CITIES[id].n,p); delete S.cities[id];
  log('info','Vous cédez '+D.CITIES[id].n+' pour '+eur(p,0)+'.'); return ok();
}
function setCityPol(id,v){ if(!cityOwned(id)) return err('Ville non possédée.'); S.cities[id].pol=clamp(v|0,0,2); return ok(); }
function empireStep(){
  if(!S.cities) return;
  Object.keys(S.cities).forEach(id=>{ if(!cityOwned(id)) return;
    pay('c:'+id,'Loyers de '+D.CITIES[id].n,cityIncome(id),'cap'); pay('c:'+id,'Entretien de '+D.CITIES[id].n,-cityUpkeep(id)); });
}
function empireNW(){ let t=0; if(S.cities) Object.keys(S.cities).forEach(id=>{ t+=cityValueNW(id); }); return t; }

/* ---------- Pays : trois villes possédées, puis achat ---------- */
D.COUNTRIES=[
  {id:'france', n:'France', main:'paris', pop:'68 millions d’habitants'},
{id:'croatie', n:'Croatie', main:'zagreb', pop:'3,9 millions d’habitants'},
  {id:'espagne', n:'Espagne', main:'barcelone', pop:'48 millions d’habitants'},
  {id:'usa', n:'États-Unis', main:'miami', pop:'335 millions d’habitants'},
  {id:'bresil', n:'Brésil', main:'rio', pop:'216 millions d’habitants'},
  {id:'chine', n:'Chine', main:'pekin', pop:'1,4 milliard d’habitants'}
].map(c=>{ c.cities=[c.main].concat(D.CITY_ORDER.filter(k=>D.CITIES[k].parent===c.main)); c.tier=6;
  c.price=Math.round(c.cities.reduce((a,k)=>a+cityPriceLocal(k)*D.CCY[D.CITIES[k].ccy].eur,0)*8/1e9)*1e9; c.gdp=c.price*.45; return c; });

