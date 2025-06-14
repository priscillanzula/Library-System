
import { supabase } from '@/integrations/supabase/client';

const demoUsers = [
  {
    email: 'demo.librarian@gmail.com',
    password: 'password123',
    userData: { full_name: 'Demo Librarian', role: 'librarian' }
  },
  {
    email: 'demo.faculty@gmail.com', 
    password: 'password123',
    userData: { full_name: 'Demo Faculty', role: 'faculty' }
  },
  {
    email: 'demo.student@gmail.com',
    password: 'password123', 
    userData: { full_name: 'Demo Student', role: 'student' }
  }
];

export const createDemoUsersIfNeeded = async () => {
  try {
    for (const user of demoUsers) {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', user.email)
        .single();

      if (!existingProfile) {
        console.log(`Creating demo user: ${user.email}`);
        
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: user.userData,
          },
        });

        if (error && !error.message.includes('User already registered')) {
          console.error(`Failed to create demo user ${user.email}:`, error);
        } else {
          console.log(`Demo user ${user.email} created successfully`);
        }
      }
    }
  } catch (error) {
    console.error('Error creating demo users:', error);
  }
};
