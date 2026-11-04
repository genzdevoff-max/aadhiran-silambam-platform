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
  AlertCircle,
  X
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Contact & Join Enquiries</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review submissions from the public Contact Us and Join Training application forms.
          </p>
        </div>
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
          <button
            onClick={() => setFeedback(null)}
            className="text-[#64748B] hover:text-[#182332] text-xs px-2 py-1 rounded hover:bg-black/5 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, email, phone or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#102137] transition-colors shadow-sm"
          />
        </div>

        <div className="relative sm:w-56 shrink-0">
          <Filter className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] transition-colors shadow-sm"
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
        <div className="p-12 text-center text-[#64748B] font-mono text-sm">
          Loading candidate submissions...
        </div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchEnquiries()} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E3D9] text-[#64748B] text-xs">
          {enquiries.length === 0 ? 'No enquiries have been received yet.' : 'No enquiries match the selected filters.'}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-[#F8F5EE] text-[#102137] uppercase font-mono text-[10px] tracking-wider border-b border-[#E8E3D9]">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Candidate Name</th>
                  <th className="py-3.5 px-5 font-bold">Type</th>
                  <th className="py-3.5 px-5 font-bold">Contact Details</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold">Received</th>
                  <th className="py-3.5 px-5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D9] text-[#182332]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#102137]">
                      {item.full_name}
                      {item.age_group && (
                        <span className="block text-[10px] text-[#C6A04A] font-mono">
                          Age: {item.age_group}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          item.enquiry_type === 'join_training'
                            ? 'bg-[#102137]/10 text-[#102137] border border-[#102137]/20'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.enquiry_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[#182332] text-xs">
                          <Mail className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                          <span>{item.email}</span>
                        </span>
                        {item.phone && (
                          <span className="inline-flex items-center gap-1.5 text-[#64748B] font-mono text-[11px] block">
                            <Phone className="w-3 h-3 text-[#64748B] shrink-0" />
                            <span>{item.phone}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors ${
                          item.status === 'new'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : item.status === 'contacted'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : item.status === 'enrolled'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-gray-100 border-gray-200 text-[#64748B]'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-[#64748B] font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedEnquiry(item)}
                          className="px-3 py-1 rounded-lg bg-white hover:bg-[#F8F5EE] text-[#102137] font-semibold border border-[#E8E3D9] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/60 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Enquiry details" tabIndex={-1} className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl p-6 space-y-4 max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E8E3D9] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#C6A04A] uppercase tracking-wider block mb-0.5">
                  {selectedEnquiry.enquiry_type.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-display font-bold text-[#102137]">
                  {selectedEnquiry.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-[#64748B] hover:text-[#182332] p-1.5 rounded-lg hover:bg-[#F8F5EE] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                <span className="text-[#64748B] block mb-0.5">Email Address:</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-[#102137] hover:underline font-medium break-all">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                <span className="text-[#64748B] block mb-0.5">Phone Number:</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="text-[#102137] hover:underline font-mono">
                  {selectedEnquiry.phone}
                </a>
              </div>
              {selectedEnquiry.age_group && (
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                  <span className="text-[#64748B] block mb-0.5">Age Group:</span>
                  <span className="text-[#182332] font-medium">{selectedEnquiry.age_group}</span>
                </div>
              )}
              {selectedEnquiry.experience_level && (
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                  <span className="text-[#64748B] block mb-0.5">Experience:</span>
                  <span className="text-[#182332] font-medium">{selectedEnquiry.experience_level}</span>
                </div>
              )}
              {selectedEnquiry.preferred_location && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                  <span className="text-[#64748B] block mb-0.5">Location:</span>
                  <span className="text-[#182332] font-medium">{selectedEnquiry.preferred_location}</span>
                </div>
              )}
              <div className="sm:col-span-2 p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                <span className="text-[#64748B] mb-0.5 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                  <span>Submitted Date:</span>
                </span>
                <span className="text-[#182332] font-mono text-[11px] block mt-0.5">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E3D9]">
              <span className="text-xs text-[#182332] block mb-1 font-semibold">Message / Training Goals:</span>
              <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-xs text-[#182332] whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message || 'No additional message provided.'}
              </div>
            </div>

            <div className="pt-3 flex flex-wrap justify-between items-center gap-3 border-t border-[#E8E3D9]">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-[#182332]">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#182332] text-xs border border-[#E8E3D9] focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="inline-flex items-center gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(
                    `Regarding Your Silambam Enquiry - Persatuan Aadhiran Silambam Pulau Pinang`
                  )}&body=${encodeURIComponent(
                    `Vanakkam ${selectedEnquiry.full_name},\n\nThank you for contacting Persatuan Aadhiran Silambam Pulau Pinang.\n\nRegarding your enquiry:\n"${selectedEnquiry.message || ''}"\n\nKind regards,\nPersatuan Aadhiran Silambam Pulau Pinang\nGeorge Town, Penang, Malaysia`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#102137] border border-[#E8E3D9] text-xs font-semibold transition-all shadow-sm"
                  title="Open mail application to send a direct response"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-medium transition-all shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
