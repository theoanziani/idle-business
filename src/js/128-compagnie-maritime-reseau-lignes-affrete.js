/* ============================================================
   COMPAGNIE MARITIME : réseau, lignes, affrètement, flotte, terminaux (V1.4.9)
   ============================================================ */
const shX=lon=>lon+180, shY=lat=>90-lat;
function shPoly(pts){ let out='', seg=[]; const fl=()=>{ if(seg.length>1) out+='<polyline points="'+seg.map(p=>shX(p[1]).toFixed(1)+','+shY(p[0]).toFixed(1)).join(' ')+'"/>'; seg=[]; };
  pts.forEach((p,i)=>{ if(i&&Math.abs(p[1]-pts[i-1][1])>180){ fl(); } seg.push(p); }); fl(); return out; }
function shMap(b){
  const m=b.m, land=typeof YS_GEO!=='undefined'? '<path class="land" d="'+YS_GEO.land+Object.values(YS_GEO.c).join('')+'"/>' : '';
  const ln=m.ln.map(l=>'<g class="sh-l'+(shPt(l.a).rg!==shPt(l.b).rg&&!SH_NB[shPt(l.a).rg].includes(shPt(l.b).rg)?' lg':'')+'">'+shPoly(shPath(l.a,l.b,m,false).pts)+'</g>').join('');
  const chs=m.fl.filter(p=>p.ch).map(p=>'<g class="sh-l ch">'+shPoly(shPath(p.ch.a,p.ch.b,m,!SH_TY[p.t].pan).pts)+'</g>').join('');
  const used=new Set(m.ln.flatMap(l=>[l.a,l.b]));
  const pts=Object.values(SH_PT).map(a=>{ const own=m.tm.includes(a.id); return '<circle cx="'+shX(a.lon)+'" cy="'+shY(a.lat)+'" r="'+(own?2.2:used.has(a.id)?1.5:1)+'" class="al-p'+(own?' own':a.tm?' hub':'')+'"/>'; }).join('');
  return '<div class="ys-map al-map"><svg viewBox="0 4 360 146" role="img" aria-label="Carte de votre réseau maritime">'+land+ln+chs+pts+'</svg></div><div class="sub">Comment ça marche'+helpQ('Carte du réseau maritime','Points pleins : vos terminaux. Traits pleins : vos lignes (en pointillé, l’intercontinental). Traits fins : voyages d’affrètement en cours.')+'</div>';
}
function shBt(b,lab,act,arg,o){ return '<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o&&o.dis?' disabled':'')+'>'+lab+'</button>'; }
function shShipState(m,p){ const l=p.ln&&m.ln.find(x=>x.id===p.ln);
  return p.yard>S.day? 'Au chantier naval, livré le '+dateL(p.yard) : p.down>S.day? 'Immobilisé encore '+(p.down-S.day)+' j' : p.ch? 'Affrètement : '+p.ch.c+', '+esc(shPt(p.ch.a).n)+' – '+esc(shPt(p.ch.b).n)+', retour le '+dateL(p.ch.end) : l? 'Sur la ligne '+esc(shPt(l.a).n)+' – '+esc(shPt(l.b).n) : 'À quai, sans emploi'; }
MET.shipping.html=function(b){
  const m=b.m, can=x=>mAvail(b)>=x;
  let h='<div class="pk-head"><b>Réseau</b><span class="sub">'+m.tm.length+' terminal'+(m.tm.length>1?'s':'')+' · '+m.ln.length+' ligne'+(m.ln.length>1?'s':'')+'</span></div>'+shMap(b);
  /* événements en cours */
  const EV={suez:'Canal de Suez fermé : détour par le cap de Bonne-Espérance.', pan:'Canal de Panama restreint : détour par le cap Horn.', fuel:'Fioul 30 % plus cher.'};
  const evs=(m.ev||[]).filter(e=>EV[e.k]&&e.until>=S.day); if(evs.length) h+=evs.map(e=>'<div class="notice">'+EV[e.k]+' Encore '+(e.until-S.day+1)+' j.</div>').join('');
  /* lignes */
  h+='<div class="pk-head"><b>Lignes de porte-conteneurs</b><span class="sub">'+(m.ln.length? m.ln.length+' en service' : 'Aucune ligne')+'</span></div><div class="ht-t">';
  m.ln.forEach(l=>{ const x=l.st||shLineDay(b,l), P=m.fl.filter(p=>p.ln===l.id), path=shPath(l.a,l.b,m,false);
    h+='<div class="rs-d"><div><b>'+esc(shPt(l.a).n)+' – '+esc(shPt(l.b).n)+'</b><small>'+fmtN(x.d||path.d,0)+' km'+(path.canal? ' · canal de '+(path.canal==='suez'?'Suez':'Panama') : '')+(path.aden?' · golfe d’Aden':'')+' · '+(P.length? P.map(p=>SH_TY[p.t].n).join(', ') : 'aucun navire')+'</small>'+
      '<small>'+fmtN(Math.round(x.teu||0))+' EVP par jour sur '+fmtN(Math.round(x.cap||0))+' · remplissage '+Math.round((x.lf||0)*100)+' % · demande '+fmtN(Math.round(x.want||0))+' · prix '+Math.round((SH_PRICE[l.p]||1)*100)+' % · résultat <b class="num '+cls(x.net||0)+'">'+signed(x.net||0,0)+' / j</b></small>'+
      (ui.lnG!==l.id? '<div class="fm-a"><button class="btn sm" data-a="lng" data-i="'+l.id+'">Gérer</button></div>' : '<div class="fm-a">'+shBt(b,'Prix −','price',l.id+':'+Math.max(0,l.p-1),{c:'sm ghost',dis:l.p<=0})+shBt(b,'Prix +','price',l.id+':'+Math.min(3,l.p+1),{c:'sm ghost',dis:l.p>=3})+
      '<button class="btn sm ghost" data-a="shadd" data-i="'+b.id+'" data-j="'+l.id+'">Ajouter un navire</button>'+(P.length>1? shBt(b,'Retirer un navire','off',P[P.length-1].id,{c:'sm ghost'}) : '')+shBt(b,'Fermer la ligne','close',l.id,{c:'sm ghost'})+'<button class="btn sm" data-a="lng" data-i="0">Terminé</button></div>')+'</div></div>'; });
  h+='</div><div><button class="btn sm pri" data-a="shnew" data-i="'+b.id+'">Ouvrir une ligne</button></div>';
  /* affrètement */
  const bulk=m.fl.filter(p=>SH_TY[p.t].k!=='box');
  h+='<div class="pk-head"><b>Affrètement</b><span class="sub">Indice du vrac '+Math.round(m.bi*100)+' · '+bulk.filter(p=>p.ch).length+' voyage(s) en cours</span></div>';
  h+='<div class="sub">Comment ça marche'+helpQ('Fonctionnement de l’affrètement','Des chargeurs cherchent un navire pour un voyage. Le prix suit l’indice du fret ; les offres changent chaque semaine. Il faut un vraquier ou un pétrolier libre.')+'</div><div class="ht-t">';
  h+=m.off.slice().sort((x,y)=>y.pay/y.days-x.pay/x.days).map(o=>{ const ok=m.fl.some(p=>SH_TY[p.t].k===o.k&&SH_TY[p.t].cap>=o.q&&shFree(m,p));
    return '<div class="rs-d"><div><b>'+esc(o.c.charAt(0).toUpperCase()+o.c.slice(1))+' : '+esc(shPt(o.a).n)+' – '+esc(shPt(o.b).n)+'</b><small>'+fmtN(o.q,0)+' t · '+(o.k==='bulk'?'vraquier':'pétrolier')+' · environ '+o.days+' jours · '+eur(o.pay,0)+' (≈ '+eur(o.pay/o.days,0)+' / j) · jusqu’au '+dateS(o.exp)+'</small>'+
      '<div class="fm-a"><button class="btn sm'+(ok?' pri':'')+'" data-a="shch" data-i="'+b.id+'" data-j="'+o.id+'"'+(ok?'':' disabled')+'>'+(ok?'Accepter':'Aucun navire libre')+'</button></div></div></div>'; }).join('')+'</div>';
  /* flotte */
  const idle=m.fl.filter(p=>shFree(m,p));
  h+='<div class="pk-head"><b>Flotte</b><span class="sub">'+m.fl.length+' navire'+(m.fl.length>1?'s':'')+(idle.length?' · '+idle.length+' sans emploi':'')+'</span></div><div class="ht-t">';
  m.fl.forEach(p=>{ const T=SH_TY[p.t];
    h+='<div class="rs-d"><div><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+(p.own? (p.occ?'acheté d’occasion':'acheté neuf') : 'loué '+eur(T.ls,0)+' / j')+'</small><small>'+shShipState(m,p)+'</small>'+
      (p.ch||p.yard>S.day? '' : '<div class="fm-a">'+shBt(b,p.own?'Revendre ('+eur(shResale(p),0)+')':'Rendre','drop',p.id,{c:'sm ghost'})+'</div>')+'</div></div>'; });
  h+='</div><div class="pk-list">'+Object.entries(SH_TY).map(([k,T])=>'<div class="pk-o al-ty"><span><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+(T.k==='box'? fmtN(T.cap,0)+' EVP' : fmtN(T.cap,0)+' t')+' · '+T.kn+' nœuds</small></span><span class="row">'+
    shBt(b,'Louer '+eur(T.ls,0)+' / j','lease',k,{c:'sm',dis:!can(T.ls*30)})+shBt(b,'Occasion '+eur(T.pr*SH_OCC,0),'occ',k,{c:'sm ghost',dis:!can(T.pr*SH_OCC)})+shBt(b,'Neuf '+eur(T.pr,0),'yard',k,{c:'sm ghost',dis:!can(T.pr)})+'</span></div>').join('')+'</div>'+
    '<div class="sub">Comment ça marche'+helpQ('Louer, occasion ou neuf','Location : dépôt de 30 jours de loyer, rendu à la fin. Occasion : disponible tout de suite, entretien plus cher, revente 35 %. Neuf : livré par le chantier naval en '+SH_YARD+' jours, revente 65 %.')+'</div>';
  /* terminaux */
  h+='<div class="pk-head"><b>Ports et terminaux</b><span class="sub">Image de marque '+Math.round(m.img)+' / 100</span></div>';
  h+='<div class="sub">Comment ça marche'+helpQ('Ports et terminaux : fonctionnement','Un terminal dans un grand port permet d’en faire partir des lignes vers sa région et les régions voisines, et des lignes intercontinentales vers vos autres terminaux. Vos escales y coûtent moitié moins, et d’autres compagnies vous paient pour vos quais. L’image de marque monte avec les années, le réseau et la fiabilité.')+'</div>';
  Object.keys(SH_RG).forEach(rg=>{ const L=Object.values(SH_PT).filter(a=>a.tm&&a.rg===rg); if(!L.length) return;
    h+='<div class="tag">'+SH_RG[rg]+'</div><div class="ht-t">'+L.map(a=>{ const own=m.tm.includes(a.id), req=shTmReq(b,a.id), c=shTmCost(a.id);
      if(own){ const n=(m.ext&&m.ext[a.id])||0; return '<div class="rs-d"><div><b>'+esc(a.n)+'</b><small>Votre terminal · '+shTmUsed(b,a.id)+' / '+shTmCap(b,a.id)+' lignes</small><div class="fm-a">'+(n<3? shBt(b,'Quais : '+eur(shExtCost(b,a.id),0),'ext',a.id,{c:'sm',dis:!can(shExtCost(b,a.id))}) : pill('Quais au maximum','good'))+'</div></div></div>'; }
      return '<div class="rs-d"><div><b>'+esc(a.n)+'</b><small>'+fmtN(a.sz,1)+' M d’EVP par an · image '+req+' requise</small><div class="fm-a">'+shBt(b,'Acheter : '+eur(c,0),'tm',a.id,{c:'sm',dis:m.img<req||!can(c)})+'</div></div></div>'; }).join('')+'</div>'; });
  if(m.uft) h+='<div class="sub">Fret de vos usines transporté depuis l’ouverture : '+eur(m.uft,0)+'.</div>';
  return h;
};
/* ouvrir une ligne : terminal, destination, navire */
ACT.shnew=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; ui.modal={type:'shnew', id:b.id, a:b.m.tm.length===1?b.m.tm[0]:null, to:null}; render(); };
ACT.shnewa=el=>{ const m=ui.modal; if(!m) return; m.a=el.dataset.v; m.to=null; render(); };
ACT.shnewb=el=>{ const m=ui.modal; if(!m) return; m.to=el.dataset.v||null; render(); };
ACT.shnewgo=el=>{ const m=ui.modal, b=S.biz.find(x=>x.id===m.id); if(!b) return; let pid=+el.dataset.v;
  if(el.dataset.t){ const r=shGet(b,el.dataset.t,'lease'); if(!r.ok) return after(r); pid=b.m.fl[b.m.fl.length-1].id; }
  const r=shOpen(b,m.a,m.to,pid); if(!r.ok&&el.dataset.t) shDrop(b,pid); if(r.ok) ui.modal={type:'biz',id:b.id}; after(r); };
ACT.shadd=el=>{ ui.modal={type:'shadd', id:+el.dataset.i, l:+el.dataset.j}; render(); };
ACT.shaddgo=el=>{ const m=ui.modal, b=S.biz.find(x=>x.id===m.id); if(!b) return; let pid=+el.dataset.v;
  if(el.dataset.t){ const r=shGet(b,el.dataset.t,'lease'); if(!r.ok) return after(r); pid=b.m.fl[b.m.fl.length-1].id; }
  const r=shAssign(b,m.l,pid); if(!r.ok&&el.dataset.t) shDrop(b,pid); if(r.ok) ui.modal={type:'biz',id:b.id}; after(r); };
ACT.shch=el=>{ ui.modal={type:'shch', id:+el.dataset.i, o:+el.dataset.j}; render(); };
ACT.shchgo=el=>{ const m=ui.modal, b=S.biz.find(x=>x.id===m.id); if(!b) return; const r=shCharter(b,m.o,+el.dataset.v); if(r.ok) ui.modal={type:'biz',id:b.id}; after(r); };
/* prévision d'une ligne avec un navire de plus (sans rien changer) */
function shPreview(b,a,bb,t,lid){ const m=b.m, saveL=m.ln, saveF=m.fl; let x;
  try{ const l= lid? Object.assign({},m.ln.find(z=>z.id===lid)) : {id:-9, a, b:bb, p:1}; const id=l.id;
    m.fl=saveF.filter(p=>p.ln===id).concat([{id:-8, t, own:0, ln:id, down:0}]); m.ln=[l]; x=shLineDay(b,l); } finally { m.ln=saveL; m.fl=saveF; } return x; }
function shShipChoice(b,a,bb,act,lid){ const m=b.m, idle=m.fl.filter(p=>shFree(m,p)&&SH_TY[p.t].k==='box'), can=x=>mAvail(b)>=x;
  const cur= lid&&shLine(b,lid)? shLineDay(b,shLine(b,lid)).net : 0;
  const row=(t,extra,data,dis)=>{ const x=shPreview(b,a,bb,t,lid); return '<button class="pk-o" data-a="'+act+'" '+data+(dis?' disabled':'')+'><span><b>'+esc(SH_TY[t].n)+'</b><small>'+extra+'</small><small class="num '+cls(x.net-cur)+'">'+(lid? 'gain estimé '+signed(x.net-cur,0)+' / j pour la ligne' : 'résultat estimé '+signed(x.net,0)+' / j')+' · remplissage '+Math.round(x.lf*100)+' %</small></span></button>'; };
  return (idle.length? '<div class="tag">Navires sans emploi</div>'+idle.map(p=>row(p.t,(p.own?'à vous':'loué'),'data-v="'+p.id+'"',false)).join('') : '')+
    '<div class="tag">Louer un navire pour cette ligne</div>'+Object.entries(SH_TY).filter(([k,T])=>T.k==='box').map(([k,T])=>row(k,fmtN(T.cap,0)+' EVP · '+eur(T.ls,0)+' / j · dépôt '+eur(T.ls*30,0),'data-v="0" data-t="'+k+'"',!can(T.ls*30))).join(''); }
{ const _mc=modalContent; modalContent=function(){ const M=ui.modal;
  if(M&&M.type==='shnew'){ const b=S.biz.find(x=>x.id===M.id); if(!b||!b.m){ ui.modal=null; return _mc(); } const m=b.m;
    let body='<button class="back" data-a="bizopen" data-i="'+b.id+'">‹ '+esc(b.name)+'</button>';
    body+='<div class="tag">Départ</div><div class="seg al-seg">'+m.tm.map(h=>'<button class="'+(M.a===h?'on':'')+'" data-a="shnewa" data-v="'+h+'">'+esc(shPt(h).n)+' ('+shTmUsed(b,h)+'/'+shTmCap(b,h)+')</button>').join('')+'</div>';
    if(M.a&&shTmUsed(b,M.a)>=shTmCap(b,M.a)) body+='<div class="notice">Plus de quai libre à '+esc(shPt(M.a).n)+' : achetez des quais dans « Ports et terminaux ».</div>';
    else if(M.a&&!M.to){ const L=shDests(b,M.a).filter(x=>!shCanLine(b,M.a,x.id)).map(x=>{ let e=null; Object.entries(SH_TY).forEach(([k,T])=>{ if(T.k!=='box') return; const r=shPreview(b,M.a,x.id,k); if(!e||r.net>e.net) e=Object.assign({k},r); }); return {x,d:shDist(M.a,x.id,m),e}; }).sort((p,q)=>(q.e?q.e.net:0)-(p.e?p.e.net:0));
      body+='<div class="tag">Destination</div><div class="pk-list">'+(L.length? L.map(({x,d,e})=>'<button class="pk-o'+(m.tm.includes(x.id)?' match':'')+'" data-a="shnewb" data-v="'+x.id+'"><span><b>'+esc(x.n)+'</b><small>'+esc(SH_RG[x.rg])+' · '+fmtN(d,0)+' km · '+fmtN(x.sz,1)+' M d’EVP par an'+(m.tm.includes(x.id)?' · votre terminal':'')+'</small>'+(e?'<small class="num '+cls(e.net)+'">Meilleur cas : '+esc(SH_TY[e.k].n)+', résultat estimé '+signed(e.net,0)+' / j · remplissage '+Math.round((e.lf||0)*100)+' %</small>':'')+'</span></button>').join('') : '<div class="sub">Toutes les destinations possibles sont déjà desservies.</div>')+'</div>'; }
    else if(M.a&&M.to){ const P=shPath(M.a,M.to,m,false);
      body+='<div class="sub"><b>'+esc(shPt(M.a).n)+' – '+esc(shPt(M.to).n)+'</b> · '+fmtN(P.d,0)+' km'+(P.canal?' · canal de '+(P.canal==='suez'?'Suez':'Panama'):'')+' · environ '+eur(shRate(P.d),0)+' par EVP. <button class="lnk" data-a="shnewb" data-v="">Changer</button></div>'+shShipChoice(b,M.a,M.to,'shnewgo'); }
    return {title:'Ouvrir une ligne',sm:true,body}; }
  if(M&&M.type==='shadd'){ const b=S.biz.find(x=>x.id===M.id), l=b&&shLine(b,M.l); if(!l){ ui.modal=null; return _mc(); }
    return {title:'Renforcer la ligne',sm:true,body:'<button class="back" data-a="bizopen" data-i="'+b.id+'">‹ '+esc(b.name)+'</button><div class="sub">'+esc(shPt(l.a).n)+' – '+esc(shPt(l.b).n)+' : un navire de plus ajoute de la capacité, utile seulement si la demande dépasse ce que vous offrez.</div>'+shShipChoice(b,l.a,l.b,'shaddgo',l.id)}; }
  if(M&&M.type==='shch'){ const b=S.biz.find(x=>x.id===M.id), m=b&&b.m, o=m&&m.off.find(x=>x.id===M.o); if(!o){ ui.modal=null; return _mc(); }
    const L=m.fl.filter(p=>SH_TY[p.t].k===o.k&&SH_TY[p.t].cap>=o.q&&shFree(m,p));
    return {title:'Affrètement',sm:true,body:'<button class="back" data-a="bizopen" data-i="'+b.id+'">‹ '+esc(b.name)+'</button><div class="sub">'+esc(o.c)+' de '+esc(shPt(o.a).n)+' à '+esc(shPt(o.b).n)+' : '+fmtN(o.q,0)+' t pour '+eur(o.pay,0)+'.</div>'+
      (L.length? L.map(p=>'<button class="pk-o" data-a="shchgo" data-v="'+p.id+'"><span><b>'+esc(SH_TY[p.t].n)+'</b><small>'+(p.own?'à vous':'loué')+'</small></span></button>').join('') : '<div class="notice">Aucun navire libre de ce type : louez-en un dans « Flotte ».</div>')}; }
  return _mc(); }; }

