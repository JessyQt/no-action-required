// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rkreargsinhaaqirifuu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmVhcmdzaW5oYWFxaXJpZnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzEzMTIsImV4cCI6MjA1MDEwNzMxMn0.Pv0mZcBsAJeViX4pTmpUhDm7mbWzPUKGhg13PPleXy8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);