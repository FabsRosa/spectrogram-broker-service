import React from 'react';
import './ImageViewer.css';

const ImageViewer = ({ imageData, title, onClose }) => {
  if (!imageData) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `${title || 'spectrogram'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="image-viewer" onClick={onClose}>
      <div className="image-viewer__content" onClick={(e) => e.stopPropagation()}>
        <div className="image-viewer__header">
          <h3 className="image-viewer__title">{title || 'Espectrograma'}</h3>
          <div className="image-viewer__actions">
            <button 
              className="image-viewer__action image-viewer__action--download"
              onClick={handleDownload}
              title="Baixar imagem"
            >
              <i className="fas fa-download"></i>
            </button>
            <button 
              className="image-viewer__action image-viewer__action--close"
              onClick={onClose}
              title="Fechar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="image-viewer__body">
          <img 
            src={`data:image/png;base64,${imageData}`} 
            alt="Espectrograma em alta resolução"
            className="image-viewer__image"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;