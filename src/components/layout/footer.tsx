'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default function AppFooter() {
  const { theme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          {isClient ? (
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          ) : (
            <Skeleton className="h-10 w-10" />
          )}
        </div>
      </div>
    </footer>
  );
}
