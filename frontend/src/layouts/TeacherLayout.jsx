import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookPlus, FileText, HelpCircle, 
  Users, BarChart3, User, LogOut, ShieldCheck, BrainCircuit
} from 'lucide-react';

export const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Teacher Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Manage Subjects', path: '/teacher/subjects', icon: BookPlus },
    { name: 'Manage Lessons', path: '/teacher/lessons', icon: FileText },
    { name: 'Manage Quizzes', path: '/teacher/quizzes', icon: HelpCircle },
    { name: 'Student Roster', path: '/teacher/students', icon: Users },
    { name: 'Class Analytics', path: '/teacher/analytics', icon: BarChart3 },
    { name: 'Teacher Profile', path: '/teacher/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d1322] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                LearnQuest
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Teacher Control Portal
              </span>
            </div>
          </div>

          {/* Teacher Profile Info */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold">
                {user?.full_name ? user.full_name.charAt(0) : 'T'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{user?.full_name || 'Instructor'}</p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                  Teacher / Educator
                </span>
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
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
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
