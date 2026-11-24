# Jarvis — Cahier des charges

## 1. Vision et périmètre

Assistant personnel vocal et gestuel, inspiré du J.A.R.V.I.S. de Tony Stark, tournant en local sur le PC Windows de l'utilisateur.

| Version | Contenu |
|---|---|
| **V1 — Noyau vocal** | « Hey Jarvis », transcription, cerveau local, voix, actions PC, mémoire, confirmations |
| **V2 — HUD** | Fenêtre plein écran (écran 20"), panneaux modulables, réacteur 3D, effets sonores |
| **V3 — Gestes** | Webcam + MediaPipe : manipulation des panneaux et souris Windows |
| **V4 — Maison** | Télé TCL (Google TV), domotique (Home Assistant), point quotidien, parole spontanée |

Utilisateur unique au départ ; l'architecture n'empêche pas le multi-utilisateur plus tard.

## 2. Architecture technique

```
Micro ─► openWakeWord (CPU) ─► enregistrement ─► faster-whisper (GPU)
                                                      │
                                     Ollama / Qwen3 4B (GPU) ◄─► Outils ◄─► Mémoire SQLite
                                                      │
                                                Piper (CPU) ─► Haut-parleurs
```

- **Langage** : Python 3.11, Windows 10/11.
- **Matériel** : RTX 3050 Laptop 4 Go, webcam 1080p du portable, 3 écrans (portable, 20", 27" incurvé).
- **Démarrage** : l'app se lance avec Windows en arrière-plan (zone de notification) ; la fenêtre HUD ne s'ouvre qu'à l'appel.
- **VRAM** : rien au repos. Whisper et le LLM se chargent à la demande ; Ollama décharge le modèle après 5 min d'inactivité. Le chargement démarre dès le mot d'activation.
- **Budget VRAM** : Qwen3 4B Q4 (~3 Go) + Whisper small int8 (~0,5 Go). Le HUD reste léger ; les tâches complexes passent par Claude Code.

## 3. Voix

- **Mot d'activation** : « Hey Jarvis », écoute permanente.
- **Langue** : français.
- **Personnalité** : comme le J.A.R.V.I.S. des films avec Tony Stark : naturel, direct, humour sec, partenaire plutôt que majordome ; vouvoiement, « monsieur » avec parcimonie.
- **Voix** : Microsoft Rémy (en ligne, phrases mises en cache sur le disque) ; repli local Piper si le réseau ne répond pas.
- **Parole spontanée** (V4) : alertes, rappels ; muette pendant les heures de sommeil configurables.

## 4. Cerveau

- **Par défaut** : Ollama, modèle Qwen3 4B Instruct 2507 (variante sans raisonnement : la variante « thinking » ignore `think=False` et met des minutes à répondre sur 4 Go de VRAM), appel d'outils natif, 100 % local.
- **Relais Claude Code** : pour les tâches de code lourdes ou sur demande explicite (« demande à Claude »), via la CLI `claude` et l'abonnement existant.
- **Internet** : recherche web autorisée.
- **Mémoire** : faits sur l'utilisateur conservés indéfiniment (SQLite), injectés dans le contexte. Suppression uniquement sur ordre (« oublie… »).

## 5. Actions

| Domaine | Actions | Version |
|---|---|---|
| PC | ouvrir apps / sites, volume, verrouiller, commandes PowerShell, éteindre | V1 |
| Musique | Apple Music : lecture, pause, suivant, précédent | V1 |
| Web | recherche, lecture de pages | V1 |
| Projets | délégation à Claude Code dans un dossier projet | V1 |
| Écran | lecture de l'écran (capture + modèle de vision) | V2 |
| Services | agenda, mails, notes, rappels, minuteurs, presse-papier, recherche de fichiers | V2 |
| Maison | télé TCL, Home Assistant | V4 |

**Confirmation obligatoire** avant toute action irréversible : supprimer, envoyer, éteindre/redémarrer, commande PowerShell, achat. Jarvis annonce l'action et attend « oui » / « confirme » (ou un geste ✓ en V3).

## 6. Interface et gestes

- **Mode** : fenêtre plein écran sur l'écran 20", HTML/CSS/WebGL dans une fenêtre native (pywebview).
- **Panneaux** : système (CPU/GPU/RAM), météo, heure, agenda, conversation, musique ; ajout, suppression, déplacement et redimensionnement par l'utilisateur, disposition mémorisée.
- **Style** : bleu cyan, finition haut de gamme (réacteur 3D, particules, transitions, sons), réactif à la voix.
- **Gestes** (webcam à ~1 m) :
  - main ouverte : déplacer le curseur
  - pincer : clic / saisir un panneau
  - double pincement : double-clic
  - pincer + glisser : glisser-déposer
  - deux mains écartées / rapprochées : zoom
  - deux doigts vers le haut / bas : défilement
  - balayage : changer de bureau / panneau
  - poing fermé : pause des gestes
- Les gestes pilotent le HUD **et** la souris Windows.

## 7. Sécurité, performances, validation

- Toutes les données restent sur le PC ; seuls la recherche web et les relais Claude Code sortent.
- Aucune donnée n'est effacée sans ordre explicite.
- Latence cible : < 2 s pour une phrase de discussion après la fin de la parole ; plus long accepté pour les tâches complexes.
- Consommation au repos : < 2 % CPU, 0 Go VRAM.

**Critères de validation V1**
1. « Hey Jarvis » détecté à 1–2 m, moins d'un faux réveil par heure.
2. « Quelle heure est-il ? » → réponse vocale en < 2 s.
3. « Mets la musique en pause » agit sur Apple Music.
4. « Éteins l'ordinateur » demande une confirmation et n'agit pas sans « oui ».
5. « Souviens-toi que je préfère le café noir » est restitué après redémarrage.
6. « Demande à Claude de lancer les tests du projet X » renvoie un résumé vocal.
