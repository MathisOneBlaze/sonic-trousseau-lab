# 📊 Données du Quiz - Guide complet

## 🗄️ Données stockées pour chaque quiz

Toutes les données sont dans la table `submissions` avec `source = 'quiz'`.

### Champs principaux

| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique du quiz |
| `timestamp` | DATETIME | Date et heure de soumission |
| `source` | ENUM | Toujours 'quiz' |
| `consent` | BOOLEAN | Consentement RGPD |
| `email` | VARCHAR(255) | Email de l'utilisateur |
| `name` | VARCHAR(255) | Nom ou pseudo |
| `phone` | VARCHAR(50) | Téléphone (optionnel) |

### Champs JSON détaillés

#### 1. `quiz_user_info` (JSON)
Informations complètes de l'utilisateur :
```json
{
  "name": "John Doe",
  "pseudonym": "JohnMusic",
  "email": "john@example.com",
  "phone": "0612345678",
  "age": "18-24",
  "location": "Paris"
}
```

#### 2. `quiz_answers` (JSON)
**Toutes les 15 réponses détaillées** :
```json
[
  {
    "questionId": 1,
    "answer": "Très souvent (plusieurs fois par semaine)",
    "value": 6
  },
  {
    "questionId": 2,
    "answer": "Plus de 5 morceaux",
    "value": 6
  },
  // ... jusqu'à la question 15
]
```

**Chaque réponse contient :**
- `questionId` : Numéro de la question (1-15)
- `answer` : Texte de la réponse choisie
- `value` : Points attribués (0-8)

#### 3. `quiz_results` (JSON)
Résultats calculés :
```json
{
  "score": 82,
  "archetype": "Conquérant",
  "stats": {
    "discipline": 73,
    "creation": 90,
    "interpretation": 77,
    "organisation": 69
  },
  "recommendedOffer": "Niveau 3 - Conquérant"
}
```

---

## 📥 Comment accéder aux données

### Méthode 1 : Export CSV complet

```bash
./export-quiz-csv.sh
```

Cela génère un fichier CSV avec **TOUTES les colonnes** :
- Informations utilisateur (nom, email, téléphone, âge, localisation)
- Résultats (score, archétype, offre recommandée)
- Statistiques (discipline, création, interprétation, organisation)
- **Les 15 réponses détaillées** (Q1 à Q15 avec réponse et points)

### Méthode 2 : Requête SQL directe

```bash
ssh root@168.231.85.181
mysql -u root -p
USE letrousseau_db;
```

**Voir toutes les réponses d'un quiz :**
```sql
SELECT 
    JSON_PRETTY(quiz_answers) as reponses_detaillees
FROM submissions 
WHERE id = 'votre-quiz-id';
```

**Extraire une réponse spécifique (ex: Question 5) :**
```sql
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[4].answer')) as Q5_Reponse,
    JSON_EXTRACT(quiz_answers, '$[4].value') as Q5_Points
FROM submissions 
WHERE source = 'quiz';
```

**Export CSV personnalisé :**
```sql
SELECT 
    timestamp,
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.name')) as Nom,
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.email')) as Email,
    JSON_EXTRACT(quiz_results, '$.score') as Score,
    JSON_UNQUOTE(JSON_EXTRACT(quiz_results, '$.archetype')) as Archetype,
    -- Question 1
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[0].answer')) as Q1,
    -- Question 2
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[1].answer')) as Q2,
    -- ... etc jusqu'à Q15
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[14].answer')) as Q15
FROM submissions 
WHERE source = 'quiz'
ORDER BY timestamp DESC
INTO OUTFILE '/tmp/quiz_export.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

### Méthode 3 : Script interactif

```bash
./view-quiz-details.sh
```

Liste tous les quiz, puis :
```bash
./view-quiz-details.sh <ID-du-quiz>
```

Affiche toutes les informations formatées.

---

## 📋 Les 15 questions du quiz

Pour référence, voici les questions (index 0-14 dans le JSON) :

1. **Q1** : Fréquence de création musicale
2. **Q2** : Nombre de morceaux terminés
3. **Q3** : Réaction face aux difficultés
4. **Q4** : Discipline de travail
5. **Q5** : Priorité dans la création
6. **Q6** : Aisance technique
7. **Q7** : Partage du travail
8. **Q8** : Gestion de la critique
9. **Q9** : Temps hebdomadaire consacré
10. **Q10** : Espace de travail
11. **Q11** : Logiciel utilisé
12. **Q12** : Objectif principal (texte libre)
13. **Q13** : Formation musicale
14. **Q14** : Vision à long terme
15. **Q15** : Obstacle principal (texte libre)

---

## 🎯 Archétypes possibles

Basés sur le score total :

| Score | Archétype | Offre recommandée |
|-------|-----------|-------------------|
| 0-40 | **Initié** | Niveau 1 - Découverte |
| 41-70 | **Aventurier** | Niveau 2 - Développement |
| 71-120 | **Conquérant** | Niveau 3 - Maîtrise |

---

## 💡 Exemples de requêtes utiles

### Statistiques globales

```sql
-- Nombre de quiz par archétype
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(quiz_results, '$.archetype')) as Archetype,
    COUNT(*) as Nombre
FROM submissions 
WHERE source = 'quiz'
GROUP BY Archetype;

-- Score moyen
SELECT 
    AVG(JSON_EXTRACT(quiz_results, '$.score')) as Score_Moyen
FROM submissions 
WHERE source = 'quiz';

-- Réponse la plus fréquente à la Q1
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[0].answer')) as Reponse_Q1,
    COUNT(*) as Frequence
FROM submissions 
WHERE source = 'quiz'
GROUP BY Reponse_Q1
ORDER BY Frequence DESC;
```

### Filtrer par critères

```sql
-- Quiz des "Conquérants" seulement
SELECT * FROM submissions 
WHERE source = 'quiz'
AND JSON_EXTRACT(quiz_results, '$.archetype') = '"Conquérant"';

-- Quiz avec score > 80
SELECT * FROM submissions 
WHERE source = 'quiz'
AND JSON_EXTRACT(quiz_results, '$.score') > 80;

-- Quiz par tranche d'âge
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.age')) as Age,
    COUNT(*) as Nombre
FROM submissions 
WHERE source = 'quiz'
GROUP BY Age;
```

---

## 📊 Format d'export recommandé

Pour Excel/Google Sheets, utilisez `./export-quiz-csv.sh` qui génère un fichier avec :

**Colonnes :**
1-8. Infos utilisateur (ID, Date, Nom, Pseudo, Email, Téléphone, Âge, Localisation)
9-11. Résultats (Score, Archétype, Offre)
12-15. Statistiques (Discipline, Création, Interprétation, Organisation)
16-45. Réponses détaillées (Q1 à Q15, chacune avec Réponse + Points)

**Total : 45 colonnes** avec toutes les données !

---

## 🔒 Conformité RGPD

Toutes les données sont stockées avec consentement (`consent = true`).

**Droit à l'effacement :**
```sql
DELETE FROM submissions WHERE email = 'user@example.com';
```

**Droit d'accès :**
```sql
SELECT * FROM submissions WHERE email = 'user@example.com';
```

---

## ✅ Résumé

✅ **Toutes les 15 réponses sont enregistrées** dans `quiz_answers`  
✅ **Chaque réponse contient** : question ID, texte de la réponse, points  
✅ **Export CSV disponible** avec toutes les colonnes  
✅ **Requêtes SQL flexibles** pour analyses personnalisées  

**Les données sont complètes et exploitables !** 🎉
