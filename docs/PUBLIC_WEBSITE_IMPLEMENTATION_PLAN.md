# Aadhiran Silambam — Public Website Implementation Plan

**Date:** 2026-10-17  
**Project:** Persatuan Aadhiran Silambam Pulau Pinang — Public Web Experience  
**Workspace:** `E:\aadhiran-silambam-platform`  
**Target Delivery:** Complete, responsive, navigable, visually polished public website without PostgreSQL or backend API dependencies.

---

## 1. Controlled Audit & Discovered Architecture

### 1.1 Repository Structure
* **Root (`/`):** Contains the legacy HTML/CSS website (`index.html`, `css/`, `images/`, `img/`, `video/`, `fonts/`, `js/`), authentic media files, and `silambam.ico`.
* **Backend (`/backend`):** Node.js / Express backend with PostgreSQL migrations, schema, seed file (`src/db/seed.ts`), controller/route stubs, and media asset repository (`/backend/uploads/`).
* **Frontend (`/frontend`):** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + `react-router-dom` v7 + `lucide-react`.

### 1.2 Frontend Initial Status
* `frontend/src/App.tsx`: Currently mounts the default **Vite starter screen** (with counter and Vite/React documentation links). The public layouts and page components are completely disconnected.
* `frontend/src/main.tsx`: Directly mounts `<App />` inside `StrictMode`.
* **TypeScript & Build Status:** Exactly **108 TypeScript compilation errors** detected:
  * `1 error`: `src/pages/public/Home.tsx(353,18): error TS2304: Cannot find name 'Globe'` (missing Lucide icon import).
  * `107 errors`: `error TS6133: '...' is declared but its value is never read.` across public and admin pages due to strict TypeScript configuration (`noUnusedLocals: true`, `noUnusedParameters: true`).
* **Asset Location Gaps:**
  * `frontend/public/` currently contains only `favicon.svg` and `icons.svg`.
  * Public components reference `/uploads/...` (e.g., `/uploads/silambam-back.jpg`, `/uploads/VID-20231026-WA0019.mp4`), which would result in 404 broken assets unless the authentic media files from `/backend/uploads` and root `/img`, `/images`, and `/video` are properly provided in `frontend/public/uploads`.

---

## 2. Authentic Asset Inventory & Mapping

We have surveyed the repository and discovered authentic client assets:

| Asset Name | Current Source Location | Description & Verified Use Case | Target Static Path |
| :--- | :--- | :--- | :--- |
| `silambam-back.jpg` | `/backend/uploads/`, `/img/` | Hero action backdrop with dynamic Silambam spin | `/uploads/silambam-back.jpg` |
| `mariapaqiam4.png` | `/backend/uploads/`, `/images/` | Archival photograph of 14th descendant Grandmaster Mariapakkiam | `/uploads/mariapaqiam4.png` |
| `siva_orig.png` | `/backend/uploads/`, `/img/` | Chief Master Siva in traditional martial stance | `/uploads/siva_orig.png` |
| `screenshot-2019-06-09-at-5-17-22-am_orig.png` | `/backend/uploads/`, `/img/` | Malaysia Book of Records certificate presentation ceremony (2022) | `/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png` |
| `july-2015_orig.png` | `/backend/uploads/` | Historic association gathering at Penang hall / ICHCAP feature | `/uploads/july-2015_orig.png` |
| `48397540-957165591150493-3850920351072518144-o.jpg` | `/backend/uploads/`, `/images/` | UNESCO Living Heritage community showcase in George Town | `/uploads/48397540-957165591150493-3850920351072518144-o.jpg` |
| `1129754474.jpg` | `/backend/uploads/`, `/images/` | Senior master weapon twirling and combat demonstration | `/uploads/1129754474.jpg` |
| `1094154479.jpg` | `/backend/uploads/`, `/images/` | Traditional martial weaponry display (Bamboo staffs, deer horns, vel) | `/uploads/1094154479.jpg` |
| `team1.png` – `team4.png` | `/backend/uploads/`, `/img/` | Traditional instructor & disciple archival portraits | `/uploads/team1.png` - `/uploads/team4.png` |
| `member1.png` – `member3.png` | `/backend/uploads/` | Instructors Master Vijayan, Master Arumugam, Kumaran | `/uploads/member1.png` - `/uploads/member3.png` |
| `img1.jpg` – `img10.jpg` | `/backend/uploads/`, `/img/` | Training sessions, CNN Travel showcase, student footwork | `/uploads/img1.jpg` - `/uploads/img10.jpg` |
| `portfolio-1.jpg` – `portfolio-6.jpg` | `/backend/uploads/`, `/img/` | Cultural demonstrations, weaponry arrays | `/uploads/portfolio-1.jpg` - `/uploads/portfolio-6.jpg` |
| `l1.jpg` – `l16.jpg` / `gal1.jpg` – `gal16.jpg` | `/img/` | Historical gallery photo sets | `/uploads/l1.jpg` - `/uploads/l16.jpg` |
| `VID-20231026-WA0019.mp4` | `/backend/uploads/`, `/video/` | Authentic video: "Aadhiran Silambam of Penang: The Untold Story" | `/uploads/VID-20231026-WA0019.mp4` |
| `VID-20231026-WA0020.mp4` | `/backend/uploads/`, `/video/` | Authentic video: "Kurunji Stances & Twirling Manoeuvres" | `/uploads/VID-20231026-WA0020.mp4` |
| `athletica.mp4` | `/video/` | Authentic video: "Athletic Training & Traditional Combat Stances" | `/uploads/athletica.mp4` |
| `silambam.ico` | `/`, `/backend/uploads/` | Association emblem favicon | `/uploads/silambam.ico` & `/silambam.ico` |

---

## 3. Route Architecture & Mapping

All public routes specified in the requirements will be connected inside a unified `BrowserRouter` wrapped with `PublicLayout`. Both standard and canonical aliases will be supported:

| Requirement Path | Canonical Route | Component | Page Purpose & Content |
| :--- | :--- | :--- | :--- |
| `/` | `/` | `Home.tsx` | Complete landing page: Hero, MBOR badge, Quick facts, 10-Stage syllabus highlight, Heritage highlights, Video teaser, Enquiry CTA, Footer |
| `/about` | `/about` | `About.tsx` | Association history since 1975, ROS registration (PPM-014-07-25021975), 4 Core Pillars, MBOR recognition |
| `/history` | `/history` & `/history-lineage` | `HistoryLineage.tsx` | 5,000-year Kurunji mountain Tamil martial heritage, 1936 migration to George Town, Grandmaster Mariapakkiam lineage |
| `/training` | `/training` & `/training-syllabus` | `TrainingSyllabus.tsx` | Complete 10-stage syllabus breakdown (Kaaladi Varisai to Kurunji Meypadu), weapons, animal movements, philosophical stance on non-belting |
| `/instructors` | `/instructors` | `Instructors.tsx` | Grandmaster Mariapakkiam (14th Descendant), Chief Master Siva (15th Successor), Senior Masters Vijayan & Arumugam, Instructor Kumaran |
| `/achievements` | `/achievements` | `Achievements.tsx` | Malaysia Book of Records (2022), UNESCO ICHCAP (2020), UNESCO Living Heritage (2019), CNN Travel (2017), Penang Heritage Trust (2018) |
| `/events` | `/events` | `Events.tsx` | Heritage showcases, George Town World Heritage Day 2026, National Martial Arts Assembly, Grandmaster Memorial Guru Pooja |
| `/gallery` | `/gallery` | `Gallery.tsx` | Categorized archival and training photo gallery with lightbox modal, filter tags, and authentic descriptions |
| `/videos` | `/videos` | `Videos.tsx` | HTML5 video player featuring authentic local MP4 recordings, title cards, Tamil subtitles, and descriptions |
| `/news` | `/news` | `News.tsx` | News and long-form articles; links to `/news/:slug` |
| `/news/:slug` | `/news/:slug` | `NewsDetail.tsx` | Full article view with markdown formatting, related articles, and share buttons |
| `/heritage` | `/heritage` & `/heritage-works` | `HeritageWorks.tsx` | UNESCO Living Heritage engagement, ICHCAP South Korea publication, intangible cultural preservation projects |
| `/partners` | `/partners` & `/partners-press` | `PartnersPress.tsx` | Press coverage (CNN Travel, national press) and partner institutions (GTWHI, PHT, ICHCAP) |
| `/contact` | `/contact` | `Contact.tsx` | Association contact details, George Town headquarters location, interactive frontend-validated contact form |
| `/join-training` | `/join-training` & `/join` | `JoinTraining.tsx` | Comprehensive training enquiry form UI with validation, syllabus level guidance, and transparent phase status |
| `/privacy` | `/privacy` & `/privacy-policy` | `PrivacyPolicy.tsx` | Personal Data Protection Act (PDPA 2010) compliance policy |
| `*` | `*` | `NotFound.tsx` | Dedicated 404 page styled with authentic martial aesthetic and navigation recovery links |

---

## 4. Centralized Typed Data Layer (`src/data/`)

To decouple the public website from network requests and ensure future CMS/database integration is a simple data-provider swap:

1. `src/data/siteContent.ts`: Organization identity, hero config, quick facts, contact info, operating premises.
2. `src/data/syllabus.ts`: Typed data for all 10 stages (Tamil titles, English titles, techniques, animal movements, weapons).
3. `src/data/instructors.ts`: Complete master and instructor biographies, lineage ranks, and authentic portrait URLs.
4. `src/data/achievements.ts`: Chronological records, verification details, and evidence links.
5. `src/data/events.ts`: Heritage events, workshops, and ceremonial assemblies.
6. `src/data/gallery.ts`: Categorized albums and image assets with verified captions.
7. `src/data/videos.ts`: Authentic video manifests and metadata.
8. `src/data/news.ts`: Historical and philosophical articles.
9. `src/data/heritage.ts`: Detailed UNESCO and international publication documentation.
10. `src/data/partners.ts`: Press clippings, institutional partners, and quotes.
11. `src/data/verificationStatus.ts`: Explicit audit record separating verified facts from client-confirmation items.

---

## 5. Implementation Phases & Action Items

### Phase A — Repair Frontend Foundation
* Eliminate all 108 TypeScript errors:
  * Fix missing `Globe` import in `Home.tsx`.
  * Clean up unused imports and unused declarations across public and admin pages while strictly preserving functionality.
* Refactor `App.tsx` into a robust `BrowserRouter` incorporating `PublicLayout`, all public routes, route aliases, and the `NotFound` component.
* Verify production build (`npm run build`) runs cleanly without errors.

### Phase B — Local Asset Deployment & Design System
* Safely copy client photographs and videos from `backend/uploads`, `img`, and `video` to `frontend/public/uploads/` so all static paths resolve.
* Centralize asset paths and verify every image/video reference in the public website.
* Ensure visual identity meets design criteria: Charcoal-950 base, crimson red accents (`crimson-600/700`), antique gold highlights (`gold-400/500`), clean typography (`Cinzel` headings + `Inter` body), and smooth responsive spacing.

### Phase C — Build and Polish All Public Pages
* Update each public page to consume the local typed data layer synchronously instead of relying on failing API calls.
* Wire up `NewsDetail.tsx` with dynamic lookup from the news dataset.
* Implement frontend-only validation for `Contact.tsx` and `JoinTraining.tsx` with friendly feedback and clear notice that backend submission will be enabled in a later phase.
* Create a dedicated `NotFound.tsx` page.

### Phase D — Data Layer Validation
* Verify that all 10 syllabus stages, all instructors, all achievements, all gallery albums, all videos, and all heritage works are populated accurately.
* Document verified facts versus items requiring client confirmation.

### Phase E — Responsive Design, Accessibility, and SEO
* Test and tune responsive layouts for mobile, tablet, and desktop viewports.
* Verify keyboard accessibility, ARIA labels, focus states, and image alt attributes.
* Ensure meta tags, page titles, and Open Graph information are configured properly in `index.html`.
* Provide a production-ready `robots.txt`.

### Phase F — Verification, Quality Assurance & Handover
* Run `npm run build`, `npm run lint`, and TypeScript validation.
* Verify that zero network requests are made to backend endpoints or PostgreSQL.
* Generate `docs/PUBLIC_WEBSITE_COMPLETION_REPORT.md` documenting completed work, route directory, verified assets, and recommendations for future admin CMS integration.
