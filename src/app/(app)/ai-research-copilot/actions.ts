'use server';

import { aiResearchCoPilot } from '@/ai/flows/ai-research-copilot';
import { z } from 'zod';

const AskAiCopilotSchema = z.object({
  query: z
    .string()
    .min(3, { message: 'Query must be at least 3 characters long.' }),
});

export type FormState = {
  query: string;
  answer?: string;
  error?: string;
};

export async function askAiCopilot(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = AskAiCopilotSchema.safeParse({
    query: formData.get('query'),
  });

  const query = formData.get('query') as string;

  if (!validatedFields.success) {
    return {
      query: query,
      error: validatedFields.error.flatten().fieldErrors.query?.[0],
    };
  }

  try {
    const result = await aiResearchCoPilot({ query: validatedFields.data.query });
    return {
      query: validatedFields.data.query,
      answer: result.answer,
    };
  } catch (e) {
    console.error(e);
    return {
      query: validatedFields.data.query,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
