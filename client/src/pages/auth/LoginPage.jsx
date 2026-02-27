import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import loginImg from '../../assets/login.png';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use 'email' field as the identifier (backend now supports both)
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        const userRole = res.data.data.user.role;
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'company') navigate('/company');
        else navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative">
      {/* Back button */}
      <nav className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center text-slate-500 hover:text-brand-blue transition-colors font-bold bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <ChevronLeft size={20} /> Home
        </Link>
      </nav>

      {/* Side Illustration */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center relative p-20 border-r border-slate-100">
        <div className="relative z-10 w-full max-w-lg">
          <img src={loginImg} alt="Login Illustration" className="w-full h-auto drop-shadow-xl" />
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tighter">Secure Gateway</h2>
            <p className="text-slate-500 leading-relaxed max-w-sm mx-auto font-medium italic">
              "Access your personalized placement portal with secure multi-role authentication."
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md p-10 lg:p-12 relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Login</h3>
            <p className="text-slate-500 font-medium">Capture your credentials to continue</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200 mb-8 max-w-[240px] mx-auto lg:mx-0">
             <button onClick={() => setRole('student')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400'}`}>Student</button>
             <button onClick={() => setRole('admin')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400'}`}>Admin</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                {role === 'admin' ? 'Username' : 'Email Address'}
              </label>
              <div className="relative">
                {role === 'admin' ? (
                  <LogIn className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
                ) : (
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
                )}
                <input 
                  type={role === 'admin' ? 'text' : 'email'}
                  name="email"
                  required
                  className="w-full bg-transparent border-b-2 border-slate-100 py-4 pl-8 pr-4 focus:outline-none focus:border-brand-blue transition-all text-slate-900 font-bold placeholder:text-slate-200"
                  placeholder={role === 'admin' ? 'admin_username' : 'name@university.com'}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-transparent border-b-2 border-slate-100 py-4 pl-8 pr-4 focus:outline-none focus:border-brand-blue transition-all text-slate-900 font-bold placeholder:text-slate-200"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue py-5 rounded-full font-black text-xs uppercase tracking-widest text-white hover:bg-slate-950 shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {loading ? 'Validating...' : (
                <>
                  Secure Login <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-400 text-sm font-bold flex flex-col gap-2">
            <div>
              New here? 
              <Link to="/register" className="text-brand-orange ml-1 hover:underline">Create Account</Link>
            </div>
            <Link to="/" className="text-slate-300 hover:text-slate-500 transition-colors uppercase text-[10px] tracking-widest mt-4">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
