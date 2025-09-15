// Status possíveis para os arquivos
export const STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  UPLOAD_ENDPOINT: '/upload',
  STATUS_ENDPOINT: '/status'
};

// Tipos de arquivo aceitos
export const ACCEPTED_FILE_TYPES = [
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

// Extensões de arquivo para exibição
export const FILE_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg'];