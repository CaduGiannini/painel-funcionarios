# Organograma Interativo React

Sistema de organograma interativo desenvolvido em React com sincronização em tempo real via Firebase. Permite gerenciar funcionários e departamentos com funcionalidade de drag & drop.

## 🚀 Funcionalidades

- ✅ Adicionar, editar e remover funcionários
- ✅ Criar, editar e remover departamentos
- ✅ Arrastar e soltar funcionários entre departamentos
- ✅ Sincronização em tempo real com Firebase
- ✅ Interface responsiva e intuitiva
- ✅ Edição inline de títulos
- ✅ Exportação de dados em JSON
- ✅ Sistema de cores personalizáveis para departamentos
- ✅ Status de conexão em tempo real

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Firebase

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd organograma-react
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto ou use um existente
   - Ative o Realtime Database
   - Copie as configurações do projeto

4. Configure as credenciais do Firebase:
   - Abra o arquivo `src/firebase.js`
   - Substitua as configurações pelo seu projeto Firebase:

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

5. Configure as regras do Realtime Database:

Para **desenvolvimento/teste** (INSEGURO - apenas para testes):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Para **produção** (mais seguro):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## 🚀 Executando o projeto

```bash
npm start
```

O aplicativo será aberto em [http://localhost:3000](http://localhost:3000).

## 📱 Como usar

### Adicionando Funcionários
1. Preencha o nome e cargo no formulário
2. Opcionalmente selecione um departamento
3. Clique em "Adicionar"

### Gerenciando Departamentos
1. Clique em "➕ Departamento" para criar um novo
2. Use o botão ✏️ para editar informações detalhadas
3. Use o botão ✖ para remover (funcionários voltam para o pool)

### Drag & Drop
- Arraste funcionários entre departamentos
- Arraste funcionários de volta para o pool (sem departamento)

### Edição Avançada
- Clique no ✏️ ao lado dos funcionários para editar informações completas
- Clique no ✏️ ao lado dos departamentos para configurar cores e descrições
- Clique nos títulos principais para editá-los

### Ferramentas
- **🔄 Resetar**: Remove todos os dados
- **💾 Exportar**: Baixa backup em JSON
- **🔧 Testar Conexão**: Verifica status do Firebase

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── StatusBar.js          # Barra de status de conexão
│   ├── AddEmployeeForm.js    # Formulário de adição
│   ├── Employee.js           # Componente de funcionário
│   ├── EmployeePool.js       # Pool de funcionários
│   ├── Department.js         # Componente de departamento
│   ├── EmployeeModal.js      # Modal de edição de funcionário
│   ├── DepartmentModal.js    # Modal de edição de departamento
│   └── EditableTitle.js      # Títulos editáveis
├── firebase.js               # Configuração do Firebase
├── App.js                    # Componente principal
├── App.css                   # Estilos da aplicação
└── index.js                  # Ponto de entrada
```

## 🎨 Personalização

### Cores dos Departamentos
Cada departamento pode ter sua cor personalizada através do modal de edição. A cor afeta:
- Borda do departamento
- Fundo sutil do departamento
- Cor dos funcionários dentro do departamento

### Responsividade
O layout se adapta automaticamente para dispositivos móveis, empilhando elementos verticalmente.

## 🔒 Segurança

⚠️ **Importante**: As configurações de exemplo usam regras do Firebase abertas para facilitar o desenvolvimento. Para produção:

1. Implemente autenticação de usuários
2. Configure regras de segurança apropriadas
3. Valide dados no backend
4. Use variáveis de ambiente para configurações sensíveis

## 🔄 Builds e Deploy

### Build para produção:
```bash
npm run build
```

### Deploy (exemplos):

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

**Netlify:**
```bash
npm run build
# Arraste a pasta build para netlify.com
```

## 🐛 Troubleshooting

### Problemas de Conexão
1. Verifique se as configurações do Firebase estão corretas
2. Confirme se o Realtime Database está ativado
3. Verifique as regras de segurança do banco
4. Use o botão "🔧 Testar Conexão" para diagnosticar

### Problemas de Permissão
- Erro `PERMISSION_DENIED`: Verifique as regras do Firebase
- Dados não salvam: Confirme se as regras permitem escrita

### Performance
- Para muitos funcionários (>100), considere implementar paginação
- Para uso intensivo, otimize as consultas do Firebase

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se seguiu todas as instruções de configuração
2. Consulte a documentação do Firebase
3. Abra uma issue no repositório

---

**Versão React convertida do organograma HTML original, mantendo todas as funcionalidades e melhorando a estrutura de código.**
