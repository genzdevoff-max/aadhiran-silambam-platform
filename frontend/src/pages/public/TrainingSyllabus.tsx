import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Swords,
  Target,
  Shield
} from 'lucide-react';
import { syllabusStages } from '../../data';
import { publicApi } from '../../services/api';
import type { SyllabusStage } from '../../types';

export const TrainingSyllabus: React.FC = () => {
  const [stages, setStages] = useState<SyllabusStage[]>(syllabusStages);
  const [activeStage, setActiveStage] = useState<number>(1);

  useEffect(() => {
    publicApi.getSyllabus().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setStages(data);
      }
    }).catch(() => {});
  }, []);

  const currentStage =
    stages.find((s) => s.stage_number === activeStage) || stages[0];

  const getTierName = (stageNum: number) => {
    if (stageNum <= 3) return 'Level I — Foundations & Staff Kinematics';
    if (stageNum <= 6) return 'Level II — Combative Footwork & Animal Dynamics';
    return 'Level III — Master Arsenal & Lethal Synthesis';
  };

  const getTierBadge = (stageNum: number) => {
    if (stageNum <= 3) return 'bg-[#F8F5EE] text-[#102137] border-[#E8E3D9]';
    if (stageNum <= 6) return 'bg-[#183B5B]/10 text-[#102137] border-[#183B5B]/20';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* 1. Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-28 bg-[#102137] border-b border-[#183B5B] text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/80 border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Uncorrupted 10-Stage Gurukulam Curriculum</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
            10-Stage Traditional Syllabus
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-[#D9B96E] font-medium tracking-wide">
            பத்து நிலை பாடத்திட்டம் <span className="text-[#64748B] font-sans mx-2">•</span> From Elementary Twirling to Master Synthesis
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed font-normal">
            Safeguarded without dilution in George Town since 1936. Progress is judged purely through physical mastery, weapon kinematics, and battlefield ethics.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-white/70 mt-6">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Training & Syllabus</span>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Callout: The No-Belting Custom */}
      <section className="py-12 bg-white border-b border-[#E8E3D9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F5EE] border border-[#E8E3D9] shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#102137] text-[#C6A04A] flex items-center justify-center flex-shrink-0 shadow-md">
              <Shield className="w-7 h-7 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A04A] block mb-1">
                Ancient Tamil Tradition • No Commercial Belts
              </span>
              <h3 className="text-lg sm:text-xl font-display font-bold text-[#102137] mb-2">
                Why Aadhiran Has No Commercial Belting or Grading Fees
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Modern sport martial arts frequently rely on colored belt sales and point-touch sparring. In strict accordance with the ancient <strong className="text-[#102137] font-semibold">Gurukulam</strong> code brought from Madurai, Aadhiran disciples earn progression through verified execution of the 10 custom stages — mastering bamboo agility, animal combat forms, and traditional weapons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive 10-Stage Progression Showcase */}
      <section className="py-16 sm:py-24 border-b border-[#E8E3D9] bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-[#C6A04A] tracking-widest block mb-2">
              Step-by-Step Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#102137]">
              The 10 Stages of Living Mastery
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2">
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
                      ? 'bg-[#102137] text-white border-[#102137] shadow-md scale-105'
                      : 'bg-white text-[#182332] border-[#E8E3D9] hover:border-[#C6A04A] hover:bg-[#F8F5EE]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      isSelected ? 'bg-[#C6A04A] text-[#102137]' : 'bg-[#F8F5EE] text-[#64748B]'
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
              <div className="p-3 bg-white rounded-xl border border-[#E8E3D9] flex items-center justify-between text-xs text-[#64748B] mb-2 shadow-sm">
                <span className="font-semibold uppercase tracking-wider text-[#102137]">Curriculum Index</span>
                <span className="font-mono text-[#C6A04A] font-bold">10 Total Stages</span>
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
                          ? 'bg-[#F8F5EE] border-[#102137] text-[#102137] shadow-sm'
                          : 'bg-white border-[#E8E3D9] text-[#182332] hover:border-[#C6A04A] hover:bg-[#F8F5EE]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isActive
                              ? 'bg-[#102137] text-[#C6A04A] shadow-sm'
                              : 'bg-[#F8F5EE] text-[#64748B] group-hover:bg-[#102137] group-hover:text-[#C6A04A]'
                          }`}
                        >
                          {stage.stage_number}
                        </span>
                        <div>
                          <p className="text-[11px] font-mono text-[#C6A04A] font-bold">
                            {stage.tamil_name.split('(')[0]}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-[#182332] truncate max-w-[210px]">
                            {stage.english_name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-[#102137] translate-x-1' : 'text-[#64748B] group-hover:text-[#182332]'
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
                <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm space-y-8 relative overflow-hidden">
                  {/* Stage Header Info */}
                  <div className="border-b border-[#E8E3D9] pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${getTierBadge(currentStage.stage_number)}`}>
                        {getTierName(currentStage.stage_number)}
                      </span>
                      <span className="text-xs font-mono text-[#C6A04A] font-bold">
                        Stage {currentStage.stage_number} / 10
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#102137] tracking-tight">
                      {currentStage.english_name}
                    </h2>
                    <h3 className="text-base sm:text-lg font-mono font-medium text-[#C6A04A] mt-1">
                      {currentStage.tamil_name}
                    </h3>
                  </div>

                  {/* Stage Overview */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-[#102137] tracking-wider mb-2 flex items-center">
                      <Target className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A]" />
                      Pedagogical Mastery & Combat Objective
                    </h4>
                    <p className="text-sm sm:text-base text-[#182332] leading-relaxed font-normal">
                      {currentStage.overview}
                    </p>
                  </div>

                  {/* Techniques & Weapon Focus Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                      <span className="text-xs font-mono font-bold text-[#102137] uppercase tracking-wider flex items-center mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A]" />
                        Key Techniques & Sequences
                      </span>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {currentStage.key_techniques || 'Traditional footworks, balance points, and posture control.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                      <span className="text-xs font-mono font-bold text-[#102137] uppercase tracking-wider flex items-center mb-2">
                        <Swords className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A]" />
                        Weapon Focus
                      </span>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {currentStage.weapon_focus || 'Seasoned Kurunji bamboo staff (Prambu).'}
                      </p>
                    </div>
                  </div>

                  {/* Animal Formations & Battlefield Kinematics */}
                  {currentStage.animal_movements && (
                    <div className="p-5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                      <span className="text-xs font-mono font-bold text-[#102137] uppercase tracking-wider flex items-center mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A]" />
                        Animal Postures & Combat Stances (மெய்ப்பாடுகள்)
                      </span>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {currentStage.animal_movements}
                      </p>
                    </div>
                  )}

                  {/* Stage Bottom Navigation Controls */}
                  <div className="pt-6 border-t border-[#E8E3D9] flex flex-wrap items-center justify-between gap-3">
                    <button
                      disabled={currentStage.stage_number <= 1}
                      onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-[#182332] transition-colors flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Previous Stage</span>
                    </button>

                    <Link
                      to="/join-training"
                      className="px-6 py-2.5 rounded-lg bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] text-xs font-bold tracking-wide transition-all shadow-sm flex items-center"
                    >
                      <span>Apply for Training</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-[#102137]" />
                    </Link>

                    <button
                      disabled={currentStage.stage_number >= 10}
                      onClick={() => setActiveStage((prev) => Math.min(10, prev + 1))}
                      className="px-4 py-2.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-[#182332] transition-colors flex items-center"
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
      <section className="py-20 bg-[#F8F5EE] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-[#C6A04A] tracking-widest block mb-2">
              Sacred Weaponry
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#102137]">
              Traditional Weapons of Aadhiran
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-3">
              Beyond the elemental bamboo staff, advanced Aadhiran disciples train in rare historic Tamil weapons of battlefield lineage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weapon 1: Maan Kombu */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-[#C6A04A] shrink-0" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#102137] mb-1">மான் கொம்பு (Maan Kombu)</h3>
                <p className="text-xs font-mono text-[#C6A04A] mb-4">Deer Horn / Maduvu • Stage 5</p>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Dual interlocking deer horns tipped with tempered steel spikes. Engineered for rapid sword deflections, wrist locks, and fatal inner-strike counters in close quarters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8E3D9] text-[11px] text-[#64748B] font-mono">
                Kurunji Hunting & Close Defense
              </div>
            </div>

            {/* Weapon 2: Surul Vaal */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-[#C6A04A] shrink-0" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#102137] mb-1">சுருள் வாள் (Surul Vaal)</h3>
                <p className="text-xs font-mono text-[#C6A04A] mb-4">Flexible Ribbon Whip Sword • Stage 6</p>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Multiple flexible spring-steel ribbon blades creating continuous rotational defensive vortexes. Wielded only by senior disciples with absolute spatial discipline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8E3D9] text-[11px] text-[#64748B] font-mono">
                Rotational Kinetic Defense
              </div>
            </div>

            {/* Weapon 3: Vel Kambu */}
            <div className="p-7 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-[#C6A04A] shrink-0" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#102137] mb-1">வேல் கம்பு (Vel Kambu)</h3>
                <p className="text-xs font-mono text-[#C6A04A] mb-4">Spear Combat • Stage 7</p>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  The sacred spear of ancient Kurunji warriors. Precision thrusting vectors (Kuthu Varisai), circular shaft parries, and hooking disarms at maximum perimeter reach.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8E3D9] text-[11px] text-[#64748B] font-mono">
                Long-Range Perimeter Control
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-20 bg-[#102137] border-t border-[#183B5B] text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase font-bold text-[#C6A04A] tracking-widest block mb-3">
            Begin Your Martial Journey
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Step Onto the Gurukulam Path
          </h3>
          <p className="text-sm sm:text-base text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Classes are held at our George Town headquarters. Open to beginners, youth, and dedicated martial artists seeking authentic 5,000-year traditional lineage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-training"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-sm tracking-wide transition-all shadow-md"
            >
              Enquire for Admission →
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#183B5B] border border-[#C6A04A]/40 hover:border-[#C6A04A] text-white hover:text-white text-sm font-semibold transition-all"
            >
              Visit Headquarters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
