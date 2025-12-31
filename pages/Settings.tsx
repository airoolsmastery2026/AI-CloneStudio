import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Key, Palette, Save, Eye, EyeOff, Monitor, Film, Ratio, Cpu, Globe, CloudLightning, ToggleLeft, ToggleRight, Wifi, Shield, Sliders } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface SettingsProps {
  lang: Language;
}

const Settings: React.FC<SettingsProps> = ({ lang }) => {
  const { settings, updateSettings, addNotification } = useStudio();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showKeys, setShowKeys] = useState(false);
  const [activeTab, setActiveTab] = useState<'rendering' | 'api' | 'general' | 'automation'>('rendering');
  const [apiStatus, setApiStatus] = useState<Record<string, 'connected' | 'disconnected' | 'checking'>>({
    Veo3: 'checking',
    Sora2: 'checking',
    KlingAI: 'checking',
    Grok: 'checking'
  });

  // Mock API connection check on mount
  useEffect(() => {
    const checkConnection = () => {
        setTimeout(() => {
            setApiStatus({
                Veo3: localSettings.veoKey ? 'connected' : 'disconnected',
                Sora2: localSettings.soraKey ? 'connected' : 'disconnected',
                KlingAI: localSettings.klingKey ? 'connected' : 'disconnected',
                Grok: localSettings.grokKey ? 'connected' : 'disconnected'
            });
        }, 1500);
    };
    checkConnection();
  }, [localSettings.veoKey, localSettings.soraKey, localSettings.klingKey, localSettings.grokKey]);

  const handleChange = (field: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const tabs = [
    { id: 'rendering', label: lang === 'EN' ? 'AI & Rendering' : 'AI & Kết xuất', icon: Cpu },
    { id: 'api', label: lang === 'EN' ? 'API Connections' : 'Kết nối API', icon: CloudLightning },
    { id: 'automation', label: lang === 'EN' ? 'Automation' : 'Tự động hóa', icon: Wifi },
    { id: 'general', label: lang === 'EN' ? 'Interface & System' : 'Giao diện & Hệ thống', icon: Palette },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-20 h-[calc(100vh-100px)]">
      
      {/* Sidebar Navigation for Settings */}
      <div className="lg:w-64 shrink-0 space-y-2">
         <h2 className="text-2xl font-bold text-white mb-6 px-2">Studio Setup</h2>
         {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-studio-accent text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <tab.icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
            </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto hide-scrollbar">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-xl font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h3>
               <p className="text-sm text-gray-400">Configure your studio preferences.</p>
            </div>
            <button 
                onClick={handleSave}
                className="bg-studio-success hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 text-sm"
            >
                <Save size={16} /> Save Changes
            </button>
         </div>

         <div className="space-y-6">
            
            {/* --- TAB: AI & RENDERING --- */}
            {activeTab === 'rendering' && (
                <>
                <div className="glass-panel p-6 rounded-2xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Film size={18} className="text-studio-neon" /> Video Output Config</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Default Resolution</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['720p', '1080p', '2K', '4K'].map(res => (
                                    <button
                                        key={res}
                                        onClick={() => handleChange('defaultResolution', res)}
                                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.defaultResolution === res ? 'bg-studio-accent border-studio-accent text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                    >
                                        {res}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Aspect Ratio</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['16:9', '9:16', '1:1', '21:9'].map(ratio => (
                                    <button
                                        key={ratio}
                                        onClick={() => handleChange('defaultAspectRatio', ratio)}
                                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.defaultAspectRatio === ratio ? 'bg-studio-accent border-studio-accent text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Frame Rate</label>
                            <select 
                                value={localSettings.defaultFrameRate}
                                onChange={(e) => handleChange('defaultFrameRate', e.target.value)}
                                className="w-full bg-studio-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                            >
                                <option value="24fps">24 FPS (Cinematic)</option>
                                <option value="30fps">30 FPS (Standard)</option>
                                <option value="60fps">60 FPS (High Motion)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Format & Quality</label>
                             <div className="flex gap-2">
                                <select 
                                    value={localSettings.outputFormat}
                                    onChange={(e) => handleChange('outputFormat', e.target.value)}
                                    className="flex-1 bg-studio-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                >
                                    <option>MP4</option>
                                    <option>MOV</option>
                                    <option>WEBM</option>
                                </select>
                                <select 
                                    value={localSettings.renderQuality}
                                    onChange={(e) => handleChange('renderQuality', e.target.value)}
                                    className="flex-1 bg-studio-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                >
                                    <option>Draft</option>
                                    <option>Standard</option>
                                    <option>High</option>
                                    <option>Ultra</option>
                                </select>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Sliders size={18} className="text-blue-400" /> AI Behavior Engine</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-gray-400">Creativity Level (Temperature)</label>
                                <span className="text-sm font-mono text-studio-accent">{localSettings.creativityLevel}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="1" step="0.1"
                                value={localSettings.creativityLevel}
                                onChange={(e) => handleChange('creativityLevel', parseFloat(e.target.value))}
                                className="w-full h-2 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-studio-accent"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                <span>Conservative</span>
                                <span>Balanced</span>
                                <span>Experimental</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Content Safety Filter</label>
                            <div className="flex gap-4">
                                {['Strict', 'Moderate', 'Off'].map(mode => (
                                    <div 
                                        key={mode}
                                        onClick={() => handleChange('safetyFilter', mode)}
                                        className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center gap-2 ${localSettings.safetyFilter === mode ? 'bg-studio-accent/10 border-studio-accent text-white' : 'bg-studio-900 border-white/5 text-gray-500'}`}
                                    >
                                        <Shield size={16} />
                                        <span className="text-xs font-bold">{mode}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">
                                * 'Off' mode requires Enterprise verification.
                            </p>
                        </div>
                    </div>
                </div>
                </>
            )}

            {/* --- TAB: API CONNECTIONS --- */}
            {activeTab === 'api' && (
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><CloudLightning size={18} className="text-yellow-400" /> API Gateway</h4>
                        <button onClick={() => setShowKeys(!showKeys)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                            {showKeys ? <EyeOff size={14} /> : <Eye size={14} />} {showKeys ? 'Hide' : 'Show'} Keys
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Veo3', keyProp: 'veoKey', desc: 'Primary Video Generation Engine' },
                            { name: 'Sora2', keyProp: 'soraKey', desc: 'High-Motion Cinematic Engine' },
                            { name: 'KlingAI', keyProp: 'klingKey', desc: 'Character Consistency Engine' },
                            { name: 'Grok', keyProp: 'grokKey', desc: 'Viral Analysis & Scripting' },
                        ].map((api) => (
                            <div key={api.name} className="bg-studio-900/50 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${apiStatus[api.name] === 'connected' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : apiStatus[api.name] === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className="font-bold text-white">{api.name}</span>
                                        <span className="text-xs text-gray-500 hidden sm:inline-block">- {api.desc}</span>
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${apiStatus[api.name] === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {apiStatus[api.name]}
                                    </span>
                                </div>
                                <input 
                                    type={showKeys ? "text" : "password"}
                                    value={(localSettings as any)[api.keyProp]}
                                    onChange={(e) => handleChange(api.keyProp, e.target.value)}
                                    placeholder={`Enter ${api.name} API Key...`}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-studio-accent focus:outline-none font-mono"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB: AUTOMATION --- */}
            {activeTab === 'automation' && (
                <div className="glass-panel p-6 rounded-2xl">
                     <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Wifi size={18} className="text-green-400" /> Auto-Publishing Workflow</h4>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between bg-studio-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Monitor size={20} /></div>
                                <div>
                                    <h5 className="font-bold text-white">Auto-Download</h5>
                                    <p className="text-xs text-gray-500">Save finished projects to local disk immediately.</p>
                                </div>
                            </div>
                            <button onClick={() => handleChange('autoDownload', !localSettings.autoDownload)} className={`text-2xl transition-colors ${localSettings.autoDownload ? 'text-studio-accent' : 'text-gray-600'}`}>
                                {localSettings.autoDownload ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>
                        
                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                            <label className="text-xs text-gray-400 block mb-2">Local Storage Path</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={localSettings.downloadPath}
                                    readOnly
                                    className="flex-1 bg-studio-900 border border-white/10 rounded-lg p-2 text-gray-300 text-sm font-mono"
                                />
                                <button className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-sm">Browse</button>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-4"></div>

                        <div className="flex items-center justify-between bg-studio-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><CloudLightning size={20} /></div>
                                <div>
                                    <h5 className="font-bold text-white">TikTok Auto-Post</h5>
                                    <p className="text-xs text-gray-500">Upload to linked TikTok account upon completion.</p>
                                </div>
                            </div>
                            <button onClick={() => handleChange('autoPostTikTok', !localSettings.autoPostTikTok)} className={`text-2xl transition-colors ${localSettings.autoPostTikTok ? 'text-studio-accent' : 'text-gray-600'}`}>
                                {localSettings.autoPostTikTok ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-studio-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><CloudLightning size={20} /></div>
                                <div>
                                    <h5 className="font-bold text-white">YouTube Shorts Auto-Post</h5>
                                    <p className="text-xs text-gray-500">Upload to linked channel as 'Unlisted'.</p>
                                </div>
                            </div>
                            <button onClick={() => handleChange('autoPostYoutube', !localSettings.autoPostYoutube)} className={`text-2xl transition-colors ${localSettings.autoPostYoutube ? 'text-studio-accent' : 'text-gray-600'}`}>
                                {localSettings.autoPostYoutube ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>
                     </div>
                </div>
            )}

            {/* --- TAB: GENERAL --- */}
            {activeTab === 'general' && (
                <div className="glass-panel p-6 rounded-2xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Palette size={18} className="text-purple-400" /> Appearance & Localization</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-400 block mb-3">UI Theme</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'matte', name: 'Matte Dark', bg: 'bg-[#111]' },
                                    { id: 'metallic', name: 'Metallic Blue', bg: 'bg-gradient-to-br from-slate-800 to-slate-900' },
                                    { id: 'multipolar', name: 'Multipolar', bg: 'bg-gradient-to-r from-purple-900 to-indigo-900' }
                                ].map((theme) => (
                                    <div 
                                        key={theme.id}
                                        onClick={() => handleChange('uiTheme', theme.id)}
                                        className={`border rounded-xl p-4 cursor-pointer relative transition-all ${localSettings.uiTheme === theme.id ? 'border-studio-accent ring-1 ring-studio-accent' : 'border-white/10 hover:border-white/30 bg-studio-900/50'}`}
                                    >
                                        <div className={`w-full h-16 rounded-lg mb-2 ${theme.bg}`}></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">{theme.name}</span>
                                            {localSettings.uiTheme === theme.id && <div className="w-2 h-2 bg-studio-accent rounded-full"></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Content Language</label>
                            <select 
                                value={localSettings.contentLanguage}
                                onChange={(e) => handleChange('contentLanguage', e.target.value)}
                                className="w-full bg-studio-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                            >
                                <option value="Auto">Auto-Detect</option>
                                <option value="EN">English (US)</option>
                                <option value="VN">Tiếng Việt</option>
                            </select>
                            <p className="text-[10px] text-gray-500 mt-2">
                                This controls the default language for generated scripts and captions.
                            </p>
                        </div>
                    </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default Settings;