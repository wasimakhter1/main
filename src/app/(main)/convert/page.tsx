'use client';

import { useState } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FORMATS } from '@/lib/constants';

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('PNG');
  const { toast } = useToast();

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload an image to convert.',
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      
      const mimeType = `image/${targetFormat.toLowerCase()}`;
      canvas.toBlob((blob) => {
        if (!blob) {
            toast({
                variant: 'destructive',
                title: 'Conversion Failed',
                description: `Could not convert image to ${targetFormat}.`,
            });
            return;
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}.${targetFormat.toLowerCase()}`;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({
          title: 'Success',
          description: `Image converted to ${targetFormat} and download started.`,
        });
      }, mimeType);
    };
    img.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load the uploaded image.',
        });
    }
    img.src = URL.createObjectURL(file);
  };

  return (
    <Workspace
      title="Format Converter"
      description="Quickly convert your images to different formats like JPEG, PNG, WebP, and more."
    >
      <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="format">Target Format</Label>
          <Select value={targetFormat} onValueChange={setTargetFormat} disabled={!file}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map(format => (
                <SelectItem key={format} value={format}>{format}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleConvert} disabled={!file} className="w-full md:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Convert & Download
      </Button>
    </Workspace>
  );
}
