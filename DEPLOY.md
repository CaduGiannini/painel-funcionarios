# 🚀 Deploy no GitHub Pages

Este guia mostra como fazer deploy da aplicação React no GitHub Pages usando GitHub Actions.

## 📋 Pré-requisitos

- Conta no GitHub
- Repositório criado
- Projeto React configurado (já feito ✅)

## 🛠️ Configuração Inicial

### 1. Configurar Repositório

1. **Criar repositório no GitHub**
   ```bash
   # Se ainda não fez
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Atualizar package.json**
   - Edite a linha `homepage` no `package.json`:
   ```json
   "homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"
   ```

### 2. Configurar GitHub Pages

1. **Acessar configurações do repositório**
   - Vá para: `https://github.com/SEU_USUARIO/SEU_REPOSITORIO/settings`

2. **Configurar Pages**
   - Menu lateral: `Pages`
   - Source: `GitHub Actions`
   - Salvar configurações

### 3. Configurar Variáveis do Firebase (Opcional)

Para manter as configurações do Firebase seguras:

1. **Acessar Secrets**
   - Repositório → Settings → Secrets and variables → Actions

2. **Adicionar Repository Secrets**
   ```
   REACT_APP_FIREBASE_API_KEY=sua_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://seu-projeto-default-rtdb.firebaseio.com/
   REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
   REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## 🚀 Deploy Automático

### Usando GitHub Actions (Recomendado)

O deploy será **automático** a cada push na branch `main`:

1. **Fazer commit das mudanças**
   ```bash
   git add .
   git commit -m "Deploy setup"
   git push origin main
   ```

2. **Acompanhar o build**
   - Vá em: `Actions` no seu repositório
   - Aguarde o workflow `Deploy React App to GitHub Pages`

3. **Acessar aplicação**
   - URL: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO`

### Deploy Manual (Alternativo)

Se preferir deploy manual:

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Fazer deploy
npm run deploy
```

## 🔧 Workflow GitHub Actions

O arquivo `.github/workflows/deploy.yml` está configurado para:

- ✅ Executar em push para `main`
- ✅ Instalar dependências
- ✅ Fazer build da aplicação
- ✅ Deploy automático no GitHub Pages
- ✅ Usar Node.js 18
- ✅ Cache de dependências
- ✅ Tratar warnings como não fatais

## 🌍 URLs de Acesso

Após o deploy:

- **Produção**: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO`
- **Desenvolvimento**: `http://localhost:3000`

## 🔍 Solução de Problemas

### ❌ Build falha

1. **Verificar erros no Actions**
   - Repositório → Actions → Último workflow
   - Ler logs detalhados

2. **Testar build local**
   ```bash
   npm run build
   ```

3. **Configurações comuns**
   ```bash
   # Limpar cache
   npm cache clean --force
   
   # Reinstalar dependências
   rm -rf node_modules package-lock.json
   npm install
   ```

### ❌ Página 404

1. **Verificar homepage no package.json**
   ```json
   "homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"
   ```

2. **Verificar configuração do GitHub Pages**
   - Settings → Pages → Source: `GitHub Actions`

### ❌ Firebase não conecta

1. **Verificar configurações**
   - Arquivo `src/firebaseConfig.js`
   - Variáveis de ambiente nos Secrets

2. **Verificar regras do Firebase**
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

## 📊 Status do Deploy

Após configurar, você pode adicionar badges no README:

```markdown
![Deploy Status](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/workflows/Deploy%20React%20App%20to%20GitHub%20Pages/badge.svg)
```

## 🔄 Atualizações Futuras

Para atualizar a aplicação:

1. **Fazer mudanças no código**
2. **Commit e push**
   ```bash
   git add .
   git commit -m "Atualização: descrição das mudanças"
   git push origin main
   ```
3. **Deploy automático** será executado

## 🎯 Dicas Extras

- **Branch protection**: Configure proteção da branch `main`
- **Pull requests**: Use PRs para revisar mudanças
- **Environments**: Configure environments para staging/produção
- **Custom domain**: Configure domínio personalizado se tiver

---

**🚀 Sua aplicação React estará online em poucos minutos!**