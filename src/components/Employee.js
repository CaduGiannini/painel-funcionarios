import React from 'react';

const Employee = ({ 
  employee, 
  departments, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onRemove 
}) => {
  const dept = departments.find(d => d.id === employee.dept);
  
  const handleDragStart = (e) => {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', employee.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart('employee', employee.id);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    if (onDragEnd) onDragEnd();
  };

  const employeeStyle = {};
  if (dept && dept.color) {
    employeeStyle.background = `linear-gradient(135deg, ${dept.color} 0%, ${dept.color}CC 100%)`;
  }

  return (
    <div 
      className="employee"
      draggable
      data-id={employee.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={employeeStyle}
    >
      <div>
        <div style={{ fontWeight: 'bold' }}>{employee.name}</div>
        <div style={{ opacity: 0.75, fontSize: '0.85em' }}>{employee.role}</div>
      </div>
      <div>
        <button 
          className="edit-btn" 
          onClick={() => onEdit(employee.id)}
          title="Editar funcionário"
        >
          ✏️
        </button>
        <button 
          className="remove-btn" 
          onClick={() => onRemove(employee.id)}
          title="Remover funcionário"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Employee;