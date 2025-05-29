
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { register, login, logout, getCurrentUser, checkAuthStatus } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async ({ name, email, password, passwordConfirmation }: 
      { name: string, email: string, password: string, passwordConfirmation: string }) => {
      return await register(name, email, password, passwordConfirmation);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(data.message || 'Registration successful');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    }
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      return await login(email, password);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(data.message || 'Login successful');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error("Login error:", error);
      toast.error(errorMessage);
    }
  });
};

// Export with alias for backward compatibility
export const useLogin = useLoginMutation;

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('Logout successful');
      navigate('/login');
    },
    onError: (error: any) => {
      // Even if server logout fails, clear local user data
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.error(error.message || 'Logout failed');
      navigate('/login');
    }
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const result = await getCurrentUser();
        return result ?? null;
      } catch (error: any) {
        if (
          error.response?.status === 401 ||
          error.message.includes('401') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('not authenticated')
        ) {
          console.info('User not logged in yet');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
        console.error('Error fetching current user:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    initialData: null,
  });
};
