'use server';
/**
 * @fileOverview An AI agent that allows users to ask questions about specific files or sections of code.
 *
 * - inquireAboutCode - A function that handles the process of answering questions about the codebase.
 * - InquireAboutCodeInput - The input type for the inquireAboutCode function.
 * - InquireAboutCodeOutput - The return type for the inquireAboutCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InquireAboutCodeInputSchema = z.object({
  codebaseDescription: z
    .string()
    .describe('A description of the entire codebase.'),
  fileContent: z.string().describe('The content of the specific file.'),
  question: z.string().describe('The question about the code.'),
});
export type InquireAboutCodeInput = z.infer<typeof InquireAboutCodeInputSchema>;

const InquireAboutCodeOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the code.'),
});
export type InquireAboutCodeOutput = z.infer<typeof InquireAboutCodeOutputSchema>;

export async function inquireAboutCode(input: InquireAboutCodeInput): Promise<InquireAboutCodeOutput> {
  return inquireAboutCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inquireAboutCodePrompt',
  input: {schema: InquireAboutCodeInputSchema},
  output: {schema: InquireAboutCodeOutputSchema},
  prompt: `You are an expert software developer. A user is asking a question about a specific file in a codebase.

  Here is the description of the entire codebase: {{codebaseDescription}}
  Here is the content of the file: {{{fileContent}}}
  Here is the question: {{{question}}}

  Answer the question to the best of your ability.
  Be concise and to the point.
  `,
});

const inquireAboutCodeFlow = ai.defineFlow(
  {
    name: 'inquireAboutCodeFlow',
    inputSchema: InquireAboutCodeInputSchema,
    outputSchema: InquireAboutCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
