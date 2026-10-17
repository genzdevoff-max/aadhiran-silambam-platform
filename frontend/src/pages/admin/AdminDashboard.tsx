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
  Plus
} from 'lucide-react';
import { adminApi } from '../../services/api';

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

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res && res.stats) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      await adminApi.updateEnquiry(enquiryId, { status: newStatus });
      fetchDashboard();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-mono text-sm">
        Loading association statistics...
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
    <div className="space-y-8">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Persatuan Aadhiran Silambam Pulau Pinang CMS & System Statistics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/media"
            className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 font-semibold text-xs transition-colors flex items-center space-x-1.5 border border-charcoal-700"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Link>

          <Link
            to="/admin/news"
            className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* New Enquiries */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-crimson-950 border border-crimson-800 flex items-center justify-center text-crimson-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats.newEnquiries}
            </span>
            <span className="text-xs text-crimson-400 font-semibold">
              Pending Action
            </span>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold mt-3 flex items-center"
          >
            <span>Review inquiries</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Total Inquiries */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">Total Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal-800 flex items-center justify-center text-gold-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats.totalEnquiries}
            </span>
            <span className="text-xs text-gray-500">All submissions</span>
          </div>
          <span className="text-[11px] text-gray-500 block mt-3">
            Contact & Join applications
          </span>
        </div>

        {/* Achievements */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">Achievements</span>
            <div className="w-8 h-8 rounded-lg bg-gold-950 border border-gold-800 flex items-center justify-center text-gold-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats.achievements}
            </span>
            <span className="text-xs text-gold-400">Verified</span>
          </div>
          <Link
            to="/admin/achievements"
            className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold mt-3 flex items-center"
          >
            <span>Manage records</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Media Assets */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">Media Assets</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal-800 flex items-center justify-center text-crimson-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats.mediaAssets}
            </span>
            <span className="text-xs text-gray-500">Tracked files</span>
          </div>
          <Link
            to="/admin/media"
            className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold mt-3 flex items-center"
          >
            <span>Manage library</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-charcoal-800 text-gold-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Events Scheduled</p>
              <p className="text-lg font-bold text-white">{stats.events}</p>
            </div>
          </div>
          <Link to="/admin/events" className="text-xs text-crimson-400 hover:text-crimson-300">
            View →
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-charcoal-800 text-crimson-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Published Articles</p>
              <p className="text-lg font-bold text-white">{stats.articles}</p>
            </div>
          </div>
          <Link to="/admin/news" className="text-xs text-crimson-400 hover:text-crimson-300">
            View →
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-charcoal-800 text-gold-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Instructors</p>
              <p className="text-lg font-bold text-white">{stats.instructors}</p>
            </div>
          </div>
          <Link to="/admin/instructors" className="text-xs text-crimson-400 hover:text-crimson-300">
            View →
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Management Table */}
      <div className="rounded-3xl bg-charcoal-900 border border-charcoal-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              Recent Website Inquiries & Candidate Applications
            </h3>
            <p className="text-xs text-gray-400">
              Latest submissions received via Contact Us and Join Training forms.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center"
          >
            <span>View All Submissions</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-charcoal-800">
                <tr>
                  <th className="py-3.5 px-6">Candidate / Enquirer</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Contact Details</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Received</th>
                  <th className="py-3.5 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-gray-300">
                {data.recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-charcoal-850/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {enq.full_name}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          enq.enquiry_type === 'join_training'
                            ? 'bg-crimson-950 text-crimson-400 border border-crimson-800'
                            : 'bg-charcoal-800 text-gold-400'
                        }`}
                      >
                        {enq.enquiry_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="text-gray-300">{enq.email}</p>
                        <p className="text-gray-500 font-mono text-[11px]">{enq.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          enq.status === 'new'
                            ? 'bg-crimson-950/80 border-crimson-700 text-crimson-400'
                            : enq.status === 'contacted'
                            ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                            : enq.status === 'enrolled'
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
                    <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="text-gold-400 hover:text-gold-300 font-semibold"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-xs">
            No inquiries logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
