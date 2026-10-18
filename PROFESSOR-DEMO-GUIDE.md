# QueueLess — quick demo for the project evaluator

## What is the frontend, backend and database?
- **Frontend:** HTML, CSS and browser JavaScript in this folder (`index.html`, `student/`, `staff/`, `admin/`, `css/`, `js/`).
- **Backend:** Node.js + Express in `server.js`. It serves the frontend and exposes protected API routes.
- **Database:** Supabase PostgreSQL. The `ql_` tables store menu items, user profiles, orders, order items, counters and item-status events.
- **Authentication:** Supabase Auth handles email/password login, verification and password reset. The Express API receives the signed-in user's access token and uses it for the database request; it does not trust a role supplied by the browser.
- **Payments:** Demo-only. No real payment is processed.

## Start the app
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. In the terminal run `npm install`.
4. Copy `.env.example` to `.env`. Keep the project URL and publishable key; never add a service-role key to frontend files or commit it.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.
7. Verify the API at `http://localhost:3000/api/health` (it should show `ok: true` and `supabaseConfigured: true`).

## What to demonstrate
1. **Database:** Open Supabase Dashboard → Table Editor → `ql_menu_items`, `ql_profiles`, `ql_orders`, `ql_order_items`. Place a demo order and show the new `ql_orders` and `ql_order_items` rows.
2. **Checkout:** Sign in as a student, add a menu item, choose a pickup slot, choose Demo Payment, place the order. The student-facing token is `#<order number>`; UUIDs remain internal IDs only.
3. **Staff:** Sign in as an approved staff account. Show the order on the assigned counter and use Accept → Start Preparing → Mark Ready → Mark Collected. Status changes are written to Supabase.
4. **Admin:** Sign in as an admin and show live dashboard metrics, menu management and Staff Access. Approve a registered email and assign C1, C2, C3 or C4.
5. **Backend:** Show `server.js` and the `/api/orders`, `/api/order-items/:id/status`, `/api/admin/summary`, and `/api/health` routes. In browser DevTools → Network, show requests to `/api/...`.

## API routes
- `GET /api/health`
- `POST /api/orders`
- `PATCH /api/order-items/:id/status`
- `GET /api/admin/summary` (admin only)

## Notes
- Staff see items routed to their assigned counter; admins can view all counters.
- Customers see readable order numbers, not raw UUIDs.
- Analytics reflect actual Supabase rows. If the database has no orders yet, the dashboard should show zero/empty states rather than invented sample totals.
- `supabase/migrations/` documents the base schema. The connected Supabase project also has later checkout slot-validation, status-transition, and admin-summary RPC updates applied directly.
