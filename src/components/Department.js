import React, { useState, useRef } from 'react';
import Employee from './Employee';

const Department = ({ 
  department, 
  employees, 
  departments,
  onDrop, 
  onDragOver, 
  onDragLeave,
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
  const inputRef = useRef();

  const departmentEmployees = employees.filter(emp => emp.dept === department.id);

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-hover');
    const draggedId = e.dataTransfer.getData('text/plain');
    onDrop(draggedId, department.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drop-hover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drop-hover');
  };

  const handleDragStart = (e) => {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', department.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart('department', department.id);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    if (onDragEnd) onDragEnd();
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleTitleSubmit = () => {
    onTitleEdit(department.id, tempName || 'Departamento');
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

  const departmentStyle = {};
  if (department.color) {
    departmentStyle.borderColor = department.color;
    departmentStyle.background = `linear-gradient(135deg, ${department.color}15, ${department.color}05)`;
  }

  return (
    <div 
      className="department"
      draggable
      data-id={department.id}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={departmentStyle}
    >
      <div className="department-title">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            style={{ fontSize: '1em' }}
          />
        ) : (
          <span onDoubleClick={handleTitleDoubleClick}>
            {department.name}
          </span>
        )}
        <button 
          className="edit-btn" 
          onClick={() => onDepartmentEdit(department.id)}
          title="Editar departamento"
        >
          ✏️
        </button>
        <button 
          className="remove-btn" 
          onClick={() => onDepartmentRemove(department.id)}
          title="Remover departamento"
        >
          ✖
        </button>
      </div>
      
      {department.manager && (
        <div style={{ 
          fontSize: '0.9em', 
          color: '#666', 
          marginBottom: '8px' 
        }}>
          Gerente: {department.manager}
        </div>
      )}
      
      {departmentEmployees.map(emp => (
        <Employee
          key={emp.id}
          employee={emp}
          departments={departments}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEdit={onEmployeeEdit}
          onRemove={onEmployeeRemove}
        />
      ))}
    </div>
  );
};

export default Department;