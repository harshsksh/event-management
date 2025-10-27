/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Allow production builds to successfully complete even if
    // your project has ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

