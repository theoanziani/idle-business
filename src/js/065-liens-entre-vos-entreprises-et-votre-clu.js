/* ============================================================
   LIENS ENTRE VOS ENTREPRISES ET VOTRE CLUB
   - Ferme → buvettes du stade : à chaque match à domicile, les buvettes vendent ; avec votre
     ferme, ce sont vos produits (recette ×1,5).
   - Énergies renouvelables → stade : l'énergie du stade coûte 40 % de moins.
   - Haute couture → tenues officielles : sponsors du club +10 %, et la maison gagne en prestige.
   - Électronique → sponsor du maillot : votre smartphone remplace le sponsor principal (le club
     perd 25 % de ses sponsors) mais se vend 15 % mieux ; s'il est meilleur que les rivaux, les
     maillots floqués rapportent en plus au club.
   État : O.phSp (sponsor smartphone sur le maillot, 0/1) dans le club du joueur.
   ============================================================ */
function lkHas(def){ return S.biz.find(x=>x.def===def&&x.status==='active'&&x.m)||null; }
const lkAgro = () => !!fabInit().sites.some(s=>s.t==='agro');
function lkPhone(){ const e=S.biz.find(x=>x.def==='electronics'&&x.status==='active'&&x.m&&x.m.ph&&x.m.mod); return e||null; }
function lkPhoneHit(e){ return !!(e&&e.m.mod&&elScore(e,e.m.mod)>=elRival()); }
{ const _hg=fcHomeGate; fcHomeGate=function(h,a){ _hg(h,a); const O=fcOwn(); if(!O||O.id!==h||!O.lastGate) return;
    const n=O.lastGate.n, agro=lkAgro(), cap=fcCap(O);
    fcPay('food','Club : buvettes'+(agro?' (produits de votre usine agroalimentaire)':''),n*3.5*(agro?1.5:1));
    fcPay('energy','Club : énergie du stade'+(lkHas('renew')?' (vos centrales)':''),-cap*.35*(lkHas('renew')?.6:1)); }; }
{ const _fd=fcDaily; fcDaily=function(day){ _fd(day); const O=fcOwn(); if(!O||footDate(day).d!==1) return;
    const base=fcClubValue(O.id)*.06/12, hc=lkHas('couture'), e=lkPhone();
    if(hc){ fcPay('spons','Club : tenues officielles de votre maison de couture',base*.10); hc.m.pres=clamp(hc.m.pres+.6,0,100); }
    if(O.phSp){ if(!e){ O.phSp=0; fcNews('Plus de smartphone à afficher : le maillot retrouve son sponsor habituel.',''); }
      else { fcPay('spons','Club : sponsor principal remplacé par votre smartphone',-base*.25); if(lkPhoneHit(e)) fcPay('spons','Club : maillots floqués de votre smartphone',base*.2); } }
  }; }
{ const _pd=elPhoneDemand; elPhoneDemand=function(b,M,day){ const u=_pd(b,M,day); try{ const O=fcOwn(); if(O&&O.phSp&&lkPhone()===b) return u*1.15; }catch(e){} return u; }; }
function lkSetPhSp(v){ const O=fcOwn(); if(!O) return err('Vous n’avez pas de club.'); if(v&&!lkPhone()) return err('Il vous faut une usine d’électronique avec un smartphone en vente.'); O.phSp=v?1:0; return ok(v?'Votre smartphone s’affiche sur le maillot.':'Le maillot retrouve son sponsor habituel.'); }

