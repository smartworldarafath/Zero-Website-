import { GoogleGenAI } from '@google/genai';

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const apiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_api_key')) || 
                   (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                   (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || '';

    if (!apiKey) {
      throw new Error('Gemini API Key is missing');
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      },
    });
    return response.text || '';
  } catch (error: any) {
    console.error('Error generating content with Gemini Google Search grounding:', error);
    throw new Error(error.message || 'Failed to generate content');
  }
}

export async function analyzeDocumentWithAI(
  prompt: string,
  fileParts: any[],
  systemInstruction: string,
  responseSchema?: any
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const contents = {
      parts: [
        ...fileParts,
        { text: prompt }
      ]
    };

    const config: any = {
      systemInstruction,
      temperature: 0.2,
    };

    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents,
      config,
    });

    return response.text || '';
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    throw new Error(error.message || 'Failed to analyze document');
  }
}
