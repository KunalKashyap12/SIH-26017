import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sih-26017.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default client;
