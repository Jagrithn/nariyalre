import type { NextConfig } from "next"
import withPWA from "next-pwa"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.tile.openstreetmap.org",
        pathname: "/**",
      },
    ],
  },
}

const withPWAInit = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/chunks\/images\/.*/],
  runtimeCaching: [
    {
      urlPattern: /^\/(?!__nextjs_original-stack-frame)/,
      handler: "NetworkFirst",
      options: {
        cacheName: "coco-app-shell",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern:
        /^https:\/\/.*\.(tile\.openstreetmap\.org|a\.tile\.openstreetmap\.org|b\.tile\.openstreetmap\.org|c\.tile\.openstreetmap\.org).*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "coco-map-tiles",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "coco-static",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
})

export default withPWAInit(nextConfig)