import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://obvcomzemdirhbjrwzgw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idmNvbXplbWRpcmhianJ3emd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTA2OTAsImV4cCI6MjA4MzQ2NjY5MH0.5sASBpkVRHHMS_hlnDSe6RBzlmDCiFPrMFi7tfBSFdI'

export const supabase = createClient(supabaseUrl, supabaseKey)