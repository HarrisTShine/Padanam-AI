import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, Layers, Activity, RefreshCw } from 'lucide-react';
import { agentService } from '../services/agentService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const data = await agentService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Admin System Management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">System Administration & Content Portal</h1>
        <p className="text-sm text-slate-400">Manage user roles, state boards, and vector database embeddings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total System Users</span>
          <div className="text-3xl font-black text-cyan-400">{stats?.total_users || 4}</div>
          <p className="text-xs text-slate-500">Student, Teacher, Parent, Admin</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Education Boards</span>
          <div className="text-3xl font-black text-teal-400">{stats?.total_boards || 3}</div>
          <p className="text-xs text-slate-500">SCERT Kerala, CBSE, ICSE</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Active Subjects</span>
          <div className="text-3xl font-black text-emerald-400">{stats?.total_subjects || 3}</div>
          <p className="text-xs text-slate-500">Class 10 Physics, Maths, Chemistry</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Quizzes Evaluated</span>
          <div className="text-3xl font-black text-amber-400">{stats?.total_quizzes_completed || 18}</div>
          <p className="text-xs text-slate-500">With Misconception Analysis</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Board Architecture Extensibility</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Padanam AI models boards as dynamic foreign keys. Adding CBSE or ICSE textbooks requires zero schema modifications — simply upload new chapter chunks into the Chroma DB collection with the target board code tag.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            <span className="text-xs font-bold text-cyan-400 block">SCERT_KERALA (Active)</span>
            <p className="text-xs text-slate-400 mt-1">Class 10 Wave Motion, Reflection, Arithmetic Sequences indexed.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">CBSE (Extensible)</span>
            <p className="text-xs text-slate-500 mt-1">Ready for NCERT Class 10 textbook ingestion.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">ICSE (Extensible)</span>
            <p className="text-xs text-slate-500 mt-1">Ready for CISCE Class 10 syllabus ingestion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
