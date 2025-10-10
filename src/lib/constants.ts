import { Scale, Replace, Minimize, Layers, Printer, Sparkles, type LucideIcon } from 'lucide-react';

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

export const FORMATS = ['JPEG', 'PNG', 'WebP', 'GIF'];

export type NavLink = {
    href: string;
    label: string;
    title: string;
    icon: LucideIcon;
};

export const mainNavLinks: NavLink[] = [
  { href: '/resize', label: 'Resize', title: 'Image Resizer', icon: Scale },
  { href: '/convert', label: 'Convert', title: 'Format Converter', icon: Replace },
  { href: '/compress', label: 'Compress', title: 'Image Compressor', icon: Minimize },
  { href: '/bulk', label: 'Bulk', title: 'Bulk Operations', icon: Layers },
  { href: '/dpi', label: 'DPI Control', title: 'DPI Controller', icon: Printer },
  { href: '/enhance', label: 'AI Enhance', title: 'AI Image Enhancer', icon: Sparkles },
];
