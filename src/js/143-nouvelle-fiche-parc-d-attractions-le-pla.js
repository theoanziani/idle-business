/* ============================================================
   NOUVELLE FICHE · PARC D'ATTRACTIONS : le plan, les files, le guichet, la météo, le soir
   ============================================================ */
NF_CSS.push(`
.md.nf-park{--nf-bg:#F0F8EC;--nf-bg2:#D6EBCB;--nf-acc:#E5484D;--nf-acc2:#B4282E;--nf-h:#E5484D;--nf-hf:400 23px 'Luckiest Guy','Baloo 2',sans-serif;--nf-sh:#D6EBCB;--nf-h1:400 27px/1.05 'Luckiest Guy','Baloo 2',sans-serif}
.md.nf-park .nf-sec{letter-spacing:.02em}
.pk2-map{background:#7CC36A;border-radius:22px;padding:10px;box-shadow:0 4px 0 #4E9A3E}
.pk2-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.pk2-c{position:relative;aspect-ratio:1;border:0;border-radius:10px;background:rgba(255,255,255,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;font:800 8.5px/1.05 var(--fb);color:#1B2550;padding:2px;overflow:hidden;box-shadow:inset 0 -3px 0 rgba(0,0,0,.08)}
.pk2-c.own{background:color-mix(in srgb,var(--zc,#ffffff) 70%,#fff)}
.pk2-c.free{background:rgba(255,255,255,.32);color:#fff;font-size:20px}
.pk2-c.lock{background:repeating-linear-gradient(45deg,#8C97D9 0 6px,#7C88CF 6px 12px);color:#fff}
.pk2-c.sel{box-shadow:0 0 0 3px #E5484D}
.pk2-c.down{filter:grayscale(.8)}
.pk2-c svg{width:24px;height:24px}
.pk2-c span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pk2-c em{position:absolute;top:1px;right:1px;font:800 8px var(--fb);font-style:normal;background:#E5484D;color:#fff;border-radius:6px;padding:0 3px}
.pk2-gate{display:block;width:96px;margin:8px auto 2px;text-align:center;background:#E5484D;color:#fff;font:400 13px 'Luckiest Guy','Baloo 2',sans-serif;border-radius:8px 8px 0 0;padding:3px 0;box-shadow:0 3px 0 #B4282E}
.pk2-zones{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.pk2-zones span{display:inline-flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:3px 10px;font:800 11.5px var(--fb);color:#1B2550}
.pk2-zones i{width:10px;height:10px;border-radius:3px;background:var(--zc,#ccc)}
.pk2-pan{margin-top:10px}
.pk2-pan .pk-pan{margin:0;background:none;padding:0;border:0}
.pk2-q b.big{font:800 32px var(--fd)}
.pk2-ppl{display:grid;grid-template-columns:repeat(24,1fr);gap:2px;margin:10px 0 8px}
.pk2-ppl i{height:12px;border-radius:5px 5px 2px 2px;background:#9AA8E8}
.pk2-ppl i.out{background:#F4A99B}
.pk2-cap{position:relative;height:10px;border-radius:5px;background:#F4A99B;overflow:hidden}
.pk2-cap i{position:absolute;left:0;top:0;bottom:0;background:#2BB673;border-radius:5px}
.pk2-cl{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-3);margin-top:5px}
.pk2-q .nf-row+*~.nf-row{margin-top:10px;padding-top:10px;border-top:1px solid #E5EFE0}
.pk2-tk{display:flex;background:#E5484D;border-radius:18px;color:#fff;box-shadow:0 4px 0 #B4282E;overflow:hidden}
.pk2-tk .l{flex:1;padding:12px 14px}
.pk2-tk .l small{display:block;font:800 11px var(--fb);letter-spacing:.08em;opacity:.85}
.pk2-tk .l b{font:400 40px/1.1 'Luckiest Guy','Baloo 2',sans-serif}
.pk2-tk .l span{display:block;font-size:12px;opacity:.9}
.pk2-tk .r{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:10px;border-left:2px dashed rgba(255,255,255,.5);align-content:center}
.pk2-tk .r button{width:46px;height:44px;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;font:800 14px var(--fb);padding:0;box-shadow:none}
.pk2-sp{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.pk2-sp div{background:#fff;border-radius:14px;padding:8px 10px;box-shadow:0 3px 0 var(--nf-sh)}
.pk2-sp small{display:block;font:700 11px var(--fb);color:var(--ink-3)}.pk2-sp b{font:800 17px var(--fd)}
.pk2-wx{display:flex;gap:12px;align-items:center;background:#DDEFFF;border-radius:18px;padding:12px;box-shadow:0 4px 0 #BCD9F3}
.pk2-wx .ic{width:64px;height:64px;border-radius:18px;background:#fff;display:grid;place-items:center;flex:0 0 auto}
.pk2-wx .ic svg{width:42px;height:42px}
.pk2-wx b{font:800 17px var(--fd);display:block}
.pk2-wx span{font-size:12.5px;color:var(--ink-3)}
.pk2-eve{background:linear-gradient(#2B2A6B,#1D1C4A);border-radius:20px;padding:12px;box-shadow:0 4px 0 #11102E;color:#E8E6FF}
.pk2-eve .nf-row{color:#C9C6F2}.pk2-eve .nf-row b{color:#fff}.pk2-eve .nf-row small{color:#C9C6F2}
.pk2-eve .nf-row+.nf-row{margin-top:10px}
.pk2-eve .nf-tog{background:rgba(255,255,255,.18)}.pk2-eve .nf-tog.on{background:#F2B705}
`);
NF_FONTS.push('luckiest:Luckiest Guy:400');
const PK2_WX={soleil:'<circle cx="24" cy="24" r="9" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="3" stroke-linecap="round"><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4 4M33.5 33.5l4 4M10.5 37.5l4-4M33.5 14.5l4-4"/></g>',
  nuages:'<circle cx="18" cy="18" r="7" fill="#FFC93C"/><path d="M14 36h20a7 7 0 0 0 0-14 9 9 0 0 0-17 3 6 6 0 0 0-3 11z" fill="#C9D6EA"/>',
  pluie:'<path d="M12 28h22a7 7 0 0 0 0-14 9 9 0 0 0-17 3 6 6 0 0 0-5 11z" fill="#9FB3D1"/><g stroke="#3C8BFF" stroke-width="3" stroke-linecap="round"><path d="M16 33l-2 6M24 33l-2 6M32 33l-2 6"/></g>'};
FX2.park={
  chip:b=>{ const m=b.m; return (b.closedUntil>S.day?'Fermé':'Ouvert')+(m.vis?' · '+fmtN(Math.round(m.vis))+' visiteurs':''); },
  stat:b=>['Attente moyenne',Math.round(b.m.wait||0)+' min'],
  mgmt:{local:'Terrain'},
  dlg:{txt:'peut construire et fixer le prix du billet à votre place'},
  body(b,X,U){ pkFix(b); const m=b.m, p=pkCalc(b), sel=pkSel(b), R0=metR0(b); let h='';
    /* 1. le plan */
    X.get('place'); X.get('rm'); X.get('zone'); X.get('theme');
    h+=nfSec('Le plan du parc','touchez une case')+'<div class="pk2-map"><div class="pk2-grid">'+m.cells.map((c,i)=>{ const z=m.zones[pkZone(i)], th=z.th&&PK_TH[z.th], it=c&&pkIt(c.t);
      const cl='pk2-c'+(z.own?(it?' own':' free'):' lock')+(c&&c.d>S.day?' down':'')+(i===sel?' sel':'');
      const lab= it? it.n : z.own? 'Case libre' : 'Zone '+(pkZone(i)+1)+' à acheter';
      return '<button class="'+cl+'" data-a="pksel" data-i="'+b.id+'" data-v="'+(i===sel?-1:i)+'" aria-label="'+esc(lab)+'" style="--zc:'+(th?th.c:'#ffffff')+'">'+(it? pkIco(it.id,24)+'<span>'+esc(it.n.split(' ')[0])+'</span>'+(c.d>S.day?'<em>panne</em>':'') : z.own? '+' : '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/></svg>')+'</button>'; }).join('')+'</div>'+
      '<span class="pk2-gate">Entrée</span><div class="pk2-zones">'+m.zones.map((z,k)=>'<span style="--zc:'+(z.th?PK_TH[z.th].c:z.own?'#fff':'#8C97D9')+'"><i></i>'+(z.th? esc(PK_TH[z.th].n) : 'Zone '+(k+1))+(z.own?'':' · à acheter')+'</span>').join('')+'</div></div>';
    if(sel>=0) h+='<div class="nf-card pk2-pan">'+pkPanel(b,sel)+'</div>';
    /* 2. les files d'attente */
    const cap=pkCapDay(b,p.cap), vis=Math.round(m.vis||0), dem=Math.max(vis,1), ratio=cap? clamp(cap/Math.max(dem,cap*.2),0,1.6) : 0, inF=clamp(Math.min(dem,cap)/dem,0,1), n=48, ok=Math.round(n*inF), cF=X.get('fp');
    h+=nfSec('Les files d’attente')+'<div class="nf-card pk2-q"><div class="nf-row"><span><b class="big" style="color:'+(m.wait>40?'var(--red)':'var(--ink)')+'">'+Math.round(m.wait||0)+' min</b></span><small>'+(m.wait>40?'des visiteurs repartent':m.wait<12?'le parc a de la marge':'attente supportable')+'</small></div>'+
      '<div class="pk2-ppl" aria-hidden="true">'+Array.from({length:n},(_,i)=>'<i class="'+(i<ok?'':'out')+'"></i>').join('')+'</div>'+
      '<div class="pk2-cap"><i style="width:'+Math.round(clamp(cap/Math.max(cap,dem),0,1)*100)+'%"></i></div><div class="pk2-cl"><span>Capacité : '+fmtN(Math.round(cap))+' / jour</span><span>Visiteurs : '+fmtN(vis)+'</span></div>'+
      (cF? nfRowH('Coupe-file','environ 12 % des visiteurs paient 6 € de plus ; l’attente des autres augmente un peu',nfTogH(b,cF)) : '')+'</div>';
    /* 3. le guichet */
    X.get('tk'); const tb=(v,l)=>'<button data-a="met" data-i="'+b.id+'" data-v="tk" data-j="'+v+'" aria-label="'+l+'">'+(v>0?'+':'−')+Math.abs(v)+'</button>';
    h+=nfSec('Le guichet')+'<div class="pk2-tk"><div class="l"><small>BILLET ADULTE · 1 JOUR</small><b>'+eur(m.tk,0)+'</b><span>un billet cher fait fuir une partie des visiteurs, mais réduit l’attente</span></div><div class="r">'+tb(1,'Monter de 1 €')+tb(5,'Monter de 5 €')+tb(-1,'Baisser de 1 €')+tb(-5,'Baisser de 5 €')+'</div></div>'+
      '<div class="pk2-sp"><div><small>Billet</small><b>'+eur(m.tk,0)+'</b></div><div><small>Restauration</small><b>'+eur(p.fs,1)+'</b></div><div><small>Boutiques</small><b>'+eur(p.ss,1)+'</b></div></div>';
    /* 4. la météo */
    h+=nfSec('La météo','la pluie vide le parc')+'<div class="pk2-wx"><span class="ic"><svg viewBox="0 0 48 48" aria-hidden="true">'+PK2_WX[p.wx]+'</svg></span><span><b>Aujourd’hui : '+MET_WXN[p.wx].toLowerCase()+'</b><span>'+(p.wx==='pluie'?'Seules les attractions couvertes (train fantôme, spectacles) restent pleines.':p.wx==='soleil'?'Les attractions aquatiques font le plein.':'Fréquentation normale.')+' '+metSeasonName()+(p.ev?' · '+p.ev.n:'')+'.</span></span></div>';
    /* 5. le soir */
    const cN=X.get('noc'), cE=X.get('ev');
    h+=nfSec('Le soir')+'<div class="pk2-eve">'+(cN? nfRowH('Nocturnes','trois heures de plus chaque soir : débit et fréquentation en hausse, surtout l’été · '+eur(R0*.05,0)+' / jour',nfTogH(b,cN)) : nfRowH('Nocturnes','disponibles au palier « Nocturnes et décors »'))+
      (cE? nfRowH('Événements de saison','Halloween et Noël : +35 % de visiteurs pendant l’événement',nfTogH(b,cE)) : nfRowH('Événements de saison','disponibles au palier « Événements »'))+'</div>';
    /* 6. l'entretien */
    const cM=X.get('maint');
    if(cM) h+=nfSec('L’entretien')+'<div class="nf-card">'+nfRowH('Entretien des attractions','')+nfSegH(b,cM)+'<div class="nf-row" style="margin-top:6px"><small>'+esc(PK_MAINT[m.maint][1])+'.</small></div></div>';
    return h; }
};

