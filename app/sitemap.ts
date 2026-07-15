import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/archive", "/writeups", "/labs", "/reflections", "/guestbook"].map(
    (path) => ({
      url: `https://lao95z953.pages.dev${path}`,
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.8,
    }),
  );
}
