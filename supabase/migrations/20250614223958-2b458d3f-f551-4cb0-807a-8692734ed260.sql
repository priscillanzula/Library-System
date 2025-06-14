
-- Check the current status of your user account and profile
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.confirmed_at,
  u.created_at,
  u.raw_user_meta_data,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'danielpriscilla61@gmail.com';

-- If the user exists but doesn't have a profile, create one
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'full_name', 'Daniella Priscilla'),
  u.email,
  'librarian'
FROM auth.users u
WHERE u.email = 'danielpriscilla61@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Update the role to librarian if the profile exists but has wrong role
UPDATE public.profiles 
SET role = 'librarian'
WHERE email = 'danielpriscilla61@gmail.com' 
  AND role != 'librarian';
