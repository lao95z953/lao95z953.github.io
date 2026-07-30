import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const notesDir = path.join(process.cwd(), "content", "notes");

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  topic: string;
  tags: string[];
  summary: string;
};

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(notesDir)) {
    return [];
  }
  return fs
    .readdirSync(notesDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getNote(slug: string): { meta: NoteMeta; content: string } {
  const fullPath = path.join(notesDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      topic: String(data.topic ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: String(data.summary ?? ""),
    },
    content,
  };
}

export function getAllNotes(): NoteMeta[] {
  return getNoteSlugs()
    .map((slug) => getNote(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
