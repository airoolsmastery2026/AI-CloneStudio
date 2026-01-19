import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, ProjectStatus, VideoProject, ScriptStructure, VoiceConfig } from '../types';
import { Play, FileCode, CheckCircle2, RefreshCw, Loader2, Zap, Layers, Mic, UploadCloud, ImageIcon, Sparkles } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

const Analysis: React.FC<{ lang: Language }> = ({ lang }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, addNotification, deductCredits, playVideo } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [project, setProject] = useState<VideoProject | null>(null);
  const [scriptStructure, setScriptStructure] = useState<ScriptStructure>({ hook: '', body: '', cta: '' });
  const [localPrompt, setLocalPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState('');
  const [tone, setTone] = useState('Excited');
  const [style, setStyle] = useState('Cinematic');

  useEffect(() => {
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      if (found) {
        setProject(found);
        if (found.scriptStructure) setScriptStructure(found.scriptStructure);
        setLocalPrompt(found.optimizedPrompt || '');
        if (found.status === ProjectStatus.QUEUED) runSmartAnalysis(found);
      }
    }
  }, [projectId]);

  const runSmartAnalysis = async (currentProject: VideoProject) => {
    setIsProcessing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      // Step 1: Phân tích và viết kịch bản
      setStage(lang === 'EN' ? 'AI Strategizing Content...' : 'AI đang lập chiến lược nội dung...');
      updateProject(currentProject.id, { status: ProjectStatus.ANALYZING });

      const scriptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this video project: "${currentProject.title}". Context: ${currentProject.sourceUrl || 'New creation'}. 
                   Target Tone: ${tone}. Create a viral script split into: 1. Hook (catchy), 2. Body (value), 3. CTA (engagement).
                   Return as JSON with keys: hook, body, cta.`,
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

      // Step 2: Tối ưu hóa Visual Prompt
      setStage(lang === 'EN' ? 'Engineering Visual Prompts...' : 'Đang thiết kế Prompt hình ảnh...');
      updateProject(currentProject.id, { status: ProjectStatus.PROMPTING });

      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this script: ${scriptData.body}, create a highly detailed cinematic video prompt for Veo 3.1. 
                   Style: ${style}. Include lighting, camera angles, and textures. Return only the prompt string.`,
      });

      const finalPrompt = promptResponse.text || '';
      setLocalPrompt(finalPrompt);

      updateProject(currentProject.id, { 
        status: ProjectStatus.ANALYZING, 
        scriptStructure: scriptData, 
        optimizedPrompt: finalPrompt 
      });

      addNotification({ title: 'AI Analysis Finished', message: 'Ready to generate video.', type: 'success', time: 'Now' });
    } catch (error) {
      console.error(error);
      addNotification({ title: 'AI Error', message: 'Failed to reach Gemini servers.', type: 'error', time: 'Now' });
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
    navigate('/dashboard');
  };

  if (!project) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col xl:flex-row gap-6 animate-in slide-in-from-right duration-500">
      {/* Sidebar Controls */}
      <div className="xl:w-80 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="glass-panel p-5 rounded-2xl">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Sparkles size={16} className="text-studio-neon" /> Strategy</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Content Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-lg p-2 text-sm text-white">
                <option>Excited</option>
                <option>Professional</option>
                <option>Storytelling</option>
                <option>Humorous</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Visual Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-studio-900 border border-white/10 rounded-lg p-2 text-sm text-white">
                <option>Cinematic</option>
                <option>Cyberpunk</option>
                <option>Minimalist</option>
                <option>Anime</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex-1">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ImageIcon size={16} className="text-blue-400" /> Reference</h3>
          <div className="border border-dashed border-white/20 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
            <UploadCloud size={32} className="text-gray-600 mb-2" />
            <span className="text-[10px] text-gray-500">Visual DNA Upload</span>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col gap-4 relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-3xl">
            <Loader2 size={48} className="text-studio-accent animate-spin mb-4" />
            <p className="text-xl font-bold text-white animate-pulse">{stage}</p>
          </div>
        )}

        <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col gap-6 overflow-y-auto">
          <header className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileCode size={20} className="text-studio-neon" /> Advanced Scripting</h2>
             <button onClick={() => runSmartAnalysis(project)} className="p-2 bg-studio-800 hover:bg-studio-700 rounded-xl text-studio-accent transition-all">
                <RefreshCw size={18} />
             </button>
          </header>

          <div className="space-y-4">
            <div className="bg-studio-900/50 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-red-500 font-bold block mb-2">HOOK</span>
              <textarea className="w-full bg-transparent text-white font-bold resize-none h-12 focus:outline-none" value={scriptStructure.hook} onChange={(e) => setScriptStructure({...scriptStructure, hook: e.target.value})} />
            </div>
            <div className="bg-studio-900/50 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-blue-500 font-bold block mb-2">BODY CONTENT</span>
              <textarea className="w-full bg-transparent text-gray-300 text-sm resize-none h-32 focus:outline-none leading-relaxed" value={scriptStructure.body} onChange={(e) => setScriptStructure({...scriptStructure, body: e.target.value})} />
            </div>
            <div className="bg-studio-900/50 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-green-500 font-bold block mb-2">CALL TO ACTION</span>
              <textarea className="w-full bg-transparent text-white font-bold resize-none h-12 focus:outline-none" value={scriptStructure.cta} onChange={(e) => setScriptStructure({...scriptStructure, cta: e.target.value})} />
            </div>
          </div>

          <div className="bg-studio-900/80 p-5 rounded-2xl border border-white/10 mt-auto">
            <span className="text-[10px] text-purple-400 font-bold block mb-2 uppercase tracking-widest">Veo 3.1 Neural Prompt</span>
            <textarea className="w-full bg-transparent text-xs font-mono text-purple-200 resize-none h-20 focus:outline-none" value={localPrompt} onChange={(e) => setLocalPrompt(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
           <button onClick={() => navigate('/dashboard')} className="px-6 py-3 text-gray-400 font-bold hover:text-white">Cancel</button>
           <button onClick={handleStartGeneration} className="bg-studio-accent hover:bg-studio-accentHover text-white px-10 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/30 flex items-center gap-2 transform transition-all active:scale-95">
              <Zap size={18} className="fill-white" /> Start Neural Render
           </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;