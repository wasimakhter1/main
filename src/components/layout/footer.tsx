'use client';

import Link from 'next/link';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

const languages = [
  "English", "Español", "Français", "Deutsch", "中文 (Mandarin)",
  "हिन्दी", "العربية", "Português", "বাংলা", "Русский",
  "日本語", "ਪੰਜਾਬੀ", "Javanese", "한국어", "Türkçe",
  "Italiano", "Polski", "Українська", "Nederlands", "ไทย",
  "Tiếng Việt", "Română"
];

export default function AppFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-4 md:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-primary">
            About Us
          </Link>
          <Link href="#" className="hover:text-primary">
            Contact Us
          </Link>
          <Link href="#" className="hover:text-primary">
            Privacy Policy
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ScrollArea className="h-72 w-48 rounded-md">
                {languages.map((lang, index) => (
                    <DropdownMenuItem key={index} disabled={lang !== "English"}>
                        {lang}
                    </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
