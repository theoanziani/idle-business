/* ============================================================
   GUIDE DU JEU : explication concise de toutes les activités
   ============================================================ */
function vGuide(){
  const B=D.BANK, li=a=>'<li>'+a+'</li>', ul=a=>'<ul class="gl">'+a.map(li).join('')+'</ul>';
  const sec=(t,body,open)=>'<details class="acc"'+(open?' open':'')+'><summary>'+t+'</summary>'+body+'</details>';
  const biz=Object.keys(D.CATS).map(cat=>{
    const rows=D.bizOrder.filter(i=>D.biz[i].cat===cat).map(i=>{ const d=D.biz[i];
      return '<tr><td><b>'+esc(d.n)+'</b><div class="sub">'+esc(d.sub)+'</div></td><td class="r num">'+eur(d.cost,0)+'</td><td class="r">'+d.launch+' j</td><td class="r">'+D.TIERS[d.tier].n+'</td></tr>'; }).join('');
    return '<h3>'+esc(D.CATS[cat].n)+'</h3><div class="tw"><table class="tbl"><thead><tr><th>Activité</th><th class="r">Coût</th><th class="r">Mise en route</th><th class="r">Palier</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }).join('');
  let h=head('Guide du jeu');
  h+='<div class="card">'+[
    sec('Principe',ul([
      'Chaque jour est un tour : touchez <b>Jour suivant</b> pour encaisser ventes et charges. <b>+7 jours</b> avance d’une semaine.',
      'Un compte par monnaie (euro, dollar, yuan, real). Le détail par société est dans sa fiche et dans le Livre de comptes.',
      'Après <b>Jour suivant</b>, ou <b>+7 jours</b>, un <b>rapport</b> résume la période. Vous choisissez les blocs affichés et leur ordre (bouton Organiser, ou Réglages).',
      'Le week-end, la bourse est fermée et la plupart des sociétés aussi. Les cryptomonnaies s’échangent tous les jours.',
      'Trois ressources : <b>valeur nette</b> (palier), <b>réputation</b> (clients, dépôts, recrutement) et <b>influence</b> (lois).',
      'Les arrêts automatiques signalent les événements importants.'
    ]),true),
    sec('Sociétés',ul([
      'Pour créer une société : Sociétés > une ville > un quartier > un bâtiment réel (10 à 15 par quartier). Louez-le (dépôt de 30 jours de loyer) ou achetez-le, puis établissez-y une activité compatible avec son type et sa surface.',
      'Le loyer dépend du quartier (€ à €€€€), du type de bâtiment, de sa surface et de son standing. Un grand bâtiment coûte plus cher mais permet d’agrandir la société davantage. Propriétaire, vous ne payez que 30 % du loyer (charges et taxes).',
      'Coût de lancement, mise en route, puis ouverture avec une équipe de départ à compléter.',
      'Niveaux 1 à '+MAXLVL+' : chaque agrandissement coûte 2,5 fois plus et augmente les ventes, les postes et les salaires.',
      'Pilotage : <b>politique salariale</b> (fidélité, productivité), <b>prix de vente</b> (marge ou volume), <b>marketing</b> (ventes contre coût quotidien), <b>ouverture le week-end</b> (+50 % de salaires).',
      '<b>Clients et équipe</b> : chaque société a une note en étoiles, moyenne des avis des 30 derniers jours (prix, service, qualité, adresse). Elle module les ventes, et la note moyenne de vos sociétés pèse sur votre réputation générale, affichée sur 5. Répondez aux avis ou lancez une promotion pour calmer un bad buzz. La fatigue de l’équipe baisse les ventes et la fidélité quand des postes manquent ou que le week-end est travaillé.',
      '<b>Stock</b> : les commerces, restaurants, usines et boutiques vendent leur stock. Rayons vides : ventes perdues et clients mécontents. Choisissez le stock visé (3, 7 ou 14 jours) ; la commande automatique réapprovisionne chaque jour, livraison le lendemain. À découvert, les fournisseurs suspendent les commandes.',
      '<b>Équipement</b> (4 niveaux) : plus de productivité et de capacité de stockage. <b>Horaires</b> : réduits, normaux ou étendus. <b>Formation</b> : productivité et fidélité en hausse tous les 20 jours. <b>Mutuelle</b> : fidélité, exigée en mode difficile.',
      '<b>Locaux</b> : vous payez un loyer selon le quartier. Acheter les locaux réduit le loyer de 70 % et le bien suit le marché immobilier.',
      '<b>Expulsion</b> : chaque jour où votre trésorerie est négative compte comme un loyer impayé pour vos locataires. À 10 jours, le bailleur expulse : la société ferme, le personnel est licencié et l’activité est liquidée à 40 % de sa valeur. Propriétaire de vos locaux, vous êtes protégé.',
      'Doubler une même activité réduit la rentabilité (saturation). Certaines activités s’entraident (synergies).',
      'Les lois, la conjoncture, les taux et les événements modifient les ventes. Un incident peut fermer une activité.',
      'Start-ups : le résultat (succès, modeste, échec) est tiré au lancement et révélé à la fin du développement. Un échec rend 5 % de la mise.',
      'Céder une société rapporte un prix lié à ses résultats récents.'
    ])+biz),
    sec('Villes et quartiers',ul([
      'Chaque activité se lance dans une ville et un quartier. Le quartier change la clientèle, le loyer, le prix du lancement et le risque de vol.',
      'Paris, Zagreb et Barcelone sont ouvertes dès le début. '+['miami','rio','pekin'].map(k=>D.CITIES[k].n+' dès '+eur(D.CITIES[k].unlock,0)).join(', ')+' de patrimoine total (record).',
      'Chaque ville a ses charges, ses salaires, sa fiscalité et ses risques : grèves à Paris, ouragans à Miami, séismes à Zagreb, criminalité à Rio, réglementation technologique à Pékin.',
      'Trois fêtes par ville font monter ou chuter les ventes selon le secteur (Carnaval, Noël, Fête du Printemps…). Certaines dates varient chaque année.',
      '<b>Villes secondaires</b> : chaque pays cache deux autres villes, révélées quand vous achetez sa ville principale.',
      '<b>Acheter une ville</b> : vous possédez tous les bâtiments de ses quartiers. Vos activités n’y paient plus de loyer et les concurrents vous versent les leurs ; vous réglez le niveau des loyers. Prix de quelques milliards selon la ville.',
      '<b>Acheter un pays</b> : après avoir acheté ses trois villes, au palier Souverain. Plusieurs dizaines à centaines de milliards.',
      '<b>Sécurité</b> (gardiennage, caméras, renforcée) réduit les vols. <b>Assurance</b> réduit les pertes de vol et de catastrophe. Les deux sont réglables dans la fiche de chaque société.'
    ])+D.CITY_ORDER.map(k=>'<h3>'+esc(D.CITIES[k].n)+'</h3><div class="sub">'+esc(D.CITIES[k].txt)+'</div>').join('')),
    sec('Monnaie',ul([
      'Une seule trésorerie, en euros : les ventes et les charges de toutes vos villes, en France comme à l’étranger, y passent directement.',
      'Les prix des villes étrangères sont affichés en euros. Le patrimoine total est en haut de <b>Plus</b>.'
    ])),
    sec('Construction et directeurs',ul([
      '<b>Construire</b> : sur un terrain que vous possédez, lancez un chantier (entrepôt et usine, immeuble de bureaux, villa, manoir, résidence de luxe). Coût et durée selon la surface et la ville ; une société de construction réduit les deux.',
      'Les résidences se louent (4,5 % de leur valeur par an) ou se gardent pour le prestige.',
      '<b>Directeurs</b> (Agence) : directeur général (salaires et frais fixes −4 % partout, prix et marketing ajustés chaque semaine), directeur financier (rembourse les emprunts, place l’excédent sur le livret), gestionnaire immobilier (loyers −5 %, baux vides résiliés), responsable des contrats (accepte les contrats faisables), service de livraison (livraisons plus rapides et moins chères).',
      '<b>Directeur de site</b> : chaque société a un directeur nommé avec trois compétences (gestion, vente, rigueur) sur 10, un trait (prudent, commercial ou gestionnaire), un salaire et un moral. Tous les 120 jours en poste, sa compétence la plus faible progresse. Formez-le (une fois par mois), augmentez-le ou remplacez-le. Au moral bas, il démissionne ou se fait débaucher par un rival.',
      '<b>Liens entre sociétés</b> : ferme → restaurants, fast-foods, supermarchés et hôtels (marchandises moins chères) ; énergies renouvelables → usines, data centers et entrepôts ; construction → agrandissements −10 % ; studio vidéo → e-commerce, couture et compagnie aérienne (ventes +5 %) ; compagnie aérienne → hôtels des villes desservies (+8 %) ; immeuble de bureaux → loyer offert à votre start-up SaaS de la même ville et ventes +8 % pour l’agence de recrutement. La fiche de chaque société liste ses liens actifs. Sociétés résume toutes les synergies, actives ou à débloquer.',
      '<b>Crises de groupe</b> : de temps en temps, une pénurie d’énergie, un krach du tourisme, une grève des transports ou une cyberattaque touche toutes vos sociétés d’un même type pendant quelques semaines. Une société liée l’atténue d’office (centrales, studio, service de livraison, cybersécurité) ; sinon, vous pouvez payer une parade qui réduit les effets de 60 %.',
      '<b>Délégation totale</b> : le directeur épargne une part des bénéfices (10, 25 ou 50 %) et achète lui-même : améliorations du métier, agrandissement, déménagement vers un bâtiment plus grand. « Priorité du groupe » complète un achat à moitié financé avec la trésorerie générale. S’il part, un remplaçant est recruté aussitôt.',
      '<b>Pays acheté</b> : réglez impôts et dépenses, lancez des projets nationaux (infrastructures, éducation, santé, tourisme, zone franche). Le PIB croît chaque jour, et la valeur du pays avec lui.'
    ])),
    sec('Concurrence',ul([
      'Six rivaux IA, chacun avec ses secteurs, ses villes, sa puissance et son agressivité. Plus ils sont présents sur votre marché (ville et secteur), plus vos ventes baissent. Ils grandissent, s’implantent près de vous et reculent.',
      '<b>Guerre des prix</b> : un rival casse les prix pendant 10 à 25 jours. Répondez dans Rivaux : subir, aligner vos prix (−10 %) ou lancer une campagne.',
      '<b>Offres de rachat</b> : un rival propose parfois un prix supérieur à la cession ordinaire. Vous acceptez ou refusez.',
      '<b>Rachats</b> : les rivaux cèdent des commerces. Vous les rachetez, ils ouvrent aussitôt et le rival perd du terrain.',
      '<b>Débauchage</b> : des rivaux débauchent vos employés si les salaires et la fidélité sont bas. Un service RH réduit ce risque. Vous pouvez aussi recruter les talents des rivaux contre une prime.'
    ])),
    sec('Équipes et recrutement',ul([
      'Chaque poste a une <b>productivité</b>, une <b>fiabilité</b> et une <b>fidélité</b>. Un salaire généreux fidélise, un salaire faible fait démissionner.',
      'Les managers multiplient l’efficacité de l’équipe. Un effectif incomplet réduit les ventes.',
      'Licencier coûte des indemnités et baisse la réputation.',
      '<b>Agence de recrutement</b> : vivier commun à toutes vos sociétés, renouvelé chaque jour. Frais d’agence à chaque embauche. Quatre niveaux (intérim, cabinet, chasseur de têtes, élite) : vivier plus large, meilleurs profils, frais plus élevés. Recherche ciblée dès le cabinet.',
      '<b>Service RH</b> (3 niveaux) : pourvoit seul, chaque jour, tous les postes vacants dès qu’un candidat de l’agence respecte vos critères minimaux (le lundi, il complète avec des profils moyens s’ils respectent aussi ces critères), améliore la fidélité et limite la fatigue, contre un coût quotidien.',
      'L’activité <b>Agence de recrutement</b> (palier Entrepreneur) réduit vos frais d’agence de 8 % par niveau, agrandit le vivier et améliore les profils.'
    ])),
    sec('Banque',ul([
      'Licence dès le palier Entrepreneur : '+eur(B.licenceCost,0)+' et au moins '+eur(B.minCapital,0)+' de fonds propres.',
      'Dépôts : vous fixez le taux. Plus d’agences, de distributeurs, de marketing, de réputation et de personnel attirent plus de dépôts.',
      'Crédits : vous fixez le taux des prêts. Les dossiers (note A à E) arrivent les jours ouvrés. Une note faible rapporte plus mais fait défaut plus souvent.',
      'Réserves obligatoires de 8 à 12 % des dépôts selon la loi. Fonds propres d’au moins 5 % des prêts.',
      'Surplus de réserve : placez-le en obligations, actions ou crypto depuis Marchés.',
      'Risques : défauts, baisse des cours, manque de liquidités et panique des déposants. La banque centrale prête en dernier recours. Une banque en faillite fait perdre sa licence.'
    ])),
    sec('Marchés',ul([
      '<b>Livret</b> : sans risque, intérêts imposés comme revenus du capital.',
      '<b>Obligations</b> : coupon quotidien, prix en baisse quand les taux montent, défaut possible pour les émetteurs fragiles.',
      '<b>Actions</b> : dividendes mensuels, cours liés à la conjoncture et aux secteurs. Ordres du lundi au vendredi.',
      '<b>Cryptomonnaies</b> : ouvertes 7 j/7, très volatiles (krachs, piratages, régulation).',
      '<b>Capital-risque</b> : offres de start-ups avec ticket minimum, jusqu’à quatre tours, dilution et risque de faillite.',
      '<b>Crédit</b> : empruntez jusqu’à 60 % de vos actifs, au taux directeur plus une prime.',
      'Chaque ordre a des frais, et une taxe sur les transactions si la loi existe.',
      '<b>Fiche d’un actif</b> : touchez son nom pour voir le cours sur 90 jours, 180 jours ou un an et la fourchette sur 52 semaines.',
      '<b>Ordres automatiques</b> : achat limite, vente limite ou stop-loss, exécutés dès que le cours atteint le seuil (90 jours).',
      '<b>Introductions en bourse</b> : une start-up financée qui réussit sa sortie peut entrer en bourse ; vos parts deviennent des actions cotées.',
      '<b>Épargne automatique</b> : 10, 25 ou 50 % du bénéfice quotidien de vos sociétés vont sur le livret.'
    ])),
    sec('Immobilier',ul([
      'Achat avec 7 % de frais. Les loyers tombent chaque jour, moins l’entretien et les taxes.',
      'Rénover améliore l’état du bien (+10 %). Revendre coûte 4 %.',
      'Construire : le chantier dure plusieurs jours puis livre un bien neuf. Une société de construction accélère et réduit le coût.',
      'Les prix suivent le marché immobilier et les taux.'
    ])),
    sec('Luxe et pays',ul([
      'Voitures, art, propriétés, yachts, monuments : peu de rendement, du <b>prestige</b> et de l’influence. Les marchés du luxe peuvent chuter puis remonter peu à peu.',
      '<b>Location</b> : propriétés (4 % par an) et yachts en charter (9 % par an, usure) rapportent un loyer, mais leur prestige est divisé par deux.',
      '<b>Salle des ventes</b> : enchères chaque semaine contre des collectionneurs IA (objets courants, rares ou pièces uniques), lots mystères, revente de votre collection (commission de 10 %).',
      'Achat avec marge et éventuelle taxe somptuaire, revente avec des frais élevés. Une galerie réduit les frais sur l’art.',
      'Palier Souverain : achetez un pays dont vous possédez les trois villes. Vous fixez l’impôt et les dépenses publiques et pouvez décréter des lois. Sous 20 de satisfaction pendant 15 jours, c’est le coup d’État.'
    ])),
    sec('Politique',ul([
      'Tous les 30 jours, trois projets de loi sont proposés. Le vote a lieu 15 jours plus tard.',
      '<b>Lobbying</b> pour ou contre un projet, <b>dons</b> aux partis : ils coûtent de l’argent, donnent de l’influence et augmentent la suspicion.',
      'Au-delà de 30 de suspicion, un scandale devient possible (amende, réputation en baisse).',
      'Popularité et tension sociale : une tension élevée provoque des grèves.',
      'Les lois touchent les impôts, le travail, les loyers, la banque, la crypto, le luxe et les subventions.',
      '<b>Élection du gouverneur</b> tous les 180 jours : trois candidats avec leur programme. Financez celui de votre choix ; s’il gagne grâce à vous, les contrôles fiscaux se font rares pendant son mandat.',
      '<b>Compte offshore</b> (palier Investisseur) : impôt sur les sociétés réduit de 35 %, financement discret des campagnes. Une enquête peut tomber à chaque échéance fiscale : amende, saisie et 30 jours de prison pendant lesquels vous ne décidez plus rien.'
    ])),
    sec('Impôts et faillite',ul([
      'Tous les 30 jours : impôt sur les sociétés (25 %), taxe sur les revenus du capital et plus-values (20 %, plus légère que l’impôt sur les sociétés) et, si la loi existe, impôt sur la fortune. Les pertes sont reportées.',
      'Les frais de personnel, d’entretien et de luxe augmentent avec votre palier.',
      'Compte à découvert 14 jours d’affilée : faillite et fin de la partie.'
    ])),
    sec('Paliers',ul(D.TIERS.map(t=>'<b>'+t.n+'</b> ('+eur(t.nw,0)+') : '+t.d))),
    sec('Concurrence',ul([
      'Les rivaux occupent de vrais bâtiments (leurs enseignes) : vous les voyez dans chaque quartier et ne pouvez pas les louer.',
      '<b>Offre de rachat</b> : proposez de 80 à 125 % de la valeur estimée. Au-dessus de son prix, le rival vend ; un peu en dessous, il fait une contre-offre valable 5 jours ; trop bas, il refuse de négocier 10 jours. L’enseigne rachetée ouvre aussitôt chez vous.',
      '<b>OPA</b> (palier Tycoon) : quand un groupe est affaibli (puissance sous 0,80), rachetez-le entier ; ses enseignes dans vos villes deviennent les vôtres et il disparaît.',
      '<b>Classement des magnats</b> dans Rivaux : valeur nette estimée et bénéfice quotidien de chaque groupe.'
    ])),
    sec('Usines',ul([
      'Les usines se créent dans Plus > Usines : 9 types (ferme, textile, agroalimentaire, mobilier, électronique, aciérie, automobile, chantier naval, aéronautique). Chaque site a des places de ligne selon la surface du terrain ; un hall en ajoute deux.',
      '<b>Plan d’une ligne</b> : une grille de 8 × 10 cases. Le convoyeur principal relie le quai d’arrivée au quai d’expédition ; les machines qui le longent travaillent, dans l’ordre des étapes. La ligne produit au rythme de son étape la plus lente (le goulot), en exemplaires par jour.',
      'Un convoyeur long ou sinueux ralentit la ligne ; les stocks tampons évitent les arrêts ; le contrôle qualité vend 8 % plus cher ; l’atelier de maintenance divise les pannes par trois.',
      '<b>Matières</b> : prises d’abord dans vos usines (acier, tôles, puces, tissus, récoltes), sinon achetées au marché. <b>Débouchés</b> : vos sociétés clientes d’abord, puis le marché de gros (ou le stock).',
      '<b>Coûts</b> : ouvriers et énergie selon la ville ; ferme : parcelles de cultures et d’élevage, puis lignes de transformation (farine, fromages, vin).'
    ])),
    sec('Modes et gérant',ul([
      '<b>Défi des 100 jours</b> (au choix à la création) : faites le plus gros bénéfice en 100 jours face à trois magnats IA ; classement sur l’accueil.',
      '<b>Gérant hors ligne</b> (Agence) : à votre retour, il fait tourner vos sociétés, un jour par heure d’absence, 14 jours au plus. Vous décidez d’encaisser ces jours ou non.'
    ])),
    sec('Sauvegardes',ul([
      'Cinq emplacements enregistrés sur l’appareil, sauvegardés après chaque jour.',
      'Barre du bas : Réglages > Barre du bas > Personnaliser permet d’ajouter, retirer, ordonner et changer de côté jusqu’à quatre raccourcis.',
      'Menu principal : Continuer ou Parcourir les sauvegardes. Un code de sauvegarde permet de changer d’appareil.'
    ]))
  ].join('')+'</div>';
  return h;
}

