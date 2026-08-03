# GearUp — Gear Rental Marketplace

A full-stack gear rental platform where customers rent outdoor/equipment gear by the day, providers list and manage their inventory, and admins moderate the platform.

This repository is the **frontend** built with **Next.js (App Router)**. It talks to the GearUp backend API through a proxied `/api` route.

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **TanStack Query** — server-state fetching, caching & invalidation
- **React Context API** — auth session (`AuthProvider`) and theme
- **react-hook-form + zod** — form state and validation
- **Tailwind CSS v4** with **shadcn/ui** components (Radix primitives, lucide icons)
- **Stripe** (react-stripe-js) — checkout for rental payments
- **jsonwebtoken** — server-side JWT verification in middleware

## Features

- **Public**
  - Browse & filter gear (search, category, brand, price range, sort, pagination)
  - Gear detail page with reviews, availability and a rent-now panel
- **Auth**
  - Register / login (customer or provider), JWT sessions with silent refresh
  - Middleware-protected dashboards with role-based access (`proxy.ts`)
- **Customer**
  - Place rental orders, pay via Stripe, view rental history & payments, leave reviews
- **Provider**
  - CRUD for gear listings, manage incoming orders and update their status
- **Admin**
  - Oversight of users, gear and all rental orders; block/unblock users

## Getting Started

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file (see `.env.local` for reference):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL used by the `/api` proxy (e.g. `https://backend.vercel.app/api`) |
| `BACKEND_API_URL` | Backend base URL used by server-side services (refresh token, get me) |
| `JWT_ACCESS_SECRET` | Secret used to verify access tokens in middleware |
| `JWT_REFRESH_SECRET` | Secret used to verify refresh tokens in middleware |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for checkout |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  api/[...path]/route.ts   # catch-all proxy → backend API
  (publicGroup)/           # landing, gear browse/detail, payment pages
  (authGroup)/             # login & register
  (dashboardGroup)/        # customer / provider / admin dashboards
  providers/               # AuthProvider, Providers (QueryClient + theme)
components/
  ui/                      # shadcn/ui primitives
  shared/                  # navbar, footer, gear-card, status badges, etc.
  theme/                   # theme provider + toggle
hooks/                     # TanStack Query hooks (gear, customer, provider, admin)
lib/                       # api client, types, validation, auth, format, stripe
service/                   # server actions (refreshToken, getMe)
utils/                     # jwt helpers
proxy.ts                   # Next.js middleware (auth/RBAC gate)
```

## API Integration

Every page/component-to-endpoint mapping is documented in **[API_INTEGRATION.md](./API_INTEGRATION.md)**. In short: components call hooks in `hooks/*`, which use `apiFetch` (`lib/api.ts`) against `/api/<path>`, proxied to the backend by `app/api/[...path]/route.ts` with the auth header attached.
