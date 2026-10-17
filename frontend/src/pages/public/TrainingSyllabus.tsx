import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Shield,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Swords,
  Target
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
    if (stageNum <= 3) return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
    if (stageNum <= 6) return 'bg-crimson-950/60 text-crimson-300 border-crimson-800/60';
    return 'bg-gold-500/10 text-gold-300 border-gold-500/30';
  };

  return (
    <div className="bg-[#090b0f] text-gray-200">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#0e121a] via-[#090b0f] to-[#090b0f] border-b border-charcoal-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-charcoal-900/90 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            <span>Uncorrupted 10-Stage Gurukulam Curriculum</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            10-Stage Traditional Syllabus
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-gold-300 font-medium tracking-wide">
            பத்து நிலை பாடத்திட்டம் <span className="text-gray-500 font-sans mx-2">•</span> From Elementary Twirling to Master Synthesis
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Safeguarded without dilution in George Town since 1936. Progress is judged purely through physical mastery, weapon kinematics, and battlefield ethics.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-6">
            <Link to="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Training & Syllabus</span>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Callout: The No-Belting Custom */}
      <section className="py-12 bg-[#0d1017] border-b border-charcoal-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-900/60 border border-gold-500/20 backdrop-blur-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-crimson-950/80 border border-crimson-800/60 flex items-center justify-center flex-shrink-0 text-gold-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 block mb-1">
                Ancient Tamil Tradition • No Commercial Belts
              </span>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2">
                Why Aadhiran Has No Commercial Belting or Grading Fees
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Modern sport martial arts frequently rely on colored belt sales and point-touch sparring. In strict accordance with the ancient <strong className="text-gold-300">Gurukulam</strong> code brought from Madurai, Aadhiran disciples earn progression through verified execution of the 10 custom stages — mastering bamboo agility, animal combat forms, and traditional weapons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive 10-Stage Progression Showcase */}
      <section className="py-16 sm:py-24 border-b border-charcoal-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-crimson-400 tracking-widest block mb-2">
              Step-by-Step Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              The 10 Stages of Living Mastery
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
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
                      ? 'bg-crimson-800 text-white border-gold-500/60 shadow-lg shadow-crimson-950/80 scale-105'
                      : 'bg-charcoal-900/80 text-gray-300 border-charcoal-800 hover:border-gold-500/30 hover:bg-charcoal-850'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      isSelected ? 'bg-gold-400 text-black' : 'bg-charcoal-800 text-gold-400'
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
              <div className="p-3 bg-charcoal-900/60 rounded-xl border border-charcoal-800/80 flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-gold-400">Curriculum Index</span>
                <span className="font-mono text-gray-500">10 Total Stages</span>
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
                          ? 'bg-gradient-to-r from-crimson-950/90 to-charcoal-900 border-crimson-600 text-white shadow-md'
                          : 'bg-charcoal-900/60 border-charcoal-800 text-gray-300 hover:border-charcoal-700 hover:bg-charcoal-850'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isActive
                              ? 'bg-crimson-600 text-white shadow-sm'
                              : 'bg-charcoal-800 text-gold-400 group-hover:bg-charcoal-700'
                          }`}
                        >
                          {stage.stage_number}
                        </span>
                        <div>
                          <p className="text-[11px] font-mono text-gold-400">
                            {stage.tamil_name.split('(')[0]}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[210px]">
                            {stage.english_name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-gold-400 translate-x-1' : 'text-charcoal-700 group-hover:text-gray-400'
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
                <div className="p-6 sm:p-10 rounded-2xl bg-[#0e121a] border border-charcoal-700/80 shadow-2xl space-y-8 relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-600/10 via-transparent to-transparent pointer-events-none" />

                  {/* Stage Header Info */}
                  <div className="border-b border-charcoal-800/80 pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${getTierBadge(currentStage.stage_number)}`}>
                        {getTierName(currentStage.stage_number)}
                      </span>
                      <span className="text-xs font-mono text-gold-400/90 font-medium">
                        Stage {currentStage.stage_number} / 10
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                      {currentStage.english_name}
                    </h2>
                    <h3 className="text-base sm:text-lg font-mono font-medium text-gold-400 mt-1">
                      {currentStage.tamil_name}
                    </h3>
                  </div>

                  {/* Stage Overview */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-crimson-400 tracking-wider mb-2 flex items-center">
                      <Target className="w-3.5 h-3.5 mr-1.5" />
                      Pedagogical Mastery & Combat Objective
                    </h4>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                      {currentStage.overview}
                    </p>
                  </div>

                  {/* Techniques & Weapon Focus Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#090b0f] border border-charcoal-800/90">
                      <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
                        Key Techniques & Sequences
                      </span>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {currentStage.key_techniques || 'Traditional footworks, balance points, and posture control.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#090b0f] border border-charcoal-800/90">
                      <span className="text-xs font-mono font-bold text-crimson-400 uppercase tracking-wider flex items-center mb-2">
                        <Swords className="w-3.5 h-3.5 mr-1.5 text-crimson-400" />
                        Weapon Focus
                      </span>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {currentStage.weapon_focus || 'Seasoned Kurunji bamboo staff (Prambu).'}
                      </p>
                    </div>
                  </div>

                  {/* Animal Formations & Battlefield Kinematics */}
                  {currentStage.animal_movements && (
                    <div className="p-5 rounded-xl bg-gradient-to-r from-crimson-950/40 via-charcoal-900 to-[#090b0f] border border-crimson-900/60">
                      <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
                        Animal Postures & Combat Stances (மெய்ப்பாடுகள்)
                      </span>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {currentStage.animal_movements}
                      </p>
                    </div>
                  )}

                  {/* Stage Bottom Navigation Controls */}
                  <div className="pt-6 border-t border-charcoal-800/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                      disabled={currentStage.stage_number <= 1}
                      onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2.5 rounded-lg bg-charcoal-850 hover:bg-charcoal-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 transition-colors flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Previous Stage</span>
                    </button>

                    <Link
                      to="/join-training"
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-crimson-800 via-crimson-700 to-crimson-800 hover:from-crimson-700 hover:to-crimson-600 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-crimson-950 border border-gold-500/40 flex items-center"
                    >
                      <span>Apply for Training</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-gold-300" />
                    </Link>

                    <button
                      disabled={currentStage.stage_number >= 10}
                      onClick={() => setActiveStage((prev) => Math.min(10, prev + 1))}
                      className="px-4 py-2.5 rounded-lg bg-charcoal-850 hover:bg-charcoal-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 transition-colors flex items-center"
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
      <section className="py-20 bg-[#0c0f16] border-b border-charcoal-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-crimson-400 tracking-widest block mb-2">
              Sacred Weaponry
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Traditional Weapons of Aadhiran
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-3">
              Beyond the elemental bamboo staff, advanced Aadhiran disciples train in rare historic Tamil weapons of battlefield lineage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weapon 1: Maan Kombu */}
            <div className="p-7 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-950/60 border border-gold-700/50 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">மான் கொம்பு (Maan Kombu)</h3>
                <p className="text-xs font-mono text-gold-400 mb-4">Deer Horn / Maduvu • Stage 5</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Dual interlocking deer horns tipped with tempered steel spikes. Engineered for rapid sword deflections, wrist locks, and fatal inner-strike counters in close quarters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-charcoal-800 text-[11px] text-gray-500 font-mono">
                Kurunji Hunting & Close Defense
              </div>
            </div>

            {/* Weapon 2: Surul Vaal */}
            <div className="p-7 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 hover:border-crimson-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-crimson-950/60 border border-crimson-700/50 flex items-center justify-center text-crimson-400 mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">சுருள் வாள் (Surul Vaal)</h3>
                <p className="text-xs font-mono text-crimson-400 mb-4">Flexible Ribbon Whip Sword • Stage 6</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Multiple flexible spring-steel ribbon blades creating continuous rotational defensive vortexes. Wielded only by senior disciples with absolute spatial discipline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-charcoal-800 text-[11px] text-gray-500 font-mono">
                Rotational Kinetic Defense
              </div>
            </div>

            {/* Weapon 3: Vel Kambu */}
            <div className="p-7 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-950/60 border border-gold-700/50 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">வேல் கம்பு (Vel Kambu)</h3>
                <p className="text-xs font-mono text-gold-400 mb-4">Spear Combat • Stage 7</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  The sacred spear of ancient Kurunji warriors. Precision thrusting vectors (Kuthu Varisai), circular shaft parries, and hooking disarms at maximum perimeter reach.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-charcoal-800 text-[11px] text-gray-500 font-mono">
                Long-Range Perimeter Control
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-20 bg-[#090b0f] text-center border-t border-charcoal-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase font-bold text-gold-400 tracking-widest block mb-3">
            Begin Your Martial Journey
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Step Onto the Gurukulam Path
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Classes are held at our George Town headquarters. Open to beginners, youth, and dedicated martial artists seeking authentic 5,000-year traditional lineage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-crimson-800 via-crimson-700 to-crimson-800 hover:from-crimson-700 hover:to-crimson-600 text-white font-semibold text-sm tracking-wide transition-all shadow-lg border border-gold-500/40"
            >
              Enquire for Admission →
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/40 text-gray-300 hover:text-white text-sm font-semibold transition-all"
            >
              Visit Headquarters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
