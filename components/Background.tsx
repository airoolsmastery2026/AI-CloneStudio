import React from 'react';
import { useStudio } from '../context/StudioContext';

const Background: React.FC = () => {
  const { settings } = useStudio();
  const theme = settings.uiTheme;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000">
      {/* Dynamic Base Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        theme === 'matte' ? 'bg-[#111111]' :
        theme === 'metallic' ? 'bg-[#0f172a]' :
        'bg-[#050505]' // multipolar default
      }`} />
      
      {/* Dynamic Orbs/Gradients */}
      {theme === 'multipolar' && (
        <>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
        </>
      )}

      {theme === 'metallic' && (
        <>
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-slate-500/10 blur-[100px] rounded-full"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </>
      )}

      {theme === 'matte' && (
        <>
           <div className="absolute inset-0 bg-white/[0.02]"></div>
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
        </>
      )}
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.4]" 
        style={{ 
          backgroundImage: `linear-gradient(${theme === 'matte' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'matte' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px)`, 
          backgroundSize: '50px 50px' 
        }}
      ></div>
    </div>
  );
};

export default Background;