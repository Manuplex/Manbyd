import type { NextConfig } from "next";

const nextConfig: NextConfig = {
output: 'standalone',
images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vafyexwqbztaohoejzsz.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "n8n-over-16.manbyd.digital",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
