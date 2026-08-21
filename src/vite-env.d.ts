/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/public key. */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Public Google OAuth client ID (browser-safe). See .env.example. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
  /** Spring Boot backend origin, e.g. http://localhost:8080. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
