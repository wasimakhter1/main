'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (isClient) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, isClient]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, isClient };
};

export default function AppFooter() {
  const { theme, toggleTheme, isClient } = useTheme();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-4 md:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-primary" title="About our free image tools">
            About us
          </Link>
          <Link href="/contact" className="hover:text-primary" title="Contact us for support">
            Contact Us
          </Link>
          <Link href="/privacy" className="hover:text-primary" title="Privacy policy for our image tools">
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
