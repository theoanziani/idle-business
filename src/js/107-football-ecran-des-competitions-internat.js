/* ============================================================
   FOOTBALL : écran des compétitions internationales (Football > International)
   ============================================================ */
{ const _vf=vFoot; vFoot=function(){
    if(ui.fn==='int') return fiView();
    let h=_vf(); const k='<div class="ft-nav"><div class="seg">', i=h.indexOf(k);
    if(i>=0){ const j=h.indexOf('</div>',i+k.length); h=h.slice(0,j)+'<button data-a="fnat" data-i="int">International</button>'+h.slice(j); }
    return h;
  }; VIEWS.foot=vFoot; }
function fiView(){
  footInit(); const IC=fiState();
  ui.fi=FI[ui.fi]? ui.fi : 'eu1';
  let h=head('Football');
  h+='<div class="ft-nav"><div class="seg">'+Object.keys(FOOT_NAT).map(k=>'<button data-a="fnat" data-i="'+k+'">'+FOOT_NAT[k].n+'</button>').join('')+'<button class="on" data-a="fnat" data-i="int">International</button></div>'+
     '<div class="seg">'+FI_ORDER.map(k=>'<button class="'+(k===ui.fi?'on':'')+'" data-a="fic" data-i="'+k+'">'+esc(FI[k].short)+'</button>').join('')+'</div></div>';
  const id=ui.fi, C=FI[id], E=IC[id];
  if(!E){ const t=footDate(S.day); let y=t.y; if(footDay(y,C.draw[0],C.draw[1])<S.day) y++; return h+card(esc(C.n),'<div class="sub">Tirage au sort le '+footDateLabel(footDay(y,C.draw[0],C.draw[1]))+'. '+fiQualText(id)+'</div>')+fiPal(id); }
  h+='<div class="sub ft-st">'+esc(C.n)+' '+fiLabel(id,E.y)+' · '+fiStatus(id,E)+'</div>';
  if(E.champ) h+=card('Vainqueur','<div class="ft-champ">'+fcrest(E.champ,44)+'<div><small>'+fiLabel(id,E.y)+'</small><b>'+esc(footName(E.champ))+'</b></div></div>');
  if(E.ko && E.phase==='ko'){ const st=E.P.ko[E.ki]; if(st) h+=card(esc(st.n)+' · '+footDateLabel(st.d[0],{noY:1})+(st.d[1]?' et '+footDateLabel(st.d[1],{noY:1}):''),E.ko.ties.map(t=>fiTie(t,st)).join('')); }
  if(E.last) h+=card(esc(E.last.name),E.last.res.slice(0,E.last.res.length>12?10:12).map(r=>fres(r,E.last.day)).join('')+(E.last.res.length>12?'<div class="sub">et '+(E.last.res.length-10)+' autres matchs.</div>':''));
  if(E.P.lp){
    if(E.P.lp.k==='swiss'){
      const rows=fiTable(E,E.teams), eu=id.startsWith('eu');
      h+=card(id.startsWith('eu')?'Phase de ligue':'Phase de ligue',fiTabHtml(rows,(i)=> i<8? 'up' : eu&&i<24? 'po' : !eu&&i<16? 'up' : 'down')+'<div class="ft-leg"><span class="z-up"><i></i>'+(eu?'Huitièmes de finale':'Qualifié')+'</span>'+(eu?'<span class="z-po"><i style="background:var(--amber)"></i>Barrages</span>':'')+'<span class="z-down"><i></i>Éliminé</span></div>');
    } else {
      h+=card('Phase de groupes',E.grp.map((g,gi)=>'<div class="tag">Groupe '+String.fromCharCode(65+gi)+'</div>'+fiTabHtml(fiTable(E,g),i=>i<2?'up':'')).join(''));
    }
  }
  return h+fiPal(id);
}
function fiQualText(id){ return {eu3:'Qualifiés : le club suivant au classement (7e en Angleterre, en Allemagne et en Espagne, 6e en France, 4e en Croatie), les vainqueurs de coupe nationale non qualifiés ailleurs et des clubs européens.', eu1:'Qualifiés : les 4 premiers de la Ligue d’élite anglaise, de l’Erste Liga allemande et de la Primera Liga, les 3 premiers de la Première Ligue, le champion de Croatie et 20 grands clubs européens.', eu2:'Qualifiés : les clubs suivants des championnats européens.', sa1:'Qualifiés : les 6 premiers de la Série A brésilienne et 26 clubs sud-américains.', na1:'Qualifiés : les 4 meilleurs clubs de la Ligue majeure et 12 clubs d’Amérique du Nord et centrale.', as1:'Qualifiés : les 3 premiers de la Super Ligue chinoise et 21 clubs d’Asie.', w1:'Les champions de chaque continent se retrouvent en décembre.'}[id]; }
function fiStatus(id,E){
  if(E.phase==='done') return 'terminée';
  if(E.phase==='lp') return (E.P.lp.k==='swiss'?'phase de ligue':'phase de groupes')+', journée '+E.ri+' sur '+E.P.lp.n+(E.P.lp.dates[E.ri]?' · prochaine le '+footDateLabel(E.P.lp.dates[E.ri],{wd:1,noY:1}):'');
  const st=E.P.ko[E.ki]; return st? st.n.toLowerCase() : '';
}
function fiTie(t,st){
  const [a,b]=t;
  if(st.d.length===1) return t.r? fres({h:a,a:b,gh:t.r[0],ga:t.r[1],pen:t.pen,w:t.w},st.d[0]) : ffix(a,b);
  let s='<div class="fi-tie">'+ffix(a,b);
  const parts=[]; if(t.l1) parts.push('Aller : '+footName(b)+' '+t.l1[0]+'-'+t.l1[1]+' '+footName(a)); if(t.l2) parts.push('Retour : '+t.l2[0]+'-'+t.l2[1]);
  if(t.w) parts.push('Qualifié : '+footName(t.w)+(t.pen?' (tirs au but)':''));
  return s+(parts.length?'<div class="fm-p">'+esc(parts.join(' · '))+'</div>':'')+'</div>';
}
function fiTabHtml(rows,zone){
  return '<div class="tw"><table class="tbl ft"><thead><tr><th class="r">#</th><th>Club</th><th class="r">J</th><th class="r">Diff.</th><th class="r">Pts</th></tr></thead><tbody>'+
    rows.map((x,i)=>{ const t=x.t, d=t[4]-t[5], z=zone(i); return '<tr class="'+(z?'z-'+z:'')+(fcOwn()&&fcOwn().id===x.id?' fav':'')+'"><td class="r num pos-c">'+(i+1)+'</td><td>'+fclubBtn(x.id)+'</td><td class="r num">'+t[0]+'</td><td class="r num">'+(d>0?'+':'')+d+'</td><td class="r num"><b>'+t[6]+'</b></td></tr>'; }).join('')+'</tbody></table></div>';
}
function fiPal(id){ const H=(S.foot.icHist&&S.foot.icHist[id]||[]).slice(0,8); return H.length? card('Palmarès',H.map(x=>'<div class="ft-pal"><span>'+fiLabel(id,x.y)+'</span>'+fclubBtn(x.champ)+'</div>').join('')) : ''; }
ACT.fic=el=>{ ui.fi=el.dataset.i; render(); };
{ const _fn=ACT.fnat; ACT.fnat=el=>{ if(el.dataset.i==='int'){ ui.fn='int'; render(); return; } _fn(el); }; }
/* fiche club : compétitions en cours */
{ const _fcb2=footClubBody; footClubBody=function(id){ let h=_fcb2(id); const cs=fiClubComps(id); if(cs.length) h=h.replace('<div class="met-k">','<div class="row" style="margin:-4px 0 10px">'+cs.map(k=>pill(esc(FI[k].short),'info')).join('')+'</div><div class="met-k">'); return h; }; }

