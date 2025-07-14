import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import { useFirebase } from './hooks/useFirebase';
import Employee from './components/Employee';
import Department from './components/Department';
import EmployeeModal from './components/EmployeeModal';
import DepartmentModal from './components/DepartmentModal';

function App() {
  const { data, setData, status, saveData, resetData, testConnection } = useFirebase();
  
  // Estados dos modais
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  
  // Estados do formulário de novo funcionário
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    dept: ''
  });
  
  // Estados de edição de título
  const [editingTitle, setEditingTitle] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const titleInputRef = useRef();
  
  // Estados de drag and drop
  const [draggedType, setDraggedType] = useState(null);
  
  // Estado para controlar visibilidade da barra de status
  const [statusVisible, setStatusVisible] = useState(false);

  // Auto-hide da barra de status
  React.useEffect(() => {
    if (status.type === 'error') {
      setStatusVisible(true);
      const timer = setTimeout(() => {
        setStatusVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (status.type === 'connected' && status.message === 'Dados salvos com sucesso!') {
      setStatusVisible(true);
      const timer = setTimeout(() => {
        setStatusVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (status.type !== 'connected') {
      setStatusVisible(true);
    } else {
      setStatusVisible(false);
    }
  }, [status]);

  // Função auxiliar para atualizar dados e salvar
  const updateDataAndSave = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, [setData, saveData]);

  // Handlers do formulário de novo funcionário
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
      alert('Nome e cargo são obrigatórios!');
      return;
    }

    const newId = Math.max(0, ...data.employees.map(emp => emp.id || 0)) + 1;
    const employee = {
      id: newId,
      name: newEmployee.name.trim(),
      role: newEmployee.role.trim(),
      dept: newEmployee.dept || null,
      email: '',
      phone: '',
      notes: '',
      photo: ''
    };

    const newData = {
      ...data,
      employees: [...data.employees, employee]
    };

    updateDataAndSave(newData);
    setNewEmployee({ name: '', role: '', dept: '' });
  };

  // Handler para adicionar departamento
  const handleAddDepartment = () => {
    const newId = Math.max(0, ...data.departments.map(dept => dept.id || 0)) + 1;
    const newData = {
      ...data,
      departments: [
        ...data.departments,
        {
          id: newId,
          name: 'Novo Departamento',
          manager: '',
          description: '',
          location: '',
          budget: '',
          goals: '',
          color: '#3b82f6'
        }
      ]
    };
    updateDataAndSave(newData);
  };

  // Handlers de edição de título
  const startEditingTitle = (type) => {
    setEditingTitle(type);
    setTempTitle(type === 'title' ? data.title : data.subtitle);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 0);
  };

  const finishEditingTitle = () => {
    const newData = {
      ...data,
      [editingTitle]: tempTitle
    };
    updateDataAndSave(newData);
    setEditingTitle(null);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditingTitle();
    } else if (e.key === 'Escape') {
      setTempTitle(editingTitle === 'title' ? data.title : data.subtitle);
      setEditingTitle(null);
    }
  };

  // Handlers de drag and drop melhorados
  const handleDragStart = (type, id) => {
    console.log('🚀 Drag start:', type, id);
    setDraggedType(type);
  };

  const handleDragEnd = () => {
    console.log('🏁 Drag end');
    setDraggedType(null);
  };

  const handleDrop = (draggedId, targetDeptId) => {
    console.log('📦 Drop:', { draggedId, targetDeptId, draggedType });
    
    if (draggedType === 'employee') {
      const draggedIdNum = parseInt(draggedId, 10);
      
      // Validação mais robusta para o departamento de destino
      let targetDeptIdNum = null;
      if (targetDeptId !== undefined && targetDeptId !== null && targetDeptId !== '' && targetDeptId !== 'null' && targetDeptId !== 'undefined') {
        const parsed = parseInt(targetDeptId, 10);
        if (!isNaN(parsed)) {
          targetDeptIdNum = parsed;
        }
      }
      
      if (isNaN(draggedIdNum)) {
        console.error('❌ ID do funcionário inválido:', draggedId);
        return;
      }
      // Só atualiza se o funcionário existe
      const exists = data.employees.some(emp => emp.id === draggedIdNum);
      if (!exists) {
        console.error('❌ Funcionário não encontrado:', draggedIdNum);
        return;
      }
      const newData = {
        ...data,
        employees: data.employees.map(emp => 
          emp.id === draggedIdNum ? { ...emp, dept: targetDeptIdNum } : emp
        )
      };
      updateDataAndSave(newData);
    }
  };

  // Handler para pool drop (movimentação livre)
  const handlePoolDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drop-hover');
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedType === 'employee') {
      handleDrop(draggedId, null);
    }
  };

  const handlePoolDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (draggedType === 'employee') {
      e.currentTarget.classList.add('drop-hover');
    }
  };

  const handlePoolDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      e.currentTarget.classList.remove('drop-hover');
    }
  };

  // Handler para edição rápida de título de departamento
  const handleDepartmentTitleEdit = (deptId, newName) => {
    const newData = {
      ...data,
      departments: data.departments.map(dept => 
        dept.id === deptId ? { ...dept, name: newName } : dept
      )
    };
    updateDataAndSave(newData);
  };

  // Handlers dos modais
  const openEmployeeModal = (employeeId = null) => {
    if (employeeId) {
      const employee = data.employees.find(emp => emp.id === employeeId);
      setCurrentEmployee(employee);
    } else {
      setCurrentEmployee(null);
    }
    setEmployeeModalOpen(true);
  };

  const openDepartmentModal = (deptId = null) => {
    if (deptId) {
      const department = data.departments.find(dept => dept.id === deptId);
      setCurrentDepartment(department);
    } else {
      setCurrentDepartment(null);
    }
    setDepartmentModalOpen(true);
  };

  const handleEmployeeSave = (employeeData) => {
    let newData;
    if (employeeData.id) {
      // Editar funcionário existente
      newData = {
        ...data,
        employees: data.employees.map(emp => 
          emp.id === employeeData.id ? employeeData : emp
        )
      };
    } else {
      // Criar novo funcionário
      const newId = Math.max(0, ...data.employees.map(emp => emp.id || 0)) + 1;
      newData = {
        ...data,
        employees: [...data.employees, { ...employeeData, id: newId }]
      };
    }
    updateDataAndSave(newData);
  };

  const handleDepartmentSave = (deptData) => {
    let newData;
    if (deptData.id) {
      // Editar departamento existente
      newData = {
        ...data,
        departments: data.departments.map(dept => 
          dept.id === deptData.id ? deptData : dept
        )
      };
    } else {
      // Criar novo departamento
      const newId = Math.max(0, ...data.departments.map(dept => dept.id || 0)) + 1;
      newData = {
        ...data,
        departments: [...data.departments, { ...deptData, id: newId }]
      };
    }
    updateDataAndSave(newData);
  };

  const handleEmployeeRemove = (employeeId) => {
    if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
      const newData = {
        ...data,
        employees: data.employees.filter(emp => emp.id !== employeeId)
      };
      updateDataAndSave(newData);
    }
  };

  const handleDepartmentRemove = (deptId) => {
    if (window.confirm('Tem certeza que deseja remover este departamento? Os funcionários serão movidos para o pool.')) {
      const newData = {
        ...data,
        departments: data.departments.filter(dept => dept.id !== deptId),
        employees: data.employees.map(emp => 
          emp.dept === deptId ? { ...emp, dept: null } : emp
        )
      };
      updateDataAndSave(newData);
    }
  };

  // Funcionários sem departamento (pool)
  const poolEmployees = data.employees.filter(emp => !emp.dept);

  return (
    <div className="container">
      {/* Status de Conexão */}
      <div className={`status-bar ${status.type} ${statusVisible ? 'show' : ''}`}>
        <span>{status.message}</span>
        {statusVisible && (
          <button 
            className="status-close" 
            onClick={() => setStatusVisible(false)}
            title="Fechar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Header */}
      <div className="main-title">
        <h1>
          {editingTitle === 'title' ? (
            <input
              ref={titleInputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={finishEditingTitle}
              onKeyDown={handleTitleKeyDown}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textAlign: 'center',
                width: '100%'
              }}
            />
          ) : (
            <span onClick={() => startEditingTitle('title')}>
              {data.title}
            </span>
          )}
        </h1>
        <p>
          {editingTitle === 'subtitle' ? (
            <input
              ref={titleInputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={finishEditingTitle}
              onKeyDown={handleTitleKeyDown}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textAlign: 'center',
                width: '100%'
              }}
            />
          ) : (
            <span onClick={() => startEditingTitle('subtitle')}>
              {data.subtitle}
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="actions">
        <form className="add-form" onSubmit={handleAddEmployee}>
          <input
            type="text"
            name="name"
            placeholder="Nome do Funcionário"
            value={newEmployee.name}
            onChange={handleNewEmployeeChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Cargo"
            value={newEmployee.role}
            onChange={handleNewEmployeeChange}
            required
          />
          <select
            name="dept"
            value={newEmployee.dept}
            onChange={handleNewEmployeeChange}
          >
            <option value="">Pool (sem departamento)</option>
            {data.departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Adicionar
          </button>
        </form>
        
        <button className="btn" onClick={handleAddDepartment}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Departamento
        </button>
        
        <button className="btn" onClick={resetData}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Resetar
        </button>
        
        <button className="btn" onClick={() => {
          const dataStr = JSON.stringify(data, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'organograma.json';
          link.click();
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Exportar
        </button>
        
        <button className="btn" onClick={testConnection}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
          </svg>
          Testar Conexão
        </button>
      </div>

      {/* Layout Principal */}
      <div className="main-layout">
        {/* Pool de Funcionários */}
        <div 
          className="employee-pool"
          onDrop={handlePoolDrop}
          onDragOver={handlePoolDragOver}
          onDragLeave={handlePoolDragLeave}
        >
          <div className="pool-header">
            <h3>🏊 Banco de Talentos</h3>
            <span className="pool-count">{poolEmployees.length}</span>
          </div>
          
          {poolEmployees.length === 0 ? (
            <div className="empty-pool">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Arraste funcionários aqui ou adicione novos</span>
            </div>
          ) : (
            poolEmployees.map(emp => (
              <Employee
                key={emp.id}
                employee={emp}
                departments={data.departments}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onEdit={openEmployeeModal}
                onRemove={handleEmployeeRemove}
              />
            ))
          )}
        </div>

        {/* Departamentos */}
        <div className="departments">
          {data.departments.map(dept => (
            <Department
              key={dept.id}
              department={dept}
              employees={data.employees}
              departments={data.departments}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEmployeeEdit={openEmployeeModal}
              onEmployeeRemove={handleEmployeeRemove}
              onDepartmentEdit={openDepartmentModal}
              onDepartmentRemove={handleDepartmentRemove}
              onTitleEdit={handleDepartmentTitleEdit}
            />
          ))}
          
          {data.departments.length === 0 && (
            <div className="empty-department">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                <path d="M3 21h18l-9-18-9 18zM12 17h.01M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Clique em "Departamento" para criar o primeiro departamento</span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        employee={currentEmployee}
        departments={data.departments}
        onSave={handleEmployeeSave}
      />

      <DepartmentModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        department={currentDepartment}
        onSave={handleDepartmentSave}
      />
    </div>
  );
}

export default App;