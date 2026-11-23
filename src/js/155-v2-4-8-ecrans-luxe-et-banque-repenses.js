/* ============================================================
   V2.4.8 : ÉCRANS LUXE ET BANQUE REPENSÉS
   Luxe : carte de prestige (rang, progression, effets, gala), puis une vitrine par catégorie
   (vos biens, voitures, art, propriétés, yachts, monuments, pays) avec illustration, cours sur un an,
   achat, location et revente. Banque : « Mon compte » (solde, note de crédit, emprunts, livret,
   épargne) et « Ma banque » (la banque que vous pouvez fonder). Onglets : ui.lx, ui.bk (interface).
   ============================================================ */
const PX_TABS=[['mine','Vos biens'],['car','Voitures'],['art','Art'],['estate','Propriétés'],['yacht','Yachts'],['monument','Monuments'],['country','Pays']];
const PX_SRC={car:'Voitures',art:'Art',estate:'Propriétés',yacht:'Yachts',monument:'Monuments',coll:'Collection',home:'Résidences',prop:'Immobilier',gala:'Gala'};
const pxHash=s=>{ let h=7; for(const c of String(s)) h=(h*31+c.charCodeAt(0))>>>0; return h; };
const PX_PAL=['#C8352A','#1F4E8A','#2B7A4B','#C9A227','#6B3FA0','#222428','#E07A1F','#7F8C9A'];
/* illustrations génériques (aucun modèle ou œuvre réels) */
function pxArt(l){ const h=pxHash(l.id), col=PX_PAL[h%PX_PAL.length], W=320, H=120; let s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
  const sky=(a,b)=>'<defs><linearGradient id="pxs'+h+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#pxs'+h+')"/>';
  if(l.kind==='car'){ s+=sky('#BFD9F2','#EAF3FB')+'<rect y="92" width="'+W+'" height="28" fill="#5B6270"/><rect y="104" width="'+W+'" height="2" fill="#E8E3D0" opacity=".7"/>';
    const low=h%2, x=70; s+='<path d="M'+x+' 88 Q'+(x+8)+' 70 '+(x+40)+' 66 L'+(x+70)+' '+(low?54:50)+' Q'+(x+110)+' '+(low?46:42)+' '+(x+138)+' '+(low?56:52)+' L'+(x+168)+' 66 Q'+(x+186)+' 68 '+(x+184)+' 88 Z" fill="'+col+'"/>'+
      '<path d="M'+(x+76)+' 57 Q'+(x+108)+' 49 '+(x+132)+' 58 L'+(x+140)+' 66 L'+(x+68)+' 66 Z" fill="#26313f" opacity=".85"/>'+
      [x+40,x+146].map(c=>'<circle cx="'+c+'" cy="88" r="13" fill="#1b1d22"/><circle cx="'+c+'" cy="88" r="6" fill="#c9ced6"/>').join('')+'<rect x="'+(x+176)+'" y="74" width="8" height="4" rx="2" fill="#FFE9A8"/>'; }
  else if(l.kind==='art'){ s+='<rect width="'+W+'" height="'+H+'" fill="#EDE6DA"/><rect y="104" width="'+W+'" height="16" fill="#B89B74"/><rect x="104" y="10" width="112" height="86" fill="#B8892C"/><rect x="110" y="16" width="100" height="74" fill="#F4EEDF"/><clipPath id="pxc'+h+'"><rect x="110" y="16" width="100" height="74"/></clipPath><g clip-path="url(#pxc'+h+')">';
    const P=['#2F5D8A','#D9A441','#8E3B46','#3E7C59','#E7C9A0','#1E2A44','#C76B3B'];
    for(let i=0;i<9;i++){ const k=pxHash(l.id+'#'+i), cx=112+k%96, cy=18+(k>>5)%70, r=6+(k>>9)%16; s+= i%2? '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+P[k%P.length]+'" opacity=".8"/>' : '<path d="M'+(cx-r)+' '+cy+' q'+r+' -'+r+' '+(2*r)+' 0" stroke="'+P[k%P.length]+'" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>'; }
    s+='</g><rect x="146" y="98" width="28" height="4" fill="#8E7A55"/>'; }
  else if(l.kind==='estate'){ const v=l.id; s+=sky('#9FCBEA','#EAF5FB');
    if(v==='ile'){ s+='<rect y="78" width="'+W+'" height="42" fill="#2E8FB5"/><ellipse cx="160" cy="84" rx="90" ry="14" fill="#E9D7A6"/><path d="M170 80 Q172 52 180 40" stroke="#6B4A2B" stroke-width="4" fill="none"/>'+[-30,10,40,80,120].map(a=>'<path d="M180 40 q'+(Math.cos(a*Math.PI/180)*26)+' '+(-Math.sin(a*Math.PI/180)*10+8)+' '+(Math.cos(a*Math.PI/180)*34)+' '+(12-Math.sin(a*Math.PI/180)*4)+'" stroke="#2F7D3A" stroke-width="5" fill="none" stroke-linecap="round"/>').join('')+'<rect x="128" y="66" width="30" height="16" fill="#fff"/><path d="M124 67 L143 56 L162 67 Z" fill="#C8352A"/>'; }
    else if(v==='penth'){ s+='<rect y="100" width="'+W+'" height="20" fill="#7E8794"/>'+[[40,40],[90,20],[200,30],[250,50]].map(b=>'<rect x="'+b[0]+'" y="'+b[1]+'" width="38" height="'+(100-b[1])+'" fill="#9AA6B5"/>').join('')+'<rect x="140" y="8" width="44" height="92" fill="#36404D"/>'+[0,1,2,3,4,5,6,7].map(i=>'<rect x="146" y="'+(14+i*10)+'" width="32" height="5" fill="'+(i===0?'#FFD87A':'#7FA9CF')+'" opacity=".9"/>').join(''); }
    else if(v==='chateau'){ s+='<rect y="96" width="'+W+'" height="24" fill="#6E9E50"/><rect x="100" y="52" width="120" height="44" fill="#EDE6D6"/>'+[96,206].map(x=>'<rect x="'+x+'" y="38" width="18" height="58" fill="#E4DCC8"/><path d="M'+(x-3)+' 40 L'+(x+9)+' 18 L'+(x+21)+' 40 Z" fill="#3E4B5E"/>').join('')+'<path d="M98 54 L160 34 L222 54 Z" fill="#3E4B5E"/>'+[118,140,162,184].map(x=>'<rect x="'+x+'" y="64" width="10" height="16" fill="#7FA9CF"/>').join('')+'<rect x="154" y="80" width="12" height="16" fill="#6B4A2B"/>'; }
    else { s+='<rect y="96" width="'+W+'" height="24" fill="#2E8FB5"/><rect y="88" width="'+W+'" height="10" fill="#E9D7A6"/><rect x="100" y="54" width="120" height="36" fill="#FBF6EC"/><rect x="100" y="50" width="120" height="6" fill="#D96B3B"/>'+[112,140,168,196].map(x=>'<rect x="'+x+'" y="62" width="14" height="20" fill="#7FA9CF"/>').join('')+'<path d="M248 92 Q250 64 258 52" stroke="#6B4A2B" stroke-width="3" fill="none"/>'+[0,60,120,170].map(a=>'<path d="M258 52 q'+(Math.cos(a*Math.PI/180)*20)+' '+(-Math.sin(a*Math.PI/180)*8+6)+' '+(Math.cos(a*Math.PI/180)*26)+' 10" stroke="#2F7D3A" stroke-width="4" fill="none" stroke-linecap="round"/>').join(''); } }
  else if(l.kind==='yacht'){ s+=sky('#A9D3EE','#EFF7FC')+'<rect y="82" width="'+W+'" height="38" fill="#2A7FB0"/><path d="M0 88 Q40 84 80 88 T160 88 T240 88 T320 88" stroke="#fff" stroke-width="1.5" fill="none" opacity=".5"/>';
    const big=l.id==='mega', sail=l.id==='voilier', x=big?60:90, w=big?200:140;
    s+='<path d="M'+x+' 74 L'+(x+w)+' 74 L'+(x+w-18)+' 90 L'+(x+14)+' 90 Z" fill="#FAFAFA" stroke="#C9D3DD"/><rect x="'+x+'" y="80" width="'+w+'" height="3" fill="'+col+'"/>';
    if(sail) s+='<rect x="'+(x+70)+'" y="10" width="3" height="64" fill="#8A6A44"/><path d="M'+(x+74)+' 12 L'+(x+74)+' 70 L'+(x+120)+' 70 Z" fill="#fff"/><path d="M'+(x+68)+' 18 L'+(x+68)+' 70 L'+(x+34)+' 70 Z" fill="#F1F1F1"/>';
    else s+='<path d="M'+(x+30)+' 74 L'+(x+40)+' 60 L'+(x+w-50)+' 60 L'+(x+w-36)+' 74 Z" fill="#F4F4F4" stroke="#C9D3DD"/><rect x="'+(x+46)+'" y="64" width="'+(w-104)+'" height="5" fill="#26313f"/>'+(big?'<path d="M'+(x+60)+' 60 L'+(x+70)+' 48 L'+(x+w-80)+' 48 L'+(x+w-70)+' 60 Z" fill="#EDEDED" stroke="#C9D3DD"/><rect x="'+(x+76)+'" y="52" width="'+(w-160)+'" height="4" fill="#26313f"/>':''); }
  else { s+=sky('#F2D7A8','#FBF1DE')+'<rect y="98" width="'+W+'" height="22" fill="#C9A66B"/>'; const g='#7A5A3A';
    const M={bigben:'<rect x="146" y="22" width="28" height="78" fill="'+g+'"/><path d="M144 24 L160 4 L176 24 Z" fill="'+g+'"/><circle cx="160" cy="38" r="8" fill="#F6E7C1"/>',
      liberte:'<rect x="140" y="74" width="40" height="26" fill="'+g+'"/><path d="M152 74 L156 36 L166 36 L170 74 Z" fill="#5E9C8A"/><circle cx="161" cy="30" r="6" fill="#5E9C8A"/><path d="M166 32 L176 12" stroke="#5E9C8A" stroke-width="4"/><circle cx="177" cy="10" r="3" fill="#F2C94C"/>',
      eiffel:'<path d="M160 6 L176 100 L166 100 L160 60 L154 100 L144 100 Z" fill="'+g+'"/><rect x="148" y="66" width="24" height="4" fill="'+g+'"/><rect x="153" y="38" width="14" height="3" fill="'+g+'"/>',
      colisee:'<path d="M90 100 L90 46 Q160 30 230 46 L230 100 Z" fill="#D9B98A"/>'+[0,1,2].map(r=>[0,1,2,3,4,5,6].map(i=>'<rect x="'+(98+i*18)+'" y="'+(52+r*16)+'" width="9" height="11" rx="4" fill="#9C7A50"/>').join('')).join(''),
      taj:'<rect x="110" y="64" width="100" height="36" fill="#F6F2EA"/><path d="M130 64 Q160 14 190 64 Z" fill="#F6F2EA"/><rect x="157" y="16" width="6" height="10" fill="#E6DDCB"/>'+[100,214].map(x=>'<rect x="'+x+'" y="34" width="6" height="66" fill="#EFE8DA"/>').join('')+'<rect x="150" y="76" width="20" height="24" rx="10" fill="#D8CDB8"/>',
      pyramide:'<path d="M70 100 L130 34 L190 100 Z" fill="#D9B46A"/><path d="M130 34 L190 100 L150 100 Z" fill="#B8924E"/><path d="M170 100 L214 52 L258 100 Z" fill="#D9B46A"/><path d="M214 52 L258 100 L232 100 Z" fill="#B8924E"/>'};
    s+=M[l.id]||'<rect x="120" y="50" width="80" height="50" fill="'+g+'"/><path d="M114 52 L160 26 L206 52 Z" fill="'+g+'"/>'; }
  return s+'</svg>'; }
/* ---------- carte de prestige ---------- */
function pxHero(){ const p=S.prestige||0, r=prRank(p), nx=PR_RANKS[r+1], cur=PR_RANKS[r][0], f=nx? clamp((p-cur)/(nx[0]-cur),0,1) : 1, B=S.prB||{};
  const src=Object.keys(PX_SRC).filter(k=>(B[k]||0)>0).sort((a,b)=>B[b]-B[a]), tot=Math.max(1,src.reduce((a,k)=>a+B[k],0));
  const g=S.gala, gOn=galaOn(), gWait=g&&g.next>S.day, gc=galaCost();
  let h='<section class="card px-hero"><div class="px-top"><div class="px-medal" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5"/><circle cx="30" cy="30" r="27" fill="none" stroke="#FFC93C" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+(f*169.6).toFixed(1)+' 170" transform="rotate(-90 30 30)"/><text x="30" y="36" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" font-family="Baloo 2,Nunito,sans-serif">'+(r+1)+'</text></svg></div>'+
    '<div class="px-t"><small>Rang de prestige</small><b>'+esc(PR_RANKS[r][1])+'</b><span>'+fmtN(Math.round(p))+' points'+(nx? ' · encore '+fmtN(Math.ceil(nx[0]-p))+' pour « '+esc(nx[1])+' »' : ' · rang le plus haut')+'</span></div></div>'+
    '<div class="px-lad" aria-hidden="true">'+PR_RANKS.map((x,i)=>'<i class="'+(i<r?'d':i===r?'n':'')+'"></i>').join('')+'</div>';
  h+='<div class="px-eff"><div><small>Sociétés de luxe et hôtels</small><b>'+(r? '+'+fmtN(PR_SALES*r*100,1)+' % de ventes' : 'aucun bonus')+'</b></div><div><small>Taux des emprunts</small><b>'+(r? '−'+fmtN(PR_RATE*r,1)+' point' : 'aucun bonus')+'</b></div><div><small>Réputation</small><b>+'+fmtN(.3*Math.sqrt(Math.max(0,p)),1)+'</b></div><div><small>Influence politique</small><b>'+(p>0? 'en hausse' : 'aucune')+'</b></div></div>';
  if(src.length) h+='<div class="px-bar">'+src.map((k,i)=>'<i style="width:'+(B[k]/tot*100).toFixed(1)+'%;background:'+['#FFC93C','#8ff0bf','#9fd0e6','#ffb3a8','#c6b3ff','#F2A93B','#7FD88C','#E8E3D0','#fff'][i%9]+'"></i>').join('')+'</div><div class="px-src">'+src.map((k,i)=>'<span><i style="background:'+['#FFC93C','#8ff0bf','#9fd0e6','#ffb3a8','#c6b3ff','#F2A93B','#7FD88C','#E8E3D0','#fff'][i%9]+'"></i>'+PX_SRC[k]+' '+fmtN(Math.round(B[k]))+'</span>').join('')+'</div>';
  else h+='<div class="px-none">Achetez une voiture, une œuvre, une propriété ou un objet aux enchères pour gagner vos premiers points.</div>';
  h+='<div class="px-gala"><div><b>Gala de prestige</b><small>'+(gOn? 'En cours jusqu’au '+dateL(g.until)+' : prestige +'+Math.round(GALA_K*100)+' %.' : gWait? 'Prochain gala possible le '+dateL(g.next)+'.' : 'Prestige +'+Math.round(GALA_K*100)+' % pendant '+GALA_D+' jours, réputation +1,5. Un tous les '+GALA_CD+' jours.')+'</small></div>'+
    (gOn||gWait? '' : btn('Organiser · '+eur(gc,0),'galago',{c:'sm px-gb',dis:S.cash<gc||!(S.prestige>0),why:!(S.prestige>0)?'Il faut au moins un bien de prestige.':'Trésorerie insuffisante.'}))+'</div>';
  return h+'</section>'; }
ACT.galago=()=>after(galaHold());
ACT.lxtab=el=>{ ui.lx=el.dataset.v; render(); };
/* ---------- vitrine ---------- */
function pxItem(l){ const own=S.lux.find(o=>o.id===l.id), lock=!unlocked(l.tier)&&!own, bp=luxBuyPrice(l), sp=luxSellPrice(l), v=S.luxVal[l.id], H=(S.luxH&&S.luxH[l.id])||[], ch=H.length>1? v/H[0]-1 : 0, up=v*l.up*(1+.03*tierNow());
  let h='<section class="card px-it'+(own?' own':'')+(lock?' lock':'')+'"><div class="px-im">'+pxArt(l)+(own? '<span class="px-tag ok">'+(own.rent?'Loué':'À vous')+'</span>' : lock? '<span class="px-tag">Palier '+esc(D.TIERS[l.tier].n)+'</span>' : '')+'<span class="px-pr">+'+l.pr+'</span></div>'+
    '<div class="px-b"><div class="px-n"><b>'+esc(l.n)+'</b><small>'+esc(D.LUX_KIND[l.kind])+' · prestige +'+l.pr+(own&&own.rent?' (moitié en location)':'')+'</small></div>'+
    '<div class="px-v"><div><small>Cote</small><b class="num">'+eur(v,0)+'</b>'+(H.length>1? '<small class="num '+cls(ch)+'">'+(ch>=0?'+':'')+fmtN(ch*100,1)+' % sur '+(H.length>=52?'un an':plu(H.length*7,'jour'))+'</small>' : '')+'</div>'+(H.length>2? '<div class="px-sp">'+spark(H.concat([v]),96,30)+'</div>' : '')+'</div>';
  if(own){ const gain=sp-(own.paid||bp);
    h+='<div class="px-k"><span>Entretien <b class="num">'+eur(up,0)+' / j</b></span><span>Si vendu <b class="num '+cls(gain)+'">'+eur(sp,0)+'</b></span></div>';
    if(luxRentable(l)) h+='<div class="px-rent"><span><b>Location</b><small>'+(own.rent? '+'+eur(luxRentDay(l),0)+' par jour, prestige divisé par deux' : 'rapporterait '+eur(luxRentDay(l),0)+' par jour')+'</small></span>'+btn(own.rent?'Arrêter':'Louer','luxrent',{c:'sm',i:l.id,v:own.rent?0:1})+'</div>';
    h+='<div class="px-a">'+btn('Revendre · '+eur(sp,0),'sellux',{c:'sm',i:l.id})+'</div>'; }
  else if(!lock) h+='<div class="px-k"><span>Entretien <b class="num">'+eur(v*l.up*(1+.03*tierNow()),0)+' / j</b></span><span>Revente <b>−'+Math.round(l.spread*100)+' %</b></span></div><div class="px-a">'+btn('Acheter · '+eur(bp,0),'buylux',{c:'sm pri',i:l.id,dis:S.cash<bp,why:'Trésorerie insuffisante : il manque '+eur(bp-S.cash,0)+'.'})+'</div>';
  return h+'</div></section>'; }
const _vLuxeOld=vLuxe;
vLuxe=function(){ const mine=S.lux.length>0; let t=ui.lx||(mine?'mine':'car'); if(t==='mine'&&!mine) t='car'; let val=0; S.lux.forEach(o=>val+=S.luxVal[o.id]||0);
  let h=head('Luxe et prestige','', '<span class="pill">Patrimoine '+eur(val,0)+'</span>');
  h+=pxHero();
  if(S.laws.luxTax>0) h+='<div class="notice">Taxe somptuaire en vigueur : +'+pct(S.laws.luxTax,0)+' sur tous les achats de luxe.</div>';
  if(tierNow()<3) h+='<div class="notice">Le marché du luxe s’ouvre au palier <b>Magnat</b> ('+eur(D.TIERS[3].nw,0)+'). Les biens ci-dessous sont des aperçus.</div>';
  h+='<div class="px-tabs" role="tablist">'+PX_TABS.filter(x=>x[0]!=='mine'||mine).map(x=>{ const n= x[0]==='mine'? S.lux.length : x[0]==='country'? 0 : S.lux.filter(o=>{ const l=D.LUX.find(y=>y.id===o.id); return l&&l.kind===x[0]; }).length;
    return '<button role="tab" aria-selected="'+(t===x[0])+'" class="'+(t===x[0]?'on':'')+'" data-a="lxtab" data-v="'+x[0]+'">'+x[1]+(n&&x[0]!=='mine'?' <i>'+n+'</i>':'')+'</button>'; }).join('')+'</div>';
  if(t==='country'){ const o=_vLuxeOld(), k=o.indexOf('<div class="cat-h">Pays entiers</div>'); h+= k>=0? o.slice(k+'<div class="cat-h">Pays entiers</div>'.length) : ''; return h; }
  const L= t==='mine'? D.LUX.filter(l=>S.lux.some(o=>o.id===l.id)) : D.LUX.filter(l=>l.kind===t);
  h+='<div class="px-list">'+L.map(pxItem).join('')+'</div>';
  if(t==='mine'&&S.auc&&S.auc.coll&&S.auc.coll.length) h+='<div class="notice info">Vos '+plu(S.auc.coll.length,'objet')+' de collection (prestige +'+fmtN(Math.round((S.prB||{}).coll||0))+') se gèrent dans la '+'<button class="lnk" data-a="tab" data-i="auction">salle des ventes</button>.</div>';
  return h; };
VIEWS.luxe=vLuxe;
/* ---------- banque ---------- */
ACT.bktab=el=>{ ui.bk=el.dataset.v; render(); };
ACT.borrowq=el=>{ const a=Math.floor(debtLimit()*(+el.dataset.v)/1000)*1000; if(a<=0) return toast('Capacité d’emprunt épuisée.'); ask('Emprunter '+eur(a,0),'Taux fixe de <b>'+fmtN(debtRate(),2)+' %</b> par an, soit '+eur(a*debtRate()/100/360,0)+' d’intérêts par jour. Remboursable à tout moment, sans frais.','Emprunter',()=>after(borrow(a))); };
function bkAccount(){ const G=crGrade(), lev=crLev(), d=debtTotal(), lim=debtLimit(), rt=debtRate(), intD=S.debts.reduce((a,x)=>a+x.p*x.r/100/360,0), livD=S.livret.bal*livretRate()/100/360, r=prRank();
  let h='<section class="bk-cardv"><div class="bk-chip"></div><div class="bk-brand">IDLE BUSINESS · COMPTE COURANT</div><small>Solde disponible</small><b class="num'+(S.cash<0?' neg':'')+'">'+eur(S.cash,0)+'</b>'+
    '<div class="bk-row"><span><small>Livret</small>'+eur(S.livret.bal,0)+'</span><span><small>Emprunts</small>'+eur(d,0)+'</span><span><small>Note</small><em class="g'+G[0]+'">'+G[0]+'</em></span></div></section>';
  if(S.cash<0) h+='<div class="notice bad">Compte à découvert : au-delà de 14 jours, c’est la faillite. Empruntez ou vendez des actifs.</div>';
  h+=card('Note de crédit','<div class="bk-grade"><div class="bk-g g'+G[0]+'">'+G[0]+'</div><div class="stack" style="gap:4px;min-width:0"><b>'+({A:'Excellente',B:'Très bonne',C:'Correcte',D:'Fragile',E:'Risquée'}[G[0]])+'</b><div class="sub">Endettement : '+fmtN(lev*100,1)+' % de vos actifs bruts. La note suit l’endettement ; votre rang de prestige baisse encore le taux.</div></div></div>'+
    '<div class="bk-scale">'+CR_G.map(x=>'<span class="'+(x[0]===G[0]?'on ':'')+'g'+x[0]+'">'+x[0]+'<small>+'+fmtN(x[2],2)+'</small></span>').join('')+'</div>'+
    '<div class="bk-rate"><span>Taux directeur <b>'+fmtN(S.macro.rate,2)+' %</b></span><span>Prime de la note <b>+'+fmtN(G[2],2)+'</b></span>'+(r? '<span>Prestige <b>−'+fmtN(PR_RATE*r,1)+'</b></span>' : '')+'<span class="t">Nouvel emprunt <b>'+fmtN(rt,2)+' %</b></span></div>');
  h+=card('Emprunter','<div class="stack"><div class="row sp"><span class="sub">Capacité disponible</span><b class="num">'+eur(lim,0)+'</b></div>'+bar(clamp(d/Math.max(1,d+lim),0,1),lev>.4?'r':lev>.25?'a':'g')+
    '<div class="bk-q">'+[[.1,'10 %'],[.25,'25 %'],[.5,'50 %'],[1,'Tout']].map(x=>'<button class="btn sm" data-a="borrowq" data-v="'+x[0]+'"'+(lim<1000?' aria-disabled="true" data-dis="1" data-why="Capacité d’emprunt épuisée."':'')+'>'+x[1]+'<small>'+eur(Math.floor(lim*x[0]/1000)*1000,0)+'</small></button>').join('')+'</div>'+
    '<div class="row"><label class="sr" for="in-bor">Montant</label><input class="inp w" id="in-bor" inputmode="numeric" placeholder="Autre montant en €" data-q="bor" value="'+(ui.qty.bor||'')+'">'+btn('Emprunter','borrow',{c:'sm pri'})+'</div>'+
    '<div class="sub">Taux fixe à la signature, intérêts payés chaque jour, remboursement libre et sans frais.</div></div>');
  h+=card('Vos emprunts'+(S.debts.length?' ('+S.debts.length+')':''), S.debts.length? '<div class="stack">'+S.debts.slice().sort((a,b)=>b.r-a.r).map(x=>'<div class="bk-loan"><div><b class="num">'+eur(x.p,0)+'</b><small>'+fmtN(x.r,2)+' % · '+eur(x.p*x.r/100/360,0)+' / j · depuis le '+dateS(x.d||1)+'</small></div><div class="row">'+btn('Rembourser '+eur(Math.min(x.p,Math.max(0,S.cash)),0),'repay',{c:'sm',i:x.id,v:'part',dis:S.cash<=0})+btn('Tout','repay',{c:'sm ghost',i:x.id,v:'all',dis:S.cash<x.p})+'</div></div>').join('')+'</div><div class="sub" style="margin-top:8px">Intérêts : '+eur(intD,0)+' par jour. Remboursez d’abord les taux les plus élevés.</div>' : '<div class="sub">Aucun emprunt en cours.</div>');
  h+=card('Livret d’épargne','<div class="stack"><div class="mini"><div><span>Solde</span><b class="num">'+eur(S.livret.bal,0)+'</b></div><div><span>Taux annuel</span><b>'+fmtN(livretRate(),2)+' %</b></div><div><span>Intérêts</span><b class="num">'+eur(livD,0)+' / j</b></div></div>'+
    '<div class="row"><label class="sr" for="in-liv">Montant</label><input class="inp w" id="in-liv" inputmode="numeric" placeholder="Montant en €" value="'+(ui.qty.liv||'')+'" data-q="liv">'+btn('Déposer','livdep',{c:'sm pri'})+btn('Retirer','livwd',{c:'sm'})+'</div></div>');
  try{ h+=saveCard(); }catch(e){}
  return h; }
const _vBankOld=vBank;
function bkApps(){ const B=S.bank; if(!B.apps.length) return '<div class="sub">Aucun dossier en attente.</div>';
  return '<div class="stack">'+B.apps.map(a=>{ const r=appRate(a), refus=r>a.max; return '<div class="bk-app"><div class="hd"><b>'+esc(a.n)+'</b><span class="pill '+(a.g<='B'?'good':a.g==='C'?'warn':'bad')+'">Note '+a.g+'</span></div><small>'+esc(a.lab)+' · '+eur(a.amt,0)+' sur '+a.term+' jours · garantie '+a.c+' %</small><small>Taux proposé <b class="'+(refus?'neg':'')+'">'+r.toFixed(1)+' %</b> · accepte jusqu’à '+a.max.toFixed(1)+' %</small><div class="row">'+btn('Accorder','bankacc',{c:'sm pri',i:a.id,dis:!bankOpen()||refus,why:refus?'Taux trop élevé pour ce client.':'Agences fermées le week-end.'})+btn('Refuser','bankref',{c:'sm ghost',i:a.id})+'</div></div>'; }).join('')+'</div>'; }
function bkOwn(){ let h=_vBankOld(); if(h.indexOf('<div class="ph">')===0){ const e=h.indexOf('</div></div>'); if(e>0) h=h.slice(e+12); }
  h=h.replace(/<div class="tw"><table class="tbl"><thead><tr><th>Client<\/th>[\s\S]*?<\/table><\/div>/,bkApps());
  if(!S.bank.lic) h='<div class="notice info">Fonder votre propre banque est un métier à part : vous collectez des dépôts et prêtez à des clients. Pour emprunter vous-même, utilisez « Mon compte ».</div>'+h;
  return h; }
vBank=function(){ const t=ui.bk||'acc'; let h=head('Banque','');
  h+='<div class="px-tabs bk-tabs" role="tablist">'+[['acc','Mon compte'],['own',S.bank.lic?'Ma banque':'Fonder une banque']].map(x=>'<button role="tab" aria-selected="'+(t===x[0])+'" class="'+(t===x[0]?'on':'')+'" data-a="bktab" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
  return h+(t==='own'? bkOwn() : bkAccount()); };
VIEWS.bank=vBank;
try{ TIP1.bank='Banque : votre compte, votre note de crédit, vos emprunts et votre épargne. L’onglet voisin permet de fonder votre propre banque.'; TIP1.luxe='Luxe : chaque bien donne du prestige ; votre rang de prestige augmente les ventes de vos sociétés de luxe et baisse vos taux d’emprunt.'; }catch(e){}

/* V2.5.2 : plus de message de confirmation quand on recrute, cherche ou renouvelle des candidats.
   V2.5.3 : plus aucun message de confirmation nulle part ; seuls les refus et erreurs s'affichent. */
const QUIET_ACT=['hire','hirefill','candrefresh','aghire','agsearch','agrefresh'], QUIET_MET={resto:['chef'],couture:['hire']};
let resQuiet=0;
{ const _res=res; res=function(r,m){ if(r&&r.ok) return r; return _res(r,m); }; }
{ const _t=toast; toast=function(m,c){ if(c==='good') return; return _t.apply(this,arguments); }; }
const quietly=f=>function(){ resQuiet++; try{ return f.apply(this,arguments); } finally{ resQuiet--; } };
QUIET_ACT.forEach(k=>{ if(ACT[k]) ACT[k]=quietly(ACT[k]); });
{ const _met=ACT.met; ACT.met=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i), L=b&&QUIET_MET[b.def]; return (L&&L.includes(el.dataset.v)? quietly(_met) : _met)(el); }; }



