
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
    // Include isLoading in dependency array to prevent multiple redirects
  }, [navigate, isAuthenticated, isLoading]);
  
  // Return a loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Index;
