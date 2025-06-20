import axios from 'axios';

// Set your backend API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // JWT in header, not cookies
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors here
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await api.post('/auth/login', userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// ===================== USERS (Admin only) =====================
export const getAllUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

// ===================== TASKS =====================
export const getTasks = async (params = {}) => {
  // params: { search, filter, sort, ... }
  const res = await api.get('/tasks', { params });
  return res.data;
};

export const getTaskById = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data;
};

export const createTask = async (taskData, files = []) => {
  // taskData: { title, description, priority, status, dueDate, assignedTo }
  // files: array of File objects (PDFs)
  const formData = new FormData();
  Object.entries(taskData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  files.forEach((file) => {
    formData.append('attachments', file);
  });
  const res = await api.post('/tasks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateTask = async (taskId, taskData, files = []) => {
  // Partial update; files optional
  const formData = new FormData();
  Object.entries(taskData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  files.forEach((file) => {
    formData.append('attachments', file);
  });
  const res = await api.put(`/tasks/${taskId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

// ===================== TASK STATS =====================
export const getTaskStats = async () => {
  const res = await api.get('/tasks/stats');
  return res.data;
};

// ===================== FILE DOWNLOAD =====================
export const downloadAttachment = async (filePath) => {
  // filePath: relative path from backend (e.g., /uploads/filename.pdf)
  const res = await api.get(filePath, { responseType: 'blob' });
  return res.data;
};

export default api; 