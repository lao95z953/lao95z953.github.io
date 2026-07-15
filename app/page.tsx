import Link from "next/link";
import { ShellHeader } from "./_components/ShellHeader";
import { GuestbookBoard } from "./guestbook/GuestbookBoard";

const collections = [
  {
    number: "01",
    label: "WRITEUPS",
    mark: "{ }",
    title: "Writeups",
    href: "/writeups/",
    description: "收錄 CTF WP 以及未來的 Pentest 靶機 WP。",
  },
  {
    number: "02",
    label: "TOOLS / LABS",
    mark: "⌁",
    title: "Tools & Labs",
    href: "/labs/",
    description: "整理實驗環境以及常用腳本工具。",
  },
  {
    number: "03",
    label: "PERSONAL LOG",
    mark: "LZ3",
    title: "Reflections",
    href: "/reflections/",
    description: "記錄活動參與心得，以及我對資安、技術與成長的想法。",
  },
] as const;

const achievements = [
  {
    type: "CERT",
    title: "Google Cybersecurity",
    detail: "持有證照",
  },
  {
    type: "CTF",
    title: "MFCTF",
    detail: "第 33 名",
  },
  {
    type: "CTF",
    title: "V1TCTF",
    detail: "Solo 77 名 · Team LAO_Z_3",
  },
  {
    type: "CTF",
    title: "R3CTF",
    detail: "Solo 169 名 · Team LAO_Z_3",
  },
  {
    type: "CTF",
    title: "InfoSecCTF",
    detail: "第 4 名 · Team 帽子工廠",
  },
  {
    type: "CTF",
    title: "JuniorCryptCTF",
    detail: "第 53 名 · Team RCEs-2",
  },
  {
    type: "CTF",
    title: "BroncoCTF",
    detail: "第 49 名 · Team RCEs",
  },
] as const;

export default function Home() {
  return (
    <main className="page-shell" data-content-language="zh-Hant">
      <ShellHeader />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <aside className="margin-note" aria-hidden="true">
          <span>Field notes on security, systems &amp; software</span>
        </aside>

        <div className="hero-copy">
          <p className="kicker">Security learning log / 資安學習紀錄</p>
          <h1 id="hero-title">
            Break.
            <br />
            Understand. <em>Rebuild.</em>
          </h1>
          <p className="intro">
            我是一名仍在學習中的 CTF 玩家與開發者。目前較擅長 Web 與 AI
            Security，並正在努力學習 Reverse Engineering 與 Pwn。這裡記錄我
            如何理解問題、驗證想法，再把成果整理成可以重現的內容。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/archive/">
              Explore archive <span aria-hidden="true">→</span>
            </Link>
            <a className="text-action" href="#guestbook">
              Guestbook <span aria-hidden="true">↓</span>
            </a>
            <a
              className="text-action"
              href="https://github.com/lao95z953"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <span className="hero-index">REF. 00—A</span>
        </div>

        <aside className="profile-aside" aria-label="學習者資料">
          <div>
            <p className="specimen-label">Operator profile / 學習者檔案</p>
            <div className="seal" aria-hidden="true">
              LZ3
            </div>
            <div className="aside-line">
              <span>CALLSIGN</span>
              <strong>LAO_Z_3</strong>
            </div>
            <div className="aside-line">
              <span>STATUS</span>
              <strong>學習進行中</strong>
            </div>
            <div className="aside-line">
              <span>FOCUS</span>
              <strong>WEB / AI SEC</strong>
            </div>
          </div>

          <div className="focus-groups">
            <div className="focus">
              <p className="focus-title">STRONGER AREAS / 主要領域</p>
              <div className="tags" aria-label="主要領域">
                <span className="tag selected">Web Security</span>
                <span className="tag selected">AI Security</span>
              </div>
            </div>
            <div className="focus">
              <p className="focus-title">LEARNING NEXT / 正在學習</p>
              <div className="tags" aria-label="正在學習的領域">
                <span className="tag learning">Reverse Engineering</span>
                <span className="tag learning">Pwn</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="archive-grid" id="archive" aria-labelledby="archive-title">
        <aside className="margin-note" aria-hidden="true">
          <span>Selected work</span>
        </aside>

        <div className="collections-area">
          <div className="section-head">
            <h2 id="archive-title">Working Archive / 內容索引</h2>
            <span>03 COLLECTIONS</span>
          </div>

          <div className="cards">
            {collections.map((collection) => (
              <Link
                className="card"
                href={collection.href}
                key={collection.number}
                aria-label={`開啟${collection.title}`}
              >
                <div className="card-top">
                  <span className="card-number">{collection.number}</span>
                  <span>{collection.label}</span>
                </div>
                <div className="card-mark" aria-hidden="true">
                  {collection.mark}
                </div>
                <span className="card-status">OPEN INDEX ↗</span>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="notes" id="notes" aria-labelledby="notes-title">
          <div className="section-head achievement-head">
            <h2 id="notes-title">Achievements / 成績紀錄</h2>
            <span>UPDATED / 2026.07.14</span>
          </div>

          <div
            className="achievement-list"
            tabIndex={0}
            aria-label="成績紀錄，可垂直捲動"
          >
            {achievements.slice().reverse().map((achievement) => (
              <article className="note" key={achievement.title}>
                <time dateTime="2026">{achievement.type}<br />2026</time>
                <div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="contact" id="contact">
            <span className="contact-label">CONTACT / SOURCE</span>
            <div className="contact-links">
              <a href="mailto:lao95z953@gmail.com">Email ↗</a>
              <a
                href="https://github.com/lao95z953"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section
        className="home-guestbook"
        id="guestbook"
        aria-labelledby="home-guestbook-title"
      >
        <div className="home-guestbook-head">
          <div>
            <p className="kicker">Community wall / 訪客留言板</p>
            <h2 id="home-guestbook-title">Guestbook / 留言板</h2>
          </div>
          <div className="home-guestbook-intro">
            <p>
              寫下一張便條紙，再把它貼到你喜歡的位置。所有訪客都可以拖曳便條，
              發布前會先顯示確認視窗。
            </p>
            <Link href="/guestbook/">
              Open full page <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <GuestbookBoard />
      </section>

      <footer>
        <span>LAO_Z_3 / GUESTBOOK</span>
        <span>NO TRACKING / NO UNNECESSARY SCRIPTS</span>
        <span>ISSUE 001 / 2026</span>
      </footer>
    </main>
  );
}
