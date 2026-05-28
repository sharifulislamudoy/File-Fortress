import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const folderApi = {
  create: (data: { name: string; purpose: string; parentId?: string }) =>
    api.post('/folders', data),
  getByPath: (path: string) => api.get(`/folders?path=${encodeURIComponent(path)}`),
  getRoot: () => api.get('/folders/root'),
  getAll: () => api.get('/folders/all'),
  getById: (id: string) => api.get(`/folders/${id}`),
};

export const fileApi = {
  upload: (folderId: string, fileType: string, file: File) => {
    const formData = new FormData();
    formData.append('folderId', folderId);
    formData.append('fileType', fileType);
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByFolder: (folderId: string) => api.get(`/files/folder/${folderId}`),
  delete: (fileId: string) => api.delete(`/files/${fileId}`),
};

export const aiApi = {
  ask: (question: string) => api.post('/ai/ask', { question }),
};