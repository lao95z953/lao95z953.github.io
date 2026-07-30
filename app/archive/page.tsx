import type { Metadata } from "next";
import { CollectionIndex } from "../_components/CollectionIndex";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Archive / 內容索引 — LAO_Z_3",
  description: "瀏覽 LAO_Z_3 的 Writeups、Tools & Labs、Reflections 與概念筆記。",
};

const collections = [
  {
    number: "01",
    label: "WRITEUPS",
    title: "Writeups",
    description: "CTF、Pentest／PT 靶機與其他資安題目的解題過程。",
    href: "/writeups/",
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
    label: "NOTES",
    title: "Notes",
    description: "資安概念筆記：把一個機制想清楚之後留下的理解。",
    href: "/notes/",
  },
] as const;

export default function ArchivePage() {
  return (
    <InteriorPage
      eyebrow="Working archive / 分類索引"
      title="Choose a collection."
      intro="這裡分成四個入口：Writeups 收錄 CTF 與 Pentest／PT 靶機的解題過程，Tools & Labs 放研究工具與實驗，Reflections 記錄活動心得與個人想法，Notes 則是把一個機制想清楚之後留下的概念筆記。"
      mark="A/04"
      reference="Archive index / four collections"
    >
      <CollectionIndex items={collections} />
    </InteriorPage>
  );
}
