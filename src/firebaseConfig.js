import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

/* 
INSTRUÇÕES PARA CONFIGURAR O FIREBASE:

OPÇÃO 1 - Variáveis de Ambiente (RECOMENDADO PARA PRODUÇÃO):
1. Crie um arquivo .env na raiz do projeto
2. Copie o conteúdo de .env.example
3. Preencha com suas configurações do Firebase
4. Para GitHub Pages, configure as variáveis nos Secrets do repositório

OPÇÃO 2 - Configuração Direta (APENAS PARA DESENVOLVIMENTO):
1. Substitua as configurações abaixo pelas suas
2. Vá para https://console.firebase.google.com/
3. Selecione seu projeto > Configurações > Geral > Seus apps

CONFIGURAÇÃO DAS REGRAS DO REALTIME DATABASE:
- Vá para "Realtime Database" > "Regras"
- Para TESTE, use estas regras (INSEGURAS):
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

- Para PRODUÇÃO, use regras mais seguras:
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/

const firebaseConfig = {
  // Usa variáveis de ambiente se disponíveis, senão usa valores padrão
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDJrlB1Cf8wNNGUfVIPqsDY3LYSpA5Scrw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "organograma-c9d08.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://organograma-c9d08-default-rtdb.firebaseio.com/",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "organograma-c9d08",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "organograma-c9d08.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "43858988878",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:43858988878:web:abc123def456"
};

let app = null;
let database = null;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase inicializado com sucesso');
  
  // Log das configurações em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      usingEnvVars: !!process.env.REACT_APP_FIREBASE_API_KEY
    });
  }
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
}

export { database };
export const dataPath = 'painelFuncionarios';