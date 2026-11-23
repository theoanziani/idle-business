/* ============================================================
   Football : potentiel et centre de formation (V1.1.9)
   p.pot : note maximale que le joueur peut atteindre (générée à la demande, stable).
   O.acad : jeunes du centre de formation (15 à 18 ans), hors effectif. Valeur par défaut :
   absent → 3 à 6 jeunes générés à la première ouverture.
   ============================================================ */
function fpPot(p){
  if(p.pot===undefined){ const R=footSeedRng(footHash('pot|'+p.n+'|'+p.p)), a=p.a||25;
    const r2=R()*R(), gap= a<=17? 8+r2*34 : a<=19? 5+r2*26 : a<=22? 2+r2*16 : a<=25? R()*8 : a<=28? R()*3 : 0;
    p.pot=Math.round(clamp(p.o+gap,p.o,99)); }
  return Math.max(p.pot,Math.round(p.o));
}
const FP_LBL=[[58,'Potentiel pour jouer en troisième division'],[66,'Potentiel pour jouer en deuxième division'],[74,'Potentiel pour jouer en première division'],[80,'Potentiel de titulaire en première division'],[86,'Potentiel de joueur international'],[999,'Peut devenir spécial']];
function fpLabel(pot){ return FP_LBL.find(x=>pot<x[0])[1]; }
/* fourchette affichée : étroite pour vos joueurs, plus large selon le recruteur pour les autres */
function fpRange(p,mine){
  const O=fcOwn(), pot=fpPot(p), w= mine? 4 : p.rw || Math.max(4,16-2*((O&&O.staff.scout)||1)), R=footSeedRng(footHash('rg|'+p.n));
  let lo=Math.round(pot-R()*w); lo=Math.max(Math.round(p.o),lo); const hi=Math.min(99,lo+w); return [lo,Math.max(hi,pot)];
}
/* progression mensuelle bornée par le potentiel */
function fpGrow(p,O){
  const pot=fpPot(p), room=pot-p.o, yb=1+.15*((O.staff.youth||1)-1);
  let g= p.a<=21? .15+.025*room : p.a<=24? .1+.02*room : p.a<=28? .05 : p.a<=31? -.1 : -.35;
  if(g>0){ g=Math.min(g,.9)*yb; if(room<=0) g=0; }
  let dl=g+(frnd()-.5)*.6; if(p.a<=28) dl=Math.max(0,dl);   /* avant 29 ans : jamais de baisse */
  p.o=clamp(Math.round((p.o+dl)*10)/10,30,Math.max(pot,p.o));
}
/* ---------- Centre de formation ---------- */
function fcAcadGen(O,n,lo,hi){
  const nat=footClub(O.id).nat, home=FOOT_NATPOOL[nat]||'fr', P=footNamePool(home), R=frnd, used=new Set(O.sq.map(p=>p.n));
  for(let i=0;i<n;i++){ const pos=FOOT_SQUAD_SHAPE[Math.floor(R()*FOOT_SQUAD_SHAPE.length)];
    let nm; for(let k=0;k<8;k++){ nm=P.f[Math.floor(R()*P.f.length)]+' '+P.l[Math.floor(R()*P.l.length)]; if(!used.has(nm)) break; } used.add(nm);
    const o=Math.round(lo+R()*(hi-lo)), a=15+Math.floor(R()*3), pl={id:'a'+S.day+'_'+i+'_'+Math.floor(R()*1e6), n:nm, p:pos, a, o, nat:home, inj:0, acad:1};
    fpPot(pl); O.acad.push(pl); }
}
function fcAcad(O){ if(!O) return []; if(!O.acad){ O.acad=[]; fcAcadGen(O,3+Math.floor(frnd()*4),40,70); } return O.acad; }
function fcSignYouth(id){
  const O=fcOwn(); if(!O) return err('Aucun club.'); const A=fcAcad(O), p=A.find(x=>x.id===id); if(!p) return err('Jeune introuvable.');
  O.acad=A.filter(x=>x!==p); delete p.acad; p.w=Math.round(fcPlayerWage(p)*.5); O.sq.push(p);
  fcNews(p.n+' signe son premier contrat professionnel.','good'); return ok(p.n+' rejoint l’effectif professionnel.');
}
function fcFreeYouth(id){ const O=fcOwn(); if(!O) return err('Aucun club.'); const p=fcAcad(O).find(x=>x.id===id); if(!p) return err('Jeune introuvable.'); O.acad=O.acad.filter(x=>x!==p); return ok(p.n+' quitte le centre de formation.'); }

