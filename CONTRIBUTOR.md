# Contributor Guide

Thanks for taking a look at CardVault. This repository contains a full MERN stack app split into a Vite React client and an Express/Mongo server. The guidelines below keep contributions consistent with the existing docs and coding standards.

---

## Project Layout

- `client/` - React 19 + Vite SPA with Context-based auth/trade state, React Router, and Vitest tests.
- `server/` - Express API with JWT auth, MongoDB/Mongoose models, and Jest + Supertest tests.
- `README.md` - Full-stack overview and API reference.
- `client/README.md` - Frontend-only details and test coverage.

## Prerequisites

- Node.js 18+ and npm.
- MongoDB Atlas connection string (for server tests and runtime).

## Setup

### Client

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

### Server

```bash
cd server
npm install
```

Create `server/.env`:

```bash
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

Start the API:

```bash
npm run dev     # http://localhost:5000
```

## Development Workflow

1. Create a branch for your change.
2. Keep changes focused and scoped to one feature or fix.
3. Ensure linting and tests pass for the area you touched.
4. Open a PR with a clear description and screenshots if UI is affected.

## Code Style

This project follows the Airbnb JavaScript style guide plus Prettier formatting.

- Client lint: `npm run lint` in `client/`.
- Server lint: `npm run lint` in `server/`.
- Use 2-space indents, single quotes, and trailing commas for multiline literals.

## Testing

### Client

```bash
cd client
npm run test
```

Notes:
- The `PublicTrades.test.jsx` spec is currently skipped due to a router context issue. If you fix the underlying issue, unskip the test.

### Server

```bash
cd server
npm test
```

## API and Data Guidelines

- All authenticated routes require JWTs.
- Keep API responses consistent with existing messages in `server/utils/messages.js` and `client/src/utility/messages.js`.
- When adding or modifying API endpoints, update `README.md` to reflect changes.

## UI and Accessibility

- Maintain semantic structure (`<main>`, `<section>`, `<header>`), ARIA labels, and keyboard-friendly controls.
- Keep responsive behavior aligned with existing breakpoints in `client/src/App.css`.

## Commit and PR Notes

- Use clear, descriptive commit messages.
- Include the why, not just the what, in PR descriptions.
- Link any relevant issues or bugs.

## Security

If you discover a security issue, do not open a public issue. Share details privately with the repository owner.

## License

By contributing, you agree your work is released under the MIT License in `license.md`.
