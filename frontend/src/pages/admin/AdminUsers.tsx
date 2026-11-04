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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <UserCog className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Admin Users & Access Roles</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage authenticated administrators and content editors for the Aadhiran platform.
          </p>
        </div>

        <button
          onClick={() => setNewUserOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C6A04A]" />
          <span>New Staff User</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 w-full ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss notification" className="ml-auto text-[#64748B] hover:text-[#182332] text-xs px-2 py-1 rounded hover:bg-black/5 shrink-0">
            ✕
          </button>
        </div>
      )}

      {loadError ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-semibold text-rose-800">{loadError}</p>
          <button
            type="button"
            onClick={() => fetchUsers()}
            className="mt-4 rounded-xl border border-[#E8E3D9] bg-white px-4 py-2 text-xs font-semibold text-[#182332] hover:bg-[#F8F5EE]"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] font-mono text-sm">Loading user accounts...</div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E3D9] text-[#64748B] text-xs">
          No users found.
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-[#F8F5EE] text-[#102137] uppercase font-mono text-[10px] tracking-wider border-b border-[#E8E3D9]">
                <tr>
                  <th className="py-3.5 px-6 font-bold">User / Name</th>
                  <th className="py-3.5 px-6 font-bold">Email Address</th>
                  <th className="py-3.5 px-6 font-bold">Role</th>
                  <th className="py-3.5 px-6 font-bold">Status</th>
                  <th className="py-3.5 px-6 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D9] text-[#182332]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#102137]">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#102137] flex items-center justify-center text-[#C6A04A] font-bold text-xs shrink-0">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#64748B] font-mono">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          u.role === 'super_admin'
                            ? 'bg-[#102137]/10 text-[#102137] border border-[#102137]/20'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1 ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${u.isActive ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.id !== currentUser?.id && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg bg-white hover:bg-[#F8F5EE] text-[#102137] border border-[#E8E3D9] transition-colors"
                            aria-label={`Edit access for ${u.fullName}`}
                            title="Edit access"
                          >
                            <Pencil className="w-4 h-4 text-[#C6A04A] shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            aria-label={`Delete account for ${u.fullName}`}
                            title="Revoke user account"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/60 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-labelledby="new-user-title" tabIndex={-1} className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-3xl border border-[#E8E3D9] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E3D9] pb-3">
              <h3 id="new-user-title" className="text-base font-display font-bold text-[#102137]">Create Staff Administrator</h3>
              <button
                type="button"
                onClick={() => setNewUserOpen(false)}
                aria-label="Close create user dialog"
                className="text-[#64748B] hover:text-[#182332] p-1.5 rounded-lg hover:bg-[#F8F5EE] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="new-user-name" className="block text-xs font-semibold text-[#182332] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  id="new-user-name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Master / Instructor Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label htmlFor="new-user-email" className="block text-xs font-semibold text-[#182332] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  id="new-user-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@aadhiran.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label htmlFor="new-user-password" className="block text-xs font-semibold text-[#182332] uppercase mb-1">Initial Password</label>
                <input
                  type="password"
                  id="new-user-password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label htmlFor="new-user-role" className="block text-xs font-semibold text-[#182332] uppercase mb-1">Access Role</label>
                <select
                  id="new-user-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'super_admin' | 'editor' })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                >
                  <option value="editor">Editor (Content & Enquiries)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white text-[#64748B] hover:text-[#182332] text-xs font-semibold border border-[#E8E3D9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-sm"
                >
                  {savingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            data-admin-dialog
            tabIndex={-1}
            className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-3xl border border-[#E8E3D9] shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#E8E3D9] pb-3">
              <div>
                <h3 id="edit-user-title" className="text-base font-display font-bold text-[#102137]">Edit Account Access</h3>
                <p className="mt-1 text-xs text-[#C6A04A] font-mono break-all">{editingUser.email}</p>
              </div>
              <button type="button" onClick={() => setEditingUser(null)} aria-label="Close edit access dialog" className="p-2 rounded-lg text-[#64748B] hover:text-[#182332]">
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="user-role" className="block text-xs font-semibold text-[#182332] uppercase mb-1">Access Role</label>
                <select
                  id="user-role"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value as User['role'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                >
                  <option value="editor">Editor</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-[#E8E3D9] bg-[#F8F5EE] p-3 text-xs text-[#182332]">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  className="h-4 w-4 accent-[#102137]"
                />
                <span>Account is active and may sign in</span>
              </label>
              <div className="flex justify-end gap-2 border-t border-[#E8E3D9] pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-white text-[#64748B] hover:text-[#182332] text-xs font-semibold border border-[#E8E3D9]">Cancel</button>
                <button type="submit" disabled={savingUser} className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white text-xs font-medium tracking-wider shadow-sm">
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
