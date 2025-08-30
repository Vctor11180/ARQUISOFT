import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza con tus variables reales (usa .env y process.env.EXPO_PUBLIC_*)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] Faltan credenciales SUPABASE_URL o SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
