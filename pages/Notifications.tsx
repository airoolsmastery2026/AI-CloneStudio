import React from 'react';
import { Language } from '../types';
import { Check, Clock, XCircle, Trash2, Loader, Play, Pause, X, AlertTriangle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface NotificationsProps {
  lang: Language;
}

const Notifications: React.FC<NotificationsProps> = ({ lang }) => {
  const { notifications, removeNotification, addNotification } = useStudio();

  const handleClearAll = () => {
    // In a real app, this would iterate or call a clearAll endpoint
    // For now we assume the user clears individually, or we can mock it
    notifications.forEach(n => removeNotification(n.id));
    addNotification({ title: 'Cleared', message: 'All notifications removed.', type: 'info', time: 'Now' });
  };

  const handleAction = (type: string, id: string) => {
     // Mocking action handling
     if (type === 'pause') addNotification({ title: 'Paused', message: 'Task paused successfully.', type: 'info', time: 'Now' });
     if (type === 'cancel') {
        removeNotification(id);
        addNotification({ title: 'Cancelled', message: 'Task cancelled and removed.', type: 'error', time: 'Now' });
     }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{lang === 'EN' ? 'Notifications' : 'Thông báo'}</h2>
        {notifications.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-white underline"
            >
            {lang === 'EN' ? 'Clear All' : 'Xóa tất cả'}
            </button>
        )}
      </header>

      <div className="space-y-3">
        {notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-500 glass-panel rounded-xl">
               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                   <Clock size={24} className="opacity-50" />
               </div>
               <p>{lang === 'EN' ? 'No new notifications' : 'Không có thông báo mới'}</p>
           </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`glass-panel p-4 rounded-xl flex gap-4 items-start transition-all hover:bg-white/5 ${notif.read ? 'opacity-70' : 'border-l-4 border-l-studio-accent'}`}
            >
              <div className={`mt-1 p-1 rounded-full ${
                notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                notif.type === 'process' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {notif.type === 'success' ? <Check size={16} /> : 
                 notif.type === 'error' ? <XCircle size={16} /> : 
                 notif.type === 'process' ? <Loader size={16} className="animate-spin" /> :
                 <AlertTriangle size={16} />}
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                <span className="text-xs text-gray-600 mt-2 block">{notif.time}</span>
                
                {/* Progress Bar for Process Type */}
                {notif.type === 'process' && notif.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Processing...</span>
                      <span>{notif.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-studio-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${notif.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                 {notif.type === 'process' && (
                   <div className="flex gap-1 mb-1">
                     <button onClick={() => handleAction('pause', notif.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" title="Pause">
                       <Pause size={14} />
                     </button>
                     <button onClick={() => handleAction('resume', notif.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" title="Resume">
                       <Play size={14} />
                     </button>
                     <button onClick={() => handleAction('cancel', notif.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400" title="Cancel">
                       <X size={14} />
                     </button>
                   </div>
                 )}
                 <button 
                    onClick={() => removeNotification(notif.id)}
                    className="self-end text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Remove"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;