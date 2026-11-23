/* ============================================================
   FOOTBALL : onglet « Direction » de Mon club (directeur sportif)
   ============================================================ */
FC_TABS.splice(FC_TABS.findIndex(t=>t[0]==='st')+1,0,['ds','Direction']);
function fcTabDs(O){
  const D=dsOf(O), W=fcWindow(S.day);
  let h='';
  if(D.lvl<1){
    h+=card('Directeur sportif','<p style="margin-top:0">Il compose l’équipe, répond aux offres et peut recruter à votre place pendant le mercato, dans le budget que vous fixez.</p>'+
      '<div>'+btn('Recruter un directeur sportif : '+eur(DS_FEE[1],0),'dshire',{c:'pri',dis:S.cash<DS_FEE[1]})+'</div><div class="sub" style="margin-top:6px">Salaire : '+eur(DS_WAGE[1],0)+' par saison.</div>');
  } else {
    h+=card('Directeur sportif','<div class="fc-staff"><div><b>Niveau</b> '+fcStars(D.lvl)+'<small>Meilleurs choix, offres plus serrées et plus de tentatives à chaque niveau. Salaire : '+eur(DS_WAGE[D.lvl],0)+' par saison.</small></div>'+(D.lvl<5? btn('Recruter mieux : '+eur(DS_FEE[D.lvl+1],0),'dshire',{c:'sm',dis:S.cash<DS_FEE[D.lvl+1]}) : pill('Le meilleur','good'))+'</div>'+
      '<div class="tag">Délégation</div><div class="seg">'+Object.entries(DS_MODES).map(([k,m])=>'<button class="'+(D.mode===k?'on':'')+'" data-a="dsset" data-i="mode" data-v="'+k+'">'+m.n+'</button>').join('')+'</div><div class="sub" style="margin-top:6px">'+DS_MODES[D.mode].d+'</div>'+
      (D.mode==='full'? '<div class="tag">Budget par mercato</div><div class="seg fc-scroll">'+DS_BUDGETS.map(v=>'<button class="'+(D.budget===v?'on':'')+'" data-a="dsset" data-i="budget" data-v="'+v+'">'+eur(v,0)+'</button>').join('')+'</div>'+
        '<div class="tag">Profil des recrues</div><div class="seg">'+Object.entries(DS_PROFILES).map(([k,t])=>'<button class="'+(D.profile===k?'on':'')+'" data-a="dsset" data-i="profile" data-v="'+k+'">'+t+'</button>').join('')+'</div>'+
        '<div class="sub" style="margin-top:6px">'+(W? W.n+' ouvert : '+eur(D.wkey===W.a?D.spent:0,0)+' dépensés sur '+eur(D.budget,0)+'.' : 'Mercato fermé. Prochaine ouverture le '+footDateLabel(fcNextWindow(S.day),{noY:1})+'.')+'</div>' : ''));
  }
  const adv=dsAdvice(O);
  h+=card('Ses conseils', adv.length? adv.map(a=>'<div class="fc-news"><span>Conseil</span>'+esc(a)+'</div>').join('') : '<div class="sub">Rien à signaler : l’effectif est équilibré.</div>');
  if(D.log.length) h+=card('Ce qu’il a fait',D.log.slice(0,12).map(n=>'<div class="fc-news"><span class="num">'+footDateLabel(n.d,{noY:1})+'</span>'+esc(n.t)+'</div>').join(''));
  return h;
}
ACT.dshire=()=>after(dsHire());
ACT.dsset=el=>after(dsSet(el.dataset.i,el.dataset.v));

/* Football : affichage des trophées individuels (V1.2.3) */
function awCard(){
  const A=S.foot&&S.foot.aw; if(!A||!A.length) return card('Trophées individuels','<div class="sub">Ballon d’or et meilleur gardien fin octobre, Golden Boy (moins de 21 ans) mi-décembre.</div>');
  const e=A.find(x=>x.bdo)||A[0], O=fcOwn(), mine=r=>O&&r.club===O.id? ' <span class="pill good">Votre club</span>' : '';
  const row=(r,lab)=>'<div class="fm-xi aw-r"><span>'+lab+'</span>'+esc(r.n)+mine(r)+'<small>'+esc(footName(r.club))+' · '+FOOT_POS_S[r.p]+' · '+r.o+'</small></div>';
  let h='';
  if(e.bdo) h+='<div class="tag">Ballon d’or '+e.y+'</div>'+e.bdo.slice(0,5).map((r,i)=>row(r,(i+1)+'.')).join('');
  if(e.gk) h+='<div class="tag">Meilleur gardien</div>'+row(e.gk,'G');
  const g=A.find(x=>x.gb); if(g) h+='<div class="tag">Golden Boy '+g.y+'</div>'+row(g.gb,'GB');
  const past=A.filter(x=>x.bdo&&x!==e).slice(0,5); if(past.length) h+='<div class="tag">Palmarès</div>'+past.map(x=>'<div class="sub">'+x.y+' : '+esc(x.bdo[0].n)+' ('+esc(footName(x.bdo[0].club))+')</div>').join('');
  return card('Trophées individuels',h);
}
{ const _v=vFoot; vFoot=function(){ const h=_v(); return ui.fn==="int"? h : h+awCard(); }; VIEWS.foot=vFoot; }
{ const _mc=modalContent; modalContent=function(){ const r=_mc(), m=ui.modal, O=fcOwn();
  if(r&&m&&m.type==='fcpl'&&O){ const p=O.sq.find(x=>String(x.id)===String(m.id)); if(p&&p.aw&&p.aw.length) r.body+='<div class="tag">Distinctions</div><div class="sub">'+p.aw.map(esc).join(' · ')+'</div>'; }
  return r; }; }

