import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const documentAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  list: async () => {
    return api.get('/documents/');
  },
  
  delete: async (docId: number) => {
    return api.delete(`/documents/${docId}`);
  }
};

export const chatAPI = {
  query: async (question: string, numSources: number = 5) => {
    return api.post('/chat/query', { question, num_sources: numSources });
  },
  
  getHistory: async (limit: number = 50) => {
    return api.get('/chat/history', { params: { limit } });
  }
};