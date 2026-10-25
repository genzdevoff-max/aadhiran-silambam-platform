import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

const Home = lazy(() => import('./pages/public/Home').then(({ Home }) => ({ default: Home })));
const About = lazy(() => import('./pages/public/About').then(({ About }) => ({ default: About })));
const HistoryLineage = lazy(() => import('./pages/public/HistoryLineage').then(({ HistoryLineage }) => ({ default: HistoryLineage })));
const TrainingSyllabus = lazy(() => import('./pages/public/TrainingSyllabus').then(({ TrainingSyllabus }) => ({ default: TrainingSyllabus })));
const Instructors = lazy(() => import('./pages/public/Instructors').then(({ Instructors }) => ({ default: Instructors })));
const Achievements = lazy(() => import('./pages/public/Achievements').then(({ Achievements }) => ({ default: Achievements })));
const Events = lazy(() => import('./pages/public/Events').then(({ Events }) => ({ default: Events })));
const Gallery = lazy(() => import('./pages/public/Gallery').then(({ Gallery }) => ({ default: Gallery })));
const Videos = lazy(() => import('./pages/public/Videos').then(({ Videos }) => ({ default: Videos })));
const News = lazy(() => import('./pages/public/News').then(({ News }) => ({ default: News })));
const NewsDetail = lazy(() => import('./pages/public/NewsDetail').then(({ NewsDetail }) => ({ default: NewsDetail })));
const HeritageWorks = lazy(() => import('./pages/public/HeritageWorks').then(({ HeritageWorks }) => ({ default: HeritageWorks })));
const PartnersPress = lazy(() => import('./pages/public/PartnersPress').then(({ PartnersPress }) => ({ default: PartnersPress })));
const Contact = lazy(() => import('./pages/public/Contact').then(({ Contact }) => ({ default: Contact })));
const JoinTraining = lazy(() => import('./pages/public/JoinTraining').then(({ JoinTraining }) => ({ default: JoinTraining })));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy').then(({ PrivacyPolicy }) => ({ default: PrivacyPolicy })));
const NotFound = lazy(() => import('./pages/public/NotFound').then(({ NotFound }) => ({ default: NotFound })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(({ AdminLogin }) => ({ default: AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(({ AdminDashboard }) => ({ default: AdminDashboard })));
const AdminSyllabus = lazy(() => import('./pages/admin/AdminSyllabus').then(({ AdminSyllabus }) => ({ default: AdminSyllabus })));
const AdminInstructors = lazy(() => import('./pages/admin/AdminInstructors').then(({ AdminInstructors }) => ({ default: AdminInstructors })));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements').then(({ AdminAchievements }) => ({ default: AdminAchievements })));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents').then(({ AdminEvents }) => ({ default: AdminEvents })));
const AdminNews = lazy(() => import('./pages/admin/AdminNews').then(({ AdminNews }) => ({ default: AdminNews })));
const AdminHeritage = lazy(() => import('./pages/admin/AdminHeritage').then(({ AdminHeritage }) => ({ default: AdminHeritage })));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners').then(({ AdminPartners }) => ({ default: AdminPartners })));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(({ AdminMedia }) => ({ default: AdminMedia })));
const AdminAlbums = lazy(() => import('./pages/admin/AdminAlbums').then(({ AdminAlbums }) => ({ default: AdminAlbums })));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries').then(({ AdminEnquiries }) => ({ default: AdminEnquiries })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(({ AdminUsers }) => ({ default: AdminUsers })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(({ AdminSettings }) => ({ default: AdminSettings })));
const AdminSections = lazy(() => import('./pages/admin/AdminSections').then(({ AdminSections }) => ({ default: AdminSections })));

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 text-slate-800">
          <section role="alert" className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h1 className="text-2xl font-bold">This page could not be displayed</h1>
            <p className="mt-3 text-sm">Reload the page to try again. No sensitive error details are shown.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Reload page
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

// Helper: Role-based guard for super_admin routes
const RequireRole: React.FC<{ role: 'super_admin'; children: React.ReactNode }> = ({ role, children }) => {
  const { user } = useAuth();

  if (user?.role !== role) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-charcoal-900 border border-crimson-800/60 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-crimson-950 border border-crimson-700 flex items-center justify-center text-crimson-400 font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-display font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          This administration section requires <span className="font-mono text-gold-400 font-bold uppercase">{role.replace('_', ' ')}</span> privileges. Your current authenticated role is <span className="font-mono text-gray-300 font-bold uppercase">{user?.role || 'editor'}</span>.
        </p>
        <div className="pt-2">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 font-semibold text-xs border border-charcoal-700 transition-colors"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper: Dedicated Admin 404
const AdminNotFound: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 text-center space-y-4 shadow-2xl">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-crimson-950 border border-crimson-700 flex items-center justify-center text-crimson-400 font-mono text-xl font-bold">
        404
      </div>
      <h2 className="text-xl font-display font-bold text-white">Admin Page Not Found</h2>
      <p className="text-xs text-gray-400 leading-relaxed">
        The requested administration route does not exist. Use the sidebar to navigate to an available module.
      </p>
      <div className="pt-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-gold-500/20"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppErrorBoundary>
          <Suspense fallback={
            <main role="status" aria-live="polite" className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 text-slate-800">
              Loading page…
            </main>
          }>
            <Routes>
              {/* Admin Login (Standalone, no sidebar) */}
              <Route path="admin/login" element={<AdminLogin />} />

              {/* Admin Protected Workspace */}
              <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="syllabus" element={<AdminSyllabus />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="heritage" element={<AdminHeritage />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="albums" element={<AdminAlbums />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route
              path="users"
              element={
                <RequireRole role="super_admin">
                  <AdminUsers />
                </RequireRole>
              }
            />
            <Route path="sections" element={<AdminSections />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminNotFound />} />
              </Route>

              {/* Public Website */}
              <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="history" element={<HistoryLineage />} />
            <Route path="history-lineage" element={<HistoryLineage />} />
            <Route path="training" element={<TrainingSyllabus />} />
            <Route path="training-syllabus" element={<TrainingSyllabus />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="events" element={<Events />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="videos" element={<Videos />} />
            <Route path="news" element={<News />} />
            <Route path="news/:slug" element={<NewsDetail />} />
            <Route path="heritage" element={<HeritageWorks />} />
            <Route path="heritage-works" element={<HeritageWorks />} />
            <Route path="partners" element={<PartnersPress />} />
            <Route path="partners-press" element={<PartnersPress />} />
            <Route path="contact" element={<Contact />} />
            <Route path="join-training" element={<JoinTraining />} />
            <Route path="join" element={<JoinTraining />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
