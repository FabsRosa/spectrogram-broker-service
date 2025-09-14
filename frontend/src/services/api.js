import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6379';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadAudioFile = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Upload failed: ${error.response?.data?.error || error.message}`);
  }
};

export const checkTaskStatus = async (taskId) => {
  try {
    const response = await api.get(`/status/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Status check failed: ${error.response?.data?.error || error.message}`);
  }
};

export default api;