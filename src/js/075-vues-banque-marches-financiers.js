/* ============================================================
   VUES : banque, marchés financiers
   ============================================================ */
function vBank(){
  const B=S.bank;
  let h=head('Banque','Collectez des dépôts, prêtez avec discernement et gardez de la liquidité. Tous les revenus et frais passent par votre compte unique.');
  if(!B.lic){
    const lc=D.BANK.licenceCost*(1+B.failed), need=lc+D.BANK.minCapital;
    h+='<div class="grid g2">'+card('Licence bancaire',
      '<div class="stack"><p style="margin:0">Une banque transforme les dépôts de ses clients en prêts. Elle gagne l’écart entre les taux, plus des frais de tenue de compte et de paiement, et supporte les défauts, la volatilité des marchés et le risque de panique.</p>'+
      '<div class="mini"><div><span>Licence (non remboursable)</span><b>'+eur(lc,0)+'</b></div><div><span>Capital initial</span><b>'+eur(D.BANK.minCapital,0)+'</b></div><div><span>Total requis</span><b>'+eur(need,0)+'</b></div></div>'+
      (B.failed?'<div class="notice bad">Votre précédente banque a fait faillite : la nouvelle licence coûte plus cher.</div>':'')+
      (unlocked(D.BANK.tier)? '' : '<div class="notice">Disponible à partir du palier <b>'+D.TIERS[D.BANK.tier].n+'</b> ('+eur(D.TIERS[D.BANK.tier].nw,0)+' de valeur nette).</div>')+
      '<div>'+btn('Obtenir la licence : '+eur(need,0),'banklic',{c:'pri',dis:!unlocked(D.BANK.tier)||S.cash<need,why:!unlocked(D.BANK.tier)?'Palier « '+D.TIERS[D.BANK.tier].n+' » requis.':undefined})+'</div></div>')+
      card('Règles du métier','<ul style="margin:0;padding-left:18px" class="stack"><li><b>Réserves obligatoires</b> : la loi impose de garder un pourcentage des dépôts en liquidités ('+pct(S.laws.reserve,0)+' actuellement).</li><li><b>Fonds propres</b> : vos prêts ne peuvent pas dépasser '+Math.round(1/CAPR)+' fois vos fonds propres.</li><li><b>Taux</b> : un taux de dépôt attractif attire de l’argent, un taux de prêt élevé fait fuir les emprunteurs.</li><li><b>Notation A à E</b> : les profils risqués paient plus mais font plus souvent défaut.</li><li><b>Panique bancaire</b> : une mauvaise réputation ou des réserves trop faibles peuvent déclencher des retraits massifs.</li><li>Les agences sont fermées le week-end.</li></ul>')+'</div>';
    return h;
  }
  const req=bankReq(), eq=bankEquity(), L=bankLoans(), cap=bankCapacity();
  if(B.run.d>0) h+='<div class="notice bad"><b>Panique bancaire en cours.</b> Vos clients retirent leurs dépôts. Injectez du capital pour tenir la réserve.</div>';
  if(B.res<req) h+='<div class="notice bad"><b>Réserve insuffisante.</b> Il manque '+eur(req-B.res,0)+' pour atteindre le minimum légal. Une pénalité s’applique chaque jour.</div>';
  if(B.cb>0) h+='<div class="notice">Facilité de liquidité de la banque centrale utilisée : <b>'+eur(B.cb,0)+'</b> (taux '+fmtN(S.macro.rate+5,1)+' %). Elle est remboursée dès que la réserve le permet.</div>';
  if(B.dep>10000 && eq/B.dep<0.04) h+='<div class="notice">Fonds propres faibles ('+pct(eq/B.dep)+' des dépôts) : les clients hésitent à déposer et le risque de panique augmente.</div>';
  const net=B.st.intIn-B.st.intOut+B.st.fees-B.st.wage;
  h+='<div class="card"><div class="mini">'+
    '<div><span>Dépôts clients</span><b class="num">'+eur(B.dep,0)+'</b></div>'+
    '<div><span>Prêts en cours</span><b class="num">'+eur(L,0)+'</b></div>'+
    '<div><span>Réserve (min. '+eur(req,0)+')</span><b class="num '+(B.res<req?'neg':'')+'">'+eur(B.res,0)+'</b></div>'+
    '<div><span>Fonds propres</span><b class="num '+(eq<CAPR*L?'neg':'')+'">'+eur(eq,0)+'</b></div>'+
    '<div><span>Capacité de prêt</span><b class="num">'+eur(cap,0)+'</b></div>'+
    '<div><span>Réputation</span><b>'+Math.round(B.rep)+' / 100</b></div>'+
    '<div><span>Résultat cumulé</span><b class="num '+cls(net-B.st.loss)+'">'+signed(net-B.st.loss,0)+'</b></div>'+
    '</div></div>';
  /* pilotage */
  h+='<div class="grid g2">'+card('Pilotage',
    '<div class="stack"><div class="stack"><label for="sl-rd"><b>Taux des dépôts</b> : <span id="lb-rd" class="num">'+B.rd.toFixed(1)+' %</span> <span class="sub">(marché : '+fmtN(S.macro.rate,1)+' %)</span></label><input type="range" id="sl-rd" min="0" max="12" step="0.1" value="'+B.rd+'" data-live="lb-rd" data-fmt="p1" data-ch="setrd"></div>'+
    '<div class="stack"><label for="sl-rl"><b>Taux de base des prêts</b> : <span id="lb-rl" class="num">'+B.rl.toFixed(1)+' %</span> <span class="sub">(+ prime de risque selon la note)</span></label><input type="range" id="sl-rl" min="2" max="25" step="0.1" value="'+B.rl+'" data-live="lb-rl" data-fmt="p1" data-ch="setrl"></div>'+
    '<div class="row"><b>Frais bancaires</b><div class="seg">'+['Bas','Standard','Élevés'].map((t,i)=>'<button class="'+(B.fees===i?'on':'')+'" data-a="bankfees" data-v="'+i+'">'+t+'</button>').join('')+'</div></div>'+
    '<div class="row"><b>Campagne marketing</b><div class="seg">'+[0,1,2,3].map(i=>'<button class="'+(B.mk===i?'on':'')+'" data-a="bankmkt" data-v="'+i+'" title="'+eur(D.BANK.mktCost[i]*(1+0.5*tierNow()),0)+' / jour">'+['Aucune','Légère','Forte','Massive'][i]+'</button>').join('')+'</div></div>'+
    '<div class="row sp"><span><b>'+B.br+'</b> agence(s) · <b>'+B.atm+'</b> distributeur(s)</span><span class="row">'+btn('Agence : '+eur(D.BANK.branchCost*(1+0.15*(B.br-1)),0),'bankbranch',{c:'sm'})+btn('Distributeur : '+eur(D.BANK.atmCost,0),'bankatm',{c:'sm'})+'</span></div></div>')+
    card('Capital et crédit',
    '<div class="stack"><div class="sub"></div><div class="row"><label for="in-cap" class="sr">Montant</label><input class="inp w" id="in-cap" inputmode="numeric" placeholder="Montant en €" value="'+(ui.qty.cap||'')+'">'+btn('Injecter','bankinj',{c:'sm pri'})+btn('Retirer','bankwd',{c:'sm'})+'</div>'+
    '<div class="sep"></div><b>Politique de crédit</b>'+
    '<div class="row"><label class="row"><input type="checkbox" id="ck-auto" data-ch="polauto" '+(B.pol.auto?'checked':'')+'> Accepter automatiquement les dossiers conformes</label></div>'+
    '<div class="row"><label for="sel-g">Note minimale</label><select class="btn sm" id="sel-g" data-ch="polg">'+D.BANK.grades.map(g=>'<option value="'+g+'" '+(B.pol.minG===g?'selected':'')+'>'+g+'</option>').join('')+'</select><label for="in-minc">Garantie minimale</label><input class="inp" id="in-minc" type="number" min="0" max="100" step="5" value="'+B.pol.minC+'" data-ch="polc" style="width:70px"> %</div>'+
    '<div class="sub"></div></div>');
  h+='</div>';
  /* dossiers */
  h+=card('Dossiers de prêt ('+B.apps.length+')',
    !bankOpen()? '<div class="notice">Agences fermées le week-end.</div>' : '' )
    .replace('</section>', (B.apps.length? '<div class="tw"><table class="tbl"><thead><tr><th>Client</th><th>Type</th><th class="r">Montant</th><th class="r">Durée</th><th>Note</th><th class="r">Garantie</th><th class="r">Taux proposé</th><th class="r">Taux max. client</th><th></th></tr></thead><tbody>'+
      B.apps.map(a=>{ const r=appRate(a), refus=r>a.max;
        return '<tr><td>'+esc(a.n)+'</td><td>'+a.lab+'</td><td class="r num">'+eur(a.amt,0)+'</td><td class="r num">'+a.term+' j</td><td><span class="pill '+(a.g<='B'?'good':a.g==='C'?'warn':'bad')+'">'+a.g+'</span></td><td class="r num">'+a.c+' %</td><td class="r num '+(refus?'neg':'')+'">'+r.toFixed(1)+' %</td><td class="r num">'+a.max.toFixed(1)+' %</td><td class="r"><div class="row" style="justify-content:flex-end;gap:4px">'+btn('Accorder','bankacc',{c:'sm pri',i:a.id,dis:!bankOpen()||refus})+btn('Refuser','bankref',{c:'sm ghost',i:a.id})+'</div></td></tr>'; }).join('')+'</tbody></table></div>' : '<div class="sub">Aucun dossier en attente.</div>')+'</section>');
  /* portefeuille de prêts */
  const byG={}; B.loans.forEach(l=>{ const o=byG[l.g]||(byG[l.g]={n:0,p:0,r:0}); o.n++; o.p+=l.p; o.r+=l.p*l.r; });
  h+='<div class="grid g2">'+card('Portefeuille de prêts',
    L>0? '<div class="tw"><table class="tbl"><thead><tr><th>Note</th><th class="r">Dossiers</th><th class="r">Encours</th><th class="r">Taux moyen</th></tr></thead><tbody>'+D.BANK.grades.filter(g=>byG[g]).map(g=>'<tr><td>'+g+'</td><td class="r num">'+byG[g].n+'</td><td class="r num">'+eur(byG[g].p,0)+'</td><td class="r num">'+(byG[g].r/byG[g].p).toFixed(1)+' %</td></tr>').join('')+'</tbody></table></div><div class="sub" style="margin-top:6px">Pertes cumulées sur défauts : <b class="neg">'+eur(B.st.loss,0)+'</b> · Intérêts perçus : <b>'+eur(B.st.intIn,0)+'</b></div>' : '<div class="sub">Aucun prêt en cours.</div>')+
    card('Placements de la banque',
    (()=>{ const it=[]; ['stock','bond','crypto'].forEach(c=>{ for(const id in S.pf.bank[c]){ const a=assetInfo(c,id); if(a) it.push('<tr><td>'+esc(a.name)+'</td><td class="r num">'+fmtN(S.pf.bank[c][id].q,c==='crypto'?4:0)+'</td><td class="r num">'+eur(S.pf.bank[c][id].q*a.p,0)+'</td></tr>'); } });
      return (it.length? '<div class="tw"><table class="tbl"><thead><tr><th>Actif</th><th class="r">Quantité</th><th class="r">Valeur</th></tr></thead><tbody>'+it.join('')+'</tbody></table></div>' : '<div class="sub">Aucun placement.</div>')+'<div style="margin-top:8px">'+btn('Ouvrir les marchés','tab',{c:'sm',i:'markets'})+'</div>'; })())+'</div>';
  h+=card('Personnel bancaire',staffPanel(B.ent,'bank')+'<div class="sub" style="margin-top:6px"></div>');
  return h;
}

/* ---------- Marchés ---------- */
const MK_TABS=[['savings','Épargne et obligations'],['stocks','Actions'],['crypto','Cryptomonnaies'],['vc','Capital-risque']];
function chg(arr){ if(!arr||arr.length<2) return 0; return arr[arr.length-1]/arr[arr.length-2]-1; }
function assetRow(cls,id,name,subtxt,price,hist,lock,extra){
  const k=holdKey(cls,id), pos=S.pf[ui.owner][cls][k], val=pos? pos.q*price:0, pl=pos? val-pos.cost:0, c=chg(hist);
  const open=cls==='crypto'||marketsOpen();
  return '<div class="asset '+(lock?'lock':'')+'"><div class="nm">'+(cls==='bond'?'<b>'+esc(name)+'</b>':'<button class="lnk" data-a="assetopen" data-i="'+cls+'" data-j="'+esc(id)+'"><b>'+esc(name)+'</b></button>')+'<small>'+subtxt+'</small></div>'+
    '<div class="pr"><div class="num"><b>'+eur(price,price<10?4:2)+'</b></div><div class="num '+cls2(c)+'" style="font-size:12px">'+(c>=0?'+':'')+fmtN(c*100,2)+' %</div></div>'+
    '<div class="ch">'+spark(hist.slice(-60),110,30)+'</div>'+
    '<div class="pos">'+(pos? '<div class="num" style="font-size:12.5px">'+fmtN(pos.q,cls==='crypto'?4:0)+' unité(s) · '+eur(val,0)+'</div><div class="num '+cls2(pl)+'" style="font-size:12px">'+(pl>=0?'+':'−')+eur(Math.abs(pl),0)+'</div>' : '<span class="sub">Aucune position</span>')+(extra||'')+'</div>'+
    '<div class="acts">'+(lock? '<span class="sub">Palier '+D.TIERS[lock].n+'</span>' :
      '<label class="sr" for="amt-'+cls+'-'+id+'">Montant à investir</label><input class="inp" id="amt-'+cls+'-'+id+'" inputmode="numeric" placeholder="€" value="'+(ui.qty[cls+id]||'')+'" data-q="'+cls+id+'">'+btn('Acheter','buy',{c:'sm pri',i:cls,j:id,dis:!open,why:'Marché fermé.'})+
      (pos? btn('¼','sell',{c:'sm ghost',i:cls,j:id,v:.25,dis:!open})+btn('½','sell',{c:'sm ghost',i:cls,j:id,v:.5,dis:!open})+btn('Tout','sell',{c:'sm ghost',i:cls,j:id,v:1,dis:!open}) : ''))+'</div></div>';
}
const cls2 = n => n>0.00005?'pos':n<-0.00005?'neg':'dim';
function vMarkets(){
  const t=ui.sub.markets;
  let h=head('Marchés financiers','Les cours suivent des modèles simulés influencés par la conjoncture, les lois et l’actualité.');
  h+='<div class="row sp"><div class="tabs">'+MK_TABS.map(x=>'<button class="'+(t===x[0]?'on':'')+'" data-a="mksub" data-i="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
    (S.bank.lic && t!=='vc'? '<div class="row"><span class="sub">Ordres pour :</span><div class="seg"><button class="'+(ui.owner==='player'?'on':'')+'" data-a="owner" data-i="player">Mon compte</button><button class="'+(ui.owner==='bank'?'on':'')+'" data-a="owner" data-i="bank">La banque</button></div></div>':'')+'</div>';
  if(t!=='vc' && !S.bank.lic) ui.owner='player';
  if(t!=='crypto' && t!=='vc' && !marketsOpen()) h+='<div class="notice">Bourse fermée jusqu’à lundi (crypto ouverte).</div>';
  if(ui.owner==='bank' && t!=='vc') h+='<div class="notice info">Ordres payés par la <b>réserve de la banque</b> : '+eur(S.bank.res-bankReq(),0)+' disponibles.</div>';
  if(t==='savings'){
    h+=card('Livret d’épargne','<div class="row sp"><div class="mini" style="flex:1"><div><span>Solde</span><b class="num">'+eur(S.livret.bal,0)+'</b></div><div><span>Taux annuel</span><b>'+fmtN(livretRate(),2)+' %</b></div></div><div class="row"><label class="sr" for="in-liv">Montant</label><input class="inp" id="in-liv" inputmode="numeric" placeholder="€" value="'+(ui.qty.liv||'')+'" data-q="liv">'+btn('Déposer','livdep',{c:'sm pri'})+btn('Retirer','livwd',{c:'sm'})+'</div></div><div class="sub"></div>');
    h+=card('Obligations','<div class="sub" style="margin-bottom:6px"></div>'+
      S.mk.bonds.slice().sort((a,b)=>bondDef(a).tier-bondDef(b).tier||bondDef(a).term-bondDef(b).term).map(b=>{ const d=bondDef(b); return assetRow('bond',b.uid,d.n+(b.dflt?' (en défaut)':''),d.kind+' · coupon '+b.cpn.toFixed(2)+' % · échéance dans '+Math.max(0,b.mat-S.day)+' j',b.price,b.hist,unlocked(d.tier)?0:d.tier); }).join(''));
  }
  if(t==='stocks'){
    h+=card('Actions','<div class="sub" style="margin-bottom:6px"></div>'+
      D.stocks.map((d,i)=>{ const st=S.mk.stocks[i]; return assetRow('stock',d.id,d.n+' ('+d.id+')',D.SECTORS[d.sec]+(d.intl?' · international':'')+' · rendement '+d.y.toFixed(1)+' %',st.price,st.hist,unlocked(d.tier)?0:d.tier); }).join(''));
  }
  if(t==='crypto'){
    h+=card('Cryptomonnaies','<div class="sub" style="margin-bottom:6px"></div>'+
      D.crypto.map((d,i)=>{ const c=S.mk.crypto[i]; return assetRow('crypto',d.id,d.n+' ('+d.id+')','Volatilité quotidienne ~'+Math.round(d.vol*100)+' %',c.price,c.hist,unlocked(d.tier)?0:d.tier); }).join(''));
  }
  if(t==='vc') h+=vVC();
  if(t==='stocks'||t==='crypto') h+=ordersCard(t==='stocks'?'stock':'crypto');
  if(t==='savings') h+=saveCard();
  return h;
}
function vVC(){
  if(!unlocked(2)) return '<div class="notice">Le capital-risque est accessible à partir du palier <b>'+D.TIERS[2].n+'</b> ('+eur(D.TIERS[2].nw,0)+').</div>';
  let h='<div class="notice info"></div>';
  h+=card('Start-ups à financer','<div class="grid">'+S.vc.offers.map(o=>'<div class="card" style="box-shadow:none"><div class="row sp"><b>'+esc(o.name)+'</b>'+pill('Signal : '+o.sig,o.sig==='Forte'?'good':o.sig==='Solide'?'info':'warn')+'</div><div class="sub">'+o.sec+' · valorisation '+eur(o.val,0)+' · offre valable '+Math.max(0,o.exp-S.day)+' j</div><div class="row" style="margin-top:8px"><label class="sr" for="in-vc'+o.id+'">Ticket</label><input class="inp" id="in-vc'+o.id+'" inputmode="numeric" placeholder="2 000 à '+fmtN(o.val*0.2)+' €" data-q="vc'+o.id+'" value="'+(ui.qty['vc'+o.id]||'')+'">'+btn('Investir','vcinv',{c:'sm pri',i:o.id})+'</div></div>').join('')+'</div>');
  const mine=S.vc.mine;
  h+=card('Mon portefeuille de start-ups',mine.length? '<div class="tw"><table class="tbl"><thead><tr><th>Start-up</th><th>Tour</th><th class="r">Part</th><th class="r">Mise</th><th class="r">Valeur estimée</th><th>État</th><th></th></tr></thead><tbody>'+mine.map(v=>'<tr><td>'+esc(v.name)+'<div class="sub">'+v.sec+'</div></td><td>'+VC_STAGES[v.stage]+'</td><td class="r num">'+fmtN(v.stake*100,2)+' %</td><td class="r num">'+eur(v.inv,0)+'</td><td class="r num">'+(v.st==='active'?eur(v.stake*v.val,0):v.st==='exit'?eur(v.out,0):v.st==='sold'?eur(v.out,0):'0 €')+'</td><td>'+(v.st==='active'?pill('Prochain tour dans '+Math.max(0,v.next-S.day)+' j','info'):v.st==='exit'?pill('Sortie','good'):v.st==='sold'?pill('Cédée',''):pill('Faillite','bad'))+'</td><td class="r">'+(v.st==='active'?btn('Céder ('+eur(v.stake*v.val*(v.stage>=1?.6:.5),0)+')','vcsell',{c:'sm ghost',i:v.id}):'')+'</td></tr>').join('')+'</tbody></table></div>' : '<div class="sub">Aucune participation.</div>');
  return h;
}

