/* ============================================================
   FOOTBALL : écran des championnats (menu Plus > Football)
   Classements, journées, coupe nationale, palmarès, fiche d'un club.
   ============================================================ */
ICON.foot='<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 2.9-1.5 4.7h-5L8 10.4zM12 3v4.5M16 10.4l4.3-1.4M14.5 15.1l2.7 3.7M9.5 15.1l-2.7 3.7M8 10.4L3.7 9"/>';
MENU.splice(MENU.findIndex(x=>x[0]==='guide'),0,['foot','Football','']);
NAVSHORT.foot='Football';
MGROUPS.splice(MGROUPS.findIndex(g=>g[0]==='Aide'),0,['Sport',['foot']]);
MDESC.foot='Championnats, coupes, clubs';

const FOOT_CUPN = {fr:'Coupe nationale', es:'Copa nacional', hr:'Kup nacional', us:'Coupe ouverte', br:'Copa nacional', cn:'Coupe de Chine', en:'Coupe d’Angleterre', de:'Coupe d’Allemagne'};
function footUi(){
  ui.fn=ui.fn&&FOOT_NAT[ui.fn]? ui.fn : 'fr';
  const ls=FOOT_LEAGUES.filter(L=>L.nat===ui.fn);
  if(!ui.fl||!ls.some(L=>L.id===ui.fl)) ui.fl=ls[0].id;
  const g=S.foot.lg[ui.fl].grp.length; if(!(ui.fg>=0&&ui.fg<g)) ui.fg=0;
  return {ls, L:FOOT_LEAGUES.find(x=>x.id===ui.fl)};
}
const fcrest = (id,s) => { const c=footClub(id); return c? footCrest(c,s||26) : ''; };
const fclubBtn = (id,cls) => '<button class="fc-n '+(cls||'')+'" data-a="fclub" data-i="'+id+'">'+fcrest(id,24)+'<span>'+esc(footName(id))+'</span></button>';

function footStatus(nat,lid){
  const N=S.foot.nat[nat], lg=S.foot.lg[lid], sl=footSeasonLabel(nat,N.y);
  if(!N.on) return N.done? 'Intersaison. La saison '+footSeasonLabel(nat,N.y+1)+' commence le '+footDateLabel(S.foot.nat[nat].start)+'.' : 'Saison '+sl+' : début le '+footDateLabel(N.start)+'.';
  if(lg.po && !lg.done) return 'Saison '+sl+' : séries éliminatoires.';
  if(lg.done) return 'Saison '+sl+' : championnat terminé.';
  const nx=lg.dates[lg.rd];
  return 'Saison '+sl+' · journée '+lg.rd+' sur '+lg.dates.length+(nx? ' · prochaine le '+footDateLabel(nx,{wd:1,noY:1}) : '')+'.';
}
function footTableHtml(lid,gi){
  const lg=S.foot.lg[lid], N=S.foot.nat[FOOT_LEAGUES.find(x=>x.id===lid).nat];
  { const O=S.foot.own, L=O&&O.last; if(L&&!L.seen&&footLgOf(O.id)===lid&&lg.grp[gi]&&lg.grp[gi].includes(O.id)) return '<div class="notice">Classement masqué : regardez d’abord le dernier match de votre club.</div>'+fres({h:L.h,a:L.a,gh:L.gh,ga:L.ga},L.day); }
  let rows;
  if(!N.on && lg.prev && lg.prev.tabs[gi]) rows=lg.prev.tabs[gi].map(r=>({id:r[0],t:r.slice(1),old:1}));
  else rows=footTable(lid,gi);
  const n=rows.length, fav=S.foot.fav;
  return '<div class="tw"><table class="tbl ft"><thead><tr><th class="r">#</th><th>Club</th><th class="r">J</th><th class="r">Diff.</th><th class="r">Pts</th></tr></thead><tbody>'+
    rows.map((x,i)=>{ const z=rows[0].old? '' : footZone(lid,gi,i,n), t=x.t, d=t[4]-t[5];
      return '<tr class="'+(z?'z-'+z:'')+(x.id===fav?' fav':'')+'"><td class="r num pos-c">'+(i+1)+'</td><td>'+fclubBtn(x.id)+'</td><td class="r num">'+t[0]+'</td><td class="r num">'+(d>0?'+':'')+d+'</td><td class="r num"><b>'+t[6]+'</b></td></tr>'; }).join('')+
    '</tbody></table></div>'+
    (rows[0]&&rows[0].old? '<div class="sub" style="margin-top:6px">Classement final de la saison '+footSeasonLabel(FOOT_LEAGUES.find(x=>x.id===lid).nat,lg.prev.y)+'.</div>' : footLegend(lid));
}
function footLegend(lid){
  const L=FOOT_LEAGUES.find(x=>x.id===lid), nat=FOOT_NAT[L.nat], it=[];
  if(FOOT_PO[lid]) it.push(['po','Qualifié pour les séries']);
  if(!nat.closed&&L.up) it.push(['up','Montée']);
  if(!nat.closed&&L.down) it.push(['down','Descente']);
  return it.length? '<div class="ft-leg">'+it.map(([k,t])=>'<span class="z-'+k+'"><i></i>'+t+'</span>').join('')+'</div>' : '';
}
function fres(r,day){ const h=r.h??r[0], a=r.a??r[1], gh=r.gh??r[2], ga=r.ga??r[3], kv=r.et? '-'+r.et[0]+'-'+r.et[1]+'-'+(r.pk||'x') : '';
  if(typeof fcHidden==='function'&&fcHidden(h,a,day||S.day)) return '<div class="fm-r">'+fclubBtn(h,'h')+'<button class="sc num hid" data-a="fmatch" data-i="'+h+'" data-j="'+a+'" data-v="'+gh+'-'+ga+'-'+(day||S.day)+'-'+(r.pen||0)+kv+'" aria-label="Regarder le match">Voir</button>'+fclubBtn(a,'a')+'</div>';
  return '<div class="fm-r">'+fclubBtn(h,'h'+(gh>ga||r.w===h&&r.pen?' w':''))+'<button class="sc num" data-a="fmatch" data-i="'+h+'" data-j="'+a+'" data-v="'+gh+'-'+ga+'-'+(day||S.day)+'-'+(r.pen||0)+kv+'" aria-label="Voir le match">'+gh+' - '+ga+'</button>'+fclubBtn(a,'a'+(ga>gh||r.w===a&&r.pen?' w':''))+'</div>'+(r.ps?'<div class="fm-p">Après prolongation · tirs au but '+r.ps[0]+'-'+r.ps[1]+' pour '+esc(footName(r.pen))+'</div>' : r.pen?'<div class="fm-p">Tirs au but : '+esc(footName(r.pen))+'</div>' : r.et?'<div class="fm-p">Après prolongation</div>':''); }
const ffix = (h,a) => '<div class="fm-r">'+fclubBtn(h,'h')+'<b class="sc vs">-</b>'+fclubBtn(a,'a')+'</div>';

function vFoot(){
  footInit(); const {ls,L}=footUi(), lg=S.foot.lg[L.id], N=S.foot.nat[ui.fn];
  let h=head('Football');
  h+='<div class="ft-nav"><div class="seg">'+Object.keys(FOOT_NAT).map(k=>'<button class="'+(k===ui.fn?'on':'')+'" data-a="fnat" data-i="'+k+'">'+FOOT_NAT[k].n+'</button>').join('')+'</div>'+
     '<div class="seg">'+ls.map(x=>'<button class="'+(x.id===L.id&&!ui.fcup?'on':'')+'" data-a="flg" data-i="'+x.id+'">'+esc(x.n)+'</button>').join('')+(S.foot.cup[ui.fn]?'<button class="'+(ui.fcup?'on':'')+'" data-a="fcupv">'+esc(FOOT_CUPN[ui.fn])+'</button>':'')+'</div>'+
     (!ui.fcup&&lg.grp.length>1? '<div class="seg">'+lg.grp.map((g,i)=>'<button class="'+(i===ui.fg?'on':'')+'" data-a="fgrp" data-i="'+i+'">'+(ui.fn==='us'&&L.lvl<3? (i?'Conférence Ouest':'Conférence Est') : 'Groupe '+(i+1))+'</button>').join('')+'</div>' : '')+'</div>';
  /* V1.9.4 : la coupe nationale a son onglet à côté des championnats */
  if(ui.fcup&&S.foot.cup[ui.fn]) return h+footCupView(ui.fn,N);
  h+='<div class="sub ft-st">'+footStatus(ui.fn,L.id)+'</div>';
  h+=card(esc(L.n)+(lg.grp.length>1? ' · '+(ui.fn==='us'&&L.lvl<3? (ui.fg?'Ouest':'Est') : 'groupe '+(ui.fg+1)) : ''), footTableHtml(L.id,ui.fg));
  /* séries éliminatoires */
  if(lg.po){
    const P=lg.po; let b='';
    if(P.last) b+='<div class="tag">Derniers résultats</div>'+P.last.map(r=>fres(r,P.dates[P.ri-1])).join('');
    if(P.ties.length) b+='<div class="tag">Prochain tour · '+footDateLabel(P.dates[P.ri],{wd:1,noY:1})+'</div>'+P.ties.map(([x,y])=>ffix(x,y)).join('');
    if(P.champ) b+='<div class="ft-champ">'+fcrest(P.champ,40)+'<div><small>Champion</small><b>'+esc(footName(P.champ))+'</b></div></div>';
    h+=card('Séries éliminatoires',b);
  }
  /* journée */
  if(N.on && !lg.done){
    let b='';
    const last=lg.last&&lg.last.res.filter(r=>r[4]===ui.fg);
    if(last&&last.length) b+='<div class="tag">Journée '+lg.last.rd+' · '+footDateLabel(lg.last.day,{wd:1,noY:1})+'</div>'+last.map(r=>fres(r,lg.last.day)).join('');
    const fx=lg.rd<lg.dates.length? footFixtures(lg.grp[ui.fg],footCycles(L.id))[lg.rd] : null;
    if(fx&&fx.length) b+='<div class="tag">Journée '+(lg.rd+1)+' · '+footDateLabel(lg.dates[lg.rd],{wd:1,noY:1})+'</div>'+fx.map(([x,y])=>ffix(x,y)).join('');
    if(b) h+=card('Matchs',b);
  }
  /* palmarès */
  const H=(S.foot.hist[L.id]||[]).slice(0,5);
  if(H.length){
    h+=card('Palmarès',(H.length? '<div class="tag">'+esc(L.n)+'</div>'+H.map(x=>'<div class="ft-pal"><span>'+footSeasonLabel(ui.fn,x.y)+'</span>'+fclubBtn(x.champ)+'</div>').join('') : '')+
      '');
  }
  return h;
}
function footCupView(nat,N){ const C=S.foot.cup[nat]; let b='', h='';
  if(C.champ) b+='<div class="ft-champ">'+fcrest(C.champ,40)+'<div><small>Vainqueur '+footSeasonLabel(nat,N.y)+'</small><b>'+esc(footName(C.champ))+'</b></div></div>';
  else if(C.dates[C.ri]) b+='<div class="sub">'+footCupRoundName(C,C.ri)+' le '+footDateLabel(C.dates[C.ri],{wd:1})+'. '+(C.alive.length+C.byes.length)+' clubs encore en course.</div>';
  b+='<div class="tag">Calendrier</div>'+C.dates.map((d,i)=>'<div class="row sp"><span'+(i===C.ri&&!C.champ?' style="font-weight:700"':'')+'>'+footCupRoundName(C,i)+'</span><span class="sub">'+footDateLabel(d,{wd:1,noY:1})+'</span></div>').join('');
  h+=card(esc(FOOT_CUPN[nat])+' '+footSeasonLabel(nat,N.y),b);
  if(C.last){ const mine=C.last.res.filter(r=>r.h===S.foot.fav||r.a===S.foot.fav), all=mine.concat(C.last.res.filter(r=>!mine.includes(r)));
    h+=card(esc(C.last.name)+' · '+footDateLabel(C.last.day,{wd:1,noY:1}), all.map(r=>fres(r,C.last.day)).join('')); }
  const CH=(S.foot.cupHist[nat]||[]).slice(0,10);
  if(CH.length) h+=card('Palmarès',CH.map(x=>'<div class="ft-pal"><span>'+footSeasonLabel(nat,x.y)+'</span>'+fclubBtn(x.champ)+'</div>').join(''));
  return h; }
ACT.fcupv=()=>{ ui.fcup=1; render(); };
VIEWS.foot=vFoot;
ACT.fnat=el=>{ ui.fn=el.dataset.i; ui.fl=null; ui.fg=0; ui.fcup=0; render(); };
ACT.flg=el=>{ ui.fl=el.dataset.i; ui.fg=0; ui.fcup=0; render(); };
ACT.fgrp=el=>{ ui.fg=+el.dataset.i; render(); };
ACT.fclub=el=>{ footInit(); ui.modal={type:'fclub',id:+el.dataset.i,prev:ui.modal&&ui.modal.type!=='fclub'?ui.modal:null}; render(); };
ACT.ffav=el=>{ const id=+el.dataset.i; S.foot.fav= S.foot.fav===id? null : id; render(); toast(S.foot.fav? 'Vous suivez '+footName(id)+' : ses résultats arrivent dans le journal.' : 'Vous ne suivez plus ce club.','good'); };
ACT.fgo=el=>{ const id=+el.dataset.i, lid=footLgOf(id); if(!lid) return; const L=FOOT_LEAGUES.find(x=>x.id===lid); ui.fn=L.nat; ui.fl=lid; ui.fg=Math.max(0,S.foot.lg[lid].grp.findIndex(g=>g.includes(id))); ui.modal=null; ui.tab='foot'; render(); };

function footSquadHtml(id){
  const sq=footSquad(id), order=['G','DL','DC','MD','MC','MO','AIL','BU'], groups=[['Gardiens',['G']],['Défenseurs',['DL','DC']],['Milieux',['MD','MC','MO']],['Attaquants',['AIL','BU']]];
  return '<details class="fc-sq"><summary>Effectif ('+sq.length+' joueurs)</summary>'+groups.map(([g,ps])=>'<div class="tag">'+g+'</div>'+sq.filter(p=>ps.includes(p.p)).sort((a,b)=>b.o-a.o).map(p=>'<div class="fm-xi"><span>'+FOOT_POS_S[p.p]+'</span>'+esc(p.n)+'<em>'+p.a+' ans · '+esc(FOOT_NATNAME[p.nat]||p.nat)+'</em><small class="num">'+p.o+'</small></div>').join('')).join('')+'</details>';
}
function footClubBody(id){
  const c=footClub(id), lid=footLgOf(id);
  if(c.foreign) return '<div class="fc-hero">'+footCrest(c,64)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.city)+' · '+esc(c.nat)+'</small></div></div><div class="sub">Club étranger, présent dans les coupes internationales.</div>';
  const L=FOOT_LEAGUES.find(x=>x.id===lid), lg=S.foot.lg[lid], gi=Math.max(0,lg.grp.findIndex(g=>g.includes(id)));
  const tab=footTable(lid,gi), pos=tab.findIndex(x=>x.id===id), t=lg.tab[id]||[0,0,0,0,0,0,0], f=(lg.form[id]||'').split('').filter(Boolean);
  let nx=''; if(S.foot.nat[L.nat].on && lg.rd<lg.dates.length){ const m=(footFixtures(lg.grp[gi],footCycles(lid))[lg.rd]||[]).find(p=>p.includes(id)); if(m) nx='<div class="tag">Prochain match · '+footDateLabel(lg.dates[lg.rd],{wd:1,noY:1})+'</div>'+ffix(m[0],m[1]); }
  const r=Math.round(footR(id));
  return '<div class="fc-hero">'+footCrest(c,64)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.city)+' · '+esc(FOOT_NAT[c.nat].n)+'</small></div></div>'+
    '<div class="met-k"><div><span>Championnat</span><b>'+esc(L.n)+'</b><small>Division '+L.lvl+'</small></div>'+
    '<div><span>Classement</span><b class="num">'+(t[0]? (pos+1)+(pos?'e':'er') : '-')+'</b><small>'+t[6]+' points en '+t[0]+' matchs</small></div>'+
    '<div><span>Force</span><b class="num">'+r+' / 100</b><small>'+(r>=85?'Grand d’Europe':r>=75?'Haut de tableau':r>=62?'Solide':r>=50?'Modeste':'Petit club')+'</small></div>'+
    '<div><span>Stade</span><b class="num">'+fmtN((fcOwn()&&fcOwn().id===id)? fcCap(fcOwn()) : c.cap,0)+'</b><small>places</small></div></div>'+
    (f.length? '<div class="tag">Forme</div><div class="ft-form">'+f.map(x=>'<i class="'+(x==='V'?'w':x==='D'?'l':'d')+'">'+x+'</i>').join('')+'</div>' : '')+
    nx+
    footSquadHtml(id)+
    '<div class="row" style="margin-top:12px">'+btn(S.foot.fav===id?'Ne plus suivre':'Suivre ce club','ffav',{i:id,c:S.foot.fav===id?'ghost':'pri'})+btn('Voir le classement','fgo',{i:id,c:'ghost'})+'</div>'+
    '<div class="sub" style="margin-top:8px">Le rachat d’un club arrivera dans une prochaine mise à jour.</div>';
}
{ const _mcF=modalContent; modalContent=function(){ const m=ui.modal; if(m&&m.type==='fclub'){ footInit(); if(!footClub(m.id)){ ui.modal=null; return _mcF(); } return {title:'Club',sm:true,body:footClubBody(m.id)}; } return _mcF(); }; }

/* V1.9.3 : places européennes en couleur dans les championnats de première division */
const FT_EU={es1:[4,2,1], fr1:[3,2,1], hr1:[1,2,1], en1:[4,2,1], de1:[4,2,1]};
{ const _fz=footZone; footZone=function(lid,gi,pos,n){ const z=_fz(lid,gi,pos,n), E=FT_EU[lid]; if(!E||z==='down') return z;
  if(pos<E[0]) return 'c1'; if(pos<E[0]+E[1]) return 'c2'; if(pos<E[0]+E[1]+E[2]) return 'c3'; return z; }; }
{ const _fl=footLegend; footLegend=function(lid){ const h=_fl(lid), E=FT_EU[lid]; if(!E) return h;
  const eu='<span class="z-c1"><i></i>Coupe d’Europe des champions</span><span class="z-c2"><i></i>Coupe d’Europe</span><span class="z-c3"><i></i>Coupe des confédérations</span>';
  return h? h.replace('<div class="ft-leg">','<div class="ft-leg">'+eu) : '<div class="ft-leg">'+eu+'</div>'; }; }
/* l'onglet choisi (championnat ou coupe) reste visible dans la barre qui défile */
{ const _rF2=render; render=function(){ _rF2.apply(this,arguments); try{ if(ui.tab==='foot') document.querySelectorAll('.ft-nav .seg').forEach(sg=>{ const on=sg.querySelector('button.on'); if(on&&(on.offsetLeft<sg.scrollLeft||on.offsetLeft+on.offsetWidth>sg.scrollLeft+sg.clientWidth)) sg.scrollLeft=on.offsetLeft-12; }); }catch(e){} }; }

