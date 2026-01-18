/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone', // Important for cPanel deployment
  // If hosting in a subdirectory, uncomment and configure:
  // basePath: '/app',
  // assetPrefix: '/app',
};

export default nextConfig;
