/* ============================================================
   V2 : villes, devises, lancement par quartier, rapport de période
   ============================================================ */
const cityName = id => (D.CITIES[id]||{n:id}).n;
const secName = k => (D.SECT[k]||{n:k}).n;

/* ---------- Pile de fenêtres : le rapport d'abord, puis les paliers ---------- */
function pushModal(m){ if(!ui.mq) ui.mq=[]; if(ui.modal) ui.mq.push(m); else ui.modal=m; }
function closeModal(){ ui.modal=(ui.mq&&ui.mq.shift())||null; render(); }

/* ---------- Lancement : ville, quartier, coût ---------- */
function launchReserve(cost){ let ch=0; S.biz.forEach(b=>{ if(b.status==='active'&&b.last) ch+=Math.max(0,(b.last.rev||0)-(b.last.net||0)); });
  return Math.round((cost*.6+ch*30)/100)*100; }
function modalLaunch(id){
  const d=D.biz[id], su=d.startup, sec=bizSec(id), T=ui.tmp, inv=su? (T.inv||0) : 0;
  if(!T.lc||!D.CITIES[T.lc]||!cityUnlocked(T.lc)) T.lc='paris';
  const C=D.CITIES[T.lc];
  if(!T.ld||!C.d.some(x=>x.id===T.ld)) T.ld=bestDist(sec,C).id;
  const cost=launchCost(id,inv,T.lc,T.ld), can=availFor(C.ccy)>=cost;
  const days=su? su.ph.reduce((a,p)=>a+p[1],0) : d.launch;
  let body='<div class="sub">'+esc(d.sub)+' · '+secName(sec)+' · '+days+' jours avant l’ouverture</div>';
  if(su){
    const opts=[['Standard','Financement minimal'],['Ambitieux','Équipe renforcée, +7 points'],['Croissance','Levée massive, +14 points']];
    const od=startupOdds(id,inv);
    body+='<div class="stack"><div class="tag">Financement</div><div class="seg">'+opts.map((o,i)=>'<button class="'+(inv===i?'on':'')+'" data-a="launchlv" data-v="'+i+'">'+o[0]+'</button>').join('')+'</div><div class="sub">'+opts[inv][1]+'.</div>'+
      '<div class="row">'+pill('Succès '+Math.round(od.pS*100)+' %','good')+pill('Modeste '+Math.round(od.pM*100)+' %','')+pill('Échec '+Math.round(od.pF*100)+' %','bad')+'</div></div>';
  }
  body+='<div class="stack"><div class="tag">Ville</div><div class="chips">'+D.CITY_ORDER.filter(cityVisible).map(cid=>{ const c=D.CITIES[cid], open=cityUnlocked(cid);
    return '<button class="chip '+(cid===T.lc?'on':'')+'" data-a="lcity" data-v="'+cid+'"'+(open?'':' disabled')+'>'+esc(c.n)+'<small>'+(open? c.country : (c.parent? 'via '+D.CITIES[c.parent].n : 'dès '+eur(c.unlock,0)))+'</small></button>'; }).join('')+'</div>'+
    '<div class="sub">'+esc(C.txt)+'</div></div>';
  body+='<div class="stack"><div class="tag">Quartier</div>'+C.d.map(x=>{ const f=fitLabel(sec,x), c=launchCost(id,inv,T.lc,x.id), rf=rentFactorFor(sec,C,x);
    return '<button class="opt '+(x.id===T.ld?'on':'')+'" data-a="ldist" data-v="'+x.id+'"><div class="row sp"><b>'+esc(x.n)+'</b><span class="num"><b>'+eur(c,0)+'</b></span></div>'+
      '<div class="row">'+pill(f[0],f[1])+dots(x.crime)+'<span class="sub">Loyer '+multPct(rf)+'</span></div><div class="sub">'+esc(x.cl)+'</div></button>'; }).join('')+'</div>';
  const fs=festNext(T.lc).slice(0,3);
  if(fs.length) body+='<div class="sub">Fêtes : '+fs.map(x=>esc(x.f.n)+' ('+(x.on?'en cours':'dans '+x.in+' j')+')').join(' · ')+'</div>';
  /* V2.1.3 : réserve conseillée après le lancement (premier mois : salaires, stock, impôts) */
  { const left=availFor(C.ccy)-cost, rsv=launchReserve(cost);
    if(can&&left<rsv) body+='<div class="notice warn">Après ce lancement il vous restera '+eur(left,0)+'. Prévoyez environ '+eur(rsv,0)+' pour tenir les premiers mois (salaires, stock, impôts) : un compte à découvert pendant 14 jours mène à la faillite. Attendez un peu ou empruntez à la banque.</div>'; }
  body+='<div class="row sp">'+btn('Annuler','closemodal',{c:'ghost'})+btn('Lancer pour '+eur(cost,0),'launchgo',{c:'pri',i:id,v:inv,dis:!can})+'</div>';
  if(!can) body+='<div class="sub neg">Il manque '+eur(cost-availFor(C.ccy),0)+'.</div>';
  return {title:'Lancer : '+esc(d.n),body,sm:true};
}

/* ---------- Devises ---------- */
const CCYS=['EUR','USD','CNY','BRL'];
function vFx(){
  const T=ui.tmp; if(!T.fxf||!CCYS.includes(T.fxf)) T.fxf='EUR'; if(!T.fxt||!CCYS.includes(T.fxt)||T.fxt===T.fxf) T.fxt=CCYS.find(x=>x!==T.fxf);
  let h=head('Devises');
  h+='<div class="grid g2">'+card('Comptes','<div class="stack">'+CCYS.map(cc=>{
    const bal=balOf(cc), eq=bal*fxOf(cc), hist=cc==='EUR'? null : S.fxH[cc], ch=hist&&hist.length>1? hist[hist.length-1]/hist[0]-1 : 0;
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div><b>'+D.CCY[cc].n+'</b><div class="sub">'+(cc==='EUR'?'Monnaie de référence':'1 '+D.CCY[cc].sym+' = '+fmtN(fxOf(cc),cc==='CNY'||cc==='BRL'?3:2)+' €')+'</div></div>'+
      (hist? '<div class="fxs">'+spark(hist,70,26)+'<small class="'+cls(ch)+'">'+(ch>=0?'+':'')+fmtN(ch*100,1)+' %</small></div>' : '')+
      '<div style="text-align:right"><b class="num '+(bal<0?'neg':'')+'">'+money(cc,bal,0)+'</b>'+(cc!=='EUR'?'<div class="sub num">≈ '+eur(eq,0)+'</div>':'')+'</div></div>'; }).join('')+
    '<div class="sub">Les ventes d’une ville arrivent dans sa monnaie. Un solde local négatif est renfloué depuis vos euros, avec des frais.</div></div>')+
  card('Convertir',(function(){
    const from=T.fxf, to=T.fxt, amt=parseAmt(ui.qty.fx), pv=isFinite(amt)&&amt>0? convertPreview(from,to,amt) : null;
    const opt=cc=>'<option value="'+cc+'">'+cc+' · '+D.CCY[cc].n+'</option>';
    const sel=(id,ch,v)=>'<select class="btn sm" id="'+id+'" data-ch="'+ch+'">'+CCYS.map(cc=>opt(cc).replace('value="'+cc+'"','value="'+cc+'"'+(cc===v?' selected':''))).join('')+'</select>';
    return '<div class="stack"><div class="row"><label class="sr" for="sel-fxf">De</label>'+sel('sel-fxf','fxf',from)+'<button class="ib" data-a="fxswap" aria-label="Inverser">⇄</button><label class="sr" for="sel-fxt">Vers</label>'+sel('sel-fxt','fxt',to)+'</div>'+
      '<div class="sub">Solde disponible : <b>'+money(from,balOf(from),2)+'</b></div>'+
      '<div class="row"><label class="sr" for="in-fx">Montant</label><input class="inp w" id="in-fx" inputmode="decimal" placeholder="Montant en '+D.CCY[from].sym+'" data-q="fx" data-ch="fxamt" value="'+esc(ui.qty.fx||'')+'">'+
      [.25,.5,1].map(p=>btn(p===1?'Tout':Math.round(p*100)+' %','fxpct',{c:'sm ghost',v:p})).join('')+'</div>'+
      (pv? '<div class="mini"><div><span>Vous recevez</span><b class="num">'+money(to,pv.got,2)+'</b></div><div><span>Frais</span><b class="num">'+fmtN(pv.fee*100,2)+' %</b></div></div>' : '<div class="sub">Frais selon les monnaies et le montant.</div>')+
      '<div>'+btn('Convertir','fxgo',{c:'pri',dis:!pv})+'</div></div>'; })())+'</div>';
  const q=cnyQuota();
  h+=card('Réglages des comptes','<div class="stack"><div class="row sp"><div><b>Rapatriement automatique</b><div class="sub">Chaque lundi, vos soldes étrangers repassent en euros (frais inclus).</div></div><div class="seg"><button class="'+(!S.sweep?'on':'')+'" data-a="sweep" data-v="0">Désactivé</button><button class="'+(S.sweep?'on':'')+'" data-a="sweep" data-v="1">Activé</button></div></div>'+
    '<div><div class="row sp"><b>Plafond de capitaux à Pékin</b><span class="sub num">'+eur(q.left,0)+' restants sur '+eur(q.limit,0)+'</span></div>'+bar(q.left/q.limit)+'<div class="sub">Rapatrier des yuans est limité chaque année. Investir sur place relève le plafond.</div></div></div>');
  return h;
}
/* Valeur nette, en haut du menu Plus */
function wealthCard(){
  const t=tierNow(), cur=D.TIERS[t], nx=D.TIERS[t+1];
  const fx=CCYS.filter(cc=>cc!=='EUR'&&Math.abs(S.acc[cc])>0.5);
  const inv=S.nw-S.cash, f=nx? clamp((S.peakNW-cur.nw)/(nx.nw-cur.nw),0,1) : 1;
  return '<section class="wealth" aria-label="Valeur nette">'+
    '<div class="w-top"><span>Valeur nette</span><span class="w-tier">'+cur.n+'</span></div>'+
    '<b class="w-big num">'+eur(S.nw,0)+'</b>'+
    (nx? '<div class="w-bar" role="progressbar" aria-valuenow="'+Math.round(f*100)+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+(f*100).toFixed(1)+'%"></i></div><div class="w-next">'+Math.round(f*100)+' % vers '+nx.n+' ('+eur(nx.nw,0)+')</div>' : '<div class="w-next">Palier maximal atteint</div>')+
    '<div class="w-split"><div><span>Trésorerie</span><b class="num">'+eur(S.cash,0)+'</b></div><div><span>Investi</span><b class="num">'+eur(inv,0)+'</b></div>'+
    '</div>'+
  '</section>';
}

/* ---------- Rapport de période ---------- */
const RPB={global:'Résultat global',biz:'Par société',journal:'Journal',fest:'Fêtes et événements',alerts:'Alertes',fx:'Villes'};
const RPDEF={order:['global','biz','journal','fest','alerts','fx'],off:{fest:1,alerts:1,fx:1},skip1:false};
function rpPrefs(){
  let p=ui.rp; if(!p||!Array.isArray(p.order)) p=ui.rp=JSON.parse(JSON.stringify(RPDEF));
  p.order=p.order.filter((k,i,a)=>RPB[k]&&a.indexOf(k)===i); Object.keys(RPB).forEach(k=>{ if(!p.order.includes(k)) p.order.push(k); });
  p.off=p.off||{}; return p;
}
function rpTitle(s){ return s.days===1? 'Rapport du '+dateL(s.d1) : 'Rapport · '+s.days+' jours'; }
const RPR={
  global:s=>{
    const oth=s.other.reduce((a,x)=>a+x.net,0);
    return '<div class="mini"><div><span>Ventes brutes</span><b class="num">'+eur(s.rev,0)+'</b></div><div><span>Dépenses</span><b class="num neg">'+eur(s.exp,0)+'</b></div><div><span>Résultat net</span><b class="num '+cls(s.net)+'">'+signed(s.net,0)+'</b></div><div><span>Valeur nette</span><b class="num '+cls(s.nw1-s.nw0)+'">'+signed(s.nw1-s.nw0,0)+'</b></div></div>'+
      (Math.abs(oth)>1?'<div class="sub">Hors sociétés (impôts, intérêts, marchés) : <b class="num '+cls(oth)+'">'+signed(oth,0)+'</b></div>':'');
  },
  biz:s=>!s.rows.length? '<div class="sub">Aucune société en activité.</div>' :
    '<div class="tw"><table class="tbl"><thead><tr><th>Société</th><th class="r">Ventes</th><th class="r">Dépenses</th><th class="r">Net</th></tr></thead><tbody>'+
      s.rows.map(r=>'<tr><td><b>'+esc(r.name)+'</b><div class="sub">'+esc(cityName(r.city))+'</div></td><td class="r num">'+eur(r.rev,0)+'</td><td class="r num neg">'+eur(r.exp,0)+'</td><td class="r num '+cls(r.net)+'">'+signed(r.net,0)+'</td></tr>').join('')+
    '</tbody><tfoot><tr><td><b>Total</b></td><td class="r num"><b>'+eur(s.rev,0)+'</b></td><td class="r num neg"><b>'+eur(s.exp,0)+'</b></td><td class="r num '+cls(s.net)+'"><b>'+signed(s.net,0)+'</b></td></tr></tfoot></table></div>',
  journal:s=>{ const mine=s.journal.filter(x=>x.k!=='news'), j=mine.slice(-10).concat(s.journal.filter(x=>x.k==='news').slice(-Math.max(0,10-Math.min(10,mine.length)))).sort((x,y)=>(y.d-x.d)||((x.k==='news')-(y.k==='news'))); return j.length? '<div class="log">'+j.map(x=>'<div><span class="d">'+dateS(x.d)+'</span><span class="'+x.s+'">'+(x.k==='news'?'<span class="tag" style="margin-right:6px">Actu</span>':x.k==='club'?'<span class="tag" style="margin-right:6px">Club</span>':'')+esc(x.m)+'</span></div>').join('')+'</div>' : '<div class="sub">Rien à signaler.</div>'; },
  fest:s=>{
    const cities=[...new Set(S.biz.map(b=>b.city))];
    const up=[]; cities.forEach(c=>festNext(c).forEach(x=>{ if(!x.on&&x.in<=30) up.push(x); })); up.sort((a,b)=>a.in-b.in);
    const rows=s.fest.map(f=>'<div class="row sp"><span>'+esc(f.name)+' · '+esc(cityName(f.city))+'</span><span class="sub">'+f.days+' j</span></div>')
      .concat(up.slice(0,4).map(x=>'<div class="row sp"><span>'+esc(x.f.n)+' · '+esc(cityName(x.city))+'</span><span class="sub">dans '+x.in+' j</span></div>'));
    return rows.length? '<div class="stack" style="gap:6px">'+rows.join('')+'</div>' : '<div class="sub">Aucune fête en vue.</div>';
  },
  alerts:s=>s.alerts.length? '<div class="stack" style="gap:6px">'+s.alerts.map(a=>'<div class="notice '+a.k+'">'+esc(a.m)+'</div>').join('')+'</div>' : '<div class="notice good">Aucune alerte.</div>',
  fx:s=>{
    const cs=Object.keys(s.byCity);
    return (cs.length? '<div class="tw"><table class="tbl"><thead><tr><th>Ville</th><th class="r">Ventes</th><th class="r">Net</th></tr></thead><tbody>'+cs.map(c=>'<tr><td>'+esc(cityName(c))+'</td><td class="r num">'+eur(s.byCity[c].rev,0)+'</td><td class="r num '+cls(s.byCity[c].net)+'">'+signed(s.byCity[c].net,0)+'</td></tr>').join('')+'</tbody></table></div>' : '<div class="sub">Aucune ville en activité.</div>');
  }
};
function modalReport(m){
  const p=rpPrefs(), s=m.s, vis=p.order.filter(k=>!p.off[k]);
  const body=(vis.length? vis.map(k=>'<section class="rb"><h3>'+RPB[k]+'</h3>'+RPR[k](s)+'</section>').join('') : '<div class="sub">Tous les blocs sont masqués. Touchez Organiser pour les réafficher.</div>')+
    '<div class="row sp">'+btn('Organiser','rpedit',{c:'sm ghost'})+btn('Fermer','closemodal',{c:'pri'})+'</div>';
  return {title:rpTitle(s),body,sm:true};
}
function modalRpEdit(){
  const p=rpPrefs(), n=p.order.length;
  const body='<div class="sub">Choisissez les blocs affichés et leur ordre. Le rapport garde le même contenu, vous lisez ce que vous voulez.</div><div class="stack">'+
    p.order.map((k,i)=>'<div class="barit"><b>'+RPB[k]+'</b><span class="ibs"><button class="ib" data-a="rpmove" data-i="'+k+'" data-v="-1" aria-label="Monter"'+(i===0?' disabled':'')+'>↑</button><button class="ib" data-a="rpmove" data-i="'+k+'" data-v="1" aria-label="Descendre"'+(i===n-1?' disabled':'')+'>↓</button>'+
      '<button class="btn sm '+(p.off[k]?'':'pri')+'" data-a="rptog" data-i="'+k+'" style="min-width:76px">'+(p.off[k]?'Masqué':'Affiché')+'</button></span></div>').join('')+'</div>'+
    '<div class="row sp"><div><b>Après un seul jour</b><div class="sub">Le rapport de « Jour suivant » peut être ignoré.</div></div><div class="seg"><button class="'+(!p.skip1?'on':'')+'" data-a="rpskip" data-v="0">Afficher</button><button class="'+(p.skip1?'on':'')+'" data-a="rpskip" data-v="1">Ignorer</button></div></div>'+
    '<div>'+btn('Terminé','rpdone',{c:'pri'})+'</div>';
  return {title:'Organiser le rapport',body,sm:true};
}
function saveRp(){ saveUI(); }
Object.assign(ACT,{
  citygo:el=>{ ui.bz={c:el.dataset.i,d:null}; ui.tab='biz'; window.scrollTo(0,0); render(); saveUI(); },
  lcity:el=>{ ui.tmp.lc=el.dataset.v; ui.tmp.ld=null; render(); },
  ldist:el=>{ ui.tmp.ld=el.dataset.v; render(); },
  fxswap:()=>{ const a=ui.tmp.fxf; ui.tmp.fxf=ui.tmp.fxt; ui.tmp.fxt=a; ui.qty.fx=''; render(); },
  fxpct:el=>{ const b=balOf(ui.tmp.fxf); ui.qty.fx=String(Math.floor(Math.max(0,b)*+el.dataset.v*100)/100); render(); },
  fxgo:()=>{ const a=readIn('in-fx'); const r=convertCcy(ui.tmp.fxf,ui.tmp.fxt,a); if(r.ok) ui.qty.fx=''; after(r); },
  sweep:el=>{ S.sweep=el.dataset.v==='1'; after(); },
  rpedit:()=>{ ui.prevRpt=ui.modal&&ui.modal.type==='report'? ui.modal : null; ui.modal={type:'rpedit'}; render(); },
  rpdone:()=>{ ui.modal=ui.prevRpt||null; ui.prevRpt=null; render(); },
  rptog:el=>{ const p=rpPrefs(); p.off[el.dataset.i]=p.off[el.dataset.i]?0:1; saveRp(); render(); },
  rpmove:el=>{ const p=rpPrefs(), k=el.dataset.i, i=p.order.indexOf(k), j=i+(+el.dataset.v); if(j<0||j>=p.order.length) return; p.order.splice(i,1); p.order.splice(j,0,k); saveRp(); render(); },
  rpskip:el=>{ rpPrefs().skip1=el.dataset.v==='1'; saveRp(); render(); },
  setsec:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setSec(b,+el.dataset.v); after(); },
  setauto:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setAuto(b,el.dataset.v==='1'); after(); },
  orderstk:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(orderStock(b)); },
  sethrs:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setHrs(b,+el.dataset.v); after(); },
  upeq:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(upgradeEq(b)); },
  train:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(trainTeam(b)); },
  rvreply:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b) after(rvReply(b)); },
  rvprice:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b&&!isFact(b)){ setPrice(b,Math.round((b.price-0.05)*100)/100); after(ok('Prix baissés de 5 % : les clients le verront dans les prochains avis.')); } },
  rvpromo:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b) after(rvPromo(b)); },
  trainall:()=>after(trainAll()),
  sethc:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setHc(b,el.dataset.v==='1'); after(); },
  setproc:el=>after(setProc(el.dataset.v==='1')),
  ncbuy:el=>{ const k=el.dataset.i; ask('Contrat de non-concurrence','Les rivaux quittent le marché « '+esc(keyLabel(k))+' » pendant 90 jours (pas de guerre des prix ni de débauchage). Coût : <b>'+eur(ncPrice(k),0)+'</b>.','Signer',()=>after(buyNC(k))); },
  setpq:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b) b.pq=clamp(+el.dataset.v|0,0,2); after(); },
  setstk:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setStk(b,+el.dataset.v); after(); },
  hrup:()=>after(hrUpgrade(),'Service RH amélioré.'),
  buyprem:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); const c=Math.max(0,premPrice(b)-premValue(b)); ask('Acheter les locaux','Les locaux de <b>'+esc(b.name)+'</b> coûtent <b>'+eur(c,0)+'</b>. Le loyer baisse de 70 % et le bien suit le marché immobilier.','Acheter',()=>after(buyPremises(b),'Locaux achetés.')); },
  setins:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setIns(b,el.dataset.v==='1'); after(); }
});
Object.assign(CH,{
  fxf:el=>{ ui.tmp.fxf=el.value; if(ui.tmp.fxt===el.value) ui.tmp.fxt=CCYS.find(x=>x!==el.value); ui.qty.fx=''; render(); },
  fxt:el=>{ ui.tmp.fxt=el.value; if(ui.tmp.fxf===el.value) ui.tmp.fxf=CCYS.find(x=>x!==el.value); render(); },
  fxamt:el=>{ ui.qty.fx=el.value; render(); }
});

