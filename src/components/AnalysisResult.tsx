import React, { useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Copy, Download, CheckCircle2, FileText, FileImage, FileDown, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { toPng, toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface Mistake {
  mistake: string;
  correction: string;
  context: string;
}

export interface AnalysisData {
  aiPercentage: number;
  humanPercentage: number;
  perfectnessScore: number;
  mistakes: Mistake[];
  feedback: string;
  improvedVersion?: string;
  wordCount?: number;
}

interface AnalysisResultProps {
  data: AnalysisData;
  onGenerateImproved?: () => void;
  isGeneratingImproved?: boolean;
}

export function AnalysisResult({ data, onGenerateImproved, isGeneratingImproved }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const chartData = [
    { name: 'AI Written', value: data.aiPercentage, color: '#8b5cf6' }, // purple-500
    { name: 'Human Written', value: data.humanPercentage, color: '#10b981' }, // emerald-500
  ];

  const handleCopy = () => {
    const textToCopy = data.improvedVersion || data.feedback;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'analysis-result.png';
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('analysis-result.pdf');
    } catch (err) {
      console.error('Failed to download PDF', err);
    }
  };

  const handleDownloadWord = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Document Analysis Report", bold: true, size: 32 }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: `Perfectness Score: ${data.perfectnessScore}%`, bold: true })]
              }),
              new Paragraph({
                children: [new TextRun({ text: `AI Written: ${data.aiPercentage}% | Human Written: ${data.humanPercentage}%` })]
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "Feedback:", bold: true })]
              }),
              new Paragraph({
                children: [new TextRun({ text: data.feedback })]
              }),
              new Paragraph({ text: "" }),
              ...(data.mistakes.length > 0 ? [
                new Paragraph({
                  children: [new TextRun({ text: "Mistakes Found:", bold: true })]
                }),
                ...data.mistakes.flatMap(m => [
                  new Paragraph({
                    children: [new TextRun({ text: `Context: ${m.context}` })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `Mistake: ${m.mistake}`, color: "FF0000" })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `Correction: ${m.correction}`, color: "008000" })]
                  }),
                  new Paragraph({ text: "" }),
                ])
              ] : []),
              ...(data.improvedVersion ? [
                new Paragraph({
                  children: [new TextRun({ text: "Improved Version:", bold: true })]
                }),
                new Paragraph({
                  children: [new TextRun({ text: data.improvedVersion })]
                })
              ] : [])
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "analysis-result.docx");
    } catch (err) {
      console.error('Failed to download Word doc', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={handleCopy}
          className="liquid-glass px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
          Copy Text
        </button>
        <button
          onClick={handleDownloadImage}
          className="liquid-glass px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Image
        </button>
        <button
          onClick={handleDownloadPDF}
          className="liquid-glass px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </button>
        <button
          onClick={handleDownloadWord}
          className="liquid-glass px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Word
        </button>
      </div>

      <div ref={resultRef} className="space-y-8 bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perfectness Score */}
          <div className="liquid-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Quality Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-800" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" 
                  className="text-indigo-500"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - data.perfectnessScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{data.perfectnessScore}%</span>
              </div>
            </div>
          </div>

          {/* AI vs Human Chart */}
          <div className="liquid-panel p-6 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Content Origin</h3>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Word Count */}
          <div className="liquid-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Word Count</h3>
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl font-black text-emerald-500">{data.wordCount || 0}</span>
            </div>
            <span className="text-xs text-gray-500 mt-2">Total Words Analyzed</span>
          </div>
        </div>

        {/* Feedback */}
        <div className="liquid-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Feedback</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown>{data.feedback}</Markdown>
          </div>
        </div>

        {/* Mistakes */}
        {data.mistakes && data.mistakes.length > 0 && (
          <div className="liquid-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mistakes & Corrections</h3>
            <div className="space-y-4">
              {data.mistakes.map((mistake, index) => (
                <div key={index} className="bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 italic">"{mistake.context}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                      <span className="text-xs font-bold text-red-500 uppercase block mb-1">Mistake</span>
                      <p className="text-sm text-red-700 dark:text-red-400">{mistake.mistake}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                      <span className="text-xs font-bold text-emerald-500 uppercase block mb-1">Correction</span>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">{mistake.correction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improved Version */}
        {data.improvedVersion && (
          <div className="liquid-panel p-6 rounded-2xl border-2 border-indigo-500/30">
            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Improved Version
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <Markdown>{data.improvedVersion}</Markdown>
            </div>
          </div>
        )}
      </div>

      {/* Generate Improved Button */}
      {!data.improvedVersion && onGenerateImproved && (
        <button
          onClick={onGenerateImproved}
          disabled={isGeneratingImproved}
          className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingImproved ? 'Generating...' : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Improved Version
            </>
          )}
        </button>
      )}
    </div>
  );
}
