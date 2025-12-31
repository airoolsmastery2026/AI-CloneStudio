import React from 'react';
import { Language } from '../types';
import { ArrowRight, Search, FileText, Wand2, Video, Flame, Upload, Link, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingProps {
  lang: Language;
}

const Onboarding: React.FC<OnboardingProps> = ({ lang }) => {
  const navigate = useNavigate();

  const workflows = [
    { 
      id: 'viral',
      icon: Flame, 
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      path: '/viral',
      title: lang === 'EN' ? 'Clone Viral Trends' : 'Sao chép Xu hướng Viral', 
      desc: lang === 'EN' ? 'AI hunts high-performing videos to remix immediately.' : 'AI săn lùng video hiệu suất cao để phối lại ngay lập tức.' 
    },
    { 
      id: 'url',
      icon: Link, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      path: '/create',
      title: lang === 'EN' ? 'Import from URL' : 'Nhập từ Đường dẫn', 
      desc: lang === 'EN' ? 'Paste a YouTube/TikTok link to analyze and rewrite.' : 'Dán link YouTube/TikTok để phân tích và viết lại.' 
    },
    { 
      id: 'upload',
      icon: Upload, 
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      path: '/create',
      title: lang === 'EN' ? 'Upload Source File' : 'Tải lên Tệp nguồn', 
      desc: lang === 'EN' ? 'Use your own footage as a base for AI generation.' : 'Sử dụng cảnh quay của bạn làm cơ sở để AI tạo video.' 
    },
    { 
      id: 'dashboard',
      icon: Zap, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      path: '/dashboard',
      title: lang === 'EN' ? 'Go to Dashboard' : 'Vào Bảng điều khiển', 
      desc: lang === 'EN' ? 'Manage existing projects and monitor progress.' : 'Quản lý các dự án hiện có và theo dõi tiến độ.' 
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-500">
      <div className="mb-12 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-studio-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
          AI CLONE STUDIO
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
          {lang === 'EN' 
            ? 'Select a workflow to begin automation.'
            : 'Chọn một quy trình để bắt đầu tự động hóa.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {workflows.map((flow) => (
          <button 
            key={flow.id}
            onClick={() => navigate(flow.path)}
            className="group relative glass-panel p-8 rounded-3xl text-left transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-studio-accent/50 border border-transparent"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${flow.bg} ${flow.color} shadow-lg shadow-black/20`}>
                <flow.icon size={32} />
              </div>
              <div className="bg-white/5 rounded-full p-2 text-gray-500 group-hover:text-white group-hover:bg-studio-accent transition-all transform group-hover:rotate-[-45deg]">
                <ArrowRight size={20} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-studio-accent transition-colors">
              {flow.title}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
              {flow.desc}
            </p>
          </button>
        ))}
      </div>

      <footer className="mt-16 text-sm text-gray-500 flex items-center gap-6">
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Veo3 Engine Ready</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sora2 Engine Ready</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Grok Trends Active</span>
      </footer>
    </div>
  );
};

export default Onboarding;