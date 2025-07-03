'use server';

import { detectDuplicateNames, type DetectDuplicateNamesOutput } from '@/ai/flows/detect-duplicate-names';

export async function analyzeFileForDuplicates(fileContent: string): Promise<{ data: DetectDuplicateNamesOutput | null; error: string | null }> {
  if (!fileContent) {
    return { data: null, error: 'File content is empty.' };
  }

  try {
    const results = await detectDuplicateNames({ fileContent });
    return { data: results, error: null };
  } catch (error) {
    console.error('Error detecting duplicate names:', error);
    return { data: null, error: 'Failed to analyze file. The AI service may be temporarily unavailable.' };
  }
}
