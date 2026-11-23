/* ============================================================
   GALERIE : réserve, catalogue de la vente, dépôts, vos œuvres, artistes, vente en direct
   ============================================================ */
function gaBtn(b,v,j,lab,c,dis){ return '<button class="btn sm'+(c?' '+c:'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'" data-j="'+j+'"'+(dis?' disabled':'')+'>'+lab+'</button>'; }
function gaOrig(w){ return w.o==='dep'?'Dépôt':w.o==='own'?'Propriété de la galerie':'Votre collection'; }
MET.gallery.html=function(b){
  const m=b.m, ar=w=>(w.o==='lux'||w.o==='coll')?'Votre collection':((gaArt(b,w.a)||{}).n||'Artiste inconnu');
  const exN=m.st.filter(w=>w.exp).length;
  let h='';
  /* vente en préparation ou catalogue */
  if(m.sale){ const rd=S.day>=m.sale.ready;
    h+='<div class="pk-head"><b>Vente aux enchères</b><span class="sub">'+(rd?'Le catalogue est prêt':'Prête dans '+(m.sale.ready-S.day)+' j')+'</span></div><div class="pk-pan">';
    h+='<div class="ht-t">'+m.sale.lots.map((id,i)=>{ const w=m.st.find(x=>x.id===id); return w? '<div class="rs-d"><div><b>Lot '+(i+1)+' · '+esc(w.n)+'</b><small>'+esc(ar(w))+' · réserve '+GA_RES[w.res].n.toLowerCase()+'</small></div><small class="num">'+eur(gaEst(b,w),0)+'</small></div>' : ''; }).join('')+'</div>';
    h+='<div class="row sp"><div class="sub">'+(m.whale?'Un collectionneur fortuné sera dans la salle.':'Chaque lot vendu réchauffe la salle, chaque lot ravalé la refroidit.')+'</div>'+gaBtn(b,'live','','Ouvrir la vente en direct','pri',!rd)+'</div></div>';
  } else {
    const L=m.cat.map(id=>m.st.find(x=>x.id===id)).filter(Boolean), c=metR0(b)*.6;
    h+='<div class="pk-head"><b>Prochaine vente</b><span class="sub">'+L.length+' / '+gaMaxLots(b)+' lots</span></div><div class="pk-pan">';
    if(!L.length) h+='<div class="sub">Ajoutez des œuvres de la réserve au catalogue (« Au catalogue »), puis réglez l’ordre et le prix de réserve de chaque lot. La réserve est le prix minimum, en pourcentage de l’estimation. Commencez par des lots sûrs pour réchauffer la salle et placez la pièce maîtresse quand l’ambiance est au plus haut.</div>';
    else h+='<div class="ht-t">'+L.map((w,i)=>'<div class="ga-lot"><div class="row sp"><div><b>Lot '+(i+1)+' · '+esc(w.n)+'</b><small>'+esc(ar(w))+' · estimation '+eur(gaEst(b,w),0)+'</small></div><div class="row">'+(i?gaBtn(b,'up',w.id,'Monter'):'')+gaBtn(b,'cat',w.id,'Retirer')+'</div></div>'+
      '<div class="row ga-res"><small>Réserve</small><div class="seg">'+Object.keys(GA_RES).map(k=>'<button class="'+(w.res===k?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="res" data-j="'+w.id+':'+k+'">'+Math.round(GA_RES[k].f*100)+' %</button>').join('')+'</div></div></div>').join('')+'</div>';
    h+='<div class="row sp"><div><b class="num">'+eur(c,0)+'</b><div class="sub">Catalogue et annonces. La vente a lieu 5 jours plus tard.</div></div>'+gaBtn(b,'prep','','Préparer la vente','pri',L.length<3||availFor(cityOf(b).ccy)<c)+'</div></div>';
  }
  /* réserve */
  h+='<div class="pk-head"><b>Réserve</b><span class="sub">'+m.st.length+' / '+gaCap(b)+' œuvres · '+exN+' / '+gaSlots(b)+' exposées</span></div>';
  if(!m.st.length) h+='<div class="sub">Aucune œuvre pour l’instant. Acceptez des dépôts ou confiez vos propres œuvres.</div>';
  else h+='<div class="ht-t">'+m.st.map(w=>{ const inS=m.sale&&m.sale.lots.includes(w.id), inC=m.cat.includes(w.id);
    return '<div class="ga-lot"><div class="row sp"><div><b>'+esc(w.n)+'</b><small>'+esc(ar(w))+' · '+gaOrig(w)+(w.ex?' · expertisée':'')+(w.exp?' · exposée':'')+(w.gk>1.005?' · cote +'+Math.round((w.gk-1)*100)+' %':'')+'</small></div><b class="num">'+eur(gaEst(b,w),0)+'</b></div>'+
      '<div class="row">'+gaBtn(b,'show',w.id,w.exp?'Décrocher':'Exposer','',!w.exp&&exN>=gaSlots(b))+(inS?'<span class="sub">Dans la vente</span>':gaBtn(b,'cat',w.id,inC?'Retirer du catalogue':'Au catalogue','',!inC&&m.cat.length>=gaMaxLots(b)))+
      (!w.ex?gaBtn(b,'exp',w.id,'Expertiser ('+eur(metR0(b)*.25,0)+')'):'')+((w.o==='lux'||w.o==='coll')&&!inS?gaBtn(b,'back',w.id,'Reprendre'):'')+'</div></div>'; }).join('')+'</div>';
  /* dépôts proposés */
  if(m.off.length) h+='<div class="pk-head"><b>Propositions de dépôt</b><span class="sub">Des collectionneurs vous confient leurs œuvres</span></div><div class="ht-t">'+m.off.map(w=>'<div class="ga-lot"><div class="row sp"><div><b>'+esc(w.n)+'</b><small>'+esc(ar(w))+' · encore '+Math.max(0,w.until-S.day)+' j'+(w.ex?' · expertisée':'')+'</small></div><b class="num">'+eur(gaEst(b,w),0)+'</b></div><div class="row">'+gaBtn(b,'acc',w.id,'Accepter','pri',m.st.length>=gaCap(b))+(!w.ex?gaBtn(b,'exp',w.id,'Expertiser'):'')+gaBtn(b,'dec',w.id,'Refuser')+'</div></div>').join('')+'</div>';
  /* vos œuvres de l'onglet Luxe */
  const F=gaLuxFree();
  h+='<div class="pk-head"><b>Vos œuvres</b><span class="sub">Achetées dans l’onglet Luxe</span></div>';
  h+= F.length? '<div class="ht-t">'+F.map(x=>'<div class="rs-d"><div><b>'+esc(x.n)+'</b><small>Exposée, sa cote monte jusqu’à +10 %. Revendue aux enchères : 5 % de frais seulement.</small></div>'+gaBtn(b,'lux',x.o+':'+x.lid,'Confier','',m.st.length>=gaCap(b))+'</div>').join('')+'</div>'
     : '<div class="sub">Les œuvres d’art que vous achetez dans l’onglet Luxe (ou dans sa salle des ventes) peuvent être exposées ici puis revendues aux enchères.</div>';
  /* artistes émergents */
  if(mxHas(b,1)){ const E=m.art.filter(a=>a.em);
    h+='<div class="pk-head"><b>Artistes émergents</b><span class="sub">Achetez tôt, exposez, revendez quand la cote a monté</span></div><div class="ht-t">';
    h+=E.map(a=>'<div class="rs-d"><div><b>'+esc(a.n)+(a.dead?' (décédé)':'')+'</b><small>Cote '+a.c.toFixed(2)+(a.p?(a.c>a.p*1.03?' · en hausse':a.c<a.p*.97?' · en baisse':' · stable'):'')+(m.atl.some(x=>x.a===a.id)?' · '+m.atl.filter(x=>x.a===a.id).length+' œuvre(s) en atelier':'')+'</small></div></div>'+m.atl.filter(x=>x.a===a.id).map(x=>{ const p=x.e0*a.c*.7; return '<div class="rs-d"><div><b>'+esc(x.n)+'</b><small>En atelier · '+esc(a.n)+'</small></div>'+gaBtn(b,'buyw',x.id,'Acheter '+eur(p,0),'',availFor(cityOf(b).ccy)<p||m.st.length>=gaCap(b))+'</div>'; }).join('')).join('');
    h+='<div class="row sp"><div class="sub">Repérer un nouvel artiste : '+eur(metR0(b)*1.5,0)+'.</div>'+gaBtn(b,'scout','','Repérer','',E.filter(a=>!a.dead).length>=4)+'</div></div>'; }
  /* dernière vente */
  if(m.last){ const L=m.last;
    h+='<div class="pk-head"><b>Dernière vente</b><span class="sub">Il y a '+(S.day-L.d)+' j</span></div><div class="ht-t">'+L.lots.map(r=>'<div class="rs-d"><div><b>'+esc(r.n)+'</b><small>Estimation '+eur(r.est,0)+'</small></div><small class="num">'+(r.sold?'Adjugé '+eur(r.hammer,0):'Ravalé')+'</small></div>').join('')+
      '<div class="row sp"><div class="sub">'+L.sold+' / '+L.n+' adjugés, '+eur(L.com,0)+' pour la galerie.</div><button class="btn sm" data-a="galive" data-i="'+b.id+'">Revoir la vente</button></div></div>'; }
  return h;
};
/* ---------- la vente en direct ---------- */
const GA_LOT_MS=3400;
ACT.galive=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b||!b.m||!b.m.last) return; ui.gl={b:b.id, t0:Date.now(), back:ui.modal}; ui.modal={type:'galive', id:b.id}; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v, b=S.biz.find(x=>x.id===+el.dataset.i), prev=ui.modal; _met(el);
  if(v==='live'&&b&&b.m&&b.m.last&&b.m.last.d===S.day&&!b.m.sale){ ui.gl={b:b.id, t0:Date.now(), back:prev}; ui.modal={type:'galive', id:b.id}; render(); } }; }
ACT.galnext=()=>{ const g=ui.gl; if(!g) return; const k=Math.floor((Date.now()-g.t0)/GA_LOT_MS); g.t0=Date.now()-(k+1)*GA_LOT_MS; gaDraw(); };
ACT.galend=()=>{ const g=ui.gl; if(!g) return; g.t0=Date.now()-1e9; gaDraw(); };
ACT.galclose=()=>{ const g=ui.gl; ui.modal=g&&g.back&&g.back.type==='biz'? g.back : null; ui.gl=null; render(); };
function gaAmb(h){ return h==null?'—':h<.85?'glaciale':h<.95?'froide':h<1.05?'tiède':h<1.15?'animée':'électrique'; }
function gaDraw(){ const g=ui.gl, box=document.getElementById('ga-live'); if(!g||!box) return false;
  const b=S.biz.find(x=>x.id===g.b), L=b&&b.m&&b.m.last; if(!L) return false;
  const t=Date.now()-g.t0, k=Math.floor(t/GA_LOT_MS), done=k>=L.lots.length;
  const doneL=L.lots.slice(0,Math.min(k,L.lots.length));
  let h='';
  if(!done){ const r=L.lots[k], u=(t%GA_LOT_MS)/GA_LOT_MS, p=Math.min(1,u/.72), n=Math.max(1,Math.ceil(p*r.bids.length)), bd=r.bids[n-1], fin=u>=.72;
    h+='<div class="ga-cur"><div class="sub">Lot '+(k+1)+' sur '+L.lots.length+' · '+esc(r.ar||'')+'</div><b>'+esc(r.n)+'</b><div class="sub">Estimation '+eur(r.est,0)+' · réserve '+eur(r.rv,0)+'</div>'+
      '<div class="ga-amb">Ambiance de la salle : '+gaAmb(r.h)+'</div><div class="ga-price num">'+eur(fin&&r.sold?r.hammer:bd.p,0)+'</div><div class="ga-who'+(fin?(r.sold?' ok':' ko'):'')+'">'+(fin?(r.sold?'Adjugé !':'Ravalé : la réserve n’est pas atteinte'):esc(bd.w))+'</div></div>';
    h+='<div class="row">'+btn('Lot suivant','galnext',{c:'sm'})+btn('Voir les résultats','galend',{c:'sm'})+'</div>';
  } else h+='<div class="ga-cur"><b>Vente terminée</b><div class="sub">'+L.sold+' lots adjugés sur '+L.n+', '+eur(L.tot,0)+' au marteau.</div><div class="ga-price num">'+eur(L.com,0)+'</div><div class="sub">pour la galerie</div></div>'+btn('Fermer','galclose',{c:'pri'});
  if(doneL.length) h+='<div class="ht-t">'+doneL.map(r=>'<div class="rs-d"><div><b>'+esc(r.n)+'</b><small>Estimation '+eur(r.est,0)+'</small></div><small class="num">'+(r.sold?'Adjugé '+eur(r.hammer,0):'Ravalé')+'</small></div>').join('')+'</div>';
  if(box._h!==h){ box.innerHTML=h; box._h=h; } return !done; }
function gaLoop(){ if(!ui.gl||!ui.modal||ui.modal.type!=='galive'){ ui.galoop=0; return; } gaDraw(); requestAnimationFrame(gaLoop); }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal;
  if(m&&m.type==='galive') return {title:'Vente en direct', sm:true, body:'<div id="ga-live" class="stack"></div>'};
  return _mc(); }; }
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); if(ui.gl&&ui.modal&&ui.modal.type==='galive'){ gaDraw(); if(!ui.galoop){ ui.galoop=1; requestAnimationFrame(gaLoop); } } return out; }; }
/* la croix de la vente en direct revient à la fiche de la galerie */
{ const _cm=ACT.closemodal; ACT.closemodal=function(el){ if(ui.modal&&ui.modal.type==='galive'){ ACT.galclose(); return; } return _cm.apply(this,arguments); }; }

