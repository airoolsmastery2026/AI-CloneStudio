
import React from 'react';
import { Language } from '../types';
import { ArrowRight, Flame, Upload, Link, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';

interface OnboardingProps {
  lang: Language;
}

const Onboarding: React.FC<OnboardingProps> = ({ lang }) => {
  const navigate = useNavigate();
  const t = translations[lang].onboarding;

  const workflows = [
    { 
      id: 'viral',
      icon: Flame, 
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      path: '/viral',
      title: t.workflow_viral_title, 
      desc: t.workflow_viral_desc 
    },
    { 
      id: 'url',
      icon: Link, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      path: '/create',
      title: t.workflow_url_title, 
      desc: t.workflow_url_desc 
    },
    { 
      id: 'upload',
      icon: Upload, 
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      path: '/create',
      title: t.workflow_upload_title, 
      desc: t.workflow_upload_desc 
    },
    { 
      id: 'dashboard',
      icon: Zap, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      path: '/dashboard',
      title: t.workflow_dash_title, 
      desc: t.workflow_dash_desc 
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-500">
      <div className="mb-12 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-studio-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {workflows.map((flow) => (
          <button 
            key={flow.id}
            onClick={() => navigate(flow.path)}
            className="group relative glass-panel p-8 rounded-3xl text-left transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-studio-accent/50 border border-transparent"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${flow.bg} ${flow.color} shadow-lg shadow-black/20`}>
                <flow.icon size={32} />
              </div>
              <div className="bg-white/5 rounded-full p-2 text-gray-500 group-hover:text-white group-hover:bg-studio-accent transition-all transform group-hover:rotate-[-45deg]">
                <ArrowRight size={20} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-studio-accent transition-colors">
              {flow.title}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {flow.desc}
            </p>
          </button>
        ))}
      </div>

      <footer className="mt-16 text-sm text-gray-500 flex flex-wrap justify-center items-center gap-6">
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {t.footer_veo}</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {t.footer_sora}</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {t.footer_grok}</span>
      </footer>
    </div>
  );
};

export default Onboarding;
