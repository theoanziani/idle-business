/* ============================================================
   CONSTRUCTION, DIRECTEURS SPÉCIALISÉS, DIRECTEURS DE SITE
   ============================================================ */
function bldExtra(bd){
  const h=bldHeld(bd.id); if(!h) return '';
  const c=consOf(bd.id);
  if(c) return '<div class="notice info">Chantier : '+D.PLANS[c.k].n+', livraison le '+dateL(c.end)+'.</div>';
  if(bd.t==='land'&&h.st==='own'&&!(h.biz&&S.biz.some(b=>b.id===h.biz))) return '<div>'+btn('Construire sur ce terrain','plansopen',{c:'sm',i:bd.id})+'</div>';
  if(bd.t==='home'){ const P=D.PLANS[bd.plan]||D.PLANS.villa; return '<div class="row sp"><span class="sub">'+(h.lease?'Loué : +'+eur(bldValue(bd.id)*0.045/360,0)+' / j, prestige +'+P.pr/2:'Habité : prestige +'+P.pr+'. Location possible : +'+eur(bldValue(bd.id)*0.045/360,0)+' / j')+'</span>'+btn(h.lease?'Arrêter la location':'Louer','lease',{c:'sm',i:bd.id,v:h.lease?0:1})+'</div>'; }
  return '';
}
function modalPlans(id){
  const bd=bldById(id); if(!bd){ ui.modal=null; return null; }
  const body='<div class="sub">'+esc(bd.addr)+' · terrain de '+fmtN(bd.surf)+' m²'+(buildCoLevel()?' · votre société de construction réduit coûts et délais':'')+'</div><div class="stack">'+
    Object.keys(D.PLANS).map(k=>{ const P=D.PLANS[k], c=planCost(bd,k);
      return '<div class="opt"><div class="row sp"><b>'+P.n+'</b><b class="num">'+eur(c,0)+'</b></div><div class="sub">'+fmtN(P.surf(bd.surf))+' m² · '+planDays(k)+' jours de chantier. '+P.txt+'</div><div>'+btn('Lancer le chantier','buildgo',{c:'sm pri',i:id,v:k,dis:availFor(D.CITIES[bd.city].ccy)<c})+'</div></div>'; }).join('')+'</div>';
  return {title:'Construire',body,sm:true};
}
function mgrCard(){
  S.mgr=S.mgr||{};
  return card('Directeurs','<div class="stack">'+Object.keys(D.MGR).map(k=>{ const M=D.MGR[k], on=mgrOn(k);
    return '<div class="stack" style="gap:6px;border-bottom:1px solid var(--line);padding-bottom:8px"><div class="row sp"><b>'+M.n+'</b></div><div class="sub">'+M.txt+'</div><div class="sub">Salaire : '+eur(M.day*progMult(),0)+' par jour.</div>'+hireRow(on,'mgr',{i:k,hire:M.hire})+'</div>'; }).join('')+'</div>');
}
function bossesCard(){
  const L=S.biz.filter(b=>b.status==='active');
  if(!L.length) return '';
  return card('Directeurs de site','<div class="stack">'+L.map(b=>{ const x=b.boss;
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div style="flex:1;min-width:150px"><b>'+(x?esc(x.name):'Poste vacant')+'</b><div class="sub">'+esc(b.name)+(x?' · G '+x.sk.ges+' · V '+x.sk.ven+' · R '+x.sk.rig:'')+'</div></div>'+(x? pill('Moral '+Math.round(x.mood),x.mood<45?'bad':x.mood<60?'warn':'good') : pill('À pourvoir','bad'))+btn('Voir','bizopen',{c:'sm ghost',i:b.id})+'</div>'; }).join('')+'</div><div class="sub">Un directeur au moral bas peut démissionner ou être débauché par un rival.</div>');
}
function bossPanel(b){
  const x=b.boss;
  let h='<div class="card"><h2>Directeur du site</h2><div class="stack">';
  if(x){
    h+='<div class="row sp"><div><b>'+esc(x.name)+'</b><div class="sub">En poste depuis le '+dateL(x.since)+' · '+eur(x.sal,0)+' / jour'+(x.tt?' · '+bossTT(x):'')+'</div></div>'+pill('Moral '+Math.round(x.mood),x.mood<45?'bad':x.mood<60?'warn':'good')+'</div>'+
      '<div class="crit">'+Object.keys(SKN).map(k=>'<div><span>'+SKN[k]+' '+x.sk[k]+'/10</span>'+bar(x.sk[k]/10,x.sk[k]<4?'r':x.sk[k]<7?'a':'g')+'</div>').join('')+'</div>'+
      '<div class="sub">Vente : ventes '+pctS(0.015*(x.sk.ven-5))+'. Gestion : fatigue de l’équipe. Rigueur : incidents. Avec l’expérience, sa compétence la plus faible gagne un point tous les 120 jours'+(x.xd!==undefined?' (prochain le '+dateL(x.xd+120)+')':'')+'.</div>'+
      '<div class="row">'+Object.keys(SKN).map(k=>btn('Former en '+SKN[k].toLowerCase()+' ('+eur(x.sal*12*x.sk[k]/5,0)+')','btrain',{c:'sm',i:b.id,v:k,dis:S.day-x.tr<30||x.sk[k]>=10,why:x.sk[k]>=10?'Compétence déjà au maximum.':'Une formation tous les 30 jours.'})).join('')+'</div>'+
      (S.day-x.tr<30?'<div class="sub">Prochaine formation dans '+(30-(S.day-x.tr))+' jours.</div>':'')+
      '<div class="row">'+btn('Augmenter de 15 %','braise',{c:'sm'})+btn(ui.tmp.bc===b.id?'Masquer les candidats':'Remplacer','bcand',{c:'sm ghost',i:b.id})+'</div>';
    { const T=S.biz.filter(o=>o!==b&&o.status==='active').sort((p,q)=>(!!p.boss-!!q.boss)); if(T.length) h+='<div class="row"><label class="sub" for="sel-mv">Muter vers</label><select class="btn sm" id="sel-mv-'+b.id+'">'+T.map(o=>'<option value="'+o.id+'">'+esc(o.name)+(o.boss?' (échange avec '+esc(o.boss.name)+')':' (poste vacant)')+'</option>').join('')+'</select><button class="btn sm" data-a="bmove" data-i="'+b.id+'">Muter</button></div>'; }
    h=h.replace("data-a=\"braise\"","data-a=\"braise\" data-i=\""+b.id+"\"");
  } else h+='<div class="notice bad">Poste vacant : ventes −4 %, plus d’incidents et de fatigue.</div>';
  if(!x||ui.tmp.bc===b.id) h+='<div class="stack">'+bossCands(b).map((c,i)=>'<div class="row sp" style="border-top:1px solid var(--line);padding-top:6px"><div><b>'+esc(c.name)+'</b><div class="sub">Gestion '+c.sk.ges+' · Vente '+c.sk.ven+' · Rigueur '+c.sk.rig+(c.tt?' · '+bossTT(c):'')+' · '+eur(c.sal,0)+' / j</div></div>'+btn('Recruter ('+eur(c.sal*10,0)+')','bhire',{c:'sm pri',i:b.id,v:i,dis:S.cash<c.sal*10})+'</div>').join('')+'</div>';
  return h+'</div></div>'+lkPanel(b);
}
function lkPanel(b){ const L=b.status==='active'?lkList(b):[]; if(!L.length) return '';
  return '<div class="card"><h2>Liens et crises</h2><div class="ht-t">'+L.map(x=>'<div class="rs-d"><div><b>'+esc(x[1])+'</b><small>'+esc(x[2])+'</small></div>'+(x[3]?pill('Crise','bad'):pill('Actif','good'))+'</div>').join('')+'</div></div>';
}
Object.assign(ACT,{
  plansopen:el=>{ ui.modal={type:'plans',id:el.dataset.i}; render(); },
  buildgo:el=>{ const r=startBuild2(el.dataset.i,el.dataset.v); if(r.ok) ui.modal=null; after(r,'Chantier lancé.'); },
  lease:el=>after(setLease(el.dataset.i,el.dataset.v==='1')),
  mgr:el=>after(setMgr(el.dataset.i,el.dataset.v==='1')),
  btrain:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(trainBoss(b,el.dataset.v)); },
  bmove:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i), sel=document.getElementById('sel-mv-'+el.dataset.i), t=sel&&S.biz.find(x=>x.id===+sel.value); after(moveBoss(b,t)); },
  braise:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(raiseBoss(b)); },
  bcand:el=>{ const id=+el.dataset.i; ui.tmp.bc=ui.tmp.bc===id?null:id; render(); },
  bhire:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); ui.tmp.bc=null; after(hireBoss(b,+el.dataset.v)); }
});
/* Estimation du bénéfice quotidien d'une activité dans un bâtiment (équipe complète, réglages standards) */
/* bénéfice net moyen observé (en part de R0) pour une activité à moteur métier jouée sans consigne : mesuré par simulation (sim_met.js, 2 parties, jours 120 à 420) */
const EST_NETK = {airline:.3, repair:.28, ecom:.2, staffing:.74, resto:.35, farm:.71, build:.26, textile:.2, electronics:.15, studio:.28, promo:.29, gallery:.37, couture:.23, renew:.49, dc:.39, park:.56, hotel:.35};
function estNet(def,bd){
  const d=D.biz[def]; if(d.startup) return null;
  if(MET[def]&&MET[def].core&&EST_NETK[def]!==undefined){ try{ const b0={id:-1, def, lvl:1, city:bd.city, dist:bd.dist, bld:bd.id, staff:{}, cf:locCostF(def,bd.city,bd.dist)}; return bizBase(b0).R0*EST_NETK[def]; }catch(e){ return null; } }
  const b={id:-1, def, lvl:1, city:bd.city, dist:bd.dist, bld:bd.id, staff:{}, pol:1, price:1, mkt:0, wk:false, mods:[], hist:[], cs:65, fat:0, stk:1, status:'active', sec:0, ins:false, cf:locCostF(def,bd.city,bd.dist), cands:{}};
  entRoles(b).forEach(([r,n])=>{ b.staff[r]={n,prod:1,rel:.85,loy:62}; });
  try{
    const pr=bizProjection(b), fe=pr.loc.fe||1; pr.rev/=fe; pr.cogs/=fe; const base=bizBase(b), up=base.up*progMult(), h=bldHeld(bd.id);
    const rent=cityOwned(bd.city)||(h&&h.st==='own')? bldRent(bd)*.3 : bldRent(bd);
    const wd=pr.rev-pr.cogs-wageBill(b,false)-up-rent, we=d.open==='always'? (pr.rev-pr.cogs)*d.wkf-wageBill(b,true)-up-rent : -up-rent;
    return (5*wd+2*we)/7;
  }catch(e){ return null; }
}
/* Licenciement : confirmation, l'embauche n'est pas remboursée. */
(function(){ const nm={setproc:()=>['Acheteur des boutiques',3000],offm:()=>['Gérant hors ligne',OFFM.hire],mgr:el=>{ const M=D.MGR[el.dataset.i]; return [M.n,M.hire]; }};
  Object.keys(nm).forEach(a=>{ const f=ACT[a]; if(!f) return; ACT[a]=el=>{ if(el.dataset.v!=='0') return f(el); const [n,h]=nm[a](el);
    ask('Licencier','Licencier : '+n+' ? Les frais d’embauche ('+eur(h,0)+') ne seront pas remboursés.','Licencier',()=>f(el)); }; });
})();

