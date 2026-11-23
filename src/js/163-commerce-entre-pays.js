
/* ============================================================
   V2.6.8 : COMMERCE ENTRE PAYS
   Droits de douane (loi « tariff » de chaque pays : 0, 10 % ou 25 %) et accords de libre-échange.
   - Lignes maritimes entre deux pays : demande × (1 − 1,5 × somme des droits) ; lignes aériennes × (1 − 0,5 × ...).
   - Dans un pays qui taxe les importations : industrie +60 % du taux en ventes (protégée),
     commerce −40 % du taux (produits importés plus chers).
   - Pays gouverné : croissance −4 pt par 100 % de droits, satisfaction +10 (le protectionnisme plaît).
   - Accord de libre-échange (décret, S.country.fta = [ids]) : plus aucun droit entre les deux pays,
     et +5 % d'échanges. Signer coûte 150 d'influence.
   ============================================================ */
D.LAW0.tariff=0;
LAWTXT.tariff=['Droits de douane',v=>v?pct(v,0)+' sur les importations':'Aucun'];
D.BILLS.push(
  {k:'TARIFF_ON', t:'Droits de douane de 10 % sur les importations', d:'Protège l’industrie locale, renchérit les produits importés et freine le commerce maritime.', lean:-.3, set:{tariff:.10}, cond:l=>!(l.tariff>0), pop:2, ten:-1},
  {k:'TARIFF_HIGH', t:'Droits de douane relevés à 25 %', d:'Forte protection de l’industrie ; échanges internationaux nettement réduits.', lean:-.6, set:{tariff:.25}, cond:l=>l.tariff>0&&l.tariff<.25, pop:1, ten:1},
  {k:'TARIFF_OFF', t:'Suppression des droits de douane', d:'Commerce plus fluide, industrie locale moins protégée.', lean:.6, set:{tariff:0}, cond:l=>l.tariff>0, pop:-1, ten:1});
const PORT_CTY={LEH:'france',FOS:'france',BCN:'espagne',VLC:'espagne',RJK:'croatie',NYC:'usa',SAV:'usa',MIA:'usa',HOU:'usa',LAX:'usa',SEA:'usa',SSZ:'bresil',RIO:'bresil',SHA:'chine',SZX:'chine',HKG:'chine'};
const AP_CTY={fr:'france',es:'espagne',us:'usa',br:'bresil',cn:'chine'};
const tariffOf = cid => cid? (pLaw(cid).tariff||0) : 0;
const ftaOn = (x,y) => { const c=S.country, f=c&&c.fta||[]; return !!c&&((c.id===x&&f.includes(y))||(c.id===y&&f.includes(x))); };
function tradeF(x,y,k){ if(!x&&!y||x===y) return 1; if(ftaOn(x,y)) return 1.05; return Math.max(.4,1-k*(tariffOf(x)+tariffOf(y))); }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); try{ const t=b&&lawsAt(b.city).tariff||0, sec=b&&D.BIZSEC[b.def];
  const k= !t? 1 : sec==='industrie'? 1+.6*t : sec==='commerce'? 1-.4*t : 1;
  if(z&&k!==1){ if(z.vol>0) z.vol*=k; else z.rev=(z.rev||0)*k; } }catch(e){} return z; }; }
/* accords de libre-échange : décret du pays gouverné */
const FTA_INF=150;
function ftaToggle(id){ const c=S.country; if(!c) return err('Vous ne gouvernez aucun pays.'); c.fta=c.fta||[];
  if(S.day-S.decreeDay<10) return err('Un décret tous les 10 jours.');
  const on=c.fta.includes(id);
  if(!on&&S.infl<FTA_INF) return err('Influence insuffisante : '+FTA_INF+' requis.');
  if(on) c.fta=c.fta.filter(x=>x!==id); else { c.fta.push(id); S.infl-=FTA_INF; }
  S.decreeDay=S.day; log('warn',(on?'Fin de l’accord de libre-échange entre ':'Accord de libre-échange signé entre ')+c.name+' et '+ctyName(id)+'.','news');
  return ok(on?'Accord rompu.':'Accord signé.'); }
ACT.fta=el=>after(ftaToggle(el.dataset.v));
function ftaCard(){ const c=S.country, f=c.fta||[], w=S.day-S.decreeDay<10;
  return card('Accords de libre-échange','<div class="sub" style="margin-bottom:8px">Un accord supprime les droits de douane entre '+esc(c.name)+' et l’autre pays, dans les deux sens : vos lignes maritimes et aériennes entre eux gagnent 5 % d’échanges. Signer coûte '+FTA_INF+' d’influence et compte comme un décret.</div><div class="stack">'+
    D.COUNTRIES.filter(x=>x.id!==c.id).map(x=>{ const on=f.includes(x.id), t=tariffOf(x.id);
      return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div class="row" style="gap:10px;flex:1">'+ctyFlag(x.id)+'<div><b>'+esc(x.n)+'</b><div class="sub">'+(on?'Accord en vigueur':'Ses droits de douane : '+(t?pct(t,0):'aucun'))+'</div></div></div>'+
        btn(on?'Rompre':'Signer','fta',{c:'sm'+(on?'':' pri'),v:x.id,dis:w||(!on&&S.infl<FTA_INF),why:w?'Un décret tous les 10 jours.':'Influence insuffisante : '+FTA_INF+' requis.'})+'</div>'; }).join('')+'</div>'); }
{ const _vp=vPol; vPol=function(){ const h=_vp(), cid=ui.polC||polHome(); if(!(S.country&&S.country.id===cid)) return h; return h+ftaCard(); }; VIEWS.pol=vPol; }
