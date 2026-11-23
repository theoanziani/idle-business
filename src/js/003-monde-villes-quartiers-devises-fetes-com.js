/* ============================================================
   MONDE : villes, quartiers, devises, fêtes, comptes en devises, rapport
   ============================================================ */

/* ---------- Devises ---------- */
D.CCY = {
  EUR:{n:'Euro', sym:'€', eur:1, vol:0, fee:0},
  USD:{n:'Dollar américain', sym:'$', eur:.87, vol:.0035, fee:.004},
  CNY:{n:'Yuan', sym:'¥', eur:.12, vol:.0018, fee:.008},
  BRL:{n:'Real brésilien', sym:'R$', eur:.16, vol:.009, fee:.015}
};
D.FOREIGN = ['USD','CNY','BRL'];

/* ---------- Secteurs : rw = poids de l'emplacement dans le loyer, as = sensibilité au quartier,
   th = exposition aux vols, rs = part du loyer dans le chiffre d'affaires, lw = part de clientèle locale ---------- */
D.SECT = {
  restauration:{n:'Restauration', rw:1,   as:1,   th:.8,  rs:.09, lw:1},
  commerce:    {n:'Commerce',     rw:1,   as:1,   th:1.2, rs:.09, lw:1},
  hotel:       {n:'Hôtellerie',   rw:1,   as:1,   th:.8,  rs:.08, lw:.6},
  loisirs:     {n:'Loisirs',      rw:.9,  as:1,   th:.6,  rs:.07, lw:.8},
  luxe:        {n:'Luxe',         rw:1,   as:1,   th:2.4, rs:.10, lw:.5},
  media:       {n:'Médias et contenus', rw:.7, as:.6, th:.5, rs:.05, lw:.5},
  tech:        {n:'Technologies', rw:.7,  as:.7,  th:.7,  rs:.04, lw:.15},
  bureaux:     {n:'Services et bureaux', rw:.7, as:.7, th:.3, rs:.05, lw:.7},
  immo:        {n:'Immobilier',   rw:.7,  as:.7,  th:.3,  rs:.05, lw:.8},
  online:      {n:'Commerce en ligne', rw:.4, as:.4, th:.5, rs:.03, lw:.3},
  industrie:   {n:'Industrie',    rw:.35, as:.2,  th:.7,  rs:.03, lw:.1},
  agri:        {n:'Agroalimentaire', rw:.35, as:.2, th:.4, rs:.03, lw:.3}
};
D.BIZSEC = {repair:'commerce', ecom:'online', agency:'immo', staffing:'bureaux', resto:'restauration', farm:'agri', cyber:'tech', build:'immo', fastfood:'restauration',
  textile:'industrie', saas:'tech', electronics:'industrie', super:'commerce', studio:'media', ai:'tech', promo:'immo', gallery:'luxe', phones:'industrie',
  couture:'luxe', renew:'industrie', dc:'tech', park:'loisirs', hotel:'hotel'};
const bizSec = defId => D.BIZSEC[defId] || 'commerce';

/* ---------- Villes et quartiers (prix en monnaie locale par m², indice de criminalité 1 à 5) ---------- */
D.CITIES = {
  paris:{n:'Paris', country:'France', ccy:'EUR', unlock:0, idx:{rent:5,wage:5,tax:5,crime:3,tour:4,buy:4},
    wageM:1, taxM:1, buyM:1, satR:.93, cs:{luxe:1.08,hotel:1.04}, risk:{strike:2, audit:1},
    txt:'Aucun secteur ne domine : tourisme, commerces, luxe et bureaux marchent tous. Charges et impôts élevés, grèves fréquentes.',
    d:[
      {id:'champs', n:'Champs-Élysées', p:13100, crime:3, fav:['luxe','hotel','restauration','commerce'], cl:'Touristes, luxe, bureaux'},
      {id:'marais', n:'Marais', p:12700, crime:3, fav:['commerce','restauration','luxe','loisirs'], cl:'Touristes, jeunes actifs'},
      {id:'defense', n:'La Défense', p:7000, crime:2, fav:['bureaux','tech','restauration','commerce','immo'], cl:'Cadres, employés de bureau'},
      {id:'montmartre', n:'Montmartre', p:9100, crime:4, fav:['restauration','loisirs','commerce','media'], cl:'Touristes, artistes'},
      {id:'belleville', n:'Belleville', p:8400, crime:3, fav:['restauration','loisirs','commerce','industrie','online'], cl:'Jeunes, étudiants, mixte'}
    ]},
  zagreb:{n:'Zagreb', country:'Croatie', ccy:'EUR', unlock:0, idx:{rent:1,wage:1,tax:2,crime:1,tour:3,buy:2},
    wageM:.45, taxM:.8, buyM:.72, satR:.90, cs:{hotel:.97,restauration:.97,loisirs:.97}, risk:{strike:.5, quake:1, audit:1},
    txt:'Le tourisme fait la marge, surtout pendant l’Avent. Loyers et salaires bas, très peu de criminalité, marché étroit, risque de séisme.',
    d:[
      {id:'gornji', n:'Gornji grad (ville haute)', p:5000, crime:1, fav:['restauration','hotel','luxe','media'], cl:'Touristes, institutions'},
      {id:'donji', n:'Donji grad (ville basse)', p:4657, crime:1, fav:['commerce','hotel','restauration','bureaux','immo'], cl:'Touristes, bureaux, commerces'},
      {id:'tresnjevka', n:'Trešnjevka', p:3600, crime:1, fav:['restauration','loisirs','commerce','online'], cl:'Étudiants, jeunes, résidents'},
      {id:'novi', n:'Novi Zagreb', p:3100, crime:1, fav:['commerce','industrie','bureaux','tech'], cl:'Familles, centres commerciaux'},
      {id:'jarun', n:'Jarun', p:3700, crime:1, fav:['loisirs','restauration','hotel'], cl:'Sportifs, fêtards'}
    ]},
  barcelone:{n:'Barcelone', country:'Espagne', ccy:'EUR', unlock:0, idx:{rent:3,wage:2,tax:3,crime:3,tour:5,buy:3},
    wageM:.7, taxM:.95, buyM:.88, satR:.92, cs:{hotel:1.12,restauration:1.1,loisirs:1.12,tech:1.08,commerce:1.04}, risk:{strike:1.2, demo:1, audit:1},
    txt:'Tourisme de masse et pôle technologique. Vols à la tire dans les quartiers touristiques, manifestations.',
    d:[
      {id:'eixample', n:'Eixample', p:6648, crime:2, fav:['commerce','restauration','bureaux','luxe'], cl:'Cadres, touristes, commerces'},
      {id:'gracia', n:'Gràcia', p:5654, crime:2, fav:['restauration','loisirs','commerce','media','online'], cl:'Jeunes, créatifs'},
      {id:'born', n:'El Born et quartier gothique', p:4850, crime:4, fav:['restauration','hotel','commerce','loisirs'], cl:'Touristes'},
      {id:'poblenou', n:'Poblenou', p:5390, crime:2, fav:['tech','bureaux','media','restauration'], cl:'Technologies, start-ups'},
      {id:'barceloneta', n:'Barceloneta', p:5500, crime:4, fav:['restauration','loisirs','hotel'], cl:'Touristes, plage'}
    ]},
  miami:{n:'Miami', country:'États-Unis', ccy:'USD', unlock:500000, idx:{rent:4,wage:4,tax:1,crime:3,tour:5,buy:5},
    wageM:.98, taxM:.72, buyM:1.15, satR:.93, cs:{luxe:1.14,hotel:1.12,restauration:1.05,tech:1.05,loisirs:1.08}, risk:{strike:.4, hurr:1, audit:1},
    txt:'Fiscalité légère, luxe et crypto, haute saison l’hiver. Assurance indispensable : ouragans de juin à novembre.',
    d:[
      {id:'southbeach', n:'South Beach', p:6850, crime:3, fav:['hotel','loisirs','restauration','luxe'], cl:'Touristes, fêtards, luxe'},
      {id:'brickell', n:'Brickell', p:9000, crime:3, fav:['bureaux','tech','restauration','luxe','immo'], cl:'Finance, jeunes cadres'},
      {id:'wynwood', n:'Wynwood', p:7000, crime:3, fav:['media','loisirs','restauration','commerce','luxe'], cl:'Artistes, touristes'},
      {id:'coral', n:'Coral Gables', p:5500, crime:2, fav:['restauration','commerce','bureaux'], cl:'Résidents aisés, universitaires'},
      {id:'littlehavana', n:'Little Havana', p:4000, crime:4, fav:['restauration','commerce','loisirs'], cl:'Communauté cubaine, touristes'}
    ]},
  rio:{n:'Rio de Janeiro', country:'Brésil', ccy:'BRL', unlock:2000000, idx:{rent:2,wage:1,tax:4,crime:5,tour:4,buy:2},
    wageM:.42, taxM:1.3, buyM:.78, satR:.93, cs:{hotel:1.12,loisirs:1.14,restauration:1.08,luxe:1.04}, risk:{strike:.6, audit:1.2},
    txt:'Plages, Carnaval et grand luxe, mais la criminalité est la plus élevée du jeu : sans sécurité, un commerce de luxe se fait voler.',
    d:[
      {id:'ipanema', n:'Ipanema et Leblon', p:27900, crime:4, fav:['luxe','hotel','restauration','commerce'], cl:'Très aisés, touristes'},
      {id:'copa', n:'Copacabana', p:13811, crime:5, fav:['hotel','restauration','loisirs','commerce'], cl:'Touristes, résidents'},
      {id:'barra', n:'Barra da Tijuca', p:14561, crime:3, fav:['commerce','bureaux','loisirs','immo','online'], cl:'Familles aisées, centres commerciaux'},
      {id:'lapa', n:'Lapa', p:9000, crime:5, fav:['loisirs','restauration','media'], cl:'Fêtards, étudiants'},
      {id:'centro', n:'Centre', p:7500, crime:4, fav:['bureaux','commerce','restauration','immo'], cl:'Employés, bureaux'}
    ]},
  pekin:{n:'Pékin', country:'Chine', ccy:'CNY', unlock:10000000, idx:{rent:4,wage:2,tax:3,crime:1,tour:3,buy:4},
    wageM:.55, taxM:1, buyM:1, satR:.96, cs:{tech:1.22,industrie:1.1,online:1.15,luxe:1.05,bureaux:1.05}, risk:{strike:.2, audit:2.5, techreg:1}, techRisk:1.5, techCost:1.25,
    txt:'Les dernières innovations y sont recherchées, donc plus chères et plus risquées. Peu de criminalité, mais licences, contrôles et plafond annuel de capitaux.',
    d:[
      {id:'zhong', n:'Zhongguancun', p:100000, crime:1, fav:['tech','industrie','media','online'], cl:'Ingénieurs, start-ups, universités'},
      {id:'cbd', n:'CBD de Chaoyang', p:85000, crime:1, fav:['bureaux','luxe','restauration','hotel','immo'], cl:'Multinationales, cadres'},
      {id:'sanlitun', n:'Sanlitun', p:90000, crime:1, fav:['commerce','loisirs','restauration','luxe','media'], cl:'Expatriés, jeunes, vie nocturne'},
      {id:'wang', n:'Wangfujing', p:100000, crime:1, fav:['commerce','hotel','restauration'], cl:'Touristes, grands magasins'},
      {id:'fin', n:'Financial Street', p:110000, crime:1, fav:['bureaux','immo','tech'], cl:'Banques, assurances'}
    ]}
};
D.CITY_ORDER = ['paris','zagreb','barcelone','miami','rio','pekin'];
const cityOf = b => D.CITIES[b.city] || D.CITIES.paris;
const distOf = b => { const C=cityOf(b); return C.d.find(x=>x.id===b.dist) || C.d[C.d.length-1]; };
const cityUnlocked = id => { const C=D.CITIES[id]; return C.parent? !!(S.cities&&S.cities[C.parent]&&S.cities[C.parent].own) : S.peakNW>=C.unlock; };
const SECM = [1,.55,.3,.15], SECC = [0,.008,.016,.03];
const SECN = ['Aucune','Gardiennage','Caméras et agent','Sécurité renforcée'];

/* Indice de loyer d'un quartier (1 ≈ prix moyen d'un quartier parisien ordinaire) et facteur appliqué au loyer d'une activité */
function rentIdx(C,dd){ return clamp(Math.pow(dd.p*D.CCY[C.ccy].eur/9500,.75),.3,1.6); }
function rentFactorFor(sec,C,dd){ const rw=D.SECT[sec].rw; return 1+rw*(rentIdx(C,dd)/.95-1); }
function rentFactor(b){ return rentFactorFor(bizSec(b.def),cityOf(b),distOf(b)); }
function affBonus(dd,sec){ const i=dd.fav.indexOf(sec); return i<0? -.04 : [.16,.11,.08,.06,.05][i]; }
function affOf(sec,C,dd){ return 1+D.SECT[sec].as*affBonus(dd,sec); }
function fitLabel(sec,dd){ const i=dd.fav.indexOf(sec); return i<0?['Peu adapté','']:i===0?['Idéal','good']:i<3?['Bon choix','good']:['Correct','']; }
function bestDist(sec,C){ let best=C.d[0],bv=-9; C.d.forEach(dd=>{ const v=affBonus(dd,sec)-0.08*rentIdx(C,dd); if(v>bv){ bv=v; best=dd; } }); return best; }

/* Facteur de ventes lié à l'emplacement, à la ville et à la fête en cours */
/* Référence : un quartier moyen de Paris donne un facteur de 1 pour chaque secteur */
const LNK={};
function locNorm(sec){
  if(LNK[sec]) return LNK[sec]; const C=D.CITIES.paris, SC=D.SECT[sec];
  let t=0; C.d.forEach(dd=>{ t+=affOf(sec,C,dd)*Math.pow(rentIdx(C,dd),0.25*SC.rw); }); return LNK[sec]=C.d.length/t;
}
function locMult(b,parts){
  const C=cityOf(b), dd=distOf(b), sec=bizSec(b.def), SC=D.SECT[sec];
  const aff=affOf(sec,C,dd)*locNorm(sec), pres=Math.pow(rentIdx(C,dd),0.25*SC.rw);
  const city=(1+SC.lw*(C.buyM-1))*(C.cs[sec]||1);
  const fe=festOf(b.city).m[sec]||1;
  return parts? {aff,pres,city,fe,total:aff*pres*city*fe} : aff*pres*city*fe;
}
/* Coût de lancement : le prix du terrain pèse selon le secteur ; la technologie coûte plus cher à Pékin */
function locCostF(defId,cityId,distId){
  const C=D.CITIES[cityId]||D.CITIES.paris, dd=C.d.find(x=>x.id===distId)||C.d[C.d.length-1], sec=bizSec(defId);
  return clamp(.7+.3*rentFactorFor(sec,C,dd),.7,1.45)*(sec==='tech'&&C.techCost? C.techCost:1);
}
const insRisk = C => ({miami:2.2, rio:1.2, zagreb:1.3}[Object.keys(D.CITIES).find(k=>D.CITIES[k]===C)] || 1);

/* ---------- Fêtes et événements annuels (1 mois = 30 jours ; m = mois, d = jour) ---------- */
D.FEST = [
  {id:'fw', city:'paris', n:'Fashion Week', m:2, d:24, ph:[[0,8,{luxe:1.35,hotel:1.2,commerce:1.1,restauration:1.12}]]},
  {id:'fm', city:'paris', n:'Fête de la Musique', m:6, d:21, ph:[[0,2,{restauration:1.5,loisirs:1.45,hotel:1.1,commerce:.97},1.5]]},
  {id:'noel', city:'paris', n:'Noël et Nouvel An', m:12, d:1, ph:[[0,24,{commerce:1.22,luxe:1.25,restauration:1.15,hotel:1.08,online:1.2}],[24,7,{restauration:1.4,hotel:1.3,loisirs:1.3,commerce:.85,online:.9},1.3]]},
  {id:'advent', city:'zagreb', n:'Avent à Zagreb', m:11, d:29, ph:[[0,38,{restauration:1.5,hotel:1.45,commerce:1.3,loisirs:1.2,luxe:1.1,online:1.15}]]},
  {id:'inmusic', city:'zagreb', n:'INmusic Festival', m:6, d:26, ph:[[0,4,{loisirs:1.7,restauration:1.45,hotel:1.55,commerce:1.05},1.3]]},
  {id:'etat', city:'zagreb', n:'Fête de l’État', m:5, d:30, ph:[[0,3,{restauration:1.15,hotel:1.1,commerce:.8,bureaux:.4,industrie:.4,tech:.6,media:.8,immo:.5,online:.9}]]},
  {id:'mwc', city:'barcelone', n:'Mobile World Congress', m:2, d:27, ph:[[0,6,{hotel:1.55,restauration:1.3,tech:1.25,bureaux:1.15,luxe:1.1,commerce:1.08}]]},
  {id:'sj', city:'barcelone', n:'Sant Joan', m:6, d:23, ph:[[0,2,{restauration:1.4,loisirs:1.5,hotel:1.15,commerce:.95},1.6]]},
  {id:'merce', city:'barcelone', n:'La Mercè', m:9, d:24, ph:[[0,4,{restauration:1.3,loisirs:1.35,hotel:1.25,commerce:1.1},1.3]]},
  {id:'ultra', city:'miami', n:'Ultra et Miami Music Week', m:3, d:17, ph:[[0,10,{hotel:1.5,restauration:1.3,loisirs:1.4,luxe:1.1,commerce:1.06},1.3]]},
  {id:'f1', city:'miami', n:'Grand Prix de F1', m:5, d:3, ph:[[0,4,{luxe:1.4,hotel:1.55,restauration:1.3,loisirs:1.2}]]},
  {id:'basel', city:'miami', n:'Art Basel', m:12, d:5, ph:[[0,5,{luxe:1.65,hotel:1.5,restauration:1.3,media:1.3,loisirs:1.15,commerce:1.1},1.2]]},
  {id:'printemps', city:'pekin', n:'Fête du Printemps', m:1, d:21, mob:14, ph:[[-12,12,{commerce:1.45,luxe:1.3,restauration:1.2,online:1.5}],[0,7,{commerce:.4,restauration:.45,bureaux:.3,industrie:.25,tech:.5,media:.5,immo:.4,hotel:.85,loisirs:.7,luxe:.5,online:.9,agri:.5}],[7,8,{restauration:.9,commerce:.9,bureaux:.7,industrie:.6}]]},
  {id:'golden', city:'pekin', n:'Golden Week', m:10, d:1, ph:[[0,7,{commerce:1.35,luxe:1.3,restauration:1.3,hotel:1.4,loisirs:1.5,bureaux:.6,industrie:.6,tech:.8,media:.9,immo:.6}]]},
  {id:'d1111', city:'pekin', n:'Fête des célibataires (11.11)', m:11, d:11, ph:[[0,3,{online:2.2,commerce:1.5,tech:1.25,restauration:1.05}]]},
  {id:'carnaval', city:'rio', n:'Carnaval', m:2, d:13, mob:12, ph:[[0,7,{hotel:1.7,restauration:1.5,loisirs:1.6,luxe:1.3,commerce:1.12,bureaux:.6,industrie:.6,tech:.8,immo:.6},2.2]]},
  {id:'rockrio', city:'rio', n:'Rock in Rio', m:9, d:4, ev:[2,0], ph:[[0,10,{hotel:1.4,loisirs:1.45,restauration:1.3,commerce:1.05},1.4]]},
  {id:'reveillon', city:'rio', n:'Réveillon à Copacabana', m:12, d:30, ph:[[0,3,{hotel:1.8,restauration:1.6,loisirs:1.5,luxe:1.1},2]]}
];
function festStart(f,yr){
  let s=(f.m-1)*30+(f.d-1);
  if(f.mob) s+=((Math.imul(yr+3,2654435761)^Math.imul(f.id.length*977+f.m,40503))>>>0)%(2*f.mob+1)-f.mob;
  return ((s%360)+360)%360;
}
function festCompute(cityId,day){
  const doy=(day-1)%360, yr=Math.floor((day-1)/360), m={}, names=[]; let crime=1;
  D.FEST.forEach(f=>{
    if(f.city!==cityId) return;
    if(f.ev && (yr%f.ev[0])!==f.ev[1]) return;
    const s=festStart(f,yr), rel=((doy-s+540)%360)-180; let on=false;
    f.ph.forEach(p=>{ if(rel>=p[0]&&rel<p[0]+p[1]){ on=true; for(const k in p[2]) m[k]=(m[k]||1)*p[2][k]; if(p[3]) crime=Math.max(crime,p[3]); } });
    if(on) names.push(f.n);
  });
  return {m,names,crime};
}
function festOf(cityId){
  if(!S.festC||S.festD!==S.day){ S.festC={}; S.festD=S.day; }
  return S.festC[cityId]||(S.festC[cityId]=festCompute(cityId,S.day));
}
/* Prochaines fêtes (nombre de jours avant le début) */
function festNext(cityId){
  const doy=(S.day-1)%360, yr=Math.floor((S.day-1)/360), out=[];
  D.FEST.forEach(f=>{
    if(cityId&&f.city!==cityId) return;
    for(let k=0;k<3;k++){
      const y=yr+k; if(f.ev && (y%f.ev[0])!==f.ev[1]) continue;
      const first=f.ph[0][0], start=y*360+festStart(f,y)+first, end=y*360+festStart(f,y)+f.ph[f.ph.length-1][0]+f.ph[f.ph.length-1][1];
      const abs=S.day-1;
      if(end<=abs) continue;
      out.push({f,in:Math.max(0,start-abs),on:start<=abs,days:end-start,city:f.city});
      break;
    }
  });
  return out.sort((a,b)=>a.in-b.in);
}

/* ---------- Devises et comptes ---------- */
const fxOf = cc => cc==='EUR'? 1 : S.fx[cc];
/* V1.4.3 : tout s'affiche en euros (un montant local est converti au cours fixe) */
function money(cc,n,dec){ return eur(cc==='EUR'? n : n*fxOf(cc),dec); }
function accValue(){ let v=0; D.FOREIGN.forEach(c=>{ v+=(S.acc[c]||0)*S.fx[c]; }); return v; }
const balOf = cc => cc==='EUR'? S.cash : S.acc[cc];
function setBal(cc,v){ if(cc==='EUR') S.cash=v; else S.acc[cc]=v; }
function convFee(from,to,eurEq){ return (D.CCY[from].fee+D.CCY[to].fee)*(1+0.25*Math.log10(Math.max(1,eurEq/50000))); }
function flowOnly(src,label,amt){
  if(!amt||!isFinite(amt)) return;
  const f=S.fl[src]||(S.fl[src]={in:0,out:0}); if(amt>0) f.in+=amt; else f.out-=amt;
  rec(src,label,amt,1);
}
function cnyQuota(){
  const yr=Math.floor((S.day-1)/360); if(S.q.y!==yr){ S.q.y=yr; S.q.cny=0; }
  let loc=0; S.biz.forEach(b=>{ if(b.city==='pekin') loc+=bizValue(b); });
  const limit=250000+0.25*loc; return {limit, used:S.q.cny, left:Math.max(0,limit-S.q.cny)};
}
function convertPreview(from,to,amt){
  const eurEq=amt*fxOf(from), fee=convFee(from,to,eurEq), got=eurEq*(1-fee)/fxOf(to);
  return {eurEq, fee, feeEur:eurEq*fee, got};
}
function convertCcy(from,to,amt,opt){
  opt=opt||{};
  if(from===to) return err('Choisissez deux monnaies différentes.');
  if(!isFinite(amt)||amt<=0) return err('Montant invalide.');
  if(amt>balOf(from)+1e-6) return err('Solde insuffisant en '+D.CCY[from].n.toLowerCase()+'.');
  amt=Math.min(amt,balOf(from));
  const p=convertPreview(from,to,amt);
  if(from==='CNY'&&!opt.force){ const q=cnyQuota(); if(p.eurEq>q.left+1e-6) return err('Plafond annuel de capitaux à Pékin : il reste '+eur(q.left,0)+' rapatriables cette année. Investir sur place l’augmente.'); }
  setBal(from,balOf(from)-amt); setBal(to,balOf(to)+p.got);
  if(from==='CNY') S.q.cny+=p.eurEq;
  flowOnly('fx','Change '+from+' vers '+to+' (frais)',-p.feeEur);
  return ok('Converti : '+money(to,p.got,2)+' reçus, frais '+eur(p.feeEur,2)+'.');
}
/* Solde de fin de journée : un compte local en négatif est renfloué depuis le compte en euros ; un compte en euros négatif puise dans les devises */
/* V1.3.5 : plus de comptes en devises. Les anciens soldes sont versés une fois en euros, sans frais. */
function settleAccounts(){
  if(!S.acc) return; let v=0;
  D.FOREIGN.forEach(c=>{ const a=S.acc[c]||0; if(Math.abs(a)>1e-9){ v+=a*S.fx[c]; S.acc[c]=0; } });
  if(Math.abs(v)>.5){ S.cash+=v; log('info','Vos comptes en devises ont été regroupés dans votre trésorerie en euros ('+(v>=0?'+':'')+eur(v,0)+').'); }
}
/* V1.4.3 : plus de devises, les cours restent fixes */
function fxStep(){ D.FOREIGN.forEach(c=>{ S.fx[c]=D.CCY[c].eur; }); }
function fxStepOld(){
  D.FOREIGN.forEach(c=>{
    const m=D.CCY[c]; let r=S.fx[c];
    r*=Math.exp(m.vol*norm()+0.012*Math.log(m.eur/r));
    if(c==='BRL' && rnd()<0.0012*(S.dm||1)){ r*=0.9; log('warn','Crise de change au Brésil : le real perd 10 %.'); }
    S.fx[c]=r; const h=S.fxH[c]; h.push(Math.round(r*1e5)/1e5); if(h.length>120) h.shift();
  });
}

/* ---------- Événements propres aux villes ---------- */
function cityStep(){
  const day=S.day, doy=(day-1)%360, dm=S.dm||1;
  const act=id=>S.biz.filter(b=>b.city===id&&b.status==='active');
  const R0=b=>bizBase(b).R0;
  const hit=(b,mult,label,days)=>b.mods.push({mult,until:day+days,label});
  Object.keys(D.CITIES).forEach(id=>{
    const C=D.CITIES[id], bs=act(id); if(!bs.length) return;
    const rk=C.risk||{};
    if(rk.hurr && doy>=150 && doy<330 && rnd()<(doy>=210&&doy<300?.011:.004)*rk.hurr*dm){
      const dur=rint(2,5); let loss=0;
      bs.forEach(b=>{ b.closedUntil=Math.max(b.closedUntil,day+dur); const c=R0(b)*rint(2,5)*(b.ins?.3:1); loss+=c; pay('b:'+b.id,'Dégâts de l’ouragan',-c); });
      log('bad','Ouragan sur Miami : commerces fermés '+dur+' jours, dégâts '+eur(loss,0)+(bs.every(b=>b.ins)?' (assurés).':' (une assurance réduit la facture).'));
    }
    if(rk.quake && rnd()<.0004*rk.quake*dm){
      const dur=rint(4,8); let loss=0;
      bs.forEach(b=>{ b.closedUntil=Math.max(b.closedUntil,day+dur); const c=R0(b)*3*(b.ins?.3:1); loss+=c; pay('b:'+b.id,'Dégâts du séisme',-c); });
      log('bad','Séisme à '+C.n+' : commerces fermés '+dur+' jours, dégâts '+eur(loss,0)+'.');
    }
    if(rk.strike && rnd()<.0016*rk.strike*dm){
      bs.forEach(b=>hit(b,.88,'Grève des transports',4));
      log('warn','Grève des transports à '+C.n+' : ventes en baisse pendant 4 jours.');
    }
    if(rk.demo && rnd()<.002*rk.demo*dm){
      bs.filter(b=>['commerce','restauration','luxe'].includes(bizSec(b.def))).forEach(b=>hit(b,.9,'Manifestations',3));
      log('warn','Manifestations à '+C.n+' : le commerce du centre tourne au ralenti 3 jours.');
    }
    if(rk.techreg && rnd()<.0012*dm){
      bs.filter(b=>bizSec(b.def)==='tech').forEach(b=>hit(b,.9,'Tour de vis réglementaire',10));
      log('warn','Pékin durcit la réglementation technologique : vos activités tech perdent 10 % de ventes pendant 10 jours.');
    }
  });
}

/* ---------- Rapport de période ---------- */
let RPT=null;
function rptBegin(){ RPT={d0:S.day, d1:S.day-1, days:0, nw0:S.nw, cash0:S.cash, biz:{}, fl:{}, fest:{}}; return RPT; }
function rptBiz(b){
  const l=b.last; if(!l||!RPT) return;
  const r=RPT.biz[b.id]||(RPT.biz[b.id]={id:b.id,name:b.name,city:b.city,dist:b.dist,def:b.def,rev:0,cogs:0,wages:0,rent:0,sec:0,ins:0,mkt:0,extra:0,upkeep:0,net:0,days:0});
  ['rev','cogs','wages','rent','sec','ins','mkt','extra','upkeep','net','dfr'].forEach(k=>{ r[k]=(r[k]||0)+(l[k]||0); }); r.days++; r.name=b.name;
}
function rptDay(){
  if(!RPT) return;
  RPT.days++; RPT.d1=S.day;
  Object.keys(S.fl).forEach(k=>{ const f=RPT.fl[k]||(RPT.fl[k]={in:0,out:0}); f.in+=S.fl[k].in; f.out+=S.fl[k].out; });
  Object.keys(D.CITIES).forEach(id=>{ if(!S.biz.some(b=>b.city===id)) return; festOf(id).names.forEach(n=>{ const k=id+'|'+n; const r=RPT.fest[k]||(RPT.fest[k]={city:id,name:n,days:0}); r.days++; }); });
}
function rptAlerts(){
  const A=[], t=S.nextTax-S.day;
  if(S.cash<0) A.push({k:'bad',m:'Compte en euros à découvert : '+eur(S.cash,0)+'.'});
  if(t>=0&&t<=5) A.push({k:'warn',m:'Échéance fiscale dans '+plu(t,'jour')+' : environ '+eur(taxEstimate().total,0)+'.'});
  S.biz.forEach(b=>{
    if(b.status!=='active') return;
    if(staffFill(b)<.6) A.push({k:'warn',m:b.name+' : seulement '+Math.round(staffFill(b)*100)+' % des postes pourvus.'});
    if(avgLoy(b)<40&&headcount(b)>0) A.push({k:'warn',m:b.name+' : fidélité du personnel basse ('+Math.round(avgLoy(b))+').'});
    if(!bizCyc(b)&&b.hist.length>=10&&b.hist.slice(-10).reduce((a,x)=>a+x,0)<0) A.push({k:'bad',m:b.name+' perd de l’argent depuis 10 jours.'});
    if((b.arr||0)>=3) A.push({k:'bad',m:b.name+' : loyer impayé depuis '+b.arr+' jours, expulsion à '+EVICT_DAYS+'.'});
    if((b.fat||0)>65) A.push({k:'warn',m:b.name+' : équipe épuisée (fatigue '+Math.round(b.fat)+').'});
    const dd=distOf(b); if(dd.crime>=4&&!b.sec&&['luxe','commerce','hotel'].includes(bizSec(b.def))) A.push({k:'warn',m:b.name+' : quartier à risque ('+dd.n+') sans sécurité.'});
    if(b.city==='miami'&&!b.ins) A.push({k:'warn',m:b.name+' : pas d’assurance contre les ouragans.'});
  });
  if(S.riv){ const hold=S.riv.wars.filter(w=>w.resp==='hold').length; if(hold) A.push({k:'warn',m:hold+' guerre(s) des prix sans riposte.'}); if(S.riv.offers.length) A.push({k:'',m:S.riv.offers.length+' offre(s) de rachat en attente.'}); }
  return A.slice(0,10);
}
function rptSummary(){
  const R=RPT; if(!R) return null;
  const rows=Object.values(R.biz).map(r=>({...r,exp:r.cogs+r.wages+r.rent+r.sec+r.ins+r.mkt+r.extra+r.upkeep-(r.dfr||0)})).sort((a,b)=>Math.abs(b.net)-Math.abs(a.net));
  let rev=0,exp=0,net=0; rows.forEach(r=>{ rev+=r.rev; exp+=r.exp; net+=r.net; });
  const byCity={}; rows.forEach(r=>{ const c=byCity[r.city]||(byCity[r.city]={rev:0,net:0}); c.rev+=r.rev; c.net+=r.net; });
  const other=[]; Object.keys(R.fl).forEach(k=>{ if(k.startsWith('b:')) return; const f=R.fl[k]; other.push({k,in:f.in,out:f.out,net:f.in-f.out}); });
  other.sort((a,b)=>Math.abs(b.net)-Math.abs(a.net));
  const tax=Math.max(0,net)*S.laws.corpTax;
  return {d0:R.d0, d1:R.d1, days:R.days, nw0:R.nw0, nw1:S.nw, cash0:R.cash0, cash1:S.cash, rows, rev, exp, net, taxEst:tax, byCity, other,
    journal:S.journal.filter(x=>x.d>=R.d0-1&&x.d<=R.d1+1).slice(-40), fest:Object.values(R.fest), alerts:rptAlerts()};
}

/* ---------- Migration des anciennes parties ---------- */
function migrateState(s){
  if(!s) return s;
  s.acc=s.acc||{USD:0,CNY:0,BRL:0};
  s.fx=s.fx||{USD:D.CCY.USD.eur,CNY:D.CCY.CNY.eur,BRL:D.CCY.BRL.eur};
  s.fxH=s.fxH||{USD:[s.fx.USD],CNY:[s.fx.CNY],BRL:[s.fx.BRL]}; ['USD','CNY','BRL'].forEach(c=>{ s.fx[c]=D.CCY[c].eur; });
  s.q=s.q||{y:0,cny:0}; s.diff=s.diff||'hard'; s.dm=s.diff==='easy'?.55:1; s.sweep=!!s.sweep;
  s.citySeen=s.citySeen||{paris:1,zagreb:1,barcelone:1}; s.cities=s.cities||{}; s.bld=s.bld||{}; if(!s.tut) s.tut={off:true}; D.stocks=D.stocks.filter(x=>!x.ipo).concat(s.ipos||[]);
  if(!s.riv){ const t=S; S=s; try{ rivInit(); }finally{ S=t; } }
  (s.biz||[]).forEach(b=>{ if(!b.city){ b.city='paris'; b.dist='belleville'; } if(b.sec===undefined) b.sec=0; if(b.cs===undefined){ b.cs=65; b.fat=0; b.stk=1; } if(b.ins===undefined) b.ins=false; if(!b.cf) b.cf=1; });
  return s;
}

/* V1.4.8 : dates du jeu à la place des numéros de jour */
const DATE_ABR=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
function dateL(day){ day=Math.max(1,Math.round(+day||1)); const t=footDate(day); return (t.d===1?'1er':t.d)+' '+FOOT_MONTHS[t.m-1]+' '+t.y; }
function dateS(day){ day=Math.max(1,Math.round(+day||1)); const t=footDate(day); return (t.d===1?'1er':t.d)+' '+DATE_ABR[t.m-1]; }

