import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FileText, 
  Shield, 
  Search, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  ArrowUp,
  TrendingUp,
  Target,
  FileSearch,
  Cpu
} from 'lucide-react';
import { userService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ResumeIntelligence = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Full Stack');
  const navigate = useNavigate();

  // Realistic Role Matrix
  const roleData = {
    'Full Stack': {
      required: ['React.js', 'Node.js', 'PostgreSQL', 'Spring Boot', 'Git', 'Agile', 'Docker', 'Redis'],
      projects: ['E-commerce Platform', 'Social Media Dashboard'],
      insight: 'Strong core in Java/React. Focus on Cloud deployment and Caching for Tier-1 readiness.'
    },
    'Cloud Engineer': {
      required: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Jenkins', 'Networking', 'Python'],
      projects: ['Multi-region Deployment', 'Serverless API Architecture'],
      insight: 'High potential in infrastructure. You need more hands-on Experience with IaC (Terraform).'
    },
    'Frontend Developer': {
      required: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Jest', 'A/B Testing'],
      projects: ['Component Library', 'High-Performance Dashboard'],
      insight: 'Excellent React skills. Transition to TypeScript to meet modern enterprise standards.'
    },
    'Backend Developer': {
      required: ['Node.js', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC', 'Unit Testing', 'SQL'],
      projects: ['Distributed Auth System', 'Real-time Analytics Engine'],
      insight: 'Solid DB knowledge. Expand into Event-Driven Architecture (Kafka) for senior roles.'
    },
    'Data Scientist': {
      required: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Statistics', 'Matplotlib', 'Tableau', 'BigQuery'],
      projects: ['Predictive Sales Model', 'User Churn Analysis'],
      insight: 'Great Python usage. Focus on advanced data visualization and SQL optimization.'
    },
    'AI Developer': {
      required: ['PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Deep Learning', 'Python', 'MLOps'],
      projects: ['CNN Image Classifier', 'Transformer-based Chatbot'],
      insight: 'Solid foundation in math. Bridges the gap with MLOps and Neural Network optimization.'
    }
  };

  // Simulated Extracted Skills from User Resume
  const studentProfile = {
    skills: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Git', 'Agile', 'SQL', 'HTML', 'CSS', 'JavaScript', 'Python'],
    projects: ['Library Management System', 'Personal Portfolio']
  };

  const calculateAnalysis = () => {
    const target = roleData[selectedRole].required;
    const matches = target.filter(skill => studentProfile.skills.includes(skill));
    const gaps = target.filter(skill => !studentProfile.skills.includes(skill));
    const score = Math.round((matches.length / target.length) * 100);
    
    return {
      score,
      matches,
      gaps,
      readiness: score > 80 ? 'High' : score > 50 ? 'Moderate' : 'Developing',
      insight: roleData[selectedRole].insight,
      projectGaps: roleData[selectedRole].projects.filter(p => !studentProfile.projects.includes(p))
    };
  };

  const analysis = calculateAnalysis();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getProfile();
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-20 flex flex-col items-center justify-center">
          <Cpu size={48} className="animate-spin text-brand-blue mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Scanning Resume Engine...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user?.resumeUrl) {
    return (
      <DashboardLayout>
        <div className="py-32 px-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
           <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 relative">
              <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-2xl animate-pulse"></div>
              <FileSearch size={48} className="relative z-10" />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-tighter">Identity Not Spotted</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                 The AI Intelligence engine requires your institutional resume to generate a readiness map. 
                 Currently, your profile is <span className="text-brand-orange font-bold">Incomplete</span>.
              </p>
           </div>

           <div className="pt-6">
              <button 
                onClick={() => navigate('/student/profile')}
                className="bg-brand-blue text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
              >
                 Upload Resume Now
              </button>
           </div>
           
           <div className="pt-12 grid grid-cols-2 gap-4 w-full text-left">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirement</h4>
                 <p className="text-xs font-bold text-slate-700">PDF Format Only</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Size Limit</h4>
                 <p className="text-xs font-bold text-slate-700">Max 5.0 MB</p>
              </div>
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Role Selector */}
        <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar">
           <div className="flex items-center gap-3 px-6 border-r border-slate-100 shrink-0">
              <Target size={20} className="text-brand-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Path</span>
           </div>
           <div className="flex gap-2">
              {Object.keys(roleData).map(role => (
                <button 
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${selectedRole === role ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {role}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Readiness HUD */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16"></div>
              
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-10">Readiness HUD</h3>
              
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" strokeWidth="12" fill="transparent" className="text-slate-100" stroke="currentColor" />
                    <circle cx="96" cy="96" r="88" strokeWidth="12" fill="transparent" strokeDasharray="552.9" strokeDashoffset={552.9 - (552.9 * analysis.score) / 100} className="text-brand-blue transition-all duration-1000" stroke="currentColor" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-end">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{analysis.score}</span>
                      <span className="text-xl font-black text-slate-400 mb-1">%</span>
                    </div>
                    <span className="text-[9px] uppercase font-black text-brand-blue tracking-widest mt-1">Match Rate</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-sm font-medium mb-1 italic">"{analysis.readiness}" Readiness</p>
                  <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${analysis.score > 70 ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                    Tier-1 Priority
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent)]"></div>
              <Shield size={40} className="text-brand-blue mb-6 opacity-50" />
              <h4 className="text-xl font-bold mb-4 tracking-tight">AI Diagnostic</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium italic">
                "{analysis.insight}"
              </p>
              <div className="flex items-center gap-2 text-brand-blue text-[10px] font-black uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Improve Profile <ArrowUp size={14} />
              </div>
            </div>
          </div>

          {/* Right Column: Keyword Intelligence */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-1">Intelligence Engine</h3>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resume Keywords vs {selectedRole}</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest divide-x divide-slate-200">
                  <span className="pr-2 flex items-center gap-1"><TrendingUp size={12} className="text-emerald-500" /> Live Analysis</span>
                  <span className="pl-2">ATS 4.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle size={18} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Matches Found ({analysis.matches.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matches.map(keyword => (
                      <span key={keyword} className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {keyword}
                      </span>
                    ))}
                    {analysis.matches.length === 0 && <span className="text-slate-300 italic text-xs">No direct matches identified.</span>}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <AlertCircle size={18} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Missing Keywords ({analysis.gaps.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.gaps.map(gap => (
                      <span key={gap} className="px-4 py-2 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {gap}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Gaps Section */}
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 group transition-all">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Zap size={24} />
                   </div>
                   <h4 className="font-black text-slate-900 tracking-tight">Project Gaps</h4>
                </div>
                <div className="space-y-3">
                  {analysis.projectGaps.map((project, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-600">
                       <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px]">{idx + 1}</span>
                       {project}
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path Sync */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                   <h4 className="font-black text-slate-900 tracking-tight text-xl mb-2">Tier-1 Roadmap</h4>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed">Your current profile is optimized for mid-market roles. Acquire the missing gaps to target Tier-1 tech giants.</p>
                </div>
                <button className="w-full mt-6 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-blue transition-all">
                   Generate Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeIntelligence;
