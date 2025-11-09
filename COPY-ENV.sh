#!/bin/bash

# Script pour copier la configuration Le Trousseau dans .env
# Usage: ./COPY-ENV.sh

echo "🔧 Configuration Le Trousseau - Copie des variables d'environnement"
echo "=================================================================="
echo ""

# Vérifier si .env existe
if [ -f "backend/.env" ]; then
    echo "⚠️  Le fichier backend/.env existe déjà."
    read -p "Voulez-vous le remplacer ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Opération annulée."
        exit 1
    fi
    # Backup de l'ancien .env
    cp backend/.env backend/.env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup créé : backend/.env.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copier le template
cp backend/.env.letrousseau backend/.env

echo ""
echo "✅ Configuration copiée dans backend/.env"
echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Obtenir une clé API YouTube :"
echo "   → https://console.cloud.google.com/apis/credentials"
echo "   → Activer YouTube Data API v3"
echo ""
echo "2️⃣  Obtenir une clé API OpenAI :"
echo "   → https://platform.openai.com/api-keys"
echo ""
echo "3️⃣  Configurer Twitter Developer Account :"
echo "   → https://developer.twitter.com/en/portal/dashboard"
echo "   → Créer une app avec permissions Read+Write"
echo ""
echo "4️⃣  Configurer Instagram Business Account :"
echo "   → Convertir @letrousseau_en_video en compte Business"
echo "   → https://developers.facebook.com/apps/"
echo ""
echo "5️⃣  Éditer backend/.env et remplacer les valeurs YOUR_*_HERE"
echo ""
echo "6️⃣  Tester en local :"
echo "   cd backend && npm install && npm start"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Channel ID Le Trousseau déjà configuré : UC0tk2gpBiCL8RaViaNrpHCw"
echo ""
