'use client';

import { Faq } from '@/components/faq';
import { Button } from '@/components/ui/button';
import { mainNavLinks } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid max-w-4xl mx-auto gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to <span className="text-primary">ImageResizeKit</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Your all-in-one solution for image manipulation. Resize, convert, compress, and enhance your images with powerful tools and AI assistance. Get started by choosing a tool below.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/resize">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary/50 rounded-lg">
          <div className="container px-4 md:px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {mainNavLinks.filter(link => link.href !== '/home').map((link) => (
                      <Link key={link.href} href={link.href} className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-background transition-colors">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <link.icon className="h-8 w-8" />
                          </div>
                          <h3 className="text-lg font-semibold">{link.label}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{link.title}</p>
                          <span className="mt-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              Use Tool &rarr;
                          </span>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      <Faq />
    </div>
  );
}
