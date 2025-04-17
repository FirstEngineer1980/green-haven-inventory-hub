
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Only redirect after we've checked authentication status
    if (!isLoading) {
      console.log("Auth check complete, authenticated:", isAuthenticated);
      if (isAuthenticated) {
        console.log("Redirecting to dashboard");
        // Force navigation to dashboard
        window.location.href = '/dashboard';
      } else {
        console.log("Redirecting to login");
        // Force navigation to login
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, isLoading]);
  
  // Return a loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>
  );
};

export default Index;
