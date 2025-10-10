'use client';

import { useState, useEffect, useCallback } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Download, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { compressImage as aiCompressImage } from '@/ai/flows/compress-image-flow';

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataURIToFile(dataURI: string, filename: string): File {
    const arr = dataURI.split(',');
    if (arr.length < 2) {
        throw new Error('Invalid Data URI');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
        throw new Error('Could not determine mime type');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setOriginalSize(file.size);
      setCompressedSize(null);
    } else {
      setOriginalSize(null);
      setCompressedSize(null);
    }
  }, [file]);
  
  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
  };
  
  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const handleCompressAndDownload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload a file to compress.',
      });
      return;
    }
    
    setIsCompressing(true);
    setCompressedSize(null);

    try {
      const imageDataUri = await fileToDataURI(file);
      const result = await aiCompressImage({
        imageDataUri,
        compressionLevel: 100 - quality,
      });

      const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`;
      const compressed = dataURIToFile(result.compressedImageDataUri, newFileName);
      setCompressedSize(compressed.size);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(compressed);
      link.download = compressed.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: 'Compression & Download Complete',
        description: 'AI-powered compression finished and download has started.',
      });

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'AI Compression Error', description: 'Failed to compress the image with AI.' });
    } finally {
        setIsCompressing(false);
    }
  };
  
  const reduction = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <Workspace
      title="AI Image Compressor"
      description="Reduce image file size with our smart AI compressor. Adjust the quality to find the perfect balance."
    >
      <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="quality">Quality</Label>
            <Badge variant="secondary" className="text-base">{quality}</Badge>
          </div>
          <Slider
            id="quality"
            min={1}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(value) => setQuality(value[0])}
            disabled={!file}
          />
        </div>
        <div className='flex flex-col gap-2 text-sm'>
            <div className='flex justify-between'>
                <span className='text-muted-foreground'>Original Size:</span>
                <span className='font-medium'>{formatFileSize(originalSize)}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-muted-foreground'>Compressed Size:</span>
                <span className='font-medium'>{isCompressing ? '...' : formatFileSize(compressedSize)}</span>
            </div>
            <div className='flex justify-between'>
                <span className='font-medium text-accent'>Reduction:</span>
                <span className='font-medium text-accent'>{isCompressing ? '...' : `${reduction}%`}</span>
            </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button onClick={handleCompressAndDownload} disabled={!file || isCompressing} className="w-full sm:w-auto">
            {isCompressing ? <Wand2 className="mr-2 h-4 w-4 animate-pulse" /> : <Download className="mr-2 h-4 w-4" />}
            {isCompressing ? 'Compressing...' : 'Compress & Download'}
        </Button>
      </div>
    </Workspace>
  );
}
