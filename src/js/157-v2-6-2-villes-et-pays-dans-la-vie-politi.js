/* ============================================================
   V2.6.2 : villes et pays dans la vie politique
   - les recettes de votre pays ne sont plus soumises à l'impôt sur les sociétés ;
   - l'exonération de vos sociétés est un choix (S.country.ex, oui par défaut) : elle baisse la
     satisfaction des citoyens et attire l'attention de la presse, en proportion de l'impôt évité ;
   - chaque ville possédée apporte de l'influence politique (environ +100 à terme), le pays +300.
   ============================================================ */
const CITY_INF=.2, CTY_INF=.6;
/* poids de l'exonération : impôt évité par jour rapporté aux recettes fiscales du pays */
function ctyExRatio(){ const c=S.country; if(!c||c.ex===false) return 0; const rec=c.gdp/360*c.rate*S.macro.econ; return rec>0? ctyExempt()/30*ctyLaws().corpTax/rec : 0; }
const ctyExPen = () => Math.min(10, 100*ctyExRatio());
const ctyExSusp = () => Math.min(.25, 3*ctyExRatio());
{ const _cs=countryStep; countryStep=function(){ _cs(); const c=S.country;
  if(c){ c.sat=clamp(c.sat-.05*ctyExPen(),0,100); S.susp=clamp(S.susp+ctyExSusp(),0,100); }
  S.infl+=CITY_INF*Object.keys(S.cities||{}).filter(cityOwned).length+(c?CTY_INF:0); }; }
function ctyExHtml(){ const on=S.country.ex!==false, pen=ctyExPen(), su=ctyExSusp()/.01;
  return '<div class="cg-x"><div class="row sp"><div><b>Exonérer vos sociétés</b><small>'+(on? (pen>=.5? 'Satisfaction −'+fmtN(pen,1)+' à terme, suspicion de la presse +'+Math.round(su)+' à terme' : 'Peu visible tant que vos sociétés pèsent peu dans le pays') : 'Vos sociétés paient l’impôt comme les autres')+'</small></div>'+
    btn(on?'Renoncer':'Rétablir','ctyex',{c:'sm'})+'</div></div>'; }
ACT.ctyex=()=>{ const c=S.country; if(!c) return; c.ex= c.ex===false; log('info', c.ex? 'Vous exonérez de nouveau vos sociétés de l’impôt sur les sociétés à '+c.name+'.' : 'Vous renoncez à l’exonération de vos sociétés à '+c.name+'.'); render(); };
/* rappel dans la fiche ville */
{ const _cg=cityGainHtml; cityGainHtml=function(id){ return _cg(id).replace(/<\/div>$/, gRow('Influence politique','+100 à terme','')+'</div>'); }; }
(function(){ const st=document.createElement('style'); st.textContent='.cg-x{margin-top:8px;padding:10px;border-radius:12px;background:var(--paper-2)}.cg-x b{display:block;font-size:13.5px}.cg-x small{display:block;font-size:11.5px;color:var(--ink-3);margin-top:2px}.cg-x .btn{min-height:44px}'; document.head.appendChild(st); })();

