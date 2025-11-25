import type { NextConfig } from "next";

const nextConfig: NextConfig = () => {
  return {
    env: {
      aspNetApiUrl: "https://developerops.xyz/api",
      phase: "production",
      sessionKey: "xK9#mP2$vL5@nQ8*wR3&jH6^cB4%tN7!dF4",
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
};

export default nextConfig;
