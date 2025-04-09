import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wwxfpfzzfegyqmaegbjr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eGZwZnp6ZmVneXFtYWVnYmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjUxODEsImV4cCI6MjA1OTc0MTE4MX0.teK72pJYdmXZOIVvVcTvorMqwrKfRpX8a_JGmqz3N5I"

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 