
import React, { useEffect, useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, ProjectStatus, VideoProject, ScriptStructure } from '../types';
import { FileCode, RefreshCw, Loader2, Zap, UploadCloud, ImageIcon, Sparkles, Languages } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

const Analysis: React.FC<{ lang: Language }> = ({ lang }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, addNotification, deductCredits } = useStudio();
  const t = translations[lang].analysis;
  
  const [project, setProject] = useState<VideoProject | null>(null);
  const [scriptStructure, setScriptStructure] = useState<ScriptStructure>({ hook: '', body: '', cta: '' });
  const [localPrompt, setLocalPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState('');
  const [tone, setTone] = useState(lang === 'VN' ? 'Hào hứng' : 'Exciting');
  const [style, setStyle] = useState(lang === 'VN' ? 'Điện ảnh' : 'Cinematic');

  useEffect(() => {
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      if (found) {
        setProject(found);
        if (found.scriptStructure) setScriptStructure(found.scriptStructure);
        if (found.optimizedPrompt) setLocalPrompt(found.optimizedPrompt);
        if (found.status === ProjectStatus.QUEUED) runSmartAnalysis(found);
      }
    }
  }, [projectId, projects]);

  const runSmartAnalysis = async (currentProject: VideoProject) => {
    setIsProcessing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      setStage(t.thinking_01);
      updateProject(currentProject.id, { status: ProjectStatus.ANALYZING });

      const scriptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a viral content expert. Analyze project: "${currentProject.title}". 
        REQUIREMENT: Generate script in ${currentProject.targetLanguage} with ${tone} tone. 
        Structure:
        1. Hook (Explosive first 3s)
        2. Body (Core value)
        3. CTA (Strong call to action).
        Return raw JSON only.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING }
            },
            required: ["hook", "body", "cta"]
          }
        }
      });

      const scriptData = JSON.parse(scriptResponse.text || '{}');
      setScriptStructure(scriptData);

      setStage(t.thinking_02);
      updateProject(currentProject.id, { status: ProjectStatus.PROMPTING });

      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this script: "${scriptData.body}", write a detailed visual prompt (in English) for AI Video Generator. 
        Style: ${style}. Include lighting, camera angles, motion and cinematic quality.`,
      });

      const finalPrompt = promptResponse.text || '';
      setLocalPrompt(finalPrompt);

      updateProject(currentProject.id, { 
        status: ProjectStatus.WRITING,
        scriptStructure: scriptData, 
        optimizedPrompt: finalPrompt 
      });

      addNotification({ title: 'AI Ready', message: lang === 'VN' ? 'Kịch bản đã hoàn thành.' : 'Neural script is optimized.', type: 'success', time: 'Now' });
    } catch (error) {
      console.error(error);
      addNotification({ title: 'AI Error', message: 'Failed to access Gemini system.', type: 'error', time: 'Now' });
      updateProject(currentProject.id, { status: ProjectStatus.FAILED });
    } finally {
      setIsProcessing(false);
      setStage('');
    }
  };

  const handleStartGeneration = () => {
    if (!project) return;
    deductCredits(25);
    updateProject(project.id, {
      status: ProjectStatus.GENERATING,
      scriptStructure: scriptStructure,
      optimizedPrompt: localPrompt,
      progress: 0
    });
    addNotification({ title: 'Rendering Started', message: 'Data pushed to GPU Cluster.', type: 'process', time: 'Now' });
    navigate('/dashboard');
  };

  if (!project) return <div className="p-20 text-center text-gray-500 animate-pulse font-display">{t.init_space}</div>;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col xl:flex-row gap-6 animate-in slide-in-from-right duration-500">
      <div className="xl:w-80 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm"><Sparkles size={14} className="text-studio-neon" /> {t.neural_config}</h3>
          <div className="space-y-5">
             <div className="bg-studio-900/50 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-studio-accent font-bold uppercase tracking-widest block mb-2">{t.target_lang}</span>
                <div className="flex items-center gap-2 text-white font-bold">
                    <Languages size={14} /> {project.targetLanguage}
                </div>
             </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{t.tone}</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-studio-accent outline-none">
                {lang === 'VN' ? (
                  <>
                    <option>Hào hứng</option><option>Chuyên nghiệp</option><option>Kể chuyện sâu sắc</option><option>Hài hước</option>
                  </>
                ) : (
                  <>
                    <option>Exciting</option><option>Professional</option><option>Storytelling</option><option>Humorous</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{t.style}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-studio-accent outline-none">
                {lang === 'VN' ? (
                  <>
                    <option>Điện ảnh</option><option>Anime 4K</option><option>Cyberpunk</option><option>Tối giản (Minimalist)</option>
                  </>
                ) : (
                  <>
                    <option>Cinematic</option><option>Anime 4K</option><option>Cyberpunk</option><option>Minimalist</option>
                  </>
                )}
              </select>
            </div>
            <button onClick={() => runSmartAnalysis(project)} className="w-full py-3 bg-white/5 hover:bg-studio-accent hover:text-white rounded-xl text-xs font-bold text-gray-400 transition-all flex items-center justify-center gap-2 border border-white/10">
               <RefreshCw size={12} /> {t.rebuild}
            </button>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex-1 flex flex-col items-center justify-center text-center">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm"><ImageIcon size={14} className="text-blue-400" /> {t.style_clone}</h3>
          <div className="border-2 border-dashed border-white/10 rounded-3xl aspect-square w-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all p-4">
            <UploadCloud size={32} className="text-gray-700 mb-2" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{t.upload_dna}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex flex-col items-center justify-center rounded-[2rem] border border-white/10">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-studio-accent/20 border-t-studio-accent rounded-full animate-spin"></div>
                <Zap size={32} className="absolute inset-0 m-auto text-studio-accent animate-pulse" />
            </div>
            <p className="mt-6 text-xl font-display font-bold text-white tracking-widest uppercase animate-pulse">{stage}</p>
          </div>
        )}

        <div className="glass-panel p-8 rounded-[2rem] flex-1 flex flex-col gap-8 overflow-y-auto">
          <header className="flex justify-between items-center">
             <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3"><FileCode size={24} className="text-studio-neon" /> {t.strategy_blueprint}</h2>
             <div className="px-4 py-1.5 bg-studio-success/10 text-studio-success text-[10px] font-bold rounded-full uppercase tracking-[0.2em] border border-studio-success/20">AI Verified</div>
          </header>

          <div className="space-y-6">
            <div className="bg-studio-900/80 p-6 rounded-2xl border border-white/5 group hover:border-studio-accent/30 transition-all">
              <span className="text-[10px] text-red-500 font-black block mb-3 uppercase tracking-[0.3em]">{t.phase_01}</span>
              <textarea className="w-full bg-transparent text-white font-bold text-lg resize-none h-16 focus:outline-none leading-tight" value={scriptStructure.hook} onChange={(e) => setScriptStructure({...scriptStructure, hook: e.target.value})} />
            </div>
            <div className="bg-studio-900/80 p-6 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
              <span className="text-[10px] text-blue-500 font-black block mb-3 uppercase tracking-[0.3em]">{t.phase_02}</span>
              <textarea className="w-full bg-transparent text-gray-300 text-base resize-none h-40 focus:outline-none leading-relaxed" value={scriptStructure.body} onChange={(e) => setScriptStructure({...scriptStructure, body: e.target.value})} />
            </div>
            <div className="bg-studio-900/80 p-6 rounded-2xl border border-white/5 group hover:border-green-500/30 transition-all">
              <span className="text-[10px] text-green-500 font-black block mb-3 uppercase tracking-[0.3em]">{t.phase_03}</span>
              <textarea className="w-full bg-transparent text-white font-bold text-lg resize-none h-16 focus:outline-none leading-tight" value={scriptStructure.cta} onChange={(e) => setScriptStructure({...scriptStructure, cta: e.target.value})} />
            </div>
          </div>

          <div className="bg-studio-900/90 p-6 rounded-2xl border border-purple-500/20 mt-auto">
            <span className="text-[10px] text-purple-400 font-black block mb-3 uppercase tracking-[0.3em]">{t.prompt_engine}</span>
            <textarea className="w-full bg-transparent text-xs font-mono text-purple-200 resize-none h-24 focus:outline-none leading-normal" value={localPrompt} onChange={(e) => setLocalPrompt(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-2">
           <button onClick={() => navigate('/dashboard')} className="px-8 py-4 text-gray-500 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">{t.cancel}</button>
           <button onClick={handleStartGeneration} className="bg-white text-black hover:bg-studio-accent hover:text-white px-12 py-5 rounded-2xl font-black shadow-2xl flex items-center gap-3 transform transition-all active:scale-95 uppercase tracking-tighter text-sm">
              <Zap size={20} className="fill-current" /> {t.deploy}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
