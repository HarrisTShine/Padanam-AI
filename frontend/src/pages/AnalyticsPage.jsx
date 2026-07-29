import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, AlertTriangle, Brain, RefreshCw } from 'lucide-react';
import { agentService } from '../services/agentService';
import MasteryChart from '../components/analytics/MasteryChart';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Topic Mastery Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Learning Analytics & Mastery Progress</h1>
        <p className="text-sm text-slate-400">SCERT Kerala State Board topic mastery tracking via Exponential Moving Average</p>
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Topic Mastery Heatmap (0 - 100%)</h3>
        <MasteryChart data={summary?.topic_masteries || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Mastered Concepts</span>
          </h3>
          <div className="space-y-2">
            {summary?.topic_masteries
              ?.filter(t => !t.is_weak_topic)
              .map(t => (
                <div key={t.topic_id} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-200">{t.topic_title}</span>
                  <span className="font-extrabold text-emerald-400">{Math.round(t.mastery_score * 100)}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Remediation Needed</span>
          </h3>
          <div className="space-y-2">
            {summary?.weak_topics?.map(t => (
              <div key={t.topic_id} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-200">{t.topic_title}</span>
                <span className="font-extrabold text-amber-400">{Math.round(t.mastery_score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
