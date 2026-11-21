# LucidInvest

LucidInvest is a Next.js application deployed on Vercel with Neon PostgreSQL.

## Authentication

- Registration: `POST /api/auth/register` and page `/register`.
- Login: `POST /api/auth/login` and page `/login`.
- Current session: `GET /api/auth/session`.
- Logout: `POST /api/auth/logout`.
- Customer landing page: `/dashboard` (requires a valid session).

Authentication uses Node.js scrypt password hashes and an HttpOnly, SameSite=Lax, signed session cookie backed by the `auth_sessions` table. Set `DATABASE_URL` and a unique `AUTH_SECRET` (at least 32 characters) in Vercel; never commit either secret. Before enabling auth, review and apply `migrations/0002_authentication.sql` after backing up and inspecting the existing Neon schema. The migration is additive and preserves existing records. Existing accounts without a password hash need a verified password-reset/onboarding process before they can use password login.

## Admin console

`/admin` is a read-only operations view for staff (overview, customers, accounts and contact enquiries). It is gated to the `admin` role: signed-out visits are redirected to `/login` by middleware and signed-in non-admins are redirected to `/dashboard` by the admin layout. Customers with the admin role also get an "Admin console" link in the dashboard sidebar.

Promote a reviewed account after verifying it in the database:

```sql
UPDATE app_users SET role = 'admin' WHERE email = 'someone@example.com';
```

There is no self-service route to become an admin, and the console exposes no money-movement actions.

## Neon PostgreSQL

The server-side database integration uses Neon’s serverless PostgreSQL driver. Browser code must never connect directly to Neon.

- Connection health: `GET /api/health`
- Contact submissions are persisted in `contact_enquiries` once the initial migration is applied.
- No deposits, withdrawals, trading, or real-money operations are enabled by these auth routes.
- Do not commit credentials or seed fake customer balances.

## Local development

```sh
npm install
cp .env.example .env.local
npm run dev
```
