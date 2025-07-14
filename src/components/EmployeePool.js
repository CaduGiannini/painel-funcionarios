import React, { useState } from 'react';
import Employee from './Employee';

const EmployeePool = ({ 
  employees, 
  departments,
  onDrop, 
  onDragStart, 
  onDragEnd, 
  onEditEmployee, 
  onRemoveEmployee 
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
    onDrop(e, null);
  };

  return (
    <div
      className={`employee-pool ${isDragOver ? 'drop-hover' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        Funcionários sem departamento
      </div>
      {employees.map(employee => (
        <Employee
          key={employee.id}
          employee={employee}
          department={null}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEditEmployee={onEditEmployee}
          onRemoveEmployee={onRemoveEmployee}
        />
      ))}
    </div>
  );
};

export default EmployeePool;