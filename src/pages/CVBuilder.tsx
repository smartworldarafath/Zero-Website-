import { useState, useRef, useEffect } from 'react';
import { generateContent } from '../services/ai';
import { Loader2, Copy, CheckCircle2, Sparkles, Upload, X, FileText, PieChart as PieIcon, Download, Check, AlertCircle, ChevronDown } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { Modal } from '../components/Modal';
import { parseFile } from '../utils/fileParser';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useWork } from '../context/WorkContext';

interface DesignAnalysis {
  layout: string;
  styles: {
    font: string;
    colors: string[];
    spacing: string;
  };
  sections: string[];
  dna: string;
}

interface GenerationResult {
  html: string;
  stats: {
    humanScore: number;
    aiScore: number;
    perfectness: number;
  };
  improvedText: string;
}

const PREDEFINED_TEMPLATES = [
  {
    id: 'sebastian',
    name: '1st PDF Design (Sebastian)',
    analysis: {
      layout: '1-column professional',
      styles: { font: 'Sans-serif', colors: ['#000000', '#ffffff'], spacing: 'comfortable' },
      sections: ['About Me', 'Education', 'Work Experience', 'Skills'],
      dna: 'A minimalist 1-column layout. Centered header with name in large bold caps, followed by professional title. Contact details (phone, email, location) in a single line with icons. Sections are separated by full-width horizontal lines. Section headers are bold, uppercase, and left-aligned. Work experience and education use a clean layout with dates on the right or below the title. Skills are presented in a 3-column grid of bullet points.'
    }
  },
  {
    id: 'lorna',
    name: '2nd PDF Design (Lorna)',
    analysis: {
      layout: '2-column split (Sidebar right)',
      styles: { font: 'Sans-serif', colors: ['#000000', '#ffffff', '#f5f5f5'], spacing: 'compact' },
      sections: ['Profile', 'Work Experience', 'Education', 'Skills', 'Languages'],
      dna: 'A modern 2-column split layout. The left column (70% width) contains the Name/Title header, Profile summary, and Work Experience. The right column (30% width, light gray background) contains Contact info, Education, Skills, and Languages. Section headers are bold, uppercase, and have extra letter spacing. Work experience uses a timeline-like vertical line on the left. Skills and Languages are simple lists.'
    }
  }
];

export function CVBuilder() {
  const { cvBuilder, setCvBuilder } = useWork();
  const {
    personalInfo,
    experience,
    education,
    skills,
    certifications,
    projects,
    awards,
    category,
    subCategory,
    customSubCategory,
    designAnalysis,
    result
  } = cvBuilder;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [canvaLink, setCanvaLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'png'>('pdf');
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    setUploadError('');
    
    try {
      const parsed = await parseFile(file);
      
      const systemInstruction = `You are an expert UI/UX Designer and Document Engineer. Analyze the provided document (text or image) to extract its "Visual DNA".
      Return a JSON object with:
      - layout: description of grid (1-col, 2-col), header placement, etc.
      - styles: { font: "Serif/Sans", colors: ["hex codes"], spacing: "tight/loose" }
      - sections: list of identified sections (e.g., "Experience", "Skills")
      - dna: a detailed technical description of the design for cloning.
      
      Be precise about the visual hierarchy. Return ONLY the JSON object.`;
      
      const prompt = parsed.text 
        ? `Analyze this document text for its structure and design intent: ${parsed.text}`
        : { parts: [{ inlineData: parsed.inlineData! }, { text: "Analyze this image for its layout, typography, and visual DNA." }] };
      
      const response = await generateContent(prompt as any, systemInstruction);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        setCvBuilder({ designAnalysis: analysis });
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        throw new Error("Failed to extract design DNA. Please try another file.");
      }
    } catch (error: any) {
      console.error(error);
      setUploadError(error.message || "Failed to analyze design.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerate = async () => {
    if (!personalInfo || !experience || !designAnalysis) return;
    setLoading(true);
    try {
      const systemInstruction = `You are an expert UI/UX Designer and Resume Engineer. Your goal is to "clone" the visual DNA provided and populate it with new user data.
      
      Design DNA to Clone: ${designAnalysis.dna}
      
      Output a JSON object with:
      - html: A complete, standalone HTML string using Tailwind CSS classes for styling. It must perfectly replicate the layout and style of the DNA.
      - stats: { humanScore: (0-100 probability of human-written feel), aiScore: (0-100 probability of AI feel), perfectness: (0-100 ATS compatibility score) }
      - improvedText: A professionally polished version of the user's content.
      
      Ensure the HTML is responsive and uses the exact color palette: ${designAnalysis.styles.colors.join(', ')}.
      The HTML should be a single <div> that acts as the container. Return ONLY the JSON object.`;

      const prompt = `
      User Data:
      Category: ${category}
      Sub-Category: ${category === 'Student' ? subCategory : customSubCategory}
      Personal Info: ${personalInfo}
      Experience: ${experience}
      Education: ${education}
      Skills: ${skills}
      Certifications: ${certifications}
      Projects: ${projects}
      Awards: ${awards}
      `;
      
      const response = await generateContent(prompt, systemInstruction);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setCvBuilder({ result: data });
      } else {
        throw new Error("Failed to generate CV data.");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await toPng(previewRef.current, { 
          quality: 1, 
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });
        const link = document.createElement('a');
        link.download = 'cv-design.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Image download failed', err);
      }
    }
  };

  const downloadPDF = async () => {
    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('cv-design.pdf');
      } catch (err) {
        console.error('PDF download failed', err);
      }
    }
  };

  const downloadWord = async () => {
    if (!result) return;
    
    try {
      // Simple Word generation based on the improved text
      // For a perfect clone, we'd need a more complex HTML-to-Word converter,
      // but docx library allows building structured documents.
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "CURRICULUM VITAE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.improvedText,
                  size: 24,
                }),
              ],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "cv-design.docx");
    } catch (err) {
      console.error('Word download failed', err);
    }
  };

  const handleDownload = () => {
    switch (selectedFormat) {
      case 'pdf': downloadPDF(); break;
      case 'docx': downloadWord(); break;
      case 'png': downloadImage(); break;
    }
  };

  const pieData = result ? [
    { name: 'Human', value: result.stats.humanScore, color: '#10b981' },
    { name: 'AI', value: result.stats.aiScore, color: '#6366f1' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 tracking-tight">CV Builder</h1>
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">Clone any design DNA and populate it with your professional story.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {PREDEFINED_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setCvBuilder({ designAnalysis: template.analysis })}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                  designAnalysis?.dna === template.analysis.dna
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                )}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                {template.name}
              </button>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 group"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
              Upload Your Design
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Progressive Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-panel p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Professional Data</h2>
              {designAnalysis && (
                <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Check className="w-3 h-3 mr-1" />
                  Design DNA Loaded
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Student', 'Business', 'Job', 'Custom'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCvBuilder({
                            category: cat as any,
                            subCategory: cat === 'Student' ? 'Bachelor' : 'Custom'
                          });
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                          category === cat 
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Sub-Category</label>
                  {category === 'Student' ? (
                    <div className="flex flex-wrap gap-2">
                      {['Bachelor', 'Masters', 'Diploma', 'PHD'].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setCvBuilder({ subCategory: sub })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                            subCategory === sub 
                              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                              : "bg-white/5 text-gray-500 hover:bg-white/10"
                          )}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full rounded-xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 outline-none"
                      placeholder="Enter your specific category..."
                      value={customSubCategory}
                      onChange={(e) => setCvBuilder({ customSubCategory: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className={cn(
                "space-y-3 transition-all duration-500",
                designAnalysis && !designAnalysis.sections.some(s => s.toLowerCase().includes('personal')) && "opacity-40 grayscale"
              )}>
                <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                  Personal Info & Summary
                  {designAnalysis?.sections.some(s => s.toLowerCase().includes('personal')) && (
                    <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-pulse" />
                  )}
                </label>
                <textarea
                  className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                  rows={3}
                  placeholder="Name, Contact, and a brief summary..."
                  value={personalInfo}
                  onChange={(e) => setCvBuilder({ personalInfo: e.target.value })}
                />
              </div>

              <div className={cn(
                "space-y-3 transition-all duration-500",
                designAnalysis && !designAnalysis.sections.some(s => s.toLowerCase().includes('experience')) && "opacity-40 grayscale"
              )}>
                <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                  Work Experience
                  {designAnalysis?.sections.some(s => s.toLowerCase().includes('experience')) && (
                    <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-pulse" />
                  )}
                </label>
                <textarea
                  className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                  rows={4}
                  placeholder="Job titles, companies, and achievements..."
                  value={experience}
                  onChange={(e) => setCvBuilder({ experience: e.target.value })}
                />
              </div>

              <div className={cn(
                "space-y-3 transition-all duration-500",
                designAnalysis && !designAnalysis.sections.some(s => s.toLowerCase().includes('education')) && "opacity-40 grayscale"
              )}>
                <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                  Education
                  {designAnalysis?.sections.some(s => s.toLowerCase().includes('education')) && (
                    <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-pulse" />
                  )}
                </label>
                <textarea
                  className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                  rows={2}
                  placeholder="Degrees, universities, dates..."
                  value={education}
                  onChange={(e) => setCvBuilder({ education: e.target.value })}
                />
              </div>

              <div className={cn(
                "space-y-3 transition-all duration-500",
                designAnalysis && !designAnalysis.sections.some(s => s.toLowerCase().includes('skill')) && "opacity-40 grayscale"
              )}>
                <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                  Skills
                  {designAnalysis?.sections.some(s => s.toLowerCase().includes('skill')) && (
                    <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-pulse" />
                  )}
                </label>
                <textarea
                  className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                  rows={2}
                  placeholder="Technical and soft skills..."
                  value={skills}
                  onChange={(e) => setCvBuilder({ skills: e.target.value })}
                />
              </div>

              <div className={cn(
                "space-y-3 transition-all duration-500",
                designAnalysis && !designAnalysis.sections.some(s => s.toLowerCase().includes('project')) && "opacity-40 grayscale"
              )}>
                <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                  Projects
                  {designAnalysis?.sections.some(s => s.toLowerCase().includes('project')) && (
                    <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-pulse" />
                  )}
                </label>
                <textarea
                  className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                  rows={2}
                  placeholder="Key projects and your role..."
                  value={projects}
                  onChange={(e) => setCvBuilder({ projects: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!personalInfo || !experience || !designAnalysis || loading}
              className="w-full flex justify-center items-center py-5 px-4 rounded-2xl text-sm font-bold liquid-button disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-2xl shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Cloning DNA & Injecting Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Cloned CV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Preview & Stats */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="liquid-panel p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATS Perfectness</span>
                    <span className="text-4xl font-black text-indigo-500">{result.stats.perfectness}%</span>
                  </div>
                  <div className="md:col-span-2 liquid-panel p-6 rounded-[2rem] flex items-center gap-8">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={30}
                            outerRadius={45}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI vs Human Check</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-xs text-gray-500 font-medium">Human: {result.stats.humanScore}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500" />
                          <span className="text-xs text-gray-500 font-medium">AI: {result.stats.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CV Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Generated CV
                    </h3>
                    <div className="flex items-center gap-3 bg-white/5 dark:bg-black/20 p-2 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 px-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <select 
                          value={selectedFormat}
                          onChange={(e) => setSelectedFormat(e.target.value as any)}
                          className="bg-transparent border-none text-xs font-bold text-gray-600 dark:text-gray-300 focus:ring-0 outline-none cursor-pointer appearance-none pr-6"
                        >
                          <option value="pdf" className="bg-white dark:bg-gray-900">PDF Document</option>
                          <option value="docx" className="bg-white dark:bg-gray-900">MS Word (.docx)</option>
                          <option value="png" className="bg-white dark:bg-gray-900">PNG Image</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-500 -ml-5 pointer-events-none" />
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <button
                        onClick={handleDownload}
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </button>
                    </div>
                  </div>
                  <div className="liquid-panel p-1 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl">
                    <div 
                      ref={previewRef}
                      className="w-full min-h-[800px] p-12 overflow-auto bg-white text-black"
                      dangerouslySetInnerHTML={{ __html: result.html }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="liquid-panel p-12 rounded-[2.5rem] h-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-white/10"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready for Generation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload a design template and fill in your details to see the magic happen.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 bg-white/10 dark:bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.improvedText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Improved Text
            </button>
            <div className="w-px h-6 bg-white/10" />
            
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center px-6 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CV
                <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", exportMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {exportMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-4 left-0 right-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => { downloadPDF(); setExportMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-500/10 transition-colors flex items-center gap-3"
                    >
                      <FileText className="w-4 h-4 text-red-500" />
                      PDF Document
                    </button>
                    <button
                      onClick={() => { downloadWord(); setExportMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-500/10 transition-colors flex items-center gap-3"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      MS Word (.docx)
                    </button>
                    <button
                      onClick={() => { downloadWord(); setExportMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-500/10 transition-colors flex items-center gap-3"
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      Google Docx
                    </button>
                    <button
                      onClick={() => { downloadImage(); setExportMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-500/10 transition-colors flex items-center gap-3"
                    >
                      <Download className="w-4 h-4 text-emerald-500" />
                      PNG Image
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isScanning && setIsModalOpen(false)}
        title="Upload Your Design DNA"
      >
        <div className="space-y-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative group cursor-pointer border-2 border-dashed border-white/20 rounded-[2rem] p-12 flex flex-col items-center justify-center space-y-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5",
              isScanning && "pointer-events-none border-indigo-500"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
            
            {isScanning ? (
              <div className="w-full space-y-8 py-8">
                <div className="relative w-full h-48 bg-white/5 rounded-2xl overflow-hidden">
                  <motion.div
                    animate={{ y: [0, 192, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-indigo-500/20 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-bold text-white">Scanning Visual DNA...</h4>
                  <p className="text-sm text-gray-400">Extracting layout, typography, and color palettes.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">Drop your template here</p>
                  <p className="text-sm text-gray-400">PDF, DOCX, PNG, or JPG supported</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Canva Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl liquid-input p-4 text-sm"
                  placeholder="Paste your Canva resume link..."
                  value={canvaLink}
                  onChange={(e) => setCanvaLink(e.target.value)}
                />
                <button className="px-6 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold text-white transition-all">
                  Load
                </button>
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {uploadError}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
