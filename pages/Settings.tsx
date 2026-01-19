
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Palette, Save, Eye, EyeOff, Film, Cpu, CloudLightning, Shield, Sliders, Wifi } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface SettingsProps {
  lang: Language;
}

const Settings: React.FC<SettingsProps> = ({ lang }) => {
  const { settings, updateSettings } = useStudio();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showKeys, setShowKeys] = useState(false);
  const t = translations[lang].settings;
  const [activeTab, setActiveTab] = useState<'rendering' | 'api' | 'automation' | 'general'>('rendering');
  const [apiStatus, setApiStatus] = useState<Record<string, string>>({
    Veo3: t.checking, Sora2: t.checking, KlingAI: t.checking, Grok: t.checking
  });

  useEffect(() => {
    const checkConnection = () => {
        setTimeout(() => {
            setApiStatus({
                Veo3: localSettings.veoKey ? t.connected : t.disconnected,
                Sora2: localSettings.soraKey ? t.connected : t.disconnected,
                KlingAI: localSettings.klingKey ? t.connected : t.disconnected,
                Grok: localSettings.grokKey ? t.connected : t.disconnected
            });
        }, 1500);
    };
    checkConnection();
  }, [localSettings.veoKey, localSettings.soraKey, localSettings.klingKey, localSettings.grokKey, t]);

  const handleChange = (field: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'rendering', label: t.tab_rendering, icon: Cpu },
    { id: 'api', label: t.tab_api, icon: CloudLightning },
    { id: 'automation', label: t.tab_automation, icon: Wifi },
    { id: 'general', label: t.tab_general, icon: Palette },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-20">
      <div className="lg:w-64 shrink-0 space-y-2">
         <h2 className="text-2xl font-bold text-white mb-6 px-2">{t.title}</h2>
         {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-studio-accent text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <tab.icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
            </button>
         ))}
      </div>

      <div className="flex-1 space-y-6">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-xl font-bold text-white">{tabs.find(t_ => t_.id === activeTab)?.label}</h3>
               <p className="text-sm text-gray-400">{t.subtitle}</p>
            </div>
            <button onClick={() => updateSettings(localSettings)} className="bg-studio-success hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 text-sm">
                <Save size={16} /> {t.save_btn}
            </button>
         </div>

         {activeTab === 'rendering' && (
            <>
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Film size={18} className="text-studio-neon" /> {t.video_config}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">{t.resolution}</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['720p', '1080p', '2K', '4K'].map(res => (
                                <button key={res} onClick={() => handleChange('defaultResolution', res)} className={`py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.defaultResolution === res ? 'bg-studio-accent border-studio-accent text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>{res}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">{t.aspect_ratio}</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['16:9', '9:16', '1:1', '21:9'].map(ratio => (
                                <button key={ratio} onClick={() => handleChange('defaultAspectRatio', ratio)} className={`py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.defaultAspectRatio === ratio ? 'bg-studio-accent border-studio-accent text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>{ratio}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Sliders size={18} className="text-blue-400" /> {t.ai_behavior}</h4>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm text-gray-400">{t.creativity}</label>
                            <span className="text-sm font-mono text-studio-accent">{localSettings.creativityLevel}</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" value={localSettings.creativityLevel} onChange={(e) => handleChange('creativityLevel', parseFloat(e.target.value))} className="w-full h-2 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-studio-accent" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">{t.safety}</label>
                        <div className="flex gap-4">
                            {[
                                { id: 'Strict', label: t.safety_strict },
                                { id: 'Moderate', label: t.safety_moderate },
                                { id: 'Off', label: t.safety_off }
                            ].map(mode => (
                                <div key={mode.id} onClick={() => handleChange('safetyFilter', mode.id)} className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center gap-2 ${localSettings.safetyFilter === mode.id ? 'bg-studio-accent/10 border-studio-accent text-white' : 'bg-studio-900 border-white/5 text-gray-500'}`}>
                                    <Shield size={16} /> <span className="text-xs font-bold">{mode.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </>
         )}

         {activeTab === 'api' && (
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-white font-bold flex items-center gap-2"><CloudLightning size={18} className="text-yellow-400" /> {t.api_gate}</h4>
                    <button onClick={() => setShowKeys(!showKeys)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                        {showKeys ? <EyeOff size={14} /> : <Eye size={14} />} {showKeys ? t.hide_keys : t.show_keys}
                    </button>
                </div>
                <div className="space-y-4">
                    {['Veo3', 'Sora2', 'Grok'].map((api) => (
                        <div key={api} className="bg-studio-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white">{api}</span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${apiStatus[api] === t.connected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{apiStatus[api]}</span>
                            </div>
                            <input type={showKeys ? "text" : "password"} placeholder={`API Key for ${api}...`} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-studio-accent font-mono" />
                        </div>
                    ))}
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default Settings;
