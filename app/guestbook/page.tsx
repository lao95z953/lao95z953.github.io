import type { Metadata } from "next";
import Link from "next/link";
import { ShellHeader } from "../_components/ShellHeader";
import { GuestbookBoard } from "./GuestbookBoard";

export const metadata: Metadata = {
  title: "Guestbook / 留言板 — LAO_Z_3",
  description: "在 LAO_Z_3 的訪客留言板留下一張便條紙。",
};

export default function GuestbookPage() {
  return (
    <main className="page-shell guestbook-page">
      <ShellHeader />

      <section className="guestbook-hero" aria-labelledby="guestbook-title">
        <div>
          <p className="kicker">Community wall / 訪客留言板</p>
          <h1 id="guestbook-title">
            Leave a note.
            <br />
            <em>Pin it anywhere.</em>
          </h1>
        </div>
        <p>
          寫下一張便條紙，再把它貼到你喜歡的位置。這裡是訪客、CTF
          玩家與朋友共同使用的公開布告欄。
        </p>
      </section>

      <GuestbookBoard />

      <footer>
        <span>LAO_Z_3 / GUESTBOOK</span>
        <Link href="/">Return home ↖</Link>
        <span>PUBLIC GUESTBOOK / 2026</span>
      </footer>
    </main>
  );
}
