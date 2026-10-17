import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { SyllabusStage } from '../../types';

export const AdminSyllabus: React.FC = () => {
  const [stages, setStages] = useState<SyllabusStage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingStage, setEditingStage] = useState<Partial<SyllabusStage> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStages = async () => {
    try {
      const data = await adminApi.getSyllabus();
      if (Array.isArray(data)) {
        setStages(data);
      }
    } catch (e) {
      console.error('Failed to load syllabus stages', e);
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
          <h1 className="text-2xl font-display font-bold text-white">
            10-Stage Traditional Syllabus Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
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
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stage</span>
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

      {/* Stages List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-mono">Loading syllabus stages...</div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <span className="w-10 h-10 rounded-xl bg-crimson-950 border border-crimson-700 flex items-center justify-center font-mono font-bold text-sm text-gold-400 flex-shrink-0">
                  {stage.stage_number}
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-gold-400">
                    {stage.tamil_name}
                  </span>
                  <h3 className="text-base font-display font-bold text-white">
                    {stage.english_name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 max-w-2xl leading-relaxed">
                    {stage.overview}
                  </p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 pt-1 font-mono">
                    <span>Weapons: {stage.weapon_focus || 'None'}</span>
                    {stage.animal_movements && <span>• Postures: {stage.animal_movements}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => setEditingStage(stage)}
                  className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 text-xs font-semibold flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(stage.id)}
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

      {/* Edit / Create Modal */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingStage.id ? `Edit Stage ${editingStage.stage_number}` : 'Create New Syllabus Stage'}
              </h3>
              <button
                onClick={() => setEditingStage(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
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
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Tamil Title (e.g. கம்பு வீச்சு)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStage.tamil_name || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, tamil_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  English Designation
                </label>
                <input
                  type="text"
                  required
                  value={editingStage.english_name || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, english_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Overview & Pedagogical Goal
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingStage.overview || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Key Techniques
                  </label>
                  <input
                    type="text"
                    value={editingStage.key_techniques || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, key_techniques: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Weapon Focus
                  </label>
                  <input
                    type="text"
                    value={editingStage.weapon_focus || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, weapon_focus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Animal Postures / Battlefield Movements
                </label>
                <input
                  type="text"
                  value={editingStage.animal_movements || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, animal_movements: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingStage(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold hover:bg-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
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
