import type { Metadata } from "next";
import Link from "next/link";
import { InteriorPage } from "../_components/InteriorPage";
import { getAllPosts, getAllTags } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Tags — LAO_Z_3",
  description: "用 tag 瀏覽 LAO_Z_3 的 Writeups 與資安概念筆記。",
};

export default function TagsPage() {
  const tags = getAllTags();
  const total = getAllPosts().length;

  return (
    <InteriorPage
      eyebrow="Index 04 / tags"
      title="Tags"
      intro={`站上共 ${total} 篇文章。這裡是唯一的分類方式：一篇文章掛幾個 tag，就能從幾個方向被找到，不會因為被歸進某一區就只剩一條路徑。`}
      mark="#"
      reference="Tags / many ways in"
    >
      <div className="tag-cloud" aria-label="全部 tag">
        {tags.map((tag) => (
          <Link className="tag-chip" href={`/tags/${tag.slug}/`} key={tag.slug}>
            #{tag.name}
            <span aria-label={`${tag.count} 篇`}>{tag.count}</span>
          </Link>
        ))}
      </div>
    </InteriorPage>
  );
}
