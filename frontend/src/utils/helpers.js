// Formata o tamanho do arquivo para exibição
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Verifica se um arquivo é do tipo áudio
export const isAudioFile = (file) => {
  const acceptedTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'audio/flac',
    'audio/x-flac',
    'audio/aac',
    'audio/aacp',
    'audio/mp4',
    'audio/ogg'
  ];
  
  return acceptedTypes.includes(file.type);
};

// Gera um ID único para os arquivos
export const generateFileId = () => {
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Debounce function para otimizar chamadas de API
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};