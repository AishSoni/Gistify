'use server';

import { analyzePullRequest, type AnalyzePullRequestInput, type AnalyzePullRequestOutput } from '@/ai/flows/pr-review';
import { z } from 'zod';

const AnalyzePullRequestActionInputSchema = z.object({
  diff: z.string().min(1),
  instructions: z.string().optional(),
});

export async function analyzePullRequestAction(input: AnalyzePullRequestInput): Promise<{ review?: AnalyzePullRequestOutput; error?: string }> {
  try {
    const validatedInput = AnalyzePullRequestActionInputSchema.parse(input);
    const result = await analyzePullRequest(validatedInput);
    return { review: result };
  } catch (error: any) {
    console.error("Error in analyzePullRequestAction:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(', ') };
    }
    return { error: error.message || "An unknown error occurred while analyzing the PR." };
  }
}
