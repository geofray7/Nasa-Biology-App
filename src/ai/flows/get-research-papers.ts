'use server';
/**
 * @fileOverview A flow for fetching research papers for the Cosmic Research Galaxy.
 *
 * - getResearchPapers - Fetches a graph of research papers.
 * - ResearchPapersOutput - The return type for the getResearchPapers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import researchPapersData from '@/lib/research-papers.json';

const PaperSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  year: z.number(),
  summary: z.string(),
  keywords: z.array(z.string()),
});

const LinkSchema = z.object({
  source: z.string(),
  target: z.string(),
});

const ResearchPapersOutputSchema = z.object({
  nodes: z.array(PaperSchema),
  links: z.array(LinkSchema),
});

export type ResearchPapersOutput = z.infer<typeof ResearchPapersOutputSchema>;

export async function getResearchPapers(): Promise<ResearchPapersOutput> {
  return getResearchPapersFlow();
}

const getResearchPapersFlow = ai.defineFlow(
  {
    name: 'getResearchPapersFlow',
    outputSchema: ResearchPapersOutputSchema,
  },
  async () => {
    // In a real application, this would fetch data from a database
    // or a research paper API. For this prototype, we'll use mock data.
    // We add a small delay to simulate a network request.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return researchPapersData;
  }
);
