'use server';
/**
 * @fileOverview An AI-powered image compression flow that optimizes image size while preserving quality.
 *
 * - compressImage - A function that handles the image compression process.
 * - ImageCompressionInput - The input type for the compressImage function.
 * - ImageCompressionOutput - The return type for the compressImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageCompressionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A data URI of the image to compress. Must include a MIME type and use Base64 encoding. e.g., 'data:<mimetype>;base64,<encoded_data>'."
    ),
  compressionLevel: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('Desired compression level (0-100). 0 is max compression, 100 is lowest. AI will optimize if omitted.'),
});
export type ImageCompressionInput = z.infer<typeof ImageCompressionInputSchema>;

const ImageCompressionOutputSchema = z.object({
  compressedImageDataUri: z
    .string()
    .describe('The compressed image as a JPEG data URI.'),
  optimizationDetails: z
    .string()
    .describe('A summary of the optimization process and settings used.'),
});
export type ImageCompressionOutput = z.infer<typeof ImageCompressionOutputSchema>;

export async function compressImage(input: ImageCompressionInput): Promise<ImageCompressionOutput> {
  return imageCompressionFlow(input);
}

const imageCompressionPrompt = ai.definePrompt({
  name: 'imageCompressionPrompt',
  input: {schema: ImageCompressionInputSchema},
  output: {schema: ImageCompressionOutputSchema},
  prompt: `You are an image compression expert.

You will receive an image and an optional compression level (0-100, where 0 is highest compression, 100 is lowest).

Your task is to compress the image.

- If a compressionLevel is specified, use it as a guide.
- If no compressionLevel is specified, determine the optimal level to reduce file size while preserving visual quality.

Return the compressed image as a JPEG data URI and a brief summary of the optimization, including the final compression settings.

Image: {{media url=imageDataUri}}
Requested Compression Level (0-100): {{compressionLevel}}`,
});


const imageCompressionFlow = ai.defineFlow(
  {
    name: 'imageCompressionFlow',
    inputSchema: ImageCompressionInputSchema,
    outputSchema: ImageCompressionOutputSchema,
  },
  async input => {
    const {output} = await imageCompressionPrompt(input);
    return output!;
  }
);
