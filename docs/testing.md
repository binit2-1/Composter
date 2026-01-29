# Testing Guide

This guide covers everything you need to know about running and writing tests for Composter.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Overview

Composter uses **Playwright** for end-to-end (E2E) testing, covering both API endpoints and web UI flows. The test infrastructure follows a **"Clean Room"** strategy—tests run against an isolated database that is completely separate from your development environment.

### Key Principles

1. **Isolation**: Tests never touch your development database
2. **Reproducibility**: Each test run starts with a clean slate
3. **Parallelization**: API and web tests can run in parallel across browsers
4. **CI Parity**: Local test environment mirrors the CI pipeline

---

## Architecture

### Clean Room Strategy

The test infrastructure uses separate databases for development and testing to ensure complete isolation:

| Environment | Database | Port | Docker Compose File |
|-------------|----------|------|---------------------|
| **Development** | `composter_db` | `5432` | `docker-compose.yaml` |
| **Testing** | `composter_test` | `5435` | `docker-compose.test.yaml` |

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Machine                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │   Dev Database   │        │  Test Database   │               │
│  │   Port: 5432     │        │   Port: 5435     │               │
│  │   (Persistent)   │        │ (Ephemeral/tmpfs)│              │
│  └──────────────────┘        └──────────────────┘               │
│          │                           │                          │
│          ▼                           ▼                          │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │  npm run dev     │        │ npm run test:e2e │               │
│  │  (apps/api/.env) │        │ (.env.test)      │               │
│  └──────────────────┘        └──────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Separate Ports?

- **Port 5432**: Standard PostgreSQL port for development. Data persists in Docker volumes.
- **Port 5435**: Test database uses `tmpfs` (in-memory storage) for speed. Data is wiped when the container stops.

### Test Projects

The Playwright configuration defines several test projects:

| Project | Directory | Description |
|---------|-----------|-------------|
| `API` | `tests/api/` | Backend API endpoint tests |
| `web-chrome` | `tests/web/` | Frontend tests in Chrome |
| `web-firefox` | `tests/web/` | Frontend tests in Firefox |
| `web-webkit` | `tests/web/` | Frontend tests in Safari/WebKit |

---

## Prerequisites

Before running tests, ensure you have:

- **Node.js** v18+ (v22 recommended for MCP compatibility)
- **Docker** and **Docker Compose** installed and running
- **npm** v10+ installed
- All dependencies installed (`npm install` from repo root)

---

## Environment Setup

### Step 1: Create Test Environment File

Create `apps/api/.env.test` with the following content:

```env
# Test Database (runs on port 5435)
DATABASE_URL="postgresql://composter:composter@localhost:5435/composter_test?schema=public"

# Better Auth Configuration
BETTER_AUTH_SECRET="test_secret_must_be_long_enough_for_testing_123"

# Server Configuration
NODE_ENV="test"
PORT=3000

# URLs
API_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
CLIENT_URL="http://localhost:5173"
```

### Step 2: Ensure Web Environment

Make sure `apps/web/.env` contains:

```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_CLIENT_URL="http://localhost:5173"
```

### Step 3: Run the Setup Script

The project includes an automated bootstrap script that handles Docker, migrations, and schema sync:

```bash
# From the repository root
npm run setup:test
```

**What `npm run setup:test` does:**

1. ✅ Installs dependencies (if missing)
2. 🐳 Tears down any existing test containers (`docker-compose.test.yaml down -v`)
3. 🐳 Starts the test database container on port 5435
4. ⏳ Waits for PostgreSQL to be ready
5. 🔄 Runs Prisma migrations (`prisma migrate dev`)
6. 🔄 Runs Better Auth migrations to create auth tables

### Step 4: Install Playwright Browsers

```bash
npx playwright install --with-deps
```

This downloads Chromium, Firefox, and WebKit browsers needed for testing.

---

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

This runs **all** test projects (API + all browser tests).

### Run Specific Test Projects

```bash
# API tests only
npx playwright test --project=API

# Chrome browser tests only
npx playwright test --project=web-chrome

# Firefox browser tests only
npx playwright test --project=web-firefox

# Safari/WebKit tests only
npx playwright test --project=web-webkit
```

### Run a Single Test File

```bash
# Run a specific test file
npx playwright test tests/api/auth.spec.ts

# Run with a specific project
npx playwright test tests/web/web-auth-flow.spec.ts --project=web-chrome
```

### Interactive UI Mode

```bash
npx playwright test --ui
```

Opens the Playwright Test UI for interactive debugging and test selection.

### Debug Mode

```bash
# Run with browser visible (headed mode)
npx playwright test --headed

# Run with Playwright Inspector
npx playwright test --debug
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run show-report:e2e
# or
npx playwright show-report
```

---

## Writing Tests

### Test Structure

Tests are organized by type:

```
tests/
├── api/                      # Backend API tests
│   ├── auth.spec.ts          # Authentication endpoint tests
│   └── health.spec.ts        # Health check tests
└── web/                      # Frontend E2E tests
    └── web-auth-flow.spec.ts # UI authentication flow tests
```

### API Test Example

API tests use Playwright's `request` fixture to make HTTP calls directly:

```typescript
import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env.test') });

test.describe('AUTH endpoints test', () => {
    // Run tests serially when they depend on each other
    test.describe.configure({ mode: 'serial' });
    
    const API_URL = process.env.API_URL;
    
    // Generate unique user for each test run
    const user = {
        name: `Test User ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
    };

    test('should register a new user', async ({ request }) => {
        const res = await request.post(`${API_URL}/api/auth/sign-up/email`, {
            headers: { 'Content-Type': 'application/json' },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });
        expect(res.status()).toBe(200);
    });

    test('should login with correct credentials', async ({ request }) => {
        const res = await request.post(`${API_URL}/api/auth/sign-in/email`, {
            headers: { 'Content-Type': 'application/json' },
            data: {
                email: user.email,
                password: user.password,
            }
        });
        expect(res.status()).toBe(200);
    });
});
```

### Web UI Test Example

Web tests use Playwright's `page` fixture for browser automation:

```typescript
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env.test') });

const getTestUser = () => ({
    name: `UI Tester ${Date.now()}`,
    email: `ui_test_${Date.now()}@example.com`,
    password: 'Password123!'
});

test.describe('web auth flow test', () => {
    test.describe.configure({ mode: 'serial' });
    
    const USER = getTestUser();

    test('register new user', async ({ page }) => {
        await page.goto('/signup');

        // Use accessible selectors (getByLabel, getByRole)
        const nameInput = page.getByLabel(/name/i);
        const emailInput = page.getByLabel(/email/i);
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        const submitBtn = page.getByRole('button', { name: /create/i });

        await nameInput.fill(USER.name);
        await emailInput.fill(USER.email);
        await passwordInput.fill(USER.password);
        await submitBtn.click();

        // Wait for navigation after successful registration
        await page.waitForURL('/app');
        await expect(page).toHaveURL('/app');
    });
});
```

### Best Practices

1. **Use Serial Mode for Dependent Tests**
   ```typescript
   test.describe.configure({ mode: 'serial' });
   ```

2. **Generate Unique Test Data**
   ```typescript
   const uniqueId = Date.now();
   const email = `test${uniqueId}@example.com`;
   ```

3. **Use Accessible Selectors**
   ```typescript
   // ✅ Good - accessible and resilient
   page.getByLabel(/email/i)
   page.getByRole('button', { name: /submit/i })
   
   // ❌ Avoid - brittle CSS selectors
   page.locator('.form-input-email')
   ```

4. **Load Environment Variables**
   ```typescript
   dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env.test') });
   ```

5. **API-First Pattern for Complex Tests**
   
   For web tests that need specific data, create the state via API first:
   ```typescript
   test.beforeAll(async ({ request }) => {
       // Create test user via API before UI tests
       await request.post(`${API_URL}/api/auth/sign-up/email`, {
           data: { name: 'Test User', email: 'test@example.com', password: 'password' }
       });
   });
   ```

---

## CI/CD Integration

### How CI Works

GitHub Actions runs tests on every push to `main` and on pull requests. The CI pipeline mirrors the local test environment:

1. **Service Container**: PostgreSQL 17 runs as a GitHub Actions service (equivalent to `docker-compose.test.yaml`)
2. **Port Mapping**: The service container maps to port `5435`, same as local tests
3. **Environment Files**: CI creates `.env.test` and `apps/web/.env` dynamically
4. **Playwright Browsers**: Installed fresh in CI with `npx playwright install --with-deps`

### CI Configuration Overview

```yaml
# .github/workflows/ci.yml (simplified)
services:
  postgres:
    image: postgres:17
    env:
      POSTGRES_USER: composter
      POSTGRES_PASSWORD: composter
      POSTGRES_DB: composter_test
    ports:
      - 5435:5432  # Same port as local testing

steps:
  - name: Create .env.test
    run: |
      echo "DATABASE_URL=postgresql://composter:composter@localhost:5435/composter_test" >> apps/api/.env.test
      echo "BETTER_AUTH_SECRET=test_secret_..." >> apps/api/.env.test
      # ... more env vars
      
  - name: Run Playwright Tests
    run: npx playwright test
    env:
      CI: true
```

### CI-Specific Behavior

The `playwright.config.ts` adjusts behavior based on the `CI` environment variable:

| Setting | Local | CI |
|---------|-------|-----|
| `retries` | 0 | 2 |
| `workers` | Auto | 1 |
| `reuseExistingServer` | true | false |
| Browser connection | WebSocket (port 3001) | Direct launch |

### Viewing CI Test Results

Failed test artifacts (screenshots, videos, traces) are uploaded to GitHub Actions:

1. Go to the failed workflow run
2. Download the `playwright-report` artifact
3. Extract and open `index.html` in a browser

Or view traces directly:
```bash
npx playwright show-trace path/to/trace.zip
```

---

## Troubleshooting

### Common Issues

#### 1. "Connection refused" on port 5435

**Cause**: Test database container isn't running.

**Solution**:
```bash
# Start the test database
docker compose -f docker-compose.test.yaml up -d

# Or run the full setup
npm run setup:test
```

#### 2. "Invalid callbackURL: undefined/app"

**Cause**: `VITE_CLIENT_URL` environment variable is not set in `apps/web/.env`.

**Solution**: Ensure `apps/web/.env` contains:
```env
VITE_CLIENT_URL=http://localhost:5173
```

#### 3. Tests timeout waiting for server

**Cause**: The API or web dev server didn't start in time.

**Solution**:
- Increase the `timeout` in `playwright.config.ts` webServer options
- Pre-start servers manually:
  ```bash
  # Terminal 1
  npm run dev --prefix apps/api
  
  # Terminal 2
  npm run dev --prefix apps/web
  
  # Terminal 3
  npx playwright test
  ```

#### 4. "relation does not exist" errors

**Cause**: Database migrations haven't been applied to the test database.

**Solution**:
```bash
npm run setup:test
```

#### 5. Browser tests fail on Linux/Fedora

**Cause**: Playwright needs additional system dependencies.

**Solution**:
```bash
npx playwright install --with-deps
```

For WSL or some Linux distros, you may need a browser server:
```bash
# Start Playwright browser server on port 3001
npx playwright run-server --port 3001

# Then run tests (they'll connect via WebSocket)
npx playwright test
```

### Debug Commands

```bash
# View Playwright test trace
npx playwright show-trace test-results/*/trace.zip

# Open last HTML report
npx playwright show-report

# Run with full debug output
DEBUG=pw:api npx playwright test

# Check if test DB is accessible
docker exec -it composter-db-test psql -U composter -d composter_test -c "SELECT 1"
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run setup:test` | Bootstrap test environment (Docker + migrations) |
| `npm run test:e2e` | Run all E2E tests |
| `npx playwright test --project=API` | Run API tests only |
| `npx playwright test --project=web-chrome` | Run Chrome browser tests |
| `npx playwright test --ui` | Open interactive test UI |
| `npx playwright test --headed` | Run tests with visible browser |
| `npm run show-report:e2e` | View HTML test report |
| `npx playwright show-trace <path>` | View test trace file |

---

## Related Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [API Reference](./api-reference.md)
- [Contributing Guide](../CONTRIBUTING.md)
