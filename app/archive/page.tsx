import type { Metadata } from "next";
import { CollectionIndex } from "../_components/CollectionIndex";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Archive / 內容索引 — LAO_Z_3",
  description: "瀏覽 LAO_Z_3 的 Posts、Tools & Labs 與 tag 索引。",
};

const collections = [
  {
    number: "01",
    label: "POSTS",
    title: "Posts",
    href: "/posts/",
  },
  {
    number: "02",
    label: "TOOLS / LABS",
    title: "Tools & Labs",
    href: "/labs/",
  },
  {
    number: "03",
    label: "TAGS",
    title: "Tags",
    href: "/tags/",
  },
] as const;

export default function ArchivePage() {
  return (
    <InteriorPage
      eyebrow="Working archive / 分類索引"
      title="Choose a collection."
      reference="Archive index / three collections"
    >
      <CollectionIndex items={collections} />
    </InteriorPage>
  );
}
