/* ============================================================
   V2.6.5 : un Parlement par pays
   Chaque pays a ses lois, son gouvernement, ses projets de loi, son historique et ses élections.
   Le pays de résidence (S.home, France par défaut) garde les champs d'origine (S.laws, S.gov, S.bills,
   S.lawLog, S.elec) : vos impôts personnels suivent ses lois. Les autres pays vivent dans S.pol[id].
   withPol(id,fn) branche le moteur politique existant sur le pays voulu, le temps d'un appel.
   Le pays que vous gouvernez n'a plus de Parlement : vos décrets font la loi.
   ============================================================ */
const POL_K=['laws','gov','bills','lawLog','elec'];
const POL0={croatie:{corpTax:.20}, espagne:{labor:1}, usa:{corpTax:.20,subTech:1}, bresil:{corpTax:.33,labor:1,consLaw:1}, chine:{cryptoReg:1,subRenew:1,subTech:1}};
const polHome = () => S.home||'france';
const ctyIdOf = city => { const c=ctyOf(city); return c? c.id : polHome(); };
const ctyName = id => (D.COUNTRIES.find(c=>c.id===id)||{n:id}).n;
function polOf(cid){ if(cid===polHome()) return null; S.pol=S.pol||{};
  return S.pol[cid]||(S.pol[cid]={laws:Object.assign({},D.LAW0,POL0[cid]||{}), gov:{pop:55,ten:35,stab:65}, bills:[], lawLog:[], elec:null}); }
/* le joueur est concerné par un pays s'il y réside, y possède une ville ou y a une société */
const polCare = cid => cid===polHome() || D.COUNTRIES.find(c=>c.id===cid).cities.some(x=>cityOwned(x)||S.biz.some(b=>b.city===x&&b.status!=='closed'));
let POLC=null;
function withPol(cid,fn){ const P=polOf(cid), sc=S.country, save={};
  if(P) POL_K.forEach(k=>{ save[k]=S[k]; S[k]=P[k]; });
  if(sc&&sc.id!==cid) S.country=null; const pc=POLC; POLC=cid;
  try{ return fn(); } finally { if(P) POL_K.forEach(k=>{ P[k]=S[k]; S[k]=save[k]; }); S.country=sc; POLC=pc; } }
/* journal : nom du pays devant les nouvelles politiques, et silence sur les pays où vous n'êtes pas */
{ const _lg=log; log=function(k,m,c){ if(POLC&&POLC!==polHome()&&!(S.country&&S.country.id===POLC)){ if(!polCare(POLC)) return; m=ctyName(POLC)+' : '+m; } return _lg(k,m,c); }; }
/* moteur quotidien : chaque pays non gouverné */
{ const _ps=politicsStep, _es=electionStep;
  politicsStep=function(){ D.COUNTRIES.forEach(c=>{ if(!(S.country&&S.country.id===c.id)) withPol(c.id,_ps); }); };
  electionStep=function(){ D.COUNTRIES.forEach(c=>{ if(!(S.country&&S.country.id===c.id)) withPol(c.id,_es); }); }; }
/* lois applicables à une ville */
lawsAt=function(city){ const cid=ctyIdOf(city); if(S.country&&S.country.id===cid) return ctyLaws(); const P=polOf(cid); return P? P.laws : S.laws; };
{ const _cl=ctyLaws; ctyLaws=function(){ return S.country&&S.country.id===polHome()? S.laws : _cl(); }; }
{ const _cb=ctyBill; ctyBill=function(b){ return S.country&&S.country.id===polHome()? b.cond(S.laws) : _cb(b); }; }
/* impôt sur les sociétés : taux moyen pondéré par les bénéfices réalisés dans chaque pays */
function corpRateEff(){ const W={}; let T=0;
  S.biz.forEach(b=>{ if(b.status!=='active') return; const p=Math.max(0,(b.hist||[]).slice(-30).reduce((x,y)=>x+y,0)); if(!p) return; const c=ctyIdOf(b.city); W[c]=(W[c]||0)+p; T+=p; });
  if(!T) return S.laws.corpTax;
  return Object.keys(W).reduce((a,c)=>{ const gov=S.country&&S.country.id===c, r= gov? (S.country.ex===false? ctyLaws().corpTax : 0) : (polOf(c)||{laws:S.laws}).laws.corpTax; return a+W[c]/T*r; },0); }
/* vue Politique : un onglet par pays */
{ const _vp=vPol; vPol=function(){ const cid=ui.polC&&D.COUNTRIES.some(c=>c.id===ui.polC)? ui.polC : polHome(); ui.polC=cid;
  const o=withPol(cid,_vp), k=o.indexOf('<div class="grid">'), gov=S.country&&S.country.id===cid;
  const tabs='<div class="px-tabs pol-tabs" role="tablist">'+D.COUNTRIES.map(c=>'<button role="tab" aria-selected="'+(c.id===cid)+'" class="'+(c.id===cid?'on':'')+'" data-a="polc" data-v="'+c.id+'">'+esc(c.n)+(c.id===polHome()?' <i>résidence</i>':S.country&&S.country.id===c.id?' <i>à vous</i>':'')+'</button>').join('')+'</div>';
  const n= cid===polHome()? 'Votre pays de résidence : vos impôts personnels (capital, fortune, luxe) et vos sociétés installées ici suivent ces lois.' : gov? 'Vous gouvernez ce pays : pas de Parlement, vos décrets font la loi.' : 'Ces lois s’appliquent à vos sociétés installées dans ce pays. Vous pouvez y faire du lobbying et soutenir des candidats comme ailleurs.';
  const nt='<div class="notice info">'+n+'</div>';
  return k<0? tabs+nt+o : o.slice(0,k)+tabs+nt+o.slice(k); }; VIEWS.pol=vPol; }
ACT.polc=el=>{ ui.polC=el.dataset.v; render(); };
/* actions politiques : elles visent le pays affiché */
{ const W=f=>function(){ const a=arguments; return withPol(ui.polC||polHome(),()=>f.apply(null,a)); };
  lobby=W(lobby); donate=W(donate); fundCandidate=W(fundCandidate); }
(function(){ const st=document.createElement('style'); st.textContent='.pol-tabs{margin:4px 0 12px}.pol-tabs i{font-style:normal;font-size:11px;opacity:.75;margin-left:4px}'; document.head.appendChild(st); })();

/* candidats aux noms du pays */
const POL_NAMES={croatie:[['Ivan','Ana','Marko','Petra','Luka','Maja','Tomislav','Ivana'],['Horvat','Kovačić','Babić','Marić','Jurić','Novak','Knežević']],
  espagne:[['Lucía','Javier','Carmen','Diego','Elena','Pablo','Marta','Álvaro'],['García','Martínez','López','Sánchez','Romero','Navarro','Ortega']],
  usa:[['Emily','James','Olivia','Michael','Grace','Daniel','Hannah','Ryan'],['Miller','Carter','Brooks','Hayes','Walker','Bennett','Foster']],
  bresil:[['Ana','João','Mariana','Rafael','Beatriz','Thiago','Camila','Lucas'],['Silva','Souza','Costa','Oliveira','Pereira','Almeida','Ribeiro']],
  chine:[['Wei','Li','Mei','Jun','Xiu','Hao','Lan','Bo'],['Wang','Zhang','Liu','Chen','Yang','Zhao','Huang']]};
{ const _ec=elecCands; elecCands=function(){ _ec(); const N=POLC&&POL_NAMES[POLC]; if(N) S.elec.cands.forEach(c=>{ c.name=pick(N[0])+' '+pick(N[1]); }); }; }

