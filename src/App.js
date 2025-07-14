import React, { useState, useEffect, useCallback } from 'react';
import { database, dataPath } from './firebase';
import { ref, onValue, set, remove, onDisconnect } from 'firebase/database';
import StatusBar from './components/StatusBar';
import AddEmployeeForm from './components/AddEmployeeForm';
import EmployeePool from './components/EmployeePool';
import Department from './components/Department';
import EmployeeModal from './components/EmployeeModal';
import DepartmentModal from './components/DepartmentModal';
import EditableTitle from './components/EditableTitle';

function App() {
  const [data, setData] = useState({
    title: '🏢 Painel de Funcionários',
    subtitle: 'Arraste e solte os funcionários nos departamentos',
    employeeCounter: 0,
    employees: [],
    departments: []
  });

  const [status, setStatus] = useState({ message: 'Conectando ao Firebase...', type: 'connecting' });
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const [draggedType, setDraggedType] = useState(null);
  
  // Modal states
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [currentEditingEmployee, setCurrentEditingEmployee] = useState(null);
  const [currentEditingDepartment, setCurrentEditingDepartment] = useState(null);

  // Firebase connection test
  const testConnection = useCallback(() => {
    if (!database) {
      setStatus({ message: 'Firebase não inicializado. Verifique a configuração.', type: 'error' });
      return;
    }
    
    setStatus({ message: 'Testando conexão...', type: 'connecting' });
    
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        setStatus({ message: 'Conexão com Firebase OK!', type: 'connected' });
        setIsFirebaseConnected(true);
        setTimeout(() => {
          setStatus(prev => ({ ...prev, message: '', type: 'connected' }));
        }, 3000);
      } else {
        setStatus({ message: 'Sem conexão com Firebase', type: 'error' });
        setIsFirebaseConnected(false);
      }
    }, (error) => {
      console.error('Erro ao testar conexão:', error);
      setStatus({ message: 'Erro de conexão: ' + error.message, type: 'error' });
      setIsFirebaseConnected(false);
    });
  }, []);

  // Save data to Firebase
  const saveData = useCallback((newData = data) => {
    if (isSaving || !database || !isFirebaseConnected) {
      console.log('Não é possível salvar:', { isSaving, hasDb: !!database, isConnected: isFirebaseConnected });
      return;
    }
    
    setIsSaving(true);
    setStatus({ message: 'Salvando dados...', type: 'connecting' });
    
    set(ref(database, dataPath), newData)
      .then(() => {
        console.log('Dados salvos com sucesso no Firebase');
        setStatus({ message: 'Dados salvos com sucesso!', type: 'connected' });
        setIsSaving(false);
        setTimeout(() => {
          setStatus(prev => ({ ...prev, message: '', type: 'connected' }));
        }, 2000);
      })
      .catch((error) => {
        console.error('Erro ao salvar dados:', error);
        setStatus({ message: 'Erro ao salvar: ' + error.message, type: 'error' });
        setIsSaving(false);
        
        if (error.code === 'PERMISSION_DENIED') {
          setStatus({ message: 'ERRO: Sem permissão para salvar. Verifique as regras do Firebase.', type: 'error' });
        }
      });
  }, [data, isSaving, isFirebaseConnected]);

  // Initialize Firebase listener
  useEffect(() => {
    if (!database) return;

    const dataRef = ref(database, dataPath);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const newData = snapshot.val();
          // Garantir que arrays existam
          if (!newData.employees) newData.employees = [];
          if (!newData.departments) newData.departments = [];
          console.log('Dados carregados do Firebase:', newData);
          setData(newData);
          setStatus({ message: 'Dados sincronizados com Firebase', type: 'connected' });
          setIsFirebaseConnected(true);
          setTimeout(() => {
            setStatus(prev => ({ ...prev, message: '', type: 'connected' }));
          }, 2000);
        } else {
          console.log('Nenhum dado encontrado no Firebase');
          setStatus({ message: 'Nenhum dado encontrado no Firebase', type: 'connected' });
          setIsFirebaseConnected(true);
        }
      } catch (error) {
        console.error('Erro ao processar dados do Firebase:', error);
        setStatus({ message: 'Erro ao processar dados: ' + error.message, type: 'error' });
      }
    }, (error) => {
      console.error('Erro no listener do Firebase:', error);
      setStatus({ message: 'Erro de permissão: ' + error.message, type: 'error' });
      setIsFirebaseConnected(false);
      
      if (error.code === 'PERMISSION_DENIED') {
        setStatus({ message: 'ERRO: Permissão negada. Verifique as regras do Firebase.', type: 'error' });
      }
    });

    // Test connection on mount
    testConnection();

    return () => unsubscribe();
  }, [testConnection]);

  // Employee functions
  const addEmployee = useCallback((name, role, dept) => {
    const newData = { ...data };
    newData.employeeCounter++;
    newData.employees.push({
      id: newData.employeeCounter,
      name,
      role,
      dept: dept || null,
      email: '',
      phone: '',
      notes: ''
    });
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  const removeEmployee = useCallback((empId) => {
    if (!window.confirm('Tem certeza que deseja remover este funcionário?')) return;
    const newData = { ...data };
    newData.employees = newData.employees.filter(emp => emp.id !== empId);
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  const updateEmployee = useCallback((empId, updatedData) => {
    const newData = { ...data };
    const empIndex = newData.employees.findIndex(e => e.id === empId);
    if (empIndex !== -1) {
      newData.employees[empIndex] = { ...newData.employees[empIndex], ...updatedData };
      setData(newData);
      saveData(newData);
    }
  }, [data, saveData]);

  const moveEmployee = useCallback((empId, newDeptId) => {
    const newData = { ...data };
    const employee = newData.employees.find(emp => emp.id === empId);
    if (employee) {
      employee.dept = newDeptId || null;
      setData(newData);
      saveData(newData);
    }
  }, [data, saveData]);

  // Department functions
  const addDepartment = useCallback(() => {
    const name = window.prompt('Nome do departamento:');
    if (!name) return;
    const id = 'dep' + Math.random().toString(36).slice(2, 9);
    const newData = { ...data };
    newData.departments.push({
      id,
      name,
      manager: '',
      description: '',
      color: '#667eea'
    });
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  const removeDepartment = useCallback((depId) => {
    if (!window.confirm('Remover este departamento? Funcionários voltarão para o pool.')) return;
    const newData = { ...data };
    newData.employees.forEach(emp => {
      if (emp.dept === depId) emp.dept = null;
    });
    newData.departments = newData.departments.filter(dep => dep.id !== depId);
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  const updateDepartment = useCallback((deptId, updatedData) => {
    const newData = { ...data };
    const deptIndex = newData.departments.findIndex(d => d.id === deptId);
    if (deptIndex !== -1) {
      newData.departments[deptIndex] = { ...newData.departments[deptIndex], ...updatedData };
      setData(newData);
      saveData(newData);
    }
  }, [data, saveData]);

  // Title functions
  const updateTitle = useCallback((field, value) => {
    const newData = { ...data };
    newData[field] = value;
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  // Utility functions
  const resetAll = useCallback(() => {
    if (!window.confirm('Tem certeza? Isso apagará tudo!')) return;
    if (database && isFirebaseConnected) {
      remove(ref(database, dataPath))
        .then(() => {
          setStatus({ message: 'Dados resetados com sucesso!', type: 'connected' });
        })
        .catch((error) => {
          setStatus({ message: 'Erro ao resetar: ' + error.message, type: 'error' });
        });
    }
  }, [isFirebaseConnected]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'organograma_backup.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Modal functions
  const openEmployeeModal = useCallback((empId) => {
    const employee = data.employees.find(e => e.id === empId);
    if (employee) {
      setCurrentEditingEmployee(employee);
      setEmployeeModalOpen(true);
    }
  }, [data.employees]);

  const openDepartmentModal = useCallback((deptId) => {
    const department = data.departments.find(d => d.id === deptId);
    if (department) {
      setCurrentEditingDepartment(department);
      setDepartmentModalOpen(true);
    }
  }, [data.departments]);

  const closeEmployeeModal = useCallback(() => {
    setEmployeeModalOpen(false);
    setCurrentEditingEmployee(null);
  }, []);

  const closeDepartmentModal = useCallback(() => {
    setDepartmentModalOpen(false);
    setCurrentEditingDepartment(null);
  }, []);

  // Drag and drop functions
  const onDragStart = useCallback((e, type, id) => {
    setDraggedElement({ type, id });
    setDraggedType(type);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragEnd = useCallback((e) => {
    setDraggedElement(null);
    setDraggedType(null);
  }, []);

  const onDrop = useCallback((e, deptId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedType === 'employee') {
      moveEmployee(parseInt(draggedId), deptId);
    }
  }, [draggedType, moveEmployee]);

  return (
    <div className="container">
      <StatusBar status={status} />
      
      <div className="actions">
        <AddEmployeeForm 
          onAddEmployee={addEmployee}
          departments={data.departments}
        />
        <button className="btn" onClick={addDepartment}>➕ Departamento</button>
        <button className="btn" onClick={resetAll}>🔄 Resetar</button>
        <button className="btn" onClick={exportData}>💾 Exportar</button>
        <button className="btn" onClick={testConnection}>🔧 Testar Conexão</button>
      </div>

      <div className="main-title">
        <EditableTitle
          value={data.title}
          onChange={(value) => updateTitle('title', value)}
          className="title-input"
          tag="h1"
        />
        <EditableTitle
          value={data.subtitle}
          onChange={(value) => updateTitle('subtitle', value)}
          className="subtitle-input"
          tag="p"
          style={{ marginLeft: '18px', fontSize: '1.05em' }}
        />
      </div>

      <div className="employee-list">
        <EmployeePool
          employees={data.employees.filter(e => !e.dept)}
          departments={data.departments}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEditEmployee={openEmployeeModal}
          onRemoveEmployee={removeEmployee}
        />
        
        <div className="departments">
          {data.departments.map(dept => (
            <Department
              key={dept.id}
              department={dept}
              employees={data.employees.filter(e => e.dept === dept.id)}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onEditEmployee={openEmployeeModal}
              onRemoveEmployee={removeEmployee}
              onEditDepartment={openDepartmentModal}
              onRemoveDepartment={removeDepartment}
            />
          ))}
        </div>
      </div>

      {employeeModalOpen && (
        <EmployeeModal
          employee={currentEditingEmployee}
          departments={data.departments}
          onSave={(updatedEmployee) => {
            updateEmployee(currentEditingEmployee.id, updatedEmployee);
            closeEmployeeModal();
          }}
          onClose={closeEmployeeModal}
        />
      )}

      {departmentModalOpen && (
        <DepartmentModal
          department={currentEditingDepartment}
          onSave={(updatedDepartment) => {
            updateDepartment(currentEditingDepartment.id, updatedDepartment);
            closeDepartmentModal();
          }}
          onClose={closeDepartmentModal}
        />
      )}
    </div>
  );
}

export default App;