import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { SyllabusStage } from '../../types';

export const AdminSyllabus: React.FC = () => {
  const [stages, setStages] = useState<SyllabusStage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<Partial<SyllabusStage> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStages = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getSyllabus();
      if (!Array.isArray(data)) throw new Error('Unexpected syllabus response.');
      setStages(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load syllabus stages.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;

    try {
      if (editingStage.id) {
        await adminApi.updateStage(editingStage.id, editingStage);
        setFeedback({ type: 'success', message: 'Syllabus stage updated successfully.' });
      } else {
        await adminApi.createStage(editingStage);
        setFeedback({ type: 'success', message: 'New syllabus stage created successfully.' });
      }
      setEditingStage(null);
      fetchStages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this syllabus stage?')) return;
    try {
      await adminApi.deleteStage(id);
      setFeedback({ type: 'success', message: 'Stage removed successfully.' });
      fetchStages();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete stage.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>10-Stage Traditional Syllabus Manager</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage the sequential stages of the ancient Tamil custom martial curriculum.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingStage({
              stage_number: stages.length + 1,
              tamil_name: '',
              english_name: '',
              overview: '',
              key_techniques: '',
              weapon_focus: '',
              animal_movements: '',
              sort_order: stages.length + 1,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C6A04A]" />
          <span>Add Stage</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-[#64748B] hover:text-[#182332]">✕</button>
        </div>
      )}

      {/* Stages List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#64748B] font-mono">Loading syllabus stages...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchStages()} />
      ) : stages.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E3D9] bg-white p-10 text-center text-sm text-[#64748B]">
          No syllabus stages have been added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <span className="w-12 h-12 rounded-2xl bg-[#102137] border border-[#183B5B] flex items-center justify-center font-mono font-bold text-base text-[#C6A04A] shadow-sm shrink-0">
                  {stage.stage_number}
                </span>
                <div className="space-y-1 min-w-0">
                  <span className="text-xs font-mono font-bold text-[#C6A04A] block">
                    {stage.tamil_name}
                  </span>
                  <h3 className="text-base font-display font-bold text-[#102137]">
                    {stage.english_name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 max-w-2xl leading-relaxed">
                    {stage.overview}
                  </p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-[#64748B] pt-1 font-mono">
                    <span className="text-[#102137] font-semibold">Weapons: {stage.weapon_focus || 'None'}</span>
                    {stage.animal_movements && <span className="text-[#C6A04A]">• Postures: {stage.animal_movements}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setEditingStage(stage)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8F5EE] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#C6A04A]" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(stage.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/60 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Syllabus stage editor" tabIndex={-1} className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-display font-bold text-[#102137]">
                {editingStage.id ? `Edit Stage ${editingStage.stage_number}` : 'Create New Syllabus Stage'}
              </h3>
              <button
                onClick={() => setEditingStage(null)}
                className="text-[#64748B] hover:text-[#182332] p-1.5 rounded-lg hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                    Stage Number (1–10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={editingStage.stage_number || ''}
                    onChange={(e) =>
                      setEditingStage({ ...editingStage, stage_number: parseInt(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                    Tamil Title (e.g. கம்பு வீச்சு)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStage.tamil_name || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, tamil_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                  English Designation
                </label>
                <input
                  type="text"
                  required
                  value={editingStage.english_name || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, english_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                  Overview & Pedagogical Goal
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingStage.overview || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, overview: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                    Key Techniques
                  </label>
                  <input
                    type="text"
                    value={editingStage.key_techniques || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, key_techniques: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                    Weapon Focus
                  </label>
                  <input
                    type="text"
                    value={editingStage.weapon_focus || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, weapon_focus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">
                  Animal Postures / Battlefield Movements
                </label>
                <input
                  type="text"
                  value={editingStage.animal_movements || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, animal_movements: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStage(null)}
                  className="px-4 py-2 rounded-xl bg-white text-[#64748B] hover:text-[#182332] text-xs font-semibold border border-[#E8E3D9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-sm"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
