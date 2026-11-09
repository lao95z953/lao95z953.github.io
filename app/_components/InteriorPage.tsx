import Link from "next/link";
import type { ReactNode } from "react";
import { ShellHeader } from "./ShellHeader";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  meta?: ReactNode;
  mark?: string;
  reference: string;
  children?: ReactNode;
};

export function InteriorPage({
  eyebrow,
  title,
  intro,
  meta,
  mark,
  reference,
  children,
}: InteriorPageProps) {
  return (
    <main className="page-shell interior-page">
      <ShellHeader />

      <section
        className={`interior-hero${mark ? "" : " interior-hero-plain"}`}
        aria-labelledby="page-title"
      >
        <aside className="margin-note" aria-hidden="true">
          <span>{reference}</span>
        </aside>
        <div className="interior-copy">
          <p className="kicker">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          {intro && <p className="intro">{intro}</p>}
          {meta && <div className="hero-meta">{meta}</div>}
        </div>
        {mark && (
          <aside className="interior-mark" aria-hidden="true">
            <span>{mark}</span>
            <small>{reference}</small>
          </aside>
        )}
      </section>

      {children && <section className="interior-content">{children}</section>}

      <footer>
        <span>LAO_Z_3 / FIELD NOTES</span>
        <Link href="/">Return home ↖</Link>
        <span>ISSUE 001 / 2026</span>
      </footer>
    </main>
  );
}
