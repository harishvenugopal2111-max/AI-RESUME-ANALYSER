import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  
  const pdf = await pdfjsLib.getDocument(typedArray).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + ' ';
  }

  return fullText;
}

export function calculateMatchScore(jobDescription: string, resumeText: string): number {
  const normalizeText = (text: string) => 
    text.toLowerCase().replace(/[^\w\s]/g, '');

  const normalizedJob = normalizeText(jobDescription);
  const normalizedResume = normalizeText(resumeText);

  // Extract meaningful words (filter out common stop words)
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
    'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there'
  ]);

  const extractWords = (text: string) => {
    const words = text.match(/\b\w{2,}\b/g) || [];
    return new Set(words.filter(word => !stopWords.has(word) && word.length > 2));
  };

  const jobWords = extractWords(normalizedJob);
  const resumeWords = extractWords(normalizedResume);

  let matchCount = 0;
  jobWords.forEach(word => {
    if (resumeWords.has(word)) {
      matchCount++;
    }
  });

  if (jobWords.size === 0) return 0;
  
  return (matchCount / jobWords.size) * 100;
}
