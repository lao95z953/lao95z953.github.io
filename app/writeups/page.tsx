import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";
import { getAllWriteups } from "../../lib/writeups";

export const metadata: Metadata = {
  title: "Writeups — LAO_Z_3",
  description: "LAO_Z_3 的 CTF、Pentest／PT 靶機與資安研究筆記。",
};

export default function WriteupsPage() {
  const published = getAllWriteups();
  const publishedItems = published.map((writeup, index) => ({
    number: String(index + 1).padStart(2, "0"),
    label: writeup.category || "WRITEUP",
    title: writeup.title,
    description: writeup.summary,
    href: `/writeups/${writeup.slug}/`,
  }));

  return (
    <InteriorPage eyebrow="Collection 01 / technical notes" title="Writeups" intro="不只 CTF。這裡也會收錄未來的 Pentest／PT 靶機 Writeups，保留我如何理解目標、哪些證據改變了判斷，以及最後的方法為什麼能夠成立。" mark="{ }" reference="Writeups / evidence first">
      {publishedItems.length > 0 && (
        <>
          <h2 className="collection-section-title">Published / 已發佈</h2>
          <CollectionIndex items={publishedItems} />
        </>
      )}
    </InteriorPage>
  );
}
