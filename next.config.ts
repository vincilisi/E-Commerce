import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const { withSentryConfig } = require('@sentry/nextjs');
export default withSentryConfig(nextConfig, { silent: true });

export default nextConfig;
