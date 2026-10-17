import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Instructor } from '../../types';

export const AdminInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingInstructor, setEditingInstructor] = useState<Partial<Instructor> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchInstructors = async () => {
    try {
      const data = await adminApi.getInstructors();
      if (Array.isArray(data)) {
        setInstructors(data);
      }
    } catch (e) {
      console.error('Failed to load instructors', e);
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
        setFeedback({ type: 'success', message: 'Instructor updated successfully.' });
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
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to delete instructor.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Instructors & Lineage Masters Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage authenticated biographical records, lineage ranks, and photos of association masters.
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
              photo_url: '/uploads/mariapaqiam4.png',
              sort_order: instructors.length + 1,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instructor</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
              : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Instructors Table / Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-mono">Loading instructors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={inst.photo_url || '/uploads/mariapaqiam4.png'}
                  alt={inst.name}
                  className="w-16 h-16 rounded-xl object-cover border border-charcoal-700 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase tracking-widest block">
                    {inst.role_type.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-display font-bold text-white truncate">
                    {inst.name}
                  </h3>
                  {inst.tamil_name && (
                    <p className="text-xs font-mono text-gold-400 truncate">{inst.tamil_name}</p>
                  )}
                  <p className="text-[11px] text-gray-500 font-mono mt-1">
                    {inst.years_experience}+ Yrs Exp • {inst.lineage_rank}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {inst.biography}
              </p>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingInstructor(inst)}
                  className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 text-xs font-semibold flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(inst.id)}
                  className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-crimson-950 text-gray-400 hover:text-crimson-400 text-xs font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingInstructor.id ? 'Edit Master Record' : 'Add New Instructor'}
              </h3>
              <button
                onClick={() => setEditingInstructor(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Full Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInstructor.name || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Tamil Name (e.g. மாஸ்டர் சிவா)
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.tamil_name || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, tamil_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Title / Specialty
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInstructor.title || ''}
                    onChange={(e) => setEditingInstructor({ ...editingInstructor, title: e.target.value })}
                    placeholder="Chief Master & Heritage Custodian"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
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
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="grandmaster">Grandmaster</option>
                    <option value="head_master">Head Master</option>
                    <option value="senior_instructor">Senior Master</option>
                    <option value="instructor">Lead Instructor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Years of Practice
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingInstructor.years_experience || 0}
                    onChange={(e) =>
                      setEditingInstructor({
                        ...editingInstructor,
                        years_experience: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Lineage Rank (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingInstructor.lineage_rank || ''}
                    onChange={(e) =>
                      setEditingInstructor({ ...editingInstructor, lineage_rank: e.target.value })
                    }
                    placeholder="15th Lineage Successor"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Photo URL or Upload Path
                </label>
                <input
                  type="text"
                  value={editingInstructor.photo_url || ''}
                  onChange={(e) =>
                    setEditingInstructor({ ...editingInstructor, photo_url: e.target.value })
                  }
                  placeholder="/uploads/siva_orig.png"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingInstructor.biography || ''}
                  onChange={(e) =>
                    setEditingInstructor({ ...editingInstructor, biography: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingInstructor(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Save Master Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
