import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const DepartmentModal = ({ 
  isOpen, 
  onClose, 
  department, 
  onSave 
}) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nome do departamento é obrigatório!');
      return;
    }
    
    onSave({
      ...department,
      ...formData,
      name: formData.name.trim(),
      manager: formData.manager.trim(),
      description: formData.description.trim()
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Departamento">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Departamento:</label>
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
          <label htmlFor="manager">Gerente:</label>
          <input
            type="text"
            id="manager"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição do departamento e suas responsabilidades"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="color">Cor do Departamento:</label>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
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
    </Modal>
  );
};

export default DepartmentModal;