import { Link } from 'react-router-dom';
import { Mail, Reply, FileText, Briefcase, GraduationCap, PenTool, ArrowRight, Sparkles } from 'lucide-react';

const tools = [
  {
    name: 'AI Email Writer',
    description: 'Generate professional emails tailored to your goals and tone in seconds.',
    icon: Mail,
    href: '/email-writer',
    color: 'bg-blue-500/20 text-blue-500',
  },
  {
    name: 'AI Email Replier',
    description: 'Paste an email and let AI craft the perfect, context-aware response.',
    icon: Reply,
    href: '/email-replier',
    color: 'bg-indigo-500/20 text-indigo-500',
  },
  {
    name: 'AI SOP Writer',
    description: 'Draft comprehensive Statement of Purpose or Standard Operating...',
    icon: PenTool,
    href: '/sop-writer',
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    name: 'AI SOP Analyzer',
    description: 'Score and get actionable feedback on your existing SOP documents.',
    icon: GraduationCap,
    href: '/sop-analyzer',
    color: 'bg-cyan-500/20 text-cyan-500',
  },
  {
    name: 'AI CV Builder',
    description: 'Create an ATS-optimized, beautifully structured resume from scratch.',
    icon: Briefcase,
    href: '/cv-builder',
    color: 'bg-orange-500/20 text-orange-500',
  },
  {
    name: 'AI CV Analyzer',
    description: 'Evaluate your resume against ATS standards and get rewrite suggestions.',
    icon: FileText,
    href: '/cv-analyzer',
    color: 'bg-rose-500/20 text-rose-500',
  },
];

export function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white/10 dark:bg-black/20 backdrop-blur-[28px] border border-white/10 p-12 sm:p-16">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-8">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-yellow-500" />
            Powered by Gemini 2.5 AI
          </div>
          <div className="mb-8">
            <img 
              src="/Untitled_design-removebg-preview.png" 
              alt="Zero Studio Logo" 
              className="w-24 h-24 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Supercharge your professional writing.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-0">
            From flawless emails to ATS-beating resumes, our AI suite is your unfair advantage in the professional world.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-purple-500 blur-[45px]" />
          <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-indigo-500 blur-[45px]" />
          <div className="absolute top-1/2 right-40 w-24 h-24 rounded-full bg-cyan-500 blur-[45px]" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 px-2">Your Toolkit</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.href}
              className="group relative bg-white/10 dark:bg-black/20 backdrop-blur-[17px] border border-white/10 rounded-[2rem] p-8 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-500"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-6`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
              <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Tool
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
