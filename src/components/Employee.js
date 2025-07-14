import React, { useState } from 'react';

const Employee = ({ 
  employee, 
  departments, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onRemove 
}) => {
  const dept = departments.find(d => d.id === employee.dept);
  const [imageError, setImageError] = useState(false);
  
  const handleDragStart = (e) => {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', employee.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    // Para Firefox: define um drag image customizado
    if (e.dataTransfer.setDragImage) {
      const crt = e.target.cloneNode(true);
      crt.style.position = 'absolute';
      crt.style.top = '-9999px';
      crt.style.left = '-9999px';
      crt.style.opacity = '0.8';
      document.body.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 40, 40);
      setTimeout(() => document.body.removeChild(crt), 0);
    }
    if (onDragStart) onDragStart('employee', employee.id);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    if (onDragEnd) onDragEnd();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const employeeStyle = {
    '--emp-color': dept?.color || '#3b82f6'
  };

  return (
    <div 
      className="employee-card"
      draggable
      data-id={employee.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={employeeStyle}
    >
      <div className="employee-avatar">
        {employee.photo && !imageError ? (
          <img 
            src={employee.photo} 
            alt={employee.name}
            onError={handleImageError}
            className="employee-photo"
          />
        ) : (
          <div 
            className="employee-initials" 
            style={{ 
              backgroundColor: dept?.color || '#3b82f6'
            }}
          >
            {getInitials(employee.name)}
          </div>
        )}
        <div className="employee-status"></div>
      </div>
      
      <div className="employee-info">
        <div className="employee-name">{employee.name}</div>
        <div className="employee-role">{employee.role}</div>
        {employee.email && (
          <div className="employee-email">{employee.email}</div>
        )}
      </div>
      
      <div className="employee-actions">
        <button 
          className="edit-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(employee.id);
          }}
          title="Editar funcionário"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button 
          className="remove-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(employee.id);
          }}
          title="Remover funcionário"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Employee;