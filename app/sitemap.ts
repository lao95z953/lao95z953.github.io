import type { MetadataRoute } from "next";
import { getAllNotes } from "../lib/notes";
import { getAllWriteups } from "../lib/writeups";

export const dynamic = "force-static";

const origin = "https://lao95z953.pages.dev";
const fallbackDate = new Date("2026-07-14");

export default function sitemap(): MetadataRoute.Sitemap {
  const landing: MetadataRoute.Sitemap = [
    "",
    "/archive",
    "/writeups",
    "/notes",
    "/labs",
    "/reflections",
    "/guestbook",
  ].map((path) => ({
    url: `${origin}${path}`,
    lastModified: fallbackDate,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const entries: MetadataRoute.Sitemap = [
    ...getAllWriteups().map((writeup) => ({
      url: `${origin}/writeups/${writeup.slug}/`,
      lastModified: writeup.date ? new Date(writeup.date) : fallbackDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllNotes().map((note) => ({
      url: `${origin}/notes/${note.slug}/`,
      lastModified: note.date ? new Date(note.date) : fallbackDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [...landing, ...entries];
}
