'use server';

/**
 * @fileOverview Proposes solution plans for open issues in a repository using GenAI.
 *
 * - proposeSolutionPlan - A function that handles the generation of solution plans.
 * - ProposeSolutionPlanInput - The input type for the proposeSolutionPlan function.
 * - ProposeSolutionPlanOutput - The return type for the proposeSolutionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProposeSolutionPlanInputSchema = z.object({
  issueTitle: z.string().describe('The title of the open issue.'),
  issueDescription: z.string().describe('The detailed description of the open issue.'),
  repositoryName: z.string().describe('The name of the repository the issue belongs to.'),
  relevantCodebaseContext: z
    .string()
    .optional()
    .describe(
      'Relevant parts of the codebase that might be helpful in proposing a solution. Include file paths and code snippets.'
    ),
});
export type ProposeSolutionPlanInput = z.infer<typeof ProposeSolutionPlanInputSchema>;

const ProposeSolutionPlanOutputSchema = z.object({
  solutionPlan: z
    .string()
    .describe('A detailed plan outlining the steps to solve the issue, including code changes and explanations.'),
});
export type ProposeSolutionPlanOutput = z.infer<typeof ProposeSolutionPlanOutputSchema>;

export async function proposeSolutionPlan(input: ProposeSolutionPlanInput): Promise<ProposeSolutionPlanOutput> {
  return proposeSolutionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proposeSolutionPlanPrompt',
  input: {schema: ProposeSolutionPlanInputSchema},
  output: {schema: ProposeSolutionPlanOutputSchema},
  prompt: `You are an AI expert in planning solutions for software issues.

  Based on the provided issue title, description, repository name, and any relevant codebase context, propose a detailed solution plan.
  The solution plan should include specific steps, code changes, and clear explanations.

  Issue Title: {{{issueTitle}}}
  Issue Description: {{{issueDescription}}}
  Repository Name: {{{repositoryName}}}
  Relevant Codebase Context:
  {{#if relevantCodebaseContext}}
  {{{relevantCodebaseContext}}}
  {{else}}
  No relevant codebase context provided.
  {{/if}}

  Propose a solution plan:
  `,
});

const proposeSolutionPlanFlow = ai.defineFlow(
  {
    name: 'proposeSolutionPlanFlow',
    inputSchema: ProposeSolutionPlanInputSchema,
    outputSchema: ProposeSolutionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
