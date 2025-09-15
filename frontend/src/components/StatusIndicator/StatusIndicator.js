import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ status, progress }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'uploading':
      case 'processing':
        return 'fas fa-spinner fa-spin';
      case 'completed':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'uploading':
        return `Enviando... ${progress}%`;
      case 'processing':
        return `Processando... ${progress}%`;
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return status;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'pending':
        return 'status-indicator--pending';
      case 'uploading':
      case 'processing':
        return 'status-indicator--processing';
      case 'completed':
        return 'status-indicator--completed';
      case 'error':
        return 'status-indicator--error';
      default:
        return '';
    }
  };

  return (
    <div className={`status-indicator ${getStatusClass()}`}>
      <i className={getStatusIcon()}></i>
      <span>{getStatusText()}</span>
    </div>
  );
};

export default StatusIndicator;