import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.1.204:3000"],
    },
  },
  allowedDevOrigins: ["localhost:3000", "192.168.1.204", "192.168.1.204:3000"],
};

export default withNextIntl(nextConfig);
