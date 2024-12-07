/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
<<<<<<< HEAD
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/storage/**',
      }
=======
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/**",
      },
>>>>>>> 53610d2b273ac9d1226757bfeb714d5ab6c5ce01
    ],
    domains: [
      'cloud.appwrite.io',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig;
