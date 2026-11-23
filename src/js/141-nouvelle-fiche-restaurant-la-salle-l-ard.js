/* ============================================================
   NOUVELLE FICHE · RESTAURANT : la salle, l'ardoise, la cuisine, la cave, le guide
   ============================================================ */
NF_CSS.push(`
.md.nf-resto{--nf-bg:#FFF8EC;--nf-bg2:#EAD9C0;--nf-acc:#7A4A2B;--nf-acc2:#5A341D;--nf-h:#8A6A4E;--nf-hf:800 13px var(--fb);--nf-sh:#EAD9C0}
.md.nf-resto .nf-sec{letter-spacing:.08em;text-transform:uppercase}
.md.nf-resto .nf-ov{background:linear-gradient(transparent,rgba(30,18,10,.85))}
.rs2-salle{background:linear-gradient(#A8754C,#8E5D39);border-radius:22px;padding:12px;box-shadow:0 4px 0 #6B4024;color:#fff}
.rs2-salle .hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rs2-salle .hd b{font:800 18px var(--fd)}
.rs2-salle .nf-seg{background:rgba(0,0,0,.18);margin:0;flex:0 0 auto}
.rs2-salle .nf-seg button{color:#F6E6D3;padding:0 10px}
.rs2-salle .nf-seg button.on{background:#fff;color:#7A4A2B}
.rs2-floor{position:relative;margin-top:10px;background:repeating-linear-gradient(90deg,#B98258 0 22px,#B07A50 22px 44px);border-radius:16px;height:178px;overflow:hidden;box-shadow:inset 0 2px 8px rgba(0,0,0,.25)}
.rs2-floor .tb{position:absolute;width:38px;height:38px;border-radius:50%;background:#FFF8EC;box-shadow:0 2px 0 rgba(0,0,0,.25);display:grid;place-items:center;font:800 11px var(--fb);color:#7A4A2B}
.rs2-floor .tb.sq{border-radius:9px;width:52px}
.rs2-floor .tb.busy{background:#FFE7B8}
.rs2-floor .tb.busy::after{content:'';position:absolute;inset:-6px;border-radius:inherit;border:3px dotted rgba(255,255,255,.75)}
.rs2-floor .pass{position:absolute;right:0;top:0;bottom:0;width:58px;background:#3A2A20;color:#F6E6D3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font:800 10px var(--fb);text-transform:uppercase;letter-spacing:.06em}
.rs2-floor .pass svg{width:24px;height:24px}
.rs2-counts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.rs2-counts div{background:rgba(0,0,0,.18);border-radius:12px;padding:7px 9px}
.rs2-counts small{display:block;font:700 11px var(--fb);color:#F2DCC4}
.rs2-counts b{font:800 18px var(--fd)}
.rs2-salle .nf-row{margin-top:10px;color:#EAD2B8}
.rs2-salle .nf-row b{color:#fff}.rs2-salle .nf-row small{color:#EAD2B8}
.rs2-salle .nf-tog{background:rgba(0,0,0,.25)}.rs2-salle .nf-tog.on{background:#2BB673}
.rs2-ard{background:#24352E;border-radius:20px;padding:14px 14px 12px;border:8px solid #9C643C;box-shadow:0 4px 0 #6B4024,inset 0 0 40px rgba(0,0,0,.35);color:#F3F1E7}
.rs2-ard h3{margin:0;text-align:center;font:700 30px/1.05 'Caveat',cursive}
.rs2-ard .menu{text-align:center;font:700 21px 'Caveat',cursive;color:#C9D2C3;margin-top:2px}
.rs2-ard .crs{font:700 24px/1 'Caveat',cursive;color:#F6D978;margin:14px 0 4px;display:flex;justify-content:space-between;align-items:center}
.rs2-ard .crs span{font:700 13px var(--fb);color:#C9D2C3}
.rs2-ard .dl{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px dashed rgba(243,241,231,.18)}
.rs2-ard .dl.out{opacity:.5}
.rs2-ard .dl .n{flex:1;min-width:0;font:700 21px/1.1 'Caveat',cursive}
.rs2-ard .dl .n small{display:block;font:600 11.5px var(--fb);color:#C9D2C3;margin-top:2px}
.rs2-ard .mk{font:800 11px var(--fb);padding:3px 8px;border-radius:999px;white-space:nowrap}
.rs2-ard .mk.ok{background:rgba(43,182,115,.25);color:#9FF0C6}
.rs2-ard .mk.hard{background:rgba(255,107,91,.25);color:#FFB3A8}
.rs2-ard .mk.spec{background:rgba(246,217,120,.2);color:#F6D978}
.rs2-ard .x{box-shadow:none;padding:0;width:44px;height:44px;border:0;border-radius:12px;background:rgba(255,255,255,.08);color:#F3F1E7;font:800 18px var(--fb);flex:0 0 auto}
.rs2-ard .free{display:flex;align-items:center;justify-content:center;min-height:44px;margin-top:6px;border:2px dashed rgba(243,241,231,.3);border-radius:12px;font:700 19px 'Caveat',cursive;color:#C9D2C3;background:none;width:100%}
.rs2-ard .free.on{border-style:solid}
.rs2-ard .nf-pick button.spec{box-shadow:inset 0 0 0 1.5px rgba(246,217,120,.5)}
.rs2-price{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:14px}
.rs2-price button{box-shadow:none;width:44px;height:44px;border-radius:50%;border:2px solid rgba(243,241,231,.4);background:none;color:#F3F1E7;font:800 15px var(--fb);padding:0}
.rs2-price b{font:700 40px/1 'Caveat',cursive;min-width:96px;text-align:center}
.rs2-ard .foot{text-align:center;font-size:12px;color:#C9D2C3;margin-top:4px}
.rs2-cui{display:flex;gap:12px;align-items:center}
.rs2-cui .toque{width:64px;height:64px;border-radius:20px;background:#FBF1E2;display:grid;place-items:center;flex:0 0 auto}
.rs2-cui .t{flex:1;min-width:0}
.rs2-cui b{font:800 16px var(--fb)}
.rs2-cui .s{font-size:12.5px;color:var(--ink-3)}
.rs2-lv{display:flex;gap:4px;margin-top:6px}
.rs2-lv i{flex:1;height:8px;border-radius:4px;background:#EDE3D3}.rs2-lv i.f{background:#C99A2E}
.rs2-cands{margin-top:10px}
.rs2-cb{display:flex;gap:8px;margin-top:10px}.md.nf-resto .rs2-cb .nf-b{flex:1;min-width:0;padding:0 8px;white-space:normal;line-height:1.15}
.rs2-tr{margin-top:8px;font:800 12.5px var(--fb);color:#7A4A2B}.rs2-tr i{display:block;height:6px;border-radius:3px;background:#EDE3D3;margin:5px 0 3px;overflow:hidden}.rs2-tr em{display:block;height:100%;background:#C99A2E}.rs2-tr small{display:block;font:600 11.5px var(--fb);color:var(--ink-3)}
.rs2-cave{background:linear-gradient(#4A2A2F,#351C21);border-radius:20px;padding:14px;box-shadow:0 4px 0 #24110F;color:#F7E8EA}
.rs2-cave .nf-row{color:#D8B9BF}.rs2-cave .nf-row b{color:#F7E8EA}.rs2-cave .nf-row small{color:#D8B9BF}
.rs2-cave .nf-row+.nf-row{margin-top:8px}
.rs2-rack{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin:10px 0 10px}
.rs2-rack i{aspect-ratio:1;border-radius:50%;background:#2A1417;box-shadow:inset 0 2px 3px rgba(0,0,0,.6)}
.rs2-rack i.f{background:radial-gradient(circle at 35% 35%,#B0405A,#6E1529)}
.rs2-rack i.g{background:radial-gradient(circle at 35% 35%,#E8C46A,#8C6512)}
.md.nf-resto .rs2-cave .nf-b.a{background:#7D1F35;box-shadow:0 3px 0 #561424}
.md.nf-resto .rs2-cave .nf-tog{background:rgba(0,0,0,.35)}.md.nf-resto .rs2-cave .nf-tog.on{background:#2BB673}
.rs2-road{display:flex;align-items:flex-start;margin:4px 0 6px}
.rs2-road .st{display:flex;flex-direction:column;align-items:center;gap:3px;width:50px;font:800 10.5px/1.15 var(--fb);color:var(--ink-3);text-align:center}
.rs2-road .st i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:14px;background:#F1E9DC;color:#B9A58A}
.rs2-road .st.done i{background:#C99A2E;color:#fff;opacity:.7}
.rs2-road .st.now i{background:#C99A2E;color:#fff;box-shadow:0 0 0 4px #F6E3B5}
.rs2-road .ln{flex:1;height:4px;background:#F1E9DC;border-radius:2px;margin-top:16px}
.rs2-road .ln.on{background:#C99A2E}
.rs2-meter{position:relative;height:12px;border-radius:6px;background:#F1E9DC;margin-top:10px}
.rs2-meter i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:#C99A2E}
.rs2-meter em{position:absolute;top:-4px;bottom:-4px;width:3px;background:#7D1F35;border-radius:2px}
.rs2-gl{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;color:var(--ink-3);margin-top:5px}
.rs2-guide .nf-row{padding-top:10px;margin-top:10px;border-top:1px solid #F1E9DC}
.rs2-guide .rk{font-size:12px;color:var(--ink-3);margin-top:8px}
`);
const RS2_TABLES=[[10,14,2],[56,14,2],[102,14,4,1],[164,14,2],[214,14,2],[10,70,4,1],[70,70,2],[118,70,6,1],[178,70,2],[224,70,2],[10,126,2],[56,126,4,1],[118,126,2],[164,126,4,1],[224,126,2]];
const RS2_MENU={pri:'Menu de printemps',ete:'Menu d’été',aut:'Menu d’automne',hiv:'Menu d’hiver'};
const RS2_ADD={e:'+ ajouter une entrée',p:'+ ajouter un plat',d:'+ ajouter un dessert'};
function rs2Cov(b){ try{ const k=metKpis(b)[0]; const n=parseInt(String(k[1]).replace(/[^\d]/g,''),10); return isNaN(n)?0:n; }catch(e){ return 0; } }
FX2.resto={
  vars:'',
  chip:b=>{ const m=b.m; return m.stars? m.stars+' étoile'+(m.stars>1?'s':'')+' au guide' : m.srv? 'Service midi et soir' : 'Service du soir'; },
  noPath:true,
  mgmt:{},
  dlg:{role:'directeur du site', txt:'peut gérer la salle, la carte et la cave à votre place'},
  body(b,X,U){ rsFix(b); const m=b.m, p=rsCalc(b), mo=MET.resto.mods(b), se=rsSeason(), cov=rs2Cov(b), R0=metR0(b);
    let h='';
    /* 1. la salle */
    const srvF=[.62,1][m.srv], occ=clamp(mo.vol/(1.8*p.capF*srvF),0,1), nb=Math.round(occ*RS2_TABLES.length);
    const busy=new Set(RS2_TABLES.map((t,i)=>[i,Math.abs(Math.sin(i*7.13+S.day*.37))]).sort((a,c)=>c[1]-a[1]).slice(0,nb).map(x=>x[0]));
    const cS=X.get('srv'), cR=X.get('resa'), tk=m.pm+p.ws, mid=m.srv? Math.round(cov*.38) : 0;
    h+=nfSec('La salle',cov? fmtN(cov)+' couverts hier' : 'pas encore de service')+'<div class="rs2-salle"><div class="hd"><b>'+(m.srv?'Aujourd’hui':'Ce soir')+'</b>'+(cS? nfSegH(b,cS,[[0,'Soir seul'],[1,'Midi et soir']]) : '')+'</div>'+
      '<div class="rs2-floor" role="img" aria-label="Salle remplie à '+Math.round(occ*100)+' %">'+RS2_TABLES.map((t,i)=>'<span class="tb'+(t[3]?' sq':'')+(busy.has(i)?' busy':'')+'" style="left:calc((100% - 120px)*'+(t[0]/224).toFixed(3)+' + 8px);top:'+t[1]+'px">'+t[2]+'</span>').join('')+
      '<span class="pass"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h14M7 17a5 5 0 0 1 10 0M12 9V7M4 20h16"/></svg>Passe</span></div>'+
      '<div class="rs2-counts"><div><small>Midi</small><b>'+(m.srv? fmtN(mid) : '—')+'</b></div><div><small>Soir</small><b>'+fmtN(cov-mid)+'</b></div><div><small>Addition moy.</small><b>'+eur(tk,0)+'</b></div></div>'+
      (cR? nfRowH(esc(cR.label),'moins de pertes, les critiques apprécient, 4 % de clients en moins',nfTogH(b,cR)) : '')+'</div>';
    /* 2. l'ardoise */
    X.get('pm');
    h+=nfSec('L’ardoise','matières '+eur(p.cost,0)+' / couvert')+'<div class="rs2-ard"><h3>'+esc(b.name)+'</h3><div class="menu">— '+RS2_MENU[se]+' —</div>';
    Object.keys(RS_COURSE).forEach(k=>{ const L=m.carte[k];
      h+='<div class="crs">'+RS_COURSE[k]+' <span>'+L.length+' / '+RS_MAX[k]+'</span></div>';
      h+=L.map(id=>{ const x=rsDish(id), q=rsQ(b,x), out=m.out[id]>S.day, off=x.s&&x.s!==se;
        const mk= out? '<span class="mk hard">introuvable</span>' : q<.9? '<span class="mk hard">trop dur</span>' : m.chef.g===x.g? '<span class="mk spec">spécialité</span>' : off? '<span class="mk hard">hors saison</span>' : '<span class="mk ok">maîtrisé</span>';
        return '<div class="dl'+(out?' out':'')+'"><div class="n">'+esc(x.n)+'<small>populaire '+nfDots(x.p/2)+' · '+eur(rsCost(b,x),0)+' · '+x.t+' min'+(x.s?' · '+RS_SEAS[x.s].toLowerCase():'')+'</small></div>'+mk+
          '<button class="x" data-a="met" data-i="'+b.id+'" data-v="rm" data-j="'+k+':'+id+'" aria-label="Retirer '+esc(x.n)+'">×</button></div>'; }).join('');
      if(!L.length) h+='<div class="foot" style="text-align:left;color:#FFB3A8">Aucun plat : les clients sont déçus.</div>';
      if(L.length<RS_MAX[k]){ const on=U.add===k;
        h+='<button class="free'+(on?' on':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="add" data-j="'+k+'">'+(on?'fermer la liste':RS2_ADD[k])+'</button>';
        if(on) h+='<div class="nf-pick">'+RS_DISH.filter(x=>x.k===k&&!L.includes(x.id)).map(x=>{ const q=rsQ(b,x);
          return '<button class="'+(m.chef.g===x.g?'spec':'')+'" data-a="met" data-i="'+b.id+'" data-v="add" data-j="'+k+':'+x.id+'">'+esc(x.n)+'<small>populaire '+x.p+'/10 · '+eur(rsCost(b,x),0)+' · '+x.t+' min'+(x.s?' · '+RS_SEAS[x.s].toLowerCase()+(x.s!==se?' (hors saison)':''):'')+(q<.9?' · trop dur pour le chef':m.chef.g===x.g?' · spécialité du chef':'')+'</small></button>'; }).join('')+'</div>'; }
    });
    const pb=(v,l)=>'<button data-a="met" data-i="'+b.id+'" data-v="pm" data-j="'+v+'" aria-label="'+l+'">'+(v>0?'+':'−')+Math.abs(v)+'</button>';
    h+='<div class="rs2-price">'+pb(-5,'Baisser de 5 €')+pb(-1,'Baisser de 1 €')+'<b>'+eur(m.pm,0)+'</b>'+pb(1,'Monter de 1 €')+pb(5,'Monter de 5 €')+'</div>'+
      '<div class="foot">prix du menu · la carte vaut environ '+eur(p.V,0)+' aux yeux des clients</div></div>';
    /* 3. en cuisine */
    const c=m.chef, all=[].concat(m.carte.e,m.carte.p,m.carte.d).map(rsDish).filter(Boolean), ok=all.filter(x=>rsQ(b,x)>=.9).length;
    h+=nfSec('En cuisine')+'<div class="nf-card"><div class="rs2-cui"><div class="toque"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d="M10 22c-5 0-7-7-2-9 0-6 8-8 11-4 3-4 11-2 11 4 5 2 3 9-2 9v8H10z" fill="#fff" stroke="#C9B08C" stroke-width="2"/><rect x="10" y="28" width="20" height="5" rx="2" fill="#EAD9C0"/></svg></div>'+
      '<div class="t"><b>'+esc(c.n)+'</b><div class="s"><span>Chef</span> · <span>'+RS_SPEC[c.g].toLowerCase()+'</span> · <span>maîtrise '+ok+' plat'+(ok>1?'s':'')+' sur '+all.length+'</span>'+(RS_CHEF_SAL[c.lvl]? ' · <span>'+eur(R0*RS_CHEF_SAL[c.lvl],0)+' / j en plus</span>' : '')+'</div>'+
      '<div class="rs2-lv" aria-label="Niveau '+c.lvl+' sur 5">'+[1,2,3,4,5].map(i=>'<i class="'+(i<=c.lvl?'f':'')+'"></i>').join('')+'</div></div></div>'+
      (c.tr? '<div class="rs2-tr"><span>En formation : niveau '+(c.lvl+1)+' dans '+plu(Math.max(1,c.tr-S.day),'jour')+'</span><i><em style="width:'+Math.round(clamp(1-(c.tr-S.day)/RS_TRAIN_D,0,1)*100)+'%"></em></i><small>La cuisine est un peu moins sûre pendant la formation.</small></div>' : '')+
      '<div class="rs2-cb"><button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="train"'+(c.lvl>=5||c.tr||!nfCan(b,rsTrainCost(b))?' disabled':'')+(c.lvl>=5?' data-why="Le chef est déjà au niveau maximum."':c.tr?' data-why="Une formation est déjà en cours."':'')+'>'+(c.lvl>=5? 'Niveau maximum' : 'Former le chef · '+eur(rsTrainCost(b),0))+'</button>'+
      '<button class="btn nf-b" data-a="nfui" data-i="'+b.id+'" data-v="chef">'+(U.chef?'Fermer':'Voir d’autres chefs')+'</button></div>'+
      (c.lvl<5&&!(c.tr)? '<div class="rs2-tr"><small>Niveau '+(c.lvl+1)+' en '+RS_TRAIN_D+' jours, sans changer de spécialité. Recruter un chef de ce niveau coûterait '+eur(metR0(b)*RS_CHEF_FEE[Math.min(5,c.lvl+1)],0)+'.</small></div>' : '');
    if(U.chef){ const cs=rsCands(b); h+='<div class="nf-list rs2-cands">'+cs.map((x,i)=>{ const fee=rsChefFee(b,x);
      return nfRowH(esc(x.n),'Niveau '+x.lvl+' · '+RS_SPEC[x.g].toLowerCase()+' · '+eur(R0*RS_CHEF_SAL[x.lvl],0)+' / jour','<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="chef" data-j="'+i+'"'+(nfCan(b,fee)?'':' disabled')+'>'+(fee? eur(fee,0) : 'Recruter')+'</button>'); }).join('')+'</div>'; }
    h+='</div>';
    /* 4. la cave */
    const cC=X.get('cave'), cA=X.get('acc'), cG=X.get('gc'), cGs=X.get('gcsell'), fill=Math.min(20,Math.ceil(m.cave/1.5)), ng=Math.min(20-fill,m.gc.length);
    h+=nfSec('La cave')+'<div class="rs2-cave"><div class="nf-row"><span><b style="font:800 17px var(--fd)">Vins de la maison</b></span><small>stock : '+plu(m.cave,'jour')+'</small></div>'+
      '<div class="rs2-rack" aria-hidden="true">'+Array.from({length:20},(_,i)=>'<i class="'+(i<fill?'f':i<fill+ng?'g':'')+'"></i>').join('')+'</div>'+
      (cC? nfRowH('Remplir la cave','30 jours de service · les accords rapportent 12 € de plus par couvert',nfBtn(b,cC,eur(cC.cost,0),{c:'a',dis:!nfCan(b,cC.cost)})) : '')+
      (cA? nfRowH('Accords mets-vins',m.cave>0?'proposés à chaque table':'remplissez d’abord la cave',nfTogH(b,cA)) : '')+
      (cG? nfRowH('Grands crus',esc(cG.sub),nfBtn(b,cG,eur(cG.cost,0),{c:'a',dis:!nfCan(b,cG.cost)})) : '')+
      (cGs? nfRowH('Vendre aux collectionneurs',esc(cGs.sub),nfBtn(b,cGs,eur(cGs.gain,0))) : '')+'</div>';
    /* 5. le guide */
    const r=mxRank(b), rk=MET.resto.ranks, need=m.stars<3? RS_STAR[m.stars+1] : null, g=Math.max(0,m.guide-S.day);
    const ico=['★','★★','★★★','B','TV'], road='<div class="st done"><i>✎</i>Critiques</div>'+rk.map((k,i)=>'<span class="ln'+(i<r?' on':'')+'"></span><div class="st'+(i<r?' done':i===r?' now':'')+'"><i>'+ico[i]+'</i>'+(i<3?(i+1)+(i?' étoiles':' étoile'):i===3?'Bistrots':'Télé')+'</div>').join('');
    h+=nfSec('Le guide','passage dans '+plu(g,'jour'))+'<div class="nf-card rs2-guide"><div class="rs2-road">'+road+'</div>'+
      '<div class="rs2-meter"><i style="width:'+Math.round(m.crit)+'%"></i>'+(need?'<em style="left:'+need+'%"></em>':'')+'</div>'+
      '<div class="rs2-gl"><span>Note des critiques : <b style="color:var(--ink)">'+note5(m.crit)+'</b></span><span>'+(need? (m.stars?'étoile suivante':'1re étoile')+' à '+note5(need) : 'trois étoiles')+'</span></div>'+
      (MET.resto.rankSub(b)? '<div class="rk">'+esc(MET.resto.rankSub(b))+'</div>' : '')+
      ['deg','tab','bis','tv'].map(a=>X.has(a)? nfCtlH(b,X.get(a)) : '').join('')+'</div>';
    return h; }
};

