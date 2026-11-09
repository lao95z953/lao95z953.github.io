import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
};

export type TagSummary = {
  slug: string;
  name: string;
  count: number;
};

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  return fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getPost(slug: string): { meta: PostMeta; content: string } {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: String(data.summary ?? ""),
    },
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): TagSummary[] {
  const seen = new Map<string, TagSummary>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      if (!slug) {
        continue;
      }
      const existing = seen.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        seen.set(slug, { slug, name: tag, count: 1 });
      }
    }
  }

  return [...seen.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function getTag(slug: string): TagSummary | undefined {
  return getAllTags().find((tag) => tag.slug === slug);
}

export function getPostsByTag(slug: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug),
  );
}
