import { useState, useRef, useEffect } from 'react';
import { generateContent } from '../services/ai';
import { Loader2, Copy, CheckCircle2, Sparkles, Upload, X, FileText, Download, Check, AlertCircle, ChevronDown, Globe, Search } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { Modal } from '../components/Modal';
import { parseFile } from '../utils/fileParser';
import { motion, AnimatePresence } from 'motion/react';
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
  improvedText: string;
}

const PREDEFINED_SOP_TEMPLATES = [
  {
    id: 'design1',
    name: 'Design 1 (Academic/Hospitality)',
    analysis: {
      layout: 'Clean Academic',
      styles: { font: 'Serif', colors: ['#000000', '#ffffff'], spacing: 'comfortable' },
      sections: ['Header', 'Title', 'Introduction', 'Body Paragraphs', 'Conclusion'],
      dna: 'A classic academic layout inspired by top-tier university applications. Features a minimalist header with name and contact info in a elegant serif font (like Times New Roman or Georgia). Centered bold title "Statement of Purpose". Body text is fully justified with 1.5 line spacing and standard 1-inch margins. No logos or promotional links. Focus on clean typography and readability, conveying a serious academic tone.'
    }
  },
  {
    id: 'design2',
    name: 'Design 2 (Formal Visa)',
    analysis: {
      layout: 'Formal Visa Application',
      styles: { font: 'Sans-serif', colors: ['#000000', '#ffffff'], spacing: 'tight' },
      sections: ['To Address', 'Salutation', 'Academic Background', 'Family Background', 'Why this Country', 'Future Plans'],
      dna: 'A highly structured formal layout optimized for Visa Officers. Includes a professional "To" address block at the top left. Uses bold, underlined subheadings for distinct sections like "Academic Background", "Financial Capacity", and "Ties to Home Country". Professional salutation and a formal sign-off. Uses a clean sans-serif font for high legibility. Strictly excludes any logos or promotional content to maintain official document standards.'
    }
  },
  {
    id: 'design3',
    name: 'Design 3 (Modern Professional)',
    analysis: {
      layout: 'Modern Professional',
      styles: { font: 'Sans-serif', colors: ['#1e293b', '#ffffff', '#f8fafc'], spacing: 'relaxed' },
      sections: ['Modern Header', 'Main Content', 'Sidebar Info'],
      dna: 'A modern, sophisticated layout for professional master\'s programs. Features a clean, full-width header with a subtle light-gray background accent. Left-aligned bold title with a decorative horizontal line. Clear, generous spacing between paragraphs. Uses modern sans-serif typography (like Inter or Helvetica). Sections are clearly defined by bold headers. Professional and sleek, removing all clutter and promotional watermarks.'
    }
  }
];

const COUNTRIES = [
  'Canada', 'USA', 'Australia', 'UK', 'Germany', 'France', 'Japan', 'South Korea', 'Singapore', 'New Zealand', 
  'Ireland', 'Sweden', 'Netherlands', 'Italy', 'Spain', 'Switzerland', 'Norway', 'Finland', 'Custom'
];

export function SOPWriter() {
  const { sopWriter, setSopWriter } = useWork();
  const {
    background, goals, program, whyThisProgram, researchInterests,
    extracurriculars, relevantCourses, selectedCountry, customCountry,
    category, subCategory, customSubCategory, wordCountType,
    customWordCount, designAnalysis, result
  } = sopWriter;

  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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
      
      const systemInstruction = `You are an expert UI/UX Designer and Document Engineer. Analyze the provided SOP document to extract its "Visual DNA".
      CRITICAL: Ignore and exclude any company logos, website promotional links, or marketing messages found in the document. Focus ONLY on the structural layout and typography of the main SOP content.
      
      Return a JSON object with:
      - layout: description of structure (header, title, paragraph style).
      - styles: { font: "Serif/Sans", colors: ["hex codes"], spacing: "tight/loose" }
      - sections: list of identified sections.
      - dna: a detailed technical description of the design for cloning.
      
      Return ONLY the JSON object.`;
      
      const prompt = parsed.text 
        ? `Analyze this SOP for its structure and design intent: ${parsed.text}`
        : { parts: [{ inlineData: parsed.inlineData! }, { text: "Analyze this SOP image for its layout, typography, and visual DNA. Ignore logos and promotional links." }] };
      
      const response = await generateContent(prompt as any, systemInstruction);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        setSopWriter({ designAnalysis: analysis });
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        throw new Error("Failed to extract design DNA.");
      }
    } catch (error: any) {
      console.error(error);
      setUploadError(error.message || "Failed to analyze design.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerate = async () => {
    if (!background || !goals || !program || !designAnalysis) return;
    setLoading(true);
    try {
      const wordCountInstruction = wordCountType === 'smart' 
        ? 'Determine the optimal length for a standard university SOP (typically 800-1000 words).' 
        : `Ensure the SOP is approximately ${customWordCount} words long.`;

      const targetCountry = selectedCountry === 'Custom' ? customCountry : selectedCountry;

      const systemInstruction = `You are an expert Admissions Consultant and Document Engineer. Your goal is to "clone" the visual DNA provided and populate it with a professionally written SOP.
      
      CRITICAL:
      1. Use the provided Design DNA: ${designAnalysis.dna}
      2. REMOVE all logos, promotional links, or website watermarks from the final design.
      3. The content must be tailored for an application to ${targetCountry}.
      
      Output a JSON object with:
      - html: A complete, standalone HTML string using Tailwind CSS classes for styling. It must replicate the DNA layout.
      - improvedText: The full text of the SOP in plain text format.
      
      Return ONLY the JSON object.`;

      const prompt = `
Category: ${category}
Sub-Category: ${category === 'Student' ? subCategory : customSubCategory}
Target Program & University: ${program}
Target Country: ${targetCountry}
Academic/Professional Background: ${background}
Short/Long-term Goals: ${goals}
Why this specific program/university: ${whyThisProgram}
Research Interests: ${researchInterests}
Extracurricular Activities: ${extracurriculars}
Relevant Courses: ${relevantCourses}

Length Requirement: ${wordCountInstruction}
`;
      
      const response = await generateContent(prompt, systemInstruction);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setSopWriter({ result: data });
      } else {
        throw new Error("Failed to generate SOP data.");
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
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = 'sop-design.png';
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
        const element = previewRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        
        pdf.save('sop-design.pdf');
      } catch (err) {
        console.error('PDF download failed', err);
      }
    }
  };

  const downloadWord = async () => {
    if (!result) return;
    try {
      // Split text into paragraphs for better Word formatting
      const paragraphs = result.improvedText.split('\n').filter(p => p.trim() !== '');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "STATEMENT OF PURPOSE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            ...paragraphs.map(text => new Paragraph({
              children: [
                new TextRun({
                  text: text.trim(),
                  size: 24, // 12pt
                  font: designAnalysis?.styles.font === 'Serif' ? 'Times New Roman' : 'Arial',
                }),
              ],
              spacing: { line: 360, before: 200, after: 200 },
              alignment: AlignmentType.JUSTIFIED,
            })),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "sop-design.docx");
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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 tracking-tight">SOP Writer</h1>
          <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">Clone any SOP design DNA and draft your compelling story.</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          {PREDEFINED_SOP_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSopWriter({ designAnalysis: template.analysis })}
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
            Upload Design DNA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-panel p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Details</h2>
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
                          setSopWriter({ 
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
                          onClick={() => setSopWriter({ subCategory: sub })}
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
                      onChange={(e) => setSopWriter({ customSubCategory: e.target.value })}
                    />
                  )}
                </div>

                <div className="md:col-span-2 space-y-3 relative">
                  <label className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                    <Globe className="w-4 h-4 mr-2 text-indigo-500" />
                    Target Country
                  </label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="w-full flex items-center justify-between rounded-xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all text-left"
                      >
                        <span className="truncate">{selectedCountry}</span>
                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isCountryDropdownOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isCountryDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsCountryDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
                            >
                              <div className="p-2 border-b border-gray-100 dark:border-white/10 mb-2">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    placeholder="Search country..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 ring-indigo-500/20 outline-none"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                      setSopWriter({ selectedCountry: country });
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearch('');
                                    }}
                                    className={cn(
                                      "w-full text-left px-4 py-3 text-sm rounded-xl transition-colors flex items-center justify-between group",
                                      selectedCountry === country 
                                        ? "bg-indigo-500 text-white" 
                                        : "hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300"
                                    )}
                                  >
                                    {country}
                                    {selectedCountry === country && <Check className="w-4 h-4" />}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {selectedCountry === 'Custom' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1"
                      >
                        <input
                          type="text"
                          className="w-full rounded-xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 outline-none"
                          placeholder="Enter specific country..."
                          value={customCountry}
                          onChange={(e) => setSopWriter({ customCountry: e.target.value })}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Target Program & University</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={2}
                    placeholder="e.g., MS in Computer Science at Stanford University..."
                    value={program}
                    onChange={(e) => setSopWriter({ program: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Academic & Professional Background</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={4}
                    placeholder="Your degree, major projects, work experience, research..."
                    value={background}
                    onChange={(e) => setSopWriter({ background: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Short & Long-term Goals</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={3}
                    placeholder="What do you want to achieve?"
                    value={goals}
                    onChange={(e) => setSopWriter({ goals: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Why this specific program?</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={3}
                    placeholder="Specific professors, labs, courses..."
                    value={whyThisProgram}
                    onChange={(e) => setSopWriter({ whyThisProgram: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Research Interests (Optional)</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={2}
                    placeholder="What specific areas do you want to research?"
                    value={researchInterests}
                    onChange={(e) => setSopWriter({ researchInterests: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Extracurricular Activities (Optional)</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={2}
                    placeholder="Volunteering, leadership, sports..."
                    value={extracurriculars}
                    onChange={(e) => setSopWriter({ extracurriculars: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Relevant Courses (Optional)</label>
                  <textarea
                    className="w-full rounded-2xl liquid-input p-4 text-sm focus:ring-2 ring-indigo-500/20 transition-all"
                    rows={2}
                    placeholder="List key courses that prepared you..."
                    value={relevantCourses}
                    onChange={(e) => setSopWriter({ relevantCourses: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="block text-sm font-bold text-gray-900 dark:text-white">Word Selection</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSopWriter({ wordCountType: 'smart' })}
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
                    onClick={() => setSopWriter({ wordCountType: 'custom' })}
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
                      placeholder="Target word count (e.g., 1000)"
                      value={customWordCount}
                      onChange={(e) => setSopWriter({ customWordCount: e.target.value })}
                    />
                    <span className="text-xs text-gray-500 font-medium">words</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!background || !goals || !program || !designAnalysis || loading}
              className="w-full flex justify-center items-center py-5 px-4 rounded-2xl text-sm font-bold liquid-button disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-2xl shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Cloning DNA & Drafting SOP...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Cloned SOP
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Generated SOP
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
                    Upload an SOP design template or select a predefined design to start.
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
              onClick={handleCopy}
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
                Export SOP
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
        title="Upload SOP Design DNA"
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
                  <h4 className="text-lg font-bold text-white">Scanning SOP DNA...</h4>
                  <p className="text-sm text-gray-400">Extracting layout and typography. Logos will be excluded.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">Drop your SOP template here</p>
                  <p className="text-sm text-gray-400">PDF, DOCX, PNG, or JPG supported</p>
                </div>
              </>
            )}
          </div>

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
