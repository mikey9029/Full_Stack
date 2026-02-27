import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, Download, User, Mail, GraduationCap } from 'lucide-react';
import { userService } from '../../services/api';

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile();
      setProfile(res.data.data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMsg({ type: '', text: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg({ type: 'error', text: 'Please select a file first' });

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await userService.uploadResume(formData);
      setProfile(res.data.data);
      setMsg({ type: 'success', text: 'Resume uploaded successfully!' });
      setFile(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">Loading Secure Locker...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Credentials Locker</h2>
          <p className="text-slate-500 font-medium mt-2 max-w-xl">
             Your verified identity and academic transcripts are securely logged here. 
             This data automatically powers the recruitment eligibility engine.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
             {/* Personal Identity */}
             <section className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue blur-[100px] opacity-30 pointer-events-none"></div>
                
                <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                   <User size={20} className="text-brand-orange" /> Personal Vault
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Full Identity</p>
                      <p className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</p>
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Network Username</p>
                      <p className="text-xl font-bold text-brand-blue">@{profile?.username || 'unassigned'}</p>
                   </div>
                   <div className="md:col-span-2">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Communication Channel</p>
                      <p className="text-lg font-bold flex items-center gap-2"><Mail size={16} className="text-slate-400"/> {profile?.email}</p>
                   </div>
                </div>
             </section>

            {/* Resume Section */}
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Professional Resume</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Cloudinary Sync Enabled</p>
                  </div>
               </div>

               {profile?.resumeUrl ? (
                 <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-between mb-10 group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Resume Vaulted</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Available to Recruiters</p>
                       </div>
                    </div>
                    <a 
                      href={profile.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest bg-white shadow-sm px-6 py-3 rounded-full transition-all border border-slate-200 hover:border-brand-blue hover:bg-blue-50"
                    >
                      Inspect <Download size={14} />
                    </a>
                 </div>
               ) : (
                 <div className="p-10 bg-orange-50/50 rounded-3xl border border-dashed border-orange-200 text-center mb-10">
                    <AlertCircle size={32} className="text-brand-orange mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-700">No Resume Uploaded</p>
                    <p className="text-xs text-slate-400 mt-1">Your visibility to MNCs is severely restricted without a CV.</p>
                 </div>
               )}

               <form onSubmit={handleUpload} className="space-y-6">
                  <div className="relative border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:border-brand-blue transition-all bg-slate-50/30 group">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,.doc,.docx"
                    />
                    <Upload size={32} className="mx-auto text-slate-300 group-hover:text-brand-blue group-hover:-translate-y-1 transition-all mb-4" />
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      {file ? file.name : 'Replace / Upload Resume'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2">Maximum File Size: 5MB</p>
                  </div>

                  {msg.text && (
                    <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      {msg.text}
                    </div>
                  )}

                  <button 
                    disabled={uploading || !file}
                    className="w-full py-5 bg-brand-blue text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-300"
                  >
                    {uploading ? (
                      <><Loader2 size={18} className="animate-spin" /> Transmitting...</>
                    ) : 'Commit to Locker'}
                  </button>
               </form>
            </section>
          </div>

          <div className="space-y-10">
             <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center">
                      <GraduationCap size={20} />
                   </div>
                   <h3 className="text-lg font-black text-slate-900">Academic Index</h3>
                </div>
                
                <div className="space-y-6">
                   <div className="pb-6 border-b border-slate-50 p-4 bg-slate-50/50 rounded-2xl">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">B.Tech CGPA</p>
                      <div className="flex justify-between items-end">
                         <p className="text-4xl font-black text-brand-orange">{profile?.cgpaBTech || '0.0'}</p>
                         <p className="text-xs font-bold text-slate-400 mb-1">/ 10.0</p>
                      </div>
                   </div>
                   
                   <div className="pb-4 border-b border-slate-50 flex justify-between items-center">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">12th Grade (%)</p>
                      <p className="text-lg font-black text-slate-900">{profile?.percentageIntermediate || 'NA'}</p>
                   </div>
                   
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">10th Grade (%)</p>
                      <p className="text-lg font-black text-slate-900">{profile?.percentage10th || 'NA'}</p>
                   </div>
                </div>
                <div className="mt-8 bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                   <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                      These grades are locked and verified by the administration. They are used to calculate your eligibility for MNC placements automatically.
                   </p>
                </div>
             </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;
