declare module "next-pwa" {
  import type { NextConfig } from "next"

  interface RuntimeCachingEntry {
    urlPattern?: RegExp | string
    handler?: string
    options?: Record<string, unknown>
  }

  interface PWAOptions {
    dest?: string
    disable?: boolean
    register?: boolean
    scope?: string
    sw?: string
    skipWaiting?: boolean
    buildExcludes?: Array<RegExp | string>
    runtimeCaching?: RuntimeCachingEntry[]
  }

  function withPWA(
    options: PWAOptions
  ): (nextConfig: NextConfig) => NextConfig

  export default withPWA
}