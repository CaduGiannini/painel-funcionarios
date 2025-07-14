import React, { useState, useEffect, useRef } from 'react';
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
    dept: '',
    photo: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        email: employee.email || '',
        phone: employee.phone || '',
        notes: employee.notes || '',
        dept: employee.dept || '',
        photo: employee.photo || ''
      });
      setPhotoPreview(employee.photo || '');
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPhotoPreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          photo: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({
      ...prev,
      photo: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      dept: formData.dept || null,
      photo: formData.photo
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Funcionário">
      <form onSubmit={handleSubmit} className="employee-form">
        
        {/* Seção de Foto */}
        <div className="form-section">
          <label className="section-title">Foto do Perfil</label>
          <div className="photo-upload-area">
            <div 
              className={`photo-dropzone ${dragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-photo-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto();
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <div className="placeholder-initials">
                    {getInitials(formData.name)}
                  </div>
                  <div className="upload-text">
                    <strong>Clique ou arraste uma foto</strong>
                    <span>PNG, JPG até 5MB</span>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="form-section">
          <label className="section-title">Informações Básicas</label>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Cargo *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Cargo na empresa"
                required
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="form-section">
          <label className="section-title">Contato</label>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>

        {/* Departamento */}
        <div className="form-section">
          <label className="section-title">Departamento</label>
          <div className="form-group">
            <select
              id="dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="dept-select"
            >
              <option value="">🏢 Pool (sem departamento)</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>
                  🏛️ {dep.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Observações */}
        <div className="form-section">
          <label className="section-title">Observações</label>
          <div className="form-group">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações adicionais, habilidades, responsabilidades..."
              rows="4"
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
            Salvar Funcionário
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;