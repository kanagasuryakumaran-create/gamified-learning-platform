import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FlaskConical, Compass, BrainCircuit, LineChart, 
  Award, User, LogOut, Sparkles, Droplet, Flame
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Acids Virtual Lab', path: '/student/chemistry-lab', icon: FlaskConical, badge: 'LAB GAME' },
    { name: 'Acid Missions', path: '/student/dashboard', icon: Compass },
    { name: 'PyTorch AI Guidance', path: '/student/ai-recommendations', icon: BrainCircuit, badge: 'DNN' },
    { name: 'Lab Performance', path: '/student/progress', icon: LineChart },
    { name: 'Trophy Room', path: '/student/badges', icon: Award },
    { name: 'Chemist Profile', path: '/student/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar HUD */}
      <aside className="w-full md:w-64 bg-[#0d1322] border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between shrink-0 relative z-20">
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider font-heading bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                Acids Virtual Lab
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PyTorch DNN Powered
              </span>
            </div>
          </div>

          {/* Student Profile Quick Info */}
          <div className="p-4 mx-3 my-4 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                {user?.full_name ? user.full_name.charAt(0) : 'C'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{user?.full_name || 'Virtual Chemist'}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Lab Student
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Lab</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
