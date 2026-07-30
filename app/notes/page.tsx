import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";
import { getAllNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "Notes — LAO_Z_3",
  description: "LAO_Z_3 的資安概念筆記：把一個機制想清楚之後留下的理解。",
};

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
    </InteriorPage>
  );
}
