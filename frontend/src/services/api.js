import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true // Required for cookies/sessions
});

// Request interceptor for auth token and content type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only set Content-Type to application/json if it's not already set
  // This allows multipart/form-data to work properly
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  console.log('📤 API Request:', {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : config.data
  });
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      window.location.href = '/login';
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
