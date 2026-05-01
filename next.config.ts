import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aqguhxpfjntnfikqaukm.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
