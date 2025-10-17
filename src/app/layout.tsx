import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ImageResizeKit – Free Online Image Resizer, Compressor & Converter',
  description:
    'Resize, compress, and convert images online for free with ImageResizeKit. Optimize your photos instantly using smart AI tools — fast, easy, and secure.',
  icons: { icon: '/favicon.ico' },
  verification: {
    google: 'mgJ8wFxmJl5MqI4GN24eyLeFx_-BGmN8q6ByJAwtnkw', // ✅ site verification
  },
  openGraph: {
    title: 'ImageResizeKit – Free Online Image Resizer, Compressor & Converter',
    description:
      'Resize, compress, and convert images online for free with ImageResizeKit. Optimize your photos instantly using smart AI tools — fast, easy, and secure.',
    url: 'https://imageresizekit.com',
    siteName: 'ImageResizeKit',
    images: [
      {
        url: 'https://imageresizekit.com/og-image.png', // ⚠️ Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'ImageResizeKit – Free Online Image Resizer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageResizeKit – Free Online Image Resizer, Compressor & Converter',
    description:
      'Resize, compress, and convert images online for free with ImageResizeKit. Optimize your photos instantly using smart AI tools — fast, easy, and secure.',
    images: ['https://imageresizekit.com/og-image.png'], // ⚠️ Replace with your OG image
    creator: '@ImageResizeKit', // optional if you have Twitter
  },
  keywords: [
    'image resizer',
    'image compressor',
    'image converter',
    'AI image tool',
    'online photo optimizer',
    'free image resize',
    'imageResizeKit',
  ],
  metadataBase: new URL('https://imageresizekit.com'),
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
