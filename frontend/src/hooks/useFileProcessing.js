import { useState, useEffect, useCallback } from 'react';
import fileProcessor from '../services/fileProcessor';

const useFileProcessing = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Atualiza a lista de arquivos quando houver mudanças
    const updateFiles = () => {
      setFiles(fileProcessor.getAllFiles());
    };

    // Configura o callback para atualizações de status
    fileProcessor.onStatusChange = updateFiles;
    
    // Atualiza inicialmente
    updateFiles();
    
    return () => {
      fileProcessor.onStatusChange = null;
    };
  }, []);

  const addFile = useCallback((file) => {
    return fileProcessor.addFile(
      file,
      () => setFiles([...fileProcessor.getAllFiles()]),
      () => setFiles([...fileProcessor.getAllFiles()])
    );
  }, []);

  const removeFile = useCallback((fileId) => {
    fileProcessor.removeFile(fileId);
    setFiles([...fileProcessor.getAllFiles()]);
  }, []);

  const getFile = useCallback((fileId) => {
    return fileProcessor.getFileData(fileId);
  }, []);

  return {
    files,
    addFile,
    removeFile,
    getFile
  };
};

export default useFileProcessing;