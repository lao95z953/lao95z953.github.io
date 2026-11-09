import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "../lib/posts";

export const dynamic = "force-static";

const origin = "https://lao95z953.pages.dev";
const fallbackDate = new Date("2026-07-14");

export default function sitemap(): MetadataRoute.Sitemap {
  const landing: MetadataRoute.Sitemap = [
    "",
    "/archive",
    "/posts",
    "/tags",
    "/labs",
  ].map((path) => ({
    url: `${origin}${path}`,
    lastModified: fallbackDate,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${origin}/posts/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : fallbackDate,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${origin}/tags/${tag.slug}/`,
    lastModified: fallbackDate,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...landing, ...posts, ...tags];
}
