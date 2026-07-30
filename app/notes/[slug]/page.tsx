import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import { InteriorPage } from "../../_components/InteriorPage";
import { getNote, getNoteSlugs } from "../../../lib/notes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getNoteSlugs().includes(slug)) {
    return { title: "Note — LAO_Z_3" };
  }
  const { meta } = getNote(slug);
  return {
    title: `${meta.title} — LAO_Z_3`,
    description: meta.summary,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!getNoteSlugs().includes(slug)) {
    notFound();
  }

  const { meta, content } = getNote(slug);

  return (
    <InteriorPage
      eyebrow={`Note / ${meta.topic || "concepts"}`}
      title={meta.title}
      intro={meta.summary}
      mark="§"
      reference="Notes / understand first"
    >
      <article className="prose-body">
        <div className="prose-meta">
          {meta.date && <span className="prose-meta-date">{meta.date}</span>}
          {meta.topic && <span className="prose-meta-cat">{meta.topic}</span>}
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

        <p className="prose-back">
          <Link href="/notes/">← 回到 Notes</Link>
        </p>
      </article>
    </InteriorPage>
  );
}
