'use server';

import { proposeSolutionPlan, type ProposeSolutionPlanInput } from '@/ai/flows/solution-planning';
import { z } from 'zod';

const ProposeSolutionPlanActionInputSchema = z.object({
  issueTitle: z.string().min(1),
  issueDescription: z.string().min(1),
  repositoryName: z.string().min(1),
  relevantCodebaseContext: z.string().optional(),
});

export async function proposeSolutionPlanAction(input: ProposeSolutionPlanInput) {
  try {
    const validatedInput = ProposeSolutionPlanActionInputSchema.parse(input);
    const result = await proposeSolutionPlan(validatedInput);
    return { solutionPlan: result.solutionPlan };
  } catch (error: any) {
    console.error("Error in proposeSolutionPlanAction:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(', ') };
    }
    return { error: error.message || "An unknown error occurred while proposing the solution plan." };
  }
}
