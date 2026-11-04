import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Award,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Users,
  ChevronRight,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError } from '../../components/admin/AdminRequestState';

interface DashboardData {
  stats: {
    totalEnquiries: number;
    newEnquiries: number;
    achievements: number;
    events: number;
    articles: number;
    mediaAssets: number;
    instructors: number;
  };
  recentEnquiries: Array<{
    id: string;
    enquiry_type: string;
    full_name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDashboard = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setLoadError(null);
    }
    try {
      const res = await adminApi.getDashboard();
      if (res && res.stats) {
        setData(res);
      } else {
        throw new Error('Unexpected dashboard response.');
      }
    } catch {
      setData(null);
      setLoadError('Unable to load dashboard data from the server. Check the connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(false);
  }, []);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    setActionError(null);
    try {
      await adminApi.updateEnquiry(enquiryId, { status: newStatus });
      await fetchDashboard();
    } catch {
      setActionError('Unable to update this enquiry status. Please retry.');
    }
  };

  if (loadError) {
    return <AdminRequestError message={loadError} onRetry={() => fetchDashboard()} />;
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-[#64748B] font-sans text-sm flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#C6A04A] border-t-transparent rounded-full animate-spin" />
        <span>Loading association statistics...</span>
      </div>
    );
  }

  const stats = data?.stats || {
    totalEnquiries: 0,
    newEnquiries: 0,
    achievements: 0,
    events: 0,
    articles: 0,
    mediaAssets: 0,
    instructors: 0,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Persatuan Aadhiran Silambam Pulau Pinang CMS & System Statistics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/media"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#102137] font-medium text-xs transition-all inline-flex items-center gap-2 border border-[#E8E3D9] shadow-sm hover:border-[#C6A04A]"
          >
            <ImageIcon className="w-4 h-4 text-[#C6A04A] shrink-0" />
            <span>Upload Media</span>
          </Link>

          <Link
            to="/admin/news"
            className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wide uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60"
          >
            <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {actionError}
        </div>
      )}

      {/* Metrics Cards Grid — Heritage Navy & Gold Design System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Inquiries */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm relative overflow-hidden group hover:border-[#C6A04A] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#C6A04A]" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">New Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
              <MessageSquare className="w-4 h-4 text-[#C6A04A] shrink-0" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#102137]">
              {stats.newEnquiries}
            </span>
            <span className="text-xs text-[#C6A04A] font-semibold px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#E8E3D9]">
              Pending
            </span>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-[11px] text-[#183B5B] hover:text-[#C6A04A] font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Review inquiries</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>

        {/* Card 2: Total Enquiries */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm relative overflow-hidden group hover:border-[#102137] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#102137]" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
              <TrendingUp className="w-4 h-4 text-[#102137] shrink-0" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#102137]">
              {stats.totalEnquiries}
            </span>
            <span className="text-xs text-[#64748B]">All time</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-4">
            Contact & Join applications
          </span>
        </div>

        {/* Card 3: Achievements */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm relative overflow-hidden group hover:border-[#C6A04A] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#C6A04A]" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Achievements</span>
            <div className="w-9 h-9 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
              <Award className="w-4 h-4 text-[#C6A04A] shrink-0" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#102137]">
              {stats.achievements}
            </span>
            <span className="text-xs text-[#102137] font-semibold px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#E8E3D9]">
              MBOR Verified
            </span>
          </div>
          <Link
            to="/admin/achievements"
            className="text-[11px] text-[#183B5B] hover:text-[#C6A04A] font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Manage records</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>

        {/* Card 4: Media Assets */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm relative overflow-hidden group hover:border-[#183B5B] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#183B5B]" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">B2 Cloud Media</span>
            <div className="w-9 h-9 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
              <ImageIcon className="w-4 h-4 text-[#183B5B] shrink-0" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#102137]">
              {stats.mediaAssets}
            </span>
            <span className="text-xs text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              Connected
            </span>
          </div>
          <Link
            to="/admin/media"
            className="text-[11px] text-[#183B5B] hover:text-[#C6A04A] font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Browse gallery</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] shrink-0">
              <Calendar className="w-4 h-4 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Events Scheduled</p>
              <p className="text-lg font-bold text-[#102137]">{stats.events}</p>
            </div>
          </div>
          <Link to="/admin/events" className="text-xs text-[#183B5B] hover:text-[#C6A04A] font-semibold inline-flex items-center gap-1">
            <span>View</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] shrink-0">
              <BookOpen className="w-4 h-4 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Published Articles</p>
              <p className="text-lg font-bold text-[#102137]">{stats.articles}</p>
            </div>
          </div>
          <Link to="/admin/news" className="text-xs text-[#183B5B] hover:text-[#C6A04A] font-semibold inline-flex items-center gap-1">
            <span>View</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] shrink-0">
              <Users className="w-4 h-4 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Active Instructors</p>
              <p className="text-lg font-bold text-[#102137]">{stats.instructors}</p>
            </div>
          </div>
          <Link to="/admin/instructors" className="text-xs text-[#183B5B] hover:text-[#C6A04A] font-semibold inline-flex items-center gap-1">
            <span>View</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Management Table */}
      <div className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-[#E8E3D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8F5EE]">
          <div>
            <h2 className="text-lg font-bold text-[#102137] tracking-tight">
              Recent Inquiries & Applications
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Latest submissions received via Contact Us and Join Training forms.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-[#102137] hover:text-[#C6A04A] inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E8E3D9] transition-colors shrink-0"
          >
            <span>View All Submissions</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>

        {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-[#FDFBF7] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E8E3D9]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Candidate / Enquirer</th>
                  <th className="py-3.5 px-6 font-semibold">Type</th>
                  <th className="py-3.5 px-6 font-semibold">Contact Details</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold">Received</th>
                  <th className="py-3.5 px-6 text-right font-semibold">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D9] text-[#182332]">
                {data.recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8F5EE] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#102137]">
                      {enq.full_name}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          enq.enquiry_type === 'join_training'
                            ? 'bg-[#102137] text-white'
                            : 'bg-[#F8F5EE] text-[#102137] border border-[#E8E3D9]'
                        }`}
                      >
                        {enq.enquiry_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="text-[#182332]">{enq.email}</p>
                        <p className="text-[#64748B] font-mono text-[11px]">{enq.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className="text-[11px] font-semibold rounded-lg px-2.5 py-1 border border-[#E8E3D9] bg-white text-[#102137] focus:outline-none focus:border-[#C6A04A]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-[#64748B] font-mono text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[#64748B] text-xs">
            No inquiries logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
