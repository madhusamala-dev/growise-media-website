/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Google OAuth client ID (browser-safe). See .env.example. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
  /** Spring Boot backend origin, e.g. http://localhost:8080. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
