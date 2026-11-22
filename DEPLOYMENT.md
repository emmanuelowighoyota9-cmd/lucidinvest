# Deployment and Neon PostgreSQL

LucidInvest remains a Next.js application on Vercel. Neon PostgreSQL is the persistent database. Browser code must never connect directly to Neon.

## 1. Configure Neon

1. In Neon, inspect the existing database and take a verified backup/export before schema changes.
2. In Vercel → Project → Settings → Environment Variables, configure `DATABASE_URL` for the intended environments. Use the pooled PostgreSQL connection string with SSL.
3. Generate a unique authentication secret locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"` and set it as `AUTH_SECRET` in Vercel. Use at least 32 characters. Do not reuse database credentials or commit either secret.
4. Redeploy after setting environment variables.

## 2. Apply schema migrations safely

The initial schema `migrations/0001_initial.sql` was designed for a new or explicitly verified empty database. Do not run it against a production database without first reviewing its schema/data and verifying a backup.

The authentication migration `migrations/0002_authentication.sql` is additive: it adds nullable password hashes and a session table. Review it and apply it to the intended Neon database after a verified backup. Existing user records are preserved. Existing users without a password hash cannot sign in with a password until a separately verified reset/onboarding process is provided.

The password reset migration `migrations/0004_password_resets.sql` adds the `password_reset_tokens` table (digest only, one-hour expiry, single use). The contact migration `migrations/0005_contact_phone.sql` adds a nullable `phone` column to `contact_enquiries`. Both are additive and touch no existing rows.

The catalogue migration `migrations/0003_investment_catalogue.sql` is additive as well: it publishes five active investment products and touches no customer, account, ledger or balance data. Review the product names, currencies and minimums against the approved offering before applying it. Without active products the investment form stays disabled and the dashboard explains that no products are published.

## 3. Authentication routes

- `/register`: customer registration.
- `/login`: customer login.
- `/dashboard`: server-side session-protected landing page.
- `POST /api/auth/logout`: revokes the current database session and clears the HttpOnly cookie.
- `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`: single-use recovery tokens; `/forgot-password` and `/reset-password` render the forms.
- `POST /api/auth/change-password`: verifies the current password and revokes other sessions.
- `GET /api/auth/session`: returns the current user without exposing credentials.

Reset links have to be delivered by email, and this repository does not include a mail provider. Until one is configured, delivery is a manual support step: `RESET_LINK_LOG=1` prints the link to the server log on a controlled environment only. Set it only where the operator is the intended recipient, and never in shared production logs.

Passwords are hashed with Node.js scrypt. Session tokens are random, stored as SHA-256 digests in the database, and delivered in signed HttpOnly cookies. Cookie transport is Secure in production and SameSite=Lax. Authentication still requires a production security review, including rate limiting/abuse controls, reset-email delivery through a transactional provider, email verification policy, and end-to-end tests against the deployed environment. The state-changing account and investment endpoints check that the request's `Origin` (or `Referer`) host matches the deployment host and answer 403 otherwise, in addition to the HttpOnly `SameSite=Lax` session cookie. Do not claim these features are complete unless they are implemented and verified.

## 4. Production verification checklist

1. Confirm `DATABASE_URL` and `AUTH_SECRET` are set for the correct Vercel environment without printing their values.
2. Confirm the migration is applied to the intended Neon database.
3. Test valid registration, duplicate email, invalid input, valid login, invalid login, session persistence, logout, and unauthenticated dashboard redirect.
4. Test opening an account and submitting an investment request on `/dashboard/accounts` and `/dashboard/investments`: the account number appears in the accounts table, the request appears as pending in `/dashboard/transactions`, a second account of the same type and currency is refused, and no ledger entry or balance is created.
5. Verify existing records remain intact and that no real-money functionality is exposed by these changes.
6. Test password recovery end to end: request a link, confirm the token is stored hashed and expires in an hour, reset the password, confirm every earlier session is signed out and the token cannot be reused. Test the change-password form on `/dashboard/security` with a wrong and a correct current password.
7. Test the admin console with a staff account: approve an account, approve an investment request and confirm exactly one posted `ledger_transactions` row plus its `ledger_entries` entry and the audit row, reject another request and confirm no ledger row, then move an enquiry through review. Confirm a customer session gets 403 from the same endpoints.
8. Review deployment build and runtime logs for errors; never include secrets in diagnostic output.
