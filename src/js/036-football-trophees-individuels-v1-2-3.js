/* ============================================================
   Football : trophées individuels (V1.2.3)
   Ballon d'or et trophée du meilleur gardien fin octobre, Golden Boy (moins de 21 ans) mi-décembre.
   Classement : note du joueur + titres récents de son club + un peu de hasard.
   État : S.foot.aw = [{y, bdo:[…10], gk, gb}] (10 dernières années, créé au premier besoin).
   ============================================================ */
function awTop(){ return FOOT_LEAGUES.filter(L=>L.lvl===1).map(L=>L.id); }
function awClubBonus(id){
  let b=0; const lid=footLgOf(id), h=S.foot.hist[lid]; if(h&&h[0]&&h[0].champ===id) b+=3;
  Object.keys(S.foot.icHist||{}).forEach(k=>{ const x=S.foot.icHist[k][0]; if(x&&x.champ===id) b+= k==='eu1'? 5 : 2; });
  const nat=footClub(id).nat, c=S.foot.cupHist&&S.foot.cupHist[nat]&&S.foot.cupHist[nat][0]; if(c&&c.champ===id) b+=1;
  return b;
}
function awPool(){
  const O=fcOwn(), out=[];
  awTop().forEach(lid=>{ const lg=S.foot.lg[lid]; if(!lg) return; lg.grp.flat().forEach(id=>{ const sq= O&&O.id===id? O.sq : footSquad(id), bon=awClubBonus(id);
    sq.slice().sort((a,b)=>b.o-a.o).slice(0,4).forEach(p=>out.push({p, club:id, s:p.o+bon+(frnd()-.5)*3})); }); });
  if(O&&!out.some(x=>x.club===O.id)) O.sq.slice().sort((a,b)=>b.o-a.o).slice(0,4).forEach(p=>out.push({p, club:O.id, s:p.o+awClubBonus(O.id)+(frnd()-.5)*3}));
  return out;
}
const awRow=x=>({n:x.p.n, club:x.club, o:Math.round(x.p.o), p:x.p.p, nat:x.p.nat, a:x.p.a, id:x.p.id});
function awOf(y){ const A=S.foot.aw||(S.foot.aw=[]); let e=A.find(x=>x.y===y); if(!e){ e={y}; A.unshift(e); if(A.length>10) A.pop(); } return e; }
function awOwnNote(r,label){ const O=fcOwn(); if(!O||r.club!==O.id) return; const q=O.sq.find(p=>String(p.id)===String(r.id)); if(q){ (q.aw=q.aw||[]).push(label); }
  if(!/^[0-9]/.test(label)&&typeof troAdd==='function') troAdd('aw',label.replace(/ [0-9]{4}$/,''),label.match(/[0-9]{4}$/)?label.match(/[0-9]{4}$/)[0]:'',r.n);
  fcNews(r.n+' : '+label+'.','good'); O.mor=clamp(O.mor+3,10,100); }
function awBallon(day){
  const y=footDate(day).y, pool=awPool().sort((a,b)=>b.s-a.s), e=awOf(y);
  e.bdo=pool.slice(0,10).map(awRow); const g=pool.filter(x=>x.p.p==='G')[0]; e.gk=g&&awRow(g);
  const w=e.bdo[0]; log('good','Football : Ballon d’or '+y+' pour '+w.n+' ('+footName(w.club)+').','news');
  if(e.gk) log('info','Football : trophée du meilleur gardien pour '+e.gk.n+' ('+footName(e.gk.club)+').','news');
  e.bdo.forEach((r,i)=>awOwnNote(r, i===0? 'Ballon d’or '+y : (i+1)+'e du Ballon d’or '+y)); if(e.gk) awOwnNote(e.gk,'meilleur gardien '+y);
}
function awGolden(day){
  const y=footDate(day).y, pool=awPool().filter(x=>x.p.a<=21).sort((a,b)=>b.s-a.s), e=awOf(y);
  const all=pool.length? pool : []; const O=fcOwn();
  /* les jeunes ne sont pas toujours parmi les 4 meilleurs d'un club : on ajoute les espoirs de votre club */
  if(O) O.sq.filter(p=>p.a<=21).forEach(p=>all.push({p,club:O.id,s:p.o+awClubBonus(O.id)}));
  all.sort((a,b)=>b.s-a.s); if(!all.length) return; e.gb=awRow(all[0]);
  log('info','Football : Golden Boy '+y+' pour '+e.gb.n+' ('+footName(e.gb.club)+').','news'); awOwnNote(e.gb,'Golden Boy '+y);
}
function awStep(day){ const t=footDate(day); if(t.m===10&&t.d===28) awBallon(day); if(t.m===12&&t.d===16) awGolden(day); }
{ const _fs=footStep; footStep=function(day){ _fs(day); try{ awStep(day); }catch(e){ console.error(e); } }; }

