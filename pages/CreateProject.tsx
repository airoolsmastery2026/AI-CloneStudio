import React, { useState, useRef } from 'react';
import { Language, ProjectStatus, VideoProject } from '../types';
import { Link, Upload, Youtube, Instagram, Facebook, Wand2, ArrowRight, Languages, Check, Layers, FileVideo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

interface CreateProjectProps {
  lang: Language;
}

const CreateProject: React.FC<CreateProjectProps> = ({ lang }) => {
  const navigate = useNavigate();
  const { addProject, addBatch } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [model, setModel] = useState<'Veo3' | 'Sora2' | 'KlingAI' | 'Grok'>('Veo3');
  
  const [urlInput, setUrlInput] = useState('');
  const [contentLang, setContentLang] = useState<string>('Auto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const models = [
    { id: 'Veo3', name: 'Veo 3', desc: 'High fidelity realistic generation' },
    { id: 'Sora2', name: 'Sora 2', desc: 'Cinematic quality & motion' },
    { id: 'KlingAI', name: 'Kling AI', desc: 'Portrait & Character focus' },
    { id: 'Grok', name: 'Grok', desc: 'Viral trend optimized' },
  ];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isBatchMode) {
        // Batch Mode: Add all
        setSelectedFiles(Array.from(e.target.files));
        setPreviewUrl(null); 
      } else {
        // Single Mode: Take first
        const file = e.target.files[0];
        setSelectedFiles([file]);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleStart = () => {
    if (inputMode === 'url' && !urlInput) return;
    if (inputMode === 'upload' && selectedFiles.length === 0) return;

    setIsSubmitting(true);

    // BATCH MODE LOGIC
    if (isBatchMode) {
        const batchName = inputMode === 'url' ? 'URL Batch Import' : `Bulk Upload (${selectedFiles.length} files)`;
        const count = inputMode === 'url' ? 10 : selectedFiles.length; // Mock count for URL batch
        
        setTimeout(() => {
            addBatch(batchName, count, model);
            navigate('/mass-production');
        }, 800);
        return;
    }

    // SINGLE MODE LOGIC
    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: inputMode === 'url' 
        ? 'Imported Project ' + Date.now().toString().slice(-4) 
        : (selectedFiles[0]?.name || 'Upload Project'),
      thumbnail: 'https://picsum.photos/400/225?random=' + Date.now(),
      videoUrl: inputMode === 'upload' && previewUrl ? previewUrl : undefined,
      status: ProjectStatus.QUEUED,
      progress: 0,
      engine: model as any,
      date: 'Just now',
      sourceUrl: inputMode === 'url' ? urlInput : undefined
    };

    setTimeout(() => {
      addProject(newProject);
      navigate(`/analysis/${newProject.id}`);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          {lang === 'EN' ? 'Start New Project' : 'Bắt đầu dự án mới'}
        </h2>
        <p className="text-gray-400">
          {lang === 'EN' ? 'Choose your input source and AI engine.' : 'Chọn nguồn nhập và công cụ AI.'}
        </p>
      </header>

      {/* Mode Switcher (Single vs Batch) */}
      <div className="flex justify-center mb-8">
         <div className="bg-studio-900 p-1 rounded-xl inline-flex border border-white/10">
            <button 
              onClick={() => setIsBatchMode(false)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${!isBatchMode ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
               <FileVideo size={16} /> {lang === 'EN' ? 'Single Video' : 'Video Lẻ'}
            </button>
            <button 
              onClick={() => setIsBatchMode(true)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isBatchMode ? 'bg-studio-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
               <Layers size={16} /> {lang === 'EN' ? 'Batch / Bulk' : 'Hàng loạt'}
            </button>
         </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setInputMode('url')}
            className={`flex-1 py-4 text-center text-sm font-bold transition-colors border-b-2 ${inputMode === 'url' ? 'border-studio-accent text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
             <div className="flex items-center justify-center gap-2"><Link size={18} /> URL Import</div>
          </button>
          <button 
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-4 text-center text-sm font-bold transition-colors border-b-2 ${inputMode === 'upload' ? 'border-studio-accent text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
             <div className="flex items-center justify-center gap-2"><Upload size={18} /> File Upload</div>
          </button>
        </div>

        <div className="p-8">
          {inputMode === 'url' ? (
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isBatchMode ? (lang === 'EN' ? 'Channel or Playlist URL' : 'URL Kênh hoặc Playlist') : (lang === 'EN' ? 'Video URL' : 'URL Video')}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={isBatchMode ? "https://youtube.com/@channel/videos" : "https://youtube.com/watch?v=..."}
                      className="w-full bg-studio-900 border border-gray-700 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-studio-accent focus:ring-1 focus:ring-studio-accent transition-all placeholder:text-gray-600"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 text-gray-500">
                      <Youtube size={20} />
                      <Instagram size={20} />
                      <Facebook size={20} />
                    </div>
                  </div>
                  {isBatchMode && (
                     <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                        <Layers size={12} />
                        {lang === 'EN' ? 'AI will auto-select top trending videos from this source.' : 'AI sẽ tự động chọn video xu hướng hàng đầu từ nguồn này.'}
                     </div>
                  )}
               </div>
            </div>
          ) : (
            <div 
              onClick={handleFileClick}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer bg-studio-900/50 group ${selectedFiles.length > 0 ? 'border-studio-success bg-studio-success/5' : 'border-gray-700 hover:border-studio-accent hover:bg-studio-accent/5'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple={isBatchMode}
                accept="video/mp4,video/mov,video/quicktime"
              />
              
              {selectedFiles.length > 0 ? (
                 <div className="text-center">
                    <div className="w-16 h-16 bg-studio-success rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg shadow-green-500/20">
                      <Check size={32} className="text-white" />
                    </div>
                    {isBatchMode ? (
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{selectedFiles.length} files selected</h3>
                            <p className="text-sm text-gray-400">Ready for mass analysis</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{selectedFiles[0].name}</h3>
                            <p className="text-sm text-gray-400">{(selectedFiles[0].size / (1024*1024)).toFixed(2)} MB</p>
                        </div>
                    )}
                    <p className="text-xs text-studio-accent mt-4 font-bold uppercase tracking-wider group-hover:underline">Click to change</p>
                 </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-studio-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {isBatchMode ? <Layers size={32} className="text-gray-400 group-hover:text-white" /> : <Upload size={32} className="text-gray-400 group-hover:text-white" />}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {lang === 'EN' ? (isBatchMode ? 'Bulk Upload (Max 50)' : 'Click to Upload') : (isBatchMode ? 'Tải hàng loạt (Tối đa 50)' : 'Nhấn để tải lên')}
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    MP4, MOV supported.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Content Language Selection */}
          <div className="mt-6 pt-6 border-t border-white/5">
             <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Languages size={16} />
                {lang === 'EN' ? 'Target Content Language' : 'Ngôn ngữ nội dung mục tiêu'}
             </label>
             <div className="flex gap-3 flex-wrap">
                {['Auto', 'English', 'Vietnamese', 'Japanese', 'Spanish'].map(l => (
                  <button
                    key={l}
                    onClick={() => setContentLang(l)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${contentLang === l ? 'bg-studio-accent border-studio-accent text-white' : 'border-white/10 text-gray-400 hover:border-white/30 bg-studio-900'}`}
                  >
                    {l}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <Wand2 size={20} className="text-studio-neon" />
           {lang === 'EN' ? 'Select AI Engine' : 'Chọn Công cụ AI'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((m) => (
            <div 
              key={m.id}
              onClick={() => setModel(m.id as any)}
              className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                model === m.id 
                  ? 'bg-studio-accent/10 border-studio-accent' 
                  : 'bg-studio-800/50 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white group-hover:text-studio-accent transition-colors">{m.name}</span>
                {model === m.id && <div className="w-3 h-3 bg-studio-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pb-10">
        <button 
          onClick={handleStart}
          disabled={isSubmitting || (inputMode === 'url' && !urlInput) || (inputMode === 'upload' && selectedFiles.length === 0)}
          className="bg-gradient-to-r from-studio-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/40 flex items-center gap-2 transform transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {isSubmitting ? (
             <span className="animate-pulse flex items-center gap-2"><Layers size={20} className="animate-bounce" /> {isBatchMode ? 'Queuing Batch...' : 'Analyzing...'}</span>
           ) : (
             <>
               {isBatchMode ? (lang === 'EN' ? 'Start Batch Production' : 'Bắt đầu SX Hàng loạt') : (lang === 'EN' ? 'Start Generation' : 'Bắt đầu Tạo')}
               <ArrowRight size={20} />
             </>
           )}
        </button>
      </div>
    </div>
  );
};

export default CreateProject;