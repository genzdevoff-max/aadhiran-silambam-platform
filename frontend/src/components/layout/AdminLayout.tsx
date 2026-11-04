import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
  const currentPage = navItems.find((item) => isActive(item.path));

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileSidebarOpen]);

  useEffect(() => {
    let activeDialog: HTMLElement | null = null;
    let previousFocus: HTMLElement | null = null;

    const syncDialog = () => {
      const dialog = document.querySelector<HTMLElement>('[data-admin-dialog]');
      if (dialog === activeDialog) return;

      if (!dialog && activeDialog) {
        activeDialog = null;
        if (previousFocus?.isConnected) previousFocus.focus();
        previousFocus = null;
        return;
      }

      if (dialog) {
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        activeDialog = dialog;
        const focusable = dialog.querySelector<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        (focusable || dialog).focus();
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    syncDialog();

    const handleDialogKeys = (event: KeyboardEvent) => {
      const dialog = document.querySelector<HTMLElement>('[data-admin-dialog]');
      if (!dialog) return;

      if (event.key === 'Escape') {
        const closeButton = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
          .find((button) => /cancel|close|dismiss/i.test(`${button.textContent} ${button.getAttribute('aria-label') || ''}`));
        if (closeButton) closeButton.click();
        event.preventDefault();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKeys);

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', handleDialogKeys);
    };
  }, []);

  useEffect(() => {
    let nextFieldId = 0;
    const forms = () => Array.from(document.querySelectorAll<HTMLFormElement>('.admin-workspace form'));
    const controls = (form: HTMLFormElement) =>
      Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input:not([type="hidden"]), select, textarea'
      ));
    const valueOf = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
      if (control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type)) {
        return String(control.checked);
      }
      if (control instanceof HTMLSelectElement) {
        return Array.from(control.selectedOptions).map((option) => option.value).join('\u0000');
      }
      return control.value;
    };

    const syncForms = () => {
      for (const form of forms()) {
        for (const control of controls(form)) {
          if (!control.hasAttribute('data-admin-initial-value')) {
            control.dataset.adminInitialValue = valueOf(control);
          }
          if (control.required) control.setAttribute('aria-required', 'true');

          if (!control.closest('label') && !control.labels?.length) {
            let branch: HTMLElement = control;
            let ancestor = control.parentElement;
            while (ancestor && form.contains(ancestor)) {
              const label = Array.from(ancestor.children)
                .filter((element): element is HTMLLabelElement => element instanceof HTMLLabelElement)
                .reverse()
                .find((candidate) =>
                  Boolean(candidate.compareDocumentPosition(branch) & Node.DOCUMENT_POSITION_FOLLOWING)
                );
              if (label) {
                if (!control.id) control.id = `admin-field-${++nextFieldId}`;
                label.htmlFor = control.id;
                if (control.required && !label.textContent?.trim().endsWith('*')) {
                  label.dataset.adminRequired = 'true';
                }
                break;
              }
              if (ancestor === form) break;
              branch = ancestor;
              ancestor = ancestor.parentElement;
            }
          }

          const associatedLabel = control.labels?.[0];
          if (control.required && associatedLabel && !associatedLabel.textContent?.trim().endsWith('*')) {
            associatedLabel.dataset.adminRequired = 'true';
          }

          if (!control.labels?.length && !control.getAttribute('aria-label')) {
            const name = control.getAttribute('placeholder') ||
              control.getAttribute('name')?.replace(/[_-]+/g, ' ') ||
              (control instanceof HTMLSelectElement ? control.selectedOptions[0]?.textContent : undefined);
            if (name) control.setAttribute('aria-label', name.trim());
          }

          const dirty = control.dataset.adminInitialValue !== undefined &&
            control.dataset.adminInitialValue !== valueOf(control);
          if (dirty) control.dataset.adminDirty = 'true';
          else delete control.dataset.adminDirty;
        }

        const isFormDirty = controls(form).some((control) => control.dataset.adminDirty === 'true');
        if (isFormDirty) form.dataset.adminDirty = 'true';
        else delete form.dataset.adminDirty;
      }
    };

    const resetFormBaseline = (form: HTMLFormElement) => {
      delete form.dataset.adminDirty;
      for (const control of controls(form)) {
        control.dataset.adminInitialValue = valueOf(control);
        delete control.dataset.adminDirty;
      }
    };

    const dirtyForms = () =>
      forms().filter((form) => form.dataset.adminDirty === 'true' && document.body.contains(form));

    const onSubmit = (event: Event) => {
      if (event.target instanceof HTMLFormElement) {
        event.target.dataset.adminSubmitting = 'true';
      }
    };

    const onApiActivity = (event: Event) => {
      const customEvent = event as CustomEvent<{ phase: 'start' | 'end'; activeMutationCount: number; succeeded?: boolean }>;
      if (customEvent.detail?.phase === 'end' && customEvent.detail.succeeded) {
        for (const form of forms()) {
          if (form.dataset.adminSubmitting === 'true') {
            delete form.dataset.adminSubmitting;
            resetFormBaseline(form);
          }
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const dirty = dirtyForms();
      if (!dirty.length) return;

      const dialog = event.target.closest<HTMLElement>('[data-admin-dialog]');
      const closeButton = event.target.closest<HTMLButtonElement>('button');
      const dialogIsDirty = dialog?.querySelector('form[data-admin-dirty="true"]');
      if (
        dialog &&
        dialogIsDirty &&
        closeButton &&
        /cancel|close|dismiss/i.test(`${closeButton.textContent} ${closeButton.getAttribute('aria-label') || ''}`) &&
        !window.confirm('Discard your unsaved changes?')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.origin !== window.location.origin || link.pathname === window.location.pathname) return;
      if (!window.confirm('You have unsaved changes. Leave this page and discard them?')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyForms().length) return;
      event.preventDefault();
      event.returnValue = '';
    };

    const onPopState = (event: PopStateEvent) => {
      if (!dirtyForms().length || window.confirm('You have unsaved changes. Leave this page and discard them?')) return;
      event.stopImmediatePropagation();
      window.history.go(1);
    };

    const observer = new MutationObserver(syncForms);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['required'] });
    syncForms();
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('input', syncForms, true);
    document.addEventListener('change', syncForms, true);
    window.addEventListener('admin-api-activity', onApiActivity);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('submit', onSubmit, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('input', syncForms, true);
      document.removeEventListener('change', syncForms, true);
      window.removeEventListener('admin-api-activity', onApiActivity);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState, true);
    };
  }, []);

  // Loading Screen in Heritage Navy & Gold
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-[#102137] font-sans text-sm space-y-4">
        <div className="w-10 h-10 border-3 border-[#C6A04A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-wider text-[#64748B] font-medium">Verifying administrator session...</p>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-workspace h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#182332] flex relative font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation — Primary Navy (#102137) with Gold (#C6A04A) Highlights */}
      <aside
        id="admin-navigation"
        aria-label="Admin navigation"
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 h-screen shrink-0 bg-[#102137] border-r border-[#183B5B] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#183B5B] flex items-center justify-between bg-[#0B1726]">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#102137] via-[#C6A04A] to-[#183B5B] p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-2xl bg-white p-0.5 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Aadhiran Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-white tracking-tight text-base truncate">
                  AADHIRAN CMS
                </span>
                <span className="block text-[10px] font-mono font-semibold text-[#D9B96E] uppercase tracking-widest truncate">
                  Management Portal
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
            >
              <X className="w-5 h-5 shrink-0" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 flex-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-[#183B5B] text-white font-semibold border-l-4 border-[#C6A04A] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#183B5B]/60'
                  }`}
                >
                  <div className="inline-flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        active
                          ? 'bg-[#C6A04A] text-[#102137]'
                          : 'bg-[#183B5B] text-[#D9B96E] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {active ? (
                    <ChevronRight className="w-4 h-4 text-[#D9B96E] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Info & Actions */}
          <div className="p-4 border-t border-[#183B5B] bg-[#0B1726] shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="inline-flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#183B5B] border border-[#C6A04A]/60 flex items-center justify-center text-[#D9B96E] font-bold text-xs shrink-0">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
                  <p className="text-[10px] text-[#D9B96E] capitalize font-medium">{user?.role?.replace('_', ' ') || 'Staff'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#183B5B] hover:bg-[#224D77] text-white text-[11px] font-medium inline-flex items-center justify-center gap-2 transition-all border border-[#183B5B] shadow-sm"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D9B96E] shrink-0" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace — Ivory Background (#FDFBF7) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#FDFBF7]">
        {/* Top Header Bar — White (#FFFFFF) */}
        <header className="h-16 bg-white border-b border-[#E8E3D9] px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="inline-flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileSidebarOpen}
              className="lg:hidden p-2 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] hover:text-[#C6A04A] shrink-0"
            >
              <Menu className="w-5 h-5 shrink-0" />
            </button>
            <div className="inline-flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 hidden sm:inline-block" />
              <span className="text-xs font-semibold text-[#102137] truncate">
                Persatuan Aadhiran Silambam Pulau Pinang
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F8F5EE] text-[#102137] border border-[#E8E3D9] hidden md:inline-block shrink-0">
                EST. 1975
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 text-xs shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] font-mono font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              ROLE: {user?.role?.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors inline-flex items-center gap-1.5 font-medium text-xs"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
          {currentPage && (
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#64748B]">
              <ol className="inline-flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/admin/dashboard" className="hover:text-[#102137] focus-visible:text-[#102137] inline-flex items-center gap-1 font-medium">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                    <span>Admin</span>
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[#E8E3D9]">/</li>
                <li aria-current="page" className="font-semibold text-[#102137] inline-flex items-center gap-1.5">
                  <span>{currentPage.name}</span>
                </li>
              </ol>
            </nav>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
