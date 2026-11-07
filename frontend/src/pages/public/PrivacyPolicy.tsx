import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { ScrollReveal } from '../../components/common/ScrollReveal';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] text-[#182332] min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#183B5B]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fade-down" delay={0} duration={600}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Lock className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
              <span>Personal Data Protection Notice (PDPA Malaysia)</span>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={80} duration={650}>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              Privacy Policy
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={160} duration={650}>
            <p className="mt-3 text-sm text-slate-300 font-mono">
              Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975)
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={240} duration={650}>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
              <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#D9B96E]">Privacy Policy</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Policy Clauses */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-sm text-[#64748B] leading-relaxed">
          <ScrollReveal animation="fade-up" delay={0} duration={650}>
            <div className="p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
              <h2 className="text-xl font-bold text-[#102137] flex items-center">
                <Shield className="w-5 h-5 text-[#C6A04A] mr-2 shrink-0" />
                1. Statement of Intent
              </h2>
              <p className="text-[#182332]">
                Persatuan Aadhiran Silambam Pulau Pinang is committed to safeguarding personal data entrusted to us by applicants, students, parents, researchers, and website visitors in compliance with the Personal Data Protection Act 2010 ("PDPA") of Malaysia.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80} duration={650}>
            <div className="p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-[#102137]">
                2. Information We Collect
              </h3>
              <p>
                When you submit a contact enquiry or training application through our website, we may collect:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#182332]">
                <li>Full Name and contact information (Email address, WhatsApp/Mobile telephone number).</li>
                <li>Demographic intake data (Age group, prior martial arts training, preferred training schedule).</li>
                <li>Details of inquiries, feedback, or messages submitted.</li>
                <li>Technical network information (IP address, browser user-agent) strictly for anti-spam prevention and rate limiting.</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={160} duration={650}>
            <div className="p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-[#102137]">
                3. Purpose of Processing
              </h3>
              <p>
                Your personal data is collected and processed exclusively for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#182332]">
                <li>Responding to enquiries submitted via our contact forms.</li>
                <li>Evaluating training applications and arranging intake orientations.</li>
                <li>Maintaining official association membership records required by the Registry of Societies (ROS) Malaysia.</li>
                <li>Emergency communications regarding syllabus training schedules or demonstrations.</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={240} duration={650}>
            <div className="p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-[#102137]">
                4. Security & Storage
              </h3>
              <p className="text-[#182332]">
                We implement industry-standard database encryption, role-based authorization controls, and secure socket layer (HTTPS) protocols. Access to submitted contact information is restricted strictly to authorized association administrators and executive officers. We never sell, lease, or monetize your personal data.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={320} duration={650}>
            <div className="p-8 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-[#102137]">
                5. Your Rights
              </h3>
              <p>
                Under the PDPA, you possess the right to request access to and correction of your personal data held by us, or to withdraw consent for further communication. To exercise these rights, please contact our administrative desk at <a href="mailto:info@aadhiran.com" className="text-[#102137] font-semibold underline hover:text-[#183B5B]">info@aadhiran.com</a>.
              </p>
            </div>
          </ScrollReveal>

          <div className="pt-6 border-t border-[#E8E3D9] text-xs text-[#64748B]">
            Last updated: October 2026 • Persatuan Aadhiran Silambam Pulau Pinang
          </div>
        </div>
      </section>
    </div>
  );
};
