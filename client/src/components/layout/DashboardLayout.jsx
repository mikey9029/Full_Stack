import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { authService } from '../../services/api';
import adminSvg from '../../assets/student2.svg';
import studentSvg from '../../assets/student1.svg';

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  if (!user) return null;

  const displayName = user.name || (user.firstName ? `${user.firstName} ${user.lastName}` : 'User');
  const firstName = user.firstName || displayName.split(' ')[0];
  const firstInitial = user.firstName ? user.firstName.charAt(0) : displayName.charAt(0);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900 overflow-hidden">
      <Sidebar role={user.role} />
      
      <main className="flex-1 ml-72 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 p-2 flex items-center justify-center">
              <img 
                src={user.role === 'admin' ? adminSvg : studentSvg} 
                alt="Profile Illustration" 
                className="w-full h-auto drop-shadow-sm"
              />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Authenticated</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{user.role} Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{firstName}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Session ID: {user.id ? user.id.slice(-8) : 'ACTIVE'}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-xl font-black text-white shadow-xl shadow-blue-500/20 uppercase transform hover:scale-105 transition-transform cursor-pointer">
              {firstInitial}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
