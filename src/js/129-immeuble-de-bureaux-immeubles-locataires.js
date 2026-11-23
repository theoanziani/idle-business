/* ============================================================
   IMMEUBLE DE BUREAUX : immeubles, locataires, prospects, achats (V1.5.2)
   ============================================================ */
function ofBt(b,lab,act,arg,o){ return '<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o&&o.dis?' disabled':'')+'>'+lab+'</button>'; }
const OF_RISK=['Solide','Correct','Fragile'];
function ofStrip(b,B){ const m=b.m; return '<div class="of-strip" aria-label="'+B.fl.filter(Boolean).length+' étages loués sur '+B.nf+'">'+B.fl.map((t,i)=>{ const T=t&&m.tn.find(x=>x.id===t); return '<i class="'+(T? (T.sat<40?'bad':'on') : '')+'" title="Étage '+(i+1)+(T?' : '+esc(T.n):' : libre')+'"></i>'; }).join('')+'</div>'; }
MET.office.html=function(b){
  const m=b.m, can=x=>mAvail(b)>=x;
  /* immeubles */
  let h='<div class="pk-head"><b>Immeubles</b><span class="sub">'+m.bd.length+' immeuble'+(m.bd.length>1?'s':'')+' · '+m.bd.reduce((a,B)=>a+B.nf,0)+' étages</span></div><div class="ht-t">';
  m.bd.forEach(B=>{ const x=B.st||ofBdDay(b,B), wk=ofWorks(B)? OF_WORK[B.wk.k].n+' jusqu’au '+dateL(B.wk.until) : '';
    h+='<div class="rs-d of-bd"><div><b>'+esc(B.n)+(B.main?' (siège)':'')+'</b><small>'+esc(ofDist(b,B.dist).n)+' · '+B.nf+' étages de '+fmtN(Math.round(ofM2f(B)),0)+' m² · standing « '+OF_STD[B.std]+' » · état '+Math.round(B.cond)+' %'+(B.lbl?' · label énergie':'')+'</small>'+ofStrip(b,B)+
      '<small>Loyer de marché '+eur(ofMkt(b,B),0)+' / m² par an · résultat <b class="num '+cls(x.net)+'">'+signed(x.net,0)+' / j</b>'+(wk?' · '+wk:'')+'</small>'+
      '<div class="tag">Services</div><div class="fm-a">'+Object.keys(OF_SRV).map(k=>ofSrvOn(B,k)? ofBt(b,'Fermer : '+OF_SRV[k].n.toLowerCase(),'srv',B.id+':'+k,{c:'sm ghost'}) : ofBt(b,OF_SRV[k].n+' · '+eur(ofSrvCost(B,k),0),'srv',B.id+':'+k,{c:'sm',dis:!can(ofSrvCost(B,k))})).join('')+'</div>'+
      (ofWorks(B)? '' : '<div class="tag">Travaux</div><div class="fm-a">'+Object.keys(OF_WORK).filter(k=>!(k==='lbl'&&(B.lbl||B.std<3))&&!(k==='reno'&&B.std>=(m.pre?5:4))).map(k=>{ const c=Math.round(OF_WORK[k].c(B)*(m.fm?.9:1)/1000)*1000; return ofBt(b,OF_WORK[k].n+' · '+eur(c,0),'work',B.id+':'+k,{c:'sm ghost',dis:!can(c)}); }).join('')+(B.main?'':ofBt(b,'Vendre ('+eur(ofValue(b,B)*.95,0)+')','sellb',B.id,{c:'sm ghost'}))+'</div>')+'</div></div>'; });
  h+='</div><div class="sub">Comment ça marche'+helpQ('Travaux dans les immeubles','Rafraîchissement : l’état remonte à 100 %. Rénovation lourde : un cran de standing (loyers plus élevés). Label énergie : charges −15 % et loyers +8 %, dès le standing « Haut de gamme ». Pendant les travaux, aucun nouveau locataire et des occupants moins satisfaits.')+'</div>';
  /* prospects */
  h+='<div class="pk-head"><b>Sociétés intéressées</b><span class="sub">'+m.pr.length+' en recherche'+(ofEv(m,'tt')?' · télétravail':'')+'</span></div><div class="ht-t">';
  h+=m.pr.length? m.pr.slice().sort((x,y)=>(y.gc-x.gc)||(y.mult-x.mult)).map(P=>{ const ok=m.bd.filter(B=>!ofWorks(B)&&B.std>=P.std&&ofFree(B).length>=P.k).sort((x,y)=>ofMkt(b,y)-ofMkt(b,x)).slice(0,2);
    return '<div class="rs-d"><div><b>'+esc(P.n)+(P.gc?' · grand compte':'')+'</b><small>'+P.k+' étage'+(P.k>1?'s':'')+' · standing « '+OF_STD[P.std]+' » au moins · bail de '+P.yrs+' ans · '+OF_RISK[P.risk]+' · jusqu’au '+dateS(P.exp)+'</small>'+
      (ok.length? ok.map(B=>{ const r=ofMkt(b,B)*P.mult; return '<small>'+esc(B.n)+' : '+eur(r,0)+' / m² par an ('+Math.round(P.mult*100)+' % du marché)</small><div class="fm-a">'+ofBt(b,'Louer','lease',P.id+':'+B.id+':0',{c:'sm pri'})+ofBt(b,'Négocier +8 %','lease',P.id+':'+B.id+':1',{c:'sm ghost'})+'</div>'; }).join('')
        : '<small>'+(m.bd.some(B=>B.std>=P.std)? 'Pas assez d’étages libres pour le moment dans vos immeubles « '+OF_STD[P.std]+' » ou plus.' : 'Standing insuffisant : rénovez un immeuble ou achetez-en un « '+OF_STD[P.std]+' ».')+'</small>')+'</div></div>'; }).join('') : '<div class="sub">Personne pour le moment : de nouvelles sociétés se présentent régulièrement.</div>';
  h+='</div><div class="sub">Comment ça marche'+helpQ('Négocier un bail','Négocier fait gagner 8 % de loyer, mais une société sur deux refuse et cherche ailleurs. Une société fragile peut faire faillite.')+'</div>';
  /* locataires */
  h+='<div class="pk-head"><b>Locataires</b><span class="sub">'+m.tn.length+(m.tn.length>1?' baux':' bail')+'</span></div><div class="ht-t">';
  m.tn.slice().sort((x,y)=>x.until-y.until).forEach(t=>{ const B=ofBd(b,t.bd);
    h+='<div class="rs-d"><div><b>'+esc(t.n)+'</b><small>'+esc(B?B.n:'')+' · '+t.fl.length+' étage'+(t.fl.length>1?'s':'')+' · '+eur(t.r,0)+' / m² par an · fin du bail le '+dateL(t.until)+'</small><div class="row sp"><span>'+pill('Satisfaction '+Math.round(t.sat),t.sat<40?'bad':t.sat<60?'warn':'good')+'</span>'+ofBt(b,'Faire partir','evict',t.id,{c:'sm ghost'})+'</div></div></div>'; });
  h+='</div><div class="sub">Comment ça marche'+helpQ('Fin des baux','À la fin du bail, un locataire satisfait renouvelle (au loyer du marché). Faire partir un locataire coûte six mois de loyer.')+'</div>';
  /* immeubles à vendre */
  h+='<div class="pk-head"><b>Immeubles à vendre</b><span class="sub">'+esc(D.CITIES[b.city].n)+'</span></div><div class="ht-t">';
  h+=m.bo.map(o=>'<div class="rs-d"><div><b>'+esc(o.n)+'</b><small>'+esc(ofDist(b,o.dist).n)+' · '+o.nf+' étages · '+fmtN(o.m2,0)+' m² · « '+OF_STD[o.std]+' » · état '+o.cond+' % · '+o.occ+' étage'+(o.occ>1?'s':'')+' déjà loué'+(o.occ>1?'s':'')+' · jusqu’au '+dateS(o.exp)+'</small><div class="fm-a">'+ofBt(b,'Acheter : '+eur(o.price,0),'buyb',o.id,{c:'sm',dis:!can(o.price)||m.bd.length>=8})+'</div></div></div>').join('')+'</div>';
  return h;
};

