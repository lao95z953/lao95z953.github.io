import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { QueueList } from "../_components/QueueList";

export const metadata: Metadata = {
  title: "Tools & Labs — LAO_Z_3",
  description: "LAO_Z_3 的研究工具、輔助腳本與可重現安全實驗。",
};

const items = [
  { number: "TL.01", type: "LAB", title: "Security Labs", description: "用小型、可控制的環境觀察漏洞行為，保留能再次驗證的最小實驗。", status: "持續整理" },
  { number: "TL.02", type: "TOOL", title: "Tools & Scripts", description: "整理 Solver、Extractor、除錯工具與研究流程中可重複使用的腳本。", status: "持續整理" },
  { number: "TL.03", type: "WORKFLOW", title: "Workflow Experiments", description: "測試新的分析方法與工作流程，記錄它們適合解決的問題與限制。", status: "規劃中" },
] as const;

export default function LabsPage() {
  return (
    <InteriorPage eyebrow="Collection 02 / build & test" title="Tools & Labs" intro="把可重複使用的工具與可重現的實驗放在一起：一邊建立能工作的東西，一邊用實際行為驗證自己的理解。" mark="⌁" reference="Tools & labs / build to learn">
      <QueueList items={items} />
    </InteriorPage>
  );
}
