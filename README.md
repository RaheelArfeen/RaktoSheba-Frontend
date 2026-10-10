# RaktoSheba — Frontend

Blood, when it matters. RaktoSheba connects hospitals in Bangladesh with compatible, nearby blood donors. Hospitals post verified requests, admins check them, and donors whose blood is a safe match are alerted and can say "I can help" in one tap.

This is the Next.js frontend (Programming Hero B7A7). It runs on the RaktoSheba REST API (B7A6).

## Links

| | |
|---|---|
| Live website | https://raktosheba.vercel.app |
| Live API | https://raktosheba-backend.vercel.app |
| API documentation | https://raktosheba-backend.vercel.app/api/v1/docs |
| Frontend repo | https://github.com/RaheelArfeen/RaktoSheba-Frontend |
| Backend repo | https://github.com/RaheelArfeen/RaktoSheba-Backend |

## Demo accounts

The sign-in page has one-click **Demo donor**, **Demo hospital** and **Demo admin** buttons. To sign in by hand:

| Role | Email | Password |
|---|---|---|
| Admin | admin@raktosheba.com | Demo@1234 |
| Hospital | hospital@raktosheba.com | Demo@1234 |
| Donor | donor@raktosheba.com | Demo@1234 |

These are demo-only accounts created by the backend seed.

## What each role can do

**Donor**
- See every open request their blood can safely help (ABO/Rh rules), most urgent and nearest first
- Say "I can help" with a confirm step, see where to go, get directions, or withdraw if plans change
- Turn availability on or off, see when they can donate again (90-day rule), and view their donation history
- Edit blood group, last donation date, location and profile photo

**Hospital**
- Post a blood request with a multi-step wizard (blood group, units, urgency, location)
- Track each request through Pending → Verified → Donor matched → Fulfilled, with the matched donor's details
- Mark a donation as fulfilled, filter and page through all requests
- Manage the hospital profile, logo and licence document

**Admin**
- Network overview with charts (activity over time, demand by blood group, requests by emergency level)
- Verification queue sorted by emergency, hospital verification, user management (ban / unban)
- Payments and the audit log

**Everyone (no account needed)**
- Live request board with search, blood group, "requests my blood can help", urgency, status, sort and pagination — all kept in the URL
- Emergency help page with a step-by-step summary wizard, donor eligibility checker, compatibility chart, FAQ, contact page
- Emergency fund donations through Stripe (test mode)

## Highlights

- **Real-time notifications** — a notification bell for every role. New matches, donor accepted/withdrew, verifications and more arrive live over Socket.io when the API runs as a long-lived server, and every 20 seconds by polling on Vercel's serverless hosting.
- **Google sign-in** — with a role choice (donor or hospital) before sign-up and an onboarding step for new accounts.
- **Stripe test-mode checkout** — with `/payment/success` and `/payment/cancel` pages that confirm the real payment status.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions, `proxy.ts`) |
| Language | TypeScript (no `any`) |
| Styling | Tailwind CSS v4 with a custom design system |
| Component library | Radix UI (AlertDialog, DropdownMenu, Popover, Switch) |
| Data fetching | TanStack Query (dashboards) + Server Components with native fetch (public pages) |
| Global state | React Context (signed-in user, notification centre) |
| Forms | React Hook Form + Zod on every form |
| Real-time | socket.io-client |
| Payments | Stripe Checkout (test mode) |
| Feedback | Sonner toasts, loading skeletons, empty states, error boundaries |
| Icons | lucide-react |

## How it is built

- **Server first.** Pages are Server Components by default. Client Components (`"use client"`) are used only where the page needs the browser: forms, filters, dashboards with live data, menus and the notification bell.
- **Every route has `loading.tsx`** with a skeleton shaped like the page. `error.tsx`, `global-error.tsx` and `not-found.tsx` handle failures.
- **Secure auth.** Access and refresh tokens live in httpOnly cookies set by Server Actions. `src/proxy.ts` protects `/dashboard/*` by role, refreshes the access token silently, and keeps signed-in users away from the auth pages. The browser never sees a token: client requests go through the same-origin `/api/backend` proxy.
- **URL state.** Filters, search, sort and pagination use `useSearchParams`, so every view can be bookmarked and shared.
- **SEO.** Metadata on every public page, `robots.txt` and `sitemap.xml`.
- **Accessible.** Keyboard focus rings, a skip link, labelled controls, reduced-motion support, and Radix primitives for dialogs, menus and popovers.

## Pages

Public: `/`, `/requests`, `/requests/[id]`, `/donate`, `/emergency`, `/fund`, `/about`, `/faq`, `/contact`
Auth: `/auth/login`, `/auth/register`, `/onboarding`
Donor: `/dashboard/donor`, `/matches`, `/donations`, `/profile`
Hospital: `/dashboard/hospital`, `/requests`, `/requests/new`, `/requests/[id]`, `/profile`
Admin: `/dashboard/admin`, `/queue`, `/hospitals`, `/users`, `/payments`
Payment: `/payment/success`, `/payment/cancel`
Plus a custom 404 and error pages.

## Run it locally

You need Node.js 20+ and the [backend](https://github.com/RaheelArfeen/RaktoSheba-Backend) running on port 8000.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Name | Example | Notes |
|---|---|---|
| `API_BASE_URL` | `http://localhost:8000` | Backend address, no trailing slash. Production: `https://raktosheba-backend.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Used for SEO links |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:8000` | Optional. Turns on live notifications. Leave empty on Vercel (the bell polls instead) |

## Project structure

```
src/
├── app/
│   ├── (basic)/          public pages, auth, onboarding
│   ├── dashboard/        donor, hospital and admin workspaces
│   ├── payment/          Stripe success and cancel pages
│   ├── actions/          Server Actions (auth, payments, demo login)
│   └── api/              same-origin proxy to the backend
├── components/
│   ├── ui/               design-system primitives (Button, Input, Badge, Skeleton, ConfirmDialog…)
│   ├── layout/           header, footer, account menu
│   ├── dashboard/        dashboard shell, navigation, shared list controls
│   ├── notifications/    notification bell and live connection
│   └── home/, request/   home page sections and request cards
├── lib/                  API clients, TanStack Query hooks, validation schemas, helpers
├── types/                shared TypeScript types
└── proxy.ts              route protection and silent token refresh
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
