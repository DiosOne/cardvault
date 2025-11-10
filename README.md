# CardVault - Backend API

CardVault is a full-stack MERN application designed to manage collectible trading cards.

The backend provides secure user authentification, and persistent card "storage" in MongoDB Atlas, and RESTful CRUD endpoints built using Node.js and Express.

It follows industry standard patterns for modular controllers, middleware, and global error handling.

---

## Technologies Used

| Technology               | Purpose                                                 | Industry Relevance & Comparison                                                                                 | License |
|--------------------------|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|---------|
| Node.js                  | JavaScript runtime for executing backend code.          | Enables a unified language across client and server; faster prototyping than Java or Python stacks.             | MIT     |
| Express.js               | Web framework handling routes and middleware.           | Lightweight, minimalist alternative to Flask or Django; widely adopted in production APIs.                      | MIT     |
| MongoDB Atlas + Mongoose | Cloud-hosted NoSQL database with schema enforcement.    | Flexible document model ideal for rapidly changing data; simpler scaling than relational SQL.                   | SSPL    |
| JWT & bcrypt             | Authentication and password hashing.                    | JWT supports stateless tokens for distributed systems; bcrypt ensures passwords are never stored in plain text. | MIT     |
| dotenv                   | Loads environment variables from a .env file.           | Protects sensitive configuration (DB URI, JWT secret) from exposure in code repositories.                       | MIT     |
| Jest & Supertest         | Automated testing framework and HTTP assertion library. | Industry-standard combo for backend integration tests in Node ecosystems.                                       | MIT     |

___

## Setup and Installation

### Prerequsites

- Node 18 or later
- npm (comes with Node)
- MongoDB Atlas account with connection string
- `.env` file in `/server` directory containing:

```bash
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### Installation Steps

```bash
# Clone the repo
git clone https://github.com/DiosOne/cardvault.git
cd cardvault/server

# Install dependencies
npm install
```

The API will start at `http://localhost:5000`.

### Testing Overview

Automated tests were writtrn using **Jest** (test runner) and **Supertest** (HTTP intergration library) to verify all major API routes behave as expected.


The test suite focuses on essential application functionality:

- **Authentication**: Ensures protected routes return `401 Unauthorised` when no token is provided.
- **Card Creation**: Confirms that valid requestscreate new cards in the database.
- **Card Update**: Verifys users can modify existing cards with valid authentication.
- **Card Deletion**: Checks that cards are removed correctly and returns a success message.
- **Data Retrieval**: Confirms that the `/api/cards` route returns all cards belonging to the authorised user.

```bash
# Run the server (nodemon in dev mode)
npm run dev

# Run tests
npm test
```

---

 ## Code Style and Conventions

 CardVault follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript?tab=readme-ov-file#airbnb-javascript-style-guide-) to maintain a consistent, readable, and professional codebase.  
 An ESLint config file (/server/eslint.config.js) uses the AirBnB Base preset, compatible with ESLintv9.  
 To check or autofix issues:

 ```bash
 npx eslint  
 npx eslint --fix
 ```

 This ensures:

- Consistent indentation, spacing, and quote style
- Unified import/export syntax for ES Modules
- Readable and maintainable code that matches modern Node.js standards

---

## Error Handling and DRY Principles  

The backend applies DRY principles throughout:

- `asyncHandler.js` wraps all asyncronous route controllers to remove repeated `try/catch` blocks.
- `errorHandler.js` acts as a global middleware to handle validation, authentification, and server errors in one place.
- `messages.js` centralises all reuseable response messages for consistency.
Common error categories include:
- `400 Bad Request` - Invalid input or malformed ID
- `401/403` - Unauthorised or invalid token
- `404 Not Found` - The Classic
- `500 Internal Server Error` - as a generic fallback

This helps to ensure predictable API response with minimal code duplication.

---

## API Routes and Usage

| Method | Endpoint           | Description                     | Authorisation |
|--------|--------------------|---------------------------------|:-------------:|
| POST   | /api/auth/register | Register a new user             |       N       |
| POST   | /api/auth/login    | Log in and receive JWT token    |       N       |
| GET    | /api/cards         | Retrieve cards for current user |       Y       |
| POST   | /api/cards         | Create a new card               |       Y       |
| PATCH  | /api/cards/:id     | Update a specific card          |       Y       |
| DELETE | /api/cards/:id     | Delete a specific card          |       Y       

---

## Collaboration & Version Control

This was a solo project, but I still tried to use proper version control practices throughout.
All progress was tracked with Git and pushed to GitHub in regular, more meaningful commits — from setting up routes and models to adding JWT authentication, testing, and improving error handling.
Each commit focused on a specific task or fix so the history shows the project’s development step by step.
Big shout-out to [tablesgenerator.com](https://www.tablesgenerator.com/markdown_tables#) for making Markdown tables less of a pain.

---

### License

This project is released under the [MIT License](https://github.com/airbnb/javascript/blob/master/LICENSE.md). Huge shout out to [Tables Generator](https://www.tablesgenerator.com/markdown_tables#) for making Markdown tables less of a pain.

---

&copy; 2025 Dom Andrewartha.
