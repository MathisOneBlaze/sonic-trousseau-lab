#!/bin/bash

# Script de déploiement de l'automatisation Le Trousseau sur VPS
# VPS: 168.231.85.181

echo "🚀 Déploiement de l'automatisation Le Trousseau"
echo "================================================"
echo ""

VPS_IP="168.231.85.181"
VPS_USER="root"
VPS_DIR="/var/www/letrousseau"
BACKEND_DIR="$VPS_DIR/backend"

# Vérifier que .env existe
if [ ! -f "backend/.env" ]; then
    echo "❌ Erreur: backend/.env n'existe pas"
    echo "   Exécutez d'abord: cp backend/.env.letrousseau backend/.env"
    echo "   Et vérifiez les clés API"
    exit 1
fi

echo "📦 Préparation des fichiers..."

# Créer une archive sans node_modules
cd backend
tar --exclude='node_modules' --exclude='.git' -czf ../backend-automation.tar.gz .
cd ..

echo "✅ Archive créée: backend-automation.tar.gz"
echo ""

echo "📤 Transfert vers le VPS $VPS_IP..."
scp backend-automation.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo "✅ Transfert terminé"
echo ""

echo "🔧 Installation sur le VPS..."

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "📂 Création du répertoire backend si nécessaire..."
    mkdir -p /var/www/letrousseau/backend
    cd /var/www/letrousseau/backend
    
    echo "📦 Extraction de l'archive..."
    tar -xzf /tmp/backend-automation.tar.gz
    rm /tmp/backend-automation.tar.gz
    
    echo "📥 Installation des dépendances..."
    npm install --production
    
    echo "🗄️ Création des tables MySQL si nécessaire..."
    if [ -f "../sql/create-automation-tables.sql" ]; then
        mysql -u root letrousseau_db < ../sql/create-automation-tables.sql 2>/dev/null || echo "⚠️  Tables déjà existantes ou erreur SQL"
    fi
    
    echo "🔄 Redémarrage de PM2..."
    pm2 delete letrousseau-api 2>/dev/null || true
    pm2 start server.js --name letrousseau-api
    pm2 save
    
    echo ""
    echo "✅ Déploiement terminé !"
    echo ""
    echo "📊 Status:"
    pm2 status
    echo ""
    echo "📝 Logs en temps réel:"
    echo "   pm2 logs letrousseau-api"
    echo ""
    echo "🌐 Dashboard accessible à:"
    echo "   http://168.231.85.181:3001/monitoring/monitoring.html"
    echo ""
ENDSSH

echo ""
echo "════════════════════════════════════════════════"
echo "✅ DÉPLOIEMENT TERMINÉ !"
echo "════════════════════════════════════════════════"
echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo ""
echo "1️⃣  Vérifier le status:"
echo "   ssh root@$VPS_IP 'pm2 status'"
echo ""
echo "2️⃣  Voir les logs en direct:"
echo "   ssh root@$VPS_IP 'pm2 logs letrousseau-api'"
echo ""
echo "3️⃣  Accéder au dashboard:"
echo "   http://168.231.85.181:3001/monitoring/monitoring.html"
echo ""
echo "4️⃣  Publier une vidéo YouTube de test et observer !"
echo ""
echo "════════════════════════════════════════════════"
echo ""

# Cleanup
rm -f backend-automation.tar.gz

echo "Voulez-vous ouvrir le dashboard maintenant ? (y/N)"
read -p "> " response
if [[ "$response" =~ ^[Yy]$ ]]; then
    open "http://168.231.85.181:3001/monitoring/monitoring.html"
fi
