
import React from 'react';
import { Language } from '../types';
import { Check, Clock, XCircle, Trash2, Loader, AlertTriangle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface NotificationsProps {
  lang: Language;
}

const Notifications: React.FC<NotificationsProps> = ({ lang }) => {
  const { notifications, removeNotification, addNotification } = useStudio();
  const t = translations[lang].notifications;

  const handleClearAll = () => {
    notifications.forEach(n => removeNotification(n.id));
    addNotification({ title: 'System', message: t.cleared, type: 'info', time: 'Now' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        {notifications.length > 0 && (
            <button onClick={handleClearAll} className="text-xs text-gray-400 hover:text-white underline">{t.clear_all}</button>
        )}
      </header>

      <div className="space-y-3">
        {notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-500 glass-panel rounded-xl">
               <Clock size={24} className="opacity-50 mb-2" />
               <p>{t.empty}</p>
           </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`glass-panel p-4 rounded-xl flex gap-4 items-start transition-all hover:bg-white/5 ${notif.read ? 'opacity-70' : 'border-l-4 border-l-studio-accent'}`}>
              <div className={`mt-1 p-1 rounded-full ${
                notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                notif.type === 'process' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {notif.type === 'success' ? <Check size={16} /> : 
                 notif.type === 'error' ? <XCircle size={16} /> : 
                 notif.type === 'process' ? <Loader size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                <span className="text-xs text-gray-600 mt-2 block">{notif.time}</span>
              </div>
              <button onClick={() => removeNotification(notif.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
