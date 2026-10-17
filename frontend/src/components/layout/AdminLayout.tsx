import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Layers,
  Users,
  Award,
  Calendar,
  BookOpen,
  Globe,
  Newspaper,
  Image as ImageIcon,
  Folder,
  MessageSquare,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sections & Hero', path: '/admin/sections', icon: Flame },
    { name: '10-Stage Syllabus', path: '/admin/syllabus', icon: Layers },
    { name: 'Instructors & Masters', path: '/admin/instructors', icon: Users },
    { name: 'Achievements & Awards', path: '/admin/achievements', icon: Award },
    { name: 'Events & Competitions', path: '/admin/events', icon: Calendar },
    { name: 'News & Blog Articles', path: '/admin/news', icon: BookOpen },
    { name: 'Heritage Projects', path: '/admin/heritage', icon: Globe },
    { name: 'Partners & Press', path: '/admin/partners', icon: Newspaper },
    { name: 'Media Asset Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Photo Albums', path: '/admin/albums', icon: Folder },
    { name: 'Contact & Join Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    ...(user?.role === 'super_admin'
      ? [{ name: 'Admin Users & Roles', path: '/admin/users', icon: UserCog }]
      : []),
    { name: 'Site Settings & SEO', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-charcoal-950 text-gray-200 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-charcoal-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-crimson-900 flex items-center justify-center text-gold-400 border border-gold-500/30 shadow-md">
                <Shield className="w-5 h-5 text-gold-300" />
              </div>
              <div>
                <span className="block font-display font-bold text-white tracking-wider text-base">
                  AADHIRAN CMS
                </span>
                <span className="block text-[10px] font-mono font-semibold text-gold-400 uppercase tracking-widest">
                  Admin Control Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-4 space-y-1 max-h-[calc(100vh-190px)] overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    active
                      ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
                      : 'text-gray-400 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? 'text-white' : 'text-gray-500 group-hover:text-gold-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-950/60">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-crimson-950 border border-crimson-700 flex items-center justify-center text-gold-400 font-bold text-xs">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="truncate max-w-[130px]">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-crimson-400 hover:bg-charcoal-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 hover:text-white text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-charcoal-700"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3 text-gold-400" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-charcoal-900 border-b border-charcoal-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-gold-400 hidden sm:inline-block">
              Persatuan Aadhiran Silambam Pulau Pinang (EST. 1975)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-crimson-950 border border-crimson-800 text-crimson-300 font-mono font-bold">
              ROLE: {user?.role?.toUpperCase()}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 hover:text-crimson-300 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-charcoal-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
