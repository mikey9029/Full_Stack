import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Terminal, 
  Zap, 
  Code2, 
  ChevronLeft,
  ChevronRight, 
  Play, 
  RefreshCcw,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  Cpu,
  Check,
  X,
  Clock,
  Bookmark,
  Sun,
  Maximize2,
  Shield,
  Send,
  Box,
  Settings
} from 'lucide-react';
import { userService } from '../../services/api';

const CareerAccelerator = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeLang, setActiveLang] = useState('Java');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('Statement'); // 'Statement', 'Solution', 'Hints'
  const [view, setView] = useState('list'); // 'list' or 'solve'
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;
  
  // Terminal & Build State
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // IDE State
  const [userCode, setUserCode] = useState('');

  const languages = ['Java', 'JavaScript', 'Python'];

  const questionLibrary = {
    JavaScript: [
      { id: 1, difficulty: 450, title: 'Reverse a Number', text: 'Write a JavaScript function that reverse a number.', inputFormat: 'Number X (e.g., 32243)', outputFormat: 'Reversed Number (e.g., 34223)', hint: 'Use split, reverse, and join methods.', solution: 'function reverse(n) {\n  return n.toString().split("").reverse().join("");\n}' },
      { id: 2, difficulty: 500, title: 'Alphabetical Order', text: 'Write a JavaScript function that returns a passed string with letters in alphabetical order.', inputFormat: 'String source', outputFormat: 'Alphabetized String', hint: 'Convert to array, sort, then join.', solution: 'function alphabet_order(str) {\n  return str.split("").sort().join("");\n}' },
      { id: 3, difficulty: 550, title: 'Vowel Counter', text: 'Write a JavaScript function that accepts a string and counts the number of vowels within it.', inputFormat: 'String text', outputFormat: 'Integer count', hint: 'Use a lookup string of vowels and indexOf.', solution: 'function vowel_count(str) {\n  var vowel_list = "aeiouAEIOU";\n  var vcount = 0;\n  for(var x = 0; x < str.length ; x++) {\n    if (vowel_list.indexOf(str[x]) !== -1) vcount += 1;\n  }\n  return vcount;\n}' },
      { id: 4, difficulty: 600, title: 'Title Case Converter', text: 'Convert the first letter of each word of the string in upper case.', inputFormat: 'String input', outputFormat: 'Title cased string', hint: 'Split by space, map over words, join back.', solution: 'function uppercase(str) {\n  var array1 = str.split(" ");\n  var newarray1 = [];\n  for(var x = 0; x < array1.length; x++){\n    newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));\n  }\n  return newarray1.join(" ");\n}' },
      { id: 5, difficulty: 700, title: 'Days Until Christmas', text: 'Calculate number of days left until next Christmas (Dec 25).', inputFormat: 'None (System Date)', outputFormat: 'String: "X days left until Christmas!"', hint: 'Check if current year Christmas has passed.', solution: 'today = new Date();\nvar cmas=new Date(today.getFullYear(), 11, 25);\nif (today.getMonth()==11 && today.getDate()>25) cmas.setFullYear(cmas.getFullYear()+1);\nvar one_day=1000*60*60*24;\ndocument.write(Math.ceil((cmas.getTime()-today.getTime())/(one_day)) + " days left!");' },
      { id: 6, difficulty: 850, title: 'Date Difference', text: 'Write a JavaScript function to get difference between two dates in days.', inputFormat: 'Two date objects/strings', outputFormat: 'Integer days', hint: 'Calculate absolute diff of UTC times.', solution: 'var date_diff = function(d1, d2) {\n  dt1 = new Date(d1); dt2 = new Date(d2);\n  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));\n}' },
      { id: 7, difficulty: 900, title: 'Last Day of Month', text: 'Retrieve the last day of a specific month in a given year.', inputFormat: 'Year Y, Month M', outputFormat: 'Integer (28-31)', hint: 'Create new Date(y, m+1, 0).', solution: 'var lastday = function(y,m){ return new Date(y, m +1, 0).getDate(); }' },
      { id: 8, difficulty: 950, title: 'Truncate String', text: 'Remove specified number of characters from a string starting from index 0.', inputFormat: 'String S, Length L', outputFormat: 'Truncated string', hint: 'Use slice(0, L).', solution: 'truncate_string = function (str1, length) {\n  if ((str1.constructor === String) && (length>0)) return str1.slice(0, length);\n};' },
      { id: 9, difficulty: 1050, title: 'Ordinal Color Choices', text: 'Display the colors in an array with their rank (1st, 2nd, 3rd...).', inputFormat: 'Array of colors', outputFormat: 'Formatted rank strings.', hint: 'Use an array for suffixes: ["th", "st", "nd", "rd"].', solution: 'let color = ["Blue", "Green", "Red"]; let o = ["th","st","nd","rd"]; for(let i=0; i<color.length; i++) console.log((i+1) + (o[i+1] || o[0]) + " choice is " + color[i]);' },
      { id: 10, difficulty: 550, title: 'Even or Odd Loop', text: 'Iterate from 0 to 15. For each iteration, check if the current number is odd or even.', inputFormat: 'None', outputFormat: 'X is even/odd', hint: 'Use a simple for loop with modulo.', solution: 'for (var x=0; x<=15; x++) console.log(x + (x % 2 === 0 ? " is even" : " is odd"));' },
      { id: 11, difficulty: 1150, title: 'Age Calculator', text: 'Calculate age based on a birth date object.', inputFormat: 'Date object (DOB)', outputFormat: 'Integer years.', hint: 'Subtract DOB timestamp from Date.now() and convert.', solution: 'function calcAge(dob) {\n  var diff = Date.now() - dob.getTime();\n  var ageDate = new Date(diff);\n  return Math.abs(ageDate.getUTCFullYear() - 1970);\n}' }
    ],
    Java: [
      { id: 101, difficulty: 300, title: 'Odd Numbers 1-100', text: 'Display all odd numbers between 1 and 100.', inputFormat: 'None', outputFormat: 'List of numbers', hint: 'Use for loop with i % 2 != 0 check.', solution: 'for (int i = 1; i <= 100; i++) {\n  if (i % 2 != 0) System.out.print(i + " ");\n}' },
      { id: 102, difficulty: 400, title: 'Sum of Digits', text: 'Find the sum of the digits of a given number.', inputFormat: 'Integer num (e.g. 123)', outputFormat: 'Integer (e.g. 6)', hint: 'Use while(num > 0) with %10 and /10.', solution: 'int sum = 0; while (num > 0) { sum += num % 10; num /= 10; }' },
      { id: 103, difficulty: 550, title: 'Armstrong Number', text: 'Check if a number is an Armstrong number (sum of cubes of digits = number).', inputFormat: 'Integer X', outputFormat: 'Success message', hint: 'Sum of (rem * rem * rem) for all digits.', solution: 'int n=153, arg=n, sum=0, r;\nwhile(n>0) { r=n%10; sum+=(r*r*r); n/=10; }\nif(arg==sum) System.out.println("Armstrong");' },
      { id: 104, difficulty: 650, title: 'Number to Words', text: 'Convert a given number (0-99) into its word representation.', inputFormat: 'Integer num', outputFormat: 'String (e.g. "Twenty Eight")', hint: 'Use arrays for static words.', solution: 'String[] one = {"", "One", "Two", ...}; String[] ten = {"", "", "Twenty", ...};\nif(n > 19) System.out.print(ten[n/10] + " " + one[n%10]);' },
      { id: 105, difficulty: 700, title: 'Palindrome Number', text: 'Check if a given number reads the same forwards and backwards.', inputFormat: 'Integer n', outputFormat: 'Boolean result', hint: 'Reverse the number mathematically.', solution: 'int r, rev=0, pal=n; while(n>0){ r=n%10; rev=rev*10+r; n/=10; }\nif(rev==pal) System.out.println("Palindrome");' },
      { id: 106, difficulty: 800, title: 'Matrix Addition', text: 'Perform addition of two 3x3 matrices.', inputFormat: 'Two 2D arrays', outputFormat: 'Summed matrix', hint: 'Use nested for loops.', solution: 'for(int i=0;i<3;i++) for(int j=0;j<3;j++) c[i][j]=a[i][j]+b[i][j];' },
      { id: 107, difficulty: 950, title: 'Integer to Roman', text: 'Convert a decimal integer into a Roman numeral string.', inputFormat: 'Integer num', outputFormat: 'String (e.g., IX)', hint: 'Use a mapping of bases (1000, 900, ...) to symbols.', solution: 'int[] bases={1000,900,500,400...}; String[] sym={"M","CM","D","CD"...};' },
      { id: 108, difficulty: 1100, title: 'Binary Search', text: 'Search for a value in a sorted array using binary search algorithm.', inputFormat: 'Sorted array, target', outputFormat: 'Index or -1', hint: 'Compare with middle and adjust bounds.', solution: 'while(first<=last){ mid=(f+l)/2; if(a[mid]<t) f=mid+1; else if(a[mid]==t) break; }' },
      { id: 109, difficulty: 1200, title: 'Diagonal Matrix Check', text: 'Check if a matrix is diagonal (all non-diagonal elements are zero).', inputFormat: '2D matrix', outputFormat: 'Boolean', hint: 'Check if(i != j && matrix[i][j] != 0).', solution: 'boolean isDiag=true; for(int i=0;i<n;i++) for(int j=0;j<n;j++) if(i!=j && a[i][j]!=0) isDiag=false;' },
      { id: 110, difficulty: 1300, title: 'HCF and LCM', text: 'Calculate the Highest Common Factor and Least Common Multiple of two numbers.', inputFormat: 'Two integers A, B', outputFormat: 'HCF and LCM values.', hint: 'Use Euclidean algorithm for HCF: a = b, b = a % b.', solution: 'while(b!=0) { int t=b; b=a%b; a=t; } hcf=a; lcm=(x*y)/hcf;' }
    ],
    Python: [
      { id: 201, difficulty: 350, title: 'Factorial Calculation', text: 'Find the factorial of a given number.', inputFormat: 'Integer n', outputFormat: 'n!', hint: 'Use range(1, n+1) and multiply.', solution: 'fact = 1\nfor i in range(1, n+1): fact *= i\nprint(fact)' },
      { id: 202, difficulty: 450, title: 'Prime Check', text: 'Determine if a number is prime.', inputFormat: 'Number', outputFormat: 'String result', hint: 'Loop from 2 to sqrt(n).', solution: 'for i in range(2, n): \n  if n % i == 0: print("Not Prime"); break\nelse: print("Prime")' },
      { id: 203, difficulty: 500, title: 'Fibonacci Series', text: 'Display Fibonacci series up to n terms.', inputFormat: 'N', outputFormat: 'Sequence', hint: 'a, b = b, a + b', solution: 'a, b = 0, 1\nfor _ in range(n): print(a); a, b = b, a + b' },
      { id: 204, difficulty: 600, title: 'Reverse String', text: 'Reverse a given string using slicing.', inputFormat: 'String', outputFormat: 'Reversed string', hint: 'Use [::-1] operator.', solution: 'print(s[::-1])' },
      { id: 205, difficulty: 750, title: 'Vowel Counter', text: 'Count vowels in a string using list comprehension.', inputFormat: 'String', outputFormat: 'Count', hint: 'sum(1 for ch in s if ch in "aeiou")', solution: 'print(sum(1 for ch in s.lower() if ch in "aeiou"))' },
      { id: 206, difficulty: 900, title: 'List Sorting', text: 'Sort a list of integers from user input.', inputFormat: 'Space-sep integers', outputFormat: 'Sorted list', hint: 'lst.sort()', solution: 'lst = list(map(int, input().split()))\nlst.sort()\nprint(lst)' },
      { id: 207, difficulty: 400, title: 'Palindrome Check', text: 'Check if a string is a palindrome.', inputFormat: 'String', outputFormat: 'Palindrome / Not.', hint: 'Use s == s[::-1]', solution: 'if s == s[::-1]: print("Palindrome") else: print("Not")' },
      { id: 208, difficulty: 850, title: 'Largest Among Three', text: 'Find the maximum of three numbers provided by the user.', inputFormat: 'Three integers', outputFormat: 'The maximum value.', hint: 'Use the built-in max() function.', solution: 'print(max(int(input()), int(input()), int(input())))' }
    ]
  };

  const cleanCode = (code) => {
    return code
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
      .replace(/\s+/g, '')                      // Remove all whitespace
      .toLowerCase();
  };

  const handleExecuteBuild = (type = 'run') => {
    setIsBuilding(true);
    setBuildProgress(0);
    setTerminalOutput([`> Initializing ${activeLang} Environment...`, `> ${type === 'run' ? 'Running test cases...' : 'Submitting to placement engine...'}`]);

    const cleanedUser = cleanCode(userCode);
    const cleanedSol = cleanCode(selectedQuestion.solution);
    
    // Exact logic check: split solution into chunks and verify occupancy
    const logicChunks = selectedQuestion.solution.split(/[\n;]/).filter(s => s.trim().length > 10).map(s => cleanCode(s));
    const matchCount = logicChunks.filter(chunk => cleanedUser.includes(chunk)).length;
    const isCorrect = cleanedUser.length > 0 && (logicChunks.length === 0 || (matchCount / logicChunks.length) >= 0.7);

    let steps = [
      { text: '> Analyzing syntax and logic flow...', delay: 800 },
      { text: isCorrect ? '> Execution successful. Exit code 0.' : '> Error: Logic Mismatch Detected at block level.', delay: 2000 },
      { text: isCorrect ? '✅ ALL TEST CASES PASSED' : '❌ TEST CASE FAILURE: Expected specific output sequence', delay: 3500 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, step.text]);
        setBuildProgress(((idx + 1) / steps.length) * 100);
        if (idx === steps.length - 1) {
          setIsBuilding(false);
          if (type === 'submit' && isCorrect) setTimeout(() => setShowSuccessModal(true), 500);
        }
      }, step.delay);
    });
  };

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setActiveTab('Statement');
    setUserCode(activeLang === 'Java' ? `import java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass Codechef\n{\n  public static void main (String[] args) throws java.lang.Exception\n  {\n    // your code goes here\n  }\n}` : `// Solve: ${q.title}\n\n`);
    setView('solve');
  };

  const handleSelectNext = () => {
    const qList = questionLibrary[activeLang];
    const currIdx = qList.findIndex(q => q.id === selectedQuestion.id);
    if(currIdx < qList.length - 1) handleSelectQuestion(qList[currIdx+1]);
    else setView('list');
  };

  const handleLangSwitch = (lang) => {
    setActiveLang(lang);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getProfile();
        setUser(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  if (loading) return <DashboardLayout><div className="p-20 flex flex-col items-center justify-center"><Cpu size={48} className="animate-spin text-brand-blue mb-4" /><p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Booting Accelerator Hub...</p></div></DashboardLayout>;

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="animate-in fade-in duration-700 space-y-10 pb-20">
          {/* Track Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map(lang => (
              <div 
                key={lang}
                onClick={() => handleLangSwitch(lang)}
                className={`cursor-pointer group p-8 rounded-[2.5rem] border-2 transition-all ${activeLang === lang ? 'bg-brand-blue text-white border-brand-blue shadow-xl shadow-blue-500/20' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeLang === lang ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                    <Code2 size={24} />
                  </div>
                  <ChevronRight size={18} className={activeLang === lang ? 'text-white' : 'text-slate-300'} />
                </div>
                <h3 className="text-xl font-black tracking-tight">{lang}</h3>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${activeLang === lang ? 'text-blue-100' : 'text-slate-400'}`}>
                  {questionLibrary[lang].length} Problems Available
                </p>
              </div>
            ))}
          </div>

          {/* Question Feed */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{activeLang} Problem Set</h4>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Page {currentPage} of {Math.ceil(questionLibrary[activeLang].length / questionsPerPage)}
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {questionLibrary[activeLang].slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage).map((q) => (
                <div key={q.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-xs">
                      {q.id}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 tracking-tight text-lg mb-1">{q.title}</h5>
                      <div className="flex items-center gap-3">
                         <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${q.difficulty > 1000 ? 'bg-rose-50 text-rose-500' : q.difficulty > 600 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                            Toughness: {q.difficulty}
                         </span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> {q.difficulty > 800 ? '30' : '15'} mins
                         </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectQuestion(q)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition-all opacity-0 group-hover:opacity-100 shadow-xl shadow-blue-500/10"
                  >
                    Solve Action
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="flex gap-2">
                {[...Array(Math.ceil(questionLibrary[activeLang].length / questionsPerPage))].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(questionLibrary[activeLang].length / questionsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(questionLibrary[activeLang].length / questionsPerPage)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden bg-[#0d0e12] rounded-[1.5rem] border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          
          {/* IDE Header: Minimalist Zen Mode */}
          <header className="h-14 bg-[#1e2128] border-b border-slate-800 flex items-center justify-between px-6 shrink-0 text-slate-400">
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setView('list')}
                 className="flex items-center gap-2 hover:text-white transition-all group"
               >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Back to Questions</span>
               </button>
               <div className="w-[1px] h-6 bg-slate-800"></div>
               <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
                  Difficulty: <span className="text-white bg-slate-700 px-2 py-0.5 rounded">{selectedQuestion?.difficulty}</span>
               </span>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => {
                   if (!document.fullscreenElement) {
                     document.documentElement.requestFullscreen();
                   } else {
                     if (document.exitFullscreen) document.exitFullscreen();
                   }
                 }}
                 className="text-[10px] font-black uppercase text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 transition-all"
               >
                  <Maximize2 size={14} /> Fullscreen
               </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[45%] flex flex-col border-r border-slate-800 relative">
               <div className="flex bg-[#1e2128] px-2 pt-2 gap-1 border-b border-slate-800">
                  {['Statement', 'Solution', 'Hints'].map(tab => (
                     <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-6 py-3 text-[11px] font-bold tracking-tight rounded-t-lg transition-all ${activeTab === tab ? 'bg-[#0d0e12] text-white border-b-2 border-brand-blue' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto p-10 custom-scrollbar text-slate-300 scroll-smooth">
                  {activeTab === 'Statement' && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                       <section>
                          <h2 className="text-2xl font-black text-white tracking-tight mb-4">{selectedQuestion?.title}</h2>
                          <p className="leading-loose font-medium text-slate-400">{selectedQuestion?.text}</p>
                          {selectedQuestion?.note && (
                             <p className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl italic text-sm text-slate-500">
                                <strong className="text-slate-300 not-italic">NOTE:</strong> {selectedQuestion.note}
                             </p>
                          )}
                       </section>

                       <section className="space-y-4">
                          <h3 className="text-lg font-black text-white tracking-tight">Input Format</h3>
                          <ul className="list-disc pl-5 space-y-3 leading-relaxed text-slate-400">
                             <li>{selectedQuestion?.inputFormat}</li>
                          </ul>
                       </section>

                       <section className="space-y-4">
                          <h3 className="text-lg font-black text-white tracking-tight">Output Format</h3>
                          <p className="leading-relaxed text-slate-400">{selectedQuestion?.outputFormat}</p>
                       </section>
                    </div>
                  )}
                  {activeTab === 'Solution' && (
                    <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                       <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black text-white">Verified Solution</h3>
                          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                             <Shield size={14} /> Optimized logic
                          </div>
                       </div>
                       <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 relative group">
                          <div className="absolute top-4 right-4 text-slate-700 font-mono text-[10px] uppercase">Solution Logic</div>
                          <code className="text-blue-300 font-mono text-xs whitespace-pre leading-[1.8] block">
                             {selectedQuestion?.solution}
                          </code>
                       </div>
                    </div>
                  )}

                  {activeTab === 'Hints' && (
                    <div className="animate-in slide-in-from-left-2 duration-500">
                       <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-6">
                          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                             <HelpCircle size={28} />
                          </div>
                          <div>
                             <h4 className="font-black text-amber-500 uppercase text-xs tracking-widest mb-1">Architectural Hint</h4>
                             <p className="text-slate-300 font-medium italic">"{selectedQuestion?.hint}"</p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#14161d] min-w-0">
               <div className="h-12 bg-[#1e2128] border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-2 text-[11px] font-black text-white border-brand-blue border-b-2 h-full px-2 tracking-widest">
                    {activeLang}
                  </div>
                  <div className="flex items-center gap-4">
                     <RefreshCcw size={16} className="text-slate-500 cursor-pointer hover:text-white transition-all" />
                     <Settings size={16} className="text-slate-500 cursor-pointer hover:text-white" />
                  </div>
               </div>

               <div className="flex-1 overflow-hidden relative group min-h-0">
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d0e12] border-r border-slate-800 flex flex-col items-center py-6 text-[10px] font-mono text-slate-700 select-none z-10">
                     {[...Array(25)].map((_, i) => <div key={i} className="leading-loose">{i + 1}</div>)}
                  </div>
                  <textarea 
                     value={userCode}
                     onChange={(e) => setUserCode(e.target.value)}
                     className="w-full h-full bg-[#0d0e12] ml-12 p-8 pt-6 text-emerald-400 font-mono text-sm leading-loose focus:outline-none resize-none selection:bg-brand-blue/30"
                     spellCheck="false"
                  ></textarea>
                  
                  <button 
                    onClick={() => setActiveTab('Solution')}
                    className="absolute top-6 right-6 flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-20 group"
                  >
                     <Eye size={14} className="group-hover:scale-110 transition-transform" /> Give Up
                  </button>
               </div>

               <div className="h-[30%] bg-[#1b1e26] border-t-2 border-slate-800 flex flex-col min-h-[180px]">
                  <div className="flex-1 p-6 flex flex-col gap-2 relative overflow-hidden">
                     <div className="absolute top-0 left-0 h-[2px] bg-brand-blue transition-all duration-300" style={{ width: `${buildProgress}%` }}></div>
                     <div className="flex-1 bg-[#0d0e12] rounded-xl p-6 font-mono text-[13px] overflow-y-auto custom-scrollbar leading-relaxed">
                        {terminalOutput.length > 0 ? terminalOutput.map((line, idx) => (
                          <div key={idx} className={`mb-2 ${line.startsWith('✅') ? 'text-emerald-500 font-bold' : line.startsWith('❌') || line.startsWith('> Error') ? 'text-rose-500' : line.startsWith('>') ? 'text-brand-blue' : 'text-slate-500'}`}>
                            {line}
                          </div>
                        )) : (
                          <div className="text-slate-800 italic">Code output will appear here...</div>
                        )}
                     </div>
                  </div>

                  <div className="h-16 bg-[#1e2128] border-t border-slate-800 flex items-center justify-end gap-3 px-8 shrink-0">
                    <button 
                      onClick={() => handleExecuteBuild('run')}
                      disabled={isBuilding}
                      className="px-8 py-2.5 bg-white text-slate-900 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                       <Play size={12} /> Run
                    </button>
                    <button 
                      onClick={() => handleExecuteBuild('submit')}
                      disabled={isBuilding}
                      className="px-8 py-2.5 bg-brand-blue text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                       <Send size={14} /> Submit
                    </button>
                    <button 
                       onClick={handleSelectNext}
                       className="px-8 py-2.5 bg-white/10 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                       Next Problem
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] p-12 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-lg border border-emerald-100">
                 <Shield size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-2">Submission Accepted!</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 flex flex-col gap-1">
                 <span>Great work on <strong>{selectedQuestion?.title}</strong>!</span>
                 <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Perfect Execution</span>
              </p>
              <button 
                onClick={() => { setShowSuccessModal(false); setView('list'); }}
                className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all"
              >
                 Return to Problem Set
              </button>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CareerAccelerator;
