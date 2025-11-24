import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const authAPI = {
  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  }
};

// Image editing API
export const imageAPI = {
  editImage: async (imageFile: File, instruction: string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('instruction', instruction);

    const response = await api.post('/api/image/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// History APIs
export const historyAPI = {
  getHistory: async (limit = 20, skip = 0) => {
    const response = await api.get('/api/history', {
      params: { limit, skip }
    });
    return response.data;
  },

  getEditById: async (id: string) => {
    const response = await api.get(`/api/history/${id}`);
    return response.data;
  },

  deleteEdit: async (id: string) => {
    const response = await api.delete(`/api/history/${id}`);
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/api/history');
    return response.data;
  }
};

export default api;
