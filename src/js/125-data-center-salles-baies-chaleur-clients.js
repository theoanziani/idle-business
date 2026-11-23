/* ============================================================
   DATA CENTER : salles (baies, chaleur), clients, offres
   ============================================================ */
function dcGauge(v,mx,warn){ const f=clamp(v/Math.max(1,mx),0,1.2); return '<div class="dc-g"><i class="'+(f>1?'ko':f>warn?'hot':'')+'" style="width:'+Math.min(100,f*100).toFixed(0)+'%"></i></div>'; }
MET.dc.html=function(b){
  const m=b.m, R0=metR0(b), d=bizDef(b), cash=availFor(cityOf(b).ccy);
  let h='<div class="pk-head"><b>Salles</b><span class="sub">Charge des serveurs face au refroidissement</span></div>';
  m.rm.forEach(r=>{ const used=dcUsed(b,r), L=dcLoad(b,r), Lp=dcLoad(b,r,true), K=dcCoolKw(b,r), C=DC_COOL[r.cool];
    h+='<div class="pk-pan dc-room"><div class="row sp"><b>Salle '+r.id+'</b><span class="sub">Refroidissement '+C.n.toLowerCase()+'</span></div>'+
      '<div class="dc-racks">'+Array.from({length:DC_SLOTS},(_,i)=>'<i class="'+(i<used?'on':'')+'"></i>').join('')+'</div><div class="sub">'+used+' / '+DC_SLOTS+' baies louées</div>'+
      '<div class="sub">Chaleur : '+Math.round(L)+' kW aujourd’hui, '+Math.round(Lp)+' kW aux pics, pour '+Math.round(K)+' kW de refroidissement</div>'+dcGauge(Lp,K,.85);
    const capOf=k=>k==='nat'?DC_COOL[k].kw*dcColdF(b):DC_COOL[k].kw, opts=Object.keys(DC_COOL).filter(k=>k!==r.cool&&capOf(k)>capOf(r.cool)&&!(DC_COOL[k].rk&&!mxHas(b,DC_COOL[k].rk))&&!(k==='nat'&&dcColdF(b)<.3)&&k!=='air');
    if(opts.length) h+='<div class="row" style="flex-wrap:wrap;gap:6px">'+opts.map(k=>'<button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="cool" data-j="'+r.id+':'+k+'"'+(cash<d.cost*DC_COOL[k].c?' disabled':'')+'>'+DC_COOL[k].n+' ('+Math.round(k==='nat'?DC_COOL[k].kw*dcColdF(b):DC_COOL[k].kw)+' kW) · '+eur(d.cost*DC_COOL[k].c,0)+'</button>').join('')+'</div>';
    const cl=m.cl.filter(c=>c.rm===r.id);
    if(cl.length) h+='<div class="ht-t">'+cl.map(c=>{ const tot=c.dt.reduce((a,x)=>a+x,0), other=m.rm.filter(x=>x!==r&&dcUsed(b,x)+c.racks<=DC_SLOTS);
      return '<div class="rs-d"><div><b>'+esc(c.n)+'</b><small>'+c.racks+' baies · garantie '+DC_SLA[c.sla].n+' · charge '+Math.round(c.util*100)+' % · arrêt '+tot.toFixed(1).replace('.',NDEC)+' h / '+String(DC_SLA[c.sla].h).replace('.',NDEC)+' h permises</small></div>'+
        (other.length?'<button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="move" data-j="'+c.id+':'+other[0].id+'">Vers salle '+other[0].id+'</button>':'<small class="num">'+eur(c.p,0)+' / j</small>')+'</div>'; }).join('')+'</div>';
    h+='</div>'; });
  if(m.off.length) h+='<div class="pk-head"><b>Clients qui cherchent un hébergement</b></div><div class="ht-t">'+m.off.map(c=>{ const f=dcFit(b,c), lock=DC_SLA[c.sla].rk&&!mxHas(b,DC_SLA[c.sla].rk);
    return '<div class="ga-lot"><div class="row sp"><div><b>'+esc(c.n)+'</b><small>'+c.racks+' baies · garantie '+DC_SLA[c.sla].n+' ('+String(DC_SLA[c.sla].h).replace('.',NDEC)+' h d’arrêt permises par mois) · charge d’environ '+Math.round(c.util*100)+' % · encore '+Math.max(0,c.until-S.day)+' j</small></div><b class="num">'+eur(c.p,0)+' / j</b></div>'+
      '<div class="row">'+(f?'<button class="btn sm pri" data-a="met" data-i="'+b.id+'" data-v="acc" data-j="'+c.id+':'+f.r.id+'">Installer en salle '+f.r.id+'</button>'+(f.head<0?'<span class="sub">La salle risque la surchauffe</span>':''):'<span class="sub">Pas assez de baies libres</span>')+'<button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="dec" data-j="'+c.id+'">Refuser</button></div></div>'; }).join('')+'</div>';
  return h;
};

