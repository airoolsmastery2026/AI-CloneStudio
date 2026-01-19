
export type Language = 'EN' | 'VN';

export type TargetContentLanguage = 'Tiếng Việt' | 'Tiếng Anh' | 'Tiếng Nhật' | 'Tiếng Hàn' | 'Tiếng Trung' | 'Tiếng Pháp' | 'Tiếng Tây Ban Nha';

export enum ProjectStatus {
  QUEUED = 'QUEUED',
  ANALYZING = 'ANALYZING',
  WRITING = 'WRITING',
  PROMPTING = 'PROMPTING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ScriptStructure {
  hook: string;
  body: string;
  cta: string;
}

export interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  status: ProjectStatus;
  progress: number;
  engine: 'Veo3' | 'Sora2' | 'KlingAI' | 'Grok';
  date: string;
  sourceUrl?: string;
  script?: string;
  scriptStructure?: ScriptStructure;
  optimizedPrompt?: string;
  targetLanguage: TargetContentLanguage;
  duration?: string;
  voiceId?: string;
}

export type BatchTemplateId = 'gameplay_split' | 'fake_podcast' | 'cinematic_story' | 'news_flash';

export interface BatchJob {
  id: string;
  name: string;
  totalVideos: number;
  processedVideos: number;
  status: 'Đang xử lý' | 'Đã tạm dừng' | 'Đã hoàn thành';
  engine: 'Veo3' | 'Sora2' | 'KlingAI' | 'Grok';
  template?: BatchTemplateId;
}

export interface ViralVideo {
  id: string;
  title: string;
  views: string;
  viralScore: number;
  thumbnail: string;
  platform: 'TikTok' | 'YouTube' | 'Facebook';
  description: string;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  time: string;
  read: boolean;
  progress?: number;
}

export interface UserSettings {
  veoKey: string;
  soraKey: string;
  klingKey: string;
  grokKey: string;
  uiTheme: 'matte' | 'metallic' | 'multipolar';
  contentLanguage: Language | 'Auto';
  defaultAspectRatio: '16:9' | '9:16' | '1:1';
  defaultResolution: '720p' | '1080p' | '2K' | '4K';
  defaultFrameRate: '30fps' | '60fps';
  outputFormat: 'MP4' | 'MOV';
  renderQuality: 'High' | 'Ultra';
  creativityLevel: number;
  safetyFilter: 'Strict' | 'Moderate' | 'Off';
  downloadPath: string;
  autoDownload: boolean;
  autoPostTikTok: boolean;
  autoPostYoutube: boolean;
}

export interface UserProfile {
  name: string;
  plan: 'Miễn phí' | 'Cá nhân' | 'Doanh nghiệp';
  avatar: string;
  email: string;
}

export interface StudioContextType {
  projects: VideoProject[];
  addProject: (project: VideoProject) => void;
  updateProject: (id: string, updates: Partial<VideoProject>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  userCredits: number;
  deductCredits: (amount: number) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  batches: BatchJob[];
  addBatch: (name: string, count: number, engine: any, template?: BatchTemplateId) => void;
  toggleBatchStatus: (id: string) => void;
  removeBatch: (id: string) => void;
  activeVideoId: string | null;
  playVideo: (id: string) => void;
  closeVideo: () => void;
}
