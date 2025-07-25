// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://srputbdcdccceuttdpvx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHV0YmRjZGNjY2V1dHRkcHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzkwNzEsImV4cCI6MjA2OTAxNTA3MX0.stvTSpOv2lgs5n2t3KbeJm_ds_9dmXe-mteg3ntaeIE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});