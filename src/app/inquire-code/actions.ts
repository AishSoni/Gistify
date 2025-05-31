'use server';

import { inquireAboutCode, type InquireAboutCodeInput } from '@/ai/flows/inquire-about-code';
import { z } from 'zod';

const InquireAboutCodeActionInputSchema = z.object({
  codebaseDescription: z.string().min(1),
  fileContent: z.string().min(1),
  question: z.string().min(1),
});

export async function inquireAboutCodeAction(input: InquireAboutCodeInput) {
  try {
    const validatedInput = InquireAboutCodeActionInputSchema.parse(input);
    const result = await inquireAboutCode(validatedInput);
    return { answer: result.answer };
  } catch (error: any) {
    console.error("Error in inquireAboutCodeAction:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(', ') };
    }
    return { error: error.message || "An unknown error occurred while inquiring about code." };
  }
}
