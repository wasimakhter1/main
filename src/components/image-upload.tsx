'use client';

import { useState, useCallback, type DragEvent, type ChangeEvent, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
  file: File | null;
}

export default function ImageUpload({ onImageUpload, onRemoveImage, file }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  if (preview) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed">
        <Image src={preview} alt="Image preview" fill className="object-contain p-4" />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 rounded-full h-8 w-8 z-10"
          onClick={onRemoveImage}
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <label
      htmlFor="dropzone-file"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${
        isDragging ? 'border-primary bg-accent/20' : 'border-border'
      }`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, GIF, or WebP</p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png,image/jpeg,image/gif,image/webp" />
    </label>
  );
}
