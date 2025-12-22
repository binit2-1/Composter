# Contributing to Composter

Thank you for contributing! 🤝 This guide will help you set up your development environment and contribute to Composter.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Neon.tech account for cloud database)
- **Git** for version control

### 1. Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/Composter.git
cd Composter
```

### 2. Installation

Composter is a monorepo with three main parts: api, frontend, and CLI. Install dependencies for each:

```bash
# Install API dependencies
cd api
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install CLI dependencies
cd ../cli
npm install
```

### 3. Environment Setup

#### API Environment Variables

Create a `.env` file in the `api/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# CORS
CLIENT_URL="http://localhost:5173"

# Server
PORT=3000
NODE_ENV="development"
```

**Generating BETTER_AUTH_SECRET:**
```bash
openssl rand -hex 32
```

This generates a secure 64-character hexadecimal string for Better Auth.

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

#### CLI Environment Variables

Create a `.env` file in the `cli/` directory:

```env
BASE_URL="http://localhost:3000/api"
```

### 4. Database Setup

Composter uses Prisma ORM with PostgreSQL and Better Auth for authentication tables. **Important:** Follow this exact order:

#### Step 1: Set up your database

Choose one option:
- **Option A:** Local PostgreSQL installation
- **Option B:** Create a free database at [Neon.com](https://neon.com)

#### Step 2: Update DATABASE_URL

Update `api/.env` with your PostgreSQL connection string

#### Step 3: Run Prisma migrations FIRST

```bash
cd api
npx prisma migrate dev
```

This creates your application tables (Category, Component, etc.) defined in `prisma/schema.prisma`.

#### Step 4: Run Better Auth migrations SECOND

```bash
npx @better-auth/cli migrate
```

This creates Better Auth's authentication tables (user, session, account, verification, etc.). Better Auth must run **after** Prisma because it needs to connect to an existing database with proper schema.

**Why this order matters:**
1. Prisma sets up the database schema and your app's tables
2. Better Auth then adds its authentication tables to the same database
3. Running them in reverse order may cause connection or schema conflicts

**Alternative: Generate schema without applying**

If you want to preview the schema first:
```bash
npx @better-auth/cli generate
```

This generates the SQL schema file without applying it to your database.

#### Step 5: Verify database setup

```bash
npx prisma studio
```

This opens Prisma Studio in your browser to view/edit data. You should see both your application tables AND Better Auth tables (user, session, account, verification).

#### Step 6: Optional - Seed the database

```bash
npx prisma db seed
```

(Only if a seed script exists in `prisma/seed.js`)

### 5. Understanding Better Auth

Composter uses [Better Auth](https://www.better-auth.com/) for authentication.

**Configuration:** `api/auth/auth.js` - Sessions last 30 days, uses PostgreSQL

**Testing Authentication Locally:**
```bash
# Start API server
cd api
npm run dev

# In another terminal, test login endpoint
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourpassword"}'
```

**Common Better Auth Issues:**

1. **"Invalid session" errors:**
   - Check BETTER_AUTH_SECRET is set and matches across restarts
   - Verify DATABASE_URL is correct
   - Clear cookies and try again

2. **CORS errors in development:**
   - Ensure CLIENT_URL in api/.env matches your frontend URL
   - Check browser console for specific CORS error messages

3. **Database connection errors:**
   - Verify PostgreSQL is running
   - Test connection string with `npx prisma db pull`

4. **"relation does not exist" errors during migration:**
   - Ensure the database schema exists
   - Verify user has proper permissions on the database
   - If using a custom schema (not `public`), configure `search_path`:
     ```
     postgres://user:password@localhost:5432/database?options=-c search_path=your_schema
     ```

**Advanced: Custom PostgreSQL Schema**

Most contributors can skip this. If you need a custom schema (not `public`), see the [Better Auth PostgreSQL docs](https://www.better-auth.com/docs/integrations/postgresql).

### 6. Running the Development Servers

Start each part of the application:

```bash
# Terminal 1: API Server
cd api
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173

# Terminal 3: CLI (optional, for testing)
cd cli
npm link
composter --help
```

## 🛠️ Development Workflow

We recommend the following workflow for contributing:

1. **Create a branch** for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes** following our code style guidelines

3. **Test your changes** thoroughly:
   - Run the backend and frontend together
   - Test authentication flows
   - Verify database operations
   - Test CLI commands if applicable

4. **Commit your changes** with clear, descriptive messages:
```bash
git add .
git commit -m "Add feature: description of your changes"
```

5. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** from your fork to the main repository

## 🚀 How to Contribute

### 1. Select an Issue

- Browse the [Issues page](https://github.com/binit2-1/Composter/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Submit a Pull Request

When submitting a PR:
- Reference the issue number in your PR description
- Describe what changes you made and why
- Include screenshots/videos for UI changes
- Ensure all tests pass (if applicable)
- Follow the existing code style

**Important:** Include `Closes #<ISSUE_ID>` (or `Fixes #<ISSUE_ID>`) in your PR description so the related issue is automatically closed when the PR is merged. See [Using issue & PR templates](docs/using-templates.md) for details on available templates and how to use them.

### 3. Code Review

- A maintainer will review your PR
- Address any requested changes
- Once approved, your PR will be merged!

## 📂 Project Structure

```
Composter/
├── api/                  # Express.js API server
│   ├── auth/            # Better Auth configuration
│   ├── prisma/          # Database schema and migrations
│   ├── routes/          # API route handlers
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   └── index.js         # Main server file
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── router/      # React Router setup
│   └── vite.config.js   # Vite configuration
├── cli/                 # Command-line interface (npm: composter-cli)
│   ├── bin/            # Executable entry point
│   ├── src/
│   │   ├── commands/    # CLI commands (login, add, list, etc.)
│   │   └── utils/       # Helper utilities
│   └── package.json     # npm package config
├── mcp/                 # Model Context Protocol server
│   ├── src/            # MCP server implementation
│   ├── lib/            # MCP tool definitions
│   └── bin/            # MCP executable
└── docs/                # Documentation files
```

### Key Files

- **API (Backend):**
  - `api/auth/auth.js` - Better Auth configuration
  - `api/prisma/schema.prisma` - Database schema
  - `api/routes/*.js` - API endpoints
  - `api/index.js` - Express server setup
  - `api/controllers/*.js` - Business logic

- **Frontend:**
  - `frontend/src/App.jsx` - Main app component
  - `frontend/src/router/AppRouter.jsx` - Route definitions
  - `frontend/src/pages/*` - Page components

- **CLI:**
  - `cli/src/commands/*` - Command implementations
  - `cli/src/utils/session.js` - Session management
  - `cli/package.json` - Published to npm as composter-cli



## 💡 Code Style

- Follow existing code patterns
- Use ESLint (configs provided)
- Write clear variable/function names
- Use async/await for promises

## 🧪 Testing

Before submitting your PR, test all affected functionality and check for console errors.

## 📝 Commit Message Guidelines

Write clear commit messages:

```
feat: add component search functionality
fix: resolve login session expiration issue
docs: update installation instructions
style: format code with prettier
refactor: simplify session validation logic
test: add tests for component CRUD operations
```

## Questions?

- Open a [GitHub Discussion](https://github.com/binit2-1/Composter/discussions)
- Comment on the relevant issue

---

Thank you for contributing! 🎉
