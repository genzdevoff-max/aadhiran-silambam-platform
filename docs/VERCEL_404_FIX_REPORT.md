# Vercel Homepage 404 Diagnosis and Fix Report

**Date:** 25 October 2026  
**Repository:** `E:\aadhiran-silambam-platform`  
**Deployed URL:** `https://aadhiran-silambam.vercel.app/`  
**GitHub Repository:** `genzdevoff-max/aadhiran-silambam-platform`  
**Inspected Deployed Commit:** `1133d78`  
**Current Local Branch:** `main`  
**Status:** Root cause diagnosed, locally resolved, and empirically verified. Awaiting user approval to commit and redeploy.

---

## 1. Confirmed Root Cause of the Homepage 404

A live HTTP verification of `https://aadhiran-silambam.vercel.app/` confirmed the exact symptoms reported:
- `GET https://aadhiran-silambam.vercel.app/` ➔ **HTTP 404 Not Found**
- `GET https://aadhiran-silambam.vercel.app/api/health` ➔ **HTTP 200 OK**:
  ```json
  {"status":"healthy","timestamp":"2026-10-25T15:41:54.320Z","service":"Aadhiran Silambam API","version":"1.0.0"}
  ```

### The Exact Three-Part Cause at Commit `1133d78`:
1. **The frontend was never built:**
   In commit `1133d78`, `vercel.json` configured `buildCommand: "cd backend && npm install && npm run build"`. This command compiled only the backend (`tsc`). The Vite React frontend (`frontend/`) was never installed, compiled, or output to `frontend/dist/`.
2. **Every request (`/(.*)`) was routed to the backend Express server:**
   In commit `1133d78`, `vercel.json` contained:
   ```json
   "routes": [
     {
       "src": "/(.*)",
       "dest": "backend/dist/server.js"
     }
   ]
   ```
   This catch-all sent all incoming requests—including the root path `GET /`—directly to `backend/dist/server.js`.
3. **Express has no handler for `GET /`:**
   `backend/src/server.ts` only registers API routes (`/api/auth`, `/api/public`, `/api/admin`, `/api/health`, `/uploads`). When Express receives `GET /`, it finds no matching route and returns a standard Express `404 Not Found`.

**Conclusion:** The homepage was returning 404 because Vercel was routing requests for `/` to the Express backend instead of the compiled React frontend, and the React frontend was never being built.

---

## 2. Explanation of the Vercel `builds` Warning

In the build logs:
```text
WARNING! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
```

### Technical Explanation:
- The `builds` array is part of **Vercel's legacy v2 build system** (pre-dating Vercel's modern Zero-Config and Build Output API).
- When Vercel encounters `"builds"` in `vercel.json`, it disables modern framework detection, ignores project dashboard build/output overrides, and executes only the explicit builder packages specified in `builds`.
- Because commit `1133d78` only listed `backend/dist/server.js` with `@vercel/node` inside `builds`, Vercel completely bypassed static asset detection and only deployed the single serverless function.
- **Solution:** Removing `builds` and `routes` in favor of modern top-level properties (`buildCommand`, `outputDirectory`, `functions`, and `rewrites`) restores modern framework handling, eliminates the warning, and enables Vercel to serve both the static Vite frontend and the serverless Express API.

---

## 3. Files Changed and Why

| File | Status | Technical Reason |
| :--- | :---: | :--- |
| `vercel.json` | **Modified** | Removed legacy `builds` and `routes`. Added `installCommand`, `buildCommand`, `outputDirectory: "frontend/dist"`, `functions: { "api/index.js": { "includeFiles": "backend/dist/**" } }`, and explicit rewrites for `/api/:path*`, `/uploads/:path*`, and `/((?!api/\|uploads/).*)` ➔ `/index.html`. |
| `package.json` | **New** | Created root package orchestrator so Vercel can run `npm run build` at root to compile both `backend` (`tsc`) and `frontend` (`vite build`). |
| `api/index.js` | **New** | Standard Vercel Serverless Function entrypoint exporting the Express app from `backend/dist/server.js` without calling `app.listen()`. |
| `backend/src/server.ts` | **Modified** | 1. Wrapped `startServer()` in `if (require.main === module)` to prevent persistent listeners in serverless execution.<br>2. Configured media uploads path to use `os.tmpdir()` (`/tmp/uploads`) in serverless environments. |
| `backend/src/middleware/upload.ts` | **Modified** | Updated Multer destination to use `os.tmpdir()` on Vercel and wrapped `fs.mkdirSync` in `try/catch` to avoid crashes on read-only serverless filesystems. |
| `backend/dist/server.js` | **Recompiled** | Emitted from TypeScript compiler reflecting serverless guard and temp directory. |
| `backend/dist/middleware/upload.js` | **Recompiled** | Emitted from TypeScript compiler reflecting serverless upload directory. |
| `.gitignore` | **Modified** | Added exclusions for `node_modules/`, `*/node_modules/`, `.env*`, and `.vercel/` to ensure clean Git state. |

---

## 4. Final Root `vercel.json` and Build Strategy

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "npm --prefix backend install && npm --prefix frontend install",
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "functions": {
    "api/index.js": {
      "includeFiles": "backend/dist/**"
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/uploads/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/((?!api/|uploads/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Build & Routing Strategy Explained:
1. **Dependency Installation:** `installCommand` installs the exact dependencies for both `backend` and `frontend` using their committed lockfiles without causing workspace conflicts.
2. **Unified Build:** `npm run build` triggers:
   - `npm --prefix backend run build` (compiles TypeScript to `backend/dist/`)
   - `npm --prefix frontend run build` (runs `tsc -b && vite build`, creating `frontend/dist/`)
3. **Static CDN Assets:** Vercel automatically deploys `frontend/dist` to its global CDN. Requests for `/`, `/assets/*`, `/silambam.ico`, and bundled `/uploads/*` are served directly by CDN with maximum performance.
4. **Backend API Routing (`/api/:path*`):** Any request matching `/api` or `/api/*` is routed to the serverless function `api/index.js`. Express receives the full URL (`/api/health`, `/api/public/settings`, etc.) and matches its routes without requiring prefix modification.
5. **SPA Routing Fallback (`/((?!api/|uploads/).*)`):** Any non-API route (such as `/about`, `/admin`, `/syllabus`, `/news/slug`) is rewritten to `/index.html` so React Router can handle client-side rendering upon page refresh.
6. **No API 404 Masking:** Unmatched `/api/...` requests are handled by Express and return JSON 404 errors, preventing the common bug where invalid API requests return HTML.

---

## 5. Actual Build and Test Results

All verification checks were run locally and succeeded:

| Check | Command / Operation | Result | Verified Output / Evidence |
| :--- | :--- | :---: | :--- |
| **Validate `vercel.json`** | Node.js `JSON.parse` | **PASS** | Valid JSON; all keys (`buildCommand`, `outputDirectory`, `functions`, `rewrites`) confirmed. |
| **Root Build** | `npm run build` | **PASS** | `backend` compiled via `tsc`; `frontend` compiled via `vite build` in 29.9s, generating `frontend/dist/`. |
| **Frontend Output** | Inspect `frontend/dist/index.html` | **PASS** | File exists (2,039 bytes) containing `<div id="root"></div>` and linked hashed JS/CSS assets. |
| **Serverless Entrypoint** | Inspect `api/index.js` export | **PASS** | `api/index.js` exports Express application function cleanly without starting background listeners. |
| **Local API Health** | Ephemeral server mounting `api/index.js` | **PASS** | `GET /api/health` returned HTTP 200: `{"status":"healthy","service":"Aadhiran Silambam API","version":"1.0.0"}`. |
| **Local DB Query** | `GET /api/public/settings` | **PASS** | HTTP 200 with `success: true` (safely queried TiDB). |
| **Backend Unit Tests** | `node --test test/audit-logger.test.cjs` | **PASS** | 2/2 tests passed (TAP 13). |
| **Backend Unit Tests** | `node --test test/db-compatibility.test.cjs` | **PASS** | 4/4 tests passed (TAP 13). |
| **Backend Unit Tests** | `node --test test/upload-security.test.cjs` | **PASS** | 5/5 tests passed (TAP 13). |
| **Live Deployed API** | `GET https://aadhiran-silambam.vercel.app/api/health` | **PASS** | HTTP 200 returned live from active Vercel deployment. |
| **Live Homepage (Pre-fix)**| `GET https://aadhiran-silambam.vercel.app/` | **FAIL (404)** | Confirmed 404 on current deployment prior to pushing this fix. |

---

## 6. Expected Deployed Frontend and Backend Paths

| Request Path | Handler | Expected Response |
| :--- | :--- | :--- |
| `/` | Vercel CDN (`frontend/dist/index.html`) | **HTTP 200** HTML — React Application Root |
| `/about`, `/admin`, `/lineage` | Vercel Rewrite ➔ `/index.html` | **HTTP 200** HTML — React Router renders page |
| `/assets/*` | Vercel CDN (`frontend/dist/assets/*`) | **HTTP 200** JS/CSS with immutable cache headers |
| `/api/health` | Vercel Function (`api/index.js`) | **HTTP 200** JSON: `{"status":"healthy",...}` |
| `/api/public/settings` | Vercel Function (`api/index.js`) | **HTTP 200** JSON: `{"success":true,...}` |
| `/api/nonexistent` | Vercel Function (`api/index.js`) | **HTTP 404** JSON from Express (never HTML) |
| `/uploads/existing.jpg` | Vercel CDN (`frontend/dist/uploads/*`) | **HTTP 200** static media |
| `/uploads/dynamic.jpg` | Vercel Function (`api/index.js`) | Express static media fallback |

---

## 7. Build and Dependency Warnings Review

1. **`npm warn Unknown env config "cache-dir"`:**
   - **Diagnosis:** Vercel's build environment automatically injects `npm_config_cache_dir=/vercel/.npm`. In modern npm versions (v10+), npm warns that `cache-dir` is not a recognized configuration name (it prefers `cache`).
   - **Impact:** Completely harmless warning generated by Vercel CLI's internal environment variable injection. It does not cause build failures or runtime issues.
2. **`npm warn deprecated multer@1.4.5-lts.2`:**
   - **Diagnosis:** Multer 1.x is in maintenance/deprecated status due to known stream parsing limitations.
   - **Security Evaluation:** In this codebase, file uploads are protected by `backend/src/middleware/uploadValidation.ts`, which validates magic-byte file signatures (`sniffMediaType`) and enforces strict file count (15) and size limits (100MB).
   - **Recommendation:** Do not use `npm audit fix --force`. A migration to Multer 2.x involves breaking API changes and should be addressed in a dedicated refactoring phase.

---

## 8. Exact Vercel Dashboard Settings

Ensure the Vercel project has the following configuration in **Settings > General**:

| Dashboard Setting | Required Value | Notes |
| :--- | :--- | :--- |
| **Root Directory** | `.` (or empty) | **Do not set to `backend` or `frontend`.** Must be repository root. |
| **Framework Preset** | `Other` (or Vite) | Overridden cleanly by root `vercel.json`. |
| **Build Command** | *Leave overridden by `vercel.json`* | Runs `npm run build`. |
| **Output Directory** | *Leave overridden by `vercel.json`* | Points to `frontend/dist`. |
| **Install Command** | *Leave overridden by `vercel.json`* | Runs `npm --prefix backend install && npm --prefix frontend install`. |
| **Node.js Version** | `20.x` | Verified compatible with all dependencies. |

---

## 9. Commands and Steps Required to Redeploy

Per the pair-programming safety guidelines, no changes have been committed, pushed, or deployed. When you approve, execute the following commands:

### Step 1: Review Local Status
```powershell
git status
```
Verify that only the deployment files are staged/modified:
- Modified: `.gitignore`, `vercel.json`, `backend/src/server.ts`, `backend/src/middleware/upload.ts`, `backend/dist/...`
- Untracked: `package.json`, `api/index.js`, `docs/VERCEL_404_FIX_REPORT.md`

### Step 2: Stage and Commit
```powershell
git add .gitignore package.json vercel.json api/index.js backend/src/ backend/dist/ docs/VERCEL_404_FIX_REPORT.md
git commit -m "fix(deployment): resolve homepage 404 by migrating from legacy builds to modern unified Vercel architecture"
```

### Step 3: Push to GitHub
```powershell
git push origin main
```

### Step 4: Verify Deployment on Vercel
1. Vercel will trigger a new build for the new commit.
2. In the build logs, observe:
   - No `Due to builds existing...` warning.
   - Dependencies install for both `backend` and `frontend`.
   - `npm run build` runs both `backend` (`tsc`) and `frontend` (`vite build`).
   - `Build Completed in /vercel/output`.
3. Open `https://aadhiran-silambam.vercel.app/` in your browser:
   - The React homepage will render with HTTP 200.
   - Test navigating to `/about` and refreshing — loads React Router with HTTP 200.
   - Test `https://aadhiran-silambam.vercel.app/api/health` — returns HTTP 200 JSON.

---

## 10. Remaining Risks and Unresolved Issues

1. **Vercel Project Dashboard Overrides:**
   - If the Vercel dashboard had manual overrides configured under **Settings > Build and Development Settings** (e.g., Output Directory manually set to something else), ensure the toggle switches in the dashboard are set to allow `vercel.json` to configure them, or set **Root Directory** to `.`.
2. **Database Allowlist:**
   - Ensure the TiDB Cloud allowlist permits `0.0.0.0/0` with TLS enforced so that Vercel's serverless function instances can query the database.
