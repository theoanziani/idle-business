/* ============================================================
   CONCURRENCE AVANCÉE : enseignes des rivaux dans de vrais bâtiments, offres de rachat
   avec contre-offres, rachat d'un groupe entier, classement des magnats
   ============================================================ */
const shopsOf = rid => (S.riv&&S.riv.shops||[]).filter(x=>x.rid===rid);
const rivShopAt = bid => S.riv&&S.riv.shops? S.riv.shops.find(x=>x.bld===bid) : null;
function shopVal(sh){ const v=S.riv.rv[sh.rid]; return bizInvested({def:sh.def,lvl:sh.lvl})*locCostF(sh.def,sh.city,sh.dist)*(0.8+0.25*v.pow); }
const shopProfit = sh => shopVal(sh)/(D.biz[sh.def].payback*Math.pow(1.12,sh.lvl-1))*(sh.perf||1);
/* Fait correspondre les enseignes à la présence de chaque rival sur ses marchés (ville | secteur) */
function shopsSync(){
  const R=rivInit(); if(!R.shops) R.shops=[];
  const taken=new Set(R.shops.map(x=>x.bld)); Object.keys(S.bld||{}).forEach(id=>taken.add(id));
  D.RIVALS.forEach(r=>{
    const v=R.rv[r.id]; if(v.gone){ R.shops=R.shops.filter(x=>x.rid!==r.id); return; }
    Object.keys(v.pres).forEach(key=>{
      const [cid,sec]=key.split('|'), C=D.CITIES[cid]; if(!C) return;
      const want=clamp(Math.round(v.pres[key]*3),1,4), have=R.shops.filter(x=>x.rid===r.id&&x.key===key);
      for(let i=have.length;i<want;i++){
        const opts=[]; C.d.forEach(dd=>bldList(cid,dd.id).forEach(bd=>{ if(taken.has(bd.id)) return; bldDefs(bd).forEach(def=>{ if(bizSec(def)===sec&&!D.biz[def].startup) opts.push([bd,def]); }); }));
        if(!opts.length) break; const [bd,def]=pick(opts); taken.add(bd.id);
        R.shops.push({id:S.nid++, rid:r.id, key, bld:bd.id, city:cid, dist:bd.dist, def, lvl:Math.max(1,Math.min(bldMaxLvl(bd,def),rint(1,1+Math.floor(v.pow*2)))), perf:Math.round((0.75+0.5*rnd())*100)/100});
      }
      if(have.length>want){ have.slice(want).forEach(x=>{ R.shops=R.shops.filter(y=>y!==x); }); }
    });
    R.shops=R.shops.filter(x=>x.rid!==r.id||v.pres[x.key]);
  });
}
function rivNW(rid){ const v=S.riv.rv[rid]; return v.gone? 0 : 20e6*v.pow+shopsOf(rid).reduce((a,x)=>a+shopVal(x),0); }
function rivProfitDay(rid){ return shopsOf(rid).reduce((a,x)=>a+shopProfit(x),0)*(0.85+0.3*rnd()); }
function riv2Step(){
  const R=rivInit(); if(!R.shops) shopsSync();
  D.RIVALS.forEach(r=>{ const v=R.rv[r.id]; if(v.gone) return; const p=rivProfitDay(r.id); (v.ph=v.ph||[]).push(Math.round(p)); if(v.ph.length>60) v.ph.shift(); });
  R.shops.forEach(sh=>{ if(sh.counter&&S.day>sh.counter.exp){ sh.counter=null; } sh.perf=clamp((sh.perf||1)*Math.exp(0.01*norm()),.5,1.6); });
}

/* ---------- Offre de rachat d'une enseigne ---------- */
function shopReserve(sh){ if(!sh.res) sh.res=Math.round(shopVal(sh)*(1.05+0.3*rnd())/100)*100; return sh.res; }
function shopOffer(id,amt){
  const R=rivInit(), sh=R.shops.find(x=>x.id===id); if(!sh) return err('Cette enseigne n’existe plus.');
  if(!unlocked(D.biz[sh.def].tier)) return err('Palier '+D.TIERS[D.biz[sh.def].tier].n+' requis pour cette activité.');
  if(!cityUnlocked(sh.city)) return err('Ville verrouillée.');
  if(sh.cool&&S.day<sh.cool) return err(rivDef(sh.rid).n+' refuse de négocier avant le '+dateL(sh.cool)+'.');
  if(!(amt>0)) return err('Montant invalide.');
  const res=shopReserve(sh), r=rivDef(sh.rid);
  if(amt>=res) return acquireShop(sh,amt);
  if(amt>=res*.75){ sh.counter={px:Math.round(res*(1+0.08*rnd())/100)*100, exp:S.day+5}; log('info',r.n+' répond par une contre-offre à '+eur(sh.counter.px,0)+' pour son '+D.biz[sh.def].n.toLowerCase()+' ('+bldById(sh.bld).addr+'), valable 5 jours.'); return ok('Contre-offre : '+eur(sh.counter.px,0)+'.'); }
  sh.cool=S.day+10; return err(r.n+' juge l’offre trop basse et refuse de négocier pendant 10 jours.');
}
function acceptCounter(id){ const sh=S.riv.shops.find(x=>x.id===id); if(!sh||!sh.counter) return err('Plus de contre-offre.'); return acquireShop(sh,sh.counter.px); }
function acquireShop(sh,price){
  const C=D.CITIES[sh.city], base=launchCost(sh.def,0,sh.city,sh.dist);
  if(availFor(C.ccy)<Math.max(price,base)) return err('Trésorerie insuffisante : '+eur(price,0)+' requis.');
  const R=S.riv, r=rivDef(sh.rid);
  R.shops=R.shops.filter(x=>x!==sh);
  if(!S.bld) S.bld={}; S.bld[sh.bld]={st:'rent',dep:0,biz:null,since:S.day};
  const res=launchBiz(sh.def,0,null,null,sh.bld); if(!res.ok){ delete S.bld[sh.bld]; R.shops.push(sh); return res; }
  const b=S.biz[S.biz.length-1];
  payCap('b:'+b.id,'Rachat à '+r.n+' (solde)',base-price); settleAccounts();
  b.lvl=sh.lvl; b.status='active'; b.liveDay=S.day+1; b.inv$=price; startCrew(b,.85); if(isStock(b)) b.stock=cogsRef(b)*5;
  b.name=D.biz[sh.def].n+' (ex-'+r.n+')';
  const v=R.rv[sh.rid]; if(v.pres[sh.key]) v.pres[sh.key]=Math.max(0,v.pres[sh.key]-.15); if(v.pres[sh.key]<=0.05) delete v.pres[sh.key]; v.pow=Math.max(.4,v.pow-.03); v.lost++;
  log('good','Vous rachetez l’enseigne de '+r.n+' au '+bldById(sh.bld).addr+' ('+C.n+') pour '+eur(price,0)+'. Elle ouvre aussitôt sous vos couleurs.');
  return ok('Enseigne rachetée.');
}

/* ---------- Rachat d'un groupe entier (rival affaibli) ---------- */
function groupPrice(rid){ return Math.round(rivNW(rid)*1.3/1e4)*1e4; }
function groupBuyable(rid){ const v=S.riv.rv[rid]; return !v.gone&&v.pow<0.8; }
function buyGroup(rid){
  const R=rivInit(), v=R.rv[rid], r=rivDef(rid); if(!v||v.gone) return err('Groupe introuvable.');
  if(!groupBuyable(rid)) return err(r.n+' est trop solide : affaiblissez-le d’abord (puissance sous 0,80).');
  if(!unlocked(4)) return err('Palier Tycoon requis.');
  const p=groupPrice(rid); if(S.cash+accValue()*.97<p) return err('Trésorerie insuffisante : '+eur(p,0)+' requis.');
  payCap('gen','OPA sur '+r.n,-p); settleAccounts();
  let n=0; shopsOf(rid).forEach(sh=>{ if(!cityUnlocked(sh.city)||!unlocked(D.biz[sh.def].tier)) return; const keep=S.cash; S.cash+=launchCost(sh.def,0,sh.city,sh.dist);
    if(!S.bld) S.bld={}; S.bld[sh.bld]={st:'rent',dep:0,biz:null,since:S.day}; const res=launchBiz(sh.def,0,null,null,sh.bld);
    if(res.ok){ const b=S.biz[S.biz.length-1]; b.lvl=sh.lvl; b.status='active'; b.liveDay=S.day+1; startCrew(b,.8); if(isStock(b)) b.stock=cogsRef(b)*5; b.name=D.biz[sh.def].n+' (ex-'+r.n+')'; n++; } else { delete S.bld[sh.bld]; S.cash=keep; } });
  v.gone=true; v.pres={}; R.shops=R.shops.filter(x=>x.rid!==rid); R.wars=R.wars.filter(w=>w.rival!==rid); R.offers=R.offers.filter(o=>o.rival!==rid);
  S.rep=clamp(S.rep+3,0,100); S.infl+=20;
  log('good','OPA réussie : vous absorbez '+r.n+' pour '+eur(p,0)+'. '+n+' enseigne(s) passent sous vos couleurs ; le groupe disparaît du marché.');
  return ok();
}
/* Classement : valeur nette estimée */
function magnates(){
  const L=rivAlive().filter(r=>!S.riv.rv[r.id].gone).map(r=>({n:r.n,id:r.id,v:rivNW(r.id),ph:S.riv.rv[r.id].ph||[]}));
  L.push({n:S.name,me:true,v:S.nw,ph:S.nwH.slice(-60)});
  return L.sort((a,b)=>b.v-a.v);
}

/* ---------- V2.0.7 : guerres des prix lancées par le joueur ----------
   Sur un de vos marchés (ville | secteur), contre un rival présent. 20 jours : vos prix −12 %, vos ventes +10 %.
   Chaque jour la présence du rival sur ce marché recule de 0,012 ; à la fin, sa puissance perd 0,05.
   Une présence sous 0,05 : le rival quitte le marché (ses enseignes ferment).
   Le rival peut riposter (25 % + 10 % par point d'agressivité) : effets réduits de moitié et il lance sa propre guerre.
   Coût de lancement : 30 % du prix d'un contrat de non-concurrence. Pas de nouvelle attaque sur ce marché pendant 60 jours.
   État : S.riv.att[] {id, key, rival, left, rip}, S.riv.attCd{key: jour}. */
const ATT_DAYS=20, ATT_CD=60;
const attOf = key => ((S.riv&&S.riv.att)||[]).find(a=>a.key===key);
function attRev(b){ return attOf(rivKey(b))? .88 : 1; }
function attVol(b){ const a=attOf(rivKey(b)); return a? (a.rip? 1.05 : 1.10) : 1; }
const attCost = key => Math.round(ncPrice(key)*.3/100)*100;
function attRivals(key){ const R=rivInit(); return D.RIVALS.filter(r=>!R.rv[r.id].gone&&(R.rv[r.id].pres[key]||0)>0); }
function attWhy(key){ const R=rivInit(); if(!S.biz.some(b=>b.status==='active'&&rivKey(b)===key)) return 'Vous n’avez pas d’activité sur ce marché.';
  if(attOf(key)) return 'Une guerre des prix est déjà en cours.'; if((R.attCd||{})[key]>S.day) return 'Vos clients se remettent de la dernière guerre : possible le '+dateL(R.attCd[key])+'.';
  if(!attRivals(key).length) return 'Aucun rival sur ce marché.'; return ''; }
function attLaunch(key,rid){ const R=rivInit(), why=attWhy(key); if(why) return err(why);
  const r=rivDef(rid), v=R.rv[rid]; if(!r||!v||v.gone||!(v.pres[key]>0)) return err('Ce rival n’est pas sur ce marché.');
  const c=attCost(key); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('gen','Guerre des prix contre '+r.n+' : '+keyLabel(key),-c);
  S.stats.att=(S.stats.att||0)+1; const rip=rnd()<.25+.1*r.ag; R.att=R.att||[]; R.att.push({id:R.nid++, key, rival:rid, left:ATT_DAYS, rip});
  if(rip&&!R.wars.some(w=>w.key===key)){ R.wars.push({id:R.nid++,key,rival:rid,left:rint(8,14),sev:Math.round((.5+.5*rnd())*10)/10,resp:'hold'}); v.wars++; }
  log(rip?'warn':'good','Vous cassez les prix face à '+r.n+' : '+keyLabel(key)+', pendant '+ATT_DAYS+' jours.'+(rip?' '+r.n+' riposte et baisse aussi ses prix : choisissez votre réponse dans Rivaux.':''));
  return ok(rip? r.n+' riposte : la bataille sera plus rude.' : 'Guerre des prix lancée.'); }
function attStep(){ const R=S.riv; if(!R||!R.att||!R.att.length) return;
  R.att=R.att.filter(a=>{ const v=R.rv[a.rival], r=rivDef(a.rival); if(!v||v.gone) return false;
    if(v.pres[a.key]) v.pres[a.key]=Math.max(0,v.pres[a.key]-.012*(a.rip?.5:1));
    if(--a.left>0&&v.pres[a.key]>.05) return true;
    v.pow=Math.max(.4,v.pow-.05*(a.rip?.5:1)); v.lost++; R.attCd=R.attCd||{}; R.attCd[a.key]=S.day+ATT_CD;
    if(!(v.pres[a.key]>.05)){ S.stats.attWin=(S.stats.attWin||0)+1; delete v.pres[a.key]; R.wars=R.wars.filter(w=>!(w.key===a.key&&w.rival===a.rival)); log('good',r.n+' abandonne le marché '+keyLabel(a.key)+' : ses enseignes ferment.'); }
    else log('info','Fin de votre guerre des prix contre '+r.n+' ('+keyLabel(a.key)+'). Sa présence sur ce marché tombe à '+fmtN(v.pres[a.key],2)+'.');
    try{ shopsSync(); }catch(e){} return false; }); }
{ const _rs=rivStep; rivStep=function(){ _rs.apply(this,arguments); attStep(); }; }

