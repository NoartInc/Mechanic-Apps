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
        protocol: "http",
        hostname: "localhost",
        port: "6001",
      },
    ],
  },
};

module.exports = nextConfig;
