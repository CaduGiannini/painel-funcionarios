import React, { useState, useEffect } from 'react';

const DepartmentModal = ({ department, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    description: '',
    color: '#667eea'
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        manager: department.manager || '',
        description: department.description || '',
        color: department.color || '#667eea'
      });
    }
  }, [department]);

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
          <h2>Editar Departamento</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editDepartmentName">Nome do Departamento:</label>
            <input
              type="text"
              id="editDepartmentName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editDepartmentManager">Gerente:</label>
            <input
              type="text"
              id="editDepartmentManager"
              value={formData.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editDepartmentDescription">Descrição:</label>
            <textarea
              id="editDepartmentDescription"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição do departamento e suas responsabilidades"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editDepartmentColor">Cor do Departamento:</label>
            <input
              type="color"
              id="editDepartmentColor"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
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

export default DepartmentModal;