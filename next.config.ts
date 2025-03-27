import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  org: "personal-xfs",
  project: "breeze",

  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  tunnelRoute: "/monitoring",

  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  automaticVercelMonitors: true,
});

