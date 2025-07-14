import React from 'react';

const StatusBar = ({ status }) => {
  if (!status.message) return null;

  return (
    <div className={`status-bar visible ${status.type}`}>
      <span>{status.message}</span>
    </div>
  );
};

export default StatusBar;