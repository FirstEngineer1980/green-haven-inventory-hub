
import axios from 'axios';
window.axios = axios;

// Set the base URL for all API requests
window.axios.defaults.baseURL = 'https://backend.myphr.io/backend/api';

// Add the CSRF token to all requests if needed
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add a request interceptor to include authentication token if available
window.axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle common errors
window.axios.interceptors.response.use(
    response => response,
    error => {
        // Handle 401 Unauthorized errors (token expired, etc.)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // For API requests, don't redirect
            if (!error.request.responseURL.includes('/api/')) {
                // Redirect to login page if needed
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
