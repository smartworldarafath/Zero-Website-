import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, ArrowLeft, Sparkles, Send, Mail, User, Building, 
  MessageSquare, Loader2, CheckCircle2, Zap, ShieldCheck
} from 'lucide-react';
import { 
  getPricingConfig, 
  setUserPlan, 
  PricingConfig 
} from '../utils/storage';

interface PricingPageProps {
  onBack: () => void;
  onActivatePlanSuccess?: (planType: 'free' | 'core') => void;
}

export function PricingPage({ onBack, onActivatePlanSuccess }: PricingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [pricing, setPricing] = useState<PricingConfig>(getPricingConfig());

  // Action Loading States
  const [loadingState, setLoadingState] = useState<'free_activating' | 'core_activating' | null>(null);
  const [coreSuccessModal, setCoreSuccessModal] = useState(false);

  // Contact Us Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactProject, setContactProject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);

  useEffect(() => {
    setPricing(getPricingConfig());
  }, []);

  // ── Handle "Try Now" (Free Plan 25 Days) ──
  const handleTryNow = () => {
    setLoadingState('free_activating');
    
    setTimeout(() => {
      setUserPlan('free', pricing.trialDurationDays || 25);
      setLoadingState(null);
      if (onActivatePlanSuccess) {
        onActivatePlanSuccess('free');
      } else {
        onBack();
      }
    }, 2500);
  };

  // ── Handle "Get Started" (Core Plan Request) ──
  const handleGetStarted = () => {
    setLoadingState('core_activating');
    
    setTimeout(() => {
      setUserPlan('core', pricing.trialDurationDays || 25, true);
      setLoadingState(null);
      setCoreSuccessModal(true);
    }, 2500);
  };

  const handleCoreSuccessProceed = () => {
    setCoreSuccessModal(false);
    if (onActivatePlanSuccess) {
      onActivatePlanSuccess('core');
    } else {
      onBack();
    }
  };

  // ── Handle "Contact Us" Submit ──
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSendingMail(true);

    setTimeout(() => {
      const subject = encodeURIComponent(`[Zero Studio Enterprise Inquiry] from ${contactName} - ${contactCompany || 'Individual'}`);
      const body = encodeURIComponent(
`Hello Arafath Rahman,

I would like to inquire about the Zero Studio Enterprise Plan and custom AI solutions.

── SENDER DETAILS ──
Name: ${contactName}
Email: ${contactEmail}
Company/Organization: ${contactCompany || 'N/A'}
Project Scope/Requirements: ${contactProject || 'Enterprise AI / Web Development'}

── MESSAGE ──
${contactMessage}

Looking forward to connecting with you soon!

Best regards,
${contactName}`
      );

      // Open user's email client / Gmail with pre-filled content
      window.location.href = `mailto:arafathrahman711@gmail.com?subject=${subject}&body=${body}`;
      
      setIsSendingMail(false);
      setIsContactModalOpen(false);

      // Reset form
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactProject('');
      setContactMessage('');
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen w-full py-12 px-4 sm:px-6 flex flex-col items-center relative z-20 font-sans"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start mb-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#0c1427]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer font-bold text-xs shadow-md"
      >
        <ArrowLeft className="w-4 h-4 text-[#00ff88]" />
        <span>Back to Home</span>
      </button>

      {/* Header Section */}
      <header className="text-center mb-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold font-mono tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> 25-Day Free Activation Available
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-gray-900 dark:text-white font-headline">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
          Experience the full power of Zero Studio with high-speed AI models and enterprise web solutions.
        </p>
      </header>

      {/* Billing Toggle */}
      <div className="mb-14">
        <div className="bg-gray-200/80 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center p-1 rounded-full w-fit mx-auto backdrop-blur-xl relative">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`relative z-10 px-6 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'text-white dark:text-black'
                : 'text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            Billed Monthly
            {billingPeriod === 'monthly' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#050507] dark:bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button
            onClick={() => setBillingPeriod('annually')}
            className={`relative z-10 px-6 py-2 rounded-full text-xs font-bold transition-colors duration-300 flex items-center gap-2 cursor-pointer ${
              billingPeriod === 'annually'
                ? 'text-white dark:text-black'
                : 'text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            Billed Annually
            <span className="bg-[#00ff88]/20 text-[#00ff88] text-[10px] px-2 py-0.5 rounded-full border border-[#00ff88]/30 font-mono">
              -{pricing.discountPercent || 50}%
            </span>
            {billingPeriod === 'annually' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#050507] dark:bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* Card 1: Starter (Free Plan) */}
        <motion.section 
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="bg-white/60 dark:bg-[#0c1427]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col justify-between border border-gray-200 dark:border-white/10 shadow-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Starter</h3>
              <span className="bg-[#00ff88] text-[10px] font-black px-2.5 py-0.5 rounded-full text-[#050507] uppercase tracking-wider">
                25-Day Free
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-8 leading-relaxed">
              Full 25-day free access to explore Zero Studio workflows and tools according to standard tier rules.
            </p>
            <div className="mb-8 overflow-hidden">
              <span className="text-5xl font-black text-gray-900 dark:text-white">$0.00</span>
              <span className="text-gray-500 text-xs ml-2">25 Days Free Access</span>
            </div>

            <button 
              onClick={handleTryNow}
              disabled={loadingState !== null}
              className="w-full py-3.5 px-6 rounded-2xl border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold hover:bg-[#00ff88] hover:text-[#050507] hover:border-[#00ff88] transition-all mb-8 shadow-sm cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400 group-hover:text-black" />
              Try Now (Free 25 Days)
            </button>

            <div className="space-y-4 text-xs">
              <FeatureItem text="25-Day Full Free Access" active={true} />
              <FeatureItem text="Standard AI Engines Access" active={true} />
              <FeatureItem text="Explore Live Enterprise Portals" active={true} />
              <FeatureItem text="Studio Code Chat & Web Builder" active={true} />
              <FeatureItem text="Unlimited Ultra AI (Core & Enterprise Only)" active={false} />
            </div>
          </div>
        </motion.section>

        {/* Card 2: Core (Highlighted) */}
        <motion.section 
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="bg-indigo-600/15 dark:bg-indigo-950/40 backdrop-blur-3xl text-gray-900 dark:text-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/20 border-2 border-indigo-500/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-500 text-white font-mono text-[10px] font-bold uppercase rounded-bl-2xl tracking-wider">
            POPULAR
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Core Pro</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xs mb-8 leading-relaxed">
              For professional creators and developers demanding faster multi-model AI workflows and dedicated support.
            </p>
            <div className="mb-8 overflow-hidden">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                ${billingPeriod === 'monthly' ? pricing.coreMonthly.toFixed(2) : pricing.coreAnnual.toFixed(2)}
              </span>
              <span className="text-gray-500 text-xs ml-1">/month</span>
            </div>

            <button 
              onClick={handleGetStarted}
              disabled={loadingState !== null}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition-all mb-8 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              Get Started (Core)
            </button>

            <div className="space-y-4 text-xs font-medium">
              <FeatureItem text="Free 25 Days Included Instantly" active={true} />
              <FeatureItem text="Unlimited Fast AI Generations" active={true} />
              <FeatureItem text="Access All 22+ AI Models & WASM Engines" active={true} />
              <FeatureItem text="Priority Code Generation & Web Previews" active={true} />
              <FeatureItem text="Dedicated Developer Consultation" active={true} />
            </div>
          </div>
        </motion.section>

        {/* Card 3: Enterprise */}
        <motion.section 
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="bg-white/60 dark:bg-[#0c1427]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col justify-between border border-gray-200 dark:border-white/10 shadow-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Enterprise</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-8 leading-relaxed">
              Custom web application engineering, private cloud deployment, and tailored AI models for corporate teams.
            </p>
            <div className="mb-8 overflow-hidden">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                ${billingPeriod === 'monthly' ? pricing.enterpriseMonthly.toFixed(2) : pricing.enterpriseAnnual.toFixed(2)}
              </span>
              <span className="text-gray-500 text-xs ml-1">/month</span>
            </div>

            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold hover:bg-[#8cacff] hover:text-[#002a6e] hover:border-[#8cacff] transition-all mb-8 shadow-sm cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              Contact Us (Direct Mail)
            </button>

            <div className="space-y-4 text-xs">
              <FeatureItem text="Custom Web & AI Application Building" active={true} />
              <FeatureItem text="Dedicated Deployment on Vercel/Cloud" active={true} />
              <FeatureItem text="Direct 1-on-1 Consultation with Arafath" active={true} />
              <FeatureItem text="Full Source Code Handover & GitHub Setup" active={true} />
              <FeatureItem text="24/7 Priority Emergency Support" active={true} />
            </div>
          </div>
        </motion.section>

      </main>

      {/* ─── 2.5s LOADING MODAL FOR TRY NOW / GET STARTED ─── */}
      <AnimatePresence>
        {loadingState !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0c1427] border border-gray-200 dark:border-white/15 text-center max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/20 border border-[#00ff88]/40 flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {loadingState === 'free_activating' ? 'Activating 25-Day Free Trial...' : 'Registering Core Plan Request...'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Configuring intelligent AI permissions and setting up your workspace environment.
              </p>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  className="bg-gradient-to-r from-[#00ff88] to-[#8cacff] h-full rounded-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CORE GET STARTED CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {coreSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0c1427] border border-indigo-500/30 text-center max-w-md w-full shadow-2xl space-y-6 relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  We Will Contact You Soon!
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  Thank you for selecting the Core Plan! Our team will contact you shortly to complete your subscription.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-xs font-mono font-bold text-[#00ff88]">
                  🎉 Your 25-Day Free Trial is Active Right Now!
                </div>
              </div>

              <button
                onClick={handleCoreSuccessProceed}
                className="w-full py-3.5 bg-gradient-to-r from-[#00ff88] to-[#00e077] text-[#050507] rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Enter Website & Enjoy Celebration 🎉
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CONTACT US MODAL (ENTERPRISE INQUIRY) ─── */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-[#0c1427] border border-gray-200 dark:border-white/15 p-8 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Enterprise Contact</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Direct consultation with Arafath Rahman (arafathrahman711@gmail.com)</p>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Your Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Project Scope</label>
                    <input
                      type="text"
                      value={contactProject}
                      onChange={(e) => setContactProject(e.target.value)}
                      placeholder="e.g. Enterprise Web App"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Message & Requirements</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Detail your goals, project timeline, and required features..."
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingMail}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8cacff] to-[#769dff] text-[#002a6e] font-bold text-xs shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isSendingMail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit & Open Mail Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function FeatureItem({ text, active }: { text: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${
      active 
        ? 'text-gray-800 dark:text-gray-200' 
        : 'text-gray-400 dark:text-gray-500 line-through opacity-70'
    }`}>
      {active ? (
        <Check className="w-4 h-4 text-[#00ff88] shrink-0 stroke-[2.5]" />
      ) : (
        <X className="w-4 h-4 text-gray-400 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}
