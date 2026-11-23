/* ============================================================
   NOUVELLE FICHE · CONCESSION : la marque, le showroom, le parc d'occasions, l'atelier
   ============================================================ */
NF_CSS.push(`
.md.nf-dealer{--nf-bg:#F1F2F4;--nf-bg2:#DADDE2;--nf-acc:#D3262E;--nf-acc2:#9C1A20;--nf-h:#2A2E36;--nf-hf:500 22px 'Barlow Condensed','Baloo 2',sans-serif;--nf-sh:#DADDE2;--nf-h1:600 30px/1 'Barlow Condensed','Baloo 2',sans-serif}
.md.nf-dealer .nf-sec{letter-spacing:.04em}
.dl2-br{display:flex;gap:12px;align-items:center}
.dl2-br .lg{width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#C9CED6);box-shadow:inset 0 0 0 3px #9AA2AE;display:grid;place-items:center;font:600 26px 'Barlow Condensed',sans-serif;color:#1F3C88;flex:0 0 auto}
.dl2-br b{font:800 16px var(--fb)}.dl2-br small{display:block;font-size:12.5px;color:var(--ink-3)}
.dl2-obj{display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-3);margin-top:12px}
.dl2-obj b{color:var(--ink)}
.dl2-road{position:relative;height:22px;border-radius:11px;background:#3B414C;margin-top:6px;overflow:hidden}
.dl2-road::before{content:'';position:absolute;left:8px;right:24px;top:10px;border-top:2px dashed rgba(255,255,255,.45)}
.dl2-road i{position:absolute;left:0;top:0;bottom:0;background:#B4252C}
.dl2-road em{position:absolute;top:2px;font-style:normal;font-size:12px}
.dl2-road span{position:absolute;right:6px;top:2px;font-size:12px}
.dl2-show{background:#fff;border-radius:20px;padding:10px;box-shadow:0 4px 0 var(--nf-sh)}
.dl2-floor{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 8px;border:2px solid #E5E8EC;border-radius:14px;padding:8px;background:repeating-linear-gradient(90deg,#fff 0 40px,#F3F5F8 40px 80px)}
.dl2-car{display:flex;flex-direction:column;align-items:center;font:800 12px var(--fb);color:var(--ink);text-align:center;padding:4px 0}
.dl2-car svg{width:100%;height:auto;max-width:150px}
.dl2-car small{font:600 11px var(--fb);color:var(--ink-3)}
.dl2-slot{border:2px dashed #C9CED6;border-radius:12px;display:grid;place-items:center;min-height:90px;font:700 12px var(--fb);color:var(--ink-3);background:none}
.dl2-truck{display:flex;align-items:center;gap:10px;background:#3B414C;color:#fff;border-radius:14px;padding:10px 12px;margin-top:10px;font-size:12.5px}
.dl2-truck b{font:600 20px 'Barlow Condensed',sans-serif}
.dl2-truck svg{width:34px;height:22px;flex:0 0 auto}
.dl2-show .nf-row{margin-top:10px}
.dl2-show .acts{display:flex;gap:8px;margin-top:10px}
.md.nf-dealer .dl2-show .acts .nf-b{flex:1;min-width:0;padding:0 6px;font-size:12.5px}
.dl2-park{background:#3B414C;border-radius:20px;padding:10px;box-shadow:0 4px 0 #262A31;color:#E5E8EC}
.dl2-lot{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:3px solid #E5E8EC}
.dl2-lot>div{position:relative;border-left:3px solid #E5E8EC;padding:8px 4px 6px;text-align:center;min-height:86px}
.dl2-lot>div:nth-child(3n){border-right:3px solid #E5E8EC}
.dl2-lot svg{width:100%;height:auto}
.dl2-lot em{display:inline-block;font:700 13px 'Barlow Condensed',sans-serif;font-style:normal;background:#F2C94C;color:#2A1F05;border-radius:4px;padding:0 6px;margin-top:2px}
.dl2-lot em.old{background:#F08A6B}
.dl2-lot small{display:block;font:700 10px var(--fb);color:#AEB4BF}
.dl2-lot .w{position:absolute;top:4px;right:6px;width:14px;height:14px}
.dl2-park .nf-row{margin-top:10px;color:#C9CED6}.dl2-park .nf-row b{color:#fff}.dl2-park .nf-row small{color:#C9CED6}
.dl2-park .nf-seg{background:rgba(0,0,0,.25)}.dl2-park .nf-seg button{color:#E5E8EC}
.dl2-park .nf-tog:not(.on){background:rgba(0,0,0,.3)}
.dl2-park .hint{font-size:12px;color:#C9CED6;margin-top:6px}
.dl2-atl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.dl2-atl div{border-radius:14px;padding:10px 8px;background:#FFF5D6;text-align:center;font:800 12.5px var(--fb);min-height:70px}
.dl2-atl div.off{background:repeating-linear-gradient(45deg,#EEF0F3 0 6px,#E3E6EA 6px 12px);color:var(--ink-3)}
.dl2-atl div i{display:block;height:5px;border-radius:3px;background:#F2B705;margin:8px auto 0;width:60%}
.dl2-atl small{display:block;font:700 11px var(--fb);color:var(--ink-3);margin-top:3px}
`);
NF_FONTS.push('barlowc:Barlow Condensed:600');
const DL2_T=['citadine','berline','suv','break','coupe'], DL2_C=['#2B5BB5','#C8352A','#E9EBEE','#2A2E36','#1F8A8A','#E0A21B','#7A3FA0','#3D7A3A','#9AA2AE','#B5542B'];
const DL2_TN={citadine:'Citadine',berline:'Berline',suv:'SUV',break:'Break',coupe:'Coupé'};
const DL2_WR='<svg class="w" viewBox="0 0 16 16" aria-label="à remettre en état"><path d="M10.5 2a3.5 3.5 0 0 0-3.3 4.6L2.5 11.3a1.3 1.3 0 0 0 1.8 1.8l4.7-4.7A3.5 3.5 0 0 0 13.9 5l-2 2-1.8-.3L9.8 5l2-2A3.5 3.5 0 0 0 10.5 2z" fill="#F2C94C"/></svg>';
const DL2_TRUCK='<svg viewBox="0 0 34 22" aria-hidden="true"><rect x="1" y="3" width="21" height="13" rx="1.5" fill="#E5E8EC"/><path d="M22 7h6l4 5v4H22z" fill="#C8352A"/><circle cx="7" cy="18" r="3" fill="#111"/><circle cx="27" cy="18" r="3" fill="#111"/></svg>';
FX2.dealer={
  chip:b=>{ const h=b.m.h||[], t=h.length? h[h.length-1] : null; return 'Ouvert'+(t? ' · '+plu(t.n+t.u,'vente')+' hier' : ''); },
  stat:b=>{ const n=(b.m.h||[]).reduce((a,x)=>a+x.n+x.u,0); return ['Voitures vendues (30 j)',fmtN(n)]; },
  dlg:{txt:'peut commander, fixer les remises et gérer les reprises à votre place'},
  body(b,X,U){ const m=b.m, B=dlBr(b), Q=m.q, R0=metR0(b), C=NFA.cars.car; let h='';
    /* 1. la marque */
    X.get('brand'); const dleft=Math.max(0,Q.end-S.day), pr=clamp(Q.sold/Math.max(1,Q.obj),0,1);
    h+=nfSec('La marque','confiance '+Math.round(m.bt||0)+' / 100')+'<div class="nf-card"><div class="dl2-br"><span class="lg">'+esc(B.n.charAt(0))+'</span><span><b>'+esc(B.n)+'</b><small>'+esc(B.d)+' · marge '+Math.round(B.mg*100)+' % sur le neuf</small></span></div>'+
      '<div class="dl2-obj"><span>Objectif du trimestre : <b>'+Q.sold+' / '+Q.obj+' voitures</b></span><span>encore '+plu(dleft,'jour')+'</span></div><div class="dl2-road" role="img" aria-label="'+Math.round(pr*100)+' % de l’objectif"><i style="width:'+Math.round(pr*100)+'%"></i><em style="left:calc('+Math.round(pr*100)+'% - 18px)">'+C('citadine','#E9EBEE',22).replace('<svg ','<svg style="width:22px;height:auto" ')+'</em><span>⚑</span></div>'+
      '<div class="nf-row" style="margin-top:6px"><small>Objectif atteint : prime de la marque d’environ '+String(Math.round(B.pr*1000)/10).replace('.',NDEC)+' % des ventes de neuf du trimestre.</small></div>'+
      '<button class="btn nf-b w" style="margin-top:8px" data-a="dlbr" data-i="'+b.id+'">'+(ui.dlb===b.id?'Fermer':'Changer de marque')+'</button>';
    if(ui.dlb===b.id) h+='<div class="nf-list" style="margin-top:8px">'+Object.entries(DL_BR).filter(([k])=>k!==m.br).map(([k,x])=>{ const lock=x.rk&&!mxHas(b,x.rk); return nfRowH(esc(x.n),esc(x.d)+' · marge '+Math.round(x.mg*100)+' %'+(lock?' · palier '+x.rk:''),'<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="brand" data-j="'+k+'"'+(lock?' disabled':'')+'>Signer</button>'); }).join('')+'<div class="nf-row"><small>Nouveau contrat : '+eur(bizDef(b).cost*.3,0)+'. Le stock neuf actuel est soldé à 92 % de son prix d’achat.</small></div></div>';
    h+='</div>';
    /* 2. le showroom */
    X.get('ord'); const nN=dlNewN(m), inc=m.ord.reduce((a,o)=>a+o.n,0), unit=B.p*(1-B.mg), cAo=X.get('aord'), cR=X.get('rem'), shown=Math.min(5,nN);
    const typ=k=>DL2_T[(k+(m.br||'').length)%4];
    h+=nfSec('Le showroom','stock neuf : '+plu(nN,'voiture'))+'<div class="dl2-show"><div class="dl2-floor">'+Array.from({length:shown},(_,k)=>{ const t=typ(k), px=B.p*(t==='citadine'?.7:t==='suv'?1.22:t==='break'?1.05:1); return '<div class="dl2-car">'+C(t,DL2_C[(k*3+m.br.length)%DL2_C.length],150)+esc(DL2_TN[t])+'<small>'+eur(Math.round(px/100)*100,0)+'</small></div>'; }).join('')+
      (shown<6? '<button class="dl2-slot" data-a="met" data-i="'+b.id+'" data-v="ord" data-j="3"'+(nfCan(b,unit*3)?'':' disabled')+'>+ commander 3</button>' : '')+'</div>'+
      (inc? '<div class="dl2-truck">'+DL2_TRUCK+'<span>Camion de la marque : <b>'+plu(inc,'voiture')+'</b> livrées '+(m.ord.length? 'dans '+plu(Math.max(0,Math.min(...m.ord.map(o=>o.d))-S.day),'jour') : 'bientôt')+'</span></div>' : '')+
      '<div class="acts"><button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="ord" data-j="3"'+(nfCan(b,unit*3)?'':' disabled')+'>3 voitures · '+eur(unit*3,0)+'</button><button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="ord" data-j="10"'+(nfCan(b,unit*10)?'':' disabled')+'>10 · '+eur(unit*10,0)+'</button></div>'+
      (cAo? nfRowH('Commande automatique','garde environ trois semaines de ventes en stock',nfTogH(b,cAo)) : '')+
      (cR? '<div class="nf-ctl" style="margin-top:10px">'+nfRowH('Remise sur le neuf','')+nfSegH(b,cR)+'<div class="nf-row" style="margin-top:4px"><small>Chaque point de remise attire environ 7 % de clients en plus, mais la marge du neuf est faible.</small></div></div>' : '')+'</div>';
    /* 3. le parc d'occasions */
    X.get('auc'); const cRp=X.get('rp'), cMk=X.get('mk'), cAc=X.get('aoc'), mk=DL_MK[m.mk]||.1;
    h+=nfSec('Le parc d’occasions',plu(m.oc.length,'voiture'))+'<div class="dl2-park">'+(m.oc.length? '<div class="dl2-lot">'+m.oc.slice(0,9).map((o,k)=>{ const age=S.day-o.d, t=DL2_T[(o.mv+k)%5];
        return '<div>'+(o.rec?'':DL2_WR)+C(t,DL2_C[(o.mv>>3)%DL2_C.length],100)+'<em class="'+(age>60?'old':'')+'">'+eur(Math.round(o.mv*(1+mk)/100)*100,0)+'</em><small>'+age+' j</small></div>'; }).join('')+'</div>' : '<div class="hint">Aucune occasion : elles viennent des reprises ou des enchères.</div>')+
      (m.oc.length>9? '<div class="hint">et '+plu(m.oc.length-9,'autre voiture')+'</div>' : '')+
      '<button class="btn nf-b w" style="margin-top:10px" data-a="met" data-i="'+b.id+'" data-v="auc"'+(nfCan(b,40000)?'':' disabled')+'>Acheter 3 occasions aux enchères</button>'+
      (cRp? '<div class="nf-ctl">'+nfRowH('Reprises des anciennes voitures','')+nfSegH(b,cRp)+'</div>' : '')+(cMk? '<div class="nf-ctl">'+nfRowH('Marge sur l’occasion','')+nfSegH(b,cMk)+'</div>' : '')+
      (cAc? nfRowH('Achat automatique d’occasions','3 voitures aux enchères quand il en reste trop peu',nfTogH(b,cAc)) : '')+
      '<div class="hint">La clé indique une remise en état à faire. Une occasion non remise en état se vend moins cher, et une occasion qui traîne perd de la valeur.</div></div>';
    /* 4. l'atelier */
    const cA=X.get('atl'), d=dlDay(b,true);
    h+=nfSec('L’atelier après-vente','niveau '+m.atl+' sur 3')+'<div class="nf-card"><div class="dl2-atl">'+['Remise en état','Entretien client','Pont 3'].map((n,k)=>'<div class="'+(k>m.atl?'off':'')+'">'+n+'<small>'+(k<=m.atl? (k===0? String(Math.round(dlRecCap(b)*10)/10).replace('.',NDEC)+' voit. / j' : k===1? fmtN(Math.round(m.park))+' clients' : 'en service') : 'niveau '+(k+1))+'</small>'+(k<=m.atl?'<i></i>':'')+'</div>').join('')+'</div>'+
      '<div class="nf-row" style="margin-top:10px"><span><small>Entretien : '+eur(d.svcRev,0)+' / jour · forte marge sur le parc de vos clients'+(dlRepairLink()?' · +15 % grâce à votre atelier de réparation':'')+'.</small></span>'+(cA&&!cA.owned? nfBtn(b,cA,'Agrandir · '+eur(cA.cost,0),{c:'a',dis:!nfCan(b,cA.cost)}) : '<span class="nf-ok">Au maximum</span>')+'</div>';
    if(m.fo){ const fc=B.p*(1-B.mg)*m.fo.n; h+='<div class="nf-row" style="margin-top:10px;padding-top:10px;border-top:1px solid #EEF0F3"><span><b>Commande de flotte : '+m.fo.n+' voitures</b><small>vente à '+eur(B.p*.92*m.fo.n,0)+', achat '+eur(fc,0)+' · '+fcCountdown(m.fo.until).toLowerCase()+'</small></span><button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="fleet"'+(nfCan(b,fc)?'':' disabled')+'>Accepter</button></div>'; }
    X.get('fleet');
    h+='</div>';
    return h; }
};

