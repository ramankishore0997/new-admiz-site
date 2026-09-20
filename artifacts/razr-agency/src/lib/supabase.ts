import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables with project defaults
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://juwykdbkopjxvflvjgvq.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d3lrZGJrb3BqeHZmbHZqZ3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4ODUwNTUsImV4cCI6MjEwNTQ2MTA1NX0.v6fIXmtDDDIXTSKR-OEGgfXaoF5iGQoI1kGUbdf5jZo";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
