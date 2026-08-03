# API Integration

This document maps every frontend component/page to the backend endpoints it consumes.

## How integration works

Components never call the backend directly. The request flow is:

```
Component/page → hook (hooks/*.ts) → apiFetch (lib/api.ts) → /api proxy (app/api/[...path]/route.ts) → backend (NEXT_PUBLIC_API_URL)
```

- `apiFetch` in `lib/api.ts` is a thin wrapper around `fetch`. On a `401`/auth error it calls `POST /api/auth/refresh-token` once and retries the original request.
- The catch-all proxy `app/api/[...path]/route.ts` forwards every `/api/<path>` request to `NEXT_PUBLIC_API_URL`, attaching `Authorization: Bearer <accessToken>` and the `refreshToken` cookie, and persists any new tokens returned by the backend.
- Server-side code (`service/getMe.ts`, `service/refreshToken.ts`) talks to `BACKEND_API_URL` directly.
- All responses use the envelope `{ success, statusCode, message, data, meta }`.
- `GET /gear` supports query params: `searchTerm, categoryId, brand, minPrice, maxPrice, sortBy, sortOrder, page, limit` (built via `buildQueryString`, `lib/api.ts`), with pagination info in `meta` (`IApiMeta`).

## Endpoint map

### Auth

| Method | Endpoint | Frontend hook | Consuming component |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | `app/(authGroup)/_components/register-form.tsx` |
| POST | `/auth/login` | — | `app/(authGroup)/_components/login-form.tsx` |
| GET | `/auth/me` | — | `app/providers/AuthProvider.tsx` (`service/getMe.ts` server-side) |
| POST | `/auth/logout` | — | `app/api/auth/logout/route.ts` (local route, clears cookies) |
| POST | `/auth/refresh-token` | — | `lib/api.ts` (auto-refresh), `service/refreshToken.ts` |

### Public gear browsing

| Method | Endpoint | Frontend hook | Consuming component |
| --- | --- | --- | --- |
| GET | `/gear` | `useGearItems` (`hooks/use-gear.ts`) | `app/(publicGroup)/gear/page.tsx`, `app/(publicGroup)/page.tsx` (featured) |
| GET | `/gear/:id` | `useGearItem` (`hooks/use-gear.ts`) | `app/(publicGroup)/gear/[id]/page.tsx`, `app/(dashboardGroup)/dashboard/provider/gear/[id]/edit/page.tsx` |
| GET | `/categories` | `useCategories` (`hooks/use-gear.ts`) | `gear/page.tsx`, `page.tsx`, `gear-form.tsx` |

### Customer

| Method | Endpoint | Frontend hook | Consuming component |
| --- | --- | --- | --- |
| POST | `/rentals` | `useCreateRental` (`hooks/use-customer.ts`) | `app/(publicGroup)/gear/[id]/page.tsx` (RentNowPanel) |
| GET | `/rentals` | `useMyRentals` (`hooks/use-customer.ts`) | `app/(dashboardGroup)/dashboard/customer/page.tsx` |
| GET | `/rentals/:id` | `useRentalById` (`hooks/use-customer.ts`) | `app/(dashboardGroup)/dashboard/customer/orders/[id]/pay/page.tsx` |
| GET | `/payments` | `useMyPayments` (`hooks/use-customer.ts`) | `dashboard/customer/page.tsx` |
| POST | `/payments/create` | `useCreatePaymentIntent` (`hooks/use-customer.ts`) | `dashboard/customer/orders/[id]/pay/page.tsx` |
| POST | `/payments/confirm` | `useConfirmPayment` (`hooks/use-customer.ts`) | `dashboard/customer/orders/[id]/pay/page.tsx` (Stripe) |
| POST | `/reviews` | `useCreateReview` (`hooks/use-customer.ts`) | `app/(dashboardGroup)/_components/review-modal.tsx` |

### Provider

| Method | Endpoint | Frontend hook | Consuming component |
| --- | --- | --- | --- |
| GET | `/provider/gear` | `useProviderGear` (`hooks/use-provider.ts`) | `dashboard/provider/page.tsx` |
| POST | `/provider/gear` | `useAddGear` (`hooks/use-provider.ts`) | `app/(dashboardGroup)/_components/gear-form.tsx` (new page) |
| PUT | `/provider/gear/:id` | `useUpdateGear` (`hooks/use-provider.ts`) | `gear-form.tsx` (edit page) |
| DELETE | `/provider/gear/:id` | `useDeleteGear` (`hooks/use-provider.ts`) | `dashboard/provider/page.tsx` |
| GET | `/provider/orders` | `useProviderOrders` (`hooks/use-provider.ts`) | `dashboard/provider/page.tsx`, `dashboard/provider/orders/page.tsx` |
| PATCH | `/provider/orders/:id` | `useUpdateOrderStatus` (`hooks/use-provider.ts`) | `dashboard/provider/orders/page.tsx` |
| POST | `/categories` | `useCreateCategory` (`hooks/use-provider.ts`) | `gear-form.tsx` |

### Admin

| Method | Endpoint | Frontend hook | Consuming component |
| --- | --- | --- | --- |
| GET | `/admin/users` | `useAdminUsers` (`hooks/use-admin.ts`) | `dashboard/admin/page.tsx`, `dashboard/admin/users/page.tsx` |
| PATCH | `/admin/users/:id` | `useUpdateUserStatus` (`hooks/use-admin.ts`) | `dashboard/admin/users/page.tsx` |
| GET | `/admin/gear` | `useAdminGear` (`hooks/use-admin.ts`) | `dashboard/admin/page.tsx`, `dashboard/admin/gear/page.tsx` |
| GET | `/admin/rentals` | `useAdminRentals` (`hooks/use-admin.ts`) | `dashboard/admin/page.tsx`, `dashboard/admin/rentals/page.tsx` |

## Notes

- All `/api/*` paths in the table are proxied by `app/api/[...path]/route.ts`; the frontend calls them relative (`/rentals`, `/gear`, etc.).
- Endpoints under `/provider/*` and `/admin/*` are restricted to the matching role; the middleware (`proxy.ts`) enforces this at the page level.
- TanStack Query owns server state: queries are cached under keys like `["gear"]`, `["rentals"]`, `["provider","orders"]`, `["admin","users"]` and invalidated after mutations (see `onSuccess` handlers in each hook file).
- Forms are validated with zod (`lib/validations.ts`) before any request is sent.
