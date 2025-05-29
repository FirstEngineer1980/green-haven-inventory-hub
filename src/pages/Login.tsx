
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  email: string;
  password: string;
}

// Define the Login component
const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error in component:', error);
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                      id="password"
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
  );
};

export default Login;
