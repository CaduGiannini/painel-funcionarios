import React, { useState } from 'react';

const AddEmployeeForm = ({ onAddEmployee, departments }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !role.trim()) {
      alert('Preencha nome e cargo.');
      return;
    }

    onAddEmployee(name.trim(), role.trim(), dept || null);
    
    // Reset form
    setName('');
    setRole('');
    setDept('');
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do Funcionário"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Cargo"
        required
      />
      <select
        value={dept}
        onChange={(e) => setDept(e.target.value)}
      >
        <option value="">Pool</option>
        {departments.map(dep => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>
      <button className="btn" type="submit">Adicionar</button>
    </form>
  );
};

export default AddEmployeeForm;