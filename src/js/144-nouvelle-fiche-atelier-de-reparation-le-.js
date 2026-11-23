/* ============================================================
   NOUVELLE FICHE · ATELIER DE RÉPARATION : le comptoir, l'établi, les tiroirs, l'étagère
   ============================================================ */
NF_CSS.push(`
.md.nf-repair{--nf-bg:#ECEEF1;--nf-bg2:#D5D9E0;--nf-acc:#F07F1C;--nf-acc2:#B95A0A;--nf-h:#3B4452;--nf-hf:700 13.5px 'Space Mono',monospace;--nf-sh:#D5D9E0;--nf-h1:700 26px/1.05 'Space Mono',monospace}
.md.nf-repair .nf-sec{letter-spacing:.08em;text-transform:uppercase}
.rp2-cpt{background:#D9B98A radial-gradient(#C9A574 1px,transparent 1.5px) 0 0/10px 10px;border-radius:20px;padding:10px;box-shadow:0 4px 0 #B08D5C}
.rp2-cpt .hd{display:flex;justify-content:space-between;font:800 13.5px var(--fb);color:#3A2A10;padding:0 2px 8px}
.rp2-cpt .hd small{font-weight:600;color:#5A4320}
.rp2-tk{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -10px;padding:0 10px 4px}
.rp2-tk::-webkit-scrollbar{display:none}
.rp2-j{position:relative;flex:0 0 128px;border:0;text-align:left;background:#FFFDF8;border-radius:12px;padding:9px 10px;box-shadow:0 3px 0 rgba(0,0,0,.15);font:inherit;color:var(--ink);min-height:120px}
.rp2-j::after{content:'';position:absolute;top:7px;right:9px;width:9px;height:9px;border-radius:50%;background:#C9A574;box-shadow:inset 0 1px 1px rgba(0,0,0,.3)}
.rp2-j.sel{box-shadow:0 0 0 3px #F07F1C,0 3px 0 rgba(0,0,0,.15)}
.rp2-j.late{background:#FFF4EC}
.rp2-j svg{width:26px;height:26px;display:block}
.rp2-j b{display:block;font:800 13.5px/1.15 var(--fb);margin-top:4px}
.rp2-j small{display:block;font-size:11px;color:var(--ink-3)}
.rp2-j .ft{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font:800 12.5px var(--fd)}
.rp2-j .ft em{font:800 10px var(--fb);font-style:normal;border-radius:6px;padding:1px 6px;background:#EEF0F3;color:var(--ink-3)}
.rp2-j .ft em.r{background:#FFE4E0;color:#C8352A}
.rp2-j .ft em.t{background:#E5F0FF;color:#1F3C88}
.rp2-emp{font-size:13px;color:#5A4320;padding:8px 2px}
.rp2-eta{background:#1F6E5C linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px) 0 0/14px 14px;border-radius:20px;padding:12px;box-shadow:0 4px 0 #134A3D;color:#E4F4EF}
.rp2-eta>.nf-row{color:#BFE3D8}.rp2-eta>.nf-row b{color:#fff}.rp2-eta>.nf-row small{color:#BFE3D8}
.rp2-eta .nf-tog:not(.on){background:rgba(0,0,0,.25)}
.rp2-te{display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.18);border-radius:16px;padding:10px;margin-top:10px}
.rp2-te .av{width:44px;height:44px;border-radius:14px;background:#E4F4EF;color:#1F6E5C;display:grid;place-items:center;font:800 15px var(--fd);flex:0 0 auto}
.rp2-te .t{flex:1;min-width:0}
.rp2-te .t b{display:block;font:800 14.5px var(--fb)}
.rp2-te .t small{display:block;font-size:11.5px;color:#BFE3D8}
.rp2-sk{display:flex;flex-wrap:wrap;gap:3px 8px;margin-top:5px}
.rp2-sk span{display:flex;align-items:center;gap:2px}
.rp2-sk svg{width:12px;height:12px;margin-right:2px}
.rp2-sk i{width:4px;height:9px;border-radius:2px;background:rgba(255,255,255,.18)}
.rp2-sk i.f{background:#F2C94C}
.rp2-post{flex:0 0 76px;min-height:64px;border-radius:12px;background:rgba(255,255,255,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:700 10.5px var(--fb);color:#E4F4EF;text-align:center;padding:4px;border:0}
.rp2-post svg{width:22px;height:22px}
.rp2-post .bar{width:52px;height:4px;border-radius:2px;background:rgba(255,255,255,.2);overflow:hidden}
.rp2-post .bar i{display:block;height:100%;background:#F2C94C}
.rp2-post.drop{border:2px dashed rgba(255,255,255,.5);background:none;font:800 12px var(--fb)}
.rp2-post.drop.best{border-color:#F2C94C;color:#F2C94C}
.rp2-tir{background:#5B6472;border-radius:20px;padding:10px;box-shadow:0 4px 0 #3B4452}
.rp2-tir .g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.rp2-dr{background:linear-gradient(#F4F5F7,#DADDE3);border-radius:12px;padding:8px 10px 6px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.08)}
.rp2-dr em{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:800 9.5px 'Space Mono',monospace;font-style:normal;background:#FFE7C7;color:#7A4A10;border-radius:4px;padding:1px 5px;letter-spacing:.06em}
.rp2-dr em.lo{background:#FFE4E0;color:#C8352A}
.rp2-dr .n{display:flex;align-items:baseline;gap:4px;margin-top:3px}
.rp2-dr .n b{font:800 22px var(--fd)}.rp2-dr .n b.lo{color:#C8352A}
.rp2-dr .n small{font-size:11.5px;color:var(--ink-3)}
.md.nf-repair .rp2-dr .nf-b{min-height:40px;width:100%;margin-top:4px;font-size:12px;padding:0 6px}
.rp2-dr .hdl{display:block;width:40px;height:5px;border-radius:3px;background:#9AA2AE;margin:6px auto 0}
.rp2-tir .nf-row{margin-top:10px;color:#D5D9E0}.rp2-tir .nf-row b{color:#fff}.rp2-tir .nf-row small{color:#D5D9E0}
.rp2-tir .ord{margin-top:8px;background:rgba(0,0,0,.18);border-radius:10px;padding:7px 10px;color:#fff;font-size:12.5px}
.rp2-tir .nf-tog:not(.on){background:rgba(0,0,0,.3)}
.rp2-sh{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center}
.rp2-sh>div{display:flex;flex-direction:column;align-items:center}
.rp2-sh .pl{display:flex;gap:3px;align-items:flex-end;height:40px;border-bottom:5px solid #C9A574;width:100%;justify-content:center;padding-bottom:1px}
.rp2-sh .pl i{width:13px;height:30px;border-radius:3px;background:#5B6472;box-shadow:inset 0 0 0 2px #3B4452}
.rp2-sh .pl i.br{background:repeating-linear-gradient(45deg,#9AA2AE 0 3px,#C4C9D1 3px 6px);box-shadow:inset 0 0 0 2px #5B6472}
.rp2-sh .pl i.ok{background:#3BB08F;box-shadow:inset 0 0 0 2px #1F6E5C}
.rp2-sh small{font:700 11px var(--fb);color:var(--ink-3);margin-top:6px}
.rp2-sh b{font:800 17px var(--fd)}
.rp2-gar{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.rp2-gar>div{background:#fff;border-radius:16px;padding:10px 12px;box-shadow:0 3px 0 var(--nf-sh)}
.rp2-gar small{display:block;font:700 11.5px var(--fb);color:var(--ink-3)}
.rp2-gar b{font:800 26px var(--fd)}
.rp2-gar span{color:#F2B705;letter-spacing:1px}
`);
NF_FONTS.push('spacemono:Space Mono:700');
const RP2_DEV={tel:'<rect x="7" y="2" width="10" height="20" rx="2" fill="#3B4452"/><rect x="8.3" y="4" width="7.4" height="14.5" rx=".6" fill="#8FB5E8"/>',
  tab:'<rect x="3" y="4" width="18" height="16" rx="2" fill="#3B4452"/><rect x="5" y="6" width="14" height="12" rx=".6" fill="#8FB5E8"/>',
  pc:'<rect x="4" y="5" width="16" height="11" rx="1.5" fill="#3B4452"/><rect x="5.5" y="6.5" width="13" height="8" fill="#8FB5E8"/><path d="M2 17h20l-1.5 2.5h-17z" fill="#5B6472"/>'};
const rpDevIco=(d,w)=>'<svg viewBox="0 0 24 24" aria-hidden="true"'+(w?' width="'+w+'" height="'+w+'"':'')+'>'+RP2_DEV[d]+'</svg>';
FX2.repair={
  chip:b=>{ const n=b.m.q.filter(j=>!j.recon).length; return 'Ouvert · '+plu(n,'appareil')+' en attente'; },
  stat:b=>['Avis des clients',b.m.note.toFixed(1).replace('.',NDEC)+' / 5'],
  dlg:{txt:'peut répartir les réparations et commander les pièces à votre place'},
  body(b,X,U){ const m=b.m, sel=rpSel(b); rpTechSync(b); let h='';
    /* 1. le comptoir */
    const Q=m.q.filter(j=>!j.recon).sort((a,c)=>(c.ret-a.ret)||(a.due-c.due));
    h+=nfSec('Le comptoir','touchez un appareil, puis un poste')+'<div class="rp2-cpt"><div class="hd"><span>En attente · '+Q.length+'</span><small>délai promis au client</small></div>'+
      (Q.length? '<div class="rp2-tk">'+Q.slice(0,14).map(j=>{ const pb=rpPb(j.pb), late=S.day>j.due, d=j.due-S.day, on=sel===j.id;
        return '<button class="rp2-j'+(on?' sel':'')+(late?' late':'')+'" data-a="rpsel" data-i="'+b.id+'" data-v="'+(on?0:j.id)+'" aria-label="'+esc(RP_DEV[j.dev].n+' : '+pb.n)+'">'+rpDevIco(j.dev)+'<b>'+esc(pb.n)+'</b><small>'+RP_DEV[j.dev].n.toLowerCase()+' · '+String(Math.round(j.h*10)/10).replace('.',NDEC)+' h'+(j.tk?' · '+esc(j.tk):'')+'</small>'+
          '<span class="ft"><span>'+(j.ret?'garantie':eur(j.price,0))+'</span><em class="'+(late?'r':j.tk?'t':'')+'">'+(late?'en retard':j.tk?Math.round(j.done/j.h*100)+' %':d<=0?'aujourd’hui':d+' j')+'</em></span></button>'; }).join('')+'</div>' : '<div class="rp2-emp">Aucun appareil en attente.</div>')+'</div>';
    /* 2. l'établi */
    const cA=X.get('auto'), sj=sel? m.q.find(x=>x.id===sel) : null; X.get('as');
    h+=nfSec('L’établi',plu(m.tech.length,'technicien'))+'<div class="rp2-eta">'+(cA? nfRowH('Répartition automatique','chaque appareil part vers le technicien le plus doué pour lui',nfTogH(b,cA)) : '')+
      m.tech.map(t=>{ const j=m.q.find(x=>x.tk===t.n), best=Object.keys(t.sk).reduce((a,k)=>t.sk[k]>t.sk[a]?k:a,'tel'), avg=(t.sk.tel+t.sk.tab+t.sk.pc)/3;
        const role= avg>=4? 'expert' : t.sk[best]>=4? 'spécialiste '+RP_DEV[best].n.toLowerCase()+'s' : avg<2.4? 'débutant' : 'polyvalent';
        let post;
        if(sj) post='<button class="rp2-post drop'+(t.sk[sj.dev]>=4?' best':'')+'" data-a="met" data-i="'+b.id+'" data-v="as" data-j="'+sj.id+':'+esc(t.n)+'">Poser ici<small style="font-size:10px">≈ '+String(Math.round(sj.h/rpSpeed(t,sj.dev)*10)/10).replace('.',NDEC)+' h</small></button>';
        else if(j) post='<span class="rp2-post">'+rpDevIco(j.dev,22)+esc((rpPb(j.pb).n.split(' ')[0]||'').toLowerCase())+'<span class="bar"><i style="width:'+Math.round(clamp(j.done/j.h,0,1)*100)+'%"></i></span></span>';
        else post='<span class="rp2-post">libre</span>';
        return '<div class="rp2-te"><span class="av">'+esc(t.n.slice(0,2).toUpperCase())+'</span><div class="t"><b>'+esc(t.n)+'</b><small>'+role+'</small><div class="rp2-sk">'+['tel','tab','pc'].map(k=>'<span aria-label="'+RP_DEV[k].n+' '+t.sk[k]+' sur 5">'+rpDevIco(k,12)+[1,2,3,4,5].map(i=>'<i class="'+(i<=t.sk[k]?'f':'')+'"></i>').join('')+'</span>').join('')+'</div></div>'+post+'</div>'; }).join('')+'</div>';
    /* 3. les tiroirs à pièces */
    X.get('ord'); const cO=X.get('aord'), pend=m.ord.reduce((a,o)=>a+o.n,0), need=k=>Q.filter(j=>j.part&&rpPb(j.pb).part===k).length;
    h+=nfSec('Les tiroirs à pièces','livraison en 2 jours')+'<div class="rp2-tir"><div class="g">'+Object.keys(RP_PART).map(k=>{ const lock=k==='car'&&!mxHas(b,1), n=m.st[k]||0, lo=!lock&&n<Math.max(2,need(k)), c=rpPartCost(b,k), p=m.ord.filter(o=>o.k===k).reduce((a,o)=>a+o.n,0);
      return '<div class="rp2-dr"><em class="'+(lo?'lo':'')+'">'+RP_PART[k].n.toUpperCase()+'</em><div class="n"><b class="'+(lo?'lo':'')+'">'+n+'</b><small>'+(lock?'micro-soudure':eur(c,0)+' pièce')+(p?' · +'+p:'')+'</small></div>'+
        (lock? '<span class="hdl"></span>' : '<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="ord" data-j="'+k+'"'+(nfCan(b,c*5)?'':' disabled')+'>+5 · '+eur(c*5,0)+'</button>')+'</div>'; }).join('')+'</div>'+
      (pend? '<div class="ord">Commandes en route : '+plu(pend,'pièce')+', livraison sous 2 jours</div>' : '')+(cO? nfRowH('Commande automatique','recommande dès qu’un tiroir se vide',nfTogH(b,cO)) : '')+'</div>';
    /* 4. l'étagère du reconditionné */
    const R=m.q.filter(j=>j.recon), rw=R.filter(j=>!j.tk).length, rr=R.filter(j=>j.tk).length, cB=X.get('buy');
    h+=nfSec('L’étagère du reconditionné')+'<div class="nf-card"><div class="rp2-sh"><div><span class="pl">'+Array.from({length:Math.min(5,rw)},()=>'<i class="br"></i>').join('')+'</span><small>Rachetés cassés</small><b>'+rw+'</b></div>'+
      '<div><span class="pl">'+Array.from({length:Math.min(5,rr)},()=>'<i></i>').join('')+'</span><small>En réparation</small><b>'+rr+'</b></div><div><span class="pl">'+Array.from({length:Math.min(5,m.sold||0)},()=>'<i class="ok"></i>').join('')+'</span><small>Revendus</small><b>'+fmtN(m.sold||0)+'</b></div></div>'+
      (cB? '<div class="nf-row" style="margin-top:12px"><span><small>'+esc(cB.sub)+'</small></span>'+nfBtn(b,cB,'Racheter 5 · '+eur(cB.cost,0),{c:'a',dis:!nfCan(b,cB.cost)})+'</div>' : '')+'</div>';
    /* 5. garantie et avis */
    const ret=m.q.filter(j=>j.ret).length, st=Math.round(m.note);
    h+=nfSec('Garantie et avis')+'<div class="rp2-gar"><div><small>Avis des clients</small><b>'+m.note.toFixed(1).replace('.',NDEC)+'</b> <span>'+'★'.repeat(st)+'<i style="opacity:.3;font-style:normal">'+'★'.repeat(5-st)+'</i></span></div><div><small>Retours sous garantie</small><b>'+ret+'</b> <small style="display:inline">en attente</small></div></div>'+
      '<div class="nf-row" style="margin:8px 4px 0"><small>Une réparation ratée revient gratuitement : un technicien plus doué sur l’appareil en rate moins.</small></div>';
    return h; }
};

