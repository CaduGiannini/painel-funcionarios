# 🔥 Configuração do Firebase para o Organograma Interativo

## 📋 Pré-requisitos
- Conta Google
- Navegador web moderno
- Conexão com internet

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar projeto"**
3. Digite um nome para seu projeto (ex: "organograma-empresa")
4. Aceite os termos e clique em **"Continuar"**
5. Desabilite o Google Analytics (opcional) e clique em **"Criar projeto"**

### 2. Configurar Realtime Database

1. No painel do Firebase, clique em **"Realtime Database"** no menu lateral
2. Clique em **"Criar banco de dados"**
3. Escolha uma localização (recomendado: `us-central1`)
4. Selecione **"Iniciar no modo de teste"** (regras permissivas para desenvolvimento)
5. Clique em **"Ativar"**

### 3. Obter Configurações do Projeto

1. No painel do Firebase, clique no ⚙️ **"Configurações do projeto"**
2. Role até a seção **"Seus apps"**
3. Clique em **"Adicionar app"** e selecione o ícone **</> (Web)**
4. Digite um nome para o app (ex: "organograma-web")
5. **NÃO** marque "Configurar também o Firebase Hosting"
6. Clique em **"Registrar app"**
7. Copie a configuração que aparece (o objeto `firebaseConfig`)

### 4. Configurar o App Web

1. Abra o arquivo `index.html`
2. Localize a seção com `firebaseConfig` (linha ~428)
3. Substitua a configuração de exemplo pelas suas configurações:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 5. Configurar Regras de Segurança

**Para desenvolvimento/teste (INSEGURO - apenas para testes):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Para produção (SEGURO - recomendado):**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Para aplicar as regras:
1. Vá para **"Realtime Database"** > **"Regras"**
2. Cole o código JSON das regras
3. Clique em **"Publicar"**

## 🎯 Testando a Configuração

1. Abra o arquivo `index.html` no navegador
2. Você deve ver uma barra de status verde com "Conexão com Firebase OK!"
3. Adicione alguns funcionários e departamentos
4. Recarregue a página - os dados devem persistir
5. Verifique no Firebase Console se os dados aparecem em **"Realtime Database"** > **"Dados"**

## 🔧 Funcionalidades de Persistência

### ✅ O que funciona automaticamente:
- **Sincronização em tempo real** - mudanças aparecem instantaneamente
- **Backup automático** - dados salvos na nuvem
- **Fallback local** - se o Firebase falhar, usa localStorage
- **Reconexão automática** - recupera conexão quando disponível

### 📊 Estrutura dos Dados:
```
painelFuncionarios/
├── title: "🏢 Painel de Funcionários"
├── subtitle: "Arraste e solte..."
├── employeeCounter: 5
├── employees/
│   ├── [0]: { id: 1, name: "João", role: "Dev", dept: "dep123" }
│   └── [1]: { id: 2, name: "Maria", role: "UX", dept: null }
└── departments/
    └── [0]: { id: "dep123", name: "TI", color: "#667eea" }
```

## 🚨 Solução de Problemas

### Erro: "Permission Denied"
- Verifique se as regras do Firebase estão corretas
- Para testes, use regras abertas (`.read: true, .write: true`)

### Erro: "Firebase not initialized"
- Verifique se copiou corretamente a configuração
- Confirme se o Realtime Database está ativado

### Dados não sincronizam
- Verifique conexão com internet
- Abra o Console do navegador (F12) para ver erros
- Teste o botão "Testar Conexão"

### Fallback para localStorage
- Se o Firebase falhar, o app usa armazenamento local
- Os dados ficam salvos apenas no navegador atual
- Quando o Firebase voltar, sincroniza automaticamente

## 🔐 Segurança em Produção

Para usar em produção, implemente:

1. **Autenticação de usuários**
2. **Regras de segurança específicas**
3. **Validação de dados**
4. **Backup regular**

### Exemplo de regras seguras:
```json
{
  "rules": {
    "painelFuncionarios": {
      ".read": "auth != null && auth.uid === 'SEU_UID_ADMIN'",
      ".write": "auth != null && auth.uid === 'SEU_UID_ADMIN'"
    }
  }
}
```

## 📱 Acesso

Após configurado, você pode acessar o organograma através de:
- **Local**: `http://localhost:8000` (com servidor Python rodando)
- **Arquivo**: Abrir `index.html` diretamente no navegador
- **Hospedagem**: Deploy em qualquer servidor web

## 🎉 Pronto!

Seu organograma interativo agora tem:
- ✅ Persistência de dados na nuvem
- ✅ Sincronização em tempo real
- ✅ Backup automático
- ✅ Interface moderna e responsiva
- ✅ Drag & drop funcional
- ✅ Exportação de dados

**Divirta-se organizando sua equipe! 🚀**