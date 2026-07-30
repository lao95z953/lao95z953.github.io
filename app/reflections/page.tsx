import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Reflections — LAO_Z_3",
  description: "LAO_Z_3 的活動參與心得，以及對資安、技術與成長的想法。",
};

export default function ReflectionsPage() {
  return (
    <InteriorPage
      eyebrow="Personal log / 隨筆與心得"
      title="Reflections"
      intro="這裡不只記錄學習歷程，也會放參加活動後的心得，以及我對資安、技術與成長的一些想法。它們不一定是教學，更像是某個階段留下的觀察。"
      mark="LZ3"
      reference="Reflections / notes beyond code"
    >
      <div className="about-contact">
        <p>如果想交流活動、資安技術或文章中的想法，可以透過信箱聯絡：</p>
        <a href="mailto:lao95z953@gmail.com">lao95z953@gmail.com ↗</a>
      </div>
    </InteriorPage>
  );
}
