import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Building2, FileCheck, Landmark, CheckCircle, XCircle, Calendar, Link as LinkIcon, Loader2, Send } from 'lucide-react';
import { applicationService } from '../../services/api';

const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(null);
  const [interviewTime, setInterviewTime] = useState('');

  const placedCount = apps.filter(app => app.status === 'Accepted').length;

  const adminStats = [
    { name: 'Total Students', value: '7', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Partner Companies', value: '57', icon: Building2, color: 'text-brand-blue', bg: 'bg-slate-100' },
    { name: 'Active Openings', value: '120', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Placements 2026', value: placedCount.toString(), icon: Landmark, color: 'text-brand-orange', bg: 'bg-orange-50' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await applicationService.getAdminApplications();
      setApps(res.data.data.slice(0, 7));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, time = null) => {
    setUpdatingId(id);
    try {
      await applicationService.updateStatus(id, { status, interviewTime: time });
      fetchData();
      if (time) setScheduleModal(null);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {adminStats.map((stat) => (
          <div key={stat.name} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-sm border border-white/50`}>
              <stat.icon size={26} className={stat.color} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight text-slate-950">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <section className="col-span-3 lg:col-span-full">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 border-l-4 border-brand-blue pl-4">Master Application Hub</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Candidates: {apps.length}</p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase text-xs">Syncing Recruitment Data...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Role</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Wish Time</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {apps.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center font-black text-xs">
                              {(app.student?.firstName || 'C').charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 leading-none">
                                {app.student?.firstName} {app.student?.lastName || 'Candidate'}
                              </p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900 leading-none mb-1">{app.job?.title}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{app.job?.company?.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
                          {app.studentPreferredTime || 'None Sent'}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                          app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-brand-blue border-blue-100'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        {updatingId === app._id ? (
                           <Loader2 size={16} className="animate-spin text-slate-400 inline" />
                        ) : (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                              className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all inline-flex"
                              title="Accept"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                               onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                               className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all inline-flex"
                               title="Reject"
                            >
                               <XCircle size={16} />
                            </button>
                            <button 
                               onClick={() => setScheduleModal(app._id)}
                               className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all inline-flex"
                               title="Schedule Interview"
                            >
                               <Calendar size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Schedule</h3>
              <p className="text-slate-500 text-xs font-medium mb-8">Set the official interview date and time. An automated notification will be sent to the candidate.</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Interview Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setScheduleModal(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(scheduleModal, 'Interview', interviewTime)}
                      disabled={!interviewTime}
                      className="flex-1 py-4 bg-brand-blue text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      Schedule Now <Send size={16}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
