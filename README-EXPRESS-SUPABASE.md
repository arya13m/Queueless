# QueueLess — Node.js + Express + Supabase (demo)

This project has a Node.js/Express server and API routes, Supabase Auth, and Supabase PostgreSQL tables for menu items, orders, order items, profiles and counter routing. Checkout uses demo payment only; no real payment is collected.

## Run it
1. Install Node.js LTS.
2. Extract this project and open the extracted folder in VS Code.
3. In the terminal, run `npm install`.
4. Copy `.env.example` to `.env`. The public Supabase URL and publishable key are safe to use here; do not put a service-role/secret key in `.env` for this demo.
5. Run `npm run dev` (or `npm start`).
6. Open `http://localhost:3000`.
7. Check `http://localhost:3000/api/health`; it should return `ok: true` and `supabaseConfigured: true`.

## API routes to show your professor
- `GET /api/health` — Express backend health/configuration check.
- `POST /api/orders` — creates an order by calling the `ql_create_order` PostgreSQL RPC with the signed-in user's Supabase access token.
- `PATCH /api/order-items/:id/status` — advances an item status through the protected `ql_update_item_status` RPC.
- `GET /api/admin/summary` — returns live admin metrics through a role-protected PostgreSQL RPC.

API routes require `Authorization: Bearer <Supabase access token>`. The server uses the publishable key plus the user's token, so PostgreSQL RLS and role checks still apply. Do not expose a service-role key to the browser or commit `.env`.

## Database and authentication
The live database is Supabase PostgreSQL. Supabase Auth handles registration, email verification, sign-in and password reset. QueueLess-specific tables are prefixed `ql_`; legacy SkipQ tables are not renamed or deleted. `supabase/migrations/` and `supabase/seed.sql` are included as project documentation/migration assets. The existing connected project already has the QueueLess schema and the checkout/status/admin-summary RPC updates applied.

## Order numbers vs UUIDs
Customer-facing UI should show `#<order number>` (for example `#1001`). UUIDs remain internal IDs for database relationships and API addressing. Demo-payment totals are order values only, not actual collected revenue.

## Admin dashboard data
The admin dashboard no longer adds invented baseline order/revenue numbers. It displays data returned from the protected Supabase admin summary RPC. If there are no real orders, it should show zero/empty states rather than fake counts.
