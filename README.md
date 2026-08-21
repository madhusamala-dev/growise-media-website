# GroWise — Agency Website + Lead-Capture Backend

> You run the business. We run your social media.

GroWise is an AI-powered advertising & social media management agency. This repository contains:

- **Frontend** — a premium, conversion-focused single-page agency site (Vite + React + TypeScript + Tailwind CSS v4)
- **Backend** — a small Express API with a SQLite database (Node's built-in `node:sqlite`, no native deps) that stores lead-form submissions

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, lucide-react |
| Backend  | Node.js (≥ 22.13), Express 5, `node:sqlite`       |

## Getting started

```bash
npm install          # install everything
cp .env.example .env # set ADMIN_TOKEN (and WhatsApp number if you have one)
npm run dev          # frontend on :5173, API on :3001 (Vite proxies /api)
```

Open http://localhost:5173

## Production

```bash
npm run build        # type-check + build the frontend into dist/
npm start            # Express serves dist/ + the API on :3001 (NODE_ENV=production)
```

Open http://localhost:3001

## API

| Method | Route         | Auth                                    | Purpose                          |
| ------ | ------------- | --------------------------------------- | -------------------------------- |
| GET    | `/api/health` | —                                       | Health check                     |
| POST   | `/api/leads`   | Rate-limited (5/hour per IP)            | Store a lead-form submission     |
| GET    | `/api/leads`   | `?token=<ADMIN_TOKEN>` from `.env`      | List submissions (locked if unset) |

Example:

```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya","businessName":"Sharma Sweets","phone":"+91 98765 43210"}'
```

Leads are stored in `data/leads.db` (SQLite). Delete the `data/` folder to reset.

## Authentication (client portal) — Google OAuth + Spring Boot

The client portal (`/login`, `/dashboard`, …) is architected for real Google
sign-in through a future Spring Boot backend:

```
Browser ──▶ Spring Boot /oauth2/authorization/google ──▶ Google OAuth
    ▲                                                          │
    │                                                          ▼
    └── /auth/callback ◀── Spring Boot (verified session) ── Google redirect
            │
            ▼
    GET /api/auth/me ──▶ SessionUser ──▶ protected dashboard
```

### Frontend modules

- `src/portal/lib/authConfig.ts` — environment-driven OAuth config
- `src/portal/lib/authService.ts` — real auth service (`startGoogleSignIn`,
  `fetchCurrentUser`, `signOut`). Returns `unconfigured` when the env vars are
  missing — **it never fakes a login**.
- `src/portal/lib/auth.tsx` — session context + route guards. The email/password
  login below the Google button is a clearly-marked **prototype demo**; the
  Google path hydrates a backend-verified session via `establishSession()`.
- `src/portal/pages/auth/OAuthCallback.tsx` — where Spring Boot redirects back;
  hydrates the session and routes to `/dashboard` or `/onboarding`.

### Environment variables

| Variable                 | Required | Purpose                                        |
| ------------------------ | -------- | ---------------------------------------------- |
| `VITE_API_BASE_URL`      | for OAuth | Spring Boot origin (empty = same-origin `/api`). The Google button stays in its clean "unconfigured" state until this is set. |
| `VITE_GOOGLE_CLIENT_ID`  | optional | Public Google OAuth client ID (browser-safe). Not needed for the Spring Boot OAuth2-client flow (the ID lives server-side); reserved for a future direct-OIDC (PKCE) integration. |

The Google **client secret is backend-only** — it lives in Spring Boot's config,
never in this repository or the browser.

### Still to configure in Google Cloud

1. Create an OAuth consent screen (External; add the GroWise domain).
2. Create an **OAuth Client ID** (Web application).
3. Add the Spring Boot callback as an authorized redirect URI, e.g.
   `http://localhost:8080/login/oauth2/code/google`.
4. Put the client ID in `.env` (`VITE_GOOGLE_CLIENT_ID`) and the client
   secret in the Spring Boot backend config.

### Still to implement in Spring Boot

1. `spring-boot-starter-oauth2-client` with the Google registration
   (`client-id` / `client-secret` from its environment).
2. A success handler that redirects the browser to `/auth/callback`.
3. `GET /api/auth/me` returning the `SessionUser` for the current session.
4. `POST /api/auth/logout` ending the session.

Until those exist, the Google button shows a clean "not connected" development
message — it never creates a fake session or redirects to the dashboard.

## Editing site content

All copy lives in `src/data/` — services, pricing, portfolio, FAQ, steps, testimonials
and site-wide config (`src/data/site.ts`). Prices, CTAs and contact details are updated
there without touching components.

- **Real contact details**: `src/data/site.ts` → `contact` (WhatsApp number, email, location)
- **Pricing**: `src/data/pricing.ts`
- **Portfolio**: `src/data/portfolio.ts` — set `videoUrl`/`thumbnailUrl` on any project to swap a sample placeholder for real media
- **Testimonials**: `src/data/testimonials.ts` — currently clearly-marked placeholders (we never invent clients)

## Roadmap (not built — by design)

Customer dashboard, online payments, AI generation features, social media APIs,
automated publishing, analytics, CRM, WhatsApp integration. The architecture (data-driven
components + a real API + SQLite) is set up to grow into these without a rewrite.
