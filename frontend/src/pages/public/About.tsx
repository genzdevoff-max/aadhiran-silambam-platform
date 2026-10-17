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
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5 text-crimson-500" />
            <span>{generalInfo.siteName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            About Aadhiran Silambam
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            {generalInfo.tamilName} • Preserving Ancient Tamil Martial Wisdom
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">About Aadhiran</span>
          </div>
        </div>
      </section>

      {/* Main Narrative & Association Heritage */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold text-crimson-500 tracking-widest block">
                Official Association Identity
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                Custodians of an Intangible Cultural Heritage
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">
                <strong className="text-white">{generalInfo.siteName}</strong> was formally established on{' '}
                <span className="text-gold-400 font-semibold">25th February 1975</span> under registration number{' '}
                <span className="text-gold-400 font-mono">{generalInfo.registrationNumber}</span>. On 28th August 2022, the association received official induction into the{' '}
                <strong className="text-white">Malaysia Book of Records</strong> as the{' '}
                <span className="text-crimson-400 font-semibold">Oldest Silambam Association in Malaysia</span>.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                Aadhiran is the only ancient Silambam discipline in the world that maintains absolute authenticity, focusing purely on stick twirling methods, intricate footwork, animated animal movements, and tricky attacking manoeuvres. There are neither modern alterations nor influences from other disciplines—only ancient Tamil martial traditions faithfully safeguarded in Penang for nearly a century.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                While the art has virtually disappeared in its ancestral home of South India, the dedication of the 14th direct descendant, Grandmaster Mariapakkiam, and the continuing leadership of Chief Master Siva has allowed Aadhiran to become an internationally acknowledged treasure of the State of Penang and Malaysia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase block mb-1">
                    Registration Authority
                  </span>
                  <h4 className="text-sm font-semibold text-white">{generalInfo.registrationBody}</h4>
                  <p className="text-xs text-gray-400 mt-1">{generalInfo.registrationNumber} (Established {generalInfo.foundedYear})</p>
                </div>
                <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
                  <span className="text-xs font-mono font-bold text-crimson-400 uppercase block mb-1">
                    Headquarters
                  </span>
                  <h4 className="text-sm font-semibold text-white">{generalInfo.address}</h4>
                  <p className="text-xs text-gray-400 mt-1">UNESCO World Heritage Site, {generalInfo.state}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl bg-charcoal-900">
                <div className="p-6 text-center border-b border-charcoal-800 bg-[#090b0f]">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full p-1 bg-gradient-to-br from-cobalt-500 via-gold-400 to-crimson-600 shadow-xl">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="Aadhiran Silambam Association Emblem"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-display font-bold text-white">Aadhiran Silambam Association (ASA)</h4>
                  <p className="text-xs text-gold-400 font-mono">PPM-014-07-25021975 • Est. 1975</p>
                </div>
                <img
                  src="/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png"
                  alt="Malaysia Book of Record Presentation"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-charcoal-900 text-left">
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block font-mono">National Heritage Milestone</span>
                  <h4 className="text-sm font-display font-bold text-white">Malaysia Book of Records Presentation</h4>
                  <p className="text-xs text-gray-300 mt-0.5">Certified Oldest Silambam Association in Malaysia (2022)</p>
                </div>
              </div>

              {/* Global Expansion & Qatar Branch (from null.docx) */}
              <div className="p-6 rounded-2xl bg-[#0c0f18] border border-cobalt-800/60 shadow-xl space-y-3">
                <span className="text-[11px] font-mono font-bold text-cobalt-400 uppercase tracking-widest block">
                  Middle East Hub
                </span>
                <h4 className="text-white font-display font-bold text-base">
                  Aadhiran Qatar Branch & MENA Region
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Originating from native Tamil Nadu and safeguarded in Penang, the Aadhiran team is the leading presence quenching the Silambam thirst across the Middle East. With our Qatar branch as the regional anchor, our practitioners actively compete in State, National, and International tournaments across India, Malaysia, and the Gulf.
                </p>
                <div className="pt-2 border-t border-charcoal-800 text-xs text-gray-400 space-y-1">
                  <p className="flex items-center text-gold-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mr-2" />
                    <strong>Dual Mastery:</strong> Traditional Por Silambam & Tournament Sport Silambam
                  </p>
                  <p className="flex items-center text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-400 mr-2" />
                    <strong>Health Mission:</strong> Reclaiming agile traditional fitness against sedentary lifestyles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASA Emblem Symbolism Section (matching logo 01.pdf) */}
      <section className="py-20 border-b border-charcoal-800 bg-[#080b11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cobalt-950/80 border border-cobalt-700/60 text-cobalt-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Official ASA Crest Anatomy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              The Meaning Behind Our Sacred Emblem
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Every detail in the Aadhiran Silambam Association seal encapsulates our ancient Tamil origin, martial philosophy, and global custodianship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Centerpiece */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative group">
                {/* Glow rings */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cobalt-600 via-gold-500 to-crimson-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-br from-cobalt-500 via-gold-400 to-crimson-600 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden p-2">
                    <img
                      src="/logo.png"
                      alt="Official Aadhiran Silambam Association Emblem"
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="font-display font-extrabold text-xl text-white tracking-widest block">
                  AADHIRAN SILAMBAM
                </span>
                <span className="text-xs font-mono font-semibold text-gold-400 tracking-widest uppercase">
                  ASA • Aadhiran Silambam Association
                </span>
              </div>
            </div>

            {/* Emblem Breakdown Elements */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-800 hover:border-crimson-600/40 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-crimson-950 border border-crimson-700/60 flex items-center justify-center text-crimson-400 flex-shrink-0 mt-0.5">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <span>Twin Combatants in Red & Blue</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-gold-400">
                        Por & Sport Silambam
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Representing the clashing staves of martial confrontation and the complete integration of traditional <strong>Por Silambam</strong> (deadly battlefield warfare) and <strong>Sport Silambam</strong> (regulated competitive championship combat).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-800 hover:border-gold-500/40 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-gold-950 border border-gold-700/60 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <span>The Bengal White Tiger (புலி)</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-gold-400">
                        Pulipaaivu Kinematics
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Depicted behind the combatants within the shield. It embodies primal courage and dynamic animal combat maneuvers (Pulipaaivu) developed in the stone age by ancient ancestors observing wild beasts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-800 hover:border-cobalt-500/40 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-cobalt-950 border border-cobalt-700/60 flex items-center justify-center text-cobalt-400 flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <span>Crossed Swords & Bamboo Staves</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-gold-400">
                        Weapons Evolution
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Flanking the shield are crossed swords and bamboo staves—tracing the continuous historical progression from stone-age tree branches to metal spears, swords, and deer horn blades (Maduvu / Maan Kombu).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-800 hover:border-gold-500/40 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-gold-950 border border-gold-700/60 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <span>Royal Crown & Five-Point Star</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-gold-400">
                        Sovereign Gurukulam
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Symbolizing unyielding masterhood, sovereign lineage authority, and the highest standards of competitive and spiritual excellence upheld by Grandmasters for generations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-800 hover:border-cobalt-500/40 transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-cobalt-950 border border-cobalt-700/60 flex items-center justify-center text-cobalt-400 flex-shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <span>Royal Blue Encirclement & Golden Arcs</span>
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-gold-400">
                        Global Reach
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      The outer royal blue ring and solar gold arcs represent the global expansion of Aadhiran Silambam—connecting our origins in Tamil Nadu, our living sanctuary in Penang, and our MENA hub in Qatar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section (Directly from null.docx) */}
      <section className="py-20 border-b border-charcoal-800 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-gold-400 tracking-widest">
              Institutional Charter
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2">
              Vision & Mission of Aadhiran
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              The tripartite commitment driving our association across Tamil Nadu, Malaysia, Qatar, and the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tenet 1 */}
            <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-cobalt-500/50 transition-all duration-300 relative group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-cobalt-950 border border-cobalt-700/60 flex items-center justify-center text-cobalt-400 mb-6 group-hover:scale-105 transition-transform">
                <Target className="w-7 h-7 text-cobalt-400" />
              </div>
              <span className="text-xs font-mono font-bold text-cobalt-400 uppercase tracking-widest block mb-2">
                Mission Objective 1
              </span>
              <h3 className="text-lg font-display font-bold text-white mb-3">
                MENA Region Central Hub
              </h3>
              <p className="text-sm text-gold-300 font-semibold mb-3">
                "Make Aadhiran Qatar branch the central hub of Silambam for the MENA region."
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Establishing the State of Qatar as our Middle East nerve center, delivering structured traditional training and sport tournament development to quench the martial arts thirst of youth across the MENA region.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal-800 flex items-center text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-cobalt-400" />
                <span>Qatar & Middle East Expansion</span>
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-crimson-500/50 transition-all duration-300 relative group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-crimson-950 border border-crimson-700/60 flex items-center justify-center text-crimson-400 mb-6 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-7 h-7 text-crimson-400" />
              </div>
              <span className="text-xs font-mono font-bold text-crimson-400 uppercase tracking-widest block mb-2">
                Mission Objective 2
              </span>
              <h3 className="text-lg font-display font-bold text-white mb-3">
                Worldwide Health & Agility
              </h3>
              <p className="text-sm text-gold-300 font-semibold mb-3">
                "Spread the art worldwide by establishing health benefits required for sedentary lifestyles."
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Demonstrating how the rapid stick rotations, triangular footwork, breathing harmony, and vital point (Varma) stimulation in Silambam counteract the modern physical deterioration caused by inactive desk and screen habits.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal-800 flex items-center text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-crimson-400" />
                <span>Holistic Physical Conditioning</span>
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-gold-500/50 transition-all duration-300 relative group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gold-950 border border-gold-700/60 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-105 transition-transform">
                <Globe className="w-7 h-7 text-gold-400" />
              </div>
              <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest block mb-2">
                Mission Objective 3
              </span>
              <h3 className="text-lg font-display font-bold text-white mb-3">
                Global Rules Standardization
              </h3>
              <p className="text-sm text-gold-300 font-semibold mb-3">
                "Work with peoples having similar thoughts to derive standardized rules for worldwide practice."
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Uniting traditional masters, sport commissions, and heritage organizations globally to formulate unified tournament guidelines, fair judging systems, and safety protocols while strictly preserving original martial authenticity.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal-800 flex items-center text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-gold-400" />
                <span>International Sports Federation Accord</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Martial Pillars */}
      <section className="py-20 border-b border-charcoal-800 bg-charcoal-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-gold-400 tracking-widest">
              Guiding Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2">
              The Four Pillars of Aadhiran
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Upholding the timeless Tamil code of warrior conduct, ethical restraint, and physical mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="w-12 h-12 rounded-xl bg-crimson-900/30 border border-crimson-700/50 flex items-center justify-center text-crimson-400 mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">1. குருகுலம் (Gurukulam)</h3>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">Unbroken Transmission</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Knowledge passed directly from Master to Disciple in accordance with 5,000 years of traditional Guru-Student etiquette, honoring the lineage founders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="w-12 h-12 rounded-xl bg-gold-900/30 border border-gold-700/50 flex items-center justify-center text-gold-400 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">2. ஒழுக்கம் (Ozhukkam)</h3>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">Ethical Restraint</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Martial skill is exclusively for self-defense, character preservation, and cultural protection. Aggression and ostentatious bravado are strictly forbidden.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="w-12 h-12 rounded-xl bg-crimson-900/30 border border-crimson-700/50 flex items-center justify-center text-crimson-400 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">3. பாரம்பரியம் (Parambariyam)</h3>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">Living Heritage</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Refusal to modify authentic techniques for commercial sporting belt businesses or Western entertainment, preserving the sacred 10-stage syllabus intact.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="w-12 h-12 rounded-xl bg-gold-900/30 border border-gold-700/50 flex items-center justify-center text-gold-400 mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">4. மெய்க்காப்பு (Meikappu)</h3>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">Total Body Mastery</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Harmony of breathing, mental agility, pressure-point awareness (Varma), and lightning-quick staff rotation building lifelong physical resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-charcoal-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            Learn More About Our Living Lineage
          </h3>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
            Discover how the 14th descendant Grandmaster Mariapakkiam brought the art from Madurai to George Town in 1936.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/history-lineage"
              className="px-6 py-3 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm transition-colors"
            >
              Explore History & Lineage →
            </Link>
            <Link
              to="/instructors"
              className="px-6 py-3 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-gold-400 font-semibold text-sm border border-charcoal-700"
            >
              Meet the Masters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
