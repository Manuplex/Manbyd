import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL//||'https://placeholder-dont-crash-build.supabase.co'
const supabaseserviceroleKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY //|| 'placeholder-key-for-build'

export const supabase = createClient(supabaseUrl, supabaseserviceroleKey)