import React, { useState } from 'react';
import FileUpload from './components/FileUpload/FileUpload';
import FileList from './components/FileList/FileList';
import ImageViewer from './components/ImageViewer/ImageViewer';
import useFileProcessing from './hooks/useFileProcessing';
import './App.css';

function App() {
  const { files, addFile, removeFile } = useFileProcessing();
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerTitle, setViewerTitle] = useState('');

  const handleFilesSelected = (selectedFiles) => {
    selectedFiles.forEach(file => {
      addFile(file);
    });
  };

  const handlePreviewImage = (imageData, title) => {
    setViewerImage(imageData);
    setViewerTitle(title);
  };

  const handleDownloadImage = (imageData, filename) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseViewer = () => {
    setViewerImage(null);
    setViewerTitle('');
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Conversor de Áudio para Espectrograma</h1>
        <p className="app__subtitle">
          Converta seus arquivos de áudio em visualizações espectrográficas
        </p>
      </header>

      <main className="app__main">
        <div className="app__content-grid">
          <div className="app__upload-section">
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              accept="audio/*"
            />
          </div>
          
          <div className="app__files-section">
            <FileList 
              files={files}
              onRemoveFile={removeFile}
              onPreviewImage={handlePreviewImage}
              onDownloadImage={handleDownloadImage}
            />
          </div>
        </div>
      </main>

      {viewerImage && (
        <ImageViewer 
          imageData={viewerImage}
          title={viewerTitle}
          onClose={handleCloseViewer}
        />
      )}

      <footer className="app__footer">
        <p>Sistema Distribuído de Conversão de Áudio - UFMT</p>
      </footer>
    </div>
  );
}

export default App;