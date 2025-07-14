import React, { useState, useRef } from 'react';
import Employee from './Employee';

const Department = ({ 
  department, 
  employees, 
  departments,
  onDrop, 
  onDragStart,
  onDragEnd,
  onEmployeeEdit,
  onEmployeeRemove,
  onDepartmentEdit,
  onDepartmentRemove,
  onTitleEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(department.name);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef();

  const departmentEmployees = employees.filter(emp => emp.dept === department.id);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    e.currentTarget.classList.remove('drop-hover');
    
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedIdNum = parseInt(draggedId, 10);
    
    console.log('🏢 Drop no departamento:', department.name, 'ID arrastado:', draggedIdNum);
    
    if (draggedIdNum && !isNaN(draggedIdNum) && onDrop) {
      onDrop(draggedIdNum, department.id);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drop-hover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Só remove o highlight se estiver realmente saindo do departamento
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      e.currentTarget.classList.remove('drop-hover');
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleTitleSubmit = () => {
    const newName = tempName.trim();
    if (newName && onTitleEdit) {
      onTitleEdit(department.id, newName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTempName(department.name);
      setIsEditing(false);
    }
  };

  const departmentStyle = {
    '--dept-color': department.color || '#3b82f6'
  };

  return (
    <div 
      className={`department ${isDragOver ? 'drop-hover' : ''}`}
      data-id={department.id}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={departmentStyle}
    >
      <div className="department-header">
        <div className="department-title">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="department-title-input"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              onDoubleClick={handleTitleDoubleClick}
              className="department-name"
              title="Duplo clique para editar"
            >
              {department.name}
            </span>
          )}
          
          <div className="department-actions">
            <button 
              className="edit-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDepartmentEdit(department.id);
              }}
              title="Editar departamento"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button 
              className="remove-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDepartmentRemove(department.id);
              }}
              title="Remover departamento"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {department.manager && (
          <div className="department-manager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Gerente: {department.manager}
          </div>
        )}
        
        <div className="department-stats">
          <span className="employee-count">
            {departmentEmployees.length} funcionário{departmentEmployees.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="department-employees">
        {departmentEmployees.length === 0 ? (
          <div className="empty-department">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Arraste funcionários aqui</span>
          </div>
        ) : (
          departmentEmployees.map(emp => (
            <Employee
              key={emp.id}
              employee={emp}
              departments={departments}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onEdit={onEmployeeEdit}
              onRemove={onEmployeeRemove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Department;