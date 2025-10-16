'use client';

import { useState } from 'react';
import Workspace from '@/components/workspace';
import { Button } from '@/components/ui/button';
import { Download, UploadCloud, X, Combine, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type FileWithPreview = {
  file: File;
  preview: string;
};

export default function MergePage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [mergeDirection, setMergeDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.file.name === fileName);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.file.name !== fileName);
    });
  };

  const getPdfAsImage = async (file: File): Promise<HTMLImageElement> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available for PDF');

    await page.render({ canvasContext: ctx, viewport }).promise;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = canvas.toDataURL();
    });
  };

  const getImage = (file: File): Promise<HTMLImageElement> => {
    if (file.type === 'application/pdf') {
      return getPdfAsImage(file);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ variant: 'destructive', title: 'Not enough files', description: 'Please upload at least two files to merge.' });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const originalImages = await Promise.all(files.map(({ file }) => getImage(file)));
      const firstImage = originalImages[0];
      const { width: targetWidth, height: targetHeight } = firstImage;

      const images = await Promise.all(originalImages.map(img => {
        if (img.width === targetWidth && img.height === targetHeight) {
          return Promise.resolve(img);
        }
        return new Promise<HTMLImageElement>(resolve => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(img); // fallback to original if context fails
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const resizedImg = new Image();
          resizedImg.onload = () => resolve(resizedImg);
          resizedImg.src = canvas.toDataURL();
        })
      }));


      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      if (mergeDirection === 'horizontal') {
        canvas.width = targetWidth * images.length;
        canvas.height = targetHeight;
        let currentX = 0;
        images.forEach(img => {
          ctx.drawImage(img, currentX, 0);
          currentX += targetWidth;
        });
      } else { // vertical
        canvas.width = targetWidth;
        canvas.height = targetHeight * images.length;
        let currentY = 0;
        images.forEach(img => {
          ctx.drawImage(img, 0, currentY);
          currentY += targetHeight;
        });
      }

      canvas.toBlob(blob => {
        if (!blob) throw new Error('Failed to create blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ImageResizeKit_Merged.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: 'Success', description: 'Files merged and downloaded.' });
      }, 'image/png');

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred during merging.' });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Workspace
      title="Image Merger"
      description="Combine multiple images or PDFs (first page) into a single file, either horizontally or vertically."
    >
      <div className="space-y-4">
        <label htmlFor="merge-upload" className="flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Upload at least two images or PDFs to merge</p>
          </div>
          <input id="merge-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
        </label>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Files ({files.length})</h3>
            <div className="max-h-60 overflow-y-auto rounded-md border p-2 space-y-2">
              {files.map(({ file, preview }) => (
                <div key={file.name} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-md">
                   {file.type === 'application/pdf' ? (
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ) : (
                    <img src={preview} alt={file.name} className="h-10 w-10 object-cover rounded" />
                  )}
                  <p className="flex-1 text-sm truncate">{file.name}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(file.name)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <Label>Merge Direction</Label>
        <RadioGroup
            value={mergeDirection}
            onValueChange={(value: 'horizontal' | 'vertical') => setMergeDirection(value)}
            className="flex items-center gap-4 mt-2"
            disabled={files.length === 0}
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="r1" />
                <Label htmlFor="r1">Horizontal</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="r2" />
                <Label htmlFor="r2">Vertical</Label>
            </div>
        </RadioGroup>
      </div>

      <Button onClick={handleMerge} disabled={files.length < 2 || isProcessing} className="w-full md:w-auto">
        {isProcessing ? (
          <Combine className="mr-2 h-4 w-4 animate-pulse" />
        ) : (
          <Combine className="mr-2 h-4 w-4" />
        )}
        {isProcessing ? 'Merging...' : `Merge ${files.length} Files`}
      </Button>
    </Workspace>
  );
}
