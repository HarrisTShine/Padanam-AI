import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Bell, User, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Navbar({ onOpenChat }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform duration-200">
            <BookOpen className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">
              {t('appTitle')}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-teal-400 font-semibold">
              SCERT Kerala State Board
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageToggle />

          {user && (
            <>
              <button
                onClick={onOpenChat}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold shadow-md shadow-cyan-500/20 text-sm transition duration-200"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t('askAITutor')}</span>
              </button>

              <Link
                to="/notifications"
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>

              <div className="h-6 w-px bg-slate-800" />

              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-slate-200 hover:text-cyan-400 transition">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                    {user.full_name ? user.full_name[0] : 'U'}
                  </div>
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition">
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
