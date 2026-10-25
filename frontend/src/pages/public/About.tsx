import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Compass,
  Flame,
  Globe,
  Award,
  Target,
  HeartPulse,
  Sparkles,
  Swords,
  CheckCircle2,
} from 'lucide-react';
import { generalInfo } from '../../data';

export const About: React.FC = () => {
  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* Header Banner - Deep Navy Authority */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{generalInfo.siteName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            About Aadhiran Silambam
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-amber-300 font-semibold tracking-wide">
            {generalInfo.tamilName} • Preserving Ancient Tamil Martial Wisdom
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <span className="text-amber-200">About Aadhiran</span>
          </div>
        </div>
      </section>

      {/* Main Narrative & Association Heritage - Warm Ivory */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest block">
                Official Association Identity
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] leading-tight">
                Custodians of an Intangible Cultural Heritage
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                <strong className="text-[#0B1B3D]">{generalInfo.siteName}</strong> was formally established on{' '}
                <span className="text-amber-700 font-semibold">25th February 1975</span> under registration number{' '}
                <span className="text-amber-700 font-mono font-bold">{generalInfo.registrationNumber}</span>. On 28th August 2022, the association received official induction into the{' '}
                <strong className="text-[#0B1B3D]">Malaysia Book of Records</strong> as the{' '}
                <span className="text-crimson-700 font-semibold">Oldest Silambam Association in Malaysia</span>.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Aadhiran is the only ancient Silambam discipline in the world that maintains absolute authenticity, focusing purely on stick twirling methods, intricate footwork, animated animal movements, and tricky attacking manoeuvres. There are neither modern alterations nor influences from other disciplines—only ancient Tamil martial traditions faithfully safeguarded in Penang for nearly a century.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                While the art has virtually disappeared in its ancestral home of South India, the dedication of the 14th direct descendant, Grandmaster Mariapakkiam, and the continuing leadership of Chief Master Siva has allowed Aadhiran to become an internationally acknowledged treasure of the State of Penang and Malaysia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <span className="text-xs font-mono font-bold text-amber-700 uppercase block mb-1">
                    Registration Authority
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">{generalInfo.registrationBody}</h4>
                  <p className="text-xs text-slate-600 mt-1">{generalInfo.registrationNumber} (Established {generalInfo.foundedYear})</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <span className="text-xs font-mono font-bold text-crimson-600 uppercase block mb-1">
                    Headquarters
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">{generalInfo.address}</h4>
                  <p className="text-xs text-slate-600 mt-1">UNESCO World Heritage Site, {generalInfo.state}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-white">
                <div className="p-6 text-center border-b border-stone-100 bg-[#0B1B3D] text-white">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full p-1 bg-gradient-to-br from-amber-400 via-amber-300 to-crimson-600 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
                      <img
                        src="/logo.png"
                        alt="Aadhiran Silambam Association Emblem"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-display font-bold text-white">Aadhiran Silambam Association (ASA)</h4>
                  <p className="text-xs text-amber-300 font-mono">PPM-014-07-25021975 • Est. 1975</p>
                </div>
                <img
                  src="/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png"
                  alt="Malaysia Book of Record Presentation"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-white text-left">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block font-mono">National Heritage Milestone</span>
                  <h4 className="text-sm font-display font-bold text-[#0B1B3D]">Malaysia Book of Records Presentation</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Certified Oldest Silambam Association in Malaysia (2022)</p>
                </div>
              </div>

              {/* Global Expansion & Qatar Branch */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <span className="text-[11px] font-mono font-bold text-navy-800 uppercase tracking-widest block">
                  Middle East Hub
                </span>
                <h4 className="text-[#0B1B3D] font-display font-bold text-base">
                  Aadhiran Qatar Branch & MENA Region
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Originating from native Tamil Nadu and safeguarded in Penang, the Aadhiran team is the leading presence quenching the Silambam thirst across the Middle East. With our Qatar branch as the regional anchor, our practitioners actively compete in State, National, and International tournaments across India, Malaysia, and the Gulf.
                </p>
                <div className="pt-2 border-t border-stone-100 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                    <strong>Dual Mastery:</strong> Traditional Por Silambam & Tournament Sport Silambam
                  </p>
                  <p className="flex items-center text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 mr-2" />
                    <strong>Health Mission:</strong> Reclaiming agile traditional fitness against sedentary lifestyles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASA Emblem Symbolism Section */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-100 border border-navy-200 text-navy-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Official ASA Crest Anatomy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D]">
              The Meaning Behind Our Sacred Emblem
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Every detail in the Aadhiran Silambam Association seal encapsulates our ancient Tamil origin, martial philosophy, and global custodianship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Centerpiece */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-br from-amber-400 via-amber-300 to-crimson-600 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-2">
                    <img
                      src="/logo.png"
                      alt="Official Aadhiran Silambam Association Emblem"
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="font-display font-extrabold text-xl text-[#0B1B3D] tracking-widest block">
                  AADHIRAN SILAMBAM
                </span>
                <span className="text-xs font-mono font-semibold text-amber-700 tracking-widest uppercase">
                  ASA • Aadhiran Silambam Association
                </span>
              </div>
            </div>

            {/* Emblem Breakdown Elements */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-crimson-50 border border-crimson-200 flex items-center justify-center text-crimson-600 flex-shrink-0 mt-0.5">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D] flex items-center">
                      <span>Twin Combatants in Red & Blue</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-amber-800">
                        Por & Sport Silambam
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Representing the clashing staves of martial confrontation and the complete integration of traditional <strong>Por Silambam</strong> (deadly battlefield warfare) and <strong>Sport Silambam</strong> (regulated competitive championship combat).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D] flex items-center">
                      <span>The Bengal White Tiger (புலி)</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-amber-800">
                        Pulipaaivu Kinematics
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Depicted behind the combatants within the shield. It embodies primal courage and dynamic animal combat maneuvers (Pulipaaivu) developed in the stone age by ancient ancestors observing wild beasts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D] flex items-center">
                      <span>Crossed Swords & Bamboo Staves</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-amber-800">
                        Weapons Evolution
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Flanking the shield are crossed swords and bamboo staves—tracing the continuous historical progression from stone-age tree branches to metal spears, swords, and deer horn blades (Maduvu / Maan Kombu).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D] flex items-center">
                      <span>Royal Crown & Five-Point Star</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-amber-800">
                        Sovereign Gurukulam
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Symbolizing unyielding masterhood, sovereign lineage authority, and the highest standards of competitive and spiritual excellence upheld by Grandmasters for generations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 flex-shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D] flex items-center">
                      <span>Royal Blue Encirclement & Golden Arcs</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-amber-800">
                        Global Reach
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The outer royal blue ring and solar gold arcs represent the global expansion of Aadhiran Silambam—connecting our origins in Tamil Nadu, our living sanctuary in Penang, and our MENA hub in Qatar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-amber-700 tracking-widest">
              Institutional Charter
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] mt-2">
              Vision & Mission of Aadhiran
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              The tripartite commitment driving our association across Tamil Nadu, Malaysia, Qatar, and the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tenet 1 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200 hover:border-navy-500 transition-all duration-300 relative group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 mb-6 group-hover:scale-105 transition-transform">
                <Target className="w-7 h-7 text-[#0B1B3D]" />
              </div>
              <span className="text-xs font-mono font-bold text-navy-800 uppercase tracking-widest block mb-2">
                Mission Objective 1
              </span>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-3">
                MENA Region Central Hub
              </h3>
              <p className="text-sm text-amber-800 font-semibold mb-3">
                "Make Aadhiran Qatar branch the central hub of Silambam for the MENA region."
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Establishing the State of Qatar as our Middle East nerve center, delivering structured traditional training and sport tournament development to quench the martial arts thirst of youth across the MENA region.
              </p>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-navy-700" />
                <span>Qatar & Middle East Expansion</span>
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200 hover:border-crimson-500 transition-all duration-300 relative group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-crimson-50 border border-crimson-200 flex items-center justify-center text-crimson-600 mb-6 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-7 h-7 text-crimson-600" />
              </div>
              <span className="text-xs font-mono font-bold text-crimson-700 uppercase tracking-widest block mb-2">
                Mission Objective 2
              </span>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-3">
                Worldwide Health & Agility
              </h3>
              <p className="text-sm text-amber-800 font-semibold mb-3">
                "Spread the art worldwide by establishing health benefits required for sedentary lifestyles."
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrating how the rapid stick rotations, triangular footwork, breathing harmony, and vital point (Varma) stimulation in Silambam counteract the modern physical deterioration caused by inactive desk and screen habits.
              </p>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-crimson-600" />
                <span>Holistic Physical Conditioning</span>
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 transition-all duration-300 relative group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-105 transition-transform">
                <Globe className="w-7 h-7 text-amber-600" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest block mb-2">
                Mission Objective 3
              </span>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-3">
                Global Rules Standardization
              </h3>
              <p className="text-sm text-amber-800 font-semibold mb-3">
                "Work with peoples having similar thoughts to derive standardized rules for worldwide practice."
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uniting traditional masters, sport commissions, and heritage organizations globally to formulate unified tournament guidelines, fair judging systems, and safety protocols while strictly preserving original martial authenticity.
              </p>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-amber-600" />
                <span>International Sports Federation Accord</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Martial Pillars */}
      <section className="py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-amber-700 tracking-widest">
              Guiding Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1B3D] mt-2">
              The Four Pillars of Aadhiran
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Upholding the timeless Tamil code of warrior conduct, ethical restraint, and physical mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-crimson-50 border border-crimson-200 flex items-center justify-center text-crimson-600 mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-2">1. குருகுலம் (Gurukulam)</h3>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Unbroken Transmission</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Knowledge passed directly from Master to Disciple in accordance with 5,000 years of traditional Guru-Student etiquette, honoring the lineage founders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-2">2. ஒழுக்கம் (Ozhukkam)</h3>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Ethical Restraint</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Martial skill is exclusively for self-defense, character preservation, and cultural protection. Aggression and ostentatious bravado are strictly forbidden.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-crimson-50 border border-crimson-200 flex items-center justify-center text-crimson-600 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-2">3. பாரம்பரியம் (Parambariyam)</h3>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Living Heritage</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refusal to modify authentic techniques for commercial sporting belt businesses or Western entertainment, preserving the sacred 10-stage syllabus intact.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0B1B3D] mb-2">4. மெய்க்காப்பு (Meikappu)</h3>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Total Body Mastery</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harmony of breathing, mental agility, pressure-point awareness (Varma), and lightning-quick staff rotation building lifelong physical resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Navy Banner */}
      <section className="py-16 bg-[#0B1B3D] text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            Learn More About Our Living Lineage
          </h3>
          <p className="text-sm text-slate-300 mb-8 max-w-xl mx-auto">
            Discover how the 14th descendant Grandmaster Mariapakkiam brought the art from Madurai to George Town in 1936.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/history-lineage"
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors shadow-md shadow-navy-950/40"
            >
              Explore History & Lineage →
            </Link>
            <Link
              to="/instructors"
              className="px-6 py-3 rounded-lg bg-navy-900 hover:bg-navy-850 text-amber-300 font-semibold text-sm border border-navy-700"
            >
              Meet the Masters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
