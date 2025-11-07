#!/bin/bash

# ============================================
# Le Trousseau - Voir les détails du quiz
# ============================================

VPS_HOST="root@168.231.85.181"

if [ -z "$1" ]; then
    echo "======================================"
    echo "LISTE DES QUIZ SOUMIS"
    echo "======================================"
    echo ""
    
    ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
        SELECT 
            id,
            DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
            JSON_EXTRACT(quiz_user_info, '$.name') as Nom,
            JSON_EXTRACT(quiz_user_info, '$.email') as Email,
            JSON_EXTRACT(quiz_results, '$.score') as Score,
            JSON_EXTRACT(quiz_results, '$.archetype') as Archetype
        FROM submissions 
        WHERE source = 'quiz'
        ORDER BY timestamp DESC;
    \""
    
    echo ""
    echo "Pour voir les détails d'un quiz, utilisez:"
    echo "./view-quiz-details.sh <ID>"
else
    QUIZ_ID="$1"
    
    echo "======================================"
    echo "DÉTAILS DU QUIZ: $QUIZ_ID"
    echo "======================================"
    echo ""
    
    ssh $VPS_HOST << ENDSSH
mysql -u root -p letrousseau_db << 'EOSQL'
SET @quiz_id = '$QUIZ_ID';

-- Informations utilisateur
SELECT '=== INFORMATIONS UTILISATEUR ===' as '';
SELECT 
    JSON_EXTRACT(quiz_user_info, '$.name') as Nom,
    JSON_EXTRACT(quiz_user_info, '$.pseudonym') as Pseudo,
    JSON_EXTRACT(quiz_user_info, '$.email') as Email,
    JSON_EXTRACT(quiz_user_info, '$.phone') as Telephone,
    JSON_EXTRACT(quiz_user_info, '$.age') as Age,
    JSON_EXTRACT(quiz_user_info, '$.location') as Localisation
FROM submissions 
WHERE id = @quiz_id;

-- Résultats
SELECT '' as '';
SELECT '=== RÉSULTATS ===' as '';
SELECT 
    JSON_EXTRACT(quiz_results, '$.score') as Score,
    JSON_EXTRACT(quiz_results, '$.archetype') as Archetype,
    JSON_EXTRACT(quiz_results, '$.recommendedOffer') as 'Offre recommandée'
FROM submissions 
WHERE id = @quiz_id;

-- Statistiques
SELECT '' as '';
SELECT '=== STATISTIQUES ===' as '';
SELECT 
    JSON_EXTRACT(quiz_results, '$.stats.discipline') as Discipline,
    JSON_EXTRACT(quiz_results, '$.stats.creation') as Creation,
    JSON_EXTRACT(quiz_results, '$.stats.interpretation') as Interpretation,
    JSON_EXTRACT(quiz_results, '$.stats.organisation') as Organisation
FROM submissions 
WHERE id = @quiz_id;

-- Réponses détaillées
SELECT '' as '';
SELECT '=== RÉPONSES DÉTAILLÉES (15 questions) ===' as '';

-- Extraire chaque réponse du JSON
SELECT 
    JSON_EXTRACT(quiz_answers, '$[0].questionId') as Q1_ID,
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[0].answer')) as Q1_Reponse,
    JSON_EXTRACT(quiz_answers, '$[0].value') as Q1_Points
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[1].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[1].answer')),
    JSON_EXTRACT(quiz_answers, '$[1].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[2].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[2].answer')),
    JSON_EXTRACT(quiz_answers, '$[2].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[3].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[3].answer')),
    JSON_EXTRACT(quiz_answers, '$[3].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[4].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[4].answer')),
    JSON_EXTRACT(quiz_answers, '$[4].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[5].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[5].answer')),
    JSON_EXTRACT(quiz_answers, '$[5].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[6].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[6].answer')),
    JSON_EXTRACT(quiz_answers, '$[6].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[7].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[7].answer')),
    JSON_EXTRACT(quiz_answers, '$[7].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[8].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[8].answer')),
    JSON_EXTRACT(quiz_answers, '$[8].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[9].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[9].answer')),
    JSON_EXTRACT(quiz_answers, '$[9].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[10].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[10].answer')),
    JSON_EXTRACT(quiz_answers, '$[10].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[11].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[11].answer')),
    JSON_EXTRACT(quiz_answers, '$[11].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[12].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[12].answer')),
    JSON_EXTRACT(quiz_answers, '$[12].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[13].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[13].answer')),
    JSON_EXTRACT(quiz_answers, '$[13].value')
FROM submissions WHERE id = @quiz_id
UNION ALL
SELECT 
    JSON_EXTRACT(quiz_answers, '$[14].questionId'),
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[14].answer')),
    JSON_EXTRACT(quiz_answers, '$[14].value')
FROM submissions WHERE id = @quiz_id;

EOSQL
ENDSSH
fi

echo ""
echo "======================================"
