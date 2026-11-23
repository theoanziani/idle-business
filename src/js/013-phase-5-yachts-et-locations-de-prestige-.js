/* ============================================================
   PHASE 5 : yachts et locations de prestige, salle des ventes, gérant hors ligne, défi des 100 jours
   ============================================================ */
D.LUX.push(
  {id:'voilier',n:'Voilier de croisière de 24 m',kind:'yacht',price:2500000,tier:3,pr:5,vol:.003,dr:-.00005,up:.00025,spread:.15},
  {id:'yacht45',n:'Yacht à moteur de 45 m',kind:'yacht',price:18000000,tier:4,pr:14,vol:.003,dr:-.00005,up:.00025,spread:.15},
  {id:'mega',n:'Méga-yacht de 90 m',kind:'yacht',price:160000000,tier:5,pr:45,vol:.003,dr:-.00004,up:.00025,spread:.15}
);
D.LUX_KIND.yacht='Yachts';
/* Biens qui se louent : propriétés (4 % par an) et yachts en charter (9 % par an, usure) */
const RENTY={estate:.04,yacht:.09};
const luxRentable = l => !!RENTY[l.kind];
function luxRentDay(l){ return S.luxVal[l.id]*RENTY[l.kind]/360; }
function setLuxRent(id,v){ const o=S.lux.find(x=>x.id===id), l=D.LUX.find(x=>x.id===id); if(!o||!luxRentable(l)) return err('Bien non louable.'); o.rent=!!v; return ok(v?'Bien mis en location.':'Location arrêtée.'); }
/* Chocs de valeur puis retour progressif vers la tendance */
function lux2Step(){
  if(!S.luxAnc) S.luxAnc={};
  D.LUX.forEach(l=>{
    if(S.luxVal[l.id]===undefined) S.luxVal[l.id]=l.price;
    const a=S.luxAnc[l.id]||(S.luxAnc[l.id]=S.luxVal[l.id]); S.luxAnc[l.id]=a*Math.exp(l.dr);
    S.luxVal[l.id]*=Math.exp(0.01*Math.log(S.luxAnc[l.id]/S.luxVal[l.id]));
  });
  if(rnd()<.0025){ const k=pick(['car','art','estate','yacht']); D.LUX.filter(l=>l.kind===k).forEach(l=>{ S.luxVal[l.id]*=.82; });
    log('warn','Le marché « '+D.LUX_KIND[k]+' » chute de 18 %. Les prix devraient remonter peu à peu.','news'); }
  S.lux.forEach(o=>{ if(!o.rent) return; const l=D.LUX.find(x=>x.id===o.id); pay('lux','Location : '+l.n,luxRentDay(l),'cap'); if(l.kind==='yacht') S.luxVal[l.id]*=.9998; });
  collStep();
}
const luxPrestige = o => { const l=D.LUX.find(x=>x.id===o.id); return o.rent? l.pr*.5 : l.pr; };

/* ---------- Salle des ventes (enchères contre des acheteurs IA) ---------- */
D.COLL=[
  ['Montre de plongée vintage de 1968','montre',1],['Chronographe en or rose','montre',2],['Tourbillon en édition limitée','montre',3],
  ['Caisse de grand cru bordelais 1945','vin',2],['Whisky single malt de 50 ans','vin',1],['Guitare signée par une légende du rock','souvenir',2],
  ['Maillot porté en finale de Coupe du monde','souvenir',1],['Manuscrit original du XVIIIe siècle','livre',2],['Sculpture en bronze Art déco','art',2],
  ['Photographie en tirage unique','art',1],['Coupé sport des années 1960','auto',3],['Roadster italien de collection','auto',3],
  ['Météorite martienne','rareté',2],['Diamant bleu de 5 carats','bijou',3],['Collier de perles impérial','bijou',3],['Pièce d’or romaine','rareté',1],
  ['Timbre à l’erreur d’impression','rareté',1],['Carnet de croquis d’un grand couturier','livre',1]
];
const RAR=[['Courant',1,''],['Rare',2.2,'info'],['Pièce unique',6,'good']];
function aucInit(){ if(!S.auc) S.auc={lots:[],next:S.day,coll:[]}; return S.auc; }
function aucScale(){ return clamp(Math.max(S.nw,2e5)*0.004,1500,2e8); }
function newLot(){
  const A=aucInit(), c=pick(D.COLL), r=rnd()<.08?2:rnd()<.3?1:0, est=Math.round(aucScale()*c[2]*RAR[r][1]*(0.5+rnd())/100)*100;
  const ai=[0,0,0].map(()=>est*(0.7+0.75*rnd())).sort((a,b)=>b-a);
  A.lots.push({id:S.nid++, n:c[0], cat:c[1], rar:r, est, cur:Math.round(est*.4/100)*100, end:S.day+rint(4,8), lead:'ai', ai, mine:0});
}
const lotStep = l => Math.max(100,Math.round(l.est*.05/100)*100);
const prOf = it => Math.round(it.est/aucScaleRef(it)*2*(1+it.rar))/1;
function aucScaleRef(it){ return Math.max(1,it.ref||it.est); }
function bidLot(id){
  const A=aucInit(), l=A.lots.find(x=>x.id===id); if(!l) return err('Lot terminé.');
  if(l.seller) return err('Vous vendez ce lot.');
  if(l.lead==='me') return err('Vous êtes déjà le meilleur enchérisseur.');
  const b=l.cur+lotStep(l); if(S.cash<b*1.05) return err('Trésorerie insuffisante : '+eur(b*1.05,0)+' requis (frais de 5 % compris).');
  l.cur=b; l.lead='me'; l.mine=b; return ok('Vous menez à '+eur(b,0)+'.');
}
function sellColl(cid){
  const A=aucInit(), it=A.coll.find(x=>x.id===cid); if(!it) return err('Objet introuvable.');
  if(A.lots.some(x=>x.cid===cid)) return err('Déjà en vente.');
  const v=collVal(it), ai=[0,0].map(()=>v*(0.75+0.6*rnd())).sort((a,b)=>b-a);
  A.lots.push({id:S.nid++, n:it.n, cat:it.cat, rar:it.rar, est:v, cur:Math.round(v*.5/100)*100, end:S.day+5, lead:'ai', ai, seller:true, cid});
  return ok('Mis aux enchères pour 5 jours.');
}
function mysteryBox(k){
  const P=[1,4,15][k], price=Math.round(aucScale()*P/100)*100; if(S.cash<price) return err('Trésorerie insuffisante : '+eur(price,0)+'.');
  payCap('lux','Lot mystère',-price);
  const c=pick(D.COLL), r=rnd()<.05?2:rnd()<.25?1:0, est=Math.round(price*(0.35+1.6*Math.pow(rnd(),1.4))*(r?RAR[r][1]/1.6:1)/100)*100;
  const it={id:S.nid++, n:c[0], cat:c[1], rar:r, est, paid:price, day:S.day, ref:aucScale()}; aucInit().coll.push(it);
  return ok('Lot mystère : « '+it.n+' » ('+RAR[r][0].toLowerCase()+'), estimé '+eur(est,0)+'.');
}
const collVal = it => it.est*(it.k||1);
function collStep(){
  const A=aucInit();
  if(S.day>=A.next){ const n=Math.min(5,4-A.lots.filter(x=>!x.seller).length+1); for(let i=0;i<n;i++) newLot(); A.next=S.day+7; }
  A.coll.forEach(it=>{ it.k=(it.k||1)*Math.exp(0.0002+0.004*norm()); });
  A.lots=A.lots.filter(l=>{
    if(!l.seller&&l.lead==='me'){ const top=l.ai[0]; if(top>=l.cur+lotStep(l)&&rnd()<.75){ l.cur=Math.min(top,l.cur+lotStep(l)*rint(1,3)); l.lead='ai'; } }
    else if(l.seller){ if(l.ai[0]>=l.cur+lotStep(l)) l.cur=Math.min(l.ai[0],l.cur+lotStep(l)*rint(1,2)); }
    if(S.day<l.end) return true;
    if(l.seller){ const it=A.coll.find(x=>x.id===l.cid); const p=l.cur*.9; payCap('lux','Vente aux enchères : '+l.n,p); if(it) S.tb.cap+=p-(it.paid||0); A.coll=A.coll.filter(x=>x.id!==l.cid); log('good','Adjugé : « '+l.n+' » vendu '+eur(l.cur,0)+' (commission de 10 %).'); }
    else if(l.lead==='me'){ const c=l.cur*1.05; if(S.cash>=c){ payCap('lux','Enchère remportée : '+l.n,-c); A.coll.push({id:S.nid++, n:l.n, cat:l.cat, rar:l.rar, est:l.est, paid:c, day:S.day, ref:aucScale()}); log('good','Vous remportez « '+l.n+' » pour '+eur(l.cur,0)+'.'); }
      else { S.rep=clamp(S.rep-2,0,100); log('bad','Enchère perdue faute de fonds : « '+l.n+' ».'); } }
    return false;
  });
  S.prestige=(S.prestige||0)+A.coll.reduce((a,it)=>a+[1,3,8][it.rar],0)-S.lux.filter(o=>o.rent).reduce((a,o)=>a+D.LUX.find(x=>x.id===o.id).pr*.5,0);
}
function collNW(){ return S.auc? S.auc.coll.reduce((a,it)=>a+collVal(it),0) : 0; }

/* ---------- Gérant hors ligne : fait tourner vos sociétés pendant votre absence ---------- */
const OFFM={hire:15000, day:300, perHour:1, max:14};
function offmHire(v){
  if(v){ if(S.offm&&S.offm.on) return err('Déjà embauché.'); if(S.cash<OFFM.hire) return err('Trésorerie insuffisante : '+eur(OFFM.hire,0)+'.'); payCap('gen','Embauche du gérant hors ligne',-OFFM.hire); S.offm={on:true}; return ok('Gérant embauché : à votre retour, il aura fait tourner vos sociétés.'); }
  S.offm={on:false}; return ok('Gérant congédié.');
}
function offmStep(){ if(S.offm&&S.offm.on) pay('gen','Gérant hors ligne',-OFFM.day*progMult()); }
/* Jours que le gérant peut faire passer : 1 par heure d'absence réelle, 14 au plus */
function offmDays(){ if(!S.offm||!S.offm.on||!S.seen) return 0; return Math.min(OFFM.max,Math.floor((Date.now()-S.seen)/3600000*OFFM.perHour)); }

/* ---------- Défi des 100 jours contre trois magnats IA ---------- */
const D100N=['Groupe Delmas','Nova Digital','Maison Valcourt'];
function d100Init(s){ s.mode='d100'; s.d100={ai:D100N.map((n,i)=>({n,f:s.startCap*0.35*Math.pow(s.startCap/1e5,-.3)*[0.5,1,1.6][i]*(0.85+0.3*Math.random()),sh:1.3+0.6*Math.random()})),done:false}; }
function d100Ai(a,day){ const t=clamp((day-1)/100,0,1); return a.f*Math.pow(t,a.sh)*(1+0.04*Math.sin(day*0.7+a.f)); }
function d100Board(){
  const D=S.d100, me={n:S.name,v:S.nw-S.startCap,me:true}; const L=D.ai.map(a=>({n:a.n,v:d100Ai(a,Math.min(S.day,101))})).concat([me]);
  return L.sort((a,b)=>b.v-a.v);
}
function d100Step(){ if(S.mode!=='d100'||!S.d100||S.d100.done) return; if(S.day>=100){ S.d100.done=true; const B=d100Board(); S.d100.rank=B.findIndex(x=>x.me)+1; S.flashD100=true; log(S.d100.rank===1?'good':'info','Fin du défi des 100 jours : vous terminez '+(S.d100.rank===1?'premier !':S.d100.rank+'e sur 4.')); } }

