import type { Metadata } from "next";
import { CollectionIndex } from "../_components/CollectionIndex";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Archive / 內容索引 — LAO_Z_3",
  description: "瀏覽 LAO_Z_3 的 Posts、Tools & Labs、Reflections 與 tag 索引。",
};

const collections = [
  {
    number: "01",
    label: "POSTS",
    title: "Posts",
    description: "CTF、Pentest／PT 靶機的解題過程，以及概念筆記。",
    href: "/posts/",
  },
  {
    number: "02",
    label: "TOOLS / LABS",
    title: "Tools & Labs",
    description: "研究工具、輔助腳本，以及可重現的安全實驗。",
    href: "/labs/",
  },
  {
    number: "03",
    label: "PERSONAL LOG",
    title: "Reflections",
    description: "活動參與心得，以及我對資安、技術與成長的想法。",
    href: "/reflections/",
  },
  {
    number: "04",
    label: "TAGS",
    title: "Tags",
    description: "用 tag 橫向瀏覽，一篇文章可以從它的每個 tag 被找到。",
    href: "/tags/",
  },
] as const;

export default function ArchivePage() {
  return (
    <InteriorPage
      eyebrow="Working archive / 分類索引"
      title="Choose a collection."
      intro="文章全部收在 Posts 這一條時間線上，解題過程和概念筆記不再分家；要找特定主題就走 Tags。Tools & Labs 放研究工具與實驗，Reflections 記錄活動心得與個人想法。"
      mark="A/04"
      reference="Archive index / four collections"
    >
      <CollectionIndex items={collections} />
    </InteriorPage>
  );
}
