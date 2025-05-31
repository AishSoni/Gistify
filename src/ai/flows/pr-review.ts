// pr-review.ts
'use server';

/**
 * @fileOverview Analyzes an open pull request using GenAI to identify key changes,
 * potential conflicts, and areas that need further review.
 *
 * - analyzePullRequest - A function that analyzes a pull request and provides a review.
 * - AnalyzePullRequestInput - The input type for the analyzePullRequest function.
 * - AnalyzePullRequestOutput - The return type for the analyzePullRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePullRequestInputSchema = z.object({
  diff: z
    .string()
    .describe(
      'The diff of the pull request to analyze.'
    ),
  instructions: z.string().optional().describe('Optional instructions for the review.'),
});
export type AnalyzePullRequestInput = z.infer<typeof AnalyzePullRequestInputSchema>;

const AnalyzePullRequestOutputSchema = z.object({
  summary: z.string().describe('A summary of the pull request.'),
  keyChanges: z.array(z.string()).describe('Key changes in the pull request.'),
  potentialConflicts: z.array(z.string()).describe('Potential conflicts in the pull request.'),
  areasForReview: z.array(z.string()).describe('Areas that need further review.'),
});
export type AnalyzePullRequestOutput = z.infer<typeof AnalyzePullRequestOutputSchema>;

export async function analyzePullRequest(input: AnalyzePullRequestInput): Promise<AnalyzePullRequestOutput> {
  return analyzePullRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePullRequestPrompt',
  input: {schema: AnalyzePullRequestInputSchema},
  output: {schema: AnalyzePullRequestOutputSchema},
  prompt: `You are an AI expert in analyzing pull requests.

Analyze the following pull request diff and provide a summary, key changes, potential conflicts, and areas that need further review.

Diff:
{{{diff}}}

Instructions:
{{{instructions}}}

Output the response as a JSON object. Follow this schema:
${JSON.stringify(AnalyzePullRequestOutputSchema.shape, null, 2)}`,
});

const analyzePullRequestFlow = ai.defineFlow(
  {
    name: 'analyzePullRequestFlow',
    inputSchema: AnalyzePullRequestInputSchema,
    outputSchema: AnalyzePullRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
