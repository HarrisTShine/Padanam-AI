import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Award, AlertTriangle, ArrowRight, Play, CheckCircle, Calendar, RefreshCw, Zap, Gauge } from 'lucide-react';
import { agentService } from '../services/agentService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import MasteryChart from '../components/analytics/MasteryChart';
import QuizRunner from '../components/quiz/QuizRunner';

export default function StudentDashboard({ onOpenChat }) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await agentService.getStudentSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center space-x-3 text-cyan-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="font-semibold text-sm">Loading Student Adaptive Dashboard...</span>
      </div>
    );
  }

  const overallPct = Math.round((summary?.overall_mastery || 0.75) * 100);

  // Map Learning Style display badge
  const getStyleDisplay = (style) => {
    switch (style) {
      case 'fast_paced':
        return { title: 'Fast & Autonomous', desc: 'Quick response time & high retention accuracy', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'guided_step_by_step':
        return { title: 'Guided Step-by-Step', desc: 'Remediation analogies & detailed breakdowns', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { title: 'Balanced & Interactive', desc: 'Steady pace with concept check quizzes', color: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    }
  };

  const styleMeta = getStyleDisplay(summary?.learning_speed);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Card */}
      <div className="p-8 rounded-3xl glass-panel relative overflow-hidden border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>SCERT Kerala Grade {user?.student_profile?.grade || 10} • Adaptive Mode</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100">
            {t('welcomeBack')}, <span className="gradient-text">{user?.full_name || 'Anoop'}</span>!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Padanam AI has updated your learning model. You have achieved <strong className="text-teal-300">{overallPct}% overall mastery</strong> across your SCERT Kerala Class 10 subjects.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenChat}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Ask AI Tutor Anything</span>
            </button>
            <Link
              to="/courses"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
            >
              Browse SCERT Chapters
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Overall Mastery</span>
          <div className="text-3xl font-black text-teal-400">{overallPct}%</div>
          <p className="text-xs text-slate-500">Exponential Moving Average</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Quizzes</span>
          <div className="text-3xl font-black text-cyan-400">{summary?.total_quizzes_taken || 4}</div>
          <p className="text-xs text-slate-500">Completed Diagnostic Items</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Weak Topics</span>
          <div className="text-3xl font-black text-amber-400">{summary?.weak_topics_count || 1}</div>
          <p className="text-xs text-amber-400/80 font-medium">Auto-flagged for remediation</p>
        </div>

        {/* AI Auto-Profiled Learning Style */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Learning Style</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${styleMeta.badge}`}>
              Auto-Profiled
            </span>
          </div>
          <div className={`text-xl font-black ${styleMeta.color}`}>{styleMeta.title}</div>
          <p className="text-xs text-slate-400 leading-tight">{styleMeta.desc}</p>
        </div>
      </div>

      {/* Recommended Next Lesson & Weak Topics Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Next */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4 bg-gradient-to-br from-slate-900 to-cyan-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400 flex items-center space-x-1.5">
              <Brain className="w-4 h-4" />
              <span>Recommended Next Lesson</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
              AI Decision Engine
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-100">
              {summary?.recommended_next_topic_title || 'Wave Motion & Sound'}
            </h3>
            <p className="text-xs text-slate-400">
              Physics Chapter 1 • SCERT Kerala State Board
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Based on your recent quiz scores, reviewing wave particle vibration directions will ensure 100% readiness for your SSLC board exams.
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <Link
              to={`/lesson/1`}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-md shadow-cyan-500/20 flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Interactive Lesson</span>
            </Link>
            <button
              onClick={() => setShowQuizModal(!showQuizModal)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
            >
              Quick Quiz
            </button>
          </div>
        </div>

        {/* Weak Topics Alert */}
        <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 space-y-4 bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Topics Needing Remediation</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Spaced Repetition Flag
            </span>
          </div>

          {summary?.weak_topics && summary.weak_topics.length > 0 ? (
            <div className="space-y-3">
              {summary.weak_topics.map((item) => (
                <div key={item.topic_id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{item.topic_title}</h4>
                    <p className="text-xs text-slate-400">{item.subject_name} • Current Mastery: {Math.round(item.mastery_score * 100)}%</p>
                  </div>
                  <button
                    onClick={onOpenChat}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
                  >
                    AI Remediation
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Great job! No critical weak topics flagged right now.</p>
          )}
        </div>
      </div>

      {/* Quiz Modal Runner */}
      {showQuizModal && (
        <div className="pt-2">
          <QuizRunner topicId={1} topicTitle="Wave Motion & Sound" onComplete={fetchSummary} />
        </div>
      )}

      {/* Mastery Analytics Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">SCERT Topic Mastery Heatmap</h3>
            <p className="text-xs text-slate-400">Real-time mastery updates via exponential moving average</p>
          </div>
          <Link to="/analytics" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center space-x-1">
            <span>View Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <MasteryChart data={summary?.topic_masteries || []} />
      </div>
    </div>
  );
}
