import React, { useEffect, useState } from 'react';
import {
  Flame,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Video
} from 'lucide-react';
import { adminApi, publicApi } from '../../services/api';
import { heroContent as defaultHero, quickFacts as defaultQuickFacts } from '../../data/siteContent';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import type { HeroConfig, QuickFact, SectionVisibilityItem } from '../../types';

export const AdminSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'quickFacts' | 'sections'>('hero');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hero state
  const [hero, setHero] = useState<HeroConfig>({
    badge: defaultHero.badge,
    title: defaultHero.title,
    tamilTitle: defaultHero.tamilTitle,
    subtitle: defaultHero.subtitle,
    bgImage: defaultHero.bgImage,
    videoUrl: defaultHero.videoUrl,
    ctaText: 'Begin Your Training',
    ctaLink: '/join-training',
    secondaryCtaText: 'Watch Archival Documentary',
    secondaryCtaLink: '#documentary',
    stats: defaultHero.stats || [
      { label: 'Lineage Heritage', value: '5,000 Yrs' },
      { label: 'Penang Custodianship', value: 'Since 1936' },
      { label: 'Syllabus Stages', value: '10 Stages' },
      { label: 'Malaysia Book of Records', value: 'Oldest Assoc' },
    ],
  });

  // Quick Facts state
  const [facts, setFacts] = useState<QuickFact[]>(defaultQuickFacts);

  // Section Ordering and Visibility state
  const [sections, setSections] = useState<SectionVisibilityItem[]>([
    { id: 'hero', name: 'Hero Heritage Atmosphere Banner', enabled: true, order: 1 },
    { id: 'quick_facts', name: 'National & Global Quick Facts (MBOR, UNESCO, CNN)', enabled: true, order: 2 },
    { id: 'pillars', name: 'Four Core Martial Lineage Pillars', enabled: true, order: 3 },
    { id: 'syllabus_preview', name: '10-Stage Traditional Syllabus Preview', enabled: true, order: 4 },
    { id: 'achievements_preview', name: 'Verified Achievements & Honors Showcase', enabled: true, order: 5 },
    { id: 'join_cta', name: 'Candidate Admission Call-To-Action Banner', enabled: true, order: 6 },
  ]);

  useEffect(() => {
    const fetchSectionsData = async () => {
      try {
        const data = await publicApi.getSettings();
        if (data && data.hero) {
          setHero((prev) => ({ ...prev, ...data.hero }));
        }
        if (data && data.quick_facts && Array.isArray(data.quick_facts)) {
          setFacts(data.quick_facts);
        }
        if (Array.isArray(data?.section_order)) {
          setSections(data.section_order);
        } else {
          setLoadWarning('No saved homepage section order was returned. The editor is showing its built-in order.');
        }
      } catch {
        setLoadWarning('Homepage content could not be loaded. The editor is showing local defaults; verify every value before saving.');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsData();
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

  const handleHeroChange = (field: keyof HeroConfig, value: any) => {
    setHero((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setFeedback(null);
  };

  const handleStatChange = (index: number, key: 'label' | 'value', value: string) => {
    const newStats = [...hero.stats];
    newStats[index] = { ...newStats[index], [key]: value };
    setHero((prev) => ({ ...prev, stats: newStats }));
    setIsDirty(true);
    setFeedback(null);
  };

  const handleFactChange = (id: string, field: keyof QuickFact, value: string) => {
    setFacts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
    setIsDirty(true);
    setFeedback(null);
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setIsDirty(true);
    setFeedback(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    setSections(reordered.map((item, idx) => ({ ...item, order: idx + 1 })));
    setIsDirty(true);
    setFeedback(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      await adminApi.updateSection('hero', hero);
      await adminApi.updateSection('quick_facts', facts);
      await adminApi.updateSection('section_order', sections);
      setFeedback({ type: 'success', message: 'Hero content and homepage sections saved successfully.' });
      setIsDirty(false);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        'Unable to save all homepage changes. Some earlier requests may have succeeded; review the public site and retry.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#64748B] font-mono text-sm">Loading sections data...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Sections & Hero Editor</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Customize homepage hero presentation, institutional highlights, and section hierarchy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isDirty && (
            <span className="text-xs font-semibold text-[#C6A04A] bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              ● Unsaved Changes
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2 shrink-0"
          >
            <Save className="w-4 h-4 text-[#C6A04A]" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
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

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E3D9] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'hero'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Hero Banner Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quickFacts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'quickFacts'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Quick Facts & Proof Points</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'sections'
              ? 'bg-[#102137] text-white shadow-sm border border-[#102137]'
              : 'bg-white text-[#64748B] hover:text-[#182332] hover:bg-[#F8F5EE] border border-[#E8E3D9]'
          }`}
        >
          <Eye className="w-4 h-4 text-[#C6A04A] shrink-0" />
          <span>Homepage Section Order & Visibility</span>
        </button>
      </div>

      {/* Tab 1: Hero Banner */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Live Preview Box */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E3D9] overflow-hidden relative shadow-sm">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#C6A04A] mb-2">
              Live Mockup Preview
            </span>
            <div className="relative rounded-2xl p-8 text-center overflow-hidden border border-[#183B5B] bg-[#102137]">
              <img
                src={hero.bgImage}
                alt="Backdrop preview"
                className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
              />
              <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-[#C6A04A]/40 text-[#D9B96E] text-[10px] uppercase font-semibold tracking-wider">
                  {hero.badge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-wide">
                  {hero.title}
                </h2>
                <p className="text-xs sm:text-sm font-display text-[#D9B96E]">
                  {hero.tamilTitle}
                </p>
                <p className="text-xs text-white/80 line-clamp-3 max-w-xl mx-auto leading-relaxed">
                  {hero.subtitle}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span className="px-4 py-2 rounded-xl bg-[#C6A04A] text-[#102137] font-semibold text-xs shadow-sm">
                    {hero.ctaText || 'Begin Your Training'}
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs border border-white/20">
                    {hero.secondaryCtaText || 'Watch Archival Documentary'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Hero Text & Messaging
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Badge Text</label>
                <input
                  type="text"
                  value={hero.badge}
                  onChange={(e) => handleHeroChange('badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Main Headline</label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Tamil Header & Subtitle</label>
                <input
                  type="text"
                  value={hero.tamilTitle}
                  onChange={(e) => handleHeroChange('tamilTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1">Hero Narrative Subtitle</label>
                <textarea
                  rows={3}
                  value={hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>
            </div>
          </div>

          {/* Media & Action Links */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Media Backdrops & Action Buttons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <CloudImageUpload
                  value={hero.bgImage}
                  onChange={(url) => handleHeroChange('bgImage', url)}
                  label="Hero Action Background Image (Cloud Backblaze B2)"
                  folder="hero"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1 flex items-center space-x-1.5">
                  <Video className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                  <span>Archival Video Path</span>
                </label>
                <input
                  type="text"
                  value={hero.videoUrl}
                  onChange={(e) => handleHeroChange('videoUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1 flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                  <span>Secondary Video CTA Text</span>
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaText || ''}
                  onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#182332] mb-1 flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                  <span>Primary CTA Button Text & Destination</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={hero.ctaText || ''}
                    onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                    placeholder="Button Text"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                  <input
                    type="text"
                    value={hero.ctaLink || ''}
                    onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
                    placeholder="/join-training"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-mono focus:outline-none focus:border-[#102137]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics / Stats */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E3D9] space-y-4 shadow-sm">
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#102137]">
              Hero Metric Callouts (4 Badges)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] space-y-2">
                  <span className="text-[10px] text-[#64748B] font-mono">Metric #{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] text-[#182332] mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#182332] mb-0.5">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E3D9] text-[#102137] font-bold text-xs focus:outline-none focus:border-[#102137]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quick Facts */}
      {activeTab === 'quickFacts' && (
        <div className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Edit the four key historical milestones highlighted below the hero section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map((fact) => (
              <div key={fact.id} className="p-5 rounded-2xl bg-white border border-[#E8E3D9] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#C6A04A] uppercase tracking-wider">{fact.badge}</span>
                  <input
                    type="text"
                    value={fact.year}
                    onChange={(e) => handleFactChange(fact.id, 'year', e.target.value)}
                    placeholder="Year"
                    className="w-20 px-2.5 py-1 rounded-lg bg-[#F8F5EE] border border-[#E8E3D9] text-right text-xs font-mono text-[#102137] font-bold focus:outline-none focus:border-[#102137]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#182332] mb-0.5 font-semibold">Title</label>
                  <input
                    type="text"
                    value={fact.title}
                    onChange={(e) => handleFactChange(fact.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs font-semibold focus:outline-none focus:border-[#102137]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#182332] mb-0.5 font-semibold">Summary</label>
                  <textarea
                    rows={3}
                    value={fact.description}
                    onChange={(e) => handleFactChange(fact.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#182332] mb-0.5 font-semibold">Linked Page</label>
                  <input
                    type="text"
                    value={fact.link}
                    onChange={(e) => handleFactChange(fact.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#102137] text-xs font-mono focus:outline-none focus:border-[#102137]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Section Order & Visibility */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Control which sections appear on the public homepage and adjust their vertical presentation order.
          </p>

          <div className="space-y-2.5">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  section.enabled
                    ? 'bg-white border-[#E8E3D9] shadow-sm'
                    : 'bg-[#F8F5EE] border-[#E8E3D9] opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#102137] text-[#C6A04A] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {section.order}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#102137]">{section.name}</p>
                    <p className="text-[10px] text-[#64748B] font-mono">ID: {section.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border ${
                      section.enabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-[#64748B] border-gray-200'
                    }`}
                  >
                    {section.enabled ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-2 rounded-lg bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] disabled:opacity-30 text-[#182332]"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-2 rounded-lg bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] disabled:opacity-30 text-[#182332]"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
