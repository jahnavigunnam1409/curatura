import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);
