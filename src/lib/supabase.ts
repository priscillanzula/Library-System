
import { createClient } from '@supabase/supabase-js';

// For Lovable's Supabase integration, these values should be provided
// If you're seeing this error, make sure you've connected to Supabase using the green button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
