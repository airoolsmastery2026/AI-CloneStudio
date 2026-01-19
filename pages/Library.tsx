
import React, { useState } from 'react';
import { Language, ProjectStatus, VideoProject } from '../types';
import { Download, Play, MoreHorizontal, Search, Grid, List, Trash2, CheckSquare, Square } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface LibraryProps {
  lang: Language;
}

const Library: React.FC<LibraryProps> = ({ lang }) => {
  const { projects, addNotification, playVideo } = useStudio();
  const t = translations[lang].library;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterEngine, setFilterEngine] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const completedProjects = projects.filter(p => 
    p.status === ProjectStatus.COMPLETED &&
    (filterEngine === 'All' || p.engine === filterEngine) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const engines = ['All', 'Veo3', 'Sora2', 'KlingAI', 'Grok'];

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === completedProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(completedProjects.map(p => p.id)));
    }
  };

  const handleBatchDownload = () => {
    if (selectedIds.size === 0) return;
    addNotification({
      title: lang === 'VN' ? 'Đang Tải Hàng Loạt' : 'Batch Download',
      message: t.batch_notif.replace('{count}', selectedIds.size.toString()),
      type: 'process',
      time: 'Now',
      progress: 0
    });
    setTimeout(() => {
        addNotification({ title: 'Ready', message: lang === 'VN' ? 'Tệp nén đã sẵn sàng.' : 'Archive ready.', type: 'success', time: 'Now' });
        setSelectedIds(new Set());
    }, 2000);
  };

  const handleBatchDelete = () => {
     addNotification({
         title: lang === 'VN' ? 'Đã Xóa' : 'Deleted',
         message: t.delete_notif.replace('{count}', selectedIds.size.toString()),
         type: 'info',
         time: 'Now'
     });
     setSelectedIds(new Set());
  };

  const handleSingleDownload = (project: VideoProject) => {
    if (project.videoUrl) {
        const link = document.createElement('a');
        link.href = project.videoUrl;
        link.download = `${project.title.replace(/\s+/g, '_')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification({ title: t.download, message: project.title, type: 'success', time: 'Now' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">{t.title}</h2>
           <p className="text-gray-400 text-sm">{completedProjects.length} {t.items}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
           {selectedIds.size > 0 ? (
             <div className="flex items-center gap-2 animate-in slide-in-from-right duration-300">
                <span className="text-sm text-white font-bold bg-studio-accent px-3 py-1.5 rounded-lg">{selectedIds.size} {lang === 'VN' ? 'Đã chọn' : 'Selected'}</span>
                <button onClick={handleBatchDownload} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"><Download size={18} /></button>
                <button onClick={handleBatchDelete} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={18} /></button>
                <button onClick={() => setSelectedIds(new Set())} className="text-xs text-gray-400 hover:text-white underline px-2">{lang === 'VN' ? 'Hủy' : 'Cancel'}</button>
             </div>
           ) : (
             <div className="flex items-center gap-2">
                <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                   <input 
                     type="text" 
                     placeholder={t.search}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-studio-900 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-studio-accent w-48"
                   />
                </div>
                <div className="flex bg-studio-900 rounded-lg p-1 border border-white/10">
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-studio-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Grid size={16} /></button>
                   <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-studio-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}><List size={16} /></button>
                </div>
             </div>
           )}
        </div>
      </header>
      
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/5">
         {engines.map(engine => (
           <button key={engine} onClick={() => setFilterEngine(engine)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${filterEngine === engine ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}>
             {engine}
           </button>
         ))}
      </div>

      <div className="flex items-center gap-2 mb-2">
         <button onClick={handleSelectAll} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
            {selectedIds.size === completedProjects.length && completedProjects.length > 0 ? <CheckSquare size={14} className="text-studio-accent" /> : <Square size={14} />}
            {t.select_all}
         </button>
      </div>

      {completedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-studio-900/30 text-center">
           <Download size={48} className="mb-4 opacity-20" />
           <p>{t.empty}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-2"}>
          {completedProjects.map((project) => (
            viewMode === 'grid' ? (
              <div key={project.id} className={`glass-panel rounded-xl overflow-hidden group relative border transition-all ${selectedIds.has(project.id) ? 'border-studio-accent ring-1 ring-studio-accent' : 'border-white/5 hover:border-white/20'}`}>
                <div className="absolute top-2 left-2 z-20">
                   <button onClick={() => toggleSelection(project.id)} className="text-white drop-shadow-md">
                      {selectedIds.has(project.id) ? <CheckSquare size={20} className="text-studio-accent bg-black/50 rounded" /> : <Square size={20} className="text-white/70 bg-black/20 rounded" />}
                   </button>
                </div>
                <div className="aspect-[9/16] bg-gray-900 relative cursor-pointer" onClick={() => playVideo(project.id)}>
                   <img src={project.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={24} fill="currentColor" className="text-white" />
                   </div>
                </div>
                <div className="p-3 bg-studio-900/50">
                   <h4 className="text-xs font-bold text-white truncate mb-1">{project.title}</h4>
                   <div className="flex justify-between items-center text-[10px] text-gray-500">
                     <span>{project.date}</span>
                     <button onClick={(e) => { e.stopPropagation(); handleSingleDownload(project); }} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"><Download size={14} /></button>
                   </div>
                </div>
              </div>
            ) : (
              <div key={project.id} className={`glass-panel p-2 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors border ${selectedIds.has(project.id) ? 'border-studio-accent bg-studio-accent/5' : 'border-transparent'}`}>
                <button onClick={() => toggleSelection(project.id)} className="pl-2">
                   {selectedIds.has(project.id) ? <CheckSquare size={18} className="text-studio-accent" /> : <Square size={18} className="text-gray-500" />}
                </button>
                <div className="w-16 h-10 bg-black rounded overflow-hidden shrink-0 relative cursor-pointer" onClick={() => playVideo(project.id)}>
                   <img src={project.thumbnail} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play size={12} fill="currentColor" className="text-white" /></div>
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
                   <p className="text-xs text-gray-500">{project.engine} • {project.duration || '0:15'}</p>
                </div>
                <button onClick={() => handleSingleDownload(project)} className="p-2 bg-studio-800 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"><Download size={16} /></button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
