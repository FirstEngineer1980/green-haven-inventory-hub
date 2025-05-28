
import axios from 'axios';

// Create the main axios instance
const apiInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Re-export the main api instance
export { apiInstance };
export default apiInstance;
