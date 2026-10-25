# Phase 4C–4E — API, Admin Screen, and Final Acceptance Report

**Status:** API integration and schema acceptance passed. Admin screens are API-wired and build cleanly. Browser-level interaction automation was not available and is reported as a limitation, not as a pass.
**Date:** 2026-10-23
**Database:** TiDB Cloud, active database `aadhiran`
**Backend test port:** `5055` (port `5000` was already occupied by an unrelated process)

No database passwords, JWT secrets, admin passwords, or other credentials are included in this report.

## 1. Phase 4C — Backend APIs against real tables

### 1.1 Test harness

- File: `backend/test/phase4c-api-integration.cjs`
- Method: real HTTP requests against the built server, plus direct TiDB assertions through the backend query layer.
- All test records were created with unique suffixes, then deleted.
- Direct database assertions used parameterised `$1` queries resolved by the project compatibility layer.

### 1.2 Result

```text
RESULT 135/135 checks passed.
```

The harness covered:

| Area | Verified |
|---|---|
| Connectivity | Test process and API both resolve `DATABASE()` to `aadhiran` |
| Authentication | Super-admin login, token issuance, `/auth/me`, unauthenticated `/admin/*` returns 401 |
| Public reads | `/home`, `/about`, `/lineage`, `/syllabus`, `/instructors`, `/achievements`, `/events`, `/albums`, `/photos`, `/videos`, `/news`, `/heritage`, `/partners-press`, `/settings` |
| Admin reads | Dashboard, syllabus, instructors, achievements, events, news, heritage, partners, albums, media, enquiries |
| Syllabus CRUD | Create → direct TiDB read → update → list readback → delete → direct TiDB absence |
| Instructors CRUD | Create, update, list persistence, delete |
| Achievements CRUD | Create with JSON `supporting_images` round-trip, update, delete |
| Events CRUD | Create, direct TiDB read, public slug readback, update readback, delete |
| News CRUD | Create, direct TiDB read, public slug readback, update direct DB verification, delete |
| Heritage CRUD | Create, public slug readback, delete |
| Partners/Press CRUD | Create, update direct DB verification, delete |
| Albums CRUD | Create, update direct DB verification, delete |
| Media | Real multipart PNG upload, TiDB persistence, metadata update, filtered list readback, force delete, physical file cleanup |
| Enquiries | Public contact write, admin list readback, status update, delete; public join write verified directly in TiDB, then deleted |
| Site settings | Read `general`, write it back through `/admin/sections/general`, re-read and compare |
| Admin users | Create editor, list readback, update name/active state verified directly in TiDB, delete |
| Cleanup | Post-run row counts restored to the pre-test baseline; no `phase4c` rows or upload files remained |

### 1.3 Persistence evidence

After the full run, the database returned to its original application counts:

| Table | Rows after tests |
|---|---:|
| achievements | 5 |
| albums | 4 |
| enquiries | 2 |
| events | 3 |
| heritage_projects | 3 |
| instructors | 5 |
| media_assets | 19 |
| news_articles | 3 |
| partners_press | 4 |
| site_settings | 4 |
| syllabus_stages | 10 |
| users | 1 |

## 2. Phase 4D — Admin screens

### 2.1 Screen-to-API matrix

All existing admin screens use the shared `frontend/src/services/api.ts` client. No screen was found using fixture data instead of the API.

| Screen | Route | API usage | Loading / error / empty / success states |
|---|---|---|---|
| Login | `/admin/login` | `POST /auth/login` | Submitting state, credential error, success redirect |
| Dashboard | `/admin/dashboard` | `GET /admin/dashboard`, `PUT /admin/enquiries/:id` | Loading, retryable load error, action error, zero-safe stats |
| Syllabus | `/admin/syllabus` | `GET/POST/PUT/DELETE /admin/syllabus` | Loading, API error + retry, empty, success banner |
| Instructors | `/admin/instructors` | `GET/POST/PUT/DELETE /admin/instructors` | Loading, API error + retry, empty, success banner |
| Achievements | `/admin/achievements` | `GET/POST/PUT/DELETE /admin/achievements` | Loading, API error + retry, empty, success banner |
| Events | `/admin/events` | `GET/POST/PUT/DELETE /admin/events` | Loading, API error + retry, empty, success banner |
| News | `/admin/news` | `GET/POST/PUT/DELETE /admin/news` | Loading, API error + retry, empty and filtered-empty, success banner |
| Heritage | `/admin/heritage` | `GET/POST/PUT/DELETE /admin/heritage` | Loading, API error + retry, empty and filtered-empty, success banner |
| Partners & Press | `/admin/partners` | `GET/POST/PUT/DELETE /admin/partners` | Loading, API error + retry, empty and filtered-empty, success banner |
| Media | `/admin/media` | List, upload, update, references, delete | Loading, retryable error, empty and filtered-empty, upload/edit/delete feedback |
| Albums | `/admin/albums` | `GET/POST/PUT/DELETE /admin/albums` | Loading, API error + retry, empty and filtered-empty, success banner |
| Enquiries | `/admin/enquiries` | List, status update, delete | Loading, API error + retry, table empty state, status/delete feedback |
| Admin users | `/admin/users` | `/auth/users` CRUD | Loading, retryable error, empty, create/update/delete feedback, super-admin guard |
| Sections | `/admin/sections` | `GET /public/settings`, `PUT /admin/sections/:key` | Loading, load warning, save error, success, dirty state |
| Settings | `/admin/settings` | `GET /public/settings`, `PUT /admin/sections/general`, password change | Loading, load warning, validation error, save error, success, dirty state |
| Admin not found | `/admin/*` | — | Dedicated 404 with dashboard link |

### 2.2 Fix applied during 4D

`frontend/src/pages/admin/AdminSettings.tsx` previously expected social links only at `general.socials.*`, while the live `site_settings.general` row stores them as top-level `facebook`, `instagram`, `youtube`, and `twitter` fields. The screen now:

- reads nested or legacy flat social fields,
- writes both the nested `socials` object and legacy flat fields to preserve compatibility.

### 2.3 Verification performed

| Check | Result |
|---|---|
| Frontend TypeScript + Vite production build | Passed — 2035 modules transformed |
| Existing frontend integration assertions (`frontend/test-integration.cjs`) | Passed — 55/55 |
| Admin API CRUD and persistence | Passed through the 135-check Phase 4C harness |
| Admin source state coverage | Confirmed for loading, error/retry, empty, success, and persistence-by-refetch |
| Frontend lint | 0 errors; 18 warnings (React purity / set-state-in-effect / fast-refresh warnings already present) |

### 2.4 Explicit limitation

A real browser automation tool (Playwright/Puppeteer) is not installed in this workspace. Admin screens were therefore verified by source inspection, production build, static integration assertions, and live API CRUD/persistence tests, **not** by scripted browser clicks or screenshots. No browser-level success is claimed.

## 3. Phase 4E — Integration checks

| Check | Command | Result |
|---|---|---|
| Backend TypeScript build | `npm run build` (backend) | Passed |
| Database connectivity | `npm run db:check` | Passed — TiDB connected |
| Migration idempotency | `npm run migrate` (twice) | First run applied 4 migrations; second run skipped all 4 |
| Schema verification | `npm run db:verify` | 16 tables, 157 columns, 35 distinct indexes, 4 foreign keys, 4 migrations |
| FK enforcement probe | transactional insert with invalid parent | Rejected with `ER_NO_REFERENCED_ROW_2`; rollback left 0 rows |
| Live API/CRUD integration | `node test/phase4c-api-integration.cjs` | 135/135 checks passed |
| Destructive seed guard | `npm run seed` with existing content | Refused as intended; data unchanged |
| Frontend production build | `npm run build` (frontend) | Passed |
| Frontend integration assertions | `node test-integration.cjs` | 55/55 passed |
| Test residue | Direct table counts and upload directory scan | None remaining |

## 4. Resolved issues

1. TiDB-incompatible DDL removed: `TEXT`/`JSON` literal defaults, reserved `key`, `CREATE INDEX IF NOT EXISTS`.
2. PostgreSQL-only SQL handled through the compatibility layer: `RETURNING`, `ILIKE`, `::int`.
3. Versioned migration history introduced with an `aadhiran`-only guard.
4. Destructive seeding now requires explicit opt-in after content exists.
5. Admin settings social fields normalised between legacy flat storage and the nested UI model.
6. Real multipart upload, metadata update, reference-aware delete, and physical file cleanup verified live.

## 5. Unresolved issues and scope boundaries

1. **Port 5000 conflict:** an unrelated `node` process (reported earlier as holding `ecshopping` state) was listening on port 5000 throughout this phase. Backend tests used port 5055. The frontend dev proxy still targets `http://localhost:5000`, so the unrelated process must be stopped before running `npm run dev` with this backend on the default port. No attempt was made to connect to or modify `ecshopping`.
2. **Public pages remain static:** the existing public pages intentionally continue to use local fixtures/design assets, preserving the current public website as instructed. Public API endpoints are live and return real TiDB data, but the public React pages were not rewired to them in this phase. Admin CRUD therefore persists to TiDB, but public page content will not reflect admin edits until a separate public-page API integration phase is approved.
3. **No browser automation:** authenticated visual states, focus behaviour, and real click-through CRUD were not executed in a browser due to missing tooling.
4. **Legacy table:** `contact_messages` remains untouched and unmanaged by migrations.
5. **Redundant indexes:** three duplicate-supporting indexes remain from the earlier bootstrap run. They are harmless; new migrations no longer create them.

## 6. Evidence files

- `docs/PHASE_4B_TIDB_SCHEMA_REPORT.md`
- `backend/src/db/migrate.ts`
- `backend/src/db/verify.ts`
- `backend/src/db/migrations/001_users_audit.ts`
- `backend/src/db/migrations/002_content.ts`
- `backend/src/db/migrations/003_media.ts`
- `backend/src/db/migrations/004_settings_enquiries.ts`
- `backend/test/phase4c-api-integration.cjs`
- `frontend/test-integration.cjs`
- `frontend/src/services/api.ts`
