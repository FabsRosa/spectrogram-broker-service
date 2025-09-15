import React, { useState } from 'react';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import './FileItem.css';

const FileItem = ({ file, onPreview, onDownload, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handlePreview = () => {
    if (file.status === 'completed' && file.result && onPreview) {
      onPreview(file.result.spectrogram, file.name);
    }
  };

  const handleDownload = () => {
    if (file.status === 'completed' && file.result && onDownload) {
      onDownload(file.result.spectrogram, `${file.name.split('.')[0]}_spectrogram.png`);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      setIsExiting(true);
      // Aguarda a animação terminar antes de remover
      setTimeout(() => {
        onRemove(file.id);
      }, 300);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-item ${isExiting ? 'file-item--exiting' : ''}`}>
      <div className="file-item__info">
        <div className="file-item__name">{file.name}</div>
        <div className="file-item__size">{formatFileSize(file.file.size)}</div>
      </div>
      
      <div className="file-item__info">
        <div className="file-item__actions">
          {file.status === 'completed' && file.result && (
            <>
              <button 
                className="file-item__action file-item__action--preview"
                onClick={handlePreview}
                title="Visualizar espectrograma"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="file-item__action file-item__action--download"
                onClick={handleDownload}
                title="Baixar espectrograma"
              >
                <i className="fas fa-download"></i>
              </button>
            </>
          )}
          
          {file.status === 'error' && (
            <div className="file-item__error">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{file.error === 'Upload failed: Network Error' ? 'Sem conexão ao servidor' : 'Erro no processamento'}</span>
            </div>
          )}

          {file.status !== 'completed' && !(file.result) && file.status !== 'error' && (
            <div className="file-item__remove">
              <span>{'Remover'}</span>
            </div>
          )}
          
          <button 
            className="file-item__action file-item__action--remove"
            onClick={handleRemove}
            title="Remover arquivo"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <StatusIndicator status={file.status} progress={file.progress} />
      </div>
      
      {file.status === 'completed' && file.result && (
        <div 
          className="file-item__preview"
          onClick={handlePreview}
        >
          <img 
            src={`data:image/png;base64,${file.result.spectrogram}`} 
            alt={`Espectrograma de ${file.name}`}
          />
          <div className="file-item__preview-overlay">
            <i className="fas fa-search-plus"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileItem;