
-- Insert demo user accounts into auth.users table
-- Note: In a real Supabase setup, you would typically create these through the auth.signup() function
-- But for demo purposes, we'll create them directly

-- First, let's make sure we have the demo accounts available
-- These will be created through the application's sign-up process to ensure proper auth flow

-- Create a function to help create demo users if they don't exist
CREATE OR REPLACE FUNCTION create_demo_user_if_not_exists(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT,
  user_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user already exists in profiles table
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = user_email) THEN
    -- Note: This is a simplified approach for demo purposes
    -- In production, users should always be created through Supabase Auth signup
    RAISE NOTICE 'Demo user % needs to be created through signup', user_email;
  END IF;
END;
$$;

-- Check for demo users
SELECT create_demo_user_if_not_exists('librarian@example.com', 'password123', 'Demo Librarian', 'librarian');
SELECT create_demo_user_if_not_exists('faculty@example.com', 'password123', 'Demo Faculty', 'faculty');
SELECT create_demo_user_if_not_exists('student@example.com', 'password123', 'Demo Student', 'student');
