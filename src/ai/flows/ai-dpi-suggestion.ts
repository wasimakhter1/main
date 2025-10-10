'use server';

/**
 * @fileOverview DPI suggestion AI agent.
 *
 * - aiDpiSuggestion - A function that handles the DPI suggestion process.
 * - AIDpiSuggestionInput - The input type for the aiDpiSuggestion function.
 * - AIDpiSuggestionOutput - The return type for the aiDpiSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDpiSuggestionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  currentDpi: z.number().describe('The current DPI of the image.'),
  desiredPrintSizeInches: z
    .object({
      width: z.number().describe('The desired width of the print in inches.'),
      height: z.number().describe('The desired height of the print in inches.'),
    })
    .describe('The desired print size in inches.'),
});
export type AIDpiSuggestionInput = z.infer<typeof AIDpiSuggestionInputSchema>;

const AIDpiSuggestionOutputSchema = z.object({
  suggestedDpi: z.number().describe('The suggested DPI for printing.'),
  actionSuggestion: z
    .string()
    .describe(
      'Suggestions on whether to use scaling tools or suggest editing changes to ensure print quality.'
    ),
});
export type AIDpiSuggestionOutput = z.infer<typeof AIDpiSuggestionOutputSchema>;

export async function aiDpiSuggestion(
  input: AIDpiSuggestionInput
): Promise<AIDpiSuggestionOutput> {
  return aiDpiSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDpiSuggestionPrompt',
  input: {schema: AIDpiSuggestionInputSchema},
  output: {schema: AIDpiSuggestionOutputSchema},
  prompt: `You are an AI expert in image printing and DPI optimization.

You will receive information about an image, its current DPI, and the desired print size.

Based on this information, you will suggest an optimal DPI for printing and provide advice on whether to use scaling tools or suggest editing changes to ensure the best possible print quality.

Image: {{media url=photoDataUri}}
Current DPI: {{{currentDpi}}}
Desired Print Size: {{{desiredPrintSizeInches.width}}}x{{{desiredPrintSizeInches.height}}} inches

Consider factors like image resolution, the relationship between DPI and print size, and potential image quality issues that may arise from scaling or resampling.

Output the suggested DPI and your action suggestion.

Ensure the suggested DPI will result in a high-quality print, avoiding pixelation or blurriness.

Your output should be easy to implement in a user interface.

Suggested DPI:
Action Suggestion: `,
});

const aiDpiSuggestionFlow = ai.defineFlow(
  {
    name: 'aiDpiSuggestionFlow',
    inputSchema: AIDpiSuggestionInputSchema,
    outputSchema: AIDpiSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
