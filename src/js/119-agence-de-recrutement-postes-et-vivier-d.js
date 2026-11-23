/* ============================================================
   AGENCE DE RECRUTEMENT : postes et vivier dans la fiche
   ============================================================ */
MET.staffing.html=function(b){
  const m=b.m, sel=ui.st&&ui.st.b===b.id? ui.st.j : 0;
  let h='<div class="pk-head"><b>Postes à pourvoir</b><span class="sub">Proposez le bon candidat</span></div>';
  h+= m.jobs.length? m.jobs.slice().sort((a,c)=>a.exp-c.exp).map(j=>{ const f=j.cdi? 'Placement définitif · commission '+eur(j.bud*(j.l>=3?.25:.15)*stPf(b),0)+' environ' : 'Intérim '+j.dur+' jours · environ '+eur(j.bud/220*.12*stPf(b),0)+' par jour';
    let x='<div class="rs-d"><div><b>'+ST_LVL[j.l].n+' · '+ST_SEC[j.sec]+'</b><small>'+esc(j.cl)+' · qualité '+j.need+' minimum · budget '+eur(j.bud,0)+' par an · '+f+(j.prop? ' · candidature de '+esc(j.prop.c.n)+' en attente ('+Math.round(j.prop.p*100)+' %)' : ' · expire dans '+Math.max(0,j.exp-S.day)+' j')+'</small></div>'+
      (j.prop? '' : '<button class="btn sm ghost" data-a="stsel" data-i="'+b.id+'" data-v="'+(sel===j.id?0:j.id)+'">'+(sel===j.id?'Fermer':'Proposer')+'</button>')+'</div>';
    if(sel===j.id){ const L=m.pool.map(c=>[c,stMatch(b,j,c)]).sort((a,c)=>c[1]-a[1]).slice(0,6);
      x+='<div class="pk-list">'+(L.length? L.map(([c,p])=>'<button class="pk-o'+(p>=.6?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="prop" data-j="'+j.id+':'+c.id+'"><span><b>'+esc(c.n)+'</b><small>'+ST_LVL[c.l].n+' · '+ST_SEC[c.sec]+' · qualité '+c.q+' · demande '+eur(c.sal,0)+'</small></span><em class="num">'+Math.round(p*100)+' %</em></button>').join('') : '<div class="sub">Vivier vide : augmentez la chasse de candidats.</div>')+'</div>'; }
    return x; }).join('') : '<div class="sub">Aucun poste pour le moment.</div>';
  const cnt={}; m.pool.forEach(c=>cnt[c.sec]=(cnt[c.sec]||0)+1);
  h+='<div class="sub">Vivier : '+Object.keys(ST_SEC).map(k=>ST_SEC[k]+' '+(cnt[k]||0)).join(' · ')+'. Sans proposition de votre part, les recruteurs proposent eux-mêmes un profil proche au bout de 6 jours.</div>';
  return h;
};
ACT.stsel=el=>{ const v=+el.dataset.v; ui.st= v? {b:+el.dataset.i, j:v} : null; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='prop'&&ui.st){ ui.st=null; render(); } }; }

