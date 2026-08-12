import React from 'react';
import { Shield, Eye, Lock, Database, Globe, Clock, Download, Printer, Mail } from 'lucide-react';

export function Policy() {
  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
          <Shield className="w-10 h-10 text-emerald-500" />
          Privacy Policy
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
            <a href="#collection" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <Database className="w-4 h-4" /> 1. Data Collection
            </a>
            <a href="#usage" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Eye className="w-4 h-4" /> 2. How We Use Data
            </a>
            <a href="#security" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Lock className="w-4 h-4" /> 3. Data Security
            </a>
            <a href="#rights" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-sm">
              <Globe className="w-4 h-4" /> 4. Your Rights
            </a>
            
            <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-white dark:bg-white/5 border border-white/10">
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-widest">Privacy Concerns?</p>
              <p className="text-sm leading-relaxed mb-4">Contact our Data Protection Officer.</p>
              <button className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <Mail className="w-3 h-3" /> Email DPO
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-12">
          <div className="liquid-panel p-8 rounded-[2rem] space-y-12">
            <section id="collection" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-500/20">01</span>
                <h2 className="text-2xl font-bold tracking-tight">Data Collection</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>Zero Studio collects information to provide better services to all our users. We collect data in the following ways:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="font-bold text-sm mb-1">Information You Give Us</h4>
                    <p className="text-xs">Account details, CV data, SOP drafts, and support communications.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="font-bold text-sm mb-1">Automated Collection</h4>
                    <p className="text-xs">Device information, IP addresses, and usage patterns via cookies.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-500/20">02</span>
                <h2 className="text-2xl font-bold tracking-tight">How We Use Data</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Zero Studio and our users.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To generate AI-powered document content.</li>
                  <li>To analyze and provide feedback on your documents.</li>
                  <li>To personalize your experience on the platform.</li>
                  <li>To communicate important updates and security alerts.</li>
                </ul>
              </div>
            </section>

            <section id="security" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-500/20">03</span>
                <h2 className="text-2xl font-bold tracking-tight">Data Security</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>We work hard to protect Zero Studio and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.</p>
                <div className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">We use SSL/TLS encryption for all data in transit and AES-256 encryption for sensitive data at rest.</p>
                </div>
              </div>
            </section>

            <section id="rights" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-500/20">04</span>
                <h2 className="text-2xl font-bold tracking-tight">Your Rights</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400 space-y-4">
                <p>You have the right to access, update, or delete your personal information at any time. You can also object to the processing of your data or request data portability.</p>
                <p>If you wish to exercise any of these rights, please contact us through your account settings or via our support channel.</p>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-emerald-500 hover:underline">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-emerald-500 hover:underline">
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
