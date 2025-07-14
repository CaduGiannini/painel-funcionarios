import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database, dataPath } from '../firebaseConfig';

export const useFirebase = () => {
  const [data, setData] = useState({
    title: '🏢 Painel de Funcionários',
    subtitle: 'Arraste e solte os funcionários nos departamentos',
    employeeCounter: 0,
    employees: [],
    departments: []
  });

  const [status, setStatus] = useState({
    message: 'Conectando ao Firebase...',
    type: 'connecting',
    isConnected: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateStatus = useCallback((message, type) => {
    setStatus({
      message,
      type,
      isConnected: type === 'connected'
    });
  }, []);

  // Função para testar conexão
  const testConnection = useCallback(() => {
    if (!database) {
      updateStatus('Firebase não inicializado. Verifique a configuração.', 'error');
      return;
    }
    
    updateStatus('Testando conexão...', 'connecting');
    
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        updateStatus('Conexão com Firebase OK!', 'connected');
      } else {
        updateStatus('Sem conexão com Firebase', 'error');
      }
    }, (error) => {
      console.error('Erro ao testar conexão:', error);
      updateStatus('Erro de conexão: ' + error.message, 'error');
    });
  }, [updateStatus]);

  // Função para limpar dados inválidos
  const cleanData = (data) => {
    const cleanedData = JSON.parse(JSON.stringify(data));
    
    // Limpar funcionários
    if (cleanedData.employees) {
      cleanedData.employees = cleanedData.employees.map(emp => ({
        ...emp,
        // Garantir que dept seja null se for NaN ou inválido
        dept: (emp.dept === null || emp.dept === undefined || isNaN(emp.dept)) ? null : emp.dept,
        // Garantir que ID seja um número válido
        id: isNaN(emp.id) ? Date.now() + Math.random() : emp.id
      }));
    }
    
    // Limpar departamentos
    if (cleanedData.departments) {
      cleanedData.departments = cleanedData.departments.map(dept => ({
        ...dept,
        // Garantir que ID seja um número válido
        id: isNaN(dept.id) ? Date.now() + Math.random() : dept.id
      }));
    }
    
    return cleanedData;
  };

  // Função para salvar dados
  const saveData = useCallback(async (newData) => {
    if (isSaving || !database || !status.isConnected) {
      console.log('Não é possível salvar:', { 
        isSaving, 
        hasDb: !!database, 
        isConnected: status.isConnected 
      });
      return;
    }
    
    setIsSaving(true);
    updateStatus('Salvando dados...', 'connecting');
    
    try {
      // Limpar dados antes de salvar
      const cleanedData = cleanData(newData);
      console.log('Dados originais:', newData);
      console.log('Dados limpos para salvar:', cleanedData);
      
      const dataRef = ref(database, dataPath);
      await set(dataRef, cleanedData);
      console.log('Dados salvos com sucesso no Firebase');
      updateStatus('Dados salvos com sucesso!', 'connected');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      updateStatus('Erro ao salvar: ' + error.message, 'error');
      
      if (error.code === 'PERMISSION_DENIED') {
        updateStatus('ERRO: Sem permissão para salvar. Verifique as regras do Firebase.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, database, status.isConnected, updateStatus]);

  // Função para resetar dados
  const resetData = useCallback(async () => {
    if (!database || !status.isConnected) return;
    
    try {
      const dataRef = ref(database, dataPath);
      await remove(dataRef);
      updateStatus('Dados resetados com sucesso!', 'connected');
    } catch (error) {
      updateStatus('Erro ao resetar: ' + error.message, 'error');
    }
  }, [database, status.isConnected, updateStatus]);

  // Listener para mudanças em tempo real
  useEffect(() => {
    if (!database) return;
    
    const dataRef = ref(database, dataPath);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          // Garantir que arrays existam
          if (!firebaseData.employees) firebaseData.employees = [];
          if (!firebaseData.departments) firebaseData.departments = [];
          
          setData(firebaseData);
          console.log('Dados carregados do Firebase:', firebaseData);
          updateStatus('Dados sincronizados com Firebase', 'connected');
        } else {
          console.log('Nenhum dado encontrado no Firebase');
          updateStatus('Nenhum dado encontrado no Firebase', 'connected');
        }
      } catch (error) {
        console.error('Erro ao processar dados do Firebase:', error);
        updateStatus('Erro ao processar dados: ' + error.message, 'error');
      }
    }, (error) => {
      console.error('Erro no listener do Firebase:', error);
      updateStatus('Erro de permissão: ' + error.message, 'error');
      
      if (error.code === 'PERMISSION_DENIED') {
        updateStatus('ERRO: Permissão negada. Verifique as regras do Firebase.', 'error');
      }
    });

    return () => unsubscribe();
  }, [updateStatus]);

  // Inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      testConnection();
    }, 1000);

    return () => clearTimeout(timer);
  }, [testConnection]);

  return {
    data,
    setData,
    status,
    saveData,
    resetData,
    testConnection,
    isSaving
  };
};