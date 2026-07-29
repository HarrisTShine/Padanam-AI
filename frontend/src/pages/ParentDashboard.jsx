import React, { useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, AlertCircle, RefreshCw, Smile } from 'lucide-react';
import { agentService } from '../services/agentService';

export default function ParentDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await agentService.getParentReport();
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Simplified Parent Report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Parent Progress Portal</h1>
        <p className="text-sm text-slate-400">Jargon-free overview of your child's SCERT Kerala learning journey</p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smile className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{report?.child_name}</h2>
              <p className="text-xs text-slate-400">Class {report?.grade} • {report?.board}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Overall Progress</span>
            <span className="text-3xl font-black text-teal-400">{report?.overall_progress_percent}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
          <span className="font-bold text-cyan-400 block mb-1">Recent Learning Activity:</span>
          {report?.recent_activity}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Key Strengths & Mastery</span>
            </h3>
            <ul className="space-y-2 text-xs text-emerald-200">
              {report?.strengths?.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Recommended Parent Support</span>
            </h3>
            <ul className="space-y-2 text-xs text-amber-200">
              {report?.areas_for_growth?.map((area, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-medium">
          <span className="font-bold text-cyan-400 block mb-1">AI Encourage Note for Parent:</span>
          "{report?.encouragement_note}"
        </div>
      </div>
    </div>
  );
}
