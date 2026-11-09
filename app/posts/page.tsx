import type { Metadata } from "next";
import Link from "next/link";
import { InteriorPage } from "../_components/InteriorPage";
import { CollectionIndex } from "../_components/CollectionIndex";
import { getAllPosts, getAllTags } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Posts — LAO_Z_3",
  description:
    "LAO_Z_3 的 Writeups 與資安概念筆記，全部放在同一條時間線上，用 tag 分類。",
};

export default function PostsPage() {
  const posts = getAllPosts();
  const items = posts.map((post, index) => ({
    number: String(index + 1).padStart(2, "0"),
    tags: post.tags,
    title: post.title,
    href: `/posts/${post.slug}/`,
  }));
  const tags = getAllTags();

  return (
    <InteriorPage
      eyebrow="Collection 01 / writeups & field notes"
      title="Posts"
      reference="Posts / one timeline"
    >
      {tags.length > 0 && (
        <div className="tag-cloud" aria-label="全部 tag">
          {tags.map((tag) => (
            <Link className="tag-chip" href={`/tags/${tag.slug}/`} key={tag.slug}>
              #{tag.name}
              <span aria-label={`${tag.count} 篇`}>{tag.count}</span>
            </Link>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <>
          <h2 className="collection-section-title">Published / 已發佈</h2>
          <CollectionIndex items={items} />
        </>
      )}
    </InteriorPage>
  );
}
