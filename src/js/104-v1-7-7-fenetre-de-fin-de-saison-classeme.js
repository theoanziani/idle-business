/* ============================================================
   V1.7.7 : fenêtre de fin de saison (classement animé, primes, records, montée / descente)
   ============================================================ */
{ const _dnF=doNext; doNext=function(){ _dnF.apply(this,arguments); try{ const O=fcOwn(); if(O&&O.troQ&&O.troQ.length){ O.troQ.splice(0).forEach(t=>pushModal({type:'fctro',t})); render(); } }catch(e){} try{ const O=fcOwn(); if(O&&O.endPop){ const d=O.endPop; O.endPop=null; pushModal({type:'fcseason',d}); render(); } }catch(e){} }; }
{ const _mcS=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='fcseason'&&m.d)) return _mcS(); const d=m.d, O=fcOwn();
  const tot=d.parts.reduce((a,x)=>a+x[1],0), n=d.rows.length;
  const ban= d.mv==='up'? '<div class="fcs-ban up"><b>Montée en '+esc(d.to)+'</b><small>Prime de montée, bonus des sponsors et stade plus rempli toute la saison prochaine.</small></div>'
    : d.mv==='down'? '<div class="fcs-ban down"><b>Relégation en '+esc(d.to)+'</b><small>Une indemnité parachute amortit la baisse des droits TV pendant deux saisons.</small></div>'
    : d.pos===0? '<div class="fcs-ban up"><b>Champion de '+esc(d.n)+'</b></div>' : '';
  const rows=d.rows.map((r,i)=>{ const mine=O&&r[0]===O.id, E=FT_EU[d.lid], z= i<d.zone.up? ' zu' : i>=n-d.zone.down? ' zd' : E&&i<E[0]? ' zc1' : E&&i<E[0]+E[1]? ' zc2' : E&&i<E[0]+E[1]+E[2]? ' zc3' : '';
    return '<div class="fcs-r'+(mine?' me':'')+z+'" style="animation-delay:'+Math.min(i*45,1100)+'ms"><span class="p">'+(i+1)+'</span><span class="c">'+esc(footName(r[0]))+'</span><span class="g num">'+((r[2]-r[3])>0?'+':'')+(r[2]-r[3])+'</span><b class="num">'+r[1]+'</b></div>'; }).join('');
  const recRow=(k,l,v)=>'<div class="rs-d"><div><b>'+l+'</b><small>'+v+'</small></div>'+(d.nr.includes(k)? pill('Nouveau record','good') : '')+'</div>';
  const B=d.rec.best, bl=B? (B.pos+1)+(B.pos?'e':'er')+' de '+esc((FOOT_LEAGUES.find(x=>x.id===B.lid)||{n:''}).n)+' ('+esc(B.y)+')' : '';
  return {title:'Fin de saison '+esc(d.y), body:'<div class="stack">'+ban+
    '<div class="sub">'+(d.pos+1)+(d.pos?'e':'er')+' de '+esc(d.n)+' sur '+n+'.</div><div class="fcs-t"><div class="fcs-h"><span class="p">#</span><span class="c">Club</span><span class="g">Diff.</span><b>Pts</b></div>'+rows+'</div>'+
    (d.parts.length? '<div class="tag">Primes</div><div class="flist">'+d.parts.map(x=>'<div><span>'+esc(x[0])+'</span><span class="num pos">'+eur(x[1],0)+'</span></div>').join('')+'</div><div class="row sp"><b>Total</b><b class="num pos fcs-tot" data-v="'+tot+'">'+eur(tot,0)+'</b></div>' : '')+
    '<div class="tag">Records du club</div><div class="ht-t">'+recRow('Meilleur classement','Meilleur classement',bl)+recRow('Points','Points sur une saison',d.rec.pts)+recRow('Buts marqués','Buts sur une saison',d.rec.gf)+recRow('Série sans défaite','Série sans défaite',d.rec.unb+' matchs')+'</div>'+
    '<div>'+btn('Continuer','closemodal',{c:'pri'})+'</div></div>'}; }; }
/* compteur des primes et retour haptique à l'ouverture */
{ const _rF=render; render=function(){ _rF.apply(this,arguments); try{ const el=document.querySelector('.fcs-tot:not([data-done])'); if(el){ el.setAttribute('data-done','1'); const v=+el.dataset.v; setTimeout(()=>tweenText(el,0,v,x=>eur(x,0),1400),700);
  if(typeof haptic==='function'){ const d=ui.modal&&ui.modal.d; haptic(d&&d.mv==='down'?'warning':'success'); } } }catch(e){} }; }

ACT.fckeep=el=>{ const O=fcOwn(); if(!O) return; const id=el.dataset.i, p=O.sq.find(x=>String(x.id)===String(id)); if(!p) return; O.keep=O.keep||{}; if(O.keep[p.id]){ delete O.keep[p.id]; toast(p.n+' n’est plus protégé.','good'); } else { O.keep[p.id]=1; if(O.list[p.id]) delete O.list[p.id]; toast(p.n+' est intouchable : le directeur sportif ne le vendra pas.','good'); } render(); };

