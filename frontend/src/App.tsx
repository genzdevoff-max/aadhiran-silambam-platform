import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { HistoryLineage } from './pages/public/HistoryLineage';
import { TrainingSyllabus } from './pages/public/TrainingSyllabus';
import { Instructors } from './pages/public/Instructors';
import { Achievements } from './pages/public/Achievements';
import { Events } from './pages/public/Events';
import { Gallery } from './pages/public/Gallery';
import { Videos } from './pages/public/Videos';
import { News } from './pages/public/News';
import { NewsDetail } from './pages/public/NewsDetail';
import { HeritageWorks } from './pages/public/HeritageWorks';
import { PartnersPress } from './pages/public/PartnersPress';
import { Contact } from './pages/public/Contact';
import { JoinTraining } from './pages/public/JoinTraining';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { NotFound } from './pages/public/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="history" element={<HistoryLineage />} />
          <Route path="history-lineage" element={<HistoryLineage />} />
          <Route path="training" element={<TrainingSyllabus />} />
          <Route path="training-syllabus" element={<TrainingSyllabus />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="videos" element={<Videos />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsDetail />} />
          <Route path="heritage" element={<HeritageWorks />} />
          <Route path="heritage-works" element={<HeritageWorks />} />
          <Route path="partners" element={<PartnersPress />} />
          <Route path="partners-press" element={<PartnersPress />} />
          <Route path="contact" element={<Contact />} />
          <Route path="join-training" element={<JoinTraining />} />
          <Route path="join" element={<JoinTraining />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
