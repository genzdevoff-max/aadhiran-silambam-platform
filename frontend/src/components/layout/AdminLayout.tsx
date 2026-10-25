import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
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
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
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
        }

        const changed = controls(form).some((control) => control.dataset.adminInitialValue !== valueOf(control));
        if (changed) form.dataset.adminDirty = 'true';
        else delete form.dataset.adminDirty;
      }

      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        '.admin-workspace input:not([type="hidden"]), .admin-workspace select, .admin-workspace textarea'
      ).forEach((control) => {
        if (control.labels?.length || control.getAttribute('aria-label')) return;
        const name = control.getAttribute('placeholder') ||
          control.getAttribute('name')?.replace(/[_-]+/g, ' ') ||
          (control instanceof HTMLSelectElement ? control.selectedOptions[0]?.textContent : undefined);
        if (name) control.setAttribute('aria-label', name.trim());
      });

      document.querySelectorAll<HTMLElement>(
        '.admin-workspace [class*="bg-emerald-950"][class*="p-4"], .admin-workspace [class*="bg-crimson-950"][class*="p-4"]'
      ).forEach((message) => {
        const isError = message.className.includes('bg-crimson-950');
        message.setAttribute('role', isError ? 'alert' : 'status');
        message.setAttribute('aria-live', isError ? 'assertive' : 'polite');
      });
    };

    const savedButtonStates = new WeakMap<HTMLButtonElement, boolean>();
    const submissions = new WeakMap<HTMLFormElement, {
      requestIds: Set<string>;
      failed: boolean;
      timeout?: number;
    }>();
    const finishPendingForm = (form: HTMLFormElement, succeeded: boolean) => {
      if (form.dataset.adminPending !== 'true') return;
      const submission = submissions.get(form);
      if (submission?.timeout) window.clearTimeout(submission.timeout);
      form.dataset.adminPending = 'false';
      if (succeeded && form.dataset.adminRequestStarted === 'true') {
        for (const control of controls(form)) control.dataset.adminInitialValue = valueOf(control);
        delete form.dataset.adminDirty;
      }
      delete form.dataset.adminRequestStarted;
      for (const button of Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'))) {
        button.disabled = savedButtonStates.get(button) ?? false;
        savedButtonStates.delete(button);
        button.removeAttribute('aria-busy');
      }
      submissions.delete(form);
      syncForms();
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.closest('.admin-workspace')) return;
      if (form.dataset.adminPending === 'true') {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      form.dataset.adminPending = 'true';
      for (const button of Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'))) {
        savedButtonStates.set(button, button.disabled);
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
      }
      const submission = { requestIds: new Set<string>(), failed: false } as {
        requestIds: Set<string>;
        failed: boolean;
        timeout?: number;
      };
      submissions.set(form, submission);
      submission.timeout = window.setTimeout(() => finishPendingForm(form, true), 0);
    };

    const onApiActivity = (event: Event) => {
      const detail = (event as CustomEvent<{
        id: string;
        phase: 'start' | 'end';
        succeeded?: boolean;
      }>).detail;
      if (detail.phase === 'start') {
        for (const form of forms()) {
          const submission = submissions.get(form);
          if (submission && form.dataset.adminPending === 'true') {
            if (submission.timeout) window.clearTimeout(submission.timeout);
            submission.requestIds.add(detail.id);
            form.dataset.adminRequestStarted = 'true';
          }
        }
        return;
      }

      for (const form of forms()) {
        const submission = submissions.get(form);
        if (!submission || !submission.requestIds.delete(detail.id)) continue;
        submission.failed ||= detail.succeeded === false;
        if (submission.requestIds.size === 0) {
          submission.timeout = window.setTimeout(
            () => finishPendingForm(form, !submission.failed),
            0
          );
        }
      }
    };

    const dirtyForms = () => forms().filter((form) => form.dataset.adminDirty === 'true');
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

  // If loading session verification, display clean loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-gold-400 font-mono text-sm space-y-4">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-wider text-gray-400">Verifying administrator session...</p>
      </div>
    );
  }

  // If unauthenticated, redirect to login with return location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-workspace min-h-screen bg-charcoal-950 text-gray-200 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        aria-label="Admin navigation"
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
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation"
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
                  aria-current={active ? 'page' : undefined}
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
              type="button"
              onClick={logout}
              aria-label="Sign out"
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
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileSidebarOpen}
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
              type="button"
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
          {currentPage && (
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-400">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/admin/dashboard" className="hover:text-gold-300 focus-visible:text-gold-300">
                    Admin
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-gray-200">
                  {currentPage.name}
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
