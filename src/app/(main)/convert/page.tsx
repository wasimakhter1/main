'use client';

import { useState } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Download, BookType } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FORMATS } from '@/lib/constants';
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Required for pdf.js to work
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

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

  const convertImage = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);

      const newFileName = `${file!.name.replace(/\.[^/.]+$/, "")}.${targetFormat.toLowerCase()}`;
      
      if (targetFormat === 'PDF') {
        try {
          const orientation = img.width > img.height ? 'l' : 'p';
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [img.width, img.height]
          });
          const imgData = canvas.toDataURL(file!.type);
          pdf.addImage(imgData, file!.type.replace('image/','').toUpperCase(), 0, 0, img.width, img.height);
          pdf.save(newFileName);
          toast({
            title: 'Success',
            description: `Image converted to ${targetFormat} and download started.`,
          });
        } catch (error) {
           toast({
                variant: 'destructive',
                title: 'Conversion Failed',
                description: `Could not convert image to ${targetFormat}.`,
            });
        }
        return;
      }
      
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
  }

  const convertPdf = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1); // Using the first page
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}.${targetFormat.toLowerCase()}`;
      const mimeType = `image/${targetFormat.toLowerCase()}`;
      
      canvas.toBlob((blob) => {
        if (!blob) {
            toast({ variant: 'destructive', title: 'Conversion Failed', description: `Could not convert PDF to ${targetFormat}.` });
            return;
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: 'Success', description: `PDF converted to ${targetFormat} and download started.` });
      }, mimeType);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'PDF Conversion Error', description: 'Failed to process the PDF file.' });
    }
  }

  const handleConvert = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload a file to convert.',
      });
      return;
    }
    
    if (file.type === 'application/pdf') {
      if (targetFormat === 'PDF') {
        toast({ variant: 'destructive', title: 'Invalid Conversion', description: 'Cannot convert a PDF to a PDF.' });
        return;
      }
      convertPdf();
      return;
    }

    const img = new Image();
    img.onload = () => convertImage(img);
    img.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load the uploaded image.',
        });
    }
    img.src = URL.createObjectURL(file);
  };
  
  const availableFormats = file?.type === 'application/pdf' ? FORMATS.filter(f => f !== 'PDF') : FORMATS;

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
              {availableFormats.map(format => (
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
