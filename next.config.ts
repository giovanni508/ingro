import type { NextConfig } from "next";

/**
 * Old WordPress URLs -> new routes, all 301 (as requested in the brief).
 * Trailing-slash redirects are handled here too (skipTrailingSlashRedirect)
 * so that every old "/slug/" answers 301 rather than Next's default 308.
 */
const MOVED: Array<[string, string]> = [
  ["/donna/", "/donna"],
  ["/uomo/", "/uomo"],
  ["/bambino/", "/bambino"],
  ["/chi-siamo/", "/chi-siamo"],
  ["/contatti/", "/contatti"],
  ["/accessibilita/", "/accessibilita"],
  ["/privacy-policy", "/privacy"],
  ["/privacy-policy/", "/privacy"],
  ["/cookie-policy", "/cookie"],
  ["/cookie-policy/", "/cookie"],
  ["/home", "/"],
  ["/home/", "/"],
  // Leftovers of the WordPress install: never expose a login, send people home.
  ["/wp-login.php", "/"],
  ["/wp-admin", "/"],
  ["/wp-admin/:path*", "/"],
  ["/feed", "/"],
  ["/feed/", "/"],
  ["/comments/feed", "/"],
  ["/comments/feed/", "/"],
  ["/author/:slug*", "/chi-siamo"],
  ["/sample-page", "/"],
  ["/sample-page/", "/"],
  ["/negozio", "/"],
  ["/shop", "/"],
  ["/carrello", "/"],
  ["/mio-account", "/"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/page-sitemap.xml", "/sitemap.xml"],
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 82],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...MOVED.map(([source, destination]) => ({ source, destination, statusCode: 301 as const })),
      // Any other old "/something/" -> "/something" (WordPress always used a trailing slash).
      { source: "/:path((?!_next|api).+)/", destination: "/:path", statusCode: 301 as const },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
    ];
  },
};

export default nextConfig;
