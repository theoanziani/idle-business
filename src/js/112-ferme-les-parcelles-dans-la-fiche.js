/* ============================================================
   FERME : les parcelles dans la fiche
   ============================================================ */
function fmSel(b){ return ui.fm&&ui.fm.b===b.id? ui.fm.i : -1; }
function fmStage(b,x){ const c=fmCrop(x.c), R0=metR0(b);
  if(c.k==='elev') return {t:'Production chaque jour : '+eur(c.d*fmMult(b,c)*R0*(b.m.ev&&b.m.ev.k==='mal'?.6:1),0), p:1};
  if(c.k==='per'){ if(!x.h1){ const nx=fmNextDoy(c.hd,Math.max(S.day,x.first)-1); return {t:'Jeunes plants : première récolte le '+footDateLabel(nx,{noY:1})+' (60 % d’une récolte normale)', p:clamp((S.day-x.s)/Math.max(1,nx-x.s),0,1)}; }
    const nx=fmNextDoy(c.hd,S.day); return {t:'Prochaine récolte le '+footDateLabel(nx,{noY:1}), p:1-(nx-S.day)/360}; }
  if(x.wait) return {t:'Récolté. Resemis à partir du '+footDateLabel(c.a+1,{noY:1}), p:0};
  const pr=clamp((S.day-x.s)/(x.h-x.s),0,1); return {t:(pr<.15?'Semis':pr<.85?'Croissance':'Bientôt la récolte')+' · récolte le '+footDateLabel(x.h,{noY:1}), p:pr}; }
MET.farm.html=function(b){
  const m=b.m, sel=fmSel(b), R0=metR0(b), can=x=>availFor(cityOf(b).ccy)>=x;
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+'>'+lab+'</button>';
  let h='<div class="pk-head"><b>Les parcelles</b><span class="sub">'+(m.ready>0? eur(m.ready,0)+' de récolte à vendre au prochain jour ouvré' : 'Touchez une parcelle vide pour l’exploiter')+'</span></div><div class="fm-g">';
  for(let i=0;i<fmOwn(b);i++){ const x=m.p[i], c=x&&fmCrop(x.c);
    if(!x){ h+='<button class="fm-p empty'+(i===sel?' sel':'')+'" data-a="fmsel" data-i="'+b.id+'" data-v="'+(i===sel?-1:i)+'"><b>Parcelle '+(i+1)+'</b><small>Libre</small><span class="pk-plus">+</span></button>'; continue; }
    const st=fmStage(b,x);
    h+='<div class="fm-p k-'+c.k+'"><b>'+esc(c.n)+'</b><small>'+esc(st.t)+(x.dmg>.05?' · récolte −'+Math.round(x.dmg*100)+' %':'')+'</small>'+bar(st.p,x.dmg>.3?'a':'g')+
      '<div class="fm-a">'+(c.k==='cult'? B(x.auto?'Auto : oui':'Auto : non','auto',i,{c:'sm ghost'}) : '')+B('Libérer','clear',i,{c:'sm ghost'})+'</div></div>'; }
  h+='</div>';
  if(fmOwn(b)<12){ const pc=fmPlotCost(b), lock=fmOwn(b)>=8&&!mxHas(b,5); h+='<div class="row sp"><span class="sub">'+(lock?'Palier 5 requis pour agrandir encore le domaine.':'Agrandir le domaine d’une parcelle.')+'</span>'+B('Acheter : '+eur(pc,0),'plot','',{c:'sm',dis:lock||!can(pc)})+'</div>'; }
  if(sel>=0&&!m.p[sel]){
    h+='<div class="pk-pan"><div class="row sp"><b>Parcelle '+(sel+1)+'</b><button class="btn sm ghost" data-a="fmsel" data-i="'+b.id+'" data-v="-1">Fermer</button></div><div class="pk-list">'+FM_CROP.map(c=>{ const ok=fmCanSow(b,c), cost=bizDef(b).cost*(c.plant||0), v=fmScore(b,c)*R0;
      const info= c.k==='cult'? 'Semis du '+footDateLabel(c.a+1,{noY:1})+' au '+footDateLabel(c.z+1,{noY:1})+' · récolte '+Math.round(c.g/30)+' mois après' : c.k==='per'? 'Première récolte dès la saison de plantation (vers le '+footDateLabel(c.hd+1,{noY:1})+', 60 % pour de jeunes plants), puis chaque année' : 'Production chaque jour';
      return '<button class="pk-o" data-a="met" data-i="'+b.id+'" data-v="sow" data-j="'+sel+':'+c.id+'"'+(!ok||!can(cost)?' disabled':'')+'><span><b>'+esc(c.n)+'</b><small>'+esc(ok? info+' · environ '+eur(v,0)+' net / jour' : 'Hors saison · '+info)+'</small></span><em class="num">'+(cost? eur(cost,0) : 'Gratuit')+'</em></button>'; }).join('')+'</div></div>';
  }
  return h;
};
ACT.fmsel=el=>{ const v=+el.dataset.v; ui.fm= v<0? null : {b:+el.dataset.i, i:v}; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='sow'&&ui.fm){ ui.fm=null; render(); } }; }

