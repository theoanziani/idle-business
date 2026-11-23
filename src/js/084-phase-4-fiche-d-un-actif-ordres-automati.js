/* ============================================================
   PHASE 4 : fiche d'un actif, ordres automatiques, épargne automatique, élections, offshore, prison
   ============================================================ */
function assetData(cls,id){
  if(cls==='stock'){ const i=S.mk.stocks.findIndex(x=>x.id===id); return i<0?null:{d:D.stocks[i],m:S.mk.stocks[i]}; }
  const i=S.mk.crypto.findIndex(x=>x.id===id); return i<0?null:{d:D.crypto[i],m:S.mk.crypto[i]};
}
function modalAsset(cls,id){
  const A=assetData(cls,id); if(!A){ ui.modal=null; return null; }
  const d=A.d, m=A.m, span=ui.tmp.span||90, hist=m.hist.slice(-span), rg=range52(m.hist), pos=S.pf.player[cls][holdKey(cls,id)], dec=m.price<10?4:2;
  const kind=ui.tmp.ok||'buy';
  let body='<div class="row sp"><div><div class="sub">'+(cls==='stock'? D.SECTORS[d.sec]+(d.ipo?' · introduite en bourse':'')+' · rendement '+fmtN(d.y,1)+' %' : 'Cryptomonnaie · ouverte 7 j/7')+'</div><b class="num" style="font-size:26px">'+eur(m.price,dec)+'</b></div>'+
    '<div class="seg">'+[[90,'90 j'],[180,'180 j'],[360,'1 an']].map(x=>'<button class="'+(span===x[0]?'on':'')+'" data-a="aspan" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>'+
    lineChart(hist,{label:'Cours de '+d.n,fmt:v=>eur(v,dec)})+
    '<div><div class="row sp"><span class="sub">Plus bas 52 semaines : <b>'+eur(rg.lo,dec)+'</b></span><span class="sub">Plus haut : <b>'+eur(rg.hi,dec)+'</b></span></div>'+bar(rg.hi>rg.lo?(m.price-rg.lo)/(rg.hi-rg.lo):.5)+'</div>';
  if(pos){ const val=pos.q*m.price, pl=val-pos.cost; body+='<div class="mini"><div><span>Vous détenez</span><b class="num">'+fmtN(pos.q,cls==='crypto'?4:0)+'</b></div><div><span>Valeur</span><b class="num">'+eur(val,0)+'</b></div><div><span>Plus-value</span><b class="num '+cls2(pl)+'">'+signed(pl,0)+'</b></div></div>'; }
  body+='<div class="card" style="box-shadow:none;background:var(--paper)"><h3 style="margin:0 0 8px">Ordre automatique</h3><div class="seg">'+[['buy','Achat limite'],['sell','Vente limite'],['stop','Stop-loss']].map(x=>'<button class="'+(kind===x[0]?'on':'')+'" data-a="okind" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
    '<div class="sub" style="margin:6px 0">'+ORDN[kind]+' :</div><div class="row"><label class="sr" for="in-opx">Cours</label><input class="inp" id="in-opx" inputmode="decimal" placeholder="Cours" value="'+esc(ui.qty.opx||'')+'" data-q="opx">'+
    (kind==='buy'? '<label class="sr" for="in-oamt">Montant</label><input class="inp" id="in-oamt" inputmode="numeric" placeholder="Montant en €" value="'+esc(ui.qty.oamt||'')+'" data-q="oamt">' : '<div class="seg">'+[[.25,'¼'],[.5,'½'],[1,'Tout']].map(x=>'<button class="'+((ui.tmp.ofr||1)===x[0]?'on':'')+'" data-a="ofr" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>')+
    btn('Placer','oplace',{c:'sm pri',i:cls,j:id})+'</div><div class="sub" style="margin-top:6px">Exécuté automatiquement à la séance où le cours atteint le seuil'+(cls==='stock'?' (bourse fermée le week-end)':'')+'. Valable 90 jours.</div></div>';
  const os=(S.orders||[]).filter(o=>o.cls===cls&&o.aid===id);
  if(os.length) body+='<div class="stack">'+os.map(orderRow).join('')+'</div>';
  return {title:esc(d.n)+' ('+esc(d.id)+')',body,sm:true};
}
function orderRow(o){ const a=assetInfo(o.cls,o.aid); return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div><b>'+esc(a?a.name:o.aid)+'</b><div class="sub">'+ORDN[o.kind]+' '+eur(o.px,o.px<10?4:2)+(o.kind==='buy'?' · '+eur(o.amt,0):' · '+Math.round(o.amt*100)+' %')+' · jusqu’au '+dateL(o.exp)+'</div></div>'+btn('Annuler','ocancel',{c:'sm ghost',i:o.id})+'</div>'; }
function ordersCard(cls){ const os=(S.orders||[]).filter(o=>o.cls===cls); return card('Ordres automatiques', os.length? '<div class="stack">'+os.map(orderRow).join('')+'</div>' : '<div class="sub">Touchez le nom d’un actif pour voir son graphique et placer un achat limite, une vente limite ou un stop-loss.</div>'); }
function saveCard(){ const p=(S.save&&S.save.pct)||0;
  /* V2.3.4 : le directeur financier place aussi l'excédent de trésorerie sur le livret chaque lundi, même sur « Non » :
     c'est maintenant indiqué ici et réglable à part */
  const fin=mgrOn('fin')? '<div class="row sp" style="margin-top:6px"><div style="min-width:0"><b>Directeur financier</b><div class="sub">Chaque lundi, il place sur le livret la trésorerie au-delà d’un mois de dépenses.</div></div><div class="seg"><button class="'+(S.finLiv!==0?'on':'')+'" data-a="finliv" data-v="1">Activé</button><button class="'+(S.finLiv===0?'on':'')+'" data-a="finliv" data-v="0">Désactivé</button></div></div>' : '';
  return card('Épargne automatique','<div class="stack"><div class="sub">Chaque jour, une part du bénéfice de vos sociétés part sur le livret.</div><div class="seg">'+[0,.1,.25,.5].map(x=>'<button class="'+(p===x?'on':'')+'" data-a="saveset" data-v="'+x+'">'+(x?Math.round(x*100)+' %':'Non')+'</button>').join('')+'</div>'+fin+'</div>'); }
ACT.finliv=el=>{ S.finLiv=+el.dataset.v; toast(S.finLiv? 'Le directeur financier place l’excédent sur le livret.' : 'Le directeur financier ne place plus l’excédent sur le livret.','good'); render(); };
function electionCard(){
  if(S.country) return '';
  const E=elecInit();
  let b='<div class="stack">';
  if(E.ally) b+='<div class="notice good">Gouverneur allié : <b>'+esc(E.ally.name)+'</b> jusqu’au '+dateL(E.ally.until)+'. Contrôles fiscaux réduits.</div>';
  else if(E.last) b+='<div class="sub">Gouverneur actuel : <b>'+esc(E.last.name)+'</b> ('+esc(E.last.party)+').</div>';
  if(!E.cands.length) b+='<div class="sub">Prochaine élection le '+dateL(E.next)+'. La campagne s’ouvre 45 jours avant.</div>';
  else { const amt=lobbyPresets()[ui.tmp.lob??1];
    b+='<div class="row sp"><span class="sub">Vote le <b>'+dateL(E.next)+'</b> (dans '+(E.next-S.day)+' j)</span><span class="sub">Don : '+eur(amt,0)+'</span></div>'+E.cands.map(c=>{ const p=pollOf(c);
      return '<div class="stack" style="gap:6px;border-top:1px solid var(--line);padding-top:8px"><div class="row sp"><div><b>'+esc(c.name)+'</b><div class="sub">'+esc(c.party)+'</div></div><b class="num">'+Math.round(p*100)+' %</b></div>'+bar(p,c.lean>0?'g':c.lean<0?'r':'a')+
        '<div class="sub">Programme : '+(c.prog.length? c.prog.map(k=>esc(billDef(k).t)).join(' ; ') : 'statu quo')+'.'+(c.fund+c.offf?' Votre soutien : '+eur(c.fund+c.offf,0)+'.':'')+'</div>'+
        '<div class="row">'+btn('Financer','fund',{c:'sm pri',i:c.id,v:amt,dis:S.cash<amt||!unlocked(1),why:!unlocked(1)?'Palier « '+D.TIERS[1].n+' » requis.':undefined})+(S.off&&S.off.on?btn('Financer via l’offshore','fundoff',{c:'sm',i:c.id,v:amt,dis:S.off.bal<amt}):'')+'</div></div>'; }).join('');
    b+='<div class="sub">Le montant suit le budget choisi pour le lobbying. Faire élire votre candidat réduit les contrôles fiscaux.</div>'; }
  return card('Élection du gouverneur',b+'</div>');
}
function offCard(){
  const O=S.off;
  if(!O||!O.on) return card('Compte offshore','<div class="stack"><div class="sub">Une société écran dans un paradis fiscal réduit de 35 % votre impôt sur les sociétés et permet de financer discrètement des campagnes. À chaque échéance fiscale, une enquête peut tomber : amende de trois fois l’impôt évité, saisie du compte et 30 jours de prison.</div><div>'+btn('Ouvrir un compte ('+eur(OFF_OPEN,0)+')','offopen',{c:'sm',dis:!unlocked(2)||S.cash<OFF_OPEN,why:!unlocked(2)?'Palier « '+D.TIERS[2].n+' » requis.':undefined})+(unlocked(2)?'':' <span class="sub">Palier Investisseur.</span>')+'</div></div>');
  const r=offRisk();
  return card('Compte offshore','<div class="stack"><div class="mini"><div><span>Solde</span><b class="num">'+eur(O.bal,0)+'</b></div><div><span>Impôt évité</span><b class="num pos">'+eur(O.saved,0)+'</b></div><div><span>Risque d’enquête</span><b class="num '+(r>.15?'neg':'')+'">'+Math.round(r*100)+' % / mois</b></div></div>'+
    '<div class="stack"><b>Versement automatique</b><div class="seg">'+OFF_PCTS.map((p,i)=>'<button class="'+((S.off&&S.off.pct||0)===p?'on':'')+'" data-a="offpct" data-v="'+i+'">'+(p?Math.round(p*100)+' %':'Aucun')+'</button>').join('')+'</div><div class="sub">Part des bénéfices du jour virée chaque jour sur le compte. Le compte pèse '+Math.round(offWeight()*100)+' % de votre valeur nette : plus il est gros, plus un contrôle devient probable (risque actuel '+Math.round(offRisk()*100)+' % par échéance).</div></div>'+'<div class="row"><label class="sr" for="in-off">Montant</label><input class="inp w" id="in-off" inputmode="numeric" placeholder="Montant en €" data-q="off" value="'+esc(ui.qty.off||'')+'">'+btn('Virer','offin',{c:'sm'})+btn('Rapatrier (3 %)','offout',{c:'sm ghost'})+'</div>'+
    '<div class="sub">Frais : 2 000 € + 0,5 % du solde par mois. Le risque monte avec la suspicion et les gros virements, et baisse avec un gouverneur allié.</div><div>'+btn('Fermer le compte','offclose',{c:'sm ghost dng'})+'</div></div>');
}
function modalJail(){
  const J=S.jail, left=J.until-S.day;
  return {title:'En prison',sm:true,body:'<div class="notice bad">Fraude fiscale : amende de '+eur(J.fine,0)+(J.conf?', compte offshore saisi ('+eur(J.conf,0)+')':'')+'.</div><p style="margin:0">Vous ne pouvez rien décider pendant '+plu(left,'jour')+'. Vos sociétés continuent sans vous.</p><div>'+btn('Purger la peine','jailgo',{c:'pri'})+'</div>'};
}
Object.assign(ACT,{
  assetopen:el=>{ ui.tmp.span=90; ui.tmp.ok='buy'; ui.qty.opx=''; ui.qty.oamt=''; ui.modal={type:'asset',cls:el.dataset.i,id:el.dataset.j}; render(); },
  aspan:el=>{ ui.tmp.span=+el.dataset.v; render(); },
  okind:el=>{ ui.tmp.ok=el.dataset.v; render(); },
  ofr:el=>{ ui.tmp.ofr=+el.dataset.v; render(); },
  oplace:el=>{ const k=ui.tmp.ok||'buy', px=readIn('in-opx'), amt=k==='buy'? readIn('in-oamt') : (ui.tmp.ofr||1); const r=placeOrder(el.dataset.i,el.dataset.j,k,px,amt); if(r.ok){ ui.qty.opx=''; ui.qty.oamt=''; } after(r); },
  ocancel:el=>after(cancelOrder(+el.dataset.i)),
  saveset:el=>after(setSave(+el.dataset.v)),
  fund:el=>after(fundCandidate(+el.dataset.i,+el.dataset.v,false)),
  fundoff:el=>after(fundCandidate(+el.dataset.i,+el.dataset.v,true)),
  offopen:()=>ask('Ouvrir un compte offshore','C’est de la fraude fiscale : vos impôts baissent de 35 %, mais une enquête peut vous coûter une forte amende et 30 jours de prison.','Ouvrir',()=>after(offOpen())),
  offpct:el=>after(offSetPct(el.dataset.v)),
  offin:()=>{ const a=readIn('in-off'); ui.qty.off=''; after(offMove(a)); },
  offout:()=>{ const a=readIn('in-off'); ui.qty.off=''; after(offMove(-(a>0?a:(S.off?S.off.bal:0)))); },
  offclose:()=>after(offClose()),
  jailgo:()=>{ ui.modal=null; const n=Math.max(1,S.jail.until-S.day); doNext(n); }
});

