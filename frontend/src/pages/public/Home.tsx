import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Play,
  Layers,
  Sparkles,
  Globe,
  Compass,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Shield,
  X,
  Camera,
  Film,
  BookOpen
} from 'lucide-react';
import { HeroSlider } from '../../components/home/HeroSlider';
import {
  syllabusStages,
  achievementsList,
  quickFacts,
  heroContent,
  instructorsList,
  eventsList,
  newsArticlesList
} from '../../data';
import { publicApi } from '../../services/api';
import type { HeroConfig, QuickFact, Achievement, Instructor, EventItem, NewsArticle } from '../../types';

export const Home: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [hero, setHero] = useState<HeroConfig>(heroContent);
  const [facts, setFacts] = useState<QuickFact[]>(quickFacts);
  const [featuredAchievements, setFeaturedAchievements] = useState<Achievement[]>(
    achievementsList.filter((a) => a.is_featured).slice(0, 3)
  );
  const [instructors, setInstructors] = useState<Instructor[]>(instructorsList.slice(0, 3));
  const [events, setEvents] = useState<EventItem[]>(eventsList.slice(0, 3));
  const [news, setNews] = useState<NewsArticle[]>(newsArticlesList.slice(0, 3));
  const [activeStageTab, setActiveStageTab] = useState<number>(1);

  useEffect(() => {
    publicApi
      .getHome()
      .then((data) => {
        if (data) {
          if (data.hero) setHero((prev) => ({ ...prev, ...data.hero }));
          if (Array.isArray(data.quickFacts) && data.quickFacts.length > 0) setFacts(data.quickFacts);
          if (Array.isArray(data.featuredAchievements) && data.featuredAchievements.length > 0) {
            setFeaturedAchievements(data.featuredAchievements.slice(0, 3));
          }
          if (Array.isArray(data.instructorsPreview) && data.instructorsPreview.length > 0) {
            setInstructors(data.instructorsPreview.slice(0, 3));
          }
          if (Array.isArray(data.upcomingEvents) && data.upcomingEvents.length > 0) {
            setEvents(data.upcomingEvents.slice(0, 3));
          }
          if (Array.isArray(data.latestNews) && data.latestNews.length > 0) {
            setNews(data.latestNews.slice(0, 3));
          }
        }
      })
      .catch(() => {});
  }, []);

  const mborAchievement = featuredAchievements.find((a) =>
    a.awarding_organization?.toLowerCase().includes('malaysia book of records') ||
    a.title?.toLowerCase().includes('oldest silambam')
  ) || achievementsList[0];

  const mborCertificateUrl = mborAchievement?.cover_image_url || '/api/public/media/stream/silambam/298977c4-5bd2-4bf7-b091-e5e0cfe77163.png';

  const activeStage = syllabusStages.find((s) => s.stage_number === activeStageTab) || syllabusStages[0];

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* 1. LATEST ANNOUNCEMENTS TICKER RIBBON (Inspired by Indian Silambam Federation live ticker) */}
      <div className="bg-[#102137] border-b border-[#C6A04A]/30 text-white py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-3 w-full md:w-auto overflow-hidden min-w-0">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#C6A04A] text-[#102137] font-bold text-[10px] uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#102137] animate-pulse" />
              <span>Official Notice</span>
            </span>
            <div className="text-slate-200 truncate text-[11px] sm:text-xs">
              <strong className="text-[#D9B96E] font-semibold">Malaysia Book of Records (2022)</strong>: Certified Oldest Silambam Association in Malaysia • 2026 Traditional Intake Open
            </div>
          </div>
          <div className="flex items-center space-x-4 shrink-0 text-[11px] sm:text-xs font-medium">
            <Link to="/join-training" className="text-[#D9B96E] hover:text-white font-semibold transition-colors flex items-center space-x-1">
              <span>Begin Training</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
            <span className="text-slate-500">|</span>
            <Link to="/events" className="text-slate-300 hover:text-white transition-colors">
              Championship Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SPLIT-LAYOUT HERO SECTION (Main Priority: Text on Left, High-Impact Action Slider on Right) */}
      <section className="relative bg-[#102137] text-white overflow-hidden border-b border-[#183B5B]">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_20%,rgba(24,59,91,0.6),transparent_80%)]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_85%_65%,rgba(198,160,74,0.1),transparent_75%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle, Credibility & Action CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-5">
              {/* Refined Credibility Element (Malaysia Book of Records as sleek credibility strip, not oversized) */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/90 border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md">
                <Award className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <span className="text-[11px] sm:text-xs tracking-wider uppercase">
                  Malaysia Book of Records (2022) • Oldest Silambam Association
                </span>
              </div>

              {/* Small Introductory Label with ISF-inspired Architectural Accent */}
              <div className="flex items-center space-x-2.5 text-xs font-bold tracking-[0.2em] text-[#C6A04A] uppercase">
                <span className="w-6 h-px bg-[#C6A04A]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#C6A04A]" />
                <span>Living Tamil Martial Heritage · Est. 1975</span>
              </div>

              {/* Main Heading with High-Contrast Dual Tone Visual Hierarchy */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
                  AADHIRAN <span className="text-[#C6A04A] drop-shadow-sm">SILAMBAM</span>
                </h1>
                <p className="text-base sm:text-lg font-semibold text-[#D9B96E] tracking-wide pt-1">
                  ஆதிரன் சிலம்ப சங்கம் <span className="text-slate-400 mx-1.5">•</span> George Town, Penang & Global
                </p>
              </div>

              {/* Supporting Description with Balanced Line Length */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
                Preserving the authentic martial art of Silambam through structured training, cultural heritage and combat excellence. Unbroken 10-stage <strong className="text-white font-semibold">Por Silambam</strong> battlefield combat and modern <strong className="text-white font-semibold">Sport Silambam</strong> athletic mastery in George Town since 1936.
              </p>

              {/* Action Buttons: Primary Gold, Secondary Navy, and Demo Reel */}
              <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
                <Link
                  to="/join-training"
                  className="px-6 py-4 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-xl hover:shadow-[#C6A04A]/30 hover:scale-[1.02] flex items-center justify-center group shrink-0"
                >
                  <span>Begin Your Training</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#102137] group-hover:translate-x-1.5 transition-transform shrink-0" />
                </Link>

                <Link
                  to="/history-lineage"
                  className="px-5 py-4 rounded-xl bg-[#183B5B]/90 hover:bg-[#183B5B] text-white font-semibold text-xs sm:text-sm transition-all duration-200 border border-[#C6A04A]/50 hover:border-[#C6A04A] flex items-center justify-center backdrop-blur-sm shrink-0"
                >
                  <Compass className="w-4 h-4 mr-2 text-[#C6A04A] shrink-0" />
                  <span>Explore Heritage</span>
                </Link>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  aria-label="Watch Silambam demonstration video"
                  className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 border border-white/20 flex items-center justify-center backdrop-blur-sm shrink-0 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A] fill-current shrink-0" />
                  <span>Watch Reel</span>
                </button>
              </div>

              {/* 4 Heritage Metric Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/15 w-full">
                {(hero.stats || heroContent.stats).map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#183B5B]/80 border border-[#C6A04A]/35 backdrop-blur-sm shadow-sm"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-[#D9B96E] font-display">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-semibold text-white leading-tight mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Image Slider (Authentic Silambam Photography) */}
            <div className="lg:col-span-6 w-full">
              <HeroSlider
                bgImageOverride={hero.bgImage}
                onWatchVideo={() => setVideoModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECOGNITION & CREDIBILITY STRIP */}
      <section className="py-10 bg-[#F8F5EE] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 shrink-0">
              <Sparkles className="w-5 h-5 text-[#C6A04A]" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#102137]">
                National & Global Recognitions
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {facts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-4 rounded-xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#102137] text-[#D9B96E]">
                      {fact.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#C6A04A]">{fact.year}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#182332] group-hover:text-[#102137] transition-colors truncate">{fact.title}</h4>
                  <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                    {fact.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASSOCIATION INTRODUCTION (Alternating: Image on Left, Content on Right) */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Authentic Photo + Quote Overlay (Inspired by ISF President Quote) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8E3D9] shadow-xl">
                <div className="aspect-[4/5] sm:aspect-[4/5] relative overflow-hidden bg-slate-900">
                  <img
                    src="/api/public/media/stream/silambam/64ce5275-b368-4d52-b9d7-540d4d7c9613.png"
                    alt="Master Siva Chief Master with Traditional Silambam Staff"
                    className="w-full h-full object-cover object-top filter contrast-105"
                    loading="lazy"
                    width={400}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-transparent to-transparent opacity-80" />
                </div>

                {/* Quote Card Overlay */}
                <div className="absolute bottom-4 inset-x-4 p-4 sm:p-5 rounded-2xl bg-[#102137]/90 backdrop-blur-md border border-[#C6A04A]/40 text-white shadow-xl">
                  <p className="text-xs sm:text-sm italic font-serif leading-relaxed text-slate-100">
                    &ldquo;Silambam is not merely a martial art—it is a living symbol of our ancient heritage, discipline, courage, and identity.&rdquo;
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#D9B96E] block font-sans text-xs">Master Siva</strong>
                      <span className="text-slate-400 text-[10px]">Headmaster & Chief Instructor</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#183B5B] text-[#D9B96E] text-[10px] font-mono font-bold">
                      EST. 1975
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative Story & Structured Value Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] text-xs font-semibold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-[#C6A04A]" />
                <span>The Mother of Martial Arts</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#102137] tracking-tight leading-tight">
                Preserving Tradition • Promoting Excellence • Building Champions
              </h2>

              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Persatuan Aadhiran Silambam Pulau Pinang was established on 25th February 1975 under the registration of Societies Malaysia (PPM-014-07-25021975). On 28th August 2022, the association was officially certified by the <strong className="text-[#102137]">Malaysia Book of Records</strong> as the <strong className="text-[#102137]">Oldest Silambam Association in Malaysia</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-colors">
                  <div className="flex items-center space-x-2 text-[#102137] font-bold text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C6A04A] shrink-0" />
                    <span>Ethical Gurukulam Code</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Zero commercial belt grading or financial exploitation. Advancement is granted strictly on physical mastery, technical precision, and moral integrity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-colors">
                  <div className="flex items-center space-x-2 text-[#102137] font-bold text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C6A04A] shrink-0" />
                    <span>UNESCO Intangible Treasure</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Documented with George Town World Heritage Incorporated (GTWHI) and UNESCO ICHCAP South Korea as a living cultural treasure.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
                >
                  <span>Read Full Association History</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#C6A04A]" />
                </Link>
                <Link
                  to="/history-lineage"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] hover:border-[#C6A04A] text-[#182332] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>View Grandmaster Lineage</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HERITAGE & LINEAGE SPOTLIGHT (Alternating: Deep Heritage Navy Section) */}
      <section className="py-20 bg-[#102137] text-white border-b border-[#183B5B] relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(198,160,74,0.08),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Historical Lineage Narrative & Milestones */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/90 border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#C6A04A]" />
                <span>5,000-Year Kurunji Mountain Martial Lineage</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
                An Unbroken Lineage of Martial Masters & Living Heritage
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Silambam is an ancient battlefield martial art originating in the Kurunji mountain ranges of Tamil Nadu. Brought to George Town, Penang in 1936 by pioneering Tamil masters, the lineage has been continuously preserved under unbroken Guru-Shishya (Gurukulam) oral and physical transmission for over 90 years.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#183B5B]/80 border border-[#C6A04A]/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#D9B96E] font-display">1936</div>
                  <div className="text-xs font-bold text-white mt-1">Penang Arrival</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">Founding masters establish traditional gurukulam training in George Town.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#183B5B]/80 border border-[#C6A04A]/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#D9B96E] font-display">1975</div>
                  <div className="text-xs font-bold text-white mt-1">PPM Registered</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">Officially registered under PPM-014-07-25021975 on 25 February 1975.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#183B5B]/80 border border-[#C6A04A]/30 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#D9B96E] font-display">2022</div>
                  <div className="text-xs font-bold text-white mt-1">MBOR Certified</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">Officially recognized by Malaysia Book of Records as Oldest Association.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/history-lineage"
                  className="inline-flex items-center px-5 py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-[#102137]" />
                  <span>Explore Complete Lineage Chronology</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#102137] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Authentic Photograph of Grandmaster Mariapakkiam */}
            <div className="lg:col-span-5 relative">
              <div className="p-4 rounded-3xl bg-[#183B5B]/90 border-2 border-[#C6A04A]/40 shadow-2xl backdrop-blur-md">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 relative group">
                  <img
                    src="/api/public/media/stream/silambam/e1a90c59-7602-4fe0-8b73-0b9fba961691.png"
                    alt="Grandmaster Mariapakkiam 14th Descendant of Aadhiran Silambam Lineage"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-transparent to-transparent opacity-75" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#102137]/90 text-[#D9B96E] text-xs font-bold border border-[#C6A04A]/50">
                    14th Lineage Descendant
                  </div>
                  <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-xl bg-[#102137]/90 backdrop-blur-md text-white border border-[#C6A04A]/30">
                    <h4 className="text-sm font-bold text-white">Grandmaster Mariapakkiam</h4>
                    <p className="text-[11px] text-[#D9B96E] font-medium">Founding Pioneer & Custodian of 10-Stage Kurunji Syllabus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 10-STAGE TRADITIONAL SYLLABUS (Interactive Curriculum Showcase) */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Layers className="w-4 h-4 text-[#C6A04A]" />
                <span className="text-xs uppercase font-bold text-[#102137] tracking-wider">
                  Academic Martial Structure
                </span>
              </div>
              <h3 className="text-3xl font-bold text-[#182332]">
                The 10-Stage Traditional Syllabus
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                A systematic martial curriculum originating from the Kurunji mountains. Progress from essential triangular footwork to armed battlefield combat.
              </p>
            </div>
            <Link
              to="/training-syllabus"
              className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#183B5B] shrink-0"
            >
              <span>Explore Complete 10-Stage Syllabus</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#C6A04A]" />
            </Link>
          </div>

          {/* Interactive Curriculum Selector (Stages 1-5 Quick Switcher) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Stage Selector List */}
            <div className="lg:col-span-5 flex flex-col space-y-2.5">
              {syllabusStages.slice(0, 5).map((stage) => {
                const isActive = stage.stage_number === activeStageTab;
                return (
                  <button
                    key={stage.stage_number}
                    onClick={() => setActiveStageTab(stage.stage_number)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#102137] border-[#C6A04A] text-white shadow-md'
                        : 'bg-white hover:bg-[#F8F5EE] border-[#E8E3D9] text-[#182332]'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                          isActive
                            ? 'bg-[#C6A04A] text-[#102137]'
                            : 'bg-[#FDFBF7] border border-[#E8E3D9] text-[#102137]'
                        }`}
                      >
                        0{stage.stage_number}
                      </span>
                      <div>
                        <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[#182332]'}`}>
                          {stage.english_name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-[#D9B96E]' : 'text-[#64748B]'}`}>
                          {stage.tamil_name}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-[#C6A04A] translate-x-1' : 'text-[#64748B]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detail Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E3D9]">
                  <span className="px-3 py-1 rounded-full bg-[#102137] text-[#D9B96E] text-xs font-bold uppercase tracking-wider">
                    Stage 0{activeStage.stage_number} Curriculum Focus
                  </span>
                  <span className="text-xs font-semibold text-[#183B5B]">
                    Traditional Por Silambam
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-[#182332] mb-1">
                  {activeStage.english_name}
                </h4>
                <div className="text-sm font-semibold text-[#C6A04A] mb-4">
                  {activeStage.tamil_name}
                </div>

                <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                  {activeStage.overview}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8E3D9]">
                    <span className="text-[10px] uppercase font-bold text-[#C6A04A] tracking-wider block mb-1">
                      Weapon Focus
                    </span>
                    <strong className="text-xs sm:text-sm text-[#182332]">
                      {activeStage.weapon_focus || 'Traditional Bamboo Staff (Prambu)'}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8E3D9]">
                    <span className="text-[10px] uppercase font-bold text-[#C6A04A] tracking-wider block mb-1">
                      Key Movement Pattern
                    </span>
                    <strong className="text-xs sm:text-sm text-[#182332]">
                      {activeStage.key_techniques || '18-Step Kaaladi Positioning'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E3D9] flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Unbroken oral & physical transmission in George Town since 1936
                </span>
                <Link
                  to="/training-syllabus"
                  className="text-xs font-bold text-[#102137] hover:text-[#183B5B] flex items-center space-x-1"
                >
                  <span>Full Syllabus Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A04A]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTRUCTORS & LINEAGE MASTERS COUNCIL (Image-Led Cards) */}
      <section className="py-20 bg-white border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-[#C6A04A]" />
                <span className="text-xs uppercase font-bold text-[#102137] tracking-wider">
                  Accredited Gurukulam Master Council
                </span>
              </div>
              <h3 className="text-3xl font-bold text-[#182332]">
                Masters & Lineage Custodians
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Direct lineage masters authorized to teach traditional Por Silambam and certify students.
              </p>
            </div>
            <Link
              to="/instructors"
              className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#183B5B] shrink-0"
            >
              <span>View Full Instructor Council</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#C6A04A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((inst) => (
              <div
                key={inst.id}
                className="rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#E8E3D9] hover:border-[#C6A04A] transition-all duration-300 shadow-xs flex flex-col group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={inst.photo_url || '/api/public/media/stream/silambam/e1a90c59-7602-4fe0-8b73-0b9fba961691.png'}
                    alt={inst.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#102137]/90 text-[#D9B96E] text-[10px] font-bold uppercase tracking-wider border border-[#C6A04A]/40">
                    {inst.lineage_rank || 'Master Instructor'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#182332] group-hover:text-[#102137] transition-colors">
                      {inst.name}
                    </h4>
                    {inst.tamil_name && (
                      <div className="text-xs font-medium text-[#C6A04A] mt-0.5">
                        {inst.tamil_name}
                      </div>
                    )}
                    <div className="text-xs font-semibold text-[#183B5B] mt-1">
                      {inst.title}
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mt-2.5">
                      {inst.biography}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Experience: <strong className="text-[#102137]">{inst.years_experience}+ Yrs</strong></span>
                    <Link
                      to="/instructors"
                      className="text-xs font-bold text-[#102137] hover:text-[#183B5B] flex items-center"
                    >
                      <span>Bio</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-[#C6A04A]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VISUAL STORIES & DEMONSTRATION SHOWCASE (Gallery & Videos inspired by ISF Visual Stories) */}
      <section className="py-20 bg-[#102137] text-white relative overflow-hidden border-b border-[#183B5B]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(198,160,74,0.1),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center space-x-2.5 mb-2 text-xs font-bold tracking-[0.2em] text-[#C6A04A] uppercase">
                <Camera className="w-4 h-4 text-[#C6A04A]" />
                <span>Visual Stories · Action Gallery</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Authentic Silambam in Motion
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                From traditional Gurukulam training grounds in George Town to international demonstrations — witness authentic Silambam speed, weapons precision, and cultural mastery.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <Link
                to="/gallery"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                Browse Full Gallery
              </Link>
              <Link
                to="/videos"
                className="px-4 py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] text-xs font-bold tracking-wide transition-all shadow-sm flex items-center space-x-1"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Watch Videos</span>
              </Link>
            </div>
          </div>

          {/* Action Photo Mosaic & Video Reel Player Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Primary Action Photo (Large 5-col Feature) */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-[#C6A04A]/30 bg-[#183B5B] group min-h-[300px]">
              <img
                src="/api/public/media/stream/silambam/b417be8b-6b26-4914-848f-fdc546a2abd2.jpg"
                alt="Silambam Warrior Dynamic Spin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                loading="lazy"
                width={500}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-[#102137]/30 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-[#102137]/85 backdrop-blur-md border border-white/15">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9B96E] font-bold block mb-1">
                  Speed & Precision
                </span>
                <h4 className="text-sm font-bold text-white">Warrior Dynamic Rotational Spin</h4>
                <p className="text-xs text-slate-300 mt-1">High-velocity bamboo staff deflection and continuous centripetal twirling.</p>
              </div>
            </div>

            {/* Middle 2-Stack Photos */}
            <div className="md:col-span-3 flex flex-col gap-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#183B5B] group flex-1 min-h-[160px]">
                <img
                  src="/api/public/media/stream/silambam/64b51e47-87c8-47e8-808a-0f0d61d71e4d.jpg"
                  alt="Animal Stance Combat Drill"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-xs">
                  <span className="text-[10px] text-[#D9B96E] font-bold uppercase tracking-wider block">Animal Stances</span>
                  <span className="text-xs font-semibold text-white">Tiger & Eagle Stance Kinematics</span>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#183B5B] group flex-1 min-h-[160px]">
                <img
                  src="/api/public/media/stream/silambam/751f540c-4cfb-4a09-8812-3121746f591c.jpg"
                  alt="Duo Combat Exchange"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-xs">
                  <span className="text-[10px] text-[#D9B96E] font-bold uppercase tracking-wider block">Por Silambam</span>
                  <span className="text-xs font-semibold text-white">Two-Warrior Sparring & Defense</span>
                </div>
              </div>
            </div>

            {/* Right Video Demonstration Reel Showcase Card */}
            <div className="md:col-span-4 relative rounded-2xl overflow-hidden border border-[#C6A04A]/40 bg-[#183B5B] flex flex-col justify-between p-6 shadow-xl">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#102137]/90 text-[#D9B96E] text-[10px] font-bold uppercase tracking-wider border border-[#C6A04A]/40 mb-4">
                  <Film className="w-3 h-3 text-[#C6A04A]" />
                  <span>Featured Video Demonstration</span>
                </div>
                <h4 className="text-xl font-bold text-white leading-snug">
                  Living Battlefield Arts of George Town
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Watch official demonstrations of traditional weapons including Bamboo Staff (Prambu), Maduvu (Deer Horns), and Surul Vaal (Flexible Sword).
                </p>
              </div>

              {/* Video Thumbnail with Play Button */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/15 my-4 group cursor-pointer" onClick={() => setVideoModalOpen(true)}>
                <img
                  src="/api/public/media/stream/silambam/30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg"
                  alt="Watch Demonstration Video Reel"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#C6A04A] text-[#102137] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white">
                  Official Reel
                </div>
              </div>

              <button
                onClick={() => setVideoModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Video Player</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. UPCOMING EVENTS & CHAMPIONSHIPS CALENDAR (Inspired by Indian Silambam Federation Event List) */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-[#C6A04A]" />
                <span className="text-xs uppercase font-bold text-[#102137] tracking-wider">
                  Competition & Showcase Calendar
                </span>
              </div>
              <h3 className="text-3xl font-bold text-[#182332]">
                Upcoming Events & Programmes
              </h3>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] text-xs font-semibold text-[#102137] transition-all shadow-xs"
            >
              <span>Download Association Calendar</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-[#C6A04A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Featured Event Card */}
            {events[0] && (
              <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-white border border-[#E8E3D9] shadow-md flex flex-col justify-between group">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={events[0].cover_image_url || '/api/public/media/stream/silambam/9661e79a-b91d-4307-b538-70ed6647bafb.jpg'}
                    alt={events[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#102137]/90 text-[#D9B96E] text-[10px] font-bold uppercase tracking-wider border border-[#C6A04A]/40">
                    Main Featured Event
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-xs text-[#C6A04A] font-bold uppercase mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(events[0].start_date).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#182332] mb-2 leading-tight">
                    {events[0].title}
                  </h4>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                    {events[0].description}
                  </p>
                  <div className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                    <span className="truncate">{events[0].location}</span>
                  </div>
                  <Link
                    to="/events"
                    className="inline-flex items-center text-xs font-bold text-[#102137] hover:text-[#183B5B] group/link"
                  >
                    <span>Event Details & Registration</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#C6A04A] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* Event List (Federation Style List Rows) */}
            <div className="lg:col-span-7 space-y-3.5">
              {events.slice(0, 3).map((item) => {
                const eventDate = new Date(item.start_date);
                const month = eventDate.toLocaleString('default', { month: 'short' });
                const day = eventDate.getDate();
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      {/* Date Badge */}
                      <div className="w-13 h-13 rounded-xl bg-[#102137] text-white flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#D9B96E] uppercase leading-none">
                          {month}
                        </span>
                        <span className="text-base font-bold leading-none mt-1">
                          {day}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-[#F8F5EE] border border-[#E8E3D9] text-[9px] font-bold uppercase tracking-wider text-[#102137]">
                            {item.event_type}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            ● {(item.status || 'UPCOMING').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#182332] group-hover:text-[#102137] transition-colors truncate">
                          {item.title}
                        </h4>
                        <div className="text-xs text-[#64748B] flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#C6A04A] shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/events"
                      className="px-3.5 py-2 rounded-xl bg-[#F8F5EE] hover:bg-[#102137] hover:text-white text-xs font-semibold text-[#182332] transition-colors self-start sm:self-center shrink-0"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 10. ACHIEVEMENTS & RECORDS (Prestigious MBOR Certificate Showcase) */}
      <section id="mbor-recognition" className="py-20 bg-[#F8F5EE] border-b border-[#E8E3D9] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Official Certificate Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="p-3 sm:p-4 rounded-3xl bg-[#102137] border-2 border-[#C6A04A]/60 shadow-2xl relative">
                {/* Gold Seal Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C6A04A]" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C6A04A]" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C6A04A]" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C6A04A]" />

                <div 
                  className="aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#C6A04A]/40 relative group cursor-pointer shadow-inner flex items-center justify-center p-2"
                  onClick={() => setCertModalOpen(true)}
                  title="Click to view full certificate"
                >
                  <img
                    src={mborCertificateUrl}
                    alt="The Malaysia Book of Records Official Certificate (2022) — Certified Oldest Silambam Association in Malaysia presented to Persatuan Aadhiran Silambam Pulau Pinang"
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={550}
                    height={740}
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.onerror = null;
                      t.src = '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#102137]/90 text-[#D9B96E] text-xs font-bold border border-[#C6A04A]/50 shadow-md">
                    Official Certificate
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#102137]/80 text-white text-[10px] font-mono backdrop-blur-xs flex items-center space-x-1 group-hover:bg-[#C6A04A] group-hover:text-[#102137] transition-colors">
                    <span>Enlarge</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>

                <div className="mt-3.5 px-2 pb-1 text-center">
                  <div className="inline-flex items-center space-x-2 text-[#D9B96E] font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-[#C6A04A]" />
                    <span>The Malaysia Book of Records</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Certified Oldest Silambam Association in Malaysia
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Established 25 February 1975 • Unbroken Lineage Since 1936
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Accolades Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#102137] text-[#D9B96E] text-xs font-bold uppercase tracking-wider mb-2">
                  <Trophy className="w-3.5 h-3.5 text-[#C6A04A]" />
                  <span>Documented Accolades & Records</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#102137] font-display tracking-tight leading-tight">
                  National Record Primacy & Global Distinction
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  Every accolade conferred upon Aadhiran Silambam is formally documented with government ministries, global heritage bodies, and national record registries.
                </p>
              </div>

              <div className="space-y-3.5">
                {featuredAchievements.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#102137] text-[#D9B96E]">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#C6A04A]">{item.year}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#182332] group-hover:text-[#102137] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-xs text-left sm:text-right font-medium text-[#102137] shrink-0 sm:max-w-[220px] pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E3D9]">
                      <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Conferred by</span>
                      <strong className="text-xs text-[#183B5B] block truncate" title={item.awarding_organization}>
                        {item.awarding_organization}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/achievements"
                  className="inline-flex items-center px-5 py-3 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
                >
                  <span>View All Awards & Historic Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#C6A04A] group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://www.malaysiarecords.com.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-3 rounded-xl bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] hover:border-[#C6A04A] text-[#102137] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A]" />
                  <span>Verify at MalaysiaRecords.com.my</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LATEST NEWS & EDITORIAL ARTICLES */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C6A04A]" />
                <span className="text-xs uppercase font-bold text-[#102137] tracking-wider">
                  Press Releases & Insights
                </span>
              </div>
              <h3 className="text-3xl font-bold text-[#182332]">
                Latest News & Editorial Dispatches
              </h3>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#183B5B] shrink-0"
            >
              <span>Browse All Articles</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#C6A04A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((art) => (
              <div
                key={art.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all duration-300 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={art.cover_image_url || '/api/public/media/stream/silambam/b417be8b-6b26-4914-848f-fdc546a2abd2.jpg'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#102137]/90 text-[#D9B96E] text-[10px] font-bold uppercase tracking-wider border border-[#C6A04A]/40">
                      {art.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-[11px] font-mono text-[#64748B] mb-2">
                      {new Date(art.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <h4 className="text-base font-bold text-[#182332] group-hover:text-[#102137] transition-colors leading-snug mb-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link
                    to={`/news/${art.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#102137] hover:text-[#183B5B] group/link"
                  >
                    <span>Read Full Dispatch</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#C6A04A] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. HIGH-IMPACT ENROLMENT CTA BANNER (Heritage Navy & Gold Split Banner) */}
      <section className="py-16 bg-[#102137] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(198,160,74,0.15),transparent_75%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04A] block">
                Begin Your Silambam Journey Today
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Traditional Martial Training for All Ages & Skill Levels
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Admissions are open for children, youths, and adults. Experience the ancient martial wisdom of Por Silambam under verified master instructors at our George Town headquarters.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                to="/join-training"
                className="w-full px-6 py-3.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-xs sm:text-sm tracking-wide text-center transition-all duration-200 shadow-lg flex items-center justify-center group"
              >
                <span>Submit Enrolment Application</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="w-full px-5 py-3 rounded-xl bg-[#183B5B] hover:bg-[#183B5B]/80 text-white font-semibold text-xs sm:text-sm text-center transition-colors border border-[#C6A04A]/40 flex items-center justify-center"
              >
                <span>Contact Headquarters Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 13. DEMO REEL VIDEO MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close demonstration video"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                src="/api/public/media/stream/silambam/VID-20231026-WA0019.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* 14. MALAYSIA BOOK OF RECORDS CERTIFICATE LIGHTBOX MODAL */}
      {certModalOpen && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setCertModalOpen(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-[#102137] rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#C6A04A]/60 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCertModalOpen(false)}
              aria-label="Close certificate lightbox"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-[#C6A04A] hover:text-[#102137] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full text-center pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9B96E] font-bold block mb-1">
                Official National Record Verification
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                The Malaysia Book of Records (2022)
              </h3>
              <p className="text-xs text-slate-300">
                Oldest Silambam Association in Malaysia • Certified 28 August 2022
              </p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-white p-2 shadow-inner w-full flex items-center justify-center">
              <img
                src={mborCertificateUrl}
                alt="The Malaysia Book of Records Official Certificate Induction — Persatuan Aadhiran Silambam Pulau Pinang"
                className="max-h-[65vh] w-auto object-contain mx-auto"
                loading="eager"
              />
            </div>

            <div className="w-full pt-4 mt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <span>Verified Historical Primacy Record</span>
              </div>
              <a
                href="https://www.malaysiarecords.com.my"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D9B96E] hover:text-white font-semibold underline underline-offset-2 flex items-center space-x-1"
              >
                <span>Visit Official Registry</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
