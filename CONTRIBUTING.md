# Contributing to Composter

Thank you for contributing! 🤝 This guide will help you set up your development environment and contribute to Composter.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (recommended v10+) or **yarn**
- **PostgreSQL** database (or Neon for cloud DB)
- **Git** for version control

### 1. Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/Composter.git
cd Composter
```

### 2. Installation

Composter is a monorepo. Top-level(root-level) `npm install` will install workspace packages. You can also install per-package.

Recommended (root install):

```bash
# Install everything from the repo root
npm install
```

Or install per package:

```bash
# API
cd apps/api && npm install

# Web frontend
cd ../web && npm install

# CLI
cd ../../cli && npm install
```

### 3. Environment Setup

#### API Environment Variables

Create a `.env` file in the `apps/api/` directory:

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

Create a `.env` file in the `apps/web/` directory:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

#### CLI Environment Variables

Create a `.env` file in the `cli/` directory:

```env
BASE_URL="http://localhost:3000/api"
```

### 4. Database Setup

Composter uses Prisma ORM with PostgreSQL and Better Auth for authentication tables. **Important:** follow the migration order below to avoid schema conflicts.

#### Step 1: Start the database with Docker Compose

From the repository root, run:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432` (configurable via `DB_PORT` env var)
- **Adminer** (database UI) on [http://localhost:8080](http://localhost:8080)

**Default credentials:**
| Variable | Default Value |
|----------|---------------|
| `DB_USER` | `composter` |
| `DB_PASSWORD` | `composter` |
| `DB_NAME` | `composter_db` |
| `DB_PORT` | `5432` |

To customize, set environment variables before running `docker compose up`:

```bash
DB_PORT=5433 DB_PASSWORD=mysecret docker compose up -d
```

#### Step 2: Configure DATABASE_URL

Update `apps/api/.env` with the connection string matching your Docker setup:

```env
DATABASE_URL="postgresql://composter:composter@localhost:5432/composter_db"
```

#### Step 3: Run Prisma migrations

```bash
cd apps/api
npx prisma migrate dev
```

#### Step 4: Run Better Auth migrations

```bash
npx @better-auth/cli migrate
```

Why this order: Prisma initializes your application's schema; Better Auth adds auth-related tables to the same DB.

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

Start each part of the application (monorepo paths):

```bash
# Terminal 1: API Server
cd apps/api
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Web frontend
cd ../web
npm run dev
# Runs on http://localhost:5173

# Terminal 3: CLI (optional, for testing)
cd ../../cli
npm link
composter --help
```

### Run the whole monorepo (Turbo)

This repository uses Turbo to orchestrate the workspaces. You can start all development services from the repo root instead of running each package individually.

From the repository root:

```bash
# Install dependencies
npm install

# Start all dev services (runs `dev` in each workspace)
npm run dev
# or
npx turbo dev
```

To run a subset of services use Turbo filters:

```bash
# Run only API and Web
npx turbo dev --filter=apps/api... --filter=apps/web...

# Run only the web app
npx turbo dev --filter=apps/web
```

Environment variables

- Use per-service `.env` files (e.g., `apps/api/.env`, `apps/web/.env`) or export env vars in your shell.
- Required (common) envs: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CLIENT_URL`, `VITE_API_BASE_URL`.

Example `apps/api/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/composter"
BETTER_AUTH_SECRET="your_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
CLIENT_URL="http://localhost:5173"
```


## 🛠️ Development Workflow

We recommend the following workflow for contributing:

1. **Create a branch** for your work:
```bash
git checkout -b feature/your-feature-name
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

### Assignment & PR Policy

To reduce duplicated work and make contributions predictable, follow this assignment-first approach:

- **Ask before implementing**: Comment on the issue you want to work on with "I'd like to work on this" and wait for an assignment.
- **We will assign**: A maintainer or collaborator will assign the issue to you. Once assigned, you have the assignment for a reasonable timeframe (recommended: 3–7 days) to open a PR addressing it.
- **Unassigned issues**: If an issue is unassigned, contributors may request assignment. If multiple people ask, maintainers will decide and assign the best fit.
- **No response / timeout**: If the assignee doesn't open a PR within the agreed timeframe, a maintainer may unassign the issue so others can pick it up.

Fallback rules if an issue is unassigned and multiple PRs arrive:

- **First valid PR wins**: The first PR that meets the project's quality standards (tests, style, described changes) will generally be accepted.
- **Exception for significantly better PRs**: If a later PR is clearly superior (better tests, performance, or design), maintainers may request the first author incorporate improvements or, rarely, choose the better PR while acknowledging the first author.

Handling "drive-by" PRs (no prior assignment):

- If the drive-by PR solves an unclaimed issue and is high-quality, it may be merged. Maintainers should politely ask contributors to request assignment next time to avoid duplicate effort.

Recommendations by issue type:

- **Good First Issues**: Always assign to one person at a time. Use the `good first issue` label.
- **Help Wanted**: Assign if someone asks; otherwise, first-come-first-served.
- **Critical Bugs**: Core team or fastest/most reliable submitter handles these; maintainers may prioritize.

See `docs/using-templates.md` for template usage and include `Closes #<ISSUE_ID>` in PR descriptions so issues auto-close on merge.

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

## Documentation

User-facing and developer documentation lives in the `docs/` folder. Please update the relevant markdown files when you change features or developer workflows.

Key docs:
- `docs/getting-started.md` — beginner and developer quick-starts
- `docs/api-reference.md` — API endpoints and local API dev notes
- `docs/mcp-integration.md` — MCP setup and inspector/debugging commands

If you plan to change documentation, run a quick local preview (your editor or static site tool) to validate links and screenshots.


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
