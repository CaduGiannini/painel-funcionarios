import React, { useState } from 'react';
import Employee from './Employee';

const Department = ({ 
  department, 
  employees, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  onEditEmployee, 
  onRemoveEmployee,
  onEditDepartment,
  onRemoveDepartment
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, department.id);
  };

  const style = {};
  if (department.color) {
    style.borderColor = department.color;
    style.background = `linear-gradient(135deg, ${department.color}15, ${department.color}05)`;
  }

  return (
    <div
      className={`department ${isDragOver ? 'drop-hover' : ''}`}
      style={style}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="department-title">
        <span>{department.name}</span>
        <button
          className="edit-btn"
          onClick={() => onEditDepartment(department.id)}
          title="Editar departamento"
        >
          ✏️
        </button>
        <button
          className="remove-btn"
          onClick={() => onRemoveDepartment(department.id)}
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

      {employees.map(employee => (
        <Employee
          key={employee.id}
          employee={employee}
          department={department}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEditEmployee={onEditEmployee}
          onRemoveEmployee={onRemoveEmployee}
        />
      ))}
    </div>
  );
};

export default Department;