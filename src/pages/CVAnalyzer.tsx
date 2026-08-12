import { useState, useRef } from 'react';
import { analyzeDocumentWithAI } from '../services/ai';
import { Loader2, Sparkles, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { AnalysisResult, AnalysisData } from '../components/AnalysisResult';
import { parseFile } from '../utils/fileParser';
import { Type } from '@google/genai';
import { GlowingTimer } from '../components/GlowingTimer';
import { useWork } from '../context/WorkContext';

export function CVAnalyzer() {
  const { cvAnalyzer, setCvAnalyzer } = useWork();
  const { cvText, jobDescription, result } = cvAnalyzer;
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingImproved, setGeneratingImproved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCvAnalyzer({ cvText: '' }); // Clear text if file is uploaded
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!cvText && !file) return;
    setLoading(true);
    try {
      let fileParts: any[] = [];
      let promptText = `Analyze this CV.\n\nTarget Job Description (if any):\n${jobDescription}`;

      if (file) {
        const parsed = await parseFile(file);
        if (parsed.inlineData) {
          fileParts.push({ inlineData: parsed.inlineData });
        } else if (parsed.text) {
          promptText = `CV Content:\n${parsed.text}\n\n` + promptText;
        }
      } else {
        promptText = `CV Content:\n${cvText}\n\n` + promptText;
      }

      const systemInstruction = 'You are an expert ATS (Applicant Tracking System) and career coach. Analyze the provided CV. Evaluate the CV against the job description if provided. You MUST return a JSON object with the following structure: aiPercentage (0-100), humanPercentage (0-100), perfectnessScore (0-100), mistakes (array of objects with mistake, correction, context), feedback (markdown string). Keep your feedback concise and limit the mistakes array to a MAXIMUM of 5 most critical mistakes. DO NOT echo back large portions of the original text. NEVER include base64 strings or raw file data in your response.';
      
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          aiPercentage: { type: Type.NUMBER, description: "Estimated percentage of AI-generated content" },
          humanPercentage: { type: Type.NUMBER, description: "Estimated percentage of human-written content" },
          perfectnessScore: { type: Type.NUMBER, description: "Overall score out of 100" },
          mistakes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mistake: { type: Type.STRING, description: "The mistake found" },
                correction: { type: Type.STRING, description: "Suggested correction" },
                context: { type: Type.STRING, description: "A SHORT snippet (max 10 words) of the original text containing the mistake" }
              },
              required: ["mistake", "correction", "context"]
            }
          },
          feedback: { type: Type.STRING, description: "Concise general feedback and actionable suggestions in Markdown" }
        },
        required: ["aiPercentage", "humanPercentage", "perfectnessScore", "mistakes", "feedback"]
      };

      const responseText = await analyzeDocumentWithAI(promptText, fileParts, systemInstruction, responseSchema);
      
      // Robust JSON extraction
      let jsonStr = responseText.trim();
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsedResult = JSON.parse(jsonStr);
      
      // Calculate word count
      const textToCount = file ? (await parseFile(file)).text || '' : cvText;
      const wordCount = textToCount.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      setCvAnalyzer({ result: { ...parsedResult, wordCount } });
    } catch (error: any) {
      console.error('Analysis error:', error);
      let errorMessage = error.message || 'Failed to analyze CV.';
      if (error instanceof SyntaxError) {
        errorMessage = "The AI generated an improperly formatted response. Please try again or provide clearer input.";
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImproved = async () => {
    if (!result || (!cvText && !file)) return;
    setGeneratingImproved(true);
    try {
      let fileParts: any[] = [];
      let promptText = `Rewrite and improve this CV based on the previous analysis. Make it ATS-friendly, professional, and tailored to the job description if provided.\n\nTarget Job Description:\n${jobDescription}`;

      if (file) {
        const parsed = await parseFile(file);
        if (parsed.inlineData) {
          fileParts.push({ inlineData: parsed.inlineData });
        } else if (parsed.text) {
          promptText = `Original CV Content:\n${parsed.text}\n\n` + promptText;
        }
      } else {
        promptText = `Original CV Content:\n${cvText}\n\n` + promptText;
      }

      const systemInstruction = 'You are an expert resume writer. Rewrite the provided CV to be perfect, professional, and ATS-optimized. Return ONLY the improved CV text in Markdown format.';
      
      const responseText = await analyzeDocumentWithAI(promptText, fileParts, systemInstruction);
      
      setCvAnalyzer({
        result: {
          ...result,
          improvedVersion: responseText
        }
      });
    } catch (error: any) {
      console.error(error);
      alert(`Failed to generate improved version. Error: ${error.message}`);
    } finally {
      setGeneratingImproved(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 tracking-tight">CV Analyzer</h1>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">Upload your CV (PDF, Image, Word) or paste text to get actionable feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 liquid-panel p-8 rounded-[2rem]">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Upload CV File (PDF, Word, Image)
            </label>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileIcon className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                  <button 
                    onClick={(e) => { e.preventDefault(); clearFile(); }}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center z-10 relative"
                  >
                    <X className="w-3 h-3 mr-1" /> Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Drag & drop or click to upload</span>
                  <span className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, PNG, JPG</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">OR PASTE TEXT</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              className="w-full rounded-2xl liquid-input p-4 font-mono text-sm"
              rows={6}
              placeholder="John Doe\nSoftware Engineer\n\nExperience:\n- Company A..."
              value={cvText}
              onChange={(e) => { setCvAnalyzer({ cvText: e.target.value }); if (e.target.value) clearFile(); }}
              disabled={!!file}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Target Job Description (Optional)
            </label>
            <textarea
              className="w-full rounded-2xl liquid-input p-4 text-sm"
              rows={4}
              placeholder="Paste the job description you are applying for to get tailored feedback..."
              value={jobDescription}
              onChange={(e) => setCvAnalyzer({ jobDescription: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={(!cvText && !file) || loading}
            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold liquid-button disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze CV
              </>
            )}
          </button>
        </div>

        <div className="liquid-panel p-8 rounded-[2rem] min-h-[400px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Analysis Result</h2>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <GlowingTimer isRunning={loading} label="Analyzing CV..." />
              </div>
            ) : generatingImproved ? (
              <div className="h-full flex items-center justify-center">
                <GlowingTimer isRunning={generatingImproved} label="Generating Improved Version..." />
              </div>
            ) : result ? (
              <AnalysisResult 
                data={result} 
                onGenerateImproved={handleGenerateImproved}
                isGeneratingImproved={generatingImproved}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                Your CV analysis will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
