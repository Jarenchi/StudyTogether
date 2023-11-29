/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/:path((?!login$)(?!api/)(?!clubs/).*)",
  //       permanent: false,
  //       missing: [
  //         {
  //           type: "cookie",
  //           key: "access_token",
  //         },
  //       ],
  //       destination: "/login",
  //     },
  //     {
  //       source: "/login",
  //       has: [
  //         {
  //           type: "cookie",
  //           key: "access_token",
  //         },
  //       ],
  //       permanent: true,
  //       destination: "/",
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
