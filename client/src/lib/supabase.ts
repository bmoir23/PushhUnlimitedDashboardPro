import { createClient } from '@supabase/supabase-js';

// Fixed hard-coded URL and key since environment variables are swapped
// This is a temporary fix until the environment variables are corrected
const SUPABASE_URL = 'https://eqwkqcbmgulilfzuzqzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd2txY2JtZ3VsaWxmenV6cXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjA4OTMsImV4cCI6MjA1NzM5Njg5M30.TmOhDcZWDT1Db1p40eBBusG1K5EvHLaPpw70Kr039Qc';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);