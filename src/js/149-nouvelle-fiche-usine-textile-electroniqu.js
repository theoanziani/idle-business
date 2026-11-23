/* ============================================================
   NOUVELLE FICHE · USINE TEXTILE, ÉLECTRONIQUE, FERME
   Une vue propre au métier (les portants, la plaquette de silicium, les parcelles), puis
   l'écran complet du métier.
   ============================================================ */
NF_CSS.push(`
.md.nf-textile{--nf-bg:#F3F1F7;--nf-bg2:#DED9EA;--nf-acc:#5B3FA0;--nf-acc2:#3E2A73;--nf-h:#2E2152;--nf-hf:600 19px 'Rubik','Baloo 2',sans-serif;--nf-sh:#DED9EA}
.tx2-rail{background:#fff;border-radius:20px;padding:12px;box-shadow:0 4px 0 var(--nf-sh)}
.tx2-bar{height:5px;border-radius:3px;background:#B8B2C8;margin:4px 6px 0}
.tx2-rack{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding:0 2px}
.tx2-rack::-webkit-scrollbar{display:none}
.tx2-g{flex:0 0 84px;text-align:center;font:800 11.5px var(--fb);color:var(--ink)}
.tx2-g svg{display:block;margin:0 auto;width:72px;height:auto}
.tx2-g small{display:block;font:700 10.5px var(--fb);color:var(--ink-3)}
.tx2-g .p{height:4px;border-radius:2px;background:#ECE8F3;margin:4px 8px 0;overflow:hidden}.tx2-g .p i{display:block;height:100%;background:#5B3FA0}
.tx2-rolls{display:flex;gap:10px;justify-content:space-around;margin-top:12px;padding-top:10px;border-top:1px solid #ECE8F3}
.tx2-rolls div{text-align:center;font:800 11px var(--fb);color:var(--ink-3)}
.tx2-rolls svg{display:block;width:62px;height:auto;margin:0 auto 2px}
.md.nf-electronics{--nf-bg:#EEF3F8;--nf-bg2:#D3DEEA;--nf-acc:#0B6E8A;--nf-acc2:#074C60;--nf-h:#0B2A3A;--nf-hf:500 18px 'Space Grotesk','Baloo 2',sans-serif;--nf-sh:#D3DEEA}
.el2-fab{display:flex;gap:12px;align-items:center;background:#0B1E2A;border-radius:20px;padding:12px;box-shadow:0 4px 0 #05121A;color:#CFE6F0}
.el2-fab .w{flex:0 0 132px}
.el2-fab .w svg{display:block;width:132px;height:132px}
.el2-fab b{font:500 30px 'Space Grotesk',sans-serif;color:#fff;display:block}
.el2-fab small{display:block;font-size:12px;color:#9FC3D3}
.el2-gen{display:flex;align-items:center;margin-top:10px}
.el2-gen span{flex:0 0 auto;font:800 10.5px var(--fb);color:#9FC3D3;background:rgba(255,255,255,.08);border-radius:8px;padding:4px 6px}
.el2-gen span.on{background:#2BD1E0;color:#0B1E2A}
.el2-gen i{flex:1;height:2px;background:rgba(255,255,255,.15)}
.el2-rp{height:6px;border-radius:3px;background:rgba(255,255,255,.12);margin-top:6px;overflow:hidden}.el2-rp i{display:block;height:100%;background:#2BD1E0}
.el2-ph{display:flex;gap:12px;align-items:center;margin-top:10px}
.el2-ph svg{width:70px;height:auto;flex:0 0 auto}
.md.nf-farm{--nf-bg:#F4F1E6;--nf-bg2:#E2DAC3;--nf-acc:#4E7A2A;--nf-acc2:#365A1A;--nf-h:#3A4A1C;--nf-hf:400 22px 'Patrick Hand','Baloo 2',sans-serif;--nf-sh:#E2DAC3}
.fm2-map{background:#8DB36A;border-radius:22px;padding:8px;box-shadow:0 4px 0 #5F8A3E}
.fm2-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.fm2-p{position:relative;border-radius:10px;overflow:hidden;aspect-ratio:1;background:#A5814F}
.fm2-p svg{display:block;width:100%;height:100%}
.fm2-p em{position:absolute;left:3px;right:3px;bottom:3px;font:800 9.5px var(--fb);font-style:normal;color:#fff;background:rgba(0,0,0,.45);border-radius:5px;padding:1px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fm2-p.empty{background:repeating-linear-gradient(0deg,#9C7A48 0 6px,#8E6E40 6px 12px)}
.fm2-p.lock{background:repeating-linear-gradient(45deg,#7FA35E 0 6px,#77995A 6px 12px);display:grid;place-items:center;color:#fff;font:800 11px var(--fb)}
.fm2-bld{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-top:8px}
.fm2-bld::-webkit-scrollbar{display:none}
.fm2-bld div{flex:0 0 auto;background:rgba(255,255,255,.85);border-radius:12px;padding:4px 8px 6px;text-align:center;font:800 10.5px var(--fb);color:var(--ink)}
.fm2-bld div.off{opacity:.45}
.fm2-bld svg{display:block;width:56px;height:auto;margin:0 auto}
`);
NF_CSS.push(`
.tx2-capl{display:flex;align-items:center;gap:10px;font:800 12.5px var(--fb);color:var(--ink)}
.tx2-capl i{flex:1;height:8px;border-radius:4px;background:#ECE8F3;overflow:hidden}.tx2-capl em{display:block;height:100%}
.tx2-plan{margin-top:6px}
.tx2-pl{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #ECE8F3}
.tx2-pl:first-child{border-top:0}
.tx2-pl svg{flex:0 0 auto}
.tx2-pl .t{flex:1;min-width:0}.tx2-pl b{display:block;font:800 13.5px var(--fb)}.tx2-pl small{font:700 11.5px var(--fb);color:var(--ink-3)}
.tx2-pl small.up{color:#16804D}.tx2-pl small.dn{color:#C8352A}
.tx2-pl .q{display:flex;align-items:center;gap:2px;flex:0 0 auto}
.tx2-pl .q b{min-width:52px;text-align:center;font:800 15px var(--fd)}
.tx2-q{width:44px;height:44px;border:0;border-radius:12px;background:#F3F1F7;color:#5B3FA0;font:800 18px var(--fb);padding:0}
.tx2-roll{border:0;background:none;padding:4px;border-radius:14px;font:800 11px var(--fb);color:var(--ink);text-align:center;flex:1}
.tx2-roll.on{background:#F3F1F7;box-shadow:inset 0 0 0 2px #5B3FA0}
.tx2-roll small{display:block;font:700 10px var(--fb);color:var(--ink-3)}
.tx2-show{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.tx2-show button{flex:1 1 30%;border:0;border-radius:12px;background:#F3F1F7;min-height:44px;font:800 12px var(--fb);color:#3E2A73}
.fm2-p{border:0;padding:0;font:inherit;width:100%}
.fm2-p.sel{box-shadow:0 0 0 3px #FFC93C}
.fm2-p.empty em{text-align:center;background:rgba(0,0,0,.25)}
.fm2-p.buy{color:#fff;font:800 12px var(--fb);background:repeating-linear-gradient(45deg,#6F9A4E 0 6px,#678F48 6px 12px);box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
.fm2-pb{position:absolute;left:4px;right:4px;top:4px;height:4px;border-radius:2px;background:rgba(0,0,0,.25);overflow:hidden}.fm2-pb i{display:block;height:100%;background:#FFC93C}
.fm2-pan{margin-top:10px}
.fm2-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.md.nf-farm .fm2-acts .nf-b{flex:1 1 auto}
.fm2-crops{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}
.fm2-cr{position:relative;border:0;border-radius:14px;background:#F4F1E6;padding:6px;text-align:left;font:inherit;color:var(--ink);min-height:44px}
.fm2-cr[disabled]{opacity:.5}
.fm2-cr .im{display:block;height:48px;border-radius:10px;overflow:hidden}.fm2-cr .im svg{display:block;width:100%;height:100%}
.fm2-cr b{display:block;font:800 13px var(--fb);margin-top:4px}.fm2-cr small{display:block;font-size:11px;color:var(--ink-3)}
.fm2-cr em{position:absolute;top:10px;right:10px;font:800 10.5px var(--fb);font-style:normal;background:rgba(255,255,255,.9);border-radius:6px;padding:1px 6px}
`);
NF_CSS.push(`
.el2-ph2{display:flex;gap:12px;align-items:center;background:linear-gradient(135deg,#0B1E2A,#13394B);border-radius:20px;padding:12px;color:#CFE6F0;box-shadow:0 4px 0 #05121A;margin-bottom:10px}
.el2-ph2 .ph{flex:0 0 120px}
.el2-ph2 .sp{flex:1;min-width:0}.el2-ph2 b{display:block;font:500 17px 'Space Grotesk',sans-serif;color:#fff}.el2-ph2 small{display:block;font-size:12px;color:#9FC3D3}
.el2-ph2 .sc{margin-top:10px}.el2-ph2 .sc span{font:800 13px var(--fb);color:#fff}
.el2-ph2 .sc i{position:relative;display:block;height:8px;border-radius:4px;background:rgba(255,255,255,.12);margin:5px 0 3px}
.el2-ph2 .sc em{display:block;height:100%;border-radius:4px;background:#2BD1E0}
.el2-ph2 .sc u{position:absolute;top:-4px;width:3px;height:16px;background:#FF8A7D;border-radius:2px}
.el2-pr{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px}
.el2-pr button{width:50px;height:44px;border:0;border-radius:12px;background:#EEF3F8;color:#0B6E8A;font:800 13px var(--fb);padding:0}
.el2-pr b{min-width:84px;text-align:center;font:500 24px 'Space Grotesk',sans-serif}
`);
NF_FONTS.push('rubik:Rubik:600','spaceg:Space Grotesk:500','patrick:Patrick Hand:400');
const TX2_K={cla:'shirt',spo:'hoodie',min:'tee',boh:'dress',str:'street',vin:'denim'}, TX2_C={cla:'#E9ECF3',spo:'#5B3FA0',min:'#D9D3C7',boh:'#C86B5A',str:'#2A2A30',vin:'#3C5A8A'};
FX2.textile={
  chip:b=>{ const left=90-((S.day-1)%90); return 'Soldes dans '+plu(left,'jour'); },
  stat:b=>{ const SA=b.m.sale; let so=0; if(SA) Object.values(SA.sold).forEach(x=>so+=x); return ['Vendu cette saison',txP(b,so)+' pièces']; },
  noRest:true,
  dlg:{txt:'peut planifier les collections et vendre la production à votre place'},
  body(b,X,U){ const m=b.m, SA=m.sale, P=m.plan, PR=m.prod, G=NFA.textile, cap=Math.floor(txCapOf(b,P)), tot=Object.values(P.qty).reduce((a,x)=>a+x,0); let h='';
    const nm=k=>k==='cap'?'Capsule':(TX_ST.find(s=>s.id===k)||{}).n;
    const gar=(k,w)=>G.garment(TX2_K[k]||'tee',TX2_C[k]||'#D9D3C7',w,1).replace('<svg ','<svg style="width:'+w+'px;height:auto" ');
    /* 1. le portant : la saison en vente */
    if(SA){ let so=0; Object.values(SA.sold).forEach(x=>so+=x);
      h+=nfSec('Le portant','en vente : '+esc(txSeasonName(SA.q)).toLowerCase()+' · '+txP(b,so)+' vendues')+'<div class="tx2-rail"><div class="tx2-bar"></div><div class="tx2-rack">'+Object.keys(SA.stock).filter(k=>(SA.stock[k]||0)+(SA.sold[k]||0)>=.5).map(k=>{ const st=SA.stock[k]||0, v=SA.sold[k]||0;
        return '<div class="tx2-g">'+gar(k,72)+esc(nm(k))+'<small>'+txP(b,v)+' / '+txP(b,v+st)+' vendues</small><span class="p" style="display:block"><i style="width:'+Math.round(v/Math.max(1,v+st)*100)+'%"></i></span></div>'; }).join('')+'</div>'+
        '<div class="nf-row" style="margin-top:8px"><small>Ce qui reste au dernier jour part en soldes à 40 % du prix. En fabrication : '+esc(txSeasonName(PR.q)).toLowerCase()+', '+txP(b,Object.values(PR.qty).reduce((a,x)=>a+x,0))+' pièces'+(PR.caps?' et une capsule':'')+'.</small></div></div>'; }
    /* 2. l'atelier de coupe : la saison à préparer */
    const Bq=(id,dv,l)=>'<button class="tx2-q" data-a="met" data-i="'+b.id+'" data-v="q" data-j="'+id+':'+dv+'" aria-label="'+esc(l)+'">'+(dv>0?'+':'−')+'</button>';
    h+=nfSec('L’atelier de coupe','à préparer : '+esc(txSeasonName(P.q)).toLowerCase())+'<div class="nf-card"><div class="tx2-capl"><span>'+txP(b,tot)+' / '+txP(b,cap)+' pièces</span><i><em style="width:'+Math.round(clamp(tot/Math.max(1,cap),0,1)*100)+'%;background:'+(tot>cap?'#C8352A':'#5B3FA0')+'"></em></i></div>'+
      '<div class="tx2-plan">'+TX_ST.map(st=>{ const f=P.fc[st.id], n=P.qty[st.id]||0, tr=txTrend(f);
        return '<div class="tx2-pl">'+gar(st.id,54)+'<span class="t"><b>'+esc(st.n)+(P.show===st.id?' · défilé':'')+'</b><small class="'+(f>=1.15?'up':f<.8?'dn':'')+'">tendance '+esc(tr).toLowerCase()+'</small></span><span class="q">'+Bq(st.id,-5,'Moins de '+st.n)+'<b>'+txP(b,n)+'</b>'+Bq(st.id,5,'Plus de '+st.n)+'</span></div>'; }).join('')+'</div>'+
      '<div class="nf-row" style="margin-top:10px"><small>Les prévisions sont '+(m.bur?'assez fiables':'approximatives')+'.</small><button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="fill" data-j="">Répartir selon les prévisions</button></div></div>';
    /* 3. les tissus et la vente */
    const segH=(lab,act,L,val,sub)=>'<div class="nf-ctl" style="margin-top:12px">'+nfRowH(lab,'')+'<div class="nf-seg">'+L.map(([v,n])=>'<button class="'+(String(val)===String(v)?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+v+'">'+n+'</button>').join('')+'</div>'+(sub?'<div class="nf-row" style="margin-top:4px"><small>'+sub+'</small></div>':'')+'</div>';
    h+=nfSec('Les tissus','pour la saison à préparer')+'<div class="nf-card"><div class="tx2-rolls" style="margin:0;padding:0;border:0">'+TX_MAT.map(x=>'<button class="tx2-roll'+(P.mat===x.id?' on':'')+'" data-a="met" data-i="'+b.id+'" data-v="mat" data-j="'+x.id+'">'+G.roll(x.id==='syn'?'#6A8BC8':x.id==='bio'?'#8FB36A':'#EDE6D6',x.id==='syn'?'soie':'lin',62,x.n.split(' ')[1]||x.n).replace('<svg ','<svg style="width:62px;height:auto" ')+esc(x.n)+'<small>'+(x.c===1?'prix de base':(x.c>1?'+':'−')+Math.round(Math.abs(x.c-1)*100)+' % de coût')+'</small></button>').join('')+'</div>'+
      '<div class="nf-row" style="margin-top:6px"><small>'+({cot:'Le choix de base.',bio:'Coûte 30 % de plus, se vend 22 % plus cher.',syn:'25 % moins cher à produire, vendu 15 % moins cher.'}[P.mat])+'</small></div>'+
      segH('Sous-traitance','sub',TX_SUB.map(x=>[x.id,x.n]),P.sub,{non:'Uniquement votre usine.',low:'+50 % de capacité à bas prix, mais risque de scandale.',eth:'+30 % de capacité, un peu plus cher, sans risque.'}[P.sub])+
      segH('Vendu d’avance aux grossistes','gros',TX_GROS.map((v,i)=>[i,Math.round(v*100)+' %']),P.gros,'Cette part est vendue dès l’ouverture de la saison, à 80 % du prix : pas de risque d’invendus.')+'</div>';
    /* 4. capsule et défilé */
    if(mxHas(b,3)||mxHas(b,5)){ h+=nfSec('Capsule et défilé')+'<div class="nf-card nf-list">';
      if(mxHas(b,3)) h+=nfRowH('Collection capsule','une petite série avec un créateur, vendue deux fois plus cher',P.caps? '<span class="nf-ok">Prévue</span>' : '<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="caps" data-j="">'+eur(bizDef(b).cost*.3,0)+'</button>');
      if(mxHas(b,5)) h+= P.show? nfRowH('Défilé de la saison','style mis en avant : '+esc(TX_ST.find(x=>x.id===P.show).n).toLowerCase()) : '<div class="nf-ctl">'+nfRowH('Défilé de la saison',eur(bizDef(b).cost*.5,0)+' : le style choisi gagne 40 % de demande')+'<div class="tx2-show">'+TX_ST.map(x=>'<button data-a="met" data-i="'+b.id+'" data-v="show" data-j="'+x.id+'">'+esc(x.n)+'</button>').join('')+'</div></div>';
      h+='</div>'; }
    ['q','fill','mat','sub','gros','caps','show'].forEach(a=>X.get(a));
    h+=nfRest(b,X,'Réglages de l’usine');
    return h; }
};

FX2.electronics={
  chip:b=>'Gravure '+EL_GEN[b.m.g].n,
  stat:b=>['Rendement',Math.round(elY(b.m)*100)+' %'],
  noRest:true,
  dlg:{txt:'peut piloter la recherche et la production à votre place'},
  body(b,X,U){ const m=b.m, E=NFA.elec, y=elY(m), nx=EL_GEN[m.g+1], WF=E.wafer(y,132,m.g+3+b.id); let h='';
    h+=nfSec('La salle blanche',(1+(m.salles||0))+' salle'+((m.salles||0)?'s':'')+' · matières rares '+Math.round(m.ri*100)+' %')+'<div class="el2-fab"><span class="w">'+WF.svg.replace('<svg ','<svg style="width:132px;height:132px" ')+'</span><span><small>Rendement</small><b>'+Math.round(y*100)+' %</b><small>'+WF.ok+' puces bonnes sur '+WF.n+' sur cette plaquette de silicium</small></span></div>';
    const maxG= mxHas(b,5)? 4 : mxHas(b,2)? 2 : mxHas(b,1)? 1 : 0;
    h+=nfSec('La recherche','gravure')+'<div class="nf-card"><div class="el2-gen">'+EL_GEN.map((g,i)=>(i?'<i></i>':'')+'<span class="'+(i<=m.g?'on':'')+'">'+g.n+'</span>').join('')+'</div>'+
      (nx? '<div class="el2-rp" style="background:#E4ECF3"><i style="width:'+Math.min(100,Math.round(m.rp/nx.rp*100))+'%"></i></div><div class="nf-row" style="margin-top:6px"><small>'+(m.g+1>maxG? 'Prochaine gravure ('+nx.n+') : palier '+(m.g+1>=3?5:m.g+1)+' requis pour la recherche.' : 'Recherche vers '+nx.n+' : '+Math.min(100,Math.round(m.rp/nx.rp*100))+' %'+(m.rd?'':' (budget de recherche à zéro)')+'.')+'</small></div>' : '<div class="nf-row" style="margin-top:6px"><small>La gravure la plus fine.</small></div>')+
      (X.has('rd')? '<div class="nf-ctl" style="margin-top:8px">'+nfRowH('Budget de recherche','')+nfSegH(b,X.get('rd'))+'</div>' : '')+'</div>';
    if(m.ph){ X.get('set'); X.get('now');
      const M=m.next||m.mod||{e:2,p:2,pr:600,g:m.g,pro:0}, T=Object.assign({},M,{g:m.g}), sc=elScore(b,T), rv=elRival(), u=elPhoneDemand(b,T,S.day), cost=elPhoneCost(T);
      const sb=(k,v,n)=>'<button class="'+(M[k]===v?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="set" data-j="'+k+':'+v+'">'+n+'</button>';
      h+=nfSec('Le smartphone',m.mod? 'en vente · note '+Math.round(elScore(b,m.mod)) : 'premier modèle')+'<div class="el2-ph2"><div class="ph">'+E.phone(M.e,M.p,120,M.pro?'#C9A86A':'#2b2f45').replace('<svg ','<svg style="width:120px;height:auto" ')+'</div><div class="sp"><b>'+(m.mod?'Modèle de l’an prochain':'Votre premier modèle')+'</b><small>'+(m.mod?'lancé à la mi-septembre':'puce '+EL_GEN[m.g].n)+'</small>'+
        '<div class="sc"><span>Note '+Math.round(sc)+'</span><i><em style="width:'+Math.round(clamp(sc/(Math.max(sc,rv)*1.15),0,1)*100)+'%"></em><u style="left:'+Math.round(clamp(rv/(Math.max(sc,rv)*1.15),0,1)*100)+'%"></u></i><small>rivaux : '+Math.round(rv)+'</small></div></div></div>'+
        '<div class="nf-card"><div class="nf-ctl">'+nfRowH('Écran','')+'<div class="nf-seg">'+sb('e',1,'Standard')+sb('e',2,'OLED')+sb('e',3,'OLED 120 Hz')+'</div></div>'+
        '<div class="nf-ctl" style="margin-top:10px">'+nfRowH('Appareil photo','')+'<div class="nf-seg">'+sb('p',1,'Simple')+sb('p',2,'Double')+sb('p',3,'Triple et zoom')+'</div></div>'+
        '<div class="el2-pr"><button data-a="met" data-i="'+b.id+'" data-v="set" data-j="pr:-100" aria-label="Baisser de 100 €">−100</button><button data-a="met" data-i="'+b.id+'" data-v="set" data-j="pr:-20" aria-label="Baisser de 20 €">−20</button><b>'+eur(M.pr,0)+'</b><button data-a="met" data-i="'+b.id+'" data-v="set" data-j="pr:20" aria-label="Monter de 20 €">+20</button><button data-a="met" data-i="'+b.id+'" data-v="set" data-j="pr:100" aria-label="Monter de 100 €">+100</button></div>'+
        (mxHas(b,4)? nfRowH('Modèle Pro','finitions haut de gamme','<button class="nf-tog'+(M.pro?' on':'')+'" data-a="met" data-i="'+b.id+'" data-v="set" data-j="pro:'+(M.pro?0:1)+'" role="switch" aria-checked="'+(!!M.pro)+'" aria-label="Modèle Pro"></button>') : '')+
        '<div class="nf-row" style="margin-top:8px"><small>Coût '+eur(cost,0)+' par téléphone · environ '+fmtN(Math.round(u*7))+' ventes par semaine hors lancement.</small></div>'+
        (!m.mod? '<button class="btn nf-b a w" style="margin-top:10px" data-a="met" data-i="'+b.id+'" data-v="now" data-j="">Lancer ce modèle</button>' : '')+'</div>'; }
    h+=nfRest(b,X,'Réglages de l’usine');
    return h; }
};

const FM2_K={ble:'ble',mais:'mais',tourn:'tourn',leg:'leg',verger:'verger',vigne:'vigne',vaches:'vaches',poules:'poules'};
FX2.farm={
  chip:b=>{ const wx=metWeather(b.city); return MET_WXN[wx]+' · '+metSeasonName().toLowerCase(); },
  stat:b=>['Production moyenne',eur(fmAvgDay(b),0)+' / j'],
  noRest:true,
  mgmt:{local:'Terres'},
  dlg:{txt:'peut semer, récolter et vendre à votre place'},
  body(b,X,U){ const m=b.m, F=NFA.farm, own=fmOwn(b), R0=metR0(b), sel=fmSel(b); let h='';
    const B=(lab,act,arg,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o.dis?' disabled':'')+(o.dis&&o.why?' data-why="'+esc(o.why)+'"':'')+'>'+lab+'</button>'; };
    h+=nfSec('Les parcelles',m.ready>0? eur(m.ready,0)+' de récolte à vendre' : m.p.filter(Boolean).length+' / '+own+' en culture')+'<div class="fm2-map"><div class="fm2-g">'+Array.from({length:12},(_,i)=>{ const x=m.p[i];
      if(i>=own) return i===own&&own<12? '<button class="fm2-p lock buy" data-a="nfui" data-i="'+b.id+'" data-v="plot">+ acheter</button>' : '<div class="fm2-p lock">à acheter</div>';
      if(!x) return '<button class="fm2-p empty'+(i===sel?' sel':'')+'" data-a="fmsel" data-i="'+b.id+'" data-v="'+(i===sel?-1:i)+'"><em>libre · semer</em></button>';
      const c=fmCrop(x.c), st=fmStage(b,x), on=U.p!==undefined&&+U.p===i;
      return '<button class="fm2-p'+(on?' sel':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="p" data-j="'+i+'">'+F.parcel(FM2_K[x.c]||'leg',x.wait?0:st.p,80,80,i+1).replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ')+'<em>'+esc(c?c.n:x.c)+(x.dmg>.05?' · −'+Math.round(x.dmg*100)+' %':'')+'</em><span class="fm2-pb"><i style="width:'+Math.round(st.p*100)+'%"></i></span></button>'; }).join('')+'</div>'+
      '<div class="fm2-bld">'+Object.keys(FM_MAC).concat(Object.keys(FM_TR)).map(k=>{ const on=(m.mac&&m.mac[k])||(m.tr&&m.tr[k]), n=(FM_MAC[k]||FM_TR[k]).n; return '<div class="'+(on?'':'off')+'">'+F.bld(k,56).replace('<svg ','<svg style="width:56px;height:auto" ')+esc(n)+'</div>'; }).join('')+'</div></div>';
    /* panneau : parcelle cultivée */
    if(U.p!==undefined&&U.p!==null&&m.p[+U.p]){ const i=+U.p, x=m.p[i], c=fmCrop(x.c), st=fmStage(b,x);
      h+='<div class="nf-card fm2-pan"><div class="nf-row"><span><b>Parcelle '+(i+1)+' · '+esc(c.n)+'</b><small>'+esc(st.t)+(x.dmg>.05?' · récolte −'+Math.round(x.dmg*100)+' %':'')+'</small></span></div><div class="fm2-acts">'+
        (c.k==='cult'? '<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="auto" data-j="'+i+'">Resemis automatique : '+(x.auto?'activé':'désactivé')+'</button>' : '')+B('Libérer la parcelle','clear',i)+'</div></div>'; }
    /* panneau : semer une parcelle libre */
    if(sel>=0&&!m.p[sel]){ h+='<div class="nf-card fm2-pan"><div class="nf-row"><span><b>Parcelle '+(sel+1)+' · que planter ?</b><small>'+metSeasonName()+'</small></span><button class="nf-lnk" data-a="fmsel" data-i="'+b.id+'" data-v="-1">Fermer</button></div><div class="fm2-crops">'+FM_CROP.map(c=>{ const ok=fmCanSow(b,c), cost=bizDef(b).cost*(c.plant||0), v=fmScore(b,c)*R0;
        return '<button class="fm2-cr" data-a="met" data-i="'+b.id+'" data-v="sow" data-j="'+sel+':'+c.id+'"'+(!ok||!nfCan(b,cost)?' disabled':'')+(!ok?' data-why="Hors saison pour '+esc(c.n.toLowerCase())+'."':'')+'><span class="im">'+F.parcel(FM2_K[c.id]||'leg',.8,64,48,c.id.length).replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ')+'</span><b>'+esc(c.n)+'</b><small>'+(ok? 'environ '+eur(v,0)+' net / j' : 'hors saison')+'</small><em>'+(cost? eur(cost,0) : 'gratuit')+'</em></button>'; }).join('')+'</div></div>'; }
    /* panneau : acheter une parcelle */
    if(U.plot&&own<12){ const pc=fmPlotCost(b), lock=own>=8&&!mxHas(b,5);
      h+='<div class="nf-card fm2-pan">'+nfRowH('Agrandir le domaine',lock?'palier 5 requis pour aller au-delà de 8 parcelles':'une parcelle de plus',B('Acheter · '+eur(pc,0),'plot','',{a:1,dis:lock||!nfCan(b,pc),why:lock?'Palier 5 requis.':'Trésorerie insuffisante.'}))+'</div>'; }
    ['sow','clear','auto','plot'].forEach(a=>X.get(a));
    h+=nfRest(b,X,'Les bâtiments et la ferme');
    return h; }
};


