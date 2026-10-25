import React, { useEffect, useState } from 'react';
import {
  Settings,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Share2,
  Building,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminApi, publicApi } from '../../services/api';
import { generalInfo } from '../../data/siteContent';
import type { SiteSettingsData } from '../../types';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'seo' | 'security'>('general');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // General, Contact & SEO Settings state
  const [settings, setSettings] = useState<SiteSettingsData>({
    siteTitle: generalInfo.siteTitle,
    siteName: generalInfo.siteName,
    tamilName: generalInfo.tamilName,
    tagline: 'Authentic 5,000-Year Ancient Tamil Martial Art in Penang',
    metaDescription:
      'Official website of Persatuan Aadhiran Silambam Pulau Pinang. Safeguarding the unbroken 10-stage syllabus and Kurunji lineage in George Town since 1936.',
    metaKeywords: 'Silambam, Martial Arts, Penang, George Town, UNESCO, Living Heritage, Malaysia',
    foundedYear: generalInfo.foundedYear,
    registrationNumber: generalInfo.registrationNumber,
    registrationBody: generalInfo.registrationBody,
    email: generalInfo.email,
    phone: generalInfo.phone,
    secondaryPhone: generalInfo.secondaryPhone,
    address: generalInfo.address,
    city: generalInfo.city,
    state: generalInfo.state,
    postcode: generalInfo.postcode,
    country: generalInfo.country,
    socials: {
      facebook: generalInfo.socials.facebook,
      instagram: generalInfo.socials.instagram,
      youtube: generalInfo.socials.youtube,
      twitter: generalInfo.socials.twitter,
      whatsapp: 'https://wa.me/60164147856',
    },
    footerNotice: '© 1975–2026 Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975). All rights reserved.',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<{ current: boolean; new: boolean; confirm: boolean }>({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState<boolean>(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await publicApi.getSettings();
        if (data && data.general) {
          const socials = data.general.socials || {};
          setSettings((prev) => ({
            ...prev,
            ...data.general,
            socials: {
              ...prev.socials,
              facebook: socials.facebook ?? data.general.facebook ?? prev.socials.facebook,
              instagram: socials.instagram ?? data.general.instagram ?? prev.socials.instagram,
              youtube: socials.youtube ?? data.general.youtube ?? prev.socials.youtube,
              twitter: socials.twitter ?? data.general.twitter ?? prev.socials.twitter,
              whatsapp: socials.whatsapp ?? data.general.whatsapp ?? prev.socials.whatsapp,
            },
          }));
        } else {
          setLoadWarning('No saved site settings were returned. The form is showing local defaults; verify all values before saving.');
        }
      } catch {
        setLoadWarning('Saved site settings could not be loaded. The form is showing local defaults; verify all values before saving.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty]);

  const handleFieldChange = (field: keyof SiteSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setFeedback(null);
  };

  const handleSocialChange = (network: keyof SiteSettingsData['socials'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [network]: value,
      },
    }));
    setIsDirty(true);
    setFeedback(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Validation
    if (!settings.siteTitle.trim() || !settings.email.trim() || !settings.phone.trim()) {
      setFeedback({ type: 'error', message: 'Site title, email, and primary phone number cannot be blank.' });
      setSaving(false);
      return;
    }

    try {
      await adminApi.updateSection('general', {
        ...settings,
        facebook: settings.socials.facebook,
        instagram: settings.socials.instagram,
        youtube: settings.socials.youtube,
        twitter: settings.socials.twitter,
        whatsapp: settings.socials.whatsapp,
      });
      setFeedback({ type: 'success', message: 'Site settings and metadata saved successfully.' });
      setIsDirty(false);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        'Unable to save site settings. Your changes are still on this page; please retry.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!passwordData.currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please enter your current administrator password.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'New security password must be at least 8 characters in length.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password confirmation does not match.' });
      return;
    }

    setPasswordSaving(true);
    try {
      await adminApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordFeedback({ type: 'success', message: 'Administrator security password updated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        'Unable to update the password. Please check the current password and try again.';
      setPasswordFeedback({ type: 'error', message: errMsg });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <Settings className="w-7 h-7 text-crimson-500" />
            <span>Site Settings & Governance</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure global association metadata, contact points, SEO parameters, and credentials.
          </p>
        </div>

        {isDirty && activeTab !== 'security' && (
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-xl">
            <span>● Unsaved Changes</span>
          </div>
        )}
      </div>

      {/* Global Feedback Banner */}
      {loadWarning && (
        <div role="status" className="rounded-xl border border-amber-800/80 bg-amber-950/50 p-4 text-xs text-amber-200">
          {loadWarning}
        </div>
      )}
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
          <button onClick={() => setFeedback(null)} className="ml-auto text-gray-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-charcoal-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'general'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>General & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'contact'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Contact & Premises</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'seo'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>SEO & Social Channels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'security'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Account Security</span>
        </button>
      </div>

      {/* Tab 1: General & Identity */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Association Legal Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Website Browser Title *</label>
                <input
                  type="text"
                  required
                  value={settings.siteTitle}
                  onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Official Registered Name *</label>
                <input
                  type="text"
                  required
                  value={settings.siteName}
                  onChange={(e) => handleFieldChange('siteName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tamil Association Name</label>
                <input
                  type="text"
                  value={settings.tamilName || ''}
                  onChange={(e) => handleFieldChange('tamilName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Founded Year</label>
                <input
                  type="number"
                  value={settings.foundedYear}
                  onChange={(e) => handleFieldChange('foundedYear', parseInt(e.target.value) || 1975)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">ROS Registration Number</label>
                <input
                  type="text"
                  value={settings.registrationNumber}
                  onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Regulatory Authority</label>
                <input
                  type="text"
                  value={settings.registrationBody}
                  onChange={(e) => handleFieldChange('registrationBody', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Contact & Premises */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Contact Details & Headquarter Premises
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Official Association Email *</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Hotline *</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Secondary / Landline</label>
                <input
                  type="text"
                  value={settings.secondaryPhone || ''}
                  onChange={(e) => handleFieldChange('secondaryPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">State & Postcode</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    value={settings.postcode}
                    onChange={(e) => handleFieldChange('postcode', e.target.value)}
                    placeholder="Postcode"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Footer Copyright & Legal Notice</label>
                <textarea
                  rows={2}
                  value={settings.footerNotice || ''}
                  onChange={(e) => handleFieldChange('footerNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: SEO & Social Channels */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Search Engine Optimization (SEO) Metadata
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={settings.metaDescription || ''}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  placeholder="Summary displayed in search results..."
                />
                <p className="text-[10px] text-gray-500 mt-1">Recommended length: 150-160 characters.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={settings.metaKeywords || ''}
                  onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Social Media & Direct Channels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={settings.socials.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={settings.socials.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={settings.socials.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  value={settings.socials.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp Direct Contact Link</label>
                <input
                  type="url"
                  value={settings.socials.whatsapp || ''}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="https://wa.me/60164147856"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save SEO & Socials'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Account Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Administrator Password Management
            </h2>
            <p className="text-xs text-gray-400">
              Update your individual administrator password. Passwords are salted and hashed using bcrypt.
            </p>

            {passwordFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  passwordFeedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
                    : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
                }`}
              >
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-crimson-400 flex-shrink-0" />
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">New Password (Min 8 Characters) *</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
