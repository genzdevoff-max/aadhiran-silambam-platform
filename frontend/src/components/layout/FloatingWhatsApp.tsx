import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { generalInfo } from '../../data/siteContent';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  className?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '97433690769',
  className = '',
}) => {
  // Click-to-chat URL: https://wa.me/<number> without plus signs or spaces
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = generalInfo.socials?.whatsapp || `https://wa.me/${cleanNumber}`;

  return (
    <aside
      aria-label="WhatsApp quick contact"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Aadhiran Silambam on WhatsApp"
        title="Contact Aadhiran Silambam on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white border-2 border-white shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.65)] ring-1 ring-[#25D366]/40 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
      >
        {/* White WhatsApp Symbol inside */}
        <FaWhatsapp
          className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        />

        {/* Desktop Hover Tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0B1B3D] border border-[#142C66] text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span>Chat on WhatsApp</span>
          <span
            className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#0B1B3D] border-r border-t border-[#142C66] rotate-45"
            aria-hidden="true"
          />
        </span>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
