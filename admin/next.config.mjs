/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/review-orden-:id",
        destination: "/public/reviews/:id", // Esto se refiere a la ruta "/public/reviews/[id]"
      },
    ];
  },
};

export default nextConfig;
