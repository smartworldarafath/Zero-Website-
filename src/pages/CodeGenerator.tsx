import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Copy, Check, Sparkles, Send } from 'lucide-react';
import { generateContent } from '../services/ai';

export function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const systemPrompt = `You are an expert ${language} developer. Generate clean, efficient, and well-commented code based on the user's request. Return ONLY the code block without any markdown formatting or explanation unless necessary.`;
      const result = await generateContent(`${systemPrompt}\n\nRequest: ${prompt}`);
      // Strip markdown code blocks if present
      const cleanedCode = result.replace(/```[\w]*\n/g, '').replace(/```/g, '').trim();
      setCode(cleanedCode);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Input Panel */}
        <div className="flex-1 space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">AI Code Generator</h2>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Generate clean code in seconds</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2 ml-1">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-black dark:text-white outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML/CSS</option>
                  <option value="java">Java</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2 ml-1">
                  What do you want to build?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Create a responsive navigation bar with a logo and three links..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-black dark:text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex-1">
          <div className="bg-black/90 rounded-[2rem] p-8 h-full min-h-[500px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              {code && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1 font-mono text-sm text-indigo-300 overflow-auto scrollbar-hide">
              {code ? (
                <pre className="whitespace-pre-wrap">{code}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20 text-center space-y-4">
                  <Code className="w-12 h-12 opacity-20" />
                  <p>Your generated code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
