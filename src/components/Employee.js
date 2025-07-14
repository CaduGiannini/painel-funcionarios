import React from 'react';

const Employee = ({ 
  employee, 
  department, 
  onDragStart, 
  onDragEnd, 
  onEditEmployee, 
  onRemoveEmployee 
}) => {
  const handleDragStart = (e) => {
    e.currentTarget.classList.add('dragging');
    onDragStart(e, 'employee', employee.id);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    onDragEnd(e);
  };

  const style = {};
  if (department && department.color) {
    style.background = `linear-gradient(135deg, ${department.color} 0%, ${department.color}CC 100%)`;
  }

  return (
    <div
      className="employee"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={style}
    >
      <div>
        <div style={{ fontWeight: 'bold' }}>{employee.name}</div>
        <div style={{ opacity: 0.75, fontSize: '0.85em' }}>{employee.role}</div>
      </div>
      <div>
        <button
          className="edit-btn"
          onClick={() => onEditEmployee(employee.id)}
          title="Editar funcionário"
        >
          ✏️
        </button>
        <button
          className="remove-btn"
          onClick={() => onRemoveEmployee(employee.id)}
          title="Remover funcionário"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Employee;