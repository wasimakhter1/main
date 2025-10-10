'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Lightbulb, Wand2, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDpiSuggestion } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Get AI Suggestion
        </>
      )}
    </Button>
  );
}

export default function DpiPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [state, formAction] = useActionState(getDpiSuggestion, initialState);
  const { toast } = useToast();

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormKey(Date.now()); // Reset form state
  };

  return (
    <Workspace
      title="DPI Controller"
      description="Let our AI analyze your image and suggest the optimal DPI for high-quality printing based on your desired print size."
    >
      <form key={formKey} action={formAction} className="space-y-8">
        <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />
        {file && <input type="file" name="image" value={undefined} className="hidden" defaultChecked={!!file} />}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width">Desired Width (inches)</Label>
            <Input id="width" name="width" type="number" step="0.1" placeholder="e.g., 8.5" required disabled={!file} />
          </div>
          <div>
            <Label htmlFor="height">Desired Height (inches)</Label>
            <Input id="height" name="height" type="number" step="0.1" placeholder="e.g., 11" required disabled={!file} />
          </div>
        </div>

        <SubmitButton />
      </form>
      
      {state?.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state?.suggestedDpi && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Suggestion</AlertTitle>
          <AlertDescription>
            <p className="font-bold text-lg mb-2">Suggested DPI: <span className='text-primary'>{state.suggestedDpi}</span></p>
            <p>{state.actionSuggestion}</p>
          </AlertDescription>
        </Alert>
      )}
    </Workspace>
  );
}
