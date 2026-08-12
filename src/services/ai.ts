import { GoogleGenAI, Type } from '@google/genai';

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    // Instantiate inside the function to ensure it picks up the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || '';
  } catch (error: any) {
    console.error('Error generating content:', error);
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
