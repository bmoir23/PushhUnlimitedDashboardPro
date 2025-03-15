import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Always use the hardcoded values for now to avoid URL construction issues
// Make sure this is a valid URL with https:// prefix
const SUPABASE_URL = 'https://eqwkqcbmgulilfzuzqzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd2txY2JtZ3VsaWxmenV6cXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjA4OTMsImV4cCI6MjA1NzM5Njg5M30.TmOhDcZWDT1Db1p40eBBusG1K5EvHLaPpw70Kr039Qc';

console.log('Using Supabase URL:', SUPABASE_URL);

// Create the Supabase client 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);