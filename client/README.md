# CardVault – Frontend

The CardVault client is a React + Vite single‑page application that pairs with the Express/Mongo backend in this repository. It provides authenticated card management, public trade browsing, and a lightweight “trade inbox” notification experience built around shared React Context providers.

The frontend mirrors the backend README style so both halves of the project feel cohesive.

---

## Feature Overview

- **Protected dashboard** – manage personal cards (CRUD) with optimistic UI updates.
- **Public trade listings** – pull `/api/cards/public`, allow authenticated users to request trades.
- **Trade inbox & notifications** – `TradeProvider` keeps the bell badge and `/trades` view in sync with backend status.
- **Auth-aware navigation** – navbar adapts links + logout button based on JWT presence; dark/light theme toggle persists in `localStorage`.
- **Accessibility-first layout** – every page uses semantic regions (`<main>`, `<header>`, `<section>`, ARIA labels) and keyboard-focusable controls.

---

## Tech Stack

| Technology       | Purpose / Notes                                                                 | License |
|------------------|----------------------------------------------------------------------------------|---------|
| React 19 + Vite  | Fast SPA development with HMR and modern JSX transform                          | MIT     |
| React Router DOM | Client-side routing + protected routes                                          | MIT     |
| Axios            | REST client with JWT interceptor (reads `localStorage.token`)                   | MIT     |
| Lucide + React Icons | Iconography for navbar theme toggle and trade notifications                 | ISC / MIT |
| ESLint (Airbnb base) | Enforces consistent style guide shared in backend README                    | MIT     |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running locally on `http://localhost:5000` (or update the base URL noted below)

### Installation & Scripts

```bash
cd client
npm install          # install dependencies
npm run dev          # start Vite dev server on http://localhost:5173
npm run build        # create production bundle
npm run preview      # serve the production build locally
npm run lint         # run ESLint (Airbnb config)
```

### API Configuration

The Axios instance lives in `src/api/api.js`. Update `baseURL` to point at the deployed backend if you move off localhost.

---

## Project Structure Highlights

- `src/context/AuthProvider.jsx` – exposes `user`, `token`, and `login/logout`, persisting credentials in `localStorage`.
- `src/context/TradeProvider.jsx` – centralizes trade fetching, pending-state calculations, and notification clearing.
- `src/pages/*` – dashboard, auth flows, public listings, and trade inbox. Each file uses semantic `<main>` containers and ARIA helpers.
- `src/components/*` – reusable UI such as `Navbar`, `CardForm`, `CardList`, and `EditCardForm`.
- `src/utility/messages.js` – client-side message catalog + helpers (`getMessage`, `resolveApiError`) so every success/error prompt stays consistent with backend wording.

---

## Style Guide & Accessibility

- ESLint extends `eslint-config-airbnb-base` (matching the backend). Run `npm run lint` before committing.
- Global styles live in `src/App.css`. Light/dark themes share CSS variables; the navbar theme toggle flips the `darkmode` body class and stores the preference.
- Layouts rely on CSS Grid/Flexbox with fluid spacing. Additional responsive breakpoints are being finalized (tablet nav stacking + tighter card widths).
- Forms and nav items all ship with visible labels or `aria-label` attributes, focusing on keyboard and screen-reader usability.

---

## Error Handling & Notifications

- Every API interaction sits in a `try/catch` block and routes errors through `resolveApiError`, ensuring users never see raw JSON.
- Toasts/alerts reuse the shared message keys (e.g., `CARD_ADD_SUCCESS`, `TRADE_SEND_ERROR`).
- The trade notification bell reads `hasNewTrades` from context; visiting `/trades` triggers `clearNotifications()` so badges clear once the inbox is viewed.

---

## Testing Status

- Manual regression runs cover: auth flow, dashboard CRUD, trade request submission, and logout/login scenarios.
- Automated testing (React Testing Library + Vitest) is planned to cover component rendering and form submission flows.

---

## Deployment Notes

1. Build with `npm run build` (outputs to `client/dist`).
2. Deploy the static bundle (Netlify/Vercel/Cloudflare). Make sure environment variables in your host point to the backend API, or update `src/api/api.js` before building.
3. Serve over HTTPS if talking to a hosted backend that enforces secure cookies/tokens.

---

## License & Attribution

This frontend ships under the same [MIT License](../license.md) as the backend. Development followed solo-project best practices (feature branches, linted commits) even though the assignment originally targeted teams of two or three.

For additional backend details, refer to the root `README.md`.
