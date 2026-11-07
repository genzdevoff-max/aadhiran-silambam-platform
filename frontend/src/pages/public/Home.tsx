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
  X,
  Plus
} from 'lucide-react';
import { publicApi } from '../../services/api';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';

interface HeroBgImage {
  id: string;
  url: string;
  alt: string;
  objectPosition: string;
}

const DEFAULT_HERO_BG_IMAGES: HeroBgImage[] = [
  {
    id: 'hero-bg-1',
    url: '/api/public/media/stream/silambam/30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg',
    alt: 'Master Silambam practitioner in traditional battlefield staff stance',
    objectPosition: 'center 32%',
  },
  {
    id: 'hero-bg-2',
    url: '/api/public/media/stream/silambam/1.jpg',
    alt: 'Dynamic leaping Silambam staff combat technique',
    objectPosition: 'center 28%',
  },
  {
    id: 'hero-bg-3',
    url: '/api/public/media/stream/silambam/b417be8b-6b26-4914-848f-fdc546a2abd2.jpg',
    alt: 'High-velocity rotational Silambam twirling in Gurukulam arena',
    objectPosition: 'center 35%',
  },
  {
    id: 'hero-bg-4',
    url: '/api/public/media/stream/silambam/55f38e6f-21d5-4a62-a178-d3921baa25fd.jpg',
    alt: '18-step Kaaladi groundwork defense positioning',
    objectPosition: 'center 30%',
  },
  {
    id: 'hero-bg-5',
    url: '/api/public/media/stream/silambam/cde7d1f2-37ec-4367-9130-16a957c6bb2e.jpg',
    alt: 'Silambam tournament championship combat duel',
    objectPosition: 'center 35%',
  },
];

export const Home: React.FC = () => {
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [enquiryBatchType, setEnquiryBatchType] = useState<'regular' | 'private'>('regular');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic Hero Content State (Stationary text synced with Admin CMS & TiDB Cloud)
  const [heroContent, setHeroContent] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    bgImage: string;
  }>({
    badge: '⚡ 10-STAGE GURUKULAM SYLLABUS · EST. 1975',
    title: 'AADHIRAN SILAMBAM',
    subtitle: 'Traditional Gurukulam syllabus, bamboo staff mastery, and battlefield combat sparring for champions of all ages.',
    bgImage: '/api/public/media/stream/silambam/30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg',
  });

  // Background Image Transitions (No carousel controls, stationary foreground text)
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0]));
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Active Background Images (incorporates CMS bgImage if customized)
  const bgImages = React.useMemo<HeroBgImage[]>(() => {
    const list = [...DEFAULT_HERO_BG_IMAGES];
    if (heroContent.bgImage && heroContent.bgImage !== list[0].url) {
      list[0] = {
        ...list[0],
        url: heroContent.bgImage,
      };
    }
    return list;
  }, [heroContent.bgImage]);

  // Accessibility: Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Performance: Preload all hero background images into cache and inject preload link
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inject high-priority preload tag for first image if not present
    const firstUrl = bgImages[0]?.url;
    if (firstUrl) {
      const existingPreload = document.querySelector(`link[rel="preload"][href="${firstUrl}"]`);
      if (!existingPreload) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = firstUrl;
        document.head.appendChild(link);
      }
    }

    // Progressively pre-buffer all images to ensure seamless, flash-free crossfades
    bgImages.forEach((imgObj, idx) => {
      const img = new Image();
      img.src = imgObj.url;
      img.onload = () => {
        setLoadedIndices((prev) => new Set(prev).add(idx));
      };
    });
  }, [bgImages]);

  // Tab Visibility: Pause image transitions when browser tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Automatic Hero Background Crossfade: every 4.5 seconds (only when next image is fully loaded)
  useEffect(() => {
    if (isTabHidden || prefersReducedMotion || bgImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => {
        const next = (prev + 1) % bgImages.length;
        // Verify that the next photograph is loaded before advancing
        return loadedIndices.has(next) ? next : prev;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isTabHidden, prefersReducedMotion, bgImages.length, loadedIndices]);

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
          <span className="text-white block drop-shadow-md">{parts.join(' ')}</span>
          <span className="text-[#C6A04A] block mt-1 drop-shadow-md">{last}</span>
        </>
      );
    }
    return <span className="text-white block drop-shadow-md">{titleStr}</span>;
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

  // Authentic Silambam FAQ Items (Matching Anchor "FREQUENTLY ASKED" Architecture)
  const faqList = [
    {
      q: 'What age groups are eligible to join Aadhiran Silambam?',
      a: 'We welcome students from age 6 (Junior Kaaladi batch) through youth, adults, and master practitioners. Classes are divided into junior, senior, and open adult batches with age-appropriate conditioning.'
    },
    {
      q: 'Do I need prior martial arts experience or equipment?',
      a: 'No prior experience is necessary. Beginners start with basic footwork (Kaaladi Varisai) and hand positioning. Regulation bamboo staffs (Nedukambu) and practice uniforms are provided upon registration.'
    },
    {
      q: 'How does the 10-Stage Gurukulam Syllabus progression work?',
      a: 'Students progress sequentially from Kaaladi footwork (Stage 1) through long staff twirling (Stage 2), dual sticks, deer horn daggers (Maan Kombu), flexible sword (Surul Vaal), and vital pressure point lore (Varma Kalai, Stage 10).'
    },
    {
      q: 'What are the training session days and timings?',
      a: 'Regular evening training runs daily from 6:30 PM to 9:30 PM at our George Town academy dojo. Weekend morning batches are held Saturdays and Sundays from 8:00 AM to 11:00 AM.'
    },
    {
      q: 'Is Persatuan Aadhiran Silambam an officially recognized institution?',
      a: 'Yes. Persatuan Aadhiran Silambam Pulau Pinang was established on 25 February 1975 (ROS Reg: PPM-014-07-25021975) and is officially certified by The Malaysia Book of Records as the Oldest Silambam Association in Malaysia.'
    },
    {
      q: 'Are trial classes available before full enrollment?',
      a: 'Yes! We offer a complimentary trial training session so prospective students and parents can experience the Gurukulam discipline, meet the coaching masters, and observe live training.'
    }
  ];

  // Authentic Testimonials & Reviews (Matching Anchor "LOVED BY PLAYERS" Architecture)
  const testimonials = [
    {
      name: 'Kavitha Ramasamy',
      role: 'Parent of Junior Student (Kaaladi Stage 2)',
      quote: 'My 8-year-old son joined Aadhiran for discipline and focus. In 6 months, his balance, posture, and confidence have transformed completely. The masters maintain true ancient tradition with great care.',
      rating: 5,
    },
    {
      name: 'Dr. Vigneshwaran S.',
      role: 'Adult Practitioner & Sukma Participant',
      quote: 'The unbroken lineage of Grandmaster Mariapakkiam is felt in every movement. The staff mechanics and wrist velocity conditioning are unlike anything in modern sports. Truly world-class training.',
      rating: 5,
    },
    {
      name: 'Tan Wei Jin',
      role: 'Martial Arts Enthusiast & Adult Member',
      quote: 'The Gurukulam curriculum is exceptionally structured. Learning traditional Surul Vaal and Varma points directly from certified national coaches has been an empowering journey.',
      rating: 5,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#182332] selection:bg-[#C6A04A] selection:text-[#102137]">
      
      {/* =========================================================================
          SECTION 1: HERO VIEWPORT (Stationary Text + Automatic Background Rotation)
          Full-width dark background, crossfading authentic B2 Silambam photography,
          gentle Ken Burns zoom, stationary readable typography, no carousel controls.
         ========================================================================= */}
      <section
        id="hero"
        className="relative flex min-h-[92vh] lg:min-h-[96dvh] flex-col justify-center items-center overflow-hidden bg-[#060B26] text-white pt-20 pb-20 px-4"
      >
        {/* Full-Bleed Background Action Photography (Automatic Crossfade Only - No Slider Controls) */}
        <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {bgImages.map((imgObj, idx) => {
            const isActive = idx === currentBgIndex;
            return (
              <div
                key={imgObj.id}
                className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={imgObj.url}
                  alt={imgObj.alt}
                  style={{ objectPosition: imgObj.objectPosition }}
                  className={`w-full h-full object-cover will-change-transform will-change-opacity ${
                    isActive && !prefersReducedMotion ? 'animate-ken-burns' : 'scale-100'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  {...(idx === 0 ? { fetchPriority: 'high' } : {})}
                  onLoad={() => setLoadedIndices((prev) => new Set(prev).add(idx))}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/uploads/silambam-back.jpg';
                  }}
                />
              </div>
            );
          })}

          {/* Subtle Vignette & Scrim: Kept subtle so photographs remain bright, authentic and vivid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(6,11,38,0.28),rgba(6,11,38,0.68)_82%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#060B26] via-[#060B26]/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#060B26]/65 to-transparent" />
        </div>

        {/* Foreground Hero Content: Heading, description and CTA buttons are stationary */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Pill Tag */}
          <ScrollReveal animation="fade-down" delay={0} duration={600}>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#102137]/90 backdrop-blur-md border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-display font-semibold uppercase tracking-wider mb-6 shadow-xl">
              <span>{heroContent.badge}</span>
            </div>
          </ScrollReveal>

          {/* Stationary Giant Centered Headline */}
          <ScrollReveal animation="fade-up" delay={100} duration={700}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase leading-[0.88] mb-6 text-white drop-shadow-lg">
              {renderHeroHeadline(heroContent.title)}
            </h1>
          </ScrollReveal>

          {/* Stationary Impactful Subtitle */}
          <ScrollReveal animation="fade-up" delay={200} duration={650}>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto mb-8 font-normal leading-relaxed drop-shadow-md">
              {heroContent.subtitle}
            </p>
          </ScrollReveal>

          {/* Stationary Rating, Credential & Hours Pill */}
          <ScrollReveal animation="fade-up" delay={300} duration={650}>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-6 py-2.5 rounded-full bg-[#0B1726]/90 backdrop-blur-md border border-[#C6A04A]/40 text-xs text-slate-200 shadow-2xl mb-8">
              <span className="flex items-center text-[#D9B96E] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#C6A04A] text-[#C6A04A] mr-1.5 shrink-0" />
                5.0 · Verified Tournament Record
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="flex items-center text-slate-200">
                <Award className="w-3.5 h-3.5 text-[#C6A04A] mr-1.5 shrink-0" />
                Malaysia Book of Records (2022)
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:flex items-center text-slate-200">
                <Clock className="w-3.5 h-3.5 text-[#C6A04A] mr-1.5 shrink-0" />
                6:30 PM – 9:30 PM
              </span>
            </div>
          </ScrollReveal>

          {/* Stationary Hero CTAs */}
          <ScrollReveal animation="fade-up" delay={400} duration={650}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/join-training"
                className="w-full sm:w-auto rounded-full bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-extrabold text-xs uppercase px-8 py-4 shadow-xl hover:shadow-[#C6A04A]/30 transition-all cursor-pointer"
              >
                <span>Join Training Now</span>
                <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </Link>
              <a
                href="#disciplines"
                className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase px-8 py-4 border border-white/25 backdrop-blur-sm transition-all text-center cursor-pointer"
              >
                <span>Explore Disciplines ↓</span>
              </a>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CHOOSE YOUR DISCIPLINE (Matching Reference 2 exactly)
          White background, centered heading, 5-column asymmetric photo masonry grid,
          bottom-left text overlay with colored dot. Staggered scroll animations.
         ========================================================================= */}
      <section id="disciplines" className="scroll-mt-16 bg-white py-20 md:py-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up" duration={600} className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102137] border border-[#183B5B] text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider shadow-sm mb-1">
              <span>8 ARENAS, ONE VENUE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#102137] tracking-tight uppercase">
              CHOOSE YOUR ARENA
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Select any discipline to view syllabus progression and training schedules.
            </p>
          </ScrollReveal>

          {/* 5-Column Asymmetric Masonry Image Grid with Staggered Entrance (Reference 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Column 1: Tall Card */}
            <ScrollReveal animation="fade-up" delay={80} duration={650}>
              <div
                onClick={() => handleSelectProgramToEnquire(masonryDisciplines.col1.name)}
                className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={masonryDisciplines.col1.img}
                  alt={masonryDisciplines.col1.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 pt-12 pb-4 px-4 bg-gradient-to-t from-[#060B26] via-[#060B26]/85 to-transparent">
                  <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm drop-shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${masonryDisciplines.col1.dot}`} />
                    <span>{masonryDisciplines.col1.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-200 ml-3.5 drop-shadow-sm">
                    {masonryDisciplines.col1.sub}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Column 2: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col2.map((d, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={150 + i * 100} duration={650}>
                  <div
                    onClick={() => handleSelectProgramToEnquire(d.name)}
                    className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-[#060B26] via-[#060B26]/85 to-transparent">
                      <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm drop-shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-200 ml-3.5 drop-shadow-sm">
                        {d.sub}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Column 3: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col3.map((d, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={220 + i * 100} duration={650}>
                  <div
                    onClick={() => handleSelectProgramToEnquire(d.name)}
                    className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-[#060B26] via-[#060B26]/85 to-transparent">
                      <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm drop-shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-200 ml-3.5 drop-shadow-sm">
                        {d.sub}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Column 4: Tall Card */}
            <ScrollReveal animation="fade-up" delay={300} duration={650}>
              <div
                onClick={() => handleSelectProgramToEnquire(masonryDisciplines.col4.name)}
                className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={masonryDisciplines.col4.img}
                  alt={masonryDisciplines.col4.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 pt-12 pb-4 px-4 bg-gradient-to-t from-[#060B26] via-[#060B26]/85 to-transparent">
                  <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm drop-shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${masonryDisciplines.col4.dot}`} />
                    <span>{masonryDisciplines.col4.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-200 ml-3.5 drop-shadow-sm">
                    {masonryDisciplines.col4.sub}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Column 5: Two Stacked Cards */}
            <div className="flex flex-col gap-4">
              {masonryDisciplines.col5.map((d, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={380 + i * 100} duration={650}>
                  <div
                    onClick={() => handleSelectProgramToEnquire(d.name)}
                    className="group relative h-44 sm:h-[184px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-[#060B26] via-[#060B26]/85 to-transparent">
                      <div className="flex items-center space-x-1.5 text-white font-display font-bold text-sm drop-shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${d.dot}`} />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-200 ml-3.5 drop-shadow-sm">
                        {d.sub}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MORE THAN A MARTIAL ARTS ACADEMY / OVERVIEW (Reference 3)
          Deep Navy background, 2-column header, 4 metric cards with animated numbers,
          "Everything under one roof" icon cards, and MBOR certificate showcase.
         ========================================================================= */}
      <section id="about" className="relative scroll-mt-16 bg-[#0A1233] py-20 md:py-28 text-white border-b border-[#183B5B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top 2-Column Split (Reference 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
            
            <ScrollReveal animation="fade-up" duration={600} className="lg:col-span-6 space-y-2">
              <span className="text-xs font-display font-bold uppercase tracking-widest text-[#D9B96E]">
                OVERVIEW
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
                More than a martial arts academy
              </h2>
              <div className="pt-2 text-xs text-slate-300 font-semibold uppercase tracking-wider">
                PERSATUAN AADHIRAN SILAMBAM PULAU PINANG · GEORGE TOWN, PENANG
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120} duration={650} className="lg:col-span-6 text-sm sm:text-base text-slate-200 leading-relaxed font-normal pt-2">
              <p className="text-slate-200">
                Malaysia's premier traditional martial arts institution since 1975 — preserving ancient Sangam warrior lineage through structured Gurukulam training, pro-grade bamboo equipment, and championship combat.
              </p>
            </ScrollReveal>

          </div>

          {/* 4 Metric Cards Row with Animated Numeric Counters (Reference 3) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            
            <ScrollReveal animation="fade-up" delay={100} duration={650}>
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col justify-between hover:border-[#C6A04A]/60 transition-colors">
                <Compass className="w-5 h-5 text-[#C6A04A] mb-4" />
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white flex items-baseline gap-1">
                    <AnimatedCounter value={3000} suffix="+" duration={1600} />
                    <span className="text-xs text-[#D9B96E] font-bold">yrs</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Sangam lineage</div>
                  <div className="text-[11px] text-slate-300 mt-1">Ancient battlefield warrior roots.</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} duration={650}>
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col justify-between hover:border-[#C6A04A]/60 transition-colors">
                <Award className="w-5 h-5 text-[#C6A04A] mb-4" />
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white flex items-baseline gap-1">
                    <AnimatedCounter value={50} suffix="+" duration={1600} />
                    <span className="text-xs text-[#D9B96E] font-bold">yrs</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Academy pedagogy</div>
                  <div className="text-[11px] text-slate-300 mt-1">Established on 25 February 1975.</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300} duration={650}>
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col justify-between hover:border-[#C6A04A]/60 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#C6A04A] mb-4" />
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white flex items-baseline gap-1">
                    <AnimatedCounter value={10} duration={1600} />
                    <span className="text-xs text-[#D9B96E] font-bold">stages</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Gurukulam syllabus</div>
                  <div className="text-[11px] text-slate-300 mt-1">From Kaaladi to Varma mastery.</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400} duration={650}>
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col justify-between hover:border-[#C6A04A]/60 transition-colors">
                <Trophy className="w-5 h-5 text-[#C6A04A] mb-4" />
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white flex items-baseline gap-1">
                    <AnimatedCounter value={40} suffix="+" duration={1600} />
                    <span className="text-xs text-[#D9B96E] font-bold">titles</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Championship records</div>
                  <div className="text-[11px] text-slate-300 mt-1">National Sukma and state golds.</div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Everything Under One Roof & MBOR Showcase (Reference 3) */}
          <div className="pt-10 border-t border-white/10">
            <ScrollReveal animation="fade-up" duration={600} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-display font-bold uppercase tracking-widest text-[#D9B96E]">
                  WHY AADHIRAN SILAMBAM
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase mt-1">
                  Everything under one roof
                </h3>
              </div>
              <span className="text-xs text-slate-300 font-semibold">
                10 disciplines & credentials
              </span>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                { title: 'Nedukambu Staff Training', desc: 'Dedicated training arenas for long staff coaching.' },
                { title: 'Maan Kombu Deer Horns', desc: 'Rare dual spiral dagger defense.' },
                { title: 'UNESCO Living Heritage', desc: 'Recognized cultural treasure of Penang.' },
                { title: 'Porr Combat Sparring', desc: 'Tournament contact sparring under Sukma rules.' },
                { title: 'Weekend & Evening Batches', desc: 'Convenient schedules for kids and adults.' },
                { title: 'Certified Master Coaches', desc: 'Experienced national tournament coaches.' },
              ].map((item, idx) => (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 70} duration={600}>
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-center space-x-3.5 group hover:border-[#C6A04A]/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#102137] border border-[#183B5B] flex items-center justify-center text-[#C6A04A] shrink-0">
                      <Swords className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-bold text-white group-hover:text-[#D9B96E] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Official MBOR Certificate Card */}
            <ScrollReveal animation="scale-up" delay={150} duration={700}>
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
                    <p className="text-xs text-slate-200 mt-0.5">
                      Officially inducted as the <span className="text-[#D9B96E] font-bold">Oldest Silambam Association in Malaysia</span>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCertModalOpen(true)}
                  className="shrink-0 btn-sports-primary text-xs uppercase px-5 py-2.5 rounded-full cursor-pointer"
                >
                  View Certificate
                </button>
              </div>
            </ScrollReveal>

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
          
          <ScrollReveal animation="fade-up" duration={600} className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102137] border border-[#183B5B] text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider shadow-sm mb-1">
              <span>MORE THAN COURTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#102137] tracking-tight uppercase">
              PROGRAMS & CLASSES
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Structured 10-stage Gurukulam tracks from beginner footwork to advanced weapon combat.
            </p>
          </ScrollReveal>

          {/* Subheading row: Gurukulam Tracks count (Reference 4) */}
          <ScrollReveal animation="fade-up" delay={100} duration={600} className="flex items-center justify-between pb-3 mb-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-display font-extrabold text-[#102137]">
                Gurukulam Tracks
              </span>
              <span className="text-xs font-bold text-[#102137] bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                8
              </span>
            </div>
            <span className="text-xs text-[#475569] font-medium hidden sm:inline">
              Coached martial and weapon programmes.
            </span>
          </ScrollReveal>

          {/* 4x2 Card Grid with Staggered Scroll Reveal (Reference 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programsList.map((prog, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 80} duration={650}>
                <div
                  onClick={() => handleSelectProgramToEnquire(prog.title)}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                >
                  {/* Photo upper 75% with bottom title overlay and top arrow */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={prog.img}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Localized bottom overlay for title readability */}
                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#060B26] via-[#060B26]/80 to-transparent pointer-events-none" />
                    
                    {/* Top-Right Arrow Circle */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#C6A04A] text-[#102137] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Overlaid Title at bottom of photo */}
                    <h3 className="absolute bottom-3 left-3 right-3 text-sm sm:text-base font-display font-bold text-white leading-snug drop-shadow-sm">
                      {prog.title}
                    </h3>
                  </div>

                  {/* Lower 25% Footer: High-contrast legible text */}
                  <div className="p-3.5 bg-white flex-1 flex items-center">
                    <p className="text-xs text-[#334155] leading-relaxed font-medium">
                      {prog.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
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
          
          <ScrollReveal animation="fade-up" duration={600} className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#D9B96E]">
              PERSATUAN AADHIRAN SILAMBAM
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight uppercase">
              THE ACADEMY
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Built for athletes who seek true discipline, weapon mastery, and Malaysia's oldest Silambam lineage.
            </p>
          </ScrollReveal>

          {/* 2x2 Wide Numbered Cards with Staggered Entrance (Reference 5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Card 01 */}
            <ScrollReveal animation="fade-up" delay={100} duration={650}>
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                    <Swords className="w-5 h-5" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-display font-black text-slate-500/35 select-none">
                    01
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                  Regulation Arenas
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Tournament-standard practice halls, impact-absorbent training mats, and traditional weapons armory.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 02 */}
            <ScrollReveal animation="fade-up" delay={200} duration={650}>
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-display font-black text-slate-500/35 select-none">
                    02
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                  Gurukulam Syllabus
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Structured 10-stage progression from fundamental Kaaladi footwork to advanced weapon combat.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 03 */}
            <ScrollReveal animation="fade-up" delay={300} duration={650}>
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-display font-black text-slate-500/35 select-none">
                    03
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                  Flexible Training Batches
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Daily morning, evening, and weekend training sessions designed for juniors, youth, and working adults.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 04 */}
            <ScrollReveal animation="fade-up" delay={400} duration={650}>
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden group hover:border-[#C6A04A]/60 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A04A]">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-display font-black text-slate-500/35 select-none">
                    04
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                  Malaysia's Oldest Lineage
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Certified by The Malaysia Book of Records (2022) with over 40 state and Sukma championship titles.
                </p>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* =========================================================================
          AUTHENTIC TESTIMONIALS: LOVED BY STUDENTS & MASTERS (Anchor Sports World)
          White background, star ratings, authentic student reviews.
         ========================================================================= */}
      <section className="bg-white py-20 md:py-28 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up" duration={600} className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102137] border border-[#183B5B] text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider shadow-sm mb-1">
              <span>WHAT PRACTITIONERS SAY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#102137] tracking-tight uppercase">
              LOVED BY PRACTITIONERS
            </h2>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C6A04A] text-[#C6A04A]" />
              ))}
              <span className="text-xs font-bold text-[#102137] ml-2">5.0 Star Rating</span>
              <span className="text-xs text-[#475569]">· Over 120+ active academy students</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 120} duration={650}>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(item.rating)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-[#C6A04A] text-[#C6A04A]" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed italic mb-6">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-display font-bold text-[#102137]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#475569] mt-0.5 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          AUTHENTIC FAQ: FREQUENTLY ASKED QUESTIONS (Anchor Sports World)
          Deep Navy background with clean collapsible accordion items.
         ========================================================================= */}
      <section id="faq" className="scroll-mt-16 bg-[#0A1233] py-20 md:py-28 text-white border-b border-[#183B5B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up" duration={600} className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[#D9B96E]">
              GOOD TO KNOW
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              FREQUENTLY ASKED
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Clear answers to the most common questions from prospective students and parents.
            </p>
          </ScrollReveal>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 60} duration={600}>
                  <div className="py-4 sm:py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-4 text-left group cursor-pointer focus:outline-hidden"
                    >
                      <span className="text-sm sm:text-base font-display font-bold text-white group-hover:text-[#D9B96E] transition-colors leading-snug">
                        {item.q}
                      </span>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'border-[#C6A04A] bg-[#C6A04A] text-[#102137] rotate-45'
                          : 'border-white/20 bg-white/5 text-slate-300 group-hover:border-[#C6A04A]'
                      }`}>
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pt-3 pr-8 text-xs sm:text-sm text-slate-200 leading-relaxed animate-fade-in font-normal">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
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
          onError={(e) => {
            const t = e.currentTarget;
            t.onerror = null;
            t.src = '/uploads/silambam-back.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B26] via-[#060B26]/30 to-[#060B26]/75 pointer-events-none" />

        <ScrollReveal animation="fade-up" duration={650} className="relative z-10 text-center space-y-4 px-4">
          <span className="text-xs sm:text-sm font-display font-black uppercase tracking-widest text-white drop-shadow-md">
            EVERY ARENA, ONE TAP AWAY
          </span>
          <div>
            <a
              href="#enquire"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all cursor-pointer"
            >
              <span>Book a Slot</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </ScrollReveal>
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
          <ScrollReveal animation="fade-down" duration={600} className="flex justify-center mb-14">
            <div className="inline-flex p-1 rounded-full bg-[#0B1726] border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={() => setEnquiryBatchType('regular')}
                className={`px-6 py-2 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
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
                className={`px-6 py-2 rounded-full font-display font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  enquiryBatchType === 'private'
                    ? 'bg-[#C6A04A] text-[#102137] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Corporate events
              </button>
            </div>
          </ScrollReveal>

          {/* Split Layout (Reference 6) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (Reference 6) */}
            <ScrollReveal animation="fade-up" duration={650} className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#102137] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider shadow-sm">
                <span>🎓 JOIN A CLASS</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
                Enquire about<br />
                <span className="text-[#C6A04A]">{enquiryForm.programme}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Select your program and our masters will share batch timings, schedule, and fee details.
              </p>

              {/* Direct WhatsApp Green Pill & Phone Pill Buttons (Reference 6) */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/60164147856?text=Hello%20Aadhiran%20Silambam,%20I%20would%20like%20to%20enquire%20about%20training%20batches."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-[#060B26] font-display font-extrabold text-xs uppercase shadow-lg transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>WhatsApp us</span>
                </a>

                <a
                  href="tel:+60164147856"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#0B1726] hover:bg-[#102137] text-white font-display font-bold text-xs uppercase border border-white/20 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 text-[#C6A04A]" />
                  <span>+60 16-414 7856</span>
                </a>
              </div>

            </ScrollReveal>

            {/* Right Column: Dark Form Card (Reference 6) */}
            <ScrollReveal animation="fade-up" delay={150} duration={650} className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1726] border border-white/15 shadow-2xl">
                
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
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.fullName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                    />
                  </div>

                  {/* 2-Column: PHONE & EMAIL (OPTIONAL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        PHONE
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        EMAIL (OPTIONAL)
                      </label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>
                  </div>

                  {/* 2-Column: PROGRAMME & PREFERRED DATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        PROGRAMME
                      </label>
                      <select
                        value={enquiryForm.programme}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, programme: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white text-xs focus:outline-hidden focus:border-[#C6A04A]"
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
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        PREFERRED DATE (OPTIONAL)
                      </label>
                      <input
                        type="date"
                        value={enquiryForm.preferredDate}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white text-xs focus:outline-hidden focus:border-[#C6A04A]"
                      />
                    </div>
                  </div>

                  {/* Field: ANYTHING ELSE? (OPTIONAL) */}
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      ANYTHING ELSE? (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Timings, group size, questions..."
                      className="w-full px-4 py-3 rounded-xl bg-[#060B26] border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-[#C6A04A]"
                    />
                  </div>

                  {/* Full-Width Gold Button: Send enquiry */}
                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-4 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer"
                  >
                    {enquirySubmitting ? (
                      <span>Sending enquiry...</span>
                    ) : (
                      <span>Send enquiry</span>
                    )}
                  </button>

                </form>

              </div>
            </ScrollReveal>

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
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
              <p className="text-xs text-slate-200">
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

            <div className="mt-6 flex items-center justify-between text-xs text-slate-200 pt-4 border-t border-slate-700">
              <span>Induction: 28 August 2022</span>
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="btn-sports-primary text-xs uppercase px-5 py-2 rounded-full cursor-pointer"
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
