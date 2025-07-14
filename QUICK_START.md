# 🚀 Início Rápido - Organograma React

## ⚡ Execução Imediata

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Executar aplicação
npm start
```

A aplicação abrirá em `http://localhost:3000`

## 🔧 Configuração Firebase (IMPORTANTE!)

Para usar todas as funcionalidades, configure o Firebase:

1. **Acesse**: [Firebase Console](https://console.firebase.google.com/)
2. **Crie um projeto** ou use um existente
3. **Ative o Realtime Database**
4. **Configure regras temporárias** (para teste):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. **Copie as configurações** do seu projeto
6. **Substitua em `src/firebaseConfig.js`**:
   ```javascript
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "SEU_PROJETO.firebaseapp.com",
     databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com/",
     projectId: "SEU_PROJETO",
     storageBucket: "SEU_PROJETO.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## 🎯 Funcionalidades Principais

- ✅ **Adicionar funcionários**: Preencha formulário no topo
- ✅ **Criar departamentos**: Botão "➕ Departamento"
- ✅ **Arrastar e soltar**: Mova funcionários entre departamentos
- ✅ **Editar informações**: Clique nos botões ✏️
- ✅ **Edição rápida**: Duplo clique nos títulos
- ✅ **Exportar dados**: Botão "💾 Exportar"
- ✅ **Resetar**: Botão "🔄 Resetar"

## 🎨 Personalização

- **Cores**: Cada departamento pode ter cor personalizada
- **Campos**: Adicione novos campos editando os modais
- **Estilos**: Modifique `src/App.css`

## 🔧 Build para Produção

```bash
npm run build
```

## 📞 Problemas Comuns

1. **Firebase não conecta**: Verifique configurações e regras
2. **Arrastar não funciona**: Verifique se o JavaScript está habilitado
3. **Modal não abre**: Verifique erros no console do navegador

---

**Criado em React + Firebase** 🔥