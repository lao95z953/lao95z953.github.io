import type { Metadata } from "next";
import { CollectionIndex } from "../_components/CollectionIndex";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Archive / 內容索引 — LAO_Z_3",
  description: "瀏覽 LAO_Z_3 的 Writeups、Tools & Labs 與活動心得。",
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
] as const;

export default function ArchivePage() {
  return (
    <InteriorPage
      eyebrow="Working archive / 分類索引"
      title="Choose a collection."
      intro="這裡分成三個入口：Writeups 收錄 CTF 與 Pentest／PT 靶機筆記，Tools & Labs 放研究工具與實驗，Reflections 則記錄活動心得與個人想法。"
      mark="A/03"
      reference="Archive index / three collections"
    >
      <CollectionIndex items={collections} />
    </InteriorPage>
  );
}
