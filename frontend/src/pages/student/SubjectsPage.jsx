import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Gamepad2, Compass, Layers, Code2, Terminal, Database, 
  Network, Cpu, Globe, ArrowRight, RefreshCw, Sparkles, Lock, CheckCircle2 
} from 'lucide-react';

export const SubjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.student_id || user?.id || 1;

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects(studentId)
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  const getTopicIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('data structure') || t.includes('array')) return Layers;
    if (t.includes('java')) return Code2;
    if (t.includes('python')) return Terminal;
    if (t.includes('database') || t.includes('sql') || t.includes('dbms')) return Database;
    if (t.includes('network')) return Network;
    if (t.includes('operating') || t.includes('os')) return Cpu;
    return Globe;
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Loading CSE Skill Tracks...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> CSE Learning Journey
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Computer Science Skill Tracks
            </h1>
          </div>
        </div>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Embark on structured skill paths covering Data Structures, OOP Java, Python & AI, Database Systems, Computer Networks, Operating Systems, and Web Engineering.
        </p>
      </div>

      {/* World Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subj, index) => {
          const Icon = getTopicIcon(subj.title);
          const isCompleted = subj.progress_percentage >= 100;

          return (
            <div
              key={subj.id}
              onClick={() => navigate(`/student/subjects/${subj.id}`)}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                    Stage {index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                    {subj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Track Progress</span>
                  <span className="font-extrabold text-cyan-400">{subj.progress_percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${subj.progress_percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{subj.completed_lessons} of {subj.total_lessons} Missions</span>
                  <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Track <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
