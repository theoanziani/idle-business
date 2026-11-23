/* ============================================================
   V2.6.4 : subventions par pays, et vos lois façonnent le pays gouverné
   Chaque loi du pays agit sur sa croissance (points par an), la satisfaction visée des citoyens
   et, pour les subventions, sur le budget public (part du PIB par an).
   ============================================================ */
const CTY_XB=[
  {k:'C_MINWAGE_DOWN', t:'Retour du salaire minimum à son niveau de base', d:'Salaires −9 %.', set:{minWage:1.0}, cond:l=>l.minWage>1, pop:-4, ten:4},
  {k:'C_GREEN_OFF', t:'Fin des subventions aux renouvelables', d:'Producteurs d’énergie renouvelable : chiffre d’affaires −20 %.', set:{subRenew:0}, cond:l=>l.subRenew===1, pop:-1, ten:0},
  {k:'C_RD_OFF', t:'Fin du crédit d’impôt recherche', d:'Sociétés technologiques : chiffre d’affaires −9 %.', set:{subTech:0}, cond:l=>l.subTech===1, pop:0, ten:0},
  {k:'C_CONSUMER_OFF', t:'Allègement de la protection des consommateurs', d:'Marges du commerce +3 %.', set:{consLaw:0}, cond:l=>l.consLaw===1, pop:-2, ten:1}];
const ctyBillDef = k => billDef(k)||CTY_XB.find(x=>x.k===k);
const ctyBillList = () => D.BILLS.concat(CTY_XB).filter(ctyBill);
/* effets de chaque loi : g = croissance (point par an), s = satisfaction, c = coût public (% du PIB par an) */
function ctyLawFx(L){ const f={g:0,s:0,c:0};
  f.g+=.2*(.25-L.corpTax)/.05; f.s-=(.25-L.corpTax)/.05;
  if(L.labor){ f.g-=.3; f.s+=4; } if(L.minWage>1){ f.g-=.2; f.s+=3; } if(L.rentCap){ f.g-=.1; f.s+=3; }
  if(L.subRenew){ f.g+=.2; f.s+=1; f.c+=.3; } if(L.subTech){ f.g+=.3; f.c+=.4; } if(L.consLaw){ f.g-=.05; f.s+=2; }
  return f; }
{ const _cs=countryStep; countryStep=function(){ _cs(); const c=S.country; if(!c) return; const f=ctyLawFx(ctyLaws());
  const k=1+f.g/100/360; c.gdp*=k; c.price*=k; c.sat=clamp(c.sat+.05*f.s,0,100);
  if(f.c>0){ const cost=c.gdp*f.c/100/360; pay('country','Subventions publiques de '+c.name,-cost); c.revenue-=cost; } }; }
const fxSig=(v,d,u)=>(v>0?'+':v<0?'−':'')+fmtN(Math.abs(v),d)+u;
function ctyLawFxHtml(){ const c=S.country, f=ctyLawFx(ctyLaws());
  return '<div class="cg" style="margin-top:12px"><div class="cg-h">Effet de vos lois sur le pays</div>'+
    gRow('Croissance du PIB',fxSig(f.g,2,' pt / an'),'baisse d’impôt et subventions l’accélèrent, protections la freinent')+
    gRow('Satisfaction des citoyens',fxSig(f.s,1,' à terme'),'protections sociales appréciées, cadeaux fiscaux mal vus')+
    gRow('Coût des subventions',f.c? '−'+eur(c.gdp*f.c/100/360,0)+' / j' : '—','payé par le budget du pays')+'</div>'; }
