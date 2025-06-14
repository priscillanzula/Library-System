
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  Search,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user, userProfile, signOut, hasPermission } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: null },
    { id: 'books', label: 'Books', icon: BookOpen, permission: 'view_books' },
    { id: 'members', label: 'Members', icon: Users, permission: 'view_members' },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'view_reports' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'manage_settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'librarian': return 'bg-purple-100 text-purple-800';
      case 'faculty': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'public': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">LibraryMS</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const hasAccess = !item.permission || hasPermission(item.permission);
            
            if (!hasAccess) return null;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{userProfile?.full_name || 'User'}</p>
                {userProfile && (
                  <Badge className={getRoleColor(userProfile.role)}>
                    {userProfile.role}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {(userProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
