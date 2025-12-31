import React, { useState } from 'react';
import { BatchTemplateId, Language } from '../types';
import { Layers, CheckCircle, Clock, Play, Pause, Trash, Plus, Zap, LayoutTemplate, MonitorPlay } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface MassProductionProps {
  lang: Language;
}

const templates: { id: BatchTemplateId; name: string; desc: string; icon: any }[] = [
    { id: 'gameplay_split', name: 'Split Screen Gameplay', desc: 'Top: Viral Video, Bottom: Subway Surfers', icon: LayoutTemplate },
    { id: 'fake_podcast', name: 'AI Podcast', desc: '2 AI Avatars discussing the topic', icon: MonitorPlay },
    { id: 'cinematic_story', name: 'Cinematic Story', desc: 'Voiceover with high-quality B-roll', icon: Play },
    { id: 'news_flash', name: 'Breaking News', desc: 'News anchor style presentation', icon: Zap },
];

const MassProduction: React.FC<MassProductionProps> = ({ lang }) => {
  const { batches, addBatch, toggleBatchStatus, removeBatch } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCount, setNewBatchCount] = useState(10);
  const [newBatchEngine, setNewBatchEngine] = useState('Veo3');
  const [selectedTemplate, setSelectedTemplate] = useState<BatchTemplateId>('cinematic_story');

  const handleCreateBatch = () => {
    if (!newBatchName) return;
    addBatch(newBatchName, newBatchCount, newBatchEngine, selectedTemplate);
    setIsModalOpen(false);
    setNewBatchName('');
    setNewBatchCount(10);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'EN' ? 'Mass Production Center' : 'Trung tâm Sản xuất Hàng loạt'}
          </h2>
          <p className="text-gray-400 text-sm">
            {lang === 'EN' ? 'Manage bulk generation workflows.' : 'Quản lý quy trình tạo hàng loạt.'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-studio-accent hover:bg-studio-accentHover text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2"
        >
           <Plus size={16} /> {lang === 'EN' ? 'New Batch' : 'Mẻ mới'}
        </button>
      </header>

      {/* Workflow Visualizer */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
        <div className="flex justify-between items-center relative z-10">
          {[
            { label: 'Source Queue', count: batches.reduce((acc, b) => acc + b.totalVideos, 0) },
            { label: 'Rendering', count: batches.filter(b => b.status === 'Processing').reduce((acc, b) => acc + (b.totalVideos - b.processedVideos), 0) },
            { label: 'Completed', count: batches.reduce((acc, b) => acc + b.processedVideos, 0) }
          ].map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center">
               <div className="w-3 h-3 rounded-full bg-studio-accent mb-2 shadow-[0_0_10px_#6366f1]"></div>
               <span className="text-2xl font-display font-bold text-white">{stage.count}</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Queue List */}
      <div className="glass-panel rounded-2xl overflow-hidden min-h-[300px]">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
           <h3 className="font-bold text-white">Active Batches</h3>
        </div>
        <div>
          {batches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
               No active batches. Start a new one to scale up!
            </div>
          ) : (
            batches.map((item) => (
              <div key={item.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center gap-4">
                 <div className="p-2 bg-studio-800 rounded-lg">
                   <Layers size={20} className="text-gray-400" />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-white text-sm">{item.name}</h4>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs text-studio-accent border border-studio-accent/30 px-1.5 py-0.5 rounded font-bold">{item.engine}</span>
                     <span className="text-xs text-gray-400 border border-white/10 px-1.5 py-0.5 rounded">{templates.find(t => t.id === item.template)?.name || 'Standard'}</span>
                     <p className="text-xs text-gray-500 ml-2">{item.totalVideos} videos</p>
                   </div>
                 </div>
                 
                 <div className="flex-1 max-w-xs">
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-gray-400">{item.status}</span>
                     <span className="text-white font-mono">{Math.round((item.processedVideos / item.totalVideos) * 100)}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-studio-900 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-500 ${item.status === 'Completed' ? 'bg-studio-success' : item.status === 'Paused' ? 'bg-yellow-500' : 'bg-studio-accent'}`} 
                       style={{ width: `${(item.processedVideos / item.totalVideos) * 100}%` }}
                     ></div>
                   </div>
                 </div>

                 <div className="flex items-center gap-2">
                   {item.status !== 'Completed' && (
                     <button onClick={() => toggleBatchStatus(item.id)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        {item.status === 'Processing' ? <Pause size={18} /> : <Play size={18} />}
                     </button>
                   )}
                   {item.status === 'Completed' && <CheckCircle size={18} className="text-green-500 mx-2"/>}
                   
                   <button onClick={() => removeBatch(item.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-gray-500">
                      <Trash size={18} />
                   </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl animate-in fade-in zoom-in duration-200">
           <div className="glass-panel p-6 rounded-2xl w-full max-w-2xl border border-studio-accent/30 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="text-studio-accent" /> New Production Batch
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Batch Name</label>
                        <input 
                            type="text" 
                            value={newBatchName}
                            onChange={(e) => setNewBatchName(e.target.value)}
                            className="w-full bg-studio-900 border border-white/10 rounded-lg p-3 text-white focus:border-studio-accent outline-none"
                            placeholder="e.g. TikTok Trends Week 42"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">AI Engine</label>
                        <select 
                        value={newBatchEngine}
                        onChange={(e) => setNewBatchEngine(e.target.value)}
                        className="w-full bg-studio-900 border border-white/10 rounded-lg p-3 text-white focus:border-studio-accent outline-none"
                        >
                        <option>Veo3</option>
                        <option>Sora2</option>
                        <option>KlingAI</option>
                        <option>Grok</option>
                        </select>
                    </div>
                </div>

                {/* Template Selection */}
                <div>
                    <label className="block text-sm text-gray-400 mb-3">Viral Strategy Template</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {templates.map(t => (
                            <div 
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedTemplate === t.id ? 'bg-studio-accent/20 border-studio-accent ring-1 ring-studio-accent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <div className={`p-2 rounded-lg ${selectedTemplate === t.id ? 'bg-studio-accent text-white' : 'bg-gray-800 text-gray-400'}`}>
                                    <t.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                        <input 
                        type="number" 
                        value={newBatchCount}
                        onChange={(e) => setNewBatchCount(Number(e.target.value))}
                        className="w-32 bg-studio-900 border border-white/10 rounded-lg p-3 text-white text-center font-bold text-lg focus:border-studio-accent outline-none"
                        min="1" max="100"
                        />
                        <div className="flex-1 bg-studio-accent/10 p-3 rounded-lg text-xs text-indigo-300 flex items-center gap-2 border border-studio-accent/20">
                            <Zap size={16} className="shrink-0" />
                            Estimated Cost: <span className="font-bold text-white">{newBatchCount * 10} credits</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                   <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                   <button onClick={handleCreateBatch} className="bg-studio-accent hover:bg-studio-accentHover text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20">Start Production</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MassProduction;