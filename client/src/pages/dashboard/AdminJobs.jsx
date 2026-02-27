import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Building2, 
  DollarSign, 
  GraduationCap,
  Loader2,
  X
} from 'lucide-react';
import { jobService, companyService } from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Software',
    type: 'Full-time',
    location: '',
    salary: '',
    minCgpa: '0',
    description: '',
    status: 'Open'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, compsRes] = await Promise.all([
        jobService.getJobs(),
        companyService.getCompanies()
      ]);
      setJobs(jobsRes.data.data);
      setCompanies(compsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      category: 'Software',
      type: 'Full-time',
      location: '',
      salary: '',
      minCgpa: '0',
      description: '',
      status: 'Open'
    });
    setEditJob(null);
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditJob(job);
      setFormData({
        title: job.title,
        company: job.company?._id || '',
        category: job.category || 'Software',
        type: job.type || 'Full-time',
        location: job.location || '',
        salary: job.salary || '',
        minCgpa: job.minCgpa || '0',
        description: job.description || '',
        status: job.status || 'Open'
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editJob) {
        await jobService.updateJob(editJob._id, formData);
      } else {
        await jobService.postJob(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobService.deleteJob(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <Briefcase size={36} className="text-brand-blue" />
              Job Postings
            </h2>
            <p className="text-slate-500 font-medium mt-1">Manage institutional recruitment drives and partner roles.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Post New Role
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-4"><Briefcase size={20}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Roles</p>
              <h4 className="text-2xl font-black text-slate-900">{jobs.length}</h4>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><CheckCircle2 size={20}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open Now</p>
              <h4 className="text-2xl font-black text-slate-900">{jobs.filter(j => j.status === 'Open').length}</h4>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center mb-4"><Clock size={20}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archived</p>
              <h4 className="text-2xl font-black text-slate-900">{jobs.filter(j => j.status === 'Closed').length}</h4>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Building2 size={20}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Sites</p>
              <h4 className="text-2xl font-black text-slate-900">{companies.length}</h4>
           </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search roles, companies or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 py-6 pl-16 pr-8 rounded-[2rem] outline-none shadow-sm focus:shadow-md transition-all font-bold placeholder:text-slate-200"
          />
        </div>

        {/* Jobs Table */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Loader2 size={40} className="animate-spin text-brand-blue" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Indexing Job Roles...</p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role & Organization</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Eligibility</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Package</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Master Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-brand-blue group-hover:text-white transition-all">
                             <Building2 size={24}/>
                          </div>
                          <div>
                             <p className="font-black text-slate-900 text-lg leading-tight mb-1">{job.title}</p>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{job.company?.name}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="text-[10px] font-bold text-slate-400">{job.location || 'Remote'}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-2">
                          <GraduationCap size={16} className="text-orange-500" />
                          <span className="text-sm font-black text-slate-700">{job.minCgpa}+ CGPA</span>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-1.5">
                          <DollarSign size={16} className="text-emerald-500" />
                          <span className="text-sm font-black text-slate-700">{job.salary}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                         job.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                       }`}>
                         {job.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(job)}
                            className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all"
                          >
                             <Edit3 size={18}/>
                          </button>
                          <button 
                            onClick={() => handleDelete(job._id)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                          >
                             <Trash2 size={18}/>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Creation/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {editJob ? 'Update Role' : 'Post New Role'}
              </h3>
              <p className="text-slate-500 font-medium mb-10">Configure professional requirements and package details.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Title</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none placeholder:text-slate-200"
                         placeholder="e.g. Senior Backend Dev"
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Company Partner</label>
                       <select 
                         required
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                         value={formData.company}
                         onChange={(e) => setFormData({...formData, company: e.target.value})}
                       >
                         <option value="">Select Partner</option>
                         {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                       <select 
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                       >
                         <option>Software</option>
                         <option>Design</option>
                         <option>Data Science</option>
                         <option>Management</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Type</label>
                       <select 
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                         value={formData.type}
                         onChange={(e) => setFormData({...formData, type: e.target.value})}
                       >
                         <option>Full-time</option>
                         <option>Internship</option>
                         <option>Contract</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Salary Package</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none placeholder:text-slate-200"
                         placeholder="e.g. 12 - 15 LPA"
                         value={formData.salary}
                         onChange={(e) => setFormData({...formData, salary: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Eligibility (CGPA)</label>
                       <input 
                         type="number" 
                         step="0.1" 
                         max="10"
                         className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none placeholder:text-slate-200"
                         placeholder="Min CGPA"
                         value={formData.minCgpa}
                         onChange={(e) => setFormData({...formData, minCgpa: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Status Control</label>
                    <div className="flex gap-4">
                       <button 
                         type="button"
                         onClick={() => setFormData({...formData, status: 'Open'})}
                         className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.status === 'Open' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 font-bold'}`}
                       >
                         Active / Open
                       </button>
                       <button 
                         type="button"
                         onClick={() => setFormData({...formData, status: 'Closed'})}
                         className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.status === 'Closed' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400 font-bold'}`}
                       >
                         Closed / Arch
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Description</label>
                    <textarea 
                      rows="4"
                      className="w-full bg-slate-50 border-none rounded-3xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none placeholder:text-slate-200 resize-none"
                      placeholder="Detail the technical requirements and role responsibilities..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="flex gap-4 pb-10">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Dismiss
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-2 w-[60%] py-5 bg-brand-blue text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : (editJob ? 'Commit Changes' : 'Publish Drive')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminJobs;
