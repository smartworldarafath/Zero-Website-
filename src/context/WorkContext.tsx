import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmailWriterState {
  topic: string;
  tone: string;
  length: string;
  callToAction: string;
  additionalContext: string;
  wordCountType: 'smart' | 'custom';
  customWordCount: string;
  result: string;
}

interface EmailReplierState {
  originalEmail: string;
  replyTone: string;
  keyPoints: string;
  callToAction: string;
  additionalContext: string;
  wordCountType: 'smart' | 'custom';
  customWordCount: string;
  result: string;
}

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

interface SopWriterState {
  background: string;
  goals: string;
  program: string;
  whyThisProgram: string;
  researchInterests: string;
  extracurriculars: string;
  relevantCourses: string;
  selectedCountry: string;
  customCountry: string;
  category: 'Student' | 'Business' | 'Job' | 'Custom';
  subCategory: string;
  customSubCategory: string;
  wordCountType: 'smart' | 'custom';
  customWordCount: string;
  designAnalysis: DesignAnalysis | null;
  result: GenerationResult | null;
}

interface SopAnalyzerState {
  sopText: string;
  programDetails: string;
  result: any | null;
}

interface CvBuilderState {
  personalInfo: string;
  experience: string;
  education: string;
  skills: string;
  certifications: string;
  projects: string;
  awards: string;
  category: 'Student' | 'Business' | 'Job' | 'Custom';
  subCategory: string;
  customSubCategory: string;
  designAnalysis: DesignAnalysis | null;
  result: any | null;
}

interface CvAnalyzerState {
  cvText: string;
  jobDescription: string;
  result: any | null;
}

interface WorkContextType {
  emailWriter: EmailWriterState;
  setEmailWriter: (state: Partial<EmailWriterState>) => void;
  emailReplier: EmailReplierState;
  setEmailReplier: (state: Partial<EmailReplierState>) => void;
  sopWriter: SopWriterState;
  setSopWriter: (state: Partial<SopWriterState>) => void;
  sopAnalyzer: SopAnalyzerState;
  setSopAnalyzer: (state: Partial<SopAnalyzerState>) => void;
  cvBuilder: CvBuilderState;
  setCvBuilder: (state: Partial<CvBuilderState>) => void;
  cvAnalyzer: CvAnalyzerState;
  setCvAnalyzer: (state: Partial<CvAnalyzerState>) => void;
}

const initialEmailWriter: EmailWriterState = {
  topic: '',
  tone: 'Professional',
  length: 'Medium',
  callToAction: '',
  additionalContext: '',
  wordCountType: 'smart',
  customWordCount: '150',
  result: '',
};

const initialEmailReplier: EmailReplierState = {
  originalEmail: '',
  replyTone: 'Professional',
  keyPoints: '',
  callToAction: '',
  additionalContext: '',
  wordCountType: 'smart',
  customWordCount: '150',
  result: '',
};

const initialSopWriter: SopWriterState = {
  background: '',
  goals: '',
  program: '',
  whyThisProgram: '',
  researchInterests: '',
  extracurriculars: '',
  relevantCourses: '',
  selectedCountry: 'Canada',
  customCountry: '',
  category: 'Student',
  subCategory: 'Bachelor',
  customSubCategory: '',
  wordCountType: 'smart',
  customWordCount: '800',
  designAnalysis: null,
  result: null,
};

const initialSopAnalyzer: SopAnalyzerState = {
  sopText: '',
  programDetails: '',
  result: null,
};

const initialCvBuilder: CvBuilderState = {
  personalInfo: '',
  experience: '',
  education: '',
  skills: '',
  certifications: '',
  projects: '',
  awards: '',
  category: 'Student',
  subCategory: 'Bachelor',
  customSubCategory: '',
  designAnalysis: null,
  result: null,
};

const initialCvAnalyzer: CvAnalyzerState = {
  cvText: '',
  jobDescription: '',
  result: null,
};

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export function WorkProvider({ children }: { children: ReactNode }) {
  const [emailWriter, _setEmailWriter] = useState<EmailWriterState>(() => {
    const saved = localStorage.getItem('emailWriter');
    return saved ? JSON.parse(saved) : initialEmailWriter;
  });
  const [emailReplier, _setEmailReplier] = useState<EmailReplierState>(() => {
    const saved = localStorage.getItem('emailReplier');
    return saved ? JSON.parse(saved) : initialEmailReplier;
  });
  const [sopWriter, _setSopWriter] = useState<SopWriterState>(() => {
    const saved = localStorage.getItem('sopWriter');
    return saved ? JSON.parse(saved) : initialSopWriter;
  });
  const [sopAnalyzer, _setSopAnalyzer] = useState<SopAnalyzerState>(() => {
    const saved = localStorage.getItem('sopAnalyzer');
    return saved ? JSON.parse(saved) : initialSopAnalyzer;
  });
  const [cvBuilder, _setCvBuilder] = useState<CvBuilderState>(() => {
    const saved = localStorage.getItem('cvBuilder');
    return saved ? JSON.parse(saved) : initialCvBuilder;
  });
  const [cvAnalyzer, _setCvAnalyzer] = useState<CvAnalyzerState>(() => {
    const saved = localStorage.getItem('cvAnalyzer');
    return saved ? JSON.parse(saved) : initialCvAnalyzer;
  });

  React.useEffect(() => {
    localStorage.setItem('emailWriter', JSON.stringify(emailWriter));
  }, [emailWriter]);

  React.useEffect(() => {
    localStorage.setItem('emailReplier', JSON.stringify(emailReplier));
  }, [emailReplier]);

  React.useEffect(() => {
    localStorage.setItem('sopWriter', JSON.stringify(sopWriter));
  }, [sopWriter]);

  React.useEffect(() => {
    localStorage.setItem('sopAnalyzer', JSON.stringify(sopAnalyzer));
  }, [sopAnalyzer]);

  React.useEffect(() => {
    localStorage.setItem('cvBuilder', JSON.stringify(cvBuilder));
  }, [cvBuilder]);

  React.useEffect(() => {
    localStorage.setItem('cvAnalyzer', JSON.stringify(cvAnalyzer));
  }, [cvAnalyzer]);

  const setEmailWriter = (state: Partial<EmailWriterState>) => _setEmailWriter(prev => ({ ...prev, ...state }));
  const setEmailReplier = (state: Partial<EmailReplierState>) => _setEmailReplier(prev => ({ ...prev, ...state }));
  const setSopWriter = (state: Partial<SopWriterState>) => _setSopWriter(prev => ({ ...prev, ...state }));
  const setSopAnalyzer = (state: Partial<SopAnalyzerState>) => _setSopAnalyzer(prev => ({ ...prev, ...state }));
  const setCvBuilder = (state: Partial<CvBuilderState>) => _setCvBuilder(prev => ({ ...prev, ...state }));
  const setCvAnalyzer = (state: Partial<CvAnalyzerState>) => _setCvAnalyzer(prev => ({ ...prev, ...state }));

  return (
    <WorkContext.Provider value={{
      emailWriter, setEmailWriter,
      emailReplier, setEmailReplier,
      sopWriter, setSopWriter,
      sopAnalyzer, setSopAnalyzer,
      cvBuilder, setCvBuilder,
      cvAnalyzer, setCvAnalyzer
    }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork() {
  const context = useContext(WorkContext);
  if (context === undefined) {
    throw new Error('useWork must be used within a WorkProvider');
  }
  return context;
}
