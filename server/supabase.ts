import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://vpqjytpuudiqxrzeshuv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU3NDA3OSwiZXhwIjoyMDY0MTUwMDc5fQ.oAGS1KjZ8W0Fho6kB35hU-3bJ3kWHBYAAL1iNGk5dsU'

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client-side client for user operations  
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)