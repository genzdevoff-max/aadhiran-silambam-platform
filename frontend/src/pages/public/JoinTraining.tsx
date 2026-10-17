import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Send,
  Info,
} from 'lucide-react';

export const JoinTraining: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ageGroup: 'Youth (13–17 Years)',
    experienceLevel: 'Complete Beginner',
    preferredLocation: 'George Town Headquarters (Lebuh King)',
    message: '',
    agreeToCode: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validatedData, setValidatedData] = useState<{
    submitted: boolean;
    name: string;
    ageGroup: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full legal name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      newErrors.phone = 'Please provide a valid contact or WhatsApp phone number.';
    }
    if (!formData.agreeToCode) {
      newErrors.agreeToCode = 'You must acknowledge and agree to the Gurukulam Code of Conduct.';
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatedData?.submitted) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setValidatedData({
      submitted: true,
      name: formData.fullName.trim(),
      ageGroup: formData.ageGroup,
    });
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      ageGroup: 'Youth (13–17 Years)',
      experienceLevel: 'Complete Beginner',
      preferredLocation: 'George Town Headquarters (Lebuh King)',
      message: '',
      agreeToCode: false,
      honeypot: '',
    });
    setErrors({});
    setValidatedData(null);
  };

  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5 text-crimson-500" />
            <span>Traditional Gurukulam Enrolment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Join Aadhiran Silambam Training
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            பயிற்சியில் சேர விண்ணப்பிக்க • Authentic Instruction in George Town, Penang
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Join Training</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-2xl space-y-8">
            <div className="border-b border-charcoal-800 pb-6">
              <h2 className="text-2xl font-display font-bold text-white">
                Student Enrolment Application
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Fill in your candidate details. Intake is open to all backgrounds with serious commitment to traditional discipline.
              </p>
            </div>

            {/* Phase Notice Badge */}
            <div className="p-4 rounded-xl bg-gold-950/40 border border-gold-700/50 text-gold-300 text-xs flex items-start space-x-3">
              <Info className="w-5 h-5 flex-shrink-0 text-gold-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-gold-300">This form is not connected yet</p>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Your entries are checked in this browser only. Nothing is sent or saved. To enquire about training, contact the association directly at +60 16-414 7856.
                </p>
              </div>
            </div>

            {validatedData?.submitted ? (
              <div className="p-6 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-display font-bold text-white">
                  Enrolment Form Validated
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                  The application fields for <strong className="text-gold-400">{validatedData.name}</strong> ({validatedData.ageGroup}) passed browser validation. Nothing was sent or saved. Please call +60 16-414 7856 to enquire about training.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs text-gray-300 transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="joinFullName"
                      className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Applicant Full Name <span className="text-crimson-500">*</span>
                    </label>
                    <input
                      id="joinFullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full legal name"
                      className={`w-full px-4 py-3 rounded-xl bg-charcoal-950 border text-white placeholder-gray-500 text-xs focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-crimson-500 focus:border-crimson-400'
                          : 'border-charcoal-700 focus:border-gold-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-[11px] text-crimson-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="joinEmail"
                      className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Email Address <span className="text-crimson-500">*</span>
                    </label>
                    <input
                      id="joinEmail"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-charcoal-950 border text-white placeholder-gray-500 text-xs focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-crimson-500 focus:border-crimson-400'
                          : 'border-charcoal-700 focus:border-gold-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-crimson-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="joinPhone"
                      className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Phone / WhatsApp <span className="text-crimson-500">*</span>
                    </label>
                    <input
                      id="joinPhone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+60 1x-xxx xxxx"
                      className={`w-full px-4 py-3 rounded-xl bg-charcoal-950 border text-white placeholder-gray-500 text-xs focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-crimson-500 focus:border-crimson-400'
                          : 'border-charcoal-700 focus:border-gold-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-[11px] text-crimson-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="joinAgeGroup"
                      className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Age Group
                    </label>
                    <select
                      id="joinAgeGroup"
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 transition-colors"
                    >
                      <option value="Children (6–12 Years)">Children (6–12 Years)</option>
                      <option value="Youth (13–17 Years)">Youth (13–17 Years)</option>
                      <option value="Adults (18–35 Years)">Adults (18–35 Years)</option>
                      <option value="Senior / Masters (36+ Years)">Senior / Masters (36+ Years)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="joinExperience"
                      className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Martial Experience
                    </label>
                    <select
                      id="joinExperience"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 transition-colors"
                    >
                      <option value="Complete Beginner">Complete Beginner</option>
                      <option value="Some Martial Arts">Some Martial Arts Experience</option>
                      <option value="Intermediate Silambam">Intermediate Silambam</option>
                      <option value="Advanced / Instructor">Advanced / Instructor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="joinLocation"
                    className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                  >
                    Training Center
                  </label>
                  <input
                    id="joinLocation"
                    type="text"
                    name="preferredLocation"
                    readOnly
                    value="George Town Headquarters — Lebuh King, Penang"
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-950/60 border border-charcoal-800 text-gold-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="joinMessage"
                    className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                  >
                    Motivations & Background
                  </label>
                  <textarea
                    id="joinMessage"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what draws you to Aadhiran Silambam (e.g. cultural preservation, self defense, fitness)..."
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* Code of Conduct Acknowledgment */}
                <div className={`p-4 rounded-xl bg-charcoal-950 border transition-colors ${
                  errors.agreeToCode ? 'border-crimson-500' : 'border-charcoal-800'
                }`}>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToCode"
                      checked={formData.agreeToCode}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-charcoal-700 bg-charcoal-900 text-crimson-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-300 leading-relaxed">
                      I acknowledge that Aadhiran Silambam is a traditional 5,000-year Tamil discipline. I agree to respect the Gurukulam lineage, observe ethical restraint, and understand that Aadhiran does not engage in commercial belt-selling. <span className="text-crimson-500">*</span>
                    </span>
                  </label>
                  {errors.agreeToCode && (
                    <p className="mt-2 text-[11px] text-crimson-400 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.agreeToCode}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-crimson-900/60 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Validate Application (Not Sent)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
