/* ============================================================
   HÔTEL : les chambres et leurs prix dans la fiche
   ============================================================ */
MET.hotel.html=function(b){
  htFix(b); const m=b.m, c=htCalc(b);
  const B=(lab,arg,l)=>'<button class="btn sm ghost ht-b" data-a="met" data-i="'+b.id+'" data-v="px" data-j="'+arg+'" aria-label="'+esc(l)+'">'+lab+'</button>';
  let h='<div class="pk-head"><b>Les chambres</b><span class="sub">'+(m.dyn?'Prix dynamiques : ajustés chaque jour':'Prix fixés par vous')+'</span></div><div class="ht-t">';
  c.rows.forEach(r=>{ if(!r.N) return; const t=r.t, o=m.y&&m.y.rows? (m.y.rows.find(x=>x.id===t.id)||{}).o : r.occ/r.N;
    h+='<div class="ht-r"><div class="ht-n"><b>'+t.n+'</b><small>'+r.N+' chambre'+(r.N>1?'s':'')+' · occupées à '+Math.round((o||0)*100)+' %</small>'+bar(o||0,o>.9?'g':o>.6?'':'a')+'</div>'+
      '<div class="ht-p">'+B('−',t.id+':-0.05','Baisser le prix '+t.n)+'<span><b class="num">'+eur(r.price*c.k,0)+'</b><small>'+Math.round(m.px[t.id]*100)+' %</small></span>'+B('+',t.id+':0.05','Monter le prix '+t.n)+'</div></div>'; });
  h+='</div><div class="sub">Changer un prix à la main désactive les prix dynamiques. Les clients comparent le prix au classement, au spa et à la note des avis.</div>';
  return h;
};

