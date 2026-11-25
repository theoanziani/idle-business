/* ============================================================
   V2.8.1 : USINES (1/3) · DONNÉES ET DESSINS
   Les usines ne sont plus des sociétés : ce sont des sites (onglet Usines) avec des lignes de production.
   Chaque ligne est une grille de 8 × 10 cases où le joueur place machines, convoyeurs, stocks tampons,
   contrôle qualité et atelier de maintenance. 9 types : textile, électronique, ferme, agroalimentaire,
   mobilier, aciérie, automobile, chantier naval, aéronautique. L'usine de smartphones disparaît.
   ============================================================ */
/* ---------- suppression définitive de l'usine de smartphones ---------- */
delete D.biz.phones; if(D.GOODS) delete D.GOODS.tel; if(D.FACT) delete D.FACT.phones; if(D.FACTIN) delete D.FACTIN.phones;
if(D.biz.repair) D.biz.repair.syn={with:'electronics', b:.08, txt:'pièces moins chères grâce à votre usine électronique'};
/* les usines quittent la liste des sociétés : elles se créent dans l'onglet Usines */
const FAB_OLD=['farm','textile','electronics','phones'];
D.bizOrder=D.bizOrder.filter(d=>!FAB_OLD.includes(d));

/* ---------- familles du marché de gros ---------- */
Object.assign(D.GOODS,{
  aci:{n:'Acier', u:'tonnes', v:700, vol:.014}, agro:{n:'Agroalimentaire', u:'caisses', v:30, vol:.01},
  meu:{n:'Mobilier', u:'pièces', v:350, vol:.01}, auto:{n:'Automobiles', u:'véhicules', v:25000, vol:.008},
  naval:{n:'Navires', u:'navires', v:12e6, vol:.006}, aero:{n:'Avions', u:'avions', v:28e6, vol:.006}});
/* matières achetées au marché uniquement */
const FAB_RAW={fib:{n:'Fibres textiles', u:'kg', v:6, g:'vet'}, sil:{n:'Silicium', u:'kg', v:15, g:'comp'},
  min:{n:'Minerai de fer', u:'tonnes', v:110, g:'aci'}, bois:{n:'Bois d’œuvre', u:'m³', v:90, g:'meu'}};

/* ---------- types d'usines ---------- */
const FAB_T={
  farm:{n:'Ferme', tier:1, vRef:25, area:1500, col:'#5B8C2A', d:'Parcelles de cultures et d’élevage, puis lignes de transformation'},
  textile:{n:'Usine textile', tier:1, vRef:30, area:1500, col:'#6B4FB0', d:'Tissus de coton, laine et soie, vêtements'},
  agro:{n:'Usine agroalimentaire', tier:1, vRef:30, area:1500, col:'#C4661F', d:'Plats cuisinés et boissons pour vos restaurants'},
  meuble:{n:'Usine de mobilier', tier:2, vRef:350, area:1500, col:'#8A5A2B', d:'Meubles d’hôtel et mobilier de bureau'},
  electronics:{n:'Usine électronique', tier:2, vRef:45, area:1500, col:'#0B6E8A', d:'Puces, écrans, batteries, pièces automobiles'},
  acier:{n:'Aciérie', tier:3, vRef:700, area:6000, col:'#B0412A', d:'Acier brut et tôles pour vos autres usines'},
  auto:{n:'Usine automobile', tier:3, vRef:25000, area:5000, col:'#C8352A', d:'Citadines, berlines, SUV et utilitaires'},
  naval:{n:'Chantier naval', tier:4, vRef:12e6, area:12000, col:'#1B5E8A', d:'Yachts, ferries et porte-conteneurs'},
  aero:{n:'Usine aéronautique', tier:5, vRef:28e6, area:15000, col:'#3B4F7A', d:'Avions régionaux, moyen et long-courriers'}
};
const FAB_ORDER=['farm','acier','textile','electronics','agro','meuble','auto','naval','aero'];

/* ---------- produits : valeur, matières par unité, étapes (machines), cadence relative ---------- */
const kit=(o,f)=>{ const r={}; Object.keys(o).forEach(k=>r[k]=o[k]*f); return r; };
const AUTO_K={tol:.9, pau:80, puc:25, bat:40, ecr:3, cot:6}, AERO_K={tol:2600, puc:6e4, ecr:12000, bat:2e4, pau:6e4, meu:300};
D.PRODS={
  /* ferme : récoltes (parcelles) */
  cer:{fac:'farm', g:'alim', n:'Céréales', u:'quintaux', v:20, raw:1},
  leg:{fac:'farm', g:'alim', n:'Légumes et fruits', u:'caisses', v:10, raw:1},
  lai:{fac:'farm', g:'alim', n:'Lait', u:'caisses', v:14, raw:1},
  oeu:{fac:'farm', g:'alim', n:'Œufs et volaille', u:'caisses', v:16, raw:1},
  rai:{fac:'farm', g:'alim', n:'Raisin', u:'caisses', v:12, raw:1},
  /* ferme : lignes de transformation */
  far:{fac:'farm', g:'alim', n:'Farine', u:'sacs', v:24, in:{cer:.35}, st:['net','mou','ens'], k:1},
  fro:{fac:'farm', g:'alim', n:'Fromages', u:'caisses', v:32, in:{lai:1.1}, st:['past','cav'], k:.8},
  vin:{fac:'farm', g:'alim', n:'Vin', u:'caisses', v:36, in:{rai:1.2}, st:['pres','cuv','emb'], k:1},
  /* textile */
  cot:{fac:'textile', g:'vet', n:'Tissu de coton', u:'rouleaux', v:36, in:{fib:2}, st:['carde','fil','tis','tei'], k:1},
  lan:{fac:'textile', g:'vet', n:'Tissu de laine', u:'rouleaux', v:55, in:{fib:3.6}, st:['carde','fil','tis','tei'], k:.7},
  soi:{fac:'textile', g:'vet', n:'Soie', u:'rouleaux', v:110, in:{fib:7}, st:['carde','fil','tis','tei'], k:.4},
  pap:{fac:'textile', g:'vet', n:'Vêtements', u:'pièces', v:25, in:{cot:.33}, st:['coupe','conf'], k:1},
  /* électronique */
  puc:{fac:'electronics', g:'comp', n:'Puces', u:'lots', v:54, in:{sil:1.6}, st:['lith','grav','test'], k:1},
  ecr:{fac:'electronics', g:'comp', n:'Écrans', u:'lots', v:52, in:{sil:1.2}, st:['dep','lamv','test'], k:1},
  bat:{fac:'electronics', g:'comp', n:'Batteries', u:'lots', v:36, in:{sil:.3, min:.06}, st:['elec','cell','test'], k:1.1},
  pau:{fac:'electronics', g:'comp', n:'Pièces automobiles', u:'lots', v:42, in:{aci:.02, sil:.1}, st:['usin','asmp','test'], k:1},
  /* aciérie */
  aci:{fac:'acier', g:'aci', n:'Acier brut', u:'tonnes', v:650, in:{min:2.4}, st:['hf','cvt','cc'], k:1},
  tol:{fac:'acier', g:'aci', n:'Tôle laminée', u:'tonnes', v:1250, in:{aci:1.05}, st:['four','lam','bob'], k:.9},
  /* agroalimentaire */
  pla:{fac:'agro', g:'agro', n:'Plats cuisinés', u:'caisses', v:42, in:{leg:1.2, cer:.1, lai:.2}, st:['lav','cui','cond'], k:1},
  bsn:{fac:'agro', g:'agro', n:'Boissons', u:'caisses', v:24, in:{leg:.8}, st:['jus','pst','cond'], k:1.4},
  /* mobilier */
  meu:{fac:'meuble', g:'meu', n:'Meubles d’hôtel', u:'pièces', v:560, in:{bois:1.2, cot:2}, st:['sci','cnc','tap','ver','mon'], k:.9},
  mbu:{fac:'meuble', g:'meu', n:'Mobilier de bureau', u:'pièces', v:340, in:{bois:1, tol:.012}, st:['sci','cnc','ver','mon'], k:1.2},
  /* automobile */
  voi:{fac:'auto', g:'auto', n:'Citadines', u:'citadines', v:22000, in:kit(AUTO_K,1), st:['pre','sou','pei','ass'], k:1.3},
  ber:{fac:'auto', g:'auto', n:'Berlines', u:'berlines', v:32000, in:kit(AUTO_K,1.75), st:['pre','sou','pei','ass'], k:1},
  suv:{fac:'auto', g:'auto', n:'SUV', u:'SUV', v:41000, in:kit(AUTO_K,2.25), st:['pre','sou','pei','ass'], k:.8},
  utl:{fac:'auto', g:'auto', n:'Utilitaires', u:'utilitaires', v:31000, in:kit(AUTO_K,1.45), st:['pre','sou','pei','ass'], k:.9},
  /* chantier naval */
  yac:{fac:'naval', g:'naval', n:'Yachts', u:'yachts', v:12e6, in:{tol:1400, meu:2500, puc:12000, ecr:4000, cot:15000}, st:['dec','blo','cal','arm'], k:1},
  fer:{fac:'naval', g:'naval', n:'Ferries', u:'ferries', v:7e7, in:{tol:9000, meu:22000, puc:50000, ecr:16000, cot:60000, pau:60000}, st:['dec','blo','cal','arm'], k:.22},
  pcn:{fac:'naval', g:'naval', n:'Porte-conteneurs', u:'porte-conteneurs', v:8.5e7, in:{tol:17000, pau:120000, puc:20000}, st:['dec','blo','cal','arm'], k:.16},
  /* aéronautique */
  a1:{fac:'aero', g:'aero', n:'Avions régionaux', u:'avions', v:3.4e7, in:kit(AERO_K,1), st:['fus','ail','fin','cab','ess'], k:1},
  a2:{fac:'aero', g:'aero', n:'Moyen-courriers', u:'avions', v:9.5e7, in:kit(AERO_K,3.4), st:['fus','ail','fin','cab','ess'], k:.45},
  a3:{fac:'aero', g:'aero', n:'Long-courriers', u:'avions', v:2.3e8, in:kit(AERO_K,8.2), st:['fus','ail','fin','cab','ess'], k:.2}
};
/* compatibilité : anciens modules (FACT_P) */
if(typeof FACT_P!=='undefined'){ Object.keys(FACT_P).forEach(k=>delete FACT_P[k]); Object.keys(D.PRODS).forEach(p=>{ const f=D.PRODS[p].fac; (FACT_P[f]=FACT_P[f]||[]).push(p); }); }
const fabProdsOf = t => Object.keys(D.PRODS).filter(p=>D.PRODS[p].fac===t&&!D.PRODS[p].raw);

/* ---------- cultures de la ferme : production par parcelle et par jour ---------- */
const FAB_CROP={ble:{n:'Blé', p:'cer', y:42}, mais:{n:'Maïs', p:'cer', y:48}, leg:{n:'Maraîchage', p:'leg', y:110}, verger:{n:'Verger', p:'leg', y:95},
  vigne:{n:'Vigne', p:'rai', y:85}, vaches:{n:'Vaches laitières', p:'lai', y:90}, poules:{n:'Poules pondeuses', p:'oeu', y:80}};
const FAB_PARCEL=90000;

/* ---------- machines : nom, taille (cases), cadence de base par jour (produit de référence), type ---------- */
const FAB_M={
  in:{n:'Quai d’arrivée', w:2, h:1, aux:1, d:'Entrée des matières : le convoyeur part d’ici.'},
  out:{n:'Quai d’expédition', w:2, h:1, aux:1, d:'Sortie des produits finis : le convoyeur doit y arriver.'},
  cv:{n:'Convoyeur', w:1, h:1, aux:1, d:'Relie les quais et les machines. Les machines travaillent sur le convoyeur qui les longe.'},
  buf:{n:'Stock tampon', w:1, h:2, aux:1, d:'Évite les arrêts de la ligne : +6 % de cadence chacun, jusqu’à 2.'},
  qc:{n:'Contrôle qualité', w:2, h:1, aux:1, d:'Placé après la dernière étape : produits vendus 8 % plus cher.'},
  mnt:{n:'Atelier de maintenance', w:2, h:2, aux:1, d:'Raccordé à la ligne : pannes trois fois moins fréquentes.'},
  /* ferme */
  net:{n:'Trieur-nettoyeur', w:2, h:1, c:1400}, mou:{n:'Moulin à cylindres', w:2, h:2, c:1100}, ens:{n:'Ensacheuse', w:2, h:1, c:1600},
  past:{n:'Pasteurisateur', w:2, h:1, c:1200}, cav:{n:'Cave d’affinage', w:2, h:2, c:800},
  pres:{n:'Pressoir', w:2, h:2, c:900}, cuv:{n:'Cuverie inox', w:3, h:2, c:700}, emb:{n:'Embouteilleuse', w:2, h:1, c:1300},
  /* textile */
  carde:{n:'Cardeuse', w:1, h:2, c:900}, fil:{n:'Continu à filer', w:2, h:1, c:700}, tis:{n:'Métier à tisser', w:2, h:2, c:520},
  tei:{n:'Teinturerie', w:2, h:1, c:800}, coupe:{n:'Table de coupe', w:2, h:1, c:2600}, conf:{n:'Atelier de confection', w:2, h:2, c:1700},
  /* électronique */
  lith:{n:'Lithographie', w:2, h:2, c:320}, grav:{n:'Gravure plasma', w:2, h:1, c:380}, dep:{n:'Dépôt de couches', w:2, h:1, c:420},
  lamv:{n:'Laminage de verre', w:2, h:1, c:380}, elec:{n:'Ligne d’électrodes', w:2, h:1, c:500}, cell:{n:'Assemblage de cellules', w:2, h:1, c:420},
  usin:{n:'Centre d’usinage', w:2, h:1, c:450}, asmp:{n:'Montage de pièces', w:2, h:1, c:480}, test:{n:'Banc de test', w:1, h:1, c:600},
  /* aciérie */
  hf:{n:'Haut fourneau', w:2, h:3, c:950}, cvt:{n:'Convertisseur', w:2, h:2, c:1000}, cc:{n:'Coulée continue', w:3, h:1, c:1150},
  four:{n:'Four de réchauffage', w:2, h:2, c:1000}, lam:{n:'Laminoir', w:3, h:1, c:880}, bob:{n:'Bobineuse', w:2, h:1, c:1100},
  /* agroalimentaire */
  lav:{n:'Laveuse-trieuse', w:2, h:1, c:1600}, cui:{n:'Cuisson industrielle', w:2, h:2, c:1200}, cond:{n:'Conditionneuse', w:2, h:1, c:1900},
  jus:{n:'Extracteur de jus', w:2, h:1, c:1500}, pst:{n:'Tunnel de pasteurisation', w:3, h:1, c:1700},
  /* mobilier */
  sci:{n:'Scie à panneaux', w:2, h:1, c:90}, cnc:{n:'Défonceuse numérique', w:2, h:2, c:70}, tap:{n:'Atelier de tapisserie', w:2, h:1, c:55},
  ver:{n:'Cabine de vernis', w:2, h:1, c:80}, mon:{n:'Montage et emballage', w:2, h:1, c:75},
  /* automobile */
  pre:{n:'Presse d’emboutissage', w:2, h:2, c:64}, sou:{n:'Robot de soudure', w:1, h:2, c:30}, pei:{n:'Cabine de peinture', w:3, h:1, c:38},
  ass:{n:'Chaîne d’assemblage', w:4, h:1, c:55},
  /* chantier naval */
  dec:{n:'Découpe des tôles', w:2, h:1, c:.32}, blo:{n:'Atelier des blocs', w:2, h:2, c:.14}, cal:{n:'Cale de construction', w:4, h:2, c:.1},
  arm:{n:'Quai d’armement', w:2, h:2, c:.13},
  /* aéronautique */
  fus:{n:'Tronçons de fuselage', w:2, h:2, c:.12}, ail:{n:'Atelier des ailes', w:2, h:2, c:.12}, fin:{n:'Assemblage final', w:4, h:2, c:.09},
  cab:{n:'Aménagement cabine', w:2, h:1, c:.14}, ess:{n:'Banc d’essais', w:2, h:1, c:.16}
};
const FAB_AUX=['cv','in','out','buf','qc','mnt'];
const FAB_W=8, FAB_H=10;

/* ============================================================
   DESSINS
   ============================================================ */
const fabSh=(hex,k)=>{ const n=parseInt(hex.slice(1),16), f=v=>Math.max(0,Math.min(255,Math.round(k<0? v*(1+k) : v+(255-v)*k))); return '#'+[n>>16,(n>>8)&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join(''); };
/* dégradés communs d'une grille (préfixe unique par écran) */
function fabDefs(u){ return '<defs>'+
  '<pattern id="'+u+'fl" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#16191E"/><rect x=".5" y=".5" width="39" height="39" fill="none" stroke="#23272F"/><circle cx="3" cy="3" r="1" fill="#2D323B"/><circle cx="37" cy="37" r="1" fill="#2D323B"/><path d="M6 20 H12 M28 20 H34" stroke="#1C2026"/></pattern>'+
  '<pattern id="'+u+'hz" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3.5" height="7" fill="#F2C230"/><rect x="3.5" width="3.5" height="7" fill="#1A1A1A"/></pattern>'+
  '<linearGradient id="'+u+'mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E97A6"/><stop offset=".5" stop-color="#6A7382"/><stop offset="1" stop-color="#4C5461"/></linearGradient>'+
  '<linearGradient id="'+u+'st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4E8EE"/><stop offset=".5" stop-color="#AEB6C2"/><stop offset="1" stop-color="#7E8794"/></linearGradient>'+
  '<linearGradient id="'+u+'gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFEAF8" stop-opacity=".85"/><stop offset="1" stop-color="#5D8CA8" stop-opacity=".7"/></linearGradient>'+
  '<radialGradient id="'+u+'hot"><stop offset="0" stop-color="#FFF4B0"/><stop offset=".45" stop-color="#FF9A2E"/><stop offset="1" stop-color="#B3261E"/></radialGradient>'+
  '<linearGradient id="'+u+'wd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C99A62"/><stop offset=".5" stop-color="#B07F48"/><stop offset="1" stop-color="#8E6232"/></linearGradient>'+
  '</defs>'; }
/* boîtier commun : ombre, carrosserie, biseau, boulons, grilles d'aération, plaque */
function fabBox(u,W,H,col,o){ o=o||{}; const c1=fabSh(col,.28), c2=col, c3=fabSh(col,-.38);
  let s='<rect x="3" y="5" width="'+(W-6)+'" height="'+(H-6)+'" rx="6" fill="#000" opacity=".5"/>'+
    '<rect x="3" y="3" width="'+(W-6)+'" height="'+(H-6)+'" rx="6" fill="'+c3+'"/>'+
    '<rect x="4" y="4" width="'+(W-8)+'" height="'+(H-9)+'" rx="5" fill="'+c2+'"/>'+
    '<rect x="5" y="5" width="'+(W-10)+'" height="'+Math.min(10,(H-10)/3)+'" rx="4" fill="'+c1+'" opacity=".55"/>';
  if(!o.nb) [[8,8],[W-8,8],[8,H-9],[W-8,H-9]].forEach(([x,y])=>{ s+='<circle cx="'+x+'" cy="'+y+'" r="1.6" fill="'+fabSh(col,-.55)+'"/><circle cx="'+(x-.4)+'" cy="'+(y-.4)+'" r=".6" fill="'+c1+'"/>'; });
  if(o.hz) s+='<rect x="4" y="'+(H-8)+'" width="'+(W-8)+'" height="3" fill="url(#'+u+'hz)" opacity=".85"/>';
  return s; }
const fabVent=(x,y,n,w,col)=>[...Array(n)].map((_,i)=>'<rect x="'+x+'" y="'+(y+i*3)+'" width="'+w+'" height="1.4" rx=".7" fill="'+col+'"/>').join('');
const fabLed=(x,y,c,a)=>'<circle cx="'+x+'" cy="'+y+'" r="1.8" fill="'+c+'"'+(a?' class="fab-led"':'')+'/>';
const fabTxt=(x,y,t,c,s)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="'+(s||6.5)+'" fill="'+(c||'#F2F3F7')+'" letter-spacing=".4">'+t+'</text>';

/* dessin d'une machine vue de dessus, taille W×H pixels */
function fabMachineSvg(k,W,H,u,lab){ const m=FAB_M[k]; let s='';
  const B=(col,o)=>fabBox(u,W,H,col,o), cx=W/2, cy=H/2;
  switch(k){
  case 'in': case 'out': { const c= k==='in'? '#3C4452' : '#2F3A33';
    s=B(c,{nb:1})+'<rect x="7" y="7" width="'+(W-14)+'" height="'+(H-16)+'" rx="3" fill="'+fabSh(c,-.35)+'"/>';
    for(let i=0;i<Math.floor((W-16)/17);i++) s+='<g transform="translate('+(10+i*17)+' 10)"><rect width="14" height="'+(H-22)+'" fill="#8A6A43"/><rect y="1.5" width="14" height="2.5" fill="#B48B57"/><rect y="'+(H-28)+'" width="14" height="2.5" fill="#B48B57"/><rect x="2" y="5" width="10" height="'+(H-34)+'" fill="'+(k==='in'?'#9AA3B2':'#E8B84A')+'" opacity=".9"/></g>';
    s+='<rect x="4" y="'+(H-8)+'" width="'+(W-8)+'" height="3" fill="url(#'+u+'hz)"/>'+fabTxt(W-9,H-10,k==='in'?'ENTRÉE':'SORTIE','#E8EDF4',5.5).replace('middle','end'); break; }
  case 'cv': s=''; break;
  case 'buf': s=B('#3A3F48')+[0,1,2,3].map(i=>'<g transform="translate(9 '+(10+i*16)+')"><rect width="'+(W-18)+'" height="12" fill="#8A6A43"/><rect y="1" width="'+(W-18)+'" height="2" fill="#B48B57"/><rect x="3" y="4" width="'+(W-24)+'" height="6" fill="#C9CED6" opacity=".85"/></g>').join('')+'<rect x="6" y="6" width="2" height="'+(H-14)+'" fill="#F2C230"/><rect x="'+(W-8)+'" y="6" width="2" height="'+(H-14)+'" fill="#F2C230"/>'; break;
  case 'qc': s=B('#1F5A3C')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="3" fill="#0F2F20"/><rect class="fab-scan" x="9" y="9" width="'+(W-18)+'" height="2.5" fill="#6EE7A0"/>'+
    '<path d="M'+(cx-6)+' '+(cy-1)+' l4 4 l8 -9" stroke="#6EE7A0" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+fabLed(W-11,10,'#6EE7A0',1); break;
  case 'mnt': s=B('#4A4F5A',{hz:1})+'<rect x="8" y="8" width="'+(W-16)+'" height="20" rx="3" fill="#2B2F36"/>'+[0,1,2,3,4].map(i=>'<rect x="'+(11+i*12)+'" y="11" width="3" height="14" rx="1" fill="'+['#D9534F','#F2C230','#5B9BD5','#9AA3B2','#6EE7A0'][i]+'"/>').join('')+
    '<g transform="translate('+cx+' '+(cy+10)+') rotate(-30)"><rect x="-3" y="-14" width="6" height="22" rx="2" fill="#C9CED6"/><circle cy="-16" r="6" fill="none" stroke="#C9CED6" stroke-width="3.5"/></g><g transform="translate('+(cx+14)+' '+(cy+12)+')"><circle r="7" fill="#9AA3B2"/><circle r="2.5" fill="#4A4F5A"/>'+[0,1,2,3,4,5].map(i=>'<rect x="-1.5" y="-9.5" width="3" height="4" fill="#9AA3B2" transform="rotate('+i*60+')"/>').join('')+'</g>'; break;
  /* ---- ferme ---- */
  case 'net': s=B('#6B7A3A')+'<rect x="9" y="8" width="'+(W-18)+'" height="'+(H-17)+'" rx="3" fill="#3E4A20"/>'+[...Array(6)].map((_,i)=>'<path d="M'+(13+i*10)+' 11 l6 '+(H-24)+'" stroke="#A3B565" stroke-width="1.4"/>').join('')+'<g class="fab-shake">'+[...Array(9)].map((_,i)=>'<circle cx="'+(14+i*7)+'" cy="'+(13+(i%3)*4)+'" r="1.3" fill="#E5C46B"/>').join('')+'</g>'; break;
  case 'mou': s=B('#8A7A5A')+'<circle cx="'+cx+'" cy="'+(cy-2)+'" r="22" fill="#5E5238"/><g class="fab-spin"><circle cx="'+cx+'" cy="'+(cy-2)+'" r="18" fill="#B9AE96"/>'+[...Array(12)].map((_,i)=>'<rect x="'+(cx-1)+'" y="'+(cy-20)+'" width="2" height="7" fill="#7A6E55" transform="rotate('+i*30+' '+cx+' '+(cy-2)+')"/>').join('')+'<circle cx="'+cx+'" cy="'+(cy-2)+'" r="5" fill="#5E5238"/></g>'; break;
  case 'ens': s=B('#7A6A4A')+[0,1,2].map(i=>'<g transform="translate('+(12+i*20)+' 9)"><path d="M0 4 Q8 0 16 4 V'+(H-24)+' H0Z" fill="#E9DFC6"/><rect x="3" y="8" width="10" height="5" fill="#C4661F" opacity=".8"/></g>').join('')+fabLed(W-10,10,'#6EE7A0',1); break;
  case 'past': s=B('#9AA3B2')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="8" fill="url(#'+u+'st)"/>'+[...Array(5)].map((_,i)=>'<rect x="'+(13+i*12)+'" y="9" width="3" height="'+(H-18)+'" fill="#6A7382" opacity=".6"/>').join('')+'<circle cx="'+(W-14)+'" cy="'+cy+'" r="5" fill="#E8EDF4" stroke="#4C5461"/><path d="M'+(W-14)+' '+cy+' l3 -3" stroke="#D9534F" stroke-width="1.2"/>'; break;
  case 'cav': s=B('#5A4632')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="3" fill="#2E2318"/>'+[0,1,2].map(r=>[0,1,2,3].map(c=>'<circle cx="'+(16+c*16)+'" cy="'+(18+r*18)+'" r="6.5" fill="#E8C76A" stroke="#B8902E" stroke-width="1.2"/><circle cx="'+(16+c*16)+'" cy="'+(18+r*18)+'" r="2" fill="#F5DE95"/>').join('')).join(''); break;
  case 'pres': s=B('#6A3A4A')+'<circle cx="'+cx+'" cy="'+cy+'" r="24" fill="#3E2028"/><circle cx="'+cx+'" cy="'+cy+'" r="20" fill="#7A2E4A"/>'+[...Array(10)].map((_,i)=>'<circle cx="'+(cx+Math.cos(i*.63)*12)+'" cy="'+(cy+Math.sin(i*.63)*12)+'" r="3.4" fill="#9E3E68"/>').join('')+'<g class="fab-pst"><circle cx="'+cx+'" cy="'+cy+'" r="8" fill="url(#'+u+'st)"/></g>'; break;
  case 'cuv': s=B('#7E8794')+[0,1,2].map(i=>'<g transform="translate('+(20+i*36)+' '+cy+')"><circle r="15" fill="url(#'+u+'st)" stroke="#4C5461"/><circle r="10" fill="none" stroke="#C9CED6"/><circle r="3" fill="#4C5461"/>'+fabLed(10,-10,'#6EE7A0',1)+'</g>').join(''); break;
  case 'emb': s=B('#3A5A4A')+[...Array(7)].map((_,i)=>'<g transform="translate('+(11+i*9)+' 10)"><rect width="6" height="'+(H-26)+'" rx="2.5" fill="#3E6B3A"/><rect x="1.5" y="-2" width="3" height="4" fill="#8A2E3A"/><rect y="'+(H-36)+'" width="6" height="5" fill="#F2EEDF"/></g>').join(''); break;
  /* ---- textile ---- */
  case 'carde': s=B('#6B5A8A')+'<rect x="7" y="8" width="'+(W-14)+'" height="'+(H-17)+'" rx="3" fill="#3E3352"/>'+[0,1,2].map(i=>'<g class="fab-spin"><circle cx="'+cx+'" cy="'+(20+i*22)+'" r="9" fill="#C9C2DA"/>'+[...Array(8)].map((_,j)=>'<rect x="'+(cx-.6)+'" y="'+(10+i*22)+'" width="1.2" height="4" fill="#6B5A8A" transform="rotate('+j*45+' '+cx+' '+(20+i*22)+')"/>').join('')+'</g>').join('')+'<path d="M8 '+(H-11)+' q6 -4 12 0 t12 0" stroke="#F4F1FA" stroke-width="3" fill="none"/>'; break;
  case 'fil': s=B('#5A4F7A')+[...Array(7)].map((_,i)=>'<g transform="translate('+(11+i*9)+' '+cy+')"><ellipse rx="3.6" ry="'+(H/2-9)+'" fill="#E9E3F5"/><path d="M-3 -6 L3 -3 M-3 0 L3 3 M-3 6 L3 9" stroke="#B9AED6" stroke-width=".9"/><circle class="fab-led" cy="'+(-H/2+8)+'" r="1.2" fill="#F2C230"/></g>').join(''); break;
  case 'tis': s=B('#5B3FA0')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="3" fill="#2E2152"/>'+[...Array(14)].map((_,i)=>'<path d="M'+(12+i*4.5)+' 11 V'+(H-14)+'" stroke="#C9C2DA" stroke-width="1"/>').join('')+'<rect class="fab-shuttle" x="10" y="'+(cy-4)+'" width="14" height="8" rx="4" fill="#E8B84A"/>'+'<rect x="10" y="'+(H-26)+'" width="'+(W-20)+'" height="10" fill="#D7C9F2"/>'+[...Array(6)].map((_,i)=>'<path d="M10 '+(H-25+i*1.6)+' H'+(W-10)+'" stroke="#9E8BCB" stroke-width=".6"/>').join(''); break;
  case 'tei': s=B('#2F6B8A')+[0,1,2].map(i=>'<g transform="translate('+(16+i*24)+' '+cy+')"><circle r="10" fill="#1B3F52"/><circle r="8" fill="'+['#C8352A','#2B5BB5','#E8B84A'][i]+'" class="fab-led"/><path d="M-6 -2 Q0 -6 6 -2" stroke="#fff" stroke-opacity=".5" fill="none"/></g>').join(''); break;
  case 'coupe': s=B('#5A6472')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="2" fill="#E9EEF3"/>'+[...Array(5)].map((_,i)=>'<path d="M'+(10+i*13)+' 10 l10 '+(H-20)+'" stroke="#9AA3B2" stroke-dasharray="2 2" stroke-width=".8"/>').join('')+'<path d="M14 12 h18 v10 h-18z M38 12 h20 v10 h-20z" fill="#B9AED6" opacity=".8"/><rect class="fab-shuttle" x="12" y="9" width="3" height="'+(H-19)+'" fill="#D9534F"/>'; break;
  case 'conf': s=B('#6B4FB0')+[0,1].map(r=>[0,1,2].map(c=>'<g transform="translate('+(9+c*22)+' '+(10+r*30)+')"><rect width="18" height="22" rx="2" fill="#3E2A73"/><rect x="2" y="3" width="10" height="8" fill="#C9CED6"/><path d="M5 11 v6" stroke="#E8EDF4" stroke-width="1.6"/><circle cx="14" cy="16" r="3" fill="#E8B84A"/><circle class="fab-led" cx="15" cy="4" r="1.2" fill="#6EE7A0"/></g>').join('')).join(''); break;
  /* ---- électronique ---- */
  case 'lith': s=B('#D9DEE6')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="4" fill="#1B2430"/><circle cx="'+cx+'" cy="'+cy+'" r="22" fill="#2A3A4C"/><circle cx="'+cx+'" cy="'+cy+'" r="19" fill="#8FB7D8"/>'+
    [...Array(25)].map((_,i)=>{ const x=cx-14+(i%5)*6, y=cy-14+Math.floor(i/5)*6; return '<rect x="'+x+'" y="'+y+'" width="4.6" height="4.6" fill="'+(i%3?'#C9DDF0':'#E8B84A')+'" opacity=".9"/>'; }).join('')+'<rect class="fab-scan" x="'+(cx-20)+'" y="'+(cy-20)+'" width="40" height="2" fill="#B98CFF"/>'; break;
  case 'grav': s=B('#B9C2CE')+[0,1].map(i=>'<g transform="translate('+(18+i*34)+' '+cy+')"><circle r="12" fill="#2A3A4C"/><circle r="9" fill="#7B4FD0" class="fab-led"/><circle r="4" fill="#E0CCFF"/></g>').join('')+fabLed(W-9,9,'#B98CFF',1); break;
  case 'dep': s=B('#A9B3C0')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="3" fill="#24303E"/>'+[0,1,2,3].map(i=>'<rect x="'+(12+i*15)+'" y="12" width="11" height="'+(H-24)+'" rx="1.5" fill="'+['#E8B84A','#7FB3E0','#C9CED6','#9E8BCB'][i]+'" opacity=".85"/>').join(''); break;
  case 'lamv': s=B('#7FA3BF')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="2" fill="url(#'+u+'gl)"/>'+[0,1,2].map(i=>'<rect x="'+(14+i*20)+'" y="11" width="14" height="'+(H-22)+'" rx="1" fill="#0E1A24" stroke="#9FC5E0" stroke-width=".8"/>').join('')+'<rect class="fab-scan" x="9" y="10" width="'+(W-18)+'" height="1.6" fill="#fff" opacity=".7"/>'; break;
  case 'elec': s=B('#4A5A6A')+'<rect x="8" y="'+(cy-7)+'" width="'+(W-16)+'" height="14" fill="#1E242C"/><path class="fab-belt" d="M8 '+cy+' H'+(W-8)+'" stroke="#B87333" stroke-width="7" stroke-dasharray="6 3"/>'+[0,1].map(i=>'<circle cx="'+(12+i*(W-24))+'" cy="'+cy+'" r="8" fill="#9AA3B2" stroke="#4C5461"/>').join(''); break;
  case 'cell': s=B('#3A6B4A')+[...Array(8)].map((_,i)=>'<g transform="translate('+(10+i*8)+' 10)"><rect width="6" height="'+(H-26)+'" rx="2" fill="#2E3A44"/><rect y="'+(H-34)+'" width="6" height="'+(i%2?6:9)+'" fill="#6EE7A0"/><rect x="1.5" y="-2" width="3" height="3" fill="#C9CED6"/></g>').join(''); break;
  case 'usin': s=B('#5A6A7A')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="3" fill="url(#'+u+'gl)"/><g class="fab-spin"><circle cx="'+(cx-8)+'" cy="'+cy+'" r="7" fill="#C9CED6"/><path d="M'+(cx-8)+' '+(cy-7)+' V'+(cy+7)+' M'+(cx-15)+' '+cy+' H'+(cx-1)+'" stroke="#4C5461" stroke-width="1.6"/></g><rect x="'+(cx+6)+'" y="'+(cy-5)+'" width="14" height="10" fill="#8A929C"/><circle class="fab-spark" cx="'+(cx-1)+'" cy="'+cy+'" r="1.6" fill="#FFF3B0"/>'; break;
  case 'asmp': s=B('#4A5568')+'<rect x="8" y="'+(cy-6)+'" width="'+(W-16)+'" height="12" fill="#2B313B"/>'+[0,1,2].map(i=>'<g transform="translate('+(16+i*22)+' '+cy+')"><circle r="6" fill="#B87333"/><circle r="2.5" fill="#E8C49A"/>'+[...Array(6)].map((_,j)=>'<rect x="-1" y="-8" width="2" height="3" fill="#B87333" transform="rotate('+j*60+')"/>').join('')+'</g>').join(''); break;
  case 'test': s=B('#2E3A4A')+'<rect x="7" y="7" width="'+(W-14)+'" height="'+(H-16)+'" rx="3" fill="#0B141C"/><path d="M9 '+(cy+2)+' l4 0 l2 -6 l3 10 l2 -5 l3 0 l2 -3 l3 3 l4 0" stroke="#6EE7A0" stroke-width="1.4" fill="none" class="fab-led"/>'; break;
  /* ---- aciérie ---- */
  case 'hf': s=B('#5A3A2E',{hz:1})+'<circle cx="'+cx+'" cy="'+(cy-6)+'" r="28" fill="#2E1E18"/><circle cx="'+cx+'" cy="'+(cy-6)+'" r="22" fill="url(#'+u+'hot)" class="fab-glow"/><circle cx="'+cx+'" cy="'+(cy-6)+'" r="10" fill="#FFF4B0" opacity=".85"/>'+
    [...Array(8)].map((_,i)=>'<rect x="'+(cx-2)+'" y="'+(cy-36)+'" width="4" height="8" fill="#7A4A3A" transform="rotate('+i*45+' '+cx+' '+(cy-6)+')"/>').join('')+'<path d="M'+cx+' '+(cy+22)+' V'+(H-14)+'" stroke="#FF9A2E" stroke-width="4" class="fab-glow"/>'; break;
  case 'cvt': s=B('#6A4A3A')+'<ellipse cx="'+cx+'" cy="'+cy+'" rx="24" ry="26" fill="#3A2A22"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="16" ry="18" fill="url(#'+u+'hot)" class="fab-glow"/><rect x="4" y="'+(cy-4)+'" width="10" height="8" fill="#9AA3B2"/><rect x="'+(W-14)+'" y="'+(cy-4)+'" width="10" height="8" fill="#9AA3B2"/>'; break;
  case 'cc': s=B('#5A5F6A')+'<rect x="8" y="'+(cy-6)+'" width="'+(W-16)+'" height="12" fill="#2B2F36"/><rect class="fab-belt2" x="10" y="'+(cy-4)+'" width="'+(W-20)+'" height="8" fill="url(#'+u+'hot)"/>'+[...Array(10)].map((_,i)=>'<circle cx="'+(14+i*10)+'" cy="'+(cy+8)+'" r="2.4" fill="#9AA3B2"/><circle cx="'+(14+i*10)+'" cy="'+(cy-8)+'" r="2.4" fill="#9AA3B2"/>').join(''); break;
  case 'four': s=B('#7A3A2A')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="4" fill="#2E1A14"/>'+[0,1,2].map(i=>'<rect x="12" y="'+(13+i*18)+'" width="'+(W-24)+'" height="12" rx="2" fill="url(#'+u+'hot)" class="fab-glow" style="animation-delay:'+(i*.4)+'s"/>').join(''); break;
  case 'lam': s=B('#4C5461')+[0,1,2,3].map(i=>'<g transform="translate('+(18+i*28)+' '+cy+')"><rect x="-8" y="-14" width="16" height="28" rx="3" fill="#2B313B"/><g class="fab-spin"><circle r="9" fill="url(#'+u+'st)"/><path d="M-9 0 H9" stroke="#4C5461"/></g></g>').join('')+'<rect x="6" y="'+(cy-2)+'" width="'+(W-12)+'" height="4" fill="#FF9A2E" opacity=".75"/>'; break;
  case 'bob': s=B('#5A6472')+'<g class="fab-spin"><circle cx="'+(W-22)+'" cy="'+cy+'" r="13" fill="url(#'+u+'st)"/>'+[4,7,10].map(r=>'<circle cx="'+(W-22)+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#7E8794" stroke-width=".8"/>').join('')+'</g><rect x="8" y="'+(cy-3)+'" width="'+(W-38)+'" height="6" fill="#C9CED6"/>'; break;
  /* ---- agroalimentaire ---- */
  case 'lav': s=B('#3A7A8A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="3" fill="#7FC6D6" opacity=".55"/>'+[...Array(8)].map((_,i)=>'<circle class="fab-bob" style="animation-delay:'+(i*.15)+'s" cx="'+(13+i*7.5)+'" cy="'+(cy+(i%2?2:-2))+'" r="3" fill="'+['#D9534F','#6EBF4A','#F2A33A'][i%3]+'"/>').join(''); break;
  case 'cui': s=B('#8A8F99')+[0,1].map(r=>[0,1].map(c=>'<g transform="translate('+(20+c*40)+' '+(20+r*38)+')"><circle r="14" fill="#2B2F36"/><circle r="11" fill="#C4661F"/><circle r="8" fill="#E89A4A" class="fab-glow"/><path d="M-5 -16 q3 -4 0 -8 M3 -16 q3 -4 0 -8" stroke="#E8EDF4" stroke-opacity=".6" fill="none" class="fab-steam"/></g>').join('')).join(''); break;
  case 'cond': s=B('#4A6A5A')+[...Array(4)].map((_,i)=>'<g transform="translate('+(11+i*16)+' 10)"><rect width="13" height="'+(H-26)+'" fill="#C99A62"/><path d="M0 4 H13 M6.5 0 V4" stroke="#8E6232" stroke-width="1.2"/><rect x="2" y="8" width="9" height="4" fill="#F2EEDF"/></g>').join(''); break;
  case 'jus': s=B('#6A8A3A')+[0,1].map(i=>'<g transform="translate('+(20+i*34)+' '+cy+')"><circle r="12" fill="#3E5220"/><g class="fab-spin"><circle r="9" fill="#F2A33A"/>'+[...Array(8)].map((_,j)=>'<path d="M0 0 L0 -9" stroke="#FFD58A" stroke-width="1" transform="rotate('+j*45+')"/>').join('')+'</g></g>').join(''); break;
  case 'pst': s=B('#7E8794')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="8" fill="url(#'+u+'st)"/>'+[...Array(9)].map((_,i)=>'<rect class="fab-bob" style="animation-delay:'+(i*.1)+'s" x="'+(13+i*10)+'" y="'+(cy-5)+'" width="6" height="10" rx="2" fill="#E8B84A" opacity=".9"/>').join('')+'<path d="M10 '+(cy-8)+' H'+(W-10)+'" stroke="#D9534F" stroke-width="1" stroke-dasharray="3 3" class="fab-belt"/>'; break;
  /* ---- mobilier ---- */
  case 'sci': s=B('#6A6F7A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="2" fill="url(#'+u+'wd)"/>'+[...Array(6)].map((_,i)=>'<path d="M8 '+(12+i*3.5)+' H'+(W-8)+'" stroke="#8E6232" stroke-width=".5" opacity=".7"/>').join('')+'<g class="fab-spin"><circle cx="'+cx+'" cy="'+cy+'" r="9" fill="#C9CED6"/>'+[...Array(12)].map((_,i)=>'<path d="M'+cx+' '+(cy-9)+' l1.5 -2.5 l1 2.5z" fill="#C9CED6" transform="rotate('+i*30+' '+cx+' '+cy+')"/>').join('')+'<circle cx="'+cx+'" cy="'+cy+'" r="2" fill="#4C5461"/></g>'; break;
  case 'cnc': s=B('#4C6A8A')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" rx="3" fill="url(#'+u+'wd)"/><path d="M14 18 Q'+cx+' 6 '+(W-14)+' 18 T'+(W-14)+' '+(H-20)+' Q'+cx+' '+(H-8)+' 14 '+(H-20)+'Z" fill="none" stroke="#5E3E1E" stroke-width="1.4" stroke-dasharray="3 2"/><rect x="8" y="'+(cy-3)+'" width="'+(W-16)+'" height="6" fill="#2B313B"/><g class="fab-shuttle"><rect x="10" y="'+(cy-8)+'" width="12" height="16" rx="2" fill="#E8B84A"/><circle cx="16" cy="'+cy+'" r="2" fill="#2B313B"/></g>'; break;
  case 'tap': s=B('#7A4A5A')+[0,1,2].map(i=>'<g transform="translate('+(11+i*21)+' 9)"><rect width="17" height="'+(H-25)+'" rx="4" fill="#B0344A"/><path d="M3 5 H14 M3 9 H14" stroke="#7A1E30" stroke-width=".8"/><circle cx="8.5" cy="'+((H-25)/2)+'" r="1.4" fill="#F2C230"/></g>').join(''); break;
  case 'ver': s=B('#3A4A5A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="3" fill="#1E2A36"/><rect x="12" y="12" width="'+(W-24)+'" height="'+(H-24)+'" fill="url(#'+u+'wd)"/><rect x="10" y="10" width="'+(W-20)+'" height="'+(H-20)+'" fill="#CFEAF8" opacity=".3" class="fab-mist"/>'; break;
  case 'mon': s=B('#5A5F6A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" fill="#3A3F48"/><g transform="translate(14 12)"><rect width="18" height="12" fill="url(#'+u+'wd)"/><rect x="2" y="12" width="2" height="6" fill="#8E6232"/><rect x="14" y="12" width="2" height="6" fill="#8E6232"/></g><g transform="translate('+(W-34)+' 11)"><rect width="20" height="16" fill="#C99A62"/><path d="M0 0 L20 16 M20 0 L0 16" stroke="#8E6232" stroke-width=".8"/></g>'; break;
  /* ---- automobile ---- */
  case 'pre': s=B('#5B6472',{hz:1})+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-20)+'" rx="4" fill="#3B424E"/><g transform="translate('+cx+' '+(cy-3)+')"><circle r="24" fill="#2B313B" stroke="#1B1F26" stroke-width="3"/><g class="fab-pst"><circle r="16" fill="url(#'+u+'st)"/></g><circle r="5" fill="#2B313B"/>'+[...Array(6)].map((_,i)=>'<circle cx="'+(Math.cos(i*1.047)*20)+'" cy="'+(Math.sin(i*1.047)*20)+'" r="1.8" fill="#9AA3B2"/>').join('')+'</g>'; break;
  case 'sou': s=B('#3A3F48',{nb:1})+'<circle cx="'+cx+'" cy="'+(H-20)+'" r="13" fill="#E8A33D" stroke="#8A5A12" stroke-width="2"/><circle cx="'+cx+'" cy="'+(H-20)+'" r="6" fill="#C98A2A"/><g transform="translate('+cx+' '+(H-20)+')"><g class="fab-arm"><rect x="-4" y="-38" width="8" height="38" rx="4" fill="#F5C451" stroke="#8A5A12"/><rect x="-3" y="-52" width="6" height="16" rx="3" fill="#F5C451" stroke="#8A5A12"/><circle cy="-38" r="3.5" fill="#8A5A12"/><circle class="fab-spark" cy="-54" r="4" fill="#FFF7C2"/></g></g>'; break;
  case 'pei': s=B('#1F4D63')+'<rect x="7" y="7" width="'+(W-14)+'" height="'+(H-16)+'" rx="3" fill="#123444"/><rect x="10" y="10" width="'+(W-20)+'" height="'+(H-22)+'" rx="2" fill="#6FB6D6" opacity=".5" class="fab-mist"/>'+[0,1,2].map(i=>'<g transform="translate('+(22+i*38)+' '+cy+')"><circle r="4.5" fill="#E0F2FE"/><path d="M0 4 L-6 12 M0 4 L6 12 M0 4 V13" stroke="#E0F2FE" stroke-opacity=".7"/></g>').join(''); break;
  case 'ass': s=B('#3D4A5C')+'<rect x="7" y="'+(cy-9)+'" width="'+(W-14)+'" height="18" fill="#2B313B"/>'+[0,1,2].map(i=>'<g transform="translate('+(20+i*48)+' '+(cy-8)+')"><path d="M0 8 C0 2 5 0 12 0 H22 C30 0 34 3 34 8 C34 13 30 16 22 16 H12 C5 16 0 14 0 8Z" fill="#C0392B"/><rect x="11" y="2.5" width="12" height="11" rx="2.5" fill="#6FB6D6" opacity=".85"/><rect x="2" y="3" width="3" height="10" rx="1" fill="#1D1F23"/><rect x="29" y="3" width="3" height="10" rx="1" fill="#1D1F23"/></g>').join('')+fabLed(W-9,9,'#F2C230',1); break;
  /* ---- chantier naval ---- */
  case 'dec': s=B('#4C5A6A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" fill="url(#'+u+'st)"/><path d="M12 '+(cy-4)+' L'+(W-20)+' '+(cy-4)+' L'+(W-14)+' '+(cy+4)+' L12 '+(cy+4)+'Z" fill="none" stroke="#4C5461" stroke-dasharray="2 2"/><g class="fab-shuttle"><rect x="10" y="10" width="4" height="'+(H-20)+'" fill="#2B313B"/><circle class="fab-spark" cx="12" cy="'+cy+'" r="3" fill="#B0E0FF"/></g>'; break;
  case 'blo': s=B('#3A4A5C')+[0,1].map(r=>[0,1].map(c=>'<g transform="translate('+(10+c*32)+' '+(10+r*32)+')"><rect width="28" height="26" fill="#7E8794"/><path d="M0 9 H28 M0 18 H28 M9 0 V26 M19 0 V26" stroke="#4C5461"/><rect width="28" height="26" fill="none" stroke="#C9CED6"/></g>').join('')).join('')+'<circle class="fab-spark" cx="'+cx+'" cy="'+cy+'" r="2.5" fill="#FFF3B0"/>'; break;
  case 'cal': s=B('#2E3E50')+'<rect x="7" y="7" width="'+(W-14)+'" height="'+(H-16)+'" fill="#1E5A7A" opacity=".55"/><path d="M14 '+(cy-14)+' H'+(W-30)+' L'+(W-12)+' '+cy+' L'+(W-30)+' '+(cy+14)+' H14 Q8 '+cy+' 14 '+(cy-14)+'Z" fill="#C9CED6" stroke="#7E8794"/><path d="M14 '+cy+' H'+(W-14)+'" stroke="#9AA3B2"/>'+[...Array(5)].map((_,i)=>'<rect x="'+(24+i*22)+'" y="'+(cy-9)+'" width="14" height="18" fill="#C0392B" opacity=".85"/>').join('')+'<g class="fab-swing" style="transform-origin:'+(W-24)+'px 10px"><path d="M'+(W-24)+' 10 V'+(cy-16)+'" stroke="#F2C230" stroke-width="1.5"/><rect x="'+(W-30)+'" y="'+(cy-18)+'" width="12" height="6" fill="#F2C230"/></g>'; break;
  case 'arm': s=B('#2F5A7A')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" fill="#1E5A7A" opacity=".6"/><path d="M14 18 H'+(W-14)+' V'+(H-22)+' H14Z" fill="#E8EDF4"/><rect x="'+(cx-8)+'" y="24" width="16" height="12" fill="#2B313B"/><rect x="'+(cx-3)+'" y="14" width="6" height="10" fill="#C0392B"/>'+[0,1,2,3].map(i=>'<rect x="'+(16+i*12)+'" y="'+(H-32)+'" width="8" height="6" fill="#6FB6D6"/>').join(''); break;
  /* ---- aéronautique ---- */
  case 'fus': s=B('#3B4F7A')+'<rect x="8" y="8" width="'+(W-16)+'" height="'+(H-17)+'" fill="#24324F"/>'+[0,1].map(i=>'<g transform="translate('+(14+i*30)+' 14)"><rect width="24" height="'+(H-30)+'" rx="12" fill="url(#'+u+'st)"/>'+[...Array(5)].map((_,j)=>'<circle cx="12" cy="'+(8+j*10)+'" r="1.8" fill="#2B313B"/>').join('')+'</g>').join('')+'<circle class="fab-spark" cx="'+(cx+2)+'" cy="'+cy+'" r="2.5" fill="#B0E0FF"/>'; break;
  case 'ail': s=B('#34466E')+'<path d="M10 '+(H-14)+' L'+(W-10)+' 14 L'+(W-10)+' 26 L22 '+(H-14)+'Z" fill="url(#'+u+'st)"/><path d="M20 '+(H-18)+' L'+(W-14)+' 20" stroke="#7E8794"/>'+[0,1,2].map(i=>'<circle cx="'+(26+i*14)+'" cy="'+(H-24-i*12)+'" r="1.6" fill="#4C5461"/>').join('')+'<g class="fab-swing" style="transform-origin:'+(cx)+'px 8px"><path d="M'+cx+' 8 V'+(cy-6)+'" stroke="#F2C230"/><rect x="'+(cx-5)+'" y="'+(cy-8)+'" width="10" height="4" fill="#F2C230"/></g>'; break;
  case 'fin': s=B('#2B3A5C')+'<rect x="7" y="7" width="'+(W-14)+'" height="'+(H-16)+'" fill="#1E2A44"/><g transform="translate('+cx+' '+cy+')"><path d="M-62 0 C-62 -6 -56 -8 -46 -8 H46 C56 -8 64 -4 66 0 C64 4 56 8 46 8 H-46 C-56 8 -62 6 -62 0Z" fill="url(#'+u+'st)"/><path d="M-4 -8 L-18 -34 H-8 L14 -8Z M-4 8 L-18 34 H-8 L14 8Z" fill="#C9CED6" stroke="#7E8794"/><path d="M-54 -8 L-60 -20 H-54 L-46 -8Z" fill="#C0392B"/>'+[...Array(10)].map((_,i)=>'<circle cx="'+(-36+i*8)+'" cy="-3" r="1.1" fill="#2B313B"/>').join('')+'<path d="M52 -4 Q58 0 52 4" fill="#2B313B"/></g>'+fabLed(12,12,'#F2C230',1)+fabLed(W-12,12,'#F2C230',1); break;
  case 'cab': s=B('#4A5A7A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="8" fill="#E8EDF4"/>'+[...Array(6)].map((_,i)=>'<rect x="'+(12+i*10)+'" y="12" width="7" height="'+(H-24)+'" rx="2" fill="#2B5BB5"/><rect x="'+(12+i*10)+'" y="12" width="7" height="3" rx="1" fill="#6FB6D6"/>').join(''); break;
  case 'ess': s=B('#2E3A4A')+'<rect x="8" y="9" width="'+(W-16)+'" height="'+(H-18)+'" rx="3" fill="#0B141C"/><g transform="translate(22 '+cy+')"><circle r="10" fill="#4C5461"/><g class="fab-spin"><circle r="8" fill="#9AA3B2"/>'+[...Array(10)].map((_,i)=>'<path d="M0 0 L0 -8" stroke="#4C5461" stroke-width="1.2" transform="rotate('+i*36+')"/>').join('')+'</g></g><path d="M38 '+(cy+2)+' l4 0 l2 -6 l3 10 l2 -5 l6 0" stroke="#6EE7A0" stroke-width="1.3" fill="none" class="fab-led"/>'; break;
  default: s=B('#5A6472');
  }
  if(lab&&m&&!m.aux&&H>=40) s+='<rect x="5" y="'+(H-17)+'" width="'+(W-10)+'" height="10" rx="2" fill="#000" opacity=".55"/>'+fabTxt(W/2,H-9.5,lab,'#F2F3F7',6.2);
  return s; }

/* ---------- icône d'un produit (48 × 48) ---------- */
function fabProdSvg(p,sz){ sz=sz||44; let s='';
  const g=(c1,c2,id)=>'<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient>';
  const u='fp'+p+(++FAB_N);
  const car=(col,body)=>'<defs>'+g(fabSh(col,.35),fabSh(col,-.3),u)+'</defs><ellipse cx="24" cy="38" rx="20" ry="2.5" fill="#000" opacity=".3"/><path d="'+body+'" fill="url(#'+u+')" stroke="'+fabSh(col,-.5)+'" stroke-width=".6"/>'+'<circle cx="13" cy="35" r="4.2" fill="#1D1F23"/><circle cx="13" cy="35" r="2.2" fill="#C9CED6"/><circle cx="35" cy="35" r="4.2" fill="#1D1F23"/><circle cx="35" cy="35" r="2.2" fill="#C9CED6"/><rect x="40" y="27" width="3.5" height="2.2" rx="1" fill="#FFF3C0"/><rect x="4" y="27" width="2.5" height="2" rx="1" fill="#D22D2D"/>';
  const plane=(len,eng)=>'<defs>'+g('#F4F6F9','#AEB6C2',u)+'</defs><g transform="rotate(-18 24 24)"><path d="M'+(24-len)+' 24 C'+(24-len)+' 21 '+(26-len)+' 20 '+(30-len)+' 20 H'+(20+len)+' C'+(23+len)+' 20 '+(26+len)+' 22 '+(26+len)+' 24 C'+(26+len)+' 26 '+(23+len)+' 28 '+(20+len)+' 28 H'+(30-len)+' C'+(26-len)+' 28 '+(24-len)+' 27 '+(24-len)+' 24Z" fill="url(#'+u+')" stroke="#7E8794" stroke-width=".6"/><path d="M22 20 L14 6 H18 L30 20Z M22 28 L14 42 H18 L30 28Z" fill="#D8DDE4" stroke="#7E8794" stroke-width=".6"/><path d="M'+(27-len)+' 20 L'+(24-len)+' 13 H'+(27-len)+' L'+(32-len)+' 20Z" fill="#C0392B"/>'+[...Array(eng)].map((_,i)=>'<rect x="'+(19-i*4)+'" y="'+(i%2?31:14)+'" width="6" height="3" rx="1.5" fill="#4C5461"/>').join('')+[...Array(Math.round(len/2))].map((_,i)=>'<circle cx="'+(30-len+i*4)+'" cy="23" r=".9" fill="#2B5BB5"/>').join('')+'</g>';
  switch(p){
  case 'cer': s='<defs>'+g('#F5D77A','#C9962E',u)+'</defs>'+[14,22,30].map((x,i)=>'<path d="M'+x+' 44 Q'+(x+1)+' 26 '+(x+2)+' 14" stroke="#B8902E" stroke-width="1.4" fill="none"/>'+[...Array(6)].map((_,j)=>'<ellipse cx="'+(x+1.5+(j%2?2.4:-2.4)+j*.1)+'" cy="'+(16+j*3.4)+'" rx="2.2" ry="3.6" fill="url(#'+u+')" transform="rotate('+(j%2?25:-25)+' '+(x+1.5)+' '+(16+j*3.4)+')"/>').join('')).join(''); break;
  case 'leg': s='<path d="M8 30 H40 L36 44 H12Z" fill="#8A6A43"/><path d="M8 30 H40" stroke="#B48B57" stroke-width="2"/><circle cx="17" cy="26" r="7" fill="#D9342B"/><circle cx="15" cy="24" r="2" fill="#F28B82" opacity=".7"/><path d="M17 19 q2 -3 4 -2" stroke="#3E7A2A" stroke-width="1.6" fill="none"/><path d="M26 30 Q24 16 30 10 Q34 18 32 30Z" fill="#F28C28"/><path d="M30 10 l-3 -5 M30 10 l2 -6 M30 10 l5 -3" stroke="#4E8A2E" stroke-width="1.6"/><circle cx="37" cy="27" r="5" fill="#6EBF4A"/>'; break;
  case 'lai': s='<defs>'+g('#FFFFFF','#DCE3EA',u)+'</defs><path d="M16 12 H32 V8 H16Z" fill="#2B5BB5"/><path d="M16 12 L13 18 V42 Q13 44 15 44 H33 Q35 44 35 42 V18 L32 12Z" fill="url(#'+u+')" stroke="#9AA3B2" stroke-width=".8"/><rect x="13" y="24" width="22" height="12" fill="#2B5BB5"/><path d="M16 30 q4 -3 8 0 t8 0" stroke="#fff" stroke-width="1.4" fill="none"/>'; break;
  case 'oeu': s='<path d="M6 30 H42 L38 42 H10Z" fill="#C9A25E"/>'+[[14,26],[24,24],[34,26],[19,32],[29,32]].map(([x,y])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="5.2" ry="6.4" fill="#F3E1C2" stroke="#C9A97A" stroke-width=".6"/><ellipse cx="'+(x-1.5)+'" cy="'+(y-2)+'" rx="1.4" ry="2" fill="#fff" opacity=".7"/>').join(''); break;
  case 'rai': s='<path d="M24 6 q2 4 0 8" stroke="#6B4A2A" stroke-width="1.8" fill="none"/><path d="M26 9 Q36 4 40 12 Q32 14 26 9Z" fill="#5B8C2A"/>'+[[19,16],[25,16],[31,17],[16,22],[22,22],[28,22],[34,23],[19,28],[25,28],[31,29],[22,34],[28,34],[25,40]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3.6" fill="#5E2A6E"/><circle cx="'+(x-1)+'" cy="'+(y-1.2)+'" r="1" fill="#B98CD0" opacity=".8"/>').join(''); break;
  case 'far': s='<defs>'+g('#F4EBD6','#CDBB93',u)+'</defs><path d="M12 14 Q24 8 36 14 L38 42 Q24 46 10 42Z" fill="url(#'+u+')" stroke="#A8936A" stroke-width=".8"/><path d="M12 14 Q16 10 20 13 Q24 9 28 13 Q32 10 36 14" stroke="#A8936A" fill="none"/><rect x="16" y="24" width="16" height="10" rx="2" fill="#C4661F" opacity=".85"/><path d="M24 26 v6 M21 28 l3 -2 l3 2" stroke="#F4EBD6" stroke-width="1"/>'; break;
  case 'fro': s='<path d="M6 34 L24 16 L42 30 V38 L24 44 L6 40Z" fill="#E8B84A"/><path d="M6 34 L24 16 L42 30 L24 36Z" fill="#F5D27A"/><path d="M24 36 V44" stroke="#C9962E"/>'+[[16,30,2.2],[28,26,1.8],[33,33,2],[20,39,1.6],[30,40,1.4]].map(([x,y,r])=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#C9962E"/>').join(''); break;
  case 'vin': s='<defs>'+g('#3E6B3A','#1E3A1E',u)+'</defs><path d="M21 4 H27 V14 Q32 18 32 24 V42 Q32 44 30 44 H18 Q16 44 16 42 V24 Q16 18 21 14Z" fill="url(#'+u+')"/><rect x="21" y="3" width="6" height="5" fill="#8A2E3A"/><rect x="16" y="26" width="16" height="10" fill="#F2EEDF"/><path d="M19 31 h10" stroke="#8A2E3A" stroke-width="1.6"/><path d="M18 20 Q19 17 22 16" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/>'; break;
  case 'cot': case 'lan': case 'soi': { const c={cot:'#F2EEE6',lan:'#C9A27A',soi:'#C8352A'}[p]; s='<defs>'+g(fabSh(c,.25),fabSh(c,-.25),u)+'</defs><rect x="8" y="14" width="30" height="22" rx="2" fill="url(#'+u+')"/>'+[...Array(5)].map((_,i)=>'<path d="M8 '+(17+i*4)+' H38" stroke="'+fabSh(c,-.3)+'" stroke-width=".5"/>').join('')+'<ellipse cx="38" cy="25" rx="5" ry="11" fill="'+fabSh(c,-.15)+'"/><ellipse cx="38" cy="25" rx="2" ry="4.4" fill="'+fabSh(c,-.45)+'"/><path d="M8 36 Q4 40 10 44 H24" stroke="'+fabSh(c,-.1)+'" stroke-width="3" fill="none"/>'+(p==='soi'?'<path d="M12 18 Q20 24 30 18" stroke="#fff" stroke-opacity=".5" fill="none"/>':''); break; }
  case 'pap': s='<defs>'+g('#2B5BB5','#1A3A7A',u)+'</defs><path d="M16 6 L10 10 L4 16 L9 22 L12 19 V42 H36 V19 L39 22 L44 16 L38 10 L32 6 Q24 12 16 6Z" fill="url(#'+u+')" stroke="#12285A" stroke-width=".8"/><path d="M16 6 Q24 14 32 6" stroke="#fff" stroke-opacity=".6" fill="none"/><path d="M24 12 V42" stroke="#12285A" stroke-width=".6"/>'+[18,24,30].map(y=>'<circle cx="24" cy="'+y+'" r="1" fill="#E8EDF4"/>').join(''); break;
  case 'puc': s='<rect x="10" y="10" width="28" height="28" rx="3" fill="#1E2A36"/><rect x="15" y="15" width="18" height="18" rx="1" fill="#C9A23A"/>'+[...Array(4)].map((_,i)=>'<rect x="'+(13+i*6)+'" y="4" width="2.5" height="6" fill="#C9CED6"/><rect x="'+(13+i*6)+'" y="38" width="2.5" height="6" fill="#C9CED6"/><rect x="4" y="'+(13+i*6)+'" width="6" height="2.5" fill="#C9CED6"/><rect x="38" y="'+(13+i*6)+'" width="6" height="2.5" fill="#C9CED6"/>').join('')+'<path d="M18 20 H30 M18 24 H30 M18 28 H26" stroke="#8A6A1A" stroke-width=".8"/>'; break;
  case 'ecr': s='<defs>'+g('#3A6EA5','#0E1A2A',u)+'</defs><rect x="6" y="9" width="36" height="24" rx="2" fill="#1E242C"/><rect x="8" y="11" width="32" height="20" fill="url(#'+u+')"/><path d="M10 13 L20 13 L14 22Z" fill="#fff" opacity=".18"/><rect x="20" y="33" width="8" height="5" fill="#4C5461"/><rect x="14" y="38" width="20" height="3" rx="1.5" fill="#4C5461"/>'; break;
  case 'bat': s='<defs>'+g('#3DDC8C','#0F7A44',u)+'</defs><rect x="12" y="10" width="24" height="32" rx="4" fill="#2B313B"/><rect x="19" y="6" width="10" height="5" rx="1" fill="#9AA3B2"/><rect x="15" y="22" width="18" height="17" rx="1.5" fill="url(#'+u+')"/><path d="M26 13 L20 22 H25 L22 30 L29 20 H24Z" fill="#F2C230"/>'; break;
  case 'pau': s='<g transform="translate(24 24)"><circle r="16" fill="#7E8794"/>'+[...Array(10)].map((_,i)=>'<rect x="-3" y="-20" width="6" height="6" rx="1" fill="#7E8794" transform="rotate('+i*36+')"/>').join('')+'<circle r="10" fill="#AEB6C2"/><circle r="4.5" fill="#4C5461"/>'+[...Array(5)].map((_,i)=>'<circle cx="'+(Math.cos(i*1.257)*7)+'" cy="'+(Math.sin(i*1.257)*7)+'" r="1.4" fill="#4C5461"/>').join('')+'</g>'; break;
  case 'aci': s='<defs>'+g('#C9CED6','#6A7382',u)+'</defs>'+[[6,28],[14,20],[22,28]].map(([x,y])=>'<path d="M'+x+' '+(y+6)+' L'+(x+6)+' '+y+' H'+(x+26)+' L'+(x+20)+' '+(y+6)+'Z" fill="#E4E8EE"/><rect x="'+x+'" y="'+(y+6)+'" width="20" height="8" fill="url(#'+u+')"/><path d="M'+(x+20)+' '+(y+6)+' L'+(x+26)+' '+y+' V'+(y+8)+' L'+(x+20)+' '+(y+14)+'Z" fill="#59616E"/>').join(''); break;
  case 'tol': s='<defs>'+g('#E4E8EE','#7E8794',u)+'</defs><circle cx="20" cy="26" r="15" fill="url(#'+u+')"/>'+[4,7,10,13].map(r=>'<circle cx="20" cy="26" r="'+r+'" fill="none" stroke="#59616E" stroke-width=".6"/>').join('')+'<circle cx="20" cy="26" r="3.5" fill="#2B313B"/><path d="M20 11 H44 V17 H20" fill="#C9CED6" stroke="#7E8794" stroke-width=".6"/>'; break;
  case 'pla': s='<ellipse cx="24" cy="32" rx="20" ry="9" fill="#E8EDF4"/><ellipse cx="24" cy="30" rx="16" ry="6.5" fill="#F7F9FB"/><path d="M12 29 Q16 22 22 26 Q26 20 32 25 Q36 23 37 29 Q24 34 12 29Z" fill="#C4661F"/><circle cx="18" cy="27" r="2" fill="#6EBF4A"/><circle cx="29" cy="26" r="2.2" fill="#D9342B"/><path d="M18 18 q2 -4 0 -8 M24 17 q2 -4 0 -8 M30 18 q2 -4 0 -8" stroke="#C9CED6" stroke-width="1.4" fill="none"/>'; break;
  case 'bsn': s='<defs>'+g('#F2A33A','#C4661F',u)+'</defs><path d="M15 12 H33 L30 44 H18Z" fill="#E8EDF4" stroke="#9AA3B2" stroke-width=".7"/><path d="M16 20 H32 L30 42 H18Z" fill="url(#'+u+')"/><path d="M28 4 L24 30" stroke="#D9342B" stroke-width="2.2"/><circle cx="33" cy="13" r="5" fill="#F2C230"/><path d="M33 8 V18 M28 13 H38" stroke="#E8A33D"/><circle cx="21" cy="30" r="1.4" fill="#fff" opacity=".6"/><circle cx="25" cy="36" r="1" fill="#fff" opacity=".6"/>'; break;
  case 'meu': s='<defs>'+g('#C99A62','#8E6232',u)+'</defs><rect x="8" y="22" width="32" height="10" rx="3" fill="#B0344A"/><rect x="8" y="12" width="32" height="12" rx="4" fill="#C8455A"/><rect x="5" y="18" width="7" height="16" rx="3" fill="#9E2E42"/><rect x="36" y="18" width="7" height="16" rx="3" fill="#9E2E42"/><rect x="8" y="34" width="3" height="8" fill="url(#'+u+')"/><rect x="37" y="34" width="3" height="8" fill="url(#'+u+')"/><path d="M14 16 H34" stroke="#7A1E30" stroke-width=".7"/>'; break;
  case 'mbu': s='<defs>'+g('#C99A62','#8E6232',u)+'</defs><rect x="4" y="16" width="40" height="5" rx="1" fill="url(#'+u+')"/><rect x="6" y="21" width="3" height="20" fill="#59616E"/><rect x="39" y="21" width="3" height="20" fill="#59616E"/><rect x="26" y="21" width="12" height="14" fill="#8E6232"/><rect x="28" y="24" width="8" height="3" fill="#C99A62"/><rect x="28" y="29" width="8" height="3" fill="#C99A62"/><rect x="10" y="6" width="14" height="10" rx="1" fill="#1E242C"/><rect x="11" y="7" width="12" height="8" fill="#3A6EA5"/>'; break;
  case 'voi': s=car('#2B8AC4','M6 32 C6 26 9 24 14 23 L18 17 C19 15.5 21 15 23 15 H31 C34 15 36 17 38 20 L41 23 C43 24 44 26 44 29 V33 H6Z')+'<path d="M19 17.5 H26 V23 H16Z M28 17.5 H31 C33 17.5 34.5 19 36 22.5 V23 H28Z" fill="#CFEAF8"/>'; break;
  case 'ber': s=car('#C0392B','M3 32 C3 28 5 26 9 25.5 L16 24.5 L21 18.5 C22.5 17 24 16.5 26 16.5 H32 C34.5 16.5 36 17.5 38 20 L41 24 C44 24.5 46 26 46 29 V33 H3Z')+'<path d="M22.5 19 H28.5 V24 H18Z M30.5 19 H32 C34 19 35 20 37 23.5 V24 H30.5Z" fill="#CFEAF8"/>'; break;
  case 'suv': s=car('#2E3A44','M4 32 V26 C4 23.5 6 22.5 9 22 L14 14.5 C15 13 16.5 12.5 18 12.5 H34 C36 12.5 37.5 13.5 38.5 15.5 L42 22 C44 22.5 45 24 45 26 V33 H4Z')+'<path d="M16 15 H25 V21.5 H11.5Z M27 15 H34 C35.5 15 36.5 16 37.5 18 L39 21.5 H27Z" fill="#CFEAF8"/><rect x="15" y="10.5" width="20" height="1.6" rx=".8" fill="#1D1F23"/>'; break;
  case 'utl': s=car('#E9EBEE','M3 33 V14 C3 11.5 4.5 10 7 10 H33 C35 10 36 11 37 13 L41 21 C44 21.5 46 23 46 26 V33Z')+'<path d="M34 13 H35.5 L39.5 21 H34Z" fill="#CFEAF8"/><path d="M8 13 H30 V28 H8Z" fill="none" stroke="#9AA3B2" stroke-width=".7"/><rect x="10" y="17" width="14" height="5" fill="#C8352A"/>'; break;
  case 'yac': s='<defs>'+g('#FFFFFF','#C9D2DC',u)+'</defs><path d="M2 36 Q24 44 46 32 L43 28 H6Z" fill="#1E5A7A" opacity=".35"/><path d="M4 30 H44 L38 36 H10Z" fill="url(#'+u+')" stroke="#7E8794" stroke-width=".6"/><path d="M12 30 V24 H32 L38 30Z" fill="#F4F6F9" stroke="#9AA3B2" stroke-width=".6"/><path d="M16 24 V19 H28 L31 24Z" fill="#F4F6F9" stroke="#9AA3B2" stroke-width=".6"/><path d="M14 27 H34 M18 22 H28" stroke="#1E242C" stroke-width="1.8"/><path d="M4 30 H44" stroke="#2B5BB5" stroke-width="1.4"/>'; break;
  case 'fer': s='<path d="M3 30 H45 L41 38 H8Z" fill="#E8EDF4" stroke="#7E8794" stroke-width=".6"/><path d="M3 30 H45" stroke="#C8352A" stroke-width="2"/><rect x="8" y="21" width="32" height="9" fill="#F4F6F9" stroke="#9AA3B2" stroke-width=".6"/><rect x="12" y="15" width="22" height="6" fill="#F4F6F9" stroke="#9AA3B2" stroke-width=".6"/>'+[...Array(8)].map((_,i)=>'<rect x="'+(10+i*3.8)+'" y="24" width="2.4" height="2.4" fill="#2B5BB5"/>').join('')+'<rect x="30" y="9" width="5" height="6" fill="#C8352A"/><path d="M2 41 Q12 38 24 41 T46 41" stroke="#7FB3E0" fill="none"/>'; break;
  case 'pcn': s='<path d="M2 30 H46 L42 38 H6Z" fill="#2B313B"/><path d="M2 30 H46" stroke="#C8352A" stroke-width="1.6"/>'+[...Array(5)].map((_,i)=>[0,1].map(j=>'<rect x="'+(8+i*6)+'" y="'+(24-j*5)+'" width="5.5" height="4.6" fill="'+['#C0392B','#2B5BB5','#E8B84A','#2E8A5A','#7A3FA0'][(i+j)%5]+'"/>').join('')).join('')+'<rect x="38" y="17" width="6" height="13" fill="#E8EDF4"/><rect x="39" y="19" width="4" height="2" fill="#2B5BB5"/><path d="M2 41 Q12 38 24 41 T46 41" stroke="#7FB3E0" fill="none"/>'; break;
  case 'a1': s=plane(14,2); break;
  case 'a2': s=plane(18,2); break;
  case 'a3': s=plane(21,4); break;
  case 'fib': s='<path d="M8 36 Q12 20 24 18 Q36 20 40 36Z" fill="#F2EEE6" stroke="#C9C2B0"/><path d="M12 30 Q24 22 36 30 M14 26 Q24 20 34 26" stroke="#D9D2C0" fill="none"/>'; break;
  case 'sil': s='<path d="M24 6 L38 16 V32 L24 42 L10 32 V16Z" fill="#5A6472"/><path d="M24 6 L38 16 L24 24 L10 16Z" fill="#8E97A6"/><path d="M24 24 V42" stroke="#3B424E"/>'; break;
  case 'min': s='<path d="M6 38 L14 22 L22 26 L30 14 L42 30 L40 40 H8Z" fill="#7A4A3A"/><path d="M14 22 L22 26 L18 34Z M30 14 L36 26 L28 28Z" fill="#A0604A"/><circle cx="22" cy="32" r="2" fill="#C9CED6"/>'; break;
  case 'bois': s='<defs>'+g('#C99A62','#8E6232',u)+'</defs>'+[[8,30],[18,22],[28,30]].map(([x,y])=>'<rect x="'+x+'" y="'+y+'" width="16" height="8" rx="4" fill="url(#'+u+')"/><circle cx="'+(x+16)+'" cy="'+(y+4)+'" r="4" fill="#E8C49A" stroke="#8E6232"/><circle cx="'+(x+16)+'" cy="'+(y+4)+'" r="1.5" fill="none" stroke="#8E6232" stroke-width=".6"/>').join(''); break;
  default: s='<circle cx="24" cy="24" r="16" fill="#5A6472"/>';
  }
  return '<svg class="fab-pic" viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true">'+s+'</svg>'; }
let FAB_N=0;

/* ---------- icône d'un type d'usine (bâtiment détaillé, 64 × 52) ---------- */
function fabTypeSvg(t,sz){ sz=sz||56; const T=FAB_T[t], c=T.col, u='ft'+t+(++FAB_N);
  let s='<defs><linearGradient id="'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+fabSh(c,.35)+'"/><stop offset="1" stop-color="'+fabSh(c,-.3)+'"/></linearGradient><linearGradient id="'+u+'s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3A55"/><stop offset="1" stop-color="#5A7AA8"/></linearGradient></defs>'+
    '<rect width="64" height="52" rx="10" fill="url(#'+u+'s)"/><rect y="42" width="64" height="10" fill="#3B424E"/><path d="M0 42 H64" stroke="#6A7382"/>';
  const saw='<path d="M8 42 V26 L18 20 V26 L28 20 V26 L38 20 V26 L48 20 V42Z" fill="url(#'+u+')"/><path d="M18 20 V26 M28 20 V26 M38 20 V26" stroke="'+fabSh(c,-.5)+'"/>'+[12,22,32,42].map((x,i)=>'<rect class="fab-glow" style="animation-delay:'+(i*.4)+'s" x="'+x+'" y="30" width="5" height="5" fill="#FFE7A3" opacity=".85"/>').join('');
  const smoke=x=>'<g class="fab-steam"><circle cx="'+x+'" cy="8" r="3" fill="#C9CED6" opacity=".7"/><circle cx="'+(x+4)+'" cy="4" r="2.4" fill="#C9CED6" opacity=".5"/></g>';
  switch(t){
  case 'farm': s+='<path d="M0 42 Q16 36 32 40 T64 38 V52 H0Z" fill="#5B8C2A"/>'+'<g class="fab-sway">'+[...Array(6)].map((_,i)=>'<path d="M'+(36+i*5)+' 44 V36" stroke="#E5C46B" stroke-width="1.6"/><ellipse cx="'+(36+i*5)+'" cy="35" rx="1.3" ry="2.4" fill="#F2D27A"/>').join('')+'</g>'+'<path d="M8 42 V24 L18 16 L28 24 V42Z" fill="#B3402E"/><path d="M6 25 L18 14 L30 25" stroke="#7A2A1E" stroke-width="2" fill="none"/><rect x="14" y="30" width="8" height="12" fill="#F2EEDF"/><path d="M14 30 L22 42 M22 30 L14 42" stroke="#B3402E"/><rect x="32" y="20" width="7" height="22" rx="3.5" fill="#C9CED6"/><path d="M32 22 Q35.5 17 39 22" fill="#9AA3B2"/><circle class="fab-glow" cx="54" cy="12" r="7.5" fill="#F2C230" opacity=".35"/><circle cx="54" cy="12" r="5" fill="#F2C230"/><g class="fab-steam"><circle cx="35" cy="16" r="2" fill="#E8EDF4" opacity=".6"/></g>'; break;
  case 'textile': s+=saw+'<rect x="50" y="10" width="5" height="32" fill="#7A4A3A"/>'+smoke(52)+'<path class="fab-belt" d="M10 46 h44" stroke="#D7C9F2" stroke-width="2" stroke-dasharray="4 4"/>'; break;
  case 'agro': s+=saw+'<rect x="50" y="18" width="10" height="24" rx="5" fill="#E8EDF4"/><rect class="fab-glow" x="50" y="26" width="10" height="3" fill="#C4661F"/><g class="fab-steam"><circle cx="55" cy="14" r="2.2" fill="#E8EDF4" opacity=".7"/></g>'+smoke(30); break;
  case 'meuble': s+=saw+[0,1,2].map(i=>'<rect x="'+(48+i*0)+'" y="'+(34-i*4)+'" width="14" height="4" rx="2" fill="'+['#C99A62','#B07F48','#8E6232'][i]+'"/>').join('')+'<g class="fab-spin"><circle cx="55" cy="16" r="5" fill="#C9CED6"/>'+[...Array(8)].map((_,i)=>'<path d="M55 11 l1 -2 l1 2z" fill="#C9CED6" transform="rotate('+i*45+' 55 16)"/>').join('')+'<circle cx="55" cy="16" r="1.4" fill="#4C5461"/></g>'+smoke(30); break;
  case 'electronics': s+='<rect x="6" y="16" width="44" height="26" fill="#E8EDF4"/><rect x="6" y="16" width="44" height="4" fill="'+c+'"/>'+[...Array(4)].map((_,i)=>'<rect class="fab-glow" style="animation-delay:'+(i*.3)+'s" x="'+(9+i*10)+'" y="24" width="8" height="10" fill="#8FB7D8"/>').join('')+'<rect class="fab-scan" x="7" y="21" width="42" height="1.5" fill="#B98CFF" opacity=".8"/>'+'<rect x="52" y="22" width="8" height="20" fill="#C9CED6"/><g class="fab-led"><circle cx="56" cy="18" r="2" fill="#6EE7A0"/></g>'; break;
  case 'acier': s+='<path d="M4 42 V22 H30 V42Z" fill="url(#'+u+')"/><rect x="34" y="8" width="7" height="34" fill="#5A3A2E"/><rect x="45" y="14" width="7" height="28" fill="#5A3A2E"/>'+smoke(37)+smoke(48)+'<rect x="8" y="28" width="18" height="6" fill="#FF9A2E" class="fab-glow"/>'; break;
  case 'auto': s+=saw+'<g class="fab-drive"><g transform="translate(46 34)"><path d="M0 6 C0 3 2 2 4 2 L6 -1 H12 L14 2 C16 2 16 4 16 6Z" fill="#FFFFFF"/><circle cx="4" cy="7" r="1.8" fill="#1D1F23"/><circle cx="12" cy="7" r="1.8" fill="#1D1F23"/></g></g>'; break;
  case 'naval': s+='<rect y="36" width="64" height="16" fill="#1E5A7A"/><g class="fab-wave"><path d="M-16 40 Q-8 38 0 40 T16 40 T32 40 T48 40 T64 40 T80 40" stroke="#7FB3E0" fill="none"/></g><path d="M10 36 H46 L42 30 H14Z" fill="#C9CED6"/><rect x="18" y="22" width="14" height="8" fill="#E8EDF4"/><path d="M52 36 V8 H38" stroke="#F2C230" stroke-width="2.4" fill="none"/><g class="fab-swing" style="transform-origin:42px 8px"><path d="M42 8 V20" stroke="#F2C230" stroke-width="1.4"/><rect x="39" y="20" width="6" height="4" fill="#F2C230"/></g>'; break;
  case 'aero': s+='<path d="M4 42 V26 Q32 10 60 26 V42Z" fill="url(#'+u+')"/><path d="M14 42 V32 H50 V42" fill="#1E242C"/><g class="fab-fly"><g transform="translate(32 18) rotate(-12)"><path d="M-14 0 H12 Q16 0 16 2 Q16 4 12 4 H-14Z" fill="#F4F6F9"/><path d="M-2 0 L-8 -7 H-5 L4 0Z M-2 4 L-8 11 H-5 L4 4Z" fill="#D8DDE4"/><path d="M-13 0 L-15 -5 H-12 L-9 0Z" fill="#C0392B"/></g></g><rect class="fab-glow" x="20" y="38" width="3" height="3" fill="#F2C230"/><rect class="fab-glow" style="animation-delay:.5s" x="41" y="38" width="3" height="3" fill="#F2C230"/>'; break;
  }
  return '<svg class="fab-ico" viewBox="0 0 64 52" width="'+sz+'" height="'+Math.round(sz*52/64)+'" aria-hidden="true">'+s+'</svg>'; }
