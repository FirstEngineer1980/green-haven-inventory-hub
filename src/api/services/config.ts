
// Base API URL - adjust based on your environment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Export a function to check if backend is available
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    // First, try a simple ping to see if the server is accessible
    const response = await fetch(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
      // Add a short timeout to avoid waiting too long
      signal: AbortSignal.timeout(5000),
    });
    
    console.log('CSRF cookie response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    // If we get a CORS error, the server might be running but CORS is not configured
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.log('CORS issue detected - backend might be running but blocking requests');
    }
    return false;
  }
};
