/* ============================================================
   V2.2.6 : APPROVISIONNEMENT DE VOS SOCIÉTÉS
   Une usine fournit d'abord vos propres sociétés clientes de son produit : la ferme vos restaurants,
   hôtels et parcs ; l'usine textile vos maisons de couture et boutiques en ligne ; l'usine de composants
   vos ateliers de réparation, data centers et concessions. Le client paie le prix de gros du jour
   (recette de l'usine le lendemain) et économise 20 % de ses achats de ce produit, moins le transport.
   Ordre de priorité de la production : contrats signés, vos sociétés, puis grossiste ou stock.
   État : b.fsup (usine : 0 = n'approvisionne pas vos sociétés ; défaut : oui), b.supRev (recette à
   encaisser), b.supOut (unités livrées hier) ; client : b.supSave (économie à compter), b.supIn (valeur reçue hier).
   ============================================================ */
const SUP_USE = {alim:{resto:.25, hotel:.08, park:.06}, vet:{couture:.12, ecom:.15}, comp:{repair:.20, dc:.06, dealer:.04}};
const SUP_DISC = .25;   /* V2.3.6 : 25 % (mixte), 30 % en « vos usines seulement » */
/* produit acheté par une société cliente (ou null) */
function supGood(b){ for(const g in SUP_USE) if(SUP_USE[g][b.def]) return g; return null; }
/* besoin du jour en euros : part de ses recettes consacrée à ce produit */
function supNeedV(b){ const g=supGood(b); if(!g||b.status!=='active'||!b.last||!b.last.open) return 0; return Math.max(0,b.last.rev||0)*SUP_USE[g][b.def]; }
const supOn = f => f.fsup!==0;
function supClients(g){ return S.biz.filter(x=>supGood(x)===g&&x.status==='active'); }
function supFacts(g){ return S.biz.filter(x=>isFact(x)&&goodOf(x)===g&&x.status==='active'&&supOn(x)); }
/* unités à garder en sell mode pour vos sociétés (un jour et demi de besoin, partagé entre les usines) */
function supReserve(g,b){ if(!supOn(b)) return 0; const F=supFacts(g); if(!F.length) return 0; const need=supClients(g).reduce((a,x)=>a+supNeedV(x),0)*1.5/gPrice(g); return need/F.length; }
{ const _rf=reserveFor; reserveFor=function(g,b){ return _rf(g,b)+supReserve(g,b); }; }
/* recette des livraisons d'hier encaissée par l'usine */
{ const _fd=factoryDay; factoryDay=function(b,revEq){ const r=_fd(b,revEq), s=b.supRev||0; b.supRev=0; return r+s; }; }
/* économie d'hier comptée en moins des charges du client */
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(b&&b.supSave>0&&z) z.fixed=(z.fixed||0)-b.supSave; return z; }; }
function supStep(){
  S.biz.forEach(b=>{ if(isFact(b)) b.supOut=0; if(supGood(b)){ b.supSave=0; b.supIn=0; } });
  Object.keys(SUP_USE).forEach(g=>{ const F=supFacts(g); if(!F.length) return; const P=gPrice(g);
    supClients(g).forEach(c=>{ let need=supNeedV(c)/P; if(need<=0) return;
      F.slice().sort((a,b)=>route(a.city,c.city).rate-route(b.city,c.city).rate).forEach(f=>{ if(need<=0) return; const u=Math.min(need,f.goods||0); if(u<=0) return;
        const v=u*P, R=route(f.city,c.city); f.goods-=u; f.supRev=(f.supRev||0)+v; f.supOut=(f.supOut||0)+u; need-=u;
        c.supIn=(c.supIn||0)+v; c.supSave=(c.supSave||0)+v*Math.max(0,SUP_DISC-R.rate); }); }); });
}
{ const _is=indStep; indStep=function(){ _is(); try{ supStep(); }catch(e){ console.error(e); } }; }
function setFsup(b,v){ if(!isFact(b)) return err('Ce n’est pas une usine.'); b.fsup=v?1:0; return ok(v?'L’usine approvisionne vos sociétés.':'L’usine n’approvisionne plus vos sociétés.'); }

