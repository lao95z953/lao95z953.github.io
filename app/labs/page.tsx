import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";

export const metadata: Metadata = {
  title: "Tools & Labs — LAO_Z_3",
  description: "LAO_Z_3 的研究工具、輔助腳本與可重現安全實驗。",
};

const repositories = [
  {
    number: "01",
    label: "PWN / 教材",
    title: "PWN Stack Labs",
    description: "給第一次接觸 PWN 的 x86-64 Linux 教材。四個 lab 從 data-only overflow、ret2win，走到 PIE code leak 與 Stack Canary 洩漏後原樣放回；執行時會直接印出當下的 stack frame，標出 buffer、Saved RBP 與返回位址。",
    href: "https://github.com/lao95z953/pwn-stack-labs",
  },
] as const;

export default function LabsPage() {
  return (
    <InteriorPage eyebrow="Collection 02 / build & test" title="Tools & Labs" intro="把可重複使用的工具與可重現的實驗放在一起：一邊建立能工作的東西，一邊用實際行為驗證自己的理解。" mark="⌁" reference="Tools & labs / build to learn">
      <h2 className="collection-section-title">Repositories / 原始碼</h2>
      <CollectionIndex items={repositories} />
    </InteriorPage>
  );
}
