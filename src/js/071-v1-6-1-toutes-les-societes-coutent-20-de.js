/* ============================================================
   V1.6.1 : toutes les sociétés coûtent 20 % de plus (création, agrandissements, options), sans
   changer leurs recettes : chacune met 20 % de temps en plus à se rembourser. D.biz[k].cost0 garde
   le prix de référence qui sert au calcul des recettes. (Le doublement de la V1.5.9 est abandonné : pf = 1.)
   ============================================================ */
(function(){ Object.keys(D.biz).forEach(k=>{ const d=D.biz[k]; if(d.cost0===undefined) d.cost0=d.cost; d.cost=Math.round(d.cost0*1.2); d.pf=1; });
  if(typeof baseCache!=='undefined') Object.keys(baseCache).forEach(k=>delete baseCache[k]); })();
/* V1.6.6 : le mécanisme de prix multipliés (mfac) est retiré ; ces aides restent pour les métiers
   qui paient en vrais prix (aérien, maritime, bureaux). */
const bizCost0 = b => bizDef(b).cost;
function mPayCap(b,label,amt){ return payCap('b:'+b.id,label,amt); }
const mAvail = b => availFor(cityOf(b).ccy);
const mDlp = b => dlBudget(b);

