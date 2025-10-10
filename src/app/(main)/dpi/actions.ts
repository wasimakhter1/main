'use server';

import { aiDpiSuggestion } from '@/ai/flows/ai-dpi-suggestion';
import { z } from 'zod';

const formSchema = z.object({
  width: z.coerce.number().positive('Width must be a positive number.'),
  height: z.coerce.number().positive('Height must be a positive number.'),
  image: z.instanceof(File).refine((file) => file.size > 0, { message: 'Image is required.' }),
});

type State = {
  suggestedDpi?: number;
  actionSuggestion?: string;
  error?: string;
};

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function getDpiSuggestion(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    width: formData.get('width'),
    height: formData.get('height'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.image?.[0] || 'Invalid input.' };
  }

  const { image, width, height } = validatedFields.data;
  
  try {
    const dataUrl = await fileToDataUrl(image);
    
    // We assume a standard 72 DPI for web images if not specified.
    // The AI can infer resolution from image dimensions.
    const result = await aiDpiSuggestion({
      photoDataUri: dataUrl,
      currentDpi: 72, 
      desiredPrintSizeInches: { width, height },
    });

    if (!result.suggestedDpi) {
        return { error: 'The AI could not determine a suggested DPI. The image might be too small for the desired print size.' };
    }

    return result;
  } catch (error) {
    console.error('DPI Suggestion Error:', error);
    return { error: 'An unexpected error occurred while getting the AI suggestion. Please try again.' };
  }
}
