'use server';

import { suggestRelatedImages } from '@/ai/flows/ai-image-suggestion';
import { z } from 'zod';

const formSchema = z.object({
  image: z.instanceof(File).refine((file) => file.size > 0, { message: 'Image is required.' }),
  prompt: z.string().optional(),
});

type State = {
  relatedImage?: string;
  error?: string;
};

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function getRelatedImage(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    image: formData.get('image'),
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.image?.[0] || 'Invalid input.' };
  }
  
  const { image, prompt } = validatedFields.data;

  try {
    const dataUrl = await fileToDataUrl(image);

    const result = await suggestRelatedImages({
      sourceImage: dataUrl,
      prompt,
    });
    
    if (!result.relatedImage) {
        return { error: 'The AI failed to generate an image. Please try a different source image or prompt.' };
    }

    return result;
  } catch (error) {
    console.error('Related Image Generation Error:', error);
    return { error: 'An unexpected error occurred while generating the image. Please try again.' };
  }
}
