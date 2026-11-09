import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { InteriorPage } from "../../_components/InteriorPage";
import { CollectionIndex } from "../../_components/CollectionIndex";
import { getAllTags, getPostsByTag, getTag } from "../../../lib/posts";

type Params = { tag: string };

export function generateStaticParams(): Params[] {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) {
    return { title: "Tag — LAO_Z_3" };
  }
  return {
    title: `#${found.name} — LAO_Z_3`,
    description: `標上 #${found.name} 的文章，共 ${found.count} 篇。`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) {
    notFound();
  }

  const posts = getPostsByTag(tag);
  const items = posts.map((post, index) => ({
    number: String(index + 1).padStart(2, "0"),
    tags: post.tags,
    title: post.title,
    href: `/posts/${post.slug}/`,
  }));

  return (
    <InteriorPage
      eyebrow={`Tag / ${found.count} 篇`}
      title={`#${found.name}`}
      reference="Tags / many ways in"
    >
      <CollectionIndex items={items} />

      <p className="prose-back">
        <Link href="/tags/">← 回到 Tags</Link>
      </p>
    </InteriorPage>
  );
}
