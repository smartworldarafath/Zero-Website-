import mammoth from 'mammoth';

export async function parseFile(file: File): Promise<{ text?: string, inlineData?: { data: string, mimeType: string } }> {
  const mimeType = file.type;

  // Images and PDFs can be sent directly to Gemini via inlineData
  if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: mimeType
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Word documents
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value };
  }

  // Fallback to plain text
  const text = await file.text();
  return { text };
}
