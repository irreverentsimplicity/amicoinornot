/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      "pino-pretty": "commonjs pino-pretty",
    });
    return config;
  },
};

export default nextConfig;
