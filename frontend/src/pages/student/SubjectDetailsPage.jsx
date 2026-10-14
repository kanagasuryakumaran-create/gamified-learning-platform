import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Gamepad2, CheckCircle2, HelpCircle, ArrowRight, Play, 
  RefreshCw, Zap, Lock, Compass, Sparkles, Terminal, Shield 
} from 'lucide-react';

export const SubjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.student_id || user?.id || 1;

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      api.getSubjectDetail(id, studentId)
        .then(setSubject)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, studentId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Loading CSE World Campaign Missions...</span>
      </div>
    );
  }

  if (!subject) {
    return <div className="p-10 text-center text-slate-400">CSE World Track not found.</div>;
  }

  let activeFound = false;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {subject.category || 'CSE Track'}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{subject.lessons?.length || 0} Campaign Missions</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">{subject.title}</h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{subject.description}</p>
      </div>

      {/* Campaign Mission Path */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" /> CSE Campaign Missions
          </h2>
          <span className="text-xs text-slate-400">Stage Progression</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {subject.lessons?.map((lesson, idx) => {
            let status = 'upcoming';
            if (lesson.completed) {
              status = 'completed';
            } else if (!activeFound) {
              status = 'current';
              activeFound = true;
            }

            return (
              <div 
                key={lesson.id} 
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-200 ${
                  status === 'completed'
                    ? 'bg-slate-900/80 border-slate-800'
                    : status === 'current'
                    ? 'bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-70'
                }`}
              >
                {/* Node Bullet */}
                <div className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold border ${
                  status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30' 
                    : status === 'current'
                    ? 'bg-indigo-600 border-cyan-400 text-white animate-pulse shadow-md shadow-indigo-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}>
                  {status === 'completed' ? '✓' : idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : status === 'current' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {status === 'completed' ? 'Mastered' : status === 'current' ? 'Active Mission' : 'Locked'}
                    </span>
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{lesson.xp_reward} XP
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Mission {idx + 1}: {lesson.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <Link
                    to={`/student/lessons/${lesson.id}`}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      status === 'current'
                        ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> {status === 'completed' ? 'Review Mission' : 'Start Mission'}
                  </Link>

                  {lesson.quiz_id && (
                    <Link
                      to={`/student/quiz/${lesson.quiz_id}`}
                      className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Quiz Boss
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
