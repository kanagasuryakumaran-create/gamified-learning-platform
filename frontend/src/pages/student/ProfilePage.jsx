import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Mail, ShieldCheck, Flame, Zap, Award, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.student_id;

  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      api.getGamificationStatus(studentId)
        .then(setGamification)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Student Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your LearnQuest AI account credentials and view learning status.</p>
      </div>

      <div className="p-8 rounded-3xl glass-panel-glow border border-slate-800 space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-indigo-500/30">
            {user?.full_name ? user.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">{user?.full_name || 'Student User'}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Student Account
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Current Level</span>
            <div className="text-xl font-bold text-amber-300 mt-1">
              Level {gamification?.level_number}: {gamification?.level}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Total Accumulated XP</span>
            <div className="text-xl font-bold text-indigo-400 mt-1">{gamification?.total_xp || 0} XP</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Active Learning Streak</span>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <Flame className="w-5 h-5 text-amber-400 fill-current" /> {gamification?.learning_streak_days || 1} Days
            </div>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Account
        </button>
      </div>
    </div>
  );
};
