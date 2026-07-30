import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";
import { QueueList } from "../_components/QueueList";
import { getAllNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "Notes — LAO_Z_3",
  description: "LAO_Z_3 的資安概念筆記：把一個機制想清楚之後留下的理解。",
};

const topics = [
  { number: "N.01", type: "NETWORK", title: "Network & Infrastructure", description: "NAT、Proxy、Tunnel 與封包怎麼被送到（或送不到）目的地。", status: "持續整理" },
  { number: "N.02", type: "WEB", title: "Web & AI Security", description: "整理 Web 與 AI Security 的機制與攻擊面，這是目前較熟悉的領域。", status: "主要領域" },
  { number: "N.03", type: "REV / PWN", title: "Binary & Exploitation", description: "記憶體佈局、漏洞原語與 Exploit 為什麼能成立的前提條件。", status: "學習中" },
  { number: "N.04", type: "SYSTEM", title: "OS & Runtime", description: "Process、FD、權限模型與 Container 邊界這些容易被跳過的基礎。", status: "持續整理" },
] as const;

export default function NotesPage() {
  const published = getAllNotes();
  const publishedItems = published.map((note, index) => ({
    number: String(index + 1).padStart(2, "0"),
    label: note.topic || "NOTE",
    title: note.title,
    description: note.summary,
    href: `/notes/${note.slug}/`,
  }));

  return (
    <InteriorPage
      eyebrow="Collection 04 / concepts & fundamentals"
      title="Notes"
      intro="這裡放的不是解題記錄，而是把一個機制想清楚之後留下的理解：它為什麼這樣設計、邊界在哪裡，以及知道這件事之後我的判斷有什麼不同。寫給未來會忘記細節的自己。"
      mark="§"
      reference="Notes / understand first"
    >
      {publishedItems.length > 0 && (
        <>
          <h2 className="collection-section-title">Published / 已發佈</h2>
          <CollectionIndex items={publishedItems} />
        </>
      )}
      <h2 className="collection-section-title">Topics / 主題</h2>
      <QueueList items={topics} />
    </InteriorPage>
  );
}
