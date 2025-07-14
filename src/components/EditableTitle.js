import React, { useState } from 'react';

const EditableTitle = ({ value, onChange, className, tag = 'div', style = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        style={style}
        autoFocus
      />
    );
  }

  const Tag = tag;
  return (
    <Tag
      onClick={handleClick}
      style={{ ...style, cursor: 'pointer' }}
    >
      {value}
    </Tag>
  );
};

export default EditableTitle;