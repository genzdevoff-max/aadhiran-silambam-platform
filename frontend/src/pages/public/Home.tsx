import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Shield,
  ChevronRight,
  Flame,
  ArrowRight,
  CheckCircle2,
  Play,
  MapPin,
  ExternalLink,
  BookOpen,
  Camera,
  Layers,
  Sparkles,
  Globe,
} from 'lucide-react';
import {
  syllabusStages,
  achievementsList,
  quickFacts,
  heroContent,
} from '../../data';

export const Home: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const featuredAchievements = achievementsList
    .filter((a) => a.is_featured)
    .slice(0, 3);

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* 1. Refined Heritage Hero Section - Deep Navy with Balanced Warm Glow */}
      <section className="public-dark-surface relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-navy-800 bg-[#0B1B3D]">
        {/* Background Atmosphere Layers */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroContent.bgImage}
            alt="Aadhiran Silambam Lineage Custody"
            className="w-full h-full object-cover object-center opacity-80 filter brightness-90 contrast-110"
          />
          {/* Radial amber glow & subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1B3D]/45 via-[#0B1B3D]/40 to-[#0B1B3D]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_110%,rgba(14,165,233,0.12),transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          {/* Official ASA Logo Emblem */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-amber-400 via-amber-300 to-crimson-600 shadow-2xl shadow-navy-950/80 hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1 shadow-inner">
                <img
                  src="/logo.png"
                  alt="Aadhiran Silambam Association Official Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Institutional Heritage Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium tracking-wide mb-6 shadow-sm backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-amber-200">
              Certified Oldest Silambam Association in Malaysia • Malaysia Book of Records (2022)
            </span>
          </div>

          {/* Lineage Subtitle */}
          <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-400 uppercase mb-3">
            <span className="w-8 h-px bg-amber-400/50" />
            <span>Living Tamil Martial Lineage • Est. 1975</span>
            <span className="w-8 h-px bg-amber-400/50" />
          </div>

          {/* Main Hero Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white mb-3 drop-shadow-md">
            AADHIRAN SILAMBAM
          </h1>
          <p className="text-lg sm:text-2xl font-display font-medium text-amber-300 tracking-wider mb-6">
            ஆதிரன் சிலம்ப சங்கம் <span className="text-slate-400 font-sans mx-2">•</span> George Town, Penang & Global
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8 font-normal">
            Mother of all martial arts, originating from primordial stone age Kumari Kandam. Preserving traditional <strong className="text-white font-semibold">Por Silambam</strong> battlefield warfare and <strong className="text-white font-semibold">Sport Silambam</strong> tournament mastery across Penang, India, and the Middle East.
          </p>

          {/* Focused Call to Action Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold text-base tracking-wide transition-all duration-200 border border-amber-400/40 shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group"
            >
              <span>Begin Your Training</span>
              <ArrowRight className="w-5 h-5 ml-2.5 text-amber-100 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-navy-900/80 hover:bg-navy-850 text-slate-200 hover:text-white font-medium text-base transition-all duration-200 border border-navy-700 hover:border-amber-400/50 flex items-center justify-center group backdrop-blur-sm"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 flex items-center justify-center mr-2.5 transition-colors">
                <Play className="w-3.5 h-3.5 text-amber-400 fill-current ml-0.5" />
              </div>
              <span>Watch Archival Documentary</span>
            </button>
          </div>

          <div className="mb-14">
            <Link
              to="/training-syllabus"
              className="inline-flex items-center text-xs sm:text-sm text-amber-300 hover:text-amber-200 font-medium tracking-wide underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2 text-amber-400" />
              <span>Explore the Authentic 10-Stage Traditional Syllabus &rarr;</span>
            </Link>
          </div>

          {/* 4 Pillar Heritage Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-navy-800">
            {heroContent.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-navy-900/70 border border-navy-700/80 backdrop-blur-sm text-left hover:border-amber-400/40 transition-colors"
              >
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-amber-300 mb-0.5">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-300 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Video Modal */}
      {videoModalOpen && (
        <div className="public-dark-surface fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-navy-900 rounded-2xl overflow-hidden border border-navy-700 shadow-2xl">
            <div className="p-4 bg-navy-950 flex justify-between items-center border-b border-navy-800">
              <div>
                <h3 className="font-display font-bold text-amber-400 text-lg">
                  Aadhiran Silambam of Penang — The Untold Story
                </h3>
                <p className="text-xs text-slate-300">Authentic archival documentary • George Town, Penang</p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={heroContent.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
            <div className="p-4 text-xs sm:text-sm text-slate-300 bg-navy-950 border-t border-navy-800 flex items-center justify-between">
              <span>Rare archival footage capturing Master Mariapakkiam and the living lineage preserved in Penang.</span>
              <span className="text-amber-400 font-mono text-xs hidden sm:inline-block">Kurunji Tradition</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Authentic Living Lineage Spotlight - Warm Ivory with Clean Heritage Cards */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visuals: Authentic Masters */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md group bg-white">
                  <img
                    src="/uploads/mariapaqiam4.png"
                    alt="Grandmaster Mariapakkiam"
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      14th Lineage Descendant
                    </span>
                    <h4 className="text-sm font-display font-bold text-white">
                      Grandmaster Mariapakkiam
                    </h4>
                    <p className="text-[11px] text-slate-300">Migrated to Penang in 1936</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <div className="flex items-center space-x-2 text-crimson-600 mb-1">
                    <Shield className="w-4 h-4 text-crimson-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      No Commercial Belting
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aadhiran does not sell commercial belts or sport rings. Training strictly adheres to the traditional 10 stages of the Kurunji custom.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                  <div className="flex items-center space-x-2 text-amber-800 mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Malaysia Book of Records
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Officially established on 25th February 1975 — Verified Oldest Silambam Association in Malaysia (2022).
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md group bg-white">
                  <img
                    src="/uploads/siva_orig.png"
                    alt="Chief Master Siva"
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Heritage Custodian
                    </span>
                    <h4 className="text-sm font-display font-bold text-white">
                      Chief Master Siva
                    </h4>
                    <p className="text-[11px] text-slate-300">Spearheading UNESCO Recognition</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>The Living Martial Heritage of Penang</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] tracking-tight">
                An Extinct Indian Martial Treasure Preserved in George Town
              </h2>

              <p className="text-base text-slate-700 leading-relaxed">
                Originating from the Kurunji Mountains of South India over five thousand years ago, the authentic Aadhiran Silambam discipline has virtually vanished in modern India. Yet, it found a living sanctuary in Penang, Malaysia in 1936 when the 14th direct descendant, <span className="text-slate-900 font-semibold">Grandmaster Mariapakkiam</span>, migrated from Madurai to George Town during the British Colonial era.
              </p>

              <p className="text-base text-slate-600 leading-relaxed">
                Unlike sport-adapted martial arts, Aadhiran focuses on high-speed bamboo stick twirling (Kambu Veechu), deceptive triangular footworks (Kaaladi Varisai), animated animal combat postures (tiger, lion, serpent), and lethal close-quarter weapons like the Deer Horn (Maan Kombu) and Flexible Whip Sword (Surul Vaal).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-crimson-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">Pure Traditional Lineage</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Strict Guru-Student (Gurukulam) transmission without dilution.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">UNESCO Global Registry</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Documented in UNESCO ICHCAP South Korea and GTWHI.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/history-lineage"
                  className="inline-flex items-center text-amber-700 hover:text-amber-800 font-semibold text-sm transition-colors"
                >
                  <span>Read the full 5,000-year history</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/instructors"
                  className="inline-flex items-center text-slate-600 hover:text-[#0B1B3D] font-medium text-sm transition-colors"
                >
                  <span>Meet all Masters & Instructors</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Facts Grid - Light Stone with Rich Heritage Cards */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-crimson-600 tracking-widest mb-2">
              Authentic Credentials
            </h2>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              Recognized Across the Nation & the World
            </h3>
            <p className="text-slate-600 text-sm mt-3">
              Documented milestones verified by state, national, and international heritage authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickFacts.map((fact, idx) => (
              <div
                key={fact.id}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-colors ${
                      idx % 2 === 0
                        ? 'bg-crimson-50 text-crimson-600 border-crimson-200 group-hover:bg-crimson-600 group-hover:text-white'
                        : 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white'
                    }`}
                  >
                    {idx === 0 && <Award className="w-6 h-6" />}
                    {idx === 1 && <BookOpen className="w-6 h-6" />}
                    {idx === 2 && <Globe className="w-6 h-6" />}
                    {idx === 3 && <Shield className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 tracking-wider uppercase">
                    {fact.badge}
                  </span>
                  <h4 className="text-lg font-display font-bold text-[#0B1B3D] mt-2 mb-3">
                    {fact.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {fact.description}
                  </p>
                </div>
                <Link
                  to={fact.link}
                  className="text-xs font-semibold text-amber-700 group-hover:text-amber-800 flex items-center pt-2"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The 10-Stage Traditional Syllabus Highlights */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-amber-700 tracking-widest">
                Comprehensive Martial Pedagogy
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] mt-2">
                The 10 Ancient Tamil Stages
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-2xl">
                Beginning with elemental balance and staff twirling methods, advancing through animal battle manoeuvres, and culminating in master ethics.
              </p>
            </div>
            <Link
              to="/training-syllabus"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>View detailed syllabus for all 10 stages</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {syllabusStages.slice(0, 5).map((stage) => (
              <div
                key={stage.id}
                className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-crimson-50 border border-crimson-200 text-crimson-700">
                    STAGE {stage.stage_number}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    0{stage.stage_number}/10
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-amber-700 font-mono mb-1 truncate">
                  {stage.tamil_name}
                </h4>
                <h3 className="text-base font-display font-bold text-[#0B1B3D] mb-2 line-clamp-1">
                  {stage.english_name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {stage.overview}
                </p>
                <div className="text-[11px] text-slate-500 border-t border-stone-100 pt-2">
                  <span className="text-slate-700 font-medium">Focus:</span>{' '}
                  {stage.weapon_focus || 'Bamboo staff'}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-[#0B1B3D] border border-navy-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                <Layers className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h4 className="text-white font-display font-bold text-base">
                  Looking for the complete advanced stages?
                </h4>
                <p className="text-xs text-slate-300">
                  Stages 6 to 10 include Surul Vaal (Flexible Whip Sword), Vel Kambu (Spear Combat), Pulipaaivu (Tiger), and Kurunji Meypadu.
                </p>
              </div>
            </div>
            <Link
              to="/training-syllabus"
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors whitespace-nowrap shadow-md shadow-amber-950/30"
            >
              Explore All 10 Stages →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Featured Achievements Section - Stone Background with Heritage Cards */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest">
                Honors & Accolades
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] mt-2">
                Featured Achievements
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-2xl">
                Unprecedented milestones acknowledging our unbroken 5,000-year Tamil martial heritage transmission.
              </p>
            </div>
            <Link
              to="/achievements"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>View all awards & historical timeline</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAchievements.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col group shadow-sm"
              >
                {item.cover_image_url && (
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-sm border border-navy-700 text-amber-300 text-xs font-mono font-bold">
                      {item.year}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-crimson-600 uppercase tracking-wider font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-2 group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 mb-3">
                      Awarded by:{' '}
                      <span className="text-amber-700">
                        {item.awarding_organization}
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {item.evidence_url && (
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors pt-3 border-t border-stone-100"
                    >
                      <span>Official Verification / Source</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Authentic Visual Gallery Preview */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-amber-700 tracking-widest">
                Living Traditions in Action
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] mt-2">
                Authentic Media Archives
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-2xl">
                Rare archival photographs, community heritage demonstrations, and weapon twirling methods captured over five decades in Penang.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                to="/gallery"
                className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                <Camera className="w-4 h-4 mr-1.5" />
                <span>Full Photo Gallery</span>
              </Link>
              <span className="text-stone-300">|</span>
              <Link
                to="/videos"
                className="inline-flex items-center text-sm font-semibold text-crimson-600 hover:text-crimson-700"
              >
                <Play className="w-4 h-4 mr-1.5" />
                <span>Video Vault</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { src: '/uploads/portfolio-1.jpg', title: 'Traditional Staff Stance', category: 'Technique' },
              { src: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png', title: 'Malaysia Book of Records Presentation', category: 'Milestone' },
              { src: '/uploads/portfolio-2.jpg', title: 'Speed & Twirling Routine', category: 'Weapons' },
              { src: '/uploads/single1.jpg', title: 'Intricate Kaaladi Footwork', category: 'Training' },
              { src: '/uploads/portfolio-3.jpg', title: 'Maan Kombu Deer Horn Routine', category: 'Weapons' },
              { src: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg', title: 'George Town Living Heritage Demonstration', category: 'UNESCO' },
              { src: '/uploads/portfolio-5.jpg', title: 'Youth Academy Session', category: 'Students' },
              { src: '/uploads/silambam-back.jpg', title: 'Ancient Combat Posture', category: 'Heritage' },
            ].map((img, idx) => (
              <Link
                to="/gallery"
                key={idx}
                className="relative h-48 rounded-xl overflow-hidden group border border-stone-200 bg-stone-100 shadow-sm"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block">
                    {img.category}
                  </span>
                  <h4 className="text-xs font-semibold text-white truncate">
                    {img.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action (Enrollment / Join Training) - Deep Navy Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-t border-navy-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-lg">
            <Flame className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            Begin Your Traditional Silambam Journey
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Experience the discipline of ancient Tamil warriors in George Town, Penang. Training classes available for children, youth, and adults under certified masters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base tracking-wide transition-all duration-200 shadow-xl shadow-navy-950/50 border border-amber-400/40"
            >
              Submit Training Enquiry →
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-900/80 hover:bg-navy-800 text-amber-300 font-semibold text-base transition-colors border border-navy-700"
            >
              Contact Association
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-6 flex items-center justify-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Training Center: Lebuh King, George Town, Penang</span>
          </p>
        </div>
      </section>
    </div>
  );
};
