
import React, { useState, useRef } from 'react';
import { Language, ProjectStatus, VideoProject, TargetContentLanguage } from '../types';
import { Link, Upload, Youtube, Instagram, Facebook, Wand2, ArrowRight, Globe, Check, Layers, FileVideo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

const CreateProject: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const { addProject, addBatch } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang].create;
  
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [model, setModel] = useState<'Veo3' | 'Sora2' | 'KlingAI' | 'Grok'>('Veo3');
  
  const [urlInput, setUrlInput] = useState('');
  const [targetLang, setTargetLang] = useState<TargetContentLanguage>(lang === 'VN' ? 'Tiếng Việt' : 'Tiếng Anh');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const languageOptions: { name: TargetContentLanguage, flag: string }[] = [
    { name: 'Tiếng Việt', flag: '🇻🇳' },
    { name: 'Tiếng Anh', flag: '🇺🇸' },
    { name: 'Tiếng Nhật', flag: '🇯🇵' },
    { name: 'Tiếng Hàn', flag: '🇰🇷' },
    { name: 'Tiếng Trung', flag: '🇨🇳' },
    { name: 'Tiếng Pháp', flag: '🇫🇷' },
    { name: 'Tiếng Tây Ban Nha', flag: '🇪🇸' },
  ];

  const handleStart = () => {
    if (inputMode === 'url' && !urlInput) return;
    if (inputMode === 'upload' && selectedFiles.length === 0) return;

    setIsSubmitting(true);

    if (isBatchMode) {
        const batchName = inputMode === 'url' ? 'Batch URL Import' : `Batch Upload (${selectedFiles.length})`;
        addBatch(batchName, selectedFiles.length || 10, model);
        setTimeout(() => navigate('/mass-production'), 800);
        return;
    }

    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: inputMode === 'url' ? 'Project ' + Date.now().toString().slice(-4) : selectedFiles[0]?.name,
      thumbnail: 'https://picsum.photos/400/225?random=' + Date.now(),
      status: ProjectStatus.QUEUED,
      progress: 0,
      engine: model as any,
      date: lang === 'VN' ? 'Vừa xong' : 'Just now',
      sourceUrl: inputMode === 'url' ? urlInput : undefined,
      targetLanguage: targetLang
    };

    setTimeout(() => {
      addProject(newProject);
      navigate(`/analysis/${newProject.id}`);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-8 text-center">
        <h2 className="text-4xl font-display font-bold text-white mb-3">{t.title}</h2>
        <p className="text-gray-400">{t.desc}</p>
      </header>

      <div className="flex justify-center mb-10">
         <div className="bg-studio-900 p-1.5 rounded-2xl inline-flex border border-white/10 shadow-2xl">
            <button onClick={() => setIsBatchMode(false)} className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${!isBatchMode ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:text-white'}`}>
               <FileVideo size={18} /> {t.single_video}
            </button>
            <button onClick={() => setIsBatchMode(true)} className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isBatchMode ? 'bg-studio-accent text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}>
               <Layers size={18} /> {t.batch_video}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
                <div className="flex border-b border-white/5">
                    <button onClick={() => setInputMode('url')} className={`flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${inputMode === 'url' ? 'bg-white/5 text-white border-b-2 border-studio-accent' : 'text-gray-500 hover:text-white'}`}>
                        <Link size={18} /> {t.import_link}
                    </button>
                    <button onClick={() => setInputMode('upload')} className={`flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${inputMode === 'upload' ? 'bg-white/5 text-white border-b-2 border-studio-accent' : 'text-gray-500 hover:text-white'}`}>
                        <Upload size={18} /> {t.upload_file}
                    </button>
                </div>

                <div className="p-8">
                    {inputMode === 'url' ? (
                        <div className="relative">
                            <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder={t.placeholder_url} className="w-full bg-studio-900 border border-gray-800 rounded-2xl py-5 px-6 text-white focus:ring-2 focus:ring-studio-accent outline-none transition-all placeholder:text-gray-600 shadow-inner" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 text-gray-600 opacity-50">
                                <Youtube size={20} /> <Instagram size={20} /> <Facebook size={20} />
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-studio-accent/5 hover:border-studio-accent transition-all group">
                            <input type="file" ref={fileInputRef} className="hidden" multiple={isBatchMode} onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} />
                            {selectedFiles.length > 0 ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-studio-success/20 text-studio-success rounded-full flex items-center justify-center mb-4 mx-auto"><Check size={32} /></div>
                                    <p className="text-white font-bold">{selectedFiles.length} tệp đã chọn</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-studio-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Upload size={32} className="text-gray-500" /></div>
                                    <p className="text-white font-bold mb-1">{t.upload_desc}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.support_format}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Globe size={20} className="text-studio-accent" /> {t.target_lang}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {languageOptions.map(l => (
                        <button key={l.name} onClick={() => setTargetLang(l.name)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${targetLang === l.name ? 'bg-studio-accent border-studio-accent text-white shadow-lg shadow-indigo-500/20' : 'bg-studio-900 border-white/10 text-gray-400 hover:border-white/30'}`}>
                            <span className="text-lg">{l.flag}</span> {l.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Wand2 size={20} className="text-studio-neon" /> {t.ai_engine}</h3>
                <div className="space-y-3">
                    {[
                      { id: 'Veo3', name: 'Veo 3', desc: lang === 'VN' ? 'Siêu thực tế' : 'Hyper realistic' },
                      { id: 'Sora2', name: 'Sora 2', desc: lang === 'VN' ? 'Điện ảnh' : 'Cinematic' },
                      { id: 'KlingAI', name: 'Kling AI', desc: lang === 'VN' ? 'Nhân vật' : 'Characters' },
                      { id: 'Grok', name: 'Grok', desc: lang === 'VN' ? 'Xử lý Viral' : 'Viral processing' },
                    ].map(m => (
                        <div key={m.id} onClick={() => setModel(m.id as any)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${model === m.id ? 'bg-studio-accent/10 border-studio-accent shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-studio-900 border-white/5 hover:border-white/20'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold ${model === m.id ? 'text-studio-accent' : 'text-white'}`}>{m.name}</span>
                                {model === m.id && <Check size={14} className="text-studio-accent" />}
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tight">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleStart} disabled={isSubmitting} className="w-full bg-gradient-to-br from-studio-accent to-purple-600 hover:from-studio-accentHover hover:to-purple-500 text-white p-6 rounded-3xl font-bold text-xl shadow-2xl flex flex-col items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {isSubmitting ? (
                    <span className="flex items-center gap-3 animate-pulse">
                        <Layers className="animate-bounce" /> {t.preparing}
                    </span>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            {t.start_btn} <ArrowRight size={20} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">Neural Rendering Active</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
