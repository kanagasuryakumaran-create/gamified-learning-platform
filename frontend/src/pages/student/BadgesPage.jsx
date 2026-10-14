import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Award, Lock, CheckCircle2, Zap, RefreshCw, Trophy, Crown, Flame, BookOpen, HelpCircle } from 'lucide-react';

export const BadgesPage = () => {
  const { user } = useAuth();
  const studentId = user?.student_id;

  const [badgesData, setBadgesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      api.getStudentBadges(studentId)
        .then(setBadgesData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading badges showcase...</span>
      </div>
    );
  }

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-indigo-400" />;
      case 'HelpCircle': return <HelpCircle className="w-6 h-6 text-purple-400" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'Crown': return <Crown className="w-6 h-6 text-amber-300" />;
      case 'Flame': return <Flame className="w-6 h-6 text-orange-400" />;
      default: return <Award className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Badges & Achievements</h1>
        <p className="text-sm text-slate-400 mt-1">Unlock badges by completing lessons, scoring 80%+ on quizzes, and accumulating XP points.</p>
      </div>

      {/* Stats Header */}
      <div className="p-6 rounded-3xl glass-panel-glow border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading text-white">
              {badgesData?.total_earned || 0} of {badgesData?.total_badges || 0} Unlocked
            </h3>
            <p className="text-xs text-slate-400">Keep learning to collect all achievements!</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            Collector Level: Intermediate
          </span>
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Unlocked Badges ({badgesData?.earned_badges?.length || 0})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgesData?.earned_badges?.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl glass-panel border border-emerald-500/40 relative overflow-hidden flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                {getBadgeIcon(b.icon)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Unlocked</span>
                <h4 className="text-base font-bold text-white">{b.title}</h4>
                <p className="text-xs text-slate-400">{b.description}</p>
                <span className="text-[10px] text-slate-500 block pt-1">Earned on {b.awarded_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Badges Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" /> Locked Achievements ({badgesData?.locked_badges?.length || 0})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgesData?.locked_badges?.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl glass-panel border border-slate-800 opacity-60 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Locked</span>
                <h4 className="text-base font-bold text-slate-300">{b.title}</h4>
                <p className="text-xs text-slate-500">{b.description}</p>
                <span className="text-[10px] text-indigo-400 block pt-1 font-semibold">Requires: {b.xp_threshold} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
