import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";

export const metadata: Metadata = {
  title: "Tools & Labs — LAO_Z_3",
  description: "LAO_Z_3 的研究工具、輔助腳本與可重現安全實驗。",
};

export default function LabsPage() {
  return (
    <InteriorPage eyebrow="Collection 02 / build & test" title="Tools & Labs" intro="把可重複使用的工具與可重現的實驗放在一起：一邊建立能工作的東西，一邊用實際行為驗證自己的理解。" mark="⌁" reference="Tools & labs / build to learn" />
  );
}
