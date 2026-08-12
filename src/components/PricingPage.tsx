import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ArrowLeft } from 'lucide-react';

export function PricingPage({ onBack }: { onBack: () => void }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen w-full py-12 px-6 flex flex-col items-center"
    >
      <button
        onClick={onBack}
        className="self-start mb-8 flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* HeaderSection */}
      <header className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-black dark:text-white">Choose Your Plan</h1>
        <p className="text-black/60 dark:text-white/60 text-lg">Experience the full power of Zero Studio with our premium features.</p>
      </header>

      {/* BillingToggle */}
      <div className="mb-16">
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center p-1 rounded-full w-fit mx-auto backdrop-blur-xl relative">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${
              billingPeriod === 'monthly'
                ? 'text-white dark:text-black'
                : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
            }`}
          >
            Billed Monthly
            {billingPeriod === 'monthly' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button
            onClick={() => setBillingPeriod('annually')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${
              billingPeriod === 'annually'
                ? 'text-white dark:text-black'
                : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
            }`}
          >
            Billed Annually
            <span className="bg-indigo-500/20 text-indigo-500 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">-50%</span>
            {billingPeriod === 'annually' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* PricingCardsContainer */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Card 1: Starter */}
        <motion.section 
          layout
          className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col border border-white/10 dark:border-white/5 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-black text-black dark:text-white">Starter</h3>
            <span className="bg-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">Free</span>
          </div>
          <p className="text-black/60 dark:text-white/60 text-sm mb-8 leading-relaxed">
            You're just starting out on your comms journey
          </p>
          <div className="mb-8 overflow-hidden">
            <motion.div
              key={billingPeriod}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="text-5xl font-black text-black dark:text-white">$0.00</span>
              <span className="text-black/40 dark:text-white/40 text-xs ml-2">One-time payment</span>
            </motion.div>
          </div>
          <button className="w-full py-3 px-6 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-10">
            Try Now
          </button>
          <div className="space-y-4 text-sm">
            <FeatureItem text="view premium projects" active={false} />
            <FeatureItem text="Unlimited use of AI" active={false} />
            <FeatureItem text="20 Use of AI / day" active={true} />
            <FeatureItem text="Premium support" active={false} />
          </div>
        </motion.section>

        {/* Card 2: Core (Highlighted) */}
        <motion.section 
          layout
          className="bg-indigo-600/20 dark:bg-indigo-500/10 backdrop-blur-md text-black dark:text-white rounded-[2.5rem] p-8 flex flex-col shadow-2xl shadow-indigo-500/20 transform md:scale-105 z-10 border border-indigo-500/30"
        >
          <div className="mb-4">
            <h3 className="text-xl font-black">Core</h3>
          </div>
          <p className="text-black/60 dark:text-white/70 text-sm mb-8 leading-relaxed">
            Already familiar with the process
          </p>
          <div className="mb-8 overflow-hidden">
            <motion.div
              key={billingPeriod}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="text-5xl font-black">{billingPeriod === 'monthly' ? '$4.99' : '$2.49'}</span>
              <span className="text-black/40 dark:text-white/60 text-sm ml-1">/month</span>
            </motion.div>
          </div>
          <button className="w-full py-4 px-6 rounded-xl bg-indigo-600 dark:bg-white text-white dark:text-indigo-600 font-black hover:scale-[1.02] active:scale-95 transition-all mb-10 shadow-lg">
            Get Started
          </button>
          <div className="space-y-4 text-sm font-medium">
            <FeatureItem text="view 25 premium projects / day" active={true} />
            <FeatureItem text="Unlimited use of AI (Pro)" active={true} />
            <FeatureItem text="Premium support" active={true} />
          </div>
        </motion.section>

        {/* Card 3: Enterprise */}
        <motion.section 
          layout
          className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col border border-white/10 dark:border-white/5 shadow-xl"
        >
          <div className="mb-4">
            <h3 className="text-xl font-black text-black dark:text-white">Enterprise</h3>
          </div>
          <p className="text-black/60 dark:text-white/40 text-sm mb-8 leading-relaxed">
            Expert User
          </p>
          <div className="mb-8 overflow-hidden">
            <motion.div
              key={billingPeriod}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="text-5xl font-black text-black dark:text-white">{billingPeriod === 'monthly' ? '$9.99' : '$4.99'}</span>
              <span className="text-black/40 dark:text-white/40 text-sm ml-1">/month</span>
            </motion.div>
          </div>
          <button className="w-full py-3 px-6 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-10">
            Contact Us
          </button>
          <div className="space-y-4 text-sm">
            <FeatureItem text="view premium projects (Unlimited)" active={true} />
            <FeatureItem text="Unlimited use of AI (Ultra)" active={true} />
            <FeatureItem text="Open Source Support" active={true} />
            <FeatureItem text="Premium support" active={true} />
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}

function FeatureItem({ text, active, inverted }: { text: string; active: boolean; inverted?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${
      active 
        ? (inverted ? 'text-white' : 'text-black dark:text-white') 
        : (inverted ? 'text-white/40' : 'text-black/40 dark:text-white/40')
    }`}>
      {active ? (
        <Check className={`w-5 h-5 ${inverted ? 'text-white' : 'text-indigo-500'}`} />
      ) : (
        <X className="w-5 h-5" />
      )}
      <span>{text}</span>
    </div>
  );
}
