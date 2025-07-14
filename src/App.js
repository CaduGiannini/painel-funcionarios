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
      alert('Preencha nome e cargo.');
      return;
    }
    
    const newData = {
      ...data,
      employeeCounter: data.employeeCounter + 1,
      employees: [
        ...data.employees,
        {
          id: data.employeeCounter + 1,
          name: newEmployee.name.trim(),
          role: newEmployee.role.trim(),
          dept: newEmployee.dept || null,
          email: '',
          phone: '',
          notes: ''
        }
      ]
    };
    
    updateDataAndSave(newData);
    setNewEmployee({ name: '', role: '', dept: '' });
  };

  // Handlers dos modais
  const openEmployeeModal = (empId) => {
    const employee = data.employees.find(e => e.id === empId);
    if (employee) {
      setCurrentEmployee(employee);
      setEmployeeModalOpen(true);
    }
  };

  const openDepartmentModal = (deptId) => {
    const department = data.departments.find(d => d.id === deptId);
    if (department) {
      setCurrentDepartment(department);
      setDepartmentModalOpen(true);
    }
  };

  const handleEmployeeSave = (updatedEmployee) => {
    const newData = {
      ...data,
      employees: data.employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    };
    updateDataAndSave(newData);
  };

  const handleDepartmentSave = (updatedDepartment) => {
    const newData = {
      ...data,
      departments: data.departments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    };
    updateDataAndSave(newData);
  };

  // Handlers de remoção
  const removeEmployee = (empId) => {
    if (!window.confirm('Tem certeza que deseja remover este funcionário?')) return;
    
    const newData = {
      ...data,
      employees: data.employees.filter(emp => emp.id !== empId)
    };
    updateDataAndSave(newData);
  };

  const removeDepartment = (deptId) => {
    if (!window.confirm('Remover este departamento? Funcionários voltarão para o pool.')) return;
    
    const newData = {
      ...data,
      employees: data.employees.map(emp => 
        emp.dept === deptId ? { ...emp, dept: null } : emp
      ),
      departments: data.departments.filter(dept => dept.id !== deptId)
    };
    updateDataAndSave(newData);
  };

  // Handler para adicionar departamento
  const addDepartment = () => {
    const name = window.prompt('Nome do departamento:');
    if (!name) return;
    
    const id = 'dep' + Math.random().toString(36).slice(2, 9);
    const newData = {
      ...data,
      departments: [
        ...data.departments,
        {
          id,
          name,
          manager: '',
          description: '',
          color: '#667eea'
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

  // Handlers de drag and drop
  const handleDragStart = (type, id) => {
    console.log('Drag start:', type, id);
    setDraggedType(type);
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setDraggedType(null);
  };

  const handleDrop = (draggedId, targetDeptId) => {
    console.log('Drop handler:', draggedId, targetDeptId, draggedType);
    
    if (draggedType === 'employee') {
      const draggedIdNum = parseInt(draggedId, 10);
      const targetDeptIdNum = targetDeptId ? parseInt(targetDeptId, 10) : null;
      
      console.log('Moving employee', draggedIdNum, 'to dept', targetDeptIdNum);
      
      const newData = {
        ...data,
        employees: data.employees.map(emp => 
          emp.id === draggedIdNum ? { ...emp, dept: targetDeptIdNum } : emp
        )
      };
      updateDataAndSave(newData);
    } else if (draggedType === 'department' && targetDeptId === null) {
      // Reordenar departamentos (opcional)
      const draggedDeptId = parseInt(draggedId, 10);
      const draggedDept = data.departments.find(d => d.id === draggedDeptId);
      if (draggedDept) {
        const newData = {
          ...data,
          departments: [
            ...data.departments.filter(d => d.id !== draggedDeptId),
            draggedDept
          ]
        };
        updateDataAndSave(newData);
      }
    }
  };

  // Handler para pool drop
  const handlePoolDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drop-hover');
    
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log('Pool drop:', draggedId);
    
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
    
    // Só remove o highlight se estiver realmente saindo do pool
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

  // Handler para resetar
  const handleReset = () => {
    if (!window.confirm('Tem certeza? Isso apagará tudo!')) return;
    resetData();
  };

  // Handler para exportar
  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'organograma_backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Funcionários sem departamento
  const poolEmployees = data.employees.filter(emp => !emp.dept);

  return (
    <div className="container">
      {/* Status de Conexão */}
      <div className={`status-bar ${status.type} ${status.type !== 'connected' ? 'show' : ''}`}>
        <span>{status.message}</span>
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
            <option value="">Pool</option>
            {data.departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
          <button className="btn" type="submit">Adicionar</button>
        </form>
        <button className="btn" onClick={addDepartment}>➕ Departamento</button>
        <button className="btn" onClick={handleReset}>🔄 Resetar</button>
        <button className="btn" onClick={handleExport}>💾 Exportar</button>
        <button className="btn" onClick={testConnection}>🔧 Testar Conexão</button>
      </div>

      {/* Main Title */}
      <div className="main-title">
        {editingTitle === 'title' ? (
          <input
            ref={titleInputRef}
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={finishEditingTitle}
            onKeyDown={handleTitleKeyDown}
            style={{ fontSize: '1.3em', fontWeight: 'bold' }}
          />
        ) : (
          <h1 onClick={() => startEditingTitle('title')}>
            {data.title}
          </h1>
        )}
        
        {editingTitle === 'subtitle' ? (
          <input
            ref={titleInputRef}
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={finishEditingTitle}
            onKeyDown={handleTitleKeyDown}
            style={{ marginLeft: '18px', fontSize: '1.05em' }}
          />
        ) : (
          <p 
            onClick={() => startEditingTitle('subtitle')}
            style={{ marginLeft: '18px', fontSize: '1.05em' }}
          >
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Employee List */}
      <div className="employee-list">
        {/* Employee Pool */}
        <div 
          className="employee-pool"
          onDrop={handlePoolDrop}
          onDragOver={handlePoolDragOver}
          onDragLeave={handlePoolDragLeave}
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Funcionários sem departamento
          </div>
          {poolEmployees.map(emp => (
            <Employee
              key={emp.id}
              employee={emp}
              departments={data.departments}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEdit={openEmployeeModal}
              onRemove={removeEmployee}
            />
          ))}
        </div>

        {/* Departments */}
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
              onEmployeeRemove={removeEmployee}
              onDepartmentEdit={openDepartmentModal}
              onDepartmentRemove={removeDepartment}
              onTitleEdit={handleDepartmentTitleEdit}
            />
          ))}
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