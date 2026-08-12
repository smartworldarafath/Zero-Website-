import { useState } from 'react';
import { generateContent } from '../services/ai';
import { Loader2, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useWork } from '../context/WorkContext';

export function EmailReplier() {
  const { emailReplier, setEmailReplier } = useWork();
  const { originalEmail, keyPoints, replyTone: tone, callToAction, additionalContext, wordCountType, customWordCount, result } = emailReplier;
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!originalEmail) return;
    setLoading(true);
    try {
      const wordCountInstruction = wordCountType === 'smart' 
        ? 'Determine the optimal length for a professional reply.' 
        : `Ensure the reply is approximately ${customWordCount} words long.`;

      const prompt = `
Original Email:
${originalEmail}

Key points to include in reply:
${keyPoints}

Tone: ${tone}
Call to Action: ${callToAction}
Additional Context: ${additionalContext}

Length Requirement: ${wordCountInstruction}
`;
      const systemInstruction = 'You are an expert email copywriter. Write clear, concise, and effective replies to the provided email based on the user\'s key points. Do not include any conversational filler, just the email content.';
      const response = await generateContent(prompt, systemInstruction);
      setEmailReplier({ result: response });
    } catch (error: any) {
      console.error(error);
      setEmailReplier({ result: `Failed to generate reply. Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 tracking-tight">Email Replier</h1>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">Draft context-aware replies with detailed requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 liquid-panel p-8 rounded-[2rem]">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Original Email
            </label>
            <textarea
              className="w-full rounded-2xl liquid-input p-4"
              rows={4}
              placeholder="Paste the email you received here..."
              value={originalEmail}
              onChange={(e) => setEmailReplier({ originalEmail: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Key points to include
            </label>
            <textarea
              className="w-full rounded-2xl liquid-input p-4"
              rows={2}
              placeholder="e.g., Yes, I can meet on Tuesday. Let's do 2 PM."
              value={keyPoints}
              onChange={(e) => setEmailReplier({ keyPoints: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Tone</label>
              <select
                className="w-full rounded-2xl liquid-input p-4 [&>option]:bg-white dark:[&>option]:bg-gray-900"
                value={tone}
                onChange={(e) => setEmailReplier({ replyTone: e.target.value })}
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Friendly</option>
                <option>Appreciative</option>
                <option>Firm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Call to Action (Optional)
              </label>
              <textarea
                className="w-full rounded-2xl liquid-input p-4"
                rows={1}
                placeholder="e.g., Send me the link."
                value={callToAction}
                onChange={(e) => setEmailReplier({ callToAction: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Additional Context (Optional)
            </label>
            <textarea
              className="w-full rounded-2xl liquid-input p-4"
              rows={2}
              placeholder="e.g., I'm currently traveling, so I might be slow to respond."
              value={additionalContext}
              onChange={(e) => setEmailReplier({ additionalContext: e.target.value })}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="block text-sm font-bold text-gray-900 dark:text-white">
              Word Selection
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setEmailReplier({ wordCountType: 'smart' })}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all",
                  wordCountType === 'smart' 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                )}
              >
                Smart Selection
              </button>
              <button
                onClick={() => setEmailReplier({ wordCountType: 'custom' })}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all",
                  wordCountType === 'custom' 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                )}
              >
                Custom Selection
              </button>
            </div>
            
            {wordCountType === 'custom' && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <input
                  type="number"
                  className="flex-1 rounded-xl liquid-input p-3 text-sm"
                  placeholder="Target word count (e.g., 150)"
                  value={customWordCount}
                  onChange={(e) => setEmailReplier({ customWordCount: e.target.value })}
                />
                <span className="text-xs text-gray-500 font-medium">words</span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!originalEmail || loading}
            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold liquid-button disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Reply
              </>
            )}
          </button>
        </div>

        <div className="liquid-panel p-8 rounded-[2rem] min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generated Reply</h2>
            {result && (
              <button
                onClick={handleCopy}
                className="liquid-glass px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 liquid-input rounded-2xl p-6 overflow-y-auto">
            {result ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown>{result}</Markdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                Your generated reply will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
