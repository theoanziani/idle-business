/* ============================================================
   V2.6.3 : lois propres au pays gouverné (S.country.laws, copie des lois du Parlement à l'achat)
   ============================================================ */
const CTY_LAWK=['corpTax','labor','minWage','rentCap','subRenew','subTech','consLaw','tariff'];
function ctyBill(b){ return Object.keys(b.set).every(k=>CTY_LAWK.includes(k))&&b.cond(ctyLaws()); }
function ctyLaws(){ const c=S.country; return c? (c.laws||(c.laws=Object.assign({},S.laws))) : S.laws; }
function lawsAt(city){ const c=S.country; return c&&c.cities&&c.cities.includes(city)? ctyLaws() : S.laws; }
{ const _bc=buyCountry; buyCountry=function(id){ const r=_bc(id); if(r.ok) ctyLaws(); return r; }; }
