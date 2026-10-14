import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, LogOut } from 'lucide-react';

export const TeacherProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Teacher Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Instructor account details and teaching portal credentials.</p>
      </div>

      <div className="p-8 rounded-3xl glass-panel-glow border border-slate-800 space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-emerald-500/20">
            {user?.full_name ? user.full_name.charAt(0) : 'T'}
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">{user?.full_name || 'Instructor'}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Teacher / Educator
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
          <strong className="text-white block mb-1">Department:</strong>
          Computer Science & Artificial Intelligence Department
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Educator Portal
        </button>
      </div>
    </div>
  );
};
