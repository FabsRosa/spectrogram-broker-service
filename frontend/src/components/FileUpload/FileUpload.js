import React, { useCallback, useState, useEffect, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFilesSelected, accept = 'audio/*' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOverContainer, setIsOverContainer] = useState(false);
  const [iconClass, setIconClass] = useState('fas fa-cloud-upload-alt');
  const dragCounter = useRef(0);
  const containerRef = useRef();
  const timeoutRef = useRef();

  // Efeito para configurar os event listeners diretamente no container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Verifica se está arrastando arquivos
      if (e.dataTransfer.types.includes('Files')) {
        dragCounter.current++;
        
        // Limpa qualquer timeout anterior
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        setIsDragging(true);
        setIsOverContainer(true);
        
        // Muda para o ícone de download
        setIconClass('fas fa-cloud-download-alt');
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Mantém o estado como "sobre o container" enquanto o mouse se move
      if (e.dataTransfer.types.includes('Files') && !isOverContainer) {
        setIsOverContainer(true);
        setIconClass('fas fa-cloud-download-alt');
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Só considera que saiu do container se o mouse não estiver sobre nenhum filho
      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Verifica se o mouse está fora dos limites do container
      if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        
        if (dragCounter.current === 0) {
          setIsOverContainer(false);
          setIconClass('fas fa-cloud-upload-alt');
        }
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Limpa o timeout se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      dragCounter.current = 0;
      setIsDragging(false);
      setIsOverContainer(false);
      setIconClass('fas fa-cloud-upload-alt');
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0 && onFilesSelected) {
        onFilesSelected(droppedFiles);
      }
    };

    // Adiciona os event listeners diretamente ao container
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    // Cleanup
    return () => {
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOverContainer, onFilesSelected]);

  // Detecta quando o arraste termina em qualquer lugar da página
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      dragCounter.current = 0;
      setIsDragging(false);
      setIsOverContainer(false);
      setIconClass('fas fa-cloud-upload-alt');
    };

    const handleGlobalDrop = (e) => {
      // Só processa se não for um drop no nosso container
      const container = containerRef.current;
      if (container && !container.contains(e.target)) {
        handleGlobalDragEnd();
      }
    };

    document.addEventListener('dragend', handleGlobalDragEnd);
    document.addEventListener('drop', handleGlobalDrop);
    document.addEventListener('mouseup', handleGlobalDragEnd); // Fallback

    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
      document.removeEventListener('drop', handleGlobalDrop);
      document.removeEventListener('mouseup', handleGlobalDragEnd);
    };
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0 && onFilesSelected) {
      onFilesSelected(selectedFiles);
      // Reset input para permitir selecionar o mesmo arquivo novamente
      e.target.value = '';
    }
  }, [onFilesSelected]);

  return (
    <div 
      ref={containerRef}
      className={`file-upload ${isDragging ? 'file-upload--dragging' : ''} ${isOverContainer ? 'file-upload--over' : ''}`}
    >
      <div className="file-upload__content">
        <div className="file-upload__icon">
          <i className={iconClass}></i>
        </div>
        <p className="file-upload__text">
          {isDragging 
            ? 'Solte o arquivo de áudio aqui' 
            : 'Arraste e solte arquivos de áudio aqui'}
        </p>
        {!isDragging && (
          <p className="file-upload__hint">...ou</p>
        )}
        {!isDragging && (
            <label className="file-upload__button">
            <input
              type="file"
              multiple
              accept={accept}
              onChange={handleFileSelect}
              className="file-upload__input"
            />
            Selecionar arquivos
          </label>
        )}
        <p className="file-upload__hint">
          Formatos suportados: MP3, WAV, FLAC, AAC
        </p>
      </div>
    </div>
  );
};

export default FileUpload;