# CardVault – Frontend

The CardVault client is a React + Vite single‑page application that pairs with the Express/Mongo backend in this repository. It provides authenticated card management, public trade browsing, and a lightweight “trade inbox” notification experience built around shared React Context providers.

> **Note:** This README covers only the frontend deliverable. The backend (submitted previously) lives at the repo root with its own README (`../README.md`). Use both together for the full MERN stack.

---

## Feature Overview

- **Protected dashboard** - manage personal cards (CRUD) with optimistic UI updates.
- **Public trade listings** - pull `/api/cards/public`, allow authenticated users to request trades.
- **Trade inbox & notifications** - `TradeProvider` keeps the bell badge and `/trades` view in sync with backend status.
- **Auth-aware navigation** - navbar adapts links + logout button based on JWT presence; dark/light theme toggle persists in `localStorage`.
- **Accessibility-first layout** - every page uses semantic regions (`<main>`, `<header>`, `<section>`, ARIA labels) and keyboard-focusable controls.

---

## Tech Stack

| Technology                     | Purpose / Notes                                                                                                              | License   |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------|-----------|
| React 19 + Vite                | Fast SPA development with HMR and modern JSX transform                                                                       | MIT       |
| React Router DOM               | Client-side routing + protected routes                                                                                       | MIT       |
| Axios                          | Promise-based HTTP client with interceptors (simpler than Fetch for token injection); also injects JWT from localStorage     | MIT       |
| Lucide + React Icons           | Lightweight iconography for the navbar theme toggle and trade notifications, preferred over heavier UI kits like Material UI | ISC / MIT |
| ESLint (Airbnb base)           | Shared style guide enforcement between frontend and backend                                                                  | MIT       |
| React Toastify                 | Non-blocking success/error toasts for accessible user feedback                                                               | MIT       |
| React Testing Library + Vitest | Component/unit tests for auth forms, cards, and trade inbox (lighter than Jest + Enzyme)                                     | MIT       |

## Hardware

Developed/tested on Windows 11 (Firefox 145, Chrome 142) and Ubuntu 24.04; requires ≥8 GB RAM, modern CPU to run Vite dev server.

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

- `src/context/AuthProvider.jsx` - exposes `user`, `token`, and `login/logout`, persisting credentials in `localStorage`.
- `src/context/TradeProvider.jsx` - centralizes trade fetching, pending-state calculations, and notification clearing.
- `src/pages/*` - dashboard, auth flows, public listings, and trade inbox. Each file uses semantic `<main>` containers and ARIA helpers.
- `src/components/*` - reusable UI such as `Navbar`, `CardForm`, `CardList`, and `EditCardForm`.
- `src/utility/messages.js` - client-side message catalog + helpers (`getMessage`, `resolveApiError`) so every success/error prompt stays consistent with backend wording.

---

## Style Guide

This project follows the Airbnb JavaScript style guide enforced via ESLint flat config plus a Prettier formatter profile (`.prettierrc`).

Key rules:

- 2-space indents, single quotes, required semicolons, trailing commas in multiline literals.
- React Hooks linting (`eslint-plugin-react-hooks`) to enforce dependency arrays/order.
- React Refresh linting (`eslint-plugin-react-refresh`) to guard against invalid HMR patterns.
- Prettier (tabWidth 2, singleQuote true, printWidth 90) runs on save to keep formatting deterministic.

Run `npm run lint` (ESLint) and `npx prettier --check .` before committing to ensure the style guide is satisfied across the codebase.

- Global styles live in `src/App.css`. Light/dark themes share CSS variables; the navbar theme toggle flips the `darkmode` body class and stores the preference.
- Layouts rely on CSS Grid/Flexbox with fluid spacing. Additional responsive breakpoints are being finalized (tablet nav stacking + tighter card widths).
- Forms and nav items all ship with visible labels or `aria-label` attributes, focusing on keyboard and screen-reader usability.

---

## Error Handling & Notifications

- Every API interaction sits in a `try/catch` block and routes errors through `resolveApiError`, ensuring users never see raw JSON.
- Toasts/alerts reuse the shared message keys (e.g., `CARD_ADD_SUCCESS`, `TRADE_SEND_ERROR`).
- The trade notification bell reads `hasNewTrades` from context; visiting `/trades` triggers `clearNotifications()` so badges clear once the inbox is viewed.

---

## Testing

Run `npm run test` (Vitest) to execute the front-end suite, and `npm run test:watch` during development for live re-runs. Current coverage spans the core flows:

- **Login.test.jsx** - renders the login form, ensures fields/submit button behave.
- **Register.test.jsx** - validates the registration form and error messaging.
- **CardForm.test.jsx** - confirms “Add Card” submissions include status/type/value data.
- **CardList.test.jsx** - verifies Edit/Delete buttons fire their callbacks for each card.
- **TradeInbox.test.jsx** - checks the empty state plus incoming/outgoing trade badges.

All tests use React Testing Library + Vitest; see `package.json` for the exact scripts (`npm run test`, `npm run test:watch`) and `src/__tests__/` for the specs.

---

## Deployment Notes

1. Build with `npm run build` (outputs to `client/dist`).
2. Deploy the static bundle (Netlify/Vercel/Cloudflare). Make sure environment variables in your host point to the backend API, or update `src/api/api.js` before building.
3. Serve over HTTPS if talking to a hosted backend that enforces secure cookies/tokens.

---

## License & Attribution

This frontend ships under the same [MIT License](../license.md) as the backend. Development followed solo-project best practices (feature branches, linted commits) even though the assignment originally targeted teams of two or three.

For additional backend details, refer to the root `README.md`.
