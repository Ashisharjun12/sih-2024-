/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/storage/**',
      }
    ],
    domains: [
      'cloud.appwrite.io',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
}

module.exports = nextConfig 