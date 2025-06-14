
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '../contexts/AuthContext';

interface DemoCredentialsProps {
  isLogin: boolean;
  onFillCredentials: (role: UserRole) => void;
}

const DemoCredentials: React.FC<DemoCredentialsProps> = ({ isLogin, onFillCredentials }) => {
  if (!isLogin) return null;

  return (
    <div className="mt-4 text-center space-y-2">
      <p className="text-sm text-muted-foreground font-semibold">Quick Demo Login:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFillCredentials('librarian')}
        >
          Librarian
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFillCredentials('faculty')}
        >
          Faculty
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onFillCredentials('student')}
        >
          Student
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Password: password123</p>
    </div>
  );
};

export default DemoCredentials;
