/* ============================================================
   DÉMÉNAGEMENT : une société au niveau maximal de son bâtiment peut partir vers un plus grand
   (même ville). Elle garde son niveau, son équipe et son métier ; 3 jours de fermeture.
   ============================================================ */
function bizMaxHere(b){ if(!b.bld) return MAXLVL; const bd=bldById(b.bld); return bd? bldMaxLvl(bd,b.def) : MAXLVL; }
function relocCost(b){ return bizBase(b).R0*3*b.lvl; }
/* V1.4.4 : on peut déménager à tout moment vers un bâtiment libre de la même ville qui accepte le niveau actuel */
function relocCands(b,all){ const C=D.CITIES[b.city]; if(!C||!b.bld) return []; const sec=bizSec(b.def);
  const out=[]; C.d.forEach(dd=>bldList(b.city,dd.id).forEach(bd=>{ if(bd.id===b.bld) return; const mx=bldMaxLvl(bd,b.def); if(!mx||mx<b.lvl) return;
    const h=bldHeld(bd.id); if(h&&h.biz&&S.biz.some(x=>x.id===h.biz)) return; if(rivShopAt(bd.id)||consOf(bd.id)) return;
    const f=fitLabel(sec,dd), fit=f[0]==='Idéal'?3:f[0]==='Bon choix'?2:f[0]==='Correct'?1:0; out.push({bd, mx, h, f, fit}); }));
  out.sort((x,y)=>(y.fit-x.fit)||(y.mx-x.mx)||(bldRent(x.bd)-bldRent(y.bd)));
  return all? out : out.slice(0,8); }
function relocBiz(b,id){
  if(!b||b.status!=='active') return err('Société indisponible.'); if(b.up) return err('Attendez la fin de l’agrandissement en cours.'); const bd=bldById(id); if(!bd||bd.city!==b.city) return err('Bâtiment introuvable dans cette ville.');
  if(!relocCands(b,1).some(x=>x.bd.id===id)) return err('Ce bâtiment ne convient pas.');
  const c=relocCost(b); if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+' de déménagement.');
  if(!bldHeld(id)){ const r=rentBuilding(id); if(!r.ok) return r; }
  const old=b.bld, ho=bldHeld(old);
  payCap('b:'+b.id,'Déménagement : '+b.name,-c); settleAccounts();
  if(ho){ ho.biz=null; if(ho.st==='rent'){ if(ho.dep) payCap('c:'+b.city,'Restitution du dépôt de garantie',ho.dep); delete S.bld[old]; } }
  b.bld=id; b.dist=bd.dist; b.cf=locCostF(b.def,b.city,bd.dist); S.bld[id].biz=b.id; b.closedUntil=Math.max(b.closedUntil||0,S.day+3);
  log('good','« '+b.name+' » déménage au '+bd.addr+' : jusqu’au niveau '+bldMaxLvl(bd,b.def)+' possible. Fermeture de 3 jours.');
  return ok('Déménagement : réouverture dans 3 jours.'); }

/* V1.4.4 : agrandir toutes les sociétés d'un niveau, les moins chères d'abord, tant que la trésorerie suit */
function upAllInfo(){ const L=[], blk=[];
  S.biz.forEach(b=>{ if(b.status!=='active'||b.up||b.lvl>=MAXLVL) return; if(bizDef(b).startup&&b.out==='F') return;
    if(b.bld){ const bd=bldById(b.bld); if(bd&&b.lvl+1>bldMaxLvl(bd,b.def)){ blk.push(b); return; } }
    L.push({b, c:upgradeCost(b)}); });
  L.sort((x,y)=>x.c-y.c); let cash=S.cash, n=0, tot=0; L.forEach(x=>{ if(x.c<=cash){ cash-=x.c; n++; tot+=x.c; } });
  return {L, blk, n, tot, all:L.reduce((a,x)=>a+x.c,0)}; }
function upgradeAll(){ const I=upAllInfo(); if(!I.L.length) return err(I.blk.length? 'Vos sociétés sont au maximum de leur bâtiment : déménagez-les pour continuer.' : 'Aucune société à agrandir.');
  let n=0, tot=0; I.L.forEach(x=>{ if(x.c>S.cash) return; const r=upgradeBiz(x.b); if(r&&r.ok){ n++; tot+=x.c; } });
  if(!n) return err('Trésorerie insuffisante : '+eur(I.L[0].c,0)+' pour la moins chère.');
  return ok(n+' agrandissement'+(n>1?'s':'')+' lancé'+(n>1?'s':'')+' pour '+eur(tot,0)+(n<I.L.length? ' ; '+(I.L.length-n)+' attendront faute de trésorerie.' : '.')); }

