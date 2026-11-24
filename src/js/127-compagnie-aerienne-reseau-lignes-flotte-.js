/* ============================================================
   COMPAGNIE AÉRIENNE : réseau, lignes, flotte, tours de contrôle (V1.3.1)
   ============================================================ */
const alX=lon=>lon+180, alY=lat=>90-lat;
function alMap(b){
  const m=b.m, land=typeof YS_GEO!=='undefined'? '<path class="land" d="'+YS_GEO.land+Object.values(YS_GEO.c).join('')+'"/>' : '';
  const ln=m.ln.map(l=>{ const A=alAp(l.a), B=alAp(l.b); if(Math.abs(A.lon-B.lon)>180) return ''; return '<line x1="'+alX(A.lon)+'" y1="'+alY(A.lat)+'" x2="'+alX(B.lon)+'" y2="'+alY(B.lat)+'" class="al-l'+(alDist(l.a,l.b)>3500?' lg':'')+'"/>'; }).join('');
  const dests=new Set(m.ln.flatMap(l=>[l.a,l.b]));
  const pts=Object.values(AL_AP).filter(a=>a.hub||dests.has(a.id)).map(a=>{ const own=m.hubs.includes(a.id); return '<circle cx="'+alX(a.lon)+'" cy="'+alY(a.lat)+'" r="'+(own?2.2:a.hub?1.4:1)+'" class="al-p'+(own?' own':a.hub?' hub':'')+'"/>'; }).join('');
  return '<div class="ys-map al-map"><svg viewBox="0 4 360 146" role="img" aria-label="Carte de votre réseau">'+land+ln+pts+'</svg></div><div class="sub">Comment ça marche'+helpQ('Carte des lignes aériennes','Points pleins : vos plateformes. Petits points : autres grands aéroports. Traits : vos lignes (en pointillé, le long-courrier).')+'</div>';
}
function alBt(b,lab,act,arg,o){ return '<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o&&o.dis?' disabled':'')+(o&&o.l?' aria-label="'+esc(o.l)+'"':'')+'>'+lab+'</button>'; }
MET.airline.html=function(b){
  const m=b.m, can=x=>mAvail(b)>=x;
  let h='<div class="pk-head"><b>Réseau</b><span class="sub">'+m.hubs.length+' plateforme'+(m.hubs.length>1?'s':'')+' · '+m.ln.length+' ligne'+(m.ln.length>1?'s':'')+'</span></div>'+alMap(b);
  /* lignes */
  h+='<div class="pk-head"><b>Lignes</b><span class="sub">'+(m.ln.length? m.ln.length+' en service' : 'Aucune ligne')+'</span></div><div class="ht-t">';
  m.ln.forEach(l=>{ const x=l.st||alLineDay(b,l,true), P=m.fl.filter(p=>p.ln===l.id), d=alDist(l.a,l.b);
    h+='<div class="rs-d"><div><b>'+esc(alAp(l.a).n)+' – '+esc(alAp(l.b).n)+'</b><small>'+fmtN(d,0)+' km · '+P.map(p=>AL_TY[p.t].n).join(', ')+' · '+alFreq(x.legs||0)+' · remplissage '+Math.round((x.lf||0)*100)+' %</small>'+
      '<small>Billet éco '+eur(alEco(d)*(AL_PRICE[l.p]||1),0)+' ('+Math.round((AL_PRICE[l.p]||1)*100)+' % du prix habituel) · affaires : '+['aucune','8 % de la cabine','15 % de la cabine'][l.cab]+' · résultat '+'<b class="num '+cls(x.net||0)+'">'+signed(x.net||0,0)+' / j</b>'+(x.strike?' · grève':'')+'</small>'+
      (ui.lnG!==l.id? '<div class="fm-a"><button class="btn sm" data-a="lng" data-i="'+l.id+'">Gérer</button></div>' : '<div class="fm-a">'+alBt(b,'Prix −','price',l.id+':'+Math.max(0,l.p-1),{c:'sm ghost',dis:l.p<=0})+alBt(b,'Prix +','price',l.id+':'+Math.min(3,l.p+1),{c:'sm ghost',dis:l.p>=3})+alBt(b,'Cabine','cab',l.id+':'+((l.cab+1)%3),{c:'sm ghost'})+
      '<button class="btn sm ghost" data-a="aladd" data-i="'+b.id+'" data-j="'+l.id+'">Ajouter un avion</button>'+alBt(b,'Fermer la ligne','close',l.id,{c:'sm ghost'})+'<button class="btn sm" data-a="lng" data-i="0">Terminé</button></div>')+'</div></div>'; });
  h+='</div><div><button class="btn sm pri" data-a="alnew" data-i="'+b.id+'">Ouvrir une ligne</button></div>';
  /* flotte */
  const idle=m.fl.filter(p=>!p.ln||!m.ln.some(l=>l.id===p.ln));
  h+='<div class="pk-head"><b>Flotte</b><span class="sub">'+m.fl.length+' avion'+(m.fl.length>1?'s':'')+(idle.length?' · '+idle.length+' au sol':'')+'</span></div><div class="ht-t">';
  m.fl.forEach(p=>{ const T=AL_TY[p.t], l=m.ln.find(x=>x.id===p.ln);
    h+='<div class="rs-d"><div><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+T.seats+' places · '+fmtN(T.rg,0)+' km · '+(p.own?'acheté':'loué '+eur(T.ls,0)+' / j')+'</small><small>'+(p.down>S.day? 'En panne encore '+(p.down-S.day)+' j' : l? 'Sur la ligne '+esc(alAp(l.a).n)+' – '+esc(alAp(l.b).n) : 'Au sol, sans ligne')+'</small>'+
      '<div class="fm-a">'+alBt(b,p.own?'Revendre ('+eur(T.pr*.7,0)+')':'Rendre','drop',p.id,{c:'sm ghost'})+'</div></div></div>'; });
  h+='</div><div class="pk-list">'+Object.entries(AL_TY).map(([k,T])=>'<div class="pk-o al-ty"><span><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+T.seats+' places · '+fmtN(T.rg,0)+' km</small></span><span class="row">'+
    alBt(b,'Louer '+eur(T.ls,0)+' / j','lease',k,{c:'sm',dis:!can(T.ls*30)})+alBt(b,'Acheter '+eur(T.pr,0),'buy',k,{c:'sm ghost',dis:!can(T.pr)})+'</span></div>').join('')+'</div>'+
    '<div class="sub">Comment ça marche'+helpQ('Avions : louer ou acheter','Une location demande un dépôt de 30 jours de loyer, rendu à la fin. Un avion acheté ne paie que son entretien et se revend 70 % de son prix.')+'</div>';
  /* tours de contrôle */
  h+='<div class="pk-head"><b>Tours de contrôle</b><span class="sub">Image de marque '+Math.round(m.img)+' / 100</span></div>';
  h+='<div class="sub">Comment ça marche'+helpQ('Places dans les tours','Une place dans la tour d’un grand aéroport permet d’en faire partir des lignes vers le même pays ou un pays voisin, et du long-courrier vers vos autres plateformes. L’image de marque monte avec les années, le réseau et le service.')+'</div>';
  Object.keys(AL_CT).forEach(ct=>{ const L=Object.values(AL_AP).filter(a=>a.hub&&AL_CO[a.co].ct===ct); if(!L.length) return;
    h+='<div class="tag">'+AL_CT[ct]+'</div><div class="ht-t">'+L.map(a=>{ const own=m.hubs.includes(a.id), req=alHubReq(b,a.id), c=alHubCost(a.id);
      if(own){ const n=(m.ext&&m.ext[a.id])||0; return '<div class="rs-d"><div><b>'+esc(a.n)+'</b><small>'+esc(AL_CO[a.co].n)+' · '+alHubUsed(b,a.id)+' / '+alHubCap(b,a.id)+' lignes</small><div class="fm-a">'+(n<3? alBt(b,'Créneaux : '+eur(alExtCost(b,a.id),0),'ext',a.id,{c:'sm',dis:!can(alExtCost(b,a.id))}) : pill('Créneaux au maximum','good'))+'</div></div></div>'; }
      return '<div class="rs-d"><div><b>'+esc(a.n)+'</b><small>'+esc(AL_CO[a.co].n)+' · '+a.sz+' M de passagers par an · image '+req+' requise</small><div class="fm-a">'+alBt(b,'Acheter : '+eur(c,0),'hub',a.id,{c:'sm',dis:m.img<req||!can(c)})+'</div></div></div>'; }).join('')+'</div>'; });
  return h;
};
/* ouvrir une ligne : plateforme, destination, avion */
ACT.alnew=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; ui.modal={type:'alnew', id:b.id, a:b.m.hubs.length===1?b.m.hubs[0]:null, to:null}; render(); };
ACT.alnewa=el=>{ const m=ui.modal; if(!m) return; m.a=el.dataset.v; m.to=null; render(); };
ACT.alnewb=el=>{ const m=ui.modal; if(!m) return; m.to=el.dataset.v; render(); };
ACT.alnewgo=el=>{ const m=ui.modal, b=S.biz.find(x=>x.id===m.id); if(!b) return; let pid=+el.dataset.v;
  if(el.dataset.t){ const r=alGet(b,el.dataset.t,false); if(!r.ok) return after(r); pid=b.m.fl[b.m.fl.length-1].id; }
  const r=alOpen(b,m.a,m.to,pid); if(!r.ok&&el.dataset.t) alDrop(b,pid); if(r.ok) ui.modal={type:'biz',id:b.id}; after(r); };
ACT.aladd=el=>{ ui.modal={type:'aladd', id:+el.dataset.i, l:+el.dataset.j}; render(); };
ACT.aladdgo=el=>{ const m=ui.modal, b=S.biz.find(x=>x.id===m.id); if(!b) return; let pid=+el.dataset.v;
  if(el.dataset.t){ const r=alGet(b,el.dataset.t,false); if(!r.ok) return after(r); pid=b.m.fl[b.m.fl.length-1].id; }
  const r=alAssign(b,m.l,pid); if(!r.ok&&el.dataset.t) alDrop(b,pid); if(r.ok) ui.modal={type:'biz',id:b.id}; after(r); };
/* V1.7.3 : estimation du résultat d'une ligne avant de l'ouvrir (avion loué ou au sol, prix normal) */
function alEst(b,a,to,t,pid){ const m=b.m; let p=pid? alPlane(b,pid) : null, tmp=null, old;
  if(!p){ tmp={id:-9,t,own:0,ln:-9}; m.fl.push(tmp); p=tmp; } else { old=p.ln; p.ln=-9; }
  let r; try{ r=alLineDay(b,{id:-9,a,b:to,p:1,cab:1},true); } finally{ if(tmp) m.fl.pop(); else p.ln=old; }
  return r; }
/* renfort d'une ligne existante : gain par jour d'un avion de plus */
function alAddEst(b,lid,t,pid){ const m=b.m, l=alLine(b,lid); if(!l) return null; const r0=alLineDay(b,l,true); let p=pid? alPlane(b,pid) : null, tmp=null, old;
  if(!p){ tmp={id:-9,t,own:0,ln:l.id}; m.fl.push(tmp); } else { old=p.ln; p.ln=l.id; }
  let r1; try{ r1=alLineDay(b,l,true); } finally{ if(tmp) m.fl.pop(); else p.ln=old; }
  return {net:r1.net-r0.net, lf:r1.lf, add:1}; }
function alEstFor(b,t,pid){ const M=ui.modal; if(!M) return ''; if(M.type==='alnew'&&M.a&&M.to) return alEstTxt(alEst(b,M.a,M.to,t,pid)); if(M.type==='aladd'&&M.l) return alEstTxt(alAddEst(b,M.l,t,pid)); return ''; }
function alEstTxt(r){ if(r&&r.add) return 'gain estimé '+signed(r.net,0)+' / j pour la ligne · remplissage '+Math.round((r.lf||0)*100)+' %'; if(!r) return ''; const low=r.net<0&&r.seats>1.6*r.want; return 'résultat estimé '+signed(r.net,0)+' / j · remplissage '+Math.round((r.lf||0)*100)+' %'+(low? ' · '+fmtN(Math.round(r.want))+' passagers / j pour '+fmtN(Math.round(r.seats))+' sièges : avion trop grand' : ''); }
function alBestEst(b,a,to){ const d=alDist(a,to); let best=null; Object.entries(AL_TY).forEach(([k,T])=>{ if(!alReach(k,d)) return; const r=alEst(b,a,to,k); if(!best||r.net>best.net) best=Object.assign({k},r); }); return best; }
function alPlaneChoice(b,d,act){ const m=b.m, idle=m.fl.filter(p=>(!p.ln||!m.ln.some(l=>l.id===p.ln))&&alReach(p.t,d)), can=x=>mAvail(b)>=x;
  return (idle.length? '<div class="tag">Avions au sol</div>'+idle.map(p=>'<button class="pk-o" data-a="'+act+'" data-v="'+p.id+'"><span><b>'+esc(AL_TY[p.t].n)+'</b><small>'+AL_TY[p.t].seats+' places · '+(p.own?'acheté':'loué')+(alStop(p.t,d)?' · avec escale':'')+'</small>'+'<small class="num">'+alEstFor(b,p.t,p.id)+'</small>'+'</span></button>').join('') : '')+
    '<div class="tag">Louer un avion pour cette ligne</div>'+Object.entries(AL_TY).filter(([k])=>alReach(k,d)).map(([k,T])=>'<button class="pk-o" data-a="'+act+'" data-v="0" data-t="'+k+'"'+(can(T.ls*30)?'':' disabled')+'><span><b>'+esc(T.n)+'</b><small>'+T.seats+' places · '+eur(T.ls,0)+' / j · dépôt '+eur(T.ls*30,0)+(alStop(k,d)?' · avec escale':'')+'</small>'+'<small class="num">'+alEstFor(b,k)+'</small>'+'</span></button>').join(''); }
{ const _mc=modalContent; modalContent=function(){ const M=ui.modal;
  if(M&&M.type==='alnew'){ const b=S.biz.find(x=>x.id===M.id); if(!b||!b.m){ ui.modal=null; return _mc(); } const m=b.m;
    let body='<button class="back" data-a="bizopen" data-i="'+b.id+'">‹ '+esc(b.name)+'</button>';
    body+='<div class="tag">Départ</div><div class="seg al-seg">'+m.hubs.map(h=>'<button class="'+(M.a===h?'on':'')+'" data-a="alnewa" data-v="'+h+'">'+esc(alAp(h).n)+' ('+alHubUsed(b,h)+'/'+alHubCap(b,h)+')</button>').join('')+'</div>';
    if(M.a&&alHubUsed(b,M.a)>=alHubCap(b,M.a)) body+='<div class="notice">Plus de créneau libre à '+esc(alAp(M.a).n)+' : achetez des créneaux dans « Tours de contrôle ».</div>';
    else if(M.a&&!M.to){ const L=alDests(b,M.a).filter(x=>!alCanLine(b,M.a,x.id)).map(x=>{ const d=alDist(M.a,x.id), l={id:-1,a:M.a,b:x.id,p:1,cab:1}; return {x,d,e:alBestEst(b,M.a,x.id)}; }).sort((p,q)=>(q.e?q.e.net:0)-(p.e?p.e.net:0));
      body+='<div class="tag">Destination</div><div class="pk-list">'+(L.length? L.map(({x,d,e})=>'<button class="pk-o'+(x.hub&&m.hubs.includes(x.id)?' match':'')+'" data-a="alnewb" data-v="'+x.id+'"><span><b>'+esc(x.n)+'</b><small>'+esc(AL_CO[x.co].n)+' · '+fmtN(d,0)+' km · '+x.sz+' M de passagers par an'+(m.hubs.includes(x.id)?' · votre plateforme':'')+(x.lei?' · loisirs':'')+'</small>'+(e?'<small class="num '+cls(e.net)+'">Meilleur cas : '+esc(AL_TY[e.k].n)+', '+alEstTxt(e)+'</small>':'')+'</span></button>').join('') : '<div class="sub">Toutes les destinations possibles sont déjà desservies.</div>')+'</div>'; }
    else if(M.a&&M.to){ const d=alDist(M.a,M.to);
      body+='<div class="sub"><b>'+esc(alAp(M.a).n)+' – '+esc(alAp(M.to).n)+'</b> · '+fmtN(d,0)+' km · billet éco environ '+eur(alEco(d),0)+'. <button class="lnk" data-a="alnewb" data-v="">Changer</button></div>'+alPlaneChoice(b,d,'alnewgo'); }
    return {title:'Ouvrir une ligne',sm:true,body}; }
  if(M&&M.type==='aladd'){ const b=S.biz.find(x=>x.id===M.id), l=b&&alLine(b,M.l); if(!l){ ui.modal=null; return _mc(); }
    return {title:'Renforcer la ligne',sm:true,body:'<button class="back" data-a="bizopen" data-i="'+b.id+'">‹ '+esc(b.name)+'</button><div class="sub">'+esc(alAp(l.a).n)+' – '+esc(alAp(l.b).n)+' : un avion de plus augmente la fréquence si la demande suit.</div>'+alPlaneChoice(b,alDist(l.a,l.b),'aladdgo')}; }
  return _mc(); }; }

