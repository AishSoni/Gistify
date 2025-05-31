'use server';

/**
 * @fileOverview Summarizes a GitHub repository by analyzing its documentation and code.
 *
 * - summarizeRepository - A function that summarizes a GitHub repository.
 * - SummarizeRepositoryInput - The input type for the summarizeRepository function.
 * - SummarizeRepositoryOutput - The return type for the summarizeRepository function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRepositoryInputSchema = z.object({
  githubUrl: z
    .string()
    .describe('The URL of the GitHub repository to summarize.'),
});
export type SummarizeRepositoryInput = z.infer<typeof SummarizeRepositoryInputSchema>;

const SummarizeRepositoryOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the repository.'),
});
export type SummarizeRepositoryOutput = z.infer<typeof SummarizeRepositoryOutputSchema>;

export async function summarizeRepository(input: SummarizeRepositoryInput): Promise<SummarizeRepositoryOutput> {
  return summarizeRepositoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRepositoryPrompt',
  input: {schema: SummarizeRepositoryInputSchema},
  output: {schema: SummarizeRepositoryOutputSchema},
  prompt: `You are an AI expert in summarizing GitHub repositories.  You will be given the URL of a GitHub repository, and you will summarize the repository by analyzing its documentation and code.

  GitHub Repository URL: {{{githubUrl}}}
  \n  Please provide a high-level summary of the repository. Focus on the project's purpose and structure.
  `,
});

const summarizeRepositoryFlow = ai.defineFlow(
  {
    name: 'summarizeRepositoryFlow',
    inputSchema: SummarizeRepositoryInputSchema,
    outputSchema: SummarizeRepositoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
