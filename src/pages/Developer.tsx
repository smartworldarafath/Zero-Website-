import React from 'react';
import { Code, Terminal, User, ExternalLink, Sparkles } from 'lucide-react';
import { SiGmail, SiGithub, SiTelegram, SiInstagram, SiFacebook } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

export function Developer() {
  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
          <Code className="w-10 h-10 text-indigo-500" />
          Developer Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Meet the creator behind Zero Studio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="liquid-panel p-8 rounded-[2rem] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
            
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Arafatrh Rahman</h2>
            <p className="text-indigo-500 font-medium text-sm mb-6">@Arafatrh Rahman</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="mailto:arafathrahman711@gmail.com" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <SiGmail className="w-5 h-5" />
              </a>
              <a href="https://github.com/smartworldarafath" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <SiGithub className="w-5 h-5" />
              </a>
              <a href="https://t.me/open_souce_bangladesh" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <SiTelegram className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/ArafatrhRahman" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/ArafatrhRahman" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
                <span className="text-gray-500">Role</span>
                <span className="font-semibold text-gray-900 dark:text-white">Lead Developer</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900 dark:text-white">Global</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="liquid-panel p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-500" />
              About Me
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
              <p>
                Hello! I'm Arafatrh Rahman, a passionate software engineer and the creator of Zero Studio. 
                My mission is to leverage the power of artificial intelligence to build tools that empower 
                students and professionals to achieve their goals.
              </p>
              <p>
                With a strong background in full-stack development and a keen interest in AI integration, 
                I focus on creating intuitive, performant, and highly functional web applications. Zero Studio 
                is a testament to this vision, combining cutting-edge AI models with a seamless user experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-panel p-8 rounded-[2rem]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'AI Integration', 'UI/UX Design', 'Tailwind CSS'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="liquid-panel p-8 rounded-[2rem]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-indigo-500" />
                Current Focus
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Currently focused on expanding Zero Studio's capabilities with more advanced AI models, 
                improving document analysis algorithms, and building a stronger community around the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
