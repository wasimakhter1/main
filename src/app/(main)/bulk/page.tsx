'use client';

import { useState, useCallback } from 'react';
import Workspace from '@/components/workspace';
import { Button } from '@/components/ui/button';
import { Download, UploadCloud, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORMATS } from '@/lib/constants';
import JSZip from 'jszip';

type FileWithPreview = {
  file: File;
  preview: string;
};

export default function BulkPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [targetFormat, setTargetFormat] = useState('PNG');
  const [width, setWidth] = useState<number | string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== fileName));
  };
  
  const processImage = (file: File): Promise<{blob: Blob, name: string}> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const targetWidth = typeof width === 'string' ? (width === '' ? img.width : parseInt(width, 10)) : width;
            const targetHeight = typeof width === 'string' && width === '' ? img.height : Math.round(targetWidth / img.width * img.height);
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context not available'));
            
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            
            const mimeType = `image/${targetFormat.toLowerCase()}`;
            canvas.toBlob(blob => {
                if (!blob) return reject(new Error('Failed to create blob'));
                const newName = `${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat.toLowerCase()}`;
                resolve({ blob, name: newName });
            }, mimeType);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
  };

  const handleBulkProcess = async () => {
    if (files.length === 0) {
      toast({ variant: 'destructive', title: 'No files', description: 'Please upload some images first.' });
      return;
    }
    
    setIsProcessing(true);
    const zip = new JSZip();
    
    try {
        const processingPromises = files.map(f => processImage(f.file));
        const results = await Promise.all(processingPromises);
        
        results.forEach(({ blob, name }) => {
            zip.file(name, blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'ImageResizeKit_Bulk.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        toast({ title: 'Success', description: `${files.length} images processed and zipped.` });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An error occurred during bulk processing.' });
        console.error(error);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Workspace
      title="Bulk Operations"
      description="Resize and convert multiple images at once. Your processed files will be downloaded as a single ZIP archive."
    >
      <div className="space-y-4">
        <label htmlFor="bulk-upload" className="flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Upload multiple images for batch processing</p>
          </div>
          <input id="bulk-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Files ({files.length})</h3>
            <div className="max-h-60 overflow-y-auto rounded-md border p-2 space-y-2">
              {files.map(({ file, preview }) => (
                <div key={file.name} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-md">
                  <img src={preview} alt={file.name} className="h-10 w-10 object-cover rounded" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="width">Max Width (px, optional)</Label>
          <Input id="width" type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="e.g., 1920 (maintains aspect ratio)" disabled={files.length === 0} />
        </div>
        <div>
          <Label htmlFor="format">Target Format</Label>
          <Select value={targetFormat} onValueChange={setTargetFormat} disabled={files.length === 0}>
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

      <Button onClick={handleBulkProcess} disabled={files.length === 0 || isProcessing} className="w-full md:w-auto">
        {isProcessing ? (
          <Download className="mr-2 h-4 w-4 animate-pulse" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isProcessing ? 'Processing...' : `Process ${files.length} Images & Download ZIP`}
      </Button>
    </Workspace>
  );
}
