/* ============================================================
   V2.3.6 : APPROVISIONNEMENT PAR PRODUIT (étape 2)
   Chaque société cliente consomme des produits précis, en part de ses recettes (SUP_NEED). Sa source (b.src) :
   'mkt' marché (aucune économie, qualité standard), 'mix' (défaut) vos usines d'abord puis le marché,
   'own' vos usines seulement : économie plus forte (25 %), mais ce qui manque fait perdre des ventes.
   Vos usines livrent d'abord leur meilleure qualité ; la qualité reçue (0 à 2, le marché compte 0) améliore le
   client (SUP_QB : bonus de ventes à pleine qualité premium). Le client paie le prix de gros de la qualité livrée.
   Les anciens liens « Produits de votre ferme » (marchandises −15 %) et « Vos filatures » sans livraison disparaissent.
   État client : b.src ; hier : b.supIn (valeur reçue), b.supSave, b.supQ (qualité moyenne 0-2 sur le besoin),
   b.supMiss (part du besoin non couverte en mode 'own'), b.supP {produit:[besoin, reçu, qualité]}, b.supDay.
   ============================================================ */
const SUP_NEED = {
  resto:{cer:.03, leg:.08, lai:.05, oeu:.03, vin:.06}, hotel:{leg:.03, lai:.02, oeu:.02, vin:.02}, park:{cer:.02, leg:.02, lai:.01, oeu:.01},
  couture:{soi:.06, lan:.04, cot:.02}, ecom:{pap:.15},
  repair:{ecr:.10, bat:.07, puc:.03}, dc:{puc:.05, bat:.01}, dealer:{pau:.04}
};
const SUP_QB = {resto:.10, hotel:.06, park:.05, couture:.10, ecom:.06, repair:.08, dc:.04, dealer:.05};
const SUP_OWN = .30;
const supSrc = b => b.src||'mix';
supGood=function(b){ const N=SUP_NEED[b.def]; if(!N) return null; return D.PRODS[Object.keys(N)[0]].g; };
supNeedV=function(b){ const N=SUP_NEED[b.def]; if(!N||b.status!=='active'||!b.last||!b.last.open) return 0; const r=Math.max(0,b.last.rev||0); return Object.values(N).reduce((a,x)=>a+x,0)*r; };
const supNeedP = (b,p) => { const N=SUP_NEED[b.def]; if(!N||!N[p]||b.status!=='active'||!b.last||!b.last.open) return 0; return Math.max(0,b.last.rev||0)*N[p]; };
supClients=function(g){ return S.biz.filter(x=>SUP_NEED[x.def]&&x.status==='active'&&(!g||Object.keys(SUP_NEED[x.def]).some(p=>D.PRODS[p].g===g))); };
const supClientsP = p => S.biz.filter(x=>SUP_NEED[x.def]&&SUP_NEED[x.def][p]&&x.status==='active'&&supSrc(x)!=='mkt');
const supFactsP = p => S.biz.filter(x=>isFact(x)&&x.status==='active'&&supOn(x)&&fpInit(x)&&x.st[p]&&x.mix[p]>0);
/* réserve par produit en vente au gros : un jour et demi des besoins de vos sociétés, partagé entre les usines */
fpKeep=(function(_k){ return function(b){ const K=_k(b), I=S.ind;
  prodsOf(b).forEach(p=>{ for(let q=0;q<3;q++) K[p][q]=0; });
  if(I) I.active.forEach(c=>{ if(c.st!=='open'||!K[c.p]) return; let need=c.qty; for(let q=c.qm||0;q<3&&need>0;q++){ const t=Math.min(need,b.st[c.p][q]-K[c.p][q]); K[c.p][q]+=t; need-=t; } });
  if(supOn(b)) prodsOf(b).forEach(p=>{ const F=supFactsP(p); if(!F.includes(b)) return; let needV=supClientsP(p).reduce((a,c)=>a+supNeedP(c,p),0)*1.5*(typeof achQ==='function'&&mgrOn('ach')? (1+achQ()*.9) : 1)/F.length;
    for(let q=2;q>=0&&needV>0;q--){ const free=b.st[p][q]-K[p][q], pr=pPrice(p,q), t=Math.min(free,needV/pr); if(t>0){ K[p][q]+=t; needV-=t*pr; } } });
  return K; }; })(fpKeep);
supStep=function(){
  S.biz.forEach(b=>{ if(isFact(b)) b.supOut=0; if(SUP_NEED[b.def]){ b.supSave=0; b.supIn=0; b.supQ=0; b.supMiss=0; b.supP={}; } });
  const tot={};   /* besoin total par client, pour la qualité et la rupture */
  Object.keys(D.PRODS).forEach(p=>{ const C=supClientsP(p); if(!C.length) return; const F=supFactsP(p);
    const need=C.map(c=>supNeedP(c,p)), totNeed=need.reduce((a,x)=>a+x,0); if(totNeed<=0) return;
    let avail=0; F.forEach(f=>{ for(let q=0;q<3;q++) avail+=f.st[p][q]*pPrice(p,q); });
    const ratio=Math.min(1,avail/totNeed);   /* pénurie : chaque client reçoit la même part de son besoin */
    /* V2.3.7 : avec le directeur des achats, en pénurie, d'abord « vos usines seulement », puis le plus gros bonus de qualité */
    const ach=typeof mgrOn==='function'&&mgrOn('ach')&&ratio<1; let left=avail; const ord=C.map((c,i)=>i);
    if(ach) ord.sort((a,b)=>((supSrc(C[b])==='own')-(supSrc(C[a])==='own'))||((SUP_QB[C[b].def]||0)-(SUP_QB[C[a].def]||0)));
    const share=new Array(C.length).fill(0); ord.forEach(i=>{ const w= ach? Math.min(need[i],left) : need[i]*ratio; share[i]=w; left-=w; });
    C.forEach((c,i)=>{ let want=share[i]; const own=supSrc(c)==='own', disc=own? SUP_OWN : SUP_DISC; let got=0, qs=0;
      F.slice().sort((a,b)=>route(a.city,c.city).rate-route(b.city,c.city).rate).forEach(f=>{ if(want<=1e-6) return; const R=route(f.city,c.city);
        for(let q=2;q>=0&&want>1e-6;q--){ const pr=pPrice(p,q), u=Math.min(f.st[p][q],want/pr); if(u<=0) continue; f.st[p][q]-=u; const v=u*pr; want-=v; got+=v; qs+=v*q;
          f.supRev=(f.supRev||0)+v; f.supOut=(f.supOut||0)+v/D.GOODS[D.PRODS[p].g].v; c.supSave+=v*Math.max(0,disc-R.rate); } });
      c.supIn+=got; c.supP[p]=[need[i],got,got? qs/got : 0]; if(got>0) c.supDay=S.day;
      const T=tot[c.id]||(tot[c.id]={need:0,got:0,qs:0,c}); T.need+=need[i]; T.got+=got; T.qs+=qs; }); });
  Object.values(tot).forEach(T=>{ const c=T.c; c.supQ= T.need>0? T.qs/T.need : 0; c.supMiss= supSrc(c)==='own'&&T.need>0? Math.max(0,1-T.got/T.need) : 0; });
};
/* effet sur le client le lendemain : qualité reçue (ventes), rupture en mode « vos usines seulement » */
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||!z||!SUP_NEED[b.def]||b.status!=='active') return z;
  const f=(1+(SUP_QB[b.def]||0)*clamp(b.supQ||0,0,2)/2)*(1-.8*clamp(b.supMiss||0,0,1)); if(f!==1){ z.vol*=f; z.rev*=f; } return z; }; }
function setSrc(b,v){ if(!SUP_NEED[b.def]) return err('Cette société n’achète pas de produits d’usine.'); b.src=['mkt','mix','own'].includes(v)?v:'mix';
  return ok({mkt:'Achats au marché.', mix:'Vos usines d’abord, le marché complète.', own:'Vos usines seulement : économie plus forte, mais ventes perdues si elles ne suivent pas.'}[b.src]); }

