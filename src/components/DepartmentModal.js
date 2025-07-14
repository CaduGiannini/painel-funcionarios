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
    description: '',
    manager: '',
    location: '',
    budget: '',
    goals: '',
    color: '#667eea'
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        manager: department.manager || '',
        location: department.location || '',
        budget: department.budget || '',
        goals: department.goals || '',
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
      description: formData.description.trim(),
      manager: formData.manager.trim(),
      location: formData.location.trim(),
      budget: formData.budget.trim(),
      goals: formData.goals.trim(),
      color: formData.color
    });
    
    onClose();
  };

  const predefinedColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffa726', '#ffcc02', '#fa709a', '#fee140',
    '#a8edea', '#fed6e3', '#d299c2', '#fef9d7'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Departamento">
      <form onSubmit={handleSubmit} className="department-form">
        
        {/* Informações Básicas */}
        <div className="form-section">
          <label className="section-title">Informações Básicas</label>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome do Departamento *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Recursos Humanos"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="manager">Gerente</label>
              <input
                type="text"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                placeholder="Nome do gerente"
              />
            </div>
          </div>
        </div>

        {/* Localização e Orçamento */}
        <div className="form-section">
          <label className="section-title">Detalhes Operacionais</label>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Localização</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: 2º andar, Sala 201"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budget">Orçamento</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Ex: R$ 100.000"
              />
            </div>
          </div>
        </div>

        {/* Cor do Departamento */}
        <div className="form-section">
          <label className="section-title">Cor do Departamento</label>
          <div className="form-group">
            <div className="color-picker">
              <div className="color-options">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    title={color}
                  />
                ))}
              </div>
              <div className="custom-color">
                <label htmlFor="color">Ou escolha uma cor personalizada:</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="color-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="form-section">
          <label className="section-title">Descrição</label>
          <div className="form-group">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva as responsabilidades e objetivos do departamento..."
              rows="3"
            />
          </div>
        </div>

        {/* Metas e Objetivos */}
        <div className="form-section">
          <label className="section-title">Metas e Objetivos</label>
          <div className="form-group">
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Liste as principais metas e objetivos do departamento..."
              rows="3"
            />
          </div>
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Salvar Departamento
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentModal;