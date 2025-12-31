import React, { useState } from 'react';
import { Language } from '../types';
import { User, CreditCard, Shield, Edit2, Save } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface ProfileProps {
  lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
  const { user, userCredits, projects, updateUser } = useStudio();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(user.name);

  const handleSave = () => {
    updateUser({ name: localName });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4">
       <div className="glass-panel rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-studio-accent to-purple-600"></div>
          
          <div className="relative inline-block mt-8 mb-4">
             <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-studio-900 object-cover" />
             <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-studio-900"></div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
             {isEditing ? (
               <input 
                 className="bg-studio-800 border border-white/20 rounded px-2 py-1 text-white text-lg font-bold text-center focus:outline-none focus:border-studio-accent"
                 value={localName}
                 onChange={(e) => setLocalName(e.target.value)}
               />
             ) : (
               <h2 className="text-2xl font-bold text-white">{user.name}</h2>
             )}
             <button 
               onClick={isEditing ? handleSave : () => setIsEditing(true)}
               className="text-gray-400 hover:text-white transition-colors"
             >
               {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
             </button>
          </div>
          <p className="text-gray-400">{user.plan} Studio Plan</p>
          
          <div className="flex justify-center gap-8 mt-6">
             <div className="text-center">
                <span className="block text-2xl font-bold text-white">{userCredits.toLocaleString()}</span>
                <span className="text-xs text-gray-500 uppercase">Credits</span>
             </div>
             <div className="text-center">
                <span className="block text-2xl font-bold text-white">{projects.filter(p => p.status !== 'Completed').length}</span>
                <span className="text-xs text-gray-500 uppercase">Active</span>
             </div>
             <div className="text-center">
                <span className="block text-2xl font-bold text-white">{projects.length}</span>
                <span className="text-xs text-gray-500 uppercase">Total</span>
             </div>
          </div>
       </div>

       <div className="grid gap-4">
          <button className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
             <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform"><User size={20} /></div>
             <div className="flex-1 text-left">
                <h4 className="font-bold text-white">Personal Information</h4>
                <p className="text-xs text-gray-500">{user.email}</p>
             </div>
          </button>
          
          <button className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
             <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 group-hover:scale-110 transition-transform"><CreditCard size={20} /></div>
             <div className="flex-1 text-left">
                <h4 className="font-bold text-white">Billing & Plan</h4>
                <p className="text-xs text-gray-500">Manage subscription</p>
             </div>
          </button>
          
          <button className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
             <div className="bg-green-500/20 p-2 rounded-lg text-green-400 group-hover:scale-110 transition-transform"><Shield size={20} /></div>
             <div className="flex-1 text-left">
                <h4 className="font-bold text-white">Security</h4>
                <p className="text-xs text-gray-500">Password and 2FA</p>
             </div>
          </button>
       </div>
    </div>
  );
};

export default Profile;