
-- Add price column to books (if we had a books table, but we're using mock data)
-- We'll handle this in the component for now

-- Create transactions table for book borrowing/returning
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL, -- Using TEXT since we're working with mock book data
  book_title TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('borrow', 'return')),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  returned_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
  price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_blacklist table for tracking blacklisted members
CREATE TABLE public.member_blacklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  blacklisted_by UUID REFERENCES public.profiles(id),
  blacklisted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_blacklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (
    auth.uid() = member_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'librarian')
  );

CREATE POLICY "Librarians can insert transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'librarian')
  );

CREATE POLICY "Librarians can update transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'librarian')
  );

CREATE POLICY "Members can insert their own borrow requests" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = member_id AND 
    transaction_type = 'borrow'
  );

-- RLS Policies for member_blacklist
CREATE POLICY "Librarians can manage blacklist" 
  ON public.member_blacklist 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'librarian')
  );

CREATE POLICY "Members can view their blacklist status" 
  ON public.member_blacklist 
  FOR SELECT 
  USING (auth.uid() = member_id);

-- Create function to automatically update status to overdue
CREATE OR REPLACE FUNCTION public.update_overdue_transactions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.transactions 
  SET status = 'overdue'
  WHERE status = 'active' 
    AND due_date < now() 
    AND transaction_type = 'borrow'
    AND returned_date IS NULL;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER member_blacklist_updated_at
  BEFORE UPDATE ON public.member_blacklist
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
