# PivotOps — Amazon Seller Intelligence

A polished, responsive Amazon seller dashboard for US and UK marketplaces. This delivery is a **demo-data static frontend** designed to be easy to deploy on shared hosting today and easy to connect to a secure server-side Amazon SP-API integration later.

## Included in this demo

- Demo admin login screen
- US and UK marketplace switcher
- Overview command center with sales, net profit, TACoS, TROAS, chart, top sellers and stock alerts
- Inventory table with product variations, SKU, ASIN, price, FBA/Amazon fee, editable supplier cost, stock health, low-stock and out-of-stock states
- Business reports with today / 7 day / 30 day / custom date range filtering
- User-entered ad spend and additional costs
- Profit/loss and net profit/loss calculation
- Previous-period comparison for the same number of days
- Product performance table
- Excel-compatible CSV export
- Settings screen showing the future SP-API connection map
- Responsive design for desktop, tablet and mobile

## Demo credentials

- Username: `admin`
- Password: `amazon123`

The demo login is intentionally client-side because this version is built for static shared hosting. Do not use it as production authentication. For a live application, add server-side sessions, password hashing, CSRF protection, rate limiting and a database-backed user table.

## Run locally

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

The Vite build is emitted under `dist/public`. The package also includes the development source so it can be extended later.

## Important production architecture note

Amazon SP-API credentials, refresh tokens and client secrets must **never** be placed in this browser-only frontend. The intended next phase is:

1. Add a secure server-side adapter, ideally using PHP/Laravel or Node/PHP-compatible hosting depending on the final Namecheap plan.
2. Store encrypted Amazon credentials and user data in MySQL.
3. Implement Amazon Login with Amazon / OAuth authorization.
4. Fetch Catalog Items, FBA inventory, Orders and fees through the adapter.
5. Normalize live records into the same product and sales shapes used by the dashboard.
6. Persist user-entered supplier costs, ad spend and additional costs by marketplace and date.
7. Schedule a safe sync process and retain a daily snapshot so historical reports do not change unexpectedly.

The demo's local provider and UI data shapes are intentionally centralized in `client/src/pages/Home.tsx` so the live provider can replace them without redesigning the dashboard.

## Namecheap shared hosting upload

This demo can be uploaded as a static site after building:

1. On your computer, run `pnpm install` and `pnpm build`.
2. Open the generated `dist/public` folder.
3. Upload everything inside `dist/public` into `public_html` in Namecheap cPanel File Manager, or upload a ZIP and extract it there.
4. If your hosting uses Apache and client-side routes are enabled later, add an `.htaccess` rewrite rule that sends unknown paths to `index.html`.
5. Open your domain and test the login, marketplace switcher, inventory, date filters and export button.

For this demo the main route is `/`, so the static root is sufficient. Live SP-API integration cannot be safely hosted by only uploading this static build; it needs a server-side runtime and secrets.

## GitHub upload

From the project folder:

```bash
git init
git add .
git commit -m "Create PivotOps Amazon seller analytics demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not commit real Amazon credentials, refresh tokens, `.env` files, customer data or exported reports.

## Calculation definitions used by the demo

- **Sales** = sum of units sold × product sale price
- **Supplier cost** = sum of units sold × editable supplier cost
- **Amazon/FBA fees** = sum of units sold × editable demo fee assumption
- **Profit/loss** = sales − supplier cost − Amazon/FBA fees − ad spend
- **Net profit/loss** = profit/loss − additional costs
- **TACoS** = ad spend ÷ sales × 100
- **TROAS** = sales ÷ ad spend

The demo uses sample US dollar and UK pound values. Live currency handling should be tied to each marketplace's settlement currency and exchange-rate policy.
