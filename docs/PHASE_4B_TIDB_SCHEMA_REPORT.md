# Phase 4B — TiDB Schema and Table Creation Report

**Status:** Complete — versioned migrations applied and verified against the live `aadhiran` database.
**Date:** 2026-10-23
**Database:** TiDB Cloud (MySQL protocol)
**Active database:** `aadhiran` (`SELECT DATABASE()` → `aadhiran`)

No credentials, passwords, or secret values are reproduced in this report.

## 1. Driver and dialect confirmation

- Backend driver: `mysql2/promise` (`backend/src/config/db.ts`).
- Dialect: MySQL-compatible TiDB Cloud.
- The previous PostgreSQL (`pg`) driver and `$N`/`RETURNING`/`ILIKE` assumptions were already replaced by a compatibility layer before this phase. Phase 4B verified and completed that conversion.
- Active-database guard added to the migration runner:
  - `backend/src/db/migrate.ts` refuses to run unless `SELECT DATABASE()` returns exactly `aadhiran`.
  - `backend/src/db/verify.ts` applies the same guard before inspecting the schema.
  - `backend/src/db/seed.ts` now refuses to run against any other database and refuses destructive reseeding unless `SEED_ALLOW_DESTRUCTIVE=true` is explicitly set.

## 2. Pre-migration inspection

Existing objects were inspected before applying anything. The following tables already existed and contained data:

| Table | Rows before migration |
|---|---:|
| achievements | 5 |
| albums | 4 |
| audit_logs | 0 |
| contact_messages | 0 |
| enquiries | 2 |
| events | 3 |
| heritage_projects | 3 |
| instructors | 5 |
| media_assets | 19 |
| media_references | 0 |
| news_articles | 3 |
| partners_press | 4 |
| site_settings | 4 |
| syllabus_stages | 10 |
| users | 1 |

`contact_messages` is a legacy table that is not referenced by the current application or migrations. It was left untouched.

## 3. Versioned migration files

| File | Migration ID | Tables / objects |
|---|---|---|
| `backend/src/db/migrations/001_users_audit.ts` | `001_users_audit` | `users`, `audit_logs`, `fk_audit_user` |
| `backend/src/db/migrations/002_content.ts` | `002_content` | `syllabus_stages`, `instructors`, `achievements`, `events`, `news_articles`, `heritage_projects`, `partners_press`, status/date indexes, `fk_news_author` |
| `backend/src/db/migrations/003_media.ts` | `003_media` | `albums`, `media_assets`, `media_references`, media lookup index, `fk_media_album`, `fk_media_reference_asset` |
| `backend/src/db/migrations/004_settings_enquiries.ts` | `004_settings_enquiries` | `site_settings`, `enquiries`, enquiry status/type indexes |
| `backend/src/db/migrations/schemaUtils.ts` | — | shared `CREATE TABLE` / index-existence helpers |
| `backend/src/db/migrations/index.ts` | — | ordered migration registry |

The runner creates `schema_migrations (id, name, applied_at)` and records each migration exactly once.

## 4. Application result

```text
Active database verified: aadhiran
--- Starting Database Migrations for Aadhiran Silambam ---
✓ Applied 001_users_audit
✓ Applied 002_content
✓ Applied 003_media
✓ Applied 004_settings_enquiries
✓ All migrations applied successfully!
```

Re-running `npm run migrate` confirms idempotency:

```text
↷ Skipped 001_users_audit — already applied.
↷ Skipped 002_content — already applied.
↷ Skipped 003_media — already applied.
↷ Skipped 004_settings_enquiries — already applied.
✓ All migrations applied successfully!
```

No `DROP`, `TRUNCATE`, reset, or destructive reseed was executed during Phase 4B.

## 5. Live verification results

Verification command: `npm run db:verify` (`backend/src/db/verify.ts`).

**Summary**

| Metric | Result |
|---|---:|
| Tables in `aadhiran` | 16 |
| Columns | 157 |
| Distinct indexes | 35 |
| Foreign keys reported | 4 |
| Applied migrations | 4 |

**Tables and row counts after migration**

| Table | Rows |
|---|---:|
| achievements | 5 |
| albums | 4 |
| audit_logs | 0 |
| contact_messages | 0 |
| enquiries | 2 |
| events | 3 |
| heritage_projects | 3 |
| instructors | 5 |
| media_assets | 19 |
| media_references | 0 |
| news_articles | 3 |
| partners_press | 4 |
| schema_migrations | 4 |
| site_settings | 4 |
| syllabus_stages | 10 |
| users | 1 |

Row counts match the pre-migration inspection for every existing application table. Data preservation was confirmed.

**Primary keys and unique constraints**

- UUID `CHAR(36)` primary keys with `DEFAULT (UUID())` on all content tables.
- Unique constraints: `users.email`, `albums.slug`, `events.slug`, `news_articles.slug`, `heritage_projects.slug`, `syllabus_stages.stage_number`, `site_settings.key`.
- JSON fields: `achievements.supporting_images`, `audit_logs.details`, `site_settings.value`.
- Boolean fields are stored as `tinyint(1)` per MySQL/TiDB convention.

**Foreign keys reported by `information_schema`**

| Child | Parent | On delete |
|---|---|---|
| `audit_logs.user_id` | `users.id` | `SET NULL` |
| `media_assets.album_id` | `albums.id` | `SET NULL` |
| `media_references.media_id` | `media_assets.id` | `CASCADE` |
| `news_articles.author_id` | `users.id` | `SET NULL` |

A transactional probe attempting to insert `media_assets` with a non-existent `album_id` was rejected with `ER_NO_REFERENCED_ROW_2`, and the transaction was rolled back. Foreign-key enforcement is therefore active on this TiDB deployment, with zero rows left behind.

**Migration history**

| ID | Name | Applied |
|---|---|---|
| `001_users_audit` | Users and audit logging | 2026-10-23 22:30:34 |
| `002_content` | Syllabus, instructors, achievements, events, news, heritage and press | 2026-10-23 22:30:35 |
| `003_media` | Albums, media assets and media references | 2026-10-23 22:30:35 |
| `004_settings_enquiries` | Site settings and enquiries | 2026-10-23 22:30:36 |

## 6. TiDB / MySQL compatibility issues found and fixed

| Issue | Resolution |
|---|---|
| `TEXT` columns cannot have literal defaults (`caption TEXT DEFAULT ('')`, `admin_notes TEXT DEFAULT ('')`) | Removed invalid defaults; columns are nullable. |
| Expression default on `JSON` (`JSON DEFAULT (JSON_ARRAY())`) was rejected | Removed the default; JSON columns are nullable. |
| `key` is a reserved word | Backticked `key` and `value` in `site_settings` DDL and all application queries. |
| `CREATE INDEX IF NOT EXISTS` is not supported | Replaced with an `information_schema.statistics` existence check before `CREATE INDEX`. |
| Prepared `?` placeholders in `information_schema` queries produced `syntax error, unexpected '?'` | Index verification uses trusted literal names for `information_schema` lookups. |
| PostgreSQL `RETURNING` is unsupported | `backend/src/config/db.ts` emulates it by generating the UUID client-side and selecting the inserted/updated row. |
| PostgreSQL `ILIKE` and `::int` casts | Compatibility layer rewrites `ILIKE` to `LOWER(...) LIKE LOWER(...)` and strips `::int`. |
| Application queries used native `?` placeholders against the `$N` compatibility layer | Live tests now use `$N`; the application layer consistently uses `$N` and rewrites to `?`. |

## 7. TiDB limitations and unresolved items

1. **Legacy table outside version control:** `contact_messages` exists in the live database but is not used by the application and has no migration. It was preserved. No data was moved or deleted.
2. **Redundant indexes already present:** `media_assets.idx_media_album` duplicates the FK index, `media_references.idx_media_ref_media` duplicates its FK index, and `news_articles.idx_news_slug` duplicates the unique slug index. New migration code no longer creates these redundant indexes. They are harmless and were left in place to avoid an unnecessary schema change.
3. **Database selection is environment-dependent:** migrations and seeding hard-stop unless the active database is `aadhiran`. A misconfigured `DATABASE_URL`/`DB_NAME` will fail safely rather than touch `ecshopping` or `lonetracker`.
4. **Seed safety:** `npm run seed` now refuses to overwrite existing content unless `SEED_ALLOW_DESTRUCTIVE=true` is set. This is intentional.

## 8. Reproduction commands

```powershell
cd backend
npm run db:check     # connectivity
npm run migrate      # applies only missing versions
npm run db:verify    # tables, columns, indexes, FKs, history
```
