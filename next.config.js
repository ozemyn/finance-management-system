/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    appDir: true
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig