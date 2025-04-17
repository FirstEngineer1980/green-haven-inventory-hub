
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Only redirect after we've checked authentication status
    // and only if we haven't already redirected
    if (!isLoading && !hasRedirected) {
      console.log("Auth check complete, authenticated:", isAuthenticated);
      setHasRedirected(true);
      
      if (isAuthenticated) {
        console.log("Redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      } else {
        console.log("Redirecting to login");
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, hasRedirected]);
  
  // Return a loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>
  );
};

export default Index;
