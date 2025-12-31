import React, { useEffect, useState, useRef } from 'react';
import { Language, ProjectStatus, VideoProject, ScriptStructure, VoiceConfig } from '../types';
import { Play, FileCode, CheckCircle2, RefreshCw, Loader2, Activity, Zap, Search, ArrowRight, BarChart2, Image as ImageIcon, Mic, UploadCloud, Layers } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

interface AnalysisProps {
  lang: Language;
}

const mockVoices: VoiceConfig[] = [
  { id: 'v1', name: 'Alex (Deep)', gender: 'Male', style: 'Story', lang: 'EN' },
  { id: 'v2', name: 'Sarah (Energetic)', gender: 'Female', style: 'Hype', lang: 'EN' },
  { id: 'v3', name: 'Minh (Truyền cảm)', gender: 'Male', style: 'News', lang: 'VN' },
  { id: 'v4', name: 'Linh (Vui vẻ)', gender: 'Female', style: 'Story', lang: 'VN' },
];

const Analysis: React.FC<AnalysisProps> = ({ lang }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, addNotification, deductCredits, playVideo } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [project, setProject] = useState<VideoProject | null>(null);
  
  // Advanced Editor States
  const [scriptStructure, setScriptStructure] = useState<ScriptStructure>({ hook: '', body: '', cta: '' });
  const [localPrompt, setLocalPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('v1');
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState('');

  // AI Strategy State
  const [scriptTone, setScriptTone] = useState<'Excited' | 'Professional' | 'Storyteller' | 'Satire'>('Excited');
  const [visualStyle, setVisualStyle] = useState<'Cinematic' | 'Cyberpunk' | 'Minimalist' | 'Anime'>('Cinematic');

  // --- Metrics ---
  const [analysisMetrics, setAnalysisMetrics] = useState({
    sentiment: 'Neutral',
    pacing: 'Moderate',
    hookScore: 85,
  });

  useEffect(() => {
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      if (found) {
        setProject(found);
        
        // Initialize script structure
        if (found.scriptStructure) {
            setScriptStructure(found.scriptStructure);
        } else if (found.script) {
            // Primitive parsing for legacy string scripts
            setScriptStructure({
                hook: found.script.substring(0, 50) + '...',
                body: found.script,
                cta: 'Check bio!'
            });
        }

        setLocalPrompt(found.optimizedPrompt || '');
        if (found.referenceImage) setReferenceImg(found.referenceImage);
        if (found.voiceId) setSelectedVoice(found.voiceId);

        // Auto-start analysis if newly created
        if (found.status === ProjectStatus.QUEUED) {
          runAnalysis(found.id);
        }
      }
    }
  }, [projectId, projects]);

  const generateScriptContent = (tone: string) => {
    // Generate distinct parts
    const isVN = lang === 'VN';
    
    let hook = isVN ? "Bạn sẽ không tin điều này đâu!" : "You won't believe what I found!";
    let body = isVN ? "Công cụ AI này thay đổi hoàn toàn cuộc chơi. Nó tự động hóa mọi thứ từ A-Z." : "This AI tool completely changes the game. It automates everything from A to Z.";
    let cta = isVN ? "Nhấn vào link trong bio nhé!" : "Link in bio to try it out!";

    if (tone === 'Professional') {
        hook = isVN ? "Tối ưu hóa quy trình là chìa khóa." : "Optimization is key.";
        body = isVN ? "Giải pháp này giảm 40% chi phí vận hành." : "This solution reduces OpEx by 40%.";
        cta = isVN ? "Liên hệ để biết thêm." : "Contact for details.";
    }

    return { hook, body, cta };
  };

  const generatePromptContent = (style: string) => {
     if (style === 'Cyberpunk') return "Neon-drenched city streets, rain slicked pavement, holographic advertisements, high contrast, pink and cyan color grading.";
     if (style === 'Minimalist') return "Clean white studio background, soft diffuse lighting, sharp focus, pastel accent colors.";
     if (style === 'Anime') return "Studio Ghibli style, lush green environments, hand-painted textures, vibrant blue skies.";
     return "Photorealistic 8k, cinematic lighting, bokeh background, shallow depth of field.";
  };

  const runAnalysis = async (id: string) => {
    setIsProcessing(true);
    
    updateProject(id, { status: ProjectStatus.ANALYZING });
    setStage(lang === 'EN' ? 'Analyzing Visual Structure...' : 'Đang phân tích cấu trúc hình ảnh...');
    await new Promise(r => setTimeout(r, 800));
    
    updateProject(id, { status: ProjectStatus.WRITING });
    setStage(lang === 'EN' ? `Drafting ${scriptTone} Script...` : `Đang soạn thảo kịch bản ${scriptTone}...`);
    await new Promise(r => setTimeout(r, 800));
    
    const generatedScript = generateScriptContent(scriptTone);
    setScriptStructure(generatedScript);

    updateProject(id, { status: ProjectStatus.PROMPTING });
    setStage(lang === 'EN' ? `Optimizing ${visualStyle} Prompts...` : `Tối ưu hóa Prompts ${visualStyle}...`);
    await new Promise(r => setTimeout(r, 800));
    
    const generatedPrompt = generatePromptContent(visualStyle);
    setLocalPrompt(generatedPrompt);

    updateProject(id, { 
      status: ProjectStatus.ANALYZING, 
      scriptStructure: generatedScript, 
      optimizedPrompt: generatedPrompt 
    });
    
    setIsProcessing(false);
    setStage('');
    addNotification({ title: 'AI Optimization Complete', message: 'Content strategy updated.', type: 'success', time: 'Now' });
  };

  const handleGenerate = () => {
    if (!project) return;
    deductCredits(10);
    updateProject(project.id, {
      status: ProjectStatus.GENERATING,
      scriptStructure: scriptStructure,
      script: `${scriptStructure.hook} ${scriptStructure.body} ${scriptStructure.cta}`, // Fallback
      optimizedPrompt: localPrompt,
      voiceId: selectedVoice,
      referenceImage: referenceImg || undefined,
      progress: 0
    });
    addNotification({ title: 'Rendering Started', message: 'Project queued for rendering.', type: 'info', time: 'Now' });
    navigate('/dashboard');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setReferenceImg(url);
          addNotification({ title: 'Style Reference Added', message: 'AI will match this visual style.', type: 'success', time: 'Now' });
      }
  };

  if (!project) return <div className="p-10 text-center text-gray-500">Project not found</div>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col xl:flex-row gap-6 animate-in slide-in-from-right duration-500">
      
      {/* LEFT COLUMN: Controls & Assets */}
      <div className="xl:w-1/3 flex flex-col gap-4 overflow-y-auto hide-scrollbar pr-2">
        
        {/* Project Header Card */}
        <div className="glass-panel p-4 rounded-xl flex gap-4 items-center">
             <div className="w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0 relative cursor-pointer group" onClick={() => playVideo(project.id)}>
                <img src={project.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white drop-shadow-lg" fill="currentColor"/></div>
             </div>
             <div className="min-w-0">
                <h2 className="font-bold text-white truncate text-lg">{project.title}</h2>
                <div className="flex gap-2 mt-1">
                   <span className="text-[10px] bg-studio-accent px-2 py-0.5 rounded text-white">{project.engine}</span>
                   <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded text-gray-300">{project.duration || 'Auto'}</span>
                </div>
             </div>
        </div>

        {/* Style & Reference Control */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Layers size={14} className="text-studio-neon" /> Visual Style Cloning
             </h3>
             
             <div>
                <label className="text-xs text-gray-400 block mb-2">Aesthetic Style</label>
                <select 
                   value={visualStyle}
                   onChange={(e) => setVisualStyle(e.target.value as any)}
                   className="w-full bg-studio-900 border border-white/10 rounded-lg p-2 text-sm text-white"
                >
                   <option>Cinematic</option>
                   <option>Cyberpunk</option>
                   <option>Minimalist</option>
                   <option>Anime</option>
                </select>
             </div>

             <div>
                <label className="text-xs text-gray-400 block mb-2">Style Reference Image (For Consistency)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-studio-accent transition-all relative overflow-hidden h-32"
                >
                    {referenceImg ? (
                        <>
                           <img src={referenceImg} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                           <div className="z-10 bg-black/50 p-1 rounded-full"><RefreshCw size={16} className="text-white" /></div>
                        </>
                    ) : (
                        <>
                           <UploadCloud size={24} className="text-gray-500 mb-2" />
                           <span className="text-xs text-gray-400">Upload Image to Clone Style</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
             </div>
        </div>

        {/* Audio / Voiceover Control */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Mic size={14} className="text-blue-400" /> Audio Intelligence
             </h3>
             <div className="grid grid-cols-1 gap-2">
                 {mockVoices.filter(v => lang === 'EN' ? v.lang === 'EN' : true).map(voice => (
                    <button
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedVoice === voice.id ? 'bg-studio-accent/20 border-studio-accent' : 'bg-studio-900/50 border-white/5 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedVoice === voice.id ? 'bg-studio-accent text-white' : 'bg-gray-800 text-gray-400'}`}>
                              {voice.gender === 'Male' ? 'M' : 'F'}
                           </div>
                           <div className="text-left">
                              <div className="text-sm font-bold text-white">{voice.name}</div>
                              <div className="text-[10px] text-gray-500">{voice.style}</div>
                           </div>
                        </div>
                        {selectedVoice === voice.id && <CheckCircle2 size={16} className="text-studio-accent" />}
                    </button>
                 ))}
             </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editor */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        
        {/* Header Action Bar */}
        <div className="flex justify-between items-center bg-studio-900/50 p-2 rounded-xl border border-white/5">
             <div className="flex gap-2">
                 {['Excited', 'Professional', 'Storyteller', 'Satire'].map(tone => (
                    <button
                       key={tone}
                       onClick={() => setScriptTone(tone as any)}
                       className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${scriptTone === tone ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                       {tone}
                    </button>
                 ))}
             </div>
             <button 
               onClick={() => runAnalysis(project.id)} 
               disabled={isProcessing}
               className="flex items-center gap-2 px-4 py-1.5 bg-studio-800 hover:bg-studio-700 rounded-lg text-xs font-bold text-white transition-colors border border-white/10"
             >
                <RefreshCw size={12} className={isProcessing ? 'animate-spin' : ''} />
                {lang === 'EN' ? 'AI Re-Write' : 'Viết lại bằng AI'}
             </button>
        </div>

        {/* Script Editor Segments */}
        <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col overflow-y-auto hide-scrollbar relative">
             {isProcessing && (
                <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Loader2 size={48} className="text-studio-neon animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-white animate-pulse">{stage}</h3>
                </div>
             )}

             <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileCode size={18} className="text-studio-neon" /> Script & Structure</h3>
             
             <div className="space-y-4 mb-6">
                <div className="bg-studio-900/50 p-3 rounded-xl border border-white/5 border-l-4 border-l-red-500">
                   <label className="text-[10px] text-red-400 uppercase font-bold mb-1 block">The Hook (0-3s)</label>
                   <textarea 
                     className="w-full bg-transparent text-lg font-bold text-white focus:outline-none resize-none h-16 leading-tight"
                     value={scriptStructure.hook}
                     onChange={(e) => setScriptStructure({...scriptStructure, hook: e.target.value})}
                     placeholder="Grab attention immediately..."
                   />
                </div>

                <div className="bg-studio-900/50 p-3 rounded-xl border border-white/5 border-l-4 border-l-blue-500">
                   <label className="text-[10px] text-blue-400 uppercase font-bold mb-1 block">The Body / Value (3-45s)</label>
                   <textarea 
                     className="w-full bg-transparent text-sm text-gray-200 focus:outline-none resize-none h-32 leading-relaxed"
                     value={scriptStructure.body}
                     onChange={(e) => setScriptStructure({...scriptStructure, body: e.target.value})}
                     placeholder="Deliver the main content..."
                   />
                </div>

                <div className="bg-studio-900/50 p-3 rounded-xl border border-white/5 border-l-4 border-l-green-500">
                   <label className="text-[10px] text-green-400 uppercase font-bold mb-1 block">Call to Action (45-60s)</label>
                   <textarea 
                     className="w-full bg-transparent text-sm font-bold text-white focus:outline-none resize-none h-12 leading-tight"
                     value={scriptStructure.cta}
                     onChange={(e) => setScriptStructure({...scriptStructure, cta: e.target.value})}
                     placeholder="Tell them what to do next..."
                   />
                </div>
             </div>

             <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-purple-400" /> Visual Prompt Engineering</h3>
             <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex-1">
                 <textarea 
                     className="w-full h-full bg-transparent text-sm font-mono text-purple-200 focus:outline-none resize-none"
                     value={localPrompt}
                     onChange={(e) => setLocalPrompt(e.target.value)}
                 />
             </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2">
            <button 
               onClick={handleGenerate}
               disabled={isProcessing}
               className="bg-gradient-to-r from-studio-accent to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/40 flex items-center gap-3 transform transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
               <Zap size={20} className="text-yellow-300 fill-yellow-300" />
               {lang === 'EN' ? 'Generate Video' : 'Tạo Video'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default Analysis;