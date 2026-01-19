
import React, { useState } from 'react';
import { Language } from '../types';
import { User, CreditCard, Shield, Edit2, Save, Crown, Activity, Database } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { translations } from '../translations';

interface ProfileProps {
  lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
  const { user, userCredits, projects, updateUser } = useStudio();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(user.name);
  const t = translations[lang].profile;

  const handleSave = () => {
    updateUser({ name: localName });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 pb-20">
       <div className="glass-panel rounded-[2.5rem] p-8 mb-8 text-center relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-studio-accent via-purple-600 to-indigo-600 opacity-40"></div>
          
          <div className="relative inline-block mt-12 mb-6">
             <div className="w-32 h-32 rounded-full border-4 border-studio-900 overflow-hidden shadow-2xl">
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-studio-success rounded-full border-4 border-studio-900 flex items-center justify-center">
                <Activity size={12} className="text-white" />
             </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
             {isEditing ? (
               <input 
                 className="bg-studio-800 border border-studio-accent rounded-xl px-4 py-2 text-white text-2xl font-bold text-center focus:outline-none shadow-xl"
                 value={localName}
                 onChange={(e) => setLocalName(e.target.value)}
                 autoFocus
               />
             ) : (
               <h2 className="text-3xl font-display font-bold text-white tracking-tight">{user.name}</h2>
             )}
             <button 
               onClick={isEditing ? handleSave : () => setIsEditing(true)}
               className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
             >
               {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
             </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-studio-accent font-bold mb-8">
             <Crown size={16} />
             <span className="text-sm uppercase tracking-widest">{lang === 'VN' ? `Gói Studio ${user.plan}` : `${user.plan} Studio Plan`}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
             <div className="text-center group">
                <span className="block text-3xl font-display font-bold text-white group-hover:text-studio-accent transition-colors">{userCredits.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.credits}</span>
             </div>
             <div className="text-center group">
                <span className="block text-3xl font-display font-bold text-white group-hover:text-blue-400 transition-colors">{projects.filter(p => p.status !== 'COMPLETED').length}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.running}</span>
             </div>
             <div className="text-center group">
                <span className="block text-3xl font-display font-bold text-white group-hover:text-purple-400 transition-colors">{projects.length}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.total}</span>
             </div>
          </div>
       </div>

       <div className="space-y-4">
          <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] ml-4 mb-2">{t.account_mgnt}</h3>
          
          <button className="w-full glass-panel p-5 rounded-2xl flex items-center gap-5 hover:bg-white/5 transition-all group border border-white/5 text-left">
             <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                <User size={24} />
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{t.personal_info}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
             </div>
          </button>
          
          <button className="w-full glass-panel p-5 rounded-2xl flex items-center gap-5 hover:bg-white/5 transition-all group border border-white/5 text-left">
             <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                <CreditCard size={24} />
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{t.billing}</h4>
                <p className="text-sm text-gray-400">{lang === 'VN' ? 'Quản lý đăng ký' : 'Manage subscriptions'}</p>
             </div>
          </button>
          
          <button className="w-full glass-panel p-5 rounded-2xl flex items-center gap-5 hover:bg-white/5 transition-all group border border-white/5 text-left">
             <div className="bg-green-500/20 p-3 rounded-xl text-green-400 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/10">
                <Shield size={24} />
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{t.security}</h4>
                <p className="text-sm text-gray-400">{lang === 'VN' ? 'Mật khẩu và 2FA' : 'Passwords & 2FA'}</p>
             </div>
          </button>

          <button className="w-full glass-panel p-5 rounded-2xl flex items-center gap-5 hover:bg-white/5 transition-all group border border-white/5 text-left">
             <div className="bg-gray-500/20 p-3 rounded-xl text-gray-400 group-hover:scale-110 transition-transform shadow-lg shadow-gray-500/10">
                <Database size={24} />
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{t.privacy}</h4>
                <p className="text-sm text-gray-500">{lang === 'VN' ? 'Tùy chọn quyền riêng tư' : 'Privacy preferences'}</p>
             </div>
          </button>
       </div>
    </div>
  );
};

export default Profile;
