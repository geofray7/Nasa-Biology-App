// Implemented the AI Research Co-Pilot feature with a chat interface for semantic search and paper summarization.

'use server';
/**
 * @fileOverview AI Research Co-Pilot flow for answering questions about NASA papers.
 *
 * - aiResearchCoPilot - A function that answers questions about NASA papers.
 * - AiResearchCoPilotInput - The input type for the aiResearchCoPilot function.
 * - AiResearchCoPilotOutput - The return type for the aiResearchCoPilot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResearchCoPilotInputSchema = z.object({
  query: z.string().describe('The question about NASA papers.'),
});
export type AiResearchCoPilotInput = z.infer<typeof AiResearchCoPilotInputSchema>;

const AiResearchCoPilotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about NASA papers.'),
});
export type AiResearchCoPilotOutput = z.infer<typeof AiResearchCoPilotOutputSchema>;

export async function aiResearchCoPilot(input: AiResearchCoPilotInput): Promise<AiResearchCoPilotOutput> {
  return aiResearchCoPilotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResearchCoPilotPrompt',
  input: {schema: AiResearchCoPilotInputSchema},
  output: {schema: AiResearchCoPilotOutputSchema},
  prompt: `You are an AI research assistant specializing in NASA bioscience papers.
  Your goal is to answer user questions based on the content of these papers.
  Provide a concise and informative answer.

  Question: {{{query}}}`,
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
