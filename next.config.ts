import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://backlineit.hu", 
        "https://www.backlineit.hu", 
        "http://backlineit.hu", 
        "http://www.backlineit.hu", 
        "http://localhost:3000"
      ],
      bodySizeLimit: "100mb",
    },
  },
  allowedDevOrigins: ["localhost:3000"],
  async redirects() {
    return [
      { source: '/en/rolunk', destination: '/en/about-us', permanent: true },
      { source: '/en/referenciak', destination: '/en/references', permanent: true },
      { source: '/en/arak', destination: '/en/pricing', permanent: true },
      { source: '/en/kapcsolat', destination: '/en/contact', permanent: true },
      { source: '/en/szolgaltatasok', destination: '/en/services', permanent: true },
      { source: '/en/szolgaltatasok/biztonsag', destination: '/en/services/security', permanent: true },
      { source: '/en/szolgaltatasok/halozat', destination: '/en/services/network', permanent: true },
      { source: '/en/szolgaltatasok/integraciok', destination: '/en/services/integrations', permanent: true },
      { source: '/en/szolgaltatasok/rendszeruzemeltetes', destination: '/en/services/system-administration', permanent: true },
      { source: '/en/szolgaltatasok/scriptek', destination: '/en/services/scripts', permanent: true },
      { source: '/en/szolgaltatasok/webfejlesztes', destination: '/en/services/web-development', permanent: true },
      { source: '/en/megoldasok', destination: '/en/solutions', permanent: true },
      { source: '/en/velemeny', destination: '/en/testimonials', permanent: true },
      { source: '/en/konzultacio', destination: '/en/consultation', permanent: true },
      { source: '/en/karrier', destination: '/en/careers', permanent: true },
      { source: '/en/karrier/jelentkezes', destination: '/en/careers/apply', permanent: true },
      { source: '/en/impresszum', destination: '/en/imprint', permanent: true },
      { source: '/en/adatvedelem', destination: '/en/privacy-policy', permanent: true },
      { source: '/en/aszf', destination: '/en/terms-and-conditions', permanent: true },
      { source: '/en/ajanlatkeres', destination: '/en/request-a-quote', permanent: true },
      { source: '/en/referenciak/:slug', destination: '/en/references/:slug', permanent: true },
      { source: '/en/megoldasok/:slug', destination: '/en/solutions/:slug', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
