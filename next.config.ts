import type { NextConfig } from "next";

const nextConfig: NextConfig = (phase: string) => {
  return {
    env: {
      aspNetApiUrl: "https://congbinhmedical.io.vn",
      nextApiUrl: "https://congbinhmedical.vn/api",
      phase: "production",
      sessionKey: "xK9#mP2$vL5@nQ8*wR3&jH6^cB4%tN7!dF4",
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
};

export default nextConfig;
