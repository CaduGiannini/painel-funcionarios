# Organograma Interativo - React

Uma aplicação React para gerenciamento de funcionários e departamentos com funcionalidade de drag-and-drop e sincronização em tempo real via Firebase.

## 🚀 Funcionalidades

- ✅ **Drag & Drop** - Arraste funcionários entre departamentos
- ✅ **Edição em tempo real** - Clique duplo para editar títulos
- ✅ **Modais de edição** - Edite informações detalhadas de funcionários e departamentos
- ✅ **Firebase Realtime Database** - Sincronização automática entre dispositivos
- ✅ **Cores personalizadas** - Defina cores para cada departamento
- ✅ **Exportação de dados** - Faça backup dos dados em JSON
- ✅ **Interface responsiva** - Funciona em desktop e mobile
- ✅ **Status de conexão** - Acompanhe o status da conexão com Firebase

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Firebase

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd organograma-react
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o Firebase**
   
   a. Acesse [Firebase Console](https://console.firebase.google.com/)
   
   b. Crie um novo projeto ou use um existente
   
   c. Ative o **Realtime Database**
   
   d. Configure as regras do banco (para desenvolvimento):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   
   e. Vá em **Configurações do Projeto** > **Geral** > **Seus apps**
   
   f. Adicione um app web e copie a configuração
   
   g. Substitua as configurações em `src/firebaseConfig.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "sua-api-key",
     authDomain: "seu-projeto.firebaseapp.com",
     databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

4. **Execute a aplicação**
   ```bash
   npm start
   # ou
   yarn start
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

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
```

## 🔧 Configuração de Produção

Para produção, configure regras de segurança mais restritivas no Firebase:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

E implemente autenticação conforme necessário.

## 🏗️ Build para Produção

```bash
npm run build
# ou
yarn build
```

Os arquivos de produção serão criados na pasta `build/`.

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
1. Verifique se o Firebase está configurado corretamente
2. Confirme se as regras do banco estão adequadas
3. Verifique o console do navegador para erros
4. Teste a conexão usando o botão "🔧 Testar Conexão"
