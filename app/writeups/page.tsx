import type { Metadata } from "next";
import { InteriorPage } from "../_components/InteriorPage";
import { QueueList } from "../_components/QueueList";

export const metadata: Metadata = {
  title: "Writeups — LAO_Z_3",
  description: "LAO_Z_3 的 CTF、Pentest／PT 靶機與資安研究筆記。",
};

const items = [
  { number: "W.01", type: "CTF", title: "CTF Writeups", description: "保留題目理解、關鍵證據、失敗轉折與最終可重現的解題路徑。", status: "持續整理" },
  { number: "W.02", type: "PENTEST", title: "Pentest / Machine Writeups", description: "記錄 PT 靶機的枚舉、攻擊路徑、權限提升與修補觀察。", status: "規劃中" },
  { number: "W.03", type: "WEB / AI", title: "Web & AI Security Notes", description: "整理目前較熟悉的 Web、AI Security 實作、研究與系統安全觀察。", status: "主要領域" },
  { number: "W.04", type: "REV / PWN", title: "Rev & Pwn Learning Logs", description: "記錄程式理解、漏洞原語與 Exploit 流程的學習進度。", status: "學習中" },
] as const;

export default function WriteupsPage() {
  return (
    <InteriorPage eyebrow="Collection 01 / technical notes" title="Writeups" intro="不只 CTF。這裡也會收錄未來的 Pentest／PT 靶機 Writeups，保留我如何理解目標、哪些證據改變了判斷，以及最後的方法為什麼能夠成立。" mark="{ }" reference="Writeups / evidence first">
      <QueueList items={items} />
    </InteriorPage>
  );
}
