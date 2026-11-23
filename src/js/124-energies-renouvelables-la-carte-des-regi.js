/* ============================================================
   ÉNERGIES RENOUVELABLES : la carte des régions, les centrales, les contrats
   ============================================================ */
function rnDots(v){ const n=Math.round(clamp(v,0,2)*2.5); return '<span class="rn-dots">'+[0,1,2,3,4].map(i=>'<i class="'+(i<n?'on':'')+'"></i>').join('')+'</span>'; }
const RN_ICO={sol:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  eol:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v11M12 11l-1-8 2 0zM12 11l7 4-1 1.7zM12 11l-7 4 1 1.7z"/></svg>',
  hyd:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/></svg>'};
function rnDraft(b){ if(!ui.rn||ui.rn.b!==b.id) ui.rn={b:b.id, r:null}; return ui.rn; }
MET.renew.html=function(b){
  const m=b.m, P=rnDraft(b), R0=metR0(b), cash=availFor(cityOf(b).ccy);
  let h='<div class="pk-head"><b>Carte des régions</b><span class="sub">Touchez une région pour y construire</span></div><div class="rn-map">';
  Object.keys(RN_REG).forEach(k=>{ const R=RN_REG[k], g=m.reg[k], lock=R.rk&&!mxHas(b,R.rk), w=m.wx[k], pl=m.pl.filter(p=>p.r===k);
    h+='<button class="rn-reg'+(P.r===k?' sel':'')+(g.auth?' auth':'')+'" data-a="rnreg" data-i="'+b.id+'" data-v="'+k+'"'+(lock?' disabled':'')+'><b>'+esc(R.n)+'</b>'+
      '<small>Soleil '+rnDots(R.s)+'</small><small>Vent '+rnDots(R.w)+'</small>'+(R.h?'<small>Rivières '+rnDots(R.h/1.2)+'</small>':'')+
      '<span class="rn-pl">'+(lock?'Palier '+R.rk:g.auth?(pl.length?pl.map(p=>'<span class="rn-ic rn-'+p.t+(p.down>S.day?' off':'')+'">'+RN_ICO[p.t]+(p.sz>1?'<em>×3</em>':'')+'</span>').join(''):'Autorisée, aucune centrale'):g.req?'Demande en cours':g.ban>S.day?'Opposition locale':'Sans autorisation')+'</span></button>'; });
  h+='</div>';
  if(P.r&&RN_REG[P.r]){ const k=P.r, R=RN_REG[k], g=m.reg[k], w=m.wx[k];
    h+='<div class="pk-pan"><div class="row sp"><b>'+esc(R.n)+'</b><span class="sub">Aujourd’hui : soleil '+Math.round(w.s*100)+' %, vent '+Math.round(w.w*100)+' %</span></div>';
    if(!g.auth){ h+='<div class="row sp"><div class="sub">'+(g.req?'Réponse dans '+(g.req-S.day)+' jours.':g.ban>S.day?'L’opposition locale bloque les demandes pendant '+(g.ban-S.day)+' jours.':'Demande d’autorisation : '+eur(R0,0)+', réponse en 30 à 50 jours. Les riverains peuvent s’y opposer.')+'</div><button class="btn sm pri" data-a="met" data-i="'+b.id+'" data-v="req" data-j="'+k+'"'+(g.req||g.ban>S.day||cash<R0?' disabled':'')+'>Demander</button></div>'; }
    else { h+='<div class="ht-t">'+Object.keys(RN_T).map(t=>{ const T=RN_T[t], e=rnCanBuild(b,t,k); if(e&&(t==='hyd'&&!R.h||t==='sol'&&k==='mer')) return '';
        const res=T.rs==='s'?R.s:T.rs==='w'?R.w:R.h, sizes=m.big?[1,3]:[1];
        return sizes.map(sz=>{ const c=rnCost(b,t,k,sz), day=R0*T.k*res*sz*(k==='mer'?1.2:1);
          return '<div class="rs-d"><div><b>'+T.n+(sz>1?' géant':'')+'</b><small>Environ '+eur(day,0)+' par jour au prix moyen'+(e?' · '+e:'')+'</small></div><button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="build" data-j="'+t+':'+k+':'+sz+'"'+(e||cash<c?' disabled':'')+'>'+eur(c,0)+'</button></div>'; }).join(''); }).join('')+'</div>';
      const pl=m.pl.filter(p=>p.r===k); if(pl.length) h+='<div class="sub" style="margin-top:6px">Centrales de la région</div><div class="ht-t">'+pl.map(p=>'<div class="rs-d"><div><b>'+RN_T[p.t].n+(p.sz>1?' géant':'')+'</b><small>'+(p.down>S.day?'À l’arrêt encore '+(p.down-S.day)+' jours':'Aujourd’hui : '+eur(rnOut(b,p)*R0*m.px,0))+'</small></div><button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="sell" data-j="'+p.id+'">Revendre</button></div>').join('')+'</div>'; }
    h+='</div>'; }
  /* contrats */
  const avg=m.pxh.reduce((a,x)=>a+x,0)/m.pxh.length, p=Math.round(avg*.97*100)/100;
  h+='<div class="pk-head"><b>Vente de l’électricité</b><span class="sub">Prix moyen des 60 derniers jours : '+avg.toFixed(2).replace('.',NDEC)+'</span></div><div class="pk-pan">';
  h+=rnSpark(m.pxh);
  h+='<div class="met-c"><b>'+(m.ctr.sh?'Contrat en cours : '+Math.round(m.ctr.sh*100)+' % à '+m.ctr.p.toFixed(2).replace('.',NDEC)+' jusqu’au '+dateL(m.ctr.until):'Contrat d’un an')+'</b><div class="seg">'+[[0,'Aucun'],[.3,'30 %'],[.6,'60 %'],[.9,'90 %']].map(([v,n])=>'<button class="'+(m.ctr.sh===v?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="ctr" data-j="'+v+'">'+n+'</button>').join('')+'</div><div class="sub">Un contrat vend une part de la production à prix fixe pendant un an'+(m.ctr.sh?'':' (aujourd’hui : '+String(p).replace('.',NDEC)+')')+'. Il protège des jours bon marché, mais prive des flambées.</div></div></div>';
  return h;
};
function rnSpark(L){ const W=320, H=56, mx=Math.max(1.6,...L), mn=Math.min(.5,...L), x=i=>i*W/(L.length-1), y=v=>H-4-(v-mn)/(mx-mn)*(H-8);
  return '<svg class="rn-spark" style="height:56px;display:block" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="Prix de l’électricité sur 60 jours"><line x1="0" x2="'+W+'" y1="'+y(1)+'" y2="'+y(1)+'" class="ref"/><polyline points="'+L.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')+'"/></svg>'; }
ACT.rnreg=el=>{ const P=ui.rn; if(!P) return; P.r= P.r===el.dataset.v? null : el.dataset.v; render(); };

