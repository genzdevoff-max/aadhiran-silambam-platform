# Phase 3G — Admin Acceptance, Security Gaps & Final Non-Database Verification

**Status: Partially complete — not accepted for production or TiDB integration.**  
Database access, migrations, seeds, and schema changes were not performed.

## 1. Findings from Phase 3F

The Phase 3F report documented working admin load/error/empty states, route guards, public heritage styling, a JWT/CORS hardening pass, and 55 source-contract assertions. It also left live authenticated CRUD, field-by-field form accessibility, dirty in-app navigation, upload content validation, durable audit logging, and an authenticated admin browser sweep open. The public report recorded 23 route patterns checked at 375, 767, and 1280 CSS pixels, but did not establish live API persistence.

This continuation addresses upload signature checks, audit-event boundaries, general form interaction safeguards, route-level loading/error behavior, and bundle size. It does not claim the database-dependent or credential-dependent acceptance criteria are complete.

## 2. Files changed and reasons

### Phase 3G implementation

| File | Reason |
|---|---|
| `backend/src/middleware/uploadValidation.ts` | Defines allowed media types, signature sniffing, safe extension extraction, and validation errors. |
| `backend/src/middleware/upload.ts` | Uses generated UUID filenames, retains the 100 MiB / 15-file limits, and validates uploaded bytes before controller handling. |
| `backend/src/routes/adminRoutes.ts` | Keeps the authenticated router guard ahead of upload parsing and signature validation. |
| `backend/src/middleware/errorHandler.ts` | Returns safe upload errors and reports Multer rejections as HTTP 400 in structured logs. |
| `backend/src/services/auditLogger.ts` | Defines a timestamped event contract and redacts sensitive fields; remains in-memory and deliberately unwired. |
| `backend/test/upload-security.test.cjs` | Exercises file signatures, spoofing, extension mismatches, invalid formats, SVG rejection, limits, and upload route ordering over a local mocked HTTP server. |
| `backend/test/auth-middleware.test.cjs` | Tests missing/invalid/expired sessions and the `requireSuperAdmin` role gate without a database. |
| `backend/test/audit-logger.test.cjs` | Tests event shape and recursive sensitive-field redaction. |
| `backend/package.json` | Adds the `test:unit` script using the existing Node test runner; no dependency was added. |
| `frontend/src/pages/admin/AdminMedia.tsx` | Removes SVG from the chooser and client checks, includes the server-supported PDF format, and clarifies accepted types. |
| `frontend/src/services/api.ts` | Emits in-memory mutation activity events (no custom HTTP headers) so unrelated GET requests cannot clear a dirty form. |
| `frontend/src/components/layout/AdminLayout.tsx` | Adds programmatic labels/names where available, required-field semantics/indicators, live announcement roles, duplicate-submit protection, dirty-form navigation prompts, and dialog focus/keyboard handling. |
| `frontend/src/index.css` | Adds a visible required marker and retains admin interaction styles scoped to admin selectors. |
| `frontend/src/App.tsx` | Lazy-loads public/admin route screens and adds a safe render/chunk error boundary and loading fallback. |
| `backend/dist/` | Generated TypeScript output from the backend build; not hand-edited. |

Earlier Phase 3E/3F files remain changed in the worktree. They are not re-attributed to this Phase 3G continuation.

## 3. Admin route inventory

Routes and data dependencies below follow `frontend/src/App.tsx`, the admin API service, and existing backend route configuration. “API-backed” describes existing endpoint wiring only; it does **not** assert a successful live request or durable database persistence in this verification.

| Route / screen | Implementation and data source | Findings / changes in this phase | Responsive, accessibility, and verification status | Remaining blocker |
|---|---|---|---|---|
| `/admin/login` — Admin login | Existing auth API (`POST /api/auth/login`); client session uses local storage. | Lazy-loaded; safe route-level fallback. | Browser-rendered; named email/password fields and password-visibility action visible. Unauthenticated redirect checked. No credentials submitted. | Successful and failed login against a disposable backend are unverified. |
| `/admin` — Workspace index | Redirects to `/admin/dashboard`. | Route preserved and lazy route handling retained. | Source/route assertion. | None specific; authenticated navigation not exercised. |
| `/admin/dashboard` — Dashboard | Existing dashboard and enquiry APIs. | Phase 3F load errors remain distinct from zero metrics; screen is now lazy-loaded. | Unauthenticated direct visit redirected to login; authenticated screen not rendered. | Metrics, retry, and status mutation require authenticated API. |
| `/admin/syllabus` — Syllabus | Existing syllabus list/create/update/delete API. | Existing Phase 3F loading, error/retry, empty state, dialog support retained; lazy-loaded. | Static checks; no authenticated dialog/browser test. | CRUD and form accessibility need authenticated tests. |
| `/admin/instructors` — Instructors & Masters | Existing instructor CRUD API. | Existing API error/empty states retained; lazy-loaded. | Static checks only. | CRUD, validation, and dialog keyboard behavior not browser-tested. |
| `/admin/achievements` — Achievements & Awards | Existing achievement CRUD API. | Existing API error/empty states retained; lazy-loaded. | Static checks only. | CRUD and validation not live-tested. |
| `/admin/events` — Events & Competitions | Existing event CRUD API. | Existing API error/empty states retained; lazy-loaded. | Static checks only. | CRUD and validation not live-tested. |
| `/admin/news` — News & Blog Articles | Existing news CRUD API and client-side search. | Existing error/empty/filter states retained; lazy-loaded. | Static checks only. | CRUD/search and long-content behavior not browser-tested. |
| `/admin/heritage` — Heritage Projects | Existing heritage CRUD API and client-side search. | Existing error/empty/filter states retained; lazy-loaded. | Static checks only. | CRUD/search not live-tested. |
| `/admin/partners` — Partners & Press | Existing partner/press CRUD API and client-side filters. | Existing error/empty/filter states retained; lazy-loaded. | Static checks only. | CRUD/filter behavior not live-tested. |
| `/admin/media` — Media Asset Library | Existing media list/upload/metadata/reference/delete APIs. | Server verifies signatures and the client no longer offers SVG; PDF is included. Existing reference/deletion safeguards remain. | Upload middleware has local HTTP tests; authenticated UI and real reference/deletion behavior not tested. | Live storage, reference integrity, and full-media decoding are unverified. |
| `/admin/albums` — Photo Albums | Existing album CRUD API and client-side search. | Existing load/error/empty states retained; lazy-loaded. | Static checks only. | CRUD/search not live-tested. |
| `/admin/enquiries` — Contact & Join Enquiries | Existing enquiry list/status/delete API. | Existing request error/empty states retained; lazy-loaded. | Static checks only. | Requires backend data and an authenticated session. |
| `/admin/users` — Users & Roles | Existing `/api/auth/users` operations; frontend super-admin route guard; backend requires `requireSuperAdmin`. | Lazy-loaded; backend role guard independently tested for editor denial and super-admin allowance. | Browser confirmed unauthenticated redirect, not role-specific page rendering. | User create/update/activation/delete and full token-to-role path remain untested against a backend. |
| `/admin/sections` — Homepage Sections & Hero | Existing settings/section update APIs. | Lazy-loaded; unsaved-form tracking and mutation-aware submission feedback added in the shared shell. | Source inspection only. | Multi-key saves and persistence need authenticated API tests. |
| `/admin/settings` — Site Settings, SEO & Account Security | Existing settings and password-change APIs. | Lazy-loaded; shared dirty-form/navigation guard and duplicate-submit handling added. | Source inspection only; no password form submission or in-app discard prompt browser test. | Save failures, password validation, and successful password change require an authenticated non-production backend. |
| `/admin/*` — Admin not found | Nested admin wildcard route. | Preserved under the protected shell and lazy route boundary. | Source route assertion only. | Authenticated rendering not exercised. |
| Session loading / 401 / 403 / render failure | Auth context, admin request state, and route-level boundary. | Added lazy-load fallback and generic render-error boundary; existing request state distinguishes unauthorized and forbidden responses. | Unauthenticated redirect and backend middleware 401/403 unit cases verified; React render-error screen not deliberately forced. | Authenticated browser behavior and screen-reader testing remain open. |

### Form and dialog acceptance

The shared admin shell now links unassociated controls to nearby visible labels where the form structure permits it, gives otherwise unnamed controls an accessible fallback name, reflects native `required` state programmatically and visually, and marks existing success/error banners as live status/alert regions. It also disables submit buttons while a mutation is pending, restores them afterward, and preserves dirty values when the mutation fails. Escape and close-button handling ask before discarding a dirty dialog; focus is moved into dialogs, trapped while open, and restored on close. Dirty forms prompt before same-origin route links, browser Back/Forward, and document unload.

These are shared DOM-level safeguards, not a completed field-by-field audit. Custom validation messages are not consistently associated with individual controls, and the guards have not been verified with keyboard-only or assistive-technology testing across every form. Forms with unusual markup or multi-step mutation behavior need explicit browser coverage before acceptance.

## 4. Upload security

- Supported formats are JPEG, PNG, WebP, GIF, MP4, WebM, and PDF. SVG is rejected rather than rendered or sanitized.
- The server verifies the file signature and checks that detected type, extension, and client-declared MIME agree. The client chooser/validation now matches the supported set.
- File names stored on disk are generated UUIDs with a validated extension; the original path/name is not used as a storage path.
- Limits remain 100 MiB per file and 15 files per request. The UI retains its stricter 10 MiB per-file limit.
- The upload route sits behind the admin authentication middleware before Multer parses the upload.
- Error responses avoid echoing file names or raw parser details; the error handler does not log file contents or credentials.
- Signature checks inspect the leading bytes only. They are not full image/video/PDF decoding, malware scanning, or polyglot-content detection; production policy may require deeper validation.

`backend npm run test:unit` passed upload tests for valid signature-matched files, MIME spoofing, extension mismatch, invalid signatures, SVG and unsupported extensions, size/count limits, and route guard ordering. These tests use a local Express HTTP server and temporary upload files, not the production API or storage.

## 5. Audit logging and security findings

The audit event shape includes actor ID, action, resource type, optional resource ID, timestamp, and safe metadata. Sensitive keys and nested sensitive values are redacted by the logger; the current tests cover secret and personal-identifier redaction. The buffer is bounded and in-memory only.

Source inspection found **no mutation-controller call sites** for `AuditLogger.log`. Existing mutations include content create/update/delete, media upload/update/delete, section/settings updates, enquiry status/delete, user create/role/activation/delete, and password change. Therefore the logger does not currently provide mutation coverage, and no persistent audit trail is claimed. The database phase must wire each mutation after successful authorization and persistence, write actor/resource/action/timestamp plus minimized redacted metadata to durable storage, and define retention and privileged read access.

Existing backend route configuration independently guards admin routes with authentication and user-management endpoints with super-admin authorization. New unit checks confirm missing, invalid, and expired tokens return 401 without database access, and the role gate returns 403 to an editor and allows a super-admin in an isolated middleware test. The valid-token-to-database-user lookup and authorization behavior against real user records were not exercised.

The frontend still stores the bearer token in local storage. This remains exposed to script execution in an XSS event; do not treat the route guard or source-visible token as durable security. A coordinated production design should evaluate secure, HttpOnly, SameSite cookies and CSRF controls, while retaining the existing API contract until a tested migration is approved. No risky token-storage redesign was attempted.

## 6. Authenticated workflow test coverage

No frontend component-test, browser-test, or mock-service-worker framework is installed. No credentials or non-production backend session were available. Coverage is consequently separated as follows:

| Workflow | Result |
|---|---|
| Missing, malformed, and expired bearer session | **Unit/mocked HTTP:** 401 responses verified. |
| Editor versus super-admin route permission | **Unit/mocked HTTP:** isolated `requireSuperAdmin` guard denies editor and allows super-admin; full auth-to-user-record path not tested. |
| Valid login, failed login, password change | **Not tested against API.** Generic login behavior is source-inspected; no credentials were fabricated. |
| User create, role change, activation, deletion | **Not tested against API.** Source contract and route guard only. |
| CRUD success, validation, server error, successful empty list | **Static/source assertions only** for current list state implementation; no mock API UI suite or live API. |
| Settings/section failures and retry | **Static/source inspection only.** |
| Media upload | **Local middleware HTTP tests** verify security behavior; not a full application/controller/storage integration. |
| Media reference checks and safe deletion | **Static/source assertions only.** |
| Failed mutation data preservation / retry | **Shared form behavior source-inspected; no UI/API interaction test.** |
| Keyboard, focus, dirty-navigation, screen-reader workflows | **Not fully tested.** Browser snapshots do not substitute for keyboard-only or assistive-technology acceptance. |

The existing `frontend/test-integration.cjs` suite remains 55 static source-contract assertions and passes. It is not an integration test suite despite its filename.

## 7. Performance, loading, and error handling

All public and admin page components are lazy-loaded. A `Suspense` fallback covers route chunks, and an error boundary shows a generic reload action without exposing exception details. This does not catch asynchronous event-handler/network failures; those remain handled by the existing API/form paths.

Before route splitting, the frontend entry bundle was 760.31 kB raw / 178.63 kB gzip and exceeded Vite's 500 kB warning threshold. After splitting, the largest entry chunk is 379.94 kB raw / 117.76 kB gzip; the build no longer emits that warning. The largest page chunks are Home (27.04 kB), About (24.99 kB), and Admin Settings (23.54 kB), before gzip. Vite did not emit module-level contributor attribution, so no more specific dependency claim is made.

Frontend lint exits successfully with 18 existing warnings: React state updates in effects, render-time `Date` calls, and fast-refresh mixed exports. No warnings were suppressed; those unrelated cleanup items remain open.

## 8. Public website regression

No public theme redesign was repeated. Existing logo, Tamil/English content, routes, and local media were retained. The public theme remains scoped under public selectors, and admin focus/required-field styles are scoped to admin selectors.

- **Current browser render:** homepage was inspected after route splitting; the hero photograph and logo rendered, and the observed image elements reported zero broken images.
- **Current responsive smoke check:** requested browser widths mapped to measured CSS layout widths of 367, 760, and 1272 px in the integrated browser; no document horizontal overflow and zero broken images were observed. Because those effective widths differ from requested values, this is not recorded as an exact 375/767/1280 check.
- **Prior Phase 3F evidence:** 23 public route patterns were reported checked at 375, 767, and 1280 CSS px, with no horizontal overflow; public mobile navigation keyboard Enter/Escape behavior was also reported. Those results are carried forward from the Phase 3F report, not rerun here.
- **Admin browser check:** direct unauthenticated navigation to `/admin/dashboard` redirected to `/admin/login`; the login screen rendered. No authenticated screen or mutation was visually tested.
- No screenshot files were committed or retained. Browser inspection is visual evidence for the rendered homepage/login only, not a complete public-route or admin screenshot suite.

## 9. Commands and actual outcomes

| Command / check | Actual result |
|---|---|
| `frontend`: `npm run build` | **Passed.** TypeScript and production Vite build; largest entry chunk 379.94 kB, no >500 kB warning. |
| `frontend`: `npm run lint` | **Exit 0.** 18 warnings remain; no lint errors. |
| `backend`: `npm run test:unit` | **Passed, 9/9 tests.** Includes backend TypeScript build, audit unit tests, auth middleware HTTP tests, and upload middleware HTTP tests. |
| Repository root: `node frontend/test-integration.cjs` | **Passed, 55/55.** Static source-contract assertions only. |
| `git diff --check` | **Not clean:** reports one extra blank line at EOF in the pre-existing modified `frontend/src/types/index.ts`; that unrelated file was not changed in this continuation. |
| Browser: public homepage | **Rendered and inspected.** No broken images; responsive smoke check had no document overflow at measured 367/760/1272 CSS px. |
| Browser: unauthenticated `/admin/dashboard` | **Passed.** Redirected to `/admin/login`. |
| Live API or database tests | **Not run.** No backend/database connection, test credentials, or disposable environment was available. |

No database query, migration, seed, schema edit, credential change, or connection was performed. No new frontend testing dependency was installed.

## 10. Known issues and open acceptance criteria

1. Add a frontend test harness or a suitably isolated browser/API mock suite for login, roles, CRUD, failed saves, retry, media references, and password changes. Keep mock tests separate from live integration tests.
2. Exercise every authenticated route as editor and super-admin in a disposable environment, including direct API calls and 401 versus 403 behavior.
3. Field-audit all admin controls and validation errors; verify required indicators, `aria-describedby`, error announcements, keyboard-only access, visible focus, dialog focus restoration, Escape, and discard prompts with browser/assistive-technology tests.
4. Test dirty navigation and mutation state on complex forms (especially sections/settings with multiple requests) and verify retry preserves entered data.
5. Run full API/controller CRUD, login, password, media reference/deletion, and upload tests using isolated fixtures against a non-production backend.
6. Implement and test durable mutation-linked audit logging with retention and access policy in the database phase. The current logger is not wired and is not persistent.
7. Decide whether signature checking is sufficient for deployment or add full decoding/scanning, with explicit resource and storage policies.
8. Reassess local-storage token risk with the production security design; do not change storage without coordinated CSRF/session testing.
9. Resolve or explicitly accept the 18 lint warnings and verify browser dimensions exactly at required CSS widths in a stable browser configuration.
10. The logged 401/403 middleware unit tests and source assertions do not prove backend access to a database user record or actual editor/super-admin data isolation.

## 11. TiDB readiness recommendation

**Recommendation: defer TiDB integration.** This phase makes useful non-database progress, but acceptance remains blocked by missing live authorization/CRUD coverage, unverified authenticated form workflows, unwired durable audit logging, and unresolved accessibility/security acceptance criteria. Proceed only after those non-database controls are tested in a disposable environment and the database phase separately defines schema, audit retention, and migration controls. No database work was performed in Phase 3G.
