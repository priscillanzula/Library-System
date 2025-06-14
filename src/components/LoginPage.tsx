
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';
import DemoCredentials from './DemoCredentials';
import AuthToggle from './AuthToggle';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !fullName) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setError('');

    if (isLogin) {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        toast({
          title: "Login Failed",
          description: signInError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
      }
    } else {
      // Register and then automatically sign in
      const { error: signUpError } = await signUp(email, password, { 
        full_name: fullName,
        role: selectedRole 
      });

      if (signUpError) {
        setError(signUpError.message);
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive",
        });
      } else {
        // Automatically sign in after successful registration
        const { error: signInError } = await signIn(email, password);
        
        if (signInError) {
          // If auto sign-in fails, show success message for registration
          toast({
            title: "Registration Successful!",
            description: "Please try logging in with your new credentials.",
          });
          setIsLogin(true);
          setPassword('');
          setFullName('');
        } else {
          toast({
            title: "Welcome to LibraryMS!",
            description: "Your account has been created and you are now logged in.",
          });
        }
      }
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setFullName('');
  };

  const fillDemoCredentials = (role: UserRole) => {
    setEmail(`${role}@example.com`);
    setPassword('password123');
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">LibraryMS</h1>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome back' : 'Create account'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to your account to access the library system'
              : 'Create a new account to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
          />
          
          <AuthToggle isLogin={isLogin} onToggle={toggleMode} />
          
          <DemoCredentials 
            isLogin={isLogin} 
            onFillCredentials={fillDemoCredentials} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
