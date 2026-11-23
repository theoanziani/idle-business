/* ============================================================
   STUDIO : préparer un projet, suivre les tournages et le catalogue
   ============================================================ */
function sdDraft(b){ if(!ui.sd||ui.sd.b!==b.id) ui.sd={b:b.id, t:'em', g:'com', bud:1, tal:[]}; return ui.sd; }
MET.studio.html=function(b){
  const m=b.m, P=sdDraft(b), cost=sdCost(b,P), q=sdQual(b,P), can=availFor(cityOf(b).ccy)>=cost*.2;
  const S1=(lab,k,L,val)=>'<div class="met-c"><b>'+lab+'</b><div class="seg">'+L.map(([v,n,dis])=>'<button class="'+(String(val)===String(v)?'on':'')+'" data-a="sdset" data-i="'+b.id+'" data-j="'+k+'" data-v="'+v+'"'+(dis?' disabled':'')+'>'+n+'</button>').join('')+'</div></div>';
  const trend=g=>{ const v=m.gtr[g].v; return v>=1.4?'en vogue':v>=1?'porteur':v>=.7?'calme':'boudé'; };
  let h='<div class="pk-head"><b>Nouveau projet</b><span class="sub">'+m.prj.length+' tournage'+(m.prj.length>1?'s':'')+' en cours</span></div><div class="pk-pan">';
  h+=S1('Format','t',Object.keys(SD_TYPE).map(k=>[k,SD_TYPE[k].n+' ('+SD_TYPE[k].d+' j)',SD_TYPE[k].rk&&!mxHas(b,SD_TYPE[k].rk)]),P.t);
  h+=S1('Genre','g',Object.keys(SD_GEN).map(k=>[k,SD_GEN[k]+' · '+trend(k)]),P.g);
  h+=S1('Budget','bud',SD_BUD.map((x,i)=>[i,x.n]),P.bud);
  h+='<div class="met-c"><b>Talents (2 au plus)</b><div class="pk-list">'+m.tal.map(t=>{ const on=P.tal.includes(t.id), busy=m.prj.some(p=>p.tal.includes(t.id));
    return '<button class="pk-o'+(on?' match':'')+'" data-a="sdtal" data-i="'+b.id+'" data-v="'+t.id+'"'+(busy?' disabled':'')+'><span><b>'+esc(t.n)+'</b><small>'+t.role+' · '+'★'.repeat(t.fame)+' · à l’aise en '+SD_GEN[t.g].toLowerCase()+(busy?' · en tournage':'')+'</small></span><em class="num">'+eur(metR0(b)*SD_FEE[t.fame],0)+'</em></button>'; }).join('')+'</div></div>';
  h+='<div class="row sp"><div><b class="num">'+eur(cost,0)+'</b><div class="sub">Qualité attendue : '+Math.round(q*100)+' / 100. Le coût est payé au fil du tournage.</div></div><button class="btn sm pri" data-a="met" data-i="'+b.id+'" data-v="start" data-j="'+P.t+':'+P.g+':'+P.bud+':'+(P.tal[0]??'')+':'+(P.tal[1]??'')+'"'+(can?'':' disabled')+'>Lancer le tournage</button></div></div>';
  if(m.prj.length) h+='<div class="pk-head"><b>Tournages</b></div><div class="ht-t">'+m.prj.map(p=>'<div class="rs-d"><div><b>'+esc(p.n)+'</b><small>'+SD_TYPE[p.t].n+' · '+SD_GEN[p.g]+' · sortie dans '+p.left+' j'+(p.drap?' · tournage difficile':'')+'</small>'+bar(1-p.left/p.dur,'g')+'</div></div>').join('')+'</div>';
  const top=m.cat.slice().sort((a,c)=>sdRights(b,c)-sdRights(b,a)).slice(0,5);
  if(top.length) h+='<div class="pk-head"><b>Catalogue</b><span class="sub">Les titres qui rapportent le plus</span></div><div class="ht-t">'+top.map(x=>'<div class="rs-d"><div><b>'+esc(x.n)+'</b><small>'+SD_TYPE[x.t].n+' · '+SD_GEN[x.g]+' · audience '+x.sc+' / 100</small></div><small class="num">'+eur(sdRights(b,x),0)+' / j</small></div>').join('')+'</div>';
  return h;
};
ACT.sdset=el=>{ const P=ui.sd; if(!P) return; const k=el.dataset.j; P[k]= k==='bud'? +el.dataset.v : el.dataset.v; render(); };
ACT.sdtal=el=>{ const P=ui.sd; if(!P) return; const id=+el.dataset.v; P.tal= P.tal.includes(id)? P.tal.filter(x=>x!==id) : P.tal.concat(id).slice(-2); render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='start'&&ui.sd){ ui.sd.tal=[]; render(); } }; }

