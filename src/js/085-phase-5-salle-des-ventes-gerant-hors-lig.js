/* ============================================================
   PHASE 5 : salle des ventes, gérant hors ligne, défi des 100 jours
   ============================================================ */
function vAuction(){
  const A=aucInit(), sc=aucScale();
  let h=head('Salle des ventes');
  const lots=A.lots.filter(l=>!l.seller), mine=A.lots.filter(l=>l.seller);
  h+=card('Enchères en cours', lots.length? '<div class="grid">'+lots.map(l=>{ const nx=l.cur+lotStep(l), lead=l.lead==='me';
    return '<div class="opt'+(lead?' on':'')+'"><div class="row sp"><b>'+esc(l.n)+'</b>'+pill(RAR[l.rar][0],RAR[l.rar][2])+'</div>'+
      '<div class="row sp"><span class="sub">Estimation '+eur(l.est,0)+'</span><span class="sub">Fin dans '+Math.max(0,l.end-S.day)+' j</span></div>'+
      '<div class="row sp"><div><div class="tag">Enchère actuelle</div><b class="num">'+eur(l.cur,0)+'</b> '+(lead?pill('Vous menez','good'):pill('Un collectionneur mène',''))+'</div>'+
      (lead? '' : btn('Enchérir '+eur(nx,0),'bid',{c:'sm pri',i:l.id,dis:S.cash<nx*1.05,why:'Trésorerie insuffisante : il faut '+eur(nx*1.05,0)+' (offre et frais compris).'}))+'</div></div>'; }).join('')+'</div><div class="sub">Les collectionneurs IA surenchérissent chaque jour jusqu’à leur limite. Frais de 5 % pour l’acheteur.</div>' : '<div class="sub">Nouveaux lots chaque semaine.</div>');
  h+=card('Lots mystères','<div class="stack"><div class="sub">Un objet tiré au hasard : la valeur peut être bien plus basse ou bien plus haute que le prix.</div><div class="row">'+
    [['Petit',1],['Moyen',4],['Grand',15]].map((x,k)=>btn(x[0]+' : '+eur(Math.round(sc*x[1]/100)*100,0),'mystery',{c:'sm',v:k,dis:S.cash<sc*x[1]})).join('')+'</div></div>');
  h+=card('Ma collection ('+A.coll.length+')', A.coll.length? '<div class="stack">'+A.coll.map(it=>{ const v=collVal(it), sel=mine.find(l=>l.cid===it.id);
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:170px"><b>'+esc(it.n)+'</b> '+pill(RAR[it.rar][0],RAR[it.rar][2])+'<div class="sub">Valeur '+eur(v,0)+(it.paid?' · payé '+eur(it.paid,0):'')+(sel?' · aux enchères : '+eur(sel.cur,0)+', fin dans '+Math.max(0,sel.end-S.day)+' j':'')+'</div></div>'+
      (sel? '' : btn('Mettre aux enchères','collsell',{c:'sm',i:it.id}))+'</div>'; }).join('')+'</div><div class="sub">Chaque objet donne du prestige. Vente en 5 jours, commission de 10 %.</div>' : '<div class="sub">Aucun objet pour l’instant.</div>');
  return h;
}
function offmCard(){
  const on=S.offm&&S.offm.on;
  return card('Gérant hors ligne','<div class="stack"><div class="sub">Quand vous revenez dans le jeu, il a fait tourner vos sociétés : un jour par heure d’absence, '+OFFM.max+' jours au plus. Vous choisissez à votre retour d’encaisser ces jours ou non. Salaire : '+eur(OFFM.day*progMult(),0)+' par jour.</div>'+hireRow(!!on,'offm',{hire:OFFM.hire})+'</div>');
}
function modalOffline(n){
  return {title:'Bon retour',sm:true,body:'<p style="margin:0">Pendant votre absence, votre gérant peut faire tourner vos sociétés pendant <b>'+plu(n,'jour')+'</b>. Vous recevrez le rapport de la période.</p><div class="row sp">'+btn('Plus tard','closemodal',{c:'ghost'})+btn('Lancer '+plu(n,'jour')+'','offmgo',{c:'pri',v:n})+'</div>'};
}
function d100Card(){
  if(S.mode!=='d100'||!S.d100) return '';
  const B=d100Board(), left=Math.max(0,100-S.day+1);
  return card('Défi des 100 jours'+(S.d100.done?' : terminé':' : '+plu(left,'jour')+' restants'),'<div class="stack">'+B.map((x,i)=>'<div class="row sp" style="'+(x.me?'font-weight:700':'')+'"><span>'+(i+1)+'. '+esc(x.n)+'</span><span class="num '+cls(x.v)+'">'+signed(x.v,0)+'</span></div>').join('')+'<div class="sub">Classement au bénéfice : valeur nette gagnée depuis le départ.</div></div>');
}
function modalD100(){
  const B=d100Board(), r=S.d100.rank;
  return {title:'Fin du défi',sm:true,body:'<div class="notice '+(r===1?'good':'info')+'">'+(r===1?'Vous terminez premier !':'Vous terminez '+r+'e sur 4.')+'</div>'+B.map((x,i)=>'<div class="row sp" style="'+(x.me?'font-weight:700':'')+'"><span>'+(i+1)+'. '+esc(x.n)+'</span><span class="num">'+signed(x.v,0)+'</span></div>').join('')+'<div class="sub">La partie continue sans limite de temps.</div><div>'+btn('Continuer','closemodal',{c:'pri'})+'</div>'};
}
Object.assign(ACT,{
  bid:el=>after(bidLot(+el.dataset.i)),
  mystery:el=>after(mysteryBox(+el.dataset.v)),
  collsell:el=>after(sellColl(+el.dataset.i)),
  luxrent:el=>after(setLuxRent(el.dataset.i,el.dataset.v==='1')),
  offm:el=>after(offmHire(el.dataset.v==='1')),
  offmgo:el=>{ const n=+el.dataset.v; ui.modal=null; S.seen=Date.now(); ui.offRun=1; try{ doNext(n); } finally{ ui.offRun=0; } }
});

/* V1.6.3 : résumé de l’absence en tête du rapport du gérant hors ligne */
const _rptSumOff=rptSummary;
rptSummary=function(){ const s=_rptSumOff(); if(s&&ui.offRun) s.off=1; return s; };
function offSumHtml(s){
  const win=s.rows.filter(r=>r.net>0).slice(0,5), lose=s.rows.filter(r=>r.net<0);
  return '<section class="rb"><h3>Pendant votre absence</h3><div class="sub">Votre gérant a fait tourner vos sociétés '+s.days+' jour'+(s.days>1?'s':'')+', du '+dateL(s.d0)+' au '+dateL(s.d1)+'.</div>'+
    '<div class="row sp"><span>Résultat des sociétés</span><b class="num '+cls(s.net)+'">'+signed(s.net,0)+'</b></div>'+
    '<div class="row sp"><span>Valeur nette</span><b class="num '+cls(s.nw1-s.nw0)+'">'+signed(s.nw1-s.nw0,0)+'</b></div>'+
    (win.length? '<div class="flist">'+win.map(r=>'<div><span><b>'+esc(r.name)+'</b><small>'+esc(cityName(r.city))+'</small></span><span class="num pos">'+signed(r.net,0)+'</span></div>').join('')+'</div>' : '')+
    (lose.length? '<div class="sub">'+lose.length+' société'+(lose.length>1?'s':'')+' en perte : '+signed(lose.reduce((a,r)=>a+r.net,0),0)+'.</div>' : '')+'</section>';
}
const _mRepOff=modalReport;
modalReport=function(m){ const r=_mRepOff(m); if(m.s&&m.s.off) r.body=offSumHtml(m.s)+r.body; return r; };

