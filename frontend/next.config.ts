import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve files straight from /public instead of routing every <Image> through
    // Vercel's /_next/image optimizer.
    //
    // The optimizer was the reason every image on the deployed site broke: it
    // decodes each source into a raw bitmap inside a serverless function, and the
    // sources here were up to 6720x4480 (~120MB of RGBA per transform). That
    // exhausts the Hobby plan's transformation quota and the function's memory, and
    // when /_next/image starts failing it takes every next/image on the site with it.
    //
    // The sources are now pre-sized (max 2560px, ~10MB total for the whole folder,
    // see scripts/optimize-images.mjs), so there is nothing left for the optimizer
    // to meaningfully save. Flip this to false to re-enable it — the `sizes` props
    // are already in place for that.
    unoptimized: true,
  },
};

export default nextConfig;
