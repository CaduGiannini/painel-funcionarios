#!/bin/bash

# 🚀 Comandos Rápidos para Deploy no GitHub Pages
# Execute: chmod +x deploy-commands.sh && ./deploy-commands.sh

echo "🚀 Deploy Organograma React - GitHub Pages"
echo "==========================================="

# Função para setup inicial
setup_github() {
    echo "📋 1. SETUP INICIAL DO REPOSITÓRIO"
    echo "Substitua SEU_USUARIO e SEU_REPOSITORIO pelos valores corretos:"
    echo ""
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial commit - Organograma React'"
    echo "git branch -M main"
    echo "git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git"
    echo "git push -u origin main"
    echo ""
}

# Função para build local
build_local() {
    echo "🔨 2. TESTAR BUILD LOCAL"
    echo "npm run build"
    echo ""
}

# Função para deploy manual
deploy_manual() {
    echo "📤 3. DEPLOY MANUAL (ALTERNATIVO)"
    echo "npm run deploy"
    echo ""
}

# Função para configuração do package.json
config_package() {
    echo "⚙️  4. ATUALIZAR PACKAGE.JSON"
    echo "Edite o arquivo package.json e substitua a linha:"
    echo '"homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"'
    echo "pelos seus dados reais"
    echo ""
}

# Função para configuração do GitHub Pages
config_pages() {
    echo "🌐 5. CONFIGURAR GITHUB PAGES"
    echo "1. Acesse: https://github.com/SEU_USUARIO/SEU_REPOSITORIO/settings"
    echo "2. Menu lateral: Pages"
    echo "3. Source: GitHub Actions"
    echo "4. Salvar configurações"
    echo ""
}

# Função para variáveis de ambiente
config_env() {
    echo "🔐 6. CONFIGURAR VARIÁVEIS FIREBASE (OPCIONAL)"
    echo "No GitHub:"
    echo "Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    echo "Adicione estas variáveis:"
    echo "REACT_APP_FIREBASE_API_KEY"
    echo "REACT_APP_FIREBASE_AUTH_DOMAIN"
    echo "REACT_APP_FIREBASE_DATABASE_URL"
    echo "REACT_APP_FIREBASE_PROJECT_ID"
    echo "REACT_APP_FIREBASE_STORAGE_BUCKET"
    echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
    echo "REACT_APP_FIREBASE_APP_ID"
    echo ""
}

# Menu principal
echo "Escolha uma opção:"
echo "1) Setup inicial do repositório"
echo "2) Testar build local"
echo "3) Deploy manual"
echo "4) Ver configuração package.json"
echo "5) Ver configuração GitHub Pages"
echo "6) Ver configuração variáveis Firebase"
echo "7) Mostrar todos os passos"
echo "0) Sair"
echo ""

read -p "Digite sua opção: " opcao

case $opcao in
    1) setup_github ;;
    2) build_local ;;
    3) deploy_manual ;;
    4) config_package ;;
    5) config_pages ;;
    6) config_env ;;
    7) 
        setup_github
        config_package
        config_pages
        build_local
        config_env
        echo "✅ Deploy automático será executado após push para main!"
        echo "📍 URL final: https://SEU_USUARIO.github.io/SEU_REPOSITORIO"
        ;;
    0) echo "👋 Até logo!" ;;
    *) echo "❌ Opção inválida!" ;;
esac