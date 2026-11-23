/* ============================================================
   V1.3.6 : vos sociétés sponsorisent le club
   O.sp = {kit, std, part:[]} : identifiants de vos sociétés (défaut : rien, ou le smartphone de O.phSp).
   - Maillot : la société gagne en visibilité (+12 % de ventes selon la notoriété du club), le club perd 25 % de ses sponsors.
   - Nom du stade : +7 %, le club perd 10 %.
   - Partenaires officiels (3 au plus) : +3 % chacun, le club perd 4 % par partenaire.
   La notoriété dépend du niveau du club (coefficient de 0,25 à 1,3).
   ============================================================ */
const SP_SLOT={kit:{n:'Maillot', boost:.12, cost:.25}, std:{n:'Nom du stade', boost:.07, cost:.10}, part:{n:'Partenaire officiel', boost:.03, cost:.04}};
function spOf(O){ if(!O.sp){ O.sp={kit:null, std:null, part:[]}; if(O.phSp){ const e=lkPhone(); if(e) O.sp.kit=e.id; } } if(!Array.isArray(O.sp.part)) O.sp.part=[]; return O.sp; }
function spBiz(id){ return S.biz.find(x=>x.id===id&&x.status==='active')||null; }
function spFame(O){ return clamp((footR(O.id)-45)/35,.25,1.3); }
function spSlotsOf(O,bid){ const P=spOf(O), out=[]; if(P.kit===bid) out.push('kit'); if(P.std===bid) out.push('std'); P.part.forEach(x=>{ if(x===bid) out.push('part'); }); return out; }
function spBoost(b){ const O=S.foot&&S.foot.own; if(!O||!O.sp) return 0; return spSlotsOf(O,b.id).reduce((a,k)=>a+SP_SLOT[k].boost,0)*spFame(O); }
function spCandidates(){ return S.biz.filter(x=>x.status==='active'); }
function spSet(slot,bid){ const O=fcOwn(); if(!O) return err('Vous n’avez pas de club.'); const P=spOf(O); bid= bid===''||bid===null||bid===undefined||bid==='0'? null : +bid;
  if(bid!==null&&!spBiz(bid)) return err('Société introuvable ou fermée.');
  if(slot==='kit'||slot==='std'){ P[slot]=bid; if(slot==='kit') O.phSp= bid&&lkPhone()&&lkPhone().id===bid? 1 : 0;
    return ok(bid? spBiz(bid).name+' : '+SP_SLOT[slot].n.toLowerCase()+' du club.' : SP_SLOT[slot].n+' : sponsor habituel.'); }
  if(slot==='addp'){ if(bid===null) return err('Choisissez une société.'); if(P.part.length>=3) return err('Trois partenaires officiels au maximum.'); if(P.part.includes(bid)) return err('Déjà partenaire.'); P.part.push(bid); return ok(spBiz(bid).name+' devient partenaire officiel du club.'); }
  if(slot==='rmp'){ P.part=P.part.filter(x=>x!==bid); return ok('Partenariat arrêté.'); }
  return err('Emplacement inconnu.'); }
/* visibilité : plus de ventes pour la société sponsor */
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); try{ const k=spBoost(b); if(k>0){ if(z.vol>0) z.vol*=1+k; else z.rev=(z.rev||0)*(1+k); } }catch(e){} return z; }; }
/* chaque mois : sponsors du club en moins, sociétés fermées retirées */
{ const _fd2=fcDaily; fcDaily=function(day){ _fd2(day); const O=fcOwn(); if(!O||footDate(day).d!==1) return; const P=spOf(O), base=fcClubValue(O.id)*.06/12;
  ['kit','std'].forEach(k=>{ if(P[k]!==null&&!spBiz(P[k])){ P[k]=null; fcNews(SP_SLOT[k].n+' : la société sponsor a fermé, retour au sponsor habituel.',''); } });
  P.part=P.part.filter(x=>spBiz(x));
  /* le smartphone garde son propre calcul (plus haut) quand il est sur le maillot */
  const kitPhone=O.phSp&&lkPhone()&&P.kit===lkPhone().id, lost=(P.kit!==null&&!kitPhone? SP_SLOT.kit.cost : 0)+(P.std!==null? SP_SLOT.std.cost : 0)+P.part.length*SP_SLOT.part.cost;
  if(lost>0) fcPay('spons','Club : sponsors remplacés par vos sociétés',-base*lost); }; }

