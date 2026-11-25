/* ============================================================
   V2.8.2 : RACHAT D'UN GROUPE · CHOIX EN UNE FOIS
   Après une OPA, une fenêtre propose de décider pour toutes les sociétés rachetées à la fois :
   tout confier à des directeurs (délégation totale), tout revendre, ou garder la main. Chaque société peut
   aussi être réglée une par une dans la même fenêtre.
   ============================================================ */
{ const _bg=buyGroup; buyGroup=function(rid){ const before=new Set(S.biz.map(b=>b.id)), r=_bg(rid);
    if(r&&r.ok){ const ids=S.biz.filter(b=>!before.has(b.id)).map(b=>b.id); if(ids.length){ ui.modal={type:'grpacq', ids, n:rivDef(rid).n, pick:{}}; } }
    return r; }; }
/* délégation totale : un directeur est nommé d'office (le meilleur candidat), payé par la société */
function grpDelegate(b){ if(!b.boss){ const r=hireBoss(b,1); if(!r.ok) b.boss=genBoss(b); }
  return setDelegation(b,'full'); }
function grpApply(ids,how){ let n=0, v=0; ids.forEach(id=>{ const b=S.biz.find(x=>x.id===id); if(!b) return; const h=how[id];
    if(h==='full'){ if(grpDelegate(b).ok) n++; } else if(h==='assist'){ if(!b.boss) b.boss=genBoss(b); setDelegation(b,'assist'); n++; }
    else if(h==='sell'){ const p=sellPrice(b); const r=closeBiz(b); if(r&&r.ok!==false){ v+=p; n++; } } });
  return {n,v}; }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='grpacq')) return _mc();
    const L=m.ids.map(id=>S.biz.find(b=>b.id===id)).filter(Boolean); if(!L.length){ ui.modal=null; return _mc(); }
    const tot=L.reduce((a,b)=>a+sellPrice(b),0), P=m.pick;
    const opt=(b,k,t)=>'<button class="btn sm'+(P[b.id]===k?' primary':'')+'" data-a="grpone" data-i="'+b.id+'" data-v="'+k+'">'+t+'</button>';
    let body='<div class="sub" style="margin-bottom:10px">'+plu(L.length,'société')+' rejoignent votre groupe. Décidez pour toutes à la fois, ou une par une.</div>'+
      '<div style="display:grid;gap:8px;margin-bottom:12px">'+
      '<button class="btn primary" style="min-height:48px" data-a="grpall" data-v="full">Tout confier à des directeurs<br><small style="font-weight:600">délégation totale, un directeur nommé pour chacune</small></button>'+
      '<button class="btn" style="min-height:48px" data-a="grpall" data-v="assist">Directeurs en mode assisté<br><small style="font-weight:600">ils gèrent le quotidien, vous gardez les investissements</small></button>'+
      '<button class="btn" style="min-height:48px" data-a="grpall" data-v="sell">Tout revendre · '+eur(tot,0)+'</button>'+
      '<button class="btn" style="min-height:44px" data-a="grpall" data-v="me">Garder la main sur tout</button></div>'+
      '<details><summary style="font:800 13px var(--f-body);min-height:44px;display:flex;align-items:center">Choisir une par une</summary>'+
      L.map(b=>'<div class="fab-row" style="flex-wrap:wrap"><span><b>'+esc(b.name)+'</b><small style="display:block;color:var(--ink-3)">'+esc(D.CITIES[b.city].n)+' · niveau '+b.lvl+' · '+eur(sellPrice(b),0)+'</small></span><span style="display:flex;gap:4px;flex-wrap:wrap">'+opt(b,'full','Déléguer')+opt(b,'assist','Assisté')+opt(b,'sell','Revendre')+opt(b,'me','Garder')+'</span></div>').join('')+
      '<button class="btn primary" style="width:100%;margin-top:8px" data-a="grpdo">Appliquer ces choix</button></details>';
    return {title:'Sociétés rachetées à '+esc(m.n), body}; }; }
Object.assign(ACT,{
  grpall:el=>{ const m=ui.modal, how={}; m.ids.forEach(id=>how[id]=el.dataset.v); const r=grpApply(m.ids,how); ui.modal=null;
    after(); },
  grpone:el=>{ const m=ui.modal; m.pick[+el.dataset.i]=el.dataset.v; render(); },
  grpdo:()=>{ const m=ui.modal, r=grpApply(m.ids,m.pick); ui.modal=null; after(); }
});
