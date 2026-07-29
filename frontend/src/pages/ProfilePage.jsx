import React from 'react';
import { User, Shield, GraduationCap, Globe, Mail, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">User Profile</h1>
        <p className="text-sm text-slate-400">Account metadata, grade level, and state board settings</p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-cyan-500/20">
            {user?.full_name ? user.full_name[0] : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.full_name}</h2>
            <p className="text-sm text-slate-400 capitalize">{user?.role} Account • Padanam AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</span>
            <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State Board</span>
            <p className="text-sm font-semibold text-cyan-400">SCERT Kerala State Board</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class / Grade</span>
            <p className="text-sm font-semibold text-slate-200">Class {user?.student_profile?.grade || 10} (SSLC)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Language Preference</span>
            <p className="text-sm font-semibold text-teal-400 uppercase">{user?.student_profile?.language_preference || 'en'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
