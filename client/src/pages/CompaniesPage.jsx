import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Building2, Star, Users, MapPin, Search } from 'lucide-react';
import { companyService } from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companyService.getCompanies();
        setCompanies(res.data.data);
      } catch (err) {
        console.error("Failed to load companies cache", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
     setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-400 hover:text-brand-blue transition-colors">
             <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-black text-brand-blue flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-[10px] font-black">P</div>
            Corporate Hub
          </h1>
        </div>
      </nav>

      {/* Header Section */}
      <div className="bg-slate-950 py-20 px-6 border-b-8 border-brand-blue relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <h2 className="text-5xl font-black text-white tracking-tight mb-4">Discover Top Organizations</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-12">
              Explore our vetted network of Multi-National Corporations.
              Showing {filteredCompanies.length} available corporate profiles.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
               <input 
                 type="text" 
                 placeholder="Search by company name, industry, or MNC type..." 
                 className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-5 pl-14 pr-6 text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-blue transition-all"
                 value={searchTerm}
                 onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset page on query change
                 }}
               />
               <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto max-w-6xl px-6 pt-16">
        {loading ? (
             <div className="py-32 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin mb-6"></div>
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Compiling Database</h3>
                 <p className="text-slate-400 text-sm font-medium mt-2">Syncing with global recruitment APIs...</p>
             </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentCompanies.map((company, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-blue/30 transition-all flex flex-col group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${(idx%9) * 50}ms` }}>
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-300 group-hover:bg-brand-blue group-hover:text-white transition-all uppercase">
                          {company.name.charAt(0)}
                       </div>
                       <div className="flex items-center gap-1.5 bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                          <Star size={12} className="fill-current" /> {company.rating > 0 ? company.rating : 'New'}
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-brand-blue transition-colors">{company.name}</h3>
                    <p className="text-xs text-slate-400 font-bold mb-6 italic">{company.reviews ? `${company.reviews} Reviews` : 'Verified Partner'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8 flex-1">
                       {company.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                             {tag}
                          </span>
                       ))}
                       {company.tags.length > 4 && (
                          <span className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                             +{company.tags.length - 4} More
                          </span>
                       )}
                    </div>
                    
                    <button className="w-full py-4 rounded-full border-2 border-slate-100 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all">
                       View Placements
                    </button>
                 </div>
              ))}
              
              {filteredCompanies.length === 0 && (
                 <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-black text-slate-900">No matching organizations</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2">Try adjusting your search criteria.</p>
                 </div>
              )}
            </div>

            {/* Pagination Widget */}
            {totalPages > 1 && (
               <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                     Showing Index <span className="text-slate-900">{indexOfFirst + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLast, filteredCompanies.length)}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                       disabled={currentPage === 1}
                       className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-brand-blue hover:text-white hover:border-brand-blue disabled:opacity-50 transition-all"
                     >
                       <ChevronLeft size={16} />
                     </button>
                     
                     <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, idx) => (
                           <button
                             key={idx}
                             onClick={() => handlePageChange(idx + 1)}
                             className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                                currentPage === idx + 1 
                                ? 'bg-brand-orange text-white shadow-md' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             {idx + 1}
                           </button>
                        ))}
                     </div>

                     <button 
                       onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                       disabled={currentPage === totalPages}
                       className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-brand-blue hover:text-white hover:border-brand-blue disabled:opacity-50 transition-all"
                     >
                       <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
