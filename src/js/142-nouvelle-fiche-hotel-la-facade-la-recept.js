/* ============================================================
   NOUVELLE FICHE · HÔTEL : la façade, la réception, la semaine, les services, les étoiles
   ============================================================ */
NF_CSS.push(`
.md.nf-hotel{--nf-bg:#F5F2EA;--nf-bg2:#E4DCC8;--nf-acc:#1B2A55;--nf-acc2:#0F1A38;--nf-h:#1B2A55;--nf-hf:700 21px 'Playfair Display',Georgia,serif;--nf-sh:#E4DCC8;--nf-h1:700 27px/1.05 'Playfair Display',Georgia,serif}
.ht2-fac{background:#16213F;border-radius:20px;padding:12px;box-shadow:0 4px 0 #0B1229;color:#fff}
.ht2-fac>.nf-row{color:#C9D3EE;margin-bottom:10px}.ht2-fac>.nf-row b{color:#fff}.ht2-fac>.nf-row small{color:#C9D3EE}
.ht2-roof{height:12px;margin:0 10px;border-radius:6px 6px 0 0;background:#C9A54E}
.ht2-fl{background:#24315A;border-bottom:3px solid #16213F;padding:10px 10px 8px}
.ht2-fl:nth-child(even){background:#2A3866}
.ht2-fl.lock{opacity:.75}
.ht2-fl .hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ht2-fl .hd b{font:800 14.5px var(--fb);display:block}
.ht2-fl .hd small{display:block;font-size:12px;color:#B9C3E2}
.ht2-px{display:flex;align-items:center;gap:2px;flex:0 0 auto}
.ht2-px button{width:40px;height:44px;border:0;background:none;color:#F2C94C;font:800 20px var(--fb);padding:0;box-shadow:none}
.ht2-px b{font:800 15px var(--fd);min-width:64px;text-align:center;color:#fff}
.ht2-win{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;margin-top:8px}
.ht2-win i{aspect-ratio:1.25;border-radius:2px;background:#3B4A7C}
.ht2-win i.on{background:#F7D77A;box-shadow:0 0 6px rgba(247,215,122,.65)}
.ht2-gr{background:#F1EAD8;color:#1B2A55;text-align:center;padding:8px 0 0;margin:0 0 -12px;border-radius:0 0 18px 18px;overflow:hidden}
.ht2-gr b{display:block;font:700 13px 'Playfair Display',Georgia,serif;letter-spacing:.25em}
.ht2-gr i{display:block;width:44px;height:36px;margin:6px auto 0;border-radius:22px 22px 0 0;background:#3A2A20;border:3px solid #C9A54E;border-bottom:0}
.md.nf-hotel .ht2-fac .nf-b.a{background:#C9A54E;color:#1B2A55;box-shadow:0 3px 0 #8E7230}
.ht2-rec{background:#4A3426;border-radius:20px;padding:12px;box-shadow:0 4px 0 #2B1C13;color:#F6E9DC}
.ht2-rec .hd{display:flex;justify-content:space-between;align-items:baseline}
.ht2-rec .hd b{font:700 19px 'Playfair Display',Georgia,serif}
.ht2-keys{display:grid;grid-template-columns:repeat(10,1fr);gap:2px;background:#3A281D;border-radius:12px;padding:8px 6px;margin-top:8px}
.ht2-keys span{display:flex;flex-direction:column;align-items:center;font:800 8.5px var(--fb);color:#BFA48D;height:34px;justify-content:flex-end;position:relative}
.ht2-keys span::before{content:'';position:absolute;top:4px;width:6px;height:6px;border-radius:50%;background:#20150F}
.ht2-keys span.k svg{position:absolute;top:2px;width:14px;height:18px}
.ht2-cnt{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.ht2-cnt div{background:rgba(0,0,0,.2);border-radius:12px;padding:7px 9px}
.ht2-cnt small{display:block;font:700 11px var(--fb);color:#D9C2AE}.ht2-cnt b{font:800 18px var(--fd)}
.ht2-rec .nf-row{margin-top:10px;color:#D9C2AE}.ht2-rec .nf-row b{color:#fff}.ht2-rec .nf-row small{color:#D9C2AE}
.ht2-rec .nf-seg{background:rgba(0,0,0,.25)}.ht2-rec .nf-seg button{color:#F6E9DC}.ht2-rec .nf-seg button.on{background:#E8C46A;color:#3A281D}
.ht2-rec .nf-tog{background:rgba(0,0,0,.3)}.ht2-rec .nf-tog.on{background:#2BB673}
.ht2-rec .note{font-size:12px;color:#E8C46A;margin-top:6px}
.ht2-wk{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}
.ht2-wk div{border-radius:10px;padding:6px 1px;text-align:center;background:#E8ECF8;font:800 11px var(--fb);color:#1B2A55;min-width:0;overflow:hidden}
.ht2-wk div small{display:block;font:700 8px var(--fb);overflow:hidden;text-overflow:ellipsis;color:var(--ink-3);margin-top:3px}
.ht2-wk div.we{background:#F1EBDD}.ht2-wk div.on{background:#DCE4FA}.ht2-wk div.mar{background:#F6E3B5}
.ht2-wk svg{width:18px;height:18px;display:block;margin:3px auto 0}
.ht2-svc{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ht2-svc>div{background:#fff;border-radius:16px;padding:10px 8px;text-align:center;box-shadow:0 3px 0 var(--nf-sh);display:flex;flex-direction:column;align-items:center;gap:4px}
.ht2-svc i{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#E8F5EF}
.ht2-svc i.off{background:#F1EBDD}
.ht2-svc i svg{width:22px;height:22px}
.ht2-svc b{font:800 13.5px var(--fb)}
.ht2-svc small{font:700 11px var(--fb);color:#16804D}
.ht2-svc small.off{color:var(--ink-3)}
.md.nf-hotel .ht2-svc .nf-b{min-height:40px;padding:0 8px;font-size:12px;width:100%}
.ht2-st{background:linear-gradient(#D6B45E,#B8933A);border-radius:20px;padding:12px;box-shadow:0 4px 0 #8E7230;color:#2A1F05}
.ht2-st .road{display:flex;align-items:flex-start}
.ht2-st .road .s{width:54px;text-align:center;font:800 10.5px var(--fb)}
.ht2-st .road .s i{display:grid;place-items:center;width:38px;height:38px;margin:0 auto 3px;border-radius:50%;background:rgba(255,255,255,.35);font:800 13px var(--fd);font-style:normal}
.ht2-st .road .s.done i{background:rgba(255,255,255,.7)}
.ht2-st .road .s.now i{background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.5)}
.ht2-st .road .ln{flex:1;height:3px;margin-top:18px;background:rgba(255,255,255,.4)}
.ht2-st .nf-row{margin-top:10px;color:#3A2A05}.ht2-st .nf-row b{color:#2A1F05}.ht2-st .nf-row small{color:#4A3A10}
.md.nf-hotel .ht2-st .nf-b.a{background:#1B2A55;box-shadow:0 3px 0 #0F1A38}
`);
NF_FONTS.push('playfair:Playfair Display:700');
const HT2_ORD=['pre','ste','sup','std'], HT2_PL={pre:'Présidentielle',ste:'Suites',sup:'Supérieures',std:'Standard'};
const HT2_KEY='<svg viewBox="0 0 14 18" aria-hidden="true"><circle cx="7" cy="4.5" r="3.4" fill="none" stroke="#E8C46A" stroke-width="1.8"/><path d="M7 8v9M7 13h3M7 16h2.4" stroke="#E8C46A" stroke-width="1.8" fill="none"/></svg>';
const HT2_IC={spa:'<path d="M4 13h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM7 13V6a2 2 0 0 1 4 0M6 21l1-2M18 21l-1-2"/>',resto:'<path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v5M9 3v5M11 3v5M17 3c-2 2-2 6 0 8v10"/>',salles:'<path d="M3 10 12 4l9 6M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18"/>',
  work:'<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6h6v2"/>',ring:'<circle cx="12" cy="14" r="6"/><path d="M9 5l3 3 3-3"/>',bag:'<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M10 7V4h4v3M9 20v1M15 20v1"/>'};
const htIco=(k,c)=>'<svg viewBox="0 0 24 24" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+HT2_IC[k]+'</svg>';
function ht2Row(b,id){ const c=htCalc(b); return c.rows.find(r=>r.t.id===id); }
FX2.hotel={
  chip:b=>{ const c=htCalc(b); return Math.round(c.occ)+' chambres sur '+c.N+' ce soir'; },
  stat:b=>{ const c=htCalc(b); return ['Taux d’occupation',Math.round((c.N?c.occ/c.N:0)*100)+' %']; },
  noPath:true,
  dlg:{txt:'peut fixer les prix et la surréservation à votre place'},
  body(b,X,U){ htFix(b); const m=b.m, c=htCalc(b), R0=metR0(b); let h='';
    /* 1. la façade */
    X.get('px'); const cD=X.get('dyn'), cP=X.get('pres');
    const B=(id,dv,l)=>'<button data-a="met" data-i="'+b.id+'" data-v="px" data-j="'+id+':'+dv+'" aria-label="'+esc(l)+'">'+(dv>0?'+':'−')+'</button>';
    h+=nfSec('La façade','un étage par type de chambre')+'<div class="ht2-fac">'+(cD? nfRowH('Prix dynamiques','le prix suit la demande du jour, chambre par chambre',nfTogH(b,cD)) : '')+'<div class="ht2-roof"></div><div>';
    HT2_ORD.forEach(id=>{ const r=ht2Row(b,id), t=HT_T.find(x=>x.id===id);
      if(!r||!r.N){ if(id!=='pre') return; const right= cP&&!cP.owned? nfBtn(b,cP,'Aménager',{c:'a',dis:!nfCan(b,cP.cost)}) : '<span class="nf-ok" style="background:rgba(255,255,255,.12);color:#C9D3EE">palier 3</span>';
        h+='<div class="ht2-fl lock"><div class="hd"><span><b>Présidentielle</b><small>dernier étage'+(cP&&!cP.owned?' · '+eur(cP.cost,0):'')+'</small></span>'+right+'</div></div>'; return; }
      const o=m.y&&m.y.rows? ((m.y.rows.find(x=>x.id===id)||{}).o||0) : r.occ/r.N, occ=Math.round(o*r.N), W=Math.min(24,Math.max(r.N,1)), lit=Math.round(o*W);
      h+='<div class="ht2-fl"><div class="hd"><span><b>'+HT2_PL[id]+'</b><small>'+occ+' occupée'+(occ>1?'s':'')+' sur '+r.N+' · '+Math.round(m.px[id]*100)+' % du prix de base</small></span><span class="ht2-px">'+B(id,-0.05,'Baisser le prix '+t.n)+'<b>'+eur(r.price*c.k,0)+'</b>'+B(id,0.05,'Monter le prix '+t.n)+'</span></div>'+
        '<div class="ht2-win" aria-hidden="true">'+Array.from({length:W},(_,i)=>'<i class="'+(i<lit?'on':'')+'"></i>').join('')+'</div></div>'; });
    h+='</div><div class="ht2-gr"><b>'+esc(b.name.toUpperCase())+'</b><i></i></div></div>';
    if(cP&&cP.owned) {}
    /* 2. la réception */
    const free=Math.max(0,Math.round(c.N-c.occ)), K=Math.min(40,c.N), kf=Math.round(free/Math.max(1,c.N)*K), cO=X.get('ob'), cPl=X.get('pl');
    const keys=new Set(Array.from({length:K},(_,i)=>[i,Math.abs(Math.sin(i*3.7+S.day*.61))]).sort((a,z)=>z[1]-a[1]).slice(0,kf).map(x=>x[0]));
    const booked=c.rows.reduce((a,r)=>a+Math.min(htDemand(b,r.t)*Math.pow(1/m.px[r.t.id],r.t.e),r.N*(1+m.ob)),0);
    h+=nfSec('La réception','ce soir')+'<div class="ht2-rec"><div class="hd"><b>Tableau des clés</b><small>'+fmtN(free)+(free>1?' chambres libres':' chambre libre')+'</small></div>'+
      '<div class="ht2-keys" aria-hidden="true">'+Array.from({length:K},(_,i)=>'<span class="'+(keys.has(i)?'k':'')+'">'+(keys.has(i)?HT2_KEY:'')+(100*(1+Math.floor(i/10))+1+i%10)+'</span>').join('')+'</div>'+
      '<div class="ht2-cnt"><div><small>Arrivées</small><b>'+fmtN(Math.round(c.occ))+'</b></div><div><small>Désistements</small><b>≈ '+fmtN(Math.round(booked*HT_NS))+'</b></div><div><small>À reloger</small><b>'+fmtN(m.y?m.y.rel:0)+'</b></div></div>'+
      (cO? '<div class="nf-ctl">'+nfRowH('Surréservation','vendre plus de chambres qu’il n’y en a')+nfSegH(b,cO,[[0,'Aucune'],[5,'+5 %'],[10,'+10 %'],[15,'+15 %']])+'<div class="note">Environ 7 % des clients ne viennent pas. Au-delà, les clients en trop sont relogés ailleurs à vos frais.</div></div>' : nfRowH('Surréservation','disponible au palier « Quatre étoiles »'))+
      (cPl? nfRowH('Plateformes de réservation','30 % de clients en plus, 18 % de commission',nfTogH(b,cPl)) : '')+'</div>';
    /* 3. la semaine */
    const cS=X.get('salles'), cM=X.get('mar'), cSe=X.get('sem'), dn=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    h+=nfSec('La semaine','réceptions et séminaires')+'<div class="nf-card"><div class="ht2-wk">'+dn.map((d,i)=>{ const we=i>=5, sem=m.sem&&!we, mar=m.mar&&i===5;
      return '<div class="'+(we?'we':'')+(sem?' on':'')+(mar?' mar':'')+'">'+d+htIco(sem?'work':mar?'ring':'bag',sem?'#1B2A55':mar?'#8E7230':'#8A94B4')+'<small>'+(sem?'séminaire':mar?'mariage':'tourisme')+'</small></div>'; }).join('')+'</div>'+
      '<div class="nf-list" style="margin-top:10px">'+(cS? nfCtlH(b,cS) : '')+(cM? nfCtlH(b,cM) : '')+(cSe? nfCtlH(b,cSe) : '')+(!cS&&!cM&&!cSe? nfRowH('Mariages et séminaires','débloqués au palier « Mariages et séminaires »','<span class="nf-ok" style="background:#F1EBDD;color:var(--ink-3)">Palier 2</span>') : '')+'</div></div>';
    /* 4. les services */
    const svc=[['spa','Spa','prix +6 %'],['resto','Restaurant','dîners sur place']];
    h+=nfSec('Les services')+'<div class="ht2-svc">'+svc.map(([k,n,s])=>{ const cc=X.get(k), on=!!m[k];
      return '<div><i class="'+(on?'':'off')+'">'+htIco(k,on?'#16804D':'#8A94B4')+'</i><b>'+n+'</b>'+(on? '<small>ouvert · '+s+'</small>' : cc? nfBtn(b,cc,eur(cc.cost,0),{c:'a',dis:!nfCan(b,cc.cost)}) : '')+'</div>'; }).join('')+
      '<div><i class="'+(m.salles?'':'off')+'">'+htIco('salles',m.salles?'#16804D':'#8A94B4')+'</i><b>Salons</b><small class="'+(m.salles?'':'off')+'">'+(m.salles? (m.sem||m.mar? 'en service' : 'à programmer') : mxHas(b,2)? 'à construire' : 'palier 2')+'</small></div></div>';
    /* 5. les étoiles */
    const r=mxRank(b), rk=['3★','4★','5★','Palace','Resorts'], at=m.pal?3:m.st===5?2:m.st===4?1:0;
    const cSt=X.get('star'), cPa=X.get('pal'), cR=X.get('rs');
    h+=nfSec('Les étoiles','avis clients '+m.av.toFixed(1).replace('.',NDEC)+' / 5')+'<div class="ht2-st"><div class="road">'+rk.map((k,i)=>(i?'<span class="ln"></span>':'')+'<div class="s'+(i<at?' done':i===at?' now':'')+'"><i>'+(i===3?'P':i===4?'R':k)+'</i>'+(i<3?(i+3)+' étoiles':k)+'</div>').join('')+'</div>'+
      (cSt? nfCtlH(b,cSt) : '')+(cPa? nfCtlH(b,cPa) : '')+(cR? nfCtlH(b,cR) : '')+
      (!cSt&&!cPa&&!cR? nfRowH('Palier '+r+' sur 5',esc(r<5? 'Prochain : '+MET.hotel.ranks[r].n.toLowerCase()+'. '+MET.hotel.ranks[r].d : 'Tous les paliers sont atteints.')) : '')+'</div>';
    return h; }
};

