import { createClient } from '@supabase/supabase-js';

// Resolve Supabase URL from environment variables (client-side Vite or Node server)
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  'https://qvmmhhhnzpqcrsrcxnhd.supabase.co';

// Resolve Supabase Anon/Publishable Key from environment variables
const supabaseKey =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_API_KEY || import.meta.env.SUPABASE_API_KEY)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_API_KEY || process.env.SUPABASE_API_KEY)) ||
  'sb_publishable_Mw5z11pIr3fpEUfuIpRcSg_NPsZQGH8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { supabaseUrl, supabaseKey };
export default supabase;
