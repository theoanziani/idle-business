/* ============================================================
   JEU PLUS INTUITIF (V1.1.4)
   1. « Créer une société » : domaines du moins cher au plus cher (non débloqués grisés),
      puis les bâtiments libres qui peuvent l'accueillir, puis le nom.
   2. Fil d'Ariane dans Sociétés : Villes › Ville › Quartier.
   3. Boutons « ? » : une phrase d'explication sur les mots du jeu (GLOSS).
   4. Guide de début en chapitres (GUIDE), qui remplace la liste « Premiers pas ».
   ============================================================ */
/* ---------- 1. Créer une société ---------- */
function nbDefs(){ return D.bizOrder.slice().sort((a,b)=>D.biz[a].cost-D.biz[b].cost); }
function nbBlds(def){ const out=[], sec=bizSec(def);
  D.CITY_ORDER.filter(c=>D.CITIES[c]&&cityUnlocked(c)).forEach(cid=>D.CITIES[cid].d.forEach(dd=>bldList(cid,dd.id).forEach(bd=>{
    if(bd.t==='home'||!bldMaxLvl(bd,def)) return; const h=bldHeld(bd.id); if(h&&h.biz&&S.biz.some(x=>x.id===h.biz)) return; if(rivShopAt(bd.id)||consOf(bd.id)) return;
    const f=fitLabel(sec,dd), fit=f[0]==='Idéal'?3:f[0]==='Bon choix'?2:f[0]==='Correct'?1:0;
    const free=cityOwned(cid)||!!h, rent=free&&(cityOwned(cid)||h.st==='own')? 0 : bldRent(bd), need=(free?0:bldRent(bd)*30)+launchCost(def,0,cid,dd.id);
    out.push({bd, dd, h, f, fit, mx:bldMaxLvl(bd,def), rent, can:availFor(D.CITIES[cid].ccy)>=need}); })));
  return out.sort((x,y)=>(!!y.h-!!x.h)||(y.can-x.can)||(y.fit-x.fit)||(x.rent-y.rent)||(y.mx-x.mx)).slice(0,14); }
function modalNewBiz(m){
  if(!m.def){
    const body='<div class="sub">Du moins cher au plus cher à lancer. Les activités grisées se débloquent avec votre patrimoine.</div><div class="stack">'+nbDefs().map(k=>{ const d=D.biz[k], lock=!unlocked(d.tier);
      return '<button class="nb-row'+(lock?' lock':'')+'" data-a="nbdef" data-v="'+k+'"'+(lock?' aria-disabled="true"':'')+'>'+bizIco(k)+'<span><b>'+esc(d.n)+'</b><small>'+esc(d.sub)+(lock?' · palier '+D.TIERS[d.tier].n:'')+'</small></span><em class="num">'+eur(d.cost,0)+'</em></button>'; }).join('')+'</div>';
    return {title:'Créer une société', sm:true, body}; }
  const d=D.biz[m.def], L=nbBlds(m.def);
  let body='<button class="back" data-a="nbback">‹ Tous les domaines</button><div class="sub">'+esc(d.sub)+'. Les bâtiments libres qui peuvent l’accueillir, les plus adaptés d’abord.</div>';
  body+= L.length? '<div class="stack">'+L.map(x=>{ const C=D.CITIES[x.bd.city], est=estNet(m.def,x.bd), dep=x.h||cityOwned(x.bd.city)? 0 : bldRent(x.bd)*30;
      return '<div class="ga-lot"><div class="row sp"><div><b>'+esc(x.bd.addr)+'</b><small>'+esc(C.n)+' · '+esc(x.dd.n)+' · '+D.BT[x.bd.t].n+' de '+fmtN(x.bd.surf)+' m² · jusqu’au niveau '+x.mx+'</small></div></div>'+
        '<div class="row sp"><span class="row">'+pill(x.f[0],x.f[1])+(est!==null&&est!==undefined?pill('≈ '+signed(est,0)+' / j',est>0?'good':'bad'):'')+'</span><span class="sub">'+(x.h?'Déjà à vous':cityOwned(x.bd.city)?'Ville à vous':'Loyer '+money(C.ccy,x.rent/fxOf(C.ccy),0)+' / j · dépôt '+money(C.ccy,dep/fxOf(C.ccy),0))+'</span></div>'+
        '<div class="row">'+(x.can? btn('Choisir ce bâtiment','nbbld',{c:'sm pri',i:x.bd.id,j:m.def}) : '<span class="sub">Trésorerie insuffisante (dépôt et lancement)</span>')+'</div></div>'; }).join('')+'</div>'
    : '<div class="notice info">Aucun bâtiment libre ne peut accueillir cette activité dans vos villes. Ouvrez une autre ville ou libérez un bâtiment.</div>';
  return {title:esc(d.n), sm:true, body}; }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(m&&m.type==='newbiz') return modalNewBiz(m); return _mc(); }; }
ACT.newbiz=()=>{ ui.modal={type:'newbiz', def:null}; render(); };
ACT.nbdef=el=>{ const k=el.dataset.v, d=D.biz[k]; if(!d) return; if(!unlocked(d.tier)){ toast('Palier « '+D.TIERS[d.tier].n+' » requis pour cette activité.','bad'); return; } ui.modal={type:'newbiz', def:k}; render(); };
ACT.nbback=()=>{ ui.modal={type:'newbiz', def:null}; render(); };
ACT.nbbld=el=>{ const id=el.dataset.i, def=el.dataset.j, bd=bldById(id); if(!bd) return;
  if(!bldHeld(id)){ const r=rentBuilding(id); if(!r.ok){ res(r); return; } }
  bzNameOpen({kind:'est', def, inv:0, bld:id, city:bd.city, dist:bd.dist}); };
/* la tuile « Créer une société » de l'accueil ouvre ce parcours */
{ const _vh=VIEWS.home; VIEWS.home=function(){ return _vh.apply(this,arguments).replace('<button class="btile add" data-a="tab" data-i="biz">','<button class="btile add" data-a="newbiz">'); }; }

/* ---------- 2. Fil d'Ariane dans Sociétés ---------- */
function crumb(parts){ return '<nav class="crumb" aria-label="Fil d’Ariane">'+parts.map((p,i)=>i<parts.length-1? '<button data-a="bzback" data-v="'+p[1]+'">'+esc(p[0])+'</button><span aria-hidden="true">›</span>' : '<b>'+esc(p[0])+'</b>').join('')+'</nav>'; }
{ const _vc=vBizCity; vBizCity=function(cid){ return _vc(cid).replace(/<button class="back" data-a="bzback" data-v="0">[^<]*<\/button>/, crumb([['Villes',0],[D.CITIES[cid].n,'']])); }; }
{ const _vd=vBizDist; vBizDist=function(cid,did){ const dd=D.CITIES[cid].d.find(x=>x.id===did); return _vd(cid,did).replace(/<button class="back" data-a="bzback" data-v="1">[^<]*<\/button>/, crumb([['Villes',0],[D.CITIES[cid].n,1],[dd?dd.n:'',''] ])); }; }

/* ---------- 3. Boutons « ? » ---------- */
const GLOSS = {
  'Pilotage du métier':'Les décisions propres à cette activité. Elles remplacent le prix et le marketing génériques.',
  'Délégation au directeur du site':'« Je gère » : vous décidez tout. « Assisté » : le directeur fait le quotidien. « Délégation totale » : il investit aussi, avec un budget pris sur les bénéfices.',
  'Maîtrise':'Elle monte à mesure que la société gagne de l’argent et débloque les 5 paliers de l’activité.',
  'Satisfaction des clients':'Prix, service, qualité et adresse. Elle fait monter ou baisser les ventes, lentement.',
  'Fatigue de l’équipe':'Elle monte quand des postes manquent, en heures supplémentaires ou le week-end. Au-delà de 30, les ventes baissent.',
  'Stock de marchandises':'Le stock de secours : il permet de continuer à vendre pendant une pénurie chez les fournisseurs.',
  'Ce qui fait vos ventes':'Chaque ligne montre de combien un facteur fait varier vos ventes par rapport à la normale.',
  'Directeur du site':'Il dirige la société. Ses notes de gestion, vente et rigueur jouent sur la fatigue, les ventes et les incidents. Son moral dépend de son salaire.',
  'Équipe':'Productivité sur 100 (60 = profil moyen), fiabilité en % et fidélité sur 100. Une bonne équipe vend plus et part moins souvent.',
  'Réputation':'Votre image auprès du public : elle aide toutes vos sociétés et vos offres de rachat.',
  'Valeur nette':'Tout ce que vous possédez (trésorerie, sociétés, biens, placements) moins vos dettes. Elle débloque les paliers de richesse.',
  'Sécurité et assurance':'Contre les vols et les incidents. Le quartier fixe le niveau de risque.',
  'Grand livre':'Revenus, dépenses et résultat net de chaque source depuis les derniers impôts.',
  'Politique salariale':'Salaires de l’équipe par rapport au marché. Au-dessus de 100 %, qualité, fidélité et moral montent ; en dessous, ils baissent. Qualité maximale à partir de 115 %, avec un produit Premium quand l’activité le propose.',
  'Service RH':'Chaque jour, il pourvoit les postes vacants dès qu’un candidat respecte vos critères minimaux, limite la fatigue et peut soutenir le moral des directeurs.'
};
function glossApply(){ const root=document.getElementById('app')||document.body; if(!root) return;
  root.querySelectorAll('h2, h3, .met-c > b, .kpi > span, .row.sp > b').forEach(h=>{ if(h.querySelector('.qm')) return; const t=h.textContent.trim(); const k=Object.keys(GLOSS).find(x=>t===x||t.startsWith(x+' :')); if(!k) return;
    const q=document.createElement('button'); q.className='qm'; q.type='button'; q.setAttribute('data-a','gloss'); q.setAttribute('data-v',k); q.setAttribute('aria-label','Explication : '+k); q.textContent='?'; h.appendChild(q); });
  const md=document.querySelector('.md'); if(md) md.querySelectorAll('h2, h3, .met-c > b, .row.sp > b').forEach(h=>{ if(h.querySelector('.qm')) return; const t=h.textContent.trim(); const k=Object.keys(GLOSS).find(x=>t===x||t.startsWith(x+' :')); if(!k) return;
    const q=document.createElement('button'); q.className='qm'; q.type='button'; q.setAttribute('data-a','gloss'); q.setAttribute('data-v',k); q.setAttribute('aria-label','Explication : '+k); q.textContent='?'; h.appendChild(q); }); }
ACT.gloss=el=>{ const k=el.dataset.v; if(GLOSS[k]) toast(k+' : '+GLOSS[k],'info'); };
{ const _r=render; render=function(){ const o=_r.apply(this,arguments); try{ glossApply(); }catch(e){} return o; }; }

/* ---------- 4. Guide en chapitres ---------- */
const GUIDE = [
  {t:'Premiers pas', s:[
    {t:'Créer une société', d:'Sur l’accueil, « Créer une société » propose les activités du moins cher au plus cher, puis les bâtiments libres.', ok:()=>S.biz.length>0, go:['newbiz']},
    {t:'Passer au jour suivant', d:'Chaque jour encaisse les ventes et paie les charges. Un rapport résume la journée.', ok:()=>S.day>1&&S.biz.length>0}]},
  {t:'L’équipe', s:[
    {t:'Recruter un salarié', d:'Dans la fiche, onglet Équipe, touchez « Recruter » : comparez productivité, fiabilité et fidélité avant d’embaucher.', ok:()=>!!S.tut.hired},
    {t:'Former l’équipe', d:'« Former » (onglet Équipe) augmente la productivité et la fidélité de tous, une fois tous les 20 jours.', ok:()=>!!S.tut.trained}]},
  {t:'Le métier', s:[
    {t:'Régler le métier', d:'Onglet Métier : chaque activité a ses propres décisions (carte, prix, projets, ventes…). Faites un premier réglage.', ok:()=>!!S.tut.met},
    {t:'Passer un palier', d:'La maîtrise monte avec les bénéfices et débloque des paliers : de nouvelles possibilités pour l’activité.', ok:()=>S.biz.some(b=>typeof mxRank==='function'&&mxRank(b)>=1)}]},
  {t:'La délégation', s:[
    {t:'Confier la société au directeur', d:'Onglet Métier, « Délégation » : en « Assisté », le directeur gère le quotidien à votre place.', ok:()=>S.biz.some(b=>b.dl&&b.dl!=='me')},
    {t:'Laisser le directeur investir', d:'En « Délégation totale », il met de côté une part des bénéfices et achète lui-même : améliorations du métier, puis agrandissement, déménagement si le bâtiment est trop petit. « Priorité du groupe » l’aide à finir un gros achat avec la trésorerie générale.', ok:()=>S.biz.some(b=>b.dl==='full')},
    {t:'Suivre vos directeurs', d:'Dans Sociétés, la carte « Délégation » montre l’achat visé, la réserve et le moral de chaque directeur. Sous 35 de moral, il risque de partir.', ok:()=>S.biz.filter(b=>b.dl&&b.dl!=='me').length>=2}]},
  {t:'Grandir', s:[
    {t:'Améliorer une société', d:'« Améliorer » agrandit la société : plus de clients et de revenus. Au niveau maximal du bâtiment, déménagez (onglet Finances).', ok:()=>S.biz.some(b=>b.lvl>=2||b.up)},
    {t:'Ouvrir une deuxième société', d:'Attendez d’avoir le prix de la société plus une réserve, indiquée dans la fenêtre de lancement : un compte à découvert pendant 14 jours, c’est la faillite.', ok:()=>S.biz.length>=2, go:['newbiz']}]},
  {t:'La finance', s:[
    {t:'Placer de l’argent', d:'Dans Marchés, le livret rapporte sans risque ; la bourse et les obligations rapportent plus, avec du risque.', ok:()=>(S.livret&&S.livret.bal>0)||!!S.tut.inv, go:['tab','markets']},
    {t:'Consulter le grand livre', d:'Revenus, dépenses et net de chaque société depuis les derniers impôts (menu Plus, Comptes).', ok:()=>!!S.tut.gl}]},
  {t:'Le club', s:[
    {t:'Racheter un club de football', d:'Le but ultime : un club coûte une fortune. Dans Football, choisissez un club et faites une offre quand vous en aurez les moyens.', ok:()=>!!(S.foot&&S.foot.own), go:['tab','foot']}]}
];
function guideState(){ let done=0, tot=0, cur=null, ci=-1; GUIDE.forEach((c,i)=>c.s.forEach(st=>{ tot++; const k=st.ok(); if(k) done++; else if(!cur){ cur=st; ci=i; } })); return {done, tot, cur, ci}; }
tutCard=function(){
  if(!tutOn()) return ''; const G=guideState(); if(!G.cur){ S.tut.off=true; S.tut.fin=S.day; return ''; }
  const C=GUIDE[G.ci];
  return card('Guide · chapitre '+(G.ci+1)+' sur '+GUIDE.length+' : '+C.t,'<div class="stack">'+bar(G.done/G.tot,'g')+
    C.s.map(st=>{ const ok=st.ok(), now=st===G.cur; return '<div class="tut'+(ok?' ok':'')+(now?' now':'')+'"><span class="ck">'+(ok?'✓':'')+'</span><div><b>'+st.t+'</b>'+(now?'<div class="sub">'+st.d+'</div>':'')+'</div>'+(now&&st.go?btn('Y aller',st.go[0],{c:'sm pri',i:st.go[1]||''}):'')+'</div>'; }).join('')+
    '<div class="row sp"><span class="sub">'+G.done+' étapes sur '+G.tot+'</span>'+btn('Masquer le guide','tutoff',{c:'sm ghost'})+'</div></div>');
};
/* suivi des étapes */
{ const _h=hire; hire=function(){ const r=_h.apply(this,arguments); if(r&&r.ok&&S.tut) S.tut.hired=1; return r; }; }
{ const _ah=agencyHire; agencyHire=function(){ const r=_ah.apply(this,arguments); if(r&&r.ok&&S.tut) S.tut.hired=1; return r; }; }
{ const _tt=trainTeam; trainTeam=function(){ const r=_tt.apply(this,arguments); if(r&&r.ok&&S.tut) S.tut.trained=1; return r; }; }
{ const _ma=metAct; metAct=function(){ const r=_ma.apply(this,arguments); if(r&&r.ok&&S.tut) S.tut.met=1; return r; }; }
{ const _vb=VIEWS.books; VIEWS.books=function(){ if(S&&S.tut) S.tut.gl=1; return _vb.apply(this,arguments); }; }

