#!/bin/bash

# ============================================
# Le Trousseau - Script de Déploiement
# ============================================
# 
# Usage:
#   ./deploy.sh backend    # Déployer uniquement le backend
#   ./deploy.sh frontend   # Déployer uniquement le frontend
#   ./deploy.sh all        # Déployer backend + frontend
#
# ============================================

set -e  # Exit on error

# Configuration
VPS_HOST="root@168.231.85.181"
VPS_BACKEND_PATH="/var/www/letrousseau/backend"
VPS_FRONTEND_PATH="/var/www/html"
LOCAL_PATH="$(pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_header() {
    echo ""
    echo "======================================"
    echo "$1"
    echo "======================================"
    echo ""
}

# Deploy Backend
deploy_backend() {
    print_header "DÉPLOIEMENT DU BACKEND"
    
    print_info "Création de l'archive backend..."
    tar -czf backend.tar.gz backend/
    print_success "Archive créée"
    
    print_info "Transfert vers le VPS..."
    scp backend.tar.gz $VPS_HOST:/tmp/
    print_success "Fichiers transférés"
    
    print_info "Installation sur le VPS..."
    ssh $VPS_HOST << 'ENDSSH'
        set -e
        
        # Créer le dossier si nécessaire
        mkdir -p /var/www/letrousseau
        
        # Sauvegarder l'ancien backend
        if [ -d "/var/www/letrousseau/backend" ]; then
            echo "Sauvegarde de l'ancien backend..."
            mv /var/www/letrousseau/backend /var/www/letrousseau/backend.backup.$(date +%Y%m%d_%H%M%S)
        fi
        
        # Extraire le nouveau backend
        cd /var/www/letrousseau
        tar -xzf /tmp/backend.tar.gz
        
        # Installer les dépendances
        cd backend
        npm install --production
        
        # Redémarrer PM2
        if pm2 list | grep -q "letrousseau-api"; then
            echo "Redémarrage de l'API..."
            pm2 restart letrousseau-api
        else
            echo "Démarrage de l'API..."
            pm2 start server.js --name letrousseau-api
            pm2 save
        fi
        
        # Nettoyer
        rm /tmp/backend.tar.gz
        
        echo "✅ Backend déployé avec succès"
ENDSSH
    
    print_success "Backend déployé avec succès"
    
    # Nettoyer localement
    rm backend.tar.gz
    
    print_info "Test de l'API..."
    sleep 2
    ssh $VPS_HOST "pm2 logs letrousseau-api --lines 10 --nostream"
}

# Deploy Frontend
deploy_frontend() {
    print_header "DÉPLOIEMENT DU FRONTEND"
    
    print_info "Build du frontend..."
    npm run build
    print_success "Build terminé"
    
    print_info "Création de l'archive..."
    tar -czf dist.tar.gz dist/
    print_success "Archive créée"
    
    print_info "Transfert vers le VPS..."
    scp dist.tar.gz $VPS_HOST:/tmp/
    print_success "Fichiers transférés"
    
    print_info "Installation sur le VPS..."
    ssh $VPS_HOST << 'ENDSSH'
        set -e
        
        # Sauvegarder l'ancien frontend
        if [ -d "/var/www/html" ]; then
            echo "Sauvegarde de l'ancien frontend..."
            mv /var/www/html /var/www/html.backup.$(date +%Y%m%d_%H%M%S)
        fi
        
        # Extraire le nouveau frontend
        cd /var/www
        tar -xzf /tmp/dist.tar.gz
        mv dist html
        
        # Permissions
        chown -R www-data:www-data /var/www/html
        chmod -R 755 /var/www/html
        
        # Nettoyer
        rm /tmp/dist.tar.gz
        
        echo "✅ Frontend déployé avec succès"
ENDSSH
    
    print_success "Frontend déployé avec succès"
    
    # Nettoyer localement
    rm dist.tar.gz
}

# Main
case "$1" in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_backend
        deploy_frontend
        ;;
    *)
        print_error "Usage: $0 {backend|frontend|all}"
        exit 1
        ;;
esac

print_header "DÉPLOIEMENT TERMINÉ"
print_success "Tout est en place !"
print_info "Vérifiez le site : https://www.asso-letrousseau.com"
print_info "Vérifiez l'API : https://api.asso-letrousseau.com/api/health"
