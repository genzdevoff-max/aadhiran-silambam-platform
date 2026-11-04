import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';

export const PublicLayout: React.FC = () => {
  return (
    <div className="public-site min-h-screen flex flex-col bg-[#FDFBF7] text-[#182332] antialiased selection:bg-[#C6A04A] selection:text-[#102137] relative font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#102137] text-white font-medium rounded-lg shadow-lg border border-[#C6A04A]"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};
