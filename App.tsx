import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Background from './components/Background';
import VideoPlayerModal from './components/VideoPlayerModal';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ViralTrends from './pages/ViralTrends';
import Analysis from './pages/Analysis';
import MassProduction from './pages/MassProduction';
import Notifications from './pages/Notifications';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { Language } from './types';
import { Menu } from 'lucide-react';
import { StudioProvider } from './context/StudioContext';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <StudioProvider>
      <VideoPlayerModal />
      <Router>
        <div className="flex min-h-screen font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
          <Background />
          
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md p-4 flex md:hidden items-center justify-between border-b border-white/10">
             <span className="font-bold text-lg">CloneStudio</span>
             <button onClick={() => setIsMobileMenuOpen(true)}>
               <Menu className="text-white" />
             </button>
          </div>

          <Sidebar 
            lang={lang} 
            setLang={setLang} 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />
          
          <main className="flex-1 overflow-x-hidden pt-20 md:pt-0 p-4 md:p-8 lg:p-12 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<Onboarding lang={lang} />} />
              <Route path="/dashboard" element={<Dashboard lang={lang} />} />
              <Route path="/create" element={<CreateProject lang={lang} />} />
              <Route path="/viral" element={<ViralTrends lang={lang} />} />
              <Route path="/analysis" element={<Analysis lang={lang} />} /> 
              <Route path="/analysis/:projectId" element={<Analysis lang={lang} />} />
              <Route path="/mass-production" element={<MassProduction lang={lang} />} />
              <Route path="/notifications" element={<Notifications lang={lang} />} />
              <Route path="/library" element={<Library lang={lang} />} />
              <Route path="/profile" element={<Profile lang={lang} />} />
              <Route path="/settings" element={<Settings lang={lang} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StudioProvider>
  );
};

export default App;