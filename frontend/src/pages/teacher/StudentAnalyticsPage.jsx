import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { BrainCircuit, Sparkles, Trophy, TrendingUp, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const StudentAnalyticsPage = () => {
  const { id } = useParams();
  const studentId = id || 1;

  const [progress, setProgress] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [aiRec, setAiRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStudentProgress(studentId),
      api.getStudentPerformance(studentId),
      api.getAIRecommendations(studentId)
    ])
    .then(([pData, perfData, recData]) => {
      setProgress(pData);
      setPerformance(perfData);
      setAiRec(recData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>Loading detailed student analytics...</span>
      </div>
    );
  }

  const topicChartData = performance.length > 0 
    ? performance.map(p => ({ name: p.topic_name, score: p.topic_score }))
    : [
        { name: 'Arrays', score: 42 },
        { name: 'Loops', score: 75 },
        { name: 'Java Basics', score: 85 }
      ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <Link to="/teacher/students" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Roster
        </Link>
        <h1 className="text-3xl font-extrabold font-heading text-white">
          Analytics: {progress?.student_name || 'Student Profile'}
        </h1>
        <p className="text-sm text-slate-400">Deep-dive learning metrics and PyTorch DNN evaluation report.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Current Level</span>
          <div className="text-lg font-bold text-amber-300 mt-1">{progress?.current_level}</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Total Accumulated XP</span>
          <div className="text-lg font-bold text-white mt-1">{progress?.total_xp} XP</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Quiz Average</span>
          <div className="text-lg font-bold text-cyan-400 mt-1">{progress?.quiz_average}%</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400">Completed Lessons</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">{progress?.completed_lessons_count}</div>
        </div>
      </div>

      {/* PyTorch DNN Recommendation Box */}
      {aiRec && (
        <div className="p-6 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" /> PyTorch DNN AI Diagnosis Report
            </h3>
            <span className="text-xs text-cyan-300 font-bold">Assigned: {aiRec.difficulty}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Weak Topic</span>
              <p className="text-base font-bold text-amber-400 mt-0.5">{aiRec.weak_topic}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Recommended Topic</span>
              <p className="text-base font-bold text-cyan-400 mt-0.5">{aiRec.recommended_topic}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Predicted Score</span>
              <p className="text-base font-bold text-indigo-400 mt-0.5">{aiRec.predicted_performance}%</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic pt-1">
            "{aiRec.reason}"
          </p>
        </div>
      )}

      {/* Topic Scores Bar Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-heading text-white">Topic Score Breakdown (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} name="Topic Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
