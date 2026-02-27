import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Briefcase, CheckCircle, Clock, ArrowUpRight, GraduationCap, MapPin, Building2, Search, Loader2 } from 'lucide-react';
import { jobService, userService, applicationService } from '../../services/api';
import trainingImg from '../../assets/trainingicon.png';
import walkImg from '../../assets/walk.png';

const StudentDashboard = () => {
  const [itJobs, setItJobs] = useState([]);
  const [bpJobs, setBpJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    active: 0,
    shortlisted: 0,
    eligible: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Fresh Profile from DB
        const profileRes = await userService.getProfile();
        const userData = profileRes.data.data;
        setUserProfile(userData);
        
        // 2. Fetch Applications to calculate counts
        const appsRes = await applicationService.getStudentApplications();
        const apps = appsRes.data.data;
        
        // 3. Fetch All Jobs to calculate eligibility and feed
        const jobsRes = await jobService.getJobs();
        const allJobs = jobsRes.data.data;
        
        // Calculate Dynamic Stats
        const shortlisted = apps.filter(a => a.status === 'Accepted' || a.status === 'Interview').length;
        const eligibleJobs = allJobs.filter(j => (parseFloat(userData.cgpaBTech) || 0) >= (j.minCgpa || 0));

        setCounts({
          active: apps.length,
          shortlisted: shortlisted,
          eligible: eligibleJobs.length
        });

        // Split feed based on roles
        setItJobs(eligibleJobs.filter(j => j.role === 'IT' || j.role === 'Engineering').slice(0, 3));
        setBpJobs(eligibleJobs.filter(j => j.role === 'BP' || j.role === 'Management' || j.role === 'HR').slice(0, 2));
        
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'Active Applications', value: counts.active.toString(), icon: Clock, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { name: 'Shortlisted', value: counts.shortlisted.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Total Eligible Matches', value: counts.eligible.toString(), icon: Briefcase, color: 'text-brand-blue', bg: 'bg-blue-50' },
  ];

  const JobCard = ({ job }) => (
    <div className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between transition-all hover:border-brand-blue/30 hover:shadow-lg group mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-300 group-hover:bg-brand-blue group-hover:text-white transition-colors uppercase">
            {job.company?.name ? job.company.name.charAt(0) : 'J'}
          </div>
          <div>
            <h4 className="font-black text-lg text-slate-900 group-hover:text-brand-blue transition-colors leading-tight mb-1">{job.title}</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Building2 size={12} /> {job.company?.name || 'Recruiter'}
            </div>
          </div>
        </div>
        <div className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1 shrink-0">
          CGPA {job.minCgpa}+
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-50">
         <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin size={14} className="text-slate-400" /> {job.location || 'Remote'}
         </span>
         <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Briefcase size={14} className="text-slate-400" /> {job.salary || 'Competitive'}
         </span>
         <a href="/student/jobs" className="ml-auto text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">
            View Listing
         </a>
      </div>
    </div>
  );

  if (loading) return (
    <DashboardLayout>
      <div className="p-20 text-center flex flex-col items-center">
        <Loader2 size={40} className="animate-spin text-brand-blue mb-4" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Synchronizing Dashboard Matrix...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-3 gap-8 mb-12 animate-in slide-in-from-top-4 duration-500">
        {stats.map((stat) => (
          <div key={stat.name} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-sm border border-white/40`}>
              <stat.icon size={26} className={stat.color} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight text-slate-950">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Career Progress Banner */}
          <section className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden">
             <div className="md:w-1/4">
                <img src={walkImg} alt="Progress" className="w-full h-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-700" />
             </div>
             <div className="md:w-3/4 space-y-4">
                <span className="text-[9px] font-black text-brand-orange uppercase tracking-[0.2em]">Career Roadmap</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Granted, {userProfile?.firstName || 'Student'}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  You are officially verified. Explore <strong className="text-brand-blue">{counts.eligible} tailored jobs</strong> mapped specifically to your {userProfile?.cgpaBTech || '0.0'} CGPA scale. Track your applications from assessments to final rounds.
                </p>
                <div className="flex gap-4">
                  <div className="w-1/2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600">Profile 100% Vetted</span>
                </div>
             </div>
          </section>

          {/* Realistic Job Feed Split */}
          <section className="animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-brand-blue rounded-full"></span>
                IT & Engineering Roles
              </h3>
            </div>
            <div>
               {itJobs.length > 0 ? itJobs.map((job) => <JobCard key={job._id} job={job} />) : 
                <div className="p-10 border border-dashed text-slate-400 text-sm rounded-3xl flex items-center justify-center gap-3">
                   <Search size={18} /> No IT roles matched your current {userProfile?.cgpaBTech} CGPA.
                </div>}
            </div>

            <div className="flex justify-between items-center mb-8 mt-12">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-brand-orange rounded-full"></span>
                Business & Management (BP)
              </h3>
            </div>
            <div>
               {bpJobs.length > 0 ? bpJobs.map((job) => <JobCard key={job._id} job={job} />) : 
                <div className="p-10 border border-dashed text-slate-400 text-sm rounded-3xl flex items-center justify-center gap-3">
                   <Search size={18} /> No BP roles matched your qualification profile.
                </div>}
            </div>
          </section>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
          <section className="bg-slate-950 p-10 rounded-[3rem] border border-slate-900 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue blur-3xl opacity-20 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                  <GraduationCap size={24} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-white tracking-tight">Verified Profile</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Eligibility Stats</p>
               </div>
            </div>

            <ul className="space-y-6 relative z-10">
               <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-bold">B.Tech CGPA</span>
                  <span className="text-sm font-black text-brand-orange">{userProfile?.cgpaBTech || 'N/A'}/10</span>
               </li>
               <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-bold">Class 12th (%)</span>
                  <span className="text-sm font-black text-white">{userProfile?.percentageIntermediate || 'N/A'}%</span>
               </li>
               <li className="flex justify-between items-center pb-4">
                  <span className="text-xs text-slate-400 font-bold">Class 10th (%)</span>
                  <span className="text-sm font-black text-white">{userProfile?.percentage10th || 'N/A'}%</span>
               </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
               <CheckCircle size={16} className="text-emerald-500" />
               <p className="text-[10px] text-slate-300 font-bold">Fully synchronized with Placement DB</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900 border-b border-slate-100 pb-4">Recruitment Alerts</h3>
            <div className="space-y-6">
              {[
                { title: 'Resume Integrity', text: userProfile?.resumeUrl ? 'CV is verified and hosted on Cloudinary' : 'Upload CV to enable recruiter visibility', status: userProfile?.resumeUrl ? 'Success' : 'Action Required', color: userProfile?.resumeUrl ? 'bg-brand-blue' : 'bg-brand-orange' },
                { title: 'Credential Index', text: 'Academic metadata successfully indexed', status: 'System', color: 'bg-emerald-500' }
              ].map((update, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-100 rounded-3xl relative overflow-hidden transition-all hover:bg-slate-50">
                  <div className={`absolute top-0 left-0 w-1 h-full ${update.color}`}></div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{update.status}</p>
                  <h4 className="font-black text-slate-900 text-sm mb-1">{update.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{update.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
