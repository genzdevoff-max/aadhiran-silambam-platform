import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { Enquiry } from '../../types';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getEnquiries();
      if (!Array.isArray(data)) throw new Error('Unexpected enquiries response.');
      setEnquiries(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load enquiries.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateEnquiry(id, { status: newStatus });
      setFeedback({ type: 'success', message: 'Enquiry status updated successfully.' });
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as Enquiry['status'] });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await adminApi.deleteEnquiry(id);
      setFeedback({ type: 'success', message: 'Enquiry removed successfully.' });
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const filtered = enquiries.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesQuery =
      item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone?.includes(searchQuery) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <MessageSquare className="w-7 h-7 text-crimson-500" />
            <span>Contact & Join Enquiries</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review submissions from the public Contact Us and Join Training application forms.
          </p>
        </div>
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
          <button
            onClick={() => setFeedback(null)}
            className="ml-auto text-gray-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">
          Loading candidate submissions...
        </div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchEnquiries()} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          {enquiries.length === 0 ? 'No enquiries have been received yet.' : 'No enquiries match the selected filters.'}
        </div>
      ) : (
        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-charcoal-800">
                <tr>
                  <th className="py-3 px-5">Candidate Name</th>
                  <th className="py-3 px-5">Type</th>
                  <th className="py-3 px-5">Contact Details</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Received</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-gray-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-charcoal-850/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white">
                      {item.full_name}
                      {item.age_group && (
                        <span className="block text-[10px] text-gray-500 font-mono">
                          Age: {item.age_group}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          item.enquiry_type === 'join_training'
                            ? 'bg-crimson-950 text-crimson-400 border border-crimson-800'
                            : 'bg-charcoal-800 text-gold-400'
                        }`}
                      >
                        {item.enquiry_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <span className="flex items-center text-gray-300">
                          <Mail className="w-3 h-3 mr-1 text-gray-500" />
                          {item.email}
                        </span>
                        {item.phone && (
                          <span className="flex items-center text-gray-500 font-mono text-[11px]">
                            <Phone className="w-3 h-3 mr-1 text-gray-500" />
                            {item.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          item.status === 'new'
                            ? 'bg-crimson-950/80 border-crimson-700 text-crimson-400'
                            : item.status === 'contacted'
                            ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                            : item.status === 'enrolled'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                            : 'bg-charcoal-800 border-charcoal-700 text-gray-400'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-gray-400 font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 font-semibold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded bg-charcoal-800 hover:bg-crimson-950 text-gray-400 hover:text-crimson-400"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Enquiry details" tabIndex={-1} className="relative w-full max-w-lg bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl p-6 space-y-4 max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-charcoal-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase">
                  {selectedEnquiry.enquiry_type.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {selectedEnquiry.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Email:</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-gold-400 hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500 block">Phone:</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="text-gold-400 hover:underline">
                  {selectedEnquiry.phone}
                </a>
              </div>
              {selectedEnquiry.age_group && (
                <div>
                  <span className="text-gray-500 block">Age Group:</span>
                  <span className="text-gray-300">{selectedEnquiry.age_group}</span>
                </div>
              )}
              {selectedEnquiry.experience_level && (
                <div>
                  <span className="text-gray-500 block">Experience:</span>
                  <span className="text-gray-300">{selectedEnquiry.experience_level}</span>
                </div>
              )}
              {selectedEnquiry.preferred_location && (
                <div className="col-span-2">
                  <span className="text-gray-500 block">Location:</span>
                  <span className="text-gray-300">{selectedEnquiry.preferred_location}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-gray-500 block flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Submitted Date:
                </span>
                <span className="text-gray-300 font-mono text-[11px]">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-charcoal-800">
              <span className="text-xs text-gray-500 block mb-1">Message / Training Goals:</span>
              <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message || 'No additional message provided.'}
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-charcoal-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="px-2.5 py-1 rounded bg-charcoal-800 text-white text-xs border border-charcoal-700"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
