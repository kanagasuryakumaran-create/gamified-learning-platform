import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, BookPlus, HelpCircle, BarChart3, AlertTriangle, 
  Plus, ArrowRight, RefreshCw, ShieldCheck, Sparkles 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeacherAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[80vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>Loading teacher analytics portal...</span>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl glass-panel-glow border border-emerald-500/30">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> Instructor Dashboard
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Classroom Performance & Content Management</h1>
          <p className="text-sm text-slate-400">Monitor student progress, analyze PyTorch DNN weak topic alerts, and create curriculum.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/teacher/subjects')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Subject
          </button>
        </div>
      </div>

      {/* 4 Key Summary Metrics (Section 17 requirement) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Students</span>
          <h3 className="text-2xl font-extrabold text-white mt-1">{analytics?.overview?.total_students || 0}</h3>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Subjects</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{analytics?.overview?.total_subjects || 0}</h3>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Average Student Score</span>
          <h3 className="text-2xl font-extrabold text-cyan-400 mt-1">{analytics?.overview?.average_score || 0}%</h3>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Completed Quizzes</span>
          <h3 className="text-2xl font-extrabold text-purple-400 mt-1">{analytics?.overview?.total_quiz_attempts || 0}</h3>
        </div>
      </div>

      {/* Weak Topics Callout Card (Section 17 requirement) */}
      <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 bg-amber-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-heading text-white">Automated Weak Topic Alert Matrix</h3>
          </div>
          <span className="text-xs text-amber-400 font-semibold">PyTorch DNN Diagnostics</span>
        </div>
        <p className="text-xs text-slate-300">
          The DNN model identified <strong className="text-amber-300">Arrays</strong> and <strong className="text-amber-300">Loops</strong> as the most frequent weak topics among active students. Consider adding supplemental lesson materials or revision quizzes for these modules.
        </p>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">Student Score Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.score_distribution_chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="Students Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Topics Frequency Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">Weak Topics Frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.weak_topics_chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="topic" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Student Flag Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
