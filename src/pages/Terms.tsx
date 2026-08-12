import React from 'react';
import { FileText, Shield, Scale, AlertCircle, Clock, Download, Printer } from 'lucide-react';

export function Terms() {
  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
          <FileText className="w-10 h-10 text-indigo-500" />
          Terms of Service
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Last Updated: March 18, 2026
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>Version 1.0.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="liquid-panel p-6 rounded-[2rem] sticky top-8 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 px-3">On this page</h3>
            <a href="#introduction" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              <Shield className="w-4 h-4" /> 1. Introduction
            </a>
            <a href="#accounts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Shield className="w-4 h-4" /> 2. User Accounts
            </a>
            <a href="#content" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Shield className="w-4 h-4" /> 3. Content Rights
            </a>
            <a href="#prohibited" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Shield className="w-4 h-4" /> 4. Prohibited Acts
            </a>
            
            <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-white dark:bg-white/5 border border-white/10">
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-widest">Questions?</p>
              <p className="text-sm leading-relaxed mb-4">Need clarification on our terms?</p>
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Contact Support</button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-12">
          <div className="liquid-panel p-8 rounded-[2rem] space-y-12">
            <section id="introduction" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-indigo-500/20">01</span>
                <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>Welcome to Zero Studio. These Terms of Service ("Terms") govern your access to and use of our AI-powered document generation and analysis platform.</p>
                <p>By using our service, you agree to be bound by these Terms. If you do not agree, you may not use the Service. We reserve the right to update these terms as our platform evolves.</p>
                <div className="p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                  <p className="text-sm italic">Note: These terms apply to all users of the Zero Studio platform.</p>
                </div>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-indigo-500/20">02</span>
                <h2 className="text-2xl font-bold tracking-tight">User Accounts</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide accurate and complete information.</li>
                  <li>Notify us immediately of any unauthorized use.</li>
                  <li>One person may only maintain one account.</li>
                </ul>
              </div>
            </section>

            <section id="content" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-indigo-500/20">03</span>
                <h2 className="text-2xl font-bold tracking-tight">Content Rights</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>You retain ownership of the data you provide to the platform. By using Zero Studio, you grant us a limited license to process your data for the sole purpose of providing the service (e.g., generating your CV or analyzing your SOP).</p>
                <p>We do not use your personal data to train our AI models without your explicit consent.</p>
              </div>
            </section>

            <section id="prohibited" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-indigo-500/20">04</span>
                <h2 className="text-2xl font-bold tracking-tight">Prohibited Acts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold mb-2 text-sm">No Automation</h4>
                  <p className="text-xs text-gray-500">Using bots or automated scripts to scrape or interact with the platform is strictly prohibited.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold mb-2 text-sm">No Misuse</h4>
                  <p className="text-xs text-gray-500">Generating harmful, illegal, or deceptive content using our AI tools is a violation of our terms.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-indigo-500 hover:underline">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-indigo-500 hover:underline">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
            <p className="text-xs text-gray-500">© 2026 Zero Studio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
