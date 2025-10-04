'use server';
/**
 * @fileOverview AI Research Co-Pilot flow that connects to the Gemini API.
 *
 * - aiResearchCoPilot - A function that answers questions about NASA and space.
 * - AiResearchCoPilotInput - The input type for the aiResearchCoPilot function.
 * - AiResearchCoPilotOutput - The return type for the aiResearchCoPilot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResearchCoPilotInputSchema = z.object({
  query: z.string().describe('The user\'s question about space, NASA, astronomy, or space exploration.'),
});
export type AiResearchCoPilotInput = z.infer<typeof AiResearchCoPilotInputSchema>;

const AiResearchCoPilotOutputSchema = z.object({
  answer: z.string().describe('A comprehensive, factual answer based on NASA\'s research and space science.'),
});
export type AiResearchCoPilotOutput = z.infer<typeof AiResearchCoPilotOutputSchema>;

export async function aiResearchCoPilot(input: AiResearchCoPilotInput): Promise<AiResearchCoPilotOutput> {
  return aiResearchCoPilotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResearchCoPilotPrompt',
  input: {schema: AiResearchCoPilotInputSchema},
  output: {schema: AiResearchCoPilotOutputSchema},
  prompt: `You are a NASA space expert. Answer the following question about space, NASA, astronomy, or space exploration in a helpful and accurate way.

Question: {{{query}}}

Provide a comprehensive, factual answer based on NASA's research and space science. If it's about current missions, include the latest information. If it's speculative, mention that it's theoretical. Keep the response engaging but professional.`,
});

const aiResearchCoPilotFlow = ai.defineFlow(
  {
    name: 'aiResearchCoPilotFlow',
    inputSchema: AiResearchCoPilotInputSchema,
    outputSchema: AiResearchCoPilotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
