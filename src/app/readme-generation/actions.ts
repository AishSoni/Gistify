'use server';

import { generateReadme, type GenerateReadmeInput } from '@/ai/flows/readme-generation';
import { z } from 'zod';

const GenerateReadmeActionInputSchema = z.object({
  codebaseDescription: z.string().min(1),
  projectFiles: z.array(z.string()).min(1),
  comments: z.string().min(1),
});

export async function generateReadmeAction(input: GenerateReadmeInput) {
  try {
    const validatedInput = GenerateReadmeActionInputSchema.parse(input);
    const result = await generateReadme(validatedInput);
    return { readmeContent: result.readmeContent };
  } catch (error: any) {
    console.error("Error in generateReadmeAction:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(', ') };
    }
    return { error: error.message || "An unknown error occurred while generating the README." };
  }
}
