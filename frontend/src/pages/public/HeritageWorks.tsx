import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ExternalLink,
  FileText,
  ArrowRight
} from 'lucide-react';
import { heritageProjectsList } from '../../data';
import { publicApi } from '../../services/api';
import type { HeritageProject } from '../../types';

export const HeritageWorks: React.FC = () => {
  const [projects, setProjects] = useState<HeritageProject[]>(heritageProjectsList);

  useEffect(() => {
    publicApi
      .getHeritage()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.warn('Using static heritage projects fallback:', err?.message || err);
      });
  }, []);

  return (
    <div className="bg-[#FDFBF7] text-[#182332] min-h-screen">
      {/* Header Banner - Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#C6A04A]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Living Heritage Projects</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Heritage Projects & Our Works
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#D9B96E] tracking-wide">
            பாரம்பரிய ஆவணப்பணிகள் • Safeguarding Living Intangible Culture
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Heritage Projects</span>
          </div>
        </div>
      </section>

      {/* Main Works Grid */}
      <section className="py-20 border-b border-[#E8E3D9] bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all shadow-xs hover:shadow-md ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#E8E3D9] h-72 bg-slate-100">
                <img
                  src={project.cover_image_url || '/api/public/media/stream/silambam/screenshot-2019-06-09-at-5-17-22-am_orig.png'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#102137]/90 backdrop-blur-sm border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-bold shadow-xs">
                  {project.year}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#C6A04A] uppercase tracking-wider">
                    {project.organization}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#182332]">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {project.overview}
                </p>

                <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                  <span className="text-xs font-semibold text-[#102137] uppercase tracking-wider block mb-1">
                    Cultural Significance & Impact:
                  </span>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {project.cultural_significance}
                  </p>
                </div>

                {project.document_url && (
                  <div className="pt-2">
                    <a
                      href={project.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#183B5B] transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-1.5 shrink-0 text-[#C6A04A]" />
                      <span>View Official Publication / Document</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0 text-[#C6A04A]" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community NGO Collaborations */}
      <section className="py-20 bg-[#102137] border-t border-[#C6A04A]/30 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Collaborations with Cultural Organizations & NGOs
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-8 font-normal">
            Persatuan Aadhiran Silambam Pulau Pinang regularly partners with George Town World Heritage Incorporated (GTWHI), Penang Heritage Trust, Think City, local schools, and university researchers to document and safeguard the living heritage of ancient Tamil martial disciplines in Malaysia.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-semibold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <span>Propose a Heritage Collaboration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
