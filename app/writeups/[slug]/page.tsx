import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import { InteriorPage } from "../../_components/InteriorPage";
import { getWriteup, getWriteupSlugs } from "../../../lib/writeups";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getWriteupSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getWriteupSlugs().includes(slug)) {
    return { title: "Writeup — LAO_Z_3" };
  }
  const { meta } = getWriteup(slug);
  return {
    title: `${meta.title} — LAO_Z_3`,
    description: meta.summary,
  };
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!getWriteupSlugs().includes(slug)) {
    notFound();
  }

  const { meta, content } = getWriteup(slug);

  return (
    <InteriorPage
      eyebrow={`Writeup / ${meta.category || "notes"}`}
      title={meta.title}
      intro={meta.summary}
      mark="{ }"
      reference="Writeups / evidence first"
    >
      <article className="writeup-body">
        <div className="writeup-meta">
          {meta.date && <span className="writeup-meta-date">{meta.date}</span>}
          {meta.category && <span className="writeup-meta-cat">{meta.category}</span>}
          {meta.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>

        <p className="writeup-back">
          <Link href="/writeups/">← 回到 Writeups</Link>
        </p>
      </article>
    </InteriorPage>
  );
}
