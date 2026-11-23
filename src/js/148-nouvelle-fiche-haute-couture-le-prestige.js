/* ============================================================
   NOUVELLE FICHE · HAUTE COUTURE : le prestige, le studio, le défilé, l'atelier, les licences
   ============================================================ */
NF_CSS.push(`
.md.nf-couture{--nf-bg:#F7F3EC;--nf-bg2:#E7DFD1;--nf-acc:#141416;--nf-acc2:#000;--nf-h:#141416;--nf-hf:500 15px 'Bodoni Moda',Georgia,serif;--nf-sh:#E7DFD1;--nf-h1:500 26px/1.05 'Bodoni Moda',Georgia,serif}
.md.nf-couture .nf-sec{letter-spacing:.22em;text-transform:uppercase}
.md.nf-couture .nf-hero h1{letter-spacing:.12em;text-transform:uppercase}
.hc2-pres{display:flex;gap:14px;align-items:center;background:#141416;color:#EDE6DA;border-radius:20px;padding:14px;box-shadow:0 4px 0 #000}
.hc2-ring{position:relative;width:88px;height:88px;flex:0 0 auto}
.hc2-ring svg{width:88px;height:88px;transform:rotate(-90deg)}
.hc2-ring b{position:absolute;inset:0;display:grid;place-items:center;font:500 30px 'Bodoni Moda',Georgia,serif;color:#fff;padding-bottom:8px}
.hc2-ring small{position:absolute;left:0;right:0;bottom:22px;text-align:center;font:800 8.5px var(--fb);letter-spacing:.12em;color:#C9A86A}
.hc2-pres h4{margin:0;font:500 16px 'Bodoni Moda',Georgia,serif;color:#fff}
.hc2-pres p{margin:4px 0 8px;font-size:12.5px;color:#BDB4A6}
.hc2-pres .k{display:flex;gap:16px}.hc2-pres .k small{display:block;font-size:11px;color:#BDB4A6}.hc2-pres .k b{font:800 13px var(--fb);color:#fff}
.hc2-stu h4{margin:0;font:italic 500 20px 'Bodoni Moda',Georgia,serif}
.hc2-bar{height:6px;border-radius:3px;background:#EFE8DC;margin:10px 0 4px;overflow:hidden}.hc2-bar i{display:block;height:100%;background:#C9A86A}
.hc2-lab{font:800 11px var(--fb);letter-spacing:.14em;color:#7A6A50;margin:14px 0 6px;text-transform:uppercase}
.hc2-sty{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -12px;padding:0 12px}
.hc2-sty::-webkit-scrollbar{display:none}
.hc2-sty button{flex:0 0 78px;border:0;border-radius:14px;background:#F4EEE4;padding:6px 4px 8px;font:800 11.5px var(--fb);color:var(--ink);text-align:center}
.hc2-sty button.on{background:#fff;box-shadow:inset 0 0 0 2px #141416}
.hc2-sty button svg{display:block;margin:0 auto 2px;height:84px;width:auto}
.hc2-sty small{display:block;font:800 10.5px var(--fb)}
.hc2-sty small.up{color:#16804D}.hc2-sty small.dn{color:#C8352A}
.md.nf-couture .nf-seg button.on{background:#141416}
.md.nf-couture .nf-seg button small{display:block;font:600 10px var(--fb);opacity:.8}
.hc2-da{display:flex;gap:12px;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid #EFE8DC}
.hc2-da .av{width:52px;height:52px;border-radius:50%;background:#141416;color:#C9A86A;display:grid;place-items:center;font:500 18px 'Bodoni Moda',Georgia,serif;flex:0 0 auto}
.hc2-da b{font:800 15px var(--fb)}.hc2-da small{display:block;font-size:12px;color:var(--ink-3)}
.hc2-run{background:#0E0E10;border-radius:20px;padding:12px;box-shadow:0 4px 0 #000;color:#EDE6DA}
.hc2-stage{position:relative;height:230px;border-radius:14px;overflow:hidden;background:radial-gradient(ellipse at 50% 0%,#3A3A40,#0E0E10 70%)}
.hc2-stage .cat{position:absolute;left:50%;bottom:0;width:120px;height:230px;transform:translateX(-50%);background:linear-gradient(transparent,rgba(255,255,255,.12));clip-path:polygon(42% 0,58% 0,100% 100%,0 100%)}
.hc2-stage .f{position:absolute;bottom:0;transform:translateX(-50%)}
.hc2-stage .seats{position:absolute;bottom:14px;width:70px;display:grid;gap:7px}
.hc2-stage .seats i{display:block;height:6px;border-radius:3px;background:#2A2A30}
.hc2-run .lab{font:800 11px var(--fb);letter-spacing:.14em;color:#C9A86A;margin:12px 0 6px}
.hc2-city{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.hc2-city::-webkit-scrollbar{display:none}
.hc2-city button{flex:0 0 auto;border:0;border-radius:12px;background:#24242A;color:#fff;font:800 12.5px var(--fb);padding:6px 12px;min-height:46px}
.hc2-city button small{display:block;font:700 10px var(--fb);color:#C9A86A}
.hc2-city button:first-child{background:#C9A86A;color:#141416}.hc2-city button:first-child small{color:#141416}
.hc2-crit{display:flex;gap:12px;align-items:center;background:#1B1B20;border-radius:12px;padding:10px 12px;margin-top:10px}
.hc2-crit b{font:500 30px 'Bodoni Moda',Georgia,serif;color:#fff}
.hc2-crit p{margin:0;font:italic 13px/1.35 'Bodoni Moda',Georgia,serif;color:#BDB4A6}
.hc2-ord{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #EFE8DC}
.hc2-ord:first-child{border-top:0;padding-top:0}
.hc2-ord .th{width:44px;height:52px;border-radius:10px;background:#F4EEE4;display:grid;place-items:center;flex:0 0 auto;overflow:hidden}
.hc2-ord .th svg{height:48px;width:auto}
.hc2-ord .t{flex:1;min-width:0}.hc2-ord b{font:800 13.5px var(--fb)}.hc2-ord small{display:block;font-size:11.5px;color:var(--ink-3)}
.hc2-ord .bar{height:4px;border-radius:2px;background:#EFE8DC;margin-top:4px;width:120px}.hc2-ord .bar i{display:block;height:100%;background:#C9A86A}
.hc2-ord em{font:800 14px var(--fd);font-style:normal}
.hc2-lic{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hc2-lic>div{background:#fff;border-radius:18px;padding:12px;text-align:center;box-shadow:0 3px 0 var(--nf-sh)}
.hc2-lic svg{width:44px;height:52px}
.hc2-lic b{display:block;font:500 15px 'Bodoni Moda',Georgia,serif;margin-top:4px}
.hc2-lic small{display:block;font:800 12px var(--fb);color:var(--ink-3);margin:2px 0 8px}
.hc2-lic small.on{color:#16804D}
.hc2-eg{display:flex;gap:12px;align-items:center;background:#F6E9E6;border-radius:18px;padding:12px;margin-top:8px}
.hc2-eg .t{flex:1;min-width:0}.hc2-eg b{font:500 15px 'Bodoni Moda',Georgia,serif}.hc2-eg small{display:block;font-size:12px;color:var(--ink-3)}
`);
NF_FONTS.push('bodoni:Bodoni Moda:500');
const HC2_COL={cla:'#1B2A55',avg:'#C8352A',min:'#D9CFC0',rom:'#E8A0B4',str:'#2A2A30',bar:'#8E2A4A'};
const HC2_PERF='<svg viewBox="0 0 44 52" aria-hidden="true"><rect x="17" y="3" width="10" height="7" rx="1.5" fill="#C9A86A"/><rect x="6" y="11" width="32" height="38" rx="6" fill="#F4E6CF" stroke="#C9A86A" stroke-width="1.5"/><rect x="14" y="24" width="16" height="12" rx="1" fill="#fff" stroke="#C9A86A"/></svg>';
const HC2_BAG='<svg viewBox="0 0 44 52" aria-hidden="true"><path d="M14 18v-4a8 8 0 0 1 16 0v4" fill="none" stroke="#141416" stroke-width="3"/><path d="M6 18h32l-3 30H9z" fill="#141416"/><rect x="18" y="26" width="8" height="5" rx="1" fill="#C9A86A"/></svg>';
function hc2Fig(sty,c,h,skin){ return NFA.fashion.fig(sty,c,h,skin).replace('<svg ','<svg style="height:'+h+'px;width:auto" '); }
FX2.couture={
  chip:b=>{ const C=b.m.col; return C? (C.left>0? 'Collection prête dans '+plu(C.left,'jour') : 'Collection prête pour le défilé') : 'Aucune collection en création'; },
  stat:b=>{ const c=b.m.cur; return ['Note du dernier défilé',c? note5(c.sc)+' / 5' : '—']; },
  dlg:{role:'directeur de la maison', txt:'peut lancer les collections et choisir les défilés à votre place'},
  body(b,X,U){ const m=b.m, R0=metR0(b), C=m.col, da=m.da; let h='';
    /* 1. le prestige */
    const P=Math.round(m.pres), L=2*Math.PI*36;
    h+=nfSec('Le prestige')+'<div class="hc2-pres"><span class="hc2-ring"><svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="36" fill="none" stroke="#2A2A30" stroke-width="7"/><circle cx="44" cy="44" r="36" fill="none" stroke="#C9A86A" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(L*P/100).toFixed(1)+' '+L.toFixed(1)+'"/></svg><b>'+P+'</b><small>SUR 100</small></span>'+
      '<span><h4>'+(P>=70?'Une maison qui fait rêver':P>=45?'Une maison qui compte':'Une maison à relancer')+'</h4><p>Le prestige porte les ventes de prêt-à-porter et attire les clientes du sur-mesure.'+((m.lic.acc||m.lic.par)?' Les licences l’usent chaque jour.':'')+'</p><span class="k"><span><small>Collection en vente</small><b>'+(m.cur? esc(m.cur.n) : '—')+'</b></span><span><small>Sur mesure</small><b>'+plu(m.ord.length,'commande')+'</b></span></span></span></div>';
    /* 2. le studio */
    X.get('create'); X.get('hire');
    h+=nfSec('Le studio',C? 'collection en création' : 'nouvelle collection')+'<div class="nf-card hc2-stu">';
    if(C){ const done=C.dur-C.left;
      h+='<div class="nf-row"><span><h4>'+esc(C.n)+'</h4></span><small>'+(C.left>0? 'jour '+done+' sur '+C.dur : 'prête')+'</small></div><div class="hc2-bar"><i style="width:'+Math.round(done/C.dur*100)+'%"></i></div>'+
        '<div class="nf-row"><small>'+HC_STY[C.sty]+' · '+HC_LOOK[C.look].n.toLowerCase()+' · '+HC_MAT[C.mat].n.toLowerCase()+' · tendance '+(m.sty[C.sty].v>=1.05?'en hausse':m.sty[C.sty].v<=.95?'en baisse':'stable')+'</small></div>'+
        '<div class="hc2-sty" style="margin-top:10px">'+[0,1,2,3].map(i=>'<button disabled style="opacity:1">'+hc2Fig(C.sty,i%2?HC2_COL[C.sty]:'#F4EEE4',84,i===2?'#d9a88a':undefined)+'</button>').join('')+'</div>';
    } else { const s=U.sty||(da?da.aff:'cla'), lk=U.look===undefined?1:+U.look, mt=U.mat||'std', cost=hcColCost(b,{look:lk,mat:mt}), tex=hcTex();
      h+='<div class="hc2-lab">Style</div><div class="hc2-sty">'+Object.keys(HC_STY).map(k=>{ const v=m.sty[k].v; return '<button class="'+(k===s?'on':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="sty" data-j="'+k+'">'+hc2Fig(k,HC2_COL[k],84,k==='min'?'#d9a88a':undefined)+HC_STY[k].replace(' de luxe','')+'<small class="'+(v>=1.05?'up':v<=.95?'dn':'')+'">'+(v>=1.05?'+':v<=.95?'−':'')+Math.round(Math.abs(v-1)*100)+' %</small></button>'; }).join('')+'</div>'+
        '<div class="hc2-lab">Ampleur</div><div class="nf-seg">'+HC_LOOK.map((x,i)=>'<button class="'+(i===lk?'on':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="look" data-j="'+i+'">'+x.n.split(' (')[0]+'<small>'+x.n.split('(')[1].replace(')','')+'</small></button>').join('')+'</div>'+
        '<div class="hc2-lab">Tissus</div><div class="nf-seg">'+Object.entries(HC_MAT).map(([k,x])=>'<button class="'+(k===mt?'on':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="mat" data-j="'+k+'"'+(k==='own'&&!tex?' disabled':'')+'>'+x.n.replace('Tissus classiques','Classiques').replace('Soieries italiennes','Soieries')+'<small>'+(x.f===1?'prix normal':(x.f>1?'+':'−')+Math.round(Math.abs(x.f-1)*100)+' %')+'</small></button>').join('')+'</div>'+
        '<button class="btn nf-b a w" style="margin-top:12px" data-a="met" data-i="'+b.id+'" data-v="create" data-j="'+s+':'+lk+':'+mt+'"'+(!da||!nfCan(b,cost*.3)?' disabled':'')+'>Lancer la collection · '+eur(cost,0)+'</button><div class="nf-row" style="margin-top:4px"><small>Création en 50 jours'+(da&&da.aff!==s?' · '+esc(da.n)+' aurait préféré le style '+HC_STY[da.aff].toLowerCase():'')+'.</small></div>'; }
    if(da) h+='<div class="hc2-da"><span class="av">'+esc(da.n.split(' ').map(x=>x[0]).join(''))+'</span><span><b>'+esc(da.n)+'</b><small>Directeur artistique · talent '+'★'.repeat(da.tal)+' · aime le style '+HC_STY[da.aff].toLowerCase()+'</small><small>Humeur <b style="font-size:12px">'+Math.round(da.mood)+'</b> · caprices '+(da.cap>.5?'fréquents':da.cap>.25?'occasionnels':'rares')+'</small></span></div>';
    h+='<button class="btn nf-b w" style="margin-top:10px" data-a="nfui" data-i="'+b.id+'" data-v="cand">'+(U.cand?'Fermer':da?'Voir d’autres directeurs artistiques':'Recruter un directeur artistique')+'</button>';
    if(U.cand) h+='<div class="nf-list" style="margin-top:8px">'+m.cand.map(c=>nfRowH(esc(c.n),'talent '+'★'.repeat(c.tal)+' · '+HC_STY[c.aff].toLowerCase()+' · caprices '+(c.cap>.5?'fréquents':c.cap>.25?'occasionnels':'rares'),'<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="hire" data-j="'+c.id+'">Engager</button>')).join('')+'</div>';
    h+='</div>';
    /* 3. le défilé */
    X.get('show'); const cur=m.cur, sty=C? C.sty : cur? cur.sty : 'cla', ready=C&&C.left<=0;
    const cities=Object.keys(HC_CITY).filter(k=>k===b.city||cityUnlocked(k)).sort((a,c)=>(c===b.city)-(a===b.city)||HC_CITY[c]-HC_CITY[a]);
    h+=nfSec('Le défilé',ready? 'collection prête' : C? 'dans '+plu(C.left,'jour') : 'aucune collection')+'<div class="hc2-run"><div class="hc2-stage" aria-hidden="true"><span class="cat"></span><span class="seats" style="left:8px"><i></i><i></i><i></i><i></i><i></i></span><span class="seats" style="right:8px"><i></i><i></i><i></i><i></i><i></i></span>'+
      [[50,0,96],[44,40,62],[57,70,44],[47,98,30],[53,118,20]].map((p,i)=>'<span class="f" style="left:'+p[0]+'%;bottom:'+p[1]+'px">'+hc2Fig(sty,i%2?'#F4EEE4':HC2_COL[sty],p[2]*1.6,i===2?'#d9a88a':undefined)+'</span>').join('')+'</div>'+
      '<div class="lab">VILLE DU DÉFILÉ</div><div class="hc2-city">'+cities.slice(0,8).map(k=>'<button data-a="met" data-i="'+b.id+'" data-v="show" data-j="'+k+'"'+(ready?'':' disabled')+'>'+esc(D.CITIES[k].n)+'<small>prestige ×'+HC_CITY[k]+(k===b.city?'':' · voyage')+'</small></button>').join('')+'</div>'+
      (m.last? '<div class="hc2-crit"><b>'+note5(m.last.sc)+'</b><p>« '+(m.last.sc>=85?'Un triomphe : la maison est au sommet.':m.last.sc>=70?'Une coupe d’une grande justesse, on attend désormais l’audace.':m.last.sc>=50?'Une collection honnête, sans éclat.':'Une saison manquée, la critique est sévère.')+' » · dernier défilé à '+esc(D.CITIES[m.last.city]?D.CITIES[m.last.city].n:'')+'</p></div>' : '')+'</div>';
    /* 4. l'atelier */
    const cA=X.get('art');
    h+=nfSec('L’atelier','commandes sur mesure')+'<div class="nf-card">'+(m.ord.length? '<div class="nf-mr" data-k="hcord" data-n="3">'+m.ord.slice(0,5).map((o,i)=>'<div class="hc2-ord"><span class="th">'+hc2Fig(i%2?'rom':'cla',i%2?'#F4EEE4':'#8E2A4A',48)+'</span><span class="t"><b>'+esc(o.n)+'</b><small>livraison dans '+plu(Math.max(0,Math.ceil(o.w-o.done)),'jour')+'</small><span class="bar" style="display:block"><i style="width:'+Math.round(o.done/o.w*100)+'%"></i></span></span><em>'+eur(o.v,0)+'</em></div>').join('')+'</div>' : '<div class="nf-row"><small>Aucune commande : elles arrivent avec le prestige et les beaux défilés.</small></div>')+
      (cA? '<div class="nf-ctl" style="margin-top:10px;padding-top:10px;border-top:1px solid #EFE8DC">'+nfRowH('Artisans : '+m.art,'chacun réalise une commande sur mesure en 30 jours')+nfSegH(b,cA)+'</div>' : '')+'</div>';
    /* 5. licences et égérie */
    const cL=X.get('lacc'), cP=X.get('lpar'), cE=X.get('eg');
    h+=nfSec('Licences et égérie')+'<div class="hc2-lic"><div>'+HC2_PERF+'<b>Parfum</b>'+(cP? '<small class="'+(m.lic.par?'on':'')+'">'+(m.lic.par?'signée · use le prestige':'rapporte beaucoup, use le prestige')+'</small>'+nfBtn(b,cP,m.lic.par?'Arrêter':'Signer',{c:m.lic.par?'':'a'}) : '<small>palier « Parfum »</small>')+'</div>'+
      '<div>'+HC2_BAG+'<b>Accessoires</b>'+(cL? '<small class="'+(m.lic.acc?'on':'')+'">'+(m.lic.acc?'signée · use le prestige':'rapporte, use le prestige')+'</small>'+nfBtn(b,cL,m.lic.acc?'Arrêter':'Signer',{c:m.lic.acc?'':'a'}) : '')+'</div></div>'+
      (cE? '<div class="hc2-eg"><span class="th" style="width:44px">'+hc2Fig('min','#141416',60,'#d9a88a')+'</span><span class="t"><b>'+(cE.owned?'Égérie sous contrat':'Engager une égérie')+'</b><small>'+esc(cE.sub)+'</small></span>'+(cE.owned? '' : nfBtn(b,cE,eur(cE.cost,0),{c:'a',dis:!nfCan(b,cE.cost)}))+'</div>' : '');
    return h; }
};

