
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '../contexts/AuthContext';

interface DemoCredentialsProps {
  isLogin: boolean;
  onFillCredentials: (role: UserRole) => void;
}

const DemoCredentials: React.FC<DemoCredentialsProps> = ({ isLogin, onFillCredentials }) => {
  if (!isLogin) return null;

  const fillLibrarianCredentials = () => {
    onFillCredentials('librarian');
  };

  const fillFacultyCredentials = () => {
    onFillCredentials('faculty');
  };

  const fillStudentCredentials = () => {
    onFillCredentials('student');
  };

  return (
    <div className="mt-4 text-center space-y-2">
      <p className="text-sm text-muted-foreground font-semibold">Quick Demo Login:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillLibrarianCredentials}
        >
          Librarian
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillFacultyCredentials}
        >
          Faculty
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillStudentCredentials}
        >
          Student
        </Button>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Librarian: demo.librarian@gmail.com</p>
        <p>Faculty: demo.faculty@gmail.com</p>
        <p>Student: demo.student@gmail.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );
};

export default DemoCredentials;
