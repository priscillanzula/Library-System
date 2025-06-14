
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
  LogOut,
  History
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

  // Define navigation items based on role
  const getNavItems = () => {
    const isLibrarian = userProfile?.role === 'librarian';
    
    if (isLibrarian) {
      // Librarian navigation - full access
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Home, permission: null },
        { id: 'books', label: 'Books', icon: BookOpen, permission: 'view_books' },
        { id: 'members', label: 'Members', icon: Users, permission: 'view_members' },
        { id: 'transactions', label: 'Transactions', icon: BarChart3, permission: null },
        { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'view_reports' },
        { id: 'settings', label: 'Settings', icon: Settings, permission: 'manage_settings' },
      ];
    } else {
      // Member navigation - limited access
      return [
        { id: 'history', label: 'My History', icon: History, permission: null },
      ];
    }
  };

  const navItems = getNavItems();

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
    <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-lg md:text-2xl font-bold">LibraryMS</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
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
                size="sm"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Mobile Navigation Menu */}
        <div className="flex md:hidden">
          <select
            value={currentPage}
            onChange={(e) => onPageChange(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            {navItems.map((item) => {
              const hasAccess = !item.permission || hasPermission(item.permission);
              if (!hasAccess) return null;
              
              return (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative hidden md:flex">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1 md:gap-2">
                <p className="text-xs md:text-sm font-medium truncate max-w-20 md:max-w-none">
                  {userProfile?.full_name || 'User'}
                </p>
                {userProfile && (
                  <Badge className={getRoleColor(userProfile.role)} variant="secondary">
                    {userProfile.role}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-20 md:max-w-none">
                {user?.email}
              </p>
            </div>
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs md:text-sm font-medium">
              {(userProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="ml-1 md:ml-2"
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
