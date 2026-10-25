import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Swords,
  Target,
  Shield
} from 'lucide-react';
import { syllabusStages } from '../../data';

export const TrainingSyllabus: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const currentStage =
    syllabusStages.find((s) => s.stage_number === activeStage) || syllabusStages[0];

  const getTierName = (stageNum: number) => {
    if (stageNum <= 3) return 'Level I — Foundations & Staff Kinematics';
    if (stageNum <= 6) return 'Level II — Combative Footwork & Animal Dynamics';
    return 'Level III — Master Arsenal & Lethal Synthesis';
  };

  const getTierBadge = (stageNum: number) => {
    if (stageNum <= 3) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (stageNum <= 6) return 'bg-crimson-100 text-crimson-800 border-crimson-300';
    return 'bg-navy-100 text-navy-900 border-navy-300';
  };

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* 1. Header Banner - Deep Navy */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Uncorrupted 10-Stage Gurukulam Curriculum</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            10-Stage Traditional Syllabus
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-amber-300 font-medium tracking-wide">
            பத்து நிலை பாடத்திட்டம் <span className="text-slate-400 font-sans mx-2">•</span> From Elementary Twirling to Master Synthesis
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Safeguarded without dilution in George Town since 1936. Progress is judged purely through physical mastery, weapon kinematics, and battlefield ethics.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-6">
            <Link to="/" className="hover:text-amber-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-200">Training & Syllabus</span>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Callout: The No-Belting Custom */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Award className="w-7 h-7 text-amber-100" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 block mb-1">
                Ancient Tamil Tradition • No Commercial Belts
              </span>
              <h3 className="text-lg sm:text-xl font-display font-bold text-[#0B1B3D] mb-2">
                Why Aadhiran Has No Commercial Belting or Grading Fees
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Modern sport martial arts frequently rely on colored belt sales and point-touch sparring. In strict accordance with the ancient <strong className="text-amber-900 font-semibold">Gurukulam</strong> code brought from Madurai, Aadhiran disciples earn progression through verified execution of the 10 custom stages — mastering bamboo agility, animal combat forms, and traditional weapons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive 10-Stage Progression Showcase */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest block mb-2">
              Step-by-Step Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              The 10 Stages of Living Mastery
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Click any stage below to inspect its pedagogical goals, weapon kinematics, and animal postures.
            </p>
          </div>

          {/* Quick Stage Horizontal Selector Pills */}
          <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 mb-10 gap-2 scrollbar-thin">
            {syllabusStages.map((stage) => {
              const isSelected = stage.stage_number === activeStage;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.stage_number)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-[#0B1B3D] text-white border-amber-400 shadow-md scale-105'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      isSelected ? 'bg-amber-400 text-navy-950' : 'bg-stone-100 text-slate-600'
                    }`}
                  >
                    {stage.stage_number}
                  </span>
                  <span className="truncate max-w-[130px] sm:max-w-none">
                    {stage.english_name.split(' ')[0]} {stage.english_name.split(' ')[1] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage View Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Stage Directory Menu */}
            <div className="lg:col-span-4 space-y-2 order-2 lg:order-1">
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs text-slate-600 mb-2 shadow-sm">
                <span className="font-semibold uppercase tracking-wider text-amber-800">Curriculum Index</span>
                <span className="font-mono text-slate-500">10 Total Stages</span>
              </div>

              <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
                {syllabusStages.map((stage) => {
                  const isActive = stage.stage_number === activeStage;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(stage.stage_number)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                        isActive
                          ? 'bg-navy-50/90 border-[#0B1B3D] text-[#0B1B3D] shadow-sm'
                          : 'bg-white border-stone-200 text-slate-700 hover:border-amber-400 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isActive
                              ? 'bg-[#0B1B3D] text-amber-300 shadow-sm'
                              : 'bg-stone-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900'
                          }`}
                        >
                          {stage.stage_number}
                        </span>
                        <div>
                          <p className="text-[11px] font-mono text-amber-800">
                            {stage.tamil_name.split('(')[0]}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate max-w-[210px]">
                            {stage.english_name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-amber-600 translate-x-1' : 'text-stone-400 group-hover:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Stage Deep-Dive Card */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              {currentStage && (
                <div className="p-6 sm:p-10 rounded-2xl bg-white border border-stone-200 shadow-lg space-y-8 relative overflow-hidden">
                  {/* Stage Header Info */}
                  <div className="border-b border-stone-100 pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${getTierBadge(currentStage.stage_number)}`}>
                        {getTierName(currentStage.stage_number)}
                      </span>
                      <span className="text-xs font-mono text-amber-800 font-medium">
                        Stage {currentStage.stage_number} / 10
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#0B1B3D] tracking-tight">
                      {currentStage.english_name}
                    </h2>
                    <h3 className="text-base sm:text-lg font-mono font-medium text-amber-700 mt-1">
                      {currentStage.tamil_name}
                    </h3>
                  </div>

                  {/* Stage Overview */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-crimson-600 tracking-wider mb-2 flex items-center">
                      <Target className="w-3.5 h-3.5 mr-1.5" />
                      Pedagogical Mastery & Combat Objective
                    </h4>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {currentStage.overview}
                    </p>
                  </div>

                  {/* Techniques & Weapon Focus Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        Key Techniques & Sequences
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {currentStage.key_techniques || 'Traditional footworks, balance points, and posture control.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-xs font-mono font-bold text-crimson-600 uppercase tracking-wider flex items-center mb-2">
                        <Swords className="w-3.5 h-3.5 mr-1.5 text-crimson-600" />
                        Weapon Focus
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {currentStage.weapon_focus || 'Seasoned Kurunji bamboo staff (Prambu).'}
                      </p>
                    </div>
                  </div>

                  {/* Animal Formations & Battlefield Kinematics */}
                  {currentStage.animal_movements && (
                    <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        Animal Postures & Combat Stances (மெய்ப்பாடுகள்)
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {currentStage.animal_movements}
                      </p>
                    </div>
                  )}

                  {/* Stage Bottom Navigation Controls */}
                  <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      disabled={currentStage.stage_number <= 1}
                      onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Previous Stage</span>
                    </button>

                    <Link
                      to="/join-training"
                      className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold tracking-wide transition-all shadow-md flex items-center"
                    >
                      <span>Apply for Training</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-white" />
                    </Link>

                    <button
                      disabled={currentStage.stage_number >= 10}
                      onClick={() => setActiveStage((prev) => Math.min(10, prev + 1))}
                      className="px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors flex items-center"
                    >
                      <span>Next Stage</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Traditional Arsenal Showcase */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest block mb-2">
              Sacred Weaponry
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              Traditional Weapons of Aadhiran
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              Beyond the elemental bamboo staff, advanced Aadhiran disciples train in rare historic Tamil weapons of battlefield lineage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weapon 1: Maan Kombu */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#0B1B3D] mb-1">மான் கொம்பு (Maan Kombu)</h3>
                <p className="text-xs font-mono text-amber-700 mb-4">Deer Horn / Maduvu • Stage 5</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dual interlocking deer horns tipped with tempered steel spikes. Engineered for rapid sword deflections, wrist locks, and fatal inner-strike counters in close quarters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-slate-400 font-mono">
                Kurunji Hunting & Close Defense
              </div>
            </div>

            {/* Weapon 2: Surul Vaal */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 hover:border-crimson-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-crimson-50 border border-crimson-200 flex items-center justify-center text-crimson-600 mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#0B1B3D] mb-1">சுருள் வாள் (Surul Vaal)</h3>
                <p className="text-xs font-mono text-crimson-700 mb-4">Flexible Ribbon Whip Sword • Stage 6</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Multiple flexible spring-steel ribbon blades creating continuous rotational defensive vortexes. Wielded only by senior disciples with absolute spatial discipline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-slate-400 font-mono">
                Rotational Kinetic Defense
              </div>
            </div>

            {/* Weapon 3: Vel Kambu */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#0B1B3D] mb-1">வேல் கம்பு (Vel Kambu)</h3>
                <p className="text-xs font-mono text-amber-700 mb-4">Spear Combat • Stage 7</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The sacred spear of ancient Kurunji warriors. Precision thrusting vectors (Kuthu Varisai), circular shaft parries, and hooking disarms at maximum perimeter reach.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-slate-400 font-mono">
                Long-Range Perimeter Control
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action - Navy Banner */}
      <section className="py-20 bg-[#0B1B3D] text-center border-t border-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block mb-3">
            Begin Your Martial Journey
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Step Onto the Gurukulam Path
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Classes are held at our George Town headquarters. Open to beginners, youth, and dedicated martial artists seeking authentic 5,000-year traditional lineage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm tracking-wide transition-all shadow-md border border-amber-400/40"
            >
              Enquire for Admission →
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-amber-400 text-slate-200 hover:text-white text-sm font-semibold transition-all"
            >
              Visit Headquarters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
