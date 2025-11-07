# Migration vers Hostinger MySQL

Guide complet pour migrer le système de formulaires des mocks vers Hostinger MySQL + SMTP.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. ✅ Un compte Hostinger avec accès à:
   - MySQL database
   - SMTP email
   - phpMyAdmin ou accès direct à la base de données

2. ✅ Les identifiants suivants:
   - Host MySQL (ex: `mysql.hostinger.com`)
   - Nom de la base de données
   - Utilisateur MySQL
   - Mot de passe MySQL
   - Serveur SMTP (ex: `smtp.hostinger.com`)
   - Port SMTP (généralement `587`)
   - Email et mot de passe pour SMTP

3. ✅ Node.js installé (pour les scripts de migration)

---

## 🚀 Migration en 3 étapes

### Étape 1: Créer la base de données

1. Connectez-vous à phpMyAdmin sur Hostinger
2. Créez une nouvelle base de données (ou utilisez une existante)
3. Exécutez le script SQL:

```bash
mysql -h [HOST] -u [USER] -p [DATABASE] < sql/create-submissions-table.sql
```

Ou copiez-collez le contenu de `sql/create-submissions-table.sql` dans phpMyAdmin.

✅ **Vérification**: La table `submissions` doit apparaître dans votre base.

---

### Étape 2: Configurer les variables d'environnement

1. Copiez `.env.example` vers `.env`:

```bash
cp .env.example .env
```

2. Modifiez `.env` avec vos vraies valeurs:

```env
# Désactiver le mode mock
VITE_USE_MOCK=false

# Activer Hostinger MySQL
VITE_STORAGE_PROVIDER=hostinger_mysql

# Activer SMTP
VITE_MAILER_PROVIDER=smtp

# Email de notification
VITE_NOTIFICATION_EMAIL=votre-email@letrousseau.com

# Configuration MySQL
DB_HOST=mysql.hostinger.com
DB_NAME=u123456789_trousseau
DB_USER=u123456789_admin
DB_PASS=votre-mot-de-passe-securise

# Configuration SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@letrousseau.com
SMTP_PASS=votre-mot-de-passe-email
SMTP_SECURE=false
```

3. Générez un token admin sécurisé:

```bash
openssl rand -hex 32
```

Ajoutez-le dans `VITE_ADMIN_EXPORT_TOKEN`.

✅ **Vérification**: Le fichier `.env` existe et contient toutes les valeurs.

---

### Étape 3: Implémenter et activer les adapters

#### 3a. Implémenter HostingerAdapter

Ouvrez `src/services/adapters/storage/HostingerAdapter.ts` et implémentez:

1. Installer le client MySQL:

```bash
npm install mysql2
```

2. Créez le pool de connexion:

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

3. Implémentez `saveSubmission()`:

```typescript
async saveSubmission(submission: Submission): Promise<SubmissionResult> {
  if (!this.validateSchema(submission)) {
    return { success: false, error: 'Invalid schema' };
  }

  const fields = {
    id: submission.id,
    timestamp: submission.timestamp,
    source: submission.source,
    consent: submission.consent,
    name: submission.name || null,
    email: submission.email || null,
    phone: submission.phone || null,
    // ... autres champs selon le type
  };

  // Ajouter les champs spécifiques au type
  if (submission.source === 'quiz') {
    fields.quiz_user_info = JSON.stringify(submission.userInfo);
    fields.quiz_answers = JSON.stringify(submission.answers);
    fields.quiz_results = JSON.stringify(submission.results);
  }
  // ... autres types

  const columns = Object.keys(fields).join(', ');
  const placeholders = Object.keys(fields).map(() => '?').join(', ');
  const values = Object.values(fields);

  await pool.execute(
    `INSERT INTO submissions (${columns}) VALUES (${placeholders})`,
    values
  );

  return { success: true, id: submission.id };
}
```

4. Implémentez `exportAll()`:

```typescript
async exportAll(options?: ExportOptions): Promise<Submission[]> {
  let query = 'SELECT * FROM submissions WHERE 1=1';
  const params: any[] = [];

  if (options?.startDate) {
    query += ' AND timestamp >= ?';
    params.push(options.startDate);
  }
  if (options?.endDate) {
    query += ' AND timestamp <= ?';
    params.push(options.endDate);
  }
  if (options?.source) {
    query += ' AND source = ?';
    params.push(options.source);
  }

  query += ' ORDER BY timestamp DESC';

  const [rows] = await pool.execute(query, params);
  return rows as Submission[];
}
```

#### 3b. Implémenter SMTPAdapter

Ouvrez `src/services/adapters/mailer/SMTPAdapter.ts` et implémentez:

1. Installer nodemailer:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

2. Créer le transporter:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

3. Implémenter `sendNotification()`:

```typescript
async sendNotification(submission: Submission, recipientEmail: string): Promise<SubmissionResult> {
  const subject = this.generateSubject(submission);
  const body = this.generateBody(submission);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipientEmail,
    subject: subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  });

  return { success: true, id: submission.id };
}
```

#### 3c. Activer les adapters

Ouvrez `src/services/FormSubmissionService.ts` et décommentez:

```typescript
import HostingerAdapter from './adapters/storage/HostingerAdapter';
import SMTPAdapter from './adapters/mailer/SMTPAdapter';

// Dans initStorageAdapter():
if (STORAGE_PROVIDER === 'hostinger_mysql') {
  return new HostingerAdapter();
}

// Dans initMailerAdapter():
if (MAILER_PROVIDER === 'smtp') {
  return new SMTPAdapter();
}
```

✅ **Vérification**: Le service démarre sans erreur avec `USE_MOCK=false`.

---

### Étape 4: Migrer les données mock (optionnel)

Si vous avez des données mock à importer:

1. Exportez les données mock depuis l'application:

```typescript
// Dans la console browser
const submissions = await formSubmissionService.exportSubmissions();
console.log(JSON.stringify(submissions, null, 2));
// Copiez le résultat dans exports/submissions.json
```

2. Exécutez le script de migration:

```bash
# Test d'abord (dry run)
node scripts/migrate-mock-to-mysql.js --file=exports/submissions.json --dry-run

# Ensuite migration réelle
node scripts/migrate-mock-to-mysql.js --file=exports/submissions.json
```

✅ **Vérification**: Les données apparaissent dans phpMyAdmin.

---

## 🧪 Tests

### Test 1: Soumission d'un formulaire

1. Ouvrez le site en mode production
2. Remplissez le formulaire de contact
3. Vérifiez dans phpMyAdmin que la soumission est enregistrée
4. Vérifiez que vous avez reçu l'email de notification

### Test 2: Export admin

Créez une page admin ou testez via console:

```typescript
const submissions = await formSubmissionService.exportSubmissions({
  format: 'json',
  startDate: '2025-01-01',
  source: 'contact'
});
console.log(submissions);
```

### Test 3: Quiz complet

1. Complétez le quiz diagnostic
2. Vérifiez que toutes les réponses sont enregistrées
3. Vérifiez que l'email contient le score et l'archétype

---

## 📊 Monitoring

### Logs à surveiller

- Erreurs de connexion MySQL (check credentials)
- Erreurs SMTP (check port/host/auth)
- Validations échouées (check schema)
- Rate limits (si trop de soumissions)

### Requêtes utiles

```sql
-- Statistiques quotidiennes
SELECT DATE(timestamp) as date, source, COUNT(*) as count
FROM submissions
GROUP BY DATE(timestamp), source
ORDER BY date DESC;

-- Submissions récentes
SELECT id, source, email, timestamp
FROM submissions
ORDER BY timestamp DESC
LIMIT 20;

-- Vérifier les consentements
SELECT source, COUNT(*) as total, SUM(consent) as with_consent
FROM submissions
GROUP BY source;
```

---

## 🔒 Sécurité

### Checklist sécurité

- [ ] Fichier `.env` ajouté au `.gitignore` (déjà fait)
- [ ] Mot de passe MySQL sécurisé (min 16 caractères)
- [ ] Token admin généré aléatoirement
- [ ] Connexion MySQL via SSL (si possible sur Hostinger)
- [ ] Rate limiting sur les endpoints (à implémenter si nécessaire)
- [ ] Validation stricte des inputs (déjà dans adapters)
- [ ] Logs ne contiennent pas de données sensibles

### RGPD

- [ ] Checkbox de consentement obligatoire (déjà implémenté)
- [ ] Politique de confidentialité accessible
- [ ] Droit d'accès: `SELECT * FROM submissions WHERE email = ?`
- [ ] Droit à l'effacement: `DELETE FROM submissions WHERE email = ?`
- [ ] Purge automatique après DATA_RETENTION_DAYS (configurer l'event MySQL)

---

## 🆘 Troubleshooting

### Erreur: "Can't connect to MySQL server"

- Vérifiez `DB_HOST`, `DB_USER`, `DB_PASS`
- Vérifiez que l'IP du serveur est autorisée dans Hostinger
- Testez avec `mysql` CLI: `mysql -h [HOST] -u [USER] -p`

### Erreur: "SMTP Authentication failed"

- Vérifiez `SMTP_USER` et `SMTP_PASS`
- Vérifiez que l'email est créé dans Hostinger
- Testez avec un client email (Thunderbird, etc.)

### Erreur: "Table 'submissions' doesn't exist"

- Exécutez `sql/create-submissions-table.sql`
- Vérifiez que vous utilisez la bonne base de données

### Les emails ne sont pas reçus

- Vérifiez les spams
- Vérifiez les logs SMTP dans Hostinger
- Vérifiez que `NOTIFICATION_EMAIL` est correct
- Testez avec un autre email de destination

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Consultez les logs de l'application
2. Vérifiez les logs Hostinger (MySQL + Email)
3. Relisez ce guide étape par étape
4. Contactez le support Hostinger si nécessaire

---

## 🎯 Checklist finale

Avant de mettre en production:

- [ ] Base de données créée et table `submissions` existe
- [ ] Fichier `.env` configuré avec vraies valeurs
- [ ] `HostingerAdapter` implémenté et testé
- [ ] `SMTPAdapter` implémenté et testé
- [ ] `USE_MOCK=false` dans `.env`
- [ ] Test de soumission formulaire réussi
- [ ] Email de notification reçu
- [ ] Données visibles dans phpMyAdmin
- [ ] Export admin fonctionne
- [ ] Sauvegardes automatiques configurées (Hostinger)
- [ ] Monitoring en place
- [ ] Documentation RGPD à jour

---

**Durée estimée de la migration: 2-4 heures**

Bon courage ! 🚀
