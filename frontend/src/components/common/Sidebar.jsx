import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  Calendar, 
  User, 
  Settings, 
  Users, 
  Shield, 
  HeartHandshake 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const role = user?.role || 'student';

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['student', 'teacher', 'parent', 'admin'] },
    { to: '/courses', label: t('courses'), icon: BookOpen, roles: ['student', 'teacher', 'admin'] },
    { to: '/quizzes', label: t('quizzes'), icon: HelpCircle, roles: ['student'] },
    { to: '/analytics', label: t('analytics'), icon: TrendingUp, roles: ['student'] },
    { to: '/study-plan', label: t('studyPlan'), icon: Calendar, roles: ['student'] },
    { to: '/teacher-dashboard', label: t('teacherDashboard'), icon: Users, roles: ['teacher', 'admin'] },
    { to: '/parent-dashboard', label: t('parentDashboard'), icon: HeartHandshake, roles: ['parent', 'admin'] },
    { to: '/admin-dashboard', label: t('adminDashboard'), icon: Shield, roles: ['admin'] },
    { to: '/profile', label: 'Profile', icon: User, roles: ['student', 'teacher', 'parent', 'admin'] },
    { to: '/settings', label: t('settings'), icon: Settings, roles: ['student', 'teacher', 'parent', 'admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:block">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <p className="text-xs uppercase tracking-wider font-bold text-cyan-400">Current Role</p>
          <p className="text-sm font-semibold capitalize text-slate-200 mt-0.5">{role} Account</p>
        </div>

        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-gradient-to-br from-cyan-950/40 to-slate-900 rounded-xl border border-cyan-500/20 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-cyan-300">SCERT Kerala Syllabus v10.4</p>
        <p>Bilingual RAG + LangGraph AI Tutor active.</p>
      </div>
    </aside>
  );
}
