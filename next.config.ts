import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/360', destination: '/view-360', permanent: false },
      { source: '/veiw-360', destination: '/view-360', permanent: true },
    ];
  },
};

export default nextConfig;
