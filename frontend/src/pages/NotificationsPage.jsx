import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { agentService } from '../services/agentService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotis = async () => {
      setLoading(true);
      try {
        const data = await agentService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotis();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Notifications Panel</h1>
        <p className="text-sm text-slate-400">Updates from your AI Tutor, remediation alerts, and quiz reminders</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-start space-x-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-sm">{n.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-slate-500 block pt-1">{n.created_at}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
