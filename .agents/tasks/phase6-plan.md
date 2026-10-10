# Implementation Plan — Phase 6: Admin Dashboard

## Codebase findings

### What already exists

**`src/lib/admin.ts`** — exports `adminApi` with one method: `analytics(token)` → `api<Analytics>(...)`. No other methods exist.

**`src/types/index.ts`** — all needed types already exist: `Analytics`, `TimeSeries`, `AuditLog`, `Payment`, `Hospital`, `UserProfile`, `BloodRequest`, `Paginated`, `PaymentStatus`, `PaymentPurpose`, `RequestStatus`. **No type gaps** — nothing needs adding.

**`src/app/dashboard/admin/page.tsx`** — working Server Component. Fetches analytics, renders 4 stat cards (Donors/Hospitals/Donations/Banned users) + requests-by-status grid. Must be **preserved** — only add the chart section at the bottom.

**`src/app/dashboard/admin/loading.tsx`** — working loading skeleton for overview page.

**`src/components/dashboard/nav-config.ts`** — ADMIN array has exactly **1 item**: `{ href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard }`. Phase 6 adds 4 more.

**`src/components/ui/confirm-dialog.tsx`** — exists. Props: `title`, `children`, `confirmLabel`, `tone?: 'primary' | 'danger'`, `pending?`, `onConfirm`, `onClose`. Usage: mount only while open (conditional render), `tone='danger'` for destructive actions.

**`src/app/actions/hospital.ts`** — ActionResult pattern: `export type ActionResult = { error: string } | { ok: true }`. Private token helper calls `getSession()`, checks role, redirects to login if missing. `messageFor` converts `ApiError | unknown` to string. `revalidatePath(path, 'layout')` for layout-level refresh.

**`recharts`** — **NOT installed**. Must `npm install recharts@^2.15.0` before writing chart code.

**Blood group badge tone** (from `request-card.tsx` `groupTone`):
- `critical` / `severe` → `bg-blush text-blood`
- `urgent` → `bg-sand text-sand-deep`
- `standard` → `bg-mint text-forest`

**`EmergencyBadge` level styles** (from `badge.tsx`):
- `critical` → `bg-blood text-cream`
- `severe` → `bg-blush text-blood`
- `urgent` → `bg-sand text-sand-deep`
- `standard` → `bg-linen text-ink-muted`

**`src/app/actions/payments.ts`** — exists (Stripe checkout for fund page). Not an admin actions file. Admin actions need a new file `src/app/actions/admin.ts`.

### TypeScript notes
- Use explicit `{ searchParams: Promise<Record<string, string | string[] | undefined>> }` for new page components (Next.js regenerates `routes.d.ts` on build).
- `recharts` ships its own types — no `@types/recharts` needed.
- All `apiPaginated<T[]>` calls require the `T[]` type param to match what the backend returns.
- `Hospital.user` is typed as `{ id: string; email: string } | undefined` — always use optional chaining.

---

## Commit plan

- [ ] 1. **Install recharts and add nav items** (commit 25 prep)
      Install `recharts@^2.15.0`. Add 4 admin nav items to `ADMIN` array in `nav-config.ts`: Verification queue (`/dashboard/admin/queue`, `ClipboardCheck`), Hospitals (`/dashboard/admin/hospitals`, `Building2`), Users (`/dashboard/admin/users`, `Users`), Payments & audit (`/dashboard/admin/payments`, `CreditCard`). Note: `Building2` and `Users` are already imported in the file for other roles — check before adding to the import statement to avoid duplicates.
      Files: `package.json`, `package-lock.json`, `src/components/dashboard/nav-config.ts`
      Verify: `npm run build && npm run lint` — both exit 0.

- [ ] 2. **Extend `adminApi` with `timeSeries` and add `AdminCharts` client component** (commit 25)
      Add `timeSeries: (token, days?) => api<TimeSeries>('/admin/analytics/time-series', { token, cache: 'no-store', query: { days } })` to `adminApi` in `src/lib/admin.ts`. Create `src/app/dashboard/admin/components/admin-charts.tsx` as a `'use client'` component. Props: `{ timeSeries: TimeSeries }`. Use `ResponsiveContainer`, `AreaChart`/`Area` for daily requests+donations (30 days), `BarChart`/`Bar` for blood group open counts. Colors: `#A92836` for requests/blood, `#2D7A5F` for donations. Wrap in `<div className="rounded-[24px] border border-ink/10 bg-cream p-6 space-y-6">`. Edit `src/app/dashboard/admin/page.tsx` to call `Promise.all([adminApi.analytics(...), adminApi.timeSeries(...)])` and render `<AdminCharts timeSeries={ts} />` below the existing status card. Update `loading.tsx` to include chart placeholders.
      Files: `src/lib/admin.ts`, `src/app/dashboard/admin/components/admin-charts.tsx`, `src/app/dashboard/admin/page.tsx`, `src/app/dashboard/admin/loading.tsx`
      Verify: `npm run build && npm run lint` — both exit 0.
      Commit: `git commit -m 'feat: add admin overview with charts'`

- [ ] 3. **Admin server actions file and remaining `adminApi` methods** (commit 26 prep)
      Create `src/app/actions/admin.ts` with `'use server'`, private `adminToken()` helper (mirrors `hospitalToken()` in `hospital.ts` but checks `role !== 'ADMIN'` and redirects to `/auth/login?next=/dashboard/admin`), and exported `verifyRequest`, `cancelRequest`, `verifyHospital` functions — all return `ActionResult`. Extend `src/lib/admin.ts` with: `queue(token, query?)` → `apiPaginated<BloodRequest[]>('/admin/requests/pending', ...)`, `verifyRequest(token, id)`, `cancelRequest(token, id)`, `verifyHospital(token, id)`, `banUser(token, id)`, `unbanUser(token, id)`. Import all needed types.
      Files: `src/app/actions/admin.ts`, `src/lib/admin.ts`
      Verify: `npm run build && npm run lint` — both exit 0.

- [ ] 4. **Verification queue page** (commit 26)
      Create `src/app/dashboard/admin/queue/page.tsx` (async Server Component, metadata `{ title: 'Verification queue' }`): parses `page` from searchParams, fetches `adminApi.queue(token, { page, limit: 20 })`, renders Eyebrow + h1, list of `<QueueRow>` components, empty state, and Prev/Next pagination links. Create `src/app/dashboard/admin/queue/components/queue-row.tsx` (`'use client'`): renders blood group tile + hospital info + `<EmergencyBadge>` on left, Verify (`variant='forest'`) and Cancel (`variant='outline'`) buttons on right. Each button opens a `<ConfirmDialog>` (Cancel uses `tone='danger'`). Actions call `verifyRequest`/`cancelRequest` in `startTransition`, show `toast.success`/`toast.error`. Create `src/app/dashboard/admin/queue/loading.tsx` (8 row skeletons).
      Files: `src/app/dashboard/admin/queue/page.tsx`, `src/app/dashboard/admin/queue/components/queue-row.tsx`, `src/app/dashboard/admin/queue/loading.tsx`
      Verify: `npm run build && npm run lint` — both exit 0.
      Commit: `git commit -m 'feat: add verification queue sorted by emergency'`

- [ ] 5. **Hospital management page** (commit 27 — part 1)
      Extend `adminApi` with `hospitals(token, query?)` → `apiPaginated<Hospital[]>('/admin/hospitals', ...)`. Create `src/app/dashboard/admin/hospitals/page.tsx` (Server Component): `filter` param ('all' | 'unverified'), passes `verified: false` for unverified tab. Filter tabs as `<ButtonLink>` chips. List of `<HospitalRow>` components. Create `src/app/dashboard/admin/hospitals/components/hospital-row.tsx` (`'use client'`): shows name, address, email. Verified hospitals get a green `<BadgeCheck>` badge; unverified get a "Verify" button → `<ConfirmDialog>` → calls `verifyHospital`. Create `loading.tsx` (10 row skeletons).
      Files: `src/lib/admin.ts`, `src/app/dashboard/admin/hospitals/page.tsx`, `src/app/dashboard/admin/hospitals/components/hospital-row.tsx`, `src/app/dashboard/admin/hospitals/loading.tsx`
      Verify: `npm run build && npm run lint` — both exit 0.

- [ ] 6. **User management page** (commit 27 — part 2)
      Extend `src/app/actions/admin.ts` with exported `banUser` and `unbanUser` functions. Extend `adminApi` with `users(token, query?)` → `apiPaginated<UserProfile[]>('/admin/users', ...)`. Create `src/app/dashboard/admin/users/page.tsx` (Server Component): `filter` param ('all' | 'banned'), passes `isBanned: true` for banned tab. Create `src/app/dashboard/admin/users/components/user-row.tsx` (`'use client'`): shows email, role badge, join date. Banned users get a red "Banned" badge + "Unban" button; active users get a "Ban" button with `tone='danger'` dialog. Create `loading.tsx`.
      Files: `src/app/actions/admin.ts`, `src/lib/admin.ts`, `src/app/dashboard/admin/users/page.tsx`, `src/app/dashboard/admin/users/components/user-row.tsx`, `src/app/dashboard/admin/users/loading.tsx`
      Verify: `npm run build && npm run lint` — both exit 0.
      Commit: `git commit -m 'feat: add hospital and user management'`

- [ ] 7. **Payments and audit log page** (commit 28)
      Extend `adminApi` with `payments(token, query?)` → `apiPaginated<Payment[]>('/admin/payments', ...)` and `auditLog(token, query?)` → `apiPaginated<AuditLog[]>('/admin/audit', ...)`. Create `src/app/dashboard/admin/payments/page.tsx` (Server Component): tab param ('payments' | 'audit'). Payment rows: user email, purpose badge (PLATFORM_DONATION → `bg-blush text-blood`, EMERGENCY_FUND → `bg-sand text-sand-deep`), status badge (PAID → `bg-mint text-forest`, PENDING → `bg-sand text-sand-deep`, FAILED → `bg-linen text-ink-muted`), amount via `formatCurrency`. Audit rows: actor email, `<code>` action, targetType+id, `formatDateTime` timestamp. Pagination. Create `loading.tsx` (8 row skeletons). No client components needed — this is all read-only.
      Files: `src/lib/admin.ts`, `src/app/dashboard/admin/payments/page.tsx`, `src/app/dashboard/admin/payments/loading.tsx`
      Verify: `npm run build && npm run lint` — both exit 0.
      Commit: `git commit -m 'feat: add payments and audit log views'`

---

## File map — what to create vs modify

### Modified files
| File | Change |
|------|--------|
| `src/lib/admin.ts` | Add `timeSeries`, `queue`, `verifyRequest`, `cancelRequest`, `verifyHospital`, `banUser`, `unbanUser`, `hospitals`, `users`, `payments`, `auditLog` to `adminApi` |
| `src/components/dashboard/nav-config.ts` | Add 4 ADMIN nav items |
| `src/app/dashboard/admin/page.tsx` | Add `timeSeries` fetch + `<AdminCharts>` below status card |
| `src/app/dashboard/admin/loading.tsx` | Add chart skeleton section |
| `src/app/actions/admin.ts` | Add `banUser`, `unbanUser` (initially created in step 3 with `verifyRequest`, `cancelRequest`, `verifyHospital`) |

### New files
| File | Type |
|------|------|
| `src/app/dashboard/admin/components/admin-charts.tsx` | `'use client'` component |
| `src/app/actions/admin.ts` | Server actions |
| `src/app/dashboard/admin/queue/page.tsx` | Async Server Component |
| `src/app/dashboard/admin/queue/loading.tsx` | Loading skeleton |
| `src/app/dashboard/admin/queue/components/queue-row.tsx` | `'use client'` component |
| `src/app/dashboard/admin/hospitals/page.tsx` | Async Server Component |
| `src/app/dashboard/admin/hospitals/loading.tsx` | Loading skeleton |
| `src/app/dashboard/admin/hospitals/components/hospital-row.tsx` | `'use client'` component |
| `src/app/dashboard/admin/users/page.tsx` | Async Server Component |
| `src/app/dashboard/admin/users/loading.tsx` | Loading skeleton |
| `src/app/dashboard/admin/users/components/user-row.tsx` | `'use client'` component |
| `src/app/dashboard/admin/payments/page.tsx` | Async Server Component |
| `src/app/dashboard/admin/payments/loading.tsx` | Loading skeleton |

---

## Potential TypeScript issues

1. **`Building2` / `Users` in nav-config.ts** — both icons are already imported (used by HOSPITAL and DONOR nav items). The `import { ..., Building2, ..., Users, ... }` line must not duplicate them. Only add `ClipboardCheck` and `CreditCard` to the import.
2. **`Hospital.user` optional** — typed as `{ id: string; email: string } | undefined`. Always use `hospital.user?.email` not `hospital.user.email`.
3. **`recharts` + `'use client'`** — `AdminCharts` must be a client component because `ResponsiveContainer` uses browser APIs. Importing it in the Server Component `page.tsx` is fine.
4. **`apiPaginated` return type** — the function returns `{ data: T; meta: PaginationMeta }`. For list endpoints, `T` should be `BloodRequest[]`, `Hospital[]`, etc. (array type, not `Paginated<T>`).
5. **`timeSeries.byBloodGroup`** — typed as `{ bloodGroup: BloodGroup; total: number; open: number }[]`. The `XAxis tickFormatter` receives a `string` — safe to cast as `string` for the replace calls.
6. **`PaymentPurpose` badge** — `PLATFORM_DONATION` and `EMERGENCY_FUND` are the two union members in `src/types/index.ts`. A `const purposeStyles: Record<PaymentPurpose, string>` object avoids a switch/ternary chain and gives TypeScript exhaustiveness checking.
