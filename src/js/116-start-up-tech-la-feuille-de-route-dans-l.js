/* ============================================================
   START-UP TECH : la feuille de route dans la fiche
   ============================================================ */
MET.saas.html=function(b){
  const m=b.m, h=m.gH;
  let x='<div class="pk-head"><b>Feuille de route</b><span class="sub">'+(m.dev? 'En cours : '+esc((SA_FEAT.find(f=>f.id===m.dev.id)||{}).n||'') : 'Choisissez la prochaine fonctionnalité')+'</span></div>';
  if(m.dev){ const f=SA_FEAT.find(z=>z.id===m.dev.id); if(f) x+=bar(m.dev.p/f.w,'g')+'<div class="sub">'+Math.round(m.dev.p)+' / '+f.w+' jours d’ingénieur. Plus d’ingénieurs dans l’équipe, plus vite c’est prêt.</div>'; }
  x+='<div class="pk-list">'+SA_FEAT.map(f=>{ const done=m.feat[f.id], lock=(f.rk&&!mxHas(b,f.rk)&&!(f.id==='ia'&&m.ai))||(f.id==='ia'&&!m.ai), cur=m.dev&&m.dev.id===f.id;
    const eff=[f.q?'attrait +'+Math.round(f.q*100)+' %':'',f.cp?'abonnés Pro '+multPct(f.cp):'',f.ce?'sociétés '+multPct(f.ce):'',f.tam?'marché '+multPct(f.tam):'',f.ech?'départs de sociétés −30 %':''].filter(Boolean).join(' · ');
    return '<button class="pk-o'+(cur?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="dev" data-j="'+f.id+'"'+(done||lock?' disabled':'')+'><span><b>'+esc(f.n)+'</b><small>'+(done?'En ligne · ':lock?(f.id==='ia'&&mxHas(b,3)?'Après le pivot IA · ':'Palier '+f.rk+' requis · '):'')+esc(eff)+'</small></span><em class="num">'+(done?'':f.w+' j')+'</em></button>'; }).join('')+'</div>';
  if(h.length>=2) x+='<div class="sub">Revenu mensuel sur les derniers mois : '+h.slice(-6).map(v=>eur(v,0)).join(' → ')+'.</div>';
  if(m.obj) x+='<div class="notice info">Objectif des investisseurs : '+eur(m.obj.need,0)+' de chiffre d’affaires par jour avant le '+footDateLabel(m.obj.until)+'.</div>';
  return x;
};
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='exit'&&ui.modal&&ui.modal.type==='biz'&&!S.biz.some(x=>x.id===ui.modal.id)){ ui.modal=null; render(); } }; }

