import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, MapPin, Building2, Briefcase, AlertCircle, CheckCircle, ArrowRight, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { jobService, userService } from '../../services/api';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: 'All' });
  const [applying, setApplying] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Track jobs the user has successfully applied to in this session
  const [appliedJobs, setAppliedJobs] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Profile to get CGPA
      const profileRes = await userService.getProfile();
      const userData = profileRes.data.data;
      setUser(userData);

      // 2. Fetch all jobs
      const jobsRes = await jobService.getJobs();
      setJobs(jobsRes.data.data);

      // 3. Fetch existing applications to mark "Applied" status persistently
      try {
        const appsRes = await applicationService.getStudentApplications();
        const appliedJobIds = appsRes.data.data.map(app => app.job?._id || app.job);
        setAppliedJobs(appliedJobIds);
      } catch (appErr) {
        console.warn('Could not fetch existing applications:', appErr);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         job.location?.toLowerCase().includes(filters.search.toLowerCase());
    
    // Map dropdown filters to the dynamically seeded job roles
    let matchesType = true;
    if (filters.type === 'IT') matchesType = job.role === 'IT';
    if (filters.type === 'BP') matchesType = ['BP', 'Management', 'HR'].includes(job.role);

    return matchesSearch && matchesType && job.status === 'Open';
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
     setCurrentPage(pageNumber);
  };

  const handleApply = async (job) => {
    if (!user?.resumeUrl) {
      setMsg({ type: 'warning', text: 'You need to upload a resume in Profile Settings before applying.' });
      return;
    }

    // CGPA Eligibility Check
    const studentCgpa = parseFloat(user.cgpaBTech) || 0;
    const requiredCgpa = parseFloat(job.minCgpa) || 0;

    if (studentCgpa < requiredCgpa) {
      setMsg({ 
        type: 'error', 
        text: `Application Blocked: Your CGPA (${studentCgpa}) is below the required threshold (${requiredCgpa}) for this role.` 
      });
      setTimeout(() => setMsg({ type: '', text: '' }), 6000);
      return;
    }

    setApplying(job._id);
    try {
      const res = await jobService.applyForJob(job._id);
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Application submitted! Check your email for confirmation.' });
        // Mark as applied instead of removing it from the array
        setAppliedJobs(prev => [...prev, job._id]);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Application failed' });
    } finally {
      setApplying(null);
      setTimeout(() => setMsg({ type: '', text: '' }), 5000);
    }
  };

  if (loading) return <DashboardLayout><div className="p-20 text-center flex flex-col items-center"><Loader2 size={40} className="animate-spin text-brand-blue mb-4" /><p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Compiling Placements Data...</p></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Placement Directory</h2>
           <p className="text-slate-500 font-medium mt-2 text-sm max-w-xl leading-relaxed">
             Executing active scan across corporate networks. Displaying <strong className="text-brand-blue">{filteredJobs.length} active</strong> roles mapped to your CGPA tier.
           </p>
        </div>
      </div>

      {/* Filters Bar - Premium Redesign */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-slate-950 p-2 pl-6 rounded-full shadow-2xl relative overflow-hidden items-center group">
        <div className="absolute top-0 right-0 w-64 h-full bg-brand-blue blur-[80px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
        <div className="flex-1 w-full relative z-10 text-white">
           <Search size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
             type="text" 
             placeholder="Search active roles or locations..."
             className="w-full bg-transparent border-none py-3 pl-10 pr-6 text-sm font-bold placeholder:text-slate-600 focus:outline-none text-white"
             value={filters.search}
             onChange={(e) => {
                setFilters({...filters, search: e.target.value});
                setCurrentPage(1);
             }}
           />
        </div>
        <div className="w-px h-8 bg-white/10 hidden lg:block z-10"></div>
        <div className="flex items-center gap-4 w-full lg:w-auto pr-2 z-10">
           <select 
             className="bg-white/10 border border-white/5 rounded-full py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:bg-slate-900 cursor-pointer backdrop-blur-md hover:bg-white/20 transition-all"
             value={filters.type}
             onChange={(e) => {
               setFilters({...filters, type: e.target.value});
               setCurrentPage(1);
             }}
           >
             <option value="All" className="bg-slate-900">All Sectors</option>
             <option value="IT" className="bg-slate-900">IT Infrastructure</option>
             <option value="BP" className="bg-slate-900">Business Process</option>
           </select>
        </div>
      </div>

      {msg.text && (
        <div className={`mb-8 p-5 rounded-2xl text-sm font-bold flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-sm border ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
          msg.type === 'warning' ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          <div className="flex items-center gap-3">
             {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
             {msg.text}
          </div>
          {msg.type === 'warning' && (
             <a href="/student/profile" className="text-[10px] uppercase font-black bg-brand-orange text-white px-4 py-2 rounded-full hover:bg-slate-900 transition-all">Upload CV</a>
          )}
        </div>
      )}

      {/* Extreme Premium Data Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-10">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                     <th className="py-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[35%]">Primary Role Designation</th>
                     <th className="py-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Corporation</th>
                     <th className="py-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">HQ / Region</th>
                     <th className="py-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Reqt</th>
                     <th className="py-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Commitment</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {currentJobs.length > 0 ? (
                     currentJobs.map((job) => {
                        const hasApplied = appliedJobs.includes(job._id);
                        return (
                           <tr key={job._id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[1rem] bg-slate-100 border border-slate-200 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white group-hover:border-transparent transition-all duration-300">
                                       <Briefcase size={18} />
                                    </div>
                                    <div>
                                       <p className="font-black text-sm text-slate-900 leading-tight mb-1 group-hover:text-brand-blue transition-colors">{job.title}</p>
                                       <div className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{job.role} Sector</p>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white text-[10px] font-black">
                                       {job.company?.name?.charAt(0) || 'C'}
                                    </div>
                                    <span className="text-xs font-black text-slate-700">{job.company?.name || 'Recruiter'}</span>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-2 bg-slate-100 w-max px-3 py-1.5 rounded-lg border border-slate-200/50">
                                    <MapPin size={12} className="text-slate-400" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">{job.location || 'Remote'}</span>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-lg border border-orange-200/50 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                    <span className="text-[10px] font-black tracking-widest whitespace-nowrap">CGPA {job.minCgpa}+</span>
                                 </div>
                              </td>
                              <td className="py-6 px-8 text-right">
                                 {hasApplied ? (
                                    <button disabled className="inline-flex items-center justify-center w-[130px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-600 cursor-not-allowed">
                                       Applied <Check size={14} className="ml-2" />
                                    </button>
                                 ) : (
                                    <button 
                                       onClick={() => handleApply(job)}
                                       disabled={applying === job._id}
                                       className="inline-flex items-center justify-center w-[130px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent disabled:shadow-none bg-slate-950 text-white shadow-lg shadow-black/10 hover:bg-brand-blue hover:shadow-blue-500/20 active:scale-95 border border-transparent"
                                    >
                                       {applying === job._id ? <Loader2 size={14} className="animate-spin" /> : <>Apply <ArrowRight size={14} className="ml-2" /></>}
                                    </button>
                                 )}
                              </td>
                           </tr>
                        );
                     })
                  ) : (
                     <tr>
                        <td colSpan="5" className="py-32 text-center bg-slate-50/30">
                           <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-[1rem] flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                              <Search size={24} className="text-slate-300 relative z-10" />
                           </div>
                           <p className="text-base font-black text-slate-900">No organizational matches found</p>
                           <p className="text-slate-400 text-xs font-bold mt-1">Try adjusting the search criteria or category filter.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Ultra Clean Pagination */}
      {totalPages > 1 && (
         <div className="flex items-center justify-between pb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
               Showing <span className="text-slate-900 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 mx-1">{indexOfFirstJob + 1} - {Math.min(indexOfLastJob, filteredJobs.length)}</span> records
            </p>
            
            <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <button 
                 onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                 disabled={currentPage === 1}
                 className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-brand-orange disabled:opacity-30 transition-all font-black"
               >
                 <ChevronLeft size={16} />
               </button>
               
               <div className="flex gap-1 border-x border-slate-100 px-1.5">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx + 1)}
                      className={`w-9 h-9 rounded-xl text-[11px] font-black transition-all ${
                         currentPage === idx + 1 
                         ? 'bg-slate-950 text-white shadow-md' 
                         : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
               </div>

               <button 
                 onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                 disabled={currentPage === totalPages}
                 className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-brand-orange disabled:opacity-30 transition-all font-black"
               >
                 <ChevronRight size={16} />
               </button>
            </div>
         </div>
      )}
    </DashboardLayout>
  );
};

export default JobBoard;
