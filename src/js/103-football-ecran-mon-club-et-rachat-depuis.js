/* ============================================================
   FOOTBALL : écran « Mon club » et rachat depuis la fiche d'un club
   Onglets : Aperçu, Effectif, Tactique, Mercato, Staff, Finances.
   ============================================================ */
ICON.club='<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>';
MENU.splice(MENU.findIndex(x=>x[0]==='foot')+1,0,['club','Mon club','']);
NAVSHORT.club='Mon club';
MGROUPS.find(g=>g[0]==='Sport')[1].push('club');
MDESC.club='Votre club : effectif, matchs, mercato';

const FC_TABS=[['ov','Aperçu'],['sq','Effectif'],['tac','Tactique'],['mk','Mercato'],['st','Staff'],['fin','Finances']];
const fcStars = n => '<span class="fc-stars">'+[1,2,3,4,5].map(i=>'<i class="'+(i<=n?'on':'')+'"></i>').join('')+'</span>';

function vClub(){
  footInit(); const O=fcOwn();
  let h=head('Mon club');
  if(!O){
    return h+card('Aucun club pour l’instant','<p style="margin-top:0">Le club est la plus grosse dépense du jeu. Choisissez-en un dans <b>Football</b> : touchez son nom pour ouvrir sa fiche, puis « Racheter ce club ».</p>'+
      '<div class="tag">Prix indicatifs</div><div class="sub">Troisième division : quelques millions à 20 M€. Deuxième division : 20 à 80 M€. Première division : 100 M€ à plus d’1 Md€ pour les plus grands.</div>'+
      '<div style="margin-top:12px">'+btn('Voir les championnats','tab',{i:'foot',c:'pri'})+'</div>');
  }
  ui.ct=ui.ct&&FC_TABS.some(t=>t[0]===ui.ct)? ui.ct : 'ov';
  const c=footClub(O.id), lid=footLgOf(O.id), L=FOOT_LEAGUES.find(x=>x.id===lid);
  h+='<div class="fc-top">'+footCrest(c,56)+'<div><b>'+esc(c.n)+'</b><small>'+esc(L.n)+' · '+esc(FOOT_NAT[c.nat].n)+'</small></div>'+(function(){ const u=fcUpcoming(O); return u? '<span class="pill info fc-cdp">'+(u.start?'Saison':'Match')+' : '+fcCountdown(u.day).toLowerCase()+'</span>' : ''; })()+'</div>';
  h+='<div class="ft-nav"><div class="seg">'+FC_TABS.map(([k,t])=>'<button class="'+(ui.ct===k?'on':'')+'" data-a="fctab" data-v="'+k+'">'+t+(k==='mk'&&O.offers.length?' ('+O.offers.length+')':'')+(k==='sq'&&(O.yprop||[]).length?' · '+O.yprop.length+' jeune'+(O.yprop.length>1?'s':''):'')+'</button>').join('')+'</div></div>';
  return h+({ov:fcTabOv,sq:fcTabSq,tac:fcTabTac,mk:fcTabMk,st:fcTabSt,ds:fcTabDs,fin:fcTabFin}[ui.ct])(O);
}
VIEWS.club=vClub;

function fcNextMatch(O){
  const lid=footLgOf(O.id), lg=S.foot.lg[lid], nat=footClub(O.id).nat;
  if(!S.foot.nat[nat].on||lg.rd>=lg.dates.length) return null;
  const gi=lg.grp.findIndex(g=>g.includes(O.id)), m=(footFixtures(lg.grp[gi],footCycles(lid))[lg.rd]||[]).find(p=>p.includes(O.id));
  return m? {h:m[0],a:m[1],day:lg.dates[lg.rd]} : null;
}
/* prochain match toutes compétitions (championnat, coupe nationale, coupes internationales) */
function fcUpcoming(O){
  const id=O.id, nat=footClub(id).nat, out=[], nx=fcNextMatch(O);
  if(nx) out.push(Object.assign({comp:FOOT_LEAGUES.find(x=>x.id===footLgOf(id)).n},nx));
  const C=S.foot.cup[nat];
  if(C&&!C.champ&&C.dates[C.ri]!==undefined&&(C.alive.includes(id)||(C.ri<=1&&C.byes.includes(id)&&C.ri===1)))
    out.push({comp:'Coupe nationale, '+footCupRoundName(C,C.ri).toLowerCase(), day:C.dates[C.ri], draw:true});
  fiClubComps(id).forEach(k=>{ const E=S.foot.ic[k]; if(!E) return;
    if(E.phase==='lp'){ const d=E.P.lp.dates[E.ri], m=(E.rounds[E.ri]||[]).find(x=>x.includes(id)); if(d!==undefined&&m) out.push({comp:FI[k].n, day:d, h:m[0], a:m[1]}); }
    else if(E.phase==='ko'){ const st=E.P.ko[E.ki], t=E.ko&&E.ko.ties&&E.ko.ties.find(x=>x.includes(id)&&!x.w); if(st&&t){ const leg=E.leg||0, two=st.d.length>1; out.push({comp:FI[k].n+', '+st.n.toLowerCase()+(two?(leg?' (retour)':' (aller)'):''), day:st.d[leg], h:two&&leg===0?t[1]:t[0], a:two&&leg===0?t[0]:t[1]}); } }
  });
  const r=out.filter(x=>x.day>=S.day).sort((a,b)=>a.day-b.day)[0]; if(r) return r;
  const N=S.foot.nat[nat]; if(!N.on&&N.start>=S.day) return {comp:'Reprise du championnat', day:N.start, start:true};
  return null;
}
function fcCountdown(day){ const n=day-S.day; return n<=0? 'Aujourd’hui' : n===1? 'Demain' : 'Dans '+n+' jours'; }
function fcTabOv(O){
  const lid=footLgOf(O.id), lg=S.foot.lg[lid], gi=Math.max(0,lg.grp.findIndex(g=>g.includes(O.id))), tab=footTable(lid,gi), pos=tab.findIndex(x=>x.id===O.id), t=lg.tab[O.id]||[0,0,0,0,0,0,0];
  const nx=fcNextMatch(O), f=(lg.form[O.id]||'').split('').filter(Boolean), r=Math.round(fcStrength()), hid=!!(O.last&&!O.last.seen);
  let h=card('',
    '<div class="met-k"><div><span>Classement</span>'+(hid? '<b class="num">-</b><small>Regardez le dernier match</small></div>' : '<b class="num">'+(t[0]?(pos+1)+(pos?'e':'er'):'-')+'</b><small>'+t[6]+' points en '+t[0]+' matchs</small></div>')+
    '<div><span>Force</span><b class="num">'+r+' / 100</b><small>'+esc(FC_FORM[O.form]?O.form:'')+' · '+FC_STYLE[O.style].n.toLowerCase()+'</small></div>'+
    '<div><span>Moral</span><b class="num">'+Math.round(O.mor)+' / 100</b><small>'+(O.mor>=75?'Excellent':O.mor>=55?'Bon':O.mor>=40?'Fragile':'Au plus bas')+'</small></div>'+
    '<div><span>Valeur du club</span><b class="num">'+eur(fcClubValue(O.id),0)+'</b><small>'+O.sq.length+' joueurs</small></div></div>'+
    (f.length&&!hid? '<div class="tag">Forme</div><div class="ft-form">'+f.map(x=>'<i class="'+(x==='V'?'w':x==='D'?'l':'d')+'">'+x+'</i>').join('')+'</div>' : ''));
  let m='';
  const up=fcUpcoming(O);
  if(up) m+='<div class="fc-cd"><div><span>'+(up.start?'Début de saison':'Prochain match')+'</span><b class="num">'+fcCountdown(up.day)+'</b><small>'+esc(up.comp)+' · '+footDateLabel(up.day,{wd:1,noY:1})+'</small></div></div>'+(up.start? '<div class="sub">'+footStatus(footClub(O.id).nat,lid)+'</div>' : up.draw? '<div class="sub">Adversaire tiré au sort le jour du match.</div>' : ffix(up.h,up.a));
  else m+='<div class="sub">'+footStatus(footClub(O.id).nat,lid)+'</div>';
  if(O.last) m+='<div class="tag">Dernier match</div>'+fres({h:O.last.h,a:O.last.a,gh:O.last.gh,ga:O.last.ga},O.last.day);
  m+='<label class="fc-tg"><span>Ouvrir chaque match de mon équipe en direct</span><input type="checkbox" data-a="fcset" data-i="live" '+(O.autoLive?'checked':'')+' aria-label="Ouvrir chaque match de mon équipe en direct"></label>';
  h+=card('Matchs',m);
  if(O.news.length) h+=card('Actualités du club',O.news.slice(0,8).map(n=>'<div class="fc-news '+(n.c==='bad'?'neg':n.c==='good'?'pos':'')+'"><span class="num">'+footDateLabel(n.d,{noY:1})+'</span>'+esc(n.t)+'</div>').join(''));
  return h;
}
function fcPlRow(O,p,extra){
  const inj=p.inj>0? ' <span class="pill bad">Blessé '+p.inj+' j</span>' : '', lst=(O.list[p.id]? ' <span class="pill info">À vendre</span>' : '')+(O.keep&&O.keep[p.id]? ' <span class="pill good">Intouchable</span>' : '');
  return '<button class="fc-pl" data-a="fcpl" data-i="'+esc(p.id)+'"><span class="fpos">'+FOOT_POS_S[p.p]+'</span><span class="nm"><b>'+esc(p.n)+inj+lst+'</b><small>'+p.a+' ans · '+esc(FOOT_NATNAME[p.nat]||p.nat)+(extra?' · '+extra:'')+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>';
}
function fcTabSq(O){
  const groups=[['Gardiens',['G']],['Défenseurs',['DL','DC']],['Milieux',['MD','MC','MO']],['Attaquants',['AIL','BU']]];
  const wages=O.sq.reduce((s,p)=>s+p.w,0);
  return card('Effectif ('+O.sq.length+' joueurs)','<div class="sub">Masse salariale : '+eur(wages,0)+' par saison. Touchez un joueur pour le placer sur la liste des transferts ou résilier son contrat.</div>'+
    groups.map(([g,ps])=>'<div class="tag">'+g+'</div>'+O.sq.filter(p=>ps.includes(p.p)).sort((a,b)=>b.o-a.o).map(p=>fcPlRow(O,p,eur(fcPlayerValue(p),0))).join('')).join(''));
}
function fcTabTac(O){
  const L=fcLineup();
  let h=card('Système et style',
    '<div class="tag">Système</div><div class="seg">'+Object.keys(FC_FORM).map(f=>'<button class="'+(O.form===f?'on':'')+'" data-a="fcset" data-i="form" data-v="'+f+'">'+f+'</button>').join('')+'</div>'+
    '<div class="tag">Style de jeu</div><div class="seg">'+Object.entries(FC_STYLE).map(([k,s])=>'<button class="'+(O.style===k?'on':'')+'" data-a="fcset" data-i="style" data-v="'+k+'">'+s.n+'</button>').join('')+'</div>'+
    '<div class="sub" style="margin-top:6px">Offensif : plus de buts marqués, mais plus de buts encaissés. Défensif : l’inverse.</div>'+
    '<div class="tag">Composition</div><div class="seg"><button class="'+(O.auto?'on':'')+'" data-a="fcset" data-i="auto" data-v="1">L’entraîneur choisit</button><button class="'+(!O.auto?'on':'')+'" data-a="fcset" data-i="auto" data-v="0">Je choisis</button></div>');
  const pen=fcFitPenalty(L.xi);
  h+=card('Onze de départ · force '+Math.round(fcStrength()),
    (pen>.5? '<div class="notice warn">Des joueurs jouent hors de leur poste : l’équipe perd en efficacité.</div>' : '')+
    L.xi.map((p,i)=>'<div class="fc-slot"><span class="fpos">'+FOOT_POS_S[p.slot]+'</span>'+fcPlRow(O,p,p.p!==p.slot? 'joue hors poste ('+FOOT_POS_S[p.p]+')' : '')+'<button class="btn sm ghost" data-a="fcslot" data-i="'+i+'">Changer</button></div>').join('')+
    '<div class="tag">Remplaçants</div>'+L.bench.sort((a,b)=>b.o-a.o).map(p=>fcPlRow(O,p)).join(''));
  return h;
}
function fcTabMk(O){
  const W=fcWindow(S.day); let h='';
  h+=card('Mercato', W? '<div class="notice good">'+W.n+' ouvert jusqu’au '+footDateLabel(W.b,{noY:1})+'.</div>' : '<div class="notice">Le mercato est fermé. Prochaine ouverture le '+footDateLabel(fcNextWindow(S.day))+'.</div>'+'<div class="sub">Vous pouvez déjà repérer des joueurs.</div>');
  if(O.offers.length) h+=card('Offres reçues',O.offers.map(o=>{ const p=O.sq.find(x=>x.id===o.pid); if(!p) return ''; return '<div class="fc-off">'+fcrest(o.club,28)+'<div><b>'+esc(footName(o.club))+'</b><small>'+esc(p.n)+' · '+eur(o.fee,0)+' (valeur '+eur(fcPlayerValue(p),0)+')</small></div><div class="row">'+btn('Accepter','fcoffer',{i:o.id,v:1,c:'sm pri'})+btn('Refuser','fcoffer',{i:o.id,v:0,c:'sm ghost'})+'</div></div>'; }).join(''));
  ui.fmk=ui.fmk||{pos:'',max:2e7,min:0};
  const F=ui.fmk, caps=[[2e6,'2 M€'],[1e7,'10 M€'],[2e7,'20 M€'],[6e7,'60 M€'],[0,'Sans limite']];
  const list=fcMarket({pos:F.pos||null, max:F.max||Infinity, min:F.min, all:F.all});
  h+=card('Chercher un joueur',
    '<div class="tag">Poste</div><div class="seg fc-scroll">'+[['','Tous']].concat(Object.keys(FOOT_POS).map(k=>[k,FOOT_POS_S[k]])).map(([k,t])=>'<button class="'+(F.pos===k?'on':'')+'" data-a="fcmk" data-i="pos" data-v="'+k+'">'+t+'</button>').join('')+'</div>'+
    '<div class="tag">Valeur maximale</div><div class="seg fc-scroll">'+caps.map(([v,t])=>'<button class="'+(F.max===v?'on':'')+'" data-a="fcmk" data-i="max" data-v="'+v+'">'+t+'</button>').join('')+'</div>'+
    '<div class="tag">Joueurs</div><div class="seg"><button class="'+(!F.all?'on':'')+'" data-a="fcmk" data-i="all" data-v="0">Prêts à venir</button><button class="'+(F.all?'on':'')+'" data-a="fcmk" data-i="all" data-v="1">Tous</button></div>'+
    (list.length? list.map(x=>'<button class="fc-pl" data-a="fcscout" data-i="'+esc(x.p.id)+'" data-j="'+x.club+'"><span class="fpos">'+FOOT_POS_S[x.p.p]+'</span><span class="nm"><b>'+esc(x.p.n)+'</b><small>'+esc(footName(x.club))+' · '+x.p.a+' ans · '+eur(x.v,0)+(O?' · envie '+Math.round(fcWillJoin(x.p)*100)+' %':'')+'</small></span><b class="num fov">'+Math.round(x.p.o)+'</b></button>').join('') : '<div class="sub">Aucun joueur avec ces critères.</div>'));
  return h;
}
function fcTabSt(O){
  return card('Staff technique',Object.entries(FC_STAFF).map(([k,s])=>{ const l=O.staff[k], fee=[0,2e5,6e5,1.5e6,4e6,1e7][l+1];
    return '<div class="fc-staff"><div><b>'+s.n+'</b> '+fcStars(l)+'<small>'+s.d+' Salaire : '+eur([0,1.5e5,4e5,1e6,2.5e6,6e6][l],0)+' par saison.</small></div>'+(l<5? btn('Recruter mieux : '+eur(fee,0),'fcstaff',{i:k,c:'sm',dis:S.cash<fee}) : pill('Le meilleur','good'))+'</div>'; }).join(''));
}
function fcTabFin(O){
  const nat=footClub(O.id).nat, y=S.foot.nat[nat].y, f=O.fin[y]||{}, lab={gate:'Billetterie',food:'Buvettes',tv:'Droits de diffusion',spons:'Sponsors et boutique',prize:'Primes',transfer:'Transferts',wages:'Salaires',staff:'Staff',energy:'Énergie du stade',works:'Travaux du stade'};
  const rows=Object.keys(lab).filter(k=>f[k]).map(k=>'<tr><td>'+lab[k]+'</td><td class="r num '+(f[k]>=0?'pos':'neg')+'">'+signed(f[k],0)+'</td></tr>').join(''), tot=Object.values(f).reduce((s,x)=>s+x,0);
  const wages=O.sq.reduce((s,p)=>s+p.w,0)+fcStaffCost(O), att=fcAttendance(O,null), cap=fcCap(O);
  let h=card('Saison '+footSeasonLabel(nat,y),(rows? '<div class="tw"><table class="tbl"><tbody>'+rows+'<tr><td><b>Résultat</b></td><td class="r num '+(tot>=0?'pos':'neg')+'"><b>'+signed(tot,0)+'</b></td></tr></tbody></table></div>' : '<div class="sub">Pas encore de recettes ni de dépenses cette saison.</div>')+
    '<div class="sub" style="margin-top:8px">Salaires et staff : '+eur(wages,0)+' par saison. Un club qui veut gagner perd souvent de l’argent : vos autres sociétés comblent la différence.</div>');
  h+=card('Billetterie','<div class="seg">'+['Bas','Normal','Élevé'].map((t,i)=>'<button class="'+(O.ticket===i?'on':'')+'" data-a="fcset" data-i="ticket" data-v="'+i+'">'+t+'</button>').join('')+'</div>'+
    '<div class="sub" style="margin-top:6px">Billet moyen : '+eur(fcTicketPrice(O),0)+'. Affluence attendue : '+fmtN(att,0)+' sur '+fmtN(cap,0)+' places.</div>'+(()=>{ const F=fcFan(O), pt=x=>(x>=0?'+':'−')+Math.round(Math.abs(x)*100); return '<div class="sub">Engouement des supporters : '+pt(F.t)+' points de remplissage (forme récente '+pt(F.f)+', classement '+pt(F.k)+'). Les victoires remplissent le stade, les défaites le vident.</div>'; })());
  { const n=fcStAdd(O), c=fcStCost(O), B=O.stb;
    h+=card('Stade','<div class="sub">Capacité : '+fmtN(cap,0)+' places'+(O.stx? ' dont '+fmtN(O.stx,0)+' ajoutées' : '')+'. Maximum : '+fmtN(fcStMax(O),0)+'.</div>'+
      (B? '<div class="sub" style="margin-top:6px">Travaux en cours : +'+fmtN(B.n,0)+' places, fin dans '+Math.max(0,B.end-S.day)+' jours.</div><div class="bar"><i style="width:'+Math.round(clamp(1-(B.end-S.day)/ST_DAYS,0,1)*100)+'%"></i></div>'
       : n>0? '<div class="sub" style="margin-top:6px">Chaque place rapporte la billetterie et les buvettes à chaque match à domicile, et augmente la valeur du club. Les nouvelles places se remplissent un peu moins bien.</div><div style="margin-top:10px">'+btn('Agrandir : +'+fmtN(n,0)+' places · '+eur(c,0),'fcstade',{c:'pri',dis:S.cash<c})+'</div><div class="sub">Durée des travaux : '+ST_DAYS+' jours.</div>'
       : '<div class="sub" style="margin-top:6px">Le stade a atteint sa taille maximale.</div>')); }
  h+=card('Propriété','<div class="sub">Vous avez racheté le club '+eur(O.price,0)+'. Valeur actuelle : '+eur(fcClubValue(O.id),0)+'.</div><div style="margin-top:10px">'+btn('Revendre le club','fcsellask',{c:'ghost'})+'</div>');
  return h;
}

/* ---------- Actions ---------- */
ACT.fctab=el=>{ ui.ct=el.dataset.v; render(); };
ACT.fcset=el=>{ const k=el.dataset.i; let v=el.dataset.v; if(el.type==='checkbox') v=el.checked?1:0; if(k==='auto'||k==='ticket'||k==='live'||k==='asub') v=+v; after(fcSet(k,v)); };
ACT.fcmk=el=>{ const F=ui.fmk; if(el.dataset.i==='pos') F.pos=el.dataset.v; else if(el.dataset.i==='all') F.all=el.dataset.v==='1'; else F.max=+el.dataset.v; render(); };
ACT.fcstaff=el=>after(fcStaffUp(el.dataset.i));
ACT.fcoffer=el=>after(fcOffer(+el.dataset.i,el.dataset.v==='1'));
ACT.fcpl=el=>{ ui.modal={type:'fcpl',id:el.dataset.i}; render(); };
ACT.fcslot=el=>{ ui.modal={type:'fcslot',slot:+el.dataset.i}; render(); };
ACT.fcpick=el=>{ const m=ui.modal; const r=fcSwap(m.slot,el.dataset.i); ui.modal=null; after(r); };
ACT.fclist=el=>{ after(fcToggleList(el.dataset.i)); };
ACT.fcrel=el=>{ const r=fcRelease(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
ACT.fcscout=el=>{ ui.modal={type:'fcscout',id:el.dataset.i,club:+el.dataset.j}; render(); };
ACT.fcbid=el=>{ const m=ui.modal; const r=fcBid(m.id,m.club,+el.dataset.v); if(r.ok) ui.modal=null; after(r); };
ACT.fcbuyask=el=>{ ui.modal={type:'fcbuy',id:+el.dataset.i}; render(); };
ACT.fcbuy=el=>{ const r=fcBuy(+el.dataset.i); if(r.ok){ ui.modal=null; ui.tab='club'; ui.ct='ov'; } after(r); };
ACT.fcstade=()=>after(fcStBuild());
ACT.fcsellask=()=>{ ui.modal={type:'fcsell'}; render(); };
ACT.fcsell=()=>{ const r=fcSell(); ui.modal=null; after(r); };

/* ---------- Fenêtres ---------- */
{ const _mcC=modalContent; modalContent=function(){
  const m=ui.modal, O=fcOwn();
  if(m&&m.type==='fcbuy'){ const c=footClub(m.id), price=fcBuyPrice(m.id), can=S.cash>=price;
    return {title:'Racheter le club',sm:true,body:'<div class="fc-hero">'+footCrest(c,56)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.city)+'</small></div></div>'+
      '<div class="met-k"><div><span>Prix</span><b class="num">'+eur(price,0)+'</b></div><div><span>Votre trésorerie</span><b class="num '+(can?'':'neg')+'">'+eur(S.cash,0)+'</b></div></div>'+
      '<div class="sub" style="margin-top:8px">Vous reprenez l’effectif, le stade et les salaires. Les salaires sont payés chaque semaine depuis votre trésorerie ; la billetterie, les droits de diffusion et les sponsors y reviennent.</div>'+
      '<div class="row sp" style="margin-top:12px">'+btn('Annuler','closemodal',{c:'ghost'})+btn('Racheter','fcbuy',{i:m.id,c:'pri',dis:!can})+'</div>'}; }
  if(m&&m.type==='fcsell'&&O){ const v=Math.round(fcClubValue(O.id)*.92/1e5)*1e5;
    return {title:'Revendre le club',sm:true,body:'<p style="margin-top:0">Vous recevez '+eur(v,0)+' et '+esc(footName(O.id))+' redevient géré par le jeu. Vous pourrez racheter un club plus tard.</p><div class="row sp">'+btn('Annuler','closemodal',{c:'ghost'})+btn('Revendre','fcsell',{c:'pri'})+'</div>'}; }
  if(m&&m.type==='fcpl'&&O){ const p=O.sq.find(x=>String(x.id)===String(m.id)); if(!p){ ui.modal=null; return _mcC(); }
    return {title:esc(p.n),sm:true,body:'<div class="met-k"><div><span>Poste</span><b>'+FOOT_POS[p.p]+'</b><small>'+p.a+' ans · '+esc(FOOT_NATNAME[p.nat]||p.nat)+'</small></div><div><span>Note</span><b class="num">'+Math.round(p.o)+'</b><small>'+(p.inj>0?'Blessé ('+p.inj+' jours)':'Disponible')+'</small></div><div><span>Valeur</span><b class="num">'+eur(fcPlayerValue(p),0)+'</b></div><div><span>Salaire</span><b class="num">'+eur(p.w,0)+'</b><small>par saison</small></div></div>'+fpBlock(p,true)+fsGrid(p)+
      '<div class="row" style="margin-top:12px">'+btn(O.list[p.id]?'Retirer de la liste des transferts':'Mettre sur la liste des transferts','fclist',{i:p.id,c:'pri'})+btn(O.keep&&O.keep[p.id]?'Ne plus le protéger':'Intouchable (le directeur ne le vendra pas)','fckeep',{i:p.id,c:'ghost'})+btn('Résilier ('+eur(Math.round(p.w*.5/1e3)*1e3,0)+')','fcrel',{i:p.id,c:'ghost'})+'</div><div class="sub" style="margin-top:8px">Un joueur sur la liste reçoit plus d’offres pendant le mercato.</div>'}; }
  if(m&&m.type==='fcslot'&&O){ const L=fcLineup(), cur=L.xi[m.slot]; if(!cur){ ui.modal=null; return _mcC(); }
    const pos=FC_FORM[O.form][m.slot], cands=O.sq.filter(p=>p.id!==cur.id&&fcAvail(p)).sort((a,b)=>(FOOT_NEAR[pos].includes(b.p)-FOOT_NEAR[pos].includes(a.p))||(b.o-a.o));
    return {title:'Poste : '+FOOT_POS[pos],sm:true,body:'<div class="sub">Titulaire actuel : '+esc(cur.n)+' ('+Math.round(cur.o)+').</div>'+cands.map(p=>'<button class="fc-pl" data-a="fcpick" data-i="'+esc(p.id)+'"><span class="fpos">'+FOOT_POS_S[p.p]+'</span><span class="nm"><b>'+esc(p.n)+'</b><small>'+(FOOT_NEAR[pos].includes(p.p)?'Bon poste':'Hors poste')+(L.xi.some(x=>x.id===p.id)?' · déjà titulaire (échange)':'')+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>').join('')}; }
  if(m&&m.type==='fcscout'){ const p=fcFindPlayer(m.id,m.club); if(!p){ ui.modal=null; return _mcC(); }
    const v=fcPlayerValue(p), W=O&&fcWindow(S.day), join=O? Math.round(fcWillJoin(p)*100) : 0, disc=O? 1-.03*(O.staff.scout-1) : 1;
    const opt=[[1,'Valeur'],[1.25,'+25 %'],[1.5,'+50 %']];
    return {title:esc(p.n),sm:true,body:'<div class="fc-hero">'+fcrest(m.club,44)+'<div><b>'+esc(p.n)+'</b><small>'+FOOT_POS[p.p]+' · '+p.a+' ans · '+esc(footName(m.club))+'</small></div></div>'+
      '<div class="met-k"><div><span>Note</span><b class="num">'+Math.round(p.o)+'</b></div><div><span>Valeur</span><b class="num">'+eur(v,0)+'</b></div><div><span>Salaire demandé</span><b class="num">'+eur(Math.round(fcPlayerWage(p)*1.1),0)+'</b><small>par saison</small></div><div><span>Envie de venir</span><b class="num">'+(O?join+' %':'-')+'</b><small>'+(O? (join>=70?'Partant':join>=35?'Hésitant':'Peu tenté') : 'Rachetez un club')+'</small></div></div>'+fpBlock(p,false)+fsGrid(p)+
      (!O? '<div class="sub" style="margin-top:8px">Rachetez un club pour faire des offres.</div>' : !W? '<div class="notice" style="margin-top:8px">Le mercato est fermé.</div>' :
      '<div class="tag">Faire une offre</div><div class="row">'+opt.map(([k,t])=>btn(t+' : '+eur(Math.round(v*k*disc/1e4)*1e4,0),'fcbid',{v:k,c:'sm'+(k===1.25?' pri':''),dis:S.cash<v*k*disc})).join('')+'</div><div class="sub" style="margin-top:6px">Un titulaire coûte plus cher : son club demande au moins 25 % de plus que sa valeur.</div>')}; }
  return _mcC();
}; }
/* bouton de rachat dans la fiche d'un club */
{ const _fcb=footClubBody; footClubBody=function(id){
  let h=_fcb(id); const c=footClub(id); if(c.foreign) return h;
  const O=fcOwn();
  if(O&&O.id===id) return h.replace('<div class="sub" style="margin-top:8px">Le rachat d’un club arrivera dans une prochaine mise à jour.</div>','<div style="margin-top:10px">'+btn('Gérer mon club','tab',{i:'club',c:'pri'})+'</div>');
  const bb= O? '<div class="sub" style="margin-top:8px">Vous possédez déjà '+esc(footName(O.id))+'.</div>' : '<div style="margin-top:10px">'+btn('Racheter ce club : '+eur(fcBuyPrice(id),0),'fcbuyask',{i:id,c:'pri'})+'</div>';
  return h.replace('<div class="sub" style="margin-top:8px">Le rachat d’un club arrivera dans une prochaine mise à jour.</div>',bb);
}; }
/* votre match s'ouvre en direct après la journée */
{ const _rC=render; render=function(){ const O=S&&S.foot&&S.foot.own; if(O&&O.live&&!ui.modal&&typeof fmStart==='function'){ const L=O.live; O.live=null; fmStart(L.h,L.a,L.gh,L.ga,L.day,L.pen||null,L.ko||null); ui.modal={type:'fmatch'}; } _rC(); }; }
/* positions de votre système sur le terrain animé */
{ const _bp=fmBasePos; fmBasePos=function(L,s,i){ const O=fcOwn(); const id= s? L.a : L.h; if(O&&O.id===id&&FC_FORM_POS[O.form]){ const b=FC_FORM_POS[O.form][i]; return fmDir(L,s)>0? [b[0],b[1]] : [105-b[0],68-b[1]]; } return _bp(L,s,i); }; }

/* grille des statistiques détaillées */
function fsGrid(p){ return '<div class="tag">Statistiques</div><div class="fs-g">'+fsKeys(p).map(([k,t])=>{ const v=fsVal(p,k); return '<div><span>'+t+'</span><b class="num '+fsCls(v)+'">'+v+'</b></div>'; }).join('')+'</div>'; }

/* potentiel : statut et fourchette */
function fpBlock(p,mine){ const [lo,hi]=fpRange(p,mine), pot=fpPot(p);
  return '<div class="fp-box"><b>'+esc(fpLabel(mine?pot:Math.round((lo+hi)/2)))+'</b><small>Potentiel maximal : <span class="num '+fsCls(lo)+'">'+lo+'</span> à <span class="num '+fsCls(hi)+'">'+hi+'</span>'+(mine?'':' (selon votre recruteur)')+'</small></div>'; }
/* centre de formation dans l'onglet Effectif */
{ const _sq=fcTabSq; fcTabSq=function(O){ const A=fcAcad(O);
  return _sq(O)+card('Centre de formation ('+A.length+' jeunes)','<div class="sub">Jeunes de 15 à 18 ans, sans salaire. Faites signer les meilleurs : ils rejoignent l’effectif et progressent jusqu’à leur potentiel. À 19 ans, un jeune non signé quitte le club.</div>'+
    (A.length? A.slice().sort((a,b)=>fpPot(b)-fpPot(a)).map(p=>'<button class="fc-pl" data-a="fcacad" data-i="'+esc(p.id)+'"><span class="fpos">'+FOOT_POS_S[p.p]+'</span><span class="nm"><b>'+esc(p.n)+'</b><small>'+p.a+' ans · '+esc(fpLabel(fpPot(p)))+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>').join('') : '<div class="sub">Aucun jeune pour le moment. De nouveaux arrivent à chaque fin de saison.</div>'));
}; }
ACT.fcacad=el=>{ ui.modal={type:'fcacad',id:el.dataset.i}; render(); };
ACT.fcsign=el=>{ const r=fcSignYouth(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
ACT.fcfree=el=>{ const r=fcFreeYouth(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal, O=fcOwn();
  if(m&&m.type==='fcacad'&&O){ const p=fcAcad(O).find(x=>String(x.id)===String(m.id)); if(!p){ ui.modal=null; return _mc(); }
    return {title:esc(p.n),sm:true,body:'<div class="met-k"><div><span>Poste</span><b>'+FOOT_POS[p.p]+'</b><small>'+p.a+' ans · centre de formation</small></div><div><span>Note</span><b class="num">'+Math.round(p.o)+'</b><small>Salaire pro : '+eur(Math.round(fcPlayerWage(p)*.5),0)+' par saison</small></div></div>'+
      fpBlock(p,true)+fsGrid(p)+'<div class="row" style="margin-top:12px">'+btn('Faire signer pro','fcsign',{i:p.id,c:'pri'})+btn('Libérer','fcfree',{i:p.id,c:'ghost'})+'</div>'}; }
  return _mc(); }; }

/* V1.3.4 : onglet Effectif en deux menus déroulants (effectif, centre de formation).
   État : S.fcfold {sq, acad} (1 ouvert, 0 fermé) ; par défaut l'effectif ouvert, le centre fermé. */
{ const _sq2=fcTabSq; fcTabSq=function(O){ const h0=_sq2(O), F=(S.fcfold=S.fcfold||{}), keys=['sq','prop','acad']; let i=0;
  const np=(O.yprop||[]).length, k1=h0.indexOf('<section class="card',1), pc= typeof ysPropCard==='function'? ysPropCard(O) : '';
  /* des jeunes à examiner : leur liste passe en tête, sinon elle se range sous le centre de formation */
  const h= !pc? h0 : np>0? pc+h0 : h0+pc; if(np>0) keys.splice(0,2,'prop','sq'); else keys.splice(1,2,'acad','prop');
  return h.replace(/<section class="card ([^"]*)"><h2><span>([\s\S]*?)<\/span><\/h2>/g,(all,c,t)=>{ const k=keys[i++]||('x'+i), open=k==='prop'? (np>0&&F.prop!==0) : F[k]===undefined? k==='sq' : !!F[k];
    return '<section class="card '+c+' fcd-c"><details class="fcd" data-k="'+k+'"'+(open?' open':'')+'><summary><h2><span>'+t+'</span></h2></summary>'; }).replace(/<\/section>/g,(m,off,str)=>str.lastIndexOf('<details class="fcd"',off)>str.lastIndexOf('</details>',off)? '</details></section>' : m); }; }
document.addEventListener('toggle',e=>{ const d=e.target; if(!d||!d.classList||!d.classList.contains('fcd')||!S) return; S.fcfold=S.fcfold||{}; S.fcfold[d.dataset.k]=d.open?1:0; },true);

/* V1.3.9 : qui fait les changements pendant le match */
{ const _tt=fcTabTac; fcTabTac=function(O){ const h=_tt(O);
  return card('Changements pendant le match','<div class="seg"><button class="'+(!O.autoSub?'on':'')+'" data-a="fcset" data-i="asub" data-v="0">Je les fais</button><button class="'+(O.autoSub?'on':'')+'" data-a="fcset" data-i="asub" data-v="1">L’entraîneur les fait</button></div>'+
    '<div class="sub">L’entraîneur remplace les joueurs fatigués vers la 55e, la 65e, la 75e et la 82e minute, par un joueur du même poste. Vous pouvez toujours faire un changement vous-même pendant le direct.</div>')+h; }; }

/* V1.3.9 : pop-up des achats et ventes du directeur sportif au retour dans Mon club */
{ const _r=render; render=function(){ try{ const O=S&&S.foot&&S.foot.own, D=O&&O.ds; if(ui.tab==='club'&&D&&D.unseen&&D.unseen.length&&!ui.modal&&!(ui.mq&&ui.mq.length)) ui.modal={type:'dsnews'}; }catch(e){} return _r.apply(this,arguments); }; }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(m&&m.type==='dsnews'){ const D=fcOwn()&&fcOwn().ds, L=(D&&D.unseen)||[];
    const buys=L.filter(x=>/^Recrue/.test(x.t)).length, sells=L.length-buys;
    return {title:'Mercato de votre directeur sportif',sm:true,body:'<div class="sub">Depuis votre dernière visite : '+(buys? buys+' arrivée'+(buys>1?'s':'') : '')+(buys&&sells?' et ':'')+(sells? sells+' départ'+(sells>1?'s':'') : '')+'.</div>'+
      '<div class="log">'+L.slice().reverse().map(x=>'<div><span class="d">'+dateS(x.d)+'</span><span class="'+(/^Recrue/.test(x.t)?'good':'')+'">'+esc(x.t)+'</span></div>').join('')+'</div>'+
      '<div class="row" style="margin-top:10px">'+btn('Compris','dsnewsok',{c:'pri'})+'</div>'}; }
  return _mc(); }; }
ACT.dsnewsok=()=>{ const D=fcOwn()&&fcOwn().ds; if(D) D.unseen=[]; ui.modal=null; render(); };
{ const _cm=ACT.closemodal; ACT.closemodal=function(el){ if(ui.modal&&ui.modal.type==='dsnews'){ const D=fcOwn()&&fcOwn().ds; if(D) D.unseen=[]; } return _cm(el); }; }

