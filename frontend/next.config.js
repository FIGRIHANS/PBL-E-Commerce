/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      // Add other domains if needed for product images
    ],
    // Allow images from public folder
    unoptimized: false,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_REVERB_APP_KEY:
      process.env.NEXT_PUBLIC_REVERB_APP_KEY ||
      process.env.REVERB_APP_KEY ||
      "",
    NEXT_PUBLIC_REVERB_HOST:
      process.env.NEXT_PUBLIC_REVERB_HOST ||
      process.env.REVERB_HOST ||
      "localhost",
    NEXT_PUBLIC_REVERB_PORT:
      process.env.NEXT_PUBLIC_REVERB_PORT ||
      process.env.REVERB_PORT ||
      "8080",
    NEXT_PUBLIC_REVERB_SCHEME:
      process.env.NEXT_PUBLIC_REVERB_SCHEME ||
      process.env.REVERB_SCHEME ||
      "http",
  },
};

module.exports = nextConfig;
