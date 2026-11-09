import type { Metadata } from "next";
import Link from "next/link";
import { InteriorPage } from "../_components/InteriorPage";
import { getAllTags } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Tags — LAO_Z_3",
  description: "用 tag 瀏覽 LAO_Z_3 的 Writeups 與資安概念筆記。",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <InteriorPage
      eyebrow="Index 03 / tags"
      title="Tags"
      reference="Tags / many ways in"
    >
      <div className="tag-index" aria-label="全部 tag">
        {tags.map((tag) => (
          <Link className="tag-index-row" href={`/tags/${tag.slug}/`} key={tag.slug}>
            <span className="tag-index-name">#{tag.name}</span>
            <span className="tag-index-count" aria-label={`${tag.count} 篇`}>
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </InteriorPage>
  );
}
