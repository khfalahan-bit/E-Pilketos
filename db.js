import { createClient } from '@supabase/supabase-js';

// Resolve URL and Key for Node.js scripts and tools
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://qvmmhhhnzpqcrsrcxnhd.supabase.co';

const supabaseKey =
  process.env.VITE_SUPABASE_API_KEY ||
  process.env.SUPABASE_API_KEY ||
  'sb_publishable_Mw5z11pIr3fpEUfuIpRcSg_NPsZQGH8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
