#!/bin/bash

# ============================================
# Le Trousseau - Voir les soumissions
# ============================================

VPS_HOST="root@168.231.85.181"

echo "======================================"
echo "SOUMISSIONS DE FORMULAIRES"
echo "======================================"
echo ""

# Menu
echo "Que voulez-vous voir ?"
echo "1) Toutes les soumissions récentes (10 dernières)"
echo "2) Formulaires de contact"
echo "3) Réservations"
echo "4) Inscriptions newsletter"
echo "5) Résultats quiz"
echo "6) Statistiques"
echo ""
read -p "Choix (1-6): " choice

case $choice in
    1)
        echo ""
        echo "📋 10 dernières soumissions:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
                source as Type,
                name as Nom,
                email as Email,
                SUBSTRING(message, 1, 50) as Message
            FROM submissions 
            ORDER BY timestamp DESC 
            LIMIT 10;
        \""
        ;;
    2)
        echo ""
        echo "📧 Formulaires de contact:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
                name as Nom,
                email as Email,
                subject as Sujet,
                message as Message,
                newsletter as Newsletter
            FROM submissions 
            WHERE source = 'contact'
            ORDER BY timestamp DESC;
        \""
        ;;
    3)
        echo ""
        echo "📅 Réservations:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
                name as Nom,
                email as Email,
                formula as Formule,
                participants as Participants,
                location as Lieu
            FROM submissions 
            WHERE source = 'booking'
            ORDER BY timestamp DESC;
        \""
        ;;
    4)
        echo ""
        echo "📬 Inscriptions newsletter:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
                name as Nom,
                email as Email
            FROM submissions 
            WHERE source = 'newsletter'
            ORDER BY timestamp DESC;
        \""
        ;;
    5)
        echo ""
        echo "🎯 Résultats quiz:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as Date,
                JSON_EXTRACT(quiz_user_info, '$.name') as Nom,
                JSON_EXTRACT(quiz_user_info, '$.email') as Email,
                JSON_EXTRACT(quiz_results, '$.score') as Score,
                JSON_EXTRACT(quiz_results, '$.archetype') as Archetype
            FROM submissions 
            WHERE source = 'quiz'
            ORDER BY timestamp DESC;
        \""
        ;;
    6)
        echo ""
        echo "📊 Statistiques:"
        ssh $VPS_HOST "mysql -u root -p letrousseau_db -e \"
            SELECT 
                source as Type,
                COUNT(*) as Total,
                DATE_FORMAT(MIN(timestamp), '%Y-%m-%d') as Premiere,
                DATE_FORMAT(MAX(timestamp), '%Y-%m-%d') as Derniere
            FROM submissions 
            GROUP BY source;
        \""
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "======================================"
