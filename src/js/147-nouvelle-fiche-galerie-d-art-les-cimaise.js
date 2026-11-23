/* ============================================================
   NOUVELLE FICHE · GALERIE D'ART : les cimaises, le courrier, la salle des ventes
   ============================================================ */
NF_CSS.push(`
.md.nf-gallery{--nf-bg:#F7F4EE;--nf-bg2:#E5DED0;--nf-acc:#6E1A2C;--nf-acc2:#4A0F1C;--nf-h:#2A2522;--nf-hf:700 22px 'Playfair Display',Georgia,serif;--nf-sh:#E5DED0;--nf-h1:italic 700 28px/1.05 'Playfair Display',Georgia,serif}
.ga2-wall{background:linear-gradient(#FBF8F2 0 82%,#D9D2C4 82%);border-radius:20px;padding:16px 12px 22px;box-shadow:0 4px 0 #E5DED0,inset 0 0 0 1px #E5DED0;position:relative}
.ga2-wall::before{content:'';position:absolute;left:12px;right:12px;top:8px;height:2px;background:#D6CFC1}
.ga2-hang{display:flex;gap:12px;overflow-x:auto;padding:8px 2px 4px;align-items:flex-end;scrollbar-width:none}
.ga2-hang::-webkit-scrollbar{display:none}
.ga2-art{flex:0 0 auto;text-align:center}
.ga2-art .fr{width:fit-content;padding:7px;background:linear-gradient(135deg,#F3DE9C,#C9A24B 30%,#8C6B26 55%,#D8B865 80%,#7A5A1C);box-shadow:inset 0 0 0 1.5px #FBEFC4,inset 0 0 0 3px #7A5A1C,inset 0 0 0 4.5px #E2C478,0 8px 12px rgba(0,0,0,.22);margin:0 auto;border-radius:2px}
.ga2-art .fr svg{display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.35),0 0 0 2px #5C4314}
.ga2-art.res .fr{filter:saturate(.75)}
.ga2-cart{margin-top:8px;background:#fff;border-radius:3px;padding:4px 6px;box-shadow:0 1px 2px rgba(0,0,0,.12);font-size:10.5px;color:var(--ink-3);text-align:left;width:118px}
.ga2-cart b{display:block;font:italic 700 12px 'Playfair Display',Georgia,serif;color:#2A2522;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ga2-cart em{display:block;font-style:normal;font-weight:800;color:var(--ink)}
.ga2-cart i{display:inline-block;margin-top:3px;font:800 9.5px var(--fb);font-style:normal;color:#C8352A;background:#FFE4E0;border-radius:4px;padding:1px 5px}
.ga2-cart i.ok{color:#16804D;background:#DFF5EA}
.ga2-emp{font-size:13px;color:var(--ink-3);padding:20px 4px}
.ga2-note{font-size:12.5px;color:var(--ink-3);margin-top:12px}
.md.nf-gallery .nf-leg .pk-head b{font:700 18px 'Playfair Display',Georgia,serif}
`);
function ga2Kind(w){ const t=(w.n||'').toLowerCase();
  if(/citron|nature morte|fruit/.test(t)) return 'lemons';
  if(/portrait|femme|lectrice|figure|nu\b|mains/.test(t)) return 'portrait';
  if(/hiver|paysage|rivage|baie|port|seine|jardin|fen[êe]tre/.test(t)) return 'winter';
  if(/rouge|abstraction|sans titre/.test(t)) return 'rothko';
  return ['geo','rothko','winter','lemons','portrait'][w.id%5]; }
function ga2Who(b,w){ if(w.o==='lux') return 'votre collection'; const a=w.a!==undefined&&gaArt(b,w.a); return a? a.n : 'artiste inconnu'; }
NF_CSS.push(`
.ga2-art{border:0;background:none;padding:0;font:inherit;color:inherit}
.ga2-art.sel .fr{outline:3px solid #6E1A2C;outline-offset:3px}
.ga2-act{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #E5DED0}
.ga2-act b{width:100%;font:italic 700 15px 'Playfair Display',Georgia,serif}
.ga2-act small{width:100%;font-size:12px;color:var(--ink-3);margin-top:-4px}
.md.nf-gallery .ga2-act .nf-b{flex:1 1 auto;min-width:0;font-size:12.5px;padding:0 10px}
.ga2-let{background:#FFFDF8;border-radius:6px;padding:12px 14px;box-shadow:0 3px 8px rgba(0,0,0,.08);border-left:4px solid #B8913F}
.ga2-let+.ga2-let{margin-top:8px}
.ga2-let .h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:var(--ink-3)}
.ga2-let p{margin:6px 0 8px;font:italic 600 15px/1.35 'Playfair Display',Georgia,serif;color:#2A2522}
.ga2-let .bt{display:flex;gap:8px;flex-wrap:wrap}
.md.nf-gallery .ga2-let .nf-b{flex:1 1 0;min-width:0;padding:0 8px;font-size:12.5px;white-space:normal;line-height:1.1}
.ga2-let .bt{flex-wrap:nowrap}
.ga2-room{background:radial-gradient(ellipse at 50% 0%,#8A1E30,#6E1423 55%,#4E0D18);border-radius:22px;padding:14px 12px;color:#F7E9EC;box-shadow:0 4px 0 #3A0911}
.ga2-room .hd{display:flex;justify-content:space-between;align-items:baseline}
.ga2-room .hd b{font:italic 700 19px 'Playfair Display',Georgia,serif}
.ga2-room .hd small{font-size:12px;color:#EBC9D0}
.ga2-lot{display:grid;grid-template-columns:24px 40px minmax(0,1fr);gap:8px;align-items:center;padding:8px 0;border-top:1px solid rgba(255,255,255,.12)}
.ga2-lot:first-of-type{border-top:0}
.ga2-lot .no{font:700 18px 'Playfair Display',serif;color:#E9C46A;text-align:center}
.ga2-lot .mini{display:block;width:40px;height:40px;padding:3px;background:linear-gradient(135deg,#F3DE9C,#C9A24B 40%,#8C6B26)}
.ga2-lot .mini svg{display:block;width:34px;height:34px}
.ga2-lot .t b{display:block;font:italic 600 13.5px 'Playfair Display',serif;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ga2-lot .t small{font-size:11px;color:#EBC9D0}
.ga2-lot .ctl{grid-column:2 / 4;display:flex;gap:6px;align-items:center}
.ga2-res{display:flex;flex:1;background:rgba(255,255,255,.1);border-radius:10px;padding:2px;gap:2px}
.ga2-res button{flex:1;border:0;background:none;color:#EBC9D0;font:800 11px var(--fb);border-radius:8px;min-height:40px;padding:0}
.ga2-res button.on{background:#F7E9EC;color:#6E1423}
.ga2-ib{width:44px;height:44px;border:0;border-radius:12px;background:rgba(255,255,255,.1);color:#F7E9EC;font:800 15px var(--fb);flex:0 0 auto;padding:0}
.ga2-room .note{font-size:12px;color:#EBC9D0;margin-top:10px}
.ga2-go{display:block;width:100%;margin-top:12px;border:0;border-radius:16px;min-height:54px;background:#F0D488;color:#4E0D18;font:700 18px 'Playfair Display',Georgia,serif;box-shadow:0 4px 0 #B8913F}
.ga2-go[disabled]{opacity:.55}
.ga2-room .last{margin-top:10px;font-size:12.5px;color:#F7E9EC}
.ga2-room .last button{border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:10px;min-height:40px;padding:0 12px;font:800 12px var(--fb);margin-left:6px}
.ga2-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ga2-two>div{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}
.ga2-two b{display:block;font:700 15px 'Playfair Display',Georgia,serif}
.ga2-two small{display:block;font-size:12px;color:var(--ink-3);margin-top:3px}
.ga2-two .bar{height:6px;border-radius:3px;background:#EFE8DC;margin-top:8px;overflow:hidden}.ga2-two .bar i{display:block;height:100%;background:#B8913F}
.ga2-em{margin-top:8px}
`);
FX2.gallery={
  chip:b=>{ const m=b.m; return m.sale? (S.day>=m.sale.ready? 'Vente prête à ouvrir' : 'Prochaine vente dans '+plu(m.sale.ready-S.day,'jour')) : plu(m.st.length,'œuvre')+' en réserve'; },
  stat:b=>['Notoriété',Math.round(b.m.not)+' / 100'],
  dlg:{txt:'peut accepter les dépôts et composer les ventes à votre place'},
  body(b,X,U){ const m=b.m, P=NFA.paint.paint, R0=metR0(b), can=x=>nfCan(b,x), exN=m.st.filter(w=>w.exp).length, cap=gaCap(b), maxL=gaMaxLots(b);
    const B=(v,j,lab,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'"'+(j!==undefined?' data-j="'+j+'"':'')+(o.dis?' disabled':'')+(o.dis&&o.why?' data-why="'+esc(o.why)+'"':'')+'>'+lab+'</button>'; };
    const sel=U.w? m.st.find(w=>w.id===+U.w) : null;
    let h='';
    /* 1. les cimaises */
    const W=m.st.slice().sort((a,c)=>(c.exp||0)-(a.exp||0)||gaEst(b,c)-gaEst(b,a));
    h+=nfSec('Les cimaises',exN+' / '+gaSlots(b)+' exposées · '+m.st.length+' / '+cap+' en réserve')+'<div class="ga2-wall">'+
      (W.length? '<div class="ga2-hang">'+W.map((w,k)=>{ const e=gaEst(b,w), wd=w.exp?90:74, ht=w.exp?(k%2?96:112):(k%2?66:84);
        return '<button class="ga2-art'+(w.exp?'':' res')+(sel&&sel.id===w.id?' sel':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="w" data-j="'+w.id+'" aria-label="'+esc(w.n)+'"><div class="fr">'+P(ga2Kind(w),wd,ht).replace('<svg ','<svg width="'+wd+'" height="'+ht+'" ')+'</div><div class="ga2-cart"><b>'+esc(w.n)+'</b>'+esc(ga2Who(b,w))+'<em>'+eur(e*.85,0)+' – '+eur(e*1.15,0)+'</em>'+(w.ex? '<i class="ok">expertisée</i>' : w.o==='dep'? '<i>non expertisée</i>' : '')+(w.exp?'':' <i class="ok" style="background:#EEF0F3;color:var(--ink-3)">en réserve</i>')+(m.cat.includes(w.id)||(m.sale&&m.sale.lots.includes(w.id))?' <i class="ok" style="background:#F6E2E6;color:#6E1A2C">au catalogue</i>':'')+'</div></button>'; }).join('')+'</div>' : '<div class="ga2-emp">Aucune œuvre : acceptez des dépôts de collectionneurs ci-dessous.</div>')+'</div>';
    if(sel){ const inS=m.sale&&m.sale.lots.includes(sel.id), inC=m.cat.includes(sel.id), ec=R0*.25;
      h+='<div class="nf-card ga2-act"><b>'+esc(sel.n)+'</b><small>'+esc(ga2Who(b,sel))+' · '+gaOrig(sel).toLowerCase()+' · estimation '+eur(gaEst(b,sel),0)+(sel.gk>1.005?' · cote +'+Math.round((sel.gk-1)*100)+' %':'')+'</small>'+
        B('show',sel.id,sel.exp?'Décrocher':'Exposer',{dis:!sel.exp&&exN>=gaSlots(b),why:'Toutes les cimaises sont occupées.'})+
        (inS? '' : B('cat',sel.id,inC?'Retirer de la vente':'Mettre en vente',{a:!inC,dis:!inC&&m.cat.length>=maxL,why:'Le catalogue est complet.'}))+
        (!sel.ex? B('exp',sel.id,'Expertiser · '+eur(ec,0),{dis:!can(ec)}) : '')+((sel.o==='lux'||sel.o==='coll')&&!inS? B('back',sel.id,'Reprendre') : '')+'</div>'; }
    else if(W.length) h+='<div class="ga2-note">Touchez une œuvre pour l’exposer, la mettre en vente ou la faire expertiser.</div>';
    /* 2. le courrier */
    if(m.off.length){ const who=['Un collectionneur','Une succession','Une collectionneuse','Une fondation','Un marchand'];
      h+=nfSec('Le courrier',plu(m.off.length,'proposition')+' de dépôt')+'<div class="nf-mr" data-k="gaoff" data-n="2">'+m.off.map(w=>{ const e=gaEst(b,w);
        return '<div class="ga2-let"><div class="h"><span>'+who[w.id%who.length]+'</span><span>expire dans '+plu(Math.max(0,w.until-S.day),'jour')+'</span></div><p>« Je souhaite vous confier '+esc(w.n)+' de '+esc(ga2Who(b,w))+'. Estimation : '+eur(e*.85,0)+' à '+eur(e*1.15,0)+'. »</p><div class="bt">'+
          B('acc',w.id,'Accepter',{a:1,dis:m.st.length>=cap,why:'La réserve est pleine.'})+(!w.ex? B('exp',w.id,'Expertiser') : '')+B('dec',w.id,'Refuser')+'</div></div>'; }).join('')+'</div>'; }
    /* 3. la salle des ventes */
    h+=nfSec('La salle des ventes','commission 10 % + 20 %')+'<div class="ga2-room">';
    if(ui.gl&&ui.gl.inline&&ui.gl.b===b.id) h+='<div class="hd"><b>Vente en direct</b><small>la salle est pleine</small></div><div id="ga-live" class="ga2-live stack"></div>';
    else {
    if(m.sale){ const rd=S.day>=m.sale.ready;
      h+='<div class="hd"><b>Catalogue de la vente</b><small>'+(rd?'prête':'dans '+plu(m.sale.ready-S.day,'jour'))+'</small></div>'+m.sale.lots.map((id,i)=>{ const w=m.st.find(x=>x.id===id); return w? '<div class="ga2-lot"><span class="no">'+(i+1)+'</span><span class="mini">'+P(ga2Kind(w),34,34)+'</span><div class="t"><b>'+esc(w.n)+'</b><small>'+esc(ga2Who(b,w))+' · est. '+eur(gaEst(b,w),0)+' · réserve '+Math.round(GA_RES[w.res].f*100)+' %</small></div></div>' : ''; }).join('')+
        '<div class="note">'+(m.whale?'Un collectionneur fortuné sera dans la salle.':'Chaque lot vendu réchauffe la salle, chaque lot ravalé la refroidit.')+'</div><button class="ga2-go" data-a="met" data-i="'+b.id+'" data-v="live"'+(rd?'':' disabled data-why="Le catalogue n’est pas encore prêt."')+'>Ouvrir la vente</button>';
    } else { const L=m.cat.map(id=>m.st.find(x=>x.id===id)).filter(Boolean), c=R0*.6;
      h+='<div class="hd"><b>Prochaine vente</b><small>'+L.length+' / '+maxL+' lots</small></div>'+
        (L.length? L.map((w,i)=>'<div class="ga2-lot"><span class="no">'+(i+1)+'</span><span class="mini">'+P(ga2Kind(w),34,34)+'</span><div class="t"><b>'+esc(w.n)+'</b><small>'+esc(ga2Who(b,w))+' · est. '+eur(gaEst(b,w),0)+'</small></div><div class="ctl"><div class="ga2-res" role="group" aria-label="Prix de réserve">'+Object.keys(GA_RES).map(k=>'<button class="'+(w.res===k?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="res" data-j="'+w.id+':'+k+'">'+GA_RES[k].n+' '+Math.round(GA_RES[k].f*100)+' %</button>').join('')+'</div>'+(i?'<button class="ga2-ib" data-a="met" data-i="'+b.id+'" data-v="up" data-j="'+w.id+'" aria-label="Monter '+esc(w.n)+'">↑</button>':'')+'<button class="ga2-ib" data-a="met" data-i="'+b.id+'" data-v="cat" data-j="'+w.id+'" aria-label="Retirer '+esc(w.n)+'">×</button></div></div>').join('') : '<div class="note">Mettez en vente au moins trois œuvres depuis les cimaises.</div>')+
        '<div class="note">La réserve est le prix minimum. Ouvrez avec une valeur sûre et gardez la pièce maîtresse pour la fin. Catalogue et annonces : '+eur(c,0)+', vente 5 jours plus tard.</div>'+
        '<button class="ga2-go" data-a="met" data-i="'+b.id+'" data-v="prep"'+(L.length<3||!can(c)?' disabled data-why="'+(L.length<3?'Il faut au moins trois lots.':'Trésorerie insuffisante.')+'"':'')+'>Préparer la vente</button>'; }
    }
    if(m.last&&!(ui.gl&&ui.gl.inline)){ const L=m.last; h+='<div class="last">Dernière vente : <b>'+L.sold+' / '+L.n+' adjugés</b>, '+eur(L.com,0)+' pour la galerie<button data-a="galive" data-i="'+b.id+'">Revoir</button></div>'; }
    h+='</div>';
    /* 4. vos œuvres */
    const F=gaLuxFree();
    if(F.length) h+=nfSec('Vos œuvres','achetées dans l’onglet Luxe')+'<div class="nf-card nf-list">'+F.map(x=>nfRowH(esc(x.n),'exposée, sa cote monte jusqu’à +10 % ; revendue aux enchères, 5 % de frais seulement','<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="lux" data-j="'+x.o+':'+x.lid+'"'+(m.st.length>=cap?' disabled':'')+'>Confier</button>')).join('')+'</div>';
    /* 5. l'atelier et l'expertise */
    const ne=m.st.filter(w=>!w.ex).length, nt=m.st.length;
    h+=nfSec('L’atelier et l’expertise')+'<div class="ga2-two"><div><b>Artistes émergents</b>'+(mxHas(b,1)? '<small>'+plu(m.art.filter(a=>a.em&&!a.dead).length,'artiste')+' sous contrat</small>' : '<small>Signez de jeunes artistes et vendez leurs œuvres sans dépôt.</small><small style="font-weight:800">palier 1</small>')+'</div>'+
      '<div><b>Expertise</b><small>Faire expertiser une œuvre écarte les faux avant la vente.'+(m.lab?' Le laboratoire expertise chaque arrivée.':'')+'</small><span class="bar" style="display:block"><i style="width:'+(nt?Math.round((nt-ne)/nt*100):0)+'%"></i></span><small>'+(nt-ne)+' œuvre'+(nt-ne>1?'s':'')+' sur '+nt+' expertisée'+(nt-ne>1?'s':'')+'</small></div></div>';
    if(mxHas(b,1)){ const E=m.art.filter(a=>a.em);
      h+='<div class="nf-card nf-list ga2-em">'+E.map(a=>nfRowH(esc(a.n)+(a.dead?' (décédé)':''),'cote '+a.c.toFixed(2).replace('.',NDEC)+(a.p?(a.c>a.p*1.03?' · en hausse':a.c<a.p*.97?' · en baisse':' · stable'):''))+m.atl.filter(x=>x.a===a.id).map(x=>{ const p=x.e0*a.c*.7; return nfRowH(esc(x.n),'en atelier · '+esc(a.n),B('buyw',x.id,'Acheter · '+eur(p,0),{a:1,dis:!can(p)||m.st.length>=cap})); }).join('')).join('')+
        nfRowH('Repérer un nouvel artiste',eur(R0*1.5,0),B('scout',undefined,'Repérer',{dis:E.filter(a=>!a.dead).length>=4,why:'Quatre artistes au plus.'}))+'</div>'; }
    ['acc','dec','exp','show','res','cat','up','prep','live','lux','back','scout','buyw'].forEach(a=>X.get(a));
    return h; }
};

/* la vente en direct se déroule dans la fiche (salle des ventes) au lieu d'une fenêtre */
{ const inl=(was)=>{ if(was&&ui.modal&&ui.modal.type==='galive'&&ui.gl&&ui.gl.back&&ui.gl.back.type==='biz'){ ui.gl.inline=1; ui.modal=ui.gl.back; render(); setTimeout(()=>{ const e=document.getElementById('ga-live'); if(e) e.scrollIntoView({behavior:'smooth',block:'center'}); },30); } };
  const _met=ACT.met; ACT.met=el=>{ const w=!!document.querySelector('.md.nf'); _met(el); inl(w); };
  const _gl=ACT.galive; ACT.galive=el=>{ const w=!!document.querySelector('.md.nf'); _gl(el); inl(w); }; }
function nfGaLoop(){ if(!ui.gl||!ui.gl.inline||!document.getElementById('ga-live')){ ui.nfgal=0; return; } gaDraw(); requestAnimationFrame(nfGaLoop); }
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); if(ui.gl&&ui.gl.inline){ gaDraw(); if(!ui.nfgal){ ui.nfgal=1; requestAnimationFrame(nfGaLoop); } } return out; }; }
NF_CSS.push(`
.ga2-live{margin-top:12px;background:rgba(0,0,0,.22);border-radius:16px;padding:12px}
.ga2-live .ga-cur{text-align:center;background:none!important;box-shadow:none!important;border:0!important;padding:4px 0}
.ga2-live .ga-cur b{display:block;font:italic 700 20px 'Playfair Display',Georgia,serif;color:#fff;margin:2px 0}
.ga2-live .sub{color:#EBC9D0;font-size:12px}
.ga2-live .ga-amb{font:800 12px var(--fb);color:#F0D488;margin-top:6px}
.ga2-live .ga-price{font:700 34px 'Playfair Display',Georgia,serif;color:#fff;margin:6px 0 2px}
.ga2-live .ga-who{font:800 13px var(--fb);color:#F7E9EC}.ga2-live .ga-who.ok{color:#9FF0C6}.ga2-live .ga-who.ko{color:#FFB3A8}
.ga2-live .row{display:flex;gap:8px;justify-content:center;margin-top:10px}
.ga2-live .btn{box-shadow:none;border:0;border-radius:12px;min-height:44px;padding:0 14px;font:800 13px var(--fb);background:rgba(255,255,255,.14);color:#fff}
.ga2-live .btn.pri{background:#F0D488;color:#4E0D18;display:block;width:100%;margin-top:10px}
.ga2-live .ht-t{margin-top:10px}
.ga2-live .rs-d{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid rgba(255,255,255,.12);color:#F7E9EC;font-size:12.5px}
.ga2-live .rs-d small{color:#EBC9D0}
`);

