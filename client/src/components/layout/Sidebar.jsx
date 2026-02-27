import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  Settings,
  PlusCircle,
  Users,
  Sparkles,
  Shield
} from 'lucide-react';
import { authService } from '../../services/api';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const menuItems = {
    student: [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'Job Board', path: '/student/jobs', icon: Briefcase },
      { name: 'My Applications', path: '/student/applications', icon: FileText },
      { name: 'Resume IQ', path: '/student/resume', icon: Shield },
      { name: 'Prep Arena', path: '/student/accelerator', icon: Sparkles },
      { name: 'Profile', path: '/student/profile', icon: User },
    ],
    admin: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      { name: 'Manage Students', path: '/admin/students', icon: Users },
      { name: 'Job Postings', path: '/admin/jobs', icon: FileText },
    ],
    company: [
      { name: 'Dashboard', path: '/company', icon: LayoutDashboard },
      { name: 'Post a Job', path: '/company/post-job', icon: PlusCircle },
      { name: 'Active Jobs', path: '/company/jobs', icon: Briefcase },
      { name: 'Applicants', path: '/company/applicants', icon: Users },
      { name: 'Settings', path: '/company/settings', icon: Settings },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="w-72 bg-white h-screen flex flex-col border-r border-slate-100 fixed left-0 top-0 z-40">
      <div className="p-10">
        <h1 className="text-2xl font-black text-brand-blue flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-[10px]">P</div>
          PlacePro
        </h1>
        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.3em] font-black">
          {role} portal
        </p>
      </div>

      <nav className="flex-1 px-6 space-y-1">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-slate-50 text-brand-blue border border-slate-100' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-brand-blue' : 'text-slate-300'} />
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button 
          onClick={() => {
            authService.logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
