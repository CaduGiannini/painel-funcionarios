import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const EmployeeModal = ({ 
  isOpen, 
  onClose, 
  employee, 
  departments, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: '',
    dept: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        email: employee.email || '',
        phone: employee.phone || '',
        notes: employee.notes || '',
        dept: employee.dept || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Nome e cargo são obrigatórios!');
      return;
    }
    
    onSave({
      ...employee,
      ...formData,
      name: formData.name.trim(),
      role: formData.role.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
      dept: formData.dept || null
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Funcionário">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Cargo:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Telefone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Observações:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o funcionário"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dept">Departamento:</label>
          <select
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
          >
            <option value="">Pool</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;