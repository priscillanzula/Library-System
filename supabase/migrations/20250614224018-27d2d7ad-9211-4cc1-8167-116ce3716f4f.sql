
-- Drop the existing problematic policy that's causing recursion
DROP POLICY IF EXISTS "Librarians can view all profiles" ON public.profiles;

-- Create a simpler, non-recursive policy for librarians
CREATE POLICY "Librarians can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    -- Allow if the requesting user is a librarian
    EXISTS (
      SELECT 1 FROM public.profiles curr_user
      WHERE curr_user.id = auth.uid() 
        AND curr_user.role = 'librarian'
    )
    -- OR if viewing their own profile
    OR auth.uid() = id
  );

-- Also ensure the user can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
