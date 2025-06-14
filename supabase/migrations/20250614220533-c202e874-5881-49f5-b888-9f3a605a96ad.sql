
-- Mark the user account as confirmed so they can log in
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'danielpriscilla61@gmail.com';
