
-- First, let's check the current status of the user account
SELECT id, email, email_confirmed_at, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'danielpriscilla61@gmail.com';

-- Also check if there's a corresponding profile
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'danielpriscilla61@gmail.com';

-- Let's also check if there are any issues with the auth schema
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'danielpriscilla61@gmail.com';
