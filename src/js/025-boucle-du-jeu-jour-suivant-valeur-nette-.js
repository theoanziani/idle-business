/* ============================================================
   BOUCLE DU JEU : jour suivant, valeur nette, objectifs, sauvegarde
   ============================================================ */
function computeNW(){
  let v=S.cash+S.livret.bal-debtTotal()+accValue();
  S.biz.forEach(b=>{ v+=bizValue(b)+premValue(b); }); v+=empireNW()+bldNW()+finNW()+goodsNW();
  S.prop.forEach(p=>{ v+=propValue(p); }); S.projects.forEach(p=>{ v+=p.cost*0.9; });
  v+=holdingsValue('player');
  S.vc.mine.forEach(x=>{ v+=vcValue(x); });
  if(S.bank.lic) v+=bankEquity();
  S.lux.forEach(o=>{ v+=S.luxVal[o.id]; }); v+=collNW();
  if(S.country) v+=S.country.price*0.9;
  v-=Math.max(0,S.tb.corp)*S.laws.corpTax+Math.max(0,S.tb.cap)*S.laws.capTax;
  S.nw=v; if(v>S.peakNW) S.peakNW=v;
  return v;
}
function nwBreakdown(){
  const o={Trésorerie:S.cash+S.livret.bal, Sociétés:0, Immobilier:0, 'Titres et crypto':holdingsValue('player'), 'Capital-risque':0, Banque:0, Luxe:0, Pays:0, Dettes:-debtTotal()};
  S.biz.forEach(b=>{ o.Sociétés+=bizValue(b); o.Immobilier+=premValue(b); }); o.Villes=empireNW(); o.Immobilier+=bldNW(); o.Offshore=finNW(); o['Stocks d’usine']=goodsNW();
  S.prop.forEach(p=>{ o.Immobilier+=propValue(p); }); S.projects.forEach(p=>{ o.Immobilier+=p.cost*0.9; });
  S.vc.mine.forEach(x=>{ o['Capital-risque']+=vcValue(x); });
  if(S.bank.lic) o.Banque=bankEquity();
  S.lux.forEach(l=>{ o.Luxe+=S.luxVal[l.id]; }); o.Luxe+=collNW();
  if(S.country) o.Pays=S.country.price*0.9;
  return o;
}

/* ---------- Objectifs ---------- */
const ACH=[
  {id:'a1',t:'Premier pas',d:'Lancer votre première société.',ok:()=>S.biz.length>0||S.ach.a1},
  {id:'a2',t:'Équipe au complet',d:'Pourvoir tous les postes d’une société.',ok:()=>S.biz.some(b=>b.status==='active'&&staffFill(b)>=0.999)},
  {id:'a3',t:'Premier mois bénéficiaire',d:'Terminer un mois avec une société gagnant de l’argent.',ok:()=>S.biz.some(b=>b.hist.length>=30&&b.hist.slice(-30).reduce((a,x)=>a+x,0)>0)},
  {id:'a4',t:'Apprenti investisseur',d:'Détenir des titres, du livret ou des obligations.',ok:()=>S.livret.bal>0||['stock','bond','crypto'].some(c=>Object.keys(S.pf.player[c]).length>0)},
  {id:'a5',t:'Entrepreneur',d:'Atteindre 10 000 € de valeur nette.',ok:()=>S.peakNW>=10000},
  {id:'a6',t:'Banquier',d:'Obtenir une licence bancaire.',ok:()=>S.bank.lic},
  {id:'a7',t:'Propriétaire',d:'Posséder un bien immobilier.',ok:()=>S.prop.length>0},
  {id:'a8',t:'Peser sur la loi',d:'Financer une action de lobbying ou un parti.',ok:()=>S.stats.lobby>0},
  {id:'a9',t:'Employeur',d:'Employer 25 personnes.',ok:()=>totalEmployees()>=25},
  {id:'a10',t:'Investisseur',d:'Atteindre 100 000 € de valeur nette.',ok:()=>S.peakNW>=100000},
  {id:'a11',t:'Licorne',d:'Voir une de vos start-ups décoller.',ok:()=>S.stats.startupWin>0},
  {id:'a12',t:'Magnat',d:'Atteindre 1 M€ de valeur nette.',ok:()=>S.peakNW>=1e6},
  {id:'a13',t:'Collectionneur',d:'Acquérir un bien de luxe.',ok:()=>S.lux.length>0},
  {id:'a14',t:'Tycoon',d:'Atteindre 25 M€ de valeur nette.',ok:()=>S.peakNW>=25e6},
  {id:'a15',t:'Gardien du patrimoine',d:'Posséder un monument.',ok:()=>S.lux.some(o=>D.LUX.find(x=>x.id===o.id).kind==='monument')},
  {id:'a16',t:'Souverain',d:'Acheter un pays entier.',ok:()=>!!S.country||S.won}
];
/* V2.1.3 : 26 succès de plus (toutes les conditions sont protégées : un module absent ne bloque rien) */
{ const ok=f=>()=>{ try{ return !!f(); }catch(e){ return false; } }, act=()=>S.biz.filter(b=>b.status==='active'), O=()=>(S.foot&&S.foot.own)||null, cab=k=>((O()||{}).cab||[]).some(t=>t.k===k);
  ACH.push(
  {id:'b1',t:'Petit empire',d:'Diriger 5 sociétés ouvertes.',ok:ok(()=>act().length>=5)},
  {id:'b2',t:'Groupe',d:'Diriger 10 sociétés ouvertes.',ok:ok(()=>act().length>=10)},
  {id:'b3',t:'Conglomérat',d:'Diriger 25 sociétés ouvertes.',ok:ok(()=>act().length>=25)},
  {id:'b4',t:'Touche-à-tout',d:'Être présent dans 6 secteurs différents.',ok:ok(()=>new Set(act().map(b=>bizSec(b.def))).size>=6)},
  {id:'b5',t:'International',d:'Avoir des sociétés dans 3 villes.',ok:ok(()=>new Set(act().map(b=>b.city)).size>=3)},
  {id:'b6',t:'Tour du monde',d:'Avoir des sociétés dans 6 villes.',ok:ok(()=>new Set(act().map(b=>b.city)).size>=6)},
  {id:'b7',t:'Au sommet',d:'Porter une société au niveau 8.',ok:ok(()=>act().some(b=>b.lvl>=8))},
  {id:'b8',t:'Pilote automatique',d:'Confier 5 sociétés en délégation totale.',ok:ok(()=>act().filter(b=>dlMode(b)==='full').length>=5)},
  {id:'b9',t:'Grand employeur',d:'Employer 500 personnes.',ok:ok(()=>totalEmployees()>=500)},
  {id:'b10',t:'Milliardaire',d:'Atteindre 1 Md€ de valeur nette.',ok:ok(()=>S.peakNW>=1e9)},
  {id:'b11',t:'Centimillionnaire',d:'Atteindre 100 M€ de valeur nette.',ok:ok(()=>S.peakNW>=1e8)},
  {id:'b12',t:'Bénéfice record',d:'Gagner 1 M€ en un seul jour.',ok:ok(()=>act().reduce((a,b)=>a+((b.last&&b.last.net)||0),0)>=1e6)},
  {id:'b13',t:'Palace',d:'Obtenir la distinction Palace pour un hôtel.',ok:ok(()=>act().some(b=>b.def==='hotel'&&b.m&&b.m.pal))},
  {id:'b14',t:'Sang-froid',d:'Parer une crise.',ok:ok(()=>S.stats.mit>0)},
  {id:'b15',t:'Casseur de prix',d:'Lancer une guerre des prix.',ok:ok(()=>S.stats.att>0)},
  {id:'b16',t:'Terrain conquis',d:'Faire quitter un marché à un rival.',ok:ok(()=>S.stats.attWin>0)},
  {id:'b17',t:'Prédateur',d:'Réussir une OPA sur un groupe rival.',ok:ok(()=>Object.values((S.riv||{}).rv||{}).some(v=>v.gone))},
  {id:'b18',t:'Défi de la semaine',d:'Réussir un événement de la semaine.',ok:ok(()=>S.stats.wev>0)},
  {id:'b19',t:'Habitué',d:'Réussir 10 événements de la semaine.',ok:ok(()=>S.stats.wev>=10)},
  {id:'c1',t:'Président de club',d:'Acheter un club de football.',ok:ok(()=>!!O())},
  {id:'c2',t:'Champion',d:'Gagner un championnat avec votre club.',ok:ok(()=>cab('lg'))},
  {id:'c3',t:'Coupe en main',d:'Gagner une coupe nationale.',ok:ok(()=>cab('cup'))},
  {id:'c4',t:'Roi d’Europe',d:'Gagner une compétition internationale.',ok:ok(()=>cab('ic'))},
  {id:'c5',t:'Bâtisseur de stade',d:'Agrandir votre stade.',ok:ok(()=>(O()||{}).stx>0)},
  {id:'c6',t:'Centre de formation',d:'Faire signer un jeune repéré par vos recruteurs.',ok:ok(()=>S.stats.ysign>0)},
  {id:'c7',t:'Armoire pleine',d:'Remporter 10 trophées.',ok:ok(()=>((O()||{}).cab||[]).length>=10)}); }
function checkAch(){
  ACH.forEach(a=>{
    if(!S.ach[a.id] && a.ok()){ S.ach[a.id]=S.day; S.rep=clamp(S.rep+2,0,100); log('good','Objectif atteint : « '+a.t+' ». Votre réputation progresse.'); }
  });
}

/* ---------- Défis par palier de richesse (V1.6.3) ---------- */
function chAct(){ return S.biz.filter(b=>b.status==='active'); }
function chCities(){ return new Set(chAct().map(b=>b.city)).size; }
function chMo(){ return chAct().reduce((a,b)=>a+(b.hist||[]).slice(-30).reduce((x,y)=>x+y,0),0); }
function chN(n){ return {t:n+' sociétés',d:'Avoir '+n+' sociétés en activité.',v:()=>chAct().length,g:n}; }
function chC(n){ return {t:n+' villes',d:'Être présent dans '+n+' villes.',v:chCities,g:n}; }
function chP(n){ return {t:'Mois rentable',d:'Gagner '+eur(n,0)+' en 30 jours avec vos sociétés.',v:chMo,g:n}; }
const CHAL=[
  {r:1000,   l:[chN(2),{t:'Agrandir',d:'Passer une société au niveau 2.',v:()=>Math.max(0,...S.biz.map(b=>b.lvl||1)),g:2},{t:'Bonne réputation',d:'Atteindre 60 de réputation.',v:()=>S.rep,g:60}]},
  {r:8000,   l:[chN(4),chC(2),chP(3000)]},
  {r:60000,  l:[chN(7),chC(3),chP(40000)]},
  {r:500000, l:[chN(10),chC(4),chP(400000)]},
  {r:1e7,    l:[chN(15),chC(5),chP(8e6)]},
  {r:1.5e8,  l:[chN(20),chC(6),chP(1.5e8)]},
  {r:3e9,    l:[chN(25),{t:'Grand employeur',d:'Employer 1 000 personnes.',v:()=>totalEmployees(),g:1000},chP(3e9)]}
];
/* V1.7.4 : défis rejouables une fois les défis Souverain réussis (S.chalR = {n, ok:{}}), de plus en plus durs */
function chRep(n){ const k=n+1; return {r:3e9*Math.pow(1.5,k), l:[chN(25+5*k), {t:'Grand employeur',d:'Employer '+fmtN(1000+600*k,0)+' personnes.',v:()=>totalEmployees(),g:1000+600*k}, chP(3e9*Math.pow(1.6,k))]}; }
const chAllT = t => CHAL[t].l.every((c,i)=>(S.chal||{})[t+':'+i]);
function checkChalR(){ if(tierNow()<CHAL.length-1||!chAllT(CHAL.length-1)) return; S.chalR=S.chalR||{n:0,ok:{}}; const R=S.chalR, C=chRep(R.n);
  C.l.forEach((c,i)=>{ if(!R.ok[i]&&c.v()>=c.g){ R.ok[i]=S.day; S.cash+=C.r; S.rep=clamp(S.rep+1,0,100); log('good','Défi de légende réussi : « '+c.t+' ». Prime de '+eur(C.r,0)+'.'); } });
  if(C.l.every((c,i)=>R.ok[i])){ R.n++; R.ok={}; log('good','Série de défis n°'+R.n+' terminée : une nouvelle série, plus ambitieuse, commence.'); } }
function checkChal(){
  S.chal=S.chal||{}; const T=Math.min(tierNow(),CHAL.length-1);
  for(let t=0;t<=T;t++) CHAL[t].l.forEach((c,i)=>{ const k=t+':'+i;
    if(!S.chal[k] && c.v()>=c.g){ S.chal[k]=S.day; S.cash+=CHAL[t].r; S.rep=clamp(S.rep+1,0,100); log('good','Défi réussi : « '+c.t+' ». Prime de '+eur(CHAL[t].r,0)+'.'); } });
}

/* ---------- Jour suivant ---------- */
function nextDay(){
  if(S.over) return false;
  const d=S.day; S.stop=false;
  S.tagMods=S.tagMods.filter(m=>m.until>=d);
  macroStep(); eventsStep(); fxStep(); cityStep();
  marketsStep(); ordersStep();
  S.biz.slice().forEach(processBiz);
  propStep(); luxStep(); lux2Step(); bankStep(); vcStep(); debtStep(); acctStep(); countryStep();
  socialStep();
  agencyStep(); hrStep(); rivStep(); riv2Step(); empireStep(); bldStep(); procStep(); indStep(); consStep(); mgrStep(); bossStep(); electionStep(); savingStep();
  taxStep(); offmStep(); d100Step();
  settleAccounts();
  evictStep();
  /* découvert */
  if(S.cash<0){
    S.negDays++; S.rep=clamp(S.rep-0.2,0,100);
    if(S.negDays===1||S.negDays%4===0) log('crit','Compte à découvert depuis '+plu(S.negDays,'jour')+'. Vendez des actifs avant la faillite (14 jours).');
  } else S.negDays=0;
  /* fin de journée */
  rptDay();
  S.flLast=S.fl; S.flLastDay=d; S.fl={};
  S.day=d+1;
  politicsStep();
  computeNW();
  if(S.day%(S.nwStep||1)===0){ S.nwH.push(Math.round(S.nw)); if(S.nwH.length>1200){ S.nwH=S.nwH.filter((x,i)=>i%2===0); S.nwStep=(S.nwStep||1)*2; } }
  checkAch(); checkChal(); checkChalR(); criStep(); balStep();
  Object.keys(D.CITIES).forEach(id=>{ if(!D.CITIES[id].parent && !S.citySeen[id] && S.peakNW>=D.CITIES[id].unlock){ S.citySeen[id]=1; log('good','Nouvelle ville accessible : '+D.CITIES[id].n+'. Ouvrez-y des sociétés depuis l’onglet Sociétés.'); } });
  const t=tierNow();
  if(t>S.tierSeen){ S.tierSeen=t; S.flashTier=t; log('good','Nouveau palier : '+D.TIERS[t].n+' ! '+D.TIERS[t].d); }
  if(S.negDays>=14){ S.over={day:S.day,reason:'Votre compte est resté à découvert pendant 14 jours. Les créanciers saisissent vos actifs.'}; S.stop=true; }
  else if(S.nw<-Math.max(20000,S.startCap*2)){ S.over={day:S.day,reason:'Vos dettes dépassent largement vos actifs : faillite personnelle.'}; S.stop=true; }
  return true;
}
function advance(n){ for(let i=0;i<n;i++){ if(!nextDay()||S.stop||S.over) break; } }

/* Candidats : renouvelés au bout d'une semaine */
function candsFor(e,role){ if(!e.cands[role]||S.day-(e.candDay||0)>=7) return genCands(e,role); return e.cands[role]; }
function refreshCands(e,role){
  const c=Math.round(60*(e.kind==='bank'?1:e.lvl)); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+'.');
  pay(e.kind==='bank'?'bank':'b:'+e.id,'Cabinet de recrutement',-c); genCands(e,role); return ok();
}

/* ---------- Nouvelle partie, sauvegarde ---------- */
function startGame(name,cap,seed,diff){
  S=newState(name,Math.max(5000,Math.round(cap)),seed);
  S.diff=diff==='easy'?'easy':'hard'; S.dm=S.diff==='easy'?.55:1;
  S.macro.phase=rint(0,719);
  initMarkets(); initLux(); genListings(); computeNW();
  S.nwH=[Math.round(S.nw)];
  log('info','Bienvenue, '+S.name+'. Vous démarrez à Paris avec '+eur(S.cash)+'. Lancez une première activité, puis passez au jour suivant.');
  return S;
}
function exportSave(){ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function importSave(txt){
  try{ const s=JSON.parse(decodeURIComponent(escape(atob(txt.trim())))); if(!s||s.v!==1||!s.mk) return false; S=migrateState(s); return true; }catch(e){ return false; }
}

