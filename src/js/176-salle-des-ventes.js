/* ============================================================
   V2.8.3 : SALLE DES VENTES (2/2) · VENTES À THÈME, ENCHÈRES EN DIRECT, COLLECTION, MUSÉES
   - Une vente à thème par semaine : catalogue publié 4 jours avant, vente le jour J.
     Ordres d'achat (plafond) possibles dès le catalogue ; le jour J, la salle s'ouvre en direct :
     commissaire-priseur, enchérisseurs (dont parfois un rival), compte à rebours de 6 secondes.
     Sans vous, la vente se règle avec vos ordres d'achat.
   - Vos objets : mis en vente à la prochaine vente avec un prix de réserve, ou prêtés à un musée (6 mois,
     1 % de la valeur par mois et un peu de réputation).
   - Séries : une catégorie complète (3 objets) donne +5 de prestige.
   - Lots mystères : révélation animée, puis garder ou mettre en vente.
   État : S.auc = {coll:[objet], sale:{id, th, day, lots:[lot], done}, sn, loans}
   ============================================================ */
D.COLL.push(['Montre de poche du XIXe siècle','montre',1],['Montre d’aviateur de 1940','montre',1],['Chronomètre de marine','montre',2],['Montre squelette en platine','montre',3],
  ['Champagne millésimé 1928','vin',2],['Cognac de 1890','vin',2],['Magnum de bourgogne 1961','vin',1],
  ['Bague à l’émeraude colombienne','bijou',2],['Tiare Belle Époque','bijou',3],['Broche aux saphirs','bijou',1],
  ['Tableau impressionniste','art',3],['Vase en cristal Art nouveau','art',1],['Tapisserie flamande','art',2],
  ['Première édition dédicacée','livre',1],['Atlas du XVIIe siècle','livre',2],['Partition annotée par un compositeur','livre',2],
  ['Casque d’un pilote de course','souvenir',1],['Raquette d’une finale mythique','souvenir',1],['Costume de scène d’une star','souvenir',2],
  ['Fossile de dinosaure','rareté',3],['Globe céleste ancien','rareté',2],['Billet de banque rarissime','rareté',1]);
const AUC_TH=[
  {k:'montre', n:'Horlogerie d’exception', cats:['montre']}, {k:'vin', n:'Grands vins et spiritueux', cats:['vin']},
  {k:'bijou', n:'Haute joaillerie', cats:['bijou']}, {k:'art', n:'Art et sculpture', cats:['art']},
  {k:'livre', n:'Livres et manuscrits', cats:['livre']}, {k:'souvenir', n:'Souvenirs légendaires', cats:['souvenir']},
  {k:'rarete', n:'Raretés et curiosités', cats:['rareté']}, {k:'mix', n:'Objets d’exception', cats:['montre','vin','bijou','art','livre','souvenir','rareté']}];
const AUC_PROV=['collection privée suisse','succession d’un industriel lyonnais','ancienne collection royale','famille bordelaise','vente judiciaire','fondation en restructuration','collection d’un acteur célèbre','grande maison parisienne'];
const AUC_ETAT=['excellent','très bon','restauré avec soin','état d’origine'];
const AUC_BID=['Collectionneur à Genève','Fondation de Hong Kong','Galerie new-yorkaise','Musée de Dubaï','Banquier de Monaco','Héritière milanaise','Investisseur de Singapour','Amateur londonien'];
const AUC_SERIE={montre:'Horlogerie d’exception', vin:'Grands crus', bijou:'Haute joaillerie', art:'Art et sculpture', livre:'Bibliothèque rare', souvenir:'Légendes', 'rareté':'Cabinet de curiosités'};
const aucSt = l => Math.max(100,Math.round(l.est*.05/100)*100);
function aucSale(){ const A=aucInit(); if(!A.sn) A.sn=1;
  if(!A.sale||(A.sale.done&&S.day>A.sale.day)){ const th=AUC_TH[(A.sn-1)%AUC_TH.length], day=S.day+5+(A.sale?2:0), id=A.sn++;
    const L=D.COLL.filter(c=>th.cats.includes(c[1])).sort(()=>rnd()-.5), n=Math.min(th.k==='mix'? 8 : 6, L.length), lots=[];
    for(let i=0;i<n;i++){ const c=L[i], r=rnd()<.08?2:rnd()<.3?1:0, est=Math.round(aucScale()*c[2]*RAR[r][1]*(.5+rnd())/100)*100;
      const nb=3+Math.floor(rnd()*2), ai=[...Array(nb)].map(()=>({n:pick(AUC_BID), m:est*(.7+.65*rnd())}));
      if(rnd()<.3&&typeof rivAlive==='function'){ const rv=rivAlive().filter(x=>!S.riv.rv[x.id].gone); if(rv.length) ai.push({n:pick(rv).n, m:est*(1.15+.35*rnd()), riv:1}); }
      lots.push({id:S.nid++, n:c[0], cat:c[1], rar:r, est, prov:pick(AUC_PROV), etat:pick(AUC_ETAT), ai}); }
    /* vos objets confiés à cette vente */
    (A.cons||[]).forEach(x=>{ const it=A.coll.find(o=>o.id===x.cid); if(!it) return; const v=collVal(it);
      lots.push({id:S.nid++, n:it.n, cat:it.cat, rar:it.rar, est:v, prov:'votre collection', etat:pick(AUC_ETAT), cid:it.id, res:x.res, ai:[...Array(3)].map(()=>({n:pick(AUC_BID), m:v*(.75+.6*rnd())}))}); });
    A.cons=[]; A.sale={id, th:th.k, n:th.n, day, lots, done:0}; }
  return A.sale; }
const aucDays = () => { const s=aucSale(); return s.day-S.day; };
const aucOpen = () => { const s=aucSale(); return !s.done&&S.day===s.day; };
/* règlement d'un lot : meilleur plafond (ordres et collectionneurs), prix = second plafond + un pas */
function aucSettle(l,live){ if(l.out) return l.out; const B=l.ai.map(b=>({n:b.n,m:b.m}));
  if(!l.cid&&l.ord) B.push({n:'me', m:Math.min(l.ord, S.cash/1.05)});
  B.sort((a,b)=>b.m-a.m); const start=Math.round(l.est*.5/100)*100;
  if(!B.length||B[0].m<Math.max(start,l.res||0)) return l.out={sold:0};
  const p=Math.max(start,l.res||0,Math.min(B[0].m,(B[1]?B[1].m:start)+aucSt(l)));
  return l.out={sold:1, w:B[0].n, p:Math.round(p/100)*100}; }
function aucApply(l){ const A=aucInit(), o=l.out; if(!o||l.paid) return; l.paid=1;
  if(l.cid){ const it=A.coll.find(x=>x.id===l.cid); if(o.sold){ const net=o.p*.9; payCap('lux','Vente aux enchères : '+l.n,net); if(it) S.tb.cap+=net-(it.paid||0); A.coll=A.coll.filter(x=>x.id!==l.cid); log('good','Adjugé : « '+l.n+' » vendu '+eur(o.p,0)+' (commission de 10 %).'); }
    else log('info','« '+l.n+' » n’a pas atteint votre prix de réserve : il revient dans votre collection.'); return; }
  if(o.sold&&o.w==='me'){ const c=o.p*1.05; if(S.cash<c){ S.rep=clamp(S.rep-2,0,100); log('bad','Enchère perdue faute de fonds : « '+l.n+' ».'); l.out={sold:1,w:'Collectionneur',p:o.p}; return; }
    payCap('lux','Enchère remportée : '+l.n,-c); A.coll.push({id:S.nid++, n:l.n, cat:l.cat, rar:l.rar, est:l.est, paid:c, day:S.day, ref:aucScale(), prov:l.prov, etat:l.etat}); log('good','Vous remportez « '+l.n+' » pour '+eur(o.p,0)+'.'); } }
/* une journée : la vente du jour se règle (si vous n'êtes pas venu), les musées paient, la cote bouge */
collStep=function(){ const A=aucInit(); if(A.lots&&A.lots.length) A.lots=[]; const s=aucSale();
  if(!s.done&&S.day>s.day){ s.lots.forEach(l=>{ aucSettle(l); aucApply(l); }); s.done=1; }
  A.coll.forEach(it=>{ it.k=(it.k||1)*Math.exp(0.0002+0.004*norm()); });
  let inc=0; (A.loans||[]).forEach(o=>{ const it=A.coll.find(x=>x.id===o.cid); if(it) inc+=collVal(it)*.01/30; });
  if(inc>0) pay('lux','Prêts aux musées',inc);
  const done=(A.loans||[]).filter(o=>S.day>=o.until); if(done.length){ A.loans=A.loans.filter(o=>S.day<o.until); done.forEach(o=>{ const it=A.coll.find(x=>x.id===o.cid); if(it) log('info','« '+it.n+' » revient du musée.'); }); }
};
const aucLoaned = cid => (aucInit().loans||[]).some(o=>o.cid===cid);
const aucConsigned = cid => (aucInit().cons||[]).some(o=>o.cid===cid)||aucSale().lots.some(l=>l.cid===cid&&!l.out);
function aucConsign(cid,f){ const A=aucInit(), it=A.coll.find(x=>x.id===cid); if(!it) return err('Objet introuvable.'); if(aucLoaned(cid)) return err('Cet objet est prêté à un musée.');
  if(aucConsigned(cid)) return err('Déjà confié à une vente.'); const s=aucSale(); const res=Math.round(collVal(it)*f/100)*100;
  if(!s.done&&S.day<s.day){ const v=collVal(it); s.lots.push({id:S.nid++, n:it.n, cat:it.cat, rar:it.rar, est:v, prov:'votre collection', etat:it.etat||pick(AUC_ETAT), cid, res, ai:[...Array(3)].map(()=>({n:pick(AUC_BID), m:v*(.75+.6*rnd())}))}); }
  else (A.cons=A.cons||[]).push({cid,res}); return ok(); }
function aucLoan(cid){ const A=aucInit(), it=A.coll.find(x=>x.id===cid); if(!it) return err('Objet introuvable.'); if(aucLoaned(cid)) return err('Déjà prêté.'); if(aucConsigned(cid)) return err('Cet objet est en vente.');
  (A.loans=A.loans||[]).push({cid, until:S.day+180}); S.rep=clamp(S.rep+.5,0,100); return ok(); }
function aucOrder(id,m){ const l=aucSale().lots.find(x=>x.id===+id); if(!l||l.out||l.cid) return err('Lot indisponible.'); l.ord= m>0? Math.round(m/100)*100 : 0; return ok(); }
/* séries : 3 objets d'une même catégorie = +5 de prestige */
const aucSeries = () => { const C={}; aucInit().coll.forEach(it=>C[it.cat]=(C[it.cat]||0)+1); return Object.keys(AUC_SERIE).map(k=>({k, n:AUC_SERIE[k], c:Math.min(3,C[k]||0)})); };
{ const _pc=prCompute; prCompute=function(){ const r=_pc.apply(this,arguments); try{ const b=aucSeries().filter(x=>x.c>=3).length*5; if(b){ S.prB.coll=(S.prB.coll||0)+b; S.prestige=Math.round((S.prestige+b)*10)/10; } }catch(e){} return S.prestige; }; }
/* lots mystères : la révélation */
{ const _mb=mysteryBox; mysteryBox=function(k){ const A=aucInit(), n=A.coll.length, r=_mb(k); if(r&&r.ok&&A.coll.length>n){ const it=A.coll[A.coll.length-1]; it.prov=pick(AUC_PROV); it.etat=pick(AUC_ETAT); ui.modal={type:'aucrev', id:it.id}; return ok(); } return r; }; }

/* ---------- la salle en direct ---------- */
function aucLiveStart(){ const s=aucSale(); if(!aucOpen()) return err('La salle n’est pas ouverte aujourd’hui.');
  const i=s.lots.findIndex(l=>!l.out); if(i<0) return err('Tous les lots sont passés.');
  ui.live={i, cur:Math.round(s.lots[i].est*.5/100)*100, lead:null, t:6, last:'', pause:0}; ui.modal={type:'auclive'}; aucTick(); return ok(); }
function aucTick(){ clearTimeout(ui.liveT); ui.liveT=setTimeout(()=>{ if(!(ui.modal&&ui.modal.type==='auclive')||!ui.live){ return; } const L=ui.live, s=aucSale(), l=s.lots[L.i];
    if(L.pause){ L.pause--; if(!L.pause){ const j=s.lots.findIndex(x=>!x.out); if(j<0){ s.done=1; ui.live=null; ui.modal=null; render(); return; } ui.live={i:j, cur:Math.round(s.lots[j].est*.5/100)*100, lead:null, t:6, last:''}; } render(); aucTick(); return; }
    /* les enchérisseurs réagissent */
    const nx=L.cur+aucSt(l)*(L.cur<l.est*.8?3:1), C=l.ai.filter(b=>b.m>=nx&&b.n!==L.lead);
    if(!l.cid&&l.ord&&L.lead!=='me'&&l.ord>=nx&&S.cash>=nx*1.05&&rnd()<.6){ L.cur=nx; L.lead='me'; L.t=Math.max(L.t,4); L.last='Votre ordre d’achat enchérit'; }
    else if(C.length&&rnd()<.55){ const b=pick(C); L.cur=nx; L.lead=b.n; L.t=Math.max(L.t,4); L.last=b.n; }
    else L.t--;
    if(L.t<=0){ const res=Math.max(l.res||0,0); if(L.lead&&L.cur>=res){ l.out={sold:1, w:L.lead, p:L.cur}; } else l.out={sold:0}; aucApply(l); L.pause=2; L.hammer=1; }
    render(); aucTick(); },800); }
function aucBid(){ const L=ui.live, s=aucSale(), l=L&&s.lots[L.i]; if(!l||L.pause) return err('Attendez le lot suivant.'); if(l.cid) return err('Vous vendez ce lot.');
  if(L.lead==='me') return err('Vous menez déjà.'); const nx=L.cur+aucSt(l); if(S.cash<nx*1.05) return err('Trésorerie insuffisante : '+eur(nx*1.05,0)+' (frais compris).');
  L.cur=nx; L.lead='me'; L.t=6; L.last='Vous'; return ok(); }
function aucPass(){ const L=ui.live, s=aucSale(), l=L&&s.lots[L.i]; if(!l||L.pause) return; l.ord=0; L.t=Math.min(L.t,2); }

/* ---------- écrans ---------- */
NF_CSS.push(AUC_CSS+`
.auc-hero{border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#3A2A12,#120D06);border:1px solid #4A3818;padding:14px;margin:4px 0 12px;color:#F2F3F7}
.auc-hero .t{font:800 20px Georgia,'Times New Roman',serif;margin:8px 0 2px}.auc-hero small{color:#C9B996;font:600 12.5px var(--f-body)}
.auc-pill{display:inline-block;font:800 11px var(--f-body);padding:4px 9px;border-radius:99px;background:#4A3818;color:#F5D58A;white-space:nowrap}
.auc-acts{display:flex;gap:8px;margin-top:10px}.auc-acts .btn{min-height:46px}
.auc-lots{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.auc-lot{background:var(--card);border:0;border-radius:16px;overflow:hidden;text-align:left;color:var(--ink);padding:0;box-shadow:var(--shadow)}
.auc-lot svg{display:block;width:100%;height:auto}.auc-lot .in{padding:8px 10px}.auc-lot b{font:800 12.5px var(--f-body);display:block;line-height:1.2}
.auc-lot small{display:block;font:600 11.5px var(--f-body);color:var(--ink-3)}
.auc-lot.vit{background:#0D0C0A;border:1px solid #3A2E1A;color:#F2F3F7}.auc-lot.vit small{color:#B7B0A0}
.auc-tag{display:inline-block;margin-top:4px;font:800 10.5px var(--f-body);padding:3px 7px;border-radius:99px;background:#13261A;color:#6EE7A0}
.auc-tag.w{background:#3A1D12;color:#FFB089}.auc-tag.b{background:#1A2540;color:#9CC7F5}
.auc-h{font:900 11.5px var(--f-body);letter-spacing:.1em;color:var(--ink-3);text-transform:uppercase;margin:14px 0 6px}
.auc-myst{display:flex;gap:8px}.auc-myst button{flex:1;background:var(--card);border:0;border-radius:14px;padding:8px 4px;text-align:center;font:800 12px var(--f-body);color:var(--ink);box-shadow:var(--shadow);min-height:44px}
.auc-myst svg{animation:acShake .5s ease-in-out infinite;animation-play-state:paused}.auc-myst button:hover svg{animation-play-state:running}
.auc-room{display:block;width:100%;height:auto;border-radius:16px;background:#1A120C}
.auc-big{font:900 30px var(--f-body);line-height:1.1}
.auc-bid{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font:600 13px var(--f-body)}
.auc-hm{text-align:center;font:900 22px Georgia,serif;padding:8px;border-radius:14px;background:#2E8A5A;color:#fff;margin:8px 0}.auc-hm.no{background:#5A2A14}
.auc-rev{display:block;width:100%;height:auto}.auc-rv-t{text-align:center;opacity:0;animation:acRise .6s 3.2s forwards}
`);
try{ const e=document.getElementById('nf-css'); if(e) e.textContent+='\n'+NF_CSS[NF_CSS.length-1]; else nfCssOnce(); }catch(e){}
const aucCrate = s => '<svg viewBox="0 0 60 50" width="'+s+'" aria-hidden="true"><rect x="6" y="14" width="48" height="32" fill="#8A5A2B"/><rect x="4" y="8" width="52" height="8" fill="#A8743A"/><path d="M6 24 H54 M6 34 H54 M18 14 V46 M42 14 V46" stroke="#5E3C1C"/><text x="30" y="32" text-anchor="middle" font-size="12" font-weight="900" fill="#F5D58A">?</text></svg>';
function vAuction(){ const A=aucInit(), s=aucSale(), t=ui.aucT||'sale'; let h=head('Salle des ventes');
  h+='<div class="fab-tabs"><button class="'+(t==='sale'?'on':'')+'" data-a="auct" data-i="sale">Ventes</button><button class="'+(t==='coll'?'on':'')+'" data-a="auct" data-i="coll">Ma collection ('+A.coll.length+')</button></div>';
  if(t==='sale'){ const d=aucDays(), tot=s.lots.reduce((a,l)=>a+l.est,0), riv=s.lots.some(l=>l.ai.some(b=>b.riv));
    h+='<div class="auc-hero"><div class="row sp"><span class="auc-pill">Vente n° '+s.id+' · '+dateL(s.day)+'</span><span class="auc-pill" style="background:#232327;color:#C9CBD6">'+(s.done? 'terminée' : d>0? 'dans '+plu(d,'jour') : 'aujourd’hui')+'</span></div>'+
      '<div class="t">'+esc(s.n)+'</div><small>'+plu(s.lots.length,'lot')+' · estimation totale '+eur(tot,0)+(riv?' · un rival est inscrit':'')+'</small>'+
      '<div class="auc-acts">'+(aucOpen()? '<button class="btn primary" style="flex:1" data-a="aucin">Entrer dans la salle</button>' : '<span class="sub" style="color:#C9B996">'+(s.done?'Prochaine vente bientôt annoncée.':'Placez vos ordres d’achat : ils enchérissent pour vous si vous n’êtes pas dans la salle.')+'</span>')+'</div></div>';
    h+='<div class="auc-lots">'+s.lots.map(l=>{ const o=l.out, tg= o? (o.sold? (o.w==='me'?'<span class="auc-tag">Remporté</span>':l.cid?'<span class="auc-tag">Vendu</span>':'<span class="auc-tag w">Adjugé</span>') : '<span class="auc-tag w">Invendu</span>') : l.cid? '<span class="auc-tag b">Votre objet</span>' : l.ord? '<span class="auc-tag b">Ordre '+eur(l.ord,0)+'</span>' : '';
      return '<button class="auc-lot" data-a="auclot" data-i="'+l.id+'">'+aucArt(l.cat,l.n)+'<span class="in"><b>'+esc(l.n)+'</b><small>'+RAR[l.rar][0]+' · est. '+eur(l.est,0)+'</small>'+(o&&o.sold? '<small><b style="display:inline">'+eur(o.p,0)+'</b></small>' : '')+tg+'</span></button>'; }).join('')+'</div>';
    const sc=aucScale(); h+='<div class="auc-h">Lots mystères</div><div class="auc-myst">'+[['Petit',1],['Moyen',4],['Grand',15]].map((x,k)=>'<button data-a="mystery" data-v="'+k+'">'+aucCrate(64)+'<div>'+x[0]+'</div><small class="sub">'+eur(Math.round(sc*x[1]/100)*100,0)+'</small></button>').join('')+'</div>';
    h+='<div class="sub" style="margin-top:8px">Frais acheteur 5 %, commission vendeur 10 %. Un lot mystère peut valoir bien moins, ou bien plus, que son prix.</div>'; }
  else { const C=A.coll, val=C.reduce((a,it)=>a+collVal(it),0), pr=C.reduce((a,it)=>a+[1,3,8][it.rar||0],0)+aucSeries().filter(x=>x.c>=3).length*5;
    h+='<div class="sub" style="margin-bottom:10px">'+plu(C.length,'pièce')+' · valeur '+eur(val,0)+' · prestige +'+pr+'</div>';
    h+=C.length? '<div class="auc-lots">'+C.map(it=>{ const v=collVal(it), ch=it.paid? (v/it.paid-1) : 0, st= aucLoaned(it.id)? '<span class="auc-tag b">Au musée</span>' : aucConsigned(it.id)? '<span class="auc-tag w">En vente</span>' : '';
      return '<button class="auc-lot vit" data-a="aucobj" data-i="'+it.id+'">'+aucArt(it.cat,it.n)+'<span class="in"><b>'+esc(it.n)+'</b><small>'+eur(v,0)+(it.paid? ' · <span style="color:'+(ch>=0?'#5BE39A':'#FF7B72')+'">'+(ch>=0?'+':'')+Math.round(ch*100)+' %</span>' : '')+'</small>'+st+'</span></button>'; }).join('')+'</div>' : '<div class="notice info">Aucun objet. Remportez une enchère ou ouvrez un lot mystère.</div>';
    h+='<section class="card" style="margin-top:10px"><h2><span>Séries</span><span class="sub">3 objets d’une catégorie : +5 prestige</span></h2>'+aucSeries().map(x=>'<div class="fab-row"><span>'+x.n+'</span><span class="'+(x.c>=3?'fab-ok':'')+'" style="font-weight:800">'+(x.c>=3?'Complète · +5':x.c+' / 3')+'</span></div>').join('')+'</section>';
    const Lo=(A.loans||[]).map(o=>[o,C.find(x=>x.id===o.cid)]).filter(x=>x[1]);
    if(Lo.length) h+='<section class="card"><h2><span>Prêts aux musées</span></h2>'+Lo.map(([o,it])=>'<div class="fab-row"><span><b>'+esc(it.n)+'</b><small style="display:block;color:var(--ink-3)">retour le '+dateL(o.until)+'</small></span><b class="fab-ok">+'+eur(collVal(it)*.01,0)+' / mois</b></div>').join('')+'</section>'; }
  return h; }
VIEWS.auction=vAuction;
/* fenêtres : lot, objet, salle en direct, révélation */
function aucRoom(l,L){ let r='<defs><linearGradient id="aucwl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A1E1E"/><stop offset="1" stop-color="#2A0E0E"/></linearGradient></defs><rect width="360" height="150" fill="url(#aucwl)"/>';
  r+=[...Array(9)].map((_,i)=>'<rect x="'+(i*42)+'" y="0" width="3" height="96" fill="#7A2E2E"/>').join('')+'<rect y="96" width="360" height="54" fill="#3A2414"/>';
  r+='<g transform="translate(250 30)"><rect x="-8" y="0" width="74" height="10" fill="#C9A23A"/><rect x="0" y="10" width="58" height="58" fill="#6B4423"/><rect x="0" y="10" width="58" height="6" fill="#8A5A2B"/><circle cx="29" cy="-14" r="9" fill="#E8C49A"/><path d="M14 0 Q29 -14 44 0Z" fill="#1E242C"/><path d="M20 -22 Q29 -30 38 -22" fill="#4A3A2A"/>'+
     '<g style="transform-origin:44px -4px;transform-box:view-box;animation:acHam '+(L&&L.hammer?'.6s 1':'2.4s infinite')+' ease-in-out"><rect x="44" y="-6" width="22" height="4" rx="2" fill="#8A5A2B"/><rect x="62" y="-11" width="8" height="14" rx="2" fill="#5E3C1C"/></g><rect x="12" y="34" width="34" height="14" fill="#C9A23A" opacity=".85"/><text x="29" y="44" text-anchor="middle" font-size="7" font-weight="900" fill="#3A2414">LOT '+((L?L.i:0)+1)+'</text></g>';
  r+='<rect x="110" y="14" width="96" height="66" fill="#C9A23A"/><rect x="114" y="18" width="88" height="58" fill="#0E1018"/><g transform="translate(128 19) scale(.5)">'+aucArt(l.cat,l.n,120).replace(/<\/?svg[^>]*>/g,'')+'</g>';
  r+=[0,1,2,3,4,5,6].map(i=>{ const x=20+i*48, y=118, up= L&&L.last&&L.last!=='Vous'&&(i===(L.cur/aucSt(l)|0)%7); return '<g><circle cx="'+x+'" cy="'+y+'" r="10" fill="#1E1A16"/><rect x="'+(x-11)+'" y="'+(y+8)+'" width="22" height="30" rx="8" fill="#1E1A16"/>'+((i%3===1)||up? '<g style="animation:acPad 2.4s '+(i*.35)+'s ease-in-out infinite"><rect x="'+(x+8)+'" y="'+(y-22)+'" width="2" height="18" fill="#C9CED6"/><circle cx="'+(x+9)+'" cy="'+(y-26)+'" r="7" fill="#F2EEDF"/><text x="'+(x+9)+'" y="'+(y-23)+'" text-anchor="middle" font-size="7" font-weight="900" fill="#7A1E2E">'+(12+i*7)+'</text></g>' : '')+'</g>'; }).join('');
  return '<svg class="auc-room" viewBox="0 0 360 150" aria-hidden="true">'+r+'</svg>'; }
function aucRevealSvg(it){ let v='<defs><radialGradient id="aucglo"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient></defs>';
  const col=['#8A929C','#2B5BB5','#2E8A5A'][it.rar||0], lab=RAR[it.rar||0][0].toUpperCase();
  v+='<g style="opacity:0;animation:acRise .4s 1.6s forwards"><g style="transform-origin:180px 200px;transform-box:view-box;animation:acRay 8s linear infinite">'+[...Array(16)].map((_,i)=>'<path d="M180 200 L'+(180+Math.cos(i*.3927)*260)+' '+(200+Math.sin(i*.3927)*260)+' L'+(180+Math.cos(i*.3927+.12)*260)+' '+(200+Math.sin(i*.3927+.12)*260)+'Z" fill="#E8B84A" opacity=".18"/>').join('')+'</g><circle cx="180" cy="200" r="120" fill="url(#aucglo)"/></g>';
  v+='<g style="opacity:0;transform-origin:180px 190px;transform-box:view-box;animation:acRise .9s 1.7s cubic-bezier(.2,1.4,.4,1) forwards"><g transform="translate(90 110) scale(1.5)">'+aucArt(it.cat,it.n,120).replace(/<\/?svg[^>]*>/g,'').replace(/<rect width="120" height="100"[^>]*>/,'')+'</g></g>';
  v+='<g style="transform-origin:180px 330px;transform-box:view-box;animation:acShake .25s 0s 5"><g transform="translate(90 250)"><rect x="10" y="30" width="160" height="96" fill="#8A5A2B"/><path d="M10 60 H170 M10 92 H170 M50 30 V126 M130 30 V126" stroke="#5E3C1C" stroke-width="3"/></g></g>';
  v+='<g style="transform-origin:180px 270px;transform-box:view-box;animation:acLid .5s 1.3s ease-in forwards"><rect x="92" y="262" width="176" height="22" fill="#A8743A"/><text x="180" y="279" text-anchor="middle" font-size="16" font-weight="900" fill="#F5D58A">?</text></g>';
  v+='<g style="transform-origin:180px 70px;transform-box:view-box;transform:scaleX(0);animation:acBanner .5s 2.6s forwards"><path d="M80 52 H280 L268 70 L280 88 H80 L92 70Z" fill="'+col+'"/><text x="180" y="76" text-anchor="middle" font-size="16" font-weight="900" fill="#fff" font-family="Georgia,serif">'+lab+'</text></g>';
  if(it.rar) v+=[...Array(18)].map((_,i)=>'<rect x="'+(60+i*14)+'" y="40" width="5" height="9" fill="'+['#E8B84A','#FF7B72','#5BE39A','#7FD3FF'][i%4]+'" style="opacity:0;animation:acConf 1.6s '+(2.7+(i%5)*.12)+'s ease-in forwards"/>').join('');
  return '<svg class="auc-rev" viewBox="0 0 360 400" aria-hidden="true">'+v+'</svg>'; }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!m||!/^auc/.test(m.type||'')) return _mc(); const A=aucInit(), s=aucSale();
  if(m.type==='auclot'){ const l=s.lots.find(x=>x.id===m.id); if(!l){ ui.modal=null; return _mc(); } const o=l.out;
    let b='<div style="border-radius:16px;overflow:hidden">'+aucArt(l.cat,l.n,360).replace('width="360"','width="100%"').replace(/height="\d+"/,'height="auto"')+'</div><div style="margin-top:10px"><b style="font:800 18px Georgia,serif">'+esc(l.n)+'</b><div class="sub">'+RAR[l.rar][0]+' · provenance : '+esc(l.prov)+' · état '+esc(l.etat)+'</div><div class="sub">Estimation '+eur(l.est*.85,0)+' – '+eur(l.est*1.2,0)+'</div></div>';
    if(o) b+='<div class="auc-hm'+(o.sold?'':' no')+'">'+(o.sold? 'Adjugé '+eur(o.p,0)+(o.w==='me'?' · à vous':'') : 'Invendu')+'</div>';
    else if(l.cid) b+='<div class="notice info" style="margin-top:10px">Votre objet · prix de réserve '+eur(l.res||0,0)+'.</div>';
    else { b+='<div class="auc-h">Ordre d’achat</div><div class="sub" style="margin-bottom:6px">Il enchérit pour vous, pas à pas, jusqu’à ce plafond.</div><div class="auc-acts" style="flex-wrap:wrap">'+[[.9,'Prudent'],[1.15,'Ferme'],[1.45,'Coûte que coûte']].map(([f,n])=>{ const v=Math.round(l.est*f/100)*100; return '<button class="btn'+(l.ord===v?' primary':'')+'" data-a="aucord" data-i="'+l.id+'" data-v="'+v+'">'+n+' · '+eur(v,0)+'</button>'; }).join('')+(l.ord? '<button class="btn" data-a="aucord" data-i="'+l.id+'" data-v="0">Retirer l’ordre</button>' : '')+'</div>'; }
    return {title:'Lot de la vente n° '+s.id, body:b}; }
  if(m.type==='aucobj'){ const it=A.coll.find(x=>x.id===m.id); if(!it){ ui.modal=null; return _mc(); } const v=collVal(it), ln=aucLoaned(it.id), cs=aucConsigned(it.id);
    let b='<div style="border-radius:16px;overflow:hidden">'+aucArt(it.cat,it.n,360).replace('width="360"','width="100%"').replace(/height="\d+"/,'height="auto"')+'</div><div style="margin-top:10px"><b style="font:800 18px Georgia,serif">'+esc(it.n)+'</b><div class="sub">'+RAR[it.rar||0][0]+(it.prov?' · '+esc(it.prov):'')+'</div></div>'+
      '<div class="fab-row"><span>Valeur estimée</span><b>'+eur(v,0)+'</b></div>'+(it.paid? '<div class="fab-row"><span>Payé</span><b>'+eur(it.paid,0)+'</b></div>' : '')+'<div class="fab-row"><span>Prestige</span><b>+'+[1,3,8][it.rar||0]+'</b></div>';
    if(ln) b+='<div class="notice info">Prêté à un musée : +'+eur(v*.01,0)+' par mois.</div>';
    else if(cs) b+='<div class="notice info">Confié à la prochaine vente.</div>';
    else b+='<div class="auc-h">Mettre en vente</div><div class="sub" style="margin-bottom:6px">À la prochaine vente, avec un prix de réserve. Commission de 10 %.</div><div class="auc-acts" style="flex-wrap:wrap">'+[[.8,'Réserve basse'],[1,'Réserve à l’estimation'],[1.2,'Réserve haute']].map(([f,n])=>'<button class="btn" data-a="auccons" data-i="'+it.id+'" data-v="'+f+'">'+n+' · '+eur(v*f,0)+'</button>').join('')+'</div>'+
      '<div class="auc-h">Prêter à un musée</div><button class="btn" style="width:100%" data-a="aucloan" data-i="'+it.id+'">Prêter 6 mois · +'+eur(v*.01,0)+' par mois</button>';
    return {title:'Ma collection', body:b}; }
  if(m.type==='aucrev'){ const it=A.coll.find(x=>x.id===m.id); if(!it){ ui.modal=null; return _mc(); } const v=collVal(it);
    return {title:'Lot mystère', body:aucRevealSvg(it)+'<div class="auc-rv-t"><div style="font:800 20px Georgia,serif">'+esc(it.n)+'</div><div class="sub">Payé '+eur(it.paid||0,0)+' · estimé <b class="'+(v>=(it.paid||0)?'fab-ok':'fab-warn')+'" style="font-size:16px">'+eur(v,0)+'</b></div>'+
      '<div class="auc-acts"><button class="btn primary" style="flex:1" data-a="closemodal">Garder dans ma collection</button><button class="btn" style="flex:1" data-a="aucrevsell" data-i="'+it.id+'">Mettre en vente</button></div></div>'}; }
  if(m.type==='auclive'){ const L=ui.live; if(!L){ ui.modal=null; return _mc(); } const l=s.lots[L.i], o=l.out, nx=L.cur+aucSt(l);
    const bids=[...new Map(l.ai.map(b=>[b.n,b])).values()].slice(0,4);
    let b='<div class="row sp"><span class="sub">Lot '+(L.i+1)+' sur '+s.lots.length+' · '+esc(s.n)+'</span><span class="auc-pill" style="background:#3A1D12;color:#FFB089">En direct</span></div>'+aucRoom(l,L);
    b+='<div class="fab-row" style="gap:10px"><span style="width:110px;flex:0 0 110px;border-radius:12px;overflow:hidden">'+aucArt(l.cat,l.n,110)+'</span><span><b>'+esc(l.n)+'</b><small style="display:block;color:var(--ink-3)">'+esc(l.prov)+' · état '+esc(l.etat)+'</small><small style="display:block;color:var(--ink-3)">Estimation '+eur(l.est*.85,0)+' – '+eur(l.est*1.2,0)+'</small></span></div>';
    if(o) b+='<div class="auc-hm'+(o.sold?'':' no')+'">'+(o.sold? 'Adjugé '+eur(o.p,0)+' · '+(o.w==='me'?'à vous':esc(o.w)) : 'Invendu')+'</div>';
    else { b+='<div class="row sp" style="margin:8px 0"><div><div class="sub">Enchère actuelle</div><div class="auc-big">'+eur(L.cur,0)+'</div><div class="sub '+(L.lead==='me'?'fab-ok':L.lead?'fab-warn':'')+'">'+(L.lead==='me'?'Vous menez':L.lead? esc(L.lead)+' mène' : 'Mise à prix')+'</div></div>'+
        '<svg viewBox="0 0 60 60" width="62" aria-hidden="true"><circle cx="30" cy="30" r="25" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="30" cy="30" r="25" fill="none" stroke="#E8B84A" stroke-width="6" stroke-dasharray="157" stroke-dashoffset="'+(157*(1-L.t/6))+'" transform="rotate(-90 30 30)"/><text x="30" y="35" text-anchor="middle" font-size="15" font-weight="900" fill="currentColor">'+L.t+' s</text></svg></div>';
      b+=bids.map(x=>'<div class="auc-bid"><span>'+esc(x.n)+'</span><span>'+(L.lead===x.n?'<b>'+eur(L.cur,0)+'</b>':'')+'</span></div>').join('');
      b+=l.cid? '<div class="notice info" style="margin-top:8px">C’est votre objet : réserve '+eur(l.res||0,0)+'.</div>' : '<div class="auc-acts"><button class="btn primary" style="flex:1;min-height:52px" data-a="aucbid"'+(L.lead==='me'?' data-dis="1" data-why="Vous menez déjà."':'')+'>Enchérir '+eur(nx,0)+'</button><button class="btn" style="min-height:52px" data-a="aucpass">Passer</button></div><div class="sub" style="margin-top:6px">Frais acheteur 5 % · trésorerie '+eur(S.cash,0)+'</div>'; }
    return {title:'Salle des ventes', body:b}; }
  return _mc(); }; }
Object.assign(ACT,{
  auct:el=>{ ui.aucT=el.dataset.i; render(); },
  auclot:el=>{ ui.modal={type:'auclot', id:+el.dataset.i}; render(); },
  aucobj:el=>{ ui.modal={type:'aucobj', id:+el.dataset.i}; render(); },
  aucord:el=>after(aucOrder(el.dataset.i,+el.dataset.v)),
  auccons:el=>{ const r=aucConsign(+el.dataset.i,+el.dataset.v); if(r.ok) ui.modal=null; after(r.ok?null:r); },
  aucloan:el=>{ const r=aucLoan(+el.dataset.i); if(r.ok) ui.modal=null; after(r.ok?null:r); },
  aucrevsell:el=>{ ui.modal={type:'aucobj', id:+el.dataset.i}; render(); },
  aucin:()=>{ const r=aucLiveStart(); if(!r.ok) res(r); render(); },
  aucbid:()=>{ const r=aucBid(); if(!r.ok) res(r); render(); },
  aucpass:()=>{ aucPass(); render(); },
  mystery:el=>after(mysteryBox(+el.dataset.v))
});
/* fermer la salle : les lots restants se règlent avec vos ordres d'achat */
{ const _cm=closeModal; closeModal=function(){ if(ui.modal&&ui.modal.type==='auclive'){ clearTimeout(ui.liveT); const s=aucSale(); s.lots.forEach(l=>{ if(!l.out){ aucSettle(l); aucApply(l); } }); s.done=1; ui.live=null; computeNW(); scheduleSave(); } return _cm.apply(this,arguments); }; }
