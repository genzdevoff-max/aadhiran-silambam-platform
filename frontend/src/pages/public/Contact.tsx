import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Info,
  ExternalLink
} from 'lucide-react';
import { generalInfo } from '../../data';
import { publicApi } from '../../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [validatedData, setValidatedData] = useState<{
    submitted: boolean;
    name: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      newErrors.phone = 'Please provide a valid contact or WhatsApp phone number.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatedData?.submitted || submitting) return;

    // Honeypot bot protection
    if (formData.honeypot) {
      setValidatedData({ submitted: true, name: formData.fullName.trim() });
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
      const res = await publicApi.submitContact({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: `[Subject: ${formData.subject}]\n\n${formData.message.trim()}`,
      });
      setValidatedData({
        submitted: true,
        name: formData.fullName.trim(),
      });
      setSubmitSuccessMessage(res.message || 'Thank you! Your enquiry has been received. Our association officers will contact you shortly.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to transmit enquiry right now. Please check your network or reach out via WhatsApp/email directly.';
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
      subject: 'General Enquiry',
      message: '',
      honeypot: '',
    });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccessMessage(null);
    setValidatedData(null);
  };

  return (
    <div className="bg-[#FDFBF7] text-[#182332] min-h-screen">
      {/* Header Banner - Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#C6A04A]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Mail className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Connect with Association Officers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Contact Aadhiran Silambam
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#D9B96E] tracking-wide">
            தொடர்பு கொள்ள • George Town Heritage Headquarters
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Contact</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Details & Validated Form */}
      <section className="py-20 border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details & Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs uppercase font-bold text-[#102137] tracking-widest block mb-2">
                  Headquarters & Dojo
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#182332] mb-4">
                  Visit Persatuan Aadhiran Silambam
                </h2>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Located in the historic heart of George Town, Penang. We welcome heritage visitors, researchers, prospective students, and cultural collaboration inquiries.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
                    <MapPin className="w-5 h-5 shrink-0 text-[#C6A04A]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#182332]">Location</h4>
                    <p className="text-xs text-[#64748B] mt-1">{generalInfo.address}, {generalInfo.postcode} {generalInfo.state}, {generalInfo.country}</p>
                    <span className="text-[11px] text-[#102137] font-semibold mt-1 block">UNESCO World Heritage Zone</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
                    <Phone className="w-5 h-5 shrink-0 text-[#C6A04A]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#182332]">Phone & WhatsApp</h4>
                    <p className="text-xs text-[#182332] font-semibold mt-1">
                      <a href={`tel:${generalInfo.phone}`} className="hover:text-[#183B5B] transition-colors">
                        {generalInfo.phone}
                      </a>
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Primary Association Line (Daily 9:00 AM - 7:00 PM)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
                    <Mail className="w-5 h-5 shrink-0 text-[#C6A04A]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#182332]">Email Address</h4>
                    <p className="text-xs text-[#182332] font-semibold mt-1">
                      <a href={`mailto:${generalInfo.email}`} className="hover:text-[#183B5B] transition-colors">
                        {generalInfo.email}
                      </a>
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Enquiries & Official Media Communications</p>
                  </div>
                </div>
              </div>

              {/* Training Hours Spotlight */}
              <div className="p-6 rounded-2xl bg-[#102137] text-white border border-[#C6A04A]/30 space-y-4 shadow-md">
                <h4 className="font-bold text-sm flex items-center text-[#D9B96E]">
                  <Clock className="w-4 h-4 mr-2 shrink-0 text-[#C6A04A]" />
                  Traditional Training Schedule
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span>Tuesday & Thursday (Youth & Beginners)</span>
                    <span className="text-[#D9B96E] font-medium">6:30 PM – 8:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span>Saturday (Intermediate Syllabus)</span>
                    <span className="text-[#D9B96E] font-medium">5:00 PM – 7:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Sunday (Senior Masters & Weapons)</span>
                    <span className="text-[#D9B96E] font-medium">8:30 AM – 11:30 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E3D9] shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#102137] shrink-0">
                    <MessageSquare className="w-5 h-5 shrink-0 text-[#C6A04A]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#182332]">
                      Send an Official Message
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Submit questions regarding membership, heritage demonstrations, or media.
                    </p>
                  </div>
                </div>

                {/* Notice Badge */}
                <div className="mb-6 p-4 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs flex items-start space-x-3">
                  <Info className="w-5 h-5 shrink-0 text-[#C6A04A] mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[#102137]">Direct Line to Association Officers</p>
                    <p className="text-[#64748B] text-[11px] leading-relaxed">
                      Your enquiry is transmitted securely to our administrative desk. A confirmation email and officer notification will be dispatched immediately.
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                {validatedData?.submitted ? (
                  <div className="p-8 rounded-2xl bg-[#F8F5EE] border border-[#E8E3D9] space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shrink-0 shadow-xs">
                      <CheckCircle2 className="w-6 h-6 shrink-0" />
                    </div>
                    <h4 className="text-lg font-bold text-[#102137]">
                      Enquiry Transmitted Successfully
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
                      Thank you, <strong className="text-[#102137]">{validatedData.name}</strong>. {submitSuccessMessage || 'Your message has been registered. Our association officers will contact you shortly via phone or email.'}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-xs font-semibold text-white transition-all shadow-sm"
                      >
                        Submit Another Query
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Honeypot field (hidden from humans) */}
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                        >
                          Your Full Name <span className="text-[#C6A04A]">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar"
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
                          htmlFor="email"
                          className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                        >
                          Email Address <span className="text-[#C6A04A]">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. ramesh@example.com"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                        >
                          Phone / WhatsApp <span className="text-[#C6A04A]">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +60 12-345 6789"
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
                          htmlFor="subject"
                          className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                        >
                          Enquiry Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] transition-colors"
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Training & Classes">Training & Classes Enquiry</option>
                          <option value="Media & Press">Press / Media Interview</option>
                          <option value="Heritage & Research">UNESCO / Academic Research</option>
                          <option value="Demonstration Booking">Cultural Martial Demo</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-[#182332] uppercase tracking-wider mb-2"
                      >
                        Detailed Message <span className="text-[#C6A04A]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your enquiry, purpose, or questions..."
                        className={`w-full px-4 py-3 rounded-xl bg-[#F8F5EE] border text-[#182332] placeholder-[#64748B] text-xs focus:outline-none transition-colors ${
                          errors.message
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[#E8E3D9] focus:border-[#C6A04A]'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-[11px] text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md border border-[#C6A04A]/40 flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4 shrink-0 text-[#C6A04A]" />
                      <span>{submitting ? 'Transmitting Enquiry...' : 'Send Official Enquiry'}</span>
                    </button>

                    <p className="text-[11px] text-[#64748B] text-center">
                      Protected under the Malaysian Personal Data Protection Act (PDPA 2010).
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Directions Strip */}
      <section className="py-12 bg-white border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="font-bold text-[#182332] text-lg">Visit the Association</h2>
            <p className="text-sm text-[#64748B] mt-1">
              {generalInfo.address}, {generalInfo.postcode} {generalInfo.city}, {generalInfo.state}, {generalInfo.country}
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Lebuh%20King%2C%20George%20Town%2C%20Penang%2C%20Malaysia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#102137] hover:bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-sm font-semibold transition-colors shadow-sm"
          >
            <span>Open map & directions</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </section>
    </div>
  );
};
