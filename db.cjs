require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Test the connection
// Catatan: Ganti 'your_table' dengan nama salah satu tabel yang ada di database Supabase proyek ini
supabase
  .from('User')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) console.error('Connection error:', error);
    else console.log('Connected to Supabase successfully:', data);
  });

module.exports = supabase;
