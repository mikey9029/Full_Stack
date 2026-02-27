import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Building2, Users, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import homeImg from '../assets/home.png';
import applyImg from '../assets/apply.png';
import studentsImg from '../assets/students.png';
import teamImg from '../assets/team.png';
import pplImg from '../assets/ppl.png';
import trainingIcon from '../assets/trainingicon.png';
import hireImg from '../assets/hire1.png';

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <nav className="flex justify-between items-center px-10 py-4 bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <h1 className="text-2xl font-black text-brand-blue flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-[10px] font-black">P</div>
          PlacePro
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 w-64 group focus-within:border-brand-blue transition-all">
            <input type="text" placeholder="Search IT jobs..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
            <Search size={16} className="text-slate-400 group-focus-within:text-brand-blue" />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-8 py-2.5 border border-brand-blue text-brand-blue rounded-full text-sm font-bold hover:bg-slate-50 transition-all">
              Login
            </Link>
            <Link to="/register" className="px-8 py-2.5 bg-brand-orange text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <span className="bg-blue-600/10 text-brand-blue text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Leading Placement Portal</span>
            <h1 className="text-5xl md:text-6xl font-black leading-tight text-slate-900">
              Steer Your <span className="text-brand-blue">Career</span> With Precision
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              A comprehensive bridge connecting ambitious talent with global industry leaders. Real-time tracking, verified profiles, and seamless recruitment.
            </p>
            
            <div className="flex pt-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-brand-blue text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-950 shadow-xl shadow-blue-500/20 transition-all">
                Get Started <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src={homeImg} 
              alt="Hero Illustration" 
              className="w-full h-auto drop-shadow-2xl animate-float" 
            />
          </div>
        </div>
      </section>

      {/* Informational Zig-Zag Sections */}
      <div className="container mx-auto px-6 py-32 space-y-32">
        
        {/* Section 1: Who We Are */}
        <section className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-blue/5 rounded-[3rem] blur-3xl"></div>
              <img src={studentsImg} alt="Students" className="w-full h-auto relative z-10 drop-shadow-xl" />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
             <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-4">
                <Users size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 leading-tight">Who We Are</h2>
             <p className="text-slate-500 font-medium leading-relaxed">
                PlacePro is an automated placement intelligence system designed to empower students and modernize campus recruitment. We provide the tools for students to showcase their verified potential to top-tier employers.
             </p>
             <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <ShieldCheck className="text-emerald-500" size={18} /> Verified Candidate Ecosystem
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <ShieldCheck className="text-emerald-500" size={18} /> Automated Skill Verification
                </li>
             </ul>
          </div>
        </section>

        {/* Section 2: What We Offer */}
        <section className="flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2">
             <img src={trainingIcon} alt="Training" className="w-full h-auto drop-shadow-xl" />
          </div>
          <div className="lg:w-1/2 space-y-6">
             <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 leading-tight">What We Offer</h2>
             <p className="text-slate-500 font-medium leading-relaxed">
                From specialized training modules to real-time application tracking, we offer a full suite of services that prepare you for the transition from campus to corporate.
             </p>
             <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <h4 className="font-black text-slate-900 mb-2">Skill Bootcamps</h4>
                   <p className="text-xs text-slate-400 font-medium">Intensive prep for tech and soft-skill interviews.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <h4 className="font-black text-slate-900 mb-2">Live Tracking</h4>
                   <p className="text-xs text-slate-400 font-medium">Real-time status updates on every application.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Section 3: What We Recruit */}
        <section className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
             <img src={hireImg} alt="Hiring" className="w-full h-auto drop-shadow-xl" />
          </div>
          <div className="lg:w-1/2 space-y-6">
             <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-4">
                <Building2 size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 leading-tight">What We Recruit</h2>
             <p className="text-slate-500 font-medium leading-relaxed">
                We bridge the gap between niche talent and specific industry needs, hiring for top Multi-National Corporations across Software, Data Science, and BPO sectors.
             </p>
             <div className="flex flex-wrap gap-3 pt-4">
                {['IT Services', 'Cloud Computing', 'Data Analytics', 'Business Solutions'].map(tag => (
                   <span key={tag} className="px-5 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
                ))}
             </div>
          </div>
        </section>

        {/* Community/Collaborative Row */}
        <section className="bg-slate-950 rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 blur-[100px] -z-0"></div>
           <div className="lg:w-1/2 space-y-6 relative z-10">
              <h2 className="text-4xl font-black text-white leading-tight">Join the Network</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Join thousands of students and recruiters already using PlacePro to reshape the placement landscape.
              </p>
              <Link to="/register" className="inline-block bg-brand-blue text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-brand-blue transition-all">
                Become a Member
              </Link>
           </div>
           <div className="lg:w-1/2 relative z-10">
              <img src={teamImg} alt="Team" className="w-full h-auto drop-shadow-2xl" />
           </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-white text-slate-900 py-20 border-t border-slate-100">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight">PlacePro</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Building the future of campus recruitment with automation and community.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Students</h4>
            <div className="flex flex-col gap-2 text-slate-500 text-sm font-medium">
              <Link to="#" className="hover:text-brand-blue transition-colors">Job Openings</Link>
              <Link to="#" className="hover:text-brand-blue transition-colors">Resources</Link>
              <Link to="#" className="hover:text-brand-blue transition-colors">Alumni Network</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Employers</h4>
            <div className="flex flex-col gap-2 text-slate-500 text-sm font-medium">
              <Link to="#" className="hover:text-brand-blue transition-colors">Post Opening</Link>
              <Link to="#" className="hover:text-brand-blue transition-colors">Our Process</Link>
            </div>
          </div>
          <div className="space-y-4">
             <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Legal</h4>
            <div className="flex flex-col gap-2 text-slate-500 text-sm font-medium">
              <Link to="#" className="hover:text-brand-blue transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-brand-blue transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 PlacePro Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
