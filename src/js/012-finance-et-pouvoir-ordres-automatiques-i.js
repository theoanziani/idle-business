/* ============================================================
   FINANCE ET POUVOIR : ordres automatiques, introductions en bourse, épargne automatique,
   élections, compte offshore et prison
   ============================================================ */

/* ---------- Introductions en bourse des start-ups ---------- */
const IPO_SEC={Fintech:'finance','Santé':'sante',IA:'tech','Énergie':'energie',Logistique:'transport','Jeux vidéo':'tech',Robotique:'indus',Biotech:'sante','Éducation':'conso','Cybersécurité':'tech'};
function doIpo(v){
  const shares=1e6, mcap=v.val*(1.1+0.6*rnd()), p=Math.max(1,Math.round(mcap/shares*100)/100);
  let tk=(v.name.normalize('NFD').replace(/[^A-Za-z]/g,'').slice(0,4)||'NEWC').toUpperCase();
  while(D.stocks.some(x=>x.id===tk)) tk=tk.slice(0,3)+String.fromCharCode(65+rint(0,25));
  const def={id:tk, n:v.name, sec:IPO_SEC[v.sec]||'tech', p, vol:.028, beta:1.4, y:0, tier:2, ipo:true};
  D.stocks.push(def); (S.ipos=S.ipos||[]).push(def);
  S.mk.stocks.push({id:tk, price:p, lnF:Math.log(p)+0.15*norm(), hist:[p,p], divOff:0, divDue:false});
  const q=Math.floor(v.stake*shares); S.pf.player.stock[tk]={q, cost:v.inv};
  v.st='exit'; v.out=q*p; v.ipo=tk;
  log('good','Introduction en bourse de « '+v.name+' » ('+tk+') à '+eur(p,2)+' l’action : vos '+fmtN(q)+' actions valent '+eur(q*p,0)+'. Vendez-les quand vous voulez dans Marchés.','news');
}

/* ---------- Ordres automatiques : achat à cours limite, vente à cours limite, stop-loss ---------- */
const ORDN={buy:'Achat si le cours descend à',sell:'Vente si le cours monte à',stop:'Stop-loss si le cours tombe à'};
function placeOrder(cls,id,kind,px,amt){
  const a=assetInfo(cls,id); if(!a) return err('Actif inconnu.');
  if(!unlocked(a.tier)) return err('Palier de richesse insuffisant.');
  if(!(px>0)) return err('Indiquez un cours de déclenchement.');
  if(kind==='buy'){ if(!(amt>0)) return err('Indiquez le montant à investir.'); if(px>=a.p) return err('Le cours limite d’achat doit être sous le cours actuel ('+eur(a.p,2)+').'); }
  else { const pos=S.pf.player[cls][holdKey(cls,id)]; if(!pos) return err('Aucune position à vendre.'); if(kind==='sell'&&px<=a.p) return err('Le cours de vente doit dépasser le cours actuel ('+eur(a.p,2)+').'); if(kind==='stop'&&px>=a.p) return err('Le stop-loss doit être sous le cours actuel ('+eur(a.p,2)+').'); amt=clamp(amt||1,.01,1); }
  (S.orders=S.orders||[]).push({id:S.nid++, cls, aid:id, kind, px, amt, exp:S.day+90});
  return ok('Ordre enregistré pour 90 jours.');
}
function cancelOrder(id){ S.orders=(S.orders||[]).filter(o=>o.id!==id); return ok('Ordre annulé.'); }
function ordersStep(){
  if(!S.orders||!S.orders.length) return;
  S.orders=S.orders.filter(o=>{
    const a=assetInfo(o.cls,o.aid); if(!a) return false;
    if(S.day>o.exp){ log('info','Ordre expiré sur '+a.name+'.'); return false; }
    if(!a.open) return true;
    const hit= o.kind==='buy'? a.p<=o.px : o.kind==='sell'? a.p>=o.px : a.p<=o.px;
    if(!hit) return true;
    const r= o.kind==='buy'? buyAsset('player',o.cls,o.aid,o.amt) : sellAsset('player',o.cls,o.aid,o.amt);
    log(r.ok?'good':'warn',(o.kind==='buy'?'Achat automatique':o.kind==='sell'?'Vente automatique':'Stop-loss déclenché')+' sur '+a.name+' à '+eur(a.p,2)+' : '+(r.msg||'')); return false;
  });
}
/* Fourchette sur 52 semaines (360 jours de cotation au plus) */
function range52(hist){ const h=hist.slice(-260); return {lo:Math.min(...h), hi:Math.max(...h)}; }

/* ---------- Épargne automatique ---------- */
function setSave(p){ S.save={pct:clamp(+p||0,0,.5)}; return ok(); }
function savingStep(){
  const p=S.save&&S.save.pct; if(!p) return;
  let net=0; Object.keys(S.fl).forEach(k=>{ if(k.indexOf('b:')===0) net+=S.fl[k].in-S.fl[k].out; });
  const a=net*p; if(a<1||S.cash<a) return;
  S.livret.bal+=a; payCap('livret','Épargne automatique',-a);
}

/* ---------- Élection du gouverneur, tous les 180 jours ---------- */
const PARTY=[{n:'Alliance sociale',lean:-1},{n:'Rassemblement du centre',lean:0},{n:'Union pour la société',lean:1}];
const FIRST=['Claire','Antoine','Sofia','Marc','Hélène','Karim','Inès','Paul','Nadia','Victor','Léa','Hugo'], LAST=['Morel','Duval','Benali','Lefort','Garnier','Roussel','Perrin','Marchand','Aubert','Chevalier'];
function elecInit(){
  if(!S.elec) S.elec={next:Math.ceil(S.day/180)*180||180, cands:[], ally:null, last:null};
  return S.elec;
}
function elecCands(){
  const E=elecInit(); const raw=PARTY.map(()=>0.6+0.8*rnd()); const tot=raw.reduce((a,x)=>a+x,0);
  E.cands=PARTY.map((p,i)=>{ const bills=D.BILLS.filter(b=>b.cond(S.laws)&&(p.lean===0? Math.abs(b.lean)<.6 : Math.sign(b.lean)===p.lean)); const prog=[];
    for(let k=0;k<2&&bills.length;k++){ const b=bills.splice(rint(0,bills.length-1),1)[0]; prog.push(b.k); }
    return {id:i, name:pick(FIRST)+' '+pick(LAST), party:p.n, lean:p.lean, base:raw[i]/tot, prog, fund:0, offf:0}; });
  log('info','Campagne pour l’élection du gouverneur : vote le '+dateL(E.next)+'. Vous pouvez financer un candidat dans Politique.','news');
}
const fundScale = () => lobbyScale()*4;
function pollOf(c){ const E=S.elec; const w=E.cands.map(x=>x.base*(1+0.9*(1-Math.exp(-(x.fund+x.offf)/fundScale())))); const t=w.reduce((a,x)=>a+x,0); return w[c.id]/t; }
function fundCandidate(id,amt,fromOff){
  const E=elecInit(); if(S.country) return err('Vous gouvernez déjà un pays.');
  if(!unlocked(1)) return err('Palier Entrepreneur requis.');
  const c=E.cands.find(x=>x.id===id); if(!c) return err('Aucune campagne en cours.');
  if(!(amt>0)) return err('Montant invalide.');
  if(fromOff){ if(!S.off||!S.off.on) return err('Ouvrez d’abord un compte offshore.'); if(S.off.bal<amt) return err('Solde offshore insuffisant.'); S.off.bal-=amt; S.off.risk=(S.off.risk||0)+0.4*amt/fundScale(); c.offf+=amt; S.susp=clamp(S.susp+30*amt/(fundScale()*10),0,100); }
  else { if(S.cash<amt) return err('Trésorerie insuffisante.'); pay('pol','Campagne de '+c.name,-amt); c.fund+=amt; S.susp=clamp(S.susp+100*amt/(fundScale()*10),0,100); }
  S.infl+=2*amt/lobbyScale();
  return ok('Soutien versé à '+c.name+' : '+Math.round(pollOf(c)*100)+' % des intentions de vote.');
}
function electionStep(){
  if(S.country) return;
  const E=elecInit();
  if(E.ally&&S.day>E.ally.until) E.ally=null;
  if(!E.cands.length&&E.next-S.day<=45) elecCands();
  if(S.day<E.next||!E.cands.length) return;
  const w=E.cands.map(pollOf); let r=rnd(), win=E.cands[E.cands.length-1];
  for(let i=0;i<w.length;i++){ r-=w[i]; if(r<=0){ win=E.cands[i]; break; } }
  win.prog.forEach(k=>{ const d=billDef(k); if(d&&d.cond(S.laws)){ applyLaw(d,.5); S.lawLog.unshift({d:S.day,t:d.t,pass:true}); } });
  const mine=E.cands.reduce((a,c)=>a+c.fund+c.offf,0), my=win.fund+win.offf;
  if(my>0&&my>=mine*.5){ E.ally={name:win.name,until:S.day+180}; S.infl+=10; log('good','« '+win.name+' » ('+win.party+'), que vous avez soutenu, remporte l’élection. Allié au pouvoir : contrôles fiscaux bien moins fréquents pendant 180 jours.','news'); }
  else log('info','« '+win.name+' » ('+win.party+') est élu gouverneur'+(win.prog.length?' et applique son programme : '+win.prog.map(k=>billDef(k).t.toLowerCase()).join(' ; '):'')+'.','news');
  E.last={name:win.name,party:win.party,day:S.day}; E.cands=[]; E.next=S.day+180;
}

/* ---------- Compte offshore : impôts allégés, risque de prison ---------- */
const OFF_OPEN=25000, OFF_SHIFT=.35;
function offOpen(){ if(!unlocked(2)) return err('Palier Investisseur requis.'); if(S.off&&S.off.on) return err('Compte déjà ouvert.'); if(S.cash<OFF_OPEN) return err('Trésorerie insuffisante : '+eur(OFF_OPEN,0)+' requis.');
  payCap('gen','Montage d’une société écran offshore',-OFF_OPEN); S.off={on:true,bal:0,saved:0,risk:0,since:S.day}; S.susp=clamp(S.susp+5,0,100); log('warn','Compte offshore ouvert : vos bénéfices imposables baissent de 35 %, mais un contrôle peut vous envoyer en prison.'); return ok(); }
function offMove(a){ const O=S.off; if(!O||!O.on) return err('Aucun compte offshore.'); if(!isFinite(a)||!a) return err('Montant invalide.');
  if(a>0){ if(S.cash<a) return err('Trésorerie insuffisante.'); payCap('gen','Virement vers le compte offshore',-a); O.bal+=a; O.risk+=0.15*a/Math.max(1e5,S.nw); }
  else { const w=Math.min(-a,O.bal); if(w<=0) return err('Compte vide.'); O.bal-=w; payCap('gen','Rapatriement depuis l’offshore (frais 3 %)',w*.97); }
  return ok(); }
function offClose(){ const O=S.off; if(!O||!O.on) return err('Aucun compte offshore.'); if(O.bal>0) payCap('gen','Clôture du compte offshore (frais 3 %)',O.bal*.97); S.off={on:false,bal:0,saved:O.saved,risk:O.risk*.5}; return ok('Compte fermé. Le risque d’enquête diminue avec le temps.'); }
function offRisk(){ const O=S.off; if(!O) return 0; const a=S.elec&&S.elec.ally? .4 : 1; return clamp((0.03+S.susp/600+(O.risk||0)*.05+(O.bal>1e6?.02:0))*a*(S.dm||1),0,.6); }
/* Appelé à chaque échéance fiscale : renvoie l'impôt sur les sociétés évité */
function offTax(corp){
  const O=S.off; if(!O||(!O.on&&!(O.risk>0.01))) return 0;
  if(O.on){ const fee=2000+O.bal*.005; payCap('gen','Frais du compte offshore',-fee); }
  if(rnd()<offRisk()) { busted(); return 0; }
  O.risk=(O.risk||0)*.9;
  if(!O.on) return 0;
  const av=corp*OFF_SHIFT; O.saved+=av; return av;
}
function busted(){
  const O=S.off, fine=Math.max(50000,3*O.saved), conf=O.bal;
  pay('tax','Amende pour fraude fiscale',-fine);
  S.off={on:false,bal:0,saved:0,risk:0}; S.rep=clamp(S.rep-15,0,100); S.susp=clamp(S.susp+20,0,100); S.infl=Math.max(0,S.infl*.6);
  S.jail={until:S.day+30, fine, conf};
  log('crit','Enquête fiscale : votre montage offshore est découvert. Amende de '+eur(fine,0)+(conf?', '+eur(conf,0)+' saisis':'')+' et 30 jours de prison. Vos sociétés tournent sans vous.');
}
const inJail = () => !!(S.jail&&S.day<S.jail.until);
function finNW(){ return (S.off&&S.off.on? S.off.bal : 0); }

