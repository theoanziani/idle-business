/* ============================================================
   VUES : tableau de bord, sociétés
   ============================================================ */
const CATCOL=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)','var(--c6)','var(--c7)','var(--c8)','var(--c9)'];
function head(t,p,right){ return '<div class="ph"><div><h1>'+t+'</h1></div>'+(right?'<div class="row">'+right+'</div>':'')+'</div>'; }

function bizStatus(b){
  const d=bizDef(b);
  if(b.status==='build'){
    if(d.startup){ const ph=bizPhase(b); return pill('Phase : '+ph.name+' · '+ph.left+' j','info'); }
    return pill('Mise en route · '+Math.max(0,b.since+b.t-S.day)+' j','info');
  }
  if(b.closedUntil>=S.day) return pill('Fermée (incident)','bad');
  if(b.up) return pill('Agrandissement · '+b.up.t+' j','info');
  if(isWE(S.day) && d.open!=='always' && !b.wk) return pill('Fermée (week-end)','');
  return pill('Ouverte','good');
}
function vHomeOld(){
  const t=tierNow(), nx=D.TIERS[t+1];
  let h=head('Tableau de bord',D.DAYS[wdOf(S.day)]+' '+dateL(S.day)+'. Décidez, puis passez au jour suivant pour encaisser.');
  if(tutOn()) h+=tutCard();
  else if(!S.biz.length && S.day<15) h+='<div class="notice info">Dans Sociétés, choisissez une ville, un quartier puis un bâtiment pour établir votre première société.<div class="row" style="margin-top:8px">'+btn('Choisir une ville','tab',{c:'pri',i:'biz'})+'</div></div>';
  h+=d100Card();
  if(S.cash<0) h+='<div class="notice bad"><b>Compte à découvert.</b> Faillite au bout de 14 jours : vendez un actif ou empruntez.</div>';
  /* valeur nette */
  const bd=nwBreakdown(); const pos=Object.entries(bd).filter(e=>e[1]>0.5); const tot=pos.reduce((a,e)=>a+e[1],0)||1;
  const hist=S.nwH; const step=S.nwStep||1;
  const nwCard=card('Valeur nette',
    '<div class="row sp" style="align-items:baseline"><b class="num" style="font-size:26px">'+eur(S.nw)+'</b><span class="sub">Départ : '+eur(S.startCap)+' · pic : '+eur(S.peakNW)+'</span></div>'+
    lineChart(hist,{x0:dateS(1),x1:dateS(S.day),label:'Évolution de la valeur nette'})+
    '<div class="stk" style="margin:8px 0 6px">'+pos.map((e,i)=>'<i style="width:'+(e[1]/tot*100).toFixed(2)+'%;background:'+CATCOL[i%9]+'" title="'+e[0]+'"></i>').join('')+'</div>'+
    '<div class="legend">'+pos.map((e,i)=>'<span><i style="background:'+CATCOL[i%9]+'"></i>'+e[0]+' '+eur(e[1])+'</span>').join('')+(bd.Dettes<0?'<span class="neg">Dettes '+eur(bd.Dettes)+'</span>':'')+'</div>');
  /* bilan */
  const fl=S.flLast||{}; const rows=Object.entries(fl).map(([k,v])=>({k,in:v.in,out:v.out,net:v.in-v.out})).sort((a,b)=>Math.abs(b.net)-Math.abs(a.net));
  const tin=rows.reduce((a,r)=>a+r.in,0), tout=rows.reduce((a,r)=>a+r.out,0);
  const flCard=card('Bilan du '+(S.flLastDay? dateL(S.flLastDay) : 'jour'),
    rows.length? '<div class="tw"><table class="tbl"><thead><tr><th>Source</th><th class="r">Entrées</th><th class="r">Sorties</th><th class="r">Net</th></tr></thead><tbody>'+
      rows.slice(0,12).map(r=>'<tr><td>'+esc(srcName(r.k))+'</td><td class="r num">'+(r.in?eur(r.in,0):'')+'</td><td class="r num neg">'+(r.out?eur(r.out,0):'')+'</td><td class="r num '+cls(r.net)+'">'+signed(r.net,0)+'</td></tr>').join('')+
      '</tbody><tfoot><tr><td><b>Total</b></td><td class="r num"><b>'+eur(tin,0)+'</b></td><td class="r num neg"><b>'+eur(tout,0)+'</b></td><td class="r num '+cls(tin-tout)+'"><b>'+signed(tin-tout,0)+'</b></td></tr></tfoot></table></div>'+(rows.length>12?'<div class="sub">+ '+(rows.length-12)+' autres lignes dans le Livre de comptes.</div>':'')
    : '<div class="sub">Aucun flux encore.</div>', {c:'led'});
  /* agenda */
  const ev=[]; const e=taxEstimate();
  ev.push(['Échéance fiscale', dateL(S.nextTax)+' (dans '+(S.nextTax-S.day)+' j)', 'Estimation : '+eur(e.total,0)]);
  if(S.bills.length) ev.push(['Vote des lois',dateL(S.bills[0].vote)+' (dans '+(S.bills[0].vote-S.day)+' j)',S.bills.length+' projets à l’étude']);
  else if(!S.country) ev.push(['Prochain cycle législatif',dateL(Math.floor(S.day/30)*30+31),'']);
  S.biz.filter(b=>b.status==='build').forEach(b=>ev.push(['Ouverture : '+b.name,'Dans '+Math.max(0,b.since+b.t-S.day)+' j','']));
  S.biz.filter(b=>b.up).forEach(b=>ev.push(['Agrandissement : '+b.name,'Dans '+b.up.t+' j','Niveau '+b.up.to]));
  S.projects.forEach(p=>ev.push(['Chantier : '+p.name,'Dans '+p.t+' j','']));
  { const cs=[...new Set(S.biz.map(b=>b.city))], fs=[]; cs.forEach(c=>festNext(c).forEach(x=>{ if(x.on||x.in<=30) fs.push(x); })); fs.sort((a,b)=>a.in-b.in); fs.slice(0,2).forEach(x=>ev.push(['Fête : '+x.f.n+' · '+cityName(x.city),x.on?'En cours':'Dans '+x.in+' j',''])); }
  ev.push(['Marchés boursiers',marketsOpen()?'Ouverts aujourd’hui':'Fermés (week-end), réouverture lundi','']);
  const agenda=card('Agenda','<div class="stack">'+ev.slice(0,8).map(x=>'<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div><b>'+esc(x[0])+'</b><div class="sub">'+esc(x[1])+'</div></div><span class="sub num">'+esc(x[2])+'</span></div>').join('')+'</div>');
  /* palier */
  let tcard;
  if(nx){ const f=clamp((S.peakNW-D.TIERS[t].nw)/(nx.nw-D.TIERS[t].nw),0,1); tcard=card('Palier : '+D.TIERS[t].n,'<div class="stack"><div class="row sp"><span class="sub">Prochain : <b>'+nx.n+'</b> à '+eur(nx.nw,0)+'</span><span class="num">'+Math.round(f*100)+' %</span></div>'+bar(f)+'<div class="sub">'+nx.d+'</div></div>'); }
  else tcard=card('Palier : '+D.TIERS[t].n,'<div class="sub">Palier maximal atteint.</div>');
  /* objectifs */
  const todo=ACH.filter(a=>!S.ach[a.id]); const done=ACH.length-todo.length;
  const ach=card('Objectifs',
    '<div class="row sp"><span class="sub">'+done+' / '+ACH.length+' réalisés</span></div>'+bar(done/ACH.length,'g')+
    '<div class="stack" style="margin-top:10px">'+todo.slice(0,4).map(a=>'<div><b>'+a.t+'</b><div class="sub">'+a.d+'</div></div>').join('')+(todo.length?'':'<div class="sub">Tous les objectifs sont atteints.</div>')+'</div>');
  /* journal */
  const jr=S.journal.slice(-14).reverse();
  const jcard=card('Journal et actualités','<div class="log">'+jr.map(x=>'<div><span class="d">'+dateS(x.d)+'</span><span class="'+x.s+'">'+(x.k==='news'?'<span class="tag" style="margin-right:6px">Actu</span>':'')+esc(x.m)+'</span></div>').join('')+'</div>');
  return h+'<div class="grid g2">'+nwCard+flCard+'</div><div class="grid">'+agenda+tcard+ach+'</div>'+jcard;
}

/* ---------- Sociétés ---------- */
function bizCard(b){
  const d=bizDef(b), l=b.last; const fill=staffFill(b);
  const avg=b.hist.length? b.hist.slice(-30).reduce((a,x)=>a+x,0)/Math.min(30,b.hist.length) : 0;
  return '<section class="card bc"><div class="hd"><div><b>'+esc(b.name)+'</b><div class="sub">Niveau '+b.lvl+' · '+esc(bizAddr(b))+'</div></div>'+bizStatus(b)+'</div>'+
    (b.status==='active'? '<div class="row sp"><div><div class="tag">Dernier résultat</div><div class="big num '+cls(l?l.net:0)+'">'+(l?signed(l.net,0):'—')+'</div></div><div style="text-align:right"><div class="tag">Moyenne 30 j</div><div class="num '+cls(avg)+'">'+(b.hist.length?signed(avg,0)+' / j':'—')+'</div></div></div>'+
      '<div><div class="row sp"><span class="sub">Effectif '+headcount(b)+' / '+entRoles(b).reduce((a,r)=>a+r[1],0)+'</span><span class="sub">'+Math.round(fill*100)+' %</span></div>'+bar(fill,fill<.6?'r':fill<.95?'a':'g')+'</div>'
      : '')+
    '<div class="row sp">'+btn('Gérer','bizopen',{c:'pri',i:b.id})+(b.status==='active'&&b.lvl<MAXLVL&&!b.up?'<span class="sub">Agrandir : '+eur(upgradeCost(b),0)+'</span>':'')+'</div></section>';
}
function catalogCard(id){
  const d=D.biz[id], lock=!unlocked(d.tier), c=d.cost, n=bizCount(id);
  const rd=Math.max(1,Math.min(5,Math.round(d.risk/0.03)));
  const base=bizBase({def:id,lvl:1});
  return '<section class="card bc '+(lock?'lock':'')+'"><div class="hd"><div><b>'+esc(d.n)+'</b><div class="sub">'+esc(d.sub)+'</div></div>'+(n?pill('×'+n+' détenue(s)','info'):'')+'</div>'+
    '<div class="row sp"><div><div class="tag">Coût de base</div><div class="num"><b>'+eur(c,0)+'</b></div></div><div><div class="tag">Mise en route</div><div class="num"><b>'+(d.startup? d.startup.ph.reduce((a,p)=>a+p[1],0):d.launch)+' j</b></div></div><div><div class="tag">Amortissement</div><div class="num"><b>~'+d.payback+' j</b></div></div></div>'+
    '<div class="row">'+dots(rd)+(d.open==='always'?pill('Ouvert le week-end','good'):pill('Fermé le week-end',''))+(d.startup?pill('Start-up : risque d’échec','warn'):'')+'</div>'+
    (d.note?'<div class="sub">'+d.note+'</div>':'')+
    '<div class="row sp">'+(lock?'<span class="sub">Palier '+D.TIERS[d.tier].n+' ('+eur(D.TIERS[d.tier].nw,0)+')</span>':btn(d.startup?'Préparer le lancement':'Lancer','launch',{c:'pri',i:id}))+(!lock?'<span class="sub">Ville et quartier au choix</span>':'')+'</div></section>';
}
/* ---------- Modale société ---------- */
function modalBiz(b){
  const d=bizDef(b), l=b.last, key='b'+b.id;
  const avg=b.hist.length? b.hist.slice(-30).reduce((a,x)=>a+x,0)/Math.min(30,b.hist.length):0;
  const base=bizBase(b), pr=b.status==='active'? bizProjection(b):null;
  let body='';
  body+=bizHero(b);
  if(d.note) body+='<div class="notice info">'+d.note+'</div>';
  body+=tip('biz');
  if(d.startup){
    const su=d.startup; let acc=0; const el=S.day-b.since;
    body+='<div class="card" style="padding:10px 12px"><div class="tag">Parcours de la start-up</div><div class="row" style="gap:6px;margin-top:6px;flex-wrap:nowrap">'+su.ph.map(p=>{ const a0=acc; acc+=p[1]; const f=clamp((el-a0)/p[1],0,1); return '<div style="flex:'+p[1]+';min-width:0"><div class="sub" style="font-size:11px">'+p[0]+' · '+p[1]+' j</div>'+bar(f)+'</div>'; }).join('')+'</div>'+
      (b.status==='active'?'<div class="sub" style="margin-top:6px">Issue : '+(b.out==='S'?'<b class="pos">succès, croissance en cours</b>':'<b class="mut">traction modeste</b>')+'</div>':'')+'</div>';
  }
  if((b.arr||0)>0) body+='<div class="notice bad"><b>Loyer impayé depuis '+plu(b.arr,'jour')+'.</b> Si votre trésorerie reste négative, le bailleur vous expulse à '+EVICT_DAYS+' jours et la société ferme. Acheter les locaux protège de l’expulsion.</div>';
  if(b.status==='build'){ body+='<div class="notice info">Mise en route en cours.</div><div>'+btn('Céder : '+eur(sellPrice(b),0),'sellbiz',{c:'dng',i:b.id})+'</div>'; }
  else{
    body+='<div class="mini"><div><span>Moyenne 30 jours</span><b class="num '+cls(avg)+'">'+signed(avg,0)+'</b></div><div><span>Fidélité moyenne</span><b>'+Math.round(avgLoy(b))+'</b></div></div>';
    if(l){
      body+='<div class="grid g2"><div><h3 style="margin-top:0">Flux du dernier jour</h3><div class="tw"><table class="tbl"><tbody>'+
        '<tr><td>Ventes</td><td class="r num pos">'+eur(l.rev,0)+'</td></tr><tr><td>Coûts variables (matières, marchandises)</td><td class="r num neg">−'+eur(l.cogs,0)+'</td></tr><tr><td>Salaires et charges</td><td class="r num neg">−'+eur(l.wages,0)+'</td></tr><tr><td>Entretien et frais fixes</td><td class="r num neg">−'+eur(l.upkeep,0)+'</td></tr>'+(l.rent?'<tr><td>Loyer</td><td class="r num neg">−'+eur(l.rent,0)+'</td></tr>':'')+(l.sec?'<tr><td>Sécurité</td><td class="r num neg">−'+eur(l.sec,0)+'</td></tr>':'')+(l.ins?'<tr><td>Assurance</td><td class="r num neg">−'+eur(l.ins,0)+'</td></tr>':'')+(l.mkt?'<tr><td>Marketing</td><td class="r num neg">−'+eur(l.mkt,0)+'</td></tr>':'')+(l.extra?'<tr><td>Incidents</td><td class="r num neg">−'+eur(l.extra,0)+'</td></tr>':'')+
        (l.dfr? '<tr><td>'+(l.dfr>0?'Frais reportés à la prochaine vente':'Frais reportés réglés')+'</td><td class="r num '+(l.dfr>0?'pos':'neg')+'">'+signed(l.dfr,0)+'</td></tr>' : '')+
        '<tr><td><b>Résultat</b></td><td class="r num '+cls(l.net)+'"><b>'+signed(l.net,0)+'</b></td></tr></tbody></table></div>'+((b.dfr||0)>0? '<div class="sub">Frais en attente : <b class="num">'+eur(b.dfr,0)+'</b>, déduits des prochaines ventes (au plus tard le '+dateL((b.dfr0||S.day)+DFR_MAX)+').</div>' : '')+(l.closed?'<div class="sub neg">Activité interrompue par un incident.</div>':!l.open?'<div class="sub">Fermée : charges fixes seulement.</div>':'')+'</div>'+
        '<div><h3 style="margin-top:0">Résultats des 30 derniers jours</h3>'+barsChart(b.hist.slice(-30),{label:'Résultats quotidiens de '+b.name})+'</div></div>';
    }
    /* pilotage */
    body+='<div class="card" id="bj-pil"><h2>Pilotage</h2><div class="grid">'+
      (pqOn(b)? '<div class="stack"><b>Qualité du produit</b><div class="seg">'+PQN.map((n,k)=>'<button class="'+(pqOf(b)===k?'on':'')+'" data-a="setpq" data-i="'+b.id+'" data-v="'+k+'">'+n+'</button>').join('')+'</div><div class="sub">Coût des marchandises : '+(PQC[pqOf(b)]>1?'+'+Math.round((PQC[pqOf(b)]-1)*100)+' %':'normal')+'. Une meilleure qualité fait monter la satisfaction des clients, donc les ventes.</div></div>' : '')+
      '<div class="stack"><div class="row" style="gap:0"><label for="sl-pol"><b>Politique salariale</b> : <span id="lb-pol" class="num">'+Math.round(b.pol*100)+' %</span></label><button class="qm" type="button" data-a="gloss" data-v="Politique salariale" aria-label="Explication : politique salariale">?</button></div><input type="range" id="sl-pol" min="80" max="140" step="5" value="'+Math.round(b.pol*100)+'" data-live="lb-pol" data-fmt="pct" data-ch="setpol" data-i="'+b.id+'"></div>'+
      (isFact(b)? factPilot(b) : '<div class="stack"><label for="sl-price"><b>Prix de vente</b> : <span id="lb-price" class="num">'+Math.round(b.price*100)+' %</span></label><input type="range" id="sl-price" min="80" max="130" step="5" value="'+Math.round(b.price*100)+'" data-live="lb-price" data-fmt="pct" data-ch="setprice" data-i="'+b.id+'"></div>')+
      '<div class="stack"><b>Marketing</b><div class="seg">'+[0,1,2,3].map(k=>'<button class="'+(b.mkt===k?'on':'')+'" data-a="setmkt" data-i="'+b.id+'" data-v="'+k+'">'+['Aucun','Léger','Soutenu','Intense'][k]+'</button>').join('')+'</div><div class="sub">Coût : '+eur(base.R0*MKT_PCT[b.mkt],0)+' / jour ouvré. Ventes '+multPct(MKT_BOOST[b.mkt])+'.</div></div>'+
      (d.open==='always'? '<div class="stack"><b>Week-end</b><div class="sub">Ouvert chaque jour</div></div>'
        : '<div class="stack"><b>Ouverture le week-end</b><div class="seg"><button class="'+(!b.wk?'on':'')+'" data-a="setwk" data-i="'+b.id+'" data-v="0">Fermé</button><button class="'+(b.wk?'on':'')+'" data-a="setwk" data-i="'+b.id+'" data-v="1">Ouvert</button></div><div class="sub">Salaires +50 %, ventes '+(d.wkf>=1?'+':'−')+Math.abs(Math.round((d.wkf-1)*100))+' % par rapport à un jour de semaine.'+(b.wk&&d.wkf<1.2?' <b class="neg">Probablement peu rentable.</b>':d.wkf>=1.3?' <b class="pos">Rentable pour un commerce.</b>':'')+'</div></div>')+
      planBlock(b)+
      '<div class="stack"><b>Équipement : '+EQN[eqOf(b)]+'</b><div class="lvl">'+EQN.map((n,i)=>'<i class="'+(i<=eqOf(b)?'on':'')+'"></i>').join('')+'</div><div class="sub">Productivité '+multPct(EQP[eqOf(b)])+(isStock(b)?', stockage '+capDays(b)+' jours':'')+'.</div>'+(eqOf(b)<3?'<div>'+btn('Passer à « '+EQN[eqOf(b)+1]+' » : '+eur(eqCost(b),0),'upeq',{c:'sm',i:b.id})+'</div>':'')+'</div>'+
      '<div class="stack"><b>Formation</b><div class="sub">Productivité et fidélité de toute l’équipe en hausse. Une session tous les 20 jours.</div><div>'+btn(trainReady(b)?'Former l’équipe : '+eur(trainCost(b),0):'Prochaine session dans '+(20-(S.day-b.tr))+' j','train',{c:'sm',i:b.id,dis:!trainReady(b)||!headcount(b),why:headcount(b)?'Une formation tous les 20 jours.':'Aucun salarié à former.'})+'</div></div>'+
      '<div class="stack"><b>Mutuelle santé</b><div class="seg"><button class="'+(!b.hc?'on':'')+'" data-a="sethc" data-i="'+b.id+'" data-v="0">Aucune</button><button class="'+(b.hc?'on':'')+'" data-a="sethc" data-i="'+b.id+'" data-v="1">Souscrite</button></div><div class="sub">+5 % de salaires, fidélité +5.'+(S.diff==='hard'&&!b.hc?' <b class="neg">En difficile, vos salariés la réclament (fidélité −5).</b>':'')+'</div></div>'+
      '</div></div>';
    /* clients, équipe, stock, locaux */
    { const cr=csCrit(b), fat=fatOf(b), sh=ownShare(b), full=premPrice(b), left=Math.max(0,full-premValue(b)), rentD=base.rent0*rentFactor(b)*progMult();
      const crit=[['Prix',cr.price],['Service',cr.service],['Qualité',cr.quality],['Adresse',cr.addr]];
      body+='<div class="card"><h2>Clients et équipe</h2><div class="stack">'+
        '<div class="row sp"><b>Avis des clients</b><span class="num">ventes '+multPct(csMult(b))+'</span></div>'+
        rvCard(b)+
        '<h3>Ce qui fait la note</h3>'+
        rvDiag(b)+
        '<div class="sub">La note est la moyenne des avis des 30 derniers jours : elle évolue lentement.</div>'+
        '<div class="row sp"><b>Fatigue de l’équipe</b><span class="num"><b>'+Math.round(fat)+' / 100</b></span></div>'+bar(fat/100,fat>60?'r':fat>30?'a':'g')+
        '<div class="sub">'+(fat>30?'Ventes '+multPct(fatF(b))+' et départs plus fréquents. ':'')+'Elle monte quand des postes manquent ou que le week-end est travaillé, et baisse les jours de repos'+(hrLvl()?' (aidée par votre service RH).':'.')+'</div>'+
        (isStock(b)? (function(){ const cap=stockCap(b), st=b.stock||0, pend=pendingOf(b), cr=cogsRef(b);
          return '<div class="stack"><div class="row sp"><b>Stock de marchandises</b><span class="num"><b>'+(st/cr).toFixed(1)+' j</b> de ventes</span></div>'+bar(st/cap,st/cr<1.5?'r':st/cr<3?'a':'g')+
          '<div class="sub">'+eur(st,0)+' en rayon sur '+eur(cap,0)+' de capacité'+(pend>1?' · '+eur(pend,0)+' en livraison':'')+(b.soDays?' · <b class="neg">rupture en cours</b>':'')+'.</div>'+
          '<div class="row"><span class="sub">Stock visé</span><div class="seg">'+STKN.map((n,k)=>'<button class="'+(stkOf(b)===k?'on':'')+'" data-a="setstk" data-i="'+b.id+'" data-v="'+k+'">'+n+'</button>').join('')+'</div></div>'+
          '<div class="row"><span class="sub">Commande automatique</span><div class="seg"><button class="'+(b.auto===false?'on':'')+'" data-a="setauto" data-i="'+b.id+'" data-v="0">Désactivé</button><button class="'+(b.auto!==false?'on':'')+'" data-a="setauto" data-i="'+b.id+'" data-v="1">Activé</button></div>'+btn('Remplir le stock','orderstk',{c:'sm',i:b.id})+'</div>'+
          '<div class="sub">Le stock de secours permet de continuer à vendre pendant une pénurie chez les fournisseurs'+(b.penUntil>S.day?' (<b class="neg">pénurie en cours, encore '+(b.penUntil-S.day)+' j</b>)':'')+'. Sans stock, les ventes s’arrêtent. Livraison le lendemain.'+(S.proc?' Responsable des achats : −3 %.':' Un responsable des achats (Agence) fait baisser les prix de 3 %.')+'</div></div>'; })() : '')+
        (b.bld? bldLocHtml(b) : '<div class="stack"><div class="row sp"><b>Locaux</b>'+(sh>=.999? pill('Propriétaire','good') : sh>0? pill('Propriétaire en partie','info') : pill('Locataire',''))+'</div>'+
        '<div class="sub">Loyer : '+eur(rentD*(1-0.7*sh),0)+' / jour.'+(b.prem?' Valeur des locaux : '+eur(premValue(b),0)+' (suit le marché immobilier).':'')+'</div>'+
        (left>=1? '<div>'+btn((sh>0?'Compléter l’achat : ':'Acheter les locaux : ')+eur(left,0),'buyprem',{c:'sm pri',i:b.id,dis:S.cash<left&&cityOf(b).ccy==='EUR'})+'</div><div class="sub">Propriétaire, le loyer baisse de 70 %. Les locaux se revendent avec la société.</div>' : '')+'</div>')+
        '</div></div>'; }
    /* sécurité et assurance */
    { const C=cityOf(b), dd=distOf(b), sec=bizSec(b.def), R0=base.R0, fc=festOf(b.city).crime;
      const pv=k=>0.004*Math.pow(dd.crime/3,1.6)*D.SECT[sec].th*SECM[k]*fc*(S.dm||1);
      const risk=k=>{ const p=pv(k); return p<0.0005? 'très rare' : '1 vol tous les ~'+Math.round(1/p)+' j'; };
      body+='<div class="card" id="bj-sec"><h2>Sécurité et assurance</h2><div class="stack"><div class="sub">Quartier '+esc(dd.n)+' : criminalité '+dots(dd.crime)+'</div>'+
        '<div class="stack"><b>Sécurité</b><div class="seg">'+SECN.map((n,k)=>'<button class="'+((b.sec||0)===k?'on':'')+'" data-a="setsec" data-i="'+b.id+'" data-v="'+k+'">'+n+'</button>').join('')+'</div><div class="sub">Coût : '+eur(R0*SECC[b.sec||0],0)+' / jour. Risque de vol : '+risk(b.sec||0)+'.'+((b.sec||0)<3?' Niveau suivant : '+eur(R0*SECC[(b.sec||0)+1],0)+' / jour, '+risk((b.sec||0)+1)+'.':'')+'</div></div>'+
        '<div class="stack"><b>Assurance</b><div class="seg"><button class="'+(!b.ins?'on':'')+'" data-a="setins" data-i="'+b.id+'" data-v="0">Aucune</button><button class="'+(b.ins?'on':'')+'" data-a="setins" data-i="'+b.id+'" data-v="1">Souscrite</button></div><div class="sub">Coût : '+eur(R0*0.006*insRisk(C),0)+' / jour. Réduit les pertes de vol de moitié et les dégâts de catastrophe de 70 %.</div></div></div></div>'; }
    /* facteurs */
    if(pr){
      const f=[['Effectif et compétences',pr.sf],['Conjoncture et taux',pr.demand],['Réputation',pr.rep],['Saturation du marché ('+(satIndex(b)+1)+'e exemplaire)',pr.sat],['Effet du prix sur les volumes',pr.vol],['Marketing',MKT_BOOST[b.mkt]],['Quartier et clientèle',pr.loc.aff],['Prestige de l’adresse',pr.loc.pres],['Ville et pouvoir d’achat',pr.loc.city],['Fête en cours',pr.loc.fe],['Satisfaction des clients',pr.csm],['Concurrence ('+intLabel(intensity(rivKey(b))).toLowerCase()+')',pr.comp],['Synergies',synBonus(d)],['Lois et actualité',lawMult(d,b)*tagMult(d.tags)],['Phase de croissance',startupMult(b)]].filter(x=>Math.abs(x[1]-1)>0.004||x[0].startsWith('Effectif'));
      body+='<div class="card"><h2>Ce qui fait vos ventes</h2><div class="tw"><table class="tbl"><tbody>'+f.map(x=>'<tr><td>'+x[0]+'</td><td class="r num '+(x[1]>1.004?'pos':x[1]<0.996?'neg':'')+'">'+multPct(x[1])+'</td></tr>').join('')+'</tbody></table></div>'+(d.syn&&synBonus(d)===1?'<div class="sub" style="margin-top:6px">Synergie possible : '+d.syn.txt+' (+'+Math.round(d.syn.b*100)+' %).</div>':'')+(b.mods.length?'<div class="row" style="margin-top:8px">'+b.mods.map(m=>pill(m.label+' jusqu’au '+dateL(m.until),m.mult>1?'good':'bad')).join('')+'</div>':'')+'</div>';
    }
    body+=bossPanel(b);
    body+='<div class="card" id="bj-eq"><h2>Équipe</h2>'+staffPanel(b,'biz')+'</div>';
    body+='<div class="row sp"><span class="sub">Valeur estimée : '+eur(bizValue(b),0)+'</span>'+btn('Céder la société : '+eur(sellPrice(b),0),'sellbiz',{c:'dng',i:b.id})+'</div>';
  }
  if(b.status==='active') body+=relocCard(b);
  return {title:'Fiche société',body};
}

