import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Briefcase, Users, FilePlus, TrendingUp, CheckCircle, XCircle, Link as LinkIcon, Loader2 } from 'lucide-react';
import { jobService } from '../../services/api';

const CompanyDashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Active Openings', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Applicants', value: '148', icon: Users, color: 'text-brand-blue', bg: 'bg-slate-100' },
    { name: 'Pending Reviews', value: '24', icon: TrendingUp, color: 'text-brand-orange', bg: 'bg-orange-50' },
  ]);

  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch actual applicants for THIS company
    // For now, mirroring the fetch logic
    setTimeout(() => {
        setRecentApplicants([
            { id: 1, name: 'Ananya Sharma', role: 'Software Engineer', status: 'Under Review', appliedAt: '2 hours ago' },
            { id: 2, name: 'Rahul Verma', role: 'Product Manager', status: 'Accepted', appliedAt: '5 hours ago' },
            { id: 3, name: 'Siddharth Roy', role: 'UI Designer', status: 'Interview', appliedAt: 'Yesterday' },
        ]);
        setLoading(false);
    }, 800);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Hiring Overview</h2>
          <p className="text-slate-500 font-medium mt-2">Manage your active job postings and streamline candidate workflows.</p>
        </div>
        <a href="/company/post-job" className="bg-slate-950 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-black/10 flex items-center gap-3 active:scale-95">
          <FilePlus size={18} /> Post New Job
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.name} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={26} className={stat.color} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-4xl font-black mt-2 text-slate-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight border-l-4 border-brand-orange pl-4">Recent Applicants</h3>
          <button className="text-[10px] font-black uppercase text-brand-blue tracking-[0.2em]">View All Activity</button>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate Profile</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Position</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Applied</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Recruitment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {recentApplicants.map((applicant) => (
                 <tr key={applicant.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-200">
                             {applicant.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 leading-none">{applicant.name}</p>
                             <button className="text-[9px] font-black text-brand-blue uppercase tracking-widest mt-1.5 flex items-center gap-1 hover:underline">
                                <LinkIcon size={10} /> View CV
                             </button>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-slate-600">{applicant.role}</td>
                    <td className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{applicant.appliedAt}</td>
                    <td className="px-10 py-8">
                       <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                         applicant.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         applicant.status === 'Interview' ? 'bg-blue-50 text-brand-blue border-blue-100' : 'bg-orange-50 text-brand-orange border-orange-100'
                       }`}>
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          {applicant.status}
                       </span>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
