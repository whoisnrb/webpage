import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default withNextIntl(nextConfig);
