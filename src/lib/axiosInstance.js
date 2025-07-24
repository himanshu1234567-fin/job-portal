import axios from 'axios';
import { showErrorAlert } from '../app/utils/showErrorAlert';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred';
    showErrorAlert(`API Error`, message);
    return Promise.reject(error);
  }
);

export default axiosInstance;