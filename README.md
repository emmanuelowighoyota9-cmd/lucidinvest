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

`/admin` is a read-only operations view for staff (overview, customers, accounts and contact enquiries). It is gated to the `admin` role: signed-out visits are redirected to `/login` by middleware and signed-in non-admins are redirected to `/dashboard`. Customers with the admin role also get an "Admin console" link in the dashboard sidebar.

### First-time admin setup

1. Add an `ADMIN_SETUP_KEY` secret in Vercel: at least 16 characters, unique to this deployment. Never commit it.
2. Register or sign in with the account that should own the console.
3. Visit `/admin/setup`, enter the setup key and that account's password.

Setup only runs while no admin exists. Once one does, the page explains that setup is complete and `POST /api/admin/setup` answers 409. The promotion is a single conditional `UPDATE`, so two simultaneous claims cannot both succeed, and it is recorded in `audit_events` as `admin.bootstrap`. Without `ADMIN_SETUP_KEY` the page stays locked, so the console cannot be claimed by whoever registers first.

Further admins are promoted by an existing admin after review, directly in the database:

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

### Customer accounts, investments and transactions

- `POST /api/account/accounts` opens an account for the signed-in customer from a type and currency, issues a random unique account number and stores it as `pending` for review.
- `POST /api/account/investments` records an investment request against one of that customer's accounts, validated against the published catalogue in `investment_products` (active product, matching currency, product minimum, at most two decimal places).
- `/dashboard/accounts`, `/dashboard/investments` and `/dashboard/transactions` are rendered from Neon: accounts, positions, submitted requests still in review, and posted ledger entries.
- Both write routes reject requests whose `Origin`/`Referer` host does not match the deployment host (403), on top of the HttpOnly `SameSite=Lax` session cookie.
- The overview's portfolio principal counts only `active` positions and its hint shows how many requests are still pending review.
- These requests write `customer_accounts`, `investments` and `audit_events` rows only. They never post a ledger entry, set a balance or move money in either direction. One open account per type and currency is allowed (up to ten), and a customer can hold at most ten pending investment requests.
- `migrations/0003_investment_catalogue.sql` publishes the starting product catalogue. It creates no customer records, balances or ledger entries; review the product names, currencies and minimums before applying it.

### Password recovery and security

- `POST /api/auth/forgot-password` issues a single-use token when the address belongs to an active account and always answers with the same message. Only the SHA-256 digest of the token is stored (`password_reset_tokens`), it expires after one hour and earlier unused links are closed out.
- `POST /api/auth/reset-password` consumes the token once, stores a new scrypt hash and revokes every existing session for the account in one statement.
- `/forgot-password` and `/reset-password?token=…` are the customer-facing pages; the sign-in form links to them.
- `POST /api/auth/change-password` verifies the current password, stores the new one and signs out every other session. `/dashboard/security` hosts the form.
- No mail provider is configured in this repository. Without one, the reset link has to be delivered by your support process: set `RESET_LINK_LOG=1` on a controlled environment to print the link to the server log, and never enable it in a shared production log.

### Customer cancellations

`POST /api/account/investments/:id/cancel` withdraws the signed-in customer's own `pending` request (ownership and the pending status are part of the update). The request moves to `cancelled` and an audit row is written; a request that has already been reviewed cannot be cancelled.

## Admin operations

The console at `/admin` is gated by `requireAdmin()` in the layout and again in every route handler, and all writes require a same-origin request and write an `audit_events` row:

- `PATCH /api/admin/customers/:id` sets `active`, `suspended` or `closed` on a customer record (never on staff accounts or your own account).
- `PATCH /api/admin/accounts/:id` approves a `pending` account (`active`) or rejects it (`closed`).
- `PATCH /api/admin/investments/:id` approves (`active`) or rejects (`rejected`) a pending request. Approval flips the status, posts one `ledger_transactions` row and its `ledger_entries` entry, and writes the audit event in a single SQL statement, so a double approval cannot post twice.
- `PATCH /api/admin/enquiries/:id` moves an enquiry through `new → reviewing → resolved` (or `spam`).

There are still no deposits, withdrawals, trades, balance edits or reversals anywhere in the application.

## Content pages and articles

- `/index-3` renders the `home3` section suite and `/index-4` the `home4` suite, each with its own header and footer style; `/` remains the default landing page.
- Every article lives in `lib/blog.ts`. The four listing pages and the `/blog-N/[slug]` detail routes read from it, detail routes emit their own metadata and unknown slugs are a real 404 (`dynamicParams = false`). `/blog-single` is a 307 redirect to `/blog-1`.
- `components/elements/ContactForm.tsx` sends name, email, phone, subject and message to `POST /api/contact`, which validates all five and stores them in `contact_enquiries` (`phone` added by `migrations/0005_contact_phone.sql`).
- The newsletter form on `/coming-soon` stores enquiries with `subject: 'Coming Soon Notification'`.

## Local development

```sh
npm install
cp .env.example .env.local
npm run dev
```
