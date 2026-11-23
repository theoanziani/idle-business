/* ============================================================
   GRAND LIVRE — données du jeu (V1)
   Toutes les durées sont en jours de jeu. 1 mois = 30 jours, 1 an = 360 jours.
   ============================================================ */
const D = {};

D.DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
D.DAYS_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

/* Paliers de richesse (valeur nette maximale atteinte) */
D.TIERS = [
  {n:'Artisan',       nw:0,       d:'Petites sociétés locales, livret, obligations d’État, actions défensives, box et studios.'},
  {n:'Entrepreneur',  nw:10000,   d:'Licence bancaire, sociétés de taille moyenne, actions complètes, obligations d’entreprise, appartements, lobbying.'},
  {n:'Investisseur',  nw:100000,  d:'Cryptomonnaies, bourse internationale, capital-risque, start-ups IA, usines, hypermarchés, immeubles.'},
  {n:'Magnat',        nw:1000000, d:'Industrie lourde, hôtels, parcs, énergie, data centers, haute couture, premiers biens de luxe.'},
  {n:'Tycoon',        nw:25000000,d:'Châteaux, îles privées, penthouses, œuvres d’art majeures, voitures de collection.'},
  {n:'Légende',       nw:500000000,d:'Monuments emblématiques à prix astronomiques.'},
  {n:'Souverain',     nw:10000000000,d:'Achat d’un pays entier et accès à la gouvernance.'}
];

D.ROLES = {
  ouvrier:{n:'Ouvriers / opérateurs', s:'Ouvrier'},
  cadre:{n:'Cadres', s:'Cadre'},
  manager:{n:'Managers', s:'Manager'},
  ing:{n:'Ingénieurs', s:'Ingénieur'},
  trader:{n:'Traders', s:'Trader'},
  banquier:{n:'Banquiers', s:'Banquier'},
  recruteur:{n:'Recruteurs', s:'Recruteur'}
};

D.CATS = {
  ind:{n:'Industrie et production'},
  com:{n:'Commerce et services'},
  num:{n:'Services numériques et technologiques'},
  imm:{n:'Immobilier et construction'},
  lux:{n:'Luxe, art et contenus'}
};

/* Sociétés.
   cost: coût de lancement (niveau 1) · launch: jours de mise en route · payback: jours pour amortir à pleine équipe
   c: part des coûts variables dans le chiffre d’affaires · risk: volatilité/incidents · econ: sensibilité à la conjoncture
   rate: sensibilité aux taux · open: 'always' (ouvert le week-end) ou 'closed' · wkf: poids d’un jour de week-end
   rep: sensibilité à la réputation · el: élasticité-prix · tags: lois et événements qui les touchent */
D.biz = {
  repair:{n:'Atelier de réparation', sub:'Smartphones et ordinateurs', cat:'ind', tier:0, cost:2400, launch:5, payback:38, c:.30, risk:.05, econ:.5, rate:0, open:'closed', wkf:.9, rep:.4, el:1.3,
    roles:[['ouvrier',2,40]], tags:['industry'], syn:{with:'phones', b:.08, txt:'pièces moins chères grâce à vos usines de smartphones'}},
  ecom:{n:'Boutique e-commerce', sub:'Vente en ligne généraliste', cat:'com', tier:0, cost:3200, launch:7, payback:45, c:.55, risk:.08, econ:.9, rate:0, open:'always', wkf:1.1, rep:.5, el:1.8,
    roles:[['ouvrier',1,42],['cadre',1,75]], tags:['retail']},
  agency:{n:'Agence immobilière', sub:'Gestion locative et transactions', cat:'imm', tier:1, cost:18000, launch:12, payback:85, c:.10, risk:.05, econ:.6, rate:1.2, open:'closed', wkf:.9, rep:.6, el:1.0,
    roles:[['cadre',2,80],['ouvrier',1,45]], tags:['realestate'], note:'Améliore les loyers et réduit la vacance de vos biens.'},
  staffing:{n:'Agence de recrutement', sub:'Placement de personnel selon le métier', cat:'com', tier:1, cost:15000, launch:10, payback:75, c:.06, risk:.06, econ:1.0, rate:0, open:'closed', wkf:.8, rep:.8, el:1.0,
    roles:[['recruteur',3,70],['cadre',1,85]], tags:['services'], note:'Vos frais d’agence baissent de 8 % par niveau, le vivier grandit et les profils s’améliorent.'},
  resto:{n:'Restaurant gastronomique', sub:'Table haut de gamme', cat:'com', tier:1, cost:22000, launch:15, payback:100, c:.38, risk:.12, econ:1.1, rate:0, open:'always', wkf:1.35, rep:1.0, el:.9,
    roles:[['ouvrier',3,45],['cadre',1,85],['manager',1,110]], tags:['retail']},
  farm:{n:'Ferme agroalimentaire', sub:'Production et transformation', cat:'ind', tier:1, cost:30000, launch:20, payback:120, c:.45, risk:.15, econ:.4, rate:0, open:'closed', wkf:.8, rep:.3, el:1.2,
    roles:[['ouvrier',4,44],['ing',1,120]], tags:['agri']},
  cyber:{n:'Cybersécurité et services IT', sub:'Contrats d’infogérance et audits', cat:'num', tier:1, cost:35000, launch:20, payback:100, c:.15, risk:.08, econ:.5, rate:0, open:'closed', wkf:.6, rep:.7, el:.8,
    roles:[['ing',2,140],['cadre',1,90]], tags:['tech','cyberdemand']},
  build:{n:'Société de construction', sub:'Maisons et immeubles', cat:'imm', tier:1, cost:40000, launch:15, payback:110, c:.45, risk:.10, econ:.7, rate:.8, open:'closed', wkf:.7, rep:.5, el:1.2,
    roles:[['ouvrier',4,48],['ing',1,125],['manager',1,120]], tags:['realestate'], note:'Réduit le coût et la durée de vos chantiers immobiliers.'},
  fastfood:{n:'Chaîne de fast-food', sub:'Restauration rapide', cat:'com', tier:1, cost:45000, launch:20, payback:110, c:.42, risk:.08, econ:1.0, rate:0, open:'always', wkf:1.4, rep:.6, el:1.8,
    roles:[['ouvrier',6,40],['manager',1,100]], tags:['retail']},
  textile:{n:'Usine textile', sub:'Vêtements', cat:'ind', tier:1, cost:60000, launch:22, payback:140, c:.50, risk:.10, econ:.8, rate:0, open:'closed', wkf:.7, rep:.4, el:1.4,
    roles:[['ouvrier',8,42],['ing',1,120],['manager',1,110]], tags:['industry']},
  saas:{n:'Start-up SaaS', sub:'Logiciel en abonnement', cat:'num', tier:1, cost:8000, launch:45, payback:90, c:.10, risk:.10, econ:.3, rate:1.0, open:'closed', wkf:.6, rep:.4, el:.7,
    roles:[['ing',1,140],['cadre',1,85]], tags:['tech'], startup:{ph:[['Idéation',7],['Financement',8],['Développement',18],['Lancement',12]], pS:.30, pF:.28, M:6}},
  electronics:{n:'Usine de composants électroniques', sub:'Puces, cartes, capteurs', cat:'ind', tier:2, cost:85000, launch:25, payback:160, c:.55, risk:.12, econ:.7, rate:.5, open:'closed', wkf:.6, rep:.3, el:1.2,
    roles:[['ouvrier',12,48],['ing',3,135],['manager',1,130]], tags:['industry','tech']},
  super:{n:'Supermarché / hypermarché', sub:'Grande distribution', cat:'com', tier:2, cost:120000, launch:28, payback:140, c:.72, risk:.06, econ:.8, rate:0, open:'always', wkf:1.5, rep:.5, el:2.2,
    roles:[['ouvrier',14,42],['cadre',2,85],['manager',1,120]], tags:['retail']},
  studio:{n:'Studio vidéo et plateforme de contenus', sub:'Production et diffusion', cat:'lux', tier:2, cost:120000, launch:30, payback:140, c:.30, risk:.12, econ:.6, rate:0, open:'closed', wkf:.8, rep:.9, el:.8,
    roles:[['ing',3,130],['cadre',3,90],['manager',1,130]], tags:['media'], note:'Un média influent gagne de l’influence politique chaque jour.'},
  ai:{n:'Start-up IA', sub:'Génération vidéo, analyse de données', cat:'num', tier:2, cost:60000, launch:55, payback:100, c:.15, risk:.12, econ:.4, rate:1.2, open:'closed', wkf:.6, rep:.5, el:.7,
    roles:[['ing',3,150],['cadre',1,95]], tags:['tech'], startup:{ph:[['Idéation',10],['Financement',10],['Développement',22],['Lancement',13]], pS:.22, pF:.38, M:14}},
  promo:{n:'Promotion immobilière', sub:'Projets résidentiels et commerciaux', cat:'imm', tier:2, cost:350000, launch:30, payback:200, c:.55, risk:.12, econ:.9, rate:1.8, open:'closed', wkf:.8, rep:.6, el:1.1,
    roles:[['cadre',3,90],['ing',3,130],['manager',1,140]], tags:['realestate']},
  gallery:{n:'Galerie d’art et maison d’enchères', sub:'Commissions sur ventes d’art', cat:'lux', tier:3, cost:250000, launch:30, payback:190, c:.20, risk:.12, econ:.7, rate:0, open:'closed', wkf:.9, rep:.9, el:.6,
    roles:[['cadre',3,90],['manager',1,130]], tags:['luxury'], note:'Réduit vos frais à la revente d’œuvres d’art.'},
  phones:{n:'Usine de smartphones', sub:'Assemblage grand volume', cat:'ind', tier:3, cost:400000, launch:30, payback:190, c:.62, risk:.12, econ:.9, rate:.3, open:'closed', wkf:.6, rep:.4, el:1.5,
    roles:[['ouvrier',20,50],['ing',5,140],['manager',2,140]], tags:['industry','tech'], syn:{with:'electronics', b:.12, txt:'composants fournis par votre usine électronique'}},
  couture:{n:'Maison de haute couture', sub:'Marque de luxe', cat:'lux', tier:3, cost:500000, launch:30, payback:220, c:.40, risk:.12, econ:1.4, rate:0, open:'closed', wkf:1.0, rep:1.2, el:.6,
    roles:[['ouvrier',8,52],['cadre',4,95],['manager',1,150]], tags:['luxury']},
  renew:{n:'Énergies renouvelables', sub:'Parcs solaires et éoliens', cat:'ind', tier:3, cost:600000, launch:30, payback:220, c:.25, risk:.10, econ:.3, rate:.6, open:'closed', wkf:.8, rep:.4, el:.5,
    roles:[['ing',4,150],['ouvrier',6,55],['manager',1,150]], tags:['renew']},
  dc:{n:'Data center et cloud', sub:'Hébergement et calcul', cat:'num', tier:3, cost:700000, launch:30, payback:230, c:.35, risk:.06, econ:.3, rate:0, open:'always', wkf:1.0, rep:.4, el:.8,
    roles:[['ing',6,150],['ouvrier',4,55],['manager',1,150]], tags:['tech']},
  park:{n:'Parc d’attractions', sub:'Centre de loisirs', cat:'com', tier:3, cost:900000, launch:30, payback:250, c:.40, risk:.12, econ:1.3, rate:0, open:'always', wkf:1.8, rep:.8, el:1.0,
    roles:[['ouvrier',30,40],['cadre',4,90],['manager',2,130]], tags:['retail','leisure']},
  hotel:{n:'Hôtel / resort de luxe', sub:'Hébergement haut de gamme', cat:'com', tier:3, cost:1500000, launch:30, payback:270, c:.45, risk:.08, econ:1.4, rate:.3, open:'always', wkf:1.5, rep:1.0, el:.7,
    roles:[['ouvrier',40,42],['cadre',6,95],['manager',3,140]], tags:['retail','leisure','luxury']}
};
D.bizOrder = Object.keys(D.biz).sort((a,b)=>D.biz[a].tier-D.biz[b].tier || D.biz[a].cost-D.biz[b].cost);

/* Banque */
D.BANK = {licenceCost:20000, minCapital:10000, branchCost:25000, atmCost:2500, tier:1,
  grades:['A','B','C','D','E'], pd:{A:.004,B:.012,C:.035,D:.08,E:.17}, prem:{A:0,B:1.5,C:3.5,D:6.5,E:11},
  mktCost:[0,150,400,900], mktBoost:[1,1.15,1.3,1.45]};

/* Actions (cotées Lun–Ven) */
D.stocks = [
  {id:'FOOD',n:'Gastronomia SA',sec:'conso',p:62,vol:.009,beta:.6,y:3.5,tier:0},
  {id:'ARCH',n:'Archelon Industries',sec:'indus',p:118,vol:.014,beta:1.1,y:2.8,tier:0},
  {id:'VOLT',n:'Voltara Énergie',sec:'energie',p:45,vol:.018,beta:.9,y:2.5,tier:0},
  {id:'BANQ',n:'Banque Meridian',sec:'finance',p:84,vol:.015,beta:1.2,y:3.2,tier:1},
  {id:'IMMO',n:'Foncière Lutèce',sec:'immo',p:96,vol:.013,beta:1.0,y:4.0,tier:1},
  {id:'NOVA',n:'NovaSoft',sec:'tech',p:210,vol:.024,beta:1.5,y:.4,tier:1},
  {id:'LUXE',n:'Maison Valmont',sec:'luxe',p:320,vol:.020,beta:1.3,y:1.5,tier:1},
  {id:'MEDI',n:'Medigène',sec:'sante',p:150,vol:.020,beta:.7,y:1.0,tier:1},
  {id:'TOKP',n:'Tokyo Precision',sec:'indus',p:76,vol:.016,beta:1.0,y:2.2,tier:2,intl:true},
  {id:'RHEI',n:'Rheinchemie AG',sec:'chimie',p:134,vol:.017,beta:1.0,y:3.0,tier:2,intl:true},
  {id:'PACR',n:'Pacific Rail',sec:'transport',p:58,vol:.014,beta:.8,y:3.4,tier:2,intl:true},
  {id:'ANDE',n:'Andes Mining',sec:'mines',p:38,vol:.028,beta:1.4,y:1.8,tier:2,intl:true}
];
D.SECTORS = {conso:'Consommation',indus:'Industrie',energie:'Énergie',finance:'Finance',immo:'Immobilier',tech:'Technologie',luxe:'Luxe',sante:'Santé',chimie:'Chimie',transport:'Transport',mines:'Mines'};

/* Obligations : séries renouvelées à l’échéance. term en jours, spread en points au-dessus du taux directeur */
D.bonds = [
  {key:'E90', n:'État 3 mois', term:90, spread:-.2, haz:0, tier:0, kind:'État'},
  {key:'E360', n:'État 1 an', term:360, spread:.4, haz:0, tier:0, kind:'État'},
  {key:'E1080', n:'État 3 ans', term:1080, spread:.9, haz:0, tier:1, kind:'État'},
  {key:'CA', n:'Société notée A', term:540, spread:2.2, haz:.0006, tier:1, kind:'Société'},
  {key:'CB', n:'Société notée BBB', term:360, spread:4.5, haz:.003, tier:1, kind:'Société'},
  {key:'HY', n:'Haut rendement spéculatif', term:360, spread:9, haz:.014, tier:2, kind:'Spéculatif'}
];

/* Cryptomonnaies fictives (24 h/24, 7 j/7) */
D.crypto = [
  {id:'BTR',n:'Bitor',p:42000,vol:.040,drift:.0004,tier:2},
  {id:'ETA',n:'Etherion',p:2800,vol:.050,drift:.0004,tier:2},
  {id:'SOLX',n:'Solarix',p:150,vol:.065,drift:.0004,tier:2},
  {id:'PEPO',n:'Pepito',p:0.04,vol:.110,drift:.0002,tier:2}
];

/* Immobilier existant */
D.PROP = {
  box:{n:'Box / garage', price:3800, tier:0, y:.0020, u:.0003, r:.15},
  studio:{n:'Studio', price:14000, tier:0, y:.0020, u:.0003, r:.15},
  appart:{n:'Appartement', price:55000, tier:1, y:.0020, u:.0003, r:.15},
  maison:{n:'Maison', price:120000, tier:1, y:.0019, u:.0003, r:.15},
  local:{n:'Local commercial', price:180000, tier:1, y:.0023, u:.0003, r:.18},
  bureaux:{n:'Plateau de bureaux', price:600000, tier:2, y:.0022, u:.0003, r:.16},
  immeuble:{n:'Immeuble de rapport', price:900000, tier:2, y:.0020, u:.0003, r:.14},
  presti:{n:'Résidence de prestige', price:5000000, tier:3, y:.0014, u:.0003, r:.06, pr:6},
  centre:{n:'Centre commercial', price:8000000, tier:3, y:.0022, u:.0003, r:.18}
};
/* Chantiers : maisons 5-10 j, immeubles 15-30 j */
D.BUILD = {
  maison:{n:'Pavillon', cost:28000, tier:1, d:[5,10], out:'maison', up:1.10},
  immeuble:{n:'Petit immeuble résidentiel', cost:480000, tier:2, d:[15,30], out:'immeuble', up:1.10},
  tour:{n:'Tour de bureaux', cost:2400000, tier:3, d:[18,30], out:'bureaux', up:1.10, mult:4},
  centre:{n:'Centre commercial', cost:7200000, tier:3, d:[22,30], out:'centre', up:1.10}
};

/* Luxe : kind car/art/estate/monument ; prix de marché, prestige, volatilité quotidienne, dérive, entretien/jour, frais à la revente */
D.LUX = [
  {id:'p911',n:'Porsche 911 Carrera S',kind:'car',price:160000,tier:3,pr:2,vol:.002,dr:.00005,up:.00008,spread:.12},
  {id:'rr',n:'Rolls-Royce Phantom',kind:'car',price:500000,tier:3,pr:4,vol:.002,dr:.00002,up:.00008,spread:.12},
  {id:'lamb',n:'Lamborghini Aventador SVJ',kind:'car',price:600000,tier:3,pr:5,vol:.003,dr:.0001,up:.00008,spread:.12},
  {id:'db5',n:'Aston Martin DB5 (1964)',kind:'car',price:1400000,tier:3,pr:6,vol:.004,dr:.0003,up:.00008,spread:.12},
  {id:'chiron',n:'Bugatti Chiron',kind:'car',price:3200000,tier:3,pr:8,vol:.003,dr:.0001,up:.00008,spread:.12},
  {id:'gto',n:'Ferrari 250 GTO (1962)',kind:'car',price:45000000,tier:4,pr:30,vol:.005,dr:.0004,up:.00008,spread:.12},
  {id:'gravure',n:'Gravure de maître du XVIIe',kind:'art',price:900000,tier:3,pr:3,vol:.006,dr:.0003,up:.00004,spread:.10},
  {id:'villa',n:'Villa sur la Côte d’Azur',kind:'estate',price:4500000,tier:3,pr:10,vol:.002,dr:.0002,up:.00012,spread:.08,hs:1},
  {id:'peint',n:'Étude des Nymphéas (Monet)',kind:'art',price:12000000,tier:4,pr:18,vol:.006,dr:.0004,up:.00004,spread:.10},
  {id:'penth',n:'Penthouse à Manhattan',kind:'estate',price:18000000,tier:4,pr:16,vol:.002,dr:.0002,up:.00012,spread:.08,hs:1},
  {id:'chateau',n:'Château en Val de Loire',kind:'estate',price:38000000,tier:4,pr:25,vol:.002,dr:.0002,up:.00012,spread:.08,hs:1},
  {id:'ile',n:'Île privée aux Caraïbes',kind:'estate',price:95000000,tier:4,pr:40,vol:.003,dr:.0003,up:.00012,spread:.10},
  {id:'nuit',n:'La Nuit étoilée (Van Gogh)',kind:'art',price:180000000,tier:5,pr:60,vol:.005,dr:.0004,up:.00004,spread:.10},
  {id:'joconde',n:'La Joconde (Léonard de Vinci)',kind:'art',price:900000000,tier:5,pr:120,vol:.004,dr:.0004,up:.00004,spread:.10},
  {id:'bigben',n:'Big Ben',kind:'monument',price:900000000,tier:5,pr:80,vol:.002,dr:.0002,up:.00006,spread:.25},
  {id:'liberte',n:'Statue de la Liberté',kind:'monument',price:1800000000,tier:5,pr:140,vol:.002,dr:.0002,up:.00006,spread:.25},
  {id:'eiffel',n:'Tour Eiffel',kind:'monument',price:3200000000,tier:5,pr:220,vol:.002,dr:.0002,up:.00006,spread:.25},
  {id:'colisee',n:'Colisée de Rome',kind:'monument',price:5500000000,tier:5,pr:300,vol:.002,dr:.0002,up:.00006,spread:.25},
  {id:'taj',n:'Taj Mahal',kind:'monument',price:14000000000,tier:6,pr:600,vol:.002,dr:.0002,up:.00006,spread:.25},
  {id:'pyramide',n:'Pyramides de Gizeh',kind:'monument',price:30000000000,tier:6,pr:1000,vol:.002,dr:.0002,up:.00006,spread:.25}
];
D.LUX_KIND = {car:'Voitures',art:'Œuvres d’art',estate:'Propriétés',monument:'Monuments'};

/* Pays à acheter (fictifs) */
D.COUNTRIES = [
  {id:'valmora', n:'Principauté de Valmora', price:20000000000, tier:6, gdp:9e9, pop:'210 000 habitants'},
  {id:'verdia', n:'République de Santa Verdia', price:60000000000, tier:6, gdp:26e9, pop:'4,2 millions d’habitants'},
  {id:'altameres', n:'Fédération des Altamères', price:200000000000, tier:6, gdp:85e9, pop:'31 millions d’habitants'}
];

/* Projets de loi.
   lean: +1 favorable aux sociétés, -1 favorable aux salariés/État. set: modifications de loi. pop/ten: effets sur popularité et tension. */
D.BILLS = [
  {k:'IS_UP', t:'Hausse de l’impôt sur les sociétés à 33 %', d:'Finance les services publics. Réduit les bénéfices nets de toutes vos sociétés.', lean:-.8, set:{corpTax:.33}, cond:l=>l.corpTax<.33, pop:2, ten:-3},
  {k:'IS_DOWN', t:'Baisse de l’impôt sur les sociétés à 20 %', d:'Soutient la compétitivité. Les services publics perdent des recettes.', lean:.8, set:{corpTax:.20}, cond:l=>l.corpTax>.20, pop:-3, ten:4},
  {k:'CAP_UP', t:'Taxe des revenus du capital à 30 %', d:'Alourdit dividendes, coupons, loyers et plus-values.', lean:-.7, set:{capTax:.30}, cond:l=>l.capTax<.30, pop:2, ten:-3},
  {k:'CAP_DOWN', t:'Prélèvement unique sur le capital à 12 %', d:'Allège dividendes, coupons, loyers et plus-values.', lean:.7, set:{capTax:.12}, cond:l=>l.capTax>.12, pop:-2, ten:3},
  {k:'WEALTH_ON', t:'Impôt sur la fortune de 1 % par an', d:'S’applique à la valeur nette au-delà de 1,5 M€.', lean:-.9, set:{wealthTax:.01}, cond:l=>l.wealthTax===0, pop:4, ten:-5},
  {k:'WEALTH_OFF', t:'Abrogation de l’impôt sur la fortune', d:'Supprime la taxation annuelle du patrimoine.', lean:.9, set:{wealthTax:0}, cond:l=>l.wealthTax>0, pop:-4, ten:5},
  {k:'LABOR_UP', t:'Protection renforcée des salariés', d:'Salaires +6 %, fidélité accrue, indemnités de licenciement doublées.', lean:-.6, set:{labor:1}, cond:l=>l.labor===0, pop:3, ten:-5},
  {k:'LABOR_DOWN', t:'Assouplissement du code du travail', d:'Coût du travail réduit, fidélité en baisse, tension sociale en hausse.', lean:.6, set:{labor:0}, cond:l=>l.labor===1, pop:-3, ten:6},
  {k:'MINWAGE', t:'Hausse de 10 % du salaire minimum', d:'Tous les salaires augmentent d’autant.', lean:-.5, set:{minWage:1.10}, cond:l=>l.minWage<1.2, pop:3, ten:-4},
  {k:'CRYPTO_REG', t:'Encadrement strict des cryptomonnaies', d:'Volatilité plus faible, moins de piratages, frais d’échange réduits.', lean:-.3, set:{cryptoReg:1}, cond:l=>l.cryptoReg===0, pop:1, ten:0},
  {k:'CRYPTO_FREE', t:'Libéralisation des cryptomonnaies', d:'Volatilité maximale, plus de piratages, frais plus élevés.', lean:.4, set:{cryptoReg:0}, cond:l=>l.cryptoReg===1, pop:-1, ten:1},
  {k:'RENT_CAP', t:'Encadrement des loyers', d:'Loyers -12 %, tension sociale en baisse.', lean:-.6, set:{rentCap:1}, cond:l=>l.rentCap===0, pop:3, ten:-4},
  {k:'RENT_FREE', t:'Fin de l’encadrement des loyers', d:'Loyers libres.', lean:.6, set:{rentCap:0}, cond:l=>l.rentCap===1, pop:-3, ten:4},
  {k:'BANK_TIGHT', t:'Ratios prudentiels renforcés', d:'Réserves obligatoires à 12 % des dépôts.', lean:-.4, set:{reserve:.12}, cond:l=>l.reserve<.12, pop:1, ten:-1},
  {k:'BANK_LOOSE', t:'Allègement des ratios prudentiels', d:'Réserves obligatoires à 8 % des dépôts.', lean:.5, set:{reserve:.08}, cond:l=>l.reserve>.08, pop:-1, ten:1},
  {k:'GREEN', t:'Plan de subventions aux énergies renouvelables', d:'Chiffre d’affaires des producteurs d’énergie renouvelable +25 %.', lean:-.2, set:{subRenew:1}, cond:l=>l.subRenew===0, pop:2, ten:-1},
  {k:'RD', t:'Crédit d’impôt recherche', d:'Chiffre d’affaires des sociétés technologiques +10 %.', lean:.3, set:{subTech:1}, cond:l=>l.subTech===0, pop:0, ten:0},
  {k:'LUXTAX', t:'Taxe somptuaire de 12 %', d:'Surtaxe sur tous les achats de luxe et de biens de prestige.', lean:-.7, set:{luxTax:.12}, cond:l=>l.luxTax===0, pop:3, ten:-4},
  {k:'LUXTAX_OFF', t:'Suppression de la taxe somptuaire', d:'Plus de surtaxe sur le luxe.', lean:.7, set:{luxTax:0}, cond:l=>l.luxTax>0, pop:-2, ten:3},
  {k:'TOBIN', t:'Taxe sur les transactions financières de 0,2 %', d:'Chaque ordre de bourse ou de crypto est taxé.', lean:-.5, set:{tobin:.002}, cond:l=>l.tobin===0, pop:2, ten:-2},
  {k:'TOBIN_OFF', t:'Suppression de la taxe sur les transactions', d:'Retour à des ordres sans taxe.', lean:.5, set:{tobin:0}, cond:l=>l.tobin>0, pop:-1, ten:1},
  {k:'CONSUMER', t:'Loi de protection des consommateurs', d:'Marges du commerce -3 %, réputation des enseignes en hausse.', lean:-.4, set:{consLaw:1}, cond:l=>l.consLaw===0, pop:2, ten:-2}
];
D.LAW0 = {corpTax:.25, capTax:.20, wealthTax:0, labor:0, minWage:1.0, cryptoReg:0, rentCap:0, reserve:.10, subRenew:0, subTech:0, luxTax:0, tobin:0, consLaw:0};

/* Prénoms et noms pour les candidats */
D.FN = ['Camille','Louis','Inès','Hugo','Léa','Nolan','Manon','Yanis','Chloé','Malik','Jade','Théo','Sofia','Rayan','Emma','Lucas','Anaïs','Karim','Zoé','Mathis','Clara','Omar','Lina','Paul','Nina','Samir','Eva','Adrien','Maëlle','Bastien'];
D.LN = ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Mercier','Dupont','Lambert','Bonnet','François','Martinez','Legrand'];

/* Start-ups NPC pour le capital-risque */
D.VC_NAMES = ['Lumino','Kairos Labs','Plexa','Nuage Vert','Orbitale','Hexa Santé','Quantalys','Fluxo','Pixelforge','Aqualia','Mobilis','Bioform','Cargo.io','Neurovia','Solstice','Tribune AI','Vectoria','Atelier 21','Medicalis','Zénith Pay'];
D.VC_SECT = ['Fintech','Santé','IA','Énergie','Logistique','Jeux vidéo','Robotique','Biotech','Éducation','Cybersécurité'];

/* Événements aléatoires macro et marchés */
D.EVENTS = [
  {id:'recession', p:.0022, cond:()=>S.macro.econ>.97, t:'Récession : la consommation s’effondre', sev:'bad', fx:()=>{S.macro.shock-=.10; sentImp('mkt',-.07); S.gov.pop-=4; S.gov.ten+=6;}},
  {id:'boom', p:.0022, cond:()=>S.macro.econ<1.05, t:'Reprise économique : les ménages dépensent', sev:'good', fx:()=>{S.macro.shock+=.09; sentImp('mkt',.06); S.gov.pop+=3; S.gov.ten-=4;}},
  {id:'ratehike', p:.0030, cond:()=>S.macro.rate<7, t:'La banque centrale relève ses taux de 0,8 point', sev:'warn', fx:()=>{S.macro.radd+=.8; sentImp('immo',-.04); sentImp('mkt',-.02); S.macro.house-=.02;}},
  {id:'ratecut', p:.0030, cond:()=>S.macro.rate>1.5, t:'La banque centrale baisse ses taux de 0,8 point', sev:'good', fx:()=>{S.macro.radd-=.8; sentImp('immo',.04); sentImp('mkt',.02); S.macro.house+=.02;}},
  {id:'shortage', p:.0020, t:'Pénurie de matières premières : l’industrie ralentit', sev:'bad', fx:()=>{addTagMod('industry',.9,30,'Pénurie de matières'); sentImp('indus',-.04); sentImp('mines',.06);}},
  {id:'energy', p:.0018, t:'Flambée des prix de l’énergie', sev:'warn', fx:()=>{addTagMod('renew',1.12,40,'Énergie chère'); addTagMod('industry',.95,40,'Énergie chère'); sentImp('energie',.07);}},
  {id:'techbubble', p:.0018, t:'Euphorie boursière autour de la technologie', sev:'good', fx:()=>{sentImp('tech',.10); S.sched.push({day:S.day+rint(25,45), ev:'techcrash'});}},
  {id:'luxboom', p:.0018, t:'Boom du luxe : les clientèles fortunées dépensent', sev:'good', fx:()=>{addTagMod('luxury',1.10,40,'Boom du luxe'); sentImp('luxe',.07); luxShock(.05);}},
  {id:'housing_up', p:.0018, t:'Le marché immobilier s’emballe', sev:'good', fx:()=>{S.macro.house+=.07; sentImp('immo',.05);}},
  {id:'housing_dn', p:.0018, t:'Correction brutale du marché immobilier', sev:'bad', fx:()=>{S.macro.house-=.09; sentImp('immo',-.06);}},
  {id:'bankrumor', p:.0016, t:'Rumeur de panique bancaire dans le pays', sev:'warn', fx:()=>{bankRumor();}},
  {id:'drought', p:.0016, t:'Sécheresse : les récoltes sont mauvaises', sev:'bad', fx:()=>{addTagMod('agri',.8,30,'Sécheresse'); sentImp('conso',-.02);}},
  {id:'cyberwave', p:.0018, t:'Vague mondiale de cyberattaques', sev:'warn', fx:()=>{addTagMod('cyberdemand',1.15,30,'Forte demande en cybersécurité'); sentImp('tech',-.03);}},
  {id:'strike', p:.0016, t:'Grève générale : tension sociale en hausse', sev:'bad', fx:()=>{S.gov.ten+=12; S.gov.pop-=3; addTagMod('retail',.94,10,'Grève générale');}},
  {id:'viralcom', p:.0016, t:'Les achats en ligne et les loisirs explosent', sev:'good', fx:()=>{addTagMod('retail',1.07,30,'Consommation dynamique');}},
  {id:'audit', p:.0014, cond:()=>S.day>60, t:'Contrôle fiscal : redressement', sev:'bad', fx:()=>{let amt=Math.max(200, Math.round(S.taxPaid30*0.06+S.nw*0.0004)); pay('gen','Redressement fiscal',-amt); log('bad','Redressement fiscal de '+eur(amt)+'.');}},
  {id:'cr_bull', p:.0035, t:'Crypto : un marché haussier s’installe', sev:'good', fx:()=>{sentImp('crypto',.25);}},
  {id:'cr_crash', p:.0035, t:'Crypto : krach sur les plateformes d’échange', sev:'bad', fx:()=>{sentImp('crypto',-.28);}},
  {id:'cr_hack', p:.0022, t:'Crypto : piratage d’une plateforme d’échange', sev:'bad', fx:()=>{let c=pick(S.mk.crypto); c.price*=.78; sentImp('crypto',-.08); S.mk.news=c.id;}},
  {id:'cr_adopt', p:.0022, t:'Crypto : des grandes sociétés adoptent le paiement en crypto', sev:'good', fx:()=>{sentImp('crypto',.16);}},
  {id:'cr_reg', p:.0016, t:'Crypto : annonce d’un projet de régulation', sev:'warn', fx:()=>{sentImp('crypto',-.10); S.gov.pop+=1;}}
];

