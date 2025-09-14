import React from 'react';
import FileItem from '../FileItem/FileItem';
import './FileList.css';

const FileList = ({ files, onRemoveFile, onPreviewImage, onDownloadImage }) => {
  if (files.length === 0) {
    return (
      <div className="file-list file-list--empty">
        <i className="fas fa-file-audio"></i>
        <p>Nenhum arquivo enviado ainda</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="file-list__header">
        <h3>Arquivos em processamento</h3>
        <span className="file-list__count">{files.length} arquivo(s)</span>
      </div>
      
      <div className="file-list__items">
        {files.map(file => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
            onPreview={onPreviewImage}
            onDownload={onDownloadImage}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;