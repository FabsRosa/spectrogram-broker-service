const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};

export const checkStatus = async (taskId) => {
  const response = await fetch(`${API_BASE}/status/${taskId}`);
  return response.json();
};