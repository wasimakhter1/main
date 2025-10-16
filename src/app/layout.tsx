// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ImageResizeKit',
  description: 'Resize, convert, compress, and enhance your images with AI.',
  icons: { icon: '/favicon.ico' },
  verification: {
    google: 'mgJ8wFxmJl5MqI4GN24eyLeFx_-BGmN8q6ByJAwtnkw', // ✅ site verification
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-6634397146745986" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-C2YL2XCN9K"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C2YL2XCN9K', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* Google AdSense Script */}
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6634397146745986"
          crossOrigin="anonymous"
        />
        {/* Initialize AdSense */}
        <Script id="ads-init" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({});
          `}
        </Script>

        <SidebarProvider>{children}</SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
