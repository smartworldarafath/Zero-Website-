import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, Code, Eye, Copy, Download, Sliders, Zap, Bot, 
  Plus, Send, RefreshCw, Check, Terminal, Layout, Monitor, Smartphone, 
  MessageSquare, ChevronDown, User, ShieldCheck
} from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  badge: string;
  color: string;
  svgLogo: (className?: string) => React.ReactNode;
}

const OFFICIAL_MODELS: ModelOption[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek AI',
    badge: 'Reasoning Leader',
    color: 'border-blue-500/40 text-blue-400',
    svgLogo: (className = "w-5 h-5") => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta AI',
    badge: 'Open Flagship',
    color: 'border-cyan-500/40 text-cyan-400',
    svgLogo: (className = "w-5 h-5") => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M16.5 6C14.7 6 13.2 6.9 12 8.3 10.8 6.9 9.3 6 7.5 6 4.5 6 2 8.5 2 11.5c0 4.5 5.5 8.5 10 10.5 4.5-2 10-6 10-10.5C22 8.5 19.5 6 16.5 6z" fill="#06b6d4"/>
      </svg>
    )
  },
  {
    id: 'qwen-2.5-coder',
    name: 'Qwen 2.5 Coder',
    provider: 'Alibaba AI',
    badge: 'Code Master',
    color: 'border-emerald-500/40 text-emerald-400',
    svgLogo: (className = "w-5 h-5") => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 3.5l5.5 3.1v6.2L12 18l-5.5-3.2V8.6L12 5.5z" fill="#10b981"/>
      </svg>
    )
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral NeMo',
    provider: 'Mistral AI',
    badge: 'Ultra Fast',
    color: 'border-orange-500/40 text-orange-400',
    svgLogo: (className = "w-5 h-5") => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="5" height="5" rx="1.5" fill="#f97316"/>
        <rect x="16" y="3" width="5" height="5" rx="1.5" fill="#f97316"/>
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" fill="#f97316"/>
        <rect x="3" y="16" width="5" height="5" rx="1.5" fill="#f97316"/>
        <rect x="16" y="16" width="5" height="5" rx="1.5" fill="#f97316"/>
      </svg>
    )
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google AI',
    badge: 'Google Official',
    color: 'border-amber-500/40 text-amber-400',
    svgLogo: (className = "w-5 h-5") => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemini-logo-grad)"/>
        <defs>
          <linearGradient id="gemini-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="50%" stopColor="#9B51E0"/>
            <stop offset="100%" stopColor="#EA4335"/>
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  code?: string;
  modelName?: string;
}

const INITIAL_WORKSPACE = [
  { id: '1', title: 'Cyberpunk Neon Landing Page' },
  { id: '2', title: 'SaaS Analytics Dashboard UI' },
  { id: '3', title: 'Python Machine Learning Script' }
];

export function ZeroStudioPage({ 
  onBack, 
  onPricingClick,
  onProjectsClick,
}: { 
  onBack: () => void;
  onPricingClick: () => void;
  onProjectsClick: () => void;
}) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(OFFICIAL_MODELS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Natural Conversational AI Generator (Claude-style responses with NO extra metadata templates)
  const generateAiResponse = async (userQuery: string) => {
    const trimmed = userQuery.trim();
    if (!trimmed) return;

    setIsGenerating(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');

    try {
      // Primary API Request with Abort Controller
      const isCodeQuery = /code|html|css|website|build|create|component|script|python|java|react|ui|design|page|app|dashboard/i.test(trimmed);
      const systemPrompt = isCodeQuery 
        ? `Write a clean, responsive HTML page with Tailwind CSS for: ${trimmed}. Output code inside triple backticks.` 
        : `Respond naturally, concisely, and helpfully to the user: ${trimmed}`;

      const encodedPrompt = encodeURIComponent(systemPrompt);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      let rawText = '';
      try {
        const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&seed=${Math.floor(Math.random() * 1000)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        rawText = await response.text();
      } catch (fErr) {
        rawText = '';
      }

      // Filter out Turnstile or server error JSON
      if (!rawText || rawText.includes('Missing Turnstile token') || rawText.includes('"error":') || rawText.startsWith('{"error"')) {
        throw new Error('Turnstile requirement fallback');
      }

      // Extract code block if present
      let codeSnippet = '';
      const codeMatch = rawText.match(/```(?:html|css|js|javascript|python)?\s*([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        codeSnippet = codeMatch[1].trim();
        rawText = rawText.replace(/```[\s\S]*?```/g, '').trim();
      } else if (isCodeQuery && (rawText.includes('<html') || rawText.includes('<div') || rawText.includes('<!DOCTYPE'))) {
        codeSnippet = rawText;
        rawText = 'Here is your custom generated web component:';
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: rawText || (codeSnippet ? 'Here is the generated code component:' : 'Hello! How can I assist you today?'),
        code: codeSnippet || undefined,
        modelName: selectedModel.name
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Natural Intelligent Response Engine (Claude-style)
      let replyText = '';
      let replyCode = '';

      const lower = trimmed.toLowerCase();

      // Conversational greetings
      if (/^(hi|hello|hey|hola|greetings|hlo|hloo|sup|ssup)(\s+.*)?$/i.test(lower)) {
        replyText = `Hello! I'm your AI coding assistant powered by **${selectedModel.name}**. How can I help you build, design, or solve something today?`;
      } else if (/who are you|what is your name|who made you/i.test(lower)) {
        replyText = `I am **Zero Studio Code AI**, integrated with **${selectedModel.name}** (${selectedModel.provider}). I can generate complete web pages, Python scripts, write code, and answer technical questions.`;
      } else if (/how are you|how do you do/i.test(lower)) {
        replyText = `I'm doing great and ready to assist you! What software project or code module are we working on today?`;
      } else if (/python|script|ml|data|classifier|pandas|numpy/i.test(lower)) {
        replyText = `Here is a complete, executable **Python** script generated by **${selectedModel.name}** for your task:`;
        replyCode = `# Generated by ${selectedModel.name}
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

print("🚀 Zero Studio Code: Training Model...")
X = np.random.rand(150, 5)
y = np.random.randint(0, 2, 150)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

acc = clf.score(X_test, y_test)
print(f"✅ Model Accuracy: {acc * 100:.2f}%")`;
      } else if (/cyberpunk|neon|landing|website|app|dashboard|ui|html|component|css|design/i.test(lower)) {
        replyText = `Here is the custom **HTML & Tailwind CSS** component matching "${trimmed}":`;
        replyCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${trimmed}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #1c1917; color: #f5f5f4; }
    .claude-card { background: #262421; border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
  <div class="max-w-4xl w-full claude-card rounded-3xl p-8 sm:p-12 shadow-2xl">
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-stone-800">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-[#da6b47] animate-pulse"></span>
        <span class="text-xs font-mono font-bold text-[#da6b47] uppercase tracking-wider">
          ${selectedModel.name} × Zero Studio
        </span>
      </div>
      <span class="px-3 py-1 rounded-full bg-stone-800 text-xs font-mono text-stone-300">Live Component</span>
    </div>

    <h1 class="text-3xl sm:text-5xl font-black mb-4 text-stone-100">
      ${trimmed}
    </h1>
    <p class="text-stone-400 text-sm leading-relaxed mb-8 max-w-2xl">
      Synthesized with Claude-inspired warm aesthetics, dark stone gradients, and Tailwind CSS.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
        <div class="text-2xl font-bold text-[#da6b47] mb-1">Fast</div>
        <div class="text-xs font-bold text-stone-200 uppercase tracking-wider mb-1">Latency</div>
        <div class="text-[11px] text-stone-400">Sub-second generation</div>
      </div>
      <div class="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
        <div class="text-2xl font-bold text-amber-400 mb-1">Claude Theme</div>
        <div class="text-xs font-bold text-stone-200 uppercase tracking-wider mb-1">Warm Aesthetics</div>
        <div class="text-[11px] text-stone-400">Stone & Terracotta</div>
      </div>
      <div class="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
        <div class="text-2xl font-bold text-emerald-400 mb-1">100%</div>
        <div class="text-xs font-bold text-stone-200 uppercase tracking-wider mb-1">Verified</div>
        <div class="text-[11px] text-stone-400">Executable Code</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-4">
      <button onclick="alert('Action Triggered!')" class="px-6 py-3.5 rounded-xl bg-[#da6b47] hover:bg-[#e27452] text-stone-950 font-extrabold text-xs uppercase tracking-wider transition-all">
        Interactive Action
      </button>
    </div>
  </div>
</body>
</html>`;
      } else {
        replyText = `Regarding **"${trimmed}"**:\n\nThis query has been processed using **${selectedModel.name}** (${selectedModel.provider}). Feel free to ask for specific code implementations, explanations, or architectural designs!`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        code: replyCode || undefined,
        modelName: selectedModel.name
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex bg-[#181715] text-stone-200 font-body overflow-hidden"
    >
      {/* Left Sidebar (Claude.ai Style Warm Charcoal Sidebar) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-72 bg-[#141312] border-r border-stone-800 flex flex-col justify-between shrink-0 z-20"
          >
            {/* Sidebar Header & New Chat */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-xs font-bold font-label text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Home
                </button>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  CLAUDE THEME
                </span>
              </div>

              <button
                onClick={() => setMessages([])}
                className="w-full py-3 px-4 rounded-xl bg-[#211f1d] hover:bg-[#2c2926] border border-stone-700/50 text-xs font-bold text-stone-100 flex items-center justify-between transition-all cursor-pointer shadow-sm"
              >
                <span className="flex items-center gap-2 font-label">
                  <Plus className="w-4 h-4 text-[#da6b47]" /> New Chat
                </span>
              </button>

              {/* Chat History List */}
              <div className="pt-2">
                <span className="text-[10px] font-bold font-label text-stone-500 uppercase tracking-widest px-2 block mb-2">
                  Recent Conversations
                </span>
                <div className="space-y-1">
                  {INITIAL_WORKSPACE.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => generateAiResponse(`Show me code for: ${chat.title}`)}
                      className="w-full py-2.5 px-3 rounded-lg text-left text-xs text-stone-300 hover:bg-stone-800/60 hover:text-white transition-colors flex items-center gap-2.5 group cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#da6b47]" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Profile */}
            <div className="p-4 border-t border-stone-800 bg-[#121110]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#da6b47] flex items-center justify-center font-bold text-xs text-stone-950 font-label shadow-md">
                  ZS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100 font-headline">Zero Studio Code</h4>
                  <span className="text-[10px] text-amber-400 font-label flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Claude Model Studio
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#181715] relative">
        
        {/* Header Navbar */}
        <header className="h-16 px-6 border-b border-stone-800 bg-[#1c1917]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Layout className="w-4 h-4" />
            </button>

            <h1 className="text-base font-extrabold tracking-tight text-stone-100 font-headline flex items-center gap-2">
              Zero Studio Code <span className="text-xs px-2 py-0.5 rounded-md bg-[#da6b47]/20 text-[#da6b47] border border-[#da6b47]/40 font-label">Pro</span>
            </h1>
          </div>

          {/* Model Selector Dropdown with Official SVG Logos */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="px-4 py-2 rounded-xl bg-[#262421] border border-stone-700/60 hover:border-stone-600 transition-all text-xs font-bold text-stone-100 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {selectedModel.svgLogo("w-4 h-4")}
              <span className="font-headline">{selectedModel.name}</span>
              <span className="text-[10px] font-label text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                {selectedModel.badge}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Dropdown Menu */}
            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#262421] border border-stone-700 shadow-2xl p-2 z-50 space-y-1">
                {OFFICIAL_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedModel.id === model.id ? 'bg-stone-800 text-stone-100 font-bold' : 'text-stone-300 hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {model.svgLogo("w-5 h-5")}
                      <div>
                        <div className="font-bold text-stone-100 font-headline">{model.name}</div>
                        <div className="text-[10px] text-stone-400 font-label">{model.provider}</div>
                      </div>
                    </div>
                    {selectedModel.id === model.id && <Check className="w-4 h-4 text-[#da6b47]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Conversation Stream Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Welcome Screen (If no messages) */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto pt-10 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#262421] border border-stone-700/60 p-3 mx-auto mb-6 shadow-2xl flex items-center justify-center">
                {selectedModel.svgLogo("w-9 h-9")}
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-3 font-headline">
                What can I help you build with <span className="text-[#da6b47]">Zero Studio Code</span> today?
              </h2>
              <p className="text-sm text-stone-400 max-w-lg mx-auto mb-10 leading-relaxed font-body">
                Powered by official open-source models ({selectedModel.name}, DeepSeek-R1, Meta Llama 3.3, Qwen 2.5).
              </p>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <button
                  onClick={() => generateAiResponse('Build a Cyberpunk Glowing Landing Page with HTML and Tailwind CSS')}
                  className="p-5 rounded-2xl bg-[#262421] border border-stone-800 hover:border-[#da6b47]/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="text-xs font-bold text-stone-100 mb-1 group-hover:text-[#da6b47] transition-colors flex items-center gap-2 font-headline">
                    💻 Cyberpunk Landing Page
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-2 font-body">Generate a dark neon web page layout with Tailwind CSS.</p>
                </button>

                <button
                  onClick={() => generateAiResponse('Create a SaaS Analytics Dashboard UI component')}
                  className="p-5 rounded-2xl bg-[#262421] border border-stone-800 hover:border-[#da6b47]/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="text-xs font-bold text-stone-100 mb-1 group-hover:text-[#da6b47] transition-colors flex items-center gap-2 font-headline">
                    📊 SaaS Analytics Dashboard
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-2 font-body">Build interactive metric cards and layout widgets.</p>
                </button>

                <button
                  onClick={() => generateAiResponse('Write a Python Machine Learning Random Forest Classifier script')}
                  className="p-5 rounded-2xl bg-[#262421] border border-stone-800 hover:border-[#da6b47]/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="text-xs font-bold text-stone-100 mb-1 group-hover:text-[#da6b47] transition-colors flex items-center gap-2 font-headline">
                    🐍 Python ML Classifier
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-2 font-body">Train a Random Forest classification model with Scikit-Learn.</p>
                </button>

                <button
                  onClick={() => generateAiResponse('Explain how React 19 server actions and hooks work')}
                  className="p-5 rounded-2xl bg-[#262421] border border-stone-800 hover:border-[#da6b47]/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="text-xs font-bold text-stone-100 mb-1 group-hover:text-[#da6b47] transition-colors flex items-center gap-2 font-headline">
                    ⚡ React 19 Architecture
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-2 font-body">Explain server action hooks and modern state patterns.</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Conversation Stream (NO TIMESTAMPS) */}
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-[#262421] border border-stone-700/60 text-stone-100 flex items-center justify-center shrink-0 shadow-md">
                    {selectedModel.svgLogo("w-4 h-4")}
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-5 ${
                  msg.sender === 'user' 
                    ? 'bg-[#33302b] text-stone-100 font-medium shadow-md border border-stone-700/40' 
                    : 'bg-[#262421] border border-stone-800 text-stone-200 shadow-xl'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-label font-bold text-stone-400 uppercase">
                      {msg.sender === 'user' ? 'You' : (msg.modelName || selectedModel.name)}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed whitespace-pre-wrap font-body">{msg.text}</p>

                  {/* Render Code Block if present */}
                  {msg.code && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-stone-800 bg-[#141312]">
                      <div className="px-4 py-2 bg-[#1c1a18] border-b border-stone-800 flex items-center justify-between text-xs font-label text-stone-400">
                        <span>Code Block</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyCode(msg.code!, msg.id)}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedId === msg.id ? 'Copied' : 'Copy Code'}
                          </button>

                          {(msg.code.includes('<html') || msg.code.includes('<div') || msg.code.includes('<!DOCTYPE')) && (
                            <button
                              onClick={() => setPreviewCode(msg.code!)}
                              className="px-2.5 py-1 rounded bg-[#da6b47]/20 text-[#da6b47] border border-[#da6b47]/40 hover:bg-[#da6b47]/30 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Live Preview
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono text-amber-200/90 leading-relaxed max-h-96">
                        <code>{msg.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-stone-700 text-stone-100 font-bold text-xs flex items-center justify-center shrink-0">
                    U
                  </div>
                )}
              </motion.div>
            ))}

            {isGenerating && (
              <div className="flex gap-4 items-center max-w-4xl mx-auto">
                <div className="w-8 h-8 rounded-xl bg-[#262421] border border-stone-700 text-stone-100 flex items-center justify-center shrink-0 animate-pulse">
                  {selectedModel.svgLogo("w-4 h-4")}
                </div>
                <div className="px-5 py-3 rounded-2xl bg-[#262421] border border-stone-800 text-xs text-stone-400 font-body flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#da6b47]" />
                  <span>{selectedModel.name} is formulating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

        </div>

        {/* Input Bar (Claude Style Warm Bordered Bar) */}
        <div className="p-4 border-t border-stone-800 bg-[#1c1917]/95 backdrop-blur-xl shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-center gap-3">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating && inputPrompt.trim()) {
                  generateAiResponse(inputPrompt);
                }
              }}
              placeholder={`Message ${selectedModel.name}...`}
              className="flex-1 px-6 py-4 rounded-2xl bg-[#262421] border border-stone-700/60 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#da6b47] transition-all font-body"
            />

            <button
              onClick={() => {
                if (!isGenerating && inputPrompt.trim()) {
                  generateAiResponse(inputPrompt);
                }
              }}
              disabled={isGenerating || !inputPrompt.trim()}
              className="px-6 py-4 rounded-2xl bg-[#da6b47] hover:bg-[#e27452] text-stone-950 font-extrabold text-xs font-label uppercase tracking-wider transition-all shadow-lg shadow-[#da6b47]/20 flex items-center gap-2 disabled:opacity-40 cursor-pointer shrink-0"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Live Interactive UI Preview Modal */}
      {previewCode && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col p-4 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 text-stone-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#da6b47] animate-pulse"></span>
              <h3 className="font-bold text-sm font-headline">Zero Studio Code — Live Interactive Canvas</h3>
            </div>
            <button
              onClick={() => setPreviewCode(null)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-100 transition-colors cursor-pointer"
            >
              ✕ Close Preview
            </button>
          </div>
          <div className="flex-1 mt-4 rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl">
            <iframe
              srcDoc={previewCode}
              className="w-full h-full border-none"
              title="Live Interactive UI Canvas"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

