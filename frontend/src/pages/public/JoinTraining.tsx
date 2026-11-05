import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Send,
  Info,
  ShieldCheck
} from 'lucide-react';
import { publicApi } from '../../services/api';

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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatedData?.submitted || submitting) return;

    if (formData.honeypot) {
      setValidatedData({
        submitted: true,
        name: formData.fullName.trim(),
        ageGroup: formData.ageGroup,
      });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await publicApi.submitJoin({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        ageGroup: formData.ageGroup,
        experienceLevel: formData.experienceLevel,
        preferredLocation: formData.preferredLocation,
        message: formData.message.trim(),
      });
      setValidatedData({
        submitted: true,
        name: formData.fullName.trim(),
        ageGroup: formData.ageGroup,
      });
      setSubmitSuccessMessage(res.message || 'Admission application received! Our chief instructor will reach out regarding batch timing and venue location.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to submit application right now. Please check your connection or contact our headquarters directly.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
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
    setSubmitError(null);
    setSubmitSuccessMessage(null);
    setValidatedData(null);
  };

  return (
    <div className="bg-[#F8FAFC] text-[#182332] min-h-screen">
      {/* Header Banner - Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#183B5B]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Academy Athlete Enrolment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
            Join Training Academy
          </h1>
          <p className="mt-3 text-lg font-display text-[#D9B96E] font-semibold tracking-wide">
            பயிற்சியில் சேர விண்ணப்பிக்க • Authentic Instruction in George Town, Penang
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Enrolment</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-md space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#102137] uppercase">
                Student Enrolment Application
              </h2>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Fill in your candidate details. Intake is open to all backgrounds with serious commitment to traditional discipline and cultural heritage.
              </p>
            </div>

            {/* Live Form Notice Badge */}
            <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs flex items-start space-x-3">
              <Info className="w-5 h-5 shrink-0 text-[#C6A04A] mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[#102137]">Direct Intake Portal • George Town Headquarters</p>
                <p className="text-[#64748B] text-[11px] leading-relaxed">
                  Your admission request is routed directly to the Chief Instructor's desk. An email confirmation and intake coordinator phone reach-out will follow within 24–48 hours.
                </p>
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {validatedData?.submitted ? (
              <div className="p-8 rounded-2xl bg-[#F8F5EE] border border-[#E8E3D9] space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                </div>
                <h4 className="text-xl font-bold text-[#102137]">
                  Admission Application Registered
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
                  Thank you, <strong className="text-[#102137]">{validatedData.name}</strong> ({validatedData.ageGroup}). {submitSuccessMessage || 'Your candidate profile has been registered into the association roster. Our Chief Instructor will contact you regarding class schedules, venue directions, and the traditional induction orientation.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-xs font-semibold text-white transition-all shadow-sm"
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
                      className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                    >
                      Applicant Full Name <span className="text-[#C6A04A]">*</span>
                    </label>
                    <input
                      id="joinFullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full legal name"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border text-[#182332] placeholder-[#64748B] text-xs focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#E8E3D9] focus:border-[#C6A04A]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-[11px] text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="joinEmail"
                      className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                    >
                      Email Address <span className="text-[#C6A04A]">*</span>
                    </label>
                    <input
                      id="joinEmail"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border text-[#182332] placeholder-[#64748B] text-xs focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#E8E3D9] focus:border-[#C6A04A]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="joinPhone"
                      className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                    >
                      Phone / WhatsApp <span className="text-[#C6A04A]">*</span>
                    </label>
                    <input
                      id="joinPhone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+60 1x-xxx xxxx"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border text-[#182332] placeholder-[#64748B] text-xs focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#E8E3D9] focus:border-[#C6A04A]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-[11px] text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="joinAgeGroup"
                      className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                    >
                      Age Group
                    </label>
                    <select
                      id="joinAgeGroup"
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] transition-colors"
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
                      className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                    >
                      Martial Experience
                    </label>
                    <select
                      id="joinExperience"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] transition-colors"
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
                    className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                  >
                    Training Center
                  </label>
                  <input
                    id="joinLocation"
                    type="text"
                    name="preferredLocation"
                    readOnly
                    value="George Town Headquarters — Lebuh King, Penang"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] font-semibold text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="joinMessage"
                    className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#C6A04A] transition-colors"
                  />
                </div>

                {/* Code of Conduct Acknowledgment */}
                <div className={`p-4 rounded-xl bg-[#F8F5EE] border transition-colors ${
                  errors.agreeToCode ? 'border-red-400' : 'border-[#E8E3D9]'
                }`}>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToCode"
                      checked={formData.agreeToCode}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-[#E8E3D9] text-[#102137] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-[#182332] leading-relaxed">
                      I acknowledge that Aadhiran Silambam is a traditional 5,000-year Tamil discipline. I agree to respect the Gurukulam lineage, observe ethical restraint, and understand that Aadhiran does not engage in commercial belt-selling. <span className="text-[#C6A04A] font-bold">*</span>
                    </span>
                  </label>
                  {errors.agreeToCode && (
                    <p className="mt-2 text-[11px] text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {errors.agreeToCode}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                  <ShieldCheck className="w-4 h-4 text-[#C6A04A] shrink-0" />
                  <span>Transparent fee structure with zero hidden gradings or commercial contracts.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md border border-[#C6A04A]/40 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 shrink-0 text-[#C6A04A]" />
                  <span>{submitting ? 'Submitting Application...' : 'Submit Admission Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
