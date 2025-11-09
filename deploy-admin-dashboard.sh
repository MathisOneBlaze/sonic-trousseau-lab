#!/bin/bash

# Script de Déploiement Admin Dashboard
# Configure admin.asso-letrousseau.com automatiquement

echo "🎛️ Configuration Admin Dashboard - Le Trousseau"
echo "================================================"
echo ""

VPS_IP="168.231.85.181"
VPS_USER="root"
DOMAIN="admin.asso-letrousseau.com"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérification DNS
echo "🔍 Vérification DNS..."
DNS_IP=$(dig +short $DOMAIN | tail -1)

if [ "$DNS_IP" == "$VPS_IP" ]; then
    echo -e "${GREEN}✅ DNS configuré correctement${NC}"
    echo "   $DOMAIN → $VPS_IP"
else
    echo -e "${RED}❌ DNS non configuré ou en cours de propagation${NC}"
    echo "   Attendu : $VPS_IP"
    echo "   Reçu    : $DNS_IP"
    echo ""
    echo "📝 Action requise :"
    echo "   1. Ajoutez un enregistrement A chez votre registrar :"
    echo "      Type: A"
    echo "      Nom: admin"
    echo "      Valeur: $VPS_IP"
    echo "   2. Attendez 5-10 minutes"
    echo "   3. Relancez ce script"
    echo ""
    read -p "Voulez-vous continuer quand même ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📤 Transfert de la configuration Nginx..."

# Créer la config Nginx sur le VPS
ssh $VPS_USER@$VPS_IP << 'ENDSSH'

echo "📝 Création du fichier de configuration Nginx..."

cat > /etc/nginx/sites-available/admin-letrousseau << 'EOF'
# Le Trousseau - Admin Dashboard Configuration

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name admin.asso-letrousseau.com;
    return 301 https://$host$request_uri;
}

# HTTPS server - Admin Dashboard
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name admin.asso-letrousseau.com;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logs
    access_log /var/log/nginx/admin-letrousseau-access.log;
    error_log /var/log/nginx/admin-letrousseau-error.log;
    
    # Serve monitoring dashboard
    location /dashboard {
        proxy_pass http://localhost:3001/monitoring/monitoring.html;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Root redirects to dashboard
    location = / {
        return 301 https://admin.asso-letrousseau.com/dashboard;
    }
}
EOF

echo "✅ Configuration Nginx créée"

# Activer le site
echo "🔗 Activation du site..."
ln -sf /etc/nginx/sites-available/admin-letrousseau /etc/nginx/sites-enabled/

# Tester la configuration
echo "🧪 Test de la configuration Nginx..."
if nginx -t; then
    echo "✅ Configuration Nginx valide"
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi

# Recharger Nginx
echo "🔄 Rechargement de Nginx..."
systemctl reload nginx

echo "✅ Nginx configuré et rechargé"
echo ""

# Configuration SSL avec Certbot
echo "🔒 Configuration SSL avec Certbot..."
echo "   (Ceci peut prendre quelques minutes)"
echo ""

if certbot --nginx -d admin.asso-letrousseau.com --non-interactive --agree-tos --email admin@asso-letrousseau.com --redirect; then
    echo "✅ SSL configuré avec succès"
else
    echo "⚠️  Certbot a rencontré un problème"
    echo "   Vous pouvez le configurer manuellement avec :"
    echo "   certbot --nginx -d admin.asso-letrousseau.com"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "✅ CONFIGURATION TERMINÉE !"
echo "════════════════════════════════════════════════"
echo ""

echo "🌐 Votre dashboard admin est accessible à :"
echo "   https://admin.asso-letrousseau.com/dashboard"
echo ""

echo "📊 Test de l'API :"
curl -s https://admin.asso-letrousseau.com/api/health | head -5 || echo "⏳ L'API démarre..."

echo ""
echo "🔐 Recommandations de sécurité :"
echo "   1. Configurez une IP whitelist"
echo "   2. Ou ajoutez un Basic Auth"
echo "   3. Voir SETUP-ADMIN-DASHBOARD.md pour les détails"
echo ""

ENDSSH

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🎯 Prochaines étapes :"
echo "   1. Ouvrez https://admin.asso-letrousseau.com/dashboard"
echo "   2. Vérifiez que le dashboard s'affiche"
echo "   3. Testez le toggle d'automation"
echo "   4. Configurez la sécurité (voir SETUP-ADMIN-DASHBOARD.md)"
echo ""
