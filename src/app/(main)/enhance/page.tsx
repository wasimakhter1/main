'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, AlertTriangle, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRelatedImage } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Related Image
        </>
      )}
    </Button>
  );
}

export default function EnhancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [state, formAction] = useActionState(getRelatedImage, initialState);

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormKey(Date.now());
  };

  const handleFormAction = (formData: FormData) => {
    if (file) {
      formData.set('image', file);
    }
    formAction(formData);
  }

  const downloadImage = () => {
    if (state?.relatedImage) {
        const link = document.createElement('a');
        link.href = state.relatedImage;
        link.download = 'ImageResizeKit_Enhanced.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  return (
    <Workspace
      title="AI Image Enhancer"
      description="Upload an image and let our generative AI suggest a visually related image to enhance your creative projects."
    >
      <form key={formKey} action={handleFormAction} className="space-y-8">
        <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />
        
        <div>
          <Label htmlFor="prompt">Prompt (optional)</Label>
          <Input id="prompt" name="prompt" placeholder="e.g., 'in the style of vaporwave', 'more vibrant colors'" disabled={!file} />
        </div>

        <SubmitButton />
      </form>
      
      {state?.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state?.relatedImage && (
        <div className='space-y-4'>
            <h3 className="text-lg font-semibold">Generated Image</h3>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={state.relatedImage} alt="AI generated related image" fill className="object-contain" />
            </div>
            <Button onClick={downloadImage} variant="outline" className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Generated Image
            </Button>
        </div>
      )}
    </Workspace>
  );
}
