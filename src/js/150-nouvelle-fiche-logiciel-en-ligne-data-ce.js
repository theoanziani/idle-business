/* ============================================================
   NOUVELLE FICHE · LOGICIEL EN LIGNE, DATA CENTER, VENTE EN LIGNE, CONSTRUCTION
   ============================================================ */
NF_CSS.push(`
.md.nf-saas{--nf-bg:#F1F0FB;--nf-bg2:#DCD9F3;--nf-acc:#5B4BE0;--nf-acc2:#3E31B0;--nf-h:#221C5A;--nf-hf:700 18px 'Space Grotesk','Baloo 2',sans-serif;--nf-sh:#DCD9F3}
.sa2-dash{background:#14122E;border-radius:20px;padding:14px;box-shadow:0 4px 0 #09081C;color:#D8D5F5}
.sa2-dash .top{display:flex;justify-content:space-between;align-items:baseline}
.sa2-dash .top b{font:700 30px 'Space Grotesk',sans-serif;color:#fff}
.sa2-dash .top small{font:800 12px var(--fb)}
.sa2-dash svg{display:block;width:100%;height:70px;margin-top:6px}
.sa2-fun{display:grid;gap:6px;margin-top:10px}
.sa2-fun div{display:grid;grid-template-columns:78px 1fr 56px;align-items:center;gap:8px;font:700 12px var(--fb)}
.sa2-fun i{display:block;height:12px;border-radius:6px;background:#2A2660;overflow:hidden}
.sa2-fun i em{display:block;height:100%;background:linear-gradient(90deg,#7B6CFF,#3FD6C5);border-radius:6px}
.sa2-fun b{text-align:right;color:#fff}
.sa2-run{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.sa2-run div{background:#1F1C45;border-radius:12px;padding:8px 10px}
.sa2-run small{display:block;font:700 11px var(--fb);color:#A9A3E6}.sa2-run b{font:700 17px 'Space Grotesk',sans-serif;color:#fff}
.md.nf-dc{--nf-bg:#EDF1F4;--nf-bg2:#D2DAE1;--nf-acc:#0E8F6E;--nf-acc2:#0A654E;--nf-h:#0F1E26;--nf-hf:700 17px 'JetBrains Mono',monospace;--nf-sh:#D2DAE1}
.dc2-room{background:#0E171D;border-radius:20px;padding:10px;box-shadow:0 4px 0 #050B0F;color:#BFD3DC}
.dc2-room+.dc2-room{margin-top:8px}
.dc2-room .hd{display:flex;justify-content:space-between;font:700 12px 'JetBrains Mono',monospace;padding:0 2px 8px}
.dc2-racks{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}
.dc2-racks span{height:46px;border-radius:3px;background:#1B2830;position:relative;overflow:hidden}
.dc2-racks span.on{background:#22343E}
.dc2-racks span.on::before{content:'';position:absolute;left:3px;right:3px;top:5px;bottom:5px;background:repeating-linear-gradient(#2F4652 0 3px,transparent 3px 6px)}
.dc2-racks span.on::after{content:'';position:absolute;left:4px;top:6px;width:3px;height:3px;border-radius:50%;background:var(--led,#2BE38F);box-shadow:0 10px 0 var(--led,#2BE38F),0 22px 0 var(--led,#2BE38F);animation:dcblink 1.6s steps(2) infinite}
@keyframes dcblink{50%{opacity:.35}}
.dc2-pw{margin-top:10px}
.dc2-pw .g{height:10px;border-radius:5px;background:#1B2830;overflow:hidden}.dc2-pw .g i{display:block;height:100%;background:linear-gradient(90deg,#2BE38F,#F2C94C 80%,#FF6B5B)}
.dc2-pw .l{display:flex;justify-content:space-between;font:700 11.5px 'JetBrains Mono',monospace;margin-top:4px}
.sa2-cur{background:#14122E;border-radius:18px;padding:12px;color:#D8D5F5;box-shadow:0 4px 0 #09081C;margin-bottom:10px}
.sa2-cur small{display:block;font:800 10.5px var(--fb);letter-spacing:.08em;color:#A9A3E6}.sa2-cur b{display:block;font:700 17px 'Space Grotesk',sans-serif;color:#fff;margin:2px 0 8px}
.sa2-cur i{display:block;height:8px;border-radius:4px;background:#2A2660;overflow:hidden;margin-bottom:6px}.sa2-cur em{display:block;height:100%;background:linear-gradient(90deg,#7B6CFF,#3FD6C5)}
.sa2-cur small:last-child{letter-spacing:0;font-weight:600}
.sa2-feat{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.sa2-feat button{position:relative;border:0;border-radius:16px;background:#fff;padding:10px;text-align:left;font:inherit;color:var(--ink);box-shadow:0 3px 0 var(--nf-sh);min-height:84px}
.sa2-feat button em{display:inline-block;font:800 10px var(--fb);font-style:normal;border-radius:6px;padding:1px 6px;background:#F1F0FB;color:#5B4BE0}
.sa2-feat button b{display:block;font:800 13px var(--fb);margin-top:4px}.sa2-feat button small{display:block;font-size:11px;color:var(--ink-3);margin-top:2px}
.sa2-feat button.done{background:#EAF8F2}.sa2-feat button.done em{background:#2BB673;color:#fff}
.sa2-feat button.cur{box-shadow:0 0 0 2px #5B4BE0,0 3px 0 var(--nf-sh)}.sa2-feat button.cur em{background:#5B4BE0;color:#fff}
.sa2-feat button.lock{opacity:.55}
.sa2-obj{margin-top:10px;background:#FFF1C7;border-radius:14px;padding:10px 12px;font-size:12.5px;color:#5A4300}
.dc2-ro+.dc2-ro{margin-top:8px}
.dc2-heat{height:10px;border-radius:5px;background:#E3E9EE;margin-top:8px;overflow:hidden}.dc2-heat i{display:block;height:100%;background:#2BB673}.dc2-heat i.hot{background:#F2B705}.dc2-heat i.ko{background:#C8352A}
.dc2-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:1px}
.dc2-up{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.md.nf-dc .dc2-up .nf-b{flex:1 1 auto;font-size:12px;padding:0 10px;white-space:normal;line-height:1.15}
.dc2-off{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh);border-left:4px solid #0E8F6E}
.dc2-off+.dc2-off{margin-top:8px}
.md.nf-ecom{--nf-bg:#FFF4EE;--nf-bg2:#F5DCCD;--nf-acc:#F05A28;--nf-acc2:#B8401A;--nf-h:#3A1A0C;--nf-hf:800 19px var(--fd);--nf-sh:#F5DCCD}
.ec2-fun{display:grid;gap:8px}
.ec2-fun div{position:relative;border-radius:12px;background:#FFE4D6;height:40px;overflow:hidden}
.ec2-fun div i{position:absolute;left:0;top:0;bottom:0;background:#F05A28;opacity:.85}
.ec2-fun div span{position:absolute;left:12px;right:12px;top:0;bottom:0;display:flex;justify-content:space-between;align-items:center;font:800 13px var(--fb);color:#3A1A0C}
.ec2-box{display:flex;gap:6px;justify-content:center;margin-top:10px;flex-wrap:wrap}
.ec2-box svg{width:44px;height:auto}
.ec2-it{display:grid;grid-template-columns:70px minmax(0,1fr);gap:4px 10px;background:#fff;border-radius:18px;padding:10px;box-shadow:0 3px 0 var(--nf-sh);align-items:center}
.ec2-it+.ec2-it{margin-top:8px}
.ec2-it .im{grid-row:span 2;width:70px;height:70px;border-radius:14px;background:#FFF0E6;display:grid;place-items:center;overflow:hidden}
.ec2-it .t b{display:block;font:800 14px var(--fb)}.ec2-it .t em{display:inline-block;font:800 10.5px var(--fb);font-style:normal;background:#F1F2F4;color:var(--ink-3);border-radius:6px;padding:1px 6px;margin-top:2px}
.ec2-it .t em.up{background:#DFF5EA;color:#16804D}.ec2-it .t em.dn{background:#FFE4E0;color:#C8352A}.ec2-it .t small{display:block;font-size:11.5px;color:var(--ink-3);margin-top:2px}
.ec2-it .pr{display:flex;align-items:center;gap:4px}
.ec2-it .pr button{width:44px;height:44px;border:0;border-radius:12px;background:#FFF0E6;color:#F05A28;font:800 18px var(--fb);padding:0}
.ec2-it .pr span{flex:1;text-align:center}.ec2-it .pr b{display:block;font:800 17px var(--fd)}.ec2-it .pr small{font-size:10.5px;color:var(--ink-3)}
.ec2-it .ac{grid-column:1 / 3;display:flex;gap:6px;flex-wrap:wrap}.md.nf-ecom .ec2-it .ac .nf-b{flex:1 1 auto;font-size:12px;padding:0 8px}
.ec2-add{display:block;width:100%;margin-top:8px;min-height:48px;border:2px dashed #F5DCCD;border-radius:16px;background:none;font:800 13.5px var(--fb);color:#F05A28}
.ec2-pick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}
.ec2-pick button{border:0;border-radius:16px;background:#fff;padding:8px;text-align:left;font:inherit;color:var(--ink);box-shadow:0 3px 0 var(--nf-sh)}
.ec2-pick .im{display:grid;place-items:center;height:64px;border-radius:12px;background:#FFF0E6;overflow:hidden}
.ec2-pick b{display:block;font:800 12.5px var(--fb);margin-top:4px}.ec2-pick small{display:block;font-size:11px;color:var(--ink-3)}
.bc2-of{display:flex;gap:10px;align-items:flex-start;background:#fff;border-radius:18px;padding:10px;box-shadow:0 3px 0 var(--nf-sh)}
.bc2-of+.bc2-of,.bc2-bid+.bc2-of{margin-top:8px}
.bc2-of.on{box-shadow:0 0 0 2px #E0A21B,0 3px 0 var(--nf-sh)}
.bc2-of .bp{flex:0 0 96px;border-radius:10px;overflow:hidden}
.bc2-of .t{flex:1;min-width:0}.bc2-of b{display:block;font:800 13.5px var(--fb)}.bc2-of small{display:block;font-size:11.5px;color:var(--ink-3);margin:2px 0 6px}
.bc2-bid{margin-top:8px}
.bc2-ma{margin-top:10px;min-height:44px}.bc2-ma input{width:24px;height:24px;accent-color:#E0A21B}
.bc2-win{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid #EFEADF}
.bc2-win b{display:block;font:400 28px 'Bebas Neue',sans-serif}.bc2-win small{font-size:12px;color:var(--ink-3)}
.bc2-ja{display:flex;gap:6px;flex:0 0 auto}.md.nf-build .bc2-ja .nf-b{font-size:12px;padding:0 10px}
.md.nf-build{--nf-bg:#F5F2EA;--nf-bg2:#E2DCCB;--nf-acc:#E0A21B;--nf-acc2:#A8770F;--nf-h:#2B2416;--nf-hf:400 23px 'Bebas Neue','Baloo 2',sans-serif;--nf-sh:#E2DCCB;--nf-h1:400 32px/1 'Bebas Neue','Baloo 2',sans-serif}
.md.nf-build .nf-sec{letter-spacing:.04em}
.bc2-site{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:0 2px 4px}
.bc2-site::-webkit-scrollbar{display:none}
.bc2-j{flex:0 0 160px;background:#fff;border-radius:18px;padding:8px;box-shadow:0 3px 0 var(--nf-sh)}
.bc2-j .im{height:104px;border-radius:12px;background:linear-gradient(#CFE6F5,#EEF6FB);overflow:hidden;display:flex;align-items:flex-end;justify-content:center}
.bc2-j .im svg{width:100%;height:auto}
.bc2-j b{display:block;font:800 13px var(--fb);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc2-j small{display:block;font-size:11.5px;color:var(--ink-3)}
.bc2-j small.late{color:#C8352A;font-weight:800}
.bc2-j .p{height:5px;border-radius:3px;background:#EFEADF;margin-top:5px;overflow:hidden}.bc2-j .p i{display:block;height:100%;background:#E0A21B}
.bc2-emp{background:#fff;border-radius:18px;padding:14px;font-size:13px;color:var(--ink-3);box-shadow:0 3px 0 var(--nf-sh)}
.bc2-mat{display:flex;align-items:center;gap:12px}
.bc2-mat b{font:400 30px 'Bebas Neue',sans-serif}
`);
NF_FONTS.push('jetbrains:JetBrains Mono:700','bebas:Bebas Neue:400');
function nfSpark(L,col){ if(!L||L.length<2) L=[0,0]; const W=300,H=70,mx=Math.max(1,...L),x=i=>i*W/(L.length-1),y=v=>H-6-v/mx*(H-14);
  const pts=L.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ');
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,'+H+' '+pts+' '+W+','+H+'" fill="'+col+'" opacity=".18"/><polyline points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="2.5" stroke-linejoin="round"/></svg>'; }
FX2.saas={
  chip:b=>plu(Math.round(b.m.F+b.m.P),'utilisateur'),
  stat:b=>['Revenu mensuel',eur(saMRR(b),0)],
  noRest:true,
  dlg:{txt:'peut fixer les prix, recruter et lever des fonds à votre place'},
  body(b,X,U){ const m=b.m, mrr=saMRR(b), Hh=0, H=(m.gH||[]).concat([Math.round(mrr)]), g=H.length>=2&&H[H.length-2]>0? H[H.length-1]/H[H.length-2]-1 : 0, burn=b.last? -b.last.net+(m.pend||0) : 0, tot=Math.max(1,m.F+m.P+m.E);
    let h=nfSec('Le tableau de bord','revenu mensuel')+'<div class="sa2-dash"><div class="top"><b>'+eur(mrr,0)+'</b><small style="color:'+(g>=0?'#3FD6C5':'#FF8A7D')+'">'+(g>=0?'+':'')+Math.round(g*100)+' % sur un mois</small></div>'+nfSpark(H,'#7B6CFF')+
      '<div class="sa2-fun">'+[['Gratuit',m.F],['Pro',m.P],['Société',m.E]].map(r=>'<div><span>'+r[0]+'</span><i><em style="width:'+Math.max(2,Math.round(r[1]/tot*100))+'%"></em></i><b>'+fmtN(Math.round(r[1]))+'</b></div>').join('')+'</div>'+
      '<div class="sa2-run"><div><small>Trésorerie de la start-up</small><b>'+eur(m.cash,0)+'</b></div><div><small>'+(m.cash>0&&burn>0?'Survie':'Votre part')+'</small><b>'+(m.cash>0&&burn>0? plu(Math.round(m.cash/burn),'jour') : Math.round(m.own*100)+' %')+'</b></div></div></div>';
    X.get('dev');
    h+=nfSec('La feuille de route',m.dev? 'en cours' : 'choisissez la prochaine fonctionnalité');
    if(m.dev){ const f=SA_FEAT.find(z=>z.id===m.dev.id); if(f) h+='<div class="sa2-cur"><small>EN DÉVELOPPEMENT</small><b>'+esc(f.n)+'</b><i><em style="width:'+Math.round(m.dev.p/f.w*100)+'%"></em></i><small>'+Math.round(m.dev.p)+' / '+f.w+' jours d’ingénieur · plus d’ingénieurs, plus vite c’est prêt</small></div>'; }
    h+='<div class="sa2-feat">'+SA_FEAT.map(f=>{ const done=m.feat[f.id], lock=(f.rk&&!mxHas(b,f.rk)&&!(f.id==='ia'&&m.ai))||(f.id==='ia'&&!m.ai), cur=m.dev&&m.dev.id===f.id;
      const eff=[f.q?'attrait +'+Math.round(f.q*100)+' %':'',f.cp?'Pro '+multPct(f.cp):'',f.ce?'sociétés '+multPct(f.ce):'',f.tam?'marché '+multPct(f.tam):'',f.ech?'départs −30 %':''].filter(Boolean).join(' · ');
      return '<button class="'+(done?'done':cur?'cur':lock?'lock':'')+'" data-a="met" data-i="'+b.id+'" data-v="dev" data-j="'+f.id+'"'+(done||lock?' disabled':'')+(lock?' data-why="'+(f.id==='ia'&&mxHas(b,3)?'Après le pivot IA.':'Palier '+f.rk+' requis.')+'"':'')+'><em>'+(done?'en ligne':cur?'en cours':lock?(f.id==='ia'?'pivot IA':'palier '+f.rk):f.w+' j')+'</em><b>'+esc(f.n)+'</b><small>'+esc(eff)+'</small></button>'; }).join('')+'</div>';
    if(m.obj) h+='<div class="sa2-obj">Objectif des investisseurs : <b>'+eur(m.obj.need,0)+'</b> de chiffre d’affaires par jour avant le '+footDateLabel(m.obj.until)+'.</div>';
    h+=nfRest(b,X,'Décisions');
    return h; }
};
FX2.dc={
  chip:b=>{ const r=b.m.cl.reduce((a,c)=>a+c.racks,0); return r+' baies louées'; },
  stat:b=>['Puissance',Math.round(dcSiteLoad(b))+' / '+b.m.pw+' kW'],
  noRest:true,
  dlg:{txt:'peut signer les clients et gérer la puissance à votre place'},
  body(b,X,U){ const m=b.m, P=dcSiteLoad(b), cols=['#2BE38F','#3FB6FF','#F2C94C','#FF8AD1','#B49BFF','#FF9F5A'];
    let h=nfSec('Les salles',m.rm.length+' salle'+(m.rm.length>1?'s':'')+' · '+DC_SLOTS+' baies chacune');
    m.rm.forEach(r=>{ const C=m.cl.filter(c=>c.rm===r.id); let slots=[]; C.forEach((c,k)=>{ for(let i=0;i<c.racks;i++) slots.push(cols[k%cols.length]); });
      h+='<div class="dc2-room"><div class="hd"><span>SALLE '+r.id+' · '+esc(r.cool||'air')+'</span><span>'+slots.length+' / '+DC_SLOTS+'</span></div><div class="dc2-racks">'+Array.from({length:DC_SLOTS},(_,i)=>'<span class="'+(i<slots.length?'on':'')+'"'+(i<slots.length?' style="--led:'+slots[i]+'"':'')+'></span>').join('')+'</div></div>'; });
    h+='<div class="dc2-room"><div class="dc2-pw" style="margin:0"><div class="l" style="margin:0 0 6px"><span>PUISSANCE</span><span>'+Math.round(P)+' / '+m.pw+' kW</span></div><div class="g"><i style="width:'+Math.round(clamp(P/m.pw,0,1)*100)+'%"></i></div></div></div>';
    X.get('cool'); X.get('move'); X.get('acc'); X.get('dec');
    const cash=availFor(cityOf(b).ccy), d=bizDef(b);
    h+=nfSec('Chaleur et clients','par salle');
    m.rm.forEach(r=>{ const L=dcLoad(b,r), Lp=dcLoad(b,r,true), K=dcCoolKw(b,r), C=DC_COOL[r.cool], f=clamp(Lp/Math.max(1,K),0,1.2), cl=m.cl.filter(c=>c.rm===r.id);
      const capOf=k=>k==='nat'?DC_COOL[k].kw*dcColdF(b):DC_COOL[k].kw, opts=Object.keys(DC_COOL).filter(k=>k!==r.cool&&capOf(k)>capOf(r.cool)&&!(DC_COOL[k].rk&&!mxHas(b,DC_COOL[k].rk))&&!(k==='nat'&&dcColdF(b)<.3)&&k!=='air');
      h+='<div class="nf-card dc2-ro"><div class="nf-row"><span><b>Salle '+r.id+' · '+esc(C.n.toLowerCase())+'</b><small>'+Math.round(L)+' kW aujourd’hui, '+Math.round(Lp)+' kW aux pics, pour '+Math.round(K)+' kW de refroidissement</small></span></div><div class="dc2-heat"><i class="'+(f>1?'ko':f>.85?'hot':'')+'" style="width:'+Math.round(Math.min(1,f)*100)+'%"></i></div>'+
        (cl.length? '<div class="nf-list" style="margin-top:8px">'+cl.map((c,k)=>{ const tot=c.dt.reduce((a,x)=>a+x,0), other=m.rm.filter(x=>x!==r&&dcUsed(b,x)+c.racks<=DC_SLOTS), ci=m.cl.filter(z=>z.rm===r.id).indexOf(c);
          return nfRowH('<span class="dc2-dot" style="background:'+cols[ci%cols.length]+'"></span>'+esc(c.n),c.racks+' baies · garantie '+DC_SLA[c.sla].n+' · charge '+Math.round(c.util*100)+' % · arrêt '+tot.toFixed(1).replace('.',NDEC)+' h / '+String(DC_SLA[c.sla].h).replace('.',NDEC)+' h permises',other.length? '<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="move" data-j="'+c.id+':'+other[0].id+'">Vers salle '+other[0].id+'</button>' : '<b style="font-size:13px;white-space:nowrap">'+eur(c.p,0)+' / j</b>'); }).join('')+'</div>' : '')+
        (opts.length? '<div class="dc2-up">'+opts.map(k=>'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="cool" data-j="'+r.id+':'+k+'"'+(cash<d.cost*DC_COOL[k].c?' disabled':'')+'>'+esc(DC_COOL[k].n)+' · '+Math.round(capOf(k))+' kW · '+eur(d.cost*DC_COOL[k].c,0)+'</button>').join('')+'</div>' : '')+'</div>'; });
    if(m.off.length) h+=nfSec('Les demandes d’hébergement',plu(m.off.length,'client'))+'<div class="nf-mr" data-k="dcoff" data-n="2">'+m.off.map(c=>{ const f=dcFit(b,c);
      return '<div class="dc2-off"><div class="nf-row"><span><b>'+esc(c.n)+'</b><small>'+c.racks+' baies · garantie '+DC_SLA[c.sla].n+' ('+String(DC_SLA[c.sla].h).replace('.',NDEC)+' h d’arrêt permises par mois) · charge d’environ '+Math.round(c.util*100)+' % · encore '+plu(Math.max(0,c.until-S.day),'jour')+'</small></span><b style="white-space:nowrap">'+eur(c.p,0)+' / j</b></div><div class="dc2-up">'+
        (f? '<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="acc" data-j="'+c.id+':'+f.r.id+'">Installer en salle '+f.r.id+'</button>' : '<button class="btn nf-b" disabled data-why="Pas assez de baies libres.">Pas assez de baies</button>')+'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="dec" data-j="'+c.id+'">Refuser</button></div>'+(f&&f.head<0?'<div class="nf-row" style="margin-top:4px"><small style="color:#C8352A">La salle risque la surchauffe.</small></div>':'')+'</div>'; }).join('')+'</div>';
    h+=nfRest(b,X,'Décisions');
    return h; }
};
FX2.ecom={
  chip:b=>{ const d=b.m.stats; return d? fmtN(Math.round(d.orders))+' commandes hier' : 'Boutique en ligne'; },
  stat:b=>['Avis',b.m.note.toFixed(1).replace('.',NDEC)+' / 5'],
  noRest:true,
  dlg:{txt:'peut choisir le catalogue, la publicité et les prix à votre place'},
  body(b,X,U){ const m=b.m, d=m.stats||ecDay(b,true), mx=Math.max(1,d.vis), E=NFA.ecom;
    let h=nfSec('Les colis du jour',fmtN(Math.round(d.orders))+' commandes hier')+'<div class="nf-card"><div class="ec2-box" aria-hidden="true">'+Array.from({length:clamp(Math.round(d.orders/3),1,12)},(_,i)=>E.parcel(44,i%2)).join('')+'</div><div class="nf-row" style="margin-top:6px"><small>'+fmtN(Math.round(d.vis))+' visites · conversion '+((d.vis?d.orders/d.vis:0)*100).toFixed(1).replace('.',NDEC)+' % · '+fmtN(Math.round(d.ret))+' retours · publicité '+eur(d.ads,0)+' / jour</small></div></div>';
    ['mk','mode','ord','rm','add'].forEach(a=>X.get(a));
    const PK={ecou:'ecou',montre:'montre',lampe:'lampe',gourde:'gourde',sac:'sac',encei:'encei',proj:'proj',plaid:'plaid'}, img=id=>PK[id]? E.product(PK[id],70).replace('<svg ','<svg style="width:70px;height:auto" ') : E.parcel(56,0);
    const Bt=(lab,act,arg,l)=>'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(l?' aria-label="'+esc(l)+'"':'')+'>'+lab+'</button>';
    h+=nfSec('Le catalogue',m.cat.length+' / '+ecSlots(b)+' produits')+'<div class="nf-mr" data-k="eccat" data-n="4">'+m.cat.map(it=>{ const p=ecP(it.id), v=ecTr(m,it.id), pend=m.ord.filter(o=>o.id===it.id).reduce((a,o)=>a+o.n,0);
      return '<div class="ec2-it"><span class="im">'+img(it.id)+'</span><div class="t"><b>'+esc(p.n)+'</b><em class="'+(v>=1.1?'up':v<.7?'dn':'')+'">'+esc(ecTrLabel(m,it.id))+'</em><small>'+(it.mode==='stock'? 'stock propre : '+Math.round(it.st)+' unités'+(pend?' · '+pend+' en livraison':'') : 'expédition directe par le fournisseur')+'</small></div>'+
        '<div class="pr"><button data-a="met" data-i="'+b.id+'" data-v="mk" data-j="'+it.id+':-0.1" aria-label="Baisser le prix de '+esc(p.n)+'">−</button><span><b>'+eur(ecPrice(b,it),0)+'</b><small>achat '+eur(p.c,0)+'</small></span><button data-a="met" data-i="'+b.id+'" data-v="mk" data-j="'+it.id+':0.1" aria-label="Monter le prix de '+esc(p.n)+'">+</button></div>'+
        '<div class="ac">'+Bt(it.mode==='stock'?'Passer en direct':'Passer en stock','mode',it.id)+(it.mode==='stock'?Bt('Commander 50','ord',it.id):'')+Bt('Retirer','rm',it.id,'Retirer '+p.n)+'</div></div>'; }).join('')+'</div>';
    if(m.cat.length<ecSlots(b)){ const open=ui.ec===b.id;
      h+='<button class="ec2-add" data-a="ecadd" data-i="'+b.id+'">'+(open?'Fermer la liste':'+ ajouter un produit')+'</button>';
      if(open) h+='<div class="ec2-pick">'+EC_PROD.filter(p=>!m.cat.some(x=>x.id===p.id)).sort((a,c)=>ecTr(m,c.id)-ecTr(m,a.id)).map(p=>'<button data-a="met" data-i="'+b.id+'" data-v="add" data-j="'+p.id+'"><span class="im">'+img(p.id)+'</span><b>'+esc(p.n)+'</b><small>'+esc(ecTrLabel(m,p.id))+' · achat '+eur(p.c,0)+'</small></button>').join('')+'</div>'; }
    h+='<div class="nf-row" style="margin:8px 4px 0"><small>Le stock propre rapporte plus par vente mais peut rester sur les bras quand la tendance retombe. L’expédition directe n’a pas de risque, mais la marge est plus faible.</small></div>';
    h+=nfRest(b,X,'Publicité et décisions');
    return h; }
};
FX2.build={
  chip:b=>plu(b.m.jobs.length,'chantier')+' en cours',
  stat:b=>['Réputation',Math.round(b.m.rep)+' / 100'],
  noRest:true,
  mgmt:{local:'Dépôt'},
  dlg:{txt:'peut répondre aux appels d’offres et acheter les matériaux à votre place'},
  body(b,X,U){ const m=b.m, Bd=NFA.build;
    let h=nfSec('Les chantiers',m.jobs.length? plu(m.jobs.filter(j=>S.day>j.due).length,'retard') : 'aucun en cours');
    h+= m.jobs.length? '<div class="bc2-site">'+m.jobs.map(j=>{ const pr=clamp(1-j.left/j.W,0,1), late=S.day>j.due, fl=j.k==='mais'?2:j.k==='oa'?3:6;
      return '<div class="bc2-j"><div class="im">'+Bd.site(Math.round(pr*fl),fl,150).replace('<svg ','<svg style="width:100%;height:auto" ')+'</div><b>'+esc(j.n)+'</b><small>'+esc(j.cl||'')+'</small><small class="'+(late?'late':'')+'">'+(late?'en retard de '+plu(S.day-j.due,'jour'):'livraison dans '+plu(j.due-S.day,'jour'))+'</small><span class="p" style="display:block"><i style="width:'+Math.round(pr*100)+'%"></i></span></div>'; }).join('')+'</div>' : '<div class="bc2-emp">Aucun chantier : répondez aux appels d’offres ci-dessous.</div>';
    h+=nfSec('Les matériaux')+'<div class="nf-card bc2-mat"><b>'+Math.round(m.mi*100)+' %</b><span class="nf-row" style="flex:1"><small>du prix normal · '+(m.mi>1.1?'cher : achetez au fil de l’eau':m.mi<.9?'bas : achetez d’avance':'proche de la normale')+'</small></span></div>';
    ['bid','pr','sub'].forEach(a=>X.get(a));
    const sel=bcSel(b), cap=bcCapDay(b), bpK={mais:'mais',comm:'comm',imm:'imm',oa:'oa',pub:'comm',gp:'imm'};
    h+=nfSec('Les appels d’offres',plu(m.off.length,'dossier'))+(m.off.length? '<div class="nf-mr" data-k="bcoff" data-n="3">'+m.off.map(o=>{ const days=Math.ceil(o.W/Math.max(.1,cap)), on=sel&&sel.id===o.id;
      let x='<div class="bc2-of'+(on?' on':'')+'"><span class="bp">'+Bd.blueprint(bpK[o.k]||'comm',96).replace('<svg ','<svg style="width:96px;height:auto" ')+'</span><div class="t"><b>'+esc(o.n)+(o.green?' · vert':'')+'</b><small>'+esc(o.cl)+' · estimation '+eur(o.ref,0)+' · délai souhaité '+o.dl+' j · environ '+days+' j de travail · '+o.comp+' concurrents'+(o.eng&&(m.eng||0)<o.eng?' · engins plus lourds requis':'')+'</small>'+
        (o.bid? '<span class="nf-ok" style="background:#E5EEFB;color:#1F3C88">réponse dans '+plu(Math.max(0,o.bid.d-S.day),'jour')+'</span>' : '<button class="btn nf-b'+(on?'':' a')+'" data-a="bcsel" data-i="'+b.id+'" data-v="'+(on?0:o.id)+'">'+(on?'Fermer':'Répondre')+'</button>')+'</div></div>';
      if(on){ const p=bcWin(b,o,sel.pr,sel.dl), price=o.ref*(1+sel.pr), mat=o.ref*BC_MAT*(o.k==='oa'?1.1:1)*m.mi;
        x+='<div class="nf-card bc2-bid"><div class="nf-ctl">'+nfRowH('Prix proposé','')+'<div class="nf-seg">'+BC_PR.map(([v,n])=>'<button class="'+(sel.pr===v?'on':'')+'" data-a="bcset" data-i="'+b.id+'" data-j="pr" data-v="'+v+'">'+n+'</button>').join('')+'</div></div>'+
          '<div class="nf-ctl" style="margin-top:10px">'+nfRowH('Délai proposé','')+'<div class="nf-seg">'+BC_DL.map(([v,n])=>'<button class="'+(sel.dl===v?'on':'')+'" data-a="bcset" data-i="'+b.id+'" data-j="dl" data-v="'+v+'">'+n+' · '+Math.round(o.dl*v)+' j</button>').join('')+'</div></div>'+
          '<label class="nf-row bc2-ma"><span><b>Acheter les matériaux d’avance</b><small>'+eur(mat,0)+' au prix du jour</small></span><input type="checkbox" data-a="bcset" data-i="'+b.id+'" data-j="ma" '+(sel.ma?'checked':'')+'></label>'+
          '<div class="bc2-win"><span><b>'+eur(price,0)+'</b><small>chance de l’emporter : '+Math.round(p*100)+' %</small></span><button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="bid" data-j="'+o.id+':'+sel.pr+':'+sel.dl+':'+(sel.ma?1:0)+'">Envoyer l’offre</button></div>'+
          '<div class="nf-row" style="margin-top:6px"><small>Fini dans environ '+Math.ceil((m.jobs.reduce((a,j)=>a+j.left,0)+o.W)/Math.max(.1,cap*.9))+' jours avec vos chantiers en cours. Chaque jour de retard coûte 1 % du prix.</small></div></div>'; }
      return x; }).join('')+'</div>' : '<div class="bc2-emp">Aucun appel d’offres pour le moment.</div>');
    const L=m.jobs.slice().sort((a,c)=>a.pr-c.pr);
    if(L.length) h+=nfSec('L’ordre des équipes','le premier chantier passe d’abord')+'<div class="nf-card nf-list">'+L.map((j,i)=>nfRowH((i+1)+'. '+esc(j.n),eur(bcRev(b,j),0)+(j.stop>S.day?' · suspendu (fouilles)':'')+(j.sub?' · sous-traité en partie':''),'<span class="bc2-ja">'+(i>0?'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="pr" data-j="'+j.id+'">Priorité</button>':'')+'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="sub" data-j="'+j.id+'">'+(j.sub?'Sous-traité':'Sous-traiter')+'</button></span>')).join('')+'</div>';
    h+=nfRest(b,X,'Engins et décisions');
    return h; }
};

/* NOUVELLE FICHE : visages, affiches, carte du monde, navires, avions (bibliothèques isolées) */
NFA.people=(function(){

let AV=0;
function face(seed,W,bg){ const r=x=>{ seed=(seed*9301+49297)%233280; return seed/233280*x; };
  const skin=['#F2D3B8','#E3B48E','#C68B62','#8D5B3E','#5E3B28'][Math.floor(r(5))], hair=['#2a1d16','#6b4a2e','#c9a06a','#1c1c1c','#a3483a','#d9d2c4'][Math.floor(r(6))], shirt=['#3D5AFE','#2BB673','#C8352A','#F2A33A','#5E6B7A','#7A4FB5'][Math.floor(r(6))];
  const st=Math.floor(r(4)), gl=r(1)<.3, id='av'+(++AV);
  let s='<rect width="60" height="60" rx="14" fill="'+(bg||'#EEF1F7')+'"/><path d="M8 60 Q10 42 30 42 Q50 42 52 60Z" fill="'+shirt+'"/><path d="M24 42 L30 50 L36 42Z" fill="#fff"/><rect x="26" y="34" width="8" height="9" fill="'+skin+'"/>';
  if(st===2) s+='<path d="M14 32 C10 10 50 10 46 32 L48 46 L12 46Z" fill="'+hair+'"/>';
  s+='<ellipse cx="30" cy="26" rx="11" ry="13" fill="'+skin+'"/>';
  if(st===0) s+='<path d="M19 24 C18 10 42 10 41 24 C38 17 26 16 19 24Z" fill="'+hair+'"/>';
  if(st===1) s+='<path d="M19 22 C19 12 41 12 41 22 L41 18 C36 14 24 14 19 18Z" fill="'+hair+'"/>';
  if(st===2) s+='<path d="M19 26 C17 12 43 12 41 26 C38 18 24 17 19 26Z" fill="'+hair+'"/>';
  if(st===3) s+='<circle cx="30" cy="14" r="6" fill="'+hair+'"/><path d="M19 24 C18 12 42 12 41 24 C38 18 25 17 19 24Z" fill="'+hair+'"/>';
  s+='<ellipse cx="26" cy="27" rx="1.3" ry="1.5" fill="#2a1d16"/><ellipse cx="34" cy="27" rx="1.3" ry="1.5" fill="#2a1d16"/><path d="M26.5 33 Q30 35.5 33.5 33" stroke="#9c4a42" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  if(gl) s+='<circle cx="26" cy="27" r="3.6" fill="none" stroke="#1d1f23" stroke-width="1"/><circle cx="34" cy="27" r="3.6" fill="none" stroke="#1d1f23" stroke-width="1"/><path d="M29.6 27 H30.4" stroke="#1d1f23"/>';
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 60 60">'+s+'</svg>'; }

/* affiches de films selon le genre */
let PO=0;
function poster(g,title,W){ const id='po'+(++PO), H=Math.round(W*1.48); let s='', bg='';
  if(g==='sf'){ bg='<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061a"/><stop offset="1" stop-color="#2b1460"/></linearGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/>'+Array.from({length:30},(_,i)=>'<circle cx="'+((i*37)%100)+'" cy="'+((i*53)%90)+'" r="'+(i%3?.5:.9)+'" fill="#fff"/>').join('')+'<circle cx="68" cy="52" r="28" fill="#ff7a3c"/><ellipse cx="68" cy="52" rx="44" ry="7" fill="none" stroke="#ffc09e" stroke-width="2" transform="rotate(-18 68 52)"/><path d="M14 104 L34 92 L40 96 L22 108Z" fill="#c9ced6"/><path d="M14 104 L4 112" stroke="#38E1FF" stroke-width="3"/><path d="M0 148 L0 118 Q50 100 100 122 L100 148Z" fill="#120a2e"/>'; }
  if(g==='dra'){ bg='<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3442"/><stop offset="1" stop-color="#0d1118"/></linearGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/>'+Array.from({length:40},(_,i)=>'<line x1="'+((i*29)%100)+'" y1="'+((i*41)%140)+'" x2="'+((i*29)%100-3)+'" y2="'+((i*41)%140+10)+'" stroke="#9fb3c8" stroke-width=".6" opacity=".6"/>').join('')+'<circle cx="50" cy="40" r="16" fill="#fff3d0" opacity=".25"/><path d="M42 120 L44 80 Q50 70 56 80 L58 120Z" fill="#05070b"/><circle cx="50" cy="72" r="7" fill="#05070b"/><path d="M30 76 Q50 56 70 76" fill="none" stroke="#05070b" stroke-width="3"/><line x1="50" y1="66" x2="50" y2="78" stroke="#05070b" stroke-width="2"/><rect x="0" y="120" width="100" height="28" fill="#05070b"/>'; }
  if(g==='act'){ bg='<radialGradient id="'+id+'" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#ffe08a"/><stop offset=".35" stop-color="#ff7a1a"/><stop offset=".7" stop-color="#a1180e"/><stop offset="1" stop-color="#1b0a06"/></radialGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/>'+Array.from({length:12},(_,i)=>'<path d="M50 80 L'+(50+Math.cos(i/12*6.28)*70).toFixed(0)+' '+(80+Math.sin(i/12*6.28)*70).toFixed(0)+'" stroke="#ffd36b" stroke-width="1.4" opacity=".5"/>').join('')+'<path d="M40 128 L46 100 L38 86 L50 76 L60 88 L66 82 L70 86 L62 96 L56 104 L62 128 L56 128 L50 108 L46 128Z" fill="#120806"/><circle cx="52" cy="70" r="6" fill="#120806"/><path d="M0 148 L0 128 L30 122 L52 130 L100 120 L100 148Z" fill="#120806"/>'; }
  if(g==='com'){ bg='<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff7ab6"/></linearGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/>'+Array.from({length:14},(_,i)=>'<circle cx="'+((i*31)%100)+'" cy="'+((i*47)%110)+'" r="3" fill="#fff" opacity=".35"/>').join('')+
      [[34,'#2b4c8a','#E3B48E'],[66,'#d6332a','#F2D3B8']].map(([x,sh,sk])=>'<path d="M'+(x-16)+' 148 Q'+(x-16)+' 104 '+x+' 104 Q'+(x+16)+' 104 '+(x+16)+' 148Z" fill="'+sh+'"/><circle cx="'+x+'" cy="88" r="14" fill="'+sk+'"/><path d="M'+(x-7)+' 92 Q'+x+' 100 '+(x+7)+' 92" stroke="#5a2a1a" stroke-width="2" fill="#fff"/><circle cx="'+(x-5)+'" cy="84" r="1.6" fill="#2a1d16"/><circle cx="'+(x+5)+'" cy="84" r="1.6" fill="#2a1d16"/>').join(''); }
  if(g==='doc'){ bg='<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c28b"/><stop offset=".55" stop-color="#e7905a"/><stop offset="1" stop-color="#3b5a3a"/></linearGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/><circle cx="50" cy="70" r="18" fill="#fff1c4" opacity=".9"/><path d="M0 98 L22 74 L36 88 L56 62 L78 86 L100 72 L100 148 L0 148Z" fill="#5a4a6a"/><path d="M0 118 Q50 100 100 116 L100 148 L0 148Z" fill="#2f4a2f"/><path d="M60 112 q6 -10 14 -2 l4 -6 l2 8 q-8 6 -20 0Z" fill="#1d1d1d"/>'; }
  if(g==='ani'){ bg='<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd3ff"/><stop offset="1" stop-color="#c9f5df"/></linearGradient>';
    s='<rect width="100" height="148" fill="url(#'+id+')"/><ellipse cx="22" cy="30" rx="14" ry="7" fill="#fff"/><ellipse cx="76" cy="22" rx="12" ry="6" fill="#fff"/><path d="M0 120 Q50 100 100 120 L100 148 L0 148Z" fill="#7fbf55"/><ellipse cx="50" cy="96" rx="22" ry="20" fill="#ff9a5c"/><circle cx="50" cy="70" r="18" fill="#ff9a5c"/><path d="M36 58 L32 42 L44 54Z M64 58 L68 42 L56 54Z" fill="#ff9a5c"/><circle cx="43" cy="68" r="5" fill="#fff"/><circle cx="57" cy="68" r="5" fill="#fff"/><circle cx="44" cy="69" r="2.6" fill="#1d1d1d"/><circle cx="58" cy="69" r="2.6" fill="#1d1d1d"/><path d="M46 78 Q50 82 54 78" stroke="#7a3a1a" stroke-width="1.6" fill="none"/><ellipse cx="50" cy="100" rx="12" ry="11" fill="#ffd8b8"/>'; }
  const words=title.toUpperCase().split(' '); let lines=[], cur=''; words.forEach(w=>{ if((cur+' '+w).trim().length>11){ lines.push(cur.trim()); cur=w; } else cur+=' '+w; }); lines.push(cur.trim());
  s+='<rect width="100" height="'+(lines.length*12+8)+'" fill="rgba(0,0,0,.35)"/>'+lines.map((l,i)=>'<text x="50" y="'+(14+i*12)+'" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="11" fill="#fff" letter-spacing=".6" stroke="rgba(0,0,0,.35)" stroke-width=".4">'+l+'</text>').join('');
  s+='<text x="50" y="142" text-anchor="middle" font-family="sans-serif" font-size="4.6" font-weight="700" fill="#fff" opacity=".85" letter-spacing="1">LUMIÈRE NORD PRÉSENTE</text>';
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 100 148" style="display:block"><defs>'+bg+'</defs>'+s+'</svg>'; }

return {face,poster,PO};
})();
NFA.world=(function(){

/* carte du monde stylisée (projection simple 360 × 180) */
const LANDS=['M30 30 L60 24 L95 22 L118 30 L122 38 L110 50 L104 58 L94 62 L90 72 L96 80 L92 82 L84 76 L74 68 L60 62 L48 56 L38 46 Z',
 'M92 82 L100 86 L104 92 L98 94 L94 88 Z',
 'M100 94 L112 90 L124 94 L136 104 L138 112 L130 126 L122 142 L114 158 L108 156 L106 140 L104 122 L98 108 Z',
 'M120 12 L146 10 L150 18 L140 28 L126 26 Z',
 'M166 34 L176 28 L192 26 L206 30 L204 40 L198 48 L194 54 L184 56 L174 56 L170 50 L166 44 Z',
 'M164 62 L180 58 L196 58 L206 60 L214 70 L222 80 L216 92 L210 104 L204 118 L198 128 L190 132 L186 122 L182 108 L176 96 L170 88 L162 78 Z',
 'M206 26 L240 20 L280 18 L312 22 L330 30 L326 40 L314 46 L306 56 L296 64 L286 72 L276 78 L264 80 L256 74 L246 72 L236 74 L228 66 L220 60 L212 52 L208 42 Z',
 'M240 72 L252 72 L256 78 L248 92 L244 84 Z','M270 82 L282 82 L288 90 L282 96 L276 90 Z','M292 92 L304 94 L310 100 L298 100 Z',
 'M284 118 L300 112 L318 112 L326 124 L322 136 L308 142 L292 138 L284 130 Z','M332 136 L338 140 L334 146 Z'];
const PORT={havre:[180,41,'Le Havre'],rott:[184,38,'Rotterdam'],shang:[301,59,'Shanghai'],sing:[284,89,'Singapour'],ny:[106,49,'New York'],santos:[134,114,'Santos'],dubai:[235,65,'Dubaï'],la:[62,56,'Los Angeles'],durban:[211,120,'Durban'],paris:[182,42,'Paris'],tokyo:[320,54,'Tokyo'],madrid:[176,50,'Madrid'],rome:[192,48,'Rome'],berlin:[193,38,'Berlin'],montreal:[106,44,'Montréal'],dakar:[163,75,'Dakar'],sydney:[331,124,'Sydney']};
function worldMap(routes,ports,o){ o=o||{}; let s='<svg width="100%" viewBox="'+(o.vb||'0 0 360 180')+'" style="display:block"><defs><pattern id="wmdots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="'+(o.dot||'rgba(255,255,255,.22)')+'"/></pattern></defs>';
  s+='<rect x="-50" y="-50" width="460" height="280" fill="'+(o.sea||'#0b2a4a')+'"/>';
  for(let y=0;y<180;y+=30) s+='<line x1="0" y1="'+y+'" x2="360" y2="'+y+'" stroke="rgba(255,255,255,.05)"/>'; for(let x=0;x<360;x+=30) s+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="180" stroke="rgba(255,255,255,.05)"/>';
  s+=LANDS.map(p=>'<path d="'+p+'" fill="'+(o.land||'#1f4a72')+'" stroke="'+(o.edge||'#2f6296')+'" stroke-width=".6"/><path d="'+p+'" fill="url(#wmdots)"/>').join('');
  routes.forEach(r=>{ const a=PORT[r[0]], b=PORT[r[1]], mx=(a[0]+b[0])/2, my=Math.min(a[1],b[1])-(r[3]||18);
    const d=r[4]||('M'+a[0]+' '+a[1]+' Q'+mx+' '+my+' '+b[0]+' '+b[1]);
    s+='<path d="'+d+'" fill="none" stroke="'+(r[2]||'#F2C94C')+'" stroke-width="1.6" stroke-dasharray="'+(r[5]||'0')+'" stroke-linecap="round" opacity=".95"/>';
    if(r[6]) s+='<circle r="2.6" fill="#fff" stroke="'+(r[2]||'#F2C94C')+'" stroke-width="1"><animateMotion dur="'+r[6]+'s" repeatCount="indefinite" path="'+d+'"/></circle>'; });
  ports.forEach(p=>{ const a=PORT[p[0]]; s+='<circle cx="'+a[0]+'" cy="'+a[1]+'" r="'+(p[1]?4:2.6)+'" fill="'+(p[1]?'#F2C94C':'#fff')+'" stroke="#0b2a4a" stroke-width="1"/>'+(p[2]!==0?'<text x="'+(a[0]+(p[3]||5))+'" y="'+(a[1]+(p[4]||3))+'" font-size="7" font-weight="800" fill="#fff" font-family="sans-serif" '+(p[3]<0?'text-anchor="end"':'')+'>'+a[2]+'</text>':''); });
  (o.marks||[]).forEach(m=>{ s+='<g transform="translate('+m[0]+' '+m[1]+')"><circle r="6" fill="'+m[2]+'" stroke="#fff" stroke-width="1"/><text y="2.6" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="sans-serif">'+m[3]+'</text></g>'; });
  return s+'</svg>'; }

return {worldMap,PORT};
})();
NFA.ship=(function(){

function ship(k,W,c){ c=c||'#C8352A'; let s='<svg width="'+W+'" height="'+Math.round(W*.42)+'" viewBox="0 0 160 66">';
  s+='<path d="M8 40 L152 40 L140 58 L18 58 Z" fill="'+c+'"/><path d="M8 40 L152 40 L150 44 L10 44Z" fill="#fff" opacity=".85"/><path d="M18 58 L140 58" stroke="#1d1f23" stroke-width="2"/>';
  if(k==='pc'){ const cols=['#C8352A','#1D4F91','#F2C94C','#2BB673','#E86A10','#5E6B7A','#7A4FB5']; for(let r=0;r<3;r++) for(let x=0;x<10;x++) s+='<rect x="'+(22+x*10)+'" y="'+(34-r*7)+'" width="9.4" height="6.4" fill="'+cols[(x*3+r*5)%7]+'" stroke="rgba(0,0,0,.2)" stroke-width=".4"/>';
    s+='<rect x="126" y="12" width="16" height="28" fill="#f4f6fa" stroke="#9aa2ae"/><rect x="128" y="16" width="12" height="4" fill="#9fd0e6"/><rect x="132" y="4" width="4" height="8" fill="#1d1f23"/>'; }
  if(k==='vr'){ [0,1,2,3,4].forEach(i=>{ s+='<rect x="'+(24+i*20)+'" y="32" width="16" height="8" fill="#5e6b7a"/><path d="M'+(25+i*20)+' 32 Q'+(32+i*20)+' 24 '+(39+i*20)+' 32Z" fill="#9a7a4a"/>'; }); s+='<path d="M60 32 L64 10 L66 32" stroke="#9aa2ae" stroke-width="2" fill="none"/><rect x="128" y="16" width="14" height="24" fill="#f4f6fa" stroke="#9aa2ae"/><rect x="130" y="20" width="10" height="4" fill="#9fd0e6"/>'; }
  if(k==='pt'){ s+='<path d="M20 40 L120 40" stroke="#9aa2ae" stroke-width="2"/>'+[30,52,74,96].map(x=>'<ellipse cx="'+x+'" cy="36" rx="9" ry="5" fill="#c9ced6" stroke="#9aa2ae"/>').join('')+'<path d="M24 34 H118" stroke="#5e6b7a" stroke-width="1.4"/><rect x="124" y="14" width="18" height="26" fill="#f4f6fa" stroke="#9aa2ae"/><rect x="126" y="18" width="14" height="4" fill="#9fd0e6"/><rect x="131" y="6" width="4" height="8" fill="#C8352A"/>'; }
  return s+'<path d="M0 60 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></svg>'; }

return {ship};
})();
NFA.plane=(function(){

function plane(k,W,c){ c=c||'#C8102E'; const L=k==='long'?180:(k==='region'?120:150), wide=k==='long';
  let s='<svg width="'+W+'" viewBox="0 0 200 70"><g transform="translate('+(100-L/2)+' 0)">';
  s+='<ellipse cx="'+(L/2)+'" cy="64" rx="'+(L*.42)+'" ry="3" fill="rgba(0,0,0,.12)"/>';
  // dérive
  s+='<path d="M'+(L*.06)+' 32 L'+(L*.02)+' 6 L'+(L*.1)+' 6 L'+(L*.2)+' 30Z" fill="'+c+'"/><path d="M'+(L*.035)+' 14 L'+(L*.085)+' 14" stroke="#fff" stroke-width="1.5"/>';
  s+='<path d="M'+(L*.04)+' 30 L'+(L*.0)+' 26 L'+(L*.02)+' 33Z" fill="#9aa2ae"/>';
  // fuselage
  const h=wide?18:15, y=30;
  s+='<path d="M'+(L*.04)+' '+(y+2)+' Q'+(L*.1)+' '+y+' '+(L*.2)+' '+y+' L'+(L*.86)+' '+y+' Q'+(L*.98)+' '+(y+1)+' '+L+' '+(y+h*.62)+' Q'+(L*.97)+' '+(y+h)+' '+(L*.86)+' '+(y+h)+' L'+(L*.2)+' '+(y+h)+' Q'+(L*.08)+' '+(y+h)+' '+(L*.04)+' '+(y+h*.4)+'Z" fill="#fbfcfe" stroke="#c4cbd6" stroke-width=".7"/>';
  s+='<path d="M'+(L*.12)+' '+(y+h*.72)+' L'+(L*.95)+' '+(y+h*.72)+'" stroke="'+c+'" stroke-width="2"/>';
  s+='<path d="M'+(L*.93)+' '+(y+3)+' L'+(L*.975)+' '+(y+4.5)+' L'+(L*.97)+' '+(y+6.5)+' L'+(L*.92)+' '+(y+6.5)+'Z" fill="#1d2a3a"/>';
  const n=Math.round(L/7); for(let i=0;i<n;i++){ const x=L*.22+i*(L*.66/n); s+='<rect x="'+x.toFixed(1)+'" y="'+(y+4)+'" width="2.6" height="3.4" rx="1" fill="#5d7da8"/>'; }
  s+='<rect x="'+(L*.85)+'" y="'+(y+3.5)+'" width="3" height="'+(h*.55)+'" rx="1" fill="none" stroke="#9aa2ae" stroke-width=".6"/>';
  // aile + moteurs
  s+='<path d="M'+(L*.42)+' '+(y+h*.7)+' L'+(L*.62)+' '+(y+h*.7)+' L'+(L*.36)+' '+(y+h+12)+' L'+(L*.3)+' '+(y+h+12)+'Z" fill="#dfe4ec" stroke="#b5bdc9" stroke-width=".6"/>';
  const eng=(ex,ey)=>'<rect x="'+ex+'" y="'+ey+'" width="'+(L*.12)+'" height="7" rx="3.5" fill="#c9d0da" stroke="#9aa2ae" stroke-width=".6"/><ellipse cx="'+(ex+L*.12)+'" cy="'+(ey+3.5)+'" rx="1.6" ry="3.2" fill="#3a4656"/>';
  s+=eng(L*.42,y+h+2); if(wide) s+=eng(L*.3,y+h+7);
  if(k==='region'){ s+='<circle cx="'+(L*.52)+'" cy="'+(y+h+5)+'" r="6" fill="none" stroke="#9aa2ae" stroke-width="1" stroke-dasharray="2 2"/>'; }
  // train
  s+='<path d="M'+(L*.82)+' '+(y+h)+' V'+(y+h+12)+' M'+(L*.45)+' '+(y+h)+' V'+(y+h+14)+'" stroke="#6b7480" stroke-width="1.4"/><circle cx="'+(L*.82)+'" cy="'+(y+h+13)+'" r="2.2" fill="#2a2f36"/><circle cx="'+(L*.45)+'" cy="'+(y+h+15)+'" r="2.6" fill="#2a2f36"/>';
  return s+'</g></svg>'; }

return {plane};
})();

