import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, HeartHandshake, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { selectRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    selectRole(role);
    if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'parent') navigate('/parent-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/dashboard');
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access SCERT Kerala learning path, AI Tutor, courses & quizzes.',
      icon: GraduationCap,
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10',
      badge: 'Interactive Learning'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Monitor class progress, student performance analytics & curriculum.',
      icon: Users,
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30 hover:border-teal-400 hover:bg-teal-500/10',
      badge: 'Classroom Insights'
    },
    {
      id: 'parent',
      title: 'Parent',
      description: 'Track child learning activity, weakness reports & study progress.',
      icon: HeartHandshake,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10',
      badge: 'Parent Portal'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage system users, board settings & SCERT curriculum data.',
      icon: Shield,
      color: 'from-emerald-500/20 to-cyan-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10',
      badge: 'System Control'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-cyan-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <span className="text-3xl font-black gradient-text">Padanam AI</span>
        </Link>
        <h2 className="text-3xl font-bold text-slate-100">Select User Role</h2>
        <p className="text-base text-slate-400">Choose a role below to enter the application immediately</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className={`p-5 rounded-2xl border bg-gradient-to-br transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer ${r.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300">
                        {r.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-white flex items-center justify-between">
                        <span>{r.title}</span>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-200" />
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-500 font-medium">
              Demo Simulation Mode • No credentials or password verification required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
