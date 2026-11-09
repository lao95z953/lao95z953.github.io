import Link from "next/link";

type IndexItem = {
  number: string;
  label?: string;
  tags?: readonly string[];
  title: string;
  description?: string;
  href: string;
};

export function CollectionIndex({ items }: { items: readonly IndexItem[] }) {
  return (
    <div className="index-list">
      {items.map((item) => {
        const isExternal = /^https?:\/\//.test(item.href);
        const body = (
          <>
            <span className="index-number">{item.number}</span>
            {item.tags ? (
              <span className="index-label index-label-tags">
                {item.tags.map((tag) => (
                  <span className="index-tag" key={tag}>
                    #{tag}
                  </span>
                ))}
              </span>
            ) : (
              <span className="index-label">{item.label}</span>
            )}
            <span className="index-copy">
              <strong>{item.title}</strong>
              {item.description && <small>{item.description}</small>}
            </span>
            <span className="index-arrow" aria-hidden="true">↗</span>
          </>
        );

        return isExternal ? (
          <a
            className={`index-row${item.tags ? " index-row-tagged" : ""}`}
            href={item.href}
            key={item.number}
            target="_blank"
            rel="noreferrer"
          >
            {body}
          </a>
        ) : (
          <Link
            className={`index-row${item.tags ? " index-row-tagged" : ""}`}
            href={item.href}
            key={item.number}
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}
