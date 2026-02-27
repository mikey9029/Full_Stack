import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare, Briefcase, Loader2, Send } from 'lucide-react';
import { applicationService } from '../../services/api';

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishModal, setWishModal] = useState(null);
  const [wishTime, setWishTime] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await applicationService.getStudentApplications();
      setApps(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await applicationService.submitWish(wishModal, wishTime);
      setWishModal(null);
      setWishTime('');
      fetchApps();
    } catch (err) {
      alert('Failed to submit wish');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Interview': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  if (loading) return <DashboardLayout><div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase text-xs">Loading Application Status...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Application Tracker</h2>
        <p className="text-slate-500 font-medium mt-2">Monitor your recruitment progress across multiple companies.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
        {apps.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company & Role</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Applied</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {apps.map((app) => (
                 <tr key={app._id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-200">
                             {app.job?.company?.name?.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-black text-slate-950 group-hover:text-brand-blue transition-colors leading-none mb-1">{app.job?.title}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.job?.company?.name}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-xs font-bold text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</p>
                       <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Via PlacePro Portal</p>
                    </td>
                    <td className="px-10 py-8">
                       <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          {app.status}
                       </div>
                       {app.status === 'Interview' && app.interviewTime && (
                         <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <Calendar size={12}/> {new Date(app.interviewTime).toLocaleString()}
                         </p>
                       )}
                    </td>
                    <td className="px-10 py-8 text-right">
                       {app.status === 'Interview' && !app.studentPreferredTime && (
                         <button 
                           onClick={() => setWishModal(app._id)}
                           className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg shadow-orange-500/10"
                         >
                           Set Wish Time
                         </button>
                       )}
                       {app.studentPreferredTime && (
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
                            Wish Sent <CheckCircle size={12} className="text-emerald-500" />
                         </span>
                       )}
                       {app.status !== 'Interview' && (
                         <button className="text-slate-200 hover:text-slate-400 p-2"><MessageSquare size={18} /></button>
                       )}
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        ) : (
          <div className="p-40 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Clock size={32} className="text-slate-200" />
             </div>
             <p className="text-lg font-black text-slate-900">No applications yet</p>
             <p className="text-slate-400 text-xs font-bold mt-2">Visit the Job Board to find your next opportunity.</p>
          </div>
        )}
      </div>

      {/* Wish Time Modal */}
      {wishModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Scheduling Wish</h3>
              <p className="text-slate-500 text-xs font-medium mb-8">When would you like to have your interview? The admin will try to accommodate your wish.</p>
              
              <form onSubmit={handleSubmitWish} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Preferred Time (e.g. Mon morning)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Next Tuesday between 10am - 12pm"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                      value={wishTime}
                      onChange={(e) => setWishTime(e.target.value)}
                      required
                    />
                 </div>
                 <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setWishModal(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={updating}
                      className="flex-1 py-4 bg-brand-orange text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 size={16} className="animate-spin" /> : <>Send Wish <Send size={16}/></>}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplications;
