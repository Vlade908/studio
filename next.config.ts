import type {NextConfig} from 'next';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    worker-src 'self' blob: https://unpkg.com;
    connect-src 'self' https://unpkg.com;
    img-src 'self' https://placehold.co data:;
    form-action 'self';
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  // Enforce HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
   // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // Add Content-Security-Policy
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  }
];


const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
