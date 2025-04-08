
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-gh-green to-gh-blue w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              GH
            </div>
            <h1 className="text-2xl font-bold">Green Haven</h1>
            <p className="text-gray-500">Inventory Management System</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greenhaven.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-gh-blue hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gh-green to-gh-blue hover:from-gh-green/90 hover:to-gh-blue/90"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <div className="text-gray-500 mb-2">Demo Accounts:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Admin</div>
                <div>admin@greenhaven.com</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Manager</div>
                <div>john@greenhaven.com</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Staff</div>
                <div>sarah@greenhaven.com</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Viewer</div>
                <div>michael@greenhaven.com</div>
              </div>
            </div>
            <div className="mt-2 text-gray-400 text-xs">
              (No password required for demo)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
