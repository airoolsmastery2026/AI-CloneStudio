
import React, { useState } from 'react';
import { Language, ViralVideo, ProjectStatus, VideoProject } from '../types';
import { TrendingUp, Copy, ExternalLink, Play, Hash, RefreshCw, Radio, BarChart2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';

interface ViralTrendsProps {
  lang: Language;
}

const ViralTrends: React.FC<ViralTrendsProps> = ({ lang }) => {
  const { addProject, addNotification } = useStudio();
  const navigate = useNavigate();
  const t = translations[lang].viral;
  const [isScanning, setIsScanning] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'All' | 'TikTok' | 'YouTube' | 'Facebook'>('All');

  const [trends, setTrends] = useState<(ViralVideo & { videoUrl?: string, growth?: string })[]>([
    { 
      id: '1', 
      title: 'AI Gadgets 2024', 
      views: '2.4M', 
      viralScore: 98, 
      thumbnail: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', 
      platform: 'TikTok', 
      description: 'Tech review format with fast cuts.', 
      url: 'https://tiktok.com/ai-gadgets',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      growth: '+120% / hr'
    },
    { 
      id: '2', 
      title: 'Cinematic Travel Vlog', 
      views: '1.1M', 
      viralScore: 92, 
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', 
      platform: 'YouTube', 
      description: 'Cinematic B-roll with deep voiceover.', 
      url: 'https://youtube.com/travel-vlog',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      growth: '+45% / hr'
    },
  ]);

  const filteredTrends = activePlatform === 'All' ? trends : trends.filter(t => t.platform === activePlatform);
  const topics = ['#AIRevolution', '#SatisfyingCleanup', '#StreetFood', '#CryptoNews', '#FitnessChallenge'];

  const handleClone = (video: any) => {
    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: `Clone: ${video.title}`,
      thumbnail: video.thumbnail,
      status: ProjectStatus.QUEUED,
      progress: 0,
      engine: 'Grok',
      date: lang === 'VN' ? 'Vừa xong' : 'Just now',
      sourceUrl: video.url,
      videoUrl: video.videoUrl,
      targetLanguage: lang === 'VN' ? 'Tiếng Việt' : 'Tiếng Anh'
    };
    
    addProject(newProject);
    navigate(`/analysis/${newProject.id}`);
  };

  const handleAutoScan = () => {
    setIsScanning(true);
    addNotification({ title: lang === 'VN' ? 'Đang Quét AI' : 'AI Scanning', message: t.scan_started, type: 'process', time: 'Now' });
    
    setTimeout(() => {
      const newVideo: ViralVideo & { videoUrl?: string, growth?: string } = {
        id: Date.now().toString(),
        title: 'New Trend Discovered #' + Math.floor(Math.random() * 100),
        views: '100K+',
        viralScore: 99,
        thumbnail: 'https://picsum.photos/400/225?random=' + Date.now(),
        platform: 'TikTok',
        description: 'Emerging trend identified by Grok.',
        url: 'https://tiktok.com/new-trend',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        growth: '+500% / hr'
      };
      
      setTrends(prev => [newVideo, ...prev]);
      setIsScanning(false);
      addNotification({ title: lang === 'VN' ? 'Quét Hoàn Tất' : 'Scan Complete', message: t.scan_complete, type: 'success', time: 'Now' });
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <TrendingUp className="text-studio-neon" /> 
             {t.title}
           </h2>
           <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            onClick={handleAutoScan}
            disabled={isScanning}
            className={`bg-studio-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:bg-studio-accentHover transition-all ${isScanning ? 'animate-pulse' : ''}`}
          >
             {isScanning ? <RefreshCw size={16} className="animate-spin"/> : <Radio size={16} />}
             {isScanning ? t.scanning : t.auto_scan}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-2 bg-studio-900/50 p-1.5 rounded-xl border border-white/5">
            {['All', 'TikTok', 'YouTube', 'Facebook'].map(p => (
               <button
                  key={p}
                  onClick={() => setActivePlatform(p as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activePlatform === p ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
               >
                  {p === 'All' ? t.platform_all : p}
               </button>
            ))}
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar max-w-full">
             {topics.map(topic => (
                <button key={topic} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white transition-colors whitespace-nowrap">
                   <Hash size={12} className="text-studio-accent" />
                   {topic.replace('#', '')}
                </button>
             ))}
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrends.map((video) => (
          <div key={video.id} className="glass-panel rounded-2xl overflow-hidden group hover:border-studio-accent transition-all duration-300 flex flex-col h-full">
            <div className="relative aspect-[9/16] overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-60"></div>
              <div className="absolute top-3 left-3 flex gap-2">
                 <div className={`px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 backdrop-blur-md ${video.platform === 'TikTok' ? 'bg-black' : video.platform === 'YouTube' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {video.platform}
                 </div>
              </div>
              <div className="absolute top-3 right-3">
                 <div className="flex items-center gap-1 bg-studio-neon text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/20">
                    <TrendingUp size={10} /> {video.viralScore}
                 </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button className="bg-white/20 backdrop-blur-md text-white rounded-full w-14 h-14 flex items-center justify-center hover:bg-studio-accent hover:scale-110 transition-all shadow-xl border border-white/30">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                 <div>
                    <div className="text-2xl font-bold font-display">{video.views}</div>
                    <div className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                       <BarChart2 size={10} /> {video.growth || '+20%'}
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1 gap-3 bg-studio-900/40">
              <div>
                 <h3 className="text-white font-bold truncate text-lg mb-1">{video.title}</h3>
                 <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{video.description}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-white/5 flex gap-2">
                 <button 
                  onClick={() => handleClone(video)}
                  className="flex-1 bg-gradient-to-r from-studio-accent to-purple-600 hover:from-studio-accentHover hover:to-purple-500 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                   <Copy size={14} /> {t.clone_now}
                 </button>
                 <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white border border-white/5 hover:border-white/20 transition-all">
                   <ExternalLink size={16} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViralTrends;
