import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yjbwgaydopzyhkcxyqup.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_KEY'

//export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey, {
  localStorage: AsyncStorage as any,
})
