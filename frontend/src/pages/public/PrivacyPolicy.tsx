import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-crimson-500" />
            <span>Personal Data Protection Notice (PDPA Malaysia)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-400 font-mono">
            Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975)
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Privacy Policy</span>
          </div>
        </div>
      </section>

      {/* Policy Clauses */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-sm text-gray-300 leading-relaxed">
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3">
            <h2 className="text-xl font-display font-bold text-white flex items-center">
              <Shield className="w-5 h-5 text-crimson-500 mr-2" />
              1. Statement of Intent
            </h2>
            <p>
              Persatuan Aadhiran Silambam Pulau Pinang is committed to safeguarding personal data entrusted to us by applicants, students, parents, researchers, and website visitors in compliance with the Personal Data Protection Act 2010 ("PDPA") of Malaysia.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold text-white">
              2. Information We Collect
            </h3>
            <p>
              When you submit a contact enquiry or training application through our website, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Full Name and contact information (Email address, WhatsApp/Mobile telephone number).</li>
              <li>Demographic intake data (Age group, prior martial arts training, preferred training schedule).</li>
              <li>Details of inquiries, feedback, or messages submitted.</li>
              <li>Technical network information (IP address, browser user-agent) strictly for anti-spam prevention and rate limiting.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold text-white">
              3. Purpose of Processing
            </h3>
            <p>
              Your personal data is collected and processed exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Responding to enquiries submitted via our contact forms.</li>
              <li>Evaluating training applications and arranging intake orientations.</li>
              <li>Maintaining official association membership records required by the Registry of Societies (ROS) Malaysia.</li>
              <li>Emergency communications regarding syllabus training schedules or demonstrations.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold text-white">
              4. Security & Storage
            </h3>
            <p>
              We implement industry-standard database encryption, role-based authorization controls, and secure socket layer (HTTPS) protocols. Access to submitted contact information is restricted strictly to authorized association administrators and executive officers. We never sell, lease, or monetize your personal data.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold text-white">
              5. Your Rights
            </h3>
            <p>
              Under the PDPA, you possess the right to request access to and correction of your personal data held by us, or to withdraw consent for further communication. To exercise these rights, please contact our administrative desk at <a href="mailto:info@aadhiran.com" className="text-gold-400 underline">info@aadhiran.com</a>.
            </p>
          </div>

          <div className="pt-6 border-t border-charcoal-800 text-xs text-gray-500">
            Last updated: October 2026 • Persatuan Aadhiran Silambam Pulau Pinang
          </div>
        </div>
      </section>
    </div>
  );
};
