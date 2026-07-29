import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Award, ShieldCheck, Languages, ArrowRight, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/common/LanguageToggle';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <nav className="max-w-7xl mx-auto px-6 py-6 w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-cyan-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">Padanam AI</span>
            <span className="block text-[10px] text-teal-400 tracking-wider font-semibold uppercase">പഠനം AI • Kerala SCERT</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition">
            Log In
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/25">
            Student Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-Powered Adaptive Learning for SCERT Kerala Board</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-100">
            Personalized Tutoring Grounded in <span className="gradient-text">Kerala SCERT Syllabus</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Padanam AI models every student's learning speed, language preference (English/Malayalam), and topic mastery — diagnosing exact misconceptions instead of just giving correct answers.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-base transition shadow-xl shadow-cyan-500/25 flex items-center space-x-2">
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-800 transition">
              Explore Demo Dashboards
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl glass-panel space-y-3 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">LangGraph Cognitive Tutor</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explicit state machine agent that retrieves textbook RAG context and adapts explanations using real-life Kerala analogies or Malayalam breakdowns.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Diagnostic Misconception AI</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a student answers a quiz question wrong, Padanam AI diagnoses *why* they were confused and clarifies the underlying concept.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Bilingual English + മലയാളം</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly switch between Malayalam and English instructions, tailored for Malayalam medium and English medium state board school students.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        Padanam AI © 2026 • SCERT Kerala State Board Adaptive Learning Infrastructure
      </footer>
    </div>
  );
}
