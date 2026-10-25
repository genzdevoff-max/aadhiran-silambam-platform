import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Clock
} from 'lucide-react';
import { instructorsList } from '../../data';

export const Instructors: React.FC = () => {
  const lineagePillars = instructorsList.filter(
    (i) => i.role_type === 'grandmaster' || i.role_type === 'head_master'
  );
  const councilInstructors = instructorsList.filter(
    (i) => i.role_type !== 'grandmaster' && i.role_type !== 'head_master'
  );

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* 1. Header Banner - Deep Navy */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Guru-Student Tradition (குருகுலம்)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            Masters & Living Custodians
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-amber-300 font-medium tracking-wide">
            ஆசிரியர்கள் மற்றும் குருமார்கள் <span className="text-slate-400 font-sans mx-2">•</span> Guardians of the Ancient Discipline
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Certified masters with decades of dedicated Gurukulam practice, tested through authentic traditional pedagogy and recognized by national heritage bodies.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-6">
            <Link to="/" className="hover:text-amber-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-200">Instructors</span>
          </div>
        </div>
      </section>

      {/* 2. Lineage Custodians Feature Spotlight */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest block mb-2">
              Primary Lineage Authority
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              The Lineage Custodians
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              The master transmission that brought ancient Aadhiran Silambam from Madurai to Penang and elevated it to national heritage status.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lineagePillars.map((master) => (
              <div
                key={master.id}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-amber-400 transition-all duration-300 flex flex-col sm:flex-row group shadow-sm hover:shadow-md"
              >
                {/* Photo */}
                <div className="relative sm:w-2/5 h-80 sm:h-auto overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={master.photo_url || '/uploads/mariapaqiam4.png'}
                    alt={master.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-navy-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold uppercase">
                    {master.lineage_rank}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-crimson-600 font-semibold uppercase tracking-wider block mb-1">
                      {master.role_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-[#0B1B3D]">
                      {master.name}
                    </h3>
                    <p className="text-xs font-mono text-amber-700 mt-0.5">
                      {master.tamil_name}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      {master.title}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                      {master.biography}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center text-amber-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {master.years_experience}+ Years Practice
                    </span>
                    <span className="text-slate-400">Living Lineage</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Instruction Council & Senior Masters */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-amber-700 tracking-widest block mb-2">
              Teaching Council
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              Senior Masters & Field Instructors
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              Direct disciples responsible for youth development, weapons mastery, and community demonstrations across Penang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {councilInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-amber-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden bg-stone-100">
                  <img
                    src={instructor.photo_url || '/uploads/member1.png'}
                    alt={instructor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-navy-700 text-amber-300 text-[11px] font-mono font-bold">
                    {instructor.lineage_rank}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-semibold block">
                      {instructor.role_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white">
                      {instructor.name}
                    </h3>
                    <p className="text-xs font-mono text-amber-200">
                      {instructor.tamil_name}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-amber-700 mb-2 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{instructor.years_experience}+ Years of Practice</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-2">
                      {instructor.title}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {instructor.biography}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Aadhiran Gurukulam</span>
                    <span className="text-crimson-600 font-semibold">Verified Discipline</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gurukulam Code Notice */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-display font-bold text-[#0B1B3D] mb-2">
            The Gurukulam Student-Master Covenant
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In Aadhiran, instructors do not merely teach techniques for sport medals. They transmit moral balance, battlefield self-restraint, respect for traditional elders, and cultural preservation. Students are accepted only upon agreeing to ethical martial conduct.
          </p>
        </div>
      </section>

      {/* 5. CTA Section - Navy Banner */}
      <section className="py-20 bg-[#0B1B3D] text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-display font-bold text-white mb-4">
            Train Under Living Lineage Masters
          </h3>
          <p className="text-sm text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Direct personal instruction from senior masters at our George Town training headquarters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm tracking-wide transition-all shadow-md border border-amber-400/40"
            >
              Enquire for Admission →
            </Link>
            <Link
              to="/training-syllabus"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-amber-400 text-slate-200 hover:text-white text-sm font-semibold transition-all"
            >
              Inspect 10-Stage Syllabus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
