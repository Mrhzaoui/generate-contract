import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key from your Supabase dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
