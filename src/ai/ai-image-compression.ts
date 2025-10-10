// This is an AI-powered image compression flow that optimizes image size while preserving quality.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageCompressionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The image to compress, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    ),
  compressionLevel: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('The desired compression level (0-100, 0 being highest compression).  If omitted, AI will pick the best.'),
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

You will receive an image and a desired compression level. If the compression level is not specified, you will determine the optimal compression level to minimize file size while maintaining acceptable image quality.

You will then compress the image using the determined compression level.

Return the compressed image as a data URI, and provide details about the optimization process and settings used.

Image: {{media url=imageDataUri}}
Compression Level (0-100, 0 being highest compression): {{compressionLevel}}`,
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
