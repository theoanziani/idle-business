/* ============================================================
   V18 : construire une usine depuis Plus > Usines
   Villes -> quartiers avec terrains libres pour usines -> parcelles ;
   les autres bâtiments libres sont grisés (seulement dans ce mode).
   ============================================================ */
const FACT_T = ['land','depot'];
const factDefs = () => Object.keys(D.FACT);
function factPlot(bd){ return FACT_T.includes(bd.t) && bldDefs(bd).some(d=>D.FACT[d]); }
function freeFactPlot(bd){ return factPlot(bd) && !bldHeld(bd.id) && !rivShopAt(bd.id); }
function factFreeIn(cid,did){ return bldList(cid,did).filter(freeFactPlot); }
function vFactPick(){
  const fm=ui.fm;
  let h='';
  if(!fm.c){
    h+='<button class="back" data-a="fmback" data-v="0">‹ Usines</button>'+head('Construire une usine','Choisissez une ville : seuls les quartiers avec des terrains ou entrepôts libres pour l’industrie sont proposés.');
    h+='<div class="stack">'+D.CITY_ORDER.filter(cityUnlocked).map(cid=>{ const C=D.CITIES[cid]; let n=0, nd=0; C.d.forEach(dd=>{ const k=factFreeIn(cid,dd.id).length; n+=k; if(k) nd++; });
      return '<button class="card fm-city'+(n?'':' fgrey')+'" data-a="fmcity" data-i="'+cid+'"'+(n?'':' disabled')+'>'+cityBanner(cid,'fm still')+'<div class="row sp"><div><b>'+esc(C.n)+'</b><div class="sub">'+esc(C.country)+'</div></div>'+(n? pill(n+' parcelle'+(n>1?'s':'')+' · '+nd+' quartier'+(nd>1?'s':''),'good') : pill('Aucun terrain libre',''))+'</div></button>'; }).join('')+'</div>';
    return h;
  }
  const C=D.CITIES[fm.c];
  if(!fm.d){
    h+='<button class="back" data-a="fmback" data-v="1">‹ Villes</button>'+cityBanner(fm.c,'hero')+head(esc(C.n),'Quartiers avec des terrains libres pour une usine.');
    const ds=C.d.filter(dd=>factFreeIn(fm.c,dd.id).length);
    h+=ds.length? '<div class="grid">'+ds.map(dd=>{ const L=factFreeIn(fm.c,dd.id), rs=L.map(bldRent), land=L.filter(b=>b.t==='land').length, dep=L.length-land;
      return '<button class="card bc dist" data-a="fmdist" data-i="'+fm.c+'" data-j="'+dd.id+'"><div class="hd"><div><b>'+esc(dd.n)+'</b><div class="sub">'+esc(dd.cl)+'</div></div>'+lvlPill(rentLevel(pEur(fm.c,dd)))+'</div>'+
        '<div class="row">'+(land?pill(land+' terrain'+(land>1?'s':''),'good'):'')+(dep?pill(dep+' entrepôt'+(dep>1?'s':''),'info'):'')+'</div>'+
        '<div class="sub">Loyers de '+eur(Math.min(...rs),0)+' à '+eur(Math.max(...rs),0)+' / j · surfaces jusqu’à '+fmtN(Math.max(...L.map(b=>b.surf)))+' m²</div></button>'; }).join('')+'</div>'
      : '<div class="notice info">Plus aucun terrain libre pour l’industrie dans cette ville.</div>';
    return h;
  }
  const dd=C.d.find(x=>x.id===fm.d), L=bldList(fm.c,fm.d).slice().sort((a,b)=>(freeFactPlot(b)-freeFactPlot(a)));
  h+='<button class="back" data-a="fmback" data-v="2">‹ '+esc(C.n)+'</button>'+head(esc(dd.n),'Terrains et entrepôts libres pour une usine. Les autres bâtiments libres sont grisés.');
  h+='<div class="grid">'+L.map(bd=>{ const free=!bldHeld(bd.id)&&!rivShopAt(bd.id);
    if(free&&!factPlot(bd)) return '<div class="fgrey" aria-disabled="true">'+bldCard(bd)+'</div>';
    return '<div class="'+(freeFactPlot(bd)?'fplot':'')+'">'+(freeFactPlot(bd)?'<span class="fbadge">'+(bd.t==='land'?'Terrain industriel':'Entrepôt industriel')+'</span>':'')+bldCard(bd)+'</div>'; }).join('')+'</div>';
  return h;
}
{ const _vl=vLogi;
  vLogi=function(){
    if(ui.fm) return vFactPick();
    const n=D.CITY_ORDER.filter(cityUnlocked).reduce((a,cid)=>a+D.CITIES[cid].d.reduce((b,dd)=>b+factFreeIn(cid,dd.id).length,0),0);
    const top='<section class="card fm-cta"><div class="row sp"><div style="min-width:0"><b style="font-family:var(--f-display);font-size:19px">Construire une usine</b><div class="sub">'+n+' terrain'+(n>1?'s':'')+' et entrepôt'+(n>1?'s':'')+' libres pour l’industrie dans vos villes.</div></div>'+btn('Choisir un terrain','fmopen',{c:'pri'})+'</div></section>';
    const h=_vl(), hd=head('Usines et logistique');
    return h.startsWith(hd)? hd+top+h.slice(hd.length) : top+h;
  };
  VIEWS.logi=vLogi;
}
Object.assign(ACT,{
  fmopen:()=>{ ui.fm={c:null,d:null}; ui.tab='logi'; window.scrollTo(0,0); render(); },
  fmcity:el=>{ ui.fm={c:el.dataset.i,d:null}; window.scrollTo(0,0); render(); },
  fmdist:el=>{ ui.fm={c:el.dataset.i,d:el.dataset.j}; window.scrollTo(0,0); render(); },
  fmback:el=>{ const v=+el.dataset.v; ui.fm= v===0? null : v===1? {c:null,d:null} : {c:ui.fm.c,d:null}; window.scrollTo(0,0); render(); }
});
{ const _tab=ACT.tab; ACT.tab=el=>{ if(el.dataset.i!=='logi') ui.fm=null; _tab(el); }; }

