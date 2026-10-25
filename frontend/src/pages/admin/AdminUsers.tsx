import React, { useEffect, useState } from 'react';
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types';

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newUserOpen, setNewUserOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<{ role: User['role']; isActive: boolean }>({
    role: 'editor',
    isActive: true,
  });
  const [savingUser, setSavingUser] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'editor' as 'super_admin' | 'editor',
    password: '',
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setLoadError(null);
    }
    try {
      const data = await adminApi.listUsers();
      setUsers(data);
    } catch {
      setLoadError('Unable to load administrator accounts. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    try {
      await adminApi.createUser(formData);
      setFeedback({ type: 'success', message: 'Staff administrator user created successfully.' });
      setNewUserOpen(false);
      setFormData({ email: '', fullName: '', role: 'editor', password: '' });
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to create user.' });
    } finally {
      setSavingUser(false);
    }
  };

  const openEdit = (adminUser: User) => {
    setEditingUser(adminUser);
    setEditData({ role: adminUser.role, isActive: adminUser.isActive !== false });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      await adminApi.updateUser(editingUser.id, editData);
      setFeedback({ type: 'success', message: `Access for ${editingUser.fullName} updated successfully.` });
      setEditingUser(null);
      await fetchUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to update user access.' });
    } finally {
      setSavingUser(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own logged-in account.');
      return;
    }
    if (!window.confirm('Are you sure you want to revoke and delete this staff account?')) return;

    try {
      await adminApi.deleteUser(id);
      setFeedback({ type: 'success', message: 'Account deleted successfully.' });
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <UserCog className="w-7 h-7 text-crimson-500" />
            <span>Admin Users & Access Roles</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage authenticated administrators and content editors for the Aadhiran platform.
          </p>
        </div>

        <button
          onClick={() => setNewUserOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Staff User</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
              : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-crimson-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss notification" className="ml-auto text-gray-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {loadError ? (
        <div role="alert" className="rounded-2xl border border-crimson-700/60 bg-crimson-950/60 p-6 text-center">
          <p className="text-sm font-semibold text-crimson-200">{loadError}</p>
          <button
            type="button"
            onClick={() => fetchUsers()}
            className="mt-4 rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-700"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading user accounts...</div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          No users found.
        </div>
      ) : (
        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-charcoal-800">
                <tr>
                  <th className="py-3.5 px-6">User / Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-gray-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-charcoal-850/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-crimson-950 border border-crimson-700 flex items-center justify-center text-gold-400 font-bold text-xs">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-mono">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          u.role === 'super_admin'
                            ? 'bg-crimson-950 text-crimson-400 border border-crimson-800'
                            : 'bg-charcoal-800 text-gold-400 border border-charcoal-700'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        u.isActive
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : 'bg-charcoal-800 text-gray-400 border-charcoal-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.id !== currentUser?.id && (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 hover:text-gold-300 transition-colors"
                            aria-label={`Edit access for ${u.fullName}`}
                            title="Edit access"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="p-2 rounded-lg bg-charcoal-800 hover:bg-crimson-950 text-gray-400 hover:text-crimson-300 transition-colors"
                            aria-label={`Delete account for ${u.fullName}`}
                            title="Revoke user account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {newUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-labelledby="new-user-title" tabIndex={-1} className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-charcoal-900 rounded-2xl border border-charcoal-700 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-charcoal-800 pb-3">
              <h3 id="new-user-title" className="text-base font-display font-bold text-white">Create Staff Administrator</h3>
              <button
                type="button"
                onClick={() => setNewUserOpen(false)}
                aria-label="Close create user dialog"
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="new-user-name" className="block text-xs font-semibold text-gray-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  id="new-user-name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Master / Instructor Name"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label htmlFor="new-user-email" className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  id="new-user-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@aadhiran.com"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label htmlFor="new-user-password" className="block text-xs font-semibold text-gray-300 uppercase mb-1">Initial Password</label>
                <input
                  type="password"
                  id="new-user-password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label htmlFor="new-user-role" className="block text-xs font-semibold text-gray-300 uppercase mb-1">Access Role</label>
                <select
                  id="new-user-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'super_admin' | 'editor' })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                >
                  <option value="editor">Editor (Content & Enquiries)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setNewUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  {savingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            data-admin-dialog
            tabIndex={-1}
            className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-charcoal-900 rounded-2xl border border-charcoal-700 shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
              <div>
                <h3 id="edit-user-title" className="text-base font-display font-bold text-white">Edit Account Access</h3>
                <p className="mt-1 text-xs text-gray-400 break-all">{editingUser.email}</p>
              </div>
              <button type="button" onClick={() => setEditingUser(null)} aria-label="Close edit access dialog" className="p-2 rounded-lg text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="user-role" className="block text-xs font-semibold text-gray-300 uppercase mb-1">Access Role</label>
                <select
                  id="user-role"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                >
                  <option value="editor">Editor</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-charcoal-800 bg-charcoal-950 p-3 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span>Account is active and may sign in</span>
              </label>
              <div className="flex justify-end gap-2 border-t border-charcoal-800 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={savingUser} className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider">
                  {savingUser ? 'Saving...' : 'Save Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
