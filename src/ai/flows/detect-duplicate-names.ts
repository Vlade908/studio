'use server';

/**
 * @fileOverview AI-powered duplicate name detection flow.
 *
 * - detectDuplicateNames - A function that detects and counts duplicate names in a text file.
 * - DetectDuplicateNamesInput - The input type for the detectDuplicateNames function.
 * - DetectDuplicateNamesOutput - The return type for the detectDuplicateNames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDuplicateNamesInputSchema = z.object({
  fileContent: z
    .string()
    .describe('The content of the file to scan for duplicate names.'),
});
export type DetectDuplicateNamesInput = z.infer<typeof DetectDuplicateNamesInputSchema>;

const DetectDuplicateNamesOutputSchema = z.array(z.object({
  name: z.string().describe('The normalized name.'),
  count: z.number().describe('The number of occurrences of the name.'),
}));
export type DetectDuplicateNamesOutput = z.infer<typeof DetectDuplicateNamesOutputSchema>;

export async function detectDuplicateNames(input: DetectDuplicateNamesInput): Promise<DetectDuplicateNamesOutput> {
  return detectDuplicateNamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDuplicateNamesPrompt',
  input: {schema: DetectDuplicateNamesInputSchema},
  output: {schema: DetectDuplicateNamesOutputSchema},
  prompt: `You are an expert in identifying and counting duplicate names in a text file, even with slight variations.

  Analyze the following file content and provide a list of duplicate names and their normalized count.

  File Content:
  {{fileContent}}

  Output the results as a JSON array where each object has a 'name' (the normalized name) and a 'count' (the number of occurrences).
  Consider names like 'John Smith' and 'Jon Smith' as potential duplicates and normalize them appropriately.
  If no duplicates are found, return an empty array.
  Make sure the output is a valid JSON. Do not return any explanations, only the JSON array.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const detectDuplicateNamesFlow = ai.defineFlow(
  {
    name: 'detectDuplicateNamesFlow',
    inputSchema: DetectDuplicateNamesInputSchema,
    outputSchema: DetectDuplicateNamesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
