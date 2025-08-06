'use server';

/**
 * @fileOverview This file defines a Genkit flow for root cause analysis of industrial machinery issues.
 *
 * - analyzeRootCause - A function that takes a description of a problem and returns a list of likely root causes.
 * - RootCauseAnalysisInput - The input type for the analyzeRootCause function.
 * - RootCauseAnalysisOutput - The return type for the analyzeRootCause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RootCauseAnalysisInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A detailed description of the problem reported in the industrial machinery.'),
});
export type RootCauseAnalysisInput = z.infer<typeof RootCauseAnalysisInputSchema>;

const RootCauseAnalysisOutputSchema = z.object({
  likelyRootCauses: z
    .array(z.string())
    .describe('A list of the most likely root causes for the reported problem.'),
});
export type RootCauseAnalysisOutput = z.infer<typeof RootCauseAnalysisOutputSchema>;

export async function analyzeRootCause(
  input: RootCauseAnalysisInput
): Promise<RootCauseAnalysisOutput> {
  return analyzeRootCauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rootCauseAnalysisPrompt',
  input: {schema: RootCauseAnalysisInputSchema},
  output: {schema: RootCauseAnalysisOutputSchema},
  prompt: `You are an expert in industrial machinery maintenance and root cause analysis.

  Analyze the following problem description and provide a list of the most likely root causes.
  Return the root causes as a numbered list.

  Problem Description: {{{problemDescription}}}
  `, // Updated prompt to request a numbered list.
});

const analyzeRootCauseFlow = ai.defineFlow(
  {
    name: 'analyzeRootCauseFlow',
    inputSchema: RootCauseAnalysisInputSchema,
    outputSchema: RootCauseAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
