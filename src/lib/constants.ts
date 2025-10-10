import { Scale, Replace, Minimize, Layers, Sparkles, Home, Combine, Crop, type LucideIcon } from 'lucide-react';

export type Preset = {
  name: string;
  width: number;
  height: number;
  category: string;
};

export const PRESETS: Preset[] = [
  { name: 'Instagram Post (1:1)', width: 1080, height: 1080, category: 'Social Media' },
  { name: 'Instagram Story (9:16)', width: 1080, height: 1920, category: 'Social Media' },
  { name: 'Facebook Post', width: 1200, height: 630, category: 'Social Media' },
  { name: 'Facebook Cover', width: 851, height: 315, category: 'Social Media' },
  { name: 'Twitter/X Post', width: 1600, height: 900, category: 'Social Media' },
  { name: 'LinkedIn Post', width: 1200, height: 627, category: 'Social Media' },
  { name: 'Website Banner (16:9)', width: 1920, height: 1080, category: 'Web' },
  { name: 'Website Hero', width: 1920, height: 600, category: 'Web' },
  { name: '4:3 Ratio', width: 1024, height: 768, category: 'Standard Ratios' },
  { name: '16:9 Ratio', width: 1920, height: 1080, category: 'Standard Ratios' },
  { name: '3:2 Ratio', width: 1080, height: 720, category: 'Standard Ratios' },
];

export const FORMATS = ['JPEG', 'PNG', 'WebP', 'GIF', 'PDF'];

export type NavLink = {
    href: string;
    label: string;
    title: string;
    icon: LucideIcon;
};

export const mainNavLinks: NavLink[] = [
  { href: '/home', label: 'Home', title: 'ImageResizeKit Home', icon: Home },
  { href: '/resize', label: 'Resize', title: 'Image Resizer', icon: Scale },
  { href: '/crop', label: 'Crop', title: 'Image Cropper', icon: Crop },
  { href: '/convert', label: 'Convert', title: 'Format Converter', icon: Replace },
  { href: '/compress', label: 'Compress', title: 'Image Compressor', icon: Minimize },
  { href: '/merge', label: 'Merge', title: 'Image Merger', icon: Combine },
  { href: '/bulk', label: 'Bulk', title: 'Bulk Operations', icon: Layers },
];
