
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export type UserRole = 'librarian' | 'faculty' | 'student' | 'public';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  librarian: ['add_book', 'edit_book', 'delete_book', 'add_member', 'edit_member', 'delete_member', 'view_reports', 'manage_settings'],
  faculty: ['add_book', 'edit_book', 'view_reports'],
  student: ['view_books', 'view_members'],
  public: ['view_books']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // For demo purposes, we'll determine role based on email
        // In a real app, this would come from a database
        const role = determineUserRole(session.user.email || '');
        setUserProfile({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const role = determineUserRole(session.user.email || '');
          setUserProfile({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'User',
            role
          });
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Demo function to determine role based on email
  // In a real app, this would be stored in the database
  const determineUserRole = (email: string): UserRole => {
    if (email.includes('librarian') || email.includes('admin')) {
      return 'librarian';
    } else if (email.includes('faculty') || email.includes('professor')) {
      return 'faculty';
    } else if (email.includes('student')) {
      return 'student';
    } else {
      return 'public';
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    return rolePermissions[userProfile.role]?.includes(permission) || false;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
