import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import type { Instructor } from '../../types';

export const AdminInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Partial<Instructor> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchInstructors = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getInstructors();
      if (!Array.isArray(data)) throw new Error('Unexpected instructor response.');
      setInstructors(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load instructor records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstructor) return;

    try {
      if (editingInstructor.id) {
        await adminApi.updateInstructor(editingInstructor.id, editingInstructor);
        setFeedback({ type: 'success', message: 'Instructor profile updated successfully.' });
      } else {
        await adminApi.createInstructor(editingInstructor);
        setFeedback({ type: 'success', message: 'New instructor created successfully.' });
      }
      setEditingInstructor(null);
      fetchInstructors();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await adminApi.deleteInstructor(id);
      setFeedback({ type: 'success', message: 'Instructor deleted successfully.' });
      fetchInstructors();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete instructor.' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Instructors & Lineage Masters
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage authenticated biographical records, lineage ranks, and cloud-stored photographs.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingInstructor({
              name: '',
              tamil_name: '',
              title: '',
              role_type: 'instructor',
              biography: '',
              years_experience: 10,
              lineage_rank: 'Certified Master',
              photo_url: '',
              sort_order: instructors.length + 1,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>Add Instructor</span>
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold px-2">✕</button>
        </div>
      )}

      {loadError ? (
        <AdminRequestError message={loadError} onRetry={fetchInstructors} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading instructor profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9] flex-shrink-0">
                  <img
                    src={inst.photo_url || '/logo.png'}
                    alt={inst.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider block">
                    {inst.role_type.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-[#102137] truncate">
                    {inst.name}
                  </h3>
                  {inst.tamil_name && (
                    <p className="text-xs text-[#64748B] truncate">{inst.tamil_name}</p>
                  )}
                  <p className="text-[11px] text-[#64748B] mt-1">
                    {inst.years_experience}+ Yrs Exp • {inst.lineage_rank}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#182332] line-clamp-3 leading-relaxed">
                {inst.biography}
              </p>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingInstructor(inst)}
                  className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(inst.id)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 text-xs font-semibold inline-flex items-center gap-1.5 border border-red-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Instructor editor" tabIndex={-1} className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingInstructor.id ? 'Edit Master Record' : 'Add New Instructor'}
              </h3>
              <button
                onClick={() => setEditingInstructor(null)}
                className="text-[#64748B] hover:text-[#102137] px-2.5 py-1 rounded-lg bg-white border border-[#E8E3D9] text-xs font-medium"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Full Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInstructor.name || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Tamil Name (e.g. மாஸ்டர் சிவா)
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.tamil_name || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, tamil_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Title / Specialty
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInstructor.title || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, title: e.target.value })}
                    placeholder="Chief Master & Heritage Custodian"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Role Level
                  </label>
                  <select
                    value={editingInstructor.role_type || 'instructor'}
                    onChange={(e) =>
                      setEditingInstructor({
                        ...editingInstructor,
                        role_type: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  >
                    <option value="grandmaster">Grandmaster</option>
                    <option value="head_master">Head Master</option>
                    <option value="senior_instructor">Senior Master</option>
                    <option value="instructor">Lead Instructor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Years of Practice
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingInstructor.years_experience ?? 10}
                    onChange={(e) =>
                      setEditingInstructor({
                        ...editingInstructor,
                        years_experience: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Lineage Rank
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.lineage_rank || ''}
                    onChange={(e) =>
                      setEditingInstructor({ ...editingInstructor, lineage_rank: e.target.value })
                    }
                    placeholder="15th Lineage Successor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Instructor Photograph"
                value={editingInstructor.photo_url || ''}
                onChange={(url) => setEditingInstructor({ ...editingInstructor, photo_url: url })}
                altText={editingInstructor.name || 'Instructor'}
                helperText="Upload portrait photo. Stored securely on Backblaze B2."
              />

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingInstructor.biography || ''}
                  onChange={(e) =>
                    setEditingInstructor({ ...editingInstructor, biography: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingInstructor(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E3D9] bg-white text-[#64748B] hover:text-[#102137] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-semibold border border-[#C6A04A]/60 shadow-sm"
                >
                  Save Instructor Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
