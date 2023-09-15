import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xvdhdrezujxnmevczjsj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGhkcmV6dWp4bm1ldmN6anNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4MTc5MTAsImV4cCI6MjAwNjM5MzkxMH0.P4UUIpCRCWgtYwSkN5hyudiEr2hhEwPElMGbj2F8xP8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)