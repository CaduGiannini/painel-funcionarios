#!/bin/bash

echo "🚀 Instalando Organograma React..."
echo "=================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Configure seu projeto Firebase:"
echo "   - Acesse https://console.firebase.google.com/"
echo "   - Crie um projeto e ative o Realtime Database"
echo "   - Copie as configurações para src/firebase.js"
echo ""
echo "2. Execute o projeto:"
echo "   npm start"
echo ""
echo "3. Acesse http://localhost:3000"
echo ""
echo "📚 Para mais informações, leia o README.md"
echo ""
echo "🎉 Instalação concluída com sucesso!"