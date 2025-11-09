# 🐦 Configuration Twitter - Le Trousseau

> Guide pour configurer le compte Twitter [@Le_Trousseau_](https://x.com/Le_Trousseau_)

---

## 📋 État actuel

- ✅ Compte créé : [@Le_Trousseau_](https://x.com/Le_Trousseau_)
- ❌ Aucun tweet publié
- ❌ Pas de thread de présentation
- ❌ Pas de thread répertoire épinglé

---

## 🎯 Configuration nécessaire pour l'automatisation

### Étape 1 : Thread de présentation (optionnel mais recommandé)

**Créer un premier thread qui présente Le Trousseau**

Exemple de structure :

```
Tweet 1/5 🎭
Bienvenue sur le compte Twitter du Trousseau ! 

Une association artistique dédiée à [votre mission]...

---

Tweet 2/5 🎥
Retrouvez nos vidéos sur YouTube : 
https://www.youtube.com/@LeTrousseau-en-video

---

Tweet 3/5 📸
Suivez-nous aussi sur Instagram :
https://www.instagram.com/letrousseau_en_video/

---

Tweet 4/5 🌐
Notre site web :
https://www.asso-letrousseau.com

---

Tweet 5/5 📬
Inscrivez-vous à notre newsletter pour ne rien manquer !

#LeTrousseau #Art #Culture
```

### Étape 2 : Thread répertoire épinglé (ESSENTIEL)

**Ce thread va contenir les liens vers toutes vos vidéos**

#### 2.1 Créer le thread initial

```
Tweet 1 📚 RÉPERTOIRE - Toutes nos vidéos

Ce thread répertorie toutes les vidéos publiées sur notre chaîne YouTube.

Mis à jour automatiquement à chaque nouvelle publication. 👇

---

Tweet 2 (sera ajouté automatiquement par le système)
```

#### 2.2 Épingler le thread

1. Cliquez sur les **3 points** du premier tweet
2. Sélectionnez **"Épingler à votre profil"**
3. Le thread apparaîtra en haut de votre profil

#### 2.3 Récupérer l'ID du thread épinglé

**Méthode 1 : Via l'URL du tweet**

L'URL du tweet ressemble à :
```
https://x.com/Le_Trousseau_/status/1234567890123456789
                                    ^^^^^^^^^^^^^^^^^^^
                                    C'est l'ID du tweet
```

**Méthode 2 : Via les outils développeur**

1. Ouvrez le tweet épinglé
2. Clic droit → **Inspecter**
3. Cherchez `data-tweet-id` dans le HTML
4. Copiez la valeur

**Méthode 3 : Via l'API Twitter (automatique plus tard)**

Une fois les clés API configurées, le système peut le récupérer automatiquement.

#### 2.4 Ajouter l'ID dans la configuration

Une fois récupéré, ajoutez-le dans `backend/.env` :

```bash
# Thread épinglé répertoire
TWITTER_PINNED_THREAD_ID=1234567890123456789
```

---

## 🔧 Configuration API Twitter

### Étape 1 : Créer une application Twitter

1. Allez sur [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Connectez-vous avec le compte **@Le_Trousseau_**
3. Cliquez sur **"Create Project"**

### Étape 2 : Configurer le projet

**Informations du projet** :
- **Project Name** : Le Trousseau Automation
- **Use Case** : Making a bot
- **Description** : Automated content publishing for Le Trousseau videos

### Étape 3 : Créer l'application

**App settings** :
- **App Name** : Le Trousseau Bot
- **Description** : Publishes video threads and manages content
- **Website URL** : https://www.asso-letrousseau.com
- **Callback URL** : (laisser vide pour l'instant)

### Étape 4 : Configurer les permissions

Dans **Settings → User authentication settings** :

- ✅ **OAuth 1.0a** : Activé
- ✅ **Read and write** : Activé (essentiel !)
- ✅ **App permissions** : Read and Write
- ❌ **OAuth 2.0** : Pas nécessaire

### Étape 5 : Générer les clés

Dans **Keys and tokens** :

1. **API Key** (Consumer Key)
   ```
   Exemple : xvz1evFS4wEEPTGEFPHBog
   ```

2. **API Key Secret** (Consumer Secret)
   ```
   Exemple : L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg
   ```

3. Cliquez sur **"Generate"** pour :
   - **Access Token**
   - **Access Token Secret**

⚠️ **Important** : Copiez ces clés immédiatement, elles ne seront plus affichées !

### Étape 6 : Ajouter les clés dans .env

```bash
TWITTER_API_KEY=xvz1evFS4wEEPTGEFPHBog
TWITTER_API_SECRET=L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg
TWITTER_ACCESS_TOKEN=1234567890-AbcdEfghIjklMnopQrstUvwxYz
TWITTER_ACCESS_SECRET=AbcDefGhiJklMnoPqrsTuvWxyZaBcDeFgHiJkLmNoP
```

---

## 🧪 Tester la connexion Twitter

Une fois configuré, testez avec :

```bash
cd backend
node -e "
const { TwitterApi } = require('twitter-api-v2');
const client = new TwitterApi({
  appKey: 'YOUR_API_KEY',
  appSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessSecret: 'YOUR_ACCESS_SECRET'
});
client.v2.me().then(user => {
  console.log('✅ Connecté comme:', user.data.username);
}).catch(err => {
  console.error('❌ Erreur:', err);
});
"
```

---

## 📊 Workflow automatique après configuration

Une fois tout configuré, voici ce qui se passera automatiquement :

### Quand vous publiez une vidéo YouTube :

1. **Détection** : Le système détecte la nouvelle vidéo
2. **Transcription** : Whisper API transcrit l'audio
3. **Analyse** : GPT-4 analyse le contenu
4. **Génération** : Création d'un thread Twitter adaptatif (3-12 tweets)
5. **Publication** : Le thread est publié sur @Le_Trousseau_
6. **Ajout au répertoire** : Le premier tweet du thread est ajouté au thread épinglé

### Structure du thread généré :

```
Tweet 1/7 🎬 [Hook accrocheur]

[Teaser de la vidéo basé sur la transcription]

---

Tweet 2/7 📝 [Point clé #1]

[Contenu extrait et reformulé]

---

... (tweets 3-6)

---

Tweet 7/7 🔗 [Conclusion + CTA]

Vidéo complète sur YouTube 👇
https://youtu.be/[VIDEO_ID]

#LeTrousseau #[Tags pertinents]
```

### Ajout automatique au répertoire :

Le système va :
1. Récupérer le thread épinglé (ID stocké dans `.env`)
2. Créer un nouveau tweet sous le thread
3. Contenu : "🆕 [Titre de la vidéo] - [Date]"
4. Lien vers le premier tweet du nouveau thread

Résultat : Votre thread répertoire sera toujours à jour !

---

## 🎨 Conseils pour le branding

### Bio du compte
```
🎭 Association artistique
🎥 Vidéos sur YouTube
📸 Instagram @letrousseau_en_video
🌐 asso-letrousseau.com
```

### Photo de profil
- Logo du Trousseau (carré)
- Haute résolution (400x400 minimum)
- Format PNG ou JPG

### Bannière
- Dimensions : 1500x500 pixels
- Mettre en avant votre identité visuelle
- Inclure votre tagline si vous en avez une

---

## ✅ Checklist complète

- [ ] Compte Twitter créé (@Le_Trousseau_)
- [ ] Bio et branding configurés
- [ ] Thread de présentation publié (optionnel)
- [ ] Thread répertoire créé
- [ ] Thread répertoire épinglé
- [ ] ID du thread épinglé récupéré
- [ ] Application Twitter Developer créée
- [ ] Permissions Read+Write activées
- [ ] Clés API générées
- [ ] Clés API ajoutées dans `.env`
- [ ] `TWITTER_PINNED_THREAD_ID` configuré dans `.env`
- [ ] Connexion testée avec le script de test

---

## 🚨 Important

### Limites Twitter API (niveau Essential - gratuit)

- **Tweets** : 300 tweets / 3 heures
- **Lecture** : 10,000 requêtes / mois
- **Suffisant** : Pour vos besoins (1-2 vidéos/semaine)

### Si vous dépassez les limites

Upgrade vers **Basic** ($100/mois) :
- 3,000 tweets / 3 heures
- 100,000 requêtes / mois

Mais le niveau Essential devrait largement suffire pour Le Trousseau !

---

## 📞 Aide supplémentaire

Si vous avez besoin d'aide pour :
- Créer les threads initiaux
- Récupérer l'ID du thread épinglé
- Configurer l'API

N'hésitez pas à demander !

---

**Prêt à démarrer ?** 🚀
