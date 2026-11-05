import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Phone,
  AlertCircle,
  Swords,
  Users,
  MessageCircle,
  Star,
  Clock,
  Compass,
  X
} from 'lucide-react';
import { publicApi } from '../../services/api';

export const Home: React.FC = () => {
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [enquiryBatchType, setEnquiryBatchType] = useState<'regular' | 'private'>('regular');

  // Dynamic Hero & Settings State (Synced with Admin CMS & TiDB Cloud)
  const [heroContent, setHeroContent] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    bgImage: string;
  }>({
    badge: '⚡ 10-STAGE GURUKULAM SYLLABUS · EST. 1975',
    title: 'TRAIN. MASTER. RISE.',
    subtitle: 'Traditional Gurukulam syllabus, bamboo staff mastery, and battlefield combat sparring for champions of all ages.',
    bgImage: '/api/public/media/stream/silambam/1.jpg',
  });

  useEffect(() => {
    let isMounted = true;
    publicApi.getSettings()
      .then((data) => {
        if (!isMounted || !data || !data.hero) return;
        setHeroContent((prev) => ({
          badge: data.hero.badge || prev.badge,
          title: data.hero.title || prev.title,
          subtitle: data.hero.subtitle || prev.subtitle,
          bgImage: data.hero.bgImage || prev.bgImage,
        }));
      })
      .catch((err) => {
        console.warn('Fallback to default hero visual settings:', err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const renderHeroHeadline = (titleStr: string) => {
    const parts = titleStr.trim().split(' ');
    if (parts.length > 1) {
      const last = parts.pop();
      return (
        <>
          <span className="text-white block">{parts.join(' ')}</span>
          <span className="text-[#C6A04A] block mt-1">{last}</span>
        </>
      );
    }
    return <span className="text-white block">{titleStr}</span>;
  };

  // Enquiry Form State (Matching Reference 6)
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    programme: 'Kaaladi Footwork',
    preferredDate: '',
    message: '',
  });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.fullName.trim() || !enquiryForm.phone.trim()) {
      setEnquiryError('Please enter your name and phone number.');
      return;
    }
    setEnquirySubmitting(true);
    setEnquiryError(null);
    try {
      await publicApi.submitContact({
        fullName: enquiryForm.fullName.trim(),
        phone: enquiryForm.phone.trim(),
        email: enquiryForm.email.trim() || 'enquiry@aadhiran.com',
        message: `[Class Enquiry — ${enquiryForm.programme} | Batch: ${enquiryBatchType} | Date: ${enquiryForm.preferredDate || 'Earliest'}]\n${enquiryForm.message}`,
      });
      setEnquirySuccess('Thank you! Your class enquiry has been received. Our masters will WhatsApp you shortly.');
      setEnquiryForm({
        fullName: '',
        phone: '',
        email: '',
        programme: 'Kaaladi Footwork',
        preferredDate: '',
        message: '',
      });
    } catch (err: any) {
      setEnquiryError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const handleSelectProgramToEnquire = (progName: string) => {
    setEnquiryForm((prev) => ({ ...prev, programme: progName }));
    const el = document.getElementById('enquire');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const mborCertificateUrl = '/api/public/media/stream/silambam/298977c4-5bd2-4bf7-b091-e5e0cfe77163.png';

  // Section 2: 8 Disciplines for Asymmetric Masonry Grid (Reference 2)
  const masonryDisciplines = {
    col1: {
      name: 'Kaaladi Footwork',
      sub: 'Level 1 · Explore',
      img: '/api/public/media/stream/silambam/services.png',
      dot: 'bg-emerald-400'
    },
    col2: [
      {
        name: 'Nedukambu Staff',
        sub: 'Level 2 · Explore',
        img: '/api/public/media/stream/silambam/1.jpg',
        dot: 'bg-amber-400'
      },
      {
        name: 'Irattai Kambu',
        sub: 'Level 2 · Explore',
        img: '/api/public/media/stream/silambam/5.jpg',
        dot: 'bg-blue-400'
      }
    ],
    col3: [
      {
        name: 'Maan Kombu',
        sub: 'Level 3 · Explore',
        img: '/api/public/media/stream/silambam/2.jpg',
        dot: 'bg-rose-400'
      },
      {
        name: 'Chuttu Varisai',
        sub: 'Level 3 · Explore',
        img: '/api/public/media/stream/silambam/8.jpg',
        dot: 'bg-purple-400'
      }
    ],
    col4: {
      name: 'Surul Vaal Blade',
      sub: 'Level 4 · Explore',
      img: '/api/public/media/stream/silambam/3.jpg',
      dot: 'bg-cyan-400'
    },
    col5: [
      {
        name: 'Porr Combat',
        sub: 'Championship · Sparring',
        img: '/api/public/media/stream/silambam/4.jpg',
        dot: 'bg-[#C6A04A]'
      },
      {
        name: 'Varma Kalai',
        sub: 'Level 5 · Vital Lore',
        img: '/api/public/media/stream/silambam/7.jpg',
        dot: 'bg-orange-400'
      }
    ]
  };

  // Section 4: 8 Programs & Classes Cards (Reference 4)
  const programsList = [
    {
      title: 'Junior Kaaladi Footwork',
      desc: 'Fundamental stances, balance and body conditioning.',
      img: '/api/public/media/stream/silambam/services.png'
    },
    {
      title: 'Nedukambu Long Staff',
      desc: 'Rapid wrist pivots, continuous spins and strikes.',
      img: '/api/public/media/stream/silambam/1.jpg'
    },
    {
      title: 'Maan Kombu Deer Horn',
      desc: 'Spiral deer horn daggers and close-quarters locks.',
      img: '/api/public/media/stream/silambam/2.jpg'
    },
    {
      title: 'Surul Vaal Flexible Sword',
      desc: 'Flexible steel whip velocity and circular flow.',
      img: '/api/public/media/stream/silambam/3.jpg'
    },
    {
      title: 'Porr Combat Sparring',
      desc: 'Tournament combat, Sukma rules and timed bouts.',
      img: '/api/public/media/stream/silambam/4.jpg'
    },
    {
      title: 'Irattai Kambu Dual Sticks',
      desc: 'Dual short sticks and ambidextrous coordination.',
      img: '/api/public/media/stream/silambam/5.jpg'
    },
    {
      title: 'Varma Kalai Pressure Points',
      desc: '108 vital battlefield pressure points and nerve locks.',
      img: '/api/public/media/stream/silambam/7.jpg'
    },
    {
      title: 'Adult Fitness & Self-Defence',
      desc: 'Functional strength, flexibility and practical defense.',
      img: '/api/public/media/stream/silambam/8.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#182332] selection:bg-[#C6A04A] selection:text-[#102137]">
      
      {/* =========================================================================
          SECTION 1: HERO (Matching Reference 1 exactly)
          Full-width dark background, jumping action athlete, giant TRAIN. MASTER. RISE.
          concise 1-sentence subtitle, rating & hours credential pill.
         ========================================================================= */}
      <section className="relative flex min-h-[92vh] lg:min-h-[96dvh] flex-col justify-center items-center overflow-hidden bg-[#060B26] text-white pt-20 pb-16 px-4">
        
        {/* Full-Bleed Background Action Photography with Natural Contrast & High Visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroContent.bgImage || '/api/public/media/stream/silambam/1.jpg'}
            alt="Silambam Master Action"
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle directional vignette ensuring text readability without dimming the martial artist */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B26] via-[#060B26]/40 to-[#060B26]/60 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Pill Tag (Reference 1) */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#102137]/80 backdrop-blur-md border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-display font-semibold uppercase tracking-wider mb-6 shadow-lg">
            <span>{heroContent.badge || '⚡ 10-STAGE GURUKULAM SYLLABUS · EST. 1975'}</span>
          </div>

          {/* Giant Centered Headline: Dynamic with Gold Accent (Reference 1) */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase leading-[0.88] mb-6">
            {renderHeroHeadline(heroContent.title || 'TRAIN. MASTER. RISE.')}
          </h1>

          {/* Short, Impactful 1-Sentence Subtitle (Reference 1) */}
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto mb-8 font-normal leading-relaxed drop-shadow-sm">
            {heroContent.subtitle || 'Traditional Gurukulam syllabus, bamboo staff mastery, and battlefield combat sparring for champions of all ages.'}
          </p>

          {/* Rating, Credential & Hours Pill (Reference 1) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-6 py-2.5 rounded-full bg-[#0B1726]/90 backdrop-blur-md border border-[#C6A04A]/40 text-xs text-slate-200 shadow-xl mb-8">
            <span className="flex items-center text-[#D9B96E] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#C6A04A] text-[#C6A04A] mr-1.5" />
              5.0 · Verified Tournament Record
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="flex items-center text-slate-300">
              <Award className="w-3.5 h-3.5 text-[#C6A04A] mr-1.5" />
              Malaysia Book of Records (2022)
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#C6A04A] mr-1.5" />
              6:30 PM – 9:30 PM
            </span>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto rounded-full bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-extrabold text-xs uppercase px-8 py-4 shadow-xl transition-all"
            >
              <span>Join Training Now</span>
              <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </Link>
            <a
              href="#disciplines"
              className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase px-8 py-4 border border-white/20 backdrop-blur-xs transition-all text-center"
            >
              <span>Explore Disciplines ↓</span>
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CHOOSE YOUR DISCIPLINE (Matching Reference 2 exactly)
          White background, centered heading, 5-column asymmetric photo masonry grid,
          bottom-left text overlay with colored dot. Zero long paragraphs.
         ========================================================================= */}
      <section id="disciplines" className="scroll-mt-16 bg-white py-20 md:py-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#C6A04A]">
              8 ARENAS, ONE VENUE
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#102137] tracking-tight uppercase">
              CHOOSE YOUR ARENA
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Select any discipline to view syllabus progression and training schedules.
            </p>
          </div>

          {/* 5-Column Asymmetric Masonry Image Grid (Reference 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Column 1: Tall Card */}
            <div
              onClick={() => handleSelectProgramToEnquire(masonryDisciplines.col1.name)}
              className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={masonryDisciplines.col1.img}
                alt={masonryDisciplines.col1.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm">
                  <span className={`w-2 h-2 rounded-full ${masonryDisciplines.col1.dot}`} />
                  <span>{masonryDisciplines.col1.name}</span>
                </div>
                <div className="text-[11px] text-slate-300 ml-3.5">
                  {masonryDisciplines.col1.sub}
                </div>
              </div>
            </div>

            {/* Column 2: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col2.map((d, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectProgramToEnquire(d.name)}
                  className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm">
                      <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                      <span>{d.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 ml-3.5">
                      {d.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col3.map((d, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectProgramToEnquire(d.name)}
                  className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm">
                      <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                      <span>{d.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 ml-3.5">
                      {d.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 4: Tall Card */}
            <div
              onClick={() => handleSelectProgramToEnquire(masonryDisciplines.col4.name)}
              className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={masonryDisciplines.col4.img}
                alt={masonryDisciplines.col4.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm">
                  <span className={`w-2 h-2 rounded-full ${masonryDisciplines.col4.dot}`} />
                  <span>{masonryDisciplines.col4.name}</span>
                </div>
                <div className="text-[11px] text-slate-300 ml-3.5">
                  {masonryDisciplines.col4.sub}
                </div>
              </div>
            </div>

            {/* Column 5: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col5.map((d, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectProgramToEnquire(d.name)}
                  className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm">
                      <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                      <span>{d.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 ml-3.5">
                      {d.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MORE THAN A SPORTS COMPLEX / OVERVIEW (Matching Reference 3)
          Deep Navy background, 2-column header, 4 metric cards (3,000+ yrs, 50+ yrs,
          10 stages, 40+ titles), "Everything under one roof" icon cards, and
          museum-grade showcase of The Malaysia Book of Records certificate.
         ========================================================================= */}
      <section id="about" className="relative scroll-mt-16 bg-[#0A1233] py-20 md:py-28 text-white border-b border-[#183B5B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top 2-Column Split (Reference 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
            
            <div className="lg:col-span-6 space-y-2">
              <span className="text-xs font-display font-bold uppercase tracking-widest text-[#C6A04A]">
                OVERVIEW
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
                More than a martial arts academy
              </h2>
              <div className="pt-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                PERSATUAN AADHIRAN SILAMBAM PULAU PINANG · GEORGE TOWN, PENANG
              </div>
            </div>

            <div className="lg:col-span-6 text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-2">
              <p>
                Malaysia's premier traditional martial arts institution since 1975 — preserving ancient Sangam warrior lineage through structured Gurukulam training, pro-grade bamboo equipment, and championship combat.
              </p>
            </div>

          </div>

          {/* 4 Metric Cards Row (Reference 3) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <Compass className="w-5 h-5 text-[#C6A04A] mb-4" />
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-white">
                  3,000+ <span className="text-xs text-[#C6A04A] font-bold">yrs</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">Sangam lineage</div>
                <div className="text-[11px] text-slate-400 mt-1">Ancient battlefield warrior roots.</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <Award className="w-5 h-5 text-[#C6A04A] mb-4" />
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-white">
                  50+ <span className="text-xs text-[#C6A04A] font-bold">yrs</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">Academy pedagogy</div>
                <div className="text-[11px] text-slate-400 mt-1">Established on 25 February 1975.</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <CheckCircle2 className="w-5 h-5 text-[#C6A04A] mb-4" />
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-white">
                  10 <span className="text-xs text-[#C6A04A] font-bold">stages</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">Gurukulam syllabus</div>
                <div className="text-[11px] text-slate-400 mt-1">From Kaaladi to Varma mastery.</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <Trophy className="w-5 h-5 text-[#C6A04A] mb-4" />
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-white">
                  40+ <span className="text-xs text-[#C6A04A] font-bold">titles</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">Championship records</div>
                <div className="text-[11px] text-slate-400 mt-1">National Sukma and state golds.</div>
              </div>
            </div>

          </div>

          {/* Everything Under One Roof & MBOR Showcase (Reference 3) */}
          <div className="pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-display font-bold uppercase tracking-widest text-[#C6A04A]">
                  WHY AADHIRAN SILAMBAM
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase mt-1">
                  Everything under one roof
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                10 disciplines & credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                { title: 'Nedukambu Staff Training', desc: 'Dedicated nets for long staff coaching.' },
                { title: 'Maan Kombu Deer Horns', desc: 'Rare dual spiral dagger defense.' },
                { title: 'UNESCO Living Heritage', desc: 'Recognized cultural treasure of Penang.' },
                { title: 'Porr Combat Sparring', desc: 'Tournament contact sparring under Sukma rules.' },
                { title: 'Weekend & Evening Batches', desc: 'Convenient schedules for kids and adults.' },
                { title: 'Certified Master Coaches', desc: 'Experienced national tournament coaches.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center space-x-3.5 group hover:border-[#C6A04A]/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#102137] border border-[#183B5B] flex items-center justify-center text-[#C6A04A] shrink-0">
                    <Swords className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-white group-hover:text-[#D9B96E] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Official MBOR Certificate Card */}
            <div id="mbor-recognition" className="p-6 rounded-2xl bg-[#060B26] border border-[#C6A04A]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div
                  onClick={() => setCertModalOpen(true)}
                  className="cursor-pointer shrink-0 p-1 bg-gradient-to-br from-[#102137] via-[#C6A04A] to-[#183B5B] rounded-xl hover:scale-105 transition-transform"
                >
                  <img
                    src={mborCertificateUrl}
                    alt="The Malaysia Book of Records (2022) Certificate"
                    width={90}
                    height={120}
                    className="w-16 h-22 object-contain bg-white rounded shadow-inner"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#D9B96E] bg-[#102137] px-2.5 py-0.5 rounded border border-[#C6A04A]/40">
                    National Record · 28 August 2022
                  </span>
                  <h4 className="text-base sm:text-lg font-display font-bold text-white mt-1">
                    Certified by The Malaysia Book of Records (2022)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Officially inducted as the <span className="text-[#C6A04A] font-bold">Oldest Silambam Association in Malaysia</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCertModalOpen(true)}
                className="shrink-0 btn-sports-primary text-xs uppercase px-5 py-2.5 rounded-full"
              >
                View Certificate
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PROGRAMS & CLASSES (Matching Reference 4 exactly)
          White background, centered heading, "Sports 11" subhead, 4x2 clean card grid:
          photo takes upper 75% with title overlay, white footer with 1 concise sentence.
         ========================================================================= */}
      <section id="programs" className="scroll-mt-16 bg-white py-20 md:py-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#C6A04A]">
              MORE THAN COURTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#102137] tracking-tight uppercase">
              PROGRAMS & CLASSES
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Structured 10-stage Gurukulam tracks from beginner footwork to advanced weapon combat.
            </p>
          </div>

          {/* Subheading row: Gurukulam Tracks count (Reference 4) */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-display font-extrabold text-[#102137]">
                Gurukulam Tracks
              </span>
              <span className="text-xs font-bold text-[#C6A04A] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                8
              </span>
            </div>
            <span className="text-xs text-[#64748B] hidden sm:inline">
              Coached martial and weapon programmes.
            </span>
          </div>

          {/* 4x2 Card Grid (Reference 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programsList.map((prog, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectProgramToEnquire(prog.title)}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Photo upper 75% with bottom title overlay and top arrow */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={prog.img}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Localized bottom overlay for title readability - top half is 100% natural and bright */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060B26]/85 via-[#060B26]/20 to-transparent pointer-events-none" />
                  
                  {/* Top-Right Arrow Circle */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#C6A04A] text-[#102137] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Overlaid Title at bottom of photo */}
                  <h3 className="absolute bottom-3 left-3 right-3 text-sm sm:text-base font-display font-bold text-white leading-snug">
                    {prog.title}
                  </h3>
                </div>

                {/* Lower 25% Footer: Exactly ONE concise sentence */}
                <div className="p-3.5 bg-white flex-1 flex items-center">
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {prog.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE ACADEMY (Matching Reference 5 exactly)
          Deep Navy background, centered massive THE ACADEMY heading, 1-line subtitle,
          2x2 grid of wide cards with top icon, massive ghosted 01 02 03 04,
          white bold title, and concise 1-2 sentence descriptions.
         ========================================================================= */}
      <section id="academy" className="scroll-mt-16 bg-[#0A1233] py-24 md:py-32 text-white border-b border-[#183B5B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#C6A04A]">
              PERSATUAN AADHIRAN SILAMBAM
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight uppercase">
              THE ACADEMY
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Built for athletes who seek true discipline, weapon mastery, and Malaysia's oldest Silambam lineage.
            </p>
          </div>

          {/* 2x2 Wide Numbered Cards (Reference 5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Card 01 */}
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                  <Swords className="w-5 h-5" />
                </div>
                <span className="text-4xl sm:text-5xl font-display font-black text-slate-600/40 select-none">
                  01
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                Regulation Arenas
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tournament-standard practice halls, impact-absorbent training mats, and traditional weapons armory.
              </p>
            </div>

            {/* Card 02 */}
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-4xl sm:text-5xl font-display font-black text-slate-600/40 select-none">
                  02
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                Gurukulam Syllabus
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Structured 10-stage progression from fundamental Kaaladi footwork to advanced weapon combat.
              </p>
            </div>

            {/* Card 03 */}
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-4xl sm:text-5xl font-display font-black text-slate-600/40 select-none">
                  03
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                Flexible Training Batches
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Daily morning, evening, and weekend training sessions designed for juniors, youth, and working adults.
              </p>
            </div>

            {/* Card 04 */}
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-4xl sm:text-5xl font-display font-black text-slate-600/40 select-none">
                  04
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                Malaysia's Oldest Lineage
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Certified by The Malaysia Book of Records (2022) with over 40 state and Sukma championship titles.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PHOTOGRAPHIC CTA BANNER (Matching Reference 7 exactly)
          Full-bleed leaping athlete photo with high visibility, dark vignette, centered
          "EVERY ARENA, ONE TAP AWAY" + gold pill button "Book a Slot →".
         ========================================================================= */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center overflow-hidden bg-[#060B26]">
        <img
          src="/api/public/media/stream/silambam/1.jpg"
          alt="Every Arena, One Tap Away"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B26] via-[#060B26]/30 to-[#060B26]/70 pointer-events-none" />

        <div className="relative z-10 text-center space-y-4 px-4">
          <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-widest text-slate-200">
            EVERY ARENA, ONE TAP AWAY
          </span>
          <div>
            <a
              href="#enquire"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all"
            >
              <span>Book a Slot</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: ENQUIRY (Matching Reference 6 exactly)
          Deep Midnight Navy, centered toggle pill (Programs / Corporate events),
          Split layout:
            Left: JOIN A CLASS pill + Enquire about Program + WhatsApp pill + call pill
            Right: Dark rounded form card with Name, Phone, Email, Programme, Date, Message, Send enquiry
         ========================================================================= */}
      <section id="enquire" className="scroll-mt-16 bg-[#060B26] py-20 md:py-28 text-white border-t border-[#183B5B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Toggle Pill Switch (Reference 6) */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex p-1 rounded-full bg-[#0B1726] border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setEnquiryBatchType('regular')}
                className={`px-6 py-2 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all ${
                  enquiryBatchType === 'regular'
                    ? 'bg-[#C6A04A] text-[#102137] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Programs
              </button>
              <button
                type="button"
                onClick={() => setEnquiryBatchType('private')}
                className={`px-6 py-2 rounded-full font-display font-semibold text-xs uppercase tracking-wider transition-all ${
                  enquiryBatchType === 'private'
                    ? 'bg-[#C6A04A] text-[#102137] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Corporate events
              </button>
            </div>
          </div>

          {/* Split Layout (Reference 6) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (Reference 6) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider">
                <span>🎓 JOIN A CLASS</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
                Enquire about<br />
                <span className="text-[#C6A04A]">{enquiryForm.programme}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Select your program and our masters will share batch timings, schedule, and fee details.
              </p>

              {/* Direct WhatsApp Green Pill & Phone Pill Buttons (Reference 6) */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/60124567890?text=Hello%20Aadhiran%20Silambam,%20I%20would%20like%20to%20enquire%20about%20training%20batches."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-[#060B26] font-display font-bold text-xs uppercase shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>WhatsApp us</span>
                </a>

                <a
                  href="tel:+60124567890"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#0B1726] hover:bg-[#102137] text-white font-display font-bold text-xs uppercase border border-white/20 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 text-[#C6A04A]" />
                  <span>086107 60680</span>
                </a>
              </div>

            </div>

            {/* Right Column: Dark Form Card (Reference 6) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1726]/90 border border-white/10 shadow-2xl">
                
                <h3 className="text-base sm:text-lg font-display font-bold text-white mb-6">
                  Class enquiry
                </h3>

                {enquirySuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{enquirySuccess}</span>
                  </div>
                )}

                {enquiryError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{enquiryError}</span>
                  </div>
                )}

                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  
                  {/* Field: YOUR NAME */}
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.fullName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                    />
                  </div>

                  {/* 2-Column: PHONE & EMAIL (OPTIONAL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        PHONE
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        EMAIL (OPTIONAL)
                      </label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>
                  </div>

                  {/* 2-Column: PROGRAMME & PREFERRED DATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        PROGRAMME
                      </label>
                      <select
                        value={enquiryForm.programme}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, programme: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      >
                        <option value="Kaaladi Footwork">Kaaladi Footwork</option>
                        <option value="Nedukambu Staff">Nedukambu Staff</option>
                        <option value="Maan Kombu Deer Horn">Maan Kombu Deer Horn</option>
                        <option value="Surul Vaal Blade">Surul Vaal Blade</option>
                        <option value="Porr Combat Sparring">Porr Combat Sparring</option>
                        <option value="Irattai Kambu Dual Sticks">Irattai Kambu Dual Sticks</option>
                        <option value="Varma Kalai Pressure Points">Varma Kalai Pressure Points</option>
                        <option value="Adult Fitness & Self-Defence">Adult Fitness & Self-Defence</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        PREFERRED DATE (OPTIONAL)
                      </label>
                      <input
                        type="date"
                        value={enquiryForm.preferredDate}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>
                  </div>

                  {/* Field: ANYTHING ELSE? (OPTIONAL) */}
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      ANYTHING ELSE? (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Timings, group size, questions..."
                      className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                    />
                  </div>

                  {/* Full-Width Gold Button: Send enquiry */}
                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-4 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-black text-xs uppercase tracking-wider shadow-xl transition-all"
                  >
                    {enquirySubmitting ? (
                      <span>Sending enquiry...</span>
                    ) : (
                      <span>Send enquiry</span>
                    )}
                  </button>

                </form>

              </div>
            </div>

          </div>

        </div>
      </section>



      {/* =========================================================================
          CERTIFICATE LIGHTBOX ZOOM MODAL
         ========================================================================= */}
      {certModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-w-xl w-full bg-[#102137] rounded-3xl p-6 sm:p-8 border-2 border-[#C6A04A] shadow-2xl text-white">
            
            <button
              onClick={() => setCertModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Certificate Zoom"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5 mb-6">
              <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-[#D9B96E] text-[11px] font-display font-bold uppercase tracking-wider border border-[#C6A04A]/40">
                <Award className="w-3.5 h-3.5 text-[#C6A04A]" />
                <span>The Malaysia Book of Records</span>
              </span>
              <h3 className="text-xl font-display font-black text-white uppercase">
                Oldest Silambam Association in Malaysia
              </h3>
              <p className="text-xs text-slate-300">
                Awarded to Persatuan Aadhiran Silambam Pulau Pinang • 28 August 2022
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-inner max-w-sm mx-auto">
              <img
                src={mborCertificateUrl}
                alt="The Malaysia Book of Records Official Certificate (2022)"
                width={551}
                height={738}
                className="w-full h-auto object-contain rounded"
              />
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-300 pt-4 border-t border-slate-700">
              <span>Induction: 28 August 2022</span>
              <button
                onClick={() => setCertModalOpen(false)}
                className="btn-sports-primary text-xs uppercase px-5 py-2 rounded-full"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
