
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Only redirect after we've checked authentication status
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, isAuthenticated, isLoading]);
  
  // Return a loading state or null while checking auth
  return isLoading ? (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>
  ) : null;
};

export default Index;
