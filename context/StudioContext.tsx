
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudioContextType, VideoProject, Notification, UserSettings, ProjectStatus, UserProfile, BatchJob, BatchTemplateId } from '../types';

const defaultSettings: UserSettings = {
  veoKey: '',
  soraKey: '',
  klingKey: '',
  grokKey: '',
  uiTheme: 'multipolar',
  contentLanguage: 'Auto',
  defaultAspectRatio: '9:16',
  defaultResolution: '1080p',
  defaultFrameRate: '30fps',
  outputFormat: 'MP4',
  renderQuality: 'High',
  creativityLevel: 0.7,
  safetyFilter: 'Moderate',
  downloadPath: '/Downloads/StudioAI',
  autoDownload: false,
  autoPostTikTok: false,
  autoPostYoutube: false,
};

const StudioContext = createContext<StudioContextType & { removeNotification: (id: string) => void } | undefined>(undefined);

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within a StudioProvider');
  return context;
};

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    const saved = localStorage.getItem('studio_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('studio_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem('studio_credits');
    return saved ? parseInt(saved) : 5000;
  });
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studio_user');
    return saved ? JSON.parse(saved) : {
      name: 'Nhà sáng tạo AI',
      plan: 'Cá nhân',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Production',
      email: 'alex@studio.ai'
    };
  });

  const [batches, setBatches] = useState<BatchJob[]>(() => {
    const saved = localStorage.getItem('studio_batches');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('studio_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('studio_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('studio_credits', userCredits.toString()); }, [userCredits]);
  useEffect(() => { localStorage.setItem('studio_batches', JSON.stringify(batches)); }, [batches]);

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = { ...notif, id: Date.now().toString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const addProject = (project: VideoProject) => setProjects(prev => [project, ...prev]);
  const updateProject = (id: string, updates: Partial<VideoProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deductCredits = (amount: number) => setUserCredits(prev => Math.max(0, prev - amount));

  useEffect(() => {
    const batchWorker = setInterval(() => {
      setBatches(prevBatches => {
        let spawnedProjects: VideoProject[] = [];
        // Fix: Explicitly type 'updated' as BatchJob[] to prevent status string widening issues
        const updated: BatchJob[] = prevBatches.map(batch => {
          if (batch.status === 'Đang xử lý' && batch.processedVideos < batch.totalVideos) {
            if (Math.random() > 0.6) {
              const videoNum = batch.processedVideos + 1;
              const isLast = videoNum === batch.totalVideos;
              
              spawnedProjects.push({
                id: `batch-${batch.id}-${videoNum}`,
                title: `${batch.name} #${videoNum}`,
                thumbnail: `https://picsum.photos/400/225?random=${batch.id}${videoNum}`,
                status: ProjectStatus.GENERATING,
                progress: 0,
                engine: batch.engine,
                date: 'Vừa xong',
                duration: '0:15',
                targetLanguage: 'Tiếng Việt'
              });

              return { ...batch, processedVideos: videoNum, status: isLast ? 'Đã hoàn thành' : 'Đang xử lý' };
            }
          }
          return batch;
        });

        if (spawnedProjects.length > 0) {
          setProjects(prev => [...spawnedProjects, ...prev]);
          addNotification({ title: 'Tiến độ Sản xuất', message: `Đã triển khai ${spawnedProjects.length} video mới vào dây chuyền.`, type: 'info', time: 'Bây giờ' });
        }
        return updated;
      });
    }, 4000);
    return () => clearInterval(batchWorker);
  }, []);

  useEffect(() => {
    const renderWorker = setInterval(() => {
      setProjects(prev => {
        let changed = false;
        const next = prev.map(p => {
          if (p.status === ProjectStatus.GENERATING) {
            changed = true;
            const increment = Math.random() * 8 + 2;
            const newProgress = Math.min(100, p.progress + increment);
            const isDone = newProgress >= 100;

            if (isDone) {
              addNotification({ title: 'Video Đã Sẵn Sàng', message: `"${p.title}" đã kết xuất xong.`, type: 'success', time: 'Bây giờ' });
            }

            return { ...p, progress: Math.floor(newProgress), status: isDone ? ProjectStatus.COMPLETED : ProjectStatus.GENERATING, videoUrl: isDone ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : undefined };
          }
          return p;
        });
        return changed ? next : prev;
      });
    }, 2500);
    return () => clearInterval(renderWorker);
  }, []);

  return (
    <StudioContext.Provider value={{
      projects, addProject, updateProject, notifications, addNotification, removeNotification,
      settings, updateSettings: (s) => setSettings(prev => ({ ...prev, ...s })),
      userCredits, deductCredits, user, updateUser: (u) => setUser(prev => ({ ...prev, ...u })),
      batches, 
      addBatch: (name: string, count: number, engine: any, template: BatchTemplateId = 'cinematic_story') => {
        const newBatch: BatchJob = { id: Date.now().toString(), name, totalVideos: count, processedVideos: 0, status: 'Đang xử lý', engine: engine as any, template };
        setBatches(prev => [newBatch, ...prev]);
        addNotification({ title: 'Bắt đầu Mẻ Mới', message: `Dây chuyền "${name}" hiện đã hoạt động.`, type: 'process', time: 'Bây giờ' });
      },
      // Fix: Use explicit type assertion for status literal to satisfy BatchJob interface
      toggleBatchStatus: (id) => setBatches(prev => prev.map(b => b.id === id ? { ...b, status: (b.status === 'Đang xử lý' ? 'Đã tạm dừng' : 'Đang xử lý') as 'Đang xử lý' | 'Đã tạm dừng' } : b)),
      removeBatch: (id) => setBatches(prev => prev.filter(b => b.id !== id)),
      activeVideoId, playVideo: (id) => setActiveVideoId(id), closeVideo: () => setActiveVideoId(null)
    }}>
      {children}
    </StudioContext.Provider>
  );
};
