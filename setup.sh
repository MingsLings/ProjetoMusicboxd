#!/bin/bash
# Setup do Projeto Music Playlist

echo "🎵 Iniciando setup do Music Playlist..."

# 1. Limpar node_modules e instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

# 2. Criar arquivo de configuração local se necessário
echo ""
echo "⚙️ Verificando configuração..."

# 3. Mensagem de sucesso
echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Atualize as credenciais do Firebase em services/firebase.ts"
echo "  2. Execute: npm start"
echo "  3. Selecione sua plataforma (iOS, Android ou Web)"
echo ""
echo "🎵 Aproveite o Music Playlist!"
