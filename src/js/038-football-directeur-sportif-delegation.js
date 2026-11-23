/* ============================================================
   FOOTBALL : directeur sportif (délégation)
   Trois niveaux : « Je gère » (il conseille seulement), « Assisté » (il compose
   l'équipe et répond aux offres de vente), « Délégation totale » (il recrute aussi
   pendant le mercato, dans le budget fixé, selon le profil choisi).
   État : O.ds (créé au premier besoin).
   ============================================================ */
const DS_FEE = [0,3e5,1e6,3e6,8e6,2e7], DS_WAGE = [0,2e5,6e5,1.5e6,3.5e6,8e6];
const DS_MODES = {me:{n:'Je gère', d:'Il donne son avis, vous décidez de tout.'}, assist:{n:'Assisté', d:'Il compose l’équipe et accepte les bonnes offres pour les remplaçants. Les achats restent à vous.'}, full:{n:'Délégation totale', d:'Il compose l’équipe, vend et recrute pendant le mercato, dans le budget fixé.'}};
const DS_PROFILES = {young:'Jeunes à potentiel', eq:'Équilibré', star:'Vedettes'};
const DS_BUDGETS = [5e6,2e7,5e7,1.5e8,5e8];
function dsOf(O){ O=O||fcOwn(); if(!O) return null; if(!O.ds) O.ds={lvl:0, mode:'me', budget:2e7, profile:'eq', spent:0, wkey:null, tries:0, log:[]}; return O.ds; }
function dsLog(t){ const D=dsOf(); if(!D) return; D.log.unshift({d:S.day,t}); if(D.log.length>25) D.log.length=25;
  /* achats et ventes : à montrer au prochain passage dans Mon club */
  if(/^(Vente|Recrue) :/.test(t)){ D.unseen=D.unseen||[]; D.unseen.push({d:S.day,t}); if(D.unseen.length>20) D.unseen.shift(); } }
{ const _sc=fcStaffCost; fcStaffCost=function(O){ return _sc(O)+DS_WAGE[(O.ds&&O.ds.lvl)||0]; }; }

function dsHire(){
  const O=fcOwn(); if(!O) return err('Rachetez d’abord un club.'); const D=dsOf(O);
  if(D.lvl>=5) return err('Vous avez déjà le meilleur directeur sportif.');
  const fee=DS_FEE[D.lvl+1]; if(S.cash<fee) return err('Il faut '+eur(fee,0)+'.');
  D.lvl++; fcPay('staff','Club : recrutement du directeur sportif',-fee);
  if(D.lvl===1) dsLog('Prise de fonctions. Choisissez le niveau de délégation.');
  return ok('Directeur sportif : niveau '+D.lvl+' sur 5.');
}
function dsSet(k,v){
  const O=fcOwn(); if(!O) return err('Aucun club.'); const D=dsOf(O);
  if(k==='mode'){ if(!DS_MODES[v]) return err(''); if(v!=='me'&&D.lvl<1) return err('Recrutez d’abord un directeur sportif.'); D.mode=v; if(v!=='me') O.auto=true; dsLog('Délégation : '+DS_MODES[v].n.toLowerCase()+'.'); }
  else if(k==='budget') D.budget=Math.max(0,+v||0);
  else if(k==='profile'&&DS_PROFILES[v]) D.profile=v;
  return ok('');
}
/* ce que le directeur sportif conseille (affiché même en « Je gère ») */
function dsAdvice(O){
  const L=fcLineup(), out=[];
  const weak=L.xi.slice(1).sort((a,b)=>a.o-b.o)[0]; if(weak) out.push('Point faible : '+FOOT_POS[weak.slot].toLowerCase()+' ('+weak.n+', '+Math.round(weak.o)+').');
  const inj=O.sq.filter(p=>p.inj>0).length; if(inj) out.push(inj+' joueur'+(inj>1?'s':'')+' blessé'+(inj>1?'s':'')+'.');
  if(O.sq.length>27) out.push('Effectif trop chargé : '+O.sq.length+' joueurs. Vendez les remplaçants qui ne jouent pas.');
  if(O.sq.length<20) out.push('Effectif court : '+O.sq.length+' joueurs. Recrutez des remplaçants.');
  const old=O.sq.filter(p=>p.a>=33&&p.o<fcStrength()-2).length; if(old) out.push(old+' joueur'+(old>1?'s':'')+' en fin de carrière à remplacer.');
  if(fcFitPenalty(L.xi)>.5) out.push('Des joueurs jouent hors de leur poste avec le système '+O.form+'.');
  return out;
}
/* pas quotidien */
function dsDaily(day){
  const O=fcOwn(); if(!O) return; const D=dsOf(O); if(D.lvl<1||D.mode==='me') return;
  O.auto=true;
  /* offres reçues */
  const starters=new Set(fcLineup().xi.map(p=>p.id));
  /* V1.8.5 : les joueurs déclarés intouchables (O.keep) ne sont jamais vendus ni mis en vente par le directeur */
  const keep=O.keep||{};
  O.offers.slice().forEach(o=>{ const p=O.sq.find(x=>x.id===o.pid); if(!p||keep[p.id]) return; const v=fcPlayerValue(p);
    const yes=(!starters.has(p.id) && o.fee>=v*(1.15-.03*D.lvl)) || (O.list[p.id] && o.fee>=v*.9) || (D.mode==='full' && o.fee>=v*(2-.08*D.lvl));
    if(yes && O.sq.length>22){ const r=fcOffer(o.id,true); if(r.ok) dsLog('Vente : '+p.n+' à '+footName(o.club)+' pour '+eur(o.fee,0)+'.'); } });
  if(D.mode!=='full') return;
  const W=fcWindow(day); if(!W) return;
  if(D.wkey!==W.a){ D.wkey=W.a; D.spent=0; D.tries=0; dsLog(W.n+' : budget de '+eur(D.budget,0)+'.'); }
  /* effectif trop fourni : mettre en vente les moins utiles */
  if(O.sq.length>26){ O.sq.filter(p=>!starters.has(p.id)&&!O.list[p.id]&&!keep[p.id]&&p.a>22).sort((a,b)=>a.o-b.o).slice(0,O.sq.length-26).forEach(p=>{ O.list[p.id]=1; dsLog(p.n+' est placé sur la liste des transferts.'); }); }
  if((day-W.a)%3!==0 || D.tries>=3+D.lvl*2 || O.sq.length>=29) return;
  const left=D.budget-D.spent; if(left<2e5) return;
  /* poste le plus faible, en tenant compte du profil */
  const L=fcLineup(), score=p=>p.o-(D.profile==='young'&&p.a>=30?3:0);
  let weak=L.xi.slice().sort((a,b)=>score(a)-score(b))[0]; if(!weak) return;
  /* effectif trop court : on renforce le poste le moins fourni, avec un remplaçant */
  if(O.sq.length<22){ const need={}; FOOT_SQUAD_SHAPE.forEach(p=>need[p]=(need[p]||0)+1); O.sq.forEach(p=>need[p.p]=(need[p.p]||0)-1); const pos=Object.keys(need).sort((a,b)=>need[b]-need[a])[0]; weak={slot:pos, o:fcStrength()-8, n:''}; }
  const mult=D.lvl>=4? 1.15 : 1.25, disc=1-.03*(O.staff.scout-1), maxV=left/(mult*disc);
  let c=fcMarket({pos:weak.slot, max:maxV}).filter(x=>x.p.o>=weak.o+(7-D.lvl) && fcWillJoin(x.p)>=.45);
  if(D.profile==='young') c=c.filter(x=>x.p.a<=24).sort((a,b)=>(b.p.o-b.p.a*.4)-(a.p.o-a.p.a*.4));
  else if(D.profile==='eq') c=c.filter(x=>x.p.a<=31).sort((a,b)=>(b.p.o/Math.log(b.v+2e5))-(a.p.o/Math.log(a.v+2e5)));
  else c=c.sort((a,b)=>b.p.o-a.p.o);
  const pick=c[0]; D.tries++;
  if(!pick){ if(D.tries===1) dsLog('Aucune bonne affaire au poste de '+FOOT_POS[weak.slot].toLowerCase()+' dans le budget.'); return; }
  const cash0=S.cash, r=fcBid(pick.p.id,pick.club,mult);
  if(r.ok){ D.spent+=cash0-S.cash; dsLog('Recrue : '+pick.p.n+' ('+FOOT_POS[pick.p.p].toLowerCase()+', '+Math.round(pick.p.o)+') pour '+eur(cash0-S.cash,0)+'.'); fcNews('Le directeur sportif recrute '+pick.p.n+'.','good'); }
  else dsLog('Échec : '+r.msg);
}
{ const _fd=fcDaily; fcDaily=function(day){ _fd(day); try{ dsDaily(day); }catch(e){ console.error(e); } }; }

