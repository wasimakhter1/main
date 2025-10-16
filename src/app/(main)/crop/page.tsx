'use client';

import { useState, useRef } from 'react';
import Workspace from '@/components/workspace';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Download, CropIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(uploadedFile);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  const handleDownload = () => {
    if (!completedCrop || !imgRef.current) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please select a crop area first.',
        });
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const fileExtension = file?.name.split('.').pop() || 'png';
      link.download = `cropped-image.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({
        title: 'Success',
        description: 'Image cropped and download started.',
      });
    }, file?.type);
  };

  return (
    <Workspace
      title="Image Cropper"
      description="Select an area of your image to crop. Click and drag to define the crop area."
    >
      <ImageUpload file={file} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} accept="image/png,image/jpeg,image/gif,image/webp" />

      {previewUrl && (
        <div className="flex justify-center">
            <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
            >
                <img ref={imgRef} alt="Crop preview" src={previewUrl} onLoad={onImageLoad} style={{ maxHeight: '70vh' }}/>
            </ReactCrop>
        </div>
      )}

      <Button onClick={handleDownload} disabled={!completedCrop || !file} className="w-full md:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Download Cropped Image
      </Button>
    </Workspace>
  );
}
