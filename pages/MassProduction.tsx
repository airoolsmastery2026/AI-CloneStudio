import React, { useState, useEffect } from 'react';
import { BatchTemplateId, Language, ProjectStatus } from '../types';
import { Layers, CheckCircle, Play, Pause, Trash, Plus, Zap, LayoutTemplate, MonitorPlay, Loader2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

const templates: { id: BatchTemplateId; name: string; desc: string; icon: any }[] = [
    { id: 'gameplay_split', name: 'Split Screen Gameplay', desc: 'Viral Content / Subway Surfers', icon: LayoutTemplate },
    { id: 'fake_podcast', name: 'AI Podcast', desc: 'Deep-dive discussion between AI clones', icon: MonitorPlay },
    { id: 'cinematic_story', name: 'Storytelling', desc: 'Cinematic B-roll with emotive VO', icon: Play },
    { id: 'news_flash', name: 'Breaking News', desc: 'Fast-paced news delivery style', icon: Zap },
];

const MassProduction: React.FC<{ lang: Language }> = ({ lang }) => {
  const { batches, addBatch, toggleBatchStatus, removeBatch, projects } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCount, setNewBatchCount] = useState(5);
  const [newBatchEngine, setNewBatchEngine] = useState('Veo3');
  const [selectedTemplate, setSelectedTemplate] = useState<BatchTemplateId>('cinematic_story');

  const handleCreateBatch = () => {
    if (!newBatchName) return;
    addBatch(newBatchName, newBatchCount, newBatchEngine, selectedTemplate);
    setIsModalOpen(false);
    setNewBatchName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Mass Production Hub</h2>
          <p className="text-gray-400 text-sm">Automated bulk generation workflows.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-studio-accent hover:bg-studio-accentHover text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95">
           <Plus size={18} /> New Factory Batch
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-studio-accent">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Queue Health</span>
              <div className="text-2xl font-bold text-white">Active Production</div>
              <p className="text-sm text-gray-400 mt-2">{batches.filter(b => b.status === 'Processing').length} batches in factory</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-green-500">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Success Rate</span>
              <div className="text-2xl font-bold text-white">99.8% Perfect</div>
              <p className="text-sm text-gray-400 mt-2">Based on last 500 neural renders</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-purple-500">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Credits Consumed</span>
              <div className="text-2xl font-bold text-white">12.4k Credits</div>
              <p className="text-sm text-gray-400 mt-2">Month-to-date consumption</p>
          </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 bg-white/5">
           <h3 className="font-bold text-white flex items-center gap-2"><Layers size={18} className="text-studio-accent" /> Active Production Lines</h3>
        </div>
        <div>
          {batches.length === 0 ? (
            <div className="p-20 text-center text-gray-500 italic">No active production lines. Start a batch to scale.</div>
          ) : (
            batches.map((item) => (
              <div key={item.id} className="p-6 border-b border-white/5 hover:bg-white/5 transition-all flex flex-col md:flex-row items-center gap-6">
                 <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-white text-lg">{item.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="bg-studio-accent/20 text-studio-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{item.engine}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{templates.find(t => t.id === item.template)?.name}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-mono text-white">{item.processedVideos}/{item.totalVideos} Ready</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-studio-900 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${item.status === 'Completed' ? 'bg-green-500' : 'bg-studio-accent'}`} style={{ width: `${(item.processedVideos / item.totalVideos) * 100}%` }}></div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => toggleBatchStatus(item.id)} className={`p-3 rounded-2xl transition-all ${item.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20'}`}>
                        {item.status === 'Processing' ? <Pause size={20} /> : <Play size={20} />}
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
              <h3 className="text-2xl font-bold text-white mb-8">Deploy Production Batch</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-xs text-gray-400 block mb-2">Batch Label</label>
                    <input type="text" value={newBatchName} onChange={(e) => setNewBatchName(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-studio-accent" placeholder="e.g. Finance_Channel_Batch_01" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-2">Total Videos</label>
                        <input type="number" value={newBatchCount} onChange={(e) => setNewBatchCount(Number(e.target.value))} className="w-full bg-studio-900 border border-white/10 rounded-xl p-3 text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-2">Engine</label>
                        <select value={newBatchEngine} onChange={(e) => setNewBatchEngine(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-3 text-white">
                            <option>Veo3</option>
                            <option>Sora2</option>
                            <option>Grok</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-2">Strategy Template</label>
                    <div className="grid grid-cols-2 gap-2">
                        {templates.map(t => (
                            <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t.id ? 'bg-studio-accent/20 border-studio-accent text-white' : 'bg-studio-900 border-white/10 text-gray-500 hover:border-white/30'}`}>
                                <div className="font-bold text-xs">{t.name}</div>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
                    <button onClick={handleCreateBatch} className="flex-1 bg-studio-accent hover:bg-studio-accentHover text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">Start Production</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MassProduction;