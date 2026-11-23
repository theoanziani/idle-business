/* ============================================================
   Football : interface de la détection des jeunes (V1.2.1)
   Onglet Staff : recruteurs, missions, jeunes proposés. Carte du monde pour choisir le pays.
   ============================================================ */
/* contours : ys_geo.js (YS_GEO) */
const ysX=lon=>lon+180, ysY=lat=>90-lat;
function ysMap(O,sel,zoom){
  const home=ysClubPos(O), K=zoom?.3:1;
  const ctry=Object.keys(YS_C).map(k=>YS_GEO.c[k]? '<path class="ys-c'+(k===sel?' on':'')+'" data-a="yspick" data-v="'+k+'" d="'+YS_GEO.c[k]+'"/>' : '').join('');
  const dots=Object.entries(YS_C).map(([k,c])=>'<g class="ys-pt'+(k===sel?' on':'')+'" data-a="yspick" data-v="'+k+'"><circle cx="'+ysX(c.lon)+'" cy="'+ysY(c.lat)+'" r="'+6*K+'" class="hit"/><circle cx="'+ysX(c.lon)+'" cy="'+ysY(c.lat)+'" r="'+(k===sel?2.6:1.7)*K+'" class="dot"/></g>').join('');
  return '<div class="ys-map"><svg viewBox="'+(zoom? '152 18 80 48' : '0 4 360 146')+'" role="img" aria-label="Carte du monde : touchez un pays en couleur"><path class="land" d="'+YS_GEO.land+'"/>'+ctry+
    '<circle cx="'+ysX(home.lon)+'" cy="'+ysY(home.lat)+'" r="'+2.4*K+'" class="home"/>'+dots+'</svg><button class="btn sm ys-zoom" data-a="yszoom">'+(zoom?'Monde':'Zoom Europe')+'</button></div><div class="sub">Pays en couleur : missions possibles. Le point blanc marque votre club.</div>';
}
function ysStarsTxt(n){ return fcStars(n); }
function ysScoutRow(O,s){
  const m=s.m;
  return '<div class="fc-staff"><div><b>'+esc(s.n)+'</b><small>Expérience '+ysStarsTxt(s.exp)+' · Expertise '+ysStarsTxt(s.ex)+'</small><small>'+
    (m? 'En mission : '+esc(YS_C[m.c].n)+', retour '+fcCountdown(m.end).toLowerCase()+'. '+(ysNext(m)===null? 'Tous ses rapports sont rendus.' : ysNext(m)>=m.end? 'Dernier rapport à son retour.' : 'Prochain rapport '+fcCountdown(ysNext(m)).toLowerCase()+'.') : 'Au club, disponible.')+' Salaire : '+eur(s.w,0)+' par saison.</small></div>'+
    '<div class="row">'+(m? btn('Rappeler','ysrecall',{i:s.id,c:'sm ghost'}) : btn('Envoyer en mission','ysmis',{i:s.id,c:'sm pri'}))+btn('Remplacer','ysrep',{i:s.id,c:'sm ghost'})+btn('Se séparer ('+eur(ysSever(s),0)+')','ysfire',{i:s.id,c:'sm ghost'})+'</div></div>';
}
function ysPropRow(p){
  return '<button class="fc-pl" data-a="ysprop" data-i="'+esc(p.id)+'"><span class="fpos">'+FOOT_POS_S[p.p]+'</span><span class="nm"><b>'+esc(p.n)+'</b><small>'+p.a+' ans · '+esc(p.cn)+' · '+esc(fpLabel(Math.round((fpRange(p,false)[0]+fpRange(p,false)[1])/2)))+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>';
}
{ const _st=fcTabSt; fcTabSt=function(O){ fcYS(O);
  const free=YS_MAX-O.ysc.length;
  return _st(O)+card('Recruteurs de jeunes ('+O.ysc.length+' sur '+YS_MAX+')','<div class="sub">L’expérience donne le nombre de jeunes proposés (une étoile : 1 ou 2 par mois de mission ; cinq étoiles : 5 à 7). L’expertise relève leur qualité et leur potentiel, sans écarter tous les profils modestes.</div>'+
      O.ysc.map(s=>ysScoutRow(O,s)).join('')+(free>0? '<div class="row" style="margin-top:8px">'+btn('Recruter un recruteur de jeunes','yshire',{c:'sm'})+'</div>' : ''))+
    card('Jeunes proposés ('+O.yprop.length+')', O.yprop.length? '<div class="row sp"><span class="sub">Ils sont listés dans l’onglet Effectif.</span>'+btn('Voir les jeunes','fctab',{v:'sq',c:'sm pri'})+'</div>' : '<div class="sub">Envoyez un recruteur en mission : il envoie un rapport chaque mois.</div>');
}; }
ACT.yshire=()=>{ ui.modal={type:'yshire'}; render(); };
ACT.yshireok=el=>{ const m=ui.modal, r= m&&m.rep? ysReplace(m.rep,el.dataset.i) : ysHire(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
ACT.ysrep=el=>{ ui.modal={type:'yshire',rep:el.dataset.i}; render(); };
ACT.ysfire=el=>{ const r=ysFire(el.dataset.i); after(r); };
ACT.ysmis=el=>{ ui.modal={type:'ysmis',id:el.dataset.i,c:null,len:90}; render(); };
ACT.yspick=el=>{ const m=ui.modal; if(!m||m.type!=='ysmis') return; m.c=el.dataset.v; render(); };
ACT.yszoom=()=>{ const m=ui.modal; if(!m) return; m.z=!m.z; render(); };
ACT.yslen=el=>{ const m=ui.modal; if(!m) return; m.len=+el.dataset.v; render(); };
ACT.yssend=()=>{ const m=ui.modal; const r=ysSend(m.id,m.c,m.len); if(r.ok) ui.modal=null; after(r); };
ACT.ysrecall=el=>{ after(ysRecall(el.dataset.i)); };
ACT.ysprop=el=>{ ui.modal={type:'ysprop',id:el.dataset.i}; render(); };
ACT.yssign=el=>{ const r=ysSign(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
ACT.ysdrop=el=>{ const r=ysDrop(el.dataset.i); if(r.ok) ui.modal=null; after(r); };
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal, O=fcOwn();
  if(m&&m.type==='yshire'&&O){ fcYS(O);
    const rs=m.rep&&O.ysc.find(x=>x.id===m.rep);
    return {title:rs? 'Remplacer '+esc(rs.n) : 'Recruteurs de jeunes disponibles',sm:true,body:'<div class="sub">Nouveaux candidats tous les 30 jours.'+(rs? ' '+esc(rs.n)+' part avec une indemnité de '+eur(ysSever(rs),0)+(rs.m?' et sa mission s’arrête':'')+'.' : '')+'</div>'+(O.yscC.length? O.yscC.map(s=>'<div class="fc-staff"><div><b>'+esc(s.n)+'</b><small>Expérience '+ysStarsTxt(s.exp)+' · Expertise '+ysStarsTxt(s.ex)+'</small><small>Salaire : '+eur(ysWage(s),0)+' par saison · mission : '+eur(ysMonthly(s),0)+' par mois.</small></div>'+btn('Recruter : '+eur(ysFee(s),0),'yshireok',{i:s.id,c:'sm pri',dis:S.cash<ysFee(s)})+'</div>').join('') : '<div class="sub">Aucun candidat pour le moment.</div>')}; }
  if(m&&m.type==='ysmis'&&O){ const s=O.ysc.find(x=>x.id===m.id); if(!s){ ui.modal=null; return _mc(); }
    const c=m.c&&YS_C[m.c], cost=c? ysMissionCost(O,s,m.c,m.len) : 0;
    return {title:'Mission de '+esc(s.n),sm:true,body:ysMap(O,m.c,m.z)+
      '<div class="seg ys-len">'+YS_LEN.map(l=>'<button class="'+(m.len===l?'on':'')+'" data-a="yslen" data-v="'+l+'">'+l/30+' mois</button>').join('')+'</div>'+
      (c? '<div class="met-k"><div><span>Pays</span><b>'+esc(c.n)+'</b><small>Vivier : '+(c.t>=1.15?'exceptionnel':c.t>=1.05?'très riche':c.t>=.98?'riche':'modeste')+(c.rare?' ; pays peu commun : une pépite peut surgir':'')+'</small></div><div><span>Coût total</span><b class="num">'+eur(cost,0)+'</b><small>Voyage '+eur(ysTravel(O,m.c),0)+' + '+eur(ysMonthly(s),0)+' par mois</small></div></div>'+
        '<div class="sub">'+(m.len/30>1? (m.len/30)+' rapports, un par mois.' : 'Un rapport à la fin du mois.')+'</div><div class="row" style="margin-top:10px">'+btn('Envoyer '+esc(s.n),'yssend',{c:'pri',dis:S.cash<ysTravel(O,m.c)})+'</div>'
        : '<div class="sub">Touchez un pays sur la carte, ou choisissez-le dans la liste.</div>')+
      '<div class="ys-list">'+Object.entries(YS_C).map(([k,x])=>'<button class="'+(m.c===k?'on':'')+'" data-a="yspick" data-v="'+k+'">'+esc(x.n)+'</button>').join('')+'</div>'}; }
  if(m&&m.type==='ysprop'&&O){ fcYS(O); const p=O.yprop.find(x=>x.id===m.id); if(!p){ ui.modal=null; return _mc(); }
    return {title:esc(p.n),sm:true,body:'<div class="met-k"><div><span>Poste</span><b>'+FOOT_POS[p.p]+'</b><small>'+p.a+' ans · '+esc(p.cn)+'</small></div><div><span>Note</span><b class="num">'+Math.round(p.o)+'</b><small>Repéré par '+esc(p.sc)+'</small></div><div><span>Indemnité</span><b class="num">'+eur(p.fee,0)+'</b><small>Proposition valable '+fcCountdown(p.until).toLowerCase()+'</small></div></div>'+
      fpBlock(p,false)+fsGrid(p)+'<div class="row" style="margin-top:12px">'+btn('Faire venir au centre','yssign',{i:p.id,c:'pri',dis:S.cash<p.fee})+btn('Écarter','ysdrop',{i:p.id,c:'ghost'})+'</div>'}; }
  return _mc(); }; }

/* V1.4.1 : les jeunes proposés bien visibles dans l'onglet Effectif */
function ysPropCard(O){ fcYS(O); const L=O.yprop;
  return card('Jeunes proposés par vos recruteurs ('+L.length+')', L.length? '<div class="sub">Chaque proposition reste valable 30 jours. Touchez un jeune pour voir sa fiche et le faire venir au centre de formation.</div>'+L.map(ysPropRow).join('') : '<div class="sub">Aucun jeune proposé pour le moment. Envoyez un recruteur en mission depuis l’onglet Staff.</div>'); }

/* Football : interface des programmes d'entraînement (V1.2.2) */
function trSel(ch,i,P,cur,extra){ return '<select class="btn sm tr-sel" data-ch="'+ch+'" data-i="'+esc(String(i))+'" aria-label="Programme">'+(extra||'')+Object.entries(P).map(([k,t])=>'<option value="'+k+'"'+(k===cur?' selected':'')+'>'+t+'</option>').join('')+'</select>'; }
{ const _tac=fcTabTac; fcTabTac=function(O){ const T=trOf(O), ds=O.ds&&O.ds.lvl>0, on=trDsOn(O);
  return _tac(O)+card('Entraînement','<div class="sub">Chaque mois, la statistique travaillée progresse. Les autres ne bougent pas : elles ne baissent qu’avec l’âge. La note générale monte quand la statistique compte pour le poste, sans dépasser le potentiel.</div>'+
    '<label class="fc-tg"><span>Confier les programmes au directeur sportif'+(ds?'':' (recrutez-en un dans l’onglet Staff)')+'</span><input type="checkbox" data-a="trds" '+(on?'checked':'')+(ds?'':' disabled')+' aria-label="Confier au directeur sportif"></label>'+
    (on? '<div class="sub">Il fait travailler à chacun la plus faible des statistiques importantes de son poste.</div>' :
    Object.entries(TR_LINES).map(([k,[n]])=>'<div class="row sp tr-row"><b>'+n+'</b>'+trSel('trline',k,k==='G'?TR_GK:TR_OUT,T.l[k])+'</div>').join('')+
    (Object.keys(T.ind).length? '<div class="sub">'+Object.keys(T.ind).length+' joueur(s) suivent un programme individuel (fiche du joueur).</div>' : '<div class="sub">Programme individuel : ouvrez la fiche d’un joueur.</div>')));
}; }
CH.trline=el=>after(trSetLine(el.dataset.i,el.value));
CH.trind=el=>after(trSetInd(el.dataset.i,el.value));
ACT.trds=el=>after(trSetDs(!trDsOn(fcOwn())));
{ const _mc=modalContent; modalContent=function(){ const r=_mc(), m=ui.modal, O=fcOwn();
  if(r&&m&&(m.type==='fcpl'||m.type==='fcacad')&&O){ const p=O.sq.find(x=>String(x.id)===String(m.id))||fcAcad(O).find(x=>String(x.id)===String(m.id));
    if(p){ const T=trOf(O), cur=T.ind[p.id]||'line', lineP=trProgs(p)[T.l[trLineOf(p)]]||'Équilibré';
      r.body+=(trDsOn(O)? '<div class="sub">Programme choisi par le directeur sportif : '+esc(trProgs(p)[trFocus(O,p)]||'Équilibré').toLowerCase()+'.</div>' :
        '<div class="row sp tr-row"><span class="sub">Programme</span>'+trSel('trind',p.id,trProgs(p),cur,'<option value="line"'+(cur==='line'?' selected':'')+'>Comme sa ligne ('+esc(lineP.toLowerCase())+')</option>')+'</div>'); } }
  return r; }; }

