import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, ChevronLeft, Briefcase, GraduationCap, FileText, CheckCircle, ArrowRight, ArrowLeft, Upload, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import registerImg from '../../assets/register.png';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student');
  const [uploadOption, setUploadOption] = useState('later');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    percentage10th: '',
    percentageIntermediate: '',
    cgpaBTech: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (role === 'student' && formData.cgpaBTech > 10) {
      return setError('CGPA must be on a 10.0 scale. Please check your value (max 10).');
    }
    
    setLoading(true);
    setError('');

    try {
      // First, register the user
      const registerData = { ...formData, role };
      const res = await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      if (res.data.success) {
        const token = res.data.data.token;
        
        // If "Now" and file exists, perform resume upload immediately
        if (uploadOption === 'now' && file) {
          const fileData = new FormData();
          fileData.append('resume', file);
          await axios.post('http://localhost:5000/api/users/profile/resume', fileData, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        }

        // Successfully registered! Redirect to Login
        alert('Registration Successful! Redirecting to Login...');
        navigate('/login');
      }
    } catch (err) {
      console.error("Full Registration Error Stack:", err);
      const serverErr = err.response?.data?.error;
      const axiosMsg = err.message;
      setError(serverErr || (axiosMsg === 'Network Error' ? 'Server is offline. Start the Node.js backend!' : axiosMsg) || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden">
      {/* Back button */}
      <nav className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center text-slate-500 hover:text-brand-blue transition-colors font-bold bg-white px-4 py-3 rounded-full border border-slate-200 shadow-sm">
          <ChevronLeft size={20} /> Home
        </Link>
      </nav>

      {/* Side Illustration & Info */}
      <div className="hidden lg:flex w-[40%] bg-slate-50 items-center justify-center relative p-20 border-r border-slate-100">
        <div className="relative z-10 w-full max-w-lg text-center">
          <img src={registerImg} alt="Register" className="w-full h-auto drop-shadow-2xl mb-12" />
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Start Your Journey</h2>
          <p className="text-slate-500 font-medium leading-relaxed italic">
            "Your profile is the gateway to your dream career. Let's make it count."
          </p>
          
          {role !== 'admin' && (
            <div className="mt-16 flex justify-center gap-3">
               {[1,2,3].map(i => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-brand-blue' : 'w-4 bg-slate-200'}`}></div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-2xl">
          <div className="mb-10">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {role === 'admin' ? 'Admin Profile' : step === 1 ? 'Personal Profile' : step === 2 ? 'Academic Credentials' : 'Finalize Profile'}
            </h3>
            {role !== 'admin' && <p className="text-slate-500 font-medium mt-1">Step {step} of 3</p>}
            {role === 'admin' && <p className="text-slate-500 font-medium mt-1">Single-step Gateway Access</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-[2rem] mb-8 text-sm flex items-center gap-3 animate-in slide-in-from-top-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> {error}
            </div>
          )}

          {/* Form Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
               {/* Role Toggle */}
               <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200 max-w-xs mb-10">
                 <button onClick={() => {setRole('student'); setStep(1);}} className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Student</button>
                 <button onClick={() => {setRole('admin'); setStep(1);}} className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Admin</button>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="e.g. John" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="e.g. Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="johndoe123" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="john@university.edu" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="••••••••" />
                  </div>
               </div>

               <div className="flex justify-end pt-8">
                  <button 
                    onClick={role === 'admin' ? handleSubmit : nextStep} 
                    disabled={loading}
                    className="bg-brand-blue text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : role === 'admin' ? <>Finish & Signup <CheckCircle size={18} /></> : <>Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
               </div>
            </div>
          )}

          {/* Form Step 2: Academics */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
               <div className="grid gap-10">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm border border-slate-100"><GraduationCap size={32}/></div>
                     <div>
                        <h4 className="font-black text-slate-900">Academic Verification</h4>
                        <p className="text-xs text-slate-400 font-medium">Capture your institutional performance for industry vetting.</p>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">10th Class Percentage</label>
                      <input type="number" name="percentage10th" value={formData.percentage10th} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="e.g. 92.5" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Intermediate (%)</label>
                      <input type="number" name="percentageIntermediate" value={formData.percentageIntermediate} onChange={handleChange} className="w-full py-4 bg-transparent border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-bold placeholder:text-slate-200" placeholder="e.g. 88.0" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">B.Tech CGPA (10.0 Scale)</label>
                       <input type="number" max="10" step="0.01" name="cgpaBTech" value={formData.cgpaBTech} onChange={handleChange} className="w-full py-4 text-3xl font-black bg-transparent border-b-2 border-slate-100 focus:border-brand-orange outline-none transition-all placeholder:text-slate-100 text-brand-orange" placeholder="8.50" />
                    </div>
                  </div>
               </div>

               <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"><ArrowLeft size={18}/> Back</button>
                  <button onClick={nextStep} className="bg-brand-blue text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group">
                    Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}

          {/* Form Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
               <div>
                  <h4 className="text-[10px] font-black uppercase text-brand-orange tracking-widest mb-6 border-l-2 border-brand-orange pl-3">Resume Onboarding</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setUploadOption('now')}
                       className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center group ${uploadOption === 'now' ? 'bg-brand-blue/5 border-brand-blue' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${uploadOption === 'now' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Upload size={24} />
                        </div>
                        <p className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">Upload Now</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">Sync with Cloudinary</p>
                     </button>
                     <button 
                       onClick={() => setUploadOption('later')}
                       className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center group ${uploadOption === 'later' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${uploadOption === 'later' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Clock size={24} />
                        </div>
                        <p className={`font-black text-xs uppercase tracking-widest mb-1 ${uploadOption === 'later' ? 'text-white' : 'text-slate-900'}`}>Maybe Later</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">Complete in Dashboard</p>
                     </button>
                  </div>
               </div>

               {uploadOption === 'now' && (
                 <div className="animate-in slide-in-from-top-4">
                    <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center hover:border-brand-blue transition-all bg-slate-50/50 group">
                       <input 
                         type="file" 
                         accept=".pdf"
                         onChange={(e) => setFile(e.target.files[0])}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       />
                       <FileText size={32} className="mx-auto text-slate-300 mb-4 group-hover:text-brand-blue group-hover:-translate-y-1 transition-all" />
                       <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                         {file ? file.name : 'Select PDF Resume'}
                       </p>
                       <p className="text-[10px] text-slate-400 font-bold mt-2">Maximum 5MB</p>
                    </div>
                 </div>
               )}

               <div className="flex justify-between pt-8 items-center">
                  <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"><ArrowLeft size={18}/> Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-brand-orange text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-slate-950 transition-all shadow-2xl shadow-orange-500/20 active:scale-95 group"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Finish & Signup <CheckCircle size={18} /></>}
                  </button>
               </div>
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold">Already part of PlacePro?</p>
            <Link to="/login" className="text-brand-blue font-black text-[10px] uppercase tracking-widest hover:underline px-6 py-2 rounded-full hover:bg-slate-50 transition-all">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
