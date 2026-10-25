# Phase 5A — Process and Environment Verification Report

**Status:** Complete  
**Date:** 2026-10-24  
**Active Database:** TiDB Cloud `aadhiran`  
**Backend Port:** `5000` (PID 18140 via nodemon PID 17980)  
**Frontend Dev Port:** `5174` (PID 6728, proxying `/api` and `/uploads` to `http://localhost:5000`)  
**Health Check Endpoint:** `http://localhost:5000/api/health` and `http://localhost:5174/api/health` (both `healthy`)

---

## 1. Port 5000 Investigation & Safe Read-Only Diagnostics

Initial state inspection was performed using Windows PowerShell TCP connection queries and WMI process inspection:
- `Get-NetTCPConnection -LocalPort 5000` confirmed that no foreign or unrelated process (`ecshopping` or `lonetracker`) was occupying port 5000.
- A scan of all running processes (`Get-CimInstance Win32_Process`) confirmed that no processes with command lines relating to `ecshopping` or `lonetracker` exist on the system.
- The Aadhiran backend dev supervisor (`nodemon`, PID 17980, parent PID 11228) was running under `npm run dev` (PID 18288).
- Root cause of earlier port conflict report: During Phase 4, port 5000 was temporarily held by a prior process, causing the initial `ts-node src/server.ts` child to exit with `EADDRINUSE`. Because `nodemon` remains active in a crash-and-wait state until files are touched, it was idling awaiting a trigger.
- Resolution: Touching the backend entrypoint triggered `nodemon` to re-execute `ts-node src/server.ts` cleanly. The backend bound to port 5000 without requiring process termination or port remapping.

---

## 2. Aadhiran Backend Identification

| Metric | Value |
|---|---|
| Process ID | `18140` (`node.exe`), child of `ts-node` (PID 6552) managed by `nodemon` (PID 17980) |
| Listening Interface | `::` (IPv6 & IPv4 loopback) |
| Port | `5000` |
| Working Directory | `E:\aadhiran-silambam-platform\backend` |
| Environment | `development` (`NODE_ENV=development`, configurable via `.env`) |
| Health Endpoint | `http://localhost:5000/api/health` |
| Health Response | `{"status":"healthy","service":"Aadhiran Silambam API","version":"1.0.0"}` |
| Frontend Proxy Target | `http://localhost:5000` configured in `frontend/vite.config.ts` |
| Frontend Health Proxy | Verified: `http://localhost:5174/api/health` returns `200 OK` |

---

## 3. Database Connectivity and Active Schema Verification

1. **Direct TiDB Check:**  
   Ran `npm run db:check`:
   ```text
   ✓ TiDB connected successfully
   ```
2. **Schema Verification (`npm run db:verify`):**  
   - Active database verified: `aadhiran`.
   - 16 tables verified: `achievements` (5), `albums` (4), `audit_logs` (0), `contact_messages` (0), `enquiries` (2), `events` (3), `heritage_projects` (3), `instructors` (5), `media_assets` (19), `media_references` (0), `news_articles` (3), `partners_press` (4), `schema_migrations` (4), `site_settings` (4), `syllabus_stages` (10), `users` (1).
   - 157 columns, 35 indexes, 4 enforced foreign keys, and 4 versioned migrations.
3. **API Integration Verification:**  
   Ran the complete test harness `backend/test/phase4c-api-integration.cjs` against `http://127.0.0.1:5000/api`:
   ```text
   Testing http://127.0.0.1:5000/api against database aadhiran
   RESULT 135/135 checks passed.
   ```
   All CRUD operations, public endpoints, and authentication requests reach the designated Aadhiran backend and operate against the active `aadhiran` TiDB schema.

---

## 4. Conflict Resolution Summary

- **Root Cause:** Stale crash-wait state in `nodemon` after previous port release.
- **Action Taken:** Safe reload without killing external processes or exposing credentials.
- **Verification:** Both backend direct port (5000) and frontend reverse proxy (5174 -> 5000) operate reliably.
