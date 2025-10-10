'use server';

/**
 * @fileOverview Suggests related images based on a source image using generative AI.
 *
 * - suggestRelatedImages - A function that suggests related images based on a source image.
 * - SuggestRelatedImagesInput - The input type for the suggestRelatedImages function.
 * - SuggestRelatedImagesOutput - The return type for the suggestRelatedImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedImagesInputSchema = z.object({
  sourceImage: z
    .string()
    .describe(
      'A photo to find related images for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  prompt: z
    .string()
    .optional()
    .describe(
      'Optional keywords or description to help narrow the search for related images.'
    ),
});
export type SuggestRelatedImagesInput = z.infer<typeof SuggestRelatedImagesInputSchema>;

const SuggestRelatedImagesOutputSchema = z.object({
  relatedImage: z
    .string()
    .describe(
      'A related image based on the source image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type SuggestRelatedImagesOutput = z.infer<typeof SuggestRelatedImagesOutputSchema>;

export async function suggestRelatedImages(
  input: SuggestRelatedImagesInput
): Promise<SuggestRelatedImagesOutput> {
  return suggestRelatedImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedImagesPrompt',
  input: {schema: SuggestRelatedImagesInputSchema},
  output: {schema: SuggestRelatedImagesOutputSchema},
  prompt: `You are an AI assistant designed to generate related images based on a source image and an optional prompt.

  Given the following image: {{media url=sourceImage}}

  Generate a related image based on the image, adhering to these instructions:

  {{#if prompt}}
  Also, take into account the following prompt: {{{prompt}}}
  {{/if}}

  Return the image as a data URI.
  `,
});

const suggestRelatedImagesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedImagesFlow',
    inputSchema: SuggestRelatedImagesInputSchema,
    outputSchema: SuggestRelatedImagesOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: [
        {media: {url: input.sourceImage}},
        {text: `generate an image that is visually similar. ${input.prompt ?? ''}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      relatedImage: output?.media?.url ?? '',
    };
  }
);
