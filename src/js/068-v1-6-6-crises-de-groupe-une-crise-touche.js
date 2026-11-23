/* ============================================================
   V1.6.6 : crises de groupe. Une crise touche toutes vos sociétés d'un même type pendant quelques
   semaines. Une société liée (centrales, studio, cybersécurité, service de livraison) l'atténue ;
   sinon vous pouvez payer une parade. État : S.cri {k, since, until, mit, cost} ou null ; S.criN
   (premier jour possible de la prochaine crise, 200 par défaut).
   ============================================================ */
const CRI={
  nrj:{n:'Pénurie d’énergie', d:20, eff:'frais fixes +25 % et production +10 %', par:'Contrat d’énergie de secours', has:()=>lkAny('renew'), hasN:'vos centrales d’énergie',
    t:b=>isFact(b)||['dc','warehouse'].includes(b.def)},
  tou:{n:'Krach du tourisme', d:30, eff:'ventes −20 %', par:'Campagne de promotion', has:()=>lkAny('studio'), hasN:'votre studio vidéo',
    t:b=>['hotel','park','resto','fastfood','airline'].includes(b.def)},
  grv:{n:'Grève des transports', d:15, eff:'ventes −15 %', par:'Prime aux transporteurs', has:()=>mgrOn('del'), hasN:'votre service de livraison',
    t:b=>['super','ecom','warehouse','shipping','repair'].includes(b.def)},
  cyb:{n:'Cyberattaque en série', d:10, eff:'ventes −25 %', par:'Cellule de crise informatique', has:()=>lkAny('cyber'), hasN:'votre société de cybersécurité',
    t:b=>['saas','dc','ecom','ai','agency'].includes(b.def)}
};
const criOn = () => !!(S.cri&&S.day<=S.cri.until);
const criHit = b => criOn()&&b.status==='active'&&CRI[S.cri.k].t(b);
function criCost(k){ return Math.round(S.biz.filter(b=>b.status==='active'&&CRI[k].t(b)).reduce((a,b)=>a+Math.max(0,b.last?b.last.rev:0),0)*CRI[k].d*.12); }
function criStep(){
  if(S.cri&&S.day>S.cri.until){ log('info','Fin de la crise : '+CRI[S.cri.k].n.toLowerCase()+'.'); S.cri=null; S.criN=S.day+150; return; }
  if(S.cri||S.day<(S.criN||200)||rnd()>=1/120) return;
  const ks=Object.keys(CRI).filter(k=>S.biz.filter(b=>b.status==='active'&&CRI[k].t(b)).length>=2); if(!ks.length) return;
  const k=ks[Math.floor(rnd()*ks.length)], C=CRI[k], mit=C.has()?1:0;
  S.cri={k, since:S.day, until:S.day+C.d, mit, cost:criCost(k)};
  if(mit) log('warn',C.n+' : '+C.hasN+' limite les dégâts pour vos sociétés touchées pendant '+C.d+' jours.');
  else { log('crit',C.n+' : '+C.eff+' pour vos sociétés touchées pendant '+C.d+' jours.'); S.flashCri=true; }
}
function criMit(){ if(!criOn()) return err('Aucune crise en cours.'); if(S.cri.mit) return err('Déjà atténuée.'); const c=S.cri.cost;
  if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); payCap('gen',CRI[S.cri.k].par,-c); S.cri.mit=1; return ok(CRI[S.cri.k].par+' : les effets de la crise sont réduits.'); }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||!criHit(b)) return z; const f=S.cri.mit? .4 : 1;
  if(S.cri.k==='nrj'){ z.fixed*=1+.25*f; z.cogs*=1+.1*f; }
  else { const dr={tou:.2,grv:.15,cyb:.25}[S.cri.k]*f; z.vol*=1-dr; z.rev*=1-dr; }
  return z; }; }
{ const _ll=lkList; lkList=function(b){ const L=_ll(b); if(criHit(b)) L.unshift(['cri',CRI[S.cri.k].n+' jusqu’au '+dateL(S.cri.until),(S.cri.mit?'atténuée : ':'')+CRI[S.cri.k].eff+(S.cri.mit?' (effets réduits de 60 %)':''),1]); return L; }; }

