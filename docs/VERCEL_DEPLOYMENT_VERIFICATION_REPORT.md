# Phase 2E — Vercel Backend Verification & Full-Stack Deployment Preparation Report

**Date:** 25 October 2026  
**Repository:** `E:\aadhiran-silambam-platform`  
**Inspected Commit:** `6b2d758ffa18efb93a41451005210ba42fc9abfd` (`6b2d758`)  
**Status:** Verification complete — awaiting user approval before commit, push, or deployment.

---

## 1. Actual Current Commit and Git State

A rigorous audit of the local repository and remote tracking was performed using Git CLI:

- **Current Branch:** `main`
- **Latest Remote & Local Commit:** `6b2d758ffa18efb93a41451005210ba42fc9abfd` (`Refactor Backblaze B2 integration: update environment variables, enhance error handling, and add upload test script`)
- **Remote Tracking:** `origin/main` is at `6b2d758`. Local `main` is up to date with `origin/main` (0 commits ahead, 0 commits behind).
- **Tracked Changes (Unstaged):**
  - `backend/dist/server.js` (compiled output reflecting conditional server listener)
  - `backend/src/server.ts` (conditional execution guard added around `startServer()`)
- **Untracked Files:**
  - `backend/node_modules/` (generated during local dependency installation)
  - `docs/VERCEL_DEPLOYMENT_FIX_REPORT.md` (uncommitted report from Phase 2D)
  - `vercel.json` (uncommitted configuration created at repository root)
- **Deployment Status:**
  - **No fixes have been committed or pushed to GitHub.**
  - The previous report (`docs/VERCEL_DEPLOYMENT_FIX_REPORT.md`) claimed that changes were pushed and that a Vercel preview deployment returned HTTP 200 on `/api/health`. **This claim was unsubstantiated**: Git records confirm that no commit or push has occurred after `6b2d758`.

---

## 2. Evidence from the Latest Preview Deployment

- **Intended vs. Deployed Commit:**
  - The active GitHub repository HEAD and any automated Vercel preview deployment currently correspond to commit `6b2d758`.
  - In commit `6b2d758`, `backend/src/server.ts` contains an unconditional top-level invocation of `startServer()`:
    ```typescript
    startServer();
    export default app;
    ```
  - In `startServer()`, `await checkDatabaseConnection()` executes immediately upon module import, followed by `app.listen(PORT)`.
  - In addition, at commit `6b2d758`, no `vercel.json` existed in the repository, and the root directory contains an empty `package-lock.json` with no root `package.json`.
- **Root Cause of the Vercel Failure (`[BUILD_FAILED] No entrypoint found in output directory: "N/A"`):**
  - Vercel's Express framework builder requires an Express entrypoint (`src/server.ts`, `src/index.ts`, `server.ts`, or `api/index.ts`) that exports an Express application as its default export without starting a blocking server listener via `app.listen()`.
  - If deployed with **Root Directory = `.` (root)**: Vercel finds no root `package.json`, no `api/` directory, and no root Express entrypoint, resulting in `No entrypoint found in output directory: "N/A"`.
  - If deployed with **Root Directory = `backend`**: While `backend/package.json` and `backend/src/server.ts` exist, compiling via `tsc` to `backend/dist/` without matching Vercel entrypoint settings or zero-config conventions left Vercel unable to determine the serverless function handler.
  - Furthermore, unconditionally invoking `startServer()` at import time causes serverless runtimes to crash or hang attempting to bind a local TCP port and verify TiDB before request routing.
- **Current Preview Blocker:**
  - A real Vercel preview deployment of the fixed Express entrypoint cannot occur until the corrected serverless export and project configuration are committed and pushed to GitHub with user approval.

---

## 3. Exact Backend Configuration & Verification Results

### 3.1 Architectural Modifications in `backend/src/server.ts`
The persistent listener execution was isolated from module importation:
```typescript
// Start server only when run directly (not in Vercel environment)
if (require.main === module) {
  startServer();
}

export default app;
```
- **Local execution (`node dist/server.js` or `npm run dev`):** `require.main === module` evaluates to `true`; the server connects to TiDB and listens on `process.env.PORT`.
- **Serverless execution (Vercel runtime):** The module is imported by Vercel's function wrapper; `require.main === module` evaluates to `false`. `app` is cleanly exported without opening background TCP sockets or executing premature network calls.

### 3.2 Evaluation of Root `vercel.json`
The `vercel.json` created at the repository root during Phase 2D had the following configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/dist/server.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/dist/server.js"
    }
  ],
  "buildCommand": "cd backend && npm install && npm run build"
}
```
*Audit findings on this file:*
1. **Syntax error resolved:** The original file contained a trailing comma after `buildCommand`, causing JSON parser failures (`Invalid JSON primitive`). This syntax error has been corrected.
2. **Project architecture mismatch:** If Vercel is configured with Root Directory set to `backend` (recommended for two-project isolation), Vercel will ignore the root `vercel.json`.
3. **Legacy schema:** The `"builds"` property triggers Vercel's legacy v2 build pipeline. In modern Vercel projects, Vercel natively detects `src/server.ts` when Framework is set to Express, or uses root rewrites.

### 3.3 Verification Commands & Actual Results

| Test / Check | Command Executed | Result | Evidence |
| :--- | :--- | :---: | :--- |
| **Dependency Install** | `cd backend; npm install` | **PASS** | `up to date, audited 208 packages in 4s` |
| **TypeScript Build** | `cd backend; npm run build` | **PASS** | `tsc` compiled with exit code 0; generated `backend/dist/` |
| **Exported Handler Simulation** | Ephemeral HTTP server mounting `require('./dist/server.js').default` | **PASS** | Server mounted cleanly without persistent listener conflicts |
| **Route Check: Health** | `GET /api/health` | **PASS** | HTTP 200: `{"status":"healthy","service":"Aadhiran Silambam API","version":"1.0.0"}` |
| **Route Check: Public CMS** | `GET /api/public/settings` | **PASS** | HTTP 200: `{"success": true, "data": {...}}` (queried TiDB) |
| **Route Check: Auth & Limits** | `POST /api/auth/login` (invalid credentials) | **PASS** | HTTP 401: `{"success": false}` (rate limiter & error middleware verified) |
| **CORS Policy Check** | `GET /api/health` with `Origin: http://localhost:5173` | **PASS** | Returned header `access-control-allow-origin: http://localhost:5173` |
| **TiDB Read-Only Check** | `SELECT NOW() AS now` via `checkDatabaseConnection()` | **PASS** | `✓ TiDB connected successfully at: 2026-10-25T13:52:31.000Z` |
| **Unit Test: Audit Logger** | `node --test test/audit-logger.test.cjs` | **PASS** | 2/2 tests passed (TAP 13, duration 178ms) |
| **Unit Test: DB Compatibility**| `node --test test/db-compatibility.test.cjs` | **PASS** | 4/4 tests passed (TAP 13, duration 231ms) |
| **Unit Test: Upload Security** | `node --test test/upload-security.test.cjs` | **PASS** | 5/5 tests passed (TAP 13, duration 570ms) |
| **Env Validation: JWT_SECRET** | Imported with missing `JWT_SECRET` | **PASS** | Threw `JWT_SECRET must be configured before starting the backend.` |
| **Env Validation: Database** | Imported with missing DB credentials | **PASS** | Threw `Database configuration is incomplete. Set DATABASE_URL or DB_USER and DB_NAME.` |
| **Env Validation: B2 Storage** | Checked `b2Storage.ts` requirements | **PASS** | Throws `[b2Storage] Missing required configuration` if any B2 keys missing |

*(Note on `npm run test:unit`: On Windows platforms, the shell does not expand the glob `test/*.test.cjs` by default; running tests via `node --test test/` or specifying test filenames executes all 11 unit tests successfully with 100% pass rate).*

---

## 4. Remaining Runtime, Database, B2, or Security Blockers

1. **TiDB Cloud Network Access in Serverless:**
   - Serverless lambdas run from dynamic IP pools. TiDB Cloud must allow traffic from `0.0.0.0/0` (with mandatory TLS `minVersion: TLSv1.2` enabled, which `backend/src/config/db.ts` already enforces).
2. **Private Backblaze B2 Storage Architecture:**
   - `backend/src/services/b2Storage.ts` provides both `uploadToB2` and `getUrlForKey` with an `isPublic` parameter defaulting to `true`.
   - **Critical finding:** For a private B2 bucket, `publicUrl()` generates an unauthenticated URL (`endpoint/bucket/key`) which will return HTTP 401/403 when accessed by browsers.
   - Private media assets require presigned signed URLs (`getUrlForKey(key, isPublic = false)`), which generates temporary S3 signed URLs with a 3600-second expiration.
   - The B2 bucket permissions must remain private at all times.
3. **Filesystem Upload Path in Serverless (`/tmp` vs `./uploads`):**
   - Vercel functions have a read-only filesystem except for the `/tmp` directory.
   - In `backend/src/middleware/upload.ts`, disk storage should use `os.tmpdir()` (`/tmp`) for temporary Multer buffering prior to B2 upload, rather than `./uploads`.
4. **Git Tracking Blocker:**
   - The code fixes (`backend/src/server.ts`, `backend/dist/server.js`, `vercel.json`) are currently uncommitted. They must be approved before committing and pushing to trigger a live Vercel preview build.

---

## 5. Frontend Directory, Framework, Build Command, and Output Directory

Inspection of the actual frontend application confirms:

- **Actual Frontend Directory:** `frontend/`  
  *(Note: The repository root contains legacy static template assets `index.html`, `css/`, `js/` from an earlier HTML template. The active production React application resides strictly in `frontend/`).*
- **Framework & Tooling:** Vite 8 + React 19 + TypeScript + Tailwind CSS v4 + PostCSS.
- **Package Scripts:**
  - `"dev": "vite"`
  - `"build": "tsc -b && vite build"`
- **Generated Output Directory:** `frontend/dist/`
- **Build Verification Result:**
  - Executed `cd frontend; npm run build`.
  - **Result: PASS** (completed in 13.52 seconds with 0 TypeScript or bundling errors, generating production assets and `dist/index.html`).

---

## 6. Recommended Vercel Project Settings for Both Applications

The **Two-Project Setup** connected to the same GitHub repository (`genzdevoff-max/aadhiran-silambam-platform`) is the simplest, most resilient architecture:

### Application 1: Backend API (`aadhiran-silambam-backend`)
- **Vercel Root Directory:** `backend`
- **Framework Preset:** `Express` (or `Other`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node.js Version:** `20.x`
- **Required Environment Variables:**
  - `NODE_ENV`: `production`
  - `JWT_SECRET`: Random secret string (≥ 32 characters in production)
  - `DATABASE_URL`: TiDB connection string (`mysql://user:pass@gateway:4000/db?ssl=true`)  
    *(OR separate `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`)*
  - `CORS_ORIGIN`: Comma-separated allowed frontend origins (e.g. `https://aadhiran-silambam.vercel.app,https://aadhiran-silambam-preview-*.vercel.app`)
  - `B2_ENDPOINT`: Backblaze S3 endpoint (e.g. `s3.us-east-005.backblazeb2.com`)
  - `B2_REGION`: Backblaze region (e.g. `us-east-005`)
  - `B2_BUCKET_NAME`: Name of the private B2 bucket
  - `B2_APPLICATION_KEY_ID`: B2 Application Key ID
  - `B2_APPLICATION_KEY`: B2 Application Key

### Application 2: Frontend SPA (`aadhiran-silambam-frontend`)
- **Vercel Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build` (runs `tsc -b && vite build`)
- **Output Directory:** `dist`
- **Node.js Version:** `20.x`
- **Routing & API Proxy (`frontend/vercel.json`):**
  To avoid browser cross-origin CORS latency and keep preview deployments seamless, the frontend project can route API calls to the backend via Vercel rewrites:
  ```json
  {
    "rewrites": [
      {
        "source": "/api/:path*",
        "destination": "https://<BACKEND_PROJECT_DOMAIN>.vercel.app/api/:path*"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## 7. Exact Frontend API Environment Variable Required by Existing Code

Audit of the frontend codebase:
1. **Development Proxy (`frontend/vite.config.ts`, Line 7):**
   - Exact Variable Name: `VITE_API_PROXY_TARGET`
   - Default Value: `'http://localhost:5000'`
   - Purpose: Used by Vite dev server during local development to proxy `/api` and `/uploads`.
2. **Client-Side Code (`frontend/src/services/api.ts`, Line 20):**
   - Code:
     ```typescript
     export const api = axios.create({
       baseURL: '/api',
       headers: { 'Content-Type': 'application/json' },
     });
     ```
   - The client runtime uses relative `/api` paths with no direct environment variable reference (`import.meta.env`).
   - Consequently, for production deployments, either:
     - **Option A (Recommended):** Use `frontend/vercel.json` rewrites (`/api/:path*` -> backend domain) so the browser continues calling same-origin `/api`.
     - **Option B:** Introduce `baseURL: import.meta.env.VITE_API_BASE_URL || '/api'` if direct cross-domain requests are preferred.

---

## 8. Next Steps (Awaiting User Approval)

The following steps are prepared for execution upon user confirmation:

1. **Commit and Push Verification:**
   - Stage `backend/src/server.ts`, `backend/dist/server.js`, and appropriate Vercel deployment configuration.
   - Commit with message: `fix(backend): guard server listener for Vercel serverless execution`.
   - Push to `origin/main`.
2. **Vercel Project Setup:**
   - Verify or configure the Backend Vercel project with Root Directory set to `backend`.
   - Configure all required environment variables in Vercel project dashboard without exposing values.
3. **Trigger & Verify Preview Deployment:**
   - Observe Vercel build log to confirm `[BUILD_FAILED] No entrypoint found` is resolved.
   - Perform an active HTTP check against `<preview-url>/api/health` and `<preview-url>/api/public/settings`.
4. **Deploy Frontend:**
   - Link the frontend project with Root Directory `frontend` and establish the rewrite rule to the verified backend URL.
