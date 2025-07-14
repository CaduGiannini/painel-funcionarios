# 🏢 Organograma Interativo - React

Uma aplicação React moderna e elegante para gerenciamento de funcionários e departamentos com design profissional, fotos de perfil, drag & drop intuitivo e sincronização em tempo real.

## ✨ Funcionalidades Principais

### 👤 **Sistema de Perfis Completo**
- ✅ **Fotos de perfil** - Upload por drag & drop ou clique, com preview
- ✅ **Avatares inteligentes** - Iniciais coloridas quando não há foto
- ✅ **Informações expandidas** - Nome, cargo, email, telefone, observações

### 🎨 **Design Moderno e Profissional**
- ✅ **Interface glass-morphism** - Efeitos de vidro e blur elegantes
- ✅ **Gradientes animados** - Background dinâmico com cores vibrantes
- ✅ **Animações suaves** - Hover effects e transições profissionais
- ✅ **Tipografia moderna** - Fonte Inter para melhor legibilidade

### 🔧 **Drag & Drop Aprimorado**
- ✅ **Sistema robusto** - Funcionamento corrigido e confiável
- ✅ **Feedback visual** - Áreas destacadas durante o arraste
- ✅ **Detecção precisa** - Controle fino de entrada e saída

### 🏢 **Departamentos Editáveis**
- ✅ **Edição inline** - Duplo clique para editar nomes
- ✅ **Campos expandidos** - Gerente, localização, orçamento, metas
- ✅ **Color picker avançado** - 16 cores predefinidas + personalizada
- ✅ **Estatísticas visuais** - Contador de funcionários por departamento

### 📱 **Responsividade Total**
- ✅ **Design adaptativo** - Perfeito em qualquer dispositivo
- ✅ **Touch-friendly** - Otimizado para dispositivos móveis
- ✅ **Modais responsivos** - Formulários que se adaptam à tela

### 🔄 **Funcionalidades Técnicas**
- ✅ **Firebase Realtime Database** - Sincronização automática
- ✅ **Exportação de dados** - Backup em formato JSON
- ✅ **Status de conexão** - Monitoramento em tempo real
- ✅ **Deploy automatizado** - GitHub Pages com Actions

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Firebase
- Conta no GitHub (para deploy)

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd organograma-react
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase** (veja seção detalhada abaixo)

4. **Execute a aplicação**
   ```bash
   npm start
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔥 Deploy no GitHub Pages

### 🚀 Deploy Automático (Recomendado)

1. **Configure o repositório**
   ```bash
   # Edite package.json - linha homepage:
   "homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"
   
   # Primeiro commit
   git add .
   git commit -m "Setup para deploy"
   git push origin main
   ```

2. **Configure GitHub Pages**
   - Repositório → Settings → Pages
   - Source: `GitHub Actions`

3. **Deploy automático**
   - Cada push na branch `main` fará deploy automaticamente
   - Acompanhe em: Repositório → Actions

4. **Acesse sua aplicação**
   - URL: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO`

### 📤 Deploy Manual (Alternativo)

```bash
npm run deploy
```

### 📚 Guias Detalhados

- **[DEPLOY.md](DEPLOY.md)** - Guia completo de deploy
- **[QUICK_START.md](QUICK_START.md)** - Início rápido
- **Script auxiliar**: `./deploy-commands.sh` (Linux/Mac)

## 🔧 Configuração do Firebase

### Opção 1: Variáveis de Ambiente (Recomendado)

1. **Copie o arquivo de exemplo**
   ```bash
   cp .env.example .env
   ```

2. **Preencha as configurações**
   ```env
   REACT_APP_FIREBASE_API_KEY=sua_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   # ... outras configurações
   ```

3. **Para GitHub Pages** - Configure secrets:
   - Repositório → Settings → Secrets → Actions
   - Adicione todas as variáveis REACT_APP_FIREBASE_*

### Opção 2: Configuração Direta

Edite `src/firebaseConfig.js` com suas configurações do Firebase.

### Configuração do Realtime Database

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 🎯 Como usar

### Adicionando Funcionários
1. Preencha o nome e cargo no formulário superior
2. Opcionalmente selecione um departamento
3. Clique em "Adicionar"

### Criando Departamentos
1. Clique no botão "➕ Departamento"
2. Digite o nome do departamento
3. Use os botões de edição para adicionar mais detalhes

### Movendo Funcionários
- **Arrastar e soltar**: Arraste funcionários entre departamentos
- **Edição via modal**: Clique no botão de edição (✏️) e altere o departamento

### Editando Informações
- **Títulos**: Clique uma vez para editar título principal e subtítulo
- **Nomes de departamentos**: Duplo clique no nome
- **Detalhes completos**: Use os botões de edição (✏️)

### Outras Funcionalidades
- **🔄 Resetar**: Remove todos os dados
- **💾 Exportar**: Baixa um backup em JSON
- **🔧 Testar Conexão**: Verifica conexão com Firebase

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Employee.js          # Componente de funcionário
│   ├── Department.js        # Componente de departamento
│   ├── Modal.js            # Modal base reutilizável
│   ├── EmployeeModal.js    # Modal de edição de funcionário
│   └── DepartmentModal.js  # Modal de edição de departamento
├── hooks/
│   └── useFirebase.js      # Hook personalizado para Firebase
├── firebaseConfig.js       # Configuração do Firebase
├── App.js                  # Componente principal
├── App.css                 # Estilos principais
├── index.js               # Ponto de entrada
└── index.css              # Estilos globais

# Arquivos de deploy
.github/workflows/deploy.yml # GitHub Actions
.env.example                # Exemplo de variáveis
deploy-commands.sh          # Script auxiliar
DEPLOY.md                   # Guia de deploy
```

## 🔧 Scripts Disponíveis

```bash
npm start      # Desenvolvimento
npm run build  # Build de produção
npm test       # Executar testes
npm run deploy # Deploy manual (gh-pages)
```

## 🌐 URLs

- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO`

## 🎨 Personalização

### Cores dos Departamentos
As cores podem ser definidas individualmente para cada departamento através do modal de edição.

### Estilos
Edite `src/App.css` para personalizar a aparência da aplicação.

### Campos Adicionais
Para adicionar novos campos aos funcionários ou departamentos:
1. Atualize os modais correspondentes
2. Modifique a estrutura de dados no hook `useFirebase.js`
3. Ajuste os componentes `Employee.js` ou `Department.js`

## 🔍 Solução de Problemas

### Deploy Issues
- Verificar configuração do GitHub Pages
- Conferir logs no GitHub Actions
- Validar URL da homepage no package.json

### Firebase Issues
- Verificar regras do Realtime Database
- Confirmar configurações no firebaseConfig.js
- Testar conexão usando botão na aplicação

### Build Issues
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas:
1. Verifique os guias de troubleshooting
2. Consulte a documentação do Firebase
3. Verifique o console do navegador para erros
4. Teste a conexão usando o botão "🔧 Testar Conexão"

---

**Criado com ❤️ usando React + Firebase + GitHub Pages**
