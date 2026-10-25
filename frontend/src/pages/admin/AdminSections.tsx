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
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { adminApi, publicApi } from '../../services/api';
import { heroContent as defaultHero, quickFacts as defaultQuickFacts } from '../../data/siteContent';
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
    return <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading sections data...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <Flame className="w-7 h-7 text-crimson-500" />
            <span>Sections & Hero Editor</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Customize homepage hero presentation, institutional highlights, and section hierarchy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isDirty && (
            <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-xl">
              ● Unsaved Changes
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
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

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-charcoal-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'hero'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Banner Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quickFacts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'quickFacts'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Quick Facts & Proof Points</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'sections'
              ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
              : 'bg-charcoal-900 text-gray-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Homepage Section Order & Visibility</span>
        </button>
      </div>

      {/* Tab 1: Hero Banner */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Live Preview Box */}
          <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 overflow-hidden relative shadow-xl">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-gold-400 mb-2">
              Live Mockup Preview
            </span>
            <div className="relative rounded-2xl p-8 text-center overflow-hidden border border-charcoal-700 bg-black/60">
              <img
                src={hero.bgImage}
                alt="Backdrop preview"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-charcoal-900/80 border border-gold-500/30 text-gold-400 text-[10px] uppercase font-semibold tracking-wider">
                  {hero.badge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-wider">
                  {hero.title}
                </h2>
                <p className="text-xs sm:text-sm font-display text-gold-300">
                  {hero.tamilTitle}
                </p>
                <p className="text-xs text-gray-300 line-clamp-3 max-w-xl mx-auto">
                  {hero.subtitle}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span className="px-4 py-2 rounded-xl bg-crimson-600 text-white font-semibold text-xs border border-gold-500/40 shadow">
                    {hero.ctaText || 'Begin Your Training'}
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 font-semibold text-xs border border-charcoal-700">
                    {hero.secondaryCtaText || 'Watch Archival Documentary'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Hero Text & Messaging
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={hero.badge}
                  onChange={(e) => handleHeroChange('badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tamil Header & Subtitle</label>
                <input
                  type="text"
                  value={hero.tamilTitle}
                  onChange={(e) => handleHeroChange('tamilTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Narrative Subtitle</label>
                <textarea
                  rows={3}
                  value={hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Media & Action Links */}
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Media Backdrops & Action Buttons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span>Background Image Path</span>
                </label>
                <input
                  type="text"
                  value={hero.bgImage}
                  onChange={(e) => handleHeroChange('bgImage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
                <div className="flex gap-2 mt-2 text-[11px] text-gray-400">
                  <span className="text-gray-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleHeroChange('bgImage', '/uploads/silambam-back.jpg')}
                    className="hover:text-gold-400 underline"
                  >
                    silambam-back.jpg
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeroChange('bgImage', '/uploads/mariapaqiam4.png')}
                    className="hover:text-gold-400 underline"
                  >
                    mariapaqiam4.png
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center space-x-1.5">
                  <Video className="w-3.5 h-3.5 text-gold-400" />
                  <span>Archival Video Path</span>
                </label>
                <input
                  type="text"
                  value={hero.videoUrl}
                  onChange={(e) => handleHeroChange('videoUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                />
                <div className="flex gap-2 mt-2 text-[11px] text-gray-400">
                  <span className="text-gray-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleHeroChange('videoUrl', '/uploads/VID-20231026-WA0019.mp4')}
                    className="hover:text-gold-400 underline"
                  >
                    WA0019.mp4
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeroChange('videoUrl', '/uploads/athletica.mp4')}
                    className="hover:text-gold-400 underline"
                  >
                    athletica.mp4
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span>Primary CTA Button Text & Destination</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={hero.ctaText || ''}
                    onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                    placeholder="Button Text"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    value={hero.ctaLink || ''}
                    onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
                    placeholder="/join-training"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span>Secondary Video CTA Text</span>
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaText || ''}
                  onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Key Metrics / Stats */}
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider text-gold-400">
              Hero Metric Callouts (4 Badges)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-700 space-y-2">
                  <span className="text-[10px] text-gray-500 font-mono">Metric #{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-0.5">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-gold-400 font-bold text-xs"
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
          <p className="text-xs text-gray-400">
            Edit the four key historical milestones highlighted below the hero section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map((fact) => (
              <div key={fact.id} className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase">{fact.badge}</span>
                  <input
                    type="text"
                    value={fact.year}
                    onChange={(e) => handleFactChange(fact.id, 'year', e.target.value)}
                    placeholder="Year"
                    className="w-16 px-2 py-1 rounded-lg bg-charcoal-950 border border-charcoal-700 text-right text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-0.5">Title</label>
                  <input
                    type="text"
                    value={fact.title}
                    onChange={(e) => handleFactChange(fact.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-0.5">Summary</label>
                  <textarea
                    rows={3}
                    value={fact.description}
                    onChange={(e) => handleFactChange(fact.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-0.5">Linked Page</label>
                  <input
                    type="text"
                    value={fact.link}
                    onChange={(e) => handleFactChange(fact.id, 'link', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-gold-400 text-xs font-mono"
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
          <p className="text-xs text-gray-400">
            Control which sections appear on the public homepage and adjust their vertical presentation order.
          </p>

          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 rounded-2xl border transition-colors flex items-center justify-between ${
                  section.enabled
                    ? 'bg-charcoal-900 border-charcoal-800'
                    : 'bg-charcoal-950/60 border-charcoal-850 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-charcoal-800 flex items-center justify-center font-mono text-xs text-gold-400 font-bold">
                    {section.order}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{section.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">ID: {section.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      section.enabled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-charcoal-800 text-gray-400'
                    }`}
                  >
                    {section.enabled ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 text-gray-300"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 text-gray-300"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
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
