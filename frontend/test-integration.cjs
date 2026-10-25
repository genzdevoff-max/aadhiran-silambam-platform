const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appTsx = fs.readFileSync(path.join(root, 'frontend/src/App.tsx'), 'utf8');
const viteConfig = fs.readFileSync(path.join(root, 'frontend/vite.config.ts'), 'utf8');
const adminLayout = fs.readFileSync(path.join(root, 'frontend/src/components/layout/AdminLayout.tsx'), 'utf8');
const adminLogin = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminLogin.tsx'), 'utf8');
const authContext = fs.readFileSync(path.join(root, 'frontend/src/context/AuthContext.tsx'), 'utf8');
const adminSettings = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminSettings.tsx'), 'utf8');
const adminSections = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminSections.tsx'), 'utf8');
const adminMedia = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminMedia.tsx'), 'utf8');
const adminUsers = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminUsers.tsx'), 'utf8');
const adminApi = fs.readFileSync(path.join(root, 'frontend/src/services/api.ts'), 'utf8');
const requestState = fs.readFileSync(path.join(root, 'frontend/src/components/admin/AdminRequestState.tsx'), 'utf8');
const adminEvents = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminEvents.tsx'), 'utf8');
const adminNews = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminNews.tsx'), 'utf8');
const adminAlbums = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminAlbums.tsx'), 'utf8');
const adminEnquiries = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminEnquiries.tsx'), 'utf8');
const adminInstructors = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminInstructors.tsx'), 'utf8');
const adminAchievements = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminAchievements.tsx'), 'utf8');
const adminHeritage = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminHeritage.tsx'), 'utf8');
const adminPartners = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminPartners.tsx'), 'utf8');
const adminSyllabus = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminSyllabus.tsx'), 'utf8');
const navbar = fs.readFileSync(path.join(root, 'frontend/src/components/layout/Navbar.tsx'), 'utf8');
const homePage = fs.readFileSync(path.join(root, 'frontend/src/pages/public/Home.tsx'), 'utf8');
const authController = fs.readFileSync(path.join(root, 'backend/src/controllers/authController.ts'), 'utf8');
const authMiddleware = fs.readFileSync(path.join(root, 'backend/src/middleware/auth.ts'), 'utf8');
const backendServer = fs.readFileSync(path.join(root, 'backend/src/server.ts'), 'utf8');

const checks = [
  // Phase 1 Checks
  ['App wraps in AuthProvider', appTsx.includes('<AuthProvider>')],
  ['App mounts AdminLogin at admin/login', appTsx.includes('path="admin/login"') && appTsx.includes('element={<AdminLogin />}')],
  ['App mounts AdminLayout at admin', appTsx.includes('path="admin"') && appTsx.includes('element={<AdminLayout />}')],
  ['App has dashboard route', appTsx.includes('path="dashboard"') && appTsx.includes('element={<AdminDashboard />}')],
  ['App has syllabus route', appTsx.includes('path="syllabus"') && appTsx.includes('element={<AdminSyllabus />}')],
  ['App has instructors route', appTsx.includes('path="instructors"') && appTsx.includes('element={<AdminInstructors />}')],
  ['App has achievements route', appTsx.includes('path="achievements"') && appTsx.includes('element={<AdminAchievements />}')],
  ['App has events route', appTsx.includes('path="events"') && appTsx.includes('element={<AdminEvents />}')],
  ['App has news route', appTsx.includes('path="news"') && appTsx.includes('element={<AdminNews />}')],
  ['App has heritage route', appTsx.includes('path="heritage"') && appTsx.includes('element={<AdminHeritage />}')],
  ['App has partners route', appTsx.includes('path="partners"') && appTsx.includes('element={<AdminPartners />}')],
  ['App has media route', appTsx.includes('path="media"') && appTsx.includes('element={<AdminMedia />}')],
  ['App has albums route', appTsx.includes('path="albums"') && appTsx.includes('element={<AdminAlbums />}')],
  ['App has enquiries route', appTsx.includes('path="enquiries"') && appTsx.includes('element={<AdminEnquiries />}')],
  ['App has role guard on users route', appTsx.includes('path="users"') && appTsx.includes('RequireRole role="super_admin"')],
  ['App has admin 404 wildcard route', appTsx.includes('path="*"') && appTsx.includes('AdminNotFound')],
  ['App preserves all public routes', appTsx.includes('<Route element={<PublicLayout />}>') && appTsx.includes('path="join-training"')],
  ['Vite config has proxy for /api to 5000', viteConfig.includes("'/api'") && viteConfig.includes('http://localhost:5000')],
  ['AdminLayout redirects unauthenticated via Navigate', adminLayout.includes('<Navigate to="/admin/login"') && adminLayout.includes('state={{ from: location }}')],
  ['AdminLayout checks isLoading before redirect', adminLayout.includes('isLoading') && adminLayout.includes('Verifying administrator session')],
  ['AdminLogin redirects authenticated users with from', adminLogin.includes('isAuthenticated') && adminLogin.includes('navigate(from')],
  ['AuthContext initializes isLoading based on stored token', authContext.includes("Boolean(localStorage.getItem('aadhiran_admin_token'))")],

  // Phase 2 Checks — Site Settings & Password
  ['App mounts AdminSections at admin/sections', appTsx.includes('path="sections"') && appTsx.includes('element={<AdminSections />}')],
  ['App mounts AdminSettings at admin/settings', appTsx.includes('path="settings"') && appTsx.includes('element={<AdminSettings />}')],
  ['AdminSettings has Site Title and Identity controls', adminSettings.includes('settings.siteTitle') && adminSettings.includes('settings.registrationNumber')],
  ['AdminSettings has Contact and Premises controls', adminSettings.includes('settings.email') && adminSettings.includes('settings.phone')],
  ['AdminSettings has SEO Metadata & Social controls', adminSettings.includes('settings.metaDescription') && adminSettings.includes('settings.socials.facebook')],
  ['AdminSettings has Password Change Management', adminSettings.includes('adminApi.changePassword') && adminSettings.includes('passwordData.currentPassword')],
  ['AdminSettings validates password length min 8 chars', adminSettings.includes('minLength={8}') && adminSettings.includes('confirmPassword')],

  // Phase 2 Checks — Sections & Hero Editor
  ['AdminSections has Hero banner editor controls', adminSections.includes('hero.badge') && adminSections.includes('hero.title') && adminSections.includes('hero.subtitle')],
  ['AdminSections has Live Preview Box', adminSections.includes('Live Mockup Preview') && adminSections.includes('hero.bgImage')],
  ['AdminSections has Section Visibility & Ordering', adminSections.includes('moveSection') && adminSections.includes('toggleSection')],
  ['AdminSections has Quick Facts Milestone editor', adminSections.includes('handleFactChange') && adminSections.includes('fact.badge')],

  // Phase 2 Checks — Media Management Improvements
  ['AdminMedia has edit modal for alt_text and caption', adminMedia.includes('editFormData.alt_text') && adminMedia.includes('editFormData.caption')],
  ['AdminMedia has album reassign dropdown', adminMedia.includes('editFormData.album_id') && adminMedia.includes('albums.map')],
  ['AdminMedia validates file size max 10MB', adminMedia.includes('10 * 1024 * 1024') && adminMedia.includes('validateFiles')],
  ['AdminMedia validates allowed image and video formats', adminMedia.includes('allowedTypes') && adminMedia.includes('video/mp4')],
  ['AdminMedia checks references before deletion', adminMedia.includes('adminApi.getMediaReferences') && adminMedia.includes('referenceCount')],
  ['AdminMedia provides warning for referenced assets', adminMedia.includes('Warning: Asset In Use') && adminMedia.includes('Force Delete Anyway')],

  // Phase 3E Audit Regression Checks
  ['Admin shell exposes labeled mobile navigation and breadcrumb', adminLayout.includes('aria-label="Open navigation"') && adminLayout.includes('aria-label="Breadcrumb"')],
  ['Login labels are associated with inputs and no longer logs auth errors', adminLogin.includes('htmlFor="admin-email"') && adminLogin.includes('id="admin-email"') && !adminLogin.includes("console.error('Login error:'")],
  ['User API maps backend fields to the UI model', adminApi.includes('fullName: adminUser.full_name') && adminApi.includes('isActive: adminUser.is_active')],
  ['User screen supports editing role and active status', adminUsers.includes('adminApi.updateUser(editingUser.id, editData)') && adminUsers.includes('Account is active and may sign in')],
  ['Media screen does not display placeholder fixture assets', !adminMedia.includes('defaultAssets')],
  ['Media deletion requires verified references and preserves state on failure', adminMedia.includes('!referencesVerified') && adminMedia.includes('The asset remains in the library.')],
  ['Settings and homepage editor no longer claim deferred/local persistence', !adminSettings.includes('database write is deferred') && !adminSections.includes('database write is deferred')],
  ['Admin list pages distinguish API errors from empty data and support retry', [adminEvents, adminNews, adminAlbums, adminEnquiries, adminInstructors, adminAchievements, adminHeritage, adminPartners, adminSyllabus].every((source) => source.includes('AdminRequestError') && source.includes('loadError'))],
  ['Admin request errors distinguish expired sessions and forbidden access', requestState.includes('status === 401') && requestState.includes('status === 403') && requestState.includes('You do not have permission')],
  ['Admin dialogs have focus, keyboard, and close handling', adminLayout.includes('data-admin-dialog') && adminLayout.includes("event.key === 'Escape'") && adminLayout.includes("event.key !== 'Tab'")],
  ['Homepage hero preserves dark text contrast and reveals more photography', homePage.includes('public-dark-surface relative min-h-[85vh]') && homePage.includes('opacity-80') && homePage.includes('from-[#0B1B3D]/45')],
  ['Backend requires configured JWT secret and honors configured expiry', backendServer.includes('JWT_SECRET must be configured') && authController.includes('process.env.JWT_EXPIRES_IN') && !authController.includes('aadhiran_silambam_penang_secret_key') && !authMiddleware.includes('aadhiran_silambam_penang_secret_key')],
  ['Production CORS restricts browser origins to configured origin', backendServer.includes("process.env.NODE_ENV === 'production'") && backendServer.includes("callback(new Error('Origin is not allowed by CORS.'))")],
  ['Login response does not disclose deactivated-account state', authController.includes("res.status(401).json({ success: false, message: 'Invalid email or password.' })") && !authController.includes('This account has been deactivated')],
  ['Public nav disclosure controls expose state and Escape closes menus', navbar.includes('aria-expanded={isOpen}') && navbar.includes('aria-expanded={heritageDropdown}') && navbar.includes('closeOnEscape')],
  ['Local upload assets bypass backend proxy only when present locally', viteConfig.includes('existsSync(localAssetPath)') && viteConfig.includes('return requestPath')]
];

let allPassed = true;
checks.forEach(([name, passed]) => {
  console.log((passed ? '✓ PASS: ' : '✗ FAIL: ') + name);
  if (!passed) allPassed = false;
});

if (!allPassed) {
  process.exit(1);
} else {
  console.log(`\nAll ${checks.length} integration checks passed successfully!`);
}
