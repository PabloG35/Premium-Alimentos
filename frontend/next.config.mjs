/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        // Todas las peticiones a /api/* se reescriben para apuntar al backend
        source: "/api/:path*",
        destination: "http://localhost:5001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
