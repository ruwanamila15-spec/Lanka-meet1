import type { MetadataRoute } from "next";

const siteUrl = "https://lanka-meet1.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    "",
    "/ads",
    "/about",
    "/live-cam",
    "/portal/how-to-post",
    "/portal/info",
    "/privacy",
    "/terms",
    "/refund",
    "/delivery",
  ];

  return publicPages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" || path === "/ads" ? "daily" : "monthly",
    priority:
      path === "" ? 1 : path === "/ads" ? 0.9 : 0.5,
  }));
}
