import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import { InteriorPage } from "../../_components/InteriorPage";
import { getPost, getPostSlugs, tagSlug } from "../../../lib/posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) {
    return { title: "Post — LAO_Z_3" };
  }
  const { meta } = getPost(slug);
  return {
    title: `${meta.title} — LAO_Z_3`,
    description: meta.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) {
    notFound();
  }

  const { meta, content } = getPost(slug);

  return (
    <InteriorPage
      eyebrow="Post / writeups & field notes"
      title={meta.title}
      reference="Posts / one timeline"
      meta={
        <>
          {meta.date && <span className="hero-meta-date">{meta.date}</span>}
          {meta.tags.map((tag) => (
            <Link className="tag" href={`/tags/${tagSlug(tag)}/`} key={tag}>
              #{tag}
            </Link>
          ))}
        </>
      }
    >
      <article className="prose-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>

        <p className="prose-back">
          <Link href="/posts/">← 回到 Posts</Link>
        </p>
      </article>
    </InteriorPage>
  );
}
