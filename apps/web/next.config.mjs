/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.5'],
  // The proxy handles trailing slash, lowercase, locale, and host/protocol
  // normalization in one SEO-safe hop. Disabling Next's built-in slash redirect
  // avoids chains such as /Blog/ -> /Blog -> /en/blog.
  skipTrailingSlashRedirect: true,
  images: {
    // Images are served straight from Sanity's image CDN, which already handles
    // format conversion (auto=format) and resizing (w/h/q) via the params added
    // in sanity/lib/image.js. We therefore skip Next's own optimizer — this also
    // avoids its SSRF "private IP" check, which false-positives on NAT64/DNS64
    // networks where cdn.sanity.io resolves to a 64:ff9b::/96 address.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
