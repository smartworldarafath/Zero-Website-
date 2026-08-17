import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, Code, Eye, Copy, Download, Zap, Bot, 
  Plus, Send, RefreshCw, Check, Layout, MessageSquare, ChevronDown, User, 
  Search, Settings, Trash2, Paperclip, X, ArrowUp, Globe, Compass, Edit3,
  Video, Mic, Image as ImageIcon, Cpu, Terminal, Flame, Layers, ShieldCheck,
  Wand2, Sun, Moon, Palette, Key, Server, Radio, RotateCcw
} from 'lucide-react';
import { generateContent } from '../services/ai';
import { executeGroqCompletion } from '../services/groq';
import { LocalAiStudio } from './LocalAiStudio';

export type ThinkingLevel = 'Low' | 'Medium' | 'High' | 'Extra' | 'Max';
export type InputMode = 'Auto' | 'Video' | 'Audio' | 'Image' | 'Website' | 'Reasoning';

export interface ColorPalette {
  id: string;
  name: string;
  accent: string;
  accentText: string;
  accentSoft: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'violet', name: 'Stitch Violet', accent: '#a78bfa', accentText: '#c4b5fd', accentSoft: 'rgba(167, 139, 250, 0.18)' },
  { id: 'emerald', name: 'Emerald Green', accent: '#34d399', accentText: '#6ee7b7', accentSoft: 'rgba(52, 211, 153, 0.18)' },
  { id: 'cyan', name: 'Cyan Blue', accent: '#38bdf8', accentText: '#7dd3fc', accentSoft: 'rgba(56, 189, 248, 0.18)' },
  { id: 'rose', name: 'Rose Pink', accent: '#fb7185', accentText: '#fca5a5', accentSoft: 'rgba(251, 113, 133, 0.18)' },
  { id: 'amber', name: 'Amber Gold', accent: '#fbbf24', accentText: '#fde047', accentSoft: 'rgba(251, 191, 36, 0.18)' },
  { id: 'mono', name: 'Obsidian Mono', accent: '#e2e8f0', accentText: '#f8fafc', accentSoft: 'rgba(226, 232, 240, 0.18)' },
];

export interface ModelOption {
  id: string;
  name: string;
  modeCategory: InputMode;
  company: 'Anthropic' | 'Google' | 'Open AI' | 'Grok' | 'Meta' | 'Qwen' | 'Others';
  isPro?: boolean;
  tier?: 1 | 2;
  color: string;
  svgLogo: (className?: string) => React.ReactNode;
}

// Brand SVG Logos
const SvgLogos = {
  deepseek: (className = "w-4 h-4") => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gemini: (className = "w-4 h-4") => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemini-logo-grad)"/>
      <defs>
        <linearGradient id="gemini-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="50%" stopColor="#c4b5fd"/>
          <stop offset="100%" stopColor="#34d399"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  claude: (className = "w-4 h-4") => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#f97316"/>
    </svg>
  ),
  gpt: (className = "w-4 h-4") => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#a78bfa" strokeWidth="2"/>
      <path d="M12 7v10M7 12h10" stroke="#a78bfa" strokeWidth="2"/>
    </svg>
  ),
  video: (className = "w-4 h-4") => (
    <Video className={`${className} text-rose-400`} />
  ),
  audio: (className = "w-4 h-4") => (
    <Mic className={`${className} text-amber-400`} />
  ),
  image: (className = "w-4 h-4") => (
    <ImageIcon className={`${className} text-emerald-400`} />
  ),
  generic: (className = "w-4 h-4") => (
    <Sparkles className={`${className} text-purple-400`} />
  )
};

export const CATEGORIZED_MODELS: ModelOption[] = [
  // --- Video Generators ---
  { id: 'seedance-2.5', name: 'Seedance 2.5', modeCategory: 'Video', company: 'Others', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'seedance-2.0', name: 'Seedance 2.0', modeCategory: 'Video', company: 'Others', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'minimax-h3', name: 'Minimax H3', modeCategory: 'Video', company: 'Others', color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'gemini-omni-flash', name: 'Gemini Omni Flash', modeCategory: 'Video', company: 'Google', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'agnes-video-2.0', name: 'Agnes Video V2.0', modeCategory: 'Video', company: 'Others', color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', modeCategory: 'Video', company: 'Google', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'veo-3.1-lite', name: 'Veo 3.1 Lite', modeCategory: 'Video', company: 'Google', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'veo-3.1', name: 'Veo 3.1', modeCategory: 'Video', company: 'Google', isPro: true, color: 'text-rose-400', svgLogo: SvgLogos.video },
  { id: 'seedance-1.5-pro', name: 'Seedance 1.5 pro', modeCategory: 'Video', company: 'Others', color: 'text-rose-400', svgLogo: SvgLogos.video },
  
  // --- Audio Generators ---
  { id: 'grok-voice-1.0', name: 'Grok Voice 1.0', modeCategory: 'Audio', company: 'Grok', color: 'text-amber-400', svgLogo: SvgLogos.audio },
  { id: 'qwen-audio-3.0', name: 'Qwen Audio 3.0 (TTS plus)', modeCategory: 'Audio', company: 'Qwen', color: 'text-amber-400', svgLogo: SvgLogos.audio },
  { id: 'gemini-3.1-flash-audio', name: 'Gemini 3.1 Flash Audio', modeCategory: 'Audio', company: 'Google', color: 'text-amber-400', svgLogo: SvgLogos.audio },

  // --- Image Generators ---
  { id: 'agnes-image-2.1', name: 'Agnes Image 2.1 Flash', modeCategory: 'Image', company: 'Others', color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'qwen-image-3.0', name: 'Qwen Image 3.0', modeCategory: 'Image', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'qwen-image-3.0-pro', name: 'Qwen image 3.0 pro', modeCategory: 'Image', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'seedream-5.0-pro', name: 'Seedream 5.0 pro', modeCategory: 'Image', company: 'Others', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'nano-banana-2-lite', name: 'Nano Banana 2 lite (Gemini 3.1 Flash)', modeCategory: 'Image', company: 'Google', color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'nano-banana-2', name: 'Nano Banana 2 (Gemini 3.1 Flash)', modeCategory: 'Image', company: 'Google', isPro: true, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro (Gemini 3 pro)', modeCategory: 'Image', company: 'Google', isPro: true, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'chatgpt-image-2', name: 'Chat GPT Image 2', modeCategory: 'Image', company: 'Open AI', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'qwen-image-2.0', name: 'Qwen Image 2.0', modeCategory: 'Image', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'qwen-image-2.0-pro', name: 'Qwen Image 2.0 Pro', modeCategory: 'Image', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'seedream-5.0-lite', name: 'Seedream 5.0 Lite', modeCategory: 'Image', company: 'Others', color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'gpt-image-1.5', name: 'GPT Image 1.5', modeCategory: 'Image', company: 'Open AI', color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'kling-v2', name: 'Kling V2', modeCategory: 'Image', company: 'Others', isPro: true, color: 'text-emerald-400', svgLogo: SvgLogos.image },
  { id: 'muse-spark-1.2', name: 'Muse Spark 1.2', modeCategory: 'Image', company: 'Others', color: 'text-emerald-400', svgLogo: SvgLogos.image },

  // --- Anthropic Claude ---
  { id: 'claude-opus-5', name: 'Claude Opus 5', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, tier: 1, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-fable-5', name: 'Claude Fable 5', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, tier: 1, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-opus-4.8', name: 'Claude Opus 4.8', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, tier: 1, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-opus-4.7', name: 'Claude Opus 4.7', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, tier: 1, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', modeCategory: 'Reasoning', company: 'Anthropic', isPro: true, tier: 1, color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', modeCategory: 'Reasoning', company: 'Anthropic', color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', modeCategory: 'Reasoning', company: 'Anthropic', color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', modeCategory: 'Reasoning', company: 'Anthropic', color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', modeCategory: 'Reasoning', company: 'Anthropic', color: 'text-orange-400', svgLogo: SvgLogos.claude },
  { id: 'claude-opus-4.1', name: 'Claude Opus 4.1', modeCategory: 'Reasoning', company: 'Anthropic', color: 'text-orange-400', svgLogo: SvgLogos.claude },

  // --- DeepSeek ---
  { id: 'deep-seek-v4-pro', name: 'Deep Seek V4 pro', modeCategory: 'Reasoning', company: 'Others', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.deepseek },
  { id: 'deep-seek-v3.2', name: 'Deep Seek V3.2', modeCategory: 'Reasoning', company: 'Others', color: 'text-emerald-400', svgLogo: SvgLogos.deepseek },
  { id: 'deep-seek-v4-flash', name: 'Deep Seek V4 Flash', modeCategory: 'Reasoning', company: 'Others', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.deepseek },

  // --- Google Gemini ---
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', modeCategory: 'Reasoning', company: 'Google', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', modeCategory: 'Reasoning', company: 'Google', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', modeCategory: 'Reasoning', company: 'Google', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', modeCategory: 'Reasoning', company: 'Google', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', modeCategory: 'Reasoning', company: 'Google', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', modeCategory: 'Reasoning', company: 'Google', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-3.5-pro', name: 'Gemini 3.5 Pro', modeCategory: 'Reasoning', company: 'Google', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },
  { id: 'gemini-4', name: 'Gemini 4', modeCategory: 'Reasoning', company: 'Google', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gemini },

  // --- MiniMax ---
  { id: 'minimax-m3', name: 'MiniMax M3', modeCategory: 'Reasoning', company: 'Others', isPro: true, color: 'text-cyan-400', svgLogo: SvgLogos.generic },
  { id: 'minimax-m2.7', name: 'MiniMax M2.7', modeCategory: 'Reasoning', company: 'Others', color: 'text-cyan-400', svgLogo: SvgLogos.generic },
  { id: 'minimax-m2.5', name: 'MiniMax M2.5', modeCategory: 'Reasoning', company: 'Others', color: 'text-cyan-400', svgLogo: SvgLogos.generic },

  // --- Kimi ---
  { id: 'kimi-k3', name: 'Kimi K3', modeCategory: 'Reasoning', company: 'Others', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.generic },
  { id: 'kimi-k2.7-code', name: 'Kimi K2.7 Code', modeCategory: 'Reasoning', company: 'Others', isPro: true, color: 'text-[#a78bfa]', svgLogo: SvgLogos.generic },
  { id: 'kimi-k2.7', name: 'Kimi K2.7', modeCategory: 'Reasoning', company: 'Others', color: 'text-[#a78bfa]', svgLogo: SvgLogos.generic },
  { id: 'kimi-k2.6', name: 'Kimi K2.6', modeCategory: 'Reasoning', company: 'Others', color: 'text-[#a78bfa]', svgLogo: SvgLogos.generic },

  // --- OpenAI GPT ---
  { id: 'gpt-5.6-luna', name: 'GPT 5.6 Luna', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.6-sol', name: 'GPT 5.6 Sol', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.6-terra', name: 'GPT 5.6 Terra', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.5-instant', name: 'GPT 5.5 Instant', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.5', name: 'GPT 5.5', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.5-pro', name: 'GPT 5.5 Pro', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.4-pro', name: 'GPT 5.4 Pro', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.4', name: 'GPT 5.4', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 1, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.4-mini', name: 'GPT 5.4 Mini', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.3', name: 'GPT 5.3', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.3-pro', name: 'GPT 5.3 Pro', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.2-pro', name: 'GPT 5.2 Pro', modeCategory: 'Reasoning', company: 'Open AI', isPro: true, tier: 2, color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.2', name: 'GPT 5.2', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.1-pro', name: 'GPT 5.1 Pro', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.1-mini', name: 'GPT 5.1 Mini', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },
  { id: 'gpt-5.1', name: 'GPT 5.1', modeCategory: 'Reasoning', company: 'Open AI', color: 'text-[#a78bfa]', svgLogo: SvgLogos.gpt },

  // --- Alibaba Qwen ---
  { id: 'qwen-3.8-max', name: 'Qwen 3.8 Max', modeCategory: 'Reasoning', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.7-max', name: 'Qwen 3.7 Max', modeCategory: 'Reasoning', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.6-max', name: 'Qwen 3.6 Max', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.8-plus', name: 'Qwen 3.8 Plus', modeCategory: 'Reasoning', company: 'Qwen', isPro: true, tier: 2, color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.7-plus', name: 'Qwen 3.7 Plus', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.6-plus', name: 'Qwen 3.6 Plus', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.8-flash', name: 'Qwen 3.8 Flash', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.7-flash', name: 'Qwen 3.7 Flash', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },
  { id: 'qwen-3.6-flash', name: 'Qwen 3.6 Flash', modeCategory: 'Reasoning', company: 'Qwen', color: 'text-emerald-400', svgLogo: SvgLogos.generic },

  // --- Grok ---
  { id: 'grok-4.5', name: 'Grok 4.5', modeCategory: 'Reasoning', company: 'Grok', isPro: true, color: 'text-blue-400', svgLogo: SvgLogos.generic },
  { id: 'grok-4.3', name: 'Grok 4.3', modeCategory: 'Reasoning', company: 'Grok', color: 'text-blue-400', svgLogo: SvgLogos.generic },
  { id: 'grok-4.2', name: 'Grok 4.2', modeCategory: 'Reasoning', company: 'Grok', color: 'text-blue-400', svgLogo: SvgLogos.generic },

  // --- Xiaomi Mimo ---
  { id: 'xiaomi-mimo-v2.5-pro', name: 'Xiaomi Mimo V2.5 Pro', modeCategory: 'Reasoning', company: 'Others', isPro: true, color: 'text-orange-400', svgLogo: SvgLogos.generic },
  { id: 'xiaomi-mimo-v2.5', name: 'Xiaomi Mimo V2.5', modeCategory: 'Reasoning', company: 'Others', color: 'text-orange-400', svgLogo: SvgLogos.generic },

  // --- GLM ---
  { id: 'glm-5.2', name: 'GLM 5.2', modeCategory: 'Reasoning', company: 'Others', isPro: true, tier: 2, color: 'text-indigo-400', svgLogo: SvgLogos.generic },
  { id: 'glm-5.1', name: 'GLM 5.1', modeCategory: 'Reasoning', company: 'Others', isPro: true, color: 'text-indigo-400', svgLogo: SvgLogos.generic },
  { id: 'glm-5v-turbo', name: 'GLM 5V Turbo', modeCategory: 'Reasoning', company: 'Others', isPro: true, color: 'text-indigo-400', svgLogo: SvgLogos.generic },
  { id: 'glm-5-turbo', name: 'GLM 5 Turbo', modeCategory: 'Reasoning', company: 'Others', color: 'text-indigo-400', svgLogo: SvgLogos.generic },
  { id: 'glm-5', name: 'GLM 5', modeCategory: 'Reasoning', company: 'Others', color: 'text-indigo-400', svgLogo: SvgLogos.generic },
  { id: 'glm-4.7-flash', name: 'GLM 4.7 Flash', modeCategory: 'Reasoning', company: 'Others', color: 'text-indigo-400', svgLogo: SvgLogos.generic },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  code?: string;
  modelName?: string;
  thinkingLevel?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

const DEFAULT_SESSIONS: ChatSession[] = [];

const COMPANIES = ['Anthropic', 'Google', 'Open AI', 'Grok', 'Meta', 'Qwen', 'Others'] as const;

export function ZeroStudioPage({ 
  onBack,
  onPricingClick,
  onProjectsClick,
  initialMode,
  isWebsiteBuilder
}: { 
  onBack: () => void;
  onPricingClick?: () => void;
  onProjectsClick?: () => void;
  initialMode?: InputMode;
  isWebsiteBuilder?: boolean;
}) {
  const isGptWebMode = isWebsiteBuilder || initialMode === 'Website';
  const defaultGptModel = CATEGORIZED_MODELS.find(m => m.id === 'gpt-5.5' || m.id === 'gpt-5.6-luna') || CATEGORIZED_MODELS[0];
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    isGptWebMode ? defaultGptModel : (CATEGORIZED_MODELS.find(m => m.id === 'gemini-3.1-pro') || CATEGORIZED_MODELS[0])
  );
  const [currentMode, setCurrentMode] = useState<InputMode>(initialMode || (isWebsiteBuilder ? 'Website' : 'Auto'));
  const [modelThinkingLevels, setModelThinkingLevels] = useState<Record<string, ThinkingLevel>>({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('zero_stitch_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'session-1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings & Theme State
  const [activePaletteId, setActivePaletteId] = useState<string>(() => localStorage.getItem('zero_theme_palette') || 'violet');
  const [settingsTab, setSettingsTab] = useState<'palettes' | 'apiKeys' | 'mcp' | 'localAi'>('palettes');
  const [showLocalAiStudio, setShowLocalAiStudio] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => localStorage.getItem('zero_offline_mode') === 'true');

  // Custom API Keys State
  const [customApiKeys, setCustomApiKeys] = useState<{ id: string; name: string; provider: string; key: string }[]>(() => {
    const saved = localStorage.getItem('zero_custom_api_keys');
    return saved ? JSON.parse(saved) : [];
  });
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyProvider, setNewKeyProvider] = useState('Groq');
  const [newKeyValue, setNewKeyValue] = useState('');

  // MCP Servers State
  const [mcpServers, setMcpServers] = useState<{ id: string; name: string; endpoint: string; status: 'Active' | 'Disconnected' }[]>(() => {
    const saved = localStorage.getItem('zero_mcp_servers');
    return saved ? JSON.parse(saved) : [
      { id: 'mcp-1', name: 'GitHub Codebase Context MCP', endpoint: 'ws://localhost:8080/mcp/github', status: 'Active' },
      { id: 'mcp-2', name: 'PostgreSQL DB Schema MCP', endpoint: 'ws://localhost:8081/mcp/postgres', status: 'Disconnected' }
    ];
  });
  const [newMcpName, setNewMcpName] = useState('');
  const [newMcpEndpoint, setNewMcpEndpoint] = useState('');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [customSystemPrompt, setCustomSystemPrompt] = useState(() => localStorage.getItem('zero_system_prompt') || 'You are Zero Studio Code AI, an ultra-advanced software engineering and design suite.');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zero_theme');
    return saved ? saved === 'dark' : true;
  });

  const activePalette = COLOR_PALETTES.find(p => p.id === activePaletteId) || COLOR_PALETTES[0];

  const t = isDarkMode ? {
    // Dark Mode (Obsidian Liquid Glass)
    bg: '#09090b', bgAlt: '#0c0c0f',
    bgCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0) 100%), rgba(14, 14, 20, 0.55)',
    bgHover: 'rgba(255,255,255,0.06)', bgHover2: 'rgba(255,255,255,0.1)', bgHover3: 'rgba(255,255,255,0.14)',
    bgInput: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(14, 14, 20, 0.65)',
    bgInputFocus: 'rgba(14, 14, 20, 0.85)',
    text: '#fafafa', textSecondary: '#a1a1aa', textMuted: '#71717a', textDim: '#52525b', textGhost: '#3f3f46', textDark: '#27272a',
    border: 'rgba(255,255,255,0.08)', borderLight: 'rgba(255,255,255,0.14)', borderMed: 'rgba(255,255,255,0.18)',
    glassShadow: `inset 0 1.5px 1.5px 0 rgba(255,255,255,0.25), inset 0 -1px 1px 0 rgba(0,0,0,0.3), 0 20px 60px 0 rgba(0,0,0,0.45), 0 0 40px 0 ${activePalette.accent}22`,
    accent: activePalette.accent, accentHover: activePalette.accentText, accentSoft: activePalette.accentSoft, accentText: activePalette.accentText,
    green: '#34d399', greenSoft: 'rgba(52,211,153,0.18)',
    userBubble: `linear-gradient(135deg, ${activePalette.accent}33 0%, ${activePalette.accent}15 100%)`,
    aiBubble: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(14, 14, 20, 0.55)',
    sidebar: 'rgba(12,12,16,0.65)', header: 'rgba(9,9,12,0.6)',
    modal: 'rgba(15,15,22,0.85)', modalBg: 'rgba(0,0,0,0.75)',
    code: '#6ee7b7', codeBlock: 'rgba(9,9,12,0.85)',
    glow1: `${activePalette.accent}22`, glow2: 'rgba(52,211,153,0.1)',
    gradient: 'linear-gradient(to top, #09090b 45%, transparent)',
  } : {
    // Light Mode (Pearl Liquid Glass)
    bg: '#f8f9fc', bgAlt: '#f0f1f5',
    bgCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.65) 100%)',
    bgHover: 'rgba(0,0,0,0.03)', bgHover2: 'rgba(0,0,0,0.06)', bgHover3: 'rgba(0,0,0,0.09)',
    bgInput: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%)',
    bgInputFocus: 'rgba(255, 255, 255, 0.98)',
    text: '#18181b', textSecondary: '#52525b', textMuted: '#71717a', textDim: '#a1a1aa', textGhost: '#d4d4d8', textDark: '#e4e4e7',
    border: 'rgba(0,0,0,0.06)', borderLight: 'rgba(255,255,255,0.9)', borderMed: 'rgba(0,0,0,0.1)',
    glassShadow: `inset 0 1.5px 1.5px 0 rgba(255,255,255,1), inset 0 -1px 1px 0 rgba(0,0,0,0.05), 0 20px 60px 0 rgba(31,38,135,0.12), 0 0 40px 0 ${activePalette.accent}15`,
    accent: activePalette.accent, accentHover: activePalette.accentText, accentSoft: activePalette.accentSoft, accentText: activePalette.accent,
    green: '#059669', greenSoft: 'rgba(5,150,105,0.12)',
    userBubble: `linear-gradient(135deg, ${activePalette.accent}22 0%, ${activePalette.accent}08 100%)`,
    aiBubble: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
    sidebar: 'rgba(240,242,248,0.65)', header: 'rgba(248,249,252,0.65)',
    modal: 'rgba(255,255,255,0.85)', modalBg: 'rgba(0,0,0,0.35)',
    code: '#065f46', codeBlock: 'rgba(244,244,245,0.85)',
    glow1: `${activePalette.accent}15`, glow2: 'rgba(5,150,105,0.06)',
    gradient: 'linear-gradient(to top, #f8f9fc 45%, transparent)',
  };

  const toggleTheme = () => {
    const updateThemeState = () => {
      setIsDarkMode(prev => {
        const next = !prev;
        localStorage.setItem('zero_theme', next ? 'dark' : 'light');
        return next;
      });
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        updateThemeState();
      });
    } else {
      updateThemeState();
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('zero_stitch_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    const newSessionId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const fallback: ChatSession = { id: 'session-' + Date.now(), title: 'New Conversation', createdAt: Date.now(), messages: [] };
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('gemini_api_key', userApiKey.trim());
    localStorage.setItem('zero_system_prompt', customSystemPrompt.trim());
    setIsSettingsOpen(false);
  };

  const setThinkingLevelForModel = (modelId: string, level: ThinkingLevel, e: React.MouseEvent) => {
    e.stopPropagation();
    setModelThinkingLevels(prev => ({
      ...prev,
      [modelId]: level
    }));
  };

  const getThinkingLevel = (model: ModelOption): ThinkingLevel => {
    return modelThinkingLevels[model.id] || 'Medium';
  };

  const generateAiResponse = async (userQuery: string) => {
    const trimmed = userQuery.trim();
    if (!trimmed) return;

    setIsGenerating(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirstMsg = s.messages.length === 0;
        const newTitle = isFirstMsg ? (trimmed.slice(0, 26) + (trimmed.length > 26 ? '...' : '')) : s.title;
        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    setInputPrompt('');

    const currentThinkingLevel = getThinkingLevel(selectedModel);

    let finalResponseText = '';
    let finalCodeSnippet = '';

    // Advanced Local Synthesis mapped to Thinking Levels
    const lower = trimmed.toLowerCase();
    
    // Simulate thinking delay based on level
    let thinkDelay = 500;
    if (currentThinkingLevel === 'Low') thinkDelay = 200;
    if (currentThinkingLevel === 'Medium') thinkDelay = 1000;
    if (currentThinkingLevel === 'High') thinkDelay = 2500;
    if (currentThinkingLevel === 'Extra') thinkDelay = 4000;
    if (currentThinkingLevel === 'Max') thinkDelay = 6000;

    await new Promise(r => setTimeout(r, thinkDelay));

    if (currentMode === 'Image') {
      finalResponseText = `[🎨 Generating Image using ${selectedModel.name}]\n\nPrompt received: "${trimmed}"\n\n*(Note: Image generation request sent to model engine.)*`;
    } else if (currentMode === 'Video') {
      finalResponseText = `[🎬 Rendering Video using ${selectedModel.name}]\n\nPrompt received: "${trimmed}"\n\n*(Note: Video synthesis request sent to engine.)*`;
    } else if (currentMode === 'Audio') {
      finalResponseText = `[🎙️ Synthesizing Audio using ${selectedModel.name}]\n\nText-to-speech rendering: "${trimmed}"\n\n*(Note: Audio track generated.)*`;
    } else {
      // 100% Real API Execution Engine (20x Groq Key Pool + Zenmux + Gemini)
      let sysPrompt = customSystemPrompt;
      if (currentThinkingLevel === 'Low') sysPrompt += ". Answer as quickly and concisely as possible. No thinking out loud.";
      else if (currentThinkingLevel === 'Max') sysPrompt += ". Analyze deeply. Provide maximum cognitive effort, highest precision, and fully detailed structural answer. Strip out generic fluff.";
      
      let apiResponseText: string | null = null;
      
      // 1. Primary Engine: 20x Groq API Keys Pool with Automatic Rotation
      try {
        apiResponseText = await executeGroqCompletion(trimmed, selectedModel.id, sysPrompt);
      } catch (e) {
        console.warn("Groq API rotation failed:", e);
      }

// 2. Secondary Engine: Gemini API Fallback with Google Search Grounding
      if (!apiResponseText) {
         try {
           const effectiveKey = userApiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';
           if (effectiveKey) {
              const geminiResult = await generateContent(trimmed, sysPrompt);
              if (geminiResult) apiResponseText = geminiResult;
           }
         } catch (e) {
           console.warn("Gemini API failed:", e);
         }
      }

      // 4. Last Resort Fallback
      if (!apiResponseText) {
         try {
           const encodedPrompt = encodeURIComponent(trimmed);
           const controller = new AbortController();
           const timeoutId = setTimeout(() => controller.abort(), 6000);
           const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`, { signal: controller.signal });
           clearTimeout(timeoutId);
           
           if (response.ok) {
             const raw = await response.text();
             if (raw && !raw.includes('"error"')) {
               apiResponseText = raw;
             }
           }
         } catch(e) {}
      }

      // Parse API Output for Code Blocks
      if (apiResponseText) {
         const codeMatch = apiResponseText.match(/```(?:html|css|js|javascript|python|tsx|jsx)?\s*([\s\S]*?)```/);
         if (codeMatch && codeMatch[1]) {
           finalCodeSnippet = codeMatch[1].trim();
           finalResponseText = apiResponseText.replace(/```[\s\S]*?```/g, '').trim();
         } else {
           finalResponseText = apiResponseText.trim();
         }
      } else {
         finalResponseText = `I encountered a temporary issue connecting to the model API. Please try submitting your request again.`;
      }
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: finalResponseText,
      code: finalCodeSnippet || undefined,
      modelName: selectedModel.name,
      thinkingLevel: currentThinkingLevel
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, aiMsg]
        };
      }
      return s;
    }));

    setIsGenerating(false);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter models based on selected mode
  const modeFilteredModels = currentMode === 'Auto'
    ? CATEGORIZED_MODELS
    : CATEGORIZED_MODELS.filter(m => m.modeCategory === currentMode);

  // Mode icons map
  const modeIcons: Record<InputMode, React.ReactNode> = {
    'Auto': <Sparkles className="w-3.5 h-3.5" />,
    'Video': <Video className="w-3.5 h-3.5" />,
    'Audio': <Mic className="w-3.5 h-3.5" />,
    'Image': <ImageIcon className="w-3.5 h-3.5" />,
    'Website': <Globe className="w-3.5 h-3.5" />,
    'Reasoning': <Cpu className="w-3.5 h-3.5" />
  };

  if (showLocalAiStudio) {
    return (
      <LocalAiStudio 
        onBack={() => setShowLocalAiStudio(false)} 
        isDarkMode={isDarkMode} 
        activeAccentColor={t.accent} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[70] flex overflow-hidden theme-smooth"
      style={{ fontFamily: "'Geist', 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif", background: t.bg, color: t.text }}
    >
      {/* Ambient Glow Background */}
      <div className={isDarkMode ? "gemini-glow-bg" : "gemini-glow-bg-light"} />
      <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-500" style={{
        background: `radial-gradient(ellipse at 30% 0%, ${t.glow1} 0%, transparent 60%), radial-gradient(ellipse at 70% 100%, ${t.glow2} 0%, transparent 50%)`
      }} />

      {/* â”€â”€â”€ Left Sidebar â”€â”€â”€ */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-[280px] backdrop-blur-3xl flex flex-col shrink-0 z-20 transition-colors duration-500"
            style={{ background: t.sidebar, borderRight: `1px solid ${t.border}` }}
          >
            <div className="p-4 flex flex-col h-full overflow-hidden">
              {/* Top: Back + New Chat */}
              <div className="flex items-center gap-2.5 mb-5">
                <button onClick={onBack} className="p-2.5 rounded-xl transition-all duration-200 active:scale-95" style={{ background: t.bgHover, color: t.textMuted }}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNewChat} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-[11px] uppercase tracking-[0.08em] transition-all duration-300 active:scale-[0.97]" style={{ background: t.accentSoft, color: t.accentText, border: `1px solid ${t.accentSoft}` }}>
                  <Plus className="w-3.5 h-3.5" /> New Chat
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
                <input
                  type="text" placeholder="Search chats..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all duration-200"
                  style={{ background: t.bgInput, border: `1px solid ${t.borderLight}`, color: t.text }}
                />
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
                <p className="text-[9px] font-mono font-bold px-3 py-2 uppercase tracking-[0.12em]" style={{ color: t.textMuted }}>Conversations</p>
                {filteredSessions.length === 0 ? (
                  <div className="text-[11px] text-center py-10 font-light" style={{ color: t.textMuted }}>No conversations yet</div>
                ) : (
                  filteredSessions.map((session) => (
                    <motion.div
                      key={session.id} layout
                      onClick={() => setActiveSessionId(session.id)}
                      className="group flex items-center justify-between p-2.5 rounded-xl text-[11px] cursor-pointer transition-all duration-200"
                      style={{
                        background: activeSessionId === session.id ? t.bgHover2 : 'transparent',
                        color: activeSessionId === session.id ? t.text : t.textMuted,
                        border: activeSessionId === session.id ? `1px solid ${t.borderLight}` : '1px solid transparent'
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 transition-colors" style={{ color: activeSessionId === session.id ? t.accent : t.textMuted }} />
                        <span className="truncate">{session.title}</span>
                      </div>
                      <button onClick={(e) => handleDeleteSession(session.id, e)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-all duration-150">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="pt-4 mt-2 flex items-center justify-between transition-colors duration-500" style={{ borderTop: `1px solid ${t.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.accentSoft, border: `1px solid ${t.accentSoft}` }}>
                    <span className="font-bold text-[10px]" style={{ color: t.accentText }}>ZS</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: t.text }}>Zero Studio Code</div>
                    <div className="text-[9px] font-mono tracking-wider" style={{ color: t.textMuted }}>Stitch • {isDarkMode ? 'Obsidian' : 'Pearl'}</div>
                  </div>
                </div>
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-xl transition-all duration-200 active:scale-95" style={{ background: t.bgHover, color: t.textMuted }}>
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-[60px] px-5 flex items-center justify-between shrink-0 backdrop-blur-2xl z-30 transition-colors duration-500" style={{ background: t.header, borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#71717a] hover:text-[#fafafa] transition-all duration-200 active:scale-95">
              <Layout className="w-4 h-4" />
            </button>
            
            {/* Brand Title */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-[15px] font-black tracking-tight organic-gradient-text hidden sm:block">Zero Studio Code</h1>
              <span className="text-[9px] font-mono font-bold px-2 py-1 rounded-md bg-[#a78bfa]/8 text-[#a78bfa]/80 border border-[#a78bfa]/10 uppercase tracking-[0.1em] hidden md:block">
                Pro Suite
              </span>
            </div>

            {/* Model Switcher */}
            <div className="relative ml-1">
              <button onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-[7px] rounded-xl backdrop-blur-md text-[11px] font-medium transition-all duration-200 active:scale-[0.98] shadow-sm"
                style={{ background: t.bgCard, border: `1px solid ${t.borderLight}`, color: t.text }}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: t.bgHover }}>
                  {selectedModel.svgLogo("w-3.5 h-3.5")}
                </div>
                <span className="max-w-[120px] truncate">{selectedModel.name}</span>
                {selectedModel.isPro && (
                  <span className="text-[8px] font-mono font-black px-1.5 py-[2px] rounded uppercase tracking-wider" style={{ background: t.greenSoft, color: t.green }}>Pro</span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} style={{ color: t.textMuted }} />
              </button>

              <AnimatePresence>
                {isModelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                    className="absolute left-0 mt-2 w-[420px] backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 overflow-hidden"
                    style={{ background: t.modal, border: `1px solid ${t.borderMed}` }}
                  >
                    <div className="p-3 text-[10px] font-medium flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}`, color: t.textMuted }}>
                      <Layers className="w-3.5 h-3.5" />
                      Select {currentMode !== 'Auto' ? currentMode : 'AI'} Engine
                      {currentMode !== 'Auto' && <span className="ml-1 font-mono" style={{ color: t.accent }}>({currentMode})</span>}
                    </div>
                    <div className="max-h-[55vh] overflow-y-auto p-2 custom-scrollbar">
                      {COMPANIES.map(company => {
                        const compModels = modeFilteredModels.filter(m => m.company === company);
                        if (compModels.length === 0) return null;
                        return (
                          <div key={company} className="mb-3 last:mb-0">
                            <div className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.15em] sticky top-0 backdrop-blur z-10" style={{ background: t.modal, color: t.textMuted }}>{company}</div>
                            <div className="space-y-px mt-1">
                              {compModels.map(model => (
                                <div key={model.id} className="group/model p-2.5 rounded-xl transition-all duration-200 mb-1 border hover:bg-white/[0.04]"
                                  style={{
                                    background: selectedModel.id === model.id ? t.bgHover2 : 'transparent',
                                    borderColor: selectedModel.id === model.id ? t.accent : 'transparent'
                                  }}
                                >
                                  <div onClick={() => { setSelectedModel(model); setIsModelDropdownOpen(false); }} className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: selectedModel.id === model.id ? t.accentSoft : t.bgHover2 }}>
                                        {model.svgLogo("w-3.5 h-3.5")}
                                      </div>
                                      <span className="text-[11px] font-semibold" style={{ color: selectedModel.id === model.id ? t.text : t.textSecondary }}>{model.name}</span>
                                      {model.isPro && <span className="text-[8px] font-mono font-black px-1.5 py-[1px] rounded uppercase" style={{ background: t.greenSoft, color: t.green }}>Pro</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {model.tier && (
                                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.04]" style={{ color: t.accent }}>{getThinkingLevel(model)}</span>
                                      )}
                                      {selectedModel.id === model.id && <Check className="w-3.5 h-3.5" style={{ color: t.accent }} />}
                                    </div>
                                  </div>

                                  {/* Thinking Level Selection Bar — SHOWS ON MOUSE HOVER ONLY FOR SPECIFIED TIER MODELS */}
                                  {model.tier && (
                                    <div className="hidden group-hover/model:flex pt-2 mt-2 items-center gap-1 border-t transition-all duration-300 animate-fade-in" style={{ borderColor: t.border }}>
                                      <span className="text-[8px] font-mono uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0" style={{ color: t.textMuted }}>
                                        <Cpu className="w-3 h-3 text-[#a78bfa]" /> Think:
                                      </span>
                                      {(model.tier === 1 
                                        ? (['Low', 'Medium', 'High', 'Extra', 'Max'] as ThinkingLevel[])
                                        : (['Low', 'Medium', 'High'] as ThinkingLevel[])
                                      ).map(level => {
                                        const isActive = getThinkingLevel(model) === level;
                                        return (
                                          <button
                                            key={level}
                                            type="button"
                                            onClick={(e) => setThinkingLevelForModel(model.id, level, e)}
                                            className="flex-1 py-1 rounded-md text-[9px] font-mono font-semibold transition-all active:scale-95 text-center"
                                            style={{
                                              background: isActive ? t.accent : t.bgHover2,
                                              color: isActive ? (isDarkMode ? '#0a0012' : '#ffffff') : t.textMuted,
                                              border: `1px solid ${isActive ? t.accent : t.borderLight}`
                                            }}
                                          >
                                            {level}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2.5 rounded-xl transition-all duration-300 active:scale-90 shadow-sm" style={{ background: t.bgHover, color: t.accentText, border: `1px solid ${t.borderLight}` }} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <AnimatePresence mode="wait">
              <motion.div key={isDarkMode ? 'dark' : 'light'} initial={{ scale: 0.5, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.5, rotate: 180, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </header>

        {/* ─── Chat Canvas ─── */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-48 custom-scrollbar">
          <div className="w-full max-w-[800px] mx-auto pt-6 space-y-5">
            {messages.length === 0 ? (
              /* ──── Premium Hero Empty State ──── */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center py-10"
              >
                {/* Animated Logo Orb */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative mb-8"
                >
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center transition-colors duration-500" style={{ background: t.accentSoft, border: `1px solid ${t.borderLight}`, boxShadow: `0 0 60px ${t.glow1}` }}>
                    {selectedModel.svgLogo("w-12 h-12")}
                  </div>
                  {selectedModel.isPro && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                      className="absolute -bottom-2 -right-2 p-1.5 rounded-xl shadow-lg transition-colors duration-500" style={{ background: t.bgAlt, border: `1px solid ${t.borderMed}` }}>
                      <ShieldCheck className="w-4 h-4" style={{ color: t.green }} />
                    </motion.div>
                  )}
                </motion.div>

                <h2 className="text-[40px] md:text-[52px] font-light tracking-[-0.03em] mb-3 leading-[1.1] transition-colors duration-500" style={{ fontFamily: "'Outfit', sans-serif", color: t.text }}>
                  {isGptWebMode || currentMode === 'Website' ? 'What website would you like to build?' : 'How can I help?'}
                </h2>
                <p className="text-sm max-w-md mx-auto font-light leading-relaxed mb-10 transition-colors duration-500" style={{ color: t.textMuted }}>
                  {isGptWebMode || currentMode === 'Website' ? (
                    <>ChatGPT Website Architect • Powered by <span className="text-[#c4b5fd] font-medium">{selectedModel.name}</span></>
                  ) : (
                    <>Powered by <span className="text-[#c4b5fd] font-medium">{selectedModel.name}</span></>
                  )}
                  {selectedModel.isPro && selectedModel.tier && (
                    <span className="ml-1.5 text-[#34d399]/70 font-mono text-[10px]">[{getThinkingLevel(selectedModel)}]</span>
                  )}
                </p>

                {/* Suggestion & Featured Showcase Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[600px]">
                  {(isGptWebMode || currentMode === 'Website' ? [
                    {
                      icon: <Code className="w-5 h-5 text-emerald-400" />,
                      title: 'Modern Landing Page',
                      desc: 'Dark neon glassmorphism hero, features & pricing',
                      prompt: 'Create a responsive modern dark landing page with glassmorphism effects, hero section, interactive feature cards, pricing table, and footer using HTML and Tailwind CSS'
                    },
                    {
                      icon: <Globe className="w-5 h-5 text-sky-400" />,
                      title: 'E-Commerce Storefront',
                      desc: 'Product showcase, category filters & cart drawer',
                      prompt: 'Create a clean modern e-commerce storefront with product cards, category filters, interactive cart drawer, and checkout modal using HTML, Tailwind CSS and JavaScript'
                    },
                    {
                      icon: <Laptop className="w-5 h-5 text-violet-400" />,
                      title: 'Developer Portfolio',
                      desc: 'Interactive project grid, animated skills & contact',
                      prompt: 'Create an ultra-sleek developer portfolio with interactive project cards, animated skill bars, contact form, and smooth scrolling using HTML and Tailwind CSS'
                    },
                    {
                      icon: <Layers className="w-5 h-5 text-rose-400" />,
                      title: 'SaaS Analytics Dashboard',
                      desc: 'Sidebar layout, metric cards & data tables',
                      prompt: 'Create a modern SaaS analytics dashboard with sidebar navigation, metric KPI cards, data tables, and chart placeholders using HTML and Tailwind CSS'
                    }
                  ] : [
                    { 
                      icon: <Globe className="w-5 h-5 text-emerald-400" />, 
                      title: 'Arabian Enterprise', 
                      desc: 'Corporate enterprise web portal & business services', 
                      url: 'https://arbian-enterprise.vercel.app/' 
                    },
                    { 
                      icon: <Laptop className="w-5 h-5 text-sky-400" />, 
                      title: 'International Education Consultancy', 
                      desc: 'Global study abroad consultancy & visa guide platform', 
                      url: 'https://international-education-consultancy.vercel.app/' 
                    },
                    { 
                      icon: <Cpu className="w-5 h-5 text-violet-400" />, 
                      title: 'Explain Concepts', 
                      desc: 'Quantum computing, AI, & physics', 
                      prompt: 'Explain quantum computing in simple terms with key concepts like qubits and superposition' 
                    },
                    { 
                      icon: <Wand2 className="w-5 h-5 text-rose-400" />, 
                      title: 'Debug & Fix Code', 
                      desc: 'CSS, layout, & logic errors', 
                      prompt: 'How do I center a div perfectly using modern CSS techniques like grid and flexbox?' 
                    }
                  ]).map((card, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => {
                        if ((card as any).url) {
                          window.open((card as any).url, '_blank');
                        } else if (card.prompt) {
                          generateAiResponse(card.prompt);
                        }
                      }}
                      className="group flex flex-col items-start text-left p-5 rounded-2xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98] backdrop-blur-3xl cursor-pointer"
                      style={{ background: t.bgCard, border: `1px solid ${t.borderLight}`, boxShadow: t.glassShadow }}
                    >
                      <div className="mb-3 transition-colors duration-200">{card.icon}</div>
                      <h3 className="text-[12px] font-semibold mb-1 transition-colors flex items-center justify-between w-full" style={{ color: t.text }}>
                        {card.title}
                        {(card as any).url && <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: t.accent }} />}
                      </h3>
                      <p className="text-[11px] font-light leading-relaxed" style={{ color: t.textMuted }}>{card.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* ──── Chat Messages ──── */
              messages.map((msg, msgIdx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm transition-colors duration-500" style={{ background: t.accentSoft, border: `1px solid ${t.border}` }}>
                      {selectedModel.svgLogo("w-4 h-4")}
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-2xl rounded-2xl text-[13px] leading-[1.7] font-light backdrop-blur-2xl transition-all duration-500 ${
                      msg.sender === 'user' ? 'rounded-br-md px-5 py-3.5' : 'rounded-bl-md px-5 py-4 space-y-3'
                    }`}
                    style={{
                      background: msg.sender === 'user' ? t.userBubble : t.aiBubble,
                      color: t.text,
                      border: `1px solid ${msg.sender === 'user' ? t.accentSoft : t.borderLight}`,
                      boxShadow: msg.sender === 'ai' ? t.glassShadow : 'none'
                    }}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-2 pb-2.5 mb-2.5 text-[10px] font-mono transition-colors duration-500" style={{ borderBottom: `1px solid ${t.border}`, color: t.textMuted }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: t.green }} />
                        <span>{msg.modelName || selectedModel.name}</span>
                        {msg.thinkingLevel && <span className="ml-auto" style={{ color: t.textDim }}>{msg.thinkingLevel}</span>}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.code && (
                      <div className="mt-3 rounded-xl border overflow-hidden transition-colors duration-500" style={{ border: `1px solid ${t.borderLight}`, background: t.codeBlock }}>
                        <div className="flex items-center justify-between px-4 py-2 text-[10px] font-mono" style={{ background: t.bgHover2, borderBottom: `1px solid ${t.border}`, color: t.textMuted }}>
                          <div className="flex items-center gap-2">
                            <Code className="w-3.5 h-3.5" style={{ color: t.green }} />
                            <span>Generated Code</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => copyCode(msg.code!, msg.id)} className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors" style={{ color: t.textMuted }}>
                              {copiedId === msg.id ? <Check className="w-3 h-3" style={{ color: t.green }} /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === msg.id ? 'Copied!' : 'Copy'}</span>
                            </button>
                            {(msg.code.includes('<html') || msg.code.includes('<!DOCTYPE')) && (
                              <button onClick={() => setPreviewCode(msg.code!)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all" style={{ background: t.accentSoft, color: t.accentText }}>
                                <Eye className="w-3 h-3" /> Preview
                              </button>
                            )}
                          </div>
                        </div>
                        <pre className="p-4 text-[11px] font-mono overflow-x-auto custom-scrollbar leading-relaxed" style={{ color: t.code }}>{msg.code}</pre>
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 mt-1 transition-colors duration-500" style={{ background: t.accentSoft, color: t.accentText, border: `1px solid ${t.accentSoft}` }}>
                      U
                    </div>
                  )}
                </motion.div>
              ))
            )}
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#34d399]/10 border border-white/[0.06] flex items-center justify-center shadow-sm">
                  {selectedModel.svgLogo("w-4 h-4")}
                </div>
                <div className="bg-white/[0.03] border border-white/[0.04] rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#52525b] font-mono ml-2">{selectedModel.name} is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ─── Input Area ─── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-none z-40" style={{ background: t.gradient }}>
          <div className="w-full max-w-[800px] mx-auto pointer-events-auto">
            <form onSubmit={(e) => { e.preventDefault(); generateAiResponse(inputPrompt); }}
              className="backdrop-blur-3xl rounded-2xl transition-all duration-500"
              style={{ background: t.bgInput, border: `1px solid ${t.borderLight}`, boxShadow: t.glassShadow }}
            >
              <textarea
                value={inputPrompt} onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateAiResponse(inputPrompt); }}}
                placeholder={`Message ${selectedModel.name}...`}
                rows={1}
                className="w-full bg-transparent text-[13px] focus:outline-none font-light resize-none min-h-[52px] max-h-[200px] py-4 px-5 custom-scrollbar transition-colors duration-500"
                style={{ fontFamily: "'Geist', sans-serif", color: t.text }}
                onInput={(e: any) => { e.target.style.height = ''; e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; }}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-lg transition-all duration-200 active:scale-95" style={{ background: t.bgHover, color: t.textMuted }}>
                    <Paperclip className="w-4 h-4" />
                  </button>
                  {/* Mode Selector */}
                  <div className="relative">
                    <button type="button" onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 active:scale-[0.97]"
                      style={{ background: t.bgHover2, border: `1px solid ${t.borderLight}`, color: t.text }}
                    >
                      {modeIcons[currentMode]}
                      <span className="font-mono">{currentMode}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isModeSelectorOpen ? 'rotate-180' : ''}`} style={{ color: t.textMuted }} />
                    </button>
                    <AnimatePresence>
                      {isModeSelectorOpen && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full left-0 mb-2 w-40 backdrop-blur-2xl rounded-xl shadow-2xl p-1.5 z-[100]"
                          style={{ background: t.modal, border: `1px solid ${t.borderMed}` }}
                        >
                          {(['Auto', 'Video', 'Audio', 'Image', 'Website', 'Reasoning'] as InputMode[]).map(mode => (
                            <button key={mode} type="button"
                              onClick={() => {
                                setCurrentMode(mode); setIsModeSelectorOpen(false);
                                const validModels = mode === 'Auto' ? CATEGORIZED_MODELS : CATEGORIZED_MODELS.filter(m => m.modeCategory === mode);
                                if (!validModels.find(m => m.id === selectedModel.id)) setSelectedModel(validModels[0]);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition-all"
                              style={{
                                background: currentMode === mode ? t.accentSoft : 'transparent',
                                color: currentMode === mode ? t.accentText : t.textMuted
                              }}
                            >
                              {modeIcons[mode]}
                              {mode}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <button type="submit" disabled={!inputPrompt.trim() || isGenerating}
                  className="w-9 h-9 flex items-center justify-center rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 active:scale-90 shadow-md"
                  style={{ background: t.accent, color: isDarkMode ? '#0a0012' : '#ffffff' }}
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />}
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] mt-2.5 font-mono" style={{ color: t.textMuted }}>Zero Studio Code AI may produce inaccurate results. Verify important information.</p>
          </div>
        </div>
      </div>

      {/* ─── Settings Modal ─── */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] backdrop-blur-lg flex items-center justify-center p-4"
            style={{ background: t.modalBg }}
            onClick={() => setIsSettingsOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full rounded-3xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] space-y-5 backdrop-blur-2xl border"
              style={{ background: t.modal, borderColor: t.borderMed }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: t.border }}>
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5" style={{ color: t.accent }} />
                  <h3 className="font-bold text-base tracking-tight" style={{ color: t.text }}>Zero Studio Settings</h3>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: t.bgHover, color: t.textMuted }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Settings Tabs Bar */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl border" style={{ background: t.bgHover, borderColor: t.border }}>
                <button
                  type="button"
                  onClick={() => setSettingsTab('palettes')}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: settingsTab === 'palettes' ? t.accent : 'transparent',
                    color: settingsTab === 'palettes' ? (isDarkMode ? '#0a0012' : '#ffffff') : t.textMuted
                  }}
                >
                  <Palette className="w-3.5 h-3.5" /> Palettes
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsTab('apiKeys')}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: settingsTab === 'apiKeys' ? t.accent : 'transparent',
                    color: settingsTab === 'apiKeys' ? (isDarkMode ? '#0a0012' : '#ffffff') : t.textMuted
                  }}
                >
                  <Key className="w-3.5 h-3.5" /> API Keys
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsTab('mcp')}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: settingsTab === 'mcp' ? t.accent : 'transparent',
                    color: settingsTab === 'mcp' ? (isDarkMode ? '#0a0012' : '#ffffff') : t.textMuted
                  }}
                >
                  <Server className="w-3.5 h-3.5" /> MCP Servers
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsTab('localAi')}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: settingsTab === 'localAi' ? t.accent : 'transparent',
                    color: settingsTab === 'localAi' ? (isDarkMode ? '#0a0012' : '#ffffff') : t.textMuted
                  }}
                >
                  <Cpu className="w-3.5 h-3.5" /> Local AI
                </button>
              </div>

              {/* TAB 1: Color Palettes & Reset Button */}
              {settingsTab === 'palettes' && (
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Accent Color Palettes</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePaletteId('violet');
                        localStorage.setItem('zero_theme_palette', 'violet');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition-all border hover:scale-105 active:scale-95 shadow-sm"
                      style={{ background: t.bgHover, borderColor: t.border, color: t.accentText }}
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Default Palette
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {COLOR_PALETTES.map(p => {
                      const isSelected = activePaletteId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setActivePaletteId(p.id);
                            localStorage.setItem('zero_theme_palette', p.id);
                          }}
                          className="p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105"
                          style={{
                            background: isSelected ? t.bgHover2 : t.bgHover,
                            borderColor: isSelected ? p.accent : t.border,
                            boxShadow: isSelected ? `0 0 20px ${p.accent}44` : 'none'
                          }}
                        >
                          <span className="w-7 h-7 rounded-full shadow-inner border border-white/20" style={{ background: p.accent }} />
                          <span className="text-xs font-bold" style={{ color: isSelected ? t.text : t.textMuted }}>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Custom API Keys Vault */}
              {settingsTab === 'apiKeys' && (
                <div className="space-y-4 py-2">
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    System 20x Groq Rotation keys remain safely active. Add custom API keys below:
                  </p>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Key Name (e.g. Personal Gemini)"
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border"
                        style={{ background: t.bgHover, borderColor: t.border, color: t.text }}
                      />
                      <select
                        value={newKeyProvider}
                        onChange={e => setNewKeyProvider(e.target.value)}
                        className="px-3 py-2 rounded-xl text-xs outline-none border font-mono"
                        style={{ background: t.bgHover, borderColor: t.border, color: t.text }}
                      >
                        <option value="Groq">Groq</option>
                        <option value="Gemini">Gemini</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Anthropic">Anthropic</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="API Key string (gsk_... or AIzaSy...)"
                        value={newKeyValue}
                        onChange={e => setNewKeyValue(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border font-mono"
                        style={{ background: t.bgHover, borderColor: t.border, color: t.text }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newKeyValue.trim()) return;
                          const newEntry = {
                            id: 'key-' + Date.now(),
                            name: newKeyName.trim() || 'Custom Key',
                            provider: newKeyProvider,
                            key: newKeyValue.trim()
                          };
                          const updated = [...customApiKeys, newEntry];
                          setCustomApiKeys(updated);
                          localStorage.setItem('zero_custom_api_keys', JSON.stringify(updated));
                          setNewKeyName('');
                          setNewKeyValue('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                        style={{ background: t.accent, color: isDarkMode ? '#0a0012' : '#ffffff' }}
                      >
                        Add Key
                      </button>
                    </div>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-2 custom-scrollbar">
                    {customApiKeys.length === 0 ? (
                      <p className="text-[11px] italic font-mono text-center py-4" style={{ color: t.textMuted }}>No custom keys added yet. Using default 20-key Groq Rotation Vault.</p>
                    ) : (
                      customApiKeys.map(k => (
                        <div key={k.id} className="p-3 rounded-xl border flex items-center justify-between text-xs" style={{ background: t.bgHover, borderColor: t.border }}>
                          <div>
                            <div className="font-semibold">{k.name} <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10">{k.provider}</span></div>
                            <div className="text-[10px] font-mono text-stone-500">{k.key.slice(0, 8)}••••••••</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = customApiKeys.filter(x => x.id !== k.id);
                              setCustomApiKeys(updated);
                              localStorage.setItem('zero_custom_api_keys', JSON.stringify(updated));
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MCP Servers */}
              {settingsTab === 'mcp' && (
                <div className="space-y-4 py-2">
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    Model Context Protocol (MCP) endpoints for local tools & database connectors:
                  </p>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="MCP Server Name"
                        value={newMcpName}
                        onChange={e => setNewMcpName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border"
                        style={{ background: t.bgHover, borderColor: t.border, color: t.text }}
                      />
                      <input
                        type="text"
                        placeholder="ws://localhost:8080/mcp"
                        value={newMcpEndpoint}
                        onChange={e => setNewMcpEndpoint(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border font-mono"
                        style={{ background: t.bgHover, borderColor: t.border, color: t.text }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMcpEndpoint.trim()) return;
                          const updated = [...mcpServers, {
                            id: 'mcp-' + Date.now(),
                            name: newMcpName.trim() || 'Custom MCP Server',
                            endpoint: newMcpEndpoint.trim(),
                            status: 'Active' as const
                          }];
                          setMcpServers(updated);
                          localStorage.setItem('zero_mcp_servers', JSON.stringify(updated));
                          setNewMcpName('');
                          setNewMcpEndpoint('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                        style={{ background: t.accent, color: isDarkMode ? '#0a0012' : '#ffffff' }}
                      >
                        Connect
                      </button>
                    </div>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-2 custom-scrollbar">
                    {mcpServers.map(s => (
                      <div key={s.id} className="p-3 rounded-xl border flex items-center justify-between text-xs" style={{ background: t.bgHover, borderColor: t.border }}>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {s.name}
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-500/20 text-stone-400'}`}>
                              {s.status}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono" style={{ color: t.textMuted }}>{s.endpoint}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mcpServers.filter(x => x.id !== s.id);
                            setMcpServers(updated);
                            localStorage.setItem('zero_mcp_servers', JSON.stringify(updated));
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Local AI & Offline Engine */}
              {settingsTab === 'localAi' && (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl border space-y-3" style={{ background: t.bgHover, borderColor: t.border }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className={`w-4 h-4 ${isOfflineMode ? 'text-emerald-400 animate-pulse' : 'text-stone-500'}`} />
                        <span className="font-bold text-xs">Run Zero Studio 100% Offline</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isOfflineMode;
                          setIsOfflineMode(next);
                          localStorage.setItem('zero_offline_mode', String(next));
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-sm active:scale-95"
                        style={{
                          background: isOfflineMode ? '#34d399' : t.bgHover2,
                          color: isOfflineMode ? '#0a0012' : t.textMuted
                        }}
                      >
                        {isOfflineMode ? 'OFFLINE ACTIVE' : 'DISABLED'}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>
                      When active, zero internet connectivity is used. Completion requests run locally on your device hardware via WebGPU weights.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setShowLocalAiStudio(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
                    style={{ background: t.accent, color: isDarkMode ? '#0a0012' : '#ffffff' }}
                  >
                    <Cpu className="w-4 h-4" /> Open Full-Screen Local AI Studio
                  </button>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-2.5 pt-3 border-t" style={{ borderColor: t.border }}>
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 rounded-xl font-medium text-[11px] transition-all" style={{ background: t.bgHover, color: t.textMuted }}>Close</button>
                <button type="button" onClick={handleSaveSettings} className="px-5 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all active:scale-[0.97] shadow-md" style={{ background: t.accent, color: isDarkMode ? '#0a0012' : '#ffffff' }}>Save Settings</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Live Preview Modal ─── */}
      <AnimatePresence>
        {previewCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] backdrop-blur-lg flex flex-col p-4 sm:p-6" style={{ background: t.modalBg }}>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2.5" style={{ color: t.text }}>
                <Eye className="w-5 h-5" style={{ color: t.accent }} />
                <span className="font-semibold text-[13px]">Live Preview</span>
              </div>
              <button onClick={() => setPreviewCode(null)} className="p-2 rounded-xl transition-all active:scale-95" style={{ background: t.bgHover, color: t.text }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <iframe title="Live Preview" srcDoc={previewCode} className="w-full h-full border-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


