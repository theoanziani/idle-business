/* ============================================================
   ÉLECTRONIQUE : la ligne de puces et le smartphone dans la fiche
   ============================================================ */
MET.electronics.html=function(b){
  const m=b.m, G=EL_GEN[m.g], y=elY(m);
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+(o&&o.l?' aria-label="'+esc(o.l)+'"':'')+'>'+lab+'</button>';
  let h='<div class="pk-head"><b>Ligne de production · '+G.n+'</b><span class="sub">Rendement '+Math.round(y*100)+' %</span></div>'+bar(y,y>.75?'g':y>.5?'':'a');
  const nx=EL_GEN[m.g+1]; if(nx){ const maxG= mxHas(b,5)? 4 : mxHas(b,2)? 2 : mxHas(b,1)? 1 : 0;
    h+='<div class="sub">'+(m.g+1>maxG? 'Prochaine gravure ('+nx.n+') : palier de maîtrise '+(m.g+1>=3?5:m.g+1)+' requis pour la recherche.' : 'Recherche vers '+nx.n+' : '+Math.min(100,Math.round(m.rp/nx.rp*100))+' %'+(m.rd? '' : ' (budget de recherche à zéro)')+'.')+'</div>'; }
  if(!m.ph) return h;
  const M=m.next||m.mod||{e:2,p:2,pr:600,g:m.g,pro:0}, sc=elScore(b,Object.assign({},M,{g:m.g})), rv=elRival();
  const T=Object.assign({},M,{g:m.g}), u=elPhoneDemand(b,T,S.day), cost=elPhoneCost(T);
  const seg=(lab,k,val,n)=>'<div class="met-c"><b>'+lab+'</b><div class="seg">'+[1,2,3].map(v=>'<button class="'+(val===v?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="set" data-j="'+k+':'+v+'">'+n[v-1]+'</button>').join('')+'</div></div>';
  h+='<div class="pk-head"><b>Smartphone'+(m.mod?' en vente':'')+'</b><span class="sub">'+(m.mod? 'Note '+Math.round(elScore(b,m.mod))+' · '+eur(m.mod.pr,0) : 'Aucun modèle en vente')+'</span></div>';
  h+='<div class="pk-pan"><b>'+(m.mod? 'Modèle de l’an prochain (lancé à la mi-septembre)' : 'Votre premier modèle')+'</b>'+
    seg('Écran','e',M.e,['Standard','OLED','OLED 120 Hz'])+seg('Appareil photo','p',M.p,['Simple','Double','Triple et zoom'])+
    '<div class="met-c"><b>Prix : '+eur(M.pr,0)+'</b><div class="seg">'+[[-100,'−100 €'],[-20,'−20 €'],[20,'+20 €'],[100,'+100 €']].map(([v,n])=>'<button data-a="met" data-i="'+b.id+'" data-v="set" data-j="pr:'+v+'">'+n+'</button>').join('')+'</div></div>'+
    (mxHas(b,4)? '<label class="fc-tg"><span>Modèle Pro (finitions haut de gamme)</span><input type="checkbox" data-a="met" data-i="'+b.id+'" data-v="set" data-j="pro:'+(M.pro?0:1)+'" '+(M.pro?'checked':'')+'></label>' : '')+
    '<div class="sub">Puce '+G.n+' · note '+Math.round(sc)+' contre '+Math.round(rv)+' pour les rivaux · coût '+eur(cost,0)+' par téléphone · environ '+fmtN(Math.round(u*7))+' ventes par semaine hors lancement.</div>'+
    (!m.mod? '<div>'+B('Lancer ce modèle','now','',{c:'sm pri'})+'</div>' : '')+'</div>';
  return h;
};

