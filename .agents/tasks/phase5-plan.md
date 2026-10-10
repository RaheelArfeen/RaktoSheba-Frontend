# Phase 5 — Hospital Dashboard Implementation Plan

> **Project**: RaktoSheba-Frontend (Next.js 16 / App Router, TypeScript, Tailwind 4, Zod 4, React Hook Form, Sonner toasts)
> **Branch**: work from the current checked-out branch; commit locally after each commit-block; never push.
> **Build command**: `npm run build` (Next.js build)
> **Lint command**: `npm run lint`
> **No test framework** — verification is `npm run build` passing without TS errors + `npm run lint` clean.

---

## Dependency map

Commit 21 must land first (it adds the API layer and nav config that later commits use).
Commit 22 depends on 21 (creates a request, redirects to the detail page).
Commit 23 depends on 21+22 (reads the request the wizard created, adds "mark fulfilled").
Commit 24 is independent of 22+23 but must follow 21 (hospital API already exists).

---

## Commit 21 — Hospital dashboard overview + request list with URL-based filters

### What this commit adds

A real hospital dashboard page (replacing the placeholder) with stat cards, a paginated
request list that mirrors the public `/requests` board, and a dedicated requests sub-page.
Every filter lives in the URL so views are bookmarkable, exactly like the public board.

### Files to create or modify

| File | Status | Purpose |
|------|--------|---------|
| `src/lib/hospitals.ts` | **modify** | Add `hospitalRequestApi` — authenticated endpoints: `myRequests(token, query)`, `requestById(token, id)`, `createRequest(token, body)`, `fulfillRequest(token, requestId)` |
| `src/lib/validations.ts` | **modify** | Add `bloodRequestSchema` and `requestSteps` for the wizard (step fields) |
| `src/types/index.ts` | **modify** | No type changes needed — `BloodRequest`, `BloodRequestDetail`, `CreateBloodRequestInput`, `RequestBoardQuery` already exist |
| `src/components/dashboard/nav-config.ts` | **modify** | Add hospital nav items: Requests (`/dashboard/hospital/requests`), New request (`/dashboard/hospital/requests/new`), Profile (`/dashboard/hospital/profile`) |
| `src/app/dashboard/hospital/page.tsx` | **modify** | Replace placeholder "coming soon" card with real stat cards (total requests, open, fulfilled) and a preview list of the 5 most recent requests, linking to the full requests page |
| `src/app/dashboard/hospital/requests/page.tsx` | **create** | Server component — reads URL params via `parseBoardParams`, calls `hospitalRequestApi.myRequests`, renders `<HospitalFilters />` + paginated `<RequestCard />` list |
| `src/app/dashboard/hospital/requests/loading.tsx` | **create** | Skeleton: `<RequestCardSkeleton>` ×5 |
| `src/app/dashboard/hospital/requests/components/hospital-filters.tsx` | **create** | Client component — like `src/components/request/filters.tsx` but scoped to hospital's own requests; status tabs (Pending/Open/Matched/Fulfilled/All) + search field, all kept in URL |

### Key constraints

- Use `hospitalRequestApi.myRequests` with a `token` parameter (same pattern as `hospitalApi.me`).
- `parseBoardParams` from `src/lib/requests.ts` can be reused as-is for parsing URL params.
- `RequestCard` from `src/components/request/request-card.tsx` must be reused as-is (it already handles all statuses).
- Stat cards follow the exact card pattern in `donor/page.tsx`: `rounded-[24px] border border-ink/10 bg-cream p-6`.
- Nav additions: `{ href: "/dashboard/hospital/requests", label: "Requests", icon: Droplets }`, `{ href: "/dashboard/hospital/requests/new", label: "New request", icon: Plus }`, `{ href: "/dashboard/hospital/profile", label: "Hospital profile", icon: Building2 }` — import icons from `lucide-react`.

### Verify

```
npm run build && npm run lint
```
Both pass with zero errors. The build output must include `dashboard/hospital/requests`.

---

## Commit 22 — New request wizard (multi-step form)

### What this commit adds

A 4-step wizard at `/dashboard/hospital/requests/new` that collects blood group → urgency
and units → location → review, then posts to the backend and redirects to the new request's
detail page. Mirrors the `SummaryWizard` and `RegisterForm` multi-step patterns exactly.

### Files to create or modify

| File | Status | Purpose |
|------|--------|---------|
| `src/lib/validations.ts` | **modify** | Add `bloodRequestWizardSchema` (zod, for all 4 steps) and `requestWizardSteps` array of step-field tuples |
| `src/app/actions/hospital.ts` | **create** | Server Actions: `createBloodRequest(values)` — validates, calls `hospitalRequestApi.createRequest`, revalidates `/dashboard/hospital/requests`, returns `{ ok: true; id: string }` or `{ error: string }` |
| `src/app/dashboard/hospital/requests/new/page.tsx` | **create** | Thin server page that renders `<NewRequestWizard />` |
| `src/app/dashboard/hospital/requests/new/loading.tsx` | **create** | `<FormSkeleton fields={4} />` |
| `src/app/dashboard/hospital/requests/new/new-request-wizard.tsx` | **create** | `"use client"` — 4-step wizard using `useForm`/`zodResolver`, `useWatch`, step progress bar; Step 1: blood group picker (8 buttons); Step 2: urgency radio cards (Critical/Severe/Urgent/Standard) + units slider (1-10); Step 3: location text input + optional coords via `navigator.geolocation`; Step 4: read-only review card; submits via `createBloodRequest` action, on success `router.push(`/dashboard/hospital/requests/${id}`)` |

### Key constraints

- Wizard step pattern: use the exact `SummaryWizard` and `RegisterForm` structure — progress bar `h-1.5 flex-1 rounded-full`, step counter, `trigger(stepFields)` before advancing.
- Blood group picker: 8-button grid exactly as in `ProfileForm` and `RegisterForm`.
- Urgency step: 4 card buttons (Critical=5, Severe=4, Urgent=3, Standard=1) styled like the `urgency` options in `SummaryWizard`.
- Units: `<input type="range" min={1} max={10} className="accent-blood">` with live display.
- Location step: reuse the geolocation pattern from `ProfileForm` (`LocateFixed` icon, rounded to 3 decimal places).
- Server action follows `donor.ts` pattern: `"use server"`, `getSession()`, role check (`role !== "HOSPITAL"` → `redirect`), `api(...)` call, `revalidatePath`, return `{ ok: true; id }` or `{ error }`.
- `bloodRequestWizardSchema` fields: `bloodGroup` (enum), `urgency` (coerce int 1-5), `units` (coerce int 1-10), `location` (string, 3-120 chars), `lat?` (number | null), `lng?` (number | null).

### Verify

```
npm run build && npm run lint
```
Both pass. Build includes `dashboard/hospital/requests/new`.

---

## Commit 23 — Request detail page with matched donors and "mark fulfilled"

### What this commit adds

An authenticated hospital detail page at `/dashboard/hospital/requests/[id]` that shows:
the status timeline (reusing `StatusTimeline`), matched donor card (if status is MATCHED),
request facts (blood group, units, urgency, location, created date), and a "Mark fulfilled"
button that calls the backend and moves the request to FULFILLED status.

### Files to create or modify

| File | Status | Purpose |
|------|--------|---------|
| `src/lib/hospitals.ts` | **modify** | Add `hospitalRequestApi.requestById(token, id)` returning `BloodRequestDetail` from `GET /hospitals/me/requests/:id` |
| `src/app/actions/hospital.ts` | **modify** | Add `fulfillRequest(requestId)` Server Action — calls `hospitalRequestApi.fulfillRequest`, revalidates the detail path and the requests list, returns `ActionResult` |
| `src/app/dashboard/hospital/requests/[id]/page.tsx` | **create** | Server component — fetches `hospitalRequestApi.requestById(token, id)`, renders status timeline sidebar + donor card + facts + `<FulfillButton>` |
| `src/app/dashboard/hospital/requests/[id]/loading.tsx` | **create** | Two-column skeleton: `<Skeleton className="h-40 rounded-[26px]" />` + `<Skeleton className="h-60 rounded-[26px]" />` |
| `src/app/dashboard/hospital/requests/[id]/not-found.tsx` | **create** | "Request not found" with back link to `/dashboard/hospital/requests` |
| `src/app/dashboard/hospital/requests/[id]/fulfill-button.tsx` | **create** | `"use client"` — button that opens `<ConfirmDialog>` ("Mark this request fulfilled?"), on confirm calls `fulfillRequest`, shows toast, disabled when status !== MATCHED |

### Key constraints

- The hospital-side detail page uses `BloodRequestDetail` (from `src/types/index.ts`) which includes `donation.donor` for showing the matched donor's blood group and email.
- `StatusTimeline` expects a `PublicRequestDetail` shape; adapt by mapping `BloodRequestDetail` to the same shape before passing (both have `status`, `createdAt`, `donation.scheduledAt/completedAt`).
- `ConfirmDialog` is already implemented at `src/components/ui/confirm-dialog.tsx` — use it directly.
- "Mark fulfilled" should only render when `request.status === "MATCHED"`.
- Donor card (when status is MATCHED): show blood group badge (`EmergencyBadge`), email, `distanceKm` if available — follow the `ActiveDonationCard` pattern from `donor/components/active-donation-card.tsx`.
- Revalidation: `revalidatePath("/dashboard/hospital/requests", "layout")`.

### Verify

```
npm run build && npm run lint
```
Both pass. Build includes `dashboard/hospital/requests/[id]`.

---

## Commit 24 — Hospital profile editor and licence upload

### What this commit adds

A profile page at `/dashboard/hospital/profile` that lets the hospital edit its name and
address, and upload a licence document (PDF or image). Mirrors the donor
`profile/page.tsx` + `profile-form.tsx` + `photo-upload.tsx` pattern precisely.

### Files to create or modify

| File | Status | Purpose |
|------|--------|---------|
| `src/lib/hospitals.ts` | **modify** | Add `hospitalApi.updateProfile(token, body)` → `PATCH /hospitals/me` and `hospitalApi.uploadLicence(token, formData)` → `POST /hospitals/me/licence` (multipart, same raw-fetch pattern as `uploadDonorPhoto`) |
| `src/lib/validations.ts` | **modify** | Add `hospitalEditSchema` — `{ hospitalName: string (2-120), hospitalAddress: string (5-200) }` matching the existing `hospitalProfileSchema` fields |
| `src/app/actions/hospital.ts` | **modify** | Add `updateHospitalProfile(values)` and `uploadLicenceDoc(formData)` Server Actions — same guard/revalidate/return pattern as `donor.ts` |
| `src/app/dashboard/hospital/profile/page.tsx` | **create** | Server component — fetches `hospitalApi.me(token)`, renders `<LicenceUpload>` + `<HospitalProfileForm>` |
| `src/app/dashboard/hospital/profile/loading.tsx` | **create** | `<FormSkeleton fields={2} />` |
| `src/app/dashboard/hospital/profile/hospital-profile-form.tsx` | **create** | `"use client"` — `useForm` with `zodResolver(hospitalEditSchema)`; two `<Input>` fields (name, address); save button pattern from `ProfileForm` (disabled when not dirty, spinner when pending) |
| `src/app/dashboard/hospital/profile/licence-upload.tsx` | **create** | `"use client"` — file picker accepting `image/*,application/pdf`; preview filename + size; upload via `uploadLicenceDoc`; shows current licence status (uploaded/none) pulled from the `hospital` prop; mirrors `PhotoUpload` component structure |

### Key constraints

- `hospitalEditSchema` should be added to `validations.ts` and export `HospitalEditValues`.
- Licence upload: allowed MIME types `["image/jpeg", "image/png", "image/webp", "application/pdf"]`, max 5 MB. Show existing `licenseDocUrl` as a link ("View current licence") when not null.
- `uploadLicenceDoc` uses raw `fetch` (same as `uploadDonorPhoto`) because multipart bypasses the JSON helper.
- After any save, call `revalidatePath("/dashboard/hospital", "layout")`.
- Verification status banner: if `hospital.verified` show green "Verified" pill; else amber "Pending verification".

### Verify

```
npm run build && npm run lint
```
Both pass. Build includes `dashboard/hospital/profile`.

---

## Summary of all files touched

### New files (create)

```
src/app/actions/hospital.ts
src/app/dashboard/hospital/requests/page.tsx
src/app/dashboard/hospital/requests/loading.tsx
src/app/dashboard/hospital/requests/components/hospital-filters.tsx
src/app/dashboard/hospital/requests/new/page.tsx
src/app/dashboard/hospital/requests/new/loading.tsx
src/app/dashboard/hospital/requests/new/new-request-wizard.tsx
src/app/dashboard/hospital/requests/[id]/page.tsx
src/app/dashboard/hospital/requests/[id]/loading.tsx
src/app/dashboard/hospital/requests/[id]/not-found.tsx
src/app/dashboard/hospital/requests/[id]/fulfill-button.tsx
src/app/dashboard/hospital/profile/page.tsx
src/app/dashboard/hospital/profile/loading.tsx
src/app/dashboard/hospital/profile/hospital-profile-form.tsx
src/app/dashboard/hospital/profile/licence-upload.tsx
```

### Modified files (edit)

```
src/lib/hospitals.ts           — add hospitalRequestApi methods + updateProfile + uploadLicence
src/lib/validations.ts         — add bloodRequestWizardSchema, requestWizardSteps, hospitalEditSchema
src/components/dashboard/nav-config.ts  — add hospital nav items
src/app/dashboard/hospital/page.tsx     — replace placeholder card with real stats + preview list
src/app/actions/hospital.ts    — add fulfillRequest, updateHospitalProfile, uploadLicenceDoc (iterative)
```

---

## Cross-cutting conventions (must follow in every file)

- All Server Components: `async function Page()`, call `(await getSession())!`, never `use client`.
- All client components: `"use client"` at top, use `useTransition` + `startTransition` for server actions.
- Toast: `import { toast } from "sonner"` — `toast.error(result.error)` on failure, `toast.success(...)` on success.
- Border radius tokens: cards use `rounded-[24px]`, forms use `rounded-[26px]`, dialogs `rounded-[26px]`.
- Color tokens used in this codebase: `bg-cream`, `bg-linen`, `bg-blush`, `bg-mint`, `bg-sand`, `text-blood`, `text-forest`, `text-sand-deep`, `text-ink-muted`, `text-ink-faint`, `border-ink/10`.
- Loading files: always named `loading.tsx`, export default a function named `Loading`.
- No test files — the project has no test framework; verification is TypeScript compile + lint passing.
