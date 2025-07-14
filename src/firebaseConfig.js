import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

/* 
INSTRUÇÕES PARA CONFIGURAR O FIREBASE:

1. Substitua as configurações abaixo pelas suas:
   - Vá para https://console.firebase.google.com/
   - Selecione seu projeto
   - Vá em "Configurações do projeto" > "Geral"
   - Role até "Seus apps" e copie a configuração

2. Configure as regras do Realtime Database:
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
  // SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS:
  apiKey: "AIzaSyDJrlB1Cf8wNNGUfVIPqsDY3LYSpA5Scrw",
  authDomain: "organograma-c9d08.firebaseapp.com",
  databaseURL: "https://organograma-c9d08-default-rtdb.firebaseio.com/",
  projectId: "organograma-c9d08",
  storageBucket: "organograma-c9d08.appspot.com",
  messagingSenderId: "43858988878",
  appId: "1:43858988878:web:abc123def456"
};

let app = null;
let database = null;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
}

export { database };
export const dataPath = 'painelFuncionarios';