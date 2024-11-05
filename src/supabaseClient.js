
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lejlzgqszegnjctjpugq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlamx6Z3FzemVnbmpjdGpwdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzM2NDcsImV4cCI6MjA0NjM0OTY0N30.VhgBnQs_liR8MeryEpGwn-v86CkDyziRClBNOXVV0Tg'

export const supabase = createClient(supabaseUrl, supabaseKey);