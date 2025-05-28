// src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Supabase URL is not defined. Please check your .env.local file for NEXT_PUBLIC_SUPABASE_URL.");
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL. Check server logs for more details if this is a server-side component, or browser console if client-side.");
}
if (!supabaseKey) {
  console.error("Supabase Anon Key is not defined. Please check your .env.local file for NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY. Check server logs for more details if this is a server-side component, or browser console if client-side.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
