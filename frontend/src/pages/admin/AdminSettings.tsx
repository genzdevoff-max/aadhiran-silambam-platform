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
  EyeOff,
  Mail,
  Send,
  Server
} from 'lucide-react';
import { adminApi, publicApi } from '../../services/api';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import { generalInfo } from '../../data/siteContent';
import type { SiteSettingsData, EmailSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'seo' | 'email' | 'security'>('general');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Email & SMTP settings state
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    hasPassword: false,
    fromEmail: 'info@aadhiran.com',
    fromName: 'Persatuan Aadhiran Silambam Pulau Pinang',
    adminNotificationEmail: 'info@aadhiran.com',
    enableAdminNotification: true,
    enableApplicantConfirmation: true,
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState<boolean>(false);
  const [emailSaving, setEmailSaving] = useState<boolean>(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState<string>('info@aadhiran.com');
  const [sendingTestEmail, setSendingTestEmail] = useState<boolean>(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
        const [data, emailData] = await Promise.all([
          publicApi.getSettings().catch(() => null),
          adminApi.getEmailSettings().catch(() => null),
        ]);

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

        if (emailData) {
          setEmailSettings((prev) => ({
            ...prev,
            ...emailData,
          }));
          if (emailData.adminNotificationEmail) {
            setTestEmailRecipient(emailData.adminNotificationEmail);
          }
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

  const handleSaveEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);
    setEmailFeedback(null);
    try {
      const res = await adminApi.updateEmailSettings(emailSettings);
      setEmailFeedback({ type: 'success', message: res.message || 'Email & SMTP settings saved successfully.' });
      if (res.settings) {
        setEmailSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (err: any) {
      setEmailFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save email settings. Please check the values.',
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) {
      setTestEmailFeedback({ type: 'error', message: 'Please provide a valid recipient email address for testing.' });
      return;
    }
    setSendingTestEmail(true);
    setTestEmailFeedback(null);
    try {
      const res = await adminApi.testEmailConnection({
        targetEmail: testEmailRecipient.trim(),
        customConfig: emailSettings,
      });
      setTestEmailFeedback({ type: 'success', message: res.message || 'Test email dispatched successfully! Please check your inbox.' });
    } catch (err: any) {
      setTestEmailFeedback({
        type: 'error',
        message: err.response?.data?.message || 'SMTP connection test failed. Check host, port, username, and password.',
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#64748B] font-mono text-sm">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Site Settings & Governance</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure global association metadata, contact points, SEO parameters, and credentials.
          </p>
        </div>

        {isDirty && activeTab !== 'security' && (
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#C6A04A] bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
            <span>● Unsaved Changes</span>
          </div>
        )}
      </div>

      {/* Global Feedback Banner */}
      {loadWarning && (
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          {loadWarning}
        </div>
      )}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-[#64748B] hover:text-[#182332] text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E3D9] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'general'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Building className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>General & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'contact'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Contact & Premises</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'seo'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Share2 className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>SEO & Social Channels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'email'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Mail className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Email & Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'security'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Account Security</span>
        </button>
      </div>

      {/* Tab 1: General & Identity */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Association Legal Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Website Browser Title *</label>
                <input
                  type="text"
                  required
                  value={settings.siteTitle}
                  onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Official Registered Name *</label>
                <input
                  type="text"
                  required
                  value={settings.siteName}
                  onChange={(e) => handleFieldChange('siteName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Tamil Association Name</label>
                <input
                  type="text"
                  value={settings.tamilName || ''}
                  onChange={(e) => handleFieldChange('tamilName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Founded Year</label>
                <input
                  type="number"
                  value={settings.foundedYear}
                  onChange={(e) => handleFieldChange('foundedYear', parseInt(e.target.value) || 1975)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">ROS Registration Number</label>
                <input
                  type="text"
                  value={settings.registrationNumber}
                  onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Regulatory Authority</label>
                <input
                  type="text"
                  value={settings.registrationBody}
                  onChange={(e) => handleFieldChange('registrationBody', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-[#E8E3D9]">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Official Association Emblem / Logo</label>
                <CloudImageUpload
                  value={settings.logoUrl || '/logo.png'}
                  onChange={(url) => handleFieldChange('logoUrl', url)}
                  label="Upload Official Association Emblem"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-[#C6A04A]" />
              <span>{saving ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Contact & Premises */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Contact Details & Headquarter Premises
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Official Association Email *</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Primary Hotline *</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Secondary / Landline</label>
                <input
                  type="text"
                  value={settings.secondaryPhone || ''}
                  onChange={(e) => handleFieldChange('secondaryPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Street Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">State & Postcode</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                  <input
                    type="text"
                    value={settings.postcode}
                    onChange={(e) => handleFieldChange('postcode', e.target.value)}
                    placeholder="Postcode"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Footer Copyright & Legal Notice</label>
                <textarea
                  rows={2}
                  value={settings.footerNotice || ''}
                  onChange={(e) => handleFieldChange('footerNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-[#C6A04A]" />
              <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: SEO & Social Channels */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Search Engine Optimization (SEO) Metadata
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={settings.metaDescription || ''}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  placeholder="Summary displayed in search results..."
                />
                <p className="text-[10px] text-[#64748B] mt-1">Recommended length: 150-160 characters.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={settings.metaKeywords || ''}
                  onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Social Media & Direct Channels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={settings.socials.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={settings.socials.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={settings.socials.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  value={settings.socials.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1">WhatsApp Direct Contact Link</label>
                <input
                  type="url"
                  value={settings.socials.whatsapp || ''}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="https://wa.me/60164147856"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-[#C6A04A]" />
              <span>{saving ? 'Saving...' : 'Save SEO & Socials'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Email & Notifications */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveEmailSettings} className="space-y-6">
            {emailFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  emailFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {emailFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{emailFeedback.message}</span>
              </div>
            )}

            {/* SMTP Server Configuration */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#E8E3D9]">
                <div className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9]">
                  <Server className="w-5 h-5 text-[#C6A04A] shrink-0" />
                </div>
                <div>
                  <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
                    Outbound SMTP Server Configuration
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Configure your mail delivery service (Gmail, SendGrid, Amazon SES, or custom cPanel mail).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#182332] mb-1">SMTP Host Server *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. smtp.gmail.com or mail.aadhiran.com"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">Port *</label>
                  <input
                    type="number"
                    required
                    placeholder="587 or 465"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">SMTP Username / Login Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. info@aadhiran.com"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">
                    SMTP Password / App Password {emailSettings.hasPassword && <span className="text-emerald-600 text-[10px] ml-1">(Configured)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? 'text' : 'password'}
                      placeholder={emailSettings.hasPassword ? '•••••••• (leave unchanged to keep)' : 'Enter SMTP password or app token'}
                      value={emailSettings.smtpPass}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })}
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#182332]"
                    >
                      {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={emailSettings.smtpSecure}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpSecure: e.target.checked })}
                  className="w-4 h-4 rounded text-[#102137] focus:ring-[#102137] border-[#E8E3D9]"
                />
                <label htmlFor="smtpSecure" className="text-xs text-[#182332] font-semibold cursor-pointer">
                  Use SSL direct encryption (Required for Port 465; leave unchecked for STARTTLS / Port 587)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E8E3D9]">
                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">Sender From Name</label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">Sender From Email</label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Notification & Confirmation Routing */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#E8E3D9]">
                <div className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9]">
                  <Mail className="w-5 h-5 text-[#C6A04A] shrink-0" />
                </div>
                <div>
                  <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
                    Enquiry Notification Routing
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Specify where incoming contact inquiries and student applications should be alerted.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Admin Notification Recipient Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. info@aadhiran.com"
                  value={emailSettings.adminNotificationEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, adminNotificationEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  All new contact enquiries and student applications will trigger an instant email alert to this address.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableAdminNotification}
                    onChange={(e) => setEmailSettings({ ...emailSettings, enableAdminNotification: e.target.checked })}
                    className="w-4 h-4 rounded text-[#102137] focus:ring-[#102137] border-[#E8E3D9]"
                  />
                  <span className="text-xs text-[#182332] font-semibold">
                    Send real-time alert email to association administration upon new form submission
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableApplicantConfirmation}
                    onChange={(e) => setEmailSettings({ ...emailSettings, enableApplicantConfirmation: e.target.checked })}
                    className="w-4 h-4 rounded text-[#102137] focus:ring-[#102137] border-[#E8E3D9]"
                  />
                  <span className="text-xs text-[#182332] font-semibold">
                    Send automated confirmation receipt email to the applicant / visitor with intake guidance
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#E8E3D9]">
                <button
                  type="submit"
                  disabled={emailSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
                >
                  <Save className="w-4 h-4 text-[#C6A04A]" />
                  <span>{emailSaving ? 'Saving...' : 'Save Email Settings'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Interactive SMTP Connection Test Box */}
          <div className="p-6 rounded-2xl bg-[#F8F5EE] border border-[#E8E3D9] space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 pb-2 border-b border-[#E8E3D9]">
              <div className="p-2 rounded-xl bg-[#102137] text-[#C6A04A]">
                <Send className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
                  Verify Outbound SMTP Connection
                </h3>
                <p className="text-xs text-[#64748B]">
                  Dispatch an immediate test email to verify credentials and firewall connectivity.
                </p>
              </div>
            </div>

            {testEmailFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  testEmailFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {testEmailFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testEmailFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Destination Test Recipient Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. your-email@domain.com"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={sendingTestEmail}
                className="px-6 py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] disabled:opacity-50 text-[#102137] font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 shrink-0"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{sendingTestEmail ? 'Testing Connection...' : 'Send Test Email'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 5: Account Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Administrator Password Management
            </h2>
            <p className="text-xs text-[#64748B]">
              Update your individual administrator password. Passwords are salted and hashed using bcrypt.
            </p>

            {passwordFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  passwordFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#182332]"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">New Password (Min 8 Characters) *</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#182332]"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#182332]"
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
              className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
            >
              <Lock className="w-4 h-4 text-[#C6A04A]" />
              <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
