/* ============================================================
   V2 phase 2 : rivaux, guerres des prix, rachats, débauchage
   ============================================================ */
const WARR=[['hold','Subir','Ventes −16 % × gravité'],['match','Aligner les prix','Prix −10 %, ventes −5 % × gravité'],['camp','Campagne','Ventes −7 % × gravité, 2 % de coût/jour']];
const warsFor0 = k => rivInit().wars.some(w=>w.key===k);
function rivBadge(){ const R=S.riv; if(!R) return 0; return R.offers.length+R.wars.filter(w=>w.resp==='hold').length; }
function vRivals(){
  const R=rivInit(); let h=head('Rivaux');
  /* guerres des prix */
  /* V2.0.7 : vos guerres des prix */
  if((R.att||[]).length) h+=card('Vos guerres des prix','<div class="stack">'+R.att.map(a=>{ const r=rivDef(a.rival), v=R.rv[a.rival];
    return '<div class="war"><div class="row sp"><div><b>Contre '+esc(r.n)+'</b><div class="sub">'+esc(keyLabel(a.key))+'</div></div>'+pill('encore '+a.left+' j',a.rip?'warn':'good')+'</div>'+
      '<div class="sub">Vos prix −12 %, vos ventes +'+(a.rip?5:10)+' %. Présence du rival : '+fmtN(v.pres[a.key]||0,2)+(a.rip?' · il riposte : effets réduits de moitié':'')+'.</div></div>'; }).join('')+'</div>');
  h+=card('Guerres des prix', R.wars.length? '<div class="stack">'+R.wars.map(w=>{ const r=rivDef(w.rival);
    return '<div class="war"><div class="row sp"><div><b>'+esc(r.n)+'</b><div class="sub">'+esc(keyLabel(w.key))+'</div></div>'+pill('encore '+w.left+' j','warn')+'</div>'+
      '<div class="row">'+dots(Math.round(w.sev*2.5),5)+'<span class="sub">Gravité '+w.sev.toFixed(1)+'</span></div>'+
      '<div class="seg" role="group" aria-label="Riposte">'+WARR.map(x=>'<button class="'+(w.resp===x[0]?'on':'')+'" data-a="warresp" data-i="'+w.id+'" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
      '<div class="sub">'+WARR.find(x=>x[0]===w.resp)[2]+'.</div></div>'; }).join('')+'</div>' : '<div class="sub">Aucune guerre des prix en cours.</div>');
  /* offres de rachat */
  if(R.offers.length) h+=card('Offres de rachat','<div class="stack">'+R.offers.map(o=>{ const b=S.biz.find(x=>x.id===o.b); if(!b) return '';
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:180px"><b>'+esc(b.name)+'</b><div class="sub">'+esc(rivDef(o.rival).n)+' offre <b>'+eur(o.price,0)+'</b> (cession ordinaire : '+eur(sellPrice(b),0)+'). Reste '+Math.max(0,o.exp-S.day)+' j.</div></div><div class="row">'+btn('Accepter','offeracc',{c:'sm pri',i:o.id})+btn('Refuser','offerref',{c:'sm ghost',i:o.id})+'</div></div>'; }).join('')+'</div>');
  /* rachats */
  h+=card('Commerces à racheter', R.deals.length? '<div class="stack">'+R.deals.map(x=>{ const d=D.biz[x.def], C=D.CITIES[x.city], dd=C.d.find(y=>y.id===x.dist);
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:180px"><b>'+esc(d.n)+'</b> · niveau '+x.lvl+'<div class="sub">'+esc(dd.n)+', '+esc(C.n)+' · cédé par '+esc(rivDef(x.rival).n)+' · reste '+Math.max(0,x.exp-S.day)+' j</div></div>'+btn('Racheter '+eur(x.price,0),'dealbuy',{c:'sm pri',i:x.id,dis:availFor(C.ccy)<x.price})+'</div>'; }).join('')+'</div>'+'<div class="sub">Ouvre aussitôt, avec une équipe de départ, et affaiblit le rival.</div>' : '<div class="sub">Aucune offre pour le moment. Les concurrents cèdent des commerces tous les 20 jours environ.</div>');
  /* débauchage */
  const ents=S.biz.filter(b=>b.status==='active');
  h+=card('Talents à débaucher', !ents.length? '<div class="sub">Lancez d’abord une société.</div>' : R.talents.length? '<div class="stack">'+R.talents.map(t=>{
    const targets=ents.filter(e=>{ const sl=entRoles(e).find(r=>r[0]===t.role); return sl&&((e.staff[t.role]||{n:0}).n<sl[1]); }).slice(0,3);
    return '<div class="agc"><div class="who"><b>'+esc(t.name)+'</b>'+pill(D.ROLES[t.role].s)+pill(esc(rivDef(t.rival).n),'info')+'</div><div class="st"><span>Product.</span><b>'+prodNote(t.prod)+'</b></div><div class="st"><span>Fiabilité</span><b>'+Math.round(t.rel*100)+' %</b></div>'+
      '<div class="hr">'+(targets.length? targets.map(e=>{ const c=talentCost(e,t); return btn('Recruter chez '+esc(e.name)+' · prime '+eur(c,0),'talhire',{c:'sm pri',i:t.id,j:'b'+e.id,dis:S.cash<c}); }).join('') : '<span class="sub">Aucun poste de ce type à pourvoir.</span>')+'</div></div>'; }).join('')+'</div><div class="sub">Renouvelés chaque lundi. La prime vaut 14 jours de salaire.</div>' : '<div class="sub">Nouveaux talents lundi.</div>');
  /* rivaux */
  { const keys=[...new Set(S.biz.filter(b=>b.status==='active').map(rivKey))];
    { const F=S.fcfold||{}, open=!!F.rv_mk, nw=keys.filter(k=>attOf(k)||warsFor0(k)).length;
      h+='<section class="card fcd-c"><details class="fcd ag-f" data-k="rv_mk"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>Vos marchés</span></h2><small>'+keys.length+' marché'+(keys.length>1?'s':'')+(nw? ' · '+nw+' en guerre' : '')+'</small></span></summary><div class="ht-t">'+(keys.length? '<div class="stack">'+keys.map(k=>{ const I=intensity(k), nc=ncOn(k);
      return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:170px"><b>'+esc(keyLabel(k))+'</b><div class="sub">Concurrence : '+intLabel(I)+(nc?' · contrat jusqu’au '+dateL(S.riv.nc[k]):'')+'</div></div>'+'<div class="row">'+(attOf(k)? pill('Guerre en cours','warn') : attRivals(k).length? btn('Guerre des prix','attopen',{c:'sm',i:k}) : '')+(nc? pill('Protégé','good') : btn('Non-concurrence : '+eur(ncPrice(k),0),'ncbuy',{c:'sm',i:k,dis:S.cash<ncPrice(k)}))+'</div></div>'; }).join('')+'</div><div class="sub">Un contrat de non-concurrence écarte les rivaux d’un marché pendant 90 jours.</div>' : '<div class="sub">Lancez d’abord une société.</div>')+'</div></details></section>'; }; }
  h=h.replace(head('Rivaux'),head('Rivaux')+magnatesCard());
  h+=card('Les rivaux','<div class="stack">'+D.RIVALS.filter(r=>!R.rv[r.id].gone).map(r=>{ const v=R.rv[r.id], ks=Object.keys(v.pres).filter(k=>cityVisible(k.split('|')[0])).sort((a,b)=>v.pres[b]-v.pres[a]);
    const mine=new Set(S.biz.map(rivKey));
    return '<div class="riv"><div class="row sp"><div><b>'+esc(r.n)+'</b><div class="sub">'+esc(r.st)+'</div></div><div style="text-align:right"><div class="tag">Agressivité</div>'+dots(r.ag,3)+'</div></div>'+
      '<div class="row sp"><span class="sub">Puissance</span><b class="num">'+fmtN(v.pow,2)+'</b></div>'+bar(v.pow/2.6,'a')+
      '<div class="row">'+ks.slice(0,6).map(k=>pill(esc(keyLabel(k)),mine.has(k)?'bad':'')).join('')+(ks.length>6?pill('+'+(ks.length-6)):'')+'</div>'+
      '<div>'+btn('Voir le groupe ('+shopsOf(r.id).length+' enseignes)','rivopen',{c:'sm',i:r.id})+'</div>'+'<div class="sub">Guerres lancées : '+v.wars+' · employés débauchés chez vous : '+v.poached+' · achats : '+v.bought+'</div></div>'; }).join('')+'</div><div class="sub">Les pastilles rouges sont les marchés où vous êtes en concurrence directe.</div>');
  return h;
}
Object.assign(ACT,{
  attopen:el=>{ ui.modal={type:'attk',k:el.dataset.i}; render(); },
  attgo:el=>{ const r=attLaunch(ui.modal&&ui.modal.k,el.dataset.v); if(r.ok) ui.modal=null; after(r); },
  warresp:el=>after(respondWar(+el.dataset.i,el.dataset.v)),
  offeracc:el=>{ const R=rivInit(), o=R.offers.find(x=>x.id===+el.dataset.i), b=o&&S.biz.find(x=>x.id===o.b); if(!b) return; ask('Accepter l’offre','Vendre <b>'+esc(b.name)+'</b> à '+esc(rivDef(o.rival).n)+' pour <b>'+eur(o.price,0)+'</b> ? Le personnel est licencié.','Vendre',()=>after(acceptOffer(o.id),'Société cédée.')); },
  offerref:el=>after(refuseOffer(+el.dataset.i)),
  dealbuy:el=>after(buyDeal(+el.dataset.i),'Commerce racheté.'),
  talhire:el=>after(hireTalent(+el.dataset.i,el.dataset.j))
});

/* V2.0.7 : fenêtre pour lancer une guerre des prix */
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='attk')) return _mc(); const k=m.k, why=attWhy(k), c=attCost(k), R=rivInit();
  return {title:'Guerre des prix',sm:true,body:'<div class="stack"><div><b>'+esc(keyLabel(k))+'</b><div class="sub">Pendant '+ATT_DAYS+' jours, vos sociétés de ce marché baissent leurs prix de 12 % et gagnent 10 % de clients. Le rival visé perd du terrain chaque jour, et de la puissance à la fin. S’il tombe à presque rien, il quitte le marché et ses enseignes ferment. Il peut riposter : les effets sont alors réduits de moitié et il lance sa propre guerre.</div></div>'+
    (why? '<div class="notice bad">'+esc(why)+'</div>' : attRivals(k).map(r=>{ const v=R.rv[r.id];
      return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:160px"><b>'+esc(r.n)+'</b><div class="sub">Présence '+fmtN(v.pres[k],2)+' · puissance '+fmtN(v.pow,2)+' · riposte '+Math.round((.25+.1*r.ag)*100)+' %</div></div>'+btn('Attaquer · '+eur(c,0),'attgo',{c:'sm pri',v:r.id,dis:S.cash<c})+'</div>'; }).join(''))+
    '<div class="sub">Coût de lancement : '+eur(c,0)+'. Ensuite, 60 jours de répit avant une nouvelle guerre sur ce marché.</div></div>'}; }; }

