/* ============================================================
   SOCIÉTÉS : nom choisi à la création, renommage, pilotage métier
   ============================================================ */

/* ---------- Nommer la société avant de la lancer ---------- */
function bzNameOpen(go){
  go.prev=ui.modal; go.k=0;
  go.name=bizNameSuggest(go.def,go.city,go.dist,0);
  ui.modal={type:'bizname',go}; render();
  setTimeout(()=>{ const i=document.getElementById('in-bizname'); if(i){ i.focus(); try{ i.select(); }catch(e){} } },60);
}
{ const _est=ACT.estgo, _lg=ACT.launchgo;
  ACT.estgo=el=>{ const bd=bldById(el.dataset.i); if(!bd) return _est(el);
    bzNameOpen({kind:'est', def:el.dataset.j, inv:+el.dataset.v||0, bld:el.dataset.i, city:bd.city, dist:bd.dist}); };
  ACT.launchgo=el=>{ bzNameOpen({kind:'launch', def:el.dataset.i, inv:+el.dataset.v||0, city:ui.tmp.lc||'paris', dist:ui.tmp.ld}); };
}
function bzNameVal(){ const i=document.getElementById('in-bizname'); return i? i.value : (ui.modal&&ui.modal.go&&ui.modal.go.name)||''; }
ACT.bznext=()=>{ const g=ui.modal&&ui.modal.go; if(!g) return; g.k++; g.name=bizNameSuggest(g.def,g.city,g.dist,g.k); render(); };
{ const _bb=ACT.bzback; ACT.bzback=el=>{ if(ui.modal&&ui.modal.go){ const g=ui.modal.go; ui.modal=g.prev||null; render(); return; } if(_bb) _bb(el); }; }
ACT.bzgo=()=>{
  const g=ui.modal&&ui.modal.go; if(!g) return;
  const name=cleanBizName(bzNameVal()); if(name.length<2){ toast('Donnez un nom d’au moins 2 caractères.','bad'); return; }
  const r= g.kind==='est'? launchBiz(g.def,g.inv,null,null,g.bld,name) : launchBiz(g.def,g.inv,g.city,g.dist,null,name);
  if(r.ok){ ui.modal=null; ui.tab='home'; ui.bz={c:null,d:null}; window.scrollTo(0,0); }
  after(r, D.biz[g.def].startup? 'Start-up « '+name+' » lancée.' : '« '+name+' » est lancée.');
};
/* ---------- Renommer ---------- */
ACT.bzren=el=>{ ui.modal={type:'bzren',id:+el.dataset.i,prev:ui.modal}; render(); setTimeout(()=>{ const i=document.getElementById('in-bzren'); if(i){ i.focus(); try{ i.select(); }catch(e){} } },60); };
ACT.bzrensave=()=>{ const m=ui.modal, b=m&&S.biz.find(x=>x.id===m.id); if(!b) return; const i=document.getElementById('in-bzren');
  const r=renameBiz(b,i?i.value:''); if(r.ok) ui.modal=m.prev&&m.prev.type==='biz'? m.prev : {type:'biz',id:b.id}; after(r,'Société renommée.'); };
ACT.bzrencancel=()=>{ const m=ui.modal; ui.modal=m&&m.prev? m.prev : null; render(); };
document.addEventListener('keydown',e=>{ if(e.key!=='Enter') return; const t=e.target; if(t&&t.id==='in-bizname'){ e.preventDefault(); ACT.bzgo(); } else if(t&&t.id==='in-bzren'){ e.preventDefault(); ACT.bzrensave(); } });

/* ---------- Pilotage métier dans la fiche ---------- */
ACT.met=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; after(metAct(b,el.dataset.v,el.dataset.j)); };
function metBtn(b,c,label,o){ o=o||{}; return '<button class="btn '+(o.c||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+esc(c.act)+'"'+(c.arg!==undefined?' data-j="'+esc(c.arg)+'"':'')+(o.j!==undefined?' data-j="'+esc(o.j)+'"':'')+(o.dis?' disabled':'')+(o.dis&&(c.why||(c.dis&&c.sub))?' data-why="'+esc(c.why||c.sub)+'"':'')+'>'+label+'</button>'; }
function metCtlHtml(b,c){
  const can=x=>availFor(cityOf(b).ccy)>=x;
  if(c.k==='seg'||c.k==='tog'){
    const opts=c.k==='tog'? (c.tl||[[0,'Désactivé'],[1,'Activé']]) : c.opts, val=c.k==='tog'? (c.val?1:0) : c.val;
    return '<div class="met-c"><b>'+esc(c.label)+'</b><div class="seg">'+opts.map(o=>metBtn(b,c,esc(o[1]),{c:(String(o[0])===String(val)?'on':''),j:o[0]}).replace('class="btn ','class="')).join('')+'</div>'+(c.sub?'<div class="sub">'+esc(c.sub)+'</div>':'')+'</div>';
  }
  if(c.k==='buy'||c.k==='stars'){
    const right= c.owned? pill('En place','good') : c.dis&&c.k==='stars'? pill('Maximum','info') : metBtn(b,c,(c.k==='stars'?'Monter : ':'Acheter : ')+eur(c.cost,0),{c:'sm pri',dis:c.dis||!can(c.cost)});
    return '<div class="met-c met-buy"><div class="row sp"><b>'+esc(c.label)+'</b>'+right+'</div>'+(c.sub?'<div class="sub">'+esc(c.sub)+'</div>':'')+'</div>';
  }
  if(c.k==='btn'){
    const lab= c.bl? c.bl : c.gain!==undefined? 'Encaisser '+eur(c.gain,0) : c.cost!==undefined? eur(c.cost,0) : 'OK';
    return '<div class="met-c met-buy"><div class="row sp"><b>'+esc(c.label)+'</b>'+metBtn(b,c,lab,{c:'sm',dis:c.dis||(c.cost!==undefined&&!can(c.cost))})+'</div>'+(c.sub?'<div class="sub">'+esc(c.sub)+'</div>':'')+'</div>';
  }
  return '';
}
function metCard(b){
  const m=metOf(b); if(!m||b.status!=='active') return '';
  const st=metState(b), k=metKpis(b), c=metCtl(b);
  return '<section class="card met" id="bj-met"><div class="row sp"><h2>Pilotage du métier</h2>'+pill(MET_FAM[m.fam]||'Métier','info')+'</div>'+
    '<div class="met-k">'+k.map(x=>'<div><span>'+esc(x[0])+'</span><b class="num">'+esc(x[1])+'</b>'+(x[2]?'<small>'+esc(x[2])+'</small>':'')+'</div>').join('')+'</div>'+
    '<div class="met-cs">'+c.map(x=>metCtlHtml(b,x)).join('')+'</div>'+
    (st.log.length? '<div class="met-log"><div class="tag">Journal du métier</div>'+st.log.map(x=>'<div class="'+(x.c==='bad'?'neg':x.c==='good'?'pos':'')+'"><span class="d">'+dateS(x.d)+'</span>'+esc(x.t.charAt(0).toUpperCase()+x.t.slice(1))+'</div>').join('')+'</div>' : '')+
    '</section>';
}
{ const _bh=bizHero; bizHero=function(b){
  const d=bizDef(b); let h=_bh(b);
  return h.replace('<div class="bh-t"><b>'+esc(d.n)+'</b><small>',
    '<div class="bh-t"><b>'+esc(b.name)+' <button class="bh-ren" data-a="bzren" data-i="'+b.id+'" aria-label="Renommer '+esc(b.name)+'">✎</button></b><small>'+esc(d.n)+' · ');
}; }
{ const _mb=modalBiz; modalBiz=function(b){
  const r=_mb(b); if(!r||!r.body) return r;
  const mc=metCard(b);
  if(mc){ const i=r.body.indexOf('<div class="card" id="bj-pil">'); r.body= i>=0? r.body.slice(0,i)+mc+r.body.slice(i) : r.body+mc; }
  return r;
}; }
{ const _mc3=modalContent; modalContent=function(){
  const m=ui.modal;
  if(m&&m.type==='bizname'){
    const g=m.go, d=D.biz[g.def], cost=g.kind==='est'? launchCost(g.def,d.startup?g.inv:0,g.city,g.dist) : launchCost(g.def,g.inv,g.city,g.dist), can=availFor(D.CITIES[g.city].ccy)>=cost;
    return {title:'Nommer votre société',sm:true,body:actBanner(g.def,'opt still')+
      '<div class="stack"><div class="sub">'+esc(d.n)+' · '+esc((D.CITIES[g.city]||{}).n||'')+'</div>'+
      '<label for="in-bizname" class="tag">Nom de la société</label><input class="inp" id="in-bizname" maxlength="40" autocomplete="off" style="width:100%;font-size:17px" value="'+esc(g.name)+'">'+
      '<div>'+btn('Autre idée','bznext',{c:'sm ghost'})+'</div>'+
      '<div class="row sp">'+btn('Retour','bzback',{c:'ghost'})+btn('Lancer pour '+eur(cost,0),'bzgo',{c:'pri',dis:!can})+'</div></div>'};
  }
  if(m&&m.type==='bzren'){
    const b=S.biz.find(x=>x.id===m.id); if(!b){ ui.modal=null; return _mc3(); }
    return {title:'Renommer',sm:true,body:'<div class="stack"><label for="in-bzren" class="tag">Nouveau nom</label><input class="inp" id="in-bzren" maxlength="40" autocomplete="off" style="width:100%;font-size:17px" value="'+esc(b.name)+'">'+
      '<div class="row sp">'+btn('Annuler','bzrencancel',{c:'ghost'})+btn('Enregistrer','bzrensave',{c:'pri'})+'</div></div>'};
  }
  return _mc3();
}; }

