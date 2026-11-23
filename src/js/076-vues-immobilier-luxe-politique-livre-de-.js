/* ============================================================
   VUES : immobilier, luxe, politique, livre de comptes, paramètres, accueil
   ============================================================ */
function vImmo(){
  const M=S.macro;
  let h=head('Immobilier','Achetez, construisez, rénovez et revendez. Les loyers tombent chaque jour, les cours suivent les taux d’intérêt.',
    '<span class="pill info">Indice des prix : '+fmtN(M.house*100,1)+'</span><span class="pill">Taux directeur : '+fmtN(M.rate,1)+' %</span>');
  let rent=0,val=0; S.prop.forEach(p=>{ rent+=rentEst(p); val+=propValue(p); });
  h+=card('Mon patrimoine immobilier',
    '<div class="mini" style="margin-bottom:10px"><div><span>Valeur</span><b class="num">'+eur(val,0)+'</b></div><div><span>Loyers par jour</span><b class="num pos">'+eur(rent,0)+'</b></div><div><span>Biens</span><b>'+S.prop.length+'</b></div><div><span>Agences : bonus loyers</span><b>+'+Math.round(agencyBonus()*2.5)+' %</b></div></div>'+
    (S.prop.length? '<div class="tw"><table class="tbl"><thead><tr><th>Bien</th><th class="r">Valeur</th><th class="r">Payé</th><th class="r">Plus-value</th><th class="r">Loyer / jour</th><th class="r">État</th><th></th></tr></thead><tbody>'+S.prop.map(p=>{ const v=propValue(p), net=v*0.96; return '<tr><td>'+esc(p.name)+'</td><td class="r num">'+eur(v,0)+'</td><td class="r num">'+eur(p.paid,0)+'</td><td class="r num '+cls(net-p.paid)+'">'+signed(net-p.paid,0)+'</td><td class="r num">'+(p.reno?'travaux':eur(rentEst(p),0))+'</td><td class="r num">'+Math.round(p.cond*100)+' %</td><td class="r"><div class="row" style="justify-content:flex-end;gap:4px">'+btn(p.reno?'Travaux '+p.reno.t+' j':'Rénover '+eur(renovCost(p),0),'renov',{c:'sm ghost',i:p.id,dis:!!p.reno||p.cond>=1.2,why:p.reno?'Travaux en cours.':'Le bien est déjà en parfait état.'})+btn('Vendre '+eur(net,0),'sellprop',{c:'sm',i:p.id})+'</div></td></tr>'; }).join('')+'</tbody></table></div>' : '<div class="sub">Aucun bien.</div>'),{c:'led'});
  if(S.projects.length) h+=card('Chantiers en cours','<div class="stack">'+S.projects.map(p=>'<div><div class="row sp"><b>'+esc(p.name)+'</b><span class="sub">'+p.t+' j restants · valeur à la livraison '+eur(p.value*M.house,0)+'</span></div>'+bar(1-p.t/p.total)+'</div>').join('')+'</div>');
  h+='<div class="grid g2">'+card('Annonces (renouvelées chaque semaine)','<div class="sub" style="margin-bottom:6px"></div>'+
    (S.listings.length? '<div class="tw"><table class="tbl"><thead><tr><th>Bien</th><th class="r">Prix</th><th class="r">Coût total</th><th class="r">Loyer / jour</th><th></th></tr></thead><tbody>'+S.listings.map(l=>{ const T=D.PROP[l.t], lock=!unlocked(T.tier), c=buyCost(l.price,l.t); const r=l.price*T.y*0.92*(S.laws.rentCap?.88:1); return '<tr class="'+(lock?'lock':'')+'"><td>'+T.n+'<div class="sub">expire dans '+Math.max(0,l.exp-S.day)+' j</div></td><td class="r num">'+eur(l.price,0)+'</td><td class="r num">'+eur(c,0)+'</td><td class="r num pos">~'+eur(r,0)+'</td><td class="r">'+(lock?'<span class="sub">'+D.TIERS[T.tier].n+'</span>':btn('Acheter','buyprop',{c:'sm pri',i:l.id,dis:S.cash<c,why:'Trésorerie insuffisante : il manque '+eur(c-S.cash,0)+'.'}))+'</td></tr>'; }).join('')+'</tbody></table></div>' : '<div class="sub">Aucune annonce.</div>'))+
    card('Construire','<div class="sub" style="margin-bottom:6px">Capacité de chantier : <b>'+S.projects.length+' / '+projectLimit()+'</b>.'+(buildCoLevel()>0?' Votre société de construction réduit les coûts de 12 % et les délais de 25 %.':' Une société de construction (onglet Sociétés) augmente la capacité et réduit coûts et délais.')+'</div><div class="stack">'+
    Object.entries(D.BUILD).map(([k,T])=>{ const lock=!unlocked(T.tier), c=T.cost*buildDiscount(); return '<div class="row sp '+(lock?'lock':'')+'" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div><b>'+T.n+'</b><div class="sub">'+T.d[0]+' à '+T.d[1]+' jours · valeur '+eur(T.cost*T.up,0)+'</div></div>'+(lock?'<span class="sub">'+D.TIERS[T.tier].n+'</span>':btn('Construire '+eur(c,0),'build',{c:'sm pri',i:k,dis:S.cash<c||S.projects.length>=projectLimit(),why:S.projects.length>=projectLimit()?'Nombre maximal de chantiers en cours atteint.':undefined}))+'</div>'; }).join('')+'</div>')+'</div>';
  return h;
}

function vLuxe(){
  const t=tierNow();
  let val=0; S.lux.forEach(o=>val+=S.luxVal[o.id]);
  let h=head('Luxe, monuments et pays','Ces achats rapportent peu mais donnent du prestige, de l’influence et, tout en haut, une nation à gouverner. Les frais de revente sont élevés.',
    '<span class="pill info">Prestige : '+fmtN(S.prestige)+'</span><span class="pill">Patrimoine de luxe : '+eur(val,0)+'</span>');
  if(S.laws.luxTax>0) h+='<div class="notice">Taxe somptuaire en vigueur : +'+pct(S.laws.luxTax,0)+' sur tous les achats de luxe.</div>';
  if(t<3) h+='<div class="notice">Le marché du luxe s’ouvre au palier <b>Magnat</b> ('+eur(D.TIERS[3].nw,0)+'). Les articles ci-dessous sont des aperçus.</div>';
  Object.keys(D.LUX_KIND).forEach(k=>{
    const items=D.LUX.filter(l=>l.kind===k);
    h+='<div class="cat-h">'+D.LUX_KIND[k]+'</div><div class="grid">'+items.map(l=>{
      const own=S.lux.some(o=>o.id===l.id), lock=!unlocked(l.tier), bp=luxBuyPrice(l), sp=luxSellPrice(l), o=S.lux.find(x=>x.id===l.id);
      return '<section class="card bc '+(lock&&!own?'lock':'')+'"><div class="hd"><div><b>'+esc(l.n)+'</b><div class="sub">Prestige +'+l.pr+' · frais de revente '+Math.round(l.spread*100)+' %</div></div>'+(own?pill('Possédé','good'):'')+'</div>'+
        '<div class="row sp"><div><div class="tag">Valeur de marché</div><div class="num"><b>'+eur(S.luxVal[l.id],0)+'</b></div></div>'+(own?'<div style="text-align:right"><div class="tag">Si vendu</div><div class="num '+cls(sp-o.paid)+'"><b>'+eur(sp,0)+'</b></div></div>':'<div style="text-align:right"><div class="tag">Prix d’achat</div><div class="num"><b>'+eur(bp,0)+'</b></div></div>')+'</div>'+
        (own&&luxRentable(l)? '<div class="row sp"><span class="sub">'+(o.rent?'En location : +'+eur(luxRentDay(l),0)+' / j, prestige divisé par deux.':'Location possible : +'+eur(luxRentDay(l),0)+' / j.')+'</span>'+btn(o.rent?'Arrêter':'Louer','luxrent',{c:'sm',i:l.id,v:o.rent?0:1})+'</div>' : '')+'<div class="row sp">'+(own?btn('Vendre','sellux',{c:'sm',i:l.id}):lock?'<span class="sub">Palier '+D.TIERS[l.tier].n+'</span>':btn('Acheter','buylux',{c:'sm pri',i:l.id,dis:S.cash<bp,why:'Trésorerie insuffisante : il manque '+eur(bp-S.cash,0)+'.'}))+(!own&&!lock&&S.cash<bp?'<span class="sub neg">Il manque '+eur(bp-S.cash,0)+'</span>':'')+'</div></section>'; }).join('')+'</div>';
  });
  h+='<div class="cat-h">Pays entiers</div>';
  if(S.country){
    const c=S.country;
    h+=card('Gouvernance de '+esc(c.name),
      '<div class="grid"><div class="stack"><label for="sl-ctax"><b>Taux d’imposition</b> : <span id="lb-ctax" class="num">'+Math.round(c.rate*100)+' %</span></label><input type="range" id="sl-ctax" min="5" max="60" step="1" value="'+Math.round(c.rate*100)+'" data-live="lb-ctax" data-fmt="pct0" data-ch="ctax"></div>'+
      '<div class="stack"><label for="sl-cspend"><b>Dépenses publiques</b> : <span id="lb-cspend" class="num">'+Math.round(c.spend*100)+' %</span></label><input type="range" id="sl-cspend" min="0" max="60" step="1" value="'+Math.round(c.spend*100)+'" data-live="lb-cspend" data-fmt="pct0" data-ch="cspend"></div></div>'+
      '<div class="mini" style="margin-top:10px"><div><span>Solde public / jour</span><b class="num '+cls(c.revenue)+'">'+signed(c.revenue,0)+'</b></div><div><span>Satisfaction</span><b>'+Math.round(c.sat)+' / 100</b></div><div><span>Souverain depuis le</span><b>'+dateS(c.since)+'</b></div><div><span>PIB</span><b class="num">'+eur(c.gdp,0)+'</b></div></div>'+bar(c.sat/100,c.sat<30?'r':c.sat<50?'a':'g')+
      '<div class="tag" style="margin-top:10px">Projets nationaux</div>'+(c.pj? '<div class="sub">En cours : <b>'+esc(CTY_PJ[c.pj.k].n)+'</b>, fin le '+dateL(c.pj.until)+'.</div>'+bar((S.day-c.pj.since)/Math.max(1,c.pj.until-c.pj.since),'g') : '')+
      '<div class="ht-t">'+Object.keys(CTY_PJ).map(k=>{ const P=CTY_PJ[k], done=(c.done||[]).includes(k), cost=c.gdp*P.c;
        return '<div class="rs-d"><div><b>'+esc(P.n)+(done?' · réalisé':'')+'</b><small>'+esc(P.t)+(done?'':' · '+P.d+' jours')+'</small>'+(done?'':'<div class="fm-a">'+btn('Lancer : '+eur(cost,0),'ctypj',{c:'sm',v:k,dis:!!c.pj||S.cash<cost})+'</div>')+'</div></div>'; }).join('')+'</div>'+
      '<div style="margin-top:8px">'+btn('Céder le pays : '+eur(c.price*0.7,0),'sellcountry',{c:'sm dng'})+'</div>');
  } else {
    h+='<div class="grid">'+D.COUNTRIES.map(c=>{ const lock=!unlocked(c.tier), miss=c.cities.filter(x=>!cityOwned(x));
      return '<section class="card bc '+(lock?'lock':'')+'"><div class="hd"><div><b>'+esc(c.n)+'</b><div class="sub">'+c.pop+' · villes : '+c.cities.filter(cityVisible).map(x=>(cityOwned(x)?'✓ ':'')+esc(D.CITIES[x].n)).join(', ')+(c.cities.some(x=>!cityVisible(x))?' + '+c.cities.filter(x=>!cityVisible(x)).length+' à découvrir':'')+'</div></div></div><div class="row sp"><div><div class="tag">Prix</div><div class="num"><b>'+eur(c.price,0)+'</b></div></div>'+(lock?'<span class="sub">Palier '+D.TIERS[c.tier].n+'</span>':(miss.length?'<span class="sub">Il manque '+plu(miss.length,'ville')+'</span>':btn('Acheter','buycountry',{c:'sm pri',i:c.id,dis:S.cash<c.price})))+'</div><div class="sub"></div></section>'; }).join('')+'</div>';
  }
  return h;
}

const LAWTXT={corpTax:['Impôt sur les sociétés',v=>pct(v,0)],capTax:['Taxe sur les revenus du capital',v=>pct(v,0)],wealthTax:['Impôt sur la fortune',v=>v?pct(v,1)+' par an':'Aucun'],labor:['Protection des salariés',v=>v?'Renforcée':'Standard'],minWage:['Salaire minimum',v=>'× '+v.toFixed(2)],cryptoReg:['Cryptomonnaies',v=>v?'Encadrées':'Libres'],rentCap:['Loyers',v=>v?'Encadrés':'Libres'],reserve:['Réserves obligatoires des banques',v=>pct(v,0)],subRenew:['Subventions renouvelables',v=>v?'Oui':'Non'],subTech:['Crédit d’impôt recherche',v=>v?'Oui':'Non'],luxTax:['Taxe somptuaire',v=>v?pct(v,0):'Aucune'],tobin:['Taxe sur les transactions',v=>v?pct(v,1):'Aucune'],consLaw:['Protection des consommateurs',v=>v?'Renforcée':'Standard']};
function lobbyPresets(){ const sc=lobbyScale(); return [0.5,1,3,10].map(m=>Math.round(sc*m/100)*100||100); }
function vPol(){
  const G=S.gov, M=S.macro;
  let h=head('Politique','Le Parlement vote des lois qui touchent vos sociétés. Vous pouvez peser sur le résultat, au risque d’un scandale.');
  h+='<div class="grid">'+card('Climat',
    '<div class="stack"><div><div class="row sp"><span>Popularité du gouvernement</span><b class="num">'+Math.round(G.pop)+'</b></div>'+bar(G.pop/100)+'</div><div><div class="row sp"><span>Tension sociale</span><b class="num">'+Math.round(G.ten)+'</b></div>'+bar(G.ten/100,G.ten>70?'r':G.ten>50?'a':'g')+'</div><div><div class="row sp"><span>Stabilité politique</span><b class="num">'+Math.round(G.stab)+'</b></div>'+bar(G.stab/100,'g')+'</div>'+(G.ten>70?'<div class="notice bad">Tension élevée : risque de grèves et de troubles.</div>':'')+'</div>')+
    card('Conjoncture','<div class="mini"><div><span>Activité</span><b>'+(M.econ>1.03?'Expansion':M.econ<0.97?'Ralentissement':'Stable')+'</b></div><div><span>Indice</span><b class="num">'+fmtN(M.econ*100,1)+'</b></div><div><span>Taux directeur</span><b class="num">'+fmtN(M.rate,1)+' %</b></div><div><span>Immobilier</span><b class="num">'+fmtN(M.house*100,1)+'</b></div></div>'+'<div class="sub"></div>')+
    card('Votre pouvoir','<div class="stack"><div><div class="row sp"><span>Influence politique</span><b class="num">'+fmtN(S.infl,1)+'</b></div><div class="sub"></div></div><div><div class="row sp"><span>Suspicion de la presse</span><b class="num">'+Math.round(S.susp)+' / 100</b></div>'+bar(S.susp/100,S.susp>60?'r':S.susp>30?'a':'g')+'<div class="sub"></div></div></div>')+'</div>';
  /* lois en vigueur */
  const lawGrid=(L,K)=>'<div class="grid g4">'+(K||Object.keys(LAWTXT)).filter(k=>LAWTXT[k]).map(k=>'<div><div class="tag">'+LAWTXT[k][0]+'</div><b class="num">'+LAWTXT[k][1](L[k])+'</b></div>').join('')+'</div>';
  if(!S.country) h+=card('Lois en vigueur',lawGrid(S.laws));
  if(S.country) h+=card('Lois de '+esc(S.country.name),'<div class="sub" style="margin-bottom:8px">Elles s’appliquent à vos sociétés installées dans le pays : impôt sur les sociétés, salaires, droit du travail, loyers et subventions par secteur. Les votes du Parlement ne les changent pas.</div>'+lawGrid(ctyLaws(),CTY_LAWK)+ctyLawFxHtml());
  if(S.country){
    h+=card('Décrets',
      '<div class="sub" style="margin-bottom:8px">En tant que souverain, vous fixez seul les lois de '+esc(S.country.name)+'. Un décret tous les 10 jours'+(S.day-S.decreeDay<10?' (prochain dans '+(10-(S.day-S.decreeDay))+' j)':'')+'. La satisfaction de vos citoyens réagit 50 % plus fort qu’à une loi votée.</div><div class="stack">'+
      ctyBillList().map(b=>'<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:200px"><b>'+b.t+'</b><div class="sub">'+b.d+'</div></div>'+btn('Décréter','decree',{c:'sm pri',i:b.k,dis:S.day-S.decreeDay<10,why:'Un décret tous les 10 jours.'})+'</div>').join('')+'</div>');
  } else {
    const pre=lobbyPresets(), pi=ui.tmp.lob??1, amt=pre[pi];
    h+='<div class="row sp"><h2 style="font-family:var(--f-display);font-size:24px;text-transform:uppercase;letter-spacing:.05em">Projets de loi</h2><div class="row"><span class="sub">Budget par action :</span><div class="seg">'+pre.map((a,i)=>'<button class="'+(pi===i?'on':'')+'" data-a="lobpre" data-v="'+i+'">'+eur(a,0)+'</button>').join('')+'</div></div></div>';
    if(!S.bills.length) h+='<div class="notice info">Aucun projet en discussion (prochain cycle : '+dateL(Math.floor((S.day-1)/30)*30+31)+').</div>';
    h+='<div class="grid">'+S.bills.map(bl=>{ const d=billDef(bl.k), p=billProb(bl);
      return '<section class="card bc"><div class="hd"><b>'+d.t+'</b>'+pill('Vote dans '+Math.max(0,bl.vote-S.day)+' j','info')+'</div><div class="sub">'+d.d+'</div>'+
        '<div><div class="row sp"><span class="sub">Chances d’adoption</span><b class="num">'+Math.round(p*100)+' %</b></div>'+bar(p,p>.6?'g':p>.4?'a':'r')+'</div>'+
        '<div class="sub">Vos financements : <b>'+eur(bl.pro,0)+'</b> pour · <b>'+eur(bl.con,0)+'</b> contre</div>'+
        '<div class="row">'+btn('Soutenir ('+eur(amt,0)+')','lobpro',{c:'sm pri',i:bl.id,dis:S.cash<amt||!unlocked(1),why:!unlocked(1)?'Palier « '+D.TIERS[1].n+' » requis.':undefined})+btn('Bloquer ('+eur(amt,0)+')','lobcon',{c:'sm',i:bl.id,dis:S.cash<amt||!unlocked(1),why:!unlocked(1)?'Palier « '+D.TIERS[1].n+' » requis.':undefined})+'</div></section>'; }).join('')+'</div>';
    h+=card('Dons aux partis','<div class="row sp"><div class="sub" style="flex:1;min-width:220px"></div>'+btn('Donner '+eur(amt,0),'donate',{c:'sm pri',v:amt,dis:S.cash<amt||!unlocked(1),why:!unlocked(1)?'Palier « '+D.TIERS[1].n+' » requis.':undefined})+'</div>'+(!unlocked(1)?'<div class="sub">Disponible dès le palier Entrepreneur.</div>':''));
  }
  h+=electionCard()+offCard();
  if(S.lawLog.length) h+=card('Historique des votes','<div class="log">'+S.lawLog.slice(0,10).map(x=>'<div><span class="d">'+dateS(x.d)+'</span><span class="'+(x.pass?'warn':'')+'">'+(x.decree?'Décret : ':x.pass?'Adoptée : ':'Rejetée : ')+esc(x.t)+'</span></div>').join('')+'</div>');
  return h;
}

/* ---------- Livre de comptes ---------- */
function vBooks(){
  const e=taxEstimate();
  let h=head('Livre de comptes','Votre compte unique : chaque mouvement d’argent est enregistré ici, société par société.');
  h+='<div class="grid">'+card('Trésorerie','<div class="mini"><div><span>Solde</span><b class="num '+(S.cash<0?'neg':'')+'">'+eur(S.cash,0)+'</b></div><div><span>Livret</span><b class="num">'+eur(S.livret.bal,0)+'</b></div><div><span>Dettes</span><b class="num '+(debtTotal()>0?'neg':'')+'">'+eur(debtTotal(),0)+'</b></div></div>')+
    card('Impôts','<div class="stack"><div class="row sp"><span>Prochaine échéance</span><b>'+dateL(S.nextTax)+'</b></div><div class="tw"><table class="tbl"><tbody><tr><td>Sociétés ('+pct(S.laws.corpTax,0)+')</td><td class="r num">'+eur(e.corp,0)+'</td></tr><tr><td>Revenus du capital ('+pct(S.laws.capTax,0)+')</td><td class="r num">'+eur(e.cap,0)+'</td></tr>'+(S.laws.wealthTax?'<tr><td>Fortune</td><td class="r num">'+eur(e.wealth,0)+'</td></tr>':'')+'<tr><td><b>Estimation</b></td><td class="r num"><b>'+eur(e.total,0)+'</b></td></tr></tbody></table></div><div class="sub">Dernière échéance : '+(S.taxLast.length? S.taxLast.map(x=>x[0]+' '+eur(x[1],0)).join(' · '):'aucune')+'. Les pertes sont reportées sur les mois suivants.</div></div>')+
    card('Emprunts','<div class="stack"><div class="sub">Taux actuel : <b>'+fmtN(debtRate(),2)+' %</b> par an, intérêts versés chaque jour. Capacité : <b>'+eur(debtLimit(),0)+'</b> (60 % de vos actifs bruts).</div><div class="row"><label class="sr" for="in-bor">Montant</label><input class="inp w" id="in-bor" inputmode="numeric" placeholder="Montant en €" data-q="bor" value="'+(ui.qty.bor||'')+'">'+btn('Emprunter','borrow',{c:'sm pri'})+'</div>'+
    S.debts.map(d=>'<div class="row sp" style="border-top:1px solid var(--line);padding-top:6px"><span class="num">'+eur(d.p,0)+' à '+d.r.toFixed(2)+' %</span><span class="row">'+btn('Rembourser '+eur(Math.min(d.p,Math.max(0,S.cash)),0),'repay',{c:'sm',i:d.id,v:'part',dis:S.cash<=0})+btn('Tout','repay',{c:'sm ghost',i:d.id,v:'all',dis:S.cash<d.p})+'</span></div>').join('')+'</div>')+'</div>';
  const G=glInit(), rows=Object.entries(G.s).map(([k,v])=>({k, n:srcName(k), i:v.in, o:v.out, net:v.in-v.out})).filter(r=>r.i>.5||r.o>.5).sort((a,c)=>Math.abs(c.net)-Math.abs(a.net));
  const T=rows.reduce((a,r)=>({i:a.i+r.i,o:a.o+r.o}),{i:0,o:0});
  h+=card('Grand livre','<div class="sub" style="margin-bottom:8px">Depuis les derniers impôts (le '+dateL(G.since)+'). Revenus, dépenses et résultat net de chaque société et de chaque activité.</div>'+
    '<div class="tw"><table class="tbl"><thead><tr><th>Source</th><th class="r">Revenus</th><th class="r">Dépenses</th><th class="r">Net</th></tr></thead><tbody>'+
    (rows.length? rows.map(r=>'<tr><td>'+esc(r.n)+'</td><td class="r num pos">'+eur(r.i,0)+'</td><td class="r num neg">'+eur(r.o,0)+'</td><td class="r num '+(r.net>=0?'pos':'neg')+'"><b>'+signed(r.net,0)+'</b></td></tr>').join('')+
      '<tr><td><b>Total</b></td><td class="r num pos"><b>'+eur(T.i,0)+'</b></td><td class="r num neg"><b>'+eur(T.o,0)+'</b></td><td class="r num '+(T.i-T.o>=0?'pos':'neg')+'"><b>'+signed(T.i-T.o,0)+'</b></td></tr>' : '<tr><td colspan="4" class="sub">Aucun mouvement depuis les derniers impôts.</td></tr>')+
    '</tbody></table></div>');
  return h;
}

/* ---------- Paramètres ---------- */
function vSet(){
  let h=head('Réglages');
  h+='<div class="grid">'+card('Partie',
    '<div class="stack"><div class="sub">Emplacement '+SV.slot+' sur 5, enregistré sur cet appareil. Difficulté : '+(S.diff==='easy'?'facile':'difficile')+'.</div>'+
    '<div class="row">'+btn('Sauvegarder maintenant','savenow',{c:'sm'})+btn('Copier le code de sauvegarde','export',{c:'sm'})+'</div>'+
    '<label for="ta-imp" class="sub">Importer un code</label><textarea id="ta-imp" class="inp" style="width:100%;height:70px" placeholder="Collez le code ici"></textarea><div>'+btn('Importer','import',{c:'sm'})+'</div>'+
    '<div class="sep"></div>'+btn('Retour au menu principal','menu',{c:'sm'})+'</div>')+
    card('Barre du bas','<div class="row">'+btn('Personnaliser','baredit',{c:'sm'})+'</div>')+card('Rapport de période','<div class="row">'+btn('Organiser le rapport','rpedit',{c:'sm'})+'</div>')+
    card('Affichage','<div class="stack"><div class="row"><b>Thème</b><div class="seg">'+[['auto','Système'],['light','Clair'],['dark','Sombre']].map(x=>'<button class="'+((ui.theme||'auto')===x[0]?'on':'')+'" data-a="theme" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>'+'<div class="row sp" style="margin-top:10px"><b>Ciel des villes</b><div class="seg">'+[['cycle','Jour et nuit animés'],['real','Heure réelle']].map(x=>'<button class="'+(cityTimeMode()===x[0]?'on':'')+'" data-a="citytime" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>'+'</div>')+'</div>';
  h+=card('Guide du jeu','<div class="row">'+btn('Ouvrir le guide','tab',{c:'pri',i:'guide'})+btn('Revoir les aides des écrans','tipsreset',{c:'sm'})+'</div>');
  return h+'<div class="sub" style="text-align:center">Idle Business · V2</div>';
}

/* ---------- Page d'accueil ---------- */
function vTitle(){
  const n=svCount(), last=svLast(), m=last? SV.meta[last-1] : null, rdy=SV.ready;
  let main;
  if(!rdy) main=btn('Chargement…','noop',{c:'pri stamp',dis:true});
  else if(m) main=btn('Continuer','continue',{c:'pri stamp'})+'<div class="sub tc"><b>'+esc(m.name)+'</b> · '+dateL(m.day)+' · '+eur(m.nw,0)+'<br>Emplacement '+last+' · '+svAgo(m.updated)+'</div>';
  else main=btn('Nouvelle partie','slotnew',{c:'pri stamp',i:1});
  return '<div class="start"><div><div class="tag">Jeu de simulation économique</div><h1>Idle<br>Business<i>.</i></h1></div>'+
    '<p style="margin:0" class="mut">Bâtissez un empire financier, jour après jour.</p>'+
    '<div class="title-actions">'+main+btn('Parcourir les sauvegardes'+(rdy?' ('+n+'/'+SV.N+')':''),'browse',{c:'wide',dis:!rdy})+'</div>'+
    '</div>';
}
function slotCard(i){
  const m=SV.meta[i-1];
  if(!m) return '<button class="slot empty" data-a="slotnew" data-i="'+i+'"><span class="sn">'+i+'</span><span class="sb"><b>Emplacement libre</b><small>Toucher pour créer une nouvelle partie</small></span></button>';
  return '<div class="slot"><button class="slot-main" data-a="slotplay" data-i="'+i+'"><span class="sn">'+i+'</span><span class="sb"><b>'+esc(m.name)+'</b><small>'+dateL(m.day)+' · '+eur(m.nw,0)+' · '+D.TIERS[m.tier].n+'</small><small>'+svAgo(m.updated)+'</small></span></button>'+
    '<button class="btn sm dng" data-a="slotdel" data-i="'+i+'" aria-label="Supprimer la sauvegarde de l’emplacement '+i+'">Supprimer</button></div>';
}
function newGameForm(slot){
  return '<div class="stack"><div><label for="in-name" class="tag">Nom de votre holding</label><br><input class="inp" id="in-name" style="width:100%;font-size:16px" value="Holding Lambert" maxlength="40" autocomplete="off"></div>'+
    '<div><label for="sel-cap" class="tag">Capital de départ (minimum 5 000 €)</label><br><select class="btn" id="sel-cap" style="width:100%"><option value="5000">5 000 €, défi</option><option value="10000">10 000 €, confort</option><option value="25000">25 000 €, facile</option><option value="100000">100 000 €, bac à sable</option></select></div>'+
    '<div><label for="sel-diff" class="tag">Difficulté (définitive pour cette partie)</label><br><select class="btn" id="sel-diff" style="width:100%"><option value="hard">Difficile : risques et départs complets</option><option value="easy">Facile : moins de vols, d’incidents et de démissions</option></select></div>'+
    '<div><label for="sel-mode" class="tag">Mode de jeu</label><br><select class="btn" id="sel-mode" style="width:100%"><option value="classic">Classique : sans limite de temps</option><option value="d100">Défi des 100 jours : le plus gros bénéfice face à trois magnats IA</option></select></div>'+
    '<div class="row sp">'+btn('Retour','browse',{c:'ghost'})+btn('Commencer','startnew',{c:'pri',i:slot})+'</div></div>';
}

