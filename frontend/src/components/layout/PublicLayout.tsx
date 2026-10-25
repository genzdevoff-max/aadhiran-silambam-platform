import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="public-site min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B] antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
