'use server';

import { summarizeRepository, type SummarizeRepositoryInput } from '@/ai/flows/summarize-repository';
import { z } from 'zod';

const SummarizeRepositoryActionInputSchema = z.object({
  githubUrl: z.string().url(),
});

export async function summarizeRepositoryAction(input: SummarizeRepositoryInput) {
  try {
    const validatedInput = SummarizeRepositoryActionInputSchema.parse(input);
    const result = await summarizeRepository(validatedInput);
    return { summary: result.summary };
  } catch (error: any) {
    console.error("Error in summarizeRepositoryAction:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(', ') };
    }
    return { error: error.message || "An unknown error occurred while summarizing the repository." };
  }
}
