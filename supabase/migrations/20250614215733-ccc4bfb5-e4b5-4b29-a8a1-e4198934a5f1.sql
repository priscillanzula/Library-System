
-- Update the user role for danielpriscilla61@gmail.com to librarian
UPDATE public.profiles 
SET role = 'librarian', updated_at = NOW()
WHERE email = 'danielpriscilla61@gmail.com';
