#!/bin/bash

# ============================================
# Le Trousseau - Export Quiz en CSV
# ============================================

VPS_HOST="root@168.231.85.181"
OUTPUT_FILE="quiz_export_$(date +%Y%m%d_%H%M%S).csv"

echo "======================================"
echo "EXPORT DES QUIZ EN CSV"
echo "======================================"
echo ""
echo "Connexion au VPS et export..."
echo ""

ssh -t $VPS_HOST << 'ENDSSH'
mysql -u root -p letrousseau_db << 'EOSQL'

-- Export avec toutes les réponses détaillées
SELECT 
    id as 'ID Quiz',
    timestamp as 'Date',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.name')) as 'Nom',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.pseudonym')) as 'Pseudo',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.email')) as 'Email',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.phone')) as 'Téléphone',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.age')) as 'Âge',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_user_info, '$.location')) as 'Localisation',
    JSON_EXTRACT(quiz_results, '$.score') as 'Score',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_results, '$.archetype')) as 'Archétype',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_results, '$.recommendedOffer')) as 'Offre recommandée',
    JSON_EXTRACT(quiz_results, '$.stats.discipline') as 'Stat_Discipline',
    JSON_EXTRACT(quiz_results, '$.stats.creation') as 'Stat_Création',
    JSON_EXTRACT(quiz_results, '$.stats.interpretation') as 'Stat_Interprétation',
    JSON_EXTRACT(quiz_results, '$.stats.organisation') as 'Stat_Organisation',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[0].answer')) as 'Q1_Réponse',
    JSON_EXTRACT(quiz_answers, '$[0].value') as 'Q1_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[1].answer')) as 'Q2_Réponse',
    JSON_EXTRACT(quiz_answers, '$[1].value') as 'Q2_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[2].answer')) as 'Q3_Réponse',
    JSON_EXTRACT(quiz_answers, '$[2].value') as 'Q3_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[3].answer')) as 'Q4_Réponse',
    JSON_EXTRACT(quiz_answers, '$[3].value') as 'Q4_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[4].answer')) as 'Q5_Réponse',
    JSON_EXTRACT(quiz_answers, '$[4].value') as 'Q5_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[5].answer')) as 'Q6_Réponse',
    JSON_EXTRACT(quiz_answers, '$[5].value') as 'Q6_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[6].answer')) as 'Q7_Réponse',
    JSON_EXTRACT(quiz_answers, '$[6].value') as 'Q7_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[7].answer')) as 'Q8_Réponse',
    JSON_EXTRACT(quiz_answers, '$[7].value') as 'Q8_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[8].answer')) as 'Q9_Réponse',
    JSON_EXTRACT(quiz_answers, '$[8].value') as 'Q9_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[9].answer')) as 'Q10_Réponse',
    JSON_EXTRACT(quiz_answers, '$[9].value') as 'Q10_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[10].answer')) as 'Q11_Réponse',
    JSON_EXTRACT(quiz_answers, '$[10].value') as 'Q11_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[11].answer')) as 'Q12_Réponse',
    JSON_EXTRACT(quiz_answers, '$[11].value') as 'Q12_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[12].answer')) as 'Q13_Réponse',
    JSON_EXTRACT(quiz_answers, '$[12].value') as 'Q13_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[13].answer')) as 'Q14_Réponse',
    JSON_EXTRACT(quiz_answers, '$[13].value') as 'Q14_Points',
    JSON_UNQUOTE(JSON_EXTRACT(quiz_answers, '$[14].answer')) as 'Q15_Réponse',
    JSON_EXTRACT(quiz_answers, '$[14].value') as 'Q15_Points'
FROM submissions 
WHERE source = 'quiz'
ORDER BY timestamp DESC;

EOSQL
ENDSSH

echo ""
echo "======================================"
echo "✅ Export terminé"
echo "======================================"
