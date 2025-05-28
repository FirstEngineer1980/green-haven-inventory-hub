
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
      toast.success(data.message || 'Registration successful');
      navigate('/forms');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    }
  });
};

// Export the login mutation hook with two names for backward compatibility
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      return await login(email, password);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success(data.message || 'Login successful');
      // Navigate after successful login
      navigate('/forms');
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed');
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
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success(data.message || 'Logout successful');
      navigate('/login');
    },
    onError: (error: Error) => {
      // Even if server logout fails, clear local user data
      queryClient.setQueryData(['user'], null);
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
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error.message.includes('401') ||
           error.message.includes('Unauthorized') ||
           error.message.includes('not authenticated'))
        ) {
          console.info('User not logged in yet');
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
