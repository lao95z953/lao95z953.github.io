import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const writeupsDir = path.join(process.cwd(), "content", "writeups");

export type WriteupMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
};

export function getWriteupSlugs(): string[] {
  if (!fs.existsSync(writeupsDir)) {
    return [];
  }
  return fs
    .readdirSync(writeupsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getWriteup(slug: string): { meta: WriteupMeta; content: string } {
  const fullPath = path.join(writeupsDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      category: String(data.category ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: String(data.summary ?? ""),
    },
    content,
  };
}

export function getAllWriteups(): WriteupMeta[] {
  return getWriteupSlugs()
    .map((slug) => getWriteup(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
