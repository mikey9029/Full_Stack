import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Search, User, Mail, GraduationCap, FileText, 
  ArrowUpDown, Filter, Loader2, ExternalLink,
  Eye, Send, CheckCircle2, AlertCircle, Info,
  X, Phone, ShieldCheck, Calendar 
} from 'lucide-react';
import { userService } from '../../services/api';

const StudentDetailsModal = ({ student, onClose, onContact, isSending }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative h-40 bg-gradient-to-r from-brand-blue to-indigo-600 p-8 flex items-end">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
          >
             <X size={20} />
          </button>
          <div className="flex items-center gap-6 translate-y-12">
             <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-brand-blue border-4 border-white">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
             </div>
             <div className="pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white drop-shadow-sm">{student.firstName} {student.lastName}</h3>
                  {student.isVerified && <ShieldCheck size={20} className="text-emerald-400 fill-emerald-400/20" />}
                </div>
                <p className="text-white/80 font-bold text-sm tracking-wide uppercase">Institutional Candidate</p>
             </div>
          </div>
        </div>

        <div className="p-8 pt-16 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Academic Performance</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-600">B.Tech CGPA</span>
                       <span className="text-sm font-black text-brand-blue">{student.cgpaBTech || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-600">12th Grade</span>
                       <span className="text-sm font-black text-slate-900">{student.percentageIntermediate || 'N/A'}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-600">10th Grade</span>
                       <span className="text-sm font-black text-slate-900">{student.percentage10th || 'N/A'}%</span>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
                 <div className="space-y-3 font-bold text-sm text-slate-900">
                    <div className="flex items-center gap-3">
                       <Mail size={16} className="text-brand-blue" />
                       <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone size={16} className="text-brand-blue" />
                       {student.phone || 'No phone provided'}
                    </div>
                    <div className="flex items-center gap-3">
                       <Calendar size={16} className="text-brand-blue" />
                       Joined {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>
           </div>

           <div className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${student.isVerified ? 'bg-emerald-50/50 border-emerald-100' : 'bg-blue-50/50 border-blue-100'}`}>
              <div className="flex items-center gap-3">
                 {student.isVerified ? <ShieldCheck size={24} className="text-emerald-500" /> : <Info size={24} className="text-brand-blue" />}
                 <div>
                    <p className="font-bold text-slate-900 leading-none mb-1">Verification Status</p>
                    <p className="text-xs font-bold text-slate-500">{student.isVerified ? 'Credentials fully audited and verified.' : 'Profile pending administrative verification.'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className={`text-2xl font-black leading-none ${student.isVerified ? 'text-emerald-500' : 'text-brand-blue'}`}>
                  {student.isVerified ? 'VERIFIED' : `${student.profileProgress}%`}
                 </p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Status</p>
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-50 transition-all font-sans"
           >
              Close Overseer
           </button>
           <button 
            onClick={() => onContact(student._id)}
            disabled={isSending}
            className={`flex-1 py-4 font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-blue-200 text-center flex items-center justify-center gap-2 font-sans transition-all ${isSending ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-brand-blue text-white hover:bg-blue-600'}`}
           >
              {isSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending via Brevo...
                </>
              ) : (
                <>
                  <Send size={16} /> Contact Candidate
                </>
              )}
           </button>
        </div>
      </div>
    </div>
  );
};

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minCgpa, setMinCgpa] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await userService.getStudents();
      setStudents(res.data.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await userService.verifyStudent(id);
      setStudents(prev => prev.map(s => s._id === id ? { ...s, isVerified: res.data.data.isVerified } : s));
    } catch (err) {
      console.error('Failed to verify student:', err);
    }
  };

  const handleContact = async (id) => {
    try {
      setEmailSending(true);
      await userService.contactStudent(id);
      alert('Official email outreach dispatched successfully via Brevo 🚀');
    } catch (err) {
      console.error('Failed to contact student:', err);
      alert('Failed to send email. Check backend logs.');
    } finally {
      setEmailSending(false);
    }
  };

  const getReadiness = (student) => {
    if (student.isVerified) return { label: 'Certified', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: ShieldCheck };
    const cgpa = student.cgpaBTech || 0;
    const progress = student.profileProgress || 0;
    
    if (cgpa >= 8.5 && progress >= 90) return { label: 'Ready', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 };
    if (cgpa >= 7.5) return { label: 'Steady', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Info };
    return { label: 'In Review', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: AlertCircle };
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCgpa = (student.cgpaBTech || 0) >= minCgpa;
    return matchesSearch && matchesCgpa;
  });

  return (
    <DashboardLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-tighter">Candidate Registry</h2>
          <p className="text-slate-500 font-medium">Official administrative verification and monitoring hub for student recruitment.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 min-w-[300px]">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="bg-transparent border-none outline-none text-sm font-bold w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <Filter size={18} className="text-slate-400" />
              <select 
                className="bg-transparent border-none outline-none text-sm font-bold pr-4"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
              >
                <option value={0}>Min Academic CGPA</option>
                <option value={6}>6.0+</option>
                <option value={7}>7.0+</option>
                <option value={8}>8.0+</option>
                <option value={9}>9.0+</option>
              </select>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-40 text-center flex flex-col items-center gap-4">
             <Loader2 size={32} className="animate-spin text-brand-blue" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Administrative Records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Standing</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Hub</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Administrative Suite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => {
                  const readiness = getReadiness(student);
                  const ReadinessIcon = readiness.icon;
                  
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center font-black text-sm border border-blue-100/50">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 leading-none">
                              <p className="font-bold text-slate-900">{student.firstName} {student.lastName}</p>
                              {student.isVerified && <ShieldCheck size={12} className="text-emerald-500 fill-emerald-500/10" />}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <Mail size={10} /> <span className="max-w-[150px] truncate">{student.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <p className="font-bold text-slate-900 text-sm">{student.cgpaBTech ? `${student.cgpaBTech} CGPA` : 'N/A'}</p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <GraduationCap size={10} /> B.Tech Undergraduate
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 border ${readiness.color} rounded-xl`}>
                            <ReadinessIcon size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{readiness.label}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => handleVerify(student._id)}
                             className={`p-2.5 rounded-xl transition-all ${student.isVerified ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                             title={student.isVerified ? 'Credentials Verified' : 'Verify Credentials'}
                           >
                              <ShieldCheck size={18} />
                           </button>
                           <button 
                             onClick={() => setSelectedStudent(student)}
                             className="p-2.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                             title="Full Profile Inspection"
                           >
                              <Eye size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-20 text-center">
                 <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching student records found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <StudentDetailsModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        onContact={handleContact}
        isSending={emailSending}
      />
    </DashboardLayout>
  );
};

export default ManageStudents;

