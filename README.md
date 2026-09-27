# D's PANAI Storefront

Production site: https://www.dspanaitraditions.in

This is a TanStack Start application built with Vite and Nitro. It uses server-side rendering and server functions for order placement, tracking, and the owner dashboard.

## Local Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

Create `.env.local` with the server-only values listed below before testing order functions.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Use `npm ci` for install and `npm run build` for the build command. Nitro emits Vercel's Build Output API bundle to `.vercel/output`.
3. Add these server environment variables in Vercel for Preview and Production:
	- `APPS_SCRIPT_URL`
	- `APPS_SCRIPT_TOKEN`
	- `ADMIN_PASSWORD`
	- `SESSION_SECRET`
4. Verify a Vercel preview deployment before changing the production domain.
5. Add `www.dspanaitraditions.in` in Vercel's Domains settings and update DNS at the domain registrar using the records Vercel provides. Configure the apex domain to redirect to `www`.

Do not commit `.env.local` or paste secret values into source files.

## Google Apps Script

The order backend is configured separately from Vercel. Follow [the Apps Script setup guide](apps-script/SETUP.md) and set matching `APPS_SCRIPT_TOKEN` values in Apps Script Script Properties and Vercel.
