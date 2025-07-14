import React, { useState, useEffect } from 'react';

const EmployeeModal = ({ employee, departments, onSave, onClose }) => {
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-header">
          <h2>Editar Funcionário</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editEmployeeName">Nome:</label>
            <input
              type="text"
              id="editEmployeeName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editEmployeeRole">Cargo:</label>
            <input
              type="text"
              id="editEmployeeRole"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editEmployeeEmail">Email:</label>
            <input
              type="email"
              id="editEmployeeEmail"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editEmployeePhone">Telefone:</label>
            <input
              type="tel"
              id="editEmployeePhone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editEmployeeNotes">Observações:</label>
            <textarea
              id="editEmployeeNotes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Informações adicionais sobre o funcionário"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editEmployeeDept">Departamento:</label>
            <select
              id="editEmployeeDept"
              value={formData.dept}
              onChange={(e) => handleChange('dept', e.target.value)}
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
      </div>
    </div>
  );
};

export default EmployeeModal;