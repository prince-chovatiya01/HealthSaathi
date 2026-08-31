// Supabase integration is optional and not currently used in HealthSaathi.
// This file is kept for future use but will NOT throw on missing env vars.
// If you want to enable Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.

let supabase: any = null;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  // Dynamically import only when env vars are available
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }).catch(() => {
    // Supabase package not installed — safe to ignore
  });
}

export { supabase };
export default supabase;