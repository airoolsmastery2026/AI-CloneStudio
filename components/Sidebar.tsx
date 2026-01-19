
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusSquare, Flame, BarChart2, Layers, Bell, Video, User, Settings, LogOut, Globe } from 'lucide-react';
import { Language } from '../types';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface SidebarProps {
  lang: Language;
  setLang: (l: Language) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, setLang, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user } = useStudio();
  const t = translations[lang].sidebar;
  
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t.dashboard },
    { to: '/create', icon: PlusSquare, label: t.create },
    { to: '/viral', icon: Flame, label: t.viral },
    { to: '/analysis', icon: BarChart2, label: t.analysis },
    { to: '/mass-production', icon: Layers, label: t.mass },
    { to: '/library', icon: Video, label: t.library },
    { to: '/notifications', icon: Bell, label: t.notifications },
    { to: '/profile', icon: User, label: t.profile },
    { to: '/settings', icon: Settings, label: t.settings },
  ];

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-white/10 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative backdrop-blur-xl bg-black/40`;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-studio-accent to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-display font-bold text-white text-xl">AI</span>
            </div>
            <div>
               <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">CloneStudio</h1>
               <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{t.version}</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white transition-colors">✕</button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto hide-scrollbar pr-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive ? 'bg-studio-accent text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                  <item.icon size={20} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors duration-300`} />
                  <span className="font-medium text-sm tracking-wide">{item.label}</span>
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-2 mb-2">
             <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="User" />
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-studio-accent truncate">{user.plan}</p>
             </div>
          </div>

          <button 
            onClick={() => setLang(lang === 'EN' ? 'VN' : 'EN')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-2">
               <Globe size={16} className="text-gray-500 group-hover:text-studio-accent transition-colors" />
               <span className="text-xs text-gray-300 font-medium">{t.language}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${lang === 'EN' ? 'bg-studio-accent text-white shadow' : 'text-gray-50'}`}>EN</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${lang === 'VN' ? 'bg-studio-accent text-white shadow' : 'text-gray-500'}`}>VN</span>
            </div>
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-red-400 transition-colors w-full hover:bg-red-500/10 rounded-lg">
            <LogOut size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{t.logout}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
