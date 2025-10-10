'use client';

import { useState, useEffect } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
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

  const compressPdf = async (download: boolean) => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await page.render({ canvasContext: ctx, viewport }).promise;

      compressCanvas(canvas, download);

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'PDF Processing Error', description: 'Failed to process the PDF file.' });
    }
  };

  const compressImage = (download: boolean) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      compressCanvas(canvas, download);
    };
    img.src = URL.createObjectURL(file);
  }

  const compressCanvas = (canvas: HTMLCanvasElement, download: boolean) => {
      const mimeType = 'image/jpeg';
      canvas.toBlob((blob) => {
        setIsCompressing(false);
        if (!blob) return;
        setCompressedSize(blob.size);

        if(download) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const newFileName = `${file!.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`;
            link.download = newFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            toast({
                title: 'Success',
                description: 'Image compressed and download started.',
            });
        }
      }, mimeType, quality / 100);
  }

  const handleCompress = (download = false) => {
    if (!file) {
      if (download) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please upload a file to compress.',
        });
      }
      return;
    }
    
    setIsCompressing(true);

    if (file.type === 'application/pdf') {
      compressPdf(download);
    } else {
      compressImage(download);
    }
  };

  useEffect(() => {
      if(file){
          const handler = setTimeout(() => handleCompress(false), 500);
          return () => clearTimeout(handler);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, file]);

  const reduction = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <Workspace
      title="Image Compressor"
      description="Reduce image file size with our smart compressor. Adjust the quality to find the perfect balance."
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
                <span className='text-muted-foreground'>Reduction:</span>
                <span className='font-medium text-accent'>{isCompressing ? '...' : `${reduction}%`}</span>
            </div>
        </div>
      </div>

      <Button onClick={() => handleCompress(true)} disabled={!file || isCompressing} className="w-full md:w-auto">
        <Download className="mr-2 h-4 w-4" />
        {isCompressing ? 'Compressing...' : 'Download Compressed Image'}
      </Button>
    </Workspace>
  );
}
