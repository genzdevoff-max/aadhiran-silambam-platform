import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Clock
} from 'lucide-react';
import { instructorsList } from '../../data';
import { publicApi } from '../../services/api';
import type { Instructor } from '../../types';
import { ScrollReveal } from '../../components/common/ScrollReveal';

export const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>(instructorsList);

  useEffect(() => {
    publicApi.getInstructors().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setInstructors(data);
      }
    }).catch(() => {});
  }, []);

  const lineagePillars = instructors.filter(
    (i) => i.role_type === 'grandmaster' || i.role_type === 'head_master'
  );
  const councilInstructors = instructors.filter(
    (i) => i.role_type !== 'grandmaster' && i.role_type !== 'head_master'
  );

  return (
    <div className="bg-[#F8FAFC] text-[#182332]">
      {/* 1. Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-28 bg-[#102137] border-b border-[#183B5B] text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fade-down" delay={0} duration={600}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
              <span>Guru-Student Tradition (குருகுலம்)</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80} duration={650}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
              Masters & Coaching Staff
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={160} duration={650}>
            <p className="mt-3 text-lg sm:text-xl font-display text-[#D9B96E] font-semibold tracking-wide">
              ஆசிரியர்கள் மற்றும் குருமார்கள் <span className="text-slate-400 font-sans mx-2">•</span> Guardians of the Ancient Discipline
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={240} duration={650}>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Certified masters with decades of dedicated Gurukulam practice, tested through authentic traditional pedagogy and recognized by national heritage bodies.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300} duration={650}>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-6 font-medium">
              <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#D9B96E] font-semibold">Instructors & Coaches</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Lineage Custodians Feature Spotlight */}
      <section className="py-20 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={0} duration={650}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold text-[#C6A04A] tracking-widest block mb-2">
                Primary Lineage Authority
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#102137]">
                The Lineage Custodians
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-3">
                The master transmission that brought ancient Aadhiran Silambam from Madurai to Penang and elevated it to national heritage status.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lineagePillars.map((master, idx) => (
              <ScrollReveal key={master.id} animation="fade-up" delay={idx * 120} duration={650}>
                <div
                  className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] transition-all duration-300 flex flex-col sm:flex-row group shadow-sm hover:shadow-md h-full"
                >
                  {/* Photo */}
                  <div className="relative sm:w-2/5 h-80 sm:h-auto overflow-hidden bg-[#F8F5EE] flex-shrink-0">
                    <img
                      src={master.photo_url || '/api/public/media/stream/silambam/mariapaqiam4.png'}
                      alt={master.name}
                      width={320}
                      height={380}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/mariapaqiam4.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-r from-[#102137]/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#102137]/90 backdrop-blur-sm border border-[#C6A04A]/50 text-[10px] font-mono text-[#D9B96E] font-bold uppercase">
                      {master.lineage_rank}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-mono text-[#C6A04A] font-semibold uppercase tracking-wider block mb-1">
                        {(master.role_type || '').replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="text-2xl font-display font-bold text-[#102137]">
                        {master.name}
                      </h3>
                      <p className="text-xs font-mono text-[#C6A04A] mt-0.5">
                        {master.tamil_name}
                      </p>
                      <p className="text-xs font-semibold text-[#182332] mt-2">
                        {master.title}
                      </p>

                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mt-4">
                        {master.biography}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs text-[#64748B] font-mono">
                      <span className="flex items-center text-[#102137] font-semibold">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A] shrink-0" />
                        {master.years_experience}+ Years Practice
                      </span>
                      <span className="text-[#C6A04A] font-semibold">Living Lineage</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Instruction Council & Senior Masters - Paper Background */}
      <section className="py-20 border-b border-[#E8E3D9] bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={0} duration={650}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold text-[#C6A04A] tracking-widest block mb-2">
                Teaching Council
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#102137]">
                Senior Masters & Field Instructors
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-3">
                Direct disciples responsible for youth development, weapons mastery, and community demonstrations across Penang.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {councilInstructors.map((instructor, idx) => (
              <ScrollReveal key={instructor.id} animation="fade-up" delay={(idx % 3) * 100} duration={650}>
                <div
                  className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md h-full"
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden bg-[#F8F5EE]">
                    <img
                      src={instructor.photo_url || '/api/public/media/stream/silambam/member1.png'}
                      alt={instructor.name}
                      width={380}
                      height={256}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/1129754474.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102137]/90 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#102137]/90 backdrop-blur-sm border border-[#183B5B] text-[#D9B96E] text-[11px] font-mono font-bold">
                      {instructor.lineage_rank}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono text-[#D9B96E] uppercase tracking-widest font-semibold block">
                        {(instructor.role_type || '').replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="text-lg font-display font-bold text-white">
                        {instructor.name}
                      </h3>
                      <p className="text-xs font-mono text-white/80">
                        {instructor.tamil_name}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-[#182332] mb-2 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                        <span>{instructor.years_experience}+ Years of Practice</span>
                      </div>

                      <p className="text-xs font-semibold text-[#102137] mb-2">
                        {instructor.title}
                      </p>

                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {instructor.biography}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E3D9] text-[11px] text-[#64748B] font-mono flex items-center justify-between">
                      <span>Aadhiran Gurukulam</span>
                      <span className="text-[#C6A04A] font-semibold">Verified Discipline</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gurukulam Code Notice */}
      <section className="py-16 bg-[#FDFBF7] border-b border-[#E8E3D9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal animation="fade-up" delay={0} duration={650}>
            <div className="w-12 h-12 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#C6A04A] shrink-0" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#102137] mb-2">
              The Gurukulam Student-Master Covenant
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              In Aadhiran, instructors do not merely teach techniques for sport medals. They transmit moral balance, battlefield self-restraint, respect for traditional elders, and cultural preservation. Students are accepted only upon agreeing to ethical martial conduct.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 bg-[#102137] border-t border-[#183B5B] text-center text-white">
        <ScrollReveal animation="fade-up" delay={0} duration={650}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              Train Under Living Lineage Masters
            </h3>
            <p className="text-sm text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Direct personal instruction from senior masters at our George Town training headquarters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/join-training"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-sm tracking-wide transition-all shadow-md"
              >
                Enquire for Admission →
              </Link>
              <Link
                to="/training-syllabus"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#183B5B] border border-[#C6A04A]/40 hover:border-[#C6A04A] text-white hover:text-white text-sm font-semibold transition-all"
              >
                Inspect 10-Stage Syllabus
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
