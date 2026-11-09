import Image from "next/image";
import Link from "next/link";
import { ShellHeader } from "./_components/ShellHeader";

const collections = [
  {
    number: "01",
    label: "POSTS",
    mark: "{ }",
    title: "Posts",
    href: "/posts/",
  },
  {
    number: "02",
    label: "TOOLS / LABS",
    mark: "⌁",
    title: "Tools & Labs",
    href: "/labs/",
  },
  {
    number: "03",
    label: "TAGS",
    mark: "#",
    title: "Tags",
    href: "/tags/",
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
  {
    type: "CTF",
    title: "HITCON CTF",
    detail: "第 21 名 · Team RCEs",
  },
  {
    type: "CTF",
    title: "AEGIS CTF",
    detail: "Final 第 14 名",
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
            Understand.
            <br />
            Exploit. <em>Explain.</em>
          </h1>
          <p className="intro">
            我是一名在 CTF 和 PT 的學生，目前比較擅長 Web 和 AI Sec 相關的題目，並且正在努力學習 Pwn，這裡記錄我平時比較完整的筆記與 Writeup，如果有任何寫錯的地方請直接指出。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/archive/">
              Explore archive <span aria-hidden="true">→</span>
            </Link>
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
            <p className="specimen-label">Operator profile</p>
            <div className="seal">
              <Image
                src="/images/signature.png"
                alt="LAO_Z_3 的簽名"
                width={900}
                height={767}
                priority
              />
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
              </Link>
            ))}
          </div>
        </div>

        <aside className="notes" id="notes" aria-labelledby="notes-title">
          <div className="section-head achievement-head">
            <h2 id="notes-title">Achievements / 成績紀錄</h2>
            <span>UPDATED / 2026.11.09</span>
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

      <footer>
        <span>LAO_Z_3 / FIELD NOTES</span>
        <span>NO TRACKING / NO UNNECESSARY SCRIPTS</span>
        <span>ISSUE 001 / 2026</span>
      </footer>
    </main>
  );
}
