
import { User } from '../types/authTypes';
import { API_URL } from './config';

/**
 * Get CSRF cookie from Laravel Sanctum
 */
export const getCsrfCookie = async (): Promise<void> => {
  try {
    const csrfUrl = `${API_URL.replace('/api', '')}/sanctum/csrf-cookie`;
    console.log('Fetching CSRF token from:', csrfUrl);
    
    const response = await fetch(csrfUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
    });
    
    console.log('CSRF cookie response:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
    
    // Wait a moment to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return;
  } catch (error) {
    console.error('Error fetching CSRF cookie:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<{user: User, message: string, access_token?: string}> => {
  try {
    // Get CSRF cookie first
    await getCsrfCookie();
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include', 
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If we got a token, store it
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (email: string, password: string): Promise<{user: User, message: string, access_token?: string}> => {
  try {
    // Get CSRF cookie first
    await getCsrfCookie();
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include', 
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store the token for future requests
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    // Verify authentication was successful after login
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus) {
        console.log("Authentication verification after login: Not authenticated but continuing");
      } else {
        console.log("Authentication verification after login: Successful");
      }
    } catch (error) {
      console.warn('Auth check error after login, continuing anyway:', error);
    }
    
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<{message: string}> => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    // Remove the token regardless of server response
    localStorage.removeItem('access_token');
    
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if server logout failed, remove the local token
    localStorage.removeItem('access_token');
    throw error;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.log("No token found, user is not authenticated");
      return null;
    }

    const response = await fetch(`${API_URL}/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    console.log("Current user hook running...");

    if (response.status === 401) {
      localStorage.removeItem('access_token'); // Clear invalid token
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to get user with status: ${response.status}`);
    }

    const data = await response.json();
    return data.user ?? null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check auth status using the token directly
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return false;
    }
    
    const response = await fetch(`${API_URL}/user`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 401) {
      console.log('User not authenticated');
      localStorage.removeItem('access_token'); // Clear invalid token
      return false;
    }
    
    if (!response.ok) {
      console.log('Auth check failed with status:', response.status);
      return false;
    }
    
    const data = await response.json();
    return !!data.user;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

// Function to get auth headers for API calls
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `Bearer ${token}`,
  };
};
