/* ============================================================
   V2.6.6 : choisir son pays de résidence fiscale (S.home)
   Déménager coûte une taxe de sortie (1 % de la valeur nette) et n'est possible qu'une fois par an.
   Les champs politiques d'origine (S.laws, S.gov...) suivent toujours le pays de résidence.
   ============================================================ */
const HOME_CD=360, HOME_TAX=.01;
const homeCost = () => Math.max(50000, Math.round((S.nw||0)*HOME_TAX/1000)*1000);
const homeOpen = cid => D.COUNTRIES.find(c=>c.id===cid).cities.some(cityUnlocked);
const homeWait = () => Math.max(0,(S.homeDay===undefined?-1e9:S.homeDay)+HOME_CD-S.day);
function moveHome(cid){ const old=polHome(); if(cid===old) return err('Vous résidez déjà dans ce pays.');
  if(!homeOpen(cid)) return err('Ouvrez d’abord une ville de ce pays.');
  if(homeWait()>0) return err('Un seul déménagement par an : encore '+plu(homeWait(),'jour')+'.');
  const c=homeCost(); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' de taxe de sortie.');
  const CL= S.country? Object.assign({},ctyLaws()) : null, P=polOf(cid), O={};
  POL_K.forEach(k=>{ O[k]=S[k]; S[k]=P[k]; }); S.pol[old]=O; delete S.pol[cid]; S.home=cid; S.homeDay=S.day;
  if(CL){ if(S.country.id===cid) S.laws=CL; else S.country.laws=CL; }
  pay('tax','Taxe de sortie : départ de '+ctyName(old),-c);
  log('warn','Vous transférez votre résidence fiscale de '+ctyName(old)+' vers '+ctyName(cid)+'. Taxe de sortie : '+eur(c,0)+'.');
  ui.polC=cid; return ok('Résidence fiscale transférée.'); }
const pLaw = cid => cid===polHome()? S.laws : S.country&&S.country.id===cid? ctyLaws() : polOf(cid).laws;
function homeCard(cid){ const H=pLaw(polHome()), L=pLaw(cid), nw=Math.max(0,S.nw-1.5e6);
  const wy=v=>v>0? eur(nw*v,0)+' / an' : 'aucun';
  const rows=[['Revenus du capital',pct(H.capTax,0),pct(L.capTax,0)],['Impôt sur la fortune',wy(H.wealthTax),wy(L.wealthTax)],['Taxe sur le luxe',H.luxTax?pct(H.luxTax,0):'aucune',L.luxTax?pct(L.luxTax,0):'aucune'],['Taxe sur les transactions',H.tobin?pct(H.tobin,1):'aucune',L.tobin?pct(L.tobin,1):'aucune']];
  const w=homeWait(), c=homeCost();
  return card('Résidence fiscale','<div class="sub" style="margin-bottom:8px">Vos impôts personnels suivent votre pays de résidence. S’installer ici coûte une taxe de sortie de 1 % de votre valeur nette ; un seul déménagement par an.</div>'+
    '<table class="tbl"><thead><tr><th></th><th class="r">'+esc(ctyName(polHome()))+'</th><th class="r">'+esc(ctyName(cid))+'</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td class="r num">'+r[1]+'</td><td class="r num"><b>'+r[2]+'</b></td></tr>').join('')+'</tbody></table>'+
    '<div class="row" style="margin-top:10px">'+btn('S’installer ici · '+eur(c,0),'homemove',{c:'sm pri',v:cid,dis:!homeOpen(cid)||w>0||S.cash<c,why:!homeOpen(cid)?'Ouvrez d’abord une ville de ce pays.':w>0?'Prochain déménagement possible dans '+plu(w,'jour')+'.':'Trésorerie insuffisante.'})+'</div>'); }
ACT.homemove=el=>after(moveHome(el.dataset.v));
{ const _vp=vPol; vPol=function(){ const h=_vp(), cid=ui.polC||polHome(); if(cid===polHome()) return h; const k=h.indexOf('<div class="grid">',h.indexOf('pol-tabs')); return k<0? h+homeCard(cid) : h.slice(0,k)+homeCard(cid)+h.slice(k); }; VIEWS.pol=vPol; }
