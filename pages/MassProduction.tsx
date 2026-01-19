
import React, { useState } from 'react';
import { BatchTemplateId, Language } from '../types';
import { Layers, Plus, Play, Pause, Trash, Zap, LayoutTemplate, MonitorPlay, Settings2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

const MassProduction: React.FC<{ lang: Language }> = ({ lang }) => {
  const { batches, addBatch, toggleBatchStatus, removeBatch } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCount, setNewBatchCount] = useState(5);
  const [newBatchEngine, setNewBatchEngine] = useState('Veo3');
  const [selectedTemplate, setSelectedTemplate] = useState<BatchTemplateId>('cinematic_story');
  const t = translations[lang].mass;

  const templates: { id: BatchTemplateId; name: string; desc: string; icon: any }[] = [
    { id: 'gameplay_split', name: lang === 'VN' ? 'Màn hình chia Gameplay' : 'Gameplay Split Screen', desc: 'Viral / Subway Surfers', icon: LayoutTemplate },
    { id: 'fake_podcast', name: lang === 'VN' ? 'Podcast AI giả lập' : 'Fake AI Podcast', desc: 'AI Clone Discussion', icon: MonitorPlay },
    { id: 'cinematic_story', name: lang === 'VN' ? 'Kể chuyện Điện ảnh' : 'Cinematic Storytelling', desc: 'Artistic visuals', icon: Play },
    { id: 'news_flash', name: lang === 'VN' ? 'Tin tức nhanh' : 'News Flash', desc: 'Fast-paced reporting', icon: Zap },
  ];

  const handleCreateBatch = () => {
    if (!newBatchName) return;
    addBatch(newBatchName, newBatchCount, newBatchEngine, selectedTemplate);
    setIsModalOpen(false);
    setNewBatchName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">{t.title}</h2>
          <p className="text-gray-400 text-sm">{t.desc}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-studio-accent hover:bg-studio-accentHover text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95">
           <Plus size={18} /> {t.new_batch}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-studio-accent">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">{t.queue_health}</span>
              <div className="text-2xl font-bold text-white">{t.processing}</div>
              <p className="text-sm text-gray-400 mt-2">{batches.filter(b => b.status === 'Đang xử lý').length} {lang === 'VN' ? 'mẻ đang chạy' : 'batches running'}</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-green-500">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">{t.success_rate}</span>
              <div className="text-2xl font-bold text-white">99.8% Perfect</div>
              <p className="text-sm text-gray-400 mt-2">{lang === 'VN' ? 'Dựa trên kết xuất gần nhất' : 'Based on latest renders'}</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-purple-500">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">{t.credits_used}</span>
              <div className="text-2xl font-bold text-white">12.4k Credits</div>
              <p className="text-sm text-gray-400 mt-2">{lang === 'VN' ? 'Tiêu thụ trong tháng' : 'Monthly consumption'}</p>
          </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 bg-white/5">
           <h3 className="font-bold text-white flex items-center gap-2"><Layers size={18} className="text-studio-accent" /> {t.active_lines}</h3>
        </div>
        <div>
          {batches.length === 0 ? (
            <div className="p-20 text-center text-gray-500 italic font-display">{t.empty_batches}</div>
          ) : (
            batches.map((item) => (
              <div key={item.id} className="p-6 border-b border-white/5 hover:bg-white/5 transition-all flex flex-col md:flex-row items-center gap-6">
                 <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-white text-lg">{item.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="bg-studio-accent/20 text-studio-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{item.engine}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-medium">{templates.find(t => t.id === item.template)?.name}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-mono text-white">{item.processedVideos}/{item.totalVideos} {lang === 'VN' ? 'Sẵn sàng' : 'Ready'}</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-studio-900 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${item.status === 'Đã hoàn thành' ? 'bg-green-500' : 'bg-studio-accent'}`} style={{ width: `${(item.processedVideos / item.totalVideos) * 100}%` }}></div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => toggleBatchStatus(item.id)} className={`p-3 rounded-2xl transition-all ${item.status === 'Đang xử lý' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20'}`}>
                        {item.status === 'Đang xử lý' ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={() => removeBatch(item.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-2xl transition-all">
                        <Trash size={20} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
           <div className="glass-panel p-8 rounded-3xl w-full max-w-xl relative border border-studio-accent/30 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{t.modal_title}</h3>
                <Settings2 className="text-gray-500" />
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-widest">{t.batch_name}</label>
                    <input type="text" value={newBatchName} onChange={(e) => setNewBatchName(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-studio-accent transition-all" placeholder="Project_Alpha_Batch_01" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-widest">{t.total_videos}</label>
                        <input type="number" value={newBatchCount} onChange={(e) => setNewBatchCount(Number(e.target.value))} className="w-full bg-studio-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-studio-accent" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-widest">AI Engine</label>
                        <select value={newBatchEngine} onChange={(e) => setNewBatchEngine(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-studio-accent">
                            <option>Veo3</option>
                            <option>Sora2</option>
                            <option>Grok</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-widest">{t.strategy_template}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {templates.map(t => (
                            <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t.id ? 'bg-studio-accent/20 border-studio-accent text-white shadow-lg shadow-indigo-500/10' : 'bg-studio-900 border-white/10 text-gray-500 hover:border-white/30'}`}>
                                <div className="font-bold text-xs mb-1">{t.name}</div>
                                <div className="text-[10px] opacity-60 truncate">{t.desc}</div>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-400 font-bold hover:text-white transition-colors">{lang === 'VN' ? 'Hủy' : 'Cancel'}</button>
                    <button onClick={handleCreateBatch} className="flex-1 bg-studio-accent hover:bg-studio-accentHover text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95">{lang === 'VN' ? 'Bắt đầu' : 'Deploy'}</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MassProduction;
