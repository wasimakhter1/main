'use client';

import { useState, useEffect } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import PresetSelector from '@/components/preset-selector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download, Lock, Unlock } from 'lucide-react';
import type { Preset } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const { toast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(file);
    } else {
      setOriginalDimensions(null);
      setWidth('');
      setHeight('');
      setSelectedPreset('');
    }
  }, [file]);

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const handlePresetSelect = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setSelectedPreset(preset.name);
  };

  const handleClearPreset = () => {
    setSelectedPreset('');
    if (originalDimensions) {
      setWidth(originalDimensions.width);
      setHeight(originalDimensions.height);
    }
  };

  const handleDimensionChange = (value: string, dimension: 'width' | 'height') => {
    setSelectedPreset('');
    const numValue = parseInt(value, 10);
    if (dimension === 'width') {
      setWidth(value);
      if (aspectRatioLocked && originalDimensions && !isNaN(numValue)) {
        const newHeight = Math.round((numValue / originalDimensions.width) * originalDimensions.height);
        setHeight(newHeight);
      }
    } else {
      setHeight(value);
      if (aspectRatioLocked && originalDimensions && !isNaN(numValue)) {
        const newWidth = Math.round((numValue / originalDimensions.height) * originalDimensions.width);
        setWidth(newWidth);
      }
    }
  };

  const handleResize = () => {
    if (!file || !width || !height || !originalDimensions) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload an image and specify dimensions.',
      });
      return;
    }

    const targetWidth = typeof width === 'string' ? parseInt(width) : width;
    const targetHeight = typeof height === 'string' ? parseInt(height) : height;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileExtension = file.name.split('.').pop() || 'png';
        const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}_resized.${fileExtension}`;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({
          title: 'Success',
          description: 'Image resized and download started.',
        });
      }, file.type);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <Workspace
      title="Image Resizer"
      description="Resize your images to specific dimensions with ease. Lock aspect ratio to prevent distortion."
    >
      <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} accept="image/png,image/jpeg,image/gif,image/webp" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="presets">Presets</Label>
          <PresetSelector 
            onSelect={handlePresetSelect} 
            onClear={handleClearPreset}
            disabled={!file}
            value={selectedPreset}
          />
        </div>
        
        <div className="flex items-center space-x-2">
            <Label htmlFor="aspect-ratio">Lock Aspect Ratio</Label>
            <Switch
              id="aspect-ratio"
              checked={aspectRatioLocked}
              onCheckedChange={setAspectRatioLocked}
              disabled={!file}
              aria-label="Lock aspect ratio"
            />
            {aspectRatioLocked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input id="width" type="number" value={width} onChange={e => handleDimensionChange(e.target.value, 'width')} placeholder="e.g., 1920" disabled={!file} />
        </div>
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input id="height" type="number" value={height} onChange={e => handleDimensionChange(e.target.value, 'height')} placeholder="e.g., 1080" disabled={!file} />
        </div>
      </div>

      <Button onClick={handleResize} disabled={!file} className="w-full md:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Resize & Download
      </Button>
    </Workspace>
  );
}
