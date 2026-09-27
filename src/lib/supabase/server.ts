import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase/config"

export async function createClient() {
  const url = supabaseUrl()
  const anonKey = supabaseAnonKey()

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component; middleware refreshes session.
        }
      },
    },
  })
}

export { isSupabaseConfigured }