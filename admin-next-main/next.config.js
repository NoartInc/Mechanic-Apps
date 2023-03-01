/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
      },
      {
        protocol: process.env.NODE_ENV !== "production" ? "http" : "https",
        hostname: process.env.NODE_ENV !== "production" ? "localhost" : "mekanik.transmetalroof.com",
        port: "6001",
      },
    ],
  },
};

module.exports = nextConfig;
