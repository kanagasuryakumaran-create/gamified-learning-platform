import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, TrendingUp, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const ProgressPage = () => {
  const { user } = useAuth();
  const studentId = user?.student_id;

  const [progress, setProgress] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      Promise.all([
        api.getStudentProgress(studentId),
        api.getStudentPerformance(studentId)
      ])
      .then(([pData, perfData]) => {
        setProgress(pData);
        setPerformance(perfData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading analytics progress...</span>
      </div>
    );
  }

  const topicChartData = performance.length > 0 
    ? performance.map(p => ({ name: p.topic_name, score: p.topic_score, avg: p.average_score }))
    : [];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Learning Analytics & Progress</h1>
        <p className="text-sm text-slate-400 mt-1">Comprehensive breakdown of your test scores, topic mastery, and learning history.</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Total XP</span>
          <div className="text-2xl font-bold text-white mt-1">{progress?.total_xp || 0}</div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Average Quiz Score</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{progress?.quiz_average || 0}%</div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Lessons Completed</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{progress?.completed_lessons_count || 0}</div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Total Quizzes Taken</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{progress?.total_quiz_attempts || 0}</div>
        </div>
      </div>

      {/* Topic-Wise Scores Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-heading text-white">Topic Score Breakdown (%)</h3>
        {topicChartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} name="Topic Score %" />
                <Bar dataKey="avg" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Overall Average %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No topic score data recorded yet. Complete quizzes to populate performance analytics.
          </div>
        )}
      </div>

      {/* Attempt History Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-heading text-white">Complete Quiz Attempts Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Quiz Name</th>
                <th className="p-3">Score</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Result</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {progress?.attempts_history?.length > 0 ? (
                progress.attempts_history.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{a.quiz_title}</td>
                    <td className="p-3">{a.score} / {a.max_score}</td>
                    <td className="p-3 font-bold text-indigo-400">{a.percentage}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        a.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {a.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{a.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">No attempts logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
