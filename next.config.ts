import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Force www → non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.imageresizekit.com' }],
        destination: 'https://imageresizekit.com/:path*',
        permanent: true, // sets 308 (permanent redirect)
      },
      // Force HTTP → HTTPS
      {
        source: '/:path*',
        has: [{ type: 'protocol', value: 'http' }],
        destination: 'https://imageresizekit.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
