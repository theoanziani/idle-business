
/* ============================================================
   V2.7.4 : BANQUE · MON COMPTE
   Abonnement bancaire (S.card, 0 à 5) : chaque carte réduit vos intérêts d'emprunt, augmente ceux du livret,
   baisse le prix des biens de luxe et ajoute du prestige. Payé chaque jour (prix mensuel / 30), à votre banque
   si vous en possédez une. Obsidienne : sur invitation (rang de prestige 4) ; Souveraine : rang Légende.
   Placements (S.inv) : dépôts à terme et obligations d'État des six pays, intérêts payés chaque jour.
   Automatismes : S.autoRes (trésorerie à garder), S.autoX (placer l'excédent sur le livret), S.autoR (rembourser
   les emprunts à plus de 6 %). Tous ces champs ont une valeur par défaut à la lecture.
   ============================================================ */
const CARDS=[
  {k:'ess',n:'Essentiel',fee:0,  loan:0,  liv:0,  lux:0,  pr:0,  bg:['#2F6BE0','#173A8C'],ink:'#FFFFFF',acc:'#BFD3FF',pat:'wave',pc:'#FFFFFF',po:.18,sub:'COMPTE COURANT'},
  {k:'arg',n:'Argent',  fee:150, loan:.03,liv:.05,lux:0,  pr:2,  bg:['#F2F4F7','#C4CAD3','#8D96A3'],ink:'#1B1F27',acc:'#4A5361',pat:'guill',pc:'#FFFFFF',po:.55,metal:1,sub:'COMPTE COURANT'},
  {k:'or', n:'Or',      fee:600, loan:.06,liv:.10,lux:0,  pr:6,  bg:['#FBE7A6','#E2B24C','#A87418'],ink:'#2A1C04',acc:'#6B4A0E',pat:'guill',pc:'#FFF3C8',po:.6,metal:1,sub:'PREMIUM'},
  {k:'pla',n:'Platine', fee:2500,loan:.10,liv:.15,lux:.03,pr:20, bg:['#EEF1F6','#AEB6C4','#5F6879'],ink:'#121722',acc:'#2E3646',pat:'wave',pc:'#FFFFFF',po:.45,metal:1,holo:1,sub:'BANQUE PRIVÉE'},
  {k:'obs',n:'Obsidienne',fee:12000,loan:.15,liv:.25,lux:.06,pr:60,gala:.25,rank:4,bg:['#2A2A2E','#0E0E10','#050506'],ink:'#E9C46A',acc:'#C9A24A',pat:'guill',pc:'#E9C46A',po:.22,metal:1,foil:1,sub:'BANQUE PRIVÉE'},
  {k:'sou',n:'Souveraine',fee:60000,loan:.25,liv:.40,lux:.10,pr:200,gala:.25,rank:6,early:1,bg:['#3A1E6B','#1A0E3A','#0A0618'],ink:'#F3D27A',acc:'#E7C266',pat:'both',pc:'#F3D27A',po:.25,metal:1,foil:1,crest:1,sub:'BANQUE PRIVÉE'}];
const myCard = () => CARDS[S.card||0]||CARDS[0];
const cardLoan = () => myCard().loan, cardLiv = () => myCard().liv, cardLux = () => myCard().lux;
const cardOk = i => { const c=CARDS[i]; return !c.rank || prRank()>=c.rank; };
function cardPick(i){ i=clamp(i|0,0,5); if(i===(S.card||0)) return ok();
  if(!cardOk(i)) return err('Sur invitation : rang de prestige « '+PR_RANKS[CARDS[i].rank][1]+' » requis.');
  S.card=i; prCompute(); log('info','Abonnement bancaire : carte '+CARDS[i].n+'.'); return ok(); }
ACT.cardpick=el=>after(cardPick(+el.dataset.v));
/* ---------- dessin d'une carte ---------- */
function cdGuill(cx,cy,n,rx,ry,col,op){ let s=''; for(let i=0;i<n;i++) s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" transform="rotate('+(i*180/n).toFixed(1)+' '+cx+' '+cy+')" fill="none" stroke="'+col+'" stroke-opacity="'+op+'" stroke-width=".5"/>'; return s; }
function cdWave(col,op){ let s=''; for(let j=0;j<22;j++){ const y=40+j*6; let d='M0 '+y; for(let x=0;x<345;x+=15) d+=' Q'+(x+7.5)+' '+(y+10*Math.sin((x+j*9)/30)).toFixed(1)+' '+(x+15)+' '+y; s+='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-opacity="'+op+'" stroke-width=".5"/>'; } return s; }
const CDK={};
function cardSvg(i,bal){ const c=CARDS[i], u='cd'+c.k, W=340, H=214;
  if(!CDK[i]){ const st=c.bg.map((x,j)=>'<stop offset="'+(j/(c.bg.length-1))+'" stop-color="'+x+'"/>').join(''), F=c.foil?'url(#'+u+'f)':c.ink;
    let s='<defs><linearGradient id="'+u+'b" x1="0" y1="0" x2="1" y2="1">'+st+'</linearGradient><linearGradient id="'+u+'c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBEBB5"/><stop offset=".5" stop-color="#D9AE4E"/><stop offset="1" stop-color="#A97C22"/></linearGradient>'+
      '<linearGradient id="'+u+'h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9BD2"/><stop offset=".25" stop-color="#9BE7FF"/><stop offset=".5" stop-color="#C8FF9B"/><stop offset=".75" stop-color="#FFE29B"/><stop offset="1" stop-color="#C29BFF"/></linearGradient>'+
      '<linearGradient id="'+u+'f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9C7424"/><stop offset=".3" stop-color="#F7DE8E"/><stop offset=".55" stop-color="#B98A2C"/><stop offset=".8" stop-color="#FBE7A6"/><stop offset="1" stop-color="#9C7424"/></linearGradient>'+
      '<linearGradient id="'+u+'s" x1="0" y1="0" x2="1" y2="0"><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
      '<filter id="'+u+'g"><feTurbulence type="fractalNoise" baseFrequency="'+(c.metal?'1.6 .02':'.9')+'" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .10 0"/></filter>'+
      '<clipPath id="'+u+'k"><rect width="'+W+'" height="'+H+'" rx="16"/></clipPath></defs><g clip-path="url(#'+u+'k)"><rect width="'+W+'" height="'+H+'" fill="url(#'+u+'b)"/><rect width="'+W+'" height="'+H+'" filter="url(#'+u+'g)"/>';
    if(c.pat!=='wave') s+=cdGuill(270,60,36,95,38,c.pc,c.po)+cdGuill(60,190,28,70,26,c.pc,c.po*.7);
    if(c.pat!=='guill') s+=cdWave(c.pc,c.po*.6);
    if(c.crest) s+='<g transform="translate(250,108)" opacity=".18" fill="none" stroke="'+c.pc+'" stroke-width="1.2">'+[...Array(12)].map((_,a)=>'<path d="M0 0 L'+(60*Math.cos(a/6*Math.PI)).toFixed(1)+' '+(60*Math.sin(a/6*Math.PI)).toFixed(1)+'"/>').join('')+'<circle r="30"/><circle r="44"/></g><g transform="translate(254,108)"><path d="M-18 6 L-22 -12 L-10 -3 L0 -16 L10 -3 L22 -12 L18 6 Z" fill="url(#'+u+'f)" stroke="#6E4E12" stroke-width=".6"/><rect x="-18" y="7" width="36" height="5" rx="1.5" fill="url(#'+u+'f)"/></g>';
    s+='<rect class="cd-shine" width="'+W+'" height="'+H+'" fill="url(#'+u+'s)"/>';
    s+='<g transform="translate(34,34)"><circle r="15" fill="none" stroke="'+F+'" stroke-width="1.4"/><circle r="11" fill="none" stroke="'+F+'" stroke-width=".6" opacity=".7"/><path d="M-6 7 V-2 L0 -8 L6 -2 V7 Z" fill="'+F+'"/><path d="M-2.5 7 V2 H2.5 V7" fill="'+c.bg[c.bg.length-1]+'"/></g>';
    s+='<text x="56" y="31" font-weight="900" font-size="13" letter-spacing="3" fill="'+F+'">IDLE BANK</text><text x="56" y="44" font-weight="700" font-size="8" letter-spacing="2" fill="'+c.acc+'" opacity=".85">'+c.sub+'</text><text x="'+(W-18)+'" y="36" text-anchor="end" font-weight="900" font-size="12" letter-spacing="2.5" fill="'+F+'">'+c.n.toUpperCase()+'</text>';
    s+='<g transform="translate(24,72)"><rect width="46" height="36" rx="7" fill="url(#'+u+'c)" stroke="#8a6a20" stroke-width=".6"/><path d="M0 12 H15 M0 24 H15 M31 12 H46 M31 24 H46 M15 0 V36 M31 0 V36 M15 18 H31" stroke="#7a5a18" stroke-width=".9" fill="none" opacity=".75"/><rect x="15" y="9" width="16" height="18" rx="3" fill="none" stroke="#7a5a18" stroke-width=".9" opacity=".75"/></g>';
    s+=[0,1,2,3].map(k=>'<path d="M'+(84+k*6)+' '+(84-k*3)+' Q'+(89+k*7)+' 90 '+(84+k*6)+' '+(96+k*3)+'" fill="none" stroke="'+c.acc+'" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>').join('');
    if(c.holo) s+='<rect x="270" y="122" width="46" height="34" rx="6" fill="url(#'+u+'h)" opacity=".85"/>';
    s+='<text x="24" y="202" font-weight="800" font-size="11" letter-spacing="2" fill="'+c.ink+'">'+esc((S.name||'Idle Business').toUpperCase().slice(0,24))+'</text>';
    s+='<g transform="translate('+(W-30)+',190)" fill="none" stroke="'+F+'" stroke-width="1.1"><circle r="11"/><ellipse rx="5" ry="11"/><path d="M-11 0 H11 M-9 -6 H9 M-9 6 H9"/></g><text x="'+(W-46)+'" y="194" text-anchor="end" font-weight="900" font-size="10" letter-spacing="1.5" fill="'+F+'">IDLEPAY</text>';
    CDK[i]={s,F}; }
  const K=CDK[i], mid= bal===undefined? '<text x="24" y="146" font-family="JetBrains Mono,monospace" font-size="17" letter-spacing="1.5" fill="'+K.F+'">4821  '+[1371,2213,977].map(m=>String((1000+i*m)%9000+1000)).join('  ')+'</text>'
    : '<text x="24" y="132" font-weight="800" font-size="10" letter-spacing="1" fill="'+CARDS[i].acc+'">SOLDE DISPONIBLE</text><text x="24" y="160" font-weight="900" font-size="27" fill="'+K.F+'">'+esc(eur(bal,0))+'</text>';
  return '<svg class="cd-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Carte '+CARDS[i].n+'" style="font-family:var(--f-body)">'+K.s+mid+'<rect x=".5" y=".5" width="'+(W-1)+'" height="'+(H-1)+'" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".25"/></g></svg>'; }
/* ---------- effets ---------- */
debtRate=function(){ return Math.max(.5,S.macro.rate+crGrade()[2]-PR_RATE*prRank()); };
const debtRateEff = () => debtRate()*(1-cardLoan());
{ const _pc=prCompute; prCompute=function(){ _pc(); const p=myCard().pr; if(p){ S.prB.card=p*(galaOn()?1+GALA_K:1); S.prestige=Math.round((S.prestige+S.prB.card)*10)/10; } else delete S.prB.card; return S.prestige; }; }
PX_SRC.card='Carte bancaire';
{ const _gc=galaCost; galaCost=function(){ return _gc()*(1-(myCard().gala||0)); }; }
const luxTierOk = l => unlocked(Math.max(0,l.tier-(myCard().early?1:0)));
/* ---------- placements : dépôts à terme et obligations d'État ---------- */
const CTY_RISK={france:0,croatie:.6,espagne:.3,usa:0,bresil:2.5,chine:1.2};
const BOND_GR=[['AAA',80,.2,0],['AA',68,.5,.00001],['A',56,1,.00004],['BBB',44,1.9,.00012],['BB',32,3.6,.0004],['B',-99,6.5,.0012]];
function ctyStab(cid){ if(S.country&&S.country.id===cid) return S.country.sat; const P=cid===polHome()? {gov:S.gov} : polOf(cid); return (P.gov.stab+P.gov.pop)/2; }
const bondGrade = cid => BOND_GR.find(g=>ctyStab(cid)-10*CTY_RISK[cid]>=g[1]);
const bondRate = cid => Math.max(.5,S.macro.rate+bondGrade(cid)[2]);
const datRate = () => livretRate()+1.2;
const INV_D={dat:360,bond:1800};
function invest(k,cid,a){ a=Math.floor(+a||0); if(!(a>=1000)) return err('Montant minimum : 1 000 €.'); if(S.cash<a) return err('Trésorerie insuffisante.');
  const r= k==='dat'? datRate() : bondRate(cid); S.inv=S.inv||[];
  S.inv.push({id:S.nid++, k, c:k==='bond'?cid:null, p:a, r:Math.round(r*100)/100, d:S.day, end:S.day+INV_D[k]});
  payCap('inv',k==='dat'?'Dépôt à terme':'Obligations '+ctyName(cid),-a); return ok(); }
function invExit(id){ const x=(S.inv||[]).find(v=>v.id===id); if(!x) return err('Placement introuvable.');
  const back=x.p*(x.k==='dat'? .99 : .98); S.inv=S.inv.filter(v=>v!==x); payCap('inv','Sortie anticipée : '+(x.k==='dat'?'dépôt à terme':'obligations '+ctyName(x.c)),back); return ok(); }
function invStep(){ const L=S.inv||[]; if(!L.length) return; let i=0; const keep=[];
  L.forEach(x=>{ if(x.k==='bond'&&rnd()<bondGrade(x.c)[3]){ const back=x.p*.4; payCap('inv','Défaut de l’État : '+ctyName(x.c),back); log('crit',ctyName(x.c)+' fait défaut sur sa dette : vos obligations perdent 60 % ('+eur(x.p-back,0)+').'); return; }
    i+=x.p*x.r/100/360; if(S.day>=x.end){ payCap('inv',x.k==='dat'?'Échéance du dépôt à terme':'Remboursement des obligations '+ctyName(x.c),x.p); return; } keep.push(x); });
  S.inv=keep; if(i>0) pay('inv','Intérêts des placements',i,'cap'); }
const invTotal = () => (S.inv||[]).reduce((a,x)=>a+x.p,0);
ACT.invest=el=>{ const k=el.dataset.v, c=el.dataset.i||null, q=k==='dat'?'dat':'bond'; after(invest(k,c,ui.qty[q])); };
ACT.invexit=el=>after(invExit(+el.dataset.i));
/* ---------- abonnement et automatismes, chaque jour ---------- */
function acctStep(){ const c=myCard();
  if(c.fee){ const f=c.fee/30; if(S.bank&&S.bank.lic){ pay('bank','Abonnement de votre carte '+c.n,-f); pay('bank','Abonnements des clients',f,'corp'); } else pay('fees','Abonnement bancaire '+c.n,-f); }
  invStep();
  const keep=S.autoRes||0, free=S.cash-keep;
  if(S.autoR&&free>0){ let m=free; S.debts.slice().sort((a,b)=>b.r-a.r).forEach(d=>{ if(m<=0||d.r<6) return; const a=Math.min(m,d.p); repay(d.id,a); m-=a; }); }
  const free2=S.cash-keep; if(S.autoX&&keep>0&&free2>keep*.1){ S.livret.bal+=free2; payCap('livret','Placement automatique sur le livret',-free2); } }
ACT.autoset=el=>{ const k=el.dataset.v; S[k]=S[k]?0:1; render(); };
ACT.autores=()=>{ const v=Math.max(0,Math.floor(+ui.qty.ares||0)); S.autoRes=v; render(); };
/* ---------- écran ---------- */
function cardRow(){ const cur=S.card||0;
  return '<div class="cd-rail">'+CARDS.map((c,i)=>{ const ok2=cardOk(i), on=i===cur;
    const L=[c.loan&&'Intérêts d’emprunt −'+Math.round(c.loan*100)+' %',c.liv&&'Intérêts du livret +'+Math.round(c.liv*100)+' %',c.lux&&'Achats de luxe −'+Math.round(c.lux*100)+' %',c.gala&&'Galas −25 %',c.early&&'Biens de luxe un palier plus tôt',c.pr&&'Prestige +'+c.pr].filter(Boolean);
    return '<div class="cd-opt'+(on?' on':'')+(ok2?'':' lock')+'">'+(on?'<span class="cd-cur">Actuelle</span>':'')+cardSvg(i)+'<b>'+c.n+'</b><span class="cd-fee">'+(c.fee? eur(c.fee,0)+' / mois' : 'Gratuit')+'</span>'+
      '<ul>'+(L.length? L.map(x=>'<li>'+x+'</li>').join('') : '<li>Compte et carte de base</li>')+'</ul>'+
      (on? '' : btn(ok2?'Choisir':'Sur invitation','cardpick',{c:'sm'+(ok2?' pri':''),v:i,dis:!ok2,why:'Rang de prestige « '+(c.rank?PR_RANKS[c.rank][1]:'')+' » requis.'}))+'</div>'; }).join('')+'</div>'; }
const iRow=(t,s,r,act)=>'<div class="iv-r"><div class="iv-h"><span><b>'+t+'</b><small>'+s+'</small></span><span class="row" style="gap:10px;flex-wrap:nowrap;align-items:center"><b class="num pos">'+r+'</b>'+(act&&act.indexOf('<input')<0?act:'')+'</span></div>'+(act&&act.indexOf('<input')>=0?'<div class="iv-a">'+act+'</div>':'')+'</div>';
const invIn=(q,lab,v,i)=>'<input class="inp" inputmode="numeric" placeholder="Montant en €" data-q="'+q+'" value="'+(ui.qty[q]||'')+'">'+btn(lab,'invest',{c:'sm pri',v,i});
function invCard(){ const L=S.inv||[];
  let h='<div class="stack">'+iRow('Livret','Disponible à tout moment · '+eur(S.livret.bal,0),fmtN(livretRate()*(1+cardLiv()),2)+' %');
  h+=iRow('Dépôt à terme 1 an','Bloqué 360 jours, sortie anticipée −1 %',fmtN(datRate(),2)+' %',invIn('dat','Placer','dat'));
  h+='<div class="cg-h" style="margin-top:6px">Obligations d’État · 5 ans</div><div class="iv-a"><input class="inp" inputmode="numeric" placeholder="Montant à investir en €" data-q="bond" value="'+(ui.qty.bond||'')+'"></div>'+D.COUNTRIES.map(c=>{ const g=bondGrade(c.id);
    return iRow(ctyFlag(c.id).replace('width="54" height="36"','width="24" height="16"')+' '+esc(c.n),'Note '+g[0]+(g[3]>=.0004?' · risque de défaut':''),fmtN(bondRate(c.id),2)+' %',btn('Acheter','invest',{c:'sm',v:'bond',i:c.id})); }).join('');
  if(L.length) h+='<div class="cg-h" style="margin-top:6px">Vos placements</div>'+L.map(x=>iRow((x.k==='dat'?'Dépôt à terme':'Obligations '+esc(ctyName(x.c)))+' · '+eur(x.p,0),'Échéance dans '+plu(x.end-S.day,'jour'),fmtN(x.r,2)+' %',btn('Sortir','invexit',{c:'sm ghost',i:x.id}))).join('');
  return card('Placements',h+'</div>'); }
function autoCard(){ const sw=(k,t,s)=>'<div class="cg-r"><span>'+t+'<small>'+s+'</small></span><button class="sw'+(S[k]?' on':'')+'" data-a="autoset" data-v="'+k+'" aria-pressed="'+!!S[k]+'" aria-label="'+t+'"></button></div>';
  let h='<div class="stack"><div class="row sp"><span class="sub">Trésorerie à garder : <b>'+eur(S.autoRes||0,0)+'</b></span><span class="row" style="gap:6px"><input class="inp" style="width:120px" inputmode="numeric" placeholder="Montant" data-q="ares" value="'+(ui.qty.ares||'')+'">'+btn('Régler','autores',{c:'sm'})+'</span></div>'+
    sw('autoX','Placer l’excédent','Chaque jour, ce qui dépasse la trésorerie à garder va sur le livret')+sw('autoR','Rembourser les emprunts chers','Chaque jour, d’abord ceux au-dessus de 6 %, avec ce qui dépasse la trésorerie à garder')+'</div>';
  try{ h+=saveCard(); }catch(e){}
  return card('Automatismes',h); }
bkAccount=function(){ const G=crGrade(), d=debtTotal(), lim=debtLimit(), rt=debtRateEff(), intD=S.debts.reduce((a,x)=>a+x.p*x.r/100/360,0)*(1-cardLoan()), c=myCard();
  let h='<div class="cd-hero">'+cardSvg(S.card||0,S.cash)+'</div><div class="emp-k" style="margin:10px 0 12px"><div><div class="tag">Livret</div><b class="num">'+eur(S.livret.bal,0)+'</b></div><div><div class="tag">Placements</div><b class="num">'+eur(invTotal(),0)+'</b></div><div><div class="tag">Emprunts</div><b class="num">'+eur(d,0)+'</b></div></div>';
  if(S.cash<0) h+='<div class="notice bad">Compte à découvert : au-delà de 14 jours, c’est la faillite. Empruntez ou vendez des actifs.</div>';
  h+=card('Votre abonnement','<div class="sub" style="margin-bottom:8px">'+c.n+(c.fee?' · '+eur(c.fee,0)+' par mois'+(S.bank.lic?', payés à votre banque':'') : ' · gratuit')+'. Faites défiler pour comparer.</div>'+cardRow());
  h+=card('Note de crédit','<div class="bk-grade"><div class="bk-g g'+G[0]+'">'+G[0]+'</div><div class="stack" style="gap:4px;min-width:0"><b>'+({A:'Excellente',B:'Très bonne',C:'Correcte',D:'Fragile',E:'Risquée'}[G[0]])+'</b><div class="sub">Endettement : '+fmtN(crLev()*100,1)+' % de vos actifs bruts. Nouvel emprunt à <b>'+fmtN(rt,2)+' %</b>'+(c.loan?' (carte '+c.n+' : intérêts −'+Math.round(c.loan*100)+' %)':'')+'.</div></div></div>'+
    '<div class="bk-q" style="margin-top:10px">'+[[.1,'10 %'],[.25,'25 %'],[.5,'50 %'],[1,'Tout']].map(x=>'<button class="btn sm" data-a="borrowq" data-v="'+x[0]+'"'+(lim<1000?' aria-disabled="true" data-dis="1" data-why="Capacité d’emprunt épuisée."':'')+'>'+x[1]+'<small>'+eur(Math.floor(lim*x[0]/1000)*1000,0)+'</small></button>').join('')+'</div>'+
    (S.debts.length? '<div class="stack" style="margin-top:10px">'+S.debts.slice().sort((a,b)=>b.r-a.r).map(x=>'<div class="bk-loan"><div><b class="num">'+eur(x.p,0)+'</b><small>'+fmtN(x.r,2)+' % · '+eur(x.p*x.r/100/360*(1-cardLoan()),0)+' / j</small></div><div class="row">'+btn('Rembourser '+eur(Math.min(x.p,Math.max(0,S.cash)),0),'repay',{c:'sm',i:x.id,v:'part',dis:S.cash<=0})+btn('Tout','repay',{c:'sm ghost',i:x.id,v:'all',dis:S.cash<x.p})+'</div></div>').join('')+'<div class="sub">Intérêts : '+eur(intD,0)+' par jour.</div></div>' : ''));
  h+=card('Livret d’épargne','<div class="row"><label class="sr" for="in-liv">Montant</label><input class="inp w" id="in-liv" inputmode="numeric" placeholder="Montant en €" value="'+(ui.qty.liv||'')+'" data-q="liv">'+btn('Déposer','livdep',{c:'sm pri'})+btn('Retirer','livwd',{c:'sm'})+'</div>');
  return h+invCard()+autoCard(); };
(function(){ const st=document.createElement('style'); st.textContent=`
.cd-svg{display:block;width:100%;height:auto;border-radius:16px;box-shadow:0 18px 30px -14px rgba(0,0,0,.7)}
.cd-hero .cd-svg{max-width:420px;margin:0 auto}
.cd-shine{animation:cdshine 6s ease-in-out infinite}@keyframes cdshine{0%,60%{transform:translateX(-340px)}100%{transform:translateX(340px)}}
.cd-rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px;scrollbar-width:none}.cd-rail::-webkit-scrollbar{display:none}
.cd-opt{flex:0 0 78%;max-width:300px;scroll-snap-align:start;position:relative;padding:10px;border-radius:18px;background:var(--paper-2);border:2px solid transparent}.cd-opt.on{border-color:#F2C14E}.cd-opt.lock .cd-svg{filter:grayscale(.6) brightness(.8)}
.cd-opt b{display:block;font-size:16px;margin-top:10px}.cd-fee{color:#C9971F;font-weight:900;font-size:13px}.cd-opt ul{margin:6px 0 10px;padding-left:16px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.cd-cur{position:absolute;top:16px;right:16px;z-index:2;background:#F2C14E;color:#000;font:900 10px var(--f-body);padding:2px 8px;border-radius:9px}
.sw{width:46px;height:28px;border-radius:14px;background:var(--line);position:relative;border:0;flex:0 0 auto}.sw::after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left .2s}.sw.on{background:#2FBF71}.sw.on::after{left:21px}
.num.pos{color:var(--green)}
.iv-r{padding:10px 0;border-bottom:1px solid var(--line)}.iv-r:last-child{border:0}.iv-h{display:flex;justify-content:space-between;align-items:center;gap:10px}.iv-h>span:first-child{display:flex;flex-direction:column;font-weight:800}.iv-h small{font-weight:600;font-size:12px;color:var(--ink-3)}.iv-h svg{vertical-align:-3px;margin-right:6px}
.iv-a{display:flex;gap:8px;margin-top:8px}.iv-a .inp{flex:1;min-width:0}
@media (prefers-reduced-motion:reduce){.cd-shine{animation:none;opacity:0}}`; document.head.appendChild(st); })();

/* la rangée des cartes s'ouvre sur la carte actuelle */
{ const _r=render; render=function(){ const x=_r.apply(this,arguments); try{ const o=document.querySelector('.cd-opt.on'), r=o&&o.parentElement; if(r&&!r.dataset.sc){ r.dataset.sc=1; r.scrollLeft=o.offsetLeft-r.offsetLeft-8; } }catch(e){} return x; }; }
