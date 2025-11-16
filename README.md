# CardVault – Full Stack MERN Project

CardVault is a training assignment that ships both halves of a MERN stack:

- **Frontend (client/)** - React 19 + Vite SPA with authenticated dashboard, shared card panel components, public trade listings, trade inbox messaging (accept/decline + reply notes), responsive CSS, and Vitest/Testing Library coverage.
- **Backend (server/)** - Node/Express API with JWT auth, MongoDB Atlas via Mongoose, modular controllers/middleware, global error handling, and Jest + Supertest integration tests.

The following sections split the documentation into two obvious parts so graders can find everything in one file.

---

## 1. Frontend (client/)

### Tech Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| React 19 + Vite | SPA + fast dev server | HMR, modern JSX, easy deployment |
| React Router DOM | Client routing & protected routes | Used by navbar + trade views |
| Axios | HTTP client with interceptor for JWT headers | `src/api/api.js` centralizes baseURL |
| React Context (Auth/Trade) | Shares user/token + trade notifications across app | Persists auth in `localStorage`, tracks `hasNewTrades` |
| React Toastify | Accessible toasts for success/error messaging | Messages pulled from `src/utility/messages.js` |
| ESLint (Airbnb base) + Prettier | Style enforcement | `npm run lint` keeps React code consistent |
| Vitest + Testing Library | Component testing for cards/forms/trade inbox | One spec (`PublicTrades.test.jsx`) is currently skipped pending router fix |

### Setup

```bash
cd cardvault/client
npm install
npm run dev      # http://localhost:5173
```

To preview on a phone from WSL/Ubuntu, forward ports 5173 and 5000 through Windows:

```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=<WSL-IP>
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=<WSL-IP>
```

### Scripts

- `npm run dev` - Vite dev server
- `npm run build` / `npm run preview` - production bundle + local preview
- `npm run lint` - ESLint (Airbnb config)
- `npm run test` - Vitest suite

### Testing Overview

Current coverage (`npm run test`) includes:

- `CardForm.test.jsx` - verifies `onAdd` receives name/type/rarity/value/status.
- `CardList.test.jsx` - empty state + edit/delete callbacks.
- `TradeAlertButton.test.jsx` - CTA text vs bell icon state (NavLink mock).
- `TradeInbox.test.jsx` - empty state and incoming trade render.
- `PublicTrades.test.jsx` - **skipped** with a TODO because Vitest currently errors on `useLocation` (router context). The spec remains in the suite but does not run until the fix is implemented.

### Key Frontend Features

- **Card Panel** - wraps `CardForm`, `EditCardForm`, and `CardList` inside a styled panel component.
- **Trade Inbox Messaging** - `TradeProvider` + `TradeInbox` allow accepting/declining trades with optional response message via `PATCH /api/trades/:id`.
- **Notification CTA** - `TradeAlertButton` centralizes the “View Trade Inbox” vs “Go to Trade Inbox” button with bell icon.
- **Accessibility** - `Section` component injects visually hidden headings, ARIA labels, and keeps semantic `<main>/<section>` structure.
- **Responsive CSS** - `src/App.css` covers ≤400px up to ≥1200px breakpoints, tested on Pixel/iPhone/iPad presets. Placeholder images use `https://picsum.photos/200/300?grayscale&random=…` to avoid copyrighted art.

---

## 2. Backend (server/)

### Tech Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| Node.js + Express | REST API | Modular controllers/routes with JWT middleware |
| MongoDB Atlas + Mongoose | Data persistence | Card, User, and TradeRequest schemas |
| JWT + bcrypt | Auth/token issuing & password hashing | Tokens stored in `localStorage` on the client |
| dotenv | Env var management | `.env` holds `MONGO_URI`, `JWT_SECRET`, etc. |
| Jest + Supertest | Integration tests | Validates auth + card CRUD routes |

### Setup

```bash
cd cardvault/server
npm install
```

Create `server/.env` with:

```bash
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

Start the API:

```bash
npm run dev   # nodemon, http://localhost:5000
```

Lint & test:

```bash
npm run lint  # ESLint (flat config)
npm test      # Jest + Supertest
```

`npm test` covers authentication (401s without tokens), card creation/update/delete, and `/api/cards` retrieval scoped to the logged-in user.

### Error Handling & DRY

- `asyncHandler.js` wraps controllers to avoid repeated `try/catch`.
- `errorHandler.js` centralizes API error responses (400/401/403/404/500).
- `messages.js` stores reusable response strings shared with the client.

### API Routes

| Method | Endpoint           | Description                     | Auth |
|--------|--------------------|---------------------------------|:----:|
| POST   | /api/auth/register | Register a new user             |  No  |
| POST   | /api/auth/login    | Log in and receive JWT token    |  No  |
| GET    | /api/cards         | Retrieve cards for current user | Yes  |
| POST   | /api/cards         | Create a new card               | Yes  |
| PATCH  | /api/cards/:id     | Update a specific card          | Yes  |
| DELETE | /api/cards/:id     | Delete a specific card          | Yes  |
| GET    | /api/cards/public  | Public listings (status “for trade”/“wanted”) | No |
| POST   | /api/trades        | Create trade request            | Yes  |
| GET    | /api/trades        | List incoming/outgoing trades   | Yes  |
| PATCH  | /api/trades/:id    | Accept/decline + response message | Yes |

### Code Style

- Both client and server follow the Airbnb JavaScript style guide via ESLint flat configs plus Prettier formatting.
- Run `npm run lint` in each folder before committing to keep imports/hooks ordering consistent.

---

## Collaboration & License

Solo project but tracked with Git (feature commits, linted code). Big thanks to [tablesgenerator.com](https://www.tablesgenerator.com/markdown_tables#) for Markdown tables.

Code is released under the [MIT License](https://github.com/airbnb/javascript/blob/master/LICENSE.md).

&copy; 2025 Dom Andrewartha.
