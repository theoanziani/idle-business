/* ============================================================
   BÂTIMENTS : 10 à 15 adresses réelles par quartier, à louer ou acheter, puis à occuper par une activité
   ============================================================ */
D.BT = {
  shop:  {n:'Boutique en rez-de-chaussée', s:[40,140],      rk:1.35, retail:1},
  local: {n:'Local commercial',            s:[150,450],     rk:1.15, retail:1},
  office:{n:'Plateau de bureaux',          s:[150,1200],    rk:.85},
  tower: {n:'Immeuble de bureaux',         s:[3000,15000],  rk:.55},
  mall:  {n:'Grande surface commerciale',  s:[2500,9000],   rk:.45, retail:1},
  hotel: {n:'Immeuble hôtelier',           s:[3000,12000],  rk:.6,  retail:1},
  depot: {n:'Entrepôt et atelier',         s:[1000,8000],   rk:.3},
  land:  {n:'Terrain constructible',       s:[8000,60000],  rk:.03}
};
/* Types de bâtiment compatibles et surface nécessaire au niveau 1 (×1,35 par niveau) */
D.DEFB = {
  repair:{t:['shop','local','mall','depot'],s:40}, ecom:{t:['office','depot','shop','local'],s:60}, agency:{t:['shop','office','local'],s:60}, staffing:{t:['office','shop','local','tower'],s:100},
  resto:{t:['local','shop','mall'],s:150}, farm:{t:['land'],s:8000}, cyber:{t:['office','tower'],s:200}, build:{t:['depot','office','land','tower'],s:300}, fastfood:{t:['local','shop'],s:120},
  textile:{t:['depot'],s:1500}, saas:{t:['office','shop','local','tower'],s:40}, electronics:{t:['depot','land'],s:2500}, super:{t:['mall'],s:2500}, studio:{t:['office','depot','land','tower'],s:600},
  ai:{t:['office','tower'],s:150}, warehouse:{t:['depot','land'],s:2000}, promo:{t:['office','tower'],s:300}, gallery:{t:['local','shop','depot','mall'],s:200},
  phones:{t:['depot','land'],s:5000}, couture:{t:['local','shop','office','depot','mall'],s:250}, renew:{t:['land'],s:20000}, dc:{t:['depot','land','tower'],s:3000},
  dealer:{t:['mall','depot'],s:2500}, park:{t:['land'],s:30000}, office:{t:['tower'],s:3000}, hotel:{t:['hotel'],s:3000}, shipping:{t:['land','depot'],s:6000}
};
/* Vraies rues par quartier */
D.STREETS = {
  champs:['avenue des Champs-Élysées','avenue Montaigne','rue du Faubourg-Saint-Honoré','avenue George-V','rue de Marignan','avenue Marceau','rue de Berri'],
  marais:['rue des Francs-Bourgeois','rue Vieille-du-Temple','rue de Turenne','rue des Rosiers','rue de Bretagne','rue du Temple','rue Charlot'],
  defense:['parvis de La Défense','esplanade du Général-de-Gaulle','cours Michelet','place de la Défense','avenue de la Division-Leclerc','boulevard Circulaire'],
  montmartre:['rue Lepic','rue des Abbesses','rue Caulaincourt','boulevard de Clichy','rue du Mont-Cenis','rue Custine','rue Ordener'],
  belleville:['rue de Belleville','boulevard de Belleville','rue Oberkampf','rue des Pyrénées','rue de Ménilmontant','rue Jean-Pierre-Timbaud','rue de la Villette'],
  gornji:['Tkalčićeva ulica','Radićeva ulica','Markov trg','Opatička ulica','Mesnička ulica'],
  donji:['Ilica','Trg bana Jelačića','Praška ulica','Masarykova ulica','Teslina ulica','Bogovićeva ulica'],
  tresnjevka:['Ozaljska ulica','Selska cesta','Nova cesta','Trešnjevački trg','Zagrebačka cesta'],
  novi:['Avenija Dubrovnik','Avenija Većeslava Holjevca','Sarajevska cesta'],
  jarun:['Jarunska ulica','Aleja Matije Ljubeka','Horvaćanska cesta'],
  eixample:['Passeig de Gràcia','Rambla de Catalunya','Carrer d’Aragó','Carrer de Mallorca','Carrer de Provença','Gran Via de les Corts Catalanes','Carrer del Consell de Cent'],
  gracia:['Carrer Gran de Gràcia','Carrer de Verdi','Travessera de Gràcia','Plaça del Sol','Carrer de Torrijos'],
  born:['Passeig del Born','Carrer de la Princesa','Via Laietana','Carrer de Montcada','La Rambla','Carrer de Ferran'],
  poblenou:['Rambla del Poblenou','Carrer de Pere IV','Avinguda Diagonal','Carrer de Llull','Carrer de Badajoz'],
  barceloneta:['Passeig de Joan de Borbó','Passeig Marítim','Carrer de la Maquinista','Carrer de l’Almirall Aixada'],
  southbeach:['Ocean Drive','Collins Avenue','Washington Avenue','Lincoln Road','Española Way'],
  brickell:['Brickell Avenue','South Miami Avenue','SW 8th Street','SE 1st Avenue'],
  wynwood:['NW 2nd Avenue','NW 25th Street','North Miami Avenue','NW 29th Street'],
  coral:['Miracle Mile','Ponce de Leon Boulevard','Giralda Avenue','Alhambra Circle'],
  littlehavana:['Calle Ocho (SW 8th Street)','SW 17th Avenue','West Flagler Street','SW 12th Avenue'],
  ipanema:['Rua Visconde de Pirajá','Avenida Vieira Souto','Rua Garcia d’Ávila','Avenida Ataulfo de Paiva','Rua Dias Ferreira'],
  copa:['Avenida Atlântica','Avenida Nossa Senhora de Copacabana','Rua Barata Ribeiro','Rua Santa Clara'],
  barra:['Avenida das Américas','Avenida Lúcio Costa','Avenida Ayrton Senna','Avenida Olegário Maciel'],
  lapa:['Rua do Lavradio','Avenida Mem de Sá','Rua Joaquim Silva','Rua Riachuelo'],
  centro:['Avenida Rio Branco','Avenida Presidente Vargas','Rua do Ouvidor','Rua da Assembleia','Rua Primeiro de Março'],
  zhong:['Zhongguancun Street','Haidian Street','Suzhou Street','Danling Street','Chengfu Road'],
  cbd:['Jianguomen Outer Street','Guanghua Road','East Third Ring Road','Jintong West Road'],
  sanlitun:['Sanlitun Road','Gongti North Road','Dongdaqiao Road','Xindong Road'],
  wang:['Wangfujing Street','Dong’anmen Street','Jinyu Hutong','Dengshikou Street'],
  fin:['Financial Street','Fuchengmen Inner Street','Taipingqiao Street','Fuxingmen Inner Street'],
  capitole:['rue d’Alsace-Lorraine','rue Saint-Rome','place du Capitole','rue des Filatiers','rue de Metz','rue Croix-Baragnon'],
  cyprien:['rue de la République','allées Charles-de-Fitte','place Saint-Cyprien','avenue Étienne-Billières'],
  aero:['avenue Didier-Daurat','avenue Jean-Monnet','rond-point Maurice-Bellonte','avenue Escadrille-Normandie-Niemen'],
  vieuxport:['quai du Port','quai de Rive-Neuve','La Canebière','rue de la République','rue Caisserie','rue Sainte'],
  euromed:['boulevard de Dunkerque','quai d’Arenc','rue de Ruffi','boulevard du Littoral','place de la Joliette'],
  prado:['avenue du Prado','rue de Rome','place Castellane','boulevard Périer','rue Paradis'],
  midtown:['Fifth Avenue','Madison Avenue','West 57th Street','Broadway','Avenue of the Americas','Lexington Avenue'],
  fidi:['Wall Street','Broad Street','Water Street','Maiden Lane','Pearl Street'],
  brooklyn:['Bedford Avenue','Wythe Avenue','North 6th Street','Kent Avenue','Metropolitan Avenue'],
  beverly:['Rodeo Drive','Wilshire Boulevard','North Canon Drive','South Beverly Drive','Little Santa Monica Boulevard'],
  hollywood:['Hollywood Boulevard','Sunset Boulevard','Vine Street','Highland Avenue','Cahuenga Boulevard'],
  dtla:['South Grand Avenue','Figueroa Street','Spring Street','Broadway','Flower Street'],
  lujiazui:['Century Avenue','Lujiazui Ring Road','Yincheng Road','Dongfang Road'],
  xintiandi:['Huaihai Middle Road','Taicang Road','Madang Road','Fuxing Middle Road','Xingye Road'],
  zhangjiang:['Zuchongzhi Road','Keyuan Road','Zhangheng Road','Chenhui Road'],
  nanshan:['Shennan Boulevard','Keyuan Road','Gaoxin South Road','Houhai Boulevard'],
  futian:['Fuhua Road','Yitian Road','Shennan Middle Road','Jintian Road'],
  huaqiangbei:['Huaqiang North Road','Zhenhua Road','Hongli Road','Zhonghang Road'],
  palace:['Marmontova ulica','Narodni trg','Dioklecijanova ulica','Obala Hrvatskog narodnog preporoda'],
  bacvice:['Put Firula','Šetalište Petra Preradovića','Uvala Bačvice'],
  znjan:['Put Žnjana','Ulica Hrvatske bratske zajednice','Poljička cesta'],
  oldtown:['Stradun (Placa)','Ulica od Puča','Prijeko','Široka ulica'],
  lapad:['Šetalište kralja Zvonimira','Ulica kralja Tomislava','Masarykov put'],
  gruz:['Obala pape Ivana Pavla II','Ulica Ante Starčevića','Gruška obala'],
  salamanca:['Calle de Serrano','Calle de Velázquez','Calle de Goya','Calle de Ortega y Gasset','Calle de Claudio Coello'],
  centro2:['Gran Vía','Puerta del Sol','Calle de Preciados','Calle Mayor','Calle de Fuencarral','Calle de Alcalá'],
  azca:['Paseo de la Castellana','Calle de Raimundo Fernández Villaverde','Avenida del General Perón','Calle de Orense'],
  santacruz:['Calle Sierpes','Avenida de la Constitución','Calle Tetuán','Calle Mateos Gago','Plaza Nueva'],
  triana:['Calle Betis','Calle San Jacinto','Calle Pagés del Corro','Calle Castilla'],
  nervion:['Avenida Luis de Morales','Avenida de Eduardo Dato','Calle Luis Montoto','Avenida de la Buhaira'],
  jardins:['Rua Oscar Freire','Alameda Lorena','Rua Augusta','Rua Haddock Lobo','Alameda Santos'],
  itaim:['Avenida Brigadeiro Faria Lima','Rua Joaquim Floriano','Avenida Juscelino Kubitschek','Rua Tabapuã'],
  pinheiros:['Rua dos Pinheiros','Rua Aspicuelta','Rua Fradique Coutinho','Rua Teodoro Sampaio','Avenida Rebouças'],
  pelourinho:['Largo do Pelourinho','Rua Gregório de Matos','Terreiro de Jesus','Rua Chile'],
  barra2:['Avenida Oceânica','Avenida Sete de Setembro','Rua Marquês de Leão'],
  pituba:['Avenida Paulo VI','Avenida Manoel Dias da Silva','Rua das Hortênsias']
};
/* La rue « centro » de Madrid partage l'identifiant avec celui de Rio : clé propre à la ville */
const streetsOf = (cid,did) => D.STREETS[(cid==='madrid'&&did==='centro')?'centro2':did] || ['rue principale'];

/* Hasard déterministe : un quartier a toujours les mêmes bâtiments */
function hrng(str){ let h=1779033703^str.length; for(let i=0;i<str.length;i++){ h=Math.imul(h^str.charCodeAt(i),3432918353); h=h<<13|h>>>19; } return ()=>{ h=Math.imul(h^h>>>16,2246822507); h=Math.imul(h^h>>>13,3266489909); h^=h>>>16; return (h>>>0)/4294967296; }; }
const BCACHE={};
function bldList(cid,did){ const L=bldListBase(cid,did), M=S&&S.bldMod; return M? L.map(b=>M[b.id]? Object.assign({},b,M[b.id]) : b) : L; }
function bldListBase(cid,did){
  const key=cid+'.'+did; if(BCACHE[key]) return BCACHE[key];
  const C=D.CITIES[cid], dd=C.d.find(x=>x.id===did), R=hrng(key), st=streetsOf(cid,did), f=dd.fav;
  const w={shop:2.5,local:2,office:2.5,tower:.4,mall:.4,hotel:.3,depot:.4,land:.15};
  const add=(k,v)=>{ w[k]+=v; };
  if(f.includes('restauration')) add('local',1.5); if(f.includes('commerce')){ add('shop',1.5); add('mall',.7); } if(f.includes('luxe')){ add('shop',1); add('local',.5); }
  if(f.includes('hotel')) add('hotel',1.2); if(['bureaux','tech','immo','media'].some(x=>f.includes(x))){ add('office',1.5); add('tower',.8); }
  if(['industrie','agri','online'].some(x=>f.includes(x))){ add('depot',1.6); add('land',.7); } if(f.includes('loisirs')){ add('local',1); add('land',.4); }
  const n=10+Math.floor(R()*6), types=['shop','local','office'];
  while(types.length<n){ let t=R()*Object.values(w).reduce((a,x)=>a+x,0); for(const k in w){ t-=w[k]; if(t<=0){ types.push(k); break; } } if(t>0) types.push('office'); }
  const used={};
  const out=types.map((t,i)=>{
    const T=D.BT[t], sname=st[Math.floor(R()*st.length)];
    let num; do{ num=1+Math.floor(R()*(t==='land'||t==='tower'?60:140)); } while(used[sname+num]); used[sname+num]=1;
    const surf=Math.round((T.s[0]+(T.s[1]-T.s[0])*Math.pow(R(),1.6))/10)*10;
    const q=Math.round((0.8+0.45*R())*100)/100;
    return {id:key+'.'+i, city:cid, dist:did, t, surf, q, addr:(cid==='paris'||C.country==='France'? num+' '+sname : sname+' '+num)};
  }).sort((a,b)=>D.BT[a.t].rk-D.BT[b.t].rk||a.surf-b.surf);
  out.forEach((b,i)=>{ b.id=key+'.'+i; });
  { const R2=hrng(key+'+terrain'), T=D.BT.land, sname=st[Math.floor(R2()*st.length)], num=61+Math.floor(R2()*80);
    out.push({id:key+'.'+out.length, city:cid, dist:did, t:'land', surf:Math.round((T.s[0]+(T.s[1]-T.s[0])*Math.pow(R2(),1.4))/10)*10, q:Math.round((0.85+0.3*R2())*100)/100, addr:(cid==='paris'||C.country==='France'? num+' '+sname : sname+' '+num), extra:1}); }
  return BCACHE[key]=out;
}
function bldById(id){ const p=id.split('.'); if(p.length<3) return null; const C=D.CITIES[p[0]]; if(!C||!C.d.some(x=>x.id===p[1])) return null; return bldList(p[0],p[1])[+p[2]]||null; }
const distOfB = bd => D.CITIES[bd.city].d.find(x=>x.id===bd.dist);
/* Prix réaliste (surface × prix du m² du quartier × type × standing) et loyer annuel de 3,5 % du prix */
function bldPrice(bd){ const C=D.CITIES[bd.city]; return bd.surf*distOfB(bd).p*fxOf(C.ccy)*D.BT[bd.t].rk*bd.q; }
const BYIELD=0.035;
function bldRentBase(bd){ return bldPrice(bd)*BYIELD/360; }
function bldRent(bd){ return bldRentBase(bd)*progMult()*(lawsAt(bd.city).rentCap?.88:1)*(S.mgr&&S.mgr.prop?.95:1); }
const bldHeld = id => S.bld&&S.bld[id];
function bldValue(id){ const h=bldHeld(id); return h&&h.st==='own'? h.cost*S.macro.house/h.h0 : 0; }
const rentLevel = p => p<3500?1:p<6500?2:p<10500?3:4;   // p en euros par m²
/* Activités possibles dans un bâtiment et niveau maximal selon la surface */
/* niveau 4 au moins dans tout bâtiment compatible (dès la moitié de la surface de base) */
function bldMaxLvl(bd,def){ const n=D.DEFB[def]; if(!n||!n.t.includes(bd.t)||bd.surf<n.s*.5) return 0; return Math.min(MAXLVL,Math.max(4,1+Math.floor(Math.log(bd.surf/n.s)/Math.log(1.35)))); }
function bldDefs(bd){ return D.bizOrder.filter(def=>bldMaxLvl(bd,def)>0); }
const bldSales = b => { if(!b.bld) return 1; const bd=bldById(b.bld); return bd&&D.BT[bd.t].retail? 1+0.5*(bd.q-1) : 1; };

function rentBuilding(id){
  const bd=bldById(id); if(!bd) return err('Bâtiment inconnu.');
  if(!cityUnlocked(bd.city)) return err('Ville verrouillée.');
  if(bldHeld(id)) return err('Vous occupez déjà ce bâtiment.');
  { const o=rivShopAt(id); if(o) return err('Occupé par '+rivDef(o.rid).n+' : faites une offre de rachat.'); }
  const dep=cityOwned(bd.city)? 0 : bldRent(bd)*30; if(availFor(D.CITIES[bd.city].ccy)<dep) return err('Trésorerie insuffisante : '+eur(dep,0)+' de dépôt de garantie.');
  if(!S.bld) S.bld={};
  payCap('c:'+bd.city,'Dépôt de garantie : '+bd.addr,-dep); settleAccounts();
  S.bld[id]={st:'rent',dep,biz:null,since:S.day};
  if(cityOwned(bd.city)){ log('info','Vous vous installez dans '+bd.addr+' ('+D.CITIES[bd.city].n+') : la ville vous appartient, aucun loyer.'); return ok('Bâtiment attribué : la ville vous appartient.'); }
  log('info','Bail signé : '+D.BT[bd.t].n.toLowerCase()+' de '+fmtN(bd.surf)+' m², '+bd.addr+' ('+D.CITIES[bd.city].n+'), '+eur(bldRent(bd),0)+' par jour.');
  return ok('Bâtiment loué.');
}
function buyBuilding(id){
  const bd=bldById(id); if(!bd) return err('Bâtiment inconnu.');
  if(!cityUnlocked(bd.city)) return err('Ville verrouillée.');
  const h=bldHeld(id); if(h&&h.st==='own') return err('Ce bâtiment est déjà à vous.');
  { const o=rivShopAt(id); if(o) return err('Occupé par '+rivDef(o.rid).n+' : faites une offre de rachat.'); }
  const p=bldPrice(bd); if(availFor(D.CITIES[bd.city].ccy)<p) return err('Trésorerie insuffisante : '+eur(p,0)+' requis.');
  if(!S.bld) S.bld={};
  payCap('c:'+bd.city,'Achat : '+bd.addr,-p);
  if(h&&h.dep) payCap('c:'+bd.city,'Restitution du dépôt de garantie',h.dep);
  settleAccounts();
  S.bld[id]={st:'own',cost:p,h0:S.macro.house,biz:h?h.biz:null,since:S.day};
  log('good','Vous achetez '+bd.addr+' ('+D.CITIES[bd.city].n+') pour '+eur(p,0)+'.');
  return ok();
}
function leaveBuilding(id){
  const h=bldHeld(id), bd=bldById(id); if(!h) return err('Vous n’occupez pas ce bâtiment.');
  if(h.biz&&S.biz.some(b=>b.id===h.biz)) return err('Une société occupe ce bâtiment : cédez-la d’abord.');
  if(h.st==='own'){ const v=bldValue(id)*0.95; payCap('c:'+bd.city,'Vente : '+bd.addr,v); delete S.bld[id]; return ok('Bâtiment vendu '+eur(v,0)+'.'); }
  if(h.dep) payCap('c:'+bd.city,'Restitution du dépôt de garantie',h.dep);
  delete S.bld[id]; return ok(cityOwned(bd.city)? 'Bâtiment libéré.' : 'Bail résilié.');
}
/* Libère le bâtiment quand la société disparaît ; un bail se termine avec l'expulsion */
function bldRelease(b,evicted){
  if(!b.bld||!S.bld||!S.bld[b.bld]) return; const h=S.bld[b.bld]; h.biz=null;
  if(evicted&&h.st==='rent') delete S.bld[b.bld];
}
/* Loyer des bâtiments loués sans activité */
function bldStep(){
  if(!S.bld) return;
  Object.keys(S.bld).forEach(id=>{ const h=S.bld[id], bd=bldById(id); if(!bd){ delete S.bld[id]; return; }
    if(h.st!=='rent'||(h.biz&&S.biz.some(b=>b.id===h.biz))) return;
    if(cityOwned(bd.city)) return;
    pay('c:'+bd.city,'Loyer (local vide) : '+bd.addr,-bldRent(bd));
    if(S.cash<0&&S.negDays>=EVICT_DAYS){ delete S.bld[id]; log('crit','Bail résilié pour loyers impayés : '+bd.addr+'. Le dépôt de garantie est perdu.'); }
  });
}
function bldNW(){ let t=0; if(S.bld) Object.keys(S.bld).forEach(id=>{ const h=S.bld[id]; t+=bldValue(id)+(h.st==='rent'?h.dep||0:0); }); return t; }

/* Calibrage : dans un bâtiment standard d'un quartier moyen de Paris, chaque activité rapporte sa cible */
D.CAL={saas:1.12,ai:1.05,repair:1.227,ecom:1.261,staffing:1.279,agency:1.12,resto:1.189,farm:1.524,cyber:1.399,build:1.269,fastfood:1.079,textile:1.366,electronics:1.145,super:1.154,studio:1.44,warehouse:1.139,promo:1.018,gallery:.986,phones:.999,couture:.888,renew:.965,dc:1.03,dealer:.541,park:.936,office:1.651,hotel:1.356,shipping:.968};

