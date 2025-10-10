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
      "The image to compress, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  compressionLevel: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('The desired compression level (0-100, 0 being highest compression, 100 being lowest). If omitted, AI will pick the best.'),
});
export type ImageCompressionInput = z.infer<typeof ImageCompressionInputSchema>;

const ImageCompressionOutputSchema = z.object({
  compressedImageDataUri: z
    .string()
    .describe('The compressed image, as a data URI.'),
  optimizationDetails: z
    .string()
    .describe('Details about the optimization process and settings used.'),
});
export type ImageCompressionOutput = z.infer<typeof ImageCompressionOutputSchema>;

export async function compressImage(input: ImageCompressionInput): Promise<ImageCompressionOutput> {
  return imageCompressionFlow(input);
}

const imageCompressionPrompt = ai.definePrompt({
  name: 'imageCompressionPrompt',
  input: {schema: ImageCompressionInputSchema},
  output: {schema: ImageCompressionOutputSchema},
  prompt: `You are an expert image compression specialist.

You will receive an image and an optional desired compression level (0-100, where 0 is the highest compression and 100 is the lowest).

Your task is to compress the provided image.

- If a compressionLevel is specified, use it as a guide to balance quality and file size.
- If no compressionLevel is specified, you must determine the optimal level to significantly reduce file size while preserving as much visual quality as possible.

You must return the compressed image as a JPEG data URI. Also, provide a brief summary of the optimization process, including the final compression settings you used.

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
