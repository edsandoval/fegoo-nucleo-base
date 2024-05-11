import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yjbwgaydopzyhkcxyqup.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYndnYXlkb3B6eWhrY3h5cXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1OTYzNzEsImV4cCI6MjAwNjE3MjM3MX0.CxZrhYkx9-33jNj1qzTLaaXpLSJsxoIap4U5JmYytqI'

//export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey, {
  localStorage: AsyncStorage as any,
})
