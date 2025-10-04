'use server';

/**
 * @fileOverview An AI-powered health risk assessment for astronauts on Moon/Mars missions.
 *
 * - assessHealthRisk - A function that assesses health risks and provides countermeasure recommendations.
 * - HealthRiskInput - The input type for the assessHealthRisk function.
 * - HealthRiskOutput - The return type for the assessHealthRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthRiskInputSchema = z.object({
  missionType: z
    .string()
    .describe('The type of mission, e.g., Moon, Mars.'),
  vitalSigns: z
    .string()
    .describe(
      'Real-time vital signs of the astronaut, including heart rate, blood pressure, oxygen saturation, etc.'
    ),
  environmentalFactors: z
    .string()
    .describe(
      'Environmental factors of the mission, including radiation levels, gravity, temperature, etc.'
    ),
  missionDuration: z.string().describe('The duration of the mission in days.'),
});
export type HealthRiskInput = z.infer<typeof HealthRiskInputSchema>;

const HealthRiskOutputSchema = z.object({
  riskAssessment: z
    .string()
    .describe('An assessment of the potential health risks for the mission.'),
  countermeasures: z
    .string()
    .describe(
      'Recommendations for countermeasures to mitigate the identified health risks.'
    ),
  missionReadinessScore: z
    .number()
    .describe(
      'A score indicating the astronaut readiness for the mission (0-100).'
    ),
});
export type HealthRiskOutput = z.infer<typeof HealthRiskOutputSchema>;

export async function assessHealthRisk(
  input: HealthRiskInput
): Promise<HealthRiskOutput> {
  return assessHealthRiskFlow(input);
}

const healthRiskPrompt = ai.definePrompt({
  name: 'healthRiskPrompt',
  input: {schema: HealthRiskInputSchema},
  output: {schema: HealthRiskOutputSchema},
  prompt: `You are an AI health risk assessment tool for astronauts on space missions.

  Based on the following information, assess the potential health risks for the mission and provide countermeasure recommendations. Also, provide a mission readiness score (0-100).

  Mission Type: {{{missionType}}}
  Vital Signs: {{{vitalSigns}}}
  Environmental Factors: {{{environmentalFactors}}}
  Mission Duration: {{{missionDuration}}}

  Respond with a risk assessment, countermeasure recommendations, and a mission readiness score.
  Follow this format:
  Risk Assessment: <assessment>
  Countermeasures: <recommendations>
  Mission Readiness Score: <score>
`,
});

const assessHealthRiskFlow = ai.defineFlow(
  {
    name: 'assessHealthRiskFlow',
    inputSchema: HealthRiskInputSchema,
    outputSchema: HealthRiskOutputSchema,
  },
  async input => {
    const {output} = await healthRiskPrompt(input);
    return output!;
  }
);
