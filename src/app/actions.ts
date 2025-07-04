'use server';

export type DetectDuplicateNamesOutput = Array<{
  name: string;
  count: number;
}>;

function normalizeName(name: string): string {
  // Normalização simples: remove espaços em branco e converte para minúsculas.
  return name.trim().toLowerCase();
}

export async function analyzeFileForDuplicates(fileContent: string): Promise<{ data: DetectDuplicateNamesOutput | null; error: string | null }> {
  if (!fileContent) {
    return { data: null, error: 'File content is empty.' };
  }

  try {
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
    const counts: Map<string, { count: number; original: string }> = new Map();

    for (const line of lines) {
      const normalized = normalizeName(line);
      if (normalized) {
        if (counts.has(normalized)) {
          counts.get(normalized)!.count++;
        } else {
          counts.set(normalized, { count: 1, original: line.trim() });
        }
      }
    }

    const results: DetectDuplicateNamesOutput = Array.from(counts.entries())
      .filter(([_, value]) => value.count > 1) // Apenas duplicatas
      .map(([_, value]) => ({
      name: value.original,
      count: value.count,
    }));

    return { data: results, error: null };
  } catch (error) {
    console.error('Error analyzing file for duplicates:', error);
    return { data: null, error: 'An unexpected error occurred while analyzing the file.' };
  }
}
