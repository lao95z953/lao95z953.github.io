import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";

export const metadata: Metadata = {
  title: "Tools & Labs — LAO_Z_3",
  description: "LAO_Z_3 的研究工具、輔助腳本與可重現安全實驗。",
};

const repositories: {
  number: string;
  label: string;
  title: string;
  href: string;
}[] = [];

export default function LabsPage() {
  return (
    <InteriorPage eyebrow="Collection 02 / build & test" title="Tools & Labs" reference="Tools & labs / build to learn">
      {repositories.length > 0 && (
        <>
          <h2 className="collection-section-title">Repositories / 原始碼</h2>
          <CollectionIndex items={repositories} />
        </>
      )}
    </InteriorPage>
  );
}
