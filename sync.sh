#!/bin/bash

# ============================================
# Le Trousseau - Script de Synchronisation
# ============================================
# 
# Synchronise les modifications entre:
# - Local (Mac)
# - GitHub
# - VPS
#
# Usage: ./sync.sh [message de commit]
# ============================================

set -e

VPS_HOST="root@168.231.85.181"
COMMIT_MSG="${1:-Update: sync changes}"

echo "======================================"
echo "SYNCHRONISATION - Le Trousseau"
echo "======================================"
echo ""

# Étape 1: Commit et push local → GitHub
echo "📤 ÉTAPE 1: Local → GitHub"
echo "--------------------------------------"

git add .
git status

read -p "Continuer avec le commit ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Annulé"
    exit 1
fi

git commit -m "$COMMIT_MSG" || echo "Rien à commiter"
git push origin main

echo "✅ Poussé vers GitHub"
echo ""

# Étape 2: Pull sur le VPS depuis GitHub
echo "📥 ÉTAPE 2: GitHub → VPS"
echo "--------------------------------------"

ssh $VPS_HOST << 'ENDSSH'
    echo "🔄 Mise à jour du repository sur le VPS..."
    
    cd /var/www/letrousseau-repo
    git pull origin main
    
    echo "✅ Repository VPS mis à jour"
    
    # Optionnel: Redéployer le backend si changements
    if git diff HEAD@{1} --name-only | grep -q "backend/"; then
        echo "🔄 Changements backend détectés, redéploiement..."
        
        cd backend
        npm install --production
        pm2 restart letrousseau-api
        
        echo "✅ Backend redéployé"
    fi
    
    # Optionnel: Rebuild frontend si changements
    if git diff HEAD@{1} --name-only | grep -q "src/\|index.html\|package.json"; then
        echo "🎨 Changements frontend détectés"
        echo "⚠️  Pensez à rebuild et redéployer le frontend si nécessaire"
    fi
ENDSSH

echo ""
echo "======================================"
echo "✅ SYNCHRONISATION TERMINÉE"
echo "======================================"
echo ""
echo "📊 État:"
echo "  - Local: ✅ À jour"
echo "  - GitHub: ✅ À jour"
echo "  - VPS: ✅ À jour"
echo ""
