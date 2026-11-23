/* ============================================================
   HAUTE COUTURE : créer la collection, choisir la ville du défilé, directeur artistique
   ============================================================ */
function hcDraft(b){ if(!ui.hc||ui.hc.b!==b.id) ui.hc={b:b.id, sty:(b.m.da&&b.m.da.aff)||'cla', look:1, mat:'std', city:b.city}; return ui.hc; }
MET.couture.html=function(b){
  const m=b.m, P=hcDraft(b), R0=metR0(b), cash=availFor(cityOf(b).ccy), d=m.da;
  const S1=(lab,k,L,val)=>'<div class="met-c"><b>'+lab+'</b><div class="seg">'+L.map(([v,n,dis])=>'<button class="'+(String(val)===String(v)?'on':'')+'" data-a="hcset" data-i="'+b.id+'" data-j="'+k+'" data-v="'+v+'"'+(dis?' disabled':'')+'>'+n+'</button>').join('')+'</div></div>';
  const trend=k=>{ const v=m.sty[k].v; return v>=1.3?'en vogue':v>=1?'porteur':v>=.75?'calme':'passé de mode'; };
  let h='';
  /* directeur artistique */
  h+='<div class="pk-head"><b>Directeur artistique</b>'+(d?'<span class="sub">Humeur : '+(d.mood>=70?'inspiré':d.mood>=45?'serein':d.mood>=30?'agacé':'au bord de la rupture')+'</span>':'')+'</div>';
  h+= d? '<div class="rs-d"><div><b>'+esc(d.n)+'</b><small>Talent '+'★'.repeat(d.tal)+' · préfère le style '+HC_STY[d.aff].toLowerCase()+' · '+(d.cap>.45?'très capricieux':d.cap>.25?'capricieux':'facile à vivre')+'</small></div></div>'
       : '<div class="notice warn">La maison n’a plus de directeur artistique : recrutez-en un pour créer une collection.</div>';
  h+='<div class="sub" style="margin-top:6px">Candidats</div><div class="ht-t">'+m.cand.map(c=>'<div class="rs-d"><div><b>'+esc(c.n)+'</b><small>Talent '+'★'.repeat(c.tal)+' · '+HC_STY[c.aff].toLowerCase()+' · '+(c.cap>.45?'très capricieux':c.cap>.25?'capricieux':'facile à vivre')+'</small></div><button class="btn sm" data-a="met" data-i="'+b.id+'" data-v="hire" data-j="'+c.id+'"'+(cash<R0*8*c.tal?' disabled':'')+'>'+eur(R0*8*c.tal,0)+'</button></div>').join('')+'</div>';
  /* collection */
  if(m.col&&m.col.left>0){ const C=m.col;
    h+='<div class="pk-head"><b>Collection « '+esc(C.n)+' »</b><span class="sub">Prête dans '+C.left+' j</span></div><div class="rs-d"><div><b>'+HC_STY[C.sty]+'</b><small>'+HC_LOOK[C.look].n+' · '+HC_MAT[C.mat].n.toLowerCase()+'</small>'+bar(1-C.left/C.dur,'g')+'</div></div>';
  } else if(m.col){ const C=m.col, cs=Object.keys(HC_CITY).filter(c=>c===b.city||cityUnlocked(c));
    if(!cs.includes(P.city)) P.city=b.city;
    h+='<div class="pk-head"><b>Défilé « '+esc(C.n)+' »</b><span class="sub">La collection est prête</span></div><div class="pk-pan">';
    h+=S1('Ville du défilé','city',cs.map(c=>[c,D.CITIES[c].n]),P.city);
    h+='<div class="row sp"><div><b>Note attendue : '+note5(hcExp(b,C,P.city))+' / 5</b><div class="sub">'+(P.city===b.city?'Dans votre ville'+(m.fw?', pendant votre semaine de la mode.':'.'):'Déplacement : '+eur(R0*5,0)+'.')+' La critique tranche le jour même.</div></div><button class="btn sm pri" data-a="met" data-i="'+b.id+'" data-v="show" data-j="'+P.city+'">Lancer le défilé</button></div></div>';
  } else {
    const C={sty:P.sty, look:P.look, mat:P.mat}, cost=hcColCost(b,C);
    h+='<div class="pk-head"><b>Nouvelle collection</b><span class="sub">'+HC_SEAS[(m.seas+1)%3]+'</span></div><div class="pk-pan">';
    h+=S1('Style','sty',Object.keys(HC_STY).map(k=>[k,HC_STY[k]+' · '+trend(k)]),P.sty);
    h+=S1('Ampleur','look',HC_LOOK.map((x,i)=>[i,x.n]),P.look);
    h+=S1('Tissus','mat',Object.keys(HC_MAT).map(k=>[k,HC_MAT[k].n,k==='own'&&!hcTex()]),P.mat);
    if(!hcTex()) h+='<div class="sub">Avec une société textile, vos propres filatures fournissent des tissus 20 % moins chers et de meilleure qualité.</div>';
    h+='<div class="row sp"><div><b class="num">'+eur(cost,0)+'</b><div class="sub">Note attendue dans votre ville : '+note5(hcExp(b,C,b.city))+' / 5'+(d&&d.aff!==P.sty?'. '+esc(d.n)+' préférerait le style '+HC_STY[d.aff].toLowerCase()+'.':'.')+' Création en 50 jours.</div></div><button class="btn sm pri" data-a="met" data-i="'+b.id+'" data-v="create" data-j="'+P.sty+':'+P.look+':'+P.mat+'"'+(!d||cash<cost*.3?' disabled':'')+'>Créer la collection</button></div></div>';
  }
  if(m.last) h+='<div class="sub" style="margin-top:6px">Dernier défilé : « '+esc(m.last.n)+' » à '+esc(D.CITIES[m.last.city].n)+', note '+note5(m.last.sc)+' / 5.</div>';
  /* commandes */
  if(m.ord.length) h+='<div class="pk-head"><b>Commandes sur mesure</b><span class="sub">'+m.art+' artisans</span></div><div class="ht-t">'+m.ord.slice(0,6).map(o=>'<div class="rs-d"><div><b>'+esc(o.n)+'</b><small>Robe sur mesure</small>'+bar(o.done/o.w,'g')+'</div><small class="num">'+eur(o.v,0)+'</small></div>').join('')+'</div>';
  return h;
};
ACT.hcset=el=>{ const P=ui.hc; if(!P) return; const k=el.dataset.j; P[k]= k==='look'? +el.dataset.v : el.dataset.v; render(); };

