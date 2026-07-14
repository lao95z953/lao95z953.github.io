import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Reflections — LAO_Z_3",
  description: "LAO_Z_3 的活動參與心得，以及對資安、技術與成長的想法。",
};

const topics = [
  ["01", "Event Notes / 活動心得", "記錄參加 CTF、資安社群與技術活動後留下的觀察與感受。"],
  ["02", "Things on My Mind / 一些想法", "寫下我對資安、技術、協作，以及學習這件事的個人觀點。"],
  ["03", "Learning in Public / 公開成長", "保留不同階段的理解與改變，不假裝每件事都已經有完整答案。"],
  ["04", "Behind the Work / 過程之外", "分享作品與解題結果之外，那些影響選擇、方向與成長的經歷。"],
] as const;

export default function ReflectionsPage() {
  return (
    <InteriorPage
      eyebrow="Personal log / 隨筆與心得"
      title="Reflections"
      intro="這裡不只記錄學習歷程，也會放參加活動後的心得，以及我對資安、技術與成長的一些想法。它們不一定是教學，更像是某個階段留下的觀察。"
      mark="LZ3"
      reference="Reflections / notes beyond code"
    >
      <div className="principles-grid">
        {topics.map(([number, title, description]) => (
          <article className="principle" key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="about-contact">
        <p>如果想交流活動、資安技術或文章中的想法，可以透過信箱聯絡：</p>
        <a href="mailto:lao95z953@gmail.com">lao95z953@gmail.com ↗</a>
      </div>
    </InteriorPage>
  );
}
