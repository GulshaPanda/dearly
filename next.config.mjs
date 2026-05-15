/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't fail production builds on ESLint warnings.
  // (Lint locally with `npm run lint` instead.)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow remote images we use for avatars / Unsplash placeholders.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
