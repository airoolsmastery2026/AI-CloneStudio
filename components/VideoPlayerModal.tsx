import React, { useRef, useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

const VideoPlayerModal: React.FC = () => {
  const { activeVideoId, closeVideo, projects } = useStudio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when video opens
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setHasError(false);
  }, [activeVideoId]);

  if (!activeVideoId) return null;

  const project = projects.find(p => p.id === activeVideoId);
  if (!project) return null;

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
            console.error("Play failed:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress || 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && !hasError) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const handleError = () => {
    console.warn("Video playback error detected");
    setHasError(true);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-5xl aspect-video bg-black relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
        
        {project.videoUrl && !hasError ? (
          <video 
            key={project.videoUrl} 
            ref={videoRef}
            src={project.videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={handleError}
            playsInline
            loop
            onClick={togglePlay}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 relative">
             <img src={project.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Thumbnail" />
             <div className="z-10 text-center p-6 bg-black/50 rounded-xl backdrop-blur max-w-md mx-4">
                {hasError ? (
                    <>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-white font-bold text-xl mb-2">Playback Error</p>
                        <p className="text-gray-400 mb-4">The video file could not be loaded or is not supported.</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Play className="w-6 h-6 text-white/50" />
                        </div>
                        <p className="text-white font-bold text-xl mb-2">Rendering in progress...</p>
                        <p className="text-gray-400">The video file is not yet available for playback.</p>
                    </>
                )}
             </div>
          </div>
        )}
        
        {/* Custom Video Controls Overlay - Only show if video is playable */}
        {project.videoUrl && !hasError && (
            <div className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex justify-between items-start">
                <div>
                <h3 className="text-xl md:text-2xl font-bold text-white shadow-black drop-shadow-md">{project.title}</h3>
                <span className="text-xs md:text-sm text-gray-200 shadow-black drop-shadow-md">{project.engine} • {project.date}</span>
                </div>
                <button 
                onClick={closeVideo}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                >
                <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Progress Bar */}
                <div 
                    className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress"
                    onClick={handleSeek}
                >
                    <div 
                        className="h-full bg-studio-accent relative transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-studio-accent transition-colors">
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                        </button>
                        
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={toggleMute}>
                            {isMuted ? <VolumeX size={24} className="text-white" /> : <Volume2 size={24} className="text-white" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white border border-white/10">1080P</button>
                        <button className="text-white hover:text-studio-accent transition-colors"><Maximize size={24} /></button>
                    </div>
                </div>
            </div>
            </div>
        )}

        {/* Close Button for Error/Loading State */}
        {(!project.videoUrl || hasError) && (
             <button 
                onClick={closeVideo}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md z-50"
             >
                <X size={24} />
             </button>
        )}

        {/* Center Play Button (Initial/Paused state) */}
        {!isPlaying && !hasError && project.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 shadow-2xl">
                <Play size={40} fill="white" className="text-white" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerModal;