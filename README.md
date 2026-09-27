# D's PANAI Storefront

Production site: https://www.dspanaitraditions.in

This is a TanStack Start application built with Vite and Nitro. It uses server-side rendering and server functions for order placement, tracking, and the owner dashboard.

## Local Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

Create `.env.local` with the public and server-only values listed below before testing the order flow.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Use `npm ci` for install and `npm run build` for the build command. Nitro emits Vercel's Build Output API bundle to `.vercel/output`.
3. Add these environment variables in Vercel for Preview and Production:
   - `VITE_APPS_SCRIPT_URL` for the browser-facing order and tracking requests
   - `APPS_SCRIPT_URL` for server-side admin calls if you use the dashboard server functions
   - `ADMIN_PASSWORD` only for the protected admin dashboard
   - `SESSION_SECRET` only for the dashboard session cookie
4. Verify a Vercel preview deployment before changing the production domain.
5. Add `www.dspanaitraditions.in` in Vercel's Domains settings and update DNS at the domain registrar using the records Vercel provides. Configure the apex domain to redirect to `www`.

Do not commit `.env.local` or paste private secrets into source files.

## Google Apps Script

The order backend is configured separately from Vercel. Deploy the Apps Script Web App and set its public `/exec` URL as `VITE_APPS_SCRIPT_URL` in Vercel. Customer order creation and tracking work without `APPS_SCRIPT_TOKEN`. Only admin status updates should be protected with `ADMIN_PASSWORD` in the Apps Script project settings or the server-side dashboard flow.
