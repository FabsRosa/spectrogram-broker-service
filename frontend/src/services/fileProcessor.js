import { uploadAudioFile, checkTaskStatus } from './api';
import { PROCESSING_STATUS, STATUS } from '../utils/constants';

class FileProcessor {
  constructor() {
    this.processingFiles = new Map();
  }

  // Adiciona um arquivo para processamento
  addFile(file, onStatusChange, onComplete) {
    const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    this.processingFiles.set(fileId, {
      id: fileId,
      file,
      name: file.name,
      status: STATUS.PENDING,
      progress: 0,
      taskId: null,
      result: null,
      error: null,
      onStatusChange,
      onComplete
    });

    this.processFile(fileId);
    
    return fileId;
  }

  // Processa um arquivo
  async processFile(fileId) {
    const fileData = this.processingFiles.get(fileId);
    if (!fileData) return;

    try {
      // Atualiza status para upload
      this.updateFileStatus(fileId, STATUS.UPLOADING, 25);
      
      // Faz upload do arquivo
      const uploadResult = await uploadAudioFile(fileData.file);
      fileData.taskId = uploadResult.task_id;
      
      // Atualiza status para processando
      this.updateFileStatus(fileId, STATUS.PROCESSING, 50);
      
      // Inicia polling para verificar status
      this.startPolling(fileId);
    } catch (error) {
      this.updateFileStatus(fileId, STATUS.ERROR, 0, error.message);
    }
  }

  // Inicia polling para verificar status da tarefa
  startPolling(fileId) {
    const fileData = this.processingFiles.get(fileId);
    if (!fileData || !fileData.taskId) return;

    const pollInterval = setInterval(async () => {
      try {
        const statusResult = await checkTaskStatus(fileData.taskId);
        
        if (statusResult.status === 'completed') {
          clearInterval(pollInterval);
          this.updateFileStatus(
            fileId, 
            STATUS.COMPLETED, 
            100, 
            null, 
            statusResult.result
          );
          if (fileData.onComplete) {
            fileData.onComplete(fileId, statusResult.result);
          }
        } else if (statusResult.status === 'error') {
          clearInterval(pollInterval);
          this.updateFileStatus(fileId, STATUS.ERROR, 0, 'Processing failed');
        }
        // Se ainda estiver processando, continua polling
      } catch (error) {
        clearInterval(pollInterval);
        this.updateFileStatus(fileId, STATUS.ERROR, 0, error.message);
      }
    }, 2000); // Poll a cada 2 segundos
  }

  // Atualiza o status de um arquivo
  updateFileStatus(fileId, status, progress = null, error = null, result = null) {
    const fileData = this.processingFiles.get(fileId);
    if (!fileData) return;

    fileData.status = status;
    if (progress !== null) fileData.progress = progress;
    if (error !== null) fileData.error = error;
    if (result !== null) fileData.result = result;

    if (fileData.onStatusChange) {
      fileData.onStatusChange(fileId, { ...fileData });
    }
  }

  // Obtém dados de um arquivo
  getFileData(fileId) {
    return this.processingFiles.get(fileId);
  }

  // Obtém todos os arquivos
  getAllFiles() {
    return Array.from(this.processingFiles.values());
  }

  // Remove um arquivo
  removeFile(fileId) {
    this.processingFiles.delete(fileId);
  }
}

export default new FileProcessor();