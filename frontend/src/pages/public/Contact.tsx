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
} from 'lucide-react';
import { generalInfo } from '../../data';

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
    });
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
    setValidatedData(null);
  };

  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 text-crimson-500" />
            <span>Connect with Association Officers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Contact Aadhiran Silambam
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            தொடர்பு கொள்ள • George Town Heritage Headquarters
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Contact</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Details & Validated Form */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details & Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs uppercase font-bold text-crimson-500 tracking-widest block mb-2">
                  Headquarters & Dojo
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                  Visit Persatuan Aadhiran Silambam
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Located in the historic heart of George Town, Penang. We welcome heritage visitors, researchers, prospective students, and cultural collaboration inquiries.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
                  <div className="w-10 h-10 rounded-xl bg-crimson-900/40 border border-crimson-700/60 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Location</h4>
                    <p className="text-xs text-gray-300 mt-1">{generalInfo.address}, {generalInfo.postcode} {generalInfo.state}, {generalInfo.country}</p>
                    <span className="text-[11px] text-gold-400 font-mono mt-1 block">UNESCO World Heritage Zone</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
                  <div className="w-10 h-10 rounded-xl bg-gold-900/40 border border-gold-700/60 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Phone & WhatsApp</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      <a href={`tel:${generalInfo.phone}`} className="hover:text-gold-400 transition-colors">
                        {generalInfo.phone}
                      </a>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Primary Association Line (Daily 9:00 AM - 7:00 PM)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
                  <div className="w-10 h-10 rounded-xl bg-crimson-900/40 border border-crimson-700/60 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Email Address</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      <a href={`mailto:${generalInfo.email}`} className="hover:text-gold-400 transition-colors">
                        {generalInfo.email}
                      </a>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Enquiries & Official Media Communications</p>
                  </div>
                </div>
              </div>

              {/* Training Hours */}
              <div className="p-6 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 space-y-3">
                <h4 className="text-white font-display font-bold text-sm flex items-center">
                  <Clock className="w-4 h-4 text-gold-400 mr-2" />
                  Traditional Training Schedule
                </h4>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex justify-between py-1 border-b border-charcoal-800">
                    <span>Tuesday & Thursday (Youth & Beginners)</span>
                    <span className="text-white font-mono">6:30 PM – 8:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-charcoal-800">
                    <span>Saturday (Intermediate Syllabus)</span>
                    <span className="text-white font-mono">5:00 PM – 7:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Sunday (Senior Masters & Weapons)</span>
                    <span className="text-white font-mono">8:30 AM – 11:30 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-crimson-600/30 border border-crimson-500/50 flex items-center justify-center text-gold-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      Send an Official Message
                    </h3>
                    <p className="text-xs text-gray-400">
                      Submit questions regarding membership, heritage demonstrations, or media.
                    </p>
                  </div>
                </div>

                {/* Phase Notice Badge */}
                <div className="mb-6 p-4 rounded-xl bg-gold-950/40 border border-gold-700/50 text-gold-300 text-xs flex items-start space-x-3">
                  <Info className="w-5 h-5 flex-shrink-0 text-gold-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-gold-300">This form is not connected yet</p>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Your entries are checked in this browser only. Nothing is sent or saved. To contact the association, use the phone, WhatsApp, or email details on this page.
                    </p>
                  </div>
                </div>

                {validatedData?.submitted ? (
                  <div className="p-6 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-white">
                      Enquiry Form Validated
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                      The fields for <strong className="text-gold-400">{validatedData.name}</strong> passed browser validation. Nothing was sent or saved. Please contact the association directly by phone, WhatsApp, or email.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs text-gray-300 transition-colors"
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
                          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                        >
                          Your Full Name <span className="text-crimson-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar"
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
                          htmlFor="email"
                          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                        >
                          Email Address <span className="text-crimson-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. ramesh@example.com"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                        >
                          Phone / WhatsApp <span className="text-crimson-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +60 12-345 6789"
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
                          htmlFor="subject"
                          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                        >
                          Enquiry Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 transition-colors"
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
                        className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
                      >
                        Detailed Message <span className="text-crimson-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your enquiry, purpose, or questions..."
                        className={`w-full px-4 py-3 rounded-xl bg-charcoal-950 border text-white placeholder-gray-500 text-xs focus:outline-none transition-colors ${
                          errors.message
                            ? 'border-crimson-500 focus:border-crimson-400'
                            : 'border-charcoal-700 focus:border-gold-500'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-[11px] text-crimson-400 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-crimson-900/50 flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Validate Message (Not Sent)</span>
                    </button>

                    <p className="text-[11px] text-gray-500 text-center">
                      Protected under the Malaysian Personal Data Protection Act (PDPA 2010).
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-charcoal-900 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="font-display font-bold text-white">Visit the Association</h2>
            <p className="text-sm text-gray-400 mt-1">
              {generalInfo.address}, {generalInfo.postcode} {generalInfo.city}, {generalInfo.state}, {generalInfo.country}
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Lebuh%20King%2C%20George%20Town%2C%20Penang%2C%20Malaysia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-charcoal-950 border border-charcoal-700 text-gold-400 hover:text-gold-300 hover:border-gold-500/50 text-sm font-semibold transition-colors"
          >
            Open map & directions
          </a>
        </div>
      </section>
    </div>
  );
};
