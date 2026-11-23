/* ============================================================
   PREMIERS PAS : liste guidée sur l'accueil et conseils contextuels
   ============================================================ */
const TUT=[
  {k:'city', t:'Choisir une ville', d:'Dans Sociétés, touchez une ville. Paris est équilibrée, Zagreb et Barcelone sont moins chères.', ok:()=>S.tut.city||Object.keys(S.bld||{}).length>0, go:['tab','biz']},
  {k:'bld', t:'Louer un bâtiment', d:'Choisissez un quartier (€ = loyers bas), puis un bâtiment. Commencez petit : une boutique suffit.', ok:()=>Object.keys(S.bld||{}).length>0||S.biz.length>0, go:['tab','biz']},
  {k:'biz', t:'Établir une société', d:'Un atelier de réparation ou une boutique en ligne rapportent vite. Visez « Idéal » ou « Bon choix ».', ok:()=>S.biz.length>0, go:['tab','biz']},
  {k:'day', t:'Passer au jour suivant', d:'Chaque jour encaisse ventes et charges. Un rapport résume la journée.', ok:()=>S.day>1&&S.biz.length>0},
  {k:'team', t:'Compléter l’équipe', d:'À l’ouverture, l’équipe est incomplète : dans la fiche, touchez « Compléter » pour chaque poste.', ok:()=>S.biz.some(b=>b.status==='active'&&staffFill(b)>=.999), go:['tab','biz']},
  {k:'two', t:'Ouvrir une deuxième société', d:'Attendez d’avoir le prix de la société plus une réserve (la fenêtre de lancement l’indique) : un compte à découvert 14 jours, c’est la faillite.', ok:()=>S.biz.length>=2, go:['tab','biz']}
];
function tutOn(){ return S.tut&&!S.tut.off; }
function tutCard(){
  if(!tutOn()) return '';
  const done=TUT.filter(x=>x.ok()).length;
  if(done===TUT.length){ S.tut.off=true; S.tut.fin=S.day; return ''; }
  const cur=TUT.find(x=>!x.ok());
  return card('Premiers pas · '+done+' / '+TUT.length,'<div class="stack">'+bar(done/TUT.length,'g')+
    TUT.map(x=>{ const ok=x.ok(), now=x===cur; return '<div class="tut'+(ok?' ok':'')+(now?' now':'')+'"><span class="ck">'+(ok?'✓':'')+'</span><div><b>'+x.t+'</b>'+(now?'<div class="sub">'+x.d+'</div>':'')+'</div>'+(now&&x.go?btn('Y aller',x.go[0],{c:'sm pri',i:x.go[1]}):'')+'</div>'; }).join('')+
    '<div>'+btn('Masquer le guide','tutoff',{c:'sm ghost'})+'</div></div>');
}
/* Conseils affichés une seule fois */
const TIPS={
  city:'Chaque quartier a sa clientèle et son niveau de loyer (de € à €€€€). « Idéal » indique les activités qui y marchent le mieux.',
  dist:'Louer coûte un dépôt de 30 jours de loyer ; acheter coûte cher mais divise le loyer par trois. Un grand bâtiment permet d’agrandir davantage la société.',
  biz:'Réglez ici l’équipe, les prix, le stock et la sécurité. « Ce qui fait vos ventes » explique le résultat.'
};
function tip(k){ if(!S.tut||S.tut['t_'+k]||(S.tut.off&&!S.tut.fin)) return ''; return '<div class="notice info tipn">'+TIPS[k]+' '+btn('Compris','tipok',{c:'sm ghost',i:k})+'</div>'; }
Object.assign(ACT,{
  tutoff:()=>{ S.tut.off=true; after(); },
  tipok:el=>{ S.tut['t_'+el.dataset.i]=1; after(); }
});

