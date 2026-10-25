import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Award,
  MapPin
} from 'lucide-react';

export const HistoryLineage: React.FC = () => {
  const timelineEvents = [
    {
      year: 'c. 3,000 BCE',
      timeframe: '5,000 Years Ago',
      title: 'Genesis in the Kurunji Mountain Ranges of Tamilakam',
      location: 'South India',
      description:
        'Originated among ancient Tamil mountain hunter-warriors in the Kurunji terrain. Practitioners studied animal combat kinematics (tiger, lion, serpent, deer) and developed the art of bamboo staff twirling and deceptive triangular footwork.',
      tag: 'Ancient Heritage',
    },
    {
      year: '1878',
      timeframe: 'Colonial Suppression',
      title: 'The Indian Arms Act & Threat of Extinction',
      location: 'British India',
      description:
        'Under British colonial rule, traditional martial arts and weapons training were heavily criminalized throughout India. While countless Gurukulam lineages were lost forever, the direct descendants of Aadhiran continued underground transmission in the Madurai region.',
      tag: 'Colonial Era',
    },
    {
      year: '1936',
      timeframe: 'Penang Sanctuary',
      title: 'Grandmaster Mariapakkiam Migrates to George Town',
      location: 'George Town, Penang, British Malaya',
      description:
        'The 14th direct lineage descendant of Aadhiran, Grandmaster Mariapakkiam, journeyed from Madurai to George Town. He brought the sacred, undiluted 10-stage syllabus with him, transplanting an ancient art that was rapidly facing extinction in its homeland.',
      tag: 'Penang Migration',
    },
    {
      year: '1975',
      timeframe: '25th February 1975',
      title: 'Official Charter & Registration of the Association',
      location: 'George Town, Penang',
      description:
        'Persatuan Aadhiran Silambam Pulau Pinang was formally founded and registered under Malaysian law (ROS: PPM-014-07-25021975). Grandmaster Mariapakkiam structured systematic public and Gurukulam training for local youths.',
      tag: 'Formal Association',
    },
    {
      year: '2017',
      timeframe: '14th February 2017',
      title: 'CNN Travel Global Living Heritage Spotlight',
      location: 'Global Feature',
      description:
        'CNN featured Aadhiran in their international article "9 reasons to visit Penang that have nothing to do with street food", acclaiming the association as George Town’s foremost living martial arts heritage.',
      tag: 'International Media',
    },
    {
      year: '2019',
      timeframe: 'July 2019',
      title: 'UNESCO Urban Living Heritage Inventory Recognition',
      location: 'George Town World Heritage Site',
      description:
        'Selected to represent living traditional martial arts in George Town urban community inventorying supported by UNESCO and George Town World Heritage Incorporated (GTWHI). Featured on the UNESCO Intangible Cultural Heritage portal.',
      tag: 'UNESCO Engagement',
    },
    {
      year: '2020',
      timeframe: 'November 2020',
      title: 'UNESCO ICHCAP Global Martial Arts Division Publication',
      location: 'Seoul / South Korea',
      description:
        'Aadhiran was the only martial art in Malaysia selected for publication in the global Traditional Martial Arts division by ICHCAP (International Information and Networking Centre for Intangible Cultural Heritage in the Asia-Pacific Region).',
      tag: 'Global Publication',
    },
    {
      year: '2022',
      timeframe: '28th August 2022',
      title: 'Malaysia Book of Records National Induction',
      location: 'National Record',
      description:
        'Formally inducted into the Malaysia Book of Records as the "Oldest Silambam Association in Malaysia", recognizing uninterrupted practice since 1936 and official founding on 25 February 1975.',
      tag: 'National Record',
    },
  ];

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* 1. Header Banner - Deep Navy Authority */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Guru-Student Lineage (குருகுலம்)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            History & 5,000-Year Lineage
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-amber-300 font-medium tracking-wide">
            ஆதிரன் சிலம்ப வரலாறு <span className="text-slate-400 font-sans mx-2">•</span> From Kurunji Mountains to Penang
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            How a primordial warrior science facing colonial eradication in India found safe haven in George Town, Penang in 1936.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-6">
            <Link to="/" className="hover:text-amber-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-200">History & Lineage</span>
          </div>
        </div>
      </section>

      {/* 2. The Lineage Custodians: Dual Spotlight */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Exposition */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest block">
                The Historical Migration
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] leading-tight">
                An Extinct Indian Art Preserved in George Town
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Silambam is among the world's most ancient systematized martial arts, cultivated by the Dravidian hunter-warriors of the prehistoric Kurunji highlands. Following the severe martial prohibitions of the British Colonial era, vast swathes of India's martial heritage disappeared into oblivion.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                In 1936, the 14th direct lineage descendant of Aadhiran, <strong className="text-[#0B1B3D]">Grandmaster Mariapakkiam</strong>, migrated across the Bay of Bengal from Madurai to George Town, Penang. In Penang's thriving port community, he safeguarded the complete, uncorrupted 10-stage syllabus.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Today, under the dedicated leadership of <strong className="text-[#0B1B3D]">Chief Master Siva</strong>, Penang serves as the world's sole acknowledged sanctuary of this 5,000-year traditional lineage.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-mono font-medium">
                  <Award className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  MBOR Certified (2022)
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-crimson-50 border border-crimson-200 text-xs text-crimson-700 font-mono font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-crimson-600" />
                  George Town Living Heritage
                </span>
              </div>
            </div>

            {/* Masters Photo Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Grandmaster Mariapakkiam */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-md group hover:border-amber-400 transition-all duration-300 flex flex-col">
                <div className="relative h-72 overflow-hidden bg-stone-100">
                  <img
                    src="/uploads/mariapaqiam4.png"
                    alt="Grandmaster Mariapakkiam"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold uppercase">
                    14th Descendant
                  </span>
                </div>
                <div className="p-5 bg-white flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-display font-bold text-[#0B1B3D]">Grandmaster Mariapakkiam</h4>
                    <p className="text-xs text-amber-700 font-mono mt-0.5">1936 Migration Pioneer</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Transferred the sacred Kurunji martial syllabus from Madurai to Penang during British Malaya.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-slate-400 font-mono">
                    Safeguarded Lineage 1936–1975
                  </div>
                </div>
              </div>

              {/* Master Siva */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-md group hover:border-amber-400 transition-all duration-300 flex flex-col">
                <div className="relative h-72 overflow-hidden bg-stone-100">
                  <img
                    src="/uploads/siva_orig.png"
                    alt="Chief Master Siva"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-crimson-400/50 text-[10px] font-mono text-crimson-300 font-bold uppercase">
                    Heritage Custodian
                  </span>
                </div>
                <div className="p-5 bg-white flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-display font-bold text-[#0B1B3D]">Chief Master Siva</h4>
                    <p className="text-xs text-crimson-600 font-mono mt-0.5">15th Lineage Successor</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Spearheading UNESCO Living Heritage documentation, ICHCAP division archives, and national recognition.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-slate-400 font-mono">
                    Living Custody (Present)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Chronological Heritage Timeline */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-amber-700 tracking-widest block mb-2">
              Unbroken Transmission
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              Chronological Heritage Timeline
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              Trace the unbroken journey of Aadhiran Silambam across five thousand years of documented history.
            </p>
          </div>

          <div className="relative border-l-2 border-stone-200 ml-4 sm:ml-36 space-y-12">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Year Marker on Left for desktop */}
                <div className="hidden sm:block absolute -left-40 top-1 text-right w-32">
                  <span className="block text-sm font-mono font-bold text-[#0B1B3D] group-hover:text-amber-700 transition-colors">
                    {item.year}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                    {item.timeframe}
                  </span>
                </div>

                {/* Timeline Node Dot */}
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-2 border-amber-600 group-hover:border-crimson-600 group-hover:bg-amber-600 transition-all duration-300 shadow-sm" />

                {/* Content Card */}
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="sm:hidden text-xs font-mono font-bold text-amber-700">
                      {item.year} • {item.timeframe}
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-crimson-50 border border-crimson-200 text-crimson-700">
                      {item.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
                      {item.location}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-[#0B1B3D] mb-2 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom Link To Syllabus & Masters - Navy Banner */}
      <section className="py-20 bg-[#0B1B3D] text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block mb-2">
            The Living Syllabus
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Explore the 10 Traditional Custom Stages
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            From Kaaladi footwork to Kurunji animal formations and flexible ribbon swords, inspect the complete curriculum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/training-syllabus"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm tracking-wide transition-all shadow-md border border-amber-400/40"
            >
              Explore 10 Stages →
            </Link>
            <Link
              to="/instructors"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-amber-400 text-slate-200 hover:text-white text-sm font-semibold transition-all"
            >
              Meet Current Masters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
