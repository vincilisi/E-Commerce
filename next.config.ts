<<<<<<< HEAD
import type { NextConfig } from 'next';
=======
import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';
>>>>>>> master

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

<<<<<<< HEAD
export default nextConfig;
=======
export default withSentryConfig(nextConfig, { silent: true });
>>>>>>> master
