/** @type {import('next').NextConfig} */

const nextConfig = {
  // Next.js relies on SSR. This means some specific steps are required to make Web3Modal work properly.
  // Source: https://docs.walletconnect.com/appkit/next/core/installation#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
