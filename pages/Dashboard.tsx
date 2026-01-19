
import React from 'react';
import { Language, ProjectStatus } from '../types';
import { Play, Zap, Layers, ArrowRight, Database, CheckCircle2, Loader2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface DashboardProps {
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const navigate = useNavigate();
  const { projects, userCredits, playVideo } = useStudio();
  const t = translations[lang].dashboard;
  const ts = translations[lang].status;

  const queuedProjects = projects.filter(p => p.status === ProjectStatus.QUEUED);
  const activeProjects = projects.filter(p => [ProjectStatus.ANALYZING, ProjectStatus.WRITING, ProjectStatus.PROMPTING, ProjectStatus.GENERATING].includes(p.status));
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);

  const stats = [
    { label: t.stat_processing, value: activeProjects.length.toString(), icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: t.stat_credits, value: userCredits.toLocaleString(), icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: t.stat_ready, value: completedProjects.length.toString(), icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">{t.title}</h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {t.status_active}
          </p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate('/mass-production')} className="flex items-center gap-2 bg-studio-800 hover:bg-studio-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/10 text-sm">
             <Layers size={16} /> {t.mass_prod}
           </button>
           <button onClick={() => navigate('/create')} className="flex items-center gap-2 bg-studio-accent hover:bg-studio-accentHover text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 text-sm">
             <Zap size={16} /> {t.quick_create}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group hover:border-studio-accent/30 transition-colors">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-lg`}>
              <stat.icon size={28} className={idx === 0 && activeProjects.length > 0 ? 'animate-spin' : ''} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-display font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[400px]">
        {/* Stage 1: Queue */}
        <div className="glass-panel rounded-2xl flex flex-col h-full border-t-4 border-t-gray-500">
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <Database size={16} className="text-gray-400" /> {t.stage_queue}
              </h3>
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-lg">{queuedProjects.length}</span>
           </div>
           <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar">
              {queuedProjects.length === 0 ? (
                 <div className="text-center py-10 text-gray-500 text-sm italic">{t.empty_queue}</div>
              ) : (
                 queuedProjects.map(p => (
                    <div key={p.id} className="bg-studio-900/50 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer" onClick={() => navigate(`/analysis/${p.id}`)}>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-lg overflow-hidden shrink-0">
                             <img src={p.thumbnail} className="w-full h-full object-cover opacity-70" alt="thumb" />
                          </div>
                          <div className="min-w-0 flex-1">
                             <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                             <p className="text-xs text-gray-500">{p.engine} • {p.date}</p>
                          </div>
                          <ArrowRight size={14} className="text-gray-600" />
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* Stage 2: Processing */}
        <div className="glass-panel rounded-2xl flex flex-col h-full border-t-4 border-t-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-blue-500/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <Loader2 size={16} className="text-blue-400 animate-spin" /> {t.stage_generating}
              </h3>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-lg">{activeProjects.length}</span>
           </div>
           <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar">
              {activeProjects.length === 0 ? (
                 <div className="text-center py-10 text-gray-500 text-sm italic">{t.idle_machine}</div>
              ) : (
                 activeProjects.map(p => (
                    <div key={p.id} className="bg-gradient-to-r from-studio-900 to-blue-900/20 p-3 rounded-xl border border-blue-500/20 relative overflow-hidden">
                       <div className="flex items-center gap-3 relative z-10">
                          <div className="w-10 h-10 bg-black rounded-lg overflow-hidden shrink-0 border border-blue-500/30">
                             <img src={p.thumbnail} className="w-full h-full object-cover" alt="thumb" />
                          </div>
                          <div className="min-w-0 flex-1">
                             <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                             <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-blue-300">{ts[p.status as keyof typeof ts] || p.status}</span>
                                <span className="text-xs font-mono text-blue-400">{p.progress}%</span>
                             </div>
                             <div className="w-full h-1 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* Stage 3: Completed */}
        <div className="glass-panel rounded-2xl flex flex-col h-full border-t-4 border-t-green-500">
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-400" /> {t.stage_completed}
              </h3>
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-lg">{completedProjects.length}</span>
           </div>
           <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar">
              {completedProjects.length === 0 ? (
                 <div className="text-center py-10 text-gray-500 text-sm italic">{t.empty_library}</div>
              ) : (
                 completedProjects.map(p => (
                    <div key={p.id} className="bg-studio-900/50 p-3 rounded-xl border border-white/5 hover:border-green-500/30 transition-all cursor-pointer group" onClick={() => playVideo(p.id)}>
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-black rounded-lg overflow-hidden shrink-0 relative">
                             <img src={p.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="thumb" />
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                <Play size={16} className="text-white fill-white" />
                             </div>
                          </div>
                          <div className="min-w-0 flex-1">
                             <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                             <p className="text-xs text-green-400 mt-0.5">Sẵn sàng tải xuống</p>
                             <p className="text-[10px] text-gray-500 mt-0.5">{p.engine} • {p.duration}</p>
                          </div>
                          <button className="text-gray-600 hover:text-white transition-colors">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
