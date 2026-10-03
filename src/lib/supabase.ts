import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(envUrl && envAnonKey && !envAnonKey.includes("your_"));

export const supabase = createClient(envUrl || "https://erbardzziylzfewizzwb.supabase.co", envAnonKey || "replace-with-your-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
